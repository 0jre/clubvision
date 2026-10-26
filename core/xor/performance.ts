import type { MongoClient, Db } from "mongodb"
import { VortexorUltimateSystem } from "./security"
import { VortexorPerformanceOptimizer } from "../performace/performance-optimizer"
import { VortexorQueryOptimizer } from "../performace/query-optimizer"
import { IntelligentCacheSystem } from "../performace/intelligent-cache"

// Interface para as estatísticas do sistema
interface SystemStats {
  uptime: number;
  memory: NodeJS.MemoryUsage;
  timestamp: string;
}

// Interface para as métricas do IntelligentCacheSystem (reflete o retorno de getIntelligentCacheStats())
interface IntelligentCacheStats {
  basicCacheSize: number;
  maxBasicCacheSize: number;
  totalHits: number;
  totalMisses: number;
  totalSets: number;
  totalErrors: number;
  totalInvalidations: number;
  hitRatio: number; // Overall hitRatio for IntelligentCacheSystem
  errorRate: number;
  lruHits: number; // Top-level lruHits
  lruMisses: number; // Top-level lruMisses
  lruEvictions: number; // Top-level lruEvictions
  lruStats: { // Nested LRUStats object
    totalEntries: number;
    maxSize: number;
    evictions: number; // Corrected property name from 'lruEvictions' to 'evictions'
    averageAccessCount: number;
    oldestEntry: number;
    newestEntry: number;
    lruHitRatio: number;
  };
  pendingOperations: number;
  queueLength: number;
  isProcessingQueue: boolean; // Adicionado
  cacheVersion: number; // Adicionado
  syncLocks: number;
  redisEnabled: boolean; // Adicionado
  forceRedisMode: boolean; // Adicionado
  memoryThreshold: string; // Adicionado
  environment: string; // Adicionado
  redisHits?: number;
  redisMisses?: number;
  redisHitRatio?: number;
  combinedHitRatio?: number;
  memoryUsage: number;
  status: string;
  redisStatus: string;
  recommendation: string; // Adicionado
  healthScore: number; // Adicionado
}

// Interface para as métricas do PerformanceOptimizer (ajustada para incluir propriedades do retorno real)
interface PerformanceOptimizerMetrics {
  workerPool: {
    size: number;
    optimal?: number;
    fullyInitialized?: boolean;
  };
  caches: Record<string, any>;
  cpuUtilization?: number;
  eventLoopLag?: number;
  system?: { // Adicionado, se o otimizador retornar métricas de sistema
    memory: NodeJS.MemoryUsage;
    uptime: number;
  };
}

// Interface para as métricas do QueryOptimizer (ajustada para incluir propriedades do retorno real)
interface QueryOptimizerMetrics {
  totalPatterns: number;
  frequentQueries: number;
  slowQueriesDetected?: number;
  optimizationSuccessRate?: number;
  // Adicione outras propriedades que getQueryStats() possa retornar
}

// Interface para o resultado consolidado de performance
interface ConsolidatedPerformance {
  overallPerformance: string;
  healthScore: number;
  status: string;
  recommendations: string[];
}

// Interface para o retorno da inicialização
interface InitializationResult {
  performance: string;
  features: string[];
  stats?: ConsolidatedPerformance;
  error?: string;
}

export class VortexorUltimatePerformanceSystem {
  private static instance: VortexorUltimatePerformanceSystem
  private baseSystem: VortexorUltimateSystem
  private performanceOptimizer: VortexorPerformanceOptimizer | null = null
  private queryOptimizer: VortexorQueryOptimizer | null = null
  private intelligentCache: IntelligentCacheSystem | null = null
  private isInitialized = false
  private initializationPromise: Promise<InitializationResult> | null = null;

  private constructor() {
    this.baseSystem = VortexorUltimateSystem.getInstance()
  }

  static getInstance(): VortexorUltimatePerformanceSystem {
    if (!VortexorUltimatePerformanceSystem.instance) {
      VortexorUltimatePerformanceSystem.instance = new VortexorUltimatePerformanceSystem()
    }
    return VortexorUltimatePerformanceSystem.instance
  }

