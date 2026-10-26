import crypto from "crypto"

export class VortexorQueryOptimizer {
  private static instance: VortexorQueryOptimizer
  private queryPatterns: Map<string, QueryPattern>
  private indexSuggestions: Map<string, IndexSuggestion[]>
  private executionPlans: Map<string, ExecutionPlan>
  private performanceMetrics: Map<string, PerformanceMetric[]>
  private isMonitoringActive = false
  private maxCacheSize = 200 // ✅ Reduzido drasticamente de 1000

  private constructor() {
    this.queryPatterns = new Map()
    this.indexSuggestions = new Map()
    this.executionPlans = new Map()
    this.performanceMetrics = new Map()

    // ✅ NÃO iniciar análise automática - só sob demanda
  }

  static getInstance(): VortexorQueryOptimizer {
    if (!VortexorQueryOptimizer.instance) {
      VortexorQueryOptimizer.instance = new VortexorQueryOptimizer()
    }
    return VortexorQueryOptimizer.instance
  }

  // ✅ Iniciar monitoramento apenas quando necessário
  startMonitoring(): void {
    if (this.isMonitoringActive) return

    this.isMonitoringActive = true
    this.startLightweightQueryAnalysis()
  }

  async analyzeQuery(query: any, collection: string): Promise<OptimizedQuery> {
    const queryHash = this.generateQueryHash(query)
    const startTime = Date.now()

    // ✅ Registrar padrão apenas se monitoramento ativo
    if (this.isMonitoringActive) {
      this.recordQueryPattern(queryHash, query, collection)
    }

    // ✅ Otimização básica e rápida
    const optimizedQuery = await this.basicQueryOptimization(query, collection)

    // ✅ Sugestões básicas de índices
    const indexSuggestions = this.basicIndexSuggestions(query, collection)

    // ✅ Plano de execução simplificado
    const executionPlan = this.createBasicExecutionPlan(optimizedQuery, collection)

    const executionTime = Date.now() - startTime

    // ✅ Registrar métricas apenas se monitoramento ativo
    if (this.isMonitoringActive) {
      this.recordPerformanceMetric(queryHash, collection, executionTime)
    }

    return {
      originalQuery: query,
      optimizedQuery,
      indexSuggestions,
      executionPlan,
      estimatedPerformanceGain: this.calculateBasicPerformanceGain(query, optimizedQuery),
      executionTime,
    }
  }

  // ✅ Otimização básica sem processamento pesado
  private async basicQueryOptimization(query: any, collection: string): Promise<any> {
    let optimized = { ...query }

    // ✅ Otimizações básicas e rápidas
    optimized = this.optimizeComparisonOperators(optimized)
    optimized = this.basicProjectionOptimization(optimized)
    optimized = this.basicLimitOptimization(optimized)

    return optimized
  }

  private optimizeComparisonOperators(query: any): any {
    const optimized = { ...query }

    // ✅ Conversões básicas
    if (optimized.$ne && Array.isArray(optimized.$ne)) {
      optimized.$nin = optimized.$ne
      delete optimized.$ne
    }

    return optimized
  }

  private basicProjectionOptimization(query: any): any {
    // ✅ Adicionar projeção básica se não existir
    if (!query.projection && !query.select) {
      return {
        ...query,
        projection: { _id: 1 },
      }
    }
    return query
  }

  private basicLimitOptimization(query: any): any {
    // ✅ Limitar resultados excessivos
    if (query.limit && query.limit > 1000) {
      query.limit = 1000
    }

    return query
  }

  // ✅ Sugestões básicas de índices
  private basicIndexSuggestions(query: any, collection: string): IndexSuggestion[] {
    const suggestions: IndexSuggestion[] = []
    const queryFields = this.extractBasicQueryFields(query)

    // ✅ Sugerir apenas índices essenciais
    queryFields.slice(0, 3).forEach((field) => {
      // Máximo 3 sugestões
      if (["_id", "email", "username", "status"].includes(field)) {
        suggestions.push({
          type: "single",
          fields: [field],
          collection,
          priority: "high",
          estimatedImpact: "high",
          reason: `Campo '${field}' usado frequentemente`,
        })
      }
    })

    return suggestions
  }

  private extractBasicQueryFields(query: any, fields: string[] = []): string[] {
    if (typeof query === "object" && query !== null) {
      for (const [key, value] of Object.entries(query)) {
        if (!key.startsWith("$") && fields.length < 5) {
          // ✅ Limitar campos
          fields.push(key)
        }
      }
    }

    return [...new Set(fields)]
  }

  // ✅ Plano de execução básico
  private createBasicExecutionPlan(query: any, collection: string): ExecutionPlan {
    return {
      stages: [
        {
          stage: "COLLSCAN",
          description: "Collection scan",
          estimatedCost: 100, // ✅ Custo reduzido
          optimizable: true,
        },
        {
          stage: "FILTER",
          description: "Apply filters",
          estimatedCost: 50,
          optimizable: false,
        },
      ],
      totalEstimatedCost: 150,
      canUseIndex: false,
      suggestedOptimizations: ["Criar índice básico"],
    }
  }

  private calculateBasicPerformanceGain(original: any, optimized: any): number {
    // ✅ Cálculo simplificado
    let gain = 0

    if (JSON.stringify(original) !== JSON.stringify(optimized)) {
      gain += 15
    }

    if (optimized.projection) {
      gain += 10
    }

    return Math.min(gain, 50) // ✅ Máximo 50% de ganho
  }

