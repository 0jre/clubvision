import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '@/core/integration/connect'
import { encrypt } from '@/core/security/encryption'

export async function BalanceWallet(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` })
  }

  const { userId } = req.query

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ success: false, message: 'userId é obrigatório.' })
  }

  try {
    const { db } = await dbConnect()
    const userItemsCollection = db.collection('items')
    const itemsCollection = db.collection('tvl-novision')

    // Buscar saldo do usuário
    const user = await userItemsCollection.findOne({ id: userId })
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' })
    }

    // Calcular valor total dos itens do usuário
    const userItems = await itemsCollection.find({
      userId,
      sold: false
    }).toArray()

    const totalItemsValue = userItems.reduce((sum, item) => sum + (item.itemValue || item.priceitem || 0), 0)

    
    const brlRate = 0.013 // 1 Bit = R$0.013
    const brlValue = (user.bits || 0) * brlRate

    const walletData = {
      balance: user.bits || 0,
      usdValue: Math.round(brlValue * 100) / 100,
      currency: 'BITS',
      totalItemsValue,
      totalNetWorth: (user.bits || 0) + totalItemsValue,
      lastUpdated: new Date().toISOString()
    }

    const encryptedData = encrypt(JSON.stringify({
      success: true,
      ...walletData
    }))

    res.status(200).json(encryptedData)

  } catch (error) {
    console.error('Erro ao buscar saldo:', error)
    res.status(500).json({ success: false, message: 'Erro ao buscar dados da carteira.' })
  }
}
