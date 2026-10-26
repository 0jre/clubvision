"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import styled, { keyframes } from "styled-components"
import { motion, AnimatePresence, useAnimationControls } from "framer-motion"
import {
  CircleCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  EyeOff,
  Eye,
  Copy,
  Check,
  Star,
  Lock,
  Unlock,
  Shield,
  Zap,
  ZapOff,
  AlertTriangle,
  X,
  Activity,
} from "lucide-react"
import axios from "axios"
import { InfocardWallet } from "../confirmation/ui/unwallet"
import VPointsDashboard from "./vpoints-dashboard"
import LoadingPageView from "@/resources/loading/market.loading"

interface Card {
  cardNumber: string
  cardHolder: string
  type: "VisionPay" | "Sapphire" | "VΛULT"
  expiry: string
  cvv: string
  balance: string
  status: "active" | "frozen" | "suspended"
  createdAt: string
  autoPaymentEnabled?: boolean
}

const EnhancedVisionCard = () => {
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [showCVV, setShowCVV] = useState(false)
  const [iscard, setisCard] = useState(false)
  const [copy, setcopy] = useState(false)
  const [showVPoints, setShowVPoints] = useState(false)
  const [vPointsData, setVPointsData] = useState<any>(null)

  // Novos estados para funcionalidades
  const [cardLocked, setCardLocked] = useState<{ [cardNumber: string]: boolean }>({})
  const [autoPaymentEnabled, setAutoPaymentEnabled] = useState<{ [cardNumber: string]: boolean }>({})
  const [processingAction, setProcessingAction] = useState<string | null>(null)
  const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const [flippedCards, setFlippedCards] = useState<{ [cardNumber: string]: boolean }>({})

  // Estados para dados adicionais
  const [securityLogs, setSecurityLogs] = useState<any[]>([])
  const [cardTransactions, setCardTransactions] = useState<any[]>([])
  const [showSecurityPanel, setShowSecurityPanel] = useState(false)
  const [showTransactionsPanel, setShowTransactionsPanel] = useState(false)

  const toggleFlip = (cardNumber: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardNumber]: !prev[cardNumber],
    }))
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setcopy(true)
    setTimeout(() => setcopy(false), 2000)
  }

  const showFeedback = (type: "success" | "error", message: string) => {
    setActionFeedback({ type, message })
    setTimeout(() => setActionFeedback(null), 3000)
  }

  const fetchCards = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/activity/wallet/card/visioncard_get")
      const cardsData = res.data.cards || []
      setCards(cardsData)

      // Inicializar estados dos cartões com dados da API
      const lockStates: { [key: string]: boolean } = {}
      const autoPayStates: { [key: string]: boolean } = {}

      cardsData.forEach((card: Card) => {
        lockStates[card.cardNumber] = card.status === "frozen"
        autoPayStates[card.cardNumber] = card.autoPaymentEnabled || false
      })

      setCardLocked(lockStates)
      setAutoPaymentEnabled(autoPayStates)

      setVPointsData({
        vpoints: res.data.stats?.vpoints || 0,
        activities: res.data.stats?.activities || 0,
        bitsCredits: res.data.stats?.bitsCredits || 0,
        orbitCredits: res.data.stats?.orbitCredits || 0,
      })
      setisCard(false)
      setCreating(false)
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao carregar cartões.")
      showFeedback("error", "Erro ao carregar cartões")
    } finally {
      setLoading(false)
    }
  }

  const toggleCardLock = async (cardNumber: string) => {
  const currentCard = cards.find((card) => card.cardNumber === cardNumber)
  if (!currentCard) return

  const action = currentCard.status === "frozen" ? "unfreeze" : "freeze"
  setProcessingAction(`${action}-${cardNumber}`)

  try {
    const response = await axios.post("/api/activity/wallet/card/visioncard_get", {
      action,
      cardId: cardNumber,
    })

    // Atualizar status do cartão localmente com o valor retornado pela API
    setCards((prev) =>
      prev.map((card) =>
        card.cardNumber === cardNumber
          ? { ...card, status: response.data.card?.status || (action === "freeze" ? "frozen" : "active") }
          : card,
      ),
    )

    showFeedback(
      "success",
      response.data.message || `Cartão ${action === "freeze" ? "bloqueado" : "desbloqueado"} com sucesso`,
    )
  } catch (err: any) {
    showFeedback("error", err.response?.data?.message || "Erro ao alterar status do cartão")
    console.error("Erro ao alterar status do cartão:", err)
  } finally {
    setProcessingAction(null)
  }
}

  const toggleAutoPayment = async (cardNumber: string) => {
    const newState = !autoPaymentEnabled[cardNumber]
    setProcessingAction(`autopay-${cardNumber}`)

    try {
      const response = await axios.post("/api/activity/wallet/card/visioncard_get", {
        action: "toggle_autopay",
        cardId: cardNumber,
        autoPaymentEnabled: newState,
      })

      setAutoPaymentEnabled((prev) => ({
        ...prev,
        [cardNumber]: newState,
      }))

      // Atualizar cartão localmente
      setCards((prev) =>
        prev.map((card) => (card.cardNumber === cardNumber ? { ...card, autoPaymentEnabled: newState } : card)),
      )

      showFeedback(
        "success",
        response.data.message || `Pagamentos automáticos ${newState ? "ativados" : "desativados"}`,
      )
    } catch (err: any) {
      showFeedback("error", err.response?.data?.message || "Erro ao alterar configuração de pagamento automático")
      console.error("Erro ao alterar pagamento automático:", err)
    } finally {
      setProcessingAction(null)
    }
  }

  // Buscar logs de segurança
  const fetchSecurityLogs = useCallback(async () => {
    try {
      const response = await axios.get("/api/activity/wallet/card/security")
      return response.data
    } catch (err: any) {
      console.error("Erro ao buscar logs de segurança:", err)
      showFeedback("error", "Erro ao carregar logs de segurança")
      return null
    }
  }, [])

  // Buscar transações do cartão
  const fetchCardTransactions = useCallback(async (cardId?: string, limit = 20) => {
    try {
      const params = new URLSearchParams()
      if (cardId) params.append("cardId", cardId)
      params.append("limit", limit.toString())

      const response = await axios.get(`/api/activity/wallet/card/transactions?${params}`)
      return response.data
    } catch (err: any) {
      console.error("Erro ao buscar transações:", err)
      showFeedback("error", "Erro ao carregar transações")
      return null
    }
  }, [])



  const loadTransactionData = useCallback(
    async (cardId?: string) => {
      const transactions = await fetchCardTransactions(cardId)
      if (transactions) {
        setCardTransactions(transactions.transactions || [])
      }
    },
    [fetchCardTransactions],
  )

  const createCards = () => {
    setCreating(true)
    setisCard(true)
  }

  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const steps = ["Verificando seus dados", "Preparando seu cartão", "Finalizando o processo", "Tudo pronto!"]

  useEffect(() => {
    if (!creating) {
      return
    }
    const timer = setTimeout(() => {
      if (progress < 100) {
        const newProgress = progress + 1
        setProgress(newProgress)

        if (newProgress > 25 && currentStep === 0) {
          setCurrentStep(1)
        } else if (newProgress > 65 && currentStep === 1) {
          setCurrentStep(2)
        } else if (newProgress === 99 && currentStep === 2) {
          setCurrentStep(3)
        } else if (newProgress === 100 && currentStep === 3) {
          createCardsc()
        }
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [progress, currentStep, creating])

  const createCardsc = async () => {
    try {
      const res = await axios.post("/api/activity/wallet/card/visioncard_get", {
        action: "auto_create",
      })
      setCards(res.data.cards || [])
      showFeedback("success", res.data.message || "Cartões criados com sucesso!")
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao solicitar cartão.")
      showFeedback("error", "Erro ao criar cartões")
    }
  }

  const rotateCards = (direction: "left" | "right") => {
    setCards((prevCards) => {
      if (direction === "right") {
        const [first, ...rest] = prevCards
        return [...rest, first]
      } else {
        const last = prevCards[prevCards.length - 1]
        return [last, ...prevCards.slice(0, -1)]
      }
    })
  }

  useEffect(() => {
    fetchCards()
  }, [])

  useEffect(() => {
    if (cards.length > 0) {
      setSelectedCard(cards[1] || cards[0])

      if (currentStep === 3 && progress === 100) {
        setisCard(false)
      }
    }

    if (cards.length === 0) {
      setisCard(true)
    }
  }, [cards, currentStep, progress])

  const [enabled, setEnabled] = useState(false)
  const controls = useAnimationControls()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Canvas animation logic
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    let animationFrameId: number
    let particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
      life: number
      maxLife: number
    }[] = []

    const drawHexagon = (x: number, y: number, size: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const pointX = x + size * Math.cos(angle)
        const pointY = y + size * Math.sin(angle)
        if (i === 0) {
          ctx.moveTo(pointX, pointY)
        } else {
          ctx.lineTo(pointX, pointY)
        }
      }
      ctx.closePath()
    }

    const drawNetwork = () => {
      const centerX = canvas.width / (2 * (window.devicePixelRatio || 1))
      const centerY = canvas.height / (2 * (window.devicePixelRatio || 1))
      const hexSize = 10
      const nodeSize = 3

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = enabled ? "#00B897" : "#333"
      ctx.lineWidth = 1.5
      drawHexagon(centerX, centerY, hexSize)
      ctx.stroke()

      ctx.fillStyle = enabled ? "#00B897" : "#666"
      ctx.beginPath()
      ctx.arc(centerX, centerY, nodeSize, 0, Math.PI * 2)
      ctx.fill()

      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const nodeX = centerX + hexSize * Math.cos(angle)
        const nodeY = centerY + hexSize * Math.sin(angle)

        ctx.fillStyle = enabled ? "#00B897" : "#444"
        ctx.beginPath()
        ctx.arc(nodeX, nodeY, nodeSize - 1, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = enabled ? "rgba(0, 184, 151, 0.6)" : "rgba(102, 102, 102, 0.3)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(nodeX, nodeY)
        ctx.stroke()
      }

      if (enabled) {
        if (Math.random() < 0.1) {
          const startAngle = Math.random() * Math.PI * 2
          const startX = centerX + (hexSize / 2) * Math.cos(startAngle)
          const startY = centerY + (hexSize / 2) * Math.sin(startAngle)

          particles.push({
            x: startX,
            y: startY,
            size: Math.random() * 1.5 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: "#00B897",
            opacity: 0.7,
            life: 0,
            maxLife: 50 + Math.random() * 30,
          })
        }

        particles.forEach((particle, index) => {
          particle.x += particle.speedX
          particle.y += particle.speedY
          particle.life++
          particle.opacity = 0.7 * (1 - particle.life / particle.maxLife)

          ctx.fillStyle = `rgba(0, 184, 151, ${particle.opacity})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()

          if (particle.life >= particle.maxLife) {
            particles.splice(index, 1)
          }
        })
      } else {
        particles = []
      }
    }

    const animate = () => {
      drawNetwork()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [enabled])

  useEffect(() => {
    if (enabled) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5 },
      })
    }
  }, [enabled, controls])

  if (loading) return <><LoadingPageView /></>
  if (error && !cards.length) return <div className="text-red-500 text-center">{error}</div>

  // Mostrar dashboard de V-points
  if (showVPoints) {
    return <VPointsDashboard />
  }

  if (iscard) {
    return (
      <>
        {creating ? (
          <Containerx>
            <Content>
              <Wrapper>
                <Center>
                  {currentStep < 3 ? (
                    <IconWrapper
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <StyledLoader2 />
                    </IconWrapper>
                  ) : (
                    <IconWrapper
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <StyledCircleCheck />
                    </IconWrapper>
                  )}
                </Center>
                <Titlex
                  key={currentStep}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {steps[currentStep]}
                </Titlex>

                <Descriptionx
                  key={`desc-${currentStep}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {currentStep < 3
                    ? "Estamos processando sua solicitação de cartão"
                    : "Seu cartão está pronto para uso"}
                </Descriptionx>

                {currentStep < 3 && (
                  <ProgressWrapper>
                    <ProgressBar>
                      <ProgressIndicator value={progress} />
                    </ProgressBar>
                    <ProgressText>{progress}%</ProgressText>
                  </ProgressWrapper>
                )}

                <div>
                  <CardWrapperx
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <CardIconx>
                      <CreditCard size={32} color="rgba(255, 255, 255, 0.8)" />
                    </CardIconx>
                    <CardContentx>
                      <CardChipx />
                      <CardNumberx />
                      <CardName />
                    </CardContentx>
                  </CardWrapperx>
                </div>

                {currentStep === 3 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Button
                      onClick={() => {
                        setCreating(false)
                        setisCard(false)
                      }}
                    >
                      Continuar para minha carteira
                    </Button>
                  </motion.div>
                )}
              </Wrapper>
            </Content>

            {currentStep < 3 && <Footer>Isso pode levar alguns instantes. Por favor, não feche esta tela.</Footer>}
          </Containerx>
        ) : (
          <InfocardWallet
            description={"Você ainda não possui um cartão Vision"}
            subdescription="Solicite seu cartão agora e desfrute com o VisionPay."
          >
            <RequestButton onClick={createCards} disabled={creating}>
              {creating ? "Solicitando..." : "Solicitar Cartão"}
            </RequestButton>
          </InfocardWallet>
        )}
      </>
    )
  }

  const currentCard = cards[1] || cards[0]
 
  return (
    <CardPricex>
      {/* Feedback de ações */}
      

      <CarouselContainer>
        {cards.map((card: Card, index) => (
          <CardWrapper
            key={card.cardNumber}
            index={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CardContainer onClick={() => toggleFlip(card.cardNumber)}>
              <Flipper flipped={!!flippedCards[card.cardNumber]}>
                {/* Frente */}
                <CardFace>
                  <Card variant={card.type} status={card.status}>
                    <CardBackground variant={card.type} />
                    {card.status === "frozen" && <CardOverlay />}
                    <CardContent>
                      <CardHeader>
                        <CardType>{card.type}</CardType>
                     
                        <CardLogo>VISION</CardLogo>
                      </CardHeader>
                      <CardChip />
                      <CardFooter>
                        <CardHolder>{card.cardHolder}</CardHolder>
                        <CardExpiry>{card.expiry}</CardExpiry>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </CardFace>

                {/* Verso */}
                <CardFace back>
                  <Card variant={card.type} status={card.status}>
                    <CardBackground variant={card.type} />
                    {card.status === "frozen" && <CardOverlay />}
                    <CardContent>
                      <CardHeader2>
                        <CardLogo2>Virtual</CardLogo2>
                            <CardStatusIndicator status={card.status}>
                          {card.status === "frozen" && <Lock size={16} />}
                          {card.status === "active" && <Shield size={16} />}
                          {card.status === "suspended" && <AlertTriangle size={16} />}
                        </CardStatusIndicator>
                      </CardHeader2>
                      <div>
                        <h5>Saldo Cartão</h5>
                        <Value>
                          <CardNumber>{card.balance}</CardNumber>
                        </Value>
                      </div>

                      <div>
                        <h5>Numero do cartão</h5>
                        <Value>
                          <CardNumber>{card.cardNumber}</CardNumber>
                          <Buttoxn
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopy(card.cardNumber)
                            }}
                          >
                            {copy ? <Check size={20} /> : <Copy size={20} />}
                          </Buttoxn>
                        </Value>
                      </div>

                      <div>
                        <CardHolder>CVV</CardHolder>
                        <CardExpiry>
                          <Value>
                            {showCVV ? card.cvv : "•••"}
                            <Buttoxn
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowCVV(!showCVV)
                              }}
                            >
                              {showCVV ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Buttoxn>
                          </Value>
                        </CardExpiry>
                      </div>
                    </CardContent>
                  </Card>
                </CardFace>
              </Flipper>
            </CardContainer>
          </CardWrapper>
        ))}
      </CarouselContainer>
 
      <MarginSlech>
        <LeftButton onClick={() => rotateCards("right")}>
          <ChevronLeft />
        </LeftButton>

        <VPointsDisplay onClick={() => setShowVPoints(true)}>
          <VPointsIcon>
            <Star fill="currentColor" size={16} />
          </VPointsIcon>
        </VPointsDisplay>

        {/* Botão de bloqueio/desbloqueio do cartão */}
        {currentCard && (
 <ActionButton
  onClick={() => toggleCardLock(currentCard.cardNumber)}
  disabled={
    processingAction === `freeze-${currentCard.cardNumber}` ||
    processingAction === `unfreeze-${currentCard.cardNumber}`
  }
  variant={currentCard.status === "frozen" ? "locked" : "unlocked"}
>
  {processingAction === `freeze-${currentCard.cardNumber}` ||
  processingAction === `unfreeze-${currentCard.cardNumber}` ? (
    <Loader2 size={20} className="animate-spin" />
  ) : currentCard.status === "frozen" ? (
    <Lock size={20} />
  ) : (
    <Unlock size={20} />
  )}
</ActionButton>
        )}

        {/* Botão de pagamentos automáticos */}
        {currentCard && (
          <ActionButton
            onClick={() => toggleAutoPayment(currentCard.cardNumber)}
            disabled={processingAction === `autopay-${currentCard.cardNumber}`}
            variant={autoPaymentEnabled[currentCard.cardNumber] ? "enabled" : "disabled"}
          >
            {processingAction === `autopay-${currentCard.cardNumber}` ? (
              <Loader2 size={20} className="animate-spin" />
            ) : autoPaymentEnabled[currentCard.cardNumber] ? (
              <Zap size={20} />
            ) : (
              <ZapOff size={20} />
            )}
          </ActionButton>
        )}

     

        {/* Botão de transações */}
        {currentCard && (
          <ActionButton
            onClick={() => {
              setShowTransactionsPanel(!showTransactionsPanel)
              if (!showTransactionsPanel) {
                loadTransactionData(currentCard.cardNumber)
              }
            }}
            variant="transactions"
          >
            <Activity size={20} />
          </ActionButton>
        )}

      

        <RightButton onClick={() => rotateCards("left")}>
          <ChevronRight />
        </RightButton>
      </MarginSlech>

     

      {/* Painel de Transações */}
      <AnimatePresence>
        {showTransactionsPanel && currentCard && (
          <TransactionsPanel
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
             
            <TransactionsContent>
              {cardTransactions.length > 0 ? (
                cardTransactions.slice(0, 5).map((transaction) => (
                  <TransactionItem key={transaction.id}>
                    <TransactionIcon type={transaction.type}>
                      {transaction.isAutoPay ? <Zap size={14} /> : <CreditCard size={14} />}
                    </TransactionIcon>
                    <TransactionDetails>
                      <TransactionMerchant>{transaction.merchant || "Merchant"}</TransactionMerchant>
                      <TransactionDate>{new Date(transaction.timestamp).toLocaleDateString("pt-BR")}</TransactionDate>
                    </TransactionDetails>
                    <TransactionAmount type={transaction.type}>-R${transaction.amount.toFixed(2)}</TransactionAmount>
                  </TransactionItem>
                ))
              ) : (
                <EmptyTransactions>
                  <CreditCard size={32} />
                  <span>Nenhuma transação encontrada</span>
                </EmptyTransactions>
              )}
            </TransactionsContent>
          </TransactionsPanel>
        )}
      </AnimatePresence>
  <AnimatePresence>
        {actionFeedback && (
          <FeedbackContainer
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            type={actionFeedback.type}
          >
            {actionFeedback.type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}
            <span>{actionFeedback.message}</span>
          </FeedbackContainer>
        )}
      </AnimatePresence>

      {/* Seção de pagamento automático expandida */}
      <AutoPaymentSection>
        <AutoPaymentHeader>
          <AutoPaymentIconContainer>
            <motion.div
              initial={false}
              animate={currentCard && autoPaymentEnabled[currentCard.cardNumber] ? { y: [0, -2, 0] } : {}}
              transition={{
                duration: 0.5,
                repeat: currentCard && autoPaymentEnabled[currentCard.cardNumber] ? Number.POSITIVE_INFINITY : 0,
                repeatDelay: 2,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect
                  x="2"
                  y="5"
                  width="20"
                  height="14"
                  rx="2"
                  stroke={currentCard && autoPaymentEnabled[currentCard.cardNumber] ? "#00B897" : "#666"}
                  strokeWidth="1.5"
                  fill="none"
                />
                <rect
                  x="2"
                  y="9"
                  width="20"
                  height="2"
                  fill={currentCard && autoPaymentEnabled[currentCard.cardNumber] ? "#00B897" : "#666"}
                  opacity={currentCard && autoPaymentEnabled[currentCard.cardNumber] ? "0.3" : "0.2"}
                />
              </svg>
            </motion.div>

            <AnimatePresence>
              {currentCard && autoPaymentEnabled[currentCard.cardNumber] && (
                <motion.div
                  style={{ position: "absolute", inset: 0 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                  >
                    <path
                      d="M12 14L12 19"
                      stroke="#00B897"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 16L12 19L15 16"
                      stroke="#00B897"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {currentCard && autoPaymentEnabled[currentCard.cardNumber] && (
                <motion.div
                  style={{ position: "absolute", inset: 0 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1, delay: 0.75 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16 9L10.5 14.5L8 12"
                      stroke="#00B897"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {currentCard && autoPaymentEnabled[currentCard.cardNumber] && (
              <motion.div
                style={{
                  position: "absolute",
                  inset: "-4px",
                  borderRadius: "50%",
                  background: "#00B897",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.2, 0], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            )}
          </AutoPaymentIconContainer>
          <AutoPaymentLabel>Pagamento automático</AutoPaymentLabel>
        </AutoPaymentHeader>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: currentCard && autoPaymentEnabled[currentCard.cardNumber] ? "auto" : 0,
            opacity: currentCard && autoPaymentEnabled[currentCard.cardNumber] ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{ overflow: "hidden" }}
        >
          {currentCard && autoPaymentEnabled[currentCard.cardNumber] && (
            <AutoPaymentDescription>
              <p>
                Pagamentos automáticos ativados. Suas compras serão pagas automaticamente usando o cartão{" "}
                {currentCard.type}.
              </p>
            </AutoPaymentDescription>
          )}
        </motion.div>
      </AutoPaymentSection>

      <CardInfo>
        <div className="card">
          <li>
            <img src="/icons/transaction.svg" alt="transactions" height={190} width={190} />
          </li>

          <span>
            <h3>Finalize compras mais rápido com o cartão vision automático</h3>
            <p>
              Você não precisa autorizar para realizar uma pagamento usando Vision card nem dentro da cidade
              thenovision. Depois que seu cartão é registrado, você pode finalizar as compras com apenas alguns cliques.
            </p>
          </span>
        </div>
      </CardInfo>
    </CardPricex>
  )
}

export default EnhancedVisionCard

// Styled Components
const FeedbackContainer = styled(motion.div)<{ type: "success" | "error" }>`
  
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9em 1em;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 1em;
  margin-top: 1em;
  font-family: 'ProximaNova-Italic', monospace;
  font-weight: 500;
 
  ${({ type }) =>
    type === "success"
      ? `
    background: rgba(16, 185, 129, 0.11);
    color: #40dd68;
  `
      : `
    background: rgba(239, 68, 68, 0.082);
    color: #c42b3f;
  `}
`

const ActionButton = styled.button<{
  variant?: "locked" | "unlocked" | "enabled" | "disabled" | "security" | "transactions"
}>`
  height: 40px;
  width: 40px;
  background-color: ${({ variant }) => {
    switch (variant) {
      case "locked":
        return "rgba(239, 68, 68, 0.2)"
      case "unlocked":
        return "rgba(34, 197, 94, 0.2)"
      case "enabled":
        return "rgba(59, 130, 246, 0.2)"
      case "disabled":
        return "rgba(107, 114, 128, 0.2)"
      case "security":
        return "rgba(245, 158, 11, 0.2)"
      case "transactions":
        return "rgba(227, 228, 169, 0.2)"
      default:
        return "rgba(49, 50, 51, 0.473)"
    }
  }};
  
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    stroke: ${({ variant }) => {
      switch (variant) {
        case "locked":
          return "#ef4444"
        case "unlocked":
          return "#22c55e"
        case "enabled":
          return "#3b82f6"
        case "disabled":
          return "#6b7280"
        case "security":
          return "#f59e0b"
        case "transactions":
          return "#eeeee8"
        default:
          return "#ebeeec"
      }
    }};
    stroke-width: 1.4;
  }
`

const CardStatusSection = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  margin: 1rem 0;
  background: rgba(32, 32, 32, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`

const StatusIcon = styled.div<{ status: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ status }) => {
    switch (status) {
      case "frozen":
        return "rgba(239, 68, 68, 0.1)"
      case "active":
        return "rgba(34, 197, 94, 0.1)"
      case "suspended":
        return "rgba(245, 158, 11, 0.1)"
      case "inactive":
        return "rgba(107, 114, 128, 0.1)"
      default:
        return "rgba(59, 130, 246, 0.1)"
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
      case "inactive":
        return "#6b7280"
      default:
        return "#3b82f6"
    }
  }};
`

const StatusText = styled.div`
  display: flex;
  flex-direction: column;
`

const StatusLabel = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.125rem;
`

const StatusValue = styled.div<{ status: string }>`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ status }) => {
    switch (status) {
      case "frozen":
        return "#ef4444"
      case "active":
        return "#22c55e"
      case "suspended":
        return "#f59e0b"
      case "inactive":
        return "#6b7280"
      default:
        return "#3b82f6"
    }
  }};
`

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 15px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    color: #ef4444;
    font-weight: bold;
    font-size: 1.2rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
`

const CardStatusIndicator = styled.div<{ status: string }>`
  
  width: 24px;
  height: 24px;
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

// Novos Styled Components para Painéis
const SecurityPanel = styled(motion.div)`
  margin: 1rem 0;
  background: rgba(32, 32, 32, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(10px);
`

const SecurityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const SecurityTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #e5e7eb;
  margin: 0;
`

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #2d302e;
  background: rgba(45, 48, 46, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  
  transition: all 0.2s ease;
  color: #9ca3af;

  &:hover {
    background: rgba(220, 38, 38, 0.1);
    border-color: #dc2626;
    color: #dc2626;
  }
`

const SecurityContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const SecurityAction = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const SecurityActionTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 500;
  color: #e5e7eb;
  margin: 0;
`

const SecurityActionDescription = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
  line-height: 1.4;
`

const EmergencyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 500;
  
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.2);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const TestPaymentButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  color: #3b82f6;
  font-size: 0.8rem;
  font-weight: 500;
  
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(59, 130, 246, 0.2);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const TransactionsPanel = styled(motion.div)`
  margin: 1rem 0;
  
  overflow: hidden;
  backdrop-filter: blur(10px);
`

const TransactionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const TransactionsTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #e5e7eb;
  margin: 0;
`

const TransactionsContent = styled.div`
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
`

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`

const TransactionIcon = styled.div<{ type: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ type }) => (type === "autopay" ? "rgba(59, 130, 246, 0.1)" : "rgba(107, 114, 128, 0.1)")};
  color: ${({ type }) => (type === "autopay" ? "#3b82f6" : "#6b7280")};
`

const TransactionDetails = styled.div`
  flex: 1;
`

const TransactionMerchant = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #e5e7eb;
  margin-bottom: 0.25rem;
`

const TransactionDate = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
`

const TransactionAmount = styled.div<{ type: string }>`
  font-size: 0.9rem;
  font-weight: 600;
  color: #ef4444;
`

const EmptyTransactions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  color: #6b7280;
  text-align: center;

  span {
    font-size: 0.9rem;
  }
`

const AutoPaymentSection = styled.div`
  overflow: hidden;
  border-radius: 24px;
  margin-top: 0.25rem;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`

const AutoPaymentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const AutoPaymentIconContainer = styled.div`
  position: relative;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const AutoPaymentLabel = styled.span`
  font-family: "InterSemiBold";
  font-size: 12px;
  margin-left: 0.5rem;
`

const AutoPaymentDescription = styled.div`
  margin-top: 0.5rem;
  border-radius: 16px;
  background: rgb(32, 32, 32);
  padding: 0.5rem;
  font-size: 0.875rem;

  p {
    color: #8c8c8c;
    font-family: "InterSemiBold";
    font-size: 12px;
  }
`

// Mantendo todos os outros styled components existentes...
const MarginSlech = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  justify-content: center;
`

const NetworkButton = styled.button`
  height: 40px;
  background-color: rgba(49, 50, 51, 0.473);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  border: none;
  

  svg {
    stroke: #ebeeec;
    stroke-width: 1.4;
  }

  &.active {
    svg {
      stroke: #24cf71;
    }
    animation: Rotate 0.4s linear;
  }

  @keyframes Rotate {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`

const VPointsDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

const VPointsIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4ee291, #dce4df);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
`

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1em;

  .card {
    width: 300px;
    background: linear-gradient(204deg, #529c7740 -7%, #b85cff00 33%),
      linear-gradient(162deg, #529c7740 -10%, #2c88dd00 25%), linear-gradient(0deg, #1b1d1c, #1b1d1c);
    padding: 0.4em;
    border-radius: 15px;
  }

  li {
    width: 100%;
    position: relative;
    overflow: hidden;
    height: 120px;
    display: flex;
    border-radius: 15px;
    background: #529c7740;
    justify-content: center;
    align-items: center;
  }

  span {
    padding: 0.9em 0.7em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h3 {
    font-family: "Inter", monospace;
    font-size: 13px;
    margin-bottom: 0.6em;
    font-weight: 200;
  }

  p {
    font-size: 'InterSemiBold', monospace;
    font-size: 11px;
    color: #949796;
    font-weight: 200;
  }
`

// Base Card Component
const Card = styled.div<{ variant: "VisionPay" | "Sapphire" | "VΛULT"; status?: string }>`
  position: relative;
  height: 210px;
  border-radius: 15px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease;
  overflow: hidden;
  transform: scale(0.8);

  &:hover {
    transform: translateY(4px);
    transform: scale(0.9);
  }

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
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-size: 200% 200%;
            animation: shimmer 5s infinite linear;
            border-radius: 15px;
            pointer-events: none;
          }
        `
      case "Sapphire":
        return `
          background: linear-gradient(135deg, #308d69 0%, #2D2A37 100%);
          color: #d3d8dd;
          position: relative;
        `
      case "VΛULT":
        return `
          background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 20%, #444444 40%, #1a1a1a 60%, #2c2c2c 80%, #1a1a1a 100%);
          color: #ffffff;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3), 0 6px 6px rgba(0, 0, 0, 0.3);
          position: relative;
          
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
            border-radius: 15px;
            pointer-events: none;
          }
        `
      default:
        return ""
    }
  }}
`

const CardContainer = styled.div`
  width: 100%;
  height: 210px;
  perspective: 1000px;
`

const Flipper = styled.div<{ flipped: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: ${({ flipped }) => (flipped ? "rotateY(180deg)" : "rotateY(0deg)")};
`

const CardFace = styled.div<{ back?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: ${({ back }) => (back ? "rotateY(180deg)" : "none")};
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 4px;
  align-items: flex-start;
  position: relative;
`
const CardHeader2 = styled.div`
  display: flex;
  justify-content: end;
  gap: 4px;
  align-items: flex-start;
  position: relative;
`
const CardType = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
`

const CardLogo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
`

const CardLogo2 = styled.div`
  font-size: 12px;
  font-weight: bold;
 
  right: 2px;
  padding: 0.3em 1em 0.3em;
  border-radius: 22px;
  background-color: rgba(29, 30, 31, 0.356);
`

const CardChip = styled.div`
  width: 60px;
  height: 20px;
  background: linear-gradient(135deg, #585c5a6f 0%, #2b2c2c 100%);
  border-radius: 6px;
  margin: 20px 0;
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

const CardNumber = styled.div`
  font-size: 1.2rem;
  letter-spacing: 2px;
`

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CardHolder = styled.div`
  font-size: 0.9rem;
  text-transform: uppercase;
`

const CardExpiry = styled.div`
  font-size: 0.9rem;
`

const Value = styled.div`
  color: #e4eee9;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
`

const Buttoxn = styled.button`
  background: none;
  border: none;
  padding: 4px;
  color: #2e312f;
  
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
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

const CardContent = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h5 {
    font-family: "ProximaNova-Italic";
    color: #a1a1a1;
  }
`

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

const CarouselButton = styled.button`
  background: rgba(22, 22, 22, 0.5);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  z-index: 9;

  &:hover {
    background: rgba(43, 41, 41, 0.8);
  }
`

const LeftButton = styled(CarouselButton)`
  left: 10px;
`

const RightButton = styled(CarouselButton)`
  right: 10px;
`

const CardWrapper = styled(motion.div)<{ index: number }>`
  position: absolute;
  width: 100%;
  transition: all 0.3s ease;

  ${({ index }) => {
    if (index === 1) return "z-index: 3; transform: scale(0.9);"
    if (index === 0 || index === 2) return "z-index: 2; transform: scale(0.9);"
    return "z-index: 1; transform: scale(0.1);"
  }}

  ${({ index }) => {
    if (index === 0) return "left: 30px;"
    if (index === 2) return "right: 30px;"
    if (index === 1) return "left: 0; transform: translateX(30%);"
  }}
`

const RequestButton = styled.button`
  background-color: #f3f8f6;
  color: #0f0f11;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 42px;
  border: none;
  font-family: "Inter";
  transition: all 0.2s ease;
  font-size: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const CardPricex = styled.div`
  border-radius: 12px;
  width: 100%;
  padding: 0.3em;
`

const Button = styled.button`
  width: 100%;
  padding: 0.875rem 1rem;
  background-color: white;
  color: #050505;
  border: none;
  font-family: "InterSemiBold", monospace;
  border-radius: 25rem;
  font-size: 1rem;
  font-weight: 500;
  
  transition: background-color 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
`

// Loading and creation components
const Containerx = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  background-image: url("/icons/084mnfgjhdgdfyt4n.png");
  background: linear-gradient(204deg, #86979440 -7%, #b85cff00 33%),
    linear-gradient(162deg, #86979440 -10%, #2c88dd00 25%),
    linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048));
  border-radius: 12px;
  color: white;
`

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 2rem 1.5rem;
`

const Wrapper = styled.div`
  width: 100%;
`

const IconWrapper = styled(motion.div)`
  display: flex;
  height: 6rem;
  width: 6rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
`

const Titlex = styled(motion.h1)`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
`

const Descriptionx = styled(motion.p)`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
`

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const StyledLoader2 = styled(Loader2)`
  height: 3rem;
  width: 3rem;
  animation: ${spin} 1s linear infinite;
`

const StyledCircleCheck = styled(CircleCheck)`
  height: 3rem;
  width: 3rem;
`

const ProgressWrapper = styled.div`
  margin-bottom: 3rem;
`

const ProgressBar = styled.div`
  height: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
`

const ProgressIndicator = styled.div<{ value: number }>`
  height: 100%;
  width: ${(props) => props.value}%;
  background-color: white;
  border-radius: 9999px;
  transition: width 0.3s ease-in-out;
`

const ProgressText = styled.p`
  margin-top: 0.5rem;
  text-align: right;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
`

const CardWrapperx = styled(motion.div)`
  position: relative;
  height: 12rem;
  width: 18.75rem;
  margin: 0 auto 2rem;
  border-radius: 0.75rem;
  background: linear-gradient(to bottom right, #219957, #36423c);
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`

const CardIconx = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
`

const CardContentx = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: flex-end;
`

const CardChipx = styled.div`
  height: 2rem;
  width: 3rem;
  margin-bottom: 1.5rem;
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.2);
`

const CardNumberx = styled.div`
  height: 1rem;
  width: 100%;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.2);
`

const CardName = styled.div`
  height: 1rem;
  width: 66.666667%;
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.2);
`

const Footer = styled.div`
  padding: 2rem 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
`

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`
