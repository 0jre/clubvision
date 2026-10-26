
import { Session } from "next-iron-session";
import { User } from "@/types/user/types";
import { NextIronRequest } from ".";

interface CustomContext {
  req: NextIronRequest & { session: Session };
}

interface NoVisionResult {
  props: {
    user: User | null;
  };
}

export async function TheNoVisionRoute(
  ctx: CustomContext
): Promise<NoVisionResult> {
  try {
    const user: User | undefined = ctx.req.session.get("user");

    if (!user) {
      console.warn("Nenhum usuário encontrado na sessão.");
      return {
        props: { user: null },
      };
    }

    return {
      props: { user },
    };
  } catch (error) {
    console.error("Erro ao recuperar a sessão:", error);
    return {
      props: { user: null },
    };
  }
}
