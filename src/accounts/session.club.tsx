"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { Shield, Activity, AlertCircle, Loader2, Users, Key, Clock } from "lucide-react"
import UserProfileCard from "./account/user-profile"
import IPHistoryCard from "./account/ip-history"
import LogsSection from "./account/logs-section"
import TimelineItem from "./account/timeline-item"
import LoadingPageView from "@/resources/loading/market.loading"
import { VisualizationCard } from "@/pages/account/[...params]"
 
interface CompleteLogsData {
  success: boolean
  user: any
  activityLogs: any[]
  reforms: any
  clanData: any
  modLogs: any[]
  sessionHistory: any[]
  ipHistory: any[]
  oauthSessions: any[]
}

export default function SessionClub() {
  const [data, setData] = useState<CompleteLogsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/club/clubvision_logs")
        const result = await response.json() as any

        if (!response.ok) {
          throw new Error(result.error || "Erro ao carregar logs")
        }

        setData(result)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <LoadingContainer>
           <LoadingPageView />
          </LoadingContainer>
        </ContentWrapper>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <ContentWrapper>
          <ErrorContainer>
            <AlertCircle />
            <h2>Erro ao carregar dados</h2>
            <p>{error}</p>
          </ErrorContainer>
        </ContentWrapper>
      </PageContainer>
    )
  }

  if (!data) {
    return null
  }

  const sessionLogs = data.activityLogs.filter((log) =>
    [
      "authentication_started",
      "authentication_finalized",
      "oauth_callback",
      "user_processing",
      "discord_add",
      "role_assignment",
    ].includes(log.action),
  )

  const otherLogs = data.activityLogs.filter(
    (log) =>
      ![
        "authentication_started",
        "authentication_finalized",
        "oauth_callback",
        "user_processing",
        "discord_add",
        "role_assignment",
      ].includes(log.action),
  )

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader>
          <PageTitle>Painel de Conta Completo</PageTitle>
          <PageSubtitle>Visualize todos os dados, logs e atividades do sistema de autenticação</PageSubtitle>
        </PageHeader>

        <TabsContainer>
          <Tab active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
            Visão Geral
          </Tab>
         
          <Tab active={activeTab === "security"} onClick={() => setActiveTab("security")}>
            Segurança
          </Tab>
          <Tab active={activeTab === "activity"} onClick={() => setActiveTab("activity")}>
            Atividades
          </Tab>
        </TabsContainer>

        {activeTab === "overview" && (
          <VisualizationCard>
            <UserProfileCard
              user={data.user}
              totalLogs={data.activityLogs.length}
              sessionCount={data.sessionHistory.length}
              ipCount={data.ipHistory.length}
            />

            <SessionTimelineContainer>
              <TimelineTitle>
                <Clock />
                Últimas Sessões de Autenticação
              </TimelineTitle>
              {sessionLogs.slice(0, 10).map((log) => (
                <TimelineItem key={log._id} log={log} isSession={true} />
              ))}
            </SessionTimelineContainer>
          </VisualizationCard>
        )}

       
        {activeTab === "security" && <IPHistoryCard ipHistory={data.ipHistory} />}

        {activeTab === "activity" && (
          <>
            <LogsSection
              title="Logs de Sessão"
              icon={<Shield />}
              logs={sessionLogs}
              isSession={true}
              emptyMessage="Nenhuma atividade de sessão registrada"
            />

            <LogsSection
              title="Outras Atividades"
              icon={<Activity />}
              logs={otherLogs}
              isSession={false}
              emptyMessage="Nenhuma outra atividade registrada"
            />
          </>
        )}
      </ContentWrapper>
    </PageContainer>
  )
}

const PageContainer = styled.div`
  min-height: 100vh;
 
`

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  text-align: left;
  margin: 1rem;
`

const PageTitle = styled.h1`
  color: #f9fafb;
   font-size: 18px;
  font-weight: 800;
  margin-bottom: 0.5rem; 
 font-family: 'InterSemiBold';

`

const PageSubtitle = styled.p`
  color: #4b4d50;
    font-size: 13px;
  font-family: 'ProximaNova-Italic', sans-serif;
  margin: 0;
`

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #2d302e;
`

const Tab = styled.button<{ active: boolean }>`
  border-bottom: 2px solid ${(props) => (props.active ? "#34a853" : "transparent")};
  color: ${(props) => (props.active ? "#34a853" : "#7e8381")};
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
 font-family: 'InterSemiBold';
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    width: 1rem;
    height: 1rem;
  }
  
  
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
  
  svg {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

const ErrorContainer = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: #ef4444;
  
  svg {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
  }
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin: 0;
    opacity: 0.8;
  }
`

const SessionTimelineContainer = styled.div`
 background-color: #38383b11;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`

const TimelineTitle = styled.h2`
  color: #f9fafb;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
    font-family: 'ProximaNova-Italic', sans-serif;

  svg {
    width: 24px;
    height: 24px;
    color: #41b45e;
  }
`
