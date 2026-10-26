const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "levelup",
  description: "Configure o sistema de nivelamento",
  category: "STATS",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "message <new-message>",
        description: "Defina uma mensagem de nível personalizado",
      },
      {
        trigger: "channel <#channel|off>",
        description: "Defina o canal para enviar mensagens de nível para cima como",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "message",
        description: "Defina uma mensagem de nível personalizado",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "message",
            description: "mensagem para exibir quando um usuário nivela",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "channel",
        description: "Defina o canal para enviar mensagens de nível para cima como",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal para enviar mensagens de nível para cima para",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const sub = args[0];
    const subcommandArgs = args.slice(1);
    let response;

    // message
    if (sub === "message") {
      const message = subcommandArgs.join(" ");
      response = await setMessage(message, data.settings);
    }

    // channel
    else if (sub === "channel") {
      const input = subcommandArgs[0];
      let channel;

      if (input === "off") channel = "off";
      else {
        const match = message.guild.findMatchingChannels(input);
        if (match.length === 0) return message.safeReply("Canal inválido.Forneça um canal válido");
        channel = match[0];
      }
      response = await setChannel(channel, data.settings);
    }

    // invalid
    else response = "Subcomando inválido";
    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    let response;

    if (sub === "message") response = await setMessage(interaction.options.getString("message"), data.settings);
    else if (sub === "channel") response = await setChannel(interaction.options.getChannel("channel"), data.settings);
    else response = "Subcomando inválido";

    await interaction.followUp(response);
  },
};

async function setMessage(message, settings) {
  if (!message) return "Mensagem inválida.Por favor, forneça uma mensagem";
  settings.stats.xp.message = message;
  await settings.save();
  return `Configuração salva.Mensagem de nível Up Atualizada!`;
}

async function setChannel(channel, settings) {
  if (!channel) return "Canal inválido.Por favor, forneça um canal";

  if (channel === "off") settings.stats.xp.channel = null;
  else settings.stats.xp.channel = channel.id;

  await settings.save();
  return `Configuração salva.Nível UP Channel Atualizado!`;
}
