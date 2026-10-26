"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import {
  TrendingUp,
  Target,
  Activity,
  BarChart3,
  Calendar,
  Trophy,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from "lucide-react"
import LoadingPageView from "@/resources/loading/market.loading"

interface UpgradeHistory {
  _id: string
  userId: string
  targetItem: {
    id: number
    details: {
      id: number
      tokenID: string
      itemValue: number
      name: string
    }
  }
  offeredItems: Array<{
    id: number
    quantity: number
    details: {
      id: number
      tokenID: string
      itemValue: number
      name: string
    }
  }>
  success: boolean
  probability: number
  totalOfferedValue: number
  timestamp: string
  calculation?: {
    finalProbability: number
  }
}

interface Analytics {
  userPerformance: {
    totalUpgrades: number
    successRate: number
    totalValueTraded: number
    averageUpgradeValue: number
    profitLoss: number
    streak: {
      current: number
      best: number
    }
  }
  recentActivity: Array<{
    timestamp: string
    success: boolean
    probability: number
    valueTraded: number
    targetValue: number
    roi: number
  }>
  marketInsights: {
    globalSuccessRate: number
    averageUpgradeValue: number
    popularItems: string[]
    volatilityIndex: number
  }
  riskAssessment: {
    riskLevel: string
    riskScore: number
    recommendations: string[]
  }
  achievements: Array<{
    id: string
    name: string
    description: string
    unlockedAt: string
  }>
}

