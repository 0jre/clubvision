import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';
import { dbConnect } from '@/core/integration/connect';

export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  const sessionUser = req.session?.get('user');

  if (!sessionUser) {
    return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
  }

  const userId = sessionUser.id;

  if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();

      // Buscar o usuário pelo userId
      const userData = await db.collection('users').findOne({ id: userId });

      if (!userData) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      // Retornar TODOS os registros do array 'player' (sem qualquer tipo de filtragem)
      return res.status(200).json({
        success: true,
        message: 'Jogadores encontrados.',
        players: userData.player,  // Retorna o array completo de jogadores
      });
    } catch (error: any) {
      console.error('Erro ao processar a solicitação:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  }

  // Caso o método não seja GET
  return res.status(405).json({ message: 'Método não permitido.' });
};

const checkAuthWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await checkAuth(req, res);
};

export default withSession(checkAuthWithSession);
