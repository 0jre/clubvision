import { NextIronRequest } from '@/lib/session/index';
 
// Função melhorada para obter IP real
export const getRealClientIP = (req: NextIronRequest): string => {
  // Lista de headers para verificar em ordem de prioridade
  const ipHeaders = [
    "cf-connecting-ip", // Cloudflare
    "x-real-ip", // Nginx
    "x-forwarded-for", // Proxy padrão
    "x-client-ip", // Apache
    "x-forwarded", // Outros proxies
    "forwarded-for", // RFC 7239
    "forwarded", // RFC 7239
  ]

  // Verificar cada header
  for (const header of ipHeaders) {
    const value = req.headers[header]
    if (value && typeof value === "string") {
      // x-forwarded-for pode conter múltiplos IPs
      const ip = value.split(",")[0].trim()
      if (isValidIP(ip)) {
        return ip
      }
    }
  }

  // Fallback para propriedades da conexão
  const connectionSources = [
    (req as any).connection?.remoteAddress,
    (req as any).socket?.remoteAddress,
    (req as any).info?.remoteAddress,
    (req as any).ip,
  ]

  for (const source of connectionSources) {
    if (source && typeof source === "string" && isValidIP(source)) {
      return source
    }
  }

  // Último fallback
  return "127.0.0.1"
}

// Validar se é um IP válido
const isValidIP = (ip: string): boolean => {
  if (!ip || typeof ip !== "string") return false

  // Remover espaços
  ip = ip.trim()

  // Verificar se não está vazio
  if (!ip) return false

  // Verificar IPv4
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  if (ipv4Regex.test(ip)) return true

  // Verificar IPv6 (básico)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/
  if (ipv6Regex.test(ip)) return true

  return false
}

// Sistema de rate limiting melhorado
interface RateLimitData {
  count: number
  resetTime: number
  blocked: boolean
}

const rateLimitStore = new Map<string, RateLimitData>()

export const checkRateLimit = (ipAddress: string, maxRequests = 5, windowMs: number = 15 * 60 * 1000): void => {
  const now = Date.now()
  const key = `rate_limit_${ipAddress}`

  let data = rateLimitStore.get(key)

  // Inicializar ou resetar se expirou
  if (!data || now > data.resetTime) {
    data = {
      count: 1,
      resetTime: now + windowMs,
      blocked: false,
    }
    rateLimitStore.set(key, data)
    return
  }

  // Incrementar contador
  data.count++

  // Verificar se excedeu o limite
  if (data.count > maxRequests) {
    data.blocked = true
    const remainingTime = Math.ceil((data.resetTime - now) / 60000)
    throw new Error(`Rate limit excedido. Tente novamente em ${remainingTime} minutos.`)
  }
}

// Limpar entradas expiradas periodicamente
setInterval(
  () => {
    const now = Date.now()
    for (const [key, data] of rateLimitStore.entries()) {
      if (now > data.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  },
  5 * 60 * 1000,
) // Limpar a cada 5 minutos
