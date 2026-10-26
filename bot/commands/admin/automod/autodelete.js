const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "autodelete",
  description: "Gerencie as configurações do AutoDelete para o servidor",
  category: "AUTOMOD",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 2,
    subcommands: [
      {
        trigger: "anexos <on|off>",
        description: "Permitir ou proibir anexos na mensagem",
      },
      {
        trigger: "convites <on|off>",
        description: "Permitir ou não permitir convites na mensagem",
      },
      {
        trigger: "links <on|off>",
        description: "Permitir ou proibir links na mensagem",
      },
      {
        trigger: "MaxLines <number>",
        description: "Define linhas máximas permitidas por mensagem [0 para desativar]",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "anexos",
        description: "Permitir ou proibir anexos na mensagem",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "status de configuração",
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
        name: "invites",
        description: "Permitir ou proibir convites de discórdia na mensagem",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "status de configuração",
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
        name: "links",
        description: "Permitir ou proibir links na mensagem",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "status de configuração",
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
        name: "maxlines",
        description: "Define linhas máximas permitidas por mensagem",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "amount",
            description: "valor de configuração (0 desabilitar)",
            required: true,
            type: ApplicationCommandOptionType.Integer,
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const settings = data.settings;
    const sub = args[0].toLowerCase();
    let response;

    if (sub == "attachments") {
      const status = args[1].toLowerCase();
      if (!["on", "off"].includes(status)) return message.safeReply("Status inválido.O valor deve ser `on/off`");
      response = await antiAttachments(settings, status);
    }

    //
    else if (sub === "invites") {
      const status = args[1].toLowerCase();
      if (!["on", "off"].includes(status)) return message.safeReply("Status inválido.O valor deve ser `on/off`");
      response = await antiInvites(settings, status);
    }

    //
    else if (sub == "links") {
      const status = args[1].toLowerCase();
      if (!["on", "off"].includes(status)) return message.safeReply("Status inválido.O valor deve ser `on/off`");
      response = await antilinks(settings, status);
    }

    //
    else if (sub === "maxlines") {
      const max = args[1];
      if (isNaN(max) || Number.parseInt(max) < 1) {
        return message.safeReply("As linhas máximas devem ser um número válido maior que 0");
      }
      response = await maxLines(settings, max);
    }

    //
    else response = "Uso do comando inválido!";
    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    const settings = data.settings;
    let response;

    if (sub == "attachments") {
      response = await antiAttachments(settings, interaction.options.getString("status"));
    } else if (sub === "invites") response = await antiInvites(settings, interaction.options.getString("status"));
    else if (sub == "links") response = await antilinks(settings, interaction.options.getString("status"));
    else if (sub === "maxlines") response = await maxLines(settings, interaction.options.getInteger("amount"));
    else response = "Uso do comando inválido!";

    await interaction.followUp(response);
  },
};

async function antiAttachments(settings, input) {
  const status = input.toUpperCase() === "ON" ? true : false;
  settings.automod.anti_attachments = status;
  await settings.save();
  return `Messages ${
    status ? "com anexos agora serão excluídos automaticamente" : "não será filtrado para anexos agora"
  }`;
}

async function antiInvites(settings, input) {
  const status = input.toUpperCase() === "ON" ? true : false;
  settings.automod.anti_invites = status;
  await settings.save();
  return `Messages ${
    status
      ? "Com os convites de discórdia agora serão excluídos automaticamente"
      : "não será filtrado para convites de discord agora"
  }`;
}

async function antilinks(settings, input) {
  const status = input.toUpperCase() === "ON" ? true : false;
  settings.automod.anti_links = status;
  await settings.save();
  return `Mensagens ${
    status ? "Com os links agora serão excluídos automaticamente" : "não será filtrado para links agora"
  }`;
}

async function maxLines(settings, input) {
  const lines = Number.parseInt(input);
  if (isNaN(lines)) return "Por favor, insira uma entrada de número válida";

  settings.automod.max_lines = lines;
  await settings.save();
  return `${
    input === 0
      ? "O limite máximo de linha está desativado"
      : `Mensagens mais longas que \`${input}\` As linhas agora serão excluídas automaticamente`
  }`;
}
