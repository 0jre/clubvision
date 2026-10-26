import { BigtoreList } from "@/data/recharge/complements"
import { BigboxList } from "@/data/recharge/box.vision"
import { containerItems } from "@/data/list_tvl/list.container"
import type { BattlePassReward, SeasonItemPool, TierDistribution, AlgorithmConfig } from "./battlepass"

/**
 * 🎯 CLASSE PRINCIPAL: Motor de Recompensas Avançado
 * Sistema simplificado com 2% de jackpot para usuários free
 */
export class AdvancedRewardEngine {
  private static algorithmConfig: AlgorithmConfig = {
    emptyTierChance: 0.45, // 45% chance de tier vazio
    premiumAdvantage: 0.25, // 25% menos chance de tier vazio no premium
    rarityWeights: {
      common: 1.0,
      rare: 0.6,
      epic: 0.3,
      legendary: 0.1,
    },
    tierTypeWeights: {
      1: { empty: 0.35, currency: 0.45, storeItem: 0.15, caseItem: 0.05, special: 0.0 },
      10: { empty: 0.4, currency: 0.35, storeItem: 0.2, caseItem: 0.05, special: 0.0 },
      25: { empty: 0.45, currency: 0.25, storeItem: 0.2, caseItem: 0.08, special: 0.02 },
      50: { empty: 0.5, currency: 0.2, storeItem: 0.18, caseItem: 0.1, special: 0.02 },
      75: { empty: 0.55, currency: 0.15, storeItem: 0.15, caseItem: 0.12, special: 0.03 },
      100: { empty: 0.45, currency: 0.1, storeItem: 0.15, caseItem: 0.25, special: 0.05 },
    },
  }

  // 🎯 CONTROLE DE DISTRIBUIÇÃO: Evitar repetições excessivas
  private static seasonDistribution = {
    currencyUsage: { bits: 0, coins: 0, tokens: 0 },
    lastCurrencyType: null as string | null,
    consecutiveCount: 0,
  }

  // 🎮 MARCOS IMPORTANTES: Tiers que sempre têm boas recompensas (sem forçar épicas)
  private static readonly IMPORTANT_TIERS = [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100]

  // 🚫 TIERS VAZIOS ESTRATÉGICOS: Posicionados para maximizar expectativa
  private static readonly STRATEGIC_EMPTY_TIERS = [
    // Antes de marcos importantes (gerar expectativa)
    9, 19, 24, 29, 39, 49, 59, 69, 74, 79, 89, 94,
    // Alguns espalhados para balanceamento (não consecutivos)
    13, 17, 33, 37, 43, 47, 53, 57, 63, 67, 83, 87,
  ]

  // 🔥 SEQUÊNCIAS DE MOMENTUM: Tiers que NUNCA podem ser vazios (manter energia)
  private static readonly MOMENTUM_SEQUENCES = [
    [1, 2, 3, 4, 5], // Início forte
    [21, 22, 23], // Após marco 20
    [26, 27, 28], // Após marco 25
    [51, 52, 53], // Após marco 50
    [76, 77, 78], // Após marco 75
    [96, 97, 98, 99, 100], // Final épico
  ]

  // 🎁 CHANCE DE JACKPOT: 2% de chance de free ganhar item premium
  private static readonly JACKPOT_CHANCE = 0.02 // 2%

