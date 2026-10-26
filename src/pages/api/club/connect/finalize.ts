import type { NextApiResponse } from "next"
import { type NextIronRequest, withSession } from "@/lib/session"
import { dbConnect } from "@/core/integration/connect"
import axios from "axios"
import { getRealIp } from "@/lib/session/IP/get-ip"

// Configurações de segurança
const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  MAX_FINALIZE_ATTEMPTS: 3,
  FINALIZE_COOLDOWN: 5 * 60 * 1000, // 5 minutos
  DISCORD_API_TIMEOUT: 10000, // 10 segundos
}

// Cache para controle de tentativas por IP
const finalizeAttempts = new Map<string, { count: number; lastAttempt: number }>()

// Validação de rate limiting
const validateRateLimit = (ipAddress: string) => {
  const now = Date.now()
  const attempts = finalizeAttempts.get(ipAddress)

  if (attempts) {
    // Resetar contador se passou do cooldown
    if (now - attempts.lastAttempt > SECURITY_CONFIG.FINALIZE_COOLDOWN) {
      finalizeAttempts.delete(ipAddress)
    } else if (attempts.count >= SECURITY_CONFIG.MAX_FINALIZE_ATTEMPTS) {
      throw new Error(
        `Muitas tentativas de finalização. Tente novamente em ${Math.ceil((SECURITY_CONFIG.FINALIZE_COOLDOWN - (now - attempts.lastAttempt)) / 60000)} minutos.`,
      )
    }
  }

  // Incrementar contador
  const currentAttempts = attempts ? attempts.count + 1 : 1
  finalizeAttempts.set(ipAddress, { count: currentAttempts, lastAttempt: now })
}

// Validação de método HTTP
const validateHttpMethod = (method: string) => {
  if (method !== "POST") {
    throw new Error("Método não permitido. Use POST.")
  }
}

// Validação de entrada
const validateInput = (body: any) => {
  if (!body || typeof body !== "object") {
    throw new Error("Corpo da requisição inválido.")
  }

  const { userId } = body

  if (!userId || typeof userId !== "string") {
    throw new Error("User ID é obrigatório no corpo da requisição.")
  }

  // Validar formato do Discord ID
  if (!/^\d{17,19}$/.test(userId)) {
    throw new Error("Formato de User ID inválido.")
  }

  return userId
}

// Validação de sessão OAuth
const validateOAuthSession = (oauthData: any) => {
  if (!oauthData) {
    throw new Error("Dados OAuth ausentes na sessão.")
  }

  if (!oauthData.access_token || !oauthData.discord_id) {
    throw new Error("Dados OAuth incompletos na sessão.")
  }

  // Verificar se a sessão não expirou
  const sessionAge = Date.now() - new Date(oauthData.created_at).getTime()
  if (sessionAge > SECURITY_CONFIG.SESSION_TIMEOUT) {
    throw new Error("Sessão OAuth expirada. Faça login novamente.")
  }

  return true
}

