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

const StatChange = styled.div<{ positive?: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.positive ? "#28a745" : "#dc3545")};
  margin-top: 4px;
`

const SectionTitle = styled.h3`
  color: #000;
  font-size: 20px;
  font-weight: 600;
  margin: 32px 0 16px 0;
`

const TopItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`

const ItemCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ItemInfo = styled.div`
  flex: 1;
`

const ItemName = styled.div`
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
`

const ItemStats = styled.div`
  font-size: 14px;
  color: #666;
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
`

export function CheckoutOverview() {
  const { fetchCheckoutOverview } = useWalletAPIx()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("24h")

  useEffect(() => {
    loadData()
  }, [timeframe])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchCheckoutOverview(timeframe)
      setData(response)
    } catch (error) {
      console.error("Error loading checkout overview:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Carregando dados de checkout...</LoadingSpinner>
      </Container>
    )
  }

  if (!data) {
    return (
      <Container>
        <div>Erro ao carregar dados de checkout</div>
      </Container>
    )
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-BR").format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`
  }

  return (
    <Container>
      <Header>
        <Title>Visão Geral do Checkout</Title>
        <TimeframeSelector>
          {["1h", "24h", "7d", "30d"].map((period) => (
            <TimeframeButton key={period} active={timeframe === period} onClick={() => setTimeframe(period)}>
              {period}
            </TimeframeButton>
          ))}
        </TimeframeSelector>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{formatNumber(data.overview.totalCheckouts)}</StatValue>
          <StatLabel>Total de Checkouts</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data.overview.completedCheckouts)}</StatValue>
          <StatLabel>Checkouts Completados</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data.overview.activeCheckouts)}</StatValue>
          <StatLabel>Checkouts Ativos</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatPercentage(data.overview.conversionRate)}</StatValue>
          <StatLabel>Taxa de Conversão</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatCurrency(data.overview.totalRevenue)}</StatValue>
          <StatLabel>Receita Total</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatCurrency(data.overview.avgOrderValue)}</StatValue>
          <StatLabel>Ticket Médio</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data.overview.expiredCheckouts)}</StatValue>
          <StatLabel>Checkouts Expirados</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionTitle> Itens Mais Vendidos</SectionTitle>
      <TopItemsGrid>
        {data.topItems.map((item: any) => (
          <ItemCard key={item._id}>
            <ItemInfo>
              <ItemName>{item.name}</ItemName>
              <ItemStats>
                {formatNumber(item.count)} vendas • {formatCurrency(item.totalRevenue)} receita
              </ItemStats>
            </ItemInfo>
          </ItemCard>
        ))}
      </TopItemsGrid>

      <SectionTitle>Top Compradores</SectionTitle>
      <TopItemsGrid>
        {data.topUsers.map((user: any) => (
          <ItemCard key={user.userId}>
            <ItemInfo>
              <ItemName>{user.user?.name || "Usuário Desconhecido"}</ItemName>
              <ItemStats>
                {formatNumber(user.totalTransactions)} compras • {formatCurrency(user.totalSpent)} gasto
              </ItemStats>
            </ItemInfo>
          </ItemCard>
        ))}
      </TopItemsGrid>

      <SectionTitle> Métodos de Pagamento</SectionTitle>
      <TopItemsGrid>
        {data.paymentMethods.map((method: any) => (
          <ItemCard key={method._id}>
            <ItemInfo>
              <ItemName>{method._id || "Não especificado"}</ItemName>
              <ItemStats>
                {formatNumber(method.count)} transações • {formatCurrency(method.totalAmount)} volume
              </ItemStats>
            </ItemInfo>
          </ItemCard>
        ))}
      </TopItemsGrid>
    </Container>
  )
}
