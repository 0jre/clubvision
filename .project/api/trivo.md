# API trivo/ — Operações de Mercado e Gamificação

## Visão Geral
O domínio `trivo` é responsável por:
- Gerenciar operações de mercado, cases, trading, upgrades e inventário.
- Processar abertura de caixas, trocas, upgrades e consulta de inventário.

### Principais Endpoints
- Subdiretórios: `upgrader/`, `checkout/`, `trading/`, `trade/`, `case/`.
- Endpoints para abrir caixa, realizar trade, upgrade e consultar inventário.

## Diagrama Mermaid — Fluxo de Operações Trivo
```mermaid
sequenceDiagram
    participant User as "Usuário"
    participant API as "trivo/"
    participant Case as "Case/"
    participant Trade as "Trade/"
    participant Upgrader as "Upgrader/"
    participant Inventory as "Inventory/"

    User->>API: Solicita ação (abrir caixa, trade, upgrade)
    API->>Case: Processa abertura de caixa
    API->>Trade: Processa troca de itens
    API->>Upgrader: Processa upgrade de item
    API->>Inventory: Atualiza inventário
    API-->>User: Retorna resultado consolidado

    Note over API,Case: Lógica de sorteio auditável.
    Note over API,Trade: Trocas seguras e validadas.
    Note over API,Upgrader: Upgrades com custos e probabilidades.
    Note over API,Inventory: Inventário atualizado em tempo real.
```

## Exemplos Práticos
### Payload de Abertura de Caixa
```json
{
  "userId": "abc123",
  "caseId": "case_gold_01"
}
```
### Resposta de Abertura
```json
{
  "success": true,
  "prize": {
    "itemId": "item_legendary_sword",
    "rarity": "legendary"
  },
  "newBalance": 90
}
```

## Taxas, Limites e Segurança
- Taxa variável por operação (conforme tipo de caixa/trade/upgrade).
- Limite de 20 operações por dia por usuário.
- Todas as operações são autenticadas, auditadas e rastreáveis.

 