"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import styled, { keyframes } from "styled-components"
import { ThemeProvider } from "styled-components"
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Info,
  HelpCircle,
  MessageSquare,
  CreditCard,
  Wallet,
  Clock,
  Shield,
  WifiOff,
  Server,
  UserX,
  ShoppingCart,
  AlertCircle,
  X,
} from "lucide-react"
import axios from "axios"
import HeadGlobal from "@/club/head/glob.n"
import ROUTENVX from "@/routes/routes"
import { MarginImagsx } from "@/components/account/account.user"

// Define a basic theme for styled-components
const theme = {
  colors: {
    primary: "#41b45e",
    secondary: "#34a04f",
    text: "#ffffff",
    textSecondary: "#a3a9bb",
    background: "#0e0e11",
    surface: "#1d1f1d",
    border: "#2d2e2d",
    error: "#ff6b6b",
    success: "#41b45e",
  },
  radii: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    xxl: "24px",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  transitions: {
    fast: "0.15s ease",
    default: "0.3s ease",
    slow: "0.5s ease",
  },
}

interface ErrorConfig {
  icon: React.ReactNode
  title: string
  description: string
  technicalDetails?: string
  suggestedAction: string
  primaryAction: string
  secondaryAction?: string
  canRetry: boolean
  canCancel: boolean
  severity: "low" | "medium" | "high"
  category: "payment" | "network" | "auth" | "system" | "user"
}

