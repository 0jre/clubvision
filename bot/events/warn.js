/**
 * @param {import('@root/bot/structures').BotClient} client
 * @param {string} message
 */
module.exports = async (client, message) => {
  client.logger.warn(`Aviso de cliente: ${message}`);
};
