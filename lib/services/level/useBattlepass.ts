"use client"

import { useFetch } from "@/hooks/useFetch.nvxre"
import axios from "axios"

export interface AdvancedBattlePassData {
  season: any
  userProgress: {
    userId: string
    seasonId: string
    currentTier: number
    currentXP: number
    totalXP: number
    isPremium: boolean
    claimedTiers: number[]
    claimedPremiumTiers: number[]
    lastActivity: Date
    algorithmVersion: string
    uniqueRewardsReceived: string[]
    dailyMissions: any[]
    weeklyMissions: any[]
  }
  tiers: {
    tier: number
    xpRequired: number
    freeReward?: any
    premiumReward?: any
    isUnlocked: boolean // 🆕 Agora baseado no tier atual
    isClaimed: boolean
    isPremiumClaimed: boolean
    isEmpty: boolean
    uniqueRewards: boolean
  }[]
  timeRemaining: number
  seasonCreated: boolean
  seasonMessage: string
  premiumPriceInfo: {
    currentPrice: number
    userBits: number
    canAfford: boolean
    missingBits: number
    priceInReais: string
    discountPercentage?: number
    originalPrice?: number
  }
  algorithmInfo: {
    version: string
    statistics: {
      emptyTiers: number
      uniqueStoreItems: number
      uniqueCaseItems: number
      specialRewards: number
      algorithmSeed: string
    }
    uniqueItemsGuarantee: boolean
    emptyTiersIncluded: boolean
  }
  seasonStats: {
    totalPlayers: number
    premiumPlayers: number
    averageTier: number
    totalXP: number
    maxTier: number
  }
  hasContractMiss: boolean
  missionStats: {
    totalDaily: number
    totalWeekly: number
    categoriesDaily: string[]
    categoriesWeekly: string[]
  }
  clubActivity: {
    clubActivity: number
    xpFromActivity: number
    levelFromActivity: number
    lastUpdated: Date | null
  }
  activitySync: {
    success: boolean
    xpAdded: number
    newTier: number
    activityUsed: number
  }
}

async function fetchAdvancedBattlePass(): Promise<AdvancedBattlePassData> {
  const { data } = await axios.get("/api/battlepass/battlepass")
  return data.data
}

