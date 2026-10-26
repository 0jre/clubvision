"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import {
  Users,
  DollarSign,
  Activity,
  AlertTriangle,
  Search,
  Download,
  Eye,
  MoreHorizontal,
  Shield,
  Trophy,
  Coins,
  Zap,
  Calendar,
  TrendingUp,
  Filter,
  RefreshCw,
  FileText,
  BarChart3,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Crown,
  Target,
  Gamepad2,
} from "lucide-react"
import axios from "axios"

interface Stat {
  count: number;
  _id: string;
}

 

// Interfaces
interface AuditData {
  items: any[]
  stats?: any
  pagination: {
    page: number
    limit: number
    total: number
  }
}

interface SystemHealth {
  totalUsers: number
  totalBattlePassUsers: number
  premiumUsers: number
  bannedUsers: number
  recentTransactions: number
  recentModActions: number
  resourceDistribution: {
    totalBits: number
    totalCoins: number
    totalTokens: number
    avgBits: number
    avgCoins: number
    avgTokens: number
  }
}


 
// Main Component
export function AdminAuditBattlepass() {
  const [activeTab, setActiveTab] = useState("visao-geral")
  const [auditData, setAuditData] = useState<AuditData | null>(null)
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const [filters, setFilters] = useState({
    search: "",
    filter: "all",
    dateFrom: "",
    dateTo: "",
    page: 1,
    limit: 20,
  })

  useEffect(() => {
    loadSystemHealth()
    const interval = setInterval(loadSystemHealth, 30000) // Atualiza a cada 30 segundos
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (activeTab !== "visao-geral") {
      loadAuditData(getApiType(activeTab))
    }
  }, [activeTab, filters])

  const getApiType = (tab: string) => {
    switch (tab) {
      case "transacoes":
        return "transactions"
      case "atividade-battlepass":
        return "battlepass_activity"
      case "comportamento-usuarios":
        return "user_behavior"
      case "analise-receita":
        return "revenue_analysis"
      default:
        return "system_health"
    }
  }

  const loadSystemHealth = async () => {
    if (activeTab !== "visao-geral") return

    setLoading(true)
    try {
      const response = await axios.get("/api/admin/battlepass/comprehensive", {
        params: { type: "system_health" },
      })
      setSystemHealth(response.data.data.systemHealth)
      setLastUpdate(new Date())
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao carregar dados do sistema")
    } finally {
      setLoading(false)
    }
  }

  const loadAuditData = async (type: string) => {
    setLoading(true)
    try {
      const response = await axios.get("/api/admin/battlepass/comprehensive", {
        params: { type, ...filters },
      })
      setAuditData(response.data.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao carregar dados de auditoria")
    } finally {
      setLoading(false)
    }
  }

 const formatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString("pt-BR");
}

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount / 100)
  }

  const formatDate = (date: string | Date) => {
     if (!date) return 'No date';
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (name?: string): string => {
  if (!name) return ''; // Return empty string for undefined/null/empty name
  
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
const getAvatarColor = (id?: string): string => {
  const colors = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  ]
  
  // Return default color if id is undefined or empty
  if (!id) return colors[0];
  
  const index = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}
  
      if(loading) {
      return <div>Carregando...</div>
     }

  const renderVisaoGeral = () => (
    <>
      {systemHealth && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#000000" }}>Métricas do Sistema</h2>
              <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
                Última atualização: {formatDate(lastUpdate)}
              </p>
            </div>
            <Button onClick={loadSystemHealth} disabled={loading}>
              <RefreshCw size={16} />
              Atualizar
            </Button>
          </div>

          <MetricsGrid>
            <MetricCard $highlight>
              <MetricCardHeader>
                <IconWrapper $bgColor="#f0f9ff" $iconColor="#0ea5e9">
                  <Users size={28} color="#0ea5e9" />
                </IconWrapper>
                <MetricBadge $variant="positive">
                  <TrendingUp size={12} />
                  +12%
                </MetricBadge>
              </MetricCardHeader>
              <MetricValue>{formatNumber(systemHealth.totalUsers)}</MetricValue>
              <MetricLabel>Total de Usuários</MetricLabel>
              <MetricSubtext>
                <Clock size={12} />
                Crescimento mensal
              </MetricSubtext>
            </MetricCard>

            <MetricCard>
              <MetricCardHeader>
                <IconWrapper $bgColor="#fef3c7" $iconColor="#d97706">
                  <Crown size={28} color="#d97706" />
                </IconWrapper>
                <MetricBadge $variant="positive">
                  {((systemHealth.premiumUsers / systemHealth.totalUsers) * 100).toFixed(1)}%
                </MetricBadge>
              </MetricCardHeader>
              <MetricValue>{formatNumber(systemHealth.premiumUsers)}</MetricValue>
              <MetricLabel>Usuários Premium</MetricLabel>
              <MetricSubtext>
                <Target size={12} />
                Taxa de conversão
              </MetricSubtext>
            </MetricCard>

            <MetricCard>
              <MetricCardHeader>
                <IconWrapper $bgColor="#ecfdf5" $iconColor="#10b981">
                  <Activity size={28} color="#10b981" />
                </IconWrapper>
                <MetricBadge $variant="positive">
                  <Clock size={12} />
                  24h
                </MetricBadge>
              </MetricCardHeader>
              <MetricValue>{formatNumber(systemHealth.recentTransactions)}</MetricValue>
              <MetricLabel>Transações Recentes</MetricLabel>
              <MetricSubtext>
                <TrendingUp size={12} />
                Últimas 24 horas
              </MetricSubtext>
            </MetricCard>

            <MetricCard>
              <MetricCardHeader>
                <IconWrapper $bgColor={systemHealth.bannedUsers > 0 ? "#fee2e2" : "#ecfdf5"}>
                  <Shield size={28} color={systemHealth.bannedUsers > 0 ? "#dc2626" : "#10b981"} />
                </IconWrapper>
                <MetricBadge $variant={systemHealth.bannedUsers > 0 ? "negative" : "positive"}>
                  {systemHealth.bannedUsers > 0 ? "Alerta" : "Seguro"}
                </MetricBadge>
              </MetricCardHeader>
              <MetricValue>{systemHealth.bannedUsers}</MetricValue>
              <MetricLabel>Usuários Banidos</MetricLabel>
              <MetricSubtext>
                <AlertTriangle size={12} />
                Status de segurança
              </MetricSubtext>
            </MetricCard>

            <MetricCard>
              <MetricCardHeader>
                <IconWrapper $bgColor="#f3e8ff" $iconColor="#8b5cf6">
                  <Coins size={28} color="#8b5cf6" />
                </IconWrapper>
                <MetricBadge $variant="neutral">Economia</MetricBadge>
              </MetricCardHeader>
              <MetricValue>{formatNumber(systemHealth.resourceDistribution?.totalBits || 0)}</MetricValue>
              <MetricLabel>Bits em Circulação</MetricLabel>
              <MetricSubtext>
                <BarChart3 size={12} />
                Economia do jogo
              </MetricSubtext>
            </MetricCard>

            <MetricCard>
              <MetricCardHeader>
                <IconWrapper $bgColor="#fef2f2" $iconColor="#ef4444">
                  <Zap size={28} color="#ef4444" />
                </IconWrapper>
                <MetricBadge $variant="warning">
                  <Clock size={12} />
                  24h
                </MetricBadge>
              </MetricCardHeader>
              <MetricValue>{systemHealth.recentModActions}</MetricValue>
              <MetricLabel>Ações de Moderação</MetricLabel>
              <MetricSubtext>
                <Activity size={12} />
                Últimas 24 horas
              </MetricSubtext>
            </MetricCard>
          </MetricsGrid>

          <StatsGrid>
            <StatItem>
              <div className="value">{formatNumber(systemHealth.resourceDistribution?.totalCoins || 0)}</div>
              <div className="label">Moedas Totais</div>
            </StatItem>
            <StatItem>
              <div className="value">{formatNumber(systemHealth.resourceDistribution?.totalTokens || 0)}</div>
              <div className="label">Tokens Totais</div>
            </StatItem>
            <StatItem>
              <div className="value">{formatNumber(systemHealth.resourceDistribution?.avgBits || 0)}</div>
              <div className="label">Média de Bits</div>
            </StatItem>
            <StatItem>
              <div className="value">{formatNumber(systemHealth.resourceDistribution?.avgCoins || 0)}</div>
              <div className="label">Média de Moedas</div>
            </StatItem>
          </StatsGrid>
        </>
      )}
    </>
  )

  const renderTransacoes = () => (
    <>
      <FiltersCard>
        <FiltersHeader>
          <FiltersTitle>
            <Filter size={20} />
            Filtros de Transações
          </FiltersTitle>
        </FiltersHeader>
        <FiltersContainer>
          <SearchContainer>
            <SearchLabel>Buscar</SearchLabel>
            <SearchIcon size={18} />
            <SearchInput
              placeholder="Buscar por ID do usuário ou tipo de transação..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </SearchContainer>

          <SelectContainer>
            <SelectLabel>Tipo</SelectLabel>
            <Select value={filters.filter} onChange={(e) => setFilters({ ...filters, filter: e.target.value })}>
              <option value="all">Todas as Transações</option>
              <option value="purchase">Compras</option>
              <option value="battlepass">Battle Pass</option>
              <option value="admin">Ações Admin</option>
              <option value="reward">Recompensas</option>
            </Select>
          </SelectContainer>

          <SelectContainer>
            <SelectLabel>Data Inicial</SelectLabel>
            <DateInput
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </SelectContainer>

          <SelectContainer>
            <SelectLabel>Data Final</SelectLabel>
            <DateInput
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </SelectContainer>

          <Button $variant="primary">
            <Download size={16} />
            Exportar
          </Button>

          <Button onClick={() => loadAuditData("transactions")}>
            <RefreshCw size={16} />
            Atualizar
          </Button>
        </FiltersContainer>
      </FiltersCard>

       {auditData?.stats && Array.isArray(auditData.stats) && (
        <StatsGrid>
          {auditData.stats.slice(0, 6).map((stat: Stat, index: number) => (
            <StatItem key={index}>
              <div className="value">{stat.count}</div>
              <div className="label">{stat._id}</div>
            </StatItem>
          ))}
        </StatsGrid>
      )}

    {auditData?.items?.map((item: any, index: number) => (
  <DataCard 
    key={index} 
    $priority={item.transaction?.amount && item.transaction?.amount > 10000 ? "high" : "low"}
  >
          <DataHeader>
            <DataInfo>
              <UserAvatar $color={getAvatarColor(item.userId)}>{getInitials(item.userId)}</UserAvatar>
              <DataDetails>
                <DataTitle>
              {item.transaction?.action 
              ? item.transaction?.action.replace(/_/g, " ").toUpperCase() 
              : "NO ACTION"} -{" "}
            {formatCurrency(item.transaction?.amount || 0)}
                </DataTitle>
                <DataMeta>
                  Usuário: {item.userId} • {formatDate(item.transaction?.timestamp)}
                  <br />
                  Status: {item.transaction?.status || "concluída"} • Moeda: {item.transaction?.currency || "bits"}
                </DataMeta>
              </DataDetails>
            </DataInfo>
            <StatusBadges>
              <StatusBadge $status={item.transaction?.status || "success"}>
                {item.transaction?.status === "succeeded" ? (
                  <CheckCircle size={12} />
                ) : item.transaction?.status === "failed" ? (
                  <XCircle size={12} />
                ) : (
                  <Clock size={12} />
                )}
                {item.transaction?.status || "Concluída"}
              </StatusBadge>
              {item.transaction?.amount > 10000 && (
                <StatusBadge $status="warning">
                  <AlertTriangle size={12} />
                  Alto Valor
                </StatusBadge>
              )}
            </StatusBadges>
          </DataHeader>

          <DataContent>
            <strong>Detalhes da Transação:</strong>
            <br />
            Tipo: {item.transaction?.action} • Valor: {item.transaction?.amount || 0}
            <br />
            {item.transaction?.reason && `Motivo: ${item.transaction?.reason}`}
            <br />
            <strong>Recursos do Usuário:</strong> {formatNumber(item.userInfo?.bits || 0)} bits,{" "}
            {formatNumber(item.userInfo?.coins || 0)} moedas, {item.userInfo?.tokens || 0} tokens
          </DataContent>

          <DataMetrics>
            <MetricsRow>
              <MetricItem>
                <Coins size={14} color="#8b5cf6" />
                <span>Bits: {formatNumber(item.userInfo?.bits || 0)}</span>
              </MetricItem>
              <MetricItem>
                <DollarSign size={14} color="#10b981" />
                <span>Moedas: {formatNumber(item.userInfo?.coins || 0)}</span>
              </MetricItem>
              <MetricItem>
                <Trophy size={14} color="#f59e0b" />
                <span>Tokens: {item.userInfo?.tokens || 0}</span>
              </MetricItem>
              <MetricItem>
                <Calendar size={14} color="#6b7280" />
                <span>{formatDate(item.transaction?.timestamp)}</span>
              </MetricItem>
            </MetricsRow>

            <ActionButtons>
              <IconButton title="Ver Detalhes">
                <Eye size={14} />
              </IconButton>
              <IconButton $variant="warning" title="Revisar Transação">
                <AlertTriangle size={14} />
              </IconButton>
              <IconButton title="Mais Ações">
                <MoreHorizontal size={14} />
              </IconButton>
            </ActionButtons>
          </DataMetrics>
        </DataCard>
      ))}
    </>
  )

  const renderAtividadeBattlePass = () => (
    <>
      <FiltersCard>
        <FiltersHeader>
          <FiltersTitle>
            <Gamepad2 size={20} />
            Filtros de Atividade Battle Pass
          </FiltersTitle>
        </FiltersHeader>
        <FiltersContainer>
          <SearchContainer>
            <SearchLabel>Buscar Usuário</SearchLabel>
            <SearchIcon size={18} />
            <SearchInput
              placeholder="Buscar por ID do usuário..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </SearchContainer>

          <SelectContainer>
            <SelectLabel>Filtro</SelectLabel>
            <Select value={filters.filter} onChange={(e) => setFilters({ ...filters, filter: e.target.value })}>
              <option value="all">Todos os Usuários</option>
              <option value="premium">Apenas Premium</option>
              <option value="high_tier">Tier Alto (50+)</option>
              <option value="inactive">Inativos</option>
            </Select>
          </SelectContainer>

          <Button $variant="primary">
            <Download size={16} />
            Exportar Atividade
          </Button>

          <Button onClick={() => loadAuditData("battlepass_activity")}>
            <RefreshCw size={16} />
            Atualizar
          </Button>
        </FiltersContainer>
      </FiltersCard>

      {auditData?.stats?.tierDistribution && (
        <StatsGrid>
          {auditData.stats.tierDistribution.map((tier: any, index: number) => (
            <StatItem key={index}>
              <div className="value">{tier.count}</div>
              <div className="label">Tier {tier._id}</div>
            </StatItem>
          ))}
        </StatsGrid>
      )}

      {auditData?.items?.map((item: any, index: number) => (
        <DataCard key={index} $priority={item.currentTier > 75 ? "high" : item.currentTier > 50 ? "medium" : "low"}>
          <DataHeader>
            <DataInfo>
              <UserAvatar $color={getAvatarColor(item.userId)}>
                {item.isPremium ? <Crown size={20} /> : getInitials(item.userInfo?.[0]?.username || item.userId)}
              </UserAvatar>
              <DataDetails>
                <DataTitle>
                  {item.userInfo?.[0]?.username || "Usuário Desconhecido"} - Tier {item.currentTier}
                </DataTitle>
                <DataMeta>
                  ID: {item.userId} • Última Atividade: {formatDate(item.lastActivity)}
                  <br />
                  Temporada: {auditData.stats?.activeSeason?.name || "Temporada Atual"}
                </DataMeta>
              </DataDetails>
            </DataInfo>
            <StatusBadges>
              <StatusBadge $status={item.isPremium ? "premium" : "active"}>
                {item.isPremium ? (
                  <>
                    <Crown size={12} />
                    Premium
                  </>
                ) : (
                  <>
                    <Users size={12} />
                    Gratuito
                  </>
                )}
              </StatusBadge>
              {item.currentTier > 75 && (
                <StatusBadge $status="success">
                  <Star size={12} />
                  Alto Nível
                </StatusBadge>
              )}
            </StatusBadges>
          </DataHeader>

          <DataContent>
            <strong>Progresso do Battle Pass:</strong>
            <br />
            Tier Atual: {item.currentTier} / 100 • XP Total: {formatNumber(item.totalXP)}
            <br />
            Recompensas Resgatadas: {item.claimedTiers?.length || 0} gratuitas, {item.claimedPremiumTiers?.length || 0}{" "}
            premium
            <br />
            <strong>Recursos:</strong> {formatNumber(item.userResources?.[0]?.bits || 0)} bits,{" "}
            {formatNumber(item.userResources?.[0]?.coins || 0)} moedas
          </DataContent>

          <DataMetrics>
            <MetricsRow>
              <MetricItem>
                <Trophy size={14} color="#f59e0b" />
                <span>Tier: {item.currentTier}/100</span>
              </MetricItem>
              <MetricItem>
                <Zap size={14} color="#8b5cf6" />
                <span>XP: {formatNumber(item.totalXP)}</span>
              </MetricItem>
              <MetricItem>
                <Coins size={14} color="#10b981" />
                <span>Bits: {formatNumber(item.userResources?.[0]?.bits || 0)}</span>
              </MetricItem>
              <MetricItem>
                <Star size={14} color="#f59e0b" />
                <span>Recompensas: {(item.claimedTiers?.length || 0) + (item.claimedPremiumTiers?.length || 0)}</span>
              </MetricItem>
            </MetricsRow>

            <ActionButtons>
              <IconButton title="Ver Perfil Completo">
                <Eye size={14} />
              </IconButton>
              <IconButton $variant="success" title="Adicionar XP">
                <Zap size={14} />
              </IconButton>
              <IconButton title="Mais Ações">
                <MoreHorizontal size={14} />
              </IconButton>
            </ActionButtons>
          </DataMetrics>
        </DataCard>
      ))}
    </>
  )

  const renderComportamentoUsuarios = () => (
    <>
      <FiltersCard>
        <FiltersHeader>
          <FiltersTitle>
            <Users size={20} />
            Filtros de Comportamento de Usuários
          </FiltersTitle>
        </FiltersHeader>
        <FiltersContainer>
          <SearchContainer>
            <SearchLabel>Buscar</SearchLabel>
            <SearchIcon size={18} />
            <SearchInput
              placeholder="Buscar por nome de usuário ou ID..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </SearchContainer>

          <SelectContainer>
            <SelectLabel>Tipo de Usuário</SelectLabel>
            <Select value={filters.filter} onChange={(e) => setFilters({ ...filters, filter: e.target.value })}>
              <option value="all">Todos os Usuários</option>
              <option value="ADMIN">Administradores</option>
              <option value="PREMIUM">Premium</option>
              <option value="USER">Usuários Regulares</option>
            </Select>
          </SelectContainer>

          <Button $variant="primary">
            <Download size={16} />
            Exportar Usuários
          </Button>

          <Button onClick={() => loadAuditData("user_behavior")}>
            <RefreshCw size={16} />
            Atualizar
          </Button>
        </FiltersContainer>
      </FiltersCard>

      {auditData?.stats && Array.isArray(auditData.stats) && (
        <StatsGrid>
          {auditData.stats.map((stat: any, index: number) => (
            <StatItem key={index}>
              <div className="value">{stat.count}</div>
              <div className="label">{stat._id}</div>
            </StatItem>
          ))}
        </StatsGrid>
      )}

      {auditData?.items?.map((item: any, index: number) => (
        <DataCard key={index} $priority={item.banned ? "high" : item.moderationHistory?.length > 5 ? "medium" : "low"}>
          <DataHeader>
            <DataInfo>
              <UserAvatar $color={getAvatarColor(item.id)}>
                {item.type === "ADMIN" ? (
                  <Shield size={20} />
                ) : item.type === "PREMIUM" ? (
                  <Crown size={20} />
                ) : (
                  getInitials(item.username || item.id)
                )}
              </UserAvatar>
              <DataDetails>
                <DataTitle>
                  {item.username || "Usuário Desconhecido"} ({item.type || "USER"})
                </DataTitle>
                <DataMeta>
                  ID: {item.id} • Histórico de Moderação: {item.moderationHistory?.length || 0} ações
                  <br />
                  Avisos: {item.resources?.[0]?.warningCount || 0} • Transações:{" "}
                  {item.resources?.[0]?.transactions?.length || 0}
                </DataMeta>
              </DataDetails>
            </DataInfo>
            <StatusBadges>
              <StatusBadge $status={item.banned ? "error" : "success"}>
                {item.banned ? (
                  <>
                    <XCircle size={12} />
                    Banido
                  </>
                ) : (
                  <>
                    <CheckCircle size={12} />
                    Ativo
                  </>
                )}
              </StatusBadge>
              {item.type === "ADMIN" && (
                <StatusBadge $status="error">
                  <Shield size={12} />
                  Admin
                </StatusBadge>
              )}
              {item.battlepass?.[0]?.isPremium && (
                <StatusBadge $status="premium">
                  <Crown size={12} />
                  Premium
                </StatusBadge>
              )}
            </StatusBadges>
          </DataHeader>

          <DataContent>
            <strong>Resumo do Usuário:</strong>
            <br />
            Recursos: {formatNumber(item.resources?.[0]?.bits || 0)} bits,{" "}
            {formatNumber(item.resources?.[0]?.coins || 0)} moedas, {item.resources?.[0]?.token || 0} tokens
            <br />
            Battle Pass: Tier {item.battlepass?.[0]?.currentTier || 0} {item.battlepass?.[0]?.isPremium && "(Premium)"}
            <br />
            Reforms Ativas:{" "}
            {Object.keys(item.reforms?.[0] || {})
              .filter((key) => item.reforms?.[0]?.[key] === true)
              .join(", ") || "Nenhuma"}
            <br />
            {item.resources?.[0]?.warningCount > 0 && (
              <>
                <strong style={{ color: "#dc2626" }}>Avisos: {item.resources?.[0]?.warningCount}</strong>
                <br />
              </>
            )}
          </DataContent>

          <DataMetrics>
            <MetricsRow>
              <MetricItem>
                <Users size={14} color="#6b7280" />
                <span>Tipo: {item.type}</span>
              </MetricItem>
              <MetricItem>
                <Shield size={14} color="#dc2626" />
                <span>Mod: {item.moderationHistory?.length || 0}</span>
              </MetricItem>
              <MetricItem>
                <Activity size={14} color="#10b981" />
                <span>Trans: {item.resources?.[0]?.transactions?.length || 0}</span>
              </MetricItem>
              <MetricItem>
                <Trophy size={14} color="#f59e0b" />
                <span>Tier: {item.battlepass?.[0]?.currentTier || 0}</span>
              </MetricItem>
              {item.resources?.[0]?.warningCount > 0 && (
                <MetricItem>
                  <AlertTriangle size={14} color="#dc2626" />
                  <span>Avisos: {item.resources?.[0]?.warningCount}</span>
                </MetricItem>
              )}
            </MetricsRow>

            <ActionButtons>
              <IconButton title="Ver Perfil Completo">
                <Eye size={14} />
              </IconButton>
              <IconButton $variant="warning" title="Revisar Usuário">
                <AlertTriangle size={14} />
              </IconButton>
              <IconButton $variant="success" title="Adicionar Recursos">
                <Coins size={14} />
              </IconButton>
              <IconButton title="Mais Ações">
                <MoreHorizontal size={14} />
              </IconButton>
            </ActionButtons>
          </DataMetrics>
        </DataCard>
      ))}
    </>
  )

  if (loading && !auditData && !systemHealth) {
    return (
      <Container>
        <LoadingState>
          <LoadingSpinner />
          <p>Carregando dados de auditoria...</p>
        </LoadingState>
      </Container>
    )
  }

  if (error && !systemHealth && !auditData) {
    return (
      <Container>
        <ErrorState>
          <AlertCircle size={48} style={{ marginBottom: "16px" }} />
          <p>Erro ao carregar dados: {error}</p>
          <Button $variant="primary" style={{ marginTop: "16px" }} onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Tentar Novamente
          </Button>
        </ErrorState>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>
          <BarChart3 size={32} />
          Painel de Auditoria do Sistema
        </Title>
        <Subtitle>
          Monitoramento abrangente e análise detalhada do desempenho do sistema Battle Pass e comportamento dos usuários
        </Subtitle>
        <QuickActions>
          <Button
            $variant="primary"
            onClick={() => (activeTab === "visao-geral" ? loadSystemHealth() : loadAuditData(getApiType(activeTab)))}
          >
            <RefreshCw size={16} />
            Atualizar Dados
          </Button>
         
        </QuickActions>
      </Header>

      <TabsContainer>
        <Tab $active={activeTab === "visao-geral"} onClick={() => setActiveTab("visao-geral")}>
          <BarChart3 size={16} />
          Visão Geral do Sistema
        </Tab>
        <Tab $active={activeTab === "transacoes"} onClick={() => setActiveTab("transacoes")}>
          <DollarSign size={16} />
          Transações
        </Tab>
        <Tab $active={activeTab === "atividade-battlepass"} onClick={() => setActiveTab("atividade-battlepass")}>
          <Trophy size={16} />
          Atividade Battle Pass
        </Tab>
        <Tab $active={activeTab === "comportamento-usuarios"} onClick={() => setActiveTab("comportamento-usuarios")}>
          <Users size={16} />
          Comportamento de Usuários
        </Tab>
        <Tab $active={activeTab === "analise-receita"} onClick={() => setActiveTab("analise-receita")}>
          <TrendingUp size={16} />
          Análise de Receita
        </Tab>
      </TabsContainer>

      {loading && (
        <div style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
          <LoadingSpinner />
          Carregando...
        </div>
      )}

      {activeTab === "visao-geral" && renderVisaoGeral()}
      {activeTab === "transacoes" && renderTransacoes()}
      {activeTab === "atividade-battlepass" && renderAtividadeBattlePass()}
      {activeTab === "comportamento-usuarios" && renderComportamentoUsuarios()}

      {auditData && auditData.items.length === 0 && (
        <EmptyState>
          <FileText size={48} style={{ marginBottom: "16px", color: "#d1d5db" }} />
          <p>Nenhum dado encontrado para os filtros selecionados.</p>
          <Button style={{ marginTop: "16px" }} onClick={() => setFilters({ ...filters, search: "", filter: "all" })}>
            Limpar Filtros
          </Button>
        </EmptyState>
      )}

      {auditData && auditData.items.length > 0 && (
        <Pagination>
          <PaginationInfo>
            Mostrando {auditData.items.length} de {auditData.pagination.total} itens
            {filters.search && ` • Filtrado por: "${filters.search}"`}
          </PaginationInfo>
          <PaginationButtons>
            <Button disabled={filters.page === 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>
              Anterior
            </Button>
            <span style={{ padding: "0 16px", color: "#6b7280", fontSize: "14px" }}>
              Página {filters.page} de {Math.ceil(auditData.pagination.total / filters.limit)}
            </span>
            <Button
              disabled={filters.page * filters.limit >= auditData.pagination.total}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            >
              Próxima
            </Button>
          </PaginationButtons>
        </Pagination>
      )}
    </Container>
  )
}









// Styled Components (mantendo o design limpo preto e branco)
const Container = styled.div`
  padding: 32px;
  background-color: #ffffff;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`

const Header = styled.div`
  margin-bottom: 32px;
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`

const Subtitle = styled.p`
  color: #666666;
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
`

const QuickActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`

const MetricCard = styled.div<{ $highlight?: boolean }>`
  background-color: #ffffff;
  border: 1px solid ${(props) => (props.$highlight ? "#000000" : "#e5e5e5")};
  border-radius: 16px;
  padding: 28px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #000000;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) => (props.$highlight ? "linear-gradient(90deg, #000000, #333333)" : "transparent")};
  }
