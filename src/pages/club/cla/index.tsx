import styled from "styled-components";
import { User } from "@/types/user/types";
import { withSession } from "@/lib/session";
import { GetServerSideProps } from "next";
import { ReactNode, useEffect, useState } from "react";
import { UserInfo } from "@/types/discord/usersearch";
import React from "react";
import { Permission, getPermission} from "@/types/discord/permission";
import {  GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import {  NextIronRequest } from "@/lib/session"; 
import { ModLog, getModLogs } from "@/types/discord/modlog";

import { decrypt } from '@/core/security/encryption';
import axios from "axios";
import { TheNoVisionRoute } from "@/lib/session/redirects";
import HeadGlobal from "@/club/head/glob.n";
import Centralcla from '@/club/.group/pages/central.home';
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";
import PremiumAccount from "@/club/.prime/premium/primeaccount";

interface Props {
  user?: User | null;
  Permissions: Permission[];
  logs: ModLog[];
}


export default function Clubr({ user }: Props){

  const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
 const { isLoadingx, userInfoObject } = GetInfo_nvxre_xyloQuerier();

 useEffect(() => {
    if (!isLoadingx && userInfoObject) {
       setUserInfo(userInfoObject);
    }
  }, [userInfoObject]);
 
    return(
        <>
      <HeadGlobal Title="Clã - #Thenovision" />

      {userInfo?.prime ? (
          <>
           <Containercenter>
              <Centralcla />
           </Containercenter>
          </>
        ): (
                     <>
                     <HeadGlobal Title='Assinatura premium'/>
                     <PremiumAccount />
                     </>
                   )}
        </>
    )
}
  
  Clubr.getLayout = function getLayout(page: ReactNode) {
    return <>{page}</>;
  };
  

export const getServerSideProps: GetServerSideProps<Props> = withSession(
  async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
 const req: NextIronRequest = context.req as NextIronRequest;
 // Chamando TheNoVisionRoute para verificar a sessão do usuário
 const result = await TheNoVisionRoute({ req });
 const user = result.props.user;
 
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
});


  
  const Containercenter = styled.div`
   display: flex;
   flex-direction: column;
  margin: 0.5em;
  animation: Createan 1s;

  @keyframes Createan {
     0%{ opacity: 0;}
     100%{ opacity: 1;}
  }

  @media screen and (max-width: 430px) {
 margin: 0;
 }

`;