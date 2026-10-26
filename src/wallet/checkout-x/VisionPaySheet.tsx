"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import router from 'next/router';

import {
  Check,
  Loader2,
  Shield,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Copy,
  Zap,
  Lock,
  Star,
  CreditCard,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react"

import { CheckoutStatusDisplay, CheckoutStatusType, CheckoutStatusData } from "./CheckoutStatusDisplay"

interface Card {
  cardNumber: string
  cardHolder: string
  type: "VisionPay" | "Sapphire" | "VΛULT"
  balance: string
  status: "active" | "frozen" | "suspended" | "limited"
  expiry?: string
  cvv?: string
  createdAt?: string
  autoPaymentEnabled?: boolean
}

interface CheckoutData {
  orderId: string
  totalAmount: number
  itemCount: number
  userBalance: number
  bitsCredits: number
  orbitCredits: number
  hasEnoughBalance: boolean
  items: Array<{
    id: number
    nameitem: string
    priceitem: number
    imagem?: string
    quantity: number
    type?: string
    rarity?: string
  }>
  estimatedDelivery: string
  fees: {
    networkFee: number
    serviceFee: number
    subtotal: number
    total: number
  }
  availableCards: Card[]
}

interface VisionPaySheetProps {
  checkoutData: CheckoutData
  onClose: () => void
  onFinalizePurchase: (paymentMethod: string, cardId?: string) => Promise<void>
  statusOverride?: "success" | "error" | "pending" | "cancelled" | null
  statusDataOverride?: Partial<CheckoutStatusData>
}

const VisionPaySheet: React.FC<VisionPaySheetProps> = ({ checkoutData, onClose, onFinalizePurchase, statusOverride, statusDataOverride }) => {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [securityChecks, setSecurityChecks] = useState<string[]>([])
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Novos estados para seleção de pagamento
  const [paymentType, setPaymentType] = useState<"wallet" | "card">("wallet")
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [showCardSelection, setShowCardSelection] = useState(false)

  // Novo estado para status controlado
  const [checkoutStatus, setCheckoutStatus] = useState<"success" | "error" | "pending" | "cancelled" | "completed" | null>(statusOverride || null)
  const [checkoutStatusData, setCheckoutStatusData] = useState<Partial<CheckoutStatusData>>(statusDataOverride || {})

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const formatCurrency = (value: number): string => {
         if (value === undefined || value === null || isNaN(value)) {
    return '•••'; 
  }
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Calcular saldo total disponível (wallet + cartões)
  const getTotalAvailableBalance = () => {
    let total = checkoutData.userBalance + checkoutData.bitsCredits + checkoutData.orbitCredits

    checkoutData.availableCards.forEach((card) => {
      if (card.status === "active") {
        const cardBalance = Number.parseFloat(card.balance.replace(/[$,]/g, "")) || 0
        total += cardBalance
      }
    })

    return total
  }

  const totalAvailable = getTotalAvailableBalance()
  const canProcessPayment = totalAvailable > 0 // Sempre permite se houver algum saldo

  // Handle payment processing
  const handlePayment = async () => {
    setStep(2)
    setError(null)

    // Simulate security checks with staggered timing
    setTimeout(() => {
      setSecurityChecks(["Verificando método de pagamento..."])

      setTimeout(() => {
        setSecurityChecks((prev) => [
          ...prev,
          paymentType === "wallet" ? "Confirmando saldo da carteira..." : `Validando cartão ${selectedCard?.type}...`,
        ])

        setTimeout(() => {
          setSecurityChecks((prev) => [...prev, "Validando transação..."])

          setTimeout(() => {
            setSecurityChecks((prev) => [...prev, "Processando pagamento..."])
            setProcessing(true)
          }, 800)
        }, 600)
      }, 500)
    }, 800)

    // Start payment processing
    setTimeout(async () => {
      try {
        // Simulate progress
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval)
              return 90
            }
            return prev + 8
          })
        }, 150)

        // Call the actual payment API
        if (paymentType === "card" && selectedCard) {
          await onFinalizePurchase("card", selectedCard.cardNumber)
        } else {
          await onFinalizePurchase("wallet")
        }

        // Complete the progress
        clearInterval(interval)
        setProgress(100)

        // Generate mock transaction ID (in real app, this would come from API response)
        const mockTxId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        setTransactionId(mockTxId)

        setTimeout(() => {
          setCompleted(true)
          setShowConfetti(true)
 
        }, 800)

          
      } catch (err: any) {
        setError(err.message || "Erro ao processar pagamento")
        setProcessing(false)
        setProgress(0)
      } 
    }, 4500)
  }

  const handleCopyTxId = () => {
    if (transactionId) {
      navigator.clipboard.writeText(transactionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Enhanced confetti animation (mantido do código original)
  useEffect(() => {
    if (showConfetti && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const confettiPieces: Array<{
        x: number
        y: number
        size: number
        color: string
        speed: number
        angle: number
        rotation: number
        rotationSpeed: number
        shape: "circle" | "square" | "triangle"
      }> = []

      const colors = ["#41b45e", "#34a04f", "#FFFFFF", "#FFD700", "#FF6B6B", "#4ECDC4"]

      for (let i = 0; i < 200; i++) {
        confettiPieces.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 100,
          y: canvas.height / 2 + (Math.random() - 0.5) * 100,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 6 + 3,
          angle: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: Math.random() * 0.3 - 0.15,
          shape: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)] as "circle" | "square" | "triangle",
        })
      }

      let animationFrameId: number
      const startTime = Date.now()

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const elapsed = Date.now() - startTime
        if (elapsed > 4000) {
          cancelAnimationFrame(animationFrameId)
          return
        }

        confettiPieces.forEach((piece) => {
          piece.x += Math.cos(piece.angle) * piece.speed
          piece.y += Math.sin(piece.angle) * piece.speed + 0.8 // gravity
          piece.rotation += piece.rotationSpeed

          // Fade out based on time
          const alpha = Math.max(0, 1 - elapsed / 4000)

          ctx.save()
          ctx.translate(piece.x, piece.y)
          ctx.rotate(piece.rotation)
          ctx.fillStyle =
            piece.color +
            Math.floor(alpha * 255)
              .toString(16)
              .padStart(2, "0")

          if (piece.shape === "circle") {
            ctx.beginPath()
            ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2)
            ctx.fill()
          } else if (piece.shape === "square") {
            ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size)
          } else {
            // Triangle
            ctx.beginPath()
            ctx.moveTo(0, -piece.size / 2)
            ctx.lineTo(-piece.size / 2, piece.size / 2)
            ctx.lineTo(piece.size / 2, piece.size / 2)
            ctx.closePath()
            ctx.fill()
          }

          ctx.restore()
        })

         
        animationFrameId = requestAnimationFrame(animate)
      }

      animate()
   
      return () => {
        
        cancelAnimationFrame(animationFrameId)
      }
    }

  }, [showConfetti,completed])

  // Se statusOverride for passado, sempre priorizar ele
  useEffect(() => {
    if (statusOverride) {
      setCheckoutStatus(statusOverride)
      setCheckoutStatusData(statusDataOverride || {})
    }
  }, [statusOverride, statusDataOverride])

  // Exibir status se existir
  if (checkoutStatus) {
    // Ao invés de exibir o status, mostrar apenas um loading de redirecionamento
    return (
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <PaySheet
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem'}}>
            <Loader2 size={48} className="animate-spin" color="#41b45e" />
            <span style={{color: '#fff', fontSize: '1.1rem', fontWeight: 500}}>Estamos redirecionando você...</span>
          </div>
        </PaySheet>
      </Overlay>
    )
  }
