import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import type { NextApiHandler } from "next"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

interface CartItem {
  id: number
  nameitem: string
  priceitem: number
  imagem?: string
  quantity: number
  type?: string
  rarity?: string
}

interface CheckoutRequest {
  cartItems: CartItem[]
  totalAmount: number
  orderId: string
}

interface CheckoutResponse {
  success: boolean
  message: string
  code?: string // Added code field for specific error handling
  data?: {
    orderId: string
    totalAmount: number
    itemCount: number
    userBalance: number
    bitsCredits: number
    orbitCredits: number
    hasEnoughBalance: boolean
    items: CartItem[]
    estimatedDelivery: string
    fees: {
      networkFee: number
      serviceFee: number
      subtotal: number
      total: number
    }
    availableCards: Array<{
      cardNumber: string
      type: "VisionPay" | "Sapphire" | "VΛULT" | "BitsCredit" | "OrbitCredit"
      balance: string
      status: "active" | "frozen" | "suspended"
      cardHolder: string
    }>
    existingCheckout?: {
      found: boolean
      status: string
      createdAt: Date
      expiresAt: Date
      timeRemaining: number
      orderId?: string // Added orderId to existingCheckout
    }
  }
  error?: string
}

const enhancedProcessCheckout: NextApiHandler = async (
  req: NextIronRequestWithSession,
  res: NextApiResponse<CheckoutResponse>,
) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: `Método ${req.method} não permitido.`,
      code: "METHOD_NOT_ALLOWED",
    })
  }

  try {
    const sessionUser = req.session?.get("user")
    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
        code: "UNAUTHENTICATED",
      })
    }

    const userId = sessionUser.id
    const { cartItems, totalAmount, orderId }: CheckoutRequest = req.body

    // Validações básicas (mantidas do código original)
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Carrinho vazio ou inválido.",
        code: "CART_EMPTY_OR_INVALID",
      })
    }

    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valor total inválido.",
        code: "INVALID_TOTAL_AMOUNT",
      })
    }

    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID do pedido inválido.",
        code: "INVALID_ORDER_ID",
      })
    }

    const { db } = await dbConnect()
    const userItemsCollection = db.collection("items")
    const checkoutCollection = db.collection("checkout-sessions")
    const reformsCollection = db.collection("reforms")

    const now = new Date()

    // 1. Check if this specific orderId is already completed
    const completedCheckout = await checkoutCollection.findOne({
      orderId,
      userId,
      status: "completed",
    })
    if (completedCheckout) {
      return res.status(400).json({
        success: false,
        message: "Este pedido já foi processado com sucesso.",
        code: "ORDER_ALREADY_COMPLETED",
      })
    }

    // 2. Check if this specific orderId is already in progress (pending/processing)
    // If it is, return it as a success so the user can continue.
    const existingPendingOrder = await checkoutCollection.findOne({
      orderId,
      userId,
      status: { $in: ["pending", "processing"] },
      expiresAt: { $gt: now }, // Ensure it's not expired
    })

    if (existingPendingOrder) {
      // Update last activity and extend expiration to keep it alive if user is accessing it
      const newExpirationTime = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
      await checkoutCollection.updateOne(
        { _id: existingPendingOrder._id },
        { $set: { lastActivity: now, expiresAt: newExpirationTime } },
      )

      // Fetch user data and calculate balances/fees for the response
      const user = await userItemsCollection.findOne({ id: userId })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado.",
          code: "USER_NOT_FOUND",
        })
      }
      const userinfo = await reformsCollection.findOne({ userId })
      const fullName = `${userinfo?.firstname || "Usuário"} ${userinfo?.lastname || ""}`.trim()

      const userBalance = user?.bits || 0
      const bitsCredits = user?.bitsCredits || 0
      const orbitCredits = user?.orbitCredits || 0
      const banking = user?.banking || 0

      const existingCards = user?.visioncard || []
      const availableCards = []

      existingCards.forEach((card: any) => {
        let balance = "$0"
        let cardStatus = card.status || "active"
        if (cardStatus !== "frozen") {
          if (card.type === "VisionPay") {
            const total = banking + bitsCredits + orbitCredits
            balance = `$${total.toLocaleString()}`
          } else if (card.type === "Sapphire") {
            const total = userBalance + bitsCredits
            balance = `$${total.toLocaleString()}`
            if (total < 100000) {
              cardStatus = "limited"
            }
          } else if (card.type === "VΛULT") {
            const total = userBalance + bitsCredits + orbitCredits + banking
            balance = `$${total.toLocaleString()}`
          }
        }
        availableCards.push({
          cardNumber: card.cardNumber,
          type: card.type,
          balance,
          status: cardStatus,
          cardHolder: card.cardHolder || fullName,
        })
      })

      if (orbitCredits > 0) {
        availableCards.push({
          cardNumber: `orbit_${userId}_${Date.now()}`,
          type: "OrbitCredit" as const,
          balance: `$${orbitCredits.toLocaleString()}`,
          status: "active" as const,
          cardHolder: fullName,
        })
      }

      // Recalculate fees based on the existing order's totalAmount
      const networkFee = existingPendingOrder.totalAmount * 0.08
      const serviceFee = existingPendingOrder.totalAmount * 0.0001
      const subtotal = existingPendingOrder.totalAmount
      const totalWithFees = subtotal + networkFee + serviceFee

      const totalAvailableBalance = userBalance + bitsCredits + orbitCredits + banking
      const hasEnoughBalanceWithFees = totalAvailableBalance >= totalWithFees

      return res.status(200).json({
        success: true,
        message: "Continuando com pedido existente.",
        code: "CONTINUE_EXISTING_ORDER", // New code for frontend to recognize this state
        data: {
          orderId: existingPendingOrder.orderId,
          totalAmount: existingPendingOrder.totalAmount,
          itemCount: existingPendingOrder.cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
          userBalance,
          bitsCredits,
          orbitCredits,
          hasEnoughBalance: hasEnoughBalanceWithFees,
          items: existingPendingOrder.cartItems, // Use items from existing order
          estimatedDelivery: "Imediatamente após o pagamento",
          fees: {
            networkFee,
            serviceFee,
            subtotal,
            total: totalWithFees,
          },
          availableCards: availableCards.filter((card) => card.status === "active"),
          existingCheckout: {
            found: true,
            status: existingPendingOrder.status,
            createdAt: existingPendingOrder.createdAt,
            expiresAt: newExpirationTime, // Use the updated expiration time
            timeRemaining: Math.ceil((newExpirationTime.getTime() - now.getTime()) / 1000),
            orderId: existingPendingOrder.orderId,
          },
        },
      })
    }

    // 3. Clean up expired checkouts for the user
    await checkoutCollection.deleteMany({
      userId,
      expiresAt: { $lte: now },
      status: { $in: ["pending", "processing"] },
    })

    // 4. Check for any other active checkout by the same user (different orderId)
    const activeUserCheckout = await checkoutCollection.findOne({
      userId,
      status: { $in: ["pending", "processing"] },
      expiresAt: { $gt: now },
    })

    if (activeUserCheckout && activeUserCheckout.orderId !== orderId) {
      const timeRemaining = Math.max(0, activeUserCheckout.expiresAt.getTime() - now.getTime())

      // Fetch user data and calculate balances/fees for the response (for the error case)
      const user = await userItemsCollection.findOne({ id: userId })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado.",
          code: "USER_NOT_FOUND",
        })
      }
      const userinfo = await reformsCollection.findOne({ userId })
      const fullName = `${userinfo?.firstname || "Usuário"} ${userinfo?.lastname || ""}`.trim()

      const userBalance = user?.bits || 0
      const bitsCredits = user?.bitsCredits || 0
      const orbitCredits = user?.orbitCredits || 0
      const banking = user?.banking || 0

      const existingCards = user?.visioncard || []
      const availableCards = []

      existingCards.forEach((card: any) => {
        let balance = "$0"
        let cardStatus = card.status || "active"
        if (cardStatus !== "frozen") {
          if (card.type === "VisionPay") {
            const total = banking + bitsCredits + orbitCredits
            balance = `$${total.toLocaleString()}`
          } else if (card.type === "Sapphire") {
            const total = userBalance + bitsCredits
            balance = `$${total.toLocaleString()}`
            if (total < 100000) {
              cardStatus = "limited"
            }
          } else if (card.type === "VΛULT") {
            const total = userBalance + bitsCredits + orbitCredits + banking
            balance = `$${total.toLocaleString()}`
          }
        }
        availableCards.push({
          cardNumber: card.cardNumber,
          type: card.type,
          balance,
          status: cardStatus,
          cardHolder: card.cardHolder || fullName,
        })
      })

      if (orbitCredits > 0) {
        availableCards.push({
          cardNumber: `orbit_${userId}_${Date.now()}`,
          type: "OrbitCredit" as const,
          balance: `$${orbitCredits.toLocaleString()}`,
          status: "active" as const,
          cardHolder: fullName,
        })
      }

      // Recalculate fees based on the activeUserCheckout's totalAmount
      const networkFee = activeUserCheckout.totalAmount * 0.08
      const serviceFee = activeUserCheckout.totalAmount * 0.0001
      const subtotal = activeUserCheckout.totalAmount
      const totalWithFees = subtotal + networkFee + serviceFee

      const totalAvailableBalance = userBalance + bitsCredits + orbitCredits + banking
      const hasEnoughBalanceWithFees = totalAvailableBalance >= totalWithFees

      if (timeRemaining > 25 * 60 * 1000) {
        // If it's a long-standing pending checkout, block and suggest continuing/canceling it
        return res.status(409).json({
          success: false,
          message: `Você já tem um checkout em andamento. Aguarde ${Math.ceil(timeRemaining / 60000)} minutos ou cancele o checkout anterior.`,
          code: "ANOTHER_CHECKOUT_ACTIVE",
          data: {
            // Now includes all required fields
            orderId: activeUserCheckout.orderId,
            totalAmount: activeUserCheckout.totalAmount,
            itemCount: activeUserCheckout.cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
            userBalance,
            bitsCredits,
            orbitCredits,
            hasEnoughBalance: hasEnoughBalanceWithFees,
            items: activeUserCheckout.cartItems,
            estimatedDelivery: "Imediatamente após o pagamento",
            fees: {
              networkFee,
              serviceFee,
              subtotal,
              total: totalWithFees,
            },
            availableCards: availableCards.filter((card) => card.status === "active"),
            existingCheckout: {
              found: true,
              status: activeUserCheckout.status,
              createdAt: activeUserCheckout.createdAt,
              expiresAt: activeUserCheckout.expiresAt,
              timeRemaining: Math.ceil(timeRemaining / 1000),
              orderId: activeUserCheckout.orderId,
            },
          },
        })
      } else {
        // If it's a short-lived pending checkout, cancel it to allow the new one
        await checkoutCollection.updateOne(
          { _id: activeUserCheckout._id },
          {
            $set: {
              status: "cancelled",
              cancelledAt: now,
              cancelReason: "New checkout initiated",
            },
          },
        )
      }
    }

    // Buscar dados do usuário e cartões (moved here as it's needed for new checkout creation)
    const user = await userItemsCollection.findOne({ id: userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado.",
        code: "USER_NOT_FOUND",
      })
    }

    const userinfo = await reformsCollection.findOne({ userId })
    const fullName = `${userinfo?.firstname || "Usuário"} ${userinfo?.lastname || ""}`.trim()

    // Calcular saldos disponíveis
    const userBalance = user.bits || 0
    const bitsCredits = user.bitsCredits || 0
    const orbitCredits = user.orbitCredits || 0
    const banking = user.banking || 0

    // Buscar cartões Vision existentes
    const existingCards = user.visioncard || []

    // Criar cartões de crédito virtuais baseados nos saldos
    const availableCards = []

    // Adicionar cartões Vision existentes
    existingCards.forEach((card: any) => {
      let balance = "$0"
      let cardStatus = card.status || "active"

      if (cardStatus !== "frozen") {
        if (card.type === "VisionPay") {
          const total = banking + bitsCredits + orbitCredits
          balance = `$${total.toLocaleString()}`
        } else if (card.type === "Sapphire") {
          const total = userBalance + bitsCredits
          balance = `$${total.toLocaleString()}`
          if (total < 100000) {
            cardStatus = "limited"
          }
        } else if (card.type === "VΛULT") {
          const total = userBalance + bitsCredits + orbitCredits + banking
          balance = `$${total.toLocaleString()}`
        }
      }

      availableCards.push({
        cardNumber: card.cardNumber,
        type: card.type,
        balance,
        status: cardStatus,
        cardHolder: card.cardHolder || fullName,
      })
    })

    if (orbitCredits > 0) {
      availableCards.push({
        cardNumber: `orbit_${userId}_${Date.now()}`,
        type: "OrbitCredit" as const,
        balance: `$${orbitCredits.toLocaleString()}`,
        status: "active" as const,
        cardHolder: fullName,
      })
    }

    // Calculate fees for the new order
    const networkFee = totalAmount * 0.08 // 8% taxa de rede
    const serviceFee = totalAmount * 0.0001 // 0.1% taxa de serviço
    const subtotal = totalAmount
    const totalWithFees = subtotal + networkFee + serviceFee

    // Verificar se tem saldo suficiente (considerando todos os métodos)
    const totalAvailableBalance = userBalance + bitsCredits + orbitCredits + banking
    const hasEnoughBalanceWithFees = totalAvailableBalance >= totalWithFees

    // Gerenciar sessão de checkout (for new checkout creation)
    let checkoutData: any
    const expirationTime = new Date(Date.now() + 30 * 60 * 1000) // 30 minutos

    checkoutData = {
      orderId,
      userId,
      cartItems,
      totalAmount,
      totalWithFees,
      userBalance,
      bitsCredits,
      orbitCredits,
      hasEnoughBalance: hasEnoughBalanceWithFees,
      availableCards,
      createdAt: now,
      updatedAt: now,
      lastActivity: now,
      status: "pending",
      expiresAt: expirationTime,
      updateCount: 1,
      userAgent: req.headers["user-agent"] || "unknown",
      ipAddress: req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown",
    }

    await checkoutCollection.insertOne(checkoutData)

    // Registrar atividade do usuário
    await checkoutCollection.updateOne(
      { orderId, userId },
      {
        $push: {
          activityLog: {
            action: "checkout_prepared",
            timestamp: now,
            details: {
              itemCount: cartItems.length,
              totalAmount: totalWithFees,
              hasEnoughBalance: hasEnoughBalanceWithFees,
              availablePaymentMethods: availableCards.length,
            },
          },
        },
      },
    )

    // Retornar dados do checkout
    return res.status(200).json({
      success: true,
      message: "Checkout preparado com sucesso",
      data: {
        orderId,
        totalAmount,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        userBalance,
        bitsCredits,
        orbitCredits,
        hasEnoughBalance: hasEnoughBalanceWithFees,
        items: cartItems,
        estimatedDelivery: "Imediatamente após o pagamento",
        fees: {
          networkFee,
          serviceFee,
          subtotal,
          total: totalWithFees,
        },
        availableCards: availableCards.filter((card) => card.status === "active"),
        existingCheckout: {
          found: false, // This is a new checkout
          status: checkoutData.status,
          createdAt: checkoutData.createdAt,
          expiresAt: checkoutData.expiresAt,
          timeRemaining: Math.ceil((checkoutData.expiresAt.getTime() - now.getTime()) / 1000),
        },
      },
    })
  } catch (error) {
    console.error("Erro ao processar checkout:", error)

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
      code: "INTERNAL_SERVER_ERROR",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}

const enhancedProcessCheckoutWithSession: NextIronHandler = async (
  req: NextIronRequestWithSession,
  res: NextApiResponse,
) => {
  await enhancedProcessCheckout(req, res)
}

export default withSession(enhancedProcessCheckoutWithSession)
