import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { db } = await dbConnect()

    // Agregação para estatísticas de staking
    const stakingStats = await db
      .collection("items")
      .aggregate([
        {
          $match: {
            staking: { $exists: true, $ne: [] },
          },
        },
        {
          $unwind: "$staking",
        },
        {
          $group: {
            _id: null,
            totalStakers: { $addToSet: "$id" },
            totalStaked: { $sum: "$staking.amount" },
            totalInitialStaked: { $sum: "$staking.initialamount" },
            activeStaking: {
              $sum: {
                $cond: [{ $eq: ["$staking.lock", true] }, 1, 0],
              },
            },
            inactiveStaking: {
              $sum: {
                $cond: [{ $eq: ["$staking.lock", false] }, 1, 0],
              },
            },
            avgStakingAmount: { $avg: "$staking.amount" },
          },
        },
      ])
      .toArray()

    // Estatísticas por validador
    const validatorStats = await db
      .collection("items")
      .aggregate([
        { $unwind: "$staking" },
        {
          $group: {
            _id: "$staking.validatorId",
            totalDelegated: { $sum: "$staking.amount" },
            totalStakers: { $sum: 1 },
            activeStaking: {
              $sum: {
                $cond: [{ $eq: ["$staking.lock", true] }, 1, 0],
              },
            },
          },
        },
        { $sort: { totalDelegated: -1 } },
      ])
      .toArray()

    // Estatísticas de recompensas
    const rewardsStats = await db
      .collection("items")
      .aggregate([
        {
          $match: {
            bitsOnStaking: { $exists: true, $gt: 0 },
          },
        },
        {
          $group: {
            _id: null,
            totalRewards: { $sum: "$bitsOnStaking" },
            avgRewards: { $avg: "$bitsOnStaking" },
            usersWithRewards: { $sum: 1 },
          },
        },
      ])
      .toArray()

    // Transações de staking recentes
    const recentTransactions = await db
      .collection("items")
      .aggregate([
        { $unwind: "$transactions" },
        {
          $match: {
            "transactions.action": { $in: ["staking_orbs", "receive_bits"] },
            "transactions.staking": true,
          },
        },
        { $sort: { "transactions.timestamp": -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "id",
            foreignField: "id",
            as: "userInfo",
          },
        },
        {
          $project: {
            userId: "$id",
            transaction: "$transactions",
            user: { $arrayElemAt: ["$userInfo", 0] },
          },
        },
      ])
      .toArray()

    const stats = stakingStats[0] || {}
    const rewards = rewardsStats[0] || {}

    res.status(200).json({
      overview: {
        totalStakers: stats.totalStakers?.length || 0,
        totalStaked: stats.totalStaked || 0,
        totalInitialStaked: stats.totalInitialStaked || 0,
        activeStaking: stats.activeStaking || 0,
        inactiveStaking: stats.inactiveStaking || 0,
        avgStakingAmount: stats.avgStakingAmount || 0,
      },
      rewards: {
        totalRewards: rewards.totalRewards || 0,
        avgRewards: rewards.avgRewards || 0,
        usersWithRewards: rewards.usersWithRewards || 0,
      },
      validators: validatorStats,
      recentTransactions,
    })
  } catch (error) {
    console.error("Error fetching staking overview:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
