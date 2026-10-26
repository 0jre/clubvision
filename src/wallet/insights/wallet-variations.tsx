"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, BarChart4 } from "lucide-react"
 
import { getActionDescription } from "@/components/vision/ui/charts"
import LoadingPageView from "@/resources/loading/market.loading"

// Interfaces
interface VariationData {
  change: number
  percentage: number
  status: "gain" | "loss" | "neutral"
  formattedChange: number
  formattedPercentage: string
  timeBasedAnalysis: {
    daily: VariationMetrics
    weekly: VariationMetrics
    monthly: VariationMetrics
  }
  trendAnalysis: {
    direction: "upward" | "downward" | "stable"
    strength: number
    consistency: number
    prediction: {
      nextDayEstimate: number
      confidence: number
    }
  }
  transactionImpact: {
    action: string
    totalImpact: number
    frequency: number
    averageImpact: number
  }[]
}

interface VariationMetrics {
  change: number
  percentage: number
  averageChange: number
  volatility: number
}

interface Transaction {
  date: string
  time: string
  amount: number
  action: string
  currency: string
  resultStatus?: string
  result?: string
  newAmount?: number
  uniqueId?: string
}

 

// Chart tooltip component
const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltip>
        <TooltipLabel>{label}</TooltipLabel>
        <TooltipValue> {payload[0].value.toFixed(2)}</TooltipValue>
      </CustomTooltip>
    )
  }

  return null
}

// Generate chart data based on real data or sample data
const generateChartData = (days: number, realData?: any[]) => {
  // If we have real data from the API, use it
  if (realData && realData.length > 0) {
    return realData.map((point) => ({
      date: point.date,
      value: point.balance,
    }))
  }

  // Otherwise generate sample data
  const data = []
  const today = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)

    // Generate a somewhat realistic balance progression
    const baseValue = 5000
    const randomFactor = Math.sin(i * 0.5) * 200 + Math.random() * 100
    const value = baseValue + i * 20 + randomFactor

    data.push({
      date: date.toISOString().split("T")[0],
      value: value,
    })
  }

  return data
}

