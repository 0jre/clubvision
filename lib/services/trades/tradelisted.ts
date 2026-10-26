import { dbConnect } from '@/core/integration/connect';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';


export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const tradeListed: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  const sessionUser = req.session?.get('user');

  if (!sessionUser) {
    return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
  }



  if (req.method === 'POST') {
    const { action, vid } = req.body;
    const userId = sessionUser.id;

    const { db } = await dbConnect();
    if (!vid || !["accept", "reject"].includes(action)) {
      return res.status(400).json({ error: 'Parâmetros inválidos.' });
    }

    const trade = await db.collection('trades').findOne({ vid });

    if (!trade) {
      return res.status(404).json({ error: 'Troca não encontrada.' });
    }

    if (![trade.userIdreceive, trade.userIdtrader].includes(userId)) {
      return res.status(403).json({ error: 'Usuário não autorizado para esta troca.' });
    }
  
 
    const tradetime = await db.collection('trades').findOne({ userIdtrader: trade.userIdtrader, vid });
if (tradetime && tradetime.status === 'pendente') {
  const now = new Date(); // UTC atual
  const tradeTime = new Date(tradetime.time); // Hora da troca em UTC

  const traderPrime = await db.collection('reforms').findOne({ userId: tradetime.userIdtrader });
  const primeTimeLimitMs = traderPrime?.prime ? 64 * 60 * 60 * 1000 : 5 * 60 * 1000;

  if (now.getTime() - tradeTime.getTime() > primeTimeLimitMs) {
    await db.collection('trades').updateOne(
      { vid: String(vid) },
      { $set: { status: 'expired' } }
    );
    return res.status(400).json({ error: 'Troca expirada.' });
  }
}

    if (action === 'reject') {
      await db.collection('trades').updateOne({ vid }, { $set: { status: 'refused' } });
      return res.status(200).json({ message: 'Troca rejeitada com sucesso.' });
    }

    if (action === 'accept') {
        const { mytvl1, mytvl2, userIdtrader, userIdreceive } = trade;
      
        if (userId !== userIdreceive) {
          return res.status(403).json({ error: 'Somente o recebedor pode aceitar a troca.' });
        }
      
        await db.collection('trades').updateOne({ vid }, { $set: { status: 'completed' } });
      
        const updates = [];
      
        // --- Atualizar ownership dos itens em 'tvl-novision' ---
        for (const item of mytvl1) {
          const result = await db.collection('tvl-novision').updateOne(
            { tokenID: item.uid },
            {
              $set: { userId: userIdtrader },
              $push: { previousOwners: userIdreceive }
            }
          );
          if (result.matchedCount === 0) {
            console.warn(`Item ${item.uid} não encontrado em tvl-novision (mytvl1).`);
          }
        }
      
        for (const item of mytvl2) {
          const result = await db.collection('tvl-novision').updateOne(
            { tokenID: item.uid },
            {
              $set: { userId: userIdreceive },
              $push: { previousOwners: userIdtrader }
            }
          );
          if (result.matchedCount === 0) {
            console.warn(`Item ${item.uid} não encontrado em tvl-novision (mytvl2).`);
          }
        }
      
        // --- Buscar inventories ---
        let traderInventory = await db.collection('inventory').findOne({ userId: userIdtrader });
        let receiverInventory = await db.collection('inventory').findOne({ userId: userIdreceive });
      
        if (!traderInventory) {
          await db.collection('inventory').insertOne({ userId: userIdtrader, mytvls: [] });
          traderInventory = await db.collection('inventory').findOne({ userId: userIdtrader });
        }
      
        if (!receiverInventory) {
          await db.collection('inventory').insertOne({ userId: userIdreceive, mytvls: [] });
          receiverInventory = await db.collection('inventory').findOne({ userId: userIdreceive });
        }
      
        const mytvl1Uids = mytvl1.map((item: any) => item.uid);
        const mytvl2Uids = mytvl2.map((item: any) => item.uid);
      
        // Itens do receiver que serão dados ao trader
        const fromReceiverToTrader = receiverInventory?.mytvls.filter((item: any) =>
          mytvl1Uids.includes(item.uid)
        );
      
        // Itens do trader que serão dados ao receiver
        const fromTraderToReceiver = traderInventory?.mytvls.filter((item: any) =>
          mytvl2Uids.includes(item.uid)
        );
      
        if (fromReceiverToTrader.length !== mytvl1Uids.length) {
          return res.status(400).json({ error: 'Alguns itens do receiver não foram encontrados no inventário.' });
        }
      
        if (mytvl2Uids.length > 0 && fromTraderToReceiver.length !== mytvl2Uids.length) {
          return res.status(400).json({ error: 'Alguns itens do trader não foram encontrados no inventário.' });
        }
      
        // Atualizar os inventários
        const updatedTraderTvls = traderInventory?.mytvls
          .filter((item: any) => !mytvl2Uids.includes(item.uid)) // remove os que ele deu (se houver)
          .concat(fromReceiverToTrader); // adiciona os que ele recebeu
      
        const updatedReceiverTvls = receiverInventory?.mytvls
          .filter((item: any) => !mytvl1Uids.includes(item.uid)) // remove os que ele deu
          .concat(fromTraderToReceiver); // adiciona os que ele recebeu
      
        updates.push(
          db.collection('inventory').updateOne(
            { userId: userIdtrader },
            { $set: { mytvls: updatedTraderTvls } }
          )
        );
      
        updates.push(
          db.collection('inventory').updateOne(
            { userId: userIdreceive },
            { $set: { mytvls: updatedReceiverTvls } }
          )
        );
      
        await Promise.all(updates);
      
        return res.status(200).json({ message: 'Troca realizada com sucesso.' });
      }
      
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { db } = await dbConnect();
    const userId = sessionUser.id;

    // Busca todos os trades em que o usuário é trader ou receiver
    const trades = await db.collection('trades').find({
      $or: [
        { userIdreceive: userId },
        { userIdtrader: userId },
      ]
    }).sort({ time: -1 }).toArray();

    // Coleta todos os userIds únicos envolvidos nos trades
    const userIdsSet = new Set<string>();
    trades.forEach((trade) => {
      if (trade.userIdtrader) userIdsSet.add(trade.userIdtrader);
      if (trade.userIdreceive) userIdsSet.add(trade.userIdreceive);
    });

    const uniqueUserIds = Array.from(userIdsSet);

    // Busca dados dos usuários envolvidos
    const usersData = await db.collection('users').find({
      id: { $in: uniqueUserIds }
    }).project({ id: 1, name: 1, subdominio: 1, avatar: 1 }).toArray();

    const userMap = Object.fromEntries(usersData.map(user => [user.id, user]));

    // Atualiza status de trades expirados (opcional, mas mantive)
    const now = new Date();

    const updatedTrades = await Promise.all(trades.map(async (trade) => {
      // Define limite de tempo baseado em "prime"
      const traderPrime = await db.collection('reforms').findOne({ userId: trade.userIdtrader });
      const primeTimeLimitMs = traderPrime?.prime ? 64 * 60 * 60 * 1000 : 5 * 60 * 1000;

      if (trade.status === 'pendente') {
        const tradeTime = new Date(trade.time);
        const diffMs = now.getTime() - tradeTime.getTime();       

        if (diffMs > primeTimeLimitMs) {
          await db.collection('trades').updateOne({ vid: trade.vid }, { $set: { status: 'expired' } });
          trade.status = 'expired';
        }
      }

      return {
        ...trade,
        userTrader: userMap[trade.userIdtrader] || null,
        userReceiver: userMap[trade.userIdreceive] || null,
      };
    }));

    return res.status(200).json({ userId, trades: updatedTrades });
  } catch (error) {
    console.error('Erro ao listar trocas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};



const TradingListed: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
   // Use o await para chamar a função original checkAuth
   await tradeListed(req, res);
 };
 
 export default withSession(TradingListed);
 