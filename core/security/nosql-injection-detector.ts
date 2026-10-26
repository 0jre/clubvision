import crypto from "crypto"
import { ThreatType, ThreatSeverity, type SecurityThreat } from "../types/security"

export class NoSQLInjectionDetector {
  private static instance: NoSQLInjectionDetector
  private suspiciousPatterns: RegExp[]
  private operatorBlacklist: Set<string>
  private aiModel: Map<string, number> // Simplified AI model
  private learningData: Map<string, { malicious: boolean; confidence: number }>

  private constructor() {
    this.suspiciousPatterns = [
      // MongoDB injection patterns
      /\$where/gi,
      /\$regex/gi,
      /\$ne/gi,
      /\$gt/gi,
      /\$lt/gi,
      /\$in/gi,
      /\$nin/gi,
      /\$exists/gi,
      /\$type/gi,
      /\$mod/gi,
      /\$all/gi,
      /\$size/gi,
      /\$elemMatch/gi,
      /\$slice/gi,
      /\$or/gi,
      /\$and/gi,
      /\$nor/gi,
      /\$not/gi,
      /\$expr/gi,
      /\$jsonSchema/gi,
      /\$text/gi,
      /\$search/gi,
      /\$language/gi,
      /\$caseSensitive/gi,
      /\$diacriticSensitive/gi,
      /\$near/gi,
      /\$geoNear/gi,
      /\$geoWithin/gi,
      /\$geoIntersects/gi,
      /\$geometry/gi,
      /\$maxDistance/gi,
      /\$minDistance/gi,
      /\$center/gi,
      /\$centerSphere/gi,
      /\$box/gi,
      /\$polygon/gi,
      /\$uniqueDocs/gi,

      // JavaScript injection patterns
      /function\s*\(/gi,
      /eval\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi,
      /new\s+Function/gi,
      /constructor/gi,
      /prototype/gi,
      /__proto__/gi,

      // Command injection patterns
      /;\s*rm\s+/gi,
      /;\s*cat\s+/gi,
      /;\s*ls\s+/gi,
      /;\s*pwd/gi,
      /;\s*whoami/gi,
      /;\s*id/gi,
      /;\s*uname/gi,
      /;\s*ps\s+/gi,
      /;\s*kill\s+/gi,
      /;\s*curl\s+/gi,
      /;\s*wget\s+/gi,

      // Advanced evasion patterns
      /\\u[0-9a-fA-F]{4}/gi, // Unicode escapes
      /\\x[0-9a-fA-F]{2}/gi, // Hex escapes
      /String\.fromCharCode/gi,
      /atob\s*\(/gi,
      /btoa\s*\(/gi,
      /decodeURIComponent/gi,
      /encodeURIComponent/gi,

      // Time-based injection patterns
      /sleep\s*\(/gi,
      /benchmark\s*\(/gi,
      /waitfor\s+delay/gi,
      /pg_sleep/gi,

      // Error-based injection patterns
      /extractvalue\s*\(/gi,
      /updatexml\s*\(/gi,
      /exp\s*\(/gi,
      /floor\s*\(/gi,
      /rand\s*\(/gi,

      // Union-based patterns (adapted for NoSQL)
      /union\s+select/gi,
      /union\s+all/gi,

      // Blind injection patterns
      /if\s*\(/gi,
      /case\s+when/gi,
      /iif\s*\(/gi,

      // File system access patterns
      /load_file\s*\(/gi,
      /into\s+outfile/gi,
      /into\s+dumpfile/gi,

      // Network access patterns
      /master\.\.xp_cmdshell/gi,
      /xp_regread/gi,
      /sp_makewebtask/gi,
    ]

    this.operatorBlacklist = new Set([
      "$where",
      "$regex",
      "$ne",
      "$gt",
      "$lt",
      "$in",
      "$nin",
      "$exists",
      "$type",
      "$mod",
      "$all",
      "$size",
      "$elemMatch",
      "$slice",
      "$or",
      "$and",
      "$nor",
      "$not",
      "$expr",
      "$jsonSchema",
      "$text",
      "$search",
      "$language",
      "$caseSensitive",
      "$diacriticSensitive",
      "$near",
      "$geoNear",
      "$geoWithin",
      "$geoIntersects",
      "$geometry",
      "$maxDistance",
      "$minDistance",
      "$center",
      "$centerSphere",
      "$box",
      "$polygon",
      "$uniqueDocs",
      "eval",
      "function",
      "constructor",
      "prototype",
      "__proto__",
      "setTimeout",
      "setInterval",
    ])

    this.aiModel = new Map()
    this.learningData = new Map()
    this.initializeAIModel()
  }

  static getInstance(): NoSQLInjectionDetector {
    if (!NoSQLInjectionDetector.instance) {
      NoSQLInjectionDetector.instance = new NoSQLInjectionDetector()
    }
    return NoSQLInjectionDetector.instance
  }

  private initializeAIModel(): void {
    // Initialize with known malicious patterns and their weights
    const maliciousPatterns = [
      { pattern: "$where", weight: 0.9 },
      { pattern: "eval(", weight: 0.95 },
      { pattern: "function(", weight: 0.8 },
      { pattern: "; rm ", weight: 0.99 },
      { pattern: "constructor", weight: 0.7 },
      { pattern: "__proto__", weight: 0.85 },
      { pattern: "setTimeout", weight: 0.6 },
      { pattern: "String.fromCharCode", weight: 0.8 },
      { pattern: "\\u", weight: 0.4 },
      { pattern: "sleep(", weight: 0.9 },
    ]

    maliciousPatterns.forEach(({ pattern, weight }) => {
      this.aiModel.set(pattern.toLowerCase(), weight)
    })
  }

  async analyzeQuery(query: any, context: any = {}): Promise<SecurityThreat | null> {
    const queryString = JSON.stringify(query).toLowerCase()
    const threats: SecurityThreat[] = []

    // 1. Pattern-based detection
    const patternThreat = this.detectSuspiciousPatterns(queryString, context)
    if (patternThreat) threats.push(patternThreat)

    // 2. Operator blacklist check
    const operatorThreat = this.detectBlacklistedOperators(query, context)
    if (operatorThreat) threats.push(operatorThreat)

    // 3. Deep structure analysis
    const structureThreat = this.analyzeQueryStructure(query, context)
    if (structureThreat) threats.push(structureThreat)

    // 4. AI-based detection
    const aiThreat = await this.aiBasedDetection(queryString, context)
    if (aiThreat) threats.push(aiThreat)

    // 5. Behavioral analysis
    const behaviorThreat = this.analyzeBehavior(queryString, context)
    if (behaviorThreat) threats.push(behaviorThreat)

    // 6. Entropy analysis
    const entropyThreat = this.analyzeEntropy(queryString, context)
    if (entropyThreat) threats.push(entropyThreat)

    // 7. Time-based analysis
    const timingThreat = this.analyzeTimingPatterns(queryString, context)
    if (timingThreat) threats.push(timingThreat)

    // Return the highest severity threat
    if (threats.length > 0) {
      return threats.reduce((highest, current) => (current.severity > highest.severity ? current : highest))
    }

    return null
  }

  private detectSuspiciousPatterns(queryString: string, context: any): SecurityThreat | null {
    const matches: string[] = []
    let totalConfidence = 0

    for (const pattern of this.suspiciousPatterns) {
      const match = queryString.match(pattern)
      if (match) {
        matches.push(match[0])
        totalConfidence += 0.1
      }
    }

    if (matches.length > 0) {
      const confidence = Math.min(totalConfidence, 1.0)
      const severity = this.calculateSeverity(confidence, matches.length)

      return {
        id: crypto.randomUUID(),
        type: ThreatType.NOSQL_INJECTION,
        severity,
        source: context.ip || "unknown",
        timestamp: Date.now(),
        details: {
          matches,
          confidence,
          method: "pattern_detection",
          queryString: queryString.substring(0, 500), // Limit for logging
        },
        blocked: severity >= ThreatSeverity.HIGH,
        confidence,
      }
    }

    return null
  }

  private detectBlacklistedOperators(query: any, context: any): SecurityThreat | null {
    const foundOperators: string[] = []

    const checkObject = (obj: any, path = ""): void => {
      if (typeof obj === "object" && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          if (this.operatorBlacklist.has(key)) {
            foundOperators.push(`${path}${key}`)
          }

          if (typeof value === "object") {
            checkObject(value, `${path}${key}.`)
          }
        }
      }
    }

    checkObject(query)

    if (foundOperators.length > 0) {
      const confidence = Math.min(foundOperators.length * 0.3, 1.0)
      const severity = this.calculateSeverity(confidence, foundOperators.length)

      return {
        id: crypto.randomUUID(),
        type: ThreatType.NOSQL_INJECTION,
        severity,
        source: context.ip || "unknown",
        timestamp: Date.now(),
        details: {
          operators: foundOperators,
          confidence,
          method: "operator_blacklist",
          query: JSON.stringify(query).substring(0, 500),
        },
        blocked: severity >= ThreatSeverity.MEDIUM,
        confidence,
      }
    }

    return null
  }

  private analyzeQueryStructure(query: any, context: any): SecurityThreat | null {
    const issues: string[] = []
    let riskScore = 0

    // Check for excessive nesting
    const maxDepth = this.getObjectDepth(query)
    if (maxDepth > 10) {
      issues.push(`Excessive nesting depth: ${maxDepth}`)
      riskScore += 0.3
    }

    // Check for large query size
    const querySize = JSON.stringify(query).length
    if (querySize > 10000) {
      issues.push(`Large query size: ${querySize} bytes`)
      riskScore += 0.2
    }

    // Check for suspicious key patterns
    const keys = this.getAllKeys(query)
    const suspiciousKeys = keys.filter(
      (key) => key.includes("$") || key.includes("eval") || key.includes("function") || key.includes("constructor"),
    )

    if (suspiciousKeys.length > 0) {
      issues.push(`Suspicious keys: ${suspiciousKeys.join(", ")}`)
      riskScore += suspiciousKeys.length * 0.1
    }

    // Check for regex complexity
    const regexPatterns = this.findRegexPatterns(query)
    for (const pattern of regexPatterns) {
      if (pattern.length > 100 || this.isComplexRegex(pattern)) {
        issues.push(`Complex regex pattern detected`)
        riskScore += 0.4
      }
    }

    if (issues.length > 0 && riskScore > 0.3) {
      const confidence = Math.min(riskScore, 1.0)
      const severity = this.calculateSeverity(confidence, issues.length)

      return {
        id: crypto.randomUUID(),
        type: ThreatType.NOSQL_INJECTION,
        severity,
        source: context.ip || "unknown",
        timestamp: Date.now(),
        details: {
          issues,
          riskScore,
          confidence,
          method: "structure_analysis",
          maxDepth,
          querySize,
        },
        blocked: severity >= ThreatSeverity.HIGH,
        confidence,
      }
    }

    return null
  }

  private async aiBasedDetection(queryString: string, context: any): Promise<SecurityThreat | null> {
    let aiScore = 0
    const features: string[] = []

    // Feature extraction
    for (const [pattern, weight] of this.aiModel) {
      if (queryString.includes(pattern)) {
        aiScore += weight
        features.push(pattern)
      }
    }

    // Normalize score
    aiScore = Math.min(aiScore / features.length || 0, 1.0)

    // Learn from this query
    this.updateLearningModel(queryString, aiScore > 0.5)

    if (aiScore > 0.5) {
      const confidence = aiScore
      const severity = this.calculateSeverity(confidence, features.length)

      return {
        id: crypto.randomUUID(),
        type: ThreatType.NOSQL_INJECTION,
        severity,
        source: context.ip || "unknown",
        timestamp: Date.now(),
        details: {
          aiScore,
          features,
          confidence,
          method: "ai_detection",
          modelVersion: "1.0",
        },
        blocked: severity >= ThreatSeverity.HIGH,
        confidence,
      }
    }

    return null
  }

  private analyzeBehavior(queryString: string, context: any): SecurityThreat | null {
    const userId = context.userId || context.ip
    if (!userId) return null

    // This would integrate with a behavior tracking system
    // For now, we'll do basic analysis
    const suspiciousIndicators: string[] = []
    let behaviorScore = 0

    // Check for rapid successive queries
    if (context.requestCount && context.requestCount > 100) {
      suspiciousIndicators.push("High request frequency")
      behaviorScore += 0.3
    }

    // Check for unusual query patterns
    if (queryString.length > 1000) {
      suspiciousIndicators.push("Unusually long query")
      behaviorScore += 0.2
    }

    // Check for off-hours activity
    const hour = new Date().getHours()
    if (hour < 6 || hour > 22) {
      suspiciousIndicators.push("Off-hours activity")
      behaviorScore += 0.1
    }

    if (behaviorScore > 0.4) {
      const confidence = behaviorScore
      const severity = this.calculateSeverity(confidence, suspiciousIndicators.length)

      return {
        id: crypto.randomUUID(),
        type: ThreatType.SUSPICIOUS_BEHAVIOR,
        severity,
        source: context.ip || "unknown",
        timestamp: Date.now(),
        details: {
          indicators: suspiciousIndicators,
          behaviorScore,
          confidence,
          method: "behavior_analysis",
          userId,
        },
        blocked: severity >= ThreatSeverity.HIGH,
        confidence,
      }
    }

    return null
  }

  private analyzeEntropy(queryString: string, context: any): SecurityThreat | null {
    const entropy = this.calculateEntropy(queryString)

    // High entropy might indicate encoded/obfuscated payloads
    if (entropy > 4.5) {
      const confidence = (entropy - 4.5) / 3.5 // Normalize to 0-1
      const severity = this.calculateSeverity(confidence, 1)

      return {
        id: crypto.randomUUID(),
        type: ThreatType.NOSQL_INJECTION,
        severity,
        source: context.ip || "unknown",
        timestamp: Date.now(),
        details: {
          entropy,
          confidence,
          method: "entropy_analysis",
          threshold: 4.5,
        },
        blocked: severity >= ThreatSeverity.HIGH,
        confidence,
      }
    }

    return null
  }

  private analyzeTimingPatterns(queryString: string, context: any): SecurityThreat | null {
    // Look for time-based injection patterns
    const timingPatterns = [
      /sleep\s*$$\s*\d+\s*$$/gi,
      /waitfor\s+delay\s+'\d+:\d+:\d+'/gi,
      /benchmark\s*\(\s*\d+/gi,
      /pg_sleep\s*$$\s*\d+\s*$$/gi,
    ]

    const matches: string[] = []
    for (const pattern of timingPatterns) {
      const match = queryString.match(pattern)
      if (match) {
        matches.push(match[0])
      }
    }

    if (matches.length > 0) {
      const confidence = 0.9 // High confidence for timing attacks
      const severity = ThreatSeverity.HIGH

      return {
        id: crypto.randomUUID(),
        type: ThreatType.NOSQL_INJECTION,
        severity,
        source: context.ip || "unknown",
        timestamp: Date.now(),
        details: {
          matches,
          confidence,
          method: "timing_analysis",
          type: "time_based_injection",
        },
        blocked: true,
        confidence,
      }
    }

    return null
  }

  private calculateSeverity(confidence: number, factorCount: number): ThreatSeverity {
    const score = confidence + factorCount * 0.1

    if (score >= 0.9) return ThreatSeverity.EXTREME
    if (score >= 0.7) return ThreatSeverity.CRITICAL
    if (score >= 0.5) return ThreatSeverity.HIGH
    if (score >= 0.3) return ThreatSeverity.MEDIUM
    return ThreatSeverity.LOW
  }

  private getObjectDepth(obj: any, depth = 0): number {
    if (typeof obj !== "object" || obj === null) return depth

    let maxDepth = depth
    for (const value of Object.values(obj)) {
      const currentDepth = this.getObjectDepth(value, depth + 1)
      maxDepth = Math.max(maxDepth, currentDepth)
    }

    return maxDepth
  }

  private getAllKeys(obj: any, keys: string[] = []): string[] {
    if (typeof obj === "object" && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        keys.push(key)
        if (typeof value === "object") {
          this.getAllKeys(value, keys)
        }
      }
    }
    return keys
  }

  private findRegexPatterns(obj: any, patterns: string[] = []): string[] {
    if (typeof obj === "object" && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        if (key === "$regex" && typeof value === "string") {
          patterns.push(value)
        }
        if (typeof value === "object") {
          this.findRegexPatterns(value, patterns)
        }
      }
    }
    return patterns
  }

  private isComplexRegex(pattern: string): boolean {
    // Check for potentially dangerous regex patterns
    const dangerousPatterns = [
      /\(\?=/g, // Positive lookahead
      /\(\?!/g, // Negative lookahead
      /\(\?<=/g, // Positive lookbehind
      /\(\?<!/g, // Negative lookbehind
      /\*\+/g, // Catastrophic backtracking
      /\+\*/g, // Catastrophic backtracking
      /\{\d+,\}/g, // Large quantifiers
    ]

    return dangerousPatterns.some((p) => p.test(pattern)) || pattern.length > 100
  }

  private calculateEntropy(str: string): number {
    const freq: { [key: string]: number } = {}

    for (const char of str) {
      freq[char] = (freq[char] || 0) + 1
    }

    let entropy = 0
    const len = str.length

    for (const count of Object.values(freq)) {
      const p = count / len
      entropy -= p * Math.log2(p)
    }

    return entropy
  }

  private updateLearningModel(queryString: string, isMalicious: boolean): void {
    const hash = crypto.createHash("md5").update(queryString).digest("hex")
    const confidence = isMalicious ? 0.8 : 0.2

    this.learningData.set(hash, { malicious: isMalicious, confidence })

    // Keep only recent learning data (last 10000 entries)
    if (this.learningData.size > 10000) {
      const keys = Array.from(this.learningData.keys())
      for (let i = 0; i < 1000; i++) {
        this.learningData.delete(keys[i])
      }
    }
  }

  sanitizeQuery(query: any): any {
    return this.deepSanitize(query)
  }

  private deepSanitize(obj: any): any {
    if (typeof obj === "string") {
      return this.sanitizeString(obj)
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepSanitize(item))
    }

    if (typeof obj === "object" && obj !== null) {
      const sanitized: any = {}

      for (const [key, value] of Object.entries(obj)) {
        // Remove blacklisted operators
        if (this.operatorBlacklist.has(key)) {
          continue
        }

        const sanitizedKey = this.sanitizeString(key)
        sanitized[sanitizedKey] = this.deepSanitize(value)
      }

      return sanitized
    }

    return obj
  }

  private sanitizeString(str: string): string {
    return str
      .replace(/[<>]/g, "") // Remove HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, "") // Remove event handlers
      .replace(/eval\s*\(/gi, "") // Remove eval calls
      .replace(/function\s*\(/gi, "") // Remove function declarations
      .replace(/constructor/gi, "") // Remove constructor references
      .replace(/__proto__/gi, "") // Remove prototype pollution
      .trim()
  }
}
