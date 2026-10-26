"use client"

import type React from "react"
import { useState } from "react"
import {
  Search,
  CheckCircle,
  Crown,
  Shield,
  TrendingUp,
  DollarSign,
  CreditCard,
  Users,
  FileText,
  Gamepad2,
  Monitor,
  ChevronDown,
  ChevronUp,
  Filter,
  SortAsc,
  Download,
  Zap,
  Target,
  Activity,
} from "lucide-react"
import styled, { keyframes } from "styled-components"

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

// Styled Components
const Container = styled.div`
  padding: 0;
   border: 1px solid #e5e5e5;
  border-radius: 8px;
`

const SearchHeader = styled.div`
  padding: 32px;
 
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
`

const SearchTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
`

const SearchSubtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
`

const SearchControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`

const SearchInputGroup = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 56px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  background: #ffffff;
  transition: all 0.3s ease;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`

const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  transition: color 0.3s ease;
  
  ${SearchInput}:focus + & {
    color: #000000;
  }
`

const ActionButton = styled.button<{ variant?: "primary" | "secondary" }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${(props) => (props.variant === "primary" ? "#000000" : "#e5e7eb")};
  background: ${(props) => (props.variant === "primary" ? "#000000" : "#ffffff")};
  color: ${(props) => (props.variant === "primary" ? "#ffffff" : "#374151")};
  white-space: nowrap;

  &:hover {
    background: ${(props) => (props.variant === "primary" ? "#374151" : "#f9fafb")};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const ResultsContainer = styled.div`
  padding: 32px;
`

const ResultsHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
`

const ResultsCount = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`

const UserGrid = styled.div<{ $viewMode: "grid" | "list" }>`
  
 
`

const UserCard = styled.div<{ $expanded: boolean }>`
  border: 2px solid #f3f4f6;
  border-radius: 16px;
  background: #ffffff;
    width: 100%;
  transition: all 0.3s ease;
  overflow: hidden;
  animation: ${fadeInUp} 0.5s ease-out;
  

  ${(props) =>
    props.$expanded &&
    `
    border-color: #000000;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  `}
`

const UserHeader = styled.div`
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
`

const Avatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: #f3f4f6;
  object-fit: cover;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const UserInfo = styled.div`
  flex: 1;
`

const UserName = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
`

const UserDetails = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
  font-family: monospace;
`

const BadgeContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const Badge = styled.span<{ variant?: "primary" | "secondary" | "success" }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${(props) => {
    switch (props.variant) {
      case "primary":
        return `
          background: #000000;
          color: white;
        `
      case "secondary":
        return `
          background: #374151;
          color: white;
        `
      case "success":
        return `
          background: #f3f4f6;
          color: #374151;
        `
      default:
        return `
          background: #f9fafb;
          color: #6b7280;
          border: 1px solid #e5e7eb;
        `
    }
  }}
`

const ExpandButton = styled.div`
  color: #9ca3af;
  transition: all 0.3s ease;
  
  ${UserCard}:hover & {
    color: #000000;
    transform: scale(1.1);
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  padding: 0 24px 24px 24px;
`

const StatCard = styled.div`
  text-align: center;
  padding: 20px 16px;
  background: #fafafa;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f3f4f6;
    transform: translateY(-2px);
  }
`

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: #6b7280;
`

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
`

const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const ExpandedDetails = styled.div`
  padding: 24px;
  border-top: 1px solid #f3f4f6;
  background: #fafafa;
  animation: ${fadeInUp} 0.3s ease-out;
`

const DetailSection = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const DetailTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`

const DetailLabel = styled.span`
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
`

const DetailValue = styled.span`
  color: #000000;
  font-weight: 600;
  font-size: 14px;
`

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #6b7280;
`

const LoadingSkeleton = styled.div`
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  height: 20px;
  margin-bottom: 8px;
`

const NoResults = styled.div`
  text-align: center;
  padding: 80px 0;
  color: #6b7280;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #f9fafb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`