  /**
   * Inicializa o sistema de performance do Vortexor.
   * Pode receber opcionalmente o cliente e o DB do MongoDB para inicialização do sistema de segurança.
   */
  async initialize(client?: MongoClient, db?: Db): Promise<InitializationResult> {
    if (this.isInitialized && this.initializationPromise) {
      return this.initializationPromise;
    }

    if (this.isInitialized) {
      return {
        performance: "ALREADY_INITIALIZED",
        features: ["Lightweight Cache", "Basic Optimization", "Full Monitoring"],
        stats: await this.getPerformanceStats().then(s => s.consolidated),
      };
    }

    this.initializationPromise = (async () => {
      try {
        // Inicialização paralela de componentes
        const [baseSystemInitResult] = await Promise.all([
          client && db ? this.baseSystem.initialize(client, db) : Promise.resolve(null),
          this.initializeLazyComponents(),
        ]);

        this.isInitialized = true;

        const stats = await this.getPerformanceStats();

        let performanceStatus: string;
        if (stats.consolidated.healthScore >= 90) {
          performanceStatus = "ULTRA_OPTIMIZED";
        } else if (stats.consolidated.healthScore >= 70) {
          performanceStatus = "HIGHLY_OPTIMIZED";
        } else if (stats.consolidated.healthScore >= 50) {
          performanceStatus = "OPTIMIZED";
        } else {
          performanceStatus = "SUBOPTIMAL";
        }

        return {
          ...baseSystemInitResult,
          performance: performanceStatus,
          features: ["Memory Optimized", "Lazy Loading", "Minimal Overhead", "Comprehensive Monitoring", "Adaptive Optimization"],
          stats: stats.consolidated,
        };
      } catch (error: any) {
        console.error("❌ Error initializing Vortexor Ultimate Performance:", error);
        return {
          performance: "ERROR",
          error: error instanceof Error ? error.message : "Unknown error",
          features: [],
        };
      } finally {
        this.initializationPromise = null;
      }
    })();

    return this.initializationPromise;
  }

  /**
   * Inicializa os componentes de forma lazy (sob demanda) ou proativa se necessário.
   */
  private async initializeLazyComponents(): Promise<void> {
    // Inicializa o IntelligentCacheSystem sempre, pois é central para métricas e performance
    this.intelligentCache = IntelligentCacheSystem.getInstance();

    // Otimizadores são inicializados com base no ambiente ou demanda
    if (process.env.NODE_ENV === "production" || process.env.ENABLE_PERFORMANCE_OPTIMIZER === "true") {
      this.performanceOptimizer = VortexorPerformanceOptimizer.getInstance();
      // await this.performanceOptimizer.initialize(); // Se o otimizador tiver seu próprio método de inicialização
    }

    if (process.env.NODE_ENV === "production" || process.env.ENABLE_QUERY_OPTIMIZER === "true") {
      this.queryOptimizer = VortexorQueryOptimizer.getInstance();
      // await this.queryOptimizer.initialize(); // Se o otimizador de query tiver seu próprio método de inicialização
    }
  }

  /**
   * Retorna a instância do PerformanceOptimizer, inicializando-o se necessário.
   */
  private getPerformanceOptimizerInstance(): VortexorPerformanceOptimizer | null {
    if (!this.performanceOptimizer) {
      // Lógica de inicialização lazy mais granular, se não for inicializado proativamente
      const memUsage = process.memoryUsage().heapUsed / 1024 / 1024;
      if (memUsage < 350 || process.env.ENABLE_PERFORMANCE_OPTIMIZER === "true") {
        this.performanceOptimizer = VortexorPerformanceOptimizer.getInstance();
      }
    }
    return this.performanceOptimizer;
  }

  /**
   * Retorna a instância do QueryOptimizer, inicializando-o se necessário.
   */
  private getQueryOptimizerInstance(): VortexorQueryOptimizer | null {
    if (!this.queryOptimizer) {
      // Lógica de inicialização lazy mais granular
      if (process.env.ENABLE_QUERY_OPTIMIZER === "true") {
        this.queryOptimizer = VortexorQueryOptimizer.getInstance();
      }
    }
    return this.queryOptimizer;
  }

  /**
   * Retorna a instância do IntelligentCacheSystem, inicializando-o se necessário.
   */
  private getIntelligentCacheInstance(): IntelligentCacheSystem {
    if (!this.intelligentCache) {
      this.intelligentCache = IntelligentCacheSystem.getInstance();
    }
    return this.intelligentCache;
  }

