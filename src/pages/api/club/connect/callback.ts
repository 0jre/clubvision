import type { NextApiResponse } from "next"
import { stringify } from "querystring"
import { type NextIronRequest, withSession } from "@/lib/session"
import axios from "axios"
import ROUTENVX from "@/routes/routes"
import { encodeUserId } from "@/lib/session/encode"
import { dbConnect } from "@/core/integration/connect"

// OAuth scope definition com validação rigorosa
const REQUIRED_OAUTH_SCOPES = ["identify", "guilds", "email", "guilds.join"]
const OAuthScope = REQUIRED_OAUTH_SCOPES.join(" ")

// Sistema de rate limiting próprio
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutos
const RATE_LIMIT_MAX = 2 // máximo 2 tentativas

// Função para obter IP real da requisição
const getRealClientIP = (req: NextIronRequest): string => {
  // Verificar headers de proxy em ordem de prioridade
  const forwarded = req.headers["x-forwarded-for"]
  const realIP = req.headers["x-real-ip"]
  const cfConnectingIP = req.headers["cf-connecting-ip"]

  if (typeof forwarded === "string") {
    // x-forwarded-for pode conter múltiplos IPs separados por vírgula
    return forwarded.split(",")[0].trim()
  }

  if (typeof realIP === "string") {
    return realIP.trim()
  }

  if (typeof cfConnectingIP === "string") {
    return cfConnectingIP.trim()
  }

  // Fallback para connection.remoteAddress ou socket
  const connectionIP =
    (req as any).connection?.remoteAddress || (req as any).socket?.remoteAddress || (req as any).ip || "127.0.0.1"

  return connectionIP
}

