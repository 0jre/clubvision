import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';
import { dbConnect } from '@/core/integration/connect';

export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const registerVisit: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  try {
    const sessionUser = req.session?.get('user');
   
    // Verifica se o usuário está autenticado
    if (!sessionUser) {
      return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
    }

    // Pega o ID do usuário visitado a partir do corpo da requisição
    const { visitedUserId } = req.body;
  const visitmy = sessionUser.id === visitedUserId
    // Se não foi passado o ID do usuário visitado
    if (!visitedUserId) {
      return res.status(400).json({ message: 'ID do usuário visitado é necessário.' });
    }

    

    const { db } = await dbConnect();
    const usersCollection = db.collection('users');
    
    // Pega o documento do usuário visitado
    const visitedUser = await usersCollection.findOne({ id: visitedUserId });

    if (!visitedUser) {
      return res.status(404).json({ message: 'Usuário visitado não encontrado.' });
    }

    // Cria a visita (com data e hora exata)
    const visitData = {
      id: sessionUser.id,
      date: new Date().toISOString(), // Utiliza a data e hora atual
    };

    // Verifica se já existe uma visita registrada do mesmo usuário visitando o perfil no mesmo dia
    const currentVisitDate = new Date(visitData.date);
    const visitExists = visitedUser.visitmyprofile?.some((visit: any) => {
      const visitDate = new Date(visit.date); // Converte a string ISO de volta para Date
      return (
        visit.id === sessionUser.id &&
        visitDate.toDateString() === currentVisitDate.toDateString() // Comparação por data
      );
    });

    // Se já existe uma visita registrada do mesmo usuário no mesmo dia, não registramos
    if (visitExists) {
      return res.status(200).send(''); // Retorna uma string vazia
    }

    // Adiciona a visita ao array de visitas do usuário visitado

    if (!visitmy ) {
      await usersCollection.updateOne(
        { id: visitedUserId },
        {
          $push: { visitmyprofile: visitData }, // Adiciona a visita no array
        }
      );
  
    }
  
    return res.status(200).send(''); // Retorna uma string vazia ou qualquer dado, como 'OK', sem conteúdo adicional

  } catch (error) {
    console.error('Erro ao registrar visita:', error);
    return res.status(500).json({ error: 'Erro ao registrar visita.' });
  }
};

const checkAuthWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  // Chama a função de registrar visita
  await registerVisit(req, res);
};

export default withSession(checkAuthWithSession);