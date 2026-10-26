import { VortexorSecuritySystem } from "../integration/security-integration"
import type { SecurityConfig } from "../types/security"
import type { MongoClient, Db } from "mongodb"

// Configuração padrão do sistema Vortexor
const VORTEXOR_CONFIG: SecurityConfig = {
  rateLimit: {
    windowMs: 60000, // 1 minuto
    maxRequests: 1000, // 1000 requests por minuto
    adaptiveThreshold: true,
    burstProtection: true,
  },
  ddosProtection: {
    enabled: true,
    threshold: 5000, // 5000 requests por minuto para DDoS
    blockDuration: 1800000, // 30 minutos de bloqueio
    adaptiveBlocking: true,
  },
  injection: {
    strictMode: true,
    deepScan: true,
    aiDetection: true,
  },
  encryption: {
    algorithm: "aes-256-gcm",
    keyRotationInterval: 86400000, // 24 horas
    saltRounds: 15, // Máxima segurança
  },
  monitoring: {
    realTimeAlerts: true,
    anomalyDetection: true,
    behavioralAnalysis: true,
  },
}

export class VortexorUltimateSystem {
  private static instance: VortexorUltimateSystem
  private securitySystem: VortexorSecuritySystem | null = null
  private isInitialized = false
  private client: MongoClient | null = null
  private db: Db | null = null

  private constructor() {
    // Não inicializar nada no constructor para evitar recursão
  }

  static getInstance(): VortexorUltimateSystem {
    if (!VortexorUltimateSystem.instance) {
      VortexorUltimateSystem.instance = new VortexorUltimateSystem()
    }
    return VortexorUltimateSystem.instance
  }

 
  async initialize(client?: MongoClient, db?: Db) {
    if (this.isInitialized) {
   
      return this.getInitializedSystem()
    }


    try {
      // Verificar variáveis de ambiente
      this.validateEnvironment()

      // Se não recebeu client/db, significa que está sendo chamado independentemente
      if (!client || !db) {
        throw new Error("VortexorUltimateSystem agora requer client e db pré-conectados para evitar recursão")
      }

      // Armazenar referências
      this.client = client
      this.db = db

     
      this.securitySystem = VortexorSecuritySystem.getInstance(VORTEXOR_CONFIG)

      // Aplicar proxy de segurança ao DB
      const secureDb = this.securitySystem.createSecureDbProxy(db)

    
      const healthStatus = await this.securitySystem.healthCheck()

   

      this.isInitialized = true

  

      return {
        client,
        db: secureDb, // DB com proxy de segurança
        securitySystem: this.securitySystem,
        health: healthStatus,
        metrics: await this.securitySystem.getSecurityMetrics(),
        status: "VORTEXOR ULTIMATE ACTIVATED! 🚀",
      }
    } catch (error) {
      console.error("❌ Erro ao inicializar Vortexor Ultimate System:", error)
      throw error
    }
  }

  private getInitializedSystem() {
    if (!this.securitySystem || !this.client || !this.db) {
      throw new Error("Sistema não foi inicializado corretamente")
    }

    return {
      client: this.client,
      db: this.securitySystem.createSecureDbProxy(this.db),
      securitySystem: this.securitySystem,
      health: this.securitySystem.healthCheck(),
      metrics: this.securitySystem.getSecurityMetrics(),
      status: "VORTEXOR ULTIMATE ALREADY ACTIVE! 🚀",
    }
  }

  private validateEnvironment(): void {
    const requiredEnvVars = ["MONGO_CONNECTION"]
    
    // KV_URL e KV_TOKEN são opcionais para Redis
    const optionalEnvVars = ["KV_URL", "KV_TOKEN"]

    const missingRequired = requiredEnvVars.filter((varName) => !process.env[varName])
    const missingOptional = optionalEnvVars.filter((varName) => !process.env[varName])

    if (missingRequired.length > 0) {
      throw new Error(`Variáveis de ambiente obrigatórias não encontradas: ${missingRequired.join(", ")}`)
    }

    if (missingOptional.length > 0) {
      console.warn(`⚠️ Variáveis opcionais não encontradas (Redis será desabilitado): ${missingOptional.join(", ")}`)
    }
  }

  async getSystemStatus() {
    if (!this.isInitialized || !this.securitySystem) {
      return { 
        status: "not_initialized",
        message: "Sistema não foi inicializado",
        timestamp: new Date().toISOString()
      }
    }

    try {
      const health = await this.securitySystem.healthCheck()
      const metrics = await this.securitySystem.getSecurityMetrics()
      const report = await this.securitySystem.getSecurityReport()

      return {
        status: "VORTEXOR_ULTIMATE_ACTIVE",
        performance: "BOOST",
        security: "EXTREME LEVEL",
        health,
        metrics,
        report,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        initialized: this.isInitialized,
        hasDatabase: !!this.db,
        hasClient: !!this.client,
      }
    } catch (error: any) {
      console.error("Erro ao obter status do sistema:", error)
      return {
        status: "error",
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  async generateSecurityReport() {
    if (!this.securitySystem) {
      throw new Error("Sistema de segurança não inicializado")
    }
    return await this.securitySystem.getSecurityReport()
  }

  async blockThreat(ip: string, duration?: number) {
    if (!this.securitySystem) {
      throw new Error("Sistema de segurança não inicializado")
    }
    await this.securitySystem.blockIP(ip, duration)
  
  }

  async unblockIP(ip: string) {
    if (!this.securitySystem) {
      throw new Error("Sistema de segurança não inicializado")
    }
    await this.securitySystem.unblockIP(ip)
   
  }

  // Métodos para integração com connect.ts
  getSecuritySystem(): VortexorSecuritySystem | null {
    return this.securitySystem
  }

  isSystemInitialized(): boolean {
    return this.isInitialized
  }

  getDatabase(): Db | null {
    return this.db
  }

  getClient(): MongoClient | null {
    return this.client
  }
}

// Funções de conveniência (agora sem recursão)
export async function initializeVortexorUltimate(client: MongoClient, db: Db) {
  const system = VortexorUltimateSystem.getInstance()
  return await system.initialize(client, db)
}

export async function getVortexorStatus() {
  const system = VortexorUltimateSystem.getInstance()
  return await system.getSystemStatus()
}

export async function generateVortexorSecurityReport() {
  const system = VortexorUltimateSystem.getInstance()
  return await system.generateSecurityReport()
}

export async function blockVortexorThreat(ip: string, duration?: number) {
  const system = VortexorUltimateSystem.getInstance()
  return await system.blockThreat(ip, duration)
}

export async function unblockVortexorIP(ip: string) {
  const system = VortexorUltimateSystem.getInstance()
  return await system.unblockIP(ip)
}

// Exportar tipos e outros módulos
export * from "../types/security"


// Função para verificar compatibilidade
export function checkVortexorCompatibility() {
  const requiredNodeVersion = "16.0.0"
  const currentVersion = process.version
  
  const envVars = {
    MONGO_CONNECTION: !!process.env.MONGO_CONNECTION,
    KV_URL: !!process.env.KV_URL,
    KV_TOKEN: !!process.env.KV_TOKEN,
  }

  return {
    nodeVersion: currentVersion,
    requiredVersion: requiredNodeVersion,
    environmentVariables: envVars,
    compatible: envVars.MONGO_CONNECTION, // Mínimo necessário
    timestamp: new Date().toISOString(),
  }
}
