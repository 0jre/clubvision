import { Db } from 'mongodb';
import { dbConnect } from '@/core/integration/connect';
import { encrypt } from "@/core/security/encryption";
import { sendDiscordMessage } from "@/lib/services/mox/mailer";
import { generateCardNumber, generateCVV } from '@/hooks/.config/cardUtils';
import { UserItem, MemberStats } from '@/types/user/card';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';


const ORBIT_TAX = 0.12; // 12%
const BANKING_TAX = 0.08; // 8%
const WITHDRAWAL_TAX = 0.19; // 19%
const NETWORK_COST = 0.01; // Custo fixo da rede
const SMALL_VALUE_THRESHOLD = 0.01; // Limite abaixo do qual valores são considerados zero

// Função para formatar valores em dólares
const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Função para arredondar valores para 2 casas decimais e garantir que valores muito pequenos sejam tratados como zero
const roundToTwoDecimals = (value: number): number => {
  const rounded = Math.round(value * 100) / 100;
  return Math.abs(rounded) < SMALL_VALUE_THRESHOLD ? 0 : rounded;
};

// Função para calcular o valor com taxa aplicada
const calculateAfterTax = (amount: number, taxRate: number): number => {
  const amountAfterTax = roundToTwoDecimals(amount * (1 - taxRate));
  return Math.max(amountAfterTax, 0); // Garantir que o valor não seja negativo
};

// Função para dispersar parte do valor e queimar o restante
const disperseAmount = async (db: Db, totalAmount: number): Promise<number> => {
  const itemsCollection = db.collection("items");
  const notificationsCollection = db.collection("notifications");
  const walletvisionCollection = db.collection("walletvision");

  // Buscar membros com contractunix: true e membros prime (sem contractunix: true)
  const contractunixMembers = await itemsCollection.find({ contractunix: true }).toArray();
  const primeMembers = await itemsCollection.find({ prime: true, contractunix: { $ne: true } }).toArray();

  let totalDispersedAmount = 0;

  // Dispersar 15% para membros com contractunix: true
  for (const member of contractunixMembers) {
    const disperseAmount = roundToTwoDecimals(totalAmount * 0.15);
    totalDispersedAmount += disperseAmount;

    await itemsCollection.updateOne({ _id: member._id }, { $inc: { coins: disperseAmount } });

    const notification = {
      userId: member._id.toString(),
      type: 'dispersal',
      title: 'Notificação de Distribuição',
      message: `Você recebeu ${formatCurrency(disperseAmount)} ORB como parte da distribuição Univision X.`,
      timestamp: new Date(),
    };
    await notificationsCollection.insertOne(notification);
    await sendDiscordMessage(member._id.toString(), `Você recebeu ${formatCurrency(disperseAmount)} ORB como parte da distribuição Univision X.`);
  }

  // Dispersar entre 1% e 5% para membros prime (sem contractunix: true)
  for (const member of primeMembers) {
    const percentageToDisperse = Math.random() * 0.04 + 0.01; // Valor entre 1% e 5%
    const disperseAmount = roundToTwoDecimals(totalAmount * percentageToDisperse);
    totalDispersedAmount += disperseAmount;

    await itemsCollection.updateOne({ _id: member._id }, { $inc: { coins: disperseAmount } });

    const notification = {
      userId: member._id.toString(),
      type: 'dispersal',
      title: 'Notificação de Distribuição',
      message: `Você recebeu ${formatCurrency(disperseAmount)} ORB como parte da distribuição Univision X.`,
      timestamp: new Date(),
    };
    await notificationsCollection.insertOne(notification);
    await sendDiscordMessage(member._id.toString(), `Você recebeu ${formatCurrency(disperseAmount)} ORB como parte da distribuição Univision X.`);
  }

  // Calcular o valor queimado
  const burnAmount = roundToTwoDecimals(totalAmount - totalDispersedAmount);

  // Registrar na coleção walletvision
  await walletvisionCollection.updateOne(
    { endress: "global_record" }, // Usar um ID fixo para o registro global
    {
      $inc: {
        totalconvert: totalAmount,
        amountconvert: burnAmount
      },
      $push: {
        conversions: {
          date: new Date(),
          amount: totalAmount,
          dispersed: totalDispersedAmount,
          burned: burnAmount
        }
      }
    },
    { upsert: true } // Cria o documento se não existir
  );

  return burnAmount;
};

