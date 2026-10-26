import { dbConnect } from "@/core/integration/connect"
import { generateCardNumber, generateCVV } from "@/hooks/.config/cardUtils"
import type { UserItem, MemberStats } from "@/types/user/card"
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

const visionCard: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  const sessionUser = req.session?.get("user")

  if (!req.session || !req.session.get("user")) {
    return res.status(401).json({ isAuthenticated: false, message: "Usuário não autenticado." })
  }

  const { db } = await dbConnect()
  const userCollection = db.collection<UserItem>("items")
  const reformsCollection = db.collection<UserItem>("reforms")
  const memberStatsCollection = db.collection<MemberStats>("member-stats")
  const transactionsCollection = db.collection("vpoints_transactions")

  const userId = sessionUser.id

  try {
    const user = await userCollection.findOne({ _id: userId })
    const userinfo = await reformsCollection.findOne({ userId })
    const stats = await memberStatsCollection.findOne({ member_id: userId })

    if (!user || !userinfo || !stats) {
      return res.status(404).json({ message: "Usuário ou dados adicionais não encontrados" })
    }

    if (req.method === "GET") {
      const existingCards = user.visioncard || []

      const cardsWithDynamicBalance = existingCards.map((card: any) => {
        let balance = "$0"
        // Prioriza o status salvo no banco
        let cardStatus = card.status || "active"
        const lastTransaction = null

        if (cardStatus !== "frozen") {
          if (card.type === "VisionPay") {
          
            const orbitCredits = user.orbitCredits || 0
            const banking = user.banking || 0
             const total = banking + orbitCredits
            balance = `$${total.toLocaleString()}`
          } else if (card.type === "Sapphire") {
            const bits = user.bits || 0
            const bitsCredits = user.bitsCredits || 0
            const total = bits + bitsCredits
            balance = `$${total.toLocaleString()}`

            // Só aplica "limited" se não estiver congelado
            if (total < 100000) {
              cardStatus = "limited"
            }
          } else if (card.type === "VΛULT") {
            const bits = user.bits || 0
            const coins = user.coins || 0
            const bitsCredits = user.bitsCredits || 0
            const orbitCredits = user.orbitCredits || 0
            const banking = user.banking || 0
            const total = bits + coins + bitsCredits + orbitCredits + banking
            balance = `$${total.toLocaleString()}`

            // Só aplica "suspended" se não estiver congelado
            if (stats.level < 40 || bitsCredits + orbitCredits < 500000) {
              cardStatus = "suspended"
            }
          }
        } else {
          // Se congelado, calcula saldo normalmente, mas mantém status "frozen"
          if (card.type === "VisionPay") {
            
            const orbitCredits = user.orbitCredits || 0
            const banking = user.banking || 0
            const total = banking + orbitCredits
            balance = `$${total.toLocaleString()}`
          } else if (card.type === "Sapphire") {
           
            const bitsCredits = user.bitsCredits || 0
            const total =  bitsCredits
            balance = `$${total.toLocaleString()}`
          } else if (card.type === "VΛULT") {
           
            const bitsCredits = user.bitsCredits || 0
            const orbitCredits = user.orbitCredits || 0
            const banking = user.banking || 0
            const total = bitsCredits + orbitCredits + banking
            balance = `$${total.toLocaleString()}`
          }
        }

        return {
          ...card,
          balance,
          status: cardStatus,
          autoPaymentEnabled: card.autoPaymentEnabled || false,
          lastTransaction,
          createdAt: card.createdAt || new Date(),
          lastModified: card.lastModified || card.createdAt || new Date(),
        }
      })

      // Buscar estatísticas de uso dos cartões
      const cardStats = {
        totalCards: existingCards.length,
        activeCards: cardsWithDynamicBalance.filter((c) => c.status === "active").length,
        totalBalance: cardsWithDynamicBalance.reduce((sum, card) => {
          const balance = Number.parseFloat(card.balance.replace(/[$,]/g, "")) || 0
          return sum + balance
        }, 0),
        vpoints: user.vpoints || 0,
        bitsCredits: user.bitsCredits || 0,
        orbitCredits: user.orbitCredits || 0,
      }

      return res.status(200).json({
        cards: cardsWithDynamicBalance,
        stats: cardStats,
        eligibility: {
          canCreateSapphire: !existingCards.some((c) => c.type === "Sapphire"),
          canCreateVault:
            stats.level >= 40 && !existingCards.some((c) => c.type === "VΛULT"),
          requirements: {
            sapphire: "Ter creditos em Bits",
            vault: "Level 40+ ",
          },
        },
      })
    }

    if (req.method === "POST") {
      const { action, cardType, cardId, autoPaymentEnabled } = req.body

      // Bloquear/desbloquear cartão
      if (action === "freeze" || action === "unfreeze") {
        if (!cardId) {
          return res.status(400).json({ message: "ID do cartão é obrigatório" })
        }

        const newStatus = action === "freeze" ? "frozen" : "active"

        // Atualizar status do cartão no banco
        const result = await userCollection.updateOne(
          { _id: userId, "visioncard.cardNumber": cardId },
          { $set: { "visioncard.$.status": newStatus, "visioncard.$.lastModified": new Date() } },
        )

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Cartão não encontrado" })
        }

    

        return res.status(200).json({
          message: `Cartão ${action === "freeze" ? "bloqueado" : "desbloqueado"} com sucesso`,
          cardId,
          newStatus,
        })
      }

      // Pagamento automático
      if (action === "toggle_autopay") {
        if (!cardId) {
          return res.status(400).json({ message: "ID do cartão é obrigatório" })
        }

        // Atualizar configuração de pagamento automático
        const result = await userCollection.updateOne(
          { _id: userId, "visioncard.cardNumber": cardId },
          {
            $set: {
              "visioncard.$.autoPaymentEnabled": autoPaymentEnabled,
              "visioncard.$.autoPaymentModified": new Date(),
            },
          },
        )

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Cartão não encontrado" })
        }


        return res.status(200).json({
          message: `Pagamento automático ${autoPaymentEnabled ? "ativado" : "desativado"} com sucesso`,
          cardId,
          autoPaymentEnabled,
        })
      }

      // Criação de cartões
      if (action === "create") {
        const existingCards = user.visioncard || []
        const existingTypes = existingCards.map((card) => card.type)
        const createdCards: any[] = []

        const fullName = `${userinfo.firstname || "Usuário"} ${userinfo.lastname || ""}`.trim()

        // Verificar elegibilidade e criar cartões
        if (cardType === "VisionPay" && !existingTypes.includes("VisionPay")) {
          createdCards.push({
            type: "VisionPay",
            cardNumber: generateCardNumber(),
            cardHolder: fullName,
            expiry: "To Pay",
            cvv: generateCVV(),
            createdAt: new Date(),
            status: "active",
            autoPaymentEnabled: false,
            securitySettings: {
              dailyLimit: 0,
              monthlyLimit: 0,
              allowedMerchants: "all",
              blockedCountries: [],
            },
          })
        }

        if (cardType === "Sapphire" && !existingTypes.includes("Sapphire")) {
          createdCards.push({
            type: "Sapphire",
            cardNumber: generateCardNumber(),
            cardHolder: fullName,
            expiry: "Bits",
            cvv: generateCVV(),
            createdAt: new Date(),
            status: "active",
            autoPaymentEnabled: false,
            securitySettings: {
              dailyLimit: 0,
              monthlyLimit: 0,
              allowedMerchants: "all",
              blockedCountries: [],
            },
          })
        }

        if (
          cardType === "VΛULT" &&
          stats.level >= 40 &&
          !existingTypes.includes("VΛULT")
        ) {
          createdCards.push({
            type: "VΛULT",
            cardNumber: generateCardNumber(),
            cardHolder: fullName,
            expiry: "Bits & Coins",
            cvv: generateCVV(),
            limit: "Unlimited",
            createdAt: new Date(),
            status: "active",
            autoPaymentEnabled: false,
            securitySettings: {
              dailyLimit: 0,
              monthlyLimit: 0,
              allowedMerchants: "all",
              blockedCountries: [],
            },
          })
        }

        if (createdCards.length === 0) {
          return res.status(400).json({
            message: "Não é possível criar este cartão. Verifique os requisitos.",
            eligibility: {
              sapphire: (user.bitsCredits || 0) >= 100000,
              vault: stats.level >= 40 && (user.orbitCredits || 0) >= 500000,
            },
          })
        }

        // Criar transação de V-points para registrar a criação do cartão
        const transactionId = new Date().getTime().toString()
        await transactionsCollection.insertOne({
          id: transactionId,
          userId: userId,
          type: "earn",
          amount: 50,
          description: `Cartão ${cardType} criado - Bônus de boas-vindas`,
          timestamp: new Date(),
          status: "completed",
        })

        // Atualizar usuário com novo cartão e bônus
        const updateFields: any = {
          $push: { visioncard: { $each: createdCards } },
          $inc: { vpoints: 50 },
        }

        if (user.bitsCredits === undefined) {
          updateFields.$set = { ...updateFields.$set, bitsCredits: 0 }
        }
        if (user.orbitCredits === undefined) {
          updateFields.$set = { ...updateFields.$set, orbitCredits: 0 }
        }
        if (user.vpoints === undefined) {
          updateFields.$set = { ...updateFields.$set, vpoints: 50 }
        }

        await userCollection.updateOne({ _id: userId }, updateFields)

        return res.status(200).json({
          message: "Cartão criado com sucesso! Você ganhou 50 V-points de bônus.",
          cards: [...existingCards, ...createdCards],
          bonusPoints: 50,
        })
      }

      // Criação automática de cartões
      if (action === "auto_create") {
        const existingCards = user.visioncard || []
        const existingTypes = existingCards.map((card) => card.type)
        const createdCards: any[] = []

        const fullName = `${userinfo.firstname || "Usuário"} ${userinfo.lastname || ""}`.trim()

        if (!existingTypes.includes("VisionPay")) {
          createdCards.push({
            type: "VisionPay",
            cardNumber: generateCardNumber(),
            cardHolder: fullName,
            expiry: "To Pay",
            cvv: generateCVV(),
            createdAt: new Date(),
            status: "active",
            autoPaymentEnabled: false,
            securitySettings: {
              dailyLimit: 0,
              monthlyLimit: 0,
              allowedMerchants: "all",
              blockedCountries: [],
            },
          })
        }

        if (!existingTypes.includes("Sapphire")) {
          createdCards.push({
            type: "Sapphire",
            cardNumber: generateCardNumber(),
            cardHolder: fullName,
            expiry: "Bits",
            cvv: generateCVV(),
            createdAt: new Date(),
            status: "active",
            autoPaymentEnabled: false,
            securitySettings: {
              dailyLimit: 0,
              monthlyLimit: 0,
              allowedMerchants: "all",
              blockedCountries: [],
            },
          })
        }

        if (stats.level >= 40 && !existingTypes.includes("VΛULT")) {
          createdCards.push({
            type: "VΛULT",
            cardNumber: generateCardNumber(),
            cardHolder: fullName,
            expiry: "Bits & Coins",
            cvv: generateCVV(),
            limit: "Unlimited",
            createdAt: new Date(),
            status: "active",
            autoPaymentEnabled: false,
            securitySettings: {
              dailyLimit: 0,
              monthlyLimit: 0,
              allowedMerchants: "all",
              blockedCountries: [],
            },
          })
        }

        if (createdCards.length === 0) {
          return res.status(200).json({
            message: "Nenhum novo cartão criado. Usuário já possui todos os cartões disponíveis.",
            cards: existingCards,
          })
        }

        const bonusPoints = createdCards.length * 50

    
        const updateFields: any = {
          $push: { visioncard: { $each: createdCards } },
          $inc: { vpoints: bonusPoints },
        }

        if (user.bitsCredits === undefined) {
          updateFields.$set = { ...updateFields.$set, bitsCredits: 0 }
        }
        if (user.orbitCredits === undefined) {
          updateFields.$set = { ...updateFields.$set, orbitCredits: 0 }
        }

        await userCollection.updateOne({ _id: userId }, updateFields)

        return res.status(200).json({
          message: `${createdCards.length} cartão(s) criado(s) automaticamente! Você ganhou ${bonusPoints} V-points.`,
          cards: [...existingCards, ...createdCards],
          bonusPoints,
        })
      }
    }

    res.setHeader("Allow", ["GET", "POST"])
    return res.status(405).end(`Método ${req.method} não permitido`)
  } catch (error) {
    console.error("Erro ao processar cartões:", error)
    return res.status(500).json({ message: "Erro interno ao processar cartões" })
  }
}

const CardVision: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await visionCard(req, res)
}

export default withSession(CardVision)

