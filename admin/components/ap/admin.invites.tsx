"use client"

import type React from "react"
import { useEffect, useState } from "react"
import styled from "styled-components"
import axios from "axios"
import { decrypt } from "@/core/security/encryption"
import LoadingPageView from "@club/resources/loading/market.loading"
import NotificationUI from "@club/components/notification/card.mnc"
import type { User } from "@/types/user/searchall"
import {
  Search,
  Ticket,
  CheckCircle,
  XCircle,
  Copy,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Calendar,
  Crown,
} from "lucide-react"
import moment from "moment"

interface Props {
  users: User[]
  children: React.ReactNode
  content: React.ReactNode
  className?: string
  buttonText: string
}

interface InviteStats {
  total: number
  used: number
  unused: number
  primeUsers: number
}

async function fetchUserInfo(): Promise<Props> {
  const response = await fetch("/api/_v4/Q1_nvxre")
  if (!response.ok) {
    throw new Error("Falha ao buscar informações do usuário.")
  }
  const data = await response.json() as Props
  return data
}

export default function AdminConvites() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [usersList, setUsersList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<Props | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "used" | "unused">("all")
  const [filterPrime, setFilterPrime] = useState<"all" | "prime" | "standard">("all")
  const [showObfuscated, setShowObfuscated] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const performSearch = () => {
    const results = usersList.filter((user) => {
      const matchesSearch =
        user.reforms?.inviteCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "used" && user.reforms?.used) ||
        (filterStatus === "unused" && !user.reforms?.used)

      const matchesPrime =
        filterPrime === "all" ||
        (filterPrime === "prime" && user.reforms?.prime) ||
        (filterPrime === "standard" && !user.reforms?.prime)

      return matchesSearch && matchesStatus && matchesPrime
    })

    setSearchResults(results)
  }

  useEffect(() => {
    performSearch()
  }, [searchQuery, filterStatus, filterPrime, usersList])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("/api/_v4/Q1_nvxre")
      const dataw = decrypt(response.data)
      const parsedDataw = JSON.parse(dataw)

      const usersWithReformInfo = await Promise.all(
        parsedDataw.map(async (user: User) => {
          try {
            const reformResponse = await axios.get(`/api/autentic/xyloQuerierAPI?userId=${user.reforms?.userId}`)
            const datawre = decrypt(reformResponse.data.log)
            const reformInfo = JSON.parse(datawre)
            return {
              ...user,
              reform: reformInfo,
            }
          } catch (error) {
            console.error("Error fetching user info:", error)
            return user
          }
        }),
      )

      const sortedUsers = usersWithReformInfo.sort((a: User, b: User) => a.name.localeCompare(b.name))
      setUsersList(sortedUsers)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchUsers()
    setTimeout(() => setRefreshing(false), 1000)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    let isMounted = true

    fetchUserInfo()
      .then((data: any) => {
        if (isMounted) {
          const datawZX = decrypt(data)
          const SetDataFeas = JSON.parse(datawZX)
          setUserInfo(SetDataFeas)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const getInviteStats = (): InviteStats => {
    const validUsers = usersList.filter((user) => user.reforms)
    return {
      total: validUsers.length,
      used: validUsers.filter((user) => user.reforms?.used).length,
      unused: validUsers.filter((user) => !user.reforms?.used).length,
      primeUsers: validUsers.filter((user) => user.reforms?.prime).length,
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const exportData = () => {
    const csvContent = [
      ["Nome", "Código de Convite", "Status", "Prime", "Data de Criação"],
      ...usersList
        .filter((user) => user.reforms)
        .map((user) => [
          user.name,
          user.reforms!.inviteCode,
          user.reforms!.used ? "Usado" : "Não usado",
          user.reforms!.prime ? "Sim" : "Não",
          moment(user.firstLoginDate).format("DD/MM/YYYY"),
        ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `convites-${moment().format("YYYY-MM-DD")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const ObfuscateInviteCode: React.FC<{ inviteCode: string }> = ({ inviteCode }) => {
    if (!inviteCode || inviteCode.length < 4) return <CodeText>{inviteCode}</CodeText>

    if (!showObfuscated) {
      return (
        <CodeContainer>
          <CodeText>{inviteCode}</CodeText>
          <CopyButton onClick={() => copyToClipboard(inviteCode)}>
            <Copy size={12} />
          </CopyButton>
        </CodeContainer>
      )
    }

    const lastFourDigits = inviteCode.slice(-4)
    const obfuscatedDigits = "*".repeat(lastFourDigits.length)
    const obfuscatedCode = inviteCode.slice(0, -4) + obfuscatedDigits

    return (
      <CodeContainer>
        <CodeText>{obfuscatedCode}</CodeText>
        <CopyButton onClick={() => copyToClipboard(inviteCode)}>
          <Copy size={12} />
        </CopyButton>
      </CodeContainer>
    )
  }

  if (loading) {
    return <LoadingPageView />
  }

  if (!userInfo) {
    return <NotificationUI message={<>Não foi possível processar as informações!!</>} />
  }

  const stats = getInviteStats()
  const displayUsers = searchQuery === "" && filterStatus === "all" && filterPrime === "all" ? usersList : searchResults

  const statsCards = [
    {
      label: "Total de Convites",
      value: stats.total.toString(),
      change: "códigos gerados",
      icon: Ticket,
      color: "#3b82f6",
    },
    {
      label: "Convites Usados",
      value: stats.used.toString(),
      change: `${((stats.used / stats.total) * 100).toFixed(1)}%`,
      icon: CheckCircle,
      color: "#10b981",
    },
    {
      label: "Convites Disponíveis",
      value: stats.unused.toString(),
      change: `${((stats.unused / stats.total) * 100).toFixed(1)}%`,
      icon: XCircle,
      color: "#f59e0b",
    },
    {
      label: "Usuários Prime",
      value: stats.primeUsers.toString(),
      change: `${((stats.primeUsers / stats.total) * 100).toFixed(1)}%`,
      icon: Crown,
      color: "#8b5cf6",
    },
  ]

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Administração de Convites</Title>
          <Subtitle>Gerencie códigos de convite e acompanhe o uso da plataforma</Subtitle>
        </HeaderContent>
        <HeaderActions>
          <ActionButton onClick={() => setShowObfuscated(!showObfuscated)}>
            {showObfuscated ? <Eye size={16} /> : <EyeOff size={16} />}
            {showObfuscated ? "Mostrar" : "Ocultar"}
          </ActionButton>
          <ActionButton onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Atualizar
          </ActionButton>
          <ActionButton onClick={exportData}>
            <Download size={16} />
            Exportar
          </ActionButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <StatCard key={index}>
              <StatHeader>
                <IconContainer color={stat.color}>
                  <Icon size={24} color={stat.color} />
                </IconContainer>
                <ChangeIndicator>{stat.change}</ChangeIndicator>
              </StatHeader>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          )
        })}
      </StatsGrid>

      <FiltersSection>
        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Pesquisar por nome ou código de convite..."
          />
        </SearchContainer>

        <FilterContainer>
          <FilterGroup>
            <FilterLabel>Status:</FilterLabel>
            <FilterSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
              <option value="all">Todos</option>
              <option value="used">Usados</option>
              <option value="unused">Não usados</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Tipo:</FilterLabel>
            <FilterSelect value={filterPrime} onChange={(e) => setFilterPrime(e.target.value as any)}>
              <option value="all">Todos</option>
              <option value="prime">Prime</option>
              <option value="standard">Standard</option>
            </FilterSelect>
          </FilterGroup>
        </FilterContainer>
      </FiltersSection>

      <ContentSection>
        <InviteListCard>
          <CardHeader>
            <CardTitle>Lista de Convites</CardTitle>
            <UserCount>{displayUsers.filter((user) => user.reforms).length} convites encontrados</UserCount>
          </CardHeader>

          <TableHeader>
            <HeaderCell>Código</HeaderCell>
            <HeaderCell>Proprietário</HeaderCell>
            <HeaderCell>Status</HeaderCell>
            <HeaderCell>Tipo</HeaderCell>
            <HeaderCell>Data</HeaderCell>
            <HeaderCell>Ações</HeaderCell>
          </TableHeader>

          <InviteListContainer>
            {isLoading ? (
              <LoadingContainer>
                <LoadingPageView />
              </LoadingContainer>
            ) : displayUsers.filter((user) => user.reforms).length > 0 ? (
              displayUsers
                .filter((user) => user.reforms)
                .map((user) => (
                  <InviteRow key={user.reforms!.inviteCode}>
                    <InviteCode>
                      <ObfuscateInviteCode inviteCode={user.reforms!.inviteCode} />
                    </InviteCode>
                    <OwnerName>{user.name}</OwnerName>
                    <StatusCell>
                      <StatusBadge used={user.reforms!.used}>
                        {user.reforms!.used ? (
                          <>
                            <CheckCircle size={14} />
                            Usado
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            Disponível
                          </>
                        )}
                      </StatusBadge>
                    </StatusCell>
                    <TypeCell>
                      <TypeBadge prime={Boolean(user.reforms!.prime)}>
                        {user.reforms!.prime ? (
                          <>
                            <Crown size={14} />
                            Prime
                          </>
                        ) : (
                          "Standard"
                        )}
                      </TypeBadge>
                    </TypeCell>
                    <DateCell>
                      <Calendar size={14} />
                      {moment(user.firstLoginDate).format("DD/MM/YYYY")}
                    </DateCell>
                    <ActionsCell>
                      <ActionIcon>
                        <Ticket size={16} />
                      </ActionIcon>
                    </ActionsCell>
                  </InviteRow>
                ))
            ) : (
              <EmptyState>
                <Ticket size={48} color="#9ca3af" />
                <EmptyTitle>Nenhum convite encontrado</EmptyTitle>
                <EmptySubtitle>Tente ajustar os filtros de pesquisa</EmptySubtitle>
              </EmptyState>
            )}
          </InviteListContainer>
        </InviteListCard>
      </ContentSection>
    </Container>
  )
}

// Styled Components
const Container = styled.div`
  padding: 24px;
  background-color: #f9fafb;
  min-height: 100vh;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

const HeaderContent = styled.div``

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-family: "Inter", sans-serif;
`

const Subtitle = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 16px;
`

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Inter", sans-serif;

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`

const StatCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const IconContainer = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  background-color: ${(props) => props.color}20;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ChangeIndicator = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
`

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
  font-family: "Inter", sans-serif;
`

const StatLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: "Inter", sans-serif;
`

const FiltersSection = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`

const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px 0 48px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background-color: #ffffff;
  color: #1f2937;
  font-family: "Inter", sans-serif;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  font-family: "Inter", sans-serif;
`

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #ffffff;
  color: #1f2937;
  font-size: 14px;
  font-family: "Inter", sans-serif;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const ContentSection = styled.div``

const InviteListCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const CardHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  font-family: "Inter", sans-serif;
`

const UserCount = styled.span`
  font-size: 14px;
  color: #6b7280;
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 120px 100px 120px 80px;
  padding: 16px 24px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  gap: 16px;
`

const HeaderCell = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: "Inter", sans-serif;
`

const InviteListContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
`

const InviteRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 120px 100px 120px 80px;
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
  gap: 16px;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9fafb;
  }
`

const InviteCode = styled.div`
  font-family: "Monaco", "Menlo", monospace;
  font-size: 14px;
`

const CodeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const CodeText = styled.span`
  font-family: "Monaco", "Menlo", monospace;
  font-size: 14px;
  color: #1f2937;
`

const CopyButton = styled.button`
  padding: 4px;
  border: none;
  background-color: #f3f4f6;
  border-radius: 4px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e5e7eb;
    color: #374151;
  }
`

const OwnerName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  font-family: "Inter", sans-serif;
`

const StatusCell = styled.div``

const StatusBadge = styled.div<{ used: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: "Inter", sans-serif;

  ${({ used }) =>
    used
      ? `
    background-color: #dcfce7;
    color: #166534;
  `
      : `
    background-color: #fef3c7;
    color: #92400e;
  `}
`

const TypeCell = styled.div``

const TypeBadge = styled.div<{ prime: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: "Inter", sans-serif;

  ${({ prime }) =>
    prime
      ? `
    background-color: #f3e8ff;
    color: #7c3aed;
  `
      : `
    background-color: #f3f4f6;
    color: #6b7280;
  `}
`

const DateCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
  font-family: "Inter", sans-serif;
`

const ActionsCell = styled.div`
  display: flex;
  justify-content: center;
`

const ActionIcon = styled.button`
  padding: 8px;
  border: none;
  background-color: #f3f4f6;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e5e7eb;
    color: #374151;
  }
`

const LoadingContainer = styled.div`
  padding: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const EmptyState = styled.div`
  padding: 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

const EmptyTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  font-family: "Inter", sans-serif;
`

const EmptySubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-family: "Inter", sans-serif;
`
