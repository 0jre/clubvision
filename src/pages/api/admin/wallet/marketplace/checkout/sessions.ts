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
        orderId = "",
        startDate = "",
        endDate = "",
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query

      const { db } = await dbConnect()
      const skip = (Number(page) - 1) * Number(limit)

      // Construir filtro
      const filter: any = {}

      if (status) filter.status = status
      if (userId) filter.userId = userId
      if (orderId) filter.orderId = { $regex: orderId, $options: "i" }

      if (startDate || endDate) {
        filter.createdAt = {}
        if (startDate) filter.createdAt.$gte = new Date(startDate as string)
        if (endDate) filter.createdAt.$lte = new Date(endDate as string)
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
          $addFields: {
            user: { $arrayElemAt: ["$userInfo", 0] },
            itemCount: { $size: { $ifNull: ["$cartItems", []] } },
            timeRemaining: {
              $max: [
                0,
                {
                  $divide: [{ $subtract: ["$expiresAt", new Date()] }, 1000],
                },
              ],
            },
            isExpired: { $lt: ["$expiresAt", new Date()] },
          },
        },
        { $sort: { [sortBy as string]: sortOrder === "desc" ? -1 : 1 } },
        { $skip: skip },
        { $limit: Number(limit) },
      ]

      const sessions = await db.collection("checkout-sessions").aggregate(pipeline).toArray()

      // Contagem total
      const totalSessions = await db.collection("checkout-sessions").countDocuments(filter)

      res.status(200).json({
        sessions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalItems: totalSessions,
          totalPages: Math.ceil(totalSessions / Number(limit)),
        },
      })
    } catch (error) {
      console.error("Error fetching checkout sessions:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "POST") {
    try {
      const { action, sessionIds, reason } = req.body
      const { db } = await dbConnect()

      if (!action || !sessionIds || !Array.isArray(sessionIds)) {
        return res.status(400).json({ message: "Invalid parameters" })
      }

      let updateData: any = {}
      const now = new Date()

      switch (action) {
        case "cancel":
          updateData = {
            $set: {
              status: "cancelled",
              cancelledAt: now,
              cancelReason: reason || "Admin cancellation",
            },
          }
          break

        case "extend":
          updateData = {
            $set: {
              expiresAt: new Date(now.getTime() + 30 * 60 * 1000), // +30 minutos
            },
          }
          break

        case "force_expire":
          updateData = {
            $set: {
              expiresAt: now,
              status: "expired",
            },
          }
          break

        default:
          return res.status(400).json({ message: "Invalid action" })
      }

      const result = await db.collection("checkout-sessions").updateMany(
        {
          _id: { $in: sessionIds.map((id) => new ObjectId(id)) },
        },
        updateData,
      )

      res.status(200).json({
        success: true,
        message: `${result.modifiedCount} sessions updated`,
        modifiedCount: result.modifiedCount,
      })
    } catch (error) {
      console.error("Error updating checkout sessions:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
