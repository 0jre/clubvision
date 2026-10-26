import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '@/core/integration/connect'

export async function Bid(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` })
  }

  const { tradeId, bidderId, bidAmount } = req.body

  if (!tradeId || !bidderId || typeof bidAmount !== 'number') {
    return res.status(400).json({ success: false, message: 'tradeId, bidderId e bidAmount são obrigatórios.' })
  }

  try {
    const { db, client } = await dbConnect()
    const auctionsCollection = db.collection('auctions')
    const bidsCollection = db.collection('bids')
    const userItemsCollection = db.collection('items')
    const usersCollection = db.collection('users')

    // Buscar o leilão
    const auction = await auctionsCollection.findOne({
      _id: tradeId,
      status: 'active',
      endTime: { $gt: new Date() }
    })

    if (!auction) {
      return res.status(404).json({ success: false, message: 'Leilão não encontrado ou finalizado.' })
    }

    // Verificar se não é o próprio vendedor
    if (auction.userId === bidderId) {
      return res.status(400).json({ success: false, message: 'Você não pode dar lance no seu próprio leilão.' })
    }

    // Verificar se o lance é maior que o atual
    const currentBid = auction.currentBid || auction.startingBid
    if (bidAmount <= currentBid) {
      return res.status(400).json({ 
        success: false, 
        message: `O lance deve ser maior que ${currentBid.toLocaleString()}.` 
      })
    }

    // Verificar incremento mínimo
    const minIncrement = auction.minIncrement || Math.max(1000, currentBid * 0.05)
    if (bidAmount < currentBid + minIncrement) {
      return res.status(400).json({ 
        success: false, 
        message: `O lance mínimo é ${(currentBid + minIncrement).toLocaleString()}.` 
      })
    }

    // Verificar saldo do licitante
    const bidder = await userItemsCollection.findOne({ id: bidderId })
    if (!bidder || bidder.bits < bidAmount) {
      return res.status(400).json({ success: false, message: 'Saldo insuficiente.' })
    }

    // Buscar dados do usuário
    const bidderUser = await usersCollection.findOne({ id: bidderId })
    if (!bidderUser) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' })
    }

    // Verificar se o usuário já tem um lance ativo
    const existingBid = await bidsCollection.findOne({
      auctionId: tradeId,
      bidderId,
      status: 'active'
    })

   const session = client.startSession()
    
    try {
      await session.withTransaction(async () => {
        // Se já tem lance, liberar o valor anterior
        if (existingBid) {
          await userItemsCollection.updateOne(
            { id: bidderId },
            { $inc: { bits: existingBid.amount } },
            { session }
          )

          // Marcar lance anterior como superado
          await bidsCollection.updateOne(
            { _id: existingBid._id },
            { $set: { status: 'outbid' } },
            { session }
          )
        }

        // Reservar o valor do novo lance
        await userItemsCollection.updateOne(
          { id: bidderId },
          { $inc: { bits: -bidAmount } },
          { session }
        )

        // Registrar o novo lance
        await bidsCollection.insertOne({
          auctionId: tradeId,
          bidderId,
          bidderName: bidderUser.name,
          bidderAvatar: bidderUser.avatar,
          amount: bidAmount,
          timestamp: new Date(),
          status: 'active'
        }, { session })

        // Atualizar o leilão
        await auctionsCollection.updateOne(
          { _id: tradeId },
          { 
            $set: { 
              currentBid: bidAmount,
              currentBidderId: bidderId,
              currentBidderName: bidderUser.name,
              lastBidTime: new Date()
            },
            $inc: { bidCount: 1 }
          },
          { session }
        )

        // Se está próximo do fim, estender o tempo (anti-snipe)
        const timeLeft = auction.endTime.getTime() - new Date().getTime()
        if (timeLeft < 5 * 60 * 1000) { // Menos de 5 minutos
          const newEndTime = new Date(auction.endTime.getTime() + 5 * 60 * 1000)
          await auctionsCollection.updateOne(
            { _id: tradeId },
            { $set: { endTime: newEndTime } },
            { session }
          )
        }
      })

      res.status(200).json({
        success: true,
        message: 'Lance realizado com sucesso!',
        bid: {
          amount: bidAmount,
          bidderId,
          timestamp: new Date()
        }
      })

    } catch (transactionError) {
      console.error('Erro na transação:', transactionError)
      res.status(500).json({ success: false, message: 'Erro ao processar o lance.' })
    } finally {
      await session.endSession()
    }

  } catch (error) {
    console.error('Erro ao fazer lance:', error)
    res.status(500).json({ success: false, message: 'Erro ao processar o lance.' })
  }
}
