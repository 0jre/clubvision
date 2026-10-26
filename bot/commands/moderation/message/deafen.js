const deafen = require("../shared/deafen");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "deafen",
  description: "Membro de Dexeled especificado em canais de voz",
  category: "MODERATION",
  userPermissions: ["DeafenMembers"],
  botPermissions: ["DeafenMembers"],
  command: {
    enabled: true,
    usage: "<ID|@member> [reason]",
    minArgsCount: 1,
  },

  async messageRun(message, args) {
    const target = await message.guild.resolveMember(args[0], true);
    if (!target) return message.safeReply(`Nenhum usuário encontrou correspondência ${args[0]}`);
    const reason = message.content.split(args[0])[1].trim();
    const response = await deafen(message, target, reason);
    await message.safeReply(response);
  },
};
