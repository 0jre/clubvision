import { dbConnect } from "@/core/integration/connect"
import { withSession, type NextIronHandler } from "@/lib/session"
import type { Session } from "next-iron-session"
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { getUserAvatar, getUserName, isUserPrime } from "@/lib/services/visionpost/user"
import { createPost, updateViewsAndCoins } from "@/lib/services/visionpost/posts"
import { getPostById, getUnviewedPosts, getViewedPosts } from "@/lib/services/visionpost/userInteractions"
import { adjustPostScores } from "@/lib/services/visionpost/userInteractions/get.Interactions"
import { updateMonetization } from "@/lib/services/visionpost/monetization"

export type NextIronRequestWithSession = NextApiRequest & { session?: Session }

const verifyUserPrime = async (userId: string, db: any): Promise<boolean> => {
  const isPrime = await isUserPrime(userId, db)
  if (!isPrime) {
    throw new Error("Acesso negado. Usuário não é Prime.")
  }
  return true
}

const handlePostCreation = async (req: NextApiRequest, db: any) => {
  const postData = req.body
  await createPost(postData, db)
  return { status: 201, message: "Post criado com sucesso." }
}

const handlePostFetching = async (userId: string, db: any, typeview: string, postId?: string) => {
  let posts: any[] = []

  if (postId) {
    // Busca por ID específico - permite buscar posts próprios e de outros usuários
    const post = await getPostById(postId, db)
    if (post) {
      // Adiciona informações do usuário ao post
      const nvuser = await getUserName(post.userId, db)
      const AvatarUser = await getUserAvatar(post.userId, db)
      posts = [{ ...post, nvuser, AvatarUser }]
    }
  } else if (typeview === "following") {
    // Feed dos seguidos
    const user = await db.collection("users").findOne({ _id: userId })
    const followingIds = user?.following?.map((user: any) => user.id) || []
    posts = await getViewedPosts(followingIds, userId, db)
  } else {
    // Feed geral (explorar)
    posts = await getUnviewedPosts(userId, db)
  }

  // Ajuste de pontuação apenas se não for busca por ID específico
  if (!postId && posts.length > 0) {
    posts = await adjustPostScores(posts, userId, db)
  }

  // Atualizar visualizações e monetização apenas se não for o próprio post do usuário
  await Promise.all(
    posts.map(async (post) => {
      if (post.userId !== userId) {
        await updateViewsAndCoins(post, userId, db)
        await updateMonetization(post, userId, db)
      }
    }),
  )

  return posts
}

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  if (!req.session || !req.session.get("user")) {
    return res.status(401).json({ message: "Usuário não autenticado." })
  }

  const userId = req.session.get("user").id
  const { db } = await dbConnect()
  const { typeview, _id } = req.query // Adiciona _id aos parâmetros de query

  try {
    // Verifica se o usuário é Prime
    await verifyUserPrime(userId, db)

    if (req.method === "POST") {
      const response = await handlePostCreation(req, db)
      res.status(response.status).json({ message: response.message })
    } else if (req.method === "GET") {
      const posts = await handlePostFetching(
        userId,
        db,
        typeview as string,
        _id as string, // Passa o _id para a função de busca
      )

      if (_id && posts.length === 0) {
        return res.status(404).json({ message: "Post não encontrado." })
      }

      res.status(200).json(posts)
    } else {
      console.error("Method not allowed:", req.method)
      res.status(405).json({ message: "Method not allowed" })
    }
  } catch (error: any) {
    console.error("Error:", error.message)
    res.status(500).json({ message: error.message || "Internal Server Error" })
  }
}

const checkAuthWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await checkAuth(req, res)
}

export default withSession(checkAuthWithSession)
