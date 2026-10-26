import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect, InformationsUsers } from '@/core/integration/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId as string;
 

  // Verifica se o userId é uma string não vazia
  if (!userId) {
    console.error('Invalid userId:', userId);
    return res.status(400).json({ message: 'Invalid userId' });
  }

  if (req.method === 'POST') {
    // Lógica para criar um novo post
     

  } else if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();
      const collection = db.collection(InformationsUsers);
      const collectionX = db.collection('reforms');
      // Consulta o usuário específico com base no userId
      const user = await collection.findOne({ id: userId });
      const userX = await collectionX.findOne({ userId: userId });

      if (!user ) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!userX ) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Adicione as informações do avatar e do nome ao objeto de resposta
      const responseData = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        namecharacter: userX.NameCharacter,
        nvrp:userX.nvrp,
        nvxre:userX.nvxre,
        verified:userX.verified,
        BioLi: userX.BioLi,
      };

      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Error fetching user' });
    }
  } else { 
    console.error('Method not allowed:', req.method);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
