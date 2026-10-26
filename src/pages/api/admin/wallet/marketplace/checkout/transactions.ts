import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const {
        page = 1,
        limit = 20,
        status = "",
        userId = "",
        transactionId = "",
        paymentMethod = "",
        startDate = "",
        endDate = "",
        minAmount = "",
        maxAmount = "",
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query

      const { db } = await dbConnect()
      const skip = (Number(page) - 1) * Number(limit)

      // Construir filtro
      const filter: any = { type: "Concessionaria" }

      if (status) filter.status = status
      if (userId) filter.userId = userId
      if (transactionId) filter.transactionId = { $regex: transactionId, $options: "i" }
      if (paymentMethod) filter.paymentMethod = paymentMethod

      if (startDate || endDate) {
        filter.createdAt = {}
        if (startDate) filter.createdAt.$gte = new Date(startDate as string)
        if (endDate) filter.createdAt.$lte = new Date(endDate as string)
      }

      if (minAmount || maxAmount) {
        filter.totalWithFees = {}
        if (minAmount) filter.totalWithFees.$gte = Number(minAmount)
        if (maxAmount) filter.totalWithFees.$lte = Number(maxAmount)
      }

      // Pipeline de agregação
      const pipeline = [
        { $match: filter },
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
            from: "checkout-sessions",
            localField: "orderId",
            foreignField: "orderId",
            as: "checkoutInfo",
          },
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$userInfo", 0] },
            checkout: { $arrayElemAt: ["$checkoutInfo", 0] },
            profit: { $subtract: ["$totalWithFees", "$totalAmount"] },
            avgItemPrice: { $divide: ["$totalAmount", "$itemCount"] },
          },
        },
        { $sort: { [sortBy as string]: sortOrder === "desc" ? -1 : 1 } },
        { $skip: skip },
        { $limit: Number(limit) },
      ]

      const transactions = await db.collection("transactions").aggregate(pipeline).toArray()

      // Contagem total
      const totalTransactions = await db.collection("transactions").countDocuments(filter)

      // Estatísticas da página atual
      const pageStats = {
        totalAmount: transactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0),
        totalWithFees: transactions.reduce((sum, t) => sum + (t.totalWithFees || 0), 0),
        totalItems: transactions.reduce((sum, t) => sum + (t.itemCount || 0), 0),
        totalProfit: transactions.reduce((sum, t) => sum + (t.profit || 0), 0),
        avgOrderValue:
          transactions.length > 0
            ? transactions.reduce((sum, t) => sum + (t.totalWithFees || 0), 0) / transactions.length
            : 0,
      }

      res.status(200).json({
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalItems: totalTransactions,
          totalPages: Math.ceil(totalTransactions / Number(limit)),
        },
        pageStats,
      })
    } catch (error) {
      console.error("Error fetching transactions:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "POST") {
    try {
      const { action, transactionIds, reason } = req.body
      const { db } = await dbConnect()

      if (!action || !transactionIds || !Array.isArray(transactionIds)) {
        return res.status(400).json({ message: "Invalid parameters" })
      }

      switch (action) {
        case "refund":
          // Implementar lógica de reembolso
          const refundResults = []

          for (const transactionId of transactionIds) {
            try {
              const transaction = await db.collection("transactions").findOne({ transactionId })

              if (!transaction) {
                refundResults.push({ transactionId, success: false, error: "Transaction not found" })
                continue
              }

              if (transaction.status === "refunded") {
                refundResults.push({ transactionId, success: false, error: "Already refunded" })
                continue
              }

              // Reembolsar bits ao usuário
              await db.collection("items").updateOne(
                { id: transaction.userId },
                {
                  $inc: { bits: transaction.totalWithFees },
                },
              )

              // Marcar transação como reembolsada
              await db.collection("transactions").updateOne(
                { transactionId },
                {
                  $set: {
                    status: "refunded",
                    refundedAt: new Date(),
                    refundReason: reason || "Admin refund",
                  },
                },
              )

              // Remover itens do inventário (opcional)
              if (transaction.items) {
                for (const item of transaction.items) {
                  await db.collection("tvl-novision").deleteOne({
                    userId: transaction.userId,
                    tokenID: item.uid,
                  })
                }
              }

              refundResults.push({ transactionId, success: true })
            } catch (error) {
              refundResults.push({
                transactionId,
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
              })
            }
          }

          res.status(200).json({
            success: true,
            message: "Refund process completed",
            results: refundResults,
          })
          break

        case "mark_suspicious":
          await db.collection("transactions").updateMany(
            { transactionId: { $in: transactionIds } },
            {
              $set: {
                flagged: true,
                flaggedAt: new Date(),
                flagReason: reason || "Admin review",
              },
            },
          )

          res.status(200).json({
            success: true,
            message: "Transactions marked as suspicious",
          })
          break

        default:
          res.status(400).json({ message: "Invalid action" })
      }
    } catch (error) {
      console.error("Error processing transaction action:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
