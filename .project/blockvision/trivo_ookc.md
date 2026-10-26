O módulo `trivo_ookc` é responsável por:
- Gerenciar operações de cases (caixas), trocas (trade), upgrades de ativos, tokens virtuais e inventário de usuários.
- Integrar lógica de gamificação, economia de itens e operações de mercado virtual.

### Principais Áreas
- **case/**: Abertura de caixas, distribuição de prêmios, lógica de sorteio.
- **trade/**: Troca de itens entre usuários, negociação e validação de ofertas.
- **upgrader/**: Sistema de upgrade de itens, probabilidades e custos.
- **TokenVirtual/**: Gerenciamento de tokens virtuais, obtenção e conversão (ex: MyTvl.GetX.ts).
- **inventory/**: Controle e exibição do inventário de cada usuário (ex: OpenContainer.ts).

## Fluxo Profissional de Operações Trivo
```mermaid
sequenceDiagram
    participant User as "Usuário"
    participant Trivo as "trivo_ookc/"
    participant Case as "case/"
    participant Trade as "trade/"
    participant Upgrader as "upgrader/"
    participant TokenVirtual as "TokenVirtual/"
    participant Inventory as "inventory/"
    participant Blockvision as "UnivisionX"

    User->>Trivo: Solicita ação (abrir caixa, trocar, upgrade, etc)
    Trivo->>Case: Processa abertura de caixa
    Case-->>Trivo: Retorna prêmio
    Trivo->>Trade: Processa troca de itens
    Trade-->>Trivo: Valida e executa troca
    Trivo->>Upgrader: Solicita upgrade de item
    Upgrader-->>Trivo: Retorna resultado (sucesso/falha)
    Trivo->>TokenVirtual: Gerencia saldo e conversão de tokens
    TokenVirtual-->>Trivo: Atualiza saldo
    Trivo->>Inventory: Atualiza inventário do usuário
    Inventory-->>Trivo: Confirma atualização
    Trivo->>Blockvision: (opcional) Registra operações relevantes
    Blockvision-->>Trivo: Confirmação
    Trivo-->>User: Retorna resultado consolidado

    Note over Trivo,Case: Lógica de sorteio auditável e transparente.
    Note over Trade,Upgrader: Validação de regras e custos em tempo real.
    Note over TokenVirtual,Inventory: Economia virtual integrada ao ambiente BlockVision.
```

## Custos, Taxas e Pontos

- **Taxas de Abertura de Caixa:**
  - Cada abertura de caixa pode ter um custo em tokens virtuais (TVL) ou moeda da plataforma.
  - Taxas variáveis conforme raridade e tipo de caixa.
- **Taxas de Trade:**
  - Trocas entre usuários podem incidir uma taxa percentual (ex: 1% do valor do item) ou taxa fixa.
- **Custos de Upgrade:**
  - Upgrades de itens exigem pagamento em tokens virtuais e/ou pontos, além de possíveis taxas de falha.
- **Pontos de Atividade:**
  - Usuários acumulam pontos ao abrir caixas, realizar trades ou upgrades.
  - Pontos podem ser trocados por benefícios, descontos ou acesso a caixas exclusivas.
- **Transparência:**
  - Todas as taxas e custos são exibidos antes da confirmação.
  - Relatórios de operações, custos e pontos disponíveis para consulta.

