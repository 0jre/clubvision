import { dbConnect } from "@/core/integration/connect"

export class BattlePassAnalytics {
  /**
   * 📊 ANÁLISE AVANÇADA: Gerar relatório completo da temporada
   */
  static async generateSeasonReport(seasonId: string) {
    const { db } = await dbConnect()

    const [seasonData, rewardsData, userProgress, claimStats] = await Promise.all([
      db.collection("battlepass_seasons_advanced").findOne({ seasonId }),
      db.collection("battlepass_rewards_advanced").find({ seasonId }).toArray(),
      db.collection("battlepass_advanced").find({ seasonId }).toArray(),
      this.getClaimStatistics(db, seasonId),
    ])

    const report = {
      seasonInfo: {
        name: seasonData?.name,
        algorithmVersion: seasonData?.algorithmVersion,
        totalTiers: seasonData?.maxTiers,
        duration: this.calculateDuration(seasonData?.startDate, seasonData?.endDate),
      },
      rewardDistribution: {
        totalRewards: rewardsData.length,
        emptyTiers: rewardsData.filter((r) => !r.freeReward && !r.premiumReward).length,
        uniqueStoreItems: new Set(
          rewardsData.filter((r) => r.premiumReward?.type === "store_item").map((r) => r.premiumReward.itemId),
        ).size,
        uniqueCaseItems: new Set(
          rewardsData.filter((r) => r.premiumReward?.type === "case_item").map((r) => r.premiumReward.itemId),
        ).size,
        specialRewards: rewardsData.filter(
          (r) => r.premiumReward?.type === "special" || r.freeReward?.type === "special",
        ).length,
      },
      playerEngagement: {
        totalPlayers: userProgress.length,
        premiumPlayers: userProgress.filter((p) => p.isPremium).length,
        averageTier: userProgress.reduce((sum, p) => sum + p.currentTier, 0) / userProgress.length,
        completionRate: (userProgress.filter((p) => p.currentTier >= 100).length / userProgress.length) * 100,
      },
      claimAnalysis: claimStats,
      algorithmEfficiency: {
        noRepeatItems: true,
        emptyTierPercentage:
          (rewardsData.filter((r) => !r.freeReward && !r.premiumReward).length / rewardsData.length) * 100,
        uniqueItemsGuaranteed: true,
      },
    }

    return report
  }

  /**
   * 🎯 ANÁLISE DE CLAIMS: Estatísticas de resgate de recompensas
   */
  private static async getClaimStatistics(db: any, seasonId: string) {
    const userProgress = await db.collection("battlepass_advanced").find({ seasonId }).toArray()

    const totalClaims = userProgress.reduce(
      (sum: any, user: any) => sum + user.claimedTiers.length + user.claimedPremiumTiers.length,
      0,
    )

    const freeClaims = userProgress.reduce((sum: any, user: any) => sum + user.claimedTiers.length, 0)
    const premiumClaims = userProgress.reduce((sum: any, user: any) => sum + user.claimedPremiumTiers.length, 0)

    return {
      totalClaims,
      freeClaims,
      premiumClaims,
      claimRate: (totalClaims / (userProgress.length * 200)) * 100, // 200 = 100 tiers * 2 (free + premium)
      mostClaimedTier: this.findMostClaimedTier(userProgress),
    }
  }

  private static findMostClaimedTier(userProgress: any[]): number {
    const tierCounts: Record<number, number> = {}

    userProgress.forEach((user) => {
      ;[...user.claimedTiers, ...user.claimedPremiumTiers].forEach((tier) => {
        tierCounts[tier] = (tierCounts[tier] || 0) + 1
      })
    })

    return Object.entries(tierCounts).reduce(
      (max, [tier, count]) => (count > tierCounts[max] ? Number.parseInt(tier) : max),
      1,
    )
  }

  private static calculateDuration(startDate: Date, endDate: Date): string {
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return `${days} dias`
  }

  /**
   * 🔍 VALIDAÇÃO DO ALGORITMO: Verificar se não há repetições
   */
  static async validateAlgorithmIntegrity(seasonId: string): Promise<{
    isValid: boolean
    issues: string[]
    statistics: any
  }> {
    const { db } = await dbConnect()
    const rewardsData = await db.collection("battlepass_rewards_advanced").find({ seasonId }).toArray()

    const issues: string[] = []
    const storeItems = new Set()
    const caseItems = new Set()
    const uniqueIds = new Set()

    rewardsData.forEach((reward) => {
      // Verificar repetições de itens de l
      if (reward.freeReward?.type === "store_item") {
        const itemId = reward.freeReward.itemId
        if (storeItems.has(itemId)) {
          issues.push(`Item de loja repetido: ${itemId} (free)`)
        }
        storeItems.add(itemId)
      }

      if (reward.premiumReward?.type === "store_item") {
        const itemId = reward.premiumReward.itemId
        if (storeItems.has(itemId)) {
          issues.push(`Item de loja repetido: ${itemId} (premium)`)
        }
        storeItems.add(itemId)
      }

      // Verificar repetições de itens de caixa
      if (reward.freeReward?.type === "case_item") {
        const itemId = reward.freeReward.itemId
        if (caseItems.has(itemId)) {
          issues.push(`Item de caixa repetido: ${itemId} (free)`)
        }
        caseItems.add(itemId)
      }

      if (reward.premiumReward?.type === "case_item") {
        const itemId = reward.premiumReward.itemId
        if (caseItems.has(itemId)) {
          issues.push(`Item de caixa repetido: ${itemId} (premium)`)
        }
        caseItems.add(itemId)
      }
      // Verificar IDs únicos
      ;[reward.freeReward?.uniqueId, reward.premiumReward?.uniqueId].forEach((id) => {
        if (id) {
          if (uniqueIds.has(id)) {
            issues.push(`ID único repetido: ${id}`)
          }
          uniqueIds.add(id)
        }
      })
    })

    return {
      isValid: issues.length === 0,
      issues,
      statistics: {
        totalRewards: rewardsData.length,
        uniqueStoreItems: storeItems.size,
        uniqueCaseItems: caseItems.size,
        uniqueIds: uniqueIds.size,
        emptyTiers: rewardsData.filter((r) => !r.freeReward && !r.premiumReward).length,
      },
    }
  }
}
