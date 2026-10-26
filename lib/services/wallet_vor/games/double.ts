import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';
import { encrypt } from "@/core/security/encryption";
import { SMALL_VALUE_THRESHOLD } from '@/lib/services/vpower/src/calc_tax';

// Função para obter o nível baseado no valor numérico
const getBadgeLevel = (value: number): string => {
  if (value >= 0 && value <= 1) {
    return 'Unbadge';
  } else if (value >= 2 && value <= 7) {
    return 'Bronze';
  } else if (value >= 8 && value <= 21) {
    return 'Prata';
  } else if (value >= 22 && value <= 37) {
    return 'Gold';
  } else if (value >= 38 && value <= 69) {
    return 'Platinum';
  } else if (value >= 70 && value <= 100) {
    return 'Diamante';
  } else {
    return 'Master';
  }
};

// Função para obter a chance de ganhar baseada no nível do usuário
const getWinChanceBasedOnLevel = (level: string): number => {
  switch (level) {
    case 'Bronze':
      return 0.005; // 0.5%
    case 'Prata':
      return 0.009; // 0.9%
    case 'Gold':
      return 0.12;  // 12%
    case 'Platinum':
      return 0.20;  // 20%
    case 'Diamante':
      return 0.40;  // 40%
    case 'Master':
      return 0.65;  // 65%
    default:
      return 0.005; // Valor padrão
  }
};

 
const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const roundToTwoDecimals = (value: number): number => {
  const rounded = Math.round(value * 100) / 100;
  return Math.abs(rounded) < SMALL_VALUE_THRESHOLD ? 0 : rounded;
};

// Função para decidir o multiplicador com base na vitória ou perda
const getMultiplier = (isWin: boolean): number => {
  if (isWin) {
    return Math.random() * 99 + 1; // Multiplicador positivo entre 1x e 100x
  } else {
    return -(Math.random() * 0.5 + 0.5); // Multiplicador negativo entre -0.5x e -1x
  }
};


export async function DoubleGaming(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, action, amount, currency, market } = req.body;

    if (!id || action !== 'double_orbit' || typeof amount !== 'number' || currency !== 'coins' || (market !== 'high' && market !== 'low')) {
      return res.status(400).json({ message: 'Dados de entrada inválidos' });
    }

    try {
      const { db } = await dbConnect();
      const itemsCollection = db.collection('items');
      const memberStatsCollection = db.collection('member-stats');
      const notificationsCollection = db.collection('notifications');
      const reformsCollection = db.collection('reforms');
      const walletVisionCollection = db.collection('walletvision'); // Nova coleção para registros

      const primeUser = await reformsCollection.findOne({ userId: id, prime: true });
      if (!primeUser) return res.status(403).send('Acesso negado. Usuário não é prime.');

      const memberStats = await memberStatsCollection.findOne({ member_id: id });
      if (!memberStats) return res.status(404).json({ message: 'Usuário não encontrado' });

      const userLevel = getBadgeLevel(memberStats.level);
      const winChance = getWinChanceBasedOnLevel(userLevel);

      const user = await itemsCollection.findOne({ id: id });
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

      const amountNum = roundToTwoDecimals(amount);
      if (currency !== 'coins' || user.coins < amountNum) {
        return res.status(400).json({ message: 'Orbit Coins insuficientes ou moeda inválida' });
      }

      const isWin = Math.random() < winChance;
      const multiplier = getMultiplier(isWin);
      const newAmount = roundToTwoDecimals(amountNum * multiplier);
      const timestamp = new Date();
      const newValues = {
        $inc: { coins: newAmount },
        $push: {
          transactions: {
            date: timestamp.toLocaleDateString(),
            time: timestamp.toLocaleTimeString(),
            timestamp: new Date(),
            amount: amountNum,
            currency: currency,
            action: action,
            resultStatus: isWin ? 'Ganhou' : 'Perdeu',
            result: isWin ? `+${multiplier}` : `${Math.abs(multiplier)}`,
            newAmount: newAmount,
          },
        },
      };

      await itemsCollection.updateOne({ id: id }, newValues);
      const updatedUser = await itemsCollection.findOne({ id: id });

      const notificationMessage = `Você ${isWin ? 'ganhou' : 'perdeu'} ao multiplicar ${formatCurrency(amountNum)} Orbit Coins em ${multiplier > 0 ? `${multiplier}x` : `${Math.abs(multiplier)}x`} resultando em ${formatCurrency(newAmount)} Orbit Coins.`;

      const notification = {
        userId: user._id.toString(),
        type: action,
        title: 'Notificação de Carteira',
        message: notificationMessage,
        timestamp: new Date(),
      };
      await notificationsCollection.insertOne(notification);

      // Atualizar a coleção 'walletvision'
      await walletVisionCollection.updateOne(
        { endress: 'global_record' },
        {
          $inc: { totalbet: 1, amoutwin: isWin ? newAmount : 0 }, // Incrementar o total de apostas
          $push: {
            betvision: {
              win: isWin ? 1 : 0,
              down: isWin ? 0 : 1,
              action: action, // Corrigi a propriedade 'A' para 'action'
            },
          },
        },
        { upsert: true } // Cria o documento se não existir
      );

      const nvxcrypted = encrypt(JSON.stringify(updatedUser));
      const apiResult = isWin ? (market === 'high' ? 'HIGH' : 'LOW') : (market === 'high' ? 'LOW' : 'HIGH');
 
      return res.status(200).json({
        log: nvxcrypted,
        market,
        multiplier,
        apiResult, // Added to align with graph logic
        Informations: {
          winOrLoseMessage: `${isWin ? 'ganhou' : 'perdeu'}`,
          multipliedAmountMessage: `${formatCurrency(amountNum)} ORBS`,
          multiplierMessage: `${multiplier > 0 ? `${multiplier}x` : `${Math.abs(multiplier)}x`}`,
          resultMessage: `${formatCurrency(newAmount)} ORBS.`,
          multiplier
        },
      });
    } catch (error) {
      console.error('Erro na solicitação de postagem:', error);
      return res.status(500).json({ message: 'Erro de processamento de conversão' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
