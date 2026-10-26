import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';
import validators from '@/lib/services/staking/validator/validators';

// Tempo mínimo de espera em milissegundos (3 dias)
const UNLOCK_PERIOD_MS = 3 * 24 * 60 * 60 * 1000; // 3 dias em milissegundos

// Taxa de finalização do staking (ex: 5% como taxa de retirada)
const WITHDRAWAL_FEE_PERCENTAGE = 5; // Percentual


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


// Função para verificar se o staking pode ser finalizado
const canFinalizeStaking = (startDate: Date) => {
  const now = new Date().getTime();
  const stakingStart = new Date(startDate).getTime();
  const canFinalize = now - stakingStart >= UNLOCK_PERIOD_MS;

  console.log(`Can finalize staking? ${canFinalize}`); // Log para verificar se o staking pode ser finalizado
  return canFinalize;
};

// Função para realizar a finalização do staking
const finalizeStaking = async (db: any, userId: string) => {
  const itemsCollection = db.collection('items');
  console.log(`Buscando usuário: ${userId}`);
  
  const userItem = await itemsCollection.findOne({ id: userId });
  console.log('Stakings do usuário:', userItem?.staking); // Log dos stakings

  if (!userItem || !userItem.staking) {
    return { success: false, message: 'Staking não encontrado.' };
  }

  // Busca o staking ativo
  const userStaking = userItem.staking.find((s: { lock: boolean }) => s.lock === false);


  if (!userStaking) {
    return { success: false, message: 'Nenhum staking ativo encontrado.' };
  }

  // Verifica se o staking pode ser finalizado com base na data de início
  if (!canFinalizeStaking(userStaking.startTime)) {
    return { success: false, message: 'O staking ainda não pode ser finalizado. Aguarde o tempo necessário.' };
  }

  const totalAmount = userStaking.amount; // Valor principal
  const validator = validators.find(v => v.validatorId === userStaking.validatorId);

  if (!validator) {
    return { success: false, message: 'Validador não encontrado.' };
  }

  const bitsReceived = totalAmount ; // Total a ser adicionado aos coins

  // Calcula a taxa de retirada
  const withdrawalFee = (bitsReceived * WITHDRAWAL_FEE_PERCENTAGE) / 100;
  const finalAmount = bitsReceived - withdrawalFee; // Montante final após a taxa


    const timestamp = new Date();
    const transaction: Transaction = {
      date: timestamp.toLocaleDateString(),
      time: timestamp.toLocaleTimeString(),
      amount: finalAmount,
      action: 'staking_orbs',
      status: 'succeeded',
      currency: 'coins',
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
      title: 'Recebeu de Orbit',
      message: `Você resgatou ${finalAmount} Orbit em staking vision.`,
      timestamp: new Date(),
    };

    await sendNotification(db, userId, notification);

  // Atualiza o registro do usuário: remove o staking e adiciona o valor aos coins
  await itemsCollection.updateOne(
    { id: userId },
    {
      $pull: { staking: { validatorId: userStaking.validatorId, lock: false } }, // Remove o staking
      $inc: { coins: finalAmount }, // Adiciona o valor resgatado aos coins e as recompensas
    }
  );

  return { success: true, bitsReceived: finalAmount, withdrawalFee }; // Retorna o valor final e a taxa
};

// Handler da API de Finalização de Staking
export async function FinalizeService(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'ID do usuário não fornecido.' });
  }

  try {
    const { db } = await dbConnect();
    const result = await finalizeStaking(db, userId);

    if (result.success) {
      return res.status(200).json({
        message: `Staking finalizado! Taxa de retirada: ${result.withdrawalFee}.`,
      });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error: any) {
    // console.error('Erro ao finalizar staking:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
}
