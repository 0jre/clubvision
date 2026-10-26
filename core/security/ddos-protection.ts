import { ThreatType, ThreatSeverity, type SecurityThreat } from "../types/security"
import crypto from "crypto"

interface RateLimitEntry {
  count: number
  firstRequest: number
  lastRequest: number
  blocked: boolean
  blockExpiry: number
}

interface AdaptiveThreshold {
  baseThreshold: number
  currentThreshold: number
  adaptationFactor: number
  lastAdjustment: number
}

export class DDoSProtectionSystem {
  private static instance: DDoSProtectionSystem
  private rateLimitMap: Map<string, RateLimitEntry>
  private adaptiveThresholds: Map<string, AdaptiveThreshold>
  private suspiciousIPs: Set<string>
  private whitelistedIPs: Set<string>
  private blacklistedIPs: Set<string>
  private requestPatterns: Map<string, number[]>
  private geoLocationCache: Map<string, string>
  private botDetectionSignatures: RegExp[]

  private constructor() {
    this.rateLimitMap = new Map()
    this.adaptiveThresholds = new Map()
    this.suspiciousIPs = new Set()
    this.whitelistedIPs = new Set()
    this.blacklistedIPs = new Set()
    this.requestPatterns = new Map()
    this.geoLocationCache = new Map()

    this.botDetectionSignatures = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /go-http-client/i,
      /okhttp/i,
      /apache-httpclient/i,
      /node-fetch/i,
      /axios/i,
      /postman/i,
      /insomnia/i,
      /httpie/i,
    ]

