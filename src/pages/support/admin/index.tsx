import React, { useState, useEffect, useRef, ReactNode } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useRouter } from 'next/router';
import { 
  ArrowLeft, 
  RefreshCw, 
  Info, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  ImageIcon, 
  FileText, 
  LinkIcon, 
  Monitor, 
  Smartphone, 
  Globe, 
  Send, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Hash,
  Tag,
  Calendar,
  MessageSquare,
  Eye,
  MoreVertical,
  Filter,
  Search,
  Plus,
  ChevronRight,
  ChevronLeft,
  X,
  User,
  Headphones,
  MessageCircle,
  Zap,
  TrendingUp,
  Users,
  Clock3,
  Star,
  Shield,
  Bot,
  Paperclip,
  Smile,
  Phone,
  Video,
  Settings,
  Archive,
  Flag,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Copy,
  Download,
  Share2
} from 'lucide-react';
import { User as UserType } from "@/types/user/types";
import { withSession } from "@/lib/session";
import { GetServerSideProps } from "next";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { NextIronRequest } from "@/lib/session";
import { ModLog, getModLogs } from "@/types/discord/modlog";
import { TheNoVisionRoute } from "@/lib/session/redirects";
import { getPermission, Permission } from '@/types/discord/permission';
import ROUTENVX from '@/routes/routes';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import router from 'next/router';
import LoadingPageView from '@/resources/loading/market.loading';
import Isecurity_wallet from '@/wallet/security/x/request';

// Animações
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const typing = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(65, 180, 94, 0.5); }
  50% { box-shadow: 0 0 20px rgba(65, 180, 94, 0.8), 0 0 30px rgba(65, 180, 94, 0.6); }
