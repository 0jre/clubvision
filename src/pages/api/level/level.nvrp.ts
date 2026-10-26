import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';
import { dbConnect } from "@/core/integration/connect";
import { Levelinfo } from "@/types/user/level.up";
import { encrypt } from "@/core/security/encryption";
import { ListedBadges } from "@/data/list_tvl/list.badges";

// Função para calcular o XP necessário para o próximo nível
const calculateXpNeeded = (level: number): number => {
  return level * level * 100; // Fórmula para calcular o XP necessário
};

// Função de normalização dinâmica do clubactivity
const normalizeClubActivity = (clubactivity: number): number => {
  const maxPossibleScore = 1000;  // O limite máximo do score
  const scaleFactor = 100000;  // Fator de escala (pode ser ajustado conforme necessário)

  const normalized = Math.min((clubactivity / scaleFactor) * maxPossibleScore, maxPossibleScore);
  
  return normalized;  // Retorna o score normalizado entre 0 e 1000
};


export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  const { db } = await dbConnect();
   const sessionUser = req.session?.get('user');
    // Verifique se o usuário está autenticado
    if (!req.session || !req.session.get('user')) {
      return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
    }

      const userId  = sessionUser.id;
 
     if (!userId) {
    return res.status(400).json({ message: "User ID not provided" });
     }

   const collection = db.collection<Levelinfo>("member-stats");
    const userForm = await collection.findOne({ member_id: userId });
 

  if (req.method === "POST") {
  await collection.updateOne(
    { member_id: userId },
    { $set: { animated: true } }
  );
  return res.status(200).json({ ok: true });
}
  
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    
    if (!userForm) {
      return res.status(404).json({ message: 'Estatísticas do usuário não encontradas.' });
    }

    // Verifica se xp e level estão definidos corretamente
    let { xp, level, clubactivity, myemblems } = userForm;

    if (isNaN(xp) || xp < 0) xp = 0;
    if (isNaN(level) || level < 0) level = 1;

    // Inicializa myemblems como array vazio, se não for um array
    if (!Array.isArray(myemblems)) {
      myemblems = [];
    }

    // Garantir que myemblems seja sempre um array antes de usar map
    if (Array.isArray(myemblems)) {
      myemblems = myemblems.map(Number); // Aplica map se for realmente um array
    } else {
      myemblems = []; // Caso não seja um array, inicializa como um array vazio
    }

    // Calcula o XP necessário para o próximo nível
    let xpNeeded = calculateXpNeeded(level);

    // Incrementa os níveis com base no XP acumulado, sem causar valores infinitos
    let levelUp = false;
    while (xp >= xpNeeded) {
      xp -= xpNeeded;
      level += 1;
      xpNeeded = calculateXpNeeded(level); // Atualiza o XP necessário para o próximo nível
      levelUp = true;
    }

    // Atualiza as estatísticas no banco de dados apenas se necessário
    if (userForm.xp !== xp || userForm.level !== level) {
  await collection.updateOne(
    { member_id: userId },
    {
      $set: {
        xp,
        level,
        updatelevel: new Date(), // registra data do level up
        animated: false,         // marca que ainda não animou
      },
    }
  );
}

    // Normaliza o clubactivity para um score entre 0 e 1000
    const clubactivityScore = normalizeClubActivity(clubactivity);

    // Lógica para entrega da badge com base no clubactivityScore
    const eligibleBadges = ListedBadges.filter((badge: any) => {
      let isEligible = badge.level <= level && badge.quantity > 0;

      // Adicionando maior peso ao clubactivityScore
      // Exigindo que o clubactivityScore tenha um peso maior para badges raras
      if (badge.rarity === "Visionário") {
        isEligible = isEligible && clubactivityScore >= 900; // Exige 90% do score máximo
      } else if (badge.rarity === "Único") {
        isEligible = isEligible && clubactivityScore >= 750; // Exige 75% do score máximo
      } else if (badge.rarity === "Raro") {
        isEligible = isEligible && clubactivityScore >= 500; // Exige 50% do score máximo
      } else {
        // Para badges comuns, um valor mais baixo é suficiente
        isEligible = isEligible && clubactivityScore >= 200; // Exige 20% do score máximo
      }

      return isEligible;
    });

    // Filtra badges que o usuário já não tenha
    const availableBadges = eligibleBadges.filter((badge: any) => {
      const badgeId = Number(badge.id);  // Garantir que o id seja tratado como número
      return !myemblems.includes(badgeId);  // Só entrega se o usuário ainda não tiver a badge
    });

  // Lógica de verificação do limite de quantidade
for (let badge of availableBadges) {
  // Contabilizar o número de usuários que já possuem a badge
  const ownersCount = await collection.countDocuments({
    "myemblems": badge.id,
  });

  // Convertendo a quantity para número para garantir que o cálculo seja feito corretamente
  const badgeQuantity = Number(badge.quantity); // Ou parseInt(badge.quantity, 10)

  // Verifica se a quantidade da badge ainda não foi atingida
  if (ownersCount < badgeQuantity) {
    // Se a quantidade não foi excedida, adicione a badge ao usuário
    const badgeId = Number(badge.id);
    myemblems.push(badgeId); // Adiciona a badge ao usuário

    // Convertendo novamente para string ao atualizar a quantity
    badge.quantity = (badgeQuantity - 1).toString();  // Converte de volta para string
  }
}


    // Atualiza o usuário no banco de dados com as novas badges
    await collection.updateOne(
      { member_id: userId },
      {
        $set: {
          myemblems, // Atualiza o array de emblemas do usuário
        },
      }
    );

    // Projetar apenas os campos necessários para a resposta
    const projectedLog = {
      _id: userForm._id.toString(),
      guild_id: userForm.guild_id,
      member_id: userForm.member_id,
      messages: userForm.messages,
      xp: userForm.xp,
      clubactivity: userForm.clubactivity,
      invite: userForm.invite,
      level: userForm.level,
      created_at: userForm.created_at,
      updated_at: userForm.updated_at,
      animated: userForm.animated,
      updatelevel: userForm.updatelevel,
      __v: userForm.__v,
      voice: {
        connections: userForm.voice.connections,
        time: userForm.voice.time,
      },
      contexts: {
        message: userForm.contexts.message,
        user: userForm.contexts.user,
      },
      myemblems: myemblems, // Inclui as badges entregues
    };

    const nvxcrypted = encrypt(JSON.stringify(projectedLog));
    return res.status(200).json({ log: nvxcrypted });

  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const checkAuthWithSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  // Use o await para chamar a função original checkAuth
  await checkAuth(req, res);
};

export default withSession(checkAuthWithSession);
