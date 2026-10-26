O módulo `security` é responsável por:
- Monitoramento e proteção contra ameaças (DDoS, injeção, ataques comportamentais).
- Criptografia avançada de dados sensíveis.
- Detecção e bloqueio de operações suspeitas.

```mermaid
sequenceDiagram
    participant Core as "Vortexor Core"
    participant SecMon as "security/security-monitor.ts"
    participant DDoS as "security/ddos-protection.ts"
    participant Encrypt as "security/encryption.ts"
    participant NoSQL as "security/nosql-injection-detector.ts"
    participant API as "API/Serviço Externo"

    API->>Core: Solicita operação
    Core->>SecMon: Analisa contexto e monitora ameaças
    SecMon->>DDoS: Verifica padrões de ataque
    SecMon->>NoSQL: Analisa queries para injeção
    SecMon->>Encrypt: Garante criptografia de dados sensíveis
    DDoS-->>SecMon: Retorna status de ameaça
    NoSQL-->>SecMon: Retorna análise de query
    Encrypt-->>SecMon: Confirma integridade dos dados
    SecMon-->>Core: Aprova ou bloqueia operação
    Core-->>API: Retorna resposta segura

    Note over SecMon,DDoS: Proteção contínua contra ameaças e ataques.
    Note over Encrypt,NoSQL: Criptografia e análise de queries em tempo real.
```
- Monitoramento em tempo real e alertas automáticos.
- Criptografia AES-256-GCM.
- Detecção adaptativa de ameaças.
