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

interface VariationResult {
  change: number;
  percentage: number;
  status: 'gain' | 'loss' | 'neutral';
  formattedChange: number;
  formattedPercentage: string;
  timeBasedAnalysis: {
    daily: VariationMetrics;
    weekly: VariationMetrics;
    monthly: VariationMetrics;
  };
  trendAnalysis: TrendAnalysis;
  transactionImpact: TransactionImpact[];
}

interface VariationMetrics {
  change: number;
  percentage: number;
  averageChange: number;
  volatility: number;
  status: string;
}

interface TrendAnalysis {
  direction: 'upward' | 'downward' | 'stable';
  strength: number; // 0-1 scale
  consistency: number; // 0-1 scale
  prediction: {
    nextDayEstimate: number;
    confidence: number;
  };
}

interface TransactionImpact {
  action: string;
  totalImpact: number;
  frequency: number;
  averageImpact: number;
}

/**
 * Analisa uma string de data e hora e retorna um objeto Date
 */
const parseDateTime = (dateStr: string, timeStr: string): Date => {
  try {
    // Detecta formato de data automaticamente (DD/MM/YYYY ou MM/DD/YYYY)
    const dateParts = dateStr.split('/').map(Number);
    let day: number, month: number, year: number;
    
    // Lógica para determinar qual parte é o dia e qual é o mês
    if (dateParts[0] > 12) {
      // Se o primeiro número for > 12, só pode ser um dia
      [day, month, year] = dateParts;
    } else if (dateParts[1] > 12) {
      // Se o segundo número for > 12, só pode ser um dia
      [month, day, year] = dateParts;
    } else {
      // Caso ambos possam ser mês, assume formato DD/MM/YYYY
      [day, month, year] = dateParts;
    }
    
    // Ajusta ano se necessário (ex: 22 -> 2022)
    if (year < 100) year += 2000;
    
    const timeParts = timeStr.split(':').map(Number);
    const [hours, minutes, seconds = 0] = timeParts;
    
    return new Date(year, month - 1, day, hours, minutes, seconds);
  } catch (error) {
    console.error('Erro ao analisar data/hora:', dateStr, timeStr, error);
    return new Date(); // Fallback para data atual em caso de erro
  }
};

/**
 * Calcula a diferença em dias entre duas datas
 */
const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // horas*minutos*segundos*milissegundos
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
};

/**
 * Processa transações e calcula o impacto de cada tipo
 */
const processTransactions = (transactions: Transaction[], currentBalance: number): {
  processedTxs: Transaction[];
  balanceHistory: {date: Date, balance: number}[];
  transactionImpact: TransactionImpact[];
} => {
  // Ordena transações por data/hora (mais antigas primeiro)
  const sortedTxs = [...transactions]
    .filter(tx => tx.currency === 'coins')
    .sort((a, b) => {
      const dateA = parseDateTime(a.date, a.time);
      const dateB = parseDateTime(b.date, b.time);
      return dateA.getTime() - dateB.getTime();
    });
  
  // Mapeia ações para seus impactos
  const actionImpacts: Record<string, {total: number, count: number}> = {};
  
  // Reconstrói o histórico de saldo
  let runningBalance = currentBalance;
  const balanceHistory: {date: Date, balance: number}[] = [];
  
  // Processa transações de trás para frente para reconstruir o histórico
  for (let i = sortedTxs.length - 1; i >= 0; i--) {
    const tx = sortedTxs[i];
    let impact = 0;
    
    // Calcula o impacto da transação no saldo
    switch (tx.action) {
      case 'convert_from_banking':
        impact = tx.amount;
        break;
      case 'convert_to_banking':
        impact = -tx.amount;
        break;
      case 'double_orbit':
        if (tx.resultStatus === 'Perdeu') {
          impact = -tx.amount;
        } else if (tx.resultStatus === 'Ganhou') {
          impact = tx.newAmount || 0;
        }
        break;
      case 'receive_orbs':
        impact = tx.amount;
        break;
      case 'post_creation':
        impact = -tx.amount;
        break;
      case 'receivetransfer':
        impact = tx.amount;
        break;
      case 'senttransfer':
        impact = -tx.amount;
        break;
      case 'staking_orbs':
        impact = -tx.amount;
        break;
      case 'funds':
        impact = tx.amount;
        break;
      default:
        if (tx.action.startsWith('purchase_')) {
          impact = -tx.amount;
        }
        break;
    }
    
    // Registra o impacto para análise
    if (!actionImpacts[tx.action]) {
      actionImpacts[tx.action] = { total: 0, count: 0 };
    }
    actionImpacts[tx.action].total += impact;
    actionImpacts[tx.action].count += 1;
    
    // Ajusta o saldo histórico
    runningBalance -= impact;
    
    // Adiciona ao histórico
    balanceHistory.unshift({
      date: parseDateTime(tx.date, tx.time),
      balance: runningBalance
    });
  }
  
  // Adiciona o saldo atual ao histórico
  balanceHistory.push({
    date: new Date(),
    balance: currentBalance
  });
  
  // Converte impactos de ações para o formato de saída
  const transactionImpact: TransactionImpact[] = Object.entries(actionImpacts)
    .map(([action, data]) => ({
      action,
      totalImpact: Number(data.total.toFixed(2)),
      frequency: data.count,
      averageImpact: Number((data.total / data.count).toFixed(2))
    }))
    .sort((a, b) => Math.abs(b.totalImpact) - Math.abs(a.totalImpact));
  
  return {
    processedTxs: sortedTxs,
    balanceHistory,
    transactionImpact
  };
};

