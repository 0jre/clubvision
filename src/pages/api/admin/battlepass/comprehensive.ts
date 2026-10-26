import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { NextApiRequest, NextApiResponse } from "next"
import type { Session } from "next-iron-session"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

const checkAdminAuth = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  const sessionUser = req.session?.get("user")

  if (!req.session || !sessionUser) {
    return res.status(401).json({ success: false, message: "Usuário não autenticado." })
  }

  const { db } = await dbConnect()
  const usersCollection = db.collection("users")
  const userRecord = await usersCollection.findOne({ id: sessionUser.id })

  if (userRecord?.type !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Acesso negado. Apenas administradores." })
  }

  if (req.method === "GET") {
    try {
      const { type, page = 1, limit = 50, search = "", dateFrom, dateTo, filter } = req.query

      const skip = (Number(page) - 1) * Number(limit)

      // Coleções principais
      const battlePassCollection = db.collection("battlepass")
      const seasonsCollection = db.collection("battlepass_seasons")
      const itemsCollection = db.collection("items")
      const modLogsCollection = db.collection("mod-logs")
      const reformsCollection = db.collection("reforms")
      const inventoryCollection = db.collection("inventory")
      const novisionCollection = db.collection("tvl-novision")

      switch (type) {
        case "transactions":
          // Auditoria de transações
          const transactionsPipeline = [
            { $unwind: "$transactions" },
            {
              $match: {
                ...(search && {
                  $or: [
                    { id: { $regex: search, $options: "i" } },
                    { "transactions.action": { $regex: search, $options: "i" } },
                  ],
                }),
                ...(dateFrom && {
                  "transactions.timestamp": {
                    $gte: new Date(dateFrom as string),
                    ...(dateTo && { $lte: new Date(dateTo as string) }),
                  },
                }),
                ...(filter && filter !== "all" && { "transactions.action": { $regex: filter, $options: "i" } }),
              },
            },
            { $sort: { "transactions.timestamp": -1 } },
            { $skip: skip },
            { $limit: Number(limit) },
            {
              $project: {
                userId: "$id",
                transaction: "$transactions",
                userInfo: {
                  bits: "$bits",
                  coins: "$coins",
                  tokens: "$token",
                },
              },
            },
          ]

          const transactions = await itemsCollection.aggregate(transactionsPipeline).toArray()

          const transactionStats = await itemsCollection
            .aggregate([
              { $unwind: "$transactions" },
              {
                $group: {
                  _id: "$transactions.action",
                  count: { $sum: 1 },
                  totalAmount: { $sum: "$transactions.amount" },
                  avgAmount: { $avg: "$transactions.amount" },
                },
              },
              { $sort: { count: -1 } },
            ])
            .toArray()

          return res.status(200).json({
            success: true,
            data: {
              items: transactions,
              stats: transactionStats,
              pagination: {
                page: Number(page),
                limit: Number(limit),
                total: transactions.length,
              },
            },
          })

        case "battlepass_activity":
          // Auditoria de atividade do Battle Pass
          const activeSeason = await seasonsCollection.findOne({ isActive: true })

          const battlePassActivity = await battlePassCollection
            .aggregate([
              {
                $match: {
                  ...(activeSeason && { seasonId: activeSeason.seasonId }),
                  ...(search && { userId: { $regex: search, $options: "i" } }),
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "userId",
                  foreignField: "id",
                  as: "userInfo",
                },
              },
              {
                $lookup: {
                  from: "items",
                  localField: "userId",
                  foreignField: "id",
                  as: "userResources",
                },
              },
              { $sort: { lastActivity: -1 } },
              { $skip: skip },
              { $limit: Number(limit) },
            ])
            .toArray()

          const tierDistribution = await battlePassCollection
            .aggregate([
              { $match: { seasonId: activeSeason?.seasonId } },
              {
                $bucket: {
                  groupBy: "$currentTier",
                  boundaries: [0, 10, 25, 50, 75, 100],
                  default: "100+",
                  output: {
                    count: { $sum: 1 },
                    avgXP: { $avg: "$totalXP" },
                  },
                },
              },
            ])
            .toArray()

          return res.status(200).json({
            success: true,
            data: {
              items: battlePassActivity,
              stats: {
                tierDistribution,
                activeSeason,
              },
              pagination: {
                page: Number(page),
                limit: Number(limit),
                total: battlePassActivity.length,
              },
            },
          })

        case "user_behavior":
          // Auditoria de comportamento de usuários
          const userBehavior = await usersCollection
            .aggregate([
              {
                $match: {
                  ...(search && {
                    $or: [{ id: { $regex: search, $options: "i" } }, { username: { $regex: search, $options: "i" } }],
                  }),
                  ...(filter && filter !== "all" && { type: filter }),
                },
              },
              {
                $lookup: {
                  from: "items",
                  localField: "id",
                  foreignField: "id",
                  as: "resources",
                },
              },
              {
                $lookup: {
                  from: "battlepass",
                  localField: "id",
                  foreignField: "userId",
                  as: "battlepass",
                },
              },
              {
                $lookup: {
                  from: "reforms",
                  localField: "id",
                  foreignField: "userId",
                  as: "reforms",
                },
              },
              {
                $lookup: {
                  from: "mod-logs",
                  localField: "id",
                  foreignField: "member_id",
                  as: "moderationHistory",
                },
              },
              { $sort: { _id: -1 } },
              { $skip: skip },
              { $limit: Number(limit) },
            ])
            .toArray()

          const behaviorStats = await usersCollection
            .aggregate([
              {
                $group: {
                  _id: "$type",
                  count: { $sum: 1 },
                },
              },
            ])
            .toArray()

          return res.status(200).json({
            success: true,
            data: {
              items: userBehavior,
              stats: behaviorStats,
              pagination: {
                page: Number(page),
                limit: Number(limit),
                total: userBehavior.length,
              },
            },
          })

        case "system_health":
          // Auditoria de saúde do sistema
          const systemStats = await Promise.all([
            // Estatísticas gerais
            usersCollection.countDocuments(),
            battlePassCollection.countDocuments(),
            itemsCollection.countDocuments(),
            modLogsCollection.countDocuments(),

            // Atividade recente (últimas 24h)
            itemsCollection.countDocuments({
              "transactions.timestamp": { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            }),

            // Usuários premium
            battlePassCollection.countDocuments({ isPremium: true }),

            // Problemas potenciais
            itemsCollection.countDocuments({ banned: true }),
            modLogsCollection.countDocuments({
              created_at: { $gte: Date.now() - 24 * 60 * 60 * 1000 },
            }),
          ])

          const [
            totalUsers,
            totalBattlePassUsers,
            totalItems,
            totalModLogs,
            recentTransactions,
            premiumUsers,
            bannedUsers,
            recentModActions,
          ] = systemStats

          // Distribuição de recursos
          const resourceDistribution = await itemsCollection
            .aggregate([
              {
                $group: {
                  _id: null,
                  totalBits: { $sum: "$bits" },
                  totalCoins: { $sum: "$coins" },
                  totalTokens: { $sum: "$token" },
                  avgBits: { $avg: "$bits" },
                  avgCoins: { $avg: "$coins" },
                  avgTokens: { $avg: "$token" },
                },
              },
            ])
            .toArray()

          return res.status(200).json({
            success: true,
            data: {
              systemHealth: {
                totalUsers,
                totalBattlePassUsers,
                totalItems,
                totalModLogs,
                recentTransactions,
                premiumUsers,
                bannedUsers,
                recentModActions,
                resourceDistribution: resourceDistribution[0] || {},
              },
              uptime: process.uptime(),
              timestamp: new Date(),
            },
          })

        case "revenue_analysis":
          // Análise de receita
          const revenueData = await itemsCollection
            .aggregate([
              { $unwind: "$transactions" },
              {
                $match: {
                  "transactions.action": { $in: ["purchase_battlepass_premium", "buy_tokens", "buy_items"] },
                  ...(dateFrom && {
                    "transactions.timestamp": {
                      $gte: new Date(dateFrom as string),
                      ...(dateTo && { $lte: new Date(dateTo as string) }),
                    },
                  }),
                },
              },
              {
                $group: {
                  _id: {
                    action: "$transactions.action",
                    date: {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$transactions.timestamp",
                      },
                    },
                  },
                  totalAmount: { $sum: "$transactions.amount" },
                  count: { $sum: 1 },
                  avgAmount: { $avg: "$transactions.amount" },
                },
              },
              { $sort: { "_id.date": -1 } },
            ])
            .toArray()

          return res.status(200).json({
            success: true,
            data: {
              items: revenueData,
              pagination: {
                page: Number(page),
                limit: Number(limit),
                total: revenueData.length,
              },
            },
          })

        default:
          return res.status(400).json({ success: false, message: "Tipo de auditoria não especificado" })
      }
    } catch (error) {
      console.error("Erro na auditoria:", error)
      return res.status(500).json({ success: false, message: "Erro interno do servidor" })
    }
  } else {
    return res.status(405).json({ success: false, message: "Método não permitido" })
  }
}

const ComprehensiveAuditAPI: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await checkAdminAuth(req, res)
}

export default withSession(ComprehensiveAuditAPI)
