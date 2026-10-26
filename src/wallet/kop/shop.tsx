

import styled from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";
import { BigtoreList } from "@/data/recharge/complements";
import { BigboxList } from "@/data/recharge/box.vision";
import { useEffect, useRef, useState } from "react";
  

export default function Shopclub() {
 
  const router = useRouter();
 

  // Função para formatar valores em dólares
const formatCurrency = (value: number): string => {
    if (value === undefined || value === null || isNaN(value)) {
     return '•••'; 
  }

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};


    return(
        <>
    
        <MarginStore>
 
       
       
      <MarginTitle className="titl">
          <h1>Container vision</h1>
        </MarginTitle>
        <MarginSkins>
           <Ifogf>
            <h3>Você pode comprar um container usando</h3> <Image src={'/icons/coins/orb-novision.webp'} alt="novision" height={20} width={20}/><span>Orbit vision</span> <h3> todos os pacotes do shop, é necessario ter saldo suficiente na carteira!</h3>
           </Ifogf>

           <ScrollingCardUserinfo>
         

       
          {BigboxList.map((item, index) => (
            <CardSkinsOps  onClick={() => {
              router.push({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  wallet: 'payment',
                  orbs: item.price,
                  receive: item.receive,
                  itemQuantity: item.itemQuantity || 0,
                  
                }
              });
            }}>
            <Image src={item.image} alt="card" width={300} height={400}/>

            <ul>
              <Image src={'/icons/coins/orb-novision.webp'} alt="novision" height={20} width={20}/>
              <span>{formatCurrency(item.price)} ORBS</span>
            </ul>
         </CardSkinsOps>

          ))}
        
          
  
           </ScrollingCardUserinfo>
        </MarginSkins>
    
        <MarginTitle>
          <h1>Adicionar Complementos</h1>
        </MarginTitle>
 
        <MarginComplements>
         
        <Ifogf>
            <h3>Os complementos são liberados para compra com base no level atual que você está.</h3>
           </Ifogf>

 
         <section className="mss"> 
       
          {BigtoreList.map((item, index) => (
            <CardSkinsOps key={index} className="Bto"  onClick={() => {
              router.push({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  wallet: 'payment',
                  orbs: item.price,
                  receive: item.receive,
                  itemQuantity: item.itemQuantity || 0,
                }
              });
            }}>
                <MarginDescription>
              <Image src={item.image} alt={item.title} width={200} height={300} />
              <h5>
               {item.description}
              </h5>
              </MarginDescription>

              <Content>
            
              <li>
              <h3>{item.title}</h3>
             
            </li>
              </Content>


              <ul>
                <Image src={'/icons/coins/orb-novision.webp'} alt="novision" height={20} width={20}/>
                <span> {formatCurrency(item.price)} ORBS</span>
              </ul>

    
            </CardSkinsOps>
          ))}
       
        </section>
        </MarginComplements>

 
       </MarginStore>
 
        </>
    )
}





interface HorizontalScrollContainerProps {
  children: React.ReactNode;
}
const ScrollingCardUserinfo: React.FC<HorizontalScrollContainerProps> = ({
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isModalOpen) {
      setIsDragging(true);
      setStartX(e.clientX);
      setScrollLeft(containerRef.current!.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    if (!isModalOpen) {
      e.preventDefault();
      const x = e.clientX - startX;
      const walk = x * 1;
      containerRef.current!.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;

        if (scrollLeft <= 0) {
          // Move items to the end when scrolling to the beginning
          container.scrollLeft = scrollWidth;
        } else if (scrollLeft + clientWidth >= scrollWidth) {
          // Move items to the beginning when scrolling to the end
          container.scrollLeft = 0;
        }
      }
    };

    containerRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <CardViewList
      style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
    >
 
        {children}
 
    </CardViewList>
  );
};



const MarginDescription = styled.div`
  height: 300px;
  width: 200px;
  display: flex;
  justify-content: center;
  place-items: center;
  align-items: center;

   
   h5{
    text-align: center;
    display: none;
    font-family: 'XcSemibold', monospace;
    color: #a3a7ad;
    font-size: 13px;
    padding: 1em 0.8em 0.3em;
   }
  
  &:hover{

    h5{
      display: block;
    }
    img{
     display: none;
  }
  }

`;

const MarginComplements = styled.div`
 
  

  .mss{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  }

  .Bto{
    margin-bottom: 0.3em;
  }
`;

const CardSkinsOps = styled.div`
 padding: 0.4em;
 margin: 0.2em;
 cursor: var(--f-cursor-pointer);
 
   
 img{
  border-radius: 8px;
 }

 ul{
  width: 100%;
  border-radius: 39px;
  background-color: rgb(23, 23, 26);
  padding: 0.8em 1em 0.8em;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b1c4bb;

  span{
    padding-left: 0.4em;
    font-size: 14px;
  }
 }

 &:hover{
   img{
     margin-top: -0.4em;
     transform: scale(1.1);
   }
 }
`;


