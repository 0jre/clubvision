import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';
import { sendDiscordMessage } from "@/lib/services/mox/mailer"; // Função para enviar mensagens no Discord


interface Transaction {
  date: string;
  time: string;
  action: string;
  bits?: number;
  amount?: number;
  currency: string;
  timestamp: Date;
   status: string;
   staking: boolean
}

interface Notification {
  userId: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
}

const sendNotification = async (db: any, userId: string, notification: Notification) => {
  const collection = db.collection("notifications");
  await collection.insertOne(notification);
};

  
export async function RewardStaking(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { userId, amount } = req.body;

  // Validações de entrada
  if (!userId || amount == null) {
    return res.status(400).json({ message: 'Dados insuficientes para resgatar recompensas.' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'A quantidade a ser resgatada deve ser um número positivo.' });
  }

  try {
    const { db } = await dbConnect();

    // Busca um documento na coleção 'items' pelo userId
    const item = await db.collection('items').findOne({ id: userId });

    if (!item) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Obter o valor atual de bitsOnStaking
    const currentBitsOnStaking = item.bitsOnStaking || 0;

    // Verificar se o valor a ser resgatado é menor ou igual ao bitsOnStaking
    if (amount > currentBitsOnStaking) {
      return res.status(400).json({ message: 'Saldo insuficiente para resgatar recompensas.' });
    }

    // Atualiza o registro do usuário com os novos valores
    await db.collection('items').updateOne(
      { id: userId },
      { 
        $inc: { bitsOnStaking: -amount, bits: amount }, // Reduz o bitsOnStaking e aumenta o bits
      }
    );

   const notificationMessage = `Você resgatou ${amount} bits em recompensas!`;
   
    const timestamp = new Date();
    const transaction: Transaction = {
      date: timestamp.toLocaleDateString(),
      time: timestamp.toLocaleTimeString(),
      bits: amount,
      action: 'receive_bits',
      status: 'succeeded',
      currency: 'bits',
      staking: true,
      timestamp: new Date(),
    };

    await db.collection('items').updateOne(
      { id: userId },
      { $push: { transactions: transaction } }
    );

    const notification: Notification = {
      userId: userId,
      type: 'transaction',
      title: 'Recebeu de Bits',
      message: notificationMessage,
      timestamp: new Date(),
    };

    await sendNotification(db, userId, notification);

  
    await sendDiscordMessage(userId, notificationMessage);

    return res.status(200).json({ message: 'Resgate realizado com sucesso!' });
  } catch (error: any) {
    // console.error('Erro ao processar o resgate:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
}
