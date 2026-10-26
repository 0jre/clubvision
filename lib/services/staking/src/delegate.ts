import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';
import { performDelegation } from '@/lib/services/staking/native/staking';
import validators from '@/lib/services/staking/validator/validators';  
import { sendDiscordMessage } from "@/lib/services/mox/mailer"; 

interface Transaction {
  date: string;
  time: string;
  bits?: number;
  amount?: number;
  action: string;
  currency: string;
   timestamp: Date
}

// Função para registrar notificações
const recordNotification = async (db: any, userId: any, message: any) => {
  const notificationsCollection = db.collection("notifications");
  const notification = {
    userId,
    type: 'staking',
    title: 'Notificação de Staking',
    message,
    timestamp: new Date(),
  };
  await notificationsCollection.insertOne(notification);
};

// Função para adicionar um novo validador
const addValidator = async (db: any, validatorData: any) => {
  const existingValidator = await db.collection('validators').findOne({ validatorId: validatorData.validatorId });
  if (!existingValidator) {
    await db.collection('validators').insertOne(validatorData);
  }
};

export  async function DelegateStaking(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { userId, coinsToStake, validatorId, interval } = req.body;

  // Validações de entrada
  if (!userId || !coinsToStake || !validatorId) {
    return res.status(400).json({ message: 'Dados insuficientes para delegar.' });
  }

  if (typeof coinsToStake !== 'number' || coinsToStake <= 0) {
    return res.status(400).json({ message: 'A quantidade de coins deve ser um número positivo.' });
  }

  const validValidatorIds = validators.map(v => v.validatorId);
  if (!validValidatorIds.includes(validatorId)) {
    // Se o validador não existir, tentamos criar um novo
    const newValidatorData = {
      validatorId,
      name: `Validador ${validatorId}`, // Nome padrão ou definido
      performance: 0, // Define uma performance padrão para o novo validador
      rewardRate: 1, // Taxa de recompensa padrão
      minStake: 10000, // Mínimo de staking
      timeStaked: 0, // Tempo de staking inicial
      isActive: true, // Novo validador ativo por padrão
    };

    try {
      const { db } = await dbConnect();
      await addValidator(db, newValidatorData); // Adiciona o novo validador ao banco de dados
    } catch (error: any) {
      console.error('Erro ao adicionar o novo validador:', error);
      return res.status(500).json({ message: 'Erro ao adicionar validador.', error: error.message });
    }
  }

  try {
    const { db } = await dbConnect();
    const result = await performDelegation(db, userId, coinsToStake, validatorId);

    if (result.success) {
      const notificationMessage = `Você delegou com sucesso ${coinsToStake} Orbits para o processo de staking. Agora, seus Orbits estão trabalhando para gerar recompensas em bits.`;

      await recordNotification(db, userId, notificationMessage);
      await sendDiscordMessage(userId, notificationMessage);

      const timestamp = new Date();
      const transaction: Transaction = {
        date: timestamp.toLocaleDateString(),
        time: timestamp.toLocaleTimeString(),
         timestamp: new Date(),
        amount: coinsToStake,
        action: `staking_orbs`,
        currency: `coins`,
      };
  
  
      await db.collection('items').updateOne(
        {  id: userId },
        { 
          $push: { transactions: transaction } // Adiciona a transação
        }
      );
      
    
      return res.status(200).json({ message: result.message });
    }

    

    return res.status(400).json({ message: result.message }); // Retorna mensagem de erro se a delegação falhar
    
  } catch (error: any) {
    console.error('Erro ao processar a delegação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
}
