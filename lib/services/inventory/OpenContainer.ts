import type { NextApiRequest, NextApiResponse } from 'next';
import { Db, Document } from 'mongodb';
import { dbConnect } from '@/core/integration/connect';
import { getItemsForContainer } from '@/types/clubstore/list.opencontainer';
 
interface Item {
  id: number;
  imagem: string;
  nameitem: string;
  priceitem: number;
  rarity?: 'comum' | 'raro' | 'épico';
  valueChange?: number;
  limitedEdition?: boolean;
  editionNumber?: number;
  quantity?: number;
}

interface UserInventory {
  usedcards: { [tokenID: string]: { tokenId: string, open: string } };
  [key: string]: any;
}

export async function OpenContainerTVL(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, containerType } = req.body;

    if (!userId || !containerType) {
      return res.status(400).json({ success: false, message: 'userId e containerType são necessários.' });
    }

    try {
      const { db } = await dbConnect();
      const novisionCollection = db.collection('tvl-novision');
      const marketpriceCollection = db.collection('tvl-marketprice');
      const inventoryCollection = db.collection('inventory');

      const userInventory = await getUserInventory(db, userId);
      const items = getItemsForContainer(containerType);

      if (!items || items.length === 0) {
        console.log(`Nenhum item disponível para o container: ${containerType}`);
        return res.status(200).json({ success: true, itemImage: null });
      }

      const selectedItem = items[Math.floor(Math.random() * items.length)] || undefined
      const existingItem = await novisionCollection.findOne({ id: selectedItem.id, sold: true });
      const previousOwners = existingItem ? existingItem.previousOwners || [] : [];
      const itemCondition = determineItemCondition(previousOwners);

      // Ensure rarity is strictly typed
      const allowedRarities = ['comum', 'raro', 'épico'] as const;
      const safeSelectedItem: Item = {
        ...selectedItem,
        rarity: allowedRarities.includes(selectedItem.rarity as any)
          ? selectedItem.rarity as 'comum' | 'raro' | 'épico'
          : undefined,
      };

      const itemValue = await calculateItemValue(safeSelectedItem, previousOwners);

      const tokenID = generateTokenID();

      if (existingItem) {
        const previousOwnerId = existingItem.userId;

        await novisionCollection.updateOne(
          { _id: existingItem._id },
          {
            $set: { userId, sold: false, itemValue: itemValue, itemCondition },
            $addToSet: { previousOwners: previousOwnerId },
          }
        );

        await marketpriceCollection.updateOne(
          { id: selectedItem.id },
          { $push: { valueHistory: { itemValue: itemValue, timestamp: new Date() } } },
          { upsert: true }
        );
      } else {
        await novisionCollection.insertOne({
          userId,
          id: selectedItem.id,
          tokenID,
          createdAt: new Date(),
          editionNumber: selectedItem.limitedEdition ? await getNextLimitedEditionNumber(selectedItem.id, db) : null,
          totalEditions: selectedItem.quantity,
          itemValue,
          itemCondition,
          previousOwners: [],
        });

        await marketpriceCollection.updateOne(
          { id: selectedItem.id },
          { $push: { valueHistory: { newValue: itemValue, timestamp: new Date() } } },
          { upsert: true }
        );
      }

   // Linhas 70-85
const currentCount = userInventory[containerType] || 0;
if (currentCount === 1) {
  // Remove o container do inventário, pois esse é o último.
  await inventoryCollection.updateOne(
    { userId },
    {
      $unset: { [containerType]: "" },   
      $set: { [`usedcards.${tokenID}`]: { tokenId: tokenID, open: containerType } },
    }
  );
} else if (currentCount > 1) {
  // Decrementa o container normalmente.
  await inventoryCollection.updateOne(
    { userId },
    {
      $inc: { [containerType]: -1 },  
      $set: { [`usedcards.${tokenID}`]: { tokenId: tokenID, open: containerType } },
    }
  );
}
      
 
      return res.status(200).json({ success: true, itemImage: selectedItem.imagem, itemValue, possibleItems: items });
    } catch (error) {
      console.error('Erro ao abrir o container:', error);
      return res.status(500).json({ success: false, message: 'Erro ao abrir o container.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido.`);
  }
}

// Função para buscar o inventário do usuário no banco de dados
async function getUserInventory(db: Db, userId: string): Promise<UserInventory> {
  const inventoryCollection = db.collection('inventory');
  const userInventory = await inventoryCollection.findOne({ userId }) as Document | null;

  return {
    usedcards: userInventory?.usedcards || {},
    ...userInventory,
  } as UserInventory;
}

// Função para gerar um token ID aleatório
function generateTokenID(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let tokenID = 'club_';
  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    tokenID += characters.charAt(randomIndex);
  }
  return tokenID;
}

// Função para obter o próximo número disponível na edição limitada
async function getNextLimitedEditionNumber(itemId: number, db: Db): Promise<number> {
  const itemCount = await db.collection('tvl-novision').countDocuments({ id: itemId });
  const totalLimitedEdition = 100; // Ajuste conforme necessário
  return itemCount + 1 > totalLimitedEdition ? -1 : itemCount + 1;
}

  
// Função para calcular a qualidade do item com base nos proprietários anteriores
function determineItemCondition(previousOwners: string[]): string {
  const ownerCount = previousOwners.length;

  if (ownerCount === 0) {
    return 'NOVO';
  } else if (ownerCount <= 2) {
    return 'SEMINOVO';
  } else if (ownerCount <= 5) {
    return 'USADO';
  } else {
    return 'VELHO';
  }
}

// Função para ajustar o valor do item com base na condição
function adjustPriceByCondition(basePrice: number, condition: string): number {
  let price = basePrice;

  switch (condition) {
    case 'NOVO':
      // Sem ajuste para itens novos
      break;
    case 'SEMINOVO':
      price *= 0.9; // Redução de 10%
      break;
    case 'USADO':
      price *= 0.8; // Redução de 20%
      break;
    case 'VELHO':
      price *= 0.7; // Redução de 30%
      break;
  }

  return price;
}

// Modificação na função calculateItemValue para incluir a qualidade do item
async function calculateItemValue(item: Item, previousOwners: string[]): Promise<number> {
  let basePrice = item.priceitem;

  // Ajusta o valor com base na raridade (como já está feito)
  switch (item.rarity) {
    case 'comum':
      basePrice *= 1;
      break;
    case 'raro':
      basePrice *= 1.5;
      break;
    case 'épico':
      basePrice *= 2;
      break;
  }

  // Ajusta o valor com base na edição limitada (como já está feito)
  if (item.limitedEdition && item.quantity) {
    const { db } = await dbConnect();
    const totalLimitedItems = item.quantity;
    const itemCount = await db.collection('tvl-novision').countDocuments({ id: item.id });

    const percentageObtained = itemCount / totalLimitedItems;

    if (percentageObtained > 0.8) {
      basePrice *= 1.2;
    } else if (percentageObtained < 0.2) {
      basePrice *= 0.8;
    }
  }

  // Determina a qualidade do item com base nos proprietários anteriores
  const condition = determineItemCondition(previousOwners);

  // Ajusta o valor com base na condição do item
  basePrice = adjustPriceByCondition(basePrice, condition);

  // Ajusta o valor com base em outras mudanças (como já está feito)
  if (item.valueChange) {
    basePrice += item.valueChange;
  }

  return basePrice;
}
