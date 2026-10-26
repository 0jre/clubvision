import { NextApiResponse } from "next";
import { NextIronRequest, withSession } from "@/lib/session";

const handler = async (req: NextIronRequest, res: NextApiResponse) => {
    res.setHeader("Set-Cookie", [
        "basketId=; Path=/; Max-Age=0; HttpOnly;",
        "session_cookie=; Path=/; Max-Age=0; HttpOnly;"  
      ]);
      
    req.session.destroy();
	res.redirect(`/club`); 
};

 

export default withSession(handler);