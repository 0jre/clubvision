
# Vision Composite ID (VCID)

## 1. Introdução
O **Vision Composite ID (VCID)** é um esquema de geração de identificadores híbridos, que combina dados determinísticos do usuário com blocos pseudoaleatórios de alta entropia.  
Ele foi projetado para:
- Garantir unicidade prática mesmo em larga escala.  
- Ser legível e segmentado para facilitar parsing e debugging.  
- Ser extensível para futuros blocos de informação sem quebrar o formato original.  

---

## 2. Formato do Identificador


{discordPart}-{iipcLetters}\_{hash4}-{locale}



### Componentes
- **discordPart**  
  Composto pelos 3 primeiros e 3 últimos caracteres do `discordId`.  
  Exemplo: `839417`.

- **iipcLetters**  
  Segmento de 3 caracteres extraídos do `iipcHash`.  
  Exemplo: `AXQ`.

- **hash4**  
  Quatro caracteres pseudoaleatórios de alta entropia gerados a partir do hash do `visionid`.  
  Exemplo: `4fD8`.

- **locale**  
  Código de localização padronizado em maiúsculas.  
  Exemplos: `BR`, `PT`, `US`.

### Exemplo de saída
```

839417-AXQ\_4fD8-BR

```

---

## 3. Processo de Geração

1. **Discord ID Slice**  
```

part1 = discordId\[0..3] + discordId\[-3..]

```

2. **IIPC Hash**  
```

iipcHash = IIPC{rand(36,4)}{rand(10-99)}{rand(36,3)}{rand(10-99)}{rand(0-9)}
iipcLetters = iipcHash\[8..11]

```

3. **Vision Hash (Custom)**  
```

generateCustomHash -> a-bc-de\:fg  (alfabeto base62)
hash4 = primeiros 4 chars sem separadores

```

4. **Locale**  
```

locale.toUpperCase()

```

5. **Compose ID**  
```

VCID = {part1}-{iipcLetters}\_{hash4}-{locale}

```

---

## 4. Entropia e Espaço de Busca

- **iipcLetters**: 3.240 combinações.  
- **hash4**: 62⁴ = 14.776.336 combinações.  
- **Total por `(discordId, locale)`**:  
```

3.240 × 14.776.336 = 47.875.328.640 combinações

````

Isso significa que para cada usuário (definido por `discordId + locale`) existem **~47,8 bilhões de identificadores únicos possíveis**.

---

## 5. Regex de Validação
```regex
^[0-9]{6}-[A-Za-z0-9]{3}_[A-Za-z0-9]{4}-[A-Z]{2,3}$
````

---

## 6. Propriedades do Design

* **Híbrido**: mistura determinístico (`discordId`, `locale`) e aleatório (`iipcHash`, `visionHash`).
* **Segmentado**: legível por humanos e fácil de validar.
* **Escalável**: novos blocos podem ser adicionados sem quebrar parsing atual.
* **Baixa colisão**: espaço de 47,8 bilhões de combinações por usuário.
* **Compatível** com parsing em sistemas distribuídos.

---

## 7. Exemplos

| discordId | locale | VCID gerado          |
| --------- | ------ | -------------------- |
| `839417`  | BR     | `839417-AXQ_4fD8-BR` |
| `913562`  | PT     | `913562-ZTR_a91Y-PT` |
| `451928`  | US     | `451928-KLM_X9zQ-US` |

---

## 8. Possíveis Aplicações

* Chaves de sessão.
* Identificação em sistemas distribuídos.
* Tokens de autenticação temporária.
* Assinaturas digitais auxiliares.
* Rastreamento seguro sem expor dados originais.

---

## 9. Futuras Extensões

* Inclusão de **timestamp** embutido.
* Suporte a **namespaces** customizados.
* Codificação compatível com **base58** para reduzir caracteres especiais.
* Integração nativa com provedores de identidade externos.

---

