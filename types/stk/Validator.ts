export interface Validator {
    validatorId: string;
    name: string;
    performance: number; 
    totalDelegatedCoins: number;
    rewardsGenerated: number;
    slashingRisk?: number;
    timeStaked?: number;
    rewardRate?: number;
    minStake?: number;
    isActive: boolean;
  }
  