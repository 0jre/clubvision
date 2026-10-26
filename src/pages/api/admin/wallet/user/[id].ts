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

  const { id } = req.query

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "ID de usuário inválido" })
  }

  try {
    const itemsCollection = db.collection("items")
    const reformsCollection = db.collection("reforms")
    const notificationsCollection = db.collection("notifications")
    const auditCollection = db.collection("wallet-audit-logs")

    if (req.method === "GET") {
      // Buscar dados da carteira do usuário
      const userWallet = await itemsCollection.findOne({ id })

      if (!userWallet) {
        return res.status(404).json({ message: "Carteira do usuário não encontrada" })
      }

      // Buscar informações do usuário
      const userInfo = await usersCollection.findOne({ id })
      const reformData = await reformsCollection.findOne({ userId: id })

      // Registrar a ação de auditoria
      await auditCollection.insertOne({
        action: "view_user_wallet",
        userId: sessionUser.id,
        targetUserId: id,
        timestamp: new Date(),
      })

      return res.status(200).json({
        user: {
          id,
          name: userInfo?.name || "Unknown User",
          username: userInfo?.username || "unknown",
          avatar: userInfo?.avatar || null,
          verified: userInfo?.verified || false,
        },
        wallet: {
          balances: {
            coins: userWallet.coins || 0,
            bits: userWallet.bits || 0,
            banking: userWallet.banking || 0,
            bitsOnStaking: userWallet.bitsOnStaking || 0,
          },
          contracts: {
            contractax: reformData?.contractax || false,
            contractunix: reformData?.contractunix || false,
            contractvision: reformData?.contractvision || false,
          },
          isPrime: reformData?.prime || false,
          transactions: userWallet.transactions || [],
          cards: userWallet.visioncard || [],
          staking: userWallet.staking || {},
          stakingHistory: userWallet.stakingHistory || [],
        },
      })
    } else if (req.method === "PUT") {
      const { action, amount, currency, reason } = req.body

      if (!action || !amount || !currency) {
        return res.status(400).json({ message: "Ação, quantidade e moeda são obrigatórios" })
      }

      const amountNum = Number.parseFloat(amount)
      if (isNaN(amountNum)) {
        return res.status(400).json({ message: "Quantidade inválida" })
      }

      // Executar a ação solicitada
      let updateData: any = {}
      let transactionAction = ""

      switch (action) {
        case "add_balance":
          updateData = { $inc: { [currency]: amountNum } }
          transactionAction = `admin_add_${currency}`
          break
        case "remove_balance":
          updateData = { $inc: { [currency]: -amountNum } }
          transactionAction = `admin_remove_${currency}`
          break
        case "set_balance":
          updateData = { $set: { [currency]: amountNum } }
          transactionAction = `admin_set_${currency}`
          break
        case "freeze_wallet":
          updateData = { $set: { frozen: true, frozenAt: new Date(), frozenBy: sessionUser.id } }
          transactionAction = "admin_freeze_wallet"
          break
        case "unfreeze_wallet":
          updateData = { $unset: { frozen: "", frozenAt: "", frozenBy: "" } }
          transactionAction = "admin_unfreeze_wallet"
          break
        default:
          return res.status(400).json({ message: "Ação inválida" })
      }

      // Atualizar a carteira
      await itemsCollection.updateOne({ id }, updateData)

      // Registrar transação
      if (action !== "freeze_wallet" && action !== "unfreeze_wallet") {
        const timestamp = new Date()
        const transaction = {
          date: timestamp.toLocaleDateString(),
          time: timestamp.toLocaleTimeString(),
          timestamp,
          amount: amountNum,
          currency,
          action: transactionAction,
          status: "completed",
          adminAction: true,
          adminId: sessionUser.id,
          reason: reason || "Ação administrativa",
        }

        await itemsCollection.updateOne({ id }, { $push: { transactions: transaction } })
      }

      // Notificar o usuário
      await notificationsCollection.insertOne({
        userId: id,
        type: "admin_action",
        title: "Ação Administrativa na Carteira",
        message: `Um administrador ${action === "add_balance" ? "adicionou" : action === "remove_balance" ? "removeu" : action === "set_balance" ? "definiu" : action === "freeze_wallet" ? "congelou" : "descongelou"} ${action.includes("balance") ? `${amountNum} ${currency.toUpperCase()}` : ""} ${action.includes("freeze") ? "sua carteira" : "em sua carteira"}.`,
        timestamp: new Date(),
        read: false,
      })

      // Registrar a ação de auditoria
      await auditCollection.insertOne({
        action: `admin_${action}`,
        userId: sessionUser.id,
        targetUserId: id,
        timestamp: new Date(),
        details: {
          action,
          amount: amountNum,
          currency,
          reason,
        },
      })

      return res.status(200).json({
        message: "Ação executada com sucesso",
        action,
        userId: id,
      })
    } else {
      return res.status(405).json({ message: "Método não permitido" })
    }
  } catch (error) {
    console.error(`Erro ao processar carteira do usuário ${id}:`, error)
    return res.status(500).json({ message: "Erro interno do servidor" })
  }
}

export default withSession(handler)
