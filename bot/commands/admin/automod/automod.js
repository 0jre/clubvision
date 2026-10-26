const { EmbedBuilder, ApplicationCommandOptionType, ChannelType } = require("discord.js");
const { EMBED_COLORS } = require("@root/bot/config.js");
const { stripIndent } = require("common-tags");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "automod",
  description: "Várias configurações de automóveis",
  category: "AUTOMOD",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "status",
        description: "Verifique a configuração do Automod para esta guilda",
      },
      {
        trigger: "strikes <number>",
        description: "Número máximo de greves que um membro pode receber antes de tomar uma ação",
      },
      {
        trigger: "action <TIMEOUT|KICK|BAN>",
        description: "Defina a ação a ser executada após receber ataques máximos",
      },
      {
        trigger: "debug <on|off>",
        description: "Liga o Automod para mensagens enviadas por administradores e moderadores",
      },
      {
        trigger: "whitelist",
        description: "Lista de canais que estão na lista de permissões",
      },
      {
        trigger: "whitelistadd <channel>",
        description: "Adicione um canal à lista de permissões",
      },
      {
        trigger: "whitelistremove <channel>",
        description: "Remova um canal da lista de permissões",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "status",
        description: "Verifique a configuração do Automod",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "strikes",
        description: "Defina o número máximo de greves antes de tomar uma ação",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "amount",
            description: "Número de greves (padrão 5)",
            required: true,
            type: ApplicationCommandOptionType.Integer,
          },
        ],
      },
      {
        name: "action",
        description: "Defina a ação a ser executada após receber ataques máximos",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "action",
            description: "ação para executar",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
              {
                name: "TIMEOUT",
                value: "TIMEOUT",
              },
              {
                name: "KICK",
                value: "KICK",
              },
              {
                name: "BAN",
                value: "BAN",
              },
            ],
          },
        ],
      },
      {
        name: "debug",
        description: "Ativar/desativar o Automod para mensagens enviadas por administradores e moderadores",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "configuration status",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: "ON",
                value: "ON",
              },
              {
                name: "OFF",
                value: "OFF",
              },
            ],
          },
        ],
      },
      {
        name: "whitelist",
        description: "Veja os canais da lista de permissões",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "whitelistadd",
        description: "Adicione um canal à lista de permissões",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal para adicionar",
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
          },
        ],
      },
      {
        name: "whitelistremove",
        description: "Remova um canal da lista de permissões",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal para remover",
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const input = args[0].toLowerCase();
    const settings = data.settings;

    let response;
    if (input === "status") {
      response = await getStatus(settings, message.guild);
    } else if (input === "strikes") {
      const strikes = args[1];
      if (isNaN(strikes) || Number.parseInt(strikes) < 1) {
        return message.safeReply("As greves devem ser um número válido maior que 0");
      }
      response = await setStrikes(settings, strikes);
    } else if (input === "action") {
      const action = args[1].toUpperCase();
      if (!action || !["TIMEOUT", "KICK", "BAN"].includes(action))
        return message.safeReply("Não é uma ação válida. A ação pode ser `timeout`/` kick`/`ban`");
      response = await setAction(settings, message.guild, action);
    } else if (input === "debug") {
      const status = args[1].toLowerCase();
      if (!["on", "off"].includes(status)) return message.safeReply("Status inválido.O valor deve ser `on/off`");
      response = await setDebug(settings, status);
    }

    // whitelist
    else if (input === "whitelist") {
      response = getWhitelist(message.guild, settings);
    }

    // whitelist add
    else if (input === "whitelistadd") {
      const match = message.guild.findMatchingChannels(args[1]);
      if (!match.length) return message.safeReply(`No channel found matching ${args[1]}`);
      response = await whiteListAdd(settings, match[0].id);
    }

    // whitelist remove
    else if (input === "whitelistremove") {
      const match = message.guild.findMatchingChannels(args[1]);
      if (!match.length) return message.safeReply(`No channel found matching ${args[1]}`);
      response = await whiteListRemove(settings, match[0].id);
    }

    //
    else response = "Uso do comando inválido!";
    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    const settings = data.settings;

    let response;

    if (sub === "status") response = await getStatus(settings, interaction.guild);
    else if (sub === "strikes") response = await setStrikes(settings, interaction.options.getInteger("amount"));
    else if (sub === "action")
      response = await setAction(settings, interaction.guild, interaction.options.getString("action"));
    else if (sub === "debug") response = await setDebug(settings, interaction.options.getString("status"));
    else if (sub === "whitelist") {
      response = getWhitelist(interaction.guild, settings);
    } else if (sub === "whitelistadd") {
      const channelId = interaction.options.getChannel("channel").id;
      response = await whiteListAdd(settings, channelId);
    } else if (sub === "whitelistremove") {
      const channelId = interaction.options.getChannel("channel").id;
      response = await whiteListRemove(settings, channelId);
    }

    await interaction.followUp(response);
  },
};

