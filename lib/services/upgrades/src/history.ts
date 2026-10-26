import { dbConnect } from '@/core/integration/connect';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';

export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const upgrader_History: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
   const sessionUser = req.session?.get('user');

  if (!sessionUser) {
    return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
  }

  const userId = sessionUser.id;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { db } = await dbConnect();
    
    // Buscar histórico de upgrades do usuário
    const userUpgrades = await db.collection('upgrades')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    // Coletar IDs de todos os itens envolvidos nos upgrades
   const allItemIds = new Set();

userUpgrades.forEach(upgrade => {
  if (upgrade.targetItem && upgrade.targetItem.id !== undefined) {
    allItemIds.add(upgrade.targetItem.id);
  }
  if (Array.isArray(upgrade.offeredItems)) {
    upgrade.offeredItems.forEach((item: any) => {
      if (item && item.id !== undefined) {
        allItemIds.add(item.id);
      }
    });
  }
});

const itemDetails = await db.collection('tvl-novision')
  .find({ id: { $in: Array.from(allItemIds) } })
  .project({ id: 1, tokenID: 1, itemValue: 1, name: 1 })
  .toArray();

const itemDetailsMap = itemDetails.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

// Enriquecer os dados do histórico com detalhes dos itens
const enrichedHistory = userUpgrades.map(upgrade => {
  const receivedItemDetails = upgrade.targetItem && upgrade.targetItem.id !== undefined
    ? itemDetailsMap[upgrade.targetItem.id] || {}
    : {};

  const tradedItemsDetails = Array.isArray(upgrade.offeredItems)
    ? upgrade.offeredItems.map((item: any) => ({
        ...item,
        details: item && item.id !== undefined ? itemDetailsMap[item.id] || {} : {},
      }))
    : [];

  return {
    ...upgrade,
    targetItem: upgrade.targetItem
      ? { ...upgrade.targetItem, details: receivedItemDetails }
      : null,
    offeredItems: tradedItemsDetails,
  };
});

return res.status(200).json({
  success: true,
  history: enrichedHistory
});
 
  } catch (error) {
    console.error('Erro ao buscar histórico de upgrades:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}



const UpgraderHistory: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
   // Use o await para chamar a função original checkAuth
   await upgrader_History(req, res);
 };
 
 export default withSession(UpgraderHistory);
 