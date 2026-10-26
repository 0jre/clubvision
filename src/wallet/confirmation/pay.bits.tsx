 import Image from 'next/image';
import styled from "styled-components";
import HeadGlobal from "@/club/head/glob.n";

import React, { useEffect, useRef, useState } from 'react';
import { decrypt } from "@/core/security/encryption";
import { UserInfo } from "@/types/discord/usersearch";
import axios from "axios";
import { primeStoreList, nonPrimeStoreList, StripeStoreList } from "@/data/recharge/storelist.bits";
import LoadingPageView from "@club/resources/loading/market.loading";
import { useRouter } from 'next/router';
import AccountNvxre from '@club/components/account/account.user';
import { GetInfo_nvxre_xyloQuerier } from '@/hooks/InfoData';


interface Props {
    id: string
}

export default function Payment_bits ({id} : Props) {  
  const router = useRouter();
  const [payusedorbit, setPayUsedOrbit] = useState(false);
  const [payusedreal, setPayUsedReal] = useState(true);
  const [amount, setAmount] = useState<number>(0); 
  const [isAnimating, setIsAnimating] = useState(true);
  const [bitsReceived, setBitsReceived] = useState<number>(0); 
  const [totalPrice, setTotalPrice] = useState<number>(0); 
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isload, setloading] = useState(false);
  const [isopenmobile, setopenmobile ] = useState(true)
  const [originalBitsReceived, setOriginalBitsReceived] = useState<number>(0); 
  const [animatedAmount, setAnimatedAmount] = useState(0);  
  const { isLoadingx, error, userInfoObject,mutate } = GetInfo_nvxre_xyloQuerier();
 
  
 

   const handlemobile = () => {
    setopenmobile(true)
   }

   const handleclosemobile = () => {
    setopenmobile(false)
   }

    
   const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;
  
    // Remove caracteres não numéricos (mantém números e separadores decimais)
    const numericValue = inputValue.replace(/[^\d]/g, '');
  
    // Converte para número inteiro ou flutuante
    const parsedValue = parseFloat(numericValue) / 100;
  
    if (!isNaN(parsedValue)) {
      // Atualiza o estado com o valor numérico real
      setAmount(parsedValue);
  
      // Formata e exibe o valor formatado no input
      event.target.value = formatInputValue2(parsedValue);
    } else {
      // Caso o campo seja apagado, reseta o valor
      setAmount(0);
      event.target.value = '';
    }
  };
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const inputValue = event.target.value;

  // Remove tudo que não for número
  const numericValue = inputValue.replace(/\D/g, '');



  // Converte para número inteiro
  const value = parseInt(numericValue, 10);

  // Atualiza o estado com o valor inteiro
  setAmount(value);
};

const formatInputValue = (value: number): string => {
    if (value === undefined || value === null || isNaN(value)) {
     return '•••'; 
  }
  return (value / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2, // Garante ao menos 2 casas decimais
    maximumFractionDigits: 20, // Exibe até 20 casas decimais, ajustável
  });
};

const formatInputValue2 = (value: number): string => {
    if (value === undefined || value === null || isNaN(value)) {
     return '•••'; 
  }
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2, // Garante sempre 2 casas decimais
    maximumFractionDigits: 2, // Exatamente 2 casas decimais
  });
};


