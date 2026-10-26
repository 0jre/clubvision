

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
         <h5>{moment(Date).format('LL')}</h5>
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
    font-size: 18px;
    margin-bottom: 1em;
    background: linear-gradient(47deg, #e65f75 0%, rgb(137, 151, 143) 1%, #2e363d 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    max-width: 290px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp:1;
  -webkit-box-orient: vertical;
   }

   h6{
    color: #4c4c53bc;
    font-family: 'Inter', sans-serif;
    max-width: 320px;
    font-size: 12px;
 
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp:4;
  -webkit-box-orient: vertical;
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

`;

const Container = styled.div`
  height: 14em;
 
  margin-bottom: 8em;
`;
const ViewImageHere = styled.div<ViewHeaderProps>`

background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  background-size: cover;
  background-repeat: no-repeat;
  height: 9em;
  border-radius: 12px 12px 0 0;   
  filter: saturate(0.6);
   transition: 1s all;

  &:hover{
    filter: saturate(0.1);
    height: 12em;
  }
`;

const CardViewList = styled.div`
    background-color: rgba(7, 7, 7, 0.6);
    border-radius: 12px; 
    margin-bottom: 2em;
    margin: 1em;
`;


const ContentList = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.4em;
`;