export default function ErrorPage() {
  const router = useRouter()
  const { code, order, message, details } = router.query
  const [errorData, setErrorData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    if (!code) return

    const fetchErrorData = async () => {
      try {
        setTimeout(() => {
          const errorConfig = getErrorConfig(code as string)
          setErrorData({
            code: code as string,
            orderId: order as string,
            message: message as string,
            details: details as string,
            date: new Date().toISOString(),
            ...errorConfig,
          })
          setIsLoading(false)
        }, 800)
      } catch (error) {
        console.error("Error fetching error data:", error)
        setIsLoading(false)
      }
    }

    fetchErrorData()
  }, [code, order, message, details])

  const getErrorConfig = (errorCode: string): ErrorConfig => {
    switch (errorCode) {
      // Erros de Pagamento
      case "insufficient_funds":
        return {
          icon: <Wallet size={40} />,
          title: "Saldo Insuficiente",
          description: "Você não possui saldo suficiente para completar esta transação.",
          technicalDetails: "O valor total da compra excede o saldo disponível em sua carteira digital.",
          suggestedAction: "Adicione mais Bits à sua carteira ou remova alguns itens do carrinho.",
          primaryAction: "Adicionar Saldo",
          secondaryAction: "Voltar ao Carrinho",
          canRetry: true,
          canCancel: true,
          severity: "medium",
          category: "payment",
        }

      case "payment_failed":
        return {
          icon: <CreditCard size={40} />,
          title: "Falha no Pagamento",
          description: "Não foi possível processar seu pagamento no momento.",
          technicalDetails: "O sistema de pagamento retornou um erro durante o processamento da transação.",
          suggestedAction: "Verifique seu método de pagamento e tente novamente em alguns instantes.",
          primaryAction: "Tentar Novamente",
          secondaryAction: "Escolher Outro Método",
          canRetry: true,
          canCancel: true,
          severity: "high",
          category: "payment",
        }

      case "card_not_found":
        return {
          icon: <CreditCard size={40} />,
          title: "Cartão Não Encontrado",
          description: "O cartão selecionado não foi encontrado em sua conta.",
          technicalDetails: "O ID do cartão fornecido não corresponde a nenhum cartão ativo em sua conta.",
          suggestedAction: "Selecione outro cartão ou adicione um novo método de pagamento.",
          primaryAction: "Escolher Outro Cartão",
          secondaryAction: "Voltar ao Checkout",
          canRetry: true,
          canCancel: true,
          severity: "medium",
          category: "payment",
        }

      case "card_frozen":
      case "card_unusable":
        return {
          icon: <Shield size={40} />,
          title: "Cartão Bloqueado",
          description: "O cartão selecionado está temporariamente bloqueado.",
          technicalDetails: "Este cartão foi bloqueado por motivos de segurança e não pode ser usado no momento.",
          suggestedAction: "Use outro método de pagamento ou entre em contato com o suporte para desbloquear.",
          primaryAction: "Escolher Outro Método",
          secondaryAction: "Contatar Suporte",
          canRetry: false,
          canCancel: true,
          severity: "high",
          category: "payment",
        }

      case "daily_limit_exceeded":
        return {
          icon: <Shield size={40} />,
          title: "Limite Diário Excedido",
          description: "O limite diário do cartão foi excedido.",
          technicalDetails: "O valor da transação excede o limite diário configurado para este cartão.",
          suggestedAction: "Use outro método de pagamento ou aguarde até amanhã para tentar novamente.",
          primaryAction: "Escolher Outro Método",
          secondaryAction: "Ver Limites",
          canRetry: false,
          canCancel: true,
          severity: "medium",
          category: "payment",
        }

      // Erros de Rede
      case "network_error":
        return {
          icon: <WifiOff size={40} />,
          title: "Erro de Conexão",
          description: "Não foi possível conectar com nossos servidores.",
          technicalDetails: "Falha na comunicação com o servidor de pagamentos. Verifique sua conexão com a internet.",
          suggestedAction: "Verifique sua conexão com a internet e tente novamente.",
          primaryAction: "Tentar Novamente",
          secondaryAction: "Verificar Conexão",
          canRetry: true,
          canCancel: true,
          severity: "medium",
          category: "network",
        }

      case "timeout":
        return {
          icon: <Clock size={40} />,
          title: "Tempo Limite Excedido",
          description: "A transação demorou muito para ser processada e foi cancelada.",
          technicalDetails: "O tempo limite de 30 segundos para processamento da transação foi excedido.",
          suggestedAction:
            "Tente novamente. Se o problema persistir, pode ser um problema temporário de conectividade.",
          primaryAction: "Tentar Novamente",
          secondaryAction: "Verificar Status",
          canRetry: true,
          canCancel: true,
          severity: "medium",
          category: "network",
        }

      // Erros de Sistema
      case "server_error":
      case "server_down":
        return {
          icon: <Server size={40} />,
          title: "Erro do Servidor",
          description: "Nossos servidores estão enfrentando problemas técnicos temporários.",
          technicalDetails: "Erro interno do servidor (HTTP 500). Nossa equipe técnica foi notificada automaticamente.",
          suggestedAction: "Aguarde alguns minutos e tente novamente. Se persistir, entre em contato com o suporte.",
          primaryAction: "Tentar Novamente",
          secondaryAction: "Contatar Suporte",
          canRetry: true,
          canCancel: true,
          severity: "high",
          category: "system",
        }

      case "transaction_error":
        return {
          icon: <AlertTriangle size={40} />,
          title: "Erro na Transação",
          description: "Ocorreu um erro durante o processamento da sua transação.",
          technicalDetails:
            "Falha no processamento da transação no banco de dados. Os dados podem estar inconsistentes.",
          suggestedAction: "Verifique seu histórico de transações antes de tentar novamente.",
          primaryAction: "Ver Histórico",
          secondaryAction: "Tentar Novamente",
          canRetry: true,
          canCancel: true,
          severity: "high",
          category: "system",
        }

      // Erros de Autenticação
      case "unauthorized":
        return {
          icon: <UserX size={40} />,
          title: "Acesso Negado",
          description: "Você precisa estar logado para acessar esta página.",
          technicalDetails: "Token de autenticação inválido ou expirado. Sessão não encontrada.",
          suggestedAction: "Faça login novamente e tente acessar o checkout.",
          primaryAction: "Fazer Login",
          secondaryAction: "Voltar ao Início",
          canRetry: false,
          canCancel: false,
          severity: "medium",
          category: "auth",
        }

      // Erros de Sessão
      case "session_not_found":
        return {
          icon: <ShoppingCart size={40} />,
          title: "Sessão de Checkout Não Encontrada",
          description: "A sessão de checkout expirou ou não foi encontrada.",
          technicalDetails: "O ID da sessão de checkout não existe ou foi removido do banco de dados.",
          suggestedAction: "Inicie um novo processo de checkout adicionando itens ao carrinho.",
          primaryAction: "Novo Checkout",
          secondaryAction: "Voltar à Loja",
          canRetry: false,
          canCancel: false,
          severity: "medium",
          category: "user",
        }

      case "session_expired":
        return {
          icon: <Clock size={40} />,
          title: "Sessão Expirada",
          description: "Sua sessão de checkout expirou por inatividade.",
          technicalDetails: "As sessões de checkout expiram após 30 minutos de inatividade por motivos de segurança.",
          suggestedAction: "Inicie um novo checkout. Seus itens podem ainda estar no carrinho.",
          primaryAction: "Novo Checkout",
          secondaryAction: "Ver Carrinho",
          canRetry: true,
          canCancel: false,
          severity: "low",
          category: "user",
        }

      // Erros de Usuário
      case "user_not_found":
        return {
          icon: <UserX size={40} />,
          title: "Usuário Não Encontrado",
          description: "Não foi possível encontrar seus dados de usuário.",
          technicalDetails: "O ID do usuário não foi encontrado no banco de dados durante o processamento.",
          suggestedAction: "Faça logout e login novamente. Se persistir, entre em contato com o suporte.",
          primaryAction: "Fazer Login",
          secondaryAction: "Contatar Suporte",
          canRetry: false,
          canCancel: false,
          severity: "high",
          category: "auth",
        }

      // Erro genérico
      default:
        return {
          icon: <AlertCircle size={40} />,
          title: "Erro Desconhecido",
          description: "Ocorreu um erro inesperado durante o processamento.",
          technicalDetails: `Código de erro: ${errorCode}. Este erro não foi mapeado em nosso sistema.`,
          suggestedAction: "Nossa equipe técnica foi notificada. Tente novamente ou entre em contato com o suporte.",
          primaryAction: "Tentar Novamente",
          secondaryAction: "Contatar Suporte",
          canRetry: true,
          canCancel: true,
          severity: "medium",
          category: "system",
        }
    }
  }

  const handleBackToStore = () => {
    router.push(ROUTENVX.market)
  }

  const handleRetry = () => {
    if (order) {
      router.push(`?orderId=${order}`)
    } else {
      router.push(ROUTENVX.market)
    }
  }

  const handleCancelCheckout = async () => {
    if (!order || isCancelling) return

    setIsCancelling(true)
    try {
      const response = await axios.post("/api/trivo/checkout/cancel_checkout", {
        orderId: order as string,
      })

      if (response.data.success) {
        // Limpar localStorage
        localStorage.removeItem("cartItems")
        localStorage.removeItem("cartTotal")
        localStorage.removeItem("activeOrderId")

        // Redirecionar para a loja
        router.push(ROUTENVX.market)
      } else {
        alert("Erro ao cancelar checkout. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao cancelar checkout:", error)
      alert("Erro ao cancelar checkout. Tente novamente.")
    } finally {
      setIsCancelling(false)
    }
  }

  const handlePrimaryAction = () => {
    switch (errorData?.code) {
      case "insufficient_funds":
        router.push("/wallet/deposit")
        break
      case "unauthorized":
      case "user_not_found":
        router.push("/login")
        break
      case "session_not_found":
      case "session_expired":
        router.push(ROUTENVX.market)
        break
      case "transaction_error":
        router.push("/transactions")
        break
      default:
        handleRetry()
    }
  }

 

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <PageContainer>
          <LoadingContainer>
             <MarginImagsx >
                     <img src="/icons/market/20250325_192605.webp"  alt="novision" width={120} height={120} className="b1"/>
                     <img src="/icons/market/20250325_192624.webp"  alt="novision" width={120} height={120}  className="b2"/>
                  </MarginImagsx>
            <LoadingText>Analisando erro...</LoadingText>
          </LoadingContainer>
        </PageContainer>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <HeadGlobal Title={`Erro no Checkout - ${errorData?.title || "TheNoVision"}`} />
      <PageContainer>
        <BackgroundGlow className="top-left" />
        <BackgroundGlow className="bottom-right" />

        <Header>
          <BackButton onClick={handleBackToStore}>
            <ArrowLeft size={20} />
          </BackButton>
   
      
        </Header>

        <ContentContainer>
          <ErrorCard severity={errorData?.severity}>
            <ErrorIconContainer>
              <ErrorIcon severity={errorData?.severity}>{errorData?.icon}</ErrorIcon>
              <ErrorRing severity={errorData?.severity} />
            </ErrorIconContainer>

            <ErrorTitle>{errorData?.title}</ErrorTitle>
            <ErrorDescription>{errorData?.description}</ErrorDescription>

            <ErrorInfoCard>
              <ErrorInfoHeader>
                <ErrorInfoTitle>
                  <Info size={16} />
                  Detalhes do Erro
                </ErrorInfoTitle>
                <ErrorSeverityBadge severity={errorData?.severity}>
                  {errorData?.severity === "high" && "Crítico"}
                  {errorData?.severity === "medium" && "Moderado"}
                  {errorData?.severity === "low" && "Leve"}
                </ErrorSeverityBadge>
              </ErrorInfoHeader>

              <ErrorDetail>
                <DetailLabel>Código do Erro</DetailLabel>
                <DetailValue>{errorData?.code}</DetailValue>
              </ErrorDetail>

              <ErrorDetail>
                <DetailLabel>Categoria</DetailLabel>
                <DetailValue>
                  <CategoryBadge category={errorData?.category}>
                    {errorData?.category === "payment" && "Pagamento"}
                    {errorData?.category === "network" && "Rede"}
                    {errorData?.category === "auth" && "Autenticação"}
                    {errorData?.category === "system" && "Sistema"}
                    {errorData?.category === "user" && "Usuário"}
                  </CategoryBadge>
                </DetailValue>
              </ErrorDetail>

              {errorData?.orderId && (
                <ErrorDetail>
                  <DetailLabel>ID do Pedido</DetailLabel>
                  <DetailValue>{errorData.orderId}</DetailValue>
                </ErrorDetail>
              )}

              <ErrorDetail>
                <DetailLabel>Data e Hora</DetailLabel>
                <DetailValue>{new Date(errorData?.date).toLocaleString("pt-BR")}</DetailValue>
              </ErrorDetail>

              {errorData?.technicalDetails && (
                <>
                  <ErrorDivider />
                  <TechnicalDetails>
                    <TechnicalTitle>Detalhes Técnicos</TechnicalTitle>
                    <TechnicalText>{errorData.technicalDetails}</TechnicalText>
                  </TechnicalDetails>
                </>
              )}

              <ErrorDivider />

              <SuggestedAction>
                <ActionIcon>
                  <HelpCircle size={20} color="#ff6b6b" />
                </ActionIcon>
                <ActionText>{errorData?.suggestedAction}</ActionText>
              </SuggestedAction>
            </ErrorInfoCard>

            <ActionButtons>
              <PrimaryButton onClick={handlePrimaryAction}>
                {errorData?.canRetry ? <RefreshCw size={16} /> : <ArrowLeft size={16} />}
                {errorData?.primaryAction}
              </PrimaryButton>

            {errorData?.canCancel && errorData?.orderId && (
              <CancelCheckoutButton onClick={handleCancelCheckout} disabled={isCancelling}>
                <X size={16} />
                {isCancelling ? "Cancelando..." : "Cancelar Checkout Pendente"}
              </CancelCheckoutButton>
            )}
            </ActionButtons>

           

          
            {/* Debug Info (only in development) */}
            {process.env.NODE_ENV === "development" && (
              <DebugInfo>
                <DebugTitle>Debug Info (Dev Only)</DebugTitle>
                <DebugText>Code: {code}</DebugText>
                <DebugText>Order ID: {order}</DebugText>
                <DebugText>Message: {message}</DebugText>
                <DebugText>Details: {details}</DebugText>
              </DebugInfo>
            )}
          </ErrorCard>
        </ContentContainer>
      </PageContainer>
    </ThemeProvider>
  )
}

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const ringPulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
`

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  position: relative;
 font-family: 'ProximaNova-Italic', sans-serif;  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`

