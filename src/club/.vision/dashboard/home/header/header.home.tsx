import styled, { keyframes } from 'styled-components';
import React, { useState, useEffect } from 'react';
import router from 'next/router';
import ROUTENVX from '@/routes/routes';

const TypedText: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, currentIndex));
      currentIndex++;
      if (currentIndex > text.length) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [text]);

  return <Text>{displayText}</Text>;
};

const IndexPage: React.FC = () => {
  return (
    <ContainerText>
      <p>
      <TypedText text="Olá, bem-vindo à nossa comunidade de roleplay GTA! Aqui, você pode explorar, criar e viver histórias incríveis com outros jogadores. Junte-se a nós e mergulhe na ação!" />
      </p>
    </ContainerText>
  );
};

interface CharacterImage {
    charimage?: React.ReactNode;
    charimagehover?: React.ReactNode;
    Steps?: React.ReactNode;
}

export default function HeaderPageindex () {
  useEffect(() => {
    const activeCard = document.querySelector('.activeCard');
    const notops = document.querySelector('.notops');
    const characters = document.querySelectorAll('.character');
    const steps = document.querySelectorAll('.activestep1, .activestep2, .activestep3, .activestep4');

    if (activeCard && notops && characters.length) {
      // Adicionar classe ao passar o mouse
      activeCard.addEventListener('mouseenter', () => {
        notops.classList.add('active');
        characters.forEach((character) => character.classList.add('active'));
        
        steps.forEach((step) => {
          step.classList.remove('enter'); // Remove a classe de entrada
          step.classList.add('active'); // Adiciona a classe de saída
        });
      });

      // Remover classe ao sair do mouse
      activeCard.addEventListener('mouseleave', () => {
        notops.classList.remove('active');
        characters.forEach((character) => character.classList.remove('active'));

        steps.forEach((step) => {
          step.classList.add('enter'); // Adiciona a classe de entrada
          step.classList.remove('active'); // Remove a classe de saída
        });
      });
    }

    return () => {
      if (activeCard && notops && characters.length) {
        activeCard.removeEventListener('mouseenter', () => {});
        activeCard.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);


    return(
        <>
      <Container>
     <HeFow>
     <Header className="notops" />
  
     <ContainerMargin>
        <ContainerBNC className='tmsj'>
        <Card charimage={`/theim/chracters-c/police-bg.webp`} className='character activemobile'>
         <ul>
         <li>
        <Content charimagehover={`/theim/chracters-c/police-g.webp`} className='characterbvn activemobile'>
           <span>
           <h4>TORNE-SE</h4>
         <p>POLICIAL</p>
           </span>
        </Content>
        </li>
         </ul>
        </Card>

        <Card  charimage={`/theim/chracters-c/job-bg.webp`} className='character activemobile '>
        <ul>
         <li>
        <Content charimagehover={`/theim/chracters-c/job-g.webp`} className='characterbvn activemobile'>
           <span>
           <h4>TORNE-SE</h4>
         <p>TRABALHADOR</p>
           </span>
        </Content>
        </li>
         </ul>
        </Card>

        <Card charimage={`/theim/chracters-c/gangue-bg.webp`} className='character activemobile'>
        <ul>
         <li>
        <Content charimagehover={`/theim/chracters-c/gangue-g.webp`} className='characterbvn activemobile'>
           <span>
           <h4>TORNE-SE</h4>
         <p>GANGSTER</p>
           </span>
        </Content>
        </li>
         </ul>
        </Card>

        <CardCenter charimage={`/theim/chracters-c/novision.webp`} className='activeCard' onClick={() => router.push(ROUTENVX.Dashboard)}>
        <ul>
         <li>
        <ContentCX >
            <i className='fi fi-ss-play-circle'/>
           <h2>ACESSAR O CLUB</h2>
        </ContentCX>
        </li>
         </ul>
        </CardCenter>
         

        <CardCenter charimage={`/theim/chracters-c/info-bg.webp`} className=' activemobi'>
        <ul>
         <li>
      
        <ContentCX className='activemobi'>
            <i className='fi fi-rs-rocket-lunch'/>
           <h2>ACESSE PELO PC</h2>
        </ContentCX>
        </li>
         </ul>
        </CardCenter>

        <Card charimage={`/theim/chracters-c/mafia-bg.webp`} className='character activemobile'>
        <ul>
         <li>
        <Content charimagehover={`/theim/chracters-c/mafia-g.webp`} className='characterbvn activemobile'>
           <span>
           <h4>TORNE-SE</h4>
         <p>LIDER</p>
           </span>
        </Content>
        </li>
         </ul>
        </Card>

        <Card  charimage={`/theim/chracters-c/doctor-bg.webp`} className='character activemobile'>
        <ul>
         <li>
        <Content charimagehover={`/theim/chracters-c/doctor-g.webp`} className='characterbvn activemobile'>
           <span>
           <h4>TORNE-SE</h4>
         <p>DOUTOR</p>
           </span>
        </Content>
        </li>
         </ul>
        </Card>

        <Card charimage={`/theim/chracters-c/military-bg.webp`} className='character activemobile'>
        <ul>
         <li>
        <Content charimagehover={`/theim/chracters-c/military-g.webp`} className='characterbvn activemobile'>
           <span>
           <h4>TORNE-SE</h4>
         <p>MILITAR</p>
           </span>
        </Content>
        </li>
         </ul>
        </Card>
        </ContainerBNC>
         <li className='marginsub'>
            <IndexPage />
        </li>
        </ContainerMargin>

        <Steps>
           <img src={'/web/but-icon-head-4.png'} alt='step novision' className='Step1 activestep1'/>
           {/* <img src={'/web/step-money-blur.png'} alt='step novision' className='Step2 activestep2'/> */}
           {/* <img src={'/web/step-money-right.png'} alt='step novision' className='Step3 activestep3'/> */}
           {/* <img src={'/web/steps-car.png'} alt='step novision' className='Step4'/>  */}
        </Steps>
     </HeFow>
     </Container>
        </>
    )
}



const Steps = styled.div`
 transition: 1s all;
  
 .Step1{
 position: absolute;
 left: 4%;
 top: 5%;
 height: 130px;
 }

 .Step2{
  position: absolute;
 right: 4%;
 height: 130px;
 top: 5%;
 }

 .Step3{
  position: absolute;
 left: 4%;
 bottom: 5%;
 height: 130px;
 }
 
 .Step4{
  position: absolute;
 right: 4%;
 bottom: 5%;
 z-index: 12;
 height: 170px;
 }

 
 .active {
    transform: scale(1.1); 
    
    transition: transform 0.3s linear; 

    &.activestep1, &.activestep3 {
      transform: translateX(-170%) rotate(-20deg); /* move para a esquerda com rotação */
    }

    &.activestep2, &.activestep4 {
      transform: translateX(170%) rotate(20deg); /* move para a direita com rotação */
    }
  }

  /* Animações para entrada */
  .enter {
    transition: transform 0.3s linear; 
    &.activestep1, &.activestep3 {
      transform: translateX(0) rotate(0); /* posição original para entrada */
    }

    &.activestep2, &.activestep4 {
      transform: translateX(0) rotate(0); /* posição original para entrada */
    }
  }

 
`;

  
const Container = styled.section`
   display: flex;
   align-items: center;
  justify-content: space-evenly;
   
   @media screen and (max-width: 530px) {
    margin-bottom: 0;
  
    .activemobile{
      display: none;
    }
   }
 
   @media screen and (min-width: 530px) {
     
     .activemobi{
       display: none;
     }

     .characterbvn{
      transform: translateY(0) scale(0);
     
     }
    }

`;
 
const HeFow = styled.div`
  position: relative;
  width: 100%;
  height: 80vh;
  margin-bottom: 2em;
 
  transition: 1s all;
    
  .notops.active {
    filter: saturate(1) opacity(1);
  }

 
 .character.active {
    filter: saturate(1);

  
  .characterbvn{
    transform: translateY(-1px) scale(1.2);
    background-size: 100%;
 
    
  }

   
  }
 

   

  .characterbvn{
      transform: translateY(-0px) scale(1.1);
    background-size: 100%;
   
    &:hover{
      transform: translateY(-0px);
     
    }
    }


   
`;

const Header = styled.header`
  background: url('/theim/backgrounds/bdsh8fisdbfgshdnub.webp') ;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-position-y: 90%;
  filter: saturate(0) opacity(0.2);
  transition: 1s all;

    
  @media screen and (max-width: 530px) {
    filter: saturate(0) opacity(0.2);
   }
`;
 


const typingAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const ContainerText = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;

    @media screen and (max-width: 430px) {
      max-width: 350px;
   }
`;

const Text = styled.span`
  overflow: hidden;
  white-space: nowrap;
  animation: ${typingAnimation} 3s steps(40, end);

   @media screen and (max-width: 430px) {
    white-space: wrap;
   }
`;

 
const ContainerMargin = styled.div`
 width: 100%;
 height: 100%;
 place-items: center;
 flex-direction: column;
 display: flex;
 justify-content: center;
 align-items: center;
 position: absolute;
 top: 1%;
 z-index: 1;
  margin-top: 4em;
  .marginsub{
    margin-top: 1em;
  }

 p{
    font-family: 'ProximaNova-Italic';
    font-size: 11px;
    color: rgb(164, 170, 175);
 }

 @media screen and (max-width: 530px) {
   
    p{
    flex-wrap: wrap;
    text-align: center;
    max-width: 350px;
    }
  }
`;


const ContainerBNC = styled.div`

 place-items: center;
 display: flex;
 justify-content: space-between;
 align-items: center;
 
`;

const ContentCX = styled.div`
 
    text-align: center;
    position: absolute;
    bottom: 12px;
    left: 0;
    top: 1;
    z-index: 32132;
    
    right: 0;
    
    
    h2{
    font-family: 'ProximaNova-Italic';
    font-size: 11px;
    color: rgb(168, 166, 173);
    }

    i{
    font-size: 45px;
 
   }


   @media screen and (max-width: 530px) {
     
    i{
    font-size: 35px;
    color: #abadb4;
   }
    }
 
 
`;

const Content = styled.div<CharacterImage>`
 height: 100%;
 width: 100%;
 background-image: ${({ charimagehover }) => `url('${charimagehover}')`};
 background-size: 100%;
 background-repeat: no-repeat;
 border-radius: 10px;
 transition: 0.1s all;
 position: absolute;
 bottom: 1;

  

   span{ 
    opacity: 0;
    position: fixed;
    bottom: 1px;
    left: 0;
    top: 0;
    margin-top: 227%;
    right: 0;
   }
  
   
 &:hover{
    content: "";
    background-image: ${({ charimagehover }) => `url('${charimagehover}')`};
    background-size: 100%;
     
   
  span{
    text-align: center;
    opacity: 1;

    h4{
    font-family: 'ProximaNova-Italic';
    font-size: 11px;
    color: rgb(168, 166, 173);
    }

    p{
    font-family: 'ProximaNova';
    font-size: 12px;
    color: rgb(230, 228, 236);
    }
  }
  }

  @media screen and (max-width: 530px) {
    
    span{
      margin-top: 100%;
    }
   }

`;

 
const Card = styled.div<CharacterImage>`
   content: "";
   height: 388px;
   width: 150px;
   border: 2px solid rgba(25, 27, 27, 0.534);
   transition: 0.2s all;
   border-radius: 10px;
   transition: 1s all;
   margin: 0.4em;
   overflow: hidden;
   
   filter: saturate(0);
  
  ul{
  background-image: ${({ charimage }) => `url('${charimage}')`};
  background-repeat: no-repeat;
  border-radius: 10px;
  background-size: 100%;
  height: 100%;
  width: 100%;

  li{
    border-radius: 10px;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(250, 36, 143, .12) 0%, #e607257d 100%);
   }


  }

 
   &:hover{
    filter: saturate(1);
     
     
   }
   @media screen and (max-width: 530px) {
    filter: saturate(1) opacity(1);
   }


`;


 
const CardCenter = styled.div<CharacterImage>`
   content: "NOVISION";
   height: 388px;
   width: 150px;
   border: 2px solid rgba(25, 27, 27, 0.534);
   transition: 0.2s all;
   border-radius: 10px;
   margin: 0.4em;
   cursor: var(--f-cursor-pointer);
  ul{
  background-image: ${({ charimage }) => `url('${charimage}')`};
  background-repeat: no-repeat;
  border-radius: 10px;
  background-size: 100%;
  height: 100%;
  position: relative;
  width: 100%;

  li{
    border-radius: 10px;
    width: 100%;
    height: 100%;
     
   }

   span{
    filter: saturate(1);
   }


  }

 
   &:hover{
    filter: saturate(1);
   }


`;
