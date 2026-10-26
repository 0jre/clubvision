import { dbConnect } from "@/core/integration/connect"

export interface UpgradeCalculation {
  baseSuccessRate: number
  adjustedSuccessRate: number
  valueRatio: number
  marketTrend: number
  userBonus: number
  positionFactor: number // Novo campo para o fator de posição
  finalProbability: number
  expectedValue: number
  riskAssessment: string
}

export class UpgradeCalculator {
  private static instance: UpgradeCalculator
  private marketCache = new Map<string, any>()

  static getInstance(): UpgradeCalculator {
    if (!UpgradeCalculator.instance) {
      UpgradeCalculator.instance = new UpgradeCalculator()
    }
    return UpgradeCalculator.instance
  }

  async calculateUpgradeProbability(
    userId: string,
    targetItem: any,
    offeredItems: any[],
    position = 0, // Novo parâmetro para posição
  ): Promise<UpgradeCalculation> {
    try {
      // Calcular valor base
      const targetValue = await this.getAdjustedItemValue(targetItem)
      const totalOfferedValue = await this.getTotalAdjustedValue(offeredItems)
      console.log("VALORES DEBUG => Oferecido:", totalOfferedValue, "Desejado:", targetValue)

      // Calcular taxa base de sucesso
      const baseSuccessRate = this.calculateBaseSuccessRate(totalOfferedValue, targetValue)

      // Aplicar modificadores
      const marketTrend = await this.getMarketTrendModifier(targetItem)
      const userBonus = await this.getUserBonusModifier(userId)
      const volatilityPenalty = await this.getVolatilityPenalty(targetItem)
      const rarityBonus = this.getRarityBonus(targetItem)

      // NOVO: Calcular fator de posição
      const positionFactor = this.calculatePositionFactor(position, totalOfferedValue, targetValue)

      // Calcular probabilidade final
      let adjustedSuccessRate = baseSuccessRate
      adjustedSuccessRate *= 1 + marketTrend
      adjustedSuccessRate *= 1 + userBonus
      adjustedSuccessRate *= 1 - volatilityPenalty
      adjustedSuccessRate *= 1 + rarityBonus

      // NOVO: Aplicar o fator de posição
      const finalProbability = Math.max(1, Math.min(100, adjustedSuccessRate + positionFactor))

      // Calcular valor esperado
      const expectedValue = (finalProbability / 100) * targetValue

      // Avaliação de risco (agora considera a posição)
      const riskAssessment = this.assessRisk(finalProbability, totalOfferedValue, targetValue, positionFactor)

      return {
        baseSuccessRate,
        adjustedSuccessRate,
        valueRatio: totalOfferedValue / targetValue,
        marketTrend,
        userBonus,
        positionFactor, // Incluir no retorno
        finalProbability,
        expectedValue,
        riskAssessment,
      }
    } catch (error) {
      console.error("Erro no cálculo de probabilidade:", error)
      throw new Error("Falha no cálculo de probabilidade")
    }
  }

  // NOVO: Método para calcular o fator de posição
  private calculatePositionFactor(position: number, offeredValue: number, targetValue: number): number {
    // Normalizar a posição para radianos
    const positionRadians = (position * Math.PI) / 180

    // Calcular o fator base usando função seno
    const baseFactor = Math.abs(Math.sin(positionRadians))

    // Diferentes posições têm diferentes efeitos baseados na estratégia
    let positionMultiplier = 0

    // Calcular o fator final
    const maxBonus = 15 // Máximo 15% de bônus
    const positionFactor = baseFactor * positionMultiplier * maxBonus

    // Limitar o bônus entre 0 e maxBonus
    return Math.max(0, Math.min(maxBonus, positionFactor))
  }

  // NOVO: Método para obter dica estratégica baseada na posição
  public getPositionStrategy(position: number, valueRatio: number): string {
    switch (position) {
      case 0: // Direita
        return "Estratégia Conservadora: Menor risco, bônus consistente"
      case 90: // Cima
        return valueRatio > 1.2
          ? "Estratégia Agressiva: Ótima para valores altos!"
          : "Estratégia Agressiva: Considere ofertar mais valor"
      case 180: // Esquerda
        return "Estratégia Equilibrada: Bom equilíbrio risco/recompensa"
      case 270: // Baixo
        return valueRatio < 0.8
          ? "Estratégia de Risco: Perfeita para apostas baixas!"
          : "Estratégia de Risco: Melhor com valores menores"
      default:
        return "Estratégia Personalizada: Efeito baseado na posição escolhida"
    }
  }

  private calculateBaseSuccessRate(offeredValue: number, targetValue: number): number {
    const ratio = offeredValue / targetValue

    // Curva logarítmica para probabilidade
    if (ratio < 0.5) return 1 // Muito baixo
    if (ratio < 0.8) return 5 + (ratio - 0.5) * 30 // 5-14%
    if (ratio < 1.0) return 14 + (ratio - 0.8) * 80 // 14-30%
    if (ratio < 1.2) return 30 + (ratio - 1.0) * 100 // 30-50%
    if (ratio < 1.5) return 50 + (ratio - 1.2) * 66.67 // 50-70%
    if (ratio < 2.0) return 70 + (ratio - 1.5) * 40 // 70-90%

    return Math.min(100, 90 + (ratio - 1.0) * 2.5) // Máximo 100%
  }

