"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import styled, { keyframes } from "styled-components"
import {
  X,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  Search,
  Eye,
  Edit,
  Star,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Store,
  DollarSign,
  TrendingUp,
  Circle,
  KeySquare,
} from "lucide-react"
import Image from "next/image"
import axios from "axios"
import moment from "moment-timezone"
import "moment/locale/pt-br"
import { LineChart, Line, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import type { TooltipProps } from "recharts"
import { nvxre_tokenvirtual } from '../../../hooks/tokenvirtual';
import { decrypt } from '../../../core/security/encryption';
import NotificationUI from '../../components/notification/card.mnc';
import LoadingPageView from '../../resources/loading/market.loading';
import router from 'next/router';
import ROUTENVX from "@/routes/routes"
import LogoVision from "@/components/vision/logo"
import { Diagram, Key, Money, MouseCircle, RepeateMusic } from "iconsax-react"
 

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

interface DataPoint {
  timestamp: string
  value: number
}

interface CustomTickProps {
  x?: number
  y?: number
  payload?: {
    value?: string | number
  }
}


interface CustomSelectProps<T extends string> {
  value: T | null;
  onChange: (value: T | null) => void;
  options: { value: T; label: string }[];
  placeholder?: string;
}
 
interface GarageModalProps {
  isOpen: boolean
  onClose: () => void
  id: string
  username?: string
}

export function GarageModal({ isOpen, onClose, id, username }: GarageModalProps) {
  moment.locale("pt-br")

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [items, setItems] = useState<Item[]>([])
  const [items2, setItems2] = useState<Item[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [loadingx, setLoadingx] = useState(false)
  const [loadingItem, setLoadingItem] = useState<any>(null)

  // Estados para opções de anúncio
  const [showSellOptions, setShowSellOptions] = useState(false)
  const [sellType, setSellType] = useState<"direct" | "advertise" | "trade">("direct")
  const [customPrice, setCustomPrice] = useState<number | null>(null)
  const [rawPriceInput, setRawPriceInput] = useState<string>("")
  const [adDuration, setAdDuration] = useState<number>(7)

  // Estados para filtros
  const [filterRarity, setFilterRarity] = useState<string | null>(null)
  const [filterSold, setFilterSold] = useState<"anunciado" | "recebido" | null>(null)
  const [sortBy, setSortBy] = useState<"recent" | "valueAsc" | "valueDesc" | null>(null)
  const [filterValue, setFilterValue] = useState<number | null>(null)
  const [rawInput, setRawInput] = useState<string>("")

  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")

  const { isLoadingtvl, errorwallettvl, Datawallettvl, mutatewallettvl } = nvxre_tokenvirtual({ id: id })

  // Utility functions
  const formatInputValue = (value: number): string => {
    return (value / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const numericOnly = raw.replace(/\D/g, "")
    const parsed = Number.parseInt(numericOnly)

    if (!isNaN(parsed)) {
      setFilterValue(parsed / 100)
      setRawInput(formatInputValue(parsed))
    } else {
      setFilterValue(null)
      setRawInput("")
    }
  }

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const numericOnly = raw.replace(/\D/g, "")
    const parsed = Number.parseInt(numericOnly)

    if (!isNaN(parsed)) {
      setCustomPrice(parsed / 100)
      setRawPriceInput(formatInputValue(parsed))
    } else {
      setCustomPrice(null)
      setRawPriceInput("")
    }
  }

  const getFilteredItems = () => {
    let allItems = [...items, ...items2]

    if (filterRarity) {
      allItems = allItems.filter((item) => item.rarity === filterRarity)
    }

    if (filterSold) {
      allItems = allItems.filter((item) => (filterSold === "anunciado" ? item.sold : !item.sold))
    }

    if (filterValue !== null) {
      allItems = allItems.filter((item) => item.itemValue >= filterValue)
    }

    if (searchTerm) {
      allItems = allItems.filter((item) => item.nameitem.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (sortBy === "recent") {
      allItems = allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === "valueAsc") {
      allItems = allItems.sort((a, b) => (a.itemValue || 0) - (b.itemValue || 0))
    } else if (sortBy === "valueDesc") {
      allItems = allItems.sort((a, b) => (b.itemValue || 0) - (a.itemValue || 0))
    }

    return allItems
  }

  const openModal = (item: Item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const openSellOptions = (item: Item) => {
    setSelectedItem(item)
    setCustomPrice(item.itemValue)
    setRawPriceInput(formatInputValue(item.itemValue * 100))
    setShowSellOptions(true)
  }

  const closeSellOptions = () => {
    setShowSellOptions(false)
    setSelectedItem(null)
    setSellType("direct")
    setCustomPrice(null)
    setRawPriceInput("")
    setAdDuration(7)
  }

  const handleSellItem = async (itemId: string, price: number, isForTrade = false) => {
    setLoadingx(true)
    setLoadingItem(itemId)

    try {
      const response = await axios.post("/api/autentic/sell.tvl", {
        userId: id,
        itemId,
        price,
        forTrade: isForTrade,
        sellType: sellType,
        adDuration: sellType === "advertise" ? adDuration : undefined,
      })

      if (response.data.success) {
        setItems((prevItems) => prevItems.filter((item) => item.tokenID !== itemId))
        setItems2((prevItems) => prevItems.filter((item) => item.tokenID !== itemId))

        const successMessage =
          sellType === "advertise"
            ? "Item anunciado com sucesso no mercado!"
            : sellType === "trade"
              ? "Item marcado para trade/upgrader!"
              : "Item vendido com sucesso!"

        setNotificationMessage(successMessage)
        setIsFormSubmitted(true)
        setTimeout(() => {
          setIsFormSubmitted(false)
          setNotificationMessage("")
        }, 5000)
      } else {
        const message = response.data.message || "Erro ao processar item"
        setNotificationMessage(message)
        setIsFormSubmitted(true)
        setTimeout(() => {
          setIsFormSubmitted(false)
          setNotificationMessage("")
        }, 5000)
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Erro ao processar item"
      setNotificationMessage(message)
      setIsFormSubmitted(true)
      setTimeout(() => {
        setIsFormSubmitted(false)
        setNotificationMessage("")
      }, 5000)
    } finally {
      setLoadingx(false)
      setShowSellOptions(false)
      closeSellOptions()
    }
  }

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("en-US", {

      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const getValueDifferencexc = (baseValue: number, newValue: number): string => {
    const difference = newValue - baseValue
    return formatCurrency(difference)
  }

  const rarityColors: { [key: string]: string } = {
    comum: "#49484b",
    raro: "#eb2647",
    épico: "#f13dd3",
  }

  useEffect(() => {
    if (!isLoadingtvl && Datawallettvl) {
      setItems(Datawallettvl.items)
      setItems2(Datawallettvl.mytvls)
    }
  }, [Datawallettvl, isLoadingtvl])

  const filteredItems = getFilteredItems()
  const totalItems = items.length + items2.length
  const totalValue = [...items, ...items2].reduce((sum, item) => sum + (item.itemValue || 0), 0)
  const favoriteCount = [...items, ...items2].filter((item) => !item.sold).length
  const tradableCount = [...items, ...items2].filter((item) => item.sold).length

  // Item Detail Modal Component
  const ItemModal: React.FC<{ item: Item | null; onClose: () => void }> = ({ item, onClose }) => {
    const [owners, setOwners] = useState<{ name: string; avatar: string }[]>([])
    const [currentOwner, setCurrentOwner] = useState<{ name: string; avatar: string } | null>(null)
    const [sortedHistory, setSortedHistory] = useState<
      (Item["valueHistory"] extends (infer U)[] | undefined ? U : undefined)[]
    >([])
    const [data, setData] = useState<DataPoint[]>([])

    useEffect(() => {
      if (item) {
        const sorted = (item.valueHistory || []).sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )
        setSortedHistory(sorted)

        const baseValue = item.priceitem

        const newData: DataPoint[] = [
          {
            timestamp: moment(item.createdAt).format("DD/MM/YYYY"),
            value: baseValue,
          },
          ...sorted.map((entry) => ({
            timestamp: moment(entry.timestamp).format("DD/MM/YYYY"),
            value: entry.newValue,
          })),
        ]
        setData(newData)
      }
    }, [item])

    useEffect(() => {
      const fetchOwners = async () => {
        if (!item?.userId) return

        try {
          const currentOwnerResponse = await axios.get(`/api/nvxre/codeims/prosearch?userId=${item.userId}`)
          const currentOwnerData = decrypt(currentOwnerResponse.data)
          const currentOwnerArray = JSON.parse(currentOwnerData)
          const currentOwnerInfo = currentOwnerArray[0]
          setCurrentOwner({
            name: currentOwnerInfo.name,
            avatar: currentOwnerInfo.avatar,
          })

          if (item.previousOwners && item.previousOwners.length > 0) {
            const sortedPreviousOwners = [...item.previousOwners].reverse()

            const ownerPromises = sortedPreviousOwners.map(async (ownerId) => {
              const response = await axios.get(`/api/nvxre/codeims/prosearch?userId=${ownerId}`)
              const datawre = decrypt(response.data)
              const reformInfoArray = JSON.parse(datawre)
              const reformInfo = reformInfoArray[0]
              return {
                name: reformInfo.name,
                avatar: reformInfo.avatar,
              }
            })

            const ownersData = await Promise.all(ownerPromises)
            setOwners(ownersData)
          }
        } catch (error) {
          console.error("Erro ao buscar dados dos proprietários:", error)
        }
      }

      fetchOwners()
    }, [item])

    if (!item) return null

    const CustomTooltip: React.FC<TooltipProps<any, any>> = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const { name, value } = payload[0].payload
        const numericValue = typeof value === "number" ? value : Number.parseFloat(value as string) || 0

        return (
          <CustomTooltipWrapper>
            <Top>
              <p>{name}</p>
              <p>{formatCurrency(numericValue)}</p>
            </Top>
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-chart-area-line-filled"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#b7b8c4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M15.22 9.375a1 1 0 0 1 1.393 -.165l.094 .083l4 4a1 1 0 0 1 .284 .576l.009 .131v5a1 1 0 0 1 -.883 .993l-.117 .007h-16.022l-.11 -.009l-.11 -.02l-.107 -.034l-.105 -.046l-.1 -.059l-.094 -.07l-.06 -.055l-.072 -.082l-.064 -.089l-.054 -.096l-.016 -.035l-.04 -.103l-.027 -.106l-.015 -.108l-.004 -.11l.009 -.11l.019 -.105c.01 -.04 .022 -.077 .035 -.112l.046 -.105l.059 -.1l4 -6a1 1 0 0 1 1.165 -.39l.114 .05l3.277 1.638l3.495 -4.369z"
                  strokeWidth="0"
                  fill="currentColor"
                />
                <path
                  d="M15.232 3.36a1 1 0 0 1 1.382 -.15l.093 .083l4 4a1 1 0 0 1 -1.32 1.497l-.094 -.083l-3.226 -3.225l-4.299 5.158a1 1 0 0 1 -1.1 .303l-.115 -.049l-3.254 -1.626l-2.499 3.332a1 1 0 0 1 -1.295 .269l-.105 -.069a1 1 0 0 1 -.269 -1.295l.069 -.105l3 -4a1 1 0 0 1 1.137 -.341l.11 .047l3.291 1.645l4.494 -5.391z"
                  strokeWidth="0"
                  fill="currentColor"
                />
              </svg>
              <text>{formatCurrency(numericValue)}</text>
            </p>
            <Image src="/nvrp/20240520_081457.png" alt="novision" width={21} height={21} />
          </CustomTooltipWrapper>
        )
      }
      return null
    }

    const CustomYAxisTick: React.FC<CustomTickProps> = (props) => {
      const { x, y, payload } = props
      const numericValue =
        typeof payload?.value === "number" ? payload.value : Number.parseFloat(payload?.value as string) || 0

      return (
        <YAxisTickWrapper transform={`translate(${x},${y})`}>
          <text x={-24} y={0} dy={4} textAnchor="middle">
            {formatCurrency(numericValue)}
          </text>
        </YAxisTickWrapper>
      )
    }

    const formatYAxisTick = (tick: number) => {
      return tick.toFixed(0)
    }

    return (
      <ItemModalOverlay>
        <ItemModalContent>
          <ItemModalCloseButton onClick={onClose}>
            <i className="fi fi-bs-cross" />
          </ItemModalCloseButton>

          <div className="objs">
            <div className="flex flex-col justify-center items-center">
            <MarginCb>
              <ItemModalImage src={item.imagem} alt={item.nameitem} />
              <ItemModalTitle>{item.nameitem}      {item.rented && (
      <div
        style={{
         
          background: "#c9bb3f",
          color: "#222",
          padding: "2px 8px",
          borderRadius: "8px",
          fontWeight: 700,
          fontSize: "0.8rem",
        }}
      >
        ALUGADO
      </div>
    )}</ItemModalTitle>
              <ItemModalInfo>Token ID: {item.tokenID}</ItemModalInfo>
              <ItemModalInfo>Data de Criação: {moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}</ItemModalInfo>
              <ItemModalInfo>Valor Base: {formatCurrency(item.priceitem)}</ItemModalInfo>
              {item.itemValue && (
                <>
                  <ItemModalInfo>Valor Atual: {formatCurrency(item.itemValue)} Bits</ItemModalInfo>
                  <ItemModalInfo>Diferença: {getValueDifferencexc(item.priceitem, item.itemValue)}</ItemModalInfo>
                </>
              )}
              <ItemModalInfo>Raridade: {item.rarity}</ItemModalInfo>
            
              <ItemModalInfo>Condição: {item.itemCondition}</ItemModalInfo>
              <ItemModalInfo>
                Tipo de Token: {item.type && item.type} {item.containerType && <>Container - {item.containerType}</>}
              </ItemModalInfo>
              <ItemModalInfo>Adquirido no dia: {moment(item.createdAt).format("LLL")} Hrs</ItemModalInfo>
            </MarginCb>

 {item.rented && (
     <ButtonReedirec onClick={() => router.push(ROUTENVX.rental)}>
          Verificar status aluguel
     </ButtonReedirec>
    )}
     </div>
            <PreviousOwnersContainer>
              <h3>Proprietario Atual</h3>
              {currentOwner ? (
                <OwnerItem>
                  <Image className="keyicon" src="/icons/keycar.webp" alt="chave item" height={30} width={30} />
                  <img className="avatar" src={currentOwner.avatar || "/placeholder.svg"} alt={currentOwner.name} />
                  <span>{currentOwner.name}</span>
                </OwnerItem>
              ) : (
                <p>Não há informações sobre o proprietário atual.</p>
              )}

              {owners.length > 0 && (
                <>
                  <h3>Antigos Proprietários</h3>
                  {owners.map((owner, index) => (
                    <OwnerItem key={index}>
                      <h1>{index + 1}</h1>
                      <img className="avatar" src={owner.avatar || "/placeholder.svg"} alt={owner.name} />
                      <span>{owner.name}</span>
                    </OwnerItem>
                  ))}
                </>
              )}
            </PreviousOwnersContainer>
          </div>

          {item.valueHistory && (
            <ChartContainer>
              <StyledChartWrapper>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <YAxis domain={[0, "dataMax"]} tickFormatter={formatYAxisTick} tick={<CustomYAxisTick />} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="value" strokeWidth={2} dot={false} stroke="#24e665" />
                  </LineChart>
                </ResponsiveContainer>
              </StyledChartWrapper>
              <ModalDetail>
                <p>O gráfico acima mostra as mudanças no valor do item em relação ao valor base.</p>
              </ModalDetail>
            </ChartContainer>
          )}
        </ItemModalContent>
      </ItemModalOverlay>
    )
  }

  // Sell Options Modal Component
  const SellOptionsModal: React.FC = () => {
    if (!selectedItem || !showSellOptions) return null

    const handleConfirmSell = () => {
      const finalPrice = customPrice || selectedItem.itemValue
      const isForTrade = sellType === "trade"
      handleSellItem(selectedItem.tokenID, finalPrice, isForTrade)
    }

    return (
      <ModalOverlay $isOpen={showSellOptions} onClick={closeSellOptions}>
        <SellOptionsContainer onClick={(e) => e.stopPropagation()}>
          <SellOptionsHeader>
            <div></div>
             <LogoVision />
                <div></div>
          </SellOptionsHeader>

          <ItemPreview>
            <img src={selectedItem.imagem || "/placeholder.svg"} alt={selectedItem.nameitem} />
            <div>
              <h3>{selectedItem.nameitem}</h3>
              <p>Token ID: {selectedItem.tokenID}</p>
              <p>Valor atual: {formatCurrency(selectedItem.itemValue)} Bits</p>
            </div>
          </ItemPreview>

          <SellTypeSelector>

            <SellTypeOption $active={sellType === "advertise"} onClick={() => setSellType("advertise")}>
             <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M16.42 7.951a6.253 6.253 0 0 1 0 8.84 6.253 6.253 0 0 1-8.84 0 6.253 6.253 0 0 1 0-8.84 6.253 6.253 0 0 1 8.84 0Z" fill="#555555"></path><path opacity=".4" d="M8.25 22.389c-.09 0-.19-.02-.28-.05-2.25-.9-4.07-2.49-5.29-4.59a10.6 10.6 0 0 1-1.341-6.73c.05-.41.44-.7.84-.65.41.05.7.43.65.84-.26 2.02.14 4.02 1.15 5.78a9.104 9.104 0 0 0 4.54 3.94c.38.16.57.59.42.98-.11.3-.4.48-.69.48ZM5.85 5.23c-.22 0-.44-.1-.59-.29-.26-.33-.2-.8.13-1.05C7.3 2.4 9.58 1.61 12 1.61c2.36 0 4.61.76 6.5 2.2A.749.749 0 1 1 17.59 5 9.111 9.111 0 0 0 12 3.11c-2.08 0-4.05.68-5.69 1.96-.14.11-.3.16-.46.16ZM15.75 22.39c-.3 0-.58-.18-.7-.47a.76.76 0 0 1 .42-.98c1.93-.78 3.5-2.14 4.54-3.94a9.044 9.044 0 0 0 1.15-5.78c-.05-.41.24-.79.65-.84.4-.05.79.24.84.65.3 2.35-.16 4.68-1.34 6.73-1.21 2.1-3.04 3.68-5.29 4.59-.08.02-.17.04-.27.04Z" fill="#555555"></path></svg>
              <div>
                <h4>Anunciar no mercado</h4>
                <p>Venda instantânea pelo valor de mercado</p>
              </div>
            </SellTypeOption>
 

            <SellTypeOption $active={sellType === "trade"} onClick={() => setSellType("trade")}>
               <RepeateMusic size="30" color="#616761" variant="Bold"/>
              <div>
                <h4>Negocie seu token</h4>
                <p>Troque seu TVL por outro mais valorizado em upgrades</p>
              </div>
            </SellTypeOption>




          <p className="font-['ProximaNova-Italic'] text-[12px] text-[#5c5f5d]">
           Ao confirmar o tipo de negociação, tenha certeza da sua escolha antes de clicar em confirmar. Após anunciar ou marcar o token, a ação é irreversível e não poderá ser alterada.
          </p>

          </SellTypeSelector>

       
          <ActionButtons>
            <ConfirmButton onClick={handleConfirmSell} disabled={loadingx}>
              {loadingx
                ? "Processando..."
                : sellType === "advertise"
                  ? "Anunciar Item"
                  : sellType === "trade"
                    ? "Marcar Token"
                    : "Negociar "}
            </ConfirmButton>
            <CancelButton onClick={closeSellOptions}>Cancelar</CancelButton>
          </ActionButtons>
        </SellOptionsContainer>
      </ModalOverlay>
    )
  }

    
  return (
    <>
      {isFormSubmitted && <NotificationUI message={notificationMessage} />}

      <ModalOverlay $isOpen={isOpen} onClick={onClose}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <LogoVision />
            <HeaderActions>
              <ViewToggle>
                <ViewButton $active={viewMode === "grid"} onClick={() => setViewMode("grid")}>
                  <Grid3X3 size={16} />
                </ViewButton>
                <ViewButton $active={viewMode === "list"} onClick={() => setViewMode("list")}>
                  <List size={16} />
                </ViewButton>
              </ViewToggle>
            
           
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>
            </HeaderActions>
          </ModalHeader>

          <ModalContent>
              <StatsBar>
              <StatCard>
                <div className="value">{totalItems}</div>
                <div className="label">Total de Itens</div>
              </StatCard>
              <StatCard>
                <div className="value">{formatCurrency(totalValue)}</div>
                <div className="label">Valor Total</div>
              </StatCard>
              <StatCard>
                <div className="value">{favoriteCount}</div>
                <div className="label">Disponíveis</div>
              </StatCard>
              <StatCard>
                <div className="value">{tradableCount}</div>
                <div className="label">Anunciados</div>
              </StatCard>
            </StatsBar>
            <SearchBar>
              <Search />
              <input
                type="text"
                placeholder="Buscar veículos na garagem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>



            <FilterContainer>

 
             <FilterContainer>
  <FilterInput
    type="text"
    placeholder="Valor mínimo"
    value={rawInput}
    onChange={handleInputChange}
  />

  <CustomSelect
    options={[
      { label: "Comum", value: "comum" },
      { label: "Raro", value: "raro" },
      { label: "Épico", value: "épico" },
    ]}
    value={filterRarity}
    onChange={setFilterRarity}
    placeholder="Todas as Raridades"
  />

  <CustomSelect
    options={[
      { label: "Anunciado", value: "anunciado" },
      { label: "Recebido", value: "recebido" },
    ]}
    value={filterSold}
    onChange={setFilterSold}
    placeholder="Todos"
  />

  <CustomSelect
    options={[
      { label: "Mais recente", value: "recent" },
      { label: "Menor valor", value: "valueAsc" },
      { label: "Maior valor", value: "valueDesc" },
    ]}
    value={sortBy}
    onChange={setSortBy}
    placeholder="Ordenar por"
  />
</FilterContainer>

            </FilterContainer>

           

            {errorwallettvl ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                <h4>Algo aconteceu aqui..</h4>
                <p>{errorwallettvl}</p>
              </div>
            ) : (
              <CarsGrid $viewMode={viewMode}>
                {isLoadingtvl ? (
                  <LoadingPageView />
                ) : (
                  filteredItems.map((item) => (
                    <CarCard key={item._id} $viewMode={viewMode} >
                      <CarImage $viewMode={viewMode}  onClick={() => openModal(item)}>
                        <Image
                          src={item.imagem || "/placeholder.svg"}
                          alt={item.nameitem}
                          width={viewMode === "list" ? 150 : 300}
                          height={viewMode === "list" ? 100 : 200}
                          crossOrigin="anonymous"
                        />
                        <div className="rarity-badge" style={{ backgroundColor: rarityColors[item.rarity] || "#ccc" }}>
                          {item.rarity}
                        </div>
                         {item.rented && (
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          background: "#c9bb3f",
          color: "#222",
          padding: "2px 8px",
          borderRadius: "8px",
          fontWeight: 700,
          fontSize: "0.8rem",
        }}
      >
        ALUGADO
      </div>
    )}
                      </CarImage>

                      <CarInfo $viewMode={viewMode}>
                        <CarName>{item.nameitem}</CarName>
                        <CarSpecs $viewMode={viewMode}>
                          <div className="spec">
                          <img src={'/icons/market/omkxh8.webp'} alt="Bits" height={24} width={24} />
                         <CarPrice>{formatCurrency(item.itemValue || 0)}</CarPrice>
                          </div>
                          <div className="spec">
                            <Settings size={14} />
                            {item.containerType || item.type || "Desconhecido"}
                          </div>
                          <div className="spec">
                            <Calendar size={14} />
                            {moment(item.createdAt).format("DD/MM/YYYY")}
                          </div>
                          <div className="spec">
                            <Fuel size={14} />
                            {item.itemCondition}
                          </div>
                        </CarSpecs>
                      </CarInfo>

                      <CarActions $viewMode={viewMode}>
       
                        <div className='p-1' style={{ display: "flex", gap: "0.5rem" }}>
                       
                          <div >  
                            {!item.sold ?   
                            <Key size="20" color="#d7e2da" variant="Bulk"/> :  
                            <img src={'/icons/market/bunasdbyua.webp'} alt="alert" height={24} width={24} />}
                          
                          </div>
                   
                        </div>

                               {!item.sold ? (
 item.rented &&  !item.isActive  ?
  <div
      style={{
        color: "#c92e3b",
        fontSize: "0.75rem",
        fontWeight: "600",
        padding: "0.5rem",
      }}
    >
     Aluguel Expirado
    </div>
    :  item.rented ? (
    <div
      style={{
        color: "#a7913d",
        fontSize: "0.75rem",
        fontWeight: "600",
        padding: "0.5rem",
      }}
    >
      Não negociável
    </div>
  ) : (
    <SellButton onClick={() => openSellOptions(item)}>Negociar</SellButton>
  )
) : (
  <div
    style={{
      color: "#ec2626",
      fontSize: "0.75rem",
      fontWeight: "600",
      padding: "0.5rem",
    }}
  >
    ANUNCIADO
  </div>
) }
                      </CarActions>
                    </CarCard>
                  ))
                )}
              </CarsGrid>
            )}
          </ModalContent>
        </ModalContainer>
      </ModalOverlay>

      {/* Item Detail Modal */}
      {isModalOpen && <ItemModal item={selectedItem} onClose={closeModal} />}

      {/* Sell Options Modal */}
      <SellOptionsModal />
    </>
  )
}

 
export function CustomSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <SelectContainer ref={ref}>
      <SelectHeader isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        {selectedOption ? selectedOption.label : placeholder || "Selecione..."}
        <span>{isOpen ? "▲" : "▼"}</span>
      </SelectHeader>
      {isOpen && (
        <OptionsList>
          <OptionItem
            selected={value === null}
            onClick={() => {
              onChange(null);
              setIsOpen(false);
            }}
          >
            Todos
          </OptionItem>
          {options.map((option) => (
            <OptionItem
              key={option.value}
              selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </OptionItem>
          ))}
        </OptionsList>
      )}
    </SelectContainer>
  );
}

