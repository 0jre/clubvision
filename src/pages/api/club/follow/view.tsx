import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/core/integration/connect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID not provided" });
        }

        try {
            const { db } = await dbConnect();

            // Coleções
            const usersCollection = db.collection("users");
            const reformsCollection = db.collection("reforms");

            // Buscar o usuário
            const user = await usersCollection.findOne({ id: userId });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Garantir que followers e following sejam arrays válidos
            const followerIds = Array.isArray(user.followers)
                ? user.followers.map((follower: { id: string }) => follower.id)
                : [];

            const followingIds = Array.isArray(user.following)
                ? user.following.map((following: { id: string }) => following.id)
                : [];

            // Buscar os seguidores (followers) na coleção 'users'
            const followers = await usersCollection
                .find({ id: { $in: followerIds } })
                .project({ id: 1, name: 1, avatar: 1 })
                .toArray();

            // Buscar os seguidos (following) na coleção 'users'
            const following = await usersCollection
                .find({ id: { $in: followingIds } })
                .project({ id: 1, name: 1, avatar: 1 })
                .toArray();

            // Buscar as reformas (reforms) para os seguidores e seguidos
            const reforms = await reformsCollection
                .find({ userId: { $in: [...followerIds, ...followingIds] } })
                .project({ BioLi: 1, verified: 1, nvrp: 1, nvxre: 1, userId: 1 })
                .toArray();

            // Combinar as informações de 'users' e 'reforms' nos seguidores
            const followersWithReforms = followers.map((follower) => {
                const reform = reforms.find((reform) => reform.userId === follower.id);
                return {
                    ...follower,
                    reforms: reform || null, // Adiciona as informações de reformas
                };
            });

            // Combinar as informações de 'users' e 'reforms' nos seguidos
            const followingWithReforms = following.map((followed) => {
                const reform = reforms.find((reform) => reform.userId === followed.id);
                return {
                    ...followed,
                    reforms: reform || null, // Adiciona as informações de reformas
                };
            });

            // Retornar as listas de seguidores e seguidos com os dados de reformas
            return res.status(200).json({
                followers: followersWithReforms,
                following: followingWithReforms,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else if (req.method === "POST") {
        const { userId, profileId } = req.body;

        if (!userId || !profileId) {
            return res.status(400).json({ error: "Both userId and profileId are required" });
        }

        try {
            const { db } = await dbConnect();
            const usersCollection = db.collection("users");

            // Buscar o usuário que está visitando o perfil (userId)
            const user = await usersCollection.findOne({ id: userId });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Garantir que os arrays existem antes de verificar
            const isFollowing = Array.isArray(user.following)
                ? user.following.some((following: { id: string }) => following.id === profileId)
                : false;

            const isFollowed = Array.isArray(user.followers)
                ? user.followers.some((follower: { id: string }) => follower.id === profileId)
                : false;

            return res.status(200).json({
                isFollowing,
                isFollowed,
            });
        } catch (error) {
            console.error("Error checking follow status:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
