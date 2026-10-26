"use client"

import { useState, useEffect } from "react"

interface ApiOptions {
  endpoint: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  query?: Record<string, string | number | boolean>
}

interface ApiResponse<T> {
  data: T | any
  error: string | null
  loading: boolean
  refetch: () => Promise<void>
}

export function useWalletApi<T>({ endpoint, method = "GET", body, query }: ApiOptions): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Construir a URL com os parâmetros de consulta
      let url = `/api/admin/wallet/${endpoint}`
      if (query) {
        const queryParams = new URLSearchParams()
        Object.entries(query).forEach(([key, value]) => {
          queryParams.append(key, String(value))
        })
        url += `?${queryParams.toString()}`
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        const errorData = await response.json() as any
        throw new Error(errorData.message || "Erro ao processar a requisição")
      }

      const responseData = await response.json() as any
      setData(responseData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  // Executar a requisição inicial
  useEffect(() => {
    fetchData()
  }, [endpoint, method, JSON.stringify(body), JSON.stringify(query)])

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  }
}

// Hooks específicos para cada funcionalidade
export function useWalletOverview(timeframe = "7d") {
  return useWalletApi({
    endpoint: "overview",
    query: { timeframe },
  })
}

export function useWalletUsers(filters: Record<string, any> = {}) {
  return useWalletApi({
    endpoint: "users",
    query: filters,
  })
}

export function useWalletTransactions(filters: Record<string, any> = {}) {
  return useWalletApi({
    endpoint: "transactions",
    query: filters,
  })
}

export function useWalletAuditLogs(filters: Record<string, any> = {}) {
  return useWalletApi({
    endpoint: "audit-logs",
    query: filters,
  })
}

export function useUserWallet(userId: string) {
  return useWalletApi({
    endpoint: `user/${userId}`,
  })
}