const getIsOrbitCard = (card: Card | null) => card?.type === "VisionPay"
const getOrbitTotal = (bits: number) => bits * 100
 
// Calcule o valor a ser pago em Orbs se for Orbitcredit
const isOrbitSelected = paymentType === "card" && getIsOrbitCard(selectedCard)
const orbitTotal = isOrbitSelected ? getOrbitTotal(checkoutData.fees.total) : 0
const realCards = checkoutData.availableCards.filter(
  (card) => card.type === "VisionPay" || card.type === "Sapphire" || card.type === "VΛULT"
)
  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {showConfetti && (
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }} />
      )}

      <PaySheet
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
      >
      
        <MobileHandle>
          <HandleBar />
        </MobileHandle>

        <SheetHeader>
          <HeaderLeft></HeaderLeft>

          <HeaderCenter>
            <HeaderTitle>
              <img src="/icons/brand/nvrp_pay.webp" alt="VisionPay" height={24} />
            </HeaderTitle>
          </HeaderCenter>

          <HeaderRight>
            <StepIndicator>
              <StepDot active={step >= 1} completed={step > 1} />
              <StepLine active={step >= 2} />
              <StepDot active={step >= 2} completed={step > 2} />
              <StepLine active={step >= 3} />
              <StepDot active={step >= 3} completed={completed} />
            </StepIndicator>
          </HeaderRight>
        </SheetHeader>

        <ContentWrapper>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepContainer
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepHeader>
                  
                  <StepTitle>Confirmar Pagamento</StepTitle>
                 
                </StepHeader>

       
 
                <PaymentMethodSelection>
                 
                  
                  <PaymentOption
                    selected={paymentType === "wallet"}
                    onClick={() => setPaymentType("wallet")}
                    
                  >
                    <PaymentOptionHeader>
                      <PaymentOptionInfo>
                        <PaymentOptionIcon>
                          <Wallet size={20} />
                        </PaymentOptionIcon>
                        <PaymentOptionDetails>
                          <PaymentOptionName>Saldo da carteira</PaymentOptionName>
                          <PaymentOptionBalance>
                            Saldo: {formatCurrency(checkoutData.userBalance)} Bits
                          </PaymentOptionBalance>
                        </PaymentOptionDetails>
                      </PaymentOptionInfo>
                      <RadioIndicator selected={paymentType === "wallet"}>
                        <div className="inner-circle" />
                      </RadioIndicator>
                    </PaymentOptionHeader>
                  </PaymentOption>

                  {/* Opção Cartão de Crédito */}
                  {realCards.length > 0 && (
                    <PaymentOption
                      selected={paymentType === "card"}
                      onClick={() => setPaymentType("card")}
           
                    >
                      <PaymentOptionHeader>
                        <PaymentOptionInfo>
                          <PaymentOptionIcon>
                            <CreditCard size={20} />
                          </PaymentOptionIcon>
                          <PaymentOptionDetails>
                            <PaymentOptionName>Cartão de Crédito</PaymentOptionName>
                            <PaymentOptionBalance>
                              {checkoutData.availableCards.length} cartão disponível
                            </PaymentOptionBalance>
                          </PaymentOptionDetails>
                        </PaymentOptionInfo>
                        <PaymentOptionActions>
                          <RadioIndicator selected={paymentType === "card"}>
                            <div className="inner-circle" />
                          </RadioIndicator>
                          {paymentType === "card" && (
                            <ExpandButton
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowCardSelection(!showCardSelection)
                              }}
                            >
                              {showCardSelection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </ExpandButton>
                          )}
                        </PaymentOptionActions>
                      </PaymentOptionHeader>

                      {/* Seleção de Cartão */}
                      <AnimatePresence>
                        {paymentType === "card" && showCardSelection && (
                          <CardSelectionContainer
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CardSelectionTitle>Selecione um cartão:</CardSelectionTitle>
                            <CardsList>
                              {checkoutData.availableCards.map((card) => (
                                <CardOption
                                  key={card.cardNumber}
                                  selected={selectedCard?.cardNumber === card.cardNumber}
                                  onClick={() => setSelectedCard(card)}
                                  disabled={card.status !== "active"}
                                  whileHover={{ scale: card.status === "active" ? 1.02 : 1 }}
                                  whileTap={{ scale: card.status === "active" ? 0.98 : 1 }}
                                >
                                  <VisionCardFace>
                                   
                                   <div className="flex gap-2 ">
                                      <VisionCard variant={card.type} status={card.status}>
                                      <CardBackground variant={card.type} />
                                      {card.status === "frozen" && <CardOverlay />}
                                      <CardContent>
                                        <CardHeader>
                                          
                                          <CardLogo>VISION</CardLogo>
                                        </CardHeader>
                                 
                                      </CardContent>
                                    </VisionCard>
                                     <ul className="flex flex-col gap-2">
                                     <CardType>{card.cardHolder} {card.expiry}</CardType>    
                                     <CardHolder>{card.type} / {card.cardNumber && card.cardNumber.length > 10
    ? card.cardNumber.slice(0, 0) + '•••• ' + card.cardNumber.slice(-4)
    : card.cardNumber || '----'} </CardHolder>
                                    </ul>
                                   </div>
                                    

                                        <span className="relative right-1 top-0 gap-1 flex flex-col">
                                         <CardStatusIndicator status={card.status}>
                                            {card.status === "frozen" && <Lock size={16} />}
                                            {card.status === "active" && <Shield size={16} />}
                                            {card.status === "suspended" && <AlertTriangle size={16} />}
                                          </CardStatusIndicator>

                                           {selectedCard?.cardNumber === card.cardNumber && (
                                    <SelectedIndicator>
                                      <Check size={16} />
                                    </SelectedIndicator>
                                  )}
                                      </span>
                                  </VisionCardFace>
                                  
                                </CardOption>
                              ))}
                            </CardsList>
                          </CardSelectionContainer>
                        )}
                      </AnimatePresence>
                    </PaymentOption>
                  )}
                </PaymentMethodSelection>

               
               
               <div className="absolute gap-7 flex flex-col left-0 justify-center items-center  right-0 bottom-1 w-full  ">
  <PaymentButton
                  whileHover={canProcessPayment ? { scale: 1.01 } : {}}
                  whileTap={canProcessPayment ? { scale: 0.99 } : {}}
                  onClick={canProcessPayment ? handlePayment : undefined}
                  disabled={!canProcessPayment || (paymentType === "card" && !selectedCard)}
                  canProcess={canProcessPayment}
                >
                  <span className="background-overlay"></span>
                  <span className="button-content">
                    {!canProcessPayment ? (
      <>
        Sem Saldo Disponível
        <AlertCircle size={16} />
      </>
    ) : paymentType === "card" && !selectedCard ? (
      <>
        Selecione um Cartão
        <CreditCard size={16} />
      </>
    ) : isOrbitSelected ? (
      <>
        Pagar {formatCurrency(orbitTotal)} Orbs
        <CreditCard size={16} />
      </>
    ) : (
      <>
        Pagar {formatCurrency(checkoutData.fees.total)} Bits
        {paymentType === "wallet" ? <Wallet size={16} /> : <CreditCard size={16} />}
      </>
    )}
                  </span>
                </PaymentButton>

                
                {error && (
                  <ErrorAlert initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </ErrorAlert>
                )}

                <SecurityFooter>
                  <SecurityIcon>
                    <Lock size={14} />
                  </SecurityIcon>
                  <SecurityText>
                    Transação via{" "}
                    {paymentType === "wallet" ? "carteira digital" : `cartão ${selectedCard?.type || "Vision"}`}
                  </SecurityText>
                </SecurityFooter>
               </div>
              </StepContainer>
            )}

            {/* Steps 2 e 3 mantidos do código original */}
            {step === 2 && !completed && (
              <StepContainer
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepHeader>
                  <StepIcon processing>
                    <Loader2 size={24} className="animate-spin" />
                  </StepIcon>
                  <li>
                     <StepTitle>Processando Pagamento</StepTitle>
                  <StepDescription>
                    Verificando e processando sua transação via{" "}
                    {paymentType === "wallet" ? "Saldo da carteira" : `cartão ${selectedCard?.type}`}
                  </StepDescription>
                  </li>
                </StepHeader>

                {!processing && (
                  <SecurityChecksContainer>
                    <AnimatePresence>
                      {securityChecks.map((check, index) => {
                        const checkData = {
                          "Verificando método de pagamento...": {
                            title: "Verificando Método",
                            subtitle: `Validando ${paymentType === "wallet" ? "Saldo da carteira" : "cartão de crédito"}`,
                          },
                          "Confirmando saldo da carteira...": {
                            title: "Confirmando Saldo",
                            subtitle: "Verificando fundos na carteira",
                          },
                          [`Validando cartão ${selectedCard?.type}...`]: {
                            title: "Validando Cartão",
                            subtitle: `Verificando cartão ${selectedCard?.type}`,
                          },
                          "Validando transação...": {
                            title: "Validando Transação",
                            subtitle: "Checando dados da compra",
                          },
                          "Processando pagamento...": {
                            title: "Processando Pagamento",
                            subtitle: "Executando transferência",
                          },
                        }[check] || { title: check, subtitle: "Processando..." }

                        return (
                          <SecurityCheckItem
                            key={check}
                            initial={{ opacity: 0, x: -20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.15 }}
                          >
                            <CheckIconContainer
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", damping: 10, stiffness: 100, delay: index * 0.15 + 0.2 }}
                            >
                              <CheckCircle2 size={16} />
                              <CheckIconRing
                                initial={{ scale: 1, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: [0, 1, 0] }}
                                transition={{ duration: 1, delay: index * 0.15 + 0.3 }}
                              />
                            </CheckIconContainer>

                            <CheckText>
                              <CheckTitle>{checkData.title}</CheckTitle>
                              <CheckSubtitle>{checkData.subtitle}</CheckSubtitle>
                            </CheckText>

                            <CheckStatus
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.15 + 0.4 }}
                            >
                              <CheckCircle2 size={12} />
                              <span>Concluído</span>
                            </CheckStatus>
                          </SecurityCheckItem>
                        )
                      })}
                    </AnimatePresence>
                  </SecurityChecksContainer>
                )}



                {processing && (
                  <>
                  <OrderSummary>
                  <SummaryHeader>
                    <SummaryTitle>Resumo do Pedido</SummaryTitle>
                    <SummaryBadge>
                      <Package size={12} />
                      <span>
                        {checkoutData.itemCount} {checkoutData.itemCount === 1 ? "item" : "itens"}
                      </span>
                    </SummaryBadge>
                  </SummaryHeader>

                  <SummaryItems>
                    {checkoutData.items.slice(0, 2).map((item, index) => (
                      <SummaryItem key={`${item.id}-${index}`}>
                        <ItemImageContainer>
                          <ItemImage src={item.imagem || "/placeholder.svg?height=48&width=48"} alt={item.nameitem} />
                          <ItemImageGlow />
                        </ItemImageContainer>
                        <ItemInfo>
                          <ItemName>{item.nameitem}</ItemName>
                          <ItemDetails>
                            <ItemPrice>{item.priceitem} Bits</ItemPrice>
                            <ItemQuantity>×{item.quantity}</ItemQuantity>
                          </ItemDetails>
                        </ItemInfo>
                        <ItemTotal>{(item.priceitem * item.quantity).toFixed(0)} Bits</ItemTotal>
                      </SummaryItem>
                    ))}
                    {checkoutData.items.length > 2 && (
                      <MoreItemsIndicator>
                        <span>+{checkoutData.items.length - 2} mais itens</span>
                      </MoreItemsIndicator>
                    )}
                  </SummaryItems>

                  <SummaryBreakdown>
                    <BreakdownRow>
                      <span>Subtotal</span>
                      <span>{formatCurrency(checkoutData.fees.subtotal)} Bits</span>
                    </BreakdownRow>
                    <BreakdownRow>
                      <span>Taxa de rede</span>
                      <span>{formatCurrency(checkoutData.fees.networkFee)} Bits</span>
                    </BreakdownRow>
                    <BreakdownRow>
                      <span>Taxa de serviço</span>
                      <span>{formatCurrency(checkoutData.fees.serviceFee)} Bits</span>
                    </BreakdownRow>
                  <TotalRow>
  <TotalLabel>Total</TotalLabel>
  <TotalAmount>
    {isOrbitSelected
      ? `${formatCurrency(orbitTotal)} Orbs`
      : `${formatCurrency(checkoutData.fees.total)} Bits`}
  </TotalAmount>
</TotalRow>
                  </SummaryBreakdown>
                </OrderSummary>
                 
                  <ProcessingSection
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >

                      
                    <ProcessingAnimation>
                      <AnimatedDots>
                        {[0, 1, 2].map((i) => (
                          <Dot
                            key={i}
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                              duration: 0.8,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </AnimatedDots>
                      <ProcessingText>Processando na blockvision...</ProcessingText>
                    </ProcessingAnimation>

                    <NetworkStatus
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <NetworkIcon
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Zap size={10} />
                      </NetworkIcon>
                      <span>{paymentType === "wallet" ? "Wallet" : selectedCard?.type} • Velocidade: Rápida</span>
                    </NetworkStatus>
                  </ProcessingSection>
                    </>
                )}

                {error && (
                  <ErrorAlert initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </ErrorAlert>
                )}
              </StepContainer>
            )}

            {completed && (
              <StepContainer
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <CheckoutStatusDisplay
                  status={error ? "error" : "success"}
                  data={{
                    transactionId: transactionId || checkoutData.orderId,
                    status: "completed",
                    purchasedItems: checkoutData.itemCount,
                    failedItems: 0,
                    totalAmount: checkoutData.fees.total,
                    paidAmount: checkoutData.fees.total,
                    pendingAmount: 0,
                    paymentMethod: paymentType,
                    cardUsed: selectedCard?.type,
                    date: new Date().toISOString(),
                    xpEarned: checkoutData.itemCount * 50,
                    errorMessage: error || undefined,
                  }}
                  onBackToStore={onClose}
                  onRetry={handlePayment}
                />
              </StepContainer>
            )}
          </AnimatePresence>
        </ContentWrapper>
      </PaySheet>
    </Overlay>
  )
}

