import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { db } = await dbConnect();
    const { hexId } = req.query;

    const steamUser = await db.collection('steam').findOne({ hexid: `steam:${hexId}` });

    if (!steamUser) {
      return res.status(404).json({ message: 'Usuário não encontrado na coleção steam.' });
    }

    const userId = steamUser.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId é obrigatório.' });
    }

    try {
      const { db } = await dbConnect();

      const userData = await db.collection('users').findOne({ id: userId });

      if (!userData) {
        return res.status(404).json({ message: 'Usuário não encontrado na coleção users.' });
      }

      const validSession = userData.player?.find((player: any) => {
        const mostRecentSession = player.session
          .filter((session: any) => session.request === false && session.authorized === true)
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        if (mostRecentSession) {
          const sessionDate = new Date(mostRecentSession.date).getTime();
          const currentTime = new Date().getTime();
          const timeDifference = currentTime - sessionDate;

          // ⚠️ Limite de 4 minutos para aceitar/recusar
          if (timeDifference > 4 * 60 * 1000) {
            db.collection('users').updateOne(
              { id: userId, 'player.session.date': mostRecentSession.date },
              { $set: { 'player.$.session.$[elem].authorized': false } },
              { arrayFilters: [{ 'elem.date': mostRecentSession.date }] }
            );
            return null;
          }

          // ✅ Validação de 12 horas – só marca como 'expired' no retorno da API
          if (timeDifference > 12 * 60 * 60 * 1000) {
            mostRecentSession.status = 'expired';
          }

          return mostRecentSession;
        }

        return null;
      });

      if (!validSession) {
        return res.status(404).json({ message: 'Nenhuma sessão válida encontrada ou a sessão expirou.' });
      }

      // Atualiza outras sessões autorizadas para false, exceto a mais recente
      await db.collection('users').updateMany(
        { id: userId, 'player.session.authorized': true },
        { $set: { 'player.$.session.$[elem].authorized': false } },
        { arrayFilters: [{ 'elem.date': { $ne: validSession.date } }] }
      );

      return res.status(200).json({
        success: true,
        message: 'Sessão válida encontrada.',
        session: validSession,
      });

    } catch (error: any) {
      console.error('Erro ao buscar a sessão do jogador:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Método não permitido.' });
}
