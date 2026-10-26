import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { db } = await dbConnect()

    // Estatísticas de abertura de caixas
    const caseStats = await db
      .collection("items")
      .aggregate([
        { $unwind: "$transactions" },
        {
          $match: {
            "transactions.action": "purchase_openbox",
            "transactions.timestamp": {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalCasesOpened: { $sum: 1 },
            totalTokensSpent: { $sum: "$transactions.amount" },
            avgTokensPerCase: { $avg: "$transactions.amount" },
          },
        },
      ])
      .toArray()

    // Estatísticas de marketplace
    const marketplaceStats = await db
      .collection("advertisements")
      .aggregate([
        {
          $facet: {
            active: [
              {
                $match: {
                  active: true,
                  expiresAt: { $gt: new Date() },
                },
              },
              { $count: "count" },
            ],
            completed: [
              {
                $match: {
                  active: false,
                  soldAt: { $exists: true },
                },
              },
              { $count: "count" },
            ],
            totalVolume: [
              {
                $match: {
                  active: false,
                  soldAt: { $exists: true },
                },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$price" },
                },
              },
            ],
          },
        },
      ])
      .toArray()

    // Estatísticas de upgrades
    const upgradeStats = await db
      .collection("upgrades")
      .aggregate([
        {
          $match: {
            timestamp: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalUpgrades: { $sum: 1 },
            successfulUpgrades: {
              $sum: { $cond: ["$success", 1, 0] },
            },
            totalValueTraded: { $sum: "$totalOfferedValue" },
            avgSuccessRate: { $avg: "$probability" },
          },
        },
      ])
      .toArray()

    // Estatísticas de trading P2P
    const tradingStats = await db
      .collection("trades")
      .aggregate([
        {
          $match: {
            time: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            avgTokens: { $avg: "$quantitytoken" },
          },
        },
      ])
      .toArray()

    // Estatísticas de leilões
    const auctionStats = await db
      .collection("auctions")
      .aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalBids: { $sum: "$bidCount" },
            avgFinalPrice: { $avg: "$currentBid" },
          },
        },
      ])
      .toArray()

    // Top itens mais negociados
    const topItems = await db
      .collection("tvl-novision")
      .aggregate([
        {
          $match: {
            sold: true,
            soldAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: "$id",
            count: { $sum: 1 },
            totalValue: { $sum: "$itemValue" },
            avgPrice: { $avg: "$itemValue" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray()

    // Usuários mais ativos
    const topTraders = await db
      .collection("upgrades")
      .aggregate([
        {
          $match: {
            timestamp: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalUpgrades: { $sum: 1 },
            successfulUpgrades: {
              $sum: { $cond: ["$success", 1, 0] },
            },
            totalValueTraded: { $sum: "$totalOfferedValue" },
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
        { $sort: { totalValueTraded: -1 } },
        { $limit: 10 },
      ])
      .toArray()

    const cases = caseStats[0] || {}
    const marketplace = marketplaceStats[0] || {}
    const upgrades = upgradeStats[0] || {}

    res.status(200).json({
      overview: {
        // Caixas
        totalCasesOpened: cases.totalCasesOpened || 0,
        totalTokensSpent: cases.totalTokensSpent || 0,
        avgTokensPerCase: cases.avgTokensPerCase || 0,

        // Marketplace
        activeListings: marketplace.active?.[0]?.count || 0,
        completedSales: marketplace.completed?.[0]?.count || 0,
        marketplaceVolume: marketplace.totalVolume?.[0]?.total || 0,

        // Upgrades
        totalUpgrades: upgrades.totalUpgrades || 0,
        successfulUpgrades: upgrades.successfulUpgrades || 0,
        upgradeSuccessRate: upgrades.totalUpgrades
          ? ((upgrades.successfulUpgrades || 0) / upgrades.totalUpgrades) * 100
          : 0,
        upgradeVolume: upgrades.totalValueTraded || 0,
      },
      tradingStats,
      auctionStats,
      topItems,
      topTraders,
    })
  } catch (error) {
    console.error("Error fetching marketplace overview:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
