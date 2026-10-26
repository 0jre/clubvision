type BuyStore = {
  image: string;
  receive: string;
  price: number;
  title: string;
  description: string;
  itemQuantity?: number; // Tornar a quantidade opcional
};

const BigtoreList: BuyStore[] = [
  {
    image: '/theim/cards/ldksjnaudskabd.png',
    receive: 'keymaster', // ID ou valor usado na API
    price: 4300,
    title: 'Chave Master',
    description: 'Desbloqueie o potencial máximo com a Chave Master. Ao utilizá-la, você multiplica por 12 o ganho de XP em todas as suas atividades dentro do club. Ideal para quem busca avançar rapidamente e alcançar novos níveis.',
  },
 
  {
    image: '/theim/cards/gbdasnhdvaduad.png',
    receive: 'keyplusinvite', // ID ou valor usado na API
    price: 8650,
    title: 'Chave invite friend',
    description: 'Com este token, você pode convidar amigos de forma fácil e rápida. Economize tempo ao enviar um único convite para múltiplos amigos. Ideal para expandir sua rede de contatos no club.',
  },
 
  {
    image: '/theim/cards/fsjubfisnfjvhunyvc.png',
    receive: 'contractmiss', // ID ou valor usado na API
    price: 18900,
    title: 'Contrato Missões',
    description: 'Com o Contrato de Missões ativado, suas recompensas em ORBS são multiplicadas. Em vez dos tradicionais 1 a 1500 ORBS, agora você pode ganhar entre 8.000 a 25.000 ORBS por missão completada no club.',
  },
  {
    image: '/theim/cards/fsjubfisnfjvhunyvc.png',
    receive: 'visiondrop', // ID ou valor usado na API
    price: 17690,
    title: 'Contrato VISION Drops',
    description: 'Ative este contrato e tenha a chance de receber Drops valiosos a cada 6 dias. Os Drops podem conter ORBS, chaves, contratos, e até um prime de 30 dias. Há uma chance de 5% de obter um Drop, e cada um pode trazer surpresas incríveis ou estar vazio.',
  },
  {
    image: '/theim/cards/fsjubfisnfjvhunyvc.png',
    receive: 'contractcla', // ID ou valor usado na API
    price: 14000,
    title: 'Contrato (Liberação para criar clã)',
    description: ' Crie seu próprio clã. Este contrato permite que você crie um grupo com até 30 membros, estabelecendo sua própria comunidade dentro do club.',
  },
  {
    image: '/theim/cards/fsjubfisnfjvhunyvc.png',
    receive: 'contractsize', // ID ou valor usado na API
    price: 10200,
    title: 'Contrato Clã (Aumentar tamanho)',
    itemQuantity: 1, // Exemplo de uso para itemQuantity
    description: 'Expanda seu clã. Cada contrato adquirido aumenta o tamanho do seu clã, permitindo que você lidere uma comunidade ainda maior dentro do club.',
  },
  {
    image: '/theim/cards/fsjubfisnfjvhunyvc.png',
    receive: 'contractax', // ID ou valor usado na API
    price: 7500,
    title: 'Contrato (Anti taxas)',
    description: ' Elimine as taxas incômodas dentro do club. Com este contrato, todas as suas transações são livres de taxas, permitindo que você maximize seus ganhos e economias.',
  },
  {
    image: '/theim/cards/kindomkin9jonunbv.png',
    receive: 'tokeninvite', // ID ou valor usado na API
    price: 3000,
    title: 'Tokens convite (REABASTECER)',
    itemQuantity: 1, // Exemplo de uso para itemQuantity
    description: 'Reabasteça seus tokens de convite e continue expandindo a comunidade. Ao utilizar este item, você zera a contagem de convites, permitindo que você continue convidando novos membros.',
  },
  {
    image: '/theim/cards/hbjnviyvhuddc.png',
    receive: 'maxlimitinvite', // ID ou valor usado na API
    price: 5400,
    title: '+ CONVITES ',
    itemQuantity: 1, // Exemplo de uso para itemQuantity
    description: 'Aumente o limite de convites disponíveis.',
  },
  {
    image: '/theim/cards/sfbsdufnsb.png',
    receive: 'contractunix', // ID ou valor usado na API
    price: 9320,
    title: '+ Univision X',
    description: 'Com o Univision X ativado, você passa a receber 15% das transações realizadas na comunidade, em vez dos tradicionais 1 a 5%. Aumente seus ganhos passivos e aproveite ao máximo as transações do club.',
  },
  {
    image: '/theim/cards/hbjnviyvhuddc.png',
    receive: 'limitipost', // ID ou valor usado na API
    price: 1500,
    title: '+ Espaços (Vision Post)',
    itemQuantity: 1, // Exemplo de uso para itemQuantity
    description: 'Adicione  espaços adicionais para postagem de fotos e vídeos no club. Ideal para quem deseja compartilhar mais conteúdo e se destacar na comunidade.',
  },
  {
    image: '/theim/cards/ldksjnaudskabd.png',
    receive: 'contractvision', // ID ou valor usado na API
    price: 8900,
    title: 'Chave VISION',
    description: 'Com a Chave VISION, você não precisará pagar por postagens no club. Este item é essencial para usuários ativos que desejam compartilhar conteúdo sem custos adicionais.',
  },
 
];

export { BigtoreList };
