import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { dbConnect, postVisionCollection } from '@/core/integration/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { postId } = req.query;

  if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();
      const collection = db.collection(postVisionCollection);
      const usersCollection = db.collection('users'); // Coleção de usuários

      const post = await collection.findOne({ _id: new ObjectId(postId as string) });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Adicionar name e avatar aos comentários
      const commentsWithUserDetails = await Promise.all(
        post.comments.map(async (comment: any) => {
          const user = await usersCollection.findOne(
            { id: comment.user.id },
            { projection: { name: 1, avatar: 1 } } // Obtém apenas o nome e avatar
          );

          return {
            ...comment,
            user: {
              ...comment.user,
              name: user?.name || 'Usuário desconhecido',
              avatar: user?.avatar || null,
            },
          };
        })
      );

      const shuffledComments = shuffleArray(commentsWithUserDetails);

      const response = {
        ...post,
        comments: shuffledComments,
        commentCount: commentsWithUserDetails.length,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar detalhes do post' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}

// Função para embaralhar um array usando o algoritmo Fisher-Yates
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
