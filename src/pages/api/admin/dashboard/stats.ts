import type { NextApiResponse } from "next"
import { dbConnect, postVisionCollection, visiontvCollection } from "@/core/integration/connect"
import { withSession, type NextIronRequest } from "@/lib/session"

async function handler(req: NextIronRequest, res: NextApiResponse) {
  // Verificar se o usuário está autenticado e é admin
  const sessionUser = req.session?.get("user")
  if (!req.session || !sessionUser) {
    return res.status(401).json({ isAuthenticated: false, message: "Usuário não autenticado." })
  }

  const { db } = await dbConnect()
  const usersCollection = db.collection("users")
  const userRecord = await usersCollection.findOne({ id: sessionUser.id })

  const isAdmin = userRecord?.type === "ADMIN"
  if (!isAdmin) {
    return res.status(403).json({ message: "Acesso negado. Permissão de administrador necessária." })
  }

  if (req.method === "GET") {
    try {
      const timeframe = (req.query.timeframe as string) || "7d" // 24h, 7d, 30d, 90d

      // Calcular a data de início com base no timeframe
      const now = new Date()
      const startDate = new Date()

      switch (timeframe) {
        case "24h":
          startDate.setHours(now.getHours() - 24)
          break
        case "7d":
          startDate.setDate(now.getDate() - 7)
          break
        case "30d":
          startDate.setDate(now.getDate() - 30)
          break
        case "90d":
          startDate.setDate(now.getDate() - 90)
          break
        default:
          startDate.setDate(now.getDate() - 7)
      }

      // Coleções
      const postVisionColl = db.collection(postVisionCollection)
      const visionTvColl = db.collection(visiontvCollection)
      const auditCollection = db.collection("audit-logs")

      // Estatísticas de conteúdo
      const totalPosts = await postVisionColl.countDocuments({})
      const totalVideos = await visionTvColl.countDocuments({})

      const newPosts = await postVisionColl.countDocuments({
        createdAt: { $gte: startDate },
      })

      const newVideos = await visionTvColl.countDocuments({
        createdAt: { $gte: startDate },
      })

      // Estatísticas de moderação
      const moderationActions = await auditCollection.countDocuments({
        timestamp: { $gte: startDate },
        action: { $in: ["update_content_status", "delete_content", "delete_comment", "update_comment"] },
      })

      // Conteúdo sob revisão
      const postsUnderReview = await postVisionColl.countDocuments({
        status: "under_review",
      })

      const videosUnderReview = await visionTvColl.countDocuments({
        status: "under_review",
      })

      // Conteúdo reportado
      const reportedPosts = await postVisionColl.countDocuments({
        "metrics.reports": { $gt: 0 },
      })

      const reportedVideos = await visionTvColl.countDocuments({
        "metrics.reports": { $gt: 0 },
      })

      // Estatísticas de usuários
      const totalUsers = await usersCollection.countDocuments({})

      const newUsers = await usersCollection.countDocuments({
        createdAt: { $gte: startDate },
      })

      const bannedUsers = await usersCollection.countDocuments({
        status: "banned",
      })

      // Estatísticas de engajamento
      const postEngagement = await postVisionColl
        .aggregate([
          {
            $group: {
              _id: null,
              totalViews: { $sum: "$metrics.views" },
              totalLikes: { $sum: "$metrics.likes" },
              totalComments: { $sum: { $size: { $ifNull: ["$comments", []] } } },
            },
          },
        ])
        .toArray()

      const videoEngagement = await visionTvColl
        .aggregate([
          {
            $group: {
              _id: null,
              totalViews: { $sum: "$metrics.views" },
              totalLikes: { $sum: "$metrics.likes" },
              totalComments: { $sum: { $size: { $ifNull: ["$comments", []] } } },
            },
          },
        ])
        .toArray()

      // Dados para gráficos - Conteúdo criado por dia
      const contentByDay = await getContentByDay(db, startDate)

      // Dados para gráficos - Ações de moderação por dia
      const moderationByDay = await getModerationByDay(db, startDate)

      // Registrar a ação de auditoria
      await auditCollection.insertOne({
        action: "view_dashboard_stats",
        userId: sessionUser.id,
        timestamp: new Date(),
        details: { timeframe },
      })

      return res.status(200).json({
        timeframe,
        content: {
          totalPosts,
          totalVideos,
          newPosts,
          newVideos,
          totalContent: totalPosts + totalVideos,
          newContent: newPosts + newVideos,
        },
        moderation: {
          actions: moderationActions,
          underReview: postsUnderReview + videosUnderReview,
          reported: reportedPosts + reportedVideos,
        },
        users: {
          total: totalUsers,
          new: newUsers,
          banned: bannedUsers,
        },
        engagement: {
          views: (postEngagement[0]?.totalViews || 0) + (videoEngagement[0]?.totalViews || 0),
          likes: (postEngagement[0]?.totalLikes || 0) + (videoEngagement[0]?.totalLikes || 0),
          comments: (postEngagement[0]?.totalComments || 0) + (videoEngagement[0]?.totalComments || 0),
        },
        charts: {
          contentByDay,
          moderationByDay,
        },
      })
    } catch (error) {
      console.error("Erro ao buscar estatísticas do dashboard:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" })
  }
}

// Função auxiliar para obter conteúdo criado por dia
async function getContentByDay(db: any, startDate: Date) {
  const postVisionColl = db.collection(postVisionCollection)
  const visionTvColl = db.collection(visiontvCollection)

  const postsByDay = await postVisionColl
    .aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ])
    .toArray()

  const videosByDay = await visionTvColl
    .aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ])
    .toArray()

  // Formatar os resultados
  const result: any = {}

  postsByDay.forEach((item: any) => {
    const date = `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`
    if (!result[date]) {
      result[date] = { posts: 0, videos: 0, total: 0 }
    }
    result[date].posts = item.count
    result[date].total += item.count
  })

  videosByDay.forEach((item: any) => {
    const date = `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`
    if (!result[date]) {
      result[date] = { posts: 0, videos: 0, total: 0 }
    }
    result[date].videos = item.count
    result[date].total += item.count
  })

  // Converter para array
return Object.entries(result).map(([date, counts]) => ({
  date,
  ...(counts as Record<string, any>),
}))

}

// Função auxiliar para obter ações de moderação por dia
async function getModerationByDay(db: any, startDate: Date) {
  const auditCollection = db.collection("audit-logs")

  const moderationByDay = await auditCollection
    .aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
          action: { $in: ["update_content_status", "delete_content", "delete_comment", "update_comment"] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
            action: "$action",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ])
    .toArray()

  // Formatar os resultados
  const result: any = {}

  moderationByDay.forEach((item: any) => {
    const date = `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`
    if (!result[date]) {
      result[date] = {
        update_content_status: 0,
        delete_content: 0,
        delete_comment: 0,
        update_comment: 0,
        total: 0,
      }
    }
    result[date][item._id.action] = item.count
    result[date].total += item.count
  })

  // Converter para array
return Object.entries(result).map(([date, counts]) => ({
  date,
  ...(counts as Record<string, any>),
}))

}

export default withSession(handler)
