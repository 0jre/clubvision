import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';
import { encrypt } from "@/core/security/encryption";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;

  try {
    const { db } = await dbConnect();
    const collection = db.collection('subscriptions');
    
    const subscription = await collection.findOne({ userId: userId });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    const nvxcrypted = encrypt(JSON.stringify(subscription));
    return res.status(200).json({ subscription: nvxcrypted });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