export async function ConverTokens(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json({ message: 'Parâmetro de identificação inválido ou ausente' });
  }

  const { db } = await dbConnect();
  const collection = db.collection("items");
  const notificationsCollection = db.collection("notifications");

  if (req.method === 'GET') {
    try {
      const user = await collection.findOne({ id: id });
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error: any) {
      console.error('Error in GET request:', error);
      return res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
  } else if (req.method === 'POST') {
    const { action, amount, currency, slippage } = req.body;

    try {
      const user = await collection.findOne({ id: id });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({ message: 'Quantidade inválida' });
      }

      let newValues;
      let notificationMessage = '';
      const timestamp = new Date();
      const transaction = {
        date: timestamp.toLocaleDateString(),
        time: timestamp.toLocaleTimeString(),
        timestamp: new Date(),
        amount: roundToTwoDecimals(amountNum),
        currency: currency,
        action: action
      };

      let amountAfterTax;
      let networkCost = NETWORK_COST;

      const userHasContractax = user.contractax === true;

      if (action === 'convert_to_banking') {
        const taxRate = userHasContractax ? 0 : ORBIT_TAX;
        amountAfterTax = calculateAfterTax(amountNum, taxRate);
        amountAfterTax = roundToTwoDecimals(amountAfterTax - networkCost);
        if (currency === 'coins') {
          if (user.coins < amountNum) {
            return res.status(400).json({ message: 'Orbit Coins insuficientes' });
          }
          newValues = {
            $inc: {
              coins: -amountNum,
              banking: amountAfterTax,
            },
            $push: {
              transactions: transaction
            }
          };
          notificationMessage = `Você converteu ${formatCurrency(amountNum)} Orbit Coins para ${formatCurrency(amountAfterTax)} Banking.`;
        } else {
          return res.status(400).json({ message: 'Moeda inválida para conversão' });
        }
      } else if (action === 'convert_from_banking') {
        const taxRate = userHasContractax ? 0 : BANKING_TAX;
        amountAfterTax = roundToTwoDecimals(amountNum * (1 - taxRate) * (1 - WITHDRAWAL_TAX));
        amountAfterTax = roundToTwoDecimals(amountAfterTax - networkCost);
        if (currency === 'coins') {
          if (user.banking < amountNum) {
            return res.status(400).json({ message: 'Saldo insuficiente no Banking' });
          }

          // Dispersar parte do valor e queimar o restante
          const burnAmount = await disperseAmount(db, amountAfterTax);

          newValues = {
            $inc: {
              banking: -amountNum,
              coins: burnAmount,
            },
            $push: {
              transactions: transaction
            }
          };
          notificationMessage = `Você converteu ${formatCurrency(amountNum)} Banking para ${formatCurrency(burnAmount)} Orbit Coins. Parte do valor foi disperso de acordo com o Roteamento de dispersão: Univision X.`;
        } else {
          return res.status(400).json({ message: 'Moeda inválida para conversão' });
        }
      } else {
        return res.status(400).json({ message: 'Ação inválida' });
      }

      // Verificar derrapagem máxima
      const minAmount = amountAfterTax * (1 - parseFloat(slippage));
      if (amountAfterTax < minAmount) {
        return res.status(400).json({ message: 'Valor recebido abaixo da derrapagem permitida' });
      }

      // Atualizar valores no banco de dados
      await collection.updateOne({ id: id }, newValues);
      await notificationsCollection.insertOne({
        userId: id,
        title: 'Notificação de Conversão',
        message: notificationMessage,
        timestamp: timestamp,
      });

      return res.status(200).json({ message: 'Conversão realizada com sucesso', amount: amountAfterTax });
    } catch (error: any) {
      console.error('Error in POST request:', error);
      return res.status(500).json({ message: 'Error processing conversion', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
}


 
 

export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {

  const sessionUser = req.session?.get('user');
  // Verifique se o usuário está autenticado
  if (!req.session || !req.session.get('user')) {
    return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
  }
  const { db } = await dbConnect();
  const userCollection = db.collection<UserItem>('items');
  const reformsCollection = db.collection<UserItem>('reforms');
  const memberStatsCollection = db.collection<MemberStats>('member-stats');

  const userId = sessionUser.id;

  try {
    const user = await userCollection.findOne({ _id: userId });
    const userinfo = await reformsCollection.findOne({ userId });
    const stats = await memberStatsCollection.findOne({ member_id: userId });

    if (!user || !userinfo || !stats) {
      return res.status(404).json({ message: 'Usuário ou dados adicionais não encontrados' });
    }

    if (req.method === 'GET') {
      const existingCards = user.visioncard || [];
    
      const cardsWithDynamicBalance = existingCards.map(card => {
        let balance = '$0';
        if (card.type === 'VisionPay') {
          balance = `$${user.banking?.toLocaleString() || '0'}`;
        } else if (card.type === 'Sapphire') {
          balance = `$${user.bits?.toLocaleString() || '0'}`;
        } else if (card.type === 'VΛULT') {
          const total = (user.bits || 0) + (user.coins || 0);
          balance = `$${total.toLocaleString()}`;
        }
        return { ...card, balance };
      });
    
      return res.status(200).json({
        cards: cardsWithDynamicBalance,
      });
    }
    
    if (req.method === 'POST') {
      const existingCards = user.visioncard || [];
      const existingTypes = existingCards.map(card => card.type);
      const createdCards: any[] = [];
    
      const fullName = `${userinfo.firstname || 'Usuário'} ${userinfo.lastname || ''}`.trim();
    
      if (!existingTypes.includes('VisionPay')) {
        createdCards.push({
          type: 'VisionPay',
          cardNumber: generateCardNumber(),
          cardHolder: fullName,
          expiry: 'To Pay',
          cvv: generateCVV(),
        });
      }
    
      if (user.bits >= 1000 && !existingTypes.includes('Sapphire')) {
        createdCards.push({
          type: 'Sapphire',
          cardNumber: generateCardNumber(),
          cardHolder: fullName,
          expiry: 'Bits',
          cvv: generateCVV(),
        });
      }
    
      if (stats.level >= 40 && !existingTypes.includes('VΛULT')) {
        createdCards.push({
          type: 'VΛULT',
          cardNumber: generateCardNumber(),
          cardHolder: fullName,
          expiry: 'Bits & Coins',
          cvv: generateCVV(),
          limit: 'Unlimited',
        });
      }
    
      if (createdCards.length === 0) {
        return res.status(200).json({
          message: 'Nenhum novo cartão criado. Usuário já possui todos os cartões disponíveis.',
          cards: existingCards,
        });
      }
    
      await userCollection.updateOne(
        { _id: userId },
        { $push: { visioncard: { $each: createdCards } } }
      );
    
      return res.status(200).json({
        message: 'Cartões processados com sucesso',
        cards: [...existingCards, ...createdCards],
      });
    }
    

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  } catch (error) {
    console.error('Erro ao processar cartões:', error);
    return res.status(500).json({ message: 'Erro interno ao processar cartões' });
  }
}


const CardVision: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  // Use o await para chamar a função original checkAuth
  await checkAuth(req, res);
};

export default withSession(CardVision);
