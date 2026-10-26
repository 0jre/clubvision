const { EmbedBuilder } = require("discord.js");
const { getUser } = require("@root/bot/database/schemas/User");
const { EMBED_COLORS, ECONOMY } = require("@root/bot/config");

module.exports = async (user) => {
  const economy = await getUser(user);

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setAuthor({ name: user.username })
    .setThumbnail(user.displayAvatarURL())
    .addFields(
      {
        name: "Gold Coins",
        value: `${economy?.coins || 0}${ECONOMY.CURRENCY}`,
        inline: true,
      },
      {
        name: "Event Points",
        value: `${economy?.esmeralda || 0}${ECONOMY.CURRENCY}`,
        inline: true,
      },
      {
        name: "Patrimônio líquido",
        value: `${(economy?.coins || 0) + (economy?.esmeralda || 0)}${ECONOMY.CURRENCY}`,
        inline: true,
      }
    );

  return { embeds: [embed] };
};