  /**
   * 🧠 ALGORITMO PRINCIPAL: Gera pool de itens único para cada temporada
   */
  static generateSeasonItemPool(seasonId: string, maxTiers: number): SeasonItemPool {
    console.log(`🧠 Gerando pool inteligente para temporada ${seasonId} com 2% de chance de jackpot...`)

    // Resetar distribuição para nova temporada
    this.resetSeasonDistribution()

    // Criar seed único baseado na temporada
    const algorithmSeed = this.generateAlgorithmSeed(seasonId)

    // Combinar todos os itens disponíveis
    const allStoreItems = [...BigtoreList, ...BigboxList]
    const allCaseItems = this.getAllCaseItems()

    // Embaralhar usando seed determinístico
    const shuffledStoreItems = this.deterministicShuffle([...allStoreItems], algorithmSeed)
    const shuffledCaseItems = this.deterministicShuffle([...allCaseItems], algorithmSeed + "_case")

    // Calcular distribuição inteligente de tiers COM ESTRATÉGIA EMOCIONAL
    const tierDistribution = this.calculateEmotionalTierDistribution(maxTiers, algorithmSeed)

    console.log(`🎮 Distribuição emocional calculada:`, {
      emptyTiers: tierDistribution.emptyTiers.length,
      importantTiers: this.IMPORTANT_TIERS.length,
      momentumSequences: this.MOMENTUM_SEQUENCES.length,
      jackpotChance: `${this.JACKPOT_CHANCE * 100}%`,
      currencyTiers: tierDistribution.currencyTiers.length,
      storeItemTiers: tierDistribution.storeItemTiers.length,
      caseItemTiers: tierDistribution.caseItemTiers.length,
      specialTiers: tierDistribution.specialTiers.length,
    })

    return {
      seasonId,
      usedStoreItems: new Set(),
      usedCaseItems: new Set(),
      availableStoreItems: shuffledStoreItems,
      availableCaseItems: shuffledCaseItems,
      tierDistribution,
      algorithmSeed,
    }
  }

  /**
   * 🎯 ALGORITMO AVANÇADO: Gera recompensas para um tier específico
   */
  static generateAdvancedTierRewards(
    tier: number,
    seasonPool: SeasonItemPool,
    isPremium = false,
  ): { free?: BattlePassReward; premium?: BattlePassReward } {
    const rewards: { free?: BattlePassReward; premium?: BattlePassReward } = {}

    // 🚫 VERIFICAR SE É TIER VAZIO ESTRATÉGICO
    if (this.STRATEGIC_EMPTY_TIERS.includes(tier)) {
      console.log(`🎯 TIER VAZIO ESTRATÉGICO ${tier} - Gerando expectativa para próximo marco!`)
      return {} // Tier vazio estratégico
    }

    // 🏆 VERIFICAR SE É TIER IMPORTANTE (sem forçar épicas, apenas garantir recompensa)
    if (this.IMPORTANT_TIERS.includes(tier)) {
      console.log(`🏆 TIER IMPORTANTE ${tier} - Garantindo boas recompensas!`)
      return this.generateImportantTierRewards(tier, seasonPool)
    }

    // 🔥 VERIFICAR SE ESTÁ EM SEQUÊNCIA DE MOMENTUM
    const isInMomentumSequence = this.MOMENTUM_SEQUENCES.some((sequence) => sequence.includes(tier))
    if (isInMomentumSequence) {
      console.log(`🔥 TIER DE MOMENTUM ${tier} - Mantendo energia alta!`)
      return this.generateMomentumRewards(tier, seasonPool)
    }

    // 🎲 Determinar tipo de tier baseado na distribuição pré-calculada
    const tierType = this.determineTierType(tier, seasonPool.tierDistribution)

    console.log(`🎯 Tier ${tier} - Tipo: ${tierType}`)

    // Gerar recompensas baseado no tipo
    switch (tierType) {
      case "empty":
        // Tier vazio - sem recompensas (apenas se não for estratégico)
        break

      case "currency":
        rewards.free = this.generateCurrencyReward(tier, seasonPool, false)
        rewards.premium = this.generateCurrencyReward(tier, seasonPool, true)
        break

      case "storeItem":
        rewards.premium = this.generateStoreItemReward(tier, seasonPool)
        rewards.free = this.generateCurrencyReward(tier, seasonPool, false) // Free sempre ganha moeda
        break

      case "caseItem":
        rewards.premium = this.generateCaseItemReward(tier, seasonPool)
        rewards.free = this.generateCurrencyReward(tier, seasonPool, false)
        break

      case "special":
        rewards.premium = this.generateSpecialReward(tier, seasonPool)
        rewards.free = this.generateCurrencyReward(tier, seasonPool, false)
        break
    }

    // 🎁 ALGORITMO JACKPOT: 2% chance de usuário free ganhar item premium
    if (rewards.premium && !rewards.free?.type.includes("item")) {
      const jackpotChance = this.generateSeededRandom(seasonPool.algorithmSeed, tier + 9999)
      if (jackpotChance < this.JACKPOT_CHANCE) {
        console.log(`🎉 JACKPOT! Tier ${tier} - Usuário free ganhou item premium! (2% chance)`)
        rewards.free = { ...rewards.premium }
      }
    }

    return rewards
  }

