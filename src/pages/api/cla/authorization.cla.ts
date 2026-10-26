import { NextApiResponse } from "next";
import { NextIronRequest, withSession } from "@/lib/session";
import { Client, ClientOptions } from 'discord.js';
import { dbConnect } from "@/core/integration/connect";

const OAuthScope = ["identify", "guilds"].join(" ");
const guildId = '1175857498687807560';
const roleId = '1237194145567735809';
const specificRoleId = '1175866118741704837'; 

const discordOptions: ClientOptions = {
  intents: 9,
};
const discordClient = new Client(discordOptions);

async function addRoleToMemberIfNotHasRole(guildId: string, userId: string, roleId: string, specificRoleId: string): Promise<void> {
  const guild = await discordClient.guilds.fetch(guildId);
  if (!guild) {
    throw new Error('Servidor não encontrado.');
  }

  const member = await guild.members.fetch(userId);
  if (!member) {
    throw new Error('Usuário não encontrado no servidor.');
  }

  const hasSpecificRole = member.roles.cache.has(specificRoleId);
  if (!hasSpecificRole) {
    const role = guild.roles.cache.get(roleId); 
    if (!role ) {
      throw new Error('Role não encontrada.');
    }
    await member.roles.add(role); 
  }
}

const handler = async (req: NextIronRequest, res: NextApiResponse) => {
  try {
    const user = req.session.get("user");
    if (!user) {
      // Se o usuário não estiver na sessão, redirecione-o para a autorização do Discord
      return;
    }

    // Verificar se o usuário tem o cargo específico
    const member = await discordClient.guilds.cache.get(guildId)?.members.fetch(user.id);
    const hasSpecificRole = member?.roles.cache.has(specificRoleId);

    // Verifique se o convite é válido aqui
    const { db } = await dbConnect();
    const { inviteCode } = req.body;
    const validInvite = await db.collection('cla').findOne({ inviteCode });

    if (!validInvite) {
      res.status(400).json({ error: 'Convite inválido.' });
      return;
    }

    // Verifique se o convite já foi usado
    if (validInvite.used) {
      res.status(400).json({ error: 'Este convite já foi usado.' });
      return;
    }

    // Marque o convite como usado no banco de dados
    await db.collection('cla').updateOne(
      { inviteCode },
      { $set: { used: true }, $addToSet: { Members: user.id } } // Adicionando o userId ao array invitedUsers
    );

    // Verifique se o usuário está usando seu próprio código de convite
    if (validInvite.userId === user.id) {
      res.status(400).json({ error: 'Você não pode usar seu próprio código de convite.' });
      return;
    }

  
      // Adicionar a role ao usuário no servidor do Discord apenas se ele não tiver o cargo específico
      if (!hasSpecificRole ) { // Se upsertedId existir, significa que o documento foi inserido
        await discordClient.login(process.env.BOT_TOKEN);
        await addRoleToMemberIfNotHasRole(guildId, user.id, roleId, specificRoleId);
      }
    
    // Mensagem de sucesso no login com base na verificação do cargo específico
    const successMessage = hasSpecificRole
      ? "Sua conta está bloqueada."
      : "Você agora está autorizado e já pode iniciar seu game no servidor.";

    // Renderize sua página com a mensagem de sucesso
    res.status(200).json({ message: successMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao processar a solicitação.' });
  }
};

export default withSession(handler);
