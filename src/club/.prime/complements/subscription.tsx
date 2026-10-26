"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import styled from "styled-components"
import Image from "next/image"
import moment from "moment-timezone"
import "moment/locale/pt-br"
import axios from "axios"
import { decrypt } from "@/core/security/encryption"
import LoadingPageView from "@club/resources/loading/market.loading"

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

interface PlanBenefit {
  icon: string
  title: string
  description: string
}

const SubscriptionEnhanced = ({ id, type }: { id: string; type: string }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isbutton, setisbutton] = useState<boolean>(false)
  const [viewbenefic, setViewbenefic] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const router = useRouter()
  moment.locale("pt-br") 

  const handleopenbenefic = () => {
    setIsClosing(false)
    setViewbenefic(true)
  }

  const handleclosebenefic = () => {
    setIsClosing(true)
    setTimeout(() => {
      setViewbenefic(false)
    }, 200)
  }

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setisbutton(true)
        const response = await axios.get(`/api/stripe/customers/subscription/${id}`)
        const dataw = decrypt(response.data.subscription)
        const parsedDataw = JSON.parse(dataw)

        if (dataw) {
          setisbutton(false)
          setSubscriptions(parsedDataw)
        } else {
          console.error("Erro buscar informações do usuário:")
        }
      } catch (error) {
        setError("Erro ao buscar assinaturas.")
      } finally {
        setLoading(false)
        setisbutton(false)
      }
    }

    fetchSubscriptions()
  }, [id])

   

  const getPlanDetails = (planType: string, status: string) => {
    if (status === "canceled" || !subscriptions) {
      return {
        name: "Membro Club",
        price: "Gratuito",
        benefits: [
          { icon: "fi fi-sr-user", title: "Acesso básico", description: "Acesso limitado ao clubvision" },
          { icon: "fi fi-sr-globe", title: "Perfil público", description: "Perfil público com limitações" },
        ],
      }
    }

    switch (planType?.toLowerCase()) {
      case "premium":
      case "bloom":
        return {
          name: "Premium Bloom",
          price: "R$ 13,99/mês",
          benefits: [
            {
              icon: "fi fi-sr-rent",
              title: "Acesso prime ao clubvision",
              description: "Vantagens exclusivas para membros prime",
            },
            { icon: "fi fi-sr-credit-card", title: "2.000 Bits", description: "Creditado em sua conta thenovision" },
            { icon: "fi fi-bs-gem", title: "16.000 ORBS", description: "Creditado em sua conta clubvision" },
            {
              icon: "fi fi-bs-user-pen",
              title: "Personalização do perfil",
              description: "Altere seu avatar e faixa para personalizar seu perfil",
            },
            { icon: "fi fi-bs-shield", title: "Isecurity", description: "Sistema de segurança que protege sua conta" },
            {
              icon: "fi fi-br-user-unlock",
              title: "Feed Postvision",
              description: "Acesso ao feed de postagens de fotos e vídeos",
            },
            {
              icon: "fi fi-br-broken-image",
              title: "Acesso ao Postvision",
              description: "Painel de postagens de fotos e vídeos",
            },
            { icon: "fi fi-bs-eye", title: "Perfil Público", description: "Libere o acesso público à sua galeria" },
            {
              icon: "fi fi-bs-pallet-alt",
              title: "Personalizar Clubvision",
              description: "Acesso ao menu de personalização",
            },
            { icon: "fi fi-bs-flag-alt", title: "Criação de Clã", description: "Crie seu clã no ClubVision" },
          ],
        }
      case "plus":
        return {
          name: "Premium Plus",
          price: "R$ 89,99/mês",
          benefits: [
            {
              icon: "fi fi-sr-fingerprint",
              title: "Verificação de identidade",
              description: "A verificação de identidade ativa alguns recursos exclusivos",
            },
            { icon: "fi fi-sr-ticket", title: "Convide seus amigos", description: "Acesso ao menu de convites" },
            {
              icon: "fi fi-sr-tickets-airline",
              title: "Conta autorizada",
              description: "Autorizado sem a necessidade de convite",
            },
            {
              icon: "fi fi-sr-rent",
              title: "Acesso total ao clubvision",
              description: "Vantagens exclusivas para membros prime",
            },
            {
              icon: "fi fi-bs-badge-check",
              title: "Conta Verificada",
              description: "Obtenha um selo verde em seu perfil",
            },
            { icon: "fi fi-sr-credit-card", title: "2.000 Bits", description: "Creditado em sua conta thenovision" },
            { icon: "fi fi-bs-gem", title: "16.000 ORBS", description: "Creditado em sua conta clubvision" },
            {
              icon: "fi fi-bs-treasure-chest",
              title: "Monetização",
              description: "Ganhe Bits por visualizações nas suas postagens",
            },
            {
              icon: "fi fi-bs-tax-alt",
              title: "+ Univision X",
              description: "Receba de 1 a 5% de Orbs das transações",
            },
            {
              icon: "fi fi-bs-hockey-puck",
              title: "Mini-Game Double",
              description: "Jogue para tentar triplicar suas apostas",
            },
            { icon: "fi fi-sr-dashboard-panel", title: "ClubStudio", description: "Gerencie e monetize sua mídia" },
          ],
        }
      default:
        return {
          name: "Premium",
          price: "R$ 13,99/mês",
          benefits: [
            { icon: "fi fi-sr-rent", title: "Acesso premium", description: "Acesso completo aos recursos premium" },
          ],
        }
    }
  }

  const planDetails = getPlanDetails(type, subscriptions?.status || "inactive")
  

  if (loading) {
    return <LoadingPageView />
  }

  return (
    <>
      <CardSelect>
        
        <ul>
          <li>
            <h2>SUBSCRIPTION</h2>
            <p>Seus pagamentos recorrentes por serviços de assinatura, como club e thenovision city.</p>
          </li>
        </ul>

        <MarginCardsub>
          <Image src={"/nvrp/logonvrp.png"} alt="novision" height={60} width={60} />
          <li>
            <h4>
              #{planDetails.name} - {type}
            </h4>
            <p>{planDetails.price}</p>
            {subscriptions?.current_period_end && (
              <p>Os benefícios terminam em: {moment(subscriptions.current_period_end).format("LL")}</p>
            )}
          </li>
        </MarginCardsub>

        <Content>
          <Container>
            <ul>
              <h3>BENEFÍCIOS INCLUSOS</h3>
            </ul>
          </Container>

          <BenefitsContainer>
            <li>
              {planDetails.benefits.slice(0, viewbenefic ? planDetails.benefits.length : 4).map((benefit, index) => (
                <span key={index}>
                  <i className={benefit.icon} />
                  <text>
                    <h5>{benefit.title}</h5>
                    <p>{benefit.description}</p>
                  </text>
                </span>
              ))}

              {(viewbenefic || isClosing) && planDetails.benefits.length > 4 && (
                <div className={`colos ${viewbenefic ? "slide-down" : "slide-up"}`}>
                  {planDetails.benefits.slice(4).map((benefit, index) => (
                    <span key={index + 4}>
                      <i className={benefit.icon} />
                      <text>
                        <h5>{benefit.title}</h5>
                        <p>{benefit.description}</p>
                      </text>
                    </span>
                  ))}
                </div>
              )}

              {planDetails.benefits.length > 4 && (
                <ul>
                  {viewbenefic ? (
                    <button onClick={handleclosebenefic}>
                      <i className="fi fi-sr-sort-down trs" />
                      <h6>Ver menos</h6>
                    </button>
                  ) : (
                    <button onClick={handleopenbenefic}>
                      <i className="fi fi-sr-sort-down" />
                      <h6>Ver mais</h6>
                    </button>
                  )}
                </ul>
              )}
            </li>
          </BenefitsContainer>

          {subscriptions && (
            <>
              <ul>
                <h4>Status:</h4>
                <h6>{subscriptions.status === "active" ? "Ativo" : "Inativo"}</h6>
              </ul>

              <ul>
                <h4>Assinatura desde:</h4>
                <h6>
                  {moment(subscriptions.current_period_start).format("LL")} às{" "}
                  {moment(subscriptions.current_period_start).format("HH:mm:ss")}
                </h6>
              </ul>

              <ul>
                <h4>Cancelamento no Fim do Período:</h4>
                <h6>{subscriptions.cancel_at_period_end ? "Sim" : "Não"}</h6>
              </ul>

              {subscriptions.current_period_end && (
                <ul>
                  <h4>Assinatura expira em:</h4>
                  <h6>
                    {moment(subscriptions.current_period_end).format("LL")} às{" "}
                    {moment(subscriptions.current_period_end).format("HH:mm:ss")}
                  </h6>
                </ul>
              )}
            </>
          )}
        </Content>
      </CardSelect>
    </>
  )
}

