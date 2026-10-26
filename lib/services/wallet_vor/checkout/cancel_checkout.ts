import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import type { NextApiHandler } from "next"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

interface CancelCheckoutRequest {
  orderId?: string
  cancelAll?: boolean
}

interface CancelCheckoutResponse {
  success: boolean
  message: string
  data?: {
    cancelledCount: number
    cancelledOrders: string[]
  }
  error?: string
}

const cancelCheckout: NextApiHandler = async (
  req: NextIronRequestWithSession,
  res: NextApiResponse<CancelCheckoutResponse>,
) => {
  if (req.method !== "POST") {
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

    const userId = sessionUser.id
    const { orderId, cancelAll }: CancelCheckoutRequest = req.body

    const { db } = await dbConnect()
    const checkoutCollection = db.collection("checkout-sessions")

    const now = new Date()
    let query: any = {
      userId,
      status: { $in: ["pending", "processing"] },
    }

    if (!cancelAll && orderId) {
      query.orderId = orderId
    }

    // Buscar checkouts para cancelar
    const checkoutsToCancel = await checkoutCollection.find(query).toArray()

    if (checkoutsToCancel.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhum checkout ativo encontrado para cancelar.",
      })
    }

    // Cancelar checkouts
    const result = await checkoutCollection.updateMany(query, {
      $set: {
        status: "cancelled",
        cancelledAt: now,
        cancelReason: "User requested cancellation",
         activityLog: {
          action: "checkout_cancelled",
          timestamp: now,
          details: {
            reason: "User requested cancellation",
            cancelAll: !!cancelAll,
          },
        },
      },
    
    })

    const cancelledOrders = checkoutsToCancel.map((checkout) => checkout.orderId)

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} checkout(s) cancelado(s) com sucesso.`,
      data: {
        cancelledCount: result.modifiedCount,
        cancelledOrders,
      },
    })
  } catch (error) {
    console.error("Erro ao cancelar checkout:", error)

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}

const cancelCheckoutWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await cancelCheckout(req, res)
}

export default withSession(cancelCheckoutWithSession)
