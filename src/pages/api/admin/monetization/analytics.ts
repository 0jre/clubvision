import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { period = "30d", metric = "earnings" } = req.query
    const { db } = await dbConnect()

    // Calcular período
    const endDate = new Date()
    const startDate = new Date()

    switch (period) {
      case "24h":
        startDate.setHours(startDate.getHours() - 24)
        break
      case "7d":
        startDate.setDate(startDate.getDate() - 7)
        break
      case "30d":
        startDate.setDate(startDate.getDate() - 30)
        break
      case "90d":
        startDate.setDate(startDate.getDate() - 90)
        break
      default:
        startDate.setDate(startDate.getDate() - 30)
    }

    // Analytics de ganhos por dia
    const earningsAnalytics = await db
      .collection("postvision")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            totalPosts: { $sum: 1 },
            totalViews: { $sum: "$views" },
            totalLikes: { $sum: { $size: { $ifNull: ["$likedBy", []] } } },
            totalComments: { $sum: { $size: { $ifNull: ["$comments", []] } } },
            avgViews: { $avg: "$views" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ])
      .toArray()

    // Analytics de saques por dia
    const withdrawalAnalytics = await db
      .collection("withdrawalHistory")
      .aggregate([
        {
          $match: {
            timestamp: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$timestamp" },
              month: { $month: "$timestamp" },
              day: { $dayOfMonth: "$timestamp" },
              status: "$status",
            },
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $group: {
            _id: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
            total: { $sum: "$count" },
            totalAmount: { $sum: "$totalAmount" },
            completed: {
              $sum: {
                $cond: [{ $eq: ["$_id.status", "Concluído"] }, "$count", 0],
              },
            },
            pending: {
              $sum: {
                $cond: [{ $eq: ["$_id.status", "Pendente"] }, "$count", 0],
              },
            },
            failed: {
              $sum: {
                $cond: [{ $eq: ["$_id.status", "Falhou"] }, "$count", 0],
              },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ])
      .toArray()

    // Top criadores por engajamento
    const topCreatorsByEngagement = await db
      .collection("postvision")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalPosts: { $sum: 1 },
            totalViews: { $sum: "$views" },
            totalLikes: { $sum: { $size: { $ifNull: ["$likedBy", []] } } },
            totalComments: { $sum: { $size: { $ifNull: ["$comments", []] } } },
            avgViews: { $avg: "$views" },
          },
        },
        {
          $addFields: {
            engagementScore: {
              $add: [
                { $multiply: ["$totalViews", 0.1] },
                { $multiply: ["$totalLikes", 0.5] },
                { $multiply: ["$totalComments", 0.8] },
              ],
            },
          },
        },
        { $sort: { engagementScore: -1 } },
        { $limit: 20 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "id",
            as: "userInfo",
          },
        },
        {
          $lookup: {
            from: "monetizations",
            localField: "_id",
            foreignField: "userId",
            as: "monetizationInfo",
          },
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$userInfo", 0] },
            monetization: { $arrayElemAt: ["$monetizationInfo", 0] },
          },
        },
      ])
      .toArray()

    // Distribuição de tipos de conteúdo
    const contentTypeDistribution = await db
      .collection("postvision")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
            totalViews: { $sum: "$views" },
            totalLikes: { $sum: { $size: { $ifNull: ["$likedBy", []] } } },
            avgViews: { $avg: "$views" },
            avgLikes: { $avg: { $size: { $ifNull: ["$likedBy", []] } } },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray()

    // Métricas de retenção de criadores
    const creatorRetention = await db
      .collection("postvision")
      .aggregate([
        {
          $group: {
            _id: "$userId",
            firstPost: { $min: "$createdAt" },
            lastPost: { $max: "$createdAt" },
            totalPosts: { $sum: 1 },
          },
        },
        {
          $addFields: {
            daysSinceFirstPost: {
              $divide: [{ $subtract: [new Date(), "$firstPost"] }, 86400000],
            },
            daysSinceLastPost: {
              $divide: [{ $subtract: [new Date(), "$lastPost"] }, 86400000],
            },
            isActive: {
              $lte: [{ $divide: [{ $subtract: [new Date(), "$lastPost"] }, 86400000] }, 7],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalCreators: { $sum: 1 },
            activeCreators: {
              $sum: { $cond: ["$isActive", 1, 0] },
            },
            avgPostsPerCreator: { $avg: "$totalPosts" },
            avgDaysSinceFirstPost: { $avg: "$daysSinceFirstPost" },
          },
        },
      ])
      .toArray()

    // Formatear dados para gráficos
    const formatDateKey = (dateObj: any) => {
      return `${dateObj.year}-${String(dateObj.month).padStart(2, "0")}-${String(dateObj.day).padStart(2, "0")}`
    }

    const earningsData = earningsAnalytics.map((item) => ({
      date: formatDateKey(item._id),
      totalPosts: item.totalPosts,
      totalViews: item.totalViews,
      totalLikes: item.totalLikes,
      totalComments: item.totalComments,
      avgViews: item.avgViews,
      engagementRate: item.totalPosts > 0 ? (item.totalLikes + item.totalComments) / item.totalPosts : 0,
    }))

    const withdrawalData = withdrawalAnalytics.map((item) => ({
      date: formatDateKey(item._id),
      total: item.total,
      totalAmount: item.totalAmount,
      completed: item.completed,
      pending: item.pending,
      failed: item.failed,
      successRate: item.total > 0 ? (item.completed / item.total) * 100 : 0,
    }))

    res.status(200).json({
      period,
      dateRange: {
        start: startDate,
        end: endDate,
      },
      earnings: earningsData,
      withdrawals: withdrawalData,
      topCreators: topCreatorsByEngagement.map((creator) => ({
        userId: creator._id,
        user: creator.user,
        metrics: {
          totalPosts: creator.totalPosts,
          totalViews: creator.totalViews,
          totalLikes: creator.totalLikes,
          totalComments: creator.totalComments,
          engagementScore: creator.engagementScore,
          avgViews: creator.avgViews,
        },
        monetization: {
          rescue: creator.monetization?.rescue || 0,
          bits: creator.monetization?.bits || 0,
        },
      })),
      contentTypes: contentTypeDistribution,
      retention: creatorRetention[0] || {},
      summary: {
        totalEarnings: earningsData.reduce((sum, item) => sum + item.totalViews * 0.1, 0),
        totalWithdrawals: withdrawalData.reduce((sum, item) => sum + item.totalAmount, 0),
        totalPosts: earningsData.reduce((sum, item) => sum + item.totalPosts, 0),
        totalEngagement: earningsData.reduce((sum, item) => sum + item.totalLikes + item.totalComments, 0),
        avgEngagementRate:
          earningsData.length > 0
            ? earningsData.reduce((sum, item) => sum + item.engagementRate, 0) / earningsData.length
            : 0,
        avgWithdrawalSuccessRate:
          withdrawalData.length > 0
            ? withdrawalData.reduce((sum, item) => sum + item.successRate, 0) / withdrawalData.length
            : 0,
      },
    })
  } catch (error) {
    console.error("Error fetching monetization analytics:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
