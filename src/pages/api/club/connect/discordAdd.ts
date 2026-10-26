import type { NextApiResponse } from "next"
import { type NextIronRequest, withSession } from "@/lib/session"
import axios from "axios"
import { Client, GatewayIntentBits, type Guild } from "discord.js"
import { dbConnect } from "@/core/integration/connect"

// Configurações do servidor
const SERVER_CONFIG = {
  GUILD_ID: "1175857498687807560",
  DEFAULT_ROLE_ID: "1226222969903124520",
  BOT_TOKEN: process.env.BOT_TOKEN,
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000, // 2 segundos
  REQUEST_TIMEOUT: 15000, // 15 segundos
}

// Validação de ambiente
const validateEnvironment = () => {
  if (!SERVER_CONFIG.BOT_TOKEN) {
    throw new Error("Token do bot não configurado nas variáveis de ambiente.")
  }

  if (!SERVER_CONFIG.GUILD_ID || !SERVER_CONFIG.DEFAULT_ROLE_ID) {
    throw new Error("IDs do servidor ou cargo não configurados.")
  }
}

// Validação de sessão
const validateSession = (oauthData: any, vid: string) => {
  if (!oauthData || !oauthData.access_token) {
    throw new Error("Sessão expirada ou inválida. Faça login novamente.")
  }

  if (!vid || typeof vid !== "string") {
    throw new Error("Parâmetro userId (VID) ausente ou inválido na query.")
  }

  // Verificar se a sessão não expirou (30 minutos)
  const sessionAge = Date.now() - new Date(oauthData.created_at).getTime()
  if (sessionAge > 30 * 60 * 1000) {
    throw new Error("Sessão de autenticação expirada. Faça login novamente.")
  }

  return true
}

