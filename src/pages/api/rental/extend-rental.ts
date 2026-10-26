import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

interface ExtendRentalRequest {
  itemId: string
  itemUid?: string
  extensionDays: number
  paymentMethod: "wallet" | "card"
  cardId?: string
}

interface ExtendRentalResponse {
  success: boolean
  message: string
  data?: {
    newExpirationDate: Date
    costPaid: number
    paymentMethod: string
    extensionDays: number
  }
}

const EXTENSION_COST_PER_DAY = 450 // 450 bits por dia

const extendRental = async (req: NextIronRequestWithSession, res: NextApiResponse<ExtendRentalResponse>) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Método não permitido",
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

    const { itemId, itemUid, extensionDays, paymentMethod, cardId }: ExtendRentalRequest = req.body

    if (!itemId || !extensionDays || extensionDays <= 0 || extensionDays > 30) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos. Extensão deve ser entre 1 e 30 dias.",
      })
    }

    const totalCost = extensionDays * EXTENSION_COST_PER_DAY
    const { db, client } = await dbConnect()

    // Verificar saldo do usuário
    const user = await db.collection("items").findOne({ id: sessionUser.id })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      })
    }

    if (user.bits < totalCost) {
      return res.status(402).json({
        success: false,
        message: `Saldo insuficiente. Necessário: ${totalCost} Bits, Disponível: ${user.bits} Bits`,
      })
    }

    const mongoSession = client.startSession()

    try {
      await mongoSession.withTransaction(async () => {
        // Debitar bits do usuário
        await db
          .collection("items")
          .updateOne({ id: sessionUser.id }, { $inc: { bits: -totalCost } }, { session: mongoSession })

        // Calcular nova data de expiração
        const extensionTime = extensionDays * 24 * 60 * 60 * 1000
        const newExpirationDate = new Date(Date.now() + extensionTime)

        // Atualizar item em rentedItems
        const rentedUpdate = await db.collection("inventory").updateOne(
          {
            userId: sessionUser.id,
            "rentedItems.itemId": itemId,
          },
          {
            $set: {
              "rentedItems.$.expiresAt": newExpirationDate,
              "rentedItems.$.isActive": true,
            },
          },
          { session: mongoSession },
        )

        // Se não encontrou em rentedItems, tentar em mytvls
        if (rentedUpdate.matchedCount === 0) {
          const mytvlsQuery = itemUid
            ? { userId: sessionUser.id, "mytvls.uid": itemUid }
            : { userId: sessionUser.id, "mytvls.id": itemId }

          const mytvlsUpdate = await db.collection("inventory").updateOne(
            mytvlsQuery,
            {
              $set: {
                "mytvls.$.expiresAt": newExpirationDate,
                "mytvls.$.isActive": true,
              },
            },
            { session: mongoSession },
          )

          if (mytvlsUpdate.matchedCount === 0) {
            throw new Error("Item de aluguel não encontrado")
          }
        }

        // Registrar transação
        const transaction = {
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          timestamp: new Date(),
          amount: totalCost,
          action: "extend_rental",
          status: "succeeded",
          currency: "bits",
          item: {
            itemId,
            itemUid,
            extensionDays,
            newExpirationDate,
          },
        }

        await db
          .collection("items")
          .updateOne({ id: sessionUser.id }, { $push: { transactions: transaction } }, { session: mongoSession })

        // Criar notificação
        const notification = {
          userId: sessionUser.id,
          type: "rental_extension",
          title: "Aluguel Estendido",
          message: `Aluguel estendido por ${extensionDays} dias. Novo vencimento: ${newExpirationDate.toLocaleDateString()}`,
          timestamp: new Date(),
        }

        await db.collection("notifications").insertOne(notification, { session: mongoSession })
      })

      const newExpirationDate = new Date(Date.now() + extensionDays * 24 * 60 * 60 * 1000)

      return res.status(200).json({
        success: true,
        message: `Aluguel estendido com sucesso por ${extensionDays} dias!`,
        data: {
          newExpirationDate,
          costPaid: totalCost,
          paymentMethod,
          extensionDays,
        },
      })
    } finally {
      await mongoSession.endSession()
    }
  } catch (error) {
    console.error("Erro ao estender aluguel:", error)
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor",
    })
  }
}

const extendRentalWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await extendRental(req, res)
}

export default withSession(extendRentalWithSession)
