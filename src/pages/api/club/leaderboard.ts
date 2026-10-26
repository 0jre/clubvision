import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/core/integration/connect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { db } = await dbConnect();

        // Busca e junta os dados diretamente no MongoDB usando agregação
        const topUsers = await db.collection("reforms").aggregate([
            { $match: { prime: true, type: "Authorized" } },
            { 
                $lookup: { 
                    from: "users", 
                    localField: "userId", 
                    foreignField: "id", 
                    as: "userData"
                } 
            },
            { $unwind: "$userData" },
            {
                $lookup: {
                    from: "member-stats",
                    localField: "userId",
                    foreignField: "member_id",
                    as: "statsData"
                }
            },
            { $unwind: "$statsData" },
            {
                $lookup: {
                    from: "items",
                    localField: "userId",
                    foreignField: "id",
                    as: "itemsData"
                }
            },
            { $unwind: "$itemsData" },
            {
                $addFields: {
                    totalWealth: {
                        $add: [
                            { $ifNull: ["$itemsData.coins", 0] },
                            { $ifNull: ["$itemsData.banking", 0] },
                            { $ifNull: ["$itemsData.bits", 0] }
                        ]
                    },
                    level: "$statsData.level",
                    xp: "$statsData.xp",
                    clubactivity: "$statsData.clubactivity",
                    followersCount: { $size: { $ifNull: ["$userData.followers", []] } }
                }
            },
            {
                $project: {
                    userId: "$userData.id",
                    avatar: "$userData.avatar",
                    name: {
                        $concat: ["$userData.name", { $ifNull: ["$userData.domain", ""] }]
                    },
                    level: 1,
                    xp: 1,
                    totalWealth: 1,
                    followersCount: 1,
                    clubactivity: 1
                }
            },
            {
                $addFields: {
                    adjustedWealth: { $min: ["$totalWealth", { $add: ["$level", "$xp"] }] },
                    followersPercentage: { $multiply: [{ $divide: ["$followersCount", 100] }, 100] },
                    levelPercentage: { $min: [{ $multiply: [{ $divide: ["$level", 299] }, 100] }, 100] },
                    clubActivityPercentage: { $min: [{ $multiply: [{ $divide: ["$clubactivity", 800000] }, 100] }, 100] }
                }
            },
            {
                $addFields: {
                    recognitionScore: {
                        $switch: {
                            branches: [
                                { case: { $lte: ["$followersPercentage", 1] }, then: 0 },
                                { case: { $lte: ["$followersPercentage", 10] }, then: 20 },
                                { case: { $lte: ["$followersPercentage", 50] }, then: 50 },
                                { case: { $lte: ["$followersPercentage", 90] }, then: 80 }
                            ],
                            default: 100
                        }
                    },
                    wealthScore: {
                        $switch: {
                            branches: [
                                { case: { $lte: ["$adjustedWealth", 100] }, then: 10 },
                                { case: { $lte: ["$adjustedWealth", 1000] }, then: 30 },
                                { case: { $lte: ["$adjustedWealth", 10000] }, then: 60 },
                                { case: { $lte: ["$adjustedWealth", 100000] }, then: 80 }
                            ],
                            default: 100
                        }
                    }
                }
            },
            {
                $addFields: {
                    weightedScore: {
                        $add: [
                            { $multiply: ["$wealthScore", 0.4] },
                            { $multiply: ["$recognitionScore", 0.2] },
                            { $multiply: ["$levelPercentage", 0.1] },
                            { $multiply: ["$clubActivityPercentage", 0.3] }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    momentum: {
                        $switch: {
                            branches: [
                                { case: { $lte: ["$weightedScore", 25] }, then: "Desconhecido" },
                                { case: { $lte: ["$weightedScore", 45] }, then: "Promissor" },
                                { case: { $lte: ["$weightedScore", 65] }, then: "Destaque" },
                                { case: { $lte: ["$weightedScore", 85] }, then: "Elite" },
                                { case: { $lte: ["$weightedScore", 100] }, then: "Grandmaster" }
                            ],
                            default: "Legendary"
                        }
                    }
                }
            },
            { $sort: { weightedScore: -1 } },
            { $limit: 30 },
            { 
                $project: {
                    userId: 1,
                    avatar: 1,
                    name: 1,
                    momentum: 1,
                    wealthScore: "$adjustedWealth",
                    level: 1
                } 
            }
        ]).toArray();

        return res.status(200).json({ log: topUsers });

    } catch (error) {
        console.error("Error fetching user info:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
