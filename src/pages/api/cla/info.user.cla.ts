import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/core/integration/connect";
import { encrypt } from "@/core/security/encryption";
import { User } from "@/types/user/type.cla";
 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID not provided" });
  }

  try {
    const { db } = await dbConnect();
    const collection = db.collection<User>("cla");

    const userForm = await collection.findOne({
      $or: [
        { userId: userId },
        { Members: userId } // Verifica se userId está presente no array Members
      ]
    });

    if (userForm) {
      const projectedLog = {
        _id: userForm._id.toString(),
        userId: userForm.userId,
        Idade: userForm.Idade,
        Instagram: userForm.Instagram,
        Twitter: userForm.Twitter,
        Discord: userForm.Discord, 
        Youtube: userForm.Youtube, 
        Tiktok: userForm.Tiktok,
        BioLi: userForm.BioLi,
        verified: userForm.verified,
        Clasigla: userForm.Clasigla, 
        ClaHistory: userForm.ClaHistory,
        Character: userForm.Character,
        namecla: userForm.namecla,
        inviteCode: userForm.inviteCode,
        LogoCla: userForm.LogoCla,
        FaixaCla: userForm.FaixaCla,
      };

      const nvxcrypted = encrypt(JSON.stringify(projectedLog));
      return res.status(200).json({ log: nvxcrypted });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
