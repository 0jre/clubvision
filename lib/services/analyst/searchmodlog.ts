import { dbConnect, searchmodlog } from '@/core/integration/connect';
import { ObjectId } from 'mongodb';


function isPenaltyType(record: any): boolean {
  return record?.type === 'WARN' || record?.type === 'BAN';
}

async function registerInReforms(userId: string) {
  const { db } = await dbConnect(); 
  const reformsCollection = db.collection('reforms'); 
  const existingRecord = await reformsCollection.findOne({ userId });
  
  if (existingRecord) {
   
    
      await reformsCollection.updateOne(
        { userId },
        { $set: { 
          unverifid: true,
          selo: false,
          typeprime: false,
          keygreen: false,
          accessinvite: false,
         } },
        { upsert: true }
      ); 
  }
  await db.collection('items').updateOne(
    { _id: userId as unknown as ObjectId },
    { $set: { 
      lock: true,
     } },
    { upsert: true }
    )

     await db.collection('users').updateOne(
    { id: userId},
    { $set: { 
      locked: true,
     } },
    { upsert: true }
    )
}

async function unregisterInReforms(userId: string) {
  const { db } = await dbConnect(); 
  const reformsCollection = db.collection('reforms'); 
  const userCollection = db.collection('users'); 

  const existingRecord = await reformsCollection.findOne({ userId });
  const existingusersRecord = await userCollection.findOne({ id: userId });
  if (existingRecord) {
      await reformsCollection.updateOne(
        { userId },
        { $set: { unverifid: false } }, 
        { upsert: true }
      ); 
  }

  if(existingusersRecord) {
     await reformsCollection.updateOne(
        { userId },
        { $set: { locked: false } }, 
        { upsert: true }
      ); 
  }

}


async function analyzePenaltiesAndRestrictions(userId: string) {
  const { db } = await dbConnect(); 
  const searchmodlogCollection = db.collection(searchmodlog);
  const penalties = await searchmodlogCollection.find({ member_id: userId }).toArray(); 
  // Filtrar apenas os registros do tipo 'WARN' ou 'BAN'
  const penaltyRecords = penalties.filter(isPenaltyType);
  const warnCount = penaltyRecords.filter((penalty) => penalty.type === 'WARN').length;
  const hasBan = penaltyRecords.filter((penalty) => penalty.type === 'BAN').length;

  const activex = (hasBan === 0 || warnCount === 2 );

  if (activex) {
    await unregisterInReforms(userId);
  }


  if (penaltyRecords.length === 0) {
    return {
      status: 'success',
      active: false,
      message: 'O usuário não possui penalidades ou restrições.',
      penalties: [],
    };
  }

  
  const active = !(hasBan > 0 || warnCount > 2);
  if (!active) {
    await registerInReforms(userId);
  }
 
 
  const penaltyDetails = penaltyRecords.map((penalty) => ({
    type: penalty.type, // Tipo de penalidade ('WARN' ou 'BAN')
    reason: penalty.reason || 'Sem motivo especificado', 
    date: penalty.created_at || 'Data não especificada', 
  }));

  return {
    status: 'success',
    active, 
    penalized: true,
    message: active
      ? 'Penalidades encontradas, mas dentro dos limites aceitáveis.'
      : 'O usuário possui penalidades que excedem os limites.',
    penalties: penaltyDetails, 
  };
}

export default analyzePenaltiesAndRestrictions;
