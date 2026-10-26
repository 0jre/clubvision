const { musicValidations } = require("@root/bot/helpers/BotUtils");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "skip",
  description: "Pule a música atual",
  category: "MUSIC",
  validations: musicValidations,
  command: {
    enabled: true,
    aliases: ["next"],
  },
  slashCommand: {
    enabled: true,
  },

  async messageRun(message, args) {
    const response = skip(message);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const response = skip(interaction);
    await interaction.followUp(response);
  },
};

/**
 * @param {import("discord.js").CommandInteraction|import("discord.js").Message} arg0
 */
function skip({ client, guildId }) {
  const player = client.musicManager.getPlayer(guildId);

  // check if current song is playing
  if (!player.queue.current) return "⏯️ Não há nenhuma música atualmente sendo tocada";

  const { title } = player.queue.current;
  return player.queue.next() ? `⏯️ ${title} foi pulado.` : "⏯️ Não há música para pular.";
}
