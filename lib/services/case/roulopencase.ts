 import { dbConnect } from "@/core/integration/connect"
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import { getItemsForCaseZX } from "@/types/clubstore/list.opencontainer"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

const XP_PER_POST = 80

interface Transaction {
  date: string;
  time: string;
  bits?: number;
  timestamp: Date;
  amount?: number;
  action: string;
  status: string
  currency: string;
  item?: any;
}

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" })
  }

  try {
    const sessionUser = req.session?.get("user")
    if (!sessionUser) {
      return res.status(401).json({ message: "Usuário não autenticado" })
    }

    const userId = sessionUser.id
    const { currentPage, isFlash = false, count = 1 } = req.body

    if (typeof currentPage !== "number") {
      return res.status(400).json({ message: "Parâmetros inválidos" })
    }

    // Validate flash case parameters
    if (isFlash && (typeof count !== "number" || count < 1 || count > 10)) {
      return res.status(400).json({ message: "Quantidade inválida para Flash Case (1-10)" })
    }

    const { db } = await dbConnect()
    const marketpriceCollection = db.collection("tvl-marketprice")
    const Primeactive = await db.collection("reforms").findOne({ userId, prime: true })
    const memberStatsCollection = db.collection("member-stats")
    const pageCosts: Record<number, number> = { 5: 14, 2: 18, 3: 32 }
    const spinCost = pageCosts[currentPage] || 14
    const totalCost = spinCost * count

    // Check if user has enough tokens for the total cost
    const user = await db
      .collection("items")
      .findOneAndUpdate(
        { _id: userId, token: { $gte: totalCost } },
        { $inc: { token: -totalCost } },
        { returnDocument: "before" },
      )

    if (!user.value) {
      return res.status(400).json({ message: "V-Tokens insuficientes" })
    }

    // Update member stats
    await memberStatsCollection.updateOne(
      { member_id: userId },
      { $inc: { xp: XP_PER_POST * count, clubactivity: XP_PER_POST * count } },
    )


        
   
    // Get user's spin history
    const spinHistory = (await db.collection("spinHistory").findOne({ userId })) || { totalSpins: 0 }
    let { totalSpins } = spinHistory

    // Get available items for the case
    const openBox = await db.collection("openbox").findOne({})
    if (!openBox?.items?.length) {
      return res.status(500).json({ message: "Nenhum item disponível para o spin" })
    }

    // Handle single case opening (normal mode)
    if (!isFlash || count === 1) {
      totalSpins++

      // Adjust chances based on spin count and prime status
      let rarityBoost = "comum"

      if (Primeactive?.prime) {
        if (totalSpins >= 4) {
          rarityBoost = "épico"
        } else if (totalSpins >= 1) {
          rarityBoost = "raro"
        }
      } else {
        if (totalSpins >= 7) {
          rarityBoost = "épico"
        } else if (totalSpins >= 2) {
          rarityBoost = "raro"
        }
      }

      const selectedItem = await performSingleSpin(openBox.items, rarityBoost)
      if (!selectedItem) {
        return res.status(500).json({ message: "Erro ao selecionar item" })
      }

      const result = await registerItem(db, userId, selectedItem, marketpriceCollection)

          const timestamp = new Date();
       const transaction: Transaction = {
          date: timestamp.toLocaleDateString(),
          time: timestamp.toLocaleTimeString(),
          timestamp: new Date(),
          amount: totalCost,
          action: `purchase_openbox`,
          status: 'succeeded',
          currency: 'vtoken',
          item: {
            item: selectedItem,
            uid: result.clubUID,
            chance: selectedItem.chance,
            price: result.itemValue,
          }
        };

        await db.collection('items').updateOne(
          { id: userId },
          { 
            $push: { transactions: transaction }
          }
        );
    // Create notification
    const notification = {
      userId: userId,
      type: "transaction",
      title: "Notificação de Carteira",
      message: `Você gastou ${totalCost} V-Tokens. ${isFlash ? `Ao abrir ${count} Caixas Vision no Flash Case.` : "Ao abrir uma Caixa Vision."}`,
      timestamp: new Date(),
    }

      const notificationsCollection = db.collection("notifications")
    await notificationsCollection.insertOne(notification)

      // Update spin history
      await db
        .collection("spinHistory")
        .updateOne({ userId }, { $set: { totalSpins: totalSpins > 10 ? 0 : totalSpins } }, { upsert: true })

      return res.status(200).json({
        message: "Spin realizado e item registrado com sucesso!",
        item: selectedItem,
        uid: result.clubUID,
        ownerId: userId,
        chance: selectedItem.chance,
        originalChance: selectedItem.chance,
        adjustedChance: `${selectedItem.adjustedChance}%`,
        spinCount: totalSpins,
        rarityBoost: rarityBoost,
        itemValue: result.itemValue,
        prime: Primeactive?.prime ? true : false,
        isFlash: isFlash,
      })
    }

    // Handle multiple case openings (flash mode)
    const results = []

    for (let i = 0; i < count; i++) {
      totalSpins++

      // Adjust chances for each spin
      let rarityBoost = "comum"

      if (Primeactive?.prime) {
        if (totalSpins >= 4) {
          rarityBoost = "épico"
        } else if (totalSpins >= 1) {
          rarityBoost = "raro"
        }
      } else {
        if (totalSpins >= 7) {
          rarityBoost = "épico"
        } else if (totalSpins >= 2) {
          rarityBoost = "raro"
        }
      }

      const selectedItem = await performSingleSpin(openBox.items, rarityBoost)
      if (!selectedItem) {
        continue // Skip this iteration if item selection fails
      }

      const result = await registerItem(db, userId, selectedItem, marketpriceCollection)

      results.push({
        item: selectedItem,
        uid: result.clubUID,
        ownerId: userId,
        chance: selectedItem.chance,
        originalChance: selectedItem.chance,
        adjustedChance: `${selectedItem.adjustedChance}%`,
        spinCount: totalSpins,
        rarityBoost: rarityBoost,
        itemValue: result.itemValue,
        prime: Primeactive?.prime ? true : false,
      })

      // Reset spin count if it exceeds 10
      if (totalSpins > 10) {
        totalSpins = 0
      }
    }

    // Update final spin history
    await db.collection("spinHistory").updateOne({ userId }, { $set: { totalSpins } }, { upsert: true })

    return res.status(200).json({
      message: `Flash Case realizado com sucesso! ${count} itens obtidos.`,
      items: results,
      isFlash: true,
      count: count,
      totalCost: totalCost,
    })
  } catch (error) {
    console.error("Erro no processo:", error)
    return res.status(500).json({ message: "Erro interno do servidor" })
  }
}

