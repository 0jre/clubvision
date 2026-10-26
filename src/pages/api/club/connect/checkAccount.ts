import type { NextApiResponse } from "next"
import { type NextIronRequest, withSession } from "@/lib/session"
import { dbConnect } from "@/core/integration/connect"
import { getRealClientIP, checkRateLimit } from "@/lib/session/IP/ip-helper"

// Validação de sessão OAuth
const validateOAuthSession = (oauthData: any) => {
  if (!oauthData) {
    throw new Error("Assinatura de autenticação não encontrada. Inicie o processo de login novamente.")
  }

  if (!oauthData.allow_auth_page_access) {
    throw new Error("Acesso não autorizado à verificação de conta.")
  }

  // Verificar se a sessão não expirou (30 minutos)
  const sessionAge = Date.now() - new Date(oauthData.created_at).getTime()
  if (sessionAge > 30 * 60 * 1000) {
    throw new Error("Sessão de autenticação expirada. Faça login novamente.")
  }

  return true
}

// Validação de entrada
const validateInput = (req: NextIronRequest) => {
  const discordId = req.query.userId

  if (!discordId || typeof discordId !== "string") {
    throw new Error("ID do usuário Discord inválido ou ausente.")
  }

  // Validar formato do Discord ID (deve ser numérico e ter 17-19 dígitos)
  if (!/^\d{17,19}$/.test(discordId)) {
    throw new Error("Formato de ID Discord inválido.")
  }

  return discordId
}

// Verificação completa da conta COM VERIFICAÇÃO RIGOROSA ANTI-DUPLICAÇÃO
const performAccountCheck = async (discordId: string) => {
  try {
    const { db } = await dbConnect()

    // BUSCA RIGOROSA: Buscar TODOS os registros com o mesmo discord_id
    const userRecords = await db.collection("users").find({ discord_id: discordId }).toArray()
  
    if (userRecords.length === 0) {
      console.log(`[CHECK] Nenhum usuário encontrado para Discord ID: ${discordId} - Nova conta será criada`)
      return { exists: false, status: "not_found" }
    }

    if (userRecords.length > 1) {
      console.error(
        `[CHECK] DUPLICAÇÃO DETECTADA! Encontrados ${userRecords.length} registros para Discord ID: ${discordId}`,
      )

      // Log detalhado dos registros duplicados
      userRecords.forEach((record, index) => {
        console.error(`[CHECK] Registro ${index + 1}:`, {
          _id: record._id,
          id: record.id,
          discord_id: record.discord_id,
          email: record.email,
          username: record.username,
          firstLoginDate: record.firstLoginDate,
          lastLoginDate: record.lastLoginDate,
        })
      })

      // Retornar erro específico para duplicação
      return {
        exists: true,
        status: "duplicate_detected",
        message: `Detectados ${userRecords.length} registros duplicados para esta conta. Entre em contato com o suporte.`,
        duplicateCount: userRecords.length,
      }
    }

    // Apenas um registro encontrado - prosseguir normalmente
    const userRecord = userRecords[0]
    console.log(`[CHECK] Usuário único encontrado: ${discordId}`)

    // Verificar se a conta está na blacklist
    if (userRecord.trash) {
      console.log(`[CHECK] Conta na blacklist (trash): ${discordId}`)
      return {
        exists: true,
        status: "blacklisted",
        reason: "trash",
        message: "Esta conta está na blacklist e não pode acessar o ClubVision.",
      }
    }

    // Verificar se a conta está banida
    if (userRecord.banned) {
      console.log(`[CHECK] Conta banida: ${discordId}`)
      return {
        exists: true,
        status: "banned",
        reason: "banned",
        message: "Esta conta foi banida e não pode acessar o ClubVision.",
      }
    }

    // Verificar se a conta está suspensa
    if (userRecord.suspended) {
      console.log(`[CHECK] Conta suspensa: ${discordId}`)
      return {
        exists: true,
        status: "suspended",
        reason: "suspended",
        message: "Esta conta está temporariamente suspensa.",
      }
    }

    // Verificar se há processo de autenticação em andamento
    if (userRecord.authInProgress) {
      console.log(`[CHECK] Autenticação em andamento: ${discordId}`)
      return {
        exists: true,
        status: "auth_in_progress",
        message: "Processo de autenticação já em andamento para esta conta.",
      }
    }

    // Conta válida
    console.log(`[CHECK] Conta válida confirmada: ${discordId}`)
    return {
      exists: true,
      status: "valid",
      user: {
        id: userRecord.id,
        discord_id: userRecord.discord_id,
        username: userRecord.username || userRecord.name,
        email: userRecord.email,
        avatar: userRecord.avatar,
      },
    }
  } catch (error) {
    console.error("[CHECK] Erro ao verificar conta no banco:", error)
    throw new Error("Erro interno ao verificar status da conta.")
  }
}

const handler = async (req: NextIronRequest, res: NextApiResponse) => {
  try {
    console.log("[CHECK] Iniciando verificação de conta")

    // Rate limiting
    const ipAddress = getRealClientIP(req)
    checkRateLimit(ipAddress, 2, 5 * 60 * 1000) // 2 tentativas por 5 minutos

    // Validar sessão OAuth
    const oauthData = await req.session.get("oauth_temp")
    validateOAuthSession(oauthData)
 
    // Validar entrada
    const discordId = validateInput(req)

    console.log(`[CHECK] Verificando conta para Discord ID: ${discordId}`)

    // Realizar verificação da conta
    const accountCheck = await performAccountCheck(discordId)

    // Processar resultado da verificação
    switch (accountCheck.status) {
      case "duplicate_detected":
        console.error(`[CHECK] Duplicação detectada para: ${discordId}`)
        return res.status(409).json({
          error: "duplicate_account",
          message: accountCheck.message,
          duplicateCount: accountCheck.duplicateCount,
        })

      case "blacklisted":
      case "banned":
        return res.status(410).json({
          error: accountCheck.status,
          message: accountCheck.message,
          reason: accountCheck.reason,
        })

      case "suspended":
        return res.status(423).json({
          error: "account_suspended",
          message: accountCheck.message,
        })

      case "auth_in_progress":
        return res.status(409).json({
          error: "auth_in_progress",
          message: accountCheck.message,
        })

      case "not_found":
        console.log(`[CHECK] Nova conta será criada: ${discordId}`)
        return res.status(200).json({
          success: true,
          status: "new_account",
          message: "Nova conta será criada no sistema.",
        })

      case "valid":
        console.log(`[CHECK] Conta válida confirmada: ${discordId}`)
        return res.status(200).json({
          success: true,
          status: "existing_account",
          message: "Conta existente válida.",
          user: accountCheck.user,
        })

      default:
        throw new Error("Status de verificação desconhecido.")
    }
  } catch (error: any) {
    console.error("[CHECK] Erro na verificação de conta:", {
      message: error.message,
      stack: error.stack, 
      timestamp: new Date().toISOString(),
    })
 
    // Determinar código de erro apropriado
    const errorCode =
      error.message.includes("Rate limit") || error.message.includes("tentativas")
        ? 429
        : error.message.includes("sessão") || error.message.includes("autenticação")
          ? 401
          : error.message.includes("ID Discord")
            ? 400
            : 500

    res.status(errorCode).json({
      error: "account_check_failed",
      message: error.message,
      code: error.message.includes("Rate limit")
        ? "RATE_LIMITED"
        : error.message.includes("sessão")
          ? "SESSION_INVALID"
          : error.message.includes("ID Discord")
            ? "INVALID_INPUT"
            : "INTERNAL_ERROR",
    })
  }
}

export default withSession(handler)
