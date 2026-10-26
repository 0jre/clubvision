"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import useWalletAPIx from "@/admin/hooks/use-wallet-api"

const Container = styled.div`
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 24px;
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

const PeriodSelector = styled.div`
  display: flex;
  gap: 8px;
`

const PeriodButton = styled.button<{ active: boolean }>`
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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`

const SummaryCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
`

const SummaryValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
`

const SummaryLabel = styled.div`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
`

const ChartContainer = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 24px;
  min-height: 300px;
`

const ChartTitle = styled.h3`
  color: #000;
  font-size: 18px;
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

export function MonetizationAnalytics() {
  const { fetchMonetizationAnalytics } = useWalletAPIx()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("30d")

  useEffect(() => {
    loadData()
  }, [period])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchMonetizationAnalytics(period)
      setData(response)
    } catch (error) {
      console.error("Error loading monetization analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-BR").format(num)
  }

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Carregando analytics...</LoadingSpinner>
      </Container>
    )
  }

  if (!data) {
    return (
      <Container>
        <div>Erro ao carregar analytics</div>
      </Container>
    )
  }

  const maxEarnings = Math.max(...data.earnings.map((item: any) => item.totalViews))
  const maxWithdrawals = Math.max(...data.withdrawals.map((item: any) => item.totalAmount))

  return (
    <Container>
      <Header>
        <Title> Analytics de Monetização</Title>
        <PeriodSelector>
          {["24h", "7d", "30d", "90d"].map((p) => (
            <PeriodButton key={p} active={period === p} onClick={() => setPeriod(p)}>
              {p}
            </PeriodButton>
          ))}
        </PeriodSelector>
      </Header>

      <SummaryGrid>
        <SummaryCard>
          <SummaryValue>{formatCurrency(data.summary.totalEarnings)}</SummaryValue>
          <SummaryLabel>Ganhos Totais</SummaryLabel>
        </SummaryCard>

        <SummaryCard>
          <SummaryValue>{formatCurrency(data.summary.totalWithdrawals)}</SummaryValue>
          <SummaryLabel>Total Sacado</SummaryLabel>
        </SummaryCard>

        <SummaryCard>
          <SummaryValue>{formatNumber(data.summary.totalPosts)}</SummaryValue>
          <SummaryLabel>Posts Criados</SummaryLabel>
        </SummaryCard>

        <SummaryCard>
          <SummaryValue>{formatNumber(data.summary.totalEngagement)}</SummaryValue>
          <SummaryLabel>Engajamento Total</SummaryLabel>
        </SummaryCard>

        <SummaryCard>
          <SummaryValue>{data.summary.avgEngagementRate.toFixed(1)}</SummaryValue>
          <SummaryLabel>Taxa de Engajamento</SummaryLabel>
        </SummaryCard>

        <SummaryCard>
          <SummaryValue>{data.summary.avgWithdrawalSuccessRate.toFixed(1)}%</SummaryValue>
          <SummaryLabel>Taxa de Sucesso</SummaryLabel>
        </SummaryCard>
      </SummaryGrid>

      <ChartContainer>
        <ChartTitle> Atividade de Conteúdo por Dia</ChartTitle>
        <SimpleChart>
          {data.earnings.map((item: any, index: number) => (
            <ChartBar
              key={index}
              height={(item.totalViews / maxEarnings) * 100}
              color="#28a745"
              data-value={`${item.date}: ${formatNumber(item.totalViews)} visualizações`}
            />
          ))}
        </SimpleChart>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle> Volume de Saques por Dia</ChartTitle>
        <SimpleChart>
          {data.withdrawals.map((item: any, index: number) => (
            <ChartBar
              key={index}
              height={(item.totalAmount / maxWithdrawals) * 100}
              color="#dc3545"
              data-value={`${item.date}: ${formatCurrency(item.totalAmount)} bits`}
            />
          ))}
        </SimpleChart>
      </ChartContainer>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <ChartContainer>
          <ChartTitle>Top Criadores por Engajamento</ChartTitle>
          {data.topCreators.slice(0, 10).map((creator: any, index: number) => (
            <div
              key={creator.userId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span style={{ color: "#000", fontWeight: "500" }}>
                {index + 1}. {creator.user?.name || "Usuário Desconhecido"}
              </span>
              <span style={{ color: "#666" }}>{formatNumber(creator.metrics.engagementScore)} pontos</span>
            </div>
          ))}
        </ChartContainer>

        <ChartContainer>
          <ChartTitle> Tipos de Conteúdo</ChartTitle>
          {data.contentTypes.map((type: any) => (
            <div
              key={type._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span style={{ color: "#000", fontWeight: "500" }}>{type._id || "Não especificado"}</span>
              <span style={{ color: "#666" }}>
                {formatNumber(type.count)} posts ({formatNumber(type.totalViews)} views)
              </span>
            </div>
          ))}
        </ChartContainer>
      </div>

      {data.retention && (
        <ChartContainer>
          <ChartTitle>Métricas de Retenção de Criadores</ChartTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", textAlign: "center" }}>
            <div>
              <SummaryValue>{formatNumber(data.retention.totalCreators || 0)}</SummaryValue>
              <SummaryLabel>Total de Criadores</SummaryLabel>
            </div>
            <div>
              <SummaryValue>{formatNumber(data.retention.activeCreators || 0)}</SummaryValue>
              <SummaryLabel>Criadores Ativos</SummaryLabel>
            </div>
            <div>
              <SummaryValue>{(data.retention.avgPostsPerCreator || 0).toFixed(1)}</SummaryValue>
              <SummaryLabel>Posts por Criador</SummaryLabel>
            </div>
            <div>
              <SummaryValue>
                {data.retention.totalCreators > 0
                  ? ((data.retention.activeCreators / data.retention.totalCreators) * 100).toFixed(1)
                  : 0}
                %
              </SummaryValue>
              <SummaryLabel>Taxa de Retenção</SummaryLabel>
            </div>
          </div>
        </ChartContainer>
      )}
    </Container>
  )
}
