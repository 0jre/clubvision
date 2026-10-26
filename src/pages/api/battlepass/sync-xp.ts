// API para sincronizar XP do Battle Pass Avançado com atividades da plataforma
import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { AdvancedSeasonManager } from "@/lib/services/level/season-manager"
import { ClubActivityManager } from "@/lib/services/level/club-activity-manager"
 

interface XPSource {
  action: string
  xpAmount: number
  userId: string
  metadata?: any
}

// 🎯 RECOMPENSAS XP BALANCEADAS PARA O SISTEMA AVANÇADO
const XP_REWARDS = {
  open_case: 75, // Aumentado para o sistema avançado
  open_rare_case: 150,
  open_legendary_case: 300,
  send_message: 8,
  voice_connection: 15,
  invite_user: 200,
  daily_login: 50,
  complete_transaction: 60,
  level_up: 400,
  buy_item: 120,
  spend_tokens: 40,
  spend_bits: 25,
  spend_coins: 20,
  complete_trade: 100,
  win_game: 80,
  participate_event: 250,
  help_user: 60,
  use_command: 10,
  react_message: 5,
  first_message_day: 100,
  night_activity: 30,
  early_activity: 25,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método não permitido" })
  }

  const { action, userId, metadata } = req.body as XPSource

  if (!action || !userId) {
    return res.status(400).json({ success: false, message: "Dados inválidos" })
  }

  try {
    const { db } = await dbConnect()

    // 🚀 VERIFICAR TEMPORADA AVANÇADA ATIVA
    const seasonResult = await AdvancedSeasonManager.checkAndCreateAdvancedSeason()
    const activeSeason = seasonResult.season

    if (!activeSeason) {
      return res.status(404).json({ success: false, message: "Nenhuma temporada avançada ativa" })
    }

    // 🎯 CALCULAR XP BASEADO NA AÇÃO
    const baseXP = XP_REWARDS[action as keyof typeof XP_REWARDS] || 0
    let finalXP = baseXP

    // 🔥 APLICAR MULTIPLICADORES BASEADOS EM METADATA
    if (metadata?.multiplier) {
      finalXP *= metadata.multiplier
    }

    // 🏆 BONUS PARA USUÁRIOS PREMIUM (25% ao invés de 50%)
    const battlePassCollection = db.collection("battlepass_advanced")
    const userBattlePass = await battlePassCollection.findOne({
      userId,
      seasonId: activeSeason.seasonId,
    })

    if (userBattlePass?.isPremium) {
      finalXP = Math.floor(finalXP * 1.25) // 25% bonus para premium
    }

    // 📈 ATUALIZAR PROGRESSO DO BATTLE PASS AVANÇADO
    const xpResult = await addXPToAdvancedBattlePass(db, userId, finalXP, action, activeSeason.seasonId)

    // 🎯 ATUALIZAR PROGRESSO DE MISSÕES AVANÇADAS
    await updateAdvancedMissionProgress(db, userId, action, metadata, activeSeason.seasonId)

    // 🏆 SINCRONIZAR COM ATIVIDADE DO CLUB SE APLICÁVEL
    let clubActivitySync = null
    if (["send_message", "voice_connection", "participate_event"].includes(action)) {
      clubActivitySync = await ClubActivityManager.syncActivityWithBattlePass(userId, activeSeason.seasonId)
    }

    return res.status(200).json({
      success: true,
      xpGained: finalXP,
      action,
      newTier: xpResult.newTier,
      tierUp: xpResult.tierUp,
      clubActivitySync,
      algorithmVersion: activeSeason.algorithmVersion,
    })
  } catch (error) {
    console.error("❌ Erro ao sincronizar XP avançado:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

async function addXPToAdvancedBattlePass(
  db: any,
  userId: string,
  xpAmount: number,
  source: string,
  seasonId: string,
): Promise<{ newTier: number; tierUp: boolean }> {
  const battlePassCollection = db.collection("battlepass_advanced")

  let userBattlePass = await battlePassCollection.findOne({
    userId,
    seasonId,
  })

  if (!userBattlePass) {
    // 🆕 CRIAR PROGRESSO INICIAL AVANÇADO
    userBattlePass = {
      userId,
      seasonId,
      currentTier: 1,
      currentXP: 0,
      totalXP: 0,
      isPremium: false,
      claimedTiers: [],
      claimedPremiumTiers: [],
      lastActivity: new Date(),
      algorithmVersion: "v3.0.0-jackpot-simplified",
      uniqueRewardsReceived: [],
      weeklyMissions: [],
      dailyMissions: [],
      achievements: [],
    }

    await battlePassCollection.insertOne(userBattlePass)
  }

  const oldTier = userBattlePass.currentTier
  const newTotalXP = userBattlePass.totalXP + xpAmount
  const newTier = calculateAdvancedTierFromXP(newTotalXP)
  const currentXP = newTotalXP - getTotalXPForAdvancedTier(newTier - 1)

  await battlePassCollection.updateOne(
    { userId, seasonId },
    {
      $set: {
        totalXP: newTotalXP,
        currentTier: newTier,
        currentXP: currentXP,
        lastActivity: new Date(),
      },
    },
  )

  const tierUp = newTier > oldTier

  // 🎉 NOTIFICAR SE SUBIU DE TIER
  if (tierUp) {
    const notification = {
      userId,
      type: "advanced_battlepass_tier_up",
      title: "🆙 Novo Tier Avançado Desbloqueado!",
      message: `Você alcançou o tier ${newTier} no Battle Pass Avançado! (+${xpAmount} XP de ${source})`,
      timestamp: new Date(),
      metadata: {
        newTier,
        source,
        xpGained: xpAmount,
        algorithmVersion: "v3.0.0-jackpot-simplified",
      },
    }

    await db.collection("notifications").insertOne(notification)

    // 📊 CRIAR TRANSAÇÃO DE TIER UP
    const transaction = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      timestamp: new Date(),
      action: `advanced_tier_up_${newTier}`,
      status: "succeeded",
      currency: "battlepass_xp",
      item: {
        oldTier,
        newTier,
        xpGained: xpAmount,
        source,
      },
    }

    await db.collection("items").updateOne({ id: userId }, { $push: { transactions: transaction } })
  }

  return { newTier, tierUp }
}

async function updateAdvancedMissionProgress(db: any, userId: string, action: string, metadata: any, seasonId: string) {
  const battlePassCollection = db.collection("battlepass_advanced")

  const userBattlePass = await battlePassCollection.findOne({ userId, seasonId })
  if (!userBattlePass) return

  // 🎯 VERIFICAR SE TEM CONTRACT MISS ATIVADO
  const reformsCollection = db.collection("reforms")
  const userReforms = await reformsCollection.findOne({ userId })
  if (!userReforms?.contractmiss) return // Só atualiza missões se tiver contractmiss

  let updated = false
  const allMissions = [...(userBattlePass.dailyMissions || []), ...(userBattlePass.weeklyMissions || [])]

  // 🗺️ MAPEAR AÇÕES PARA MISSÕES AVANÇADAS
  const actionMissionMap: Record<string, string[]> = {
    open_case: ["open_cases"],
    open_rare_case: ["open_rare_cases", "open_cases"],
    open_legendary_case: ["open_legendary_cases", "open_rare_cases", "open_cases"],
    send_message: ["send_messages"],
    voice_connection: ["voice_time"],
    invite_user: ["invite_users"],
    buy_item: ["buy_items"],
    spend_tokens: ["spend_tokens"],
    spend_bits: ["spend_bits"],
    spend_coins: ["spend_coins"],
    complete_transaction: ["buy_items", "complete_trades"],
    level_up: ["level_up", "gain_xp"],
    win_game: ["win_games"],
    participate_event: ["participate_events"],
    help_user: ["help_users"],
    use_command: ["use_commands"],
    react_message: ["react_messages"],
    complete_trade: ["complete_trades", "perfect_trades"],
    first_message_day: ["first_message_day"],
    night_activity: ["night_owl", "night_warrior"],
    early_activity: ["early_bird"],
  }

  const relevantMissions = actionMissionMap[action] || []

  // 🔄 ATUALIZAR PROGRESSO DAS MISSÕES RELEVANTES
  for (const mission of allMissions) {
    if (relevantMissions.includes(mission.requirement.action) && !mission.isCompleted) {
      const increment = metadata?.count || metadata?.amount || 1
      mission.requirement.current = Math.min(mission.requirement.current + increment, mission.requirement.target)

      if (mission.requirement.current >= mission.requirement.target) {
        mission.isCompleted = true

        // 🎉 NOTIFICAR MISSÃO COMPLETADA
        const notification = {
          userId,
          type: "advanced_mission_completed",
          title: "🎯 Missão Avançada Completada!",
          message: `Você completou a missão "${mission.title}"! Resgate sua recompensa de ${mission.reward.xp} XP.`,
          timestamp: new Date(),
          metadata: {
            missionType: mission.type,
            category: mission.category,
            rewards: mission.reward,
          },
        }

        await db.collection("notifications").insertOne(notification)
      }

      updated = true
    }
  }

  if (updated) {
    await battlePassCollection.updateOne(
      { userId, seasonId },
      {
        $set: {
          dailyMissions: userBattlePass.dailyMissions,
          weeklyMissions: userBattlePass.weeklyMissions,
        },
      },
    )
  }
}

// 🧮 FUNÇÕES DE CÁLCULO AVANÇADAS
function calculateAdvancedXPForTier(tier: number): number {
  // Fórmula progressiva mais suave para o sistema avançado
  return Math.floor(100 + (tier - 1) * 50 + Math.pow(tier - 1, 1.2) * 10)
}

function calculateAdvancedTierFromXP(totalXP: number): number {
  let tier = 1
  let accumulatedXP = 0

  while (true) {
    const xpForThisTier = calculateAdvancedXPForTier(tier)
    if (accumulatedXP + xpForThisTier > totalXP) {
      break
    }
    accumulatedXP += xpForThisTier
    tier++
  }

  return Math.max(1, tier)
}

function getTotalXPForAdvancedTier(tier: number): number {
  if (tier <= 0) return 0

  let totalXP = 0
  for (let i = 1; i <= tier; i++) {
    totalXP += calculateAdvancedXPForTier(i)
  }
  return totalXP
}
