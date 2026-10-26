import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';
import { getItemsForCase, getItemsForContainer } from '@/types/clubstore/list.opencontainer';

interface Item {
  _id: string;
  userId: string;
  id: number;
  tokenID: string;
  createdAt: string;
  open: string; // containerType
  itemValue: number;
  valueChange?: number;
  limitedEdition?: boolean;
  numberItem?: string; // Ex: "1 de 100"
}

 
export interface ValueHistory {
  newValue: number;
  timestamp: string;
}
 
const containerNames: { [key: string]: string } = {
  containersheriff: "Sheriff",
  containermagnata: "Magnata",
  containerbigode: "Bigode",
  containerbarbara: "Bárbara",
  containermarcos: "Marcos",
  containerjason: "Julio",
  containerasyc: "Asyc",
  containerbig: "Julio"
};

export async function GetMyTvL(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` });
  }

  const { userId } = req.query;

  if (typeof userId !== 'string') {
    return res.status(400).json({ success: false, message: 'userId é necessário e deve ser uma string.' });
  }

  try {
    const { db } = await dbConnect();
    const collection = db.collection<Item>('tvl-novision');
    const inventoryCollection = db.collection('inventory'); // Coleção para verificar usedcards
    const marketPriceCollection = db.collection('tvl-marketprice'); // Coleção para obter histórico de preços

    // Buscar itens do usuário
    const userItems = await collection.find({ userId }).sort({ createdAt: -1 }).toArray();
    if (userItems.length === 0) {
      return res.status(404).json({ success: false, message: 'Nenhum item encontrado para o usuário.' });
    }

    // Buscar dados do usuário na coleção 'inventory'  
    const inventory = await inventoryCollection.findOne({ userId });
    if (!inventory) {
      return res.status(404).json({ success: false, message: 'Não foi possivel encontrar o inventario do usuario!' });
    }

    
    // Buscar histórico de preços para cada item
    // Buscar histórico de preços para cada item
const itemIds = userItems.map(item => item.id);
const priceHistories = await marketPriceCollection.find({ id: { $in: itemIds } }).toArray();
const priceHistoryMap = priceHistories.reduce<{ [key: number]: ValueHistory[] }>((acc, record) => {
  acc[record.id] = record.valueHistory ?? [];
  return acc;
}, {});

// Mapear os itens do usuário para incluir detalhes dos itens disponíveis e histórico de preços
const responseItems = userItems
  .map((item) => {
    // Verifica se inventory.usedcards existe antes de acessar tokenID
    if (!inventory?.usedcards) return null;

    // Encontrar o containerType para o item baseado no tokenID
    const usedCard = inventory.usedcards[item.tokenID];
    if (!usedCard) return null; // Ignorar se não houver um cartão usado

    const containerType = usedCard.open;
    const friendlyName = containerNames[containerType] || 'Desconhecido';

    const availableItems = getItemsForContainer(containerType) || []; // Evitar undefined
    const foundItem = availableItems.find((availableItem) => availableItem.id === item.id);

    if (foundItem) {
      return {
        ...item,
        ...foundItem,
        containerType: friendlyName,
        itemValue: item.itemValue ?? foundItem.priceitem,
        valueHistory: priceHistoryMap[item.id] ?? [], // Garante que sempre seja um array
      };
    }

    return null; // Ignorar se não encontrou um item correspondente
  })
  .filter((item): item is Required<typeof item> => item !== null); // Filtra os itens nulos


 
    // Separando os itens em 'items' e 'mytvls'
    const items = responseItems ;  
  const safeArray = <T>(val: T[] | undefined | null): T[] => Array.isArray(val) ? val : [];

const mytvlIds = safeArray(inventory.mytvls).map((mytvl: any) => mytvl.id);


const mytvlItems = mytvlIds.length
  ? await collection.find({ userId, id: { $in: mytvlIds } }).toArray()
  : [];

const mytvls = mytvlItems.map((dbItem) => {
  const rentalInfo = safeArray(inventory.mytvls).find((mytvl: any) => mytvl.id === dbItem.id);
  const caseItem = getItemsForCase(dbItem.id) || {};
  return {
    ...dbItem,
    ...caseItem,
    ...(rentalInfo && typeof rentalInfo === 'object' ? rentalInfo : {}),
    valueHistory: priceHistoryMap[dbItem.id] || [],
  };
});


    res.status(200).json({
      success: true,
      mytvls,  // Retorna todos os mytvl
      items,   // Retorna todos os itens com ou sem mytvl
    });
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar itens do usuário.' });
  }
}
