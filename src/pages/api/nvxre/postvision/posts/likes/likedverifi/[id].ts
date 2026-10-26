// api/videos/checkLikeStatus.ts
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { dbConnect, postVisionCollection } from '@/core/integration/connect';
import { ObjectId } from 'mongodb';

export type NextIronRequestWithoutSession = NextApiRequest;

const checkLikeStatus: NextApiHandler = async (req: NextIronRequestWithoutSession, res: NextApiResponse) => {
  try {
    // Obtenha o ID do usuário da query string
    const userId = req.query.userId as string | undefined;

    // Verifique se userId não é undefined antes de continuar
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido na query string.' });
    }

    // Obtenha o ID do vídeo da requisição
    const id = req.query.id as string | undefined;

    // Verifique se videoId é verdadeiro antes de continuar
    if (!id) {
      return res.status(400).json({ error: 'ID do vídeo não fornecido.' });
    }

    // Conecte-se ao banco de dados
    const { db } = await dbConnect();
    const collection = db.collection(postVisionCollection);

    // Consulte o vídeo pelo ID
    const video = await collection.findOne({
      _id: new ObjectId(id),
    });

    // Verifique se o vídeo existe
    if (!video) {
      return res.status(404).json({ error: 'Vídeo não encontrado.' });
    }

    // Verifique se o ID do usuário está presente no campo likedBy
    const likedBy = video.likedBy || [];

    // Se o usuário estiver presente no campo likedBy, retorne o status
    const liked = likedBy.includes(userId);

    return res.status(200).json({ liked });
  } catch (error) {
    console.error('Erro ao verificar o status de like do usuário:', error);
    return res.status(500).json({ error: 'Erro ao verificar o status de like do usuário.' });
  }
};



export default checkLikeStatus;
