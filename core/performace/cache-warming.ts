

import type { Db } from 'mongodb';
import type { IntelligentCacheSystem } from './intelligent-cache';

// Exemplo de queries comuns para warming (customize conforme seu sistema)
const COMMON_QUERIES: Record<string, Array<{ query: any; options?: any }>> = {
  users: [
    { query: { type: 'ADMIN' } },
    { query: { active: true } },
  ],
  'member-stats': [
    { query: { level: { $gte: 10 } } },
  ],
  items: [
    { query: { available: true } },
  ],
  // Adicione outras coleções e queries conforme necessário
};

export async function warmupCacheOnStartup(db: Db, cache: IntelligentCacheSystem) {
  for (const [collectionName, queries] of Object.entries(COMMON_QUERIES)) {
    const collection = db.collection(collectionName);
    for (const { query, options } of queries) {
      try {
        // Busca do banco e salva no cache
        const result = await collection.findOne(query, options);
        if (result) {
          const cacheKey = `${process.env.NODE_ENV || 'development'}:${collectionName}:findOne:${JSON.stringify(query)}`;
          await cache.set(cacheKey, result);
        }
      } catch (err) {
        console.error(`[CacheWarming] Erro ao pré-carregar ${collectionName}:`, err);
      }
    }
  }
} 