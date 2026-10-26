import React, { useState, useEffect, useRef, ReactNode } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ArrowLeft, RefreshCw, Info, Clock, AlertCircle, ExternalLink, ImageIcon, FileText, LinkIcon, Monitor, Smartphone, Globe, Send, CheckCircle, XCircle, AlertTriangle, User as UserIcon, MessageSquare, Gift, Smile, Gamepad, Paperclip, MoreVertical, Copy, Reply, Heart, ThumbsUp, Eye, EyeOff, Zap, Star, Shield, Headphones, Lock, X } from 'lucide-react';
import Id from '@/pages/api/admin/comments/[id]';
import LoadingPageView from '@/resources/loading/market.loading';

// Definição das interfaces e tipos
interface Activity {
  _id?: string;
  type: string;
  description: string;
  response?: string;
  createdAt: string;
  userId: string;
  userName: string;
  isSupport: boolean;
  isSystem?: boolean;
  isSending?: boolean;
  isFailed?: boolean;
  supportType?: string;
  metadata?: any;
  isRead?: boolean;
  reactions?: Array<{ emoji: string; count: number; users: string[] }>;
}

interface Ticket {
  _id: string;
  ticketId: string;
  userId: string;
  userName: string;
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
  attachments?: Array<{
    type: string;
    url: string;
    description?: string;
  }>;
}

// Mapeamento de categorias
const categories = {
  'pagamentos': 'Pagamentos',
  'reembolso': 'Reembolso',
  'financeiro': 'Financeiro',
  'conta': 'Suporte Conta Clubr',
  'denuncias': 'Denúncias',
  'bugs': 'Bugs'
};