export default function TradesDashboard() {
  const [history, setHistory] = useState<UpgradeHistory[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"history" | "analytics">("analytics")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [historyRes, analyticsRes] = await Promise.all([
        fetch("/api/trivo/upgrader/history"),
        fetch("/api/trivo/upgrader/analytics"),
      ])

      if (historyRes.ok) {
        const historyData = await historyRes.json()
        setHistory(historyData.history || [])
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData.analytics)
      }
    } catch (err) {
      setError("Erro ao carregar dados")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {

      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "#3fc561"
      case "medium":
        return "#c9c373"
      case "high":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  if (loading) {
    return (
      <Container>
        <LoadingPageView />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorState>
          <AlertTriangle size={48} />
          <p>{error}</p>
        </ErrorState>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
 
        <TabNavigation>
          <Tab active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>
            <BarChart3 size={16} />
            Analytics
          </Tab>
          <Tab active={activeTab === "history"} onClick={() => setActiveTab("history")}>
            <Calendar size={16} />
            Histórico
          </Tab>
        </TabNavigation>
      </Header>

      {activeTab === "analytics" && analytics && (
        <AnalyticsSection>
          {/* Performance Overview */}
          <MetricsGrid>
            <MetricCard>
              <MetricIcon success>
                <Target size={24} />
              </MetricIcon>
              <MetricContent>
                <MetricValue>{analytics.userPerformance.totalUpgrades}</MetricValue>
                <MetricLabel>Total de Upgrades</MetricLabel>
              </MetricContent>
            </MetricCard>

            <MetricCard>
              <MetricIcon success={analytics.userPerformance.successRate > 50}>
                <TrendingUp size={24} />
              </MetricIcon>
              <MetricContent>
                <MetricValue>{analytics.userPerformance.successRate.toFixed(1)}%</MetricValue>
                <MetricLabel>Taxa de Sucesso</MetricLabel>
              </MetricContent>
            </MetricCard>

            <MetricCard>
              <MetricIcon success={analytics.userPerformance.profitLoss > 0}>
                {analytics.userPerformance.profitLoss > 0 ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
              </MetricIcon>
              <MetricContent>
                <MetricValue profit={analytics.userPerformance.profitLoss > 0}>
                  {formatCurrency(analytics.userPerformance.profitLoss)}
                </MetricValue>
                <MetricLabel>Lucro/Prejuízo</MetricLabel>
              </MetricContent>
            </MetricCard>

            <MetricCard>
              <MetricIcon>
                <Zap size={24} />
              </MetricIcon>
              <MetricContent>
                <MetricValue>{analytics.userPerformance.streak.current}</MetricValue>
                <MetricLabel>Sequência Atual</MetricLabel>
                <MetricSubtext>Melhor: {analytics.userPerformance.streak.best}</MetricSubtext>
              </MetricContent>
            </MetricCard>
          </MetricsGrid>

          {/* Risk Assessment */}
          <RiskSection>
            <SectionTitle>Avaliação de Risco</SectionTitle>
            <RiskCard>
              <RiskHeader>
                <RiskLevel color={getRiskColor(analytics.riskAssessment.riskLevel)}>
                  {analytics.riskAssessment.riskLevel}
                </RiskLevel>
                <RiskScore>Score: {analytics.riskAssessment.riskScore}/100</RiskScore>
              </RiskHeader>
              <RiskBar>
                <RiskProgress
                  width={analytics.riskAssessment.riskScore}
                  color={getRiskColor(analytics.riskAssessment.riskLevel)}
                />
              </RiskBar>
            </RiskCard>
          </RiskSection>

          {/* Recommendations */}
          <RecommendationsSection>
            <SectionTitle>Recomendações</SectionTitle>
            <RecommendationsList>
              {analytics.riskAssessment.recommendations.map((rec, index) => (
                <RecommendationItem key={index}>
                  <CheckCircle size={16} />
                  {rec}
                </RecommendationItem>
              ))}
            </RecommendationsList>
          </RecommendationsSection>

          {/* Achievements */}
          {analytics.achievements.length > 0 && (
            <AchievementsSection>
              <SectionTitle>Conquistas</SectionTitle>
              <AchievementsList>
                {analytics.achievements.map((achievement) => (
                  <AchievementCard key={achievement.id}>
                    <Trophy size={24} />
                    <AchievementContent>
                      <AchievementName>{achievement.name}</AchievementName>
                      <AchievementDescription>{achievement.description}</AchievementDescription>
                      <AchievementDate>Desbloqueado em {formatDate(achievement.unlockedAt)}</AchievementDate>
                    </AchievementContent>
                  </AchievementCard>
                ))}
              </AchievementsList>
            </AchievementsSection>
          )}

          {/* Market Insights */}
          <MarketSection>
            <SectionTitle>Insights do Mercado</SectionTitle>
            <MarketGrid>
              <MarketCard>
                <MarketLabel>Taxa Global de Sucesso</MarketLabel>
                <MarketValue>{analytics.marketInsights.globalSuccessRate.toFixed(1)}%</MarketValue>
              </MarketCard>
              <MarketCard>
                <MarketLabel>Valor Médio de Upgrade</MarketLabel>
                <MarketValue>{formatCurrency(analytics.marketInsights.averageUpgradeValue)}</MarketValue>
              </MarketCard>
              <MarketCard>
                <MarketLabel>Índice de Volatilidade</MarketLabel>
                <MarketValue>{analytics.marketInsights.volatilityIndex.toFixed(2)}</MarketValue>
              </MarketCard>
            </MarketGrid>
          </MarketSection>
        </AnalyticsSection>
      )}

      {activeTab === "history" && (
        <HistorySection>
          <SectionTitle>Histórico de Upgrades</SectionTitle>
          {history.length === 0 ? (
            <EmptyState>
              <Activity size={48} />
              <p>Nenhum upgrade realizado ainda</p>
            </EmptyState>
          ) : (
            <HistoryList>
              {history.map((upgrade) => (
                <HistoryCard key={upgrade._id} success={upgrade.success}>
                  <HistoryHeader>
                    <HistoryStatus success={upgrade.success}>
                      {upgrade.success ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {upgrade.success ? "Sucesso" : "Falhou"}
                    </HistoryStatus>
                    <HistoryDate>{formatDate(upgrade.timestamp)}</HistoryDate>
                  </HistoryHeader>

                  <HistoryContent>
                    <HistorySection>
                      <HistoryLabel>Itens Oferecidos</HistoryLabel>
                      <ItemsList>
                        {upgrade.offeredItems.map((item, index) => (
                          <HistoryItem key={index}>
                            <ItemName>{item.details.name}</ItemName>
                            <ItemValue>{formatCurrency(item.details.itemValue)}</ItemValue>
                            <ItemQuantity>x{item.quantity}</ItemQuantity>
                          </HistoryItem>
                        ))}
                      </ItemsList>
                      <TotalValue>Total: {formatCurrency(upgrade.totalOfferedValue)}</TotalValue>
                    </HistorySection>

                    <HistoryArrow>→</HistoryArrow>

                    <HistorySection>
                      <HistoryLabel>Item Alvo</HistoryLabel>
                      <TargetItem success={upgrade.success}>
                        <ItemName>{upgrade.targetItem.details.name}</ItemName>
                        <ItemValue>{formatCurrency(upgrade.targetItem.details.itemValue)}</ItemValue>
                      </TargetItem>
                    </HistorySection>
                  </HistoryContent>

                  <HistoryFooter>
                    <ProbabilityBadge>Probabilidade: {(upgrade.probability * 100).toFixed(1)}%</ProbabilityBadge>
                    {upgrade.success && (
                      <ProfitBadge>
                        Lucro: {formatCurrency(upgrade.targetItem.details.itemValue - upgrade.totalOfferedValue)}
                      </ProfitBadge>
                    )}
                  </HistoryFooter>
                </HistoryCard>
              ))}
            </HistoryList>
          )}
        </HistorySection>
      )}
    </Container>
  )
}

// Styled Components
const Container = styled.div`
  padding: 0.5rem;
  width: 100%;
  margin: 0 auto;
  color: #fff;
  font-family: 'Inter', sans-serif;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
`

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(139, 195, 74, 0.3);
  border-top: 3px solid #8bc34a;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
  color: #ef4444;
  
  p {
    font-size: 1.1rem;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
`

 
const TabNavigation = styled.div`
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #333;
  margin-bottom: 24px;
  width: 100%;
`

const Tab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.active ? "#3fc561" : "#666")};
  font-size: 14px;
  padding: 8px 9px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${(props) => (props.active ? "#3fc561" : "transparent")};
  }
  
  &:hover {
    color: ${(props) => (props.active ? "#3fc561" : "#999")};
  }
`

 

const AnalyticsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`

const MetricCard = styled.div`
  background-color: #38383b11;
 
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  
   
`

const MetricIcon = styled.div<{ success?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center; 
  background: ${(props) => (props.success ? "rgba(63, 197, 97, 0.2)" : "#38383b11")};
  color: ${(props) => (props.success ? "#3fc561" : "#6b7280")};
`

const MetricContent = styled.div`
  flex: 1;
`

const MetricValue = styled.div<{ profit?: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => (props.profit !== undefined ? (props.profit ? "#3fc561" : "#ef4444") : "#fff")};
  margin-bottom: 0.25rem;
`

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: #999;
`

const MetricSubtext = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
`

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  font-family: 'InterSemiBold', monospace;
  margin-bottom: 1rem;
`

const RiskSection = styled.div``

const RiskCard = styled.div`
  background-color: #38383b11;
  border-radius: 8px;
  padding: 1.5rem;
`

const RiskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const RiskLevel = styled.div<{ color: string }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.color};
  text-transform: uppercase;
`

const RiskScore = styled.div`
  font-size: 0.875rem;
  color: #999;
`

const RiskBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`

const RiskProgress = styled.div<{ width: number; color: string }>`
  width: ${(props) => props.width}%;
  height: 100%;
  background: ${(props) => props.color};
  transition: width 0.3s ease;
`

const RecommendationsSection = styled.div``

const RecommendationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const RecommendationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(48, 102, 61, 0.05);
 
  border-radius: 8px;
  font-size: 0.875rem;
  color: #e5e7eb;
  
  svg {
    color: #3fc561;
    margin-top: 0.125rem;
    flex-shrink: 0;
  }
`

const AchievementsSection = styled.div``

const AchievementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const AchievementCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  
  svg {
    color: #ffd700;
  }
`

const AchievementContent = styled.div`
  flex: 1;
`

const AchievementName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.25rem;
`

const AchievementDescription = styled.div`
  font-size: 0.875rem;
  color: #999;
  margin-bottom: 0.5rem;
`

const AchievementDate = styled.div`
  font-size: 0.75rem;
  color: #666;
`

const MarketSection = styled.div``

const MarketGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`

const MarketCard = styled.div`
  padding: 1.5rem;
  background-color: #38383b11;
  border-radius: 8px;
  text-align: center;
`

const MarketLabel = styled.div`
  font-size: 0.875rem;
  color: #999;
  margin-bottom: 0.5rem;
`

const MarketValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
`

const HistorySection = styled.div``

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
  
  svg {
    margin-bottom: 1rem;
  }
`

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const HistoryCard = styled.div<{ success: boolean }>`
  background-color: #38383b11;
  border: 1px solid ${(props) => (props.success ? "rgba(63, 197, 97, 0.2)" : "rgba(239, 68, 68, 0.2)")};
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${(props) => (props.success ? "rgba(63, 197, 97, 0.4)" : "rgba(239, 68, 68, 0.4)")};
  }
`

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const HistoryStatus = styled.div<{ success: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: ${(props) => (props.success ? "#3fc561" : "#ef4444")};
`

const HistoryDate = styled.div`
  font-size: 0.875rem;
  color: #999;
`

const HistoryContent = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const HistoryLabel = styled.div`
  font-size: 0.875rem;
  color: #999;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
`

const ItemName = styled.div`
  font-size: 0.875rem;
  color: #e5e7eb;
  flex: 1;
`

const ItemValue = styled.div`
  font-size: 0.875rem;
  color: #e4e9e5;
  font-weight: 500;
`

const ItemQuantity = styled.div`
  font-size: 0.75rem;
  color: #999;
  margin-left: 0.5rem;
`

const TotalValue = styled.div`
  font-weight: 600;
  color: #fff;
  text-align: right;
`

const HistoryArrow = styled.div`
  font-size: 1.5rem;
  color: #666;
  text-align: center;
  
  @media (max-width: 768px) {
    transform: rotate(90deg);
  }
`

const TargetItem = styled.div<{ success: boolean }>`
  padding: 0.6rem;
  background: ${(props) => (props.success ? "rgba(63, 197, 97, 0.1)" : "rgba(239, 68, 68, 0.1)")};
  
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HistoryFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const ProbabilityBadge = styled.div`
  padding: 0.5rem 1rem;
  background: rgba(107, 114, 128, 0.2);
  border-radius: 20px;
  font-size: 0.75rem;
  color: #9ca3af;
`

const ProfitBadge = styled.div`
  padding: 0.5rem 1rem;
  background: rgba(63, 197, 97, 0.2);
  border-radius: 20px;
  font-size: 0.75rem;
  color: #3fc561;
  font-weight: 500;
`
