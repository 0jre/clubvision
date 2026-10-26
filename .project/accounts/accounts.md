# Módulo accounts/ — Contas Vortexor

## Visão Geral
O módulo `accounts` é responsável por:
- Gerenciar sessões, autenticação, visão do usuário, geração de chaves e análise de status.
- Integrar hooks, wallet, token virtual, histórico de resgate e análise de conteúdo.

### Principais Áreas
- **session/**: encode, redirects, index, IP.
- **vision/**: hooks, wallet, token virtual, autenticação, histórico de resgate, etc.
- **keys-vision/**: geração de chaves.
- **analyst/**: análise de status, modlog, verificação de stats, conteúdo impróprio.

## Fluxo Profissional de Login e Sessão
```mermaid
sequenceDiagram
    participant User as "Usuário"
    participant Accounts as "accounts/"
    participant Session as "session/"
    participant Vision as "vision/"
    participant Keys as "keys-vision/"
    participant Analyst as "analyst/"

    User->>Accounts: Solicita login/autenticação
    Accounts->>Session: Valida sessão e IP
    Session-->>Accounts: Confirma sessão
    Accounts->>Vision: Recupera dados do usuário
    Vision-->>Accounts: Retorna wallet, token, histórico
    Accounts->>Keys: Gera/valida chave de acesso
    Keys-->>Accounts: Confirma chave
    Accounts->>Analyst: Analisa status e segurança
    Analyst-->>Accounts: Retorna análise
    Accounts-->>User: Retorna status, sessão e dados

    Note over Accounts,Session: Sessão segura e validação de IP.
    Note over Vision,Keys: Recuperação de dados e geração de chaves.
    Note over Analyst: Análise de status e segurança do usuário.
```