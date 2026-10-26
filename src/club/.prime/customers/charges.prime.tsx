"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import styled from "styled-components"
import { ShoppingCart, Clock } from "iconsax-react"
import Bill from "@/public/icons/bill.png"
import LoadingPageView from "@club/resources/loading/market.loading"
import Image from "next/image"
import axios from "axios"

import { decrypt } from "@/core/security/encryption"
import Scrollmargin from "@club/components/scrollingcard/scroll.xc"
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react"
import Tooltip from "@/components/uls/hover.idex"
import ROUTENVX from "@/routes/routes"
import LogoVision from "@/components/vision/logo"

interface Subscription {
  boleto_url: string
  hosted_invoice_url: string
  boleto_expiration_date: Date
  _id: string
  id: string
  amount_total: number
  created: string
  currency: string
  customer_email: string
  customer_id: string
  payment_status: string
  status_ione: string
  methodpay: string
  method_type: string
  boleto_status: string
  userId: string | null
  type: "stripe"
}

interface CartItem {
  id: number
  nameitem: string
  priceitem: number
  imagem: string
  quantity: number
  type: string | null
  rarity: string
}

interface CheckoutSession {
  orderId: string
  status: string
  createdAt: string
  expiresAt: string
  timeRemaining: number
  totalAmount: number
  totalWithFees: number
  itemCount: number
  cartItems: CartItem[]
  cancelledAt?: string
  cancelReason?: string
  completedAt?: string
  transactionId?: string
  hasEnoughBalance?: boolean
  userBalance?: number
  type: "checkout"
}

type PaymentRecord = Subscription | CheckoutSession

