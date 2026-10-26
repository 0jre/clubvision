import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '@/core/integration/connect'
import { encrypt } from '@/core/security/encryption'

export async function StatsTrades(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` })
  }

  const { userId } = req.query

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ success: false, message: 'userId é obrigatório.' })
  }

  try {
    const { db } = await dbConnect()
    const itemsCollection = db.collection('tvl-novision')
    const advertisementsCollection = db.collection('advertisements')
    const auctionsCollection = db.collection('auctions')
    const tradesCollection = db.collection('trades')
    const buyOffersCollection = db.collection('buy_offers')
    const transactionsCollection = db.collection('transactions')

    // Estatísticas globais do marketplace
    const [
      totalMarketplaceTrades,
      totalMarketplaceVolume,
      activeMarketplaceTrades,
      completedMarketplaceTrades
    ] = await Promise.all([
      // Total de anúncios criados
      advertisementsCollection.countDocuments({}),
      
      // Volume total negociado
      transactionsCollection.aggregate([
        { $match: { type: 'marketplace_sale' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray().then(result => result[0]?.total || 0),
      
      // Anúncios ativos
      advertisementsCollection.countDocuments({
        active: true,
        expiresAt: { $gt: new Date() }
      }),
      
      // Anúncios completados
      advertisementsCollection.countDocuments({
        active: false
      })
    ])

    // Estatísticas do usuário
    const [
      userActiveTrades,
      userCompletedTrades,
      userTotalVolume,
      userSuccessfulTrades
    ] = await Promise.all([
      // Negociações ativas do usuário
      Promise.all([
        advertisementsCollection.countDocuments({
          userId,
          active: true,
          expiresAt: { $gt: new Date() }
        }),
        auctionsCollection.countDocuments({
          userId,
          status: 'active',
          endTime: { $gt: new Date() }
        }),
        buyOffersCollection.countDocuments({
          userId,
          active: true,
          expiresAt: { $gt: new Date() }
        }),
        tradesCollection.countDocuments({
          $or: [
            { 'mytvl1.userId': userId },
            { 'mytvl2.userId': userId }
          ],
          status: 'pending'
        })
      ]).then(results => results.reduce((sum, count) => sum + count, 0)),
      
      // Negociações completadas do usuário
      Promise.all([
        advertisementsCollection.countDocuments({
          userId,
          active: false,
          soldAt: { $exists: true }
        }),
        auctionsCollection.countDocuments({
          userId,
          status: 'completed'
        }),
        tradesCollection.countDocuments({
          $or: [
            { 'mytvl1.userId': userId },
            { 'mytvl2.userId': userId }
          ],
          status: 'completed'
        }),
        itemsCollection.countDocuments({
          userId,
          sold: true,
          traded: false,
          advertised: { $ne: true }
        })
      ]).then(results => results.reduce((sum, count) => sum + count, 0)),
      
      // Volume total do usuário
      transactionsCollection.aggregate([
        { 
          $match: { 
            $or: [
              { sellerId: userId },
              { buyerId: userId }
            ]
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray().then(result => result[0]?.total || 0),
      
      // Trades bem-sucedidos
      Promise.all([
        advertisementsCollection.countDocuments({
          userId,
          active: false,
          soldAt: { $exists: true }
        }),
        auctionsCollection.countDocuments({
          userId,
          status: 'completed',
          winnerId: { $exists: true }
        }),
        tradesCollection.countDocuments({
          $or: [
            { 'mytvl1.userId': userId },
            { 'mytvl2.userId': userId }
          ],
          status: 'completed'
        })
      ]).then(results => results.reduce((sum, count) => sum + count, 0))
    ])

    // Calcular taxa de sucesso
    const userTotalTrades = userActiveTrades + userCompletedTrades
    const successRate = userTotalTrades > 0 ? (userSuccessfulTrades / userTotalTrades) * 100 : 0

    // Estatísticas de tendências (últimos 30 dias)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [
      recentTrades,
      recentVolume,
      popularItems
    ] = await Promise.all([
      // Trades recentes
      advertisementsCollection.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      }),
      
      // Volume recente
      transactionsCollection.aggregate([
        { 
          $match: { 
            createdAt: { $gte: thirtyDaysAgo },
            type: 'marketplace_sale'
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray().then(result => result[0]?.total || 0),
      
      // Itens mais populares
      transactionsCollection.aggregate([
        { 
          $match: { 
            createdAt: { $gte: thirtyDaysAgo },
            type: 'marketplace_sale'
          }
        },
        { 
          $group: { 
            _id: '$itemId', 
            count: { $sum: 1 },
            totalValue: { $sum: '$amount' },
            itemName: { $first: '$itemName' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray()
    ])

    // Calcular crescimento
    const previousPeriodStart = new Date()
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 60)
    previousPeriodStart.setDate(previousPeriodStart.getDate() + 30)

    const previousVolume = await transactionsCollection.aggregate([
      { 
        $match: { 
          createdAt: { 
            $gte: previousPeriodStart,
            $lt: thirtyDaysAgo
          },
          type: 'marketplace_sale'
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray().then(result => result[0]?.total || 0)

    const volumeGrowth = previousVolume > 0 
      ? ((recentVolume - previousVolume) / previousVolume) * 100 
      : 0

    const stats = {
      // Estatísticas globais
      totalTrades: totalMarketplaceTrades,
      totalVolume: totalMarketplaceVolume,
      activeTrades: activeMarketplaceTrades,
      completedTrades: completedMarketplaceTrades,
      
      // Estatísticas do usuário
      myActiveTrades: userActiveTrades,
      myCompletedTrades: userCompletedTrades,
      myTotalVolume: userTotalVolume,
      mySuccessRate: Math.round(successRate * 100) / 100,
      
      // Tendências
      recentActivity: {
        trades: recentTrades,
        volume: recentVolume,
        growth: Math.round(volumeGrowth * 100) / 100
      },
      
      // Itens populares
      popularItems: popularItems.map(item => ({
        id: item._id,
        name: item.itemName,
        sales: item.count,
        totalValue: item.totalValue,
        averagePrice: Math.round(item.totalValue / item.count)
      })),
      
      // Métricas adicionais
      averageTradeValue: userCompletedTrades > 0 
        ? Math.round(userTotalVolume / userCompletedTrades)
        : 0,
      
      marketShare: totalMarketplaceVolume > 0 
        ? Math.round((userTotalVolume / totalMarketplaceVolume) * 10000) / 100
        : 0
    }

    const encryptedData = encrypt(JSON.stringify({
      success: true,
      stats
    }))

    res.status(200).json(encryptedData)

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas.' })
  }
}
