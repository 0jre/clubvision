"use client"

import type React from "react"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import type { User } from "@/types/user/searchall"
import axios from "axios"
import { decrypt } from "@/core/security/encryption"
import NotificationUI from "@club/components/notification/card.mnc"
import moment from "moment-timezone"
import LoadingPageView from "@club/resources/loading/market.loading"
import styled from "styled-components"
import { useRouter } from "next/router"
import { Users, Search, Eye, Shield, Star } from "lucide-react"
import { StatusBadge, PrimeBadge } from "./status-badge"
import UserTaf from '../ac/user.cb'; 

interface Props {
  users: User[]
  children: ReactNode
  content: ReactNode
  className?: string
  buttonText: string
}

async function fetchUserInfo(): Promise<Props> {
  const response = await fetch("/api/_v4/Q1_nvxre")
  if (!response.ok) {
    throw new Error("Falha ao buscar informações do usuário.")
  }
  const data = await response.json()  as any;
  return data
}

export default function ViewManagerList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [usersList, setUsersList] = useState<User[]>([])
  const [userInfo, setUserInfo] = useState<Props | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const performSearch = () => {
    const results = usersList.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setSearchResults(results)
  }

  useEffect(() => {
    performSearch()
  }, [searchQuery])

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/_v4/Q1_nvxre")
      const dataw = decrypt(response.data)
      const parsedDataw = JSON.parse(dataw)
      setUsersList(parsedDataw)
      const usersWithReformInfo = await Promise.all(
        parsedDataw.map(async (user: User) => {
          try {
            const reformResponse = await axios.get(`/api/autentic/xyloQuerierAPI?userId=${user.reforms?.userId}`)
            const datawre = decrypt(reformResponse.data.log)
            const reformInfo = JSON.parse(datawre)
            return {
              ...user,
              reform: reformInfo,
            }
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

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    let isMounted = true

    fetchUserInfo()
      .then((data: any) => {
        if (isMounted) {
          const datawZX = decrypt(data)
          const SetDataFeas = JSON.parse(datawZX)
          setUserInfo(SetDataFeas)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <LoadingPageView />
  }

  if (!userInfo) {
    return <NotificationUI message={<>Não foi possível processar as informações!!</>} />
  }

  const stats = [
    {
      label: "Usuários totais",
      value: usersList.length.toString(),
      change: "+12%",
      icon: Users,
      color: "#10b981",
    },
    {
      label: "Usuários ativos",
      value: usersList.filter((user) => user.reforms?.type).length.toString(),
      change: "+8%",
      icon: Shield,
      color: "#3b82f6",
    },
    {
      label: "Usuários premium",
      value: usersList.filter((user) => user.reforms?.prime).length.toString(),
      change: "+15%",
      icon: Star,
      color: "#f59e0b",
    },
  ]

  const displayUsers = searchQuery === "" ? usersList : searchResults

  return (
    <Container>
      <Header>
        <Title>Gerenciamento de usuários</Title>
        <Subtitle>Gerenciar e monitorar contas de usuário</Subtitle>
      </Header>

      <StatsGrid>
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <StatCard key={index}>
              <StatHeader>
                <IconContainer color={stat.color}>
                  <Icon size={24} color={stat.color} />
                </IconContainer>
                <ChangeIndicator positive={stat.change.startsWith("+")}>{stat.change}</ChangeIndicator>
              </StatHeader>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          )
        })}
      </StatsGrid>

      <SearchSection>
        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search users by name or ID..."
          />
        </SearchContainer>
      </SearchSection>

      <ContentSection>
        <UserListCard>
          <CardHeader>
            <CardTitle>Lista de usuários</CardTitle>
            <UserCount>{displayUsers.length} usuários encontrados</UserCount>
          </CardHeader>

          <TableHeader>
            <HeaderCell>DATA</HeaderCell>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>USERNAME</HeaderCell>
            <HeaderCell>AUTORIZADA</HeaderCell>
            <HeaderCell>PRIME</HeaderCell>
            <HeaderCell></HeaderCell>
          </TableHeader>

          <UserListContainer>
            {isLoading ? (
              <LoadingContainer>
                <LoadingPageView />
              </LoadingContainer>
            ) : displayUsers.length > 0 ? (
              displayUsers.map((user) => (
                <UserTaf
                  key={user.id}
                  View={
                    <ViewButton onClick={() => router.push(`?overview=${user.id}`)}>
                      <Eye size={16} />
                    </ViewButton>
                  }
                  date={moment(user.firstLoginDate).format("DD [de] MMMM [de] YYYY")}
                  id={user.id}
                  username={user.name}
                  authorized={
                    <StatusBadge status={user.reforms?.type ? "authorized" : "pending"}>
                      {user.reforms?.type ? "AUTHORIZED" : "PENDING"}
                    </StatusBadge>
                  }
                  prime={
                    <PrimeBadge prime={user.reforms?.prime ? "prime" : "standard"}>
                      {user.reforms?.prime ? "PRIME" : "STANDARD"}
                    </PrimeBadge>
                  }
                />
              ))
            ) : (
              <EmptyState>
                <Users size={48} color="#9ca3af" />
                <EmptyTitle>Nenhum usuário encontrado</EmptyTitle>
                <EmptySubtitle>Tente ajustar seus critérios de pesquisa</EmptySubtitle>
              </EmptyState>
            )}
          </UserListContainer>
        </UserListCard>
      </ContentSection>
    </Container>
  )
}

// Styled Components
const Container = styled.div`
  padding: 24px;
  background-color: #f9fafb;
  min-height: 100vh;
`

const Header = styled.div`
  margin-bottom: 32px;
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
`

const Subtitle = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 16px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`

const StatCard = styled.div`
  background-color: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const IconContainer = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  background-color: ${(props) => props.color}20;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ChangeIndicator = styled.div<{ positive: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.positive ? "#10b981" : "#ef4444")};
`

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`

const StatLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
`

const SearchSection = styled.div`
  margin-bottom: 24px;
`

const SearchContainer = styled.div`
  position: relative;
  max-width: 400px;
`

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`

const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px 0 48px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  background-color: #ffffff;
  color: #1f2937;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`

const ContentSection = styled.div``

const UserListCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const CardHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`

const UserCount = styled.span`
  font-size: 14px;
  color: #6b7280;
`

const TableHeader = styled.div`
  display: grid;
 grid-template-columns: 230px 280px 1fr 120px 120px 60px;
  padding: 16px 24px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`

const HeaderCell = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const UserListContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
`

const ViewButton = styled.button`
  background-color: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e5e7eb;
    color: #374151;
  }
`

const LoadingContainer = styled.div`
  padding: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const EmptyState = styled.div`
  padding: 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

const EmptyTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0;
`

const EmptySubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`
