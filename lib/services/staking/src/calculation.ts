import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';
import { dbConnect } from '@/core/integration/connect';
import { calculateRewards, canUnlockStaking } from '@/lib/services/staking/filters/calculateRewards';
import validators from '@/lib/services/staking/validator/validators'; 

export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  if (!['POST', 'GET'].includes(req.method || '')) {
    return res.status(405).json({ message: 'Método não permitido.' });
  }
  const sessionUser = req.session?.get('user');
  if (!req.session || !req.session.get('user')) {
    return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
  }
   
  const userId  = sessionUser.id

  try {
    const { db } = await dbConnect();
    console.log('Conectado ao banco de dados');

    const doisDiasEmMilissegundos = 2 * 24 * 60 * 60 * 1000;

    const [item, rprime, walletvision, updatedValidators,settings] = await Promise.all([
      db.collection('items').findOne({ id: userId }),
      db.collection('reforms').findOne({ userId: userId, prime: true }),
      db.collection('walletvision').findOne({ endress: 'global_record' }),
      db.collection('validators').find().toArray(),
     db.collection('users').findOne({ id: userId,  }),
    ]);

    if (!rprime) {
      return res.status(400).json({ message: 'Necessario ser premium para conseguir realizar o staking.' });
    }

    const allValidators = [...updatedValidators, ...validators];

    if (!item || !item.staking || item.staking.length === 0) {
      await db.collection('stakings').deleteOne({ userId }); 
      return res.status(401).json({ message: 'Nenhum staking registrado para este usuário.' });
    }

    if (!walletvision) {
      return res.status(404).json({ message: 'Dados globais não encontrados.' });
    }

    const { 
      proximaRecompensa, 
      totalJurosAcumulados, 
      mediaRewardRate, 
      porcentagemGanhosEmBits,
      porcentagemAumentoNoValor,
      porcentagemRetiradaDoStaking,
      updatedStaking, 
      updatedBitsOnStaking 
    } = await calculateRewards(item, walletvision);

    
    
    const updateLockPromises = updatedStaking.map(staking => {
      const tempoDecorrido = new Date().getTime() - new Date(staking.lastRewardDate).getTime();
      if (staking.lock && tempoDecorrido >= doisDiasEmMilissegundos) {
        return db.collection('items').updateOne(
          { id: userId, 'staking.validatorId': staking.validatorId },
          {
            $set: {
              lock: false,
            },
          }
        );
      }
      return null;
    }).filter(Boolean); 
    
    await Promise.all(updateLockPromises);
    
 

    await Promise.all(updateLockPromises);

    if (req.method === 'POST') {
      const isValidUpdate = totalJurosAcumulados > 0 && updatedBitsOnStaking > 0;
      if (!isValidUpdate) {
        return res.status(400).json({ message: 'Os valores a serem atualizados devem ser maiores que zero.' });
      }

      await db.collection('stakings').updateOne(
        { userId }, 
        {
          $set: {
            userId,
            stakingDetails: updatedStaking,
            totalJurosAcumulados: totalJurosAcumulados,
            proximaRecompensa: proximaRecompensa ? proximaRecompensa.toISOString() : null,
            mediaRewardRate,
            porcentagemGanhosEmBits,
            porcentagemAumentoNoValor,
            porcentagemRetiradaDoStaking,
            updatedBitsOnStaking,
            bonusStatus: {
              transferBonus: walletvision?.betvision?.totaltransferamount > 50000,
              betBonus: walletvision?.betvision?.totalbet > 10,
              conversionBonus: walletvision?.conversions?.[0]?.totalconvert > 100000,
            },
          },
        },
        { upsert: true } 
      );
    }

    const proximaRecompensaFormatada = proximaRecompensa ? proximaRecompensa.toISOString() : 'Sem data prevista';

    const bonusStatus = {
      transferBonus: walletvision?.betvision?.totaltransferamount > 50000,
      betBonus: walletvision?.betvision?.totalbet > 10,
      conversionBonus: walletvision?.conversions?.[0]?.totalconvert > 100000,
    };
    
    const detailedStakingInfo = updatedStaking.map(staking => {
      const lastRewardDate = new Date(staking.lastRewardDate).toISOString();
      const canUnlock = canUnlockStaking(staking.startTime, staking.validatorId);

      const isEligibleForReward =
        staking.lock &&
        (new Date().getTime() - new Date(staking.lastRewardDate).getTime()) >= doisDiasEmMilissegundos;

      const validator = allValidators.find(v => v.validatorId === staking.validatorId);

      return {
        validatorId: staking.validatorId,
        amount: staking.amount,
        lock: staking.lock,
        startDate: staking.startDate,
        lastRewardDate,
        canUnlock,
        isEligibleForReward,
        slashingRisk: validator?.slashingRisk || 0,
        rewardRate: validator?.rewardRate || 0,
      };
    });

    return res.status(200).json({
      success: true,
      resumo: {
        proximaRecompensa: proximaRecompensaFormatada,
        jurosAcumulados: totalJurosAcumulados.toFixed(2),
        percentual: `${mediaRewardRate}%`,
        updatedBitsOnStaking: updatedBitsOnStaking,
        porcentagemGanhosEmBits,
        porcentagemAumentoNoValor,
        porcentagemRetiradaDoStaking,
      },
      detalhesStaking: detailedStakingInfo,
      active: !!settings?.wallet.stakingVision,
      bonusStatus,
    });
  } catch (error: any) {
    console.error('Erro ao processar a requisição:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
}



const CalculateStaking: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await checkAuth(req, res);
};

export default withSession(CalculateStaking);

