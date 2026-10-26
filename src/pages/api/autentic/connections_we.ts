import { dbConnect } from "@/core/integration/connect";
import { UserConnectTwitch,UserConnectSteam  } from "@/types/user/connections";
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
  const { userid } = req.query 
  const { db } = await dbConnect();
   const usersCollection = db.collection('users');
   const userRecord = await usersCollection.findOne({ id: sessionUser.id });
 
   
   const requestId =  (
    userRecord?.type == 'ADMIN' && userid ||  
    sessionUser.id == userid && sessionUser.id 
  )
  const SendId = requestId
  
  if (!SendId) {
    return res.status(400).json({ message: "User ID not provided" });
  }
 
try {
    const { db } = await dbConnect();
    const twitchCollection = db.collection<UserConnectTwitch>("twitch");
    const steamCollection = db.collection<UserConnectSteam>("steam");
    const userFormTwitch = await twitchCollection.findOne({ userId: SendId });
    const userFormSteam = await steamCollection.findOne({ userId: SendId });
  
    if (userFormTwitch || userFormSteam) {
        const combinedResult = {
          twitch: userFormTwitch ? {
            userId: userFormTwitch.userId,
            user_idtwitch: userFormTwitch.user_idtwitch,
            user_nametwitch: userFormTwitch.user_nametwitch,
            display_nametwitch: userFormTwitch.display_nametwitch,
            user_avatartwitch: userFormTwitch.user_avatartwitch,
            user_token_accesstwitch: userFormTwitch.user_token_accesstwitch,
          } : null,
          steam: userFormSteam ? {
            userId: userFormSteam.userId,
            displayName: userFormSteam.displayName,
            id: userFormSteam.id,
            hexid: userFormSteam.hexid,
            provider: userFormSteam.provider,
          } : null,
        };
    
      const nvxcrypted = encrypt(JSON.stringify(combinedResult));
      return res.status(200).json({ log: nvxcrypted });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

}

 const Connections_we: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
   // Use o await para chamar a função original checkAuth
   await checkAuth(req, res);
 };
 
 export default withSession(Connections_we);
 