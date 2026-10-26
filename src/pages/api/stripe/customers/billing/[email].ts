import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';
import { encrypt } from "@/core/security/encryption";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.query;

  try {
    const { db } = await dbConnect();
    const collection = db.collection('checkout_sessions');
    
    const subscriptions = await collection
      .find({ customer_email: email })
      .sort({ created: -1 }) // Ordena por 'created' em ordem decrescente
      .toArray();

    if (subscriptions.length === 0) {
      return res.status(404).json({ error: 'No billing records found' });
    }
    const nvxcrypted = encrypt(JSON.stringify(subscriptions));
    return res.status(200).json({ subscriptions: nvxcrypted });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
