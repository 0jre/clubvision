// Cache simples para armazenar dados de geolocalização por IP
interface GeoData {
  country_code: any
  country: string
  city: string
  region: string
  timestamp: number
}

// Cache em memória (será reiniciado quando o servidor reiniciar)
const geoCache: Record<string, GeoData> = {}

// Tempo de expiração do cache em milissegundos (24 horas)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000

/**
 * Obtém dados de geolocalização do cache
 */
export function getGeoDataFromCache(ip: string): GeoData | null {
  const cachedData = geoCache[ip]

  // Se não existir no cache ou estiver expirado
  if (!cachedData || Date.now() - cachedData.timestamp > CACHE_EXPIRATION) {
    return null
  }

  return cachedData
}

/**
 * Salva dados de geolocalização no cache
 */
export function saveGeoDataToCache(ip: string, data: {country_code: string, country: string; city: string; region: string }): void {
  geoCache[ip] = {
    ...data,
    timestamp: Date.now(),
  }
}
