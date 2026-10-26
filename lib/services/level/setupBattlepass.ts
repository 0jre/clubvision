// Script para configurar a primeira temporada do Battle Pass
import { dbConnect } from "@/core/integration/connect"

const BattlePassSeason = {
  seasonId: "season_1_extraction",
  name: "TEMPORADA CLUBR - Extraction",
  description: "A primeira temporada do Battle Pass Vision com recompensas exclusivas!",
  startDate: new Date(),
  endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
  Maxtiers: 100,
  isActive: true,
}

async function setupBattlePass() {
  try {
    const { db } = await dbConnect()

    // Criar coleções necessárias
    const seasonsCollection = db.collection("battlepass_seasons")
    const battlePassCollection = db.collection("battlepass")

    // Criar primeira temporada
    const season1 = BattlePassSeason

    // Verificar se já existe uma temporada ativa
    const existingSeason = await seasonsCollection.findOne({ isActive: true })

    if (!existingSeason) {
      await seasonsCollection.insertOne(season1)
      console.log("✅ Primeira temporada criada com sucesso!")
    } else {
      console.log("⚠️ Já existe uma temporada ativa")
    }

    // Criar índices para performance
    await battlePassCollection.createIndex({ userId: 1, seasonId: 1 }, { unique: true })
    await seasonsCollection.createIndex({ isActive: 1 })
    await seasonsCollection.createIndex({ seasonId: 1 }, { unique: true })

    console.log("✅ Índices criados com sucesso!")

    // Estatísticas
    const totalUsers = await db.collection("items").countDocuments()
    console.log(`📊 Total de usuários na plataforma: ${totalUsers}`)

    const battlePassUsers = await battlePassCollection.countDocuments()
    console.log(`🎮 Usuários com progresso no Battle Pass: ${battlePassUsers}`)
  } catch (error) {
    console.error("❌ Erro ao configurar Battle Pass:", error)
    throw error
  }
}

// Executar setup
setupBattlePass()
  .then(() => {
    console.log("🎉 Setup do Battle Pass concluído!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Falha no setup:", error)
    process.exit(1)
  })
