import Payment_bits from "@/wallet/confirmation/pay.bits";
import React from 'react';
import { User } from "@/types/user/types"; 
import { withSession } from "@/lib/session";
import { GetServerSideProps } from "next";
import { TheNoVisionRoute } from "@/lib/session/redirects";
import {  GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import {  NextIronRequest } from "@/lib/session"; 
import ROUTENVX from "@/routes/routes";

interface Props{
    user: User;
}

export default function ({user} : Props) {
    return(
        <>
 
         <Payment_bits id={user.id} />
        </>
    )
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
       
    return {
      props: {
        user,
      },
    };
  });
