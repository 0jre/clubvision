import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  try {
    const { db } = await dbConnect();
    const usersCollection = db.collection('reforms');

    if (method === 'POST') {
      const { userId, type, value } = req.body;

      if (!userId || !type || !value) {
        return res.status(400).json({ error: 'userId, type e value são obrigatórios' });
      }

      if (type !== 'icone' && type !== 'bg') {
        return res.status(400).json({ error: 'type deve ser "icone" ou "bg"' });
      }

      // Verificar se o usuário é prime
      const user = await usersCollection.findOne({ userId });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      if (!user.prime) {
        return res.status(403).json({ error: 'Apenas usuários prime podem fazer alterações' });
      }

      const fieldToUpdate = type === 'icone' ? 'IconeGlobal' : 'Backgroundtheme';

      const result = await usersCollection.updateOne(
        { userId },
        { $set: { [fieldToUpdate]: value } },
        { upsert: true }
      );

      if (result.modifiedCount === 1 || result.upsertedCount === 1) {
        return res.status(200).json({ message: `${type} atualizado com sucesso!` });
      } else {
        return res.status(400).json({ error: `Erro ao atualizar o ${type}.` });
      }
    }

    if (method === 'GET') {
      const { userId, type } = req.query;
  
      if (!userId || typeof userId !== 'string' || !type || typeof type !== 'string') {
        return res.status(400).json({ error: 'Parâmetros userId e type são obrigatórios' });
      }

      if (type !== 'icone' && type !== 'bg') {
        return res.status(400).json({ error: 'type deve ser "icone" ou "bg"' });
      }

      const user = await usersCollection.findOne({ userId });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const fieldToReturn = type === 'icone' ? 'IconeGlobal' : 'Backgroundtheme';

      const data = user[fieldToReturn] || null;

      if (!data) {
        return res.status(404).json({ error: `${type} não encontrado para o usuário` });
      }

      return res.status(200).json({ value: data });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Método ${method} não permitido`);
  } catch (error) {
    console.error('Erro na API de tema:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
