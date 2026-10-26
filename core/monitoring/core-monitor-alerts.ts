 

import type { IntelligentCacheSystem } from '../performace/intelligent-cache';

// Ativar/desativar via env/config
const ENABLE_CORE_MONITOR = process.env.ENABLE_CORE_MONITOR === 'true';
const MONITOR_INTERVAL = 60 * 1000; // 1 minuto

export function startCoreMonitorAlerts(cache: IntelligentCacheSystem) {
  if (!ENABLE_CORE_MONITOR) {
    return;
  }
  setInterval(async () => {
    try {
      const stats = cache.getIntelligentCacheStats();
      // Critérios de alerta
      if (stats.hitRatio < 0.5) {
        sendAlert(`[ALERTA] Hit ratio do cache baixo: ${(stats.hitRatio * 100).toFixed(1)}%`);
      }
      if (stats.queueLength > 100) {
        sendAlert(`[ALERTA] Fila de operações do cache muito grande: ${stats.queueLength}`);
      }
      if (stats.syncLocks > 50) {
        sendAlert(`[ALERTA] Muitos locks de invalidação síncrona: ${stats.syncLocks}`);
      }
      if (stats.totalErrors > 10) {
        sendAlert(`[ALERTA] Muitos erros recentes no cache: ${stats.totalErrors}`);
      }
      if (stats.redisStatus === 'ERROR' || stats.status === 'ERROR') {
        sendAlert(`[ALERTA] Erro crítico no Redis ou cache!`);
      }
    } catch (err) {
      sendAlert(`[CoreMonitor] Erro ao coletar métricas: ${err}`);
    }
  }, MONITOR_INTERVAL);
}

// Função de alerta (pode ser adaptada para Slack, Discord, etc)
function sendAlert(msg: string) {
  // Exemplo: log, mas pode integrar com webhooks, email, etc
  console.warn(msg);
} 