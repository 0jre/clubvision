# Arquitetura — trivo_ookc/upgrader

## Visão Geral
O módulo `upgrader` é responsável por:
- Gerenciar upgrades de itens, aplicando probabilidades de sucesso e custos.
- Integrar economia de tokens virtuais e pontos de atividade.
- Garantir transparência e registro de todas as tentativas de upgrade.

### Principais Áreas
- **src/**: Implementação da lógica de upgrade, cálculo de probabilidades e custos.
- **elements/**: Definição dos itens elegíveis, regras de upgrade e tabelas de sucesso/falha.

## Arquitetura Interna
- Upgrades exigem pagamento em tokens virtuais e/ou pontos.
- Probabilidade de sucesso pode variar conforme item, nível e perfil do usuário.
- Todas as tentativas são registradas para auditoria e estatísticas.

## Fluxo Profissional de Upgrade
```mermaid
sequenceDiagram
    participant User as "Usuário"
    participant Upgrader as "upgrader/"
    participant Elements as "elements/"
    participant TokenVirtual as "TokenVirtual/"
    participant Inventory as "inventory/"

    User->>Upgrader: Solicita upgrade de item
    Upgrader->>Elements: Valida elegibilidade e regras
    Upgrader->>TokenVirtual: Verifica saldo e debita custo
    TokenVirtual-->>Upgrader: Confirma débito
    Upgrader->>Elements: Calcula probabilidade e executa upgrade
    Elements-->>Upgrader: Retorna resultado (sucesso/falha)
    Upgrader->>Inventory: Atualiza item no inventário
    Inventory-->>Upgrader: Confirma atualização
    Upgrader-->>User: Retorna resultado (novo item, saldo, pontos)

    Note over Upgrader,Elements: Probabilidades e regras auditáveis.
    Note over Upgrader,TokenVirtual: Custos e saldo integrados à economia virtual.
```
 