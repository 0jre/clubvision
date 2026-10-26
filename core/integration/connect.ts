import { MongoClient, type Db } from "mongodb"
import { VortexorSecuritySystem } from "./security-integration"
import { VortexorUltimatePerformanceSystem } from "../xor/performance"
import { IntelligentCacheSystem } from "../performace/intelligent-cache"
import type { SecurityConfig } from "../types/security"
import crypto from 'crypto';

const uri = process.env.MONGO_CONNECTION || ""
const isProduction = process.env.NODE_ENV === "production"


const SMART_CONFIG = isProduction
  ? {
      ENV: "PRODUCTION",
      INIT_TIMEOUT: 30000,
      CONNECTION_TIMEOUT: 8000,
      SERVER_SELECTION_TIMEOUT: 8000,
      SOCKET_TIMEOUT: 15000,
      MAX_RETRY_ATTEMPTS: 2,
      RETRY_DELAY: 1000,
      CACHE_TTL: 3600000,
      CACHE_DEFAULT_TTL: 900000,
      HEALTH_CHECK_INTERVAL: 300000,
      LAZY_LOADING: true,
      PARALLEL_INIT: true,
      ENABLE_SECURITY: true,
      ENABLE_PERFORMANCE: true,
      IMMEDIATE_CACHE_SYNC: true,
    }
  : {
      ENV: "DEVELOPMENT",
      INIT_TIMEOUT: 30000,
      CONNECTION_TIMEOUT: 5000, 
      SERVER_SELECTION_TIMEOUT: 5000, 
      SOCKET_TIMEOUT: 15000,
      MAX_RETRY_ATTEMPTS: 2,
      RETRY_DELAY: 1000,
      CACHE_TTL: 3600000,
      CACHE_DEFAULT_TTL: 900000,
      HEALTH_CHECK_INTERVAL: 300000,
      LAZY_LOADING: true,
      PARALLEL_INIT: true,
      ENABLE_SECURITY: true,
      ENABLE_PERFORMANCE: true,
      IMMEDIATE_CACHE_SYNC: true,
    }

interface CompleteConnection {
  client: MongoClient
  db: Db
  cache: IntelligentCacheSystem
  security?: VortexorSecuritySystem
  performance?: VortexorUltimatePerformanceSystem
  timestamp: number
  healthCheckTimer?: NodeJS.Timeout
  isFullyInitialized: boolean
  environment: string
  vortexorSystem?: any
  cacheOperationQueue: Map<string, Promise<any>>
}

let cachedConnection: CompleteConnection | null = null
let isConnecting = false
let connectionPromise: Promise<CompleteConnection> | null = null
let backgroundInitPromise: Promise<void> | null = null 

 
async function dbConnect(): Promise<
  CompleteConnection & {
    getHealthStatus: () => Promise<any>
    getMetrics: () => Promise<any>
    getFromCache: <T>(key: string) => Promise<T | null>
    setToCache: <T>(key: string, data: T, ttl?: number) => Promise<boolean>
    getWithCache: <T>(key: string, fetchFn: () => Promise<T>, ttl?: number) => Promise<T>
    blockThreat: (ip: string, duration?: number) => Promise<void>
    unblockIP: (ip: string) => Promise<void>
    generateSecurityReport: () => Promise<any>
    getPerformanceReport: () => Promise<any>
    getCompleteStatus: () => Promise<any>
    invalidateCacheImmediate: (collectionName: string, operation: string, data?: any) => Promise<void>
  }
