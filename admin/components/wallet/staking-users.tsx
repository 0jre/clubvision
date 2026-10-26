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
  min-width: 200px;

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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
`

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`

const UserName = styled.div`
  font-weight: 600;
  color: #000;
`

const Username = styled.div`
  font-size: 12px;
  color: #666;
`

const Badge = styled.span<{ variant: "prime" | "verified" | "active" | "inactive" }>`
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${(props) => {
    switch (props.variant) {
      case "prime":
        return "background: #ffd700; color: #000;"
      case "verified":
        return "background: #28a745; color: white;"
      case "active":
        return "background: #007bff; color: white;"
      case "inactive":
        return "background: #6c757d; color: white;"
      default:
        return "background: #e9ecef; color: #495057;"
    }
  }}
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

export function StakingUsers() {
  const { fetchStakingUsers } = useWalletAPIx()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    validator: "",
    status: "",
    sortBy: "totalStaked",
    sortOrder: "desc",
    page: 1,
  })

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchStakingUsers(filters)
      setData(response)
    } catch (error) {
      console.error("Error loading staking users:", error)
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

  const handleSort = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
      page: 1,
    }))
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
        <LoadingSpinner>Carregando usuários de staking...</LoadingSpinner>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title> Usuários de Staking</Title>
      </Header>

      <Filters>
        <FilterInput
          type="text"
          placeholder="Buscar por nome ou ID..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />

        <FilterSelect value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
          <option value="">Todos os Status</option>
          <option value="active">Staking Ativo</option>
          <option value="inactive">Staking Inativo</option>
        </FilterSelect>

        <FilterSelect value={filters.validator} onChange={(e) => handleFilterChange("validator", e.target.value)}>
          <option value="">Todos os Validadores</option>
          <option value="validator1">GenVenture AB</option>
          <option value="validator2">WalletVision</option>
          <option value="validator3">Univision X</option>
        </FilterSelect>
      </Filters>

      <Table>
        <thead>
          <tr>
            <Th onClick={() => handleSort("name")}>Usuário</Th>
            <Th onClick={() => handleSort("totalStaked")}>Total em Staking</Th>
            <Th onClick={() => handleSort("rewards")}>Recompensas</Th>
            <Th onClick={() => handleSort("activeStaking")}>Stakings Ativos</Th>
            <Th>Status</Th>
            <Th>Contratos</Th>
          </tr>
        </thead>
        <tbody>
          {data?.users.map((user: any) => (
            <tr key={user.id}>
              <Td>
                <UserInfo>
                  <Avatar src={user.avatar || "/placeholder-avatar.png"} alt={user.name} />
                  <UserDetails>
                    <UserName>{user.name}</UserName>
                    <Username>@{user.username}</Username>
                  </UserDetails>
                </UserInfo>
              </Td>
              <Td>{formatCurrency(user.totalStaked)} ORBs</Td>
              <Td>{formatCurrency(user.rewards)} Bits</Td>
              <Td>
                <Badge variant="active">{user.activeStaking}</Badge>
                {user.inactiveStaking > 0 && (
                  <Badge variant="inactive" style={{ marginLeft: "4px" }}>
                    {user.inactiveStaking}
                  </Badge>
                )}
              </Td>
              <Td>
                {user.isPrime && <Badge variant="prime">Prime</Badge>}
                {user.verified && <Badge variant="verified">Verificado</Badge>}
              </Td>
              <Td>
                {user.contracts.contractax && <Badge variant="active">TAX</Badge>}
                {user.contracts.contractunix && <Badge variant="active">UNIX</Badge>}
                {user.contracts.contractvision && <Badge variant="active">VISION</Badge>}
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
            {data.pagination.totalItems} usuários
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
