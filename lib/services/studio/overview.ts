import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect, postVisionCollection } from '@/core/integration/connect';
import { Post, ProfileStats } from '@/types/studio';

export async function OverviewStudio(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();
      const collection = db.collection(postVisionCollection);

      // Pega todos os posts do usuário
      const userPosts = await collection.find({ userId: userId }).toArray() as unknown as Post[];

      // Verificação de posts do usuário
      if (userPosts.length === 0) {
        return res.status(404).json({ message: 'No posts found for this user' });
      }

      // Calcula estatísticas
      const earnings = 0; // Ajuste conforme necessário
      const postViews = userPosts.reduce((acc, post) => acc + (post.views || 0), 0);
      const likes = userPosts.reduce((acc, post) => acc + (post.likedBy?.length || 0), 0);
      
      // Buscar as visitas no perfil do usuário (na coleção users)
      const userCollection = db.collection('users');
      const user = await userCollection.findOne({ id: userId });

      let profileViews = 0;
      let visits = [];

      if (user && user.visitmyprofile) {
        profileViews = user.visitmyprofile.length;
        visits = user.visitmyprofile.map((visit: any) => ({
          id: visit.id,
          date: visit.date,
        }));
      }

      const comments = {
        count: userPosts.reduce((acc, post) => acc + (post.comments?.length || 0), 0),
        details: userPosts.flatMap(post => post.comments || []),
      };

      const mostEngagedPost = userPosts.reduce<Post | null>((maxPost, post) => {
        const postEngagement = (post.likedBy?.length || 0) + (post.views || 0);
        const maxPostEngagement = (maxPost?.likedBy?.length || 0) + (maxPost?.views || 0);

        // A comparação correta entre postEngagement e maxPostEngagement
        return postEngagement > maxPostEngagement ? post : maxPost;
      }, null);
      
      if (mostEngagedPost) {
        mostEngagedPost.totalComments = mostEngagedPost.comments?.length || 0;
        mostEngagedPost.liked = mostEngagedPost.likedBy?.length || 0;
      }

      // Monta o objeto de estatísticas
      const stats: ProfileStats = {
        earnings,
        postViews,
        likes,
        profileViews, // Número total de visitas ao perfil
        comments,
        mostEngagedPost,
        visits, // Detalhes das visitas ao perfil
      };

      // Retorna as estatísticas
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ message: 'Error fetching user stats' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}