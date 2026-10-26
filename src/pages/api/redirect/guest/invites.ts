import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { dbConnect, GuestUser } from '@/core/integration/connect';

// Crie uma instância global do Socket.IO Server
const io = new SocketIOServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { UserId } = req.query;

    try {
      if (!UserId) {
        return res.status(400).json({ message: 'Parâmetro UserId ausente' });
      }

      const { db } = await dbConnect();
      const collection = db.collection(GuestUser);

      // Realiza a busca pelo UserId
      const result = await collection.findOne({ UserId: UserId });

      if (result) {
        // Emitir um evento 'userFound' para todos os clientes conectados
        io.emit('userFound', result);

        return res.status(200).json(result);
      } else {
        // Se result for null ou undefined, retornar um status 404 e uma mensagem
        // return res.status(404).json({ message: 'Usuário não possui convite' });
      }
    } catch (error) {
      // console.error(error);
      // return res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
}
