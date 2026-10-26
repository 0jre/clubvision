import { dbConnect } from "@/core/integration/connect";
 
export interface Permission {
  _id: string;
  type: string;
  updated_at: string;
  manager: boolean;
  name: string; 
  created_at: string;

  team: {
    support: boolean
  }
}

export async function getPermission(guildId: string, targetId: string): Promise<Permission[]> {
  try {
    const { db, client } = await dbConnect();
    const collection = db.collection<Permission>("users");
    const logs = await collection.find({ id: targetId}).toArray();
    const logsWithStrFields = logs.map((log) => ({
      ...log,
      _id: log._id.toString(),
      updated_at: log._id.toString(),
    })); 
    return logsWithStrFields;
  } catch (error) {
    console.error("Erro ao buscar os logs:", error);
    return [];
  }
}
