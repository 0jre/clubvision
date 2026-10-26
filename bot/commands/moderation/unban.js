const { unBanTarget } = require("@root/bot/helpers/ModUtils");
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ApplicationCommandOptionType,
  ComponentType,
  TextChannel,
} = require("discord.js");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "unban",
  description: "Unban o membro especificado",
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
    ephemeral: true,
    options: [
      {
        name: "name",
        description: "adicione id do membro",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
     
    ],
  },

  async messageRun(message, args) {
    const match = args[0];
    const reason = message.content.split(args[0])[1].trim();

    const response = await getMatchingBans(message.guild, match);
    const sent = await message.safeReply(response);
    if (typeof response !== "string") await waitForBan(message.member, reason, sent);
  },

  async interactionRun(interaction) {
    const match = interaction.options.getString("name");
    const reason = interaction.options.getString("reason");

    const response = await getMatchingBans(interaction.guild, match);
    const sent = await interaction.followUp(response);
    if (typeof response !== "string") await waitForBan(interaction.member, reason, sent);
  },
};

/**
 * @param {import('discord.js').Guild} guild
 * @param {string} match
 */
async function getMatchingBans(guild, match) {
  const bans = await guild.bans.fetch({ cache: false });

  const matched = [];
  for (const [, ban] of bans) {
    if (ban.user.partial) await ban.user.fetch();

    // exact match
    if (ban.user.id === match || ban.user.tag === match) {
      matched.push(ban.user);
      break;
    }

    // partial match
    if (ban.user.username.toLowerCase().includes(match.toLowerCase())) {
      matched.push(ban.user);
    }
  }

  if (matched.length === 0) return `Nenhum usuário encontrado correspondendo a ${match}`;

  const options = [];
  for (const user of matched) {
    options.push({ label: user.tag, value: user.id });
  }

  const menuRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder().setCustomId("unban-menu").setPlaceholder("Escolha um usuário para desbanir").addOptions(options)
  );

  return { content: "Por favor, selecione um usuário que você deseja desbanir", components: [menuRow] };
}

/**
 * @param {import('discord.js').GuildMember} issuer
 * @param {string} reason
 * @param {import('discord.js').Message} sent
 */
async function waitForBan(issuer, reason, sent) {
  const collector = sent.channel.createMessageComponentCollector({
    filter: (m) => m.member.id === issuer.id && m.customId === "unban-menu" && sent.id === m.message.id,
    time: 20000,
    max: 1,
    componentType: ComponentType.StringSelect,
  });

  collector.on("collect", async (response) => {
    const userId = response.values[0];
    const user = await issuer.client.users.fetch(userId, { cache: true });

    const status = await unBanTarget(issuer, user, reason);
    if (typeof status === "boolean") {
      // Send message to specific channel
      const channel = issuer.client.channels.cache.get("1265465512918257774");
      if (channel && channel instanceof TextChannel) {
        try {
          await channel.send(`<:havoc:1271662582826008697> <@${user.id}> você foi removido da **BLACKLIST** da comunidade.`);
        } catch (error) {
          console.error("Erro ao enviar mensagem para o canal:", error);
        }
      } else {
        console.error("Canal não encontrado ou não é um TextChannel");
      }
      return sent.edit({ content: `${user.tag} foi desbanido!`, components: [] });
    } else {
      return sent.edit({ content: `Falha ao desbanir ${user.tag}`, components: [] });
    }
  });

  collector.on("end", async (collected) => {
    if (collected.size === 0) return sent.edit("Ops! Tempo esgotado. Tente novamente mais tarde.");
  });
}
