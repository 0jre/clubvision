
// Função para verificar se o usuário é Prime
export async function isUserPrime(userId: string, db: any): Promise<boolean> {
  const reformsCollection = db.collection('reforms');
  const user = await reformsCollection.findOne({ userId });
  return user?.prime === true;
}

// Função para buscar o nome do usuário na coleção 'users'
export async function getUserName(userId: string, db: any): Promise<string | null> {
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ _id: userId }, { projection: { name: 1 } });
  return user?.name || null;
}

// Função para buscar o avatar do usuário
export async function getUserAvatar(userId: string, db: any): Promise<string | null> {
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ _id: userId });
  return user?.avatar || null;
}
