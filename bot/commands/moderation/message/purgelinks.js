const { purgeMessages } = require("@root/bot/helpers/ModUtils");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "purgelinks",
  description: "exclui a quantidade especificada de mensagens com links",
  category: "MODERATION",
  userPermissions: ["ManageMessages"],
  botPermissions: ["ManageMessages", "ReadMessageHistory"],
  command: {
    enabled: true,
    usage: "[amount]",
    aliases: ["purgelink"],
  },

  async messageRun(message, args) {
    const amount = args[0] || 99;

    if (amount) {
      if (isNaN(amount)) return message.safeReply("Os números são permitidos apenas");
      if (parseInt(amount) > 99) return message.safeReply("A quantidade máxima de mensagens que eu posso excluir é 99");
    }

    const { channel } = message;
    const response = await purgeMessages(message.member, message.channel, "LINK", amount);

    if (typeof response === "number") {
      return channel.safeSend(`Excluído com sucesso ${response} messages`, 5);
    } else if (response === "BOT_PERM") {
      return message.safeReply(
        "Eu não tenho `Leia o histórico de mensagens` & `Gerenciar mensagens` para excluir mensagens",
        5
      );
    } else if (response === "MEMBER_PERM") {
      return message.safeReply(
        "Você não tem `Leia o histórico de mensagens` & `Gerenciar mensagens` para excluir mensagens",
        5
      );
    } else if (response === "NO_MESSAGES") {
      return channel.safeSend("Nenhuma mensagem encontrada que pode ser limpa", 5);
    } else {
      return message.safeReply(`Ocorreu um erro!Falha ao excluir mensagens`);
    }
  },
};
