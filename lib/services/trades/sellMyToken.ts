import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

interface Item {
  _id: string
  userId: string
  id: number
  tokenID: string
  priceitem: number
  sold?: boolean
  advertised?: boolean
  adExpiration?: Date
}

interface UserItem {
  id: string
  bits: number
}

interface Trade {
  status: string
  mytvl1: Array<{ uid: string }>
  mytvl2: Array<{ uid: string }>
}

interface Advertisement {
  itemId: string
  userId: string
  price: number
  duration: number
  createdAt: Date
  expiresAt: Date
  active: boolean
}

export async function SellMyToken(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` })
  }

  const { userId, itemId, price, forTrade, sellType, adDuration } = req.body

  if (!userId || !itemId || typeof price !== "number") {
    return res.status(400).json({ success: false, message: "userId, itemId e price são obrigatórios." })
  }

  try {
    const { db } = await dbConnect()
    const itemsCollection = db.collection<Item>("tvl-novision")
    const userItemsCollection = db.collection<UserItem>("items")
    const tradesCollection = db.collection<Trade>("trades")
    const advertisementsCollection = db.collection<Advertisement>("advertisements")

    // Buscar o item primeiro
    const item = await itemsCollection.findOne({ tokenID: itemId, userId })

    if (!item) {
      return res.status(404).json({ success: false, message: "Item não encontrado." })
    }

    // Verifica se o item já foi vendido
    if (item.sold) {
      return res.status(400).json({ success: false, message: "Este item já foi vendido." })
    }

    // Verifica se o item está em um trade pendente
    const tradeExistente = await tradesCollection.findOne({
      status: "pendente",
      $or: [{ "mytvl1.uid": itemId }, { "mytvl2.uid": itemId }],
    })

    if (tradeExistente) {
      return res.status(400).json({
        success: false,
        message: "Este item está em negociação pendente. Rejeite ou aguarde o trade antes de vendê-lo.",
      })
    }

    // Processar baseado no tipo de venda
    switch (sellType) {
        case "advertise":
        // Criar anúncio no mercado
        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() + (adDuration || 7))

        await advertisementsCollection.insertOne({
          itemId,
          userId,
          price,
          duration: adDuration || 7,
          createdAt: new Date(),
          expiresAt: expirationDate,
          active: true,
        })

        // Marcar item como anunciado e vendido
        await itemsCollection.updateOne(
          { tokenID: itemId },
          {
            $set: {
              traded: false,
              sold: true,
              advertised: true,
              adExpiration: expirationDate,
              advertisedPrice: price,
            },
          },
        )

        // Creditar bits ao usuário
        const advertiseResult = await userItemsCollection.updateOne({ id: userId }, { $inc: { bits: price } })

        if (advertiseResult.modifiedCount === 0) {
          return res.status(404).json({ success: false, message: "Usuário não encontrado." })
        }

        return res.status(200).json({
          success: true,
          message: `Item anunciado no mercado por ${adDuration || 7} dias e bits creditados!`,
        })


      case "trade":
        // Trade/upgrader: marca sold + traded, NÃO credita bits
        await itemsCollection.updateOne({ tokenID: itemId }, { $set: { sold: true, traded: true } })

        return res.status(200).json({
          success: true,
          message: "Item marcado para upgrader. Não foi creditado bits.",
        })

     
    }
  } catch (error) {
    console.error("Erro ao processar o item:", error)
    res.status(500).json({ success: false, message: "Erro ao processar a venda." })
  }
}
