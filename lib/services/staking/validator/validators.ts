import { Validator } from '@/types/stk/Validator';

const validators: Validator[] = [
  {
    validatorId: "validator1",
    name: "GenVenture AB",
    performance: 45,
    rewardRate: 1,
    minStake: 10000,
    isActive: true,
    slashingRisk: 0.1, // Exemplo de valor
    timeStaked: 15,
    totalDelegatedCoins: 0,
    rewardsGenerated: 0
  },
  {
    validatorId: "validator2",
    name: "WalletVision",
    performance: 78,
    rewardRate: 2,
    minStake: 10000,
    isActive: true,
    slashingRisk: 0.2, // Exemplo de valor
    timeStaked: 30,
    totalDelegatedCoins: 0,
    rewardsGenerated: 0
  },
  {
    validatorId: "validator3",
    name: "Univision X",
    performance: 88,
    rewardRate: 0.5,
    minStake: 10000,
    isActive: true,
    slashingRisk: 0.05, // Exemplo de valor
    timeStaked: 60,
    totalDelegatedCoins: 0,
    rewardsGenerated: 0
  },
];

export default validators;
