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
    const usersCollection = db.collection('users');
    const ticketsCollection = db.collection('tickets');

    const userRecord = await usersCollection.findOne({ id: sessionUser.id });
    if (!userRecord || !userRecord.team?.support) {
      return res.status(403).json({ 
        success: false, 
        message: 'Acesso negado. Usuário não é da equipe de suporte.' 
      });
    }

    if (req.method === 'GET') {
      let query = {};

      if (userRecord.team.type === 'finance') {
        query = { category: { $in: ['pagamentos', 'reembolso', 'financeiro'] } };
      } else if (userRecord.team.type === 'account') {
        query = { category: { $in: ['conta', 'denuncias'] } };
      } else if (userRecord.team.type === 'developer') {
        query = { category: 'bugs' };
      }

      const tickets = await ticketsCollection
        .find(query)
        .toArray();

      // Mapeamento de prioridade para valores numéricos para ordenação
      const priorityOrder: { [key: string]: number } = {
        'URGENTE': 1,
        'ALTA': 2,
        'MEDIA': 3,
        'BAIXA': 4
      };

      // Ordenar os tickets em memória após a busca
      tickets.sort((a, b) => {
        const priorityA = priorityOrder[a.priority] || 99; // 99 para prioridades não definidas
        const priorityB = priorityOrder[b.priority] || 99;

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        // Se as prioridades forem iguais, ordenar por createdAt (mais recente primeiro)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      return res.status(200).json({ success: true, tickets });
    }

    return res.status(405).json({ success: false, message: 'Método não permitido.' });
  } catch (error) {
    console.error('Erro na API admin de tickets:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const AdminTicketsAPI: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await handler(req, res);
};

export default withSession(AdminTicketsAPI);
