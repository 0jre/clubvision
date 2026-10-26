import type { NextApiResponse } from 'next';
import { dbConnect, getVortexorCompleteMetrics } from '@/core/integration/connect';
import { NextIronRequest, withSession } from '@/lib/session';

async function handler(req: NextIronRequest, res: NextApiResponse) {

    // Verificar se o usuário está autenticado e é admin
  const sessionUser = req.session?.get("user")
  if (!req.session || !sessionUser) {
    return res.status(401).json({ isAuthenticated: false, message: "Usuário não autenticado." })
  }

  const { db } = await dbConnect()
  const usersCollection = db.collection("users")
  const userRecord = await usersCollection.findOne({ id: sessionUser.id })

  const isAdmin = userRecord?.type === "ADMIN"
  if (!isAdmin) {
    return res.status(403).json({ message: "Acesso negado. Permissão de administrador necessária." })
  }

  try {
    const metrics = await getVortexorCompleteMetrics();
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter métricas do core', details: String(err) });
  }
} 


export default withSession(handler)