export default SubscriptionEnhanced

// Reutilizando os styled-components originais
 

const CardSelect = styled.div`
  background-color: rgba(38, 39, 39, 0.329);
  border-radius: 9px;
  margin: 0.4em;
  width: 100%;
  position: relative;
 
  ul{
    display: flex; 
    justify-content: space-between;  
    align-items: center;
    padding: 0.6em 1em 0.6em;
  
    h2{
      font-family: 'ProximaNova-';
      font-weight: 200;
      text-align: start;
      display: block;
      margin-bottom: 0.8em;
      margin-top: 9px;
      font-size: 0.74rem;
      line-height: 1.15rem;
      letter-spacing: 1.15em;
      background: linear-gradient(rgb(213, 213, 213) 0%, rgb(106, 106, 106) 100%) text;
      -webkit-text-fill-color: transparent;
    }

    p{
      font-size: 11px;
      max-width: 320px;
      color: #bcc0cc;
      font-family: 'Inter', monospace;
    }
  }
`

const MarginCardsub = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0.9em;
  background-color: #242525;
  border-radius: 14px;
  padding: 0.6em 1em 0.6em;
  
  p{
    font-size: 11px;
    font-family: 'ProximaNova-italic';
    color: #8b9096;
  }

  h4{
    color: #d2dcdd;
    font-family: 'XcSemibold', sans-serif;
  }