// Função para adicionar usuário ao servidor com retry
const addUserToGuildWithRetry = async (userId: any, accessToken: string): Promise<boolean> => {
  let lastError: any

  for (let attempt = 1; attempt <= SERVER_CONFIG.MAX_RETRIES; attempt++) {
    try {
      console.log(
        `[DISCORD_ADD] Tentativa ${attempt}/${SERVER_CONFIG.MAX_RETRIES} de adicionar usuário ${userId} ao servidor`,
      )

      const response = await axios.put(
        `https://discord.com/api/v10/guilds/${SERVER_CONFIG.GUILD_ID}/members/${userId}`,
        {
          access_token: accessToken,
          nick: undefined, // Permitir que o usuário mantenha seu nick atual
        },
        {
          headers: {
            Authorization: `Bot ${SERVER_CONFIG.BOT_TOKEN}`,
            "Content-Type": "application/json",
            "User-Agent": "ClubVision-Bot/1.0",
          },
          timeout: SERVER_CONFIG.REQUEST_TIMEOUT,
        },
      )

      if ([201, 204].includes(response.status)) {
        console.log(`[DISCORD_ADD] Usuário ${userId} adicionado ao servidor com sucesso (status: ${response.status})`)
        return true
      }

      console.warn(`[DISCORD_ADD] Status inesperado ao adicionar usuário: ${response.status}`)
      return false
    } catch (error: any) {
      lastError = error
      console.error(`[DISCORD_ADD] Tentativa ${attempt} falhou:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })

      // Se o usuário já está no servidor, considerar como sucesso
      if (error.response?.status === 409) {
        console.log(`[DISCORD_ADD] Usuário ${userId} já está no servidor`)
        return true
      }

      // Se é erro de token inválido, não tentar novamente
      if (error.response?.status === 401) {
        throw new Error("Token de acesso inválido ou expirado.")
      }

      // Se é erro de permissões, não tentar novamente
      if (error.response?.status === 403) {
        throw new Error("Bot não tem permissões para adicionar usuários ao servidor.")
      }

      // Aguardar antes da próxima tentativa (exceto na última)
      if (attempt < SERVER_CONFIG.MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, SERVER_CONFIG.RETRY_DELAY * attempt))
      }
    }
  }

  throw new Error(`Falha ao adicionar usuário após ${SERVER_CONFIG.MAX_RETRIES} tentativas: ${lastError?.message}`)
}

// Função para aplicar cargo com retry
const addRoleToUserWithRetry = async (userId: any): Promise<boolean> => {
  let client: Client | null = null
  let lastError: any

  for (let attempt = 1; attempt <= SERVER_CONFIG.MAX_RETRIES; attempt++) {
    try {
      console.log(`[ROLE_ADD] Tentativa ${attempt}/${SERVER_CONFIG.MAX_RETRIES} de aplicar cargo ao usuário ${userId}`)

      client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
      })

      // Login do bot
      await client.login(SERVER_CONFIG.BOT_TOKEN)

      // Buscar servidor
      const guild: Guild = await client.guilds.fetch(SERVER_CONFIG.GUILD_ID)
      if (!guild) {
        throw new Error("Servidor não encontrado.")
      }

      // Buscar membro
      const member = await guild.members.fetch(userId)
      if (!member) {
        throw new Error("Usuário não encontrado no servidor.")
      }

      // Verificar se já possui o cargo
      if (member.roles.cache.has(SERVER_CONFIG.DEFAULT_ROLE_ID)) {
        console.log(`[ROLE_ADD] Usuário ${userId} já possui o cargo padrão`)
        return true
      }

      // Aplicar cargo
      await member.roles.add(SERVER_CONFIG.DEFAULT_ROLE_ID, "Cargo padrão aplicado automaticamente")
      console.log(`[ROLE_ADD] Cargo ${SERVER_CONFIG.DEFAULT_ROLE_ID} aplicado ao usuário ${userId} com sucesso`)

      return true
    } catch (error: any) {
      lastError = error
      console.error(`[ROLE_ADD] Tentativa ${attempt} falhou:`, error.message)

      // Se o usuário não está no servidor, não tentar novamente
      if (error.message.includes("não encontrado no servidor")) {
        throw new Error("Usuário deve ser adicionado ao servidor antes de receber cargos.")
      }

      // Aguardar antes da próxima tentativa (exceto na última)
      if (attempt < SERVER_CONFIG.MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, SERVER_CONFIG.RETRY_DELAY * attempt))
      }
    } finally {
      // Sempre destruir o cliente
      if (client) {
        try {
          await client.destroy()
        } catch (destroyError) {
          console.error("[ROLE_ADD] Erro ao destruir cliente Discord:", destroyError)
        }
      }
    }
  }

  throw new Error(`Falha ao aplicar cargo após ${SERVER_CONFIG.MAX_RETRIES} tentativas: ${lastError?.message}`)
}

// Verificar se usuário existe no banco
const verifyUserInDatabase = async (vid: string) => {
  try {
    const { db } = await dbConnect()
    const user = await db.collection("users").findOne({discord_id: vid})

    if (!user) {
      throw new Error("Usuário não encontrado no banco de dados.")
    }

    if (user.trash || user.banned) {
      throw new Error("Usuário está na blacklist e não pode ser adicionado ao servidor.")
    }

    return user
  } catch (error) {
    console.error("[DB_CHECK] Erro ao verificar usuário no banco:", error)
    throw error
  }
}

// Registrar atividade no log
const logActivity = async (userId: any, action: string, success: boolean, details?: any) => {
  try {
    const { db } = await dbConnect()
    await db.collection("activity_logs").insertOne({
      userId,
      action,
      success,
      details,
      timestamp: new Date(),
      ip: details?.ip || "unknown",
    })
  } catch (error) {
    console.error("[LOG] Erro ao registrar atividade:", error)
    // Não falhar o processo principal por erro de log
  }
}

const handler = async (req: NextIronRequest, res: NextApiResponse) => {
  const startTime = Date.now()
  let userId: String | undefined

  try {
    console.log("[DISCORD_ADD] Iniciando processo de adição ao Discord")

    // Validar ambiente
    validateEnvironment()

    // Obter e validar sessão
    const oauthData = await req.session.get("oauth_temp")
    const vid = String(req.query.userId)
    validateSession(oauthData, vid)

    console.log(`[DISCORD_ADD] Processando VID: ${vid}`)

    // Verificar usuário no banco de dados
    const userRecord = await verifyUserInDatabase(vid)
    userId = userRecord.discord_id || vid

    console.log(`[DISCORD_ADD] Discord ID identificado: ${userId}`)

    // Executar adição ao servidor e aplicação de cargo em paralelo
    const [addedToGuild, roleApplied] = await Promise.allSettled([
      addUserToGuildWithRetry(userId, oauthData.access_token),
      addRoleToUserWithRetry(userId),
    ])

    // Processar resultados
    const guildResult = addedToGuild.status === "fulfilled" ? addedToGuild.value : false
    const roleResult = roleApplied.status === "fulfilled" ? roleApplied.value : false

    // Log de erros se houver
    if (addedToGuild.status === "rejected") {
      console.error("[DISCORD_ADD] Erro ao adicionar ao servidor:", addedToGuild.reason)
    }
    if (roleApplied.status === "rejected") {
      console.error("[DISCORD_ADD] Erro ao aplicar cargo:", roleApplied.reason)
    }

    // Registrar atividade
    await logActivity(userId, "discord_add", guildResult && roleResult, {
      addedToGuild: guildResult,
      roleApplied: roleResult,
      processingTime: Date.now() - startTime,
    })

    // Determinar status da resposta
    const success = guildResult && roleResult
    const statusCode = success ? 200 : 207 // 207 = Multi-Status (parcialmente bem-sucedido)

    console.log(`[DISCORD_ADD] Processo concluído em ${Date.now() - startTime}ms - Sucesso: ${success}`)

    return res.status(statusCode).json({
      success,
      addedToGuild: guildResult,
      roleApplied: roleResult,
      userId,
      processingTime: Date.now() - startTime,
      message: success
        ? "Usuário adicionado ao servidor e cargo aplicado com sucesso"
        : "Processo parcialmente concluído - verifique os detalhes",
      errors: [
        ...(addedToGuild.status === "rejected" ? [`Erro ao adicionar ao servidor: ${addedToGuild.reason}`] : []),
        ...(roleApplied.status === "rejected" ? [`Erro ao aplicar cargo: ${roleApplied.reason}`] : []),
      ],
    })
  } catch (error: any) {
    console.error("[DISCORD_ADD] Erro fatal no handler:", {
      message: error.message,
      stack: error.stack,
      userId,
      processingTime: Date.now() - startTime,
    })

    // Registrar erro no log
    if (userId) {
      await logActivity(userId, "discord_add", false, {
        error: error.message,
        processingTime: Date.now() - startTime,
      })
    }

    return res.status(500).json({
      error: "Erro interno no servidor",
      message: error.message,
      code: error.message.includes("Token")
        ? "INVALID_TOKEN"
        : error.message.includes("permissões")
          ? "INSUFFICIENT_PERMISSIONS"
          : error.message.includes("blacklist")
            ? "USER_BLOCKED"
            : error.message.includes("banco")
              ? "DATABASE_ERROR"
              : "INTERNAL_ERROR",
      processingTime: Date.now() - startTime,
    })
  }
}

export default withSession(handler)
