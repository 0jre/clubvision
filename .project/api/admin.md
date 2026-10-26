# API admin/ — Painel Administrativo

## Visão Geral
O domínio `admin` é responsável por:
- Gerenciar painel administrativo, auditoria, estatísticas, usuários e conteúdo.
- Processar logs, estatísticas, gerenciamento de usuários, conteúdo e monetização.

### Principais Endpoints
- `audit-logs.ts`, `stats.ts`: Auditoria e estatísticas.
- Subdiretórios: `battlepass/`, `users/`, `dashboard/`, `comments/`, `content/`, `monetization/`, `wallet/`.

## Diagrama Mermaid — Fluxo de Auditoria e Gerenciamento
```mermaid
sequenceDiagram
    participant Admin as "Administrador"
    participant API as "admin/"
    participant DB as "Banco de Dados"
    participant Logs as "Logs de Auditoria"
    participant Dashboard as "Dashboard"

    Admin->>API: Solicita relatório ou ação administrativa
    API->>DB: Consulta ou altera dados
    API->>Logs: Registra ação
    API->>Dashboard: Atualiza estatísticas
    API-->>Admin: Retorna status, relatório, estatísticas

    Note over API,Logs: Todas as ações são auditadas e rastreáveis.
    Note over API,Dashboard: Estatísticas em tempo real para admins.
```

## Exemplos Práticos
### Payload de Consulta de Estatísticas
```json
{
  "adminId": "admin_001",
  "metric": "usuarios_ativos"
}
```
### Resposta de Estatísticas
```json
{
  "success": true,
  "metric": "usuarios_ativos",
  "value": 1200
}
```

## Taxas, Limites e Segurança
- Apenas admins autenticados podem acessar.
- Todas as ações são logadas e auditadas.
- Limite de 100 requisições por hora por admin.

 