`

 

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  h3{
    font-weight: 500;
    margin: 0;
    font-size: 18px;
    color: #b3c0b8;
    font-family: 'XcSemibold', sans-serif;
    padding: 10px 0;
  }
`

const Content = styled.div`
  width: 98%;
  padding: 0.5em;
  animation: scales 0.3s linear;
  border-radius: 8px;
  margin: 0.4em;

  @keyframes scales {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }

  h4{
    font-weight: 500;
    color: #86868f;
    margin: 0;
    font-size: 13px;
    font-family: 'ProximaNova-Italic', sans-serif;
  }

  h6{
    font-family: 'ProximaNova-';
    font-size: 12px;
    font-weight: 200;
    text-align: start;
    color: rgb(190, 192, 196);
    max-width: 460px;
  }

  ul{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1em;
  }
`

const BenefitsContainer = styled.div`
  /* Animação de deslizar para baixo quando o conteúdo aparece */
  @keyframes slideDown {
    0% {
      max-height: 0;
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      max-height: 1000px;
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Animação de deslizar para cima quando o conteúdo desaparece */
  @keyframes slideUp {
    0% {
      max-height: 1000px;
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      max-height: 0;
      opacity: 0;
      transform: translateY(-10px);
    }
  }

  .colos {
    overflow: hidden;
  }

  .slide-down {
    animation: slideDown 0.5s forwards ease-in-out;
  }

  .slide-up {
    animation: slideUp 0.5s forwards ease-in-out;
  }

  li{
    display: flex;
    flex-direction: column;
  }

  span{
    display: flex;
    flex-direction: row;
    margin: 0.3em 0;
  }

  i{
    font-size: 28px;
    background: linear-gradient(47deg, #e71236 0%, #98a79c 1%, #1cdb82 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    margin: 0.3em;
  }

  h5{
    color: #d7dee4;
    text-align: left;
    font-family: 'Inter', sans-serif;
  }

  p{
    color: #aaaeb3;
    font-size: 12px;
    max-width: 320px;
    overflow: hidden;
    word-wrap: break-word;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  ul{
    width: 100%;
    text-align: center;

    button{
      display: inline-flex;
      align-items: center;
      background: transparent;
      border: none;
      cursor: pointer;
      
      i{
        font-size: 14px;
        color: #c5bdbd;
      }
      h6{
        font-family: 'ProximaNova-Italic', sans-serif;
        font-size: 14px;
        color: #c5bdbd;
      }
    }
  }

  .trs{
    transform: rotate(180deg);
  }
`
