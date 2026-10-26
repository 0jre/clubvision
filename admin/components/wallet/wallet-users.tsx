"use client"

import { useState } from "react"
import styled from "styled-components"
import { useWalletUsers, updateUserWallet } from "@/admin/hooks/use-wallet-api"

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

const FiltersCard = styled.div`
  background-color: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: black;
`

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  color: black;
  
  &:focus {
    outline: none;
    border-color: black;
  }
`

const SearchInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  color: black;
  
  &:focus {
    outline: none;
    border-color: black;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`

const ApplyButton = styled.button`
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  align-self: flex-end;
  
  &:hover {
    background-color: #333;
  }
`

const UsersTable = styled.div`
  background-color: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e5e5e5;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: black;
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  border-bottom: 1px solid #e5e5e5;
  padding: 16px;
  align-items: center;
  
  &:hover {
    background-color: #f9f9f9;
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f3f4f6;
`

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`

const UserName = styled.div`
  font-weight: 500;
  color: black;
  font-size: 14px;
`

const Username = styled.div`
  font-size: 12px;
  color: #666;
`

const BalanceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const BalanceValue = styled.div`
  font-weight: 600;
  color: black;
  font-size: 14px;
`

const BalanceLabel = styled.div`
  font-size: 12px;
  color: #666;
`

const Badge = styled.div<{ type: "prime" | "verified" | "contract" }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) =>
    props.type === "prime" ? "#fef3c7" : props.type === "verified" ? "#dcfce7" : "#f3f4f6"};
  color: ${(props) => (props.type === "prime" ? "#92400e" : props.type === "verified" ? "#166534" : "#374151")};
`

const ActionButton = styled.button`
  padding: 6px 12px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  
  &:hover {
    background-color: #333;
  }
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

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #e5e5e5;
`

const PaginationInfo = styled.div`
  font-size: 14px;
  color: #666;
`

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 16px;
  background-color: ${(props) => (props.disabled ? "#f3f4f6" : "black")};
  color: ${(props) => (props.disabled ? "#9ca3af" : "white")};
  border: none;
  border-radius: 6px;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  font-size: 14px;
  
  &:hover {
    background-color: ${(props) => (props.disabled ? "#f3f4f6" : "#333")};
  }
`

export function WalletUsers() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    sortBy: "balance",
    filterBy: "all",
    search: "",
    limit: 20,
  })

  const { data, loading, error, refetch } = useWalletUsers({
    ...filters,
    page,
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleUserAction = async (userId: string, action: string) => {
    try {
      await updateUserWallet(userId, action, 0, "coins", "Ação administrativa")
      refetch()
    } catch (err) {
      console.error("Erro ao executar ação:", err)
      alert("Erro ao executar ação. Tente novamente.")
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value)
  }

  return (
    <Container>
      <Header>
        <Title>Gerenciamento de Usuários</Title>
        <Subtitle>Visualize e gerencie carteiras de usuários da plataforma</Subtitle>
      </Header>

      <FiltersCard>
        <FiltersGrid>
          <FilterGroup>
            <Label>Ordenar por</Label>
            <Select value={filters.sortBy} onChange={(e) => handleFilterChange("sortBy", e.target.value)}>
              <option value="balance">Saldo Total</option>
              <option value="bits">Bits</option>
              <option value="banking">Banking</option>
              <option value="transactions">Transações</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Filtrar por</Label>
            <Select value={filters.filterBy} onChange={(e) => handleFilterChange("filterBy", e.target.value)}>
              <option value="all">Todos</option>
              <option value="high_balance">Alto Saldo</option>
              <option value="zero_balance">Saldo Zero</option>
              <option value="prime">Usuários Prime</option>
              <option value="suspicious">Suspeitos</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Buscar usuário</Label>
            <SearchInput
              placeholder="Nome ou ID do usuário"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>&nbsp;</Label>
            <ApplyButton onClick={() => refetch()}>Aplicar Filtros</ApplyButton>
          </FilterGroup>
        </FiltersGrid>
      </FiltersCard>

      {loading ? (
        <LoadingContainer>
          <p>Carregando usuários...</p>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <p>Erro ao carregar usuários: {error}</p>
          <RetryButton onClick={() => refetch()}>Tentar novamente</RetryButton>
        </ErrorContainer>
      ) : (
        <UsersTable>
          <TableHeader>
            <div>Usuário</div>
            <div>Coins (ORBs)</div>
            <div>Bits</div>
            <div>Banking</div>
            <div>Status</div>
            <div>Ações</div>
          </TableHeader>

          {data?.users?.map((user: any) => (
            <TableRow key={user.id}>
              <UserInfo>
                <Avatar src={user.avatar || "/placeholder.svg?height=40&width=40"} alt="Avatar" />
                <UserDetails>
                  <UserName>
                    {user.name}
                    {user.verified && <span style={{ color: "#10b981", marginLeft: "4px" }}>✓</span>}
                  </UserName>
                  <Username>@{user.username}</Username>
                </UserDetails>
              </UserInfo>

              <BalanceInfo>
                <BalanceValue>{formatCurrency(user.balances.coins)}</BalanceValue>
                <BalanceLabel>ORBs</BalanceLabel>
              </BalanceInfo>

              <BalanceInfo>
                <BalanceValue>{formatCurrency(user.balances.bits)}</BalanceValue>
                <BalanceLabel>Bits</BalanceLabel>
              </BalanceInfo>

              <BalanceInfo>
                <BalanceValue>{formatCurrency(user.balances.banking)}</BalanceValue>
                <BalanceLabel>Banking</BalanceLabel>
              </BalanceInfo>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {user.isPrime && <Badge type="prime">Prime</Badge>}
                {user.contracts.contractax && <Badge type="contract">Tax Free</Badge>}
                {user.contracts.contractunix && <Badge type="contract">Unix</Badge>}
              </div>

              <ActionButton onClick={() => handleUserAction(user.id, "view_details")}>Ver Detalhes</ActionButton>
            </TableRow>
          ))}

          {data?.users?.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <p>Nenhum usuário encontrado.</p>
            </div>
          )}

          <Pagination>
            <PaginationInfo>
              Mostrando {data?.users?.length || 0} de {data?.pagination?.totalItems || 0} usuários
            </PaginationInfo>
            <PaginationButtons>
              <PaginationButton disabled={page === 1} onClick={() => setPage(page - 1)}>
                Anterior
              </PaginationButton>
              <PaginationButton
                disabled={page >= (data?.pagination?.totalPages || 1)}
                onClick={() => setPage(page + 1)}
              >
                Próxima
              </PaginationButton>
            </PaginationButtons>
          </Pagination>
        </UsersTable>
      )}
    </Container>
  )
}
