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
  const commentId = req.query.commentId as string

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "ID de conteúdo inválido" })
  }

  if (!commentId) {
    return res.status(400).json({ message: "ID de comentário inválido" })
  }

  try {
    // Determinar a coleção com base no tipo de conteúdo
    const collection = contentType === "video" ? db.collection(visiontvCollection) : db.collection(postVisionCollection)

    // Buscar o conteúdo para verificar se existe
    const content = await collection.findOne({ _id: new ObjectId(id) })

    if (!content) {
      return res.status(404).json({ message: "Conteúdo não encontrado" })
    }

    // Verificar se o comentário existe
    const commentIndex = content.comments.findIndex(
      (comment: any) => comment._id.toString() === commentId || comment.id === commentId,
    )

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comentário não encontrado" })
    }

    if (req.method === "DELETE") {
      // Armazenar informações do comentário para auditoria
      const commentToDelete = content.comments[commentIndex]

      // Remover o comentário
      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $pull: { comments: { $or: [{ _id: new ObjectId(commentId) }, { id: commentId }] } } },
      )

      // Notificar o usuário sobre a remoção do comentário
      const notificationsCollection = db.collection("notifications")
      await notificationsCollection.insertOne({
        userId: commentToDelete.user.id,
        type: "comment_removed",
        title: "Comentário Removido",
        message: "Seu comentário foi removido por violar nossas diretrizes da comunidade.",
        timestamp: new Date(),
        read: false,
      })

      // Registrar a ação de auditoria
      const auditCollection = db.collection("audit-logs")
      await auditCollection.insertOne({
        action: "delete_comment",
        userId: sessionUser.id,
        contentId: id,
        commentId: commentId,
        timestamp: new Date(),
        details: {
          commentAuthorId: commentToDelete.user.id,
          commentText: commentToDelete.text,
        },
      })

      return res.status(200).json({ message: "Comentário removido com sucesso" })
    } else if (req.method === "PUT") {
      const { text, status, moderationNotes } = req.body

      // Atualizar o comentário
      const updatedComment = {
        ...content.comments[commentIndex],
        text: text || content.comments[commentIndex].text,
        status: status || content.comments[commentIndex].status || "active",
        moderated: true,
        moderatedAt: new Date(),
        moderatedBy: sessionUser.id,
        moderationNotes: moderationNotes || "",
      }

      // Atualizar o comentário no array
      content.comments[commentIndex] = updatedComment

      await collection.updateOne({ _id: new ObjectId(id) }, { $set: { comments: content.comments } })

      // Se o status for alterado para "hidden", notificar o usuário
      if (status === "hidden") {
        const notificationsCollection = db.collection("notifications")
        await notificationsCollection.insertOne({
          userId: updatedComment.user.id,
          type: "comment_hidden",
          title: "Comentário Ocultado",
          message: "Seu comentário foi ocultado por violar nossas diretrizes da comunidade.",
          timestamp: new Date(),
          read: false,
        })
      }

      // Registrar a ação de auditoria
      const auditCollection = db.collection("audit-logs")
      await auditCollection.insertOne({
        action: "update_comment",
        userId: sessionUser.id,
        contentId: id,
        commentId: commentId,
        timestamp: new Date(),
        details: {
          newStatus: status,
          textEdited: text !== content.comments[commentIndex].text,
          notes: moderationNotes,
        },
      })

      return res.status(200).json({ message: "Comentário atualizado com sucesso", comment: updatedComment })
    } else {
      return res.status(405).json({ message: "Método não permitido" })
    }
  } catch (error) {
    console.error(`Erro ao processar comentário ${commentId}:`, error)
    return res.status(500).json({ message: "Erro interno do servidor" })
  }
}

export default withSession(handler)