useEffect(() => {
  const calculateBitsAndPrice = () => {
    let bits: number = 0;
    let bonus = 1;

    // Aplicar bônus se a recarga for de 100 ou mais e o pagamento for via Stripe
    if (amount >= 100 && payusedreal) {
        bonus = 1.1;
    }

    if (payusedorbit) {
        // Pagamento via wallet (usando Orbs)
        bits = userInfo?.prime ? amount / 35 : amount / 100;  
        bits = Math.floor(bits); // Garantir que seja um valor inteiro
        setBitsReceived(bits);
        startAnimation(bits); 
    } else if (payusedreal) {
        // Verificar o valor que o usuário está pagando
        const matchedItem = StripeStoreList.find(item => item.price === amount);
        if (matchedItem) {
            bits = matchedItem.amount; // Pegar a quantidade de bits do item correspondente
        } else {
            // Se não houver item correspondente, calcular proporcionalmente
            bits = (amount / 1300) * 1000; // 1000 Bits = R$ 13,00
        }
         // Atualiza o estado com o valor correto e inicia animação
         
    const finalBitsReceived = bits * bonus;
    setBitsReceived(finalBitsReceived);
    startAnimation(finalBitsReceived); 
    }
    
    setTotalPrice(amount);
    setOriginalBitsReceived(bits); 
};

  const startAnimation = (targetAmount: number) => {
      setIsAnimating(true);
      let interval: NodeJS.Timeout | undefined;

      const duration = 1000; // Duração da animação em milissegundos
      const start = Date.now();
      const initialAmount = animatedAmount; // Valor inicial para a animação

      interval = setInterval(() => {
          const now = Date.now();
          const elapsed = now - start;

          // Calcule o progresso
          const progress = Math.min(elapsed / duration, 1); // Normaliza o tempo
          const currentAmount = Math.round(initialAmount + (targetAmount - initialAmount) * progress);

          // Atualiza o valor animado
          setAnimatedAmount(currentAmount);

          // Limpe o intervalo quando a animação terminar
          if (progress === 1) {
              clearInterval(interval);
              setIsAnimating(false); // Para a animação
          }
      }, 10); // Atualiza a cada 10ms

      return () => clearInterval(interval);
  };

  calculateBitsAndPrice();
}, [amount, payusedreal, payusedorbit, userInfo]);


  const handlepaymentbits = () => {
    setPayUsedOrbit(true);
    setPayUsedReal(false);
  };

  const handlepayusedreal = () => {
    setPayUsedReal(true);
    setPayUsedOrbit(false);
  };


 
          
       
         useEffect(() => {
           if (!isLoadingx && userInfoObject ) {
          setUserInfo(userInfoObject);
          setIsLoading(false);
           }
         }, [userInfoObject,isLoadingx])

