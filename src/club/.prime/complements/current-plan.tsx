"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import { Coins, Crown, Star } from "lucide-react"
import { CoreIcon, ProIcon } from "../container/cx/icons"
import axios from "axios"
import { decrypt } from "@/core/security/encryption"
import moment from "moment-timezone"
import "moment/locale/pt-br"
import router from 'next/router';

interface Subscription {
  id: string
  cancel_at_period_end: boolean
  email: string
  cancel_at: Date | null
  canceled_at: Date | null
  current_period_start: Date
  current_period_end: Date
  created: Date
  ended_at: Date | null
  trial_start: Date | null
  trial_end: Date | null
  customer_id: string
  status: string
}

interface CurrentPlanShowcaseProps {
  userId: string
  type: string
}

const CurrentPlanShowcase = ({ userId, type }: CurrentPlanShowcaseProps) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isbutton, setisbutton] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  moment.locale("pt-br")

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/stripe/customers/subscription/${userId}`)
        const data = decrypt(response.data.subscription)
        const parsedData = JSON.parse(data)

        if (parsedData) {
          setSubscription(parsedData)
        }
      } catch (error) {
        console.error("Erro ao buscar assinatura:", error)
        setError("Erro ao carregar informações da assinatura.")
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [userId])


  const handleOpenBillingPortal = async (customerId: string) => {
    try {
      const res = await fetch("/api/stripe/customers/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer_id: customerId }),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(data.url)
      } else {
        const errorText = await res.text()
        setError(errorText)
      }
    } catch (err) {
      setError("Erro ao abrir portal do cliente.")
    }
  }

  const getPlanConfig = (planType: string, status: string) => {
    const isActive = status === "active"
    const isCanceling = subscription?.cancel_at_period_end

    if (status === "canceled" || !subscription) {
      return {
        type: "free",
        name: "Membro Club",
        price: "Gratuito",
        icon: <Star size={32} />,
        className: "pricing-card--free",
        cardClass: "silver",
        features: [
          {
            title: "Acesso básico ao clubvision",
            subtitle: "Funcionalidades limitadas",
          },
          {
            title: "Perfil público básico",
            subtitle: "Sem personalização avançada",
          },
        ],
        recommendation: "Faça upgrade para desbloquear recursos premium!",
        status: "Conta gratuita",
        statusColor: "#2b2e2c",
      }
    }

    switch (planType?.toLowerCase()) {
      case "premium":
      case "bloom":
        return {
          type: "bloom",
          name: "Premium Bloom",
          price: "R$ 13,99",
          period: "por mês",
          bonus: "16.000 ORBS + 2.000 Bits",
          icon: <CoreIcon />,
          className: "pricing-card--core",
          cardClass: "white",
          features: [
            {
              title: "Personalização de perfil",
              subtitle: "Altere avatar e faixa como quiser",
            },
            {
              title: "Feed Postvision",
              subtitle: "Publique fotos e vídeos",
            },
            {
              title: "Perfil público",
              subtitle: "Libere sua galeria para todos",
            },
            {
              title: "Criação de Clã",
              subtitle: "Crie e lidere seu próprio grupo",
            },
          ],
          recommendation: "Perfeito para começar no ClubVision!",
          status: isCanceling ? "Cancelando no fim do período" : isActive ? "Assinatura Ativa" : "Inativa",
          statusColor: isCanceling ? "rgba(255, 107, 53, 0.308)" : isActive ? "rgba(43, 182, 89, 0.425)" : "#666",
        }

      case "plus":
        return {
          type: "plus",
          name: "Premium Plus",
          price: "R$ 89,99",
          period: "por mês",
          bonus: "Monetização Ativa",
          icon: <ProIcon />,
          className: "pricing-card--pro pricing-card--recommended",
          cardClass: "green",
          features: [
            {
              title: "Monetização",
              subtitle: "Ganhe Bits com suas postagens",
            },
            {
              title: "Conta verificada",
              subtitle: "Selo verde em seu perfil",
            },
           
            {
              title: "Convites premium",
              subtitle: "Sistema de convites ilimitados",
            },
          ],
          recommendation: "Máximo poder para criadores de conteúdo!",
          status: isCanceling ? "Cancelando no fim do período" : isActive ? "Assinatura Ativa" : "Inativa",
          statusColor: isCanceling ? "rgba(255, 107, 53, 0.308)" : isActive ? "rgba(43, 182, 89, 0.425)" : "#666",
        }

      default:
        return {
          type: "premium",
          name: "Premium",
          price: "R$ 13,99",
          period: "por mês",
          bonus: "Recursos Premium",
          icon: <Star size={32} />,
          className: "pricing-card--core",
          cardClass: "white",
          features: [
            {
              title: "Acesso premium completo",
              subtitle: "Todos os recursos desbloqueados",
            },
          ],
          recommendation: "Aproveite todos os benefícios premium!",
          status: isCanceling ? "Cancelando no fim do período" : isActive ? "Assinatura Ativa" : "Inativa",
          statusColor: isCanceling ? "rgba(255, 107, 53, 0.308)" : isActive ? "rgba(43, 182, 89, 0.425)" : "#666",
        }
    }
  }

  if (loading) {
    return (
      <HorizontalContainer>
        <Title>
          <h2>SEU PLANO ATUAL</h2>
          <p>Carregando informações da sua assinatura...</p>
        </Title>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </HorizontalContainer>
    )
  }

  if (error) {
    return (
      <HorizontalContainer>
        <Title>
          <h2>SEU PLANO ATUAL</h2>
          <p>Erro ao carregar informações da assinatura</p>
        </Title>
      </HorizontalContainer>
    )
  }

  const planConfig = getPlanConfig(type, subscription?.status || "inactive")

  return (
    <HorizontalContainer>
      <Title>
        <h2>SEU PLANO ATUAL</h2>
        <p>Veja todos os benefícios da sua assinatura ativa no ClubVision</p>
      </Title>

      <HorizontalCard className={planConfig.className}>
        {planConfig.type === "plus" && (
            <RecommendedBadge>
           <h3> Plano Completo </h3>
        <StatusBadge statusColor={planConfig.statusColor}>{planConfig.status}</StatusBadge>
      </RecommendedBadge>
        )}
   
        <HorizontalCardInner className={planConfig.cardClass}>
       
       
          <LeftSection>
            <PlanHeader>
              <PlanIconWrapper>{planConfig.icon}</PlanIconWrapper>
              <PlanInfo>
                <PlanTitle>
                  {planConfig.name}
                  {planConfig.type === "plus" && <Crown size={20} color="#37ce7b" />}
                </PlanTitle>
                <PlanDescription>{planConfig.recommendation}</PlanDescription>
              </PlanInfo>
            </PlanHeader>

            <PricingSection>
              <PriceDisplay>
                <MainPrice>{planConfig.price}</MainPrice>
                {planConfig.period && <PricePeriod>{planConfig.period}</PricePeriod>}
              </PriceDisplay>
              {planConfig.bonus && (
                <BonusDisplay>
                  <BonusLabel>+</BonusLabel>
                  <BonusText>{planConfig.bonus}</BonusText>
                </BonusDisplay>
              )}
            </PricingSection>

            {subscription && (
              <SubscriptionInfoHorizontal>
                <InfoItem>
                  <InfoLabel>Assinante desde:</InfoLabel>
                  <InfoValue>{moment(subscription.created).format("DD/MM/YYYY")}</InfoValue>
                </InfoItem>
                {subscription.current_period_end && (
                  <InfoItem>
                    <InfoLabel>Próxima cobrança:</InfoLabel>
                    <InfoValue>{moment(subscription.current_period_end).format("DD/MM/YYYY")}</InfoValue>
                  </InfoItem>
                )}
                {subscription.cancel_at && (
                  <InfoItem>
                    <InfoLabel>Cancela em:</InfoLabel>
                    <InfoValue>{moment(subscription.cancel_at).format("DD/MM/YYYY")}</InfoValue>
                  </InfoItem>
                )}
              </SubscriptionInfoHorizontal>
            )}

             <div className="flex flex-rol justify-start w-full items-center gap-1">
  <ButtonPortal onClick={() => subscription && handleOpenBillingPortal(subscription.customer_id)}>
              {isbutton ? (
                <>
                  <i className="fi fi-sr-loading" />
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                  <h5>Gerenciar</h5>
                </>
              )}
            </ButtonPortal>
                  <MarginTitle>
          <ul>
            {subscription?.cancel_at ? <span className="orange">Cancelando..</span> : null}
          </ul>
        </MarginTitle>
             </div>
            
          </LeftSection>

          <RightSection>
            <BenefitsHeader>
              <BenefitsTitle>Seus benefícios ativos</BenefitsTitle>
            </BenefitsHeader>

            <BenefitsGrid>
              {planConfig.features.map((feature, index) => (
                <BenefitItemHorizontal key={index}>
                  <BenefitIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
                      <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
                      <path
                        fill="#E3E3E6"
                        d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"
                      ></path>
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>{feature.title}</BenefitTitle>
                    <BenefitSubtitle>{feature.subtitle}</BenefitSubtitle>
                  </BenefitContent>
                </BenefitItemHorizontal>
              ))}
            </BenefitsGrid>

            <ActionSection>
              <ActionText>
                {planConfig.type === "free" ? (
                  <>
                    Faça upgrade para <ProHighlight>Premium</ProHighlight>
                  </>
                ) : planConfig.type === "bloom" ? (
                  <>
                   Na proxima assine o <ProHighlight>Plus</ProHighlight>
                  </>
                ) : (
                  <>
                    Você tem o <ProHighlight>máximo poder</ProHighlight>!
                  </>
                )}
              </ActionText>
             
            </ActionSection>
          </RightSection>
        </HorizontalCardInner>
      </HorizontalCard>
    </HorizontalContainer>
  )
}

export default CurrentPlanShowcase

// Reutilizando todos os styled-components do pricing-cards original
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 0;
`

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #2d302e;
  border-top: 3px solid #37ce7b;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
