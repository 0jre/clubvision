import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';
import { Collection, Document } from 'mongodb';

interface UserTransaction {
  date: string;
  time: string;
  type: string;
  amount: number;
  currency: string;
  timestamp: Date;
  transfer?: {
    to?: { vid: string };
    from?: { vid: string };
  };
}

interface UserDocFromItemsCollection extends Document {
  id: string;
  transactions?: UserTransaction[];
}

interface ReformDoc extends Document {
  userId: string;
  reformId: string;
  status: string;
  updateDate: Date;
}

interface UserProfileDoc extends Document {
  id: string;
  name: string;
  email: string;
  lastUpdated: Date;
}

interface TvlNovisionDoc extends Document {
  userId: string;
  data: any;
  createdAt: Date;
}

type NotificationType =
  | 'transaction'
  | 'reform_update'
  | 'user_profile_update'
  | 'tvl_update'
  | 'system'
  | 'convert_to_coins'
  | 'convert_to_banking'
  | 'convert_from_banking'
  | 'clan_creation'
  | 'double_orbit'
  | 'post_creation'
  | 'video_post_creation'
  | 'currency'
  | 'senttransfer'
  | 'receivetransfer'
  | 'receive_orbs'
  | 'staking_orbs'
  | 'receive_bits'
  | 'recharge_bits'
  | 'purchase_tokens'
  | 'purchase_openbox';

interface GeneratedNotification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

export const notificationTitles: { [key: string]: string } = {
    convert_to_coins: 'Conversão para Moedas',
    convert_to_banking: 'Guardou na carteira',
    convert_from_banking: 'Retirou da carteira',
    clan_creation: 'Criou um clã',
    double_orbit: 'Aposta no Double',
    post_creation: 'Postagem no vision',
    video_post_creation: 'Postagem no vision',
    currency: 'Conversão de Moeda',
    senttransfer: 'Transferência',
    receivetransfer: 'Depositado',
    receive_orbs: 'Recebeu Orbits',
    staking_orbs: 'Orbits em Staking',
    receive_bits: 'Recebeu em Bits',
    recharge_bits: 'Compra de Bits',
    transaction: 'Transação feita',
    purchase_tokens: 'Comprou tokens',
    purchase_openbox: 'Abriu uma caixa'
};


export default async function getDynamicNotifications(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await dbConnect();

  const itemsCollection: Collection<UserDocFromItemsCollection> = db.collection('items');
  const reformsCollection: Collection<ReformDoc> = db.collection('reforms');
  const usersCollectionx: Collection<UserProfileDoc> = db.collection('users');
  const tvlNovisionCollection: Collection<TvlNovisionDoc> = db.collection('tvl-novision');

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    console.error('API Error: Parameter userId is missing or invalid.', { userId });
    return res.status(400).json({ message: 'Parâmetro userId ausente ou inválido' });
  }

  try {
    console.log(`API Call for userId: ${userId}`);
    const generatedNotifications: GeneratedNotification[] = [];
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const userItemsDoc = await itemsCollection.findOne({ id: userId });
    console.log(`Fetched from itemsCollection for userId ${userId}:`, userItemsDoc ? 'Found' : 'Not Found');

    if (userItemsDoc && Array.isArray(userItemsDoc.transactions)) {
      for (const tx of userItemsDoc.transactions) {
        let txTimestamp: Date;
        if (tx.timestamp instanceof Date) {
            txTimestamp = tx.timestamp;
        } else if (tx.date && tx.time) {
            const [day, month, year] = tx.date.split('/');
            const [hour, minute, second] = tx.time.split(':');
            txTimestamp = new Date(Date.UTC(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hour) + 3,
                parseInt(minute),
                parseInt(second)
            ));
        } else {
            console.warn(`Transaction missing valid timestamp or date/time fields:`, tx);
            continue;
        }

        if (isNaN(txTimestamp.getTime())) {
          console.warn(`Invalid timestamp parsed for transaction:`, tx);
          continue;
        }

        if (txTimestamp > oneWeekAgo) {
          generatedNotifications.push({
            id: `tx-${txTimestamp.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'transaction',
            message: `Nova transação de ${tx.amount} ${tx.currency} (${tx.type}).`,
            timestamp: txTimestamp,
            read: false,
            data: tx,
          });
        }
      }
    }

    const recentReforms = await reformsCollection.find({
      userId: userId,
      updateDate: { $gte: oneWeekAgo }
    }).toArray();
    console.log(`Fetched from reformsCollection for userId ${userId}:`, recentReforms.length);

    for (const reform of recentReforms) {
      generatedNotifications.push({
        id: `reform-${reform.reformId}-${reform.updateDate.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'reform_update',
        message: `Status da reforma ${reform.reformId} atualizado para: ${reform.status}.`,
        timestamp: reform.updateDate,
        read: false,
        data: reform,
      });
    }

    const userProfileDoc = await usersCollectionx.findOne({ id: userId });
    console.log(`Fetched from usersCollectionx for userId ${userId}:`, userProfileDoc ? 'Found' : 'Not Found');

    if (userProfileDoc && userProfileDoc.lastUpdated && userProfileDoc.lastUpdated > oneWeekAgo) {
      generatedNotifications.push({
        id: `profile-${userProfileDoc.id}-${userProfileDoc.lastUpdated.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'user_profile_update',
        message: `Seu perfil foi atualizado recentemente.`,
        timestamp: userProfileDoc.lastUpdated,
        read: false,
        data: { name: userProfileDoc.name, email: userProfileDoc.email },
      });
    }

    const recentTvlNovision = await tvlNovisionCollection.find({
      userId: userId,
      createdAt: { $gte: oneWeekAgo }
    }).toArray();
    console.log(`Fetched from tvlNovisionCollection for userId ${userId}:`, recentTvlNovision.length);

    for (const tvlData of recentTvlNovision) {
      const createdAtDate = tvlData.createdAt instanceof Date ? tvlData.createdAt : new Date(tvlData.createdAt);
      if (isNaN(createdAtDate.getTime())) {
          console.warn(`Invalid createdAt timestamp for tvlData:`, tvlData);
          continue;
      }

      generatedNotifications.push({
        id: `tvl-${tvlData._id}-${createdAtDate.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'tvl_update',
        message: `Novos tokens TVL agora estão sob sua propriedade.`,
        timestamp: createdAtDate,
        read: false,
        data: tvlData,
      });
    }

    const allowedNotificationTypes = new Set<NotificationType>([
        'post_creation',
        'video_post_creation',
        'clan_creation',
        'reform_update',
        'user_profile_update',
        'tvl_update',
        'receivetransfer',
        'receive_orbs',
        'receive_bits',
        'system'
    ]);

    const filteredNotifications = generatedNotifications.filter(notification => {
      return allowedNotificationTypes.has(notification.type);
    });

    filteredNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return res.status(200).json(filteredNotifications);

  } catch (error) {
    console.error('API Error: Failed to generate notifications.', error);
    return res.status(500).json({ message: 'Erro ao gerar notificações' });
  }
}
