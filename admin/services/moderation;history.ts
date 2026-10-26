
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { dbConnect, searchmodlog } from '@/core/integration/connect';

export async function Delete_History(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const { db } = await dbConnect();
      const collection = db.collection(searchmodlog);
      const result = await collection.deleteOne({ _id: new ObjectId(id as string) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'historico not found' });
      }

      res.status(200).json({ message: 'historico deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting historico' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export async function HistoryView(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const userId = req.query.userId; // Obtém o ID do usuário dos parâmetros de consulta
            
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            
            const { db } = await dbConnect();
            const collection = db.collection('mod-logs');
            
            // Usando toArray() para converter o cursor em uma array de documentos
            const historico = await collection.find({ member_id: userId }).toArray();

            
            res.status(200).json(historico);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching history' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
