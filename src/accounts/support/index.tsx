import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { 
  ArrowLeft, 
  RefreshCw, 
  X, 
  AlertCircle, 
  CreditCard, 
  DollarSign,  
  Flag, 
  Bug, 
  LinkIcon, 
  ImageIcon, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  ChevronRight,
  ChevronLeft,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  MessageSquare,
  Calendar,
  Tag,
  Circle,
  Hash
} from 'lucide-react';
import { User } from '@/types/user/types';
import { CustomSelect } from '@/.spacevision/screens/garage-modal';
import TicketDetailPage from './ticket';

// Animations
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

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const progressFill = keyframes`
  from { width: 0%; }
  to { width: var(--progress-width); }
`;

// Styled Components
const Container = styled.div`
  font-family:  "Inter",sans-serif;
  color: #ffffff;
  width: 100%;
 
  align-items: center;
  display: flex;
  flex-direction: column;
 
`;
 
const Content = styled.div`
  width: 100%;
  margin: 0 auto;
   

  @media screen and (max-width: 768px) {
    padding: 2px;
    width: 100%;
  }
`;

const TabsContainer = styled.div`
 
 
`;

const TabsList = styled.div`
   display: flex;
  gap: 24px;
  border-bottom: 1px solid #333;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ active: boolean }>`
 background: none;
  border: none;
  color: ${(props) => (props.active ? "#3fc561" : "#666")};
  font-size: 13px;
  padding: 8px 0;
  text-transform: uppercase;
  position: relative;
  font-family: 'InterSemiBold', monospace;
   
 
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${(props) => (props.active ? "#3fc561" : "transparent")};
  }
  
  &:hover {
    color: ${(props) => (props.active ? "#3fc561" : "#999")};
  }
`;

const TabContent = styled.div<{ visible: boolean }>`
  display: ${props => props.visible ? 'block' : 'none'};
  animation: ${fadeIn} 0.3s ease-out;
  
`;

// Create Ticket Styles
const StepsContainer = styled.div`
  margin-bottom: 32px;
`;

const StepsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const StepsProgress = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 32px;

   @media screen and (max-width: 768px) {
    max-width: 100%;
    width: 100%;
    margin: 0 0px;
  }
`;

const ProgressBar = styled.div`
  height: 4px;
  background: #2a2b2a;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #41b45e, #369649);
  border-radius: 2px;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const StepsIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  .step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
    
    ${props => {
      if (props.completed) {
        return `
          background: #41b45e;
          color: #ffffff;
        `;
      } else if (props.active) {
        return `
          background: #41b45e;
          color: #ffffff;
        `;
      } else {
        return `
          background: #2a2b2a;
          color: #9ca3af;
        `;
      }
    }}
  }
  
  .step-label {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.active || props.completed ? '#ffffff' : '#9ca3af'};
    text-align: center;
  }
`;

const StepContent = styled.div<{ visible: boolean }>`
  display: ${props => props.visible ? 'block' : 'none'};
  
  border-radius: 16px;
  padding: 32px;
  animation: ${slideIn} 0.3s ease-out;

    @media screen and (max-width: 768px) {
     padding: 8px;
    width: 100%;
  }
`;

const StepTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #ffffff;
`;

const StepDescription = styled.p`
  font-size: 14px;
  color: #9ca3af;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const CategoryCard = styled.div<{ selected: boolean; categoryType: string }>`
  padding: 24px;
  background-color:  ${props => props.selected ? 'rgba(69, 119, 82, 0.192)' : '#1f201f'};
  border-radius: 12px;
  border-left: none;
  cursor: pointer;
  transition: all 0.3s ease;
   
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: #41b45e;
    
    transform: translateY(-2px);
  }

  &::before {
    content: "";
    position: absolute;
    right:4%;
    top: 5%;
    bottom: 0;
    border-radius: 4px;
    width: 14px;
    height: 14px;
    background: ${props => {
      switch(props.categoryType) {
        case 'pagamentos': return '#3498db';
        case 'reembolso': return '#27ae60';
        case 'financeiro': return '#f39c12';
        case 'conta': return '#9b59b6';
        case 'denuncias': return '#e74c3c';
        case 'bugs': return '#95a5a6';
        default: return '#41b45e';
      }
    }};
    

    opacity: ${props => props.selected ? 1 : 0.3};
  }
