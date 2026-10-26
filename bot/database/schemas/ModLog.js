const mongoose = require("mongoose")
const { validateAndGetUserVid, getUserVid } = require("../../helpers/userValidator")

const reqString = {
  type: String,
  required: true,
}

const Schema = new mongoose.Schema(
  {
    guild_id: reqString,
    member_id: String, // VID do membro (obtido da collection users)
    reason: String,
    admin: {
      id: reqString, // VID do admin (obtido da collection users)
      tag: reqString,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "PURGE",
        "WARN",
        "TIMEOUT",
        "UNTIMEOUT",
        "KICK",
        "SOFTBAN",
        "BAN",
        "UNBAN",
        "VMUTE",
        "VUNMUTE",
        "DEAFEN",
        "UNDEAFEN",
        "DISCONNECT",
        "MOVE",
      ],
    },
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

const Model = mongoose.model("mod-logs", Schema)

module.exports = {
  model: Model,

  addModLogToDb: async (admin, target, reason, type) => {
    try {
      // Valida admin e target - SE NÃO EXISTIREM NA COLLECTION USERS, NÃO CRIA REGISTRO
      const adminVid = await validateAndGetUserVid(admin.user)
      const targetVid = await validateAndGetUserVid(target.user || target)

      if (type === "UNBAN") {
        const existingBanLog = await Model.findOneAndUpdate(
          { guild_id: admin.guild.id, member_id: targetVid, type: "BAN" },
          { type: "UNBAN", reason },
          { sort: { created_at: -1 }, new: true },
        )

        if (existingBanLog) {
          return existingBanLog
        }
      }

      return await new Model({
        guild_id: admin.guild.id,
        member_id: targetVid, // VID obtido da collection users
        reason,
        admin: {
          id: adminVid, // VID obtido da collection users
          tag: admin.user.tag,
        },
        type,
      }).save()
    } catch (error) {
      console.error("❌ Erro ao adicionar log de moderação:", error)
      throw error
    }
  },

  getWarningLogs: async (guildId, discordId) => {
    const vid = await getUserVid(discordId)
    if (!vid) return []

    return Model.find({
      guild_id: guildId,
      member_id: vid,
      type: "WARN",
    }).lean()
  },

  clearWarningLogs: async (guildId, discordId) => {
    const vid = await getUserVid(discordId)
    if (!vid) return { deletedCount: 0 }

    return Model.deleteMany({
      guild_id: guildId,
      member_id: vid,
      type: "WARN",
    })
  },

  getLogsByVid: async (vid, guildId = null, type = null) => {
    const filter = { member_id: vid }
    if (guildId) filter.guild_id = guildId
    if (type) filter.type = type

    return Model.find(filter).sort({ created_at: -1 })
  },

  getLogsByDiscordId: async (discordId, guildId = null, type = null) => {
    const vid = await getUserVid(discordId)
    if (!vid) return []

    return module.exports.getLogsByVid(vid, guildId, type)
  },
}
