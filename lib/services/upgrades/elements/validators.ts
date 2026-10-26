import { dbConnect } from "@/core/integration/connect"

export interface UpgradeValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}

export class UpgradeValidator {
  private static instance: UpgradeValidator
  private cache = new Map<string, any>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutos

  static getInstance(): UpgradeValidator {
    if (!UpgradeValidator.instance) {
      UpgradeValidator.instance = new UpgradeValidator()
    }
    return UpgradeValidator.instance
  }

  

  async validateUpgradeRequest(userId: string, request: any): Promise<UpgradeValidation> {
    const errors: string[] = []
    const warnings: string[] = []
    let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW"

    try {
      // Validação básica de estrutura
      if (!request.itemsA || !request.itemsB) {
        errors.push("Estrutura de requisição inválida")
        return { isValid: false, errors, warnings, riskLevel: "CRITICAL" }
      }

      // Validação de rate limiting
      const rateLimitCheck = await this.checkRateLimit(userId)
      if (!rateLimitCheck.allowed) {
        errors.push(`Rate limit excedido. Tente novamente em ${rateLimitCheck.resetTime} segundos`)
        riskLevel = "HIGH"
      }

      // Validação de cooldown
      const cooldownCheck = await this.checkCooldown(userId)
      if (!cooldownCheck.allowed) {
        errors.push(`Cooldown ativo. Próximo upgrade disponível em ${cooldownCheck.remainingTime} segundos`)
        riskLevel = "MEDIUM"
      }

      // Validação de propriedade dos itens
      const ownershipCheck = await this.validateItemOwnership(userId, request.itemsB)
      if (!ownershipCheck.isValid) {
        errors.push("Usuário não possui todos os itens oferecidos")
        riskLevel = "CRITICAL"
      }

      // Validação de disponibilidade do item alvo
      const targetItemCheck = await this.validateTargetItem(request.itemsA)
      if (!targetItemCheck.isValid) {
        errors.push("Item alvo não está disponível para upgrade")
        riskLevel = "HIGH"
      }

      // Validação de valor mínimo
      const valueCheck = await this.validateMinimumValue(request.itemsB)
      if (!valueCheck.isValid) {
        warnings.push("Valor total dos itens oferecidos é muito baixo")
        if (riskLevel === "LOW") riskLevel = "MEDIUM"
      }

      // Validação anti-fraude
      const fraudCheck = await this.detectFraudulentActivity(userId, request)
      if (fraudCheck.suspicious) {
        errors.push("Atividade suspeita detectada")
        riskLevel = "CRITICAL"
      }

      // Validação de mercado
      const marketCheck = await this.validateMarketConditions(request)
      if (!marketCheck.isValid) {
        warnings.push("Condições de mercado desfavoráveis detectadas")
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        riskLevel,
      }
    } catch (error) {
      console.error("Erro na validação:", error)
      return {
        isValid: false,
        errors: ["Erro interno na validação"],
        warnings: [],
        riskLevel: "CRITICAL",
      }
    }
  }

  private async checkRateLimit(userId: string): Promise<{ allowed: boolean; resetTime?: number }> {
    const { db } = await dbConnect()
    const now = new Date()
    const oneHour = 60 * 60 * 1000

    const rateLimitRecord = await db.collection("rate_limits").findOne({
      userId,
      type: "upgrade",
      timestamp: { $gte: new Date(now.getTime() - oneHour) },
    })

    if (!rateLimitRecord) {
      await db.collection("rate_limits").insertOne({
        userId,
        type: "upgrade",
        count: 1,
        timestamp: now,
      })
      return { allowed: true }
    }

    const maxUpgrades = await this.getUserUpgradeLimit(userId)
    if (rateLimitRecord.count >= maxUpgrades) {
      const resetTime = Math.ceil((rateLimitRecord.timestamp.getTime() + oneHour - now.getTime()) / 1000)
      return { allowed: false, resetTime }
    }

    await db.collection("rate_limits").updateOne({ _id: rateLimitRecord._id }, { $inc: { count: 1 } })

    return { allowed: true }
  }

