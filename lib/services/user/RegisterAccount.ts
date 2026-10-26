import { dbConnect } from "@/core/integration/connect";
import { NextApiRequest, NextApiResponse } from "next";
import { Client, ClientOptions, TextChannel } from 'discord.js';

const COLLECTION_NAME = "reforms";
const channelId = '1265465512918257774'; // ID do canal do Discord onde a mensagem será enviada

const discordOptions: ClientOptions = {
  intents: 9,
};
const discordClient = new Client(discordOptions);

// Função para enviar uma mensagem ao Discord
async function sendDiscordMessage(message: string): Promise<void> {
  const channel = await discordClient.channels.fetch(channelId) as TextChannel;
  if (!channel) {
    throw new Error('Canal não encontrado.');
  }

  await channel.send(message);
}

export async function RegisterAccount(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "DELETE") {
    try {
      const formData = req.body;

      const { db } = await dbConnect();
      const collection = db.collection(COLLECTION_NAME);

      // Remove o campo 'type' do registro existente com o userId fornecido
      await collection.updateOne(
        { userId: formData.userId },
        { $unset: { type: "" } }
      );

      // Envia a mensagem de autorização removida ao Discord
      const message = `<:denied:1272426290846105600> <@${formData.userId}> seu **PASSAPORTE**. Foi decidido pela equipe de imigração remover seu passaporte do thenovision.`;
      await discordClient.login(process.env.BOT_TOKEN);
      await sendDiscordMessage(message);

      return res.status(200).json({ message: "Autorização removida com sucesso!" });
    } catch (error) {
      console.error("Erro ao remover a autorização:", error);
      return res.status(500).json({ error: "Erro ao remover a autorização" });
    }
  }

  if (req.method === "POST") {
    try {
      const formData = req.body;

      const { db } = await dbConnect();
      const collection = db.collection(COLLECTION_NAME);

      // Recupera o registro atual
      const existingForm = await collection.findOne({ userId: formData.userId });

      if (existingForm) {
        // Cria um objeto com as alterações a serem feitas
        const updatedData = {
          ...existingForm,
          ...formData,
        };

        // Remove os campos que não foram modificados
        for (const key in updatedData) {
          if (updatedData[key] === existingForm[key] && key !== "_id") {
            delete updatedData[key];
          }
        }

         // Envia uma mensagem ao Discord dependendo do tipo (Authorized)
      if (formData.type === "Authorized") {
        const message = `<:accepted:1272427026409848894> <@${formData.userId}> sua conta foi **ATIVADA**, agora você poderá jogar em nossa cidade.`;
        await discordClient.login(process.env.BOT_TOKEN);
        await sendDiscordMessage(message);
      }
      
        if (Object.keys(updatedData).length > 0) {
          // Atualiza o registro existente com as alterações
          await collection.updateOne({ userId: formData.userId }, { $set: updatedData });
        }
      } else {
        // Insere um novo registro
        await collection.insertOne(formData);
      }
      return res.status(200).json({ message: "Formulário salvo com sucesso!" });
    } catch (error) {
      console.error("Erro ao salvar o formulário:", error);
      return res.status(500).json({ error: "Erro ao salvar o formulário" });
    }
  } else {
    return res.status(405).end();
  }
}
