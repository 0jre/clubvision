
import React, { useRef, useState } from "react";
import styled from "styled-components";


interface CviewCardCS {
    children: React.ReactNode;
    HereImage: React.ReactNode;
  }
  
  const CardTutorial: React.FC<CviewCardCS> = ({
    children, HereImage
  }) => {
   
   
    return (
      <Container>
      <CardViewList>
        <ViewImageHere>
            {HereImage}
        </ViewImageHere>
        <ContentList>
            {children}
        </ContentList>
      </CardViewList>
      </Container>
    );
  };
  
export default CardTutorial;

const Container = styled.div`
  height: 14em;
  margin-bottom: 8em;
`;
const ViewImageHere = styled.div`
  background-image: url('/theim/backgrounds/20230816_13375833455.png');
  background-size: cover;
  background-repeat: no-repeat;
  height: 9em;
   
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