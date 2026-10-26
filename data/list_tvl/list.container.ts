
 
export interface Item {
    id: number;
    imagem: string;
    tokenID?: string;
    uid?:string;
    sold?: boolean;
    traded?: boolean;
    advertised?: boolean;
    nameitem: string;
    priceitem: number;
    rarity: 'raro' | 'comum' | 'epico'; 
    valueChange?: number; 
    limitedEdition?: boolean;
    totalLimitedItems?: number; 
    quantity?: number; 
  }
 
  
export const containerItems: { [key: string]: Item[] } = {
    containerasyc: [
      { id: 1, imagem: 'https://i.imgur.com/s1yIcpD.png', nameitem: 'Mustang Mach-E', priceitem: 1400 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 2, imagem: 'https://i.imgur.com/uFpAKt4.png', nameitem: 'S15 Monalisa', priceitem: 4000 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 3, imagem: 'https://i.imgur.com/ibRAuaS.png', nameitem: 'Lancer Evo VIII', priceitem: 2940 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 4, imagem: 'https://i.imgur.com/I2vdyTM.png', nameitem: 'Civic EJ1', priceitem: 6700 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 5, imagem: 'https://i.imgur.com/2glLMyF.png', nameitem: 'Eclipse GS-T', priceitem: 4000 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 6, imagem: 'https://i.imgur.com/aTpVvTE.png', nameitem: 'Lancer Evo VII', priceitem: 2000 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 7, imagem: 'https://i.imgur.com/UyWr5Dn.png', nameitem: 'BMW i8', priceitem: 5000 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 8, imagem: 'https://i.imgur.com/BhT8A9G.png', nameitem: 'Mercedes A45', priceitem: 5000 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 9, imagem: 'https://i.imgur.com/wTBfz1l.png', nameitem: 'DODGE RAM TRX', priceitem: 2000 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 10, imagem: 'https://i.imgur.com/2TzDjvl.png', nameitem: 'Vision GT', priceitem: 300 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 11, imagem: 'https://i.imgur.com/kUfnhUD.png', nameitem: 'Porsche GT3', priceitem: 4000 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 12, imagem: 'https://i.imgur.com/EyySEqN.png', nameitem: 'BMW M3 G80', priceitem: 5400 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 13, imagem: 'https://i.imgur.com/nJhfyuR.png', nameitem: 'Supra MK4 FNF', priceitem: 6240 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 14, imagem: 'https://i.imgur.com/NoFjcyT.png', nameitem: 'Nissan 350Z DK', priceitem: 8490 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 15, imagem: 'https://i.imgur.com/P0QBW0S.png', nameitem: 'Killer RX7', priceitem: 7603 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 16, imagem: 'https://i.imgur.com/55TZ045.png', nameitem: 'Nissan Skyline', priceitem: 2700 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 17, imagem: 'https://i.imgur.com/u6n3984.png', nameitem: 'Jetta 3', priceitem: 1302 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 18, imagem: 'https://i.imgur.com/R1gXJxb.png', nameitem: 'Audi RS-ETRON', priceitem: 500 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 19, imagem: 'https://i.imgur.com/UEbZd9I.png', nameitem: 'Eclipse GTS', priceitem: 2402 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
       
       
    ],
    containermagnata: [
      { id: 20, imagem: 'https://i.imgur.com/MLcbLWP.png', nameitem: 'Mercedes AMG GT63', priceitem: 6000 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 21, imagem: 'https://i.imgur.com/lpPab4Z.png', nameitem: 'Mercedes GXA45', priceitem: 4600 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 22, imagem: 'https://i.imgur.com/jVrD99t.png', nameitem: 'AGERA RS', priceitem: 1958 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 23, imagem: 'https://i.imgur.com/r7RXoAi.png', nameitem: 'Tesla Model X', priceitem: 1200 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 24, imagem: 'https://i.imgur.com/S3Hk8fk.png', nameitem: 'Cayenne GT', priceitem: 5000 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 25, imagem: 'https://i.imgur.com/yLKBsmZ.png', nameitem: 'Nissan GTR Liberty', priceitem: 9582 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 26, imagem: 'https://i.imgur.com/1aynxnp.png', nameitem: 'BMW X7 M60i', priceitem: 8472 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 27, imagem: 'https://i.imgur.com/AkPE4a6.png', nameitem: 'Lamborghini Huracan Liberty Walk', priceitem: 9309 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 28, imagem: 'https://i.imgur.com/eHN1n3I.png', nameitem: 'Hilux 2021', priceitem: 400 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 29, imagem: 'https://i.imgur.com/niCYe36.png', nameitem: 'Saveiro', priceitem: 100 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 30, imagem: 'https://i.imgur.com/hOFGaUd.png', nameitem: 'Lamborghini LP700r', priceitem: 5080 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 31, imagem: 'https://i.imgur.com/7gAaDgn.png', nameitem: 'McLaren P1 GTR', priceitem: 4800 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 32, imagem: 'https://i.imgur.com/Hjf8SQs.png', nameitem: 'Bugatti Mistral', priceitem: 49402 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 33, imagem: 'https://i.imgur.com/Rh0l958.png', nameitem: 'CLR F Lumma', priceitem: 250000 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 34, imagem: 'https://i.imgur.com/J5kFh2J.png', nameitem: 'Evoque', priceitem: 2500 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 35, imagem: 'https://i.imgur.com/1d3w6Y1.png', nameitem: 'Defender 130', priceitem: 3402 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 36, imagem: 'https://i.imgur.com/Rg72enL.png', nameitem: 'Porsche 992', priceitem: 3000 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 37, imagem: 'https://i.imgur.com/dhUkrtN.png', nameitem: 'Saveiro G7', priceitem: 130 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 38, imagem: 'https://i.imgur.com/BYg47io.png', nameitem: 'BMW M8 GTE', priceitem: 9509 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 39, imagem: 'https://i.imgur.com/eHN1n3I.png', nameitem: 'Hilux', priceitem: 600 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 40, imagem: 'https://i.imgur.com/jVrD99t.png', nameitem: 'AGERA RS', priceitem: 9573 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 41, imagem: 'https://i.imgur.com/lpPab4Z.png', nameitem: 'Mercedes GXA45', priceitem: 1932 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 42, imagem: 'https://i.imgur.com/SQkFPWL.png', nameitem: 'Lamborghini Aventador', priceitem: 7800 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 }
      
    ],

    containerbig: [
      { id: 52, imagem: 'https://i.imgur.com/D3szMH1.png', nameitem: 'McLaren P1', priceitem: 7832 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 53, imagem: 'https://i.imgur.com/Ov5Ifuq.png', nameitem: 'Honda FK8', priceitem: 1489 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 54, imagem: 'https://i.imgur.com/FRcYxvx.png', nameitem: 'BMW X6', priceitem: 4352 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 55, imagem: 'https://i.imgur.com/8PjtuBG.png', nameitem: 'BMW M135i', priceitem: 9582 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 56, imagem: 'https://i.imgur.com/m52curh.png', nameitem: 'Ferrari 488GTB', priceitem: 1349 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 57, imagem: 'https://i.imgur.com/yKSe5Dl.png', nameitem: 'Nissan 370z', priceitem: 1922 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 58, imagem: 'https://i.imgur.com/xkFiVcJ.png', nameitem: 'Mitsubishi Lancer Evolution X Varis', priceitem: 5432 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 59, imagem: 'https://i.imgur.com/rLiJJQO.png', nameitem: 'Subaru WRX STI', priceitem: 5621 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 60, imagem: 'https://i.imgur.com/4dlcupf.png', nameitem: 'Jeep Gladiator', priceitem: 2592 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 61, imagem: 'https://i.imgur.com/628QS4r.png', nameitem: 'Mercedes AMG', priceitem: 2040 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 62, imagem: 'https://i.imgur.com/SPTKDVu.png', nameitem: 'Chevrolet TrailBlazer', priceitem: 1040 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 63, imagem: 'https://i.imgur.com/0XHawq3.png', nameitem: 'Amarok Rebaixada', priceitem: 1000 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 64, imagem: 'https://i.imgur.com/M0fzcqH.png', nameitem: 'Dodge Charger', priceitem: 2400 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 65, imagem: 'https://i.imgur.com/TA3nlxo.png', nameitem: 'Porsche 911 stinger', priceitem: 3770 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 66, imagem: 'https://i.imgur.com/NDpFhiw.png', nameitem: 'BMW 135i', priceitem: 1394 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 67, imagem: 'https://i.imgur.com/yFXyJxk.png', nameitem: 'Ferrari Aperta', priceitem: 12095 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 68, imagem: 'https://i.imgur.com/pTJRsBh.png', nameitem: 'Ferrari FC15', priceitem: 18032 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 69, imagem: 'https://i.imgur.com/H3J9BGu.png', nameitem: 'Lamborghini Huracan', priceitem: 9403 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 70, imagem: 'https://i.imgur.com/RJIWNCh.png', nameitem: 'BMW Z4', priceitem: 1942 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 71, imagem: 'https://i.imgur.com/ABG007l.png', nameitem: 'Nissan Gtr Nismo', priceitem: 2942 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },


     
        { id: 77, imagem: 'https://i.imgur.com/1UZG38h.png', nameitem: 'BMW M4 GTS', priceitem: 1500 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
        { id: 78, imagem: 'https://i.imgur.com/F7rV64E.png', nameitem: 'BMW BOLTZ', priceitem: 1020 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
        { id: 79, imagem: 'https://i.imgur.com/W4BmSSQ.png', nameitem: 'BMW M8', priceitem: 1020 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
        { id: 80, imagem: 'https://i.imgur.com/6rHQeDA.png', nameitem: 'Nissan Skyline GTR R34 Garson', priceitem: 3011 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
        { id: 81, imagem: 'https://i.imgur.com/mFds9oc.png', nameitem: 'Audi TT', priceitem: 2000 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
        { id: 82, imagem: 'https://i.imgur.com/rFdYHZY.png', nameitem: 'Lamborghini Veneno', priceitem: 6530 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
        { id: 83, imagem: 'https://i.imgur.com/GiB3LVW.png', nameitem: 'Nissan Titan Warrior Trendsetter', priceitem: 1302 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
        { id: 84, imagem: 'https://i.imgur.com/WngJsxT.png', nameitem: 'Porsche 918', priceitem: 1302 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 }
            
        
    ],  
     
    containersheriff: [
      { id: 85, imagem: 'https://i.imgur.com/Wm2jmCo.png', nameitem: 'R35 Kuromi', priceitem: 6530 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 86, imagem: 'https://i.imgur.com/7JmP7ib.png', nameitem: 'S15 Nihil Red', priceitem: 1570 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 87, imagem: 'https://i.imgur.com/rHp7YyL.png', nameitem: 'Veneno Death Metal', priceitem: 6530 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 88, imagem: 'https://i.imgur.com/YafTNks.png', nameitem: 'S15 Nihil White', priceitem: 1943 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 89, imagem: 'https://i.imgur.com/zjANUqt.png', nameitem: 'R34 Red Dragon', priceitem: 4503 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 90, imagem: 'https://i.imgur.com/TCtIPcb.png', nameitem: 'R34 Blue Dragon', priceitem: 4973 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 91, imagem: 'https://i.imgur.com/7vXVgxe.png', nameitem: 'Escalade Sport 2023', priceitem: 4500 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
      { id: 92, imagem: 'https://i.imgur.com/byaLjek.png', nameitem: 'R35 Sakura', priceitem: 6592 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
      { id: 93, imagem: 'https://i.imgur.com/ofQQQac.png', nameitem: '370z Ruby Tiger', priceitem: 2498 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 94, imagem: 'https://i.imgur.com/3uDg8oq.png', nameitem: 'ZX10-R KRT Edition', priceitem: 4039 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
      { id: 95, imagem: 'https://i.imgur.com/Q1OjmZU.png', nameitem: 'Mustang Dawnstang', priceitem: 1394 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
  ],
  

  containerbarbara: [
    { id: 45646, imagem: 'https://i.imgur.com/ZOViXbv.png', nameitem: 'Yamaha MT-09', priceitem: 2482 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
    { id: 55469, imagem: 'https://i.imgur.com/jLwlbyj.png', nameitem: 'Z1000', priceitem: 250000 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
    { id: 45660, imagem: 'https://i.imgur.com/JeVOoiy.png', nameitem: 'Yamaha R1', priceitem: 2234 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
    { id: 43, imagem: 'https://i.imgur.com/MWIxNrF.png', nameitem: 'Camaro zl', priceitem: 3465 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
    { id: 44, imagem: 'https://i.imgur.com/tk6S45j.png', nameitem: 'Hummer EV SUV', priceitem: 6853 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
    { id: 45, imagem: 'https://i.imgur.com/KzEmaoO.png', nameitem: 'Golf GTI Rebaixado', priceitem: 6530 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
    { id: 46, imagem: 'https://i.imgur.com/3PLNdQh.png', nameitem: 'Ferrari FXX-K evo', priceitem: 7354 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
    { id: 47, imagem: 'https://i.imgur.com/eDD8kuI.png', nameitem: 'BMW X7 M60i', priceitem: 4049 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
    { id: 48, imagem: 'https://i.imgur.com/r7RXoAi.png', nameitem: 'Tesla Model X', priceitem: 4593 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
    { id: 49, imagem: 'https://i.imgur.com/kTWC3S0.png', nameitem: 'BMW X6 F96', priceitem: 3934 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
    { id: 50, imagem: 'https://i.imgur.com/mRGNdbz.png', nameitem: 'Audi R8v10', priceitem: 2408 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
    { id: 51, imagem: 'https://i.imgur.com/Hah6FoW.png', nameitem: 'AMG GTG3S', priceitem: 3395 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
    { id: 72, imagem: 'https://i.imgur.com/ljiN5mG.png', nameitem: 'Ferrari Italia', priceitem: 2508 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
    { id: 73, imagem: 'https://i.imgur.com/FX0jgtq.png', nameitem: 'Pagani Huayra', priceitem: 4383 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
    { id: 74, imagem: 'https://i.imgur.com/MFXgcOG.png', nameitem: 'Nissan Silvia S14 Zenki', priceitem: 5323 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
    { id: 75, imagem: 'https://i.imgur.com/eLrOTHl.png', nameitem: 'Ford Mustang', priceitem: 5222 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
    { id: 76, imagem: 'https://i.imgur.com/pKdhOQr.png', nameitem: 'Lancer Evolution X', priceitem: 3050 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
],

containerbigode: [
  { id: 534352, imagem: 'https://i.imgur.com/wZZY6Vu.png', nameitem: 'Ducatti DM1200', priceitem: 6530 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 4353, imagem: 'https://i.imgur.com/gewQrM6.png', nameitem: 'CB500x', priceitem: 3432 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
  { id: 55754, imagem: 'https://i.imgur.com/eR9Qt3F.png', nameitem: 'XJ6', priceitem: 3489 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
  { id: 73483, imagem: 'https://i.imgur.com/54gcv75.png', nameitem: 'Africa Twin', priceitem: 4958 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 46483, imagem: 'https://i.imgur.com/MGKI1CH.png', nameitem: 'Yamaha R1', priceitem: 4395 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 9574, imagem: 'https://i.imgur.com/T5Z340X.png', nameitem: 'Tiger 1200', priceitem: 2849 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 94943, imagem: 'https://i.imgur.com/t3XzyoB.png', nameitem: 'R1 2021', priceitem: 2495 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 5494, imagem: 'https://i.imgur.com/GoVnbTb.png', nameitem: 'XT66', priceitem: 1295 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
  { id: 2804, imagem: 'https://i.imgur.com/cqxAEGg.png', nameitem: 'R1200 GS', priceitem: 2948 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 60584, imagem: 'https://i.imgur.com/PSEf1AJ.png', nameitem: 'XT 660', priceitem: 1200 ,rarity: 'comum' ,  limitedEdition: true ,  quantity: 10 },
  { id: 38495, imagem: 'https://i.imgur.com/H9XPiHL.png', nameitem: 'GSXR', priceitem: 4533 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 2094, imagem: 'https://i.imgur.com/rbbBOQl.png', nameitem: 'BMWS', priceitem: 5201 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 5484, imagem: 'https://i.imgur.com/vGuWkcN.png', nameitem: 'Triumph Tiger 1200', priceitem: 1309 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 64457, imagem: 'https://i.imgur.com/sJDlWoB.png', nameitem: 'BMW S1000 01', priceitem: 2402 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 45745, imagem: 'https://i.imgur.com/jkQPNJu.png', nameitem: 'R1250', priceitem: 1940 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 75457, imagem: 'https://i.imgur.com/ttEXHgC.png', nameitem: 'Tiger 900', priceitem: 1030 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 34635, imagem: 'https://i.imgur.com/MXqFIOv.png', nameitem: 'Yamaha MT-07', priceitem: 13029 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },

  { id: 83743, imagem: 'https://i.imgur.com/DRfzBVW.png', nameitem: 'Kawasaki ZX10R', priceitem: 1392 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 54643, imagem: 'https://i.imgur.com/ISQDvva.png', nameitem: 'CB 1000', priceitem: 3853 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 7879, imagem: 'https://i.imgur.com/4R0waYn.png', nameitem: 'Tracer 900', priceitem: 5927 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 45634, imagem: 'https://i.imgur.com/6UqgRNr.png', nameitem: 'BMW S1000 02', priceitem: 20295 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
],


containerjason: [
  { id: 54562, imagem: 'https://i.imgur.com/pGcoWeP.png', nameitem: 'Mercedes-AMG GLE 63 S Coupé', priceitem: 4023 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 46456, imagem: 'https://i.imgur.com/XpCAUrX.png', nameitem: 'Suprapandem', priceitem: 5938 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 54574, imagem: 'https://i.imgur.com/OtqXo9p.png', nameitem: 'fox720m', priceitem: 3049 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 5853, imagem: 'https://i.imgur.com/DWHcVnQ.png', nameitem: 'Focus RS Custom', priceitem: 1948 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 32463, imagem: 'https://i.imgur.com/CUxGduf.png', nameitem: 'BMW X5', priceitem: 3929 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 745544, imagem: 'https://i.imgur.com/JV6rZkT.png', nameitem: 'BMW M5 Competition', priceitem: 9404 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 47443, imagem: 'https://i.imgur.com/4GXgwoW.png', nameitem: 'Audi e Tron', priceitem: 2847 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 4578, imagem: 'https://i.imgur.com/B6djThq.png', nameitem: 'Purosangue', priceitem: 562950 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 84784, imagem: 'https://i.imgur.com/o017xKh.png', nameitem: 'Lancer evo9 2022', priceitem: 5984 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 83478, imagem: 'https://i.imgur.com/H3ol1Op.png', nameitem: 'MERCEDES BENZ GLE 53', priceitem: 6530 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 68493, imagem: 'https://i.imgur.com/cPTVa5y.png', nameitem: 'La Ferrari', priceitem: 4993 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 85794, imagem: 'https://i.imgur.com/OmNkhNc.png', nameitem: 'BMW X7 BLD', priceitem: 4922 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 684883, imagem: 'https://i.imgur.com/fYbIylh.png', nameitem: 'Lamborghini ahksv', priceitem: 2492 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 5404803, imagem: 'https://i.imgur.com/PhVYJUd.png', nameitem: 'MERCEDES c63', priceitem: 1383 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 49468, imagem: 'https://i.imgur.com/Tqyu1pE.png', nameitem: 'Ferrari italia', priceitem: 1448 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 45565, imagem: 'https://i.imgur.com/ffxEeav.png', nameitem: 'fox720m', priceitem: 1948 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 205854, imagem: 'https://i.imgur.com/K9g1RZK.png', nameitem: 'Corvette Pandem', priceitem: 2957 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 94739, imagem: 'https://i.imgur.com/kl8I24k.png', nameitem: 'AZERA 2024', priceitem: 2958 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 8373, imagem: 'https://i.imgur.com/LC9UP7n.png', nameitem: 'Nissan R35', priceitem: 5032 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 84783, imagem: 'https://i.imgur.com/lqkhLT5.png', nameitem: 'Alfa Romeo Giulia', priceitem: 20382 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 40895, imagem: 'https://i.imgur.com/861TkCe.png', nameitem: 'Novo SkylineR34', priceitem: 65859 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 308598, imagem: 'https://i.imgur.com/PYpLb5q.png', nameitem: 'Dodgechallenger', priceitem: 20405 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
],
containermarcos: [
  { id: 474, imagem: 'https://i.imgur.com/3FYWfS1.png', nameitem: 'Toyota Supra', priceitem: 4948 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 56543, imagem: 'https://i.imgur.com/Kl6PXNk.png', nameitem: 'Porsche 718B', priceitem: 4833 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 3636, imagem: 'https://i.imgur.com/lRB3GBI.png', nameitem: 'Bentley Continental', priceitem: 6530 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 59747, imagem: 'https://i.imgur.com/A3UpXNQ.png', nameitem: 'Charger69', priceitem: 9707 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 69208, imagem: 'https://i.imgur.com/dffbvBp.png', nameitem: 'Lambo Evo', priceitem: 30289 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 59479, imagem: 'https://i.imgur.com/4ayw2TM.png', nameitem: 'audirs7', priceitem: 5053 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 20289, imagem: 'https://i.imgur.com/J9u3Tkv.png', nameitem: 'Nissan 240SX', priceitem: 3985 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 205894, imagem: 'https://i.imgur.com/4U2rpnH.png', nameitem: 'Bugatti CHIRON300', priceitem: 27894 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 48849, imagem: 'https://i.imgur.com/na4JcYE.png', nameitem: 'Fox 720M', priceitem: 3958 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 575675, imagem: 'https://i.imgur.com/9DwG9to.png', nameitem: 'Mercedes gt63', priceitem: 8438 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
  { id: 754804, imagem: 'https://i.imgur.com/AeixXYh.png', nameitem: 'Porsche 911R', priceitem: 3593 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 598540, imagem: 'https://i.imgur.com/dsLF8Z8.png', nameitem: 'Brabus D35', priceitem: 4573 ,rarity: 'raro' ,  limitedEdition: true ,  quantity: 10 },
  { id: 349004, imagem: 'https://i.imgur.com/xqdoHzq.png', nameitem: 'Lamborghini Madressenza', priceitem: 166530 ,rarity: 'epico' ,  limitedEdition: true ,  quantity: 10 },
],
  };

 