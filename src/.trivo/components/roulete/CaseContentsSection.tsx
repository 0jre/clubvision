"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CaseItemRow from "./CaseItemRow";
import router from 'next/router';
import ROUTENVX from "@/routes/routes";
 
const CaseContentsSection: React.FC = () => {
   const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch('/api/trivo/case/open.gradecase', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
        
      });

      const data = await response.json();
      if (response.ok && data.items) {
        setItems(data.items);
      }
    };

    fetchItems();
  }, []);

    
  return (
    <SectionWrapper>
      <SectionHeader>
        <SectionTitle>Conteúdo da caixa</SectionTitle>
     
      </SectionHeader>
      <ItemsContainer>
        <ItemsRow>
          {items.map((item) => (
            <CaseItemRow
              key={item.id}
              odds={item.chance}
              name={item.limitedEdition ? 'Edição Limitida' : 'Edição Vision'}
              skin={item.skin}
              price={item.price}
              color={item.color}
              imageUrl={item.imagem} 
              title={item.nameitem} 
              href={item}  />
          ))}
        </ItemsRow>
      
       
      </ItemsContainer>
    </SectionWrapper>
  );
};

const SectionWrapper = styled.section`
  width: 100%;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const SectionHeader = styled.header`
  display: flex;
  min-height: 86px;
  width: 100%;
  padding: 24px 0 24px ;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-transform: uppercase;


`;

const SectionTitle = styled.h2`
  align-self: stretch;
  margin: auto 0;
  font-size: 16px;
  color: #b6bbce;
  line-height: 1;
  flex-grow: 1;
  flex-shrink: 1;
  width: 153px;
`;


const ItemsContainer = styled.div`
  width: 100%;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const ItemsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;



export default CaseContentsSection;
