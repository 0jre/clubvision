import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "User ID is required" })
  }

  if (req.method === "GET") {
    try {
      const { db } = await dbConnect()

      const user = await db.collection("items").findOne({ id })
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      const userInfo = await db.collection("users").findOne({ id })
      const reformInfo = await db.collection("reforms").findOne({ userId: id })

      res.status(200).json({
        user: {
          id: user.id,
          name: userInfo?.name || "Unknown",
          username: userInfo?.discriminator || "unknown",
          avatar: userInfo?.avatar,
          verified: userInfo?.verified || false,
          isPrime: reformInfo?.prime || false,
          balances: {
            coins: user.coins || 0,
            bits: user.bits || 0,
            banking: user.banking || 0,
            bitsOnStaking: user.bitsOnStaking || 0,
          },
          staking: user.staking || [],
          stakingHistory: user.stakingHistory || [],
          contracts: {
            contractax: reformInfo?.contractax || false,
            contractunix: reformInfo?.contractunix || false,
            contractvision: reformInfo?.contractvision || false,
          },
        },
      })
    } catch (error) {
      console.error("Error fetching user staking details:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "POST") {
    try {
      const { action, validatorId, amount } = req.body
      const { db } = await dbConnect()

      const user = await db.collection("items").findOne({ id })
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      switch (action) {
        case "force_unlock":
          if (!validatorId) {
            return res.status(400).json({ message: "ValidatorId is required for unlock action" })
          }

          await db.collection("items").updateOne(
            { id, "staking.validatorId": validatorId },
            {
              $set: { "staking.$.lock": false },
              $currentDate: { lastModified: true },
            },
          )

          // Log da ação administrativa
          await db.collection("admin_audit_logs").insertOne({
            action: "force_unlock_staking",
            userId: id,
            targetUserId: id,
            details: { validatorId },
            timestamp: new Date(),
          })

          res.status(200).json({ message: "Staking unlocked successfully" })
          break

        case "adjust_rewards":
          if (typeof amount !== "number") {
            return res.status(400).json({ message: "Amount is required for reward adjustment" })
          }

          await db.collection("items").updateOne(
            { id },
            {
              $inc: { bitsOnStaking: amount },
              $currentDate: { lastModified: true },
            },
          )

          // Log da ação administrativa
          await db.collection("admin_audit_logs").insertOne({
            action: "adjust_staking_rewards",
            userId: id,
            targetUserId: id,
            details: { amount },
            timestamp: new Date(),
          })

          res.status(200).json({ message: "Rewards adjusted successfully" })
          break

        case "force_finalize":
          if (!validatorId) {
            return res.status(400).json({ message: "ValidatorId is required for finalize action" })
          }

          const stakingToFinalize = user.staking?.find((s: any) => s.validatorId === validatorId)
          if (!stakingToFinalize) {
            return res.status(404).json({ message: "Staking not found" })
          }

          const finalAmount = stakingToFinalize.amount * 0.95 // 5% taxa de retirada

          await db.collection("items").updateOne(
            { id },
            {
              $pull: { staking: { validatorId } },
              $inc: { coins: finalAmount },
              $currentDate: { lastModified: true },
            },
          )

          // Log da ação administrativa
          await db.collection("admin_audit_logs").insertOne({
            action: "force_finalize_staking",
            userId: id,
            targetUserId: id,
            details: { validatorId, finalAmount },
            timestamp: new Date(),
          })

          res.status(200).json({ message: "Staking finalized successfully" })
          break

        default:
          res.status(400).json({ message: "Invalid action" })
      }
    } catch (error) {
      console.error("Error performing staking action:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
