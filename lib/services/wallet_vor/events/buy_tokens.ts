import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';
import { BigtoreList } from '@/data/recharge/complements';
import { BigboxList } from '@/data/recharge/box.vision';
import { rentables } from '@/types/clubstore/list.opencontainer';

interface UserItems {
  id: string;
  coins: number;
  bits: number;
  tokens?: number;
}

interface Transaction {
  date: string;
  time: string;
  action: string;
  bits?: number;
  amount?: number;
  currency: string;
   
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
 

export async function BuyTokens(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  const { userId, tokens } = req.body;

  if (
    typeof userId !== 'string' || userId.trim() === '' ||
    typeof tokens !== 'number' || tokens <= 0
  ) {
    return res.status(400).json({ success: false, message: 'Dados inválidos' });
  }

  try {
    const { db } = await dbConnect();
    const userItems = await db.collection('items').findOne<UserItems>({ id: userId });

    if (!userItems) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    const bitCostPerToken = 400; // Você pode ajustar esse valor conforme necessário
    const totalBitCost = tokens * bitCostPerToken;

    if (userItems.bits < totalBitCost) {
      return res.status(400).json({ success: false, message: 'Bits insuficientes para realizar a compra' });
    }

    await db.collection('items').updateOne(
      { id: userId },
      {
        $inc: {
          bits: -totalBitCost,
          token: tokens
        }
      }
    );

    const timestamp = new Date();
    const transaction: Transaction = {
      date: timestamp.toLocaleDateString(),
      time: timestamp.toLocaleTimeString(),
      bits: totalBitCost,
      action: 'purchase_tokens',
      status: 'succeeded',
      currency: 'bits',
      timestamp: new Date(),
    };

    await db.collection('items').updateOne(
      { id: userId },
      { $push: { transactions: transaction } }
    );

    const notification: Notification = {
      userId: userId,
      type: 'transaction',
      title: 'Compra de Tokens',
      message: `Você comprou ${tokens} V-Tokens por ${totalBitCost} bits.`,
      timestamp: new Date(),
    };

    await sendNotification(db, userId, notification);

    return res.status(200).json({ success: true, message: 'Tokens comprados com sucesso!' });
  } catch (error) {
    console.error('Erro ao comprar tokens:', error);
    return res.status(500).json({ success: false, message: 'Erro interno no servidor' });
  }
}

 

type Data = {
  success: boolean;
  message: string;
};

  
interface UserItems {
  prime: boolean;
  id: string;
  coins: number;
  bits: number;
  banking: number;
  purchasedItems: { [receive: string]: number };
}

interface UserReforms {
  userId: string;
  keymaster?: boolean;
  alladin?: boolean;
  contractmiss?: boolean;
  visiondrop?: boolean;
  contractcla?: boolean;
  keyplusinvite?: boolean;
  usedLimitInvite?: number;
  maxlimitinvite?: number;
  contractunix?: boolean;
  limitipost?: number;
  contractax?: boolean;
  contractvision?: boolean;
  socioclub?: boolean;
}

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

interface Notification {
  userId: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
}

   
export async function BuyMarket(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { userId, amount, bits, paymentMethod, receive, itemQuantity } = req.body;

    // Validação ajustada
    if (
      typeof userId !== 'string' ||
      userId.trim() === '' ||
      (amount !== undefined && typeof amount !== 'number') ||
      (paymentMethod !== 'orbs' && paymentMethod !== 'balance') ||
      typeof receive !== 'string' ||
      (itemQuantity !== undefined && (typeof itemQuantity !== 'number' || itemQuantity < 0))
    ) {
      return res.status(400).json({ success: false, message: 'Dados de entrada inválidos' });
    }
    
    try {
      const { db } = await dbConnect();
      const walletVisionCollection = db.collection('walletvision'); // Nova coleção para registro

      const userItems = await db.collection('items').findOne<UserItems>({ id: userId });
      const User = await db.collection('reforms').findOne<UserItems>({ userId: userId });
      if (!userItems) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
      }
      if (!User) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
      }

