import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { page = 1, limit = 20, userId = "", success = "", sortBy = "timestamp", sortOrder = "desc" } = req.query

      const { db } = await dbConnect()
      const skip = (Number(page) - 1) * Number(limit)

      // Pipeline de agregação
      const pipeline: any[] = [
        {
          $match: {
            ...(userId && { userId }),
            ...(success !== "" && { success: success === "true" }),
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
          $addFields: {
            user: { $arrayElemAt: ["$userInfo", 0] },
          },
        },
      ]

      // Contagem total
      const totalPipeline = [...pipeline, { $count: "total" }]
      const totalResult = await db.collection("upgrades").aggregate(totalPipeline).toArray()
      const totalItems = totalResult[0]?.total || 0

      // Ordenação e paginação
      pipeline.push(
        { $sort: { [sortBy as string]: sortOrder === "desc" ? -1 : 1 } },
        { $skip: skip },
        { $limit: Number(limit) },
      )

      const upgrades = await db.collection("upgrades").aggregate(pipeline).toArray()

      // Estatísticas gerais
      const stats = await db
        .collection("upgrades")
        .aggregate([
          {
            $group: {
              _id: null,
              totalUpgrades: { $sum: 1 },
              successfulUpgrades: {
                $sum: { $cond: ["$success", 1, 0] },
              },
              totalValueTraded: { $sum: "$totalOfferedValue" },
              avgProbability: { $avg: "$probability" },
            },
          },
        ])
        .toArray()

      // Top usuários por upgrades
      const topUsers = await db
        .collection("upgrades")
        .aggregate([
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
          { $sort: { totalUpgrades: -1 } },
          { $limit: 10 },
        ])
        .toArray()

      res.status(200).json({
        upgrades,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalItems,
          totalPages: Math.ceil(totalItems / Number(limit)),
        },
        stats: stats[0] || {},
        topUsers: topUsers.map((user) => ({
          userId: user._id,
          user: user.userInfo[0],
          totalUpgrades: user.totalUpgrades,
          successfulUpgrades: user.successfulUpgrades,
          successRate: (user.successfulUpgrades / user.totalUpgrades) * 100,
          totalValueTraded: user.totalValueTraded,
        })),
      })
    } catch (error) {
      console.error("Error fetching upgrades:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "POST") {
    try {
      const { action, upgradeId, userId } = req.body
      const { db } = await dbConnect()

      switch (action) {
        case "reverse_upgrade":
          // Reverter um upgrade (implementar lógica de reversão)
          const upgrade = await db.collection("upgrades").findOne({ upgradeId })

          if (!upgrade) {
            return res.status(404).json({ message: "Upgrade not found" })
          }

          // Log da ação administrativa
          await db.collection("admin_audit_logs").insertOne({
            action: "reverse_upgrade",
            adminUserId: userId,
            targetUpgradeId: upgradeId,
            details: upgrade,
            timestamp: new Date(),
          })

          res.status(200).json({
            success: true,
            message: "Upgrade reversed successfully",
          })
          break

        case "adjust_probability":
          // Ajustar probabilidade de um upgrade específico
          const { newProbability } = req.body

          await db.collection("upgrades").updateOne(
            { upgradeId },
            {
              $set: {
                probability: newProbability,
                adjustedBy: userId,
                adjustedAt: new Date(),
              },
            },
          )

          res.status(200).json({
            success: true,
            message: "Probability adjusted successfully",
          })
          break

        default:
          res.status(400).json({ message: "Invalid action" })
      }
    } catch (error) {
      console.error("Error performing upgrade action:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