export function useBattlePassAdvanced() {
  const { data, error, isLoading, mutate, isValidating, hasError } = useFetch<AdvancedBattlePassData>(
    "/api/battlepass-advanced",
    fetchAdvancedBattlePass,
  )

  // 🎯 RESGATAR RECOMPENSA AVANÇADA
  const claimReward = async (tier: number, isPremium = false) => {
    try {
      const response = await axios.post("/api/battlepass/battlepass", {
        action: "claim_advanced_reward", // 🆕 Ação correta para sistema avançado
        data: { tier, isPremium },
      })
      await mutate()
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao resgatar recompensa avançada")
    }
  }

  // 🚀 COMPRAR PREMIUM AVANÇADO
  const buyPremium = async () => {
    try {
      const response = await axios.post("/api/battlepass/battlepass", {
        action: "buy_premium",
      })
      await mutate()
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao comprar premium avançado")
    }
  }

  // 🎯 COMPLETAR MISSÃO AVANÇADA
  const completeMission = async (missionId: string) => {
    try {
      const response = await axios.post("/api/battlepass/battlepass", {
        action: "complete_mission",
        data: { missionId },
      })
      await mutate()
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao completar missão avançada")
    }
  }

  // 🔄 ADICIONAR XP MANUALMENTE
  const addXP = async (amount: number, source: string) => {
    try {
      const response = await axios.post("/api/battlepass/battlepass", {
        action: "add_xp",
        data: { amount, source },
      })
      await mutate()
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao adicionar XP")
    }
  }

  // 📊 OBTER ESTATÍSTICAS DA TEMPORADA
  const getSeasonStatistics = async () => {
    try {
      const response = await axios.post("/api/battlepass/battlepass", {
        action: "get_season_statistics",
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao obter estatísticas")
    }
  }

  // 🏆 SINCRONIZAR ATIVIDADE DO CLUB
  const syncClubActivity = async () => {
    try {
      const response = await axios.post("/api/battlepass/battlepass", {
        action: "sync_club_activity",
      })
      await mutate()
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao sincronizar atividade do club")
    }
  }

  // 🔍 PREVIEW DE CONVERSÃO DE ATIVIDADE
  const getActivityPreview = async (clubActivity: number) => {
    try {
      const response = await axios.post("/api/battlepass/battlepass", {
        action: "get_activity_preview",
        data: { clubActivity },
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao obter preview de atividade")
    }
  }

  // 📈 ESTATÍSTICAS DE ATIVIDADE DO CLUB
  const getClubActivityStats = async () => {
    try {
      const response = await axios.post("/api/battlepass/battlepass", {
        action: "get_club_activity_stats",
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao obter estatísticas de atividade")
    }
  }

  // 💰 OBTER PREÇO DO PREMIUM
  const getPremiumPrice = async () => {
    try {
      const response = await axios.post("/api/battlepass/battlepass", {
        action: "get_premium_price",
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao obter preço do premium")
    }
  }

  // 🔄 VERIFICAR TEMPORADA AVANÇADA
  const checkSeason = async () => {
    try {
      const response = await axios.get("/api/battlepass/season-check") // 🆕 URL correta
      await mutate()
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao verificar temporada avançada")
    }
  }

  // 🎮 SINCRONIZAR XP (compatibilidade com sistema antigo)
  const syncXP = async (action: string, userId: string, metadata?: Record<string, any>) => {
    try {
      const response = await axios.post("/api/battlepass/sync-xp", {
        // 🆕 URL correta
        action,
        userId,
        metadata,
      })
      await mutate()
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao sincronizar XP")
    }
  }

  // 🎯 FUNÇÕES AUXILIARES PARA VERIFICAÇÃO DE ESTADO
  const canClaimTier = (tier: number): boolean => {
    if (!data) return false

    // Verificar se o tier está desbloqueado (usuário alcançou este tier)
    const tierData = data.tiers.find((t) => t.tier === tier)
    return tierData?.isUnlocked || false
  }

  const canClaimPremiumTier = (tier: number): boolean => {
    if (!data) return false

    // Verificar se tem premium E se o tier está desbloqueado
    return data.userProgress.isPremium && canClaimTier(tier)
  }

  const isRewardClaimed = (tier: number, isPremium = false): boolean => {
    if (!data) return false

    if (isPremium) {
      return data.userProgress.claimedPremiumTiers.includes(tier)
    } else {
      return data.userProgress.claimedTiers.includes(tier)
    }
  }

  const getUnlockedTiers = (): number[] => {
    if (!data) return []

    return data.tiers.filter((tier) => tier.isUnlocked).map((tier) => tier.tier)
  }

  const getLockedTiers = (): number[] => {
    if (!data) return []

    return data.tiers.filter((tier) => !tier.isUnlocked).map((tier) => tier.tier)
  }

  // 📊 ESTATÍSTICAS CALCULADAS
  const stats = data
    ? {
        currentTier: data.userProgress.currentTier,
        maxTier: Math.max(...data.tiers.map((t) => t.tier)),
        unlockedTiers: getUnlockedTiers().length,
        lockedTiers: getLockedTiers().length,
        claimedRewards: data.userProgress.claimedTiers.length + data.userProgress.claimedPremiumTiers.length,
        totalRewards: data.tiers.filter((t) => !t.isEmpty).length * 2, // free + premium
        progressPercentage: (data.userProgress.currentTier / Math.max(...data.tiers.map((t) => t.tier))) * 100,
        isPremium: data.userProgress.isPremium,
        hasContractMiss: data.hasContractMiss,
        clubActivityXP: data.clubActivity.xpFromActivity,
        algorithmVersion: data.algorithmInfo.version,
      }
    : null

  return {
    // Dados principais
    data,
    error,
    isLoading,
    isValidating,
    hasError,
    mutate,

    // Ações principais
    claimReward,
    buyPremium,
    completeMission,
    addXP,

    // Ações avançadas
    syncClubActivity,
    getActivityPreview,
    getClubActivityStats,
    getPremiumPrice,
    getSeasonStatistics,

    // Compatibilidade
    checkSeason,
    syncXP,

    // Funções auxiliares
    canClaimTier,
    canClaimPremiumTier,
    isRewardClaimed,
    getUnlockedTiers,
    getLockedTiers,

    // Estatísticas calculadas
    stats,
  }
}

// 🔄 HOOK DE COMPATIBILIDADE (para não quebrar código existente)
export function useBattlePass() {
  console.warn("⚠️ useBattlePass está deprecated. Use useBattlePassAdvanced() para o sistema avançado.")
  return useBattlePassAdvanced()
}
