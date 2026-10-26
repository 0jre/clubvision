import { dbConnect } from "@/core/integration/connect";
import { Client, ClientOptions, TextChannel } from 'discord.js';
import { Session } from 'next-iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';

interface ModLogFormData {
  guild_id: string;
  member_id?: string;
  reason?: string;
  admin: {
    id: string;
    tag: string;
  };
  type: string;
  created_at: number;
}

const COLLECTION_NAME = "mod-logs";
const channelId = '1265465512918257774'; // Canal do Discord onde a mensagem será enviada

const discordOptions: ClientOptions = {
  intents: 9,
};
const discordClient = new Client(discordOptions);

// Função para enviar mensagem de acordo com o tipo
async function sendTypeMessage(type: string, userId: string): Promise<void> {
  const channel = await discordClient.channels.fetch(channelId) as TextChannel;
  if (!channel) {
    throw new Error('Canal não encontrado.');
  }

  let message = "";

  switch (type) {
    case "WARN":
      message = `<:havoc:1271662582826008697> <@${userId}> você recebeu **ADVERTÊNCIA**. Por meio da equipe administrativa do thenovision, foi decidido advertir você por suas infrações.`;
      break;
    case "BAN":
      message = `<:havoc:1271662582826008697> <@${userId}> sua conta está **BLOQUEADA**. Para mais detalhes, verifique seu histórico de punições.`;
      break;
    case "UNBAN":
      message = `<:havoc:1271662582826008697> <@${userId}> sua conta agora está **DESBLOQUEADA**. Para mais detalhes, verifique seu histórico de punições.`;
      break;
    default:
      throw new Error('Tipo desconhecido.');
  }

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

  if (req.method === "POST") {
    try {
      const formData: ModLogFormData = req.body;
 
      const collection = db.collection(COLLECTION_NAME);

      // Insere um novo registro de log de moderação
      await collection.insertOne(formData);

      // **Envio da mensagem ao canal do Discord baseado no type**
      if (formData.member_id && formData.type) {
        await discordClient.login(process.env.BOT_TOKEN);
        await sendTypeMessage(formData.type, formData.member_id);
      }

      return res.status(200).json({ message: "Log de moderação salvo com sucesso!" });
    } catch (error) {
      console.error("Erro ao salvar o log de moderação:", error);
      return res.status(500).json({ error: "Erro ao salvar o log de moderação" });
    }
  } else {
    return res.status(405).end();
  }
}
const ModerationBanuser: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  // Use o await para chamar a função original checkAuth
  await checkAuth(req, res);
};

export default withSession(ModerationBanuser);