  private async getAdjustedItemValue(item: any): Promise<number> {
    const { db } = await dbConnect()

    // Buscar histórico de preços
    const priceHistory = await db.collection("tvl-marketprice").findOne({ id: item.id })

    if (!priceHistory || !priceHistory.valueHistory || priceHistory.valueHistory.length === 0) {
      return item.itemValue || 0
    }

    // Usar o valor de mercado mais recente
    const lastEntry = priceHistory.valueHistory[priceHistory.valueHistory.length - 1]
    return lastEntry.newValue
  }

  private async getTotalAdjustedValue(items: any[]): Promise<number> {
    const values = await Promise.all(items.map((item) => this.getAdjustedItemValue(item)))
    return values.reduce((sum, value) => sum + value, 0)
  }

  private async getMarketTrendModifier(item: any): Promise<number> {
    const { db } = await dbConnect()

    // Analisar tendência de mercado dos últimos 30 dias
    const priceHistory = await db.collection("tvl-marketprice").findOne({ id: item.id })

    if (!priceHistory || !priceHistory.valueHistory) {
      return 0 // Neutro
    }

    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentPrices = priceHistory.valueHistory
      .filter((entry: any) => new Date(entry.timestamp) >= monthAgo)
      .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    if (recentPrices.length < 2) {
      return 0
    }

    const firstPrice = recentPrices[0].newValue
    const lastPrice = recentPrices[recentPrices.length - 1].newValue
    const trend = (lastPrice - firstPrice) / firstPrice

    // Tendência positiva aumenta chance, negativa diminui
    return Math.max(-0.2, Math.min(0.2, -trend))
  }

  private async getUserBonusModifier(userId: string): Promise<number> {
    const { db } = await dbConnect()

    // Buscar estatísticas do usuário
    const userStats = await db.collection("user_stats").findOne({ userId })

    if (!userStats) {
      return 0
    }

    let bonus = 0

    // Bônus por upgrades bem-sucedidos
    const successRate = userStats.successfulUpgrades / (userStats.totalUpgrades || 1)
    if (successRate > 0.7) bonus += 0.05 // 5% de bônus

    // Bônus por volume de transações
    if (userStats.totalUpgrades > 100) bonus += 0.03
    if (userStats.totalUpgrades > 500) bonus += 0.02

    // Bônus por tempo de conta
    const accountAge = Date.now() - new Date(userStats.createdAt).getTime()
    const daysOld = accountAge / (24 * 60 * 60 * 1000)
    if (daysOld > 365) bonus += 0.02 // Conta antiga

    return Math.min(0.15, bonus) // Máximo 15% de bônus
  }

  private async getVolatilityPenalty(item: any): Promise<number> {
    const { db } = await dbConnect()

    const priceHistory = await db.collection("tvl-marketprice").findOne({ id: item.id })

    if (!priceHistory || !priceHistory.valueHistory) {
      return 0
    }

    const recentPrices = priceHistory.valueHistory
      .slice(-20) // Últimas 20 entradas
      .map((entry: any) => entry.newValue)

    if (recentPrices.length < 5) {
      return 0
    }

    // Calcular desvio padrão
    const mean = recentPrices.reduce((sum: number, price: number) => sum + price, 0) / recentPrices.length
    const variance =
      recentPrices.reduce((sum: number, price: number) => sum + Math.pow(price - mean, 2), 0) / recentPrices.length
    const stdDev = Math.sqrt(variance)

    // Coeficiente de variação
    const cv = stdDev / mean

    // Penalidade baseada na volatilidade
    return Math.min(0.1, cv * 0.5) // Máximo 10% de penalidade
  }

  private getRarityBonus(item: any): number {
    const rarity = item.rarity?.toLowerCase()

    switch (rarity) {
      case "lendário":
      case "legendary":
        return 0.05 // 5% de bônus
      case "épico":
      case "epic":
        return 0.03 // 3% de bônus
      case "raro":
      case "rare":
        return 0.01 // 1% de bônus
      default:
        return 0
    }
  }

  // ATUALIZADO: Método de avaliação de risco agora considera posição
  private assessRisk(probability: number, offeredValue: number, targetValue: number, positionFactor = 0): string {
    const valueRatio = offeredValue / targetValue
    const hasPositionBonus = positionFactor > 5

    if (probability < 10) {
      return hasPositionBonus
        ? "ALTO RISCO - Probabilidade baixa, mas posição estratégica pode ajudar"
        : "ALTO RISCO - Probabilidade muito baixa"
    }

    if (probability < 30) {
      return hasPositionBonus
        ? "RISCO MODERADO - Posição estratégica melhora suas chances"
        : "RISCO MODERADO - Considere ofertar mais valor"
    }

    if (probability < 50) {
      return hasPositionBonus
        ? "RISCO EQUILIBRADO - Boa estratégia de posição!"
        : "RISCO EQUILIBRADO - Boa oportunidade"
    }

    if (probability < 70) {
      return hasPositionBonus
        ? "BAIXO RISCO - Excelente combinação de valor e posição"
        : "BAIXO RISCO - Alta probabilidade de sucesso"
    }

    return hasPositionBonus ? "MUITO BAIXO RISCO - Estratégia perfeita!" : "MUITO BAIXO RISCO - Excelente oportunidade"
  }
}
