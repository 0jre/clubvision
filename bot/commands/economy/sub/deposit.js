const { EmbedBuilder } = require("discord.js");
const { getUser } = require("@root/bot/database/schemas/User");
const { ECONOMY, EMBED_COLORS } = require("@root/bot/config");

module.exports = async (user, coins) => {
  if (isNaN(coins) || coins <= 0) return "Por favor, insira uma quantidade válida de moedas para depositar";
  const userDb = await getUser(user);

  if (coins > userDb.coins) return `Você só tem ${userDb.coins}${ECONOMY.CURRENCY} Moedas em sua carteira`;

  userDb.coins -= coins;
  userDb.esmeralda += coins;
  await userDb.save();

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setAuthor({ name: "Novo balanço" })
    .setThumbnail(user.displayAvatarURL())
    .addFields(
      {
        name: "Gold Coins",
        value: `${userDb.coins}${ECONOMY.CURRENCY}`,
        inline: true,
      },
      {
        name: "Event Points",
        value: `${userDb.esmeralda}${ECONOMY.CURRENCY}`,
        inline: true,
      },
      {
        name: "Patrimônio líquido",
        value: `${userDb.coins + userDb.esmeralda}${ECONOMY.CURRENCY}`,
        inline: true,
      }
    );

  return { embeds: [embed] };
};
