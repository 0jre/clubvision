import React from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';
import Scrollmargin from '@/components/scrollingcard/scroll.xc';
 
interface MarketplaceHeaderProps {
  itemCount: number;
  totalPrice: number;
  label: string;
  avatar?: string;
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({ itemCount, totalPrice, label }) => {
  return (
    <HeaderContainer>
      <SideContainer>
        <LogoText>{label}</LogoText>
       
      
      </SideContainer>
      
      <Scrollmargin>

<ul className='flex items-center justify-center gap-1 pl-1'>
      <CardButton>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
         <h3>Veiculos</h3>
      </CardButton>

      <CardButton>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><rect width="20" height="6" x="2" y="4" rx="2"/><rect width="20" height="6" x="2" y="14" rx="2"/></svg>
         <h3>Itens</h3>
      </CardButton>


      <SearchBox>
        <SearchInput placeholder="PESQUISAR" />
        <SearchButton>
          <Search size={16} />
        </SearchButton>
      </SearchBox>



      <CardButton>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M15.4 15.63a7.875 6 135 1 1 6.23-6.23 4.5 3.43 135 0 0-6.23 6.23"/><path d="m8.29 12.71-2.6 2.6a2.5 2.5 0 1 0-1.65 4.65A2.5 2.5 0 1 0 8.7 18.3l2.59-2.59"/></svg>
         <h3>Colecionaveis</h3>
      </CardButton>

      <CardButton>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
         <h3>Badges</h3>
      </CardButton>
      </ul>
      </Scrollmargin>
       
    
    </HeaderContainer>
  );
};


export const MarketplaceHeaderReceipt: React.FC<MarketplaceHeaderProps> = ({ itemCount, totalPrice, label, avatar }) => {
    return (
      <HeaderContainer>
        <SideContainer>
          <LogoText>Inventario de {label}</LogoText>
         
           <img src={avatar} className='rounded-full' alt={label} width={35} height={35} />
        </SideContainer>
        
        <Scrollmargin >

        <CardButton>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
           <h3>Veiculos</h3>
        </CardButton>
  
        <CardButton>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><rect width="20" height="6" x="2" y="4" rx="2"/><rect width="20" height="6" x="2" y="14" rx="2"/></svg>
           <h3>Itens</h3>
        </CardButton>
  
  
        <SearchBox>
          <SearchInput placeholder="PESQUISAR" />
          <SearchButton>
            <Search size={16} />
          </SearchButton>
        </SearchBox>
  
  
  
        <CardButton>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M15.4 15.63a7.875 6 135 1 1 6.23-6.23 4.5 3.43 135 0 0-6.23 6.23"/><path d="m8.29 12.71-2.6 2.6a2.5 2.5 0 1 0-1.65 4.65A2.5 2.5 0 1 0 8.7 18.3l2.59-2.59"/></svg>
           <h3>Colecionaveis</h3>
        </CardButton>
  
        <CardButton>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
           <h3>Badges</h3>
        </CardButton>
     
      
        </Scrollmargin>
      </HeaderContainer>
    );
  };
  
   
 
 
const CardButton = styled.button`
 position: relative;
  display: flex;
  align-items: center;
  background-color: #222423;
  border-radius: 42px;
  border: 1px solid #2d2f30;
  text-align: center;
  padding: 0.4em 0.9em 0.4em;
  gap: 3px;
  
  h3{
    font-size: 8px;
    font-family: 'Europa Grotesk', monospace;
    text-transform: uppercase;
    color: #737577;
  }

  svg{
    height: 14px;
    width: 14px;
    stroke: #5e6264;
  }

  &:hover{
    background-color: #1e1e1e;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1em;
  color: white;
 
  
`;

const SideContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 1em;

`;
 
const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: #222423;
  border-radius: 48px;
  padding: 0.4em 0.9em 0.4em;
  width: 200px;
`;

const SearchInput = styled.input`
  background-color: transparent;
  border: none;
  color: white;
  width: 100%;
  padding-right: 30px;
  outline: none;
  font-size: 11px;
  
  &::placeholder {
    color: #888;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  
`;

const LogoText = styled.h1`
  font-weight: bold;
  margin: 0;
  text-transform: uppercase;    
  font-size: 12px;
  font-family: 'Europa Grotesk';
  color: #5b5f61;
`;

const PriceText = styled.span`
  font-weight: bold;
  color: white;
`;
