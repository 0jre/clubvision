import type { NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronRequest } from "@/lib/session"
import type { WithId, Document } from "mongodb"

interface UserDocument extends Document {
  _id?: any
  id: string
  discord_id: string
  username?: string
  name?: string
  email: string
  discriminator: string
  avatar: string
  firstLoginDate: string
  lastLoginDate: string
  lastLoginIp: string
  ip: {
    address: string
    country: string
    city: string
    country_code: string
  }
  vision: {
    signature: string
    visionid: string
  }
  security: {
    createdAt: string
    lastIpCheck: string
    authAttempts: number
  }
  quality: {
    reputation: string
    statsaccount: string
    statswallet: string
  }
  settings: any
  type?: string
  manager?: boolean
  codeVerified: boolean
  accepted: boolean
  following: string[]
  followers: string[]
  trash?: boolean
  banned?: boolean
  suspended?: boolean
  authInProgress?: boolean
}

interface ActivityLogDocument extends Document {
  _id: any
  userId: string
  action: string
  success: boolean
  ip: string
  details?: any
  timestamp: Date
}

interface CompleteLogsResponse {
  success: boolean
  user: {
    id: string
    discord_id: string
    username: string
    email: string
    discriminator: string
    avatar: string
    firstLoginDate: string
    lastLoginDate: string
    lastLoginIp: string
    ip: {
      address: string
      country: string
      city: string
      country_code: string
    }
    vision: {
      signature: string
      visionid: string
    }
    security: {
      createdAt: string
      lastIpCheck: string
      authAttempts: number
    }
    quality: {
      reputation: string
      statsaccount: string
      statswallet: string
    }
    settings: any
    type?: string
    manager?: boolean
    codeVerified: boolean
    accepted: boolean
    following: string[]
    followers: string[]
    trash?: boolean
    banned?: boolean
    suspended?: boolean
    authInProgress?: boolean
  }
  activityLogs: Array<{
    _id: string
    userId: string
    action: string
    success: boolean
    ip: string
    details?: any
    timestamp: Date
  }>
  sessionHistory: Array<{
    sessionId: string
    createdAt: string
    ip: string
    userAgent?: string
    active: boolean
  }>
  ipHistory: Array<{
    ip: string
    country: string
    city: string
    country_code: string
    firstSeen: Date
    lastSeen: Date
    loginCount: number
  }>
  oauthSessions: Array<{
    access_token: string
    refresh_token?: string
    created_at: string
    expires_at?: string
    scope: string
    ip_address: string
  }>
}

const handler = async (req: NextIronRequest, res: NextApiResponse<CompleteLogsResponse | { error: string }>) => {
  try {
    const userSession = await req.session.get("user")
    if (!userSession) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }

    const { db } = await dbConnect()

    const userDoc = (await db.collection("users").findOne({
      discord_id: userSession.discord_id,
    })) as WithId<UserDocument> | null

    if (!userDoc) {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }

    const activityLogsDoc = (await db
      .collection("activity_logs")
      .find({
        $or: [{ userId: userDoc.discord_id }, { userId: userDoc.id }],
      })
      .sort({ timestamp: -1 })
      .limit(200)
      .toArray()) as WithId<ActivityLogDocument>[]

    const user = {
      id: userDoc.id,
      discord_id: userDoc.discord_id,
      username: userDoc.username || userDoc.name || "Usuário",
      email: userDoc.email,
      discriminator: userDoc.discriminator,
      avatar: userDoc.avatar,
      firstLoginDate: userDoc.firstLoginDate,
      lastLoginDate: userDoc.lastLoginDate,
      lastLoginIp: userDoc.lastLoginIp,
      ip: userDoc.ip || {
        address: "127.0.0.1",
        country: "Brasil",
        city: "São Paulo",
        country_code: "BR",
      },
      vision: userDoc.vision || {
        signature: "",
        visionid: "",
      },
      security: userDoc.security || {
        createdAt: new Date().toISOString(),
        lastIpCheck: new Date().toISOString(),
        authAttempts: 0,
      },
      quality: userDoc.quality || {
        reputation: "desconhecido",
        statsaccount: "otima",
        statswallet: "desconhecido",
      },
      settings: userDoc.settings || {},
      type: userDoc.type,
      manager: userDoc.manager,
      codeVerified: userDoc.codeVerified || false,
      accepted: userDoc.accepted || false,
      following: userDoc.following || [],
      followers: userDoc.followers || [],
      trash: userDoc.trash,
      banned: userDoc.banned,
      suspended: userDoc.suspended,
      authInProgress: userDoc.authInProgress,
    }

    const activityLogs = activityLogsDoc.map((log) => ({
      _id: log._id,
      userId: log.userId,
      action: log.action,
      success: log.success,
      ip: log.ip,
      details: log.details,
      timestamp: log.timestamp,
    }))

    const sessionHistory = activityLogs
      .filter((log) => log.details?.sessionId)
      .map((log) => ({
        sessionId: log.details.sessionId,
        createdAt: new Date(log.timestamp).toISOString(),
        ip: log.ip,
        userAgent: log.details?.userAgent,
        active: log.action === "authentication_finalized" && log.success,
      }))
      .reduce((unique, session) => {
        const exists = unique.find((s) => s.sessionId === session.sessionId)
        if (!exists) unique.push(session)
        return unique
      }, [] as any[])

    const ipMap = new Map()

    activityLogs.forEach((log) => {
      if (log.ip && log.ip !== "unknown") {
        const key = log.ip
        if (!ipMap.has(key)) {
          ipMap.set(key, {
            ip: log.ip,
            country: log.details?.country || user.ip?.country || "Desconhecido",
            city: log.details?.city || user.ip?.city || "Desconhecida",
            country_code: log.details?.country_code || user.ip?.country_code || "XX",
            firstSeen: log.timestamp,
            lastSeen: log.timestamp,
            loginCount: 1,
          })
        } else {
          const existing = ipMap.get(key)
          existing.lastSeen = log.timestamp > existing.lastSeen ? log.timestamp : existing.lastSeen
          existing.firstSeen = log.timestamp < existing.firstSeen ? log.timestamp : existing.firstSeen
          existing.loginCount++
        }
      }
    })

    if (user.ip?.address) {
      const key = user.ip.address
      if (!ipMap.has(key)) {
        ipMap.set(key, {
          ip: user.ip.address,
          country: user.ip.country,
          city: user.ip.city,
          country_code: user.ip.country_code,
          firstSeen: new Date(user.firstLoginDate || Date.now()),
          lastSeen: new Date(user.lastLoginDate || Date.now()),
          loginCount: 1,
        })
      }
    }

    const ipHistory = Array.from(ipMap.values()).sort(
      (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime(),
    )

    const oauthSessions = activityLogs
      .filter((log) => log.action === "oauth_callback" && log.details?.access_token)
      .map((log) => ({
        access_token: log.details.access_token.slice(0, 20) + "...",
        refresh_token: log.details.refresh_token ? log.details.refresh_token.slice(0, 20) + "..." : undefined,
        created_at: new Date(log.timestamp).toISOString(),
        expires_at: log.details.expires_at,
        scope: log.details.scope || "identify guilds email guilds.join",
        ip_address: log.ip,
      }))
      .slice(0, 50)

    res.status(200).json({
      success: true,
      user,
      activityLogs,
      sessionHistory,
      ipHistory,
      oauthSessions,
    })
  } catch (error: any) {
    console.error("Erro ao buscar logs completos:", error)
    res.status(500).json({
      error: "Erro interno do servidor",
    })
  }
}

export default withSession(handler)
