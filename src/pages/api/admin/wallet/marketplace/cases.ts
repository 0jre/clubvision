import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { db } = await dbConnect()

      // Estatísticas de caixas
      const openBoxData = await db.collection("openbox").findOne({})

      // Estatísticas de abertura por usuário
      const userStats = await db
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
              _id: "$id",
              totalCases: { $sum: 1 },
              totalSpent: { $sum: "$transactions.amount" },
              avgSpent: { $avg: "$transactions.amount" },
              lastOpened: { $max: "$transactions.timestamp" },
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
          { $sort: { totalCases: -1 } },
          { $limit: 50 },
        ])
        .toArray()

      // Estatísticas de itens obtidos
      const itemStats = await db
        .collection("items")
        .aggregate([
          { $unwind: "$transactions" },
          {
            $match: {
              "transactions.action": "purchase_openbox",
              "transactions.item": { $exists: true },
            },
          },
          {
            $group: {
              _id: "$transactions.item.item.id",
              count: { $sum: 1 },
              totalValue: { $sum: "$transactions.item.price" },
              avgValue: { $avg: "$transactions.item.price" },
              rarity: { $first: "$transactions.item.item.rarity" },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 20 },
        ])
        .toArray()

      // Estatísticas de raridade
      const rarityStats = await db
        .collection("items")
        .aggregate([
          { $unwind: "$transactions" },
          {
            $match: {
              "transactions.action": "purchase_openbox",
              "transactions.item": { $exists: true },
            },
          },
          {
            $group: {
              _id: "$transactions.item.item.rarity",
              count: { $sum: 1 },
              totalValue: { $sum: "$transactions.item.price" },
            },
          },
        ])
        .toArray()

      res.status(200).json({
        openBoxData: {
          currentItems: openBoxData?.items?.length || 0,
          nextUpdate: openBoxData?.nextUpdate,
          lastUpdate: openBoxData?.updatedAt,
        },
        userStats: userStats.map((stat) => ({
          userId: stat._id,
          user: stat.userInfo[0],
          totalCases: stat.totalCases,
          totalSpent: stat.totalSpent,
          avgSpent: stat.avgSpent,
          lastOpened: stat.lastOpened,
        })),
        itemStats,
        rarityStats,
      })
    } catch (error) {
      console.error("Error fetching case statistics:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "POST") {
    try {
      const { action, data } = req.body
      const { db } = await dbConnect()

      switch (action) {
        case "refresh_items":
          // Forçar atualização dos itens disponíveis
          await db.collection("openbox").updateOne(
            {},
            {
              $set: {
                nextUpdate: new Date(),
              },
            },
          )

          res.status(200).json({
            success: true,
            message: "Lista de itens será atualizada na próxima consulta",
          })
          break

        case "adjust_probabilities":
          // Ajustar probabilidades (implementar conforme necessário)
          res.status(200).json({
            success: true,
            message: "Probabilidades ajustadas",
          })
          break

        default:
          res.status(400).json({ message: "Invalid action" })
      }
    } catch (error) {
      console.error("Error performing case action:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
