
import '@/public/tailwind.css'
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
import ScreenTrader from '@/.trivo/screen/trader/screen.webx';
import { getPermission, Permission } from '@/types/discord/permission';
  
interface Props {
  user: User | null;
  Permissions: Permission[];
   logs: ModLog[];
}
 
export default function Home({ user }: Props) {
 

  return (
    <>
        <HeadGlobal Title='Marketplace - #TheNoVision'/>
   
            {user && (
        <BaseT>
         <ScreenTrader />
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
   max-width: 1500px;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   padding: 0.7em;
`;
