import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from "@/core/integration/connect";

export async function CheckList(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();
      const usersCollection = db.collection('users');
      const countUsers = await usersCollection.countDocuments();

      const lastUser = await usersCollection
        .find()
        .sort({ _id: -1 }) 
        .limit(1) 
        .project({ name: 1 })
        .toArray(); 

      const lastUserName = lastUser.length > 0 ? lastUser[0].name : 'Nenhum usuário registrado';

    
      res.status(200).json({ count: countUsers, lastUserName });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
