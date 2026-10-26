import type { CacheMetrics, QueryPattern } from "../types/cache"

export class MetricsCollector {
  private static instance: MetricsCollector
  private metrics: CacheMetrics
  private queryPatterns: Map<string, QueryPattern>
  private responseTimeHistory: number[]
  private maxHistorySize = 100

  private constructor() {
    this.metrics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalRequests: 0,
      averageResponseTime: 0,
      memoryUsage: 0,
      redisConnections: 0,
    }
    this.queryPatterns = new Map()
    this.responseTimeHistory = []
  }

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector()
    }
    return MetricsCollector.instance
  }

  recordHit(): void {
    this.metrics.hits++
    this.metrics.totalRequests++
  }

  recordMiss(): void {
    this.metrics.misses++
    this.metrics.totalRequests++
  }

  recordEviction(): void {
    this.metrics.evictions++
  }

  recordResponseTime(time: number): void {
    this.responseTimeHistory.push(time)
    if (this.responseTimeHistory.length > this.maxHistorySize) {
      this.responseTimeHistory.shift()
    }
    this.metrics.averageResponseTime =
      this.responseTimeHistory.reduce((a, b) => a + b, 0) / this.responseTimeHistory.length
  }

  recordQueryPattern(collection: string, queryHash: string, responseTime: number): void {
    if (this.queryPatterns.size >= 50) {
      const firstKey = this.queryPatterns.keys().next().value
      if (firstKey) {
        this.queryPatterns.delete(firstKey)
      }
    }

    const key = `${collection}:${queryHash}`
    const existing = this.queryPatterns.get(key)

    if (existing) {
      existing.frequency++
      existing.lastUsed = Date.now()
      existing.avgResponseTime = (existing.avgResponseTime + responseTime) / 2
      existing.predictedNextAccess = this.predictNextAccess(existing)
    } else {
      this.queryPatterns.set(key, {
        collection,
        queryHash,
        frequency: 1,
        lastUsed: Date.now(),
        avgResponseTime: responseTime,
        predictedNextAccess: Date.now() + 1000 * 60 * 5,
      })
    }
  }

  private predictNextAccess(pattern: QueryPattern): number {
    const timeSinceLastUse = Date.now() - pattern.lastUsed
    const avgInterval = timeSinceLastUse / pattern.frequency
    return Date.now() + avgInterval
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics }
  }

  getQueryPatterns(): QueryPattern[] {
    return Array.from(this.queryPatterns.values())
  }

  getHitRatio(): number {
    return this.metrics.totalRequests > 0 ? this.metrics.hits / this.metrics.totalRequests : 0
  }

  updateMemoryUsage(usage: number): void {
    this.metrics.memoryUsage = usage
  }

  updateRedisConnections(count: number): void {
    this.metrics.redisConnections = count
  }
}
