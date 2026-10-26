import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

interface RentalItem {
  id: string
  uid?: string
  itemId?: string
  acquiredAt: Date
  expiresAt: Date
  isActive: boolean
  used: boolean
  rented?: boolean
  paymentStatus?: string
}

interface GetRentalsResponse {
  success: boolean
  data?: {
    activeRentals: RentalItem[]
    expiredRentals: RentalItem[]
    totalActive: number
    totalExpired: number
  }
  message?: string
}

const getRentals = async (req: NextIronRequestWithSession, res: NextApiResponse<GetRentalsResponse>) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Método não permitido",
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

    const { db } = await dbConnect()
    const inventory = await db.collection("inventory").findOne({ userId: sessionUser.id })
 
    if (!inventory) {
      return res.status(200).json({
        success: true,
        data: {
          activeRentals: [],
          expiredRentals: [],
          totalActive: 0,
          totalExpired: 0,
        },
      })
    }

    const now = new Date()
    const allRentals: RentalItem[] = [
      ...(inventory.rentedItems || []),
      ...(inventory.mytvls || []).filter((item: any) => item.rented),
    ]

    const activeRentals = allRentals.filter((item) => item.isActive && new Date(item.expiresAt) > now)

    const expiredRentals = allRentals.filter((item) => !item.isActive || new Date(item.expiresAt) <= now)

    return res.status(200).json({
      success: true,
      data: {
        activeRentals,
        expiredRentals,
        totalActive: activeRentals.length,
        totalExpired: expiredRentals.length,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar aluguéis:", error)
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    })
  }
}

const getRentalsWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await getRentals(req, res)
}

export default withSession(getRentalsWithSession)
