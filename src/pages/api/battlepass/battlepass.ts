import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"

import type { NextApiHandler } from "next"
import type { BattlePassReward, PremiumPriceInfo, UserBattlePassAdvanced } from "@/lib/services/level/battlepass"
import { AdvancedSeasonManager } from "@/lib/services/level/season-manager"
import { ClubActivityManager } from "@/lib/services/level/club-activity-manager"
import { AdvancedMissionGenerator } from "@/lib/services/level/missions"
import { rentables } from "@/types/clubstore/list.opencontainer"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

interface AdvancedBattlePassTier {
  tier: number
  xpRequired: number
  freeReward?: BattlePassReward
  premiumReward?: BattlePassReward
  isUnlocked: boolean
  isClaimed: boolean
  isPremiumClaimed: boolean
  isEmpty: boolean
  uniqueRewards: boolean
}

interface AdvancedBattlePassData {
  season: any
  userProgress: UserBattlePassAdvanced
  tiers: AdvancedBattlePassTier[]
  timeRemaining: number
  seasonCreated: boolean
  seasonMessage: string
  premiumPriceInfo: PremiumPriceInfo
  algorithmInfo: any
  seasonStats: any
  hasContractMiss: boolean
  missionStats: any
  clubActivity: any
  activitySync: any
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
        return await handleGetAdvancedBattlePass(db, userId, req, res)
      case "POST":
        return await handleAdvancedBattlePassAction(db, userId, req, res)
      default:
        return res.status(405).json({ success: false, message: "Método não permitido" })
    }
  } catch (error) {
    console.error("Erro no Battle Pass Avançado:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

async function handleGetAdvancedBattlePass(db: any, userId: string, req: NextApiRequest, res: NextApiResponse) {
  const battlePassCollection = db.collection("battlepass_advanced")

  // 🚀 VERIFICAÇÃO AUTOMÁTICA DE TEMPORADA AVANÇADA
  const seasonResult = await AdvancedSeasonManager.checkAndCreateAdvancedSeason()
  const activeSeason = seasonResult.season

  if (!activeSeason) {
    return res.status(404).json({ success: false, message: "Erro ao inicializar temporada avançada" })
  }

  // Buscar ou criar progresso do usuário
  let userBattlePass = await battlePassCollection.findOne({ userId, seasonId: activeSeason.seasonId })

  if (!userBattlePass) {
    userBattlePass = {
      userId,
      seasonId: activeSeason.seasonId,
      currentTier: 1,
      currentXP: 0,
      totalXP: 0,
      isPremium: false,
      claimedTiers: [],
      claimedPremiumTiers: [],
      lastActivity: new Date(),
      algorithmVersion: activeSeason.algorithmVersion,
      uniqueRewardsReceived: [],
      dailyMissions: [],
      weeklyMissions: [],
    }

    await battlePassCollection.insertOne(userBattlePass)
  }

  // 🏆 BUSCAR E SINCRONIZAR ATIVIDADE DO CLUB
  const clubActivityData = await ClubActivityManager.getClubActivity(userId)
  const activitySyncResult = await ClubActivityManager.syncActivityWithBattlePass(userId, activeSeason.seasonId)

  console.log(`🏆 Atividade do club: ${clubActivityData.clubActivity} -> ${clubActivityData.xpFromActivity} XP`)
  if (activitySyncResult.success) {
    console.log(`✅ Sincronização: +${activitySyncResult.xpAdded} XP, Tier ${activitySyncResult.newTier}`)
  }

  // Verificar se o usuário tem contractmiss ativado para receber missões
  const reformsCollection = db.collection("reforms")
  const userReforms = await reformsCollection.findOne({ userId })
  const hasContractMiss = userReforms?.contractmiss === true

  // Só gerar/renovar missões se tiver contractmiss ativado
  if (hasContractMiss) {
    // Verificar se precisa renovar missões diárias
    const lastActivity = new Date(userBattlePass.lastActivity || new Date())
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff >= 1 || !userBattlePass.dailyMissions?.length) {
      userBattlePass.dailyMissions = AdvancedMissionGenerator.generateDailyMissions(userId, activeSeason.algorithmSeed)
      console.log(`🎯 Geradas ${userBattlePass.dailyMissions.length} missões diárias avançadas`)
    }

    // Verificar se precisa renovar missões semanais
    const weeksDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24 * 7))
    if (weeksDiff >= 1 || !userBattlePass.weeklyMissions?.length) {
      userBattlePass.weeklyMissions = AdvancedMissionGenerator.generateWeeklyMissions(
        userId,
        activeSeason.algorithmSeed,
      )
      console.log(`📅 Geradas ${userBattlePass.weeklyMissions.length} missões semanais avançadas`)
    }

    // Atualizar no banco se houve mudanças
    if (daysDiff >= 1 || weeksDiff >= 1) {
      await battlePassCollection.updateOne(
        { userId, seasonId: activeSeason.seasonId },
        {
          $set: {
            dailyMissions: userBattlePass.dailyMissions,
            weeklyMissions: userBattlePass.weeklyMissions,
            lastActivity: now,
          },
        },
      )
    }
  } else {
    // Se não tem contractmiss, limpar missões existentes
    userBattlePass.dailyMissions = []
    userBattlePass.weeklyMissions = []
  }

  // Obter estatísticas das missões
  const missionStats = AdvancedMissionGenerator.getMissionStats()

  // 🎁 BUSCAR RECOMPENSAS AVANÇADAS SALVAS NO BANCO
  console.log(`🔍 Buscando recompensas avançadas da temporada ${activeSeason.seasonId}...`)
  const seasonRewards = await AdvancedSeasonManager.getAdvancedSeasonRewards(activeSeason.seasonId)

  // Construir tiers com recompensas avançadas
  const tiers: AdvancedBattlePassTier[] = []
  let totalEmptyTiers = 0

  for (let i = 1; i <= activeSeason.maxTiers; i++) {
    const xpRequired = calculateXPForTier(i)
    const savedReward = seasonRewards.find((r) => r.tier === i)

    const isEmpty = !savedReward?.freeReward && !savedReward?.premiumReward
    const hasUniqueRewards = !!(savedReward?.freeReward?.uniqueId || savedReward?.premiumReward?.uniqueId)

    if (isEmpty) totalEmptyTiers++

    // 🔒 LÓGICA DE DESBLOQUEIO: Só desbloquear até o tier atual do usuário
    const isUnlocked = i <= userBattlePass.currentTier

    tiers.push({
      tier: i,
      xpRequired,
      freeReward: savedReward?.freeReward,
      premiumReward: savedReward?.premiumReward,
      isUnlocked, // 🆕 Agora baseado no tier atual, não no XP total
      isClaimed: userBattlePass.claimedTiers.includes(i),
      isPremiumClaimed: userBattlePass.claimedPremiumTiers.includes(i),
      isEmpty,
      uniqueRewards: hasUniqueRewards,
    })
  }

  console.log(`✅ Carregados ${tiers.length} tiers avançados (${totalEmptyTiers} vazios) com algoritmo inteligente`)
  console.log(`🔒 Usuário no tier ${userBattlePass.currentTier} - ${userBattlePass.currentTier} tiers desbloqueados`)

  // 💰 Obter informações de preço do premium
  const premiumPriceInfo = await getAdvancedPremiumPriceInfo(db, userId)

  // 📊 Estatísticas da temporada
  const seasonStats = await AdvancedSeasonManager.getSeasonStats(activeSeason.seasonId)

  return res.status(200).json({
    success: true,
    data: {
      season: activeSeason,
      userProgress: userBattlePass,
      tiers,
      // FIX: Ensure activeSeason.endDate is a Date object before calling getTime()
      timeRemaining: new Date(activeSeason.endDate).getTime() - new Date().getTime(),
      seasonCreated: seasonResult.created,
      seasonMessage: seasonResult.message,
      premiumPriceInfo,
      algorithmInfo: {
        version: activeSeason.algorithmVersion,
        statistics: seasonResult.statistics,
        uniqueItemsGuarantee: true,
        emptyTiersIncluded: true,
      },
      seasonStats,
      hasContractMiss,
      missionStats,
      clubActivity: clubActivityData, // 🆕 Dados de atividade do club
      activitySync: activitySyncResult, // 🆕 Resultado da sincronização
    },
  })
}

