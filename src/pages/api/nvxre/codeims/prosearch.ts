import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect, InformationsUsers } from '@/core/integration/connect';
import { encrypt } from "@/core/security/encryption";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId as string;
 
  // Verifica se o userId é uma string não vazia
  if (!userId) {
    
    console.error('Invalid userId:', userId);
    return res.status(400).json({ message: 'Invalid userId' });
  }

   if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();
      const collection = db.collection(InformationsUsers);

      // Consulta todos os registros associados ao userId e os embaralha aleatoriamente
      const userPosts = await collection.aggregate([{ $match: { id: userId } }, { $sample: { size: 1000 } }]).toArray();
      const nvxcrypted = encrypt(JSON.stringify(userPosts));
      res.status(200).json(nvxcrypted);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ message: 'Error fetching user posts' });
    }
  } else {
    console.error('Method not allowed:', req.method);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
