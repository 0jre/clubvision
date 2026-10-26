import { dbConnect } from "@/core/integration/connect"
import { AdvancedRewardEngine } from "./reward"
import type { SeasonItemPool } from "./battlepass"
import { ClubActivityManager } from "./club-activity-manager"

interface AdvancedBattlePassSeason {
  seasonId: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  maxTiers: number
  isActive: boolean
  seasonNumber: number
  algorithmSeed?: any 
  algorithmVersion: string
  itemPool: SeasonItemPool
  statistics: SeasonStatistics
}

interface SeasonStatistics {
  totalRewards: number
  emptyTiers: number
  uniqueStoreItems: number
  uniqueCaseItems: number
  specialRewards: number
  algorithmSeed: string
}

export class AdvancedSeasonManager {
  private static readonly ALGORITHM_VERSION = "v3.0.0-jackpot-simplified"

  /**
   * 🚀 SISTEMA AVANÇADO: Verificar e criar temporada com algoritmo inteligente
   */
  static async checkAndCreateAdvancedSeason(): Promise<{
    created: boolean
    season: AdvancedBattlePassSeason | null
    message: string
    statistics?: SeasonStatistics
  }> {
    try {
      const { db } = await dbConnect()
      const seasonsCollection = db.collection<AdvancedBattlePassSeason>("battlepass_seasons_advanced")

      // Verificar temporada ativa
      const activeSeason = await seasonsCollection.findOne({ isActive: true })

      if (!activeSeason) {
        console.log("🔍 Nenhuma temporada ativa encontrada. Criando nova temporada avançada...")
        return await this.createAdvancedSeason()
      }

      // Verificar se a temporada atual expirou
      const now = new Date()
      const endDate = new Date(activeSeason.endDate)

      if (now >= endDate) {
        console.log("⏰ Temporada atual expirou. Criando nova temporada avançada...")

        // Desativar temporada anterior
        await seasonsCollection.updateOne({ seasonId: activeSeason.seasonId }, { $set: { isActive: false } })

        // Arquivar dados da temporada anterior
        await this.archiveAdvancedSeasonData(activeSeason.seasonId)

        return await this.createAdvancedSeason()
      }

      // Temporada ativa e válida
      return {
        created: false,
        season: activeSeason,
        message: `Temporada ${activeSeason.name} ativa até ${endDate.toLocaleDateString()}`,
        statistics: activeSeason.statistics,
      }
    } catch (error) {
      console.error("❌ Erro ao verificar temporadas avançadas:", error)
      throw error
    }
  }

  /**
   * 🎮 CRIAÇÃO AVANÇADA: Criar nova temporada com algoritmo inteligente
   */
  private static async createAdvancedSeason(): Promise<{
    created: boolean
    season: AdvancedBattlePassSeason
    message: string
    statistics: SeasonStatistics
  }> {
    const { db } = await dbConnect()
    const seasonsCollection = db.collection("battlepass_seasons_advanced")
    const rewardsCollection = db.collection("battlepass_rewards_advanced")

    const seasonNumber = await this.getNextSeasonNumber()
    const maxTiers = 100

    // 🧠 GERAR POOL INTELIGENTE DE ITENS
    console.log(`🧠 Gerando pool inteligente para temporada ${seasonNumber} com 2% jackpot...`)
    const itemPool = AdvancedRewardEngine.generateSeasonItemPool(`season_${seasonNumber}`, maxTiers)

    const newSeason: AdvancedBattlePassSeason = {
      seasonId: itemPool.seasonId,
      name: `TEMPORADA CLUBR ${seasonNumber} - ${this.getSeasonTheme(seasonNumber)}`,
      description: `A ${seasonNumber}ª temporada do Battle Pass Vision com algoritmo simplificado e 2% de jackpot para usuários free!`,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
      maxTiers,
      isActive: true,
      seasonNumber,
      algorithmVersion: this.ALGORITHM_VERSION,
      itemPool,
      statistics: {
        totalRewards: 0,
        emptyTiers: itemPool.tierDistribution.emptyTiers.length,
        uniqueStoreItems: itemPool.availableStoreItems.length,
        uniqueCaseItems: itemPool.availableCaseItems.length,
        specialRewards: itemPool.tierDistribution.specialTiers.length,
        algorithmSeed: itemPool.algorithmSeed,
      },
    }

    console.log(`🎮 Criando temporada avançada ${newSeason.name}...`)

    // Criar nova temporada
    await seasonsCollection.insertOne(newSeason)

    // 🔄 RESETAR ATIVIDADE DO CLUB PARA NOVA TEMPORADA
    console.log("🔄 Resetando atividade do club para nova temporada...")
    const resetResult = await ClubActivityManager.resetClubActivityForNewSeason()
    console.log(`✅ Atividade resetada para ${resetResult.usersReset} usuários`)

    // 🎁 GERAR E SALVAR TODAS AS RECOMPENSAS COM ALGORITMO AVANÇADO
    console.log("🎁 Gerando recompensas com algoritmo avançado...")
    const statistics = await this.generateAndSaveAdvancedRewards(newSeason.seasonId, maxTiers, itemPool)

    // Atualizar estatísticas da temporada
    await seasonsCollection.updateOne({ seasonId: newSeason.seasonId }, { $set: { statistics } })

    // Criar índices e resetar progresso
    await this.ensureAdvancedIndexes()
    await this.resetUserProgress(newSeason.seasonId)
    await this.createSeasonNotification(newSeason)

    console.log(`✅ Nova temporada avançada criada: ${newSeason.name}`)
    console.log(`📊 Estatísticas:`, statistics)

    return {
      created: true,
      season: { ...newSeason, statistics },
      message: `Nova temporada ${newSeason.name} iniciada com algoritmo avançado!`,
      statistics,
    }
  }

