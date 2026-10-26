import { dbConnect } from '@/core/integration/connect';
import { Session } from 'next-iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronHandler } from '@/lib/session';

export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const handler: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { checkinvite } = req.query;

    try {
      
      // Valide se o convite está presente na URL
      if (!checkinvite || typeof checkinvite !== 'string') {
        return res.status(400).json({ error: 'Convite inválido.' });
      }

      const isUsed = await checkInviteCodeUsed(checkinvite);

      if (isUsed !== null) {
        let message = '';
        if (isUsed) {
          message = 'O código foi usado.';
        } else {
          message = 'Código ativo.';
        }
        return res.status(200).json({ used: isUsed, message });
      } else {
        return res.status(404).json({ error: 'Convite não encontrado. ' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao verificar o código do convite. Atualize a pagina!' });
    }
  } else {
    return res.status(405).end();
  }
};

const checkAuthWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await handler(req, res);
};

export default withSession(checkAuthWithSession);

async function checkInviteCodeUsed(inviteCode: string): Promise<boolean | null> {
  try {
    // Conecte-se ao MongoDB usando a função dbConnect
    const { db } = await dbConnect();

    // Consulte o MongoDB para encontrar o registro do convite com base no `inviteCode`
    const codeRecord = await db.collection('cla').findOne({ inviteCode });

    // Se o registro for encontrado, verifique o valor do campo `used` e retorne `true` ou `false`
    if (codeRecord) {
      return codeRecord.used;
    } else {
      // Se o registro não for encontrado, retorne `null`
      return null;
    }
  } catch (error) {
    // Gerencie erros adequadamente e lance exceções, se necessário
    throw new Error('Erro ao verificar o código do convite. Atualize a pagina!');
  }
}
