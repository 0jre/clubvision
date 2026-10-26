"use client"

import { useState } from "react"

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

export function useAdminApi<T>({ endpoint, method = "GET", body, query }: ApiOptions): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Construir a URL com os parâmetros de consulta
      let url = `/api/admin/${endpoint}`
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
  useState(() => {
    fetchData()
  })

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  }
}

// Hooks específicos para cada funcionalidade
export function useContentList(filters: Record<string, any> = {}) {
  return useAdminApi({
    endpoint: "content/list",
    query: filters,
  })
}

export function useContentDetails(id: string, type: string) {
  return useAdminApi({
    endpoint: `content/${id}`,
    query: { type },
  })
}

export function useCommentsList(filters: Record<string, any> = {}) {
  return useAdminApi({
    endpoint: "comments/list",
    query: filters,
  })
}

export function useDashboardStats(timeframe = "7d") {
  return useAdminApi({
    endpoint: "dashboard/stats",
    query: { timeframe },
  })
}

export function useAuditLogs(filters: Record<string, any> = {}) {
  return useAdminApi({
    endpoint: "audit-logs",
    query: filters,
  })
}

// Funções para ações específicas
export async function updateContentStatus(id: string, status: string, moderationNotes?: string) {
  try {
    const response = await fetch(`/api/admin/content/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, moderationNotes }),
    })

    if (!response.ok) {
      const errorData = await response.json() as any
      throw new Error(errorData.message || "Erro ao atualizar status do conteúdo")
    }

    return await response.json()
  } catch (err) {
    throw err
  }
}

export async function deleteContent(id: string, type: string) {
  try {
    const response = await fetch(`/api/admin/content/${id}?type=${type}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json() as any
      throw new Error(errorData.message || "Erro ao excluir conteúdo")
    }

    return await response.json()
  } catch (err) {
    throw err
  }
}

export async function moderateComment(contentId: string, commentId: string, action: "delete" | "update", data?: any) {
  try {
    const method = action === "delete" ? "DELETE" : "PUT"
    const url = `/api/admin/comments/${contentId}?commentId=${commentId}`

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      const errorData = await response.json() as any
      throw new Error(errorData.message || "Erro ao moderar comentário")
    }

    return await response.json()
  } catch (err) {
    throw err
  }
}

export async function analyzeContent(
  contentId: string,
  contentType: string,
  text: string,
  isComment = false,
  commentId?: string,
) {
  try {
    const response = await fetch("/api/admin/content/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contentId, contentType, text, isComment, commentId }),
    })

    if (!response.ok) {
      const errorData = await response.json() as any
      throw new Error(errorData.message || "Erro ao analisar conteúdo")
    }

    return await response.json()
  } catch (err) {
    throw err
  }
}
