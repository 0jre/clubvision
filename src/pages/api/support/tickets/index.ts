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

    const { db } = await dbConnect();
    const ticketsCollection = db.collection('tickets');
    const usersCollection = db.collection('users');
   const userInfo = db.collection('reforms');

    if (req.method === 'GET') {
      // Buscar tickets do usuário
      const tickets = await ticketsCollection
        .find({ userId: sessionUser.id })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json({ success: true, tickets });
    }

    if (req.method === 'POST') {
      // Desestruturar todos os campos enviados pelo frontend, incluindo os novos
      const { 
        category, 
        subject, 
        description, 
        priority = 'MEDIA', // Valor padrão para prioridade
        deviceInfo,
        browserInfo,
        errorMessage,
        stepsToReproduce,
        expectedBehavior,
        actualBehavior,
        userAgent,
        screenResolution,
        operatingSystem,
        additionalInfo,
        attachments // Incluir attachments
      } = req.body;

      if (!category || !subject || !description) {
        return res.status(400).json({ 
          success: false, 
          message: 'Categoria, assunto e descrição são obrigatórios.' 
        });
      }

      // Buscar dados do usuário
      const userRecord = await usersCollection.findOne({ id: sessionUser.id });
      const userInfox = await userInfo.findOne({ userId: sessionUser.id });
       
      if (!userRecord || !userInfox) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
      }

      // Gerar ID único do ticket
      const ticketId = `TK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      const newTicket = {
        ticketId,
        userId: sessionUser.id,
        userName: `${userInfox.firstname} ${userInfox.lastname}`,
        category,
        subject,
        description,
        priority,
        status: 'PENDENTE',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Adicionar todos os novos campos aqui
        deviceInfo: deviceInfo || null,
        browserInfo: browserInfo || null,
        errorMessage: errorMessage || null,
        stepsToReproduce: stepsToReproduce || null,
        expectedBehavior: expectedBehavior || null,
        actualBehavior: actualBehavior || null,
        userAgent: userAgent || null,
        screenResolution: screenResolution || null,
        operatingSystem: operatingSystem || null,
        additionalInfo: additionalInfo || null,
        attachments: attachments || [], // Garantir que attachments seja um array
        activities: [{
          type: 'CREATED',
          description: 'Ticket criado pelo usuário',
          createdAt: new Date(),
          userId: sessionUser.id,
          userName: userRecord.name
        }]
      };

      const result = await ticketsCollection.insertOne(newTicket);

      if (result.insertedId) {
        return res.status(201).json({ 
          success: true, 
          message: 'Ticket criado com sucesso!',
          ticketId: newTicket.ticketId
        });
      } else {
        return res.status(500).json({ success: false, message: 'Erro ao criar ticket.' });
      }
    }

    return res.status(405).json({ success: false, message: 'Método não permitido.' });
  } catch (error) {
    console.error('Erro na API de tickets:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const TicketsAPI: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await handler(req, res);
};

export default withSession(TicketsAPI);
