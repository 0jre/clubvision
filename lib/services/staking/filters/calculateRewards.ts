import { Staking } from '@/types/user/coin.bank';
import validators from '@/lib/services/staking/validator/validators';
import { dbConnect } from '@/core/integration/connect';

// Função para cálculo do risco de slashing
const calculateSlashingRisk = (
  investmentAmount: number,
  validatorPerformance: number,
  timeStaked: number
): number => {
  let risk = 0.01; // Risco inicial baixo

  if (validatorPerformance < 50) risk += 0.07;  // Aumenta para baixo desempenho
  if (validatorPerformance < 75) risk += 0.04;

  if (investmentAmount >= 500000) risk += 0.02;  // Maior risco para investimentos altos

  // Reduz risco para stakes mais longos
  const timeBonus = timeStaked > 60 * 24 * 60 * 60 ? 0.015 : 0;
  return Math.max(risk - timeBonus, 0);  // Risco nunca menor que 0
};

// Função para associar risco e recompensas aos validadores
const updateSlashingRisk = (investmentAmount: number): any[] => {
  return validators.map(validator => ({
    ...validator,
    slashingRisk: calculateSlashingRisk(
      investmentAmount,
      validator.performance,
      validator.timeStaked || 0
    ),
    rewardRate: validator.performance < 50 ? 800 : validator.performance < 75 ? 400 : 100,
  }));
};

// Períodos de bloqueio configuráveis
const DEFAULT_LOCK_PERIOD = 30 * 24 * 60 * 60 * 1000; // 30 dias
const MAX_LOCK_PERIODS: { [key: string]: number } = {
  validator1: 15 * 24 * 60 * 60 * 1000,
  validator2: 80 * 24 * 60 * 60 * 1000,
  validator3: 130 * 24 * 60 * 60 * 1000,
};

// Verifica se o staking pode ser desbloqueado
export const canUnlockStaking = (startTime: Date, validatorId: string): boolean => {
  const now = Date.now();
  const stakingStart = new Date(startTime).getTime();
  const maxLockPeriod = MAX_LOCK_PERIODS[validatorId] || DEFAULT_LOCK_PERIOD;
  return now - stakingStart >= maxLockPeriod;
};

// Defina um limite mínimo para o investimento
const DIFFICULTY_FACTOR = 0.0001; 


