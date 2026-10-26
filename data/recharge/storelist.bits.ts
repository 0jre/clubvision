type BuyBits = {
    image: string;
    amount: number;
    price: number;
    title: string;
  };
  
  // Lista de Bits para Contas Prime
  const primeStoreList: BuyBits[] = [
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 1000,
      price: 35000,
      title: '1.000 Bits ',
    },
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 2500,
      price: 87500,
      title: '2.500 Bits ',
    },
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 5000,
      price: 175000,
      title: '5.000 Bits ',
    },
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 10000,
      price: 350000,
      title: '10.000 Bits ',
    },
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 25000,
      price: 875000,
      title: '25.000 Bits ',
    },
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 50000,
      price: 1750000,
      title: '50.000 Bits ',
    },
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 100000,
      price: 3500000,
      title: '100.000 Bits ',
    },
  ];
  
  // Lista de Bits para Contas Não Prime
  const nonPrimeStoreList: BuyBits[] = [
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 1000,
      price: 100000,
      title: '1.000 Bits ',
    },
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 2500,
      price: 250000,
      title: '2.500 Bits ',
    },
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 5000,
      price: 500000,
      title: '5.000 Bits ',
    },
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 10000,
      price: 1000000,
      title: '10.000 Bits ',
    },
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 25000,
      price: 2500000,
      title: '25.000 Bits ',
    },
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 50000,
      price: 5000000,
      title: '50.000 Bits ',
    },
    {
      image: '/icons/coins/3uj834ijui4b38h.webp',
      amount: 100000,
      price: 10000000,
      title: '100.000 Bits ',
    },
  ];


  // Lista de Bits para Contas Prime via Stripe
const StripeStoreList: BuyBits[] = [
  {
        image: '/icons/coins/3uj834ijui4b38h.webp',
        amount: 1000,
        price: 1300, // R$ 13,00 em centavos
        title: '1.000 Bits',
    },
    {
        image: '/icons/coins/3uj834ijui4b38h.webp',
        amount: 2500,
        price: 3250, // R$ 32,50 em centavos
        title: '2.500 Bits',
    },
    {
        image: '/icons/coins/3uj834ijui4b38h.webp',
        amount: 5000,
        price: 6500, // R$ 65,00 em centavos
        title: '5.000 Bits',
    },
    {
        image: '/icons/coins/3uj834ijui4b38h.webp',
        amount: 10000,
        price: 13000, // R$ 130,00 em centavos
        title: '10.000 Bits',
    },
    {
        image: '/icons/coins/3uj834ijui4b38h.webp',
        amount: 25000,
        price: 32500, // R$ 325,00 em centavos
        title: '25.000 Bits',
    },
    {
        image: '/icons/coins/3uj834ijui4b38h.webp',
        amount: 50000,
        price: 65000, // R$ 650,00 em centavos
        title: '50.000 Bits',
    },
    {
        image: '/icons/coins/3uj834ijui4b38h.webp',
        amount: 100000,
        price: 130000, // R$ 1.300,00 em centavos
        title: '100.000 Bits',
    },
];
  
  // Exportando as listas para uso em outros arquivos
  export { primeStoreList, nonPrimeStoreList,StripeStoreList };
  