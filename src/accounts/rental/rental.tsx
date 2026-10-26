"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import router from "next/router"
import { Clock, Calendar, AlertCircle, RefreshCw, Eye, Gauge, Settings, Fuel, Activity } from "lucide-react"
import Image from "next/image"
import moment from "moment-timezone"
import "moment/locale/pt-br"
import ExtendRentalModal from "./extend"
import { GetInfo_nvxre_walletvision } from "@/hooks/walletvision"
import { nvxre_tokenvirtual } from "@/hooks/tokenvirtual"
import ROUTENVX from "@/routes/routes"
import { rentables } from "@/types/clubstore/list.opencontainer"
import LoadingPageView from "@/resources/loading/market.loading"
 
// Interfaces do garage-modal
interface Item {
  nameitem: string
  imagem: string | undefined
  _id: string
  id: number
  tokenID: string
  createdAt: string
  editionNumber: number
  quantity: number
  priceitem: number
  itemValue: number
  itemCondition: string
  rented: any
  isActive: boolean
  sold?: boolean
  userId: string
  type: string
  containerType: string
  rarity: string
  valueHistory?: { newValue: number; timestamp: string }[]
  previousOwners?: string[]
}

interface RentalItem {
  id: string
  uid?: string
  itemId?: string
  acquiredAt: string
  expiresAt: string
  isActive: boolean
  used: boolean
  rented?: boolean
  paymentStatus?: string
}

interface RentalData {
  activeRentals: RentalItem[]
  expiredRentals: RentalItem[]
  totalActive: number
  totalExpired: number
}

export default function Rental({ id }: { id: string }) {
  moment.locale("pt-br")

  const [activeTab, setActiveTab] = useState("overview")
  const [rentalData, setRentalData] = useState<RentalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userBalance, setUserBalance] = useState(0)
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null)
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [searchId, setSearchId] = useState("")

  // Estados para itens da garagem
  const [items, setItems] = useState<Item[]>([])
  const [items2, setItems2] = useState<Item[]>([])
  const [selectedItemDetail, setSelectedItemDetail] = useState<Item | null>(null)
  const [showItemModal, setShowItemModal] = useState(false)

  // Hooks
  const { isLoadingwallet, Datawallet, mutatewallet } = GetInfo_nvxre_walletvision({ id: id })
  const { isLoadingtvl, errorwallettvl, Datawallettvl, mutatewallettvl } = nvxre_tokenvirtual({ id: id })

  const fetchRentals = async () => {
    try {
      const response = await fetch("/api/rental/get-rentals")
      const result = await response.json()

      if (result.success) {
        setRentalData(result.data)
      }
    } catch (error) {
      console.error("Erro ao buscar aluguéis:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Função para buscar detalhes do item com base no ID
  const getItemDetails = (itemId: string): Item | null => {
    const allItems = [...items, ...items2]
    return (
      allItems.find((item) => item.tokenID === itemId || item._id === itemId || item.id.toString() === itemId) || null
    )
  }

  // Função para abrir modal de detalhes do item
  const openItemModal = (itemId: string) => {
    const itemDetails = getItemDetails(itemId)
    if (itemDetails) {
      setSelectedItemDetail(itemDetails)
      setShowItemModal(true)
    }
  }

  const closeItemModal = () => {
    setShowItemModal(false)
    setSelectedItemDetail(null)
  }

  useEffect(() => {
    fetchRentals()
    if (!isLoadingwallet && Datawallet) {
      setUserBalance(Datawallet.bits || 0)
    }
  }, [isLoadingwallet, Datawallet])

  // Carregar itens da garagem
  useEffect(() => {
    if (!isLoadingtvl && Datawallettvl) {
      setItems(Datawallettvl.items || [])
      setItems2(Datawallettvl.mytvls || [])
    }
  }, [Datawallettvl, isLoadingtvl])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchRentals()
    await mutatewallet()
    await mutatewallettvl()
  }

  const handleExtendRental = async (itemId: string, itemUid: string | undefined, days: number) => {
    try {
      const response = await fetch("/api/rental/extend-rental", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          itemUid,
          extensionDays: days,
          paymentMethod: "wallet",
        }),
      })

      const result = await response.json()

      if (result.success) {
        await fetchRentals()
        await mutatewallet()
        alert(result.message)
      } else {
        alert(result.message || "Erro ao estender aluguel")
      }
    } catch (error) {
      console.error("Erro ao estender aluguel:", error)
      alert("Erro interno. Tente novamente.")
    }
  }

  const openExtendModal = (item: RentalItem) => {
    setSelectedItem(item)
    setShowExtendModal(true)
  }

  const closeExtendModal = () => {
    setSelectedItem(null)
    setShowExtendModal(false)
  }

  const filterBySearch = (item: RentalItem) => {
    if (!searchId.trim()) return true
    const search = searchId.trim().toLowerCase()
    return (
      (item.id && item.id.toString().toLowerCase().includes(search)) ||
      (item.uid && item.uid.toString().toLowerCase().includes(search)) ||
      (item.itemId && item.itemId.toString().toLowerCase().includes(search))
    )
  }

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiration = new Date(expiresAt)
    const diff = expiration.getTime() - now.getTime()

    if (diff <= 0) return "Expirado"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  const getStatusColor = (item: RentalItem) => {
    const now = new Date()
    const expiration = new Date(item.expiresAt)
    const diff = expiration.getTime() - now.getTime()
    const hoursRemaining = diff / (1000 * 60 * 60)

    if (diff <= 0) return "#ff4444"
    if (hoursRemaining <= 24) return "#ffaa00"
    return "#41b45e"
  }

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const rarityColors: { [key: string]: string } = {
    comum: "#49484b",
    raro: "#eb2647",
    épico: "#f13dd3",
  }

  if (loading) {
    return (
      <Container>
        <LoadingPageView />
      </Container>
    )
  }