// Função de clique para definir amount e bits
const handleClick = (amount: any, price: any) => {
  setAmount(price); // Atualiza o input com o valor do item selecionado
  setBitsReceived(amount); // Atualiza os bits recebidos
  setTotalPrice(price); // Atualiza o preço total
   
};

 


  const storeList = userInfo?.prime ? primeStoreList : nonPrimeStoreList;
 
  // Função para formatar valores em dólares
  const formatCurrency = (value: number): string => {
      if (value === undefined || value === null || isNaN(value)) {
     return '•••'; 
  }
    return value.toLocaleString('en-US', {
     
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };


  // Função para formatar valores em dólares
  const formatCurrencx = (value: number): string => {
      if (value === undefined || value === null || isNaN(value)) {
     return '•••'; 
  }
    return (value / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: { clientX: any; clientY: any }) => {
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
  };

  const calculateTransform = (x: number, y: number, intensity = 20) => {
    if (typeof window !== "undefined") {
      const moveX = (x / window.innerWidth - 0.5) * intensity;
      const moveY = (y / window.innerHeight - 0.5) * intensity;
      return `translate3d(${moveX}px, ${moveY}px, 0)`;
    }
   
  };

  const handleStripePayment = async () => {
    
 
  // Verifique se o total é menor que R$ 13,00
  if (totalPrice < 13) {
    alert('O pagamento via Stripe deve ser de no mínimo R$13.');
    return;
  }
 
 
    try {
      setloading(true)
      const response = await axios.post('/api/stripe/checkout', {
        priceId: 'price_1Q3KmWHT10nVD5LqeiPtuKVk',
        quantity: originalBitsReceived ,  // Agora enviando a quantidade de bits
        mode: 'purchase',
        metadata: { 
          userId: id ,
          amount: bitsReceived,
        },
      });
       
      const { url } = response.data;
      if (url) {
        window.location.href = url; // Redireciona para o checkout do Stripe
        setloading(false)
      }
    } catch (error) {
      console.error('Erro ao iniciar o checkout:', error);
    } finally {
      setloading(false)
    }
  };
    
  

    return (
        <> 
    <HeadGlobal Title="Adicione fundos em Bits para compras e negociações no thenovision! " />
     <div className='relative z-[99999]'>
       <AccountNvxre about="Comprar Bits" balance={true} />
     </div>
    <ContainerCv onMouseMove={handleMouseMove} className='noscroll onets' >
      
    <StoreContainer>
    
     <div className='bndj'>
      <CardIN>
        <ul>
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-line-scan" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2dc668" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
  <path d="M4 16v2a2 2 0 0 0 2 2h2" />
  <path d="M16 4h2a2 2 0 0 1 2 2v2" />
  <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
  <path d="M7 12h10" />
</svg>
        <h4>Bonus adicionais</h4>
        </ul>
      <MarginPLs>
      
<section className={payusedreal ? 'cardgreen' : 'opacity cardgreen'}>
       
          <div className='dotgreen' />
          <li>
          <h3>Receba um  <text className='text-green'>bônus de 10% na recarga</text></h3>
          </li>
          <span className='iconspan'>
            <i className='fi fi-rs-benefit-porcent' />
          </span>
        </section>


        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus" width="14" height="15" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M12 5l0 14" />
  <path d="M5 12l14 0" />
</svg>

<section className={payusedreal && amount >= 10000 ? 'cardblue' : 'opacity cardblue'}>
{amount < 10000 && payusedreal && (
    <div className='cardNvs'>
        Valor muito baixo
    </div>
)}
 
          <div className='dotblue' />
          <li>
          <h3>Receba junto  <text className='text-blue'>2 containers TVL</text></h3>
          </li>
           <span> 
           <img src="/theim/cards/20240924_174742.jpg" alt='novision' className='iconns'/>
           </span>
        </section>

        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus" width="14" height="15" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M12 5l0 14" />
  <path d="M5 12l14 0" />
</svg>

<section className={payusedreal && amount >= 3500 ? 'cardria' : 'opacity cardria'}>
 
          <div className='dotria' />
          <li>
          <h3>Obtem mais <text className='text-ria'> 120.000 Orbs  </text></h3>
          </li>
          <span>
          <img src="/icons/coins/gems/20250222_021201.webp" alt='orbit' className='iconns'/>
          </span>
        </section>
      </MarginPLs>

      <ul>
        <i className="fi fi-rr-star-exclamation"/>
        <h5>Quantia mínima para ter todos os benefícios é R$ 100,00</h5>
      </ul>
      </CardIN>
      

      <MarginXC>

        {payusedreal ? (
          <>
             <h4>O pagamento será processado usando a stripe payment.</h4>

          </>
        ) : (
          <>
             <h4>O pagamento será processado usando sua carteira novision.</h4>

          </>
        )}
     
 
      <section className="sectioncards"> 

       {payusedreal ? (
        <>
          {isLoading ? (
       <LoadingPageView />
        ) : (
          StripeStoreList.map((item, index) => (
            <Card key={index}    
            className={amount === item.price ? 'active' : ''}
            onClick={() => handleClick(item.amount,item.price)} >
             
              <Content>
              <li className='jche8'>
              <h4>{formatCurrencx(item.price)}</h4>
            </li> 
              <ul>
      
            {payusedreal && (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-brand-stripe"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#26e274"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M11.453 8.056c0 -.623 .518 -.979 1.442 -.979c1.69 0 3.41 .343 4.605 .923l.5 -4c-.948 -.449 -2.82 -1 -5.5 -1c-1.895 0 -3.373 .087 -4.5 1c-1.172 .956 -2 2.33 -2 4c0 3.03 1.958 4.906 5 6c1.961 .69 3 .743 3 1.5c0 .735 -.851 1.5 -2 1.5c-1.423 0 -3.963 -.609 -5.5 -1.5l-.5 4c1.321 .734 3.474 1.5 6 1.5c2 0 3.957 -.468 5.084 -1.36c1.263 -.979 1.916 -2.268 1.916 -4.14c0 -3.096 -1.915 -4.547 -5 -5.637c-1.646 -.605 -2.544 -1.07 -2.544 -1.807z" />
                </svg>
              </span>
            )}
              </ul>
              </Content>
           
            </Card>
          ))
        )}
        </>
       ) : (
        <>
          {isLoading ? (
       <LoadingPageView />
        ) : (
          storeList.map((item, index) => (
            <Card key={index}    
            className={amount === item.price ? 'active' : ''}
            onClick={() => handleClick(item.amount,item.price)} >
             
              <Content>
              <li className='jche8'>
              <h4>{formatCurrency(item.price)}</h4>
            </li> 
              <ul>
               {payusedorbit && (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-wallet"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#27d66a"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
                  <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
                </svg>
              </span>
            )}

          
              </ul>
              </Content>
           
            </Card>
          ))
        )}
        </>
       )}

       
        </section>  
      </MarginXC>

      <FixedCard >
  
      <ul className='udkmbs'>
    {/* Botão para pagamento usando a Wallet */}
    <li>
      <button onClick={handlepaymentbits} className={payusedorbit ? 'activemethod button' : 'button' }>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-wallet" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#27d66a" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12"/>
            <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4"/>
          </svg>
          Pagar com Wallet
        </span>
      </button>
    </li>

    {/* Botão para pagamento usando a Stripe */}
    <li>
      <button onClick={handlepayusedreal} className={payusedreal ? 'activemethod button' : 'button' }>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-stripe" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#26e274" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M11.453 8.056c0 -.623 .518 -.979 1.442 -.979c1.69 0 3.41 .343 4.605 .923l.5 -4c-.948 -.449 -2.82 -1 -5.5 -1c-1.895 0 -3.373 .087 -4.5 1c-1.172 .956 -2 2.33 -2 4c0 3.03 1.958 4.906 5 6c1.961 .69 3 .743 3 1.5c0 .735 -.851 1.5 -2 1.5c-1.423 0 -3.963 -.609 -5.5 -1.5l-.5 4c1.321 .734 3.474 1.5 6 1.5c2 0 3.957 -.468 5.084 -1.36c1.263 -.979 1.916 -2.268 1.916 -4.14c0 -3.096 -1.915 -4.547 -5 -5.637c-1.646 -.605 -2.544 -1.07 -2.544 -1.807z"/>
          </svg>
          Pagar com Stripe
        </span>
      </button>
    </li>


     
  </ul>
 
 
{isopenmobile && (  
<ContentVc>
   <li>
     <h3>SUA QUANTIA   {payusedreal && amount < 1300 && (
            <text className='red'>Valor mínimo deve ser R$13,00</text>
        )}</h3>
    
    <label>
      <div className='dhsk'> 
     <h1>{payusedreal ? 'R$' : <><Image src="/icons/coins/orb-novision.webp" alt='orbit clubvision' width={26} height={26}/></> }</h1>
     </div> 
    <Input 
      name="number"
      autoComplete="off"
      type="text" 
      value={payusedreal ? formatInputValue(amount) : formatInputValue2(amount)}
      onChange={payusedreal ?  handleInputChange : handleInputChange2}
      required
     />
    </label>
      
   </li>


   <li>
     <h3>VOCÊ VAI RECEBER    {payusedreal && <text className='ardsn'>+10% Bônus de recarga </text>}</h3>

     <CardInfoQuantity>
       
       <ul>
        
      
       <section className='mbxjd'>
        
        <ul>
        <img src='/icons/coins/orbit-novision.webp' alt='bits' className='coinicon'/>
        <h5>{formatCurrency(isAnimating ? animatedAmount : bitsReceived)} </h5>
        </ul>
        
       </section>
       </ul>
     </CardInfoQuantity>
   </li>
</ContentVc>
)}
 
<ButtonVf  onClick={() => {
    if (payusedorbit) {
      // Pagamento via wallet
      router.push(`?wallet=payment&orbs=${totalPrice}&receive=bits&bits=${bitsReceived}`);
    } else if (payusedreal) {
      handleStripePayment();
    }
  }}
  disabled={payusedreal ? amount < 1300 : amount < 1000 }
  >
   <h3>{isload ? 'Processando pagamento....' : (<> REALIZAR O PAGAMENTO  {payusedreal ? (
    <>
    {formatCurrencx(totalPrice)}
    </>
   ) : (
    <>
   {formatCurrency(totalPrice)}
    </>
   )}</>)}</h3>
</ButtonVf>
  
<li className='anshjjs'>
    {isopenmobile ? (  
      <button onClick={handleclosemobile} className='buttonclss'>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panel-top-open"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="m15 14-3 3-3-3"/></svg>
       </button>
    
    ) :(
      <button onClick={handlemobile} className='buttonclss'>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panel-top-close"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="m9 16 3-3 3 3"/></svg>
      </button>
    )}
    </li>
</FixedCard >
       </div>
      </StoreContainer>
     
      <Header />
      <Overlay   >
        <div className='image'> 
        <img   src='/theim/characters/mkfdosflnojdmn.webp' alt='novision character'  />
        </div>
        <div className="blurs" />
        <MarginCoinanim>
     
        <div className='coin1'>
          <img 
            src='/web/coin1_effect.png' 
            alt='novision' 
            style={{ transform: calculateTransform(mousePosition.x,  mousePosition.y, 3) }} 
          />
        </div>

        <div className='coin2'>
          <img 
            src='/web/coin2_effect.png' 
            alt='novision' 
            style={{ transform: calculateTransform(mousePosition.x,  mousePosition.y, 12) }} 
          />
        </div>

        <div className='coin3'>
          <img 
            src='/web/coin3_effect.png' 
            alt='novision' 
            style={{ transform: calculateTransform(mousePosition.x, mousePosition.y, 3) }} 
          />
        </div>
        </MarginCoinanim>
      </Overlay>
        </ContainerCv>
     </>
    )
}



//////////////

 
const Card = styled.button`
border-radius: 8px;
background-color: rgba(80, 94, 83, 0.096);  
  width: 150px;
  border: 2px solid rgba(80, 94, 83, 0.096);
  position: relative;
 display: flex;
 overflow: hidden;
 flex-direction: row;
 align-items: center;
  margin: 0.4em;
  
   
 ul{
   display: inline-flex;
   align-items: center;
 }

 

`;
const Content = styled.div`
   display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition: 7s all;
 
  .jche8{
     
    display: flex;
    font-family: 'Europa Grotesk';
    flex-direction: row;
    text-align: center;
    align-items: center;
    justify-content: center;
    border-radius: 0 8px 8px 0;
    width: 100px;
      padding: 0.8em 0.7em 0.8em;
  background:  rgba(6, 6, 7, 0.925);
   
 

    h3{
    color: #c1c0c7;
    max-width: 250px;
   text-align: start;
   word-wrap: break-word;
   overflow-wrap: break-word; 
   overflow: hidden;
   font-size: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
    }

    h4{
      color: white;
    font-family: 'Inter';
    font-size: 13px;
    text-align: center;

     max-width: 90px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
    }

    h6{
      color: #858d86;
      text-align: center;
      font-size: 9px;
    
    }
  }

  span{
    padding: 0.4em 0.7em 0.4em;
  }
 
  .cardimage{
   padding: 1em 0 1em;
    margin: 0.3em;
    max-width: 100%;
    height: 190px;
  }

   
`;

 


const MarginPLs = styled.div`
     
     display: flex;
     justify-content: center;
     align-items: center;
     position: relative;
     transition: 1s all;
      
     .cardNvs{
       position: absolute;
       right: 0;
       left: 1;
       bottom: 1px;
       z-index: 6;
       padding: 0.4em 0.9em 0.4em;
       font-family: 'ProximaNova-Italic', monospace;
      font-size: 11px;
       border-radius: 0px 6px 0px 6px;
       background-color: #df262f;
       color: white;
     }

     .opacity{
      opacity: 0.2;
      transition: 1s all;
     
     }

     .iconns{
      height: 60px;
      width: auto;
      transform: rotate(9deg);
      right: 4px;
      bottom: 1;
      border-radius: 5px;
      position: absolute;
     }
  
    .cardria{
      background-color: rgb(51, 29, 24);
    }
   .cardgreen{
    background-color: rgb(24, 51 ,31);
   }

   .cardblue{
    background-color: rgb(24, 28, 51);
   }
    
   section{
    padding: 0.4em 0.3em 0.4em;
    border-radius: 6px;
    height: 50px;
    width: 230px;
    display: flex;
    overflow: hidden;
    transition: 1s all;
     
     justify-content: space-between;
     align-items: center;
     position: relative;
     
   }
   .dotgreen{
          background: radial-gradient(43.68% 59.18% at 50.18% 100%, rgba(20, 206, 91, 0.4) 0%, rgba(32, 32, 40, 0) 100%);
          position: absolute;
          bottom: 1px;
          left: 0;
          right: 0;
          top: 0;

   }
 
   .dotria{
          background: radial-gradient(43.68% 59.18% at 50.18% 100%, rgba(206, 57, 20, 0.4) 0%, rgba(32, 32, 40, 0) 100%);
          position: absolute;
          bottom: 1px;
          left: 0;
          right: 0;
          top: 0;

   }
   .dotblue{
          background: radial-gradient(43.68% 59.18% at 50.18% 100%, rgba(20, 63, 206, 0.4) 0%, rgba(32, 32, 40, 0) 100%);
          position: absolute;
          bottom: 1px;
          left: 0;
          right: 0;
          top: 0;

   }

   .iconspan{
    --tw-bg-opacity: 1;
    background-color: rgb(48 102 63 / var(--tw-bg-opacity));
   }
   span{
   
    height: 35px;
    margin: 0.1em;
    width: 35px;
    border-radius: 50%;
    padding: 0.3em;
    display: flex;
    align-items: center;
    justify-content: center;
   }
   
   h3{
    font-family: 'InterSemiBold', monospace;
    font-size: 10px;
   }
   
   .text-green{
    color: #24cf6b47;
    text-transform: uppercase;
   }

   .text-blue{
    color: #244ccf46;
    text-transform: uppercase;
   }

   .text-ria{
    color: #f0412246;
    text-transform: uppercase;
   }
   li{
     display: flex;
     align-items: center;
     flex-wrap: wrap;
     width: 130px;
   }


    @media screen and (max-width: 490px){
       display: flex;
       flex-wrap: wrap;
      section{
        width: 100%;
      }
  }
`;


const FixedCard = styled.div`
background: #0e0e0fdf;
  padding: 0 1em 0;
  border-radius: 8px;
  position: absolute;
  bottom: 8px;
  width: 530px;
  
  .udkmbs{
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
  }

  .anshjjs{
    position: absolute;
    bottom: 100%;
    right: 4%;

  }
  ul{
    display: flex;
    padding: 0.4em 1em 0.4em;
    align-items: center;
    margin: 0.4em;

    h4{
      font-size: 13px;
      font-family: 'XcSemibold';
      color: rgb(212, 217, 221);
    }

    h5{
      font-size: 12px;
      font-family: 'ProximaNova-Italic', monospace;
      color: rgb(208, 208, 216);
      padding-left: 0.3em;
    }

    i{
      font-size: 12px;
      height: 25px;
    margin: 0.1em;
    width: 25px;
    border-radius: 50%;
  
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(64, 64, 70, 0.24);
      color: rgb(208, 208, 216);
    }
  }

  .button{
    padding: 0.3em 0.9em 0.3em;
    background: #0e0e0fdf;
     border-radius: 8px;
     font-family: 'InterSemiBold', monospace;
    
     
     span{
      display: flex;
      align-items: center;
     }


  }
  

  li{
    position: relative;
    
  }

  .buttonclss{
     display: none;
  }

  .activemethod{
    background: #20b14c49;
  }
  
  button:disabled{
    cursor: not-allowed;
    border-radius: 40px;
    background-color: #e9555cab;
  }
  @media screen and (max-width: 490px){
    width: 99%;
    bottom:1%;
    left: 0;
    margin: 0.1em;
    right: 0;
    position: fixed;
    animation: Opencard 1s linear; 
    
    .buttonclss{
      height: 40px;
    width: 40px;
    border-radius: 50%;
    align-items: center;
    background: #0e0e0fdf;
    border: 2px solid rgb(36, 37, 39);
    display: flex block;
    position: relative;
    right: 2px;
    bottom: 2px;
    float: right;
    justify-content: center;
    }
    @keyframes  Opencard {
      0%{ transform: translateY(100%) }
      100% { tranform: translateY(0%) }
    }
  }
`;
const CardIN = styled.div`
  background: #0e0e0fdf;
  padding: 0 1em 0;
  border-radius: 8px;
  width: 530px;
 


  ul{
    display: flex;
    padding: 0.4em 0 0.4em;
    align-items: center;
    margin: 0.4em;
    margin-left: 0;

    h4{
      font-size: 13px;
      font-family: 'XcSemibold';
      color: rgb(212, 217, 221);
    }

    h5{
      font-size: 12px;
      font-family: 'ProximaNova-Italic', monospace;
      color: rgb(208, 208, 216);
      padding-left: 0.3em;
    }

    i{
      font-size: 12px;
      height: 25px;
    margin: 0.1em;
    width: 25px;
    border-radius: 50%;
  
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(64, 64, 70, 0.24);
      color: rgb(208, 208, 216);
    }
  }


 @media screen and (max-width: 490px) {
  width: 100%;
 
 }
`;

const MarginCoinanim = styled.div`

.coin1, .coin2, .coin3 {
  position: absolute;
  transition: transform 0.1s ease-out;
  }
  

  .coin1{
    height: 9.375rem;
    left: 23rem;
    position: absolute;
    top: 32.6875rem;
    width: 9rem;
    z-index: 3;
  }

   .coin2{
    height: 8.5625rem;
    left: 15.5rem;
    position: absolute;
    top: 4.0625rem;
    width: 8.5rem;
    z-index: 3;

   }
  .coin3{
    height: 4.94125rem;
    left: 42.4375rem;
    position: absolute;
    top: 12.875rem;
    width: 5.25rem;
    z-index: 3;
  }
`;
 

const ContainerCv = styled.div`
  position: fixed;
 
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(9px);
  top: 0;
  z-index: 3392;
 
  transition: 1s all;
  margin: 0 auto;
  justify-content: center;
  place-items: center;
  display: flex;
  animation: PageAnim 0.8s linear;
 
  @keyframes PageAnim {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }
  
`;


const Header = styled.div`
 background-image: url('/theim/backgrounds/dsfhbsdufjb.webp');
  background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    left: 0;
    opacity: .2;
    position: absolute;
    top: 0;
    width: 100%;
`;
 
const MarginXC = styled.div`
   width: 540px;
  padding: 1em;
 

 .sectioncards{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.4em;
 }

 h4{
  font-size: 13px;
  text-align: center;
  color: #cfd0d8e6;
  font-family: 'ProximaNova-Italic', monospace;
 }


 .active{
   border: 2px solid #0fec59;
    .jche8{
      width: 150px;
    }

    h4{
    max-width: 150px;
    }
    svg{
      display:none;
    }
 }

  @media screen and (max-width: 490px) {
  width: 100%;
  padding: 0.3em;
  
  .sectioncards{
    display: grid;
    grid-template-columns: repeat(2, 2fr);
    grid-template-rows: auto;
    grid-gap: 0.3rem;
  }
 }
`;


const ButtonVf = styled.button`
  padding: 0.8em 1em 0.8em;
  border-radius: 9px;
  margin-bottom: 2em;
  width: 100%;
  background: rgb(19, 223, 97);
  border: 2px solid rgba(50, 50, 53, 0.322);
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;

  h3{
    font-size: 13px;
    color: rgb(16, 16, 17);
    font-family: 'InterSemiBold', monospace;
  }
`;

const Overlay = styled.div`
   .image{
    height: 40.6875rem; 
  left: 13.8125rem; 
  position: absolute;
  top: 7.4375rem;
  width: 40.25rem; 
  z-index: 2; 

   }

  img{
    height: 100%;
    width: 100%;
    z-index: 1;
    transition: transform 0.1s ease-out;
  }

  .blurs{
    background: linear-gradient(180deg, #00ff6a, #1ce871);
    border-radius: 50%;
    filter: blur(256px);
    height: 32rem;
    left: 19.9375rem;
    position: absolute;
    z-index: 0 ;
    top: 23.375rem;
    width: 32rem;
  }

 
 
`;
 


const StoreContainer = styled.div`
  display: flex;
  justify-content: end;
  padding: 2em 0.8em 2em;
  height: 100%;
  width:100% ;
  overflow-y: auto;
  z-index: 1392;
  background: linear-gradient(180deg, #030303, #0d0d0d00 16.67%, #0d0d0d00 73.96%, #050505);
  position: absolute;
 
  .bndj{
    padding: 2em 0 0;
  }

   @media screen and (max-width: 490px){
    display: flex;
    height: 90%;
    margin-top: -40%;
    padding: 4em 1em 5em;
    overflow-y: auto;
    background: none;
    justify-content: center;
  }
`;
 

const CardInfoQuantity = styled.div`
       width: 100%;
      height: 40px;
      background: rgb(24, 24, 27);
      padding: 0.4em 0.9em 0.4em;
      border-radius: 8px;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      justify-content: center;
      align-items: center;
    
    .coinicon{
      height: 30px;
      width: 30px;
    }

    .mbxjd{
      display: flex;
      align-items: center;
      padding: 0.3em 0.9em 0.3em;

      .coinicon{
        height: 20px;
        width: 20px;
        margin-top: 0.3em;
      
      }

      h5{
        color: #22cf78;
        font-size: 15px;
        font-family: 'InterSemiBold', monospace;
      }
    }

    h2{
      color: #22cf78;
      font-size: 13px;
      font-family: 'InterSemiBold', monospace;
    }

  @media screen and (max-width: 530px) {
     width: 85vw;
  }
    
`;

const ContentVc = styled.div`
     padding: 0.4em;
     display: flex;
     align-items: top;
     justify-content: space-between;

      .red{
        color: #e42929;
        font-size: 9px;
        font-family: 'ProximaNova-Italic';
      }
     h3{
      font-size: 11px;
      display: flex;
      align-items: center;
      font-family: 'ProximaNova-Italic', monospace;
      text-transform: uppercase;
      margin: 0.4em;
      color: #636469;
     }
     
      img{
        margin-top:0.4em;
      }
     .ardsn{
      padding: 0.4em 1em 0.4em;
      border-radius: 8px;
      margin-left: 0.3em;
      background-color: #287e495e;
      display: flex;
      font-size: 9px;
      justify-content: center;
      text-transform: uppercase;
      font-family: 'ProximaNova-Italic';
      color: #55ce55;
     }
    label{
      width: 230px;
      height: 40px;
      border: 1px solid rgb(32, 32, 37);
      background: rgb(24, 24, 27);
      
      border-radius: 8px;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      align-items: center;

      .dhsk{
        padding: 0.7em 1em 0.7em;
      }
      h1{
        font-size: 17px;
        color: #22cf78;
      }
    }

    @media screen and (max-width: 590px) {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      label{
        width: 100%;
      }
     
      h3{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
`;

const Input = styled.input`

  background-color: transparent;
  width: 100%;
  height: 50px;
  background: rgb(20, 20, 22);
  font-size: 16px;
  border: none;
  color: #9293a0;
  padding: 0.9em 1em 0.9em;
 
  font-family: 'Poppins', Courier, monospace;
  
  :focus{
    outline: none;
  }

  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #9c9ca7;
  }
  
  :focus {
  border: none;
  box-shadow: none; 
  outline: none;
}
  :-webkit-autofill,
  :-webkit-autofill:hover, 
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover
  :-webkit-autofill:focus,
  :-webkit-autofill,
   :-webkit-autofill:hover,
   :-webkit-autofill:focus {
  -webkit-text-fill-color: #9e9ea0 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: pointer;
}

/* Remove os botões de incremento/decremento no Chrome, Safari, Edge e Opera */
::-webkit-outer-spin-button,
::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Remove os botões de incremento/decremento no Firefox */
[type=number] {
  -moz-appearance: textfield;
}
`;
