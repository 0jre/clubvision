import { dbConnect } from '@/core/integration/connect';
import { Session } from 'next-iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronHandler } from '@/lib/session';

export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const handler: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { checkcode } = req.query;

    try {
      // Verifique a autenticação do usuário usando as sessões do Next.js, se necessário

      // Valide se o convite está presente na URL
      if (!checkcode || typeof checkcode !== 'string') {
        return res.status(400).json({ error: 'PIN inválido.' });
      }

      const isUsed = await checkAuthorizationCodeUsed(checkcode);

      if (isUsed !== null) {
        let message = '';
        if (isUsed) {
          message = 'O PIN ja foi usado';
        } else {
          message = 'PIN usado conta destravada..';
          // Se o código estiver ativo, atualize o campo codeVerified para true no MongoDB
          await setCodeVerified(checkcode);
        }
        return res.status(200).json({ codeVerified: isUsed, message });
      } else {
        return res.status(404).json(
          { error: 'Codigo não encontrado. ' });
      }
    } catch (error) {
      return res.status(500).json(
        { error: 'Erro ao verificar o código do verificação. Atualize a página, por favor!' });
    }
  } else {
    return res.status(405).end();
  }
};

const checkAuthWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await handler(req, res);
};

export default withSession(checkAuthWithSession);

async function checkAuthorizationCodeUsed(authorizationCode: string): Promise<boolean | null> {
  try {
    // Conecte-se ao MongoDB usando a função dbConnect
    const { db } = await dbConnect();

    // Consulte o MongoDB para encontrar o registro do convite com base no `authorizationCode`
    const codeRecord = await db.collection('users').findOne({ authorizationCode });

    // Se o registro for encontrado, verifique o valor do campo `codeVerified` e retorne `true` ou `false`
    if (codeRecord) {
      return codeRecord.codeVerified;
    } else {
      // Se o registro não for encontrado, retorne `null`
      return null;
    }
  } catch (error) {
    // Gerencie erros adequadamente e lance exceções, se necessário
    throw new Error('Erro ao verificar o código do verificação. Atualize a página, por favor!');
  }
}

async function setCodeVerified(authorizationCode: string): Promise<void> {
  try {
    // Conecte-se ao MongoDB usando a função dbConnect
    const { db } = await dbConnect();

    // Atualize o campo `codeVerified` para true no MongoDB com base no `authorizationCode`
    await db.collection('users').updateOne({ authorizationCode }, { $set: { codeVerified: true } });
  } catch (error) {
    // Gerencie erros adequadamente e lance exceções, se necessário
    throw new Error('Erro ao definir codeVerified como true. Atualize a página, por favor!');
  }
}
