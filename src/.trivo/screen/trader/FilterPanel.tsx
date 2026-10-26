import React from 'react';
import styled from 'styled-components';
 

interface FilterPanelProps {
  title: string;
  isOpen: boolean;
  onToggle?: () => void;
  type?: 'price' | 'checkbox' | 'colors';
  children?: React.ReactNode;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  title, 
  isOpen, 
  onToggle, 
  type = 'checkbox',
  children 
}) => {
  return (
    <FilterContainer>
      <FilterHeader onClick={onToggle}>
        <FilterTitle>{title}</FilterTitle>
        <span>{isOpen ? '▼' : '▲'}</span>
      </FilterHeader>
      <FilterContent isOpen={isOpen}>
        {type === 'price' && (
          <PriceRangeContainer>
            <span>R$</span>
            <PriceInput type="text" placeholder="0.00" />
            <span>-</span>
            <span>R$</span>
            <PriceInput type="text" placeholder="0.00" />
          </PriceRangeContainer>
        )}
        
        {type === 'checkbox' && children}
        
        {type === 'colors' && (
          <ColorBar>
            <ColorOption color="#ccff66" />
            <ColorOption color="#99ff33" />
            <ColorOption color="#66cc33" />
            <ColorOption color="#ff9900" />
            <ColorOption color="#ff6600" />
            <ColorOption color="#ff3300" />
            <ColorOption color="#cc0000" />
          </ColorBar>
        )}
      </FilterContent>
    </FilterContainer>
  );
};

export default FilterPanel;

const FilterContainer = styled.div`
  background-color: #1a1a1a;
  color: white;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #222;
  cursor: var(--f-cursor-pointer);
  align-items: center;
`;

const FilterTitle = styled.h3`
  margin: 0;
  font-size: 12px;
  font-family: 'InterSemibold', monospace;
  text-transform: uppercase;
  color: #a0a5a9;
`;

const FilterContent = styled.div<{ isOpen: boolean }>`
  padding: ${props => props.isOpen ? '7px 12px' : '0'};
  max-height: ${props => props.isOpen ? '300px' : '0'};
  overflow: hidden;
  background-color: rgba(53, 55, 53, 0.205);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: start;
`;

const PriceRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const PriceInput = styled.input`
  background-color: #333;
  border: none;
  color: white;
  padding: 3px;
  width: 90px;
  border-radius: 4px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const FilterOption = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
`;

const ColorBar = styled.div`
  display: flex;
  margin-top: 10px;
`;

const ColorOption = styled.div<{ color: string }>`
  width: 25px;
  height: 20px;
  background-color: ${props => props.color};
  cursor: var(--f-cursor-pointer);
`;