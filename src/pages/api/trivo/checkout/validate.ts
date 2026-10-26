import type { NextApiRequest, NextApiResponse } from "next"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import type { NextApiHandler } from "next"
import { getItemsForCaseZX } from "@/types/clubstore/list.opencontainer"

type Item = {
  id: number
  nameitem: string
  priceitem: number
  imagem?: string
  maxQuantity?: number
  available?: boolean
  type?: string // Added type property to match usage
  rarity?: string
}

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

interface ValidateItemsRequest {
  items: Array<{
    id: number
    quantity: number
  }>
}

interface ValidateItemsResponse {
  success: boolean
  message: string
  data?: {
    validItems: Array<{
      id: number
      nameitem: string
      priceitem: number
      imagem?: string
      maxQuantity: number
      available: boolean
      type?: string
      rarity?: string
    }>
    invalidItems: Array<{
      id: number
      reason: "not_found" | "out_of_stock" | "price_changed" | "unavailable"
      details?: string
      currentPrice?: number
      expectedPrice?: number
    }>
    summary: {
      totalRequested: number
      validCount: number
      invalidCount: number
      totalValidValue: number
    }
  }
  error?: string
}

const validateItems: NextApiHandler = async (
  req: NextIronRequestWithSession,
  res: NextApiResponse<ValidateItemsResponse>,
) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: `Método ${req.method} não permitido.`,
    })
  }

  try {
    const sessionUser = req.session?.get("user")
    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      })
    }

    const { items }: ValidateItemsRequest = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Lista de itens inválida ou vazia.",
      })
    }
    console.log("🔍 Validando itens usando getItemsForCaseZX:", items)

    const validItems: any[] = []
    const invalidItems: any[] = []
    let totalValidValue = 0

    // Validar cada item usando a mesma função que o sistema de compra usa
    for (const requestedItem of items) {
      try {
        // Usar a mesma função que a API de compra usa
        const itemData = getItemsForCaseZX(requestedItem.id)

        console.log(
          `🔍 Item ${requestedItem.id}:`,
          itemData ? `encontrado (${itemData.length} variações)` : "não encontrado",
        )

        if (!itemData || itemData.length === 0) {
          invalidItems.push({
            id: requestedItem.id,
            reason: "not_found",
            details: "Item não encontrado no catálogo",
          })
          continue
        }

        // Pegar o primeiro item da lista (ou você pode implementar lógica para escolher)
        const firstItem = itemData[0]

        // Verificar quantidade solicitada (máximo 10 por item como nas outras APIs)
        if (requestedItem.quantity > 10) {
          invalidItems.push({
            id: requestedItem.id,
            reason: "out_of_stock",
            details: `Quantidade solicitada (${requestedItem.quantity}) excede o máximo permitido (10)`,
          })
          continue
        }

        // Item é válido - usar a mesma estrutura que o checkout espera
        const validItem = {
          id: requestedItem.id,
          nameitem: firstItem.nameitem || `Item ${requestedItem.id}`,
          priceitem: firstItem.priceitem || 0,
          imagem: firstItem.imagem,
          maxQuantity: 10, // Limite padrão
          available: true,
          type: "item",
          rarity: firstItem.rarity || "common",
        }

        validItems.push(validItem)
        totalValidValue += validItem.priceitem * requestedItem.quantity

        console.log(`✅ Item ${requestedItem.id} validado: ${validItem.nameitem} - ${validItem.priceitem} Bits`)
      } catch (itemError) {
        console.error(`❌ Erro ao validar item ${requestedItem.id}:`, itemError)
        invalidItems.push({
          id: requestedItem.id,
          reason: "not_found",
          details: "Erro ao processar dados do item",
        })
      }
    }

    console.log(`📊 Validação concluída: ${validItems.length} válidos, ${invalidItems.length} inválidos`)

    return res.status(200).json({
      success: true,
      message: "Validação de itens concluída",
      data: {
        validItems,
        invalidItems,
        summary: {
          totalRequested: items.length,
          validCount: validItems.length,
          invalidCount: invalidItems.length,
          totalValidValue,
        },
      },
    })
  } catch (error) {
    console.error("Erro ao validar itens:", error)
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}

const validateItemsWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await validateItems(req, res)
}

export default withSession(validateItemsWithSession)
