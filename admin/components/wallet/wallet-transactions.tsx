"use client"

import { useState } from "react"
import styled from "styled-components"
import { useWalletTransactions } from "@/admin/hooks/use-wallet-api"

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
  grid-template-columns: repeat(4, 1fr);
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

const Input = styled.input`
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

const TransactionsTable = styled.div`
  background-color: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e5e5e5;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: black;
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
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
  gap: 8px;
`

const Avatar = styled.img`
  width: 32px;
  height: 32px;
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

const ActionBadge = styled.div<{ action: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
    if (props.action.includes("convert")) return "#dbeafe"
    if (props.action.includes("transfer")) return "#fef3c7"
    if (props.action.includes("double")) return "#fee2e2"
    if (props.action.includes("purchase")) return "#f3e8ff"
    return "#f3f4f6"
  }};
  color: ${(props) => {
    if (props.action.includes("convert")) return "#1e40af"
    if (props.action.includes("transfer")) return "#92400e"
    if (props.action.includes("double")) return "#dc2626"
    if (props.action.includes("purchase")) return "#7c3aed"
    return "#374151"
  }};
`

const AmountDisplay = styled.div<{ positive?: boolean }>`
  font-weight: 600;
  color: ${(props) => (props.positive ? "#10b981" : props.positive === false ? "#dc2626" : "black")};
  font-size: 14px;
`

const StatusBadge = styled.div<{ status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
    if (props.status === "completed" || props.status === "succeeded") return "#dcfce7"
    if (props.status === "pending") return "#fef3c7"
    if (props.status === "failed") return "#fee2e2"
    return "#f3f4f6"
  }};
  color: ${(props) => {
    if (props.status === "completed" || props.status === "succeeded") return "#166534"
    if (props.status === "pending") return "#92400e"
    if (props.status === "failed") return "#dc2626"
    return "#374151"
  }};
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

export function WalletTransactions() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    actionType: "all",
    currency: "all",
    status: "all",
    startDate: "",
    endDate: "",
    userId: "",
    minAmount: "",
    maxAmount: "",
    limit: 50,
  })

  const { data, loading, error, refetch } = useWalletTransactions({
    ...filters,
    page,
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const getAmountSign = (action: string, amount: number) => {
    const positiveActions = ["convert_from_banking", "receive_orbs", "receivetransfer", "funds"]
    const negativeActions = ["convert_to_banking", "senttransfer", "staking_orbs"]

    if (positiveActions.includes(action)) return true
    if (negativeActions.includes(action)) return false
    if (action.startsWith("purchase_")) return false
    if (action === "double_orbit") return amount > 0
    return undefined
  }

  return (
    <Container>
      <Header>
        <Title>Transações da Carteira</Title>
        <Subtitle>Monitore e analise todas as transações do sistema de carteira</Subtitle>
      </Header>

      <FiltersCard>
        <FiltersGrid>
          <FilterGroup>
            <Label>Tipo de Ação</Label>
            <Select value={filters.actionType} onChange={(e) => handleFilterChange("actionType", e.target.value)}>
              <option value="all">Todas as Ações</option>
              <option value="convert_to_banking">Conversão para Banking</option>
              <option value="convert_from_banking">Conversão do Banking</option>
              <option value="double_orbit">Jogos (Double)</option>
              <option value="receivetransfer">Transferência Recebida</option>
              <option value="senttransfer">Transferência Enviada</option>
              <option value="purchase_bits">Compra de Bits</option>
              <option value="staking_orbs">Staking de ORBs</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Moeda</Label>
            <Select value={filters.currency} onChange={(e) => handleFilterChange("currency", e.target.value)}>
              <option value="all">Todas as Moedas</option>
              <option value="coins">ORBs (Coins)</option>
              <option value="bits">Bits</option>
              <option value="banking">Banking</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Status</Label>
            <Select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
              <option value="all">Todos os Status</option>
              <option value="completed">Concluído</option>
              <option value="succeeded">Sucesso</option>
              <option value="pending">Pendente</option>
              <option value="failed">Falhou</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>ID do Usuário</Label>
            <Input
              placeholder="Filtrar por usuário"
              value={filters.userId}
              onChange={(e) => handleFilterChange("userId", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>Data Inicial</Label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>Data Final</Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>Valor Mínimo</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange("minAmount", e.target.value)}
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
          <p>Carregando transações...</p>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <p>Erro ao carregar transações: {error}</p>
          <RetryButton onClick={() => refetch()}>Tentar novamente</RetryButton>
        </ErrorContainer>
      ) : (
        <TransactionsTable>
          <TableHeader>
            <div>Usuário</div>
            <div>Ação</div>
            <div>Valor</div>
            <div>Moeda</div>
            <div>Status</div>
            <div>Data/Hora</div>
          </TableHeader>

          {data?.transactions?.map((transaction: any, index: number) => (
            <TableRow key={`${transaction.userId}-${index}`}>
              <UserInfo>
                <Avatar src={transaction.user?.avatar || "/placeholder.svg?height=32&width=32"} alt="Avatar" />
                <UserDetails>
                  <UserName>{transaction.user?.name || "Unknown User"}</UserName>
                  <Username>@{transaction.user?.username || "unknown"}</Username>
                </UserDetails>
              </UserInfo>

              <ActionBadge action={transaction.action}>{transaction.action.replace(/_/g, " ")}</ActionBadge>

              <AmountDisplay positive={getAmountSign(transaction.action, transaction.amount)}>
                {getAmountSign(transaction.action, transaction.amount) === true && "+"}
                {getAmountSign(transaction.action, transaction.amount) === false && "-"}
                {formatCurrency(Math.abs(transaction.amount || 0))}
              </AmountDisplay>

              <div style={{ fontSize: "14px", color: "black", fontWeight: "500" }}>
                {transaction.currency?.toUpperCase() || "N/A"}
              </div>

              <StatusBadge status={transaction.status || "completed"}>{transaction.status || "completed"}</StatusBadge>

              <div style={{ fontSize: "12px", color: "#666" }}>
                <div>{transaction.date || new Date(transaction.timestamp).toLocaleDateString()}</div>
                <div>{transaction.time || new Date(transaction.timestamp).toLocaleTimeString()}</div>
              </div>
            </TableRow>
          ))}

          {data?.transactions?.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <p>Nenhuma transação encontrada.</p>
            </div>
          )}

          <Pagination>
            <PaginationInfo>
              Mostrando {data?.transactions?.length || 0} de {data?.pagination?.totalItems || 0} transações
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
        </TransactionsTable>
      )}
    </Container>
  )
}
