import { NextIronRequest, withSession } from "@/lib/session";
import { NextApiResponse } from "next";
import { stripe } from "@/lib/oauth/stripe/stripe";
import { getURL } from "@/lib/oauth/stripe/getURL";
import { dbConnect_Mongo } from "@/core/integration/db.mongoose";
import ROUTENVX from "@/routes/routes";

const handler = async (req: NextIronRequest, res: NextApiResponse): Promise<void> => {
  try {
    const user = req.session.get('user');

    if (!user) {
      res.redirect('/home'); // Redirects the user to the login page
      return;
    }

    const { method } = req;
    const { body } = req;
    const { amount, priceId, quantity, metadata={ amount } , mode } = body; // Adiciona o modo

    if (!priceId) {
      res.status(400).json({ error: "Price ID is not defined" });
      return;
    }


    const formatCurrency = (value: number): string => {
      return value.toLocaleString('en-US', {
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    const updatedMetadata = {
      ...metadata,
      userId: user.id,
      
      userEmail: user.email, // Adds the user's email to the metadata
      quantity: metadata.amount,
      mode: mode,
    };

    let stripeSession;

    if (mode === 'subscription') {
      // Criar sessão para assinaturas
      stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "boleto" ],
        customer_email: user.email,
        line_items: [
          {
            price: priceId,
            quantity,
          },
        ],
        mode: "subscription",
        allow_promotion_codes: true,
        metadata: updatedMetadata,
        subscription_data: {
          metadata: updatedMetadata,
        },
        success_url: `${getURL()}${ROUTENVX.Dashboard}`,
        cancel_url: `${getURL()}${ROUTENVX.storePrime}`,
      });
    }  else if (mode === 'purchase') {
      // Calcular o preço total em centavos baseado na quantidade de bits
      const pricePerBit = 0.013; // R$ 0,013 por Bit
      const totalPriceInCents = Math.round(quantity * pricePerBit * 100); // Preço total em centavos
  
      // Verificar se o preço total é menor que o mínimo permitido
      if (totalPriceInCents < 1300) {
          res.status(400).json({ error: "O valor mínimo de compra é R$13,00" });
          return;
      }
  
      // Criar sessão para compras de bits
      stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
      payment_method_options: {
       boleto: {
      expires_after_days: 7
      }
     },
          customer_email: user.email,
          line_items: [
              {
                  price_data: {
                      currency: 'brl',
                      product_data: {
                          name: 'Bits', // Defina o nome do produto como um item digital
                          description: `A quantidade de bits a ser adquirida é de ${formatCurrency(quantity)} Bits, e com o bônus, o total fica em ${formatCurrency(metadata.amount)} Bits, destinado ao uso no jogo. `,
                      },
                      unit_amount: totalPriceInCents, // Preço total em centavos
                  },
                  quantity: 1, // A quantidade é 1 porque o valor total já foi calculado com base nos bits
              },
          ],
          mode: "payment", // Muda o modo para pagamento
          allow_promotion_codes: true,
          metadata: updatedMetadata, // Inclui a quantidade de bits e outros metadados
          success_url: `${getURL()}${ROUTENVX.wallet}`,
          cancel_url: `${getURL()}${ROUTENVX.payaddfund}`,
      });
  } else {
      res.status(400).json({ error: "Invalid mode specified" });
      return;
  }
  
    // Connect to the database
    await dbConnect_Mongo();

    switch (method) {
      case "POST":
        res.status(200).json({ sessionId: stripeSession.id, url: stripeSession.url });
        break;
      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

export default withSession(handler);