  /**
   * Coleta e consolida as estatísticas de performance de todos os subsistemas.
   */
  public async getPerformanceStats(): Promise<{
    timestamp: string;
    system: {
      uptime: number;
      memoryUsage: number;
      platform: string;
      cpuUsage: number;
      eventLoopLag: number;
    };
    cache: IntelligentCacheStats; // Usando a nova interface
    performanceOptimizer: PerformanceOptimizerMetrics;
    queryOptimizer: QueryOptimizerMetrics;
    consolidated: ConsolidatedPerformance;
  }> {
    try {
      const systemStats: SystemStats = {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString(),
      };

      // Coleta de métricas do IntelligentCacheSystem
      const intelligentCache = this.getIntelligentCacheInstance();
      const cacheStats: IntelligentCacheStats = intelligentCache.getIntelligentCacheStats();

      // Coleta de métricas do PerformanceOptimizer
      const performanceOptimizer = this.getPerformanceOptimizerInstance();
      const performanceOptimizerStats: PerformanceOptimizerMetrics = performanceOptimizer
        ? (performanceOptimizer.getPerformanceStats() as PerformanceOptimizerMetrics)
        : { workerPool: { size: 0 }, caches: {}, cpuUtilization: 0, eventLoopLag: 0, system: { memory: process.memoryUsage(), uptime: 0 } };

      // Coleta de métricas do QueryOptimizer
      const queryOptimizer = this.getQueryOptimizerInstance();
      const queryOptimizerStats: QueryOptimizerMetrics = queryOptimizer
        ? (queryOptimizer.getQueryStats() as QueryOptimizerMetrics)
        : { totalPatterns: 0, frequentQueries: 0, slowQueriesDetected: 0, optimizationSuccessRate: 0 };

      // Cálculo do Health Score e recomendações
      const consolidated = this.calculateConsolidatedPerformance(
        systemStats,
        cacheStats,
        performanceOptimizerStats,
        queryOptimizerStats
      );

      return {
        timestamp: systemStats.timestamp,
        system: {
          uptime: systemStats.uptime,
          memoryUsage: Math.round(systemStats.memory.heapUsed / 1024 / 1024),
          platform: process.platform,
          cpuUsage: performanceOptimizerStats.cpuUtilization || 0,
          eventLoopLag: performanceOptimizerStats.eventLoopLag || 0,
        },
        cache: cacheStats,
        performanceOptimizer: performanceOptimizerStats,
        queryOptimizer: queryOptimizerStats,
        consolidated: consolidated,
      };
    } catch (error: any) {
      console.error("❌ Error getting performance stats:", error);
      return {
        timestamp: new Date().toISOString(),
        system: { uptime: 0, memoryUsage: 0, platform: "unknown", cpuUsage: 0, eventLoopLag: 0 }, // memoryUsage agora é number
        cache: {
          hitRatio: 0, status: "ERROR", memoryUsage: 0,
          lruStats: { lruHitRatio: 0, evictions: 0, totalEntries: 0, maxSize: 0, averageAccessCount: 0, oldestEntry: 0, newestEntry: 0 },
          errorRate: 0, queueLength: 0, pendingOperations: 0, syncLocks: 0, redisStatus: "DISABLED",
          basicCacheSize: 0, maxBasicCacheSize: 0, totalHits: 0, totalMisses: 0, totalSets: 0, totalErrors: 0, totalInvalidations: 0,
          redisHits: 0, redisMisses: 0, redisHitRatio: 0, combinedHitRatio: 0, forceRedisMode: false, memoryThreshold: "", environment: "", recommendation: "", healthScore: 0,
          lruHits: 0, lruMisses: 0, lruEvictions: 0, // Propriedades top-level
          isProcessingQueue: false, cacheVersion: 0, redisEnabled: false // Propriedades adicionadas
        },
        performanceOptimizer: { workerPool: { size: 0 }, caches: {}, cpuUtilization: 0, eventLoopLag: 0 },
        queryOptimizer: { totalPatterns: 0, frequentQueries: 0, slowQueriesDetected: 0, optimizationSuccessRate: 0 },
        consolidated: {
          overallPerformance: "ERROR",
          healthScore: 0,
          status: "ERROR",
          recommendations: [`Failed to retrieve performance stats: ${error instanceof Error ? error.message : "Unknown error"}`],
        },
      };
    }
  }