`

const MetricCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`

const IconWrapper = styled.div<{ $bgColor?: string; $iconColor?: string }>`
  width: 56px;
  height: 56px;
  background-color: ${(props) => props.$bgColor || "#f8f9fa"};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0));
  }
`

const MetricBadge = styled.div<{ $variant: "positive" | "negative" | "neutral" | "warning" }>`
  background-color: ${(props) => {
    switch (props.$variant) {
      case "positive":
        return "#000000"
      case "negative":
        return "#dc2626"
      case "warning":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }};
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`

const MetricValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
  color: #000000;
  line-height: 1;
`

const MetricLabel = styled.div`
  font-size: 14px;
  color: #666666;
  font-weight: 500;
  margin-bottom: 8px;
`

const MetricSubtext = styled.div`
  font-size: 12px;
  color: #999999;
  display: flex;
  align-items: center;
  gap: 4px;
`

const FiltersCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`

const FiltersHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 20px;
`

const FiltersTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto auto;
  gap: 16px;
  align-items: end;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`

const SearchContainer = styled.div`
  position: relative;
`

const SearchLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 14px 14px 44px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  background-color: #ffffff;

  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`

const SearchIcon = styled(Search)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`

const SelectContainer = styled.div``

const SelectLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  font-size: 14px;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }
`

const DateInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  font-size: 14px;
  background-color: #ffffff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }
`

