"use client"

import { useState } from "react"
import styled from "styled-components"
import { useWalletAuditLogs } from "@/admin/hooks/use-wallet-api"

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

const AuditTable = styled.div`
  background-color: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e5e5e5;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: black;
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
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
    if (props.action.includes("view")) return "#dbeafe"
    if (props.action.includes("admin")) return "#fee2e2"
    if (props.action.includes("list")) return "#f3e8ff"
    return "#f3f4f6"
  }};
  color: ${(props) => {
    if (props.action.includes("view")) return "#1e40af"
    if (props.action.includes("admin")) return "#dc2626"
    if (props.action.includes("list")) return "#7c3aed"
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

const DetailsCell = styled.div`
  font-size: 12px;
  color: #666;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
`

export function WalletAudit() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    actionType: "all",
    userId: "",
    targetUserId: "",
    startDate: "",
    endDate: "",
    limit: 50,
  })

  const { data, loading, error, refetch } = useWalletAuditLogs({
    ...filters,
    page,
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  return (
    <Container>
      <Header>
        <Title>Auditoria da Carteira</Title>
        <Subtitle>Rastreie e revise todas as ações administrativas no sistema de carteira</Subtitle>
      </Header>

      <FiltersCard>
        <FiltersGrid>
          <FilterGroup>
            <Label>Tipo de Ação</Label>
            <Select value={filters.actionType} onChange={(e) => handleFilterChange("actionType", e.target.value)}>
              <option value="all">Todas as Ações</option>
              <option value="view_wallet_overview">Visualizar Overview</option>
              <option value="list_wallet_users">Listar Usuários</option>
              <option value="list_wallet_transactions">Listar Transações</option>
              <option value="view_user_wallet">Ver Carteira do Usuário</option>
              <option value="admin_add_balance">Adicionar Saldo</option>
              <option value="admin_remove_balance">Remover Saldo</option>
              <option value="admin_freeze_wallet">Congelar Carteira</option>
              <option value="admin_unfreeze_wallet">Descongelar Carteira</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>ID do Admin</Label>
            <Input
              placeholder="Filtrar por admin"
              value={filters.userId}
              onChange={(e) => handleFilterChange("userId", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>ID do Usuário Alvo</Label>
            <Input
              placeholder="Filtrar por usuário alvo"
              value={filters.targetUserId}
              onChange={(e) => handleFilterChange("targetUserId", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>&nbsp;</Label>
            <ApplyButton onClick={() => refetch()}>Aplicar Filtros</ApplyButton>
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
        </FiltersGrid>
      </FiltersCard>

      {loading ? (
        <LoadingContainer>
          <p>Carregando logs de auditoria...</p>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <p>Erro ao carregar logs de auditoria: {error}</p>
          <RetryButton onClick={() => refetch()}>Tentar novamente</RetryButton>
        </ErrorContainer>
      ) : (
        <AuditTable>
          <TableHeader>
            <div>Administrador</div>
            <div>Ação</div>
            <div>Usuário Alvo</div>
            <div>Data/Hora</div>
            <div>Detalhes</div>
          </TableHeader>

          {data?.logs?.map((log: any) => (
            <TableRow key={log._id}>
              <UserInfo>
                <Avatar src={log.user?.avatar || "/placeholder.svg?height=32&width=32"} alt="Avatar" />
                <UserDetails>
                  <UserName>{log.user?.displayName || "Unknown Admin"}</UserName>
                  <Username>@{log.user?.username || "unknown"}</Username>
                </UserDetails>
              </UserInfo>

              <ActionBadge action={log.action}>{log.action.replace(/_/g, " ")}</ActionBadge>

              <div>
                {log.targetUser ? (
                  <UserInfo>
                    <Avatar
                      src={log.targetUser?.avatar || "/placeholder.svg?height=24&width=24"}
                      alt="Avatar"
                      style={{ width: "24px", height: "24px" }}
                    />
                    <UserDetails>
                      <UserName style={{ fontSize: "12px" }}>{log.targetUser?.displayName || "Unknown User"}</UserName>
                      <Username style={{ fontSize: "10px" }}>@{log.targetUser?.username || "unknown"}</Username>
                    </UserDetails>
                  </UserInfo>
                ) : (
                  <span style={{ fontSize: "12px", color: "#666" }}>-</span>
                )}
              </div>

              <div style={{ fontSize: "12px", color: "#666" }}>
                <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
              </div>

              <DetailsCell>
                {log.details ? (
                  <div>
                    {Object.entries(log.details).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                        {typeof value === "object"
                          ? JSON.stringify(value).substring(0, 30) + "..."
                          : String(value).substring(0, 30)}
                      </div>
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </DetailsCell>
            </TableRow>
          ))}

          {data?.logs?.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <p>Nenhum log de auditoria encontrado.</p>
            </div>
          )}

          <Pagination>
            <PaginationInfo>
              Mostrando {data?.logs?.length || 0} de {data?.pagination?.totalItems || 0} logs
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
        </AuditTable>
      )}
    </Container>
  )
}
