import HeadGlobal from '@/club/head/glob.n';
import AccountNvxre from '@club/components/account/account.user';
import GameInstruction from '@/club/.vision/dashboard/home/header/download/index';
import FaqServer from '@/club/.vision/dashboard/home/header/faq';
import FooterBv from "@/club/.vision/dashboard/home/header/footer";
import HeaderPageindex from '@/club/.vision/dashboard/home/header/header.home';
import styled from 'styled-components';
import Galery from '../club/.vision/dashboard/home/header/galery';
import PricingCards from '../club/.prime/premium/price.prime';
import { User } from "@/types/user/types";
import React, { useEffect,useState } from "react";
import { withSession, NextIronRequest } from "@/lib/session"; 
import { ModLog, getModLogs } from "@/types/discord/modlog";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { TheNoVisionRoute } from "@/lib/session/redirects";
 import { Permission, getPermission} from "@/types/discord/permission";
  

interface Props {
  user?: User | null;
  logs: ModLog[];
       Permissions: Permission[];
}


export default function Home () {
  
  return(
    <>
  
   <AccountNvxre balance={true}  />
 
     
     <HeadGlobal Title={'TheNoVision'} />
     <HeaderPageindex/>
   
    <div id="gallery">
       <Galery  />
     </div>

  
 <MarginCenter>

   <PricingCards />
     <div  id="download">
     <GameInstruction />
      </div>
 
  
        
     <div id='faq'>
      <FaqServer />
     </div>
    
<FooterBv />
</MarginCenter>
       
 
 
    </>
  )
}



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
   }
   );
   
  
 
const MarginCenter = styled.div`

  margin: 0 auto;
   width: 100%;
   max-width: 1200px;
   display: flex;
   flex-direction: column;
   justify-content: center;
 
   align-items: center;
  
`;




 