async function getStatus(settings, guild) {
  const { automod } = settings;

  const logChannel = settings.modlog_channel
    ? guild.channels.cache.get(settings.modlog_channel).toString()
    : "Not Configured";

  // String Builder
  let desc = stripIndent`
    ❯ **Max Lines**: ${automod.max_lines || "NA"}
    ❯ **Anti-Massmention**: ${automod.anti_massmention > 0 ? "✓" : "✕"}
    ❯ **Anti-Attachment**: ${automod.anti_attachment ? "✓" : "✕"}
    ❯ **Anti-Links**: ${automod.anti_links ? "✓" : "✕"}
    ❯ **Anti-Invites**: ${automod.anti_invites ? "✓" : "✕"}
    ❯ **Anti-Spam**: ${automod.anti_spam ? "✓" : "✕"}
    ❯ **Anti-Ghostping**: ${automod.anti_ghostping ? "✓" : "✕"}
  `;

  const embed = new EmbedBuilder()
    .setAuthor({ name: "Automod Configuration", iconURL: guild.iconURL() })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setDescription(desc)
    .addFields(
      {
        name: "Log Channel",
        value: logChannel,
        inline: true,
      },
      {
        name: "Max Strikes",
        value: automod.strikes.toString(),
        inline: true,
      },
      {
        name: "Action",
        value: automod.action,
        inline: true,
      },
      {
        name: "Debug",
        value: automod.debug ? "✓" : "✕",
        inline: true,
      }
    );

  return { embeds: [embed] };
}

async function setStrikes(settings, strikes) {
  settings.automod.strikes = strikes;
  await settings.save();
  return `Configuração salva!Greves máximas está definido como ${strikes}`;
}

async function setAction(settings, guild, action) {
  if (action === "TIMEOUT") {
    if (!guild.members.me.permissions.has("ModerateMembers")) {
      return "Eu não faço permissão para os membros do tempo limite";
    }
  }

  if (action === "KICK") {
    if (!guild.members.me.permissions.has("KickMembers")) {
      return "Eu não tenho permissão para chutar membros";
    }
  }

  if (action === "BAN") {
    if (!guild.members.me.permissions.has("BanMembers")) {
      return "Eu não tenho permissão para proibir membros";
    }
  }

  settings.automod.action = action;
  await settings.save();
  return `Configuração salva!Ação automóvel está definida como ${action}`;
}

async function setDebug(settings, input) {
  const status = input.toLowerCase() === "on" ? true : false;
  settings.automod.debug = status;
  await settings.save();
  return `Configuração salva!A depuração automóvel é agora ${status ? "habilitada" : "desabilitada"}`;
}

function getWhitelist(guild, settings) {
  const whitelist = settings.automod.wh_channels;
  if (!whitelist || !whitelist.length) return "Nenhum canal está na lista de permissões";

  const channels = [];
  for (const channelId of whitelist) {
    const channel = guild.channels.cache.get(channelId);
    if (!channel) continue;
    if (channel) channels.push(channel.toString());
  }

  return `Canais de permissões de permissões: ${channels.join(", ")}`;
}

async function whiteListAdd(settings, channelId) {
  if (settings.automod.wh_channels.includes(channelId)) return "O canal já está na lista de permissões";
  settings.automod.wh_channels.push(channelId);
  await settings.save();
  return `Canal na lista de permissões!`;
}

async function whiteListRemove(settings, channelId) {
  if (!settings.automod.wh_channels.includes(channelId)) return "O canal não está na lista de permissões";
  settings.automod.wh_channels.splice(settings.automod.wh_channels.indexOf(channelId), 1);
  await settings.save();
  return `Canal removido da lista de permissões!`;
}
