import type { NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
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
      const limit = Number.parseInt(req.query.limit as string) || 50
      const skip = (page - 1) * limit

      const actionType = (req.query.actionType as string) || "all"
      const userId = req.query.userId as string
      const targetUserId = req.query.targetUserId as string
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : null
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : null

      // Construir o filtro
      const filter: any = {}

      if (actionType !== "all") {
        filter.action = actionType
      }

      if (userId) {
        filter.userId = userId
      }

      if (targetUserId) {
        filter.targetUserId = targetUserId
      }

      // Filtro de data
      if (startDate || endDate) {
        filter.timestamp = {}
        if (startDate) {
          filter.timestamp.$gte = startDate
        }
        if (endDate) {
          filter.timestamp.$lte = endDate
        }
      }

      // Buscar logs de auditoria
      const auditCollection = db.collection("wallet-audit-logs")
      const logs = await auditCollection.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray()

      // Contar o total de logs para paginação
      const totalLogs = await auditCollection.countDocuments(filter)

      // Buscar informações dos usuários para enriquecer os logs
      const userIds = [
        ...new Set([...logs.map((log) => log.userId), ...logs.map((log) => log.targetUserId)].filter(Boolean)),
      ]
      const users = await usersCollection
        .find({ id: { $in: userIds } })
        .project({ id: 1, name: 1, username: 1, avatar: 1 })
        .toArray()

      // Mapear usuários por ID para fácil acesso
      const userMap = users.reduce((map, user) => {
        map[user.id] = user
        return map
      }, {})

      // Enriquecer logs com informações do usuário
      const enrichedLogs = logs.map((log) => ({
        ...log,
        user: {
          id: log.userId,
          username: userMap[log.userId]?.username || "unknown",
          displayName: userMap[log.userId]?.name || "Unknown User",
          avatar: userMap[log.userId]?.avatar || null,
        },
        targetUser: log.targetUserId
          ? {
              id: log.targetUserId,
              username: userMap[log.targetUserId]?.username || "unknown",
              displayName: userMap[log.targetUserId]?.name || "Unknown User",
              avatar: userMap[log.targetUserId]?.avatar || null,
            }
          : null,
      }))

      return res.status(200).json({
        logs: enrichedLogs,
        pagination: {
          page,
          limit,
          totalItems: totalLogs,
          totalPages: Math.ceil(totalLogs / limit),
        },
      })
    } catch (error) {
      console.error("Erro ao buscar logs de auditoria da carteira:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" })
  }
}

export default withSession(handler)