const Billing = ({ email, userId }: { email: string; userId: string }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [checkoutSessions, setCheckoutSessions] = useState<CheckoutSession[]>([])
  const [combinedPayments, setCombinedPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isbutton, setisbutton] = useState<boolean>(false)
  const [mobile, setismobile] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "stripe" | "checkout">("all")
  const [selectedSession, setSelectedSession] = useState<CheckoutSession | null>(null)

  useEffect(() => {
    const updateSiderState = () => {
      if (window.innerWidth > 768) {
        setismobile(false)
      } else {
        setismobile(true)
      }
    }

    updateSiderState()
    window.addEventListener("resize", updateSiderState)

    return () => {
      window.removeEventListener("resize", updateSiderState)
    }
  }, [])

  const router = useRouter()

  useEffect(() => {
    const fetchAllPayments = async () => {
      setisbutton(true)
      setLoading(true)
      setError(null)

      // Inicializar os dois tipos de pagamentos separadamente
      let stripePayments: Subscription[] = []
      let checkoutPayments: CheckoutSession[] = []

      // 1. Buscar Stripe
      try {
        console.log("🔵 Buscando dados do Stripe...")
        const stripeResponse = await axios.get(`/api/stripe/customers/billing/${email}`)
        const stripeData = decrypt(stripeResponse.data.subscriptions)
        const parsedStripeData = JSON.parse(stripeData)

        // Assegurar que o tipo é Subscription[]
        stripePayments = parsedStripeData.map(
          (sub: any): Subscription => ({
            ...sub,
            type: "stripe", // você pode adicionar essa prop ao tipo Subscription se quiser
          }),
        )

        setSubscriptions(stripePayments)
      } catch (err) {
        console.error("❌ Erro ao buscar Stripe:", err)
      }

      // 2. Buscar Checkout
      try {
        console.log("🟡 Buscando sessões do Checkout...")
        const checkoutResponse = await fetch(`/api/trivo/checkout/status_checkout?includeAll=true`)
        const checkoutData = await checkoutResponse.json()

        if (checkoutResponse.ok && checkoutData.success && checkoutData.data) {
          const sessions = checkoutData.data.allSessions || []
          checkoutPayments = sessions.map(
            (session: any): CheckoutSession => ({
              ...session,
              type: "checkout", // idem — você pode adicionar isso no tipo CheckoutSession
            }),
          )

          setCheckoutSessions(checkoutPayments)
        } else {
          console.warn("⚠️ Dados inválidos da API de checkout:", checkoutData)
        }
      } catch (err) {
        console.error("❌ Erro ao buscar Checkout:", err)
      }

      setisbutton(false)
      setLoading(false)
    }

    fetchAllPayments()
  }, [email, userId])

  // Combinar e ordenar todos os pagamentos
  useEffect(() => {
    const combined: PaymentRecord[] = []

    // Adicionar pagamentos Stripe
    subscriptions.forEach((sub) => {
      combined.push(sub)
    })

    // Adicionar sessões de checkout
    checkoutSessions.forEach((session) => {
      combined.push(session)
    })

    // Ordenar por data (mais recente primeiro)
    combined.sort((a, b) => {
      const dateA = a.type === "stripe" ? new Date(a.created) : new Date(a.createdAt)
      const dateB = b.type === "stripe" ? new Date(b.created) : new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })

    setCombinedPayments(combined)
  }, [subscriptions, checkoutSessions])

  // Filtrar pagamentos baseado na aba ativa
  const filteredPayments = combinedPayments.filter((payment) => {
    if (activeTab === "all") return true
    return payment.type === activeTab
  })

  const getCheckoutStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return { text: "Pendente", class: "yellow" }
      case "processing":
        return { text: "Processando", class: "yellow" }
      case "completed":
        return { text: "Completo", class: "green" }
      case "cancelled":
        return { text: "Cancelado", class: "red" }
      case "expired":
        return { text: "Expirado", class: "red" }
      default:
        return { text: status, class: "gray" }
    }
  }

  const getCheckoutIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />
      case "processing":
        return <Clock size={16} />
      case "completed":
        return <CheckCircle size={16} />
      case "cancelled":
        return <XCircle size={16} />
      case "expired":
        return <AlertCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const getCancelReasonDisplay = (reason?: string) => {
    if (!reason) return ""

    switch (reason) {
      case "New checkout initiated":
        return "Nova compra"
      case "User cancelled":
        return "Cancelado pelo usuário"
      case "Payment failed":
        return "Falha no pagamento"
      case "User requested cancellation":
        return "Pelo usuário"
      case "Session expired":
        return "Sessão expirada"
      case "Insufficient balance":
        return "Saldo insuficiente"
      default:
        return reason
    }
  }

  const handlePaymentClick = (payment: PaymentRecord) => {
    if (payment.type === "stripe") {
      const targetUrl = payment.boleto_url || payment.hosted_invoice_url
      if (targetUrl) {
        router.push(targetUrl)
      }
    } else {
      // Para checkout sessions, mostrar detalhes ou retomar
      if (payment.status === "pending") {
        router.push(`${ROUTENVX.checkout}/${payment.orderId}`)
      } else {
        setSelectedSession(payment)
      }
    }
  }

  if (loading) {
    return (
      <>
        <LoadingPageView />
      </>
    )
  }

  const formatCurrency = (num: number): string => {
    if (num === undefined || num === null || isNaN(num)) {
      return "" // Ou tratar o erro conforme apropriado
    }

    if (num >= 1e15) {
      return (num / 1e15).toFixed(num % 1e15 !== 0 ? 1 : 0) + "Q" // Quadrilhões
    } else if (num >= 1e12) {
      return (num / 1e12).toFixed(num % 1e12 !== 0 ? 1 : 0) + "T" // Trilhões
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(num % 1e9 !== 0 ? 1 : 0) + "B" // Bilhões
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(num % 1e6 !== 0 ? 1 : 0) + "M" // Milhões
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(num % 1e3 !== 0 ? 1 : 0) + "K" // Milhares
    } else if (num >= 100) {
      return num.toFixed(0) // Centenas
    } else if (num >= 10) {
      return num.toFixed(0) // Dezenas
    } else {
      return num.toFixed(0) // Unidades
    }
  }

  return (
    <Container>
      <MarginSJ>
        <h2 className="h2">
          Histórico de Pagamentos -<span className="span">TODOS OS PAGAMENTOS</span>
        </h2>
      </MarginSJ>

      {/* Tabs para filtrar tipos de pagamento */}
      <TabContainer>
        <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
          Todos ({combinedPayments.length})
        </TabButton>
        <TabButton active={activeTab === "stripe"} onClick={() => setActiveTab("stripe")}>
          Terceiros ({subscriptions.length})
        </TabButton>
        <TabButton active={activeTab === "checkout"} onClick={() => setActiveTab("checkout")}>
          novision ({checkoutSessions.length})
        </TabButton>
      </TabContainer>

      {mobile ? (
        <>
          <Scrollmargin>
            <ContainerCollum>
              <Contentuser className="bod">
                <h3>Data/Hora</h3>
                <h3>STATUS</h3>
                <h3>PAGAMENTO</h3>
                <h3>TIPO</h3>
                <h3>Valor</h3>
              </Contentuser>

              <MarginScroll>
                {filteredPayments && filteredPayments.length > 0 ? (
                  filteredPayments.map((payment, index) => (
                    <Contentuser
                      key={payment.type === "stripe" ? payment.id : `${payment.orderId}-${index}`}
                      className={
                        (payment.type === "stripe" && (payment.boleto_url || payment.hosted_invoice_url)) ||
                        payment.type === "checkout"
                          ? "bg"
                          : ""
                      }
                      style={{
                        cursor:
                          (payment.type === "stripe" && (payment.boleto_url || payment.hosted_invoice_url)) ||
                          payment.type === "checkout"
                            ? "var(--f-cursor-pointer)"
                            : "default",
                      }}
                      onClick={() => handlePaymentClick(payment)}
                    >
                      <h3>
                        {payment.type === "stripe"
                          ? new Date(payment.created).toLocaleString()
                          : new Date(payment.createdAt).toLocaleString()}
                      </h3>

                      <ul>
                        {payment.type === "stripe" ? (
                          <>
                            <h3
                              className={`h42 ${
                                payment.status_ione === "open"
                                  ? "yellow"
                                  : payment.status_ione === "complete"
                                    ? "green"
                                    : payment.status_ione === "expired"
                                      ? "red"
                                      : "gray"
                              }`}
                            >
                              {payment.status_ione === "open" && "Aberto"}
                              {payment.status_ione === "complete" && "Completo"}
                              {payment.status_ione === "expired" && "Expirado"}
                            </h3>

                            <h3
                              className={`h42 ${
                                payment.payment_status === "paid" ||
                                payment.boleto_status === "paid" ||
                                payment.boleto_status === "succeeded"
                                  ? "green"
                                  : payment.payment_status === "unpaid" ||
                                      payment.boleto_status === "requires_action" ||
                                      payment.boleto_status === "complete"
                                    ? "yellow"
                                    : payment.payment_status === "pending"
                                      ? "yellow"
                                      : "gray"
                              }`}
                            >
                              {payment.payment_status === "paid" ||
                              payment.boleto_status === "paid" ||
                              payment.boleto_status === "succeeded" ||
                              payment.boleto_status === "complete"
                                ? "Pago"
                                : payment.payment_status === "unpaid" || payment.boleto_status === "requires_action"
                                  ? "Pendente"
                                  : payment.payment_status === "pending"
                                    ? "Pendente"
                                    : payment.payment_status === "canceled"
                                      ? "Cancelado"
                                      : "Falhou"}
                            </h3>
                          </>
                        ) : (
                          <>
                            <h3 className={`h42 ${getCheckoutStatusDisplay(payment.status).class}`}>
                              {getCheckoutStatusDisplay(payment.status).text}
                            </h3>
                            {payment.status === "cancelled" && payment.cancelReason && (
                              <CancelReasonBadgeNew3 title={getCancelReasonDisplay(payment.cancelReason)}>
                                <Info size={12} />
                                {getCancelReasonDisplay(payment.cancelReason)}
                              </CancelReasonBadgeNew3>
                            )}
                          </>
                        )}
                      </ul>

                      {payment.type === "stripe" ? (
                        payment.customer_id && payment.customer_id.startsWith("pi") ? (
                          <h3>
                            <img src="/icons/coins/orbit-novision.webp" alt="bits" height={30} width={30} />
                          </h3>
                        ) : payment.status_ione === "undefined" ? (
                          <h3>Expirada</h3>
                        ) : payment.status_ione === "expired" ? (
                          <h3>Expirada</h3>
                        ) : (
                          <h3>
                            <img src="/icons/prime.webp" alt="bits" height={30} width={30} />
                          </h3>
                        )
                      ) : (
                        <>
                          <h3 className="font">CLUB</h3>
                        </>
                      )}

                      <h3>
                        {payment.type === "stripe"
                          ? new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(payment.amount_total / 100)
                          : `$${payment.totalWithFees.toFixed(2)}`}
                      </h3>
                    </Contentuser>
                  ))
                ) : (
                  <CardIS>
                    <Image src={Bill || "/placeholder.svg"} alt="Billing" />
                    <ul>
                      <h3>Não conseguimos encontrar nada aqui!</h3>
                      <p>
                        Nada que pertence a você foi encontrado por aqui. Caso seja um problema abra um ticket suporte e
                        reporte para que possamos arrumar!
                      </p>
                    </ul>
                  </CardIS>
                )}
              </MarginScroll>
            </ContainerCollum>
          </Scrollmargin>
        </>
      ) : (
        <ContainerCollum>
          <Contentuser className="bod">
            <h3>Data/Hora</h3>
            <h3>STATUS</h3>
            <h3>PAGAMENTO</h3>
            <h3>TIPO</h3>
            <h3>Valor</h3>
          </Contentuser>

          <MarginScroll>
            {filteredPayments && filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => (
                <Contentuser
                  key={payment.type === "stripe" ? payment.id : `${payment.orderId}-${index}`}
                  className={
                    (payment.type === "stripe" && (payment.boleto_url || payment.hosted_invoice_url)) ||
                    payment.type === "checkout"
                      ? "bg"
                      : ""
                  }
                  style={{
                    cursor:
                      (payment.type === "stripe" && (payment.boleto_url || payment.hosted_invoice_url)) ||
                      payment.type === "checkout"
                        ? "var(--f-cursor-pointer)"
                        : "default",
                  }}
                  onClick={() => handlePaymentClick(payment)}
                >
                  <h3>
                    {payment.type === "stripe"
                      ? new Date(payment.created).toLocaleString()
                      : new Date(payment.createdAt).toLocaleString()}
                  </h3>

                  <ul>
                    {payment.type === "stripe" ? (
                      <>
                        <h3
                          className={`h42 ${
                            payment.status_ione === "open"
                              ? "yellow"
                              : payment.status_ione === "complete"
                                ? "green"
                                : payment.status_ione === "expired"
                                  ? "red"
                                  : "gray"
                          }`}
                        >
                          {payment.status_ione === "open" && "Aberto"}
                          {payment.status_ione === "complete" && "Completo"}
                          {payment.status_ione === "expired" && "Expirada"}
                        </h3>

                        <h3
                          className={`h42 ${
                            payment.payment_status === "paid" ||
                            payment.boleto_status === "paid" ||
                            payment.boleto_status === "succeeded"
                              ? "green"
                              : payment.payment_status === "unpaid" ||
                                  payment.boleto_status === "requires_action" ||
                                  payment.boleto_status === "complete"
                                ? "yellow"
                                : payment.payment_status === "pending"
                                  ? "yellow"
                                  : "gray"
                          }`}
                        >
                          {payment.payment_status === "paid" ||
                          payment.boleto_status === "paid" ||
                          payment.boleto_status === "succeeded" ||
                          payment.boleto_status === "complete"
                            ? "Pago"
                            : payment.payment_status === "unpaid" || payment.boleto_status === "requires_action"
                              ? "Pendente"
                              : payment.payment_status === "pending"
                                ? "Pendente"
                                : payment.payment_status === "canceled"
                                  ? "Cancelado"
                                  : "Falhou"}
                        </h3>
                      </>
                    ) : (
                      <>
                        <h3 className={`h42 ${getCheckoutStatusDisplay(payment.status).class}`}>
                          {getCheckoutStatusDisplay(payment.status).text}
                        </h3>
                        {payment.status === "cancelled" && payment.cancelReason && (
                          <CancelReasonBadgeNew3 title={getCancelReasonDisplay(payment.cancelReason)}>
                            <Info size={12} />
                            {getCancelReasonDisplay(payment.cancelReason)}
                          </CancelReasonBadgeNew3>
                        )}
                      </>
                    )}
                  </ul>

                  {payment.type === "stripe" ? (
                    payment.customer_id && payment.customer_id.startsWith("pi") ? (
                      <h3>
                        <img src="/icons/coins/orbit-novision.webp" alt="bits" height={30} width={30} />
                      </h3>
                    ) : payment.status_ione === "undefined" ? (
                      <h3>Expirada</h3>
                    ) : payment.status_ione === "expired" ? (
                      <h3>Expirada</h3>
                    ) : (
                      <h3>
                        <img src="/icons/prime.webp" alt="bits" height={30} width={30} />
                      </h3>
                    )
                  ) : (
                    <>
                      <h3 className="font">CLUB</h3>
                    </>
                  )}

                  <h3>
                    {payment.type === "stripe"
                      ? new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(payment.amount_total / 100)
                      : `${formatCurrency(payment.totalWithFees)} Bits`}
                  </h3>
                </Contentuser>
              ))
            ) : (
              <CardIS>
                <Image src={Bill || "/placeholder.svg"} alt="Billing" />
                <ul>
                  <h3>Não conseguimos encontrar nada aqui!</h3>
                  <p>
                    Nada que pertence a você foi encontrado por aqui. Caso seja um problema abra um ticket suporte e
                    reporte para que possamos arrumar!
                  </p>
                </ul>
              </CardIS>
            )}
          </MarginScroll>
        </ContainerCollum>
      )}

      {/* Modal para detalhes da sessão */}
      {selectedSession && (
        <ReceiptModal onClick={() => setSelectedSession(null)}>
          <ReceiptContainer onClick={(e) => e.stopPropagation()}>
            {/* Header do Recibo */}
            <ReceiptHeader>
              
                
                 <LogoVision />
               
              <CloseButton onClick={() => setSelectedSession(null)}>
                <X size={24} />
              </CloseButton>
            </ReceiptHeader>

            {/* Informações do Recibo */}
            <ReceiptInfo>
              <InfoSection>
                <InfoLabel>Número do Pedido</InfoLabel>
                <InfoValue>#{selectedSession.orderId}</InfoValue>
              </InfoSection>

              <InfoSection>
                <InfoLabel>Data de Criação</InfoLabel>
                <InfoValue>
                  {new Date(selectedSession.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </InfoValue>
              </InfoSection>

              <InfoSection>
                <InfoLabel>Status do Pagamento</InfoLabel>
                <StatusBadgeNew className={getCheckoutStatusDisplay(selectedSession.status).class}>
                  {getCheckoutIcon(selectedSession.status)}
                  {getCheckoutStatusDisplay(selectedSession.status).text}
                </StatusBadgeNew>
              </InfoSection>
            </ReceiptInfo>

            {/* Linha divisória */}
            <Divider />

            {/* Detalhes da Transação */}
            <TransactionDetails>
              <SectionTitle>Detalhes da Transação</SectionTitle>

              {selectedSession.completedAt && (
                <DetailRow>
                  <DetailLabel>Completado em</DetailLabel>
                  <DetailValue>
                    {new Date(selectedSession.completedAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </DetailValue>
                </DetailRow>
              )}

              {selectedSession.cancelledAt && (
                <>
                  <DetailRow>
                    <DetailLabel>Cancelado em</DetailLabel>
                    <DetailValue>
                      {new Date(selectedSession.cancelledAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </DetailValue>
                  </DetailRow>
                  {selectedSession.cancelReason && (
                    <DetailRow>
                      <DetailLabel>Motivo do Cancelamento</DetailLabel>
                      <CancelReasonBadgeNew>
                        <Info size={14} />
                        {getCancelReasonDisplay(selectedSession.cancelReason)}
                      </CancelReasonBadgeNew>
                    </DetailRow>
                  )}
                </>
              )}

              {selectedSession.transactionId && (
                <DetailRow>
                  <DetailLabel>ID da Transação</DetailLabel>
                  <TransactionId>{selectedSession.transactionId}</TransactionId>
                </DetailRow>
              )}

              <DetailRow>
                <DetailLabel>Saldo Suficiente</DetailLabel>
                <BalanceStatus className={selectedSession.hasEnoughBalance ? "sufficient" : "insufficient"}>
                  {selectedSession.hasEnoughBalance ? (
                    <>
                      <CheckCircle size={16} />
                      Suficiente
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      Insuficiente
                    </>
                  )}
                </BalanceStatus>
              </DetailRow>
            </TransactionDetails>

            {/* Itens Comprados */}
            {selectedSession.cartItems && selectedSession.cartItems.length > 0 && (
              <>
                <Divider />
                <ItemsSection>
                  <SectionTitle>Itens Comprados ({selectedSession.cartItems.length})</SectionTitle>
                  <ItemsContainer>
                    {selectedSession.cartItems.map((item, index) => (
                      <ItemCard key={index}>
                        <ItemImageContainer>
                          <ItemImageNew src={item.imagem || "/placeholder.svg"} alt={item.nameitem} />
                          <RarityBadge className={item.rarity?.toLowerCase() || "common"}>{item.rarity}</RarityBadge>
                        </ItemImageContainer>

                        <ItemDetailsContainer>
                          <ItemNameNew>{item.nameitem}</ItemNameNew>
                          <ItemMeta>
                            <MetaItem>
                              <span>Qtd:</span>
                              <strong>{item.quantity}</strong>
                            </MetaItem>
                            <MetaItem>
                              <span>Preço Unit:</span>
                              <strong>{formatCurrency(item.priceitem)} Bits</strong>
                            </MetaItem>
                          </ItemMeta>
                        </ItemDetailsContainer>

                        <ItemTotal>{formatCurrency(item.priceitem * item.quantity)} Bits</ItemTotal>
                      </ItemCard>
                    ))}
                  </ItemsContainer>
                </ItemsSection>
              </>
            )}

            {/* Resumo Financeiro */}
            <Divider />
            <FinancialSummary>
              <SectionTitle>Resumo Financeiro</SectionTitle>

              <SummaryRow>
                <SummaryLabel>Subtotal</SummaryLabel>
                <SummaryValue>{formatCurrency(selectedSession.totalAmount)} Bits</SummaryValue>
              </SummaryRow>

              <SummaryRow>
                <SummaryLabel>Taxas de Processamento</SummaryLabel>
                <SummaryValue>
                  {formatCurrency(selectedSession.totalWithFees - selectedSession.totalAmount)} Bits
                </SummaryValue>
              </SummaryRow>

              <SummaryDivider />

              <SummaryRow className="total">
                <SummaryLabel>Total</SummaryLabel>
                <SummaryValue>{formatCurrency(selectedSession.totalWithFees)} Bits</SummaryValue>
              </SummaryRow>
            </FinancialSummary>

            {/* Footer */}
            <ReceiptFooter>
              <FooterText>Este recibo serve como comprovante da sua transação.</FooterText>
              <FooterNote>Em caso de dúvidas, entre em contato com nosso suporte.</FooterNote>
            </ReceiptFooter>
          </ReceiptContainer>
        </ReceiptModal>
      )}
    </Container>
  )
}

export default Billing

// Styled-components originais que estavam faltando
const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;

  @media screen and (max-width: 680px) {
    gap: 8px;
   }
`

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 3rem;

  background: ${(props) => (props.active ? "rgba(65, 180, 94, 0.2)" : "rgba(255, 255, 255, 0.05)")};
  color: ${(props) => (props.active ? "#41b45e" : "#ffffff")};
  font-size: 0.775rem;
  font-weight: 500;
  transition: all 0.3s ease;
font-family: 'Inter',monospace;
  &:hover {
    background: rgba(65, 180, 94, 0.1);
    border-color: #41b45e;
  }


   @media screen and (max-width: 680px) {
    padding: 4px 8px 4px;
   }
`

const CardIS = styled.div`
  width: 100%;
  height: 60vh;
  display: flex; 
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  text-align: center;
  

  img{
   margin-bottom: 0.9em;
  }

   h3{
     font-family: 'XcSemibold', sans-serif;
     color: #9aa09b;
   }

   p{
    font-size: 11px;
    color: #858688;
   }

   ul{
     max-width: 630px;
     
   }
`

const MarginScroll = styled.div`
  width: 100%;
 
  ::-webkit-scrollbar {
    width: 6px;
    display: block;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(19, 19, 20, 0.925);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(57, 58, 61, 0.5);
    border-radius: 12px;
  }

  .bg{
      background-color: rgba(21, 23, 24, 0.212);
    }
`

const ContainerCollum = styled.section`
  width: 100%;
  background-color: #38383b11;
   border: 2px solid rgb(34, 36, 35);
   border-radius: 13px;
   
  .bod {
   background-color: #38383b11;
    border: 1px solid rgb(19, 19, 20);
    border-radius: 13px 13px 0 0;
    display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  }
`

const Contentuser = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  background-color: #38383b11;
  border: 1px solid rgba(33, 33, 36, 0.267);
  padding: 0.4em;

  h3 {
    font-size: 12px;
    font-weight: 400;
    color: #c6c6cc;
    
    margin: 0.5em;
    
    font-family: 'InterSemiBold', sans-serif;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
 
  .green {
    background-color: #285236;
  }

  .red {
    background-color: #61252d;
  }
  .yellow{
    background-color: #4f6125;
  }
  .h42 {
    padding: 0.5em 0.3em 0.5em;
    border-radius: 65px;
    font-weight: 400;
     
    font-family: 'InterSemiBold', sans-serif;
    color: rgb(182, 186, 192);
    transition: 0.8s all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    justify-content:center;
    text-align: center;
    align-items: center;
    gap: 0.25rem;
  }
  

  .font{
    font-family: 'Graffiti', sans-serif;
    color: #2ed185;
    font-size: 12px;
    font-weight: 200;
   
   
  }
  
  ul{
    display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
  gap: 12px;
    width: 40%;
     
   }
`

const MarginSJ = styled.div`
width: 100%;
margin: 0.3em;
display: flex;
align-items: center;
justify-content: space-between;

@media screen and (max-width: 430px) {
 margin: 0;
 }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .h2{
    font-size: 14px;
    font-weight: 400;
    color: #c4c4ce;
    margin: 0.5em;
    font-family: 'XcSemibold', sans-serif;
    display: inline-flex;
    align-items: center;

    .span{
      padding: 0.3em 0.6em 0.3em;
    border-radius: 18px;
    margin: 0.4em;
    background-color: #46474b21;
    font-family: 'XcSemibold', sans-serif;
    color: rgb(16, 209, 90);
     transition: 0.8s all;
     
    }
  }

  
   @media screen and (max-width: 680px) {
     .h2{
      font-size: 13px;
     }

     
   }
`

// Novos styled-components para o Receipt Modal
const ReceiptModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.342);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  font-family: 'InterSemiBold', monospace;
  padding: 1rem;
`

const ReceiptContainer = styled.div`
   background: linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f);

  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 25px 50px -12px rgba(70, 71, 71, 0.226);
  border: 1px solid #212221;

`

const ReceiptHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1em 0.9em;   
  color: white;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(135deg, #242525 0%, #292b2a 100%);
    clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
  }
`

const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const CompanyLogo = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
`

const CompanyDetails = styled.div`
  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    font-family: 'Graffiti', sans-serif;
  }
  
  p {
    margin: 0.25rem 0 0;
    opacity: 0.9;
    font-size: 0.9rem;
  }
`

const CloseButton = styled.button`
  
 
  &:hover {
 
    transform: scale(1.05);
  }
`

const ReceiptInfo = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: #6e706f;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const InfoValue = styled.span`
  font-size: 15px;
   color: #393b3a;
  font-weight: 600;
`

const StatusBadgeNew = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border-radius: 25px;
 font-size: 0.675rem;
  font-weight: 600;
  width: fit-content;
  
  &.green {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
    border: 1px solid #34d399;
  }
  
  &.red {
    background: linear-gradient(135deg, #c73d3d3e 0%, #9920204c 100%);
    color: #da6161;
    
  }
  
  &.yellow {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
    border: 1px solid #fbbf24;
  }
`

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #2e302f 50%, transparent 100%);
  margin: 0 2rem;
`

const TransactionDetails = styled.div`
  padding: 2rem;
`

const SectionTitle = styled.h3`
  margin: 0 0 1.5rem;
  font-size: 17px;
  font-weight: 700;
   color: #6e706f;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 20px;
    background: linear-gradient(135deg, #474945 0%, #bcc4c04b 100%);
    border-radius: 2px;
  }
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #282b2a;
  
  &:last-child {
    border-bottom: none;
  }
`

const DetailLabel = styled.span`
    color: #393b3a;
  font-weight: 500;
`

const DetailValue = styled.span`
  color: #747775;
  font-weight: 600;
`

const CancelReasonBadgeNew = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #d47c4134 0%, #fdb48a2d 100%);
 
  border-radius: 20px;
  font-size: 0.675rem;
  color: #dda481;
  font-weight: 500;
`
const CancelReasonBadgeNew3 = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #c5b45330;
  border-radius: 20px;
  font-size: 0.675rem;
  color: #c4e05c;
  font-weight: 500;
`
const TransactionId = styled.code`
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
  color: #374151;
`

const BalanceStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.675rem;


  &.sufficient {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
    border: 1px solid #34d399;
  }
  
  &.insufficient {
 
    background: linear-gradient(135deg, #c73d3d3e 0%, #9920204c 100%);
    color: #da6161;
 
  }
`

const BalanceStatus3 = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  
  &.sufficient {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
    border: 1px solid #34d399;
  }
  
  &.insufficient {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #991b1b;
    border: 1px solid #f87171;
  }
`
const ItemsSection = styled.div`
  padding: 2rem;
`

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
`

const ItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f);
  border: 1px solid #2b2c2b;
  border-radius: 12px;
  transition: all 0.2s;
  
  
`

const ItemImageContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`

const ItemImageNew = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #2b2c2b;
`

const RarityBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.65rem;
  margin: 0.4em;
  font-weight: 600;
  text-transform: uppercase;
  color: #3c3d3c;
  
`

const ItemDetailsContainer = styled.div`
  flex: 1;
  min-width: 0;
`

const ItemNameNew = styled.div`
  font-weight: 600;
  color: #b2b6bd;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ItemMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
`

const MetaItem = styled.div`
  display: flex;
  gap: 0.25rem;
  
  span {
    color: #6b7280;
  }
  
  strong {
    color: #3a3b3d;
  }
`

const ItemTotal = styled.div`
  font-weight: 700;
  color: #7e8f87;
  font-size: 1rem;
  text-align: right;
`

const FinancialSummary = styled.div`
  padding: 2rem;
   background: linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f);

`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  
  &.total {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2ed185;
    padding-top: 1rem;
  }
`

const SummaryLabel = styled.span`
     color: #393b3a;
  font-weight: 500;
  
  .total & {
    color: #393a3b;
  }
`

const SummaryValue = styled.span`
    color: #393b3a;
  font-weight: 600;
  
  .total & {
    color: #4e9e79;
  }
`

const SummaryDivider = styled.div`
  height: 1px;
  background: #232423;
  margin: 1rem 0;
`

const ReceiptFooter = styled.div`
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #1e1f1e 0%, #212221 100%);
  color: #8a918a;
  font-family: 'ProximaNova-Italic', sans-serif;
`

const FooterText = styled.p`
  margin: 0 0 0.5rem;
  font-weight: 600;
`

const FooterNote = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 0.875rem;
`
