const mongoose = require("mongoose")
const { CACHE_SIZE } = require("@root/bot/config.js")
const FixedSizeMap = require("fixedsize-map")

const cache = new FixedSizeMap(CACHE_SIZE.USERS)
const vidCache = new FixedSizeMap(CACHE_SIZE.USERS) // Cache por VID

const Schema = new mongoose.Schema(
  {
    _id: String, // VID obtido da collection "users"
    discord_id: String, // Discord ID do usuário
    id: String, // VID (mesmo valor do _id, mantido para compatibilidade)
    username: String,
    discriminator: String,
    logged: Boolean,
    coins: { type: Number, default: 0 },
    bits: { type: Number, default: 0 },
    banking: { type: Number, default: 0 },
    token: { type: Number, default: 0 },
    reputation: {
      received: { type: Number, default: 0 },
      given: { type: Number, default: 0 },
      timestamp: Date,
    },
    daily: {
      streak: { type: Number, default: 0 },
      timestamp: Date,
    },
    lock: Boolean,
    historyCodeBits: [],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
)

// Índice único para discord_id
Schema.index({ discord_id: 1 }, { unique: true })

const Model = mongoose.model("item", Schema)

/**
 * Busca o VID na collection "users" usando Discord ID
 * @param {string} discordId - Discord ID do usuário
 * @returns {Promise<string|null>}
 */
async function getVidFromUsersCollection(discordId) {
  try {
    const userRecord = await mongoose.connection.db.collection("users").findOne({ discord_id: discordId })

    if (!userRecord) {
      console.warn(`⚠️ Usuário com Discord ID ${discordId} não encontrado na collection users`)
      return null
    }

    return userRecord.id || null
  } catch (error) {
    console.error(`❌ Erro ao buscar VID na collection users:`, error)
    return null
  }
}

module.exports = {
  model: Model,

  /**
   * @param {import('discord.js').User} user
   */
  getUser: async (user) => {
    if (!user) throw new Error("O usuário é necessário.")
    if (!user.id) throw new Error("ID de usuário é necessário.")

    // Verifica cache por Discord ID primeiro
    const cached = cache.get(user.id)
    if (cached) return cached

    // VALIDAÇÃO: Busca o VID na collection "users" - SE NÃO EXISTIR, NÃO CRIA REGISTRO
    const vid = await getVidFromUsersCollection(user.id)
    if (!vid) {
      console.error(
        `❌ ACESSO NEGADO: Usuário ${user.id} não encontrado na collection users. Registro não será criado.`,
      )
      throw new Error(`Usuário ${user.id} não encontrado na collection users`)
    }

    // Verifica cache por VID
    const cachedByVid = vidCache.get(vid)
    if (cachedByVid) {
      cache.add(user.id, cachedByVid) // Adiciona ao cache por Discord ID também
      return cachedByVid
    }

    // Busca no User.js usando o VID como _id
    let userDb = await Model.findOne({ _id: vid })

    if (!userDb) {
      console.log(`🔍 Usuário com VID ${vid} não encontrado no User.js, criando novo registro...`)

      userDb = await Model.findOneAndUpdate(
        { _id: vid }, // Usa o VID como _id
        {
          $setOnInsert: {
            discord_id: user.id, // Discord ID
            id: vid, // VID (mesmo valor do _id)
            username: user.username,
            discriminator: user.discriminator,
            lock: true,
            token: 0,
          },
        },
        { upsert: true, new: true },
      )

      console.log(`✅ Usuário criado no User.js com VID: ${vid}`)
    } else {
      console.log(`✅ Usuário com VID ${vid} encontrado no User.js, verificando campos ausentes...`)

      // Verifica campos ausentes e os adiciona
      const updates = {}
      if (!userDb.discord_id) updates.discord_id = user.id
      if (!userDb.id) updates.id = vid
      if (userDb.username !== user.username) updates.username = user.username
      if (userDb.discriminator !== user.discriminator) updates.discriminator = user.discriminator

      if (Object.keys(updates).length > 0) {
        await Model.updateOne({ _id: vid }, { $set: updates })
        Object.assign(userDb, updates)
      }
    }

    // Adiciona aos dois caches
    cache.add(user.id, userDb) // Cache por Discord ID
    vidCache.add(vid, userDb) // Cache por VID

    return userDb
  },

  /**
   * Busca usuário pelo VID
   * @param {string} vid - VID do usuário
   * @returns {Promise<Object|null>}
   */
  getUserByVid: async (vid) => {
    if (!vid) return null

    // Verifica cache primeiro
    const cached = vidCache.get(vid)
    if (cached) return cached

    const userDb = await Model.findOne({ _id: vid })

    if (userDb) {
      vidCache.add(vid, userDb)
      if (userDb.discord_id) {
        cache.add(userDb.discord_id, userDb)
      }
    }

    return userDb
  },

  /**
   * Busca usuário pelo Discord ID - SÓ SE EXISTIR NA COLLECTION USERS
   * @param {string} discordId - Discord ID do usuário
   * @returns {Promise<Object|null>}
   */
  getUserByDiscordId: async (discordId) => {
    // Verifica cache primeiro
    const cached = cache.get(discordId)
    if (cached) return cached

    // Busca o VID na collection "users" - SE NÃO EXISTIR, RETORNA NULL
    const vid = await getVidFromUsersCollection(discordId)
    if (!vid) {
      console.warn(`⚠️ Usuário ${discordId} não encontrado na collection users`)
      return null
    }

    return await module.exports.getUserByVid(vid)
  },

  /**
   * Atualiza dados do usuário usando VID - SÓ SE EXISTIR NA COLLECTION USERS
   * @param {string} vid - VID do usuário
   * @param {Object} updateData - Dados para atualizar
   * @returns {Promise<Object>}
   */
  updateUserByVid: async (vid, updateData) => {
    try {
      // Verifica se o VID existe na collection users
      const userExists = await mongoose.connection.db.collection("users").findOne({ id: vid })
      if (!userExists) {
        console.warn(`⚠️ VID ${vid} não encontrado na collection users - não atualizando`)
        return null
      }

      const result = await Model.findOneAndUpdate({ _id: vid }, { $set: updateData }, { new: true })

      if (result) {
        // Atualiza caches
        vidCache.add(vid, result)
        if (result.discord_id) {
          cache.add(result.discord_id, result)
        }
      }

      return result
    } catch (error) {
      console.error(`❌ Erro ao atualizar usuário com VID ${vid}:`, error)
      throw error
    }
  },

  /**
   * Incrementa valores numéricos do usuário usando VID - SÓ SE EXISTIR NA COLLECTION USERS
   * @param {string} vid - VID do usuário
   * @param {Object} incrementData - Campos para incrementar
   * @returns {Promise<Object>}
   */
  incrementUserByVid: async (vid, incrementData) => {
    try {
      // Verifica se o VID existe na collection users
      const userExists = await mongoose.connection.db.collection("users").findOne({ id: vid })
      if (!userExists) {
        console.warn(`⚠️ VID ${vid} não encontrado na collection users - não incrementando`)
        return null
      }

      const result = await Model.findOneAndUpdate({ _id: vid }, { $inc: incrementData }, { new: true })

      if (result) {
        // Atualiza caches
        vidCache.add(vid, result)
        if (result.discord_id) {
          cache.add(result.discord_id, result)
        }
      }

      return result
    } catch (error) {
      console.error(`❌ Erro ao incrementar dados do usuário com VID ${vid}:`, error)
      throw error
    }
  },

  /**
   * Incrementa valores usando Discord ID - SÓ SE EXISTIR NA COLLECTION USERS
   * @param {string} discordId - Discord ID do usuário
   * @param {Object} incrementData - Campos para incrementar
   * @returns {Promise<Object>}
   */
  incrementUserByDiscordId: async (discordId, incrementData) => {
    const vid = await getVidFromUsersCollection(discordId)
    if (!vid) {
      console.warn(`⚠️ Usuário ${discordId} não encontrado na collection users - não incrementando`)
      return null
    }

    return module.exports.incrementUserByVid(vid, incrementData)
  },

  /**
   * Adiciona coins ao usuário usando Discord ID - SÓ SE EXISTIR NA COLLECTION USERS
   * @param {string} discordId - Discord ID do usuário
   * @param {number} amount - Quantidade de coins
   * @returns {Promise<Object>}
   */
  addCoinsByDiscordId: async (discordId, amount) => {
    return module.exports.incrementUserByDiscordId(discordId, { coins: amount })
  },

  /**
   * Adiciona coins ao usuário usando VID
   * @param {string} vid - VID do usuário
   * @param {number} amount - Quantidade de coins
   * @returns {Promise<Object>}
   */
  addCoinsToUserByVid: async (vid, amount) => {
    return module.exports.incrementUserByVid(vid, { coins: amount })
  },

  /**
   * Remove coins do usuário usando VID
   * @param {string} vid - VID do usuário
   * @param {number} amount - Quantidade de coins
   * @returns {Promise<Object>}
   */
  removeCoinsFromUserByVid: async (vid, amount) => {
    return module.exports.incrementUserByVid(vid, { coins: -amount })
  },

  /**
   * Atualiza reputação usando VID
   * @param {string} vid - VID do usuário
   * @param {string} type - 'received' ou 'given'
   * @param {number} amount - Quantidade
   * @returns {Promise<Object>}
   */
  updateReputationByVid: async (vid, type, amount = 1) => {
    const updateData = {
      [`reputation.${type}`]: amount,
      "reputation.timestamp": new Date(),
    }

    return module.exports.incrementUserByVid(vid, updateData)
  },

  /**
   * Atualiza reputação usando Discord ID - SÓ SE EXISTIR NA COLLECTION USERS
   * @param {string} discordId - Discord ID do usuário
   * @param {string} type - 'received' ou 'given'
   * @param {number} amount - Quantidade
   * @returns {Promise<Object>}
   */
  updateReputationByDiscordId: async (discordId, type, amount = 1) => {
    const updateData = {
      [`reputation.${type}`]: amount,
      "reputation.timestamp": new Date(),
    }

    return module.exports.incrementUserByDiscordId(discordId, updateData)
  },

  getReputationLb: async (limit = 10) => {
    return Model.find({ "reputation.received": { $gt: 0 } })
      .sort({ "reputation.received": -1, "reputation.given": 1 })
      .limit(limit)
      .lean()
  },

  /**
   * Leaderboard de coins usando VID
   * @param {number} limit - Limite de resultados
   * @returns {Promise<Array>}
   */
  getCoinsLb: async (limit = 10) => {
    return Model.find({ coins: { $gt: 0 } })
      .sort({ coins: -1 })
      .limit(limit)
      .select("_id discord_id username coins")
      .lean()
  },

  /**
   * Busca múltiplos usuários por VIDs
   * @param {Array<string>} vids - Array de VIDs
   * @returns {Promise<Array>}
   */
  getUsersByVids: async (vids) => {
    if (!Array.isArray(vids) || vids.length === 0) return []

    return Model.find({ _id: { $in: vids } })
      .select("_id discord_id username coins reputation")
      .lean()
  },

  /**
   * Limpa caches
   */
  clearCache: () => {
    cache.clear()
    vidCache.clear()
  },

  // Função auxiliar exportada para uso no userValidator
  getVidFromUsersCollection,
}
