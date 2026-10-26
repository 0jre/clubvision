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
  justify-content: between;
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

const ValidatorsSection = styled.div`
  margin-top: 32px;
`

const ValidatorCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ValidatorInfo = styled.div`
  flex: 1;
`

const ValidatorName = styled.div`
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
`

const ValidatorStats = styled.div`
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

export function StakingOverview() {
  const { fetchStakingOverview } = useWalletAPIx()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchStakingOverview()
      setData(response)
    } catch (error) {
      console.error("Error loading staking overview:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Carregando dados de staking...</LoadingSpinner>
      </Container>
    )
  }

  if (!data) {
    return (
      <Container>
        <div>Erro ao carregar dados de staking</div>
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
        <Title>Visão Geral do Staking</Title>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{formatNumber(data.overview.totalStakers)}</StatValue>
          <StatLabel>Total de Stakers</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatCurrency(data.overview.totalStaked)}</StatValue>
          <StatLabel>Total em Staking</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data.overview.activeStaking)}</StatValue>
          <StatLabel>Stakings Ativos</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data.overview.inactiveStaking)}</StatValue>
          <StatLabel>Stakings Inativos</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatCurrency(data.rewards.totalRewards)}</StatValue>
          <StatLabel>Total de Recompensas</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatCurrency(data.overview.avgStakingAmount)}</StatValue>
          <StatLabel>Média por Staking</StatLabel>
        </StatCard>
      </StatsGrid>

      <ValidatorsSection>
        <Title style={{ fontSize: "20px", marginBottom: "16px" }}>Validadores Mais Utilizados</Title>

        {data.validators.map((validator: any) => (
          <ValidatorCard key={validator._id}>
            <ValidatorInfo>
              <ValidatorName>{validator._id}</ValidatorName>
              <ValidatorStats>
                {formatNumber(validator.totalStakers)} stakers •{formatCurrency(validator.totalDelegated)} delegado •
                {validator.activeStaking} ativos
              </ValidatorStats>
            </ValidatorInfo>
          </ValidatorCard>
        ))}
      </ValidatorsSection>
    </Container>
  )
}