export default VisionPaySheet

// Componentes de Cartão do EnhancedVisionCard
const VisionCardFace = styled.div`
  width: 100%;
  display: flex;
  align-items: top;
  justify-content: space-between;
  gap: 8px;
  height: 100%;
  padding: 0.5em;
  border-radius: 12px;
  background-color: rgba(94, 97, 95, 0.11);
`

const VisionCard = styled.div<{ variant: "VisionPay" | "Sapphire" | "VΛULT"; status?: string }>`
  position: relative;
  height: 45px;
  width: 80px;
  border-radius: 6px;
  padding: 5px 8px;
 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease;
  overflow: hidden;

  ${({ status }) =>
    status === "frozen" &&
    `
    filter: grayscale(0.5);
    opacity: 0.8;
  `}

  ${({ variant }) => {
    switch (variant) {
      case "VisionPay":
        return `
          background: #635bd3;
          color: #d3d8dd;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-size: 200% 200%;
            animation: shimmer 5s infinite linear;
          
            pointer-events: none;
          }
        `
      case "Sapphire":
        return `
          background: linear-gradient(135deg, #308d69 0%, #2D2A37 100%);
          color: #d3d8dd;
        `
      case "VΛULT":
        return `
          background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 20%, #444444 40%, #1a1a1a 60%, #2c2c2c 80%, #1a1a1a 100%);
          color: #ffffff;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.05) 45%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 55%, transparent 100%);
            background-size: 200% 200%;
            animation: shimmer 5s infinite linear;
         
            pointer-events: none;
          }
        `
      default:
        return ""
    }
  }}

  @keyframes shimmer {
    0% { background-position: -200% -200%; }
    100% { background-position: 200% 200%; }
  }
`

