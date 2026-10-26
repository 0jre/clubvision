import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { dbConnect, GuestUser } from '@/core/integration/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { Invite } = req.query;

    try {
      const { db } = await dbConnect();
      const collection = db.collection(GuestUser);
      const result = await collection.deleteOne({ _id: new ObjectId(Invite as string) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Invite not found' });
      }

      res.status(200).json({ message: 'Invite deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting video' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
