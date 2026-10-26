export enum CachePriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  CRITICAL = 3,
}

export interface CacheEntry<T = any> {
  data: T
  etag: string
  timestamp: number
  ttl: number
  accessCount: number
  lastAccessed: number
  size: number
  compressed: boolean
  tags: string[]
  priority: CachePriority
}

export interface CacheConfig {
  maxMemorySize: number
  defaultTTL: number
  compressionThreshold: number
  enablePredictiveCache: boolean
  enableWarmup: boolean
  batchSize: number
  redisConfig?: {
    url: string
    token: string
    maxRetries: number
    retryDelay: number
  }
}

export interface CacheMetrics {
  hits: number
  misses: number
  evictions: number
  totalRequests: number
  averageResponseTime: number
  memoryUsage: number
  redisConnections: number
  hitRatio?: number
  totalHits?: number
  totalMisses?: number
  memoryStats?: {
    utilizationPercentage: number
  }
}

export interface QueryPattern {
  collection: string
  queryHash: string
  frequency: number
  lastUsed: number
  avgResponseTime: number
  predictedNextAccess: number
}


 
export interface LRUStats {
  totalEntries: number
  maxSize: number
  evictions: number
  hits: number
  misses: number
  hitRatio: number
  averageAccessCount: number
  oldestEntry: number
  newestEntry: number
}

export interface CacheOptions {
  ttl?: number
  priority?: CachePriority
}
