import type { NextApiResponse } from "next"
import { ObjectId } from "mongodb"
import { dbConnect, postVisionCollection, visiontvCollection } from "@/core/integration/connect"
import { withSession, type NextIronRequest } from "@/lib/session"
import analyzeInappropriateContent from "@/lib/services/analyst/InappropriateContent/verification"

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

  if (req.method === "POST") {
    try {
      const { contentId, contentType, text } = req.body

      if (!contentId || !contentType || !text) {
        return res.status(400).json({ message: "ID de conteúdo, tipo e texto são obrigatórios" })
      }

      // Determinar a coleção com base no tipo de conteúdo
      const collectionName = contentType === "video" ? visiontvCollection : postVisionCollection

      // Analisar o conteúdo
      const analysisResult = await analyzeInappropriateContent(collectionName, sessionUser.id, text)

      // Registrar a análise no banco de dados
      const auditCollection = db.collection("audit-logs")
      await auditCollection.insertOne({
        action: "analyze_content",
        userId: sessionUser.id,
        contentId,
        timestamp: new Date(),
        details: {
          contentType,
          originalText: text,
          analysisResult,
        },
      })

      // Se o conteúdo tiver violações, atualizar o status
      if (analysisResult.hasContentViolation) {
        const collection = db.collection(collectionName)

        // Verificar se é um comentário ou conteúdo principal
        if (req.body.isComment && req.body.commentId) {
          // É um comentário - marcar para revisão
          const content = await collection.findOne({ _id: new ObjectId(contentId) })

          if (content) {
            const commentIndex = content.comments.findIndex(
              (c: any) => c._id.toString() === req.body.commentId || c.id === req.body.commentId,
            )

            if (commentIndex !== -1) {
              content.comments[commentIndex].status = "under_review"
              content.comments[commentIndex].flaggedReason = "inappropriate_content"
              content.comments[commentIndex].flaggedAt = new Date()
              content.comments[commentIndex].flaggedBy = "ai_system"

              await collection.updateOne({ _id: new ObjectId(contentId) }, { $set: { comments: content.comments } })
            }
          }
        } else {
          // É conteúdo principal - marcar para revisão
          await collection.updateOne(
            { _id: new ObjectId(contentId) },
            {
              $set: {
                status: "under_review",
                flaggedReason: "inappropriate_content",
                flaggedAt: new Date(),
                flaggedBy: "ai_system",
              },
            },
          )
        }
      }

    return res.status(200).json({
  analysis: analysisResult,
  recommendations: {
    action: analysisResult.hasContentViolation ? "review" : "approve",
    severity: analysisResult.hasContentViolation
      ? analysisResult.wordsRemoved.length > 3
        ? "high"
        : "medium"
      : "low",
  },
      })
    } catch (error) {
      console.error("Erro ao analisar conteúdo:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" })
  }
}

export default withSession(handler)