async function handleAdvancedBattlePassAction(db: any, userId: string, req: NextApiRequest, res: NextApiResponse) {
  const { action, data } = req.body

  switch (action) {
    case "claim_advanced_reward":
      return await claimAdvancedReward(db, userId, data, res)
    case "buy_premium":
      return await buyPremium(db, userId, res)
    case "add_xp":
      return await addXP(db, userId, data.amount, data.source, res)
    case "get_season_statistics":
      return await getSeasonStatistics(db, res)
    case "complete_mission":
      return await completeAdvancedMission(db, userId, data.missionId, res)
    case "get_premium_price":
      const priceInfo = await getAdvancedPremiumPriceInfo(db, userId)
      return res.status(200).json({ success: true, priceInfo })
    case "sync_club_activity":
      return await syncClubActivity(db, userId, res)
    case "get_activity_preview":
      return await getActivityPreview(db, userId, data.clubActivity, res)
    case "get_club_activity_stats":
      return await getClubActivityStatistics(db, res)
    default:
      return res.status(400).json({ success: false, message: "Ação inválida" })
  }
}

async function claimAdvancedReward(
  db: any,
  userId: string,
  data: { tier: number; isPremium: boolean },
  res: NextApiResponse,
) {
  const battlePassCollection = db.collection("battlepass_advanced")

  const userBattlePass = await battlePassCollection.findOne({ userId })
  if (!userBattlePass) {
    return res.status(404).json({ success: false, message: "Progresso do Battle Pass não encontrado" })
  }

  const tier = data.tier

  // 🔒 VERIFICAÇÃO PRINCIPAL: Usuário só pode resgatar até o tier atual
  if (tier > userBattlePass.currentTier) {
    return res.status(403).json({
      success: false,
      message: `Você precisa alcançar o tier ${tier} para resgatar esta recompensa. Tier atual: ${userBattlePass.currentTier}`,
      currentTier: userBattlePass.currentTier,
      requestedTier: tier,
    })
  }

  // 🔒 VERIFICAÇÃO ADICIONAL: XP suficiente (redundante, mas mantida por segurança)
  const xpRequired = calculateXPForTier(tier)
  if (userBattlePass.totalXP < xpRequired) {
    return res.status(400).json({
      success: false,
      message: "XP insuficiente para este tier",
      currentXP: userBattlePass.totalXP,
      requiredXP: xpRequired,
    })
  }

  // 🔒 VERIFICAÇÃO PREMIUM
  if (data.isPremium && !userBattlePass.isPremium) {
    return res.status(403).json({ success: false, message: "Premium necessário para esta recompensa" })
  }

  // 🔒 VERIFICAÇÃO DE RECOMPENSA JÁ RESGATADA
  const claimedArray = data.isPremium ? "claimedPremiumTiers" : "claimedTiers"
  if (userBattlePass[claimedArray].includes(tier)) {
    return res.status(409).json({ success: false, message: "Recompensa já resgatada" })
  }

  // 🎁 BUSCAR RECOMPENSA AVANÇADA SALVA NO BANCO
  const savedTierReward = await AdvancedSeasonManager.getAdvancedTierReward(userBattlePass.seasonId, tier)

  if (!savedTierReward) {
    return res.status(404).json({ success: false, message: "Recompensas não encontradas para este tier" })
  }

  const reward = data.isPremium ? savedTierReward.premiumReward : savedTierReward.freeReward

  if (!reward) {
    return res.status(404).json({ success: false, message: "Nenhuma recompensa disponível para este tier" })
  }

  // 🔒 VERIFICAR UNICIDADE DA RECOMPENSA
  if (reward.uniqueId && userBattlePass.uniqueRewardsReceived?.includes(reward.uniqueId)) {
    return res.status(409).json({ success: false, message: "Esta recompensa única já foi resgatada" })
  }

  // ✅ APLICAR RECOMPENSA
  await applyAdvancedReward(db, userId, reward)

  // ✅ MARCAR COMO RESGATADO
  const updateData: any = { $push: { [claimedArray]: tier } }
  if (reward.uniqueId) {
    updateData.$push.uniqueRewardsReceived = reward.uniqueId
  }

  await battlePassCollection.updateOne({ userId }, updateData)

  // 📊 CRIAR TRANSAÇÃO AVANÇADA
  const timestamp = new Date()
  const transaction = {
    date: timestamp.toLocaleDateString(),
    time: timestamp.toLocaleTimeString(),
    timestamp: new Date(),
    action: `advanced_battlepass_claim_tier_${tier}`,
    status: "succeeded",
    currency: "battlepass_advanced",
    item: {
      tier,
      reward: getAdvancedRewardDisplayInfo(reward),
      isPremium: data.isPremium,
      uniqueId: reward.uniqueId,
      seasonExclusive: reward.seasonExclusive,
      currentTier: userBattlePass.currentTier, // 🆕 Registrar tier atual
    },
  }

  await db.collection("items").updateOne({ id: userId }, { $push: { transactions: transaction } })

  // 🔔 CRIAR NOTIFICAÇÃO AVANÇADA
  const rewardInfo = getAdvancedRewardDisplayInfo(reward)
  const notification = {
    userId,
    type: "advanced_battlepass_reward",
    title: "🎉 Recompensa Única Resgatada!",
    message: `Você resgatou ${rewardInfo.name} do tier ${tier}! ${reward.seasonExclusive ? "(Exclusivo da temporada)" : ""}`,
    timestamp: new Date(),
    metadata: {
      uniqueId: reward.uniqueId,
      seasonExclusive: reward.seasonExclusive,
      tier,
      currentTier: userBattlePass.currentTier,
    },
  }

  await db.collection("notifications").insertOne(notification)

  console.log(
    `✅ Recompensa resgatada: Usuário ${userId} - Tier ${tier} (${data.isPremium ? "Premium" : "Free"}) - Tier atual: ${userBattlePass.currentTier}`,
  )

  return res.status(200).json({
    success: true,
    reward: rewardInfo,
    uniqueReward: !!reward.uniqueId,
    seasonExclusive: reward.seasonExclusive,
    tier,
    currentTier: userBattlePass.currentTier,
    message: `Recompensa do tier ${tier} resgatada com sucesso!`,
  })
}