const SelectContainer = styled.div`
  position: relative;
  width: 200px;
  user-select: none;
`;

const SelectHeader = styled.div<{ isOpen: boolean }>`
  padding: 10px 15px;
border: 2px solid #242524;
  border-radius: 36px;
 
   cursor: var(--f-cursor-pointer);
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  font-family: 'InterSemiBold';
  align-items: center;
  box-shadow: ${({ isOpen }) => (isOpen ? "0 0 5px rgba(0,0,0,0.2)" : "none")};
`;

const OptionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 4px;
  border: 2px solid #242524;
  border-radius: 16px;
  color: white;
  background: #1b1d1c;
  max-height: 180px;
   font-family: 'Inter';
  overflow-y: auto;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 0;
  list-style: none;
`;

const OptionItem = styled.li<{ selected: boolean }>`
  padding: 10px 15px;
   cursor: var(--f-cursor-pointer);
  margin: 0.4em;
  background-color: ${({ selected }) => (selected ? "#4a7454" : "transparent")};
  color: ${({ selected }) => (selected ? "white" : "#333")};
  border-radius: 19px;
  &:hover {
    background-color: #2b2e2c;
    color: white;
  }
`;



// Styled Components
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.116);
  backdrop-filter: blur(1px);
  z-index: 1000;
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  
  animation: ${fadeIn} 0.3s ease-out;
`

