import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import type { NextApiHandler } from "next"
import { getItemsForCaseZX } from "@/types/clubstore/list.opencontainer"
import {
  generateTokenID,
  determineItemCondition,
  calculateItemValue,
  generateTransactionId,
  validateCartItem,
  getBalanceFieldsForCard,
  distributeAmountAcrossFields,
  isCardUsable,
} from "@/hooks/.config/cardUtils"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

interface FinalizePurchaseRequest {
  orderId: string
  paymentMethod: "wallet" | "card"
  cardId?: string
}

interface FinalizePurchaseResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    purchasedItems: number
    failedItems: number
    totalAmount: number
    paidAmount: number
    pendingAmount: number
    newBalance: number
    paymentMethod: string
    cardUsed?: string
    status: "completed" | "partial" | "pending" | "failed"
    redirectUrl?: string
  }
  error?: string
}

interface CardTransaction {
  id: string
  userId: string
  cardId: string
  cardType: string
  type: "payment" | "refund" | "fee" | "autopay"
  amount: number
  currency: string
  merchant?: string
  description: string
  status: "pending" | "completed" | "failed" | "cancelled"
  timestamp: Date
  orderId?: string
  transactionId?: string
  metadata?: any
}

const XP_PER_PURCHASE = 50

const flexibleFinalizePurchase: NextApiHandler = async (
  req: NextIronRequestWithSession,
  res: NextApiResponse<FinalizePurchaseResponse>,
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
    const { orderId, paymentMethod, cardId }: FinalizePurchaseRequest = req.body

    if (!orderId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Dados de finalização inválidos.",
      })
    }

    // Validar método de pagamento
    if (paymentMethod === "card" && !cardId) {
      return res.status(400).json({
        success: false,
        message: "ID do cartão é obrigatório para pagamento com cartão.",
      })
    }

    const { db, client } = await dbConnect()
    const checkoutCollection = db.collection("checkout-sessions")
    const userItemsCollection = db.collection("items")
    const inventoryCollection = db.collection("inventory")
    const novisionCollection = db.collection("tvl-novision")
    const transactionsCollection = db.collection("transactions")
    const marketpriceCollection = db.collection("tvl-marketprice")
    const memberStatsCollection = db.collection("member-stats")
    const notificationsCollection = db.collection("notifications")
    const cardTransactionsCollection = db.collection("card_transactions")

    // Buscar sessão de checkout
    const checkoutSession = await checkoutCollection.findOne({ orderId, userId })
    if (!checkoutSession) {
      return res.status(404).json({
        success: false,
        message: "Sessão de checkout não encontrada.",
        data: {
          transactionId: "",
          purchasedItems: 0,
          failedItems: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          newBalance: 0,
          paymentMethod,
          status: "failed" as const,
          redirectUrl: `/checkout/error?code=session_not_found&order=${orderId}`,
        },
      })
    }

    // Verificações básicas de sessão
    if (checkoutSession.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Sessão de checkout expirada.",
        data: {
          transactionId: "",
          purchasedItems: 0,
          failedItems: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          newBalance: 0,
          paymentMethod,
          status: "failed" as const,
          redirectUrl: `/checkout/error?code=session_expired&order=${orderId}`,
        },
      })
    }

    if (checkoutSession.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Pedido já foi processado.",
        data: {
          transactionId: checkoutSession.transactionId || "",
          purchasedItems: checkoutSession.purchasedItems || 0,
          failedItems: checkoutSession.failedItems || 0,
          totalAmount: checkoutSession.totalWithFees || 0,
          paidAmount: checkoutSession.paidAmount || 0,
          pendingAmount: checkoutSession.pendingAmount || 0,
          newBalance: 0,
          paymentMethod,
          status: "completed" as const,
          redirectUrl: `/checkout/success?txn=${checkoutSession.transactionId}`,
        },
      })
    }

    const { cartItems, totalWithFees } = checkoutSession

    // Validar itens do carrinho
    for (const item of cartItems) {
      const validation = validateCartItem(item)
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: `Item inválido: ${validation.error}`,
          data: {
            transactionId: "",
            purchasedItems: 0,
            failedItems: cartItems.length,
            totalAmount: totalWithFees,
            paidAmount: 0,
            pendingAmount: totalWithFees,
            newBalance: 0,
            paymentMethod,
            status: "failed" as const,
            redirectUrl: `/checkout/error?code=invalid_items&order=${orderId}`,
          },
        })
      }
    }

    // Buscar dados do usuário
    const user = await userItemsCollection.findOne({ id: userId })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado.",
        data: {
          transactionId: "",
          purchasedItems: 0,
          failedItems: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          newBalance: 0,
          paymentMethod,
          status: "failed" as const,
          redirectUrl: `/checkout/error?code=user_not_found&order=${orderId}`,
        },
      })
    }

    // Determinar método de pagamento e calcular saldo disponível
    let availableBalance = 0
    let debitFields: Array<{ field: string; amount: number }> = []
    let cardUsed = ""
    let selectedCard: any = null
    let isAutoPayment = false
    let dailySpent = 0

    // Conversão: 1 Bit = 100 Orbs (VisionPay)
    let adjustedTotalWithFees = totalWithFees
    if (
      paymentMethod === "card" &&
      cardId &&
      user?.visioncard?.find((c: any) => c.cardNumber === cardId)?.type === "VisionPay"
    ) {
      adjustedTotalWithFees = totalWithFees * 100 // Bits para Orbs
    }

    if (paymentMethod === "wallet") {
      // Pagamento com carteira digital - usa todos os saldos
      const balanceFields = getBalanceFieldsForCard("wallet", user)
      availableBalance = balanceFields.reduce((sum, field) => sum + field.balance, 0)
      debitFields = distributeAmountAcrossFields(Math.min(availableBalance, totalWithFees), balanceFields)
      cardUsed = "Carteira Digital"
    } else if (paymentMethod === "card" && cardId) {
      // Buscar cartão Vision
      const existingCards = user.visioncard || []
      selectedCard = existingCards.find((card: any) => card.cardNumber === cardId)

      if (!selectedCard) {
        return res.status(400).json({
          success: false,
          message: "Cartão selecionado não encontrado.",
          data: {
            transactionId: "",
            purchasedItems: 0,
            failedItems: 0,
            totalAmount: totalWithFees,
            paidAmount: 0,
            pendingAmount: totalWithFees,
            newBalance: 0,
            paymentMethod,
            status: "failed" as const,
            redirectUrl: `/checkout/error?code=card_not_found&order=${orderId}`,
          },
        })
      }

      // Validar se o cartão pode ser usado
      const cardValidation = isCardUsable(selectedCard)
      if (!cardValidation.usable) {
        return res.status(400).json({
          success: false,
          message: cardValidation.reason || "Cartão não pode ser usado.",
          data: {
            transactionId: "",
            purchasedItems: 0,
            failedItems: 0,
            totalAmount: totalWithFees,
            paidAmount: 0,
            pendingAmount: totalWithFees,
            newBalance: 0,
            paymentMethod,
            status: "failed" as const,
            redirectUrl: `/checkout/error?code=card_unusable&order=${orderId}`,
          },
        })
      }

      // Verificar limites diários se o cartão estiver ativo
      if (selectedCard.status === "active") {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const dailyTransactions = await cardTransactionsCollection
          .aggregate([
            {
              $match: {
                userId,
                cardId: selectedCard.cardNumber,
                timestamp: { $gte: today },
                status: "completed",
                type: { $in: ["payment", "autopay"] },
              },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ])
          .toArray()

        dailySpent = dailyTransactions[0]?.total || 0

        const reformsCollection = db.collection("reforms")
        const isPrime = !!(await reformsCollection.findOne({ userId, prime: true }))

        const dailyLimit = isPrime ? 8_000_000 : 50_000 // 8 milhões para prime, 50 mil para não prime

        if (dailySpent + totalWithFees > dailyLimit) {
          return res.status(400).json({
            success: false,
            message: `Limite diário do cartão excedido. Limite: ${dailyLimit} Bits, Gasto hoje: ${dailySpent} Bits`,
            data: {
              transactionId: "",
              purchasedItems: 0,
              failedItems: 0,
              totalAmount: totalWithFees,
              paidAmount: 0,
              pendingAmount: totalWithFees,
              newBalance: 0,
              paymentMethod,
              status: "failed" as const,
              redirectUrl: `/checkout/error?code=daily_limit_exceeded&order=${orderId}`,
            },
          })
        }
      }

      // Verificar se é pagamento automático
      isAutoPayment = selectedCard.autoPaymentEnabled === true

      // Determinar saldo baseado no tipo do cartão Vision
      const balanceFields = getBalanceFieldsForCard(selectedCard.type, user)
      availableBalance = balanceFields.reduce((sum, field) => sum + field.balance, 0)
      debitFields = distributeAmountAcrossFields(
        Math.min(availableBalance, selectedCard.type === "VisionPay" ? adjustedTotalWithFees : totalWithFees),
        balanceFields,
      )
      cardUsed = `${selectedCard.type} Card`
    }

    // Calcular valores pagos e pendentes
    const totalDebitAmount = debitFields.reduce((sum, debit) => sum + debit.amount, 0)
    const paidAmount = totalDebitAmount
    const pendingAmount =
      (paymentMethod === "card" && selectedCard?.type === "VisionPay" ? adjustedTotalWithFees : totalWithFees) -
      paidAmount


    // VERIFICAÇÃO CRÍTICA: Se não há saldo suficiente, falhar a compra
    if (paidAmount === 0) {
      return res.status(402).json({
        success: false,
        message: `Saldo insuficiente. Você precisa de ${totalWithFees} Bits, mas tem apenas ${availableBalance} Bits disponíveis.`,
        data: {
          transactionId: "",
          purchasedItems: 0,
          failedItems: cartItems.length,
          totalAmount: totalWithFees,
          paidAmount: 0,
          pendingAmount: totalWithFees,
          newBalance: availableBalance,
          paymentMethod,
          cardUsed,
          status: "failed" as const,
          redirectUrl: `/checkout/error?code=insufficient_funds&order=${orderId}&required=${totalWithFees}&available=${availableBalance}`,
        },
      })
    }

    // Se há valor pendente, verificar se permite pagamento parcial
    if (pendingAmount > 0) {
      // Por enquanto, não permitir pagamentos parciais
      return res.status(402).json({
        success: false,
        message: `Saldo insuficiente para compra completa. Necessário: ${totalWithFees} Bits, Disponível: ${availableBalance} Bits.`,
        data: {
          transactionId: "",
          purchasedItems: 0,
          failedItems: cartItems.length,
          totalAmount: totalWithFees,
          paidAmount: 0,
          pendingAmount: totalWithFees,
          newBalance: availableBalance,
          paymentMethod,
          cardUsed,
          status: "failed" as const,
          redirectUrl: `/checkout/error?code=insufficient_funds&order=${orderId}&required=${totalWithFees}&available=${availableBalance}`,
        },
      })
    }

    // Iniciar transação apenas se há saldo suficiente
    const mongoSession = client.startSession()

    try {
      let transactionId = ""
      let purchasedItemsCount = 0
      let failedItemsCount = 0
      const newBalance = availableBalance - totalDebitAmount

      await mongoSession.withTransaction(async () => {
        const purchasedItems = []
        const failedItems = []

        // Processar itens do carrinho APENAS se o pagamento for completo
        for (const cartItem of cartItems) {
          try {
            for (let i = 0; i < cartItem.quantity; i++) {
              const itemResult = await processCartItem(db, userId, cartItem, marketpriceCollection, mongoSession)

              if (itemResult.success) {
                const newItem = {
                  ...cartItem,
                  uid: itemResult.uid,
                  itemValue: itemResult.itemValue,
                  itemCondition: itemResult.itemCondition,
                  registeredAt: new Date(),
                  userId,
                  sold: false,
                  previousOwners: [],
                  paymentStatus: "paid",
                }
 
             const rentalDays = cartItem.rentalDays || 7; // Padrão de 7 dias para aluguel, pode ser ajustado conforme necessário
             const now = new Date();
             const expiresAt = new Date(now.getTime() + rentalDays * 24 * 60 * 60 * 1000);

await inventoryCollection.updateOne(
  { userId },
  {
    $push: {
      mytvls: {
        id: cartItem.id,
        uid: itemResult.uid,
        paymentStatus: "paid",
        rented: true, // opcional, para identificar que é aluguel
        expiresAt,    // data de expiração
        isActive: true,
        used: false,  // para uso único
      },
    },
  },
  { upsert: true, session: mongoSession },
)

                // Registrar na coleção novision
                await novisionCollection.insertOne(
                  {
                    userId,
                    id: cartItem.id,
                    tokenID: itemResult.uid,
                    createdAt: new Date(),
                    editionNumber: false,
                    totalEditions: 1,
                    type: "Concessionaria",
                    itemValue: itemResult.itemValue,
                    itemCondition: itemResult.itemCondition,
                    previousOwners: [],
                    paymentStatus: "paid",
                  },
                  { session: mongoSession },
                )

                purchasedItems.push(newItem)
              } else {
                failedItems.push({
                  ...cartItem,
                  error: itemResult.error,
                })
              }
            }
          } catch (itemError) {
            failedItems.push({
              ...cartItem,
              error: "Erro interno ao processar item",
            })
          }
        }

        // Verificar se pelo menos um item foi processado
        if (purchasedItems.length === 0) {
          throw new Error("Nenhum item foi processado com sucesso")
        }

        // Executar débitos
        console.log(`[CHECKOUT] Executando débitos...`)

        const updateOperations: any = { $inc: {}, $set: {} }

        for (const debit of debitFields) {
          if (debit.amount > 0) {
            updateOperations.$inc[debit.field] = -debit.amount
            console.log(`[CHECKOUT] - Debitando ${debit.amount} de ${debit.field}`)
          }
        }

        updateOperations.$set.lastPurchaseAt = new Date()

        const updateResult = await userItemsCollection.updateOne({ id: userId }, updateOperations, {
          session: mongoSession,
        })

        if (updateResult.matchedCount === 0) {
          throw new Error("Usuário não encontrado durante o débito")
        }

        console.log(`[CHECKOUT] Débitos executados com sucesso!`)

        // Gerar ID da transação
        transactionId = generateTransactionId()

        // Status da transação (sempre completed se chegou até aqui)
        const transactionStatus = "completed"

        // Registrar transação
        await transactionsCollection.insertOne(
          {
            transactionId,
            type: "Concessionaria",
            userId,
            orderId,
            paymentMethod,
            cardUsed,
            totalAmount: checkoutSession.totalAmount,
            totalWithFees,
            paidAmount,
            pendingAmount: 0, // Sempre 0 se chegou até aqui
            itemCount: purchasedItems.length,
            failedItemCount: failedItems.length,
            items: purchasedItems.map((item) => ({
              id: item.id,
              name: item.nameitem,
              price: item.priceitem,
              uid: item.uid,
              value: item.itemValue,
              paymentStatus: item.paymentStatus,
            })),
            createdAt: new Date(),
            status: transactionStatus,
            paymentDetails: {
              method: paymentMethod,
              cardType: selectedCard?.type || null,
              cardNumber: selectedCard?.cardNumber || null,
              debitBreakdown: debitFields,
            },
          },
          { session: mongoSession },
        )

        // Registrar transação específica do cartão se pagamento foi com cartão
        if (paymentMethod === "card" && selectedCard) {
          const cardTransaction: CardTransaction = {
            id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId,
            cardId: selectedCard.cardNumber,
            cardType: selectedCard.type,
            type: isAutoPayment ? "autopay" : "payment",
            amount: totalDebitAmount,
            currency: selectedCard.type === "VisionPay" ? "Orbs" : "Bits",
            merchant: "Club Market",
            description: `${isAutoPayment ? "Auto-" : ""}Compra de ${purchasedItems.length} ${purchasedItems.length === 1 ? "item" : "itens"} - Pedido #${orderId}`,
            status: "completed",
            timestamp: new Date(),
            orderId,
            transactionId,
            metadata: {
              itemCount: purchasedItems.length,
              failedItemCount: failedItems.length,
              paymentBreakdown: debitFields,
              cardHolder: selectedCard.cardHolder || "N/A",
              purchaseType: "Concessionaria",
              isAutoPayment,
              cardStatus: selectedCard.status,
              dailyLimitUsed: dailySpent + totalDebitAmount,
              dailyLimit: selectedCard.securitySettings?.dailyLimit || 10000,
            },
          }

          await cardTransactionsCollection.insertOne(cardTransaction, { session: mongoSession })

          console.log(
            `[CHECKOUT] Transação do cartão registrada: ${cardTransaction.id} (${isAutoPayment ? "Auto-pagamento" : "Pagamento manual"})`,
          )
        }

        // Atualizar estatísticas do membro
        await memberStatsCollection.updateOne(
          { member_id: userId },
          {
            $inc: {
              xp: XP_PER_PURCHASE * purchasedItems.length,
              clubactivity: XP_PER_PURCHASE * purchasedItems.length,
              totalPurchases: 1,
              totalSpent: paidAmount,
            },
            $set: {
              lastPurchaseAt: new Date(),
              lastPaymentMethod: paymentMethod,
              lastCardUsed: cardUsed,
            },
          },
          { upsert: true, session: mongoSession },
        )

        // Atualizar sessão de checkout
        await checkoutCollection.updateOne(
          { orderId, userId },
          {
            $set: {
              status: "completed",
              transactionId,
              paymentMethod,
              cardUsed,
              paidAmount,
              pendingAmount: 0,
              completedAt: new Date(),
              purchasedItems: purchasedItems.length,
              failedItems: failedItems.length,
            },
          },
          { session: mongoSession },
        )

        // Criar notificação de sucesso
        const notificationMessage = `Compra realizada com sucesso! Você adquiriu ${purchasedItems.length} itens usando ${cardUsed}. Valor total: ${paidAmount.toFixed(2)} Bits.`

        const notification = {
          userId,
          type: "purchase",
          title: "Compra Realizada",
          message: notificationMessage,
          timestamp: new Date(),
          data: {
            transactionId,
            purchasedCount: purchasedItems.length,
            failedCount: failedItems.length,
            totalAmount: totalWithFees,
            paidAmount,
            pendingAmount: 0,
            paymentMethod,
            cardUsed,
            status: transactionStatus,
          },
        }

        await notificationsCollection.insertOne(notification, { session: mongoSession })

        purchasedItemsCount = purchasedItems.length
        failedItemsCount = failedItems.length
      })

      // Sucesso completo
      return res.status(200).json({
        success: true,
        message: `Compra finalizada com sucesso! ${purchasedItemsCount} itens adquiridos usando ${cardUsed}.`,
        data: {
          transactionId,
          purchasedItems: purchasedItemsCount,
          failedItems: failedItemsCount,
          totalAmount: totalWithFees,
          paidAmount,
          pendingAmount: 0,
          newBalance,
          paymentMethod,
          cardUsed,
          status: "completed",
          redirectUrl: `/checkout/success?txn=${transactionId}`,
        },
      })
    } catch (transactionError) {
      console.error("Erro na transação:", transactionError)

      return res.status(500).json({
        success: false,
        message: "Erro ao processar a compra.",
        error: transactionError instanceof Error ? transactionError.message : "Erro desconhecido",
        data: {
          transactionId: "",
          purchasedItems: 0,
          failedItems: cartItems.length,
          totalAmount: totalWithFees,
          paidAmount: 0,
          pendingAmount: totalWithFees,
          newBalance: availableBalance,
          paymentMethod,
          cardUsed,
          status: "failed" as const,
          redirectUrl: `/checkout/error?code=transaction_error&order=${orderId}`,
        },
      })
    } finally {
      await mongoSession.endSession()
    }
  } catch (error) {
    console.error("Erro ao finalizar compra:", error)

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
      data: {
        transactionId: "",
        purchasedItems: 0,
        failedItems: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        newBalance: 0,
        paymentMethod: req.body?.paymentMethod || "wallet",
        cardUsed: "",
        status: "failed" as const,
        redirectUrl: `/checkout/error?code=server_error&order=${req.body?.orderId || "unknown"}`,
      },
    })
  }
}