// [Resto das funções mantidas iguais...]

async function completeAdvancedMission(db: any, userId: string, missionId: string, res: NextApiResponse) {
  // Verificar se o usuário tem contractmiss ativado
  const reformsCollection = db.collection("reforms")
  const userReforms = await reformsCollection.findOne({ userId })

  if (!userReforms?.contractmiss) {
    return res.status(403).json({
      success: false,
      message: "Você precisa ativar o Contract Miss para completar missões avançadas",
    })
  }

  const battlePassCollection = db.collection("battlepass_advanced")

  const userBattlePass = await battlePassCollection.findOne({ userId })
  if (!userBattlePass) {
    return res.status(404).json({ success: false, message: "Progresso do Battle Pass Avançado não encontrado" })
  }

  const allMissions = [...(userBattlePass.dailyMissions || []), ...(userBattlePass.weeklyMissions || [])]
  const mission = allMissions.find((m) => m.id === missionId)

  if (!mission) {
    return res.status(404).json({ success: false, message: "Missão avançada não encontrada" })
  }

  if (mission.isCompleted) {
    return res.status(400).json({ success: false, message: "Missão já completada" })
  }

  if (new Date() > new Date(mission.expiresAt)) {
    return res.status(400).json({ success: false, message: "Missão expirada" })
  }

  // Marcar missão como completada
  mission.isCompleted = true

  // Adicionar XP usando a função existente
  await addAdvancedXP(db, userId, mission.reward.xp, `mission_${mission.category}`, res)

  // Aplicar recompensas de moeda
  const itemsCollection = db.collection("items")
  if (mission.reward.bits) {
    await itemsCollection.updateOne({ id: userId }, { $inc: { bits: mission.reward.bits } })
  }
  if (mission.reward.coins) {
    await itemsCollection.updateOne({ id: userId }, { $inc: { coins: mission.reward.coins } })
  }
  if (mission.reward.tokens) {
    await itemsCollection.updateOne({ id: userId }, { $inc: { token: mission.reward.tokens } })
  }

  // Atualizar missões no banco
  await battlePassCollection.updateOne(
    { userId },
    {
      $set: {
        dailyMissions: userBattlePass.dailyMissions,
        weeklyMissions: userBattlePass.weeklyMissions,
      },
    },
  )

  // Criar transação avançada
  const timestamp = new Date()
  const transaction = {
    date: timestamp.toLocaleDateString(),
    time: timestamp.toLocaleTimeString(),
    timestamp: new Date(),
    action: `advanced_mission_complete_${mission.type}`,
    status: "succeeded",
    currency: "mission_reward",
    item: {
      missionId: mission.id,
      missionTitle: mission.title,
      category: mission.category,
      xpGained: mission.reward.xp,
      bitsGained: mission.reward.bits || 0,
      coinsGained: mission.reward.coins || 0,
      tokensGained: mission.reward.tokens || 0,
    },
  }

  await itemsCollection.updateOne({ id: userId }, { $push: { transactions: transaction } })

  // Criar notificação avançada
  const notification = {
    userId,
    type: "advanced_mission_completed",
    title: "🎯 Missão Avançada Completada!",
    message: `Você completou "${mission.title}" e ganhou ${mission.reward.xp} XP!`,
    timestamp: new Date(),
    metadata: {
      missionType: mission.type,
      category: mission.category,
      rewards: mission.reward,
    },
  }

  await db.collection("notifications").insertOne(notification)

  return res.status(200).json({
    success: true,
    mission,
    rewards: mission.reward,
    message: `Missão "${mission.title}" completada com sucesso!`,
  })
}

