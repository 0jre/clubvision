import { dbConnect } from "@/core/integration/connect"

/**
 * 🏆 GERENCIADOR DE ATIVIDADE DO CLUB
 * Sistema inteligente que converte atividade do club em XP do Battle Pass
 */
export class ClubActivityManager {
  /**
   * 📊 BUSCAR ATIVIDADE DO CLUB
   */
  static async getClubActivity(userId: string): Promise<{
    clubActivity: number
    xpFromActivity: number
    levelFromActivity: number
    lastUpdated: Date | null
  }> {
    try {
      const { db } = await dbConnect()
      const memberStatsCollection = db.collection("member-stats")

      const memberStats = await memberStatsCollection.findOne({ member_id: userId })

      const clubActivity = memberStats?.clubactivity || 0
      const xpFromActivity = this.calculateXPFromClubActivity(clubActivity)
      const levelFromActivity = this.calculateLevelFromXP(xpFromActivity)

      return {
        clubActivity,
        xpFromActivity,
        levelFromActivity,
        lastUpdated: memberStats?.lastUpdated || null,
      }
    } catch (error) {
      console.error("❌ Erro ao buscar atividade do club:", error)
      return {
        clubActivity: 0,
        xpFromActivity: 0,
        levelFromActivity: 0,
        lastUpdated: null,
      }
    }
  }

 
static calculateXPFromClubActivity(clubActivity: number): number {
  if (clubActivity <= 0) return 0;

  // 🔥 Progressão exponencial leve para dificultar quanto maior a atividade
  const baseMultiplier = 0.015; // ✅ Fator base ajustável
  const exponent = 0.85;         // ✅ Quanto menor, mais linear. Quanto maior (>1), mais exponencial.

  // 🎯 Fórmula base de XP
  const baseXP = Math.pow(clubActivity, exponent) * baseMultiplier;

  // 🎁 Bônus inteligentes por marcos ou thresholds
  const activityBonuses = this.calculateActivityBonuses(clubActivity);

  // 🚀 Retorna o XP arredondado
  return Math.floor(baseXP + activityBonuses);
}


 private static calculateActivityBonuses(clubActivity: number): number {
  // 🎯 Definição dos marcos
  const milestones = [
    { threshold: 100, multiplier: 0.08, label: "Primeiro Passo" },
    { threshold: 250, multiplier: 0.09, label: "Ativo" },
    { threshold: 500, multiplier: 0.1, label: "Dedicado" },
    { threshold: 1000, multiplier: 0.12, label: "Veterano" },
    { threshold: 2000, multiplier: 0.14, label: "Lenda" },
    { threshold: 3500, multiplier: 0.16, label: "Mestre" },
    { threshold: 5000, multiplier: 0.18, label: "Supremo" },
  ];

  let bonus = 0;

  for (const milestone of milestones) {
    if (clubActivity >= milestone.threshold) {
      // 🎁 Calcula bônus proporcional ao threshold
      bonus += milestone.threshold * milestone.multiplier;
    }
  }

  return Math.floor(bonus);
}

  /**
   * 📈 CALCULAR NÍVEL BASEADO NO XP
   */
  static calculateLevelFromXP(totalXP: number): number {
    if (totalXP <= 0) return 0

    let level = 0
    let xpUsed = 0

    // Usar a mesma fórmula do battle pass para consistência
    while (xpUsed < totalXP) {
      level++
      const xpForThisLevel = this.calculateXPForLevel(level)

      if (xpUsed + xpForThisLevel > totalXP) {
        level-- // Não completou este nível
        break
      }

      xpUsed += xpForThisLevel
    }

    return Math.max(0, level)
  }

