"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import type * as React from "react"
import type { User } from "@/types/user/searchall"
import axios from "axios"
import { decrypt } from "@/core/security/encryption"
import NotificationUI from "@club/components/notification/card.mnc"
import Image from "next/image"

// Tipos de gerenciamento
const managerRoles = [
  { value: "prime", label: "Prime", category: "premium", color: "#f59e0b" },
  { value: "nvxre", label: "NvXre", category: "admin", color: "#8b5cf6" },
  { value: "ADMIN", label: "Admin", category: "admin", color: "#ef4444" },
  { value: "bod", label: "Board of Directors", category: "executive", color: "#06b6d4" },
  { value: "ceo", label: "CEO", category: "executive", color: "#10b981" },
  { value: "cmo", label: "CMO", category: "executive", color: "#f97316" },
  { value: "cdo", label: "CDO", category: "executive", color: "#84cc16" },
  { value: "coo", label: "COO", category: "executive", color: "#06b6d4" },
  { value: "cto", label: "CTO", category: "executive", color: "#8b5cf6" },
  { value: "manager", label: "Manager", category: "management", color: "#6366f1" },
  { value: "leader", label: "Leader", category: "management", color: "#ec4899" },
  { value: "qa", label: "QA", category: "technical", color: "#14b8a6" },
  { value: "havocac", label: "Havoc AC", category: "technical", color: "#f59e0b" },
  { value: "developer", label: "Developer", category: "technical", color: "#3b82f6" },
  { value: "contributor", label: "Contributor", category: "community", color: "#10b981" },
  { value: "modder3d", label: "3D Modder", category: "creative", color: "#f97316" },
  { value: "vehicledev", label: "Vehicle Developer", category: "creative", color: "#84cc16" },
  { value: "developer3d", label: "3D Developer", category: "creative", color: "#06b6d4" },
]



// Componente principal de gerenciamento de cargos
const ManagerRoleForm = ({ onClose }: { onClose: () => void }) => {
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
      const response = await fetch("/api/_v4/manager.role", {
        method: isRemoval ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.status === 200) {
        setNotificationMessage(isRemoval ? "Cargos removidos com sucesso!" : "Cargos adicionados com sucesso!")
      } else {
        setNotificationMessage("Erro ao processar os cargos.")
      }

      setIsFormSubmittedNotification(true)
      setTimeout(() => {
        setIsFormSubmittedNotification(false)
      }, 5000)
    } catch (error) {
      setNotificationMessage("Erro ao processar os cargos.")
      setIsFormSubmittedNotification(true)
      setTimeout(() => {
        setIsFormSubmittedNotification(false)
      }, 5000)
    } finally {
      setIsFormSubmitted(false)
    }
  }

  const getRolesByCategory = (category: string) => {
    return managerRoles.filter((role) => role.category === category)
  }

  const categories = [
    { id: "premium", label: "Premium", icon: "fi fi-sr-crown" },
    { id: "executive", label: "Executivo", icon: "fi fi-sr-briefcase" },
    { id: "admin", label: "Administração", icon: "fi fi-sr-shield-check" },
    { id: "management", label: "Gerência", icon: "fi fi-sr-users-alt" },
    { id: "technical", label: "Técnico", icon: "fi fi-sr-code" },
    { id: "creative", label: "Criativo", icon: "fi fi-sr-palette" },
    { id: "community", label: "Comunidade", icon: "fi fi-sr-heart" },
  ]

  return (
    <FormContainer>
      <FormHeader>
        <HeaderContent>
          <HeaderIcon className="fi fi-sr-user-crown" />
          <HeaderText>
            <HeaderTitle>Gerenciamento de Cargos</HeaderTitle>
            <HeaderDescription>Adicionar ou remover cargos administrativos</HeaderDescription>
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

        {/* Seleção de cargos */}
        {selectedUser && (
          <RolesSection>
            <SectionTitle>
              <i className="fi fi-sr-settings" />
              Selecionar Cargos
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
                      {categoryRoles.map((role) => (
                        <RoleChip
                          key={role.value}
                          onClick={() => toggleRole(role.value)}
                          selected={selectedRoles.includes(role.value)}
                          color={role.color}
                        >
                          <RoleIcon className="fi fi-sr-badge" />
                          <RoleLabel>{role.label}</RoleLabel>
                          {selectedRoles.includes(role.value) && <RoleCheck className="fi fi-sr-check" />}
                        </RoleChip>
                      ))}
                      {/* Opções de remoção */}
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
            <SubmitButton type="submit" disabled={isFormSubmitted || selectedRoles.length === 0}>
              {isFormSubmitted ? (
                <>
                  <LoadingSpinner small />
                  Processando...
                </>
              ) : (
                <>
                  <i className="fi fi-sr-check" />
                  Aplicar Alterações
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
interface AdesaoManagerProps {
  permission: boolean
  children?: React.ReactNode
}

export default function AdesaoManager({ permission, children }: AdesaoManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState< "manager">("manager")

   

  const renderActiveTab = () => {
    switch (activeTab) {
     
      case "manager":
        return permission ? <ManagerRoleForm onClose={() => setIsOpen(false)} /> : null
      default:
        return null
    }
  }

  return (
    <>
    
     <ModalContent>{renderActiveTab()}</ModalContent>
      
    </>
  )
}

 
 


const ModalContainer = styled.div`
  
 
  max-height: 90vh;
  overflow: hidden;
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

const RolesSection = styled.div`
 display: flex;
  flex-direction: column;
   
   `

const RoleCategories = styled.div`
  
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
 
  

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #b5b5bd 0%, #5d5d5f 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  i {
    font-size: 1rem;
  }
`
