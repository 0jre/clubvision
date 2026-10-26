// import type { NextApiRequest, NextApiResponse } from "next"
// import { dbConnect } from "@/vortexor/services/lib/vortex"
// import { getServerSession } from "next-auth"
 

// interface PunishmentData {
//   userId: string
//   action: "ban" | "freeze" | "warn" | "punish" | "unban" | "unfreeze"
//   reason: string
//   duration?: number // em horas, 0 = permanente
//   severity: "low" | "medium" | "high" | "critical"
//   notes?: string
//   restrictFeatures?: string[] // features específicas a restringir
// }

// interface UserPunishment {
//   id: string
//   userId: string
//   adminId: string
//   adminName: string
//   action: string
//   reason: string
//   severity: string
//   duration: number
//   startDate: Date
//   endDate: Date | null
//   isActive: boolean
//   notes?: string
//   restrictFeatures?: string[]
//   createdAt: Date
//   updatedAt: Date
// }

// /**
//  * API para aplicar punições administrativas em usuários
//  * Suporta ban, freeze, warn, punish com sistema de tempo
//  */
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Método não permitido" })
//   }

//   try {
//     const session = await getServerSession(authOptions)

//     if (!session || !session.user || !session.user.isAdmin) {
//       return res.status(403).json({ error: "Acesso não autorizado" })
//     }

//     const punishmentData: PunishmentData = req.body

//     // Validação dos dados
//     if (!punishmentData.userId || !punishmentData.action || !punishmentData.reason) {
//       return res.status(400).json({ error: "Dados obrigatórios não fornecidos" })
//     }

//     const validActions = ["ban", "freeze", "warn", "punish", "unban", "unfreeze"]
//     if (!validActions.includes(punishmentData.action)) {
//       return res.status(400).json({ error: "Ação inválida" })
//     }

//     const { db } = await dbConnect()
//     const usersCollection = db.collection("users")
//     const punishmentsCollection = db.collection("user_punishments")

//     // Verificar se o usuário existe
//     const targetUser = await usersCollection.findOne({ id: punishmentData.userId })
//     if (!targetUser) {
//       return res.status(404).json({ error: "Usuário não encontrado" })
//     }

//     // Não permitir punir outros administradores
//     if (targetUser.type === "ADMIN" && session.user.id !== punishmentData.userId) {
//       return res.status(403).json({ error: "Não é possível punir outros administradores" })
//     }

//     const currentDate = new Date()
//     let endDate: Date | null = null

//     // Calcular data de fim se houver duração
//     if (punishmentData.duration && punishmentData.duration > 0) {
//       endDate = new Date(currentDate.getTime() + punishmentData.duration * 60 * 60 * 1000)
//     }

//     // Criar registro de punição
//     const punishmentId = `punishment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

//     const punishment: UserPunishment = {
//       id: punishmentId,
//       userId: punishmentData.userId,
//       adminId: session.user.id,
//       adminName: session.user.name || "Admin",
//       action: punishmentData.action,
//       reason: punishmentData.reason,
//       severity: punishmentData.severity,
//       duration: punishmentData.duration || 0,
//       startDate: currentDate,
//       endDate: endDate,
//       isActive: !["unban", "unfreeze"].includes(punishmentData.action),
//       notes: punishmentData.notes,
//       restrictFeatures: punishmentData.restrictFeatures || [],
//       createdAt: currentDate,
//       updatedAt: currentDate,
//     }

//     // Inserir punição no banco
//     await punishmentsCollection.insertOne(punishment)

//     // Atualizar status do usuário baseado na ação
//     const userUpdate: any = {
//       updatedAt: currentDate,
//     }

//     switch (punishmentData.action) {
//       case "ban":
//         userUpdate.status = "banned"
//         userUpdate.bannedUntil = endDate
//         userUpdate.bannedReason = punishmentData.reason
//         userUpdate.isBanned = true
//         break

//       case "freeze":
//         userUpdate.status = "frozen"
//         userUpdate.frozenUntil = endDate
//         userUpdate.frozenReason = punishmentData.reason
//         userUpdate.isFrozen = true
//         break

//       case "warn":
//         userUpdate.warningCount = (targetUser.warningCount || 0) + 1
//         userUpdate.lastWarning = {
//           reason: punishmentData.reason,
//           date: currentDate,
//           adminId: session.user.id,
//         }
//         break

//       case "punish":
//         userUpdate.status = "punished"
//         userUpdate.punishedUntil = endDate
//         userUpdate.punishedReason = punishmentData.reason
//         userUpdate.restrictedFeatures = punishmentData.restrictFeatures || []
//         break

//       case "unban":
//         userUpdate.status = "active"
//         userUpdate.isBanned = false
//         userUpdate.bannedUntil = null
//         userUpdate.bannedReason = null
//         // Desativar punições de ban ativas
//         await punishmentsCollection.updateMany(
//           { userId: punishmentData.userId, action: "ban", isActive: true },
//           { $set: { isActive: false, updatedAt: currentDate } },
//         )
//         break

