import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { dbConnect, postVisionCollection } from '@/core/integration/connect';

const XP_PER_LIKE = 15; // XP ganho por cada like dado

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const { db } = await dbConnect();
    const collection = db.collection(postVisionCollection);
    const memberStatsCollection = db.collection('member-stats');

    if (req.method === 'PUT') {
      const userId = req.query.userId || req.body.userId;

      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }

      if (req.body.action === 'like') {
        // Adicione o ID do usuário à lista likedBy no documento do vídeo.
        const updateResult = await collection.updateOne(
          { _id: new ObjectId(id as string) },
          { $addToSet: { likedBy: userId } }
        );

        if (updateResult.modifiedCount === 1) {
          // Incrementa o XP do usuário em 'member-stats' após o like
          await memberStatsCollection.updateOne(
            { member_id: userId },
            { $inc: { 
              clubactivity:XP_PER_LIKE,
              xp: XP_PER_LIKE } }
          );
        }

        res.status(200).json({ message: 'Like added successfully' });
      } else if (req.body.action === 'unlike') {
        // Remova o ID do usuário da lista likedBy no documento do vídeo.
        await collection.updateOne(
          { _id: new ObjectId(id as string) },
          { $pull: { likedBy: userId } }
        );

        res.status(200).json({ message: 'Like removed successfully' });
      } else {
        res.status(400).json({ message: 'Invalid action' });
      }
    }
    // ... (restante do código)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error performing action' });
  }
}
