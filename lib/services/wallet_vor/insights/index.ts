import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';

interface Transaction {
  date: string;
  time: string;
  amount: number;
  action: string;
  currency: string;
  resultStatus?: string;
  result?: string;
  newAmount?: number;
  uniqueId?: string;
}

interface WalletInsights {
  summary: {
    totalTransactions: number;
    totalVolume: number;
    mostFrequentAction: string;
    mostProfitableAction: string;
    mostCostlyAction: string;
    averageTransactionSize: number;
  };
  patterns: {
    bestDayOfWeek: string;
    bestTimeOfDay: string;
    worstDayOfWeek: string;
    worstTimeOfDay: string;
    successRate: number;
  };
  recommendations: string[];
  riskAnalysis: {
    riskLevel: 'low' | 'medium' | 'high';
    volatilityScore: number;
    largestLoss: number;
    largestGain: number;
    riskRewardRatio: number;
  };
}

/**
 * Analisa uma string de data e hora e retorna um objeto Date
 */
const parseDateTime = (dateStr: string, timeStr: string): Date => {
  try {
    const dateParts = dateStr.split('/').map(Number);
    let day: number, month: number, year: number;
    
    if (dateParts[0] > 12) {
      [day, month, year] = dateParts;
    } else if (dateParts[1] > 12) {
      [month, day, year] = dateParts;
    } else {
      [day, month, year] = dateParts;
    }
    
    if (year < 100) year += 2000;
    
    const timeParts = timeStr.split(':').map(Number);
    const [hours, minutes, seconds = 0] = timeParts;
    
    return new Date(year, month - 1, day, hours, minutes, seconds);
  } catch (error) {
    console.error('Erro ao analisar data/hora:', dateStr, timeStr, error);
    return new Date();
  }
};

/**
 * Calcula o impacto financeiro de uma transação
 */
const calculateTransactionImpact = (tx: Transaction): number => {
  switch (tx.action) {
    case 'convert_from_banking':
      return tx.amount;
    case 'convert_to_banking':
      return -tx.amount;
    case 'double_orbit':
      if (tx.resultStatus === 'Perdeu') {
        return -tx.amount;
      } else if (tx.resultStatus === 'Ganhou') {
        return tx.newAmount || 0;
      }
      return 0;
    case 'receive_orbs':
      return tx.amount;
    case 'post_creation':
      return -tx.amount;
    case 'receivetransfer':
      return tx.amount;
    case 'senttransfer':
      return -tx.amount;
    case 'staking_orbs':
      return -tx.amount;
    case 'funds':
      return tx.amount;
    default:
      if (tx.action.startsWith('purchase_')) {
        return -tx.amount;
      }
      return 0;
  }
};

/**
 * Gera insights avançados sobre a carteira
 */
