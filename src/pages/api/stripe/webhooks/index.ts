import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";
import Stripe from "stripe";
import { dbConnect, reformsCollectionName } from "@/core/integration/connect";
import { stripe } from "@/lib/oauth/stripe/stripe";
import { ObjectId } from 'mongodb';
import { upsertPrice } from "../prices";
import upsertProduct from "../products";
 
export const config = {
  api: {
    bodyParser: false,
  },
};

interface Item {
  _id: string; 
}

interface Transaction {
  date: string;
  time: string;
  bits?: number;
  amount?: number;
  action: string;
  currency: string;
  timestamp: Date
}

interface UpdateData {
  verified?: boolean;
  prime: boolean;
  typeprime: string;
  keygreen: boolean;
  viewprime: boolean;
  unic: string;
  type?: string; // 'type' é opcional
}

const buffer = async (readable: Readable) => {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};
 
type ContainerTypes = 
| 'containermarcos'
| 'containerbig'
| 'containersheriff'
| 'containerbarbara'
| 'containerbigode'
| 'containerjason'
| 'containermagnata'
| 'containerasyc';


const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
]);

 
const handleWebhooks = async (req: NextApiRequest, res: NextApiResponse) => {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (error: any) {
    console.log(`❌ Error message: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  const { type, data } = event;
  const { db } = await dbConnect();
 
  if (relevantEvents.has(type)) {
    try {
      switch (type) {
        case "product.created":
        case "product.updated":
          await upsertProduct(req, res);
          break;

        case "price.created":
        case "price.updated":
          await upsertPrice(data.object as Stripe.Price);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = data.object as Stripe.Subscription;
          const userId = subscription.metadata?.userId;
          const reformsCollection = db.collection(reformsCollectionName);
         
           const notificationsCollection = db.collection('notifications');
          const typeox = subscription.metadata?.typeox;
          const isTypeoxBoolean = Boolean(subscription.metadata?.typeox == 'Plus' ? true : false);

          if (!userId) {
            throw new Error("UserId not found in subscription metadata");
          }

          const subscriptionData = {
            email: subscription.metadata.userEmail,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            cancel_at_period_end: subscription.cancel_at_period_end,
            cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            created: new Date(subscription.created * 1000),
            ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
            trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
            customer_id: subscription.customer,
          };

      
          if (subscription.status == 'active') {
           
            await db.collection<Item>('items').updateOne(
              { _id: userId  },
              { $inc: { coins: 16000, bits: 2000,vpoints: 100 } },
              { upsert: true }
            );
            
            const notification = {
              userId,
              type: 'transaction',
              title: 'Notificação de Carteira',
              message: 'Você recebeu um total de 2.000 Bits + 16.000 Orbits e 100 V-Points pela aquisição do Prime.',
              timestamp: new Date(),
            };
            
            await notificationsCollection.insertOne(notification);
            
            const timestamp = new Date();
            const transaction: Transaction = {
              date: timestamp.toLocaleDateString(),
              time: timestamp.toLocaleTimeString(),
              timestamp: new Date(),
              amount: 16000,
              action: `receive_orbs`,
              currency: `coins`,
            };
            
      
              await db.collection<Item>('items').updateOne(
                  {  _id: userId  },
              { 
                $push: { transactions: { $each: [transaction] } } // Adiciona múltiplas transações corretamente
              }
            );

            let customerId: string;

            if (typeof subscription.customer === 'string') {
              customerId = subscription.customer.replace("cus_", "club_");
            } else {
              // Se não for uma string, trate conforme necessário
              customerId = ''; // ou algum outro valor que você queira
            }

            const updateData: UpdateData = {
             
              prime: true,
              typeprime: typeox,
              keygreen: isTypeoxBoolean,
              viewprime: isTypeoxBoolean == true && true,
              unic: customerId
            };
            
            // Adicionar 'type' somente se 'typeox' for verdadeiro
            if (typeox == 'Plus') {
              updateData.type = 'Authorized';
      
            } 

              // Atualizar ou inserir o documento nas coleções 'reforms' e 'items'
            await reformsCollection.updateOne(
            { userId: userId },
            { $set: updateData },
            { upsert: true }
          );

          }

          await db.collection('subscriptions').updateOne(
            { userId: userId },
            { $set: subscriptionData },
            { upsert: true }
          );

          if (type === "customer.subscription.deleted") {
            // Remover customer_id e outros dados relacionados
            await db.collection('checkout_sessions').updateOne(
              { customer_id: subscription.customer },
              { $set: { 
                customer_id: 'undefined', 
                
               },
            },
             
            );
            await db.collection('subscriptions').updateOne(
              { userId: userId },
              { $unset: { 
               current_period_end: null,
               customer_id: null,
               }, 
              },
              )
                 // Atualizar ou inserir o documento nas coleções 'reforms' e 'items'
                 await reformsCollection.updateOne(
                  { userId: userId },
                  { $set: { 
                    verified: type !== "customer.subscription.deleted",
                    prime: type !== "customer.subscription.deleted",
                    selo:  type !== "customer.subscription.deleted",
                    typeprime: type !== "customer.subscription.deleted",
                    keygreen: type !== "customer.subscription.deleted",
                    viewprime: type !== "customer.subscription.deleted",
                    accessinvite: type !== "customer.subscription.deleted",
                   }},
                  { upsert: true }
                );

             await db.collection<Item>('items').updateOne(
                  {  _id: userId  },
              { $set: { 
                   lock: true,
                   }, 
             },
            )
          }

         
          case "checkout.session.completed":
            case "checkout.session.expired":
            case "invoice.finalized":
            case "invoice.payment_failed":
            case "payment_intent.created":
            case "payment_intent.succeeded":
            case "invoice.payment_succeeded":
                case "payment_intent.canceled":
                case "payment_intent.processing":
                case "payment_intent.requires_action":
                case "payment_intent.payment_failed":
                case "payment_intent.partially_funded":
            case "checkout.session.async_payment_failed":
            case "checkout.session.async_payment_succeeded":
                const checkoutSession = data.object as Stripe.Checkout.Session;
                const invoice = data.object as Stripe.Invoice;
         
                const UserId = checkoutSession.metadata?.userId;
                const Id = checkoutSession.id;
                const paymentIntentId = invoice.payment_intent ? invoice.payment_intent : checkoutSession.payment_intent;
                const Customer =  typeof checkoutSession.customer === 'string' ? checkoutSession.customer : checkoutSession.payment_intent 
            
                const existingData = await db.collection('checkout_sessions').findOne({ customer_id: Customer });
            
                function mapCheckoutStatus(status: string): string {
                    switch (status) {
                        case 'paid':
                            return 'complete'; // Mapeia "paid" para "complete"
                        case 'unpaid':
                        case 'no_payment_required':
                            return 'open'; // Mapeia "unpaid" ou "no_payment_required" para "open"
                        case 'canceled':
                            return 'expired'; // Mapeia "canceled" para "expired"
                        default:
                            return status; // Retorna um valor padrão para status não esperados
                    }
                }
             
                // Dados básicos do checkout.session
                const sessionData: {
                    currency?: string | null;
                    checkout?: string | null;
                    customer_email?: string | null;
                    payment_status?: string | null;
                    status_ione?: string | null;
                    amount_total?: number | null;
                    amount_subtotal?: number | null;
                    customer_id?: string | null;
                    created?: Date | null;
                    methodpay?: string | null;
                    method_type?: string | null;
                    boleto_url?: string | null;
                    boleto_expiration_date?: Date | null;
                    boleto_status?: string | null;
                    hosted_invoice_url?: string | null;
                    type_pay?: string | null;
                    mnc?: string | null;
                    userid?: string | null;
                } = {
                    userid: UserId,
                    checkout: Id,
                    currency: checkoutSession.currency || existingData?.currency,
                    customer_email: checkoutSession.customer_details?.email || existingData?.customer_email,
                    payment_status: checkoutSession.payment_status || existingData?.payment_status,
                    status_ione: mapCheckoutStatus(checkoutSession.status || existingData?.status),
                    amount_total: checkoutSession.amount_total || existingData?.amount_total,
                    amount_subtotal: checkoutSession.amount_subtotal || existingData?.amount_subtotal,
                    customer_id: typeof checkoutSession.customer === 'string' ? checkoutSession.customer : checkoutSession.payment_intent ? checkoutSession.payment_intent : existingData?.customer_id,
                    created: new Date(checkoutSession.created * 1000) || existingData?.created,
                    hosted_invoice_url: invoice.hosted_invoice_url || existingData?.hosted_invoice_url,
                    methodpay: existingData?.methodpay,
                    boleto_url: existingData?.boleto_url,
                    boleto_expiration_date: existingData?.boleto_expiration_date,
                    boleto_status: existingData?.boleto_status,
                   
                };
               
              
              
           
                // Se houver um `paymentIntentId`, vincule mais informações ao mesmo documento
                if (typeof paymentIntentId === 'string') {
                    try {
                        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            
                        if (paymentIntent.payment_method) {
                            if (typeof paymentIntent.payment_method !== 'string' && paymentIntent.payment_method.id) {
                                sessionData.methodpay = paymentIntent.payment_method.id || sessionData.methodpay;
                            } else if (typeof paymentIntent.payment_method === 'string') {
                                sessionData.methodpay = paymentIntent.payment_method || sessionData.methodpay;
                            }
                        }
            
                        const boleto = paymentIntent.next_action?.boleto_display_details;
                        
                        sessionData.boleto_url = boleto?.hosted_voucher_url || sessionData.boleto_url;
                        sessionData.boleto_expiration_date = boleto?.expires_at
                            ? new Date(boleto.expires_at * 1000)
                            : sessionData.boleto_expiration_date;
            
                           
                        switch (paymentIntent.status) {
                            case 'succeeded':
                                sessionData.boleto_status = 'paid';
                                break;
                            case 'requires_action':
                                sessionData.boleto_status = 'requires_action';
                                break;
                            case 'processing':
                                sessionData.boleto_status = 'pending';
                                break;
                            case 'canceled':
                                sessionData.boleto_status = 'canceled';
                                break;
                            default:
                                sessionData.boleto_status = sessionData.boleto_status || 'falhou';
                        }
                      
      if (invoice) {
        if (paymentIntent.status === 'succeeded') {
            sessionData.status_ione = 'complete';
            sessionData.payment_status = 'paid';
            sessionData.boleto_status = 'paid';
        }
  
        if (paymentIntent.status === 'processing') {
            sessionData.status_ione = 'processing';
            sessionData.payment_status = 'processing';
            sessionData.boleto_status = 'processing';
        }
        if (paymentIntent.status === 'canceled') {
          sessionData.status_ione = 'canceled';
          sessionData.payment_status = 'canceled';
          sessionData.boleto_status = 'canceled';
      }
         
    }
                    } catch (error) {
                        console.error("Erro ao recuperar PaymentIntent:", error);
                    }
                } else {
                    console.log('PaymentIntent ID não encontrado ou inválido');
                }
            
    
            
                // Atualize ou insira o documento no banco de dados usando o `customer_id` atual
                await db.collection('checkout_sessions').updateOne(
                    { customer_id: Customer }, // Use `customer_id` como chave única
                    { $set: { ...existingData, ...sessionData } }, // Faz merge com dados existentes
                    { upsert: true } // Atualiza se existir, insere se não existir
                );
  
  
     
    
              
      if (checkoutSession.payment_status === 'paid' && checkoutSession.metadata?.mode === 'purchase') {
                  
     // Verifica se amount_total é válido
     const amountTotal = checkoutSession.amount_total;
     const bitsQuantity = Math.round(Number(checkoutSession.metadata?.amount) || 0);
     
     if (amountTotal === null || amountTotal === undefined) {
         console.log('Amount total is not available');
         return res.status(400).send('Invalid checkout session: amount_total is null or undefined');
     }
              
              const Inventory = db.collection('inventory');
                 // Converte o valor para reais, assumindo que está em centavos
          const amountTotalInReais = amountTotal / 100;
  
  // Definindo um tipo para os containers no inventário
  interface InventoryUpdate {
    [key: string]: number;  // Permite qualquer chave de string com valor do tipo number
  }
  
  // Verifica se o valor total da compra é acima de R$ 100,00
  if (amountTotalInReais > 100) {
    // Tipos de containers disponíveis para o sorteio
    const containerTypes: ContainerTypes[] = [
      'containermarcos',
      'containerbig',
      'containersheriff',
      'containerbarbara',
      'containerbigode',
      'containerjason',
      'containermagnata',
      'containerasyc',
    ];
  
    // Função para escolher aleatoriamente 2 containers
    const getRandomContainers = (types: ContainerTypes[], count: number) => {
      const shuffled = types.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };
  
    const containers = getRandomContainers(containerTypes, 2);
  
    // Para cada container selecionado, incrementa o valor do container no inventário em 1
    const updateFields: InventoryUpdate = containers.reduce((acc, container) => {
      acc[`${container}`] = 1; // Incrementa o campo do container em 1
      return acc;
    }, {} as InventoryUpdate); // Assegura que o tipo de 'acc' é 'InventoryUpdate'
  
    // Atualiza o inventário do usuário com os containers, incrementando se já existirem
    await Inventory.updateOne(
      { userId: UserId },
      { $inc: updateFields }, // Incrementa os containers no inventário
      { upsert: true }
    );
  }
  
              // Verifica se o valor total da compra é acima de R$ 35,00
              if (amountTotalInReais > 35) {
                await db.collection<Item>('items').updateOne(
                  { _id: UserId},
                  { $inc: { coins: 120000 } }, // Adiciona 120.000 Orbs
                  { upsert: true }
                );

                const timestamp = new Date();
                const transaction: Transaction = {
                  date: timestamp.toLocaleDateString(),
                  time: timestamp.toLocaleTimeString(),
                  amount: 120000,
                  action: `receive_orbs`,
                  currency: `coins`,
                  timestamp: new Date(),
                };


                const notification = {
                  userId: UserId,
                  type: 'transaction',
                  title: 'Notificação de Carteira',
                  message: `Você recebeu 120000 Orbits pela compra de Bits realizada através do thenovision`,
                  timestamp: new Date(),
                };
                const notificationsCollection = db.collection('notifications');
                await notificationsCollection.insertOne(notification);

        
                await db.collection<Item>('items').updateOne(
                  { _id: UserId },
                  { 
                    $push: { transactions: transaction } // Adiciona a transação
                  }
                );
                
                // Atualiza o valor em bits que o usuário comprou
                await db.collection<Item>('items').updateOne(
                  { _id: UserId },
                  { $inc: { bits: bitsQuantity } },  
                  { upsert: true }
                );
              };


              const notification = {
                userId: UserId,
                type: 'transaction',
                title: 'Notificação de Carteira',
                message: `Você recebeu um total de ${bitsQuantity} Bits, Compra realizada atraves do thenovision`,
                timestamp: new Date(),
              };
              const notificationsCollection = db.collection('notifications');
              await notificationsCollection.insertOne(notification);
            
            
            }

          break;
          
        default:
          throw new Error("Unhandled relevant event!");
      }
                
    
    } catch (error: any) {
      console.log(error);
      return res.status(400).send('Webhook error: "Webhook handler failed. View logs."');
    }
    
  }

  res.json({ received: true });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      return handleWebhooks(req, res);
    default:
      res.setHeader("Allow", "POST");
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;