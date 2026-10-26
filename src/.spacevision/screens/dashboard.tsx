"use client"

import { useState, useEffect } from "react"
import styled, { keyframes, css } from "styled-components"
import {
  Plus,
  Grid3X3,
  TrendingUp,
  Gem,
  ChevronLeft,
  MapPinHouse,
} from "lucide-react"
import Image from "next/image"
import moment from "moment-timezone"
import "moment/locale/pt-br"
import { GarageModal } from "./garage-modal"
 
import { TradingModal } from "./trading-modal"
import { nvxre_tokenvirtual } from "@/hooks/tokenvirtual"
import LoadingPageView from "@/resources/loading/market.loading"
import router from "next/router"
import { UltraSmoothParticleImage } from '../view-item';
import { LockClosedIcon } from "@heroicons/react/24/outline"
import MapsPage from "./map"
 

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
  sold?: boolean
  userId: string
  type: string
  containerType: string
  rarity: string
  valueHistory?: { newValue: number; timestamp: string }[]
  previousOwners?: string[]
}

interface StyledDashboardProps {
  id: string
  username?: string
}

export function StyledDashboard({ id, username }: StyledDashboardProps) {
  moment.locale("pt-br")

  const [selectedItemIndex, setSelectedItemIndex] = useState(0)
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false)
  const [ismapvision, setismapvision] = useState(false)
  const [isTradingModalOpen, setIsTradingModalOpen] = useState(false)
  const [topItems, setTopItems] = useState<Item[]>([])
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const { isLoadingtvl, errorwallettvl, Datawallettvl } = nvxre_tokenvirtual({ id })

  const [isComplete, setIsComplete] = useState(false)
  const [effect, setEffect] = useState<"grid" | "wave" | "explosion" | "spiral" | "matrix">("wave")
  const [key, setKey] = useState(0)

  const resetAnimation = () => {
    setIsComplete(false)
    setKey((prev) => prev + 1)
  }

  useEffect(() => {
    if (!isLoadingtvl && Datawallettvl) {
      const allItems = [...(Datawallettvl.items || []), ...(Datawallettvl.mytvls || [])]
      const sortedItems = allItems
        .filter((item) => !item.sold)
        .sort((a, b) => (b.itemValue || 0) - (a.itemValue || 0))
        .slice(0, 4)

      setTopItems(sortedItems)
    }
  }, [Datawallettvl, isLoadingtvl])

  useEffect(() => {
       
        if (router.query.market === 'dealership' ) {
          setIsTradingModalOpen(true);
        }
      
      }, [router.query]);

  const selectedItem = topItems[selectedItemIndex] || null
  const totalValue = topItems.reduce((sum, item) => sum + (item.itemValue || 0), 0)
  const averageValue = topItems.length > 0 ? totalValue / topItems.length : 0

  // Calculate stats percentages for visual representation
  const calculateConditionPercentage = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "novo":
        return 100
      case "excelente":
        return 90
      case "muito bom":
        return 80
      case "bom":
        return 70
      case "regular":
        return 60
      case "usado":
        return 50
      case "danificado":
        return 30
      default:
        return 75 // Default value
    }
  }

  const calculateRarityPercentage = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case "épico":
        return 95
      case "raro":
        return 75
      case "comum":
        return 40
      default:
        return 50
    }
  }

  const getValueTrend = (item: Item) => {
    if (!item.valueHistory || item.valueHistory.length < 2) return 0

    const latestValue = item.valueHistory[item.valueHistory.length - 1].newValue
    const previousValue = item.valueHistory[item.valueHistory.length - 2].newValue

    return ((latestValue - previousValue) / previousValue) * 100
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case "épico":
        return { bg: "rgba(147, 51, 234, 0.2)", color: "#9333ea" }
      case "raro":
        return { bg: "rgba(59, 246, 184, 0.2)", color: "#3bf689" }
      case "comum":
        return { bg: "rgba(107, 114, 128, 0.2)", color: "#6b7280" }
      default:
        return { bg: "rgba(156, 163, 175, 0.2)", color: "#9ca3af" }
    }
  }

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("en-US", {
    
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  const calculateEditionRarity = (edition: number, total: number) => {
    if (!edition || !total) return 50
    if (edition === 1) return 100 // First edition
    if (edition <= Math.ceil(total * 0.1)) return 90 // Top 10%
    if (edition <= Math.ceil(total * 0.25)) return 75 // Top 25%
    if (edition <= Math.ceil(total * 0.5)) return 50 // Top 50%
    return 30 // Bottom 50%
  }

  if (isLoadingtvl) {
    return (
      <DashboardContainer>
        <LoadingPageView />
      </DashboardContainer>
    )
  }

if (errorwallettvl) {
  return (
    <DashboardContainer>

           <Container>
              <Content>
              <ul> 
            
              <CardInfo>
                 <LockClosedIcon className="h-16 transition-all ease-in-out hover:scale-110 icon" />
                </CardInfo>
                
                  </ul>
           
      
                <BottomView>
                      <h6>© thenovision · <a href="/legal/policy"> Política de Privacidade</a>   · <a href="/legal/terms">Termos de serviço</a>  · Português (Brasil)</h6>
                      <h4>Parece que você não possui tokens vinculados ao seu visionID. Adquira itens abrindo caixas!!</h4>
                  </BottomView>
                </Content>
              </Container>
    
    </DashboardContainer>
  )
}

  return (
    <DashboardContainer>
       <BackgroundEffects>
          <ParticleLayer />
          <GridOverlay />
          <ScanLines />
        </BackgroundEffects>

  
      <MainLayout>
        <LeftSidebar>
          <SidebarButton $active onClick={() => router.back()}>
            <ChevronLeft size={20} />
          </SidebarButton>


   <ItemThumbnails>
            {topItems.map((item, index) => (
              <ItemThumbnail
                key={item._id}
                $active={index === selectedItemIndex}
                $rarity={item.rarity}
                onClick={() => setSelectedItemIndex(index)}
              >
                <Image
                  src={item.imagem || "/placeholder.svg"}
                  alt={item.nameitem}
                  width={48}
                  height={32}
                  crossOrigin="anonymous"
                />
              </ItemThumbnail>
            ))}
               <SidebarButtonx>
            <Plus size={20} />
          </SidebarButtonx>
          </ItemThumbnails>
 
  
      
       <MarginBottom>
      

             <SidebarButtonx onClick={() => setIsGarageModalOpen(true)}>
            <Grid3X3 size={20} />
          </SidebarButtonx>
        
          <SidebarButtonx onClick={() => setIsTradingModalOpen(true)}>
            <TrendingUp size={20} />
          </SidebarButtonx>
        
          <SidebarButtonx onClick={() => setismapvision(true)}>
            <MapPinHouse size={20} />
          </SidebarButtonx>
       </MarginBottom>
        </LeftSidebar>

        <MainContent>
          {selectedItem ? (
            <>
              <ContentHeader>
                    <UserProfile>
          <UserAvatar><img src="/nvrp/club.webp" alt="spacevision" height={50} width={50}/></UserAvatar>
          <UserInfo>
            <h3>Olá, {(username || "VISIONARIO").toUpperCase()}</h3>
            <span>Seu espaço virtual novision</span>
          </UserInfo>
        </UserProfile>
                <ItemTitle>
                  <span className="brand">{selectedItem.containerType || "RIMAC"}</span>
                   <h1>{selectedItem.nameitem.toUpperCase()}</h1>
                </ItemTitle>
                <ItemDescription>
                     <p>
                    Token ID: {selectedItem.tokenID} • Edição {selectedItem.editionNumber}/{selectedItem.quantity} • 
                    Adquirido em {moment(selectedItem.createdAt).format("DD/MM/YYYY")}
                  </p>
                  <p>
                    Estado: <strong>{selectedItem.itemCondition}</strong> • 
                    Raridade: <strong style={{ color: getRarityColor(selectedItem.rarity).color }}>
                      {selectedItem.rarity.toUpperCase()}
                    </strong>
                  </p>
                </ItemDescription>
              </ContentHeader>

              <ItemDisplayArea>
                <ItemImageContainer>

             
                       <UltraSmoothParticleImage
                         key={key}
                         src={selectedItem.imagem || "/placeholder.svg"}
                         particleSize={3}
                         particleDensity={1.5}
                         effect={'grid'}  
                         maxParticles={2000}
                         onComplete={() => true}
                       />
              
                </ItemImageContainer>
 
              </ItemDisplayArea>

              <InfoCard>
                <div className="car-image"> 
                  <Image
                    src={selectedItem.imagem || "/placeholder.svg"}
                    alt={selectedItem.nameitem}
                    width={120}
                    height={60}
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="title">THE HYPERVISION</div>
                <div className="subtitle">#Thenovision</div>
              </InfoCard>
 

              <StatsSection>
                <SpecsBar>
                  <SpecItem>
                    <div className="label">Tempo de Posse</div>
                    <div className="value">
                      NVRP<span className="unit">{moment(selectedItem.createdAt).fromNow()}</span>
                    </div>
                  </SpecItem>
                  <SpecItem>
                    <div className="label">Edição</div>
                    <div className="value">
                     #<span className="unit"> {selectedItem.editionNumber}</span>
                     
                    </div>
                  </SpecItem>
                  <SpecItem>
                    <div className="label">Condição</div>
                    <div className="value">
                      <span className="unit">{selectedItem.itemCondition}</span>
                    </div>
                  </SpecItem>
                
                  
               
              <SpecItem>
                  <div className="label">Valor de mercado</div>
                  <ActionSection>
                      <Image src={'/icons/coins/orbit-novision.webp'} alt="novision Bits" width={30} height={30}/>
                <span className="price">{formatCurrency(selectedItem.itemValue)} Bits</span>
              </ActionSection>
              </SpecItem>
                </SpecsBar>
              </StatsSection>
            </>
          ) : (
            <EmptyStateContainer>
              <Gem size={64} />
              <h2>Sua Garagem está vazia</h2>
              <p>Adquira ativos digitais premium para iniciar sua coleção exclusiva.</p>
              <button onClick={() => setIsGarageModalOpen(true)}>
                <Plus size={16} /> Adicionar Itens
              </button>
            </EmptyStateContainer>
          )}
        </MainContent>
      </MainLayout>

 
      <GarageModal isOpen={isGarageModalOpen} onClose={() => setIsGarageModalOpen(false)} id={id} username={username} />
      <TradingModal userId={id} isOpen={isTradingModalOpen} onClose={() => setIsTradingModalOpen(false)} />
   {ismapvision && <MapsPage onclose={() => setismapvision(false)}  />}
    </DashboardContainer>
  )
}


 
 

// Animations
const glow = keyframes`
  0% { box-shadow: 0 0 10px rgba(57, 255, 20, 0.4); }
  50% { box-shadow: 0 0 30px rgba(57, 255, 20, 0.8); }
  100% { box-shadow: 0 0 10px rgba(57, 255, 20, 0.4); }
`

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(0.5deg); }
`

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`