  private recordQueryPattern(hash: string, query: any, collection: string): void {
    // ✅ Limitar tamanho do cache
    if (this.queryPatterns.size >= this.maxCacheSize) {
      const firstKey = this.queryPatterns.keys().next().value
      if (firstKey) {
        this.queryPatterns.delete(firstKey)
      }
    }

    const existing = this.queryPatterns.get(hash)

    if (existing) {
      existing.frequency++
      existing.lastUsed = Date.now()
    } else {
      this.queryPatterns.set(hash, {
        hash,
        query,
        collection,
        frequency: 1,
        firstSeen: Date.now(),
        lastUsed: Date.now(),
        avgExecutionTime: 0,
      })
    }
  }

  private recordPerformanceMetric(queryHash: string, collection: string, executionTime: number): void {
    // ✅ Limitar métricas armazenadas
    const metrics = this.performanceMetrics.get(queryHash) || []

    metrics.push({
      timestamp: Date.now(),
      executionTime,
      collection,
      memoryUsage: process.memoryUsage().heapUsed,
    })

    // ✅ Manter apenas os últimos 10 registros
    if (metrics.length > 10) {
      metrics.splice(0, metrics.length - 10)
    }

    this.performanceMetrics.set(queryHash, metrics)
  }

  private generateQueryHash(query: any): string {
    return crypto.createHash("md5").update(JSON.stringify(query)).digest("hex")
  }

  // ✅ Análise leve de queries
  private startLightweightQueryAnalysis(): void {
    setInterval(() => {
      this.lightweightPatternAnalysis()
    }, 120000) // ✅ A cada 2 minutos ao invés de 1
  }

  private lightweightPatternAnalysis(): void {
    if (this.queryPatterns.size === 0) return

    const patterns = Array.from(this.queryPatterns.values())

    // ✅ Análise básica apenas
    const frequentQueries = patterns
      .filter((p) => p.frequency > 5) // ✅ Threshold menor
      .slice(0, 5) // ✅ Máximo 5

    // ✅ Limpeza automática
    this.cleanupOldPatterns()
  }

  // ✅ Limpeza de padrões antigos
  private cleanupOldPatterns(): void {
    const now = Date.now()
    const maxAge = 1800000 // ✅ 30 minutos ao invés de 1 hora
    const toDelete: string[] = []

    // ✅ Limpar mais agressivamente
    for (const [hash, pattern] of this.queryPatterns) {
      if (now - pattern.lastUsed > maxAge || this.queryPatterns.size > this.maxCacheSize) {
        toDelete.push(hash)
      }
    }

    toDelete.forEach((hash) => {
      this.queryPatterns.delete(hash)
      this.performanceMetrics.delete(hash)
      this.executionPlans.delete(hash)
    })

    // ✅ Forçar GC se muitos padrões
    if (this.queryPatterns.size > this.maxCacheSize * 0.8) {
      if (global.gc) {
        global.gc()
      }
    }
  }

  // ✅ Métodos públicos otimizados
  getOptimizationReport(): OptimizationReport {
    const patterns = Array.from(this.queryPatterns.values())
    const suggestions = Array.from(this.indexSuggestions.values()).flat()

    return {
      totalQueries: patterns.length,
      frequentQueries: patterns.filter((p) => p.frequency > 5).length,
      slowQueries: patterns.filter((p) => p.avgExecutionTime > 500).length, // ✅ Threshold menor
      indexSuggestions: suggestions.length,
      collections: [...new Set(patterns.map((p) => p.collection))],
      topOptimizations: ["Implementar índices básicos", "Otimizar queries frequentes", "Usar projeções"],
    }
  }

  getQueryStats(collection?: string): QueryStats {
    const patterns = Array.from(this.queryPatterns.values())
    const filtered = collection ? patterns.filter((p) => p.collection === collection) : patterns

    const totalQueries = filtered.reduce((sum, p) => sum + p.frequency, 0)
    const avgExecutionTime =
      filtered.length > 0 ? filtered.reduce((sum, p) => sum + p.avgExecutionTime, 0) / filtered.length : 0

    return {
      totalPatterns: filtered.length,
      totalExecutions: totalQueries,
      avgExecutionTime,
      collections: [...new Set(filtered.map((p) => p.collection))],
      mostFrequent: filtered.sort((a, b) => b.frequency - a.frequency).slice(0, 3),
      slowest: filtered.sort((a, b) => b.avgExecutionTime - a.avgExecutionTime).slice(0, 3),
      frequentQueries: filtered.filter((p) => p.frequency > 5).length,
    }
  }
}

// ✅ Interfaces mantidas
interface QueryPattern {
  hash: string
  query: any
  collection: string
  frequency: number
  firstSeen: number
  lastUsed: number
  avgExecutionTime: number
}

interface IndexSuggestion {
  type: "single" | "composite" | "text" | "geo"
  fields: string[]
  collection: string
  priority: "low" | "medium" | "high" | "critical"
  estimatedImpact: "low" | "medium" | "high" | "very_high"
  reason: string
}

interface ExecutionPlan {
  stages: ExecutionStage[]
  totalEstimatedCost: number
  canUseIndex: boolean
  suggestedOptimizations: string[]
}

interface ExecutionStage {
  stage: string
  description: string
  estimatedCost: number
  optimizable: boolean
}

interface OptimizedQuery {
  originalQuery: any
  optimizedQuery: any
  indexSuggestions: IndexSuggestion[]
  executionPlan: ExecutionPlan
  estimatedPerformanceGain: number
  executionTime: number
}

interface PerformanceMetric {
  timestamp: number
  executionTime: number
  collection: string
  memoryUsage: number
}

interface OptimizationReport {
  totalQueries: number
  frequentQueries: number
  slowQueries: number
  indexSuggestions: number
  collections: string[]
  topOptimizations: string[]
}

interface QueryStats {
  totalPatterns: number
  totalExecutions: number
  avgExecutionTime: number
  collections: string[]
  mostFrequent: QueryPattern[]
  slowest: QueryPattern[]
  frequentQueries: number
}