> {
  const envLabel = `[${SMART_CONFIG.ENV}]`
  const startTime = Date.now()

  // 1. Retorna a conexão do cache se for válida
  if (cachedConnection && isConnectionValid(cachedConnection)) {
    const age = Math.round((Date.now() - cachedConnection.timestamp) / 1000)
    console.log(`⏱️ [${SMART_CONFIG.ENV}] Conexão do cache retornada em ${Date.now() - startTime}ms`)
    return enhanceCompleteConnection(cachedConnection)
  }

  // 2. Se já estiver conectando, espera a promessa de conexão básica
  if (isConnecting && connectionPromise) {
    try {
      const connection = await connectionPromise
      console.log(`⏱️ [${SMART_CONFIG.ENV}] Esperou por conexão em andamento em ${Date.now() - startTime}ms`)
      return enhanceCompleteConnection(connection)
    } catch (error) {
      isConnecting = false
      connectionPromise = null
    }
  }

  // 3. Inicia a conexão básica e a inicialização completa em paralelo
  isConnecting = true
  connectionPromise = connectMongoDBAndCacheOnly()

  try {
    const basicConnection = await connectionPromise
    console.log(`⏱️ [${SMART_CONFIG.ENV}] Conexão MongoDB e Cache retornada em ${Date.now() - startTime}ms`)

    // Inicia a inicialização dos sistemas de segurança/performance em segundo plano
    if (!backgroundInitPromise) {
      backgroundInitPromise = initializeBackgroundSystems(basicConnection)
        .then(fullConnection => {
          // Atualiza a conexão em cache com os sistemas completos
          cachedConnection = fullConnection
          setupVortexorHealthCheck(fullConnection)
          const totalTime = Date.now() - startTime
          console.log(`🎉 [${SMART_CONFIG.ENV}] VORTEXOR ULTIMATE SYSTEM COMPLETO ATIVADO em segundo plano! Tempo total: ${totalTime}ms`)
          backgroundInitPromise = null
        })
        .catch(error => {
          console.error(`❌ [${SMART_CONFIG.ENV}] Erro na inicialização em segundo plano:`, error)
          backgroundInitPromise = null
        });
    }

    // Retorna a conexão básica imediatamente.
    return enhanceCompleteConnection(basicConnection)
  } catch (error) {
    isConnecting = false
    connectionPromise = null
    backgroundInitPromise = null
    console.error(`❌ [${SMART_CONFIG.ENV}] ERRO na conexão inicial:`, error)
    return await createCompleteFallback()
  } finally {
    isConnecting = false
  }
}

/**
 * Funcao otimizada para conectar ao MongoDB e inicializar apenas o cache.
 * Esta é a parte mais rapida da inicializacao.
 */
async function connectMongoDBAndCacheOnly(): Promise<CompleteConnection> {
    const client = await connectMongoDBOptimized();
    const db = client.db();
    const cache = IntelligentCacheSystem.getInstance();

    const completeConnection: CompleteConnection = {
      client,
      db: createVortexorDbProxy(db, cache),
      cache,
      timestamp: Date.now(),
      isFullyInitialized: false, // Marcamos como não totalmente inicializado
      environment: SMART_CONFIG.ENV,
      cacheOperationQueue: new Map(),
    };

    return completeConnection;
}

/**
 * Inicializa os sistemas de segurança e performance em segundo plano, sem bloquear a conexão inicial.
 */
