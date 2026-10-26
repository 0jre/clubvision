const { vMuteTarget } = require("@root/bot/helpers/ModUtils");

module.exports = async ({ member }, target, reason) => {
  const response = await vMuteTarget(member, target, reason);
  if (typeof response === "boolean") {
    return `${target.user.tag}'s A voz está silenciada neste servidor`;
  }
  if (response === "MEMBER_PERM") {
    return `Você não tem permissão para expressar mudas ${target.user.tag}`;
  }
  if (response === "BOT_PERM") {
    return `Eu não tenho permissão para expressar mudas ${target.user.tag}`;
  }
  if (response === "NO_VOICE") {
    return `${target.user.tag} não está em nenhum canal de voz`;
  }
  if (response === "ALREADY_MUTED") {
    return `${target.user.tag}já está silenciado`;
  }
  return `Falhou em expressar mudo ${target.user.tag}`;
};