const CardViewList = styled.div`
  
border-radius: 32px;
padding: 2em 1em 1em;
overflow-x: auto;
width: 100%;
 
display: inline-flex;
cursor:  var(--f-cursor-grab);

:active {
cursor:  var(--f-cursor-grabbed);
}

 
`;


const MarginSkins = styled.div`
   width: 100%;
   padding: 1em;
   
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
   

`; 


const Ifogf = styled.div`
 background: linear-gradient(204deg, #94818440 -7%, #b85cff00 33%), linear-gradient(162deg, #94818440 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(71, 71, 78, 0.075));
   padding: 0.7em 1em 0.7em;
   border-radius: 8px;
   width: 100%;
   flex-direction: row;
   align-items: center;
   display: flex;
   justify-content: center;
   font-family: 'InterSemiBold', monospace;
   color: #8f9296;
   font-size: 11px;

   span{
    margin: 0.5em;
    color: rgb(41, 189, 97);
   }
  
  img{
    margin: 0.3em;
  }
`;

 
 
 
 
const MarginTitle = styled.div`
  display: flex;
 
  width: 100%;
  justify-content: center;
  border-bottom: 1px solid rgba(183, 184, 189, 0.288);

   h1{
    font-size: 27px;
     color: #cadbd0;
     border-bottom: 1px solid rgba(213, 214, 219, 0.753);
     font-family: 'XcSemibold';
   }
`;

const MarginStore = styled.div`
 
   
   display: flex;
   align-items: center;
   overflow-y: auto;
   justify-content: center;
   position: relative;
   flex-direction: column;
   width: 100%;
 
  
  .titl{
    margin-top: 8em;
  }
   /* Estilizando a barra de rolagem para navegadores baseados em WebKit */
::-webkit-scrollbar {
    width: 4px;
    display: block;
    height: 6px; /* Também define a altura para barras de rolagem horizontais */
}

/* Estilizando a trilha da barra de rolagem */
::-webkit-scrollbar-track {
    background: transparent;
   
}

/* Estilizando o "polegar" da barra de rolagem (a parte que se move) */
::-webkit-scrollbar-thumb {
    background: rgba(160, 162, 163, 0.16290266106442575);
    border-radius: 1px;

}

`;

 

 
 
const Content = styled.div`
   display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

 
  li{
     
    display: flex;
    font-family: 'Europa Grotesk';
    flex-direction: column;
    border-radius: 6px;
   
  padding: 0.5em 0.6em 0.5em;
 

    h3{
    color: #c1c0c7;
    max-width: 200px;
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
    color: #23d86e;
    font-family: 'Inter';
    font-size: 13px;
    text-align: center;
    }

    h6{
      color: #858d86;
      text-align: center;
      font-size: 9px;
    
    }
  }

  .cardimage{
   padding: 1em 0 1em;
    margin: 0.3em;
 
    height: 190px;
  }
`;


const ContainerTop = styled.div`
  margin: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  @media screen and (max-width: 490px) {
    margin: 0;
  }
`;

interface ViewHeaderProps {
  bannerUrl: string;
}
const CardIN = styled.div<ViewHeaderProps>`
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  text-align: center;
  margin: 0.3em;
  background-repeat: no-repeat;
  height: 220px;
  width: 630px;
  border-radius: 22px;
  padding: 1em 2em 1em;
  background-size: cover;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: start;
  background-position: center;
  
   section{
    display: flex;

    flex-direction: column;

    ul{
      display: inline-flex;
      align-items: center;

      span{
        background-color: #1a1b1d;
        padding: 0.3em 0.6em 0.3em;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        width: 30px;
      }
    }
   }
   h1{
     font-size: 39px;
     color: #1ee25f;
     font-family: 'Europa Grotesk';
   }

   h3{
    font-size: 21px;
     color: #cadbd0;
     padding-left: 0.4em;
     font-family: 'XcSemibold';
    
   }

  a{
    margin: 0.4em;
    color: #1cd66a;
    font-family: 'InterSemiBold', monospace;
  }

   p{
    font-size: 16px; 
    font-family: 'InterSemiBold', monospace;
    max-width: 440px;
    color: #d0cfdae2;
   }

  @media screen and (max-width: 490px) {
    width: 100%;
  }
`;



const StoreContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 0.8em 2rem;

   .sectioncards{
    display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  display: grid;
  grid-template-columns: repeat(4, 1fr); 
  gap: 2px;
  padding: 0.3em;

   }
`;

const Card = styled.div`
 border-radius: 8px;
 background-color: rgb(9, 9, 10);  
   width: 210px;
  background-image: url('/icons/084mnfgjhdgdfyt4n.png');
  background-position: center;
  background-size: cover;
  border: 2px solid rgba(86, 95, 89, 0.356);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4em;
 margin-bottom: 0.8em;
 margin: 0.4em;

  ul{
    display: inline-flex;
    align-items: center;
  }
 
`;