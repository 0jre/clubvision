import { dbConnect } from "@/core/integration/connect";
import { Client, ClientOptions, TextChannel } from 'discord.js';
import { Session } from 'next-iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';


const COLLECTION_NAME = "reforms";
const channelId = '1265465512918257774'; // Canal do Discord onde a mensagem será enviada

const discordOptions: ClientOptions = {
  intents: 9,
};
const discordClient = new Client(discordOptions);

// Função para enviar a mensagem de conta desativada
async function sendAccountDeactivatedMessage(userId: string): Promise<void> {
  const channel = await discordClient.channels.fetch(channelId) as TextChannel;
  if (!channel) {
    throw new Error('Canal não encontrado.');
  }

  const message = `<:denied:1272426290846105600> <@${userId}> seu **PASSAPORTE**. Foi decidido pela equipe de imigração remover seu passaporte do thenovision.`;
  
  await channel.send(message);
}

export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {

    const sessionUser = req.session?.get('user');
    // Verifique se o usuário está autenticado
    if (!req.session || !req.session.get('user')) {
      return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
    }
    const { db } = await dbConnect();
    const usersCollection = db.collection('users');
    const userRecord = await usersCollection.findOne({ id: sessionUser.id });
  
    const PermissionId = userRecord?.type == 'ADMIN'

    if (!PermissionId) {
    return res.status(400).json({ message: 'Usuario não permitido' });
   }

   
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

      // **Envio da mensagem ao canal do Discord**
      await discordClient.login(process.env.BOT_TOKEN);
      await sendAccountDeactivatedMessage(formData.userId);

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
const ManagerRoleUser: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  // Use o await para chamar a função original checkAuth
  await checkAuth(req, res);
};

export default withSession(ManagerRoleUser);





