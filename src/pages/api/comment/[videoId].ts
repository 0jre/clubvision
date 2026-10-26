import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { dbConnect, visiontvCollection } from '@/core/integration/connect';
import { withSession, NextIronRequest } from '@/lib/session'; // Importe seu módulo de sessão aqui
import analyzeInappropriateContent from '@/lib/services/analyst/InappropriateContent/verification';

export default withSession(async function handler(req: NextIronRequest, res: NextApiResponse) {
  const { videoId } = req.query;

  if (req.method === 'POST') {
    try {
      const { comment } = req.body;
      const user = req.session.get('user'); // Obtenha as informações do usuário da sessão

      if (!user) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }

      const { db } = await dbConnect();
      const collection = db.collection(visiontvCollection);

      const analysisResult = await analyzeInappropriateContent(visiontvCollection, user.id, comment,);
      
      if (analysisResult.hasContentViolation) {
        return res.status(400).json({
          message: `${analysisResult.wordsRemoved} é imprópria e foi removido.`,
        });
      }
      
      // Prosseguir com a lógica para salvar o comentário corrigido
      const correctedComment = analysisResult.analyzedComment || comment;

      // Atualize esta parte de acordo com a estrutura do seu banco de dados
      const result = await collection.updateOne(
        { _id: new ObjectId(videoId as string) },
        {
          $push: {
            comments: {
              text: correctedComment,
              user: {
                id: user.id, 
              },
            },
          },
        }
      );

      if (result.modifiedCount === 1) {
        res.status(201).json({ message: 'Comentário enviado com sucesso' });
      } else {
        res.status(500).json({ message: 'Erro ao enviar comentário' });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      res.status(500).json({ message: 'Erro ao enviar comentário' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
});