  /**
   * 🏆 RECOMPENSAS PARA TIERS IMPORTANTES: Sem forçar épicas, apenas garantir qualidade
   */
  private static generateImportantTierRewards(
    tier: number,
    seasonPool: SeasonItemPool,
  ): { free?: BattlePassReward; premium?: BattlePassReward } {
    const rewards: { free?: BattlePassReward; premium?: BattlePassReward } = {}

    // Tier 100 = Recompensas especiais (mas não lendárias forçadas)
    if (tier === 100) {
      rewards.free = this.generateSpecialTier100Reward(tier, seasonPool, false)
      rewards.premium = this.generateSpecialTier100Reward(tier, seasonPool, true)
    }
    // Outros tiers importantes = Garantir pelo menos uma boa recompensa
    else {
      rewards.free = this.generateCurrencyReward(tier, seasonPool, false)

      // Premium tem maior chance de item especial
      const random = this.generateSeededRandom(seasonPool.algorithmSeed, tier + 5000)
      if (random < 0.6) {
        // 60% chance de item
        rewards.premium =
          this.generateStoreItemReward(tier, seasonPool) ||
          this.generateCaseItemReward(tier, seasonPool) ||
          this.generateSpecialReward(tier, seasonPool)
      } else {
        rewards.premium = this.generateCurrencyReward(tier, seasonPool, true)
      }
    }

    return rewards
  }

  /**
   * 🔥 RECOMPENSAS DE MOMENTUM: Para manter energia alta
   */
  private static generateMomentumRewards(
    tier: number,
    seasonPool: SeasonItemPool,
  ): { free?: BattlePassReward; premium?: BattlePassReward } {
    const rewards: { free?: BattlePassReward; premium?: BattlePassReward } = {}

    // Sempre dar recompensas em sequências de momentum
    rewards.free = this.generateCurrencyReward(tier, seasonPool, false)

    // Premium tem chance de item especial
    const random = this.generateSeededRandom(seasonPool.algorithmSeed, tier + 5000)
    if (random < 0.3) {
      // 30% chance de item
      rewards.premium =
        this.generateStoreItemReward(tier, seasonPool) || this.generateCurrencyReward(tier, seasonPool, true)
    } else {
      rewards.premium = this.generateCurrencyReward(tier, seasonPool, true)
    }

    return rewards
  }

  /**
   * 🎁 RECOMPENSA ESPECIAL TIER 100: Sem forçar lendário, mas especial
   */
  private static generateSpecialTier100Reward(
    tier: number,
    seasonPool: SeasonItemPool,
    isPremium: boolean,
  ): BattlePassReward {
    const tier100Rewards = [
      {
        type: "special" as const,
        amount: 5000,
        rarity: "rare" as const,
        category: "currency" as const,
        image: "/icons/special/tier100_crown.png",
        itemData: {
          name: "🏆 Troféu da Temporada",
          description: "Parabéns por completar todos os 100 tiers!",
        },
      },
      {
        type: "tokens" as const,
        amount: isPremium ? 20 : 12,
        rarity: "rare" as const,
        category: "currency" as const,
        image: "/icons/market/sadasjdub.webp",
        itemData: {
          name: "🎫 Tokens de Conquista",
          description: "Tokens especiais por completar a temporada!",
        },
      },
      {
        type: "bits" as const,
        amount: isPremium ? 8000 : 5000,
        rarity: "rare" as const,
        category: "currency" as const,
        image: "/icons/coins/gem.png",
        itemData: {
          name: "💎 Tesouro Final",
          description: "Uma boa quantidade de bits pela sua dedicação!",
        },
      },
    ]

    const rewardIndex = Math.floor(
      this.generateSeededRandom(seasonPool.algorithmSeed, tier + 10000) * tier100Rewards.length,
    )
    const baseReward = tier100Rewards[rewardIndex]

    return {
      ...baseReward,
      uniqueId: `${seasonPool.seasonId}_${tier}_tier100_${rewardIndex}`,
      seasonExclusive: true,
    }
  }