const isRentable = (item: RentalItem) =>
  rentables.includes(item.itemId || item.id || "");
  return (
   <Container>
  <Header>
    <HeaderTitle>Meus Aluguéis</HeaderTitle>
    <HeaderActions>
    
        <input
          type="text"
          placeholder="Buscar por ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{
      
            padding: "8px 12px",
            borderRadius: 38,
            background: "#222524",
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
          }}
        />
    
      <RefreshButton onClick={handleRefresh} disabled={refreshing}>
        <RefreshCw size={16} className={refreshing ? "spinning" : ""} />
      </RefreshButton>
    </HeaderActions>
  </Header>

  <TabList>
    <Tab active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
      ATIVOS ({rentalData?.totalActive || 0})
    </Tab>
    <Tab active={activeTab === "expired"} onClick={() => setActiveTab("expired")}>
      EXPIRADOS ({rentalData?.totalExpired || 0})
    </Tab>
  </TabList>

  {activeTab === "overview" && (
    <>
      {(!rentalData?.activeRentals || rentalData.activeRentals.length === 0) && (
        <Section>
          <SectionHeader>
            <SectionTitle>Aluguéis Ativos</SectionTitle>
          </SectionHeader>
          <EmptyState>
            <EmptyIcon>
              <Clock size={48} />
            </EmptyIcon>
            <EmptyText>Você não possui aluguéis ativos no momento.</EmptyText>
            <Button onClick={() => router.push(ROUTENVX.market)}>EXPLORAR MERCADO</Button>
          </EmptyState>
        </Section>
      )}

      {/* ATIVOS & COMPLEMENTOS */}
      <Section>
        <SectionHeader>
          <SectionTitle>ATIVOS & COMPLEMENTOS</SectionTitle>
        </SectionHeader>
        {rentalData?.activeRentals && rentalData.activeRentals.filter(item => isRentable(item) && filterBySearch(item)).length > 0 ? (
          <RentalGrid>
            {rentalData.activeRentals.filter(item => isRentable(item) && filterBySearch(item)).map((item, index) => {
              const itemDetails = getItemDetails(item.itemId || item.uid || item.id)
              return (
                <RentalCard key={index}>
                  {itemDetails && (
                    <ItemImageContainer>
                      <Image
                        src={itemDetails.imagem || "/placeholder.svg"}
                        alt={itemDetails.nameitem}
                        width={200}
                        height={90}
                        crossOrigin="anonymous"
                      />
                      <RarityBadge style={{ backgroundColor: rarityColors[itemDetails.rarity] || "#354b36" }}>
                        {itemDetails.rarity}
                      </RarityBadge>
                    </ItemImageContainer>
                  )}
                  <RentalHeader>
                    <RentalTitle>
                      {itemDetails ? itemDetails.nameitem : item.uid ? item.uid : item.id ? item.id : item.itemId}
                    </RentalTitle>
                    <StatusBadge color={getStatusColor(item)}>{formatTimeRemaining(item.expiresAt)}</StatusBadge>
                  </RentalHeader>
                  {itemDetails && (
                    <ItemSpecs>
                      <div className="spec">
                        <Gauge size={14} />
                        {itemDetails.editionNumber}/{itemDetails.quantity}
                      </div>
                      <div className="spec">
                        <Settings size={14} />
                        {itemDetails.containerType || itemDetails.type || "Desconhecido"}
                      </div>
                      <div className="spec">
                        <Activity size={14} />
                        {itemDetails.itemCondition}
                      </div> 
                    </ItemSpecs>
                  )}
                  <RentalInfo>
                    <InfoItem>
                      <Calendar size={14} />
                      Expira: {new Date(item.expiresAt).toLocaleDateString()}
                    </InfoItem>
                    {item.uid && <InfoItem>UID: {item.uid.substring(0, 8)}...</InfoItem>}
                    {itemDetails && <InfoItem>Valor: {formatCurrency(itemDetails.itemValue)} Bits</InfoItem>}
                  </RentalInfo>
                  <RentalActions>
                    <ExtendButton onClick={() => openExtendModal(item)}>
                      <Clock size={14} />
                      Estender
                    </ExtendButton>
                  </RentalActions>
                </RentalCard>
              )
            })}
          </RentalGrid>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <Clock size={48} />
            </EmptyIcon>
            <EmptyText>Nenhum ativo ou complemento encontrado.</EmptyText>
          </EmptyState>
        )}
      </Section>

      {/* ALUGUEIS TVLS */}
      <Section>
        <SectionHeader>
          <SectionTitle>ALUGUEIS TVLS</SectionTitle>
        </SectionHeader>
        {rentalData?.activeRentals && rentalData.activeRentals.filter(item => !isRentable(item) && filterBySearch(item)).length > 0 ? (
          <RentalGrid>
            {rentalData.activeRentals.filter(item => !isRentable(item) && filterBySearch(item)).map((item, index) => {
              const itemDetails = getItemDetails(item.itemId || item.uid || item.id)
              return (
                <RentalCard key={index}>
                  {itemDetails && (
                    <ItemImageContainer>
                      <Image
                        src={itemDetails.imagem || "/placeholder.svg"}
                        alt={itemDetails.nameitem}
                        width={200}
                        height={90}
                        crossOrigin="anonymous"
                      />
                      <RarityBadge style={{ backgroundColor: rarityColors[itemDetails.rarity] || "#354b36" }}>
                        {itemDetails.rarity}
                      </RarityBadge>
                    </ItemImageContainer>
                  )}
                  <RentalHeader>
                    <RentalTitle>
                      {itemDetails ? itemDetails.nameitem : item.uid ? item.uid : item.id ? item.id : item.itemId}
                    </RentalTitle>
                    <StatusBadge color={getStatusColor(item)}>{formatTimeRemaining(item.expiresAt)}</StatusBadge>
                  </RentalHeader>
                  {itemDetails && (
                    <ItemSpecs>
                      <div className="spec">
                        <Gauge size={14} />
                        {itemDetails.editionNumber}/{itemDetails.quantity}
                      </div>
                      
                      <div className="spec">
                        <Activity size={14} />
                        {itemDetails.itemCondition}
                      </div>
                    </ItemSpecs>
                  )}
                  <RentalInfo>
                    <InfoItem>
                      <Calendar size={14} />
                      Expira: {new Date(item.expiresAt).toLocaleDateString()}
                    </InfoItem>
                    
                   
                  </RentalInfo>
                  <RentalActions>
                    <ExtendButton onClick={() => openExtendModal(item)}>
                      <Clock size={14} />
                      Estender
                    </ExtendButton>
                  </RentalActions>
                </RentalCard>
              )
            })}
          </RentalGrid>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <Clock size={48} />
            </EmptyIcon>
            <EmptyText>Nenhum aluguel TVL encontrado.</EmptyText>
          </EmptyState>
        )}
      </Section>
    </>
  )}

  {activeTab === "expired" && (
    <Section>
    
      
      <SectionHeader>
        <SectionTitle>ATIVOS & COMPLEMENTOS EXPIRADOS</SectionTitle>
      </SectionHeader>
      {rentalData?.expiredRentals && rentalData.expiredRentals.filter(item => isRentable(item) && filterBySearch(item)).length > 0 ? (
        <RentalGrid>
          {rentalData.expiredRentals.filter(item => isRentable(item) && filterBySearch(item)).map((item, index) => {
            const itemDetails = getItemDetails(item.itemId || item.uid || item.id)
            return (
              <RentalCard key={index} expired>
                {itemDetails && (
                  <ItemImageContainer>
                    <Image
                      src={itemDetails.imagem || "/placeholder.svg"}
                      alt={itemDetails.nameitem}
                      width={300}
                      height={200}
                      crossOrigin="anonymous"
                    />
                    <RarityBadge style={{ backgroundColor: rarityColors[itemDetails.rarity] || "#354b36" }}>
                      {itemDetails.rarity}
                    </RarityBadge>
                  </ItemImageContainer>
                )}
                <RentalHeader>
                  <RentalTitle>
                    {itemDetails ? itemDetails.nameitem : item.uid ? item.uid : item.id ? item.id : item.itemId}
                  </RentalTitle>
                  <StatusBadge color="#ff4444">Expirado</StatusBadge>
                </RentalHeader>
                <RentalInfo>
                  <InfoItem>
                    <Calendar size={14} />
                    Expirou: {new Date(item.expiresAt).toLocaleDateString()}
                  </InfoItem>
                  {itemDetails && <InfoItem>Valor: {formatCurrency(itemDetails.itemValue)} Bits</InfoItem>}
                </RentalInfo>
                <RentalActions>
                  <ExtendButton onClick={() => openExtendModal(item)}>
                    <RefreshCw size={14} />
                    Renovar
                  </ExtendButton>
                </RentalActions>
              </RentalCard>
            )
          })}
        </RentalGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <AlertCircle size={48} />
          </EmptyIcon>
          <EmptyText>Nenhum ativo ou complemento expirado.</EmptyText>
        </EmptyState>
      )}

      {/* ALUGUEIS TVLS EXPIRADOS */}
      <SectionHeader style={{ marginTop: 32 }}>
        <SectionTitle>ALUGUEIS TVLS EXPIRADOS</SectionTitle>
      </SectionHeader>
      {rentalData?.expiredRentals && rentalData.expiredRentals.filter(item => !isRentable(item) && filterBySearch(item)).length > 0 ? (
        <RentalGrid>
          {rentalData.expiredRentals.filter(item => !isRentable(item) && filterBySearch(item)).map((item, index) => {
            const itemDetails = getItemDetails(item.itemId || item.uid || item.id)
            return (
              <RentalCard key={index} expired>
                {itemDetails && (
                  <ItemImageContainer>
                    <Image
                      src={itemDetails.imagem || "/placeholder.svg"}
                      alt={itemDetails.nameitem}
                      width={300}
                      height={200}
                      crossOrigin="anonymous"
                    />
                    <RarityBadge style={{ backgroundColor: rarityColors[itemDetails.rarity] || "#354b36" }}>
                      {itemDetails.rarity}
                    </RarityBadge>
                  </ItemImageContainer>
                )}
                <RentalHeader>
                  <RentalTitle>
                    {itemDetails ? itemDetails.nameitem : item.uid ? item.uid : item.id ? item.id : item.itemId}
                  </RentalTitle>
                  <StatusBadge color="#ff4444">Expirado</StatusBadge>
                </RentalHeader>
                <RentalInfo>
                  <InfoItem>
                    <Calendar size={14} />
                    Expirou: {new Date(item.expiresAt).toLocaleDateString()}
                  </InfoItem>
                  {itemDetails && <InfoItem>Valor: {formatCurrency(itemDetails.itemValue)} Bits</InfoItem>}
                </RentalInfo>
                <RentalActions>
                  <ExtendButton onClick={() => openExtendModal(item)}>
                    <RefreshCw size={14} />
                    Renovar
                  </ExtendButton>
                </RentalActions>
              </RentalCard>
            )
          })}
        </RentalGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <AlertCircle size={48} />
          </EmptyIcon>
          <EmptyText>Nenhum aluguel TVL expirado.</EmptyText>
        </EmptyState>
      )}
    </Section>
  )}

  <ExtendRentalModal
    isOpen={showExtendModal}
    onClose={closeExtendModal}
    item={selectedItem}
    onExtend={handleExtendRental}
    userBalance={userBalance}
  />