async function initializeBackgroundSystems(connection: CompleteConnection): Promise<CompleteConnection> {
  const envLabel = `[${SMART_CONFIG.ENV}]`
  const startTime = Date.now()
  let securitySystem: VortexorSecuritySystem | undefined
  let performanceSystem: VortexorUltimatePerformanceSystem | undefined;

  const [securityResult, performanceResult] = await Promise.allSettled([
    SMART_CONFIG.ENABLE_SECURITY ? initializeVortexorSecurity() : Promise.resolve(undefined),
    SMART_CONFIG.ENABLE_PERFORMANCE ? initializeVortexorPerformance(connection.client, connection.db) : Promise.resolve(undefined),
  ]);

  if (securityResult.status === "fulfilled" && securityResult.value) {
    securitySystem = securityResult.value;
  } else {
    console.warn(`⚠️ ${envLabel} Sistema de segurança falhou em segundo plano:`, securityResult);
  }

  if (performanceResult.status === "fulfilled" && performanceResult.value) {
    performanceSystem = performanceResult.value;
  } else {
    console.warn(`⚠️ ${envLabel} Sistema de performance falhou em segundo plano:`, performanceResult);
  }

  const secureDb = securitySystem ? securitySystem.createSecureDbProxy(connection.db) : connection.db
  const cachedSecureDb = createVortexorDbProxy(secureDb, connection.cache)

  const vortexorSystem = {
    // ... os métodos do vortexorSystem
    getFromCache: async <T,>(key: string): Promise<T | null> => await connection.cache.get<T>(key),
    setToCache: async <T,>(key: string, data: T, ttl?: number): Promise<boolean> =>
      await connection.cache.set(key, data, { ttl: ttl || SMART_CONFIG.CACHE_DEFAULT_TTL }),
    getWithCache: async <T,>(key: string, fetchFunction: () => Promise<T>, ttl?: number): Promise<T> => {
      const cached = await connection.cache.get<T>(key)
      if (cached) {
        return cached
      }
      const data = await fetchFunction()
      if (data) {
        await connection.cache.set(key, data, { ttl: ttl || SMART_CONFIG.CACHE_DEFAULT_TTL })
      }
      return data
    },
    invalidateCacheImmediate: async (collectionName: string, operation: string, data?: any): Promise<void> => {
      await invalidateRelatedCacheImmediate(connection.cache, collectionName, operation, data)
    },
    getMetrics: async () => {
      try {
        const cacheStats = connection.cache.getIntelligentCacheStats()
        return {
          security: securitySystem ? await securitySystem.getSecurityMetrics().catch(() => null) : null,
          performance: performanceSystem ? await performanceSystem.getPerformanceStats().catch(() => null) : null,
          cache: cacheStats,
          system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            timestamp: new Date().toISOString(),
          },
        }
      } catch (error) {
        console.error("Erro ao obter métricas:", error)
        return { error: "Failed to get metrics" }
      }
    },
    getHealthStatus: async () => {
      try {
        const cacheStats = connection.cache.getIntelligentCacheStats()
        return {
          overall: securitySystem ? await securitySystem.healthCheck().catch(() => null) : { status: "healthy" },
          performance: performanceSystem ? "ACTIVE" : "DISABLED",
          cache: {
            status: cacheStats.status,
            hitRatio: cacheStats.hitRatio,
            memoryUsage: cacheStats.memoryUsage,
          },
          uptime: process.uptime(),
          memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        console.error("Erro ao obter status de saúde:", error)
        return { error: "Failed to get health status" }
      }
    },
    blockThreat: async (ip: string, duration?: number) => {
      if (!securitySystem) throw new Error("Security system not available")
      try {
        await securitySystem.blockIP(ip, duration)
      } catch (error) {
        console.error(`Erro ao bloquear IP ${ip}:`, error)
        throw new Error(`Failed to block IP: ${error}`)
      }
    },
    unblockIP: async (ip: string) => {
      if (!securitySystem) throw new Error("Security system not available")
      try {
        await securitySystem.unblockIP(ip)
      } catch (error) {
        console.error(`Erro ao desbloquear IP ${ip}:`, error)
        throw new Error(`Failed to unblock IP: ${error}`)
      }
    },
    generateSecurityReport: async () => {
      if (!securitySystem) throw new Error("Security system not available")
      try {
        return await securitySystem.getSecurityReport()
      } catch (error) {
        console.error("Erro ao gerar relatório de segurança:", error)
        throw new Error(`Failed to generate security report: ${error}`)
      }
    },
    getPerformanceReport: async () => {
      if (!performanceSystem) throw new Error("Performance system not available")
      try {
        return await performanceSystem.getPerformanceStats()
      } catch (error) {
        console.error("Erro ao obter relatório de performance:", error)
        throw new Error(`Failed to get performance report: ${error}`)
      }
    },
    getCompleteStatus: async () => {
      try {
        const [securityMetrics, performanceStats, cacheStats] = await Promise.all([
          securitySystem ? securitySystem.getSecurityMetrics().catch((e) => ({ error: e.message })) : null,
          performanceSystem ? performanceSystem.getPerformanceStats().catch((e) => ({ error: e.message })) : null,
          Promise.resolve(connection.cache.getIntelligentCacheStats()),
        ])

        return {
          security: securityMetrics,
          performance: performanceStats,
          cache: cacheStats,
          health: securitySystem ? await securitySystem.healthCheck().catch(() => null) : null,
          system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            platform: process.platform,
            nodeVersion: process.version,
            pid: process.pid,
          },
          connectionCache: {
            age: Date.now() - startTime,
            ttl: SMART_CONFIG.CACHE_TTL,
          },
          timestamp: new Date().toISOString(),
          status: "VORTEXOR ULTIMATE ACTIVE - COMPLETE SYSTEM 🚀💾🛡️⚡",
        }
      } catch (error) {
        console.error("Erro ao obter status completo:", error)
        return { error: "Failed to get complete status" }
      }
    },
  }


  return {
    ...connection,
    security: securitySystem,
    performance: performanceSystem,
    vortexorSystem,
    isFullyInitialized: true,
  }
}
 
 
async function connectMongoDBOptimized(): Promise<MongoClient> {
  const envLabel = `[${SMART_CONFIG.ENV}]`

  if (!uri) {
    throw new Error("MONGO_CONNECTION environment variable is required")
  }

  const mongoOptions: import("mongodb").MongoClientOptions = {
    serverSelectionTimeoutMS: SMART_CONFIG.SERVER_SELECTION_TIMEOUT,
    connectTimeoutMS: SMART_CONFIG.CONNECTION_TIMEOUT,
    socketTimeoutMS: SMART_CONFIG.SOCKET_TIMEOUT,
    heartbeatFrequencyMS: 30000,
    maxPoolSize: isProduction ? 3 : 5,
    minPoolSize: 0,
    maxIdleTimeMS: 30000,
    maxConnecting: 2,
    retryWrites: true,
    retryReads: true,
    ...(isProduction && {
      family: 4,
      keepAlive: true,
      keepAliveInitialDelay: 30000,
      readPreference: "primaryPreferred" as const,
      readConcern: { level: "majority" as const },
      writeConcern: { w: "majority" as const, j: true },
    }),
    compressors: ["zlib" as const],
    zlibCompressionLevel: 6,
  }

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= SMART_CONFIG.MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      const client = new MongoClient(uri, mongoOptions)
      await client.connect()
      await client.db().admin().ping()
      return client
    } catch (error: any) {
      lastError = error
      console.error(`❌ ${envLabel} Tentativa ${attempt} falhou:`, error.message)
      if (attempt < SMART_CONFIG.MAX_RETRY_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, SMART_CONFIG.RETRY_DELAY))
      }
    }
  }

  throw new Error(`MongoDB connection failed: ${lastError?.message}`)
}

