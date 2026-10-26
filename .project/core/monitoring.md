O módulo `monitoring` é responsável por:
- Coletar métricas de performance, segurança e uso do sistema.
- Realizar health checks periódicos e emitir relatórios.
- Expor status e recomendações para administradores e sistemas externos.
- **metrics.ts**: Coleta e exposição de métricas do core.
- 
```typescript
import { getCoreMetrics } from "@/core/monitoring/metrics"

const metrics = await getCoreMetrics()
console.log(metrics)
```

- Health checks automáticos.
- Relatórios detalhados de status e recomendações.
