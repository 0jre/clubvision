import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import { dbConnect } from "@/core/integration/connect"
import { defaultSettings } from "@/hooks/settings"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

 

const settingsHandler: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  try {
    const sessionUser = req.session?.get("user")

    // Verificar autenticação
    if (!req.session || !sessionUser) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado.",
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

    if (req.method === "GET") {
      // Buscar configurações atuais do usuário
      const userSettings = userRecord.settings || defaultSettings

      return res.status(200).json({
        success: true,
        settings: userSettings,
      })
    } else if (req.method === "POST" || req.method === "PUT") {
      // Atualizar configurações
      const { category, settingKey, value } = req.body

      // Validar dados recebidos
      if (!category || !settingKey || typeof value !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "Dados inválidos. Necessário: category, settingKey e value (boolean).",
        })
      }

      // Validar se a categoria existe
      if (!defaultSettings[category as keyof typeof defaultSettings]) {
        return res.status(400).json({
          success: false,
          message: "Categoria de configuração inválida.",
        })
      }

      // Buscar configurações atuais ou usar padrão
      const currentSettings = userRecord.settings || defaultSettings

      // Validar se a configuração existe na categoria
      if (!(settingKey in currentSettings[category as keyof typeof defaultSettings])) {
        return res.status(400).json({
          success: false,
          message: "Configuração não encontrada na categoria especificada.",
        })
      }

      // Atualizar a configuração específica
      const updatedSettings = {
        ...currentSettings,
        [category]: {
          ...currentSettings[category as keyof typeof currentSettings],
          [settingKey]: value,
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
        message: "Configuração atualizada com sucesso.",
        settings: updatedSettings,
      })
    } else {
      return res.status(405).json({
        success: false,
        message: "Método não permitido.",
      })
    }
  } catch (error) {
    console.error("Erro ao gerenciar configurações:", error)
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
    })
  }
}

const SettingsAPI: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await settingsHandler(req, res)
}

export default withSession(SettingsAPI)
