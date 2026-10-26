import { dbConnect } from "@/core/integration/connect";
import { NextApiRequest, NextApiResponse } from "next";
import { sendDiscordMessage } from "@/lib/services/mox/mailer";
import { encrypt } from "@/core/security/encryption";

const COLLECTION_NAME = "cla";
const USER_COLLECTION_NAME = "items";
const REFORMS_COLLECTION_NAME = "reforms"; // Nome da coleção onde está o contrato
const NOTIFICATIONS_COLLECTION_NAME = "notifications";
const MEMBER_STATS_COLLECTION_NAME = "member-stats"; // Nome da coleção de stats do usuário
const CLAN_CREATION_COST = 12500;
const CLAN_CREATION_XP = 400; // XP ganho por criar um clã


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "PUT") {
    try {
      const { userId, LogoCla, FaixaCla } = req.body;

      if (!userId || (!LogoCla && !FaixaCla)) {
        return res.status(400).json({ error: "Dados insuficientes fornecidos." });
      }

      const { db } = await dbConnect();
      const collection = db.collection(COLLECTION_NAME);

      // Define explicitamente o tipo para evitar erros
      const updateFields: { [key: string]: any } = {};
      if (LogoCla) updateFields.LogoCla = LogoCla;
      if (FaixaCla) updateFields.FaixaCla = FaixaCla;

      const result = await collection.updateOne(
        { userId },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Registro não encontrado." });
      }

      return res.status(200).json({ message: "Registro atualizado com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar o registro:", error);
      return res.status(500).json({ error: "Erro ao atualizar o registro." });
    }
  }
  
  if (req.method === "POST") {
    try {
      const formData = req.body;
      const { userId, namecla, Instagram, Twitter, Discord, Youtube, Tiktok, BioLi, Character, Clasigla } = formData;

      const { db } = await dbConnect();
      const collection = db.collection(COLLECTION_NAME);
      const userCollection = db.collection(USER_COLLECTION_NAME);
      const reformsCollection = db.collection(REFORMS_COLLECTION_NAME);
      const notificationsCollection = db.collection(NOTIFICATIONS_COLLECTION_NAME);
      const memberStatsCollection = db.collection(MEMBER_STATS_COLLECTION_NAME);

      // Recupera o registro atual do usuário
      const user = await userCollection.findOne({ id: userId });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Verifica se o usuário tem um contrato de clã (contractcla: true)
      const contract = await reformsCollection.findOne({ userId: userId, contractcla: true });
      if (!contract) {
        return res.status(403).json({ error: "Você não tem permissão para criar um clã." });
      }

      if (user.coins < CLAN_CREATION_COST) {
        return res.status(400).json({ error: "Você não possui Gold Coins suficientes" });
      }

      // Subtrai 12.500 GC do saldo do usuário
      await userCollection.updateOne(
        { id: userId },
        { $inc: { coins: -CLAN_CREATION_COST } }
      );

      // Cria o clã
      const newClan = {
        userId,
        namecla,
        Instagram,
        Twitter,
        Discord,
        Youtube,
        Tiktok,
        BioLi,
        Character,
        Clasigla,
        createdAt: new Date()
      };

      await collection.insertOne(newClan);

      // Armazenar a transação
      const transaction = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
         timestamp: new Date(),
        amount: CLAN_CREATION_COST,
        currency: 'coins',
        action: 'clan_creation'
      };
      
      await userCollection.updateOne(
        { id: userId },
        { $push: { transactions: transaction } }
      );

      // Incrementar o XP do usuário em 'member-stats' após a criação do clã
      await memberStatsCollection.updateOne(
        { member_id: userId },
        { $inc: { 
          xp: CLAN_CREATION_XP, 
          clubactivity: CLAN_CREATION_XP,
        
        } }
      );

      // Criar e registrar a notificação
      const notificationMessage = `Você criou um clã chamado ${namecla} ao custo de ${CLAN_CREATION_COST} Gold Coins.`;
      const notification = {
        userId: user._id.toString(),
        type: 'clan_creation',
        title: 'Criação de Clã',
        message: notificationMessage,
        timestamp: new Date(),
      };
      
      await notificationsCollection.insertOne(notification);

      // Enviar mensagem no Discord
      await sendDiscordMessage(user.id, notificationMessage);

      // Criptografar a resposta
      const updatedUser = await userCollection.findOne({ id: userId });
      const nvxcrypted = encrypt(JSON.stringify(updatedUser));

      return res.status(200).json({ message: "Clã criado com sucesso!", log: nvxcrypted });
    } catch (error) {
      console.error("Erro ao criar o clã:", error);
      return res.status(500).json({ error: "Erro ao criar o clã" });
    }
  } else if (req.method === "DELETE") {
    try {
      const formData = req.body;

      const { db } = await dbConnect();
      const collection = db.collection(COLLECTION_NAME);

      // Remove o campo 'type' do registro existente com o userId fornecido
      await collection.updateOne(
        { userId: formData.userId },
        { $unset: { type: "" } }
      );

      return res.status(200).json({ message: "Autorização removida com sucesso!" });
    } catch (error) {
      console.error("Erro ao remover a autorização:", error);
      return res.status(500).json({ error: "Erro ao remover a autorização" });
    }
  } else {
    return res.status(405).end();
  }
}
