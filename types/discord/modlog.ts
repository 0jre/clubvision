import { dbConnect } from "@/core/integration/connect";

export interface ModLog {
  _id: string; 
  guild_id: string;
  member_id: string;
  reason: string;
  admin: {
    id: string; 
    tag: string; 
  };
  type: string;
  created_at: string; 
}

export async function getModLogs(guildId: string, targetId: string): Promise<ModLog[]> {
  try {
    const { db, client } = await dbConnect();
    const collection = db.collection<ModLog>("mod-logs");
    const logs = await collection.find({ guild_id: guildId, member_id: targetId }).toArray();
    const logsWithStrFields = logs.map((log) => ({
      ...log,
      _id: log._id.toString(),
      created_at: log.created_at.toString(),
    })); 
    return logsWithStrFields;
  } catch (error) {
    console.error("Erro ao buscar os logs:", error);
    return [];
  }
}

