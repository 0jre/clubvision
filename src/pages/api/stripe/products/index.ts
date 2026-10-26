import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { ProductWithPrice } from "@/types/stripe";

// Atualizando a definição de Price
interface Price {
  id: string;
  product_id: string | Stripe.Product | Stripe.DeletedProduct;
  active: boolean;
  description: string | null;
  unit_amount: number | null;
  currency: string;
  type: 'one_time' | 'recurring';
  interval?: 'day' | 'week' | 'month' | 'year';
  interval_count?: number;
  metadata: Stripe.Metadata;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2024-04-10",
});

const getActiveProductsWithPrices = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<ProductWithPrice[] | void> => {
  try {
    const products = await stripe.products.list({ active: true });

    const formattedProducts: ProductWithPrice[] = [];

    for (const product of products.data) {
      const prices = await stripe.prices.list({ product: product.id, active: true });
      const formattedPrices: Price[] = prices.data.map((price: Stripe.Price) => ({
        id: price.id,
        product_id: price.product,
        active: price.active,
        description: price.nickname,
        unit_amount: price.unit_amount,
        currency: price.currency,
        type: price.type,
        interval: price.recurring?.interval,
        interval_count: price.recurring?.interval_count,
        metadata: price.metadata,
      }));

      const formattedProduct: ProductWithPrice = {
        id: product.id,
        name: product.name,
        description: product.description, // Garantir que a descrição não seja null
        images: product.images,
        metadata: product.metadata,
        prices: formattedPrices,
        active: false,
      };

      formattedProducts.push(formattedProduct);
    }

    return res.status(200).json(formattedProducts);
  } catch (error: any) {
    console.error(`❌ Error message: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "GET":
      return getActiveProductsWithPrices(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
