import styled from "styled-components"
import React from 'react';
import router from 'next/router';
import ROUTENVX from "@/routes/routes";
import TypewriterComponent from "typewriter-effect";
import Image from "next/image";
 
interface Pos {
    children: React.ReactNode;
}

export default function HeaderTops ({children} : Pos) {
    return(
        <>
      
      <Container>
      <Header>
       <Overlay>
         <ContentAboutI>

           <Image src={'/nvrp/20221001_185012.png'} 
           alt='novision' className={'novision'} width={180} height={80}/>
          <ul>
          <h1>J<span className="icongraffit">O</span>GUE</h1> 
          <h1><TypewriterComponent  options={{ strings: ["ROLEPLAY AQUI","E FAÇA AMIZADES", "COM AMIGOS", "E SEJA COMPETITIVO" ,"E FIQUE VICIADO","ATE SER UM LEVEL WIN", "AQUI É DIVERSÃO", "COM GRANDES PLAYERS"],  autoStart: true, loop: true,}}/></h1> 
          </ul>
          <h2>Imersão realistica e muita diversão.</h2>
          {children}
        </ContentAboutI> 
     
     
       </Overlay>
     
       <HeFow/>
    
        
      </Header>
 
     </Container>
        </>
    )
}

  
const ContentAboutI = styled.div`
    
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  
    ul{
    text-align: center;
    display: flex;

    align-items: center;
    flex-wrap: wrap;
    }
  
     .novision{
      display: none;
     }
    .icongraffit::before{
      content: "";
    background-image: url('/icons/o_icon.png');
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
    width: 46px;
    height: 50px;
    position: absolute;
     
    }
    
   h1{
     font-family: 'Europa Grotesk';
     font-size: 46px;
     margin: 0.2em;
     color:  rgb(210, 226, 218);
   }

   h2{
     font-family: 'XcSemibold';
     font-size: 26px; 
     color:  rgb(19, 20, 19);
     display: block;
    margin-block-start: 0.4em;
    margin-block-end: 0.5em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: 400;
    unicode-bidi: isolate;
   }
 

   @media screen and (max-width: 545px) {
     margin-top: -6%;
     position: relative;
  
     h1{
      font-size: 34px;
     }

     h2{
      color: #787c7e;
     }
   }

   @media screen and (max-width: 430px) {
     
       
      height: 100%;
      width: 100%;
      bottom: 0;
      top: 30%;

      .novision{
           display: block;
           margin-top: 8em;
      }

      h1{
      font-size: 18px;
     }

     h2{
      font-size: 17px;
     }

     .icongraffit::before{
      content: "";
    background-image: url('/icons/o_icon.png');
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
    width: 20px;
    height: 30px;
    position: absolute;
     
    }
   }


   @media screen and (min-width: 360px) and (max-width: 380px){
     h1{
      font-size: 18px;
     }
  } 

 

  @media screen and (max-width: 280px){
    margin-left: -5em;
      h1{
        font-size: 14px;
      }
  }
`;

 

const Container = styled.section`
   display: flex;
   align-items: center;
   flex-direction: column;
   z-index: 0;
   
`;

const Overlay = styled.div`
  background-image: linear-gradient(to bottom, transparent, transparent 60%, rgba(0, 0, 0, 1)), url('/theim/characters/9406616e-fae5-4b2d-bebd-39ea5eeca20d_0.png') !important;
  background-size: cover;
    position: relative;
   
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  background-repeat: no-repeat;
  width: 1100px;
  height: 100vh;


  @media screen and (max-width: 430px) {
     width: 680px;
     height: 480px;
  }

  @media screen and (max-width: 380px) {
     width: 680px;
     height: 420px;
  }

  @media screen and (max-width: 375px) {
    height: 490px;
    width: 690px;
   }
`;

const HeFow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(274deg, rgb(0, 0, 0) 10%, rgba(0,0,0,0) 48%, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 98%);
  mix-blend-mode: overlay;
 
  @media screen and (max-width: 530px) {
    
     background: linear-gradient(274deg, rgba(0, 0, 0, 0.445) 10%, rgba(0,0,0,0) 48%, rgba(0,0,0,0) 60%, #0000006f 98%);
  }
`;

const Header = styled.header`
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0,0,0,1) 100%), url('/theim/backgrounds/hdfysufb34.jpg') ;
  height: 100vh;
  width: 100%;
 
  background-size: cover;
  background-repeat: no-repeat;
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

    @media screen and (max-width: 430px) {
      height: 100vh;
      background-size: 110vh;
      background-position-x: -79vw;
   
}
`;
 
