const mongoose = require("mongoose");
const { validateAndGetUserVid, getUserVid } = require("../../helpers/userValidator");

const giveawaySchema = new mongoose.Schema(
  {
    messageId: { type: String, required: true, unique: true },
    channelId: { type: String, required: true },
    guildId: { type: String, required: true },
    startAt: { type: Number, required: true },
    endAt: { type: Number, required: true },
    ended: { type: Boolean, default: false },
    winnerCount: { type: Number, required: true },
    prize: { type: String, required: true },
    messages: {
      giveaway: String,
      giveawayEnded: String,
      inviteToParticipate: String,
      drawing: String,
      dropMessage: String,
      winMessage: mongoose.Mixed,
      embedFooter: mongoose.Mixed,
      noWinner: String,
      winners: String,
      endedAt: String,
      hostedBy: String,
    },
    thumbnail: String,
    hostedBy: String,
    winnerIds: { type: [String], default: undefined },
    reaction: mongoose.Mixed,
    botsCanWin: Boolean,
    embedColor: mongoose.Mixed,
    embedColorEnd: mongoose.Mixed,
    exemptPermissions: { type: [], default: undefined },
    exemptMembers: String,
    bonusEntries: String,
    extraData: mongoose.Mixed,
    lastChance: {
      enabled: Boolean,
      content: String,
      threshold: Number,
      embedColor: mongoose.Mixed,
    },
    pauseOptions: {
      isPaused: Boolean,
      content: String,
      unPauseAfter: Number,
      embedColor: mongoose.Mixed,
      durationAfterPause: Number,
    },
    isDrop: Boolean,
    allowedMentions: {
      parse: { type: [String], default: undefined },
      users: { type: [String], default: undefined },
      roles: { type: [String], default: undefined },
    },
  },
  {
    id: false,
    autoIndex: false,
  },
);

const GiveawayModel = mongoose.model("giveaways", giveawaySchema);

const GiveawayHelpers = {
  convertDiscordIdsToVids: async (discordIds) => {
    if (!Array.isArray(discordIds)) return [];

    const vids = [];
    for (const discordId of discordIds) {
      const vid = await getUserVid(discordId);
      if (vid) vids.push(vid);
    }
    return vids;
  },

  createGiveaway: async (giveawayData, hostDiscordId) => {
    try {
      const hostVid = await validateAndGetUserVid({ id: hostDiscordId });

      return new GiveawayModel({
        ...giveawayData,
        hostedBy: hostVid,
      }).save();
    } catch (error) {
      console.error("❌ Erro ao criar giveaway:", error);
      throw error;
    }
  },

  updateWinners: async (giveawayId, winnerDiscordIds) => {
    try {
      const winnerVids = await GiveawayHelpers.convertDiscordIdsToVids(winnerDiscordIds);

      return await GiveawayModel.updateOne({ _id: giveawayId }, { $set: { winnerIds: winnerVids } });
    } catch (error) {
      console.error("❌ Erro ao atualizar vencedores:", error);
      throw error;
    }
  },

  getGiveawaysByHostVid: async (vid, guildId = null) => {
    const filter = { hostedBy: vid };
    if (guildId) filter.guildId = guildId;

    return GiveawayModel.find(filter).sort({ startAt: -1 });
  },

  getGiveawaysWonByVid: async (vid, guildId = null) => {
    const filter = { winnerIds: vid };
    if (guildId) filter.guildId = guildId;

    return GiveawayModel.find(filter).sort({ endAt: -1 });
  },
};

module.exports = GiveawayModel;