const CardBackground = styled.div<{ variant: "VisionPay" | "Sapphire" | "VΛULT" }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.1;

  ${({ variant }) => {
    switch (variant) {
      case "VisionPay":
        return `
          background-image: 
            repeating-linear-gradient(45deg, rgba(105, 102, 153, 0.05) 0px, rgba(56, 52, 90, 0.05) 2px, transparent 2px, transparent 4px),
            radial-gradient(circle at 50% 50%, rgba(104, 82, 153, 0.8) 10%, transparent 50%);
          opacity: 0.2;
        `
      case "Sapphire":
        return `
          opacity: 0.2;
        `
      case "VΛULT":
        return `
          background-image: 
            repeating-linear-gradient(45deg, rgba(19, 17, 17, 0.05) 0px, rgba(21, 21, 22, 0.05) 2px, transparent 2px, transparent 4px),
            radial-gradient(circle at 50% 50%, rgba(26, 23, 23, 0.2) 10%, transparent 50%);
          opacity: 0.1;
        `
      default:
        return ""
    }
  }}
`

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "BLOQUEADO";
    color: #ef4444;
    font-weight: bold;
    font-size: 0.8rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
`

const CardContent = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
`

const CardType = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
`

const CardStatusIndicator = styled.div<{ status: string }>`
 
  right: 24px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ status }) => {
    switch (status) {
      case "frozen":
        return "rgba(239, 68, 68, 0.2)"
      case "active":
        return "rgba(34, 197, 94, 0.2)"
      case "suspended":
        return "rgba(245, 158, 11, 0.2)"
      default:
        return "rgba(107, 114, 128, 0.2)"
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case "frozen":
        return "#ef4444"
      case "active":
        return "#22c55e"
      case "suspended":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }};
  z-index: 3;
`

