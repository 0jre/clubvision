"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import styled, { keyframes } from "styled-components"
import { ThemeProvider } from "styled-components"
import { CheckCircle, ArrowLeft, Copy, Clock, Package, Sparkles, CheckIcon, CreditCard, Wallet } from "lucide-react"
import axios from "axios"
import ROUTENVX from "@/routes/routes"
import HeadGlobal from "@/club/head/glob.n"
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

interface TransactionData {
  transactionId: string
  status: "pending" | "completed" | "failed" | "partial" | "expired" 
  purchasedItems: number
  failedItems: number
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  paymentMethod: string
  cardUsed?: string
  date: string
  completedAt?: string // Added this field
  xpEarned: number
  items: Array<{
    id: number
    name: string
    price: number
    uid: string
    value: number
    paymentStatus: string
  }>
}

export default function SuccessPage() {
  const router = useRouter()
  const { txn, status, pending } = router.query
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!txn) return

    const fetchTransactionData = async () => {
      try {
        // Buscar dados da transação da API
        const response = await axios.get(`/api/trivo/checkout/status_checkout/${txn}`)

        if (response.data.success) {
          const data = response.data.data
          setTransactionData({
            transactionId: data.transactionId,
            status: data.status,
            // Ajuste para priorizar a contagem de itens da lista se disponível
            purchasedItems: data.items?.length || data.purchasedItems || data.itemCount || 0,
            failedItems: data.failedItems || data.failedItemCount || 0,
            totalAmount: data.totalAmount || data.totalWithFees || 0,
            paidAmount: data.paidAmount || 0,
            pendingAmount: data.pendingAmount || 0,
            paymentMethod: data.paymentMethod || "wallet",
            cardUsed: data.cardUsed,
            date: data.createdAt || new Date().toISOString(),
            completedAt: data.completedAt ? new Date(data.completedAt).toISOString() : undefined, // Added this line
            xpEarned: (data.items?.length || data.purchasedItems || data.itemCount || 0) * 50, // 50 XP por item, usando a mesma lógica de contagem
            items: data.items || [],
          })
        } else {
          // Se não conseguir buscar da API, usar dados da URL
          setTransactionData({
            transactionId: txn as string,
            status: (status as string) || "completed" as any,
            purchasedItems: 0,
            failedItems: 0,
            totalAmount: 0,
            paidAmount: 0,
            pendingAmount: Number.parseFloat(pending as string) || 0,
            paymentMethod: "wallet",
            date: new Date().toISOString(),
            completedAt: undefined, // Added this line
            xpEarned: 0,
            items: [],
          })
        }
      } catch (error) {
        console.error("Erro ao buscar dados da transação:", error)
        // Fallback para dados básicos
        setTransactionData({
          transactionId: txn as string,
          status: (status as string) || "completed" as any,
          purchasedItems: 0,
          failedItems: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: Number.parseFloat(pending as string) || 0,
          paymentMethod: "wallet",
          date: new Date().toISOString(),
          xpEarned: 0,
          items: [],
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactionData()
  }, [txn, status, pending])

  const handleCopyTxn = () => {
    if (txn) {
      navigator.clipboard.writeText(txn as string)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleBackToStore = () => {
    router.push(ROUTENVX.market)
  }

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const getStatusInfo = () => {
    if (!transactionData) return { color: "#41b45e", text: "Processando" }

    switch (transactionData.status) {
      case "completed":
        return { color: "#41b45e", text: "Confirmado" }
      case "partial":
        return { color: "#ffc107", text: "Parcial" }
      case "pending":
        return { color: "#ff6b6b", text: "Pendente" }
      default:
        return { color: "#41b45e", text: "Confirmado" }
    }
  }

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <PageContainer>
          <LoadingContainer>
            <MarginImagsx>
              <img src="/icons/market/20250325_192605.webp" alt="novision" width={120} height={120} className="b1" />
              <img src="/icons/market/20250325_192624.webp" alt="novision" width={120} height={120} className="b2" />
            </MarginImagsx>
            <LoadingText>Carregando detalhes da transação...</LoadingText>
          </LoadingContainer>
        </PageContainer>
      </ThemeProvider>
    )
  }

  const statusInfo = getStatusInfo()

  return (
    <ThemeProvider theme={theme}>
      <HeadGlobal Title="Checkout Concluído - #TheNoVision" />
      <PageContainer>
        <BackgroundGlow className="top-left" />
        <BackgroundGlow className="bottom-right" />

        <Header>
          <BackButton onClick={handleBackToStore}>
            <ArrowLeft size={20} />
          </BackButton>
          <div style={{ width: "40px" }} />
        </Header>

        <ContentContainer>
          <SuccessCard>
            <SuccessIconContainer>
              <SuccessIcon status={transactionData?.status}>
                <CheckCircle size={40} color="white" />
              </SuccessIcon>
              <SuccessRing />
            </SuccessIconContainer>

            <SuccessTitle>
              {transactionData?.status === "completed" && "Pagamento Concluído!"}
              {transactionData?.status === "partial" && "Pagamento Parcial Realizado!"}
              {transactionData?.status === "pending" && "Pagamento Pendente"}
            </SuccessTitle>
            <SuccessDescription>
              {transactionData?.status === "completed" &&
                "Sua compra foi processada com sucesso e os itens foram adicionados ao seu inventário."}
              {transactionData?.status === "partial" &&
                `Parte do pagamento foi processada. Valor pago: ${formatCurrency(transactionData.paidAmount)} Bits. Pendente: ${formatCurrency(transactionData.pendingAmount)} Bits.`}
              {transactionData?.status === "pending" &&
                "Sua transação está sendo processada. Você receberá uma notificação quando for concluída."}
            </SuccessDescription>

            <TransactionInfoCard>
              <TransactionHeader>
                <TransactionLabel>ID da Transação</TransactionLabel>
                <TransactionActions>
                  <ActionButton onClick={handleCopyTxn}>
                    {copied ? <CheckIcon size={16} /> : <Copy size={16} />}
                  </ActionButton>
                </TransactionActions>
              </TransactionHeader>
              <TransactionId>{txn}</TransactionId>

              <TransactionDivider />

              <TransactionDetail>
                <DetailLabel>Status</DetailLabel>
                <DetailValue>
                  <StatusBadge status={transactionData?.status || "completed"}>
                    <CheckCircle size={14} />
                    {statusInfo.text}
                  </StatusBadge>
                </DetailValue>
              </TransactionDetail>

              <TransactionDetail>
                <DetailLabel>Data</DetailLabel>
                <DetailValue>{new Date(transactionData?.date || new Date()).toLocaleString("pt-BR")}</DetailValue>
              </TransactionDetail>
              {/* Display Completed At if available and status is completed */}
              {transactionData?.completedAt && transactionData.status === "completed" && (
                <TransactionDetail>
                  <DetailLabel>Concluído em</DetailLabel>
                  <DetailValue>{new Date(transactionData.completedAt).toLocaleString("pt-BR")}</DetailValue>
                </TransactionDetail>
              )}

              <TransactionDetail>
                <DetailLabel>Itens Adquiridos</DetailLabel>
                <DetailValue>
                  {/* Ajuste para pluralização/singularização */}
                  {transactionData?.purchasedItems === 1 ? "1 item" : `${transactionData?.purchasedItems || 0} itens`}
                </DetailValue>
              </TransactionDetail>

        
                <TransactionDetail>
                  <DetailLabel>Itens com Falha</DetailLabel>
                  <DetailValue style={{ color: "#ff6b6b" }}>
                    {/* Ajuste para pluralização/singularização */}
                    {transactionData?.failedItems === 1 ? "1 item" : `${transactionData?.failedItems} itens`}
                  </DetailValue>
                </TransactionDetail>
           
              {/* Itens List */}
              {transactionData?.items && transactionData.items.length > 0 && (
                <>
                  <TransactionDivider />
                  <ItemsListHeader>Detalhes dos Itens</ItemsListHeader>
                  <ItemsList>
                    {transactionData.items.map((item) => (
                      <Item key={item.uid}>
                        <ItemName>{item.name}</ItemName>
                        <ItemPrice>{`${formatCurrency(item.price)} Bits`}</ItemPrice>
                      </Item>
                    ))}
                  </ItemsList>
                </>
              )}

              <TransactionDetail>
                <DetailLabel>Valor Total</DetailLabel>
                <DetailValue className="highlight">
                  {`${formatCurrency(transactionData?.totalAmount || 0)} Bits`}
                </DetailValue>
              </TransactionDetail>

              {transactionData?.paidAmount !== transactionData?.totalAmount && (
                <>
                  <TransactionDetail>
                    <DetailLabel>Valor Pago</DetailLabel>
                    <DetailValue style={{ color: "#41b45e" }}>
                      {`${formatCurrency(transactionData?.paidAmount || 0)} Bits`}
                    </DetailValue>
                  </TransactionDetail>

            
                    <TransactionDetail>
                      <DetailLabel>Valor Pendente</DetailLabel>
                      <DetailValue style={{ color: "#ffc107" }}>
                               {transactionData?.pendingAmount && transactionData.pendingAmount > 0 && `${formatCurrency(transactionData.pendingAmount)} Bits`}
                      </DetailValue>
                    </TransactionDetail>
                 
                </>
              )}

              <TransactionDivider />

              <TransactionDetail>
                <DetailLabel>Método de Pagamento</DetailLabel>
                <DetailValue>
                  <PaymentMethodBadge>
                    {transactionData?.paymentMethod === "wallet" ? (
                      <>
                        <Wallet size={14} />
                        <span>Carteira Digital</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={14} />
                        <span>{transactionData?.cardUsed || "Cartão"}</span>
                      </>
                    )}
                  </PaymentMethodBadge>
                </DetailValue>
              </TransactionDetail>

              <TransactionDetail>
                <DetailLabel>Entrega</DetailLabel>
                <DetailValue>
                  <StatusBadge status="completed">
                    <Package size={14} />
                    Entregue
                  </StatusBadge>
                </DetailValue>
              </TransactionDetail>

              <TransactionDetail>
                <DetailLabel>Tempo de Processamento</DetailLabel>
                <DetailValue>
                  <Clock size={14} style={{ marginRight: "4px" }} />
                  Instantâneo
                </DetailValue>
              </TransactionDetail>
            </TransactionInfoCard>

            {transactionData?.xpEarned && transactionData.xpEarned > 0 && (
              <RewardsCard>
                <RewardsIcon>
                  <Sparkles size={20} color="#41b45e" />
                </RewardsIcon>
                <RewardsContent>
                  <RewardsTitle>Recompensas Ganhas</RewardsTitle>
                  <RewardsValue>+{`${transactionData.xpEarned} XP`}</RewardsValue>
                </RewardsContent>
              </RewardsCard>
            )}

            <ActionButtons>
              <PrimaryButton onClick={handleBackToStore}>Continuar Comprando</PrimaryButton>
            </ActionButtons>
 
          </SuccessCard>
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
font-family: 'Inter', sans-serif;

&::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(65, 180, 94, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(65, 180, 94, 0.05) 0%, transparent 50%);
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
  background: #41b45e;
  opacity: 0.03;
  border-radius: 50%;
  filter: blur(150px);
}

&.bottom-right {
  right: 0;
  top: 30%;
  height: 400px;
  width: 400px;
  background: #41b45e;
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
display: flex;
align-items: center;
justify-content: space-between;
padding: 1.5rem;
z-index: 10;
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

const SuccessCard = styled.div`
max-width: 500px;
width: 100%;
border-radius: 24px;
padding: 2rem;
text-align: center;
`

const SuccessIconContainer = styled.div`
position: relative;
display: inline-block;
margin-bottom: 1.5rem;
`

const SuccessIcon = styled.div<{ status?: string }>`
display: flex;
align-items: center;
justify-content: center;
width: 80px;
height: 80px;
border-radius: 50%;
background: ${({ status }) => {
  switch (status) {
    case "partial":
      return "linear-gradient(135deg, #ffc107 0%, #ffb300 100%)"
    case "pending":
      return "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)"
    default:
      return "linear-gradient(135deg, #41b45e 0%, #34a04f 100%)"
  }
}};
box-shadow: ${({ status }) => {
  switch (status) {
    case "partial":
      return "0 10px 25px rgba(255, 193, 7, 0.4)"
    case "pending":
      return "0 10px 25px rgba(255, 107, 107, 0.4)"
    default:
      return "0 10px 25px rgba(65, 180, 94, 0.4)"
  }
}};
animation: ${pulse} 2s infinite ease-in-out;
`

const SuccessRing = styled.div`
position: absolute;
top: -10px;
left: -10px;
right: -10px;
bottom: -10px;
border-radius: 50%;
border: 2px solid #41b45e;
animation: ${ringPulse} 2s infinite;
`

const SuccessTitle = styled.h2`
font-size: 1.5rem;
font-weight: 600;
color: white;
margin-bottom: 0.75rem;
`

const SuccessDescription = styled.p`
color: rgba(255, 255, 255, 0.7);
font-size: 0.95rem;
margin-bottom: 2rem;
line-height: 1.5;
`

const TransactionInfoCard = styled.div`
background: rgba(45, 48, 46, 0.3);

border-radius: 16px;
padding: 1.5rem;
margin-bottom: 1.5rem;
text-align: left;
`

const TransactionHeader = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 0.5rem;
`

const TransactionLabel = styled.span`
font-size: 0.85rem;
color: rgba(255, 255, 255, 0.7);
`

const TransactionActions = styled.div`
display: flex;
gap: 0.5rem;
`

const ActionButton = styled.button`
display: flex;
align-items: center;
justify-content: center;
width: 28px;
height: 28px;
border-radius: 8px;
background: rgba(65, 180, 94, 0.1);
border: 1px solid rgba(65, 180, 94, 0.2);
color: #41b45e;
transition: all 0.3s ease;

&:hover {
  background: rgba(65, 180, 94, 0.2);
  transform: translateY(-2px);
}
`

const TransactionId = styled.div`
font-family: monospace;
font-size: 0.9rem;
color: white;
background: rgba(0, 0, 0, 0.2);
padding: 0.75rem;
border-radius: 8px;
overflow: hidden;
text-overflow: ellipsis;
margin-bottom: 1rem;
`

const TransactionDivider = styled.div`
height: 1px;
background: linear-gradient(90deg, transparent, rgba(65, 180, 94, 0.3), transparent);
margin: 1rem 0;
`

const TransactionDetail = styled.div`
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
display: flex;
align-items: center;

&.highlight {
  color: #41b45e;
  font-weight: 600;
}
`

const StatusBadge = styled.div<{ status: string }>`
display: flex;
align-items: center;
gap: 0.5rem;
padding: 0.25rem 0.75rem;
border-radius: 20px;
font-size: 0.8rem;
font-weight: 500;

${({ status }) => {
  switch (status) {
    case "completed":
      return `
        background: rgba(65, 180, 94, 0.1);
        color: #41b45e;
        border: 1px solid rgba(65, 180, 94, 0.3);
      `
    case "partial":
      return `
        background: rgba(255, 193, 7, 0.1);
        color: #ffc107;
        border: 1px solid rgba(255, 193, 7, 0.3);
      `
    case "pending":
      return `
        background: rgba(255, 107, 107, 0.1);
        color: #ff6b6b;
        border: 1px solid rgba(255, 107, 107, 0.3);
      `
    default:
      return `
        background: rgba(65, 180, 94, 0.1);
        color: #41b45e;
        border: 1px solid rgba(65, 180, 94, 0.3);
      `
  }
}}
`

const PaymentMethodBadge = styled.div`
display: flex;
align-items: center;
gap: 0.5rem;
padding: 0.25rem 0.75rem;
background: rgba(65, 180, 94, 0.1);
border: 1px solid rgba(65, 180, 94, 0.2);
border-radius: 12px;
font-size: 0.8rem;
color: #41b45e;
`

const RewardsCard = styled.div`
display: flex;
align-items: center;
gap: 1rem;
background: rgba(63, 66, 64, 0.1);
border-radius: 16px;
padding: 1rem;
margin-bottom: 2rem;
`

const RewardsIcon = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 40px;
height: 40px;
border-radius: 50%;
background: rgba(65, 180, 94, 0.2);
`

const RewardsContent = styled.div`
flex: 1;
text-align: left;
`

const RewardsTitle = styled.div`
font-size: 0.85rem;
color: rgba(255, 255, 255, 0.7);
margin-bottom: 0.25rem;
`

const RewardsValue = styled.div`
font-size: 1.1rem;
font-weight: 600;
color: #41b45e;
`

const ActionButtons = styled.div`
display: flex;
gap: 1rem;
margin-bottom: 1rem;
`

const PrimaryButton = styled.button`
flex: 1;
padding: 1rem;
background: linear-gradient(135deg, #41b45e 0%, #34a04f 100%);
border: none;
border-radius: 45px;
color: #1a1818;
font-weight: 600;
transition: all 0.3s ease;

&:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(65, 180, 94, 0.4);
}
`

const PendingNote = styled.div`
display: flex;
align-items: flex-start;
gap: 0.75rem;
padding: 1rem;
background: rgba(255, 193, 7, 0.1);
border: 1px solid rgba(255, 193, 7, 0.3);
border-radius: 12px;
font-size: 0.85rem;
color: rgba(255, 255, 255, 0.8);
text-align: left;

svg {
  color: #ffc107;
  margin-top: 0.125rem;
  flex-shrink: 0;
}
`

const ItemsListHeader = styled.div`
font-size: 0.9rem;
color: rgba(255, 255, 255, 0.7);
margin-bottom: 0.75rem;
font-weight: 600;
`

const ItemsList = styled.div`
display: flex;
flex-direction: column;
gap: 0.5rem;
`

const Item = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
padding: 0.5rem 0;
border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
&:last-child {
  border-bottom: none;
}
`

const ItemName = styled.span`
font-size: 0.85rem;
color: white;
flex: 1;
text-align: left;
`

const ItemPrice = styled.span`
font-size: 0.85rem;
color: #41b45e;
font-weight: 500;
`

const LoadingContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 100vh;
`

 

const LoadingText = styled.p`
font-size: 1.1rem;
color: white;
`
