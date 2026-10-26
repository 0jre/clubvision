const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

module.exports = {
  name: "mensagem",
  description: "Enviar mensagem para um canal específico",
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "channel",
        description: "Canal para enviar a mensagem",
        type: ApplicationCommandOptionType.Channel,
        channelTypes: [ChannelType.GuildText],
        required: true,
      },
      {
        name: "conteudo",
        description: "Conteúdo da mensagem",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async interactionRun(interaction) {
    const channel = interaction.options.getChannel("channel");
    const content = interaction.options.getString("conteudo");

    // Verifica se o autor da interação é um administrador ou tem um cargo específico
    const isAdmin = interaction.member.permissions.has("ADMINISTRATOR");
    const hasSpecificRole = interaction.member.roles.cache.some((role) => role.id === "1048984556885262427");

    if (!isAdmin && !hasSpecificRole) {
      return interaction.followUp("Você não tem permissão para usar este comando.");
    }

    try {
      const message = await channel.send(content);
      interaction.followUp(`Mensagem enviada para ${channel}`);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      interaction.followUp("Ocorreu um erro ao enviar a mensagem.");
    }
  },
};