const MarginTitle = styled.div`
  align-items: center;
  display: flex;
 

  ul{
    align-items: center;
    display: flex;
    width: 100%;
    margin: 0.5em;
    justify-content: center;
    
    span{
      padding: 0.5em 1em 0.5em;
      font-size: 12px;
        width: 100%;
      color:black;
      margin: 0.3em;
      font-family: "XcSemibold";
      font-weight: 400;
      color: #f0ebeb;
      unicode-bidi: isolate;
      border-radius: 28px;
    }
  }

  .red{
    background-color: #ff1125c5;
  }

  .orange{
    background-color: #ff1125c5;
  }

  .green{
    background-color: #2cdd8a;
  }

  .silver{
    background-color: silver;
  }
`
const StatusBadge = styled.div<{ statusColor: string }>`
   
  background-color: ${(props) => props.statusColor};
  color: ${(props) => (props.statusColor === "#2bb65a" ? "#000" : "#fff")};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
  font-family: 'ProximaNova-Italic', monospace;
  z-index: 10;
`
 

const InfoLabel = styled.span`
  color: rgba(209, 214, 211, 0.7);
  font-size: 0.775rem;
  font-family: 'ProximaNova-Italic', monospace;
`

const InfoValue = styled.span`
  color: #909694;
  font-weight: 600;
  font-size: 0.775rem;
  font-family: 'ProximaNova-Italic', monospace;
` 