interface UserSearchProps {
  viewMode?: "grid" | "list"
}

export function UserSearch({ viewMode = "grid" }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)

  const searchUsers = async () => {
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/search?query=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) throw new Error("Failed to search users")
      const data = await response.json() as any
      setUsers(data.users)
    } catch (error) {
      console.error("Error searching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchUsers()
    }
  }

  const toggleUserDetails = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId)
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  return (
    <Container>
      <SearchHeader>
        <SearchTitle>Procurar Usuarios</SearchTitle>
        <SearchSubtitle>Busca avançada e análise detalhada de usuários da plataforma</SearchSubtitle>

        <SearchControls>
          <SearchInputGroup>
            <SearchInput
              type="text"
              placeholder="Buscar por nome, ID, username ou discriminator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
          </SearchInputGroup>

          <ActionButton variant="primary" onClick={searchUsers} disabled={loading || !searchQuery.trim()}>
            {loading ? <Activity size={16} /> : <Target size={16} />}
            {loading ? "Buscando..." : "Buscar"}
          </ActionButton>

     
        </SearchControls>
      </SearchHeader>

      <ResultsContainer>
        {loading && (
          <LoadingState>
            <Activity size={32} />
            <div>Buscando usuários...</div>
          </LoadingState>
        )}

        {!loading && users.length === 0 && searchQuery && (
          <NoResults>
            <EmptyState>
              <EmptyIcon>
                <Search size={32} />
              </EmptyIcon>
              <div>
                <h3>Nenhum usuário encontrado</h3>
                <p>Tente ajustar os termos de busca para "{searchQuery}"</p>
              </div>
            </EmptyState>
          </NoResults>
        )}

        {!loading && users.length > 0 && (
          <>
            <ResultsHeader>
              <ResultsCount>
                {users.length} usuário{users.length !== 1 ? "s" : ""} encontrado{users.length !== 1 ? "s" : ""}
              </ResultsCount>
            </ResultsHeader>

            <UserGrid $viewMode={viewMode}>
              {users.map((user) => (
                <UserCard key={user.id} $expanded={expandedUser === user.id} onClick={() => toggleUserDetails(user.id)}>
                  <UserHeader>
                    <Avatar src={user.avatar || "/placeholder.svg?height=56&width=56"} alt="Avatar" />
                    <UserInfo>
                      <UserName>{user.name}</UserName>
                      <UserDetails>
                        @{user.username} #{user.discriminator} • ID: {user.id}
                      </UserDetails>
                      <BadgeContainer>
                        {user.verified && (
                          <Badge variant="primary">
                            <CheckCircle size={12} />
                            Verificado
                          </Badge>
                        )}
                        {user.prime && (
                          <Badge variant="secondary">
                            <Crown size={12} />
                            Prime
                          </Badge>
                        )}
                        {user.type === "ADMIN" && (
                          <Badge variant="secondary">
                            <Shield size={12} />
                            Admin
                          </Badge>
                        )}
                        <Badge>
                          <TrendingUp size={12} />
                          Nível {user.level}
                        </Badge>
                        <Badge>{user.momentum}</Badge>
                      </BadgeContainer>
                    </UserInfo>
                    <ExpandButton>
                      {expandedUser === user.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </ExpandButton>
                  </UserHeader>

                  <StatsGrid>
                    <StatCard>
                      <StatIcon>
                        <DollarSign size={20} />
                      </StatIcon>
                      <StatValue>{formatCurrency(user.totalWealth)}</StatValue>
                      <StatLabel>Patrimônio</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatIcon>
                        <CreditCard size={20} />
                      </StatIcon>
                      <StatValue>{formatCurrency(user.rescue)}</StatValue>
                      <StatLabel>Rescue</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatIcon>
                        <Users size={20} />
                      </StatIcon>
                      <StatValue>{formatNumber(user.followersCount)}</StatValue>
                      <StatLabel>Seguidores</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatIcon>
                        <FileText size={20} />
                      </StatIcon>
                      <StatValue>{formatNumber(user.totalPosts)}</StatValue>
                      <StatLabel>Posts</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatIcon>
                        <Monitor size={20} />
                      </StatIcon>
                      <StatValue>{user.hasTwitch ? "✓" : "✗"}</StatValue>
                      <StatLabel>Twitch</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatIcon>
                        <Gamepad2 size={20} />
                      </StatIcon>
                      <StatValue>{user.hasSteam ? "✓" : "✗"}</StatValue>
                      <StatLabel>Steam</StatLabel>
                    </StatCard>
                  </StatsGrid>

                  {expandedUser === user.id && (
                    <ExpandedDetails>
                      <DetailSection>
                        <DetailTitle>
                          <Activity size={16} />
                          Estatísticas Detalhadas
                        </DetailTitle>
                        <DetailGrid>
                          <DetailItem>
                            <DetailLabel>Nível:</DetailLabel>
                            <DetailValue>{user.fullData?.stats?.level || 0}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>XP:</DetailLabel>
                            <DetailValue>{formatNumber(user.fullData?.stats?.xp || 0)}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Atividade Club:</DetailLabel>
                            <DetailValue>{formatNumber(user.fullData?.stats?.clubactivity || 0)}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Convites:</DetailLabel>
                            <DetailValue>{user.fullData?.stats?.invite || 0}</DetailValue>
                          </DetailItem>
                        </DetailGrid>
                      </DetailSection>

                      <DetailSection>
                        <DetailTitle>
                          <DollarSign size={16} />
                          Economia
                        </DetailTitle>
                        <DetailGrid>
                          <DetailItem>
                            <DetailLabel>Coins:</DetailLabel>
                            <DetailValue>{formatCurrency(user.fullData?.items?.coins || 0)}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Banking:</DetailLabel>
                            <DetailValue>{formatCurrency(user.fullData?.items?.banking || 0)}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Bits:</DetailLabel>
                            <DetailValue>{formatCurrency(user.fullData?.items?.bits || 0)}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Rescue:</DetailLabel>
                            <DetailValue>{formatCurrency(user.fullData?.monetization?.rescue || 0)}</DetailValue>
                          </DetailItem>
                        </DetailGrid>
                      </DetailSection>

                      <DetailSection>
                        <DetailTitle>
                          <Zap size={16} />
                          Conexões
                        </DetailTitle>
                        <DetailGrid>
                          <DetailItem>
                            <DetailLabel>Twitch:</DetailLabel>
                            <DetailValue>
                              {user.fullData?.connections?.twitch?.user_nametwitch || "Não conectado"}
                            </DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Steam:</DetailLabel>
                            <DetailValue>
                              {user.fullData?.connections?.steam?.displayName || "Não conectado"}
                            </DetailValue>
                          </DetailItem>
                        </DetailGrid>
                      </DetailSection>

                      <DetailSection>
                        <DetailTitle>
                          <Shield size={16} />
                          Informações da Conta
                        </DetailTitle>
                        <DetailGrid>
                          <DetailItem>
                            <DetailLabel>Primeiro Login:</DetailLabel>
                            <DetailValue>{user.firstLoginDate ? formatDate(user.firstLoginDate) : "N/A"}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Subdomínio:</DetailLabel>
                            <DetailValue>{user.fullData?.reform?.subdominio || "N/A"}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Tipo:</DetailLabel>
                            <DetailValue>{user.type}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Status:</DetailLabel>
                            <DetailValue>
                              {user.verified ? "Verificado" : "Não verificado"} • {user.prime ? "Prime" : "Regular"}
                            </DetailValue>
                          </DetailItem>
                        </DetailGrid>
                      </DetailSection>
                    </ExpandedDetails>
                  )}
                </UserCard>
              ))}
            </UserGrid>
          </>
        )}
      </ResultsContainer>
    </Container>
  )
}
