import { dbConnect } from "@/core/integration/connect"

import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';


export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const upgrader_Analystic: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {

  const sessionUser = req.session?.get("user")

  if (!sessionUser) {
    return res.status(401).json({
      success: false,
      error: "Usuário não autenticado",
    })
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Método não permitido",
    })
  }

  // Métodos auxiliares
  async function calculateProfitLoss(userId: string, db: any): Promise<number> {
    const upgrades = await db.collection("upgrades").find({ userId }).toArray()
    return upgrades.reduce((total: number, upgrade: any) => {
      if (upgrade.success) {
        return total + (upgrade.targetItem?.value || 0) - upgrade.totalOfferedValue
      } else {
        return total - upgrade.totalOfferedValue
      }
    }, 0)
  }

  async function calculateStreak(userId: string, db: any): Promise<{ current: number; best: number }> {
    const upgrades = await db.collection("upgrades").find({ userId }).sort({ timestamp: -1 }).toArray()
    let currentStreak = 0
    let bestStreak = 0
    let tempStreak = 0
    for (const upgrade of upgrades) {
      if (upgrade.success) {
        if (currentStreak === tempStreak) currentStreak++
        tempStreak++
      } else {
        if (currentStreak === tempStreak) currentStreak = 0
        tempStreak = 0
      }
      bestStreak = Math.max(bestStreak, tempStreak)
    }
    return { current: currentStreak, best: bestStreak }
  }

  async function generateRecommendations(userId: string, userStats: any, db: any): Promise<string[]> {
    const recommendations: string[] = []
    if (!userStats) {
      recommendations.push("Comece fazendo upgrades de baixo valor para ganhar experiência")
      return recommendations
    }
    const successRate = userStats.totalUpgrades
      ? ((userStats.successfulUpgrades || 0) / userStats.totalUpgrades) * 100
      : 0
    if (successRate < 30) {
      recommendations.push("Considere ofertar itens de maior valor para aumentar suas chances")
      recommendations.push("Analise as tendências de mercado antes de fazer upgrades")
    }
    if (successRate > 70) {
      recommendations.push("Excelente taxa de sucesso! Considere upgrades de maior valor")
    }
    const avgValue = userStats.totalUpgrades ? (userStats.totalValueTraded || 0) / userStats.totalUpgrades : 0
    if (avgValue < 1000) {
      recommendations.push("Tente acumular itens de maior valor antes de fazer upgrades")
    }
    return recommendations
  }

  async function getUserAchievements(userId: string, userStats: any, db: any): Promise<any[]> {
    const achievements: any[] = [] // <-- Correção aqui
    if (!userStats) return achievements
    if (userStats.totalUpgrades >= 100) {
      achievements.push({
        id: "century_trader",
        name: "Trader Centenário",
        description: "Realizou 100 upgrades",
        unlockedAt: userStats.lastUpgrade,
      })
    }
    const successRate = userStats.totalUpgrades
      ? ((userStats.successfulUpgrades || 0) / userStats.totalUpgrades) * 100
      : 0
    if (successRate >= 80 && userStats.totalUpgrades >= 20) {
      achievements.push({
        id: "lucky_trader",
        name: "Trader Sortudo",
        description: "Manteve 80% de taxa de sucesso em 20+ upgrades",
        unlockedAt: userStats.lastUpgrade,
      })
    }
    return achievements
  }
  
  try {
    const { db } = await dbConnect()
    const userId = sessionUser.id

    // Analytics avançados do usuário
    const [userStats, recentUpgrades, marketTrends, riskProfile] = await Promise.all([
      db.collection("user_stats").findOne({ userId }),
      db.collection("upgrades").find({ userId }).sort({ timestamp: -1 }).limit(10).toArray(),
      db.collection("market_analytics").findOne({ type: "global_trends" }),
      db.collection("risk_profiles").findOne({ userId }),
    ])

    // Calcular métricas avançadas
    const analytics = {
      userPerformance: {
        totalUpgrades: userStats?.totalUpgrades || 0,
        successRate: userStats?.totalUpgrades
          ? ((userStats.successfulUpgrades || 0) / userStats.totalUpgrades) * 100
          : 0,
        totalValueTraded: userStats?.totalValueTraded || 0,
        averageUpgradeValue: userStats?.totalUpgrades ? (userStats.totalValueTraded || 0) / userStats.totalUpgrades : 0,
        profitLoss: await calculateProfitLoss(userId, db),
        streak: await calculateStreak(userId, db),
      },

      recentActivity: recentUpgrades.map((upgrade) => ({
        timestamp: upgrade.timestamp,
        success: upgrade.success,
        probability: upgrade.calculation?.finalProbability || 0,
        valueTraded: upgrade.totalOfferedValue,
        targetValue: upgrade.targetItem?.value || 0,
        roi: upgrade.success
          ? (((upgrade.targetItem?.value || 0) - upgrade.totalOfferedValue) / upgrade.totalOfferedValue) * 100
          : -100,
      })),

      marketInsights: {
        globalSuccessRate: marketTrends?.globalSuccessRate || 0,
        averageUpgradeValue: marketTrends?.averageUpgradeValue || 0,
        popularItems: marketTrends?.popularItems || [],
        volatilityIndex: marketTrends?.volatilityIndex || 0,
      },

      riskAssessment: {
        riskLevel: riskProfile?.level || "MEDIUM",
        riskScore: riskProfile?.score || 50,
        recommendations: await generateRecommendations(userId, userStats, db),
      },

      achievements: await getUserAchievements(userId, userStats, db),
    }

    return res.status(200).json({
      success: true,
      analytics,
    })
  } catch (error) {
    console.error("Erro ao gerar analytics:", error)
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    })
  }
}


const UpgraderAnalystic: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
   // Use o await para chamar a função original checkAuth
   await upgrader_Analystic(req, res);
 };
 
 export default withSession(UpgraderAnalystic);
 