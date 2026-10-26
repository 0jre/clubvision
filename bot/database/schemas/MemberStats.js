const mongoose = require("mongoose")
const { CACHE_SIZE } = require("@root/bot/config.js")
const FixedSizeMap = require("fixedsize-map")
const { validateAndGetUserVid, getUserVid } = require("../../helpers/userValidator")

const cache = new FixedSizeMap(CACHE_SIZE.MEMBERS)

const ReqString = {
  type: String,
  required: true,
}

const Schema = new mongoose.Schema(
  {
    guild_id: ReqString,
    member_id: ReqString, // VID do membro (obtido da collection users)
    messages: { type: Number, default: 0 },
    voice: {
      connections: { type: Number, default: 0 },
      time: { type: Number, default: 0 },
    },
    commands: {
      prefix: { type: Number, default: 0 },
      slash: { type: Number, default: 0 },
    },
    contexts: {
      message: { type: Number, default: 0 },
      user: { type: Number, default: 0 },
    },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
)

Schema.index({ guild_id: 1, member_id: 1 }, { unique: true })

const Model = mongoose.model("member-stats", Schema)

module.exports = {
  getMemberStats: async (guildId, discordId) => {
    // SE NÃO EXISTIR NA COLLECTION USERS, RETORNA NULL
    const vid = await getUserVid(discordId)
    if (!vid) {
      console.warn(`⚠️ Usuário ${discordId} não encontrado na collection users - não criando stats`)
      return null
    }

    const key = `${guildId}|${vid}`
    if (cache.contains(key)) return cache.get(key)

    let member = await Model.findOne({ guild_id: guildId, member_id: vid })

    if (!member) {
      member = new Model({
        guild_id: guildId,
        member_id: vid, // VID obtido da collection users
      })
    }

    cache.add(key, member)
    return member
  },

  getMemberStatsByVid: async (guildId, vid) => {
    const key = `${guildId}|${vid}`
    if (cache.contains(key)) return cache.get(key)

    const member = await Model.findOne({ guild_id: guildId, member_id: vid })

    if (member) {
      cache.add(key, member)
    }

    return member
  },

  getXpLb: async (guildId, limit = 10) =>
    Model.find({
      guild_id: guildId,
    })
      .limit(limit)
      .sort({ level: -1, xp: -1 })
      .lean(),

  updateXpByDiscordId: async (guildId, discordId, xpGain, newLevel = null) => {
    try {
      // SE NÃO EXISTIR NA COLLECTION USERS, NÃO ATUALIZA
      const vid = await getUserVid(discordId)
      if (!vid) {
        console.warn(`⚠️ Usuário ${discordId} não encontrado na collection users - não atualizando XP`)
        return null
      }

      const updateData = { $inc: { xp: xpGain } }
      if (newLevel !== null) {
        updateData.$set = { level: newLevel }
      }

      return await Model.updateOne({ guild_id: guildId, member_id: vid }, updateData)
    } catch (error) {
      console.error("❌ Erro ao atualizar XP:", error)
      throw error
    }
  },

  incrementStatByDiscordId: async (guildId, discordId, statPath, increment = 1) => {
    try {
      // SE NÃO EXISTIR NA COLLECTION USERS, NÃO INCREMENTA
      const vid = await getUserVid(discordId)
      if (!vid) {
        console.warn(`⚠️ Usuário ${discordId} não encontrado na collection users - não incrementando stat`)
        return null
      }

      return await Model.updateOne({ guild_id: guildId, member_id: vid }, { $inc: { [statPath]: increment } })
    } catch (error) {
      console.error("❌ Erro ao incrementar estatística:", error)
      throw error
    }
  },
}
