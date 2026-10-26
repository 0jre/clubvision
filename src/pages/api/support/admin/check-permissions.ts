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

    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, message: 'Método não permitido.' });
    }

    const { db } = await dbConnect();
    const usersCollection = db.collection('users');

    const userRecord = await usersCollection.findOne({ id: sessionUser.id });
    if (!userRecord) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    const isSupport = userRecord.team?.support || false;
    const supportType = userRecord.team?.type || null;

    const permissions = {
      isSupport,
      supportType,
      canManageFinance: supportType === 'finance' || supportType === 'general',
      canManageAccount: supportType === 'account' || supportType === 'general',
      canManageDeveloper: supportType === 'developer' || supportType === 'general',
      canManageAll: supportType === 'general'
    };

    return res.status(200).json({ 
      success: true, 
      permissions,
      user: {
        id: userRecord.id,
        name: userRecord.name,
        team: userRecord.team
      }
    });
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const CheckPermissionsAPI: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await handler(req, res);
};

export default withSession(CheckPermissionsAPI);
