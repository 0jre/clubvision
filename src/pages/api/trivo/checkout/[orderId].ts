import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import type { NextApiHandler } from "next"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

interface CheckoutDataResponse {
  success: boolean
  message: string
  data?: {
    orderId: string
    userId: number
    items: Array<{
      id: number
      nameitem: string
      priceitem: number
      quantity: number
      imagem?: string
      type?: string
      rarity?: string
    }>
    totalAmount: number
    totalWithFees: number
    status: string
    createdAt: Date
    updatedAt: Date
    expiresAt: Date
    userBalance: number
    bitsCredits: number
    orbitCredits: number
    hasEnoughBalance: boolean
    availableCards: any[]
    dataSource?: string
    lastActivity: Date
  }
  error?: string
}

const getCheckoutData: NextApiHandler = async (
  req: NextIronRequestWithSession,
  res: NextApiResponse<CheckoutDataResponse>,
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

    const { orderId } = req.query
    const userId = sessionUser.id

    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID do pedido inválido.",
      })
    }

    const { db } = await dbConnect()
    const checkoutCollection = db.collection("checkout-sessions")

    // Buscar dados do checkout
    const checkoutData = await checkoutCollection.findOne({
      orderId,
      userId,
    })

    if (!checkoutData) {
      return res.status(404).json({
        success: false,
        message: "Checkout não encontrado.",
      })
    }

    // Verificar se não expirou
    const now = new Date()
    if (checkoutData.expiresAt < now && checkoutData.status === "pending") {
      // Marcar como expirado
      await checkoutCollection.updateOne(
        { _id: checkoutData._id },
        {
          $set: {
            status: "expired",
            expiredAt: now,
          },
        },
      )

      return res.status(410).json({
        success: false,
        message: "Checkout expirado.",
      })
    }

    // Atualizar última atividade se ainda estiver ativo
    if (checkoutData.status === "pending") {
      await checkoutCollection.updateOne(
        { _id: checkoutData._id },
        {
          $set: {
            lastActivity: now,
          },
          $push: {
            activityLog: {
              action: "data_retrieved",
              timestamp: now,
              source: "api",
            },
          },
        },
      )
    }

    return res.status(200).json({
      success: true,
      message: "Dados do checkout recuperados com sucesso",
      data: {
        orderId: checkoutData.orderId,
        userId: checkoutData.userId,
        items: checkoutData.cartItems || [],
        totalAmount: checkoutData.totalAmount,
        totalWithFees: checkoutData.totalWithFees,
        status: checkoutData.status,
        createdAt: checkoutData.createdAt,
        updatedAt: checkoutData.updatedAt,
        expiresAt: checkoutData.expiresAt,
        userBalance: checkoutData.userBalance || 0,
        bitsCredits: checkoutData.bitsCredits || 0,
        orbitCredits: checkoutData.orbitCredits || 0,
        hasEnoughBalance: checkoutData.hasEnoughBalance || false,
        availableCards: checkoutData.availableCards || [],
        dataSource: checkoutData.dataSource,
        lastActivity: checkoutData.lastActivity || checkoutData.updatedAt,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar dados do checkout:", error)
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}

const getCheckoutDataWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await getCheckoutData(req, res)
}

export default withSession(getCheckoutDataWithSession)
