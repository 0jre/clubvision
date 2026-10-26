"use client"

import {
  Home,
  Users,
  Shield,
  BarChart3,
  Gauge,
  Code,
  UserCheck,
  FileCheck,
  Eye,
  AlertTriangle,
  ImageIcon,
  MessageSquare,
  VideoIcon,
  UserPlus,
  Key,
  IndentDecrease,
  Cone,
  Store,
  CircleDotDashed,
  AreaChartIcon as ChartArea,
  Coins,
  ArrowLeftCircle,
  UsersRound,
  ShieldHalf,
  TrendingUp,
  Gem,
  Box,
  ArrowBigRight,
  Swords,
  LineChartIcon as ChartLine,
  Shell,
  Banknote,
  Wallet,
  Microchip,
} from "lucide-react"
import styled from "styled-components"
import { useSidebar } from "./sidebar-context"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const SidebarContainer = styled.aside<{ $isCollapsed: boolean; $isMobile: boolean }>`
  width: ${(props) => (props.$isCollapsed ? "80px" : "280px")};
  
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 20;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    transform: ${(props) => (props.$isCollapsed ? "translateX(-100%)" : "translateX(0)")};
    width: 280px;
  }
`
 
const SidebarNav = styled.nav`
  flex: 1;
  padding: 24px 0;
  overflow-y: auto;
`

const SidebarCategory = styled.div`
 
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 7px;
`

const SidebarCategoryHeader = styled.h3<{ $isCollapsed: boolean }>`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.1em;
 
  padding: 0 24px;
  display: ${(props) => (props.$isCollapsed ? "none" : "block")};
`

const SidebarMenuItem = styled.div<{ $active: boolean; $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${(props) => (props.$isCollapsed ? "12px" : "8px 24px")};
  color: ${(props) => (props.$active ? "#000000" : "#d0d2d6")};
  background: ${(props) => (props.$active ? "#f3f4f6" : "transparent")};
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  font-size: 14px;
  border-radius: 12px;
  cursor: pointer;
  font-family: 'ProximaNova-Italic', sans-serif;
  transition: all 0.2s;
   
  justify-content: ${(props) => (props.$isCollapsed ? "center" : "flex-start")};

  &:hover {
    background: #f9fafb;
    color: #374151;
  }

  .menu-text {
    display: ${(props) => (props.$isCollapsed ? "none" : "block")};
    margin: 0;
    font-size: 14px;
    font-weight: inherit;
  }
`

const SidebarDivider = styled.div<{ $isCollapsed: boolean }>`
  height: 1px;
  background: #232423;
  margin: 16px ${(props) => (props.$isCollapsed ? "12px" : "24px")};
`

const menuCategories = [
  {
    id: "core",
    label: "Análises e Estatísticas",
    icon: Gauge,
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "convites", label: "Convites", icon: UserPlus },
      { id: "estadisticas", label: "Estatísticas", icon: BarChart3 },
       { id: "observability", label: "Observar o core", icon: Microchip },
    ],
  },
  {
    id: "monetization",
    label: "Monetização",
    icon: Coins,
    items: [
      { id: "overview-monetization", label: "Visão geral", icon: CircleDotDashed },
      { id: "monetization-analytics", label: "Análises", icon: ChartArea },
      { id: "monetization-creators", label: "Creators - monetização", icon: Coins },
      { id: "monetization-withdrawals", label: "Registro de retiradas", icon: Banknote },
    ],
  },
  {
    id: "walletvision",
    label: "Carteira",
    icon: Wallet,
    items: [
      { id: "overview-wallet", label: "Visão geral das carteiras", icon: Wallet },
      { id: "transactions-wallet", label: "Transações", icon: ArrowLeftCircle },
      { id: "users-wallet", label: "Usuários", icon: UsersRound },
      { id: "audit-wallet", label: "Auditoria", icon: ShieldHalf },
      { id: "validators-users", label: "Stakings rodando", icon: TrendingUp },
      { id: "validators-staking", label: "Validadores", icon: Gem },
      { id: "staking-wallet", label: "Visão geral staking", icon: CircleDotDashed },
    ],
  },
  {
    id: "marketplace",
    label: "Marketplace",
    icon: Store,
    items: [
      { id: "overview-marketplace", label: "Visão geral do mercado", icon: CircleDotDashed },
      { id: "marketplace-cases", label: "Abertura de caixas", icon: Box },
      { id: "marketplace-transactions", label: "Transações rodando", icon: ArrowBigRight },
      { id: "marketplace-upgrades", label: "Upgrades rodando", icon: Swords },
    ],
  },
  {
    id: "checkout",
    label: "Pagamentos",
    icon: Store,
    items: [
      { id: "overview-checkout", label: "Visão geral de pagamentos", icon: CircleDotDashed },
      { id: "checkout-analystic", label: "Analisar pagamentos", icon: ChartLine },
      { id: "checkout-sessions", label: "Sessões de pagamentos", icon: Shell },
      { id: "checkout-transactions", label: "Transações feitas", icon: Banknote },
    ],
  },
  {
    id: "users",
    label: "Gerenciamento",
    icon: UserCheck,
    items: [
      { id: "manager", label: "Gerenciar contas", icon: Users },
      { id: "adesao", label: "Permissões", icon: IndentDecrease },
      { id: "security-audit", label: "Auditoria battlepass", icon: AlertTriangle },
      { id: "codigobits", label: "Código Bits", icon: Code },
    ],
  },
  {
    id: "products",
    label: "Produtos & Serviços",
    icon: UserCheck,
    items: [
      { id: "advertising", label: "Publicidade", icon: Cone },

 
    ],
  },
  {
    id: "management",
    label: "Moderação",
    icon: Shield,
    items: [
      { id: "content-audit", label: "Auditoria de conteúdo", icon: Eye },
      { id: "post-management", label: "Moderação de mídia", icon: ImageIcon },
      { id: "comment-management", label: "Comentários", icon: MessageSquare },
      { id: "content", label: "Moderação do conteúdo", icon: FileCheck },
    ],
  },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { isCollapsed, isMobile } = useSidebar()

  return (
    <SidebarContainer $isCollapsed={isCollapsed} $isMobile={isMobile}>
  

      <SidebarNav>
        {menuCategories.map((category, categoryIndex) => (
          <SidebarCategory key={category.id}>
            <SidebarCategoryHeader $isCollapsed={isCollapsed}>{category.label}</SidebarCategoryHeader>

            {category.items.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <SidebarMenuItem
                  key={item.id}
                  $active={isActive}
                  $isCollapsed={isCollapsed}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon size={16} />
                  <h4 className="menu-text">{item.label}</h4>
                </SidebarMenuItem>
              )
            })}

            {categoryIndex < menuCategories.length - 1 && <SidebarDivider $isCollapsed={isCollapsed} />}
          </SidebarCategory>
        ))}
      </SidebarNav>
    </SidebarContainer>
  )
}