// Componente principal
export default function TicketDetailPage({ id, onclose }: { id: string, onclose: () => void }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Refs
  const activitiesListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (id) {
      fetchTicket();
    }
  }, [id]);

  // Simulação de status online/offline
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% chance de estar online
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Simulação de digitação do suporte
  useEffect(() => {
    if (ticket && Math.random() > 0.7) {
      const timeout = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [ticket]);

  const fetchTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const response = await fetch(`/api/support/tickets/${id}/activities`);
      const data = await response.json() as any;
      if (data.success) {
        const mockSystemActivity: Activity = {
          type: 'SYSTEM_MESSAGE',
          description: 'Seu ticket foi recebido e está sendo analisado por nossa equipe especializada.',
          createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
          userId: 'system',
          userName: 'Sistema Inteligente',
          isSupport: false,
          isSystem: true,
          isRead: true,
        };

        const mockSupportActivity: Activity = {
          type: 'SUPPORT_RESPONSE',
          description: 'Olá!. Já estou analisando seu caso e em breve terei uma solução para você. 🚀',
          createdAt: new Date(Date.now() - 1800 * 1000).toISOString(),
          userId: 'support-novision',
          userName: 'Suporte',
          isSupport: true,
          supportType: 'general',
          isRead: true,
          reactions: [
            { emoji: '👍', count: 1, users: ['currentUser'] },
            { emoji: '❤️', count: 1, users: ['currentUser'] }
          ]
        };

        setTicket({
          ...data.ticket,
          activities: [...data.ticket.activities, mockSystemActivity, mockSupportActivity]
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        });
      } else {
        setError(data.message || 'Ocorreu um erro ao carregar o ticket.');
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

   

   useEffect(() => {
  let timeout: NodeJS.Timeout;

  const loop = () => {
    if (Math.random() > 0.7) {
      setIsTyping(true);
      fetchTicket();
      setTimeout(() => setIsTyping(false), 3000);
    }

   
    timeout = setTimeout(loop, 10000);  
  };

  if (ticket && ticket.status !== 'FECHADO' && ticket.status !== 'REJEITADO') {
    loop();  
  }

  return () => clearTimeout(timeout);  
}, [ticket, id]);


  const handleTextAreaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  e.preventDefault();

  const newText = e.target.value;
  setResponseText(newText);

  // Auto-resize
  e.target.style.height = 'auto';
  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';

  // Typing indicator
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }

  typingTimeoutRef.current = setTimeout(() => {
    // Stop typing indicator
  }, 1000);
};


const handleSendResponse = async () => {
  if (!responseText.trim()) return;

  const tempId = `temp-${Date.now()}`;
  const optimisticActivity: Activity = {
    _id: tempId,
    type: 'USER_RESPONSE',
    description: responseText,
    createdAt: new Date().toISOString(),
    userId: 'currentUser',
    userName: 'Você',
    isSupport: false,
    isSending: true,
  };

  setTicket(prevTicket => {
    if (!prevTicket) return null;
    return {
      ...prevTicket,
      activities: [...prevTicket.activities, optimisticActivity].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    };
  });

  setResponseText('');
  setSubmitting(true);

  // Auto-resize textarea (se estiver usando textAreaRef)
  if (textAreaRef?.current) {
    textAreaRef.current.style.height = 'auto';
  }

  try {
    const response = await fetch(`/api/support/tickets/${id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'USER_RESPONSE',
        description: optimisticActivity.description,
      }),
    });

    const data = await response.json() as any;

    if (data.success) {
      setTicket(prevTicket => {
        if (!prevTicket) return null;
        return {
          ...prevTicket,
          activities: prevTicket.activities.map(activity =>
            activity._id === tempId
              ? { ...activity, isSending: false, _id: data.activity?._id || `real-${Date.now()}` }
              : activity
          ),
        };
      });

    
    } else {
      setTicket(prevTicket => {
        if (!prevTicket) return null;
        return {
          ...prevTicket,
          activities: prevTicket.activities.map(activity =>
            activity._id === tempId
              ? {
                  ...activity,
                  isSending: false,
                  isFailed: true,
                  description: `Falha ao enviar: ${data.message || 'Erro desconhecido.'}`,
                }
              : activity
          ),
        };
      });
      setError(data.message || 'Erro ao enviar resposta.');
    }
  } catch (err) {
    setTicket(prevTicket => {
      if (!prevTicket) return null;
      return {
        ...prevTicket,
        activities: prevTicket.activities.map(activity =>
          activity._id === tempId
            ? {
                ...activity,
                isSending: false,
                isFailed: true,
                description: 'Falha na conexão. Tente novamente.',
              }
            : activity
        ),
      };
    });
    setError('Não foi possível enviar a resposta. Verifique sua conexão.');
  } finally {
    setSubmitting(false);
  }
};

 
  const addReaction = (activityId: string, emoji: string) => {
    setTicket(prevTicket => {
      if (!prevTicket) return null;
      return {
        ...prevTicket,
        activities: prevTicket.activities.map(activity => {
          if (activity._id === activityId) {
            const reactions = activity.reactions || [];
            const existingReaction = reactions.find(r => r.emoji === emoji);
            
            if (existingReaction) {
              if (existingReaction.users.includes('currentUser')) {
                // Remove reaction
                return {
                  ...activity,
                  reactions: reactions.map(r => 
                    r.emoji === emoji 
                      ? { ...r, count: r.count - 1, users: r.users.filter(u => u !== 'currentUser') }
                      : r
                  ).filter(r => r.count > 0)
                };
              } else {
                // Add reaction
                return {
                  ...activity,
                  reactions: reactions.map(r => 
                    r.emoji === emoji 
                      ? { ...r, count: r.count + 1, users: [...r.users, 'currentUser'] }
                      : r
                  )
                };
              }
            } else {
              // New reaction
              return {
                ...activity,
                reactions: [...reactions, { emoji, count: 1, users: ['currentUser'] }]
              };
            }
          }
          return activity;
        })
      };
    });
  };

  const formatDateForSeparator = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  };

  let lastDate = '';

  useEffect(() => {
    if (activitiesListRef.current) {
      activitiesListRef.current.scrollTop = activitiesListRef.current.scrollHeight;
    }
  }, [ticket?.activities]);

  if (error) {
    return (
      <Container>
        <Overlay>
          <Modal>
            <ErrorState>
              <ErrorIcon>
                <AlertCircle size={60} />
                <ErrorPulse />
              </ErrorIcon>
              <ErrorTitle>Oops! Algo deu errado</ErrorTitle>
              <ErrorMessage>{error}</ErrorMessage>
              <RetryButton onClick={fetchTicket}>
                <RefreshCw size={16} />
                Tentar Novamente
              </RetryButton>
            </ErrorState>
          </Modal>
        </Overlay>
      </Container>
    );
  }

  if (!ticket) {
    if (loading) {
      return (
        <Container>
           <LoadingPageView />
        </Container>
      );
    }
    
    return (
      <Container>
        <Overlay>
          <Modal>
            <ErrorState>
              <ErrorIcon>
                <XCircle size={60} />
              </ErrorIcon>
              <ErrorTitle>Ticket não encontrado</ErrorTitle>
              <ErrorMessage>O ticket solicitado não existe ou você não tem permissão para visualizá-lo.</ErrorMessage>
              <RetryButton onClick={onclose}>
                <ArrowLeft size={16} />
                Voltar
              </RetryButton>
            </ErrorState>
          </Modal>
        </Overlay>
      </Container>
    );
  }

  return (
    <Container>
      <Overlay>
        <Modal>
          <Header>
            <HeaderLeft>
               <img src='/nvrp/20230331_230855.png' alt='novision' height={35} />
              <HeaderInfo>
                <Title>Chat de Suporte</Title>
                <HeaderSubtitle>
                  <OnlineIndicator isOnline={isOnline} />
                  {isOnline ? 'Equipe online' : 'Equipe offline'} • Ticket #{ticket.ticketId}
                </HeaderSubtitle>
              </HeaderInfo>
            </HeaderLeft>
           <BackButton onClick={onclose}>
                <X size={20} />
              </BackButton>
          </Header>

          <Content>
            <ChatContainer>
              <ChatHeader>
                <SupportAgent>
                  <AgentAvatar>
                    <Headphones size={16} />
                    <AgentStatus isOnline={isOnline} />
                  </AgentAvatar>
                  <AgentInfo>
                    <AgentName>Suporte</AgentName>
                    <AgentRole>Especialista em Suporte</AgentRole>
                  </AgentInfo>
                </SupportAgent>
                <ChatStats>
                  <StatItem>
                    <Clock size={14} />
                    <span>Resp max. 24 horas</span>
                  </StatItem>
                  <StatItem>
                    <Star size={14} />
                    <span>4.9/5</span>
                  </StatItem>
                </ChatStats>
              </ChatHeader>

              <MessagesContainer ref={activitiesListRef}>
                {/* <WelcomeMessage>
                  <WelcomeIcon>
                    <Shield size={24} />
                  </WelcomeIcon>
                  <WelcomeText>
                    <strong>Bem-vindo ao suporte premium!</strong>
                    <span>Nossa equipe especializada está aqui para ajudar você 24/7</span>
                  </WelcomeText>
                </WelcomeMessage> */}
 
                {ticket.activities.map((activity, index) => {
                  const currentDate = formatDateForSeparator(activity.createdAt);
                  const showDateSeparator = currentDate !== lastDate;
                  if (showDateSeparator) {
                    lastDate = currentDate;
                  }

                  return (
                    <React.Fragment key={activity._id || index}>
                      {showDateSeparator && (
                        <DateSeparator>
                          <DateLine />
                          <DateText>{currentDate}</DateText>
                          <DateLine />
                        </DateSeparator>
                      )}
                      
                      <MessageWrapper 
                        isSupport={activity.isSupport} 
                        isSystem={activity.isSystem}
                        onMouseEnter={() => setSelectedMessage(activity._id || '')}
                        onMouseLeave={() => setSelectedMessage(null)}
                      >
                        {(activity.isSupport || activity.isSystem) && (
                          <MessageAvatar isSupport={activity.isSupport} isSystem={activity.isSystem}>
                            {activity.isSystem ? (
                              <Zap size={16} />
                            ) : (
                              <Headphones size={16} />
                            )}
                            <AvatarStatus isOnline={isOnline && !activity.isSystem} />
                          </MessageAvatar>
                        )}
                        
                        <MessageBubble 
                          isSupport={activity.isSupport} 
                          isSystem={activity.isSystem}
                          isSending={activity.isSending}
                          isFailed={activity.isFailed}
                        >
                          <MessageHeader>
                            <MessageUser isSupport={activity.isSupport} isSystem={activity.isSystem}>
                              {activity.userName}
                              {activity.isSupport && activity.supportType && (
                                <UserBadge>
                                  {activity.supportType === 'finance' ? 'Financeiro' :
                                   activity.supportType === 'general' ? 'Geral' :
                                   activity.supportType === 'developer' ? 'Dev' :
                                   activity.supportType === 'account' ? 'Conta' : 'Suporte'}
                                </UserBadge>
                              )}
                            </MessageUser>
                            <MessageTime>
                              {new Date(activity.createdAt).toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                              {activity.isSending && <SendingIndicator />}
                              {activity.isFailed && <FailedIndicator />}
                              {!activity.isSending && !activity.isFailed && <DeliveredIndicator />}
                            </MessageTime>
                          </MessageHeader>
                          
                          <MessageContent isSupport={activity.isSupport} isSystem={activity.isSystem}>
                            {activity.description}
                            {activity.response && (
                              <QuotedMessage>
                                {activity.response}
                              </QuotedMessage>
                            )}
                          </MessageContent>

                          {activity.reactions && activity.reactions.length > 0 && (
                            <ReactionsContainer>
                              {activity.reactions.map((reaction, idx) => (
                                <ReactionBubble 
                                  key={idx}
                                  onClick={() => addReaction(activity._id || '', reaction.emoji)}
                                  isActive={reaction.users.includes('currentUser')}
                                >
                                  <span>{reaction.emoji}</span>
                                  <span>{reaction.count}</span>
                                </ReactionBubble>
                              ))}
                            </ReactionsContainer>
                          )}

                          {selectedMessage === activity._id && !activity.isSystem && (
                            <MessageActions isSupport={activity.isSupport}>
                              <ActionButton onClick={() => addReaction(activity._id || '', '👍')}>
                                <ThumbsUp size={14} />
                              </ActionButton>
                              <ActionButton onClick={() => addReaction(activity._id || '', '❤️')}>
                                <Heart size={14} />
                              </ActionButton>
                              <ActionButton>
                                <Reply size={14} />
                              </ActionButton>
                              <ActionButton>
                                <Copy size={14} />
                              </ActionButton>
                            </MessageActions>
                          )}
                        </MessageBubble>
                      </MessageWrapper>
                    </React.Fragment>
                  );
                })}

                {isTyping && (
                  <TypingIndicator>
                    <MessageAvatar isSupport={true}>
                      <Headphones size={16} />
                      <AvatarStatus isOnline={true} />
                    </MessageAvatar>
                    <TypingBubble>
                      <TypingDots>
                        <TypingDot />
                        <TypingDot />
                        <TypingDot />
                      </TypingDots>
                      <TypingText>Conectando...</TypingText>
                    </TypingBubble>
                  </TypingIndicator>
                )}
              </MessagesContainer>

              {ticket.status !== 'FECHADO' && ticket.status !== 'REJEITADO' ? (
                <ChatInputContainer>
                  <ChatInputWrapper>
                    <AttachmentButton>
                      <Paperclip size={18} />
                    </AttachmentButton>
                    
                    <MessageInput
                      ref={textAreaRef}
                      value={responseText}
                      onChange={handleTextAreaChange}
                      placeholder="Digite sua mensagem..."
                      rows={1}
                    />
                    
                    <InputActions>
                      <EmojiButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        <Smile size={18} />
                      </EmojiButton>
                    </InputActions>
                    
                    <SendButton 
                      type="submit" 
                      onClick={handleSendResponse}
                      disabled={submitting || !responseText.trim()}
                      hasContent={!!responseText.trim()}
                    >
                      {submitting ? (
                        <SendingSpinner />
                      ) : (
                        <Send size={18} />
                      )}
                    </SendButton>
                  </ChatInputWrapper>

                  {showEmojiPicker && (
                    <EmojiPicker>
                      {['😊', '👍', '❤️', '🎉', '🚀', '💯', '🔥', '⭐'].map(emoji => (
                        <EmojiOption 
                          key={emoji}
                          onClick={() => {
                            setResponseText(prev => prev + emoji);
                            setShowEmojiPicker(false);
                          }}
                        >
                          {emoji}
                        </EmojiOption>
                      ))}
                    </EmojiPicker>
                  )}
                </ChatInputContainer>
              ) : (
                <ChatInputContainer>
                  <div className='w-full flex flex-col justify-center items-center gap-5'>
                    <Lock size={24} color='#703830'/>
                    <h3 className='text-[12px] text-[#312f2f]'>Atendimento indisponível</h3>
                  </div>
                </ChatInputContainer>
              )}
            </ChatContainer>

            <Sidebar>
              <SidebarSection>
                <SectionHeader>
                  <Info size={18} />
                  <SectionTitle>Informações do Ticket</SectionTitle>
                </SectionHeader>
                
                <TicketMeta>
                  <MetaRow>
                    <MetaLabel>
                      <FileText size={14} />
                      Categoria
                    </MetaLabel>
                    <MetaValue>{categories[ticket.category as keyof typeof categories]}</MetaValue>
                  </MetaRow>
                  
                  <MetaRow>
                    <MetaLabel>
                      <AlertTriangle size={14} />
                      Prioridade
                    </MetaLabel>
                    <PriorityBadge priority={ticket.priority}>
                      {ticket.priority}
                    </PriorityBadge>
                  </MetaRow>
                  
                  <MetaRow>
                    <MetaLabel>
                      <Clock size={14} />
                      Criado em
                    </MetaLabel>
                    <MetaValue>
                      {new Date(ticket.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </MetaValue>
                  </MetaRow>
                  
                  {ticket.assignedToName && (
                    <MetaRow>
                      <MetaLabel>
                        <UserIcon size={14} />
                        Responsável
                      </MetaLabel>
                      <MetaValue>{ticket.assignedToName}</MetaValue>
                    </MetaRow>
                  )}
                </TicketMeta>
                
                <StatusBadge status={ticket.status}>
                  <StatusIndicator status={ticket.status} />
                  {ticket.status}
                </StatusBadge>
              </SidebarSection>

              <SidebarDivider />

              <SidebarSection>
                <SectionHeader>
                  <MessageSquare size={18} />
                  <SectionTitle>Descrição</SectionTitle>
                </SectionHeader>
                <DescriptionCard>
                  {ticket.description}
                </DescriptionCard>
              </SidebarSection>

              {ticket.category === 'bugs' && (
                <>
                  <SidebarDivider />
                  <SidebarSection>
                    <SectionHeader>
                      <Monitor size={18} />
                      <SectionTitle>Informações Técnicas</SectionTitle>
                    </SectionHeader>
                    <TechnicalInfo>
                      {ticket.deviceInfo && (
                        <TechRow>
                          <TechLabel><Smartphone size={12} />Dispositivo</TechLabel>
                          <TechValue>{ticket.deviceInfo}</TechValue>
                        </TechRow>
                      )}
                      {ticket.operatingSystem && (
                        <TechRow>
                          <TechLabel><Monitor size={12} />Sistema</TechLabel>
                          <TechValue>{ticket.operatingSystem}</TechValue>
                        </TechRow>
                      )}
                      {ticket.browserInfo && (
                        <TechRow>
                          <TechLabel><Globe size={12} />Navegador</TechLabel>
                          <TechValue>{ticket.browserInfo}</TechValue>
                        </TechRow>
                      )}
                    </TechnicalInfo>
                  </SidebarSection>
                </>
              )}

              {ticket.attachments && ticket.attachments.length > 0 && (
                <>
                  <SidebarDivider />
                  <SidebarSection>
                    <SectionHeader>
                      <Paperclip size={18} />
                      <SectionTitle>Anexos ({ticket.attachments.length})</SectionTitle>
                    </SectionHeader>
                    <AttachmentsList>
                      {ticket.attachments.map((attachment, index) => (
                        <AttachmentCard key={index}>
                          <AttachmentIcon type={attachment.type}>
                            {attachment.type === 'image' ? <ImageIcon size={16} /> :
                             attachment.type === 'document' ? <FileText size={16} /> :
                             <LinkIcon size={16} />}
                          </AttachmentIcon>
                          <AttachmentInfo>
                            <AttachmentName>{attachment.url.split('/').pop()}</AttachmentName>
                            {attachment.description && (
                              <AttachmentDesc>{attachment.description}</AttachmentDesc>
                            )}
                          </AttachmentInfo>
                          <AttachmentAction href={attachment.url} target="_blank">
                            <ExternalLink size={14} />
                          </AttachmentAction>
                        </AttachmentCard>
                      ))}
                    </AttachmentsList>
                  </SidebarSection>
                </>
              )}
            </Sidebar>
          </Content>
        </Modal>
      </Overlay>
    </Container>
  );
}

// Definição do tema aprimorado
const theme = {
  colors: {
    // Backgrounds
    backgroundDark: '#1a1d1b',
    backgroundMedium: '#1a1d1b',
    backgroundLight: '#1a1d1b',
    backgroundChat: '#1a1d1b',
    backgroundCard: '#1a1d1b',
     
    // Borders
    borderColor: '#292c2b',
    borderLight: '#292c2b',
    
    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1A6',
    textTertiary: '#6B6B70',
    textMuted: '#4A4A4F',
    
    // Brand colors
    accent: '#c8ca4c',
    accentHover: '#00ea69',
    accentLight: 'rgba(57, 209, 103, 0.1)',
    
    // Message bubbles
    userBubble: '#46ad60',
    userBubbleText: '#000000',
    supportBubble: '#1e201f',
    supportBubbleText: '#FFFFFF',
    systemBubble: 'rgba(197, 84, 56, 0.212)',
    systemBubbleText: '#E0E7FF',
    
    // Status colors
    success: '#00D26A',
    successLight: 'rgba(0, 210, 106, 0.1)',
    warning: '#FFB800',
    warningLight: 'rgba(255, 184, 0, 0.1)',
    error: '#FF3B30',
    errorLight: 'rgba(255, 59, 48, 0.1)',
    
    // Online status
    online: '#00D26A',
    offline: '#8E8E93',
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #7e9b51 0%, #38552f 100%)',
    gradientSecondary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientSuccess: 'linear-gradient(135deg, #00D26A 0%, #00A854 100%)',
  },
  shadows: {
    soft: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.15)',
    strong: '0 8px 32px rgba(0, 0, 0, 0.2)',
    glow: '0 0 20px rgba(0, 255, 106, 0.3)',
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xl: '20px',
    full: '50px',
  },
};

// Keyframes para animações
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0, -8px, 0); }
  70% { transform: translate3d(0, -4px, 0); }
  90% { transform: translate3d(0, -2px, 0); }
`;

const typing = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Componentes estilizados
const Container = styled.div`
  font-family: 'Inter', sans-serif;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.342);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  width: 70%;
  height: 90vh;
  background: ${theme.colors.backgroundMedium};
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
   
  border: 2px solid ${theme.colors.borderColor};
  animation: ${scaleIn} 0.3s ease-out;
  
  @media (max-width: 768px) {
    height: 100vh;
    border-radius: 0;
    max-width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4em 2em;
  background: ${theme.colors.backgroundLight};
  border-bottom: 1px solid ${theme.colors.borderColor};
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: ${theme.borderRadius.medium};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${theme.colors.textPrimary};
    background: ${theme.colors.backgroundCard};
    transform: translateX(-2px);
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  color: ${theme.colors.textPrimary};
`;

const HeaderSubtitle = styled.div`
  font-size: 11px;
  color: ${theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OnlineIndicator = styled.div<{ isOnline: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.isOnline ? theme.colors.online : theme.colors.offline};
  animation: ${props => props.isOnline ? pulse : 'none'} 2s infinite;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

const HeaderAction = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: ${theme.borderRadius.medium};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${theme.colors.textPrimary};
    background: ${theme.colors.backgroundCard};
  }
`;

const Content = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 350px;
  overflow: hidden;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 300px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${theme.colors.backgroundChat};
  border-right: 1px solid ${theme.colors.borderColor};
  
  @media (max-width: 768px) {
    border-right: none;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  background: ${theme.colors.backgroundLight};
  border-bottom: 1px solid ${theme.colors.borderColor};
`;

const SupportAgent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AgentAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
`;

const AgentStatus = styled.div<{ isOnline: boolean }>`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.isOnline ? theme.colors.online : theme.colors.offline};
  border: 2px solid ${theme.colors.backgroundLight};
  animation: ${props => props.isOnline ? pulse : 'none'} 2s infinite;
`;

const AgentInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AgentName = styled.div`
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  font-size: 14px;
`;

const AgentRole = styled.div`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
`;

const ChatStats = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${theme.colors.textSecondary};
`;

const MessagesContainer = styled.div`
 
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
    height: 62svh;
    position: relative;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.borderColor};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.borderLight};
  }
`;

const WelcomeMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: ${theme.colors.accentLight};
  border-radius: ${theme.borderRadius.large};
  border: 1px solid rgba(0, 217, 255, 0.2);
  margin-bottom: 20px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const WelcomeIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const WelcomeText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  strong {
    color: ${theme.colors.textPrimary};
    font-weight: 600;
  }
  
  span {
    color: ${theme.colors.textSecondary};
    font-size: 14px;
  }
`;

const DateSeparator = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
`;

const DateLine = styled.div`
  flex: 1;
  height: 1px;
  background: ${theme.colors.borderColor};
`;

const DateText = styled.div`
  font-size: 12px;
  color: ${theme.colors.textTertiary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 12px;
  background: ${theme.colors.backgroundCard};
  border-radius: ${theme.borderRadius.full};
`;

const MessageWrapper = styled.div<{ isSupport: boolean; isSystem?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  justify-content: ${props => props.isSupport || props.isSystem ? 'flex-start' : 'flex-end'};
  animation: ${props => props.isSupport || props.isSystem ? slideIn : slideInRight} 0.4s ease-out;
  position: relative;
  
  &:hover {
    .message-actions {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MessageAvatar = styled.div<{ isSupport: boolean; isSystem?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => 
    props.isSystem ? theme.colors.gradientSecondary :
    props.isSupport ? theme.colors.gradientPrimary : theme.colors.backgroundCard
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
  position: relative;
  flex-shrink: 0;
  margin-top: 4px;
`;

const AvatarStatus = styled.div<{ isOnline: boolean }>`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.isOnline ? theme.colors.online : theme.colors.offline};
  border: 2px solid ${theme.colors.backgroundChat};
`;

const MessageBubble = styled.div<{ 
  isSupport: boolean; 
  isSystem?: boolean; 
  isSending?: boolean; 
  isFailed?: boolean; 
}>`
  max-width: 70%;
  padding: 16px 20px;
  border-radius: ${theme.borderRadius.large};
  position: relative;
  backdrop-filter: blur(10px);
  
  ${props => {
    if (props.isSystem) {
      return css`
        background: ${theme.colors.systemBubble};
        color: ${theme.colors.systemBubbleText};
        border-bottom-left-radius: 6px;
      `;
    } else if (props.isSupport) {
      return css`
        background: ${theme.colors.supportBubble};
        color: ${theme.colors.supportBubbleText};
        border: 1px solid ${theme.colors.borderColor};
        border-bottom-left-radius: 6px;
      `;
    } else {
      return css`
        background: ${theme.colors.userBubble};
        color: ${theme.colors.userBubbleText};
        border-bottom-right-radius: 6px;
        ${props.isSending && css`
          opacity: 0.7;
          background: ${theme.colors.textSecondary};
        `}
        ${props.isFailed && css`
          background: ${theme.colors.errorLight};
          border: 1px solid ${theme.colors.error};
        `}
      `;
    }
  }}
  
  transition: all 0.3s ease;
  
  
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 12px;
`;

const MessageUser = styled.div<{ isSupport: boolean; isSystem?: boolean }>`
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => 
    props.isSystem ? theme.colors.systemBubbleText :
    props.isSupport ? theme.colors.accent : theme.colors.userBubbleText
  };
`;

const UserBadge = styled.span`
  font-size: 10px;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.small};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MessageTime = styled.div`
  font-size: 11px;
  color: ${theme.colors.textTertiary};
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
`;

const SendingIndicator = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid ${theme.colors.textTertiary};
  border-top: 2px solid ${theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const FailedIndicator = styled.div`
  color: ${theme.colors.error};
  display: flex;
  align-items: center;
`;

const DeliveredIndicator = styled.div`
  color: ${theme.colors.success};
  display: flex;
  align-items: center;
`;

const MessageContent = styled.div<{ isSupport: boolean; isSystem?: boolean }>`
  line-height: 1.5;
  font-size: 14px;
  word-break: break-word;
`;

const QuotedMessage = styled.div`
  margin-top: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.medium};
   
  font-size: 13px;
  opacity: 0.9;
`;

const ReactionsContainer = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const ReactionBubble = styled.button<{ isActive: boolean }>`
  background: ${props => props.isActive ? theme.colors.accentLight : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.isActive ? theme.colors.accent : 'transparent'};
  border-radius: ${theme.borderRadius.full};
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.colors.accentLight};
    transform: scale(1.05);
  }
  
  span:first-child {
    font-size: 14px;
  }
  
  span:last-child {
    color: ${theme.colors.textSecondary};
    font-weight: 500;
  }
