import styled from 'styled-components'
import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'

/// 

import IconIo from '@/public/icons/crown_badge.png'
import router from 'next/router';
import ROUTENVX from '@/routes/routes'


export default function Createinfo () {
    return(
        <>
        <Container>
         <Content>
           
            <ul>
            <Image
             className='iconsM' 
             src={IconIo}   alt={'icon'}  width={110} height={90}/>

                <li className='li'>
                <h2>AINDA NÃO JOGOU NO THENOVISION?</h2>
               <h3>SISTEMAS DE JOGO AVANÇADO, CONTROLES SIMPLES, IMERSÃO COMPLETA</h3> 
                </li>
            </ul>


            <button onClick={() => router.push(ROUTENVX.storePrime)}>
              COMPRAR O PRIME
            </button>
         </Content>
        </Container>
        </>
    )
}


//// 


const Container = styled.div` 
   background: linear-gradient(204deg, #5cffdc40 -7%, #b85cff00 33%), linear-gradient(162deg, #23e78c40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(71, 71, 78, 0.075));
   padding: 0.7em 1em 0.7em;
   border-radius: 8px;
   width: 100%;
   margin-top: 1em;
   margin-left: 0;
   box-shadow: -11px 18px 1px black;
`;

const Content = styled.div`
   
   display: flex; 
   align-items: center;
   justify-content: space-between;
   width: 100%;

     ul{
    display: flex; 
    align-items: center;

     img{
        padding-right: 1em;
     }
     }
   

     h2{
      font-size: 19px;
      background: linear-gradient(47deg, #acb8b2 0%, rgb(114, 209, 161) 1%, #0a0b0c 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
   font-family: 'Europa Grotesk';
    }
     
    .li{
        margin: 0;
    }

    h3{
     font-family: 'Inter', sans-serif;
     font-size: 13px;
     color: #97a19deb;
    }
  

    button{
      background: linear-gradient(204deg, #5cffdc40 -7%, #b85cff00 33%), linear-gradient(162deg, #23e78c40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(71, 71, 78, 0.075));
 
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