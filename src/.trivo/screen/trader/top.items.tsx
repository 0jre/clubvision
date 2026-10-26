import React from 'react';
import styled from 'styled-components';
import { Search, ArrowUp, ShoppingBag } from 'lucide-react';
import LogoVision from '@/components/vision/logo';
 
interface Props {
    trade2: React.ReactNode;
    trade1: React.ReactNode;
    click: () => void;
    islocked: boolean;

}


export default function SkinTradingInterface({trade1, trade2,islocked, click} : Props) {
  return (
    <Container>
      <TradeContainer>
        <Panel>
          <PanelTitle>ESCOLHA SEUS ITENS</PanelTitle>
          <PanelSubtitle>QUE VOCÊ DESEJA NEGOCIAR</PanelSubtitle>
          
          <WeaponImage>
            
            {trade1}
          </WeaponImage>
          
          <ValueContainer>
            <Value>NOVISION</Value>
            <BagIcon>
                   
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><rect x="14" y="14" width="8" height="8" rx="2"/><rect x="2" y="2" width="8" height="8" rx="2"/><path d="M7 14v1a2 2 0 0 0 2 2h1"/><path d="M14 7h1a2 2 0 0 1 2 2v1"/></svg>
            </BagIcon>
          </ValueContainer>
          
           
        </Panel>
        <CenterValueBox>
        
              <LogoVision />
          </CenterValueBox>

          
        <Panel>
          <PanelTitle>ESCOLHER ITENS</PanelTitle>
          <PanelSubtitle>QUE QUER RECEBER</PanelSubtitle>
          
          <WeaponImage>
          {trade2 ? trade2 :  <svg width="200" height="80" viewBox="0 0 300 100">
              <path d="M20,50 L60,50 L70,40 L240,40 L250,50 L270,50 L280,40 L290,50 L290,60 L280,70 L250,70 L240,60 L70,60 L60,70 L20,70 Z" fill="#333" />
            </svg>}
          </WeaponImage>
          
          <ValueContainer>
            <BagIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><rect x="8" y="8" width="8" height="8" rx="2"/><path d="M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2"/><path d="M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2"/></svg>
       
            </BagIcon>
            <Value>NOVISION</Value>
          </ValueContainer>
        </Panel>
      </TradeContainer>
      
      <SearchContainer>
        <SearchSection>
          <SearchInput/>
        
          
          <PriceButton>
            <span>Preço</span>
            <ArrowUp size={16} />
          </PriceButton>
        </SearchSection>
        
        <TradeButton onClick={click} disabled={islocked}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" data-sentry-element="ExchangeFundsIcon" data-sentry-component="getPaymentButtonLeftComponent" data-sentry-source-file="ExchangerSummarySubmitButton.tsx"><path fill="currentColor" d="M19.379 15.106A8.001 8.001 0 0 0 8.035 5.056l-.993-1.737a10 10 0 0 1 9.962.023c4.49 2.593 6.21 8.143 4.118 12.77l1.342.775-4.166 2.214-.165-4.714zM4.629 8.9a8.001 8.001 0 0 0 11.345 10.05l.992 1.737a10 10 0 0 1-9.962-.024c-4.49-2.593-6.21-8.142-4.117-12.77L1.545 7.12 5.71 4.905l.165 4.714zm8.79 5.931-2.829-2.828-2.828 2.828-1.415-1.414 4.243-4.243 2.828 2.829 2.829-2.829 1.414 1.415z"></path></svg>
          <span>Confirmar a troca</span>
        </TradeButton>
        
        <SearchSection>
          <PriceButton>
            <span>Preço</span>
            <ArrowUp size={16} />
          </PriceButton>
          
          <SearchInput/>
           
        </SearchSection>
      </SearchContainer>
    </Container>
  );
}




const Container = styled.div`

  color: white;
  font-family: 'Inter', sans-serif;
  width: 100%;
`;

const TradeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
 
  margin-bottom: 20px;
`;

const Panel = styled.div`
  flex: 1;
 background: linear-gradient(204deg, #42635362  -7%, #b85cff00 33%), linear-gradient(162deg, #4248449f -10%, #2f312f9f 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  border-radius: 8px;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 280px;
`;

const WeaponImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
 text-align: center;
  margin: 20px 0;

  svg{
    opacity: 0.3;
  }
`;

const PanelTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  font-family: 'Europa Grotesk';
  color: #29be6c;
  letter-spacing: 0.5px;
`;

const PanelSubtitle = styled.p`
  font-size: 12px;
  color: #9a9a9a;
  margin: 0;
  margin-top: 4px;
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const Value = styled.div`
  font-size: 18px;
  color: #333736;
  font-family: 'Europa Grotesk';
  font-weight: 600;
`;

const BagIcon = styled.div`
  background-color: transparent;
  border: 2px solid #282a28;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #65716c;
`;

const CenterValueBox = styled.div`
   
  background-color: #111218;
  border-radius: 8px;
  padding: 15px 30px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 180px;
  border-left: 1px solid #515854;
  border-right: 1px solid #515854;

  &::before, &::after {
    content: '';
    position: absolute;
    width: 20px;
    z-index: 838;
    height: 2px;
    background-color: #515854;
  }

  &::before {
    left: -20px;
    top: 50%;
  }

  &::after {
    right: -20px;
    top: 50%;
  }
`;

const CenterValueTitle = styled.p`
  font-size: 12px;
  color: #9a9a9a;
  margin: 0;
  text-transform: uppercase;
`;

const CenterValue = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: #ffc107;
  margin: 0;
  margin-top: 4px;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const SearchSection = styled.div`
  flex: 1;
  display: flex;
  gap: 10px;
`;

const SearchInput = styled.div`
  flex: 1;
background: linear-gradient(204deg, #42635362  -7%, #b85cff00 33%), linear-gradient(162deg, #4248449f -10%, #2f312f9f 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 42px;
`;

 

const PriceButton = styled.button`
 background: linear-gradient(204deg, #42635362  -7%, #b85cff00 33%), linear-gradient(162deg, #4248449f -10%, #2f312f9f 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  border: none;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  height: 42px;
 
  width: 120px;
  font-size: 14px;
`;

const TradeButton = styled.button`
  background-color: #2d3231;
  border: none;
  border-radius: 28px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 20px;
  height: 42px;
 
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  font-size: 11px;
  text-transform: uppercase;
  font-family: 'Europa Grotesk', monospace;
  font-weight: 600;
  letter-spacing: 0.5px;
 transition: 1s all;

  svg{
    height: 19px;
    width: 19px;
  }

  &:disabled {
    border: 2px solid #202021; 
    background-color: rgba(129, 33, 33, 0.165);
    color: #8A93B2; 
    cursor: not-allowed;
  }

  &:hover{
    background-color: #191a1a;
    color: #606764;
  }
`;
