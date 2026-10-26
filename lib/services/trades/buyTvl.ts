import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '@/core/integration/connect'

export async function BuyTvl(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` })
  }

  const { tradeId, buyerId, price } = req.body

  if (!tradeId || !buyerId || typeof price !== 'number') {
    return res.status(400).json({ success: false, message: 'tradeId, buyerId e price são obrigatórios.' })
  }

  try {
    const { db, client } = await dbConnect()
    const itemsCollection = db.collection('tvl-novision')
    const advertisementsCollection = db.collection('advertisements')
    const userItemsCollection = db.collection('items')
    const transactionsCollection = db.collection('transactions')
    const usersCollection = db.collection('users')

    // Buscar o anúncio
    const advertisement = await advertisementsCollection.findOne({
      _id: tradeId,
      active: true,
      expiresAt: { $gt: new Date() }
    })

    if (!advertisement) {
      return res.status(404).json({ success: false, message: 'Anúncio não encontrado ou expirado.' })
    }

    // Verificar se não é o próprio vendedor
    if (advertisement.userId === buyerId) {
      return res.status(400).json({ success: false, message: 'Você não pode comprar seu próprio item.' })
    }

    // Buscar o item
    const item = await itemsCollection.findOne({
      tokenID: advertisement.itemId,
      userId: advertisement.userId
    })

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item não encontrado.' })
    }

    // Verificar se o item ainda está disponível
    if (item.sold && !item.advertised) {
      return res.status(400).json({ success: false, message: 'Este item já foi vendido.' })
    }

    // Verificar saldo do comprador
    const buyer = await userItemsCollection.findOne({ id: buyerId })
    if (!buyer || buyer.bits < price) {
      return res.status(400).json({ success: false, message: 'Saldo insuficiente.' })
    }

    // Buscar dados do vendedor
    const seller = await userItemsCollection.findOne({ id: advertisement.userId })
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Vendedor não encontrado.' })
    }

    // Iniciar transação
    const session = client.startSession()
    
    try {
      await session.withTransaction(async () => {
        // Debitar do comprador
        await userItemsCollection.updateOne(
          { id: buyerId },
          { $inc: { bits: -price } },
          { session }
        )

        // Creditar ao vendedor
        await userItemsCollection.updateOne(
          { id: advertisement.userId },
          { $inc: { bits: price } },
          { session }
        )

        // Transferir o item
        await itemsCollection.updateOne(
          { tokenID: advertisement.itemId },
          { 
            $set: { 
              userId: buyerId,
              sold: false,
              advertised: false,
              soldAt: new Date(),
              previousOwner: advertisement.userId
            },
            $push: {
              previousOwners: advertisement.userId
            }
          },
          { session }
        )

        // Desativar o anúncio
        await advertisementsCollection.updateOne(
          { _id: tradeId },
          { 
            $set: { 
              active: false,
              soldAt: new Date(),
              buyerId,
              finalPrice: price
            }
          },
          { session }
        )

        // Registrar a transação
        await transactionsCollection.insertOne({
          type: 'marketplace_sale',
          sellerId: advertisement.userId,
          buyerId,
          itemId: advertisement.itemId,
          itemName: item.nameitem || 'Item',
          amount: price,
          createdAt: new Date(),
          status: 'completed'
        }, { session })

        // Atualizar histórico de valor do item
        const marketPriceCollection = db.collection('tvl-marketprice')
        await marketPriceCollection.updateOne(
          { id: item.id },
          {
            $push: {
              valueHistory: {
                newValue: price,
                timestamp: new Date().toISOString(),
                type: 'marketplace_sale'
              }
            }
          },
          { upsert: true, session }
        )
      })

      res.status(200).json({
        success: true,
        message: 'Item comprado com sucesso!',
        transaction: {
          itemId: advertisement.itemId,
          price,
          sellerId: advertisement.userId,
          buyerId
        }
      })

    } catch (transactionError) {
      console.error('Erro na transação:', transactionError)
      res.status(500).json({ success: false, message: 'Erro ao processar a compra.' })
    } finally {
      await session.endSession()
    }

  } catch (error) {
    console.error('Erro ao comprar item:', error)
    res.status(500).json({ success: false, message: 'Erro ao processar a compra.' })
  }
}
