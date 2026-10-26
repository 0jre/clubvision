import { dbConnect } from "@/core/integration/connect";

export interface Infocoinuser {
  _id: string; 
  coins: number;
  bits: number;
  token: number;
  privacyMode: boolean
  bitsOnStaking: number;
  banking: number;
  __v: number; 
  prime: boolean;
  lock: boolean;
  reputation: {
    received: number;
    given: number;
  },
  daily: {
    streak: number;
    timestamp: Date;
  },
  created_at: Date;
  updated_at: Date;

  transactions: Transaction[];
  staking: Staking[];
  stakingHistory: HistoryStaking[];
}

export interface Transaction {
  uniqueId: string;
  date: string;
  time: string;
  amount: number;
  currency: string;
  result: string;
  action: string;
  newAmount: number;
  resultStatus: string,
}

export interface Staking {
    nextRewardDate: string | number | Date;
    lastRewardDate: any;
    lastRewardDateOP: any;
    startDate: Date;
    endDate: Date | null;
    validatorId: string;
    amount: number;
    startTime: Date;
    lockedUntil: Date;
    bitsGained: number;
    lock: boolean;
    rewardRate: number;
    slashingRisk: number;
}


export interface HistoryStaking {
  validatorId: string;
  amount: number;
  bitsReceived: number;
  date: Date;
}

export async function getUserInfo(guildId: string, targetId: string): Promise<Infocoinuser[]> {
  try {
    const { db, client } = await dbConnect();
    const collection = db.collection<Infocoinuser>("items");
    const logs = await collection.find({ guild_id: guildId, userId: targetId }).toArray();
    const logsWithStrFields = logs.map((log) => ({
      ...log,
      _id: log._id.toString(),
    })); 
    return logsWithStrFields;
  } catch (error) {
    console.error("Erro ao buscar os logs:", error);
    return [];
  }
}

