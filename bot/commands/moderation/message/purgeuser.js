const { purgeMessages } = require("@root/bot/helpers/ModUtils");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "purgeuser",
  description: "exclui a quantidade especificada de mensagens",
  category: "MODERATION",
  userPermissions: ["ManageMessages"],
  botPermissions: ["ManageMessages", "ReadMessageHistory"],
  command: {
    enabled: true,
    usage: "<@user|ID> [amount]",
    aliases: ["purgeusers"],
    minArgsCount: 1,
  },

  async messageRun(message, args) {
    const target = await message.guild.resolveMember(args[0]);
    if (!target) return message.safeReply(`Nenhum usuário encontrou correspondência ${args[0]}`);
    const amount = (args.length > 1 && args[1]) || 99;

    if (amount) {
      if (isNaN(amount)) return message.safeReply("Os números são permitidos apenas");
      if (parseInt(amount) > 99) return message.safeReply("A quantidade máxima de mensagens que eu posso excluir é 99");
    }

    const { channel } = message;
    const response = await purgeMessages(message.member, message.channel, "USER", amount, target);

    if (typeof response === "number") {
      return channel.safeSend(`Excluído com sucesso ${response} mensagens`, 5);
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
