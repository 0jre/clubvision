export interface SecurityConfig {
  rateLimit: {
    windowMs: number
    maxRequests: number
    adaptiveThreshold: boolean
    burstProtection: boolean
  }
  ddosProtection: {
    enabled: boolean
    threshold: number
    blockDuration: number
    adaptiveBlocking: boolean
  }
  injection: {
    strictMode: boolean
    deepScan: boolean
    aiDetection: boolean
  }
  encryption: {
    algorithm: string
    keyRotationInterval: number
    saltRounds: number
  }
  monitoring: {
    realTimeAlerts: boolean
    anomalyDetection: boolean
    behavioralAnalysis: boolean
  }
}

export interface SecurityThreat {
  id: string
  type: ThreatType
  severity: ThreatSeverity
  source: string
  timestamp: number
  details: any
  blocked: boolean
  confidence: number
  
}

export interface SecurityMetrics {
  totalRequests: number
  blockedRequests: number
  suspiciousActivity: number
  activeThreats: number
  falsePositives: number
  responseTime: number
  threatsByType: Record<ThreatType, number>
}

export interface UserBehavior {
  userId: string
  ipAddress: string
  userAgent: string
  requestPattern: RequestPattern[]
  riskScore: number
  lastActivity: number
  anomalyFlags: string[]
}

export interface RequestPattern {
  endpoint: string
  method: string
  timestamp: number
  responseTime: number
  statusCode: number
  dataSize: number
}

export enum ThreatType {
  DDOS = "ddos",
  SQL_INJECTION = "sql_injection",
  NOSQL_INJECTION = "nosql_injection",
  XSS = "xss",
  BRUTE_FORCE = "brute_force",
  RATE_LIMIT_EXCEEDED = "rate_limit_exceeded",
  SUSPICIOUS_BEHAVIOR = "suspicious_behavior",
  BOT_ATTACK = "bot_attack",
  DATA_EXFILTRATION = "data_exfiltration",
  PRIVILEGE_ESCALATION = "privilege_escalation",
}

export enum ThreatSeverity {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
  EXTREME = 5,
}

export interface SecurityRule {
  id: string
  name: string
  type: ThreatType
  pattern: string | RegExp
  action: SecurityAction
  enabled: boolean
  confidence: number
}

export enum SecurityAction {
  LOG = "log",
  WARN = "warn",
  BLOCK = "block",
  QUARANTINE = "quarantine",
  HONEYPOT = "honeypot",
}
