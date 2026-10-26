import { ObjectId } from "mongodb";

export interface UserItem {
     _id: ObjectId;
    userId: string;
    bits: number;  
    coins: number;   
    visioncard: VisionCard[];  
    created_at: Date;
    updated_at: Date;
    banking: number;
    firstname: string;
    lastname: string;
    bitsCredits: number; 
    orbitCredits: number; 
    vpoints: number;  
    activities: number;  
    
  }

export interface MemberStats {
    userId: string;
    level: number;
    xp: number;
    bits: number;
    coins: number;
    created_at: Date;
    updated_at: Date;
    banking: number;
}
  
export  interface VisionCard {
    id: string;
    type: 'Sapphire' | 'VisionPay' | 'VΛULT';
    balance: number;
    createdAt: Date;
     autoPaymentEnabled: boolean;
    lastModified: Date;
  }
  