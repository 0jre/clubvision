import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Search, ArrowUp, ShoppingBag, ArrowDown } from 'lucide-react';
  
interface Props {
    trade2: React.ReactNode;
    trade1: React.ReactNode;
    click: (value: any) => void;
    islocked: boolean;
    children: React.ReactNode;

}


export default function SkinTradingInterfacex({children,trade1, trade2,islocked, click} : Props) {
  const [isreceive, setreceive] = useState(false)

  useEffect(() => {
     click(isreceive)
  }, [isreceive])
  return (
    <Container>
      <TradeContainer>
          <CenterValueBox className='block sm:hidden'>
          {children}
          </CenterValueBox>

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
        <CenterValueBox className='hidden sm:block'>
          {children}
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
        
          
          <PriceButton onClick={() => setreceive(true)} className={`block sm:hidden ${isreceive && 'active'}`}> 
            <span>Escolher item</span>
            <ArrowUp size={16} />
          </PriceButton>
        </SearchSection>
        
         
        <SearchSection>
          <PriceButton onClick={() => setreceive(false)} className={`block sm:hidden ${isreceive == false && 'active2'}`}>
            <span>Enviar item</span>
            <ArrowDown size={16} />
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


  @media screen and (max-width: 680px) {
    display: flex;
    flex-direction: column;
  }
`;

const Panel = styled.div`
  flex: 1;
 background: linear-gradient(204deg, #42635362  -7%, #b85cff00 33%), linear-gradient(162deg, #4248449f -10%, #2f312f9f 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  border-radius: 8px;
  width: 100%;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 280px;
  max-width: 35vw;

  @media screen and (max-width: 680px){
    max-width: 100%;
    
  }
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
   
  background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #212221, #191a19);

  border-radius: 8px;
  padding: 15px 30px;
  text-align: center;
 
  position: relative;
  min-width: 180px;
  max-width: 540px;
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


  .active2{
    border: 1px solid #43945e;
  }

   .active{
    border: 1px solid #43945e;
  }
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
  color: #c0c9c3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 9px;
  height: 42px;
  font-family: 'XcSemibold', monospace;
 
  width: 120px;
  font-size: 12px;

  @media screen and (min-width: 680px) {
    display: none;
  }
`;

 
