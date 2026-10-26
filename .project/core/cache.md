
O módulo `cache` é responsável por:
- Gerenciar múltiplas estratégias de cache (memória, Redis, fallback de emergência).
- Implementar LRU, versionamento, fila de operações e sincronização com Redis.
- Garantir alta disponibilidade e performance mesmo em cenários de falha.

```mermaid
sequenceDiagram
    participant Core as "Vortexor Core"
    participant Cache as "cache/ (LRU, Redis, Emergência)"
    participant Redis as "Redis/Upstash"
    participant DB as "MongoDB"

    Core->>Cache: Solicita leitura/gravação de dados
    Cache->>Redis: Sincroniza dados críticos (se disponível)
    Redis-->>Cache: Retorna dados ou confirma operação
    Cache-->>Core: Retorna dados do cache (hit/miss)
    Cache->>DB: Busca dados no banco (em caso de miss)
    DB-->>Cache: Retorna dados
    Cache-->>Core: Retorna dados atualizados

    Note over Cache,Redis: Sincronização automática e fallback em caso de falha.
    Note over Cache: LRU e fila de operações garantem performance e consistência.
```

- LRU com versionamento e métricas.
- Fila de operações com prioridade.
- Fallback automático para cache de emergência.

