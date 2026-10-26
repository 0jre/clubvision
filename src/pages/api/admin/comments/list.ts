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
      // Parâmetros de paginação e filtros
      const page = Number.parseInt(req.query.page as string) || 1
      const limit = Number.parseInt(req.query.limit as string) || 20
      const skip = (page - 1) * limit

      const status = (req.query.status as string) || "all"
      const sortBy = (req.query.sortBy as string) || "recent"
      const searchQuery = (req.query.search as string) || ""
      const toxicityLevel = (req.query.toxicity as string) || "all"
      const reportedOnly = req.query.reportedOnly === "true"

      // Buscar comentários de ambas as coleções
      const postVisionColl = db.collection(postVisionCollection)
      const visionTvColl = db.collection(visiontvCollection)

      // Agregação para extrair comentários de posts
      const postComments = await postVisionColl
        .aggregate([
          { $match: {} },
          { $unwind: "$comments" },
          {
            $project: {
              _id: 0,
              commentId: "$comments._id",
              text: "$comments.text",
              userId: "$comments.user.id",
              postId: "$_id",
              postTitle: "$title",
              postType: "post",
              createdAt: "$comments.createdAt",
              status: "$comments.status",
              toxicityScore: "$comments.toxicityScore",
              reports: "$comments.reports",
            },
          },
        ])
        .toArray()

      // Agregação para extrair comentários de vídeos
      const videoComments = await visionTvColl
        .aggregate([
          { $match: {} },
          { $unwind: "$comments" },
          {
            $project: {
              _id: 0,
              commentId: "$comments._id",
              text: "$comments.text",
              userId: "$comments.user.id",
              postId: "$_id",
              postTitle: "$title",
              postType: "video",
              createdAt: "$comments.createdAt",
              status: "$comments.status",
              toxicityScore: "$comments.toxicityScore",
              reports: "$comments.reports",
            },
          },
        ])
        .toArray()

      // Combinar os resultados
      let allComments = [...postComments, ...videoComments]

      // Aplicar filtros
      if (status !== "all") {
        allComments = allComments.filter((comment) => comment.status === status)
      }

      if (reportedOnly) {
        allComments = allComments.filter((comment) => (comment.reports || 0) > 0)
      }

      if (toxicityLevel !== "all") {
        switch (toxicityLevel) {
          case "high":
            allComments = allComments.filter((comment) => (comment.toxicityScore || 0) > 0.7)
            break
          case "medium":
            allComments = allComments.filter(
              (comment) => (comment.toxicityScore || 0) > 0.4 && (comment.toxicityScore || 0) <= 0.7,
            )
            break
          case "low":
            allComments = allComments.filter((comment) => (comment.toxicityScore || 0) <= 0.4)
            break
        }
      }

      if (searchQuery) {
        allComments = allComments.filter((comment) => comment.text.toLowerCase().includes(searchQuery.toLowerCase()))
      }

      // Ordenar comentários
      switch (sortBy) {
        case "recent":
          allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case "oldest":
          allComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          break
        case "most_reported":
          allComments.sort((b, a) => (a.reports || 0) - (b.reports || 0))
          break
        case "highest_toxicity":
          allComments.sort((b, a) => (a.toxicityScore || 0) - (b.toxicityScore || 0))
          break
      }

      // Aplicar paginação
      const totalItems = allComments.length
      const paginatedComments = allComments.slice(skip, skip + limit)

      // Buscar informações dos usuários
      const userIds = [...new Set(paginatedComments.map((comment) => comment.userId))]
      const users = await usersCollection
        .find({ id: { $in: userIds } })
        .project({ id: 1, name: 1, username: 1, avatar: 1, verified: 1 })
        .toArray()

      // Mapear usuários por ID para fácil acesso
      const userMap = users.reduce((map, user) => {
        map[user.id] = user
        return map
      }, {})

      // Enriquecer comentários com informações do usuário
      const enrichedComments = paginatedComments.map((comment) => ({
        ...comment,
        author: {
          id: comment.userId,
          username: userMap[comment.userId]?.username || "unknown",
          displayName: userMap[comment.userId]?.name || "Unknown User",
          avatar: userMap[comment.userId]?.avatar || null,
          verified: userMap[comment.userId]?.verified || false,
        },
      }))

      // Registrar a ação de auditoria
      const auditCollection = db.collection("audit-logs")
      await auditCollection.insertOne({
        action: "list_comments",
        userId: sessionUser.id,
        timestamp: new Date(),
        details: {
          filters: {
            status,
            reportedOnly,
            toxicityLevel,
            searchQuery,
            sortBy,
          },
          pagination: { page, limit },
        },
      })

      return res.status(200).json({
        comments: enrichedComments,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      })
    } catch (error) {
      console.error("Erro ao listar comentários:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" })
  }
}

export default withSession(handler)
