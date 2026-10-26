"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import styled, { keyframes } from "styled-components"
import { ThemeProvider } from "styled-components"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowLeft, RefreshCw, Wifi, WifiOff } from "lucide-react"

// Import checkout components
import CheckoutContainer from "@/wallet/checkout-x/CheckoutContainer"
import ROUTENVX from "@/routes/routes"
import HeadGlobal from "@/club/head/glob.n"
import { MarginImagsx } from "@/components/account/account.user"

// Define a basic theme for styled-components
const theme = {
  colors: {
    primary: "#41b45e",
    secondary: "#34a04f",
    text: "#ffffff",
    textSecondary: "#a3a9bb",
    background: "#0e0e11",
    surface: "#1d1f1d",
    border: "#2d2e2d",
    error: "#ff6b6b",
    success: "#41b45e",
  },
  radii: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    xxl: "24px",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  transitions: {
    fast: "0.15s ease",
    default: "0.3s ease",
    slow: "0.5s ease",
  },
}

interface CartItem {
  id: number
  nameitem: string
  priceitem: number
  imagem?: string
  quantity: number
  type?: string
  rarity?: string
}

interface CheckoutData {
  orderId: string
  totalAmount: number
  itemCount: number
  message: string
  userBalance: number
  hasEnoughBalance: boolean
  items: CartItem[]
  estimatedDelivery: string
  fees: {
    networkFee: number
    serviceFee: number
    subtotal: number
    total: number
  }
  // Add code for error responses from API
  code?: string
  existingCheckout?: {
    found: boolean
    status: string
    createdAt: Date
    expiresAt: Date
    timeRemaining: number
    orderId?: string
  }
}

interface DataSource {
  source: "database" | "localStorage" | "merged"
  items: CartItem[]
  totalAmount: number
  isValid: boolean
  lastUpdated?: string
  invalidItems?: Array<{
    id: number
    reason: string
    details: string
  }>
  priceChanged?: boolean
  validationError?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { id, orderId } = router.query
  const Indentificator = id || orderId

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<DataSource | null>(null)

