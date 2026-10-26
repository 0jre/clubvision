 
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductWithPrice, Price } from '@/types/stripe';
import Cardprime from '../container/cardprime';
import styled from 'styled-components';
import Crown from '@/public/nvrp/logonvrp.png'
import Image from 'next/image'
import ROUTENVX from '@/routes/routes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoadingPageView from '@club/resources/loading/market.loading';


interface Nas {
    link: string;
    children: React.ReactNode;
}

 

const HomeSubscription = ({userid} : {userid: string}) => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [isloading, setloading] = useState(false)
 
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductWithPrice[]>('/api/stripe/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSubscribe = async (priceId: string, productMetadata: string) => {
    try {
      setloading(true)
      const response = await axios.post('/api/stripe/checkout', {
        priceId: priceId,
        quantity: 1,
        mode: 'subscription',
        metadata: { userId: userid, typeox: productMetadata},
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


  const ButtonX: React.FC<Nas> = ({ link, children }) => {
    const handleClick = () => {
      window.open(link, '_blank');
    };
  
    return (
      <button onClick={handleClick}>
        {children}
      </button>
    );
  };

  return (
    <>
          
      
        <Cardmodal>
      <h2 className='h2'>CLUB PREMIUM</h2>

      {isloading ? (
        <ModalLoading>
           <LoadingPageView />
         <h4>Preparando o pagamento...</h4>
        </ModalLoading>
      ) : (
        <>
        {products.map(product => (
          <li key={product.id}>
               {product.prices && product.prices.map((price: Price) => (
              <div key={price.id}>  

<Container onClick={() => handleSubscribe(price.id, product.metadata?.typeox || 'undefinedx')}>
         <Content>
                                                                   
            <ul>
            <Image
             className='iconsM' 
             src={Crown}  alt={'Crown Prime'}  width={67} height={55}/>

                <li className='li'>
                <h2>{product.name}</h2>
               <h3>{(price.unit_amount ) == 8999 ? 'O SELO DE VERIFICAÇÃO DE ID DE CONTA... ': 'ACESSO BLOOM AO CLUBVISION TORNE-SE PRIME AGORA...'}</h3> 
                </li>
            </ul>
  
            {price.unit_amount !== undefined && price.unit_amount !== null && (
                    <>
                 <h5>R${price.unit_amount / 100}/{price.interval_count} {price.interval === 'month' ? 'mês' : price.interval === 'year' ? 'ano' : price.interval}</h5>
                   </>
                )}
         </Content>
        </Container>

        
         </div>
            ))}
          </li>
        ))}
        </>
      )}
  

        <About>
            <p>Ao assinar, voce concorda com os <Link href={ROUTENVX.terms}>Termos de Serviço.</Link> As Assinaturas são renovadas automaticamente ate serem canceladas, conforme descrito nos Termos. Cancele a qualquer momento. Cancele pelo menos 24 horas antes da renovação para evitar cobranças adicionais. 
            </p>
        </About>

        {/* <button>
             CANCELAR
         </button> */}
        </Cardmodal>
     
    </>
  );
};

export default HomeSubscription;




const ModalLoading = styled.div`
 
   background-color: rgba(56, 56, 61, 0.034);;
   border-radius: 8px;
   padding: 0.9em 1em 0.9em;
   margin: 0.9em;
   display:flex;
   flex-direction: column;
   justify-content: center;
   width: 100%;
   height: 15em;
   text-align: center;


   h4{
    font-family: 'XcSemibold', sans-serif;
    font-size: 15px;
    color: rgba(169, 174, 179, 0.61);
   }
`;




const Container = styled.div` 
   background: linear-gradient(204deg, #393b3a40 -7%, #b85cff00 33%), linear-gradient(162deg, #1e963840 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(71, 71, 78, 0.075));
   padding: 0.7em 1em 0.7em;
   border-radius: 8px;
   margin-top: 1em;
   cursor:  var(--f-cursor-pointer);
   margin-left: 0;
   /* box-shadow: -11px 18px 1px black; */
   transition: 0.5s all;
   margin-bottom: 2em;
   transform: scale(1);
   border: 2px solid black;

   &:hover{
 
    border: 2px solid #2e302f62;
   }
`;

const Content = styled.div`
   
   display: flex; 
   align-items: center;
   justify-content: space-between;
   width: 100%;


     h5{
        font-family: 'Graffiti';
        font-size: 15px;
        color: #93979bf8;
        margin: 0.5em;
        transform: rotate(3deg);
     }
     ul{
    display: flex; 
    align-items: center;

     img{
        padding-right: 1em;
     }
     }
   
    
     h2{
      font-size: 19px;
      background: linear-gradient(47deg, #acb8b2 0%, rgb(192, 194, 201) 1%, #0a0b0c 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
   font-family: 'Europa Grotesk';
    }
     
    .li{
        margin: 0;
    }

    h3{
     font-family: 'Inter', sans-serif;
     font-size: 9px;
     color: #97a19deb;
    }
  

    button{
      background: linear-gradient(204deg, #5c95ff40 -7%, #b85cff00 33%), linear-gradient(162deg, #e7234440 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(71, 71, 78, 0.075));
 
   padding: 1em 2em 1em;
   border-radius: 48px;
   font-size: 14px;
   font-family: 'Europa Grotesk';
   box-shadow: -11px 18px 1px black;
   color: #cdd8d3ec;
  
   position: relative;
   z-index: 1;
   
   transition: 1s all;
   border: 2px solid #09090a;
   
   &:hover{
    box-shadow: -1px 13px 11px black;
    transform: scale(1.1);
    border: 2px solid #110f0f2b;
   }
 

   @media screen and (max-width: 280px){
      margin-left: -6em;
      font-size: 13px;
  }

    }
    
  .IconsM{
    height: 90px;
    width: 90px;
     transform: rotate(25deg);
  }


  @media screen and (max-width: 430px) {
    display: flex;
    flex-direction: column;

    h2{
      font-size: 15px;
    }

    h3{
      font-size: 11px;
    }

    button{
      margin: 0.5em;
    }

    img{
      display: none;
    }
  } 
`;

const Modal = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  place-items: center;
  float: right;
  background-color: rgba(9, 9, 10, 0.596);
  right: 0;
  bottom: 0;
  left: 0;
  top: 0;

 
`;


const About = styled.div`
  border: 1px solid #42434745;
  padding: 0.4em 1em 0.4em;
  border-radius: 11px;
  margin: 0.4em;
   
  
  p{
    font-size: 11px;
    max-width: 540px;
    color: #9d9fa7;
  }

  a{
    color: rgba(180, 184, 190, 0.637);
  }
`;
const Cardmodal = styled.div`
  
 margin: 0.9em;
  
 button{
    cursor:  var(--f-cursor-pointer);
  background: linear-gradient(204deg, #e1ebe840 -7%, #b85cff00 33%), linear-gradient(162deg, #d3ddd940 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(71, 71, 78, 0.075));
  border-radius: 12px;
  padding: 1em 4em 1em;
   font-family: 'XcSemibold', sans-serif;
   font-size: 15px;
   margin-top: 1em;
   width: 100%;
   color: #b5bbb7;
   transition: 0.4s all;

    &:hover{
     transform: scale(0.9);
     border-radius: 45px;
    }
 }


 .h2{
    color: rgb(123, 126, 131);
    text-align: center;
    font-family: 'XcSemibold', sans-serif;
 }
`;


const Button = styled.div`
  cursor:  var(--f-cursor-pointer);
  background: linear-gradient(204deg, #e1ebe840 -7%, #b85cff00 33%), linear-gradient(162deg, #d3ddd940 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(71, 71, 78, 0.075));
  border-radius: 12px;
  padding: 1em 4em 1em;
   font-family: 'XcSemibold', sans-serif;
   font-size: 15px;
   margin: 1em;
   width: 50%;
 
   color: #b5bbb7;
   transition: 0.4s all;

    &:hover{
     transform: scale(0.9);
     border-radius: 45px;
    }
   
`;


const ContentAbls = styled.div`
   text-align: center;
   display: flex;
   justify-content: center; 
   place-items: center; 
   align-items: center; 
   flex-direction: column;
    
   width: 100%;
   
  h2{  
    font-size: 29px;
    max-width: 630px;
    color: #5b5f5f36;
     font-family: 'XcSemibold', sans-serif;
  }
  

  section{
    display: inline-flex;
    align-items: center;
    margin-top: 3em;

    hr{
     width: 300px;
    }

    img{
      margin: 0.4em;
    }
  } 


  h6{
    margin: 0.8em;
    color: rgb(82, 83, 88);
    font-size: 15px;
    font-family: 'ProximaNova-Italic';
  }


  button{
    
    display: inline-flex;
    align-items: center; 

     
    h4{
    font-size: 12px;
    font-family: 'Inter';
    color: rgb(131, 133, 139);
    }

    i{
      padding-left: 0.8em;
      font-size: 11px;
      color: #4a4b50;
    }
  }

  `;
