import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { dbConnect_Mongo } from "@/core/integration/db.mongoose";
/**
 * Update or create a product price.
 * @param price - Stripe price data.
 */
const upsertPrice = async (price: Stripe.Price) => {
  const {
    id,
    active,
    currency,
    nickname,
    type,
    unit_amount,
    recurring,
    metadata,
  } = price;

  const data = {
    id,
    product_id: typeof price.product === "string" ? price.product : "",
    active,
    currency,
    description: nickname ?? undefined,
    type,
    unit_amount,
    interval: recurring?.interval,
    interval_count: recurring?.interval_count,
    trial_period_days: recurring?.trial_period_days,
    metadata,
  };

  try {
 
    // Successfully upserted
    console.log(`Price inserted/updated: ${price.id}`);
  } catch (error: any) {
    console.log(error);
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const data = (await getSession({ req }))
  const { method } = req;

  await dbConnect_Mongo();

  switch (method) {
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export { upsertPrice };

export default handler;
