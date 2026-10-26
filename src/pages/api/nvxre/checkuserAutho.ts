import { dbConnect } from '@/core/integration/connect';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId || Array.isArray(userId)) {
        return res.status(400).json({ error: 'ID de usuário inválido.' });
      }

      const { db } = await dbConnect();
       
      // Consulte o MongoDB para encontrar o registro do usuário com base no `_id`
      const userRecord = await db
        .collection('users')
        .findOne({ id: userId }, { projection: { _id: 0 } });

      if (userRecord) {
        const { codeVerified } = userRecord;
        return res.status(200).json({ codeVerified });
      } else {
        return res.status(200).json({ codeVerified: null });
      }
    } catch (error) {
      console.error('Erro ao verificar o estado do codeVerified:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    return res.status(405).end();
  }
};