`;

const MessageActions = styled.div<{ isSupport: boolean }>`
  position: absolute;
  top: -16px;
  ${props => props.isSupport ? 'right: 0;' : 'left: 0;'}
  display: flex;
  gap: 4px;
  background: ${theme.colors.backgroundCard};
  border: 1px solid ${theme.colors.borderColor};
  border-radius: ${theme.borderRadius.medium};
  padding: 4px;
  opacity: 0;
  transform: translateY(4px);
  transition: all 0.2s ease;
  box-shadow: ${theme.shadows.medium};
  z-index: 10;
  
  &.message-actions {
    opacity: 0;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  padding: 6px;
  border-radius: ${theme.borderRadius.small};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${theme.colors.textPrimary};
    background: ${theme.colors.backgroundLight};
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const TypingBubble = styled.div`
  background: ${theme.colors.supportBubble};
  border: 1px solid ${theme.colors.borderColor};
  border-radius: ${theme.borderRadius.large};
  border-bottom-left-radius: 6px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
`;

const TypingDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${theme.colors.accent};
  animation: ${typing} 1.4s infinite ease-in-out;
  
  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }
  &:nth-child(3) { animation-delay: 0s; }
`;

const TypingText = styled.div`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
  font-style: italic;
`;

const ChatInputContainer = styled.div`
  padding: 20px 24px;
  background: ${theme.colors.backgroundLight};
  border-top: 1px solid ${theme.colors.borderColor};
  position: relative;