const BackgroundGlow = styled.div`
  position: absolute;
  pointer-events: none;
  
  &.top-left {
    left: 0;
    top: 0;
    height: 500px;
    width: 500px;
    background: #ff6b6b;
    opacity: 0.03;
    border-radius: 50%;
    filter: blur(150px);
  }
  
  &.bottom-right {
    right: 0;
    top: 30%;
    height: 400px;
    width: 400px;
    background: #ff6b6b;
    opacity: 0.02;
    border-radius: 50%;
    filter: blur(150px);
  }
`

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 1.5rem;    
 
 
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
 
  color: white;
  transition: all 0.3s ease;
 
  
  &:hover {
 
    transform: scale(1.05);
  }
`

 
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  z-index: 1;
 
`

const ErrorCard = styled.div<{ severity?: string }>`
  max-width: 600px;
  width: 100%;
  
  padding: 2rem;
 
  text-align: center;
`

const ErrorIconContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
`

const ErrorIcon = styled.div<{ severity?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ severity }) => {
    switch (severity) {
      case "high":
        return "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)"
      case "medium":
        return "linear-gradient(135deg, #ffc107 0%, #ffb300 100%)"
      case "low":
        return "linear-gradient(135deg, #65a3ff 0%, #4f8fff 100%)"
      default:
        return "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)"
    }
  }};
  box-shadow: ${({ severity }) => {
    switch (severity) {
      case "high":
        return "0 10px 25px rgba(255, 107, 107, 0.4)"
      case "medium":
        return "0 10px 25px rgba(255, 193, 7, 0.4)"
      case "low":
        return "0 10px 25px rgba(101, 163, 255, 0.4)"
      default:
        return "0 10px 25px rgba(255, 107, 107, 0.4)"
    }
  }};
  animation: ${pulse} 2s infinite ease-in-out;
  color: white;
`