const ModalContainer = styled.div`
  background: linear-gradient(145deg, #1a1c1b 0%, #1b1b1b 100%);
  border-radius: 1rem;
  width: 70vw;
  height: 90vh;
  border: 2px solid #212221;
  overflow: hidden;
  animation: ${modalSlideIn} 0.3s ease-out;
  display: flex;
  flex-direction: column;
`

const ModalHeader = styled.div`
  padding: 0.8rem;
  border-bottom: 1px solid #2d302e;
  display: flex;
  align-items: center;
  justify-content: space-between;
 

  h2 {
    font-size:  15px;
    font-weight: 700;
    margin: 0;
    color: #41b45e;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const ViewToggle = styled.div`
  display: flex;
  gap: 9px;
  background: #222524;
  border-radius: 12rem;
  padding: 0.25rem;
  border: 2px solid #2d302e;
`

const ViewButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem;
  border: none;
  background: ${(props) => (props.$active ? "#41b45e" : "transparent")};
  color: ${(props) => (props.$active ? "black" : "#9ca3af")};
   border-radius: 1rem;
   cursor: var(--f-cursor-pointer);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) => (props.$active ? "#41b45e" : "rgba(65, 180, 94, 0.1)")};
    color: ${(props) => (props.$active ? "black" : "#41b45e")};
  }
`

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background: #222524;
  border: 1px solid #2d302e;
  border-radius: 0.5rem;
  color: #9ca3af;
   cursor: var(--f-cursor-pointer);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: #41b45e;
    color: #41b45e;
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
  padding: 1.5rem;