// Buscar dados do usuário no Discord com retry
const fetchDiscordUserData = async (accessToken: string, maxRetries = 3) => {
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[FINALIZE] Tentativa ${attempt}/${maxRetries} de buscar dados do usuário no Discord`)

      const response = await axios.get("https://discord.com/api/v10/users/@me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "ClubVision-Bot/1.0",
        },
        timeout: SECURITY_CONFIG.DISCORD_API_TIMEOUT,
      })

      console.log(`[FINALIZE] Dados do usuário obtidos com sucesso: ${response.data.username}`)
      return response.data
    } catch (error: any) {
      lastError = error
      console.error(`[FINALIZE] Tentativa ${attempt} falhou:`, {
        status: error.response?.status,
        message: error.message,
      })

      // Se é erro de token inválido, não tentar novamente
      if (error.response?.status === 401) {
        throw new Error("Token de acesso inválido ou expirado.")
      }

      // Aguardar antes da próxima tentativa (exceto na última)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    }
  }

  throw new Error(`Falha ao buscar dados do usuário após ${maxRetries} tentativas: ${lastError?.message}`)
}

// Buscar avatar do usuário no banco
const getUserAvatar = async (userId: string): Promise<string | undefined> => {
  try {
    const { db } = await dbConnect()
    const user = await db.collection("users").findOne({
      $or: [{ id: userId }, { discord_id: userId }],
    })

    return user?.avatar || undefined
  } catch (error) {
    console.error("[FINALIZE] Erro ao buscar avatar do usuário:", error)
    return undefined
  }
}

// Buscar dados completos do usuário no banco
const getUserFromDatabase = async (userId: string) => {
  try {
    const { db } = await dbConnect()
    const user = await db.collection("users").findOne({
      $or: [{ id: userId }, { discord_id: userId }],
    })

    if (!user) {
      throw new Error("Usuário não encontrado no banco de dados.")
    }

    if (user.trash || user.banned) {
      throw new Error("Usuário está na blacklist e não pode finalizar a autenticação.")
    }

    return user
  } catch (error) {
    console.error("[FINALIZE] Erro ao buscar usuário no banco:", error)
    throw error
  }
}

// Atualizar último login do usuário
const updateLastLogin = async (userId: string, ipAddress: string) => {
  try {
    const { db } = await dbConnect()
    await db.collection("users").updateOne(
      {
        $or: [{ id: userId }, { discord_id: userId }],
      },
      {
        $set: {
          lastLoginDate: new Date().toISOString(),
          lastLoginIp: ipAddress,
          authInProgress: false, // Limpar flag de autenticação em progresso
        },
      },
    )
    console.log(`[FINALIZE] Último login atualizado para usuário: ${userId}`)
  } catch (error) {
    console.error("[FINALIZE] Erro ao atualizar último login:", error)
    // Não falhar o processo principal por erro de log
  }
}

// Registrar atividade de finalização
const logFinalizationActivity = async (userId: string, success: boolean, ipAddress: string, details?: any) => {
  try {
    const { db } = await dbConnect()
    await db.collection("activity_logs").insertOne({
      userId,
      action: "authentication_finalized",
      success,
      ip: ipAddress,
      details,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("[FINALIZE] Erro ao registrar atividade:", error)
    // Não falhar o processo principal por erro de log
  }
}

const handler = async (req: NextIronRequest, res: NextApiResponse) => {
  const startTime = Date.now()
  let userId: string | undefined
  let ipAddress: string | undefined

  try {
    console.log("[FINALIZE] Iniciando finalização da autenticação")

    // Validações iniciais
    validateHttpMethod(req.method!)
    userId = validateInput(req.body)

    // Rate limiting por IP
    ipAddress = getRealIp(req)
    validateRateLimit(ipAddress)

    console.log(`[FINALIZE] Finalizando autenticação para usuário: ${userId}`)

    // Verificar se o usuário já está autenticado
    const existingUser = await req.session.get("user")
    if (existingUser && existingUser.discord_id === userId) {
      console.log(`[FINALIZE] Usuário já autenticado: ${userId}`)

      await logFinalizationActivity(userId, true, ipAddress, {
        alreadyAuthenticated: true,
        processingTime: Date.now() - startTime,
      })

      return res.status(200).json({
        success: true,
        message: "Usuário já autenticado.",
        alreadyProcessed: true,
        processingTime: Date.now() - startTime,
      })
    }

    // Validar sessão OAuth
    const oauthData = await req.session.get("oauth_temp")
    validateOAuthSession(oauthData)

    // Verificar se o userId corresponde ao da sessão
    if (oauthData.discord_id !== userId) {
      throw new Error("User ID não corresponde aos dados da sessão OAuth.")
    }

    // Buscar dados atualizados do usuário no Discord
    const discordUserData = await fetchDiscordUserData(oauthData.access_token)

    // Buscar dados do usuário no banco
    const dbUserData = await getUserFromDatabase(userId)

    // Buscar avatar do usuário
    const userAvatar = await getUserAvatar(userId)

    // Configurar sessão do usuário
    const userSessionData = {
      ...discordUserData,
      avatar: userAvatar,
      discordavatar: discordUserData.avatar
        ? `https://cdn.discordapp.com/avatars/${userId}/${discordUserData.avatar}.png`
        : null,
      id: dbUserData.id, // VID do banco
      discord_id: userId, // Discord ID
      email: dbUserData.email,
      name: dbUserData.name,
      discriminator: dbUserData.discriminator,
      authenticated_at: new Date().toISOString(),
      session_id: crypto.randomUUID(),
    }

    // Salvar sessão do usuário
    await req.session.set("user", userSessionData)

    // Limpar dados temporários da sessão
    await req.session.unset("oauth_temp")
    await req.session.unset("user_processed")

    // Salvar sessão
    await req.session.save()

    // Atualizar último login no banco
    await updateLastLogin(userId, ipAddress)

    // Registrar atividade de sucesso
    await logFinalizationActivity(userId, true, ipAddress, {
      sessionId: userSessionData.session_id,
      processingTime: Date.now() - startTime,
    })

    console.log(`[FINALIZE] Autenticação finalizada com sucesso para usuário: ${userId} em ${Date.now() - startTime}ms`)

    return res.status(200).json({
      success: true,
      message: "Autenticação finalizada com sucesso.",
      user: {
        id: userSessionData.id,
        discord_id: userSessionData.discord_id,
        username: userSessionData.username,
        avatar: userSessionData.avatar,
      },
      processingTime: Date.now() - startTime,
    })
  } catch (error: any) {
    console.error("[FINALIZE] Erro ao finalizar autenticação:", {
      message: error.message,
      stack: error.stack,
      userId,
      processingTime: Date.now() - startTime,
    })

    // Limpar sessão em caso de erro
    try {
      await req.session.unset("oauth_temp")
      await req.session.unset("user_processed")
      await req.session.unset("user")
      await req.session.save()
    } catch (sessionError) {
      console.error("[FINALIZE] Erro ao limpar sessão:", sessionError)
    }

    // Registrar atividade de erro
    if (userId && ipAddress) {
      await logFinalizationActivity(userId, false, ipAddress, {
        error: error.message,
        processingTime: Date.now() - startTime,
      })
    }

    // Determinar código de erro apropriado
    const errorCode =
      error.message.includes("rate limit") || error.message.includes("tentativas")
        ? 429
        : error.message.includes("Token") || error.message.includes("OAuth")
          ? 401
          : error.message.includes("Método")
            ? 405
            : error.message.includes("User ID") || error.message.includes("Formato")
              ? 400
              : 500

    return res.status(errorCode).json({
      error: "Erro ao finalizar autenticação",
      message: error.message,
      code: error.message.includes("rate limit")
        ? "RATE_LIMITED"
        : error.message.includes("Token")
          ? "INVALID_TOKEN"
          : error.message.includes("OAuth")
            ? "SESSION_INVALID"
            : error.message.includes("Método")
              ? "METHOD_NOT_ALLOWED"
              : error.message.includes("blacklist")
                ? "USER_BLOCKED"
                : error.message.includes("User ID")
                  ? "INVALID_INPUT"
                  : "INTERNAL_ERROR",
      processingTime: Date.now() - startTime,
    })
  }
}

export default withSession(handler)
