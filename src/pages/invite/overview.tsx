
import { User } from "@/types/user/types";
import ROUTENVX from "@/routes/routes";
import React, { useEffect, useState } from "react";
import { Permission, getPermission} from "@/types/discord/permission";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { withSession, NextIronRequest } from "@/lib/session"; 
import { ModLog, getModLogs } from "@/types/discord/modlog";
import { TheNoVisionRoute } from "@/lib/session/redirects";
import PrimeView from "@/club/.prime/premium/page_homeprime";
import { UserInfo } from "@/types/discord/users";
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";
import HeadGlobal from "@/club/head/glob.n";
import styled from "styled-components";
import Image from "next/image";
import router from 'next/router';
 
interface Props {
    user: User | null;
    Permissions: Permission[];
    logs: ModLog[];
  }
  
  export default function Invite({ user }: Props) {
      const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
      const [userInfox, setUserInfox] = useState <UserInfo | null>(null);
     
      const { isLoadingx, userInfoObject,userTeam } = GetInfo_nvxre_xyloQuerier();
    
         useEffect(() => {
            if (!isLoadingx && userInfoObject) {
             setUserInfo(userInfoObject);
              setUserInfox(userTeam)
            }
          }, [userInfoObject]);
    return  user && (
        <>
          <HeadGlobal Title="Convide amigos | Clubvision" />
          
             <PrimeView
                    infouser={{...userInfo, ...userInfox}}
                  onclose={() => router.back()}
                children={
                <> 
          <TTopview>
          <CardInfo>
           
             <Image
           className="logo"
              src={user.avatar || 'https://i.imgur.com/mXit4fI.jpg'}
              alt={user.username}
              height={32}
              width={32}
            />
          <li>
          <h1>{user.username ? user.username : <> ---- </>}</h1>
          </li>
           
          </CardInfo>
          </TTopview>
                </>
               }/>
        </>
      )
  }
  
  Invite.getLayout = function getLayout(page: any) {
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
  

  
const TTopview = styled.div`
  
  width: 95%;
  display: flex;
  margin-bottom: 1em;
  justify-content: space-between;
`;

const CardInfo = styled.div`
   
 display: inline-flex;
 background-color: rgba(43, 43, 46, 0.116);
 padding: 0.4em 0.4em 0.4em;
 border-radius: 79px;
  
 img{
    border-radius: 80%;
 }

 h1{
    font-family: 'Inter';
    font-size: 15px;
    padding: 0 0.6em 0;
    color: #8a8f94;
 }

 li{
    display: flex;
    justify-content: start;
    flex-direction: column;
    text-align: start;
    margin: 0.3em;
   

    p{
      font-size: 11px;
      color: #52565a;
    }
 }

 
`;
