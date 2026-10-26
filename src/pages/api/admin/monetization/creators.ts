import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = "rescue",
        sortOrder = "desc",
        filterBy = "all",
        search = "",
        minRescue = "",
        maxRescue = "",
      } = req.query

      const { db } = await dbConnect()
      const skip = (Number(page) - 1) * Number(limit)

      // Construir filtro
      const matchFilter: any = {}

      if (search) {
        // Buscar por ID do usuário ou nome
        const userIds = await db
          .collection("users")
          .find(
            {
              $or: [{ id: { $regex: search, $options: "i" } }, { name: { $regex: search, $options: "i" } }],
            },
            { projection: { id: 1 } },
          )
          .toArray()

        matchFilter.userId = { $in: userIds.map((u) => u.id) }
      }

      if (minRescue || maxRescue) {
        matchFilter.rescue = {}
        if (minRescue) matchFilter.rescue.$gte = Number(minRescue)
        if (maxRescue) matchFilter.rescue.$lte = Number(maxRescue)
      }

      // Pipeline de agregação
    const pipeline: any[] = [
  { $match: matchFilter },
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
    $lookup: {
      from: "member-stats",
      localField: "userId",
      foreignField: "member_id",
      as: "memberStats",
    },
  },
  {
    $lookup: {
      from: "withdrawalHistory",
      localField: "userId",
      foreignField: "userId",
      as: "withdrawalHistory",
    },
  },
  {
    $addFields: {
      user: { $arrayElemAt: ["$userInfo", 0] },
      reform: { $arrayElemAt: ["$reformInfo", 0] },
      memberStat: { $arrayElemAt: ["$memberStats", 0] },
      totalWithdrawn: { $sum: "$withdrawalHistory.amount" },
      lastWithdrawal: { $max: "$withdrawalHistory.timestamp" },
      withdrawalCount: { $size: "$withdrawalHistory" },
    },
  },
]
      // Aplicar filtros específicos
      if (filterBy !== "all") {
        switch (filterBy) {
          case "eligible":
            pipeline.push({
              $match: {
                "reform.type": "Authorized",
                "reform.prime": true,
                "reform.verified": true,
                "reform.unverifid": { $ne: true },
                "memberStat.level": { $gte: 10 },
                "memberStat.clubactivity": { $gte: 1000 },
                bits: { $gte: 1000 },
              },
            })
            break
          case "high_earners":
            pipeline.push({
              $match: {
                rescue: { $gte: 50000 },
              },
            })
            break
          case "prime":
            pipeline.push({
              $match: {
                "reform.prime": true,
              },
            })
            break
          case "verified":
            pipeline.push({
              $match: {
                "reform.verified": true,
              },
            })
            break
          case "recent_withdrawals":
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            pipeline.push({
              $match: {
                lastWithdrawal: { $gte: sevenDaysAgo },
              },
            })
            break
        }
      }

      // Ordenação
      const sortOptions: any = {}
      sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1
      pipeline.push({ $sort: sortOptions })

      // Paginação
      pipeline.push({ $skip: skip }, { $limit: Number(limit) })

      const creators = await db.collection("monetizations").aggregate(pipeline).toArray()

      // Contagem total
      const countPipeline = [...pipeline.slice(0, -2), { $count: "total" }]
      const totalResult = await db.collection("monetizations").aggregate(countPipeline).toArray()
      const totalCreators = totalResult[0]?.total || 0

      // Enriquecer dados
      const enrichedCreators = creators.map((creator) => ({
        userId: creator.userId,
        user: {
          id: creator.userId,
          name: creator.user?.name || "Unknown User",
          username: creator.user?.username || "unknown",
          avatar: creator.user?.avatar || null,
          verified: creator.user?.verified || false,
        },
        monetization: {
          rescue: creator.rescue || 0,
          bits: creator.bits || 0,
          totalWithdrawn: creator.totalWithdrawn || 0,
          withdrawalCount: creator.withdrawalCount || 0,
          lastWithdrawal: creator.lastWithdrawal,
        },
        status: {
          isPrime: creator.reform?.prime || false,
          isVerified: creator.reform?.verified || false,
          isAuthorized: creator.reform?.type === "Authorized",
          isUnverified: creator.reform?.unverifid === true,
          level: creator.memberStat?.level || 0,
          clubActivity: creator.memberStat?.clubactivity || 0,
        },
        eligibility: {
          canWithdraw:
            creator.reform?.type === "Authorized" &&
            creator.reform?.prime === true &&
            creator.reform?.verified === true &&
            creator.reform?.unverifid !== true &&
            (creator.memberStat?.level || 0) >= 10 &&
            (creator.memberStat?.clubactivity || 0) >= 1000 &&
            (creator.bits || 0) >= 1000,
        },
      }))

      res.status(200).json({
        creators: enrichedCreators,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalItems: totalCreators,
          totalPages: Math.ceil(totalCreators / Number(limit)),
        },
      })
    } catch (error) {
      console.error("Error fetching creators:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "POST") {
    try {
      const { action, userIds, amount, reason } = req.body
      const { db } = await dbConnect()

      if (!action || !userIds || !Array.isArray(userIds)) {
        return res.status(400).json({ message: "Invalid parameters" })
      }

      const results = []

      for (const userId of userIds) {
        try {
          switch (action) {
            case "adjust_rescue":
              if (typeof amount !== "number") {
                results.push({ userId, success: false, error: "Invalid amount" })
                continue
              }

              await db.collection("monetizations").updateOne(
                { userId },
                {
                  $inc: { rescue: amount },
                  $set: { lastAdjustment: new Date(), adjustmentReason: reason || "Admin adjustment" },
                },
                { upsert: true },
              )

              results.push({ userId, success: true, message: `Rescue adjusted by ${amount}` })
              break

            case "reset_monetization":
              await db.collection("monetizations").updateOne(
                { userId },
                {
                  $set: {
                    rescue: 0,
                    bits: 0,
                    lastReset: new Date(),
                    resetReason: reason || "Admin reset",
                  },
                },
              )

              results.push({ userId, success: true, message: "Monetization reset" })
              break

            case "force_withdrawal":
              if (typeof amount !== "number" || amount <= 0) {
                results.push({ userId, success: false, error: "Invalid withdrawal amount" })
                continue
              }

              const monetization = await db.collection("monetizations").findOne({ userId })
              if (!monetization || monetization.bits < amount) {
                results.push({ userId, success: false, error: "Insufficient bits" })
                continue
              }

              // Processar saque forçado
              await db.collection("withdrawalHistory").insertOne({
                userId,
                amount,
                timestamp: new Date(),
                status: "Concluído",
                type: "admin_forced",
                reason: reason || "Admin forced withdrawal",
              })

              await db.collection("monetizations").updateOne({ userId }, { $inc: { bits: -amount } })

              await db.collection("items").updateOne({ id: userId }, { $inc: { bits: amount } })

              results.push({ userId, success: true, message: `Forced withdrawal of ${amount} bits` })
              break

            case "block_monetization":
              await db.collection("reforms").updateOne(
                { userId },
                {
                  $set: {
                    monetizationBlocked: true,
                    monetizationBlockedAt: new Date(),
                    monetizationBlockReason: reason || "Admin block",
                  },
                },
              )

              results.push({ userId, success: true, message: "Monetization blocked" })
              break

            case "unblock_monetization":
              await db.collection("reforms").updateOne(
                { userId },
                {
                  $unset: {
                    monetizationBlocked: "",
                    monetizationBlockedAt: "",
                    monetizationBlockReason: "",
                  },
                },
              )

              results.push({ userId, success: true, message: "Monetization unblocked" })
              break

            default:
              results.push({ userId, success: false, error: "Invalid action" })
          }
        } catch (error) {
          results.push({
            userId,
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
      console.error("Error processing creator actions:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
