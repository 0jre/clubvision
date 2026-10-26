"use client"
import { Check, Coins } from "lucide-react"
import { CoreIcon, ProIcon } from "../container/cx/icons"
 import styled from "styled-components"
import router from 'next/router';
import ROUTENVX from "@/routes/routes";


export default function PricingCards() {
  return (
    <div className="p-1">
          <Title id="comeceajogar">
        <h2>ASSINATURA PREMIUM CLUBR</h2>
        <p>Assine o prime Bloom ou Plus e obtenha acesso a recursos exclusivos!</p>
      </Title>
   
    <PricingContainer>

  {/* BLOOM */}
  <CoreCardWrapper>
    <PricingCard className="pricing-card--core">
      <PricingCardInner className="white">
        <HeaderFlex>
          <CoreIcon />
          <CardTitle>Bloom</CardTitle>
        </HeaderFlex>
        <CardDescription>
          Acesso premium ao ClubVision com benefícios essenciais para sua evolução.
        </CardDescription>
        <PricingFlex>
          <PriceColumn>
            <PriceRow>
              <PriceText>R$ 13,99 </PriceText>
            </PriceRow>
            <PriceSubtext>por mês</PriceSubtext>
          </PriceColumn>
          <PlusText>+</PlusText>
          <PriceColumn>
            <PriceText>16.000 ORBS</PriceText>
            <PriceSubtext>+ 2.000 Bits</PriceSubtext>
          </PriceColumn>
        </PricingFlex>
      
        <Divider />
   
        <FeatureList>
          <FeatureItem>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
            <FeatureTextGroup>
              <FeatureTitle>Personalização de perfil</FeatureTitle>
              <FeatureSubtext>Altere avatar e faixa como quiser</FeatureSubtext>
            </FeatureTextGroup>
          </FeatureItem>
          <FeatureItem>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
            <FeatureTextGroup>
              <FeatureTitle>Feed Postvision</FeatureTitle>
              <FeatureSubtext>Publique fotos e vídeos</FeatureSubtext>
            </FeatureTextGroup>
          </FeatureItem>
          <FeatureItem>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
            <FeatureTextGroup>
              <FeatureTitle>Perfil público</FeatureTitle>
              <FeatureSubtext>Libere sua galeria para todos</FeatureSubtext>
            </FeatureTextGroup>
          </FeatureItem>
          <FeatureItem>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
            <FeatureTextGroup>
              <FeatureTitle>Criação de Clã</FeatureTitle>
              <FeatureSubtext>Crie e lidere seu próprio grupo</FeatureSubtext>
            </FeatureTextGroup>
          </FeatureItem>
        </FeatureList>
        <Divider />
        <RecommendationSection>
          <RecommendationTitle>
            Vá de <CoreHighlight>Bloom</CoreHighlight> se...
          </RecommendationTitle>
          <RecommendationList>
            <RecommendationItem>
              <IconCircle><Coins size={12} /></IconCircle>
              <FeatureTextGroup>
                <FeatureTitle>Você quer desbloquear o ClubVision</FeatureTitle>
                <FeatureSubtext>Com o melhor custo-benefício para começar</FeatureSubtext>
              </FeatureTextGroup>
            </RecommendationItem>
          </RecommendationList>
        </RecommendationSection>
      </PricingCardInner>
    </PricingCard>
  </CoreCardWrapper>

  {/* PLUS */}
  <ProCardWrapper>
    <PricingCard className="pricing-card--pro pricing-card--recommended">
      <RecommendedBadge>Recomendado</RecommendedBadge>
      <PricingCardInner className="green">
        <HeaderFlex>
          <ProIcon />
          <CardTitle>Plus</CardTitle>
        </HeaderFlex>
        <CardDescription>Plano completo para quem quer desbloquear tudo e monetizar!</CardDescription>
        <PricingFlex>
          <PriceColumn>
            <PriceRow>
               <StrikethroughPrice>$150</StrikethroughPrice>
                <DiscountPrice>$89,99</DiscountPrice>
            </PriceRow>
            <PriceSubtext>por mês</PriceSubtext>
          </PriceColumn>
          <PlusText>+</PlusText>
          <PriceColumn>
            <PriceText>Ganhos</PriceText>
            <PriceSubtext>Bits por visualização</PriceSubtext>
          </PriceColumn>
        </PricingFlex>
      
        <Divider />
         <FeatureSectionTitle>Tudo do Bloom, e mais:</FeatureSectionTitle>
        <FeatureSection>
          
          <FeatureList>
            <FeatureItem>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              <FeatureTextGroup>
                <FeatureTitle>Monetização</FeatureTitle>
                <FeatureSubtext>Ganhe Bits com suas postagens</FeatureSubtext>
              </FeatureTextGroup>
            </FeatureItem>
            <FeatureItem>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              <FeatureTextGroup>
                <FeatureTitle>Conta verificada</FeatureTitle>
                <FeatureSubtext>Selo verde em seu perfil</FeatureSubtext>
              </FeatureTextGroup>
            </FeatureItem>
            <FeatureItem>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              <FeatureTextGroup>
                <FeatureTitle>Mini-game Double</FeatureTitle>
                <FeatureSubtext>Triplique suas apostas</FeatureSubtext>
              </FeatureTextGroup>
            </FeatureItem>
            <FeatureItem>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              <FeatureTextGroup>
                <FeatureTitle>ClubStudio</FeatureTitle>
                <FeatureSubtext>Monetize sua mídia</FeatureSubtext>
              </FeatureTextGroup>
            </FeatureItem>
          </FeatureList>
        </FeatureSection>
        <Divider />
        <RecommendationSection>
          <RecommendationTitle>
            Vá de <ProHighlight>Plus</ProHighlight> se...
          </RecommendationTitle>
          <RecommendationList>
            <RecommendationItem>
              <IconCircle><Coins size={12} /></IconCircle>
              <FeatureTextGroup>
                <FeatureTitle>Você quer ganhar Bits de verdade</FeatureTitle>
                <FeatureSubtext>Com postagens, bônus e acesso total</FeatureSubtext>
              </FeatureTextGroup>
            </RecommendationItem>
          </RecommendationList>
        </RecommendationSection>
      </PricingCardInner>
    </PricingCard>
  </ProCardWrapper>

</PricingContainer>




    <Container>
      <IconContainer>
        <CrownWrapper>
          <CrownBlur />
          <CrownBackground>
            <CrownBg />
          </CrownBackground>
          <CrownSvg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 26 20">
            <path d="M17.95 7.19 13.17.16a.2.2 0 0 0-.17-.1.2.2 0 0 0-.17.1L8.05 7.19a.1.1 0 0 1-.13.03L.47 3.51a.2.2 0 0 0-.28.1.2.2 0 0 0-.02.11L1.8 17.74c.12 1.22 5.1 2.2 11.2 2.2 6.13 0 11.1-.98 11.22-2.2l1.62-14.02a.21.21 0 0 0-.09-.2.2.2 0 0 0-.2-.01l-7.46 3.7a.1.1 0 0 1-.13-.02Z"></path>
          </CrownSvg>
        </CrownWrapper>
      </IconContainer>

      <Heading>Comece em segundos</Heading>

      <Description>
      Assinar o Prime é como ativar um poder especial no jogo — você desbloqueia um universo de vantagens exclusivas!
Ganhe moedas, acesse ferramentas VIP, monetize seu conteúdo e personalize seu perfil como nunca antes.
Seja para jogar com estilo ou transformar sua presença na comunidade, o Prime é seu próximo passo.
      </Description>

 <BadgeContainer onClick={() => router.push(ROUTENVX.storePrime)}>
                <BadgeCs>Saber mais</BadgeCs>
              </BadgeContainer>
       
    </Container>

      </div>
  )
}


 
const BadgeContainer = styled.div`
  text-align: center;
  background-color: #3bc77a;
  border-radius: 9999px;
  padding: 0.125rem;
  cursor: var(--f-cursor-pointer);
  display: inline-block;
  z-index: 90;

   
`;

