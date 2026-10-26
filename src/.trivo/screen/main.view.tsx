"use client"
import type React from "react"
import { createContext, useContext, useState, useMemo } from "react"
import { Card, CardContent } from "../items/card"
import styled, { keyframes, css } from "styled-components"
import TypeRaritity from "../items/type-rarity"
import { TrivoItem } from "@/data/market/opencase/TrivoItem"
import { ChampionsInfo } from "@/data/market/items/champions"
import { XplayInfo } from "@/data/market/items/xplay"
import { AmixInfo } from "@/data/market/items/amix"
import { containerItems } from "@/data/list_tvl/list.container"
import { BigboxList } from "@/data/recharge/box.vision"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import ROUTENVX from "@/routes/routes"

const CartContext = createContext<any>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCartx] = useState<any[]>([])
  const [showCartModal, setShowCartModal] = useState(false)

  return (
    <CartContext.Provider value={{ cart, setCartx, showCartModal, setShowCartModal }}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

export default function MainContentSection() {
  const [activeTab, setActiveTab] = useState("Raros")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [favorites, setFavorites] = useState<string[]>([])
  const router = useRouter()

  const allItems = [
    ...ChampionsInfo,
    ...XplayInfo,
    ...AmixInfo,
    ...Object.values(containerItems)
      .flatMap((container) => Object.values(container))
      .flat(),
  ]

  const getTrivoInfo = (itemName: string) => {
    return (
      TrivoItem.find((item: any) => item.itemName === itemName) || {
        type: "",
        itemName: "Indisponível",
        skinName: "Edição Limitada",
        participants: "Indisponível",
        url: "#",
      }
    )
  }

  const getContainerTitleByItem = (itemName: string): string | null => {
    for (const containerKey in containerItems) {
      const itemsArray = containerItems[containerKey]

      if (itemsArray.some((item) => item.nameitem === itemName)) {
        const box = BigboxList.find((box) => box.receive === containerKey)
        return box?.title || "Indisponível"
      }
    }
    return null
  }

  const getItemRarity = (item: any) => {
    if (!item) return "Comuns"

    const trivo = getTrivoInfo(item?.nameitem)
    const price = Number.parseFloat(item?.priceitem) || 0

    // Prioriza o tipo do Trivo primeiro
    if (trivo?.type === "CHAMPION") return "Raro"
    if (trivo?.type === "XPLAY") return "Premium"
    if (trivo?.type === "AMIX") return "Comum"
    return "Experience"
  }

  // Filtrar e ordenar itens
  const filteredAndSortedItems = useMemo(() => {
    // Primeiro, remove duplicatas baseado no nameitem
    const uniqueItems = allItems.filter(
      (item, index, self) => index === self.findIndex((i) => i?.nameitem === item?.nameitem),
    )

    const filtered = uniqueItems.filter((item) => {
      if (!item?.nameitem) return false

      const itemRarity = getItemRarity(item)
      // Corrige a lógica: cada aba deve mostrar apenas sua categoria
      const matchesTab = itemRarity === activeTab
      const trivoInfo = getTrivoInfo(item.nameitem)

      const matchesSearch =
        item.nameitem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trivoInfo.skinName?.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesTab && matchesSearch
    })

    filtered.sort((a, b) => {
      const priceA = a?.priceitem ?? 0
      const priceB = b?.priceitem ?? 0

      switch (sortBy) {
        case "price-asc":
          return priceA - priceB
        case "price-desc":
          return priceB - priceA
        case "name":
        default:
          return a?.nameitem?.localeCompare(b?.nameitem) || 0
      }
    })

    return filtered
  }, [activeTab, searchTerm, sortBy])

  const navigateToProduct = (item: any) => {
    // Create a URL-friendly name from the item
    const productName = encodeURIComponent(item.nameitem.toLowerCase().replace(/\s+/g, "-"))
    router.push(`${ROUTENVX.viewitem}/${productName}?id=${item.id}`)
  }

  return (
    <PremiumMarketplaceContainer className="flex flex-col w-full pb-16">
      <TabbedSectionContainer>
        <SwiperWrapper className="swiper-wrapper">
          <SearchContainer>
            <SearchIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Buscar itens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          {["Raros", "Premium", "Comuns"].map((tabName) => {
            const rarity =
              tabName === "Raros" ? "CHAMPION" : tabName === "Premium" ? "XPLAY" : tabName === "Comuns" ? "AMIX" : null

            return (
              <SwiperSlide key={tabName} className="swiper-slide">
                <Tab active={activeTab === tabName} tabIndex={0} onClick={() => setActiveTab(tabName)}>
                  <TabContent className="flex items-center  whitespace-nowrap">
                    <TypeIconWrapper className="w-6 h-6 mr-1">
                      {rarity && <TypeRaritity rarity={rarity} />}
                    </TypeIconWrapper>
                    {tabName == "Comuns"
                      ? "AMIX"
                      : tabName == "Raros"
                        ? "CHAMPION"
                        : tabName == "Premium"
                          ? "XPLAY"
                          : "Desconhecido"}
                    {activeTab === tabName && <CounterText>{filteredAndSortedItems.length}</CounterText>}
                  </TabContent>
                  {activeTab === tabName && <TabBackground />}
                </Tab>
              </SwiperSlide>
            )
          })}


            <SwiperSlide  className="swiper-slide">
                <Tab tabIndex={0} onClick={() => router.push(ROUTENVX.storeclub)}>
                  <TabContent className="flex items-center  whitespace-nowrap">
                    <TypeIconWrapper className="w-6 h-6 mr-1">
                      <img src="/nvrp/nvrp_bc.png" alt="novision" height={24} width={24} />
                    </TypeIconWrapper>
                      CLUB
                  </TabContent>
                </Tab>
              </SwiperSlide>
        </SwiperWrapper>
      </TabbedSectionContainer>

      <MainContentContainer className="flex flex-col max-w-screen-2xl w-full mx-auto px-5 pt-6 relative z-10">
        <ItemsGrid className="flex items-center gap-1 flex-wrap pb-2.5 w-full">
          <AnimatePresence>
            {filteredAndSortedItems.map((card: any, index) => {
              const trivo = getTrivoInfo(card.nameitem)
              const isFavorite = favorites.includes(card.id)

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <PremiumCard
                    onClick={() => navigateToProduct(card)}
                    className="flex flex-col h-[288px] p-px rounded-lg"
                  >
                    <CardContent className="p-0 h-full rounded-[14px] overflow-hidden bg-gradient-to-b border-[2px] border-[#1b1d1c] from-[rgb(29,31,29)] to-[rgba(23,24,23,0.35)]">
                      <CardInner className="relative w-full h-full">
                        <CardShimmer />
                        <CardGlow />

                      
                        <CardHeader className="flex justify-between w-full absolute top-[14px] left-[4px] px-4">
                          {trivo.type && trivo.type !== "Indisponível" && (
                            <TypeContainer className="flex items-start">
                              <TypeIconWrapper className="w-6 h-6 mr-2">
                                {["CHAMPION", "XPLAY", "AMIX"].includes(trivo.type) && (
                                  <TypeRaritity rarity={trivo.type as "CHAMPION" | "XPLAY" | "AMIX"} />
                                )}
                              </TypeIconWrapper>
                              <TypeInfo className="flex flex-col h-[22px]">
                                <TypeName className="font-semibold text-xs leading-3">{trivo.type}</TypeName>
                                <TypeSubtext className="font-semibold text-keydropcomheather text-[10px] leading-[10px]">
                                  CLUB MARKET
                                </TypeSubtext>
                              </TypeInfo>
                            </TypeContainer>
                          )}

                          <OriginContainer className="flex items-center gap-1 mr-7 pt-1">
                            <OriginIcon
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-align-vertical-space-around"
                            >
                              <rect width="10" height="6" x="7" y="9" rx="2" />
                              <path d="M22 20H2" />
                              <path d="M22 4H2" />
                            </OriginIcon>
                            <OriginText className="font-bold text-keydropcomheather text-xs leading-[15px]">
                              {getContainerTitleByItem(card.nameitem) || "Revendedor"}
                            </OriginText>
                          </OriginContainer>
                        </CardHeader>

                        {/* Background baseado no tipo */}
                        <TypeBackground
                          className={`absolute w-full h-[500px] top-[-190px] left-0 
                      ${
                        trivo.type === "CHAMPION"
                          ? "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,203,119,0.25)_0%,rgba(68,40,72,0)_100%)]"
                          : trivo.type === "XPLAY"
                            ? "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(254,71,96,0.25)_0%,rgba(68,40,72,0)_100%)]"
                            : trivo.type === "AMIX"
                              ? "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(126,67,234,0.25)_0%,rgba(68,40,72,0)_100%)]"
                              : ""
                      }`}
                        />

                        {/* Imagem */}
                        <ImageContainer className="absolute top-[0%] left-[14px] w-full px-4 h-[90%]">
                          <ImageWrapper className="flex items-center justify-center h-full">
                            <ItemImageDisplay
                              className="w-[100%] h-[150px] bg-contain bg-center bg-no-repeat cursor-pointer"
                              style={{ backgroundImage: `url(${card.imagem || "https://via.placeholder.com/150"})` }}
                              onClick={() => navigateToProduct(card)}
                            />
                            <ImageOverlay />
                          </ImageWrapper>
                        </ImageContainer>

                        {/* Info embaixo */}
                        <CardFooter className="flex flex-col gap-2.5 absolute bottom-[12px] w-full px-4">
                          <ItemInfoSection className="flex justify-between items-end pt-2">
                            <ItemDetails className="flex flex-col max-w-[168px]">
                              <ItemCategory className="text-keydropcomheather text-sm leading-[14px]">
                                <span className="text-[#b6bbce]">{trivo.itemName || "Indisponível"}</span>
                              </ItemCategory>
                              <ItemName className="font-semibold text-white text-base leading-[26px]">
                                {trivo.skinName || "Edição Limitada"}
                              </ItemName>
                            </ItemDetails>
                            <ItemPrice className="font-semibold text-[#41b45e] text-[12px] leading-5">
                              {card.priceitem ?? "Indisponível"} Bits
                            </ItemPrice>
                          </ItemInfoSection>
                        </CardFooter>
                      </CardInner>
                    </CardContent>
                  </PremiumCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </ItemsGrid>
      </MainContentContainer>
    </PremiumMarketplaceContainer>
  )
}

const shimmer = keyframes`
0% { transform: translateX(-100%); }
100% { transform: translateX(100%); }
`

const glow = keyframes`
0%, 100% { opacity: 0.3; }
50% { opacity: 0.8; }
`

const pulse = keyframes`
0%, 100% { transform: scale(1); opacity: 1; }
50% { transform: scale(1.05); opacity: 0.8; }
`

const ripple = keyframes`
0% { transform: scale(0); opacity: 1; }
100% { transform: scale(4); opacity: 0; }
`

const spin = keyframes`
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
`

const fadeInUp = keyframes`
0% { opacity: 0; transform: translateY(20px); }
100% { opacity: 1; transform: translateY(0); }
`

const float = keyframes`
0%, 100% { transform: translateY(0px); }
50% { transform: translateY(-5px); }
`

const PremiumMarketplaceContainer = styled.section`
 
min-height: 100vh;
position: relative;
font-family: 'Poppins', sans-serif;


`

const SearchContainer = styled.div`
position: relative;
flex: 1;
  margin: 0.8em;
`

const SearchIcon = styled.div`
position: absolute;
left: 1rem;
top: 50%;
transform: translateY(-50%);
color: #79807b;
pointer-events: none;
z-index: 2;
transition: all 0.3s ease;
`

const SearchInput = styled.input`
width: 50%;
padding: 0.5em 3em 0.5em;
 background-color: #202220;
border-radius: 12px;
color: white;
font-size: 15px;
outline: none;
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
backdrop-filter: blur(10px);
font-family: 'Inter', sans-serif;

&::placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
}

`

const TabbedSectionContainer = styled.div`
display: flex;

grid-auto-flow: column;
align-items: center;
gap: 1.5rem;

@media (min-width: 1024px) {
  gap: 2rem;
}

@media (max-width: 768px) {
  grid-auto-columns: 1fr;
  grid-auto-flow: row;
}
`

const SwiperWrapper = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
width: 100%;
`

const SwiperSlide = styled.div`
width: auto;
margin-right: 24px;
display: flex;
`

const Tab = styled.div<{ active?: boolean }>`
position: relative;
overflow: hidden;
border-radius: 21px;
cursor: var(--f-cursor-pointer);
background-color: ${({ active }) => (active ? "rgba(174, 185, 176, 0.123)" : "transparent")};
padding: 0.4em 1em 0.4em;
font-size: 12px;
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
color: ${({ active }) => (active ? "#d0dad3" : "rgba(255, 255, 255, 0.7)")};
`

const TabContent = styled.div`
position: relative;
z-index: 2;
`

const TabIcon = styled.div<{ active: boolean }>`
transition: transform 0.3s ease;

${({ active }) =>
  active &&
  css`
  animation: ${float} 2s ease-in-out infinite;
`}

${Tab}:hover & {
  transform: scale(1.1);
}
`

const TabText = styled.span`
font-weight: 500;
letter-spacing: 0.5px;
`

const TabBackground = styled.div`
position: absolute;
top: 0;
left: 0;
height: 100%;
width: 100%;


`

const TabGlow = styled.div<{ active: boolean }>`
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: linear-gradient(45deg, transparent, rgba(65, 180, 94, 0.2), transparent);
opacity: 0;
transition: opacity 0.3s ease;
border-radius: inherit;

${({ active }) =>
  active &&
  css`
  opacity: 1;
  animation: ${shimmer} 3s ease-in-out infinite;
`}
`

const MainContentContainer = styled.div`
animation: ${fadeInUp} 0.8s ease-out;
`

const ItemsCounter = styled.div`
display: flex;
align-items: center;
gap: 0.5rem;
color: rgba(255, 255, 255, 0.8);
font-size: 0.9rem;
margin-bottom: 1.5rem;
text-align: right;
justify-content: flex-end;
font-weight: 500;
`

const CounterText = styled.span`
letter-spacing: 0.5px;
background-color: #333536;
padding: 0.2em 0.6em;
margin-left: 0.4em;
border-radius: 50%;
`

const ItemsGrid = styled.div`
animation: ${fadeInUp} 1s ease-out;
`

// ============= CARDS PREMIUM =============
const PremiumCard = styled(Card)`
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
width: 240px;
background: linear-gradient(90deg, transparent, rgba(26, 27, 26, 0.1), transparent);

`

const CardInner = styled.div`
position: relative;
overflow: hidden;
`

const CardShimmer = styled.div`
position: absolute;
top: 0;
left: -100%;
width: 100%;
height: 100%;
background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
transition: left 0.6s ease;
z-index: 1;

${PremiumCard}:hover & {
  left: 100%;
}
`

const CardGlow = styled.div`
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: radial-gradient(circle at center, rgba(65, 180, 94, 0.1) 0%, transparent 70%);
opacity: 0;
transition: opacity 0.4s ease;
border-radius: inherit;
z-index: 1;

${PremiumCard}:hover & {
  opacity: 1;
  animation: ${glow} 2s ease-in-out infinite;
}
`

const CardHeader = styled.div`
z-index: 5;
`

const TypeContainer = styled.div``

const TypeIconWrapper = styled.div`
  
  svg{
    color: #c9cccb;
  }
`

const TypeInfo = styled.div``

const TypeName = styled.div``

const TypeSubtext = styled.div``

const OriginContainer = styled.div``

const OriginIcon = styled.svg`
color: rgba(255, 255, 255, 0.7);
transition: color 0.3s ease;

${PremiumCard}:hover & {
  color: #41b45e;
}
`

const OriginText = styled.span``

const TypeBackground = styled.div` display: none;`

const ImageContainer = styled.div``

const ImageWrapper = styled.div`
position: relative;
`

const ItemImageDisplay = styled.div`
transition: transform 0.4s ease;
border-radius: 8px;

${PremiumCard}:hover & {
  transform: scale(1.05);
}
`

const ImageOverlay = styled.div`
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: linear-gradient(45deg, transparent, rgba(65, 180, 94, 0.1), transparent);
opacity: 0;
transition: opacity 0.3s ease;
border-radius: 8px;

${ItemImageDisplay}:hover & {
  opacity: 1;
}
`

const CardFooter = styled.div`
z-index: 5;
`

const ItemInfoSection = styled.div``

const ItemDetails = styled.div``

const ItemCategory = styled.div``

const ItemName = styled.div`
transition: color 0.3s ease;
font-size: 12px;

${PremiumCard}:hover & {
  color: #41b45e;
}
`

const ItemPrice = styled.span`
font-weight: 600;
text-shadow: 0 0 10px rgba(65, 180, 94, 0.5);
`