  // Função para obter dados do localStorage
  const getLocalStorageData = async (): Promise<DataSource | null> => {
    try {
      const storedItems = localStorage.getItem("cartItems")
      const storedTotal = localStorage.getItem("cartTotal")

      console.log("💾 Verificando localStorage:", {
        hasItems: !!storedItems,
        hasTotal: !!storedTotal,
        itemsLength: storedItems ? JSON.parse(storedItems).length : 0,
      })

      if (!storedItems || !storedTotal) {
        console.log("❌ localStorage vazio ou incompleto")
        return null
      }

      const cartItems = JSON.parse(storedItems)
      const totalAmount = Number.parseFloat(storedTotal)

      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        console.log("❌ Itens do localStorage inválidos ou vazios")
        return null
      }

      console.log(`✅ localStorage válido: ${cartItems.length} itens, total: ${totalAmount}`)

      return {
        source: "localStorage",
        items: cartItems,
        totalAmount: totalAmount,
        isValid: true, // Assumir válido inicialmente, validação será feita depois
        lastUpdated: localStorage.getItem("cartLastUpdated") || undefined,
      }
    } catch (error) {
      console.error("❌ Erro ao processar dados do localStorage:", error)
      return null
    }
  }

  // Função para obter dados do banco de dados
  const getDatabaseData = async (orderId: string): Promise<DataSource | null> => {
    try {
      const response = await axios.get(`/api/trivo/checkout/${orderId}`)

      if (response.data.success && response.data.data) {
        const data = response.data.data
        return {
          source: "database",
          items: data.items || [],
          totalAmount: data.totalAmount || 0,
          isValid: true,
          lastUpdated: data.updatedAt || data.createdAt,
        }
      }
    } catch (error) {
      console.warn("Erro ao buscar dados do banco:", error)
    }

    return null
  }

  // Função para determinar qual fonte de dados usar
  const determineDataSource = async (): Promise<DataSource | null> => {
    if (!Indentificator) return null

    console.log("🔍 Iniciando determinação da fonte de dados...")

    // 1. Tentar buscar dados do banco de dados primeiro
    const databaseData = await getDatabaseData(Indentificator as string)
    console.log("📊 Dados do banco:", databaseData ? `${databaseData.items.length} itens` : "não encontrado")

    // 2. Buscar dados do localStorage
    const localStorageData = await getLocalStorageData()
    console.log(
      "💾 Dados do localStorage:",
      localStorageData ? `${localStorageData.items.length} itens` : "não encontrado",
    )

    // 3. Lógica de decisão inteligente
    if (databaseData && databaseData.items.length > 0) {
      // Se temos dados válidos do banco, usar eles
      console.log("✅ Usando dados do banco de dados")
      return databaseData
    } else if (localStorageData && localStorageData.items.length > 0) {
      // Carrinho novo - validar itens do localStorage, mas não ser muito restritivo
      console.log("🆕 Carrinho novo detectado - validando itens do localStorage")

      try {
        // Validar itens contra o banco de dados
        const validationResponse = await axios.post("/api/trivo/checkout/validate", {
          items: localStorageData.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        })

        console.log("🔍 Resposta da validação:", validationResponse.data)

        if (validationResponse.data.success) {
          const { validItems, invalidItems, summary } = validationResponse.data.data

          console.log(`📈 Resumo da validação: ${summary.validCount} válidos, ${summary.invalidCount} inválidos`)

          // Se há itens inválidos, atualizar localStorage mas continuar com os válidos
          if (invalidItems.length > 0) {
            console.warn(`⚠️ ${invalidItems.length} itens inválidos encontrados:`, invalidItems)

            // Se ainda há itens válidos, continuar com eles
            if (validItems.length > 0) {
              // Criar lista de itens válidos com dados atualizados do banco
              const updatedValidItems = validItems.map((validItem: any) => {
                const originalItem = localStorageData.items.find((item) => item.id === validItem.id)
                return {
                  id: validItem.id,
                  nameitem: validItem.nameitem,
                  priceitem: validItem.priceitem,
                  imagem: validItem.imagem,
                  quantity: originalItem?.quantity || 1,
                  type: validItem.type,
                  rarity: validItem.rarity,
                }
              })

              // Atualizar localStorage com apenas itens válidos
              const newTotal = updatedValidItems.reduce(
                (sum: any, item: any) => sum + item.priceitem * item.quantity,
                0,
              )
              localStorage.setItem("cartItems", JSON.stringify(updatedValidItems))
              localStorage.setItem("cartTotal", newTotal.toString())
              localStorage.setItem("cartLastUpdated", new Date().toISOString())

              console.log(`✅ Continuando com ${updatedValidItems.length} itens válidos`)

              // Retornar dados atualizados com aviso
              return {
                source: "localStorage",
                items: updatedValidItems,
                totalAmount: newTotal,
                isValid: false, // Marcar como inválido para mostrar aviso
                lastUpdated: new Date().toISOString(),
                invalidItems: invalidItems,
              }
            } else {
              // Todos os itens são inválidos
              console.error("❌ Todos os itens são inválidos")
              localStorage.removeItem("cartItems")
              localStorage.removeItem("cartTotal")
              return null
            }
          }

          // Todos os itens são válidos, mas verificar se preços mudaram
          const updatedItems = validItems.map((validItem: any) => {
            const originalItem = localStorageData.items.find((item) => item.id === validItem.id)
            return {
              id: validItem.id,
              nameitem: validItem.nameitem,
              priceitem: validItem.priceitem,
              imagem: validItem.imagem,
              quantity: originalItem?.quantity || 1,
              type: validItem.type,
              rarity: validItem.rarity,
            }
          })

          const newTotal = updatedItems.reduce((sum: any, item: any) => sum + item.priceitem * item.quantity, 0)
          const priceChanged = Math.abs(newTotal - localStorageData.totalAmount) > 0.01

          if (priceChanged) {
            console.log(`💰 Preços alterados: ${localStorageData.totalAmount} → ${newTotal}`)
            // Atualizar localStorage com preços atualizados
            localStorage.setItem("cartItems", JSON.stringify(updatedItems))
            localStorage.setItem("cartTotal", newTotal.toString())
            localStorage.setItem("cartLastUpdated", new Date().toISOString())
          }

          console.log(`✅ Todos os itens válidos: ${updatedItems.length} itens, total: ${newTotal}`)

          return {
            source: "localStorage",
            items: updatedItems,
            totalAmount: newTotal,
            isValid: true,
            lastUpdated: new Date().toISOString(),
            priceChanged: priceChanged,
          }
        } else {
          console.error("❌ Erro na validação:", validationResponse.data.message)
          // Em caso de erro na validação, usar dados do localStorage como estão
          console.log("🔄 Usando localStorage como fallback")
          return {
            ...localStorageData,
            isValid: false,
            validationError: "Não foi possível validar os itens",
          }
        }
      } catch (validationError) {
        console.error("❌ Erro ao validar itens do localStorage:", validationError)
        // Em caso de erro na validação, usar dados do localStorage como estão
        // mas marcar como potencialmente inválido
        console.log("🔄 Usando localStorage como fallback devido ao erro")
        return {
          ...localStorageData,
          isValid: false,
          validationError: "Não foi possível validar os itens",
        }
      }
    } else if (databaseData && localStorageData) {
      // Se ambos existem mas estão incompletos, tentar fazer merge
      console.log("🔄 Fazendo merge dos dados")
      const mergedItems = [...databaseData.items]

      // Adicionar itens do localStorage que não estão no banco
      localStorageData.items.forEach((localItem) => {
        const existsInDb = mergedItems.some((dbItem) => dbItem.id === localItem.id)
        if (!existsInDb) {
          mergedItems.push(localItem)
        }
      })

      return {
        source: "merged",
        items: mergedItems,
        totalAmount: mergedItems.reduce((sum, item) => sum + item.priceitem * item.quantity, 0),
        isValid: localStorageData.isValid,
        lastUpdated: databaseData.lastUpdated || localStorageData.lastUpdated,
      }
    }

    console.log("❌ Nenhuma fonte de dados válida encontrada")
    return null
  }

  useEffect(() => {
    if (!Indentificator) return

    const initializeCheckout = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Determinar qual fonte de dados usar
        const selectedDataSource = await determineDataSource()

        console.log("🎯 Fonte de dados selecionada:", selectedDataSource)

        if (!selectedDataSource) {
          console.log("❌ Nenhuma fonte de dados encontrada")
          setError("cart_empty") // Fallback for no data source
          setIsLoading(false)
          return
        }

        if (selectedDataSource.items.length === 0) {
          console.log("❌ Fonte de dados sem itens")
          setError("cart_empty") // Fallback for empty data source
          setIsLoading(false)
          return
        }

        setDataSource(selectedDataSource)

        // Verificar se há itens inválidos ou preços alterados
        if (selectedDataSource.invalidItems && selectedDataSource.invalidItems.length > 0) {
          console.log("⚠️ Itens inválidos detectados, mas continuando com válidos")
          setError("items_invalid") // Frontend specific error
          setIsLoading(false)
          return
        }

        if (selectedDataSource.priceChanged) {
          console.log("💰 Preços alterados detectados")
          setError("prices_changed") // Frontend specific error
          setIsLoading(false)
          return
        }

        if (!selectedDataSource.isValid && selectedDataSource.validationError) {
          console.log("⚠️ Erro de validação, mas continuando")
          // Não bloquear o checkout por erro de validação, apenas logar
          console.warn("Erro de validação:", selectedDataSource.validationError)
        }

        // Preparar dados para o checkout
        const checkoutPayload = {
          cartItems: selectedDataSource.items,
          totalAmount: selectedDataSource.totalAmount,
          orderId: Indentificator as string,
          dataSource: selectedDataSource.source,
        }

        // Call checkout API to prepare the order
        const response = await axios.post("/api/trivo/checkout", checkoutPayload)

        if (!response.data.success) {
          // Use the 'code' from the API response if available, otherwise fallback to a generic error
          const apiErrorCode = response.data.code || "checkout_failed"
          setCheckoutData(response.data as CheckoutData) // Set checkoutData to access message
          setError(apiErrorCode)

          // Handle specific API codes
          if (apiErrorCode === "ANOTHER_CHECKOUT_ACTIVE") {
            setPendingOrderId(response.data.data?.existingCheckout?.orderId || null)
          }
          return
        }

        // If success is true, set checkoutData and clear any previous error
        if (response.status === 200 && response.data.success) {
          setCheckoutData(response.data.data)
          setError(null) // Clear error if successful

          // Se usamos dados do localStorage, salvar timestamp da última sincronização
          if (selectedDataSource.source === "localStorage" || selectedDataSource.source === "merged") {
            localStorage.setItem("lastCheckoutSync", new Date().toISOString())
          }
        } else {
          console.warn("Erro da API no checkout:", response.data)
          setError("checkout_failed") // Generic fallback if success is true but status is not 200 (unlikely)
        }
      } catch (error: any) {
        console.error("Erro ao inicializar checkout:", error)

        const isNetwork = error.code === "ECONNABORTED" || error.code === "ERR_NETWORK"
        const isUnauthorized = error.response?.status === 401
        const serverCrashed = error.response?.status >= 500

        if (isUnauthorized) {
          setError("UNAUTHENTICATED") // Map to API code
        } else if (error.response?.status === 409 && error.response.data?.code === "ANOTHER_CHECKOUT_ACTIVE") {
          const existingOrderId =
            error.response.data?.data?.existingCheckout?.orderId || error.response.data?.data?.orderId
          setPendingOrderId(existingOrderId)
          setError("ANOTHER_CHECKOUT_ACTIVE") // Map to API code
        } else if (isNetwork || !navigator.onLine) {
          setError("network_error") // Client-side network error
        } else if (serverCrashed) {
          setError("INTERNAL_SERVER_ERROR") // Map to API code
        } else {
          setError("unknown_error") // Generic client-side error
        }
      } finally {
        setIsLoading(false)
      }
    }

    initializeCheckout()
  }, [Indentificator, router, retryCount])

  const handleFinalizePurchase = async (paymentMethod: string, cardId?: string) => {
    if (!checkoutData) return

    try {
      setIsProcessing(true)

      // Chamar a API para finalizar a compra
      const response = await axios.post("/api/trivo/checkout/purchase", {
        orderId: checkoutData.orderId,
        paymentMethod,
        dataSource: dataSource?.source,
        ...(paymentMethod === "card" && cardId ? { cardId } : {}),
      })

      if (response.data.success) {
        // Limpar localStorage após compra bem-sucedida
        localStorage.removeItem("cartItems")
        localStorage.removeItem("cartTotal")
        localStorage.removeItem("cartLastUpdated")
        localStorage.setItem("lastPurchase", new Date().toISOString())

        if (response.data.data?.redirectUrl) {
          router.push(response.data.data.redirectUrl)
        } else {
          router.push(`/checkout/success?txn=${response.data.data.transactionId}`)
        }
      } else {
        // Redirecionar para a página de erro
        if (response.data.data?.redirectUrl) {
          router.push(response.data.data.redirectUrl)
        } else {
          router.push(`/checkout/error?code=payment_failed&order=${checkoutData.orderId}`)
        }
      }
    } catch (error: any) {
      console.error("Erro ao finalizar compra:", error)
      router.push(`/checkout/error?code=payment_failed&order=${checkoutData.orderId}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    setDataSource(null)
    setRetryCount((prev) => prev + 1)
  }

  const handleBackToStore = () => {
    router.push(ROUTENVX.centralcharges)
  }

  const handleRefreshCart = async () => {
    // Limpar localStorage e forçar nova busca
    localStorage.removeItem("cartItems")
    localStorage.removeItem("cartTotal")
    localStorage.removeItem("cartLastUpdated")
    handleRetry()
  }

  const getErrorConfig = (errorType: string) => {
    switch (errorType) {
      case "cart_empty":
      case "CART_EMPTY_OR_INVALID": // New API code
        return {
          icon: <AlertTriangle size={48} />,
          title: "Carrinho Vazio",
          description:
            checkoutData?.message ||
            "Não encontramos itens válidos no seu carrinho. Adicione alguns itens épicos antes de finalizar a compra.",
          primaryAction: "Ir às Compras",
          showRetry: false,
        }

      case "items_invalid": // Frontend specific error
        return {
          icon: <AlertTriangle size={48} />,
          title: "Itens Inválidos Removidos",
          description:
            checkoutData?.message ||
            "Alguns itens do seu carrinho não estão mais disponíveis e foram removidos automaticamente.",
          primaryAction: "Continuar com Itens Válidos",
          secondaryAction: "Ver Sobre",
          showRetry: false,
        }

      case "prices_changed": // Frontend specific error
        return {
          icon: <AlertTriangle size={48} />,
          title: "Preços Atualizados",
          description:
            checkoutData?.message ||
            "Os preços de alguns itens foram atualizados. O total do seu carrinho foi recalculado.",
          primaryAction: "Continuar com Preços Atualizados",
          secondaryAction: "Revisar Carrinho",
          showRetry: false,
        }

      case "items_changed": // Frontend specific error
      case "INVALID_ITEM_DATA": // New API code
      case "INVALID_ITEM_QUANTITY": // New API code
      case "TOTAL_AMOUNT_MISMATCH": // New API code
        return {
          icon: <AlertTriangle size={48} />,
          title: "Itens Alterados ou Inválidos",
          description:
            checkoutData?.message ||
            "Alguns itens do seu carrinho foram alterados, não estão mais disponíveis ou seus dados são inválidos. Atualize seu carrinho.",
          primaryAction: "Atualizar Carrinho",
          secondaryAction: "Ver Sobre",
          showRetry: true,
        }

      case "unauthorized":
      case "UNAUTHENTICATED": // New API code
        return {
          icon: <AlertTriangle size={48} />,
          title: "Acesso Negado",
          description:
            checkoutData?.message || "Você precisa estar logado para acessar o checkout. Faça login e tente novamente.",
          primaryAction: "Fazer Login",
          showRetry: false,
        }

      case "ANOTHER_CHECKOUT_ACTIVE": // New API code for a different pending order
        return {
          icon: <AlertTriangle size={48} />,
          title: "Outro Checkout em Andamento",
          description:
            checkoutData?.message || "Você já iniciou outro pedido. Deseja continuar com ele ou cancelar o anterior?",
          primaryAction: "Continuar com Outro Pedido",
          secondaryAction: "Cancelar Checkout Anterior",
          showRetry: false,
        }

      case "network_error": // Client-side error
        return {
          icon: <WifiOff size={48} />,
          title: "Sem Conexão",
          description: checkoutData?.message || "Verifique sua conexão com a internet e tente novamente.",
          primaryAction: "Tentar Novamente",
          showRetry: true,
        }

      case "checkout_failed": // Generic frontend error
      case "INVALID_TOTAL_AMOUNT": // New API code
      case "INVALID_ORDER_ID": // New API code
      case "USER_NOT_FOUND": // New API code
      case "METHOD_NOT_ALLOWED": // New API code
        return {
          icon: <AlertTriangle size={48} />,
          title: "Erro no Checkout",
          description:
            checkoutData?.message || "Não foi possível preparar seu checkout. Verifique os itens e tente novamente.",
          primaryAction: "Tentar Novamente",
          showRetry: true,
        }

      case "server_down": // Client-side error
      case "INTERNAL_SERVER_ERROR": // New API code
        return {
          icon: <AlertTriangle size={48} />,
          title: "Serviço Temporariamente Indisponível",
          description:
            checkoutData?.message ||
            "Estamos enfrentando instabilidades nos servidores. Por favor, tente novamente em alguns minutos.",
          primaryAction: "Tentar Novamente",
          showRetry: true,
        }

      case "unknown_error": // Generic client-side error
        return {
          icon: <AlertTriangle size={48} />,
          title: "Erro Desconhecido",
          description: checkoutData?.message || "Algo inesperado aconteceu. Pode ser um problema temporário.",
          primaryAction: "Tentar Novamente",
          showRetry: true,
        }

      case "ORDER_ALREADY_COMPLETED": // New API code
        return {
          icon: <AlertTriangle size={48} />,
          title: "Pedido Já Concluído",
          description:
            checkoutData?.message || "Este pedido já foi processado com sucesso. Volte à loja para novas compras.",
          primaryAction: "Ver Sobre",
          showRetry: false,
        }

      default:
        return {
          icon: <AlertTriangle size={48} />,
          title: "Algo deu errado",
          description:
            checkoutData?.message ||
            "Ocorreu um erro inesperado. Verifique se ja existe um checkout pendente e finalize.",
          primaryAction: "Tentar Novamente",
          showRetry: true,
        }
    }
  }

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CheckoutPageWrapper>
          <LoadingContainer>
            <LoadingCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MarginImagsx>
                <img src="/icons/market/20250325_192605.webp" alt="novision" width={120} height={120} className="b1" />
                <img src="/icons/market/20250325_192624.webp" alt="novision" width={120} height={120} className="b2" />
              </MarginImagsx>

              <LoadingTitle>Preparando checkout</LoadingTitle>
              <LoadingDescription>
                {dataSource
                  ? `Conectando ao ${
                      dataSource.source === "database"
                        ? "checkout pedente"
                        : dataSource.source === "localStorage"
                          ? "carrinho local"
                          : "combinados "
                    }...`
                  : "Verificando itens e calculando valores..."}
              </LoadingDescription>
            </LoadingCard>
          </LoadingContainer>
        </CheckoutPageWrapper>
      </ThemeProvider>
    )
  }

  if (error) {
    const errorConfig = getErrorConfig(error)

    return (
      <ThemeProvider theme={theme}>
        <HeadGlobal Title="Você no checkout do thenovision - Realize o pagamento para desfrutar da aquisição" />
        <CheckoutPageWrapper>
          <ErrorContainer>
            <ErrorCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ErrorIcon
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
              >
                {errorConfig.icon}
                <ErrorIconRing />
              </ErrorIcon>

              <ErrorTitle>{errorConfig.title}</ErrorTitle>
              <ErrorDescription>{errorConfig.description}</ErrorDescription>

              {/* Mostrar informações sobre a fonte de dados quando relevante */}
              {dataSource &&
                (error === "items_changed" ||
                  error === "checkout_failed" ||
                  error === "INVALID_ITEM_DATA" ||
                  error === "INVALID_ITEM_QUANTITY" ||
                  error === "TOTAL_AMOUNT_MISMATCH") && (
                  <DataSourceInfo>
                    <DataSourceTitle>Fonte dos Dados</DataSourceTitle>
                    <DataSourceDetail>
                      <span>Origem:</span>
                      <span>
                        {dataSource.source === "database" && "Banco de Dados"}
                        {dataSource.source === "localStorage" && "Carrinho Local"}
                        {dataSource.source === "merged" && "Dados Combinados"}
                      </span>
                    </DataSourceDetail>
                    <DataSourceDetail>
                      <span>Itens:</span>
                      <span>{dataSource.items.length}</span>
                    </DataSourceDetail>
                    <DataSourceDetail>
                      <span>Total:</span>
                      <span>{dataSource.totalAmount.toFixed(2)} Bits</span>
                    </DataSourceDetail>
                  </DataSourceInfo>
                )}

              <ErrorActions>
                {error === "ANOTHER_CHECKOUT_ACTIVE" ? (
                  <>
                    <PrimaryButton
                      onClick={() =>
                        router.push(
                          `${ROUTENVX.checkout}/${pendingOrderId || checkoutData?.existingCheckout?.orderId}`,
                        )
                      }
                    >
                      {errorConfig.primaryAction}
                    </PrimaryButton>
                    <SecondaryButton
                      onClick={async () => {
                        try {
                          await axios.post("/api/trivo/checkout/cancel_checkout", {
                            orderId: pendingOrderId || checkoutData?.existingCheckout?.orderId,
                          })
                          localStorage.removeItem("activeOrderId")
                          setPendingOrderId(null)
                          setError(null)
                          setIsLoading(true)
                          setRetryCount((prev) => prev + 1)
                        } catch (err) {
                          console.error("Erro ao cancelar o checkout anterior:", err)
                          alert("Erro ao cancelar. Tente novamente.")
                        }
                      }}
                    >
                      {errorConfig.secondaryAction}
                    </SecondaryButton>
                  </>
                ) : error === "items_changed" ||
                  error === "INVALID_ITEM_DATA" ||
                  error === "INVALID_ITEM_QUANTITY" ||
                  error === "TOTAL_AMOUNT_MISMATCH" ? (
                  <>
                    <PrimaryButton onClick={handleRefreshCart}>
                      <RefreshCw size={16} />
                      {errorConfig.primaryAction}
                    </PrimaryButton>
                    <SecondaryButton onClick={handleBackToStore}>{errorConfig.secondaryAction}</SecondaryButton>
                  </>
                ) : errorConfig.showRetry ? (
                  <PrimaryButton onClick={handleRetry}>
                    <RefreshCw size={16} />
                    {errorConfig.primaryAction}
                  </PrimaryButton>
                ) : (
                  <PrimaryButton onClick={handleBackToStore}>{errorConfig.primaryAction}</PrimaryButton>
                )}
              </ErrorActions>
            </ErrorCard>
          </ErrorContainer>
        </CheckoutPageWrapper>
      </ThemeProvider>
    )
  }

  // If there's no error and checkoutData is available, render the CheckoutContainer
  if (!checkoutData) {
    return (
      <ThemeProvider theme={theme}>
        <CheckoutPageWrapper>
          <ErrorContainer>
            <ErrorCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ErrorIcon
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
              >
                <AlertTriangle size={48} />
                <ErrorIconRing />
              </ErrorIcon>

              <ErrorTitle>Dados não encontrados</ErrorTitle>
              <ErrorDescription>
                Não foi possível carregar os dados do checkout. Tente adicionar os itens ao carrinho novamente.
              </ErrorDescription>

              <ErrorActions>
                <PrimaryButton onClick={handleRetry}>
                  <RefreshCw size={16} />
                  Tentar Novamente
                </PrimaryButton>

                <SecondaryButton onClick={handleBackToStore}>
                  <ArrowLeft size={16} />
                  Ver Sobre
                </SecondaryButton>
              </ErrorActions>

              <ConnectionStatus>
                <StatusIndicator online={navigator.onLine}>
                  {navigator.onLine ? <Wifi size={14} /> : <WifiOff size={14} />}
                </StatusIndicator>
                <span>{navigator.onLine ? "Conectado" : "Sem conexão"}</span>
              </ConnectionStatus>
            </ErrorCard>
          </ErrorContainer>
        </CheckoutPageWrapper>
      </ThemeProvider>
    )
  }

  const handleFinalizePurchaseVoid = async (paymentMethod: string, cardId?: string) => {
    await handleFinalizePurchase(paymentMethod, cardId)
  }

  return (
    <ThemeProvider theme={theme}>
      <HeadGlobal Title="Checkout - #TheNoVision" />
      <CheckoutPageWrapper>
        <CheckoutContainer
          checkoutData={checkoutData}
          onFinalizePurchase={handleFinalizePurchaseVoid}
          isProcessing={isProcessing}
        />
      </CheckoutPageWrapper>
    </ThemeProvider>
  )
}

// Animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`

const ringPulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
`

// Styled components
const CheckoutPageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(145deg, #1a1c1bd8 0%, #0f111076 100%);
  backdrop-filter: blur(1px);
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1999;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  
 
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  z-index: 1;
`

const LoadingCard = styled(motion.div)`
  padding: 3rem 2rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
`

const LoadingIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid rgba(65, 180, 94, 0.3);
  border-top: 3px solid #41b45e;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const LoadingTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
  font-family: 'Inter', sans-serif;
`

const LoadingDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  z-index: 1;
`

const ErrorCard = styled(motion.div)`
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 450px;
  width: 100%;
`

const ErrorIcon = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0.05) 100%);
  color: #ff6b6b;
  animation: ${pulse} 2s infinite ease-in-out;
`

const ErrorIconRing = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  border: 2px solid #ff6b6b;
  animation: ${ringPulse} 2s infinite;
`

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.65rem;
  font-family: 'Inter', sans-serif;
`

const ErrorDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 2rem;
`

const DataSourceInfo = styled.div`
  background: rgba(45, 48, 46, 0.3);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
`

const DataSourceTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffc107;
  margin-bottom: 0.75rem;
`

const DataSourceDetail = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const ErrorActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  padding: 1em 1em;
  background: linear-gradient(135deg, #b1333337 0%, #c41e3a 100%);
  border: none;
  border-radius: 46px;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  font-family: 'InterSemiBold', sans-serif;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  
  &:hover {
      
    color: white;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  padding: 0.75rem;
  background: rgba(45, 48, 46, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const StatusIndicator = styled.div<{ online: boolean }>`
  display: flex;
  align-items: center;
  color: ${(props) => (props.online ? "#41b45e" : "#ff6b6b")};
`
