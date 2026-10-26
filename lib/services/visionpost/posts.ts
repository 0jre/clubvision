import { postVisionCollection } from '@/core/integration/connect';
 

// Função para criar um novo post
export async function createPost(postData: any, db: any) {
    const postVision = db.collection(postVisionCollection);
  
    const newPost = {
      ...postData,
      createdAt: new Date(),
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      score: 0,
    };
  
    await postVision.insertOne(newPost);
  }
  
 
  // Função para atualizar visualizações e evitar duplicação
  export async function updateViewsAndCoins(post: any, userId: string, db: any) {
    if (post.userId === userId) return;
  
    const userViews = db.collection('userViews');
  
    // Atualiza visualizações e registra o usuário como viewer
    await userViews.updateOne(
      { userId },
      { $addToSet: { visualizedPosts: post._id } },
      { upsert: true }
    );
  
    await db.collection(postVisionCollection).updateOne(
      { _id: post._id },
      { $inc: { views: 1 } }
    );
  }
