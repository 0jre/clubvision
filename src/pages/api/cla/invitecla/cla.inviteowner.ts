// api/getInviteOwner.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { inviteCode } = req.query;

  try {
    const { db } = await dbConnect();

    // Aqui você busca o documento com base no código do convite
    const inviteDocument = await db.collection('cla').findOne({ inviteCode });

    if (!inviteDocument) {
      return res.status(400).json({ error: 'Convite não encontrado.' });
    }

    // Aqui você busca o nome do proprietário do convite com base no userId
    const ownerDocument = await db.collection('users').findOne({ _id: inviteDocument.userId });

    if (!ownerDocument) {
      return res.status(400).json({ error: 'Proprietário não encontrado.' });
    }

    // Retorna o nome do proprietário
    return res.status(200).json({ userName: ownerDocument.name, Avatare: ownerDocument.avatar });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ocorreu um erro ao buscar o proprietário do convite.' });
  }
};
