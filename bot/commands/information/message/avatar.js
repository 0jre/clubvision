const avatarInfo = require("../shared/avatar");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "avatar",
  description: "mostra informações de avatar a usuários",
  category: "INFORMATION",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "[@member|id]",
  },

  async messageRun(message, args) {
    const target = (await message.guild.resolveMember(args[0])) || message.member;
    const response = avatarInfo(target.user);
    await message.safeReply(response);
  },
};
