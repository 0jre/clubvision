"use client";
import React from "react";
import styled from "styled-components";
import CaseSection from "../components/roulete/CaseSection";
  
import ControlsSection from "../components/roulete/ControlsSection";
import CaseContentsSection from "../components/roulete/CaseContentsSection";
import HeadGlobal from "@/club/head/glob.n";
import TimeCase from "./view.timecase";

const MainContent: React.FC = () => {
  return (
    <MainWrapper>
        <HeadGlobal Title="Abrir Caixa - Premium #TheNoVision" />
      <MainBackground>
        <BackgroundImage>
          <BackgroundImg
            src="/theim/backgrounds/gsfsdjmfjbsfsufm.webp"
            alt="Background"
          />
        </BackgroundImage>
       
        <CaseSection />
        <ControlsSection />
        <ContentContainer>
         <CaseContentsSection />
        </ContentContainer>

        <Mnsdc>
            <TimeCase /> 
        </Mnsdc>
      </MainBackground>
    </MainWrapper>
  );
};


const Mnsdc = styled.div`
 margin: 5%;
 margin-bottom: 0;
`;

const MainWrapper = styled.main`
  display: flex;
  width: 100%;
  padding-bottom: 86px;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const MainBackground = styled.div`
  align-items: stretch;
  align-self: stretch;

  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: start;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const BackgroundImage = styled.div`
  position: absolute;
  z-index: 0;
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
  height: 450px;
  left: 0px;
  right: 0px;
  filter: blur(8px);
  top: 0px;
 
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const BackgroundImg = styled.img`

  background-size: cover;
  background-repeat: no-repeat;
  background-position-y: 30vh;
  width: 100vw;
  filter: opacity(0.3);
 
`;


const ContentContainer = styled.div`
  width: 1536px;
  max-width: 100%;
  padding: 0 20px;
`;

export default MainContent;
