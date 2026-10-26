import React, { useState } from "react"
import styled, { keyframes, ThemeProvider } from "styled-components"
import { CheckCircle, Copy, CheckIcon, CreditCard, Wallet, Package, Clock, Sparkles, Loader, AlertCircle, Info } from "lucide-react"

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
    warning: "#ffc107",
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

export type CheckoutStatusType = "success" | "pending" | "error"

export interface CheckoutStatusData {
  transactionId?: string
  status?: string
  purchasedItems?: number
  failedItems?: number
  totalAmount?: number
  paidAmount?: number
  pendingAmount?: number
  paymentMethod?: string
  cardUsed?: string
  date?: string
  xpEarned?: number
  progress?: number
  timeElapsed?: number
  errorMessage?: string
  pendingMessage?: string
  redirectUrl?: string
}

interface CheckoutStatusDisplayProps {
  status: CheckoutStatusType
  data: CheckoutStatusData
  onBackToStore?: () => void
  onRetry?: () => void
  onCheckStatus?: () => void
  isLoading?: boolean
}

// Styled components e animações (idênticos aos das páginas de status)
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`
const ringPulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
`
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
const StatusCard = styled.div`
  max-width: 500px;
  width: 100%;
  border-radius: 24px;
  padding: 2rem;
  text-align: center;
`
const StatusIconContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
`
const StatusIcon = styled.div<{ status: CheckoutStatusType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ status }) => {
    switch (status) {
      case "success":
        return "linear-gradient(135deg, #41b45e 0%, #34a04f 100%)"
      case "pending":
        return "linear-gradient(135deg, #ffc107 0%, #ffb300 100%)"
      case "error":
        return "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)"
      default:
        return "linear-gradient(135deg, #41b45e 0%, #34a04f 100%)"
    }
  }};
  box-shadow: ${({ status }) => {
    switch (status) {
      case "success":
        return "0 10px 25px rgba(65, 180, 94, 0.4)"
      case "pending":
        return "0 10px 25px rgba(255, 193, 7, 0.4)"
      case "error":
        return "0 10px 25px rgba(255, 107, 107, 0.4)"
      default:
        return "0 10px 25px rgba(65, 180, 94, 0.4)"
    }
  }};
  animation: ${pulse} 2s infinite ease-in-out;
`
const StatusRing = styled.div<{ status: CheckoutStatusType }>`
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  border: 2px solid
    ${({ status }) =>
      status === "success"
        ? "#41b45e"
        : status === "pending"
        ? "#ffc107"
        : "#ff6b6b"};
  animation: ${ringPulse} 2s infinite;
`
const StatusTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.75rem;
`
const StatusDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin-bottom: 2rem;
  line-height: 1.5;
`
const TransactionInfoCard = styled.div`
  background: rgba(45, 48, 46, 0.3);
  border: 1px solid rgba(65, 180, 94, 0.2);
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
const StatusBadge = styled.div<{ status: CheckoutStatusType }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  ${({ status }) => {
    switch (status) {
      case "success":
        return `background: rgba(65, 180, 94, 0.1); color: #41b45e; border: 1px solid rgba(65, 180, 94, 0.3);`
      case "pending":
        return `background: rgba(255, 193, 7, 0.1); color: #ffc107; border: 1px solid rgba(255, 193, 7, 0.3);`
      case "error":
        return `background: rgba(255, 107, 107, 0.1); color: #ff6b6b; border: 1px solid rgba(255, 107, 107, 0.3);`
      default:
        return `background: rgba(65, 180, 94, 0.1); color: #41b45e; border: 1px solid rgba(65, 180, 94, 0.3);`
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
  background: rgba(65, 180, 94, 0.08);
  border: 1px solid rgba(65, 180, 94, 0.15);
  border-radius: 14px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
`
const RewardsIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(65, 180, 94, 0.15);
`
const RewardsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`
const RewardsTitle = styled.div`
  font-size: 0.95rem;
  color: #41b45e;
  font-weight: 600;