/**
 * Inicializa o sistema de segurança Vortexor.
 */
async function initializeVortexorSecurity(): Promise<VortexorSecuritySystem> {
  const config: SecurityConfig = {
    rateLimit: {
      windowMs: 60000,
      maxRequests: isProduction ? 2000 : 5000,
      adaptiveThreshold: true,
      burstProtection: true,
    },
    ddosProtection: {
      enabled: true,
      threshold: isProduction ? 10000 : 20000,
      blockDuration: 300000,
      adaptiveBlocking: true,
    },
    injection: {
      strictMode: true,
      deepScan: !!isProduction,
      aiDetection: !!isProduction,
    },
    encryption: {
      algorithm: "aes-256-gcm",
      keyRotationInterval: 86400000,
      saltRounds: isProduction ? 6 : 10,
    },
    monitoring: {
      realTimeAlerts: isProduction,
      anomalyDetection: true,
      behavioralAnalysis: isProduction,
    },
  }

  return VortexorSecuritySystem.getInstance(config)
}

/**
 * Inicializa o sistema de performance Vortexor.
 */
async function initializeVortexorPerformance(client: MongoClient, db: Db): Promise<VortexorUltimatePerformanceSystem> {
  const system = VortexorUltimatePerformanceSystem.getInstance()
  await system.initialize(client, db)
  return system
}


/**
 * REFAZENDO: A função de normalização anterior não era robusta o suficiente.
 * A nova função garante uma ordem canônica para objetos aninhados e arrays,
 * garantindo que a string de entrada para o hash seja sempre a mesma.
 */
function deepSortObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepSortObjectKeys);
  }

  const sortedKeys = Object.keys(obj).sort();
  const sortedObject: { [key: string]: any } = {};
  for (const key of sortedKeys) {
    if (obj[key] && obj[key].constructor && obj[key].constructor.name === "ObjectId") {
      sortedObject[key] = obj[key].toString();
    } else {
      sortedObject[key] = deepSortObjectKeys(obj[key]);
    }
  }
  return sortedObject;
}

/**
 * GERAÇÃO DE CHAVE CORRIGIDA E MELHORADA:
 * Agora garante que a chave de cache seja consistente, independentemente da ordem das chaves.
 * A chave gerada é 100% determinística para a mesma consulta.
 *
 * @param env O ambiente da aplicação (ex: PRODUCTION).
 * @param collection A coleção do banco de dados.
 * @param operation A operação (ex: findOne, find).
 * @param args Os argumentos da consulta.
 * @returns A chave de cache consistente.
 */
