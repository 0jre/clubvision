# API rental/ — Aluguel de Ativos

## Visão Geral
O domínio `rental` é responsável por:
- Gerenciar aluguel de ativos digitais, contratos e histórico de locações.
- Processar extensão de aluguel, consulta de contratos e histórico de uso.

### Principais Endpoints
- `extend-rental.ts`: Extensão de aluguel.
- `get-rentals.ts`: Consulta de contratos e histórico.

## Diagrama Mermaid — Fluxo de Aluguel
```mermaid
sequenceDiagram
    participant User as "Usuário"
    participant API as "rental/"
    participant DB as "Banco de Dados"
    participant Contract as "Contrato de Aluguel"

    User->>API: Solicita aluguel ou extensão
    API->>DB: Valida usuário e ativo
    API->>Contract: Cria ou estende contrato
    Contract-->>API: Confirma operação
    API-->>User: Retorna status e detalhes do aluguel

    Note over API,Contract: Contratos auditáveis e rastreáveis.
```

## Exemplos Práticos
### Payload de Extensão de Aluguel
```json
{
  "userId": "abc123",
  "assetId": "asset_001",
  "days": 7
}
```
### Resposta de Extensão
```json
{
  "success": true,
  "contractId": "contrato_789",
  "newEndDate": "2024-07-01"
}
```

## Taxas, Limites e Segurança
- Limite de 3 extensões por ativo por mês.
- Contratos possuem logs de auditoria e histórico de alterações.
- Todas as operações são autenticadas e auditadas.
 