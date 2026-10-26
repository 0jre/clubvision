import styled from "styled-components"
import React, { ReactNode } from 'react';
import ROUTENVX from "@/routes/routes";
import router from 'next/router';
import Scrollmargin from "@/components/scrollingcard/scroll.xc";

 

export default function Abounvrp () {
     
    return(
        <div>
     

        <MarginSeclei > 
   
      <LeftWasc  className="heis"/>
       <RightWasc  className="heis"/>
      </MarginSeclei>
 
        <Container >
        
 
       
          
         <Content>
 
         <h4>
         <span>The NoVision</span> Mergulhe em um ambiente ricamente detalhado e repleto de desafios emocionantes. Nossa prioridade é proporcionar a você a melhor experiência possível, e é por isso que nossos produtos foram desenvolvidos com cuidado meticuloso para garantir que você encontre exatamente o que procura.
        Prepare-se para uma experiência de jogo verdadeiramente imersiva e cativante. Nossa missão é garantir que você desfrute de momentos inesquecíveis enquanto explora os confins deste universo virtual
        </h4>
         
        <ViewUnButtons>
         <ul>

          <h5>Vai querer ser um clubr?</h5>
         <Linesa>
         <svg data-v-adc1ba32="" viewBox="0 0 130 5" fill="none" xmlns="http://www.w3.org/2000/svg" className="question-line"><path d="M1.5 3.50024C47.196 1.57488 83.5797 0.597003 128.5 2.61854" stroke-linecap="round" stroke-linejoin="round"></path></svg>
         </Linesa>
       
         <div className="flex items-center gap-2">
           
           <button className="butoncg" onClick={() => router.push(ROUTENVX.connectio)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="m15 18-6-6 6-6"/></svg>
              <h4>Jogar agora</h4>
           
           </button>

          <button className="butoncg" onClick={() => router.push('?code=active-novision')}>
              <h4>Usar o token</h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>


         </div>
         
         </ul>
 
         </ViewUnButtons>
         </Content>
       
        </Container>
 
      
        </div>
    )
}
 

 
const MarginCBD =  styled.div`
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
 width: 100%;
`;
 
const Content = styled.div`
  text-align: center;
  flex-direction: column;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  
     h5{
        font-family: 'ProximaNova-Italic';
        color: #27FF84;
        font-size: 12px;
     }

     span{
        font-family: 'ProximaNova';
        color: #27FF84;
     }
h4{
    font-size: 13px;
    font-family: 'Inter', monospace;
    max-width: 570px;
    color: #d8dbdfeb;
    text-align: center;
    margin-bottom: 0.6%;
   }
  
  
 
   @media screen and (max-width: 870px) {
    padding: 0.4em;
 }

`;

const MarginSeclei = styled.div`
  
   
    display: block flex;
    align-items: center;
    justify-content: center;

    .heis{
      height: 220px;
      width: 220px;
    }
  
`;

const Linesa = styled.div`
    width: 100px;
    stroke: #27FF84;
    stroke-width: 2px;
`;

const RightWasc = styled.div`
background-image: url('/theim/chracters-c/right-was-c.webp') ;
height: 340px;
width: 320px;
filter: saturate(0);
opacity: 0.7;
position: relative;
background-size: cover;
background-repeat: no-repeat;
 
  
`;



const LeftWasc = styled.div`
   background-image: url('/theim/chracters-c/left-was-c.webp') ;
  height: 380px;
  width: 320px;
  filter: saturate(0);
  opacity: 0.5;
  position: relative; 
  background-size: cover;
  background-repeat: no-repeat;
   
 
`;

 
const Container = styled.div`
   margin: 0 auto;
   width: 100%;
   max-width: 1200px;
   position: relative;
   height: 40vh;
  
   display: flex;
 
   justify-content: center;
   align-items: center;

   ul{
    display: flex;
   }
   

   @media screen and (max-width: 870px) {
    .activemobile{
      display: none;
    }
 }

   `;

 
const ViewUnButtons = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 9px;
   z-index: 90;
 

   .butoncg{
    padding: 0.6em 1em 0.6em;
    border: 1px solid #303131;
    width: 250px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: var(--f-cursor-pointer);
  

    &:hover{
      background-color: #23d171;
    }
   }

   h5{
       font-size: 13px;
    color: white;
    font-family: 'InterSemiBold', monospace;
   }
 

     ul{
    
    text-align: center;
  flex-direction: column;
  display: flex;
  gap: 9px;
    text-align: center;
    align-items: center;
    justify-content: center;
  }


  @media screen  and (max-width: 580px) {
     .butoncg{
       width: 150px;
      }
  }
 
`;

 