const CardLogo = styled.div`
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
`

const CardChip = styled.div`
  width: 40px;
  height: 12px;
  background: linear-gradient(135deg, #585c5a6f 0%, #2b2c2c 100%);
  border-radius: 4px;
  margin: 12px 0;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 80%;
    height: 1px;
    background-color: rgba(236, 232, 232, 0.3);
    left: 10%;
  }

  &::before {
    top: 30%;
  }

  &::after {
    top: 60%;
  }
`

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CardHolder = styled.div`
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #949494;
`

const CardExpiry = styled.div`
  font-size: 0.7rem;
`

// Novos Styled Components para seleção de pagamento
const PaymentMethodSelection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
 
`

const PaymentMethodTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #e5e7eb;
  margin: 0 0 0.5rem 0;
`

const PaymentOption = styled(motion.div)<{ selected: boolean }>`
  background: ${({ selected }) =>
    selected
      ? "linear-gradient(135deg, rgba(65, 180, 94, 0.1) 0%, rgba(65, 180, 94, 0.05) 100%)"
      : "rgba(45, 48, 46, 0.3)"};
  
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: var(--f-cursor-pointer);
   width: 100%;
`

const PaymentOptionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`

const PaymentOptionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`

const PaymentOptionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(65, 180, 94, 0.2) 0%, rgba(65, 180, 94, 0.05) 100%);
  color: #41b45e;
