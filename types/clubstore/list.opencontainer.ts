import { containerItems } from '@/data/list_tvl/list.container';
 
interface Item {
  
  quantity?: number;
  id: number;
  imagem: string;
  nameitem: string;
  priceitem: number;
  valueChange?: number;
  limitedEdition?: boolean;
  numberItem?: string;  
  rarity?: string;
}
 

export const rentables = [
  'keymaster',
  'contractmiss', 
  'visiondrop',
  'contractvision',
  'contractunix',
  'contractax',
  'contractcla',
];

export function getItemsForContainer(containerType: string | null): Item[] {
  return containerType ? containerItems[containerType] || [] : [];
}


export function getItemsForCaseX(): Item[] {
  // Retorna todos os itens de todos os containers
  let allItems: Item[] = [];
  
  for (const containerType in containerItems) {
    allItems = [...allItems, ...containerItems[containerType]];
  }

  return allItems;
}


export function getItemsForCase(mytvlId: number) {
  const allItems = getItemsForCaseX();  // Obtém todos os itens de todos os containers
  return allItems.find((item) => item.id === mytvlId);  // Retorna o item que tem o id correspondente ao mytvlId
  }


export function getItemsForCaseZX(mytvlId: number): Item[] {
    const allItems = getItemsForCaseX();
    return allItems.filter((item) => item.id === mytvlId); // Retorna uma lista (mesmo que tenha um só item)
}

