"use client"
import styled from "styled-components"

import type { ReactNode } from "react"
import { Crown, Check, Lock, ChevronLeft, ChevronRight, RefreshCcwDot } from "lucide-react"
import { useState, useEffect } from "react"

import { Loader2 } from "lucide-react"
import { useToast } from "@/shop/ac/toat-shop"
import PremiumPurchaseModal from "./premium-purchase-modal"
import { useBattlePass } from "@/lib/services/level/useBattlepass"

export default function AdvancedBattlePassInterface({ viewuser }: { viewuser: ReactNode }) {
  const { data, isLoading, claimReward, buyPremium, mutate } = useBattlePass()
  const [selectedTab, setSelectedTab] = useState<"tiers" | "missions">("tiers")
  const [currentTierIndex, setCurrentTierIndex] = useState(0)
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [selectedRewardType, setSelectedRewardType] = useState<"free" | "premium">("free")
  const [claiming, setClaiming] = useState<number | null>(null)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [loadingStates, setLoadingStates] = useState({
    claimReward: false,
    buyPremium: false,
    completeMission: false,
  })

  const { addToast } = useToast()
const handleRefresh = async () => await mutate();
  
  
  const toast = ({
    title,
    description,
    variant = "info",
  }: {
    title: string
    description?: string
    variant?: any
  }) => {
    const message = description ? `${title} - ${description}` : title
    addToast(message, variant)
  }

  useEffect(() => {
    handleRefresh();
  }, []);
  useEffect(() => {
    if (!data?.timeRemaining) return

    const targetTime = Date.now() + data.timeRemaining

    const timer = setInterval(() => {
      const remaining = targetTime - Date.now()

      if (remaining <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(timer)
        return
      }

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)
   
    return () => clearInterval(timer)
    
  }, [data?.timeRemaining])

  const handleClaimReward = async (tier: number, isPremium: boolean) => {
    setClaiming(tier)

    try {
      await claimReward(tier, isPremium)

      toast({
        title: "🎉 Recompensa Única Resgatada!",
        description: `Você resgatou a recompensa do nível ${tier}${isPremium ? " (Premium)" : ""}${data?.algorithmInfo?.uniqueItemsGuarantee ? " - Item exclusivo da temporada!" : ""}`,
      })

      await mutate()
    } catch (error: any) {
      toast({
        title: "Erro ao resgatar recompensa",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setClaiming(null)
      await mutate()
    }
  }

  const handleBuyPremium = async () => {
    setLoadingStates((prev) => ({ ...prev, buyPremium: true }))
    try {
      await buyPremium()
      toast({
        title: "🚀 Premium Avançado Ativado!",
        description: "Agora você tem acesso a todas as recompensas premium únicas!",
        variant: "default",
      })
      setShowPremiumModal(false)
    } catch (error: any) {
      toast({
        title: "Erro ao ativar Premium",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, buyPremium: false }))
      await mutate()
    }
  }

  // ↔️ Navegar entre os tiers
  const navigateTiers = (direction: "left" | "right") => {
    if (direction === "left" && currentTierIndex > 0) {
      setCurrentTierIndex(currentTierIndex - 1)
    } else if (direction === "right" && data && currentTierIndex < data.tiers.length - 6) {
      setCurrentTierIndex(currentTierIndex + 1)
    }
  }

  // 🔄 Loading
  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </Container>
    )
  }

  // ❌ Erro
  if (!data) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorText>Erro ao carregar Battle Pass Avançado</ErrorText>
        </ErrorContainer>
      </Container>
    )
  }

  // 🎁 NOVA FUNÇÃO: Gerenciar recompensas com sistema avançado
  const formatAdvancedReward = (reward: any) => {
    if (!reward) return null
      
    return getAdvancedRewardDisplayInfo(reward)
  }

  const getAdvancedRewardIcon = (reward: any) => {
    if (!reward) return "/icons/search-engine.png"
    return reward.image || "/icons/search-engine.png"
  }

  // 🎯 Tier e progresso
  const visibleTiers = data.tiers.slice(currentTierIndex, currentTierIndex + 6)
  const currentTier = data.tiers[data.userProgress.currentTier - 1]

  const xpPerLevel = 1000
  const totalSegments = 5
  const currentLevel = data.userProgress.currentTier
  const totalXP = data.userProgress.totalXP
  const currentXP = totalXP % xpPerLevel
  const progress = currentXP / xpPerLevel
  const activeSegments = Math.floor(progress * totalSegments)
  const hasHalfSegment = (progress * totalSegments) % 1 >= 0.5

  const tierToShow = data.tiers.find((t) => t.tier === (selectedTier ?? data.userProgress.currentTier))
  const rewardToShow = tierToShow
    ? selectedRewardType === "premium"
      ? formatAdvancedReward(tierToShow.premiumReward)
      : formatAdvancedReward(tierToShow.freeReward)
    : null

 
   
  return (
    <Container>
      <MainContent>
        <LeftSection>
          {viewuser}

          <SectionTitle>
            RECOMPENSAS
            <br />
            DO PASSE DE BATALHA
          </SectionTitle>
 
          <SectionDescription>
            Battlepass clubvision
            <br />
           Ganhe recompensas exclusivas que você não verá em nenhum outro lugar!
          </SectionDescription>

          <ProgressInfo>
            <TierHexagonContainer className="h-[50px] w-[50px]">
              <HexagonSVG width="30" height="30" viewBox="0 0 136 136" fill="none">
                <g filter="url(#filter0_d_3528_6694)">
                  <HexagonPath
                    d="M64 5.3094C66.4752 3.88034 69.5248 3.88034 72 5.3094L120.292 33.1906C122.767 34.6197 124.292 37.2607 124.292 40.1188V95.8812C124.292 98.7393 122.767 101.38 120.292 102.809L72 130.691C69.5248 132.12 66.4752 132.12 64 130.691L15.7083 102.809C13.2331 101.38 11.7083 98.7393 11.7083 95.8812V40.1188C11.7083 37.2607 13.2331 34.6197 15.7083 33.1906L64 5.3094Z"
                    isPremium={true}
                    isUnlocked={true}
                    isClaimed={false}
                  />
                </g>
                <g data-hex-emblem-stroke="true" filter="url(#filter1_d_3528_6694)">
                  <HexagonStroke
                    d="M71.75 5.74241L120.042 33.6236C122.362 34.9634 123.792 37.4393 123.792 40.1188V95.8812C123.792 98.5607 122.362 101.037 120.042 102.376L71.75 130.258C69.4295 131.597 66.5705 131.597 64.25 130.258L15.9583 102.376C13.6378 101.037 12.2083 98.5607 12.2083 95.8812V40.1188C12.2083 37.4393 13.6378 34.9634 15.9583 33.6236L64.25 5.74241C66.5705 4.40267 69.4295 4.40267 71.75 5.74241Z"
                    isPremium={true}
                    isUnlocked={true}
                    isClaimed={false}
                  />
                </g>
                <HexagonInner
                  data-hex-emblem-inner="true"
                  d="M64.0001 27.2948C66.4753 25.8657 69.5249 25.8657 72.0001 27.2948L101.252 44.1833C103.727 45.6124 105.252 48.2534 105.252 51.1115V84.8886C105.252 87.7467 103.727 90.3878 101.252 91.8168L72.0001 108.705C69.5249 110.134 66.4753 110.134 64.0001 108.705L34.7482 91.8168C32.273 90.3878 30.7482 87.7467 30.7482 84.8886V51.1115C30.7482 48.2534 32.273 45.6124 34.7482 44.1833L64.0001 27.2948Z"
                  fillOpacity="0.18"
                  isPremium={true}
                  isUnlocked={true}
                  isClaimed={false}
                />

                <defs>
                  <filter
                    id="filter0_d_3528_6694"
                    x="11.7085"
                    y="4.2373"
                    width="112.583"
                    height="131.525"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    ></feColorMatrix>
                    <feOffset dy="4"></feOffset>
                    <feComposite in2="hardAlpha" operator="out"></feComposite>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3528_6694"></feBlend>
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_3528_6694"
                      result="shape"
                    ></feBlend>
                  </filter>
                  <filter
                    id="filter1_d_3528_6694"
                    x="11.7085"
                    y="4.2373"
                    width="112.583"
                    height="131.525"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    ></feColorMatrix>
                    <feOffset dy="4"></feOffset>
                    <feComposite in2="hardAlpha" operator="out"></feComposite>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3528_6694"></feBlend>
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_3528_6694"
                      result="shape"
                    ></feBlend>
                  </filter>
                </defs>
              </HexagonSVG>

              <ClaimedOverlay>
                <Check size={12} />
              </ClaimedOverlay>
            </TierHexagonContainer>

            <li>
              <ProgressCount>
                {data.userProgress.claimedTiers.length + data.userProgress.claimedPremiumTiers.length}/100
              </ProgressCount>
              <ProgressLabel>RECOMPENSAS ÚNICAS RESGATADAS</ProgressLabel>
            </li>
          </ProgressInfo>
        </LeftSection>

        <CenterSection>
          <QuickStatValue premium={data.userProgress.isPremium}>
            {data.userProgress.isPremium ? "Premium" : "clubr"}
          </QuickStatValue>

          {selectedTab === "tiers" && tierToShow && rewardToShow && (
            <FeaturedReward>
              <RewardImage>
                {typeof getAdvancedRewardIcon(
                  selectedRewardType === "premium" ? tierToShow.premiumReward : tierToShow.freeReward,
                ) === "string" ? (
                  <img
                    src={getAdvancedRewardIcon(
                      selectedRewardType === "premium" ? tierToShow.premiumReward : tierToShow.freeReward,
                    )}
                    alt="recompensa"
                    className="rounded-md"
                    height={150}
                    width={150}
                  />
                ) : (
                  <IconWrapper>
                    {getAdvancedRewardIcon(
                      selectedRewardType === "premium" ? tierToShow.premiumReward : tierToShow.freeReward,
                    )}
                  </IconWrapper>
                )}
              </RewardImage>

              <RewardName>{rewardToShow.name || `RECOMPENSA NÍVEL ${tierToShow.tier}`}</RewardName>

              {/* 🆕 Indicadores de Recompensa Única */}
              <RewardBadges>
                {rewardToShow.seasonExclusive && <ExclusiveBadge>🏆 EXCLUSIVO DA TEMPORADA</ExclusiveBadge>}
                {tierToShow.isEmpty && <EmptyBadge>🚫 TIER VAZIO</EmptyBadge>}
              </RewardBadges>

              {/* Updated claim button logic */}
              {(() => {
                // Check if the current reward is already claimed
                const isCurrentRewardClaimed =
                  selectedRewardType === "premium"
                    ? data.userProgress.claimedPremiumTiers.includes(tierToShow.tier)
                    : data.userProgress.claimedTiers.includes(tierToShow.tier)

                // For premium rewards, check if free reward is claimed and user has premium
                const canClaimPremium =
                  selectedRewardType === "premium"
                    ? data.userProgress.claimedTiers.includes(tierToShow.tier) && data.userProgress.isPremium
                    : true

                // Don't show button if already claimed or tier is empty
                if (isCurrentRewardClaimed || tierToShow.isEmpty) {
                  return null
                }

                // For premium rewards, don't show button if free reward isn't claimed yet or user doesn't have premium
                if (selectedRewardType === "premium" && !canClaimPremium) {
                  return null
                }

                // For free rewards, don't show button if tier is locked
                if (selectedRewardType === "free" && tierToShow.tier > data.userProgress.currentTier) {
                  return null
                }

                return (
                  <ClaimRewardButton
                    onClick={() => handleClaimReward(tierToShow.tier, selectedRewardType === "premium")}
                    disabled={claiming === tierToShow.tier}
                  >
                    {claiming === tierToShow.tier ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <h3>RESGATANDO...</h3>
                      </>
                    ) : (
                      <>
                        <h3>RESGATAR </h3>
                        <CrownCount>{tierToShow.xpRequired || 10}</CrownCount>
                      </>
                    )}
                  </ClaimRewardButton>
                )
              })()}

              {tierToShow.isEmpty && (
                <EmptyTierMessage>
                  Este tier foi deixado vazio pelo algoritmo inteligente.
                  <br />
                  Tiers vazios fazem parte da estratégia avançada!
                </EmptyTierMessage>
              )}
            </FeaturedReward>
          )}
        </CenterSection>

        {/* Right Section */}
        <RightSection>

          <ExpirationInfo>
            TEMPORADA {data.season.seasonNumber} EXPIRA DAQUI
            <br />
            <ExpirationTime>{timeLeft.days} DIAS</ExpirationTime>
          </ExpirationInfo>
        
          <Anim>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b rounded-full from-black/80 to-black/40 z-0"></div>

              <div className="relative z-10 flex flex-col items-center">
                {/* Indicador de Nível */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#00ff6a]">
                      <Crown className="w-3 h-3 text-black" />
                    </div>
                    <span className="text-[#00ff6a] font-bold uppercase text-sm">Nível {currentLevel}</span>
                  </div>
                  <span className="text-[#00ff6a] font-bold">•</span>
                  <span className="text-[#00ff6a] font-bold">{currentXP} XP</span>
                </div>

                {/* Barra de Progresso */}
                <div className="w-full flex items-center justify-between">
                  {/* Hexágono Esquerdo */}
                  <div className="relative flex items-center justify-center w-10 h-10">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-[#00ff6a]" fill="currentColor">
                      <path d="M12,0 L23.1,6 L23.1,18 L12,24 L0.9,18 L0.9,6 L12,0 Z" />
                    </svg>
                    <span className="absolute text-black font-bold">{currentLevel}</span>
                  </div>

                  {/* Segmentos */}
                  <div className="flex-1 mx-2 flex flex-col items-center">
                    <div className="w-full gap-1 flex justify-center">
                      {[...Array(totalSegments)].map((_, index) => (
                        <div
                          key={index}
                          className={`h-[8px] rounded-full w-[45px] ${
                            index < activeSegments
                              ? "bg-[#00ff6a]"
                              : index === activeSegments && hasHalfSegment
                                ? "bg-[#00ff6a]/50"
                                : "bg-[#333333]"
                          }`}
                        ></div>
                      ))}
                    </div>
                    {/* Texto abaixo opcional */}
                    <div className="mt-1 text-xs text-neutral-400">
                      {xpPerLevel - currentXP} XP para o nível {currentLevel + 1}
                    </div>
                  </div>

                  {/* Hexágono Direito */}
                  <div className="relative flex items-center justify-center w-10 h-10">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-[#272928]" fill="currentColor">
                      <path d="M12,0 L23.1,6 L23.1,18 L12,24 L0.9,18 L0.9,6 L12,0 Z" />
                    </svg>
                    <span className="absolute text-white font-bold">{currentLevel + 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </Anim>

          {/* 🆕 Estatísticas da Temporada */}
          <SeasonStats>
            <StatItem>
              <StatValue>{data.algorithmInfo?.statistics?.emptyTiers || 0}</StatValue>
              <StatLabel>Tiers Vazios</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{data.algorithmInfo?.statistics?.uniqueStoreItems || 0}</StatValue>
              <StatLabel>Itens Únicos</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{data.algorithmInfo?.statistics?.specialRewards || 0}</StatValue>
              <StatLabel>Especiais</StatLabel>
            </StatItem>
          </SeasonStats>
        </RightSection>
      </MainContent>

      {/* Tiers Track - Only show when tiers tab is active */}
      {selectedTab === "tiers" && (
        <TiersTrack>
          <NavigationButton onClick={() => navigateTiers("left")} disabled={currentTierIndex === 0}>
            <ChevronLeft size={24} />
          </NavigationButton>

          <TiersContainer>
            {/* Single Connecting Line for both tracks */}
            <SingleConnectingLine>
              {visibleTiers.map((tier, index) => (
                <ProgressDot
                  key={`shared-dot-${tier.tier}`}
                  isActive={tier.tier <= data.userProgress.currentTier}
                  type="shared"
                  style={{ left: `${(index * 100) / (visibleTiers.length - 1)}%` }}
                />
              ))}
            </SingleConnectingLine>

            {/* Free Track */}
            <TrackRow>
              <TrackIconContainer type="free">clubr</TrackIconContainer>

              <TiersTrackContainer>
                <TiersRow>
                  {visibleTiers.map((tier, index) => (
                    <TierHexagonContainer
                      key={tier.tier}
                      onClick={() => {
                        setSelectedTier(tier.tier)
                        setSelectedRewardType("free")
                      }}
                      className="h-[110px] w-[110px]"
                    >
                      <HexagonSVG width="80" height="80" viewBox="0 0 136 136" fill="none">
                        <g filter="url(#filter0_d_3528_6694)">
                          <HexagonPath
                            d="M64 5.3094C66.4752 3.88034 69.5248 3.88034 72 5.3094L120.292 33.1906C122.767 34.6197 124.292 37.2607 124.292 40.1188V95.8812C124.292 98.7393 122.767 101.38 120.292 102.809L72 130.691C69.5248 132.12 66.4752 132.12 64 130.691L15.7083 102.809C13.2331 101.38 11.7083 98.7393 11.7083 95.8812V40.1188C11.7083 37.2607 13.2331 34.6197 15.7083 33.1906L64 5.3094Z"
                            isPremium={false}
                            isUnlocked={tier.tier <= data.userProgress.currentTier}
                            isClaimed={data.userProgress.claimedTiers.includes(tier.tier)}
                          />
                        </g>
                        <g data-hex-emblem-stroke="true" filter="url(#filter1_d_3528_6694)">
                          <HexagonStroke
                            d="M71.75 5.74241L120.042 33.6236C122.362 34.9634 123.792 37.4393 123.792 40.1188V95.8812C123.792 98.5607 122.362 101.037 120.042 102.376L71.75 130.258C69.4295 131.597 66.5705 131.597 64.25 130.258L15.9583 102.376C13.6378 101.037 12.2083 98.5607 12.2083 95.8812V40.1188C12.2083 37.4393 13.6378 34.9634 15.9583 33.6236L64.25 5.74241C66.5705 4.40267 69.4295 4.40267 71.75 5.74241Z"
                            isPremium={false}
                            isUnlocked={tier.tier <= data.userProgress.currentTier}
                            isClaimed={data.userProgress.claimedTiers.includes(tier.tier)}
                          />
                        </g>
                        <HexagonInner
                          data-hex-emblem-inner="true"
                          d="M64.0001 27.2948C66.4753 25.8657 69.5249 25.8657 72.0001 27.2948L101.252 44.1833C103.727 45.6124 105.252 48.2534 105.252 51.1115V84.8886C105.252 87.7467 103.727 90.3878 101.252 91.8168L72.0001 108.705C69.5249 110.134 66.4753 110.134 64.0001 108.705L34.7482 91.8168C32.273 90.3878 30.7482 87.7467 30.7482 84.8886V51.1115C30.7482 48.2534 32.273 45.6124 34.7482 44.1833L64.0001 27.2948Z"
                          fillOpacity="0.18"
                          isPremium={false}
                          isUnlocked={tier.tier <= data.userProgress.currentTier}
                          isClaimed={data.userProgress.claimedTiers.includes(tier.tier)}
                        />

                        <defs>
                          <filter
                            id="filter0_d_3528_6694"
                            x="11.7085"
                            y="4.2373"
                            width="112.583"
                            height="131.525"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            ></feColorMatrix>
                            <feOffset dy="4"></feOffset>
                            <feComposite in2="hardAlpha" operator="out"></feComposite>
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                            ></feColorMatrix>
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_3528_6694"
                            ></feBlend>
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_3528_6694"
                              result="shape"
                            ></feBlend>
                          </filter>
                          <filter
                            id="filter1_d_3528_6694"
                            x="11.7085"
                            y="4.2373"
                            width="112.583"
                            height="131.525"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            ></feColorMatrix>
                            <feOffset dy="4"></feOffset>
                            <feComposite in2="hardAlpha" operator="out"></feComposite>
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                            ></feColorMatrix>
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_3528_6694"
                            ></feBlend>
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_3528_6694"
                              result="shape"
                            ></feBlend>
                          </filter>
                        </defs>
                      </HexagonSVG>
                      <HexagonLabel>NV {tier.tier}</HexagonLabel>
                      <HexagonReward>
                        {tier.isEmpty ? (
                          <EmptyTierIcon>🚫</EmptyTierIcon>
                        ) : typeof getAdvancedRewardIcon(tier.freeReward) === "string" ? (
                          <img
                            src={getAdvancedRewardIcon(tier.freeReward) || "/placeholder.svg"}
                            alt="recompensa"
                            height={50}
                            width={50}
                          />
                        ) : (
                          <IconWrapper>{getAdvancedRewardIcon(tier.freeReward)}</IconWrapper>
                        )}
                      </HexagonReward>
                      {/* {tier.uniqueRewards && <UniqueIndicator>⭐</UniqueIndicator>} */}
                      {data.userProgress.claimedTiers.includes(tier.tier) && (
                        <ClaimedOverlay>
                          <Check size={20} />
                        </ClaimedOverlay>
                      )}
                      {!tier.isUnlocked && (
                        <LockedOverlay>
                          <Lock size={16} />
                        </LockedOverlay>
                      )}
                    </TierHexagonContainer>
                  ))}
                </TiersRow>
              </TiersTrackContainer>
            </TrackRow>

            {/* Premium Track */}
            <TrackRow>
              <TrackIconContainer type="premium">PREMIUM</TrackIconContainer>
              <TiersTrackContainer>
                <TiersRow>
                  {visibleTiers.map((tier, index) => (
                    <TierHexagonContainer
                      key={tier.tier}
                      onClick={() => {
                        setSelectedTier(tier.tier)
                        setSelectedRewardType("premium")
                      }}
                      className="h-[110px] w-[110px]"
                    >
                      <HexagonSVG width="80" height="80" viewBox="0 0 136 136" fill="none">
                        <g filter="url(#filter0_d_3528_6694_premium)">
                          <HexagonPath
                            d="M64 5.3094C66.4752 3.88034 69.5248 3.88034 72 5.3094L120.292 33.1906C122.767 34.6197 124.292 37.2607 124.292 40.1188V95.8812C124.292 98.7393 122.767 101.38 120.292 102.809L72 130.691C69.5248 132.12 66.4752 132.12 64 130.691L15.7083 102.809C13.2331 101.38 11.7083 98.7393 11.7083 95.8812V40.1188C11.7083 37.2607 13.2331 34.6197 15.7083 33.1906L64 5.3094Z"
                            isPremium={true}
                            isUnlocked={tier.tier <= data.userProgress.currentTier && data.userProgress.isPremium}
                            isClaimed={data.userProgress.claimedPremiumTiers.includes(tier.tier)}
                          />
                        </g>
                        <g data-hex-emblem-stroke="true" filter="url(#filter1_d_3528_6694_premium)">
                          <HexagonStroke
                            d="M71.75 5.74241L120.042 33.6236C122.362 34.9634 123.792 37.4393 123.792 40.1188V95.8812C123.792 98.5607 122.362 101.037 120.042 102.376L71.75 130.258C69.4295 131.597 66.5705 131.597 64.25 130.258L15.9583 102.376C13.6378 101.037 12.2083 98.5607 12.2083 95.8812V40.1188C12.2083 37.4393 13.6378 34.9634 15.9583 33.6236L64.25 5.74241C66.5705 4.40267 69.4295 4.40267 71.75 5.74241Z"
                            isPremium={true}
                            isUnlocked={tier.tier <= data.userProgress.currentTier && data.userProgress.isPremium}
                            isClaimed={data.userProgress.claimedPremiumTiers.includes(tier.tier)}
                          />
                        </g>
                        <HexagonInner
                          data-hex-emblem-inner="true"
                          d="M64.0001 27.2948C66.4753 25.8657 69.5249 25.8657 72.0001 27.2948L101.252 44.1833C103.727 45.6124 105.252 48.2534 105.252 51.1115V84.8886C105.252 87.7467 103.727 90.3878 101.252 91.8168L72.0001 108.705C69.5249 110.134 66.4753 110.134 64.0001 108.705L34.7482 91.8168C32.273 90.3878 30.7482 87.7467 30.7482 84.8886V51.1115C30.7482 48.2534 32.273 45.6124 34.7482 44.1833L64.0001 27.2948Z"
                          fillOpacity="0.18"
                          isPremium={true}
                          isUnlocked={tier.tier <= data.userProgress.currentTier && data.userProgress.isPremium}
                          isClaimed={data.userProgress.claimedPremiumTiers.includes(tier.tier)}
                        />

                        <defs>
                          <filter
                            id="filter0_d_3528_6694_premium"
                            x="11.7085"
                            y="4.2373"
                            width="112.583"
                            height="131.525"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            ></feColorMatrix>
                            <feOffset dy="4"></feOffset>
                            <feComposite in2="hardAlpha" operator="out"></feComposite>
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                            ></feColorMatrix>
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_3528_6694_premium"
                            ></feBlend>
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_3528_6694_premium"
                              result="shape"
                            ></feBlend>
                          </filter>
                          <filter
                            id="filter1_d_3528_6694_premium"
                            x="11.7085"
                            y="4.2373"
                            width="112.583"
                            height="131.525"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            ></feColorMatrix>
                            <feOffset dy="4"></feOffset>
                            <feComposite in2="hardAlpha" operator="out"></feComposite>
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                            ></feColorMatrix>
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_3528_6694_premium"
                            ></feBlend>
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_3528_6694_premium"
                              result="shape"
                            ></feBlend>
                          </filter>
                        </defs>
                      </HexagonSVG>

                      <HexagonReward>
                        {tier.isEmpty ? (
                          <EmptyTierIcon>🚫</EmptyTierIcon>
                        ) : typeof getAdvancedRewardIcon(tier.premiumReward) === "string" ? (
                          <img
                            src={getAdvancedRewardIcon(tier.premiumReward) || "/placeholder.svg"}
                            alt="recompensa"
                            height={50}
                            width={50}
                          />
                        ) : (
                          <IconWrapper>{getAdvancedRewardIcon(tier.premiumReward)}</IconWrapper>
                        )}
                      </HexagonReward>
                      {/* {tier.uniqueRewards && <UniqueIndicator>⭐</UniqueIndicator>} */}
                      {data.userProgress.claimedPremiumTiers.includes(tier.tier) && (
                        <ClaimedOverlay>
                          <Check size={20} />
                        </ClaimedOverlay>
                      )}
                      {(!tier.isUnlocked || !data.userProgress.isPremium) && (
                        <LockedOverlay>
                          <Lock size={16} />
                        </LockedOverlay>
                      )}
                    </TierHexagonContainer>
                  ))}
                </TiersRow>
              </TiersTrackContainer>

              {!data.userProgress.isPremium && (
                <PremiumUpgrade>
                  <PremiumTitle>
                    <Crown size={16} />
                    Upgrade Premium Avançado +
                  </PremiumTitle>
                  <PremiumDescription>
                    Desbloqueie recompensas únicas e exclusivas com algoritmo inteligente!
                  </PremiumDescription>
                  <PremiumButton onClick={() => setShowPremiumModal(true)} disabled={loadingStates.buyPremium}>
                    {loadingStates.buyPremium ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <text>Comprando...</text>
                      </>
                    ) : (
                      <>
                        <text>Comprar Premium Avançado</text>
                        <img src="/icons/coins/gem.png" alt="bits" height={20} width={20} />
                      </>
                    )}
                  </PremiumButton>
                </PremiumUpgrade>
              )}
            </TrackRow>
          </TiersContainer>

          {/* Premium Purchase Modal */}
          <PremiumPurchaseModal
            isOpen={showPremiumModal}
            onClose={() => setShowPremiumModal(false)}
            priceInfo={data.premiumPriceInfo}
            onPurchase={handleBuyPremium}
            isLoading={loadingStates.buyPremium}
            seasonInfo={data.season}
          />

          <NavigationButton
            onClick={() => navigateTiers("right")}
            disabled={!data || currentTierIndex >= data.tiers.length - 6}
          >
            <ChevronRight size={24} />
          </NavigationButton>
        </TiersTrack>
      )}
    </Container>
  )
}

// 🆕 FUNÇÃO AUXILIAR: Formatação de recompensas avançadas
function getAdvancedRewardDisplayInfo(reward: any): any {
  const baseInfo = {
    name: "",
    description: "",
    rarity: reward?.rarity || "common",
    image: reward?.image || "",
    category: reward?.category || "",
    uniqueId: reward?.uniqueId,
    seasonExclusive: reward?.seasonExclusive,
  }

  if (!reward) return baseInfo

  switch (reward.type) {
    case "bits":
      return {
        ...baseInfo,
        icon: "💎",
        name: `${reward.amount} Bits`,
        description: "Moeda premium da plataforma",
      }

    case "coins":
      return {
        ...baseInfo,
        icon: "🪙",
        name: `${reward.amount} ORBs`,
        description: "Moeda principal da plataforma",
      }

    case "tokens":
      return {
        ...baseInfo,
        icon: "🎫",
        name: `${reward.amount} V-Tokens`,
        description: "Tokens para abrir caixas",
      }

    case "store_item":
      return {
        ...baseInfo,
        icon: "🛍️",
        name: reward.itemData?.title || "Item da Loja",
        description: reward.itemData?.description || "Item especial da loja",
      }

    case "case_item":
      return {
        ...baseInfo,
        icon: "📦",
        name: reward.itemData?.nameitem || "Item de Caixa",
        description: `Item ${reward.itemData?.rarity || "especial"} de caixa`,
      }

    case "special":
      return {
        ...baseInfo,
        icon: "⭐",
        name: reward.itemData?.name || "Recompensa Especial",
        description: reward.itemData?.description || "Recompensa única e exclusiva",
      }

    case "empty":
      return {
        ...baseInfo,
        icon: "🚫",
        name: "Tier Vazio",
        description: "Este tier foi deixado vazio pelo algoritmo inteligente",
      }

    default:
      return {
        ...baseInfo,
        icon: "🎁",
        name: "Recompensa Avançada",
        description: "Recompensa única do sistema avançado",
      }
  }
}

// Styled Components (mantidos os existentes + novos)
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #151615 0%, #1a1b1a 25%, #0f1419 50%, #111111 75%, #0a0f1c 100%);
  color: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(139, 195, 74, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(139, 195, 74, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(139, 195, 74, 0.04) 0%, transparent 70%);
    pointer-events: none;
  }
`

// 🆕 Novos Styled Components para o sistema avançado
const AlgorithmBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, rgba(139, 195, 74, 0.15) 0%, rgba(139, 195, 74, 0.05) 100%);
  border: 1px solid rgba(139, 195, 74, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
`

const AlgorithmIcon = styled.div`
  font-size: 24px;
  filter: drop-shadow(0 0 8px rgba(139, 195, 74, 0.6));
`

const AlgorithmInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const AlgorithmTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #8bc34a;
  text-transform: uppercase;
`

const AlgorithmFeatures = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.2;
`

const SeasonStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
`

const StatItem = styled.div`
  text-align: center;
  padding: 8px;
  background: rgba(139, 195, 74, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(139, 195, 74, 0.2);
`

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #8bc34a;
`

const StatLabel = styled.div`
  font-size: 8px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  margin-top: 2px;
`

const RewardBadges = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`

const UniqueBadge = styled.div`
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
  color: #000;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`

const ExclusiveBadge = styled.div`
  background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 0 10px rgba(139, 195, 74, 0.5);
`

const EmptyBadge = styled.div`
  background: linear-gradient(135deg, #666 0%, #444 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
`

const EmptyTierMessage = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.4;
  max-width: 300px;
`

const EmptyTierIcon = styled.div`
  font-size: 28px;
  opacity: 0.5;
`

const UniqueIndicator = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ffd700;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
`

const LoadingSubtext = styled.div`
  font-size: 14px;
  color: rgba(139, 195, 74, 0.7);
  margin-top: 8px;
`

// Manter todos os outros styled components existentes...
const MainContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1em 60px;
  margin: 20px 0;
  flex: 1;
`

const LeftSection = styled.div`
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 900;
  color: #8bc34a;
  line-height: 1.1;
  margin-bottom: 16px;
  text-transform: uppercase;
`

const SectionDescription = styled.p`
  color: rgba(185, 192, 185, 0.7);
  font-size: 11px;
  line-height: 1.4;
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
`

const ProgressInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;

  li{
  display: flex;
  text-align: left;
  flex-direction: column;
  }
`

const ProgressCount = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: white;
`

const ProgressLabel = styled.div`
  font-size: 10px;
  color: #8bc34a;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const TabContainer = styled.div`
  display: flex;
  gap: 12px;
`

const TabButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${(props) => (props.active ? "rgba(139, 195, 74, 0.2)" : "transparent")};
  border: 1px solid ${(props) => (props.active ? "#8bc34a" : "rgba(139, 195, 74, 0.15)")};
  color: ${(props) => (props.active ? "#8bc34a" : "rgba(255, 255, 255, 0.7)")};
  padding: 0.7em 1em;
  border-radius: 46px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'ProximaNova-Italic', sans-serif;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(139, 195, 74, 0.1);
    color: #8bc34a;
  }
`

const CenterSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: 100%;
  overflow: hidden;
`

const FeaturedReward = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 450px;
  align-items: center;
  text-align: center;
  gap: 20px;
`

const RewardImage = styled.div`
  font-size: 120px;
  filter: drop-shadow(0 0 20px rgba(139, 195, 74, 0.6));
`

const RewardName = styled.h3`
  font-size: 24px;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const ClaimRewardButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);
  border: none;
  color: white;
  padding: 0.8em 1em;
  border-radius: 22px;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.3s ease;
  text-transform: uppercase;
  position: relative;

  h3 {
    font-family: 'Europa Grotesk';
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(139, 195, 74, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const CrownCount = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 14px;
  font-weight: 800;
`

const RightSection = styled.div`
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-end;
  text-align: right;

  .uasdsc{
    height: 34px;
    width: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #9ac56857 0%, #11131032 100%);
    display: flex;
    align-items: center;
    justify-content: center;


  
  }

 
`

const Anim = styled.div`
  margin-bottom: 1em;
`

const ExpirationInfo = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  font-family: 'XcSemibold';
  margin-bottom: 16px;
`

const ExpirationTime = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #ff6b6b;
  margin-top: 4px;
`

const QuickStatValue = styled.div<{ premium?: boolean }>`
  font-size: 58px;
  font-weight: 200;
  font-size-adjust: 2;
  text-size-adjust: 12;
  position: absolute;
  border-radius: 18px;
  transform: rotate(-20deg);
  color: ${(props) => (props.premium ? "rgba(11, 245, 81, 0.164)" : "rgba(255, 255, 255, 0.178)")};
  font-family: 'Graffiti', sans-serif;
`

const PremiumUpgrade = styled.div`
  padding: 16px;
  background: linear-gradient(to bottom, transparent 0%, rgba(20, 22, 20, 0.863) 100%);
  z-index: 12;
  border-radius: 12px;
  position: absolute; 
  text-align: center;
  width: 100%;
`

const PremiumTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #2ec253;
  font-family: 'Europa Grotesk';
  margin: 0 0 8px 0;
`

const PremiumDescription = styled.p`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 12px 0;
  font-family: 'Inter', monospace;
`

const PremiumButton = styled.button`
  background: linear-gradient(135deg, rgba(45, 201, 110, 0.658) 0%, rgba(26, 29, 26, 0.719) 100%);
  color: #bdccc0;
  padding: 10px 16px;
  border-radius: 36px;
  font-size: 12px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'XcSemibold', monospace;
  font-weight: bold;
  cursor: var(--f-cursor-pointer);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const TiersTrack = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;
  gap: 40px;
  position: absolute;
  bottom: 1%;
  left: 0;
  right: 0;
`

const NavigationButton = styled.button<{ disabled: boolean }>`
  background: rgba(139, 195, 74, 0.15);
  border: 2px solid ${(props) => (props.disabled ? "rgba(139, 195, 74, 0.3)" : "#8bc34a")};
  color: ${(props) => (props.disabled ? "rgba(139, 195, 74, 0.5)" : "#8bc34a")};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: rgba(139, 195, 74, 0.25);
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(139, 195, 74, 0.3);
  }
`

const TiersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  flex: 1;
  max-width: 60vw;
  position: relative;
  padding: 20px 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at center, rgba(139, 195, 74, 0.05) 0%, transparent 70%);
    border-radius: 20px;
    pointer-events: none;
  }
`

const TrackRow = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`

const TrackIconContainer = styled.div<{ type: "free" | "premium" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-family: 'Europa Grotesk';
  color: ${(props) => (props.type === "free" ? "rgba(187, 199, 193, 0.4)" : "rgba(58, 206, 115, 0.4)")};
  writing-mode: vertical-lr;
  text-orientation: sideways;
`

const TiersTrackContainer = styled.div`
  position: relative;
  flex: 1;
`

const ProgressDot = styled.div<{ isActive: boolean; type: "free" | "premium" | "shared" }>`
  position: absolute;
  top: 50%;
  transform: translate(-0%, -50%) scale(1.2);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => {
    if (props.type === "shared") {
      return props.isActive ? "linear-gradient(135deg, #00d440 0%, #8bc34a 100%)" : "rgba(255, 255, 255, 0.2)"
    }
    if (props.isActive) {
      return props.type === "free" ? "rgb(135, 145, 139)" : "#00d440"
    }
    return "rgba(255, 255, 255, 0.3)"
  }};
  border: 3px solid ${(props) => {
    if (props.type === "shared") {
      return props.isActive ? "#ffffff" : "rgba(255, 255, 255, 0.4)"
    }
    if (props.isActive) {
      return props.type === "free" ? "#5d6160" : "#00d45f"
    }
    return "rgba(255, 255, 255, 0.5)"
  }};
  box-shadow: ${(props) => {
    if (props.type === "shared" && props.isActive) {
      return "0 0 12px rgba(0, 212, 64, 0.8), 0 0 24px rgba(139, 195, 74, 0.4)"
    }
    return props.isActive
      ? `0 0 8px ${props.type === "free" ? "rgba(99, 102, 101, 0.6)" : "rgba(0, 212, 71, 0.6)"}`
      : "none"
  }};
  z-index: 2;
  transition: all 0.3s ease;
`

const TiersRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 3;
`

const TierHexagonContainer = styled.div`
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`

const HexagonSVG = styled.svg`
  width: 100%;
  height: 100%;
`

const HexagonPath = styled.path<{ isPremium: boolean; isUnlocked: boolean; isClaimed?: boolean }>`
  fill: ${(props) => {
    if (props.isClaimed) return "rgb(35, 37, 36)"
    if (!props.isUnlocked) return "#1a1a1a"
    return props.isPremium ? "#1a2e21" : "#18241c"
  }};
  transition: fill 200ms;
`

const HexagonStroke = styled.path<{ isPremium: boolean; isUnlocked: boolean; isClaimed?: boolean }>`
  stroke: ${(props) => {
    if (props.isClaimed) return "#3d3f3e"
    if (!props.isUnlocked) return "#333"
    return props.isPremium ? "#00d440" : "#3d413e"
  }};
  stroke-width: 1.5;
  fill: none;
`

const HexagonInner = styled.path<{ isPremium: boolean; isUnlocked: boolean; isClaimed?: boolean }>`
  fill: ${(props) => {
    if (props.isClaimed) return "#2e5c3e"
    if (!props.isUnlocked) return "#151515"
    return props.isPremium ? "#0d1a1a" : "#181d1a"
  }};
  transition: fill 200ms;
`

const HexagonLabel = styled.div`
  position: absolute;
  top: -25px;
  font-size: 12px;
  font-weight: 700;
  transform: translate(66%, -0%);
  color: #484946;
  text-transform: uppercase;
  text-shadow: 0 0 5px rgba(41, 44, 42, 0.8);
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 8px;
  border-radius: 10px;
  border: 2px solid #393b3a;
`

const HexagonReward = styled.div`
  font-size: 28px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`

const IconWrapper = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ClaimedOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(76, 175, 80, 0.95);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.8);
`

const LockedOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.3);
`

const BottomCardsSection = styled.section``

const ScrollContainer = styled.div`
  position: relative;
  overflow: hidden;
`

const CardsContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;

  /* Custom scrollbar to match the image */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(139, 195, 74, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #8bc34a 0%, #689f38 100%);
    border-radius: 4px;
    border: 1px solid rgba(139, 195, 74, 0.3);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(90deg, #689f38 0%, #558b2f 100%);
  }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
`

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(139, 195, 74, 0.3);
  border-top: 3px solid #8bc34a;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const LoadingText = styled.div`
  font-size: 18px;
  color: #8bc34a;
  font-weight: 600;
`

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

const ErrorText = styled.div`
  font-size: 18px;
  color: #ef4444;
  font-weight: 600;
`

const SingleConnectingLine = styled.div`
  position: absolute;
  top: 50%;
  left: 4.4vw;
  right: 3.9vw;
  height: 6px;
  background: #1a1b1b; 
  border-radius: 3px;
  transform: translateY(-50%);
  z-index: 1;
`
