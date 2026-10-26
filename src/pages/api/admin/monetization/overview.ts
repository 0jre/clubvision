import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { timeframe = "30d" } = req.query
    const { db } = await dbConnect()

    // Calcular data de início baseada no timeframe
    const startDate = new Date()
    switch (timeframe) {
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

    // Estatísticas gerais de monetização
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
            avgBits: { $avg: "$bits" },
            maxRescue: { $max: "$rescue" },
            maxBits: { $max: "$bits" },
          },
        },
      ])
      .toArray()

    // Estatísticas de saques
    const withdrawalStats = await db
      .collection("withdrawalHistory")
      .aggregate([
        {
          $match: {
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
            avgAmount: { $avg: "$amount" },
          },
        },
      ])
      .toArray()

    // Top criadores por ganhos
    const topCreators = await db
      .collection("monetizations")
      .aggregate([
        { $sort: { rescue: -1 } },
        { $limit: 10 },
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
            from: "reforms",
            localField: "userId",
            foreignField: "userId",
            as: "reformInfo",
          },
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$userInfo", 0] },
            reform: { $arrayElemAt: ["$reformInfo", 0] },
          },
        },
      ])
      .toArray()

    // Estatísticas de posts por período
    const postStats = await db
      .collection("postvision")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            totalViews: { $sum: "$views" },
            totalLikes: { $sum: { $size: { $ifNull: ["$likedBy", []] } } },
            totalComments: { $sum: { $size: { $ifNull: ["$comments", []] } } },
            avgViews: { $avg: "$views" },
            avgLikes: { $avg: { $size: { $ifNull: ["$likedBy", []] } } },
          },
        },
      ])
      .toArray()

    // Usuários elegíveis para saque
    const eligibleUsers = await db
      .collection("reforms")
      .aggregate([
        {
          $match: {
            type: "Authorized",
            prime: true,
            verified: true,
            unverifid: { $ne: true },
          },
        },
        {
          $lookup: {
            from: "member-stats",
            localField: "userId",
            foreignField: "member_id",
            as: "memberStats",
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
            from: "monetizations",
            localField: "userId",
            foreignField: "userId",
            as: "monetization",
          },
        },
        {
          $addFields: {
            memberStat: { $arrayElemAt: ["$memberStats", 0] },
            user: { $arrayElemAt: ["$userInfo", 0] },
            monetizationData: { $arrayElemAt: ["$monetizations", 0] },
          },
        },
        {
          $match: {
            "memberStat.level": { $gte: 10 },
            "memberStat.clubactivity": { $gte: 1000 },
          },
        },
        { $count: "total" },
      ])
      .toArray()

    // Saques por dia
    const dailyWithdrawals = await db
      .collection("withdrawalHistory")
      .aggregate([
        {
          $match: {
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$timestamp" },
              month: { $month: "$timestamp" },
              day: { $dayOfMonth: "$timestamp" },
            },
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
            avgAmount: { $avg: "$amount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ])
      .toArray()

    // Distribuição de ganhos
    const earningsDistribution = await db
      .collection("monetizations")
      .aggregate([
        {
          $bucket: {
            groupBy: "$rescue",
            boundaries: [0, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
            default: "1000000+",
            output: {
              count: { $sum: 1 },
              totalRescue: { $sum: "$rescue" },
              avgRescue: { $avg: "$rescue" },
            },
          },
        },
      ])
      .toArray()

    res.status(200).json({
      timeframe,
      overview: {
        totalCreators: monetizationStats[0]?.totalCreators || 0,
        totalRescue: monetizationStats[0]?.totalRescue || 0,
        totalBits: monetizationStats[0]?.totalBits || 0,
        avgRescue: monetizationStats[0]?.avgRescue || 0,
        avgBits: monetizationStats[0]?.avgBits || 0,
        eligibleUsers: eligibleUsers[0]?.total || 0,
        totalPosts: postStats[0]?.totalPosts || 0,
        totalViews: postStats[0]?.totalViews || 0,
        totalEngagement: (postStats[0]?.totalLikes || 0) + (postStats[0]?.totalComments || 0),
      },
      withdrawalStats,
      topCreators: topCreators.map((creator) => ({
        userId: creator.userId,
        user: creator.user,
        rescue: creator.rescue,
        bits: creator.bits,
        isPrime: creator.reform?.prime || false,
        isVerified: creator.reform?.verified || false,
        level: creator.memberStat?.level || 0,
      })),
      dailyWithdrawals: dailyWithdrawals.map((day) => ({
        date: `${day._id.year}-${String(day._id.month).padStart(2, "0")}-${String(day._id.day).padStart(2, "0")}`,
        count: day.count,
        totalAmount: day.totalAmount,
        avgAmount: day.avgAmount,
      })),
      earningsDistribution,
      postMetrics: postStats[0] || {},
    })
  } catch (error) {
    console.error("Error fetching monetization overview:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
