const { EmbedBuilder, escapeInlineCode, ApplicationCommandOptionType } = require("discord.js");
const { EMBED_COLORS } = require("@root/bot/config");
const { getInvitesLb } = require("@root/bot/database/schemas/Member");
const { getXpLb } = require("@root/bot/database/schemas/MemberStats");
const { getReputationLb } = require("@root/bot/database/schemas/User");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "leaderboard",
  description: "Exibir a tabela de classificação XP",
  category: "INFORMATION",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    aliases: ["lb"],
    minArgsCount: 1,
    usage: "<xp|invite|rep>",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "type",
        description: "tipo de tabela de classificação para exibir",
        required: true,
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "xp",
            value: "xp",
          },
          {
            name: "invite",
            value: "invite",
          },
          {
            name: "rep",
            value: "rep",
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const type = args[0].toLowerCase();
    let response;

    if (type === "xp") response = await getXpLeaderboard(message, message.author, data.settings);
    else if (type === "invite") response = await getInviteLeaderboard(message, message.author, data.settings);
    else if (type === "rep") response = await getRepLeaderboard(message.author);
    else response = "Tipo de tabela de líderes inválidos.Escolha também `xp` or `invite`";
    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const type = interaction.options.getString("type");
    let response;

    if (type === "xp") response = await getXpLeaderboard(interaction, interaction.user, data.settings);
    else if (type === "invite") response = await getInviteLeaderboard(interaction, interaction.user, data.settings);
    else if (type === "rep") response = await getRepLeaderboard(interaction.user);
    else response = "Tipo de tabela de líderes inválidos.Escolha também `xp` or `invite`";

    await interaction.followUp(response);
  },
};

async function getXpLeaderboard({ guild }, author, settings) {
  if (!settings.stats.enabled) return "A classificação está desativada neste servidor";

  const lb = await getXpLb(guild.id, 10);
  if (lb.length === 0) return "Sem usuários na tabela de classificação";

  let collector = "";
  for (let i = 0; i < lb.length; i++) {
    try {
      const user = await author.client.users.fetch(lb[i].member_id);
      collector += `**#${(i + 1).toString()}** - ${escapeInlineCode(user.tag)}\n`;
    } catch (ex) {
      // Ignore
    }
  }

  const embed = new EmbedBuilder()
    .setAuthor({ name: "XP Leaderboard" })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setDescription(collector)
    .setFooter({ text: `Requested by ${author.tag}` });

  return { embeds: [embed] };
}

async function getInviteLeaderboard({ guild }, author, settings) {
  if (!settings.invite.tracking) return "O rastreamento de convite está desativado neste servidor";

  const lb = await getInvitesLb(guild.id, 10);
  if (lb.length === 0) return "No users in the leaderboard";

  let collector = "";
  for (let i = 0; i < lb.length; i++) {
    try {
      const memberId = lb[i].member_id;
      if (memberId === "VANITY") collector += `**#${(i + 1).toString()}** - Vanity URL [${lb[i].invites}]\n`;
      else {
        const user = await author.client.users.fetch(lb[i].member_id);
        collector += `**#${(i + 1).toString()}** - ${escapeInlineCode(user.tag)} [${lb[i].invites}]\n`;
      }
    } catch (ex) {
      collector += `**#${(i + 1).toString()}** - DeletedUser#0000 [${lb[i].invites}]\n`;
    }
  }

  const embed = new EmbedBuilder()
    .setAuthor({ name: "Invite Leaderboard" })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setDescription(collector)
    .setFooter({ text: `Requested by ${author.tag}` });

  return { embeds: [embed] };
}

async function getRepLeaderboard(author) {
  const lb = await getReputationLb(10);
  if (lb.length === 0) return "Sem usuários na tabela de classificação";

  const collector = lb
    .map((user, i) => `**#${(i + 1).toString()}** - ${escapeInlineCode(user.username)} (${user.reputation?.received})`)
    .join("\n");

  const embed = new EmbedBuilder()
    .setAuthor({ name: "Tabela de classificação de reputação" })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setDescription(collector)
    .setFooter({ text: `Requerido por ${author.tag}` });

  return { embeds: [embed] };
}
