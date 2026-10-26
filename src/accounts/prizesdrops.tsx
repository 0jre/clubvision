"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { useRouter } from "next/router"
import { Clock, Gift, Target, Trophy, Zap, RefreshCw } from "lucide-react"
import LoadingPageView from "@/resources/loading/market.loading"
import ROUTENVX from "@/routes/routes"

interface PrizeItem {
  id: string
  tier: number
  type: "free" | "premium"
  reward: {
    type: string
    amount?: number
    itemData?: any
    uniqueId?: string
    seasonExclusive?: boolean
    image?: string
    rarity?: string
  }
  isClaimable: boolean
  claimedAt?: Date
  expiresAt?: Date
}

interface DropItem {
  id: string
  type: "daily" | "weekly" | "special"
  title: string
  description: string
  reward: {
    xp?: number
    bits?: number
    coins?: number
    tokens?: number
  }
  isCompleted: boolean
  completedAt?: Date
  expiresAt: Date
  progress?: {
    current: number
    required: number
  }
}

export interface PrizesDropsData {
  prizes: PrizeItem[]
  drops: DropItem[]
  summary: {
    totalPrizes: number
    claimablePrizes: number
    totalDrops: number
    completedDrops: number
    expiringSoon: number
  }
  userProgress: {
    currentTier: number
    totalXP: number
    isPremium: boolean
  }
}

