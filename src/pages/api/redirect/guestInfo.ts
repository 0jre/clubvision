// pages/api/guestInfo.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { inviteCode } = req.query;

  try {
    const { db } = await dbConnect();

    // Aqui você busca o documento com base no código do convite
    const inviteDocument = await db.collection('reforms').findOne({ inviteCode });

    if (!inviteDocument) {
      return res.status(400).json({ error: 'Convite não encontrado.' });
    }

    // Aqui você busca as informações do usuário convidado com base no userId
    const guestDocument = await db.collection('convidados').findOne({ _id: inviteDocument.userId });

    if (!guestDocument) {
      // Check if a record with the same id and Iduser already exists
      const existingRecord = await db.collection('convidados').findOne({
        id: inviteDocument.userId,
        Iduser: req.body.Iduser,
      });

      if (existingRecord) {
        return res.status(400).json({ error: 'Já existe um registro com o mesmo id e Iduser.' });
      }

      // Se as informações do convidado não forem encontradas, crie um novo registro
      await db.collection('convidados').insertOne({
        id: inviteDocument.userId,
        Iduser: req.body.Iduser,
      });

      // Agora, busque novamente as informações do convidado
      const newGuestDocument = await db.collection('convidados').findOne({ _id: inviteDocument.userId });

      // Verifique se as informações do convidado foram encontradas desta vez
      if (!newGuestDocument) {
        return res.status(400).json({ error: 'Não foi possível criar ou encontrar as informações do convidado.' });
      }

      // Retorna as informações do convidado
      return res.status(200).json({
        userName: newGuestDocument.userName,
        avatar: newGuestDocument.avatar,
        ownerId: inviteDocument.userId,
      });
    }

    // Retorna as informações do convidado se já existirem
    return res.status(200).json({
      userName: guestDocument.userName,
      avatar: guestDocument.avatar,
      ownerId: inviteDocument.userId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ocorreu um erro ao buscar as informações do convidado.' });
  }
};
