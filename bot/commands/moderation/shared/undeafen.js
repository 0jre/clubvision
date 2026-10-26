const { unDeafenTarget } = require("@root/bot/helpers/ModUtils");

module.exports = async ({ member }, target, reason) => {
  const response = await unDeafenTarget(member, target, reason);
  if (typeof response === "boolean") {
    return `${target.user.tag} está ensurdecido neste servidor`;
  }
  if (response === "MEMBER_PERM") {
    return `Você não tem permissão para surde ${target.user.tag}`;
  }
  if (response === "BOT_PERM") {
    return `Eu não tenho permissão para surde ${target.user.tag}`;
  }
  if (response === "NO_VOICE") {
    return `${target.user.tag} não está em nenhum canal de voz`;
  }
  if (response === "NOT_DEAFENED") {
    return `${target.user.tag} não está ensurdecido`;
  }
  return `Falhou em surda ${target.user.tag}`;
};