const BadgeCs = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  padding: 0.25rem 1rem;
  border: 2px solid #0a0a0a; /* Azuki Gray 800 */
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: black;
`;


// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 4em;
`

const IconContainer = styled.div`
  width: 4.5rem;
  height: 4.5rem;
`

const CrownWrapper = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
  transform: translateZ(0);
  overflow: hidden;
  border-radius: 9999px;
  height: 100%;
  isolation: isolate;
`

const CrownBlur = styled.span`
  position: absolute;
  inset: 0;
  z-index: 0;
  background: radial-gradient(circle at center, rgba(101, 110, 106, 0.6) 0%, transparent 70%);
  filter: blur(10px);
`

const CrownBackground = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px;
  background: linear-gradient(to bottom right, rgba(91, 255, 159, 0.2), transparent);
  border: 1px solid rgba(91, 255, 178, 0.3);
`

const CrownBg = styled.span`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(91, 255, 154, 0.2) 0%, transparent 70%);
`

const CrownSvg = styled.svg`
  color: #fff;
  z-index: 1;
  position: absolute;
  inset: 0;
  left: 50%;
  top: 50%;
  height: 55%;
  width: 55%;
  transform: translate(-50%, -50%);
`

const Heading = styled.h2`
  font-size: 2.25rem;
  font-weight: 600;
  color: #fff;
  text-align: center;

   @media screen and (max-width: 760px) {
  font-size: 24px;
  }
`

const Description = styled.p`
  max-width: 41rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.5;
  font-family: 'ProximaNova-Italic', monospace;

   @media screen and (max-width: 760px) {
  font-size: 14px;
  }
`

const GetStartedButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 7rem;
  padding: 0 1.25rem;
  height: 2.5rem;
  margin-top: 0.5rem;
  width: 100%;
  white-space: nowrap;
  z-index: 90;
  
  border-radius: 0.5rem;
  text-align: center;
  transition: all 0.2s ease-in-out;
  background-color: #fff;
  color: #0E0E11;
  font-size: 0.875rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
  
  &:focus-visible {
    outline: none;
    background-color: rgba(255, 255, 255, 0.9);
  
  }
  
  @media (min-width: 640px) {
    width: auto;
  }
