 
import { dbConnect } from "@/core/integration/connect";
import { encrypt } from "@/core/security/encryption";
import { Session } from 'next-iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';
export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {

    const sessionUser = req.session?.get('user');
    // Verifique se o usuário está autenticado
    if (!req.session || !req.session.get('user')) {
      return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
    }
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { db } = await dbConnect();
   const { userId } = req.query 
   const usersCollection = db.collection('users');
   const userRecord = await usersCollection.findOne({ id: sessionUser.id });
 
   
   const requestId =  (
    userRecord?.type == 'ADMIN' && userId ||  
    sessionUser.id == userId && sessionUser.id  || userId || sessionUser.id 
  )
  const SendId = requestId
  
  if (!SendId) {
    return res.status(400).json({ message: "User ID not provided" });
  }

  try {
 

    // Busca única utilizando agregação com $lookup
    const result = await db.collection("users").aggregate([
      { $match: { id: SendId } },
      {
        $lookup: {
          from: "reforms",
          localField: "id",
          foreignField: "userId",
          as: "userForm",
        },
      },
      {
        $lookup: {
          from: "steam",
          localField: "id",
          foreignField: "userId",
          as: "steamactive",
        },
      },
      { $unwind: { path: "$userForm", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$steamactive", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          userId: "$userForm.userId",
          name: 1,
          username: "$userForm.name",
          Idade: "$userForm.Idade",
          Instagram: "$userForm.Instagram",
          Twitter: "$userForm.Twitter",
          Tiktok: "$userForm.Tiktok",
          BioLi: "$userForm.BioLi",
          type: "$userForm.type",
          verified: "$userForm.verified",
          nvrp: "$userForm.nvrp",
          lastname: "$userForm.lastname",
          firstname: "$userForm.firstname",
          nvxre: "$userForm.nvxre",
          bannerfundo: "$userForm.bannerfundo",
          inviteCode: "$userForm.inviteCode",
          NameCharacter: "$userForm.NameCharacter",
          CharacterHistory: "$userForm.CharacterHistory",
          Character: "$userForm.Character",
          Backgroundtheme: "$userForm.Backgroundtheme",
          IconeGlobal: "$userForm.IconeGlobal",
          nickname: "$userForm.nickname",
          prime: "$userForm.prime",
          selo: "$userForm.selo",
          unic: "$userForm.unic",
          event: "$userForm.event",
          support: "$userForm.support",
          accessinvite: "$userForm.accessinvite",
          socioclub: "$userForm.socioclub",
          keymaster: "$userForm.keymaster",
          contractmiss: "$userForm.contractmiss",
          contractcla: "$userForm.contractcla",
          contractunix: "$userForm.contractunix",
          visiondrop: "$userForm.visiondrop",
          contractax: "$userForm.contractax",
          contractvision: "$userForm.contractvision",
          usedLimitInvite: "$userForm.usedLimitInvite",
          maxlimitinvite: "$userForm.maxlimitinvite",
          usednumber: "$userForm.usednumber",
          limitipost: "$userForm.limitipost",
          keyplusinvite: "$userForm.keyplusinvite",
          keygreen: "$userForm.keygreen",
          typeprime: "$userForm.typeprime",
          viewprime: "$userForm.viewprime",
          followers: { $size: { $ifNull: ["$followers", []] } },
          following: { $size: { $ifNull: ["$following", []] } },
          steamId: "$steamactive.id",
          vision: { visionid: 1, signature: 1 },
          vid: 1,
          discriminator: 1,
          avatar: 1,
          bod: 1,
          coo: 1,
          ceo: 1,
          cto: 1,
          cmo: 1,
          cdo: 1,
          quality: { reputation: 1, statsaccount: 1, statswallet: 1 },
          developer: 1,
          manager: 1,
          contributor: 1,
          IsafeSecurity: 1,
          developer3d: 1,
          havocac: 1,
          leader: 1,
          modder3d: 1,
          qa: 1,
          subdominio: 1,
          firstLoginDate: 1,
          vehicledev: 1,
          accepted: 1,
        },
      },
    ]).toArray();

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = result[0];

    // Formata seguidores e seguidos
    const formatNumber = (num: number) => {
      if (num === 1) return `${num}`;
      if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "mi";
      if (num >= 1_000) return (num / 1_000).toFixed(1) + "mil";
      return `${num}`;
    };

    // Monta os objetos criptografados
    const projectedLog = encrypt(JSON.stringify({
     ...userData,
     name: userData.username,
      Backgroundtheme: userData.prime && userData.Backgroundtheme || "#181a19",
      bannerFundo: userData.prime && userData.bannerfundo || null,
      IconeGlobal: userData.prime && userData.IconeGlobal || null,
    }));
    const novisionteam = encrypt(
      JSON.stringify({
        name: userData.name,
        discriminator: userData.discriminator,
        avatar: userData.avatar,
        id: userData.userId,
        vid: userData.vid,
        bod: userData.bod,
        coo: userData.coo,
        ceo: userData.ceo,
        cto: userData.cto,
        cmo: userData.cmo,
        cdo: userData.cdo,
        developer: userData.developer,
        manager: userData.manager,
        contributor: userData.contributor,
        developer3d: userData.developer3d,
        havocac: userData.havocac,
        leader: userData.leader,
        modder3d: userData.modder3d,
        qa: userData.qa,
        subdominio: userData.subdominio,
        firstLoginDate: userData.firstLoginDate,
        vehicledev: userData.vehicledev,
        accepted: userData.accepted,
        vision:{
          signature: userData.vision.signature,
          visionid: userData.vision.visionid,
        },
        followers: formatNumber(userData.followers),
        following: formatNumber(userData.following),
      })
    );

    const steam = encrypt(JSON.stringify({ id: userData.steamId }));

    return res.status(200).json({ log: projectedLog, novisionteam, steam });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const OverviewGetInfo: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  // Use o await para chamar a função original checkAuth
  await checkAuth(req, res);
};

export default withSession(OverviewGetInfo);
