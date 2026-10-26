import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '@/core/integration/connect'

export async function CancelOffers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` })
  }

  const { tradeId, userId } = req.body

  if (!tradeId || !userId) {
    return res.status(400).json({ success: false, message: 'tradeId e userId são obrigatórios.' })
  }

  try {
    const { db, client } = await dbConnect()
    const advertisements = db.collection('advertisements')
    const auctions = db.collection('auctions')
    const buyOffers = db.collection('buy_offers')
    const trades = db.collection('trades')
    const items = db.collection('tvl-novision')
    const bids = db.collection('bids')

    // 🔍 1. Cancelar Anúncio
    const advertisement = await advertisements.findOne({ _id: tradeId, userId, active: true })

    if (advertisement) {
      const session = client.startSession()
      try {
        await session.withTransaction(async () => {
          await advertisements.updateOne(
            { _id: tradeId },
            {
              $set: {
                active: false,
                cancelledAt: new Date(),
                status: 'cancelled',
              },
            },
            { session }
          )

          await items.updateOne(
            { tokenID: advertisement.itemId },
            {
              $set: {
                advertised: false,
                sold: false,
              },
              $unset: {
                adExpiration: '',
                advertisedPrice: '',
              },
            },
            { session }
          )
        })

        return res.status(200).json({ success: true, message: 'Anúncio cancelado com sucesso!' })
      } finally {
        await session.endSession()
      }
    }

    // 🔍 2. Cancelar Leilão
    const auction = await auctions.findOne({ _id: tradeId, userId, status: 'active' })

    if (auction) {
      const activeBids = await bids.find({ auctionId: tradeId, status: 'active' }).toArray()
      if (activeBids.length > 0) {
        return res.status(400).json({ success: false, message: 'Não é possível cancelar um leilão com lances ativos.' })
      }

      const session = client.startSession()
      try {
        await session.withTransaction(async () => {
          await auctions.updateOne(
            { _id: tradeId },
            { $set: { status: 'cancelled', cancelledAt: new Date() } },
            { session }
          )

          await items.updateOne(
            { tokenID: auction.itemId },
            { $set: { sold: false } },
            { session }
          )
        })

        return res.status(200).json({ success: true, message: 'Leilão cancelado com sucesso!' })
      } finally {
        await session.endSession()
      }
    }

    // 🔍 3. Cancelar Oferta de Compra
    const buyOffer = await buyOffers.findOne({ _id: tradeId, userId, active: true })

    if (buyOffer) {
      await buyOffers.updateOne(
        { _id: tradeId },
        {
          $set: {
            active: false,
            cancelledAt: new Date(),
            status: 'cancelled',
          },
        }
      )

      return res.status(200).json({ success: true, message: 'Oferta de compra cancelada com sucesso!' })
    }

    // 🔍 4. Cancelar Trade
    const trade = await trades.findOne({
      _id: tradeId,
      $or: [{ 'mytvl1.userId': userId }, { 'mytvl2.userId': userId }],
      status: 'pending',
    })

    if (trade) {
      const session = client.startSession()
      try {
        await session.withTransaction(async () => {
          await trades.updateOne(
            { _id: tradeId },
            {
              $set: {
                status: 'cancelled',
                cancelledAt: new Date(),
                cancelledBy: userId,
              },
            },
            { session }
          )

          const allItems = [
            ...(trade.mytvl1?.items || []),
            ...(trade.mytvl2?.items || []),
          ]

          for (const itemId of allItems) {
            await items.updateOne(
              { tokenID: itemId },
              {
                $set: {
                  sold: false,
                  traded: false,
                },
              },
              { session }
            )
          }
        })

        return res.status(200).json({ success: true, message: 'Trade cancelado com sucesso!' })
      } finally {
        await session.endSession()
      }
    }

    // ❌ Nenhuma negociação encontrada
    return res.status(404).json({
      success: false,
      message: 'Negociação não encontrada ou você não tem permissão para cancelá-la.',
    })
  } catch (error) {
    console.error('Erro ao cancelar negociação:', error)
    return res.status(500).json({ success: false, message: 'Erro interno ao cancelar negociação.' })
  }
}
