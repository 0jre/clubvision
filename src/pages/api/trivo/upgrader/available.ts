import { dbConnect } from "@/core/integration/connect"
import type { NextApiResponse } from "next"
import { withSession, type NextIronRequest } from "@/lib/session"

export default withSession(async (req: NextIronRequest, res: NextApiResponse) => {
  const sessionUser = req.session?.get("user")

  if (!sessionUser) {
    return res.status(401).json({ isAuthenticated: false, message: "Usuário não autenticado." })
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" })
  }

  try {
    const { db } = await dbConnect()

    // Buscar itens disponíveis para upgrade (com advertised: true)
    const availableItems = await db
      .collection("tvl-novision")
      .find({ advertised: true, sold: true })
      .sort({ itemValue: -1 }) // Ordenar por valor, do maior para o menor
      .toArray()

    // Enriquecer os dados dos itens com informações adicionais
    const enrichedItems = await Promise.all(
      availableItems.map(async (item) => {
        // Buscar dados adicionais do item (como imagem, nome, etc.)
        const itemDetails = await db.collection("items-details").findOne({ id: item.id })

        return {
          ...item,
          image: itemDetails?.image || "/placeholder.svg",
          name: itemDetails?.nameitem || `Item #${item.id}`,
          rarity: itemDetails?.rarity || "comum",
        }
      }),
    )

    return res.status(200).json({
      success: true,
      items: enrichedItems,
    })
  } catch (error) {
    console.error("Erro ao buscar itens disponíveis para upgrade:", error)
    return res.status(500).json({ error: "Erro interno do servidor." })
  }
})
