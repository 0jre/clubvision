import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "@/core/integration/connect"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const {
      page = 1,
      limit = 20,
      type = "",
      userId = "",
      dateFrom = "",
      dateTo = "",
      sortBy = "timestamp",
      sortOrder = "desc",
    } = req.query

    const { db } = await dbConnect()
    const skip = (Number(page) - 1) * Number(limit)

    // Pipeline base para transações
    const pipeline: any[] = []

    // Filtros de data
    const dateFilter: any = {}
    if (dateFrom) dateFilter.$gte = new Date(dateFrom as string)
    if (dateTo) dateFilter.$lte = new Date(dateTo as string)

    // Buscar diferentes tipos de transações
    let transactions: any[] = []

    if (!type || type === "cases") {
      // Transações de abertura de caixas
      const caseTransactions = await db
        .collection("items")
        .aggregate([
          { $unwind: "$transactions" },
          {
            $match: {
              "transactions.action": "purchase_openbox",
              ...(Object.keys(dateFilter).length && {
                "transactions.timestamp": dateFilter,
              }),
              ...(userId && { id: userId }),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "id",
              foreignField: "id",
              as: "userInfo",
            },
          },
          {
            $project: {
              type: "case_opening",
              userId: "$id",
              user: { $arrayElemAt: ["$userInfo", 0] },
              amount: "$transactions.amount",
              currency: "$transactions.currency",
              timestamp: "$transactions.timestamp",
              details: {
                item: "$transactions.item",
                action: "$transactions.action",
              },
            },
          },
        ])
        .toArray()

      transactions = [...transactions, ...caseTransactions]
    }

    if (!type || type === "marketplace") {
      // Transações de marketplace
      const marketplaceTransactions = await db
        .collection("transactions")
        .aggregate([
          {
            $match: {
              type: "marketplace_sale",
              ...(Object.keys(dateFilter).length && {
                createdAt: dateFilter,
              }),
              ...(userId && {
                $or: [{ sellerId: userId }, { buyerId: userId }],
              }),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "sellerId",
              foreignField: "id",
              as: "sellerInfo",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "buyerId",
              foreignField: "id",
              as: "buyerInfo",
            },
          },
          {
            $project: {
              type: "marketplace_sale",
              sellerId: 1,
              buyerId: 1,
              seller: { $arrayElemAt: ["$sellerInfo", 0] },
              buyer: { $arrayElemAt: ["$buyerInfo", 0] },
              amount: 1,
              currency: "bits",
              timestamp: "$createdAt",
              details: {
                itemId: 1,
                itemName: 1,
              },
            },
          },
        ])
        .toArray()

      transactions = [...transactions, ...marketplaceTransactions]
    }

    if (!type || type === "upgrades") {
      // Transações de upgrades
      const upgradeTransactions = await db
        .collection("upgrades")
        .aggregate([
          {
            $match: {
              ...(Object.keys(dateFilter).length && {
                timestamp: dateFilter,
              }),
              ...(userId && { userId }),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "id",
              as: "userInfo",
            },
          },
          {
            $project: {
              type: "upgrade",
              userId: 1,
              user: { $arrayElemAt: ["$userInfo", 0] },
              amount: "$totalOfferedValue",
              currency: "items",
              timestamp: 1,
              details: {
                success: 1,
                probability: 1,
                targetItem: 1,
                offeredItems: 1,
              },
            },
          },
        ])
        .toArray()

      transactions = [...transactions, ...upgradeTransactions]
    }

    if (!type || type === "trades") {
      // Transações de trading P2P
      const tradeTransactions = await db
        .collection("trades")
        .aggregate([
          {
            $match: {
              status: "completed",
              ...(Object.keys(dateFilter).length && {
                time: dateFilter,
              }),
              ...(userId && {
                $or: [{ userIdtrader: userId }, { userIdreceive: userId }],
              }),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userIdtrader",
              foreignField: "id",
              as: "traderInfo",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userIdreceive",
              foreignField: "id",
              as: "receiverInfo",
            },
          },
          {
            $project: {
              type: "p2p_trade",
              traderId: "$userIdtrader",
              receiverId: "$userIdreceive",
              trader: { $arrayElemAt: ["$traderInfo", 0] },
              receiver: { $arrayElemAt: ["$receiverInfo", 0] },
              amount: "$quantitytoken",
              currency: "vtoken",
              timestamp: "$time",
              details: {
                vid: 1,
                mytvl1: 1,
                mytvl2: 1,
              },
            },
          },
        ])
        .toArray()

      transactions = [...transactions, ...tradeTransactions]
    }

    // Ordenação
    const sortKey = Array.isArray(sortBy) ? sortBy[0] : sortBy;

transactions.sort((a, b) => {
  const aValue = a[sortKey] ?? a.timestamp;
  const bValue = b[sortKey] ?? b.timestamp;

  if (sortOrder === "desc") {
    return new Date(bValue).getTime() - new Date(aValue).getTime();
  }
  return new Date(aValue).getTime() - new Date(bValue).getTime();
});


    // Paginação
    const totalItems = transactions.length
    const paginatedTransactions = transactions.slice(skip, skip + Number(limit))

    res.status(200).json({
      transactions: paginatedTransactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems,
        totalPages: Math.ceil(totalItems / Number(limit)),
      },
    })
  } catch (error) {
    console.error("Error fetching marketplace transactions:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