async function addAdvancedXP(db: any, userId: string, amount: number, source: string, res: NextApiResponse) {
  const battlePassCollection = db.collection("battlepass_advanced")

  const userBattlePass = await battlePassCollection.findOne({ userId })
  if (!userBattlePass) {
    return res.status(404).json({ success: false, message: "Progresso do Battle Pass Avançado não encontrado" })
  }

  const newTotalXP = userBattlePass.totalXP + amount
  const newTier = calculateTierFromAdvancedXP(newTotalXP)

  // Calcular currentXP corretamente
  const currentXP = newTotalXP - getTotalXPForAdvancedTier(newTier - 1)

  await battlePassCollection.updateOne(
    { userId },
    {
      $set: {
        totalXP: newTotalXP,
        currentTier: newTier,
        currentXP: currentXP,
      },
    },
  )

  // Notificação de tier up
  if (newTier > userBattlePass.currentTier) {
    const notification = {
      userId,
      type: "advanced_battlepass_tier_up",
      title: "🆙 Novo Tier Avançado Desbloqueado!",
      message: `Você alcançou o tier ${newTier} no Battle Pass Avançado! Recompensas únicas disponíveis!`,
      timestamp: new Date(),
      metadata: {
        newTier,
        source,
        xpGained: amount,
      },
    }

    await db.collection("notifications").insertOne(notification)
  }

  return res.status(200).json({ success: true, newTier, newTotalXP, currentXP, source })
}

