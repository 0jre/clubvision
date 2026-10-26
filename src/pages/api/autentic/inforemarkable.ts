import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/core/integration/connect";
import { encrypt } from "@/core/security/encryption";

interface UserStats {
  coins?: number;
  banking?: number;
  bits: number;
  level: number;
  clubactivity: number;
  invite: number;
  momentum: string;
  xp: number;
}

interface UserFollowers {
  followers: string[]; 
  quality: any
  locked: boolean
}



export async function Inforemarkable(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID not provided" });
  }

  try {
    const { db } = await dbConnect();
     
    // Obtemos as coleções necessárias
    const statsCollection = db.collection<UserStats>("member-stats");
    const Collection = db.collection<UserStats>("items");
    const followersCollection = db.collection<UserFollowers>("users");

    // Obtemos os dados do usuário
    const userStats = await statsCollection.findOne({ member_id: userId });
    const userFollowers = await followersCollection.findOne({ id: userId });
    const items = await Collection.findOne({ id: userId });

    if (!userStats) {
      return res.status(404).json({ message: "User stats not found" });
    }
    
    if (!userFollowers) {
      return res.status(404).json({ message: "User followers not found" });
    }
    
    if (!items) {
      return res.status(404).json({ message: "User items not found" });
    }

    // Obtemos o número total de usuários registrados na plataforma
    const totalUsers = await followersCollection.countDocuments();

    if (totalUsers === 0) {
      return res.status(500).json({ message: "No users found in the platform" });
    }

    // Variáveis principais
    const coins = items?.coins ?? 0;
    const banking = items?.banking ?? 0;
    const bits = items?.bits ?? 0;
    const level = userStats?.level ?? 0;
    const xp = userStats?.xp ?? 0;  // Adicionando xp
    const followersCount = Array.isArray(userFollowers?.followers) ? userFollowers.followers.length : 0;

    // Ajuste para garantir que o total de wealth não ultrapasse o level + xp
    const totalWealth = coins + banking + bits;
    const adjustedWealth = Math.min(totalWealth, level + xp);  // Limitar o wealth para o valor máximo de level + xp

    // Classificar Reconhecimento (baseado em seguidores em relação ao total de usuários)
    const followersPercentage = (followersCount / totalUsers) * 100;
    let recognitionScore: number;

    if (followersPercentage <= 1) {
      recognitionScore = 0;
    } else if (followersPercentage <= 10) {
      recognitionScore = 20;
    } else if (followersPercentage <= 50) {
      recognitionScore = 50;
    } else if (followersPercentage <= 90) {
      recognitionScore = 80;
    } else {
      recognitionScore = 100;
    }

    // Classificar Riqueza (baseado em patrimônio)
    let wealthScore: number;
    if (adjustedWealth <= 100) {
      wealthScore = 10;
    } else if (adjustedWealth <= 1000) {
      wealthScore = 30;
    } else if (adjustedWealth <= 10000) {
      wealthScore = 60;
    } else if (adjustedWealth <= 100000) {
      wealthScore = 80;
    } else {
      wealthScore = 100;
    }

    // Calcular porcentagem baseada no nível do usuário
    const levelPercentage = Math.min((level / 299) * 100, 100);

    // Calcular a porcentagem de clubactivity
    const maxClubActivity = 800000;
    const clubActivityPercentage = Math.min((userStats?.clubactivity ?? 0 / maxClubActivity) * 100, 100);

    // Calcular Momentum Ponderado com o nível e a atividade no clube
    const weightedScore = (wealthScore * 0.4) + (recognitionScore * 0.2) + (levelPercentage * 0.1) + (clubActivityPercentage * 0.3);

    // Determinar Momentum com base na pontuação ponderada
    let momentum: string;

    // Ajustar os limites para uma progressão mais difícil
    if (weightedScore <= 25) {
      momentum = "Desconhecido";  // Requer mais esforço para alcançar "Promissor"
    } else if (weightedScore <= 45) {
      momentum = "Promissor";
    } else if (weightedScore <= 65) {
      momentum = "Destaque";  // Mais difícil de alcançar
    } else if (weightedScore <= 85) {
      momentum = "Elite";     // Exige grande envolvimento
    } else if (weightedScore <= 100) {
      momentum = "Grandmaster";  // Nível máximo alcançável
    } else {
      momentum = "Legendary";  // Um extra para a excelência
    }

    // Verificar se o momentum calculado é maior ou igual ao momentum registrado
    const currentMomentumValue = userStats?.momentum ? getMomentumValue(userStats.momentum) : 0;
    const newMomentumValue = getMomentumValue(momentum);

    if (newMomentumValue < currentMomentumValue) {
      momentum = userStats?.momentum ?? 'null';  // Manter o momentum anterior se o novo for menor
    }

    // Atualizar o momentum na coleção
    await statsCollection.updateOne(
      { member_id: userId },
      { $set: { momentum: momentum } }
    );

    // Resposta com os dados calculados
    const responseData = {
      momentum: momentum,
      followersPercentage,
      level: userStats?.level,
      clubactivity: userStats?.clubactivity,
      invite: userStats?.invite,
      quality: userFollowers.quality,
      locked: userFollowers.locked
    };

    const encryptedData = encrypt(JSON.stringify(responseData));
    return res.status(200).json({ log: encryptedData });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Função auxiliar para comparar os valores do momentum
function getMomentumValue(momentum: string): number {
  const momentumValues: { [key: string]: number } = {
    "Desconhecido": 0,
    "Promissor": 20,
    "Destaque": 40,
    "Elite": 60,
    "Grandmaster": 80,
    "Legendary": 100
  };
  return momentumValues[momentum] ?? 0;
}

