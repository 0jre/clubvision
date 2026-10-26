import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '@/core/integration/connect'
import { encrypt } from '@/core/security/encryption'
import { getItemsForContainer, getItemsForCase } from '@/types/clubstore/list.opencontainer'

const containerNames: { [key: string]: string } = {
  containersheriff: "Sheriff",
  containermagnata: "Magnata",
  containerbigode: "Bigode",
  containerbarbara: "Bárbara",
  containermarcos: "Marcos",
  containerjason: "Jason",
  containerasyc: "Asyc",
  containerbig: "Julio"
}

export async function MyTrades(req: NextApiRequest, res: NextApiResponse) {
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
    const buyOffersCollection = db.collection('buy_offers')
    const auctionsCollection = db.collection('auctions')
    const tradesCollection = db.collection('trades')
    const inventoryCollection = db.collection('inventory')

    // Buscar anúncios do usuário
    const userAds = await advertisementsCollection.find({
      userId,
      active: true
    }).toArray()

    // Buscar ofertas de compra do usuário
    const userBuyOffers = await buyOffersCollection.find({
      userId,
      active: true
    }).toArray()

    // Buscar leilões do usuário
    const userAuctions = await auctionsCollection.find({
      userId,
      status: { $in: ['active', 'pending'] }
    }).toArray()

    // Buscar trades do usuário
    const userTrades = await tradesCollection.find({
      $or: [
        { 'mytvl1.userId': userId },
        { 'mytvl2.userId': userId }
      ],
      status: { $in: ['pending', 'active'] }
    }).toArray()

    // Buscar itens anunciados
    const advertisedItemIds = userAds.map(ad => ad.itemId)
    const advertisedItems = advertisedItemIds.length > 0
      ? await itemsCollection.find({
          tokenID: { $in: advertisedItemIds },
          userId,
          advertised: true
        }).toArray()
      : []

    // Buscar itens em leilão
    const auctionItemIds = userAuctions.map(auction => auction.itemId)
    const auctionItems = auctionItemIds.length > 0
      ? await itemsCollection.find({
          tokenID: { $in: auctionItemIds },
          userId
        }).toArray()
      : []

    // Buscar inventário do usuário
    const inventory = await inventoryCollection.findOne({ userId })

    const activeTrades = []
    const completedTrades = []

    // Processar anúncios ativos
    for (const item of advertisedItems) {
      const ad = userAds.find(ad => ad.itemId === item.tokenID)
      if (!ad) continue

      if (!inventory?.usedcards?.[item.tokenID]) continue

      const containerType = inventory.usedcards[item.tokenID].open
      const friendlyName = containerNames[containerType] || 'Desconhecido'
      const availableItems = getItemsForContainer(containerType) || []
      const foundItem = availableItems.find(availableItem => availableItem.id === item.id)

      if (foundItem) {
        const timeLeft = calculateTimeLeft(ad.expiresAt)
        const isExpired = new Date() > new Date(ad.expiresAt)

        const tradeItem = {
          ...item,
          ...foundItem,
          containerType: friendlyName,
          tradeType: 'sell' as const,
          status: isExpired ? 'expired' as const : 'active' as const,
          itemValue: ad.price,
          advertisedPrice: ad.price,
          timeLeft,
          bids: 0,
          isMyTrade: true,
          adId: ad._id.toString()
        }

        if (isExpired) {
          completedTrades.push(tradeItem)
        } else {
          activeTrades.push(tradeItem)
        }
      }
    }

    // Processar leilões
    for (const item of auctionItems) {
      const auction = userAuctions.find(a => a.itemId === item.tokenID)
      if (!auction) continue

      if (!inventory?.usedcards?.[item.tokenID]) continue

      const containerType = inventory.usedcards[item.tokenID].open
      const friendlyName = containerNames[containerType] || 'Desconhecido'
      const availableItems = getItemsForContainer(containerType) || []
      const foundItem = availableItems.find(availableItem => availableItem.id === item.id)

      if (foundItem) {
        const timeLeft = calculateTimeLeft(auction.endTime)
        const isExpired = new Date() > new Date(auction.endTime)

        const tradeItem = {
          ...item,
          ...foundItem,
          containerType: friendlyName,
          tradeType: 'auction' as const,
          status: isExpired ? 'expired' as const : auction.status as any,
          currentBid: auction.currentBid || auction.startingBid,
          bids: auction.bidCount || 0,
          auctionEndTime: new Date(auction.endTime).toISOString(),
          timeLeft,
          isMyTrade: true,
          auctionId: auction._id.toString()
        }

        if (isExpired || auction.status === 'completed') {
          completedTrades.push(tradeItem)
        } else {
          activeTrades.push(tradeItem)
        }
      }
    }

    // Processar ofertas de compra
    for (const offer of userBuyOffers) {
      const timeLeft = calculateTimeLeft(offer.expiresAt)
      const isExpired = new Date() > new Date(offer.expiresAt)

      const caseItem = getItemsForCase(offer.itemId)
      
      if (caseItem) {
        const tradeItem = {
          _id: offer._id.toString(),
          userId: offer.userId,
          id: offer.itemId,
          tokenID: `buy_offer_${offer._id}`,
          nameitem: caseItem.nameitem || `Item ID ${offer.itemId}`,
          imagem: caseItem.imagem || '/placeholder.svg',
          itemValue: offer.offerPrice,
          priceitem: caseItem.priceitem || offer.offerPrice,
          rarity: caseItem.rarity || 'comum',
          type: 'buy_offer',
          containerType: 'Oferta de Compra',
          itemCondition: 'Procurando',
          createdAt: new Date(offer.createdAt).toISOString(),
          tradeType: 'buy' as const,
          status: isExpired ? 'expired' as const : 'active' as const,
          timeLeft,
          bids: 0,
          isMyTrade: true,
          offerId: offer._id.toString()
        }

        if (isExpired) {
          completedTrades.push(tradeItem)
        } else {
          activeTrades.push(tradeItem)
        }
      }
    }

    // Processar trades/trocas
    for (const trade of userTrades) {
      const isUser1 = trade.mytvl1?.userId === userId
      const userItems = isUser1 ? trade.mytvl1?.items || [] : trade.mytvl2?.items || []
      const otherUserItems = isUser1 ? trade.mytvl2?.items || [] : trade.mytvl1?.items || []

      for (const tradeItemId of userItems) {
        const item = await itemsCollection.findOne({ tokenID: tradeItemId, userId })
        if (!item) continue

        if (!inventory?.usedcards?.[item.tokenID]) continue

        const containerType = inventory.usedcards[item.tokenID].open
        const friendlyName = containerNames[containerType] || 'Desconhecido'
        const availableItems = getItemsForContainer(containerType) || []
        const foundItem = availableItems.find(availableItem => availableItem.id === item.id)

        if (foundItem) {
          const tradeItem = {
            ...item,
            ...foundItem,
            containerType: friendlyName,
            tradeType: 'trade' as const,
            status: trade.status as any,
            timeLeft: 'Aguardando',
            bids: 0,
            isMyTrade: true,
            tradeId: trade._id.toString(),
            otherUserItems: otherUserItems.length
          }

          if (trade.status === 'completed' || trade.status === 'cancelled') {
            completedTrades.push(tradeItem)
          } else {
            activeTrades.push(tradeItem)
          }
        }
      }
    }

    // Buscar histórico de trades completados
    // const completedUserTrades = await tradesCollection.find({
    //   $or: [
    //     { 'mytvl1.userId': userId },
    //     { 'mytvl2.userId': userId }
    //   ],
    //   status: { $in: ['completed', 'cancelled'] }
    // }).sort({ completedAt: -1 }).limit(50).toArray()

    // Buscar vendas diretas completadas
    const soldItems = await itemsCollection.find({
      userId,
      sold: true,
      traded: false,
      advertised: { $ne: true }
    }).sort({ soldAt: -1 }).limit(50).toArray()

    // Adicionar vendas diretas ao histórico
    for (const item of soldItems) {
      if (!inventory?.usedcards?.[item.tokenID]) continue

      const containerType = inventory.usedcards[item.tokenID].open
      const friendlyName = containerNames[containerType] || 'Desconhecido'
      const availableItems = getItemsForContainer(containerType) || []
      const foundItem = availableItems.find(availableItem => availableItem.id === item.id)

      if (foundItem) {
        completedTrades.push({
          ...item,
          ...foundItem,
          containerType: friendlyName,
          tradeType: 'sell' as const,
          status: 'completed' as const,
          timeLeft: 'Concluído',
          bids: 0,
          isMyTrade: true
        })
      }
    }

    // Ordenar por data
    activeTrades.sort((a, b) => {
          const dateA = getTradeDate(a)
          const dateB = getTradeDate(b)
          return dateB - dateA
        })
        completedTrades.sort((a, b) => {
          const dateA = getTradeDate(a)
          const dateB = getTradeDate(b)
          return dateB - dateA
        })
    
    function getTradeDate(trade: any): number {
      if (trade.createdAt) return new Date(trade.createdAt).getTime()
      if (trade.soldAt) return new Date(trade.soldAt).getTime()
      if (trade.auctionEndTime) return new Date(trade.auctionEndTime).getTime()
      return 0
    }

    const encryptedData = encrypt(JSON.stringify({
      success: true,
      activeTrades,
      completedTrades,
      summary: {
        totalActive: activeTrades.length,
        totalCompleted: completedTrades.length,
        totalValue: activeTrades.reduce((sum, trade) => {
          if ('itemValue' in trade && typeof trade.itemValue === 'number') {
            return sum + trade.itemValue
          } else if ('currentBid' in trade && typeof trade.currentBid === 'number') {
            return sum + trade.currentBid
          }
          return sum
        }, 0)
      }
    }))

    res.status(200).json(encryptedData)

  } catch (error) {
    console.error('Erro ao buscar negociações do usuário:', error)
    res.status(500).json({ success: false, message: 'Erro ao buscar negociações do usuário.' })
  }
}

 
function calculateTimeLeft(endTime: Date | string | number): string {
  // Converte o input para um objeto Date, seja qual for o seu tipo original
  const endDate = new Date(endTime);
  
  // Verifica se a data resultante é válida. Se não for, retorna um erro.
  if (isNaN(endDate.getTime())) {
    return 'Data inválida';
  }

  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expirado';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}