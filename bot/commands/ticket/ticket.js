const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ModalBuilder,
  TextInputBuilder,
  ApplicationCommandOptionType,
  ChannelType,
  ButtonStyle,
  TextInputStyle,
  ComponentType,
} = require("discord.js");
const { EMBED_COLORS } = require("@root/bot/config.js");
const { isTicketChannel, closeTicket, closeAllTickets } = require("@root/bot/handlers/ticket");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "ticket",
  description: "vários comandos de emissão de bilhetes",
  category: "TICKET",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "setup <#channel>",
        description: "iniciar uma configuração de ticket interativo",
      },
      {
        trigger: "log <#channel>",
        description: "canal de log de configuração para tickets",
      },
      {
        trigger: "limit <number>",
        description: "definir o número máximo de tickets abertos simultâneos",
      },
      {
        trigger: "close",
        description: "fechar o bilhete",
      },
      {
        trigger: "closeall",
        description: "fechar todos os tickets abertos",
      },
      {
        trigger: "add <userId|roleId>",
        description: "adicionar usuário/função ao ticket",
      },
      {
        trigger: "remove <userId|roleId>",
        description: "remover usuário/função do ticket",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "setup",
        description: "configurar uma nova mensagem de ticket",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "o canal para onde a mensagem de criação do ticket deve ser enviada",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
        ],
      },
      {
        name: "log",
        description: "canal de log de configuração para tickets",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal para onde os logs de ticket devem ser enviados",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
        ],
      },
      {
        name: "limit",
        description: "definir o número máximo de tickets abertos simultâneos",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "amount",
            description: "número máximo de bilhetes",
            type: ApplicationCommandOptionType.Integer,
            required: true,
          },
        ],
      },
      {
        name: "close",
        description: "fecha o ticket [usado apenas no ticket channel]",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "closeall",
        description: "fecha todos os tickets abertos",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "add",
        description: "adicionar usuário ao canal de ticket atual [usado somente no canal de ticket]",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user_id",
            description: "o id do usuário para adicionar",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "remove",
        description: "remover usuário do canal de ticket [usado apenas no canal de ticket]",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "o usuário para remover",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const input = args[0].toLowerCase();
    let response;

    // Setup
    if (input === "setup") {
      if (!message.guild.members.me.permissions.has("ManageChannels")) {
        return message.safeReply("Estou perdendo `Gerenciar canais` para criar canais de tickets");
      }
      const targetChannel = message.guild.findMatchingChannels(args[1])[0];
      if (!targetChannel) {
        return message.safeReply("não encontrei canal com esse nome");
      }
      return ticketModalSetup(message, targetChannel, data.settings);
    }

    // log ticket
    else if (input === "log") {
      if (args.length < 2) return message.safeReply("Forneça um canal para onde os logs de ticket devem ser enviadost");
      const target = message.guild.findMatchingChannels(args[1]);
      if (target.length === 0) return message.safeReply("Não foi possível encontrar nenhum canal correspondente");
      response = await setupLogChannel(target[0], data.settings);
    }

    // Set limit
    else if (input === "limit") {
      if (args.length < 2) return message.safeReply("Forneça um número");
      const limit = args[1];
      if (isNaN(limit)) return message.safeReply("Forneça uma entrada de número");
      response = await setupLimit(limit, data.settings);
    }

    // Close ticket
    else if (input === "close") {
      response = await close(message, message.author);
      if (!response) return;
    }

    // Close all tickets
    else if (input === "closeall") {
      let sent = await message.safeReply("Closing tickets ...");
      response = await closeAll(message, message.author);
      return sent.editable ? sent.edit(response) : message.channel.send(response);
    }

    // Add user to ticket
    else if (input === "add") {
      if (args.length < 2) return message.safeReply("Forneça um usuário ou função para adicionar ao ticket");
      let inputId;
      if (message.mentions.users.size > 0) inputId = message.mentions.users.first().id;
      else if (message.mentions.roles.size > 0) inputId = message.mentions.roles.first().id;
      else inputId = args[1];
      response = await addToTicket(message, inputId);
    }

    // Remove user from ticket
    else if (input === "remove") {
      if (args.length < 2) return message.safeReply("Forneça um usuário ou função para remover");
      let inputId;
      if (message.mentions.users.size > 0) inputId = message.mentions.users.first().id;
      else if (message.mentions.roles.size > 0) inputId = message.mentions.roles.first().id;
      else inputId = args[1];
      response = await removeFromTicket(message, inputId);
    }

    // Invalid input
    else {
      return message.safeReply("Uso de comando incorreto");
    }

    if (response) await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    let response;

    // setup
    if (sub === "setup") {
      const channel = interaction.options.getChannel("channel");

      if (!interaction.guild.members.me.permissions.has("ManageChannels")) {
        return interaction.followUp("Estou perdendo `Gerenciar canais` para criar canais de tickets");
      }

      await interaction.deleteReply();
      return ticketModalSetup(interaction, channel, data.settings);
    }

    // Log channel
    else if (sub === "log") {
      const channel = interaction.options.getChannel("channel");
      response = await setupLogChannel(channel, data.settings);
    }

    // Limit
    else if (sub === "limit") {
      const limit = interaction.options.getInteger("amount");
      response = await setupLimit(limit, data.settings);
    }

    // Close
    else if (sub === "close") {
      response = await close(interaction, interaction.user);
    }

    // Close all
    else if (sub === "closeall") {
      response = await closeAll(interaction, interaction.user);
    }

    // Add to ticket
    else if (sub === "add") {
      const inputId = interaction.options.getString("user_id");
      response = await addToTicket(interaction, inputId);
    }

    // Remove from ticket
    else if (sub === "remove") {
      const user = interaction.options.getUser("user");
      response = await removeFromTicket(interaction, user.id);
    }

    if (response) await interaction.followUp(response);
  },
};

