import type { NextApiResponse } from "next"
import { ObjectId } from "mongodb"
import { dbConnect, postVisionCollection, visiontvCollection } from "@/core/integration/connect"
import { withSession, type NextIronRequest } from "@/lib/session"

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
  const contentType = (req.query.type as string) || "post"

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "ID de conteúdo inválido" })
  }

  try {
    // Determinar a coleção com base no tipo de conteúdo
    const collection = contentType === "video" ? db.collection(visiontvCollection) : db.collection(postVisionCollection)

    if (req.method === "GET") {
      // Buscar o conteúdo pelo ID
      const content = await collection.findOne({ _id: new ObjectId(id) })

      if (!content) {
        return res.status(404).json({ message: "Conteúdo não encontrado" })
      }

      // Buscar informações do autor
      const user = await usersCollection.findOne({ id: content.userId })

      // Enriquecer o conteúdo com informações do autor
      const enrichedContent = {
        ...content,
        author: {
          id: content.userId,
          username: user?.username || "unknown",
          displayName: user?.name || "Unknown User",
          avatar: user?.avatar || null,
          verified: user?.verified || false,
          followerCount: user?.followers?.length || 0,
        },
        status: content.status || "active",
        metrics: {
          views: content.views || 0,
          likes: content.likedBy?.length || 0,
          comments: content.comments?.length || 0,
          reports: content.reports || 0,
          shares: content.shares || 0,
        },
        // Adicionar histórico de moderação se existir
        moderationHistory: content.moderationHistory || [],
      }

      // Registrar a ação de auditoria
      const auditCollection = db.collection("audit-logs")
      await auditCollection.insertOne({
        action: "view_content_details",
        userId: sessionUser.id,
        contentId: id,
        timestamp: new Date(),
      })

      return res.status(200).json(enrichedContent)
    } else if (req.method === "PUT") {
      const { status, moderationNotes } = req.body

      if (!status) {
        return res.status(400).json({ message: "Status de moderação é obrigatório" })
      }

      // Atualizar o status do conteúdo
      const updateData: any = {
        status,
        lastModerated: new Date(),
        lastModeratedBy: sessionUser.id,
      }

      // Adicionar entrada no histórico de moderação
      const moderationEntry = {
        action: `status_changed_to_${status}`,
        moderator: sessionUser.id,
        moderatorName: userRecord.name || "Admin",
        timestamp: new Date(),
        notes: moderationNotes || "",
      }

      await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: updateData,
          $push: { moderationHistory: moderationEntry },
        },
      )

      // Se o status for "removed", notificar o usuário
      if (status === "removed") {
        const content = await collection.findOne({ _id: new ObjectId(id) })
        const notificationsCollection = db.collection("notifications")

        await notificationsCollection.insertOne({
          userId: content?.userId,
          type: "content_removed",
          title: "Conteúdo Removido",
          message: `Seu conteúdo foi removido por violar nossas diretrizes da comunidade. ${moderationNotes || ""}`,
          timestamp: new Date(),
          read: false,
        })
      }

      // Registrar a ação de auditoria
      const auditCollection = db.collection("audit-logs")
      await auditCollection.insertOne({
        action: "update_content_status",
        userId: sessionUser.id,
        contentId: id,
        timestamp: new Date(),
        details: {
          newStatus: status,
          notes: moderationNotes,
        },
      })

      return res.status(200).json({ message: "Status do conteúdo atualizado com sucesso" })
    } else if (req.method === "DELETE") {
      // Buscar o conteúdo antes de excluir para registrar informações
      const content = await collection.findOne({ _id: new ObjectId(id) })

      if (!content) {
        return res.status(404).json({ message: "Conteúdo não encontrado" })
      }

      // Excluir o conteúdo
      await collection.deleteOne({ _id: new ObjectId(id) })

      // Notificar o usuário sobre a exclusão
      const notificationsCollection = db.collection("notifications")
      await notificationsCollection.insertOne({
        userId: content.userId,
        type: "content_deleted",
        title: "Conteúdo Excluído",
        message: "Seu conteúdo foi excluído permanentemente por violar nossas diretrizes da comunidade.",
        timestamp: new Date(),
        read: false,
      })

      // Registrar a ação de auditoria
      const auditCollection = db.collection("audit-logs")
      await auditCollection.insertOne({
        action: "delete_content",
        userId: sessionUser.id,
        contentId: id,
        timestamp: new Date(),
        details: {
          contentType,
          contentUserId: content.userId,
          contentTitle: content.title || "Sem título",
        },
      })

      return res.status(200).json({ message: "Conteúdo excluído com sucesso" })
    } else {
      return res.status(405).json({ message: "Método não permitido" })
    }
  } catch (error) {
    console.error(`Erro ao processar conteúdo ${id}:`, error)
    return res.status(500).json({ message: "Erro interno do servidor" })
  }
}

export default withSession(handler)
