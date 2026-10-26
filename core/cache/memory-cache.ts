import type { CacheEntry } from "../types/cache"
import { MetricsCollector } from "../monitoring/metrics"

export class MemoryCache {
  private static instance: MemoryCache
  private cache: Map<string, CacheEntry>
  private maxSize: number
  private currentSize: number
  private metrics: MetricsCollector
  private accessOrder: string[]
  private emergencyMode = false

  private constructor(maxSize: number = 2 * 1024 * 1024) {
    // ✅ 2MB ao invés de 500KB
    this.cache = new Map()
    this.maxSize = maxSize
    this.currentSize = 0
    this.metrics = MetricsCollector.getInstance()
    this.accessOrder = []

    // ✅ VERIFICAÇÃO MENOS AGRESSIVA - a cada 30 segundos
    setInterval(() => {
      this.checkMemoryAndCleanup()
    }, 30000)
  }

  static getInstance(maxSize?: number): MemoryCache {
    if (!MemoryCache.instance) {
      MemoryCache.instance = new MemoryCache(maxSize)
    }
    return MemoryCache.instance
  }

  private checkMemoryAndCleanup(): void {
    const memUsage = process.memoryUsage()
    const memoryMB = memUsage.heapUsed / 1024 / 1024

    // ✅ THRESHOLD MAIS REALISTA - 200MB ao invés de 100MB
    if (memoryMB > 200) {
      this.emergencyMode = true
      this.aggressiveCleanup()
    } else if (memoryMB < 100) {
      this.emergencyMode = false
    }

    // ✅ LIMPEZA MODERADA se > 150MB
    if (memoryMB > 150) {
      this.moderateCleanup()
    }
  }

  set<T>(key: string, entry: CacheEntry<T>): boolean {
    // ✅ REJEITAR APENAS EM EMERGÊNCIA REAL
    if (this.emergencyMode) {
      return false
    }

    // ✅ ACEITAR ENTRADAS ATÉ 50KB (ao invés de 5KB)
    if (entry.size > 51200) {
      return false
    }

    // ✅ ACEITAR ATÉ 500 ENTRADAS (ao invés de 100)
    if (this.cache.size >= 500) {
      this.evictOldest()
    }

    // Verificar se cabe
    if (this.currentSize + entry.size > this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, {
      ...entry,
      lastAccessed: Date.now(),
      accessCount: 1,
    })

    this.currentSize += entry.size
    this.accessOrder.push(key)
    this.metrics.updateMemoryUsage(this.currentSize)

    return true
  }

  get<T>(key: string): CacheEntry<T> | null {
    // NÃO retornar nada em modo de emergência
    if (this.emergencyMode) {
      return null
    }

    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // ✅ TTL MAIS REALISTA - 15 minutos ao invés de 30 segundos
    if (Date.now() > entry.timestamp + 900000) {
      this.delete(key)
      return null
    }

    entry.lastAccessed = Date.now()
    entry.accessCount++

    return entry as CacheEntry<T>
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (entry) {
      this.cache.delete(key)
      this.currentSize -= entry.size
      this.removeFromAccessOrder(key)
      this.metrics.updateMemoryUsage(this.currentSize)
      return true
    }
    return false
  }

  clear(): void {
    this.cache.clear()
    this.accessOrder = []
    this.currentSize = 0
    this.metrics.updateMemoryUsage(0)
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      currentSize: this.currentSize,
      maxSize: this.maxSize,
      utilizationPercentage: (this.currentSize / this.maxSize) * 100,
      emergencyMode: this.emergencyMode,
    }
  }

  // ✅ LIMPEZA MODERADA AO INVÉS DE AGRESSIVA
  private moderateCleanup(): void {
    // Remover apenas 50% dos itens mais antigos
    const itemsToRemove = Math.floor(this.cache.size * 0.5)

    for (let i = 0; i < itemsToRemove && this.accessOrder.length > 0; i++) {
      this.evictOldest()
    }
  }

  private aggressiveCleanup(): void {
    // Limpar TUDO apenas em emergência real
    this.clear()

    // Forçar GC apenas se necessário
    if (global.gc) {
      global.gc()
    }
  }

  private evictOldest(): void {
    if (this.accessOrder.length > 0) {
      const oldestKey = this.accessOrder.shift()
      if (oldestKey) {
        const entry = this.cache.get(oldestKey)
        if (entry) {
          this.cache.delete(oldestKey)
          this.currentSize -= entry.size
        }
      }
    }
  }
}