function calculateTierFromAdvancedXP(totalXP: number): number {
  let tier = 1
  let accumulatedXP = 0

  while (true) {
    const xpForThisTier = calculateXPForTier(tier)
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
    totalXP += calculateXPForTier(i)
  }
  return totalXP
}

// 💰 FUNÇÃO AVANÇADA: Calcular preço dinâmico do premium
function calculateAdvancedPremiumPrice(
  seasonNumber: number,
  totalPlayers = 0,
): {
  price: number
  originalPrice: number
  discountPercentage: number
} {
  const BASE_PRICE = 4000 // Preço base: 4.000 bits (~R$52,00)

  // Desconto para primeiras temporadas (incentivar adoção)
  let seasonDiscount = 0
  if (seasonNumber <= 3) {
    seasonDiscount = 25 // 25% de desconto nas 3 primeiras temporadas
  } else if (seasonNumber <= 5) {
    seasonDiscount = 15 // 15% de desconto até a 5ª temporada
  }

  // Desconto por popularidade (mais jogadores = menor preço)
  let popularityDiscount = 0
  if (totalPlayers > 1000) {
    popularityDiscount = 10
  } else if (totalPlayers > 500) {
    popularityDiscount = 5
  }

  const totalDiscount = Math.min(seasonDiscount + popularityDiscount, 40) // Máximo 40% desconto
  const finalPrice = Math.floor(BASE_PRICE * (1 - totalDiscount / 100))

  return {
    price: finalPrice,
    originalPrice: BASE_PRICE,
    discountPercentage: totalDiscount,
  }
}

