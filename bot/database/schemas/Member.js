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
    strikes: { type: Number, default: 0 },
    warnings: { type: Number, default: 0 },
    invite_data: {
      inviter: String, // VID do convidador (obtido da collection users)
      code: String,
      tracked: { type: Number, default: 0 },
      fake: { type: Number, default: 0 },
      left: { type: Number, default: 0 },
      added: { type: Number, default: 0 },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
)

const Model = mongoose.model("members", Schema)

module.exports = {
  getMember: async (guildId, discordId) => {
    // SE NÃO EXISTIR NA COLLECTION USERS, RETORNA NULL
    const vid = await getUserVid(discordId)
    if (!vid) {
      console.warn(`⚠️ Usuário ${discordId} não encontrado na collection users - não criando registro`)
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

  getMemberByVid: async (guildId, vid) => {
    const key = `${guildId}|${vid}`
    if (cache.contains(key)) return cache.get(key)

    const member = await Model.findOne({ guild_id: guildId, member_id: vid })

    if (member) {
      cache.add(key, member)
    }

    return member
  },

  getInvitesLb: async (guildId, limit = 10) =>
    Model.aggregate([
      { $match: { guild_id: guildId } },
      {
        $project: {
          member_id: "$member_id",
          invites: {
            $subtract: [
              { $add: ["$invite_data.tracked", "$invite_data.added"] },
              { $add: ["$invite_data.left", "$invite_data.fake"] },
            ],
          },
        },
      },
      { $match: { invites: { $gt: 0 } } },
      { $sort: { invites: -1 } },
      { $limit: limit },
    ]),

  updateInviteData: async (guildId, memberDiscordId, inviterDiscordId, updateData) => {
    try {
      // SE MEMBRO NÃO EXISTIR NA COLLECTION USERS, NÃO ATUALIZA
      const memberVid = await getUserVid(memberDiscordId)
      if (!memberVid) {
        console.warn(`⚠️ Membro ${memberDiscordId} não encontrado na collection users - não atualizando`)
        return null
      }

      const inviterVid = inviterDiscordId ? await getUserVid(inviterDiscordId) : null

      const updateFields = {
        ...updateData,
        ...(inviterVid && { "invite_data.inviter": inviterVid }),
      }

      return await Model.updateOne({ guild_id: guildId, member_id: memberVid }, { $set: updateFields })
    } catch (error) {
      console.error("❌ Erro ao atualizar dados de convite:", error)
      throw error
    }
  },
}