  /**
   * 🎁 GERAÇÃO AVANÇADA: Gerar e salvar recompensas com algoritmo inteligente
   */
  private static async generateAndSaveAdvancedRewards(
    seasonId: string,
    maxTiers: number,
    itemPool: SeasonItemPool,
  ): Promise<SeasonStatistics> {
    const { db } = await dbConnect()
    const rewardsCollection = db.collection("battlepass_rewards_advanced")

    const seasonRewards: any[] = []
    const batchSize = 20
    let totalRewards = 0
    let emptyTiers = 0
    const emptyTiersList: number[] = []

    console.log(`📦 Gerando recompensas avançadas para ${maxTiers} tiers com mais tiers vazios...`)

    for (let tier = 1; tier <= maxTiers; tier++) {
      // 🎯 USAR ALGORITMO AVANÇADO
      const rewards = AdvancedRewardEngine.generateAdvancedTierRewards(tier, itemPool)

      // Contar estatísticas
      if (rewards.free) totalRewards++
      if (rewards.premium) totalRewards++
      if (!rewards.free && !rewards.premium) {
        emptyTiers++
        emptyTiersList.push(tier)
      }

      const seasonReward = {
        seasonId,
        tier,
        freeReward: rewards.free,
        premiumReward: rewards.premium,
        isEmpty: !rewards.free && !rewards.premium,
        createdAt: new Date(),
        algorithmVersion: this.ALGORITHM_VERSION,
        uniqueItems: {
          freeUniqueId: rewards.free?.uniqueId,
          premiumUniqueId: rewards.premium?.uniqueId,
        },
      }

      seasonRewards.push(seasonReward)

      // Inserir em lotes
      if (seasonRewards.length >= batchSize || tier === maxTiers) {
        await rewardsCollection.insertMany([...seasonRewards])
        console.log(`✅ Salvos tiers ${tier - seasonRewards.length + 1} até ${tier}`)
        seasonRewards.length = 0
      }
    }

    // Criar índice para busca rápida
    await rewardsCollection.createIndex({ seasonId: 1, tier: 1 }, { unique: true })

    const statistics: SeasonStatistics = {
      totalRewards,
      emptyTiers,
      uniqueStoreItems: itemPool.usedStoreItems.size,
      uniqueCaseItems: itemPool.usedCaseItems.size,
      specialRewards: itemPool.tierDistribution.specialTiers.length,
      algorithmSeed: itemPool.algorithmSeed,
    }

    console.log(`🎉 Temporada ${seasonId} criada com algoritmo simplificado:`)
    console.log(`   📊 ${maxTiers} tiers totais`)
    console.log(`   🚫 ${emptyTiers} tiers vazios (${((emptyTiers / maxTiers) * 100).toFixed(1)}%)`)
    console.log(`   🎁 ${totalRewards} recompensas únicas`)
    console.log(`   🛍️ ${itemPool.usedStoreItems.size} itens de loja únicos`)
    console.log(`   📦 ${itemPool.usedCaseItems.size} itens de caixa únicos`)
    console.log(`   🎰 2% chance de jackpot para usuários free!`)
    console.log(`   ✅ Sistema simplificado sem épicas/lendárias`)

    return statistics
  }

  // 🔍 BUSCAR RECOMPENSAS AVANÇADAS
  static async getAdvancedSeasonRewards(seasonId: string) {
    const { db } = await dbConnect()
    const rewardsCollection = db.collection("battlepass_rewards_advanced")
    return await rewardsCollection.find({ seasonId }).sort({ tier: 1 }).toArray()
  }

  static async getAdvancedTierReward(seasonId: string, tier: number) {
    const { db } = await dbConnect()
    const rewardsCollection = db.collection("battlepass_rewards_advanced")
    return await rewardsCollection.findOne({ seasonId, tier })
  }

