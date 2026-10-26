import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import { AdvancedSeasonManager } from "@/lib/services/level/season-manager"
import type { NextApiHandler } from "next"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

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

interface PrizesDropsData {
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

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  if (!req.session?.get("user")) {
    return res.status(401).json({ success: false, message: "Usuário não autenticado" })
  }

  const sessionUser = req.session.get("user")
  const userId = sessionUser.id
  const { db } = await dbConnect()

  try {
    switch (req.method) {
      case "GET":
        return await handleGetPrizesDrops(db, userId, req, res)
      case "POST":
        return await handlePrizesDropsAction(db, userId, req, res)
      default:
        return res.status(405).json({ success: false, message: "Método não permitido" })
    }
  } catch (error) {
    console.error("Erro na API Prizes & Drops:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

async function handleGetPrizesDrops(db: any, userId: string, req: NextApiRequest, res: NextApiResponse) {
  const battlePassCollection = db.collection("battlepass_advanced")

  // Buscar temporada ativa
  const seasonResult = await AdvancedSeasonManager.checkAndCreateAdvancedSeason()
  const activeSeason = seasonResult.season

  if (!activeSeason) {
    return res.status(404).json({ success: false, message: "Nenhuma temporada ativa encontrada" })
  }

  // Buscar progresso do usuário
  const userBattlePass = await battlePassCollection.findOne({ userId, seasonId: activeSeason.seasonId })

  if (!userBattlePass) {
    return res.status(200).json({
      success: true,
      data: {
        prizes: [],
        drops: [],
        summary: {
          totalPrizes: 0,
          claimablePrizes: 0,
          totalDrops: 0,
          completedDrops: 0,
          expiringSoon: 0,
        },
        userProgress: {
          currentTier: 1,
          totalXP: 0,
          isPremium: false,
        },
      },
    })
  }

  // Buscar recompensas da temporada
  const seasonRewards = await AdvancedSeasonManager.getAdvancedSeasonRewards(activeSeason.seasonId)

  // Construir lista de prêmios disponíveis
  const prizes: PrizeItem[] = []

  for (let tier = 1; tier <= userBattlePass.currentTier; tier++) {
    const savedReward = seasonRewards.find((r) => r.tier === tier)

    // Recompensa gratuita
    if (savedReward?.freeReward && !userBattlePass.claimedTiers.includes(tier)) {
      prizes.push({
        id: `free_${tier}`,
        tier,
        type: "free",
        reward: savedReward.freeReward,
        isClaimable: true,
        expiresAt: activeSeason.endDate,
      })
    }

    // Recompensa premium
    if (
      savedReward?.premiumReward &&
      userBattlePass.isPremium &&
      userBattlePass.claimedTiers.includes(tier) &&
      !userBattlePass.claimedPremiumTiers.includes(tier)
    ) {
      prizes.push({
        id: `premium_${tier}`,
        tier,
        type: "premium",
        reward: savedReward.premiumReward,
        isClaimable: true,
        expiresAt: activeSeason.endDate,
      })
    }
  }

  // Construir lista de drops (missões)
  const drops: DropItem[] = []
  const now = new Date()

  // Verificar se tem contractmiss ativado
  const reformsCollection = db.collection("reforms")
  const userReforms = await reformsCollection.findOne({ userId })
  const hasContractMiss = userReforms?.contractmiss === true

  if (hasContractMiss) {
    // Missões diárias
    if (userBattlePass.dailyMissions) {
      userBattlePass.dailyMissions.forEach((mission: any) => {
        drops.push({
          id: mission.id,
          type: "daily",
          title: mission.title,
          description: mission.description,
          reward: mission.reward,
          isCompleted: mission.isCompleted || false,
          completedAt: mission.completedAt ? new Date(mission.completedAt) : undefined,
          expiresAt: new Date(mission.expiresAt),
          progress: mission.progress,
        })
      })
    }

    // Missões semanais
    if (userBattlePass.weeklyMissions) {
      userBattlePass.weeklyMissions.forEach((mission: any) => {
        drops.push({
          id: mission.id,
          type: "weekly",
          title: mission.title,
          description: mission.description,
          reward: mission.reward,
          isCompleted: mission.isCompleted || false,
          completedAt: mission.completedAt ? new Date(mission.completedAt) : undefined,
          expiresAt: new Date(mission.expiresAt),
          progress: mission.progress,
        })
      })
    }
  }

  // Calcular estatísticas
  const claimablePrizes = prizes.filter((p) => p.isClaimable).length
  const completedDrops = drops.filter((d) => d.isCompleted).length
  const expiringSoon = [...prizes, ...drops].filter((item) => {
    const timeUntilExpiry = item.expiresAt!.getTime() - now.getTime()
    return timeUntilExpiry > 0 && timeUntilExpiry < 24 * 60 * 60 * 1000 // 24 horas
  }).length

  const data: PrizesDropsData = {
    prizes,
    drops,
    summary: {
      totalPrizes: prizes.length,
      claimablePrizes,
      totalDrops: drops.length,
      completedDrops,
      expiringSoon,
    },
    userProgress: {
      currentTier: userBattlePass.currentTier,
      totalXP: userBattlePass.totalXP,
      isPremium: userBattlePass.isPremium,
    },
  }

  return res.status(200).json({
    success: true,
    data,
    season: activeSeason,
    hasContractMiss,
  })
}

async function handlePrizesDropsAction(db: any, userId: string, req: NextApiRequest, res: NextApiResponse) {
  const { action, data } = req.body

  switch (action) {
    case "claim_prize":
      return await claimPrize(db, userId, data, res)
    case "complete_drop":
      return await completeDrop(db, userId, data, res)
    case "refresh_data":
      return await handleGetPrizesDrops(db, userId, req, res)
    default:
      return res.status(400).json({ success: false, message: "Ação inválida" })
  }
}

async function claimPrize(db: any, userId: string, data: { prizeId: string }, res: NextApiResponse) {
  const battlePassCollection = db.collection("battlepass_advanced")

  // Parse do ID do prêmio
  const [type, tierStr] = data.prizeId.split("_")
  const tier = Number.parseInt(tierStr)
  const isPremium = type === "premium"

  // Buscar progresso do usuário
  const userBattlePass = await battlePassCollection.findOne({ userId })
  if (!userBattlePass) {
    return res.status(404).json({ success: false, message: "Progresso não encontrado" })
  }

  // Verificações de segurança
  if (tier > userBattlePass.currentTier) {
    return res.status(403).json({
      success: false,
      message: `Você precisa alcançar o tier ${tier} para resgatar esta recompensa`,
    })
  }

  if (isPremium && !userBattlePass.isPremium) {
    return res.status(403).json({
      success: false,
      message: "Premium necessário para esta recompensa",
    })
  }

  const claimedArray = isPremium ? "claimedPremiumTiers" : "claimedTiers"
  if (userBattlePass[claimedArray].includes(tier)) {
    return res.status(409).json({
      success: false,
      message: "Recompensa já resgatada",
    })
  }

  // Para recompensas premium, verificar se a gratuita foi resgatada
  if (isPremium && !userBattlePass.claimedTiers.includes(tier)) {
    return res.status(403).json({
      success: false,
      message: "Você deve resgatar a recompensa gratuita primeiro",
    })
  }

  // Buscar recompensa
  const savedTierReward = await AdvancedSeasonManager.getAdvancedTierReward(userBattlePass.seasonId, tier)
  if (!savedTierReward) {
    return res.status(404).json({ success: false, message: "Recompensa não encontrada" })
  }

  const reward = isPremium ? savedTierReward.premiumReward : savedTierReward.freeReward
  if (!reward) {
    return res.status(404).json({ success: false, message: "Nenhuma recompensa disponível" })
  }

  // Aplicar recompensa
  await applyReward(db, userId, reward)

  // Marcar como resgatado
  const updateData: any = { $push: { [claimedArray]: tier } }
  if (reward.uniqueId) {
    updateData.$push.uniqueRewardsReceived = reward.uniqueId
  }

  await battlePassCollection.updateOne({ userId }, updateData)

  // Criar transação
  const timestamp = new Date()
  const transaction = {
    date: timestamp.toLocaleDateString(),
    time: timestamp.toLocaleTimeString(),
    timestamp: new Date(),
    action: `prizes_claim_tier_${tier}`,
    status: "succeeded",
    currency: "battlepass_reward",
    item: {
      tier,
      reward: getRewardDisplayInfo(reward),
      isPremium,
      uniqueId: reward.uniqueId,
      source: "prizes_drops_api",
    },
  }

  await db.collection("items").updateOne({ id: userId }, { $push: { transactions: transaction } })

  // Criar notificação
  const notification = {
    userId,
    type: "prize_claimed",
    title: "🎁 Prêmio Resgatado!",
    message: `Você resgatou uma recompensa do tier ${tier}!`,
    timestamp: new Date(),
    metadata: {
      tier,
      isPremium,
      uniqueId: reward.uniqueId,
    },
  }

  await db.collection("notifications").insertOne(notification)

  return res.status(200).json({
    success: true,
    reward: getRewardDisplayInfo(reward),
    tier,
    message: `Prêmio do tier ${tier} resgatado com sucesso!`,
  })
}

async function completeDrop(db: any, userId: string, data: { dropId: string }, res: NextApiResponse) {
  // Esta função seria implementada para completar missões/drops
  // Por agora, retornamos um placeholder
  return res.status(200).json({
    success: true,
    message: "Drop completado com sucesso!",
  })
}

async function applyReward(db: any, userId: string, reward: any): Promise<void> {
  const itemsCollection = db.collection("items")

  switch (reward.type) {
    case "bits":
      await itemsCollection.updateOne({ id: userId }, { $inc: { bits: reward.amount } })
      break
    case "coins":
      await itemsCollection.updateOne({ id: userId }, { $inc: { coins: reward.amount } })
      break
    case "tokens":
      await itemsCollection.updateOne({ id: userId }, { $inc: { token: reward.amount } })
      break
    // Adicionar outros tipos conforme necessário
  }
}

function getRewardDisplayInfo(reward: any): any {
  const baseInfo = {
    name: "",
    description: "",
    rarity: reward?.rarity || "common",
    image: reward?.image || "",
    uniqueId: reward?.uniqueId,
    seasonExclusive: reward?.seasonExclusive,
  }

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
    default:
      return {
        ...baseInfo,
        icon: "🎁",
        name: "Recompensa Especial",
        description: "Recompensa única do battle pass",
      }
  }
}

const PrizesDropsAPI: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await checkAuth(req, res)
}

export default withSession(PrizesDropsAPI)

