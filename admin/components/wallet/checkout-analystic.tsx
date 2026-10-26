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

export function CheckoutAnalytics() {
  const { fetchCheckoutAnalytics } = useWalletAPIx()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("7d")

  useEffect(() => {
    loadData()
  }, [period])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchCheckoutAnalytics(period)
      setData(response)
    } catch (error) {
      console.error("Error loading checkout analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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

  const maxRevenue = Math.max(...data.revenue.map((item: any) => item.revenue))
  const maxConversion = Math.max(...data.conversion.map((item: any) => item.conversionRate))

  return (
    <Container>
      <Header>
        <Title>Analytics de Checkout</Title>
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
          <SummaryValue>{formatCurrency(data.summary.totalRevenue)}</SummaryValue>
          <SummaryLabel>Receita Total</SummaryLabel>
        </SummaryCard>

        <SummaryCard>
          <SummaryValue>{formatNumber(data.summary.totalTransactions)}</SummaryValue>
          <SummaryLabel>Total de Transações</SummaryLabel>
        </SummaryCard>

        <SummaryCard>
          <SummaryValue>{formatNumber(data.summary.totalItems)}</SummaryValue>
          <SummaryLabel>Itens Vendidos</SummaryLabel>
        </SummaryCard>

        <SummaryCard>
          <SummaryValue>{formatCurrency(data.summary.avgOrderValue)}</SummaryValue>
          <SummaryLabel>Ticket Médio</SummaryLabel>
        </SummaryCard>

        <SummaryCard>
          <SummaryValue>{data.summary.avgConversionRate.toFixed(1)}%</SummaryValue>
          <SummaryLabel>Taxa de Conversão</SummaryLabel>
        </SummaryCard>
      </SummaryGrid>

      <ChartContainer>
        <ChartTitle>Receita por Dia</ChartTitle>
        <SimpleChart>
          {data.revenue.map((item: any, index: number) => (
            <ChartBar
              key={index}
              height={(item.revenue / maxRevenue) * 100}
              color="#28a745"
              data-value={`${item.date}: ${formatCurrency(item.revenue)}`}
            />
          ))}
        </SimpleChart>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>Taxa de Conversão por Dia</ChartTitle>
        <SimpleChart>
          {data.conversion.map((item: any, index: number) => (
            <ChartBar
              key={index}
              height={(item.conversionRate / maxConversion) * 100}
              color="#141516"
              data-value={`${item.date}: ${item.conversionRate.toFixed(1)}%`}
            />
          ))}
        </SimpleChart>
      </ChartContainer>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <ChartContainer>
          <ChartTitle>Top Itens Vendidos</ChartTitle>
          {data.topItems.slice(0, 10).map((item: any, index: number) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span style={{ color: "#000", fontWeight: "500" }}>
                {index + 1}. {item.name}
              </span>
              <span style={{ color: "#666" }}>{formatNumber(item.totalSold)} vendas</span>
            </div>
          ))}
        </ChartContainer>

        <ChartContainer>
          <ChartTitle> Métodos de Pagamento</ChartTitle>
          {data.paymentMethods.map((method: any) => (
            <div
              key={method._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span style={{ color: "#000", fontWeight: "500" }}>{method._id || "Não especificado"}</span>
              <span style={{ color: "#666" }}>
                {formatNumber(method.count)} ({formatCurrency(method.revenue)})
              </span>
            </div>
          ))}
        </ChartContainer>
      </div>
    </Container>
  )
}