const performSingleSpin = async (items: any[], rarityBoost: string) => {
  let totalWeight = 0
  const adjustedItems = items.map((item: any) => {
    const adjustedItem = { ...item }
    let itemChance = Number.parseFloat(adjustedItem.chance.replace("%", ""))

    // Apply rarity boost if applicable
    if (rarityBoost && adjustedItem.rarity === rarityBoost) {
      itemChance *= 1.5 // Increase chance by 50%
      console.log(
        `Boosting ${adjustedItem.rarity} item: ${adjustedItem.id} from ${adjustedItem.chance} to ${itemChance}%`,
      )
    }

    adjustedItem.adjustedChance = itemChance
    totalWeight += itemChance

    return adjustedItem
  })

  // Perform the spin based on adjusted chances
  const randomNum = Math.random() * totalWeight
  let cumulativeProbability = 0
  let selectedItem = null

  for (const item of adjustedItems) {
    cumulativeProbability += item.adjustedChance
    if (randomNum <= cumulativeProbability) {
      selectedItem = item
      break
    }
  }

  return selectedItem
}

const registerItem = async (db: any, userId: string, selectedItem: any, marketpriceCollection: any) => {
  const clubUID = generateTokenID()

  function generateTokenID(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let tokenID = "club_"
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      tokenID += characters.charAt(randomIndex)
    }
    return tokenID
  }

  // Add item to user's inventory
  await db
    .collection("inventory")
    .updateOne({ userId }, { $push: { mytvls: { id: selectedItem.id, uid: clubUID } } }, { upsert: true })

  // Register in tvl-novision collection
  const novisionCollection = db.collection("tvl-novision")
  const items = getItemsForCaseZX(selectedItem.id)
  if (!items || items.length === 0) {
    throw new Error("Erro ao obter dados do item.")
  }

  const registeredItem = items[Math.floor(Math.random() * items.length)]
  const existingItem = await novisionCollection.findOne({ id: registeredItem.id, sold: true })
  const previousOwners = existingItem ? existingItem.previousOwners || [] : []
  const itemCondition = determineItemCondition(previousOwners)
  const itemValue = await calculateItemValue(registeredItem, previousOwners)

  // Update market price history
  await marketpriceCollection.updateOne(
    { id: selectedItem.id },
    { $push: { valueHistory: { newValue: itemValue, timestamp: new Date() } } },
    { upsert: true },
  )

  // Insert item record
  await novisionCollection.insertOne({
    userId,
    id: selectedItem.id,
    tokenID: clubUID,
    createdAt: new Date(),
    editionNumber: false,
    totalEditions: 1,
    type: "Caixas Vision",
    itemValue: itemValue,
    itemCondition,
    previousOwners: [],
  })

  return { clubUID, itemValue }
}

const determineItemCondition = (previousOwners: string[]): string => {
  const ownerCount = previousOwners.length
  if (ownerCount === 0) return "NOVO"
  if (ownerCount <= 2) return "SEMINOVO"
  if (ownerCount <= 5) return "USADO"
  return "VELHO"
}

const calculateItemValue = async (item: any, previousOwners: string[]): Promise<number> => {
  let basePrice = item.priceitem
  switch (item.rarity) {
    case "comum":
      basePrice *= 1
      break
    case "raro":
      basePrice *= 1.5
      break
    case "épico":
      basePrice *= 2
      break
  }
  return basePrice * (previousOwners.length > 0 ? 0.9 : 1)
}

const RoulOpencase: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await checkAuth(req, res)
}

export default withSession(RoulOpencase)
