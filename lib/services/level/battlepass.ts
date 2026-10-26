export interface BattlePassReward {
  type: "bits" | "coins" | "tokens" | "store_item" | "case_item" | "special" | "empty"
  amount?: number
  itemId?: number | string
  itemData?: any
  rarity: "common" | "rare" | "epic" | "legendary"
  category?: "store" | "case" | "currency" | "empty"
  image?: string
  uniqueId?: string // Para rastreamento de itens únicos
  seasonExclusive?: boolean
}

export interface SeasonItemPool {
  seasonId: string
  usedStoreItems: Set<string>
  usedCaseItems: Set<number>
  availableStoreItems: any[]
  availableCaseItems: any[]
  tierDistribution: TierDistribution
  algorithmSeed: string
}

export interface TierDistribution {
  emptyTiers: number[]
  currencyTiers: number[]
  storeItemTiers: number[]
  caseItemTiers: number[]
  specialTiers: number[]
}

export interface AlgorithmConfig {
  emptyTierChance: number // Chance de tier vazio
  premiumAdvantage: number // Vantagem do premium
  rarityWeights: Record<string, number>
  tierTypeWeights: Record<number, TierTypeWeight>
}

export interface TierTypeWeight {
  empty: number
  currency: number
  storeItem: number
  caseItem: number
  special: number
}

// 🆕 TIPOS DE MISSÕES
export interface Mission {
  id: string
  type: "daily" | "weekly" | "seasonal"
  title: string
  description: string
  requirement: {
    action: string
    target: number
    current: number
  }
  reward: {
    xp: number
    bits?: number
    coins?: number
    tokens?: number
  }
  isCompleted: boolean
  expiresAt: Date
  category: string
}

export interface MissionTemplate {
  action: string
  title: string
  description: string
  baseTarget: number
  xpReward: number
  category: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  requirement: any
  reward: BattlePassReward
  isUnlocked: boolean
  unlockedAt?: Date
}

export interface UserBattlePassAdvanced {
  userId: string
  seasonId: string
  currentTier: number
  currentXP: number
  totalXP: number
  isPremium: boolean
  claimedTiers: number[]
  claimedPremiumTiers: number[]
  lastActivity: Date
  weeklyMissions: Mission[]
  dailyMissions: Mission[]
  achievements: Achievement[]
  algorithmVersion: string
  uniqueRewardsReceived: string[]
}

export interface PremiumPriceInfo {
  currentPrice: number
  userBits: number
  canAfford: boolean
  missingBits: number
  priceInReais: string
  discountPercentage?: number
  originalPrice?: number
}
