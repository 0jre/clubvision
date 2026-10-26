import type { NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronRequest } from "@/lib/session"
import { Client, type TextChannel } from "discord.js"

// Configuração do cliente Discord
const discordOptions = {
  intents: 9,
}
const discordClient = new Client(discordOptions)
const channelId = process.env.DISCORD_CHANNEL_ID || "1265465512918257774"

// Função para enviar mensagem ao Discord
async function sendDiscordMessage(message: string): Promise<void> {
  try {
    await discordClient.login(process.env.BOT_TOKEN)
    const channel = (await discordClient.channels.fetch(channelId)) as TextChannel

    if (!channel) {
      throw new Error("Canal do Discord não encontrado.")
    }

    await channel.send(message)
  } catch (error) {
    console.error("Erro ao enviar mensagem para o Discord:", error)
    throw error
  }
}

async function handler(req: NextIronRequest, res: NextApiResponse) {
  // Verificar se o usuário está autenticado e é admin
  const sessionUser = req.session?.get("user")
  if (!req.session || !sessionUser) {
    return res.status(401).json({ isAuthenticated: false, message: "Usuário não autenticado." })
  }

  const { db } = await dbConnect()
  const usersCollection = db.collection("users")
  const userRecord = await usersCollection.findOne({ id: sessionUser.id })

  const isAdmin = userRecord?.type === "ADMIN"
  if (!isAdmin) {
    return res.status(403).json({ message: "Acesso negado. Permissão de administrador necessária." })
  }

  const { id } = req.query

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "ID de usuário inválido" })
  }

  try {
    // Buscar o usuário
    const targetUser = await usersCollection.findOne({ id })

    if (!targetUser) {
      return res.status(404).json({ message: "Usuário não encontrado" })
    }

    if (req.method === "GET") {
      // Buscar informações adicionais do usuário
      const { db } = await dbConnect()
      const postVisionColl = db.collection("postVisionCollection")
      const visionTvColl = db.collection("visiontvCollection")
      const reformsCollection = db.collection("reforms")

      // Contar conteúdo do usuário
      const postCount = await postVisionColl.countDocuments({ userId: id })
      const videoCount = await visionTvColl.countDocuments({ userId: id })

      // Buscar informações de reforma
      const reformInfo = await reformsCollection.findOne({ userId: id })

      // Buscar histórico de moderação do usuário
      const auditCollection = db.collection("audit-logs")
      const moderationHistory = await auditCollection
        .find({
          $or: [{ userId: id }, { "details.contentUserId": id }, { "details.commentAuthorId": id }],
        })
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray()

      // Registrar a ação de auditoria
      await auditCollection.insertOne({
        action: "view_user_details",
        userId: sessionUser.id,
        targetUserId: id,
        timestamp: new Date(),
      })

      // Retornar informações do usuário
      return res.status(200).json({
        user: {
          ...targetUser,
          contentStats: {
            posts: postCount,
            videos: videoCount,
            total: postCount + videoCount,
          },
          reformInfo: reformInfo || null,
          moderationHistory,
        },
      })
    } else if (req.method === "PUT") {
      const { action, reason, duration, notes } = req.body

      if (!action) {
        return res.status(400).json({ message: "Ação é obrigatória" })
      }

      const auditCollection = db.collection("audit-logs")
      const notificationsCollection = db.collection("notifications")

      // Executar a ação solicitada
      switch (action) {
        case "warn":
          // Adicionar aviso ao usuário
          await usersCollection.updateOne(
            { id },
            {
              $push: {
                warnings: {
                  id: new Date().getTime().toString(),
                  reason: reason || "Violação das diretrizes da comunidade",
                  issuedBy: sessionUser.id,
                  issuedAt: new Date(),
                  notes: notes || "",
                },
              },
              $inc: { warningCount: 1 },
            },
          )

          // Notificar o usuário
          await notificationsCollection.insertOne({
            userId: id,
            type: "warning",
            title: "Aviso de Moderação",
            message: `Você recebeu um aviso: ${reason || "Violação das diretrizes da comunidade"}`,
            timestamp: new Date(),
            read: false,
          })

          // Enviar mensagem ao Discord
          await sendDiscordMessage(
            `⚠️ <@${id}> recebeu um aviso de moderação: ${reason || "Violação das diretrizes da comunidade"}`,
          )
          break

        case "suspend":
          // Suspender o usuário
          const suspensionEnd = duration ? new Date(Date.now() + Number.parseInt(duration) * 24 * 60 * 60 * 1000) : null

          await usersCollection.updateOne(
            { id },
            {
              $set: {
                status: "suspended",
                suspendedAt: new Date(),
                suspendedBy: sessionUser.id,
                suspensionReason: reason || "Violação das diretrizes da comunidade",
                suspensionEnd: suspensionEnd,
                suspensionNotes: notes || "",
              },
            },
          )

          // Notificar o usuário
          await notificationsCollection.insertOne({
            userId: id,
            type: "suspension",
            title: "Conta Suspensa",
            message: `Sua conta foi suspensa: ${reason || "Violação das diretrizes da comunidade"}${suspensionEnd ? `. Suspensão termina em: ${suspensionEnd.toLocaleDateString()}` : ""}`,
            timestamp: new Date(),
            read: false,
          })

          // Enviar mensagem ao Discord
          await sendDiscordMessage(
            `🚫 <@${id}> teve a conta suspensa: ${reason || "Violação das diretrizes da comunidade"}${suspensionEnd ? ` até ${suspensionEnd.toLocaleDateString()}` : ""}`,
          )
          break

        case "ban":
          // Banir o usuário
          await usersCollection.updateOne(
            { id },
            {
              $set: {
                status: "banned",
                bannedAt: new Date(),
                bannedBy: sessionUser.id,
                banReason: reason || "Violação grave das diretrizes da comunidade",
                banNotes: notes || "",
              },
            },
          )

          // Notificar o usuário
          await notificationsCollection.insertOne({
            userId: id,
            type: "ban",
            title: "Conta Banida",
            message: `Sua conta foi banida permanentemente: ${reason || "Violação grave das diretrizes da comunidade"}`,
            timestamp: new Date(),
            read: false,
          })

          // Enviar mensagem ao Discord
          await sendDiscordMessage(
            `🔨 <@${id}> foi banido permanentemente: ${reason || "Violação grave das diretrizes da comunidade"}`,
          )
          break

        case "restrict":
          // Restringir o usuário
          await usersCollection.updateOne(
            { id },
            {
              $set: {
                restricted: true,
                restrictedAt: new Date(),
                restrictedBy: sessionUser.id,
                restrictionReason: reason || "Comportamento suspeito",
                restrictionNotes: notes || "",
              },
            },
          )

          // Atualizar as reformas do usuário
          const reformsCollection = db.collection("reforms")
          await reformsCollection.updateOne(
            { userId: id },
            {
              $set: {
                limitipost: 1,
                contractvision: false,
              },
            },
            { upsert: true },
          )

          // Notificar o usuário
          await notificationsCollection.insertOne({
            userId: id,
            type: "restriction",
            title: "Conta Restrita",
            message: `Sua conta foi restrita: ${reason || "Comportamento suspeito"}. Suas permissões de postagem foram limitadas.`,
            timestamp: new Date(),
            read: false,
          })

          // Enviar mensagem ao Discord
          await sendDiscordMessage(`🔒 <@${id}> teve a conta restrita: ${reason || "Comportamento suspeito"}`)
          break

        case "unban":
        case "unsuspend":
        case "unrestrict":
          // Restaurar o status do usuário
          const updateFields: any = { status: "active" }

          if (action === "unrestrict") {
            updateFields.restricted = false
          }

          await usersCollection.updateOne(
            { id },
            {
              $set: updateFields,
              $push: {
                statusHistory: {
                  previousStatus: targetUser.status,
                  newStatus: "active",
                  changedAt: new Date(),
                  changedBy: sessionUser.id,
                  reason: reason || "Restrição removida",
                },
              },
            },
          )

          // Notificar o usuário
          const actionMap = {
            unban: "Banimento removido",
            unsuspend: "Suspensão removida",
            unrestrict: "Restrições removidas",
          }

          await notificationsCollection.insertOne({
            userId: id,
            type: "status_restored",
            title: actionMap[action as keyof typeof actionMap],
            message: `Sua conta foi restaurada: ${reason || "Restrição removida"}`,
            timestamp: new Date(),
            read: false,
          })

          // Enviar mensagem ao Discord
          await sendDiscordMessage(
            `✅ <@${id}> teve ${actionMap[action as keyof typeof actionMap].toLowerCase()}: ${reason || "Restrição removida"}`,
          )
          break

        default:
          return res.status(400).json({ message: "Ação inválida" })
      }

      // Registrar a ação de auditoria
      await auditCollection.insertOne({
        action: `user_${action}`,
        userId: sessionUser.id,
        targetUserId: id,
        timestamp: new Date(),
        details: {
          reason,
          duration,
          notes,
        },
      })

      return res.status(200).json({
        message: "Ação executada com sucesso",
        action,
        userId: id,
      })
    } else {
      return res.status(405).json({ message: "Método não permitido" })
    }
  } catch (error) {
    console.error(`Erro ao processar usuário ${id}:`, error)
    return res.status(500).json({ message: "Erro interno do servidor" })
  }
}

export default withSession(handler)
