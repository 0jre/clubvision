// pages/api/inventory/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';

interface InventoryItem {
  [key: string]: number;
}

type Data = {
  success: boolean;
  message: string;
  inventory?: InventoryItem;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, message: 'User ID inválido' });
    }

    try {
      const { db } = await dbConnect();
      const userInventory = await db.collection('inventory').findOne<InventoryItem>({ userId });

      if (!userInventory) {
        return res.status(404).json({ success: false, message: 'Inventário não encontrado' });
      }

      // Filtrar apenas os campos que representam itens do inventário, excluindo _id e userId
      const filteredInventory = Object.fromEntries(
        Object.entries(userInventory).filter(
          ([key]) => key !== '_id' && key !== 'userId'
        )
      );

      res.status(200).json({
        success: true,
        message: 'Inventário encontrado',
        inventory: filteredInventory,
      });
    } catch (error) {
      console.error('Erro ao buscar o inventário:', error);
      res.status(500).json({ success: false, message: 'Erro ao buscar o inventário' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Método não permitido' });
  }
}
