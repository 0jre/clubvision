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
      const limit = Number.parseInt(req.query.limit as string) || 10
      const skip = (page - 1) * limit

      const contentType = (req.query.contentType as string) || "all"
      const status = (req.query.status as string) || "all"
      const sortBy = (req.query.sortBy as string) || "recent"
      const searchQuery = (req.query.search as string) || ""
      const reportedOnly = req.query.reportedOnly === "true"
      const aiFlag = (req.query.aiFlag as string) || "all"

      // Construir o filtro
      const filter: any = {}

      if (contentType !== "all") {
        if (contentType === "video") {
          filter.type = "video"
        } else if (contentType === "post") {
          filter.type = { $ne: "video" }
        }
      }

      if (status !== "all") {
        filter.status = status
      }

      if (reportedOnly) {
        filter["metrics.reports"] = { $gt: 0 }
      }

      if (searchQuery) {
        filter.$or = [
          { title: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { "author.username": { $regex: searchQuery, $options: "i" } },
        ]
      }

      // Determinar a coleção a ser usada
      const collection =
        contentType === "video" ? db.collection(visiontvCollection) : db.collection(postVisionCollection)

      // Ordenação
      let sortOptions: any = {}
      switch (sortBy) {
        case "recent":
          sortOptions = { createdAt: -1 }
          break
        case "oldest":
          sortOptions = { createdAt: 1 }
          break
        case "most_reported":
          sortOptions = { "metrics.reports": -1 }
          break
        case "most_viewed":
          sortOptions = { "metrics.views": -1 }
          break
        default:
          sortOptions = { createdAt: -1 }
      }

      // Executar a consulta
      const contentItems = await collection.find(filter).sort(sortOptions).skip(skip).limit(limit).toArray()

      // Contar o total de itens para paginação
      const totalItems = await collection.countDocuments(filter)
      const totalPages = Math.ceil(totalItems / limit)

      // Enriquecer os dados com informações adicionais do usuário
      const usersCollection = db.collection("users")
      const enrichedContent = await Promise.all(
        contentItems.map(async (item) => {
          const user = await usersCollection.findOne({ id: item.userId })
          return {
            ...item,
            author: {
              id: item.userId,
              username: user?.username || "unknown",
              displayName: user?.name || "Unknown User",
              avatar: user?.avatar || null,
              verified: user?.verified || false,
            },
            status: item.status || "active",
            metrics: {
              views: item.views || 0,
              likes: item.likedBy?.length || 0,
              comments: item.comments?.length || 0,
              reports: item.reports || 0,
              shares: item.shares || 0,
            },
          }
        }),
      )

      // Registrar a ação de auditoria
      const auditCollection = db.collection("audit-logs")
      await auditCollection.insertOne({
        action: "list_content",
        userId: sessionUser.id,
        timestamp: new Date(),
        details: {
          filters: {
            contentType,
            status,
            reportedOnly,
            searchQuery,
            sortBy,
          },
          pagination: { page, limit },
        },
      })

      return res.status(200).json({
        content: enrichedContent,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
        },
      })
    } catch (error) {
      console.error("Erro ao listar conteúdo:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" })
  }
}

export default withSession(handler)
