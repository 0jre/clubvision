import { dbConnect } from '@/core/integration/connect';
import { containerItems, Item } from '@/data/list_tvl/list.container';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';

export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
    if (!req.session || !req.session.get('user')) {
        return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
    }

    if (req.method === 'GET') {
        return await getOpenBoxItems(req, res);
    }
};

async function getOpenBoxItems(req: NextApiRequest, res: NextApiResponse) {
  try {
      const { db } = await dbConnect();
      const openBox = await db.collection('openbox').findOne({});

      if (!openBox?.items || !Array.isArray(openBox.items) || openBox.items.length === 0) {
          return res.status(404).json({ message: 'Nenhum item disponível' });
      }

      const itemMap = new Map<number, Item>();
      for (const key in containerItems) {
          containerItems[key].forEach((item) => {
              itemMap.set(item.id, item);
          });
      }

      const availableItems = openBox.items
      .map((item) => {
          // Tenta buscar pelo id primeiro
          let existingItem = itemMap.get(item.id);
  
          if (!existingItem) {
              // Caso não encontre pelo id, tenta buscar pelo próprio item (assumindo que item é o ID diretamente)
              existingItem = itemMap.get(item);
          }
  
          // Se encontrar o item, adiciona a chance
          if (existingItem) {
              return {
                  ...existingItem,
                  chance: item.chance ?? `${calculateChanceBasedOnRarity(existingItem.rarity || 'comum')}%`
              };
          }
  
          return undefined;
      })
      .filter((item) => item !== undefined);
  

      if (!availableItems.length) {
          return res.status(404).json({ message: 'Nenhum item disponível' });
      }

      await db.collection('openbox').updateOne(
          { _id: openBox._id },
          { $set: { items: availableItems } }
      );

      return res.status(200).json({
          message: 'Itens disponíveis para o spin',
          items: availableItems,
      });
  } catch (error) {
      console.error('Erro ao buscar itens:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}


function calculateChanceBasedOnRarity(rarity: string): number {
  let chance = 0;
  switch (rarity) {
      case 'epico': // Extremamente raro
          chance = Math.random() * (0.26 - 0.0001) + 0.0001;
          break;
      case 'raro': // Oculto
          chance = Math.random() * (15.98 - 0.0001) + 0.0001;
          break;
      case 'comum': // Mil-Spec (mais comum)
      default:
          chance = Math.random() * (79.92 - 0.0001) + 0.0001;
          break;
  }
  return parseFloat(chance.toFixed(4));
}

const OpenGradeCase: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
    await checkAuth(req, res);
};

export default withSession(OpenGradeCase);