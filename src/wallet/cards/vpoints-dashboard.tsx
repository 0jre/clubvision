"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Zap,
  Crown,
  Sparkles,
  TrendingUp,
  Award,
  ShoppingBag,
  ChevronRight,
  Clock,
  Target,
  Wallet,
  Activity,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Plus,
  Minus,
  RefreshCw,
  Gift,
} from "lucide-react"
import styled from "styled-components"
import axios from "axios"
import LoadingPageView from "@/resources/loading/market.loading"

interface VPointsData {
  vpoints: number
  activities: number
  isPremiumPlus: boolean
  monthlyPointsEarned: number
 
  availableRewards: {
    bitsCredits: {
      cost: number
      amount: number
      available: boolean
    }
    orbitCredits: {
      cost: number
      amount: number
      available: boolean
    }
    combo: {
      cost: number
      bitsAmount: number
      orbitAmount: number
      available: boolean
    }
  }
  transactions: Array<{
    id: string
    type: "earn" | "redeem"
    amount: number
    description: string
    rewardType?: string
    quantity?: number
    timestamp: string
    status: string
  }>
  stats: {
    totalEarned: number
    totalRedeemed: number
    currentStreak: number
  }
}

const VPointsDashboard = () => {
  const [data, setData] = useState<VPointsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [collectingBonus, setCollectingBonus] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"active" | "used">("active")
  const [showInsights, setShowInsights] = useState(false)
  const [showRedeemModal, setShowRedeemModal] = useState<string | null>(null)
  const [redeemQuantity, setRedeemQuantity] = useState(1)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const fetchVPointsData = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/activity/wallet/card/vpoints")
      setData(response.data)
      setError("")
      setLastSync(new Date())
    } catch (err: any) {
      console.error("Erro ao carregar V-points:", err)
      setError(err.response?.data?.message || "Erro ao carregar dados dos V-points")
    } finally {
      setLoading(false)
    }
  }

  const syncData = async () => {
    try {
      setSyncing(true)
      const response = await axios.get("/api/activity/wallet/card/vpoints")
      setData(response.data)
      setError("")
      setLastSync(new Date())
    } catch (err: any) {
      console.error("Erro ao sincronizar V-points:", err)
      setError(err.response?.data?.message || "Erro ao sincronizar dados dos V-points")
    } finally {
      setSyncing(false)
    }
  }

  const handleRedeem = async (rewardType: string) => {
    if (!data) return

    try {
      setRedeeming(rewardType)
      const response = await axios.post("/api/activity/wallet/card/vpoints", {
        action: "redeem",
        rewardType,
        quantity: redeemQuantity,
      })

      // Mostrar mensagem de sucesso se disponível
      if (response.data.message) {
        console.log("Sucesso:", response.data.message)
      }

      await syncData()
      setShowRedeemModal(null)
      setRedeemQuantity(1)
    } catch (err: any) {
      console.error("Erro ao resgatar:", err)
      setError(err.response?.data?.message || "Erro ao resgatar recompensa")
    } finally {
      setRedeeming(null)
    }
  }

  const collectDailyBonus = async () => {
    try {
      setCollectingBonus(true)
      const response = await axios.post("/api/activity/wallet/card/vpoints", {
        action: "daily_bonus",
      })

      if (response.data.message) {
        console.log("Bônus coletado:", response.data.message)
      }

      await syncData()
    } catch (err: any) {
      console.error("Erro ao coletar bônus:", err)
      setError(err.response?.data?.message || "Erro ao coletar bônus diário")
    } finally {
      setCollectingBonus(false)
    }
  }

  const openRedeemModal = (rewardType: string) => {
    setShowRedeemModal(rewardType)
    setRedeemQuantity(1)
  }

  const adjustQuantity = (delta: number) => {
    setRedeemQuantity(Math.max(1, Math.min(10, redeemQuantity + delta)))
  }

  const setPresetQuantity = (quantity: number) => {
    setRedeemQuantity(quantity)
  }

  // Verificar se pode coletar bônus diário
  const canCollectDailyBonus = () => {
    if (!data?.transactions) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayBonus = data.transactions.find((t) => {
      const transactionDate = new Date(t.timestamp)
      transactionDate.setHours(0, 0, 0, 0)
      return t.description.includes("Bônus diário") && transactionDate.getTime() === today.getTime()
    })

    return !todayBonus
  }

  useEffect(() => {
    fetchVPointsData()
  }, [])

  if (loading && !data) {
    return (
      <LoadingContainer>
        <LoadingPageView />
      </LoadingContainer>
    )
  }

  if (error && !data) {
    return (
      <ErrorContainer>
        <AlertCard variant="error">
          <AlertIcon>
            <AlertCircle size={20} />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Erro ao carregar</AlertTitle>
            <AlertMessage>{error}</AlertMessage>
          </AlertContent>
          <RetryButton onClick={fetchVPointsData}>Tentar novamente</RetryButton>
        </AlertCard>
      </ErrorContainer>
    )
  }

  if (!data) {
    return (
      <ErrorContainer>
        <AlertCard variant="warning">
          <AlertIcon>
            <Info size={20} />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Dados indisponíveis</AlertTitle>
            <AlertMessage>Não foi possível carregar suas informações</AlertMessage>
          </AlertContent>
          <RetryButton onClick={fetchVPointsData}>Recarregar</RetryButton>
        </AlertCard>
      </ErrorContainer>
    )
  }

  const vpoints = data.vpoints || 0
  const activities = data.activities || 0
  const isPremiumPlus = data.isPremiumPlus || false
  const monthlyPointsEarned = data.monthlyPointsEarned || 0
  const nextActivityReward = 1000 - (activities % 1000)
  const progressPercentage = ((activities % 1000) / 1000) * 100

  const rewards = data.availableRewards || {
    bitsCredits: { cost: 500, amount: 100000, available: false },
    orbitCredits: { cost: 500, amount: 400000, available: false },
    combo: { cost: 1000, bitsAmount: 100000, orbitAmount: 400000, available: false },
  }

  const transactions = data.transactions || []
  const stats = data.stats || { totalEarned: 0, totalRedeemed: 0, currentStreak: 0 }

  const getCurrentReward = () => {
    switch (showRedeemModal) {
      case "bits":
        return rewards.bitsCredits
      case "orbit":
        return rewards.orbitCredits
      case "combo":
        return rewards.combo
      default:
        return null
    }
  }

  const currentReward = getCurrentReward()
  const totalCost = currentReward ? currentReward.cost * redeemQuantity : 0

  return (
    <Container>
      {/* Header */}
      <Header>
        <HeaderTop>
          <div>
            <HeaderTitle>V-points</HeaderTitle>
            {lastSync && (
              <LastSyncIndicator>
                Última sincronização:{" "}
                {lastSync.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </LastSyncIndicator>
            )}
          </div>
          <HeaderActions>
            {canCollectDailyBonus() && (
              <DailyBonusButton onClick={collectDailyBonus} disabled={collectingBonus}>
                {collectingBonus ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <RefreshCw size={16} />
                  </motion.div>
                ) : (
                  <Gift size={16} />
                )}
                <span>Bônus</span>
              </DailyBonusButton>
            )}
            
            <IconButton onClick={() => setShowInsights(!showInsights)}>
              <BarChart3 size={20} />
            </IconButton>
          </HeaderActions>
        </HeaderTop>

        {/* Balance Card */}
        <BalanceCard>
          <BalanceMain>
            <BalanceAmount>{vpoints.toLocaleString()}</BalanceAmount>
            <BalanceLabel>pontos disponíveis</BalanceLabel>
          </BalanceMain>
 
         
            <PremiumIndicator>
              <img src="/icons/coins/points.webp" alt="V-points Icon" width={100} height={100} />
            </PremiumIndicator>
          
        </BalanceCard>

        {/* Quick Stats */}
        <QuickStats>
          <StatItem>
            <StatIcon>
              <Activity size={16} />
            </StatIcon>
            <StatContent>
              <StatValue>{activities.toLocaleString()}</StatValue>
              <StatLabel>atividades</StatLabel>
            </StatContent>
          </StatItem>

          <StatItem>
            <StatIcon>
              <Target size={16} />
            </StatIcon>
            <StatContent>
              <StatValue>{nextActivityReward}</StatValue>
              <StatLabel>próxima recompensa</StatLabel>
            </StatContent>
          </StatItem>
        </QuickStats>
      </Header>

      {/* Progress Section */}
      <ProgressSection>
        <ProgressHeader>
          <ProgressTitle>Progresso atual</ProgressTitle>
          <ProgressValue>{Math.round(progressPercentage)}%</ProgressValue>
        </ProgressHeader>

        <ProgressBarContainer>
          <ProgressBar>
            <ProgressFill
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </ProgressBar>
          <ProgressLabels>
            <ProgressLabel>0</ProgressLabel>
            <ProgressLabel>1000</ProgressLabel>
          </ProgressLabels>
        </ProgressBarContainer>

        <ProgressInfo>
          <Clock size={14} />
          <span>Faltam {nextActivityReward} atividades para ganhar +10 pontos</span>
        </ProgressInfo>
      </ProgressSection>

      {/* Insights Panel */}
      <AnimatePresence>
        {showInsights && (
          <InsightsPanel
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InsightCard>
              <InsightIcon>
                <TrendingUp size={20} />
              </InsightIcon>
              <InsightContent>
                <InsightTitle>Pontos ganhos este mês</InsightTitle>
                <InsightValue>+{monthlyPointsEarned.toLocaleString()}</InsightValue>
              </InsightContent>
            </InsightCard>

            <InsightCard>
              <InsightIcon>
                <Calendar size={20} />
              </InsightIcon>
              <InsightContent>
                <InsightTitle>Sequência atual</InsightTitle>
                <InsightValue>{stats.currentStreak} dias</InsightValue>
              </InsightContent>
            </InsightCard>

            <InsightCard>
              <InsightIcon>
                <Award size={20} />
              </InsightIcon>
              <InsightContent>
                <InsightTitle>Total resgatado</InsightTitle>
                <InsightValue>{stats.totalRedeemed} recompensas</InsightValue>
              </InsightContent>
            </InsightCard>
          </InsightsPanel>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <TabsContainer>
        <Tab active={activeTab === "active"} onClick={() => setActiveTab("active")}>
          Recompensas Ativas
        </Tab>
        <Tab active={activeTab === "used"} onClick={() => setActiveTab("used")}>
          Histórico ({transactions.length})
        </Tab>
      </TabsContainer>

      {/* Content */}
      <ContentContainer>
        <AnimatePresence mode="wait">
          {activeTab === "active" ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {rewards.bitsCredits.available || rewards.orbitCredits.available || rewards.combo.available ? (
                <RewardsGrid>
                  {/* Bits Credits */}
                  {rewards.bitsCredits.available && (
                    <RewardCard>
                      <RewardHeader>
                        <RewardIcon>
                          <Zap size={20} />
                        </RewardIcon>
                        <RewardBadge>Popular</RewardBadge>
                      </RewardHeader>

                      <RewardContent>
                        <RewardTitle>Bits Credits</RewardTitle>
                        <RewardAmount>{rewards.bitsCredits.amount.toLocaleString()}</RewardAmount>
                        <RewardCost>{rewards.bitsCredits.cost} pontos</RewardCost>
                      </RewardContent>

                      <RedeemButton onClick={() => openRedeemModal("bits")}>Resgatar</RedeemButton>
                    </RewardCard>
                  )}

                  {/* Orbit Credits */}
                  {rewards.orbitCredits.available && (
                    <RewardCard>
                      <RewardHeader>
                        <RewardIcon>
                          <Award size={20} />
                        </RewardIcon>
                        <RewardBadge variant="premium">Exclusivo</RewardBadge>
                      </RewardHeader>

                      <RewardContent>
                        <RewardTitle>Orbit Credits</RewardTitle>
                        <RewardAmount>{rewards.orbitCredits.amount.toLocaleString()}</RewardAmount>
                        <RewardCost>{rewards.orbitCredits.cost} pontos</RewardCost>
                      </RewardContent>

                      <RedeemButton onClick={() => openRedeemModal("orbit")}>Resgatar</RedeemButton>
                    </RewardCard>
                  )}

                  {/* Combo */}
                  {rewards.combo.available && (
                    <RewardCard>
                      <RewardHeader>
                        <RewardIcon>
                          <Sparkles size={20} />
                        </RewardIcon>
                        <RewardBadge variant="combo">Melhor Oferta</RewardBadge>
                      </RewardHeader>

                      <RewardContent>
                        <RewardTitle>Combo Premium</RewardTitle>
                        <ComboDetails>
                          <ComboItem>
                            <Zap size={14} />
                            {rewards.combo.bitsAmount.toLocaleString()} Bits
                          </ComboItem>
                          <ComboItem>
                            <Award size={14} />
                            {rewards.combo.orbitAmount.toLocaleString()} Orbit
                          </ComboItem>
                        </ComboDetails>
                        <RewardCost>
                          {rewards.combo.cost} pontos
                          <ComboSavings>Economize 20%</ComboSavings>
                        </RewardCost>
                      </RewardContent>

                      <RedeemButton onClick={() => openRedeemModal("combo")}>Resgatar Combo</RedeemButton>
                    </RewardCard>
                  )}
                </RewardsGrid>
              ) : (
                <EmptyState>
                  <EmptyIllustration>
                    <Wallet size={48} />
                  </EmptyIllustration>
                  <EmptyTitle>Nenhuma Recompensa Disponível</EmptyTitle>
                  <EmptySubtitle>
                    Complete mais atividades para desbloquear recompensas ou aguarde ter pontos suficientes
                  </EmptySubtitle>
                  
                </EmptyState>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="used"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {transactions.length > 0 ? (
                <TransactionsList>
                  {transactions.map((transaction) => (
                    <TransactionItem key={transaction.id}>
                      <TransactionIcon type={transaction.type}>
                        {transaction.type === "earn" ? (
                          <TrendingUp size={16} />
                        ) : transaction.rewardType === "bits" ? (
                          <Zap size={16} />
                        ) : transaction.rewardType === "orbit" ? (
                          <Award size={16} />
                        ) : (
                          <Sparkles size={16} />
                        )}
                      </TransactionIcon>
                      <TransactionContent>
                        <TransactionDescription>{transaction.description}</TransactionDescription>
                        <TransactionDate>
                          {new Date(transaction.timestamp).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TransactionDate>
                      </TransactionContent>
                   <TransactionAmount type={transaction.type}>
  {transaction.type === "earn" ? "+" : "-"}
  {(transaction.amount ?? 0).toLocaleString()}
  {transaction.quantity && transaction.quantity > 1 && (
    <TransactionQuantity>x{transaction.quantity}</TransactionQuantity>
  )}
</TransactionAmount>
                    </TransactionItem>
                  ))}
                </TransactionsList>
              ) : (
                <EmptyState>
                  <EmptyIllustration>
                    <CheckCircle size={48} />
                  </EmptyIllustration>
                  <EmptyTitle>Nenhuma Transação</EmptyTitle>
                  <EmptySubtitle>Suas atividades e resgates aparecerão aqui</EmptySubtitle>
                </EmptyState>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </ContentContainer>

      {/* Premium Section */}
      {isPremiumPlus && (
        <PremiumSection>
          <PremiumContent>
            <PremiumIcon>
              <Crown size={20} />
            </PremiumIcon>
            <PremiumText>
              <PremiumTitle>Premium Plus Ativo</PremiumTitle>
              <PremiumSubtitle>Ganhando pontos em dobro</PremiumSubtitle>
            </PremiumText>
          </PremiumContent>
          <ChevronRight size={20} color="#41b45e" />
        </PremiumSection>
      )}

      {/* Redeem Modal */}
      <AnimatePresence>
        {showRedeemModal && currentReward && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRedeemModal(null)}
          >
            <ModalContainer
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>Confirmar Resgate</ModalTitle>
                <CloseButton onClick={() => setShowRedeemModal(null)}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <ModalBody>
                <RewardPreview>
                  <RewardPreviewIcon>
                    {showRedeemModal === "bits" && <Zap size={24} />}
                    {showRedeemModal === "orbit" && <Award size={24} />}
                    {showRedeemModal === "combo" && <Sparkles size={24} />}
                  </RewardPreviewIcon>
                  <RewardPreviewContent>
                    <RewardPreviewTitle>
                      {showRedeemModal === "bits" && "Bits Credits"}
                      {showRedeemModal === "orbit" && "Orbit Credits"}
                      {showRedeemModal === "combo" && "Combo Premium"}
                    </RewardPreviewTitle>
                    <RewardPreviewAmount>
                      {showRedeemModal === "combo" && "bitsAmount" in currentReward && "orbitAmount" in currentReward
                        ? `${currentReward.bitsAmount?.toLocaleString()} Bits + ${currentReward.orbitAmount?.toLocaleString()} Orbit`
                        : "amount" in currentReward
                        ? `${currentReward.amount?.toLocaleString()} créditos`
                        : ""}
                    </RewardPreviewAmount>
                  </RewardPreviewContent>
                </RewardPreview>

                <QuantitySection>
                  <QuantityLabel>Quantidade</QuantityLabel>
                  <QuantityControls>
                    <QuantityButton onClick={() => adjustQuantity(-1)} disabled={redeemQuantity <= 1}>
                      <Minus size={16} />
                    </QuantityButton>
                    <QuantityDisplay>{redeemQuantity}</QuantityDisplay>
                    <QuantityButton onClick={() => adjustQuantity(1)} disabled={redeemQuantity >= 10}>
                      <Plus size={16} />
                    </QuantityButton>
                  </QuantityControls>
                </QuantitySection>

                <PresetButtons>
                  {[1, 5, 10].map((preset) => (
                    <PresetButton
                      key={preset}
                      active={redeemQuantity === preset}
                      onClick={() => setPresetQuantity(preset)}
                    >
                      {preset}x
                    </PresetButton>
                  ))}
                </PresetButtons>

                <CostSummary>
                  <CostItem>
                    <CostLabel>Custo unitário:</CostLabel>
                    <CostValue>{currentReward.cost} pontos</CostValue>
                  </CostItem>
                  <CostItem>
                    <CostLabel>Quantidade:</CostLabel>
                    <CostValue>{redeemQuantity}x</CostValue>
                  </CostItem>
                  <CostDivider />
                  <CostItem total>
                    <CostLabel>Total:</CostLabel>
                    <CostValue>{totalCost.toLocaleString()} pontos</CostValue>
                  </CostItem>
                </CostSummary>

                {totalCost > vpoints && (
                  <InsufficientFunds>
                    <AlertCircle size={16} />
                    <span>
                      Pontos insuficientes. Você precisa de mais {(totalCost - vpoints).toLocaleString()} pontos.
                    </span>
                  </InsufficientFunds>
                )}
              </ModalBody>

              <ModalFooter>
                <SecondaryButton onClick={() => setShowRedeemModal(null)}>Cancelar</SecondaryButton>
                <PrimaryButton
                  disabled={redeeming === showRedeemModal || totalCost > vpoints}
                  onClick={() => handleRedeem(showRedeemModal)}
                >
                  {redeeming === showRedeemModal ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Sparkles size={16} />
                      </motion.div>
                      Resgatando...
                    </>
                  ) : (
                    `Resgatar por ${totalCost.toLocaleString()} pontos`
                  )}
                </PrimaryButton>
              </ModalFooter>
            </ModalContainer>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  )
}

export default VPointsDashboard

// Styled Components - Dark Theme Design System (mantendo os existentes + novos)
const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0;
 
  color: #e5e7eb;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  min-height: 100vh;
  
`

const LoadingSpinner = styled.div`
  margin-bottom: 1rem;
`

const LoadingText = styled.p`
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 500;
`

const ErrorContainer = styled.div`
  padding: 1rem;
  min-height: 100vh;
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`

const AlertCard = styled.div<{ variant: "error" | "warning" }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: ${({ variant }) => (variant === "error" ? "#2d1b1b" : "#2d2a1b")};
  border: 1px solid ${({ variant }) => (variant === "error" ? "#dc2626" : "#f59e0b")};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  max-width: 400px;
`

const AlertIcon = styled.div`
  color: #dc2626;
  margin-top: 0.125rem;
`

const AlertContent = styled.div`
  flex: 1;
`

const AlertTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #e5e7eb;
`

const AlertMessage = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-bottom: 0.75rem;
  line-height: 1.5;
`

const RetryButton = styled.button`
  padding: 0.5rem 1rem;
  background: #41b45e;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  
  transition: all 0.2s ease;

  &:hover {
    background: #369649;
    transform: translateY(-1px);
  }
`

const Header = styled.div`
  padding: 1.5rem 1rem 1rem;
`

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #e5e7eb;
  margin: 0;
`

const LastSyncIndicator = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

 

const DailyBonusButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(135deg, #24fb76, #e2e9e2);
  color: #1f2937;
  border: none;
  border-radius: 38px;
  font-size: 0.8rem;
  font-weight: 600;
 
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(50, 172, 97, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
 
  background: rgba(38, 39, 38, 0.377);
  display: flex;
  align-items: center;
  justify-content: center;
  
  transition: all 0.2s ease;
  color: #9ca3af;
  backdrop-filter: blur(4px);

 &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:hover {
    background: rgba(38, 39, 38, 0.1);
     
    transform: translateY(-1px);
  }
`

const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(55, 56, 55, 0.411);
 
  border-radius: 12px;
  transition: all 0.2s ease;

  
`

const TransactionIcon = styled.div<{ type: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ type }) => (type === "earn" ? "rgba(65, 180, 94, 0.1)" : "rgba(239, 68, 68, 0.1)")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ type }) => (type === "earn" ? "#41b45e" : "#ef4444")};
`

const TransactionContent = styled.div`
  flex: 1;
`

const TransactionDescription = styled.div`
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
  color: ${({ type }) => (type === "earn" ? "#41b45e" : "#ef4444")};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const TransactionQuantity = styled.span`
  font-size: 0.7rem;
  color: #9ca3af;
`

// Mantendo todos os outros styled components existentes...
const BalanceCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
   
  border-radius: 16px;
  backdrop-filter: blur(4px);
`

const BalanceMain = styled.div``

const BalanceAmount = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #62d38e;
  line-height: 1;
  margin-bottom: 0.25rem;
  text-shadow: 0 0 20px rgba(119, 170, 128, 0.3);
`

const BalanceLabel = styled.div`
  font-size: 0.9rem;
  color: #9ca3af;
  font-weight: 500;
`

const PremiumIndicator = styled.div`
 
 img{
  transform: rotate(-26deg);
 }
`

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8em 1rem;
  background: rgba(55, 56, 55, 0.411);
  border-radius: 12px;
   
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;

  
`

const StatIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(65, 180, 94, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #41b45e;
`

const StatContent = styled.div``

const StatValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #e5e7eb;
  line-height: 1;
`

const StatLabel = styled.div`
  font-size: 0.55rem;
  color: #9ca3af;
  margin-top: 0.125rem;
`

const ProgressSection = styled.div`
  padding: 1.5rem 1rem;
  border-top: 1px solid #2d302e;
 
`

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const ProgressTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #e5e7eb;
  margin: 0;
`

const ProgressValue = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #41b45e;
`

const ProgressBarContainer = styled.div`
  margin-bottom: 0.75rem;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #2d302e;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
   
`

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #41b45e 0%, #4ade80 100%);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(65, 180, 94, 0.5);
`

const ProgressLabels = styled.div`
  display: flex;
  justify-content: space-between;
`

const ProgressLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`

const ProgressInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #9ca3af;
`

const InsightsPanel = styled(motion.div)`
  padding: 0 1rem 1.5rem;
  overflow: hidden;
`

const InsightCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(55, 56, 55, 0.411);
  border-radius: 12px;
 
  margin-bottom: 0.75rem;
 
  transition: all 0.2s ease;

  &:last-child {
    margin-bottom: 0;
  }

  
`

const InsightIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(65, 180, 94, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #41b45e;
`

const InsightContent = styled.div`
  flex: 1;
`

const InsightTitle = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-bottom: 0.125rem;
`

const InsightValue = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #e5e7eb;
`

const TabsContainer = styled.div`
  display: flex;
  padding: 0 1rem;
  border-bottom: 1px solid #2d302e;
 
`

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem 0;
  border: none;
  background: none;
  font-size: 0.9rem;
  font-weight: ${({ active }) => (active ? "600" : "500")};
  color: ${({ active }) => (active ? "#41b45e" : "#9ca3af")};
  border-bottom: 2px solid ${({ active }) => (active ? "#41b45e" : "transparent")};
  font-family: 'Inter', monospace;
  transition: all 0.2s ease;

  &:hover {
    color: #41b45e;
  }
`

const ContentContainer = styled.div`
  padding: 1.5rem 1rem;
  min-height: 300px;
`

const RewardsGrid = styled.div`
  display: grid;
  gap: 1rem;
`

const RewardCard = styled.div`
  padding: 1.5rem;
  background: rgba(56, 59, 57, 0.445);
  border-radius: 16px;
  transition: all 0.3s ease;
  
`

 

const RewardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const RewardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(65, 180, 94, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #41b45e;
`

const RewardBadge = styled.div<{ variant?: "premium" | "combo" }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${({ variant }) => {
    switch (variant) {
      case "premium":
        return "rgba(59, 130, 246, 0.1)"
      case "combo":
        return "rgba(245, 158, 11, 0.1)"
      default:
        return "rgba(65, 180, 94, 0.1)"
    }
  }};
  color: ${({ variant }) => {
    switch (variant) {
      case "premium":
        return "#60a5fa"
      case "combo":
        return "#fbbf24"
      default:
        return "#41b45e"
    }
  }};
  border: 1px solid ${({ variant }) => {
    switch (variant) {
      case "premium":
        return "rgba(59, 130, 246, 0.3)"
      case "combo":
        return "rgba(245, 158, 11, 0.3)"
      default:
        return "rgba(65, 180, 94, 0.3)"
    }
  }};
`

const RewardContent = styled.div`
  margin-bottom: 1.5rem;
`

const RewardTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #e5e7eb;
  margin: 0 0 0.5rem 0;
`

const RewardAmount = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #41b45e;
  margin-bottom: 0.5rem;
`

const RewardCost = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ComboDetails = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
`

const ComboItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #9ca3af;
`

const ComboSavings = styled.span`
  color: #fbbf24;
  font-weight: 600;
`

const RedeemButton = styled.button`
  width: 100%;
  padding: 0.675rem;
  background: #2f3631;
  color: #ffffff;
  border: none;
  border-radius: 62px;
  font-family: 'InterSemiBold', monospace;
  font-size: 0.8rem;
 
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #369649;
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(65, 180, 94, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;
`

const EmptyIllustration = styled.div`
  width: 80px;
  height: 80px;
 
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  margin-bottom: 1.5rem;
   
`

const EmptyTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #e5e7eb;
  margin: 0 0 0.5rem 0;
`

const EmptySubtitle = styled.p`
  font-size: 0.9rem;
  color: #9ca3af;
  line-height: 1.5;
  margin: 0 0 2rem 0;
`

 

const PremiumSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  margin: 1rem;
  background: rgba(65, 180, 94, 0.05);
  border: 1px solid rgba(65, 180, 94, 0.3);
  border-radius: 16px;
  
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(65, 180, 94, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
`

const PremiumContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const PremiumIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(65, 180, 94, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #41b45e;
`

const PremiumText = styled.div``

const PremiumTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 0.125rem;
`

const PremiumSubtitle = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
`

// Modal Components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

const ModalContainer = styled(motion.div)`
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  border: 1px solid #2d302e;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #2d302e;
`

const ModalTitle = styled.h2`
  font-size: 1.2rem;
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

const ModalBody = styled.div`
  padding: 1.5rem;
`

const RewardPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(45, 48, 46, 0.3);
  border: 1px solid #2d302e;
  border-radius: 12px;
  margin-bottom: 1.5rem;
`

const RewardPreviewIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(65, 180, 94, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #41b45e;
`

const RewardPreviewContent = styled.div`
  flex: 1;
`

const RewardPreviewTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 0.25rem;
`

const RewardPreviewAmount = styled.div`
  font-size: 0.9rem;
  color: #41b45e;
  font-weight: 500;
`

const QuantitySection = styled.div`
  margin-bottom: 1.5rem;
`

const QuantityLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #e5e7eb;
  margin-bottom: 0.75rem;
`

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #2d302e;
  background: rgba(45, 48, 46, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  
  transition: all 0.2s ease;
  color: #9ca3af;

  &:hover:not(:disabled) {
    background: rgba(65, 180, 94, 0.1);
    border-color: #41b45e;
    color: #41b45e;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const QuantityDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #41b45e;
  min-width: 60px;
  text-align: center;
`

const PresetButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

const PresetButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid ${({ active }) => (active ? "#41b45e" : "#2d302e")};
  background: ${({ active }) => (active ? "rgba(65, 180, 94, 0.1)" : "rgba(45, 48, 46, 0.3)")};
  color: ${({ active }) => (active ? "#41b45e" : "#9ca3af")};
  font-size: 0.8rem;
  font-weight: 500;
  
  transition: all 0.2s ease;

  &:hover {
    border-color: #41b45e;
    color: #41b45e;
    background: rgba(65, 180, 94, 0.1);
  }
`

const CostSummary = styled.div`
  padding: 1rem;
  background: rgba(45, 48, 46, 0.3);
  border: 1px solid #2d302e;
  border-radius: 12px;
  margin-bottom: 1rem;
`

const CostItem = styled.div<{ total?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ total }) => (total ? "0" : "0.5rem")};
  font-size: ${({ total }) => (total ? "1rem" : "0.9rem")};
  font-weight: ${({ total }) => (total ? "600" : "400")};
  color: ${({ total }) => (total ? "#e5e7eb" : "#9ca3af")};

  &:last-child {
    margin-bottom: 0;
  }
`

const CostLabel = styled.span``

const CostValue = styled.span`
  color: #41b45e;
  font-weight: 600;
`

const CostDivider = styled.div`
  height: 1px;
  background: #2d302e;
  margin: 0.75rem 0;
`

const InsufficientFunds = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 0.8rem;
  margin-bottom: 1rem;
`

const ModalFooter = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #2d302e;
`

const SecondaryButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  background: #222524;
  color: #9ca3af;
  border: 1px solid #2d302e;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  
  transition: all 0.2s ease;

  &:hover {
    background: rgba(45, 48, 46, 0.5);
    color: #e5e7eb;
  }
`

const PrimaryButton = styled.button`
  flex: 2;
  padding: 0.875rem;
  background: #41b45e;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: #369649;
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(65, 180, 94, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
