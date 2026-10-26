module.exports = {
  OWNER_IDS: ["701975084239159328"], // Bot owner ID's
  SUPPORT_SERVER: "1052813530191122502", // Your bot support server
  PREFIX_COMMANDS: {
    ENABLED: false, // Enable/Disable prefix commands
    DEFAULT_PREFIX: "!", // Default prefix for the bot
  },

  
  INTERACTIONS: {
    SLASH: true, // Should the interactions be enabled
    CONTEXT: true, // Should contexts be enabled
    GLOBAL: true, // Should the interactions be registered globally
    TEST_GUILD_ID: "1053259244817879100", // Guild ID where the interactions should be registered. [** Test you commands here first **]
  },
  EMBED_COLORS: {
    BOT_EMBED: "#3b3b3e",
    TRANSPARENT: "#3b3b3e",
    SUCCESS: "#3b3b3e",
    ERROR: "#3b3b3e",
    WARNING: "#3b3b3e",
  },
  CACHE_SIZE: {
    GUILDS: 100,
    USERS: 10000,
    MEMBERS: 10000,
  },
  MESSAGES: {
    API_ERROR: "Erro de back-end inesperado!Tente novamente mais tarde ou entre em contato com o servidor de suporte",
  },

  // PLUGINS

  AUTOMOD: {
    ENABLED: true,
    LOG_EMBED: "#36393F",
    DM_EMBED: "#36393F",
  },

  DASHBOARD: {
    enabled: false, // enable or disable dashboard
    baseURL: "http://localhost:3000", // base url
    failureURL: "http://localhost:3000", // failure redirect url
    port: "3000", // port to run the bot on
  },

  ECONOMY: {
    ENABLED: true,
    CURRENCY: "Orbits",
    DAILY_COINS: 1550, // moedas a serem recebidas pelo comando diário
    MIN_BEG_AMOUNT: 10, // minimum coins to be received when beg command is used
    MAX_BEG_AMOUNT: 12500, //Moedas máximas a serem recebidas quando o comando BEG for usado
  },

  MUSIC: {
    ENABLED: true,
    IDLE_TIME: 60, // Time in seconds before the bot disconnects from an idle voice channel
    MAX_SEARCH_RESULTS: 245,
    DEFAULT_SOURCE: "YTM", // YT = Youtube, YTM = Youtube Music, SC = SoundCloud
    // Add any number of lavalink nodes here
    // Refer to https://github.com/freyacodes/Lavalink to host your own lavalink server
    LAVALINK_NODES: [
      {
        host: "lava1.horizxon.tech", //localhost
        port: 443, //2333
        password: "horizxon.tech", //youshallnotpass
        id: "Local Node",
        secure: true,
      },
    ],
  },

  GIVEAWAYS: {
    ENABLED: true,
    REACTION: "🎁",
    START_EMBED: "#3b3b3e",
    END_EMBED: "#3b3b3e",
  },

  IMAGE: {
    ENABLED: false,
    BASE_API: "https://strangeapi.fun/api",
  },

  INVITE: {
    ENABLED: false,
  },

  MODERATION: {
    ENABLED: true,
    EMBED_COLORS: {
      TIMEOUT: "#3b3b3e",
      UNTIMEOUT: "#3b3b3e",
      KICK: "#3b3b3e",
      SOFTBAN: "#3b3b3e",
      BAN: "#3b3b3e",
      UNBAN: "#3b3b3e",
      VMUTE: "#3b3b3e",
      VUNMUTE: "#3b3b3e",
      DEAFEN: "#3b3b3e",
      UNDEAFEN: "#3b3b3e",
      DISCONNECT: "#3b3b3e",
      MOVE: "#3b3b3e",
    },
  },

  PRESENCE: {
    ENABLED: true, // Whether or not the bot should update its status
    STATUS: "dnd", // The bot's status [online, idle, dnd, invisible]
    TYPE: "WATCHING", // Status type for the bot [PLAYING | LISTENING | WATCHING | COMPETING]
    MESSAGE: "clubvision", // Your bot status message
  },

  STATS: {
    ENABLED: true,
    XP_COOLDOWN: 5,
    DEFAULT_LVL_UP_MSG: "{member:tag}, voce avançou mais um **Level {level}**",
  },

  SUGGESTIONS: {
    ENABLED: true,
    EMOJI: {
      UP_VOTE: "⬆️",
      DOWN_VOTE: "⬇️",
    },
    DEFAULT_EMBED: "#3b3b3e",
    APPROVED_EMBED: "#3b3b3e",
    DENIED_EMBED: "#3b3b3e",
  },

  TICKET: {
    ENABLED: true,
    CREATE_EMBED: "#3b3b3e",
    CLOSE_EMBED: "#3b3b3e",
  },
};
