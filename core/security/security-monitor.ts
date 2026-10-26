import { type SecurityThreat, type SecurityMetrics, ThreatType, ThreatSeverity } from "../types/security"
import { NoSQLInjectionDetector } from "./nosql-injection-detector"
import { DDoSProtectionSystem } from "./ddos-protection"
import { AdvancedEncryptionManager } from "./encryption"
import crypto from "crypto"

export class SecurityMonitor {
  private static instance: SecurityMonitor
  private threats: Map<string, SecurityThreat>
  private metrics: SecurityMetrics
  private alertCallbacks: ((threat: SecurityThreat) => void)[]
  private injectionDetector: NoSQLInjectionDetector
  private ddosProtection: DDoSProtectionSystem
  private encryption: AdvancedEncryptionManager
  private honeypots: Set<string>
  private securityRules: Map<string, any>

  private constructor() {
    this.threats = new Map()
    this.alertCallbacks = []
    this.honeypots = new Set()
    this.securityRules = new Map()

    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      suspiciousActivity: 0,
      activeThreats: 0,
      falsePositives: 0,
      responseTime: 0,
      threatsByType: {} as Record<ThreatType, number>,
    }

    this.injectionDetector = NoSQLInjectionDetector.getInstance()
    this.ddosProtection = DDoSProtectionSystem.getInstance()
    this.encryption = AdvancedEncryptionManager.getInstance()

