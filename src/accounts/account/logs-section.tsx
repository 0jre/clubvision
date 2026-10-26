import type React from "react"
import styled from "styled-components"
import TimelineItem from "./timeline-item"

 
interface LogsSectionProps {
  title: string
  icon: React.ReactNode
  logs: Array<{
    _id: string
    userId: string
    action: string
    success: boolean
    ip: string
    details?: any
    timestamp: Date
  }>
  isSession?: boolean
  emptyMessage?: string
}

export default function LogsSection({
  title,
  icon,
  logs,
  isSession = false,
  emptyMessage = "Nenhuma atividade encontrada",
}: LogsSectionProps) {
  return (
    <>
      <SectionHeader>
        <SectionIcon>{icon}</SectionIcon>
        <SectionTitle>{title}</SectionTitle>
        <LogCount>{logs.length}</LogCount>
      </SectionHeader>

      <TimelineContainer>
        {logs.length > 0 ? (
          logs.map((log) => <TimelineItem key={log._id} log={log} isSession={isSession} />)
        ) : (
          <EmptyState>
            {icon}
            <h3>Nenhuma atividade</h3>
            <p>{emptyMessage}</p>
          </EmptyState>
        )}
      </TimelineContainer>
    </>
  )
}
 

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.2rem;
  padding-bottom: 0.75rem;
  font-family: 'InterSemiBold', monospace;
 
`

const SectionIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  background: linear-gradient(145deg, #262926 0%, rgba(67, 85, 71, 0.068) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1.125rem;
    height: 1.125rem;
    color: #525853;
  }
`

const SectionTitle = styled.h2`
  color: #f9fafb;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
`

const LogCount = styled.span`
background-color: #38383b11;
  color: #505351;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
`

const TimelineContainer = styled.div`
background-color: #38383b11;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
  
  svg {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #9ca3af;
  }
  
  p {
    font-size: 0.875rem;
    margin: 0;
  }
`