    this.initializeWhitelist()
    this.startCleanupProcess()
  }

  static getInstance(): DDoSProtectionSystem {
    if (!DDoSProtectionSystem.instance) {
      DDoSProtectionSystem.instance = new DDoSProtectionSystem()
    }
    return DDoSProtectionSystem.instance
  }

  private initializeWhitelist(): void {
    // Add known good IPs (CDNs, monitoring services, etc.)
    const trustedIPs = [
      "127.0.0.1",
      "::1",
      // Add your trusted IPs here
    ]

    trustedIPs.forEach((ip) => this.whitelistedIPs.add(ip))
  }

  async analyzeRequest(context: {
    ip: string
    userAgent: string
    method: string
    path: string
    headers: Record<string, string>
    timestamp: number
    responseTime?: number
  }): Promise<SecurityThreat | null> {
    const { ip, userAgent, method, path, headers, timestamp } = context

    // Skip analysis for whitelisted IPs
    if (this.whitelistedIPs.has(ip)) {
      return null
    }

    // Immediate block for blacklisted IPs
    if (this.blacklistedIPs.has(ip)) {
      return this.createThreat(ThreatType.DDOS, ThreatSeverity.EXTREME, ip, {
        reason: "Blacklisted IP",
        method: "blacklist_check",
      })
    }

    const threats: SecurityThreat[] = []

    // 1. Rate limiting analysis
    const rateLimitThreat = this.analyzeRateLimit(ip, timestamp)
    if (rateLimitThreat) threats.push(rateLimitThreat)

    // 2. Bot detection
    const botThreat = this.detectBot(userAgent, headers, ip)
    if (botThreat) threats.push(botThreat)

    // 3. Request pattern analysis
    const patternThreat = this.analyzeRequestPattern(ip, method, path, timestamp)
    if (patternThreat) threats.push(patternThreat)

    // 4. Burst detection
    const burstThreat = this.detectBurst(ip, timestamp)
    if (burstThreat) threats.push(burstThreat)

    // 5. Distributed attack detection
    const distributedThreat = this.detectDistributedAttack(ip, timestamp)
    if (distributedThreat) threats.push(distributedThreat)

    // 6. Slowloris detection
    const slowlorisThreat = this.detectSlowloris(ip, context)
    if (slowlorisThreat) threats.push(slowlorisThreat)

    // 7. HTTP flood detection
    const httpFloodThreat = this.detectHttpFlood(ip, method, timestamp)
    if (httpFloodThreat) threats.push(httpFloodThreat)

    // Return the highest severity threat
    if (threats.length > 0) {
      const highestThreat = threats.reduce((highest, current) =>
        current.severity > highest.severity ? current : highest,
      )

      // Auto-block high severity threats
      if (highestThreat.severity >= ThreatSeverity.HIGH) {
        this.blockIP(ip, this.calculateBlockDuration(highestThreat.severity))
      }

      return highestThreat
    }

    return null
  }

  private analyzeRateLimit(ip: string, timestamp: number): SecurityThreat | null {
    const windowMs = 60000 // 1 minute window
    const entry = this.rateLimitMap.get(ip)

    if (!entry) {
      this.rateLimitMap.set(ip, {
        count: 1,
        firstRequest: timestamp,
        lastRequest: timestamp,
        blocked: false,
        blockExpiry: 0,
      })
      return null
    }

    // Check if IP is currently blocked
    if (entry.blocked && timestamp < entry.blockExpiry) {
      return this.createThreat(ThreatType.RATE_LIMIT_EXCEEDED, ThreatSeverity.HIGH, ip, {
        reason: "IP currently blocked",
        blockExpiry: entry.blockExpiry,
        method: "rate_limit_block",
      })
    }

    // Reset window if expired
    if (timestamp - entry.firstRequest > windowMs) {
      entry.count = 1
      entry.firstRequest = timestamp
      entry.blocked = false
    } else {
      entry.count++
    }

    entry.lastRequest = timestamp

    // Get adaptive threshold for this IP
    const threshold = this.getAdaptiveThreshold(ip)

    if (entry.count > threshold.currentThreshold) {
      // Adjust threshold based on attack patterns
      this.adjustAdaptiveThreshold(ip, entry.count)

      const severity = this.calculateSeverityFromCount(entry.count, threshold.currentThreshold)

      return this.createThreat(ThreatType.RATE_LIMIT_EXCEEDED, severity, ip, {
        count: entry.count,
        threshold: threshold.currentThreshold,
        windowMs,
        method: "adaptive_rate_limit",
      })
    }

    return null
  }

  private detectBot(userAgent: string, headers: Record<string, string>, ip: string): SecurityThreat | null {
    const botIndicators: string[] = []
    let botScore = 0

    // User-Agent analysis
    for (const signature of this.botDetectionSignatures) {
      if (signature.test(userAgent)) {
        botIndicators.push(`Suspicious User-Agent: ${userAgent}`)
        botScore += 0.3
      }
    }

    // Missing common headers
    const commonHeaders = ["accept", "accept-language", "accept-encoding"]
    const missingHeaders = commonHeaders.filter((header) => !headers[header.toLowerCase()])

    if (missingHeaders.length > 1) {
      botIndicators.push(`Missing headers: ${missingHeaders.join(", ")}`)
      botScore += 0.2
    }

    // Suspicious header patterns
    if (headers["x-forwarded-for"] && headers["x-forwarded-for"].split(",").length > 5) {
      botIndicators.push("Suspicious X-Forwarded-For chain")
      botScore += 0.3
    }

    // Empty or minimal User-Agent
    if (!userAgent || userAgent.length < 10) {
      botIndicators.push("Empty or minimal User-Agent")
      botScore += 0.4
    }

    // Programmatic patterns
    if (userAgent.includes("HTTP") || userAgent.includes("Client")) {
      botIndicators.push("Programmatic User-Agent pattern")
      botScore += 0.2
    }

    if (botScore > 0.5) {
      const confidence = Math.min(botScore, 1.0)
      const severity = this.calculateSeverityFromScore(botScore)

      return this.createThreat(ThreatType.BOT_ATTACK, severity, ip, {
        indicators: botIndicators,
        botScore,
        confidence,
        userAgent,
        method: "bot_detection",
      })
    }

    return null
  }

  private analyzeRequestPattern(ip: string, method: string, path: string, timestamp: number): SecurityThreat | null {
    const patterns = this.requestPatterns.get(ip) || []
    patterns.push(timestamp)

    // Keep only last 100 requests
    if (patterns.length > 100) {
      patterns.splice(0, patterns.length - 100)
    }

    this.requestPatterns.set(ip, patterns)

    // Analyze patterns
    const suspiciousPatterns: string[] = []
    let patternScore = 0

    // Check for regular intervals (bot-like behavior)
    if (patterns.length >= 10) {
      const intervals = []
      for (let i = 1; i < patterns.length; i++) {
        intervals.push(patterns[i] - patterns[i - 1])
      }

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const variance =
        intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length

      // Low variance indicates regular intervals (bot-like)
      if (variance < 1000 && avgInterval < 5000) {
        // Less than 5 seconds average
        suspiciousPatterns.push("Regular request intervals detected")
        patternScore += 0.4
      }
    }

    // Check for rapid succession
    const recentRequests = patterns.filter((t) => timestamp - t < 10000) // Last 10 seconds
    if (recentRequests.length > 20) {
      suspiciousPatterns.push(`${recentRequests.length} requests in 10 seconds`)
      patternScore += 0.5
    }

    // Check for identical request patterns
    const pathHash = crypto.createHash("md5").update(`${method}:${path}`).digest("hex")
    const recentPaths = this.getRecentPaths(ip)
    recentPaths.push(pathHash)

    if (recentPaths.length > 10) {
      recentPaths.splice(0, recentPaths.length - 50)
    }

    const uniquePaths = new Set(recentPaths).size
    if (recentPaths.length > 20 && uniquePaths < 3) {
      suspiciousPatterns.push("Repetitive request patterns")
      patternScore += 0.3
    }

    if (patternScore > 0.4) {
      const confidence = Math.min(patternScore, 1.0)
      const severity = this.calculateSeverityFromScore(patternScore)

      return this.createThreat(ThreatType.SUSPICIOUS_BEHAVIOR, severity, ip, {
        patterns: suspiciousPatterns,
        patternScore,
        confidence,
        requestCount: patterns.length,
        method: "pattern_analysis",
      })
    }

    return null
  }

  private detectBurst(ip: string, timestamp: number): SecurityThreat | null {
    const burstWindow = 5000 // 5 seconds
    const burstThreshold = 50 // 50 requests in 5 seconds

    const patterns = this.requestPatterns.get(ip) || []
    const recentRequests = patterns.filter((t) => timestamp - t < burstWindow)

    if (recentRequests.length > burstThreshold) {
      return this.createThreat(ThreatType.DDOS, ThreatSeverity.HIGH, ip, {
        burstCount: recentRequests.length,
        burstWindow,
        burstThreshold,
        method: "burst_detection",
      })
    }

    return null
  }

  private detectDistributedAttack(ip: string, timestamp: number): SecurityThreat | null {
    // This would require coordination between multiple instances
    // For now, we'll do basic distributed pattern detection

    const subnet = this.getSubnet(ip)
    const subnetRequests = this.getSubnetActivity(subnet, timestamp)

    if (subnetRequests > 1000) {
      // High activity from same subnet
      return this.createThreat(ThreatType.DDOS, ThreatSeverity.CRITICAL, ip, {
        subnet,
        subnetRequests,
        method: "distributed_detection",
      })
    }

    return null
  }

  private detectSlowloris(ip: string, context: any): SecurityThreat | null {
    // Detect slow HTTP attacks
    const { responseTime, headers } = context

    if (responseTime && responseTime > 30000) {
      // 30 seconds
      const connectionHeader = headers["connection"]
      if (connectionHeader && connectionHeader.toLowerCase() === "keep-alive") {
        return this.createThreat(ThreatType.DDOS, ThreatSeverity.HIGH, ip, {
          responseTime,
          attackType: "slowloris",
          method: "slowloris_detection",
        })
      }
    }

    return null
  }

  private detectHttpFlood(ip: string, method: string, timestamp: number): SecurityThreat | null {
    const floodWindow = 60000 // 1 minute
    const floodThreshold = 500 // 500 requests per minute

    const patterns = this.requestPatterns.get(ip) || []
    const recentRequests = patterns.filter((t) => timestamp - t < floodWindow)

    if (recentRequests.length > floodThreshold) {
      return this.createThreat(ThreatType.DDOS, ThreatSeverity.CRITICAL, ip, {
        floodCount: recentRequests.length,
        floodWindow,
        floodThreshold,
        method: "http_flood_detection",
      })
    }

    return null
  }

  private getAdaptiveThreshold(ip: string): AdaptiveThreshold {
    if (!this.adaptiveThresholds.has(ip)) {
      this.adaptiveThresholds.set(ip, {
        baseThreshold: 100,
        currentThreshold: 100,
        adaptationFactor: 1.0,
        lastAdjustment: Date.now(),
      })
    }
    return this.adaptiveThresholds.get(ip)!
  }

  private adjustAdaptiveThreshold(ip: string, currentCount: number): void {
    const threshold = this.getAdaptiveThreshold(ip)
    const now = Date.now()

    // Increase threshold if under attack
    if (currentCount > threshold.currentThreshold * 2) {
      threshold.adaptationFactor *= 0.8 // Become more strict
      threshold.currentThreshold = Math.max(threshold.baseThreshold * threshold.adaptationFactor, 10)
    }

    // Gradually restore threshold
    if (now - threshold.lastAdjustment > 300000) {
      // 5 minutes
      threshold.adaptationFactor = Math.min(threshold.adaptationFactor * 1.1, 1.0)
      threshold.currentThreshold = threshold.baseThreshold * threshold.adaptationFactor
    }

    threshold.lastAdjustment = now
  }

  private blockIP(ip: string, duration: number): void {
    const entry = this.rateLimitMap.get(ip)
    if (entry) {
      entry.blocked = true
      entry.blockExpiry = Date.now() + duration
    }

    // Add to suspicious IPs for monitoring
    this.suspiciousIPs.add(ip)

  }

  private calculateBlockDuration(severity: ThreatSeverity): number {
    switch (severity) {
      case ThreatSeverity.LOW:
        return 60000 // 1 minute
      case ThreatSeverity.MEDIUM:
        return 300000 // 5 minutes
      case ThreatSeverity.HIGH:
        return 900000 // 15 minutes
      case ThreatSeverity.CRITICAL:
        return 3600000 // 1 hour
      case ThreatSeverity.EXTREME:
        return 86400000 // 24 hours
      default:
        return 300000
    }
  }

  private calculateSeverityFromCount(count: number, threshold: number): ThreatSeverity {
    const ratio = count / threshold

    if (ratio >= 10) return ThreatSeverity.EXTREME
    if (ratio >= 5) return ThreatSeverity.CRITICAL
    if (ratio >= 3) return ThreatSeverity.HIGH
    if (ratio >= 2) return ThreatSeverity.MEDIUM
    return ThreatSeverity.LOW
  }

  private calculateSeverityFromScore(score: number): ThreatSeverity {
    if (score >= 0.9) return ThreatSeverity.EXTREME
    if (score >= 0.7) return ThreatSeverity.CRITICAL
    if (score >= 0.5) return ThreatSeverity.HIGH
    if (score >= 0.3) return ThreatSeverity.MEDIUM
    return ThreatSeverity.LOW
  }

  private createThreat(type: ThreatType, severity: ThreatSeverity, source: string, details: any): SecurityThreat {
    return {
      id: crypto.randomUUID(),
      type,
      severity,
      source,
      timestamp: Date.now(),
      details,
      blocked: severity >= ThreatSeverity.HIGH,
      confidence: details.confidence || 0.8,
    }
  }

  private getSubnet(ip: string): string {
    // Simple IPv4 subnet extraction (first 3 octets)
    const parts = ip.split(".")
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`
    }
    return ip
  }

  private getSubnetActivity(subnet: string, timestamp: number): number {
    // This would require a distributed cache or database
    // For now, return a mock value
    return Math.floor(Math.random() * 100)
  }

  private getRecentPaths(ip: string): string[] {
    // This would be stored separately in a real implementation
    return []
  }

  private startCleanupProcess(): void {
    setInterval(() => {
      this.cleanup()
    }, 300000) // Clean up every 5 minutes
  }

  private cleanup(): void {
    const now = Date.now()
    const expiredEntries: string[] = []

    // Clean up expired rate limit entries
    for (const [ip, entry] of this.rateLimitMap) {
      if (entry.blocked && now > entry.blockExpiry) {
        entry.blocked = false
        entry.blockExpiry = 0
      }

      // Remove old entries
      if (now - entry.lastRequest > 3600000) {
        // 1 hour
        expiredEntries.push(ip)
      }
    }

    expiredEntries.forEach((ip) => {
      this.rateLimitMap.delete(ip)
      this.requestPatterns.delete(ip)
      this.adaptiveThresholds.delete(ip)
    })
 
  }

  // Public methods for management
  addToWhitelist(ip: string): void {
    this.whitelistedIPs.add(ip)
  }

  addToBlacklist(ip: string): void {
    this.blacklistedIPs.add(ip)
  }

  removeFromBlacklist(ip: string): void {
    this.blacklistedIPs.delete(ip)
  }

  getStats() {
    return {
      rateLimitEntries: this.rateLimitMap.size,
      suspiciousIPs: this.suspiciousIPs.size,
      whitelistedIPs: this.whitelistedIPs.size,
      blacklistedIPs: this.blacklistedIPs.size,
      adaptiveThresholds: this.adaptiveThresholds.size,
    }
  }
}