export default function PrizesAndDrops() {
  const [activeTab, setActiveTab] = useState("overview")
  const [data, setData] = useState<PrizesDropsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)
  const router = useRouter()

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/club/prizes-drops")
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        console.error("Erro ao carregar dados:", result.message)
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
    } finally {
      setLoading(false)
    }
  }

  const claimPrize = async (prizeId: string) => {
    try {
      setClaiming(prizeId)
      const response = await fetch("/api/club/prizes-drops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "claim_prize",
          data: { prizeId },
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Atualizar dados após resgate
        await fetchData()
        // Mostrar notificação de sucesso (implementar toast)
        console.log("Prêmio resgatado:", result.message)
      } else {
        console.error("Erro ao resgatar:", result.message)
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
    } finally {
      setClaiming(null)
    }
  }

  const formatTimeRemaining = (expiresAt: Date | string) => {
    const now = new Date()
    const expires = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt
    const diff = expires.getTime() - now.getTime()

    if (diff <= 0) return "Expirado"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  const getRewardIcon = (reward: any) => {
    switch (reward.type) {
      case "bits":
        return <img src="/icons/coins/gem.png" alt="Bits" width={90} height={90} />
      case "coins":
        return  <img src="/icons/coins/orb-novision.webp" alt="Orbits" width={90} height={90} />  
      case "tokens":
        return <img src="/icons/market/sadasjdub.webp" alt="V-Token" width={90} height={90} />
      case "store_item":
        return <img src="/icons/market/asdnuasid.webp" alt="TVL" width={100} height={50} /> 
      case "case_item":  
        return <img src="/icons/delivery-box.png" alt="Token Item" width={90} height={90} />
      default:
        return <img src="/icons/gift.png" alt="Token Item" width={90} height={90} /> 
    }
  }

  const getRewardName = (reward: any) => {
    switch (reward.type) {
      case "bits":
        return `${reward.amount} Bits`
      case "coins":
        return `${reward.amount} ORBs`
      case "tokens":
        return `${reward.amount} V-Tokens`
      case "store_item":
        return reward.itemData?.title || "Item da Loja"
      case "case_item":
        return reward.itemData?.nameitem || "Item de Caixa"
      default:
        return "Recompensa Especial"
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <Container>
         <LoadingPageView />
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Prêmios & Drops</HeaderTitle>
   
      </Header>

      <TabList>
        <Tab active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
          VISÃO GERAL
        </Tab>
        <Tab active={activeTab === "prizes"} onClick={() => setActiveTab("prizes")}>
          PRÊMIOS ({data?.summary.claimablePrizes || 0})
        </Tab>
        <Tab active={activeTab === "drops"} onClick={() => setActiveTab("drops")}>
          DROPS ({data?.summary.totalDrops || 0})
        </Tab>
      </TabList>

      {activeTab === "overview" && (
        <>
          

          <Section>
            <SectionHeader>
              <SectionTitle>Prêmios Disponíveis</SectionTitle>
              <ViewAllLink onClick={() => setActiveTab("prizes")}>VER TUDO</ViewAllLink>
            </SectionHeader>

            {data?.prizes.length ? (
              <PrizesGrid>
                {data.prizes.slice(0, 6).map((prize) => (
                  <PrizeCard key={prize.id}>
                    <PrizeIcon>{getRewardIcon(prize.reward)}</PrizeIcon>
                     <li className="flex flex-col items-start w-full ">
 <PrizeName>{getRewardName(prize.reward)}</PrizeName>
                    <PrizeTier>Tier {prize.tier}</PrizeTier>
                    {prize.type === "premium" && <PremiumBadge>PREMIUM</PremiumBadge>}
                    <PrizeExpiry>Expira em {formatTimeRemaining(new Date(prize.expiresAt!))}</PrizeExpiry>
                    <ClaimButton onClick={() => claimPrize(prize.id)} disabled={claiming === prize.id}>
                      {claiming === prize.id ? "Resgatando..." : "Resgatar"}
                    </ClaimButton>
                     </li>
                  </PrizeCard>
                ))}
              </PrizesGrid>
            ) : (
              <EmptyState>
                <EmptyIcon>
                  <Gift size={48} />
                </EmptyIcon>
                <EmptyText>Você não tem nenhum prêmio para resgatar.</EmptyText>
              </EmptyState>
            )}
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>Drops Ativos</SectionTitle>
              <ViewAllLink onClick={() => setActiveTab("drops")}>VER TUDO</ViewAllLink>
            </SectionHeader>

            {data?.drops.length ? (
              <DropsGrid>
                {data.drops.slice(0, 4).map((drop) => (
                  <DropCard key={drop.id} completed={drop.isCompleted}>
                    <DropHeader>
                      <DropType type={drop.type}>{drop.type.toUpperCase()}</DropType>
                      <DropExpiry>Expira em {formatTimeRemaining(drop.expiresAt)}</DropExpiry>
                    </DropHeader>
                    <DropTitle>{drop.title}</DropTitle>
                    <DropDescription>{drop.description}</DropDescription>
                    {drop.progress && (
                      <ProgressBar>
                        <ProgressFill style={{ width: `${(drop.progress.current / drop.progress.required) * 100}%` }} />
                        <ProgressText>
                          {drop.progress.current}/{drop.progress.required}
                        </ProgressText>
                      </ProgressBar>
                    )}
                    <DropRewards>
                      {drop.reward.xp && <RewardItem>+{drop.reward.xp} XP</RewardItem>}
                      {drop.reward.bits && <RewardItem>+{drop.reward.bits} Bits</RewardItem>}
                      {drop.reward.coins && <RewardItem>+{drop.reward.coins} ORBs</RewardItem>}
                      {drop.reward.tokens && <RewardItem>+{drop.reward.tokens} Tokens</RewardItem>}
                    </DropRewards>
                  </DropCard>
                ))}
              </DropsGrid>
            ) : (
              <EmptyState>
                <EmptyIcon>
                  <Target size={48} />
                </EmptyIcon>
                <EmptyText>Você não tem nenhum drop ativo.</EmptyText>
              </EmptyState>
            )}
          </Section>
        </>
      )}

      {activeTab === "prizes" && (
        <Section>
          {data?.prizes.length ? (
            <PrizesGrid>
              {data.prizes.map((prize) => (
                <PrizeCard key={prize.id}>
                  <PrizeIcon>{getRewardIcon(prize.reward)}</PrizeIcon>
                  <li className="flex flex-col items-start  w-full">
                      <PrizeName>{getRewardName(prize.reward)}</PrizeName>
                  <PrizeTier>Tier {prize.tier}</PrizeTier>
                  {prize.type === "premium" && <PremiumBadge>PREMIUM</PremiumBadge>}
                  {prize.reward.seasonExclusive && <ExclusiveBadge>EXCLUSIVO</ExclusiveBadge>}
                  <PrizeExpiry>Expira em {formatTimeRemaining(new Date(prize.expiresAt!))}</PrizeExpiry>
                  <ClaimButton onClick={() => claimPrize(prize.id)} disabled={claiming === prize.id}>
                    {claiming === prize.id ? "Resgatando..." : "Resgatar"}
                  </ClaimButton>
                  </li>
                </PrizeCard>
              ))}
            </PrizesGrid>
          ) : (
            <EmptyState>
              <EmptyIcon>
                <Gift size={48} />
              </EmptyIcon>
              <EmptyText>Você não tem nenhum prêmio para resgatar.</EmptyText>
            </EmptyState>
          )}
        </Section>
      )}

      {activeTab === "drops" && (
        <Section>
          {data?.drops.length ? (
            <DropsGrid>
              {data.drops.map((drop) => (
                <DropCard key={drop.id} completed={drop.isCompleted}>
                  <DropHeader>
                    <DropType type={drop.type}>{drop.type.toUpperCase()}</DropType>
                    <DropExpiry>Expira em {formatTimeRemaining(drop.expiresAt)}</DropExpiry>
                  </DropHeader>
                  <DropTitle>{drop.title}</DropTitle>
                  <DropDescription>{drop.description}</DropDescription>
                  {drop.progress && (
                    <ProgressBar>
                      <ProgressFill style={{ width: `${(drop.progress.current / drop.progress.required) * 100}%` }} />
                      <ProgressText>
                        {drop.progress.current}/{drop.progress.required}
                      </ProgressText>
                    </ProgressBar>
                  )}
                  <DropRewards>
                    {drop.reward.xp && <RewardItem>+{drop.reward.xp} XP</RewardItem>}
                    {drop.reward.bits && <RewardItem>+{drop.reward.bits} Bits</RewardItem>}
                    {drop.reward.coins && <RewardItem>+{drop.reward.coins} ORBs</RewardItem>}
                    {drop.reward.tokens && <RewardItem>+{drop.reward.tokens} Tokens</RewardItem>}
                  </DropRewards>
                  {drop.isCompleted && <CompletedBadge>✓ COMPLETADO</CompletedBadge>}
                </DropCard>
              ))}
            </DropsGrid>
          ) : (
            <EmptyState>
              <EmptyIcon>
                <Target size={48} />
              </EmptyIcon>
              <EmptyText>Você não tem nenhum drop ativo.</EmptyText>
            </EmptyState>
          )}
        </Section>
      )}

      <Footer>
        Saiba mais sobre os drops no <a href={ROUTENVX.vpass}>Battlepass</a>
      </Footer>
    </Container>
  )
}

// Styled Components
const Container = styled.div`
  color: #ffffff;
  padding: 24px;
 
  font-family: 'InterSemiBold', monospace;
   
 
  
   @media screen and (max-width: 680px) {
      padding: 0;
    } 
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const HeaderTitle = styled.h1`
    font-size: 28px;
  font-weight: 600;
  margin: 0;
  font-family: 'Inter', sans-serif;
  color: #e9ecea14;

  @media screen and (max-width: 680px) {
    font-size: 24px;
    margin: 16px;
  }
`

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(63, 197, 97, 0.1);
  border: 1px solid #3fc561;
  color: #3fc561;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(63, 197, 97, 0.2);
  }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 16px;
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(63, 197, 97, 0.3);
  border-top: 3px solid #3fc561;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const LoadingText = styled.div`
  color: #3fc561;
  font-size: 16px;
`

const TabList = styled.div`
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #333;
  margin-bottom: 24px;
`

const Tab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.active ? "#3fc561" : "#666")};
  font-size: 14px;
  padding: 8px 0;
  position: relative;
  font-family: 'InterSemiBold', monospace;
   
 
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${(props) => (props.active ? "#3fc561" : "transparent")};
  }
  
  &:hover {
    color: ${(props) => (props.active ? "#3fc561" : "#999")};
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`

const StatCard = styled.div`
  background: rgba(63, 197, 97, 0.1);
  border: 1px solid rgba(63, 197, 97, 0.3);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`

const StatIcon = styled.div`
  color: #3fc561;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
`

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: white;
  margin-bottom: 4px;
`

const StatLabel = styled.div`
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
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
  font-family: 'Inter', monospace;
`

const ViewAllLink = styled.button`
  color: #3fc561;
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`

const PrizesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`

const PrizeCard = styled.div`
  background: #2e302f2b;
  border-radius: 12px;
  padding: 0.5em 1em 0.5em;
  text-align: center;
   
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;


  
`

const PrizeIcon = styled.div`
  font-size: 48px;
 
`

const PrizeName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
`

const PrizeTier = styled.div`
  font-size: 12px;
  color: #3fc561;
  margin-bottom: 8px;
`

const PremiumBadge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
  color: #000;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  margin-bottom: 8px;
`

const ExclusiveBadge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #3fc561 0%, #2a8f47 100%);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  margin-bottom: 8px;
  margin-left: 4px;
`

const PrizeExpiry = styled.div`
  font-size: 11px;
  color: #999;
  margin-bottom: 12px;
`

const ClaimButton = styled.button`
  background: linear-gradient(135deg, #3fc561 0%, #2a8f47 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(63, 197, 97, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const DropsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`

const DropCard = styled.div<{ completed?: boolean }>`
  background: #2e302f2b;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid ${(props) => (props.completed ? "rgba(63, 197, 97, 0.5)" : "rgba(63, 197, 97, 0.2)")};
  opacity: ${(props) => (props.completed ? 0.7 : 1)};
  position: relative;
`

const DropHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

const DropType = styled.div<{ type: string }>`
  background: ${(props) => {
    switch (props.type) {
      case "daily":
        return "rgba(255, 193, 7, 0.2)"
      case "weekly":
        return "rgba(156, 39, 176, 0.2)"
      default:
        return "rgba(63, 197, 97, 0.2)"
    }
  }};
  color: ${(props) => {
    switch (props.type) {
      case "daily":
        return "#ffc107"
      case "weekly":
        return "#9c27b0"
      default:
        return "#3fc561"
    }
  }};
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
`

const DropExpiry = styled.div`
  font-size: 10px;
  color: #999;
`

const DropTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
`

const DropDescription = styled.div`
  font-size: 14px;
  color: #ccc;
  margin-bottom: 12px;
  line-height: 1.4;
`

const ProgressBar = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  height: 8px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
`

const ProgressFill = styled.div`
  background: linear-gradient(90deg, #3fc561 0%, #2a8f47 100%);
  height: 100%;
  border-radius: 8px;
  transition: width 0.3s ease;
`

const ProgressText = styled.div`
  position: absolute;
  top: -20px;
  right: 0;
  font-size: 10px;
  color: #3fc561;
  font-weight: 600;
`

const DropRewards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const RewardItem = styled.div`
  background: rgba(63, 197, 97, 0.1);
  color: #3fc561;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
`

const CompletedBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(63, 197, 97, 0.2);
  color: #3fc561;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
`

const EmptyState = styled.div`
  background-color: #2e302f2b;
  border-radius: 12px;
  padding: 48px;
  text-align: center;
`

const EmptyIcon = styled.div`
  color: #666;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
`

const EmptyText = styled.p`
  color: #999;
  margin-bottom: 14px;
  font-family: 'Inter', monospace;
`

const Footer = styled.p`
  color: #666;
  font-size: 14px;
  margin-top: 2em;
  text-align: center;
  
  a {
    color: #3fc561;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`
