const { EmbedBuilder } = require("discord.js");
const { getUser } = require("@root/bot/database/schemas/User");
const { ECONOMY, EMBED_COLORS } = require("@root/bot/config");

module.exports = async (self, target, coins) => {
  if (isNaN(coins) || coins <= 0) return "Por favor, insira uma quantidade válida de moedas para transferir";
  if (target.bot) return "Você não pode transferir moedas para os bots!";
  if (target.id === self.id) return "Você não pode transferir moedas para si mesmo!";

  const userDb = await getUser(self);

  if (userDb.esmeralda < coins) {
    return `Saldo bancário insuficiente!Você só tem ${userDb.esmeralda}${ECONOMY.CURRENCY} em sua conta bancária.${
      userDb.coins > 0 && "\nVocê deve depositar suas moedas no banco antes de poder transferir"
    } `;
  }

  const targetDb = await getUser(target);

  userDb.esmeralda -= coins;
  targetDb.esmeralda += coins;

  await userDb.save();
  await targetDb.save();

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setAuthor({ name: "Saldo atualizado" })
    .setDescription(`Você transferiu com sucesso ${coins}${ECONOMY.CURRENCY} to ${target.tag}`)
    .setTimestamp(Date.now());

  return { embeds: [embed] };
};