  /**
   * 🧮 ALGORITMO DE DISTRIBUIÇÃO EMOCIONAL: Calcula distribuição para maximizar engajamento
   */
  private static calculateEmotionalTierDistribution(maxTiers: number, seed: string): TierDistribution {
    const distribution: TierDistribution = {
      emptyTiers: [...this.STRATEGIC_EMPTY_TIERS.filter((t) => t <= maxTiers)],
      currencyTiers: [],
      storeItemTiers: [],
      caseItemTiers: [],
      specialTiers: [...this.IMPORTANT_TIERS.filter((t) => t <= maxTiers)],
    }

    // Sequências de momentum sempre têm recompensas
    const momentumTiers = this.MOMENTUM_SEQUENCES.flat().filter((t) => t <= maxTiers)

    for (let tier = 1; tier <= maxTiers; tier++) {
      // Pular se já está definido
      if (
        distribution.emptyTiers.includes(tier) ||
        distribution.specialTiers.includes(tier) ||
        momentumTiers.includes(tier)
      ) {
        if (momentumTiers.includes(tier)) {
          distribution.currencyTiers.push(tier) // Momentum = currency
        }
        continue
      }

      // Distribuir os tiers restantes
      const random = this.generateSeededRandom(seed, tier)
      const weights = this.getEmotionalTierWeights(tier)

      const tierType = this.selectWeightedRandom(weights, random)

      switch (tierType) {
        case "currency":
          distribution.currencyTiers.push(tier)
          break
        case "storeItem":
          distribution.storeItemTiers.push(tier)
          break
        case "caseItem":
          distribution.caseItemTiers.push(tier)
          break
      }
    }

    return distribution
  }

  /**
   * 🎮 Pesos emocionais para tiers
   */
  private static getEmotionalTierWeights(tier: number): Record<string, number> {
    // Mais itens especiais conforme avança
    if (tier >= 80) {
      return { currency: 0.4, storeItem: 0.3, caseItem: 0.3 }
    } else if (tier >= 60) {
      return { currency: 0.5, storeItem: 0.25, caseItem: 0.25 }
    } else if (tier >= 40) {
      return { currency: 0.6, storeItem: 0.2, caseItem: 0.2 }
    } else {
      return { currency: 0.7, storeItem: 0.15, caseItem: 0.15 }
    }
  }

  /**
   * 🎰 ALGORITMO DE SELEÇÃO: Seleciona tipo baseado em pesos
   */
  private static selectWeightedRandom(weights: Record<string, number>, random: number): string {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)
    let currentWeight = 0

    for (const [type, weight] of Object.entries(weights)) {
      currentWeight += weight
      if (random <= currentWeight / totalWeight) {
        return type
      }
    }

