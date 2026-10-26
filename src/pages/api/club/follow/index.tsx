import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/core/integration/connect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { db } = await dbConnect();
    const { userId, followId, action } = req.body;  // `action` pode ser "follow" ou "unfollow"

    if (!userId || !followId || !action) {
      return res.status(400).json({ error: "userId, followId, and action are required" });
    }

    // Coleção de usuários
    const usersCollection = db.collection("users");

    if (action === "follow") {
      // Seguir: Adiciona o followId na lista de seguidores do userId
      await usersCollection.updateOne(
        { id: followId },
        { $addToSet: { following: { id: userId } } }, // Adiciona ao array 'followers'
        { upsert: true }
      );

      // Seguir: Adiciona o followId na lista de seguidos do userId
      await usersCollection.updateOne(
        { id: userId },
        { $addToSet: { followers: { id: followId } } }, // Adiciona ao array 'following'
        { upsert: true }
      );

      return res.status(200).json({ message: "Follow action successful" });

    } else if (action === "unfollow") {
      // Desseguir: Remove o userId da lista de seguidores do followId
      await usersCollection.updateOne(
        { id: followId },
        { $pull: { following: { id: userId } } }, // Remove do array 'followers'
        { upsert: true }
      );

      // Desseguir: Remove o followId da lista de seguidos do userId 
      await usersCollection.updateOne(
        { id: userId },
        { $pull: { followers: { id: followId } } }, // Remove do array 'following'
        { upsert: true }
      );

      return res.status(200).json({ message: "Unfollow action successful" });

    } else {
      return res.status(400).json({ error: "Invalid action. Must be 'follow' or 'unfollow'" });
    }

  } catch (error) {
    console.error("Error handling follow/unfollow action:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
