import { dbConnect } from '@/core/integration/connect';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

// Tipagem
export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

// Função para buscar o total de visualizações (rescue) e bits
async function getMonetizationData(userId: string, db: any): Promise<{ rescue: number, bits: number }> {
  const monetizationsCollection = db.collection('monetizations');
  const userMonetization = await monetizationsCollection.findOne({ userId });
  return {
    rescue: userMonetization?.rescue || 0, // Total de visualizações
    bits: userMonetization?.bits || 0, // Bits acumulados
  };
}

// Função para calcular os bits com base nas visualizações
function calculateBitsFromViews(totalViews: number): number {
  return Math.floor(totalViews / 1000) * 100; // 100 bits para cada 1000 visualizações
}

// Função para atualizar o campo `bits` na coleção `monetizations`
async function updateBitsInMonetizations(userId: string, totalViews: number, db: any): Promise<void> {
  const monetizationsCollection = db.collection('monetizations');

  // Calcular os bits com base no total de visualizações
  const calculatedBits = calculateBitsFromViews(totalViews);

  // Atualizar apenas o campo `bits` sem alterar `rescue`
  await monetizationsCollection.updateOne(
    { userId },
    { $set: { bits: calculatedBits } },
    { upsert: true } // Cria o documento se ele não existir
  );
}

// Função para calcular o total de visualizações baseado nos bits sacados
function calculateRescueFromBits(amount: number): number {
  return Math.floor(amount / 100) * 1000; // Cada 100 bits correspondem a 1000 visualizações
}

// Função para processar o saque
async function processWithdrawal(userId: string, amount: number, db: any): Promise<void> {
  const monetizationsCollection = db.collection('monetizations');
  const withdrawalHistoryCollection = db.collection('withdrawalHistory');

  // Registrar o saque no histórico com status "Pendente"
  const withdrawalRecord = await withdrawalHistoryCollection.insertOne({
    userId,
    amount,
    timestamp: new Date(),
    status: 'Pendente',
  });

  try {
    // Subtrair o valor resgatado do campo `bits`
    await monetizationsCollection.updateOne(
      { userId },
      { $inc: { bits: -amount } }
    );

    // Calcular o total de visualizações que corresponde aos bits sacados
    const viewsToDeduct = calculateRescueFromBits(amount);

    // Subtrair as visualizações correspondentes ao saque do campo `rescue`
    await monetizationsCollection.updateOne(
      { userId },
      { $inc: { rescue: -viewsToDeduct } }
    );

    // Atualizar o status do saque para "Concluído"
    await withdrawalHistoryCollection.updateOne(
      { _id: withdrawalRecord.insertedId },
      { $set: { status: 'Concluído' } }
    );
  } catch (error) {
    // Em caso de erro, atualizar o status do saque para "Falhou"
    await withdrawalHistoryCollection.updateOne(
      { _id: withdrawalRecord.insertedId },
      { $set: { status: 'Falhou' } }
    );
    throw error; // Relançar o erro para que ele seja tratado no nível superior
  }
}

// Função para buscar o histórico de saques
async function getWithdrawalHistory(userId: string, db: any): Promise<Array<{ amount: number, timestamp: string, status: string }>> {
  const withdrawalHistoryCollection = db.collection('withdrawalHistory');
  const history = await withdrawalHistoryCollection.find({ userId }).sort({ timestamp: -1 }).toArray();
  return history;
}

async function getAvailableRescue(userId: string, db: any): Promise<number> {
  const monetizationsCollection = db.collection('monetizations');
  const userMonetization = await monetizationsCollection.findOne({ userId });
  return userMonetization?.bits || 0;
}

// Endpoint para obter o saldo disponível, histórico de saques, e realizar o saque
const withdrawApi: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  if (!req.session || !req.session.get('user')) {
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }

  const userId = req.session.get('user').id;
  const { db } = await dbConnect();

  if (req.method === 'GET') {
    try {
      // Buscar o total de visualizações (rescue) e bits
      const { rescue, bits } = await getMonetizationData(userId, db);

      // Atualizar o campo `bits` com base no total de visualizações
      await updateBitsInMonetizations(userId, rescue, db);

      // Buscar o histórico atualizado
      const history = await getWithdrawalHistory(userId, db);
      const updatedRescue = await getAvailableRescue(userId, db);
 
      
    const reformsCollection = db.collection("reforms");
    const memberStatsCollection = db.collection("member-stats");
    const usersCollection = db.collection("users");

    const userReforms = await reformsCollection.findOne({ userId });
    
    const isAuthorized = userReforms?.type === "Authorized";
 
    const hasPremium =
      userReforms &&
      typeof userReforms.unic === "string" &&
      userReforms.unic.trim().startsWith("club_") &&
      Boolean(userReforms.selo) === true;

      if(userReforms?.unverifid == true ) {
        return res.status(400).json({ message: 'Você perdeu o selo de verificação de identidade. Analise o status de conta para mais detalhes..'});
      }

    const memberStats = await memberStatsCollection.findOne({ member_id: userId });
    const isLevel5OrAbove = memberStats?.level >= 10;
    const clubactivity = memberStats?.clubactivity >= 1000;
    const isverified = userReforms?.verified
    const user = await usersCollection.findOne({ id: userId });
    const firstLoginDate = user?.firstLoginDate ? new Date(user.firstLoginDate) : null;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const isOneMonthOrMore = firstLoginDate instanceof Date && firstLoginDate <= oneMonthAgo;

 // Verifica se todos os critérios são atendidos
 const isVerified = isAuthorized && hasPremium && isLevel5OrAbove && isOneMonthOrMore && isverified;

    const response = {
      isAuthorized,
      hasPremium,
      isLevel5OrAbove,
      isOneMonthOrMore,
      clubactivity,
      verified: isVerified,
      isverified: isverified,
    };


      res.status(200).json({ availableRescue: updatedRescue, history, verification: response });
     
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Erro ao buscar dados.' });
    }
  } else if (req.method === 'POST') {
    try {
      const { amount } = req.body;
      const itemsCollection = db.collection('items');
      // Buscar o saldo atual de bits
      const { bits } = await getMonetizationData(userId, db);

      if (bits < 1000) {
        return res.status(400).json({ message: 'Você precisa acumular pelo menos 1000 bits para realizar o saque.' });
      }

      if (amount > bits) {
        return res.status(400).json({ message: 'Saldo insuficiente para saque.' });
      }

      // Processar o saque
      await processWithdrawal(userId, amount, db);
      await itemsCollection.updateOne(
        { id: userId },
        { $inc: { bits: amount } }
      );
      // Buscar os dados atualizados após o saque
      const { rescue, bits: updatedBits } = await getMonetizationData(userId, db);
      const history = await getWithdrawalHistory(userId, db);

      res.status(200).json({
        message: 'Saque realizado com sucesso.',
        rescue,
        bits: updatedBits,
        history,

      });
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      res.status(500).json({ message: 'Erro ao processar saque.' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido.' });
  }
};

const Monetization: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await withdrawApi(req, res);
};

export default withSession(Monetization);
