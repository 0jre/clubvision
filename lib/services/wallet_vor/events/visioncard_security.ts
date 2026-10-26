import { dbConnect } from "@/core/integration/connect"
import { NextIronHandler, withSession } from "@/lib/session"
import type { NextApiRequest, NextApiResponse } from "next"
import type { Session } from "next-iron-session"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

interface SecurityAction {
  id: string
  userId: string
  type: "freeze" | "unfreeze" | "autopay_toggle" | "limit_change"
  cardId: string
  description: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  metadata?: any
}

const securityHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  const sessionUser = req.session?.get("user")

  if (!req.session || !sessionUser) {
    return res.status(401).json({ isAuthenticated: false, message: "Usuário não autenticado." })
  }

  const { db } = await dbConnect()
  const userCollection = db.collection("items")
  const securityLogsCollection = db.collection("card_security_logs")
  const userId = sessionUser.id

  try {
    if (req.method === "GET") {
      // Buscar logs de segurança do usuário
      const securityLogs = await securityLogsCollection.find({ userId }).sort({ timestamp: -1 }).limit(50).toArray()

      // Buscar configurações de segurança dos cartões
      const user = await userCollection.findOne({ _id: userId })
      const cards = user?.visioncard || []

      const securitySettings = cards.map((card: any) => ({
        cardId: card.cardNumber,
        cardType: card.type,
        status: card.status || "active",
        autoPaymentEnabled: card.autoPaymentEnabled || false,
        dailyLimit: card.securitySettings?.dailyLimit || 5000,
        monthlyLimit: card.securitySettings?.monthlyLimit || 50000,
        allowedMerchants: card.securitySettings?.allowedMerchants || "all",
        blockedCountries: card.securitySettings?.blockedCountries || [],
        lastSecurityUpdate: card.lastModified || card.createdAt,
      }))

      return res.status(200).json({
        securityLogs: securityLogs.map((log) => ({
          id: log._id,
          type: log.type,
          cardId: log.cardId,
          description: log.description,
          timestamp: log.timestamp,
          ipAddress: log.ipAddress,
          success: log.success !== false,
        })),
        securitySettings,
        summary: {
          totalActions: securityLogs.length,
          lastAction: securityLogs[0]?.timestamp || null,
          activeCards: securitySettings.filter((s: any) => s.status === "active").length,
          frozenCards: securitySettings.filter((s: any) => s.status === "frozen").length,
          autoPayEnabled: securitySettings.filter((s: any) => s.autoPaymentEnabled).length,
        },
      })
    }

    if (req.method === "POST") {
      const { action, cardId, settings } = req.body

      if (!cardId) {
        return res.status(400).json({ message: "ID do cartão é obrigatório" })
      }

      const user = await userCollection.findOne({ _id: userId })
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" })
      }

      const cardExists = user.visioncard?.some((card: any) => card.cardNumber === cardId)
      if (!cardExists) {
        return res.status(404).json({ message: "Cartão não encontrado" })
      }

      let updateQuery: any = {}
      let logDescription = ""
      let success = true

      try {
        switch (action) {
          case "update_limits":
            if (!settings || typeof settings.dailyLimit !== "number" || typeof settings.monthlyLimit !== "number") {
              return res.status(400).json({ message: "Limites inválidos" })
            }

            if (settings.dailyLimit > 10000 || settings.monthlyLimit > 100000) {
              return res.status(400).json({ message: "Limites excedem o máximo permitido" })
            }

            updateQuery = {
              $set: {
                "visioncard.$.securitySettings.dailyLimit": settings.dailyLimit,
                "visioncard.$.securitySettings.monthlyLimit": settings.monthlyLimit,
                "visioncard.$.lastModified": new Date(),
              },
            }
            logDescription = `Limites atualizados: Diário R$${settings.dailyLimit}, Mensal R$${settings.monthlyLimit}`
            break

          case "update_merchants":
            if (!settings || !Array.isArray(settings.allowedMerchants)) {
              return res.status(400).json({ message: "Lista de comerciantes inválida" })
            }

            updateQuery = {
              $set: {
                "visioncard.$.securitySettings.allowedMerchants": settings.allowedMerchants,
                "visioncard.$.lastModified": new Date(),
              },
            }
            logDescription = `Comerciantes permitidos atualizados: ${settings.allowedMerchants.join(", ")}`
            break

          case "update_countries":
            if (!settings || !Array.isArray(settings.blockedCountries)) {
              return res.status(400).json({ message: "Lista de países inválida" })
            }

            updateQuery = {
              $set: {
                "visioncard.$.securitySettings.blockedCountries": settings.blockedCountries,
                "visioncard.$.lastModified": new Date(),
              },
            }
            logDescription = `Países bloqueados atualizados: ${settings.blockedCountries.join(", ")}`
            break

          case "emergency_freeze":
            updateQuery = {
              $set: {
                "visioncard.$.status": "frozen",
                "visioncard.$.emergencyFrozen": true,
                "visioncard.$.lastModified": new Date(),
              },
            }
            // Não registrar log para congelamento
            break

          case "emergency_unfreeze":
            updateQuery = {
              $set: {
                "visioncard.$.status": "active",
                "visioncard.$.emergencyFrozen": false,
                "visioncard.$.lastModified": new Date(),
              },
            }
            // Não registrar log para ativação
            break

          default:
            return res.status(400).json({ message: "Ação de segurança inválida" })
        }

        // Executar atualização
        const result = await userCollection.updateOne({ _id: userId, "visioncard.cardNumber": cardId }, updateQuery)

        if (result.matchedCount === 0) {
          throw new Error("Falha ao atualizar cartão")
        }
      } catch (error) {
        success = false
        logDescription += " (FALHOU)"
        console.error("Erro ao atualizar segurança do cartão:", error)
      }

      // Registrar log de segurança apenas para outras ações
      if (
        action !== "emergency_freeze" &&
        action !== "emergency_unfreeze"
      ) {
        const securityLog: SecurityAction = {
          id: new Date().getTime().toString(),
          userId,
          type: action as any,
          cardId,
          description: logDescription,
          timestamp: new Date(),
          ipAddress: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress,
          userAgent: req.headers["user-agent"],
          metadata: { settings, success },
        }

        await securityLogsCollection.insertOne(securityLog)
      }

      if (!success) {
        return res.status(500).json({ message: "Erro ao atualizar configurações de segurança" })
      }

      // Buscar cartão atualizado para retornar ao cliente
      const updatedUser = await userCollection.findOne({ _id: userId })
      const updatedCard = updatedUser?.visioncard.find((c: any) => c.cardNumber === cardId)

      return res.status(200).json({
        message: "Configurações de segurança atualizadas com sucesso",
        action,
        cardId,
        card: updatedCard, // <-- cartão atualizado
        timestamp: new Date(),
      })
    }

    res.setHeader("Allow", ["GET", "POST"])
    return res.status(405).end(`Método ${req.method} não permitido`)
  } catch (error) {
    console.error("Erro na API de segurança:", error)
    return res.status(500).json({ message: "Erro interno do servidor" })
  }
}


const CardVision: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  // Use o await para chamar a função original checkAuth
  await securityHandler(req, res);
};

export default withSession(CardVision);
 