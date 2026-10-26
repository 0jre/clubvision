import { Router } from "express";
import React from "react";
import styled from "styled-components"
import router from 'next/router';

interface PrNode {
  Descriptions: React.ReactNode;
  Title: React.ReactNode;
  About: React.ReactNode;
  Redirect: React.ReactNode;
  thumbnail: React.ReactNode;
}

export default function CardCarousel( { Descriptions,Title,About,Redirect, thumbnail} : PrNode){
    return(
        <>
        <Container onClick={() => router.push(`${Redirect}`)}>
         
           {thumbnail}
           <Description className="useimagenone">
               <li>
              <span>
                <h3>TheNoVision</h3>
                <h6>{About}</h6>
                </span>

              <TopIn>
               <i className="fi fi-sr-megaphone" />
              </TopIn>
               </li>
                <h2>{Title}</h2>

                <BoxDes>
                <p>{Descriptions}</p>
                </BoxDes> 
 
           </Description>

        </Container>
        </>
    )
}



//// styled 

const Description = styled.ul`
  
  margin: 0.2em;
  padding: 0.3em 1em 0.3em;
  display: none;
 
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
    color: #68756a;
    font-size: 29px;
  
    max-width: 390px;
    margin: 0.5em;
  }

`;


const BoxDes = styled.div`
    background-color: rgba(99, 96, 104, 0.158);
    padding: 0.6em 1em 0.6em;
    border-radius: 12px;
    width: 24em;

  p{
   font-size: 13px;
   color: #77767a90;
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
  cursor: pointer;

  &:hover{
    border-radius: 19px; 
   
    .useimagenone{
    display: block;
    animation: expand 0.5s forwards;

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
 

    }
  }


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
  width: 40px;
  display: flex;
  align-items: center;

  i{
    font-size: 20px;
    color: #79797e;
  }

`;
