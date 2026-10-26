const { ApplicationCommandOptionType } = require("discord.js");
const balance = require("./sub/balance");
const deposit = require("./sub/deposit");
const transfer = require("./sub/transfer");
const withdraw = require("./sub/withdraw");

/**
 * @type {import("@root/bot/structures/Command")}
 */
module.exports = {
  name: "bank",
  description: "Acesso a operações bancárias",
  category: "ECONOMY",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "balance",
        description: "Verifique seu saldo",
      },
      {
        trigger: "deposit <coins>",
        description: "depositar gold coins para carteira event points",
      },
      {
        trigger: "withdraw <coins>",
        description: "retirar moedas da carteira event points",
      },
      {
        trigger: "transfer <user> <coins>",
        description: "transferir moedas para outro usuário",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "balance",
        description: "Verifique seu equilíbrio de moedas",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "nome do usuário",
            type: ApplicationCommandOptionType.User,
            required: false,
          },
        ],
      },
      {
        name: "deposit",
        description: "depositar moedas em sua carteira event points",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "coins",
            description: "Número de moedas para depositar",
            type: ApplicationCommandOptionType.Integer,
            required: true,
          },
        ],
      },
      {
        name: "withdraw",
        description: "retirar moedas da sua carteira event points",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "coins",
            description: "Número de moedas para retirar",
            type: ApplicationCommandOptionType.Integer,
            required: true,
          },
        ],
      },
      {
        name: "transfer",
        description: "transferir moedas para outro usuário",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "o usuário para quem as moedas devem ser transferidas",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "coins",
            description: "a quantidade de moedas para transferir",
            type: ApplicationCommandOptionType.Integer,
            required: true,
          },
        ],
      },
    ],
  },

  async messageRun(message, args) {
    const sub = args[0];
    let response;

    if (sub === "balance") {
      const resolved = (await message.guild.resolveMember(args[1])) || message.member;
      response = await balance(resolved.user);
    }

    //
    else if (sub === "deposit") {
      const coins = args.length && parseInt(args[1]);
      if (isNaN(coins)) return message.safeReply("Forneça um número válido de moedas que você deseja depositar em sua carteira Event Points");
      response = await deposit(message.author, coins);
    }

    //
    else if (sub === "withdraw") {
      const coins = args.length && parseInt(args[1]);
      if (isNaN(coins)) return message.safeReply("Forneça um número válido de moedas que você deseja retirar");
      response = await withdraw(message.author, coins);
    }

    //
    else if (sub === "transfer") {
      if (args.length < 3) return message.safeReply("Forneça um usuário válido e moedas para transferir");
      const target = await message.guild.resolveMember(args[1], true);
      if (!target) return message.safeReply("Fornecer um usuário válido para transferir moedas para");
      const coins = parseInt(args[2]);
      if (isNaN(coins)) return message.safeReply("Forneça um número válido de moedas que você deseja transferir");
      response = await transfer(message.author, target.user, coins);
    }

    //
    else {
      return message.safeReply("Uso do comando inválido");
    }

    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const sub = interaction.options.getSubcommand();
    let response;

    // balance
    if (sub === "balance") {
      const user = interaction.options.getUser("user") || interaction.user;
      response = await balance(user);
    }

    // deposit
    else if (sub === "con") {
      const coins = interaction.options.getInteger("coins");
      response = await deposit(interaction.user, coins);
    }

    // withdraw
    else if (sub === "withdraw") {
      const coins = interaction.options.getInteger("coins");
      response = await withdraw(interaction.user, coins);
    }

    // transfer
    else if (sub === "transfer") {
      const user = interaction.options.getUser("user");
      const coins = interaction.options.getInteger("coins");
      response = await transfer(interaction.user, user, coins);
    }

    await interaction.followUp(response);
  },
};
