import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';
import { Notification } from '@/types/user/notifications';

export async function Walletvision_vor(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await dbConnect();
  const notificationsCollection = db.collection<Notification>('notifications');
  const usersCollection = db.collection('items');
  const usersCollectionx = db.collection('users');

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: 'Parâmetro userId ausente ou inválido' });
  }

  try {
    const user = await usersCollection.findOne({ id: userId });

    if (!user || !Array.isArray(user.transactions)) {
      return res.status(404).json({ message: 'Usuário ou transações não encontradas' });
    }

    // Corrigindo a hora para UTC adicionando +3h (fuso horário Brasília)
    const transactionsWithDate = user.transactions.map(tx => {
      const [day, month, year] = tx.date.split('/');
      const [hour, minute, second] = tx.time.split(':');

      const isoDate = new Date(Date.UTC(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour) + 3, // soma 3h para alinhar UTC
        parseInt(minute),
        parseInt(second)
      ));

      return { isoDate, ...tx };
    });

    const combinedResults = await Promise.all(
      transactionsWithDate.map(async (tx) => {
        // Enriquecer transfer, caso exista
        let enrichedTransfer: any = null;

        if (tx.transfer) {
          const [toUser, fromUser] = await Promise.all([
            tx.transfer.to?.vid ? usersCollectionx.findOne({ vid: tx.transfer.to.vid }) : null,
            tx.transfer.from?.vid ? usersCollectionx.findOne({ vid: tx.transfer.from.vid }) : null,
          ]);

          enrichedTransfer = {
            to: toUser ? {
              name: toUser.name,
              discriminator: toUser.discriminator,
              avatar: toUser.avatar,
            } : null,
            from: fromUser ? {
              name: fromUser.name,
              discriminator: fromUser.discriminator,
              avatar: fromUser.avatar,
            } : null,
          };
        }

   
    const txTimestamp = new Date(tx.timestamp); 
const matchedNotification = await notificationsCollection.aggregate([
  {
    $match: {
      userId,
      timestamp: {
        $gte: new Date(txTimestamp.getTime() - 2000),
        $lte: new Date(txTimestamp.getTime() + 2000),
      },
    },
  },
  {
    $addFields: {
      diff: { $abs: { $subtract: ["$timestamp", txTimestamp] } }
    }
  },
  {
    $sort: { diff: 1 }
  },
  {
    $limit: 1
  }
]).toArray();

const mergedObjects = matchedNotification.length
  ? [{ ...tx, ...matchedNotification[0], transfer: enrichedTransfer }]
  : [{ ...tx, transfer: enrichedTransfer }];
        return { notifications: mergedObjects };
      })
    );

    return res.status(200).json(combinedResults);

  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return res.status(500).json({ message: 'Erro ao buscar notificações' });
  }
}
