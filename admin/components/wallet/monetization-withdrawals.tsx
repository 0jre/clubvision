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
      case "Concluído":
        return "background: #28a745; color: white;"
      case "Pendente":
        return "background: #ffc107; color: #000;"
      case "Falhou":
        return "background: #dc3545; color: white;"
      case "Cancelado":
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
  font-weight: 500;
  color: #000;
  font-size: 14px;
`

const Username = styled.div`
  font-size: 12px;
  color: #666;
`

const ActionButton = styled.button<{ variant?: "danger" | "warning" | "success" }>`
  background: ${(props) =>
    props.variant === "danger"
      ? "#dc3545"
      : props.variant === "warning"
        ? "#ffc107"
        : props.variant === "success"
          ? "#28a745"
          : "#000"};
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

export function MonetizationWithdrawals() {
  const { fetchMonetizationWithdrawals, performWithdrawalAction } = useWalletAPIx()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    userId: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
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
      const response = await fetchMonetizationWithdrawals(filters)
      setData(response)
    } catch (error) {
      console.error("Error loading withdrawals:", error)
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

  const handleAction = async (action: string, withdrawalId: string, reason?: string) => {
    try {
      setActionLoading(true)
      await performWithdrawalAction(action, [withdrawalId], reason)
      await loadData()
    } catch (error) {
      console.error("Error performing action:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading && !data) {
    return (
      <Container>
        <LoadingSpinner>Carregando saques...</LoadingSpinner>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title> Gerenciamento de Saques</Title>
      </Header>

      {data?.pageStats && (
        <StatsBar>
          <StatItem>
            <StatValue>{formatCurrency(data.pageStats.totalAmount)}</StatValue>
            <StatLabel>Total Sacado</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{formatCurrency(data.pageStats.avgAmount)}</StatValue>
            <StatLabel>Valor Médio</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{data.pageStats.pendingCount}</StatValue>
            <StatLabel>Pendentes</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{data.pageStats.completedCount}</StatValue>
            <StatLabel>Concluídos</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{data.pageStats.failedCount}</StatValue>
            <StatLabel>Falharam</StatLabel>
          </StatItem>
        </StatsBar>
      )}

      <Filters>
        <FilterSelect value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
          <option value="">Todos os Status</option>
          <option value="Pendente">Pendente</option>
          <option value="Concluído">Concluído</option>
          <option value="Falhou">Falhou</option>
          <option value="Cancelado">Cancelado</option>
        </FilterSelect>

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
            <Th>Usuário</Th>
            <Th>Valor</Th>
            <Th>Status</Th>
            <Th>Tipo</Th>
            <Th>Data</Th>
            <Th>Saldo Atual</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {data?.withdrawals.map((withdrawal: any) => (
            <tr key={withdrawal._id}>
              <Td>
                <UserInfo>
                  <Avatar src={withdrawal.user?.avatar || "/placeholder.svg?height=32&width=32"} alt="Avatar" />
                  <UserDetails>
                    <UserName>{withdrawal.user?.name || "Usuário Desconhecido"}</UserName>
                    <Username>@{withdrawal.user?.username || "unknown"}</Username>
                  </UserDetails>
                </UserInfo>
              </Td>
              <Td>{formatCurrency(withdrawal.amount)} bits</Td>
              <Td>
                <StatusBadge status={withdrawal.status}>{withdrawal.status}</StatusBadge>
              </Td>
              <Td>{withdrawal.type === "admin_forced" ? "Admin" : "Normal"}</Td>
              <Td>{new Date(withdrawal.timestamp).toLocaleString("pt-BR")}</Td>
              <Td>
                <div style={{ fontSize: "12px" }}>
                  <div>Rescue: {formatCurrency(withdrawal.currentBalance.rescue)}</div>
                  <div>Bits: {formatCurrency(withdrawal.currentBalance.bits)}</div>
                </div>
              </Td>
              <Td>
                {withdrawal.status === "Pendente" && (
                  <>
                    <ActionButton
                      variant="success"
                      onClick={() => handleAction("approve", withdrawal._id, "Admin approval")}
                      disabled={actionLoading}
                    >
                      Aprovar
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() => handleAction("reject", withdrawal._id, "Admin rejection")}
                      disabled={actionLoading}
                    >
                      Rejeitar
                    </ActionButton>
                  </>
                )}
                {withdrawal.status !== "Concluído" && (
                  <ActionButton
                    variant="warning"
                    onClick={() => handleAction("cancel", withdrawal._id, "Admin cancellation")}
                    disabled={actionLoading}
                  >
                    Cancelar
                  </ActionButton>
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
            {data.pagination.totalItems} saques
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
