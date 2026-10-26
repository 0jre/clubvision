"use client";
import React from "react";
import styled from "styled-components";

const ControlsSection: React.FC = () => {
  return (
    <SectionWrapper>
      <Background>
        <ControlsContainer>
          <ControlGroup>
            <ControlButton>
              <ControlButtonText>Enter</ControlButtonText>
            </ControlButton>
            <ControlLabel>Abertura de caixas</ControlLabel>
          </ControlGroup>
          <ControlGroup>
            <ArrowButton>
              <ArrowButtonText>←</ArrowButtonText>
            </ArrowButton>
            <ArrowButton>
              <ArrowButtonText>→</ArrowButtonText>
            </ArrowButton>
            <ControlLabel>Ordem do sorteio</ControlLabel>
          </ControlGroup>
          <ControlGroup>
            <KeyboardButton>
              <KeyboardButtonText>R</KeyboardButtonText>
            </KeyboardButton>
            <ControlLabel>Abrir de novo</ControlLabel>
          </ControlGroup>
        
          
        </ControlsContainer>
      </Background>
    </SectionWrapper>
  );
};

const SectionWrapper = styled.section`
 
  padding: 0 20px;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  color: #858dad;
  font-weight: 600;
`;

const Background = styled.div`
  align-items: stretch;
  border-radius: 0px 0px var(--item-spacing-xs, 8px) var(--item-spacing-xs, 8px);
  background-color: #141417;
  display: flex;
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  flex-direction: column;
  overflow: hidden;
  justify-content: center;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  min-width: 420px;
  width: 100%;
  padding: 8px 32px;
  align-items: center;
  gap: 40px 48px;
  overflow: hidden;
  justify-content: center;
  flex-wrap: wrap;
  @media (max-width: 991px) {
    max-width: 100%;
    padding: 8px 20px;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: start;
  padding: 0 10px;
  flex-grow: 1;
  flex-shrink: 1;
`;

const ControlButton = styled.button`
  align-self: stretch;
  display: flex;
  margin: auto 0;
  min-height: 48px;
  padding-right: 12px;
  flex-direction: column;
  align-items: start;
  font-size: 10px;
  white-space: nowrap;
  text-align: center;
  text-transform: uppercase;
  justify-content: start;
  border: none;
  background: transparent;
  cursor: pointer;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const ControlButtonText = styled.span`
  align-self: stretch;
  line-height: 15px;
  border-radius: 6px;
  border: 1px solid rgba(31, 31, 39, 1);
  min-height: 48px;
  padding: 17px 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 991px) {
    padding: 17px 20px;
    white-space: initial;
  }
`;

const ArrowButton = styled.button`
  display: flex;
  min-height: 48px;
  padding-right: 12px;
  flex-direction: column;
  align-items: start;
  white-space: nowrap;
  text-align: center;
  text-transform: uppercase;
  justify-content: start;
  border: none;
  background: transparent;
  cursor: pointer;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const ArrowButtonText = styled.span`
  align-self: stretch;
  line-height: 15px;
  border-radius: 6px;
  border: 1px solid var(--color-blue-16, #23232d);
  min-height: 48px;
  padding: 17px 19px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const KeyboardButton = styled.button`
  align-self: stretch;
  display: flex;
  margin: auto 0;
  min-height: 48px;
  padding-right: 12px;
  flex-direction: column;
  align-items: start;
  font-size: 10px;
  text-align: center;
  text-transform: uppercase;
  justify-content: start;
  border: none;
  background: transparent;
  cursor: pointer;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const KeyboardButtonText = styled.span`
  align-self: stretch;
  line-height: 15px;
  border-radius: 6px;
  border: 1px solid rgba(35, 35, 45, 1);
  min-height: 48px;
  padding: 17px 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 991px) {
    padding: 17px 20px;
    white-space: initial;
  }
`;

const ControlLabel = styled.span`
  align-self: stretch;
  margin: auto 0;
  padding-left: 4px;
  font-size: 12px;
  line-height: 1;
`;

export default ControlsSection;