`;

// Interfaces
interface Props {
  user: UserType | null;
  Permissions: Permission[];
  logs: ModLog[];
}


interface Activity {
  type: string;
  description: string;
  response?: string;
  createdAt: string;
  userId: string;
  userName: string;
  isSupport: boolean;
  supportType?: string;
  metadata?: any;
  attachments?: string[];
  reactions?: { emoji: string; count: number; users: string[] }[];
}

interface Ticket {
  _id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userDiscriminator?: string;
  userAvatar?: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  activities: Activity[];
  assignedTo?: string;
  assignedToName?: string;
  assignedToAvatar?: string;
  tags?: string[];
  satisfaction?: number;
  estimatedResolution?: string;
  deviceInfo?: string;
  browserInfo?: string;
  errorMessage?: string;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  userAgent?: string;
  screenResolution?: string;
  operatingSystem?: string;
  additionalInfo?: string;
  attachments?: string[];
  isUrgent?: boolean;
  lastActivity?: string;
  responseTime?: number;
  resolutionTime?: number;
}

interface SupportAgent {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  activeTickets: number;
  totalResolved: number;
  avgResponseTime: number;
  satisfaction: number;
  specialties: string[];
}

 
// Componente de Detalhes do Ticket (CardInformations)
const CardInformations: React.FC<{ ticket: Ticket; onClose: () => void }> = ({ ticket, onClose }) => {
  return (
    <InfoCardContainer show={true}>
      <InfoCardHeader>
        <InfoCardTitle>Detalhes do Ticket</InfoCardTitle>
        <InfoCardCloseButton onClick={onClose}>
          <X size={20} />
        </InfoCardCloseButton>
      </InfoCardHeader>

      <InfoCardSection>
        <InfoCardSectionTitle>
          <Info size={16} />
          Informações Gerais
        </InfoCardSectionTitle>
        <InfoCardItem>
          <InfoCardLabel>ID do Ticket:</InfoCardLabel>
          <InfoCardValue>{ticket.ticketId}</InfoCardValue>
        </InfoCardItem>
        <InfoCardItem>
          <InfoCardLabel>Assunto:</InfoCardLabel>
          <InfoCardValue>{ticket.subject}</InfoCardValue>
        </InfoCardItem>
        <InfoCardItem>
          <InfoCardLabel>Descrição:</InfoCardLabel>
          <InfoCardValue>{ticket.description}</InfoCardValue>
        </InfoCardItem>
        <InfoCardItem>
          <InfoCardLabel>Categoria:</InfoCardLabel>
          <InfoCardValue>{categories[ticket.category as keyof typeof categories] || 'Outros'}</InfoCardValue>
        </InfoCardItem>
        <InfoCardItem>
          <InfoCardLabel>Prioridade:</InfoCardLabel>
          <InfoCardValue>{ticket.priority}</InfoCardValue>
        </InfoCardItem>
        <InfoCardItem>
          <InfoCardLabel>Status:</InfoCardLabel>
          <InfoCardValue>{ticket.status}</InfoCardValue>
        </InfoCardItem>
        <InfoCardItem>
          <InfoCardLabel>Criado em:</InfoCardLabel>
          <InfoCardValue>{format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</InfoCardValue>
        </InfoCardItem>
        <InfoCardItem>
          <InfoCardLabel>Atualizado em:</InfoCardLabel>
          <InfoCardValue>{format(new Date(ticket.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</InfoCardValue>
        </InfoCardItem>
      </InfoCardSection>

      <InfoCardSection>
        <InfoCardSectionTitle>
          <User size={16} />
          Informações do Usuário
        </InfoCardSectionTitle>
        <InfoCardItem>
          <InfoCardLabel>ID do Usuário:</InfoCardLabel>
          <InfoCardValue>{ticket.userId}</InfoCardValue>
        </InfoCardItem>
        <InfoCardItem>
          <InfoCardLabel>Nome de Usuário:</InfoCardLabel>
          <InfoCardValue>{ticket.userName}</InfoCardValue>
        </InfoCardItem>
        {ticket.deviceInfo && (
          <InfoCardItem>
            <InfoCardLabel>Email (Dispositivo):</InfoCardLabel>
            <InfoCardValue>{ticket.deviceInfo}</InfoCardValue>
          </InfoCardItem>
        )}
      </InfoCardSection>

      {/* Informações técnicas e adicionais */}
      {(ticket.browserInfo || ticket.userAgent || ticket.screenResolution || ticket.operatingSystem || ticket.additionalInfo || ticket.errorMessage || ticket.stepsToReproduce || ticket.expectedBehavior || ticket.actualBehavior) && (
        <InfoCardSection>
          <InfoCardSectionTitle>
            <Monitor size={16} />
            Dados Técnicos e Adicionais
          </InfoCardSectionTitle>
          {ticket.browserInfo && (
            <InfoCardItem>
              <InfoCardLabel>Info do Navegador:</InfoCardLabel>
              <InfoCardValue>{ticket.browserInfo}</InfoCardValue>
            </InfoCardItem>
          )}
          {ticket.userAgent && (
            <InfoCardItem>
              <InfoCardLabel>User Agent:</InfoCardLabel>
              <InfoCardValue>{ticket.userAgent}</InfoCardValue>
            </InfoCardItem>
          )}
          {ticket.screenResolution && (
            <InfoCardItem>
              <InfoCardLabel>Resolução da Tela:</InfoCardLabel>
              <InfoCardValue>{ticket.screenResolution}</InfoCardValue>
            </InfoCardItem>
          )}
          {ticket.operatingSystem && (
            <InfoCardItem>
              <InfoCardLabel>Sistema Operacional:</InfoCardLabel>
              <InfoCardValue>{ticket.operatingSystem}</InfoCardValue>
            </InfoCardItem>
          )}
          {ticket.errorMessage && (
            <InfoCardItem>
              <InfoCardLabel>Mensagem de Erro:</InfoCardLabel>
              <InfoCardValue>{ticket.errorMessage}</InfoCardValue>
            </InfoCardItem>
          )}
          {ticket.stepsToReproduce && (
            <InfoCardItem>
              <InfoCardLabel>Passos para Reproduzir:</InfoCardLabel>
              <InfoCardValue>{ticket.stepsToReproduce}</InfoCardValue>
            </InfoCardItem>
          )}
          {ticket.expectedBehavior && (
            <InfoCardItem>
              <InfoCardLabel>Comportamento Esperado:</InfoCardLabel>
              <InfoCardValue>{ticket.expectedBehavior}</InfoCardValue>
            </InfoCardItem>
          )}
          {ticket.actualBehavior && (
            <InfoCardItem>
              <InfoCardLabel>Comportamento Atual:</InfoCardLabel>
              <InfoCardValue>{ticket.actualBehavior}</InfoCardValue>
            </InfoCardItem>
          )}
          {ticket.additionalInfo && (
            <InfoCardItem>
              <InfoCardLabel>Informações Adicionais:</InfoCardLabel>
              <InfoCardValue>{ticket.additionalInfo}</InfoCardValue>
            </InfoCardItem>
          )}
        </InfoCardSection>
      )}

      {/* Informações de Atribuição */}
      {(ticket.assignedTo || ticket.assignedToName) && (
        <InfoCardSection>
          <InfoCardSectionTitle>
            <Shield size={16} />
            Atribuição
          </InfoCardSectionTitle>
          {ticket.assignedToName && (
            <InfoCardItem>
              <InfoCardLabel>Atribuído a:</InfoCardLabel>
              <InfoCardValue>{ticket.assignedToName}</InfoCardValue>
            </InfoCardItem>
          )}
          {ticket.assignedTo && (
            <InfoCardItem>
              <InfoCardLabel>ID do Suporte:</InfoCardLabel>
              <InfoCardValue>{ticket.assignedTo}</InfoCardValue>
            </InfoCardItem>
          )}
        </InfoCardSection>
      )}
    </InfoCardContainer>
  );
};

// Main Component
export default function SupportAdminPage({ user }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfoCard, setShowInfoCard] = useState(false); // Novo estado para controlar a visibilidade do CardInformations
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    resolved: 0,
    avgResponseTime: 0
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Efeitos
  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000); // Atualiza a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, searchQuery, activeFilter]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.activities, showInfoCard]); // Adicionado showInfoCard como dependência

  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
      messageInputRef.current.style.height = messageInputRef.current.scrollHeight + 'px';
    }
  }, [messageText]);

  // Funções
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTickets = async () => {
    if (!loading && tickets.length > 0) return; // Não mostra carregando para atualizações
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/support/admin/tickets/x');
      
      // A verificação de permissão principal acontece no getServerSideProps.
      // Esta verificação no cliente é um fallback ou para chamadas API subsequentes.
      if (response.status === 403) {
        router.push(ROUTENVX.support);
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setTickets(data.tickets);
        calculateStats(data.tickets);
      } else {
        setError('Ocorreu um erro ao carregar os tickets.');
      }
    } catch (error: any) {
      console.error('Erro ao buscar tickets:', error);
      setError(`Erro de conexão: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ticketsList: Ticket[]) => {
    const stats = {
      total: ticketsList.length,
      pending: ticketsList.filter(t => t.status === 'PENDENTE').length,
      active: ticketsList.filter(t => ['ACEITO', 'RESPONDIDO', 'AGUARDANDO'].includes(t.status)).length,
      resolved: ticketsList.filter(t => ['FECHADO', 'CANCELADO'].includes(t.status)).length,
      avgResponseTime: Math.round(ticketsList.reduce((acc, t) => acc + (t.responseTime || 0), 0) / ticketsList.length) || 0
    };
    setStats(stats);
  };

  const applyFilters = () => {
    let filtered = [...tickets];

    // Aplica filtro de busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.subject.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        ticket.userName.toLowerCase().includes(query) ||
        ticket.ticketId.toLowerCase().includes(query)
      );
    }

    // Aplica filtro de status
    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'pending':
          filtered = filtered.filter(t => t.status === 'PENDENTE');
          break;
        case 'active':
          filtered = filtered.filter(t => ['ACEITO', 'RESPONDIDO', 'AGUARDANDO'].includes(t.status));
          break;
        case 'resolved':
          filtered = filtered.filter(t => ['FECHADO', 'CANCELADO'].includes(t.status));
          break;
        case 'urgent':
          filtered = filtered.filter(t => t.priority === 'URGENTE');
          break;
      }
    }

    // Ordena por prioridade e data de criação
    filtered.sort((a, b) => {
      const priorityOrder = { 'URGENTE': 4, 'ALTA': 3, 'MEDIA': 2, 'BAIXA': 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredTickets(filtered);
  };

  const handleSelectTicket = async (ticket: Ticket) => {
    if (selectedTicket?.ticketId === ticket.ticketId) {
        // Se o mesmo ticket for clicado, fecha o card de informações
        setShowInfoCard(false);
        setSelectedTicket(null);
        return;
    }
    
    setSelectedTicket(ticket);
    setShowInfoCard(false); // Esconde o card de informações ao selecionar um novo ticket
    
    // Busca informações detalhadas do ticket com atividades
    try {
      const response = await fetch(`/api/support/tickets/${ticket.ticketId}/activities`);
      const data = await response.json();
      if (data.success) {
        setSelectedTicket(data.ticket);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do ticket:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !messageText.trim() || sending) return;

    setSending(true);
    setIsTyping(false);

    try {
      const response = await fetch(`/api/support/tickets/${selectedTicket.ticketId}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'SUPPORT_RESPONSE',
          description: 'Resposta da equipe de suporte',
          response: messageText,
          isSupport: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setMessageText('');
        // Atualiza detalhes do ticket
        handleSelectTicket(selectedTicket);
        // Atualiza a lista de tickets
        fetchTickets();
      } else {
        setError(data.message || 'Erro ao enviar a mensagem.');
      }
    } catch (err: any) {
      setError(`Erro de conexão: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/support/admin/tickets/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ticketId,
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        fetchTickets();
        if (selectedTicket) {
          setSelectedTicket({
            ...selectedTicket,
            status: newStatus
          });
        }
      } else {
        setError(data.message || 'Erro ao atualizar o status do ticket.');
      }
    } catch (err: any) {
      setError(`Erro de conexão: ${err.message}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const getFilterCount = (filter: string) => {
    switch (filter) {
      case 'pending': return stats.pending;
      case 'active': return stats.active;
      case 'resolved': return stats.resolved;
      case 'urgent': return tickets.filter(t => t.priority === 'URGENTE').length;
      default: return stats.total;
    }
  };

  if (loading && tickets.length === 0) {
    return <LoadingPageView />;
  }

  return (
    <Isecurity_wallet active={true} classname='h-screen'> 
    <AppContainer>
      <Sidebar collapsed={sidebarCollapsed}>
        <CollapseButton onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </CollapseButton>
        
        {!sidebarCollapsed && (
          <>
            <SidebarHeader>
              <Logo>
                
                <span>Equipe Suporte</span>
              </Logo>
            </SidebarHeader>

           
            <FilterSection>
              <FilterTitle>Filtros</FilterTitle>
              <FilterGroup>
                <FilterButton 
                  active={activeFilter === 'all'} 
                  onClick={() => setActiveFilter('all')}
                >
                  <MessageCircle size={16} />
                  Todos os Tickets
                  <span className="count">{getFilterCount('all')}</span>
                </FilterButton>
                <FilterButton 
                  active={activeFilter === 'pending'} 
                  onClick={() => setActiveFilter('pending')}
                >
                  <Clock size={16} />
                  Pendentes
                  <span className="count">{getFilterCount('pending')}</span>
                </FilterButton>
                <FilterButton 
                  active={activeFilter === 'active'} 
                  onClick={() => setActiveFilter('active')}
                >
                  <Zap size={16} />
                  Em Atendimento
                  <span className="count">{getFilterCount('active')}</span>
                </FilterButton>
                <FilterButton 
                  active={activeFilter === 'urgent'} 
                  onClick={() => setActiveFilter('urgent')}
                >
                  <AlertTriangle size={16} />
                  Urgentes
                  <span className="count">{getFilterCount('urgent')}</span>
                </FilterButton>
                <FilterButton 
                  active={activeFilter === 'resolved'} 
                  onClick={() => setActiveFilter('resolved')}
                >
                  <CheckCircle size={16} />
                  Resolvidos
                  <span className="count">{getFilterCount('resolved')}</span>
                </FilterButton>
              </FilterGroup>
            </FilterSection>
          </>
        )}
      </Sidebar>

      <MainContent>
        <TopBar>
          <SearchContainer>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput
              placeholder="Buscar tickets por ID, assunto, usuário..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          
          <TopBarActions>
            <ActionButton onClick={fetchTickets} disabled={loading}>
              <RefreshCw size={16} className={loading ? 'spinning' : ''} />
              Atualizar
            </ActionButton>
            
          </TopBarActions>
        </TopBar>

        <ContentArea>
          <TicketList hasSelectedTicket={!!selectedTicket}>
            <TicketListHeader>
              <TicketListTitle>Tickets</TicketListTitle>
              <TicketCount>{filteredTickets.length}</TicketCount>
            </TicketListHeader>
            
            <TicketScrollArea>
              {filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket.ticketId}
                  isSelected={selectedTicket?.ticketId === ticket.ticketId}
                  priority={ticket.priority}
                  onClick={() => handleSelectTicket(ticket)}
                >
                  <TicketHeader>
                    <TicketId>
                      <Hash size={12} />
                      {ticket.ticketId.substring(2)}
                    </TicketId>
                    <TicketBadges>
                      <Badge variant={ticket.status}>{ticket.status}</Badge>
                      <Badge variant={ticket.priority}>{ticket.priority}</Badge>
                    </TicketBadges>
                  </TicketHeader>
                  
                  <TicketSubject>{ticket.subject}</TicketSubject>
                  
                  <TicketMeta>
                    <span>
                      <Calendar size={12} />
                      {formatDistanceToNow(new Date(ticket.createdAt), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                    <span>
                      <Tag size={12} />
                      {categories[ticket.category as keyof typeof categories] || 'Outros'}
                    </span>
                  </TicketMeta>
                  
                  <TicketPreview>{ticket.description}</TicketPreview>
                  
                  <TicketFooter>
                    <UserInfo>
                      <UserAvatar src={ticket.userAvatar}>
                        {!ticket.userAvatar && ticket.userName.charAt(0).toUpperCase()}
                      </UserAvatar>
                      <span>{ticket.userName}</span>
                    </UserInfo>
                    {ticket.activities.length > 0 && (
                      <div style={{ position: 'relative' }}>
                        <MessageCircle size={16} />
                        <NotificationBadge>{ticket.activities.length}</NotificationBadge>
                      </div>
                    )}
                  </TicketFooter>
                </TicketCard>
              ))}
              
              {filteredTickets.length === 0 && !loading && (
                <EmptyState>
                  <EmptyStateIcon>
                    <Search size={32} />
                  </EmptyStateIcon>
                  <EmptyStateTitle>Nenhum ticket encontrado</EmptyStateTitle>
                  <EmptyStateDescription>
                    Tente ajustar os filtros ou termos de busca para encontrar os tickets desejados.
                  </EmptyStateDescription>
                </EmptyState>
              )}
            </TicketScrollArea>
          </TicketList>

          {selectedTicket ? (
            <ChatArea showInfoCard={showInfoCard}>
              <ChatMainContent> {/* Conteúdo principal do chat */}
                <ChatHeader>
                  <ChatHeaderInfo>
                    <ChatHeaderAvatar src={selectedTicket.userAvatar}>
                      {!selectedTicket.userAvatar && selectedTicket.userName.charAt(0).toUpperCase()}
                    </ChatHeaderAvatar>
                    <ChatHeaderDetails>
                      <ChatHeaderTitle>{selectedTicket.subject}</ChatHeaderTitle>
                      <ChatHeaderSubtitle>
                        <User size={14} />
                        {selectedTicket.userName}
                        <span>•</span>
                        <Hash size={14} />
                        {selectedTicket.ticketId.substring(2)}
                        <span>•</span>
                        <Badge variant={selectedTicket.status}>{selectedTicket.status}</Badge>
                      </ChatHeaderSubtitle>
                    </ChatHeaderDetails>
                  </ChatHeaderInfo>
                  
                  <ChatHeaderActions>
                    {selectedTicket.status !== 'FECHADO' && selectedTicket.status !== 'CANCELADO' && (
                      <>
                        {selectedTicket.status === 'PENDENTE' && (
                          <ActionButton 
                            variant="primary"
                            onClick={() => handleUpdateStatus(selectedTicket.ticketId, 'ACEITO')}
                          >
                            <CheckCircle size={16} />
                            Aceitar
                          </ActionButton>
                        )}
                        <ActionButton 
                          variant="secondary"
                          onClick={() => handleUpdateStatus(selectedTicket.ticketId, 'FECHADO')}
                        >
                          <Archive size={16} />
                          Fechar
                        </ActionButton>
                        <ActionButton 
                          variant="danger"
                          onClick={() => handleUpdateStatus(selectedTicket.ticketId, 'CANCELADO')}
                        >
                          <X size={16} />
                          Cancelar
                        </ActionButton>
                      </>
                    )}
                    <ActionButton onClick={() => setShowInfoCard(!showInfoCard)}>
                      <MoreVertical size={16} />
                    </ActionButton>
                  </ChatHeaderActions>
                </ChatHeader>

                <ChatMessages>
                  {/* Mensagem inicial do ticket */}
                  <MessageGroup isSupport={false}>
                    <MessageBubble isSupport={false}>
                      <MessageHeader>
                        <User size={12} />
                        {selectedTicket.userName}
                        <span>•</span>
                        Ticket criado
                      </MessageHeader>
                      <div>{selectedTicket.description}</div>
                      <MessageTime>
                        {format(new Date(selectedTicket.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </MessageTime>
                      <MessageActions>
                        <MessageActionButton>
                          <Copy size={12} />
                        </MessageActionButton>
                        <MessageActionButton>
                          <Share2 size={12} />
                        </MessageActionButton>
                      </MessageActions>
                    </MessageBubble>
                  </MessageGroup>

                  {/* Atividades/Mensagens */}
                  {selectedTicket.activities.map((activity, index) => (
                    <MessageGroup key={index} isSupport={activity.isSupport || activity.type === 'SUPPORT_RESPONSE'}>
                      <MessageBubble isSupport={activity.isSupport || activity.type === 'SUPPORT_RESPONSE'}>
                        <MessageHeader>
                          {activity.isSupport || activity.type === 'SUPPORT_RESPONSE' ? (
                            <>
                              <Shield size={12} />
                              Suporte
                            </>
                          ) : (
                            <>
                              <User size={12} />
                              {activity.userName}
                            </>
                          )}
                        </MessageHeader>
                        <div>{activity.response || activity.description}</div>
                        <MessageTime>
                          {format(new Date(activity.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </MessageTime>
                        <MessageActions>
                          <MessageActionButton>
                            <Copy size={12} />
                          </MessageActionButton>
                          <MessageActionButton>
                            <Share2 size={12} />
                          </MessageActionButton>
                        </MessageActions>
                      </MessageBubble>
                    </MessageGroup>
                  ))}

                  {isTyping && (
                    <MessageGroup isSupport={false}>
                      <TypingIndicator>
                        <span>{selectedTicket.userName} está digitando</span>
                        <TypingDots>
                          <span></span>
                          <span></span>
                          <span></span>
                        </TypingDots>
                      </TypingIndicator>
                    </MessageGroup>
                  )}

                  <div ref={messagesEndRef} />
                </ChatMessages>

                {['ACEITO', 'RESPONDIDO', 'AGUARDANDO'].includes(selectedTicket.status) && (
                  <ChatInput>
                    <InputContainer>
                      <MessageInput
                        ref={messageInputRef}
                        placeholder="Digite sua resposta..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={sending}
                      />
                      <InputActions>
                        <InputActionButton>
                          <Paperclip size={16} />
                        </InputActionButton>
                        <InputActionButton>
                          <Smile size={16} />
                        </InputActionButton>
                        <SendButton 
                          disabled={!messageText.trim() || sending}
                          onClick={handleSendMessage}
                        >
                          {sending ? <LoadingSpinner /> : <Send size={16} />}
                        </SendButton>
                      </InputActions>
                    </InputContainer>
                  </ChatInput>
                )}
              </ChatMainContent>
              {selectedTicket && showInfoCard && (
                <CardInformations ticket={selectedTicket} onClose={() => setShowInfoCard(false)} />
              )}
            </ChatArea>
          ) : (
            <EmptyState>
              <EmptyStateIcon>
                <MessageCircle size={48} color='black'/>
              </EmptyStateIcon>
              <EmptyStateTitle>Selecione um ticket</EmptyStateTitle>
              <EmptyStateDescription>
                Escolha um ticket da lista para iniciar ou continuar a conversa com o usuário.
              </EmptyStateDescription>
            </EmptyState>
          )}
        </ContentArea>
      </MainContent>
    </AppContainer>
    </Isecurity_wallet>
  );
}

SupportAdminPage.getLayout = function getLayout(page: ReactNode) {
  return <>{page}</>;
};

export const getServerSideProps: GetServerSideProps<Props> = withSession(
  async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const req: NextIronRequest = context.req as NextIronRequest;

    const result = await TheNoVisionRoute({
      req
    });

    const user = result.props.user;
    if (!user) {
      return {
        redirect: {
          destination: ROUTENVX.signin,
          permanent: false,
        },
      };
    }
    
    let Permissions: Permission[] = [];
    let logs: ModLog[] = [];

    if (user) {
      const userId = user.id;
      const guildId = "1175857498687807560";

      try {
        logs = await getModLogs(guildId, userId);
        Permissions = await getPermission(guildId, userId);

        Permissions.forEach((permission) => {
          permission.created_at = permission.created_at.toString();
        });

  const hasSupportAdminPermission = Permissions.some(
  (permission) => permission.team?.support === true
  );

        if (!hasSupportAdminPermission) {
          return {
            redirect: {
              destination: ROUTENVX.support, 
              permanent: false,
            },
          };
        }
     
      } catch (error) {
        console.error("Erro ao buscar informações ou permissões:", error);
         
      }
    }

    return {
      props: {
        user,
        Permissions,
        logs,
      },
    };
  }
);



// Componentes Estilizados (mantidos como no arquivo original, sem alterações)
const AppContainer = styled.div`
  display: flex;
  height: 97svh;
  
  font-family: 'ProximaNova-Italic', sans-serif;
  color: #e2e8f0;
  overflow: hidden;
`;

const Sidebar = styled.div<{ collapsed: boolean }>`
  width: ${props => props.collapsed ? '20px' : '320px'};
 
  backdrop-filter: blur(20px);
  border-right: 1px solid #2d302e;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 10;

`;

const SidebarHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #2d302e;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #a3a7a4;
  font-family: 'Inter', monospace;

  
`;

const CollapseButton = styled.button`
  position: absolute;
  top: 24px;
  right: -12px;
  width: 24px;
  height: 24px;
  background: #99903c;
  border: 1px solid #2d302e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
 
  transition: all 0.2s ease;
  z-index: 11;
  color: #e2e8f0;

  &:hover {
    background: #2d302e;
    transform: scale(1.1);
  }
`;

const StatsGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
 
  border-bottom: 1px solid #2d302e;
`;

const StatCard = styled.div`
 
  padding: 9px;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  
`;

const StatValue = styled.div`
   font-size: 0.95rem;
  font-weight: 700;
  color: #41b45e;
 
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterSection = styled.div`
  padding: 24px;
 
`;

const FilterTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${props => props.active ? 'rgba(65, 180, 94, 0.2)' : 'transparent'};

  border-radius: 8px;
  color: ${props => props.active ? '#41b45e' : '#94a3b8'};
 
  transition: all 0.2s ease;
  font-size: 0.875rem;
  text-align: left;
  width: 100%;

  &:hover {
    background: rgba(65, 180, 94, 0.1);
    color: #41b45e;
  }

  .count {
    margin-left: auto;
    background: ${props => props.active ? '#41b45e' : '#374151'};
    color: black;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopBar = styled.div`
  height: 80px;
  
  border-bottom: 1px solid #2d302e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(65, 180, 94, 0.5), transparent);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  background: rgba(30, 32, 31, 0.5);
  border: 1px solid #2d302e;
  border-radius: 12px;
  color: #e2e8f0;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    outline: none;
    border-color: #41b45e;
    background: rgba(30, 32, 31, 0.8);
    box-shadow: 0 0 0 3px rgba(65, 180, 94, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.7em 1em;
  border-radius: 48px;
  font-family: 'InterSemiBold', monospace;
  font-size: 0.875rem;
  font-weight: 600;
 
  transition: all 0.2s ease;
  border: none;
  position: relative;
  overflow: hidden;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, #41b45e, #2d7a3f);
          color: black;
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 25px rgba(65, 180, 94, 0.3);
          }
        `;
      case 'danger':
        return css`
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
          }
        `;
      default:
        return css`
          background: rgba(30, 32, 31, 0.5);
          color: #e2e8f0;
          border: 1px solid #2d302e;
          &:hover {
            background: rgba(30, 32, 31, 0.8);
            border-color: rgba(45, 48, 46, 0.3);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const TicketList = styled.div<{ hasSelectedTicket: boolean }>`
  width: ${props => props.hasSelectedTicket ? '400px' : '70%'};
  background: rgba(0, 0, 0, 0.5);
  border-right: ${props => props.hasSelectedTicket ? '1px solid #2d302e' : 'none'};
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
`;

const TicketListHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #2d302e;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TicketListTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
`;

const TicketCount = styled.span`
  background: #41b45e;
  color: black;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const TicketScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(30, 32, 31, 0.3);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(45, 48, 46, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(45, 48, 46, 0.5);
  }
`;

const TicketCard = styled.div<{ isSelected: boolean; priority: string }>`
  background: ${props => props.isSelected ? 'rgba(55, 65, 58, 0.562)' : 'rgba(82, 83, 82, 0.37)'};
   
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;
 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;

  &::before {
    content: '';
    position: absolute;
    right: 3%;
    bottom: 3%;
     height: 12px;
     width: 20px;
     border-radius: 9px;
    background: ${props => {
      switch (props.priority) {
        case 'URGENTE': return '#ef4444';
        case 'ALTA': return '#f59e0b';
        case 'MEDIA': return '#41b45e';
        case 'BAIXA': return '#10b981';
        default: return '#6b7280';
      }
    }};
    transform: ${props => props.isSelected ? 'scaleY(1)' : 'scaleY(0)'};
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    border-color: rgba(65, 180, 94, 0.3);

    &::before {
      transform: scaleY(1);
    }
  }
`;

const TicketHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 12px;
  gap: 12px;
`;

const TicketId = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #64748b;
  background: rgba(100, 116, 139, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TicketBadges = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const Badge = styled.span<{ variant: string }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.variant) {
      case 'PENDENTE':
        return 'background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);';
      case 'ACEITO':
      case 'RESPONDIDO':
        return 'background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);';
      case 'AGUARDANDO':
        return 'background: rgba(65, 180, 94, 0.2); color: #41b45e; border: 1px solid rgba(65, 180, 94, 0.3);';
      case 'FECHADO':
      case 'CANCELADO':
        return 'background: rgba(107, 114, 128, 0.2); color: #6b7280; border: 1px solid rgba(107, 114, 128, 0.3);';
      case 'URGENTE':
        return 'background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);';
      case 'ALTA':
        return 'background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);';
      case 'MEDIA':
        return 'background: rgba(65, 180, 94, 0.2); color: #41b45e; border: 1px solid rgba(65, 180, 94, 0.3);';
      case 'BAIXA':
        return 'background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);';
      default:
        return 'background: rgba(107, 114, 128, 0.2); color: #6b7280; border: 1px solid rgba(107, 114, 128, 0.3);';
    }
  }}
`;

const TicketSubject = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TicketMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 12px;
`;

const TicketPreview = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TicketFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #2d302e;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserAvatar = styled.div<{ src?: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.src ? `url(${props.src})` : 'linear-gradient(135deg, #41b45e, #2d7a3f)'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ChatArea = styled.div<{ showInfoCard: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: row; /* Alterado para row para permitir info card ao lado */
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const ChatMainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 24px 32px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #2d302e;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ChatHeaderAvatar = styled.div<{ src?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.src ? `url(${props.src})` : 'linear-gradient(135deg, #41b45e, #2d7a3f)'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 1.25rem;
  font-weight: 600;
  border: 3px solid rgba(65, 180, 94, 0.3);
`;

const ChatHeaderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChatHeaderTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
`;

const ChatHeaderSubtitle = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChatHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(30, 32, 31, 0.3);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(45, 48, 46, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(45, 48, 46, 0.5);
  }
`;

const MessageGroup = styled.div<{ isSupport: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: ${props => props.isSupport ? 'flex-end' : 'flex-start'};
  animation: ${fadeIn} 0.5s ease-out;
`;

const MessageBubble = styled.div<{ isSupport: boolean }>`
  max-width: 70%;
  padding: 16px 20px;
  border-radius: ${props => props.isSupport ? '20px 20px 4px 20px' : '20px 20px 20px 4px'};
  background: ${props => props.isSupport 
    ? 'linear-gradient(135deg, #41b45e, #2d7a3f)' 
    : 'rgba(30, 32, 31, 0.8)'};
  color: ${props => props.isSupport ? 'black' : '#e2e8f0'};
  border: 1px solid ${props => props.isSupport 
    ? 'rgba(65, 180, 94, 0.3)' 
    : '#2d302e'};
  position: relative;
  word-wrap: break-word;
  line-height: 1.5;
  
  ${props => props.isSupport && css`
    box-shadow: 0 4px 12px rgba(65, 180, 94, 0.3);
  `}
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.75rem;
  opacity: 0.8;
`;

const MessageTime = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 4px;
  display: block;
`;

const MessageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${MessageBubble}:hover & {
    opacity: 1;
  }
`;

const MessageActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  padding: 4px;
  color: currentColor;
 
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: rgba(30, 32, 31, 0.8);
  border-radius: 20px 20px 20px 4px;
  max-width: 200px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;

  span {
    width: 6px;
    height: 6px;
    background: #64748b;
    border-radius: 50%;
    animation: ${typing} 1.4s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

const ChatInput = styled.div`
  padding: 24px 32px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-top: 1px solid #2d302e;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  background: rgba(30, 32, 31, 0.5);
  border: 1px solid #2d302e;
  border-radius: 16px;
  padding: 16px;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #41b45e;
    box-shadow: 0 0 0 3px rgba(65, 180, 94, 0.1);
  }
`;

const MessageInput = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: none;
  min-height: 20px;
  max-height: 120px;
  font-family: inherit;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    outline: none;
  }
`;

const InputActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputActionButton = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
 
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    color: #41b45e;
    background: rgba(65, 180, 94, 0.1);
  }
`;

const SendButton = styled.button<{ disabled: boolean }>`
  background: ${props => props.disabled ? '#374151' : 'linear-gradient(135deg, #41b45e, #2d7a3f)'};
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  color: black;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(65, 180, 94, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px;
  width: 320px;
  border-left: 1px solid #202221;
  color: #64748b;
`;

const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #41b45e, #2d7a3f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  opacity: 0.8;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 8px 0;
`;

const EmptyStateDescription = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  max-width: 400px;
  line-height: 1.6;
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(65, 180, 94, 0.3);
  border-top: 2px solid #41b45e;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const InfoCardContainer = styled.div<{ show: boolean }>`
  width: ${props => props.show ? '350px' : '0'};
  background: rgba(0, 0, 0, 0.5);
  border-left: 1px solid #2d302e;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  overflow-y: auto;
  height: 100%;
  padding: ${props => props.show ? '24px' : '0'};
  flex-shrink: 0;
`;

const InfoCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const InfoCardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #e2e8f0;
`;

const InfoCardCloseButton = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
 
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #e2e8f0;
    background: rgba(45, 48, 46, 0.2);
  }
`;

const InfoCardSection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoCardSectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #41b45e;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoCardItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed rgba(45, 48, 46, 0.5);

  &:last-child {
    border-bottom: none;
  }
`;

const InfoCardLabel = styled.span`
  font-size: 0.875rem;
  color: #94a3b8;
  flex-basis: 40%;
`;

const InfoCardValue = styled.span`
  font-size: 0.875rem;
  color: #e2e8f0;
  text-align: right;
  flex-basis: 60%;
  word-wrap: break-word;
`;

// Mapeamento de Categorias
const categories = {
  'pagamentos': 'Pagamentos',
  'reembolso': 'Reembolso',
  'financeiro': 'Financeiro',
  'conta': 'Conta',
  'denuncias': 'Denúncias',
  'bugs': 'Bugs'
};
