import React from "react"
import { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import validators from "@/lib/services/staking/validator/validators"
import { ChevronDown, AlertTriangle, Clock, DollarSign, Activity, Zap } from "react-feather"
import { Pickaxe } from "lucide-react"

interface Prop {
  type: string;
}

const ValidatorDashboard: React.FC<Prop> = ({ type }) => {
  const [selectedValidator, setSelectedValidator] = useState<any>(validators[0]);


  useEffect(() => {
   
    let validator;
    
    if (type === 'validator1') {
      validator = validators[0];
    } else if (type === 'validator2') {
      validator = validators[1];
    } else if (type === 'validator3') {
      validator = validators[2];
    }
  
    if (validator) {
      console.log("Atualizando validador:", validator.name);
      setSelectedValidator(validator);
    }
  }, [type]); 
  
 
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedValidator((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          performance: Math.min(100, prev.performance + (Math.random() * 2 - 1)),
          rewardRate: Math.max(0, prev.rewardRate + (Math.random() * 0.2 - 0.1)),
        };
      });
    }, 5000);
  
    return () => clearInterval(interval);
  }, []);
  



  return (
    <Section>
    <SectionTitle>Configurar o validador</SectionTitle>
    <SectionDescription>
    Selecione o bloco de validação centralizada em sua posição. Quanto mais validadores de um v-hash mais bits por recompensa receberá.   
    </SectionDescription>
   
    <DashboardContainer>
      <ContentWrapper>
       
          <ValidatorSelector >
            <ValidatorName>{selectedValidator.name}</ValidatorName>
            <Pickaxe size={20} />
          </ValidatorSelector>
          <InfoGrid>
            <InfoItem>
              <TooltipWrapper>
                <InfoLabel>
                  <IconWrapper>
                    <Activity size={16} />
                  </IconWrapper>
                  Desempenho
                </InfoLabel>
                <InfoValue>{selectedValidator.performance.toFixed(2)}%</InfoValue>
                <PerformanceBar performance={selectedValidator.performance} />
                <Tooltip>Pontuação de desempenho do validador</Tooltip>
              </TooltipWrapper>
            </InfoItem>
            <InfoItem>
              <TooltipWrapper>
                <InfoLabel>
                  <IconWrapper>
                    <DollarSign size={16} />
                  </IconWrapper>
                  Taxa de recompensa
                </InfoLabel>
                <InfoValue>{selectedValidator.rewardRate.toFixed(2)}%</InfoValue>
                <Tooltip>Rendimento percentual anual</Tooltip>
              </TooltipWrapper>
            </InfoItem>
            <InfoItem>
              <TooltipWrapper>
                <InfoLabel>
                  <IconWrapper>
                    <AlertTriangle size={16} />
                  </IconWrapper>
                  Risco de corte
                </InfoLabel>
                <InfoValue>{(selectedValidator.slashingRisk * 100).toFixed(2)}%</InfoValue>
                <Tooltip>Risco de perder tokens apostados</Tooltip>
              </TooltipWrapper>
            </InfoItem>
            <InfoItem>
              <TooltipWrapper>
                <InfoLabel>
                  <IconWrapper>
                    <Clock size={16} />
                  </IconWrapper>
                  Tempo de staking
                </InfoLabel>
                <InfoValue>{selectedValidator.timeStaked} dias</InfoValue>
                <Tooltip>Duração do staking</Tooltip>
              </TooltipWrapper>
            </InfoItem>
          </InfoGrid>
          <InfoItem style={{ marginTop: "1rem" }}>
            <TooltipWrapper>
              <InfoLabel>
                <IconWrapper>
                  <Zap size={16} />
                </IconWrapper>
                Valor base de retorno da aposta
              </InfoLabel>
              <InfoValue>{selectedValidator.minStake.toLocaleString()} Orbits</InfoValue>
              <Tooltip>Valor base a ser travado quando o staking terminar</Tooltip>
            </TooltipWrapper>
          </InfoItem>
    
      </ContentWrapper>
    </DashboardContainer>
      
    </Section>
  );
};

export default ValidatorDashboard;




const Section = styled.section`
 
  border-radius:26px;
  padding: 24px;
  background-color: #0B0C0A;
  
`

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #E1E1E6;
`

const SectionDescription = styled.p`
color: #747a77;
font-size: 12px;
margin-bottom: 24px;
font-family: 'Inter';
`

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const DashboardContainer = styled.div`
  
  font-family: 'Inter', sans-serif;
  color: #FFFFFF;
`

const ContentWrapper = styled.div`
 
  margin: 0 auto;
`

 
 
 
const ValidatorSelector = styled.div`
  background-color: rgba(30, 32, 31, 0.8);
  border-radius: 12px;  
  padding: 1rem;
  display: flex; 
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2c362f;
    transform: translateY(-2px);
  }
`  

const ValidatorName = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`

const InfoItem = styled.div`
background-color: rgba(30, 32, 31, 0.8);
  border-radius: 12px; 
  padding: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(16, 17, 17, 0.8);
    transform: translateY(-2px);
  }
`

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: #8F96AC;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
`

const InfoValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
`

const StakeButton = styled.button`
  background: linear-gradient(45deg, #298340, #202124);
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  font-family:'Inter';
  box-shadow: 0 4px 15px rgba(12, 13, 14, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(28, 56, 35, 0.4);
  }

  &:active {
    transform: translateY(1px);
  }
`

const IconWrapper = styled.span`
  margin-right: 0.5rem;
  display: inline-flex;
  align-items: center;
`

const PerformanceBar = styled.div<{ performance: number }>`
  height: 6px;
  background-color: rgba(58, 63, 74, 0.5);
  border-radius: 3px;
  margin-top: 0.5rem;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${(props) => props.performance}%;
    background-color: ${(props) => {
      if (props.performance >= 80) return "#4CAF50"
      if (props.performance >= 50) return "#FFC107"
      return "#FF5722"
    }};
    transition: width 0.5s ease;
  }
`

const Tooltip = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.3s ease;
`

const TooltipWrapper = styled.div`
  position: relative;

  &:hover ${Tooltip} {
    opacity: 1;
  }
`