      if(!User.prime) {
         return  res.status(404).json({ success: false, message: 'você não possui assinatura Prime.' });
      }

      const isPrime = User.prime || false;

      if (receive === 'bits') {
        const bitPrice = isPrime ? 35 : 100; // Definindo o preço de orbs por bit
        const totalCost = bits * bitPrice; // Cálculo do custo total com base na quantidade de bits

        if (userItems.coins < totalCost) {
          return res.status(400).json({ success: false, message: 'Orbs insuficientes em sua carteira.' });
        }

        await db.collection('items').updateOne(
          { id: userId },
          { $inc: { coins: -totalCost, bits: bits } }
        );

        const timestamp = new Date();
        const transaction: Transaction = {
          date: timestamp.toLocaleDateString(),
          time: timestamp.toLocaleTimeString(),
          timestamp: new Date(),
          amount: totalCost,
          status: 'succeeded',
          action: 'purchase_bits',
          currency: `${paymentMethod == 'orbs' && 'coins'}`,
           
        };

        // Adiciona a transação ao array de transações
        await db.collection('items').updateOne(
          { id: userId },
          { $push: { transactions: transaction } }
        );

        const notification: Notification = {
          userId: userId,
          type: 'transaction',
          title: 'Compra de Bits Realizada',
          message: `Você comprou ${bits} Bits por ${totalCost} ${paymentMethod === 'orbs' ? 'ORBs' : 'saldo bancário'}.`,
          timestamp: new Date(),
        };
        await sendNotification(db, userId, notification);

        return res.status(200).json({ success: true, message: 'Compra de Bits realizada com sucesso' });

      } else {
          // Verificar se o item é da BigtoreList
          const storeItem = BigtoreList.find(item => item.receive === receive);

          // Verificar se o item é da BigboxList caso não esteja na BigtoreList
          const bigBoxItem = !storeItem ? BigboxList.find(item => item.receive === receive) : null;
  
          const selectedItem = storeItem || bigBoxItem; // Escolha o item válido
          
          // Caso não encontre o item ou o preço esteja incorreto, retorne erro
          if (!selectedItem || selectedItem.receive !== receive) {
            return res.status(400).json({ success: false, message: 'Item inválido ou preço incorreto.' });
          }
  
         const totalCost = selectedItem.price * (itemQuantity || 1)
  
          // Processamento do pagamento
          if (paymentMethod === 'orbs') {
            if (userItems.coins < totalCost) {
              return res.status(400).json({ success: false, message: 'Orbs insuficientes em sua carteira.' });
            }
            await db.collection('items').updateOne(
              { id: userId },
              { $inc: { coins: -totalCost } }
            );
          } else if (paymentMethod === 'balance') {
            if (userItems.banking < totalCost) {
              return res.status(400).json({ success: false, message: 'Saldo bancário insuficiente.' });
            }
            await db.collection('items').updateOne(
              { id: userId },
              { $inc: { banking: -totalCost } }
            );
          }
  
        const updatedPurchasedItems = { ...userItems.purchasedItems };
        updatedPurchasedItems[receive] = (updatedPurchasedItems[receive] || 0) + (itemQuantity || 1);

        // Removido a inicialização padrão do updateReforms
        const updateReforms: UserReforms = {
          userId: userId
        };
        
        switch (receive) {
          case 'keymaster':
            updateReforms.keymaster = true;
            break;
          case 'contractmiss':
            updateReforms.contractmiss = true;
            break;
          case 'visiondrop':
            updateReforms.visiondrop = true;
            break;
          case 'contractcla':
            updateReforms.contractcla = true;
            break;
            case 'limitinvite':
              // Define o valor de usedLimitInvite como 0
              db.collection('reforms').updateOne(
                  {  userId: userId  },
                  { $set: { usedLimitInvite: 0 } }
              );
              break;
           
          case 'keyplusinvite': 
          updateReforms.keyplusinvite = true; 
            break;
          case 'contractunix':
            updateReforms.contractunix = true;
            break;
            case 'limitipost':
              // Incrementa o valor de limitipost por 8
              db.collection('reforms').updateOne(
                  { userId: userId },
                  { $inc: { limitipost: 8 } }
              );
              break;
          
          case 'maxlimitinvite':
              // Incrementa o valor de maxlimitinvite por 120
              db.collection('reforms').updateOne(
                  { userId: userId },
                  { $inc: { maxlimitinvite: 120 } }
              );
              break;
          case 'contractax':
            updateReforms.contractax = true;
            break;
          case 'contractvision':
            updateReforms.contractvision = true;
            break;
            case 'contractsize':
              // Verificação adicional: usuário precisa estar na coleção 'cla'
              const claRecord = await db.collection('cla').findOne({ userId });
    
              if (!claRecord) {
                return res.status(403).json({
                  success: false,
                  message: 'Você não tem permissão para adquirir contractsize.',
                });
              }
    
              const updatedClanSize = itemQuantity || 0;
              await db.collection('cla').updateOne(
                { userId },
                { $set: { clanSize: updatedClanSize } },
                { upsert: true }
              );
              break;
        }
      
        if (rentables.includes(receive)) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 dias de aluguel

  await db.collection('inventory').updateOne(
    { userId },
    {
      $push: {
        rentedItems: {
          itemId: receive,
          acquiredAt: now,
          expiresAt,
          isActive: true,
          used: false
        }
      }
    },
    { upsert: true }
  );
}

