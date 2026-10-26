# Arquitetura — trivo_ookc/case

## Visão Geral
O módulo `case` é responsável por:
- Gerenciar a lógica de abertura de caixas (cases), sorteio de prêmios e distribuição de recompensas.
- Garantir transparência, auditabilidade e segurança nos sorteios.
- Integrar com inventário, tokens virtuais e sistema de pontos.

### Principais Áreas
- **src/**: Implementação da lógica de sorteio, regras de distribuição e validação de prêmios.
- **elements/**: Definição dos tipos de caixas, raridades, probabilidades e recompensas possíveis.

## Arquitetura Interna
- Sorteios utilizam algoritmos pseudoaleatórios auditáveis.
- Cada caixa possui configuração de raridade, custo e tabela de prêmios.
- Integração direta com inventário do usuário e saldo de tokens virtuais.
- Logs de operações para auditoria e prevenção de fraudes.

## Fluxo Profissional de Abertura de Caixa
```mermaid
sequenceDiagram
    participant User as "Usuário"
    participant Case as "case/"
    participant Elements as "elements/"
    participant TokenVirtual as "TokenVirtual/"
    participant Inventory as "inventory/"

    User->>Case: Solicita abertura de caixa
    Case->>Elements: Consulta configuração e prêmios
    Case->>TokenVirtual: Verifica saldo e debita custo
    TokenVirtual-->>Case: Confirma débito
    Case->>Elements: Executa sorteio e seleciona prêmio
    Elements-->>Case: Retorna prêmio
    Case->>Inventory: Adiciona prêmio ao inventário
    Inventory-->>Case: Confirma atualização
    Case-->>User: Retorna resultado (prêmio, saldo, pontos)

    Note over Case,Elements: Sorteio auditável e transparente.
    Note over TokenVirtual,Inventory: Integração direta com economia virtual.
```
 