// 💰 FUNÇÃO AVANÇADA: Obter informações de preço do premium
async function getAdvancedPremiumPriceInfo(db: any, userId: string): Promise<PremiumPriceInfo> {
  const itemsCollection = db.collection("items")

  // Buscar bits do usuário
  const userItems = await itemsCollection.findOne({ id: userId })
  const userBits = userItems?.bits || 0

  // Buscar temporada ativa
  const activeSeason = await AdvancedSeasonManager.getActiveSeason()
  if (!activeSeason) {
    throw new Error("Nenhuma temporada avançada ativa encontrada")
  }

  // Buscar estatísticas da temporada
  const seasonStats = await AdvancedSeasonManager.getSeasonStats(activeSeason.seasonId)

  // Calcular preço dinâmico
  const priceInfo = calculateAdvancedPremiumPrice(activeSeason.seasonNumber, seasonStats.totalPlayers)

  const currentPrice = priceInfo.price
  const canAfford = userBits >= currentPrice
  const missingBits = canAfford ? 0 : currentPrice - userBits
  const priceInReais = `R$ ${((currentPrice / 1000) * 13).toFixed(2)}`

  // Salvar preço atual no banco para histórico
  await db.collection("battlepass_pricing_advanced").updateOne(
    { seasonId: activeSeason.seasonId },
    {
      $set: {
        seasonId: activeSeason.seasonId,
        currentPrice,
        originalPrice: priceInfo.originalPrice,
        discountPercentage: priceInfo.discountPercentage,
        lastUpdated: new Date(),
        totalPlayers: seasonStats.totalPlayers,
        algorithmVersion: activeSeason.algorithmVersion,
      },
    },
    { upsert: true },
  )

  return {
    currentPrice,
    userBits,
    canAfford,
    missingBits,
    priceInReais,
    discountPercentage: priceInfo.discountPercentage > 0 ? priceInfo.discountPercentage : undefined,
    originalPrice: priceInfo.discountPercentage > 0 ? priceInfo.originalPrice : undefined,
  }
}

// 🔧 FUNÇÕES AUXILIARES AVANÇADAS

async function applyAdvancedReward(db: any, userId: string, reward: BattlePassReward): Promise<void> {
  const itemsCollection = db.collection("items")
  const inventoryCollection = db.collection("inventory")
  const reformsCollection = db.collection("reforms")

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

    case "store_item":
      if (reward.itemData) {
        await applyStoreItem(db, userId, reward.itemData)
      }
      break

    case "case_item":
      if (reward.itemData) {
        await applyCaseItem(db, userId, reward.itemData, reward.uniqueId)
      }
      break

    case "special":
      // Aplicar recompensa especial
      await applySpecialReward(db, userId, reward)
      break
  }
}

async function applySpecialReward(db: any, userId: string, reward: BattlePassReward): Promise<void> {
  const itemsCollection = db.collection("items")
  const inventoryCollection = db.collection("inventory")

  // Aplicar recompensa especial baseada no tipo
  if (reward.itemData?.name === "Baú Lendário") {
    // Adicionar baú lendário ao inventário
    await inventoryCollection.updateOne(
      { userId },
      { $push: { specialItems: { type: "legendary_chest", uniqueId: reward.uniqueId, receivedAt: new Date() } } },
      { upsert: true },
    )
  } else if (reward.type === "tokens") {
    // Super tokens
    await itemsCollection.updateOne({ id: userId }, { $inc: { token: reward.amount } })
  }
}

