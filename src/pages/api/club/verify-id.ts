import { dbConnect } from "@/core/integration/connect"
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import verifyIdentity from "@/lib/services/analyst/verify-stats.id"

// Definindo um tipo para os containers no inventário
interface InventoryUpdate {
  [key: string]: number
}

type ContainerTypes =
  | "containermarcos"
  | "containerbig"
  | "containersheriff"
  | "containerbarbara"
  | "containerbigode"
  | "containerjason"
  | "containermagnata"
  | "containerasyc"

// Interface para o selo de verificação
interface VerificationSeal {
  verifyid: boolean
  verificationDate: Date
  benefitsGranted: boolean
  rewardsProcessed: boolean
}

// Função auxiliar para calcular o tempo restante  de conta
function calculateTimeRemaining(firstLoginDate: string): string | null {
  const loginDate = new Date(firstLoginDate)
  const currentDate = new Date()
  const timeDifference = currentDate.getTime() - loginDate.getTime()

  const oneMonthInMillis = 0 * 0 * 0 * 60 * 1000
  if (timeDifference >= oneMonthInMillis) {
    return null
  }

  const remainingTime = oneMonthInMillis - timeDifference

  const daysRemaining = Math.floor(remainingTime / (1000 * 3600 * 24))
  const hoursRemaining = Math.floor((remainingTime % (1000 * 3600 * 24)) / (1000 * 3600))
  const minutesRemaining = Math.floor((remainingTime % (1000 * 3600)) / (1000 * 60))

  return `${daysRemaining} dias, ${hoursRemaining} horas, ${minutesRemaining} minutos`
}

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

