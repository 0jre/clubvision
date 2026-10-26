import React from 'react'
import styled from 'styled-components'
import router from 'next/router';
import ROUTENVX from '@/routes/routes';


export default function FaqServer () {
    return(
        <>
  
        <Container>     
    <Conten3>
    <Title>
        <h2>RESPOSTAS A PERGUNTAS COMUNS</h2>
        </Title>
        


    <MarginCard>
        <Card>
        <Content>
          <h4>O que é o The NoVision RP?</h4>
          <p>Esse é um projeto exclusivo baseado no GTA V, que permite que milhares de jogadores interajam entre si em tempo real.</p>
        </Content>
        </Card>


        <Card>
        <Content>
          <h4>O que é Role Play?</h4>
          <p>Esse é um modo de jogo em que os participantes criam personagens e cenários e, em seguida, agem de acordo com suas funções no jogo.</p>
        </Content>
        </Card>



        <Card>
        <Content>
          <h4>Como faço para começar a jogar no The NoVision?</h4>
          <p>Primeiro, você precisa baixar um GTA V licenciado e instalar o Fivem. Apos isso ative sua conta clubvision.</p>
        </Content>
        </Card>



        <Card>
        <Content>
          <h4>O que você deve fazer no servidor?</h4>
          <p>Além de uma grande variedade de profissões e interação com os jogadores, temos atualizações regulares e eventos sazonais disponíveis.</p>
        </Content>
        </Card>

        
        <Card>
        <Content>
          <h4>O que é o Clubvision?</h4>
          <p>É um app para conectar os players e o servidor. O Clubvision é uma parte importante para a comunidade thenovision, capaz de automaticar funções que player precisariam contactar a staff do servidor.</p>
        </Content>
        </Card>


        
        <Card>
        <Content>
          <h4>Onde posso encontrar as regras do servidor?</h4>
          <p>Uma seção com regras do servidor, pode ser encontrada em <span onClick={() => router.push(ROUTENVX.Legal)}>Regras servidor</span></p>
        </Content>
        </Card>

        </MarginCard>
        </Conten3>
    
        </Container>
        </>
    )
}


//
 
const Title = styled.ul`
   margin-bottom: 3%;
   
   h2{
    font-family: 'ProximaNova';
         font-size: 18px;
   }

     @media screen and (max-width: 430px) {
     text-align: center;
     display: flex; 
     justify-content: center;
     flex-direction: column;
   }
`;


const MarginCard = styled.div`

    display: grid;
    grid-template-columns: repeat(3, 3fr);
    grid-template-rows: auto;
    grid-gap: 1rem;
 
 
    @media screen and (max-width: 430px) {
      grid-template-columns: repeat(1, 1fr);
    
 }

`;

const Conten3 = styled.div`
   display: flex;
   flex-direction: column;
   
   @media screen and (max-width:430px ){
    
   }
`;

const Container = styled.div`
 width: 100%;
 
 place-items: center;
 display: flex;
 justify-content: center;
 align-items: center;
 margin-bottom: 4%;

 @media screen and (max-width: 430px) {
    padding: 0.4em;
 }
`;

const Content = styled.div`
   
   h4{
    font-family: 'Inter', monospace;
    font-size: 14px;
    font-weight: 200;
    margin-bottom: 0.6em;
   }

   p{
    font-family: 'ProximaNova-Italic';
   font-size: 12px;
    color: rgb(164, 170, 175);
    max-width: 460px;
   }
   span{
    color: #27FF84;
    cursor: pointer;
   }
`;

const Card = styled.div`
    transition: opacity .2s ease;
    padding: 0.8em 1em 0.8em;
    border: 1px solid rgba(79, 79, 82, 0.349);
    border-radius: 11px;
`;