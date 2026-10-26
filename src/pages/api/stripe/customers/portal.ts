// pages/api/stripe/portal.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from "@/lib/oauth/stripe/stripe";
import { getURL } from "@/lib/oauth/stripe/getURL";
import ROUTENVX from '@/routes/routes';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customer_id } = req.body;

    if (!customer_id) {
      return res.status(400).json({ error: "Customer ID is required." });
    }

    const { url } = await stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: `${getURL()}/${ROUTENVX.centralsubscription}`,
    });

    return res.status(200).json({ url });
  } catch (error: any) {
    console.error(`❌ Error message: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};
