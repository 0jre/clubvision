import { dbConnect } from "@/core/integration/connect";

export interface UserInfo {
  _id: string; 
  avatar: string;
  username: string;
  userId: string;
  name: string;
  Idade: string;
  Instagram: string;
  Twitter: string;
  vid: string;
  Tiktok: string;
  BioLi: string;
  type: string;
  verified: string;
  nvxre: string;
  bannerfundo:string;
  nvrp: string;
  inviteCode: string;
  lastname: string;
  firstname: string;
  NameCharacter: string;
  CharacterHistory: string;
  Character: string;
  Backgroundtheme: string;
  IconeGlobal: string;
  nickname: string;
  prime: string;
  event: string;
  support: string;
  hexid: string;
  socioclub:boolean;
  keymaster:boolean;
  contractmiss:boolean;
  contractcla:boolean;
  contractunix:boolean;
  visiondrop:boolean;
  contractax:boolean;
  keyplusinvite: boolean;
  contractvision:boolean;
  usedLimitInvite: number;
  maxlimitinvite: number;
  usednumber: number;
  limitipost: number;
  discriminator: string;
  firstLoginDate: string;
  accepted: boolean;
 subdominio: string;
 following: number;
 followers: number;
  id: string;
  manager: boolean;
  bod: boolean;
  coo: boolean;
  ceo: boolean;
  cto: boolean;
  cmo: boolean;
  cdo: boolean;
  developer: boolean;
  typeprime: string;
  keygreen: boolean;
  viewprime: boolean;
  contributor: boolean;
  developer3d: boolean;
  havocac: boolean;
  leader: boolean;
  modder3d: boolean;
  qa: boolean;
  vehicledev: boolean;
  selo: boolean;
  unic: string;
  accessinvite: boolean;

  
  vision:{
    signature: string;
    visionid: string;
  }

   quality:{ 
    reputation: string, 
    statsaccount: string, 
  }

  reforms:{
    userId: string,
    BioLi: string,
    nvrp: boolean,
    verified: boolean,
    nvxre: boolean
  }
}


 

  
export async function getUserInfo(guildId: string, targetId: string): Promise<UserInfo[]> {
  try {
    const { db, client } = await dbConnect();
    const collection = db.collection<UserInfo>("reforms");
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