`

const ButtonTextx = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`


const Title = styled.ul`
   margin-bottom: 2em;
   
   h2{
    font-family: 'ProximaNova';
        font-size: 18px;
   }

   p{
    font-family: 'ProximaNova-Italic';
    font-size: 12px;
    color: rgb(164, 170, 175);
   }

   @media screen and (max-width: 430px) {
     text-align: center;
     display: flex; 
     justify-content: center;
     flex-direction: column;
   }
`;
export const PricingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2em;
  margin-top: 2.5rem;
  
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
`

export const CoreCardWrapper = styled.div`
  @media (min-width: 1024px) {
    order: 0;
  }
`

export const ProCardWrapper = styled.div`
  order: 1;
  
  @media (min-width: 1024px) {
    order: 0;
  }
`

// Card styles
export const PricingCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius:22px;
  padding: 1em;
  overflow: hidden;
  position: relative;
  

  .white{
     background: linear-gradient(204deg, #1a1b1b -7%, #b85cff00 33%), linear-gradient(162deg, #e7ecea40 -10%, #2c88dd00 25%), linear-gradient(0deg, #1a1b1b, #1a1b1b);
  }

  .green{
     background: linear-gradient(204deg, #1a1b1b -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #1a1b1b, #1a1b1b);
  }
  
`

export const PricingCardInner = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 0.5rem;
  padding: 1.5rem;
  padding-top: 1.25rem;
 
 width: 440px;
 border: 1px solid #3d3f3e;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);


  @media screen and (max-width: 760px) {
     width:100%;
  }
`

export const RecommendedBadge = styled.div`
  display: flex;
  width: 100%;
  background-color: #2e302f81;
  border-radius: 8px;
  margin-bottom: 8px;
  height: 2rem;
  align-items: center;
  padding: 0 1.5rem;
  margin-top: -1px;
  color: #2bb65a;
  font-size: 0.75rem;
`

// Header styles
export const HeaderFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
`

export const CardTitle = styled.h3`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  flex: 1;
  text-transform: capitalize;
`

export const CardDescription = styled.p`
  margin-top: 1rem;
  min-height: 3rem;
  font-family: 'InterSemiBold', monospace;
  color: #fff;
`

// Pricing styles
export const PricingFlex = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`

export const PriceColumn = styled.span`
  display: flex;
  flex-direction: column;
`

export const PriceRow = styled.span`
  display: flex;
  gap: 0.5rem;
`

export const PriceText = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  position: relative;
  transition: colors 0.2s;
`

export const StrikethroughPrice = styled(PriceText)`
  color: rgba(255, 255, 255, 0.6);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: -4px;
    right: -4px;
    bottom: 50%;
    height: 2px;
    background-color: #fff;
    border-radius: 9999px;
    transform: rotate(6deg);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`

export const DiscountPrice = styled(PriceText)`
  color: #10B981;
`

export const PriceSubtext = styled.span`
  font-size: 0.75rem;
  color: #fff;
`

export const PlusText = styled.span`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.5rem;
`

// Button styles
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 2.5rem;
  padding: 0 1.25rem;
  margin-top: 1.5rem;
  white-space: nowrap;
  border-radius: 0.5rem;
  text-align: center;
  transition: all 0.2s ease-in-out;
  outline: none;
  
  &:focus-visible {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
  }
  
  &.core-button {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    &:focus-visible {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
  
  &.pro-button {
    background-color: #fff;
    color: #0E0E11;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.9);
    }
    
    &:focus-visible {
      background-color: rgba(255, 255, 255, 0.9);
    }
  }
`

export const ButtonText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
`

// Divider
export const Divider = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;
  align-items: center;
  margin-top: 1.5rem;
  
  &::before {
    content: '';
    height: 1px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.2);
  }
`

// Feature section
export const FeatureSection = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1rem;
`

export const FeatureSectionTitle = styled.p`
  color: #fff;
  font-size: 1rem;
`

export const FeatureList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
`

export const FeatureItem = styled.li`
  display: flex;
  gap: 0.75rem;

  
  svg{
    min-width: 20px;
    width: 20px;
    display: block;
    height: 20px;
    color: rgb(61, 61, 61);
  }

`

export const IconCircle = styled.span`
  display: inline-flex;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
`

export const FeatureTextGroup = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`

export const FeatureTitle = styled.span`
  color: #fff;
   font-family: 'ProximaNova-Italic', monospace;
`

export const FeatureSubtext = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
    font-family: 'ProximaNova-Italic', monospace;
`

// Recommendation section
export const RecommendationSection = styled.div`
  margin-top: 1.5rem;
`

export const RecommendationTitle = styled.p`
  color: #fff;
  font-size: 1rem;
`

export const RecommendationList = styled.ul`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const RecommendationItem = styled.li`
  display: flex;
  gap: 0.75rem;
`

export const CoreHighlight = styled.span`
  text-transform: capitalize;
  color: #8b8d91;
`

export const ProHighlight = styled.span`
  text-transform: capitalize;
  color: #37ce7b;
`
