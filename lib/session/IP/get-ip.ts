import { getGeoDataFromCache, saveGeoDataToCache } from "./ip-cache"

/**
 * Obtém o IP real do usuário
 */
export function getRealIp(req: any): string {
  // Verifica os cabeçalhos comuns para IP
  const forwarded = req.headers["x-forwarded-for"]
  const realIp = req.headers["x-real-ip"]

  if (forwarded) {
    const forwardedStr = Array.isArray(forwarded) ? forwarded[0] : forwarded
    return forwardedStr.split(",")[0].trim()
  }

  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp
  }

  return req.socket.remoteAddress || "Desconhecido"
}

  


export async function getGeoData(ip: string) {
 

  // Verificar se os dados estão no cache
  const cachedData = getGeoDataFromCache(ip)
  if (cachedData) {
    console.log(`Usando dados de geolocalização em cache para IP: ${ip}`)
    return {
      ip: ip,
      country_code: cachedData.country_code,
      country: cachedData.country,
      city: cachedData.city,
      region: cachedData.region,
    }
  }

  // Tenta com a API ipbase.com (fonte principal)
  try {
    console.log(`Obtendo geolocalização via ipbase.com`)

    // A API ipbase.com detecta automaticamente o IP do cliente
    const response = await fetch(`https://api.ipbase.com/v1/json/${ip}`)
    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro na API ipbase.com: ${response.status}`)
    }

    const data = await response.json() as any

    // Verificar se os dados necessários estão presentes
    if (data && data.country_name && data.city) {
      const geoData = {
        ip: data.ip,
        country_code: data.country_code,
        country: data.country_name,
        city: data.city,
        region: data.region_name || "Desconhecido",
      }

      // Salvar no cache
      saveGeoDataToCache(ip, geoData)

      return geoData
    } else {
      throw new Error("Dados incompletos da API ipbase.com")
    }
  } catch (error) {
    console.error("Erro ao usar ipbase.com:", error)
    // Continua para o próximo método se este falhar
  }

  // Tenta com a API ipinfo.io como primeiro fallback
  try {
    console.log("Tentando API alternativa ipinfo.io")
    const response = await fetch(`https://ipinfo.io/${ip}/json`)
    const data = await response.json() as any

    if (data && data.country && data.city) {
      // Mapeamento de códigos de país para nomes completos
      const countryNames: Record<string, string> = {

        BR: "Brasil",
        US: "Estados Unidos",
        CA: "Canadá",
        // Adicione mais conforme necessário
      }

      const geoData = {
        ip: data.ip,
        country_code: data.country,
        country: countryNames[data.country] || data.country,
        city: data.city,
        region: data.region || "Desconhecido",
      }

      // Salvar no cache
      saveGeoDataToCache(ip, geoData)

      return geoData
    }
  } catch (error) {
    console.error("Erro ao usar ipinfo.io:", error)
    // Continua para o próximo método se este falhar
  }

  // Tenta com a API ip-api.com como segundo fallback
  try {
    console.log("Tentando API alternativa ip-api.com")
    const response = await fetch(`http://ip-api.com/json/${ip}`)
    const data = await response.json() as any

    if (data && data.status === "success") {
      const geoData = {
        ip: data.query,
        country_code: data.countryCode,
        country: data.country || "Desconhecido",
        city: data.city || "Desconhecido",
        region: data.regionName || "Desconhecido",
      }

      // Salvar no cache
      saveGeoDataToCache(ip, geoData)

      return geoData
    }
  } catch (error) {
    console.error("Erro ao usar ip-api.com:", error)
  }

  // Se todas as tentativas falharem
  console.error("Todas as tentativas de geolocalização falharam para o IP:", ip)
  return {
    ip: "Desconhecido",
    country_code: "Desconhecido",
    country: "Desconhecido",
    city: "Desconhecido",
    region: "Desconhecido",
  }
}
