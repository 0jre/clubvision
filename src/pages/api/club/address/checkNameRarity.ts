import { dbConnect } from '@/core/integration/connect';
import { NextApiRequest, NextApiResponse } from 'next';

// Lista de nomes reservados que não podem ser registrados
const reservedNames = ["nvrp", "clubvision", "novision", "vision"];

// Função para calcular o custo com base no número de caracteres
const calculateNameCost = (name: string): number => {
  const length = name.length;

  // Define o custo com base no número de caracteres
  let bits: number;
  if (length >= 1 && length <= 3) {
    // Custo alto para nomes de 1 a 3 caracteres
    bits = Math.floor(Math.random() * (58500 - 30000 + 1)) + 30000; 
  } else if (length >= 4 && length <= 7) {
    // Custo moderado para nomes de 4 a 7 caracteres
    bits = Math.floor(Math.random() * (34000 - 10000 + 1)) + 10000; 
  } else if (length >= 8) {
    // Custo baixo para nomes de 8 ou mais caracteres
    bits = Math.floor(Math.random() * (5500 - 1000 + 1)) + 1000; 
  } else {
    bits = 0; // Retorna 0 para nomes inválidos
  }

  return bits;
};

// Função para verificar se o nome já está registrado na coleção users
const checkIfNameExistsInUsers = async (name: string): Promise<any> => {
  const { db } = await dbConnect(); // Conectar ao banco de dados MongoDB
  const existingName = await db.collection("users").findOne({ name: name });
  return existingName; // Retorna o documento se o nome já estiver registrado
};

// Função para verificar se o nome já está registrado na coleção address.name
const checkIfNameExistsInAddressName = async (name: string): Promise<any> => {
  const { db } = await dbConnect(); // Conectar ao banco de dados MongoDB
  const existingName = await db.collection("address.name").findOne({ name });
  return existingName; // Retorna o documento se o nome já estiver registrado
};

// API handler
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    // Extrai o nome da query string
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Nome inválido' });
    }

    // Verificar se o nome está na lista de nomes reservados
    if (reservedNames.includes(name.toLowerCase())) {
      return res.status(400).json({ error: "Nome reservado e não pode ser registrado" });
    }

    // Verificar se o nome já está registrado na coleção users
    const existingNameInUsers = await checkIfNameExistsInUsers(name);

    if (existingNameInUsers) {
      return res.status(200).json({
        isNameTaken: true,
        costInBits: null,
        rarity: null,
      });
    }

    // Verificar se o nome já está registrado na coleção address.name
    const existingNameInAddressName = await checkIfNameExistsInAddressName(name);
    let costInBits;
    let rarity;

    if (existingNameInAddressName) {
      costInBits = existingNameInAddressName.costInBits; // Usar o custo armazenado
      rarity = existingNameInAddressName.rarity; // Usar a raridade armazenada
    } else {
      costInBits = calculateNameCost(name);
      rarity = name.length >= 1 && name.length <= 7 ? 'Raro' : 'Comum';

      // Armazenar o novo nome com custo e raridade no banco de dados
      const { db } = await dbConnect();
      await db.collection("address.name").insertOne({ name, costInBits, rarity });
    }

    return res.status(200).json({
      isNameTaken: false,
      costInBits,
      rarity,
    });
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
};