/**
 * @param {import('discord.js').Message} param0
 * @param {import('discord.js').GuildTextBasedChannel} targetChannel
 * @param {object} settings
 */
async function ticketModalSetup({ guild, channel, member }, targetChannel, settings) {
  const buttonRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("ticket_btnSetup").setLabel("Setup Message").setStyle(ButtonStyle.Primary)
  );

  const sentMsg = await channel.safeSend({
    content: "Clique no botão abaixo para configurar a mensagem do ticket",
    components: [buttonRow],
  });

  if (!sentMsg) return;

  const btnInteraction = await channel
    .awaitMessageComponent({
      componentType: ComponentType.Button,
      filter: (i) => i.customId === "ticket_btnSetup" && i.member.id === member.id && i.message.id === sentMsg.id,
      time: 20000,
    })
    .catch((ex) => {});

  if (!btnInteraction)
    return sentMsg.edit({ content: "Nenhuma resposta recebida, cancelando a configuração", components: [] });

  // display modal
  await btnInteraction.showModal(
    new ModalBuilder({
      customId: "ticket-modalSetup",
      title: "Ticket Setup",
      components: [
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("title")
            .setLabel("Embed Title")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("description")
            .setLabel("Embed Description")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("footer")
            .setLabel("Embed Footer")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("staff")
            .setLabel("Staff Roles")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        ),
      ],
    })
  );

  // receive modal input
  const modal = await btnInteraction
    .awaitModalSubmit({
      time: 1 * 60 * 1000,
      filter: (m) => m.customId === "ticket-modalSetup" && m.member.id === member.id && m.message.id === sentMsg.id,
    })
    .catch((ex) => {});

  if (!modal) return sentMsg.edit({ content: "Nenhuma resposta recebida, cancelando a configuração", components: [] });

  await modal.reply("Setting up ticket message ...");
  const title = modal.fields.getTextInputValue("title");
  const description = modal.fields.getTextInputValue("description");
  const footer = modal.fields.getTextInputValue("footer");
  const staffRoles = modal.fields
    .getTextInputValue("staff")
    .split(",")
    .filter((s) => guild.roles.cache.has(s.trim()));

  // send ticket message for support team
