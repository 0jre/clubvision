import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '@/core/integration/connect'

export  async function EditOffers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` })
  }

  const { tradeId, userId, newPrice, newDuration } = req.body

  if (!tradeId || !userId || typeof newPrice !== 'number') {
    return res.status(400).json({ success: false, message: 'tradeId, userId e newPrice são obrigatórios.' })
  }

  try {
    const { db } = await dbConnect()
    const advertisementsCollection = db.collection('advertisements')
    const auctionsCollection = db.collection('auctions')
    const buyOffersCollection = db.collection('buy_offers')

    // Tentar encontrar em anúncios
    let advertisement = await advertisementsCollection.findOne({
      _id: tradeId,
      userId,
      active: true
    })

    if (advertisement) {
      const updateData: any = {
        price: newPrice,
        updatedAt: new Date()
      }

      // Se forneceu nova duração, atualizar expiração
      if (newDuration && typeof newDuration === 'number') {
        const newExpirationDate = new Date()
        newExpirationDate.setDate(newExpirationDate.getDate() + newDuration)
        updateData.expiresAt = newExpirationDate
        updateData.duration = newDuration
      }

      await advertisementsCollection.updateOne(
        { _id: tradeId },
        { $set: updateData }
      )

      return res.status(200).json({
        success: true,
        message: 'Anúncio atualizado com sucesso!'
      })
    }

    // Tentar encontrar em leilões
    let auction = await auctionsCollection.findOne({
      _id: tradeId,
      userId,
      status: 'active'
    })

    if (auction) {
      // Verificar se há lances
      const bidsCollection = db.collection('bids')
      const activeBids = await bidsCollection.countDocuments({
        auctionId: tradeId,
        status: 'active'
      })

      if (activeBids > 0) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível editar um leilão com lances ativos.'
        })
      }

      await auctionsCollection.updateOne(
        { _id: tradeId },
        { 
          $set: { 
            startingBid: newPrice,
            updatedAt: new Date()
          }
        }
      )

      return res.status(200).json({
        success: true,
        message: 'Leilão atualizado com sucesso!'
      })
    }

    // Tentar encontrar em ofertas de compra
    let buyOffer = await buyOffersCollection.findOne({
      _id: tradeId,
      userId,
      active: true
    })

    if (buyOffer) {
      const updateData: any = {
        offerPrice: newPrice,
        updatedAt: new Date()
      }

      if (newDuration && typeof newDuration === 'number') {
        const newExpirationDate = new Date()
        newExpirationDate.setDate(newExpirationDate.getDate() + newDuration)
        updateData.expiresAt = newExpirationDate
      }

      await buyOffersCollection.updateOne(
        { _id: tradeId },
        { $set: updateData }
      )

      return res.status(200).json({
        success: true,
        message: 'Oferta de compra atualizada com sucesso!'
      })
    }

    // Se chegou até aqui, não encontrou nada
    res.status(404).json({
      success: false,
      message: 'Negociação não encontrada ou você não tem permissão para editá-la.'
    })

  } catch (error) {
    console.error('Erro ao editar negociação:', error)
    res.status(500).json({ success: false, message: 'Erro ao editar negociação.' })
  }
}
