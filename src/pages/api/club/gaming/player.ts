import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession,  NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';
import { dbConnect } from '@/core/integration/connect';

export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  const sessionUser = req.session?.get('user');

  if (!sessionUser) {
    return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
  }

  const userId  = sessionUser.id;  // O userId agora deve vir diretamente da sessão

 // Caso o método seja POST (atualizar autorização)
if (req.method === 'POST') {
  try {
    const { db } = await dbConnect();
    const { cid, request, authorized } = req.body;  // Recebe os valores do corpo da requisição (cid, request, authorized)

    // Etapa 1: Buscar o usuário com base no userId
    const userData = await db.collection('users').findOne({ id: userId });

    if (!userData) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
 

    // Etapa 2: Verificar se o cid existe na array 'player.session' do usuário
    const playerToUpdate = userData.player?.find((player: any) => 
      player.session?.some((session: any) => session.cid === cid)
    );

    if (!playerToUpdate) {
      return res.status(404).json({ message: 'Jogador com o cid não encontrado no registro.' });
    }

    // Etapa 3: Encontrar a sessão mais recente dentro de 'player.session'
    const mostRecentSession = playerToUpdate.session.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (!mostRecentSession) {
      return res.status(404).json({ message: 'Nenhuma sessão encontrada para o jogador.' });
    }

    // Etapa 4: Atualizar o status no array 'player.session' baseado no cid
    const updatedUser = await db.collection('users').updateOne(
      {
        'player.session.cid': cid,  // Ajuste para filtrar pela sessão com o cid correto
      },
      {
        $set: {
         'player.$.session.$[session].request': request,    // Atualiza 'request' conforme o valor enviado
'player.$.session.$[session].authorized': authorized,  // Atualiza 'authorized' conforme o valor enviado
'player.$.session.$[session].recused': !authorized,      
'player.$.session.$[session].accepted': authorized

        },
      },
      {
        arrayFilters: [{ 'session.cid': cid }],  // Filtro para garantir que a atualização seja na sessão com o cid correto
      }
    );

    if (updatedUser.modifiedCount === 0) {
      return res.status(500).json({ message: 'Erro ao atualizar o status do jogador.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Autorização do jogador atualizada com sucesso.',
    });
  } catch (error: any) {
    console.error('Erro ao processar a autorização:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
}

  
  // Caso o método seja GET (buscar dados do jogador)
  else if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();
  
      // Buscar o usuário com base no userId
      const userData = await db.collection('users').findOne({ id: userId });
  
      if (!userData) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      // Buscar o jogador com a sessão mais recente onde request = true
      const playerWithMostRecentSession = userData.player
        ?.map((player: any) => {
          // Filtra as sessões com request: true
          const activeSessions = player.session
            .filter((session: any) => session.request === true);
          
          if (activeSessions.length === 0) return null;
  
          // Ordena as sessões para pegar a mais recente
          const mostRecentSession = activeSessions
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
          return { ...player, mostRecentSession };
        })
        .filter((player: any) => player !== null) // Remove jogadores sem sessões ativas
        .sort((a: any, b: any) => new Date(b.mostRecentSession.date).getTime() - new Date(a.mostRecentSession.date).getTime())[0]; // Pega o jogador com a sessão mais recente
  
      if (!playerWithMostRecentSession) {
        return res.status(404).json({ message: 'Nenhum jogador com requisição ativa encontrada.' });
      }
  
      // Retorna o jogador com a sessão mais recente
      return res.status(200).json({
        success: true,
        player: {
          ...playerWithMostRecentSession,
          mostRecentSession: playerWithMostRecentSession.mostRecentSession,
        },
      });
  
    } catch (error: any) {
      console.error('Erro ao processar a requisição GET:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  }
  
  
  
};

const checkAuthWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await checkAuth(req, res);
};

export default withSession(checkAuthWithSession);