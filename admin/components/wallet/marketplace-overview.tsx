"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import useWalletAPIx  from "@/admin/hooks/use-wallet-api"

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

export function MarketplaceOverview() {
  const { fetchMarketplaceOverview } = useWalletAPIx()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchMarketplaceOverview()
      setData(response)
    } catch (error) {
      console.error("Error loading marketplace overview:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Carregando dados do marketplace...</LoadingSpinner>
      </Container>
    )
  }

  if (!data) {
    return (
      <Container>
        <div>Erro ao carregar dados do marketplace</div>
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

  return (
    <Container>
      <Header>
        <Title> Visão Geral do Marketplace</Title>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{formatNumber(data.overview.totalCasesOpened)}</StatValue>
          <StatLabel>Caixas Abertas (30d)</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data.overview.totalTokensSpent)}</StatValue>
          <StatLabel>V-Tokens Gastos</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data.overview.activeListings)}</StatValue>
          <StatLabel>Anúncios Ativos</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data.overview.completedSales)}</StatValue>
          <StatLabel>Vendas Completadas</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatCurrency(data.overview.marketplaceVolume)}</StatValue>
          <StatLabel>Volume do Marketplace</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data.overview.totalUpgrades)}</StatValue>
          <StatLabel>Total de Upgrades</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{data.overview.upgradeSuccessRate.toFixed(1)}%</StatValue>
          <StatLabel>Taxa de Sucesso</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatCurrency(data.overview.upgradeVolume)}</StatValue>
          <StatLabel>Volume de Upgrades</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionTitle> Itens Mais Negociados</SectionTitle>
      <TopItemsGrid>
        {data.topItems.map((item: any) => (
          <ItemCard key={item._id}>
            <ItemInfo>
              <ItemName>Item ID: {item._id}</ItemName>
              <ItemStats>
                {formatNumber(item.count)} vendas • Média: {formatCurrency(item.avgPrice)}
              </ItemStats>
            </ItemInfo>
          </ItemCard>
        ))}
      </TopItemsGrid>

      <SectionTitle>Top Traders</SectionTitle>
      <TopItemsGrid>
        {data.topTraders.map((trader: any) => (
          <ItemCard key={trader._id}>
            <ItemInfo>
              <ItemName>{trader.userInfo[0]?.name || "Usuário Desconhecido"}</ItemName>
              <ItemStats>
                {formatNumber(trader.totalUpgrades)} upgrades •{" "}
                {((trader.successfulUpgrades / trader.totalUpgrades) * 100).toFixed(1)}% sucesso
              </ItemStats>
            </ItemInfo>
          </ItemCard>
        ))}
      </TopItemsGrid>
    </Container>
  )
}