const ErrorRing = styled.div<{ severity?: string }>`
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  border: 2px solid ${({ severity }) => {
    switch (severity) {
      case "high":
        return "#ff6b6b"
      case "medium":
        return "#ffc107"
      case "low":
        return "#65a3ff"
      default:
        return "#ff6b6b"
    }
  }};
  animation: ${ringPulse} 2s infinite;
`

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.75rem;
`

const ErrorDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin-bottom: 2rem;
  line-height: 1.5;
`

const ErrorInfoCard = styled.div`
  background: rgba(45, 48, 46, 0.3);
 
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
`

const ErrorInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const ErrorInfoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
`

const ErrorSeverityBadge = styled.div<{ severity?: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${({ severity }) => {
    switch (severity) {
      case "high":
        return `
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
          border: 1px solid rgba(255, 107, 107, 0.4);
        `
      case "medium":
        return `
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.4);
        `
      case "low":
        return `
          background: rgba(101, 163, 255, 0.2);
          color: #65a3ff;
          border: 1px solid rgba(101, 163, 255, 0.4);
        `
      default:
        return `
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
          border: 1px solid rgba(255, 107, 107, 0.4);
        `
    }
  }}
`

const CategoryBadge = styled.div<{ category?: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ category }) => {
    switch (category) {
      case "payment":
        return `
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.3);
        `
      case "network":
        return `
          background: rgba(101, 163, 255, 0.1);
          color: #65a3ff;
          border: 1px solid rgba(101, 163, 255, 0.3);
        `
      case "auth":
        return `
          background: rgba(156, 163, 175, 0.1);
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.3);
        `
      case "system":
        return `
          background: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
          border: 1px solid rgba(255, 107, 107, 0.3);
        `
      case "user":
        return `
          background: rgba(65, 180, 94, 0.1);
          color: #41b45e;
          border: 1px solid rgba(65, 180, 94, 0.3);
        `
      default:
        return `
          background: rgba(156, 163, 175, 0.1);
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.3);
        `
    }
  }}
