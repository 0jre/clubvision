const { disconnectTarget } = require("@root/bot/helpers/ModUtils");

module.exports = async ({ member }, target, reason) => {
  const response = await disconnectTarget(member, target, reason);
  if (typeof response === "boolean") {
    return `${target.user.tag} está desconectado do canal de voz`;
  }
  if (response === "MEMBER_PERM") {
    return `Você não tem permissão para desconectar ${target.user.tag}`;
  }
  if (response === "BOT_PERM") {
    return `Eu não tenho permissão para desconectar ${target.user.tag}`;
  }
  if (response === "NO_VOICE") {
    return `${target.user.tag} não está em nenhum canal de voz`;
  }
  return `Falhou em desconectar ${target.user.tag}`;
};
