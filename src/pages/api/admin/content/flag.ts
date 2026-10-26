import type { NextApiResponse } from "next"
import { ObjectId } from "mongodb"
import { dbConnect, postVisionCollection, visiontvCollection } from "@/core/integration/connect"
import { withSession, type NextIronRequest } from "@/lib/session"

async function handler(req: NextIronRequest, res: NextApiResponse) {
  // Verificar se o usuário está autenticado e é administrador
  const sessionUser = req.session?.get("user")
  if (!sessionUser) {
    return res.status(401).json({ message: "Usuário não autenticado." })
  }

  const { db } = await dbConnect()
  const usersCollection = db.collection("users")
  const userRecord = await usersCollection.findOne({ id: sessionUser.id })

  if (userRecord?.type !== "ADMIN") {
    return res.status(403).json({ message: "Acesso negado. Permissão de administrador necessária." })
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido." })
  }

  const { id, contentType, reason, action } = req.body

  if (!id || !contentType || !reason || !action) {
    return res.status(400).json({ message: "ID, tipo de conteúdo, motivo e ação são obrigatórios." })
  }

  if (contentType !== "post" && contentType !== "video") {
    return res.status(400).json({ message: "Tipo de conteúdo inválido." })
  }

  if (!["flag", "unflag"].includes(action)) {
    return res.status(400).json({ message: "Ação inválida." })
  }

  try {
    const collection = contentType === "post" ? db.collection(postVisionCollection) : db.collection(visiontvCollection)

    // Verificar se o conteúdo existe
    const content = await collection.findOne({ _id: new ObjectId(id) })

    if (!content) {
      return res.status(404).json({ message: "Conteúdo não encontrado." })
    }

    if (action === "flag") {
      // Adicionar flag ao conteúdo
      await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            flagged: true,
            flaggedAt: new Date(),
            flaggedBy: sessionUser.id,
            flagReason: reason,
          },
        },
      )

      // Registrar ação de sinalização em um log
      await db.collection("moderation_logs").insertOne({
        contentId: id,
        contentType,
        action: "flag_content",
        moderatorId: sessionUser.id,
        reason,
        timestamp: new Date(),
      })

      // Notificar o usuário que criou o conteúdo
      await db.collection("notifications").insertOne({
        userId: content.userId,
        type: "content_flagged",
        title: "Conteúdo Sinalizado",
        message: `Seu ${contentType === "post" ? "post" : "vídeo"} foi sinalizado por violar nossas diretrizes. Motivo: ${reason}`,
        timestamp: new Date(),
      })

      return res.status(200).json({ message: "Conteúdo sinalizado com sucesso." })
    } else {
      // Remover flag do conteúdo
      await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $unset: {
            flagged: "",
            flaggedAt: "",
            flaggedBy: "",
            flagReason: "",
          },
        },
      )

      // Registrar ação de remoção de sinalização em um log
      await db.collection("moderation_logs").insertOne({
        contentId: id,
        contentType,
        action: "unflag_content",
        moderatorId: sessionUser.id,
        reason: req.body.unflagReason || "Conteúdo revisado e aprovado",
        timestamp: new Date(),
      })

      return res.status(200).json({ message: "Sinalização removida com sucesso." })
    }
  } catch (error) {
    console.error("Erro ao sinalizar conteúdo:", error)
    return res.status(500).json({ message: "Erro ao sinalizar conteúdo." })
  }
}

export default withSession(handler)