/**
 * Calcula métricas de variação para um período específico
 */
const calculatePeriodMetrics = (
  balanceHistory: {date: Date, balance: number}[],
  periodDays: number
): VariationMetrics => {
  const now = new Date();
  const periodStart = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));
  
  // Filtra pontos de dados dentro do período
  const periodData = balanceHistory.filter(point => 
    point.date >= periodStart && point.date <= now
  );
  
  if (periodData.length < 2) {
    return {
      change: 0,
      percentage: 0,
      averageChange: 0,
      volatility: 0,
      status: 'null'
    };
  }
  
  // Encontra o primeiro e último ponto no período
  const firstPoint = periodData[0];
  const lastPoint = periodData[periodData.length - 1];
  
  // Calcula a mudança e porcentagem
  const change = lastPoint.balance - firstPoint.balance;
  const percentage = firstPoint.balance !== 0 
    ? (change / firstPoint.balance) * 100 
    : 0;
  
  // Calcula mudanças diárias para volatilidade
  const dailyChanges: number[] = [];
  for (let i = 1; i < periodData.length; i++) {
    const prevBalance = periodData[i-1].balance;
    const currBalance = periodData[i].balance;
    if (prevBalance !== 0) {
      dailyChanges.push((currBalance - prevBalance) / prevBalance);
    }
  }
  
  // Calcula média de mudança e volatilidade
  const averageChange = dailyChanges.length > 0 
    ? dailyChanges.reduce((sum, val) => sum + val, 0) / dailyChanges.length 
    : 0;
  
  // Volatilidade como desvio padrão das mudanças diárias
  const volatility = dailyChanges.length > 0 
    ? Math.sqrt(
        dailyChanges.reduce((sum, val) => sum + Math.pow(val - averageChange, 2), 0) / 
        dailyChanges.length
      )
    : 0;
  
  const status = change > 0 ? "gain" : change < 0 ? "loss" : "neutral";

  return {
    change: Number(change.toFixed(2)),
    percentage: Number(percentage.toFixed(2)),
    averageChange: Number((averageChange * 100).toFixed(2)),
    volatility: Number((volatility * 100).toFixed(2)),
    status
  };
};

/**
 * Analisa tendências e faz previsões simples
 */
const analyzeTrend = (balanceHistory: {date: Date, balance: number}[]): TrendAnalysis => {
  if (balanceHistory.length < 5) {
    return {
      direction: 'stable',
      strength: 0,
      consistency: 0,
      prediction: {
        nextDayEstimate: balanceHistory[balanceHistory.length - 1]?.balance || 0,
        confidence: 0
      }
    };
  }
  
  // Pega os últimos 30 pontos de dados ou todos se houver menos
  const recentHistory = balanceHistory.slice(-Math.min(30, balanceHistory.length));
  
  // Calcula a direção da tendência
  const firstBalance = recentHistory[0].balance;
  const lastBalance = recentHistory[recentHistory.length - 1].balance;
  const overallChange = lastBalance - firstBalance;
  
  let direction: 'upward' | 'downward' | 'stable';
  if (overallChange > 0) {
    direction = 'upward';
  } else if (overallChange < 0) {
    direction = 'downward';
  } else {
    direction = 'stable';
  }
  
  // Calcula a força da tendência (normalizada entre 0-1)
  const maxPossibleChange = Math.max(Math.abs(firstBalance), Math.abs(lastBalance));
  const strength = maxPossibleChange > 0 
    ? Math.min(1, Math.abs(overallChange) / maxPossibleChange) 
    : 0;
  
  // Calcula a consistência da tendência
  let consistentChanges = 0;
  for (let i = 1; i < recentHistory.length; i++) {
    const change = recentHistory[i].balance - recentHistory[i-1].balance;
    if ((direction === 'upward' && change >= 0) || 
        (direction === 'downward' && change <= 0) || 
        (direction === 'stable' && change === 0)) {
      consistentChanges++;
    }
  }
  const consistency = (recentHistory.length > 1) 
    ? consistentChanges / (recentHistory.length - 1) 
    : 0;
  
  // Previsão simples usando média móvel ponderada
  const weights = recentHistory.map((_, idx) => idx + 1);
  const weightSum = weights.reduce((sum, w) => sum + w, 0);
  
  const weightedChanges = recentHistory.map((point, idx) => {
    if (idx === 0) return 0;
    return (point.balance - recentHistory[idx-1].balance) * (weights[idx] / weightSum);
  });
  
  const averageWeightedChange = weightedChanges.reduce((sum, change) => sum + change, 0);
  const nextDayEstimate = lastBalance + averageWeightedChange;
  
  // Confiança baseada na consistência e quantidade de dados
  const confidence = Math.min(0.9, consistency * (recentHistory.length / 30));
  
  return {
    direction,
    strength: Number(strength.toFixed(2)),
    consistency: Number(consistency.toFixed(2)),
    prediction: {
      nextDayEstimate: Number(nextDayEstimate.toFixed(2)),
      confidence: Number(confidence.toFixed(2))
    }
  };
};

