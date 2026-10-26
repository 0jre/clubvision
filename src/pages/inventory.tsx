
import { UserInfo } from "@/types/discord/usersearch";
import { useEffect, useState } from "react";
import { User } from "@/types/user/types";
import { withSession } from "@/lib/session";
import { GetServerSideProps } from "next";
import React from "react";
import {  GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import {  NextIronRequest } from "@/lib/session"; 
import { ModLog, getModLogs } from "@/types/discord/modlog";
import { TheNoVisionRoute } from "@/lib/session/redirects";
import ROUTENVX from "@/routes/routes";
import HeadGlobal from "@/club/head/glob.n";
import styled from "styled-components";
import Inventory from "@/wallet/inventory";
import { Permission, getPermission} from "@/types/discord/permission";
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";
   
interface Props {
  user: User | null;
  Permissions: Permission[];
   logs: ModLog[];
}
 
export default function Home({ user }: Props) {
    
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isLoadingx, userInfoObject } = GetInfo_nvxre_xyloQuerier();
  
    useEffect(() => {
      setIsLoading(true)
       if (!isLoadingx && userInfoObject) {
        setUserInfo(userInfoObject);
      setIsLoading(false)
       }
     }, [userInfoObject]);

    if(isLoading) { return<></> }

  return (
    <>
        <HeadGlobal Title='Meu Inventario - #TheNoVision'/>
   
            {user && (
        <BaseT>
        
          <Inventory id={user.id} username={<> {userInfo?.name}</>} /> 
       

        </BaseT>
      )}
 
      
    </>
  );
}


Home.Layoutrivo = function Layoutrivo(page: React.ReactNode) {
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


const BaseT = styled.div`
   margin: 0 auto;
   width: 100%;
   
   padding: 0.7em;
`;
