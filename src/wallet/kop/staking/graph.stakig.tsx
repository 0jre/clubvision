"use client"

import styled from "styled-components"
import { useState } from "react"
import { PriceRangeChart } from "./comp/price-range-chart"
import { DataPoint } from "@club/components/vision/ui/charts"

interface Prop {
    data: DataPoint[];
    typeintervx: (value: any) => void; 
}

export default function StakingPool_Overview({ data, typeintervx }: Prop) { 
  const [selectedInterval, setSelectedInterval] = useState("")

  const handleSelect = (value: string) => {
    setSelectedInterval(value)
    typeintervx(value) 
  }

  return (
    <>
      <Section>
        <SectionTitle>Definir o intervalo</SectionTitle>
        <SectionDescription>
          Ajuste e configure o intervalo staking. Os rendimentos variam de acordo com sua atividade no clubvision.
        </SectionDescription>

        <PriceRangeChart datax={data} />

        <PriceRangePresets>
          <PresetButton selected={selectedInterval === "completo"} onClick={() => handleSelect("completo")}>
            Intervalo completo
            <span>0% de concentração</span>
          </PresetButton>
          <PresetButton selected={selectedInterval === "seguro"} onClick={() => handleSelect("seguro")}>
            Intervalo seguro
            <span>50% de concentração</span>
          </PresetButton>
          <PresetButton selected={selectedInterval === "agressivo"} onClick={() => handleSelect("agressivo")}>
            Intervalo agressivo
            <span>90% de concentração</span>
          </PresetButton>
        </PriceRangePresets>
      </Section>
    </>
  )
}

 
 
const Section = styled.section`
 
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #2a2c2a;
`

const SectionTitle = styled.h2`
  font-size: 16px;
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
  
  
const PriceRangePresets = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`

const PresetButton = styled.button<{ selected?: boolean }>`
  background: ${(props: any) => (props.selected ? "#38694d60" : "#363b3916")};
  border: 2px solid ${(props: any) => (props.selected ? "#1e201f81" : "trasnparent")};
  border-radius: 12px;
  padding: 12px;
  color: #E1E1E6;
  text-align: left;
  transition: all 0.2s;
  font-family: 'InterSemiBold', monospace;
  font-weight: 300;

  span {
    display: block;
    font-size: 12px;
    color: #7C7C8A;
    margin-top: 4px;
  }

  &:hover {
    background: #afb9af1c;
  }
`

 