import analyzePenaltiesAndRestrictions from '@/lib/services/analyst/searchmodlog';
import verifyIdentity from '@/lib/services/analyst/verify-stats.id';
import { encrypt } from '@/core/security/encryption';
import { dbConnect } from '@/core/integration/connect';
import type { NextApiRequest, NextApiResponse } from 'next';

// Handler para a requisição da API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ status: 'error', message: 'userId é obrigatório.' });
    }

    const { db } = await dbConnect();

    // Busca o usuário na coleção 'users'
    const user = await db.collection('users').findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Usuário não encontrado.' });
    }

    // Obtendo informações de statsaccount
    const statsaccount = user.statsaccount || {};
    const contentViolationWords = Array.isArray(statsaccount.contentViolationWords)
      ? statsaccount.contentViolationWords
      : [];

    // Processar a verificação do usuário
    const identityStatus = await verifyIdentity(userId);
    const penaltiesStatus = await analyzePenaltiesAndRestrictions(userId);
    const hasContentViolation =  contentViolationWords.length > 0;
  
    const message = hasContentViolation
      ? 'Foram encontradas e removidas palavras impróprias.'
      : 'Nenhum conteúdo impróprio foi encontrado.';
  
    // Construindo o resultado
    const result = {
      userId,
      identityVerification: identityStatus,
      penaltiesStatus,
      contentViolationStatus: {
         message: message,
         status: hasContentViolation,
        details: contentViolationWords
      }
    };

    // Encriptar o resultado
    const enc = encrypt(JSON.stringify(result));

    return res.status(200).json({
      status: 'success',
      message: 'Status do usuário processado com sucesso.',
      result: enc,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Erro ao processar o status do usuário.',
      error: error.message,
    });
  }
}
