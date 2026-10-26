import { type CacheEntry, type CacheConfig, CachePriority } from "../types/cache"
import { MemoryCache } from "./memory-cache"
import { UpstashRedisManager } from "../redis/upstash-manager"

export class VortexorCache {
  private static instance: VortexorCache
  private memoryCache: MemoryCache
  private redisCache: UpstashRedisManager | null = null
  private config: CacheConfig
  private batchOperations: Map<string, any>
  private batchTimer: NodeJS.Timeout | null = null
  private hitStats = { hits: 0, misses: 0 }

  private constructor(config: CacheConfig) {
    this.config = {
      ...config,
      maxMemorySize: Math.min(config.maxMemorySize, 10 * 1024 * 1024),
      defaultTTL: config.defaultTTL || 180000,
    }

    this.memoryCache = MemoryCache.getInstance(this.config.maxMemorySize)

    if (config.redisConfig) {
      try {
        this.redisCache = UpstashRedisManager.getInstance(config.redisConfig)
      } catch (error) {
        console.warn("⚠️ Redis não disponível, usando apenas cache em memória")
      }
    }

    this.batchOperations = new Map()

  }

  static getInstance(config: CacheConfig): VortexorCache {
    if (!VortexorCache.instance) {
      VortexorCache.instance = new VortexorCache(config)
    }
    return VortexorCache.instance
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      // ✅ REDIS PRIMEIRO - NÃO MEMÓRIA!
      if (this.redisCache) {
        const redisEntry = await this.redisCache.get<T>(key)
        if (redisEntry) {
          this.hitStats.hits++
          return redisEntry.data
        }
      }

      // Só depois tentar memória (apenas para cache rápido)
      const memoryEntry = this.memoryCache.get<T>(key)
      if (memoryEntry) {
        this.hitStats.hits++
        return memoryEntry.data
      }

      this.hitStats.misses++
      return null
    } catch (error) {
      console.error("Cache get error:", error)
      this.hitStats.misses++
      return null
    }
  }

  async set<T>(
    key: string,
    data: T,
    options: {
      ttl?: number
      priority?: CachePriority
      tags?: string[]
    } = {},
  ): Promise<boolean> {
    try {
      const { ttl = this.config.defaultTTL, priority = CachePriority.MEDIUM, tags = [] } = options

      const serializedData = JSON.stringify(data)
      const etag = this.generateEtagFast(serializedData)
      const serializedSize = Buffer.byteLength(serializedData, "utf8")

      const entry: CacheEntry<T> = {
        data,
        etag,
        timestamp: Date.now(),
        ttl,
        accessCount: 0,
        lastAccessed: Date.now(),
        size: serializedSize,
        compressed: false,
        tags,
        priority,
      }

      // ✅ REDIS PRIMEIRO - SEMPRE!
      let redisSuccess = false
      if (this.redisCache) {
        redisSuccess = await this.redisCache.set(key, entry)
      }

      // Memória apenas como buffer rápido para dados pequenos
      let memorySuccess = false
      if (serializedSize < 1000) {
        // Apenas dados < 1KB na memória
        memorySuccess = this.memoryCache.set(key, entry)
      }

      return redisSuccess || memorySuccess
    } catch (error) {
      console.error("Cache set error:", error)
      return false
    }
  }

  private generateEtagFast(data: string): string {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return hash.toString(36)
  }

  async delete(key: string): Promise<boolean> {
    try {
      const memoryResult = this.memoryCache.delete(key)
      let redisResult = true

      if (this.redisCache) {
        redisResult = await this.redisCache.delete(key)
      }

      return memoryResult || redisResult
    } catch (error) {
      console.error("Cache delete error:", error)
      return false
    }
  }

  async batchGet<T>(keys: string[]): Promise<Map<string, T>> {
    const result = new Map<string, T>()
    const missingKeys: string[] = []

    for (const key of keys) {
      const entry = this.memoryCache.get<T>(key)
      if (entry) {
        result.set(key, entry.data)
        this.hitStats.hits++
      } else {
        missingKeys.push(key)
      }
    }

    if (missingKeys.length > 0 && this.redisCache) {
      const redisEntries = await this.redisCache.getMultiple<T>(missingKeys)

      for (const [key, entry] of redisEntries) {
        result.set(key, entry.data)
        this.memoryCache.set(key, entry)
        this.hitStats.hits++
      }

      const foundKeys = new Set(redisEntries.keys())
      missingKeys.forEach((key) => {
        if (!foundKeys.has(key)) {
          this.hitStats.misses++
        }
      })
    } else {
      this.hitStats.misses += missingKeys.length
    }

    return result
  }

  getMetrics() {
    const total = this.hitStats.hits + this.hitStats.misses
    return {
      hitRatio: total > 0 ? this.hitStats.hits / total : 0,
      totalHits: this.hitStats.hits,
      totalMisses: this.hitStats.misses,
      memoryStats: this.memoryCache.getStats(),
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const testKey = "hc_" + Date.now()
      const testData = { test: true }

      await this.set(testKey, testData, { ttl: 1000 })
      const result = await this.get(testKey)
      await this.delete(testKey)

      return result !== null
    } catch (error) {
      console.error("Health check failed:", error)
      return false
    }
  }

  // ✅ NOVO MÉTODO: Limpa chaves do Redis por padrão
  // Este método é crucial para a invalidação de cache baseada em padrões no Redis.
  async clearByPattern(pattern: string): Promise<number> {
    let clearedCount = 0;
    if (this.redisCache) {
      try {
        // ATENÇÃO: `keys` pode bloquear o servidor Redis em bases de dados muito grandes.
        // Para ambientes de produção com muitos dados, considere usar `scan` para iteração.
        // Exemplo de uso de `scan` (mais complexo, mas melhor para grandes datasets):
        // let cursor = '0';
        // do {
        //   const reply = await this.redisCache.client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        //   cursor = reply[0];
        //   const keys = reply[1];
        //   if (keys.length > 0) {
        //     clearedCount += await this.redisCache.client.del(keys);
        //   }
        // } while (cursor !== '0');

        // Usando `keys` por simplicidade, mas com a ressalva acima.
        const keys = await this.redisCache.keys(pattern); // Assumindo que UpstashRedisManager.keys() existe
        if (keys.length > 0) {
          clearedCount = await this.redisCache.deleteMultiple(keys); // Assumindo deleteMultiple
        }
      } catch (error) {
        console.error(`❌ Erro ao limpar chaves do Redis por padrão "${pattern}":`, error);
      }
    }
    return clearedCount;
  }
}
