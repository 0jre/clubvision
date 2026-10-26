import { dbConnect } from "@/core/integration/connect";

export interface UserInfo {
  _id: string; 
  name: string;
  authorizationCode: string;  
}

export async function getUserInfo(guildId: string, targetId: string): Promise<UserInfo[]> {
  try {
    const { db, client } = await dbConnect();
    const collection = db.collection<UserInfo>('users');
    const logs = await collection.find({ guild_id: guildId, id: targetId }).toArray();
    const logsWithStrFields = logs.map((log) => ({
      ...log,
      _id: log._id.toString(),
      authorizationCode: toString(),
    })); 
    return logsWithStrFields;
  } catch (error) {
    console.error('Erro ao buscar os logs:', error);
    return [];
  }
}

