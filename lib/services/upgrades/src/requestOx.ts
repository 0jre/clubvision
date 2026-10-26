import { dbConnect } from "@/core/integration/connect"
import type { Db } from "mongodb"
import { UpgradeValidator } from "@/lib/services/upgrades/elements/validators"
import { UpgradeCalculator } from "@/lib/services/upgrades/elements/calculator"
import { AuditLogger } from "@/lib/services/upgrades/elements/audit"
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

const upgrader_main: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  const sessionUser = req.session?.get("user")

  if (!sessionUser) {
    return res.status(401).json({
      success: false,
      error: "Usuário não autenticado",
      code: "UNAUTHORIZED",
    })
  }

  // Handle both GET (calculate) and POST (execute) methods
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Método não permitido",
      code: "METHOD_NOT_ALLOWED",
    })
  }

  const startTime = Date.now()
  const userId = sessionUser.id
  const validator = UpgradeValidator.getInstance()
  const calculator = UpgradeCalculator.getInstance()
  const auditLogger = AuditLogger.getInstance()

  try {
    // Suporte para ambos os formatos de dados
    let {
      itemsA,
      itemsB,
      position = 0,
      targetItemUid,
      targetItemId,
      selectedItemUids,
      selectedItemIds,
    } = req.method === "GET" ? req.query : req.body

    // Para requisições GET, os arrays vêm como strings JSON
    if (req.method === "GET") {
      if (typeof selectedItemUids === "string") {
        selectedItemUids = JSON.parse(selectedItemUids)
      }
      if (typeof selectedItemIds === "string") {
        selectedItemIds = JSON.parse(selectedItemIds)
      }
      position = Number.parseInt(position as string) || 0
    }

    // Se não tiver itemsA/itemsB, tentar usar o formato do calculate
    if (!itemsA && !itemsB && (targetItemUid || targetItemId) && selectedItemUids) {
      itemsA = {
        uid: targetItemUid,
        id: targetItemId,
        tokenID: targetItemUid,
      }
      itemsB = selectedItemUids.map((uid: string, index: number) => ({
        uid,
        id: selectedItemIds?.[index],
        tokenID: uid,
      }))
    }

    // Validação básica
    if (!itemsA || !itemsB) {
      return res.status(400).json({
        success: false,
        error: "Dados de itens são obrigatórios",
        code: "MISSING_ITEMS",
      })
    }

    // Metadados da requisição
    const metadata = {
      ipAddress: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
      sessionId: sessionUser.id,
    }

    // Validação robusta da requisição
    const validation = await validator.validateUpgradeRequest(userId, { itemsA, itemsB })

    if (!validation.isValid) {
      await auditLogger.logSecurityEvent(userId, "INVALID_REQUEST", {
        errors: validation.errors,
        riskLevel: validation.riskLevel,
      })

      return res.status(400).json({
        success: false,
        error: "Requisição inválida",
        details: validation.errors,
        warnings: validation.warnings,
        code: "VALIDATION_FAILED",
      })
    }

    // Log de warnings se houver
    if (validation.warnings.length > 0) {
      await auditLogger.logSecurityEvent(userId, "VALIDATION_WARNING", {
        warnings: validation.warnings,
      })
    }

    const { db, client } = await dbConnect()

    // Buscar itens usando as funções robustas
    const targetItem = await fetchItem(db, itemsA.tokenID || itemsA.uid, itemsA.id)
    const offeredItems = await fetchMultipleItems(
      db,
      itemsB.map((item: any) => item.tokenID || item.uid),
      itemsB.map((item: any) => item.id),
    )

    if (!targetItem) {
      return res.status(404).json({
        success: false,
        error: "Item alvo não encontrado",
        code: "TARGET_ITEM_NOT_FOUND",
      })
    }

    if (offeredItems.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Itens selecionados não encontrados",
        code: "OFFERED_ITEMS_NOT_FOUND",
      })
    }

    if (offeredItems.length !== itemsB.length) {
      return res.status(404).json({
        success: false,
        error: "Um ou mais itens oferecidos não foram encontrados",
        code: "OFFERED_ITEMS_NOT_FOUND",
      })
    }

    // Verificação de valor mínimo
    const totalOfferedValue = offeredItems.reduce((sum, item) => sum + (item.itemValue || 0), 0)

    if (totalOfferedValue < targetItem.itemValue * 0.3) {
      return res.status(400).json({
        success: false,
        error: "Valor oferecido insuficiente",
        details: {
          offered: totalOfferedValue,
          required: targetItem.itemValue * 0.3,
          target: targetItem.itemValue,
        },
        code: "INSUFFICIENT_VALUE",
      })
    }

    // CÁLCULO USANDO O UPGRADECALCULATOR COM POSIÇÃO
    const calculation = await calculator.calculateUpgradeProbability(userId, targetItem, offeredItems, position)

    // Função determinística para gerar um número baseado nos valores e posição
    function robustDeterministicNumber(oferecido: number, desejado: number, posicao: number): number {
      const str = `${oferecido}:${desejado}:${posicao}`
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) % 93 // 0-92
      }
      return hash
    }

    // Usar a probabilidade final do calculator (que já inclui o fator de posição)
    const chosenNumber = robustDeterministicNumber(
      calculation.valueRatio * calculation.finalProbability,
      calculation.finalProbability,
      position,
    )

    const upgradeSuccess = chosenNumber <= calculation.finalProbability

    // Obter estratégia de posição
    const positionStrategy = calculator.getPositionStrategy(position, calculation.valueRatio)

    // Se for apenas um cálculo (GET), retornar os resultados
    if (req.method === "GET") {
      return res.status(200).json({
        success: true,
        calculation: {
          ...calculation,
          upgradeSuccess,
          positionStrategy, // Incluir dica estratégica
        },
      })
    }

    // Se for POST, executar o upgrade
    const session = client.startSession()
    let transactionResult

    try {
      await session.withTransaction(async () => {
        if (upgradeSuccess) {
          // Upgrade bem-sucedido
          await executeSuccessfulUpgrade(db, session, userId, targetItem, offeredItems, itemsA)
        } else {
          // Upgrade falhou - remover itens oferecidos e colocar no mercado
          await executeFailedUpgrade(db, session, userId, offeredItems, itemsB)

          // DEBUG: Verificar se os itens foram processados corretamente
          await debugFailedUpgradeItems(db, offeredItems, userId)
        }

        // Registrar transação
        await db.collection("upgrades").insertOne(
          {
            userId,
            targetItem: {
              id: targetItem.id,
              uid: itemsA.uid || itemsA.tokenID,
              value: targetItem.itemValue,
            },
            offeredItems: offeredItems.map((item: any) => ({
              id: item.id,
              uid: item.tokenID,
              value: item.itemValue,
            })),
            totalOfferedValue,
            position, // Registrar a posição escolhida
            success: upgradeSuccess,
            probability: calculation.finalProbability,
            positionFactor: calculation.positionFactor,
            positionStrategy, // Salvar a estratégia usada
            calculation: calculation, // Salvar todos os dados do cálculo
            timestamp: new Date(),
            metadata,
            processingTime: Date.now() - startTime,
          },
          { session },
        )

        // Atualizar estatísticas do usuário
        await updateUserStats(db, session, userId, upgradeSuccess, totalOfferedValue)
      })

      transactionResult = {
        success: upgradeSuccess,
        probability: calculation.finalProbability,
        positionFactor: calculation.positionFactor,
        actualOutcome: upgradeSuccess ? "SUCCESS" : "FAILURE",
      }
    } catch (error: any) {
      console.error("Erro na transação de upgrade:", error)
      transactionResult = {
        success: false,
        error: error.message,
      }

      return res.status(500).json({
        success: false,
        error: "Erro ao processar upgrade",
        code: "TRANSACTION_FAILED",
      })
    } finally {
      await session.endSession()
    }

    // Log de auditoria
    await auditLogger.logUpgradeAttempt(
      userId,
      {
        itemsA,
        itemsB,
        position,
        totalOfferedValue,
      },
      transactionResult,
      metadata,
    )

    // Resposta de sucesso
    const response = {
      success: true,
      upgradeSuccess,
      probability: calculation.finalProbability,
      positionFactor: calculation.positionFactor,
      positionStrategy,
      calculation,
      result: upgradeSuccess
        ? {
            receivedItem: {
              id: targetItem.id,
              uid: itemsA.uid || itemsA.tokenID,
              value: targetItem.itemValue,
              name: targetItem.name || `Item #${targetItem.id}`,
            },
          }
        : {
            message: "Upgrade não foi bem-sucedido. Itens oferecidos foram perdidos.",
          },
      processingTime: Date.now() - startTime,
    }

    return res.status(200).json(response)
  } catch (error: any) {
    console.error("Erro crítico no sistema de upgrade:", error)

    // Log de erro crítico
    await auditLogger.logSecurityEvent(userId, "SYSTEM_ERROR", {
      error: error.message,
      stack: error.stack,
    })

    return res.status(500).json({
      success: false,
      error: "Erro interno do sistema",
      code: "INTERNAL_ERROR",
    })
  }

  // --- Funções auxiliares ---

  async function executeSuccessfulUpgrade(
    db: any,
    session: any,
    userId: string,
    targetItem: any,
    offeredItems: any[],
    itemsA: any,
  ) {
   const previousOwnerId = String(targetItem.userId).replace(/^advertised-/, "")


    // PASSO 1: Atualizar o item recebido - LIMPAR TODAS as propriedades de mercado
    await db.collection("tvl-novision").updateOne(
      { tokenID: itemsA.uid || itemsA.tokenID },
      {
        $set: { userId },
        $unset: {
          // REMOVER TODAS as propriedades de mercado
          advertised: "",
          advertisedPrice: "",
          sold: "",
          traded: "",
          tradeId: "",
          adExpiration: "",
        },
        $push: { previousOwners: previousOwnerId },
      },
      { session },
    )

    // PASSO 2: Remover item do inventário do dono anterior
    let realPreviousOwnerId = previousOwnerId
    if (String(previousOwnerId).startsWith("advertised-")) {
      realPreviousOwnerId = String(previousOwnerId).replace("advertised-", "")
    }

    if (realPreviousOwnerId && realPreviousOwnerId !== userId) {
      await db
        .collection("inventory")
        .updateOne(
          { userId: realPreviousOwnerId },
          { $pull: { mytvls: { uid: itemsA.uid || itemsA.tokenID } } },
          { session },
        )
    }

    // PASSO 3: Processar itens oferecidos - colocar no mercado
    for (const item of offeredItems) {
      // Adicionar ao histórico de donos
      await db
        .collection("tvl-novision")
        .updateOne({ tokenID: item.tokenID }, { $push: { previousOwners: userId } }, { session })

      // Colocar no mercado
      await db.collection("tvl-novision").updateOne(
        { tokenID: item.tokenID },
        {
          $set: {
            userId: `advertised-${userId}`,
            sold: true,
            advertised: true,
            traded: false,
            tradeId: new Date().getTime().toString(),
          },
        },
        { session },
      )
    }

    // PASSO 4: Atualizar inventário do usuário
    await Promise.all([
      // Adicionar item recebido
      db
        .collection("inventory")
        .updateOne(
          { userId },
          { $push: { mytvls: { id: targetItem.id, uid: itemsA.uid || itemsA.tokenID } } },
          { session },
        ),
    
    ])
  }

  async function executeFailedUpgrade(db: any, session: any, userId: string, offeredItems: any[], itemsB: any[]) {
    console.log("🔥 UPGRADE FALHOU - Removendo itens do usuário")
    console.log(
      "📋 Itens a processar:",
      offeredItems.map((item) => ({ id: item.id, tokenID: item.tokenID })),
    )

    // PASSO 1: Processar cada item oferecido - colocar no mercado
    for (const item of offeredItems) {
      console.log(`🔄 Processando item perdido: ${item.tokenID} (ID: ${item.id})`)

      try {
        // Verificar se o item existe antes de atualizar
        const existingItem = await db.collection("tvl-novision").findOne({ tokenID: item.tokenID })
        console.log(
          `📦 Item encontrado:`,
          existingItem ? `${existingItem.nameitem} (Owner: ${existingItem.userId})` : "NÃO ENCONTRADO",
        )

        if (!existingItem) {
          console.error(`❌ Item ${item.tokenID} não encontrado na coleção tvl-novision`)
          continue
        }

        // Adicionar ao histórico de donos
        const historyResult = await db
          .collection("tvl-novision")
          .updateOne({ tokenID: item.tokenID }, { $push: { previousOwners: userId } }, { session })

        console.log(`📝 Histórico atualizado:`, historyResult.modifiedCount > 0 ? "✅ Sucesso" : "❌ Falhou")

        // Colocar no mercado como item perdido
        const tradeId = `failed-${new Date().getTime()}`
        const marketResult = await db.collection("tvl-novision").updateOne(
          { tokenID: item.tokenID },
          {
            $set: {
              userId: `advertised-${userId}`, // Marca como anunciado pelo usuário que perdeu
              sold: true,
              advertised: true,
              traded: false,  
              tradeId: tradeId,
            },
          },
          { session },
        )

        console.log(`🏪 Item colocado no mercado:`, marketResult.modifiedCount > 0 ? "✅ Sucesso" : "❌ Falhou")
        console.log(
          `🏷️ Novo estado: userId=advertised-${userId}, sold=true, advertised=true, traded=true, tradeId=${tradeId}`,
        )

        // Verificar se a atualização foi aplicada
        const updatedItem = await db.collection("tvl-novision").findOne({ tokenID: item.tokenID })
        console.log(`🔍 Verificação pós-update:`, {
          userId: updatedItem?.userId,
          sold: updatedItem?.sold,
          advertised: updatedItem?.advertised,
          traded: updatedItem?.traded,
          tradeId: updatedItem?.tradeId,
        })
      } catch (error) {
        console.error(`❌ Erro ao processar item ${item.tokenID}:`, error)
      }
    }

    // // PASSO 2: Remover TODOS os itens oferecidos do inventário do usuário
    // try {
    //   const inventoryResult = await db
    //     .collection("inventory")
    //     .updateOne(
    //       { userId },
    //       { $pull: { mytvls: { uid: { $in: offeredItems.map((item: any) => item.tokenID) } } } },
    //       { session },
    //     )

    //   console.log(`🎒 Inventário atualizado:`, inventoryResult.modifiedCount > 0 ? "✅ Sucesso" : "❌ Falhou")
    //   console.log(`📊 Itens removidos do inventário: ${offeredItems.length}`)

    //   // Verificar inventário após remoção
    //   const userInventory = await db.collection("inventory").findOne({ userId })
    //   const remainingItems =
    //     userInventory?.mytvls?.filter((invItem: any) =>
    //       offeredItems.some((offeredItem) => offeredItem.tokenID === invItem.uid),
    //     ) || []

    //   if (remainingItems.length > 0) {
    //     console.warn(
    //       `⚠️ Ainda restam ${remainingItems.length} itens no inventário que deveriam ter sido removidos:`,
    //       remainingItems,
    //     )
    //   } else {
    //     console.log(`✅ Todos os itens foram removidos do inventário com sucesso`)
    //   }
    // } catch (error) {
    //   console.error(`❌ Erro ao atualizar inventário:`, error)
    // }
 
  }

  async function updateUserStats(db: any, session: any, userId: string, success: boolean, value: number) {
    const update: any = {
      $inc: {
        totalUpgrades: 1,
        totalValueTraded: value,
      },
      $set: {
        lastUpgrade: new Date(),
      },
    }
    if (success) {
      update.$inc.successfulUpgrades = 1
    }

    await db.collection("user_stats").updateOne({ userId }, update, { upsert: true, session })
  }
}