`

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 1.5rem;

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    background: #222524;
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

const FilterContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: all 0.3s ease-in-out;
  flex-wrap: wrap;

  @media screen and (max-width: 780px) {
    flex-direction: column;
    align-items: stretch;
  }
`
 
const FilterInput = styled.input`
  width: 200px;
  height: 40px;
  border: 1px solid #2d302e;
  background: #121213;
  border-radius: 8px;
  color: #9293a0;
  padding: 0.9em 1em;
  font-family: 'Poppins', Courier, monospace;
  
  &:focus {
    outline: none;
   
  }

  &::placeholder {
    font-size: 14px;
    font-weight: 400;
    color: #9c9ca7;
  }

  @media screen and (max-width: 780px) {
    width: 100%;
  }
`

const FilterSelect = styled.select`
  min-width: 150px;
  height: 40px;
  background: #262726;
  border: 2px solid #959597;
  border-radius: 8px;
  color: #9293a0;
  padding: 0.5em 1em;
  font-family: 'Inter';

  &:focus {
    outline: none;
    border-color: #41b45e;
  }

  @media screen and (max-width: 780px) {
    width: 100%;
  }
`

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: linear-gradient(135deg, #222524 0%, #1a1c1b 100%);
  
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;

  .value {
    font-size: 2rem;
    font-weight: 700;
    color: #41b45e;
    margin-bottom: 0.25rem;
  }

  .label {
    color: #9ca3af;
    font-size: 0.875rem;
  }
`

const CarsGrid = styled.div<{ $viewMode: string }>`
  display: grid;
  grid-template-columns: ${(props) => (props.$viewMode === "grid" ? "repeat(auto-fill, minmax(300px, 1fr))" : "1fr")};
  gap: 1.5rem;
`

const CarCard = styled.div<{ $viewMode: string }>`
  background: linear-gradient(135deg, #222524 0%, #1a1c1b 100%);
  border: 1px solid #2d302e;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  
  display: ${(props) => (props.$viewMode === "list" ? "flex" : "block")};
  align-items: ${(props) => (props.$viewMode === "list" ? "center" : "stretch")};
  gap: ${(props) => (props.$viewMode === "list" ? "1rem" : "0")};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(65, 180, 94, 0.1);
    border-color: #41b45e;
  }
`

const CarImage = styled.div<{ $viewMode: string }>`
  height: ${(props) => (props.$viewMode === "list" ? "100px" : "200px")};
  width: ${(props) => (props.$viewMode === "list" ? "150px" : "100%")};
  background: #2d302e;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
 cursor: var(--f-cursor-pointer);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .rarity-badge {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: linear-gradient(135deg, #41b45e 0%, #2d8a42 100%);
    color: black;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: bold;
  }
`

const CarInfo = styled.div<{ $viewMode: string }>`
  padding: ${(props) => (props.$viewMode === "list" ? "0" : "1rem")};
  flex: 1;
`

const CarName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
`

const CarSpecs = styled.div<{ $viewMode: string }>`
  display: ${(props) => (props.$viewMode === "list" ? "flex" : "grid")};
  grid-template-columns: ${(props) => (props.$viewMode === "list" ? "none" : "repeat(2, 1fr)")};
  gap: ${(props) => (props.$viewMode === "list" ? "1rem" : "0.5rem")};
  margin-bottom: 1rem;
  color: #9ca3af;
  font-size: 0.875rem;

  .spec {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`

const CarActions = styled.div<{ $viewMode: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  justify-content: ${(props) => (props.$viewMode === "list" ? "flex-end" : "space-between")};
  gap: 0.5rem;
  padding: ${(props) => (props.$viewMode === "list" ? "0" : "0 1rem 1rem")};
`

const CarPrice = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #41b45e;
`
 
const SellButton = styled.button`
  background: linear-gradient(135deg, #41b45e 0%, #2d8a42 100%);
  color: black;
  border: none;
  padding: 0.3rem 1rem;
  border-radius: 3rem;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #2d8a42 0%, #41b45e 100%);
    transform: translateY(-1px);
  }
`

// Sell Options Modal Components
const SellOptionsContainer = styled.div`
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  border: 2px solid #2d302e;
  border-radius: 28px;
  padding: 0.8em 2rem 2em;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${modalSlideIn} 0.3s ease-out;
`

const SellOptionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9em 1em;
  margin-bottom: 1em;
   
`

const ItemPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(45, 45, 48, 0.3);
  border-radius: 12px;
  margin-bottom: 2rem;

  img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
  }

  div {
    flex: 1;
    
    h3 {
      color: #fff;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    p {
      color: #b6b7c0;
      margin: 0.25rem 0;
      font-size: 0.9rem;
    }
  }
`

const SellTypeSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`

const SellTypeOption = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  
  border-radius: 12px;
  background: ${(props) => (props.$active ? "rgba(65, 180, 94, 0.1)" : "rgba(45, 45, 48, 0.3)")};
   cursor: var(--f-cursor-pointer);
  transition: all 0.3s ease;

  &:hover {
    border-color: #41b45e;
    background: rgba(65, 180, 94, 0.05);
  }

  svg {
    color: ${(props) => (props.$active ? "#41b45e" : "#b6b7c0")};
  }

  div {
    h4 {
      color: #a1a7a1;
      margin: 0 0 0.15rem 0;
      font-family: 'XcSemibold';
      font-size: 1rem;
    }

    p {
      color: #616662;
      font-family: 'ProximaNova-italic', sans-serif;
      margin: 0;
      font-size: 0.85rem;
    }
  }
`

const PriceSection = styled.div`
  margin-bottom: 2rem;

  label {
    display: block;
    color: #fff;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  small {
    display: block;
    color: #b6b7c0;
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }
`

const PriceInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: rgba(45, 45, 48, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #41b45e;
  }

  &::placeholder {
    color: #b6b7c0;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
`

const ConfirmButton = styled.button`
  background: rgba(89, 223, 122, 0.178);
  color: #64cf7a;
  border: none;
  padding: 0.4rem 2rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  width: 100%;
   cursor: var(--f-cursor-pointer);
 
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #2d8a42;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const CancelButton = styled.button`
  background: #ff475618;
  color: #da4242;
  
   width: 100%;
 cursor: var(--f-cursor-pointer);
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-family: 'Inter';
  font-weight: 700;
  font-size: 15px;
 
  transition: all 0.3s ease;

  &:hover {
   background: #ff47563b;
  }
`

// Item Detail Modal Components
const ItemModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 57000;
`

const ItemModalContent = styled.div`
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  border-radius: 16px;
  max-width: 870px;
  margin: 0.3em;
  position: relative;
  display: flex;
  place-items: center;
  justify-content: center;
  height: 90%;
  border: 1px solid #2d302e;

  .objs {
    overflow-y: auto;
    height: 100%;
    padding: 10px;
  }
  
  @media screen and (max-width: 490px) {
    display: flex;
    flex-direction: column;
  }
`

const ItemModalCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: 2px solid #1c1c1d76;
  padding: 8px 0.8em 6px;
  border-radius: 100px;
  height: 38px;
  margin: 0.2em;
  width: 38px;
  color: #6d6d7276;
  background: none;
  transition: 0.4s all;
  display: flex;
  justify-content: center;
  align-items: center;
   cursor: var(--f-cursor-pointer);
  
  i {
    font-size: 14px;
  }

  &:hover {
    border: 2px solid rgba(216, 215, 218, 0.26);
    color: #fff;
  }
`

const ItemModalImage = styled.img`
  width: auto;
  height: 150px;
  border-radius: 8px;
`

const ItemModalTitle = styled.h2`
  margin: 0 0 10px 0;
  font-family: 'XcSemibold';
  color: #b6b7c0;
`

const ItemModalInfo = styled.p`
  margin: 5px 0;
  font-family: 'InterSemiBold', monospace;
  color: #d5d5da;
  font-size: 12px;
`
const ButtonReedirec = styled.button`
   width: 90%;
   background-color: #dbc356;
   padding: 0.6em 1em;
   border-radius: 13px;
   text-align: center;
   margin: 1%;
   color: black;
   font-size: 13px;
   font-family: 'InterSemiBold',monospace;

 
   &:hover{
    background-color: #a08d3b;
    color: white;
   }
`;

const MarginCb = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  background-color: rgba(225, 227, 235, 0.096);
  padding: 0.4em 1em 0.4em;
  border-radius: 12px;
`

const PreviousOwnersContainer = styled.div`
  margin-top: 20px;
  background-color: rgba(45, 45, 48, 0.096);
  padding: 0.4em 1em 0.4em;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin-bottom: 15px;
    margin-top: 15px;
    font-size: 18px;
    font-weight: 600;
    color: #c5c6d1;
  }

  p {
    color: #666;
    font-size: 12px;
  }
`

const OwnerItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: rgba(73, 74, 80, 0.151);
  border-radius: 12px;
   
  h1 {
    padding: 0 10px 0;
    font-family: 'XcSemibold';
    color: #b6b7c0;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
  }

  span {
    font-size: 16px;
    color: #ccc4c4;
  }

  .keyicon {
    margin: 0.4em;
  }
`

const ChartContainer = styled.div`
  padding: 30px;
  text-align: center;

  .bg {
    background-color: rgba(19, 20, 22, 0.774);
    border-radius: 12px;
    color: #888;
  }

  ul {
    display: flex;
    align-items: center;
    margin: 0.3em;
    justify-content: center;
  }

  .span {
    font-size: 13px;
    margin: 0.1em;
    padding: 0.3em 1em 0.3em;
    display: flex;
    align-items: center;
  }
`

const StyledChartWrapper = styled.div`
  width: 100%;
  height: 300px;
  background-image: url('/nvrp/logonvrp.png');
  background-position: center; 
  background-size: 50%;
  background-repeat: no-repeat;
`

const CustomTooltipWrapper = styled.div`
  background-color: #17181a;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 0.5em 1em;
  color: #fff;
  font-size: 14px;
  text-align: start;
  position: relative;
  font-family: 'Inter', monospace;

  img {
    position: absolute;
    right: 1px;
    opacity: 0.1;
    bottom: 1px;
  }

  .vcx {
    align-items: center;
    display: flex;
    font-weight: 100;
    font-size: 11px;
    margin-top: 0.9em;
  }

  p {
    font-family: 'Inter', monospace;
    margin: 0.5em;
    color: rgba(186, 188, 199, 0.952);
    font-size: 11px;
  }
`

const Top = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  p {
    padding-left: 0.4em;
    font-family: 'Inter', monospace;
    font-size: 11px;
  }
`

const YAxisTickWrapper = styled.g`
  text {
    font-size: 9px; 
    font-family: 'InterSemiBold', monospace; 
    fill: #333; 
    gap: 3px;
    margin: 0.4em;
  }
`

const ModalDetail = styled.div`
  margin-top: 20px;
  font-size: 12px;
  font-family: 'InterSemiBold', monospace;
  margin: 0.3em;
  color: #555;
`
