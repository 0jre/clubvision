import { dbConnect } from "@/core/integration/connect"
import { NextIronHandler, withSession } from "@/lib/session"
import type { NextApiRequest, NextApiResponse } from "next"
import type { Session } from "next-iron-session"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

interface CardTransaction {
  id: string
  userId: string
  cardId: string
  type: "payment" | "refund" | "fee" | "autopay"
  amount: number
  currency: string
  merchant?: string
  description: string
  status: "pending" | "completed" | "failed" | "cancelled"
  timestamp: Date
  metadata?: any
}

const transactionsHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  const sessionUser = req.session?.get("user")

  if (!req.session || !sessionUser) {
    return res.status(401).json({ isAuthenticated: false, message: "Usuário não autenticado." })
  }

  const { db } = await dbConnect()
  const userCollection = db.collection("items")
  const transactionsCollection = db.collection("card_transactions")
  const userId = sessionUser.id

  try {
    if (req.method === "GET") {
      const { cardId, limit = 50, offset = 0, type, status } = req.query

      // Construir filtro
      const filter: any = { userId }
      if (cardId) filter.cardId = cardId
      if (type) filter.type = type
      if (status) filter.status = status

      // Buscar transações
      const transactions = await transactionsCollection
        .find(filter)
        .sort({ timestamp: -1 })
        .skip(Number(offset))
        .limit(Number(limit))
        .toArray()

      // Buscar estatísticas
      const stats = await transactionsCollection
        .aggregate([
          { $match: { userId } },
          {
            $group: {
              _id: null,
              totalTransactions: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
              avgAmount: { $avg: "$amount" },
              completedTransactions: {
                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
              },
              failedTransactions: {
                $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
              },
            },
          },
        ])
        .toArray()

      // Estatísticas por cartão
      const cardStats = await transactionsCollection
        .aggregate([
          { $match: { userId } },
          {
            $group: {
              _id: "$cardId",
              totalTransactions: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
              lastTransaction: { $max: "$timestamp" },
            },
          },
        ])
        .toArray()

      return res.status(200).json({
        transactions: transactions.map((t) => ({
          id: t._id,
          cardId: t.cardId,
          type: t.type,
          amount: t.amount,
          currency: t.currency || "BRL",
          merchant: t.merchant,
          description: t.description,
          status: t.status,
          timestamp: t.timestamp,
          isAutoPay: t.type === "autopay",
        })),
        stats: stats[0] || {
          totalTransactions: 0,
          totalAmount: 0,
          avgAmount: 0,
          completedTransactions: 0,
          failedTransactions: 0,
        },
        cardStats: cardStats.reduce((acc, stat) => {
          acc[stat._id] = {
            totalTransactions: stat.totalTransactions,
            totalAmount: stat.totalAmount,
            lastTransaction: stat.lastTransaction,
          }
          return acc
        }, {}),
        pagination: {
          limit: Number(limit),
          offset: Number(offset),
          hasMore: transactions.length === Number(limit),
        },
      })
    }

    if (req.method === "POST") {
      const { action, cardId, amount, merchant, description, autoPayment } = req.body

      if (action === "simulate_payment") {
        // Simular pagamento para teste
        if (!cardId || !amount) {
          return res.status(400).json({ message: "CardId e amount são obrigatórios" })
        }

        // Verificar se o cartão existe e está ativo
        const user = await userCollection.findOne({ _id: userId })
        const card = user?.visioncard?.find((c: any) => c.cardNumber === cardId)

        if (!card) {
          return res.status(404).json({ message: "Cartão não encontrado" })
        }

        if (card.status === "frozen") {
          return res.status(400).json({ message: "Cartão está bloqueado" })
        }

        // Verificar limites diários/mensais
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const dailyTransactions = await transactionsCollection
          .aggregate([
            {
              $match: {
                userId,
                cardId,
                timestamp: { $gte: today },
                status: "completed",
              },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ])
          .toArray()

        const dailySpent = dailyTransactions[0]?.total || 0
        const dailyLimit = card.securitySettings?.dailyLimit || 5000

        if (dailySpent + amount > dailyLimit) {
          return res.status(400).json({
            message: "Limite diário excedido",
            dailySpent,
            dailyLimit,
            attemptedAmount: amount,
          })
        }

        // Criar transação
        const transaction: CardTransaction = {
          id: new Date().getTime().toString(),
          userId,
          cardId,
          type: autoPayment ? "autopay" : "payment",
          amount,
          currency: "BRL",
          merchant: merchant || "Comerciante Teste",
          description: description || "Pagamento simulado",
          status: "completed",
          timestamp: new Date(),
          metadata: {
            autoPayment: !!autoPayment,
            simulatedTransaction: true,
          },
        }

        await transactionsCollection.insertOne(transaction)

        // Atualizar saldo do cartão (se necessário)
        // Aqui você pode implementar a lógica de débito do saldo

        return res.status(200).json({
          message: "Pagamento processado com sucesso",
          transaction: {
            id: transaction.id,
            amount: transaction.amount,
            merchant: transaction.merchant,
            timestamp: transaction.timestamp,
            isAutoPay: !!autoPayment,
          },
        })
      }

      return res.status(400).json({ message: "Ação inválida" })
    }

    res.setHeader("Allow", ["GET", "POST"])
    return res.status(405).end(`Método ${req.method} não permitido`)
  } catch (error) {
    console.error("Erro na API de transações:", error)
    return res.status(500).json({ message: "Erro interno do servidor" })
  }
}
 
const CardVision: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  // Use o await para chamar a função original checkAuth
  await transactionsHandler(req, res);
};

export default withSession(CardVision);