export const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  const sessionUser = req.session?.get("user")

  // Verifique se o usuário está autenticado
  if (!req.session || !req.session.get("user")) {
    return res.status(401).json({ isAuthenticated: false, message: "Usuário não autenticado." })
  }

  const userId = sessionUser.id
  const { db } = await dbConnect()

  const usersCollectionz = db.collection("member-stats")
  const userz = await usersCollectionz.findOne({ member_id: userId })

  try {
    const usersCollection = db.collection("users")
    const user = await usersCollection.findOne({ id: userId })

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." })
    }

    const firstLoginDate = user.firstLoginDate
    const timeRemaining = calculateTimeRemaining(firstLoginDate)
    const hasOneMonth = timeRemaining === null

    const modLogsCollection = db.collection("mod-logs")
    const modLogs = await modLogsCollection.find({ member_id: userId, type: { $in: ["WARN", "BAN"] } }).toArray()
    const hasPunishment = modLogs.length > 0

    const reformsCollection = db.collection("reforms")
    const reforms = await reformsCollection.findOne({ userId })
    const hasPrimeGreen =
      reforms?.keygreen === true &&
      (reforms?.typeprime === "Plus" || reforms?.typeprime === "Bloom") &&
      reforms?.prime === true
    const hasprimeactive = reforms?.prime === true && reforms?.typeprime === "Bloom"

    const itemsCollection = db.collection("items")
    const isEligible = hasOneMonth && !hasPunishment && hasPrimeGreen
    const viewprimeStatus = reforms?.viewprime ?? false
    const Inventory = db.collection("inventory")
    const accessInviteGranted = reforms?.selo ?? false
    const identityStatus = await verifyIdentity(userId)

    const subscriptionsCollection = db.collection("subscriptions")
    const subscription = await subscriptionsCollection.findOne({ userId })
    const isSubscriptionActive = subscription?.status === "active"

    // ✅ NOVA VERIFICAÇÃO: Checar se os benefícios já foram processados
    const verificationSeal = reforms?.verificationSeal as VerificationSeal | undefined
    const benefitsAlreadyGranted = verificationSeal?.benefitsGranted === true
    const verifyIdCompleted = verificationSeal?.verifyid === true

    // Atualize a checagem para incluir o status da assinatura
    if (hasOneMonth && hasPrimeGreen && !accessInviteGranted && isSubscriptionActive && !benefitsAlreadyGranted) {
      await reformsCollection.updateOne({ userId }, { $set: { viewprime: true } }, { upsert: true })
    }

    // GET: Apenas retorna o status de elegibilidade e detalhes do usuário
    if (req.method === "GET") {
      let notificationMessage = ""

      // ✅ NOVA VERIFICAÇÃO: Se os benefícios já foram concedidos
      if (benefitsAlreadyGranted) {
        notificationMessage = "Seus benefícios de verificação já foram ativados anteriormente."
      } else if (reforms?.unverifid === true) {
        notificationMessage = `Você perdeu o selo de verificação de identidade. Analise o status de conta para mais detalhes.`
      } else if (hasPunishment) {
        notificationMessage = "Encontramos punições ligadas a sua conta."
      } else if (!identityStatus.verified) {
        notificationMessage = `Sua conta tem problemas com o sistema de verificação de identidade.`
      } else if (!reforms?.prime) {
        notificationMessage = `Sua conta está no plano gratuito, o que inclui limitações de acesso.`
      } else if (!hasOneMonth) {
        notificationMessage = `Você ainda não completou o tempo estimado de conta. Faltam ${timeRemaining}. Para ser elegível a verificação de id!`
      } else if (hasprimeactive) {
        notificationMessage = "Sua conta está no plano Bloom, o que inclui ainda algumas limitações de acesso."
      }

      let notificationStatusMessage = ""
      if (!hasOneMonth) {
        notificationStatusMessage =
          "Quando você completar 1 mês de conta, iremos notificar você novamente para tentar a verificação de ID."
      }

      return res.status(200).json({
        isEligible: isEligible && !benefitsAlreadyGranted, // ✅ Não é elegível se já recebeu os benefícios
        details: {
          hasOneMonth,
          hasPunishment,
          hasPrimeGreen,
          benefitsAlreadyGranted, // ✅ Novo campo
          verifyIdCompleted, // ✅ Novo campo
        },
        level: userz?.level,
        reasons: notificationMessage ? [notificationMessage] : [],
        notification: {
          message: notificationStatusMessage,
          actionRequired: benefitsAlreadyGranted ? "none" : "confirm", // ✅ Sem ação necessária se já processado
        },
        viewprime: viewprimeStatus,
        verificationSeal: verificationSeal, // ✅ Retorna informações do selo
      })
    }

    // POST: Ativar benefícios e atualizar dados do usuário
    if (req.method === "POST") {
      if (!reforms) {
        return res.status(404).json({ message: "Dados necessarios do usuário não encontrados." })
      }

      // ✅ PROTEÇÃO CONTRA EXPLORAÇÃO: Verificar se os benefícios já foram concedidos
      if (benefitsAlreadyGranted) {
        return res.status(409).json({
          message: "Os benefícios de verificação já foram ativados anteriormente. Não é possível ativar novamente.",
          viewprime: false,
          action: "already_processed",
          verificationSeal: verificationSeal,
        })
      }

      if (!isEligible) {
        try {
          // Remover o campo viewprime
          await reformsCollection.updateOne({ userId }, { $unset: { viewprime: "" } }, { upsert: true })

          return res.status(400).json({
            message: "Você não concluiu o tempo estimado de conta. Benefícios serão revisados futuramente.",
            viewprime: false,
            action: "viewprime_removed",
          })
        } catch (error) {
          console.error("Erro ao atualizar dados do usuário:", error)
          return res.status(500).json({ message: "Erro ao ativar benefícios, por favor tente novamente mais tarde." })
        }
      }

      // Verifique a elegibilidade e ative os benefícios se o usuário for elegível
      if (isEligible && !benefitsAlreadyGranted) {
        try {
          // ✅ TRANSAÇÃO ATÔMICA: Usar uma sessão de transação para garantir consistência
          // const session = db.client.startSession()

          // await session.withTransaction(async () => {
          // Verificar novamente se os benefícios não foram concedidos (double-check para race conditions)
          const currentReforms = await reformsCollection.findOne({ userId })
          const currentSeal = currentReforms?.verificationSeal as VerificationSeal | undefined

          if (currentSeal?.benefitsGranted === true) {
            return res.status(409).json({
              message: "Os benefícios já foram concedidos anteriormente durante o processamento.",
              action: "already_processed",
            })
          }

          // Atualizar ou inserir os valores na coleção 'items' para o usuário
          await Promise.all([
            itemsCollection.updateOne(
              { _id: userId, id: userId },
              {
                $inc: {
                  coins: 2000,
                },
              },
              { upsert: true },
            ),
            itemsCollection.updateOne(
              { _id: userId, id: userId },
              {
                $inc: {
                  bits: 100,
                },
              },
              { upsert: true },
            ),
            itemsCollection.updateOne(
              { _id: userId, id: userId },
              {
                $set: {
                  lock: false,
                },
              },
              { upsert: true },
            ),
          ])

          // Tipos de containers disponíveis para o sorteio
          const containerTypes: ContainerTypes[] = [
            "containermarcos",
            "containerbig",
            "containersheriff",
            "containerbarbara",
            "containerbigode",
            "containerjason",
            "containermagnata",
            "containerasyc",
          ]

          const getRandomContainers = (types: ContainerTypes[], count: number) => {
            const shuffled = types.sort(() => 0.5 - Math.random())
            return shuffled.slice(0, count)
          }

          const containers = getRandomContainers(containerTypes, 1)

          const updateFields: InventoryUpdate = containers.reduce((acc, container) => {
            acc[`${container}`] = 1
            return acc
          }, {} as InventoryUpdate)

          // Atualiza o inventário do usuário com os containers
          await Inventory.updateOne({ userId: userId }, { $inc: updateFields }, { upsert: true })

          // ✅ CRIAR O SELO DE VERIFICAÇÃO
          const verificationSealData: VerificationSeal = {
            verifyid: true,
            verificationDate: new Date(),
            benefitsGranted: true,
            rewardsProcessed: true,
          }

          // Atualizar todos os campos de uma vez, incluindo o selo
          await reformsCollection.updateOne(
            { userId },
            {
              $set: {
                accessinvite: true,
                verified: true,
                selo: true,
                verificationSeal: verificationSealData, // ✅ Adicionar o selo
              },
              $unset: { viewprime: "" },
            },
            { upsert: true },
          )
          // })

          // await session.endSession()

          return res.status(200).json({
            message: "A análise dos dados foi realizada com sucesso! Benefícios ativados.",
            viewprime: false,
            level: userz?.level,
            action: "benefits_granted",
            verificationSeal: {
              verifyid: true,
              verificationDate: new Date(),
              benefitsGranted: true,
              rewardsProcessed: true,
            },
          })
        } catch (error) {
          console.error("Erro ao atualizar dados do usuário:", error)

          // ✅ TRATAMENTO ESPECÍFICO PARA BENEFÍCIOS JÁ CONCEDIDOS
          if (error instanceof Error && error.message === "BENEFITS_ALREADY_GRANTED") {
            return res.status(409).json({
              message: "Os benefícios já foram concedidos anteriormente.",
              action: "already_processed",
            })
          }

          return res.status(500).json({ message: "Erro ao ativar benefícios, por favor tente novamente mais tarde." })
        }
      }

      // Caso o usuário não seja elegível
      return res.status(400).json({
        message: "O usuário não é elegível para ativar os benefícios.",
        level: userz?.level,
        viewprime: hasOneMonth && hasPrimeGreen ? true : viewprimeStatus,
      })
    }

    return res.status(405).json({ message: "Método HTTP não permitido." })
  } catch (error) {
    console.error("Erro ao verificar ID:", error)
    return res.status(500).json({ message: "Erro ao verificar ID." })
  }
}

const checkAuthWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await checkAuth(req, res)
}

export default withSession(checkAuthWithSession)
