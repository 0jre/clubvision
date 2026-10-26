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

const StatsBar = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
`

const StatItem = styled.div`
  text-align: center;
`

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #000;
`

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
`

const Filters = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
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

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;

  ${(props) => {
    switch (props.status) {
      case "completed":
        return "background: #28a745; color: white;"
      case "partial":
        return "background: #ffc107; color: #000;"
      case "refunded":
        return "background: #dc3545; color: white;"
      case "failed":
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

const UserName = styled.div`
  font-weight: 500;
  color: #000;
`

const ActionButton = styled.button<{ variant?: "danger" | "warning" }>`
  background: ${(props) => (props.variant === "danger" ? "#dc3545" : props.variant === "warning" ? "#ffc107" : "#000")};
  color: ${(props) => (props.variant === "warning" ? "#000" : "white")};
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 4px;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

export function CheckoutTransactions() {
  const { fetchCheckoutTransactions, performTransactionAction } = useWalletAPIx()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    userId: "",
    transactionId: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
  })

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchCheckoutTransactions(filters)
      setData(response)
    } catch (error) {
      console.error("Error loading checkout transactions:", error)
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

  const handleAction = async (action: string, transactionId: string, reason?: string) => {
    try {
      setActionLoading(true)
      await performTransactionAction(action, [transactionId], reason)
      await loadData()
    } catch (error) {
      console.error("Error performing action:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  if (loading && !data) {
    return (
      <Container>
        <LoadingSpinner>Carregando transações...</LoadingSpinner>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>Transações de Checkout</Title>
      </Header>

      {data?.pageStats && (
        <StatsBar>
          <StatItem>
            <StatValue>{formatCurrency(data.pageStats.totalAmount)}</StatValue>
            <StatLabel>Valor Bruto</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{formatCurrency(data.pageStats.totalWithFees)}</StatValue>
            <StatLabel>Valor com Taxas</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{data.pageStats.totalItems}</StatValue>
            <StatLabel>Total de Itens</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{formatCurrency(data.pageStats.totalProfit)}</StatValue>
            <StatLabel>Lucro (Taxas)</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{formatCurrency(data.pageStats.avgOrderValue)}</StatValue>
            <StatLabel>Ticket Médio</StatLabel>
          </StatItem>
        </StatsBar>
      )}

      <Filters>
        <FilterSelect value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
          <option value="">Todos os Status</option>
          <option value="completed">Completado</option>
          <option value="partial">Parcial</option>
          <option value="refunded">Reembolsado</option>
          <option value="failed">Falhou</option>
        </FilterSelect>

        <FilterSelect
          value={filters.paymentMethod}
          onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
        >
          <option value="">Todos os Métodos</option>
          <option value="bits">Bits</option>
          <option value="coins">Coins</option>
          <option value="banking">Banking</option>
        </FilterSelect>

        <FilterInput
          type="text"
          placeholder="ID da Transação..."
          value={filters.transactionId}
          onChange={(e) => handleFilterChange("transactionId", e.target.value)}
        />

        <FilterInput
          type="text"
          placeholder="ID do Usuário..."
          value={filters.userId}
          onChange={(e) => handleFilterChange("userId", e.target.value)}
        />

        <FilterInput
          type="number"
          placeholder="Valor mínimo..."
          value={filters.minAmount}
          onChange={(e) => handleFilterChange("minAmount", e.target.value)}
        />

        <FilterInput
          type="number"
          placeholder="Valor máximo..."
          value={filters.maxAmount}
          onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
        />

        <FilterInput
          type="date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
        />

        <FilterInput
          type="date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
        />
      </Filters>

      <Table>
        <thead>
          <tr>
            <Th>ID da Transação</Th>
            <Th>Usuário</Th>
            <Th>Status</Th>
            <Th>Valor</Th>
            <Th>Itens</Th>
            <Th>Método</Th>
            <Th>Data</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {data?.transactions.map((transaction: any) => (
            <tr key={transaction.transactionId}>
              <Td>{transaction.transactionId}</Td>
              <Td>
                <UserInfo>
                  <Avatar src={transaction.user?.avatar || "/placeholder-avatar.png"} alt="Avatar" />
                  <UserName>{transaction.user?.name || "Usuário Desconhecido"}</UserName>
                </UserInfo>
              </Td>
              <Td>
                <StatusBadge status={transaction.status}>{transaction.status}</StatusBadge>
              </Td>
              <Td>{formatCurrency(transaction.totalWithFees)}</Td>
              <Td>{transaction.itemCount}</Td>
              <Td>{transaction.paymentMethod}</Td>
              <Td>{new Date(transaction.createdAt).toLocaleString("pt-BR")}</Td>
              <Td>
                {transaction.status === "completed" && (
                  <>
                    <ActionButton
                      variant="danger"
                      onClick={() => handleAction("refund", transaction.transactionId, "Admin refund")}
                      disabled={actionLoading}
                    >
                      Reembolsar
                    </ActionButton>
                    <ActionButton
                      variant="warning"
                      onClick={() => handleAction("mark_suspicious", transaction.transactionId, "Admin review")}
                      disabled={actionLoading}
                    >
                      Marcar Suspeito
                    </ActionButton>
                  </>
                )}
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
            {data.pagination.totalItems} transações
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
