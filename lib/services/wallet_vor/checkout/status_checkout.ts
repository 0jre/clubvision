import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import type { NextApiHandler } from "next"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

interface CheckoutStatusResponse {
  success: boolean
  message: string
  data?: {
    activeCheckouts: Array<{
      orderId: string
      status: string
      createdAt: Date
      expiresAt: Date
      timeRemaining: number
      totalAmount: number
      totalWithFees: number
      itemCount: number
      cartItems?: Array<{
        id: number
        nameitem: string
        priceitem: number
        imagem: string
        quantity: number
        type: string | null
        rarity: string
      }>
      cancelledAt?: Date
      cancelReason?: string
      completedAt?: Date
      transactionId?: string
      hasEnoughBalance?: boolean
      userBalance?: number
    }>
    totalActive: number
    canCreateNew: boolean
    allSessions?: Array<{
      orderId: string
      status: string
      createdAt: Date
      expiresAt: Date
      timeRemaining: number
      totalAmount: number
      totalWithFees: number
      itemCount: number
      cartItems?: Array<{
        id: number
        nameitem: string
        priceitem: number
        imagem: string
        quantity: number
        type: string | null
        rarity: string
      }>
      cancelledAt?: Date
      cancelReason?: string
      completedAt?: Date
      transactionId?: string
      hasEnoughBalance?: boolean
      userBalance?: number
    }>
  }
  error?: string
}

const getCheckoutStatus: NextApiHandler = async (
  req: NextIronRequestWithSession,
  res: NextApiResponse<CheckoutStatusResponse>,
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

    const userId = sessionUser.id
    const { includeAll } = req.query
    const { db } = await dbConnect()
    const checkoutCollection = db.collection("checkout-sessions")

    const now = new Date()

    // Limpar checkouts expirados apenas se não for includeAll
    if (includeAll !== "true") {
      await checkoutCollection.deleteMany({
        userId,
        expiresAt: { $lte: now },
        status: { $in: ["pending", "processing"] },
      })
    }

    // Buscar sessões baseado no parâmetro includeAll
    const query: any = { userId }

    if (includeAll !== "true") {
      // Buscar apenas sessões ativas
      query.status = { $in: ["pending", "processing"] }
      query.expiresAt = { $gt: now }
    }

    const sessions = await checkoutCollection.find(query).sort({ createdAt: -1 }).toArray()

    const formattedSessions = sessions.map((checkout) => {
      const expiresAt = checkout.expiresAt
    ? new Date(checkout.expiresAt)
    : null

  const timeRemaining = expiresAt
    ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000))
    : 0


      return {
        orderId: checkout.orderId,
        status: checkout.status,
        createdAt: checkout.createdAt,
        expiresAt: checkout.expiresAt,
        timeRemaining,
        totalAmount: checkout.totalAmount || 0,
        totalWithFees: checkout.totalWithFees || checkout.totalAmount || 0,
        itemCount: checkout.cartItems ? checkout.cartItems.length : 0,
        cartItems: checkout.cartItems || [],
        cancelledAt: checkout.cancelledAt,
        cancelReason: checkout.cancelReason,
        completedAt: checkout.completedAt,
        transactionId: checkout.transactionId,
        hasEnoughBalance: checkout.hasEnoughBalance,
        userBalance: checkout.userBalance,
      }
    })

    // Filtrar apenas sessões ativas para o campo activeCheckouts
    const activeCheckouts = formattedSessions.filter(
      (session) => ["pending", "processing"].includes(session.status) && session.timeRemaining > 0,
    )

    // Determinar se pode criar novo checkout
    const canCreateNew =
      activeCheckouts.length === 0 ||
      activeCheckouts.every((checkout) => {
        const timeRemaining = checkout.expiresAt ? checkout.expiresAt.getTime() - now.getTime() : 0
        return timeRemaining < 25 * 60 * 1000 // Menos de 25 minutos restantes
      })

    const responseData: any = {
      activeCheckouts,
      totalActive: activeCheckouts.length,
      canCreateNew,
    }

    // Se includeAll for true, adicionar todas as sessões
    if (includeAll === "true") {
      responseData.allSessions = formattedSessions
    }

    return res.status(200).json({
      success: true,
      message: "Status dos checkouts recuperado com sucesso",
      data: responseData,
    })
  } catch (error) {
    console.error("Erro ao buscar status do checkout:", error)

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}

const getCheckoutStatusWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await getCheckoutStatus(req, res)
}

export default withSession(getCheckoutStatusWithSession)
