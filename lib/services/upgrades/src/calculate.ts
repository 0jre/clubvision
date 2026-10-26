import { dbConnect } from "@/core/integration/connect"
import type { Db } from "mongodb"
import { UpgradeCalculator } from "@/lib/services/upgrades/elements/calculator"
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const upgrader_Calculate: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método não permitido" })
  }

  const user = req.session?.get("user")
  if (!user) {
    return res.status(401).json({ success: false, isAuthenticated: false, message: "Usuário não autenticado." })
  }

  try {
    const {
      targetItemUid,
      targetItemId,
      selectedItemUids = [],
      selectedItemIds = []
    }: {
      targetItemUid?: string
      targetItemId?: string | number
      selectedItemUids: string[]
      selectedItemIds?: (string | number)[]
    } = req.body

    if (!targetItemUid && !targetItemId) {
      return res.status(400).json({ success: false, error: "ID ou UID do item alvo é obrigatório." })
    }

    if (!Array.isArray(selectedItemUids) || selectedItemUids.length === 0) {
      return res.status(400).json({ success: false, error: "Lista de itens selecionados é obrigatória." })
    }

    const { db } = await dbConnect()

    // Chama o UpgradeCalculator para calcular a probabilidade
    const calculator = UpgradeCalculator.getInstance()

    function robustDeterministicNumber(oferecido: number, desejado: number): number {
      const str = `${oferecido}:${desejado}`
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) % 93 // 0-92
      }
      return hash
    }

    const targetItem = await fetchItem(db, targetItemUid, targetItemId)
    const selectedItems = await fetchMultipleItems(db, selectedItemUids, selectedItemIds)

    if (!targetItem) {
      return res.status(404).json({ success: false, error: "Item alvo não encontrado." })
    }

    if (selectedItems.length === 0) {
      return res.status(404).json({ success: false, error: "Itens selecionados não encontrados." })
    }

    // Cálculo REALISTA: tudo pelo calculator.ts
    const calculation = await calculator.calculateUpgradeProbability(user.userId, targetItem, selectedItems)

    // Use os valores calculados para o número determinístico
    const chosenNumber = robustDeterministicNumber(
      calculation.valueRatio * calculation.finalProbability, // ou calculation.valueRatio * calculation.baseSuccessRate
      calculation.finalProbability
    )
    const upgradeSuccess = chosenNumber <= calculation.finalProbability

    return res.status(200).json({ success: upgradeSuccess, upgradeSuccess, calculation })
  } catch (error: any) {
    console.error("Erro ao calcular upgrade:", error)
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// ...fetchItem e fetchMultipleItems permanecem iguais...
async function fetchItem(db: Db, uid?: string, id?: string | number) {
  const numericId = id && !isNaN(+id) ? Number(id) : undefined
  const numericUid = uid && !isNaN(+uid) ? Number(uid) : undefined

  const query = {
    $or: [
      ...(uid ? [{ tokenID: uid }, { uid }, { tokenID: uid.toString() }, { uid: uid.toString() }] : []),
      ...(numericId !== undefined ? [{ id: numericId }] : []),
      ...(numericUid !== undefined ? [{ id: numericUid }] : []),
    ]
  }

  return await db.collection("tvl-novision").findOne(query)
}

async function fetchMultipleItems(db: Db, uids: string[], ids?: (string | number)[]) {
  const parsedUids = uids.map(String)
  const numericIds = ids?.map((id) => Number(id)).filter((id) => !isNaN(id)) || []

  const query = {
    $or: [
      { tokenID: { $in: parsedUids } },
      { uid: { $in: parsedUids } },
      { id: { $in: numericIds } },
    ]
  }

  return await db.collection("tvl-novision").find(query).toArray()
}

const UpgraderCalculate: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
   await upgrader_Calculate(req, res);
};
 
export default withSession(UpgraderCalculate);