`;

const CategoryIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  color: #505852;
`;

const CategoryTitle = styled.h4`
  margin: 0 0 8px 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  font-family: 'ProximaNova-Italic', sans-serif;
`;

const CategoryDesc = styled.p`
  margin: 0;
  color: #9ca3af;
  font-size: 13px;
  font-family: 'ProximaNova-Italic', sans-serif;
  line-height: 1.4;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${props => props.fullWidth && 'grid-column: 1 / -1;'}
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RequiredIndicator = styled.span`
  color: #ef4444;
  font-size: 12px;
`;

const Input = styled.input`
  padding: 14px 16px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.02);
  color: #ffffff;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #41b45e;
    background: rgba(65, 180, 94, 0.05);
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const TextArea = styled.textarea`
  padding: 14px 16px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.02);
  color: #ffffff;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;
  font-family: inherit;
  
  &:focus {
    outline: none;
  
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const Select = styled.select`
  padding: 14px 16px;
  border: 2px solid #2a2b2a;
  border-radius: 12px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.02);
  color: #ffffff;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #41b45e;
    background: rgba(65, 180, 94, 0.05);
  }

  option {
    background: #1a1b1a;
    color: #ffffff;
  }
`;

const StepActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1%;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #2a2b2a;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'ghost' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  text-align: center;
  justify-content: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-family: 'InterSemiBold', monospace;
  gap: 8px;
  transition: all 0.2s ease;
  border: none;
  
  ${props => {
    switch(props.variant) {
      case 'primary':
        return `
          background: #f1f1f1;
          color: #000000;
          
          &:hover {
            background: #030303;
            color: white;
            transform: translateY(-1px);
          }
          
          &:active {
            transform: translateY(0);
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }
        `;
      case 'secondary':
        return `
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          border: 1px solid #2a2b2a;
          
          &:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #41b45e;
          }
        `;
      case 'ghost':
      default:
        return `
          background: transparent;
          color: #9ca3af;
          
          &:hover {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.05);
          }
        `;
    }
  }}
`;

// My Tickets Styles
const TicketsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TicketsTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
`;

const TicketsCount = styled.span`
  background: #41b45e;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 12px;
`;

const TicketsActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SearchInput = styled.div`
  position: relative;
  
  input {
    padding: 10px 16px 10px 40px;
    border: none;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.02);
    color: #ffffff;
    font-size: 14px;
    width: 250px;
    
    &:focus {
      outline: none;
      border: none;
    }
    
    &::placeholder {
      color: #6b7280;
    }
  }
  
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
  }
`;


const TicketsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TicketCard = styled.div<{ priority: string }>`
   
  padding: 24px;
  background-color:  #1f201f;
  border-radius: 12px;
  border-left: none;
  cursor: pointer;
  transition: all 0.3s ease;
   
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: #41b45e;
    
    transform: translateY(-2px);
  }

  &::before {
    content: "";
    position: absolute;
    right:4%;
    top: 5%;
    bottom: 0;
    border-radius: 4px;
    width: 14px;
    height: 14px;

    opacity: ${props => props.priority ? 1 : 0.3};
  }
`;

const TicketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 16px;
`;

const TicketInfo = styled.div`
  flex: 1;
`;

const TicketId = styled.span`
  font-weight: 600;
  color: #41b45e;
  font-size: 14px;
`;

const TicketSubject = styled.h4`
  margin: 4px 0 8px 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
`;

