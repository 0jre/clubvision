"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import useWalletAPIx from "@/admin/hooks/use-wallet-api"

const Container = styled.div`
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 16px;
`

const Title = styled.h2`
  color: #000;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`

const TimeframeSelector = styled.div`
  display: flex;
  gap: 8px;
`

const TimeframeButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background: ${(props) => (props.active ? "#000" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#000")};
  border: 1px solid #000;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: ${(props) => (props.active ? "#000" : "#f5f5f5")};
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`

const StatCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
`

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #000;
  margin-bottom: 8px;
`

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const SectionTitle = styled.h3`
  color: #000;
  font-size: 20px;
  font-weight: 600;
  margin: 32px 0 16px 0;
`

const TopCreatorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`

const CreatorCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ddd;
`

const CreatorInfo = styled.div`
  flex: 1;
`

const CreatorName = styled.div`
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
`

const CreatorStats = styled.div`
  font-size: 14px;
  color: #666;
`

const StatusBadge = styled.span<{ type: "prime" | "verified" | "level" }>`
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 4px;

  ${(props) => {
    switch (props.type) {
      case "prime":
        return "background: #ffd700; color: #000;"
      case "verified":
        return "background: #28a745; color: white;"
      case "level":
        return "background: #007bff; color: white;"
      default:
        return "background: #e9ecef; color: #495057;"
    }
  }}
`

const ChartContainer = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 24px;
  min-height: 300px;
`

const ChartTitle = styled.h4`
  color: #000;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
`

const SimpleChart = styled.div`
  display: flex;
  align-items: end;
  gap: 4px;
  height: 200px;
  padding: 20px 0;
`

const ChartBar = styled.div<{ height: number; color?: string }>`
  flex: 1;
  background: ${(props) => props.color || "#007bff"};
  height: ${(props) => props.height}%;
  min-height: 2px;
  border-radius: 2px 2px 0 0;
  position: relative;
  
  &:hover::after {
    content: attr(data-value);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
`

export function MonetizationOverview() {
  const { fetchMonetizationOverview } = useWalletAPIx()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("30d")

  useEffect(() => {
    loadData()
  }, [timeframe])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchMonetizationOverview(timeframe)
      setData(response)
    } catch (error) {
      console.error("Error loading monetization overview:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Carregando dados de monetização...</LoadingSpinner>
      </Container>
    )
  }

  if (!data) {
    return (
      <Container>
        <div>Erro ao carregar dados de monetização</div>
      </Container>
    )
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-BR").format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  const maxWithdrawals = Math.max(...data.dailyWithdrawals.map((item: any) => item.totalAmount))

  return (
    <Container>
      <Header>
        <Title> Visão Geral da Monetização</Title>
        <TimeframeSelector>
          {["24h", "7d", "30d", "90d"].map((period) => (
            <TimeframeButton key={period} active={timeframe === period} onClick={() => setTimeframe(period)}>
              {period}
            </TimeframeButton>
          ))}
        </TimeframeSelector>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{formatNumber(data.overview.totalCreators)}</StatValue>
          <StatLabel>Total de Criadores</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data.overview.eligibleUsers)}</StatValue>
          <StatLabel>Criadores Elegíveis</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatCurrency(data.overview.totalRescue)}</StatValue>
          <StatLabel>Total de Rescue</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatCurrency(data.overview.totalBits)}</StatValue>
          <StatLabel>Total de Bits</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data.overview.totalPosts)}</StatValue>
          <StatLabel>Posts Criados</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data.overview.totalViews)}</StatValue>
          <StatLabel>Visualizações</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data.overview.totalEngagement)}</StatValue>
          <StatLabel>Engajamento Total</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatCurrency(data.overview.avgRescue)}</StatValue>
          <StatLabel>Rescue Médio</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionTitle> Saques por Dia</SectionTitle>
      <ChartContainer>
        <ChartTitle>Volume de Saques</ChartTitle>
        <SimpleChart>
          {data.dailyWithdrawals.map((item: any, index: number) => (
            <ChartBar
              key={index}
              height={(item.totalAmount / maxWithdrawals) * 100}
              color="#28a745"
              data-value={`${item.date}: ${formatCurrency(item.totalAmount)} bits`}
            />
          ))}
        </SimpleChart>
      </ChartContainer>

      <SectionTitle> Top Criadores</SectionTitle>
      <TopCreatorsGrid>
        {data.topCreators.map((creator: any) => (
          <CreatorCard key={creator.userId}>
            <Avatar src={creator.user?.avatar || "/placeholder.svg?height=48&width=48"} alt="Avatar" />
            <CreatorInfo>
              <CreatorName>
                {creator.user?.name || "Usuário Desconhecido"}
                {creator.isPrime && <StatusBadge type="prime">Prime</StatusBadge>}
                {creator.isVerified && <StatusBadge type="verified">✓</StatusBadge>}
                {creator.level >= 10 && <StatusBadge type="level">Lv{creator.level}</StatusBadge>}
              </CreatorName>
              <CreatorStats>
                {formatCurrency(creator.rescue)} rescue • {formatCurrency(creator.bits)} bits
              </CreatorStats>
            </CreatorInfo>
          </CreatorCard>
        ))}
      </TopCreatorsGrid>

      <SectionTitle> Status dos Saques</SectionTitle>
      <TopCreatorsGrid>
        {data.withdrawalStats.map((stat: any) => (
          <CreatorCard key={stat._id}>
            <CreatorInfo>
              <CreatorName>{stat._id || "Não especificado"}</CreatorName>
              <CreatorStats>
                {formatNumber(stat.count)} saques • {formatCurrency(stat.totalAmount)} bits • Média:{" "}
                {formatCurrency(stat.avgAmount)}
              </CreatorStats>
            </CreatorInfo>
          </CreatorCard>
        ))}
      </TopCreatorsGrid>

      <SectionTitle>Distribuição de Ganhos</SectionTitle>
      <TopCreatorsGrid>
        {data.earningsDistribution.map((range: any) => (
          <CreatorCard key={range._id}>
            <CreatorInfo>
              <CreatorName>
                {typeof range._id === "number" ? `${formatCurrency(range._id)}+` : range._id} rescue
              </CreatorName>
              <CreatorStats>
                {formatNumber(range.count)} criadores • Média: {formatCurrency(range.avgRescue)}
              </CreatorStats>
            </CreatorInfo>
          </CreatorCard>
        ))}
      </TopCreatorsGrid>
    </Container>
  )
}
