import type { NextApiRequest, NextApiResponse } from 'next';
import { Db } from 'mongodb';
import { dbConnect, InformationsUsers, itemsCollection } from '@/core/integration/connect';
import { sendDiscordMessage } from "@/lib/services/mox/mailer";
import {  FEE_RECEIVER_ID,NETWORK_COST,TRANSFER_FEE_RATE } from '@/lib/services/vpower/src/calc_tax';
import { calculateAfterTax, roundToTwoDecimals } from '@/lib/services/vpower/src/calculateAfterTax';

 
// Função para formatar valores em dólares
const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Função para registrar transações
const recordTransaction = async (db: Db, userId: string, transaction: any) => {
  const collection = db.collection("items");
  await collection.updateOne(
    { id: userId },
    { $push: { transactions: transaction } }
  );
};

// Função para registrar transferências na coleção walletvision
const logGlobalTransfer = async (db: Db, amount: number, transferFee: number, finalAmount: number, senderId: string, receiverId: string) => {
  const timestamp = new Date();
  const transferDetails = {
    senderId,
    receiverId,
    amount,
    transferFee,
    finalAmount,
    timestamp,
  };

  // Atualiza ou insere o documento na coleção walletvision
  await db.collection("walletvision").updateOne(
    { endress: "global_record" }, // Filtro vazio para atualizar o primeiro documento encontrado
    {
      $inc: {
        totaltransferamount: finalAmount,
        totaltransference: 1
      },
      $push: {
        transactions: transferDetails
      }
    },
    { upsert: true } // Cria um novo documento se não existir
  );
};

// Função para buscar o nome do usuário
const getUserName = async (db: Db, userId: string): Promise<string> => {
  const user = await db.collection(InformationsUsers).findOne({ id: userId });
  return user ? user.name : 'Usuário Desconhecido';
};

// Função para verificar se o usuário possui contractax: true
const hasContractax = async (db: Db, userId: string): Promise<boolean> => {
  const user = await db.collection('reforms').findOne({ userId, contractax: true });
  return user !== null;
};

export async function  WalletTransfer (req: NextApiRequest, res: NextApiResponse){
  if (req.method === 'POST') {
    const { senderid, receiverId, amount, type } = req.body;

    if (!senderid || !receiverId || !amount || amount <= 0 || !type) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios e a quantidade deve ser positiva.' });
    }

    // Verifique se o remetente e o destinatário são diferentes
    if (senderid === receiverId) {
      return res.status(400).json({ message: 'Você não pode enviar valores para si mesmo.' });
    }

    try {
      const { db } = await dbConnect();
      const oitemsCollection = db.collection(itemsCollection);
      const notificationsCollection = db.collection("notifications");

      // Verifique se os usuários existem
      const sender = await db.collection(InformationsUsers).findOne({ id: senderid });
      const receiver = await db.collection(InformationsUsers).findOne({ id: receiverId });

      if (!sender || !receiver) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      // Verifique o saldo do sender no itemsCollection
      const senderBalance = await oitemsCollection.findOne({ id: senderid });
      if (!senderBalance || (type === 'bits' && senderBalance.bits < amount) || (type === 'orbit' && senderBalance.coins < amount)) {
        return res.status(400).json({ message: 'Saldo insuficiente.' });
      }

      // Verifique se o remetente possui contractax: true
      const isContractax = await hasContractax(db, senderid);

      // Defina a taxa de transferência com base no status de contractax
      const transferFeeRate = isContractax ? 0 : TRANSFER_FEE_RATE;

      let amountAfterFee = 0;
      let transferFee = 0;

      if (type === 'bits') {
        // Se for transferência de bits, não há taxa
        amountAfterFee = amount;
      } else if (type === 'orbit') {
        // Se for transferência de orbit, calcular a taxa
        transferFee = roundToTwoDecimals(amount * transferFeeRate);
        amountAfterFee = calculateAfterTax(amount, transferFeeRate, NETWORK_COST);
      }

      // Realize a transferência dependendo do tipo
      if (type === 'bits') {
        await oitemsCollection.updateOne({ id: senderid }, { $inc: { bits: -amount } });
        await oitemsCollection.updateOne({ id: receiverId }, { $inc: { bits: amountAfterFee } });
      } else {
        await oitemsCollection.updateOne({ id: senderid }, { $inc: { coins: -amount } });
        await oitemsCollection.updateOne({ id: receiverId }, { $inc: { coins: amountAfterFee } });
        
        // Enviar a taxa para o FEE_RECEIVER_ID
        await oitemsCollection.updateOne({ id: FEE_RECEIVER_ID }, { $inc: { coins: transferFee } });
      }

      // Registrar a transação para sender
      const timestamp = new Date();
      const senderTransaction = {
        date: timestamp.toLocaleDateString(),
        time: timestamp.toLocaleTimeString(),
        timestamp: new Date(),
        amount: amount,
        newAmount: -amount,
        action: 'senttransfer',
        currency: type === 'bits' ? 'bits' : 'coins',
        fees: amountAfterFee,
        contract: isContractax,
        status: 'succeeded',
        transfer:{
          to: {
            vid: sender.vid,
          },
          from:{
            vid: receiver.vid,
          }
        }
      };
      await recordTransaction(db, senderid, senderTransaction);

      // Registrar a transação para receiver
      const receiverTransaction = {
        date: timestamp.toLocaleDateString(),
        time: timestamp.toLocaleTimeString(),
        timestamp: new Date(),
        amount: amountAfterFee,
        currency: type === 'bits' ? 'bits' : 'coins',
        action: 'receivetransfer',
        fees: amountAfterFee,
        status: 'succeeded',
        transfer:{
          from: {
            vid: sender.vid,
          },
          to:{
            vid: receiver.vid,
          }
        }
      };
      await recordTransaction(db, receiverId, receiverTransaction);

      // Logar a transferência globalmente
      await logGlobalTransfer(db, amount, transferFee, amountAfterFee, senderid, receiverId);

      // Buscar nomes dos usuários
      const senderName = await getUserName(db, senderid);
      const receiverName = await getUserName(db, receiverId);

      // Registrar a notificação para sender e receiver
      const senderNotification = {
        userId: senderid,
        type: 'transfer',
        title: 'Notificação de Transferência',
        message: `Você transferiu ${formatCurrency(amountAfterFee)} ${type.toUpperCase()} para o usuário ${receiverName}.`,
        timestamp: new Date(),
      };
      await notificationsCollection.insertOne(senderNotification);

      const receiverNotification = {
        userId: receiverId,
        type: 'transfer',
        title: 'Notificação de Transferência',
        message: `Você recebeu ${formatCurrency(amountAfterFee)} ${type.toUpperCase()} do usuário ${senderName}.`,
        timestamp: new Date(),
      };
      await notificationsCollection.insertOne(receiverNotification);

      // Enviar mensagem no Discord
      await sendDiscordMessage(senderid, `Você transferiu ${formatCurrency(amountAfterFee)} ${type.toUpperCase()} para o usuário ${receiverName}.`);
      await sendDiscordMessage(receiverId, `Você recebeu ${formatCurrency(amountAfterFee)} ${type.toUpperCase()} do usuário ${senderName}.`);

      res.status(200).json({ message: 'Transferência realizada com sucesso.' });
    } catch (error) {
      console.error('Erro ao processar a transferência:', error);
      res.status(500).json({ message: 'Erro ao processar a transferência.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido.`);
  }
};

 