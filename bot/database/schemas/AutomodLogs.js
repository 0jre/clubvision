const mongoose = require("mongoose")
const { validateAndGetUserVid, getUserVid } = require("../../helpers/userValidator")

const reqString = {
  type: String,
  required: true,
}

const Schema = new mongoose.Schema(
  {
    guild_id: reqString,
    member_id: reqString, // VID do membro (obtido da collection users)
    content: String,
    reason: String,
    strikes: Number,
  },
  {
    versionKey: false,
    autoIndex: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
  },
)

const Model = mongoose.model("automod-logs", Schema)

module.exports = {
  addAutoModLogToDb: async (member, content, reason, strikes) => {
    try {
      if (!member) throw new Error("Member is undefined")

      // SE NÃO EXISTIR NA COLLECTION USERS, NÃO CRIA LOG
      const vid = await validateAndGetUserVid(member.user)

      await new Model({
        guild_id: member.guild.id,
        member_id: vid, // VID obtido da collection users
        content,
        reason,
        strikes,
      }).save()
    } catch (error) {
      console.error("❌ Erro ao adicionar log de automod:", error)
      throw error
    }
  },

  getAutoModLogsByVid: async (vid, guildId = null, limit = 50) => {
    const filter = { member_id: vid }
    if (guildId) filter.guild_id = guildId

    return Model.find(filter).sort({ created_at: -1 }).limit(limit).lean()
  },

  getAutoModLogsByDiscordId: async (discordId, guildId = null, limit = 50) => {
    const vid = await getUserVid(discordId)
    if (!vid) return []

    return module.exports.getAutoModLogsByVid(vid, guildId, limit)
  },

  getAutoModStatsByVid: async (vid, guildId) => {
    return Model.aggregate([
      { $match: { member_id: vid, guild_id: guildId } },
      {
        $group: {
          _id: "$reason",
          count: { $sum: 1 },
          totalStrikes: { $sum: "$strikes" },
          lastOccurrence: { $max: "$created_at" },
        },
      },
      { $sort: { count: -1 } },
    ])
  },
}