        await db.collection('reforms').updateOne(
          { userId: userId },
          {
            $set: updateReforms
          },
          { upsert: true } // Adiciona o documento se não existir
        );

       
         
         // Atualização do inventário do usuário
         const updateInventoryResult = await db.collection('inventory').updateOne(
          { userId: userId },
          {
            $inc: { [receive]: itemQuantity || 1 }, // Incrementa a quantidade do item comprado no inventário
          },
          { upsert: true } // Cria o documento se ele não existir
        );

        if (updateInventoryResult.matchedCount === 0 && updateInventoryResult.upsertedCount === 0) {
          return res.status(500).json({ success: false, message: 'Erro ao atualizar o inventário do usuário.' });
        }
        
        const timestamp = new Date();
        const transaction: Transaction = {
          date: timestamp.toLocaleDateString(),
          time: timestamp.toLocaleTimeString(),
          timestamp: new Date(),
          amount: totalCost,
          action: `purchase_${receive}`,
          status: 'succeeded',
          currency: `${paymentMethod == 'orbs' && 'coins'}`,
          item: {
            name: selectedItem.title,
            quantity: itemQuantity || 1,
            description: selectedItem.description,
            receive: selectedItem.receive,
            image: selectedItem.image,
            price: selectedItem.price
          }
        };

        await db.collection('items').updateOne(
          { id: userId },
          { 
            $set: { purchasedItems: updatedPurchasedItems },
            $push: { transactions: transaction } // Adiciona a transação
          }
        );
        const notification: Notification = {
          userId: userId,
          type: 'transaction',
          title: 'Compra de Item Realizada',
          message: `Você comprou ${storeItem?.title} por ${totalCost} ${paymentMethod === 'orbs' ? 'ORBs' : 'saldo bancário'}.`,
          timestamp: new Date(),
        };
        await sendNotification(db, userId, notification);

          // Atualizar a coleção 'walletvision'
      await walletVisionCollection.updateOne(
        { endress: 'global_record' },
        {
          $inc: {
            totalstorepayment: totalCost,  // Incrementar o total de pagamentos
            totalpayment: 1,               // Incrementar o número de compras
          },
        },
        { upsert: true } // Cria o documento se não existir
      );
 
        return res.status(200).json({ success: true, message: 'Compra de item realizada com sucesso' });
      }
    } catch (error) {
      console.error('Erro ao processar a compra:', error);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }
}
