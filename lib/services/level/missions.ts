import type { Mission, MissionTemplate } from "./battlepass"

 
export class AdvancedMissionGenerator {
  
  private static dailyMissionTemplates: MissionTemplate[] = [
    // 📦 CAIXAS E ABERTURAS
    {
      action: "open_cases",
      title: "Abrir Caixas Vision",
      description: "Abra {target} caixas Vision",
      baseTarget: 3,
      xpReward: 150,
      category: "cases",
    },
    {
      action: "open_cases",
      title: "Caçador de Tesouros",
      description: "Abra {target} caixas de qualquer tipo",
      baseTarget: 5,
      xpReward: 200,
      category: "cases",
    },
    {
      action: "open_rare_cases",
      title: "Caixas Raras",
      description: "Abra {target} caixas raras ou épicas",
      baseTarget: 2,
      xpReward: 300,
      category: "cases",
    },

    // 💬 ATIVIDADE NO DISCORD
    {
      action: "send_messages",
      title: "Atividade no Discord",
      description: "Envie {target} mensagens no Discord",
      baseTarget: 10,
      xpReward: 100,
      category: "social",
    },
    {
      action: "send_messages",
      title: "Conversador Ativo",
      description: "Envie {target} mensagens em canais diferentes",
      baseTarget: 15,
      xpReward: 120,
      category: "social",
    },
    {
      action: "voice_time",
      title: "Tempo em Voz",
      description: "Passe {target} minutos em canais de voz",
      baseTarget: 30,
      xpReward: 200,
      category: "social",
    },
    {
      action: "voice_time",
      title: "Maratonista Vocal",
      description: "Fique {target} minutos seguidos em voz",
      baseTarget: 45,
      xpReward: 250,
      category: "social",
    },

    // 👥 CONVITES E SOCIAL
    {
      action: "invite_users",
      title: "Recrutador",
      description: "Convide {target} usuários para o servidor",
      baseTarget: 2,
      xpReward: 300,
      category: "social",
    },
    {
      action: "invite_users",
      title: "Embaixador",
      description: "Traga {target} novos membros",
      baseTarget: 1,
      xpReward: 200,
      category: "social",
    },

    // 🛍️ COMPRAS E ECONOMIA
    {
      action: "buy_items",
      title: "Compras na Loja",
      description: "Compre {target} itens na loja",
      baseTarget: 1,
      xpReward: 250,
      category: "economy",
    },
    {
      action: "spend_bits",
      title: "Gastador de Bits",
      description: "Gaste {target} bits",
      baseTarget: 1000,
      xpReward: 180,
      category: "economy",
    },
    {
      action: "spend_coins",
      title: "Investidor de ORBs",
      description: "Gaste {target} ORBs",
      baseTarget: 2000,
      xpReward: 160,
      category: "economy",
    },
    {
      action: "spend_tokens",
      title: "Consumidor de Tokens",
      description: "Use {target} V-Tokens",
      baseTarget: 5,
      xpReward: 220,
      category: "economy",
    },

    // 🎮 ATIVIDADES GERAIS
    {
      action: "login_streak",
      title: "Presença Diária",
      description: "Faça login por {target} dias seguidos",
      baseTarget: 1,
      xpReward: 100,
      category: "activity",
    },
    {
      action: "complete_trades",
      title: "Negociador",
      description: "Complete {target} trocas",
      baseTarget: 2,
      xpReward: 200,
      category: "economy",
    },
    {
      action: "use_commands",
      title: "Comandante",
      description: "Use {target} comandos do bot",
      baseTarget: 8,
      xpReward: 120,
      category: "activity",
    },
    {
      action: "react_messages",
      title: "Reativo",
      description: "Reaja a {target} mensagens",
      baseTarget: 12,
      xpReward: 80,
      category: "social",
    },

    // 🏆 CONQUISTAS E DESAFIOS
    {
      action: "win_games",
      title: "Vitorioso",
      description: "Vença {target} jogos/desafios",
      baseTarget: 3,
      xpReward: 180,
      category: "games",
    },
    {
      action: "participate_events",
      title: "Participativo",
      description: "Participe de {target} eventos",
      baseTarget: 1,
      xpReward: 300,
      category: "events",
    },
    {
      action: "help_users",
      title: "Ajudante",
      description: "Ajude {target} usuários",
      baseTarget: 2,
      xpReward: 150,
      category: "social",
    },

    // 📈 PROGRESSÃO
    {
      action: "gain_xp",
      title: "Evolucionista",
      description: "Ganhe {target} XP total",
      baseTarget: 500,
      xpReward: 100,
      category: "progression",
    },
    {
      action: "level_up",
      title: "Subir de Nível",
      description: "Suba {target} níveis",
      baseTarget: 1,
      xpReward: 200,
      category: "progression",
    },

    // 🎨 CUSTOMIZAÇÃO
    {
      action: "change_avatar",
      title: "Renovação Visual",
      description: "Mude seu avatar {target} vez",
      baseTarget: 1,
      xpReward: 100,
      category: "customization",
    },
    {
      action: "use_emojis",
      title: "Expressivo",
      description: "Use {target} emojis diferentes",
      baseTarget: 10,
      xpReward: 90,
      category: "social",
    },

    // 🔥 ESPECIAIS E ÚNICOS
    {
      action: "first_message_day",
      title: "Primeiro da Manhã",
      description: "Seja o primeiro a mandar mensagem hoje",
      baseTarget: 1,
      xpReward: 150,
      category: "special",
    },
    {
      action: "night_owl",
      title: "Coruja Noturna",
      description: "Fique ativo após meia-noite por {target} minutos",
      baseTarget: 30,
      xpReward: 180,
      category: "special",
    },
    {
      action: "early_bird",
      title: "Madrugador",
      description: "Fique ativo antes das 7h por {target} minutos",
      baseTarget: 20,
      xpReward: 170,
      category: "special",
    },

    // 💎 COLEÇÕES E ITENS
    {
      action: "collect_items",
      title: "Colecionador",
      description: "Colete {target} itens diferentes",
      baseTarget: 3,
      xpReward: 160,
      category: "collection",
    },
    {
      action: "sell_items",
      title: "Vendedor",
      description: "Venda {target} itens",
      baseTarget: 2,
      xpReward: 140,
      category: "economy",
    },

    // 🎯 PRECISÃO E HABILIDADE
    {
      action: "perfect_trades",
      title: "Negociador Perfeito",
      description: "Faça {target} trocas sem cancelar",
      baseTarget: 3,
      xpReward: 220,
      category: "skill",
    },
    {
      action: "quick_responses",
      title: "Resposta Rápida",
      description: "Responda em menos de 1 minuto {target} vezes",
      baseTarget: 5,
      xpReward: 130,
      category: "skill",
    },
  ]

