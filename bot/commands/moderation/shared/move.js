const { moveTarget } = require("@root/bot/helpers/ModUtils");

module.exports = async ({ member }, target, reason, channel) => {
  const response = await moveTarget(member, target, reason, channel);
  if (typeof response === "boolean") {
    return `${target.user.tag} foi movido com sucesso para: ${channel}`;
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
  if (response === "TARGET_PERM") {
    return `${target.user.tag} não tem permissão para ingressar ${channel}`;
  }
  if (response === "ALREADY_IN_CHANNEL") {
    return `${target.user.tag} já está conectado a ${channel}`;
  }
  return `Falhou em se mover ${target.user.tag} para ${channel}`;
};
