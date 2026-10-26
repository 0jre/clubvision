import type { NextApiResponse } from "next"
import { type NextIronRequest, withSession } from "@/lib/session"
import { dbConnect } from "@/core/integration/connect"
import moment from "moment-timezone"
import crypto from "crypto"
import type { Db } from "mongodb"
import { generateUserProof } from "@/lib/keys/generate.key"
import { getRealClientIP, checkRateLimit } from "@/lib/session/IP/ip-helper"
import { defaultSettings } from "@/hooks/settings"

// Lista de avatares disponíveis com validação
const AVATAR_LIST = [
  "https://i.imgur.com/HO8Mhc0.jpg",
  "https://i.imgur.com/JVa4vQu.jpg",
  "https://i.imgur.com/5Ga56pD.jpg",
  "https://i.imgur.com/Yn5htE4.jpg",
  "https://i.imgur.com/wEk9gJb.jpg",
  "https://i.imgur.com/kGxIHO3.jpg",
  "https://i.imgur.com/kYxafCe.jpg",
  "https://i.imgur.com/1jixw7u.png",
  "https://i.imgur.com/yrfDSXP.png",
  "https://i.imgur.com/imbyqwS.png",
  "https://i.imgur.com/bEwdfwz.png",
  "https://i.imgur.com/mXit4fI.jpg",
]

// Configurações de segurança
const SECURITY_CONFIG = {
  ALLOWED_COUNTRIES: ["BR", "PT"],
  MAX_GENERATION_ATTEMPTS: 10,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  ADMIN_DISCORD_ID: "701975084239159328",
}

// Cache para controlar processamento simultâneo por Discord ID
const processingCache = new Map<string, { timestamp: number; promise: Promise<any> }>()

// Função para obter dados de geolocalização (mock para desenvolvimento)
const getGeoData = async (ipAddress: string) => {
  // Para desenvolvimento local, retornar dados padrão
  if (ipAddress === "127.0.0.1" || ipAddress === "::1") {
    return {
      ip: ipAddress,
      country: "Brasil",
      country_code: "BR",
      city: "São Paulo",
    }
  }

  try {
    // Aqui você pode integrar com um serviço de geolocalização real
    // Por enquanto, retornando dados padrão para Brasil
    return {
      ip: ipAddress,
      country: "Brasil",
      country_code: "BR",
      city: "São Paulo",
    }
  } catch (error) {
    console.error("Erro ao obter dados de geolocalização:", error)
    // Fallback para Brasil em caso de erro
    return {
      ip: ipAddress,
      country: "Brasil",
      country_code: "BR",
      city: "Desconhecida",
    }
  }
}

// Validação de sessão OAuth
const validateOAuthSession = (oauthData: any) => {
  if (!oauthData) {
    throw new Error("Assinatura de autenticação não encontrada. Inicie o processo de login novamente.")
  }

  if (!oauthData.discord_id || !oauthData.access_token) {
    throw new Error("Dados de autenticação incompletos na sessão.")
  }

  // Verificar se a sessão não expirou
  const sessionAge = Date.now() - new Date(oauthData.created_at).getTime()
  if (sessionAge > SECURITY_CONFIG.SESSION_TIMEOUT) {
    throw new Error("Sessão de autenticação expirada. Faça login novamente.")
  }

  return true
}

// Validação de geolocalização
const validateGeolocation = async (req: NextIronRequest) => {
  const ipAddress = getRealClientIP(req)
  const geoData = await getGeoData(ipAddress)

  // Permitir localhost para desenvolvimento
  if (ipAddress === "::1" || ipAddress === "127.0.0.1") {
    return { ...geoData, ip: ipAddress, allowed: true }
  }

  const isAllowed = SECURITY_CONFIG.ALLOWED_COUNTRIES.includes(geoData.country_code)

  if (!isAllowed) {
    throw new Error(`Acesso negado. Localização não permitida: ${geoData.country} (${geoData.country_code})`)
  }

  return { ...geoData, ip: ipAddress, allowed: true }
}

// Geração segura de endereço único
const generateUniqueClubAddress = async (db: Db): Promise<string> => {
  let attempts = 0

  while (attempts < SECURITY_CONFIG.MAX_GENERATION_ATTEMPTS) {
    const hash = `0ツ${crypto.randomBytes(20).toString("hex")}`

    const existingHash = await db.collection("users").findOne({ discriminator: hash })
    if (!existingHash) {
      return hash
    }

    attempts++
  }

  throw new Error("Não foi possível gerar um endereço único após várias tentativas.")
}

