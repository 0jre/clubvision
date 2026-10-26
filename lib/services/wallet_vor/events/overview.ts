import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';
import { dbConnect } from "@/core/integration/connect";
import { Infocoinuser } from "@/types/user/coin.bank";
import { encrypt } from "@/core/security/encryption";


export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  const { db } = await dbConnect();

  const sessionUser = req.session?.get('user');
    // Verifique se o usuário está autenticado
    if (!req.session || !req.session.get('user')) {
      return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
    }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const usersCollection = db.collection('users');
  const userRecord = await usersCollection.findOne({ id: sessionUser.id });
     
  if (!userRecord) { return res.status(400).json({message: 'Usuario não encontrado!' }) }
   const { userId } = req.query;

   if (!(userRecord.id === userId || userRecord.type == 'ADMIN') ) {
    return res.status(400).json({message: 'Não é possivel acessar as informações do usuario!'})
   }
 
  if (!userId) {
    return res.status(400).json({ message: "ID do usuário não fornecido" });
  }

  try {
   
    // Coleção 'reforms' onde vamos verificar se 'prime' é true ou false
    const reformsCollection = db.collection("reforms");
    const reformEntry = await reformsCollection.findOne({ userId: userId });

    const isPrime = reformEntry?.prime ?? false;

    // Buscar na coleção 'items' o restante dos dados do usuário
    const itemsCollection = db.collection<Infocoinuser>("items");
     const usersettings = db.collection<any>("users");
    const userForm = await itemsCollection.findOne({ _id: userId });
    const user = await usersettings.findOne({ _id: userId  });
   const privacyMode = user.settings?.wallet?.privacyMode;

    const maskIfNeeded = (value: number) => !privacyMode ? value : null;

   
    if (userForm) {
     
      // Garantir que o campo transactions exista no documento
      let transactions = userForm.transactions || [];

      // Verifica se o array 'transactions' está vazio
      if (transactions.length === 0) {
       
        // Se estiver vazio, cria uma nova transação
        const currentDate = new Date();

        // Formatar a data no formato "dd/MM/yyyy"
        const today = currentDate.toLocaleDateString("pt-BR");

        // Formatar a hora no formato "HH:mm:ss"
        const time = currentDate.toLocaleTimeString("pt-BR", { hour12: false });

        // Cria a nova transação
        const transaction = {
          date: today, // Data no formato "07/01/2025"
          time: time,  // Hora no formato "11:07:52"
          timestamp: new Date(),
          amount: userForm.coins,
          action: "funds",
          currency: "coins",
          result: "success",
          newAmount: userForm.coins,
          resultStatus: "completed",
          uniqueId: `${today}-${userForm.coins}`, // Cria um ID único para o valor de 'coins' do dia
        };

      
        // Se o array transactions estiver vazio, cria um novo array com a transação
        transactions = [transaction];

        // Atualiza o documento com as transações
        const updateResult = await itemsCollection.updateOne(
          { _id: userId },
          { $set: { transactions: transactions } }
        );

    
        // Verificar se a atualização foi bem-sucedida
        if (updateResult.modifiedCount > 0) {
        
          const projectedLog = {
            _id: userForm._id.toString(),
    coins: maskIfNeeded(userForm.coins),
    bits: maskIfNeeded(userForm.bits),
    token: maskIfNeeded(userForm.token),
    banking: maskIfNeeded(userForm.banking),
            bitsOnStaking: userForm.bitsOnStaking,
            privacyMode: !!privacyMode,
            __v: userForm.__v,
            reputation: {
              received: userForm.reputation.received, 
              given: userForm.reputation.given,
            },
            daily: {
              streak: userForm.daily.streak,
              timestamp: userForm.daily.timestamp,
            },
            created_at: userForm.created_at,
            updated_at: userForm.updated_at,
            transactions: transactions, // Passa a nova transação
            staking: userForm.staking,
            stakingHistory: userForm.stakingHistory,
            prime: isPrime,
          };

          const nvxcrypted = encrypt(JSON.stringify(projectedLog));
          return res.status(200).json({ log: nvxcrypted });
        } else {
          console.error('Failed to update .');
          return res.status(500).json({ message: "Failed to register the transaction" });
        }
      } else {
     
        // Se já existe uma transação, não cria uma nova
        const projectedLog = {
          _id: userForm._id.toString(),
          coins: maskIfNeeded(userForm.coins),
    bits: maskIfNeeded(userForm.bits),
    token: maskIfNeeded(userForm.token),
    banking: maskIfNeeded(userForm.banking),
          bitsOnStaking: userForm.bitsOnStaking,
          privacyMode: !!privacyMode,
          __v: userForm.__v,
          reputation: {
            received: userForm.reputation.received,
            given: userForm.reputation.given,
          },
          daily: {
            streak: userForm.daily.streak,
            timestamp: userForm.daily.timestamp,
          },
          created_at: userForm.created_at,
          lock: userForm.lock,
          updated_at: userForm.updated_at,
          transactions: transactions, // Apenas retorna as transações existentes
          staking: userForm.staking,
          stakingHistory: userForm.stakingHistory,
          prime: isPrime,
        };

        const nvxcrypted = encrypt(JSON.stringify(projectedLog));
        return res.status(200).json({ log: nvxcrypted });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const OverviewWallet: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  // Use o await para chamar a função original checkAuth
  await checkAuth(req, res);
};

export default withSession(OverviewWallet);
