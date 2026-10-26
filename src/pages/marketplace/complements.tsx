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
 
import { TheNoVisionRoute } from "@/lib/session/redirects";
import HeadGlobal from "@/club/head/glob.n";
import Shopclub from "@/wallet/kop/shop";
import PremiumAccount from "@/club/.prime/premium/primeaccount";
import ROUTENVX from "@/routes/routes";
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";
  
interface Props {
  user?: User | null;
 Permissions: Permission[];
  logs: ModLog[];
}


export default function Home({ user }: Props){

  const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
  const [loading, setloading] = useState(false)

  const { isLoadingx, userInfoObject } = GetInfo_nvxre_xyloQuerier();
 
      useEffect(() => {
        setloading(true)
         if (!isLoadingx && userInfoObject) {
          setUserInfo(userInfoObject);
           setUserInfo(userInfoObject);
           setloading(false)
         }
       }, [userInfoObject]);
 
    if(loading) {
        return<></>
    }
 
    return(
        <>
      <HeadGlobal Title="Shop - #Clubvision" />
   
       <GlobalPosition>
       <ContainerCenter>
         
          {userInfo?.prime ?( 
             <BaseT>
          
           <Shopclub />
              </BaseT>
           ): (
             <>
             <HeadGlobal Title='Assinatura premium'/>
             <PremiumAccount />
             </>
           )}

       </ContainerCenter>
      </GlobalPosition>
 
        </>
    )
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
   max-width: 1500px;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   padding: 0.7em;
`;

const GlobalPosition = styled.div`
   
   display: flex;
  justify-content: center;
  align-items: stretch; 
  flex-direction: row;
  flex-flow: row;
 
  z-index: 0;
  @media screen and (max-width: 430px) {
    margin:0;
  }
`;

 

const ContainerCenter = styled.div`
 
   display: flex;
   flex-wrap: wrap;
   flex-direction: row;
   align-items: center;
  overflow: hidden;

`;