const TicketMeta = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const Badge = styled.span<{ variant: string }>`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
  
  ${props => {
    switch(props.variant) {
      case 'PENDENTE':
        return 'background: rgba(251, 191, 36, 0.1); color: #fbbf24;';
      case 'ACEITO':
        return 'background: rgba(65, 180, 94, 0.1); color: #41b45e;';
      case 'REJEITADO':
        return 'background: rgba(239, 68, 68, 0.1); color: #ef4444;';
      case 'AGUARDANDO':
        return 'background: rgba(155, 89, 182, 0.1); color: #9b59b6;';
      case 'RESPONDIDO':
        return 'background: rgba(52, 152, 219, 0.1); color: #3498db;';
      case 'FECHADO':
        return 'background: rgba(107, 114, 128, 0.1); color: #9ca3af;';
      case 'pagamentos':
        return 'background: rgba(52, 152, 219, 0.1); color: #3498db;';
      case 'reembolso':
        return 'background: rgba(39, 174, 96, 0.1); color: #27ae60;';
      case 'financeiro':
        return 'background: rgba(243, 156, 18, 0.1); color: #f39c12;';
      case 'conta':
        return 'background: rgba(155, 89, 182, 0.1); color: #9b59b6;';
      case 'denuncias':
        return 'background: rgba(231, 76, 60, 0.1); color: #e74c3c;';
      case 'bugs':
        return 'background: rgba(149, 165, 166, 0.1); color: #95a5a6;';
      case 'BAIXA':
        return 'background: rgba(65, 180, 94, 0.1); color: #41b45e;';
      case 'MEDIA':
        return 'background: rgba(251, 191, 36, 0.1); color: #fbbf24;';
      case 'ALTA':
        return 'background: rgba(243, 156, 18, 0.1); color: #f39c12;';
      case 'URGENTE':
        return 'background: rgba(239, 68, 68, 0.1); color: #ef4444;';
      default:
        return 'background: rgba(149, 165, 166, 0.1); color: #95a5a6;';
    }
  }}
`;

const TicketDate = styled.span`
  color: #9ca3af;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TicketDescription = styled.p`
  color: #9ca3af;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  font-family: 'ProximaNova-Italic', sans-serif;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TicketActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button`
  padding: 6px 8px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #9ca3af;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 24px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #ffffff;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  margin: 0 0 24px 0;
  line-height: 1.5;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

// New styles for improved ticket UI
const TicketCardUI = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding: 20px;
  background-color: #2124236e;
 
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: #212321;
    border-color: #41b45e;
  }
`;

const TicketHeaderUI = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TicketTitleGroupUI = styled.div`
  display: flex;
  flex-direction: column;
`;

const TicketIdUI = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
  
  svg {
    color: #41b45e;
  }
`;

const TicketSubjectUI = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 8px 0 0 0;
`;

const TicketMetadataUI = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const TicketBadgeUI = styled(Badge)`
  font-weight: 600;
  text-transform: capitalize;
`;

const TicketDescriptionUI = styled.div`
  font-size: 14px;
  color: #9ca3af;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;


interface Ticket {
  _id: string;
  ticketId: string;
  userId: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  attachments?: Array<{
    type: string;
    url: string;
    description?: string;
  }>;
}

const categories = [
  {
    id: 'pagamentos',
    title: 'Pagamentos',
    description: 'Problemas com processamento de pagamentos, falhas em transações',
    icon: <CreditCard size={16} />
  },
  {
    id: 'reembolso',
    title: 'Reembolso',
    description: 'Solicitações de reembolso, estornos e devoluções',
    icon: <DollarSign size={16} />
  },
  {
    id: 'financeiro',
    title: 'Financeiro',
    description: 'Questões financeiras, cobrança indevida, faturas',
    icon: <FileText size={16} />
  },
  {
    id: 'conta',
    title: 'Suporte Conta',
    description: 'Problemas com sua conta, acesso, configurações',
    icon: <Info size={16} />
  },
  {
    id: 'denuncias',
    title: 'Denúncias',
    description: 'Reportar comportamento inadequado, violações',
    icon: <Flag size={16} />
  },
  {
    id: 'bugs',
    title: 'Bugs Técnicos',
    description: 'Reportar problemas técnicos, erros no sistema',
    icon: <Bug size={16} />
  }
];