    return "currency" // Fallback
  }

  /**
   * 🎯 Determina tipo de tier baseado na distribuição
   */
  private static determineTierType(tier: number, distribution: TierDistribution): string {
    if (distribution.emptyTiers.includes(tier)) return "empty"
    if (distribution.specialTiers.includes(tier)) return "special"
    if (distribution.caseItemTiers.includes(tier)) return "caseItem"
    if (distribution.storeItemTiers.includes(tier)) return "storeItem"
    return "currency"
  }

  /**
   * 💰 Gera recompensa de moeda COM VARIEDADE
   */
  private static generateCurrencyReward(
    tier: number,
    seasonPool: SeasonItemPool,
    isPremium: boolean,
  ): BattlePassReward {
    // 🎯 ALGORITMO DE VARIEDADE: Evitar repetições consecutivas
    const availableTypes = ["bits", "coins", "tokens"] as const
    let selectedType: string

    // Se já temos 3 consecutivos do mesmo tipo, forçar mudança
    if (this.seasonDistribution.consecutiveCount >= 3) {
      const otherTypes = availableTypes.filter((t) => t !== this.seasonDistribution.lastCurrencyType)
      selectedType =
        otherTypes[Math.floor(this.generateSeededRandom(seasonPool.algorithmSeed, tier + 1000) * otherTypes.length)]
    } else {
      // Distribuição inteligente baseada no uso atual e tier
      const typeWeights = this.calculateCurrencyWeights(tier, isPremium)
      selectedType = this.selectCurrencyType(typeWeights, seasonPool.algorithmSeed, tier)
    }

    // Atualizar controle de distribuição
    this.updateDistributionControl(selectedType)

    const baseAmount = this.calculateDynamicAmount(tier, selectedType, isPremium)

    const images = {
      bits: "/icons/coins/gem.png",
      coins: "/icons/coins/gems/20250222_021201.webp",
      tokens: "/icons/market/sadasjdub.webp",
    }

    return {
      type: selectedType as "bits" | "coins" | "tokens",
      amount: baseAmount,
      rarity: this.determineRarity(tier),
      image: images[selectedType as keyof typeof images],
      category: "currency",
      uniqueId: `${seasonPool.seasonId}_${tier}_${selectedType}_${isPremium ? "premium" : "free"}`,
    }
  }

  /**
   * 🎲 ALGORITMO DE PESOS: Calcula pesos para tipos de moeda
   */
  private static calculateCurrencyWeights(tier: number, isPremium: boolean): Record<string, number> {
    const usage = this.seasonDistribution.currencyUsage
    const totalUsage = usage.bits + usage.coins + usage.tokens

    // Pesos base ajustados para tokens valiosos
    const weights = {
      bits: 0.4, // Reduzido (80% menos valor)
      coins: 0.5, // Principal (60% menos valor)
      tokens: 0.1, // MUITO reduzido (são valiosos!)
    }

    // Ajustar baseado no uso atual (balanceamento)
    if (totalUsage > 0) {
      const bitsRatio = usage.bits / totalUsage
      const coinsRatio = usage.coins / totalUsage
      const tokensRatio = usage.tokens / totalUsage

      // Se um tipo está sendo usado demais, reduzir peso
      if (bitsRatio > 0.5) weights.bits *= 0.5
      if (coinsRatio > 0.6) weights.coins *= 0.5
      if (tokensRatio > 0.2) weights.tokens *= 0.3 // Tokens são mais restritivos

      // Se um tipo está sendo usado pouco, aumentar peso
      if (bitsRatio < 0.2) weights.bits *= 1.5
      if (coinsRatio < 0.3) weights.coins *= 1.3
      if (tokensRatio < 0.05) weights.tokens *= 2.0
    }

    // Ajustar baseado no tier
    if (tier > 50) {
      weights.tokens *= 0.5 // Ainda menos tokens em tiers altos
      weights.bits *= 1.2
    }

    // Premium tem mais chance de tokens (mas ainda limitado)
    if (isPremium) {
      weights.tokens *= 1.5
      weights.bits *= 1.3
    }

    return weights
  }

  /**
   * 🎯 Seleciona tipo de moeda baseado nos pesos
   */
  private static selectCurrencyType(weights: Record<string, number>, seed: string, tier: number): string {
    const random = this.generateSeededRandom(seed, tier + 1000)
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)
    let currentWeight = 0

    for (const [type, weight] of Object.entries(weights)) {
      currentWeight += weight
      if (random <= currentWeight / totalWeight) {
        return type
      }
    }

    return "coins" // Fallback para coins
  }

  /**
   * 📊 Atualiza controle de distribuição
   */
  private static updateDistributionControl(selectedType: string): void {
    // Incrementar uso do tipo
    this.seasonDistribution.currencyUsage[selectedType as keyof typeof this.seasonDistribution.currencyUsage]++

    // Controlar consecutivos
    if (this.seasonDistribution.lastCurrencyType === selectedType) {
      this.seasonDistribution.consecutiveCount++
    } else {
      this.seasonDistribution.consecutiveCount = 1
      this.seasonDistribution.lastCurrencyType = selectedType
    }
  }

  /**
   * 🔄 Reset distribuição para nova temporada
   */
  private static resetSeasonDistribution(): void {
    this.seasonDistribution = {
      currencyUsage: { bits: 0, coins: 0, tokens: 0 },
      lastCurrencyType: null,
      consecutiveCount: 0,
    }
  }

  /**
   * 🛍️ Gera recompensa de item da loja (SEM REPETIÇÃO)
   */
  private static generateStoreItemReward(tier: number, seasonPool: SeasonItemPool): BattlePassReward | undefined {
    // Filtrar itens não utilizados
    const availableItems = seasonPool.availableStoreItems.filter((item) => !seasonPool.usedStoreItems.has(item.receive))

    if (availableItems.length === 0) {
      console.log(`⚠️ Sem itens de loja disponíveis para tier ${tier}`)
      return this.generateCurrencyReward(tier, seasonPool, true) // Fallback para moeda
    }

    // Selecionar item baseado no tier
    const itemIndex = Math.floor(
      this.generateSeededRandom(seasonPool.algorithmSeed, tier + 2000) * availableItems.length,
    )
    const selectedItem = availableItems[itemIndex]

    // Marcar como usado
    seasonPool.usedStoreItems.add(selectedItem.receive)

    return {
      type: "store_item",
      itemId: selectedItem.receive,
      itemData: selectedItem,
      rarity: this.mapPriceToRarity(selectedItem.price),
      category: "store",
      image: selectedItem.image,
      uniqueId: `${seasonPool.seasonId}_${tier}_store_${selectedItem.receive}`,
      seasonExclusive: true,
    }
  }

  /**
   * 📦 Gera recompensa de item de caixa (SEM REPETIÇÃO)
   */
  private static generateCaseItemReward(tier: number, seasonPool: SeasonItemPool): BattlePassReward | undefined {
    // Filtrar itens não utilizados
    const availableItems = seasonPool.availableCaseItems.filter((item) => !seasonPool.usedCaseItems.has(item.id))

    if (availableItems.length === 0) {
      console.log(`⚠️ Sem itens de caixa disponíveis para tier ${tier}`)
      return this.generateCurrencyReward(tier, seasonPool, true)
    }

    // Priorizar raridade baseada no tier
    const rarityFilter = this.getRarityFilterForTier(tier)
    const filteredItems = availableItems.filter((item) => rarityFilter.includes(this.mapRarity(item.rarity)))

    const itemsToSelect = filteredItems.length > 0 ? filteredItems : availableItems
    const itemIndex = Math.floor(
      this.generateSeededRandom(seasonPool.algorithmSeed, tier + 3000) * itemsToSelect.length,
    )
    const selectedItem = itemsToSelect[itemIndex]

    // Marcar como usado
    seasonPool.usedCaseItems.add(selectedItem.id)

    return {
      type: "case_item",
      itemId: selectedItem.id,
      itemData: selectedItem,
      rarity: this.mapRarity(selectedItem.rarity),
      category: "case",
      image: selectedItem.imagem,
      uniqueId: `${seasonPool.seasonId}_${tier}_case_${selectedItem.id}`,
      seasonExclusive: true,
    }
  }

  /**
   * ⭐ Gera recompensa especial
   */
  private static generateSpecialReward(tier: number, seasonPool: SeasonItemPool): BattlePassReward {
    const specialRewards = [
      {
        type: "special" as const,
        amount: tier * 50,
        rarity: "rare" as const,
        category: "store" as const,
        image: "/icons/special/special_chest.png",
        itemData: { name: "🎁 Baú Especial", description: "Contém itens interessantes" },
      },
      {
        type: "tokens" as const,
        amount: Math.max(1, Math.floor(tier / 10) + 2), // Ainda mais reduzido
        rarity: "rare" as const,
        category: "currency" as const,
        image: "/icons/market/sadasjdub.webp",
        itemData: { name: "🎫 Tokens Especiais", description: "Tokens premium em quantidade limitada" },
      },
    ]

    const rewardIndex = Math.floor(
      this.generateSeededRandom(seasonPool.algorithmSeed, tier + 4000) * specialRewards.length,
    )
    const baseReward = specialRewards[rewardIndex]

    return {
      ...baseReward,
      uniqueId: `${seasonPool.seasonId}_${tier}_special_${rewardIndex}`,
      seasonExclusive: true,
    }
  }

  // 🔧 FUNÇÕES AUXILIARES

  private static getAllCaseItems(): any[] {
    const allItems: any[] = []
    Object.values(containerItems).forEach((containerItems) => {
      allItems.push(...containerItems)
    })
    return allItems
  }

  private static generateAlgorithmSeed(seasonId: string): string {
    return `${seasonId}_${Date.now()}_jackpot_algorithm`
  }

  private static deterministicShuffle<T>(array: T[], seed: string): T[] {
    const shuffled = [...array]
    const seedNum = this.hashString(seed)

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.generateSeededRandom(seed, i) * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
  }

  private static generateSeededRandom(seed: string, salt: number): number {
    const combinedSeed = this.hashString(seed + salt.toString())
    const a = 1664525
    const c = 1013904223
    const m = Math.pow(2, 32)
    return Math.abs(((a * combinedSeed + c) % m) / m)
  }

  private static hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  private static calculateDynamicAmount(tier: number, type: string, isPremium: boolean): number {
    const baseValues = {
      bits: { min: 100, max: 1600 }, // Reduzido em 80%
      coins: { min: 320, max: 6000 }, // Reduzido em 60%
      tokens: { min: 1, max: 8 }, // MUITO reduzido: tokens são valiosos!
    }

    const base = baseValues[type as keyof typeof baseValues] || baseValues.coins
    const tierMultiplier = Math.log(tier + 1) * 0.4 + 1
    const premiumMultiplier = isPremium ? 1.5 : 0.4 // Premium ganha 50% mais, free ganha 60% menos

    const scaledValue = base.min + (base.max - base.min) * (tier / 100) * tierMultiplier * premiumMultiplier

    // Variação aleatória
    const variation = 0.85 + Math.random() * 0.3

    return Math.floor(scaledValue * variation)
  }

  private static determineRarity(tier: number): "common" | "rare" | "epic" | "legendary" {
    if (tier >= 75) return "rare" // Removido legendary
    if (tier >= 50) return "rare" // Removido epic
    if (tier >= 25) return "rare"
    return "common"
  }

  private static mapPriceToRarity(price: number): "common" | "rare" | "epic" | "legendary" {
    if (price >= 1000000) return "rare" // Removido legendary
    if (price >= 100000) return "rare" // Removido epic
    if (price >= 10000) return "rare"
    return "common"
  }

  private static mapRarity(gameRarity: string): "common" | "rare" | "epic" | "legendary" {
    switch (gameRarity) {
      case "comum":
        return "common"
      case "raro":
        return "rare"
      case "epico":
        return "rare" // Convertido para rare
      case "lendário":
        return "rare" // Convertido para rare
      default:
        return "common"
    }
  }

  private static getRarityFilterForTier(tier: number): ("common" | "rare" | "epic" | "legendary")[] {
    if (tier >= 75) return ["rare", "common"]
    if (tier >= 50) return ["rare", "common"]
    if (tier >= 25) return ["rare", "common"]
    return ["common"]
  }
}
