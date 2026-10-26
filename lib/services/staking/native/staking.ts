import { UserItem } from '@/types/stk/UserItem';
import { Db } from 'mongodb';
import validators from '../validator/validators';

// Define o tipo de retorno da função
type PerformDelegationResult = {
  success: boolean;
  message?: string;
};

export const performDelegation = async (
  db: Db,
  userId: string,
  coinsToStake: number,
  validatorId: string
): Promise<PerformDelegationResult> => {
  // Verificação de quantidade mínima
  if (coinsToStake < 100000) {
    return { success: false, message: 'O valor mínimo para staking é 100 mil coins.' };
  }

  // Busca o usuário no banco de dados
  const userItem = await db.collection<UserItem>('items').findOne({ id: userId });
  if (!userItem || userItem.coins < coinsToStake) {
    return { success: false, message: 'Usuário não encontrado ou saldo insuficiente.' };
  }

  // Verifica se o validador é válido
  const validator = validators.find(v => v.validatorId === validatorId);
  if (!validator) {
    return { success: false, message: 'Validador não encontrado.' };
  }

  // Armazenar os dados do staking
  await db.collection('items').updateOne(
    { id: userId },
    {
      $inc: { coins: -coinsToStake }, // Reduz o saldo de coins do usuário
      $push: {
        staking: {
          validatorId,
          initialamount: coinsToStake,
          amount: coinsToStake,
          startTime: new Date(), // Armazena a data de início do staking
          lastRewardDate: new Date(), // Armazena a última data de recompensa
          lock: true // Marca o staking como bloqueado
        },
      },
    }
  );

  return { success: true, message: 'Coins delegadas com sucesso ao validador!' };
};
