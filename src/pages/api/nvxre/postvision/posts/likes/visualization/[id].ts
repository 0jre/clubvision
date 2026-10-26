// Sua rota para obter informações dos usuários que deixaram like em um vídeo
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { dbConnect, postVisionCollection, InformationsUsers } from '@/core/integration/connect';

interface UserInfo {
  id: string;
  name: string;
  avatar: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const { db } = await dbConnect();
    const visiontv = db.collection(postVisionCollection);
    const users = db.collection(InformationsUsers);

    if (req.method === 'GET') {
      // Obtenha a lista de IDs dos usuários que deixaram like no vídeo
      const videoLikes = await visiontv.findOne(
        { _id: new ObjectId(id as string) },
        { projection: { likedBy: 1 } }
      );

      if (!videoLikes) {
        res.status(404).json({ message: 'Video not found' });
        return;
      }

      // Obtenha informações dos usuários que deixaram like
      const likedUsersInfo: UserInfo[] = await users
        .find({ id: { $in: videoLikes.likedBy } })
        .project({ id: 1, name: 1, avatar: 1 })
        .toArray() as UserInfo[];

      res.status(200).json(likedUsersInfo);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching liked users' });
  }
}
