import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '@/core/integration/connect'

export async function SellOfOffers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` })
  }

  const { tradeId, sellerId } = req.body

  if (!tradeId || !sellerId) {
    return res.status(400).json({ success: false, message: 'tradeId e sellerId são obrigatórios.' })
  }

  try {
    const { db, client} = await dbConnect()
    const buyOffersCollection = db.collection('buy_offers')
    const itemsCollection = db.collection('tvl-novision')
    const userItemsCollection = db.collection('items')
    const transactionsCollection = db.collection('transactions')
    const inventoryCollection = db.collection('inventory')

    // Buscar a oferta de compra
    const buyOffer = await buyOffersCollection.findOne({
      _id: tradeId,
      active: true,
      expiresAt: { $gt: new Date() }
    })

    if (!buyOffer) {
      return res.status(404).json({ success: false, message: 'Oferta de compra não encontrada ou expirada.' })
    }

    // Verificar se não é o próprio comprador
    if (buyOffer.userId === sellerId) {
      return res.status(400).json({ success: false, message: 'Você não pode vender para sua própria oferta.' })
    }

    // Buscar item do vendedor que corresponda à oferta
    const sellerItem = await itemsCollection.findOne({
      userId: sellerId,
      id: buyOffer.itemId,
      sold: false
    })

    if (!sellerItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Você não possui este item ou ele já foi vendido.' 
      })
    }

    // Verificar saldo do comprador
    const buyer = await userItemsCollection.findOne({ id: buyOffer.userId })
    if (!buyer || buyer.bits < buyOffer.offerPrice) {
      return res.status(400).json({ success: false, message: 'Comprador não tem saldo suficiente.' })
    }

    // Buscar dados do vendedor
    const seller = await userItemsCollection.findOne({ id: sellerId })
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Vendedor não encontrado.' })
    }

    const session = client.startSession()
    
    try {
      await session.withTransaction(async () => {
        // Debitar do comprador
        await userItemsCollection.updateOne(
          { id: buyOffer.userId },
          { $inc: { bits: -buyOffer.offerPrice } },
          { session }
        )

        // Creditar ao vendedor
        await userItemsCollection.updateOne(
          { id: sellerId },
          { $inc: { bits: buyOffer.offerPrice } },
          { session }
        )

        // Transferir o item
        await itemsCollection.updateOne(
          { tokenID: sellerItem.tokenID },
          { 
            $set: { 
              userId: buyOffer.userId,
              sold: false,
              soldAt: new Date(),
              previousOwner: sellerId
            },
            $push: {
              previousOwners: sellerId
            }
          },
          { session }
        )

        // Atualizar inventário do comprador
        const buyerInventory = await inventoryCollection.findOne({ userId: buyOffer.userId })
        if (buyerInventory) {
          // Adicionar item ao inventário do comprador
          await inventoryCollection.updateOne(
            { userId: buyOffer.userId },
            {
              $push: {
                items: {
                  id: sellerItem.id,
                  tokenID: sellerItem.tokenID,
                  acquiredAt: new Date()
                }
              }
            },
            { session }
          )
        }

        // Remover item do inventário do vendedor
        await inventoryCollection.updateOne(
          { userId: sellerId },
          {
            $pull: {
              items: { tokenID: sellerItem.tokenID }
            }
          },
          { session }
        )

        // Marcar oferta como completada
        await buyOffersCollection.updateOne(
          { _id: tradeId },
          { 
            $set: { 
              active: false,
              completedAt: new Date(),
              sellerId,
              finalPrice: buyOffer.offerPrice,
              status: 'completed'
            }
          },
          { session }
        )

        // Registrar a transação
        await transactionsCollection.insertOne({
          type: 'buy_offer_accepted',
          sellerId,
          buyerId: buyOffer.userId,
          itemId: sellerItem.tokenID,
          itemName: sellerItem.nameitem || 'Item',
          amount: buyOffer.offerPrice,
          createdAt: new Date(),
          status: 'completed'
        }, { session })

        // Atualizar histórico de valor do item
        const marketPriceCollection = db.collection('tvl-marketprice')
        await marketPriceCollection.updateOne(
          { id: sellerItem.id },
          {
            $push: {
              valueHistory: {
                newValue: buyOffer.offerPrice,
                timestamp: new Date().toISOString(),
                type: 'buy_offer_accepted'
              }
            }
          },
          { upsert: true, session }
        )
      })

      res.status(200).json({
        success: true,
        message: 'Item vendido com sucesso para a oferta de compra!',
        transaction: {
          itemId: sellerItem.tokenID,
          price: buyOffer.offerPrice,
          sellerId,
          buyerId: buyOffer.userId
        }
      })

    } catch (transactionError) {
      console.error('Erro na transação:', transactionError)
      res.status(500).json({ success: false, message: 'Erro ao processar a venda.' })
    } finally {
      await session.endSession()
    }

  } catch (error) {
    console.error('Erro ao vender para oferta:', error)
    res.status(500).json({ success: false, message: 'Erro ao processar a venda.' })
  }
}
