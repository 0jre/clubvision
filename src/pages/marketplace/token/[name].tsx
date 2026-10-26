"use client"
import styled, { keyframes, css } from "styled-components"
import type { User } from "@/types/user/types"
import { type NextIronRequest, withSession } from "@/lib/session"
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { type Permission, getPermission } from "@/types/discord/permission"
import { type ModLog, getModLogs } from "@/types/discord/modlog"
import { TheNoVisionRoute } from "@/lib/session/redirects"
import HeadGlobal from "@/club/head/glob.n"
import ROUTENVX from "@/routes/routes"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { TrivoItem } from "@/data/market/opencase/TrivoItem"
import { ChampionsInfo } from "@/data/market/items/champions"
import { XplayInfo } from "@/data/market/items/xplay"
import { AmixInfo } from "@/data/market/items/amix"
import { containerItems } from "@/data/list_tvl/list.container"
import { BigboxList } from "@/data/recharge/box.vision"
import { useCart } from "@/.trivo/screen/main.view"
import { motion } from "framer-motion"

import {
  ArrowLeft,
  ChevronRight,
  ShoppingCart,
  Shield,
  Truck,
  Zap,
  Eye,
  Share2,
  Plus,
  Minus,
  X,
  Clock,
  RefreshCw,
  ChevronLeft,
  WalletCards,
  AlignVerticalSpaceAround,
} from "lucide-react"
import Image from "next/image"
import LogoVision from "@/components/vision/logo"

