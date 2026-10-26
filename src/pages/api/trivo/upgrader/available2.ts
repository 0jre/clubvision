import { dbConnect } from "@/core/integration/connect";
import type { NextApiResponse } from "next";
import { withSession, type NextIronRequest } from "@/lib/session";

export default withSession(async (req: NextIronRequest, res: NextApiResponse) => {
  const sessionUser = req.session?.get("user");

  if (!sessionUser) {
    return res.status(401).json({ isAuthenticated: false, message: "Usuário não autenticado." });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { db } = await dbConnect();
    const userId = sessionUser.id;

    // Buscar inventário do usuário
    const inventory = await db.collection("inventory").findOne({ userId });
    if (!inventory || !Array.isArray(inventory.mytvls)) {
      return res.status(404).json({ success: false, message: "Inventário não encontrado." });
    }

    // Buscar todos os itens do usuário no tvl-novision pelo uid e userId
    const userUids = inventory.mytvls.map((item: any) => item.uid);
    const userItems = await db.collection("tvl-novision").find({
      tokenID: { $in: userUids },
      userId: userId
    }).toArray();

   
const availableItems = userItems.filter(
  item =>
    (item.advertised !== true && item.sold == true && item.traded == true)
);
    // Enriquecer com detalhes extras se quiser (exemplo: imagem, nome, etc)
    const enrichedItems = await Promise.all(
      availableItems.map(async (item) => {
        const itemDetails = await db.collection("items-details").findOne({ id: item.id });
        return {
          ...item,
          image: itemDetails?.image || "/placeholder.svg",
          name: itemDetails?.nameitem || `Item #${item.id}`,
          rarity: itemDetails?.rarity || "comum",
        };
      })
    );

    return res.status(200).json({
      success: true,
      items: enrichedItems,
    });
  } catch (error) {
    console.error("Erro ao buscar itens disponíveis do usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});