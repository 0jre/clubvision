"use client"

import type React from "react"
import styled from "styled-components"
import CurrentPlanShowcase from '../complements/current-plan';
import SubscriptionEnhanced from '../complements/subscription';
import ComplementsEnhanced from '../complements/index';
 

interface SubscriptionDashboardCompleteProps {
  id: string
  type: string | 'undefined'
}

const SubscriptionDashboard: React.FC<SubscriptionDashboardCompleteProps> = ({ id, type }) => {
  return (
    <Container>
      {/* Showcase do plano atual - destaque principal */}
      <CurrentPlanShowcase userId={id} type={type} />

      {/* Informações detalhadas da assinatura */}
      <SubscriptionEnhanced id={id} type={type} />

      {/* Complementos ativos */}
      <ComplementsEnhanced userId={id} />
    </Container>
  )
}

export default SubscriptionDashboard

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2em;
  

  @media screen and (max-width: 490px) {
    padding: 0.3em;
    gap: 1em;
  }
`
