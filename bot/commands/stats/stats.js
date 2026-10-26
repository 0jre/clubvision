const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { getMemberStats } = require("@root/bot/database/schemas/MemberStats");
const { EMBED_COLORS } = require("@root/bot/config");
const { stripIndents } = require("common-tags");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "stats",
  description: "Exibe as estatísticas dos membros neste servidor",
  cooldown: 5,
  category: "STATS",
  command: {
    enabled: true,
    usage: "[@member|id]",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "user",
        description: "target user",
        type: ApplicationCommandOptionType.User,
        required: false,
      },
    ],
  },

  async messageRun(message, args, data) {
    const target = (await message.guild.resolveMember(args[0])) || message.member;
    const response = await stats(target, data.settings);
    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const member = interaction.options.getMember("user") || interaction.member;
    const response = await stats(member, data.settings);
    await interaction.followUp(response);
  },
};

/**
 * @param {import('discord.js').GuildMember} member
 * @param {object} settings
 */
async function stats(member, settings) {
  if (!settings.stats.enabled) return "Stats Tracking is disabled on this server";
  const memberStats = await getMemberStats(member.guild.id, member.id);

  const embed = new EmbedBuilder()
    .setThumbnail(member.user.displayAvatarURL())
    .setColor(EMBED_COLORS.BOT_EMBED)
    .addFields(
      {
        name: "User Tag",
        value: member.user.tag,
        inline: true,
      },
      {
        name: "ID",
        value: member.id,
        inline: true,
      },
      {
        name: "⌚ Membro desde",
        value: member.joinedAt.toLocaleString(),
        inline: false,
      },
      {
        name: "💬 Mensagens enviadas",
        value: stripIndents`
      ❯ Mensagens enviadas: ${memberStats.messages}
      ❯ Comandos de prefixo: ${memberStats.commands.prefix}
      ❯ Comandos de barra: ${memberStats.commands.slash}
      ❯ XP Merecida: ${memberStats.xp}
      ❯ Nível atual: ${memberStats.level}
    `,
        inline: false,
      },
      {
        name: "🎙️ Estatísticas de voz",
        value: stripIndents`
      ❯ Total de conexões: ${memberStats.voice.connections}
      ❯ Tempo gasto: ${Math.floor(memberStats.voice.time / 60)} min
    `,
      }
    )
    .setFooter({ text: "Estatísticas geradas" })
    .setTimestamp();

  return { embeds: [embed] };
}
