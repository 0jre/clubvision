/**
 * Utilitários para processamento de itens no sistema de checkout
 */

/**
 * Gera um ID único para tokens de itens
 */
export const generateTokenID = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let tokenID = "rl_"

  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    tokenID += characters.charAt(randomIndex)
  }

  return tokenID
}

/**
 * Determina a condição do item baseado no número de proprietários anteriores
 */
export const determineItemCondition = (previousOwners: string[]): string => {
  const ownerCount = previousOwners.length

  if (ownerCount === 0) return "NOVO"
  if (ownerCount <= 2) return "SEMINOVO"
  if (ownerCount <= 5) return "USADO"
  return "VELHO"
}

/**
 * Calcula o valor do item baseado na raridade e depreciação
 */
export const calculateItemValue = async (item: any, previousOwners: string[]): Promise<number> => {
  let basePrice = item.priceitem || 0

  // Multiplicador baseado na raridade
  switch (item.rarity?.toLowerCase()) {
    case "comum":
      basePrice *= 1
      break
    case "raro":
      basePrice *= 1.2
      break
    case "épico":
    case "epico":
      basePrice *= 1.5
      break
    case "lendário":
    case "legendario":
      basePrice *= 2
      break
    case "mítico":
    case "mitico":
      basePrice *= 3
      break
    default:
      basePrice *= 1
  }

  // Fator de depreciação baseado no número de proprietários anteriores
  const depreciationFactor = previousOwners.length > 0 ? Math.max(0.5, 0.95 ** previousOwners.length) : 1

  return Math.round(basePrice * depreciationFactor)
}

/**
 * Gera um ID de transação único
 */
export const generateTransactionId = (): string => {
  const timestamp = Date.now()
  const randomPart = Math.random().toString(36).substr(2, 9)
  return `txn_${timestamp}_${randomPart}`
}

/**
 * Formata valores monetários para exibição
 */
