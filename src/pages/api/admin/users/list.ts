import type { NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
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
    const { filter = "all", sort = "recent", page = 1, limit = 20, search = "" } = req.query

    // Construir o filtro base
    const baseFilter: any = {}

    // Adicionar filtro de pesquisa se fornecido
    if (search) {
      baseFilter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { id: { $regex: search, $options: "i" } },
      ]
    }

    // Aplicar filtros específicos
    switch (filter) {
      case "suspended":
        baseFilter.status = "suspended"
        break
      case "warned":
        baseFilter.warnings = { $exists: true, $ne: [] }
        break
      case "flagged":
        // Usuários que tiveram conteúdo sinalizado
        const flaggedContentUsers = await db
          .collection("moderation_logs")
          .find({ action: "flag_content" })
          .project({ contentUserId: 1 })
          .toArray()

        const flaggedUserIds = [...new Set(flaggedContentUsers.map((log) => log.contentUserId))]
        baseFilter.id = { $in: flaggedUserIds }
        break
      case "new":
        // Usuários criados nos últimos 7 dias
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        baseFilter.createdAt = { $gte: sevenDaysAgo }
        break
    }

    // Determinar a ordem de classificação
    let sortOption: any = {}
    switch (sort) {
      case "name":
        sortOption = { name: 1 }
        break
      case "warnings":
        sortOption = { "warnings.length": -1 }
        break
      case "posts":
        // Ordenação por número de posts será aplicada após a consulta
        sortOption = {}
        break
      default:
        sortOption = { createdAt: -1 } // recent
    }

    // Calcular paginação
    const skip = (Number(page) - 1) * Number(limit)

    // Buscar usuários
    const users = await usersCollection
      .find(baseFilter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .project({ password: 0 }) // Excluir senha
      .toArray()

    // Contar total de usuários para paginação
    const total = await usersCollection.countDocuments(baseFilter)

    // Se a ordenação for por número de posts, precisamos enriquecer os dados
    if (sort === "posts") {
      const userIds = users.map((user) => user.id)

      // Contar posts por usuário
      const postsCollection = db.collection("postVisionCollection")
      const videosCollection = db.collection("visiontvCollection")

      const postCounts = await postsCollection
        .aggregate([{ $match: { userId: { $in: userIds } } }, { $group: { _id: "$userId", count: { $sum: 1 } } }])
        .toArray()

      const videoCounts = await videosCollection
        .aggregate([{ $match: { userId: { $in: userIds } } }, { $group: { _id: "$userId", count: { $sum: 1 } } }])
        .toArray()

      // Mapear contagens para usuários
      const userWithCounts = users.map((user) => {
        const postCount = postCounts.find((p) => p._id === user.id)?.count || 0
        const videoCount = videoCounts.find((v) => v._id === user.id)?.count || 0
        return {
          ...user,
          contentCount: postCount + videoCount,
        }
      })

      // Ordenar por contagem de conteúdo
      userWithCounts.sort((a, b) => b.contentCount - a.contentCount)

      return res.status(200).json({
        users: userWithCounts,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      })
    }

    return res.status(200).json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    console.error("Erro ao listar usuários:", error)
    return res.status(500).json({ message: "Erro ao listar usuários." })
  }
}

export default withSession(handler)
