import { EmergencyCache } from "../cache/emergency-cache"
import { VortexorCache } from "../cache/vortexor-cache"
import type { CachePriority } from "../types/cache"

interface LRUCacheEntry {
  data: any
  timestamp: number
  lastAccessed: number
  accessCount: number
  ttl: number
  priority?: CachePriority
  version: number
}

interface LRUStats {
  totalEntries: number
  maxSize: number
  evictions: number
  averageAccessCount: number
  oldestEntry: number
  newestEntry: number
  lruHitRatio: number
  lruHits: number; // Added for explicit typing
  lruMisses: number; // Added for explicit typing
}

interface PendingCacheOperation {
  type: "set" | "delete" | "invalidate"
  key?: string
  data?: any // 'data' can be of any type for 'set', or string[] for 'invalidate'
  options?: any
  timestamp: number
  retries: number
  priority?: "high" | "normal"
}

// New interface for the comprehensive cache stats
interface CacheStats {
  basicCacheSize: number;
  maxBasicCacheSize: number;
  totalHits: number;
  totalMisses: number;
  totalSets: number;
  totalErrors: number;
  totalInvalidations: number;
  hitRatio: number;
  errorRate: number;
  lruHits: number;
  lruMisses: number;
  lruEvictions: number;
  lruStats: LRUStats;
  pendingOperations: number;
  queueLength: number;
  isProcessingQueue: boolean;
  cacheVersion: number;
  syncLocks: number;
  redisEnabled: boolean;
  forceRedisMode: boolean;
  memoryThreshold: string;
  environment: string;
  memoryUsage: number;
  status: string;
  redisStatus: string;
  recommendation: string;
  healthScore: number;
  redisHits?: number; // Optional, only if VortexorCache is enabled
  redisMisses?: number; // Optional
  redisHitRatio?: number; // Optional
  combinedHitRatio?: number; // Optional
}

export class IntelligentCacheSystem {
  private static instance: IntelligentCacheSystem
  private cache!: VortexorCache | EmergencyCache
  private isInitialized = false
  private basicCache: Map<string, LRUCacheEntry> = new Map()
  private maxBasicCacheSize = 2000 // Increased to allow more items in LRU
  private cacheStats = { hits: 0, misses: 0, sets: 0, errors: 0, invalidations: 0 }
  private forceRedisMode = false
  private lruStats = { evictions: 0, lruHits: 0, lruMisses: 0 }
  private accessOrder = new Map<string, number>()
  private pendingOperations = new Map<string, PendingCacheOperation>()
  private operationQueue: PendingCacheOperation[] = []
  private isProcessingQueue = false
  private cacheVersion = 1
  private syncInvalidationLocks = new Map<string, Promise<void>>()

  private debounceInvalidationTimers: Map<string, NodeJS.Timeout> = new Map();
  private debounceInvalidationQueue: Map<string, string[]> = new Map();
  public enableDebounceInvalidation = true;
  public debounceInterval = 100;

  /**
   * Invalidates cache with debounce (optional).
   * If enabled, groups multiple patterns in a short interval before invalidating.
   */
  async invalidateWithDebounce(patterns: string[]): Promise<void> {
    if (!this.enableDebounceInvalidation) {
      await this.invalidateSync(patterns);
      return;
    }
    const key = patterns.sort().join("|");
    if (!this.debounceInvalidationQueue.has(key)) {
      this.debounceInvalidationQueue.set(key, []);
    }
    const queue = this.debounceInvalidationQueue.get(key)!;
    queue.push(...patterns);
    this.debounceInvalidationQueue.set(key, Array.from(new Set(queue)));
    if (this.debounceInvalidationTimers.has(key)) {
      clearTimeout(this.debounceInvalidationTimers.get(key));
    }
    this.debounceInvalidationTimers.set(key, setTimeout(async () => {
      const patternsToInvalidate = this.debounceInvalidationQueue.get(key) || [];
      await this.invalidateSync(patternsToInvalidate);
      this.debounceInvalidationQueue.delete(key);
      this.debounceInvalidationTimers.delete(key);
    }, this.debounceInterval));
  }