// Rate limiting personalizado
const checkRateLimit = (ipAddress: string): void => {
  const now = Date.now()
  const clientData = rateLimitMap.get(ipAddress)

  if (!clientData) {
    rateLimitMap.set(ipAddress, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return
  }

  // Reset se o tempo passou
  if (now > clientData.resetTime) {
    rateLimitMap.set(ipAddress, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return
  }

  // Verificar se excedeu o limite
  if (clientData.count >= RATE_LIMIT_MAX) {
    const remainingTime = Math.ceil((clientData.resetTime - now) / 60000)
    throw new Error(`Muitas tentativas de autenticação. Tente novamente em ${remainingTime} minutos.`)
  }

  // Incrementar contador
  clientData.count++
}

// Validação de ambiente
const validateEnvironment = () => {
  const requiredEnvVars = ["CLIENT_ID", "CLIENT_SECRET", "DOMAIN"]
  const missing = requiredEnvVars.filter((env) => !process.env[env])

  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente obrigatórias não encontradas: ${missing.join(", ")}`)
  }
}

// Validação de entrada
const validateRequest = (req: NextIronRequest) => {
  if (!req.query.code || typeof req.query.code !== "string") {
    throw new Error("Código de autorização inválido ou ausente")
  }

  if (req.query.error) {
    const errorDescription = req.query.error_description || req.query.error
    throw new Error(`Erro de autorização Discord: ${errorDescription}`)
  }
}

// Validação de escopos OAuth
const validateOAuthScopes = (receivedScopes: string[]) => {
  const missingScopes = REQUIRED_OAUTH_SCOPES.filter((scope) => !receivedScopes.includes(scope))

  if (missingScopes.length > 0) {
    throw new Error(`Escopos OAuth obrigatórios ausentes: ${missingScopes.join(", ")}`)
  }
}

// Validação de dados do usuário Discord
const validateDiscordUser = (user: any) => {
  if (!user.id || !user.username) {
    throw new Error("Dados do usuário Discord incompletos")
  }

  // Email pode ser null em alguns casos, mas vamos verificar se está verificado
  if (user.email === null) {
    throw new Error("Por favor, verifique o email da sua conta Discord antes de fazer login.")
  }

  if (!user.verified) {
    throw new Error("Email do Discord não verificado. Verifique seu email no Discord antes de continuar.")
  }
}

// Verificação anti-duplicação
const checkExistingUser = async (discordId: string) => {
  try {
    const { db } = await dbConnect()
    const existingUser = await db.collection("users").findOne({ discord_id: discordId })

    if (existingUser) {
      // Verificar se a conta está na blacklist
      if (existingUser.trash || existingUser.banned) {
        throw new Error("Esta conta está na blacklist e não pode acessar o ClubVision.")
      }

      // Verificar se já está em processo de autenticação
      if (existingUser.authInProgress) {
        throw new Error("Processo de autenticação já em andamento para esta conta.")
      }

      return existingUser
    }

    return null
  } catch (error) {
    console.error("Erro ao verificar usuário existente:", error)
    throw error
  }
}

// Sanitização de dados
const sanitizeUserData = (user: any) => {
  return {
    id: String(user.id).trim(),
    email: user.email ? String(user.email).toLowerCase().trim() : null,
    username: String(user.username).trim(),
    avatar: user.avatar ? String(user.avatar).trim() : null,
    locale: user.locale ? String(user.locale).trim() : "pt-BR",
    verified: Boolean(user.verified),
  }
}

const handler = async (req: NextIronRequest, res: NextApiResponse) => {
  let ipAddress: string | undefined

  try {
    console.log(`[AUTH] Iniciando processo de autenticação`)

    // Obter IP e aplicar rate limiting
    ipAddress = getRealClientIP(req)
    console.log(`[AUTH] IP detectado: ${ipAddress}`)

    checkRateLimit(ipAddress)

    // Validações iniciais
    validateEnvironment()
    validateRequest(req)

    console.log(`[AUTH] Processando código OAuth: ${req.query.code}`)

    // Preparar dados para requisição OAuth
    const tokenRequestData = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: `${process.env.DOMAIN}/api/club/connect/callback`,
    }

    console.log(`[AUTH] Enviando requisição OAuth para Discord...`)

    // Stage 1: Obter token OAuth do Discord
    const tokenResponse = await axios.post("https://discord.com/api/v10/oauth2/token", stringify(tokenRequestData), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "ClubVision-Bot/1.0",
      },
      timeout: 15000, // 15 segundos timeout
      validateStatus: (status) => status < 500, // Não lançar erro para status 4xx
    })

    // Verificar resposta da requisição OAuth
    if (tokenResponse.status !== 200) {
      console.error(`[AUTH] Erro na requisição OAuth:`, {
        status: tokenResponse.status,
        data: tokenResponse.data,
        headers: tokenResponse.headers,
      })

      throw new Error(`Erro na autenticação Discord (${tokenResponse.status}): ${JSON.stringify(tokenResponse.data)}`)
    }

    const tokenData = tokenResponse.data

    // Validar token response
    if (!tokenData.access_token || !tokenData.scope) {
      console.error(`[AUTH] Resposta OAuth inválida:`, tokenData)
      throw new Error("Resposta de token OAuth inválida")
    }

    // Validar escopos recebidos
    const receivedScopes = tokenData.scope.split(" ")
    validateOAuthScopes(receivedScopes)

    console.log(`[AUTH] Token OAuth obtido com sucesso. Escopos: ${receivedScopes.join(", ")}`)

    // Stage 2: Obter dados do usuário
    const userResponse = await axios.get("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": "ClubVision-Bot/1.0",
      },
      timeout: 15000,
      validateStatus: (status) => status < 500,
    })

    if (userResponse.status !== 200) {
      console.error(`[AUTH] Erro ao buscar dados do usuário:`, {
        status: userResponse.status,
        data: userResponse.data,
      })
      throw new Error(`Erro ao buscar dados do usuário Discord (${userResponse.status})`)
    }

    const rawUserData = userResponse.data
    validateDiscordUser(rawUserData)

    const userData = sanitizeUserData(rawUserData)
    console.log(`[AUTH] Dados do usuário obtidos: ${userData.username} (${userData.id})`)

    // Stage 3: Verificação anti-duplicação
    const existingUser = await checkExistingUser(userData.id)

    // Preparar dados da sessão
    const sessionData = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || null,
      discord_id: userData.id,
      user_email: userData.email,
      user_avatar: userData.avatar,
      user_locale: userData.locale,
      username: userData.username,
      existing_user: !!existingUser,
      allow_auth_page_access: true,
      created_at: new Date().toISOString(),
      ip_address: ipAddress,
    }

    if (existingUser) {
      console.log(`[AUTH] Usuário existente encontrado: ${userData.id}`)
    } else {
      console.log(`[AUTH] Novo usuário detectado: ${userData.id}`)
    }

    // Verificar se a sessão já existe e é válida
    if (!req.session) {
      throw new Error("Sessão não inicializada")
    }

    await req.session.set("oauth_temp", sessionData)
    await req.session.save()

    console.log(`[AUTH] Sessão salva com sucesso. Redirecionando...`)

    // Redirecionar para a página de autenticação
    const redirectUrl = `/club/auth?visionId=${encodeUserId(userData.id)}`
    console.log(`[AUTH] Redirecionando para: ${redirectUrl}`)

    res.redirect(redirectUrl)
  } catch (error: any) {
    console.error("[AUTH] Erro durante o processo de autenticação:", {
      message: error.message,
      stack: error.stack,
      code: req.query.code ? "present" : "missing",
      timestamp: new Date().toISOString(),
      ip: ipAddress,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          }
        : undefined,
    })

    // Limpar sessão em caso de erro
    try {
      if (req.session) {
        await req.session.destroy()
      }
    } catch (sessionError) {
      console.error("[AUTH] Erro ao limpar sessão:", sessionError)
    }

    // Determinar tipo de erro e redirecionar apropriadamente
    let errorType = "authentication_failed"

    if (error.message.includes("blacklist") || error.message.includes("banida")) {
      errorType = "account_blocked"
    } else if (error.message.includes("email") || error.message.includes("verificado")) {
      errorType = "email_not_verified"
    } else if (error.message.includes("escopos") || error.message.includes("OAuth")) {
      errorType = "insufficient_permissions"
    } else if (error.message.includes("rate limit") || error.message.includes("tentativas")) {
      errorType = "rate_limited"
    } else if (error.response?.status === 400) {
      errorType = "invalid_request"
    } else if (error.response?.status === 401) {
      errorType = "unauthorized"
    }

    const redirectUrl = `${ROUTENVX.signin}?error=${errorType}&details=${encodeURIComponent(error.message)}`
    console.log(`[AUTH] Redirecionando para erro: ${redirectUrl}`)

    res.redirect(redirectUrl)
  }
}

export default withSession(handler)