  // 📅 MISSÕES SEMANAIS - Lista expandida
  private static weeklyMissionTemplates: MissionTemplate[] = [
    // 📦 CAIXAS SEMANAIS
    {
      action: "open_cases",
      title: "Mestre das Caixas",
      description: "Abra {target} caixas Vision",
      baseTarget: 25,
      xpReward: 800,
      category: "cases",
    },
    {
      action: "open_cases",
      title: "Viciado em Caixas",
      description: "Abra {target} caixas de qualquer tipo",
      baseTarget: 40,
      xpReward: 1000,
      category: "cases",
    },
    {
      action: "open_legendary_cases",
      title: "Caçador Lendário",
      description: "Abra {target} caixas lendárias",
      baseTarget: 5,
      xpReward: 1200,
      category: "cases",
    },

    // 📈 PROGRESSÃO SEMANAL
    {
      action: "earn_xp",
      title: "Ganho de XP",
      description: "Ganhe {target} XP total",
      baseTarget: 2000,
      xpReward: 1000,
      category: "progression",
    },
    {
      action: "earn_xp",
      title: "Maratonista XP",
      description: "Acumule {target} XP esta semana",
      baseTarget: 3500,
      xpReward: 1500,
      category: "progression",
    },
    {
      action: "level_up",
      title: "Evolucionista",
      description: "Suba {target} níveis",
      baseTarget: 3,
      xpReward: 1200,
      category: "progression",
    },

    // 🎯 MISSÕES DIÁRIAS
    {
      action: "complete_dailies",
      title: "Missões Diárias",
      description: "Complete {target} missões diárias",
      baseTarget: 5,
      xpReward: 1200,
      category: "missions",
    },
    {
      action: "complete_dailies",
      title: "Dedicado às Missões",
      description: "Complete {target} missões diárias diferentes",
      baseTarget: 8,
      xpReward: 1500,
      category: "missions",
    },

    // 💰 ECONOMIA SEMANAL
    {
      action: "spend_tokens",
      title: "Gastador de Tokens",
      description: "Gaste {target} V-Tokens",
      baseTarget: 50,
      xpReward: 1500,
      category: "economy",
    },
    {
      action: "spend_bits",
      title: "Investidor Premium",
      description: "Gaste {target} bits",
      baseTarget: 10000,
      xpReward: 1300,
      category: "economy",
    },
    {
      action: "earn_coins",
      title: "Acumulador de ORBs",
      description: "Ganhe {target} ORBs",
      baseTarget: 15000,
      xpReward: 1100,
      category: "economy",
    },
    {
      action: "complete_trades",
      title: "Mestre Negociador",
      description: "Complete {target} trocas",
      baseTarget: 10,
      xpReward: 1400,
      category: "economy",
    },

    // 👥 SOCIAL SEMANAL
    {
      action: "send_messages",
      title: "Comunicador Ativo",
      description: "Envie {target} mensagens",
      baseTarget: 100,
      xpReward: 900,
      category: "social",
    },
    {
      action: "voice_time",
      title: "Presença Vocal",
      description: "Passe {target} minutos em voz",
      baseTarget: 300,
      xpReward: 1200,
      category: "social",
    },
    {
      action: "invite_users",
      title: "Recrutador Semanal",
      description: "Convide {target} usuários",
      baseTarget: 5,
      xpReward: 1600,
      category: "social",
    },
    {
      action: "help_users",
      title: "Mentor da Semana",
      description: "Ajude {target} usuários diferentes",
      baseTarget: 8,
      xpReward: 1300,
      category: "social",
    },

    // 🏆 CONQUISTAS SEMANAIS
    {
      action: "win_games",
      title: "Campeão Semanal",
      description: "Vença {target} jogos/desafios",
      baseTarget: 15,
      xpReward: 1400,
      category: "games",
    },
    {
      action: "participate_events",
      title: "Participativo Ativo",
      description: "Participe de {target} eventos",
      baseTarget: 3,
      xpReward: 1500,
      category: "events",
    },
    {
      action: "use_commands",
      title: "Comandante Supremo",
      description: "Use {target} comandos diferentes",
      baseTarget: 50,
      xpReward: 1000,
      category: "activity",
    },

    // 🎨 CRIATIVIDADE E CUSTOMIZAÇÃO
    {
      action: "customize_profile",
      title: "Designer Pessoal",
      description: "Customize seu perfil {target} vezes",
      baseTarget: 3,
      xpReward: 800,
      category: "customization",
    },
    {
      action: "use_emojis",
      title: "Mestre dos Emojis",
      description: "Use {target} emojis únicos",
      baseTarget: 50,
      xpReward: 700,
      category: "social",
    },

    // 🔥 DESAFIOS ESPECIAIS
    {
      action: "daily_streak",
      title: "Presença Perfeita",
      description: "Faça login todos os dias da semana",
      baseTarget: 7,
      xpReward: 1800,
      category: "special",
    },
    {
      action: "perfect_week",
      title: "Semana Perfeita",
      description: "Complete todas as missões diárias da semana",
      baseTarget: 7,
      xpReward: 2000,
      category: "special",
    },
    {
      action: "night_warrior",
      title: "Guerreiro Noturno",
      description: "Fique ativo após 22h por {target} minutos",
      baseTarget: 200,
      xpReward: 1100,
      category: "special",
    },

    // 💎 COLEÇÕES AVANÇADAS
    {
      action: "collect_rare_items",
      title: "Colecionador Raro",
      description: "Colete {target} itens raros ou épicos",
      baseTarget: 8,
      xpReward: 1600,
      category: "collection",
    },
    {
      action: "complete_sets",
      title: "Completista",
      description: "Complete {target} sets de itens",
      baseTarget: 2,
      xpReward: 1700,
      category: "collection",
    },

    // 🎯 HABILIDADES AVANÇADAS
    {
      action: "expert_trades",
      title: "Especialista em Trocas",
      description: "Faça {target} trocas com lucro",
      baseTarget: 8,
      xpReward: 1500,
      category: "skill",
    },
    {
      action: "mentor_others",
      title: "Mentor Experiente",
      description: "Ensine {target} novatos",
      baseTarget: 5,
      xpReward: 1400,
      category: "skill",
    },

    // 🌟 LIDERANÇA
    {
      action: "lead_events",
      title: "Líder de Eventos",
      description: "Organize ou lidere {target} atividades",
      baseTarget: 2,
      xpReward: 1800,
      category: "leadership",
    },
    {
      action: "community_helper",
      title: "Pilar da Comunidade",
      description: "Seja ativo em {target} canais diferentes",
      baseTarget: 10,
      xpReward: 1300,
      category: "leadership",
    },
  ]

