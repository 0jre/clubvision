export interface User {
 
  User: any;
  user:any;
  id: string;
  name: string;
  username: string;
  avatar: string;
  codeVerified: boolean;
  IsafeSecurity: boolean;
  authorizationCode: string;
  firstLoginDate: string;
  GuestUser: number;
  email: string;

  reforms?: {
    userId: string;
    name: string;
    Idade: string;
    Instagram: string; 
    Twitter: string;
    Tiktok: string;
    BioLi: string;
    verified: string;
    type: string;
    nvxre: string;
    prime: string;
    nvrp: string;
    bannerfundo: string;
    inviteCode: string;
    used: boolean;
    event: string;
    support: string;

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
    
  };

  steam?:{
    userId: string;
    displayName: string;
    id: string;
    hexid: string;
  }

  twitch?:{
    userId: string;
    user_nametwitch: string;
    user_idtwitch: string;
  }
   
  modlog?: {
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
  };


  cla?: {
    userId: string,  
    namecla: string, 
    Idade: string, 
    Instagram: string, 
    Twitter: string, 
    Discord: string, 
    LogoCla: string,
    FaixaCla: string,
    Youtube: string, 
    Tiktok: string, 
    BioLi: string, 
    Character:string, 
    Clasigla: string, 
    ClaHistory: string, 
    verified: string,
    inviteCode: string;
    type: string;
    Members: string[];
    id:string;
  }
 
} 
