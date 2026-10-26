const fs = require("fs");
const path = require("path");
const pino = require("pino"); // Make sure you import pino
const { EmbedBuilder } = require("discord.js"); // Assuming you're using discord.js for webhooks
const config = require("@root/bot/config"); // Assuming you have a config file for EMBED_COLORS and webhookLogger

const today = new Date(); // Define today here

const logDir = process.env.NODE_ENV === "production" ? "/tmp" : path.join(process.cwd(), "logs");
const logFile = `${logDir}/combined-${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}.log`;

// Verifica se o diretório existe, caso contrário, cria
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Assuming webhookLogger is defined elsewhere, e.g., initialized from discord.js WebhookClient
// For demonstration, let's assume it's imported or defined
const webhookLogger = null; // Replace with your actual webhook logger initialization

const pinoLogger = pino.default(
  {
    level: "debug",
  },
  pino.multistream([
    {
      level: "info",
      stream: pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:mm:ss",
          ignore: "pid,hostname",
          singleLine: false,
          hideObject: true,
          customColors: "info:blue,warn:yellow,error:red",
        },
      }),
    },
    {
      level: "debug",
      stream: pino.destination({
        dest: logFile,
        sync: true,
      }),
    },
  ])
);

function sendWebhook(content, err) {
  if (!content && !err) return;
  const errString = err?.stack || err;

  const embed = new EmbedBuilder().setColor(config.EMBED_COLORS.ERROR).setAuthor({ name: err?.name || "Error" });

  if (errString)
    embed.setDescription(
      "```js\n" + (errString.length > 4096 ? `${errString.substr(0, 4000)}...` : errString) + "\n```"
    );

  embed.addFields({ name: "Description", value: content || err?.message || "NA" });
  webhookLogger.send({ username: "Logs", embeds: [embed] }).catch((ex) => {});
}

module.exports = class Logger {
  /**
   * @param {string} content
   */
  static success(content) {
    pinoLogger.info(content);
  }

  /**
   * @param {string} content
   */
  static log(content) {
    pinoLogger.info(content);
  }

  /**
   * @param {string} content
   */
  static warn(content) {
    pinoLogger.warn(content);
  }

  /**
   * @param {string} content
   * @param {object} ex
   */
  static error(content, ex) {
    if (ex) {
      pinoLogger.error(ex, `${content}: ${ex?.message}`);
    } else {
      pinoLogger.error(content);
    }
    if (webhookLogger) sendWebhook(content, ex);
  }

  /**
   * @param {string} content
   */
  static debug(content) {
    pinoLogger.debug(content);
  }
};