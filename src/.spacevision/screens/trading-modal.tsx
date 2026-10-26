"use client"

import { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import {
  X,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Star,
  Filter,
  Search,
  ArrowUpDown,
  Eye,
  MessageCircle,
  Wallet,
  ShoppingCart,
  Tag,
  BarChart3,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import axios from "axios"
import moment from "moment-timezone"
import "moment/locale/pt-br"
import { decrypt } from "@/core/security/encryption"
import NotificationUI from "@/components/notification/card.mnc"
import LoadingPageView from "@/resources/loading/market.loading"
import LogoVision from "@/components/vision/logo"
  
// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const modalSlideIn = keyframes`
  from { opacity: 0; transform: scale(0.9) translateY(-20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`

// Interfaces
interface TradeItem {
  _id: string
  tokenID: string
  nameitem: string
  imagem: string | undefined
  itemValue: number
  priceitem: number
  rarity: string
  type: string
  containerType: string
  itemCondition: string
  createdAt: string
  userId: string
  sellerId?: string
  buyerId?: string
  tradeType: "sell" | "buy" | "auction" | "trade"
  status: "active" | "completed" | "cancelled" | "pending"
  timeLeft?: string
  bids?: number
  currentBid?: number
  auctionEndTime?: string
  isMyTrade?: boolean
}

interface TradingStats {
  totalTrades: number
  totalVolume: number
  activeTrades: number
  completedTrades: number
  myActiveTrades: number
  myCompletedTrades: number
}

interface WalletData {
  balance: number
  usdValue: number
  currency: string
}

// Styled Components
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.151);
  backdrop-filter: blur(1px);
  z-index: 1000;
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
 
  animation: ${fadeIn} 0.3s ease-out;
`

const ModalContainer = styled.div`
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  border: 2px solid #272927;
  border-radius: 1rem;
  width: 85svw;
  
  height: 80svh;
  overflow: hidden;
 
  animation: ${modalSlideIn} 0.3s ease-out;
  display: flex;
  flex-direction: column;
`

const ModalHeader = styled.div`
  padding: 0.8em 1em;
  border-bottom: 1px solid #2d302e;
  display: flex;
  align-items: center;
  justify-content: space-between;
 
 

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: #41b45e;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`

const HeaderTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  background: #2225248d;
  border-radius: 15rem;
  padding: 0.25rem;
  border: 1px solid #2d302e;
`

const TabButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${(props) => (props.$active ? "rgba(67, 241, 111, 0.199)" : "transparent")};
  color: ${(props) => (props.$active ? "#41b45e" : "#9ca3af")};
  border-radius: 25rem;
 
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: ${(props) => (props.$active ? "#41b45e" : "rgba(65, 180, 94, 0.1)")};
    color: ${(props) => (props.$active ? "#41b45e" : "#41b45e")};
  }
`

const CloseButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: none;
  border: none;
  color: #9ca3af;

  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(45, 48, 46, 0.5);
    color: #41b45e;
  }
`

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Sidebar = styled.div`
  width: 300px;
  border-right: 1px solid #2d302e;
  padding: 1.5rem;
  background: rgba(26, 28, 27, 0.5);

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #2d302e;
  }
`

const MainArea = styled.div`
  flex: 1;
  padding: 1.5rem;
  height: 70vh;
  overflow-y:auto;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: linear-gradient(135deg, #222524 0%, #1a1c1b 100%);
  border: 1px solid #2d302e;
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;

  .icon {
    width: 1.5rem;
    height: 1.5rem;
    margin: 0 auto 0.5rem;
    color: #41b45e;
  }

  .value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #41b45e;
    margin-bottom: 0.25rem;
  }

  .label {
    color: #9ca3af;
    font-size: 0.75rem;
  }

  .change {
    font-size: 0.625rem;
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    
    &.positive {
      color: #10b981;
    }
    
    &.negative {
      color: #ef4444;
    }
  }
`

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 1.5rem;

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    background: #1b1b1b;
    border: 1px solid #2d302e;
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    transition: all 0.3s ease;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      outline: none;
      border-color: #41b45e;
      box-shadow: 0 0 0 3px rgba(65, 180, 94, 0.1);
    }
  }

  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
  }
`

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${(props) => (props.$active ? "rgba(65, 180, 94, 0.2)" : "#1b1b1b")};
 
  border-radius: 0.5rem;
  color: ${(props) => (props.$active ? "#41b45e" : "#9ca3af")};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;

  &:hover {
    border-color: #41b45e;
    color: #41b45e;
    background: rgba(65, 180, 94, 0.1);
  }
`

const TradingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`

const TradingCard = styled.div`
  background: linear-gradient(135deg, #222524 0%, #1a1c1b 100%);
  border: 1px solid #2d302e;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(65, 180, 94, 0.1);
    border-color: #41b45e;
  }
`

const CardHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #2d302e;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CarInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .car-image {
    width: 60px;
    height: 40px;
    background: #2d302e;
    border-radius: 0.5rem;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .car-details {
    h4 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      color: white;
    }

    .rarity {
      font-size: 0.75rem;
      color: #41b45e;
      font-weight: 500;
    }
  }
`

const TradeType = styled.div<{ $type: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => {
    switch (props.$type) {
      case "sell":
        return "rgba(239, 68, 68, 0.2)"
      case "buy":
        return "rgba(34, 197, 94, 0.2)"
      case "auction":
        return "rgba(245, 158, 11, 0.2)"
      case "trade":
        return "rgba(147, 51, 234, 0.2)"
      default:
        return "rgba(156, 163, 175, 0.2)"
    }
  }};
  color: ${(props) => {
    switch (props.$type) {
      case "sell":
        return "#ef4444"
      case "buy":
        return "#22c55e"
      case "auction":
        return "#f59e0b"
      case "trade":
        return "#9333ea"
      default:
        return "#9ca3af"
    }
  }};
`

const CardBody = styled.div`
  padding: 1rem;
`

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  .current-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #41b45e;
  }

  .market-price {
    font-size: 0.875rem;
    color: #9ca3af;
    text-decoration: line-through;
  }