//       case "unfreeze":
//         userUpdate.status = "active"
//         userUpdate.isFrozen = false
//         userUpdate.frozenUntil = null
//         userUpdate.frozenReason = null
//         // Desativar punições de freeze ativas
//         await punishmentsCollection.updateMany(
//           { userId: punishmentData.userId, action: "freeze", isActive: true },
//           { $set: { isActive: false, updatedAt: currentDate } },
//         )
//         break
//     }

//     // Atualizar usuário
//     const userResult = await usersCollection.updateOne({ id: punishmentData.userId }, { $set: userUpdate })

//     // Registrar alteração crítica
//     await logCriticalChange(
//       session.user.id,
//       `user_${punishmentData.action}`,
//       {
//         userId: punishmentData.userId,
//         previousStatus: targetUser.status || "active",
//       },
//       {
//         userId: punishmentData.userId,
//         newStatus: userUpdate.status || targetUser.status,
//         punishment: punishment,
//       },
//     )

//     // Registrar ação de auditoria
//     await logAdminAction({
//       adminId: session.user.id,
//       action: `user_${punishmentData.action}`,
//       details: {
//         targetUserId: punishmentData.userId,
//         targetUserName: targetUser.name,
//         reason: punishmentData.reason,
//         severity: punishmentData.severity,
//         duration: punishmentData.duration,
//         endDate: endDate,
//         restrictFeatures: punishmentData.restrictFeatures,
//         punishmentId: punishmentId,
//       },
//     })

//     // Criar notificação para o usuário (opcional)
//     const notificationsCollection = db.collection("notifications")
//     await notificationsCollection.insertOne({
//       userId: punishmentData.userId,
//       type: "punishment",
//       title: getPunishmentTitle(punishmentData.action),
//       message: getPunishmentMessage(punishmentData.action, punishmentData.reason, endDate),
//       severity: punishmentData.severity,
//       isRead: false,
//       createdAt: currentDate,
//       data: {
//         punishmentId: punishmentId,
//         action: punishmentData.action,
//         endDate: endDate,
//       },
//     })

//     // Agendar remoção automática da punição se temporária
//     if (endDate && punishmentData.duration && punishmentData.duration > 0) {
//       await scheduleUnpunishment(punishmentData.userId, punishmentData.action, endDate)
//     }

//     return res.status(200).json({
//       success: true,
//       message: `${punishmentData.action} aplicado com sucesso`,
//       punishment: {
//         id: punishmentId,
//         action: punishmentData.action,
//         duration: punishmentData.duration,
//         endDate: endDate,
//         isTemporary: !!endDate,
//       },
//       userUpdated: userResult.modifiedCount > 0,
//     })
//   } catch (error) {
//     console.error("Erro ao aplicar punição:", error)
//     return res.status(500).json({ error: "Erro interno do servidor" })
//   }
// }

// /**
//  * Função para obter título da notificação baseado na ação
//  */
// function getPunishmentTitle(action: string): string {
//   const titles = {
//     ban: "🚫 Conta Banida",
//     freeze: "❄️ Conta Congelada",
//     warn: "⚠️ Advertência Recebida",
//     punish: "⛔ Conta Punida",
//     unban: "✅ Conta Desbloqueada",
//     unfreeze: "✅ Conta Descongelada",
//   }
//   return titles[action as keyof typeof titles] || "Ação Administrativa"
// }

// /**
//  * Função para obter mensagem da notificação
//  */
// function getPunishmentMessage(action: string, reason: string, endDate: Date | null): string {
//   const baseMessage = `Motivo: ${reason}`

//   if (endDate) {
//     const endDateStr = endDate.toLocaleString("pt-BR")
//     return `${baseMessage}\nVálido até: ${endDateStr}`
//   }

//   const messages = {
//     ban: `${baseMessage}\nSua conta foi banida permanentemente.`,
//     freeze: `${baseMessage}\nSua conta foi congelada permanentemente.`,
//     warn: `${baseMessage}\nEsta é uma advertência oficial.`,
//     punish: `${baseMessage}\nSua conta foi punida.`,
//     unban: "Sua conta foi desbloqueada e você pode acessar normalmente.",
//     unfreeze: "Sua conta foi descongelada e você pode acessar normalmente.",
//   }

//   return messages[action as keyof typeof messages] || baseMessage
// }

// /**
//  * Função para agendar remoção automática de punição
//  */
// async function scheduleUnpunishment(userId: string, action: string, endDate: Date) {
//   try {
//     const { db } = await dbConnect()
//     const scheduledTasksCollection = db.collection("scheduled_tasks")

//     await scheduledTasksCollection.insertOne({
//       type: "unpunish_user",
//       userId: userId,
//       action: action,
//       scheduledFor: endDate,
//       status: "pending",
//       createdAt: new Date(),
//       data: {
//         originalAction: action,
//         autoRemoval: true,
//       },
//     })
//   } catch (error) {
//     console.error("Erro ao agendar remoção de punição:", error)
//   }
// }
