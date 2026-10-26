import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/core/integration/connect";
import { UserInfo } from "@/types/discord/usersearch";

export async function RemoveField(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    const { userId, field } = req.query;

    if (!userId || typeof field !== "string") {
      return res.status(400).json({ message: "Invalid parameters" });
    }
    try {
      const { db } = await dbConnect();
      const collection = db.collection<UserInfo>("reforms");

      const updateField: Record<string, string> = {};
      updateField[field] = "";

      const updateResult = await collection.updateOne(
        { userId },
        { $set: updateField }
      );

      if (updateResult.modifiedCount > 0) {
        return res.status(200).json({ message: `Field ${field} removed successfully` });
      } else {
        return res.status(404).json({ message: "User not found or field not removed" });
      }
    } catch (error) {
      console.error("Error removing field:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
