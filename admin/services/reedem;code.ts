import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect, itemsCollection, reformsCollectionName } from '@/core/integration/connect';
   
export async function redeemCode (req: NextApiRequest, res: NextApiResponse) {
  const { client, db } = await dbConnect();

  if (req.method === 'POST') {
    const { userId, code } = req.body;

    try {
      // Verificar se o usuário é prime
      const userReform = await db.collection(reformsCollectionName).findOne({ userId });
      const isPrime = userReform?.prime || false;

      // Verificar se o código existe na coleção Codebitsresgate
      const codeEntry = await db.collection('Codebitsresgate').findOne({ code });

      // Verifica se o código foi encontrado
      if (!codeEntry) {
        return res.status(404).json({ message: 'Código não encontrado.' });
      }

      // Verifica se a validade do código ainda está ativa
      const currentTime = new Date();
      if (currentTime > codeEntry.expiresAt) {
        return res.status(400).json({ message: 'Este código expirou.' });
      }

      // Se o usuário não for prime, verifica o número de resgates
      if (!isPrime) {
        const userItem = await db.collection(itemsCollection).findOne({ id: userId });

        if (!userItem) {
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Garante que 'historyCodeBits' existe como um array
        const redemptionCount = (userItem.historyCodeBits || []).length;

        if (redemptionCount >= 2) {
          return res.status(400).json({ message: 'Usuários não Prime podem resgatar apenas 2 vezes.' });
        }
      }

      // Verifica se o código já foi utilizado pelo usuário
      if (codeEntry.usedBy.includes(userId)) {
        return res.status(400).json({ message: 'Você já utilizou este código.' });
      }

      // Determinar a quantia do bônus com base no status do usuário
      let bonusValue: number;

      if (isPrime) {
        // Usuário Prime: bônus entre 200 e 9000
        bonusValue = Math.floor(Math.random() * (9000 - 200 + 1)) + 200;
      } else {
        // Usuário Não Prime: bônus entre 0 e 200
        bonusValue = Math.floor(Math.random() * 201); // Bônus de 0 a 200
      }

      // Atualizar a quantidade de bits do usuário e registrar o histórico
      await db.collection(itemsCollection).updateOne(
        { id: userId },
        { 
          $inc: { bits: bonusValue },
          $push: {
            historyCodeBits: {
              code,
              bonus: bonusValue,
              date: new Date() // Data e hora do resgate
            }
          }
        },
        { upsert: true } // Garante que o documento seja criado se o usuário não existir
      );

      // Adicionar o userId à lista de usuários que utilizaram o código
      await db.collection('Codebitsresgate').updateOne(
        { code },
        { $push: { usedBy: userId } } // Adiciona o userId à lista de usuários que usaram o código
      );

      return res.status(200).json({ message: 'Código resgatado com sucesso!', newBits: bonusValue });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao resgatar o código.' });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
};

 

 
export async function getRedemptionHistory (req: NextApiRequest, res: NextApiResponse){
  const { client, db } = await dbConnect(); 

  if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({ message: 'User ID inválido' });
    }

    try {
      // Encontrar o item do usuário na coleção items
      const item = await db.collection(itemsCollection).findOne({ id: userId });

      if (!item) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Retornar o histórico de códigos resgatados
      const history = item.historyCodeBits || [];
      return res.status(200).json({ history });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar histórico de resgates.' });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
};

 