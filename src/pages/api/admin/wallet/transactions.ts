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
      const currency = (req.query.currency as string) || "all"
      const status = (req.query.status as string) || "all"
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : null
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : null
      const userId = req.query.userId as string
      const minAmount = req.query.minAmount ? Number.parseFloat(req.query.minAmount as string) : null
      const maxAmount = req.query.maxAmount ? Number.parseFloat(req.query.maxAmount as string) : null

      // Construir pipeline de agregação
      const pipeline: any[] = [{ $unwind: "$transactions" }]

      // Filtros
      const matchConditions: any = {}

      if (actionType !== "all") {
        matchConditions["transactions.action"] = actionType
      }

      if (currency !== "all") {
        matchConditions["transactions.currency"] = currency
      }

      if (status !== "all") {
        matchConditions["transactions.status"] = status
      }

      if (userId) {
        matchConditions.id = userId
      }

      if (startDate || endDate) {
        matchConditions["transactions.timestamp"] = {}
        if (startDate) {
          matchConditions["transactions.timestamp"].$gte = startDate
        }
        if (endDate) {
          matchConditions["transactions.timestamp"].$lte = endDate
        }
      }

      if (minAmount !== null || maxAmount !== null) {
        matchConditions["transactions.amount"] = {}
        if (minAmount !== null) {
          matchConditions["transactions.amount"].$gte = minAmount
        }
        if (maxAmount !== null) {
          matchConditions["transactions.amount"].$lte = maxAmount
        }
      }

      if (Object.keys(matchConditions).length > 0) {
        pipeline.push({ $match: matchConditions })
      }

      // Projeção e ordenação
      pipeline.push(
        {
          $project: {
            userId: "$id",
            transaction: "$transactions",
          },
        },
        { $sort: { "transaction.timestamp": -1 } },
        { $skip: skip },
        { $limit: limit },
      )

      // Executar agregação
      const itemsCollection = db.collection("items")
      const transactions = await itemsCollection.aggregate(pipeline).toArray()

      // Contar total de transações para paginação
      const countPipeline = [...pipeline.slice(0, -2), { $count: "total" }]
      const countResult = await itemsCollection.aggregate(countPipeline).toArray()
      const totalTransactions = countResult[0]?.total || 0

      // Enriquecer dados dos usuários
      const userIds = [...new Set(transactions.map((t) => t.userId))]
      const userInfos = await usersCollection
        .find({ id: { $in: userIds } })
        .project({ id: 1, name: 1, username: 1, avatar: 1 })
        .toArray()

      const enrichedTransactions = transactions.map((t) => {
        const userInfo = userInfos.find((u) => u.id === t.userId)
        return {
          ...t.transaction,
          userId: t.userId,
          user: {
            id: t.userId,
            name: userInfo?.name || "Unknown User",
            username: userInfo?.username || "unknown",
            avatar: userInfo?.avatar || null,
          },
        }
      })

      // Registrar a ação de auditoria
      const auditCollection = db.collection("wallet-audit-logs")
      await auditCollection.insertOne({
        action: "list_wallet_transactions",
        userId: sessionUser.id,
        timestamp: new Date(),
        details: {
          filters: {
            actionType,
            currency,
            status,
            startDate,
            endDate,
            userId,
            minAmount,
            maxAmount,
          },
          pagination: { page, limit },
        },
      })

      return res.status(200).json({
        transactions: enrichedTransactions,
        pagination: {
          page,
          limit,
          totalItems: totalTransactions,
          totalPages: Math.ceil(totalTransactions / limit),
        },
      })
    } catch (error) {
      console.error("Erro ao listar transações da carteira:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" })
  }
}

export default withSession(handler)
