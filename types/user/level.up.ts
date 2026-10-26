import { dbConnect } from "@/core/integration/connect";

export interface Levelinfo {
  _id: string; 
  guild_id: string;
  member_id: string;
  messages: number;
  xp: number;
  clubactivity: number;
  level: number;
  created_at: Date;
  updated_at: Date;
  updatelevel: Date;
  animated: boolean;
  invite: number;
  myemblems: {
    push(id: number): unknown;
    includes(id: number): unknown;
  }
  __v: number; 
  voice: {
    connections: number;
    time: number;
  },
 
  contexts: {
    message: number;
    user: number;
  },

}

export async function getUserInfo(guildId: string, targetId: string): Promise<Levelinfo[]> {
  try {
    const { db, client } = await dbConnect();
    const collection = db.collection<Levelinfo>("member-stats");
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

