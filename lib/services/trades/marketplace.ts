import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '@/core/integration/connect'
import { encrypt } from '@/core/security/encryption'
import { getItemsForContainer, getItemsForCase } from '@/types/clubstore/list.opencontainer'

interface MarketplaceItem {
  _id: string
  userId: string
  sellerId: string
  sellerName: string
  sellerAvatar: string
  id: number
  tokenID: string
  nameitem: string
  imagem: string
  itemValue: number
  priceitem: number
  rarity: string
  type: string
  containerType: string
  itemCondition: string
  createdAt: string
  tradeType: 'sell' | 'auction' | 'buy' | 'trade'
  status: 'active' | 'completed' | 'cancelled' | 'pending'
  currentBid?: number
  bids?: number
  auctionEndTime?: string
  timeLeft?: string
  advertised: boolean
  adExpiration?: Date
  advertisedPrice?: number
  forTrade?: boolean
  traded?: boolean
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

interface BuyOffer {
  _id: string
  userId: string
  buyerName: string
  buyerAvatar: string
  itemId: number
  offerPrice: number
  createdAt: Date
  expiresAt: Date
  active: boolean
  description: string
}

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

export async function Marketplace(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` })
  }

  const { userId, type, rarity, minPrice, maxPrice, sortBy } = req.query

  try {
    const { db, client } = await dbConnect()
    const itemsCollection = db.collection('tvl-novision')
    const advertisementsCollection = db.collection('advertisements')
    const buyOffersCollection = db.collection('buy_offers')
    const auctionsCollection = db.collection('auctions')
    const usersCollection = db.collection('users')
    const inventoryCollection = db.collection('inventory')

    // Buscar anúncios ativos
    const activeAds = await advertisementsCollection.find({
      active: true,
      expiresAt: { $gt: new Date() }
    }).toArray()

    // Buscar ofertas de compra ativas
    const activeBuyOffers = await buyOffersCollection.find({
      active: true,
      expiresAt: { $gt: new Date() }
    }).toArray()

    // Buscar leilões ativos
    const activeAuctions = await auctionsCollection.find({
      status: 'active',
      endTime: { $gt: new Date() }
    }).toArray()

    // Buscar itens anunciados
    const advertisedItemIds = activeAds.map(ad => ad.itemId)
    const advertisedItems = advertisedItemIds.length > 0 
      ? await itemsCollection.find({ 
          tokenID: { $in: advertisedItemIds },
          advertised: true,
          sold: true
        }).toArray()
      : []

    // Buscar itens em leilão
    const auctionItemIds = activeAuctions.map(auction => auction.itemId)
    const auctionItems = auctionItemIds.length > 0
      ? await itemsCollection.find({
          tokenID: { $in: auctionItemIds }
        }).toArray()
      : []

    // Buscar dados dos vendedores
    const sellerIds = [...advertisedItems.map(item => item.userId), ...auctionItems.map(item => item.userId)]
    const sellers = await usersCollection.find({
      id: { $in: sellerIds }
    }).project({ id: 1, name: 1, avatar: 1 }).toArray()

    const sellersMap = sellers.reduce((acc, seller) => {
      acc[seller.id] = seller
      return acc
    }, {} as any)

    // Buscar dados dos compradores (para ofertas de compra)
    const buyerIds = activeBuyOffers.map(offer => offer.userId)
    const buyers = await usersCollection.find({
      id: { $in: buyerIds }
    }).project({ id: 1, name: 1, avatar: 1 }).toArray()

    const buyersMap = buyers.reduce((acc, buyer) => {
      acc[buyer.id] = buyer
      return acc
    }, {} as any)

    // Processar itens anunciados
    const marketplaceItems: MarketplaceItem[] = []

    // Adicionar itens de venda direta
    for (const item of advertisedItems) {
      const ad = activeAds.find(ad => ad.itemId === item.tokenID)
      const seller = sellersMap[item.userId]
      
      if (!ad || !seller) continue

      // Buscar detalhes do item
      const inventory = await inventoryCollection.findOne({ userId: item.userId })
      if (!inventory?.usedcards?.[item.tokenID]) continue

      const containerType = inventory.usedcards[item.tokenID].open
      const friendlyName = containerNames[containerType] || 'Desconhecido'
      const availableItems = getItemsForContainer(containerType) || []
      const foundItem = availableItems.find(availableItem => availableItem.id === item.id)

      if (foundItem) {
        const timeLeft = calculateTimeLeft(ad.expiresAt)
        
        marketplaceItems.push({
          _id: item._id?.toString?.() ?? '',
          userId: item.userId,
          sellerId: item.userId,
          sellerName: seller.name,
          sellerAvatar: seller.avatar,
          id: item.id ?? foundItem.id,
          tokenID: item.tokenID,
          nameitem: foundItem.nameitem ?? item.nameitem ?? '',
          imagem: foundItem.imagem ?? item.imagem ?? '',
          itemValue: ad.price,
          priceitem: foundItem.priceitem ?? item.priceitem ?? 0,
          rarity: item.rarity ?? '',
          type: item.type ?? '',
          containerType: friendlyName,
          itemCondition: item.itemCondition ?? '',
          createdAt: item.createdAt ?? new Date().toISOString(),
          tradeType: 'sell',
          status: 'active',
          currentBid: undefined,
          bids: 0,
          auctionEndTime: undefined,
          timeLeft,
          advertised: true,
          adExpiration: ad.expiresAt,
          advertisedPrice: ad.price,
          forTrade: item.forTrade ?? false,
          traded: item.traded ?? false
        })
      }
    }

    // Adicionar leilões
    for (const item of auctionItems) {
      const auction = activeAuctions.find(a => a.itemId === item.tokenID)
      const seller = sellersMap[item.userId]
      
      if (!auction || !seller) continue

      const inventory = await inventoryCollection.findOne({ userId: item.userId })
      if (!inventory?.usedcards?.[item.tokenID]) continue

      const containerType = inventory.usedcards[item.tokenID].open
      const friendlyName = containerNames[containerType] || 'Desconhecido'
      const availableItems = getItemsForContainer(containerType) || []
      const foundItem = availableItems.find(availableItem => availableItem.id === item.id)

      if (foundItem) {
        const timeLeft = calculateTimeLeft(auction.endTime)
        
        marketplaceItems.push({
          _id: item._id?.toString?.() ?? '',
          userId: item.userId,
          sellerId: item.userId,
          sellerName: seller.name,
          sellerAvatar: seller.avatar,
          id: item.id ?? foundItem.id,
          tokenID: item.tokenID,
          nameitem: foundItem.nameitem ?? item.nameitem ?? '',
          imagem: foundItem.imagem ?? item.imagem ?? '',
          itemValue: item.itemValue ?? 0,
          priceitem: foundItem.priceitem ?? item.priceitem ?? 0,
          rarity: item.rarity ?? '',
          type: item.type ?? '',
          containerType: friendlyName,
          itemCondition: '',
          createdAt: item.createdAt ?? new Date().toISOString(),
          tradeType: 'auction',
          status: 'active',
          currentBid: auction.currentBid || auction.startingBid,
          bids: auction.bidCount || 0,
          auctionEndTime: new Date(auction.endTime).toISOString(),
          timeLeft,
          advertised: item.advertised ?? false,
          adExpiration: item.adExpiration,
          advertisedPrice: item.advertisedPrice,
          forTrade: item.forTrade,
          traded: item.traded
        })
      }
    }

    // Adicionar ofertas de compra
    for (const offer of activeBuyOffers) {
      const buyer = buyersMap[offer.userId]
      if (!buyer) continue

      const timeLeft = calculateTimeLeft(offer.expiresAt)
      
      // Buscar detalhes do item baseado no ID
      const caseItem = getItemsForCase(offer.itemId)
      
      if (caseItem) {
        marketplaceItems.push({
          _id: offer._id.toString(),
          userId: offer.userId,
          sellerId: offer.userId,
          sellerName: buyer.name,
          sellerAvatar: buyer.avatar,
          id: offer.itemId,
          tokenID: `buy_offer_${offer._id}`,
          nameitem: caseItem.nameitem || `Item ID ${offer.itemId}`,
          imagem: caseItem.imagem || '/placeholder.svg',
          itemValue: offer.offerPrice,
          priceitem: caseItem.priceitem || offer.offerPrice,
          rarity: (caseItem as any).rarity || 'comum',
          type: 'buy_offer',
          containerType: 'Oferta de Compra',
          itemCondition: 'Procurando',
          createdAt: offer.createdAt.toISOString(),
          tradeType: 'buy',
          status: 'active',
          timeLeft,
          bids: 0,
          advertised: false
        })
      }
    }

    // Aplicar filtros
    let filteredItems = marketplaceItems

    if (type && type !== 'all') {
      filteredItems = filteredItems.filter(item => item.tradeType === type)
    }

    if (rarity && rarity !== 'all') {
      filteredItems = filteredItems.filter(item => item.rarity === rarity)
    }

    if (minPrice) {
      filteredItems = filteredItems.filter(item => item.itemValue >= Number(minPrice))
    }

    if (maxPrice) {
      filteredItems = filteredItems.filter(item => item.itemValue <= Number(maxPrice))
    }

    // Aplicar ordenação
    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          filteredItems.sort((a, b) => a.itemValue - b.itemValue)
          break
        case 'price_desc':
          filteredItems.sort((a, b) => b.itemValue - a.itemValue)
          break
        case 'time_asc':
          filteredItems.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          break
        case 'time_desc':
          filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case 'ending_soon':
          filteredItems = filteredItems.filter(item => item.timeLeft)
          filteredItems.sort((a, b) => {
            const timeA = parseTimeLeft(a.timeLeft!)
            const timeB = parseTimeLeft(b.timeLeft!)
            return timeA - timeB
          })
          break
      }
    }

    // Marcar itens do usuário atual
    const finalItems = filteredItems.map(item => ({
      ...item,
      isMyTrade: item.userId === userId
    }))

    const encryptedData = encrypt(JSON.stringify({
      success: true,
      trades: finalItems,
      total: finalItems.length,
      filters: {
        type: type || 'all',
        rarity: rarity || 'all',
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        sortBy: sortBy || 'time_desc'
      }
    }))

    res.status(200).json(encryptedData)

  } catch (error) {
    console.error('Erro ao buscar marketplace:', error)
    res.status(500).json({ success: false, message: 'Erro ao buscar dados do marketplace.' })
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

function parseTimeLeft(timeLeft: string): number {
  if (timeLeft === 'Expirado') return 0
  
  const days = timeLeft.match(/(\d+)d/)?.[1] || '0'
  const hours = timeLeft.match(/(\d+)h/)?.[1] || '0'
  const minutes = timeLeft.match(/(\d+)m/)?.[1] || '0'
  
  return parseInt(days) * 24 * 60 + parseInt(hours) * 60 + parseInt(minutes)
}