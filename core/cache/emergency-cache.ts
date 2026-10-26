// Cache de emergência - ZERO memória RAM
export class EmergencyCache {
  private static instance: EmergencyCache
  private disabled = true

  private constructor() {
  }

  static getInstance(): EmergencyCache {
    if (!EmergencyCache.instance) {
      EmergencyCache.instance = new EmergencyCache()
    }
    return EmergencyCache.instance
  }

  async get<T>(key: string): Promise<T | null> {
    // NÃO usar memória - sempre retornar null
    return null
  }

  async set<T>(key: string, data: T, options: any = {}): Promise<boolean> {
    // NÃO armazenar nada na memória
    return false
  }

  async delete(key: string): Promise<boolean> {
    return true
  }

  getStats() {
    return {
      size: 0,
      currentSize: 0,
      maxSize: 0,
      utilizationPercentage: 0,
      status: "EMERGENCY_MODE",
    }
  }

  clear(): void {
    // Nada para limpar
  }
}
