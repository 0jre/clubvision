import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import { dbConnect } from "@/core/integration/connect"
import { defaultSettings } from "@/hooks/settings"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }
 
const resetHandler: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
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

    const { category } = req.body

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

    let updatedSettings

    if (category) {
      // Resetar apenas uma categoria específica
      if (!defaultSettings[category as keyof typeof defaultSettings]) {
        return res.status(400).json({
          success: false,
          message: "Categoria de configuração inválida.",
        })
      }

      const currentSettings = userRecord.settings || {}
      updatedSettings = {
        ...currentSettings,
        [category]: defaultSettings[category as keyof typeof defaultSettings],
       
      }
    } else {
      // Resetar todas as configurações
      updatedSettings = defaultSettings
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
      message: category
        ? `Configurações de ${category} resetadas para o padrão.`
        : "Todas as configurações foram resetadas para o padrão.",
      settings: updatedSettings,
    })
  } catch (error) {
    console.error("Erro ao resetar configurações:", error)
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
    })
  }
}

const ResetAPI: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await resetHandler(req, res)
}

export default withSession(ResetAPI)
