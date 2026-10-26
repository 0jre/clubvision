"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import styled from "styled-components"
import { toPng } from "html-to-image"
import {
  Ticket,
  Plus,
  Copy,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Share2,
  Eye,
  TrendingUp,
  Settings,
} from "lucide-react"
import moment from "moment"

interface CodeData {
  code: string
  usedBy: string[]
  expiresAt: string
  createdAt: string
}

const CreateCodeComponent: React.FC = () => {
  const [code, setCode] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [isSharing, setIsSharing] = useState(false)
  const [codesList, setCodesList] = useState<CodeData[]>([])
  const [hasActiveCodes, setHasActiveCodes] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<"generator" | "history" | "analytics">("generator")
  const [refreshing, setRefreshing] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expired">("all")
  const slideRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchCodesList()
  }, [])

  useEffect(() => {
    const activeCodeExists = codesList.some((code) => new Date(code.expiresAt) > new Date())
    setHasActiveCodes(activeCodeExists)
  }, [codesList])

  const generateCode = (): string => {
    const prefix = "NVRP-"
    const length = 17
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let generatedCode = prefix

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      generatedCode += characters.charAt(randomIndex)
    }

    return generatedCode
  }

  const sendImageToDiscord = async (code: string, imageData: string) => {
    try {
      const response = await axios.post("/api/_v4/bitger/senddiscord", {
        code,
        imageData,
      })

      if (response.status === 200) {
        console.log("Imagem enviada com sucesso!")
      } else {
        console.error("Falha ao enviar a imagem. Resposta do servidor:", response.data)
      }
    } catch (error) {
      console.error("Erro ao enviar para a API:", error)
    }
  }

  const handleCreateCode = async () => {
    setIsLoading(true)
    setMessage("")

    const newCode = generateCode()
    setCode(newCode)

    try {
      const response = await axios.post("/api/_v4/bitger/generateCode", { code: newCode })

      if (response.status === 200) {
        await fetchCodesList()
        setMessage("Código gerado com sucesso!")

        if (slideRef.current) {
          setIsSharing(true)
          try {
            const dataUrl = await toPng(slideRef.current)
            await sendImageToDiscord(newCode, dataUrl)
          } catch (error) {
            console.error("Erro ao capturar ou enviar a imagem:", error)
          } finally {
            setIsSharing(false)
          }
        }
      } else {
        setMessage("Falha ao gerar o código.")
      }
    } catch (error) {
      console.error(error)
      setMessage("Erro ao criar o código.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCodesList()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const formatNumber = (num: number): string => {
    if (num === undefined || num === null || isNaN(num)) {
      return "0"
    }

    if (num >= 1e15) {
      return (num / 1e15).toFixed(num % 1e15 !== 0 ? 1 : 0) + "Q"
    } else if (num >= 1e12) {
      return (num / 1e12).toFixed(num % 1e12 !== 0 ? 1 : 0) + "T"
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(num % 1e9 !== 0 ? 1 : 0) + "B"
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(num % 1e6 !== 0 ? 1 : 0) + "M"
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(num % 1e3 !== 0 ? 1 : 0) + "K"
    } else {
      return num.toFixed(0)
    }
  }

  const fetchCodesList = async () => {
    try {
      const response = await axios.get("/api/_v4/bitger/generateCode")
      if (response.status === 200) {
        setCodesList(response.data)
      }
    } catch (error) {
      console.error("Erro ao buscar lista de códigos:", error)
    }
  }

  const getLatestActiveCode = () => {
    return (
      codesList
        .filter((code) => new Date(code.expiresAt) > new Date())
        .sort((a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime())[0]?.code || ""
    )
  }

  const getCodeStats = () => {
    const totalCodes = codesList.length
    const activeCodes = codesList.filter((code) => new Date(code.expiresAt) > new Date()).length
    const totalUses = codesList.reduce((sum, code) => sum + code.usedBy.length, 0)
    const expiredCodes = totalCodes - activeCodes
    const avgUsesPerCode = totalCodes > 0 ? totalUses / totalCodes : 0

    return { totalCodes, activeCodes, totalUses, expiredCodes, avgUsesPerCode }
  }

  const getFilteredCodes = () => {
    return codesList.filter((code) => {
      const isActive = new Date(code.expiresAt) > new Date()
      if (filterStatus === "active") return isActive
      if (filterStatus === "expired") return !isActive
      return true
    })
  }

  const exportData = () => {
    const csvContent = [
      ["Código", "Usos", "Status", "Data de Criação", "Data de Expiração"],
      ...codesList.map((code) => [
        code.code,
        code.usedBy.length.toString(),
        new Date(code.expiresAt) > new Date() ? "Ativo" : "Expirado",
        moment(code.createdAt).format("DD/MM/YYYY HH:mm"),
        moment(code.expiresAt).format("DD/MM/YYYY HH:mm"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `codigos-promocionais-${moment().format("YYYY-MM-DD")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessage("Código copiado para a área de transferência!")
    setTimeout(() => setMessage(""), 3000)
  }

  const stats = getCodeStats()
  const filteredCodes = getFilteredCodes()

  const statsCards = [
    {
      label: "Total de Códigos",
      value: stats.totalCodes.toString(),
      change: "códigos gerados",
      icon: Ticket,
      color: "#35bb6d",
    },
    {
      label: "Códigos Ativos",
      value: stats.activeCodes.toString(),
      change: `${((stats.activeCodes / stats.totalCodes) * 100 || 0).toFixed(1)}%`,
      icon: CheckCircle,
      color: "#10b981",
    },
    {
      label: "Total de Usos",
      value: formatNumber(stats.totalUses),
      change: `${stats.avgUsesPerCode.toFixed(1)} por código`,
      icon: Users,
      color: "#f59e0b",
    },
    {
      label: "Códigos Expirados",
      value: stats.expiredCodes.toString(),
      change: `${((stats.expiredCodes / stats.totalCodes) * 100 || 0).toFixed(1)}%`,
      icon: XCircle,
      color: "#ef4444",
    },
  ]

  const CodeSlide = () => {
    const displayCode = code || getLatestActiveCode() || "Nenhum código ativo"

    return (
      <SlideContainer ref={slideRef}>
        <SlideBackground>
          <SlideContent>
          
        
            <SlideCode>{displayCode}</SlideCode>
          
          </SlideContent>
        </SlideBackground>
      </SlideContainer>
    )
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Códigos Promocionais</Title>
          <Subtitle>Gerencie códigos promocionais e acompanhe estatísticas de uso</Subtitle>
        </HeaderContent>
        <HeaderActions>
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

      <ContentGrid>
        <MainContent>
          <TabNavigation>
            <TabButton active={activeTab === "generator"} onClick={() => setActiveTab("generator")}>
              <Plus size={20} />
              Gerador
            </TabButton>
            <TabButton active={activeTab === "history"} onClick={() => setActiveTab("history")}>
              <Clock size={20} />
              Histórico
            </TabButton>
            <TabButton active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>
              <TrendingUp size={20} />
              Analytics
            </TabButton>
          </TabNavigation>

          <TabContent>
            {activeTab === "generator" && (
              <GeneratorSection>
                <GeneratorCard>
                  <GeneratorHeader>
                    <GeneratorIcon>
                      <Settings size={48} color="#35bb6d" />
                    </GeneratorIcon>
                    <GeneratorTitle>Gerar Novo Código</GeneratorTitle>
                    <GeneratorDescription>
                      {hasActiveCodes
                        ? "Já existe um código ativo. Aguarde a expiração para gerar um novo código promocional."
                        : "Clique no botão abaixo para gerar um novo código promocional que será automaticamente compartilhado no Discord."}
                    </GeneratorDescription>
                  </GeneratorHeader>

                  {!hasActiveCodes && (
                    <GeneratorButton onClick={handleCreateCode} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <LoadingSpinner />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Plus size={20} />
                          Gerar Código
                        </>
                      )}
                    </GeneratorButton>
                  )}

                  {hasActiveCodes && (
                    <ActiveCodeAlert>
                      <CheckCircle size={20} />
                      <div>
                        <AlertTitle>Código Ativo Encontrado</AlertTitle>
                        <AlertDescription>
                          Código atual: <strong>{getLatestActiveCode()}</strong>
                        </AlertDescription>
                      </div>
                    </ActiveCodeAlert>
                  )}

                  {(code || message || isSharing) && (
                    <ResultSection>
                      {isSharing && (
                        <SharingStatus>
                          <LoadingSpinner />
                          <span>Compartilhando no Discord...</span>
                        </SharingStatus>
                      )}

                      {code && (
                        <CodeResult>
                          <CodeResultLabel>Código Gerado:</CodeResultLabel>
                          <CodeResultValue>{code}</CodeResultValue>
                          <CodeActions>
                            <CopyButton onClick={() => copyToClipboard(code)}>
                              <Copy size={16} />
                              Copiar
                            </CopyButton>
                            <ShareButton>
                              <Share2 size={16} />
                              Compartilhar
                            </ShareButton>
                          </CodeActions>
                        </CodeResult>
                      )}

                      {message && (
                        <MessageAlert success={message.includes("sucesso")}>
                          {message.includes("sucesso") ? <CheckCircle size={16} /> : <XCircle size={16} />}
                          {message}
                        </MessageAlert>
                      )}
                    </ResultSection>
                  )}
                </GeneratorCard>
              </GeneratorSection>
            )}

            {activeTab === "history" && (
              <HistorySection>
                <HistoryHeader>
                  <HistoryTitle>Histórico de Códigos</HistoryTitle>
                  <FilterContainer>
                    <FilterSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
                      <option value="all">Todos os códigos</option>
                      <option value="active">Códigos ativos</option>
                      <option value="expired">Códigos expirados</option>
                    </FilterSelect>
                  </FilterContainer>
                </HistoryHeader>

                {filteredCodes.length > 0 ? (
                  <CodesTable>
                    <TableHeader>
                      <HeaderCell>Código</HeaderCell>
                      <HeaderCell>Usos</HeaderCell>
                      <HeaderCell>Status</HeaderCell>
                      <HeaderCell>Validade</HeaderCell>
                      <HeaderCell>Ações</HeaderCell>
                    </TableHeader>
                    <TableBody>
                      {filteredCodes
                        .sort((a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime())
                        .map((item, index) => {
                          const isExpired = new Date(item.expiresAt) < new Date()
                          const isActive = !isExpired

                          return (
                            <TableRow key={index}>
                              <CodeCell>
                                <CodeDisplay>{item.code}</CodeDisplay>
                              </CodeCell>
                              <UsesCell>
                                <UsesCount>{formatNumber(item.usedBy.length)}</UsesCount>
                                <UsesLabel>usos</UsesLabel>
                              </UsesCell>
                              <StatusCell>
                                <StatusBadge active={isActive}>
                                  {isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                  {isActive ? "Ativo" : "Expirado"}
                                </StatusBadge>
                              </StatusCell>
                              <ValidityCell>
                                <ValidityDate>{moment(item.expiresAt).format("DD/MM/YYYY")}</ValidityDate>
                                <ValidityTime>{moment(item.expiresAt).format("HH:mm")}</ValidityTime>
                              </ValidityCell>
                              <ActionsCell>
                                <ActionIcon onClick={() => copyToClipboard(item.code)}>
                                  <Copy size={14} />
                                </ActionIcon>
                                <ActionIcon>
                                  <Eye size={14} />
                                </ActionIcon>
                              </ActionsCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </CodesTable>
                ) : (
                  <EmptyState>
                    <Ticket size={48} color="#9ca3af" />
                    <EmptyTitle>Nenhum código encontrado</EmptyTitle>
                    <EmptyDescription>
                      {filterStatus === "all"
                        ? "Gere seu primeiro código promocional para começar"
                        : `Nenhum código ${filterStatus === "active" ? "ativo" : "expirado"} encontrado`}
                    </EmptyDescription>
                  </EmptyState>
                )}
              </HistorySection>
            )}

            {activeTab === "analytics" && (
              <AnalyticsSection>
                <AnalyticsHeader>
                  <AnalyticsTitle>Analytics e Relatórios</AnalyticsTitle>
                  <AnalyticsDescription>Análise detalhada do desempenho dos códigos promocionais</AnalyticsDescription>
                </AnalyticsHeader>

                <AnalyticsGrid>
                  <AnalyticsCard>
                    <CardTitle>Desempenho Geral</CardTitle>
                    <MetricsList>
                      <MetricItem>
                        <MetricLabel>Taxa de Uso Média:</MetricLabel>
                        <MetricValue>{stats.avgUsesPerCode.toFixed(2)} usos/código</MetricValue>
                      </MetricItem>
                      <MetricItem>
                        <MetricLabel>Código Mais Usado:</MetricLabel>
                        <MetricValue>
                          {codesList.length > 0
                            ? codesList.reduce((prev, current) =>
                                prev.usedBy.length > current.usedBy.length ? prev : current,
                              ).code
                            : "N/A"}
                        </MetricValue>
                      </MetricItem>
                      <MetricItem>
                        <MetricLabel>Total de Usuários Únicos:</MetricLabel>
                        <MetricValue>{new Set(codesList.flatMap((code) => code.usedBy)).size} usuários</MetricValue>
                      </MetricItem>
                    </MetricsList>
                  </AnalyticsCard>

                  <AnalyticsCard>
                    <CardTitle>Códigos Recentes</CardTitle>
                    <RecentCodesList>
                      {codesList
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 5)
                        .map((code, index) => (
                          <RecentCodeItem key={index}>
                            <RecentCodeInfo>
                              <RecentCodeText>{code.code}</RecentCodeText>
                              <RecentCodeDate>{moment(code.createdAt).fromNow()}</RecentCodeDate>
                            </RecentCodeInfo>
                            <RecentCodeUses>{code.usedBy.length} usos</RecentCodeUses>
                          </RecentCodeItem>
                        ))}
                    </RecentCodesList>
                  </AnalyticsCard>
                </AnalyticsGrid>
              </AnalyticsSection>
            )}
          </TabContent>
        </MainContent>

        <PreviewSidebar>
          <PreviewHeader>
            <PreviewTitle>Preview do Código</PreviewTitle>
            <PreviewDescription>Visualização do card promocional</PreviewDescription>
          </PreviewHeader>
          <CodeSlide />
          <PreviewActions>
            <PreviewButton>
              <Download size={16} />
              Baixar Imagem
            </PreviewButton>
          </PreviewActions>
        </PreviewSidebar>
      </ContentGrid>
    </Container>
  )
}

export default CreateCodeComponent

// Styled Components
const Container = styled.div`
  padding: 24px;
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`

const MainContent = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const TabNavigation = styled.div`
  display: flex;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`

const TabButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: none;
  border: none;
  color: ${(props) => (props.active ? "#35bb6d" : "#6b7280")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${(props) => (props.active ? "#35bb6d" : "transparent")};
  font-family: "Inter", sans-serif;

  &:hover {
    color: ${(props) => (props.active ? "#35bb6d" : "#374151")};
    background-color: rgba(59, 130, 246, 0.05);
  }
`

const TabContent = styled.div`
  padding: 24px;
`

const GeneratorSection = styled.div``

const GeneratorCard = styled.div`
  text-align: center;
`

const GeneratorHeader = styled.div`
  margin-bottom: 32px;
`

const GeneratorIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`

const GeneratorTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1f2937;
  font-family: "Inter", sans-serif;
`

const GeneratorDescription = styled.p`
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
`

const GeneratorButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: 300px;
  margin: 0 auto 24px auto;
  padding: 12px 24px;
  background-color: #35bb6d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Inter", sans-serif;

  &:hover:not(:disabled) {
    background-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const ActiveCodeAlert = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #166534;
  margin-bottom: 24px;
`

const AlertTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`

const AlertDescription = styled.div`
  font-size: 14px;
  line-height: 1.4;
`

const ResultSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const SharingStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #35bb6d;
  font-size: 14px;
  padding: 12px;
  background-color: #dbeafe;
  border-radius: 8px;
`

const CodeResult = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

const CodeResultLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`

const CodeResultValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  font-family: "Monaco", "Menlo", monospace;
  letter-spacing: 1px;
  padding: 8px 16px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
`

const CodeActions = styled.div`
  display: flex;
  gap: 8px;
`

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Inter", sans-serif;

  &:hover {
    background-color: #e5e7eb;
  }
`

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #35bb6d;
  border: 1px solid #35bb6d;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Inter", sans-serif;

  &:hover {
    background-color: #2563eb;
  }
`

const MessageAlert = styled.div<{ success: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background-color: ${(props) => (props.success ? "#dcfce7" : "#fef2f2")};
  border: 1px solid ${(props) => (props.success ? "#bbf7d0" : "#fecaca")};
  border-radius: 8px;
  color: ${(props) => (props.success ? "#166534" : "#dc2626")};
  font-size: 14px;
`

const HistorySection = styled.div``

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const HistoryTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
  font-family: "Inter", sans-serif;
`

const FilterContainer = styled.div``

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
    border-color: #35bb6d;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const CodesTable = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`

const HeaderCell = styled.div`
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: "Inter", sans-serif;
`

const TableBody = styled.div`
  max-height: 400px;
  overflow-y: auto;
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`

const CodeCell = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
`

const CodeDisplay = styled.span`
  font-family: "Monaco", "Menlo", monospace;
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
`

const UsesCell = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2px;
`

const UsesCount = styled.span`
  font-weight: 600;
  color: #10b981;
  font-size: 16px;
`

const UsesLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
`

const StatusCell = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StatusBadge = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => (props.active ? "#dcfce7" : "#fef2f2")};
  color: ${(props) => (props.active ? "#166534" : "#dc2626")};
`

const ValidityCell = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`

const ValidityDate = styled.span`
  font-weight: 500;
  color: #1f2937;
  font-size: 14px;
`

const ValidityTime = styled.span`
  font-size: 12px;
  color: #6b7280;
`

const ActionsCell = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const ActionIcon = styled.button`
  padding: 6px;
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

const EmptyDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-family: "Inter", sans-serif;
`

const AnalyticsSection = styled.div``

const AnalyticsHeader = styled.div`
  margin-bottom: 24px;
`

const AnalyticsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1f2937;
  font-family: "Inter", sans-serif;
`

const AnalyticsDescription = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 14px;
`

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const AnalyticsCard = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
`

const CardTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1f2937;
  font-family: "Inter", sans-serif;
`

const MetricsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const MetricItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MetricLabel = styled.span`
  font-size: 14px;
  color: #6b7280;
`

const MetricValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
`

const RecentCodesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const RecentCodeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
`

const RecentCodeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const RecentCodeText = styled.span`
  font-family: "Monaco", "Menlo", monospace;
  font-size: 12px;
  color: #1f2937;
  font-weight: 600;
`

const RecentCodeDate = styled.span`
  font-size: 11px;
  color: #6b7280;
`

const RecentCodeUses = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
`

const PreviewSidebar = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  height: fit-content;

  @media (max-width: 1200px) {
    order: -1;
  }
`

const PreviewHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;
`

const PreviewTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1f2937;
  font-family: "Inter", sans-serif;
`

const PreviewDescription = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 14px;
`

const PreviewActions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`

const PreviewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Inter", sans-serif;

  &:hover {
    background-color: #e5e7eb;
  }
`

const SlideContainer = styled.div`
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
`

const SlideBackground = styled.div`
  width: 100%;
  height: 100%;
  background-image: url("/web/20241012_173942.jpg"); 
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;

   
`

const SlideContent = styled.div`
  position: absolute;
  bottom: 26%;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
`

 
const SlideCode = styled.div`
  font-size: 15px;
  font-weight: 700;
  font-family: "Inter", monospace;
  
  letter-spacing: 1px;
  
`
 