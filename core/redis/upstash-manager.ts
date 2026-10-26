import { Redis } from "@upstash/redis"
import type { CacheEntry, CacheConfig } from "../types/cache"

export class UpstashRedisManager {
  private static instance: UpstashRedisManager
  private redis: Redis
  private config: CacheConfig["redisConfig"]
  private connectionHealthy = true
  private lastHealthCheck = 0
  private stats = { sets: 0, gets: 0, deletes: 0, errors: 0 }

  private constructor(config: CacheConfig["redisConfig"]) {
    if (!config) {
      throw new Error("Redis config is required")
    }

    this.config = config
    this.redis = new Redis({
      url: config.url,
      token: config.token,
    })

    setInterval(() => {
      this.performHealthCheck()
    }, 60000)
  }

  static getInstance(config: CacheConfig["redisConfig"]): UpstashRedisManager {
    if (!UpstashRedisManager.instance && config) {
      UpstashRedisManager.instance = new UpstashRedisManager(config)
    }
    return UpstashRedisManager.instance
  }

  async set<T>(key: string, entry: CacheEntry<T>): Promise<boolean> {
    try {
      this.stats.sets++

      const serializedEntry = JSON.stringify({
        data: entry.data,
        timestamp: entry.timestamp,
        ttl: entry.ttl,
        priority: entry.priority,
      })

      if (serializedEntry.length > 2000000) {
        console.warn("Dados muito grandes para Redis (>2MB), ignorando...")
        return false
      }

      const ttlSeconds = Math.max(Math.floor(entry.ttl / 1000), 300)

      await this.redis.setex(key, ttlSeconds, serializedEntry)

      return true
    } catch (error) {
      console.error("Redis set error:", error)
      this.stats.errors++
      this.connectionHealthy = false
      return false
    }
  }

  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      this.stats.gets++

      const result = await this.redis.get(key)

      if (!result) {
        return null
      }

      let parsedData: any;

      if (typeof result === 'string') {
        try {
          parsedData = JSON.parse(result);
        } catch (parseError: any) {
          console.warn(`Redis get: Valor para a chave '${key}' é uma string malformada. Erro: ${parseError.message}`);
          this.stats.errors++;
          return null;
        }
      } else if (typeof result === 'object' && result !== null) {
        parsedData = result;
      } else {
        console.warn(`Redis get: Valor para a chave '${key}' não é uma string ou objeto válido, mas sim '${typeof result}'.`);
        this.stats.errors++;
        return null;
      }

      if (!parsedData || typeof parsedData.data === 'undefined' || typeof parsedData.timestamp === 'undefined' || typeof parsedData.ttl === 'undefined') {
        console.warn(`Redis get: Estrutura de dados inválida para a chave '${key}'.`);
        this.stats.errors++;
        return null;
      }

      return {
        data: parsedData.data,
        etag: "",
        timestamp: parsedData.timestamp,
        ttl: parsedData.ttl,
        accessCount: 1,
        lastAccessed: Date.now(),
        size: 0,
        compressed: false,
        tags: [],
        priority: parsedData.priority,
      }
    } catch (error) {
      console.error("Redis get error:", error)
      this.stats.errors++
      this.connectionHealthy = false
      return null
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      this.stats.deletes++

      await this.redis.del(key)

      return true
    } catch (error) {
      console.error("Redis delete error:", error)
      this.stats.errors++
      this.connectionHealthy = false
      return false
    }
  }

  async getMultiple<T>(keys: string[]): Promise<Map<string, CacheEntry<T>>> {
    const result = new Map<string, CacheEntry<T>>()

    if (keys.length === 0) return result

    try {
      this.stats.gets += keys.length

      const values = await this.redis.mget(...keys)

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = values[i];

        if (!value) {
          continue;
        }

        let parsedData: any;

        if (typeof value === 'string') {
          try {
            parsedData = JSON.parse(value);
          } catch (parseError: any) {
            console.warn(`Falha ao analisar a entrada para a chave ${key}: string malformada. Erro: ${parseError.message}`);
            this.stats.errors++;
            continue;
          }
        } else if (typeof value === 'object' && value !== null) {
          parsedData = value;
        } else {
          console.warn(`Redis mget: Valor para a chave '${key}' não é uma string ou objeto válido, mas sim '${typeof value}'.`);
          this.stats.errors++;
          continue;
        }

        if (!parsedData || typeof parsedData.data === 'undefined' || typeof parsedData.timestamp === 'undefined' || typeof parsedData.ttl === 'undefined') {
          console.warn(`Redis mget: Estrutura de dados inválida para a chave '${key}'.`);
          this.stats.errors++;
          continue;
        }

        result.set(key, {
          data: parsedData.data,
          etag: "",
          timestamp: parsedData.timestamp,
          ttl: parsedData.ttl,
          accessCount: 1,
          lastAccessed: Date.now(),
          size: 0,
          compressed: false,
          tags: [],
          priority: parsedData.priority,
        });
      }

    } catch (error) {
      console.error("Redis mget error:", error)
      this.stats.errors++
      this.connectionHealthy = false
    }

    return result
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const testKey = "health_check_" + Date.now()
      await this.redis.setex(testKey, 10, "health_check")
      await this.redis.get(testKey)
      await this.redis.del(testKey)

      this.connectionHealthy = true
      this.lastHealthCheck = Date.now()
    } catch (error) {
      console.error("Verificação de saúde do Redis falhou:", error)
      this.connectionHealthy = false
    }
  }

  getStats() {
    return {
      ...this.stats,
      connectionHealthy: this.connectionHealthy,
      lastHealthCheck: this.lastHealthCheck,
      errorRate: this.stats.errors / (this.stats.sets + this.stats.gets + this.stats.deletes) || 0,
    }
  }

  isHealthy(): boolean {
    return this.connectionHealthy && Date.now() - this.lastHealthCheck < 120000
  }

  async keys(pattern: string): Promise<string[]> {
    const foundKeys: string[] = [];
    let cursor = '0';
    do {
      const [nextCursor, keys] = await this.redis.scan(cursor, { match: pattern, count: 100 });
      foundKeys.push(...keys);
      cursor = nextCursor;
    } while (cursor !== '0');
    return foundKeys;
  } 

  async deleteMultiple(keys: string[]): Promise<number> {
    if (keys.length === 0) {
      return 0;
    }
    try {
      this.stats.deletes += keys.length;
      const deletedCount = await this.redis.del(...keys);
      return deletedCount;
    } catch (error) {
      console.error("Redis deleteMultiple error:", error);
      this.stats.errors++;
      return 0;
    }
  }
}
