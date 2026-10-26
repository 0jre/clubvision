

import { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
 

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)


interface Prop {
  amount: string;
  recipient: string;
  bank: string;
  accountNumber: string;
  child: () => void;
}

export default function WaitingScreen({amount,recipient,bank,accountNumber,child} : Prop) {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = ["Iniciando transferência", "Verificando dados", "Processando pagamento", "Finalizando transferência"]

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else if (currentStep === steps.length - 1 ) {
        setTimeout(() => {
          child(); // executa a função
        }, 1000);
      }
    }, 2000);
  
    return () => clearTimeout(timer);
  }, [currentStep, steps.length]);
  

  // Mock transaction data
  const transaction = {
    amount: amount,
    recipient: recipient,
    bank: bank,
    accountNumber: accountNumber,
    date: new Date().toLocaleDateString("pt-BR"),
    time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  }

  return (
    <ContainerC>
      <CardC>
       
            <TitleC>Transferência em andamento</TitleC>
            <Spinner />
            <StatusText>
              Estamos processando sua transferência.
              <br />
              Isso pode levar alguns instantes.
            </StatusText>

            <TransactionDetails>
              <DetailRow>
                <DetailLabel>Valor</DetailLabel>
                <DetailValue>{transaction.amount} {transaction.bank == 'bits' ? 'Bits' : 'Orbs'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Para</DetailLabel>
                <DetailValue>{transaction.recipient}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Moeda</DetailLabel>
                <DetailValue>{transaction.bank}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Conta</DetailLabel>
                <DetailValue>{transaction.accountNumber}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Data</DetailLabel>
                <DetailValue>
                  {transaction.date} às {transaction.time}
                </DetailValue>
              </DetailRow>
            </TransactionDetails>

            <ProcessingSteps>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator active={index === currentStep} completed={index < currentStep}>
                    {index < currentStep && <CheckIcon />}
                  </StepIndicator>
                  <StepText active={index === currentStep} completed={index < currentStep}>
                    {step}
                  </StepText>
                </Step>
              ))}
            </ProcessingSteps>
         
      </CardC>
    </ContainerC>
  )
}





// Animation keyframes
const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
`

// Styled components
const ContainerC = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: 'Inter', sans-serif;
`

const CardC = styled.div`
   background-image: url('/icons/084mnfgjhdgdfyt4n.png');
  background: linear-gradient(204deg, #86979440 -7%, #b85cff00 33%), linear-gradient(162deg, #86979440 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048));
  border-radius: 14px;
  padding: 1em 12px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
`

const TitleC = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #c6ccc8;
  margin-bottom: 24px;
  text-align: center;
`

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(84, 95, 90, 0.1);
  border-radius: 50%;
  border-top-color: #2ce278;
  animation: ${rotate} 1s linear infinite;
  margin-bottom: 24px;
`

const StatusText = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  text-align: center;
`

const TransactionDetails = styled.div`
  width: 100%;
  background-color: rgba(57, 59, 58, 0.158);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const DetailLabel = styled.span`
  color: #666;
  font-size: 14px;
`

const DetailValue = styled.span`
  color: #bfc7c3;
  font-weight: 500;
  font-size: 14px;
`

const ProcessingSteps = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const StepIndicator = styled.div<{ active: boolean; completed: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => (props.completed ? "#05be68" : props.active ? "#1b1c1d" : "#222424")};
  border: ${(props) => (props.active ? "2px solid #05be58" : "none")};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${(props) => (props.active ? pulse : "none")} 1.5s infinite ease-in-out;
`

const StepText = styled.span<{ active: boolean; completed: boolean }>`
  font-size: 14px;
  color: ${(props) => (props.completed || props.active ? "#333" : "#999")};
  font-weight: ${(props) => (props.completed || props.active ? "500" : "normal")};
`

