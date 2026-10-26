import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'Parâmetro "userId" é obrigatório.' });
  }

  try {
    const { db } = await dbConnect();

    // Busca o inventário do usuário com base no userId
    const userInventory = await db.collection('inventory').findOne({ userId });

    if (!userInventory) {
      return res.status(404).json({ message: 'Inventário não encontrado para o usuário.' });
    }

    // Recupera os dados dos arrays faixaclubr e avatarcubr
    const faixaclubrRecords = userInventory.faixaclubr || [];
    const avatarcubrRecords = userInventory.avatarcubr || [];

    // Retorna os dados encontrados
    return res.status(200).json({
      success: true,
      faixaclubr: faixaclubrRecords,
      avatarcubr: avatarcubrRecords,
    });
  } catch (error: any) {
    console.error('Erro ao buscar registros:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
}