`

const PaymentOptionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const PaymentOptionName = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
`

const PaymentOptionBalance = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`

const PaymentOptionActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const RadioIndicator = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #41b45e;
  padding: 2px;

  .inner-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: ${({ selected }) => (selected ? "#41b45e" : "transparent")};
    transition: background-color 0.3s ease;
  }
`

const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
`

const CardSelectionContainer = styled(motion.div)`
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
`

const CardSelectionTitle = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.75rem;
`

const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const CardOption = styled(motion.div)<{ selected: boolean; disabled: boolean }>`
  position: relative;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "var(--f-cursor-pointer)")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
 
  overflow: hidden;
   
  transition: all 0.3s ease;

`

const SelectedIndicator = styled.div`
  
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #41b45e;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 3;
`

const PaymentButton = styled(motion.button)<{ canProcess: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30vw;
  overflow: hidden;
  border-radius: 46px;
  background: ${(props) =>
    props.canProcess
      ? "linear-gradient(135deg, #313632 0%, #111311 200%)"
      : "linear-gradient(135deg, #5f966d 0%, #171a19 100%)"};
  padding: 1rem 0;
  font-size: 15px;
  
  color: ${(props) => (props.canProcess ? "#cdd4cc" : "#ccc")};
  margin-top: 1.5rem;
  cursor: ${(props) => (props.canProcess ? "var(--f-cursor-pointer)" : "not-allowed")};
  transition: all 0.3s ease;

  .button-content {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    font-family: 'XcSemibold';
    z-index: 1;
    color: #bacec1;
  }

  .background-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(21, 24, 22, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover .background-overlay {
    opacity: ${(props) => (props.canProcess ? 1 : 0)};
  }

  &:disabled {
    transform: none !important;
  }
`

const BalanceInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
`

const BalanceRow = styled.div<{ total?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: ${({ total }) => (total ? "#e5e7eb" : "rgba(255, 255, 255, 0.7)")};
  font-weight: ${({ total }) => (total ? "600" : "400")};

  &:last-child {
    margin-bottom: 0;
  }

  ${({ total }) =>
    total &&
    `
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 0.5rem;
  `}
`

const PaymentMethodUsed = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #e5e7eb;
`

// Mantendo todos os outros styled components do código original...
const Overlay = styled(motion.div)`
 
  font-family: 'Inter', monospace;
   
  @media (min-width: 768px) {
    align-items: center;
  }
`

const ContentWrapper = styled.div`
  padding: 24px;
  max-height: 80vh;
  overflow-y: auto;
  
  
   &::-webkit-scrollbar {
     display: none;
  }

 &::selection{
  display: none;
 }

  `


const   PaySheet = styled(motion.div)`
  
  width: 100%;
  top: 1em;
  width: 100%;
 
  border-radius: 12px;
  overflow: hidden;
 
  @media (max-width: 640px) {
    width: 100%;
  }
  
 
`

const SheetGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, rgba(102, 109, 104, 0.1) 0%, rgba(64, 68, 65, 0.02) 100%);
  pointer-events: none;
`

 
const MobileHandle = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 0 8px;
  
  @media (min-width: 768px) {
    display: none;
  }
`

const HandleBar = styled.div`
  width: 36px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
`

const SheetHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 6px 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
`

const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`

const HeaderCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const HeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
`

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const TitleText = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const StepDot = styled.div<{ active: boolean; completed: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.completed ? "#41b45e" : props.active ? "#41b45e" : "rgba(255, 255, 255, 0.2)")};
  transition: all 0.3s ease;
`

const StepLine = styled.div<{ active: boolean }>`
  width: 12px;
  height: 2px;
  background: ${(props) => (props.active ? "#41b45e" : "rgba(255, 255, 255, 0.2)")};
  border-radius: 1px;
  transition: all 0.3s ease;
`
 
const StepContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  gap: 24px;
 

`

const StepHeader = styled.div`
 display: inline-flex;
  gap: 2em;

`

const StepIcon = styled.div<{ processing?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
 
  border-radius: 50%;
  background: ${(props) =>
    props.processing
      ? "linear-gradient(135deg, #686862 0%, #5e5e5a 100%)"
      : "linear-gradient(135deg, #41b45e 0%, #34a04f 100%)"};
  color: white;
  box-shadow: 0 8px 24px rgba(105, 107, 105, 0.3);
`

const StepTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin: 0 0 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`

const StepDescription = styled.p`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.4;
`

const OrderSummary = styled.div`
  background: rgba(255, 255, 255, 0.03);
  
  border-radius: 16px;
  padding: 20px;
`

const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const SummaryTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0;
`

const SummaryBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(65, 180, 94, 0.1);
  border: 1px solid rgba(65, 180, 94, 0.2);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #41b45e;
`

const SummaryItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ItemImageContainer = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
`

const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ItemImageGlow = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent, rgba(65, 180, 94, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ItemImageContainer}:hover & {
    opacity: 1;
  }
`

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const ItemName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ItemDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ItemPrice = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`

const ItemQuantity = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`

const ItemTotal = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #41b45e;
`

const MoreItemsIndicator = styled.div`
  text-align: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`

const SummaryBreakdown = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
`

const BreakdownRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`

const TotalLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: white;
`

const TotalAmount = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #41b45e;
`

const SecurityChecksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(65, 180, 94, 0.1), transparent);
    animation: shimmer 2s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`

const SecurityCheckItem = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(65, 180, 94, 0.2);
  }
`

const CheckIconContainer = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #41b45e 0%, #34a04f 100%);
  box-shadow: 0 4px 12px rgba(65, 180, 94, 0.3);
`

const CheckIconRing = styled(motion.div)`
  position: absolute;
  inset: -4px;
  border: 2px solid #41b45e;
  border-radius: 50%;
  opacity: 0;
`

const CheckText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const CheckTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: white;
  line-height: 1.2;
`

const CheckSubtitle = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.2;
`

const CheckStatus = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(65, 180, 94, 0.1);
  border: 1px solid rgba(65, 180, 94, 0.2);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #41b45e;
  white-space: nowrap;
`

const ProcessingSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
`

const ProcessingHeader = styled.div`
  text-align: center;
  margin-bottom: 8px;
`

const ProcessingTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0 0 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`

const ProcessingSubtitle = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.4;
`

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ProgressLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`

const ProgressPercentage = styled(motion.span)`
  font-size: 16px;
  font-weight: 700;
  color: #41b45e;
  font-family: 'Inter', monospace;
`

const ProgressBarContainer = styled.div`
  position: relative;
  height: 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
`

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #41b45e 0%, #34a04f 50%, #41b45e 100%);
  border-radius: 6px;
  position: relative;
  box-shadow: 0 2px 8px rgba(65, 180, 94, 0.4);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    border-radius: 6px 6px 0 0;
  }
