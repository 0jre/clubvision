import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

interface ValueHistory {
  newValue: number
  timestamp: string
}

interface OwnerInfo {
  id: string
  name: string
  avatar: string
}

// ESTA É A EXPORTAÇÃO PADRÃO QUE O NEXT.JS PROCURA NO DIRETÓRIO 'PAGES/API'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` })
  }

  const { id } = req.query

  if (typeof id !== "string" || isNaN(Number(id))) {
    return res.status(400).json({ success: false, message: "ID do item é necessário e deve ser um número válido." })
  }

  const itemId = Number(id)

  try {
    const { db } = await dbConnect()
    const marketPriceCollection = db.collection<{ id: number; valueHistory: ValueHistory[] }>("tvl-marketprice")
    const tvlNovisionCollection = db.collection<{ id: number; userId: string }>("tvl-novision")
    const usersCollection = db.collection("users") // Assumindo uma coleção de usuários

    // Buscar histórico de preços para o item
    const priceHistoryRecord = await marketPriceCollection.findOne({ id: itemId })
    const valueHistory = priceHistoryRecord?.valueHistory || []

    // Contar proprietários distintos para o item
    const distinctOwnersIds = await tvlNovisionCollection.distinct("userId", { id: itemId })
    const totalOwners = distinctOwnersIds.length

    // Buscar detalhes para até 20 proprietários distintos
    const ownersDetails: OwnerInfo[] = []
    if (distinctOwnersIds.length > 0) {
      const ownersToFetch = distinctOwnersIds.slice(0, 20) // Limita a 20 proprietários
      const users = await usersCollection
        .find({ id: { $in: ownersToFetch } }, { projection: { id: 1, name: 1, avatar: 1 } })
        .toArray()

      users.forEach((user) => {
        ownersDetails.push({
          id: user.id,
          name: user.name || `Usuário ${user.id.substring(0, 4)}`,
          avatar: user.avatar || "/placeholder.svg?height=40&width=40",
        })
      })
    }

    return res.status(200).json({
      success: true,
      priceHistory: valueHistory,
      totalOwners,
      owners: ownersDetails,
    })
  } catch (error) {
    console.error("Erro ao buscar análises do item:", error)
    return res.status(500).json({ success: false, message: "Erro ao buscar análises do item." })
  }
}
