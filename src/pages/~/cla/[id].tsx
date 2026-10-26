import { User } from "@/types/user/types";
import { useEffect, useState } from 'react';
import React from 'react';
import { Permission, getPermission} from "@/types/discord/permission";
import { useRouter } from 'next/router';
import InfoUser from "@/admin/components/ap/infouser.hov";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { withSession, NextIronRequest } from "@/lib/session"; 
import AdminTop from '@/admin/components/ap/top.admin';
import Aboutmecla from "@/club/.group/ax/about.group";
import styled from "styled-components";
import axios from "axios";
import NotificationUI from "@club/components/notification/card.mnc";

interface Props {
  user: User;
  Permissions: Permission[];
}

const Userinfo = ({ user,Permissions } : Props) => {
  const router = useRouter();
  const [isFormSubmittedNotification, setIsFormSubmittedNotification] = useState(false);
  const { id } = router.query;
  const [isAdminAccountVisible, setIsAdminAccountVisible] = useState(false);
  useEffect(() => {
    const hasPermission = Permissions.some((log) => log.type === 'ADMIN');
    setIsAdminAccountVisible(hasPermission);
  }, [Permissions]);
 
  if (!user) {
    return (
      <>
       Problema aqui!
      </>
    );
  } 


  const [deleteStatus, setDeleteStatus] = useState('');

  const handleDeleteaccount = async () => {

   const webhookUrl = 'https://discord.com/api/webhooks/1238599038954111156/oGOs_eoBsSJOwaOvFBszgHsVOjMCWG-sLalIioQ-izLqddWCXs8EYg2Xdk45lUSFKqAA'; // Substitua pelo URL do webhook do Discord
     
   // Criação da mensagem embed
   const embed = {
       icon_url: 'https://i.imgur.com/85XgJlr.png',
       title: '🔔 REGISTRO ADMIN ',
       description: 'Para analise. <@&1043283893438140497> ',
       fields: [
           {
               name: '```🔍 ID do clã ```',
               value: id,
           },
       ],
       footer: {
           text: 'Powered by novision',
           icon_url: 'https://i.imgur.com/85XgJlr.png',
       },
   };

   // Criação do objeto de dados para envio do formulário
   const formDataWebhook = new FormData();
   formDataWebhook.append('payload_json', JSON.stringify({ embeds: [embed] }));

   // Envio do formulário para o Discord via webhook
   await fetch(webhookUrl, {
       method: 'POST',
       body: formDataWebhook,
   });

    try {
      setIsFormSubmittedNotification(true);
      setTimeout(() => {
          setIsFormSubmittedNotification(false);
      }, 5000);
      setDeleteStatus('Aguarde até que a conta seja apagada...');
      const deleteResponse = await axios.delete(`/api/_v4/trash_cla?userId=${id}`);
      setDeleteStatus(deleteResponse.data.message); // "Conta excluída com sucesso" ou similar
    } catch (error) {
      setIsFormSubmittedNotification(true);
      setTimeout(() => {
          setIsFormSubmittedNotification(false);
      }, 5000);
      console.error('Error deleting Account:', error);
      setDeleteStatus('Problema ao excluir a conta');
    } finally {
      setIsFormSubmittedNotification(false);
    }
  };

 
  return isAdminAccountVisible && (
    <>
     <AdminTop />
     <Margin>
     <Aboutmecla userId={`${id}`} />
     </Margin>
       
       <Marginselect>
       <ButtonCLick onClick={handleDeleteaccount} >
       <i className="fi fi-sr-trash" />
       {deleteStatus ? deleteStatus : <h1>Excluir grupo</h1>}  
      </ButtonCLick>
 
       </Marginselect>
 
    </>
    )
  }

export default Userinfo;
export const getServerSideProps: GetServerSideProps<Props> = withSession(
  async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const req: NextIronRequest = context.req as NextIronRequest;
  
    const user = req.session.get("user") as User;
    if (!user) {
    return {
    redirect: {
   destination: '/club', 
    permanent: false,
      },
    };
  }
   
  let Permissions: Permission[] = [];
  if (user) {
    const userId = user.id;
    const guildId = "1175857498687807560"; 

    try {
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
    },
  };
}
);
  


const Marginselect = styled.div`  
 
  display: inline-flex;
  margin: 2em;

`;
// styled 

const Margin = styled.div`
  height: 100%;
  margin: 4%;
`;

/// Carduser 
const Button2 = styled.button`
    background-color: rgba(116, 116, 121, 0.089);
    border: none;
    transition: 0.5s all;
    border-radius: 64px;
    padding: 7px 5px 5px;
 
    font-size: 15px;
    border: 2px solid transparent;
    margin-bottom: 0.9em;
    color: #d2d2e0;

    &:hover{
      background-color: rgb(15, 15, 17);
      color: #0f0f11;
      border: 2px solid rgba(11, 12, 14, 0.171);
    }

    i{
      font-size: 18px;
    }

`;

const CardDelete = styled.div`
   position: fixed;
   background-color: #08080c;
   padding: 2em;
   display: flex;
   flex-direction: column;
   border-radius: 19px;
    border: 4px solid rgba(11, 12, 14, 0.171);
   justify-content: center;
 
   h1{
        font-size: 15px;
        color: #757579;
        max-width: 360px;
        margin-bottom: 1em;
    
   }
`

const ButtonCLick = styled.button`
    background-color: rgba(90, 90, 95, 0.13);
    border: none;
    transition: 0.5s all;
    border-radius: 12px;
    margin-bottom: 0.4em;
    margin: 0.4em;
    padding: 0.5em 1em 0.5em;
    font-size: 20px;
    
    display: flex;
    align-items: center;
    color: #86868f;

    h1{
        margin-left: 10px;
       font-size: 16px;
       font-family: 'Roboto', sans-serif;
       font-weight: 400;
       margin-top: -0.1em;
    }

    i{
        font-size: 22px;
        color: rgba(202, 202, 211, 0.116);;
    }


    &:hover{
        background-color: rgba(173, 173, 179, 0.151);

        i{
            color: #cacace;
        }
    }
 

`;