  /**
   * 🎯 GERAR MISSÕES DIÁRIAS
   */
  static generateDailyMissions(userId: string, seasonSeed: string): Mission[] {
    const selectedTemplates = this.selectRandomTemplates(this.dailyMissionTemplates, 3, seasonSeed + userId)

    return selectedTemplates.map((template, index) => ({
      id: `daily_${userId}_${Date.now()}_${index}`,
      type: "daily" as const,
      title: template.title,
      description: template.description.replace("{target}", template.baseTarget.toString()),
      requirement: {
        action: template.action,
        target: template.baseTarget,
        current: 0,
      },
      reward: {
        xp: template.xpReward,
        bits: Math.floor(Math.random() * 500) + 100,
      },
      isCompleted: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      category: template.category,
    }))
  }

  /**
   * 📅 GERAR MISSÕES SEMANAIS
   */
  static generateWeeklyMissions(userId: string, seasonSeed: string): Mission[] {
    const selectedTemplates = this.selectRandomTemplates(
      this.weeklyMissionTemplates,
      2,
      seasonSeed + userId + "_weekly",
    )

    return selectedTemplates.map((template, index) => ({
      id: `weekly_${userId}_${Date.now()}_${index}`,
      type: "weekly" as const,
      title: template.title,
      description: template.description.replace("{target}", template.baseTarget.toString()),
      requirement: {
        action: template.action,
        target: template.baseTarget,
        current: 0,
      },
      reward: {
        xp: template.xpReward,
        coins: Math.floor(Math.random() * 2000) + 500,
        tokens: Math.floor(Math.random() * 3) + 1,
      },
      isCompleted: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      category: template.category,
    }))
  }