// Geração segura de nome único
const generateUniqueUsername = async (db: Db): Promise<string> => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let attempts = 0

  while (attempts < SECURITY_CONFIG.MAX_GENERATION_ATTEMPTS) {
    const randomString = Array.from({ length: 7 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join(
      "",
    )

    const username = `${randomString}.clubvision`

    const existingUser = await db.collection("users").findOne({ name: username })
    if (!existingUser) {
      return username
    }

    attempts++
  }

  throw new Error("Não foi possível gerar um nome de usuário único após várias tentativas.")
}

// Seleção segura de avatar
const getSecureRandomAvatar = (): string => {
  const randomIndex = crypto.randomInt(0, AVATAR_LIST.length)
  return AVATAR_LIST[randomIndex]
}

// FUNÇÃO PRINCIPAL ANTI-DUPLICAÇÃO COM UPSERT ATÔMICO
const processUserAtomically = async (db: Db, userData: any, geoData: any) => {
  const discordId = userData.discordId

  console.log(`[PROCESSING] Iniciando processamento atômico para Discord ID: ${discordId}`)

  // Usar findOneAndUpdate com upsert para operação atômica
  const filter = { discord_id: discordId }

  // Primeiro, tentar encontrar o usuário existente
  const existingUser = await db.collection("users").findOne(filter)

  if (existingUser) {
    console.log(`[PROCESSING] Usuário existente encontrado: ${discordId}`)

    // Verificar status da conta
    if (existingUser.trash || existingUser.banned) {
      throw new Error("Esta conta está na blacklist e não pode ser processada.")
    }

    // Atualizar usuário existente
    const adminFields = discordId === SECURITY_CONFIG.ADMIN_DISCORD_ID ? { type: "ADMIN", manager: true } : {}

    const updateData: any = {
      $set: {
       lastLoginDate: moment().toISOString(),
        username: userData.username, // Atualizar username se mudou
        email: userData.email, // Atualizar email se mudou
        codeVerified: existingUser.authorizationCode == true ? true : false,
        ip: {
          address: geoData.ip,
          country: geoData.country,
          city: geoData.city,
          country_code: geoData.country_code,
        },
        security: {
          ...existingUser.security,
          lastIpCheck: new Date().toISOString,
          authAttempts: 0,
        },
        authInProgress: false,
        lastLoginIp: geoData.ip,
        ...adminFields,
      },
    }
 

    const result = await db.collection("users").findOneAndUpdate(filter, updateData, {
      returnDocument: "after",
    })

    console.log(`[PROCESSING] Usuário existente atualizado com sucesso: ${existingUser.id}`)
    return { success: true, userId: existingUser.id, isNew: false, user: result.value }
  } else {
    console.log(`[PROCESSING] Criando novo usuário: ${discordId}`)

    // Gerar dados para novo usuário
    const { visionuserId, signature, visionid } = generateUserProof(discordId, userData.locale)
    const adminFields = discordId === SECURITY_CONFIG.ADMIN_DISCORD_ID ? { type: "ADMIN", manager: true } : {}

    const newUser = {
      _id: visionuserId as any,
      id: visionuserId,
      discord_id: discordId,
      discriminator: await generateUniqueClubAddress(db),
      avatar: getSecureRandomAvatar(),
      email: userData.email,
      name: await generateUniqueUsername(db),
      username: userData.username,
      codeVerified: true,
      accepted: true,
      following: [],
      followers: [],
      quality: {
        reputation: "desconhecido",
        statsaccount: "otima",
        statswallet: "desconhecido",
      },
    firstLoginDate: moment().toISOString(),
    lastLoginDate: moment().toISOString(),
      ip: {
        address: geoData.ip,
        country: geoData.country,
        city: geoData.city,
        country_code: geoData.country_code,
      },
      vision: {
        signature,
        visionid,
      },
      security: {
        createdAt: new Date().toISOString,
        lastIpCheck: new Date().toISOString,
        authAttempts: 0,
      },
      settings: defaultSettings ,
      authInProgress: false,
      lastLoginIp: geoData.ip,
      ...adminFields,
    }

    try {
      // Usar insertOne com verificação prévia
      const insertResult = await db.collection("users").insertOne(newUser)

      if (insertResult.acknowledged) {
        console.log(`[PROCESSING] Novo usuário criado com sucesso: ${visionuserId}`)
        return { success: true, userId: visionuserId, isNew: true, user: newUser }
      } else {
        throw new Error("Falha ao inserir usuário no banco de dados")
      }
    } catch (error: any) {
      if (error.code === 11000) {
        // Erro de duplicação - tentar buscar o usuário existente
        console.log(`[PROCESSING] Erro de duplicação detectado, buscando usuário existente: ${discordId}`)

        const existingAfterError = await db.collection("users").findOne(filter)
        if (existingAfterError) {
          console.log(`[PROCESSING] Usuário encontrado após erro de duplicação: ${existingAfterError.id}`)
          return { success: true, userId: existingAfterError.id, isNew: false, user: existingAfterError }
        }
      }
      throw error
    }
  }
}

// Função para controlar processamento simultâneo
const getOrCreateProcessingPromise = (discordId: string, processingFunction: () => Promise<any>) => {
  const now = Date.now()
  const existing = processingCache.get(discordId)

  // Se existe um processamento em andamento e não expirou (5 minutos)
  if (existing && now - existing.timestamp < 5 * 60 * 1000) {
    console.log(`[PROCESSING] Reutilizando processamento em andamento para: ${discordId}`)
    return existing.promise
  }

  // Criar novo processamento
  console.log(`[PROCESSING] Iniciando novo processamento para: ${discordId}`)
  const promise = processingFunction().finally(() => {
    // Remover do cache após conclusão
    processingCache.delete(discordId)
  })

  processingCache.set(discordId, { timestamp: now, promise })
  return promise
}

// Limpeza periódica do cache
setInterval(
  () => {
    const now = Date.now()
    for (const [key, value] of processingCache.entries()) {
      if (now - value.timestamp > 10 * 60 * 1000) {
        // 10 minutos
        processingCache.delete(key)
      }
    }
  },
  5 * 60 * 1000,
) // Limpar a cada 5 minutos

const handler = async (req: NextIronRequest, res: NextApiResponse) => {
  try {
    console.log("[PROCESSING] Iniciando processamento do usuário")

    // Rate limiting
    const ipAddress = getRealClientIP(req)
    checkRateLimit(ipAddress, 3, 10 * 60 * 1000) // 3 tentativas por 10 minutos

    // Validar sessão OAuth
    const oauthData = await req.session.get("oauth_temp")
    validateOAuthSession(oauthData)

    // Validar geolocalização
    const geoData = await validateGeolocation(req)
    console.log(`[PROCESSING] Geolocalização validada: ${geoData.country} (${geoData.ip})`)

    // Obter ID do Discord
    const discordId = oauthData.discord_id || req.query.userId
    if (!discordId) {
      throw new Error("ID do Discord não encontrado na sessão ou query.")
    }

    console.log(`[PROCESSING] Processando usuário Discord: ${discordId}`)

    // Conectar ao banco de dados
    const { db } = await dbConnect()

    // Processar usuário com controle de concorrência
    const result = await getOrCreateProcessingPromise(discordId, async () => {
      return await processUserAtomically(
        db,
        {
          discordId,
          email: oauthData.user_email,
          username: oauthData.username,
          locale: oauthData.user_locale,
        },
        geoData,
      )
    })

    // Armazenar dados processados na sessão
    await req.session.set("user_processed", {
      userId: result.userId, // VID
      discordId,
      accessToken: oauthData.access_token,
      avatar: oauthData.user_avatar,
      isNewUser: result.isNew,
      processedAt: new Date().toISOString(),
    })

    await req.session.save()

    console.log(`[PROCESSING] Processamento concluído com sucesso para usuário: ${result.userId}`)

    res.status(200).json({
      success: true,
      userId: result.userId,
      isNewUser: result.isNew,
      message: result.isNew ? "Novo usuário criado com sucesso" : "Usuário existente atualizado",
      user: {
        id: result.user.id,
        discord_id: result.user.discord_id,
        username: result.user.username,
        email: result.user.email,
      },
    })
  } catch (error: any) {
    console.error("[PROCESSING] Erro no processamento do usuário:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })

    // Limpar dados temporários em caso de erro
    try {
      if (req.session) {
        await req.session.unset("oauth_temp")
        await req.session.unset("user_processed")
        await req.session.save()
      }
    } catch (sessionError) {
      console.error("[PROCESSING] Erro ao limpar sessão:", sessionError)
    }

    res.status(500).json({
      error: "Erro durante o processamento do usuário",
      message: error.message,
      code: error.message.includes("blacklist")
        ? "ACCOUNT_BLOCKED"
        : error.message.includes("duplicado") || error.message.includes("já existe")
          ? "DUPLICATE_USER"
          : error.message.includes("Localização")
            ? "LOCATION_BLOCKED"
            : error.message.includes("Rate limit")
              ? "RATE_LIMITED"
              : "PROCESSING_ERROR",
    })
  }
}

export default withSession(handler)
