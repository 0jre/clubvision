import { NextApiResponse } from "next";
import { NextIronRequest, withSession } from "@/lib/session";
import { Client, ClientOptions, TextChannel } from 'discord.js';
import { dbConnect } from "@/core/integration/connect";

const OAuthScope = ["identify", "guilds"].join(" ");
const guildId = '1175857498687807560';
const roleId = '1175858552687050962';
const roleId2 = '1186171778565951579';
const specificRoleId = '1175866118741704837'; 
const channelId = '1265465512918257774'; // Canal do Discord onde a mensagem será enviada

const discordOptions: ClientOptions = {
  intents: 9,
};
const discordClient = new Client(discordOptions);

// Constante para o XP ganho por convite
const XP_PER_INVITE = 80;

async function addRoleToMemberIfNotHasRole(guildId: string, userId: string, roleId2: string, roleId: string, specificRoleId: string): Promise<void> {
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
    const role2 = guild.roles.cache.get(roleId2);
    if (!role ) {
      throw new Error('Role não encontrada.');
    }

    if (!role2) {
      throw new Error('Role2 não encontrada.');
    }
    await member.roles.add(role); 
    await member.roles.add(role2);
  }
}

async function sendWelcomeMessage(userId: string): Promise<void> {
  const channel = await discordClient.channels.fetch(channelId) as TextChannel;
  if (!channel) {
    throw new Error('Canal não encontrado.');
  }

  const welcomeMessage = `<:accepted:1272427026409848894> <@${userId}> você acabou de entrar para o thenovision como **CONVIDADO**. Agora você poderá jogar em nossa cidade.`;
  await channel.send(welcomeMessage);
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
    const { inviteCode, discordUserId } = req.body;
    const validInvite = await db.collection('reforms').findOne({ inviteCode });
    const guestuse = await db.collection('reforms').countDocuments({ guest: true, userId: user.id });
 
    if (!validInvite) {
      res.status(400).json({ error: 'Convite inválido.' });
      return;
    }

    if (guestuse) {
      return res.status(400).json({ error: 'Você já usou este convite.' });
    }

    // Verifique se o convite já foi usado
    if (validInvite.used) {
      res.status(400).json({ error: 'Este convite já foi usado.' });
      return;
    }

    // **ADICIONADO: Verificar o limite de convites do dono do código**
    const owner = await db.collection('reforms').findOne({ userId: validInvite.userId });

    if (!owner) {
      res.status(400).json({ error: 'Dono do convite não encontrado.' });
      return;
    }

    // Verificar se o limite de convites foi atingido
    if (owner.usedLimitInvite >= owner.maxlimitinvite) {
      res.status(400).json({ error: 'Limite de convites atingido.' });
      return;
    }

    // Incrementar o número de convites usados
    await db.collection('reforms').updateOne(
      { userId: owner.userId },
      { $inc: { usedLimitInvite: 1 } }
    );

    // **ADICIONADO: Verificar keyplusinvite e marcar como usado se necessário**
    if (owner.keyplusinvite) {
      if (owner.usedLimitInvite >= owner.maxlimitinvite) {
        await db.collection('reforms').updateOne(
          { inviteCode },
          { $set: { used: true } }
        );
      }
    }

    // Verifique se o usuário está usando seu próprio código de convite
    if (validInvite.userId === discordUserId) {
      res.status(400).json({ error: 'Você não pode usar seu próprio código de convite.' });
      return;
    }

    // **ADICIONADO: Incrementar o XP do dono do convite**
    await db.collection('member-stats').updateOne(
      { member_id: validInvite.userId },
      { $inc: { 
        xp: XP_PER_INVITE,
        clubactivity: XP_PER_INVITE,
        invite: 1
      } }
    );
 

    // Se o convite for válido e não for o próprio código do usuário, prossiga com a autorização
    const exists = await db.collection('reforms').countDocuments({ userId: user.id });
    
    // Defina o valor "type" com base na presença ou ausência do cargo específico
    const type = exists ? (hasSpecificRole ? 'Blocked' : 'Authorized') : 'Authorized';

    if (hasSpecificRole) {
      // Se o usuário tem o cargo específico, envie uma mensagem indicando que a conta está bloqueada
      res.status(400).json({ error: 'Sua conta está bloqueada.' });
      return;
    } else {
      // Verifique se o usuário já existe no banco de dados
      if (exists) {
        
     db.collection('monetizations').updateOne(
      { userId: validInvite.userId},
      { $inc: { rescue: 1000 } }
    );
        // Atualize o MongoDB apenas se o usuário não tiver o cargo específico
        db.collection('reforms').updateOne(
          { userId: user.id },
          {
            $set: {
              type: type,
              guest: true,
            },
            $addToSet: {
              ip: req.headers['cf-connecting-ip'],
            },
          }
        );
      } else {
               
     db.collection('monetizations').insertOne(
      {
        userId: validInvite.userId,
        rescue: 1000
      } 
    );
        // Se o usuário não existir no banco de dados, insira com o tipo 'Authorized'
        db.collection('reforms').insertOne({
          userId: user.id,
          type: type,
          guest: true,
        });
      }

      // Adicionar a role ao usuário no servidor do Discord apenas se ele não tiver o cargo específico
      if (!hasSpecificRole) {
        await discordClient.login(process.env.BOT_TOKEN);
        await addRoleToMemberIfNotHasRole(guildId, user.id, roleId2, roleId, specificRoleId);

        // Enviar mensagem de boas-vindas ao canal do Discord
        await sendWelcomeMessage(user.id);
      }
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