`;

const ChatInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${theme.colors.backgroundCard};
  border: 1px solid ${theme.colors.borderColor};
  border-radius: ${theme.borderRadius.xl};
  padding: 12px 16px;
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px ${theme.colors.accentLight};
  }
`;

const AttachmentButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: ${theme.borderRadius.medium};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${theme.colors.accent};
    background: ${theme.colors.accentLight};
    transform: rotate(15deg);
  }
`;

const MessageInput = styled.textarea`
  flex: 1;
  background: none;
  border: none;
  color: ${theme.colors.textPrimary};
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  min-height: 20px;
  max-height: 120px;
  font-family: inherit;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${theme.colors.textTertiary};
  }
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.borderColor};
    border-radius: 2px;
  }
`;

const InputActions = styled.div`
  display: flex;
  gap: 4px;
`;

const EmojiButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: ${theme.borderRadius.medium};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${theme.colors.accent};
    background: ${theme.colors.accentLight};
    transform: scale(1.1);
  }
`;

const SendButton = styled.button<{ hasContent: boolean }>`
  background: ${props => props.hasContent ? theme.colors.gradientPrimary : theme.colors.backgroundCard};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: ${props => props.hasContent ? 'white' : theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: ${props => props.hasContent ? 'scale(1.05)' : 'none'};
    box-shadow: ${props => props.hasContent ? theme.shadows.glow : 'none'};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.gradientPrimary};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: ${props => props.hasContent ? 0.1 : 0};
  }
`;

const SendingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const EmojiPicker = styled.div`
  position: absolute;
  bottom: 100%;
  right: 80px;
  background: ${theme.colors.backgroundCard};
  border: 1px solid ${theme.colors.borderColor};
  border-radius: ${theme.borderRadius.large};
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  box-shadow: ${theme.shadows.strong};
  animation: ${scaleIn} 0.2s ease-out;
  z-index: 100;
`;

const EmojiOption = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: ${theme.borderRadius.medium};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.colors.accentLight};
    transform: scale(1.2);
  }
`;

const Sidebar = styled.div`
  background: ${theme.colors.backgroundMedium};
  
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.borderColor};
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarSection = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${theme.colors.borderColor};
  font-family: 'ProximaNova-Italic', sans-serif;

  &:last-child {
    border-bottom: none;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  font-family: 'ProximaNova-Italic', sans-serif;
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const TicketMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
`;

const MetaRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MetaLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const MetaValue = styled.div`
  color: ${theme.colors.textPrimary};
  font-weight: 500;
`;

const PriorityBadge = styled.div<{ priority: string }>`
  padding: 6px 12px;
  border-radius: ${theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  align-self: flex-start;
  
  ${props => {
    switch (props.priority.toLowerCase()) {
      case 'alta':
        return css`
          background: ${theme.colors.errorLight};
          color: ${theme.colors.error};
        `;
      case 'média':
        return css`
          background: ${theme.colors.warningLight};
          color: ${theme.colors.warning};
        `;
      case 'baixa':
        return css`
          background: ${theme.colors.successLight};
          color: ${theme.colors.success};
        `;
      default:
        return css`
          background: ${theme.colors.accentLight};
          color: ${theme.colors.accent};
        `;
    }
  }}
`;

const StatusBadge = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: ${theme.borderRadius.large};
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${theme.colors.backgroundCard};
  border: 1px solid ${theme.colors.borderColor};
  color: ${theme.colors.textPrimary};
`;

const StatusIndicator = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status.toLowerCase()) {
      case 'aberto':
      case 'pendente':
        return theme.colors.warning;
      case 'em andamento':
      case 'aceito':
        return theme.colors.accent;
      case 'resolvido':
      case 'fechado':
        return theme.colors.success;
      case 'rejeitado':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  }};
  animation: ${pulse} 2s infinite;
