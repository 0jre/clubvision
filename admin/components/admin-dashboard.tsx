"use client"

import { useState, useEffect } from "react"
import {
  Users,
  FileText,
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  Trophy,
  Wallet,
  UserCheck,
  Video,
  ImageIcon,
  Type,
  TrendingUp,
  Eye,
  Heart,
  RefreshCw,
  Download,
  Filter,
} from "lucide-react"
import styled from "styled-components"

// Styled Components
const Container = styled.div`
  padding: 32px;
  background: #ffffff;
    border: 1px solid #e5e5e5;
  border-radius: 8px;
  min-height: 100vh;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`

const LastUpdated = styled.div`
  font-size: 14px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
`

const ActionButton = styled.button<{ variant?: "primary" | "secondary" }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${(props) => (props.variant === "primary" ? "#000000" : "#e5e7eb")};
  background: ${(props) => (props.variant === "primary" ? "#000000" : "#ffffff")};
  color: ${(props) => (props.variant === "primary" ? "#ffffff" : "#374151")};

  &:hover {
    background: ${(props) => (props.variant === "primary" ? "#374151" : "#f9fafb")};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`

const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #000000;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
`

const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
  line-height: 1;
`

const StatDescription = styled.div`
  font-size: 14px;
  color: #6b7280;
`

const AlertsSection = styled.div`
  margin-bottom: 40px;
`

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 16px;
`

const AlertsGrid = styled.div`
  display: grid;
  gap: 12px;
`

const AlertCard = styled.div<{ type: "info" | "warning" | "danger" | "success" }>`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${(props) => {
    switch (props.type) {
      case "info":
        return "#3b82f6"
      case "warning":
        return "#f59e0b"
      case "danger":
        return "#ef4444"
      case "success":
        return "#10b981"
      default:
        return "#e5e7eb"
    }
  }};
  background: ${(props) => {
    switch (props.type) {
      case "info":
        return "#eff6ff"
      case "warning":
        return "#fffbeb"
      case "danger":
        return "#fef2f2"
      case "success":
        return "#f0fdf4"
      default:
        return "#ffffff"
    }
  }};

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const AlertIcon = styled.div<{ type: "info" | "warning" | "danger" | "success" }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => {
    switch (props.type) {
      case "info":
        return "#3b82f6"
      case "warning":
        return "#f59e0b"
      case "danger":
        return "#ef4444"
      case "success":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }};
  color: white;
  flex-shrink: 0;
`

const AlertContent = styled.div`
  flex: 1;
`

const AlertTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
`

const AlertMessage = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
`

const ChartCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #000000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`

const ChartTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`

const ChartIcon = styled.div`
  color: #6b7280;
`

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    border-color: #e5e7eb;
    transform: translateX(2px);
  }
`

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  object-fit: cover;
`

const UserInfo = styled.div`
  flex: 1;
`

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
`

const UserStats = styled.div`
  font-size: 12px;
  color: #6b7280;
`

const UserRank = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  background: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
`

const ActivityIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #6b7280;
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #000000;
  text-align: center;
`

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard/overview")
      if (!response.ok) throw new Error("Failed to fetch dashboard data")
      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
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

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Agora"
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
    return `${Math.floor(diffInMinutes / 1440)}d atrás`
  }

  const handleAlertClick = (action: string) => {
    if (action) {
      window.location.href = action
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info size={20} />
      case "warning":
        return <AlertTriangle size={20} />
      case "danger":
        return <XCircle size={20} />
      case "success":
        return <CheckCircle size={20} />
      default:
        return <Info size={20} />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video size={16} />
      case "image":
        return <ImageIcon size={16} />
      case "text":
        return <Type size={16} />
      default:
        return <FileText size={16} />
    }
  }

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <LoadingSpinner />
          <div>Carregando dashboard...</div>
        </LoadingState>
      </Container>
    )
  }

  if (!data) {
    return (
      <Container>
        <ErrorState>
          <XCircle size={48} />
          <h3>Erro ao carregar dados do dashboard</h3>
          <ActionButton variant="primary" onClick={handleRefresh}>
            <RefreshCw size={16} />
            Tentar novamente
          </ActionButton>
        </ErrorState>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>Dashboard Administrativo</Title>
        </HeaderLeft>
        <HeaderRight>
          <LastUpdated>
            <Clock size={16} />
            Última atualização: {formatTimeAgo(data.lastUpdated)}
          </LastUpdated>
          <ActionButton variant="secondary" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Atualizar
          </ActionButton>
      
        </HeaderRight>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon>
              <Users size={24} />
            </StatIcon>
            <StatLabel>USUÁRIOS</StatLabel>
          </StatHeader>
          <StatValue>{formatNumber(data.users.total)}</StatValue>
          <StatDescription>+{data.users.new24h} hoje</StatDescription>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon>
              <FileText size={24} />
            </StatIcon>
            <StatLabel>POSTS</StatLabel>
          </StatHeader>
          <StatValue>{formatNumber(data.posts.total)}</StatValue>
          <StatDescription>+{data.posts.new24h} hoje</StatDescription>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon>
              <DollarSign size={24} />
            </StatIcon>
            <StatLabel>ECONOMIA</StatLabel>
          </StatHeader>
          <StatValue>
            {formatCurrency(data.economy.totalCoins + data.economy.totalBanking + data.economy.totalBits)}
          </StatValue>
          <StatDescription>Média: {formatCurrency(data.economy.avgWealth)}</StatDescription>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon>
              <CreditCard size={24} />
            </StatIcon>
            <StatLabel>RESCUE</StatLabel>
          </StatHeader>
          <StatValue>{formatCurrency(data.monetization.totalRescue)}</StatValue>
          <StatDescription>{data.monetization.totalCreators} criadores</StatDescription>
        </StatCard> 

        <StatCard>
          <StatHeader>
            <StatIcon>
              <Clock size={24} />
            </StatIcon>
            <StatLabel>SAQUES</StatLabel>
          </StatHeader>
          <StatValue>{formatNumber(data.withdrawals.pending)}</StatValue>
          <StatDescription>+{data.withdrawals.completed24h} aprovados hoje</StatDescription>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon>
              <CheckCircle size={24} />
            </StatIcon>
            <StatLabel>VERIFICADOS</StatLabel>
          </StatHeader>
          <StatValue>{formatNumber(data.users.verified)}</StatValue>
          <StatDescription>{data.users.prime} usuários Prime</StatDescription>
        </StatCard>
      </StatsGrid>

      {data.alerts && data.alerts.length > 0 && (
        <AlertsSection>
          <SectionTitle>Alertas do Sistema</SectionTitle>
          <AlertsGrid>
            {data.alerts.map((alert: any, index: number) => (
              <AlertCard key={index} type={alert.type} onClick={() => handleAlertClick(alert.action)}>
                <AlertIcon type={alert.type}>{getAlertIcon(alert.type)}</AlertIcon>
                <AlertContent>
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertMessage>{alert.message}</AlertMessage>
                </AlertContent>
              </AlertCard>
            ))}
          </AlertsGrid>
        </AlertsSection>
      )}

      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartIcon>
              <Trophy size={20} />
            </ChartIcon>
            <ChartTitle>Top Usuários por Nível</ChartTitle>
          </ChartHeader>
          <UserList>
            {data.topUsers.byLevel.map((user: any, index: number) => (
              <UserItem key={user.id}>
                <UserAvatar src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                <UserInfo>
                  <UserName>
                    {user.name}
                    {user.verified && <CheckCircle size={14} color="#6b7280" />}
                  </UserName>
                  <UserStats>Nível {user.level}</UserStats>
                </UserInfo>
                <UserRank>#{index + 1}</UserRank>
              </UserItem>
            ))}
          </UserList>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartIcon>
              <Wallet size={20} />
            </ChartIcon>
            <ChartTitle>Top Usuários por Patrimônio</ChartTitle>
          </ChartHeader>
          <UserList>
            {data.topUsers.byWealth.map((user: any, index: number) => (
              <UserItem key={user.id}>
                <UserAvatar src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                <UserInfo>
                  <UserName>
                    {user.name}
                    {user.verified && <CheckCircle size={14} color="#6b7280" />}
                  </UserName>
                  <UserStats>{formatCurrency(user.totalWealth)} total</UserStats>
                </UserInfo>
                <UserRank>#{index + 1}</UserRank>
              </UserItem>
            ))}
          </UserList>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartIcon>
              <UserCheck size={20} />
            </ChartIcon>
            <ChartTitle>Top Usuários por Seguidores</ChartTitle>
          </ChartHeader>
          <UserList>
            {data.topUsers.byFollowers.map((user: any, index: number) => (
              <UserItem key={user.id}>
                <UserAvatar src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                <UserInfo>
                  <UserName>
                    {user.name}
                    {user.verified && <CheckCircle size={14} color="#6b7280" />}
                  </UserName>
                  <UserStats>{formatNumber(user.followersCount)} seguidores</UserStats>
                </UserInfo>
                <UserRank>#{index + 1}</UserRank>
              </UserItem>
            ))}
          </UserList>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <TrendingUp size={20} />
            </ChartTitle>
          </ChartHeader>
          <UserList>
            {data.recentActivities.map((activity: any) => (
              <UserItem key={activity._id}>
                <ActivityIcon>{getActivityIcon(activity.type)}</ActivityIcon>
                <UserInfo>
                  <UserName>
                    {activity.userName} criou um {activity.type}
                  </UserName>
                  <UserStats>
                    <Eye size={12} style={{ display: "inline", marginRight: "4px" }} />
                    {activity.views} •{" "}
                    <Heart size={12} style={{ display: "inline", marginLeft: "8px", marginRight: "4px" }} />
                    {activity.likesCount} • {formatTimeAgo(activity.createdAt)}
                  </UserStats>
                </UserInfo>
              </UserItem>
            ))}
          </UserList>
        </ChartCard>
      </ChartsGrid>
    </Container>
  )
}
