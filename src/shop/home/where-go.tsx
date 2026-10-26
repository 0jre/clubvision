'use client'
import React,{ useRef, useState, useEffect } from "react";
import styled from "styled-components"
import ROUTENVX from "@/routes/routes";
import { useRouter } from "next/navigation";
 
  
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
  
   
    return (
      <CardViewList
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        ref={containerRef}
      >
        <ContentList >{children}</ContentList>
      </CardViewList>
    );
  };

  export default function Whehere ( ) {
    const router = useRouter();
    return(
        <>
       
        
        <Container>
        <h2>CATEGORIAS</h2>
        <ScrollingCardUserinfo>
      
        <SwiperSlide>
    <GradientContainer onClick={() => router.push(ROUTENVX.storealllist)}>
      <ContentContainer $bannerUrl="linear-gradient(349deg, rgba(143,105,58,1) 0%, rgba(162,97,62,1) 57%, rgba(102,81,59,1) 100%)">
        <TitleContainer>
          <span>
            <MainTitle>Storevision</MainTitle>
          </span>
          <SubTitle>Compre veiculos e recursos para sua conta.</SubTitle>
        </TitleContainer>
        <AdditionalText>
          Obtenha <span className="highlight">items limitados</span> 
        </AdditionalText>
     
        <Overlay $bannerUrl="/theim/characters/mL08YH1.png"/> 

      </ContentContainer>
    </GradientContainer>
  </SwiperSlide>



  <SwiperSlide>
    <GradientContainer onClick={() => router.push(ROUTENVX.payaddfund)}> 
      <ContentContainer $bannerUrl="linear-gradient(349deg, #2f9b56 0%, rgba(62,162,102,1) 57%, #217442 100%)">
        <TitleContainer>
          <span>
            <MainTitle>Comprar Bits</MainTitle>
          </span>
          <SubTitle>Compre bits e acesse a loja visionstore.</SubTitle>
        </TitleContainer>
        <AdditionalText>
          VisionStore <span className="highlight">Obtem items raros e limitados</span> 
        </AdditionalText>
     
        <Overlay $bannerUrl="/theim/characters/fb_183b3236aa2c9aa328a23aaf96b36afd_1.png"/> 

      </ContentContainer>
    </GradientContainer>
  </SwiperSlide>




  <SwiperSlide>
    <GradientContainer onClick={() => router.push(ROUTENVX.storePrime)}>
      <ContentContainer $bannerUrl="linear-gradient(349deg, rgba(58,143,78,1) 0%, rgba(62,162,62,1) 57%, rgba(59,102,70,1) 100%)">
        <TitleContainer>
          <span>
            <MainTitle>Premium</MainTitle>
          </span>
          <SubTitle>Assine o premium e tenha tudo a sua disposição.</SubTitle>
        </TitleContainer>
     
        <Overlay $bannerUrl="/icons/prime.webp"/> 

      </ContentContainer>
    </GradientContainer>
  </SwiperSlide>
        

  <SwiperSlide>
  <GradientContainer 
    onClick={() => router.push(ROUTENVX.storeclub)}>

      <ContentContainer $bannerUrl=" linear-gradient(349deg, rgba(15,8,9,1) 0%, rgba(10,11,18,1) 57%, rgba(24,14,16,1) 100%)">
        <TitleContainer>
          <span>
            <MainTitle>Shopclub</MainTitle>
          </span>
          <SubTitle>Compre recursos para sua conta clubvision usando orbits</SubTitle>
        </TitleContainer>
     
        <Overlay $bannerUrl="/theim/characters/34u53n83943bd43.png"/> 

      </ContentContainer>
    </GradientContainer>
  </SwiperSlide>
       
  </ScrollingCardUserinfo>
        </Container>
 
        </>
    )
}

 
const CardViewList = styled.div`
width: 100%;
overflow-x: auto;
border-radius: 19px;

cursor:  var(--f-cursor-grab);

:active {
cursor:  var(--f-cursor-grabbed);
}


::-webkit-scrollbar {
 display: none;
 }
    
::selection{
display: none;
}
 
 
`;


const ContentList = styled.section`

display: inline-flex;
padding: 0 3em 3em;
 
 

`;

 
 
 

const Overlay = styled.div<{ $bannerUrl: string }>`
  background-image: url(${props => props.$bannerUrl});
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center;
  width: 320px;
  height: 320px;
  position: absolute;
  bottom: 1px;
  top: 17%;

 
`;


const SwiperSlide = styled.div`
  width: 363.2px;
  margin-right: 10px;
  aspect-ratio: 1 / 1; /* Equivalente ao aspect-square */
`;

// Div que envolve o conteúdo com borda dupla e gradiente
const GradientContainer = styled.div`
  overflow: hidden;
  width: 100%;
  cursor: var(--f-cursor-pointer);
  height: 100%;
  transition: 1s all;
  filter: saturate(0);

   &:hover{
    opacity: 0.9;
    filter: saturate(1);
     
   }
`;

// Bloco de conteúdo principal
const ContentContainer = styled.div<{ $bannerUrl: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background:  linear-gradient(349deg, rgba(15,8,9,1) 0%, rgba(10,11,18,1) 57%, rgba(24,14,16,1) 100%);
 
  border-radius: 24px;
  background-size: cover;
  background-position: center;
  padding: 1rem;
  transition: 1s all;
   
   &:hover{
    background: ${({ $bannerUrl }) => `${$bannerUrl}`};
   }
`;

// Seção de texto com título
const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
`;

// Título principal
const MainTitle = styled.div`
  white-space: nowrap;
  font-size: 21.38px;
  font-weight: 600;
  line-height: 1.5;
  font-family: 'XcSemibold';
  @media (min-width: 768px) {
    font-size: 35px;
  }
`;

// Subtítulo com cor personalizada
const SubTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #cfd8d3;
  font-family: 'InterSemiBold', monospace;
 
`;

// Texto adicional
const AdditionalText = styled.span`
  font-size: 11px;
  font-family: 'InterSemiBold', monospace;
  @media (min-width: 768px) {
    font-size: 15px;
  }
  .highlight {
    color: #d3d9db;
  }
`;

  
const Container = styled.div`
   display: flex; 
   justify-content: center;
   flex-direction: column;
   align-items: center;
   width: 100vw;
     
  h2{
    font-family: 'Europa Grotesk';
    color: #d6e2d8;
    font-size: 29px;
    margin: 1em;
    text-align: center;
    max-width: 390px;
   
  }
`;

  