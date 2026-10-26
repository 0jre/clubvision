import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { query, type = "all" } = req.query
    const { db } = await dbConnect()

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Query parameter is required" })
    }

    // Construir filtro de busca
    const searchFilter: any = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { id: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
        { discriminator: { $regex: query, $options: "i" } },
      ],
    }

    // Pipeline de agregação para buscar usuários com todas as informações
    const pipeline = [
      { $match: searchFilter },
      { $limit: 20 }, // Limitar resultados
      {
        $lookup: {
          from: "reforms",
          localField: "id",
          foreignField: "userId",
          as: "reforms",
        },
      },
      {
        $lookup: {
          from: "member-stats",
          localField: "id",
          foreignField: "member_id",
          as: "stats",
        },
      },
      {
        $lookup: {
          from: "items",
          localField: "id",
          foreignField: "id",
          as: "items",
        },
      },
      {
        $lookup: {
          from: "monetizations",
          localField: "id",
          foreignField: "userId",
          as: "monetization",
        },
      },
      {
        $lookup: {
          from: "withdrawalHistory",
          localField: "id",
          foreignField: "userId",
          as: "withdrawals",
        },
      },
      {
        $lookup: {
          from: "postvision",
          localField: "id",
          foreignField: "userId",
          as: "posts",
        },
      },
      {
        $lookup: {
          from: "twitch",
          localField: "id",
          foreignField: "userId",
          as: "twitch",
        },
      },
      {
        $lookup: {
          from: "steam",
          localField: "id",
          foreignField: "userId",
          as: "steam",
        },
      },
      {
        $addFields: {
          reform: { $arrayElemAt: ["$reforms", 0] },
          stat: { $arrayElemAt: ["$stats", 0] },
          item: { $arrayElemAt: ["$items", 0] },
          monetizationData: { $arrayElemAt: ["$monetizations", 0] },
          twitchConnection: { $arrayElemAt: ["$twitch", 0] },
          steamConnection: { $arrayElemAt: ["$steam", 0] },
          totalPosts: { $size: "$posts" },
          totalWithdrawals: { $size: "$withdrawals" },
          followersCount: { $size: { $ifNull: ["$followers", []] } },
          followingCount: { $size: { $ifNull: ["$following", []] } },
        },
      },
      {
        $project: {
          // Informações básicas
          id: 1,
          name: 1,
          username: "$reform.name",
          discriminator: 1,
          avatar: 1,
          firstLoginDate: 1,
          subdominio: 1,

          // Status e verificações
          verified: "$reform.verified",
          type: "$reform.type",
          prime: "$reform.prime",
          selo: "$reform.selo",

          // Estatísticas
          level: "$stat.level",
          xp: "$stat.xp",
          clubactivity: "$stat.clubactivity",
          momentum: "$stat.momentum",

          // Economia
          coins: "$item.coins",
          banking: "$item.banking",
          bits: "$item.bits",

          // Monetização
          rescue: "$monetizationData.rescue",
          monetizationBits: "$monetizationData.bits",

          // Atividade
          totalPosts: 1,
          totalWithdrawals: 1,
          followersCount: 1,
          followingCount: 1,

          // Conexões
          hasTwitch: { $ne: ["$twitchConnection", null] },
          hasSteam: { $ne: ["$steamConnection", null] },

          // Dados completos para detalhes
          fullData: {
            reform: "$reform",
            stats: "$stat",
            items: "$item",
            monetization: "$monetizationData",
            connections: {
              twitch: "$twitchConnection",
              steam: "$steamConnection",
            },
            posts: "$posts",
            withdrawals: "$withdrawals",
          },
        },
      },
    ]

    const users = await db.collection("users").aggregate(pipeline).toArray()

    res.status(200).json({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username || user.name,
        discriminator: user.discriminator,
        avatar: user.avatar,
        verified: user.verified || false,
        type: user.type || "USER",
        prime: user.prime || false,
        level: user.level || 0,
        momentum: user.momentum || "Desconhecido",
        totalWealth: (user.coins || 0) + (user.banking || 0) + (user.bits || 0),
        rescue: user.rescue || 0,
        followersCount: user.followersCount,
        totalPosts: user.totalPosts,
        hasTwitch: user.hasTwitch,
        hasSteam: user.hasSteam,
        firstLoginDate: user.firstLoginDate,
        fullData: user.fullData,
      })),
      total: users.length,
    })
  } catch (error) {
    console.error("Error searching users:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
