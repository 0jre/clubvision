import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect, postVisionCollection } from '@/core/integration/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId as string;

  console.log('Received request with userId:', userId);

  // Verifica se o userId é uma string não vazia
  if (!userId) {
    console.error('Invalid userId:', userId);
    return res.status(400).json({ message: 'Invalid userId' });
  }

  if (req.method === 'POST') {
    // Lógica para criar um novo post
    console.log('Received POST request');

  } else if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();
      const collection = db.collection(postVisionCollection);

      // Consulta todos os registros associados ao userId e os embaralha aleatoriamente
      const userPosts = await collection.aggregate([{ $match: { userId: userId } }, { $sample: { size: 1000 } }]).toArray();

      res.status(200).json(userPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ message: 'Error fetching user posts' });
    }
  } else {
    console.error('Method not allowed:', req.method);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
