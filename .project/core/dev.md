# Módulo .dev/ — Vortexor Core

## Visão Geral
O módulo `.dev` reúne ferramentas, scripts e configurações voltadas para o desenvolvimento, testes e automação do core.

### Principais Arquivos
- **cryptger.js**: Utilitário para geração e gerenciamento de chaves criptográficas.
- **keyct.js**: Utilitário para controle e rotação de chaves.

## Exemplo Profissional de Uso
```javascript
const cryptger = require("@/core/.dev/cryptger.js")
const keyct = require("@/core/.dev/keyct.js")

const chave = cryptger.generateKey()
keyct.rotateKey(chave)
```

## Diferenciais
- Ferramentas para automação de segurança.
- Scripts para testes e desenvolvimento seguro.
 