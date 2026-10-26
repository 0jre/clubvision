const { timeoutTarget } = require("@root/bot/helpers/ModUtils");
const { ApplicationCommandOptionType } = require("discord.js");
const ems = require("enhanced-ms");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "timeout",
  description: "Tempo limite o membro especificado",
  category: "MODERATION",
  botPermissions: ["ModerateMembers"],
  userPermissions: ["ModerateMembers"],
  command: {
    enabled: true,
    aliases: ["mute"],
    usage: "<ID|@member> <duration> [reason]",
    minArgsCount: 2,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "user",
        description: "o membro alvo",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "duration",
        description: "o tempo para o tempo limite o membro para",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "reason",
        description: "Razão para o tempo limite",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    const target = await message.guild.resolveMember(args[0], true);
    if (!target) return message.safeReply(`Nenhum usuário encontrou correspondência ${args[0]}`);

    // parse time
    const ms = ems(args[1]);
    if (!ms) return message.safeReply("Forneça uma duração válida.Exemplo: 1d/1h/1m/1s");

    const reason = args.slice(2).join(" ").trim();
    const response = await timeout(message.member, target, ms, reason);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const user = interaction.options.getUser("user");

    // parse time
    const duration = interaction.options.getString("duração");
    const ms = ems(duration);
    if (!ms) return interaction.followUp("Forneça uma duração válida.Exemplo: 1d/1h/1m/1s");

    const reason = interaction.options.getString("reason");
    const target = await interaction.guild.members.fetch(user.id);

    const response = await timeout(interaction.member, target, ms, reason);
    await interaction.followUp(response);
  },
};

async function timeout(issuer, target, ms, reason) {
  if (isNaN(ms)) return "Forneça uma duração válida.Exemplo: 1d/1h/1m/1s";
  const response = await timeoutTarget(issuer, target, ms, reason);
  if (typeof response === "boolean") return `${target.user.tag} é cronometrado!`;
  if (response === "BOT_PERM") return `Eu não tenho permissão para o tempo limite ${target.user.tag}`;
  else if (response === "MEMBER_PERM") return `Você não tem permissão para o tempo limite ${target.user.tag}`;
  else if (response === "ALREADY_TIMEOUT") return `${target.user.tag} já está cronometrado!`;
  else return `Falhou em tempo limite ${target.user.tag}`;
}
