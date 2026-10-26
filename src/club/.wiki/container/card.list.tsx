

import React, { useRef, useState } from "react";
import styled from "styled-components";
import router from "next/router";
import moment from 'moment-timezone';


interface ViewHeaderProps {
    bannerUrl: string;
  }
    
interface CviewCardCS {
    children: React.ReactNode;
    redirect: string;
    urlimage: string;
    title: string;
    description: string | undefined;
    Tagged: React.ReactNode;
    Date: string;
  }
  
  const Cardwiki: React.FC<CviewCardCS> = ({
    description, title, redirect,urlimage,Tagged,Date
  }) => {
   
 // Aqui estamos configurando o idioma para pt-br
 moment.locale('pt-br');

 // Criamos uma variável para armazenar a data
 const date = Date; // Convertendo a string 'Date' para um objeto Date

 // Formatamos a data para o formato 'LL' (por extenso)
 const formattedDate = moment(date).format('LL');


    return (
      <Container>
      <CardViewList>
      <ViewImageHere bannerUrl={urlimage}>
        <ButtonCenter onClick={() => router.push(redirect)} />
        </ViewImageHere>
        <ContentList>
        <ContainerView>
         <h3>{title}</h3>
         <h6>{description}</h6>

         <ul>
         <span>{Tagged}</span>
         <h5>{formattedDate}</h5>
         </ul>
        </ContainerView>
         </ContentList>
      </CardViewList>
      </Container>
    );
  };
  
export default Cardwiki;


const ButtonCenter = styled.div`
   height: 100%;
   width: 100%;
   transition: 1s all;
   cursor: pointer;
`;

const ContainerView = styled.div`
    margin: 1em;

   h3{
    font-size: 16px;
    margin-bottom: 1em;
    background: linear-gradient(47deg, #e65f75 0%, rgb(42, 241, 158) 1%, #2e363d 100%);
    font-family: 'NUltra_VB', sans-serif;
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
   }

   h6{
    color: #4c4c53bc;
    font-family: 'Inter', sans-serif;
    max-width: 320px;
    font-size: 12px;
   }


   ul{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
     margin-top: 0.3em;

     h5{
      margin-top: 0.4em;
      color: #6a6f74;
     }

    span{
      display: flex;
      align-items: center; 

      a{
        background-color: rgba(101, 105, 117, 0.11);
      padding: 0.2em 0.6em 0.2em;
      border-radius: 29px;
      color: #666a6e;
      font-size: 12px;
      }
    }
   }


   @media screen  and (max-width: 430px){
      
   h3{
    overflow: hidden;
    width: 340px;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
   }
    } 

`;

const Container = styled.div`
 
 @media screen  and (max-width: 430px){
      
      margin-top: -8em;
       } 

`;
const ViewImageHere = styled.div<ViewHeaderProps>`

background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  background-size: cover;
  background-repeat: no-repeat;
  height: 12.3em;
  width: 390px;
  margin-right: 3em;
  border-radius: 12px;   
  filter: saturate(0.6);
   transition: 1s all;

  &:hover{
    filter: saturate(0.1);
  
  }


  @media screen  and (max-width: 430px){
    width: 90%;
    margin-right: 0em;
       } 
   
`;

const CardViewList = styled.div`
    background-color: rgba(7, 7, 7, 0.6);
    border-radius: 12px; 
   width: 100%;
  display: flex;
  margin-bottom: 0.4em;
    align-items: center;
    justify-content: space-between;

    @media screen  and (max-width: 430px){
     display:flex;
     justify-content: center;
     flex-direction: column;
     margin-bottom: 9em;
    } 
`;


const ContentList = styled.section`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.4em;
`;