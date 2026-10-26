import { dbConnect } from '@/core/integration/connect';
import { NextApiRequest, NextApiResponse } from 'next';

interface Transaction {
  date: string;
  time: string;
  bits?: number;
  timestamp: Date;
  amount?: number;
  action: string;
  status: string
  currency: string;
  item?: any;
}


// Função para verificar se o nome base já está registrado no banco de dados
const checkIfNameBaseExists = async (nameBase: string): Promise<boolean> => {
  const { db } = await dbConnect(); // Conectar ao banco de dados MongoDB
  const existingName = await db.collection("users").findOne({ name: { $regex: `^${nameBase}\.` } });
  return !!existingName; // Retorna true se o nome base já estiver registrado
};

// Função para verificar se o usuário tem bits suficientes
const checkUserBits = async (userId: string, costInBits: number): Promise<boolean> => {
  const { db } = await dbConnect(); // Conectar ao banco de dados MongoDB
  const user = await db.collection("items").findOne({ id: userId });

  return user !== null && user.bits >= costInBits; // Retorna true se o usuário tiver bits suficientes
};

// Função para deduzir bits do usuário
const deductUserBits = async (userId: string, costInBits: number) => {
  const { db } = await dbConnect(); // Conectar ao banco de dados MongoDB
  await db.collection("items").updateOne({ id: userId }, { $inc: { bits: -costInBits } });
};

// Função para enviar notificação
const sendNotification = async (userId: string, action: string, message: string) => {
  const { db } = await dbConnect();
  const notificationsCollection = db.collection('notifications');
  
  const notification = {
    userId,
    type: action,
    title: 'Notificação de Carteira',
    message,
    timestamp: new Date(),
  };
  await notificationsCollection.insertOne(notification);
};

// API handler
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { name, subdominio,userId, costInBits } = req.body;

    if (!name || !userId || costInBits === undefined) {
      return res.status(400).json({ error: 'Nome, ID de usuário ou custo em bits ausente' });
    }

    // Remover o domínio do nome (se existir)
    const nameBase = name.split('.')[0];

    // Verificar se o nome base já está registrado
    const isNameBaseTaken = await checkIfNameBaseExists(nameBase);
    if (isNameBaseTaken) {
      return res.status(400).json({ error: "Nome base já registrado com um domínio" });
    }

    // Verificar se o usuário tem bits suficientes
    const hasSufficientBits = await checkUserBits(userId, costInBits);
    if (!hasSufficientBits) {
      return res.status(400).json({ error: "Bits insuficientes" });
    }

    // Deduzir bits do usuário
    await deductUserBits(userId, costInBits);

    // Caso o nome base seja único e válido, registramos a transação ou atualização do usuário
    const { db } = await dbConnect();
    const userCollection = db.collection("users");

    // Registrar o nome para o usuário
    await userCollection.updateOne(
      { id: userId },
      { $set: { 
        name, 
        subdominio,
        discriminator: `${name}${subdominio}`
      } },
      { upsert: true }
    );

    // Enviar notificação de sucesso
    const notificationMessage = `Seu nome "${name}" foi registrado com sucesso.`;
      const timestamp = new Date();
        const transaction: Transaction = {
          date: timestamp.toLocaleDateString(),
          time: timestamp.toLocaleTimeString(),
          timestamp: new Date(),
          amount: costInBits,
          status: 'succeeded',
          action: 'registration',
          currency: `bits`,
          item: {
            identityVid: true,
            name,
            subdominio
          }
           
        };

        // Adiciona a transação ao array de transações
        await db.collection('items').updateOne(
          { id: userId },
          { $push: { transactions: transaction } }
        );
    await sendNotification(userId, 'registration', notificationMessage);

    return res.status(200).json({ success: true });
  } else {
    return res.status(405).json({ error: "Método não permitido" });
  }
};