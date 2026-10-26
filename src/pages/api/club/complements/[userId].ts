import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

interface UserReforms {
  userId: string
  keymaster?: boolean
  alladin?: boolean
  contractmiss?: boolean
  visiondrop?: boolean
  contractcla?: boolean
  keyplusinvite?: boolean
  usedLimitInvite?: number
  maxlimitinvite?: number
  contractunix?: boolean
  limitipost?: number
  contractax?: boolean
  contractvision?: boolean
  socioclub?: boolean
}

interface UserInventory {
  userId: string
  [key: string]: any
}

interface Complement {
  id: string
  name: string
  description: string
  isActive: boolean
  quantity?: number
  type: string
}

const getComplementName = (type: string): string => {
  const names: { [key: string]: string } = {
    keymaster: "Key Master",
    contractmiss: "Contrato Missão",
    visiondrop: "Vision Drop",
    contractcla: "Contrato Clã",
    keyplusinvite: "Key Plus Invite",
    contractunix: "Contrato Unix",
    contractax: "Contrato AX",
    contractvision: "Contrato Vision",
    limitinvite: "Limite de Convites",
    limitipost: "Limite de Posts",
    maxlimitinvite: "Máximo de Convites",
  }
  return names[type] || type
}

const getComplementDescription = (type: string): string => {
  const descriptions: { [key: string]: string } = {
    keymaster: "Acesso master a recursos exclusivos do sistema",
    contractmiss: "Contrato especial que libera missões exclusivas",
    visiondrop: "Sistema de drops exclusivos e recompensas especiais",
    contractcla: "Gerenciamento avançado de clã com recursos premium",
    keyplusinvite: "Sistema de convites premium com benefícios exclusivos",
    contractunix: "Acesso completo ao sistema Unix avançado",
    contractax: "Contrato de aceleração para processos do sistema",
    contractvision: "Visão completa e acesso total aos recursos Vision",
    limitinvite: "Limite expandido de convites para sua rede",
    limitipost: "Posts adicionais disponíveis em sua conta",
    maxlimitinvite: "Limite máximo de convites expandido significativamente",
  }
  return descriptions[type] || "Complemento ativo em sua conta"
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Método não permitido" })
  }

  const { userId } = req.query

  if (typeof userId !== "string" || userId.trim() === "") {
    return res.status(400).json({ success: false, message: "ID do usuário inválido" })
  }

  try {
    const { db } = await dbConnect()

    // Buscar dados do usuário nas coleções reforms e inventory
    const userReforms = await db.collection("reforms").findOne<UserReforms>({ userId })
    const userInventory = await db.collection("inventory").findOne<UserInventory>({ userId })

    const complements: Complement[] = []

    // Processar complementos da coleção reforms
    if (userReforms) {
      const reformsFields = [
        "keymaster",
        "contractmiss",
        "visiondrop",
        "contractcla",
        "keyplusinvite",
        "contractunix",
        "contractax",
        "contractvision",
      ]

      reformsFields.forEach((field) => {
        if (userReforms[field as keyof UserReforms] === true) {
          complements.push({
            id: field,
            name: getComplementName(field),
            description: getComplementDescription(field),
            isActive: true,
            type: field,
          })
        }
      })

      // Processar campos numéricos especiais
      if (userReforms.limitipost && userReforms.limitipost > 0) {
        complements.push({
          id: "limitipost",
          name: getComplementName("limitipost"),
          description: getComplementDescription("limitipost"),
          isActive: true,
          quantity: userReforms.limitipost,
          type: "limitipost",
        })
      }

      if (userReforms.maxlimitinvite && userReforms.maxlimitinvite > 0) {
        complements.push({
          id: "maxlimitinvite",
          name: getComplementName("maxlimitinvite"),
          description: getComplementDescription("maxlimitinvite"),
          isActive: true,
          quantity: userReforms.maxlimitinvite,
          type: "maxlimitinvite",
        })
      }

      if (userReforms.usedLimitInvite !== undefined) {
        const remainingInvites = (userReforms.maxlimitinvite || 0) - userReforms.usedLimitInvite
        if (remainingInvites > 0) {
          complements.push({
            id: "limitinvite",
            name: getComplementName("limitinvite"),
            description: `${remainingInvites} convites restantes`,
            isActive: true,
            quantity: remainingInvites,
            type: "limitinvite",
          })
        }
      }
    }

    // Processar complementos da coleção inventory
    if (userInventory) {
      Object.keys(userInventory).forEach((key) => {
        if (key !== "userId" && key !== "_id" && userInventory[key] > 0) {
          // Evitar duplicatas
          const existingComplement = complements.find((c) => c.id === key)
          if (!existingComplement) {
            complements.push({
              id: key,
              name: getComplementName(key),
              description: getComplementDescription(key),
              isActive: true,
              quantity: userInventory[key],
              type: key,
            })
          }
        }
      })
    }

    // Ordenar complementos por nome
    complements.sort((a, b) => a.name.localeCompare(b.name))

    return res.status(200).json({
      success: true,
      complements,
      total: complements.length,
    })
  } catch (error) {
    console.error("Erro ao buscar complementos do usuário:", error)
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    })
  }
}
