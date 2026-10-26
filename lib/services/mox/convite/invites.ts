
import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect, GuestUser } from '@/core/integration/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { UserId } = req.query;

    try {
      if (!UserId) {
        return res.status(400).json({ message: 'Missing UserId parameter' });
      }

      const { db } = await dbConnect();
      const collection = db.collection(GuestUser);

      // Realiza a busca pelo UserId
      const result = await collection.findOne({ UserId: UserId });

      if (result) {
        return res.status(200).json(result);
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error searching user' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}