`
const RewardsValue = styled.div`
  font-size: 1.1rem;
  color: white;
  font-weight: 700;
`
const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
`
const PrimaryButton = styled.button<{ disabled?: boolean }>`
  background: linear-gradient(90deg, #41b45e 0%, #34a04f 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(65, 180, 94, 0.08);
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  &:hover {
    background: linear-gradient(90deg, #34a04f 0%, #41b45e 100%);
  }
`
const SecondaryButton = styled.button`
  background: none;
  color: #41b45e;
  border: 1px solid #41b45e;
  border-radius: 12px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #41b45e;
    color: white;
  }
`
const PendingNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 0.75rem;
  background: rgba(255, 193, 7, 0.05);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 12px;
  font-size: 0.9rem;
  color: #ffc107;
  span {
    color: #ffc107;
  }
` 

export const CheckoutStatusDisplay: React.FC<CheckoutStatusDisplayProps> = ({
  status,
  data,
  onBackToStore,
  onRetry,
  onCheckStatus,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false)

  // Função para parsear query string do redirectUrl
  const parseQueryString = (query?: string) => {
    if (!query) return {}
    let q = query
    if (q.startsWith("?")) q = q.substring(1)
    if (q.startsWith("error?")) q = q.substring(6)
    if (q.startsWith("status?")) q = q.substring(7)
    return Object.fromEntries(q.split("&").map(p => {
      const [k, v] = p.split("=")
      return [decodeURIComponent(k), decodeURIComponent(v || "")]
    }))
  }

  const redirectParams = data.redirectUrl ? parseQueryString(data.redirectUrl) : {}

  const formatCurrency = (value?: number): string => {
    if (value == null) return "-"
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatTime = (seconds?: number): string => {
    if (!seconds) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleCopyTxn = () => {
    if (data.transactionId) {
      navigator.clipboard.writeText(data.transactionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        <ContentContainer>
          <StatusCard>
            <StatusIconContainer>
              <StatusIcon status={status}>
                {status === "success" && <CheckCircle size={40} color="white" />}
                {status === "pending" && <Loader size={40} color="white" />}
                {status === "error" && <AlertCircle size={40} color="white" />}
              </StatusIcon>
              <StatusRing status={status} />
            </StatusIconContainer>
            <StatusTitle>
              {status === "success" && "Pagamento Concluído!"}
              {status === "pending" && "Processando Pagamento"}
              {status === "error" && "Ocorreu um erro"}
            </StatusTitle>
            <StatusDescription>
              {status === "success" && "Sua compra foi processada com sucesso e os itens foram adicionados ao seu inventário."}
              {status === "pending" && (data.pendingMessage || "Sua transação está sendo processada. Isso pode levar alguns instantes.")}
              {status === "error" && (data.errorMessage || "Ocorreu um erro inesperado durante o processamento do pagamento.")}
            </StatusDescription>
            {/* Detalhes da transação */}
            <TransactionInfoCard>
              {data.transactionId && (
                <TransactionHeader>
                  <TransactionLabel>ID da Transação</TransactionLabel>
                  <TransactionActions>
                    <ActionButton onClick={handleCopyTxn}>
                      {copied ? <CheckIcon size={16} /> : <Copy size={16} />}
                    </ActionButton>
                  </TransactionActions>
                </TransactionHeader>
              )}
              {data.transactionId && <TransactionId>{data.transactionId}</TransactionId>}
              {/* Detalhes padrão */}
              {status === "success" && (
                <>
                  <TransactionDivider />
                  <TransactionDetail>
                    <DetailLabel>Status</DetailLabel>
                    <DetailValue>
                      <StatusBadge status="success">
                        <CheckCircle size={14} />Confirmado
                      </StatusBadge>
                    </DetailValue>
                  </TransactionDetail>
                  <TransactionDetail>
                    <DetailLabel>Data</DetailLabel>
                    <DetailValue>{data.date ? new Date(data.date).toLocaleString("pt-BR") : "-"}</DetailValue>
                  </TransactionDetail>
                  <TransactionDetail>
                    <DetailLabel>Itens Adquiridos</DetailLabel>
                    <DetailValue>{data.purchasedItems || 0} itens</DetailValue>
                  </TransactionDetail>
                  {data.failedItems && data.failedItems > 0 && (
                    <TransactionDetail>
                      <DetailLabel>Itens com Falha</DetailLabel>
                      <DetailValue style={{ color: "#ff6b6b" }}>{data.failedItems} itens</DetailValue>
                    </TransactionDetail>
                  )}
                  <TransactionDetail>
                    <DetailLabel>Valor Total</DetailLabel>
                    <DetailValue className="highlight">
                      {formatCurrency(data.totalAmount)} Bits
                    </DetailValue>
                  </TransactionDetail>
                  {data.paidAmount !== data.totalAmount && (
                    <>
                      <TransactionDetail>
                        <DetailLabel>Valor Pago</DetailLabel>
                        <DetailValue style={{ color: "#41b45e" }}>
                          {formatCurrency(data.paidAmount)} Bits
                        </DetailValue>
                      </TransactionDetail>
                      {data.pendingAmount && data.pendingAmount > 0 && (
                        <TransactionDetail>
                          <DetailLabel>Valor Pendente</DetailLabel>
                          <DetailValue style={{ color: "#ffc107" }}>
                            {formatCurrency(data.pendingAmount)} Bits
                          </DetailValue>
                        </TransactionDetail>
                      )}
                    </>
                  )}
                  <TransactionDivider />
                  <TransactionDetail>
                    <DetailLabel>Método de Pagamento</DetailLabel>
                    <DetailValue>
                      <PaymentMethodBadge>
                        {data.paymentMethod === "wallet" ? (
                          <>
                            <Wallet size={14} />
                            <span>Carteira Digital</span>
                          </>
                        ) : (
                          <>
                            <CreditCard size={14} />
                            <span>{data.cardUsed || "Cartão"}</span>
                          </>
                        )}
                      </PaymentMethodBadge>
                    </DetailValue>
                  </TransactionDetail>
                  <TransactionDetail>
                    <DetailLabel>Entrega</DetailLabel>
                    <DetailValue>
                      <StatusBadge status="success">
                        <Package size={14} />Entregue
                      </StatusBadge>
                    </DetailValue>
                  </TransactionDetail>
                  <TransactionDetail>
                    <DetailLabel>Tempo de Processamento</DetailLabel>
                    <DetailValue>
                      <Clock size={14} style={{ marginRight: "4px" }} />Instantâneo
                    </DetailValue>
                  </TransactionDetail>
                </>
              )}
              {status === "pending" && (
                <>
                  <TransactionDetail>
                    <DetailLabel>ID da Transação</DetailLabel>
                    <DetailValue>{data.transactionId}</DetailValue>
                  </TransactionDetail>
                  <TransactionDetail>
                    <DetailLabel>Tempo Decorrido</DetailLabel>
                    <DetailValue>{formatTime(data.timeElapsed)}</DetailValue>
                  </TransactionDetail>
                  <TransactionDetail>
                    <DetailLabel>Tempo Estimado</DetailLabel>
                    <DetailValue>2-5 minutos</DetailValue>
                  </TransactionDetail>
                  {data.totalAmount && data.totalAmount > 0 && (
                    <TransactionDetail>
                      <DetailLabel>Valor Total</DetailLabel>
                      <DetailValue>{formatCurrency(data.totalAmount)} Bits</DetailValue>
                    </TransactionDetail>
                  )}
                  {data.paidAmount && data.paidAmount > 0 && (
                    <TransactionDetail>
                      <DetailLabel>Valor Pago</DetailLabel>
                      <DetailValue style={{ color: "#41b45e" }}>{formatCurrency(data.paidAmount)} Bits</DetailValue>
                    </TransactionDetail>
                  )}
                  {data.pendingAmount && data.pendingAmount > 0 && (
                    <TransactionDetail>
                      <DetailLabel>Valor Pendente</DetailLabel>
                      <DetailValue style={{ color: "#ffc107" }}>
                        {formatCurrency(data.pendingAmount)} Bits
                      </DetailValue>
                    </TransactionDetail>
                  )}
                  <TransactionDetail>
                    <DetailLabel>Método de Pagamento</DetailLabel>
                    <DetailValue>
                      <PaymentMethodBadge>
                        {data.paymentMethod === "wallet" ? (
                          <>
                            <Wallet size={14} />
                            <span>Carteira Digital</span>
                          </>
                        ) : (
                          <>
                            <CreditCard size={14} />
                            <span>{data.cardUsed || "Cartão"}</span>
                          </>
                        )}
                      </PaymentMethodBadge>
                    </DetailValue>
                  </TransactionDetail>
                  <TransactionDetail>
                    <DetailLabel>Status</DetailLabel>
                    <StatusBadge status="pending">
                      <Loader size={14} />Processando
                    </StatusBadge>
                  </TransactionDetail>
                </>
              )}
              {status === "error" && (
                <>
                  {data.transactionId && (
                    <TransactionDetail>
                      <DetailLabel>ID da Transação</DetailLabel>
                      <DetailValue>{data.transactionId}</DetailValue>
                    </TransactionDetail>
                  )}
                  {data.errorMessage && (
                    <TransactionDetail>
                      <DetailLabel>Erro</DetailLabel>
                      <DetailValue style={{ color: "#ff6b6b" }}>{data.errorMessage}</DetailValue>
                    </TransactionDetail>
                  )}
                </>
              )}
              {/* Exibir detalhes do redirectUrl se existir */}
              {data.redirectUrl && (
                <>
                  <TransactionDivider />
                  <TransactionDetail>
                    <DetailLabel>
                      <Info size={14} style={{ marginRight: 4 }} />Detalhes Extras
                    </DetailLabel>
                    <DetailValue></DetailValue>
                  </TransactionDetail>
                  {Object.entries(redirectParams).map(([k, v]) => (
                    <TransactionDetail key={k}>
                      <DetailLabel>{k}</DetailLabel>
                      <DetailValue>{v}</DetailValue>
                    </TransactionDetail>
                  ))}
                </>
              )}
            </TransactionInfoCard>
            {/* Recompensa XP */}
            {status === "success" && data.xpEarned && data.xpEarned > 0 && (
              <RewardsCard>
                <RewardsIcon>
                  <Sparkles size={20} color="#41b45e" />
                </RewardsIcon>
                <RewardsContent>
                  <RewardsTitle>Recompensas Ganhas</RewardsTitle>
                  <RewardsValue>+{data.xpEarned} XP</RewardsValue>
                </RewardsContent>
              </RewardsCard>
            )}
            {/* Botões de ação */}
            <ActionButtons>
              {status === "success" && (
                <PrimaryButton onClick={onBackToStore}>Continuar Comprando</PrimaryButton>
              )}
              {status === "pending" && (
                <>
                  <PrimaryButton onClick={onCheckStatus} disabled={isLoading}>
                    <Loader size={16} />
                    {isLoading ? "Verificando..." : "Verificar Status"}
                  </PrimaryButton>
                  <SecondaryButton onClick={onBackToStore}>Voltar à Loja</SecondaryButton>
                </>
              )}
              {status === "error" && (
                <>
                  <PrimaryButton onClick={onRetry}>Tentar Novamente</PrimaryButton>
                  <SecondaryButton onClick={onBackToStore}>Voltar à Loja</SecondaryButton>
                </>
              )}
            </ActionButtons>
            {/* Notas de pendência */}
            {status === "success" && data.pendingAmount && data.pendingAmount > 0 && (
              <PendingNote>
                <Clock size={16} />
                <span>
                  Você tem um valor pendente de {formatCurrency(data.pendingAmount)} Bits. Complete o pagamento em até 30 dias para evitar cancelamento.
                </span>
              </PendingNote>
            )}
          </StatusCard>
        </ContentContainer>
      </PageContainer>
    </ThemeProvider>
  )
} 