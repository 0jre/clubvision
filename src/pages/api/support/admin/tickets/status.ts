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

    if (req.method !== 'PUT') {
      return res.status(405).json({ success: false, message: 'Método não permitido.' });
    }

    const { db } = await dbConnect();
    const usersCollection = db.collection('users');
    const ticketsCollection = db.collection('tickets');

    const userRecord = await usersCollection.findOne({ id: sessionUser.id });
    if (!userRecord || !userRecord.team?.support) {
      return res.status(403).json({ 
        success: false, 
        message: 'Acesso negado. Usuário não é da equipe de suporte.' 
      });
    }

    const { ticketId, status, response } = req.body;

    if (!ticketId || !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID do ticket e status são obrigatórios.' 
      });
    }

    const validStatuses = ['PENDENTE', 'ACEITO', 'REJEITADO', 'AGUARDANDO', 'RESPONDIDO', 'FECHADO'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status inválido.' 
      });
    }

    const ticket = await ticketsCollection.findOne({ ticketId: ticketId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket não encontrado.' });
    }

    const canManage = 
      userRecord.team.type === 'general' ||
      (userRecord.team.type === 'finance' && ['pagamentos', 'reembolso', 'financeiro'].includes(ticket.category)) ||
      (userRecord.team.type === 'account' && ['conta', 'denuncias'].includes(ticket.category)) ||
      (userRecord.team.type === 'developer' && ticket.category === 'bugs');

    if (!canManage) {
      return res.status(403).json({ 
        success: false, 
        message: 'Você não tem permissão para gerenciar este ticket.' 
      });
    }

    const activity: any = {
      type: 'STATUS_CHANGED',
      description: `Status alterado de ${ticket.status} para ${status}`,
      oldStatus: ticket.status,
      newStatus: status,
      createdAt: new Date(),
      userId: sessionUser.id,
      userName: userRecord.name,
      supportType: userRecord.team.type
    };

    const updateFields: any = {
      $set: {
        status: status,
        updatedAt: new Date(),
        assignedTo: sessionUser.id,
        assignedToName: userRecord.name,
      },
      $push: { activities: activity }
    };

    if (response) {
      activity.response = response;
      activity.type = 'RESPONSE_ADDED';
      activity.description = 'Resposta adicionada pela equipe de suporte';
      updateFields.$set.lastResponse = response;
      updateFields.$set.lastResponseAt = new Date();
    }

    const result = await ticketsCollection.updateOne(
      { ticketId: ticketId },
      updateFields
    );

    if (result.modifiedCount > 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'Status do ticket atualizado com sucesso!' 
      });
    } else {
      return res.status(500).json({ success: false, message: 'Erro ao atualizar ticket.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar status do ticket:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const UpdateTicketStatusAPI: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await handler(req, res);
};

export default withSession(UpdateTicketStatusAPI);
