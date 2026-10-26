
import { User } from "@/types/user/types";
import ROUTENVX from "@/routes/routes";
import React from "react";
import { Permission, getPermission} from "@/types/discord/permission";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { withSession, NextIronRequest } from "@/lib/session"; 
import { ModLog, getModLogs } from "@/types/discord/modlog";
import { TheNoVisionRoute } from "@/lib/session/redirects";
import ListMembers from "@/club/.vision/containers/navigation/left/listmembers";
 
interface Props {
    user: User | null;
    Permissions: Permission[];
    logs: ModLog[];
  }
  

  export default function WatchPage({ user }: Props) {
    return (
      user && (
        <>
            <ListMembers />
                
        </>
      )
    );
  }
  
  WatchPage.getLayout = function getLayout(page: any) {
    return <>{page}</>;
  };
  
export const getServerSideProps: GetServerSideProps<Props> = withSession(
    async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
      const req: NextIronRequest = context.req as NextIronRequest;
    
   // Chamando TheNoVisionRoute para verificar a sessão do usuário
   const result = await TheNoVisionRoute({ req });
  
   const user = result.props.user;
   if (!user) {
    return {
    redirect: {
   destination: ROUTENVX.signin, 
    permanent: false,
      },
    };
  }
    let Permissions: Permission[] = [];
    let logs: ModLog[] = [];
  
    if (user) {
      const userId = user.id;
      const guildId = "1175857498687807560"; 
      
      try {
        logs = await getModLogs(guildId, userId);
        Permissions = await getPermission(guildId, userId);
  
        // Convert Date objects to string representations
        Permissions.forEach((permission) => {
          permission.created_at = permission.created_at.toString();
        });
  
      } catch (error) {
        console.error("Error fetching information:", error);
      }
    }
  
    return {
      props: {
        user,
        Permissions,
        logs,
      },
    };
  }
  );
  