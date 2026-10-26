import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { period = "7d", metric = "revenue" } = req.query
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
        startDate.setDate(startDate.getDate() - 7)
    }

    // Analytics de receita por dia
    const revenueAnalytics = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            type: "Concessionaria",
            status: "completed",
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
            revenue: { $sum: "$totalWithFees" },
            transactions: { $sum: 1 },
            items: { $sum: "$itemCount" },
            avgOrderValue: { $avg: "$totalWithFees" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ])
      .toArray()

    // Analytics de conversão por dia
    const conversionAnalytics = await db
      .collection("checkout-sessions")
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
              status: "$status",
            },
            count: { $sum: 1 },
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
            completed: {
              $sum: {
                $cond: [{ $eq: ["$_id.status", "completed"] }, "$count", 0],
              },
            },
            cancelled: {
              $sum: {
                $cond: [{ $eq: ["$_id.status", "cancelled"] }, "$count", 0],
              },
            },
            expired: {
              $sum: {
                $cond: [
                  {
                    $or: [{ $eq: ["$_id.status", "expired"] }, { $eq: ["$_id.status", "pending"] }],
                  },
                  "$count",
                  0,
                ],
              },
            },
          },
        },
        {
          $addFields: {
            conversionRate: {
              $multiply: [{ $divide: ["$completed", "$total"] }, 100],
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ])
      .toArray()

    // Analytics de itens mais vendidos
    const itemAnalytics = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            type: "Concessionaria",
            status: "completed",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.id",
            name: { $first: "$items.name" },
            totalSold: { $sum: 1 },
            totalRevenue: { $sum: "$items.price" },
            avgPrice: { $avg: "$items.price" },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 20 },
      ])
      .toArray()

    // Analytics de usuários
    const userAnalytics = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            type: "Concessionaria",
            status: "completed",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalTransactions: { $sum: 1 },
            totalSpent: { $sum: "$totalWithFees" },
            totalItems: { $sum: "$itemCount" },
            avgOrderValue: { $avg: "$totalWithFees" },
            firstPurchase: { $min: "$createdAt" },
            lastPurchase: { $max: "$createdAt" },
          },
        },
        {
          $addFields: {
            isNewCustomer: {
              $gte: ["$firstPurchase", startDate],
            },
            customerLifetime: {
              $divide: [{ $subtract: ["$lastPurchase", "$firstPurchase"] }, 86400000], // dias
            },
          },
        },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            newCustomers: {
              $sum: { $cond: ["$isNewCustomer", 1, 0] },
            },
            avgLifetime: { $avg: "$customerLifetime" },
            avgOrderValue: { $avg: "$avgOrderValue" },
            totalRevenue: { $sum: "$totalSpent" },
          },
        },
      ])
      .toArray()

    // Analytics de métodos de pagamento
    const paymentAnalytics = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            type: "Concessionaria",
            status: "completed",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$paymentMethod",
            count: { $sum: 1 },
            revenue: { $sum: "$totalWithFees" },
            avgOrderValue: { $avg: "$totalWithFees" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray()

    // Formatear dados para gráficos
    const formatDateKey = (dateObj: any) => {
      return `${dateObj.year}-${String(dateObj.month).padStart(2, "0")}-${String(dateObj.day).padStart(2, "0")}`
    }

    const chartData = revenueAnalytics.map((item) => ({
      date: formatDateKey(item._id),
      revenue: item.revenue,
      transactions: item.transactions,
      items: item.items,
      avgOrderValue: item.avgOrderValue,
    }))

    const conversionData = conversionAnalytics.map((item) => ({
      date: formatDateKey(item._id),
      total: item.total,
      completed: item.completed,
      cancelled: item.cancelled,
      expired: item.expired,
      conversionRate: item.conversionRate,
    }))

    res.status(200).json({
      period,
      dateRange: {
        start: startDate,
        end: endDate,
      },
      revenue: chartData,
      conversion: conversionData,
      topItems: itemAnalytics,
      userMetrics: userAnalytics[0] || {},
      paymentMethods: paymentAnalytics,
      summary: {
        totalRevenue: chartData.reduce((sum, item) => sum + item.revenue, 0),
        totalTransactions: chartData.reduce((sum, item) => sum + item.transactions, 0),
        totalItems: chartData.reduce((sum, item) => sum + item.items, 0),
        avgOrderValue:
          chartData.length > 0 ? chartData.reduce((sum, item) => sum + item.avgOrderValue, 0) / chartData.length : 0,
        avgConversionRate:
          conversionData.length > 0
            ? conversionData.reduce((sum, item) => sum + item.conversionRate, 0) / conversionData.length
            : 0,
      },
    })
  } catch (error) {
    console.error("Error fetching checkout analytics:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