// Funções para ações específicas
export async function updateUserWallet(
  userId: string,
  action: string,
  amount: number,
  currency: string,
  reason?: string,
) {
  try {
    const response = await fetch(`/api/admin/wallet/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, amount, currency, reason }),
    })

    if (!response.ok) {
      const errorData = await response.json() as any
      throw new Error(errorData.message || "Erro ao atualizar carteira do usuário")
    }

    return await response.json()
  } catch (err) {
    throw err
  }
}

 
 
const useWalletAPIx = () => {
  // Add your existing functions here, if any.
  // For example:
  // const [data, setData] = useState(null);

  // useEffect(() => {
  //   // Fetch initial data or perform other setup tasks
  // }, []);

  const fetchStakingOverview = async () => {
    const response = await fetch("/api/admin/wallet/staking/overview")
    if (!response.ok) throw new Error("Failed to fetch staking overview")
    return response.json()
  }

  const fetchStakingUsers = async (filters: any) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`/api/admin/wallet/staking/users?${params}`)
    if (!response.ok) throw new Error("Failed to fetch staking users")
    return response.json()
  }

  const fetchStakingValidators = async () => {
    const response = await fetch("/api/admin/wallet/staking/validators")
    if (!response.ok) throw new Error("Failed to fetch validators")
    return response.json()
  }

  const createValidator = async (validatorData: any) => {
    const response = await fetch("/api/admin/wallet/staking/validators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatorData),
    })
    if (!response.ok) throw new Error("Failed to create validator")
    return response.json()
  }

  const performStakingAction = async (userId: string, action: string, data: any) => {
    const response = await fetch(`/api/admin/wallet/staking/user/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...data }),
    })
    if (!response.ok) throw new Error("Failed to perform staking action")
    return response.json()
  }

  const fetchMarketplaceOverview = async () => {
    const response = await fetch("/api/admin/wallet/marketplace/overview")
    if (!response.ok) throw new Error("Failed to fetch marketplace overview")
    return response.json()
  }

  const fetchMarketplaceTransactions = async (filters: any) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`/api/admin/wallet/marketplace/transactions?${params}`)
    if (!response.ok) throw new Error("Failed to fetch marketplace transactions")
    return response.json()
  }

  const fetchMarketplaceCases = async () => {
    const response = await fetch("/api/admin/wallet/marketplace/cases")
    if (!response.ok) throw new Error("Failed to fetch case data")
    return response.json()
  }

  const performCaseAction = async (action: string, data?: any) => {
    const response = await fetch("/api/admin/wallet/marketplace/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, data }),
    })
    if (!response.ok) throw new Error("Failed to perform case action")
    return response.json()
  }

  const fetchMarketplaceUpgrades = async (filters: any) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`/api/admin/wallet/marketplace/upgrades?${params}`)
    if (!response.ok) throw new Error("Failed to fetch upgrades")
    return response.json()
  }

  const performUpgradeAction = async (action: string, upgradeId: string, data?: any) => {
    const response = await fetch("/api/admin/wallet/marketplace/upgrades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, upgradeId, data }),
    })
    if (!response.ok) throw new Error("Failed to perform upgrade action")
    return response.json()
  }

  // New checkout functions
  const fetchCheckoutOverview = async (timeframe = "24h") => {
    const response = await fetch(`/api/admin/wallet/marketplace/checkout/overview?timeframe=${timeframe}`)
    if (!response.ok) throw new Error("Failed to fetch checkout overview")
    return response.json()
  }

  const fetchCheckoutSessions = async (filters: any) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`/api/admin/wallet/marketplace/checkout/sessions?${params}`)
    if (!response.ok) throw new Error("Failed to fetch checkout sessions")
    return response.json()
  }

  const performCheckoutAction = async (action: string, sessionIds: string[], reason?: string) => {
    const response = await fetch("/api/admin/wallet/marketplace/checkout/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, sessionIds, reason }),
    })
    if (!response.ok) throw new Error("Failed to perform checkout action")
    return response.json()
  }

  const fetchCheckoutTransactions = async (filters: any) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`/api/admin/wallet/marketplace/checkout/transactions?${params}`)
    if (!response.ok) throw new Error("Failed to fetch checkout transactions")
    return response.json()
  }

  const performTransactionAction = async (action: string, transactionIds: string[], reason?: string) => {
    const response = await fetch("/api/admin/wallet/marketplace/checkout/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, transactionIds, reason }),
    })
    if (!response.ok) throw new Error("Failed to perform transaction action")
    return response.json()
  }

  const fetchCheckoutAnalytics = async (period = "7d") => {
    const response = await fetch(`/api/admin/wallet/marketplace/checkout/analytics?period=${period}`)
    if (!response.ok) throw new Error("Failed to fetch checkout analytics")
    return response.json()
  }


    // New monetization functions
  const fetchMonetizationOverview = async (timeframe = "30d") => {
    const response = await fetch(`/api/admin/monetization/overview?timeframe=${timeframe}`)
    if (!response.ok) throw new Error("Failed to fetch monetization overview")
    return response.json()
  }

  const fetchMonetizationCreators = async (filters: any) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`/api/admin/monetization/creators?${params}`)
    if (!response.ok) throw new Error("Failed to fetch monetization creators")
    return response.json()
  }

  const performCreatorAction = async (action: string, userIds: string[], amount?: number, reason?: string) => {
    const response = await fetch("/api/admin/monetization/creators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, userIds, amount, reason }),
    })
    if (!response.ok) throw new Error("Failed to perform creator action")
    return response.json()
  }

  const fetchMonetizationWithdrawals = async (filters: any) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`/api/admin/monetization/withdrawals?${params}`)
    if (!response.ok) throw new Error("Failed to fetch monetization withdrawals")
    return response.json()
  }

  const performWithdrawalAction = async (action: string, withdrawalIds: string[], reason?: string) => {
    const response = await fetch("/api/admin/monetization/withdrawals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, withdrawalIds, reason }),
    })
    if (!response.ok) throw new Error("Failed to perform withdrawal action")
    return response.json()
  }

  const fetchMonetizationAnalytics = async (period = "30d") => {
    const response = await fetch(`/api/admin/monetization/analytics?period=${period}`)
    if (!response.ok) throw new Error("Failed to fetch monetization analytics")
    return response.json()
  }

  // New admin dashboard functions
  const fetchDashboardOverview = async () => {
    const response = await fetch("/api/admin/dashboard/overview")
    if (!response.ok) throw new Error("Failed to fetch dashboard overview")
    return response.json()
  }

  const searchUsers = async (query: string) => {
    const response = await fetch(`/api/admin/users/search?query=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error("Failed to search users")
    return response.json()
  }

  return {
    // ... existing functions, if any
    fetchStakingOverview,
    fetchStakingUsers,
    fetchStakingValidators,
    createValidator,
    performStakingAction,
    fetchMarketplaceOverview,
    fetchMarketplaceTransactions,
    fetchMarketplaceCases,
    performCaseAction,
    fetchMarketplaceUpgrades,
    performUpgradeAction,
    // New checkout functions
    fetchCheckoutOverview,
    fetchCheckoutSessions,
    performCheckoutAction,
    fetchCheckoutTransactions,
    performTransactionAction,
    fetchCheckoutAnalytics,

        // New monetization functions
    fetchMonetizationOverview,
    fetchMonetizationCreators,
    performCreatorAction,
    fetchMonetizationWithdrawals,
    performWithdrawalAction,
    fetchMonetizationAnalytics,
       // New admin dashboard functions
    fetchDashboardOverview,
    searchUsers,
  }
}

export default useWalletAPIx