function generateConsistentCacheKey(
  env: string,
  collection: string,
  operation: string,
  ...args: any[]
): string {
  try {
    const sortedArgs = deepSortObjectKeys(args);
    const argsString = JSON.stringify(sortedArgs);
    const argsHash = crypto.createHash("sha256").update(argsString).digest("hex");
    
    const fullKey = `${env}:${collection}:${operation}:${argsHash}`;
    console.log(`🔑 Gerando cache key para ${collection}:${operation} -> ${fullKey}`);
    return fullKey;
  } catch (error) {
    console.error(`❌ Erro ao gerar chave de cache consistente:`, error);
    // Retorna uma chave única para evitar a colisão, mas não a duplicação
    return `${env}:${collection}:${operation}:${crypto.randomUUID()}`;
  }
}

/**
 * INVALIDAÇÃO DE CACHE CORRIGIDA:
 * Agora invalida o cache de forma mais abrangente e precisa após operações de escrita.
 *
 * @param cache O sistema de cache.
 * @param collectionName A coleção alterada.
 * @param operation A operação de escrita (ex: insertOne).
 * @param data Os dados envolvidos na operação.
 */
async function invalidateRelatedCacheImmediate(
  cache: IntelligentCacheSystem,
  collectionName: string,
  operation: string,
  data?: any,
): Promise<void> {
  const startTime = Date.now();
  const keysToInvalidate: string[] = [];

  // Padrão para invalidar todas as consultas de 'find' na coleção após uma inserção
  if (operation.includes("insert")) {
    // Invalida todos os caches da coleção
    await cache.invalidateSync([`${SMART_CONFIG.ENV}:${collectionName}:*`]);
    return; // Retorna após a invalidação ampla
  }

  // Lógica para operações de atualização e exclusão
  if (data && (operation.includes("update") || operation.includes("delete") || operation.includes("replace"))) {
    // Invalida chaves findOne específicas
    if (data.filter) {
      const specificKey = generateConsistentCacheKey(SMART_CONFIG.ENV, collectionName, "findOne", data.filter);
      keysToInvalidate.push(specificKey);

      // Se a query de findOne inclui _id, também invalidamos
      if (data.filter._id) {
        keysToInvalidate.push(generateConsistentCacheKey(SMART_CONFIG.ENV, collectionName, "findOne", { _id: data.filter._id }));
      }
    }

    // Invalida chaves 'find' que possam ter sido afetadas
    // Isso é mais genérico, então precisamos ser cautelosos.
    // O ideal é invalidar o cache da coleção inteira para consultas de 'find'.
    await cache.invalidateSync([`${SMART_CONFIG.ENV}:${collectionName}:find:*`]);
  }
  
  // Executa todas as invalidações específicas
  const invalidationPromises: Promise<any>[] = keysToInvalidate.map(key => cache.delete(key));

  try {
    await Promise.allSettled(invalidationPromises);
    const duration = Date.now() - startTime;
    console.log(`✅ INVALIDAÇÃO COMPLETA: ${keysToInvalidate.length} entradas removidas em ${duration}ms para ${collectionName}`);
  } catch (error) {
    console.error(`❌ Erro crítico na invalidação:`, error);
  }
}

/**
 * Lógica para determinar se o resultado deve ser cacheado.
 */
function shouldCacheResult(result: any, operation: string, collectionName: string): boolean {
  if (!result) return false

  try {
    const resultString = JSON.stringify(result)
    const size = resultString.length

    if (size > 512 * 1024) {
      console.log(`⚠️ Resultado muito grande para cache: ${Math.round(size / 1024)}KB`)
      return false
    }

    if (operation === "find" && Array.isArray(result)) {
      if (result.length === 0) return false

      if (result.length > 1000) {
        console.log(`⚠️ Array muito grande para cache: ${result.length} items`)
        return false
      }
    }

    const sensitiveCollections = ["checkout_sessions", "withdrawalHistory"]
    if (sensitiveCollections.includes(collectionName)) {
      return size < 100 * 1024
    }

    if (operation === "findOne" && typeof result === "object") {
      const keys = Object.keys(result)
      if (keys.length <= 2 && keys.includes("_id")) {
        return false
      }
    }

    return true
  } catch (error) {
    console.warn(`⚠️ Erro ao avaliar resultado para cache:`, error)
    return false
  }
}