  /**
   * Calcula o desempenho consolidado e o Health Score do sistema.
   */
  private calculateConsolidatedPerformance(
    systemStats: SystemStats,
    cacheStats: IntelligentCacheStats,
    performanceOptimizerStats: PerformanceOptimizerMetrics,
    queryOptimizerStats: QueryOptimizerMetrics
  ): ConsolidatedPerformance {
    let healthScore = 100;
    const recommendations: string[] = [];
    let overallPerformance: string;

    // 1. Avaliação da Memória do Sistema
    const memoryUsagePercentage = systemStats.memory.heapUsed / systemStats.memory.heapTotal;
    if (isNaN(memoryUsagePercentage) || memoryUsagePercentage > 0.95) {
      healthScore -= 30;
      recommendations.push("High memory usage detected (> 95%). Consider optimizing memory-intensive operations or increasing resources.");
    } else if (memoryUsagePercentage > 0.85) {
      healthScore -= 15;
      recommendations.push("Elevated memory usage detected (> 85%). Monitor closely for potential leaks or resource constraints.");
    }

    // 2. Avaliação do Cache (IntelligentCacheSystem)
    if (cacheStats.status === "EMERGENCY_MODE" || cacheStats.redisStatus === "DISABLED") {
      healthScore -= 40;
      recommendations.push("Redis cache is not active or in emergency mode. Ensure KV_URL and KV_TOKEN are configured correctly.");
    } else {
      if (cacheStats.hitRatio < 0.9) {
        healthScore -= 10 * (1 - cacheStats.hitRatio);
        recommendations.push(`Cache hit ratio is below optimal (${(cacheStats.hitRatio * 100).toFixed(2)}%). Review cache TTLs and access patterns.`);
      }
      if (cacheStats.lruStats.lruHitRatio < 0.8 && cacheStats.lruHits > 0) {
        healthScore -= 5;
        recommendations.push(`LRU cache hit ratio is suboptimal (${(cacheStats.lruStats.lruHitRatio * 100).toFixed(2)}%). Consider increasing maxBasicCacheSize.`);
      }
      if (cacheStats.errorRate > 0.01) {
        healthScore -= 15;
        recommendations.push(`High cache error rate (${(cacheStats.errorRate * 100).toFixed(2)}%). Investigate Redis connectivity or cache operations.`);
      }
      if (cacheStats.queueLength > 50) {
        healthScore -= 10;
        recommendations.push(`Cache operation queue is large (${cacheStats.queueLength} items). System might be under heavy load or Redis throughput is low.`);
      }
      if (cacheStats.syncLocks > 10) {
        healthScore -= 5;
        recommendations.push(`Many synchronous cache invalidation locks (${cacheStats.syncLocks}). Investigate frequent write operations causing contention.`);
      }
    }

    // 3. Avaliação do Otimizador de Performance (VortexorPerformanceOptimizer)
    if ((performanceOptimizerStats.cpuUtilization || 0) > 80) {
      healthScore -= 20;
      recommendations.push(`High CPU utilization detected (${performanceOptimizerStats.cpuUtilization || 0}%). Consider scaling up or optimizing CPU-bound tasks.`);
    }
    if ((performanceOptimizerStats.eventLoopLag || 0) > 50) {
      healthScore -= 15;
      recommendations.push(`Significant Event Loop Lag detected (${performanceOptimizerStats.eventLoopLag || 0}ms). Optimize async operations to prevent blocking the event loop.`);
    }
    if (performanceOptimizerStats.workerPool.size === 0 && process.env.NODE_ENV === "production") {
      healthScore -= 5;
      recommendations.push("Performance Optimizer worker pool is not active in production. Ensure it's enabled if CPU-bound tasks are present.");
    }

    // 4. Avaliação do Otimizador de Query (VortexorQueryOptimizer)
    if ((queryOptimizerStats.slowQueriesDetected || 0) > 0) {
      healthScore -= 20;
      recommendations.push(`Slow queries detected (${queryOptimizerStats.slowQueriesDetected || 0}). Review query patterns and add appropriate database indexes.`);
    }
    if ((queryOptimizerStats.optimizationSuccessRate || 0) < 0.8) {
      healthScore -= 10;
      recommendations.push(`Query optimization success rate is low (${((queryOptimizerStats.optimizationSuccessRate || 0) * 100).toFixed(2)}%). Review query optimization rules.`);
    }

    healthScore = Math.max(0, Math.min(100, healthScore));

    if (healthScore >= 95) {
      overallPerformance = "ULTRA";
    } else if (healthScore >= 80) {
      overallPerformance = "EXCELLENT";
    } else if (healthScore >= 60) {
      overallPerformance = "GOOD";
    } else if (healthScore >= 40) {
      overallPerformance = "FAIR";
    } else {
      overallPerformance = "CRITICAL";
    }

    if (recommendations.length === 0) {
      recommendations.push("System operating optimally with no immediate concerns.");
    }

    return {
      overallPerformance,
      healthScore,
      status: overallPerformance,
      recommendations,
    };
  }

