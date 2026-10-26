import { postVisionCollection } from "@/core/integration/connect"
import { getUserAvatar, getUserName } from "../user"
import { adjustPostScores, calculatePostScore } from "./get.Interactions"
import { ObjectId } from "mongodb"

export async function getUnviewedPosts(userId: string, db: any) {
  const postVision = db.collection(postVisionCollection)

  // Buscar visualizações anteriores do usuário
  const userPostViews = await db.collection("userViews").findOne({ userId })
  const viewedPostIds = new Set(userPostViews?.visualizedPosts || [])

  // Buscar novos posts que o usuário ainda não viu
  let posts = await postVision
    .aggregate([
      {
        $match: {
          _id: { $nin: Array.from(viewedPostIds) },
          userId: { $ne: userId },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
    ])
    .toArray()

  // Se não houver posts novos, buscar posts já vistos anteriormente
  if (posts.length === 0 && viewedPostIds.size > 0) {
    posts = await postVision
      .aggregate([
        {
          $match: {
            _id: { $in: Array.from(viewedPostIds) },
            userId: { $ne: userId },
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 50 },
      ])
      .toArray()
  }

  // Ajusta as pontuações com base nas interações do usuário
  const adjustedPosts = await adjustPostScores(posts, userId, db)

  // Remover posts repetidos e garantir apenas um post por usuário
  const uniqueUserPosts: any[] = []
  const seenUserIds = new Set()

  for (const post of adjustedPosts) {
    if (!seenUserIds.has(post.userId)) {
      seenUserIds.add(post.userId)
      uniqueUserPosts.push(post)
    }
  }

  // Adicionar detalhes do criador do post (nome e avatar)
  const postsWithUserDetails = await Promise.all(
    uniqueUserPosts.slice(0, 20).map(async (post) => {
      const nvuser = await getUserName(post.userId, db)
      const AvatarUser = await getUserAvatar(post.userId, db)
      return { ...post, nvuser, AvatarUser }
    }),
  )

  // Atualizar a coleção de visualizações para evitar repetições futuras
  await db
    .collection("userViews")
    .updateOne(
      { userId },
      { $addToSet: { visualizedPosts: postsWithUserDetails.map((post) => post._id.toString()) } },
      { upsert: true },
    )

  return postsWithUserDetails
}

export async function getPostById(postId: string, db: any) {
  const postVision = db.collection(postVisionCollection)

  try {
    // Tenta converter para ObjectId se for uma string válida
    let query
    if (ObjectId.isValid(postId)) {
      query = { _id: new ObjectId(postId) }
    } else {
      // Se não for um ObjectId válido, busca como string
      query = { _id: postId }
    }

    const post = await postVision.findOne(query)
    return post
  } catch (error) {
    console.error("Error fetching post by ID:", error)
    return null
  }
}

export async function getViewedPosts(followingIds: string[], userId: string, db: any) {
  const postVision = db.collection(postVisionCollection)

  // Buscar visualizações anteriores do usuário
  const userPostViews = await db.collection("userViews").findOne({ userId })
  const viewedPostIds = new Set(userPostViews?.visualizedPosts || [])

  // Buscar posts dos usuários seguidos
  const posts = await postVision
    .aggregate([
      {
        $match: {
          userId: { $in: followingIds },
          _id: { $nin: Array.from(viewedPostIds) }, // Excluir posts já vistos
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
    ])
    .toArray()

  // Ajustar pontuação com base no sistema de relevância
  const scoredPosts = await Promise.all(
    posts.map(async (post: any) => ({
      ...post,
      score: await calculatePostScore(post, userId, db),
    })),
  )

  // Ordenar por pontuação (posts mais relevantes primeiro)
  scoredPosts.sort((a, b) => b.score - a.score)

  // Garantir que apenas um post por usuário seja exibido
  const uniqueUserPosts: any[] = []
  const seenUserIds = new Set()

  for (const post of scoredPosts) {
    if (!seenUserIds.has(post.userId)) {
      seenUserIds.add(post.userId)
      uniqueUserPosts.push(post)
    }
  }

  // Buscar detalhes do criador do post (nome e avatar)
  const postsWithUserDetails = await Promise.all(
    uniqueUserPosts.slice(0, 20).map(async (post) => {
      const nvuser = await getUserName(post.userId, db)
      const AvatarUser = await getUserAvatar(post.userId, db)
      return {
        ...post,
        nvuser,
        AvatarUser,
      }
    }),
  )

  // Atualizar a coleção de visualizações para evitar repetições futuras
  await db
    .collection("userViews")
    .updateOne(
      { userId },
      { $addToSet: { visualizedPosts: postsWithUserDetails.map((post) => post._id.toString()) } },
      { upsert: true },
    )

  return postsWithUserDetails
}
