import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"
import validators from "@/lib/services/staking/validator/validators"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { db } = await dbConnect()

      // Buscar validadores do banco de dados
      const dbValidators = await db.collection("validators").find().toArray()

      // Combinar validadores estáticos com os do banco
      const allValidators = [...validators, ...dbValidators]

      // Estatísticas por validador
      const validatorStats = await db
        .collection("items")
        .aggregate([
          { $unwind: "$staking" },
          {
            $group: {
              _id: "$staking.validatorId",
              totalDelegated: { $sum: "$staking.amount" },
              totalInitialDelegated: { $sum: "$staking.initialamount" },
              totalStakers: { $sum: 1 },
              activeStaking: {
                $sum: {
                  $cond: [{ $eq: ["$staking.lock", true] }, 1, 0],
                },
              },
              inactiveStaking: {
                $sum: {
                  $cond: [{ $eq: ["$staking.lock", false] }, 1, 0],
                },
              },
              avgStakingAmount: { $avg: "$staking.amount" },
            },
          },
        ])
        .toArray()

      // Combinar dados dos validadores com estatísticas
      const enrichedValidators = allValidators.map((validator) => {
        const stats = validatorStats.find((s) => s._id === validator.validatorId) || {}

        return {
          ...validator,
          totalDelegated: stats.totalDelegated || 0,
          totalInitialDelegated: stats.totalInitialDelegated || 0,
          totalStakers: stats.totalStakers || 0,
          activeStaking: stats.activeStaking || 0,
          inactiveStaking: stats.inactiveStaking || 0,
          avgStakingAmount: stats.avgStakingAmount || 0,
          utilizationRate:
            validator.minStake > 0 ? (((stats.totalDelegated || 0) / validator.minStake) * 100).toFixed(2) : "0.00",
        }
      })

      res.status(200).json({ validators: enrichedValidators })
    } catch (error) {
      console.error("Error fetching validators:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "POST") {
    try {
      const { validatorId, name, performance, rewardRate, minStake, isActive } = req.body

      if (!validatorId || !name) {
        return res.status(400).json({ message: "ValidatorId and name are required" })
      }

      const { db } = await dbConnect()

      const newValidator = {
        validatorId,
        name,
        performance: performance || 0,
        rewardRate: rewardRate || 1,
        minStake: minStake || 10000,
        isActive: isActive !== undefined ? isActive : true,
        slashingRisk: 0.1,
        timeStaked: 0,
        totalDelegatedCoins: 0,
        rewardsGenerated: 0,
        createdAt: new Date(),
      }

      await db.collection("validators").insertOne(newValidator)

      res.status(201).json({
        message: "Validator created successfully",
        validator: newValidator,
      })
    } catch (error) {
      console.error("Error creating validator:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
