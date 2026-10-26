"use client"

import styled from "styled-components"
import type React from "react"
import { useState, useEffect } from "react"
import type { User } from "@/types/user/searchall"
import axios from "axios"
import { decrypt } from "@/core/security/encryption"
import moment from "moment-timezone"
import Image from "next/image"
import Banformuser from "../ax/ban.formuser"
import Postsmanager from "./posts"
import Logo from "@/public/nvrp/20221102_165951.jpg"
import NotificationUI from "@club/components/notification/card.mnc"
import Infoclauser from "./infouser.cla"
import { useRouter } from "next/router"
import Billing from "@/club/.prime/customers/charges.prime"
import MonetizationPage from "@/wallet/monetization/overview"
import Ivnetoru from "../ac/inventory"
import { WalletApp } from "@/wallet/kop"
import IsecurityPage from "@/wallet/security/isecurity"
import ReedemCode from "../ac/tokens.history"
import ClubVip from "@/club/.level/clubvip"
import {
  UserIcon,
  Mail,
  Calendar,
  Shield,
  Crown,
  Users,
  Activity,
  Clock,
  Settings,
  CreditCard,
  Wallet,
  DollarSign,
  Package,
  Lock,
  Cable,
  Gem,
  Ticket,
  Target,
  Fingerprint,
  Ban,
  FileText,
  Trash2,
  Eye,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface Props {
  userId: React.ReactNode
}

interface Unic {
  acessmanager: boolean
  userId: React.ReactNode
}

interface UserData {
  name: string
  id: string
  avatar: string
}

interface History {
  id: string
  _id: string
  guild_id: string
  member_id: string
  reason: string
  type: string
  created_at: number
}

export default function InfoUser({ userId, acessmanager }: Unic) {
  const router = useRouter()
  const [usersList, setUsersList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [activeSubTab, setActiveSubTab] = useState("")
  const [abhistory, setabhistoty] = useState<History[]>([])
  const [deleteStatus, setDeleteStatus] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/_v4/rik/view.history?userId=${userId}`)
      const data = await response.json()  as any;
      setabhistoty(data)
    } catch (error) {
      console.error("Error fetching user history:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/_v4/Q1_nvxre?userId=${userId}`)
      const dataw = decrypt(response.data)
      const parsedDataw = JSON.parse(dataw)

      const usersWithReformInfo = await Promise.all(
        parsedDataw.map(async (user: User) => {
          try {
            const reformResponse = await axios.get(`/api/autentic/xyloQuerierAPI?userId=${userId}`)
            const datawre = decrypt(reformResponse.data.log)
            const reformInfo = JSON.parse(datawre)
            return { ...user, reform: reformInfo }
          } catch (error) {
            console.error("Error fetching user info:", error)
            return user
          }
        }),
      )

      const sortedUsers = usersWithReformInfo.sort((a: User, b: User) => a.name.localeCompare(b.name))
      setUsersList(sortedUsers)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchUsers()
    await fetchHistory()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleDeletehistory = async (_id: string) => {
    const webhookUrl =
      "https://discord.com/api/webhooks/1238599869141356674/2F0_ongHJP29xiXH11Ch6jhKUMMe1GTxTVaQyRnvNb2_Wx7IgxvGwN2qpUyI5zjtnMEI"

    const embed = {
      icon_url: "https://i.imgur.com/85XgJlr.png",
      title: "🔔 REGISTRO ADMIN",
      description: "Para análise. <@&1043283893438140497>",
      fields: [
        { name: "```🔍 ID do usuário ```", value: userId },
        { name: "```ID Histórico: ```", value: `${_id}` },
      ],
      footer: {
        text: "Powered by novision",
        icon_url: "https://i.imgur.com/85XgJlr.png",
      },
    }

    const formDataWebhook = new FormData()
    formDataWebhook.append("payload_json", JSON.stringify({ embeds: [embed] }))

    await fetch(webhookUrl, { method: "POST", body: formDataWebhook })

    try {
      await axios.delete(`/api/_v4/rik/del.history?id=${_id}`)
      fetchHistory()
    } catch (error) {
      console.error("Error deleting historico:", error)
    }
  }

  const handleDeleteAccount = async () => {
    const webhookUrl =
      "https://discord.com/api/webhooks/1238599038954111156/oGOs_eoBsSJOwaOvFBszgHsVOjMCWG-sLalIioQ-izLqddWCXs8EYg2Xdk45lUSFKqAA"

    const embed = {
      icon_url: "https://i.imgur.com/85XgJlr.png",
      title: "🔔 REGISTRO ADMIN",
      description: "Para análise. <@&1043283893438140497>",
      fields: [{ name: "```🔍 ID do usuário ```", value: userId }],
      footer: {
        text: "Powered by novision",
        icon_url: "https://i.imgur.com/85XgJlr.png",
      },
    }

    const formDataWebhook = new FormData()
    formDataWebhook.append("payload_json", JSON.stringify({ embeds: [embed] }))

    await fetch(webhookUrl, { method: "POST", body: formDataWebhook })

    try {
      setDeleteStatus("Aguarde até que a conta seja apagada...")
      const deleteResponse = await axios.delete(`/api/_v4/profile_trash?userId=${userId}`)
      await axios.post(`/api/_v4/profile_trash?userId=${userId}`)
      setDeleteStatus(deleteResponse.data.message)
      fetchUsers()
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error("Error deleting Account:", error)
      setDeleteStatus("Problema ao excluir a conta")
    }
  }

  const exportUserData = () => {
    const user = usersList[0]
    if (!user) return

    const csvContent = [
      ["Campo", "Valor"],
      ["Nome", user.name],
      ["Email", user.email],
      ["ID", user.id],
      ["Primeiro Login", moment(user.firstLoginDate).format("DD/MM/YYYY HH:mm")],
      ["Verificado", user.reforms?.verified ? "Sim" : "Não"],
      ["Prime", user.reforms?.prime ? "Sim" : "Não"],
      ["Admin", user.reforms?.nvxre ? "Sim" : "Não"],
      ["Clã", user.cla?.namecla || "Sem clã"],
      ["Total de Histórico", abhistory.length.toString()],
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `usuario-${user.name}-${moment().format("YYYY-MM-DD")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  useEffect(() => {
    fetchUsers()
    fetchHistory()
  }, [])

  const InvitedUsers = ({ userId }: Props) => {
    const [userDataList, setUserDataList] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetchGuestData = async () => {
        try {
          const response = await fetch(`/api/nvxre/inviteds?userId=${userId}`)
          if (response.ok) {
            const data = await response.json()  as any;
            if (data.guests && data.guests.length > 0) {
              const userDataPromises = data.guests.map(async (guest: { Iduser: any }) => {
                const userInfoResponse = await fetch(`/api/nvxre/codeims/proInvinted?userId=${guest.Iduser}`)
                if (userInfoResponse.ok) {
                  return await userInfoResponse.json()
                }
                return null
              })

              const userDataResults = await Promise.all(userDataPromises)
              const filteredUserData = userDataResults.filter((userData) => userData !== null)
              setUserDataList(filteredUserData)
            } else {
              setUserDataList([])
            }
          }
        } catch (error) {
          console.error("Error loading invited users:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchGuestData()
    }, [userId])

    return (
      <FriendsSection>
        <SectionHeader>
          <SectionTitle>
            <Users size={20} />
            Amigos Convidados
          </SectionTitle>
          <SectionBadge>{userDataList.length} usuários</SectionBadge>
        </SectionHeader>

        {loading ? (
          <LoadingGrid>
            {[...Array(3)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </LoadingGrid>
        ) : userDataList.length > 0 ? (
          <FriendsGrid>
            {userDataList.map((userData) => (
              <FriendCard key={userData.id}>
                <FriendAvatar>
                  <Image
                    src={userData.avatar || "/placeholder.svg?height=50&width=50"}
                    alt={userData.name}
                    height={50}
                    width={50}
                  />
                </FriendAvatar>
                <FriendInfo>
                  <FriendName>{userData.name}</FriendName>
                  <FriendId>ID: {userData.id}</FriendId>
                </FriendInfo>
              </FriendCard>
            ))}
          </FriendsGrid>
        ) : (
          <EmptyState>
            <Users size={48} color="#9ca3af" />
            <EmptyTitle>Nenhum amigo convidado</EmptyTitle>
            <EmptyDescription>Este usuário ainda não convidou nenhum amigo para a plataforma</EmptyDescription>
          </EmptyState>
        )}
      </FriendsSection>
    )
  }

  const renderManagementSubTabs = (user: User) => {
    const managementOptions = [
      { id: "billing", label: "Cobranças & Pagamentos", icon: CreditCard, adminOnly: true },
      { id: "wallet", label: "Carteira Walletvision", icon: Wallet, adminOnly: true },
      { id: "monetization", label: "Monetização", icon: DollarSign, adminOnly: true },
      { id: "inventory", label: "Inventário & TVL", icon: Package, adminOnly: false },
      { id: "security", label: "Isecurity", icon: Lock, adminOnly: false },
      { id: "connections", label: "Contas Conectadas", icon: Cable, adminOnly: false },
      { id: "vip", label: "VIP Club", icon: Gem, adminOnly: false },
      { id: "tokens", label: "Token Virtual Listed", icon: Package, adminOnly: false },
      { id: "redeemed", label: "Códigos Resgatados", icon: Ticket, adminOnly: false },
      { id: "clan-info", label: "Informações do Clã", icon: Target, adminOnly: false },
      { id: "assets", label: "Ativos", icon: Fingerprint, adminOnly: false },
      { id: "ban-form", label: "Formulário de Ban", icon: Ban, adminOnly: true },
      { id: "posts", label: "Gerenciar Posts", icon: FileText, adminOnly: true },
      { id: "delete", label: "Excluir Conta", icon: Trash2, adminOnly: true },
    ]

    return (
      <ManagementContainer>
        <ManagementSidebar>
          <SidebarHeader>
            <SidebarTitle>Opções de Gerenciamento</SidebarTitle>
            <SidebarDescription>Selecione uma opção para gerenciar o usuário</SidebarDescription>
          </SidebarHeader>
          <SidebarOptions>
            {managementOptions.map((option) => {
              if (option.adminOnly && !acessmanager) return null
              const Icon = option.icon
              return (
                <SidebarOption
                  key={option.id}
                  active={activeSubTab === option.id}
                  onClick={() => setActiveSubTab(option.id)}
                  disabled={option.adminOnly && !acessmanager}
                >
                  <Icon size={16} />
                  {option.label}
                  {option.adminOnly && <AdminBadge>Admin</AdminBadge>}
                </SidebarOption>
              )
            })}
          </SidebarOptions>
        </ManagementSidebar>

        <ManagementContent>
          {activeSubTab === "billing" && (
            <ContentSection>
              <ContentHeader>
                <CreditCard size={24} color="#35bb6d" />
                <div>
                  <ContentTitle>Cobranças & Pagamentos</ContentTitle>
                  <ContentDescription>Gerenciar pagamentos e faturas do usuário</ContentDescription>
                </div>
              </ContentHeader>
              <Billing email={user.email} userId={user.id} />
            </ContentSection>
          )}

          {activeSubTab === "wallet" && (
            <ContentSection>
              <ContentHeader>
                <Wallet size={24} color="#35bb6d" />
                <div>
                  <ContentTitle>Carteira Walletvision</ContentTitle>
                  <ContentDescription>Visualizar saldo e transações da carteira</ContentDescription>
                </div>
              </ContentHeader>
              <WalletApp
                mobile={false}
                id={user.id}
                avatar={user.avatar}
                username={user.name}
                discriminator={"Admin"}
              />
            </ContentSection>
          )}

          {activeSubTab === "monetization" && (
            <ContentSection>
              <ContentHeader>
                <DollarSign size={24} color="#35bb6d" />
                <div>
                  <ContentTitle>Monetização</ContentTitle>
                  <ContentDescription>Configurações e estatísticas de monetização</ContentDescription>
                </div>
              </ContentHeader>
              <MonetizationPage id={user.id} />
            </ContentSection>
          )}

          {activeSubTab === "inventory" && (
            <ContentSection>
              <ContentHeader>
                <Package size={24} color="#35bb6d" />
                <div>
                  <ContentTitle>Inventário & TVL</ContentTitle>
                  <ContentDescription>Itens do inventário e valor total bloqueado</ContentDescription>
                </div>
              </ContentHeader>
              <Ivnetoru id={user.id} username={user.name} />
            </ContentSection>
          )}

          {activeSubTab === "security" && (
            <ContentSection>
              <ContentHeader>
                <Lock size={24} color="#35bb6d" />
                <div>
                  <ContentTitle>Isecurity</ContentTitle>
                  <ContentDescription>Configurações de segurança e autenticação</ContentDescription>
                </div>
              </ContentHeader>
              <IsecurityPage user={user} />
            </ContentSection>
          )}

          {activeSubTab === "connections" && (
            <ContentSection>
              <ContentHeader>
                <Cable size={24} color="#35bb6d" />
                <div>
                  <ContentTitle>Contas Conectadas</ContentTitle>
                  <ContentDescription>Serviços e plataformas conectadas</ContentDescription>
                </div>
              </ContentHeader>
              <ConnectionsGrid>
                {user.steam && (
                  <ConnectionCard>
                    <ConnectionIcon>
                      <img src="/icons/app/steam.png" alt="Steam" height={40} width={40} />
                    </ConnectionIcon>
                    <ConnectionInfo>
                      <ConnectionName>{user.steam.displayName}</ConnectionName>
                      <ConnectionId>
                        {user.steam.id} + {user.steam.hexid}
                      </ConnectionId>
                    </ConnectionInfo>
                    <ConnectionStatus connected>Conectado</ConnectionStatus>
                  </ConnectionCard>
                )}

                {user.twitch && (
                  <ConnectionCard>
                    <ConnectionIcon>
                      <img src="/icons/app/twitch.png" alt="Twitch" height={40} width={40} />
                    </ConnectionIcon>
                    <ConnectionInfo>
                      <ConnectionName>{user.twitch.user_nametwitch}</ConnectionName>
                      <ConnectionId>{user.twitch.user_idtwitch}</ConnectionId>
                    </ConnectionInfo>
                    <ConnectionStatus connected>Conectado</ConnectionStatus>
                  </ConnectionCard>
                )}

                {!user.steam && !user.twitch && (
                  <EmptyState>
                    <Cable size={48} color="#9ca3af" />
                    <EmptyTitle>Nenhuma conta conectada</EmptyTitle>
                    <EmptyDescription>Este usuário não possui contas externas conectadas</EmptyDescription>
                  </EmptyState>
                )}
              </ConnectionsGrid>
            </ContentSection>
          )}

          {activeSubTab === "vip" && (
            <ContentSection>
              <ContentHeader>
                <Gem size={24} color="#35bb6d" />
                <div>
                  <ContentTitle>VIP Club</ContentTitle>
                  <ContentDescription>Status e benefícios VIP do usuário</ContentDescription>
                </div>
              </ContentHeader>
              <ClubVip id={user.id} />
            </ContentSection>
          )}

          {activeSubTab === "redeemed" && (
            <ContentSection>
              <ContentHeader>
                <Ticket size={24} color="#35bb6d" />
                <div>
                  <ContentTitle>Códigos Resgatados</ContentTitle>
                  <ContentDescription>Histórico de códigos utilizados pelo usuário</ContentDescription>
                </div>
              </ContentHeader>
              <ReedemCode userId={user.id} />
            </ContentSection>
          )}

          {activeSubTab === "clan-info" && (
            <ContentSection>
              <ContentHeader>
                <Target size={24} color="#35bb6d" />
                <div>
                  <ContentTitle>Informações do Clã</ContentTitle>
                  <ContentDescription>Detalhes sobre o clã do usuário</ContentDescription>
                </div>
              </ContentHeader>
              <Infoclauser userId={user.id} />
            </ContentSection>
          )}

          {user.reforms && activeSubTab === "assets" && (
            <ContentSection>
              <ContentHeader>
                <Fingerprint size={24} color="#35bb6d" />
                <div>
                  <ContentTitle>Ativos do Usuário</ContentTitle>
                  <ContentDescription>Contratos e chaves ativas</ContentDescription>
                </div>
              </ContentHeader>
              <AssetsGrid>
                <AssetCard>
                  <AssetIcon active={user.reforms?.socioclub}>
                    <Gem size={20} />
                  </AssetIcon>
                  <AssetInfo>
                    <AssetLabel>Socio Club</AssetLabel>
                    <AssetValue active={user.reforms?.socioclub}>
                      {user.reforms?.socioclub ? "Ativado" : "Não reconhecido"}
                    </AssetValue>
                  </AssetInfo>
                </AssetCard>

                <AssetCard>
                  <AssetIcon active={user.reforms?.contractmiss}>
                    <Target size={20} />
                  </AssetIcon>
                  <AssetInfo>
                    <AssetLabel>Contrato Missões</AssetLabel>
                    <AssetValue active={user.reforms?.contractmiss}>
                      {user.reforms?.contractmiss ? "Ativado" : "Não reconhecido"}
                    </AssetValue>
                  </AssetInfo>
                </AssetCard>

                <AssetCard>
                  <AssetIcon active={user.reforms?.contractcla}>
                    <Users size={20} />
                  </AssetIcon>
                  <AssetInfo>
                    <AssetLabel>Contrato Criação de Clã</AssetLabel>
                    <AssetValue active={user.reforms?.contractcla}>
                      {user.reforms?.contractcla ? "Ativado" : "Não reconhecido"}
                    </AssetValue>
                  </AssetInfo>
                </AssetCard>

                <AssetCard>
                  <AssetIcon active={user.reforms?.contractunix}>
                    <Settings size={20} />
                  </AssetIcon>
                  <AssetInfo>
                    <AssetLabel>Contrato Univision X</AssetLabel>
                    <AssetValue active={user.reforms?.contractunix}>
                      {user.reforms?.contractunix ? "Ativado" : "Não reconhecido"}
                    </AssetValue>
                  </AssetInfo>
                </AssetCard>

                <AssetCard>
                  <AssetIcon active={user.reforms?.visiondrop}>
                    <Package size={20} />
                  </AssetIcon>
                  <AssetInfo>
                    <AssetLabel>Vision Drop</AssetLabel>
                    <AssetValue active={user.reforms?.visiondrop}>
                      {user.reforms?.visiondrop ? "Ativado" : "Não reconhecido"}
                    </AssetValue>
                  </AssetInfo>
                </AssetCard>

                <AssetCard>
                  <AssetIcon active={user.reforms?.contractax}>
                    <DollarSign size={20} />
                  </AssetIcon>
                  <AssetInfo>
                    <AssetLabel>Contrato Anti Taxa</AssetLabel>
                    <AssetValue active={user.reforms?.contractax}>
                      {user.reforms?.contractax ? "Ativado" : "Não reconhecido"}
                    </AssetValue>
                  </AssetInfo>
                </AssetCard>

                <AssetCard>
                  <AssetIcon active={user.reforms?.keyplusinvite}>
                    <Users size={20} />
                  </AssetIcon>
                  <AssetInfo>
                    <AssetLabel>Chave Invite Friend</AssetLabel>
                    <AssetValue active={user.reforms?.keyplusinvite}>
                      {user.reforms?.keyplusinvite ? "Ativado" : "Não reconhecido"}
                    </AssetValue>
                  </AssetInfo>
                </AssetCard>

                <AssetCard>
                  <AssetIcon active={user.reforms?.contractvision}>
                    <Eye size={20} />
                  </AssetIcon>
                  <AssetInfo>
                    <AssetLabel>Chave Vision</AssetLabel>
                    <AssetValue active={user.reforms?.contractvision}>
                      {user.reforms?.contractvision ? "Ativado" : "Não reconhecido"}
                    </AssetValue>
                  </AssetInfo>
                </AssetCard>

                <AssetCard>
                  <AssetIcon active={user.reforms?.keymaster}>
                    <Crown size={20} />
                  </AssetIcon>
                  <AssetInfo>
                    <AssetLabel>Chave Master</AssetLabel>
                    <AssetValue active={user.reforms?.keymaster}>
                      {user.reforms?.keymaster ? "Ativado" : "Não reconhecido"}
                    </AssetValue>
                  </AssetInfo>
                </AssetCard>
              </AssetsGrid>
            </ContentSection>
          )}

          {activeSubTab === "ban-form" && acessmanager && (
            <ContentSection>
              <ContentHeader>
                <Ban size={24} color="#ef4444" />
                <div>
                  <ContentTitle>Formulário de Ban</ContentTitle>
                  <ContentDescription>Aplicar punições ao usuário</ContentDescription>
                </div>
              </ContentHeader>
              <Banformuser userId={user.id} />
            </ContentSection>
          )}

          {activeSubTab === "posts" && acessmanager && (
            <ContentSection>
              <ContentHeader>
                <FileText size={24} color="#35bb6d" />
                <div>
                  <ContentTitle>Gerenciar Posts</ContentTitle>
                  <ContentDescription>Moderar posts e conteúdo do usuário</ContentDescription>
                </div>
              </ContentHeader>
              <Postsmanager userId={user.id} />
            </ContentSection>
          )}

          {activeSubTab === "delete" && acessmanager && (
            <ContentSection>
              <ContentHeader>
                <Trash2 size={24} color="#ef4444" />
                <div>
                  <ContentTitle>Excluir Conta</ContentTitle>
                  <ContentDescription>Remover permanentemente a conta do usuário</ContentDescription>
                </div>
              </ContentHeader>
              <DangerZone>
                <DangerCard>
                  <DangerIcon>
                    <AlertTriangle size={32} color="#ef4444" />
                  </DangerIcon>
                  <DangerContent>
                    <DangerTitle>Zona de Perigo</DangerTitle>
                    <DangerDescription>
                      Esta ação é irreversível. A conta de <strong>{user.name}</strong> será permanentemente removida do
                      sistema, incluindo todos os dados associados.
                    </DangerDescription>
                    <DangerButton onClick={() => setShowDeleteConfirm(true)}>
                      <Trash2 size={16} />
                      Excluir Conta Permanentemente
                    </DangerButton>
                  </DangerContent>
                </DangerCard>
              </DangerZone>
            </ContentSection>
          )}

          {!activeSubTab && (
            <EmptyManagementState>
              <Settings size={64} color="#9ca3af" />
              <EmptyTitle>Selecione uma opção</EmptyTitle>
              <EmptyDescription>Escolha uma das opções de gerenciamento na barra lateral para começar</EmptyDescription>
            </EmptyManagementState>
          )}
        </ManagementContent>
      </ManagementContainer>
    )
  }

  const renderTabContent = (user: User) => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewContent>
            <StatsGrid>
              <StatCard>
                <StatIcon>
                  <Calendar size={24} color="#35bb6d" />
                </StatIcon>
                <StatInfo>
                  <StatLabel>Primeiro Login</StatLabel>
                  <StatValue>{moment(user.firstLoginDate).format("DD/MM/YYYY HH:mm")}</StatValue>
                </StatInfo>
              </StatCard>

              <StatCard>
                <StatIcon>
                  <Shield size={24} color="#10b981" />
                </StatIcon>
                <StatInfo>
                  <StatLabel>Status de Verificação</StatLabel>
                  <StatValue>{user.reforms?.verified ? "Verificado" : "Não Verificado"}</StatValue>
                </StatInfo>
              </StatCard>

              <StatCard>
                <StatIcon>
                  <Crown size={24} color="#f59e0b" />
                </StatIcon>
                <StatInfo>
                  <StatLabel>Status Prime</StatLabel>
                  <StatValue>{user.reforms?.prime ? "Ativo" : "Inativo"}</StatValue>
                </StatInfo>
              </StatCard>

              <StatCard>
                <StatIcon>
                  <Users size={24} color="#8b5cf6" />
                </StatIcon>
                <StatInfo>
                  <StatLabel>Clã</StatLabel>
                  <StatValue>{user.cla?.namecla || "Sem clã"}</StatValue>
                </StatInfo>
              </StatCard>
            </StatsGrid>

            <RecentActivity>
              <SectionHeader>
                <SectionTitle>
                  <Activity size={20} />
                  Atividade Recente
                </SectionTitle>
                <SectionBadge>{abhistory.length} registros</SectionBadge>
              </SectionHeader>

              {abhistory.length === 0 ? (
                <EmptyState>
                  <Clock size={48} color="#9ca3af" />
                  <EmptyTitle>Nenhuma atividade recente</EmptyTitle>
                  <EmptyDescription>Este usuário não possui atividades registradas no sistema</EmptyDescription>
                </EmptyState>
              ) : (
                <ActivityList>
                  {abhistory.slice(0, 5).map((history) => (
                    <ActivityItem key={history._id}>
                      <ActivityIcon>
                        <Image src={Logo || "/placeholder.svg?height=32&width=32"} alt="" height={32} width={32} />
                      </ActivityIcon>
                      <ActivityContent>
                        <ActivityType>{history.type}</ActivityType>
                        <ActivityTime>{moment(history.created_at).fromNow()}</ActivityTime>
                        <ActivityId>ID: {history._id}</ActivityId>
                      </ActivityContent>
                      {acessmanager && (
                        <ActivityActions>
                          <ActionButton onClick={() => handleDeletehistory(history._id)}>
                            <Trash2 size={14} />
                          </ActionButton>
                        </ActivityActions>
                      )}
                    </ActivityItem>
                  ))}
                </ActivityList>
              )}
            </RecentActivity>

            <InvitedUsers userId={user.id} />
          </OverviewContent>
        )

      case "details":
        return (
          <DetailsContent>
            <DetailsGrid>
              <DetailCard>
                <DetailIcon>
                  <UserIcon size={20} color="#35bb6d" />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Nome Completo</DetailLabel>
                  <DetailValue>{user.name}</DetailValue>
                </DetailContent>
              </DetailCard>

              <DetailCard>
                <DetailIcon>
                  <Mail size={20} color="#35bb6d" />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Email</DetailLabel>
                  <DetailValue>{user.email}</DetailValue>
                </DetailContent>
              </DetailCard>

              <DetailCard>
                <DetailIcon>
                  <Fingerprint size={20} color="#35bb6d" />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>ID do Usuário</DetailLabel>
                  <DetailValue>{user.id}</DetailValue>
                </DetailContent>
              </DetailCard>

              <DetailCard>
                <DetailIcon>
                  <Shield size={20} color={user.reforms?.type ? "#10b981" : "#ef4444"} />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Status de Autorização</DetailLabel>
                  <DetailValue>{user.reforms?.type ? "AUTORIZADO" : "NÃO AUTORIZADO"}</DetailValue>
                </DetailContent>
              </DetailCard>

              <DetailCard>
                <DetailIcon>
                  <Cable size={20} color="#35bb6d" />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Conexões Ativas</DetailLabel>
                  <DetailValue>
                    {[
                      user.reforms?.type && "NoVision",
                      user.steam?.displayName && "Steam",
                      user.twitch?.user_nametwitch && "Twitch",
                    ]
                      .filter(Boolean)
                      .join(", ") || "Nenhuma"}
                  </DetailValue>
                </DetailContent>
              </DetailCard>

              <DetailCard>
                <DetailIcon>
                  <Fingerprint size={20} color={user.reforms?.nvxre ? "#10b981" : "#6b7280"} />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Membro Desenvolvedor</DetailLabel>
                  <DetailValue>{user.reforms?.nvxre ? "Sim" : "Não"}</DetailValue>
                </DetailContent>
              </DetailCard>

              <DetailCard>
                <DetailIcon>
                  <CheckCircle size={20} color={user.reforms?.verified ? "#10b981" : "#6b7280"} />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Verificação</DetailLabel>
                  <DetailValue>{user.reforms?.verified ? "Usuário verificado" : "Usuário não verificado"}</DetailValue>
                </DetailContent>
              </DetailCard>

              <DetailCard>
                <DetailIcon>
                  <Shield size={20} color={user.reforms?.nvxre ? "#8b5cf6" : "#6b7280"} />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Administração</DetailLabel>
                  <DetailValue>
                    {user.reforms?.nvxre ? "Membro da administração TheNoVision" : "Não é membro da administração"}
                  </DetailValue>
                </DetailContent>
              </DetailCard>

              <DetailCard>
                <DetailIcon>
                  <Users size={20} color={user.cla ? "#10b981" : "#6b7280"} />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Proprietário de Clã</DetailLabel>
                  <DetailValue>
                    {user.cla
                      ? user.cla.userId === user.cla.userId
                        ? `Proprietário de clã - ${user.cla.namecla}`
                        : "Não é proprietário de clã"
                      : "Não possui clã"}
                  </DetailValue>
                </DetailContent>
              </DetailCard>

              <DetailCard>
                <DetailIcon>
                  <Activity size={20} color={user.modlog?.member_id ? "#ef4444" : "#10b981"} />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Histórico de Punições</DetailLabel>
                  <DetailValue>
                    {user.modlog && user.modlog.member_id ? "Usuário com punições" : "Usuário sem punições"}
                  </DetailValue>
                </DetailContent>
              </DetailCard>

              <DetailCard>
                <DetailIcon>
                  <Users size={20} color="#35bb6d" />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Usuários Convidados</DetailLabel>
                  <DetailValue>{user.GuestUser || "Nenhum convidado"}</DetailValue>
                </DetailContent>
              </DetailCard>
            </DetailsGrid>
          </DetailsContent>
        )

      case "history":
        return (
          <HistoryContent>
            <HistoryHeader>
              <SectionTitle>
                <Clock size={20} />
                Histórico Completo
              </SectionTitle>
              <SectionBadge>{abhistory.length} registros</SectionBadge>
            </HistoryHeader>

            {abhistory.length === 0 ? (
              <EmptyState>
                <Clock size={48} color="#9ca3af" />
                <EmptyTitle>Nenhum histórico encontrado</EmptyTitle>
                <EmptyDescription>Este usuário não possui registros de atividade no sistema</EmptyDescription>
              </EmptyState>
            ) : (
              <HistoryList>
                {abhistory.map((history) => (
                  <HistoryCard key={history._id}>
                    <HistoryCardHeader>
                      <HistoryIcon>
                        <Image src={Logo || "/placeholder.svg?height=40&width=40"} alt="" height={40} width={40} />
                      </HistoryIcon>
                      <HistoryMeta>
                        <HistoryType>{history.type}</HistoryType>
                        <HistoryTime>{moment(history.created_at).format("DD/MM/YYYY HH:mm")}</HistoryTime>
                      </HistoryMeta>
                      {acessmanager && (
                        <HistoryActions>
                          <ActionButton onClick={() => handleDeletehistory(history._id)}>
                            <Trash2 size={14} />
                          </ActionButton>
                        </HistoryActions>
                      )}
                    </HistoryCardHeader>

                    <HistoryDetails>
                      <HistoryDetail>
                        <Fingerprint size={14} />
                        <span>ID Log: {history._id}</span>
                      </HistoryDetail>
                      <HistoryDetail>
                        <UserIcon size={14} />
                        <span>Discord ID: {history.member_id}</span>
                      </HistoryDetail>
                    </HistoryDetails>

                    {history.reason && (
                      <HistoryReason>
                        <strong>Motivo:</strong> {history.reason}
                      </HistoryReason>
                    )}
                  </HistoryCard>
                ))}
              </HistoryList>
            )}
          </HistoryContent>
        )

      case "management":
        return renderManagementSubTabs(user)

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Carregando informações do usuário...</LoadingText>
      </LoadingContainer>
    )
  }

  return (
    <Container>
      {deleteStatus && <NotificationUI message={deleteStatus} />}

      {usersList.map((user) => (
        <UserProfileContainer key={user.id}>
          <UserHeader>
            <UserBanner bannerUrl={user.reforms?.bannerfundo || ""}>
              <BannerOverlay />
              <UserAvatar>
                <Image
                  src={user.avatar || "/placeholder.svg?height=120&width=120"}
                  alt={user.name}
                  width={120}
                  height={120}
                />
                <AvatarBorder />
              </UserAvatar>
            </UserBanner>

            <UserInfo>
              <UserBasicInfo>
                <UserName>{user.name}</UserName>
                <UserEmail>{user.email}</UserEmail>
                <UserBadges>
                  {user.reforms?.verified && <Badge type="verified">Verificado</Badge>}
                  {user.reforms?.prime && <Badge type="prime">Prime</Badge>}
                  {user.reforms?.nvxre && <Badge type="admin">Admin</Badge>}
                  {user.cla && <Badge type="clan">Clã: {user.cla.namecla}</Badge>}
                </UserBadges>
              </UserBasicInfo>
              <UserActions>
                <ActionButton onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                  Atualizar
                </ActionButton>
                <ActionButton onClick={exportUserData}>
                  <Download size={16} />
                  Exportar
                </ActionButton>
              </UserActions>
            </UserInfo>
          </UserHeader>

          <TabNavigation>
            <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
              <Activity size={16} />
              Visão Geral
            </TabButton>

            <TabButton active={activeTab === "details"} onClick={() => setActiveTab("details")}>
              <UserIcon size={16} />
              Detalhes
            </TabButton>

            <TabButton active={activeTab === "history"} onClick={() => setActiveTab("history")}>
              <Clock size={16} />
              Histórico
            </TabButton>

            <TabButton
              active={activeTab === "management"}
              onClick={() => {
                setActiveTab("management")
                setActiveSubTab("")
              }}
            >
              <Settings size={16} />
              Gerenciamento
            </TabButton>
          </TabNavigation>

          <TabContent>{renderTabContent(user)}</TabContent>

          {showDeleteConfirm && (
            <ConfirmModal>
              <ConfirmCard>
                <ConfirmHeader>
                  <AlertTriangle size={32} color="#ef4444" />
                  <ConfirmTitle>Confirmar Exclusão</ConfirmTitle>
                </ConfirmHeader>
                <ConfirmMessage>
                  Tem certeza que deseja excluir permanentemente a conta de <strong>{user.name}</strong>?
                  <br />
                  <br />
                  Esta ação não pode ser desfeita e todos os dados do usuário serão removidos do sistema.
                </ConfirmMessage>
                <ConfirmActions>
                  <ConfirmButton danger onClick={handleDeleteAccount}>
                    <Trash2 size={16} />
                    Excluir Conta
                  </ConfirmButton>
                  <ConfirmButton onClick={() => setShowDeleteConfirm(false)}>Cancelar</ConfirmButton>
                </ConfirmActions>
              </ConfirmCard>
            </ConfirmModal>
          )}
        </UserProfileContainer>
      ))}
    </Container>
  )
}

// Styled Components
const Container = styled.div`
  padding: 24px;
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 16px;
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #35bb6d;
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

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0;
`

const UserProfileContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const UserHeader = styled.div`
  position: relative;
`

const UserBanner = styled.div<{ bannerUrl: string }>`
  height: 200px;
  background: ${(props) =>
    props.bannerUrl
      ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('${props.bannerUrl}')`
      : "linear-gradient(135deg, #35bb6d 0%, #8b5cf6 100%)"};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 24px;
  position: relative;
`

const BannerOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
`

const UserAvatar = styled.div`
  position: relative;
  z-index: 2;

  img {
    border-radius: 50%;
    border: 4px solid #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`

const AvatarBorder = styled.div`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #35bb6d, #8b5cf6);
  z-index: -1;
`

const UserInfo = styled.div`
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

const UserBasicInfo = styled.div`
  flex: 1;
`

const UserName = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
`

const UserEmail = styled.p`
  color: #6b7280;
  margin: 0 0 16px 0;
  font-size: 16px;
`

const UserBadges = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const Badge = styled.span<{ type: "verified" | "prime" | "admin" | "clan" }>`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${(props) => {
    switch (props.type) {
      case "verified":
        return `
          background-color: #dcfce7;
          color: #166534;
        `
      case "prime":
        return `
          background-color: #fef3c7;
          color: #92400e;
        `
      case "admin":
        return `
          background-color: #f3e8ff;
          color: #7c3aed;
        `
      case "clan":
        return `
          background-color: #dbeafe;
          color: #1e40af;
        `
      default:
        return `
          background-color: #f3f4f6;
          color: #6b7280;
        `
    }
  }}
`

const UserActions = styled.div`
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

const TabNavigation = styled.div`
  display: flex;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
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
  white-space: nowrap;
  font-family: "Inter", sans-serif;

  &:hover {
    color: ${(props) => (props.active ? "#35bb6d" : "#374151")};
    background-color: rgba(59, 130, 246, 0.05);
  }
`

const TabContent = styled.div`
  padding: 24px;
`

const OverviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`

const StatCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
`

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StatInfo = styled.div`
  flex: 1;
`

const StatLabel = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 4px 0;
  font-weight: 500;
`

const StatValue = styled.p`
  color: #1f2937;
  font-weight: 600;
  margin: 0;
  font-size: 16px;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
  font-family: "Inter", sans-serif;
`

const SectionBadge = styled.span`
  background-color: #f3f4f6;
  color: #6b7280;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`

const RecentActivity = styled.div``

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`

const ActivityIcon = styled.div`
  img {
    border-radius: 50%;
  }
`

const ActivityContent = styled.div`
  flex: 1;
`

const ActivityType = styled.p`
  color: #1f2937;
  font-weight: 600;
  margin: 0 0 4px 0;
  font-size: 14px;
`

const ActivityTime = styled.p`
  color: #6b7280;
  font-size: 12px;
  margin: 0 0 2px 0;
`

const ActivityId = styled.p`
  color: #9ca3af;
  font-size: 11px;
  margin: 0;
  font-family: "Monaco", "Menlo", monospace;
`

const ActivityActions = styled.div`
  display: flex;
  gap: 8px;
`

const FriendsSection = styled.div``

const FriendsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`

const FriendCard = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    transform: translateY(-1px);
  }
`

const FriendAvatar = styled.div`
  img {
    border-radius: 50%;
  }
`

const FriendInfo = styled.div`
  flex: 1;
`

const FriendName = styled.p`
  color: #1f2937;
  font-weight: 600;
  margin: 0 0 4px 0;
  font-size: 14px;
`

const FriendId = styled.p`
  color: #6b7280;
  font-size: 12px;
  margin: 0;
  font-family: "Monaco", "Menlo", monospace;
`

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`

const LoadingCard = styled.div`
  height: 80px;
  background-color: #f3f4f6;
  border-radius: 8px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
`

const EmptyTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 16px 0 8px 0;
  font-family: "Inter", sans-serif;
`

const EmptyDescription = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
`

const DetailsContent = styled.div``

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 16px;
`

const DetailCard = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`

const DetailIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const DetailContent = styled.div`
  flex: 1;
`

const DetailLabel = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 4px 0;
  font-weight: 500;
`

const DetailValue = styled.p`
  color: #1f2937;
  font-weight: 600;
  margin: 0;
  font-size: 14px;
  word-break: break-all;
`

const HistoryContent = styled.div``

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const HistoryCard = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
`

const HistoryCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`

const HistoryIcon = styled.div`
  img {
    border-radius: 50%;
  }
`

const HistoryMeta = styled.div`
  flex: 1;
`

const HistoryType = styled.p`
  color: #1f2937;
  font-weight: 600;
  margin: 0 0 4px 0;
  font-size: 16px;
`

const HistoryTime = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0;
`

const HistoryActions = styled.div`
  display: flex;
  gap: 8px;
`

const HistoryDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`

const HistoryDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;

  span {
    font-family: "Monaco", "Menlo", monospace;
  }
`

const HistoryReason = styled.div`
  background-color: #ffffff;
  padding: 12px;
  border-radius: 6px;
  color: #1f2937;
  font-size: 14px;
  border-left: 3px solid #35bb6d;
`

const ManagementContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  min-height: 600px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const ManagementSidebar = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  height: fit-content;
`

const SidebarHeader = styled.div`
  margin-bottom: 20px;
`

const SidebarTitle = styled.h3`
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  font-family: "Inter", sans-serif;
`

const SidebarDescription = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
`

const SidebarOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const SidebarOption = styled.button<{ active: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background-color: ${(props) => (props.active ? "#dbeafe" : "transparent")};
  border: 1px solid ${(props) => (props.active ? "#35bb6d" : "transparent")};
  border-radius: 6px;
  color: ${(props) => (props.active ? "#1e40af" : props.disabled ? "#9ca3af" : "#374151")};
  font-size: 14px;
  font-weight: 500;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  text-align: left;
  font-family: "Inter", sans-serif;

  &:hover {
    background-color: ${(props) => (props.disabled ? "transparent" : props.active ? "#dbeafe" : "#f3f4f6")};
    color: ${(props) => (props.disabled ? "#9ca3af" : props.active ? "#1e40af" : "#1f2937")};
  }
`

const AdminBadge = styled.span`
  margin-left: auto;
  background-color: #fef3c7;
  color: #92400e;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
`

const ManagementContent = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`

const ContentSection = styled.div`
  padding: 24px;
  height: 100%;
  overflow-y: auto;
`

const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`

const ContentTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1f2937;
  font-family: "Inter", sans-serif;
`

const ContentDescription = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 14px;
`

const EmptyManagementState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
  padding: 48px;
`

const ConnectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
`

const ConnectionCard = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`

const ConnectionIcon = styled.div`
  img {
    border-radius: 8px;
  }
`

const ConnectionInfo = styled.div`
  flex: 1;
`

const ConnectionName = styled.p`
  color: #1f2937;
  font-weight: 600;
  margin: 0 0 4px 0;
  font-size: 14px;
`

const ConnectionId = styled.p`
  color: #6b7280;
  font-size: 12px;
  margin: 0;
  font-family: "Monaco", "Menlo", monospace;
`

const ConnectionStatus = styled.span<{ connected: boolean }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => (props.connected ? "#dcfce7" : "#fef2f2")};
  color: ${(props) => (props.connected ? "#166534" : "#dc2626")};
`

const AssetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
`

const AssetCard = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    transform: translateY(-1px);
  }
`

const AssetIcon = styled.div<{ active: boolean }>`
  width: 40px;
  height: 40px;
  background-color: ${(props) => (props.active ? "#dcfce7" : "#f3f4f6")};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${(props) => (props.active ? "#166534" : "#6b7280")};
  }
`

const AssetInfo = styled.div`
  flex: 1;
`

const AssetLabel = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 4px 0;
  font-weight: 500;
`

const AssetValue = styled.p<{ active: boolean }>`
  color: ${(props) => (props.active ? "#166534" : "#6b7280")};
  font-weight: 600;
  margin: 0;
  font-size: 14px;
`

const DangerZone = styled.div`
  margin-top: 24px;
`

const DangerCard = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
`

const DangerIcon = styled.div``

const DangerContent = styled.div`
  flex: 1;
`

const DangerTitle = styled.h4`
  color: #dc2626;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  font-family: "Inter", sans-serif;
`

const DangerDescription = styled.p`
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
  font-size: 14px;

  strong {
    color: #1f2937;
  }
`

const DangerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Inter", sans-serif;

  &:hover {
    background-color: #b91c1c;
    transform: translateY(-1px);
  }
`

const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
`

const ConfirmCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  border: 1px solid #e5e7eb;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
`

const ConfirmHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`

const ConfirmTitle = styled.h3`
  color: #1f2937;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  font-family: "Inter", sans-serif;
`

const ConfirmMessage = styled.p`
  color: #6b7280;
  margin: 0 0 24px 0;
  line-height: 1.5;
  font-size: 14px;

  strong {
    color: #1f2937;
  }
`

const ConfirmActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`

const ConfirmButton = styled.button<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 6px;
  border: 1px solid ${(props) => (props.danger ? "#dc2626" : "#e5e7eb")};
  background-color: ${(props) => (props.danger ? "#dc2626" : "#ffffff")};
  color: ${(props) => (props.danger ? "#ffffff" : "#374151")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Inter", sans-serif;

  &:hover {
    background-color: ${(props) => (props.danger ? "#b91c1c" : "#f9fafb")};
    border-color: ${(props) => (props.danger ? "#b91c1c" : "#d1d5db")};
  }
`
