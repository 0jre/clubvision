const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "autorole",
  description: "função de configuração a ser dada quando um membro se junta ao servidor",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    usage: "<role|off>",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "add",
        description: "Configure o autorole",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "role",
            description: "o papel a ser dado",
            type: ApplicationCommandOptionType.Role,
            required: false,
          },
          {
            name: "role_id",
            description: "o ID de função a ser dado",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "remove",
        description: "Desative o autorole",
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
  },

  async messageRun(message, args, data) {
    const input = args.join(" ");
    let response;

    if (input.toLowerCase() === "off") {
      response = await setAutoRole(message, null, data.settings);
    } else {
      const roles = message.guild.findMatchingRoles(input);
      if (roles.length === 0) response = "No matching roles found matching your query";
      else response = await setAutoRole(message, roles[0], data.settings);
    }

    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    let response;

    // add
    if (sub === "add") {
      let role = interaction.options.getRole("role");
      if (!role) {
        const role_id = interaction.options.getString("role_id");
        if (!role_id) return interaction.followUp("Por favor, forneça uma função ou ID de função");

        const roles = interaction.guild.findMatchingRoles(role_id);
        if (roles.length === 0)
          return interaction.followUp("Nenhuma função correspondente encontrou correspondendo sua consulta");
        role = roles[0];
      }

      response = await setAutoRole(interaction, role, data.settings);
    }

    // remove
    else if (sub === "remove") {
      response = await setAutoRole(interaction, null, data.settings);
    }

    // default
    else response = "Subcomando inválido";

    await interaction.followUp(response);
  },
};

/**
 * @param {import("discord.js").Message | import("discord.js").CommandInteraction} message
 * @param {import("discord.js").Role} role
 * @param {import("@models/Guild")} settings
 */
async function setAutoRole({ guild }, role, settings) {
  if (role) {
    if (role.id === guild.roles.everyone.id) return "Você não pode definir `@everyone` como o autorole";
    if (!guild.members.me.permissions.has("ManageRoles")) return "Eu não tenho a permissão `gerente '";
    if (guild.members.me.roles.highest.position < role.position)
      return "Eu não tenho permissões para atribuir esta função";
    if (role.managed) return "Opa!Este papel é gerenciado por uma integração";
  }

  if (!role) settings.autorole = null;
  else settings.autorole = role.id;

  await settings.save();
  return `Configuração salva!Autorole é ${!role ? "desabilitada" : "configurar"}`;
}
