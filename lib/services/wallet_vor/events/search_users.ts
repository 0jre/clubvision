import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect, InformationsUsers } from '@/core/integration/connect';


export async function SearchUsers (req: NextApiRequest, res: NextApiResponse)  {
  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Nome é obrigatório.' });
  }

  try {
    const { db } = await dbConnect();
    const user = await db.collection(InformationsUsers).findOne({ discriminator: name }); // Busca exata por um único usuário

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Retorna o usuário em um array, como se fosse um mapeamento
    res.status(200).json({ users: user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
};

 
