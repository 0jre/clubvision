import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from "@/core/integration/connect";
import { encrypt } from '@/core/security/encryption';

export async function PlatformIsights(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();
      const usersCollection = db.collection('users');

      // Obter todos os usuários
      const allUsers = await usersCollection.find().toArray();

      if (allUsers.length === 0) {
        return res.status(404).json({ message: 'Nenhum usuário encontrado' });
      }

      // Contar o número de documentos na coleção 'users'
      const countUsers = allUsers.length;

      // Ordenar os usuários por data de último login
      allUsers.sort((a, b) => new Date(b.lastLoginDate).getTime() - new Date(a.lastLoginDate).getTime());

      // Obter o nome do último usuário registrado
      const lastUserName = allUsers[0].name;

      // Obter a data do último login
      const lastLoginDate = allUsers[0].lastLoginDate;

      // Obter o nome do primeiro usuário registrado
      const firstUserName = allUsers[allUsers.length - 1].name;

      // Obter a data do primeiro login
      const firstLoginDate = allUsers[allUsers.length - 1].firstLoginDate;

      // Responder com as estatísticas e os dados do log de login dos usuários
      const nvxcrypted = encrypt(JSON.stringify({ count: countUsers, firstUserName, firstLoginDate, lastUserName, lastLoginDate, log: allUsers }));
      res.status(200).json(nvxcrypted);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