`

const ProgressGlow = styled(motion.div)`
  position: absolute;
  top: 0;
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  border-radius: 6px;
`

const ProcessingSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ProcessingStep = styled(motion.div)<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${(props) => (props.active ? "rgba(65, 180, 94, 0.05)" : "rgba(255, 255, 255, 0.02)")};
  border-radius: 12px;
  transition: all 0.3s ease;
`

const ProcessingStepIcon = styled(motion.div)<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) =>
    props.completed
      ? "linear-gradient(135deg, #41b45e 0%, #34a04f 100%)"
      : props.active
        ? "linear-gradient(135deg, #e0ebd4 0%, #3ead47 100%)"
        : "rgba(255, 255, 255, 0.1)"};
  color: white;
  font-size: 12px;
  font-weight: 600;
`

const StepText = styled.span<{ active: boolean; completed: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.completed ? "#41b45e" : props.active ? "white" : "rgba(255, 255, 255, 0.6)")};
  transition: color 0.3s ease;
`

const ProcessingAnimation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  margin-top: 8px;
`

const AnimatedDots = styled.div`
  display: flex;
  gap: 4px;
`

const Dot = styled(motion.div)`
  width: 8px;
  height: 8px;
  background: #41b45e;
  border-radius: 50%;
`

const ProcessingText = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`

