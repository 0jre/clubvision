import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';

function isSameDay(dateA: Date, dateB: Date) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const { hexId } = req.query;

  if (!hexId) {
    return res.status(400).json({ message: 'Parâmetro "hexId" é obrigatório.' });
  }

  try {
    const { db } = await dbConnect();

    const steamUser = await db.collection('steam').findOne({ hexid: `steam:${hexId}` });
    if (!steamUser) {
      return res.status(404).json({ message: 'Usuário não encontrado na coleção steam.' });
    }

    const userId = steamUser.userId;

    const reformUser = await db.collection('reforms').findOne({ userId });
    if (!reformUser || reformUser.type !== 'Authorized') {
      return res.status(403).json({ message: 'Usuário não autorizado.' });
    }

    const reformUserX = await db.collection('items').findOne({ _id: userId });
    if (!reformUserX) {
      return res.status(403).json({ message: 'Usuário não encontrado.' });
    }

    const userData = await db.collection('users').findOne({ id: userId });
    if (!userData) {
      return res.status(404).json({ message: 'Usuário não encontrado na coleção users.' });
    }

    // Buscar a sessão mais recente do mesmo dia
    const today = new Date();
    let todaySession: any = null;

    for (const player of userData.player || []) {
      const sessionsHoje = player.session
        ?.filter((session: any) => isSameDay(new Date(session.date), today))
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

      if (sessionsHoje?.length > 0 && !todaySession) {
        todaySession = sessionsHoje[0]; // pega a mais recente do dia
      }
    }

    if (!todaySession) {
      return res.status(403).json({ message: 'Usuário ainda não iniciou nenhuma sessão hoje.' });
    }

    // Sessão do dia encontrada, permite compartilhar
    return res.status(200).json({
      success: true,
      userId,
      name: userData.name,
      avatar: userData.avatar,
      discriminator: userData.discriminator,
      subdominio: userData.subdominio,
      bannerfundo: reformUser.bannerfundo,
      prime: reformUser.prime,
      verified: reformUser.verified,
      bits: reformUserX.bits,
      authorized: reformUser.type === 'Authorized',
      typeprime: reformUser.typeprime,
    });

  } catch (error: any) {
    console.error('Erro ao buscar registros:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
}
