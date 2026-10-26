import { Router } from "express";
import React from "react";
import styled from "styled-components"
import router from 'next/router';

interface PrNode {
  Descriptions: React.ReactNode;
  Title: React.ReactNode;
  About: React.ReactNode;
  Redirect: React.ReactNode;
  Date: React.ReactNode;
  Thumbnail: React.ReactNode;
}

export default function CardAdminCarousel( { Descriptions,Title,About,Redirect,Date,Thumbnail } : PrNode){
    return(
        <>
        <Container>
        {Thumbnail}  
           <Description>
               <li>
              <span>
                <h4>TheNoVision</h4>
                <h6>{About}</h6>
              
                </span>

              <TopIn>
               <i className="fi fi-sr-megaphone" />
              </TopIn>
               </li>
                <h2>{Title}</h2>

                <BoxDes>
                <p>{Descriptions}</p>
                 <h5>{Date}</h5>
                </BoxDes> 

                <ButtonRedirect>
                     <i className="fi fi-bs-site-alt" />
                     <h3>{Redirect}</h3>
                </ButtonRedirect>
           </Description>

        </Container>
        </>
    )
}



//// styled 

const Description = styled.ul`
  
  margin: 0.2em;
  padding: 0.3em 1em 0.3em;
 
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
        color: #c4c4cf;
        background-color: rgb(30, 253, 86);
        padding: 0.2em 0.6em 0.2em;
        border-radius: 9px;
    }
    
    h4{
        font-family: 'Poppins', monospace;
        color: rgb(125, 124, 131);
    }
  }


  h2{
    font-family: 'Europa Grotesk';
    color: #0d0e0d;
    font-size: 29px;
    margin: 0.5em;
  }

`;


const BoxDes = styled.div`
    background-color: rgba(21, 20, 22, 0.158);
    padding: 0.6em 1em 0.6em;
    border-radius: 12px;

  p{
   font-size: 13px;
   color: #0d0e0d;
  }
`;

const Container = styled.div`
   display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: center;

`;

const ButtonRedirect = styled.div`
    
    background-color: rgba(12, 12, 14, 0.082);
   padding: 0.9em 2em 0.9em;
   border-radius: 62px;
   font-size: 14px;
   color: #c2cac6ec;
    margin-top: 5%;
   z-index: 1;
   transition: 1s all;
   display: flex;
   flex-direction: row;
   align-items: center;
   border: 2px solid transparent;
   
   &:hover{
    box-shadow: -11px 18px 1px black;
    border: 2px solid #110f0f2b;
   }

   @media screen and (min-width: 200px) and (max-width: 545px) {
     display: none;
   }

   @media screen and (max-width: 280px){
      margin-left: -5em;
      font-size: 13px;
  }
`;

const TopIn = styled.ul`
  backdrop-filter: blur(100px);
  background-color: rgba(188, 184, 192, 0.096);
  border: 2px solid rgba(73, 73, 78, 0.226);
  padding: 1em 0.5em 0.8em;
  border-radius: 22px;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;

  i{
    font-size: 20px;
    color: #0d0d0e;
  }

`;

 