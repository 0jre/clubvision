export interface Notification {
  date: string;
  time: string;
  amount: number;
  action: string;
  bits: number;
  currency: string;
  isoDate: string
  result: string | undefined;
  newAmount: number;
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  status: 'succeeded' | 'pending' | 'failed';
  fees: number;
  contract: boolean;
  staking: boolean;
  transfer:{
    from: {
      discriminator: string;
      avatar: string;
      name: string;
    }
    to: {
      discriminator: string;
      avatar: string;
      name: string;
    }
  }

  item: {
   name: string
   quantity: string
   description: string
   receive: string
   image: string
   action: string;
   price: number
   chance: string;
   uid: string;
   subdominio: string;
   identityVid: boolean

  item:{
  id: number
  imagem: string
  nameitem: string
  priceitem: number
  rarity: string
  limitedEdition: boolean
  quantity: number
  chance: string
  adjustedChance: number

   }
  }
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
    senttransfer: 'Tranferencia',
    receivetransfer: 'Depositado',
    receive_orbs: 'Recebeu Orbits',
    staking_orbs: 'Orbits em Staking',
    receive_bits: 'Recebeu em Bits',
    recharge_bits: 'Compra de Bits',
    transaction: 'Transação feita',
    purchase_tokens: 'Comprou tokens',
    purchase_openbox: 'Abriu uma caixa'
  };


export const RECEIVED_ACTION = [
  'receive_orbs',
  'recharge_bits',
   'receive_bits',
];

export const RECEIVED_ACTION_BITS = [
 
  'recharge_bits',
  'purchase_bits',
  'receive_bits',
];

export const actionDescriptions: { [key: string]: string } = {
  'convert_to_banking': 'Enviado para a carteira',
  'convert_from_banking': 'Compra',
  'convert_to_coins': 'Enviado para Orbit',
  'convert_from_coins': 'Conversão de Orbit',
  'clan_creation': 'Criou um clã',
  'video_post_creation': 'Postagem no vision',
  'post_creation': 'Postagem no vision',
  'double_orbit': 'Aposta no Double',
  'senttransfer': 'Tranferencias',
  'receivetransfer': 'Recebeu ',
  'funds': 'Fundos em Orbits ',
  'purchase_': 'Compra realizada',
  'purchase_bits': 'Compra de Bits',
  'receive_orbs': 'Recebeu Orbits',
  'staking_orbs': 'Orbits em Staking',
  'transaction': 'Transação feita',
  'purchase_tokens': 'Comprou tokens',
  'purchase_openbox': 'Abriu uma caixa',
  'receive_bits': 'Recebeu em Bits',
};

export type ContainerTypes = 
  | 'containermarcos'
  | 'containerbig'
  | 'containersheriff'
  | 'containerbarbara'
  | 'containerbigode'
  | 'containerjason'
  | 'containermagnata'
  | 'containerasyc'
  | 'keymaster'            
  | 'alladin'             
  | 'contractmiss'        
  | 'visiondrop'          
  | 'contractcla'         
  | 'keyplusinvite'       
  | 'usedLimitInvite'     
  | 'maxlimitinvite'      
  | 'contractunix'        
  | 'limitipost'          
  | 'contractax'          
  | 'contractvision'       
  | 'socioclub';          


export const containerUpdates: Record<ContainerTypes, string> = {
    containermarcos: 'container do marcos',
    containerbig: 'container do Big',
    containersheriff: 'container do sheriff',
    containerbarbara: 'container da barbara',
    containerbigode: 'container do bigode',
    containerjason: 'container do jason',
    containermagnata: 'container do Magnata',
    containerasyc: 'container da asyc',
    keymaster: 'chave Key Master',             
    alladin: 'Chave Alladin',                   
    contractmiss: 'Contrato Missão',         
    visiondrop: 'licença vision Drop',            
    contractcla: 'Contrato criação de cla',           
    keyplusinvite: 'Chave mais convite',     
    usedLimitInvite: 'Aumentar limite de convite',   
    maxlimitinvite: 'Max Limit Invite',    
    contractunix: 'Contrato Unix',         
    limitipost: 'Limite iPost',          
    contractax: 'Contrato AX',           
    contractvision: 'Contrato Vision',    
    socioclub: 'Socio Clubvision',       
   
  };
  