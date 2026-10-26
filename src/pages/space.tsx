
import { UserInfo } from "@/types/discord/usersearch";
import { useRouter } from "next/router";
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
 
 import { Permission, getPermission} from "@/types/discord/permission";
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";
import { StyledDashboard } from '../.spacevision/screens/dashboard';
  
interface Props {
  user: User | null;
    Permissions: Permission[];
 logs: ModLog[];
}
 
export default function Home({ user }: Props) {
    const router = useRouter();
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

  return user && (
    <>
   <HeadGlobal Title="SPACEVISION - VIRTUAL GARAGE #Thenovision" />
  <StyledDashboard id={user.id} username={userInfo?.name} /> 
  
    </>
  );
}

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
   max-width: 1500px;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   padding: 0.7em;
`;