const generateWalletInsights = (transactions: Transaction[]): WalletInsights => {
  // Filtra apenas transações de moedas
  const coinTxs = transactions.filter(tx => tx.currency === 'coins');
  
  if (coinTxs.length === 0) {
    return {
      summary: {
        totalTransactions: 0,
        totalVolume: 0,
        mostFrequentAction: 'N/A',
        mostProfitableAction: 'N/A',
        mostCostlyAction: 'N/A',
        averageTransactionSize: 0
      },
      patterns: {
        bestDayOfWeek: 'N/A',
        bestTimeOfDay: 'N/A',
        worstDayOfWeek: 'N/A',
        worstTimeOfDay: 'N/A',
        successRate: 0
      },
      recommendations: ['Comece a usar sua carteira para gerar insights.'],
      riskAnalysis: {
        riskLevel: 'low',
        volatilityScore: 0,
        largestLoss: 0,
        largestGain: 0,
        riskRewardRatio: 0
      }
    };
  }
  
  // Processa transações para análise
  const processedTxs = coinTxs.map(tx => ({
    ...tx,
    dateObj: parseDateTime(tx.date, tx.time),
    impact: calculateTransactionImpact(tx)
  }));
  
  // Análise por tipo de ação
  const actionStats: Record<string, {
    count: number;
    totalImpact: number;
    gains: number;
    losses: number;
  }> = {};
  
  processedTxs.forEach(tx => {
    if (!actionStats[tx.action]) {
      actionStats[tx.action] = { count: 0, totalImpact: 0, gains: 0, losses: 0 };
    }
    
    actionStats[tx.action].count += 1;
    actionStats[tx.action].totalImpact += tx.impact;
    
    if (tx.impact > 0) {
      actionStats[tx.action].gains += tx.impact;
    } else if (tx.impact < 0) {
      actionStats[tx.action].losses += Math.abs(tx.impact);
    }
  });
  
  // Encontra ações mais frequentes e impactantes
  const mostFrequentAction = Object.entries(actionStats)
    .sort((a, b) => b[1].count - a[1].count)[0][0];
  
  const mostProfitableAction = Object.entries(actionStats)
    .filter(([_, stats]) => stats.totalImpact > 0)
    .sort((a, b) => b[1].totalImpact - a[1].totalImpact)[0]?.[0] || 'N/A';
  
  const mostCostlyAction = Object.entries(actionStats)
    .filter(([_, stats]) => stats.totalImpact < 0)
    .sort((a, b) => a[1].totalImpact - b[1].totalImpact)[0]?.[0] || 'N/A';
  
  // Análise por dia da semana
  const dayStats: Record<number, { count: number; totalImpact: number }> = {};
  const timeStats: Record<string, { count: number; totalImpact: number }> = {};
  
  processedTxs.forEach(tx => {
    const day = tx.dateObj.getDay();
    const hour = tx.dateObj.getHours();
    const timeOfDay = hour < 6 ? 'madrugada' : 
                     hour < 12 ? 'manhã' : 
                     hour < 18 ? 'tarde' : 'noite';
    
    if (!dayStats[day]) {
      dayStats[day] = { count: 0, totalImpact: 0 };
    }
    dayStats[day].count += 1;
    dayStats[day].totalImpact += tx.impact;
    
    if (!timeStats[timeOfDay]) {
      timeStats[timeOfDay] = { count: 0, totalImpact: 0 };
    }
    timeStats[timeOfDay].count += 1;
    timeStats[timeOfDay].totalImpact += tx.impact;
  });
  
  // Encontra melhores e piores dias/horários
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  const bestDayEntry = Object.entries(dayStats)
    .sort((a, b) => b[1].totalImpact / b[1].count - a[1].totalImpact / a[1].count)[0];
  
  const worstDayEntry = Object.entries(dayStats)
    .sort((a, b) => a[1].totalImpact / a[1].count - b[1].totalImpact / b[1].count)[0];
  
  const bestDay = bestDayEntry ? dayNames[parseInt(bestDayEntry[0])] : 'N/A';
  const worstDay = worstDayEntry ? dayNames[parseInt(worstDayEntry[0])] : 'N/A';
  
  const bestTimeEntry = Object.entries(timeStats)
    .sort((a, b) => b[1].totalImpact / b[1].count - a[1].totalImpact / a[1].count)[0];
  
  const worstTimeEntry = Object.entries(timeStats)
    .sort((a, b) => a[1].totalImpact / a[1].count - b[1].totalImpact / b[1].count)[0];
  
  const bestTime = bestTimeEntry ? bestTimeEntry[0] : 'N/A';
  const worstTime = worstTimeEntry ? worstTimeEntry[0] : 'N/A';
  
  // Calcula taxa de sucesso (transações com impacto positivo)
  const successfulTxs = processedTxs.filter(tx => tx.impact > 0).length;
  const successRate = (successfulTxs / processedTxs.length) * 100;
  
  // Análise de risco
  const impacts = processedTxs.map(tx => tx.impact);
  const largestGain = Math.max(0, ...impacts);
  const largestLoss = Math.abs(Math.min(0, ...impacts));
  
  // Calcula volatilidade como desvio padrão dos impactos
  const avgImpact = impacts.reduce((sum, val) => sum + val, 0) / impacts.length;
  const variance = impacts.reduce((sum, val) => sum + Math.pow(val - avgImpact, 2), 0) / impacts.length;
  const volatilityScore = Math.sqrt(variance);
  
  // Determina nível de risco
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (volatilityScore > 100) {
    riskLevel = 'high';
  } else if (volatilityScore > 50) {
    riskLevel = 'medium';
  }
  
  // Calcula relação risco/recompensa
  const riskRewardRatio = largestLoss > 0 ? largestGain / largestLoss : 0;
  
  // Gera recomendações baseadas na análise
  const recommendations: string[] = [];
  
  if (mostCostlyAction !== 'N/A') {
    recommendations.push(`Considere reduzir atividades do tipo "${mostCostlyAction}" que têm causado perdas.`);
  }
  
  if (mostProfitableAction !== 'N/A') {
    recommendations.push(`Continue com atividades do tipo "${mostProfitableAction}" que têm sido lucrativas.`);
  }
  
  if (bestDay !== 'N/A' && bestTime !== 'N/A') {
    recommendations.push(`Suas transações tendem a ser mais lucrativas às ${bestTime}s de ${bestDay}.`);
  }
  
  if (riskLevel === 'high') {
    recommendations.push('Sua carteira apresenta alta volatilidade. Considere estratégias para reduzir o risco.');
  }
  
  if (riskRewardRatio < 1) {
    recommendations.push('Sua relação risco/recompensa está desfavorável. Suas perdas são maiores que seus ganhos.');
  }
  
  // Calcula volume total e tamanho médio de transação
  const totalVolume = processedTxs.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const averageTransactionSize = totalVolume / processedTxs.length;
  
  return {
    summary: {
      totalTransactions: processedTxs.length,
      totalVolume: Number(totalVolume.toFixed(2)),
      mostFrequentAction,
      mostProfitableAction,
      mostCostlyAction,
      averageTransactionSize: Number(averageTransactionSize.toFixed(2))
    },
    patterns: {
      bestDayOfWeek: bestDay,
      bestTimeOfDay: bestTime,
      worstDayOfWeek: worstDay,
      worstTimeOfDay: worstTime,
      successRate: Number(successRate.toFixed(2))
    },
    recommendations: recommendations.length > 0 ? recommendations : ['Continue monitorando sua carteira para obter recomendações personalizadas.'],
    riskAnalysis: {
      riskLevel,
      volatilityScore: Number(volatilityScore.toFixed(2)),
      largestLoss: Number(largestLoss.toFixed(2)),
      largestGain: Number(largestGain.toFixed(2)),
      riskRewardRatio: Number(riskRewardRatio.toFixed(2))
    }
  };
};

export async function Insights(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ 
      error: 'Parâmetro userId inválido.',
      details: 'É necessário fornecer um ID de usuário válido.'
    });
  }

  try {
    const { db } = await dbConnect();
    const itemsCollection = db.collection('items');

    const userDoc = await itemsCollection.findOne(
      { id: userId },
      { projection: { transactions: 1 } }
    );

    if (!userDoc) {
      return res.status(404).json({ 
        error: 'Usuário não encontrado.',
        details: 'Não foi possível encontrar um usuário com o ID fornecido.'
      });
    }

    if (!Array.isArray(userDoc.transactions)) {
      return res.status(400).json({ 
        error: 'Dados de transações inválidos.',
        details: 'O histórico de transações não está disponível ou não é um array válido.'
      });
    }

    const transactions = userDoc.transactions;
    const insights = generateWalletInsights(transactions);

    return res.status(200).json(insights);
  } catch (error) {
    console.error('Erro ao gerar insights da carteira:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor.',
      details: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.'
    });
  }
}