/**
 * Cria um proxy para o objeto de banco de dados para interceptar as chamadas e gerenciar o cache.
 */
function createVortexorDbProxy(db: Db, cache: IntelligentCacheSystem): Db {
  return new Proxy(db, {
    get: (target, prop) => {
      if (prop === "collection") {
        return (name: string, options?: any) => {
          const collection = target.collection(name, options)
          return createVortexorCollectionProxy(collection, cache, name)
        }
      }
      return Reflect.get(target, prop)
    },
  })
}

/**
 * Cria um proxy para a coleção do banco de dados, adicionando lógica de cacheamento e invalidação.
 */
function createVortexorCollectionProxy(collection: any, cache: IntelligentCacheSystem, name: string) {
  return new Proxy(collection, {
    get: (target, prop) => {
      if (typeof prop === "string") {
        switch (prop) {
          case "findOne":
            return async (...args: any[]) => {
              const cacheKey = generateConsistentCacheKey(SMART_CONFIG.ENV, name, "findOne", ...args)

              // Check if cache key already exists as a sanity check before fetching from db
              const cached = await cache.get(cacheKey)
              if (cached) {
                console.log(`✅ Cache hit para chave: ${cacheKey}`);
                return cached
              }
              
              const result = await target.findOne(...args)

              if (shouldCacheResult(result, "findOne", name)) {
                await cache.set(cacheKey, result, { ttl: SMART_CONFIG.CACHE_DEFAULT_TTL })
              }

              return result
            }

          case "find":
            return (...args: any[]) => {
              const cursor = target.find(...args)
              return new Proxy(cursor, {
                get: (cursorTarget, cursorProp) => {
                  if (cursorProp === "toArray") {
                    return async () => {
                      const cacheKey = generateConsistentCacheKey(SMART_CONFIG.ENV, name, "find", ...args)
                      
                      const cached = await cache.get(cacheKey)
                      if (cached) {
                        console.log(`✅ Cache hit para chave: ${cacheKey}`);
                        return cached
                      }

                      const result = await cursorTarget.toArray()

                      if (shouldCacheResult(result, "find", name)) {
                        await cache.set(cacheKey, result, { ttl: SMART_CONFIG.CACHE_DEFAULT_TTL })
                      }

                      return result
                    }
                  }
                  return Reflect.get(cursorTarget, cursorProp)
                },
              })
            }

          // As operações de escrita (insertOne, updateOne, etc.) agora chamam a função de invalidação melhorada.
          case "insertOne":
            return async (...args: any[]) => {
              const result = await target.insertOne(...args)
              if (SMART_CONFIG.IMMEDIATE_CACHE_SYNC) {
                await invalidateRelatedCacheImmediate(cache, name, "insertOne", args[0])
              }
              return result
            }

          case "insertMany":
            return async (...args: any[]) => {
              const result = await target.insertMany(...args)
              if (SMART_CONFIG.IMMEDIATE_CACHE_SYNC) {
                // A invalidação pode ser mais genérica para insertMany.
                await invalidateRelatedCacheImmediate(cache, name, "insertMany", { data: args[0] })
              }
              return result
            }

          case "updateOne":
            return async (...args: any[]) => {
              const [filter, update, options] = args
              const result = await target.updateOne(filter, update, options)
              if (SMART_CONFIG.IMMEDIATE_CACHE_SYNC) {
                await invalidateRelatedCacheImmediate(cache, name, "updateOne", { filter, update })
              }
              return result
            }

          case "updateMany":
            return async (...args: any[]) => {
              const [filter, update, options] = args
              const result = await target.updateMany(filter, update, options)
              if (SMART_CONFIG.IMMEDIATE_CACHE_SYNC) {
                await invalidateRelatedCacheImmediate(cache, name, "updateMany", { filter, update })
              }
              return result
            }

          case "deleteOne":
            return async (...args: any[]) => {
              const result = await target.deleteOne(...args)
              if (SMART_CONFIG.IMMEDIATE_CACHE_SYNC) {
                await invalidateRelatedCacheImmediate(cache, name, "deleteOne", args[0])
              }
              return result
            }

          case "deleteMany":
            return async (...args: any[]) => {
              const result = await target.deleteMany(...args)
              if (SMART_CONFIG.IMMEDIATE_CACHE_SYNC) {
                await invalidateRelatedCacheImmediate(cache, name, "deleteMany", args[0])
              }
              return result
            }

          case "replaceOne":
            return async (...args: any[]) => {
              const result = await target.replaceOne(...args)
              if (SMART_CONFIG.IMMEDIATE_CACHE_SYNC) {
                await invalidateRelatedCacheImmediate(cache, name, "replaceOne", { filter: args[0], replacement: args[1] })
              }
              return result
            }

          case "findOneAndUpdate":
            return async (...args: any[]) => {
              const [filter, update, options] = args
              const result = await target.findOneAndUpdate(filter, update, options)
              if (SMART_CONFIG.IMMEDIATE_CACHE_SYNC) {
                await invalidateRelatedCacheImmediate(cache, name, "findOneAndUpdate", { filter, update })
              }
              return result
            }

          case "findOneAndDelete":
            return async (...args: any[]) => {
              const [filter, options] = args
              const result = await target.findOneAndDelete(filter, options)
              if (SMART_CONFIG.IMMEDIATE_CACHE_SYNC) {
                await invalidateRelatedCacheImmediate(cache, name, "findOneAndDelete", { filter })
              }
              return result
            }

          case "findOneAndReplace":
            return async (...args: any[]) => {
              const [filter, replacement, options] = args
              const result = await target.findOneAndReplace(filter, replacement, options)
              if (SMART_CONFIG.IMMEDIATE_CACHE_SYNC) {
                await invalidateRelatedCacheImmediate(cache, name, "findOneAndReplace", { filter, replacement })
              }
              return result
            }
        }
      }
      return Reflect.get(target, prop)
    },
  })
}