  constructor() {
    this.forceRedisMode = process.env.FORCE_REDIS_CACHE === "true" || process.env.NODE_ENV === "production"
    this.initializeCache()
    this.startOperationQueueProcessor()
    setInterval(() => this.cleanup(), 60000); // Cleanup every 1 minute
    setInterval(() => this.optimizeCache(), 300000); // Automatic optimization every 5 minutes
  }

  static getInstance(): IntelligentCacheSystem {
    if (!IntelligentCacheSystem.instance) {
      IntelligentCacheSystem.instance = new IntelligentCacheSystem()
    }
    return IntelligentCacheSystem.instance
  }

  private initializeCache(): void {
    const memUsage = process.memoryUsage().heapUsed / 1024 / 1024
    const hasRedisConfig = !!process.env.KV_URL && !!process.env.KV_TOKEN // Explicitly check for existence

    const shouldUseRedis =
      hasRedisConfig &&
      (this.forceRedisMode || memUsage <= 500 || process.env.NODE_ENV === "production")

    if (!shouldUseRedis) {
      this.cache = EmergencyCache.getInstance()
    } else {
      try {
        // Using non-null assertion '!' here assumes that if hasRedisConfig is true, these are defined.
        // In a real application, you might want more robust validation or default values.
        this.cache = VortexorCache.getInstance({
          maxMemorySize: 15 * 1024 * 1024,
          defaultTTL: 1800000,
          compressionThreshold: 1000000,
          enablePredictiveCache: false,
          enableWarmup: false,
          batchSize: 10,
          redisConfig: {
            url: process.env.KV_URL!,
            token: process.env.KV_TOKEN!,
            maxRetries: 5,
            retryDelay: 1000,
          },
        })
        this.isInitialized = true
      } catch (error) {
        console.error("❌ Error initializing Redis:", error) // Added error logging
        this.cache = EmergencyCache.getInstance()
      }
    }
  }

  private startOperationQueueProcessor(): void {
    setInterval(async () => {
      if (!this.isProcessingQueue && this.operationQueue.length > 0) {
        await this.processOperationQueue()
      }
    }, 25)
  }

  private async processOperationQueue(): Promise<void> {
    if (this.isProcessingQueue || this.operationQueue.length === 0) return

    this.isProcessingQueue = true

    this.operationQueue.sort((a, b) => {
      if (a.priority === "high" && b.priority !== "high") return -1
      if (a.priority !== "high" && b.priority === "high") return 1
      return a.timestamp - b.timestamp
    })

    const batchSize = 15
    const batch = this.operationQueue.splice(0, batchSize)

    try {
      const promises = batch.map(async (operation) => {
        try {
          switch (operation.type) {
            case "set":
              await this.executeSetOperation(operation)
              break
            case "delete":
              await this.executeDeleteOperation(operation)
              break
            case "invalidate":
              await this.executeInvalidateOperation(operation)
              break
          }
          this.pendingOperations.delete(operation.key || JSON.stringify(operation.data))
        } catch (error) {
          console.error(`❌ Error processing operation ${operation.type} for ${operation.key || JSON.stringify(operation.data)}:`, error); // Added error logging
          if (operation.retries < 3) {
            operation.retries++
            operation.timestamp = Date.now()
            this.operationQueue.push(operation)
          } else {
            this.pendingOperations.delete(operation.key || JSON.stringify(operation.data))
          }
        }
      })
      await Promise.allSettled(promises)
    } finally {
      this.isProcessingQueue = false
    }
  }

  private async executeSetOperation(operation: PendingCacheOperation): Promise<void> {
    if (!operation.key || !operation.data) return;

    if (this.isInitialized && this.cache instanceof VortexorCache) {
      await this.cache.set(operation.key, operation.data, operation.options)
    }

    const now = Date.now()
    const lruEntry: LRUCacheEntry = {
      data: operation.data,
      timestamp: now,
      lastAccessed: now,
      accessCount: 1,
      ttl: operation.options?.ttl || 1800000,
      priority: operation.options?.priority,
      version: this.cacheVersion,
    }

    this.basicCache.set(operation.key, lruEntry)
    this.accessOrder.set(operation.key, now)
    this.trackKeyAccess(operation.key); // Track access for dynamic TTL
  }

