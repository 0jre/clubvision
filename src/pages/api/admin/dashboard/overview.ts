import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { db } = await dbConnect()
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Estatísticas gerais de usuários
    const userStats = await db
      .collection("users")
      .aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            new24h: [{ $match: { firstLoginDate: { $gte: last24h } } }, { $count: "count" }],
            new7d: [{ $match: { firstLoginDate: { $gte: last7d } } }, { $count: "count" }],
            verified: [
              {
                $lookup: {
                  from: "reforms",
                  localField: "id",
                  foreignField: "userId",
                  as: "reform",
                },
              },
              { $match: { "reform.verified": true } },
              { $count: "count" },
            ],
            prime: [
              {
                $lookup: {
                  from: "reforms",
                  localField: "id",
                  foreignField: "userId",
                  as: "reform",
                },
              },
              { $match: { "reform.prime": true } },
              { $count: "count" },
            ],
          },
        },
      ])
      .toArray()

    // Estatísticas de posts
    const postStats = await db
      .collection("postvision")
      .aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            new24h: [{ $match: { createdAt: { $gte: last24h } } }, { $count: "count" }],
            totalViews: [{ $group: { _id: null, total: { $sum: "$views" } } }],
            totalLikes: [
              {
                $group: {
                  _id: null,
                  total: { $sum: { $size: { $ifNull: ["$likedBy", []] } } },
                },
              },
            ],
          },
        },
      ])
      .toArray()

    // Estatísticas de monetização
    const monetizationStats = await db
      .collection("monetizations")
      .aggregate([
        {
          $group: {
            _id: null,
            totalCreators: { $sum: 1 },
            totalRescue: { $sum: "$rescue" },
            totalBits: { $sum: "$bits" },
            avgRescue: { $avg: "$rescue" },
          },
        },
      ])
      .toArray()

    // Estatísticas de saques
    const withdrawalStats = await db
      .collection("withdrawalHistory")
      .aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            pending: [{ $match: { status: "Pendente" } }, { $count: "count" }],
            completed24h: [
              {
                $match: {
                  status: "Concluído",
                  timestamp: { $gte: last24h },
                },
              },
              { $count: "count" },
            ],
            totalAmount: [{ $group: { _id: null, total: { $sum: "$amount" } } }],
          },
        },
      ])
      .toArray()

    // Estatísticas de economia
    const economyStats = await db
      .collection("items")
      .aggregate([
        {
          $group: {
            _id: null,
            totalCoins: { $sum: "$coins" },
            totalBanking: { $sum: "$banking" },
            totalBits: { $sum: "$bits" },
            avgWealth: {
              $avg: { $add: ["$coins", "$banking", "$bits"] },
            },
          },
        },
      ])
      .toArray()

    // Top usuários por diferentes métricas
    const topUsers = await db
      .collection("users")
      .aggregate([
        {
          $lookup: {
            from: "member-stats",
            localField: "id",
            foreignField: "member_id",
            as: "stats",
          },
        },
        {
          $lookup: {
            from: "items",
            localField: "id",
            foreignField: "id",
            as: "items",
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
          $addFields: {
            stat: { $arrayElemAt: ["$stats", 0] },
            item: { $arrayElemAt: ["$items", 0] },
            reform: { $arrayElemAt: ["$reforms", 0] },
            totalWealth: {
              $add: [
                { $ifNull: [{ $arrayElemAt: ["$items.coins", 0] }, 0] },
                { $ifNull: [{ $arrayElemAt: ["$items.banking", 0] }, 0] },
                { $ifNull: [{ $arrayElemAt: ["$items.bits", 0] }, 0] },
              ],
            },
            followersCount: { $size: { $ifNull: ["$followers", []] } },
          },
        },
        {
          $facet: {
            byLevel: [
              { $sort: { "stat.level": -1 } },
              { $limit: 5 },
              {
                $project: {
                  id: 1,
                  name: 1,
                  avatar: 1,
                  level: "$stat.level",
                  verified: "$reform.verified",
                },
              },
            ],
            byWealth: [
              { $sort: { totalWealth: -1 } },
              { $limit: 5 },
              {
                $project: {
                  id: 1,
                  name: 1,
                  avatar: 1,
                  totalWealth: 1,
                  verified: "$reform.verified",
                },
              },
            ],
            byFollowers: [
              { $sort: { followersCount: -1 } },
              { $limit: 5 },
              {
                $project: {
                  id: 1,
                  name: 1,
                  avatar: 1,
                  followersCount: 1,
                  verified: "$reform.verified",
                },
              },
            ],
          },
        },
      ])
      .toArray()

    // Atividades recentes
    const recentActivities = await db
      .collection("postvision")
      .aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "id",
            as: "user",
          },
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$user", 0] },
          },
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            type: 1,
            views: 1,
            createdAt: 1,
            userName: "$user.name",
            userAvatar: "$user.avatar",
            likesCount: { $size: { $ifNull: ["$likedBy", []] } },
            commentsCount: { $size: { $ifNull: ["$comments", []] } },
          },
        },
      ])
      .toArray()

    // Alertas do sistema
    const alerts = []

    // Verificar saques pendentes
    const pendingWithdrawals = withdrawalStats[0]?.pending?.[0]?.count || 0
    if (pendingWithdrawals > 0) {
      alerts.push({
        type: "warning",
        title: "Saques Pendentes",
        message: `${pendingWithdrawals} saques aguardando aprovação`,
        action: "/admin/monetization?tab=withdrawals",
      })
    }

    // Verificar usuários n��o verificados com alto nível
    const unverifiedHighLevel = await db
      .collection("users")
      .aggregate([
        {
          $lookup: {
            from: "member-stats",
            localField: "id",
            foreignField: "member_id",
            as: "stats",
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
          $match: {
            "stats.level": { $gte: 50 },
            "reforms.verified": { $ne: true },
          },
        },
        { $count: "count" },
      ])
      .toArray()

    if (unverifiedHighLevel[0]?.count > 0) {
      alerts.push({
        type: "info",
        title: "Usuários para Verificação",
        message: `${unverifiedHighLevel[0].count} usuários de alto nível não verificados`,
        action: "/admin/users?filter=high_level_unverified",
      })
    }

    // Verificar atividade suspeita de monetização
    const suspiciousEarnings = await db
      .collection("monetizations")
      .aggregate([
        {
          $match: {
            rescue: { $gte: 100000 }, // Ganhos muito altos
          },
        },
        { $count: "count" },
      ])
      .toArray()

    if (suspiciousEarnings[0]?.count > 0) {
      alerts.push({
        type: "danger",
        title: "Atividade Suspeita",
        message: `${suspiciousEarnings[0].count} usuários com ganhos muito altos`,
        action: "/admin/monetization?filter=high_earners",
      })
    }

    res.status(200).json({
      users: {
        total: userStats[0]?.total?.[0]?.count || 0,
        new24h: userStats[0]?.new24h?.[0]?.count || 0,
        new7d: userStats[0]?.new7d?.[0]?.count || 0,
        verified: userStats[0]?.verified?.[0]?.count || 0,
        prime: userStats[0]?.prime?.[0]?.count || 0,
      },
      posts: {
        total: postStats[0]?.total?.[0]?.count || 0,
        new24h: postStats[0]?.new24h?.[0]?.count || 0,
        totalViews: postStats[0]?.totalViews?.[0]?.total || 0,
        totalLikes: postStats[0]?.totalLikes?.[0]?.total || 0,
      },
      monetization: {
        totalCreators: monetizationStats[0]?.totalCreators || 0,
        totalRescue: monetizationStats[0]?.totalRescue || 0,
        totalBits: monetizationStats[0]?.totalBits || 0,
        avgRescue: monetizationStats[0]?.avgRescue || 0,
      },
      withdrawals: {
        total: withdrawalStats[0]?.total?.[0]?.count || 0,
        pending: withdrawalStats[0]?.pending?.[0]?.count || 0,
        completed24h: withdrawalStats[0]?.completed24h?.[0]?.count || 0,
        totalAmount: withdrawalStats[0]?.totalAmount?.[0]?.total || 0,
      },
      economy: {
        totalCoins: economyStats[0]?.totalCoins || 0,
        totalBanking: economyStats[0]?.totalBanking || 0,
        totalBits: economyStats[0]?.totalBits || 0,
        avgWealth: economyStats[0]?.avgWealth || 0,
      },
      topUsers: topUsers[0] || { byLevel: [], byWealth: [], byFollowers: [] },
      recentActivities,
      alerts,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching dashboard overview:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
