const { vUnmuteTarget } = require("@root/bot/helpers/ModUtils");

module.exports = async ({ member }, target, reason) => {
  const response = await vUnmuteTarget(member, target, reason);
  if (typeof response === "boolean") {
    return `${target.user.tag}'S Voz não é ou não servido neste servidor`;
  }
  if (response === "MEMBER_PERM") {
    return `Você não tem permissão para expressar atividades ${target.user.tag}`;
  }
  if (response === "BOT_PERM") {
    return `Eu não tenho permissão para expressar o som ${target.user.tag}`;
  }
  if (response === "NO_VOICE") {
    return `${target.user.tag} não está em nenhum canal de vozl`;
  }
  if (response === "NOT_MUTED") {
    return `${target.user.tag} não é a voz silenciada`;
  }
  return `Falhou em expressar o som ${target.user.tag}`;
};
