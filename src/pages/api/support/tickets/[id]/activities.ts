import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronHandler } from '@/lib/session';
import { dbConnect } from '@/core/integration/connect';

export type NextIronRequestWithSession = NextApiRequest & { session?: any };

const handler: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  try {
    const sessionUser = req.session?.get('user');

    if (!sessionUser) {
      return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }

    const { id: ticketId } = req.query;

    if (!ticketId) {
      return res.status(400).json({ success: false, message: 'ID do ticket é obrigatório.' });
    }

    const { db } = await dbConnect();
    const ticketsCollection = db.collection('tickets');
    const usersCollection = db.collection('users');

    if (req.method === 'GET') {
      const ticket = await ticketsCollection.findOne({ ticketId: ticketId });
      
      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket não encontrado.' });
      }

      const userRecord = await usersCollection.findOne({ id: sessionUser.id });
      const canView = 
        ticket.userId === sessionUser.id ||  
        (userRecord?.team?.support && (  
          userRecord.team.type === 'general' ||
          (userRecord.team.type === 'finance' && ['pagamentos', 'reembolso', 'financeiro'].includes(ticket.category)) ||
          (userRecord.team.type === 'account' && ['conta', 'denuncias'].includes(ticket.category)) ||
          (userRecord.team.type === 'developer' && ticket.category === 'bugs')
        ));

      if (!canView) {
        return res.status(403).json({ success: false, message: 'Acesso negado.' });
      }

      return res.status(200).json({ 
        success: true, 
        ticket: {
          ...ticket,
          activities: ticket.activities || []
        }
      });
    }

    if (req.method === 'POST') {
      const { type, description, response } = req.body;

      if (!type || !description) {
        return res.status(400).json({ 
          success: false, 
          message: 'Tipo e descrição da atividade são obrigatórios.' 
        });
      }

      const ticket = await ticketsCollection.findOne({ ticketId: ticketId });
      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket não encontrado.' });
      }

      const userRecord = await usersCollection.findOne({ id: sessionUser.id });
      if (!userRecord) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
      }

      const canAddActivity = 
        ticket.userId === sessionUser.id || 
        userRecord.team?.support; 

      if (!canAddActivity) {
        return res.status(403).json({ success: false, message: 'Acesso negado.' });
      }

      const newActivity: any = {
        type,
        description,
        createdAt: new Date(),
        userId: sessionUser.id,
        userName: userRecord.name,
        isSupport: !!userRecord.team?.support,
        supportType: userRecord.team?.type || null
      };

      if (response) {
        newActivity.response = response;
      }

      const updateFields: any = {
        $set: {
          updatedAt: new Date()
        },
        $push: { activities: newActivity }
      };

      if (type === 'USER_RESPONSE' && ticket.userId === sessionUser.id) {
        updateFields.$set.status = 'AGUARDANDO';
      } else if (type === 'SUPPORT_RESPONSE' && userRecord.team?.support) {
        updateFields.$set.status = 'RESPONDIDO';
        updateFields.$set.lastResponse = response || description;
        updateFields.$set.lastResponseAt = new Date();
      }

      const result = await ticketsCollection.updateOne(
        { ticketId: ticketId },
        updateFields
      );

      if (result.modifiedCount > 0) {
        return res.status(201).json({ 
          success: true, 
          message: 'Atividade adicionada com sucesso!',
          activity: newActivity
        });
      } else {
        return res.status(500).json({ success: false, message: 'Erro ao adicionar atividade.' });
      }
    }

    return res.status(405).json({ success: false, message: 'Método não permitido.' });
  } catch (error) {
    console.error('Erro na API de atividades:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const TicketActivitiesAPI: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await handler(req, res);
};

export default withSession(TicketActivitiesAPI);