  /**
   * 🎯 XP NECESSÁRIO POR NÍVEL (consistente com battle pass)
   */
  private static calculateXPForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.15, level - 1))
  }

  /**
   * 🔄 SINCRONIZAR ATIVIDADE COM BATTLE PASS
   */
  static async syncActivityWithBattlePass(
    userId: string,
    seasonId: string,
  ): Promise<{
    success: boolean
    xpAdded: number
    newTier: number
    activityUsed: number
  }> {
    try {
      const { db } = await dbConnect()
      const battlePassCollection = db.collection("battlepass_advanced")

      // Buscar atividade atual
      const activityData = await this.getClubActivity(userId)

      if (activityData.clubActivity <= 0) {
        return {
          success: false,
          xpAdded: 0,
          newTier: 0,
          activityUsed: 0,
        }
      }

      // Buscar progresso atual do battle pass
      const userBattlePass = await battlePassCollection.findOne({ userId, seasonId })

      if (!userBattlePass) {
        return {
          success: false,
          xpAdded: 0,
          newTier: 0,
          activityUsed: 0,
        }
      }

      // Verificar se já foi sincronizado nesta temporada
      const lastSyncActivity = userBattlePass.lastSyncedActivity || 0
      const newActivity = activityData.clubActivity - lastSyncActivity

      if (newActivity <= 0) {
        return {
          success: false,
          xpAdded: 0,
          newTier: userBattlePass.currentTier,
          activityUsed: 0,
        }
      }

      // Calcular XP da nova atividade
      const xpFromNewActivity = this.calculateXPFromClubActivity(newActivity)
      const newTotalXP = userBattlePass.totalXP + xpFromNewActivity
      const newTier = this.calculateTierFromXP(newTotalXP)
      const currentXP = newTotalXP - this.getTotalXPForTier(newTier - 1)

      // Atualizar battle pass
      await battlePassCollection.updateOne(
        { userId, seasonId },
        {
          $set: {
            totalXP: newTotalXP,
            currentTier: newTier,
            currentXP: currentXP,
            lastSyncedActivity: activityData.clubActivity,
            lastActivitySync: new Date(),
          },
        },
      )

      // Criar notificação se subiu de tier
      if (newTier > userBattlePass.currentTier) {
        const notification = {
          userId,
          type: "club_activity_tier_up",
          title: "🏆 Atividade do Club Recompensada!",
          message: `Sua atividade no club te levou ao tier ${newTier}! (+${xpFromNewActivity} XP)`,
          timestamp: new Date(),
          metadata: {
            activityUsed: newActivity,
            xpGained: xpFromNewActivity,
            newTier,
            source: "club_activity",
          },
        }

        await db.collection("notifications").insertOne(notification)
      }

      // Criar transação
      const transaction = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        timestamp: new Date(),
        action: "club_activity_sync",
        status: "succeeded",
        currency: "club_activity",
        item: {
          activityUsed: newActivity,
          xpGained: xpFromNewActivity,
          newTier,
          tierGained: newTier - userBattlePass.currentTier,
        },
      }

      await db.collection("items").updateOne({ id: userId }, { $push: { transactions: transaction } })

      console.log(`🏆 Atividade sincronizada: ${userId} - ${newActivity} atividade = ${xpFromNewActivity} XP`)

      return {
        success: true,
        xpAdded: xpFromNewActivity,
        newTier,
        activityUsed: newActivity,
      }
    } catch (error) {
      console.error("❌ Erro ao sincronizar atividade:", error)
      return {
        success: false,
        xpAdded: 0,
        newTier: 0,
        activityUsed: 0,
      }
    }
  }

  /**
   * 🔄 RESETAR ATIVIDADE DO CLUB (nova temporada)
   */
  static async resetClubActivityForNewSeason(): Promise<{
    success: boolean
    usersReset: number
  }> {
    try {
      const { db } = await dbConnect()
      const memberStatsCollection = db.collection("member-stats")

      console.log("🔄 Resetando atividade do club para nova temporada...")

      // Resetar clubactivity para 0 em todos os usuários
      const result = await memberStatsCollection.updateMany(
        { clubactivity: { $gt: 0 } },
        {
          $set: {
            clubactivity: 0,
            lastSeasonReset: new Date(),
          },
        },
      )

      console.log(`✅ Atividade resetada para ${result.modifiedCount} usuários`)

      return {
        success: true,
        usersReset: result.modifiedCount,
      }
    } catch (error) {
      console.error("❌ Erro ao resetar atividade do club:", error)
      return {
        success: false,
        usersReset: 0,
      }
    }
  }

  /**
   * 📊 ESTATÍSTICAS DE ATIVIDADE
   */
  static async getActivityStatistics(): Promise<{
    totalUsers: number
    averageActivity: number
    topActivity: number
    usersWithActivity: number
    activityDistribution: Record<string, number>
  }> {
    try {
      const { db } = await dbConnect()
      const memberStatsCollection = db.collection("member-stats")

      const stats = await memberStatsCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalUsers: { $sum: 1 },
              averageActivity: { $avg: "$clubactivity" },
              topActivity: { $max: "$clubactivity" },
              usersWithActivity: {
                $sum: { $cond: [{ $gt: ["$clubactivity", 0] }, 1, 0] },
              },
            },
          },
        ])
        .toArray()

      // Distribuição por faixas
      const distribution = await memberStatsCollection
        .aggregate([
          {
            $bucket: {
              groupBy: "$clubactivity",
              boundaries: [0, 100, 500, 1000, 2000, 5000, 10000],
              default: "10000+",
              output: {
                count: { $sum: 1 },
              },
            },
          },
        ])
        .toArray()

      const activityDistribution: Record<string, number> = {}
      distribution.forEach((bucket) => {
        activityDistribution[bucket._id.toString()] = bucket.count
      })

      return {
        totalUsers: stats[0]?.totalUsers || 0,
        averageActivity: Math.round(stats[0]?.averageActivity || 0),
        topActivity: stats[0]?.topActivity || 0,
        usersWithActivity: stats[0]?.usersWithActivity || 0,
        activityDistribution,
      }
    } catch (error) {
      console.error("❌ Erro ao obter estatísticas de atividade:", error)
      return {
        totalUsers: 0,
        averageActivity: 0,
        topActivity: 0,
        usersWithActivity: 0,
        activityDistribution: {},
      }
    }
  }

  // Funções auxiliares para cálculos
  private static calculateTierFromXP(totalXP: number): number {
    let tier = 1
    let accumulatedXP = 0

    while (true) {
      const xpForThisTier = this.calculateXPForLevel(tier)
      if (accumulatedXP + xpForThisTier > totalXP) {
        break
      }
      accumulatedXP += xpForThisTier
      tier++
    }

    return Math.max(1, tier)
  }

  private static getTotalXPForTier(tier: number): number {
    if (tier <= 0) return 0

    let totalXP = 0
    for (let i = 1; i <= tier; i++) {
      totalXP += this.calculateXPForLevel(i)
    }
    return totalXP
  }

  /**
   * 🎯 PREVIEW DE CONVERSÃO (para mostrar ao usuário)
   */
  static getActivityConversionPreview(clubActivity: number): {
    xpGained: number
    levelsGained: number
    milestones: Array<{ name: string; threshold: number; bonus: number; achieved: boolean }>
    breakdown: Array<{ range: string; activity: number; xp: number; ratio: string }>
  } {
    const xpGained = this.calculateXPFromClubActivity(clubActivity)
    const levelsGained = this.calculateLevelFromXP(xpGained)

 const milestones = [
  { name: "Primeiro Passo", threshold: 100, multiplier: 0.08 },
  { name: "Ativo", threshold: 250, multiplier: 0.09 },
  { name: "Dedicado", threshold: 500, multiplier: 0.10 },
  { name: "Veterano", threshold: 1000, multiplier: 0.12 },
  { name: "Lenda", threshold: 2000, multiplier: 0.14 },
  { name: "Mestre", threshold: 3500, multiplier: 0.16 },
  { name: "Supremo", threshold: 5000, multiplier: 0.18 },
].map(m => ({
  ...m,
  bonus: Math.floor(m.threshold * m.multiplier), 
  achieved: clubActivity >= m.threshold           
}));


    // Breakdown detalhado
    const breakdown = []
    let remainingActivity = clubActivity

    if (remainingActivity > 0) {
      const tier1 = Math.min(remainingActivity, 100)
      breakdown.push({ range: "0-100", activity: tier1, xp: tier1 * 10, ratio: "1:10" })
      remainingActivity -= tier1
    }

    if (remainingActivity > 0) {
      const tier2 = Math.min(remainingActivity, 400)
      breakdown.push({ range: "101-500", activity: tier2, xp: tier2 * 8, ratio: "1:8" })
      remainingActivity -= tier2
    }

    if (remainingActivity > 0) {
      const tier3 = Math.min(remainingActivity, 1000)
      breakdown.push({ range: "501-1500", activity: tier3, xp: tier3 * 6, ratio: "1:6" })
      remainingActivity -= tier3
    }

    if (remainingActivity > 0) {
      const tier4 = Math.min(remainingActivity, 1500)
      breakdown.push({ range: "1501-3000", activity: tier4, xp: tier4 * 4, ratio: "1:4" })
      remainingActivity -= tier4
    }

    if (remainingActivity > 0) {
      breakdown.push({ range: "3001+", activity: remainingActivity, xp: remainingActivity * 2, ratio: "1:2" })
    }

    return {
      xpGained,
      levelsGained,
      milestones,
      breakdown,
    }
  }
}