const Title = styled.ul`
  margin-bottom: 2em;

  h2 {
    font-family: 'ProximaNova';
    font-size: 18px;
  }

  p {
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
`
 
const RecommendedBadge = styled.div`
  display: flex;
  width: 100%;
  background-color: #2e302f81;
  border-radius: 8px;
  margin-bottom: 8px;
  height: 2rem;
  align-items: center;
  padding: 0.4em 1.5rem;
  justify-content: space-between;
  align-items: center;
  color: #2bb65a;
  font-size: 0.75rem;

  h3{
font-family: 'ProximaNova-Italic', monospace;
  }
`
 
const ProHighlight = styled.span`
  text-transform: capitalize;
  color: #37ce7b;
`

// Novos styled-components para layout horizontal
const HorizontalContainer = styled.div`
  width: 100%;
  margin-bottom: 2em;
`

const HorizontalCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 22px;
  padding: 1em;
  overflow: hidden;
  position: relative;
  width: 100%;

  .white {
    background: linear-gradient(204deg, #1a1b1b -7%, #b85cff00 33%), linear-gradient(162deg, #e7ecea40 -10%, #2c88dd00 25%), linear-gradient(0deg, #1a1b1b, #1a1b1b);
  }

  .green {
    background: linear-gradient(204deg, #1a1b1b -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #1a1b1b, #1a1b1b);
  }

  .silver {
    background: linear-gradient(204deg, #1a1b1b -7%, #b85cff00 33%), linear-gradient(162deg, #242525 -10%, #2c88dd00 25%), linear-gradient(0deg, #1a1b1b, #1a1b1b);
  }
`

const HorizontalCardInner = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #3d3f3e;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  position: relative;
  gap: 3rem;
  min-height: 300px;

  @media screen and (max-width: 1024px) {
    flex-direction: column;
    gap: 2rem;
  }

  @media screen and (max-width: 760px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
`
const ButtonPortal = styled.button`
  padding: 0.4em 1em 0.4em;
  border-radius: 58px;
  background-color: #fefeff;
  font-family: 'Inter', sans-serif;
  color: rgb(6, 7, 7);
  transition: 0.8s all;
  width: 100%;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 3px;

  h5{
    font-size: 12px;
  }
  
  &:hover{
    background-color: #d8d9e0f8;
    box-shadow: 3px 3px 18px rgb(107, 107, 109);
  }
`
const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 300px;

  @media screen and (max-width: 1024px) {
    min-width: auto;
  }
`

const RightSection = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const PlanHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const PlanIconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const PlanInfo = styled.div`
  flex: 1;
`

const PlanTitle = styled.h2`
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media screen and (max-width: 760px) {
    font-size: 1.5rem;
  }
`

const PlanDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-family: 'ProximaNova-Italic', monospace;
  margin: 0.5rem 0 0 0;
  font-size: 14px;
`

const PricingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const PriceDisplay = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`

const MainPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #54bd5d;

  @media screen and (max-width: 760px) {
    font-size: 2rem;
  }
`

const PricePeriod = styled.span`
  font-size: 15px;
    font-family: 'ProximaNova-Italic', monospace;
  color: rgba(255, 255, 255, 0.7);
`

const BonusDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const BonusLabel = styled.span`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
`

const BonusText = styled.span`
  font-size: 15px;
  font-weight: 600;
    font-family: 'ProximaNova-Italic', monospace;
  color: #ada967;
`

const SubscriptionInfoHorizontal = styled.div`
  background: rgba(139, 143, 140, 0.05);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BenefitsHeader = styled.div`
  margin-bottom: 1rem;
`

const BenefitsTitle = styled.h3`
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media screen and (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const BenefitItemHorizontal = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.35rem;
  transition: all 0.2s ease;
 
`

const BenefitIcon = styled.div`
  flex-shrink: 0;
  
  svg {
    width: 18px;
    height: 18px;
    color: rgb(61, 61, 61);
  }
`

const BenefitContent = styled.div`
  flex: 1;
`

const BenefitTitle = styled.div`
  color: #fff;
  font-family: 'ProximaNova-Italic', monospace;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`

const BenefitSubtitle = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  font-family: 'ProximaNova-Italic', monospace;
  line-height: 1.3;
`

const ActionSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media screen and (max-width: 760px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`

const ActionText = styled.p`
  color: #fff;
  font-size: 17px;
  margin: 0;
`
 