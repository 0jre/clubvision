import styled from "styled-components"
import { Shield, Calendar, MapPin, Mail, Hash, ShieldHalf , CheckCircle, XCircle, AlertTriangle, Star, IdCard } from "lucide-react"

 
interface UserProfileCardProps {
  user: {
    id: string
    discord_id: string
    username: string
    email: string
    discriminator: string
    avatar: string
    firstLoginDate: string
    lastLoginDate: string
    lastLoginIp: string
    ip: {
      address: string
      country: string
      city: string
      country_code: string
    }
    vision: {
      signature: string
      visionid: string
    }
    security: {
      createdAt: string
      lastIpCheck: string
      authAttempts: number
    }
    quality: {
      reputation: string
      statsaccount: string
      statswallet: string
    }
    type?: string
    manager?: boolean
    codeVerified: boolean
    accepted: boolean
    following: string[]
    followers: string[]
    trash?: boolean
    banned?: boolean
    suspended?: boolean
  }
  totalLogs: number
  sessionCount: number
  ipCount: number
}

export default function UserProfileCard({ user, totalLogs, sessionCount, ipCount }: UserProfileCardProps) {
  const getStatusBadge = () => {
    if (user.banned) return { type: "banned" as const, icon: <XCircle /> }
    if (user.suspended) return { type: "suspended" as const, icon: <AlertTriangle /> }
    if (user.type === "ADMIN") return { type: "admin" as const, icon: <ShieldHalf  /> }
    if (user.manager) return { type: "manager" as const, icon: <Star /> }
    if (user.codeVerified) return { type: "verified" as const, icon: <CheckCircle /> }
    return null
  }

  const statusBadge = getStatusBadge()

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarContainer>
          <Avatar src={user.avatar} alt={user.username} />
          {statusBadge && <StatusBadge type={statusBadge.type}>{statusBadge.icon}</StatusBadge>}
        </AvatarContainer>

        <UserDetails>
          <UserName>
            {user.username}
            {user.type === "ADMIN" && <ShieldHalf  size={20} color="#41b45e" />}
          </UserName>

          <UserMeta>
             <MetaItem>
              <IdCard />
              <span>Ass. Digital:</span>
              <span className="value">{user.id}</span>
            </MetaItem>    
            <MetaItem>
              <MapPin />
              <span>Localização:</span>
              <span className="value">
                {user.ip.city}, {user.ip.country}
              </span>
            </MetaItem>
          </UserMeta>
        </UserDetails>
      </ProfileHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Calendar />
          </StatIcon>
          <StatContent>
            <StatValue>{totalLogs}</StatValue>
            <StatLabel>Total de Atividades</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon>
            <Shield />
          </StatIcon>
          <StatContent>
            <StatValue>{sessionCount}</StatValue>
            <StatLabel>Sessões Registradas</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon>
            <MapPin />
          </StatIcon>
          <StatContent>
            <StatValue>{ipCount}</StatValue>
            <StatLabel>IPs Diferentes</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard variant={user.security.authAttempts > 5 ? "warning" : "success"}>
          <StatIcon variant={user.security.authAttempts > 5 ? "warning" : "success"}>
            <AlertTriangle />
          </StatIcon>
          <StatContent>
            <StatValue>{user.security.authAttempts}</StatValue>
            <StatLabel>Tentativas de Auth</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <SecuritySection>
        <SectionTitle>
          <Shield />
          Informações de Segurança
        </SectionTitle>

        <SecurityGrid>
          <div>
            <SecurityItem>
              <SecurityLabel>Primeiro Login</SecurityLabel>
              <SecurityValue>{formatDate(user.firstLoginDate)}</SecurityValue>
            </SecurityItem>
            <SecurityItem>
              <SecurityLabel>Último Login</SecurityLabel>
              <SecurityValue>{formatDate(user.lastLoginDate)}</SecurityValue>
            </SecurityItem>
            <SecurityItem>
              <SecurityLabel>Último IP</SecurityLabel>
              <SecurityValue>{user.lastLoginIp}</SecurityValue>
            </SecurityItem>
          </div>

          <div>
            <SecurityItem>
              <SecurityLabel>Vision ID</SecurityLabel>
              <SecurityValue>{user.vision.visionid.slice(0, 12)}...</SecurityValue>
            </SecurityItem>
            <SecurityItem>
              <SecurityLabel>Reputação</SecurityLabel>
              <SecurityValue>{user.quality.reputation}</SecurityValue>
            </SecurityItem>
            <SecurityItem>
              <SecurityLabel>Status da Conta</SecurityLabel>
              <SecurityValue>{user.quality.statsaccount}</SecurityValue>
            </SecurityItem>
          </div>
        </SecurityGrid>
      </SecuritySection>
    </ProfileContainer>
  )
}
const ProfileContainer = styled.div`
 
  margin-bottom: 2rem;
`

const ProfileHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const AvatarContainer = styled.div`
  position: relative;
  
`

const Avatar = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 26px;
  border: 2px solid #41b45e;
   padding: 0.4em;
`

const StatusBadge = styled.div<{ type: "admin" | "manager" | "verified" | "banned" | "suspended" }>`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0f1110;
  background: ${(props) => {
    switch (props.type) {
      case "admin":
        return "#41b45e"
      case "manager":
        return "#f59e0b"
      case "verified":
        return "#3b82f6"
      case "banned":
        return "#ef4444"
      case "suspended":
        return "#f97316"
      default:
        return "#6b7280"
    }
  }};
  
  svg {
    width: 0.75rem;
    height: 0.75rem;
    color: white;
  }
`

const UserDetails = styled.div`
  flex: 1;
`

const UserName = styled.h1`
  color: #f9fafb;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6a706d;
  font-size: 0.775rem;
  
  svg {
    width: 1rem;
    height: 1rem;
  }
  
  .value {
    color: #d1d5db;
    font-weight: 500;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div<{ variant?: "success" | "warning" | "danger" }>`
  background: ${(props) => {
    switch (props.variant) {
      case "success":
        return "rgba(65, 180, 94, 0.05)"
      case "warning":
        return "rgba(245, 158, 11, 0.05)"
      case "danger":
        return "rgba(239, 68, 68, 0.05)"
      default:
        return "rgba(41, 43, 41, 0.397)"
    }
  }};
  
  border-radius: 8px;
  padding: 0.6em 1em 0.6em;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const StatIcon = styled.div<{ variant?: "success" | "warning" | "danger" }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  background: ${(props) => {
    switch (props.variant) {
      case "success":
        return "rgba(65, 180, 94, 0.034)"
      case "warning":
        return "rgba(245, 158, 11, 0.1)"
      case "danger":
        return "rgba(239, 68, 68, 0.1)"
      default:
        return "rgba(132, 138, 134, 0.055)"
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${(props) => {
      switch (props.variant) {
        case "success":
          return "#41b45e"
        case "warning":
          return "#f59e0b"
        case "danger":
          return "#ef4444"
        default:
          return "rgba(87, 92, 88, 0.253)"
      }
    }};
  }
`

const StatContent = styled.div`
  flex: 1;
`

const StatValue = styled.div`
  color: #f9fafb;
  font-size: 1.25rem;
  font-weight: 700;
  
`

const StatLabel = styled.div`
  color: #5a5f5b;
  font-size: 0.775rem;
  font-family: 'ProximaNova-Italic', sans-serif;
`

const SecuritySection = styled.div`
background-color: #38383b11;
  border-radius: 12px;
  padding: 1.5rem;
  font-family: 'ProximaNova-Italic', sans-serif;

`

const SectionTitle = styled.h3`
  color: #f9fafb;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #41b45e;
  }
`

const SecurityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`

const SecurityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(45, 48, 46, 0.5);
  
  &:last-child {
    border-bottom: none;
  }
`

const SecurityLabel = styled.span`
  color: #4f5250;
  font-size: 0.875rem;
`

const SecurityValue = styled.span`
  color: #d1d5db;
  font-size: 0.875rem;
  font-weight: 500;
`