/**
 * Função principal para calcular variação
 */
const calculateAdvancedVariation = (
  transactions: Transaction[], 
  currentBalance: number
): VariationResult => {
  // Processa transações e obtém histórico de saldo
  const { balanceHistory, transactionImpact } = processTransactions(transactions, currentBalance);
  
  // Se não houver histórico suficiente, retorna resultado padrão
  if (balanceHistory.length < 2) {
    return {
      change: 0,
      percentage: 0,
      status: 'neutral',
      formattedChange: 0,
      formattedPercentage: '0.00%',
      timeBasedAnalysis: {
        daily: { change: 0, percentage: 0, averageChange: 0, volatility: 0, status: 'null' },
        weekly: { change: 0, percentage: 0, averageChange: 0, volatility: 0, status: 'null'  },
        monthly: { change: 0, percentage: 0, averageChange: 0, volatility: 0, status: 'null'  },
        
      },
      trendAnalysis: {
        direction: 'stable',
        strength: 0,
        consistency: 0,
        prediction: { nextDayEstimate: currentBalance, confidence: 0 }
      },
      transactionImpact: []
    };
  }
  
  // Calcula a variação principal (entre o primeiro e último ponto)
  const firstBalance = balanceHistory[0].balance;
  const change = currentBalance - firstBalance;
  const percentage = firstBalance !== 0 ? (change / firstBalance) * 100 : 0;
  
  // Determina o status
  const status: 'gain' | 'loss' | 'neutral' = 
    change > 0 ? 'gain' : change < 0 ? 'loss' : 'neutral';
  
  // Calcula análises baseadas em tempo
  const dailyMetrics = calculatePeriodMetrics(balanceHistory, 1);
  const weeklyMetrics = calculatePeriodMetrics(balanceHistory, 7);
  const monthlyMetrics = calculatePeriodMetrics(balanceHistory, 30);
  
  // Analisa tendências
  const trendAnalysis = analyzeTrend(balanceHistory);
  
  return {
    change: Number(change.toFixed(2)),
    percentage: Number(percentage.toFixed(2)),
    status,
    formattedChange: Number(Math.abs(change).toFixed(2)),
    formattedPercentage: `${percentage >= 0 ? '+' : '-'}${Math.abs(percentage).toFixed(2)}%`,
    timeBasedAnalysis: {
      daily: dailyMetrics,
      weekly: weeklyMetrics,
      monthly: monthlyMetrics
    },
    trendAnalysis,
    transactionImpact
  };
};

export async function Variations_v(
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

    // Busca documento do usuário com projeção para otimizar
    const userDoc = await itemsCollection.findOne(
      { id: userId },
      { projection: { coins: 1, transactions: 1 } }
    );

    if (!userDoc) {
      return res.status(404).json({ 
        error: 'Usuário não encontrado.',
        details: 'Não foi possível encontrar um usuário com o ID fornecido.'
      });
    }

    if (typeof userDoc.coins !== 'number') {
      return res.status(400).json({ 
        error: 'Dados de saldo inválidos.',
        details: 'O saldo do usuário não está disponível ou não é um número válido.'
      });
    }

    if (!Array.isArray(userDoc.transactions)) {
      return res.status(400).json({ 
        error: 'Dados de transações inválidos.',
        details: 'O histórico de transações não está disponível ou não é um array válido.'
      });
    }

    const coinsNow = userDoc.coins;
    const transactions = userDoc.transactions;

    // Calcula variação avançada
    const response = calculateAdvancedVariation(transactions, coinsNow);

    return res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao calcular variação:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor.',
      details: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.'
    });
  }
}



export async function Transactions(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({
      error: "Parâmetro userId inválido.",
      details: "É necessário fornecer um ID de usuário válido.",
    })
  }

  try {
    const { db } = await dbConnect()
    const itemsCollection = db.collection("items")

    const userDoc = await itemsCollection.findOne({ id: userId }, { projection: { transactions: 1, coins: 1 } })

    if (!userDoc) {
      return res.status(404).json({
        error: "Usuário não encontrado.",
        details: "Não foi possível encontrar um usuário com o ID fornecido.",
      })
    }

    if (!Array.isArray(userDoc.transactions)) {
      return res.status(400).json({
        error: "Dados de transações inválidos.",
        details: "O histórico de transações não está disponível ou não é um array válido.",
      })
    }

    return res.status(200).json({
      transactions: userDoc.transactions,
      currentBalance: userDoc.coins || 0,
    })
  } catch (error) {
    console.error("Erro ao buscar transações:", error)
    return res.status(500).json({
      error: "Erro interno do servidor.",
      details: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
    })
  }
}