async function applyCaseItem(db: any, userId: string, itemData: any, uniqueId?: string): Promise<void> {
  const inventoryCollection = db.collection("inventory")
  const novisionCollection = db.collection("tvl-novision")
  const marketpriceCollection = db.collection("tvl-marketprice")
 
 const rentalDays = 7 // padrão de 7 dias
const now = new Date()
const expiresAt = new Date(now.getTime() + rentalDays * 24 * 60 * 60 * 1000)

  // Gerar UID único para o item
  const clubUID = uniqueId || generateAdvancedTokenID()

  // Adicionar ao inventário do usuário
  await inventoryCollection.updateOne(
    { userId },
    { $push: {  mytvls: {
          id: itemData.id,
          uid: uniqueId || generateAdvancedTokenID(),
          paymentStatus: "paid",
          rented: true,
          expiresAt,
          isActive: true,
          used: false,
          source: "battlepass_advanced",
        }, } },
    { upsert: true },
  )

  // Calcular valor do item
  const itemValue = await calculateItemValue(itemData, [])

  // Registrar na coleção tvl-novision
  await novisionCollection.insertOne({
    userId,
    id: itemData.id,
    tokenID: clubUID,
    createdAt: new Date(),
    editionNumber: false,
    totalEditions: 1,
    type: "Advanced Battle Pass Reward",
    itemValue,
    itemCondition: "NOVO",
    previousOwners: [],
    seasonExclusive: true,
  })

  // Atualizar histórico de preços
  await marketpriceCollection.updateOne(
    { id: itemData.id },
    { $push: { valueHistory: { newValue: itemValue, timestamp: new Date() } } },
    { upsert: true },
  )
}
 
function generateAdvancedTokenID(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let tokenID = "rl_"  
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    tokenID += characters.charAt(randomIndex)
  }
  return tokenID
}