const Button = styled.button<{ $variant?: "primary" | "secondary" | "danger" | "success" }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  border: 1px solid;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  ${(props) => {
    switch (props.$variant) {
      case "primary":
        return `
          background-color: #000000;
          color: #ffffff;
          border-color: #000000;
          &:hover { 
            background-color: #1f2937; 
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        `
      case "success":
        return `
          background-color: #10b981;
          color: #ffffff;
          border-color: #10b981;
          &:hover { 
            background-color: #059669; 
            transform: translateY(-1px);
          }
        `
      case "danger":
        return `
          background-color: #ffffff;
          color: #dc2626;
          border-color: #dc2626;
          &:hover { 
            background-color: #dc2626; 
            color: #ffffff;
            transform: translateY(-1px);
          }
        `
      default:
        return `
          background-color: #ffffff;
          color: #374151;
          border-color: #e5e5e5;
          &:hover { 
            border-color: #000000;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
        `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`

const TabsContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 28px;
  border-bottom: 1px solid #e5e5e5;
  overflow-x: auto;
  padding-bottom: 0;
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 16px 24px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;

  ${(props) =>
    props.$active
      ? `
    color: #000000;
    border-bottom-color: #000000;
    background-color: rgba(0, 0, 0, 0.02);
  `
      : `
    color: #6b7280;
    &:hover {
      color: #000000;
      background-color: rgba(0, 0, 0, 0.02);
    }
  `}
`

const DataCard = styled.div<{ $priority?: "high" | "medium" | "low" }>`
  border: 1px solid ${(props) => {
    switch (props.$priority) {
      case "high":
        return "#dc2626"
      case "medium":
        return "#f59e0b"
      default:
        return "#e5e5e5"
    }
  }};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  background-color: #ffffff;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #000000;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  ${(props) =>
    props.$priority === "high" &&
    `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #dc2626, #ef4444);
      border-radius: 16px 16px 0 0;
    }
  `}
`

const DataHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`

const DataInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
`

const UserAvatar = styled.div<{ $color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => props.$color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
`

const DataDetails = styled.div`
  flex: 1;
`

const DataTitle = styled.div`
  font-weight: 600;
  color: #000000;
  font-size: 16px;
  margin-bottom: 6px;
  line-height: 1.3;
`

const DataMeta = styled.div`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
`

const StatusBadges = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
`

const StatusBadge = styled.div<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;

  ${(props) => {
    switch (props.$status) {
      case "success":
      case "completed":
      case "active":
        return `background-color: #000000; color: #ffffff;`
      case "warning":
      case "under_review":
      case "pending":
        return `background-color: #f59e0b; color: #ffffff;`
      case "error":
      case "failed":
      case "banned":
        return `background-color: #dc2626; color: #ffffff;`
      case "premium":
        return `background-color: #8b5cf6; color: #ffffff;`
      default:
        return `background-color: #f3f4f6; color: #374151; border: 1px solid #e5e7eb;`
    }
  }}
`

const DataContent = styled.div`
  font-size: 14px;
  color: #374151;
  margin-bottom: 20px;
  line-height: 1.6;
  
  strong {
    color: #000000;
    font-weight: 600;
  }
`

const DataMetrics = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`

const MetricsRow = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-radius: 8px;

  span {
    font-size: 13px;
    color: #374151;
    font-weight: 500;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`

const IconButton = styled.button<{ $variant?: "primary" | "warning" | "danger" | "success" }>`
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => {
    switch (props.$variant) {
      case "warning":
        return `background-color: #fef3c7; color: #d97706; &:hover { background-color: #fde68a; }`
      case "danger":
        return `background-color: #fee2e2; color: #dc2626; &:hover { background-color: #fecaca; }`
      case "success":
        return `background-color: #d1fae5; color: #059669; &:hover { background-color: #a7f3d0; }`
      default:
        return `background-color: #f3f4f6; color: #374151; &:hover { background-color: #e5e7eb; }`
    }
  }}
`

const LoadingState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const ErrorState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #dc2626;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
`

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 24px;
  background-color: #f9fafb;
  border-radius: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
`

const PaginationInfo = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`

const PaginationButtons = styled.div`
  display: flex;
  gap: 12px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 20px 0;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 12px;
`

const StatItem = styled.div`
  text-align: center;
  
  .value {
    font-size: 24px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 4px;
  }
  
  .label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
  }
`