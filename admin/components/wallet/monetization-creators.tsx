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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
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
`

const Username = styled.div`
  font-size: 12px;
  color: #666;
`

const StatusBadge = styled.span<{ type: "prime" | "verified" | "eligible" | "blocked" }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  margin-right: 4px;

  ${(props) => {
    switch (props.type) {
      case "prime":
        return "background: #ffd700; color: #000;"
      case "verified":
        return "background: #28a745; color: white;"
      case "eligible":
        return "background: #007bff; color: white;"
      case "blocked":
        return "background: #dc3545; color: white;"
      default:
        return "background: #e9ecef; color: #495057;"
    }
  }}
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

const Modal = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
`

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #000;
`

const ModalInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #000;
  }
`

const ModalButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`

export function MonetizationCreators() {
  const { fetchMonetizationCreators, performCreatorAction } = useWalletAPIx()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalAction, setModalAction] = useState("")
  const [selectedCreator, setSelectedCreator] = useState<any>(null)
  const [modalAmount, setModalAmount] = useState("")
  const [modalReason, setModalReason] = useState("")
  const [filters, setFilters] = useState({
    sortBy: "rescue",
    sortOrder: "desc",
    filterBy: "all",
    search: "",
    minRescue: "",
    maxRescue: "",
    page: 1,
  })

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchMonetizationCreators(filters)
      setData(response)
    } catch (error) {
      console.error("Error loading creators:", error)
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

  const openModal = (action: string, creator: any) => {
    setModalAction(action)
    setSelectedCreator(creator)
    setModalAmount("")
    setModalReason("")
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalAction("")
    setSelectedCreator(null)
    setModalAmount("")
    setModalReason("")
  }

  const handleAction = async () => {
    if (!selectedCreator) return

    try {
      setActionLoading(true)
      const amount = modalAction.includes("adjust") ? Number(modalAmount) : undefined
      await performCreatorAction(modalAction, [selectedCreator.userId], amount, modalReason)
      await loadData()
      closeModal()
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  if (loading && !data) {
    return (
      <Container>
        <LoadingSpinner>Carregando criadores...</LoadingSpinner>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>Gerenciamento de Criadores</Title>
      </Header>

      <Filters>
        <FilterSelect value={filters.sortBy} onChange={(e) => handleFilterChange("sortBy", e.target.value)}>
          <option value="rescue">Ordenar por Rescue</option>
          <option value="bits">Ordenar por Bits</option>
          <option value="totalWithdrawn">Ordenar por Saques</option>
          <option value="level">Ordenar por Nível</option>
        </FilterSelect>

        <FilterSelect value={filters.filterBy} onChange={(e) => handleFilterChange("filterBy", e.target.value)}>
          <option value="all">Todos os Criadores</option>
          <option value="eligible">Elegíveis para Saque</option>
          <option value="high_earners">Alto Ganho</option>
          <option value="prime">Usuários Prime</option>
          <option value="verified">Verificados</option>
          <option value="recent_withdrawals">Saques Recentes</option>
        </FilterSelect>

        <FilterInput
          type="text"
          placeholder="Buscar criador..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />

        <FilterInput
          type="number"
          placeholder="Rescue mínimo..."
          value={filters.minRescue}
          onChange={(e) => handleFilterChange("minRescue", e.target.value)}
        />

        <FilterInput
          type="number"
          placeholder="Rescue máximo..."
          value={filters.maxRescue}
          onChange={(e) => handleFilterChange("maxRescue", e.target.value)}
        />
      </Filters>

      <Table>
        <thead>
          <tr>
            <Th>Criador</Th>
            <Th>Rescue</Th>
            <Th>Bits</Th>
            <Th>Saques</Th>
            <Th>Status</Th>
            <Th>Elegibilidade</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {data?.creators?.map((creator: any) => (
            <tr key={creator.userId}>
              <Td>
                <UserInfo>
                  <Avatar src={creator.user?.avatar || "/placeholder.svg?height=40&width=40"} alt="Avatar" />
                  <UserDetails>
                    <UserName>{creator.user?.name || "Usuário Desconhecido"}</UserName>
                    <Username>@{creator.user?.username || "unknown"}</Username>
                  </UserDetails>
                </UserInfo>
              </Td>
              <Td>{formatCurrency(creator.monetization?.rescue || 0)}</Td>
              <Td>{formatCurrency(creator.monetization?.bits || 0)}</Td>
              <Td>
                {formatNumber(creator.monetization?.withdrawalCount || 0)} (
                {formatCurrency(creator.monetization?.totalWithdrawn || 0)})
              </Td>
              <Td>
                {creator.status?.isPrime && <StatusBadge type="prime">Prime</StatusBadge>}
                {creator.status?.isVerified && <StatusBadge type="verified">Verificado</StatusBadge>}
                {creator.status?.isUnverified && <StatusBadge type="blocked">Bloqueado</StatusBadge>}
                <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                  Nível {creator.status?.level || 0} • {formatNumber(creator.status?.clubActivity || 0)} atividade
                </div>
              </Td>
              <Td>
                {creator.eligibility?.canWithdraw ? (
                  <StatusBadge type="eligible">Elegível</StatusBadge>
                ) : (
                  <StatusBadge type="blocked">Não Elegível</StatusBadge>
                )}
              </Td>
              <Td>
                <ActionButton onClick={() => openModal("adjust_rescue", creator)} disabled={actionLoading}>
                  Ajustar
                </ActionButton>
                <ActionButton
                  variant="warning"
                  onClick={() => openModal("force_withdrawal", creator)}
                  disabled={actionLoading}
                >
                  Saque
                </ActionButton>
                <ActionButton
                  variant="danger"
                  onClick={() => openModal("reset_monetization", creator)}
                  disabled={actionLoading}
                >
                  Reset
                </ActionButton>
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
            {data.pagination.totalItems} criadores
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

      <Modal show={showModal}>
        <ModalContent>
          <ModalTitle>
            {modalAction === "adjust_rescue" && "Ajustar Rescue"}
            {modalAction === "force_withdrawal" && "Forçar Saque"}
            {modalAction === "reset_monetization" && "Resetar Monetização"}
            {modalAction === "block_monetization" && "Bloquear Monetização"}
          </ModalTitle>

          {(modalAction === "adjust_rescue" || modalAction === "force_withdrawal") && (
            <ModalInput
              type="number"
              placeholder="Valor..."
              value={modalAmount}
              onChange={(e) => setModalAmount(e.target.value)}
            />
          )}

          <ModalInput
            type="text"
            placeholder="Motivo da ação..."
            value={modalReason}
            onChange={(e) => setModalReason(e.target.value)}
          />

          <ModalButtons>
            <ActionButton onClick={closeModal}>Cancelar</ActionButton>
            <ActionButton variant="success" onClick={handleAction} disabled={actionLoading}>
              {actionLoading ? "Processando..." : "Confirmar"}
            </ActionButton>
          </ModalButtons>
        </ModalContent>
      </Modal>
    </Container>
  )
}