function getAdvancedRewardDisplayInfo(reward: BattlePassReward): any {
  const baseInfo = {
    name: "",
    description: "",
    rarity: reward.rarity,
    image: reward.image || "",
    category: reward.category || "",
    uniqueId: reward.uniqueId,
    seasonExclusive: reward.seasonExclusive,
  }

  switch (reward.type) {
    case "bits":
      return {
        ...baseInfo,
        icon: "�",
        name: `${reward.amount} Bits`,
        description: "Moeda premium da plataforma (valores balanceados)",
      }

    case "coins":
      return {
        ...baseInfo,
        icon: "🪙",
        name: `${reward.amount} ORBs`,
        description: "Moeda principal da plataforma (valores balanceados)",
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

async function buyPremium(db: any, userId: string, res: NextApiResponse) {
  const battlePassCollection = db.collection("battlepass_advanced")
  const itemsCollection = db.collection("items")

  try {
    // Obter preço atual avançado
    const priceInfo = await getAdvancedPremiumPriceInfo(db, userId)

    if (!priceInfo.canAfford) {
      return res.status(400).json({
        success: false,
        message: `Bits insuficientes. Você precisa de mais ${priceInfo.missingBits} bits.`,
        priceInfo,
      })
    }

    // Verificar se já é premium
    const userBattlePass = await battlePassCollection.findOne({ userId })
    if (userBattlePass?.isPremium) {
      return res.status(400).json({
        success: false,
        message: "Você já possui o Battle Pass Premium Avançado desta temporada!",
      })
    }

    const PREMIUM_COST = priceInfo.currentPrice

    // Debitar bits e ativar premium
    await itemsCollection.updateOne({ id: userId }, { $inc: { bits: -PREMIUM_COST } })
    await battlePassCollection.updateOne({ userId }, { $set: { isPremium: true } })

    // Criar transação avançada
    const timestamp = new Date()
    const transaction = {
      date: timestamp.toLocaleDateString(),
      time: timestamp.toLocaleTimeString(),
      timestamp: new Date(),
      amount: PREMIUM_COST,
      action: "purchase_advanced_battlepass_premium",
      status: "succeeded",
      currency: "bits",
      metadata: {
        originalPrice: priceInfo.originalPrice,
        discountPercentage: priceInfo.discountPercentage,
        priceInReais: priceInfo.priceInReais,
        algorithmVersion: "v3.0.0-jackpot-simplified",
      },
    }

    await itemsCollection.updateOne({ id: userId }, { $push: { transactions: transaction } })

    // Criar notificação de sucesso avançada
    const notification = {
      userId,
      type: "advanced_battlepass_premium_purchased",
      title: "🚀 Battle Pass Premium Avançado Ativado!",
      message: `Parabéns! Você agora tem acesso a todas as recompensas premium únicas por ${priceInfo.priceInReais}!`,
      timestamp: new Date(),
      metadata: {
        algorithmVersion: "v3.0.0-jackpot-simplified",
        uniqueItemsGuarantee: true,
        jackpotChance: "2%",
      },
    }

    await db.collection("notifications").insertOne(notification)

    return res.status(200).json({
      success: true,
      message: "Premium Avançado ativado com sucesso!",
      priceInfo: {
        paidAmount: PREMIUM_COST,
        priceInReais: priceInfo.priceInReais,
        discountApplied: priceInfo.discountPercentage,
      },
    })
  } catch (error) {
    console.error("Erro ao comprar premium avançado:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

async function addXP(db: any, userId: string, amount: number, source: string, res: NextApiResponse) {
  return await addAdvancedXP(db, userId, amount, source, res)
}

async function getSeasonStatistics(db: any, res: NextApiResponse) {
  const activeSeason = await AdvancedSeasonManager.getActiveSeason()
  if (!activeSeason) {
    return res.status(404).json({ success: false, message: "Nenhuma temporada ativa" })
  }

  const stats = await AdvancedSeasonManager.getSeasonStats(activeSeason.seasonId)

  return res.status(200).json({
    success: true,
    statistics: {
      ...stats,
      seasonInfo: activeSeason.statistics,
      algorithmVersion: activeSeason.algorithmVersion,
    },
  })
}

// Funções auxiliares (mantidas do sistema original)
async function getPremiumPriceInfo(db: any, userId: string) {
  // Implementação mantida do sistema original
  return {
    currentPrice: 4000,
    userBits: 0,
    canAfford: false,
    missingBits: 4000,
    priceInReais: "R$ 52,00",
  }
}

async function calculateItemValue(item: any, previousOwners: string[]): Promise<number> {
  // Implementação mantida do sistema original
  return item.priceitem || 1000
}

async function applyStoreItem(db: any, userId: string, itemData: any): Promise<void> {
  const inventoryCollection = db.collection("inventory")
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 dias

  if (rentables.includes(itemData.receive)) {
    // Adiciona como aluguel temporário
    await inventoryCollection.updateOne(
      { userId },
      {
        $push: {
          rentedItems: {
            itemId: itemData.receive,
            acquiredAt: now,
            expiresAt,
            isActive: true,
            used: false,
            source: "battlepass_advanced",
          },
        },
      },
      { upsert: true },
    )
  } else {
    // Item permanente (comportamento antigo)
    await inventoryCollection.updateOne(
      { userId },
      { $inc: { [itemData.receive]: 1 } },
      { upsert: true },
    )
  }
}

 
async function syncClubActivity(db: any, userId: string, res: NextApiResponse) {
  try {
    const activeSeason = await AdvancedSeasonManager.getActiveSeason()
    if (!activeSeason) {
      return res.status(404).json({ success: false, message: "Nenhuma temporada ativa" })
    }

    const result = await ClubActivityManager.syncActivityWithBattlePass(userId, activeSeason.seasonId)

    return res.status(200).json({
      success: result.success,
      data: result,
      message: result.success
        ? `Atividade sincronizada! +${result.xpAdded} XP, Tier ${result.newTier}`
        : "Nenhuma nova atividade para sincronizar",
    })
  } catch (error) {
    console.error("Erro ao sincronizar atividade:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

async function getActivityPreview(db: any, userId: string, clubActivity: number, res: NextApiResponse) {
  try {
    const preview = ClubActivityManager.getActivityConversionPreview(clubActivity)

    return res.status(200).json({
      success: true,
      preview,
      message: `${clubActivity} atividade = ${preview.xpGained} XP (${preview.levelsGained} níveis)`,
    })
  } catch (error) {
    console.error("Erro ao obter preview de atividade:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

async function getClubActivityStatistics(db: any, res: NextApiResponse) {
  try {
    const stats = await ClubActivityManager.getActivityStatistics()

    return res.status(200).json({
      success: true,
      statistics: stats,
    })
  } catch (error) {
    console.error("Erro ao obter estatísticas de atividade:", error)
    return res.status(500).json({ success: false, message: "Erro interno do servidor" })
  }
}

const AdvancedBattlePassAPI: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await checkAuth(req, res)
}

export default withSession(AdvancedBattlePassAPI)

function calculateXPForTier(tier: number): number {
  // Implementação da função de cálculo de XP (pode ser ajustada)
  return 100 + (tier - 1) * 50 // Exemplo: 100 no tier 1, 150 no tier 2, etc.
}