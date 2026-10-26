const { EmbedBuilder } = require("discord.js");
const { getUser } = require("@root/bot/database/schemas/User");
const { EMBED_COLORS, ECONOMY } = require("@root/bot/config.js");
const { diffHours, getRemainingTime } = require("@root/bot/helpers/Utils");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "daily",
  description: "receber um bônus diário",
  category: "ECONOMY",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
  },

  async messageRun(message, args) {
    const response = await daily(message.author);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const response = await daily(interaction.user);
    await interaction.followUp(response);
  },
};

async function daily(user) {
  const userDb = await getUser(user);
  let streak = 0;

  if (userDb.daily.timestamp) {
    const lastUpdated = new Date(userDb.daily.timestamp);
    const difference = diffHours(new Date(), lastUpdated);
    if (difference < 24) {
      const nextUsage = lastUpdated.setHours(lastUpdated.getHours() + 24);
      return `Você pode novamente executar este comando em \`${getRemainingTime(nextUsage)}\``;
    }
    streak = userDb.daily.streak || streak;
    if (difference < 48) streak += 1;
    else streak = 0;
  }

  userDb.daily.streak = streak;
  userDb.esmeralda += ECONOMY.DAILY_COINS;
  userDb.daily.timestamp = new Date();
  await userDb.save();

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
    .setDescription(
      `Você tem ${ECONOMY.DAILY_COINS}${ECONOMY.CURRENCY}Como sua recompensa diária\n` +
        `**Saldo Event Points atualizado:** ${userDb.esmeralda}${ECONOMY.CURRENCY}`
    );

  return { embeds: [embed] };
}