  /**
   * 🏆 OBTER ESTATÍSTICAS DE ATIVIDADE DO CLUB
   */
  static async getClubActivityStats(): Promise<any> {
    return await ClubActivityManager.getActivityStatistics()
  }

  // 🔧 FUNÇÕES AUXILIARES

  private static async getNextSeasonNumber(): Promise<number> {
    const { db } = await dbConnect()
    const seasonsCollection = db.collection("battlepass_seasons_advanced")
    const lastSeason = await seasonsCollection.findOne({}, { sort: { seasonNumber: -1 } })
    return (lastSeason?.seasonNumber || 0) + 1
  }

  private static getSeasonTheme(seasonNumber: number): string {
    const themes = [
      "GENESIS",
      "EVOLUTION",
      "REVOLUTION",
      "ASCENSION",
      "DOMINION",
      "INFINITY",
      "NEXUS",
      "QUANTUM",
      "APEX",
      "ZENITH",
      "OMEGA",
      "ETERNAL",
    ]
    return themes[(seasonNumber - 1) % themes.length] || `SEASON ${seasonNumber}`
  }

  private static async ensureAdvancedIndexes(): Promise<void> {
    const { db } = await dbConnect()

    try {
      await db.collection("battlepass_advanced").createIndex({ userId: 1, seasonId: 1 }, { unique: true })
      await db.collection("battlepass_seasons_advanced").createIndex({ isActive: 1 })
      await db.collection("battlepass_seasons_advanced").createIndex({ seasonId: 1 }, { unique: true })
      await db.collection("battlepass_rewards_advanced").createIndex({ seasonId: 1, tier: 1 }, { unique: true })

      console.log("✅ Índices avançados do Battle Pass verificados/criados")
    } catch (error) {
      console.log("ℹ️ Índices avançados já existem")
    }
  }

  private static async resetUserProgress(seasonId: string): Promise<void> {
    console.log(`🔄 Sistema avançado preparado para nova temporada: ${seasonId}`)
  }

  private static async archiveAdvancedSeasonData(seasonId: string): Promise<void> {
    const { db } = await dbConnect()

    // Arquivar dados da temporada anterior
    const seasonData = await db.collection("battlepass_advanced").find({ seasonId }).toArray()
    const seasonRewards = await db.collection("battlepass_rewards_advanced").find({ seasonId }).toArray()

    if (seasonData.length > 0) {
      await db
        .collection("battlepass_archive_advanced")
        .insertMany(seasonData.map((data) => ({ ...data, archivedAt: new Date() })))
      console.log(`📦 ${seasonData.length} registros avançados arquivados`)
    }

    if (seasonRewards.length > 0) {
      await db
        .collection("battlepass_rewards_archive_advanced")
        .insertMany(seasonRewards.map((reward) => ({ ...reward, archivedAt: new Date() })))
      console.log(`🎁 ${seasonRewards.length} recompensas avançadas arquivadas`)
    }
  }

  private static async createSeasonNotification(season: AdvancedBattlePassSeason): Promise<void> {
    const { db } = await dbConnect()

    const usersCollection = db.collection("items")
    const activeUsers = await usersCollection.find({}, { projection: { id: 1 } }).toArray()

    const notifications = activeUsers.map((user) => ({
      userId: user.id,
      type: "new_advanced_season",
      title: "🚀 Nova Temporada Avançada!",
      message: `${season.name} começou com algoritmo simplificado! 2% chance de jackpot para usuários free!`,
      timestamp: new Date(),
      metadata: {
        seasonId: season.seasonId,
        seasonName: season.name,
        algorithmVersion: season.algorithmVersion,
        statistics: season.statistics,
      },
    }))

    if (notifications.length > 0) {
      await db.collection("notifications").insertMany(notifications)
      console.log(`📢 ${notifications.length} notificações de temporada avançada enviadas`)
    }
  }

  static async getActiveSeason(): Promise<AdvancedBattlePassSeason | null> {
    const { db } = await dbConnect()
    const seasonsCollection = db.collection<AdvancedBattlePassSeason>("battlepass_seasons_advanced")
    return await seasonsCollection.findOne({ isActive: true })
  }

  static async getSeasonStats(seasonId: string) {
    const { db } = await dbConnect()
    const battlePassCollection = db.collection("battlepass_advanced")

    const stats = await battlePassCollection
      .aggregate([
        { $match: { seasonId } },
        {
          $group: {
            _id: null,
            totalPlayers: { $sum: 1 },
            premiumPlayers: { $sum: { $cond: ["$isPremium", 1, 0] } },
            averageTier: { $avg: "$currentTier" },
            totalXP: { $sum: "$totalXP" },
            maxTier: { $max: "$currentTier" },
          },
        },
      ])
      .toArray()

    return (
      stats[0] || {
        totalPlayers: 0,
        premiumPlayers: 0,
        averageTier: 0,
        totalXP: 0,
        maxTier: 0,
      }
    )
  }
}
