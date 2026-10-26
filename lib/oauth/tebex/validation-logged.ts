"use client"

import { useState, useEffect, useRef } from "react"

export type LoadingState = "loading" | "no-basket" | "no-user" | "logged-in" | "error"

export type Basket = {
  username?: string | null
  // Adicione outras propriedades do basket conforme necessário
}

type ValidationOptions = {
  onStateChange?: (prevState: LoadingState, newState: LoadingState) => void
  debug?: boolean
  // Tempo máximo de espera em ms (padrão: 5 segundos)
  timeoutDuration?: number
}

export function useValidationState(
  basket: Basket | null | undefined,
  authLink: string | undefined,
  options?: ValidationOptions,
): LoadingState {
  const [status, setStatus] = useState<LoadingState>("loading")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Tempo máximo de espera (padrão: 5 segundos)
  const timeoutDuration = options?.timeoutDuration || 5000

  useEffect(() => {
    // Limpa qualquer timeout existente quando o efeito é executado novamente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Se basket ainda é undefined, estamos aguardando a resposta
    if (basket === undefined) {
      if (options?.debug) {
        console.log("Aguardando resposta do servidor...")
      }
      
      // Configura um timeout para mudar para "no-basket" se não receber resposta
      timeoutRef.current = setTimeout(() => {
        if (options?.debug) {
          console.log(`Timeout atingido após ${timeoutDuration}ms. Mudando para "no-basket"`)
        }
        setStatus("no-basket")
        options?.onStateChange?.(status, "no-basket")
      }, timeoutDuration)
      
      return () => {
        // Limpa o timeout se o componente for desmontado ou o efeito for executado novamente
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }

    // Se chegamos aqui, recebemos uma resposta (mesmo que seja null)
    // Limpa o timeout, pois já temos uma resposta
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    try {
      let newState: LoadingState

      // Determina o estado com base na resposta
      if (basket === null) {
        newState = "no-basket"
      } else if (!basket.username) {
        newState = "no-user"
      } else {
        newState = "logged-in"
      }

      // Só atualiza se o estado for diferente
      if (status !== newState) {
        if (options?.debug) {
          console.log(`Transição de estado: ${status} -> ${newState}`, { basket, authLink })
        }

        setStatus(newState)
        options?.onStateChange?.(status, newState)
      }
    } catch (error) {
      console.error("Erro na validação:", error)
      if (status !== "error") {
        setStatus("error")
        options?.onStateChange?.(status, "error")
      }
    }
  }, [basket, authLink, status, timeoutDuration, options])

  // Limpa o timeout quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return status
}