  private async executeDeleteOperation(operation: PendingCacheOperation): Promise<void> {
    if (!operation.key) return;

    if (this.isInitialized && this.cache instanceof VortexorCache) {
      await this.cache.delete(operation.key)
    }

    this.basicCache.delete(operation.key)
    this.accessOrder.delete(operation.key)
    this.trackKeyInvalidation(operation.key); // Track invalidation for dynamic TTL
  }

  private async executeInvalidateOperation(operation: PendingCacheOperation): Promise<void> {
    // Runtime type check for patterns
    if (!Array.isArray(operation.data) || !operation.data.every(item => typeof item === 'string')) {
      console.error("❌ Invalidate operation received non-string[] data:", operation.data);
      return;
    }
    const patterns = operation.data as string[]
    this.clearRelatedEntries(patterns)
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const lockPromise = this.syncInvalidationLocks.get(key)
      if (lockPromise) {
        await lockPromise
      }

      const pendingOp = this.pendingOperations.get(key)
      if (pendingOp && pendingOp.type === "delete") {
        this.cacheStats.misses++
        return null
      }

      if (this.isInitialized && this.cache instanceof VortexorCache) {
        try {
          const result = await this.cache.get<T>(key)
          if (result) {
            this.cacheStats.hits++
            this.trackKeyAccess(key); // Track access for dynamic TTL
            return result
          }
        } catch (error) {
          this.cacheStats.errors++
          console.error("❌ Redis GET error:", error); // Added error logging
        }
      }

      if (this.basicCache.has(key)) {
        const cached = this.basicCache.get(key) as LRUCacheEntry
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
          if (cached.version < this.cacheVersion) {
            this.basicCache.delete(key)
            this.accessOrder.delete(key)
          } else {
            const now = Date.now()
            cached.lastAccessed = now
            cached.accessCount++
            this.accessOrder.set(key, now)

            this.cacheStats.hits++
            this.lruStats.lruHits++
            this.trackKeyAccess(key); // Track access for dynamic TTL
            return cached.data
          }
        } else {
          this.basicCache.delete(key)
          this.accessOrder.delete(key)
        }
      }

