const { banTarget } = require("@root/bot/helpers/ModUtils");
const { ApplicationCommandOptionType, TextChannel } = require("discord.js");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "ban",
  description: "proíbe o membro especificado",
  category: "MODERATION",
  botPermissions: ["BanMembers"],
  userPermissions: ["BanMembers"],
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
        description: "razão para proibição",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    const match = await message.client.resolveUsers(args[0], true);
    const target = match[0];
    if (!target) return message.safeReply(`Nenhum usuário encontrou correspondência ${args[0]}`);
    const reason = message.content.split(args[0])[1].trim();
    const response = await ban(message.member, target, reason, message.client);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    const response = await ban(interaction.member, target, reason, interaction.client);
    await interaction.followUp(response);
  },
};

/**
 * @param {import('discord.js').GuildMember} issuer
 * @param {import('discord.js').User} target
 * @param {string} reason
 * @param {import('discord.js').Client} client
 */
async function ban(issuer, target, reason, client) {
  const response = await banTarget(issuer, target, reason);
  if (typeof response === "boolean") {
    // Send message to specific channel
    const channel = client.channels.cache.get("1265465512918257774");
    if (channel && channel instanceof TextChannel) {
      channel.send(`<:havoc:1271662582826008697> <@${target.id}> você entrou para **BLACKLIST** da comunidade.`);
    }
    return `${target.tag} is banned!`;
  }
  if (response === "BOT_PERM") return `Eu não tenho permissão para banir ${target.tag}`;
  else if (response === "MEMBER_PERM") return `Você não tem permissão para banir ${target.tag}`;
  else return `Failed to ban ${target.tag}`;
}
