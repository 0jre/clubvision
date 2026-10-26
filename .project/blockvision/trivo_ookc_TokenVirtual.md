O módulo `TokenVirtual` é responsável por:
- Gerenciar saldo, emissão, conversão e uso de tokens virtuais (TVL).
- Integrar tokens a operações de cases, trades, upgrades e inventário.
- Garantir segurança, rastreabilidade e transparência nas operações.
- Todas as operações de débito/crédito são registradas e auditáveis.
- Conversão de pontos em tokens e vice-versa.
- Integração direta com módulos de case, trade, upgrader e inventário.

```mermaid
sequenceDiagram
    participant User as "Usuário"
    participant TokenVirtual as "TokenVirtual/"
    participant Case as "case/"
    participant Trade as "trade/"
    participant Upgrader as "upgrader/"
    participant Inventory as "inventory/"

    User->>TokenVirtual: Consulta saldo ou solicita conversão
    TokenVirtual->>Case: Processa custo de abertura de caixa
    TokenVirtual->>Trade: Processa taxas de trade
    TokenVirtual->>Upgrader: Processa custos de upgrade
    TokenVirtual->>Inventory: Atualiza saldo após operações
    Inventory-->>TokenVirtual: Confirma atualização
    TokenVirtual-->>User: Retorna saldo atualizado

    Note over TokenVirtual,Case: Custos de operações integrados ao saldo de tokens.
    Note over TokenVirtual,Inventory: Rastreabilidade total das operações.
```