const embed = new EmbedBuilder()
.setColor(EMBED_COLORS.BOT_EMBED)
.setAuthor({ name: title || "Ticket de Suporte" })
.setDescription(
    `Olá, equipe de suporte,

     Aqui estão as etapas que você deve seguir para garantir que o atendimento seja realizado de forma eficiente:

    - **Clique no botão abaixo para criar um bilhete** e registrar o novo ticket.
    - **No canal do ticket**, utilize o comando **/ticket add** para chamar um membro para fornecer suporte.
    - **Revise as informações fornecidas** pelo usuário no ticket e inicie a resolução conforme necessário.

    **Notas Importantes:**
    - **Gerenciamento de Tickets:** Lembre-se de que você pode ter apenas um ticket ativo por vez. Certifique-se de concluir um ticket antes de assumir outro.
    - **Comunicação Clara:** Forneça atualizações claras e frequentes no canal do ticket para manter o usuário informado sobre o progresso.
    - **Documentação:** Mantenha um registro detalhado de todas as interações e resoluções para referência futura e para garantir que os problemas sejam resolvidos de maneira completa.

    Agradecemos seu empenho em garantir uma experiência de suporte excelente.

    Atenciosamente;`
)
.setFooter({ text: footer || "Gerenciamento de tickets: Apenas um ticket ativo por vez." });

const tktBtnRow = new ActionRowBuilder().addComponents(
new ButtonBuilder()
    .setLabel("Criar Novo Ticket")
    .setCustomId("TICKET_CREATE")
    .setStyle(ButtonStyle.Success)
);

// Enviar o embed e a linha de botões para o canal apropriado ou para os membros da equipe

  // save configuration
  settings.ticket.staff_roles = staffRoles;
  await settings.save();

  await targetChannel.send({ embeds: [embed], components: [tktBtnRow] });
  await modal.deleteReply();
  await sentMsg.edit({ content: "Feito! Mensagem de ticket criada", components: [] });
}

async function setupLogChannel(target, settings) {
  if (!target.canSendEmbeds()) return `Ops! Eu tenho permissão para enviar incorporação para ${target}`;

  settings.ticket.log_channel = target.id;
  await settings.save();

  return `Configuração salva! Os logs de tickets serão enviados para ${target.toString()}`;
}

async function setupLimit(limit, settings) {
  if (Number.parseInt(limit, 10) < 5) return "O limite de ingressos não pode ser inferior a 5";

  settings.ticket.limit = limit;
  await settings.save();

  return `Configuração salva. Agora você pode ter no máximo \`${limit}\` bilhetes abertos`;
}

async function close({ channel }, author) {
  if (!isTicketChannel(channel)) return "Este comando só pode ser usado em canais de ticket";
  const status = await closeTicket(channel, author, "Fechado por um moderador");
  if (status === "MISSING_PERMISSIONS") return "Não tenho permissão para fechar tickets";
  if (status === "ERROR") return "Ocorreu um erro ao fechar o ticket";
  return null;
}

async function closeAll({ guild }, user) {
  const stats = await closeAllTickets(guild, user);
  return `Completed! Success: \`${stats[0]}\` Failed: \`${stats[1]}\``;
}

async function addToTicket({ channel }, inputId) {
  if (!isTicketChannel(channel)) return "Este comando só pode ser usado no canal de ticket.";
  if (!inputId) return "Você precisa fornecer um ID de usuário ou função.";
  
  try {
    // Verifica se o ID é válido
    const validId = !isNaN(inputId) && (channel.guild.members.cache.has(inputId) || channel.guild.roles.cache.has(inputId));
    if (!validId) return "ID de usuário ou função inválido.";

    await channel.permissionOverwrites.create(inputId, {
      ViewChannel: true,
      SendMessages: true,
    });
    return "Membro chamado para o suporte com sucesso!";
  } catch (ex) {
    console.error("Erro ao adicionar usuário/função:", ex);
    return "Falha ao adicionar usuário/função. Verifique se o ID fornecido é válido e se o bot tem permissões adequadas.";
  }
}

async function removeFromTicket({ channel }, inputId) {
  if (!isTicketChannel(channel)) return "Este comando só pode ser usado no canal de ticket";
  if (!inputId || isNaN(inputId)) return "Ops! Você precisa inserir um userId/roleId válido";

  try {
    channel.permissionOverwrites.create(inputId, {
      ViewChannel: false,
      SendMessages: false,
    });
    return "Membro foi adicionado ao suporte!";
  } catch (ex) {
    return "Falha ao remover usuário/função. Você forneceu um ID válido?";
  }
}