</Container>
  )
}

// Styled Components (mantendo os existentes e adicionando novos)
const Container = styled.div`
  color: #ffffff;
  padding: 24px;
  height: 100%;
  
  font-family: 'Inter', sans-serif;
 
 
   @media screen and (max-width: 680px) {
      padding: 0;

    } 
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  
   @media screen and (max-width: 680px) {
      flex-direction: column;
      width: 100%;

      h1{
        margin-top: 16px;
        margin-bottom: 16px;
      }
    } 

`

const HeaderTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  font-family: 'Inter', sans-serif;
  color: #e9ecea14;
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

     @media screen and (max-width: 680px) {
      justify-content: center;
      width: 100%;
   
      input{
        width: 50vw;
      }
    } 
`

const RefreshButton = styled.button`
  background: #222524;
  color: #41b45e;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2d302e;
    border-color: #41b45e;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #2d302e;
  border-top: 3px solid #41b45e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
`

const LoadingText = styled.p`
  color: #999;
  font-size: 16px;
`

const TabList = styled.div`
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #2d302e;
  margin-bottom: 24px;
  overflow-x: auto;
`

const Tab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.active ? "#41b45e" : "#666")};
  font-size: 14px;
  font-weight: 500;
  padding: 12px 0;
  font-family: 'Inter', monospace;
  position: relative;
  white-space: nowrap;
  transition: color 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${(props) => (props.active ? "#41b45e" : "transparent")};
    transition: background-color 0.2s ease;
  }
  
  &:hover {
    color: ${(props) => (props.active ? "#41b45e" : "#999")};
  }
`