const NetworkStatus = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(65, 180, 94, 0.1) 0%, rgba(65, 180, 94, 0.05) 100%);
  border-radius: 12px;
  font-size: 13px;
  color: #41b45e;
  font-weight: 500;
`

const NetworkIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #41b45e;
  color: white;
`

const SuccessHeader = styled.div`
  text-align: center;
`

const SuccessIcon = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #41b45e 0%, #34a04f 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(65, 180, 94, 0.3);
`

const SuccessRing = styled(motion.div)`
  position: absolute;
  inset: -8px;
  border: 4px solid #41b45e;
  border-radius: 50%;
  opacity: 0;
`

const SuccessTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin: 0 0 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`

const SuccessDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.4;
`

const TransactionCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
`

const TransactionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const TransactionInfo = styled.div`
  flex: 1;
  text-align: left;
`

const TransactionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0;
`

const TransactionSubtitle = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`

const SuccessBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(65, 180, 94, 0.1);
  border: 1px solid rgba(65, 180, 94, 0.2);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #41b45e;
`

const TransactionDetails = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

const DetailLabel = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`

const DetailValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const TransactionId = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Inter', monospace;
  word-break: break-all;
`

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: scale(1.05);
  }
`

const AmountValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #41b45e;
`

const DeliveryStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`

const RewardsCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(65, 180, 94, 0.05);
  border: 1px solid rgba(65, 180, 94, 0.2);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
`

const RewardsIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #41b45e 0%, #34a04f 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(65, 180, 94, 0.3);
`

const RewardsContent = styled.div`
  flex: 1;
  text-align: left;
  font-family: 'ProximaNova-Italic', sans-serif;
`

const RewardsTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0;
`

const RewardsAmount = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #41b45e;
  font-family: 'ProximaNova-Italic', sans-serif;
`

const RewardsGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(65, 180, 94, 0.1), transparent);
  opacity: 0.3;
  pointer-events: none;
`

const ErrorAlert = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 12px;
  font-size: 14px;
  color: #ff6b6b;
  margin-top: 16px;
`

const SecurityFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
   
  border-radius: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`

const SecurityIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
`

const SecurityText = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`
