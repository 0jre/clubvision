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
      const limit = Number.parseInt(req.query.limit as string) || 20
      const skip = (page - 1) * limit

      const sortBy = (req.query.sortBy as string) || "balance"
      const filterBy = (req.query.filterBy as string) || "all"
      const searchQuery = (req.query.search as string) || ""

      // Construir o filtro
      const filter: any = {}

      if (searchQuery) {
        filter.$or = [{ id: { $regex: searchQuery, $options: "i" } }, { name: { $regex: searchQuery, $options: "i" } }]
      }

      // Aplicar filtros específicos
      switch (filterBy) {
        case "high_balance":
          filter.$or = [{ coins: { $gte: 1000 } }, { bits: { $gte: 1000 } }, { banking: { $gte: 1000 } }]
          break
        case "zero_balance":
          filter.coins = { $lte: 0 }
          filter.bits = { $lte: 0 }
          filter.banking = { $lte: 0 }
          break
        case "prime":
          // Buscar usuários prime na coleção reforms
          const primeUserIds = await db.collection("reforms").find({ prime: true }).project({ userId: 1 }).toArray()
          filter.id = { $in: primeUserIds.map((u) => u.userId) }
          break
        case "suspicious":
          // Usuários com muitas transações em pouco tempo
          filter["transactions.10"] = { $exists: true }
          break
      }

      // Buscar usuários na coleção items
      const itemsCollection = db.collection("items")

      // Determinar a ordem de classificação
      let sortOption: any = {}
      switch (sortBy) {
        case "balance":
          sortOption = { coins: -1 }
          break
        case "bits":
          sortOption = { bits: -1 }
          break
        case "banking":
          sortOption = { banking: -1 }
          break
        case "transactions":
          sortOption = { "transactions.length": -1 }
          break
        default:
          sortOption = { coins: -1 }
      }

      // Buscar usuários
      const users = await itemsCollection.find(filter).sort(sortOption).skip(skip).limit(limit).toArray()

      // Contar total de usuários para paginação
      const totalUsers = await itemsCollection.countDocuments(filter)

      // Enriquecer dados dos usuários
      const userIds = users.map((user) => user.id)
      const userInfos = await usersCollection
        .find({ id: { $in: userIds } })
        .project({ id: 1, name: 1, username: 1, avatar: 1, verified: 1 })
        .toArray()

      const reformsData = await db
        .collection("reforms")
        .find({ userId: { $in: userIds } })
        .toArray()

      const enrichedUsers = users.map((user) => {
        const userInfo = userInfos.find((u) => u.id === user.id)
        const reformData = reformsData.find((r) => r.userId === user.id)

        return {
          id: user.id,
          name: userInfo?.name || "Unknown User",
          username: userInfo?.username || "unknown",
          avatar: userInfo?.avatar || null,
          verified: userInfo?.verified || false,
          balances: {
            coins: user.coins || 0,
            bits: user.bits || 0,
            banking: user.banking || 0,
            total: (user.coins || 0) + (user.bits || 0) + (user.banking || 0),
          },
          isPrime: reformData?.prime || false,
          transactionCount: user.transactions?.length || 0,
          lastTransaction: user.transactions?.length ? user.transactions[user.transactions.length - 1].timestamp : null,
          contracts: {
            contractax: reformData?.contractax || false,
            contractunix: reformData?.contractunix || false,
            contractvision: reformData?.contractvision || false,
          },
        }
      })

      // Registrar a ação de auditoria
      const auditCollection = db.collection("wallet-audit-logs")
      await auditCollection.insertOne({
        action: "list_wallet_users",
        userId: sessionUser.id,
        timestamp: new Date(),
        details: {
          filters: { sortBy, filterBy, searchQuery },
          pagination: { page, limit },
        },
      })

      return res.status(200).json({
        users: enrichedUsers,
        pagination: {
          page,
          limit,
          totalItems: totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
        },
      })
    } catch (error) {
      console.error("Erro ao listar usuários da carteira:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" })
  }
}

export default withSession(handler)