    this.initializeHoneypots()
    this.startThreatCleanup()
  }

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor()
    }
    return SecurityMonitor.instance
  }

  async analyzeRequest(context: {
    ip: string
    userAgent: string
    method: string
    path: string
    query: any
    headers: Record<string, string>
    body?: any
    timestamp: number
    userId?: string
  }): Promise<{
    allowed: boolean
    threats: SecurityThreat[]
    sanitizedQuery?: any
  }> {
    const startTime = Date.now()
    const threats: SecurityThreat[] = []
    let allowed = true

    this.metrics.totalRequests++

    try {
      // 1. Check honeypots
      if (this.isHoneypotAccess(context.path)) {
        const honeypotThreat: SecurityThreat = {
          id: crypto.randomUUID(),
          type: ThreatType.SUSPICIOUS_BEHAVIOR,
          severity: ThreatSeverity.HIGH,
          source: context.ip,
          timestamp: Date.now(),
          details: {
            reason: "Honeypot access detected",
            path: context.path,
            method: "honeypot_detection",
          },
          blocked: true,
          confidence: 1.0,
        }
        threats.push(honeypotThreat)
        allowed = false
      }

      // 2. DDoS Protection Analysis
      const ddosThreat = await this.ddosProtection.analyzeRequest({
        ip: context.ip,
        userAgent: context.userAgent,
        method: context.method,
        path: context.path,
        headers: context.headers,
        timestamp: context.timestamp,
      })

      if (ddosThreat) {
        threats.push(ddosThreat)
        if (ddosThreat.blocked) allowed = false
      }

      // 3. NoSQL Injection Analysis
      if (context.query) {
        const injectionThreat = await this.injectionDetector.analyzeQuery(context.query, {
          ip: context.ip,
          userId: context.userId,
          userAgent: context.userAgent,
        })

        if (injectionThreat) {
          threats.push(injectionThreat)
          if (injectionThreat.blocked) allowed = false
        }
      }

      // 4. Advanced Threat Detection
      const advancedThreats = await this.performAdvancedAnalysis(context)
      threats.push(...advancedThreats)

      // 5. Update metrics and store threats
      threats.forEach((threat) => {
        this.recordThreat(threat)
        if (threat.blocked) {
          this.metrics.blockedRequests++
          allowed = false
        }
      })

      // 6. Sanitize query if needed
      let sanitizedQuery = context.query
      if (context.query && !allowed) {
        sanitizedQuery = this.injectionDetector.sanitizeQuery(context.query)
      }

      this.metrics.responseTime = Date.now() - startTime

      return {
        allowed,
        threats,
        sanitizedQuery,
      }
    } catch (error: any) {
      console.error("Security analysis error:", error)
      return {
        allowed: false,
        threats: [
          {
            id: crypto.randomUUID(),
            type: ThreatType.SUSPICIOUS_BEHAVIOR,
            severity: ThreatSeverity.MEDIUM,
            source: context.ip,
            timestamp: Date.now(),
            details: { error: error.message, method: "analysis_error" },
            blocked: true,
            confidence: 0.5,
          },
        ],
      }
    }
  }

  private async performAdvancedAnalysis(context: any): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = []

    // XSS Detection
    const xssThreat = this.detectXSS(context)
    if (xssThreat) threats.push(xssThreat)

    // CSRF Detection
    const csrfThreat = this.detectCSRF(context)
    if (csrfThreat) threats.push(csrfThreat)

    // Path Traversal Detection
    const pathThreat = this.detectPathTraversal(context)
    if (pathThreat) threats.push(pathThreat)

    // Command Injection Detection
    const cmdThreat = this.detectCommandInjection(context)
    if (cmdThreat) threats.push(cmdThreat)

    // Data Exfiltration Detection
    const exfilThreat = this.detectDataExfiltration(context)
    if (exfilThreat) threats.push(exfilThreat)

    return threats
  }

  private detectXSS(context: any): SecurityThreat | null {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
      /<svg[^>]*>/gi,
      /<math[^>]*>/gi,
      /&#x/gi,
      /&#\d+/gi,
      /\\u[0-9a-fA-F]{4}/gi,
    ]

    const payload =
      JSON.stringify(context.body || "") + context.path + (context.query ? JSON.stringify(context.query) : "")

    for (const pattern of xssPatterns) {
      if (pattern.test(payload)) {
        return {
          id: crypto.randomUUID(),
          type: ThreatType.XSS,
          severity: ThreatSeverity.HIGH,
          source: context.ip,
          timestamp: Date.now(),
          details: {
            pattern: pattern.toString(),
            payload: payload.substring(0, 200),
            method: "xss_detection",
          },
          blocked: true,
          confidence: 0.9,
        }
      }
    }

    return null
  }

  private detectCSRF(context: any): SecurityThreat | null {
    const { method, headers, path } = context

    // Check for state-changing operations without proper CSRF protection
    if (["POST", "PUT", "DELETE", "PATCH"].includes(method.toUpperCase())) {
      const csrfToken = headers["x-csrf-token"] || headers["csrf-token"]
      const referer = headers["referer"]
      const origin = headers["origin"]

      const suspiciousIndicators: string[] = []

      if (!csrfToken) {
        suspiciousIndicators.push("Missing CSRF token")
      }

      if (!referer && !origin) {
        suspiciousIndicators.push("Missing referer and origin headers")
      }

      if (referer && !this.isValidReferer(referer)) {
        suspiciousIndicators.push("Suspicious referer header")
      }

      if (suspiciousIndicators.length >= 2) {
        return {
          id: crypto.randomUUID(),
          type: ThreatType.SUSPICIOUS_BEHAVIOR,
          severity: ThreatSeverity.MEDIUM,
          source: context.ip,
          timestamp: Date.now(),
          details: {
            indicators: suspiciousIndicators,
            method,
            path,
            method1: "csrf_detection",
          },
          blocked: false,
          confidence: 0.6,
        }
      }
    }

    return null
  }

  private detectPathTraversal(context: any): SecurityThreat | null {
    const pathTraversalPatterns = [
      /\.\.\//,
      /\.\.\\/,
      /%2e%2e%2f/,
      /%2e%2e%5c/,
      /\.\.%2f/,
      /\.\.%5c/,
      /%252e%252e%252f/,
      /\.\.\x2f/,
      /\.\.\x5c/,
    ]

    const testString = context.path + JSON.stringify(context.query || {}) + JSON.stringify(context.body || {})

    for (const pattern of pathTraversalPatterns) {
      if (pattern.test(testString)) {
        return {
          id: crypto.randomUUID(),
          type: ThreatType.SUSPICIOUS_BEHAVIOR,
          severity: ThreatSeverity.HIGH,
          source: context.ip,
          timestamp: Date.now(),
          details: {
            pattern: pattern.toString(),
            detectedIn: testString.substring(0, 200),
            method: "path_traversal_detection",
          },
          blocked: true,
          confidence: 0.95,
        }
      }
    }

    return null
  }

  private detectCommandInjection(context: any): SecurityThreat | null {
    const cmdInjectionPatterns = [
      /;\s*(rm|del|format|shutdown|reboot)/,
      /\|\s*(cat|type|more|less)/,
      /`[^`]*`/,
      /\$$$[^)]*$$/,
      /&&\s*(rm|del|format)/,
      /\|\|\s*(rm|del|format)/,
      />\s*\/dev\/null/,
      /2>&1/,
      /\/bin\/(sh|bash|csh|tcsh|zsh)/,
      /cmd\.exe/,
      /powershell/,
      /wget\s+http/,
      /curl\s+http/,
    ]

    const payload = JSON.stringify(context.body || "") + JSON.stringify(context.query || {})

    for (const pattern of cmdInjectionPatterns) {
      if (pattern.test(payload)) {
        return {
          id: crypto.randomUUID(),
          type: ThreatType.SUSPICIOUS_BEHAVIOR,
          severity: ThreatSeverity.CRITICAL,
          source: context.ip,
          timestamp: Date.now(),
          details: {
            pattern: pattern.toString(),
            payload: payload.substring(0, 200),
            method: "command_injection_detection",
          },
          blocked: true,
          confidence: 0.95,
        }
      }
    }

    return null
  }

  private detectDataExfiltration(context: any): SecurityThreat | null {
    const { method, path, query, headers } = context

    const suspiciousIndicators: string[] = []
    let riskScore = 0

    // Large response requests
    if (query && query.limit && Number.parseInt(query.limit) > 10000) {
      suspiciousIndicators.push("Large limit parameter")
      riskScore += 0.3
    }

    // Bulk data access patterns
    if (path.includes("/export") || path.includes("/download") || path.includes("/backup")) {
      suspiciousIndicators.push("Bulk data access endpoint")
      riskScore += 0.2
    }

    // Suspicious user agents for data scraping
    const scrapingAgents = ["scrapy", "beautifulsoup", "selenium", "phantomjs"]
    const userAgent = headers["user-agent"]?.toLowerCase() || ""

    if (scrapingAgents.some((agent) => userAgent.includes(agent))) {
      suspiciousIndicators.push("Data scraping user agent")
      riskScore += 0.4
    }

    // High frequency access to sensitive endpoints
    if (path.includes("/api/users") || path.includes("/api/admin") || path.includes("/api/sensitive")) {
      riskScore += 0.2
    }

    if (riskScore > 0.4) {
      return {
        id: crypto.randomUUID(),
        type: ThreatType.DATA_EXFILTRATION,
        severity: this.calculateSeverityFromScore(riskScore),
        source: context.ip,
        timestamp: Date.now(),
        details: {
          indicators: suspiciousIndicators,
          riskScore,
          path,
          method: "data_exfiltration_detection",
        },
        blocked: riskScore > 0.7,
        confidence: riskScore,
      }
    }

    return null
  }

  private calculateSeverityFromScore(score: number): ThreatSeverity {
    if (score >= 0.9) return ThreatSeverity.EXTREME
    if (score >= 0.7) return ThreatSeverity.CRITICAL
    if (score >= 0.5) return ThreatSeverity.HIGH
    if (score >= 0.3) return ThreatSeverity.MEDIUM
    return ThreatSeverity.LOW
  }

  private isValidReferer(referer: string): boolean {
    try {
      const url = new URL(referer)
      const allowedDomains = process.env.ALLOWED_DOMAINS?.split(",") || ["localhost"]
      return allowedDomains.some((domain) => url.hostname.includes(domain))
    } catch {
      return false
    }
  }

  private initializeHoneypots(): void {
    // Common honeypot paths that attackers might try
    const honeypotPaths = [
      "/admin",
      "/wp-admin",
      "/phpmyadmin",
      "/.env",
      "/config.php",
      "/backup",
      "/test",
      "/debug",
      "/api/v1/admin",
      "/api/internal",
      "/.git",
      "/robots.txt",
      "/sitemap.xml",
    ]

    honeypotPaths.forEach((path) => this.honeypots.add(path))
  }

  private isHoneypotAccess(path: string): boolean {
    return this.honeypots.has(path) || this.honeypots.has(path.toLowerCase())
  }

  private recordThreat(threat: SecurityThreat): void {
    this.threats.set(threat.id, threat)
    this.metrics.activeThreats = this.threats.size

    // Update threat type metrics
    if (!this.metrics.threatsByType[threat.type]) {
      this.metrics.threatsByType[threat.type] = 0
    }
    this.metrics.threatsByType[threat.type]++

    // Trigger alerts for high severity threats
    if (threat.severity >= ThreatSeverity.HIGH) {
      this.triggerAlert(threat)
    }

 
  }

  private triggerAlert(threat: SecurityThreat): void {
    this.alertCallbacks.forEach((callback) => {
      try {
        callback(threat)
      } catch (error) {
        console.error("Alert callback error:", error)
      }
    })
  }

  private startThreatCleanup(): void {
    setInterval(() => {
      this.cleanupOldThreats()
    }, 300000) // Clean up every 5 minutes
  }

  private cleanupOldThreats(): void {
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    const threatsToDelete: string[] = []

    for (const [id, threat] of this.threats) {
      if (now - threat.timestamp > maxAge) {
        threatsToDelete.push(id)
      }
    }

    threatsToDelete.forEach((id) => this.threats.delete(id))
    this.metrics.activeThreats = this.threats.size


  }

  // Public API methods
  onThreatDetected(callback: (threat: SecurityThreat) => void): void {
    this.alertCallbacks.push(callback)
  }

  getMetrics(): SecurityMetrics {
    return { ...this.metrics }
  }

  getActiveThreats(): SecurityThreat[] {
    return Array.from(this.threats.values())
  }

  getThreatsByType(type: ThreatType): SecurityThreat[] {
    return Array.from(this.threats.values()).filter((threat) => threat.type === type)
  }

  getThreatsBySeverity(severity: ThreatSeverity): SecurityThreat[] {
    return Array.from(this.threats.values()).filter((threat) => threat.severity >= severity)
  }

  blockIP(ip: string, duration = 3600000): void {
    this.ddosProtection.addToBlacklist(ip)
  }

  unblockIP(ip: string): void {
    this.ddosProtection.removeFromBlacklist(ip)
  }

  addHoneypot(path: string): void {
    this.honeypots.add(path)
  }

  removeHoneypot(path: string): void {
    this.honeypots.delete(path)
  }

  generateSecurityReport(): {
    summary: any
    topThreats: SecurityThreat[]
    recommendations: string[]
  } {
    const threats = Array.from(this.threats.values())
    const topThreats = threats.sort((a, b) => b.severity - a.severity).slice(0, 10)

    const threatsByType = threats.reduce(
      (acc, threat) => {
        acc[threat.type] = (acc[threat.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const recommendations: string[] = []

    if (this.metrics.blockedRequests / this.metrics.totalRequests > 0.1) {
      recommendations.push("High block rate detected - review security rules")
    }

    if (threatsByType[ThreatType.DDOS] > 10) {
      recommendations.push("Consider implementing additional DDoS protection")
    }

    if (threatsByType[ThreatType.NOSQL_INJECTION] > 5) {
      recommendations.push("Review input validation and sanitization")
    }

    return {
      summary: {
        totalThreats: threats.length,
        blockedRequests: this.metrics.blockedRequests,
        hitRatio:
          this.metrics.totalRequests > 0
            ? (this.metrics.totalRequests - this.metrics.blockedRequests) / this.metrics.totalRequests
            : 1,
        threatsByType,
        averageResponseTime: this.metrics.responseTime,
      },
      topThreats,
      recommendations,
    }
  }
}
