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
  Microchip,
} from "lucide-react"
import {
  SidebarContainer,
  SidebarHeader,
  LogoContainer,
  LogoText,
  SidebarNav,
  SidebarCategory,
  SidebarCategoryHeader,
  SidebarMenuItem,
  SidebarDivider,
} from "./ui/styled-components"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Money, Wallet } from "iconsax-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

interface SidebarContextType {
  isCollapsed: boolean
  isMobile: boolean
  toggleSidebar: () => void
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, isMobile, toggleSidebar, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

const menuCategories = [
  {
    id: "core",
    label: "Analises e estastisticas",
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
    icon: Money,
    items: [
      { id: "overview-monetization", label: "Visão geral", icon: CircleDotDashed },
      { id: "monetization-analytics", label: "Analises", icon: ChartArea },
      { id: "monetization-creators", label: "Creators - monetização", icon: Coins },
      { id: "monetization-withdrawals", label: "registro de retiradas ", icon: Money },
    ],
  },
  {
    id: "walletvision",
    label: "Carteira",
    icon: Wallet,
    items: [
      { id: "overview-wallet", label: "Visão geral das carteiras", icon: Wallet },
      { id: "transactions-wallet", label: "Transações", icon: ArrowLeftCircle },
      { id: "users-wallet", label: "Usuarios", icon: UsersRound },
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
      { id: "marketplace-upgrades", label: "upgrades rodando", icon: Swords },
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
      { id: "violation-tracking", label: "Violations & Appeals", icon: AlertTriangle },
      { id: "codigobits", label: "Código Bits", icon: Code },
    ],
  },
  {
    id: "products-services",
    label: "Produtos & Serviços",
    icon: UserCheck,
    items: [
      { id: "advertising", label: "Publicidade", icon: Cone },
      { id: "youvision", label: "YouVision", icon: VideoIcon },
      { id: "security", label: "Security & Audit", icon: Shield },
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

function SidebarComponent({ activeSection, onSectionChange }: SidebarProps) {
  const { isCollapsed, isMobile } = useSidebar()

  return (
    <SidebarContainer $isCollapsed={isCollapsed} $isMobile={isMobile}>
      <SidebarHeader $isCollapsed={isCollapsed}>
        <LogoContainer>
          <Key size={16} color="white" />
        </LogoContainer>
        <LogoText $isCollapsed={isCollapsed}>
          <div className="title">.Re Admin</div>
          <div className="subtitle">Painel interno</div>
        </LogoText>
      </SidebarHeader>

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

export const Sidebar = SidebarComponent
