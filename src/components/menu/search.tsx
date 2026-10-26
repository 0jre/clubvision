import React,{ useRef, useState, useEffect } from "react";
import styled from "styled-components"
import router from 'next/router';
import NVXROUTE from '@/routes/routes';


  
  export default function  Search () {
    return(
        <>
   
        <Container>
      
          <ScrollingCardUserinfo>
             
          <CardSearch onClick={() => router.push(NVXROUTE.Upgrades)} bannerUrl={'/theim/backgrounds/ef5e2017b9808d101adc7881adac4a768c0125ad.jpg'}>
          <CardInfo>
            <li>
             <h2>ATUALIZAÇÕES</h2>
             <h5>NOVISION</h5>
            </li>
          </CardInfo>
          </CardSearch>

 
          <CardSearch  bannerUrl={'/theim/backgrounds/6728906232133d742c883f3c868f9a0aef711f19.jpg'}>
          <CardInfo>
            <li >
             <h2>ESTATÍSTICAS</h2>
             <h5>CLUB & NVRP</h5>
            </li>
            
          </CardInfo>
          </CardSearch>



          <CardSearch  bannerUrl={'/theim/backgrounds/d690ecb6f0b178d9357739727a4e45dd1d60d525.jpg'}>
          <CardInfo>
            <li>
             <h2>CONQUISTAS</h2>
             <h5>NOVISION</h5>
            </li>
            
          </CardInfo>
          </CardSearch>



          <CardSearch  bannerUrl={'/theim/backgrounds/69eb761e0d5e91d509a8d714e3ad21a5b398a131.jpg'}>
          <CardInfo>
            <li>
             <h2>MISSOES</h2>
             <h5>Missões para desbloquear recursos e levels esta aqui!</h5>
            </li>
            
          </CardInfo>
          </CardSearch>
       
          <CardSearch  bannerUrl={'/theim/backgrounds/16aee4e8a8731f418c93ed0aa84555d73da16609.jpg'}>
          <CardInfo>
            <li>
             <h2>MAGNATAS</h2>
             <h5>Acesso vip para magnatas prime!</h5>
            </li>
            
          </CardInfo>
          </CardSearch>
       

          </ScrollingCardUserinfo>
        
        </Container>
  
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
           <ul>
          {children}
          </ul>
   
      </CardViewList>
    );
  };


/// styled 

interface ViewHeaderProps {
    bannerUrl: string;
}
  

const CardViewList = styled.div`
   
height: 100%;
width: 100%;
overflow-x: auto;
display: flex;
transition: 1s all;
justify-content: center;
animation: alternate;
border: none;
place-items: center;
cursor: grab;

:active {
cursor: grabbing;
}
 

ul{
    display:inline-flex;
    padding-left: 60%;
     
}
 
`;




const CardSearch = styled.div<ViewHeaderProps>`
 
   height: 450px;
   width: 380px;
   padding: 0.4em 1em 0.4em;
   margin: 0.4em;
   background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
   background-position: center;
   background-size: cover;
   background-repeat: no-repeat;
   border-radius: 12px;
   transform: skewX(-15deg); 
   filter: saturate(0);
   transition: 1s all;


   &:hover{
    filter: saturate(1);
    cursor: pointer;
   }
   
`;

 
const Container = styled.div`
 
  margin-bottom: 5em;
  margin-top: 3em;
  display: flex;
  place-items: center;
  flex-direction: column;
  align-items: center; 
  justify-content: center;
`;

 
const CardInfo = styled.div`
    
    h2{
     font-family: 'XcSemibold', sans-serif;
     font-size: 27px;
     color: #02ff81;
    }


    h5{
      font-family: 'ProximaNova-Italic', monospace;
      font-size: 12px;
      color: white;
    
    }


    li{
        margin-top: 100%;
        position:absolute;
    }

  
`;


  