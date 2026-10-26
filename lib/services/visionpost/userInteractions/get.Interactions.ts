import { postVisionCollection } from "@/core/integration/connect";

export async function adjustPostScores(posts: any[], userId: string, db: any) {
  let adjustedScores = [];

  // Buscar interações do usuário nos posts de forma eficiente
  const userViews = await db.collection('userViews').findOne({ userId }, { projection: { visualizedPosts: 1 } });

  if (!userViews) {
    return posts;
  }

  // Criar um mapa de post IDs para evitar múltiplas queries individuais
  const postIds = posts.map(post => post._id);
  const postDetailsMap = await db.collection(postVisionCollection)
    .find({ _id: { $in: postIds } }, { projection: { likedBy: 1, comments: 1 } })
    .toArray()
    .then((results: any) => results.reduce((acc: any, post: any) => {
      acc[post._id.toString()] = post;
      return acc;
    }, {}));

  for (let post of posts) {
    let score = await calculatePostScore(post, userId, db);
    const postId = post._id.toString();
    const userHasViewed = userViews.visualizedPosts.includes(postId);

    if (userHasViewed) {
      const postDetails = postDetailsMap[postId] || {};
      const userLiked = postDetails.likedBy?.includes(userId);
      const userCommented = postDetails.comments?.some((comment: any) => comment.user.id === userId);

      if (!userLiked && !userCommented) {
        score -= 0.2;
      } else if (userLiked && userCommented) {
        score += 0.3;
      } else if (userLiked) {
        score += 0.2;
      } else if (userCommented) {
        score += 0.2;
      }
    }

    adjustedScores.push({
      ...post,
      score
    });
  }

  adjustedScores.sort((a, b) => b.score - a.score);
  return adjustedScores;
}

export async function calculatePostScore(post: any, userId: string, db: any) {
  let score = post.likes * 0.4 + post.comments.length * 0.3 + post.shares * 0.2 + post.views * 0.1;
  const freshnessScore = Math.max(0, 1 - (new Date().getTime() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  score += freshnessScore * 0.2;

  const userInteractionScore = await calculateUserInteractionScore(userId, post._id, db);
  score += userInteractionScore * 0.5;

  return score;
}

async function calculateUserInteractionScore(userId: string, postId: string, db: any) {
  const userViews = await db.collection('userViews').findOne({ userId }, { projection: { visualizationDetails: 1 } });

  if (!userViews || !userViews.visualizationDetails) return 0;
  const postDetails = userViews.visualizationDetails[postId.toString()];

  if (postDetails && postDetails.timeWatched > 10) {
    return 0.5;
  }
  return postDetails ? 0.2 : 0;
}

export async function updateViewsAndCoins(post: any, userId: string, db: any) {
  if (post.userId === userId) return;

  await db.collection('userViews').updateOne(
    { userId },
    { $addToSet: { visualizedPosts: post._id } },
    { upsert: true }
  );

  await db.collection(postVisionCollection).updateOne(
    { _id: post._id },
    { $inc: { views: 1 } }
  );
}