import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { NextIronHandler, withSession } from "@/lib/session"
import type { Session } from "next-iron-session"
import type { NextApiHandler } from "next"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

// Configurações do sistema de V-points
const VPOINTS_CONFIG = {
  PREMIUM_PLUS_MULTIPLIER: 2,
  ACTIVITIES_THRESHOLD: 1000,
  ACTIVITIES_POINTS: 10,
  BITS_CREDITS_COST: 500,
  ORBIT_CREDITS_COST: 500,
  COMBO_COST: 1000,
  BITS_CREDITS_AMOUNT: 100000,
  ORBIT_CREDITS_AMOUNT: 400000,
  MAX_QUANTITY_PER_REDEEM: 10,
}

interface VPointsTransaction {
  id: string
  type: "earn" | "redeem"
  amount: number
  description: string
  rewardType?: string
  quantity?: number
  timestamp: Date
  status: "completed" | "pending" | "failed"
}

const vPointsHandler: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  const sessionUser = req.session?.get("user")

  if (!req.session || !sessionUser) {
    return res.status(401).json({ isAuthenticated: false, message: "Usuário não autenticado." })
  }

  const { db } = await dbConnect()
  const itemsCollection = db.collection("items")
  const notificationsCollection = db.collection("notifications")
  const transactionsCollection = db.collection("vpoints_transactions")

  const userId = sessionUser.id

  try {
    if (req.method === "GET") {
      // Buscar dados do usuário
      const user = await itemsCollection.findOne({ _id: userId })
      const memberStats = await db.collection("member-stats").findOne({ member_id: userId })

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" })
      }

      if (!memberStats) {
        return res.status(404).json({ message: "Estatísticas do membro não encontradas" })
      }

      // Buscar histórico de transações (últimas 50)
      const transactions = await transactionsCollection.find({ userId }).sort({ timestamp: -1 }).limit(50).toArray()

      const currentVPoints = user.vpoints || 0
      const activities = memberStats.clubactivity || 0
      const isPremiumPlus = user.premiumplus || false

      // Calcular estatísticas do mês atual
      const currentMonth = new Date()
      currentMonth.setDate(1)
      currentMonth.setHours(0, 0, 0, 0)

      const monthlyEarnings = await transactionsCollection
        .aggregate([
          {
            $match: {
              userId,
              type: "earn",
              timestamp: { $gte: currentMonth },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ])
        .toArray()

      const monthlyPointsEarned = monthlyEarnings[0]?.total || 0

      return res.status(200).json({
        vpoints: currentVPoints,
        activities,
        isPremiumPlus,
        monthlyPointsEarned,
        availableRewards: {
          bitsCredits: {
            cost: VPOINTS_CONFIG.BITS_CREDITS_COST,
            amount: VPOINTS_CONFIG.BITS_CREDITS_AMOUNT,
            available: currentVPoints >= VPOINTS_CONFIG.BITS_CREDITS_COST,
          },
          orbitCredits: {
            cost: VPOINTS_CONFIG.ORBIT_CREDITS_COST,
            amount: VPOINTS_CONFIG.ORBIT_CREDITS_AMOUNT,
            available: currentVPoints >= VPOINTS_CONFIG.ORBIT_CREDITS_COST,
          },
          combo: {
            cost: VPOINTS_CONFIG.COMBO_COST,
            bitsAmount: VPOINTS_CONFIG.BITS_CREDITS_AMOUNT,
            orbitAmount: VPOINTS_CONFIG.ORBIT_CREDITS_AMOUNT,
            available: currentVPoints >= VPOINTS_CONFIG.COMBO_COST,
          },
        },
        transactions: transactions.map((t) => ({
          id: t._id,
          type: t.type,
          amount: t.amount,
          description: t.description,
          rewardType: t.rewardType,
          quantity: t.quantity,
          timestamp: t.timestamp,
          status: t.status,
        })),
        stats: {
          totalEarned: await transactionsCollection.countDocuments({ userId, type: "earn" }),
          totalRedeemed: await transactionsCollection.countDocuments({ userId, type: "redeem" }),
          currentStreak: await calculateActivityStreak(userId, db),
        },
      })
    }

    if (req.method === "POST") {
      const { action, rewardType, quantity = 1 } = req.body

      if (action === "redeem") {
        // Validar quantidade
        if (quantity < 1 || quantity > VPOINTS_CONFIG.MAX_QUANTITY_PER_REDEEM) {
          return res.status(400).json({
            message: `Quantidade deve estar entre 1 e ${VPOINTS_CONFIG.MAX_QUANTITY_PER_REDEEM}`,
          })
        }

        const user = await itemsCollection.findOne({ _id: userId })

        if (!user) {
          return res.status(404).json({ message: "Usuário não encontrado" })
        }

        const currentVPoints = user.vpoints || 0
        let updateQuery: any = {}
        let notificationMessage = ""
        let pointsCostPerUnit = 0
        let description = ""

        // Calcular custos baseado no tipo de recompensa
        switch (rewardType) {
          case "bits":
            pointsCostPerUnit = VPOINTS_CONFIG.BITS_CREDITS_COST
            const totalBitsCredits = VPOINTS_CONFIG.BITS_CREDITS_AMOUNT * quantity
            updateQuery = {
              $inc: {
                vpoints: -(pointsCostPerUnit * quantity),
                bitsCredits: totalBitsCredits,
              },
            }
            description = `${quantity}x Bits Credits (${totalBitsCredits.toLocaleString()})`
            notificationMessage = `Você resgatou ${totalBitsCredits.toLocaleString()} Bits Credits por ${pointsCostPerUnit * quantity} V-points!`
            break

          case "orbit":
            pointsCostPerUnit = VPOINTS_CONFIG.ORBIT_CREDITS_COST
            const totalOrbitCredits = VPOINTS_CONFIG.ORBIT_CREDITS_AMOUNT * quantity
            updateQuery = {
              $inc: {
                vpoints: -(pointsCostPerUnit * quantity),
                orbitCredits: totalOrbitCredits,
              },
            }
            description = `${quantity}x Orbit Credits (${totalOrbitCredits.toLocaleString()})`
            notificationMessage = `Você resgatou ${totalOrbitCredits.toLocaleString()} Orbit Credits por ${pointsCostPerUnit * quantity} V-points!`
            break

          case "combo":
            pointsCostPerUnit = VPOINTS_CONFIG.COMBO_COST
            const totalBitsCombo = VPOINTS_CONFIG.BITS_CREDITS_AMOUNT * quantity
            const totalOrbitCombo = VPOINTS_CONFIG.ORBIT_CREDITS_AMOUNT * quantity
            updateQuery = {
              $inc: {
                vpoints: -(pointsCostPerUnit * quantity),
                bitsCredits: totalBitsCombo,
                orbitCredits: totalOrbitCombo,
              },
            }
            description = `${quantity}x Combo Premium (${totalBitsCombo.toLocaleString()} Bits + ${totalOrbitCombo.toLocaleString()} Orbit)`
            notificationMessage = `Você resgatou ${quantity}x Combo: ${totalBitsCombo.toLocaleString()} Bits Credits + ${totalOrbitCombo.toLocaleString()} Orbit Credits por ${pointsCostPerUnit * quantity} V-points!`
            break

          default:
            return res.status(400).json({ message: "Tipo de recompensa inválido" })
        }

        const totalCost = pointsCostPerUnit * quantity

        // Verificar se tem pontos suficientes
        if (currentVPoints < totalCost) {
          return res.status(400).json({
            message: "V-points insuficientes",
            required: totalCost,
            available: currentVPoints,
            missing: totalCost - currentVPoints,
          })
        }

        // Criar transação
        const transactionId = new Date().getTime().toString()
        const transaction: VPointsTransaction = {
          id: transactionId,
          type: "redeem",
          amount: totalCost,
          description,
          rewardType,
          quantity,
          timestamp: new Date(),
          status: "completed",
        }

        // Executar transação
        await Promise.all([
          itemsCollection.updateOne({ _id: userId }, updateQuery),
          transactionsCollection.insertOne({ ...transaction, userId }),
          notificationsCollection.insertOne({
            userId: userId,
            type: "vpoints_redeem",
            title: "Resgate de V-points",
            message: notificationMessage,
            timestamp: new Date(),
            read: false,
          }),
        ])

        // Verificar se deve criar novos cartões após o resgate
        await checkAndCreateCards(userId, db)

        return res.status(200).json({
          message: "Resgate realizado com sucesso!",
          transaction: {
            id: transactionId,
            pointsUsed: totalCost,
            quantity,
            rewardType,
            remainingPoints: currentVPoints - totalCost,
          },
        })
      }

      if (action === "add_activity_points") {
        // Sistema interno para adicionar pontos por atividade
        const user = await itemsCollection.findOne({ _id: userId })
        const memberStats = await db.collection("member-stats").findOne({ member_id: userId })

        if (!user || !memberStats) {
          return res.status(404).json({ message: "Usuário ou estatísticas não encontrados" })
        }

        const currentActivities = memberStats.clubactivity || 0
        const newActivities = currentActivities + 1
        const isPremiumPlus = user.premiumplus || false

        // Verificar se atingiu o threshold para ganhar pontos
        if (newActivities % VPOINTS_CONFIG.ACTIVITIES_THRESHOLD === 0) {
          const pointsToAdd = isPremiumPlus
            ? VPOINTS_CONFIG.ACTIVITIES_POINTS * VPOINTS_CONFIG.PREMIUM_PLUS_MULTIPLIER
            : VPOINTS_CONFIG.ACTIVITIES_POINTS

          const transactionId = new Date().getTime().toString()
          const transaction: VPointsTransaction = {
            id: transactionId,
            type: "earn",
            amount: pointsToAdd,
            description: `Milestone: ${VPOINTS_CONFIG.ACTIVITIES_THRESHOLD} atividades${isPremiumPlus ? " (Premium 2x)" : ""}`,
            timestamp: new Date(),
            status: "completed",
          }

          await Promise.all([
            db.collection("member-stats").updateOne({ member_id: userId }, { $inc: { clubactivity: 1 } }),
            itemsCollection.updateOne({ _id: userId }, { $inc: { vpoints: pointsToAdd } }),
            transactionsCollection.insertOne({ ...transaction, userId }),
            notificationsCollection.insertOne({
              userId: userId,
              type: "vpoints_earned",
              title: "V-points Ganhos!",
              message: `Você ganhou ${pointsToAdd} V-points por completar ${VPOINTS_CONFIG.ACTIVITIES_THRESHOLD} atividades!${isPremiumPlus ? " (Bônus Premium aplicado)" : ""}`,
              timestamp: new Date(),
              read: false,
            }),
          ])

          return res.status(200).json({
            message: "Pontos adicionados por atividade!",
            pointsEarned: pointsToAdd,
            totalActivities: newActivities,
            isPremiumBonus: isPremiumPlus,
          })
        } else {
          await db.collection("member-stats").updateOne({ member_id: userId }, { $inc: { clubactivity: 1 } })

          return res.status(200).json({
            message: "Atividade registrada",
            totalActivities: newActivities,
            nextReward: VPOINTS_CONFIG.ACTIVITIES_THRESHOLD - (newActivities % VPOINTS_CONFIG.ACTIVITIES_THRESHOLD),
          })
        }
      }

      if (action === "daily_bonus") {
        // Sistema de bônus diário
        const user = await itemsCollection.findOne({ _id: userId })
        if (!user) {
          return res.status(404).json({ message: "Usuário não encontrado" })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const lastDailyBonus = user.lastDailyBonus ? new Date(user.lastDailyBonus) : null

        if (lastDailyBonus && lastDailyBonus >= today) {
          return res.status(400).json({ message: "Bônus diário já coletado hoje" })
        }

        const isPremiumPlus = user.premiumplus || false
        const bonusPoints = isPremiumPlus ? 20 : 10

        const transactionId = new Date().getTime().toString()
        const transaction: VPointsTransaction = {
          id: transactionId,
          type: "earn",
          amount: bonusPoints,
          description: `Bônus diário${isPremiumPlus ? " (Premium 2x)" : ""}`,
          timestamp: new Date(),
          status: "completed",
        }

        await Promise.all([
          itemsCollection.updateOne(
            { _id: userId },
            {
              $inc: { vpoints: bonusPoints },
              $set: { lastDailyBonus: new Date() },
            },
          ),
          transactionsCollection.insertOne({ ...transaction, userId }),
        ])

        return res.status(200).json({
          message: "Bônus diário coletado!",
          pointsEarned: bonusPoints,
          isPremiumBonus: isPremiumPlus,
        })
      }
    }

    res.setHeader("Allow", ["GET", "POST"])
    return res.status(405).end(`Método ${req.method} não permitido`)
  } catch (error) {
    console.error("Erro na API de V-points:", error)
    return res.status(500).json({ message: "Erro interno do servidor" })
  }
}

// Função auxiliar para calcular streak de atividades
async function calculateActivityStreak(userId: string, db: any): Promise<number> {
  const transactions = await db
    .collection("vpoints_transactions")
    .find({
      userId,
      type: "earn",
      description: { $regex: /atividades/ },
    })
    .sort({ timestamp: -1 })
    .limit(30)
    .toArray()

  let streak = 0
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const transaction of transactions) {
    const transactionDate = new Date(transaction.timestamp)
    transactionDate.setHours(0, 0, 0, 0)

    const diffDays = Math.floor((currentDate.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === streak) {
      streak++
    } else {
      break
    }
  }

  return streak
}

// Função auxiliar para verificar e criar cartões após resgates
async function checkAndCreateCards(userId: string, db: any) {
  const user = await db.collection("items").findOne({ _id: userId })
  const userinfo = await db.collection("reforms").findOne({ userId })
  const stats = await db.collection("member-stats").findOne({ member_id: userId })

  if (!user || !userinfo || !stats) return

  const existingCards = user.visioncard || []
  const existingTypes = existingCards.map((card: any) => card.type)
  const createdCards: any[] = []

  const fullName = `${userinfo.firstname || "Usuário"} ${userinfo.lastname || ""}`.trim()

  // Verificar se deve criar novos cartões baseado nos créditos
  const totalBitsCredits = user.bitsCredits || 0
  const totalOrbitCredits = user.orbitCredits || 0

  if (totalBitsCredits >= 500000 && !existingTypes.includes("Sapphire")) {
    createdCards.push({
      type: "Sapphire",
      cardNumber: generateCardNumber(),
      cardHolder: fullName,
      expiry: "Bits",
      cvv: generateCVV(),
    })
  }

  if (totalOrbitCredits >= 1000000 && stats.level >= 40 && !existingTypes.includes("VΛULT")) {
    createdCards.push({
      type: "VΛULT",
      cardNumber: generateCardNumber(),
      cardHolder: fullName,
      expiry: "Bits & Coins",
      cvv: generateCVV(),
      limit: "Unlimited",
    })
  }

  if (createdCards.length > 0) {
    await db.collection("items").updateOne({ _id: userId }, { $push: { visioncard: { $each: createdCards } } })
  }
}

// Funções auxiliares para geração de cartões
function generateCardNumber(): string {
  const prefix = "4532"
  let number = prefix
  for (let i = 0; i < 12; i++) {
    number += Math.floor(Math.random() * 10)
  }
  return number.match(/.{1,4}/g)?.join(" ") || number
}

function generateCVV(): string {
  return Math.floor(Math.random() * 900 + 100).toString()
}

 
const Vpoints: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  // Use o await para chamar a função original checkAuth
  await vPointsHandler(req, res);
};

export default withSession(Vpoints);
 