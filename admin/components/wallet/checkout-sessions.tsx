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
      case "pending":
        return "background: #ffc107; color: #000;"
      case "processing":
        return "background: #007bff; color: white;"
      case "cancelled":
        return "background: #dc3545; color: white;"
      case "expired":
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

const ActionButton = styled.button`
  background: #000;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 4px;

  &:hover {
    background: #333;
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

export function CheckoutSessions() {
  const { fetchCheckoutSessions, performCheckoutAction } = useWalletAPIx()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    userId: "",
    orderId: "",
    startDate: "",
    endDate: "",
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
      const response = await fetchCheckoutSessions(filters)
      setData(response)
    } catch (error) {
      console.error("Error loading checkout sessions:", error)
    } finally {
      setLoading(false)
    }
  }

 const handleFilterChange = (key: string, value: string | number) => {
  setFilters((prev) => ({
    ...prev,
    [key]: value,
    page: key !== "page" ? 1 : Number(value), // garante que page seja sempre number
  }))
}

  const handleAction = async (action: string, sessionId: string, reason?: string) => {
    try {
      setActionLoading(true)
      await performCheckoutAction(action, [sessionId], reason)
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

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return "Expirado"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (loading && !data) {
    return (
      <Container>
        <LoadingSpinner>Carregando sessões de checkout...</LoadingSpinner>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>Sessões de Checkout</Title>
      </Header>

      <Filters>
        <FilterSelect value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
          <option value="">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="processing">Processando</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
          <option value="expired">Expirado</option>
        </FilterSelect>

        <FilterInput
          type="text"
          placeholder="ID do Usuário..."
          value={filters.userId}
          onChange={(e) => handleFilterChange("userId", e.target.value)}
        />

        <FilterInput
          type="text"
          placeholder="ID do Pedido..."
          value={filters.orderId}
          onChange={(e) => handleFilterChange("orderId", e.target.value)}
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
            <Th>Pedido ID</Th>
            <Th>Status</Th>
            <Th>Valor</Th>
            <Th>Itens</Th>
            <Th>Tempo Restante</Th>
            <Th>Criado em</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {data?.sessions.map((session: any) => (
            <tr key={session._id}>
              <Td>
                <UserInfo>
                  <Avatar src={session.user?.avatar || "/placeholder-avatar.png"} alt="Avatar" />
                  <UserName>{session.user?.name || "Usuário Desconhecido"}</UserName>
                </UserInfo>
              </Td>
              <Td>{session.orderId}</Td>
              <Td>
                <StatusBadge status={session.status}>{session.status}</StatusBadge>
              </Td>
              <Td>{formatCurrency(session.totalWithFees || session.totalAmount)}</Td>
              <Td>{session.itemCount}</Td>
              <Td>{formatTimeRemaining(session.timeRemaining)}</Td>
              <Td>{new Date(session.createdAt).toLocaleString("pt-BR")}</Td>
              <Td>
                {session.status === "pending" && (
                  <>
                    <ActionButton
                      onClick={() => handleAction("cancel", session._id, "Admin cancellation")}
                      disabled={actionLoading}
                    >
                      Cancelar
                    </ActionButton>
                    <ActionButton onClick={() => handleAction("extend", session._id)} disabled={actionLoading}>
                      Estender
                    </ActionButton>
                  </>
                )}
                {session.status === "processing" && (
                  <ActionButton onClick={() => handleAction("force_expire", session._id)} disabled={actionLoading}>
                    Expirar
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
            {data.pagination.totalItems} sessões
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