const Section = styled.section`
  margin-bottom: 32px;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  margin: 0;
  color: #c8cecb;
`

const RentalGrid = styled.div`
   display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 6px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr); 
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr; 
  }
`

const RentalCard = styled.div<{ expired?: boolean }>`
  background: ${(props) => (props.expired ? "rgba(255, 68, 68, 0.171)" : "#2729287f")}; 
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.expired ? 0.7 : 1)};
   
  
`

// Novos componentes para exibir itens
const ItemImageContainer = styled.div`
  height: 200px;
  width: 100%;
  background: #2627265e;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 12px;

  img {
    
    object-fit: cover;
  }
`

const RarityBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
`

const ItemSpecs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
  color: #9ca3af;
  font-size: 12px;

  .spec {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`

const RentalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`

const RentalTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
  flex: 1;
  margin-right: 12px;
`

const StatusBadge = styled.span<{ color: string }>`
  background: ${(props) => props.color}20;
  color: ${(props) => props.color};
  border: 1px solid ${(props) => props.color}40;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
`

const RentalInfo = styled.div`
  margin-bottom: 16px;
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 14px;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`

const RentalActions = styled.div`
  display: flex;
  gap: 8px;
`

const ActionButton = styled.button`
  background: #e3e6e4;
  color: #000000;
  border: none;
  border-radius: 38px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;

  &:hover {
    background: #636664;
    color: white;
    transform: translateY(-1px);
  }
`

