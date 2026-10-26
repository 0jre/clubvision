type BuyStore = {
    description?: any;
    image: string;
    receive: string;
    price: number;
    title: string;
    itemQuantity?: number;
 
  };
  
  const BigboxList: BuyStore[] = [
    {
      image: '/theim/cards/hnmkdsfnsmddf.jpg',
      receive: 'containerbig', // ID ou valor usado na API
      price: 1000000,
      title: 'Big Force',
      itemQuantity: 1,
    },
   

    {
        image: '/theim/cards/jnbujmnjckkkbhjdx.jpg',
        receive: 'containersheriff', // ID ou valor usado na API
        price: 1000000,
        title: 'Sheriffe',
        itemQuantity: 1,
    },
     
  
    {
        image: '/theim/cards/hjnbnimkbuznc.jpg',
        receive: 'containerbarbara', // ID ou valor usado na API
        price: 4300000,
        title: 'Barbara',
        itemQuantity: 1,
    },
     
    
    {
        image: '/theim/cards/hsvyfnbucndbn.jpg',
        receive: 'containerbigode', // ID ou valor usado na API
        price: 5100000,
        title: 'Bigode',
        itemQuantity: 1,
    },

    {
        image: '/theim/cards/jnjfbsndicbuns.jpg',
        receive: 'containerjason', // ID ou valor usado na API
        price: 2600000,
        title: 'Julio',
        itemQuantity: 1,
    },


    {
        image: '/theim/cards/hundsbfubncd.jpg',
        receive: 'containermagnata', // ID ou valor usado na API
        price: 2300000,
        title: 'Magnata Steve',
        itemQuantity: 1,
    },


    {
        image: '/theim/cards/njmcnbunin.jpg',
        receive: 'containerasyc', // ID ou valor usado na API
        price: 2400000,
        title: 'Asyc',
        itemQuantity: 1,
    },

    
    {
        image: '/theim/cards/nmbzumnbunix.jpg',
        receive: 'containermarcos', // ID ou valor usado na API
        price: 3000000,
        title: 'Marcos',
        itemQuantity: 1,
    },
  
  ];
  
  export { BigboxList };
  
