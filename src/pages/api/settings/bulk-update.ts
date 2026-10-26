import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import { dbConnect } from "@/core/integration/connect"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

const bulkUpdateHandler: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  try {
    const sessionUser = req.session?.get("user")

    // Verificar autenticação
    if (!req.session || !sessionUser) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado.",
      })
    }

    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Método não permitido. Use POST.",
      })
    }

    const { category, settings } = req.body

    // Validar dados recebidos
    if (!category || !settings || typeof settings !== "object") {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos. Necessário: category e settings (object).",
      })
    }

    const { db } = await dbConnect()
    const usersCollection = db.collection("users")

    // Verificar se o usuário existe
    const userRecord = await usersCollection.findOne({ id: sessionUser.id })
    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado.",
      })
    }

    // Buscar configurações atuais
    const currentSettings = userRecord.settings || {}

    // Atualizar toda a categoria de configurações
    const updatedSettings = {
      ...currentSettings,
      [category]: {
        ...currentSettings[category],
        ...settings,
      },
    }

    // Salvar no banco de dados
    await usersCollection.updateOne(
      { id: sessionUser.id },
      {
        $set: {
          settings: updatedSettings,
 
        },
      },
    )

    return res.status(200).json({
      success: true,
      message: `Configurações de ${category} atualizadas com sucesso.`,
      settings: updatedSettings,
    })
  } catch (error) {
    console.error("Erro ao atualizar configurações em lote:", error)
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
    })
  }
}

const BulkUpdateAPI: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await bulkUpdateHandler(req, res)
}

export default withSession(BulkUpdateAPI)
