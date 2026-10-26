 import { AdvancedSeasonManager } from "@/lib/services/level/season-manager"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método não permitido" })
  }

  try {
    // 🚀 VERIFICAR E CRIAR TEMPORADA AVANÇADA
    const result = await AdvancedSeasonManager.checkAndCreateAdvancedSeason()

    // 📊 BUSCAR ESTATÍSTICAS DA TEMPORADA ATUAL
    let stats = null
    if (result.season) {
      stats = await AdvancedSeasonManager.getSeasonStats(result.season.seasonId)
    }

    // 🏆 BUSCAR ESTATÍSTICAS DE ATIVIDADE DO CLUB
    const clubActivityStats = await AdvancedSeasonManager.getClubActivityStats()

    return res.status(200).json({
      success: true,
      seasonCreated: result.created,
      message: result.message,
      season: result.season,
      stats,
      clubActivityStats,
      algorithmInfo: {
        version: result.season?.algorithmVersion || "v3.0.0-jackpot-simplified",
        statistics: result.statistics,
        uniqueItemsGuarantee: true,
        emptyTiersIncluded: true,
        jackpotChance: "2%",
      },
    })
  } catch (error: any) {
    console.error("❌ Erro na verificação de temporada avançada:", error)
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