      this.cacheStats.misses++
      this.lruStats.lruMisses++
      return null
    } catch (error) {
      this.cacheStats.errors++
      console.error("❌ Cache GET error (outer catch):", error); // Added error logging
      return null
    }
  }

  async set<T>(key: string, data: T, options: { ttl?: number; priority?: CachePriority } = {}): Promise<boolean> {
    try {
      this.cacheStats.sets++;
      let ttl = options.ttl || 1800000;
      ttl = this.getDynamicTTL(key, ttl);
      options.ttl = ttl;

      const operation: PendingCacheOperation = {
        type: "set",
        key,
        data,
        options: { ...options, ttl },
        timestamp: Date.now(),
        retries: 0,
        priority: "normal",
      }

      this.pendingOperations.set(key, operation)
      this.operationQueue.push(operation)

      if (this.basicCache.size >= this.maxBasicCacheSize && !this.basicCache.has(key)) {
        this.evictLRUEntry()
      }

      const now = Date.now()
      const lruEntry: LRUCacheEntry = {
        data,
        timestamp: now,
        lastAccessed: now,
        accessCount: 1,
        ttl,
        priority: options.priority,
        version: this.cacheVersion,
      }

      this.basicCache.set(key, lruEntry)
      this.accessOrder.set(key, now)
      this.trackKeyAccess(key); // Track access for dynamic TTL

      return true
    } catch (error) {
      this.cacheStats.errors++
      console.error("❌ Cache SET error:", error); // Added error logging
      return false
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const operation: PendingCacheOperation = {
        type: "delete",
        key,
        timestamp: Date.now(),
        retries: 0,
        priority: "high",
      }

      this.pendingOperations.set(key, operation)
      this.operationQueue.push(operation)

      const memorySuccess = this.basicCache.delete(key)
      this.accessOrder.delete(key)

      this.trackKeyInvalidation(key); // Track invalidation for dynamic TTL

      return true
    } catch (error) {
      console.error("❌ Cache DELETE error:", error); // Added error logging
      return false
    }
  }

  async invalidateSync(patterns: string[]): Promise<number> {
    const lockPromises: Promise<void>[] = []
    const affectedKeys = new Set<string>()

    for (const pattern of patterns) {
      const regexPattern = pattern.replace(/\*/g, ".*").replace(/\./g, "\\.")
      const regex = new RegExp(`^${regexPattern}$`)

      for (const [key] of this.basicCache.entries()) {
        if (regex.test(key)) {
          affectedKeys.add(key)
        }
      }
    }

    for (const key of affectedKeys) {
      const lockPromise = this.createInvalidationLock(key)
      lockPromises.push(lockPromise)
    }

    try {
      this.cacheVersion++
      this.cacheStats.invalidations++

      const immediateCleared = this.clearRelatedEntries(patterns)

      if (this.isInitialized && this.cache instanceof VortexorCache) {
        try {
          for (const pattern of patterns) {
            await this.cache.clearByPattern(pattern);
          }
        } catch (error) {
          console.error("❌ Error during Redis invalidation:", error); // Added error logging
        }
      }

      await Promise.all(lockPromises)

      return immediateCleared
    } finally {
      for (const key of affectedKeys) {
        this.syncInvalidationLocks.delete(key)
      }
    }
  }

  private async createInvalidationLock(key: string): Promise<void> {
    const lockPromise = new Promise<void>((resolve) => {
      setTimeout(resolve, 10);
    });

    this.syncInvalidationLocks.set(key, lockPromise);
    return lockPromise;
  }

  async invalidateImmediate(patterns: string[]): Promise<number> {
    return await this.invalidateSync(patterns)
  }

  async healthCheck(): Promise<boolean> {
    try {
      const testKey = "health_check_" + Date.now()
      const testData = { test: true, timestamp: Date.now() }

      const setResult = await this.set(testKey, testData, { ttl: 5000 })
      if (!setResult) {
        return false
      }

      await new Promise((resolve) => setTimeout(resolve, 100))

      const getData = await this.get(testKey)
      if (!getData) {
        return false
      }

      await this.delete(testKey)
      return true
    } catch (error) {
      console.error("❌ Cache health check failed:", error); // Added error logging
      return false
    }
  }

  getLRUStats(): LRUStats {
    const entries = Array.from(this.basicCache.values()) as LRUCacheEntry[]
    const accessTimes = entries.map((e) => e.lastAccessed)

    return {
      totalEntries: this.basicCache.size,
      maxSize: this.maxBasicCacheSize,
      evictions: this.lruStats.evictions,
      // Handle division by zero for averageAccessCount
      averageAccessCount: entries.length === 0 ? 0 : entries.reduce((sum, e) => sum + e.accessCount, 0) / entries.length,
      oldestEntry: Math.min(...accessTimes) || 0,
      newestEntry: Math.max(...accessTimes) || 0,
      lruHitRatio: this.lruStats.lruHits / (this.lruStats.lruHits + this.lruStats.lruMisses) || 0,
      lruHits: this.lruStats.lruHits, // Now explicitly returned
      lruMisses: this.lruStats.lruMisses, // Now explicitly returned
    }
  }

  getLRUOrder(): Array<{ key: string; lastAccessed: number; accessCount: number }> {
    const entries: Array<{ key: string; lastAccessed: number; accessCount: number }> = []

    for (const [key, entry] of this.basicCache.entries()) {
      const lruEntry = entry as LRUCacheEntry
      entries.push({
        key,
        lastAccessed: lruEntry.lastAccessed,
        accessCount: lruEntry.accessCount,
      })
    }

    return entries.sort((a, b) => a.lastAccessed - b.lastAccessed)
  }

  setLRUMaxSize(newSize: number): void {
    this.maxBasicCacheSize = newSize
    while (this.basicCache.size > this.maxBasicCacheSize) {
      this.evictLRUEntry()
    }
  }

  evictLRUEntries(count = 1): number {
    let evicted = 0
    for (let i = 0; i < count && this.basicCache.size > 0; i++) {
      this.evictLRUEntry()
      evicted++
    }
    return evicted
  }

  clearLRUCache(): void {
    this.basicCache.clear()
    this.accessOrder.clear()
  }

  private evictLRUEntry(): void {
    if (this.basicCache.size === 0) return

    const now = Date.now()
    for (const [key, entry] of this.basicCache.entries()) {
      const lruEntry = entry as LRUCacheEntry
      if (now - lruEntry.timestamp > lruEntry.ttl) {
        this.basicCache.delete(key)
        this.accessOrder.delete(key)
        return
      }
    }

    let oldestKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, accessTime] of this.accessOrder.entries()) {
      if (accessTime < oldestTime) {
        oldestTime = accessTime
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.basicCache.delete(oldestKey)
      this.accessOrder.delete(oldestKey)
      this.lruStats.evictions++
    }
  }

  getIntelligentCacheStats(): CacheStats { // Explicitly set return type
    const lruStats = this.getLRUStats()

    const hitRatio = this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses) || 0
    // Handle division by zero for errorRate
    const errorRate = this.cacheStats.sets === 0 ? 0 : this.cacheStats.errors / this.cacheStats.sets;

    const basicStats = {
      basicCacheSize: this.basicCache.size,
      maxBasicCacheSize: this.maxBasicCacheSize,
      totalHits: this.cacheStats.hits,
      totalMisses: this.cacheStats.misses,
      totalSets: this.cacheStats.sets,
      totalErrors: this.cacheStats.errors,
      totalInvalidations: this.cacheStats.invalidations,
      hitRatio,
      errorRate,

      lruHits: this.lruStats.lruHits,
      lruMisses: this.lruStats.lruMisses,
      lruEvictions: this.lruStats.evictions,
      lruStats,

      pendingOperations: this.pendingOperations.size,
      queueLength: this.operationQueue.length,
      isProcessingQueue: this.isProcessingQueue,
      cacheVersion: this.cacheVersion,
      syncLocks: this.syncInvalidationLocks.size,

      redisEnabled: this.isInitialized && this.cache instanceof VortexorCache,
      forceRedisMode: this.forceRedisMode,
      memoryThreshold: this.forceRedisMode ? "DISABLED" : "500MB",
      environment: process.env.NODE_ENV || "development",
    }

    if (!this.isInitialized || this.cache instanceof EmergencyCache) {
      return {
        ...basicStats,
        memoryUsage: 0,
        status: "EMERGENCY_MODE",
        redisStatus: "DISABLED",
        recommendation: "Configure KV_URL e KV_TOKEN ou use FORCE_REDIS_CACHE=true",
        healthScore: 0, // Health score low in emergency mode
        // Provide default/undefined for optional properties when Redis is not enabled
        redisHits: undefined,
        redisMisses: undefined,
        redisHitRatio: undefined,
        combinedHitRatio: undefined,
      }
    }

    try {
      const metrics = this.cache.getMetrics()
      const combinedHitRatio =
        (this.cacheStats.hits + (metrics.totalHits || 0)) /
          (this.cacheStats.hits + this.cacheStats.misses + (metrics.totalHits || 0) + (metrics.totalMisses || 0)) || 0

      // New Health Score calculation
      let healthScore = 0;
      if (combinedHitRatio > 0.9) healthScore += 40; // Excellent hit ratio
      else if (combinedHitRatio > 0.7) healthScore += 30;
      else if (combinedHitRatio > 0.5) healthScore += 20;

      if (lruStats.lruHitRatio > 0.8) healthScore += 30; // Effective LRU
      else if (lruStats.lruHitRatio > 0.5) healthScore += 20;
      else if (lruStats.lruHitRatio > 0) healthScore += 10; // LRU is working

      if (errorRate === 0) healthScore += 20; // No errors
      else if (errorRate < 0.01) healthScore += 10;

      // Corrected access to queueLength and pendingOperations
      if (basicStats.queueLength === 0 && basicStats.pendingOperations === 0) healthScore += 10; // Empty queue

      healthScore = Math.min(100, healthScore); // Limit to 100

      return {
        ...basicStats,
        redisHits: metrics.totalHits || 0,
        redisMisses: metrics.totalMisses || 0,
        redisHitRatio: metrics.hitRatio || 0,
        combinedHitRatio,
        memoryUsage: metrics.memoryStats?.utilizationPercentage || 0,
        status:
          healthScore > 90
            ? "EXCELLENT"
            : healthScore > 70
              ? "GOOD"
              : healthScore > 50
                ? "FAIR"
                : "OPTIMIZING",
        redisStatus: "ENABLED",
        recommendation: "System operating with synchronous invalidation for maximum consistency!",
        healthScore: healthScore,
      }
    } catch (error) {
      console.error("❌ Error getting cache stats:", error); // Added error logging
      return {
        ...basicStats,
        memoryUsage: 0,
        status: "ERROR",
        redisStatus: "ERROR",
        recommendation: "Check Redis configuration",
        healthScore: 0,
        // Provide default/undefined for optional properties on error
        redisHits: undefined,
        redisMisses: undefined,
        redisHitRatio: undefined,
        combinedHitRatio: undefined,
      }
    }
  }

  clearRelatedEntries(patterns: string[]): number {
    let cleared = 0
    const keysToDelete: string[] = []

    for (const pattern of patterns) {
      const regexPattern = pattern.replace(/\*/g, ".*").replace(/\./g, "\\.")
      const regex = new RegExp(`^${regexPattern}$`)

      for (const [key] of this.basicCache.entries()) {
        if (regex.test(key) && !keysToDelete.includes(key)) {
          keysToDelete.push(key)
        }
      }
    }

    for (const key of keysToDelete) {
      this.basicCache.delete(key)
      this.accessOrder.delete(key)
      cleared++
      this.trackKeyInvalidation(key); // Track invalidation for dynamic TTL
    }

    return cleared
  }

  getAllKeys(): string[] {
    const keys: string[] = []
    for (const key of this.basicCache.keys()) {
      keys.push(key)
    }
    return keys
  }

  async detectDuplicates(): Promise<{
    duplicates: Array<{
      pattern: string
      keys: string[]
      count: number
    }>
    totalDuplicates: number
  }> {
    const keyGroups = new Map<string, string[]>()
    const allKeys = this.getAllKeys()

    for (const key of allKeys) {
      try {
        const parts = key.split(":")
        if (parts.length >= 4) {
          const [env, collection, operation] = parts
          const basePattern = `${env}:${collection}:${operation}`

          if (!keyGroups.has(basePattern)) {
            keyGroups.set(basePattern, [])
          }
          keyGroups.get(basePattern)!.push(key)
        }
      } catch (error) {
        console.warn(`⚠️ Error processing key for duplicate detection: ${key}`, error); // Added error logging
      }
    }

    const duplicates: Array<{
      pattern: string
      keys: string[]
      count: number
    }> = []

    let totalDuplicates = 0

    for (const [pattern, keys] of keyGroups) {
      if (keys.length > 1) {
        duplicates.push({
          pattern,
          keys: [...keys],
          count: keys.length,
        })
        totalDuplicates += keys.length - 1
      }
    }

    return { duplicates, totalDuplicates }
  }

  async cleanupDuplicates(): Promise<number> {
    const { duplicates } = await this.detectDuplicates()
    let cleaned = 0

    for (const duplicate of duplicates) {
      const sortedKeys = duplicate.keys.sort()
      for (let i = 0; i < sortedKeys.length - 1; i++) {
        await this.delete(sortedKeys[i])
        cleaned++
      }
    }
    return cleaned
  }

  async warmupCache(collectionName: string, commonQueries: Array<{ query: any; options?: any }>): Promise<void> {
    for (const { query, options } of commonQueries) {
      try {
        const cacheKey = `${process.env.NODE_ENV || "development"}:${collectionName}:findOne:${JSON.stringify(query)}`
        const cached = await this.get(cacheKey)
        if (!cached) {
          // Placeholder for actual MongoDB fetch and cache set
          // Example: const dataFromDb = await yourMongoDBClient.collection(collectionName).findOne(query);
          // if (dataFromDb) { await this.set(cacheKey, dataFromDb, options); }
        }
      } catch (error) {
        console.error(`❌ Error in cache warming for ${collectionName}:`, error); // Added error logging
      }
    }
  }

  async getCacheHealth(): Promise<{
    status: string
    issues: string[]
    recommendations: string[]
    metrics: CacheStats // Use the new interface here
  }> {
    const issues: string[] = []
    const recommendations: string[] = []
    const stats = this.getIntelligentCacheStats()

    // Now 'stats.combinedHitRatio' is correctly typed as optional, so we can check for its existence
    if (stats.combinedHitRatio !== undefined && stats.combinedHitRatio < 0.9) {
      issues.push("Combined Hit Ratio baixo (< 90%)")
      recommendations.push("Otimizar queries, aumentar TTL para dados menos voláteis.")
    }

    // lruStats.lruHits and lruStats.lruMisses are now part of LRUStats
    if (stats.lruStats.lruHitRatio < 0.8 && stats.lruStats.lruHits > 0) { // LRU is only relevant if there are hits
      issues.push("LRU Hit Ratio baixo (< 80%)")
      recommendations.push("Ajustar maxBasicCacheSize, revisar frequência de invalidações.")
    } else if (stats.lruStats.lruHits === 0 && stats.lruStats.lruMisses > 0) {
        issues.push("LRU is not being used effectively (0% LRU Hit Ratio)")
        recommendations.push("Check access patterns, ensure LRU keys are not being invalidated immediately after set.")
    }


    if (stats.errorRate > 0) {
      issues.push(`Error rate (${(stats.errorRate * 100).toFixed(2)}%)`)
      recommendations.push("Check Redis connectivity and error logs.")
    }

    if (stats.basicCacheSize / stats.maxBasicCacheSize > 0.95) {
      issues.push("In-memory cache near limit ( > 95%)")
      recommendations.push("Consider increasing 'maxBasicCacheSize' or optimizing memory usage.")
    }

    if (stats.lruEvictions > stats.totalSets * 0.2) {
      issues.push("Too many LRU evictions (> 20% of sets)")
      recommendations.push("In-memory cache too small for data volume.")
    }

    if (stats.queueLength > 50) {
      issues.push(`Operation queue too large (${stats.queueLength} items)`)
      recommendations.push("System might be overloaded, check Redis throughput.")
    }

    if (stats.syncLocks > 10) {
      issues.push(`Too many synchronous invalidation locks (${stats.syncLocks} locks)`)
      recommendations.push("Possible cache contention, investigate frequent write operations.")
    }

    const status = issues.length === 0 ? "HEALTHY" : issues.length < 3 ? "WARNING" : "CRITICAL"

    return {
      status,
      issues,
      recommendations,
      metrics: stats,
    }
  }

  async optimizeCache(): Promise<{
    actions: string[]
    improvements: any
  }> {
    const actions: string[] = []
    const health = await this.getCacheHealth()

    if (health.issues.includes("Combined Hit Ratio baixo (< 90%)")) {
      actions.push("Review of TTLs and access patterns recommended.")
    }

    if (health.issues.includes("LRU Hit Ratio baixo (< 80%)") || health.issues.includes("LRU is not being used effectively (0% LRU Hit Ratio)")) {
      const currentMemUsage = process.memoryUsage().heapUsed / 1024 / 1024;
      if (currentMemUsage < 1000) {
        this.setLRUMaxSize(this.maxBasicCacheSize + 100);
        actions.push(`LRU cache size increased to ${this.maxBasicCacheSize}.`);
      } else {
        actions.push("Consider application memory optimization or increasing resources for LRU.");
      }
    }

    if (health.issues.includes("In-memory cache near limit ( > 95%)") || health.issues.includes("Too many LRU evictions (> 20% of sets)")) {
      const cleaned = this.evictLRUEntries(Math.floor(this.maxBasicCacheSize * 0.1));
      actions.push(`${cleaned} old LRU entries proactively removed.`);
    }

    if (health.issues.includes("Operation queue too large")) {
      await this.processOperationQueue();
      actions.push("Operation queue processed immediately to alleviate load.");
    }

    if (health.issues.includes("Too many synchronous invalidation locks")) {
      this.syncInvalidationLocks.clear();
      actions.push("Orphaned invalidation locks cleared.");
    }

    await this.cleanupDuplicates();
    actions.push("Duplicate keys cleanup executed.");

    this.cleanup();
    actions.push("General proactive cleanup executed.");

    const newHealth = await this.getCacheHealth();

    return {
      actions,
      improvements: {
        before: health.metrics,
        after: newHealth.metrics,
        statusImprovement: health.status !== newHealth.status,
      },
    }
  }

  cleanup(): void {
    const now = Date.now()
    const toDelete: string[] = []

    for (const [key, value] of this.basicCache) {
      if (now - value.timestamp > value.ttl || value.version < this.cacheVersion) {
        toDelete.push(key)
      }
    }

    toDelete.forEach((key) => {
      this.basicCache.delete(key)
      this.accessOrder.delete(key)
    })

    this.operationQueue = this.operationQueue.filter((op) => now - op.timestamp <= 300000)

    const orphanedLocks: string[] = [];
    for (const [key, lockPromise] of this.syncInvalidationLocks) {
      Promise.race([lockPromise, new Promise((resolve) => setTimeout(resolve, 60000))])
        .then(() => {
          if (this.syncInvalidationLocks.has(key)) {
            orphanedLocks.push(key);
          }
        })
        .catch(() => { /* ignore errors */ });
    }

    if (orphanedLocks.length > 0) {
      orphanedLocks.forEach((key) => this.syncInvalidationLocks.delete(key));
    }

    const memUsage = process.memoryUsage().heapUsed / 1024 / 1024
    if (memUsage > 1000 && global.gc) {
      global.gc()
    }
  }

  async runDiagnostics(): Promise<any> {
    const memUsage = process.memoryUsage()
    const diagnostics = {
      timestamp: new Date().toISOString(),
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || "development",
        hasKvUrl: !!process.env.KV_URL,
        hasKvToken: !!process.env.KV_TOKEN,
        forceRedis: process.env.FORCE_REDIS_CACHE === "true",
      },
      cache: {
        initialized: this.isInitialized,
        type: this.cache instanceof VortexorCache ? "VortexorCache" : "EmergencyCache",
        forceRedisMode: this.forceRedisMode,
        version: this.cacheVersion,
      },
      queue: {
        pendingOperations: this.pendingOperations.size,
        queueLength: this.operationQueue.length,
        isProcessing: this.isProcessingQueue,
      },
      syncFeatures: {
        activeLocks: this.syncInvalidationLocks.size,
        syncInvalidationEnabled: true,
      },
      healthCheck: await this.healthCheck(),
      stats: this.getIntelligentCacheStats(),
    }

    return diagnostics
  }

  public enableDynamicTTL = true;
  public minDynamicTTL = 2 * 60 * 1000;
  public maxDynamicTTL = 30 * 60 * 1000;
  public dynamicTTLAcessThreshold = 20;
  public dynamicTTLInvalidationThreshold = 5;
  private keyAccessStats: Map<string, { accesses: number; invalidations: number; lastAccess: number; lastInvalidation: number }> = new Map();

  private getDynamicTTL(key: string, defaultTTL: number): number {
    if (!this.enableDynamicTTL) return defaultTTL;
    const stats = this.keyAccessStats.get(key);
    if (!stats) return defaultTTL;
    const now = Date.now();
    const recentAccesses = stats.lastAccess > now - 10 * 60 * 1000 ? stats.accesses : 0;
    const recentInvalidations = stats.lastInvalidation > now - 10 * 60 * 1000 ? stats.invalidations : 0;

    if (recentAccesses > this.dynamicTTLAcessThreshold && recentInvalidations > this.dynamicTTLInvalidationThreshold) {
      return this.minDynamicTTL;
    }
    if (recentAccesses > this.dynamicTTLAcessThreshold) {
      return Math.max(this.minDynamicTTL, defaultTTL / 2);
    }
    if (recentAccesses < 3 && recentInvalidations < 2) {
      return this.maxDynamicTTL;
    }
    return defaultTTL;
  }

  private trackKeyAccess(key: string) {
    const now = Date.now();
    const stats = this.keyAccessStats.get(key) || { accesses: 0, invalidations: 0, lastAccess: 0, lastInvalidation: 0 };
    stats.accesses++;
    stats.lastAccess = now;
    this.keyAccessStats.set(key, stats);
  }

  private trackKeyInvalidation(key: string) {
    const now = Date.now();
    const stats = this.keyAccessStats.get(key) || { accesses: 0, invalidations: 0, lastAccess: 0, lastInvalidation: 0 };
    stats.invalidations++;
    stats.lastInvalidation = now;
    this.keyAccessStats.set(key, stats);
  }
}