export const formatCurrency = (value: number, currency = "Bits"): string => {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`
}

/**
 * Calcula taxas de transação
 */
export const calculateTransactionFees = (subtotal: number) => {
  const networkFee = Math.max(0.5, subtotal * 0.02) // 2% ou mínimo 0.5
  const serviceFee = Math.max(0.25, subtotal * 0.01) // 1% ou mínimo 0.25
  const total = subtotal + networkFee + serviceFee

  return {
    networkFee: Math.round(networkFee * 100) / 100,
    serviceFee: Math.round(serviceFee * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

/**
 * Valida se um item pode ser processado
 */
export const validateCartItem = (item: any): { valid: boolean; error?: string } => {
  if (!item.id) {
    return { valid: false, error: "ID do item é obrigatório" }
  }

  if (!item.nameitem || item.nameitem.trim() === "") {
    return { valid: false, error: "Nome do item é obrigatório" }
  }

  if (!item.priceitem || item.priceitem <= 0) {
    return { valid: false, error: "Preço do item deve ser maior que zero" }
  }

  if (!item.quantity || item.quantity <= 0) {
    return { valid: false, error: "Quantidade deve ser maior que zero" }
  }

  return { valid: true }
}

/**
 * Calcula o saldo total disponível para um usuário
 */
export const calculateTotalBalance = (user: any): number => {
  const bits = user.bits || 0
  const bitsCredits = user.bitsCredits || 0
  const orbitCredits = user.orbitCredits || 0
  const banking = user.banking || 0

  return bits + bitsCredits + orbitCredits + banking
}

/**
 * Determina quais campos de saldo usar baseado no tipo de cartão
 */
export const getBalanceFieldsForCard = (cardType: string, user: any) => {
  const fields: Array<{ field: string; balance: number }> = []

  switch (cardType) {
    case "VisionPay":
    case "Orbitcredit":
      // Orbitcredit pode ser orbitCredits OU banking
      if (user.orbitCredits > 0) {
        fields.push({ field: "orbitCredits", balance: user.orbitCredits })
      }
      if (user.banking > 0) {
        fields.push({ field: "banking", balance: user.banking })
      }
      break

    case "Sapphire":
      if (user.bitsCredits > 0) {
        fields.push({ field: "bitsCredits", balance: user.bitsCredits })
      }
      break

    case "VΛULT":
      if (user.bitsCredits > 0) {
        fields.push({ field: "bitsCredits", balance: user.bitsCredits })
      }
      if (user.orbitCredits > 0) {
        fields.push({ field: "orbitCredits", balance: user.orbitCredits })
      }
      if (user.banking > 0) {
        fields.push({ field: "banking", balance: user.banking })
      }
      break

    default:
      if (user.bits > 0) {
        fields.push({ field: "bits", balance: user.bits })
      }
      if (user.bitsCredits > 0) {
        fields.push({ field: "bitsCredits", balance: user.bitsCredits })
      }
      if (user.orbitCredits > 0) {
        fields.push({ field: "orbitCredits", balance: user.orbitCredits })
      }
      if (user.banking > 0) {
        fields.push({ field: "banking", balance: user.banking })
      }
  }

  return fields
}
/**
 * Distribui um valor entre múltiplos campos de saldo
 */
export const distributeAmountAcrossFields = (
  amount: number,
  fields: Array<{ field: string; balance: number }>,
): Array<{ field: string; amount: number }> => {
  const debitFields: Array<{ field: string; amount: number }> = []
  let remaining = amount

  // Ordena os campos por saldo (maior primeiro) para otimizar a distribuição
  const sortedFields = [...fields].sort((a, b) => b.balance - a.balance)

  for (const field of sortedFields) {
    if (remaining <= 0) break

    const debitAmount = Math.min(field.balance, remaining)
    if (debitAmount > 0) {
      debitFields.push({ field: field.field, amount: debitAmount })
      remaining -= debitAmount
    }
  }

  return debitFields
}

/**
 * Gera dados de exemplo para testes
 */
export const generateMockCartItem = (overrides: any = {}) => {
  return {
    id: Math.floor(Math.random() * 10000),
    nameitem: "Item de Teste",
    priceitem: 100,
    quantity: 1,
    rarity: "comum",
    type: "weapon",
    imagem: "/placeholder.svg?height=64&width=64",
    ...overrides,
  }
}

/**
 * Valida status de cartão
 */
export const isCardUsable = (card: any): { usable: boolean; reason?: string } => {
  if (!card) {
    return { usable: false, reason: "Cartão não encontrado" }
  }

  if (card.status === "frozen") {
    return { usable: false, reason: "Cartão está bloqueado/congelado" }
  }

  if (card.status === "suspended") {
    return { usable: false, reason: "Cartão está suspenso temporariamente" }
  }

  if (card.status === "limited") {
    return { usable: false, reason: "Cartão tem limitações ativas" }
  }

  if (card.status === "expired") {
    return { usable: false, reason: "Cartão está expirado" }
  }

  if (card.status === "cancelled") {
    return { usable: false, reason: "Cartão foi cancelado" }
  }

  if (card.status !== "active") {
    return { usable: false, reason: "Cartão não está ativo" }
  }

  // Verificar se o cartão está expirado pela data
  if (card.expiry) {
    const [month, year] = card.expiry.split("/")
    const expiryDate = new Date(2000 + Number.parseInt(year), Number.parseInt(month) - 1)
    const now = new Date()

    if (expiryDate < now) {
      return { usable: false, reason: "Cartão expirado" }
    }
  }

  return { usable: true }
}


// Gera um número de cartão válido usando o algoritmo de Luhn
export const generateCardNumber = (): string => {
    const bin = '421003'; // BIN fictício
    let number = bin;
  
    // Gera os próximos 9 dígitos aleatórios (total 15 sem o último)
    for (let i = 0; i < 9; i++) {
      number += Math.floor(Math.random() * 10);
    }
  
    // Adiciona o dígito verificador Luhn
    const checkDigit = getLuhnCheckDigit(number);
    number += checkDigit;
  
    // Formata como cartão real: #### #### #### ####
    return number.replace(/(.{4})/g, '$1 ').trim();
  };
  
  // Algoritmo de Luhn para gerar dígito verificador
  const getLuhnCheckDigit = (num: string): number => {
    const digits = num.split('').map(Number).reverse();
    const sum = digits.reduce((acc, digit, idx) => {
      if (idx % 2 === 0) return acc + digit;
      const doubled = digit * 2;
      return acc + (doubled > 9 ? doubled - 9 : doubled);
    }, 0);
    return (10 - (sum % 10)) % 10;
  };
  
  // Gera CVV realista de 3 dígitos
  export const generateCVV = (): string => {
    return Math.floor(100 + Math.random() * 900).toString(); // 100 - 999
  };
  