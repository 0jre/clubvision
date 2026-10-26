import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import type { NextApiHandler } from "next"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

interface TransactionStatusResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    orderId: string
    status: "pending" | "completed" | "failed" | "partial" | "expired"
    totalAmount: number
    paidAmount: number
    pendingAmount: number
    purchasedItems: number
    failedItems: number
    paymentMethod: string
    cardUsed?: string
    createdAt: Date
    completedAt?: Date
    items: Array<{
      id: number
      name: string
      price: number
      uid: string
      value: number
      paymentStatus: string
    }>
    dataSource?: string
  }
  error?: string
}

const getTransactionStatus: NextApiHandler = async (
  req: NextIronRequestWithSession,
  res: NextApiResponse<TransactionStatusResponse>,
) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: `Método ${req.method} não permitido.`,
    })
  }

  try {
    const sessionUser = req.session?.get("user")
    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      })
    }

    const { txnId } = req.query
    const userId = sessionUser.id

    if (!txnId || typeof txnId !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID da transação inválido.",
      })
    }

    const { db } = await dbConnect()
    const transactionsCollection = db.collection("transactions")
    const checkoutCollection = db.collection("checkout-sessions")

    // Primeiro, tentar buscar por ID da transação
    let transactionData = await transactionsCollection.findOne({
      transactionId: txnId,
      userId,
    })

    // Se não encontrar, tentar buscar por orderId
    if (!transactionData) {
      transactionData = await transactionsCollection.findOne({
        orderId: txnId,
        userId,
      })
    }

    // Se ainda não encontrar, buscar na collection de checkout
    if (!transactionData) {
      const checkoutData = await checkoutCollection.findOne({
        orderId: txnId,
        userId,
      })

      if (checkoutData) {
        // Verificar se expirou
        const now = new Date()
        let status = checkoutData.status

        if (status === "pending" && checkoutData.expiresAt < now) {
          status = "expired"
          // Atualizar status no banco
          await checkoutCollection.updateOne(
            { _id: checkoutData._id },
            {
              $set: {
                status: "expired",
                expiredAt: now,
              },
            },
          )
        }

        // Simular dados de transação baseados no checkout
        transactionData = {
          _id: checkoutData._id,
          transactionId: checkoutData.transactionId || checkoutData.orderId,
          orderId: checkoutData.orderId,
          status: status,
          totalAmount: checkoutData.totalWithFees || checkoutData.totalAmount,
          paidAmount:
            checkoutData.paidAmount ||
            (status === "completed" ? checkoutData.totalWithFees || checkoutData.totalAmount : 0),
          pendingAmount:
            checkoutData.pendingAmount ||
            (status === "completed" ? 0 : checkoutData.totalWithFees || checkoutData.totalAmount),
          purchasedItems:
            checkoutData.purchasedItems || (status === "completed" ? checkoutData.cartItems?.length || 0 : 0),
          failedItems: checkoutData.failedItems || 0,
          paymentMethod: checkoutData.paymentMethod || "wallet",
          cardUsed: checkoutData.cardUsed,
          createdAt: checkoutData.createdAt,
          completedAt: checkoutData.completedAt || (status === "completed" ? checkoutData.updatedAt : null),
          dataSource: checkoutData.dataSource,
          items: (checkoutData.cartItems || []).map((item: any, index: number) => ({
            id: item.id,
            name: item.nameitem,
            price: item.priceitem,
            uid: `${item.id}_${index}`,
            value: item.priceitem * item.quantity,
            paymentStatus: status === "completed" ? "paid" : "pending",
          })),
        }
      }
    }

    if (!transactionData) {
      return res.status(404).json({
        success: false,
        message: "Transação não encontrada.",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Status da transação recuperado com sucesso",
      data: {
        transactionId: transactionData.transactionId,
        orderId: transactionData.orderId,
        status: transactionData.status,
        totalAmount: transactionData.totalAmount,
        paidAmount: transactionData.paidAmount || 0,
        pendingAmount: transactionData.pendingAmount || 0,
        purchasedItems: transactionData.purchasedItems || 0,
        failedItems: transactionData.failedItems || 0,
        paymentMethod: transactionData.paymentMethod || "wallet",
        cardUsed: transactionData.cardUsed,
        createdAt: transactionData.createdAt,
        completedAt: transactionData.completedAt,
        items: transactionData.items || [],
        dataSource: transactionData.dataSource,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar status da transação:", error)
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}

const getTransactionStatusWithSession: NextIronHandler = async (
  req: NextIronRequestWithSession,
  res: NextApiResponse,
) => {
  await getTransactionStatus(req, res)
}

export default withSession(getTransactionStatusWithSession)
