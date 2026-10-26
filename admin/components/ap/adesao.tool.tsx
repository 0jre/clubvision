"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import type * as React from "react"
import type { User } from "@/types/user/searchall"
import axios from "axios"
import { decrypt } from "@/core/security/encryption"
import NotificationUI from "@club/components/notification/card.mnc"
import Image from "next/image"

// Tipos de autorização
const authorizationTypes = [
  { value: "Authorized", label: "Autorizar Conta", color: "#10b981", icon: "fi fi-sr-shield-check" },
  { value: "Remover autorização", label: "Remover Autorização", color: "#ef4444", icon: "fi fi-sr-shield-exclamation" },
]

// Tipos de selos/roles
const roleTypes = [
  { value: "nvrp", label: "Administrador", color: "#8b5cf6", icon: "fi fi-sr-gamepad", category: "server" },
  { value: "event", label: "Event Team", color: "#f59e0b", icon: "fi fi-sr-calendar-star", category: "team" },
  { value: "support", label: "Support Team", color: "#10b981", icon: "fi fi-sr-headset", category: "team" },
  { value: "verified", label: "Verified", color: "#06b6d4", icon: "fi fi-sr-badge-check", category: "status" },
]

// Componente para autorização de contas
const AuthorizationForm = ({ onClose }: { onClose: () => void }) => {
  const [notificationMessage, setNotificationMessage] = useState("")
  const [isFormSubmittedNotification, setIsFormSubmittedNotification] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [usersList, setUsersList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const performSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const results = usersList.filter(
      (user) =>
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setSearchResults(results)
  }

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
  }

  useEffect(() => {
    performSearch()
  }, [searchQuery, usersList])

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/_v4/Q1_nvxre")
      const dataw = decrypt(response.data)
      const parsedDataw = JSON.parse(dataw)

      const usersWithReformInfo = await Promise.all(
        parsedDataw.map(async (user: User) => {
          try {
            const reformResponse = await axios.get(`/api/autentic/xyloQuerierAPI?userId=${user.reforms?.userId}`)
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
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !selectedType) return

    setIsFormSubmitted(true)

    try {
      const formData = {
        userId: selectedUser.id,
        type: selectedType,
      }

      // Webhook Discord
      const webhookUrl =
        "https://discord.com/api/webhooks/1238588424089243759/qoTsjgbn6cL2frLwsmkT4p7gQPPuNRpuweX7B7VJuP7yjSLf2F4nepjebA0fMNuLFWu5"

      const embed = {
        icon_url: "https://i.imgur.com/85XgJlr.png",
        title: "🔔 REGISTRO ADMIN",
        description: "Para análise. <@&1043283893438140497>",
        fields: [
          {
            name: "```🔍 ID do usuário ```",
            value: selectedUser.id,
          },
          {
            name: "```Registro : ```",
            value: selectedType,
          },
        ],
        footer: {
          text: "Powered by NvX.Re & Imjuliio",
          icon_url: "https://i.imgur.com/85XgJlr.png",
        },
      }

      const formDataWebhook = new FormData()
      formDataWebhook.append("payload_json", JSON.stringify({ embeds: [embed] }))

      await fetch(webhookUrl, {
        method: "POST",
        body: formDataWebhook,
      })

      // API call
      let response
      if (selectedType === "Authorized") {
        response = await fetch("/api/autentic/savere", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      } else if (selectedType === "Remover autorização") {
        response = await fetch("/api/autentic/savere", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      }

      if (response && response.status === 200) {
        setNotificationMessage("Autorização atualizada com sucesso!")
      } else {
        setNotificationMessage("Erro ao atualizar a autorização.")
      }

      setIsFormSubmittedNotification(true)
      setTimeout(() => {
        setIsFormSubmittedNotification(false)
      }, 5000)
    } catch (error) {
      setNotificationMessage("Erro ao atualizar a autorização.")
      setIsFormSubmittedNotification(true)
      setTimeout(() => {
        setIsFormSubmittedNotification(false)
      }, 5000)
    } finally {
      setIsFormSubmitted(false)
    }
  }

  return (
    <FormContainer>
      <FormHeader>
        <HeaderContent>
          <HeaderIcon className="fi fi-sr-shield-check" />
          <HeaderText>
            <HeaderTitle>Autorização de Contas</HeaderTitle>
            <HeaderDescription>Autorizar ou remover autorização de usuários</HeaderDescription>
          </HeaderText>
        </HeaderContent>
      </FormHeader>

      <FormContent onSubmit={handleSubmit}>
        {/* Busca de usuário */}
        <SearchSection>
          <SearchLabel>
            <i className="fi fi-br-search" />
            Buscar Usuário
          </SearchLabel>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Digite o nome ou ID do usuário"
          />
        </SearchSection>

        {/* Resultados da busca */}
        {searchQuery && (
          <SearchResults>
            {isLoading ? (
              <LoadingState>
                <LoadingSpinner />
                <p>Carregando usuários...</p>
              </LoadingState>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <UserCard key={user.id} onClick={() => handleSelectUser(user)} selected={selectedUser?.id === user.id}>
                  <UserAvatar>
                    <Image src={user.avatar || "/placeholder.svg"} alt={user.name} width={48} height={48} />
                  </UserAvatar>
                  <UserInfo>
                    <UserName>{user.name}</UserName>
                    <UserDetails>
                      <UserDetail>
                        <i className="fi fi-sr-id-badge" />
                        {user.id}
                      </UserDetail>
                      <UserDetail>
                        <i className="fi fi-sr-shield-check" />
                        {user.reforms?.type ? "Autorizado" : "Não Autorizado"}
                      </UserDetail>
                      <UserDetail>
                        <i className="fi fi-sr-rectangle-vertical-history" />
                        {user.modlog?.member_id ? "Com Punições" : "Sem Punições"}
                      </UserDetail>
                    </UserDetails>
                  </UserInfo>
                  <SelectIndicator selected={selectedUser?.id === user.id}>
                    <i className={selectedUser?.id === user.id ? "fi fi-sr-check" : "fi fi-sr-plus"} />
                  </SelectIndicator>
                </UserCard>
              ))
            ) : (
              <EmptyState>
                <i className="fi fi-sr-search" />
                <p>Nenhum usuário encontrado</p>
              </EmptyState>
            )}
          </SearchResults>
        )}

        {/* Seleção de tipo de autorização */}
        {selectedUser && (
          <AuthorizationSection>
            <SectionTitle>
              <i className="fi fi-sr-settings" />
              Tipo de Autorização
            </SectionTitle>

            <AuthorizationOptions>
              {authorizationTypes.map((type) => (
                <AuthOption
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  selected={selectedType === type.value}
                  color={type.color}
                >
                  <AuthIcon className={type.icon} />
                  <AuthLabel>{type.label}</AuthLabel>
                  {selectedType === type.value && <AuthCheck className="fi fi-sr-check" />}
                </AuthOption>
              ))}
            </AuthorizationOptions>

            {/* Botão de submit */}
            <SubmitButton
              type="submit"
              disabled={isFormSubmitted || !selectedType}
              variant={selectedType === "Remover autorização" ? "danger" : "primary"}
            >
              {isFormSubmitted ? (
                <>
                  <LoadingSpinner small />
                  Processando...
                </>
              ) : (
                <>
                  <i className={selectedType === "Remover autorização" ? "fi fi-sr-trash" : "fi fi-sr-check"} />
                  {selectedType === "Remover autorização" ? "Remover Autorização" : "Autorizar Conta"}
                </>
              )}
            </SubmitButton>
          </AuthorizationSection>
        )}

        {isFormSubmittedNotification && <NotificationUI message={notificationMessage} />}
      </FormContent>
    </FormContainer>
  )
}

// Componente para gerenciamento de selos
const RoleManagementForm = ({ onClose }: { onClose: () => void }) => {
  const [notificationMessage, setNotificationMessage] = useState("")
  const [isFormSubmittedNotification, setIsFormSubmittedNotification] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [usersList, setUsersList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const performSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const results = usersList.filter(
      (user) =>
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setSearchResults(results)
  }

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
  }

  useEffect(() => {
    performSearch()
  }, [searchQuery, usersList])

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/_v4/Q1_nvxre")
      const dataw = decrypt(response.data)
      const parsedDataw = JSON.parse(dataw)

      const usersWithReformInfo = await Promise.all(
        parsedDataw.map(async (user: User) => {
          try {
            const reformResponse = await axios.get(`/api/autentic/xyloQuerierAPI?userId=${user.reforms?.userId}`)
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
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleRole = (roleValue: string) => {
    setSelectedRoles((prev) => {
      if (prev.includes(roleValue)) {
        return prev.filter((r) => r !== roleValue)
      } else {
        return [...prev, roleValue]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || selectedRoles.length === 0) return

    setIsFormSubmitted(true)

    try {
      const formData: { userId: string } & Record<string, string | boolean> = {
        userId: selectedUser.id,
      }

      // Verifica se há tipos de remoção
      const removalTypes = selectedRoles.filter((role) => role.startsWith("Remover "))
      const isRemoval = removalTypes.length > 0

      if (isRemoval) {
        removalTypes.forEach((role) => {
          const originalType = role.replace("Remover ", "")
          formData[originalType] = false
        })
      } else {
        selectedRoles.forEach((role) => {
          formData[role] = true
        })
      }

      // Webhook Discord
      const webhookUrl =
        "https://discord.com/api/webhooks/1238588424089243759/qoTsjgbn6cL2frLwsmkT4p7gQPPuNRpuweX7B7VJuP7yjSLf2F4nepjebA0fMNuLFWu5"

      const embed = {
        icon_url: "https://i.imgur.com/85XgJlr.png",
        title: "🔔 REGISTRO ADMIN",
        description: "Para análise. <@&1043283893438140497>",
        fields: [
          {
            name: "```🔍 ID do usuário ```",
            value: selectedUser.id,
          },
          {
            name: "```Registro : ```",
            value: `${selectedRoles.join(", ")}`,
          },
        ],
        footer: {
          text: "Powered by NvX.Re & Imjuliio",
          icon_url: "https://i.imgur.com/85XgJlr.png",
        },
      }

      const formDataWebhook = new FormData()
      formDataWebhook.append("payload_json", JSON.stringify({ embeds: [embed] }))

      await fetch(webhookUrl, {
        method: "POST",
        body: formDataWebhook,
      })

      // API call
      const response = await fetch("/api/_v4/roleuser", {
        method: isRemoval ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.status === 200) {
        setNotificationMessage(isRemoval ? "Selos removidos com sucesso!" : "Selos adicionados com sucesso!")
      } else {
        setNotificationMessage("Erro ao processar os selos.")
      }

      setIsFormSubmittedNotification(true)
      setTimeout(() => {
        setIsFormSubmittedNotification(false)
      }, 5000)
    } catch (error) {
      setNotificationMessage("Erro ao processar os selos.")
      setIsFormSubmittedNotification(true)
      setTimeout(() => {
        setIsFormSubmittedNotification(false)
      }, 5000)
    } finally {
      setIsFormSubmitted(false)
    }
  }

  const getRolesByCategory = (category: string) => {
    return roleTypes.filter((role) => role.category === category)
  }

  const categories = [
    { id: "server", label: "Servidor", icon: "fi fi-sr-gamepad" },
    { id: "team", label: "Equipe", icon: "fi fi-sr-users-alt" },
    { id: "status", label: "Status", icon: "fi fi-sr-badge-check" },
  ]

  return (
    <FormContainer>
      <FormHeader>
        <HeaderContent>
          <HeaderIcon className="fi fi-sr-badge" />
          <HeaderText>
            <HeaderTitle>Gerenciamento de Selos</HeaderTitle>
            <HeaderDescription>Adicionar ou remover selos e verificações</HeaderDescription>
          </HeaderText>
        </HeaderContent>
      </FormHeader>

      <FormContent onSubmit={handleSubmit}>
        {/* Busca de usuário */}
        <SearchSection>
          <SearchLabel>
            <i className="fi fi-br-search" />
            Buscar Usuário
          </SearchLabel>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Digite o nome ou ID do usuário"
          />
        </SearchSection>

        {/* Resultados da busca */}
        {searchQuery && (
          <SearchResults>
            {isLoading ? (
              <LoadingState>
                <LoadingSpinner />
                <p>Carregando usuários...</p>
              </LoadingState>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <UserCard key={user.id} onClick={() => handleSelectUser(user)} selected={selectedUser?.id === user.id}>
                  <UserAvatar>
                    <Image src={user.avatar || "/placeholder.svg"} alt={user.name} width={48} height={48} />
                  </UserAvatar>
                  <UserInfo>
                    <UserName>{user.name}</UserName>
                    <UserDetails>
                      <UserDetail>
                        <i className="fi fi-sr-id-badge" />
                        {user.id}
                      </UserDetail>
                      <UserDetail>
                        <i className="fi fi-sr-shield-check" />
                        {user.reforms?.type ? "Autorizado" : "Não Autorizado"}
                      </UserDetail>
                      <UserDetail>
                        <i className="fi fi-sr-crown" />
                        {user.reforms?.prime ? "Com Prime" : "Sem Prime"}
                      </UserDetail>
                      <UserDetail>
                        <i className="fi fi-sr-gamepad" />
                        {user.reforms?.nvrp ? "Administrator" : "Não reconhecido"}
                      </UserDetail>
                      <UserDetail>
                        <i className="fi fi-sr-users-alt" />
                        {user.reforms?.nvxre ? "Membro do nvxre" : "Não reconhecido"}
                      </UserDetail>
                      <UserDetail>
                        <i className="fi fi-sr-headset" />
                        {user.reforms?.support ? "Equipe Support" : "Não reconhecido"}
                      </UserDetail>
                      <UserDetail>
                        <i className="fi fi-sr-calendar-star" />
                        {user.reforms?.event ? "Equipe Event" : "Não reconhecido"}
                      </UserDetail>
                      <UserDetail>
                        <i className="fi fi-sr-badge-check" />
                        {user.reforms?.verified ? "Membro verificado" : "Não verificado"}
                      </UserDetail>
                    </UserDetails>
                  </UserInfo>
                  <SelectIndicator selected={selectedUser?.id === user.id}>
                    <i className={selectedUser?.id === user.id ? "fi fi-sr-check" : "fi fi-sr-plus"} />
                  </SelectIndicator>
                </UserCard>
              ))
            ) : (
              <EmptyState>
                <i className="fi fi-sr-search" />
                <p>Nenhum usuário encontrado</p>
              </EmptyState>
            )}
          </SearchResults>
        )}

        {/* Seleção de selos */}
        {selectedUser && (
          <RolesSection>
            <SectionTitle>
              <i className="fi fi-sr-settings" />
              Selecionar Selos
            </SectionTitle>

            <RoleCategories>
              {categories.map((category) => {
                const categoryRoles = getRolesByCategory(category.id)
                if (categoryRoles.length === 0) return null

                return (
                  <CategorySection key={category.id}>
                    <CategoryHeader>
                      <i className={category.icon} />
                      <CategoryTitle>{category.label}</CategoryTitle>
                    </CategoryHeader>
                    <RoleGrid>
                      {/* Adicionar selos */}
                      {categoryRoles.map((role) => (
                        <RoleChip
                          key={role.value}
                          onClick={() => toggleRole(role.value)}
                          selected={selectedRoles.includes(role.value)}
                          color={role.color}
                        >
                          <RoleIcon className={role.icon} />
                          <RoleLabel>{role.label}</RoleLabel>
                          {selectedRoles.includes(role.value) && <RoleCheck className="fi fi-sr-check" />}
                        </RoleChip>
                      ))}
                      {/* Remover selos */}
                      {categoryRoles.map((role) => (
                        <RoleChip
                          key={`remove-${role.value}`}
                          onClick={() => toggleRole(`Remover ${role.value}`)}
                          selected={selectedRoles.includes(`Remover ${role.value}`)}
                          color="#ef4444"
                          removal
                        >
                          <RoleIcon className="fi fi-sr-trash" />
                          <RoleLabel>Remover {role.label}</RoleLabel>
                          {selectedRoles.includes(`Remover ${role.value}`) && <RoleCheck className="fi fi-sr-check" />}
                        </RoleChip>
                      ))}
                    </RoleGrid>
                  </CategorySection>
                )
              })}
            </RoleCategories>

            {/* Resumo da seleção */}
            {selectedRoles.length > 0 && (
              <SelectionSummary>
                <SummaryTitle>Ações Selecionadas ({selectedRoles.length})</SummaryTitle>
                <SelectedRoles>
                  {selectedRoles.map((role) => (
                    <SelectedRole key={role} removal={role.startsWith("Remover")}>
                      <i className={role.startsWith("Remover") ? "fi fi-sr-trash" : "fi fi-sr-plus"} />
                      {role}
                      <RemoveSelection onClick={() => toggleRole(role)}>
                        <i className="fi fi-br-cross" />
                      </RemoveSelection>
                    </SelectedRole>
                  ))}
                </SelectedRoles>
              </SelectionSummary>
            )}

            {/* Botão de submit */}
            <SubmitButton
              type="submit"
              disabled={isFormSubmitted || selectedRoles.length === 0}
              variant={selectedRoles.some((role) => role.includes("Remover")) ? "danger" : "primary"}
            >
              {isFormSubmitted ? (
                <>
                  <LoadingSpinner small />
                  Processando...
                </>
              ) : (
                <>
                  <i
                    className={
                      selectedRoles.some((role) => role.includes("Remover")) ? "fi fi-sr-trash" : "fi fi-sr-check"
                    }
                  />
                  {selectedRoles.some((role) => role.includes("Remover")) ? "Remover" : "Aplicar"} Selos
                </>
              )}
            </SubmitButton>
          </RolesSection>
        )}

        {isFormSubmittedNotification && <NotificationUI message={notificationMessage} />}
      </FormContent>
    </FormContainer>
  )
}

// Componente principal que agrupa tudo
interface AdesaoToolProps {
  children?: React.ReactNode
  permission: boolean
}

export default function AdesaoTool({ children, permission }: AdesaoToolProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"authorization" | "roles" | "manager">("authorization")

  const tabs = [
    {
      id: "authorization" as const,
      label: "Autorização",
      icon: "fi fi-sr-shield-check",
      description: "Autorizar ou desautorizar contas",
    },
    {
      id: "roles" as const,
      label: "Selos & Verificação",
      icon: "fi fi-sr-badge",
      description: "Gerenciar selos e verificações",
    },
    ...(permission
      ? [
          {
            id: "manager" as const,
            label: "Cargos Admin",
            icon: "fi fi-sr-user-crown",
            description: "Gerenciar cargos administrativos",
          },
        ]
      : []),
  ]

  const renderActiveTab = () => {
    switch (activeTab) {
      case "authorization":
        return <AuthorizationForm onClose={() => setIsOpen(false)} />
      case "roles":
        return <RoleManagementForm onClose={() => setIsOpen(false)} />
      case "manager":
        return permission ? (
          <>
          
            {children}
          </>
        ) : null
      default:
        return null
    }
  }

  return (
    <>
  
 
          <ModalContainer>
             

            <TabNavigation>
              {tabs.map((tab) => (
                <TabButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                  <i className={tab.icon} />
                  <TabContent>
                    <TabLabel>{tab.label}</TabLabel>
                    <TabDescription>{tab.description}</TabDescription>
                  </TabContent>
                </TabButton>
              ))}
            </TabNavigation>

            <ModalContent>{renderActiveTab()}</ModalContent>
          </ModalContainer>
     
    </>
  )
}

 

const ModalContainer = styled.div`
    
  display: flex;
  flex-direction: column;
  
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const HeaderIcon = styled.i`
  font-size: 2rem;
  color: #19191b;
  background: rgba(17, 16, 17, 0.205);
  padding: 1rem;
  border-radius: 16px;
`

const HeaderText = styled.div``

const HeaderTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: #272729;
`

const HeaderDescription = styled.p`
  color: #9ca3af;
  margin: 0;
  font-size: 0.875rem;
`

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e4e6ea;
  }
  
  i {
    font-size: 1.125rem;
  }
`

const TabNavigation = styled.div`
  display: flex;
  width: 100%;
  justify-content: center ;
 
  border-bottom: 1px solid rgba(5, 5, 5, 0.164);
  overflow-x: auto;
`

interface TabButtonProps {
  active: boolean
}

const TabButton = styled.button<TabButtonProps>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${(props) => (props.active ? "#101011" : "transparent")};
  color: ${(props) => (props.active ? "#0f0f0f" : "#9ca3af")};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    color: ${(props) => (props.active ? "#131314" : "#e4e6ea")};
    background: rgba(255, 255, 255, 0.02);
  }
  
  i {
    font-size: 1.125rem;
  }
`

const TabContent = styled.div`
  text-align: left;
`

const TabLabel = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
`

const TabDescription = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.125rem;
`

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
`

const FormContainer = styled.div`
  padding: 2rem;
`

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`

const FormContent = styled.form`
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.199);
  padding: 15px;
  border-radius: 14px;
  gap: 2rem;
`

const SearchSection = styled.div``

const SearchLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #1a1a1b;
  margin-bottom: 0.75rem;
  
  i {
    color: #111113;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgb(248, 249, 250);
  border: none;
  border-radius: 12px; 
  color: #0e0f0f;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
 
  &::placeholder {
    color: #6b7280;
  }
`

const SearchResults = styled.div`
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

interface UserCardProps {
  selected: boolean
}

const UserCard = styled.div<UserCardProps>`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: ${(props) => (props.selected ? "rgba(255, 255, 255, 0.178)" : "rgba(255, 255, 255, 0.178)")};
  border: 1px solid ${(props) => (props.selected ? "trasparent" : "rgba(255, 255, 255, 0.05)")};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
 
  
 
`

const UserAvatar = styled.div`
  img {
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.1);
  }
`

const UserInfo = styled.div`
  flex: 1;
`

const UserName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #536361;
`

const UserDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
`

const UserDetail = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
   color: black;
  
  i {
    color: #6b7280;
    font-size: 0.75rem;
  }
`

interface SelectIndicatorProps {
  selected: boolean
}

const SelectIndicator = styled.div<SelectIndicatorProps>`
  background: ${(props) => (props.selected ? "#0d0d0e" : "rgba(255, 255, 255, 0.05)")};
  color: ${(props) => (props.selected ? "white" : "#9ca3af")};
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  i {
    font-size: 0.875rem;
  }
`

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #9ca3af;
  
  p {
    margin: 0.5rem 0 0 0;
  }
`

const LoadingSpinner = styled.div<{ small?: boolean }>`
  width: ${(props) => (props.small ? "16px" : "24px")};
  height: ${(props) => (props.small ? "16px" : "24px")};
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top: 2px solid #0b0b0c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6b7280;
  text-align: center;
  
  i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }
  
  p {
    margin: 0;
  }
`

const AuthorizationSection = styled.div``

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: #141414;
  
  i {
    color: #131314;
  }
`

const AuthorizationOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

interface AuthOptionProps {
  selected: boolean
  color: string
}

const AuthOption = styled.button<AuthOptionProps>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: ${(props) => (props.selected ? `${props.color}20` : "rgba(255, 255, 255, 0.178)")};
  border: 1px solid ${(props) => (props.selected ? `${props.color}50` : "rgba(255, 255, 255, 0.05)")};
  border-radius: 12px;
  color: ${(props) => (props.selected ? props.color : "#9ca3af")};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    background: ${(props) => `${props.color}15`};
    border-color: ${(props) => `${props.color}40`};
    color: ${(props) => props.color};
  }
`

const AuthIcon = styled.i`
  font-size: 1.25rem;
`

const AuthLabel = styled.span`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
`

const AuthCheck = styled.i`
  font-size: 0.875rem;
  color: inherit;
`

const RolesSection = styled.div``

const RoleCategories = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const CategorySection = styled.div`
 margin-bottom: 2em;
 `

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

const CategoryTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.75rem;
`

interface RoleChipProps {
  selected: boolean
  color: string
  removal?: boolean
}

const RoleChip = styled.button<RoleChipProps>`
 display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: ${(props) => (props.selected ? `${props.color}20` : "rgba(255, 255, 255, 0.178)")};
  border: 1px solid ${(props) => (props.selected ? `${props.color}50` : "rgba(255, 255, 255, 0.05)")};
  border-radius: 12px;
  color: ${(props) => (props.selected ? props.color : "#9ca3af")};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    background: ${(props) => `${props.color}15`};
    border-color: ${(props) => `${props.color}40`};
    color: ${(props) => props.color};
  }
   
    
  ${(props) =>
    props.removal &&
    `
    opacity: 0.8;
    
    &:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  `}
`

const RoleIcon = styled.i`
  font-size: 0.875rem;
`

const RoleLabel = styled.h3`
 
  font-size: 0.875rem;
  font-weight: 500;
  font-family: 'InterSemiBold', monospace;
`

const RoleCheck = styled.i`
  font-size: 0.75rem;
  color: inherit;
`

const SelectionSummary = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  
`

const SummaryTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #e4e6ea;
`

const SelectedRoles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

interface SelectedRoleProps {
  removal: boolean
}

const SelectedRole = styled.div<SelectedRoleProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${(props) => (props.removal ? "rgba(239, 68, 68, 0.1)" : "rgba(79, 70, 229, 0.1)")};
  border: 1px solid ${(props) => (props.removal ? "rgba(239, 68, 68, 0.2)" : "rgba(79, 70, 229, 0.2)")};
  border-radius: 6px;
  color: ${(props) => (props.removal ? "#ef4444" : "#121214")};
  font-size: 0.75rem;
  font-weight: 500;
  
  i {
    font-size: 0.75rem;
  }
`

const RemoveSelection = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.125rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  i {
    font-size: 0.625rem;
  }
`

interface SubmitButtonProps {
  variant: "primary" | "danger"
}

const SubmitButton = styled.button<SubmitButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 2rem;
  background: ${(props) =>
    props.variant === "danger"
      ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
      : "linear-gradient(135deg, #161518 0%, #212022 100%)"};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.variant === "danger" ? "0 8px 25px rgba(239, 68, 68, 0.3)" : "0 8px 25px rgba(22, 22, 24, 0.3)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  i {
    font-size: 1.125rem;
  }
`

 
 