`

const TradeDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #9ca3af;

  .detail {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const ActionButton = styled.button<{ $variant?: string }>`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #2d302e;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;

  ${(props) => {
    switch (props.$variant) {
      case "primary":
        return `
          background: #41b45e;
          color: black;
          border-color: #41b45e;
          
          &:hover {
            background: #2d8a42;
            border-color: #2d8a42;
          }
        `
      case "danger":
        return `
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border-color: #ef4444;
          
          &:hover {
            background: rgba(239, 68, 68, 0.3);
          }
        `
      case "secondary":
        return `
          background: none;
          color: #9ca3af;
          
          &:hover {
            border-color: #41b45e;
            color: #41b45e;
            background: rgba(65, 180, 94, 0.1);
          }
        `
      default:
        return `
          background: none;
          color: #9ca3af;
          
          &:hover {
            border-color: #41b45e;
            color: #41b45e;
            background: rgba(65, 180, 94, 0.1);
          }
        `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const WalletInfo = styled.div`
 
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.75rem 0;
    color: #41b45e;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .balance {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
  }

  .usd-value {
    font-size: 0.875rem;
    color: #9ca3af;
  }
`

const QuickFilters = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.75rem 0;
    color: white;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`

const FilterOption = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0.75rem;
  background: ${(props) => (props.$active ? "rgba(65, 180, 94, 0.2)" : "none")};
  border: 1px solid ${(props) => (props.$active ? "#41b45e" : "#2d302e")};
  border-radius: 0.375rem;
  color: ${(props) => (props.$active ? "#41b45e" : "#9ca3af")};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 0.875rem;

  &:hover {
    border-color: #41b45e;
    color: #41b45e;
    background: rgba(65, 180, 94, 0.1);
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #9ca3af;

  .icon {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: #d1d5db;
  }

  p {
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }
`

const CreateTradeButton = styled.button`
  background: linear-gradient(135deg, #41b45e 0%, #2d8a42 100%);
  color: black;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: linear-gradient(135deg, #2d8a42 0%, #41b45e 100%);
    transform: translateY(-1px);
  }
`

interface TradingModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function TradingModal({ isOpen, onClose, userId }: TradingModalProps) {
  moment.locale("pt-br")

  const [activeTab, setActiveTab] = useState("marketplace")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [trades, setTrades] = useState<TradeItem[]>([])
  const [myTrades, setMyTrades] = useState<TradeItem[]>([])
  const [ viewconce, setviewconce] = useState(false)
  const [tradeHistory, setTradeHistory] = useState<TradeItem[]>([])
  const [stats, setStats] = useState<TradingStats>({
    totalTrades: 0,
    totalVolume: 0,
    activeTrades: 0,
    completedTrades: 0,
    myActiveTrades: 0,
    myCompletedTrades: 0,
  })
  
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  // Utility functions
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }

 const formatCurrency2 = (value: number): string => {
    return value.toLocaleString("en-US", {
  
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }
  const showNotification = (message: string) => {
    setNotificationMessage(message)
    setIsFormSubmitted(true)
    setTimeout(() => {
      setIsFormSubmitted(false)
      setNotificationMessage("")
    }, 5000)
  }

 
  // API Functions
  const fetchMarketplaceTrades = async () => {
    try {
      const response = await axios.get("/api/trivo/trading/marketplace")
      const decryptedData = decrypt(response.data)
      const marketData = JSON.parse(decryptedData)
      setTrades(marketData.trades || [])
    } catch (error) {
      console.error("Erro ao buscar trades do marketplace:", error)
    }
  }

  const fetchMyTrades = async () => {
    try {
      const response = await axios.get(`/api/trivo/trading/my-trades?userId=${userId}`)
      const decryptedData = decrypt(response.data)
      const myTradesData = JSON.parse(decryptedData)
      setMyTrades(myTradesData.activeTrades || [])
      setTradeHistory(myTradesData.completedTrades || [])
    } catch (error) {
      console.error("Erro ao buscar minhas negociações:", error)
    }
  }

  const fetchTradingStats = async () => {
    try {
      const response = await axios.get(`/api/trivo/trading/stats?userId=${userId}`)
      const decryptedData = decrypt(response.data)
      const statsData = JSON.parse(decryptedData)
      setStats(statsData)
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
    }
  }
 
  const handleBuyItem = async (tradeId: string, price: number) => {
    setActionLoading(tradeId)
    try {
      const response = await axios.post("/api/trivo/trading/buy", {
        tradeId,
        buyerId: userId,
        price,
      })

      if (response.data.success) {
        showNotification("Item comprado com sucesso!")
        await fetchMarketplaceTrades()
   
        await fetchTradingStats()
      } else {
        showNotification(response.data.message || "Erro ao comprar item")
      }
    } catch (error: any) {
      showNotification(error?.response?.data?.message || "Erro ao comprar item")
    } finally {
      setActionLoading(null)
    }
  }

  const handleMakeBid = async (tradeId: string, bidAmount: number) => {
    setActionLoading(tradeId)
    try {
      const response = await axios.post("/api/trivo/trading/bid", {
        tradeId,
        bidderId: userId,
        bidAmount,
      })

      if (response.data.success) {
        showNotification("Oferta realizada com sucesso!")
        await fetchMarketplaceTrades()
      } else {
        showNotification(response.data.message || "Erro ao fazer oferta")
      }
    } catch (error: any) {
      showNotification(error?.response?.data?.message || "Erro ao fazer oferta")
    } finally {
      setActionLoading(null)
    }
  }

  const handleSellToOffer = async (tradeId: string) => {
    setActionLoading(tradeId)
    try {
      const response = await axios.post("/api/trivo/trading/sell-to-offer", {
        tradeId,
        sellerId: userId,
      })

      if (response.data.success) {
        showNotification("Item vendido com sucesso!")
        await fetchMarketplaceTrades()
         
        await fetchTradingStats()
      } else {
        showNotification(response.data.message || "Erro ao vender item")
      }
    } catch (error: any) {
      showNotification(error?.response?.data?.message || "Erro ao vender item")
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelTrade = async (tradeId: string) => {
    setActionLoading(tradeId)
    try {
      const response = await axios.post("/api/trivo/trading/cancel", {
        tradeId,
        userId,
      })

      if (response.data.success) {
        showNotification("Negociação cancelada com sucesso!")
        await fetchMyTrades()
        await fetchMarketplaceTrades()
      } else {
        showNotification(response.data.message || "Erro ao cancelar negociação")
      }
    } catch (error: any) {
      showNotification(error?.response?.data?.message || "Erro ao cancelar negociação")
    } finally {
      setActionLoading(null)
    }
  }

  const handleEditTrade = async (tradeId: string, newPrice: number) => {
    setActionLoading(tradeId)
    try {
      const response = await axios.put("/api/trivo/trading/edit", {
        tradeId,
        userId,
        newPrice,
      })

      if (response.data.success) {
        showNotification("Negociação editada com sucesso!")
        await fetchMyTrades()
        await fetchMarketplaceTrades()
      } else {
        showNotification(response.data.message || "Erro ao editar negociação")
      }
    } catch (error: any) {
      showNotification(error?.response?.data?.message || "Erro ao editar negociação")
    } finally {
      setActionLoading(null)
    }
  }

  // Filter functions
  const getFilteredTrades = (tradeList: TradeItem[]) => {
    let filtered = tradeList.filter((trade) => trade.nameitem.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeFilters.length > 0) {
      filtered = filtered.filter((trade) => activeFilters.includes(trade.tradeType))
    }

    return filtered
  }

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  // Load data on mount and tab change
  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true)
      Promise.all([
        
        fetchTradingStats(),
        activeTab === "marketplace" ? fetchMarketplaceTrades() : Promise.resolve(),
        activeTab !== "marketplace" ? fetchMyTrades() : Promise.resolve(),
      ]).finally(() => setLoading(false))
    }
  }, [isOpen, userId, activeTab])

  // Get current data based on active tab
  const getCurrentTrades = () => {
    switch (activeTab) {
      case "marketplace":
        return getFilteredTrades(trades)
      case "my-trades":
        return getFilteredTrades(myTrades)
      case "history":
        return getFilteredTrades(tradeHistory)
      default:
        return []
    }
  }

  const currentTrades = getCurrentTrades()

  return (
    <>
      {isFormSubmitted && <NotificationUI message={notificationMessage} />}

      <ModalOverlay $isOpen={isOpen} onClick={onClose}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <LogoVision />
            <HeaderTabs>
              <TabButton $active={activeTab === "marketplace"} onClick={() => (setviewconce(false),setActiveTab("marketplace"))}>
                Marketplace
              </TabButton>
              <TabButton $active={activeTab === "my-trades"} onClick={() => (setviewconce(false),setActiveTab("my-trades"))}>
                Minhas Negociações
              </TabButton>
              <TabButton $active={activeTab === "history"} onClick={() => (setviewconce(false),setActiveTab("history"))}>
                Histórico
              </TabButton>
               
            </HeaderTabs>
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          <ModalContent>
         
            <MainArea>
           

             {!viewconce  && ( 
               <>
                  <SearchBar>
                <Search />
                <input
                  type="text"
                  placeholder="Buscar TVLs no marketplace..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchBar>

              <FilterBar>
                <FilterButton $active={activeFilters.length === 0} onClick={() => setActiveFilters([])}>
                  <Filter size={16} />
                  Todos
                </FilterButton>
                <FilterButton $active={activeFilters.includes("sell")} onClick={() => toggleFilter("sell")}>
                  <Tag size={16} />
                  Vendas
                </FilterButton>
                <FilterButton $active={activeFilters.includes("auction")} onClick={() => toggleFilter("auction")}>
                  <Clock size={16} />
                  Leilões
                </FilterButton>
                <FilterButton $active={activeFilters.includes("buy")} onClick={() => toggleFilter("buy")}>
                  <ShoppingCart size={16} />
                  Compras
                </FilterButton>
                <FilterButton $active={activeFilters.includes("trade")} onClick={() => toggleFilter("trade")}>
                  <ArrowUpDown size={16} />
                  Trocas
                </FilterButton>
              </FilterBar>

              {loading ? (
                <LoadingPageView />
              ) : currentTrades.length === 0 ? (
                <EmptyState>
                  <TrendingUp className="icon" />
                  <h3>Nenhuma negociação encontrada</h3>
                  <p>
                    {activeTab === "marketplace"
                      ? "Não há itens disponíveis no marketplace no momento."
                      : activeTab === "my-trades"
                        ? "Você não possui negociações ativas."
                        : "Você não possui histórico de negociações."}
                  </p>
                  {activeTab === "my-trades" && (
                    <CreateTradeButton onClick={onClose}>
                      <Plus size={16} />
                      Criar Nova Negociação
                    </CreateTradeButton>
                  )}
                </EmptyState>
              ) : (
                <TradingGrid>
                  {currentTrades.map((trade) => (
                    <TradingCard key={trade._id}>
                      <CardHeader>
                        <CarInfo>
                          <div className="car-image">
                            <Image
                              src={trade.imagem || "/placeholder.svg"}
                              alt={trade.nameitem}
                              width={60}
                              height={40}
                              crossOrigin="anonymous"
                            />
                          </div>
                          <div className="car-details">
                            <h4>{trade.nameitem}</h4>
                            <div className="rarity">{trade.rarity}</div>
                          </div>
                        </CarInfo>
                        <TradeType $type={trade.tradeType}>
                          {trade.tradeType === "sell" && "Venda"}
                          {trade.tradeType === "buy" && "Compra"}
                          {trade.tradeType === "auction" && "Leilão"}
                          {trade.tradeType === "trade" && "Troca"}
                        </TradeType>
                      </CardHeader>

                      <CardBody>
                        <PriceInfo>
                          <div className="current-price">{formatCurrency(trade.currentBid || trade.itemValue)}</div>
                          {trade.priceitem !== trade.itemValue && (
                            <div className="market-price">{formatCurrency(trade.priceitem)}</div>
                          )}
                        </PriceInfo>

                        <TradeDetails>
                          <div className="detail">
                            <Users size={14} />
                            {trade.isMyTrade ? "Minha" : "Outro"}
                          </div>
                          <div className="detail">
                            <Clock size={14} />
                            {trade.timeLeft || moment(trade.createdAt).fromNow()}
                          </div>
                          <div className="detail">
                            <ArrowUpDown size={14} />
                            {trade.bids || 0} ofertas
                          </div>
                          <div className="detail">
                            <Star size={14} />
                            {trade.rarity}
                          </div>
                        </TradeDetails>

                        <CardActions>
                          {activeTab === "marketplace" && !trade.isMyTrade && (
                            <>
                              {trade.tradeType === "sell" && (
                                <ActionButton
                                  $variant="primary"
                                  onClick={() => handleBuyItem(trade._id, trade.itemValue)}
                                  disabled={actionLoading === trade._id}
                                >
                                  <ShoppingCart size={16} />
                                  {actionLoading === trade._id ? "Comprando..." : "Comprar Agora"}
                                </ActionButton>
                              )}
                              {trade.tradeType === "auction" && (
                                <ActionButton
                                  $variant="primary"
                                  onClick={() => handleMakeBid(trade._id, (trade.currentBid || trade.itemValue) + 1000)}
                                  disabled={actionLoading === trade._id}
                                >
                                  <TrendingUp size={16} />
                                  {actionLoading === trade._id ? "Ofertando..." : "Fazer Oferta"}
                                </ActionButton>
                              )}
                              {trade.tradeType === "buy" && (
                                <ActionButton
                                  $variant="primary"
                                  onClick={() => handleSellToOffer(trade._id)}
                                  disabled={actionLoading === trade._id}
                                >
                                  <DollarSign size={16} />
                                  {actionLoading === trade._id ? "Vendendo..." : "Vender"}
                                </ActionButton>
                              )}
                            </>
                          )}

                          {(activeTab === "my-trades" || trade.isMyTrade) && (
                            <>
                              <ActionButton
                                $variant="secondary"
                                onClick={() => handleEditTrade(trade._id, trade.itemValue)}
                                disabled={actionLoading === trade._id}
                              >
                                <Edit size={16} />
                              </ActionButton>
                              <ActionButton
                                $variant="danger"
                                onClick={() => handleCancelTrade(trade._id)}
                                disabled={actionLoading === trade._id}
                              >
                                <Trash2 size={16} />
                              </ActionButton>
                            </>
                          )}

                          <ActionButton $variant="secondary">
                            <Eye size={16} />
                          </ActionButton>
                          <ActionButton $variant="secondary">
                            <MessageCircle size={16} />
                          </ActionButton>
                        </CardActions>
                      </CardBody>
                    </TradingCard>
                  ))}
                </TradingGrid>
              )}
               </>
             )}

        
            </MainArea>

              
          </ModalContent>
        </ModalContainer>
      </ModalOverlay>
    </>
  )
}