/**
 * Verifica se a conexão com o banco de dados é válida.
 */
function isConnectionValid(connection: CompleteConnection): boolean {
  const age = Date.now() - connection.timestamp
  return age < SMART_CONFIG.CACHE_TTL && connection.client !== null && connection.client !== undefined
}

/**
 * Adiciona métodos utilitários à conexão completa.
 */
function enhanceCompleteConnection(connection: CompleteConnection) {
  return {
    ...connection,
    ...connection.vortexorSystem,
    
    // Sobrescreve getHealthStatus para mostrar o estado de inicialização
    getHealthStatus: async () => {
      try {
        const pingStart = Date.now()
        await connection.client.db().admin().ping()
        const pingTime = Date.now() - pingStart

        return {
          status: "healthy",
          environment: connection.environment,
          mongodb: "connected",
          pingTime: `${pingTime}ms`,
          cache: connection.cache.getIntelligentCacheStats(),
          security: connection.security ? "ACTIVE" : "DISABLED",
          performance: connection.performance ? "ACTIVE" : "DISABLED",
          immediateSync: SMART_CONFIG.IMMEDIATE_CACHE_SYNC ? "ENABLED" : "DISABLED",
          uptime: process.uptime(),
          memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          // Adicionado para informar o estado da inicialização completa
          isFullyInitialized: connection.isFullyInitialized,
          connectionAge: Math.round((Date.now() - connection.timestamp) / 1000),
          timestamp: new Date().toISOString(),
        }
      } catch (error: any) {
        return {
          status: "unhealthy",
          environment: connection.environment,
          error: error.message,
          timestamp: new Date().toISOString(),
        }
      }
    },
    
    // Sobrescreve getMetrics para mostrar o estado da inicialização
    getMetrics: async () => {
      if (connection.vortexorSystem) {
        return await connection.vortexorSystem.getMetrics()
      }

      return {
        environment: connection.environment,
        cache: connection.cache.getIntelligentCacheStats(),
        security: connection.security ? await connection.security.getSecurityMetrics().catch(() => null) : null,
        performance: connection.performance
          ? await connection.performance.getPerformanceStats().catch(() => null)
          : null,
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          platform: process.platform,
          nodeVersion: process.version,
        },
        // Adicionado para informar o estado da inicialização completa
        isFullyInitialized: connection.isFullyInitialized,
        timestamp: new Date().toISOString(),
      }
    },
  }
}

/**
 * Cria uma conexão de fallback em caso de falha.
 */
