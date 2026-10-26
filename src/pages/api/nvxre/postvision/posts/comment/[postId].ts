import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { dbConnect, postVisionCollection } from '@/core/integration/connect';
import { withSession, NextIronRequest } from '@/lib/session';
import analyzeInappropriateContent from '@/lib/services/analyst/InappropriateContent/verification';
 
const XP_PER_COMMENT = 12; // XP ganho por comentário

export default withSession(async function handler(req: NextIronRequest, res: NextApiResponse) {
  const { postId } = req.query;

  if (req.method === 'POST') {
    try {
      const { comment } = req.body;
      const user = req.session.get('user');

      if (!user) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }

      const { db } = await dbConnect();
      const collection = db.collection(postVisionCollection);
      const memberStatsCollection = db.collection('member-stats');

      const analysisResult = await analyzeInappropriateContent(postVisionCollection, user.id, comment);
      
      if (analysisResult.hasContentViolation) {
        return res.status(400).json({
          message: `${analysisResult.wordsRemoved} é imprópria e foi removido.`,
        });
      }
      
      // Prosseguir com a lógica para salvar o comentário corrigido
      const correctedComment = analysisResult.analyzedComment || comment;

      const objectId = new ObjectId(postId as string);

      const result = await collection.updateOne(
        { _id: objectId },
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
        // Incrementa o XP do usuário em 'member-stats' após comentário
        await memberStatsCollection.updateOne(
          { member_id: user.id },
          {
            $inc: {
              xp: XP_PER_COMMENT,
              clubactivity: XP_PER_COMMENT,
              message: 1,
            },
          }
        );

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