const breathe = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
`

const dash = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`

const neonGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 15px #39FF14;
  }
  50% { 
    box-shadow: 0 0 10px #39FF14, 0 0 20px #39FF14, 0 0 30px #39FF14;
  }
`

const scan = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); }
`

const BackgroundEffects = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`
const ScanLines = styled.div`
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #41b45e, transparent);
  animation: ${scan} 8s linear infinite;
  top: 30%;
  opacity: 0.5;
`
 

const particleFloat = keyframes`
  0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100px) translateX(50px) rotate(360deg); opacity: 0; }
`

const ParticleLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 2px;
    background: #41b45e;
    border-radius: 50%;
    animation: ${particleFloat} 15s infinite linear;
  }
  
  &::before {
    left: 10%;
    animation-delay: -5s;
  }
  
  &::after {
    left: 80%;
    animation-delay: -10s;
    background: #00ffff;
  }
`

const GridOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(65, 180, 94, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(65, 180, 94, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: ${pulse} 4s ease-in-out infinite;
`
// Styled Components
const DashboardContainer = styled.div`
  height: 100vh;
  background: 
    radial-gradient(circle at 20% 80%, rgba(35, 37, 36, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
    linear-gradient(145deg, #0a0b0a 0%, #1a1c1b 50%, #0f1110 100%);
  color: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 30% 70%, rgba(57, 255, 20, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`

const TopNavBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
 
  border-bottom: 1px solid rgba(49, 51, 48, 0.288);
  position: relative;
  z-index: 10;
  height: 80px;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    height: 70px;
  }
`

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`

const UserAvatar = styled.div`
 
  border-radius: 50%;
 
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
  color: #000;
  position: relative;
 
  
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: 0.05em;
    color: #FFFFFF;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  span {
    font-size: 0.75rem;
    color: #A0A0A0;
    
    @media (max-width: 768px) {
      font-size: 0.625rem;
    }
  }
`

const NavCenter = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;

  .tabs-dropdown {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #FFFFFF;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(57, 255, 20, 0.1);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: 768px) {
    .tabs-dropdown {
      font-size: 0.875rem;
      padding: 0.375rem 0.75rem;
    }
  }
`

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 0.375rem;
  background: none;
  border: none;
  color: #A0A0A0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #FFFFFF;
    background: rgba(57, 255, 20, 0.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`

const NotificationDot = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 6px;
  height: 6px;
  background: #39FF14;
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
`

const MainLayout = styled.div`
  display: flex;
  height: 100vh;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    height: calc(100vh - 70px);
  }
`
const MarginBottom = styled.div`
 position: absolute;
 bottom: 12%;
 display: flex;
 flex-direction: column;
 gap: 12px;
 align-items: center;
 
`;
const LeftSidebar = styled.aside`
  width: 80px;
 
  border-right: 1px solid rgba(49, 51, 48, 0.288);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 0;
  gap: 1.5rem;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    height: 80px;
    flex-direction: row;
    padding: 0 1rem;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid rgba(57, 255, 20, 0.1);
  }
`

const SidebarButton = styled.button<{ $active?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(props) => (props.$active ? "#0d0e0c" : "rgba(57, 255, 20, 0.1)")};
  border: none;
  color: ${(props) => (props.$active ? "#e4dddd" : "#A0A0A0")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${(props) => (props.$active ? "#39FF14" : "rgba(57, 255, 20, 0.2)")};
    color: ${(props) => (props.$active ? "#000000" : "#FFFFFF")};
  }

  

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`


const SidebarButtonx = styled.button<{ $active?: boolean }>`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${(props) => (props.$active ? "#4d504c" : "rgba(155, 161, 154, 0.1)")};
  border: none;
  color: ${(props) => (props.$active ? "#000000" : "#A0A0A0")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${(props) => (props.$active ? "#2cad66" : "rgba(55, 255, 20, 0.075)")};
    color: ${(props) => (props.$active ? "#000000" : "#FFFFFF")};
  }

  ${(props) =>
    props.$active &&
    css`
      animation: ${neonGlow} 2s infinite;
    `}

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`

const ItemThumbnails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 0.5rem;
  }
`

const ItemThumbnail = styled.button<{ $active?: boolean; $rarity?: string }>`
  width: 48px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid ${(props) => {
    if (props.$active) return "#39FF14"
    switch (props.$rarity) {
      default:
        return "rgba(73, 77, 72, 0.815)"
    }   
  }};
  background: rgba(0, 0, 0, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;

  &:hover {
    border-color: #39FF14;
    transform: scale(1.05);
  }

  ${(props) =>
    props.$active &&
    css`
      box-shadow: 0 0 15px rgba(57, 255, 20, 0.5);
    `}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 28px;
    flex-shrink: 0;
  }
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
 
  position: relative;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(57, 255, 20, 0.3);
    border-radius: 3px;
  }
`

const ContentHeader = styled.div`
  padding: 2rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const ItemTitle = styled.div`
  font-size: 4rem;
  font-weight: 900;
  margin: 2rem 0 1rem 0;
  letter-spacing: -0.02em;
  line-height: 1;
  text-transform: uppercase;
 
  h1{
     max-width: 50vw;
      font-size: 3rem;
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
  }
  .brand {
    color: #39FF14;
    display: block;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    letter-spacing: 0.1em;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    
    .brand {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 2rem;
    
    .brand {
      font-size: 1rem;
    }
  }
`

const ItemDescription = styled.div`
  color: #A0A0A0;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 600px;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
`

const ItemDisplayArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
 
  margin-top: -12%;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 60%;
    background: radial-gradient(ellipse at center, rgba(57, 255, 20, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(40px);
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #39FF14 50%, transparent 100%);
    border-radius: 50%;
    opacity: 0.6;
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 300px;
  }
`

const ItemImageContainer = styled.div`
  position: relative;
  z-index: 1;
 
  &::before {
    content: '';
    position: absolute;
    bottom: -5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 5rem;
    background: linear-gradient(90deg, transparent 0%, rgba(57, 255, 20, 0.3) 50%, transparent 100%);
    border-radius: 50%;
    filter: blur(10px);
    animation: ${breathe} 3s infinite ease-in-out;
  }
`

const ItemImage = styled(Image)`
  object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.8));
  transition: all 0.5s ease;
  
  &:hover {
    transform: scale(1);
    filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.9)) brightness(1.1);
  }

  @media (max-width: 768px) {
    width: 100% !important;
    height: auto !important;
    max-width: 400px;
  }
`

const CarouselControl = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
 
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;

 
  
`

const StatsSection = styled.div`
  padding: 0 2rem 2rem;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
  border-top: 1px solid rgba(57, 255, 20, 0.1);

  @media (max-width: 768px) {
    padding: 0 1rem 1rem;
  }
`

const SpecsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
  border-top: 1px solid rgba(57, 255, 20, 0.1);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1rem 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const SpecItem = styled.div`
  text-align: center;
  flex-direction: column;
  display: flex;
  align-items: center;
  
  .label {
    color: #A0A0A0;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .value {
    color: #FFFFFF;
    font-size: 1.5rem;
    font-weight: 700;
    
    .unit {
      color: #39FF14;
      font-size: 1rem;
      margin-left: 0.25rem;
    }
  }

  @media (max-width: 768px) {
    .value {
      font-size: 1.25rem;
      
      .unit {
        font-size: 0.875rem;
      }
    }
  }
`

const InfoCard = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 200px;
  background: #2f302f68;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  .car-image {
    width: 100%;
    height: 80px;
    background: #1c1d1c;
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .title {
    color: #33d17a;
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #666666;
    font-size: 0.75rem;
  }

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    margin: 1rem 0;
  }
`

const ActionSection = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;

  .checkout-text {
    color: #FFFFFF;
    font-size: 1rem;
    font-weight: 500;
  }

  .price {
    color: #39FF14;
    font-size: 17px;
    font-weight: 900;
  
  }
  
`

const EmptyStateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  gap: 1.5rem;
  color: #A0A0A0;
  padding: 2rem;
  text-align: center;
  
  svg {
    opacity: 0.5;
    transition: all 0.3s ease;
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: #FFFFFF;
  }
  
  p {
    max-width: 300px;
    line-height: 1.6;
  }
  
  button {
    background: rgba(57, 255, 20, 0.1);
    border: 1px solid rgba(57, 255, 20, 0.3);
    color: #39FF14;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    margin-top: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
      background: rgba(57, 255, 20, 0.2);
      transform: translateY(-2px);
    }
    
    svg {
      opacity: 1;
    }
  }
  
  &:hover svg {
    animation: ${float} 3s infinite ease-in-out;
  }
`




/////////////

const BottomView = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 28px;
  
   h6,a{
    color: #acb3b3;
    font-family: 'Roboto', sans-serif;
    font-size: 11px;
    font-weight: 500;
    text-align: center;
   }

   h4{
    margin-bottom: 0.4em;
    font-family: 'Inter', monospace;
    font-size: 10px;
    text-align: center;
    color: #3b3a3f;
   }

`;


const Container = styled.div`
 
 height: 100vh;
 width: 100vw;
 left: 0;
 right: 0;
 z-index: 99;
 top: 0;
 overflow-y: auto;
 bottom: 0;
 backdrop-filter: blur(23px);
 background: radial-gradient(circle, #0b0c0eed 0%, rgba(7, 8, 11, 0.925) 100%), url('/web/hdshfioef.png');
    background-repeat: no-repeat;
    background-size: cover;
 display:flex;
 justify-content: center;
 place-content: center;
 animation: Opacitxy 0.9s linear;


  @keyframes Opacitxy {
    0%{ opacity: 0;}
    100% { opacity: 1;}
  }
`;

const Content = styled.div`
  margin-top:18%;
  padding: 0 3em 0;
 
  ul{
    display: flex;
    justify-content: start;
    flex-direction: column;
    text-align: left;

    h2{
    font-size: 33px;
    font-family: 'Europa Grotesk';
    background:  linear-gradient(47deg, #64656d 0%, #0aeb4e 1%, #666975 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;   
    
    }

    h5{
     font-size: 13px;
    font-family: 'Inter';
    font-weight: 200;
    color: #66746d
    }
  } 



`;
 
const CardInfo = styled.div`
 padding: 0.9em 1em 0.9em;
 border-radius: 19px;
 margin: 4%;
  
 .icon{
    font-size: 59px;
    color: rgb(68, 68, 73);
 }
  
`;
 