async function createCompleteFallback() {
  const envLabel = `[${SMART_CONFIG.ENV}]`
  console.log(`🔄 ${envLabel} Criando fallback completo...`)

  try {
    const client = await connectMongoDBOptimized()
    const cache = IntelligentCacheSystem.getInstance()

    const fallbackConnection: CompleteConnection = {
      client,
      db: client.db(),
      cache,
      timestamp: Date.now(),
      isFullyInitialized: true,
      environment: `${SMART_CONFIG.ENV}_FALLBACK`,
      cacheOperationQueue: new Map(),
    }

    console.log(`⚠️ ${envLabel} Fallback completo ativo`)
    return enhanceCompleteConnection(fallbackConnection)
  } catch (error) {
    console.error(`❌ ${envLabel} Fallback falhou:`, error)
    throw new Error(`Complete connection impossible: ${(error as Error).message}`)
  }
}

/**
 * Configura o health check periódico.
 */
function setupVortexorHealthCheck(connection: CompleteConnection): void {
  if (connection.healthCheckTimer) {
    clearInterval(connection.healthCheckTimer)
  }

  connection.healthCheckTimer = setInterval(async () => {
    try {
      await connection.client.db().admin().ping()
      connection.cache.cleanup()
    } catch (error) {
      console.error(`❌ [${SMART_CONFIG.ENV}] Health check falhou:`, error)
    }
  }, SMART_CONFIG.HEALTH_CHECK_INTERVAL)
}

export async function getVortexorSystemStatus() {
  if (!cachedConnection) {
    return { status: "not_connected", environment: SMART_CONFIG.ENV, timestamp: new Date().toISOString() }
  }

  const enhanced = enhanceCompleteConnection(cachedConnection)
  return await enhanced.getHealthStatus()
}

export async function getVortexorCompleteMetrics() {
  if (!cachedConnection) {
    return { error: "Sistema não conectado", environment: SMART_CONFIG.ENV }
  }

  const enhanced = enhanceCompleteConnection(cachedConnection)
  return await enhanced.getMetrics()
}

export async function invalidateCacheManual(collectionName: string, operation: string, data?: any) {
  if (!cachedConnection) {
    console.warn("⚠️ Tentativa de invalidação sem conexão ativa")
    return false
  }

  try {
    await invalidateRelatedCacheImmediate(cachedConnection.cache, collectionName, operation, data)
    return true
  } catch (error) {
    console.error("❌ Erro na invalidação manual:", error)
    return false
  }
}

process.on("SIGTERM", async () => {
  console.log(`🛑 [${SMART_CONFIG.ENV}] Shutdown graceful...`)
  if (cachedConnection?.client) {
    await cachedConnection.client.close()
  }
  process.exit(0)
})

export { dbConnect }

/**
 * Funções de utilidade para geração de códigos.
 */
export function generateInviteCode(): string {
  const prefix = "nvrp"
  const groupLengths = [4, 4, 5]
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let code = prefix
  for (const length of groupLengths) {
    code += "-"
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      code += characters.charAt(randomIndex)
    }
  }
  return code
}

export function generateAuthorizationCode(): string {
  const groupLengths = [4, 4]
  const characters = "0123456789"
  let code = ""
  for (const length of groupLengths) {
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      code += characters.charAt(randomIndex)
    }
    if (length !== groupLengths[groupLengths.length - 1]) {
      code += "-"
    }
  }
  return code
}

// Constantes de nomes de coleções
export const reformsCollectionName = "reforms"
export const visiontvCollection = "visiontv"
export const visionAdsCollection = "AdsVision"
export const Subscription = "subscriptions"
export const subpayment = "checkout_sessions"
export const visionlevel = "member-stats"
export const visioneventsCollection = "Events"
export const postVisionCollection = "PostVision"
export const Visioncla = "cla"
export const Visionclacd = "convidados-cla"
export const InformationsUsers = "users"
export const searchsteam = "steam"
export const searchtwitch = "twitch"
export const GuestUser = "Invites"
export const Guestlist = "convidados"
export const searchmodlog = "mod-logs"
export const Market = "visionmarket"
export const Tickethelp = "ticket"
export const itemsCollection = "items"
export const iventory = "inventory"
export const tvlnovision = "tvl-novision"
export const withdrawalHistory = "withdrawalHistory"
export const notifications = "notifications"
export const monetizations = "monetizations"
export const checkoutsessions = "checkout_sessions"
