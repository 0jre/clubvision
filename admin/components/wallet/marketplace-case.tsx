"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import useWalletAPIx  from "@/admin/hooks/use-wallet-api"

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

const ActionButton = styled.button`
  background: #000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #333;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`

const StatCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
`

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
`

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
`

const SectionTitle = styled.h3`
  color: #000;
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 16px 0;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
`

const Th = styled.th`
  background: #f8f9fa;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
  color: #000;
`

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  color: #333;
`

const RarityBadge = styled.span<{ rarity: string }>`
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;

  ${(props) => {
    switch (props.rarity) {
      case "épico":
      case "epico":
        return "background: #6f42c1; color: white;"
      case "raro":
        return "background: #007bff; color: white;"
      case "comum":
        return "background: #6c757d; color: white;"
      default:
        return "background: #e9ecef; color: #495057;"
    }
  }}
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f0f0f0;
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
`

export function MarketplaceCases() {
  const { fetchMarketplaceCases, performCaseAction } = useWalletAPIx()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchMarketplaceCases()
      setData(response)
    } catch (error) {
      console.error("Error loading case data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string) => {
    try {
      setActionLoading(true)
      await performCaseAction(action)
      await loadData()
    } catch (error) {
      console.error("Error performing action:", error)
    } finally {
      setActionLoading(false)
    }
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

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Carregando dados de caixas...</LoadingSpinner>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>Gerenciamento de Caixas</Title>
        <div style={{ display: "flex", gap: "8px" }}>
          <ActionButton onClick={() => handleAction("refresh_items")} disabled={actionLoading}>
             Atualizar Itens
          </ActionButton>
        </div>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{data?.openBoxData.currentItems}</StatValue>
          <StatLabel>Itens Disponíveis</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>
            {data?.openBoxData.nextUpdate ? new Date(data.openBoxData.nextUpdate).toLocaleDateString() : "N/A"}
          </StatValue>
          <StatLabel>Próxima Atualização</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{data?.userStats.length}</StatValue>
          <StatLabel>Usuários Ativos</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{data?.itemStats.length}</StatValue>
          <StatLabel>Tipos de Itens</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionTitle> Estatísticas por Raridade</SectionTitle>
      <Table>
        <thead>
          <tr>
            <Th>Raridade</Th>
            <Th>Quantidade</Th>
            <Th>Valor Total</Th>
            <Th>Valor Médio</Th>
          </tr>
        </thead>
        <tbody>
          {data?.rarityStats.map((stat: any) => (
            <tr key={stat._id}>
              <Td>
                <RarityBadge rarity={stat._id}>{stat._id}</RarityBadge>
              </Td>
              <Td>{formatNumber(stat.count)}</Td>
              <Td>{formatCurrency(stat.totalValue)}</Td>
              <Td>{formatCurrency(stat.totalValue / stat.count)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <SectionTitle> Top Usuários (Caixas Abertas)</SectionTitle>
      <Table>
        <thead>
          <tr>
            <Th>Usuário</Th>
            <Th>Caixas Abertas</Th>
            <Th>Total Gasto</Th>
            <Th>Média por Caixa</Th>
            <Th>Última Abertura</Th>
          </tr>
        </thead>
        <tbody>
          {data?.userStats.slice(0, 10).map((user: any) => (
            <tr key={user.userId}>
              <Td>
                <UserInfo>
                  <Avatar src={user.user?.avatar || "/placeholder-avatar.png"} alt="Avatar" />
                  <div>{user.user?.name || "Usuário Desconhecido"}</div>
                </UserInfo>
              </Td>
              <Td>{formatNumber(user.totalCases)}</Td>
              <Td>{formatNumber(user.totalSpent)} V-Tokens</Td>
              <Td>{formatNumber(user.avgSpent)} V-Tokens</Td>
              <Td>{new Date(user.lastOpened).toLocaleDateString("pt-BR")}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <SectionTitle> Itens Mais Obtidos</SectionTitle>
      <Table>
        <thead>
          <tr>
            <Th>Item ID</Th>
            <Th>Quantidade</Th>
            <Th>Valor Total</Th>
            <Th>Valor Médio</Th>
            <Th>Raridade</Th>
          </tr>
        </thead>
        <tbody>
          {data?.itemStats.slice(0, 10).map((item: any) => (
            <tr key={item._id}>
              <Td>{item._id}</Td>
              <Td>{formatNumber(item.count)}</Td>
              <Td>{formatCurrency(item.totalValue)}</Td>
              <Td>{formatCurrency(item.avgValue)}</Td>
              <Td>
                <RarityBadge rarity={item.rarity}>{item.rarity}</RarityBadge>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}
