import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect , generateInviteCode } from '@/core/integration/connect';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { discordUserId } = req.body;

    try {
      const { client, db } = await dbConnect();
      const collection = db.collection('reforms');

      // Verifique se o usuário já possui um código de convite
      const existingUser = await collection.findOne({ userId: discordUserId });

      if (existingUser && existingUser.inviteCode) {
        // Remova o código de convite antigo e marque como usado (used: true)
        await collection.updateOne({ userId: discordUserId }, { $unset: { inviteCode: '', used: '' } });
      }

      // Gere um novo código de convite

      const generatedInviteCode = generateInviteCode(); // Implemente sua lógica de geração aqui

      // Atualize o usuário com o novo código de convite
      await collection.updateOne({ userId: discordUserId }, { $set: { inviteCode: generatedInviteCode } });

      return res.status(200).json({ code: generatedInviteCode });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao gerar o código de convite.' });
    }
  } else {
    return res.status(405).end();
  }
};