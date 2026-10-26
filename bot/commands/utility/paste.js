const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { postToBin } = require("@root/bot/helpers/HttpUtils");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "paste",
  description: "Cole algo em sourceb.in",
  cooldown: 5,
  category: "UTILITY",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    minArgsCount: 2,
    usage: "<title> <content>",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "title",
        description: "Título do seu conteúdo",
        required: true,
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "content",
        description: "Conteúdo para ser postado para Bin",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async messageRun(message, args) {
    const title = args.shift();
    const content = args.join(" ");
    const response = await paste(content, title);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const title = interaction.options.getString("title");
    const content = interaction.options.getString("content");
    const response = await paste(content, title);
    await interaction.followUp(response);
  },
};

async function paste(content, title) {
  const response = await postToBin(content, title);
  if (!response) return "❌ Algo deu errado";

  const embed = new EmbedBuilder()
    .setAuthor({ name: "Paste links" })
    .setDescription(`🔸 Normal: ${response.url}\n🔹 Raw: ${response.raw}`);

  return { embeds: [embed] };
}