// Import AreaChart and Line from recharts
import { XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts"
import TypeRaritity from "@/.trivo/items/type-rarity"

interface Props {
  user?: User | null
   logs: ModLog[]
  Permissions: Permission[]
}

interface ValueHistory {
  newValue: number
  timestamp: string
}

interface OwnerInfo {
  id: string
  name: string
  avatar: string
}

interface ItemAnalytics {
  priceHistory: ValueHistory[]
  totalOwners: number
  owners: OwnerInfo[] // Adiciona a lista de proprietários
}

// Adicione estas funções logo abaixo dos imports e antes do componente ProductPage
const getTrivoInfo = (item: any) => {
  let type = ""
  let skinName = "Edição Limitada"
  let participants = "Indisponível" as any
  let url = "#"

  const itemName = item?.nameitem

  // 1. Prioriza item.rarity se disponível e mapeia para um tipo conhecido
  if (item?.rarity) {
    switch (item.rarity.toLowerCase()) {
      case "raro":
        type = "CHAMPION"
        break
      case "epico": // Assumindo 'epico' mapeia para XPLAY do header.tsx
        type = "XPLAY"
        break
      case "comum": // Assumindo 'comum' mapeia para AMIX do header.tsx
        type = "AMIX"
        break
    }
  }

  // 2. Se o tipo não foi determinado pela raridade, infere das listas principais usando nameitem
  if (!type && itemName) {
    if (ChampionsInfo.some((info: any) => info.nameitem === itemName)) {
      type = "CHAMPION"
    } else if (XplayInfo.some((info: any) => info.nameitem === itemName)) {
      type = "XPLAY"
    } else if (AmixInfo.some((info: any) => info.nameitem === itemName)) {
      type = "AMIX"
    }
  }

  // 3. Obtém detalhes adicionais de TrivoItem com base em itemName
  const trivoDetails = TrivoItem.find((trivoItem: any) => trivoItem.itemName === itemName)
  if (trivoDetails) {
    // Se TrivoItem tiver um tipo, ele pode sobrescrever ou confirmar o tipo inferido
    if (trivoDetails.type) {
      type = trivoDetails.type
    }
    skinName = trivoDetails.skinName || skinName
    participants = trivoDetails.participants || participants
    url = trivoDetails.url || url
  }

  return {
    type: type,
    itemName: itemName, // Usa o itemName original para consistência
    skinName: skinName,
    participants: participants,
    url: url,
  }
}

const getItemRarity = (item: any) => {
  if (!item) return "Comuns" // Consistente com main.view.tsx

  const trivo = getTrivoInfo(item) // Passa o objeto item completo

  // Prioriza o tipo do Trivo primeiro
  if (trivo?.type === "CHAMPION") return "Raro"
  if (trivo?.type === "XPLAY") return "Premium"
  if (trivo?.type === "AMIX") return "Comuns" // Retorna "Comuns" (plural) para consistência com o display deste arquivo

  return "Experience" // Fallback se o tipo não for CHAMPION, XPLAY ou AMIX
}

const getRarityBorderColor = (rarity: string) => {
  switch (rarity) {
    case "Raro":
      return "rgb(255, 203, 119)" // CHAMPION color
    case "Premium":
      return "rgb(254, 71, 96)" // XPLAY color
    case "Comuns":
      return "rgb(126, 67, 234)" // AMIX color
    default:
      return "rgba(163, 167, 164, 0.3)" // Opaque gray
  }
}

// Nova função para obter a cor do texto com base na raridade
const getRarityTextColor = (rarity: string) => {
  switch (rarity) {
    case "Raro":
      return "rgb(255, 203, 119)"
    case "Premium":
      return "rgb(254, 71, 96)"
    case "Comuns":
      return "rgb(126, 67, 234)"
    default:
      return "white" // Default text color
  }
}

// Nova função para obter a cor da sombra do texto com base na raridade
const getRarityShadowColor = (rarity: string) => {
  switch (rarity) {
    case "Raro":
      return "rgba(255, 203, 119, 0.5)"
    case "Premium":
      return "rgba(254, 71, 96, 0.5)"
    case "Comuns":
      return "rgba(126, 67, 234, 0.5)"
    default:
      return "rgba(65, 180, 94, 0.5)" // Default shadow color
  }
}

// Nova função para obter o gradiente de fundo com base na raridade
const getRarityBackgroundGradient = (rarity: string) => {
  let color = "transparent"
  const opacity = 0.08 // Increased opacity for a more noticeable background
  switch (rarity) {
    case "Raro":
      color = "255, 203, 119" // CHAMPION color (RGB values)
      break
    case "Premium":
      color = "254, 71, 96" // XPLAY color (RGB values)
      break
    case "Comuns":
      color = "126, 67, 234" // AMIX color (RGB values)
      break
    default:
      return "none" // Sem gradiente específico para desconhecido/experience
  }
  // Using multiple radial gradients to create a more diffused effect
  return `
    radial-gradient(circle at 20% 80%, rgba(${color}, ${opacity}) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(${color}, ${opacity * 0.7}) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(${color}, ${opacity * 0.5}) 0%, transparent 50%)
  `
}

// Nova função para obter o background do CategoryTag
const getRarityTagBackground = (rarity: string) => {
  let color = "transparent"
  const opacity = 0.1
  switch (rarity) {
    case "Raro":
      color = "255, 203, 119"
      break
    case "Premium":
      color = "254, 71, 96"
      break
    case "Comuns":
      color = "126, 67, 234"
      break
    default:
      return "rgba(45, 48, 46, 0.3)" // Default gray background for tags
  }
  return `rgba(${color}, ${opacity})` // Simple rgba background for tags
}

export default function ProductPage({ user }: Props) {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { cart, setCartx: setCart } = useCart()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [itemAnalytics, setItemAnalytics] = useState<ItemAnalytics | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [error, seterror] = useState("")
  
  const allItems = [
    ...ChampionsInfo,
    ...XplayInfo,
    ...AmixInfo,
    ...Object.values(containerItems)
      .flatMap((container) => Object.values(container))
      .flat(),
  ]

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

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("en-US", {
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const getItemAvailability = (itemName: string) => {
    const availability = []

    // Verifica se está disponível em cases
    const isInTrivo = TrivoItem.some((trivoItem: any) => trivoItem.itemName === itemName)
    if (isInTrivo) {
      availability.push("Abertura de Cases")
    }

    // Verifica se está disponível em containers
    const containerTitle = getContainerTitleByItem(itemName)
    if (containerTitle) {
      availability.push("Abertura de Containers")
    }

    return availability
  }

  const findItemByMultipleCriteria = (searchName: string, searchId?: string) => {
    const searches = [
      () => allItems.find((item) => item.nameitem === searchName),
      () => allItems.find((item) => item.nameitem === decodeURIComponent(searchName)),
      () => allItems.find((item) => item.nameitem?.toLowerCase().replace(/\s+/g, "-") === searchName.toLowerCase()),
      () => allItems.find((item) => item.nameitem?.toLowerCase().includes(searchName.toLowerCase())),
      ...(searchId
        ? [
            () => allItems.find((item) => String(item.id) === searchId),
            () => allItems.find((item: any) => String(item.itemId) === searchId),
            () => allItems.find((item) => item.id === Number.parseInt(searchId)),
            () => allItems.find((item: any) => item.itemId === Number.parseInt(searchId)),
          ]
        : []),
    ]

    for (const searchFn of searches) {
      const result = searchFn()
      if (result) return result
    }

    return null
  }

  useEffect(() => {
    const urlName = params?.name as string
    const itemName = searchParams?.get("name")
    const itemId = searchParams?.get("id") as any

    setDebugInfo({
      urlName,
      itemName,
      itemId,
      totalItems: allItems.length,
      sampleItem: allItems[0],
      firstFewNames: allItems.slice(0, 5).map((item) => item.nameitem),
    })

    let foundItem = null

    if (itemName) {
      foundItem = findItemByMultipleCriteria(itemName, itemId)
    }

    if (!foundItem && urlName) {
      foundItem = findItemByMultipleCriteria(urlName, itemId)
    }

    if (!foundItem && itemId) {
      foundItem = allItems.find((item, index) => String(index) === itemId || item.nameitem?.includes(itemId))
    }

    if (foundItem) {
      setItem(foundItem)
    }

    setLoading(false)
  }, [params, searchParams])

  useEffect(() => {
    if (item && item.id) {
      const fetchItemAnalytics = async () => {
        setAnalyticsLoading(true)
        try {
          const response = await fetch(`/api/trivo/case/analytics?id=${item.id}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          if (data.success) {
            setItemAnalytics(data)
          } else {
            console.error("Failed to fetch item analytics:", data.message)
          }
        } catch (error) {
          console.error("Error fetching item analytics:", error)
        } finally {
          setAnalyticsLoading(false)
        }
      }
      fetchItemAnalytics()
    }


    if(quantity > 2) {
      seterror("Quantidade máxima é 2")
      setTimeout(() => {
        seterror("")
      }, 6000)
    }
  }, [item,quantity])

  const addToCart = async () => {
    if (!item) return;

    setIsAddingToCart(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    setCart((prev: any) => {
        const existing = prev.find((cartItem: any) => cartItem.nameitem === item.nameitem);
        if (existing) {
            if (existing.quantity + quantity > 2) {
                setIsAddingToCart(false);
                setShowSuccessMessage(false);
                seterror("Você só pode adicionar até 2 unidades do mesmo item.");
                setTimeout(() => seterror(""), 6000);
                return prev;
            }
            return prev.map((cartItem: any) =>
                cartItem.nameitem === item.nameitem
                    ? { ...cartItem, quantity: cartItem.quantity + quantity, weight: (cartItem.weight || 1) * (cartItem.quantity + quantity) }
                    : cartItem
            );
        }

        return [...prev, { ...item, quantity, weight: (item.weight || 1) * quantity }];
    });

    setIsAddingToCart(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2500);
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.nameitem,
          text: `Confira este item: ${item.nameitem}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Erro ao compartilhar:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Carregando produto...</LoadingText>
      </LoadingContainer>
    )
  }

  if (!item) {
    return (
      <ErrorContainer>
        <StyledErrorText>Produto não encontrado</StyledErrorText>
        <ErrorSubtext>O item que você procura pode ter sido removido ou não existe.</ErrorSubtext>
        <BackButton onClick={() => router.back()}>
          <ArrowLeft size={16} />
          Voltar à loja
        </BackButton>
      </ErrorContainer>
    )
  }

  const trivoInfo = getTrivoInfo(item) // Passa o objeto item completo
  const containerTitle = getContainerTitleByItem(item.nameitem)
  const itemAvailability = getItemAvailability(item.nameitem)

  const productImages = [
    item.imagem || "/placeholder.svg?height=600&width=600",
    item.imagem || "/placeholder.svg?height=600&width=600",
    item.imagem || "/placeholder.svg?height=600&width=600",
  ]

  const chartData =
    itemAnalytics?.priceHistory.map((entry) => ({
      date: new Date(entry.timestamp).toLocaleDateString("pt-BR", { month: "short", day: "numeric" }),
      price: entry.newValue,
    })) || []

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <StyledTooltipContent>
          <p className="label">{`${label}`}</p>
          <p className="intro">{`Preço: ${payload[0].value} Bits`}</p>
        </StyledTooltipContent>
      )
    }
    return null
  }

  // Determine a raridade e as cores/gradientes
  const itemRarity = getItemRarity(item)
  const borderColor = getRarityBorderColor(itemRarity)
  const backgroundGradient = getRarityBackgroundGradient(itemRarity)
  const rarityTextColor = getRarityTextColor(itemRarity)
  const rarityShadowColor = getRarityShadowColor(itemRarity)
  const rarityTagBackground = getRarityTagBackground(itemRarity)

  
 
  return (
    <>
      <HeadGlobal Title={`${item.nameitem} - #TheNoVision`} />

      {/* Image Modal */}
      {showImageModal && (
        <ImageModal onClick={() => setShowImageModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowImageModal(false)}>
              <X size={20} />
            </CloseButton>
            <ModalImage src={productImages[selectedImageIndex]} alt={item.nameitem} />
            <ImageNavigation>
              <NavButton
                onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
              >
                <ChevronLeft size={18} />
              </NavButton>
              <ImageCounter>
                {selectedImageIndex + 1} / {productImages.length}
              </ImageCounter>
              <NavButton
                onClick={() => setSelectedImageIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0))}
              >
                <ChevronRight size={18} />
              </NavButton>
            </ImageNavigation>
          </ModalContent>
        </ImageModal>
      )}

 
      <MainView>
        <Container>
          <Header>
            <BackButtonDesktop onClick={() => router.back()}>
              <ArrowLeft size={16} />
              <BackText>Voltar</BackText>
            </BackButtonDesktop>
            <ProductTitle>{item.nameitem}</ProductTitle>
            <HeaderActions>
              <ActionButton onClick={handleShare}>
                <Share2 size={16} />
              </ActionButton>
              <ActionButton onClick={() => setShowImageModal(true)}>
                <Eye size={16} />
              </ActionButton>
            </HeaderActions>
          </Header>

          <ContentWrapper>
            <ProductGrid>
              <ImageSection>
             <div className="flex align-top gap-1"> 
                  <ThumbnailContainer>
                  {productImages.map((img, index) => (
                    <Thumbnail
                      key={index}
                      src={img}
                      alt={`${item.nameitem} ${index + 1}`}
                      active={selectedImageIndex === index}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </ThumbnailContainer>
                <MainImageContainer bg={backgroundGradient} rarityBorderColor={borderColor}>
                  <RentalBadge>ALUGUEL</RentalBadge>
                  <LogoVision classname="absolute h-[230px] w-[230px] opacity-[0.3]" />
                  <ProductImage
                    src={productImages[selectedImageIndex] || "/placeholder.svg"}
                    alt={item.nameitem}
                    onClick={() => setShowImageModal(true)}
                  />
                  <ImageOverlay onClick={() => setShowImageModal(true)}>
                    <Eye size={20} />
                    <span>Visualizar</span>
                  </ImageOverlay>
                </MainImageContainer>

             
                </div>
                {itemAvailability.length > 0 && (
                  <FeaturesCard>
                    <FeaturesTitle>Disponível também em</FeaturesTitle>
                    <FeaturesGrid>
                      {itemAvailability.includes("Abertura de Cases") && (
                        <>
                          <FeatureColumn>
                            <FeatureIcon>
                              <Image src={"/theim/cards/20250331_230031.webp"} alt="cases" height={100} width={80} />
                            </FeatureIcon>
                            <FeatureContent>
                              <FeatureTitle>Abertura de Cases</FeatureTitle>
                              <FeatureDescription>
                                Este item pode ser obtido através da abertura de caixas. Teste sua sorte e obtenha esse
                                item permanente!
                              </FeatureDescription>
                            </FeatureContent>
                          </FeatureColumn>
                          {itemAvailability.includes("Abertura de Containers") && <VerticalDivider />}
                        </>
                      )}

                      {itemAvailability.includes("Abertura de Containers") && (
                        <FeatureColumn>
                          <FeatureIcon>
                            <Image src={"/theim/cards/20250331_222125.webp"} alt="container" height={100} width={80} />
                          </FeatureIcon>
                          <FeatureContent>
                            <FeatureTitle>Abertura de Containers</FeatureTitle>
                            <FeatureDescription>
                              Disponível em containers especiais. Uma forma alternativa de obter este item permanente!
                            </FeatureDescription>
                          </FeatureContent>
                        </FeatureColumn>
                      )}
                    </FeaturesGrid>
                  </FeaturesCard>
                )}
              </ImageSection>

              <DetailsSection>
                <TitleSection>
                  <ProductName rarity={itemRarity}>{trivoInfo.skinName || "Edição Limitada"}</ProductName>
                  <TagsContainer>
                    {trivoInfo.type && trivoInfo.type !== "Indisponível" && (
                      <TypeContainer>
                        <TypeIconWrapper>
                          {["CHAMPION", "XPLAY", "AMIX"].includes(trivoInfo.type) && (
                            <TypeRaritity rarity={trivoInfo.type as "CHAMPION" | "XPLAY" | "AMIX"} />
                          )}
                        </TypeIconWrapper>
                        <TypeInfo>
                          <TypeName rarity={itemRarity}>{trivoInfo.type}</TypeName>
                          <TypeSubtext>CLUB MARKET</TypeSubtext>
                        </TypeInfo>
                      </TypeContainer>
                    )}
                    <OriginContainer>
                      <OriginIcon rarity={itemRarity} />
                      <OriginText>{containerTitle || "Revendedor"}</OriginText>
                    </OriginContainer>
                    <CategoryTag rarity={itemRarity}>{itemRarity || "Comum"}</CategoryTag>
                    <SpecialTag>{trivoInfo.itemName || item.nameitem}</SpecialTag>
                    <RentalTag>Aluguel 7 dias</RentalTag>
                  </TagsContainer>
                </TitleSection>

                <PriceSection>
                  <PriceContainer>
                    <CurrentPrice rarity={itemRarity}>{formatCurrency(item.priceitem)} Bits</CurrentPrice>
                    <RentalInfo>por 7 dias</RentalInfo>
                  </PriceContainer>
                  <PriceFeatures>
                    <PriceFeature rarity={itemRarity}>
                      <Clock size={14} />
                      <span>Aluguel de 7 dias</span>
                    </PriceFeature>
                    <PriceFeature rarity={itemRarity}>
                      <Truck size={14} />
                      <span>Entrega instantânea</span>
                    </PriceFeature>
                  </PriceFeatures>
                </PriceSection>
 
                <ActionsSection>
                  <QuantityControls>
                    <QuantityButton onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                      <Minus size={14} />
                    </QuantityButton>
                    <QuantityDisplay>{quantity}</QuantityDisplay>
                    <QuantityButton onClick={() => setQuantity(quantity + 1 )} disabled={quantity >= 2}>
                      <Plus size={14} />
                    </QuantityButton>
                  </QuantityControls>
                  <AddToCartButton rarity={itemRarity} onClick={addToCart} disabled={isAddingToCart}>
                    {isAddingToCart ? (
                      <>
                        <LoadingSpinner small />
                        Adicionando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Adicionar no carrinho
                      </>
                    )}
                  </AddToCartButton>
                </ActionsSection>
               <p className="text-[12px] text-red">{error}</p>

                <BenefitsSection>
                  <Benefit rarity={itemRarity}>
                    <Zap size={18} />
                    <BenefitText>
                      <BenefitTitle>Entrega Instantânea</BenefitTitle>
                      <BenefitDesc>Receba seu item imediatamente após a confirmação</BenefitDesc>
                    </BenefitText>
                  </Benefit>
                  <Benefit rarity={itemRarity}>
                    <RefreshCw size={18} />
                    <BenefitText>
                      <BenefitTitle>Disponível para Trocas</BenefitTitle>
                      <BenefitDesc>Itens alugados podem ser trocados por outros itens</BenefitDesc>
                    </BenefitText>
                  </Benefit>
                  <Benefit rarity={itemRarity}>
                    <Shield size={18} />
                    <BenefitText>
                      <BenefitTitle>Não Negociável</BenefitTitle>
                      <BenefitDesc>Itens alugados não podem ser vendidos no mercado</BenefitDesc>
                    </BenefitText>
                  </Benefit>

                  <Benefit rarity={itemRarity}>
                    <WalletCards size={18} />

                    <BenefitText>
                      <BenefitTitle>Metodos de pagamentos</BenefitTitle>
                      <BenefitDesc>Itens alugados podem ser adquiridos usando o novision pay</BenefitDesc>
                    </BenefitText>
                  </Benefit>

                  <div className="w-full flex justify-center">
                    <img src="/icons/brand/nvrp_pay.webp" alt="novision pay" height={30} width={100} />
                  </div>
                </BenefitsSection>
              </DetailsSection>
            </ProductGrid>

            <TabSection>
              <TabNavigation>
                <TabButton rarity={itemRarity} active={activeTab === "details"} onClick={() => setActiveTab("details")}>
                  Detalhes
                </TabButton>
                <TabButton rarity={itemRarity} active={activeTab === "specs"} onClick={() => setActiveTab("specs")}>
                  Especificações
                </TabButton>
              </TabNavigation>

              <TabContent>
                {activeTab === "details" && (
                  <DetailsTab>
                    <DetailTitle>Sobre este item</DetailTitle>
                    <DetailText>
                      {item.nameitem} é um item premium disponível para aluguel por 7 dias. Este item oferece uma experiência única durante o
                      período de aluguel.
                    </DetailText>
                    <DetailText>
                      <strong>Importante:</strong> Este é um item alugado, não uma compra permanente. O item ficará
                      disponível em seu inventário por 7 dias após a confirmação da compra. Itens alugados não podem ser
                      negociados no mercado, mas estão disponíveis para trocas com outros jogadores.
                    </DetailText>
                    <DetailText>
                      Durante o período de aluguel, você terá acesso completo ao item e poderá utilizá-lo normalmente.
                      Após o vencimento, o item será automaticamente removido do seu inventário.
                    </DetailText>
                  </DetailsTab>
                )}

                {activeTab === "specs" && (
                  <SpecsTab>
                    <DetailTitle>Especificações Completas</DetailTitle>
                    <SpecGrid>
                      <SpecRow>
                        <SpecLabel>Nome do Item</SpecLabel>
                        <SpecValue>{trivoInfo.itemName || item.nameitem}</SpecValue>
                      </SpecRow>
                      <SpecRow>
                        <SpecLabel>Skin/Variação</SpecLabel>
                        <SpecValue>{trivoInfo.skinName || "Edição Limitada"}</SpecValue>
                      </SpecRow>
                      <SpecRow>
                        <SpecLabel>Categoria</SpecLabel>
                        <SpecValue>{trivoInfo.type || "Comum"}</SpecValue>
                      </SpecRow>
                      <SpecRow>
                        <SpecLabel>Raridade</SpecLabel>
                        <SpecValue rarity={itemRarity}>{itemRarity}</SpecValue>
                      </SpecRow>
                      <SpecRow>
                        <SpecLabel>Origem</SpecLabel>
                        <SpecValue>{containerTitle || "Coleção Exclusiva"}</SpecValue>
                      </SpecRow>
                      <SpecRow>
                        <SpecLabel>Tipo de Aquisição</SpecLabel>
                        <SpecValue>Aluguel Temporário</SpecValue>
                      </SpecRow>
                      <SpecRow>
                        <SpecLabel>Período de Aluguel</SpecLabel>
                        <SpecValue>7 dias</SpecValue>
                      </SpecRow>
                      <SpecRow>
                        <SpecLabel>Negociável no Mercado</SpecLabel>
                        <SpecValue>Não</SpecValue>
                      </SpecRow>
                      <SpecRow>
                        <SpecLabel>Disponível para Troca</SpecLabel>
                        <SpecValue>Sim</SpecValue>
                      </SpecRow>
                      <SpecRow>
                        <SpecLabel>Preço do Aluguel</SpecLabel>
                        <SpecValue rarity={itemRarity}>{formatCurrency(item.priceitem)} Bits</SpecValue>
                      </SpecRow>
                      <SpecRow>
                        <SpecLabel>Entrega</SpecLabel>
                        <SpecValue>Instantânea</SpecValue>
                      </SpecRow>
                      <SpecRow>
                        <SpecLabel>Status</SpecLabel>
                        <SpecValue>Disponível</SpecValue>
                      </SpecRow>
                    </SpecGrid>
                  </SpecsTab>
                )}
              </TabContent>
            </TabSection>

            {/* New Section for Price History and Owners */}
            <AnalyticsSection>
              <StyledCard>
                <StyledCardHeader>
                  <StyledCardTitle rarity={itemRarity}>Valor de mercado</StyledCardTitle>

                  <TimeFilterContainer>
                    <TimeFilterButton>1D</TimeFilterButton>
                    <TimeFilterButton>7D</TimeFilterButton>
                    <TimeFilterButton>1M</TimeFilterButton>
                    <TimeFilterButton active>All</TimeFilterButton>
                  </TimeFilterContainer>
                </StyledCardHeader>
                <StyledCardContent>
                  {analyticsLoading ? (
                    <LoadingChartContainer>
                      <LoadingSpinner small />
                      <LoadingText>Carregando dados de análise...</LoadingText>
                    </LoadingChartContainer>
                  ) : chartData.length > 0 ? (
                    <>
                      <ChartWrapper>
                        <ResponsiveContainer width="100%" height={250}>
                          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={rarityTextColor} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={rarityTextColor} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                              dataKey="price"
                              stroke="#888888"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(value) => `${value} Bits`}
                            />
                            <Tooltip cursor={false} content={<CustomTooltip />} />
                            <Area
                              type="monotone"
                              dataKey="price"
                              stroke={rarityTextColor}
                              fillOpacity={1}
                              fill="url(#colorPrice)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartWrapper>
                    </>
                  ) : (
                    <StyledNoDataText>Nenhum histórico de preço disponível.</StyledNoDataText>
                  )}
                </StyledCardContent>
              </StyledCard>

              <StyledCard>
                <StyledCardHeader>
                  <StyledCardTitle rarity={itemRarity}>Proprietários </StyledCardTitle>
                  <StyledOwnersCount rarity={itemRarity}>{itemAnalytics?.totalOwners ?? "N/A"}</StyledOwnersCount>
                </StyledCardHeader>
                <StyledCardContent>
                  {analyticsLoading ? (
                    <LoadingChartContainer>
                      <LoadingSpinner small />
                      <LoadingText>Carregando...</LoadingText>
                    </LoadingChartContainer>
                  ) : (
                    <>
                      {itemAnalytics?.owners && itemAnalytics.owners.length > 0 && (
                        <OwnersListContainer>
                          {itemAnalytics.owners.map((owner) => (
                            <OwnerItem key={owner.id}>
                              <OwnerAvatar
                                rarity={itemRarity}
                                src={owner.avatar}
                                alt={owner.name}
                                width={32}
                                height={32}
                              />
                              <OwnerName>{owner.name}</OwnerName>
                            </OwnerItem>
                          ))}
                        </OwnersListContainer>
                      )}
                      {itemAnalytics?.owners && itemAnalytics.owners.length === 0 && (
                        <StyledNoDataText>Nenhum proprietário encontrado.</StyledNoDataText>
                      )}
                    </>
                  )}
                </StyledCardContent>
              </StyledCard>
            </AnalyticsSection>
          </ContentWrapper>
        </Container>
      </MainView>
    </>
  )
}

 
ProductPage.Layoutrivo  = function Layoutrivo(page: any) {
  return <>{page}</>
}


export const getServerSideProps: GetServerSideProps<Props> = withSession(
    async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
      const req: NextIronRequest = context.req as NextIronRequest;
    
   // Chamando TheNoVisionRoute para verificar a sessão do usuário
   const result = await TheNoVisionRoute({ req });
  
   const user = result.props.user;
   if (!user) {
    return {
    redirect: {
   destination: ROUTENVX.signin, 
    permanent: false,
      },
    };
  }
    let Permissions: Permission[] = [];
    let logs: ModLog[] = [];
  
    if (user) {
      const userId = user.id;
      const guildId = "1175857498687807560"; 
      
      try {
        logs = await getModLogs(guildId, userId);
        Permissions = await getPermission(guildId, userId);
  
        // Convert Date objects to string representations
        Permissions.forEach((permission) => {
          permission.created_at = permission.created_at.toString();
        });
  
      } catch (error) {
        console.error("Error fetching information:", error);
      }
    }
  
    return {
      props: {
        user,
        Permissions,
        logs,
      },
    };
  }
  );
  

const applyOpacity = (color: string, opacity: number): string => {
  if (color.startsWith("rgba")) {
    // Substitui apenas o valor de opacidade
    return color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, `rgba($1, $2, $3, ${opacity})`);
  }

  if (color.startsWith("rgb")) {
    // Converte rgb para rgba adicionando opacidade
    return color.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/, `rgba($1, $2, $3, ${opacity})`);
  }

  return color; // fallback (se for nome de cor ou inválido)
};

// Animations
const spin = keyframes`
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
`

const fadeInUp = keyframes`
0% { opacity: 0; transform: translateY(20px); }
100% { opacity: 1; transform: translateY(0); }
`

const slideInRight = keyframes`
0% { opacity: 0; transform: translateX(20px); }
100% { opacity: 1; transform: translateX(0); }
`

 
const MainView = styled.div`
  font-family: 'ProximaNova-Italic', sans-serif;
  animation: ${fadeInUp} 0.6s ease-out;
  margin: 0.3em;
  border-radius: 12px;
   
`

const Container = styled.div`
max-width: 1200px;
margin: 0 auto;
 
display: flex;
flex-direction: column;
padding: 0 1rem 4rem;
`
 

// Image Modal
const ImageModal = styled.div`
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0, 0, 0, 0.85);
display: flex;
align-items: center;
justify-content: center;
z-index: 2000;
`

const ModalContent = styled.div`
position: relative;
max-width: 90vw;
max-height: 90vh;
display: flex;
flex-direction: column;
align-items: center;
gap: 1rem;
`

const CloseButton = styled.button`
position: absolute;
top: -2.5rem;
right: 0;
background: rgba(45, 48, 46, 0.9);
border: 1px solid #2d302e;
border-radius: 8px;
width: 36px;
height: 36px;
display: flex;
align-items: center;
justify-content: center;
color: white;
cursor: var(--f-cursor-pointer);
transition: all 0.2s ease;

&:hover {
background: #2d302e;
color: #676d68;
}
`

const ModalImage = styled.img`
max-width: 100%;
max-height: 70vh;
object-fit: contain;
border-radius: 12px;
border: 1px solid #2d302e;
`

const ImageNavigation = styled.div`
display: flex;
align-items: center;
gap: 1rem;
background: rgba(26, 28, 27, 0.95);
padding: 0.75rem 1.5rem;
border-radius: 8px;
border: 1px solid #2d302e;
`

const NavButton = styled.button`
background: rgba(45, 48, 46, 0.8);
border: 1px solid #2d302e;
border-radius: 8px;
width: 32px;
height: 32px;
display: flex;
align-items: center;
justify-content: center;
color: white;
cursor: var(--f-cursor-pointer);
transition: all 0.2s ease;

&:hover {
background: #2d302e;
color: #a0a7a2;
}
`

const ImageCounter = styled.span`
color: white;
font-weight: 500;
font-size: 14px;
min-width: 50px;
text-align: center;
`

// Loading states
const LoadingContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 100vh;
background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
color: white;
gap: 1rem;
font-family: 'Poppins', sans-serif;
`

const LoadingSpinner = styled.div<{ small?: boolean }>`
width: ${(props) => (props.small ? "16px" : "40px")};
height: ${(props) => (props.small ? "16px" : "40px")};
border: 2px solid rgba(109, 112, 110, 0.3);
border-top: 2px solid #4a4d4a;
border-radius: 50%;
animation: ${spin} 1s linear infinite;
`

const LoadingText = styled.p`
color: white;
font-size: 1rem;
font-weight: 500;
margin: 0;
`

const ErrorContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 100vh;
background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
color: white;
gap: 1.5rem;
text-align: center;
padding: 2rem;
font-family: 'Poppins', sans-serif;
`

const ErrorSubtext = styled.p`
color: rgba(255, 255, 255, 0.7);
font-size: 1rem;
margin: 0;
max-width: 500px;
`

// Header
const Header = styled.header`
display: grid;
grid-template-columns: 1fr 2fr 1fr;
align-items: center;
padding: 2.5rem 0;
gap: 1rem;
`

const BackButtonDesktop = styled.button`
display: flex;
align-items: center;
gap: 0.75rem;
padding: 0.75rem 1.25rem;

border-radius: 8px;
color: rgba(255, 255, 255, 0.8);
font-family: 'Poppins', sans-serif;
font-weight: 500;

transition: all 0.2s ease;

&:hover {
color: #484d49;
border-color: #575a58;
}
`

const BackText = styled.span`
font-size: 14px;
font-weight: 500;
`

const ProductTitle = styled.h1`
margin: 0;
text-align: center;
font-size: 1.5rem;
font-family: 'XcSemibold';
font-weight: 600;
text-transform: uppercase;
color: rgba(163, 167, 164, 0.116);

@media (min-width: 768px) {
font-size: 1.75rem;
}
`

const HeaderActions = styled.div`
display: flex;
justify-content: flex-end;
gap: 0.75rem;
`

const ActionButton = styled.button`
width: 40px;
height: 40px;
background: rgba(51, 53, 51, 0.8);
border: 1px solid #2d302e;
border-radius: 50%;
color: rgba(255, 255, 255, 0.8);
display: flex;
align-items: center;
justify-content: center;
cursor: var(--f-cursor-pointer);
transition: all 0.2s ease;

&:hover {
color: #626864;
border-color: #b9c0ba;
}
`

// Main content
const ContentWrapper = styled.div`
display: flex;
flex-direction: column;
gap: 3rem;
`

const ProductGrid = styled.div`
display: grid;
grid-template-columns: 1fr;
gap: 2rem;

@media (min-width: 1024px) {
grid-template-columns: 1fr 1fr;
gap: 3rem;
}
`

const ImageSection = styled.div`
display: flex;
flex-direction: column;
gap: 1rem;
`
 
const MainImageContainer = styled.div<{ bg: string, rarityBorderColor: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 3rem 2rem;
  background: ${(props) => applyOpacity(props.bg, 0.1)};
  border: 1px solid ${(props) => props.rarityBorderColor};
  max-height: 300px;
  overflow: hidden;
  width: 100%;
  transition: all 0.2s ease;

  
`

const RentalBadge = styled.div`
position: absolute;
top: 1rem;
right: 1rem;
background: rgba(91, 94, 92, 0.231);
color: white;
font-family: 'ProximaNova-Italic', sans-serif;
padding: 0.5rem 1rem;
border-radius: 38px;
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 1px;
z-index: 10;
`

const BackgroundIcon = styled.svg`
position: absolute;
height: 12rem;
width: 12rem;
color: #2d302e;
opacity: 0.3;
`

const ProductImage = styled.img`
z-index: 10;
max-width: 100%;
max-height: 300px;
object-fit: contain;
transition: transform 0.2s ease;

&:hover {
transform: scale(1.02);
}
`

const ImageOverlay = styled.div`
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0, 0, 0, 0.6);
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 0.5rem;
color: white;
opacity: 0;
transition: opacity 0.2s ease;
cursor: var(--f-cursor-pointer);

span {
font-weight: 500;
font-size: 14px;
}
`

const ThumbnailContainer = styled.div`
display: flex;
flex-direction: column;
gap: 0.15rem;
 
`

const Thumbnail = styled.img<{ active: boolean }>`
width: 70px;
height: 70px;
object-fit: cover;
border-radius: 8px;
border: 1px solid ${(props) => (props.active ? "#5b615d" : "#2d302e")};
cursor: var(--f-cursor-pointer);
transition: all 0.2s ease;
opacity: ${(props) => (props.active ? 1 : 0.7)};

&:hover {
border-color: #7d837e;
opacity: 1;
}
`

const DetailsSection = styled.div`
display: flex;
flex-direction: column;
gap: 2rem;
animation: ${slideInRight} 0.6s ease-out;
`

const TitleSection = styled.div`
display: flex;
flex-direction: column;
gap: 1rem;
`

const ProductName = styled.h1<{ rarity: string }>`
font-size: 2rem;
font-weight: 600;
color: #ddd;
margin: 0;
line-height: 1.2;

@media (min-width: 768px) {
font-size: 2.25rem;
}
`

const TagsContainer = styled.div`
display: flex;
align-items: center;
gap: 0.5rem;
flex-wrap: wrap;
`

const Tag = styled.div`
border-radius: 8px;
border: 1px solid;
color: white;
padding: 0.5rem 0.75rem;
font-size: 12px;
font-weight: 500;
text-transform: uppercase;
`

const CategoryTag = styled(Tag)<{ rarity: string }>`
border-color: ${(props) => getRarityBorderColor(props.rarity)};
background: ${(props) => getRarityTagBackground(props.rarity)};
color: ${(props) => getRarityTextColor(props.rarity)};
`

const SpecialTag = styled(Tag)`
border-color: #2d302e;
background: rgba(45, 48, 46, 0.3);
color: rgba(255, 255, 255, 0.8);
`

const RentalTag = styled(Tag)`
border-color: #646865;
background: rgba(117, 121, 118, 0.1);
color: #b2b8b3;
`

const PriceSection = styled.div`
display: flex;
flex-direction: column;
gap: 1rem;
padding: 1.5rem;

border-radius: 12px;
`

const PriceContainer = styled.div`
display: flex;
align-items: center;
gap: 1rem;
flex-wrap: wrap;
`

const CurrentPrice = styled.span<{ rarity: string }>`
font-size: 1.75rem;
font-weight: 600;
color: #ddd;
font-family: 'XcSemibold';
 
@media (min-width: 768px) {
font-size: 2rem;
}
`

const RentalInfo = styled.span`
font-size: 1rem;
color: rgba(255, 255, 255, 0.7);
font-weight: 400;
`

const PriceFeatures = styled.div`
display: flex;
gap: 1rem;
flex-wrap: wrap;
`

const PriceFeature = styled.div<{ rarity: string }>`
display: flex;
align-items: center;
gap: 0.5rem;
color: rgba(255, 255, 255, 0.7);
font-size: 14px;

svg {
color: ${(props) => getRarityTextColor(props.rarity)};
}
`

const QuantitySection = styled.div`
display: flex;
flex-direction: column;
gap: 1rem;
padding: 1.5rem;
background:  rgba(88, 90, 88, 0.205);
border-radius: 12px;
`

const QuantityLabel = styled.span`
font-size: 1rem;
font-weight: 500;
color: white;
`

const QuantityControls = styled.div`
display: flex;
align-items: center;
gap: 1rem;
`

const QuantityButton = styled.button`
width: 36px;
height: 36px;
background: rgba(46, 48, 47, 0.1);
border: 1px solid #747975;
border-radius: 50%;
color: #c0cac3;
display: flex;
align-items: center;
justify-content: center;
cursor: var(--f-cursor-pointer);
transition: all 0.2s ease;

&:hover:not(:disabled) {
background: #5a5c5a;
color: white;
}

&:disabled {
opacity: 0.5;
cursor: not-allowed;
}
`

const QuantityDisplay = styled.span`
min-width: 50px;
text-align: center;
font-size: 0.9rem;
font-weight: 600;
color: white;
background: rgba(117, 121, 118, 0.226);
padding: 0.3rem;
border-radius: 28px;
border: 1px solid #2d302e;
`

const TotalPrice = styled.div`
margin-left: auto;
font-size: 1.1rem;
font-weight: 600;
color: #c9d3cc;
`

const ActionsSection = styled.div`
display: flex;
flex-direction: row;
align-items: center;
gap: 1rem;
`

const AddToCartButton = styled.button<{ rarity: string }>`
position: relative;
display: flex;
align-items: center;
justify-content: center;
gap: 0.75rem;
width: 100%;
padding: 0.8rem 1rem;
background: linear-gradient(135deg, #2a2b2a 0%, ${(props) => getRarityTagBackground(props.rarity).replace("rgba", "rgb").replace(", 0.1", ", 0.116")} 100%);
border: none;
border-radius: 46px;
color: #d5dad6;
font-size: 14px;
font-weight: 600;
font-family: 'InterSemibold', monospace;
transition: all 0.9s cubic-bezier(0.4, 0, 0.2, 1);
overflow: hidden;

&:hover:not(:disabled) {
transform: translateY(-3px);
box-shadow: 0 15px 35px ${(props) => getRarityShadowColor(props.rarity)};
background: linear-gradient(135deg, #3d3f3d 0%, ${(props) => getRarityTagBackground(props.rarity).replace("rgba", "rgb").replace(", 0.1", ", 0.15")} 100%);
}

&:active:not(:disabled) {
transform: translateY(-1px);
}
`
  
const BenefitsSection = styled.div`
display: flex;
flex-direction: column;
gap: 1rem;
padding: 1.5rem;
background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
border: 1px solid #2d302e;
border-radius: 12px;
`

const Benefit = styled.div<{ rarity: string }>`
display: flex;
align-items: flex-start;
gap: 0.75rem;

svg {
color: ${(props) => getRarityTextColor(props.rarity)};
margin-top: 0.125rem;
flex-shrink: 0;
}
`

const BenefitText = styled.div`
display: flex;
flex-direction: column;
gap: 0.25rem;
`

const BenefitTitle = styled.h4`
font-size: 0.9rem;
font-weight: 600;
color: white;
margin: 0;
`

const BenefitDesc = styled.p`
font-size: 0.8rem;
color: rgba(255, 255, 255, 0.7);
margin: 0;
line-height: 1.4;
`

// Tab Section
const TabSection = styled.div`
display: flex;
flex-direction: column;
background: linear-gradient(145deg, #1c1d1d 0%, #21222249 100%);
 
border-radius: 12px;
overflow: hidden;
`

const TabNavigation = styled.div`
display: flex;
background: rgba(45, 48, 46, 0.3);
border-bottom: 1px solid #2d302e;
`

const TabButton = styled.button<{ active: boolean; rarity: string }>`
flex: 1;
padding: 1rem 1.5rem;
background: ${(props) => (props.active ? getRarityTagBackground(props.rarity) : "transparent")};
border: none;
border-bottom: 2px solid ${(props) => (props.active ? getRarityBorderColor(props.rarity) : "transparent")};
color: #ddd;
font-weight: 500;
cursor: var(--f-cursor-pointer);
transition: all 0.2s ease;
font-family: 'Poppins', sans-serif;

&:hover {
background: ${(props) => getRarityTagBackground(props.rarity).replace("0.1", "0.05")};
color: #ddd;
}
`

const TabContent = styled.div`
padding: 1.5rem;
`

const DetailsTab = styled.div`
display: flex;
flex-direction: column;
gap: 1rem;
`

const DetailTitle = styled.h3`
font-size: 1.1rem;
font-weight: 600;
color: white;
margin: 0;
`

const DetailText = styled.p`
font-size: 0.9rem;
line-height: 1.6;
color: rgba(255, 255, 255, 0.8);
margin: 0;
`

const SpecsTab = styled.div`
display: flex;
flex-direction: column;
gap: 1rem;
`

const SpecGrid = styled.div`
display: flex;
flex-direction: column;
gap: 0.75rem;
`

const SpecRow = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding: 1rem;
border-radius: 8px;
background: rgba(45, 48, 46, 0.3);

`

const SpecLabel = styled.span`
font-size: 0.9rem;
font-weight: 500;
color: rgba(255, 255, 255, 0.7);
`

const SpecValue = styled.span<{ rarity?: string }>`
font-size: 0.9rem;
font-weight: 600;
color: #ddd;
`

// Features section
const FeaturesCard = styled.div`
border-radius: 12px;
background: linear-gradient(145deg, #1c1d1d 0%, #2f302f8f 100%);

padding: 2rem;
display: flex;
flex-direction: column;
gap: 2rem;
`

const FeaturesTitle = styled.h3`
font-size: 1.1rem;
font-weight: 600;
color: white;
margin: 0;
text-align: center;
`

const FeaturesGrid = styled.div`
display: flex;
justify-content: center;
gap: 2rem;

@media (max-width: 640px) {
  display: grid;
grid-template-columns: ${(props: any) => {
  // Dynamically adjust grid based on content
  const children = props.children.length
  if (children === 3) return "1fr 1px 1fr"
  return "1fr"
}};
}
`

const FeatureColumn = styled.div`
display: flex;
flex-direction: column;
align-items: center;
gap: 1rem;
text-align: center;
`

const FeatureIcon = styled.div`
color: #bcc5be;
margin-bottom: 0.5rem;
`

const FeatureContent = styled.div`
display: flex;
flex: 1;
flex-direction: column;
align-items: center;
gap: 0.75rem;
`

const FeatureTitle = styled.h4`
font-size: 1rem;
font-weight: 600;
color: white;
margin: 0;
`

const FeatureDescription = styled.p`
font-size: 0.85rem;
max-width: 340px;
color: rgba(255, 255, 255, 0.7);

margin: 0;
`
 
const VerticalDivider = styled.hr`
border: none;
background: #2d302e;

@media (max-width: 639px) {
height: 1px;
width: 100%;
}

@media (min-width: 640px) {
width: 1px;
height: 100%;
}
`

const BackButton = styled.button`
display: flex;
align-items: center;
gap: 0.75rem;
padding: 1rem 1.5rem;
background: #393b3a;
border: none;
border-radius: 8px;
color: white;
font-weight: 500;
cursor: var(--f-cursor-pointer);
transition: all 0.2s ease;
font-family: 'Poppins', sans-serif;

&:hover {
background: #787e79;
}
`

// New styled components for analytics section
const AnalyticsSection = styled.div`
display: grid;
grid-template-columns: 1fr;
gap: 2rem;
margin-top: 2rem;

@media (min-width: 768px) {
grid-template-columns: 2fr 1fr;
}
`

const StyledCard = styled.div`
width: 100%;
background:  rgba(88, 90, 88, 0.205);
color: white;
border-radius: 0.75rem;  
overflow: hidden; 
`

const StyledCardHeader = styled.div`
padding: 1.5rem;  
display: flex;
align-items: center;
justify-content: space-between;
width: 100%;
`

const StyledCardTitle = styled.h3<{ rarity: string }>`
font-size: 1.125rem; 
font-weight: 600;  
color: #ddd;
`

const StyledCardContent = styled.div`
padding: 1.5rem;  
&.flex {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 150px;
}
`

const LoadingChartContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 200px;
flex-direction: column;
gap: 1rem;
`

const StyledNoDataText = styled.p`
text-align: center;
color: rgba(255, 255, 255, 0.7); 
`

const StyledOwnersCount = styled.p<{ rarity: string }>`
font-size: 15px;  
font-weight: bold;
color: ${(props) => getRarityTextColor(props.rarity)};
`

const StyledOwnersLabel = styled.p`
color: rgba(255, 255, 255, 0.7); 
margin-top: 0.5rem;  
`

const StyledErrorText = styled.h1`
font-size: 2rem;
color: white;
margin: 0;
font-weight: 600;
`

const ChartWrapper = styled.div`
min-height: 200px;
width: 100%;
`

const StyledTooltipContent = styled.div`
background-color: rgba(26, 28, 27, 0.95);
border: 1px solid #2d302e;
padding: 0.75rem;
border-radius: 8px;
color: white;
font-size: 0.875rem;

.label {
font-weight: 600;
margin-bottom: 0.25rem;
}
.intro {
color: #565c57;
}
`

// Add new styled components for TimeFilterContainer and TimeFilterButton
const TimeFilterContainer = styled.div`
display: flex;
gap: 0.5rem;
justify-content: flex-end;
margin-bottom: 1rem;
padding-right: 1.5rem; /* Align with card padding */
`

const TimeFilterButton = styled.button<{ active?: boolean }>`
background: ${(props) => (props.active ? "rgba(167, 173, 168, 0.2)" : "transparent")};

color: ${(props) => (props.active ? "#dbe0db" : "rgba(171, 177, 173, 0.7)")};
padding: 0.4rem 1rem;
border-radius: 26px;
font-size: 0.8rem;
font-weight: 500;
font-family: 'InterSemiBold', monospace;

transition: all 0.2s ease;

&:hover {
background: rgba(146, 151, 147, 0.1);
color: #c5cac6;
}
`

// New styled components for Owners List
const OwnersListContainer = styled.div`

width: 100%;
overflow-y: auto;
height: 300px;


&::-webkit-scrollbar {
width: 8px;
}
&::-webkit-scrollbar-track {
background: #1a1c1b;
border-radius: 10px;
}
&::-webkit-scrollbar-thumb {
background: #41b45e;
border-radius: 10px;
}
`

const OwnerItem = styled.div`
display: flex;
flex-direction: row;

align-items: center;
gap: 0.5rem;
background: rgba(45, 48, 46, 0.3);

border-radius: 12px;
padding: 0.75rem;
text-align: center;
`

const OwnerAvatar = styled(Image)<{ rarity: string }>`
border-radius: 50%;
object-fit: cover;
border: 2px solid ${(props) => getRarityBorderColor(props.rarity)};
`

const OwnerName = styled.span`
font-size: 0.85rem;
font-weight: 500;
color: white;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
max-width: 100%;
`

// Styled components for TypeContainer, TypeIconWrapper, TypeInfo, TypeName, TypeSubtext, OriginContainer, OriginIcon, OriginText
const TypeContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-right: 1rem;
`

const TypeIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`

const TypeInfo = styled.div`
  display: flex;
  flex-direction: column;
  height: 22px;
`

const TypeName = styled.span<{ rarity: string }>`
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 0.75rem;
 color: #ddd;
`

const TypeSubtext = styled.span`
  font-weight: 600;
  color: #b6bbce; /* keydropcomheather */
  font-size: 0.625rem;
  line-height: 0.625rem;
`

const OriginContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding-top: 0.25rem;
`

const OriginIcon = styled(AlignVerticalSpaceAround)<{ rarity: string }>`
  width: 18px;
  height: 18px;
  color: #ddd;
`

const OriginText = styled.span`
  font-weight: bold;
  color: #b6bbce; /* keydropcomheather */
  font-size: 0.75rem;
  line-height: 0.9375rem;
`
