// pages/api/guestsList.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;

  try {
    const { db } = await dbConnect();

    // Aqui você busca todos os documentos na coleção "convidados" associados ao userId
    const guests = await db.collection('convidados-cla').find({ id: userId }).toArray();

    if (!guests || guests.length === 0) {
      return res.status(200).json({ guests: [] }); // Retorna uma lista vazia se nenhum convidado for encontrado
    }

    // Retorna a lista de convidados associados ao userId
    return res.status(200).json({ guests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ocorreu um erro ao buscar as informações dos convidados.' });
  }
};
