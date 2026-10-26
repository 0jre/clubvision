 
import styled  from "styled-components"
import { useState } from "react"
import StakingPool_Overview from "./graph.stakig"
import ValidatorDashboard from "./validators/dashboard"
import { DataPoint } from "@club/components/vision/ui/charts"

interface Prop {
  balance: any;
  typeinterv: (value: any) => void;
  typevalidator: any;
  data: DataPoint[];
}

export default function InterfaceStake({balance , typeinterv, typevalidator,data} : Prop) {
  return (
    <Container>
      <Header>
        <Breadcrumb>Suas posições • Nova posição</Breadcrumb>
        <Title>Nova posição de Staking</Title>
      </Header>
      <Content>
        <MainContent>
            <Section>
              <TokenOptions>
                <TokenOption selected>
                  <TokenInfo>
                    <TokenLogo src="/icons/coins/orb-novision.webp" />
                    <div>
                      <TokenName>Orbit</TokenName>
                      <TokenAPY>APY: 2 a 5%</TokenAPY>
                    </div>
                  </TokenInfo>
                  <TokenBalance>Saldo: {balance} ORB</TokenBalance>
                </TokenOption>        
              </TokenOptions>           
            <StakingPool_Overview  data={data} typeintervx={typeinterv} />
            </Section>
              <ValidatorDashboard type={typevalidator}/>
        </MainContent>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  color: #E1E1E6;

`

const Header = styled.header`
  margin-bottom: 24px;
`

const Breadcrumb = styled.div`
  color: #7C7C8A;
  font-size: 14px;
  margin-bottom: 8px;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #E1E1E6;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
`

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 32px;
  font-size: 14px;
  font-family: 'InterSemiBold', monospace;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.variant === "secondary" &&
    `
    background-color: #0B0C0A;
    color: #E1E1E6;
    border: 1px solid #29292E;

    &:hover {
      background: #29292E;
    }
  `}

  ${(props) =>
    props.variant === "primary" &&
    `
    background: #22dd6a61;
    color: #fff;
    border: none;

    &:hover {
      background: #2a4739;
    }
  `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Stepper = styled.div`
display: flex;
align-items: center;
justify-content: center;
  gap: 24px;
  padding: 24px;
  border-radius: 16px;
  height: fit-content;
  background-color: #0B0C0A;
   
`

const Step = styled.div<{ active?: boolean }>`
  display: flex;
  gap: 12px;
  color: ${(props) => (props.active ? "#E1E1E6" : "#7C7C8A")};
`

const StepNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #29292E;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`

const StepContent = styled.div``

const StepTitle = styled.div`
  font-size: 12px;
  margin-bottom: 4px;
`

const StepDescription = styled.div`
  font-size: 14px;
  font-weight: 500;
`

const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: top;
  gap: 3px;
`

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

const TokenOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 0.8em;
`

const TokenOption = styled.button<{ selected?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
   
  background: ${(props) => (props.selected ? "#101110" : "#1e201f55")};
  border: 2px solid ${(props) => (props.selected ? "#141615" : "transparent")};
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #15151657;
  }
`

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const TokenLogo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`

const TokenName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #E1E1E6;
`

const TokenAPY = styled.div`
  font-size: 14px;
  font-family: 'ProximaNova-Italic';
  color: #337041;
`

const TokenBalance = styled.div`
  font-size: 14px;
  color: #7C7C8A;
`

const StakingPeriods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PeriodOption = styled.button<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  background: ${(props) => (props.selected ? "#151615" : "#0e0f0f42")};
  border: 2px solid ${(props) => (props.selected ? "#161817" : "trasnparent")};
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #16181740;
  }
`

const PeriodInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`

const PeriodDuration = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #E1E1E6;
`

const PeriodAPY = styled.span`
  font-size: 16px;
  color: #2dd687;
`

const PeriodDescription = styled.div`
  font-size: 14px;
  color: #7C7C8A;
`

const StakingInput = styled.div`
background-color: #0b0c0b53;
  border: 2px solid #0e0e0f;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`

const Input = styled.input`
  background: transparent;
  border: none;
  color: #E1E1E6;
  font-size: 16px;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #7C7C8A;
  }
`

const MaxButton = styled.button`
  background: #4C82FB;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #3B6FE8;
  }
`

const StakingSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  color: #E1E1E6;
  font-size: 14px;

  span:first-child {
    color: #7C7C8A;
  }
`

const NavigationButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`