export const calculateRewards = async (
  item: any,
  walletvision: any
): Promise<{
  proximaRecompensa: Date | null;
  totalJurosAcumulados: number;
  mediaRewardRate: string;
  updatedStaking: any[];
  porcentagemGanhosEmBits: string;
  porcentagemAumentoNoValor: string;
  porcentagemRetiradaDoStaking: string;
  updatedBitsOnStaking: number;
}> => {
  const hoje = new Date();
  let proximaRecompensa: Date | null = null;
  let totalJurosAcumulados = 0;
  let totalRewardRate = 0;
  let totalAmountStaked = 0;

  // Função para calcular o total do investimento apenas com stakes bloqueados
  const calcularTotalInvestimento = (stakingArray: any[]): number => {
       
      return stakingArray
      .filter(stake => stake.lock)  // Filtra apenas stakes com lock: true
      .reduce((total, stake) => total + stake.amount, 0); // Soma os montantes
      
  };

  // Calcula o total do investimento filtrado
  const totalInvestimento = calcularTotalInvestimento(item.staking);
  const userInvestment = totalInvestimento;
  const updatedValidators = updateSlashingRisk(userInvestment);
  const totalTransferAmount = walletvision?.betvision?.totaltransferamount || 0;
  const totalBets = walletvision?.betvision?.totalbet || 0;
  const conversionLog = walletvision?.conversions?.[0]?.totalconvert || 0;
  let bitsOnStaking =  Math.floor(item.bitsOnStaking || 0);
  const MIN_INTERVAL_SECONDS = 8;
  const { db } = await dbConnect();

  for (const staking of item.staking) {
    const validator = updatedValidators.find(v => v.validatorId === staking.validatorId);
    if (!validator || staking.amount < validator.minStake || !staking.lock) continue;
    const lastRewardDateOP = new Date(staking.lastRewardDateOP || 0);
    const lastRewardDate = new Date(staking.lastRewardDate|| 0);
    const segundosDesdeUltimaRecompensa = Math.floor((hoje.getTime() - lastRewardDateOP.getTime()) / 1000);

    if (segundosDesdeUltimaRecompensa < MIN_INTERVAL_SECONDS) {
      continue; // Ignorar se não passou tempo suficiente desde a última recompensa
    }

    const inicioStaking = new Date(staking.startTime);
    const segundosPassados = Math.floor((hoje.getTime() - inicioStaking.getTime()) / 1000);
    const intervaloRecompensa = totalBets > 10 ? 12 * 60 * 60 : 24 * 60 * 60;

     
    // ** Verifica se o staking está apto a ganhar recompensas **
    if (segundosPassados < intervaloRecompensa || !validator.rewardRate) continue;

    // Ajuste para o cálculo dos juros com base na dificuldade de minerar 1 Bits
    let juros = staking.amount * DIFFICULTY_FACTOR;

    const slashingPenalty = staking.amount * validator.slashingRisk;

    // ** Verifica se o staking é recente (menos de 2 dias) e não aplica penalidade de slashing **
    const doisDiasEmSegundos = 2 * 24 * 60 * 60; // 2 dias em segundos
    if (segundosPassados < doisDiasEmSegundos) {
      // Se o staking é recente, não aplicar penalidade de slashing
      juros = Math.max(juros, 0); // Garantir que os juros não fiquem negativos
    } else {
      // Aplicação de slashing, mas sem zerar os juros completamente
      if (slashingPenalty > 0 && juros > 0) {
        const slashingApplied = Math.min(slashingPenalty, juros * 0.9); // No máximo 90% dos juros
        juros -= slashingApplied;
       // Incrementa com juros líquidos
        bitsOnStaking += Math.floor(juros);
      } else {
        juros = 0;
      }
    }

    // Verifica se o staking individual está abaixo do mínimo necessário ou se o amount é 0
    if (validator && (staking.amount < validator.minStake || staking.amount === 0) && staking.lock) {
      staking.lock = false; // Desbloqueia o staking na memória

      // Atualiza o status de lock no banco de dados para este staking específico
      await db.collection('items').updateOne(
        { id: item.id, 'staking.validatorId': staking.validatorId },
        { 
          $set: { 'staking.$.lock': false },
          $currentDate: { lastModified: true }
        }
      );
    }

    // Limita o total de juros a um valor pequeno (ajuste o limite conforme necessário)
    const JUROS_LIMIT = 50; // Exemplo de limite em moeda
    if (juros > JUROS_LIMIT) {
      juros = JUROS_LIMIT;
    }

    const transferBonus = totalTransferAmount > 50000 ? 1.1 : 1;
    const conversionBonus = conversionLog > 100000 ? 1.05 : 1;
    juros *= transferBonus * conversionBonus;

    totalJurosAcumulados += juros;


    const novaDataRecompensa = new Date(hoje.getTime() + MIN_INTERVAL_SECONDS * 1000);
    staking.lastRewardDateOP = novaDataRecompensa;

    let dataProximaRecompensa = new Date(novaDataRecompensa);
    if (segundosPassados >= intervaloRecompensa) {
      dataProximaRecompensa.setSeconds(lastRewardDate.getSeconds() + intervaloRecompensa);
    }
    if (!proximaRecompensa || dataProximaRecompensa < proximaRecompensa) {
      proximaRecompensa = dataProximaRecompensa;
    }

    totalRewardRate += validator.rewardRate * staking.amount;
    totalAmountStaked += staking.amount;
  }

  
  for (const staking of item.staking) {
    if (staking.amount < 10000 && staking.lock) {
      staking.lock = false; // Desbloqueia o staking
    }
  }

  const updatedStaking = item.staking.map((staking: Staking) => {
    const canUnlock = canUnlockStaking(staking.startTime, staking.validatorId);
    const lastRewardDate = staking.lastRewardDateOP ? new Date(staking.lastRewardDateOP) : null;
    const stakingToBitsRatio = 35.0; // Remoção de 35 staking.amount para obter 1 bitsOnStaking

    const updated = { 
      ...staking,
      lastRewardDateOP: lastRewardDate,
     };

    // Verifica se o staking é desbloqueado e aplica penalidade
    if (staking.lock && canUnlock) {
      updated.lock = false; // Desbloqueia o staking se o tempo máximo foi atingido
      
    }

    
    const validator = updatedValidators.find(v => v.validatorId === staking.validatorId);
    
    if (validator) {
      let juros = totalJurosAcumulados;
    
      const slashingPenalty = totalJurosAcumulados * validator.slashingRisk;
    
      // Verifica se houve aumento nos bitsOnStaking (novos bits)
      const bitsGanhos = bitsOnStaking - item.bitsOnStaking;
    
      if (bitsGanhos > 0) {
        // Calcula a penalização com base no incremento de bitsOnStaking
        const stakingToBitsPenalty = bitsGanhos * stakingToBitsRatio; // Quantos staking.amount devem ser removidos
    
        // Se o staking não estiver bloqueado, não aplica penalidade
        if (staking.lock) {
          // Verifica se o staking é recente (menos de 2 dias) e mantém a quantia intacta
          const segundosPassados = Math.floor((hoje.getTime() - new Date(staking.startTime).getTime()) / 1000);
          const doisDiasEmSegundos = 2 * 24 * 60 * 60; // 2 dias em segundos
    
          if (segundosPassados < doisDiasEmSegundos) {
            updated.amount = Math.floor(staking.amount); // Mantém a quantia intacta como inteiro
          } else {
            juros -= Math.min(slashingPenalty, juros); // Aplica a penalidade de slashing aos juros acumulados
    
            // Aplica a penalidade com base em bitsOnStaking
            const totalPenalty = juros + stakingToBitsPenalty;
    
            updated.amount = Math.max(Math.floor(staking.amount - totalPenalty), 0); // Atualiza o valor com a penalidade total
          }
        } else {
          updated.amount = Math.floor(staking.amount); // Arredonda para baixo se não estiver bloqueado
        }
      } else {
        // Se não houver novos bits, não aplica penalidade
        updated.amount = Math.floor(staking.amount); // Arredonda para baixo
      }
    }
    // ** Adicionando campos de data de início e fim **
    updated.startDate = staking.startDate || new Date(); // Data de início
    updated.endDate = canUnlock ? hoje : null; // Define a data de término se desbloqueado

    return updated;
  });


 
  // Calculo da mediaRewardRate
  let mediaRewardRate = totalAmountStaked > 0 ? (totalRewardRate / totalAmountStaked).toFixed(2) : '0.00';

 // Verifica se a Taxa de média de Recompensa excede 4%
if (parseFloat(mediaRewardRate) > 4) {
  // Gera um número aleatório entre 1% e 4% (ajuste o intervalo conforme necessário)
  const randomPercent = (Math.random() * (4 - 1) + 1).toFixed(2);
  mediaRewardRate = randomPercent; // Ajusta para o valor aleatório
}

  bitsOnStaking = Math.floor(bitsOnStaking);
  await db.collection('items').updateOne(
    { id: item.id },
    { $set: { staking: updatedStaking, bitsOnStaking }, $currentDate: { lastModified: true } }
  );
  

 
 // Calculando o valor total de staking.amount inicial
const initialStakingAmount = item.staking.reduce((accum: any, staking: any) => accum + staking.initialamount, 0);

// Calculando a porcentagem de ganhos em bitsOnStaking
const gainInBits = bitsOnStaking - item.bitsOnStaking;
const percentageGainInBits = (gainInBits / item.bitsOnStaking) * 100;

// Calculando a porcentagem de aumento no valor de staking.amount
const amountIncrease = updatedStaking.reduce((accum: any, staking: any) => accum + staking.amount, 0) - initialStakingAmount;
const percentageIncreaseInAmount = (amountIncrease / initialStakingAmount) * 100;

// Calculando a porcentagem de retirada do staking.amount
const totalWithdrawal = updatedStaking.reduce((accum: any, staking: any) => accum + (initialStakingAmount - staking.amount), 0);
const percentageWithdrawalInAmount = (totalWithdrawal / initialStakingAmount) * 100;

  
  return {
    proximaRecompensa,
    totalJurosAcumulados,
    mediaRewardRate,
    updatedStaking,
    porcentagemGanhosEmBits: percentageGainInBits.toFixed(2),  // Exibe a porcentagem de ganhos em bits
    porcentagemAumentoNoValor: percentageIncreaseInAmount.toFixed(2),  // Exibe a porcentagem de aumento no valor
    porcentagemRetiradaDoStaking: percentageWithdrawalInAmount.toFixed(2),  // Exibe a porcentagem de retirada
    updatedBitsOnStaking: bitsOnStaking ,
  };
};