  /**
   * Dispara otimizações proativas em todos os subsistemas.
   */
  public async triggerProactiveOptimization(): Promise<string[]> {
    const actions: string[] = [];

    // Otimizar Cache
    const intelligentCache = this.getIntelligentCacheInstance();
    const cacheOptimizationResult = await intelligentCache.optimizeCache();
    actions.push(`Cache Optimization: ${cacheOptimizationResult.actions.join(", ")}`);

    // Otimizar Performance Optimizer (se ativo)
    const performanceOptimizer = this.getPerformanceOptimizerInstance();
    if (performanceOptimizer && (performanceOptimizer as any).optimize && typeof (performanceOptimizer as any).optimize === 'function') {
      try {
        const perfOptActions = await (performanceOptimizer as any).optimize();
        actions.push(`Performance Optimizer: ${perfOptActions.join(", ")}`);
      } catch (error) {
        console.warn("⚠️ Failed to optimize PerformanceOptimizer:", error);
        actions.push("Performance Optimizer optimization failed.");
      }
    }

    // Otimizar Query Optimizer (se ativo)
    const queryOptimizer = this.getQueryOptimizerInstance();
    if (queryOptimizer && (queryOptimizer as any).optimize && typeof (queryOptimizer as any).optimize === 'function') {
      try {
        const queryOptActions = await (queryOptimizer as any).optimize();
        actions.push(`Query Optimizer: ${queryOptActions.join(", ")}`);
      } catch (error) {
        console.warn("⚠️ Failed to optimize QueryOptimizer:", error);
        actions.push("Query Optimizer optimization failed.");
      }
    }

    // Executar limpeza geral do sistema (se houver)
    const memUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    if (memUsage > 500 && typeof global.gc === 'function') {
      global.gc();
      actions.push("Garbage collection triggered due to high memory usage.");
    }

    return actions;
  }

  /**
   * Retorna um relatório de diagnóstico completo do sistema de performance.
   */
  public async getDiagnosticsReport(): Promise<any> {
    const intelligentCache = this.getIntelligentCacheInstance();
    const performanceOptimizer = this.getPerformanceOptimizerInstance();
    const queryOptimizer = this.getQueryOptimizerInstance();

    const cacheDiagnostics = await intelligentCache.runDiagnostics();
    const perfOptDiagnostics = performanceOptimizer ? await (performanceOptimizer as any).runDiagnostics() : { status: "DISABLED" };
    const queryOptDiagnostics = queryOptimizer ? await (queryOptimizer as any).runDiagnostics() : { status: "DISABLED" };

    const currentPerformanceStats = await this.getPerformanceStats();

    return {
      timestamp: new Date().toISOString(),
      overallStatus: currentPerformanceStats.consolidated.status,
      overallHealthScore: currentPerformanceStats.consolidated.healthScore,
      systemMetrics: currentPerformanceStats.system,
      cacheDiagnostics: cacheDiagnostics,
      performanceOptimizerDiagnostics: perfOptDiagnostics,
      queryOptimizerDiagnostics: queryOptDiagnostics,
      recommendations: currentPerformanceStats.consolidated.recommendations,
    };
  }
}
