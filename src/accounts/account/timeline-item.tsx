import styled from "styled-components"
import { Shield, UserCheck, LogIn, LogOut, AlertTriangle, CheckCircle, XCircle, Clock, MapPin, User } from 'lucide-react'

const TimelineItemContainer = styled.div`
  position: relative;
  padding-left: 2rem;
  padding-bottom: 2rem;
  
  &:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 1.125rem;
    top: 2.5rem;
    bottom: -0.5rem;
    width: 2px;
    border-radius: 99px;
    background: linear-gradient(145deg, #2d302e 0%, #1a1c1b 100%);
  }
`

const TimelineIcon = styled.div<{ success?: boolean; type?: string }>`
  position: absolute;
  top: 0.5rem;
  left: -1%;
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 134% 91% 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${(props) =>
    props.success === false ? "#ef4444" : props.type === "session" ? "#3d5242" : "#2d302e"};
  background: ${(props) =>
    props.success === false
      ? "rgba(239, 68, 68, 0.1)"
      : props.type === "session"
        ? "rgba(65, 180, 94, 0.1)"
        : "linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%)"};
  
  svg {
    width: 1rem;
    height: 1rem;
    color: ${(props) => (props.success === false ? "#ef4444" : props.type === "session" ? "#41b45e" : "#9ca3af")};
  }
`

const TimelineContent = styled.div`
  background-color: #38383b11;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 0.25rem;
  font-family: 'ProximaNova-Italic', sans-serif;
`

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
`

const ActionTitle = styled.h3`
  color: #f9fafb;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
`

const StatusBadge = styled.span<{ success: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 26px;
  font-size: 0.75rem;
  font-family: 'ProximaNova-Italic', sans-serif;
  font-weight: 500;
  background: ${(props) => (props.success ? "rgba(65, 180, 94, 0.1)" : "rgba(239, 68, 68, 0.1)")};
  color: ${(props) => (props.success ? "#41b45e" : "#ef4444")};
`

const TimelineTimestamp = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #5b5f5c;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`

const TimelineDetails = styled.div`
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.5;
`

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  svg {
    width: 0.875rem;
    height: 0.875rem;
    color: #6b7280;
  }
`

const getActionIcon = (action: string, success: boolean) => {
  switch (action) {
    case "authentication_started":
    case "oauth_callback":
      return <LogIn />
    case "authentication_finalized":
      return <UserCheck />
    case "user_processing":
      return <User />
    case "discord_add":
    case "role_assignment":
      return <Shield />
    case "logout":
      return <LogOut />
    default:
      return success ? <CheckCircle /> : <XCircle />
  }
}

const getActionTitle = (action: string) => {
  const titles: Record<string, string> = {
    authentication_started: "Autenticação Iniciada",
    authentication_finalized: "Autenticação Finalizada",
    oauth_callback: "Callback OAuth",
    user_processing: "Processamento do Usuário",
    discord_add: "Adição ao Discord",
    role_assignment: "Atribuição de Cargos",
    login_attempt: "Tentativa de Login",
    logout: "Logout",
  }
  return titles[action] || action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

const formatTimestamp = (timestamp: Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp))
}

interface TimelineItemProps {
  log: {
    _id: string
    userId: string
    action: string
    success: boolean
    ip: string
    details?: any
    timestamp: Date
  }
  isSession?: boolean
}

export default function TimelineItem({ log, isSession = false }: TimelineItemProps) {
  return (
    <TimelineItemContainer>
      <TimelineIcon success={log.success} type={isSession ? "session" : "activity"}>
        {getActionIcon(log.action, log.success)}
      </TimelineIcon>

      <TimelineContent>
        <TimelineHeader>
          <ActionTitle>{getActionTitle(log.action)}</ActionTitle>
          <StatusBadge success={log.success}>
            {log.success ? <CheckCircle size={12} /> : <XCircle size={12} />}
            {log.success ? "Sucesso" : "Falha"}
          </StatusBadge>
        </TimelineHeader>

        <TimelineTimestamp>
          <Clock size={14} />
          {formatTimestamp(log.timestamp)}
        </TimelineTimestamp>

        <TimelineDetails>
          <DetailItem>
            <MapPin />
            <span>IP: {log.ip}</span>
          </DetailItem>

          {log.details?.sessionId && (
            <DetailItem>
              <Shield />
              <span>Sessão: {log.details.sessionId.slice(0, 8)}...</span>
            </DetailItem>
          )}

          {log.details?.processingTime && (
            <DetailItem>
              <Clock />
              <span>Tempo: {log.details.processingTime}ms</span>
            </DetailItem>
          )}

          {log.details?.error && (
            <DetailItem>
              <AlertTriangle />
              <span style={{ color: "#ef4444" }}>Erro: {log.details.error}</span>
            </DetailItem>
          )}

          {log.details?.alreadyAuthenticated && (
            <DetailItem>
              <CheckCircle />
              <span>Usuário já autenticado</span>
            </DetailItem>
          )}
        </TimelineDetails>
      </TimelineContent>
    </TimelineItemContainer>
  )
}
