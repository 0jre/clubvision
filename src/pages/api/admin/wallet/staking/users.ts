import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      validator = "",
      status = "",
      sortBy = "totalStaked",
      sortOrder = "desc",
    } = req.query

    const { db } = await dbConnect()
    const skip = (Number(page) - 1) * Number(limit)

    // Pipeline de agregação
    const pipeline: any[] = [
      {
        $match: {
          staking: { $exists: true, $ne: [] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "id",
          foreignField: "id",
          as: "userInfo",
        },
      },
      {
        $lookup: {
          from: "reforms",
          localField: "id",
          foreignField: "userId",
          as: "reformInfo",
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$userInfo", 0] },
          reform: { $arrayElemAt: ["$reformInfo", 0] },
          totalStaked: { $sum: "$staking.amount" },
          totalInitialStaked: { $sum: "$staking.initialamount" },
          activeStaking: {
            $size: {
              $filter: {
                input: "$staking",
                cond: { $eq: ["$$this.lock", true] },
              },
            },
          },
          inactiveStaking: {
            $size: {
              $filter: {
                input: "$staking",
                cond: { $eq: ["$$this.lock", false] },
              },
            },
          },
        },
      },
    ]

    // Filtros
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "user.name": { $regex: search, $options: "i" } },
            { "user.discriminator": { $regex: search, $options: "i" } },
            { id: { $regex: search, $options: "i" } },
          ],
        },
      })
    }

    if (validator) {
      pipeline.push({
        $match: {
          "staking.validatorId": validator,
        },
      })
    }

    if (status === "active") {
      pipeline.push({
        $match: {
          activeStaking: { $gt: 0 },
        },
      })
    } else if (status === "inactive") {
      pipeline.push({
        $match: {
          activeStaking: 0,
        },
      })
    }

    // Contagem total
    const totalPipeline = [...pipeline, { $count: "total" }]
    const totalResult = await db.collection("items").aggregate(totalPipeline).toArray()
    const totalItems = totalResult[0]?.total || 0

    // Ordenação e paginação
    const sortField =
      sortBy === "totalStaked"
        ? "totalStaked"
        : sortBy === "rewards"
          ? "bitsOnStaking"
          : sortBy === "activeStaking"
            ? "activeStaking"
            : "totalStaked"

    pipeline.push({ $sort: { [sortField]: sortOrder === "desc" ? -1 : 1 } }, { $skip: skip }, { $limit: Number(limit) })

    const users = await db.collection("items").aggregate(pipeline).toArray()

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.user?.name || "Unknown",
      username: user.user?.discriminator || "unknown",
      avatar: user.user?.avatar,
      verified: user.user?.verified || false,
      isPrime: user.reform?.prime || false,
      totalStaked: user.totalStaked || 0,
      totalInitialStaked: user.totalInitialStaked || 0,
      activeStaking: user.activeStaking || 0,
      inactiveStaking: user.inactiveStaking || 0,
      rewards: user.bitsOnStaking || 0,
      stakingDetails: user.staking || [],
      contracts: {
        contractax: user.reform?.contractax || false,
        contractunix: user.reform?.contractunix || false,
        contractvision: user.reform?.contractvision || false,
      },
    }))

    res.status(200).json({
      users: formattedUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems,
        totalPages: Math.ceil(totalItems / Number(limit)),
      },
    })
  } catch (error) {
    console.error("Error fetching staking users:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
