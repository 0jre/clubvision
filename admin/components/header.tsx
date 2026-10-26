"use client"

import { useEffect, useState } from "react"
import { Menu, Bell, ChevronDown } from "lucide-react"
import styled from "styled-components"
import { useSidebar } from "./sidebar-context"
import { AdminProfileModal } from "./ui/admin-profile"
import { UserData } from "@/types/user/types"
import { nvxre_checkAuthentication } from "@/hooks/checkAuthentication"

interface HeaderProps {
  activeSection: string
}

const HeaderContainer = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 32px;
  display: flex;
  font-family: 'Inter', monospace;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: black;
`

const Logo = styled.div`
 
  border-radius: 13px;
  height: 24px;
  width: 24px;
  position: relative;
  overflow: hidden;
  
`

const Dropdown = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.3em 1em;
  border: 1px solid #e5e7eb;
  border-radius: 26px;
  background: white;
 
  font-size: 11px;
  
  &:hover {
    background: #f9fafb;
  }
`

const DropdownLabel = styled.span`
  font-size: 10px;
  color: #9ca3af;
`

const DropdownValue = styled.div`
  font-weight: 600;
  color: #000000;
  font-family: 'InterSemiBold', sans-serif;
`

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: background-color 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }

  
`

const SectionTitle = styled.h1`
  font-size: 11px;
  font-weight: 600;
  color: #393d3b;
  margin: 0;
  text-transform: capitalize;

  @media (max-width: 768px) {
    display: none;
  }
`

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`

const NotificationBadge = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
`

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const ProfileName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  line-height: 1.2;
`

const ProfileRole = styled.span`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.2;
`

 

export function Header({ activeSection }: HeaderProps) {
  const { toggleSidebar } = useSidebar()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const [user, setuser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoadinguser, data } = nvxre_checkAuthentication();
  
     useEffect(() => {
      if (!isLoadinguser && data ) {
        setIsLoading(false)
        setuser(data)
      }
    }, [data,isLoadinguser])

  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      dashboard: "Dashboard",
      "user-search": "Busca de Usuários",
      manager: "Gerenciar Contas",
      convites: "Convites",
      estadisticas: "Estatísticas",
      "overview-monetization": "Visão Geral - Monetização",
      "monetization-analytics": "Análises - Monetização",
      "monetization-creators": "Creators - Monetização",
      "monetization-withdrawals": "Registro de Retiradas",
      "overview-wallet": "Visão Geral das Carteiras",
      "transactions-wallet": "Transações",
      "users-wallet": "Usuários - Carteira",
      "audit-wallet": "Auditoria",
      "validators-users": "Stakings Rodando",
      "validators-staking": "Validadores",
      "staking-wallet": "Visão Geral Staking",
      "overview-marketplace": "Visão Geral do Mercado",
      "marketplace-cases": "Abertura de Caixas",
      "marketplace-transactions": "Transações Rodando",
      "marketplace-upgrades": "Upgrades Rodando",
      "overview-checkout": "Visão Geral de Pagamentos",
      "checkout-analystic": "Analisar Pagamentos",
      "checkout-sessions": "Sessões de Pagamentos",
      "checkout-transactions": "Transações Feitas",
      adesao: "Permissões",
      "violation-tracking": "Violations & Appeals",
      codigobits: "Código Bits",
      advertising: "Publicidade",
    
      security: "Security & Audit",
      "content-audit": "Auditoria de Conteúdo",
      "post-management": "Moderação de Mídia",
      "comment-management": "Comentários",
      content: "Moderação do Conteúdo",
    }
    return titles[section] || section.replace("-", " ")
  }


  if(!user) return;

  return (
    <>
      <HeaderContainer>
        <HeaderLeft>
          <MenuButton onClick={toggleSidebar}>
            <Menu size={20} />
          </MenuButton>

          <LogoSection>
            <Logo><img src="https://i.imgur.com/38BtngZ.png" alt="noovafx" height={30} width={30} /></Logo>
            <li>
               <span className="font-['ProximaNova-Italic'] text-[12px]">Re Admin</span>
                <SectionTitle>{getSectionTitle(activeSection)}</SectionTitle>
            </li>
            

          </LogoSection>

          <Dropdown>
            <div>
              <DropdownLabel>ORGANIZAÇÃO</DropdownLabel>
              <DropdownValue>thenovision</DropdownValue>
            </div>
            <ChevronDown size={14} />
          </Dropdown>

          <Dropdown>
            <div>
              <DropdownLabel>Plataforma</DropdownLabel>
              <DropdownValue>clubvision</DropdownValue>
            </div>
            <ChevronDown size={14} />
          </Dropdown>

          <Dropdown>
            <div>
              <DropdownLabel>AMBIENTE</DropdownLabel>
               {process.env.NODE_ENV == 'production' ? <DropdownValue style={{ color: "#0bf574" }}>Produção</DropdownValue> : <DropdownValue style={{ color: "#ca2c2c" }}>Desenvolvimento</DropdownValue>}
            </div>
            <ChevronDown size={14} />
          </Dropdown>
 
         
        </HeaderLeft>

        <HeaderRight>
          {/* <IconButton>
            <Bell size={18} />
            <NotificationBadge />
          </IconButton> */}

          <ProfileButton onClick={() => setIsProfileModalOpen(true)}>
            <Avatar>{user.user.avatar.charAt(0).toUpperCase()}</Avatar>
            <ProfileInfo>
              <ProfileName>{user.user.username}</ProfileName>
              <ProfileRole>Administrator</ProfileRole>
            </ProfileInfo>
            <ChevronDown size={14} color="#9ca3af" />
          </ProfileButton>
        </HeaderRight>
      </HeaderContainer>

      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        adminData={user.user}
      />
    </>
  )
}
