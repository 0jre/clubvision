import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { timeframe = "24h" } = req.query
    const { db } = await dbConnect()

    // Calcular data de início baseada no timeframe
    const startDate = new Date()
    switch (timeframe) {
      case "1h":
        startDate.setHours(startDate.getHours() - 1)
        break
      case "24h":
        startDate.setHours(startDate.getHours() - 24)
        break
      case "7d":
        startDate.setDate(startDate.getDate() - 7)
        break
      case "30d":
        startDate.setDate(startDate.getDate() - 30)
        break
      default:
        startDate.setHours(startDate.getHours() - 24)
    }

    // Estatísticas de checkout
    const checkoutStats = await db
      .collection("checkout-sessions")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount" },
            totalWithFees: { $sum: "$totalWithFees" },
            avgAmount: { $avg: "$totalAmount" },
          },
        },
      ])
      .toArray()

    // Estatísticas de transações
    const transactionStats = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            type: "Concessionaria",
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$totalWithFees" },
            totalItems: { $sum: "$itemCount" },
            avgAmount: { $avg: "$totalWithFees" },
          },
        },
      ])
      .toArray()

    // Checkouts ativos no momento
    const activeCheckouts = await db.collection("checkout-sessions").countDocuments({
      status: { $in: ["pending", "processing"] },
      expiresAt: { $gt: new Date() },
    })

    // Checkouts expirados nas últimas 24h
    const expiredCheckouts = await db.collection("checkout-sessions").countDocuments({
      status: { $in: ["pending", "processing"] },
      expiresAt: { $lte: new Date(), $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    })

    // Taxa de conversão
    const totalCheckouts = checkoutStats.reduce((sum, stat) => sum + stat.count, 0)
    const completedCheckouts = checkoutStats.find((stat) => stat._id === "completed")?.count || 0
    const conversionRate = totalCheckouts > 0 ? (completedCheckouts / totalCheckouts) * 100 : 0

    // Itens mais comprados
    const topItems = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            type: "Concessionaria",
            createdAt: { $gte: startDate },
            status: "completed",
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.id",
            name: { $first: "$items.name" },
            count: { $sum: 1 },
            totalRevenue: { $sum: "$items.price" },
            avgPrice: { $avg: "$items.price" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray()

    // Usuários mais ativos
    const topUsers = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            type: "Concessionaria",
            createdAt: { $gte: startDate },
            status: "completed",
          },
        },
        {
          $group: {
            _id: "$userId",
            totalTransactions: { $sum: 1 },
            totalSpent: { $sum: "$totalWithFees" },
            totalItems: { $sum: "$itemCount" },
            avgSpent: { $avg: "$totalWithFees" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "id",
            as: "userInfo",
          },
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
      ])
      .toArray()

    // Tendências por hora (últimas 24h)
    const hourlyTrends = await db
      .collection("checkout-sessions")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: {
              hour: { $hour: "$createdAt" },
              status: "$status",
            },
            count: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
        { $sort: { "_id.hour": 1 } },
      ])
      .toArray()

    // Métodos de pagamento
    const paymentMethods = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            type: "Concessionaria",
            createdAt: { $gte: startDate },
            status: "completed",
          },
        },
        {
          $group: {
            _id: "$paymentMethod",
            count: { $sum: 1 },
            totalAmount: { $sum: "$totalWithFees" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray()

    res.status(200).json({
      timeframe,
      overview: {
        totalCheckouts,
        completedCheckouts,
        activeCheckouts,
        expiredCheckouts,
        conversionRate: Number(conversionRate.toFixed(2)),
        totalRevenue: checkoutStats.reduce((sum, stat) => sum + (stat.totalWithFees || 0), 0),
        avgOrderValue: checkoutStats.reduce((sum, stat) => sum + (stat.avgAmount || 0), 0) / checkoutStats.length || 0,
      },
      checkoutStats,
      transactionStats,
      topItems,
      topUsers: topUsers.map((user) => ({
        userId: user._id,
        user: user.userInfo[0],
        totalTransactions: user.totalTransactions,
        totalSpent: user.totalSpent,
        totalItems: user.totalItems,
        avgSpent: user.avgSpent,
      })),
      hourlyTrends,
      paymentMethods,
    })
  } catch (error) {
    console.error("Error fetching checkout overview:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
