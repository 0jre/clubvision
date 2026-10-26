import { dbConnect, reformsCollectionName } from '@/core/integration/connect';

// Função para verificar se o usuário tem o selo de identidade
async function verifyIdentity(userId: string) {
  const { db } = await dbConnect();  // Conectar ao banco de dados

  // Buscar o registro do usuário na coleção reforms
  const reformsCollection = db.collection(reformsCollectionName);
  const userRecord = await reformsCollection.findOne({ userId });

  // Verificar se o usuário tem o selo de identidade
  if (userRecord && userRecord.unverifid === true) {
    return {
      status: 'success',
      message: 'Sua conta tem problemas com o sistema de verificação de identidade.',
      verified: false,
      monetization: false
    };
  }

  // Se o usuário não tiver o selo de identidade
  return {
    status: 'error',
    message: 'Sua conta não tem problema com o sistema.',
    verified: true,
    monetization: true
  };
}


export default verifyIdentity