  /**
   * 🎲 SELEÇÃO DETERMINÍSTICA DE TEMPLATES
   */
  private static selectRandomTemplates<T>(templates: T[], count: number, seed: string): T[] {
    const shuffled = this.deterministicShuffle([...templates], seed)
    return shuffled.slice(0, count)
  }

 
  private static deterministicShuffle<T>(array: T[], seed: string): T[] {
    const shuffled = [...array]
    const seedNum = this.hashString(seed)

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.generateSeededRandom(seed, i) * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
  }

  private static generateSeededRandom(seed: string, salt: number): number {
    const combinedSeed = this.hashString(seed + salt.toString())
    const a = 1664525
    const c = 1013904223
    const m = Math.pow(2, 32)
    return Math.abs(((a * combinedSeed + c) % m) / m)
  }

  private static hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  /**
   * 📊 ESTATÍSTICAS DAS MISSÕES
   */
  static getMissionStats(): {
    totalDaily: number
    totalWeekly: number
    categoriesDaily: string[]
    categoriesWeekly: string[]
  } {
    const dailyCategories = [...new Set(this.dailyMissionTemplates.map((t) => t.category))]
    const weeklyCategories = [...new Set(this.weeklyMissionTemplates.map((t) => t.category))]

    return {
      totalDaily: this.dailyMissionTemplates.length,
      totalWeekly: this.weeklyMissionTemplates.length,
      categoriesDaily: dailyCategories,
      categoriesWeekly: weeklyCategories,
    }
  }
}
