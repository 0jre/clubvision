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
      const { timeframe = "7d" } = req.query

      // Calcular a data de início com base no timeframe
      const startDate = new Date()
      switch (timeframe) {
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
      const itemsCollection = db.collection("items")
      const walletVisionCollection = db.collection("walletvision")
      const reformsCollection = db.collection("reforms")

      // Estatísticas gerais da carteira
      const totalUsers = await itemsCollection.countDocuments({})
      const activeWallets = await itemsCollection.countDocuments({
        $or: [{ coins: { $gt: 0 } }, { bits: { $gt: 0 } }, { banking: { $gt: 0 } }],
      })

      // Estatísticas de saldo
      const balanceStats = await itemsCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalCoins: { $sum: "$coins" },
              totalBits: { $sum: "$bits" },
              totalBanking: { $sum: "$banking" },
              avgCoins: { $avg: "$coins" },
              avgBits: { $avg: "$bits" },
              avgBanking: { $avg: "$banking" },
            },
          },
        ])
        .toArray()

      // Estatísticas de transações
      const transactionStats = await itemsCollection
        .aggregate([
          { $unwind: "$transactions" },
          {
            $match: {
              "transactions.timestamp": { $gte: startDate },
            },
          },
          {
            $group: {
              _id: "$transactions.action",
              count: { $sum: 1 },
              totalAmount: { $sum: "$transactions.amount" },
            },
          },
          { $sort: { count: -1 } },
        ])
        .toArray()

      // Usuários Prime
      const primeUsers = await reformsCollection.countDocuments({ prime: true })

      // Estatísticas de jogos
      const gameStats = await walletVisionCollection.findOne({ endress: "global_record" })

      // Transações por dia
      const dailyTransactions = await itemsCollection
        .aggregate([
          { $unwind: "$transactions" },
          {
            $match: {
              "transactions.timestamp": { $gte: startDate },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$transactions.timestamp" },
                month: { $month: "$transactions.timestamp" },
                day: { $dayOfMonth: "$transactions.timestamp" },
              },
              count: { $sum: 1 },
              volume: { $sum: "$transactions.amount" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ])
        .toArray()

      // Registrar a ação de auditoria
      const auditCollection = db.collection("wallet-audit-logs")
      await auditCollection.insertOne({
        action: "view_wallet_overview",
        userId: sessionUser.id,
        timestamp: new Date(),
        details: { timeframe },
      })

      return res.status(200).json({
        overview: {
          totalUsers,
          activeWallets,
          primeUsers,
          inactiveWallets: totalUsers - activeWallets,
        },
        balances: balanceStats[0] || {
          totalCoins: 0,
          totalBits: 0,
          totalBanking: 0,
          avgCoins: 0,
          avgBits: 0,
          avgBanking: 0,
        },
        transactions: {
          byAction: transactionStats,
          daily: dailyTransactions.map((day) => ({
            date: `${day._id.year}-${String(day._id.month).padStart(2, "0")}-${String(day._id.day).padStart(2, "0")}`,
            count: day.count,
            volume: day.volume,
          })),
        },
        gaming: {
          totalBets: gameStats?.totalbet || 0,
          totalWinnings: gameStats?.amoutwin || 0,
          totalStorePayments: gameStats?.totalstorepayment || 0,
          totalTransfers: gameStats?.totaltransference || 0,
        },
      })
    } catch (error) {
      console.error("Erro ao buscar overview da carteira:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" })
  }
}

export default withSession(handler)
