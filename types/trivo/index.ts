export interface UpgradeRequest {
  itemsA: {
    uid: string
    id: number
  }
  itemsB: Array<{
    uid: string
    id: number
  }>
}

export interface UpgradeValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}

export interface UpgradeCalculation {
  baseSuccessRate: number
  adjustedSuccessRate: number
  valueRatio: number
  marketTrend: number
  userBonus: number
  finalProbability: number
  expectedValue: number
  riskAssessment: string
}

export interface AuditLog {
  userId: string
  action: string
  timestamp: Date
  details: any
  ipAddress?: string
  userAgent?: string
  riskScore: number
}
