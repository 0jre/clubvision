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

const Filters = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #000;
  }
`

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #000;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
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
  cursor: pointer;

  &:hover {
    background: #e9ecef;
  }
`

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  color: #333;
`

const StatusBadge = styled.span<{ success: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${(props) => (props.success ? "#28a745" : "#dc3545")};
  color: white;
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

const ActionButton = styled.button`
  background: #000;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: #333;
  }
`

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
`

const PaginationButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f8f9fa;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
`

export function MarketplaceUpgrades() {
  const { fetchMarketplaceUpgrades, performUpgradeAction } = useWalletAPIx()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    userId: "",
    success: "",
    sortBy: "timestamp",
    sortOrder: "desc",
    page: 1,
  })

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchMarketplaceUpgrades(filters)
      setData(response)
    } catch (error) {
      console.error("Error loading upgrades:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : Number(value),
    }))
  }

  const handleAction = async (action: string, upgradeId: string) => {
    try {
      await performUpgradeAction(action, upgradeId)
      await loadData()
    } catch (error) {
      console.error("Error performing action:", error)
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

  if (loading && !data) {
    return (
      <Container>
        <LoadingSpinner>Carregando upgrades...</LoadingSpinner>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title> Gerenciamento de Upgrades</Title>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{formatNumber(data?.stats.totalUpgrades || 0)}</StatValue>
          <StatLabel>Total de Upgrades</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatNumber(data?.stats.successfulUpgrades || 0)}</StatValue>
          <StatLabel>Upgrades Bem-sucedidos</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>
            {data?.stats.totalUpgrades
              ? ((data.stats.successfulUpgrades / data.stats.totalUpgrades) * 100).toFixed(1)
              : 0}
            %
          </StatValue>
          <StatLabel>Taxa de Sucesso</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{formatCurrency(data?.stats.totalValueTraded || 0)}</StatValue>
          <StatLabel>Valor Total Negociado</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{(data?.stats.avgProbability || 0).toFixed(1)}%</StatValue>
          <StatLabel>Probabilidade Média</StatLabel>
        </StatCard>
      </StatsGrid>

      <Filters>
        <FilterInput
          type="text"
          placeholder="ID do Usuário..."
          value={filters.userId}
          onChange={(e) => handleFilterChange("userId", e.target.value)}
        />

        <FilterSelect value={filters.success} onChange={(e) => handleFilterChange("success", e.target.value)}>
          <option value="">Todos os Resultados</option>
          <option value="true">Bem-sucedidos</option>
          <option value="false">Falharam</option>
        </FilterSelect>
      </Filters>

      <Table>
        <thead>
          <tr>
            <Th onClick={() => handleFilterChange("sortBy", "timestamp")}>Data</Th>
            <Th>Usuário</Th>
            <Th>Valor Oferecido</Th>
            <Th>Probabilidade</Th>
            <Th>Resultado</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {data?.upgrades.map((upgrade: any) => (
            <tr key={upgrade._id}>
              <Td>{new Date(upgrade.timestamp).toLocaleString("pt-BR")}</Td>
              <Td>
                <UserInfo>
                  <Avatar src={upgrade.user?.avatar || "/placeholder-avatar.png"} alt="Avatar" />
                  <div>{upgrade.user?.name || "Usuário Desconhecido"}</div>
                </UserInfo>
              </Td>
              <Td>{formatCurrency(upgrade.totalOfferedValue)}</Td>
              <Td>{(upgrade.probability || 0).toFixed(1)}%</Td>
              <Td>
                <StatusBadge success={upgrade.success}>{upgrade.success ? "Sucesso" : "Falhou"}</StatusBadge>
              </Td>
              <Td>
                <ActionButton onClick={() => handleAction("reverse_upgrade", upgrade.upgradeId)}>Reverter</ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {data?.pagination && (
        <Pagination>
          <div>
            Mostrando {(data.pagination.page - 1) * data.pagination.limit + 1} -{" "}
            {Math.min(data.pagination.page * data.pagination.limit, data.pagination.totalItems)} de{" "}
            {data.pagination.totalItems} upgrades
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <PaginationButton
              disabled={data.pagination.page <= 1}
              onClick={() => handleFilterChange("page", data.pagination.page - 1)}
            >
              Anterior
            </PaginationButton>

            <PaginationButton
              disabled={data.pagination.page >= data.pagination.totalPages}
              onClick={() => handleFilterChange("page", data.pagination.page + 1)}
            >
              Próximo
            </PaginationButton>
          </div>
        </Pagination>
      )}
    </Container>
  )
}