const ExtendButton = styled.button`
  background: #e3e6e4;
  color: #000000;
  border: none;
  border-radius: 38px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;

  &:hover {
    background: #636664;
    color: white;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

const EmptyState = styled.div`
  border: 1px dashed #2d302e;
  border-radius: 12px;
  padding: 48px;
  text-align: center;
`

const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  opacity: 0.5;
  color: #666;
`

const EmptyText = styled.p`
  color: #999;
  margin-bottom: 24px;
  font-size: 16px;
`

const Button = styled.button`
  background: #d1d6d2;
  color: #000; 
  border: none;
  padding: 8px 24px;
  border-radius: 38px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: #4bc766;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

// Modal de detalhes do item
const ItemModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ItemModalContent = styled.div`
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid #2d302e;
`

const ItemModalCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: 2px solid #1c1c1d76;
  padding: 8px 0.8em 6px;
  border-radius: 100px;
  height: 38px;
  width: 38px;
  color: #6d6d7276;
  background: none;
  transition: 0.4s all;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  
  i {
    font-size: 14px;
  }

  &:hover {
    border: 2px solid rgba(216, 215, 218, 0.26);
    color: #fff;
  }
`

const ItemModalBody = styled.div`
  padding: 40px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const ItemModalImage = styled.img`
  width: auto;
  height: 150px;
  border-radius: 8px;
  margin-bottom: 16px;
`

const ItemModalTitle = styled.h2`
  margin: 0 0 16px 0;
  font-family: 'Inter', sans-serif;
  color: #b6b7c0;
  font-size: 20px;
`

const ItemModalInfo = styled.p`
  margin: 8px 0;
  font-family: 'Inter', sans-serif;
  color: #d5d5da;
  font-size: 14px;
`
