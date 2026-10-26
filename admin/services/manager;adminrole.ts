import { dbConnect } from "@/core/integration/connect";
import { Client, ClientOptions, TextChannel } from 'discord.js';
import { Session } from 'next-iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';


const COLLECTION_USERS = "users";
const COLLECTION_REFORMS = "reforms";
const channelId = '1265465512918257774'; // Canal do Discord onde a mensagem será enviada

const discordOptions: ClientOptions = {
  intents: 9,
};
const discordClient = new Client(discordOptions);

async function sendAccountDeactivatedMessage(userId: string): Promise<void> {
  const channel = await discordClient.channels.fetch(channelId) as TextChannel;
  if (!channel) {
    throw new Error('Canal não encontrado.');
  }

  const message = `<:denied:1272426290846105600> <@${userId}> informamos que seu **PASSAPORTE** foi removido do sistema thenovision após análise da equipe de imigração.`;
  
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
     return res.status(400).json({ message: 'Permissão negada.' });
   }
   
 

  if (req.method === "DELETE" || req.method === "POST") {
    try {
      const formData = req.body;

      const { db } = await dbConnect();

      // Defina as chaves para cada coleção
      const userKeys = [
        "type", "bod" , "manager","ceo","cdo" ,"cmo","coo", "cto", "leader", "qa", "havocac", "contributor", "modder3d", "vehicledev", "developer3d"
      ];
      const reformKeys = ["prime", "nvxre"];

      // Separe os dados em dois objetos diferentes
      const userData: Record<string, any> = {};
      const reformData: Record<string, any> = {};

      for (const key in formData) {
        if (userKeys.includes(key)) {
          userData[key] = formData[key];
        } else if (reformKeys.includes(key)) {
          reformData[key] = formData[key];
        }
      }

      // Atualize ou insira no `users` se houver dados de usuários
      if (Object.keys(userData).length > 0) {
        const userCollection = db.collection(COLLECTION_USERS);
        await userCollection.updateOne(
          { id: formData.userId },
          { $set: userData },
          { upsert: true }
        );
      }

      // Atualize ou insira no `reforms` se houver dados de reformas
      if (Object.keys(reformData).length > 0) {
        const reformCollection = db.collection(COLLECTION_REFORMS);
        await reformCollection.updateOne(
          { userId: formData.userId },
          { $set: reformData },
          { upsert: true }
        );
      }

      // Enviar mensagem para o Discord
      if (req.method === "DELETE") {
        await discordClient.login(process.env.BOT_TOKEN);
        await sendAccountDeactivatedMessage(formData.userId);
      }

      return res.status(200).json({ message: "Operação realizada com sucesso!" });
    } catch (error) {
      console.error("Erro ao processar a solicitação:", error);
      return res.status(500).json({ error: "Erro ao processar a solicitação" });
    }
  } else {
    return res.status(405).end();
  }
}

const ManagerAdminRole: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  // Use o await para chamar a função original checkAuth
  await checkAuth(req, res);
};

export default withSession(ManagerAdminRole);