// Simple function to process transactions into chart data
const processTransactionsForChart = (transactions: Transaction[], currentBalance: number) => {
  // Filtra e ordena transações por data e hora
  const sortedTxs = [...transactions]
    .filter((tx) => tx.currency === "coins")
    .sort((a, b) => {
      const dateA = parseDateTime(a.date, a.time)
      const dateB = parseDateTime(b.date, b.time)
      return dateA.getTime() - dateB.getTime()
    })

  // Mapa de datas para saldo acumulado
  const balanceMap = new Map<string, number>()
  let runningBalance = currentBalance

  // Processa do mais recente ao mais antigo
  for (let i = sortedTxs.length - 1; i >= 0; i--) {
    const tx = sortedTxs[i]
    const impact = calculateTransactionImpact(tx)
    runningBalance -= impact

    const dateObj = parseDateTime(tx.date, tx.time)
    if (!isNaN(dateObj.getTime())) {
      const dateStr = dateObj.toISOString().split("T")[0]
      balanceMap.set(dateStr, runningBalance)
    }
  }

  // Adiciona saldo atual para o dia de hoje
  const today = new Date().toISOString().split("T")[0]
  balanceMap.set(today, currentBalance)

  // Converte mapa para array ordenada por data
  const chartData = Array.from(balanceMap.entries())
    .map(([date, balance]) => ({ date, balance }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return chartData
}

// Função utilitária para criar Date com fallback
const parseDateTime = (dateStr: string, timeStr: string): Date => {
  const dateTime = new Date(`${dateStr}T${timeStr}`)
  if (isNaN(dateTime.getTime())) {
    // Tenta com espaço no lugar do 'T'
    return new Date(`${dateStr} ${timeStr}`)
  }
  return dateTime
}

// Calculate transaction impact (simplified version)
const calculateTransactionImpact = (tx: Transaction): number => {
  switch (tx.action) {
    case "convert_from_banking":
      return tx.amount
    case "convert_to_banking":
      return -tx.amount
    case "double_orbit":
      if (tx.resultStatus === "Perdeu") {
        return -tx.amount
      } else if (tx.resultStatus === "Ganhou") {
        return tx.newAmount || 0
      }
      return 0
    case "receive_orbs":
      return tx.amount
    case "post_creation":
      return -tx.amount
    case "receivetransfer":
      return tx.amount
    case "senttransfer":
      return -tx.amount
    case "staking_orbs":
      return -tx.amount
    case "funds":
      return tx.amount
    default:
      if (tx.action.startsWith("purchase_")) {
        return -tx.amount
      }
      return 0
  }
}

export default function WalletVariationDisplay({ userId }: { userId: string }) {
  const [data, setData] = useState<VariationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
 
  const [realChartData, setRealChartData] = useState<any[]>([])
  const [processedData, setProcessedData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
 
        // Fetch transaction data for chart
        const txResponse = await fetch(`/api/activity/wallet/insights/wallet-transactions?userId=${userId}`)
        if (txResponse.ok) {
          const txData = await txResponse.json()
          if (txData.transactions && txData.currentBalance) {
            // Process transactions to create time series data
            // This is a simplified version - in a real app, you'd use the wallet-utils functions
            // const processedDataResult = processTransactionsForChart(txData.transactions, txData.currentBalance)
            // setProcessedData(processedDataResult)
            // setRealChartData(processedDataResult)
          }
        }

        const response = await fetch(`/api/activity/wallet/insights/wallet-variation?userId=${userId}`)

        if (!response.ok) {
          throw new Error("Falha ao buscar dados de variação")
        }

        const result = await response.json()
        setData(result)

        // Generate chart data based on selected period
        // const days = chartPeriod === "week" ? 7 : chartPeriod === "month" ? 30 : 365
        // setChartData(generateChartData(days, processedData))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
        console.error("Erro ao buscar variação:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  // Update chart data when period changes
  // useEffect(() => {
  //   const days = chartPeriod === "week" ? 7 : chartPeriod === "month" ? 30 : 365
  //   setChartData(generateChartData(days, realChartData))
  // }, [chartPeriod, realChartData])

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingPageView />
        </LoadingContainer>
      </Container>
    )
  }

  if (error || !data) {
    return (
      <Container>
        <ErrorContainer>
          <p>Erro ao carregar dados de variação</p>
          {error && <p>{error}</p>}
        </ErrorContainer>
      </Container>
    )
  }

  const { status, formattedChange, formattedPercentage, timeBasedAnalysis, trendAnalysis, transactionImpact } = data

  return (
    <Container>
     
      <MetricsGrid>
        <MetricCard>
          <MetricHeader>
            <MetricIcon status={status}>
              {status === "gain" ? (
                <ArrowUpRight size={16} />
              ) : status === "loss" ? (
                <ArrowDownRight size={16} />
              ) : (
                <BarChart4 size={16} />
              )}
            </MetricIcon>
            <div>
              <MetricTitle>Variação Total</MetricTitle>
              <MetricValue status={status}>
                {formattedChange > 0 ? "+" : ""}
                {formattedChange.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </MetricValue>
              <MetricSubValue>{formattedPercentage}</MetricSubValue>
            </div>
          </MetricHeader>
        </MetricCard>

        <MetricCard>
          <MetricHeader>
            <MetricIcon
              status={
                trendAnalysis.direction === "upward"
                  ? "gain"
                  : trendAnalysis.direction === "downward"
                    ? "loss"
                    : "neutral"
              }
            >
              {trendAnalysis.direction === "upward" ? (
                <TrendingUp size={16} />
              ) : trendAnalysis.direction === "downward" ? (
                <TrendingDown size={16} />
              ) : (
                <BarChart4 size={16} />
              )}
            </MetricIcon>
            <div>
              <MetricTitle>Tendência</MetricTitle>
              <MetricValue
                status={
                  trendAnalysis.direction === "upward"
                    ? "gain"
                    : trendAnalysis.direction === "downward"
                      ? "loss"
                      : "neutral"
                }
              >
                {trendAnalysis.direction === "upward"
                  ? "Em alta"
                  : trendAnalysis.direction === "downward"
                    ? "Em queda"
                    : "Estável"}
              </MetricValue>
              <MetricSubValue>{Math.round(trendAnalysis.consistency * 100)}% consistência</MetricSubValue>
            </div>
          </MetricHeader>
        </MetricCard>
      </MetricsGrid>

      <SectionTitle>Impacto por Tipo de Transação</SectionTitle>
      <ImpactList>
        {transactionImpact.slice(0, 3).map((impact, index) => {
          const maxImpact = Math.max(...transactionImpact.map((i) => Math.abs(i.totalImpact)))
          const widthPercentage = (Math.abs(impact.totalImpact) / maxImpact) * 100
         
          return (
            <ImpactItem key={index}>
              <ImpactHeader>
                <ImpactAction>{getActionDescription(impact.action)}</ImpactAction>
                <ImpactValue positive={impact.totalImpact >= 0}>
                  {impact.totalImpact > 0 ? "+" : ""}
                  {impact.totalImpact.toFixed(2)}
                </ImpactValue>
              </ImpactHeader>
              <ImpactDetails>
                <span>Frequência: {impact.frequency}x</span>
                <span>
                  Média: {impact.averageImpact > 0 ? "+" : ""}
                  {impact.averageImpact.toFixed(2)}
                </span>
              </ImpactDetails>
              <ImpactBarContainer>
                <ImpactBar width={Math.min(100, widthPercentage)} positive={impact.totalImpact >= 0} />
              </ImpactBarContainer>
            </ImpactItem>
          )
        })}
      </ImpactList>
    </Container>
  )
}



// Styled Components
const Container = styled.div`
  margin-bottom: 2rem;
`

const ChartContainer = styled.div`
  height: 200px;
  margin-bottom: 1.5rem;
  border-radius: 0.75rem;
  overflow: hidden;
   background: linear-gradient(0deg, #202220, #1f201f);
  padding: 1rem;
`

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`

const ChartTitle = styled.h3<{ theme: any }>`
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  color: ${(props) => props.theme.textSecondary};
`

const ChartPeriodSelector = styled.div`
  display: flex;
  gap: 0.5rem;
`

const PeriodButton = styled.button<{ theme: any, active: boolean }>`
   background-color: ${(props) => (props.active ? "rgb(49, 192, 121)" : 'rgb(32, 34, 33)')} ;
  color: ${(props) => (props.active ? "white" : props.theme.textSecondary)};
  border: none;
  border-radius: 1rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
    cursor: var(--f-cursor-pointer);
  transition: all 0.2s;
  
  &:hover {
    background: ${(props) => (props.active ? props.theme.primary : props.theme.hoverBackground)};
  }
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const MetricCard = styled.div`
 
  padding: 0.6rem;
`

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`

const MetricIcon = styled.div<{ status?: "gain" | "loss" | "neutral" }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  background-color: ${(props) => {
    if (props.status === "gain") return "rgba(74, 222, 128, 0.2)"
    if (props.status === "loss") return "rgba(248, 113, 113, 0.2)"
    return "rgba(156, 163, 175, 0.2)"
  }};
  
  svg {
    color: ${(props) => {
      if (props.status === "gain") return "#4ADE80"
      if (props.status === "loss") return "#F87171"
      return "#9CA3AF"
    }};
  }
`

const MetricTitle = styled.p<{ theme: any }>`
  font-size: 0.75rem;
  color: ${(props) => props.theme.textSecondary};
  margin: 0;
`

const MetricValue = styled.p<{ theme: any, status?: "gain" | "loss" | "neutral" }>`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.25rem 0 0;
  color: ${(props) => {
    if (props.status === "gain") return "#4ADE80"
    if (props.status === "loss") return "#F87171"
    return props.theme.textPrimary
  }};
`

const MetricSubValue = styled.p<{ theme: any }>`
  font-size: 0.75rem;
  color: ${(props) => props.theme.textSecondary};
  margin: 0.25rem 0 0;
`

const SectionTitle = styled.h3<{ theme: any }>`
  font-size: 1rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
  color: ${(props) => props.theme.textPrimary};
`

const ImpactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const ImpactItem = styled.div`
  background: linear-gradient(0deg, #202220, #1f201f);
  border-radius: 0.75rem;
  padding: 1rem;
`

const ImpactHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`

const ImpactAction = styled.span<{ theme: any }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.textPrimary};
`

const ImpactValue = styled.span<{ positive: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => (props.positive ? "#4ADE80" : "#F87171")};
`

const ImpactDetails = styled.div<{ theme: any }>`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${(props) => props.theme.textSecondary};
`

const ImpactBarContainer = styled.div`
  width: 100%;
  height: 0.25rem;
    background: linear-gradient(0deg, #202220, #1f201f);
  border-radius: 9999px;
  margin-top: 0.75rem;
  overflow: hidden;
`

const ImpactBar = styled.div<{ width: number; positive: boolean }>`
  height: 100%;
  width: ${(props) => `${props.width}%`};
  background-color: ${(props) => (props.positive ? "#4ADE80" : "#F87171")};
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`

const LoadingSpinner = styled.div<{ theme: any }>`
  border: 3px solid ${(props) => props.theme.border};
  border-top: 3px solid ${(props) => props.theme.primary};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #F87171;
`

const CustomTooltip = styled.div<{ theme: any }>`
  background: linear-gradient(0deg, #202220, #1f201f);
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.border};
`

const TooltipLabel = styled.p<{ theme: any }>`
  font-size: 0.75rem;
  color: ${(props) => props.theme.textSecondary};
  margin: 0 0 0.25rem;
`

const TooltipValue = styled.p<{ theme: any }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.textPrimary};
  margin: 0;
`