  private async checkCooldown(userId: string): Promise<{ allowed: boolean; remainingTime?: number }> {
    const { db } = await dbConnect()
    const lastUpgrade = await db.collection("upgrades").findOne({ userId }, { sort: { timestamp: -1 } })

    if (!lastUpgrade) return { allowed: true }

    const cooldownPeriod = await this.getUserCooldownPeriod(userId)
    const timeSinceLastUpgrade = Date.now() - lastUpgrade.timestamp.getTime()

    if (timeSinceLastUpgrade < cooldownPeriod) {
      const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastUpgrade) / 1000)
      return { allowed: false, remainingTime }
    }

    return { allowed: true }
  }

 private async validateItemOwnership(userId: string, items: any[]): Promise<{ isValid: boolean }> {
  const { db } = await dbConnect();
  const inventory = await db.collection("inventory").findOne({ userId });

  if (!inventory || !inventory.mytvls) {
    return { isValid: false };
  }

  const userItemUids = inventory.mytvls.map((item: any) => item.uid);
  const requestedUids = items.map((item) => item.uid);

  // Checa se todos os itens estão no inventário
  const allOwned = requestedUids.every((uid) => userItemUids.includes(uid));
  if (!allOwned) return { isValid: false };

  // Checa se todos os itens estão disponíveis para upgrade (advertised: true)
  const itemDocs = await db.collection("tvl-novision").find({ tokenID: { $in: requestedUids } }).toArray();
const allAvailable = requestedUids.every((uid) => {
  const doc = itemDocs.find((item) => item.tokenID === uid);
  // O item só pode ser usado se o userId for igual ao userId do usuário e NÃO começar com "advertised-"
  return doc && doc.userId === userId && !String(doc.userId).startsWith("advertised-");
});

  return { isValid: allAvailable };
}

  private async validateTargetItem(targetItem: any): Promise<{ isValid: boolean }> {
    const { db } = await dbConnect()
    const item = await db.collection("tvl-novision").findOne({
      tokenID: targetItem.uid,
      advertised: true,
    })

    return { isValid: !!item }
  }

  private async validateMinimumValue(items: any[]): Promise<{ isValid: boolean }> {
    const { db } = await dbConnect()
    const itemRecords = await db
      .collection("tvl-novision")
      .find({
        tokenID: { $in: items.map((item) => item.uid) },
      })
      .toArray()

    const totalValue = itemRecords.reduce((sum, item) => sum + (item.itemValue || 0), 0)
    const minimumValue = 100 // Valor mínimo configurável

    return { isValid: totalValue >= minimumValue }
  }

  private async detectFraudulentActivity(userId: string, request: any): Promise<{ suspicious: boolean }> {
    const { db } = await dbConnect()

    // Verificar padrões suspeitos
    const recentUpgrades = await db
      .collection("upgrades")
      .find({
        userId,
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      })
      .toArray()

    // Verificar se há muitos upgrades em pouco tempo
    if (recentUpgrades.length > 50) {
      return { suspicious: true }
    }

    // Verificar padrões de valor suspeitos
    const avgValue = recentUpgrades.reduce((sum, upgrade) => sum + upgrade.totalOfferedValue, 0) / recentUpgrades.length
    const currentValue = request.itemsB.reduce((sum: number, item: any) => sum + (item.value || 0), 0)

    if (currentValue > avgValue * 10) {
      return { suspicious: true }
    }

    return { suspicious: false }
  }

  private async validateMarketConditions(request: any): Promise<{ isValid: boolean }> {
    // Implementar validação de condições de mercado
    // Por exemplo, verificar volatilidade, tendências, etc.
    return { isValid: true }
  }

 

  private async getUserUpgradeLimit(userId: string): Promise<number> {
  const { db } = await dbConnect()
  const userProfile = await db.collection("reforms").findOne({ userId })

  // Usuários premium têm limite maior
  if (userProfile?.typeprime == 'Plus') return 200
  if (userProfile?.typeprime == 'Bloom') return 50
  return 20 // Limite padrão de 20 upgrades por hora
}

  private async getUserCooldownPeriod(userId: string): Promise<number> {
    const { db } = await dbConnect()
    const userProfile = await db.collection("reforms").findOne({ userId })

    // Usuários premium têm cooldown menor
    if (userProfile?.typeprime == 'Plus') return 0 // 0 segundos
    if (userProfile?.typeprime == 'Bloom') return 60 * 1000 // 1 minuto
    return 5 * 60 * 1000 // 5 minutos padrão
  }
}
