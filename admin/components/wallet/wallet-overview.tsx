"use client"

import { useState } from "react"
import styled from "styled-components"
import { useWalletOverview } from "@/admin/hooks/use-wallet-api"

const Container = styled.div`
  padding: 24px;
  background-color: white;
  min-height: 100vh;
`

const Header = styled.div`
  margin-bottom: 32px;
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: black;
  margin: 0 0 8px 0;
`

const Subtitle = styled.p`
  color: #666;
  margin: 0;
`

const TimeframeSelector = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-end;
`

const TimeframeButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background-color: ${(props) => (props.active ? "black" : "transparent")};
  color: ${(props) => (props.active ? "white" : "black")};
  border: 1px solid black;
  border-radius: ${(props) => (props.active ? "6px" : "0")};
  cursor: pointer;
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  
  &:first-child {
    border-radius: 6px 0 0 6px;
  }
  
  &:last-child {
    border-radius: 0 6px 6px 0;
  }
  
  &:hover {
    background-color: ${(props) => (props.active ? "black" : "#f5f5f5")};
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
`

const StatCard = styled.div`
  background-color: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const StatTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: black;
`

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  color: black;
`

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
`

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #dc2626;
`

const RetryButton = styled.button`
  padding: 8px 16px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 16px;
  
  &:hover {
    background-color: #333;
  }
`

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
`

const ChartCard = styled.div`
  background-color: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: black;
`

export function WalletOverview() {
  const [timeframe, setTimeframe] = useState("7d")
  const { data, loading, error, refetch } = useWalletOverview(timeframe)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("pt-BR").format(value)
  }

  return (
    <Container>
      <Header>
        <Title>Visão Geral da Carteira</Title>
        <Subtitle>Estatísticas e métricas do sistema de carteira da plataforma</Subtitle>
      </Header>

      <TimeframeSelector>
        {["24h", "7d", "30d", "90d"].map((period) => (
          <TimeframeButton key={period} active={timeframe === period} onClick={() => setTimeframe(period)}>
            {period}
          </TimeframeButton>
        ))}
      </TimeframeSelector>

      {loading ? (
        <LoadingContainer>
          <p>Carregando estatísticas da carteira...</p>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <p>Erro ao carregar estatísticas: {error}</p>
          <RetryButton onClick={() => refetch()}>Tentar novamente</RetryButton>
        </ErrorContainer>
      ) : (
        <>
          <StatsGrid>
            <StatCard>
              <StatTitle>Usuários</StatTitle>
              <StatValue>{formatNumber(data?.overview?.totalUsers || 0)}</StatValue>
              <StatLabel>Total de usuários</StatLabel>
            </StatCard>

            <StatCard>
              <StatTitle>Carteiras Ativas</StatTitle>
              <StatValue>{formatNumber(data?.overview?.activeWallets || 0)}</StatValue>
              <StatLabel>Com saldo positivo</StatLabel>
            </StatCard>

            <StatCard>
              <StatTitle>Usuários Prime</StatTitle>
              <StatValue>{formatNumber(data?.overview?.primeUsers || 0)}</StatValue>
              <StatLabel>Assinantes premium</StatLabel>
            </StatCard>

            <StatCard>
              <StatTitle>Carteiras Inativas</StatTitle>
              <StatValue>{formatNumber(data?.overview?.inactiveWallets || 0)}</StatValue>
              <StatLabel>Sem saldo</StatLabel>
            </StatCard>
          </StatsGrid>

          <StatsGrid>
            <StatCard>
              <StatTitle>Total em Coins</StatTitle>
              <StatValue>{formatCurrency(data?.balances?.totalCoins || 0)}</StatValue>
              <StatLabel>Saldo total em ORBs</StatLabel>
            </StatCard>

            <StatCard>
              <StatTitle>Total em Bits</StatTitle>
              <StatValue>{formatCurrency(data?.balances?.totalBits || 0)}</StatValue>
              <StatLabel>Saldo total em Bits</StatLabel>
            </StatCard>

            <StatCard>
              <StatTitle>Total Banking</StatTitle>
              <StatValue>{formatCurrency(data?.balances?.totalBanking || 0)}</StatValue>
              <StatLabel>Saldo total bancário</StatLabel>
            </StatCard>

            <StatCard>
              <StatTitle>Volume de Jogos</StatTitle>
              <StatValue>{formatCurrency(data?.gaming?.totalWinnings || 0)}</StatValue>
              <StatLabel>Total ganho em jogos</StatLabel>
            </StatCard>
          </StatsGrid>

          <ChartsGrid>
            <ChartCard>
              <ChartTitle>Transações por Tipo</ChartTitle>
              {data?.transactions?.byAction?.map((action: any) => (
                <div
                  key={action._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    padding: "8px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "4px",
                  }}
                >
                  <span style={{ color: "black", fontSize: "14px" }}>{action._id.replace(/_/g, " ")}</span>
                  <span style={{ color: "#666", fontSize: "14px", fontWeight: "600" }}>
                    {formatNumber(action.count)}
                  </span>
                </div>
              ))}
            </ChartCard>

            <ChartCard>
              <ChartTitle>Atividade de Gaming</ChartTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <StatValue style={{ fontSize: "20px" }}>{formatNumber(data?.gaming?.totalBets || 0)}</StatValue>
                  <StatLabel>Total de apostas</StatLabel>
                </div>
                <div>
                  <StatValue style={{ fontSize: "20px" }}>{formatNumber(data?.gaming?.totalTransfers || 0)}</StatValue>
                  <StatLabel>Transferências</StatLabel>
                </div>
                <div>
                  <StatValue style={{ fontSize: "20px" }}>
                    {formatCurrency(data?.gaming?.totalStorePayments || 0)}
                  </StatValue>
                  <StatLabel>Compras na loja</StatLabel>
                </div>
                <div>
                  <StatValue style={{ fontSize: "20px", color: data?.gaming?.totalWinnings > 0 ? "#10b981" : "#666" }}>
                    {data?.gaming?.totalWinnings > 0 ? "✅" : "⚠️"}
                  </StatValue>
                  <StatLabel>Status dos jogos</StatLabel>
                </div>
              </div>
            </ChartCard>
          </ChartsGrid>
        </>
      )}
    </Container>
  )
}
