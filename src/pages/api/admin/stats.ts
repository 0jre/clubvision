import type { NextApiResponse } from "next"
import { dbConnect, postVisionCollection, visiontvCollection } from "@/core/integration/connect"
import { withSession, type NextIronRequest } from "@/lib/session"

async function handler(req: NextIronRequest, res: NextApiResponse) {
  // Verificar se o usuário está autenticado e é administrador
  const sessionUser = req.session?.get("user")
  if (!sessionUser) {
    return res.status(401).json({ message: "Usuário não autenticado." })
  }

  const { db } = await dbConnect()
  const usersCollection = db.collection("users")
  const userRecord = await usersCollection.findOne({ id: sessionUser.id })

  if (userRecord?.type !== "ADMIN") {
    return res.status(403).json({ message: "Acesso negado. Permissão de administrador necessária." })
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido." })
  }

  try {
    const { period = "7d" } = req.query

    // Calcular a data de início com base no período
    const startDate = new Date()
    switch (period) {
      case "24h":
        startDate.setHours(startDate.getHours() - 24)
        break
      case "7d":
        startDate.setDate(startDate.getDate() - 7)
        break
      case "30d":
        startDate.setDate(startDate.getDate() - 30)
        break
      case "90d":
        startDate.setDate(startDate.getDate() - 90)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    // Coleções
    const postsCollection = db.collection(postVisionCollection)
    const videosCollection = db.collection(visiontvCollection)
    const logsCollection = db.collection("moderation_logs")

    // Estatísticas de conteúdo
    const totalPosts = await postsCollection.countDocuments()
    const totalVideos = await videosCollection.countDocuments()

    const newPosts = await postsCollection.countDocuments({ createdAt: { $gte: startDate } })
    const newVideos = await videosCollection.countDocuments({ createdAt: { $gte: startDate } })

    const flaggedPosts = await postsCollection.countDocuments({ flagged: true })
    const flaggedVideos = await videosCollection.countDocuments({ flagged: true })

    // Estatísticas de moderação
    const moderationActions = await logsCollection.countDocuments({ timestamp: { $gte: startDate } })

    // Ações por tipo
    const actionsByType = await logsCollection
      .aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: "$action", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray()

    // Moderadores mais ativos
    const topModerators = await logsCollection
      .aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: "$moderatorId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .toArray()

    // Enriquecer dados dos moderadores com nomes
    const moderatorIds = topModerators.map((mod) => mod._id)
    const moderatorUsers = await usersCollection
      .find({ id: { $in: moderatorIds } })
      .project({ id: 1, name: 1, avatar: 1 })
      .toArray()

    const enrichedModerators = topModerators.map((mod) => {
      const user = moderatorUsers.find((u) => u.id === mod._id)
      return {
        id: mod._id,
        name: user?.name || "Moderador desconhecido",
        avatar: user?.avatar || null,
        actionCount: mod.count,
      }
    })

    // Estatísticas diárias para gráficos
    const dailyStats = await logsCollection
      .aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: "$timestamp" },
              month: { $month: "$timestamp" },
              day: { $dayOfMonth: "$timestamp" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ])
      .toArray()

    const formattedDailyStats = dailyStats.map((day) => ({
      date: `${day._id.year}-${day._id.month.toString().padStart(2, "0")}-${day._id.day.toString().padStart(2, "0")}`,
      count: day.count,
    }))

    return res.status(200).json({
      overview: {
        totalContent: totalPosts + totalVideos,
        totalPosts,
        totalVideos,
        newContent: newPosts + newVideos,
        flaggedContent: flaggedPosts + flaggedVideos,
        moderationActions,
      },
      actionsByType,
      topModerators: enrichedModerators,
      dailyStats: formattedDailyStats,
    })
  } catch (error) {
    console.error("Erro ao obter estatísticas de moderação:", error)
    return res.status(500).json({ message: "Erro ao obter estatísticas de moderação." })
  }
}

export default withSession(handler)
