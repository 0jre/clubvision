import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect, InformationsUsers } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "GET") {
    try {
      const { db } = await dbConnect()
      const collection = db.collection(InformationsUsers)

      // Retorna apenas o authorizationCode (removemos IsafeSecurity pois agora vem do settings)
      const userInfo = await collection.findOne({ id: id }, { projection: { _id: 0, authorizationCode: 1 } })

      if (userInfo) {
        res.status(200).json(userInfo)
      } else {
        res.status(404).json({ error: "User not found" })
      }
    } catch (error) {
      console.error("Error fetching user information:", error)
      res.status(500).json({ error: "Internal Server Error" })
    }
  } else if (req.method === "POST") {
    const { authorizationCode } = req.body

    if (!authorizationCode) {
      return res.status(400).json({ error: "Invalid authorizationCode parameter" })
    }

    try {
      const { db } = await dbConnect()
      const collection = db.collection(InformationsUsers)

      // Atualiza apenas o authorizationCode (removemos IsafeSecurity)
      const result = await collection.updateOne({ id: id }, { $set: { authorizationCode } })

      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Authorization code updated successfully" })
      } else {
        res.status(404).json({ error: "User not found" })
      }
    } catch (error) {
      console.error("Error updating authorization code:", error)
      res.status(500).json({ error: "Internal Server Error" })
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" })
  }
}
