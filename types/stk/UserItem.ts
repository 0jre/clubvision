export interface UserItem {
    userId: string;
    coins: number;
    bits: number;
    staking: {
      lastRewardDate: any;
      validatorId: string;
      amount: number;
      startTime: Date;
      lockedUntil: Date;
    }[];
    stakingHistory: {
      validatorId: string;
      amount: number;
      bitsReceived: number;
      date: Date;
    }[];
  }
  