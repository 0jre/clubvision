const { getVidFromUsersCollection } = require("../database/schemas/User")

/**
 * Busca o VID na collection "users" usando Discord ID
 * @param {string} discordId - Discord ID do usuário
 * @returns {Promise<string|null>}
 */
async function getUserVid(discordId) {
  return await getVidFromUsersCollection(discordId)
}

/**
 * Valida se o usuário existe na collection "users" e retorna o VID
 * @param {import('discord.js').User} user - Objeto do usuário do Discord
 * @returns {Promise<string>} - Retorna o VID da collection "users"
 */
async function validateAndGetUserVid(user) {
  try {
    if (!user || !user.id) {
      throw new Error("Usuário ou ID do usuário é obrigatório")
    }

    const vid = await getUserVid(user.id)

    if (!vid) {
      throw new Error(`Usuário ${user.id} não encontrado na collection users`)
    }

    return vid
  } catch (error) {
    console.error(`❌ Erro ao validar usuário ${user?.id}:`, error)
    throw error
  }
}

/**
 * Busca um registro usando o VID do usuário
 * @param {import('mongoose').Model} Model - Modelo do Mongoose
 * @param {string} discordId - Discord ID do usuário
 * @param {Object} additionalFilters - Filtros adicionais para a busca
 * @returns {Promise<Object|null>} - Registro encontrado ou null
 */
async function findRecordByUserVid(Model, discordId, additionalFilters = {}) {
  try {
    const vid = await getUserVid(discordId)
    if (!vid) return null

    return await Model.findOne({
      vid: vid,
      ...additionalFilters,
    })
  } catch (error) {
    console.error(`❌ Erro ao buscar registro por VID:`, error)
    return null
  }
}

module.exports = {
  getUserVid,
  validateAndGetUserVid,
  findRecordByUserVid,
}