`;

const SidebarDivider = styled.div`
  height: 1px;
  background: ${theme.colors.borderColor};
  margin: 0 24px;
`;

const DescriptionCard = styled.div`
  background: ${theme.colors.backgroundCard};
  border: 1px solid ${theme.colors.borderColor};
  border-radius: ${theme.borderRadius.large};
  padding: 16px;
  color: ${theme.colors.textPrimary};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const TechnicalInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TechRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: ${theme.colors.backgroundCard};
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${theme.colors.borderColor};
`;

const TechLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const TechValue = styled.div`
  color: ${theme.colors.textPrimary};
  font-size: 13px;
 
  word-break: break-word;
`;

const AttachmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AttachmentCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${theme.colors.backgroundCard};
  border: 1px solid ${theme.colors.borderColor};
  border-radius: ${theme.borderRadius.medium};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${theme.colors.accent};
    transform: translateY(-1px);
  }
`;

const AttachmentIcon = styled.div<{ type: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  ${props => {
    switch (props.type) {
      case 'image':
        return css`background: ${theme.colors.gradientSuccess};`;
      case 'document':
        return css`background: ${theme.colors.gradientSecondary};`;
      default:
        return css`background: ${theme.colors.gradientPrimary};`;
    }
  }}
`;

const AttachmentInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AttachmentName = styled.div`
  color: ${theme.colors.textPrimary};
  font-weight: 500;
  font-size: 13px;
`;

const AttachmentDesc = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 12px;
`;

const AttachmentAction = styled.a`
  color: ${theme.colors.accent};
  text-decoration: none;
  padding: 6px;
  border-radius: ${theme.borderRadius.medium};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.colors.accentLight};
    transform: scale(1.1);
  }
`;
 
const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
  gap: 24px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  position: relative;
  color: ${theme.colors.error};
`;

const ErrorPulse = styled.div`
  position: absolute;
  inset: -10px;
  border: 2px solid ${theme.colors.error};
  border-radius: 50%;
  opacity: 0.3;
  animation: ${pulse} 2s infinite;
`;

const ErrorTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 400px;
  margin: 0;
`;

const RetryButton = styled.button`
  background: ${theme.colors.gradientPrimary};
  border: none;
  border-radius: ${theme.borderRadius.large};
  padding: 14px 28px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
  }
  
  &:active {
    transform: translateY(0);
  }
`;