const steps = [
  { id: 1, label: 'Categoria', description: 'Selecione o tipo de problema' },
  { id: 2, label: 'Detalhes', description: 'Descreva sua solicitação' },
  { id: 3, label: 'Revisão', description: 'Confirme as informações' }
];
type Option = { label: string; value: string };

export default function SupportPage({ user }: { user: User }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'create' | 'tickets'>('tickets');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setpage] = useState(false)
  const [openedTicketId, setOpenedTicketId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'MEDIA',
    deviceInfo: user.email,
    browserInfo: '',
    errorMessage: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '',
    operatingSystem: '',
    additionalInfo: ''
  });
  const [attachments, setAttachments] = useState<Array<{
    type: string;
    url: string;
    description: string;
  }>>([]);

  useEffect(() => {
    fetchTickets();
    // Auto-detect OS
    const userAgent = navigator.userAgent;
    let os = 'Unknown';
    if (userAgent.indexOf('Win') !== -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') !== -1) os = 'macOS';
    else if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
    else if (userAgent.indexOf('Android') !== -1) os = 'Android';
    else if (userAgent.indexOf('iOS') !== -1) os = 'iOS';
    
    setFormData(prev => ({
      ...prev,
      operatingSystem: os,
      browserInfo: navigator.userAgent.split(' ').pop() || 'Unknown'
    }));
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/support/tickets');
      const data = await response.json() as any;
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
    }
  };


  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !formData.subject || !formData.description) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          ...formData,
          attachments
        }),
      });

      const data = await response.json() as any;
      if (data.success) {
     
        // Reset form
        setFormData({
          subject: '',
          description: '',
          priority: 'MEDIA',
          deviceInfo: user.email,
          browserInfo: formData.browserInfo,
          errorMessage: '',
          stepsToReproduce: '',
          expectedBehavior: '',
          actualBehavior: '',
          userAgent: formData.userAgent,
          screenResolution: formData.screenResolution,
          operatingSystem: formData.operatingSystem,
          additionalInfo: ''
        });
        setAttachments([]);
        setSelectedCategory('');
        setCurrentStep(1);
        setActiveTab('tickets');
        fetchTickets();
      } else {
        alert('Erro ao criar ticket: ' + data.message);
      }
    } catch (error) {
      alert('Erro ao criar ticket');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStepProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  return (
    <>
   
    <Container>
      
      <Content>
        <TabsContainer>
          <TabsList>
            <Tab 
              active={activeTab === 'tickets'} 
              onClick={() => setActiveTab('tickets')}
            >
              Solicitações
              {tickets.length > 0 && <TicketsCount>{tickets.length}</TicketsCount>}
            </Tab>
            <Tab 
              active={activeTab === 'create'} 
              onClick={() => setActiveTab('create')}
            >
              Nova Solicitação
            </Tab>
          </TabsList>
        </TabsContainer>

        <TabContent visible={activeTab === 'tickets'}>
          <TicketsHeader>
             
            <TicketsActions>
              <SearchInput>
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchInput>
             
            </TicketsActions>
          </TicketsHeader>

          <TicketsList>
            {filteredTickets.length === 0 ? (
              <EmptyState>
                <EmptyIcon>🎫</EmptyIcon>
                <EmptyTitle>
                  {searchTerm ? 'Nenhum ticket encontrado' : 'Nenhuma solicitação ainda'}
                </EmptyTitle>
                <EmptyDescription>
                  {searchTerm 
                    ? 'Tente ajustar os termos de busca ou limpar os filtros.'
                    : 'Você ainda não possui tickets de suporte. Crie uma nova solicitação para obter ajuda.'
                  }
                </EmptyDescription>
                {!searchTerm && (
                  <Button variant="primary" onClick={() => setActiveTab('create')}>
                    <Plus size={16} />
                    Nova Solicitação
                  </Button>
                )}
              </EmptyState>
            ) : (
              filteredTickets.map(ticket => (
                <React.Fragment key={ticket._id}>
                  <TicketCardUI onClick={() => setOpenedTicketId(ticket.ticketId)}>
                    <TicketHeaderUI>
                      <TicketTitleGroupUI>
                        <TicketIdUI>
                          <Hash size={16} />
                          <span>{ticket.ticketId}</span>
                        </TicketIdUI>
                        <TicketSubjectUI>{ticket.subject}</TicketSubjectUI>
                      </TicketTitleGroupUI>
                      <TicketMetadataUI>
                        <TicketBadgeUI variant={ticket.status}>
                          <Circle size={10} fill="currentColor" />
                          {ticket.status}
                        </TicketBadgeUI>
                        <TicketBadgeUI variant={ticket.priority}>
                          <Tag size={12} />
                          {ticket.priority}
                        </TicketBadgeUI>
                      </TicketMetadataUI>
                    </TicketHeaderUI>
                    <TicketMetadataUI>
                      <TicketBadgeUI variant={ticket.category}>
                        {categories.find(c => c.id === ticket.category)?.icon}
                        {categories.find(c => c.id === ticket.category)?.title || ticket.category}
                      </TicketBadgeUI>
                      <TicketDate>
                        <Calendar size={12} />
                        {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                      </TicketDate>
                    </TicketMetadataUI>
                    <TicketDescriptionUI>{ticket.description}</TicketDescriptionUI>
                  </TicketCardUI>
                  
                  {openedTicketId === ticket.ticketId && (
                    <TicketDetailPage 
                      id={ticket.ticketId} 
                      onclose={() => setOpenedTicketId(null)} 
                    />
                  )}
                </React.Fragment>
              ))
            )}
          </TicketsList>
        </TabContent>

        <TabContent visible={activeTab === 'create'}>
          <StepsContainer>
            <StepsHeader>
              <div />
              <StepsProgress>
                <ProgressBar>
                  <ProgressFill progress={getStepProgress()} />
                </ProgressBar>
                <StepsIndicator>
                  {steps.map(step => (
                    <Step 
                      key={step.id}
                      active={currentStep === step.id}
                      completed={currentStep > step.id}
                    >
                      <div className="step-circle">
                        {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
                      </div>
                      <div className="step-label">{step.label}</div>
                    </Step>
                  ))}
                </StepsIndicator>
              </StepsProgress>
              <div />
            </StepsHeader>

            
            <StepContent visible={currentStep === 1}>
              <StepTitle>Selecione a Categoria</StepTitle>
              <StepDescription>
                Escolha a categoria que melhor descreve seu problema para que possamos direcioná-lo corretamente.
              </StepDescription>
              
              <CategoryGrid>
                {categories.map(category => (
                  <CategoryCard
                    key={category.id}
                    selected={selectedCategory === category.id}
                    categoryType={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CategoryIcon>
                      {category.icon}
                    </CategoryIcon>
                    <CategoryTitle>{category.title}</CategoryTitle>
                    <CategoryDesc>{category.description}</CategoryDesc>
                  </CategoryCard>
                ))}
              </CategoryGrid>

              <StepActions>
                <div />
                <Button 
                  variant="primary" 
                  onClick={nextStep}
                  disabled={!selectedCategory}
                >
                  Continuar
                  <ChevronRight size={16} />
                </Button>
              </StepActions>
            </StepContent>

            {/* Step 2: Form Details */}
            <StepContent visible={currentStep === 2}>
              <StepTitle>Detalhes da Solicitação</StepTitle>
              <StepDescription>
                Forneça informações detalhadas sobre seu problema para que possamos ajudá-lo da melhor forma.
              </StepDescription>

              <FormGrid>
                <FormGroup fullWidth>
                  <Label>
                    <AlertCircle size={16} />
                    Assunto <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Descreva brevemente o problema"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <Clock size={16} />
                    Prioridade
                  </Label>

                  <CustomSelect
                      options={[
                        { label: "🟢 Baixa", value: "BAIXA" },
                        { label: "🟡 Média", value: "MEDIA" },
                        { label: "🟠 Alta", value: "ALTA" },
                        { label: "🔴 Urgente", value: "URGENTE" },
                      ]}
                        value={formData.priority}
              onChange={(value: string | null) =>
  setFormData({ ...formData, priority: value ?? '' })
}

                      placeholder="Ordenar por"
                    />

                  
                </FormGroup>

                <FormGroup>
                  <Label>Informações do usuario</Label>
                  <Input
                    type="text"
                    value={formData.deviceInfo}
                    onChange={(e) => setFormData({...formData, deviceInfo: e.target.value})}
                    placeholder="julio@thenovision.com"
                  />
                </FormGroup>

                <FormGroup fullWidth>
                  <Label>
                    <FileText size={16} />
                    Descrição detalhada <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva o problema em detalhes..."
                    required
                  />
                </FormGroup>

                {selectedCategory === 'bugs' && (
                  <>
                    <FormGroup>
                      <Label>Mensagem de Erro</Label>
                      <Input
                        type="text"
                        value={formData.errorMessage}
                        onChange={(e) => setFormData({...formData, errorMessage: e.target.value})}
                        placeholder="Cole aqui a mensagem de erro"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Sistema Operacional</Label>
                      <Input
                        type="text"
                        value={formData.operatingSystem}
                        onChange={(e) => setFormData({...formData, operatingSystem: e.target.value})}
                        placeholder="Detectado automaticamente"
                      />
                    </FormGroup>

                    <FormGroup fullWidth>
                      <Label>Passos para Reproduzir</Label>
                      <TextArea
                        value={formData.stepsToReproduce}
                        onChange={(e) => setFormData({...formData, stepsToReproduce: e.target.value})}
                        placeholder="1. Vá para...&#10;2. Clique em...&#10;3. Observe que..."
                      />
                    </FormGroup>
                  </>
                )}

                <FormGroup fullWidth>
                  <Label>Informações Adicionais</Label>
                  <TextArea
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                    placeholder="Qualquer informação adicional que possa ajudar..."
                  />
                </FormGroup>
              </FormGrid>

              <StepActions>
                <Button variant="ghost" onClick={prevStep}>
                  <ChevronLeft size={16} />
                  Voltar
                </Button>
                <Button 
                  variant="primary" 
                  onClick={nextStep}
                  disabled={!formData.subject || !formData.description}
                >
                  Continuar
                  <ChevronRight size={16} />
                </Button>
              </StepActions>
            </StepContent>

            {/* Step 3: Review */}
            <StepContent visible={currentStep === 3}>
              <StepTitle>Revisar Solicitação</StepTitle>
              <StepDescription>
                Revise todas as informações antes de enviar sua solicitação de suporte.
              </StepDescription>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '24px', borderRadius: '12px', border: '1px solid #2a2b2a' }}>
                <div style={{ marginBottom: '20px' }}>
                  <Label style={{ marginBottom: '8px' }}>Categoria</Label>
                  <Badge variant={selectedCategory}>
                    {categories.find(c => c.id === selectedCategory)?.title}
                  </Badge>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <Label style={{ marginBottom: '8px' }}>Assunto</Label>
                  <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
                    {formData.subject}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <Label style={{ marginBottom: '8px' }}>Prioridade</Label>
                  <Badge variant={formData.priority}>
                    {formData.priority}
                  </Badge>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <Label style={{ marginBottom: '8px' }}>Descrição</Label>
                  <div style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.5' }}>
                    {formData.description}
                  </div>
                </div>

                {formData.deviceInfo && (
                  <div style={{ marginBottom: '20px' }}>
                    <Label style={{ marginBottom: '8px' }}>Informações do usuario</Label>
                    <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                      {formData.deviceInfo}
                    </div>
                  </div>
                )}
              </div>

              <StepActions>
                <Button variant="ghost" onClick={prevStep}>
                  <ChevronLeft size={16} />
                  Voltar
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="spinning" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Enviar Solicitação
                    </>
                  )}
                </Button>
              </StepActions>
            </StepContent>
          </StepsContainer>
        </TabContent>
      </Content>
    </Container>

    </>
  );
}