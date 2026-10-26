import { Router } from "express";
import React from "react";
import styled from "styled-components"
import {useRouter} from 'next/navigation';

interface PrNode {
  Descriptions: React.ReactNode;
  Title: React.ReactNode;
  About: React.ReactNode;
  Redirect: React.ReactNode;
  thumbnail: React.ReactNode;
}


interface Thumb {
  thumbnail: React.ReactNode; 
}


export default function CardCarouselStore( { Descriptions,Title,About,Redirect, thumbnail} : PrNode){
  const router = useRouter()
    return(
        <>
        <Container onClick={() => router.push(`${Redirect}`)}>
        
             <Content thumbnail={thumbnail}>
             <TopIn>
               <i className="fi fi-sr-megaphone" />
              </TopIn>

              <Description className="useimagenone">
              
                <h2>{Title}</h2>

                <BoxDes>
                <p>{Descriptions}</p>
                </BoxDes> 
           </Description>

             </Content>
         
        </Container>
        </>
    )
}



//// styled 

const Content = styled.div<Thumb>`

  background-image: ${({ thumbnail }) => `url('${thumbnail}')`};
  background-color: rgb(8, 8, 17);;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 1em 2em 1em;
  background-position: center;
  border-radius: 9px; 
  height: 320px;
  width: 100%;
  position: relative;
  margin: 0.3em;
  transition: 1s all; 

  &:hover{
    border-radius: 19px; 

  }

  @media screen and (max-width: 430px) {
  height: 30vh;
  width: 100%;
  border-radius: 11px; 
 }

`;
 
 
const Description = styled.ul`
  
  margin: 0.2em;
  padding: 0.3em 1em 0.3em;
  position: absolute;
  bottom: 7px;
  left: 4px;
  animation: expand 0.5s forwards;
 
 
  li{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1em 0;
      
  span{
    display: flex;
    align-items: center;
    flex-direction: row;
  }

    h6{
        margin: 0.3em;
        color: #0d0d0e;
        background-color: rgb(30, 253, 86);
        padding: 0.2em 0.6em 0.2em;
        border-radius: 9px;
    }
    
    h3{
        font-family: 'Poppins', monospace;
        color: rgb(132, 145, 137);
    }
  }


  h2{
    font-family: 'Europa Grotesk';
    color: #d6e2d8;
    font-size: 29px;
  
    max-width: 390px;
    margin: 0.5em;
  }

  @keyframes expand {
    0% {
      opacity: 0;
      transform: scale(0.7);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;


const BoxDes = styled.div`
    background-color: rgba(3, 3, 3, 0.692);
    backdrop-filter: blur(34px);
    padding: 0.6em 1em 0.6em;
    border-radius: 12px;
    width: 24em;

  p{
   font-size: 13px;
   font-family: 'InterSemiBold', monospace;
   color: #ddd5d5ea;
   max-width: 380px;
  }

  @media screen and (max-width: 430px) {
    width: 100%;

   p{
    max-width: 100%;
   }
 }
`;

const Container = styled.div`
   display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: center;
  cursor: var(--f-cursor-pointer);
  
  @media screen and (max-width: 430px) {
   width: 100%;
   padding: 0 1em 0;
 }

`;
 

const TopIn = styled.ul`
  backdrop-filter: blur(100px);
  background-color: rgba(9, 8, 10, 0.87);
  border: 2px solid rgba(73, 73, 78, 0.226);
  padding: 1em 0.5em 0.8em;
  border-radius: 22px;
  height: 40px;
  position: absolute;
  right: 9px;
  width: 40px;
  display: flex;
  align-items: center;

  i{
    font-size: 20px;
    color: #79797e;
  }

`;
