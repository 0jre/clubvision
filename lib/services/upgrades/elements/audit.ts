import { dbConnect } from "@/core/integration/connect"

export class AuditLogger {
  private static instance: AuditLogger

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  async logUpgradeAttempt(userId: string, request: any, result: any, metadata: any = {}): Promise<void> {
    try {
      const { db } = await dbConnect()

      const auditLog = {
        userId,
        action: "UPGRADE_ATTEMPT",
        timestamp: new Date(),
        request: {
          targetItem: request.itemsA,
          offeredItems: request.itemsB,
          totalOfferedValue: request.totalOfferedValue,
        },
        result: {
          success: result.success,
          probability: result.probability,
          actualOutcome: result.actualOutcome,
          error: result.error,
        },
        metadata: {
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
          sessionId: metadata.sessionId,
          riskScore: this.calculateRiskScore(request, result),
        },
        systemInfo: {
          serverTime: new Date(),
          version: process.env.APP_VERSION || "1.0.0",
          environment: process.env.NODE_ENV || "development",
        },
      }

      await db.collection("audit_logs").insertOne(auditLog)

      // Log crítico para upgrades de alto valor
      if (request.totalOfferedValue > 10000) {
        await this.logHighValueTransaction(auditLog)
      }
    } catch (error) {
      console.error("Erro ao registrar log de auditoria:", error)
      // Não falhar a operação principal por erro de log
    }
  }

  async logSecurityEvent(userId: string, eventType: string, details: any): Promise<void> {
    try {
      const { db } = await dbConnect()

      await db.collection("security_logs").insertOne({
        userId,
        eventType,
        details,
        timestamp: new Date(),
        severity: this.getEventSeverity(eventType),
        investigated: false,
      })

      // Alertar para eventos críticos
      if (this.getEventSeverity(eventType) === "CRITICAL") {
        await this.triggerSecurityAlert(userId, eventType, details)
      }
    } catch (error) {
      console.error("Erro ao registrar evento de segurança:", error)
    }
  }

  private calculateRiskScore(request: any, result: any): number {
    let score = 0

    // Valor da transação
    if (request.totalOfferedValue > 50000) score += 30
    else if (request.totalOfferedValue > 10000) score += 20
    else if (request.totalOfferedValue > 1000) score += 10

    // Probabilidade vs resultado
    if (result.success && result.probability < 10) score += 40 // Sorte extrema
    if (!result.success && result.probability > 90) score += 20 // Azar extremo

    // Padrões suspeitos
    if (request.itemsB.length > 20) score += 15 // Muitos itens

    return Math.min(100, score)
  }

  private async logHighValueTransaction(auditLog: any): Promise<void> {
    const { db } = await dbConnect()

    await db.collection("high_value_transactions").insertOne({
      ...auditLog,
      flagged: true,
      reviewRequired: true,
      reviewedBy: null,
      reviewedAt: null,
    })
  }

  private getEventSeverity(eventType: string): string {
    const severityMap: { [key: string]: string } = {
      FRAUD_DETECTED: "CRITICAL",
      RATE_LIMIT_EXCEEDED: "HIGH",
      SUSPICIOUS_PATTERN: "MEDIUM",
      INVALID_REQUEST: "LOW",
    }

    return severityMap[eventType] || "LOW"
  }

  private async triggerSecurityAlert(userId: string, eventType: string, details: any): Promise<void> {
    // Implementar sistema de alertas (email, Slack, etc.)
    console.warn(`ALERTA DE SEGURANÇA: ${eventType} para usuário ${userId}`, details)
  }
}
