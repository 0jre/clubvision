import { v4 as uuidv4 } from 'uuid';


/// Gera um user.id no formato: 839417-AXQ_4fD8-zA91Y-BR
function generateCustomUserId(discordId: string, iipcHash: string, visionid: string, customUuid: string, locale: string): string {
  // Pegar os 3 primeiros e 3 últimos do ID do Discord
  const part1 = `${discordId.slice(0, 3)}${discordId.slice(-3)}`;

  // 3 letras do IIPC (logo após "IIPC", que é prefixo fixo)
  const iipcLetters = iipcHash.slice(8, 11); // Ex: IIPCabcd12**AXQ**56 → "AXQ"

  // 4 caracteres do customHash (extraídos do visionid, que tem no final ".visionid:<hash>")
  const visionHashMatch = visionid.match(/visionid:([a-zA-Z0-9\-:]+)/);
  const visionHash = visionHashMatch ? visionHashMatch[1].replace(/[-:]/g, '') : '0000';
  const hash4 = visionHash.slice(0, 4);

  // Localização (BR, PT)
  const loc = locale.toUpperCase();

  return `${part1}-${iipcLetters}_${hash4}-${loc}`;
}


// Gerar Chave Pública, Privada e Assinatura
export function generateUserProof(userId: string, locale: string) {
  const visionid = generateVisionid(userId);
  const iipcHash = generateIipcHash();
  const signatureFormatted = generateSignature(
    userId, 
    locale,
    iipcHash
  );
  const customUuid = generateCustomUuid();
  const visionuserId = generateCustomUserId(userId, iipcHash, visionid, customUuid, locale);

  return {
    visionuserId,
    signature: signatureFormatted,
    visionid,
    iipcHash,
  };
}

// Gerar o visionid automaticamente
function generateVisionid(userId: string): string {
  const prefix = 'GOSPCX:NVRP-BBT0X'; 
  const generatedUuid = uuidv4(); 
  const generatedHash = generateCustomHash();

  return `club_${prefix}.${userId}${generatedUuid}.novision.visionid:${generatedHash}`;
}

// Gerar hash personalizado no formato *-**-***:** (ex: a-bcd-efg:h1)
function generateCustomHash(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let hash = '';
  for (let i = 0; i < 8; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${hash[0]}-${hash[1]}${hash[2]}-${hash[3]}${hash[4]}${hash[5]}:${hash[6]}${hash[7]}`;
}

// Gerar o hash IIPC conforme os requisitos
function generateIipcHash(): string {
  const part1 = Math.random().toString(36).substring(2, 6); 
  const part2 = Math.floor(Math.random() * 90 + 10); 
  const part3 = Math.random().toString(36).substring(2, 5); 
  const part4 = Math.floor(Math.random() * 90 + 10); 
  const part5 = Math.floor(Math.random() * 10); 

  return `IIPC${part1}${part2}${part3}${part4}${part5}`;
}


function generateSignature(
  userId: string,
  locale: string,
  iipcHash: string
): string {
  const generatedUuid = generateCustomUuid();
  const signatureData = [
    `${userId}`,   
    `MCC${'04'}0005`,           
    `0055^${locale}`,            
    `V-ID^${generatedUuid}`, 
    `${iipcHash}`,           
    'nvxre.novision.club.signature',
  ];

  return signatureData.join('');
}


function generateCustomUuid(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 8; 
  
  let part1 = 'gICnb-'; 
  let block1 = '';
  let block2 = '';
  let block3 = '';
  let block4 = '';
  let block5 = 'GGC';

  for (let i = 0; i < length; i++) {
    block1 += chars.charAt(Math.floor(Math.random() * chars.length));
    block2 += chars.charAt(Math.floor(Math.random() * chars.length));
    block3 += chars.charAt(Math.floor(Math.random() * chars.length));
    block4 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${part1}${block1}-${block2}-${block3}-${block4}:${block5}`;
}