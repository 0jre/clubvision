import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const {
        page = 1,
        limit = 20,
        status = "",
        userId = "",
        startDate = "",
        endDate = "",
        minAmount = "",
        maxAmount = "",
        sortBy = "timestamp",
        sortOrder = "desc",
      } = req.query

      const { db } = await dbConnect()
      const skip = (Number(page) - 1) * Number(limit)

      // Construir filtro
      const filter: any = {}

      if (status) filter.status = status
      if (userId) filter.userId = userId

      if (startDate || endDate) {
        filter.timestamp = {}
        if (startDate) filter.timestamp.$gte = new Date(startDate as string)
        if (endDate) filter.timestamp.$lte = new Date(endDate as string)
      }

      if (minAmount || maxAmount) {
        filter.amount = {}
        if (minAmount) filter.amount.$gte = Number(minAmount)
        if (maxAmount) filter.amount.$lte = Number(maxAmount)
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
            from: "monetizations",
            localField: "userId",
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
        { $sort: { [sortBy as string]: sortOrder === "desc" ? -1 : 1 } },
        { $skip: skip },
        { $limit: Number(limit) },
      ]

      const withdrawals = await db.collection("withdrawalHistory").aggregate(pipeline).toArray()

      // Contagem total
      const totalWithdrawals = await db.collection("withdrawalHistory").countDocuments(filter)

      // Estatísticas da página atual
      const pageStats = {
        totalAmount: withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0),
        avgAmount:
          withdrawals.length > 0 ? withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0) / withdrawals.length : 0,
        pendingCount: withdrawals.filter((w) => w.status === "Pendente").length,
        completedCount: withdrawals.filter((w) => w.status === "Concluído").length,
        failedCount: withdrawals.filter((w) => w.status === "Falhou").length,
      }

      res.status(200).json({
        withdrawals: withdrawals.map((withdrawal) => ({
          _id: withdrawal._id,
          userId: withdrawal.userId,
          amount: withdrawal.amount,
          status: withdrawal.status,
          timestamp: withdrawal.timestamp,
          type: withdrawal.type || "normal",
          reason: withdrawal.reason,
          user: {
            id: withdrawal.userId,
            name: withdrawal.user?.name || "Unknown User",
            username: withdrawal.user?.username || "unknown",
            avatar: withdrawal.user?.avatar || null,
          },
          currentBalance: {
            rescue: withdrawal.monetization?.rescue || 0,
            bits: withdrawal.monetization?.bits || 0,
          },
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalItems: totalWithdrawals,
          totalPages: Math.ceil(totalWithdrawals / Number(limit)),
        },
        pageStats,
      })
    } catch (error) {
      console.error("Error fetching withdrawals:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "POST") {
    try {
      const { action, withdrawalIds, reason } = req.body
      const { db } = await dbConnect()

      if (!action || !withdrawalIds || !Array.isArray(withdrawalIds)) {
        return res.status(400).json({ message: "Invalid parameters" })
      }

      const results = []

      for (const withdrawalId of withdrawalIds) {
        try {
          const withdrawal = await db.collection("withdrawalHistory").findOne({ _id: new ObjectId(withdrawalId) })

          if (!withdrawal) {
            results.push({ withdrawalId, success: false, error: "Withdrawal not found" })
            continue
          }

          switch (action) {
            case "approve":
              if (withdrawal.status !== "Pendente") {
                results.push({ withdrawalId, success: false, error: "Withdrawal not pending" })
                continue
              }

              // Aprovar saque - transferir bits para carteira do usuário
              await db.collection("items").updateOne({ id: withdrawal.userId }, { $inc: { bits: withdrawal.amount } })

              await db.collection("withdrawalHistory").updateOne(
                { _id: new ObjectId(withdrawalId) },
                {
                  $set: {
                    status: "Concluído",
                    approvedAt: new Date(),
                    approvedReason: reason || "Admin approval",
                  },
                },
              )

              results.push({ withdrawalId, success: true, message: "Withdrawal approved" })
              break

            case "reject":
              if (withdrawal.status !== "Pendente") {
                results.push({ withdrawalId, success: false, error: "Withdrawal not pending" })
                continue
              }

              // Rejeitar saque - devolver bits para monetização
              await db
                .collection("monetizations")
                .updateOne({ userId: withdrawal.userId }, { $inc: { bits: withdrawal.amount } })

              await db.collection("withdrawalHistory").updateOne(
                { _id: new ObjectId(withdrawalId) },
                {
                  $set: {
                    status: "Falhou",
                    rejectedAt: new Date(),
                    rejectedReason: reason || "Admin rejection",
                  },
                },
              )

              results.push({ withdrawalId, success: true, message: "Withdrawal rejected" })
              break

            case "cancel":
              if (withdrawal.status === "Concluído") {
                results.push({ withdrawalId, success: false, error: "Cannot cancel completed withdrawal" })
                continue
              }

              // Cancelar saque
              if (withdrawal.status === "Pendente") {
                await db
                  .collection("monetizations")
                  .updateOne({ userId: withdrawal.userId }, { $inc: { bits: withdrawal.amount } })
              }

              await db.collection("withdrawalHistory").updateOne(
                { _id: new ObjectId(withdrawalId) },
                {
                  $set: {
                    status: "Cancelado",
                    cancelledAt: new Date(),
                    cancelReason: reason || "Admin cancellation",
                  },
                },
              )

              results.push({ withdrawalId, success: true, message: "Withdrawal cancelled" })
              break

            default:
              results.push({ withdrawalId, success: false, error: "Invalid action" })
          }
        } catch (error) {
          results.push({
            withdrawalId,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }

      res.status(200).json({
        success: true,
        message: "Actions processed",
        results,
      })
    } catch (error) {
      console.error("Error processing withdrawal actions:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