// Função para processar um item individual do carrinho
const processCartItem = async (db: any, userId: string, cartItem: any, marketpriceCollection: any, session: any) => {
  try {
    const clubUID = generateTokenID()
    const itemData = getItemsForCaseZX(cartItem.id)
    if (!itemData || itemData.length === 0) {
      return { success: false, error: "Dados do item não encontrados" }
    }

    const existingItem = await db.collection("tvl-novision").findOne(
      {
        id: cartItem.id,
        sold: true,
      },
      { session },
    )

    const previousOwners = existingItem ? existingItem.previousOwners || [] : []
    const itemCondition = determineItemCondition(previousOwners)
    const itemValue = await calculateItemValue(cartItem, previousOwners)

    await marketpriceCollection.updateOne(
      { id: cartItem.id },
      {
        $push: {
          valueHistory: {
            newValue: itemValue,
            timestamp: new Date(),
            type: "Concessionaria",
            purchasePrice: cartItem.priceitem,
          },
        },
      },
      { upsert: true, session },
    )

    return {
      success: true,
      uid: clubUID,
      itemValue,
      itemCondition,
    }
  } catch (error) {
    console.error("Erro ao processar item do carrinho:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

const flexibleFinalizePurchaseWithSession: NextIronHandler = async (
  req: NextIronRequestWithSession,
  res: NextApiResponse,
) => {
  await flexibleFinalizePurchase(req, res)
}

export default withSession(flexibleFinalizePurchaseWithSession)