`

const ErrorDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const DetailLabel = styled.span`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
`

const DetailValue = styled.span`
  font-size: 0.85rem;
  color: white;
  font-family: monospace;
`

const ErrorDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.3), transparent);
  margin: 1rem 0;
`

const TechnicalDetails = styled.div`
  margin: 1rem 0;
`

const TechnicalTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
`

const TechnicalText = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: monospace;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem;
  border-radius: 8px;
 
`

const SuggestedAction = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 107, 107, 0.1);
 border-radius: 12px;
 font-family: 'ProximaNova-Italic', sans-serif;
`

const ActionIcon = styled.div`
  margin-top: 0.25rem;
`

const ActionText = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  flex: 1;
  margin: 0;
`

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

const PrimaryButton = styled.button`
 display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
 
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);

  border-radius: 33px;
  color: #ff6b6b;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  &:hover:not(:disabled) {
    background: rgba(255, 107, 107, 0.2);
    border-color: rgba(255, 107, 107, 0.5);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

 

const CancelCheckoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
 
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 42px;
  color: #ff6b6b;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  &:hover:not(:disabled) {
    background: rgba(255, 107, 107, 0.2);
    border-color: rgba(255, 107, 107, 0.5);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const SupportButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.4);
    color: white;
  }
`

const DebugInfo = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  text-align: left;
`

const DebugTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffc107;
  margin-bottom: 0.5rem;
`

const DebugText = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: monospace;
  margin-bottom: 0.25rem;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 107, 107, 0.3);
  border-top: 3px solid #ff6b6b;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`

const LoadingText = styled.p`
  font-size: 1.1rem;
  color: white;
`
