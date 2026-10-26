const mongoose = require("mongoose")
const { validateAndGetUserVid, getUserVid } = require("../../helpers/userValidator")

const Schema = new mongoose.Schema(
  {
    guild_id: String,
    channel_id: String,
    message_id: String,
    user_id: String, // VID do usuário (obtido da collection users)
    suggestion: String,
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "DELETED"],
      default: "PENDING",
    },
    stats: {
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
    },
    status_updates: [
      {
        _id: false,
        user_id: String, // VID do admin (obtido da collection users)
        status: {
          type: String,
          enum: ["APPROVED", "REJECTED", "DELETED"],
        },
        reason: String,
        timestamp: { type: Date, default: new Date() },
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
)

const Model = mongoose.model("suggestions", Schema)

module.exports = {
  model: Model,

  addSuggestion: async (message, user, suggestion) => {
    try {
      // Busca o VID na collection users - SE NÃO EXISTIR, NÃO CRIA REGISTRO
      const vid = await validateAndGetUserVid(user)

      return new Model({
        guild_id: message.guildId,
        channel_id: message.channelId,
        message_id: message.id,
        user_id: vid, // VID obtido da collection users
        suggestion: suggestion,
      }).save()
    } catch (error) {
      console.error("❌ Erro ao adicionar sugestão:", error)
      throw error
    }
  },

  findSuggestion: async (guildId, messageId) => {
    return Model.findOne({ guild_id: guildId, message_id: messageId })
  },

  deleteSuggestionDb: async (guildId, messageId, member, reason) => {
    try {
      // Busca o VID do admin na collection users - SE NÃO EXISTIR, NÃO EXECUTA
      const adminVid = await validateAndGetUserVid(member.user)

      return Model.updateOne(
        { guild_id: guildId, message_id: messageId },
        {
          status: "DELETED",
          $push: {
            status_updates: {
              user_id: adminVid, // VID obtido da collection users
              status: "DELETED",
              reason,
            },
          },
        },
      )
    } catch (error) {
      console.error("❌ Erro ao deletar sugestão:", error)
      throw error
    }
  },

  // Busca sugestões usando o VID
  getSuggestionsByVid: async (vid, guildId = null) => {
    const filter = { user_id: vid }
    if (guildId) filter.guild_id = guildId

    return Model.find(filter).sort({ created_at: -1 })
  },

  // Busca sugestões usando Discord ID (converte para VID primeiro)
  getSuggestionsByDiscordId: async (discordId, guildId = null) => {
    const vid = await getUserVid(discordId)
    if (!vid) return []

    return module.exports.getSuggestionsByVid(vid, guildId)
  },
}
