const { warnTarget } = require("@root/bot/helpers/ModUtils");
const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "warn",
  description: "adverte o membro especificado",
  category: "MODERATION",
  userPermissions: ["KickMembers"],
  command: {
    enabled: true,
    usage: "<ID|@member> [reason]",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "user",
        description: "o membro alvo",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "reason",
        description: "Razão para Warn",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    const target = await message.guild.resolveMember(args[0], true);
    if (!target) return message.safeReply(`Nenhum usuário encontrou correspondência ${args[0]}`);
    const reason = message.content.split(args[0])[1].trim();
    const response = await warn(message.member, target, reason);
    
    // Enviar a mensagem de advertência para o canal específico
    const channel = message.guild.channels.cache.get('1265465512918257774');
    if (channel) {
      channel.send(`<:havoc:1271662582826008697> <@${target.user.id}> você recebeu **ADVERTÊNCIA**. Por meio da equipe administrativa do thenovision, foi decidido advertir você por suas infrações.`);
    }

    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const target = await interaction.guild.members.fetch(user.id);

    const response = await warn(interaction.member, target, reason);
    
    // Enviar a mensagem de advertência para o canal específico
    const channel = interaction.guild.channels.cache.get('1265465512918257774');
    if (channel) {
      channel.send(`<:havoc:1271662582826008697> <@${target.user.id}> você recebeu **ADVERTÊNCIA**. Por meio da equipe administrativa do thenovision, foi decidido advertir você por suas infrações.`);
    }

    await interaction.followUp(response);
  },
};

async function warn(issuer, target, reason) {
  const response = await warnTarget(issuer, target, reason);
  if (typeof response === "boolean") return `${target.user.tag} está avisado!`;
  if (response === "BOT_PERM") return `Eu não tenho permissão para avisar ${target.user.tag}`;
  else if (response === "MEMBER_PERM") return `Você não tem permissão para avisar ${target.user.tag}`;
  else return `Failed to warn ${target.user.tag}`;
}