// Funções auxiliares para busca de itens (copiadas do endpoint calculate)
async function fetchItem(db: Db, uid?: string, id?: string | number) {
  const numericId = id && !isNaN(+id) ? Number(id) : undefined
  const numericUid = uid && !isNaN(+uid) ? Number(uid) : undefined

  const query = {
    $or: [
      ...(uid ? [{ tokenID: uid }, { uid }, { tokenID: uid.toString() }, { uid: uid.toString() }] : []),
      ...(numericId !== undefined ? [{ id: numericId }] : []),
      ...(numericUid !== undefined ? [{ id: numericUid }] : []),
    ],
  }

  return await db.collection("tvl-novision").findOne(query)
}

async function fetchMultipleItems(db: Db, uids: string[], ids?: (string | number)[]) {
  const parsedUids = uids.map(String)
  const numericIds = ids?.map((id) => Number(id)).filter( (id) => !isNaN(id)) || []

 const query = {
  $or: [
    { tokenID: { $in: parsedUids } },
    { uid: { $in: parsedUids } }
  ],
}

  return await db.collection("tvl-novision").find(query).toArray()
}

// Função de debug para verificar estado dos itens após upgrade falhou
async function debugFailedUpgradeItems(db: any, offeredItems: any[], userId: string) {
  console.log("🔍 DEBUG: Verificando estado dos itens após upgrade falhou")

  for (const item of offeredItems) {
    const dbItem = await db.collection("tvl-novision").findOne({ tokenID: item.tokenID })

    if (dbItem) {
      console.log(`📦 Item ${item.tokenID}:`, {
        nameitem: dbItem.nameitem,
        currentUserId: dbItem.userId,
        expectedUserId: `advertised-${userId}`,
        sold: dbItem.sold,
        advertised: dbItem.advertised,
        traded: dbItem.traded,
        tradeId: dbItem.tradeId,
        previousOwners: dbItem.previousOwners?.slice(-3), // últimos 3 donos
      })

      // Verificar se está correto
      const isCorrect =
        dbItem.userId === `${userId}` &&
        dbItem.sold === true &&
        dbItem.advertised === false &&
        dbItem.traded === true  

      console.log(`${isCorrect ? "✅" : "❌"} Item ${item.tokenID} está ${isCorrect ? "correto" : "incorreto"}`)
    } else {
      console.error(`❌ Item ${item.tokenID} não encontrado no banco`)
    }
  }

  // Verificar inventário
  const userInventory = await db.collection("inventory").findOne({ userId })
  const stillInInventory =
    userInventory?.mytvls?.filter((invItem: any) =>
      offeredItems.some((offeredItem) => offeredItem.tokenID === invItem.uid),
    ) || []

  console.log(`🎒 Itens ainda no inventário: ${stillInInventory.length}`)
  if (stillInInventory.length > 0) {
    console.log("📋 Itens que ainda estão no inventário:", stillInInventory)
  }
}

const UpgraderMain: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await upgrader_main(req, res)
}

export default withSession(UpgraderMain)
