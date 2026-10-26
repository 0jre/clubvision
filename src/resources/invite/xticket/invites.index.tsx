import styled from "styled-components";
import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import { UserData } from "@/types/user/types";
import { UserInfo } from "@/types/discord/usersearch" 
import Ticketinvite from '@/public/icons/topmenu/ticketinvite.png'
import Man from '@/public/icons/topmenu/key.png'
import axios from "axios";

import router, { useRouter } from "next/router";
import InviteTicketCode from "@club/resources/invite/shape";
import copy from 'clipboard-copy';
import TicketIcon from '@/public/icons/shield.png'
import { Ticket } from "iconsax-react";

interface InviteProps {
  _id: string;
  description: string; 
  UserId: string; 
  Invite: string; 
  ownerinvite: string; 
  nickname: string; 
  ownerAvatar: string;
} 


export default function InviteCardModal () {
   
    const [ShowIsOpenModal, setShowIsOpenModal] = useState(true);
    const [Info, setInfo] = useState<UserData | null>(null);
    const [userInfo, setUserInfo] = useState<InviteProps[]>([]);
    const [error, setError] = useState<string | null>(null);
 
    const playNotificationSound = () => {
      const audio = new Audio('/Sounds/notification.mp3');
      audio.play();
    };

    const handleShowModal = () => setShowIsOpenModal(true);

    const searchUserByUserId = async () => {
      try {
        const responseInfo = await fetch('/api/autentic/searchuser');
        const dataInfo = await responseInfo.json();
        setInfo(dataInfo);
    
        if (dataInfo.user && dataInfo.user.id) {
          const response = await fetch(`/api/redirect/guest/invites?UserId=${dataInfo.user.id}`);
          const data = await response.json();
    
          if (response.ok) {
            if (Array.isArray(data) || (typeof data === 'object' && data !== null)) {
              setUserInfo(Array.isArray(data) ? data : [data]);
              playNotificationSound();
            } else {
              console.error('Resposta inesperada da API:', data);
            }
          }
        }
      } catch (error) {
       
      }
    };
    
    useEffect(() => {
  
      searchUserByUserId();

    }, []);

    const handleDeleteAds = async (_id: string) => {
      try {
        const deleteResponse = await axios.delete(`/api/redirect/guest/reuse?Invite=${_id}`);
        console.log(deleteResponse.data.message); // Ads deleted successfully
        // Update userInfo by calling the searchUserByUserId function
        searchUserByUserId();
      } catch (error) {
        console.error('Error deleting Ads:', error);
      }
    };
 
  const InviteAccepted: React.FC<{ inviteCod: string , _id: string  }> = ({ inviteCod, _id  }) => {

    const [inviteCode, setInviteCode] = useState(inviteCod);
    const [responseMessage, setResponseMessage] = useState('');
    const [isVerifying, setIsVerifying] = useState(false)
    const [loading, setloading] = useState(false) 

    const handleAuthorize = async (event: { preventDefault: () => void; }) => {
      event.preventDefault(); // Evita a atualização da página
      setloading(true)
      try {
        const response = await fetch(`/api/redirect/authorization`, {
          method: 'POST',
          body: JSON.stringify({ discordUserId: Info?.user.id, inviteCode }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          const data = await response.json();

          setloading(false)
          setResponseMessage(data);
        } else {
          const data = await response.json();
          setResponseMessage(data.error);
          setloading(false)
        }
        try {
          const response = await fetch(`/api/redirect/guestInfo?inviteCode=${inviteCode}`, {
            method: 'POST',
            body: JSON.stringify({
              Iduser: Info?.user.id,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (response.ok) {
            const data = await response.json();
            return data; // Retorna as informações do convidado
          } else {
            const data = await response.json();
            console.error('Error fetching guest info:', data.error);
            return null;
          }
        } catch (error) {
          console.error('Error fetching guest info:', error);
          return null;
        }

      } catch (error) {
        console.error('Error handling authorization:', error);
        setResponseMessage(`Algum problema aconteceu aqui!`);
        setloading(false)
      } finally {
        setIsVerifying(true);
        setloading(false)
        window.location.reload();
        try {
          const deleteResponse = await axios.delete(`/api/redirect/guest/reuse?Invite=${_id}`);
          console.log(deleteResponse.data.message); // Ads deleted successfully
        } catch (error) {
          console.error('Error deleting Ads:', error);
        }
      }
    };
    
 
    return(
          <>
          <ButtonGreen onClick={handleAuthorize} >
          {loading ? <i className="fi fi-br-loading loading" /> :  isVerifying ? <i className="fi fi-ss-badge-check colorw" /> : <i className="fi fi-ss-check-circle colorw"  />}
          </ButtonGreen>

    
          </>
    )
   }

    return(
        <>
      
      {Array.isArray(userInfo) && userInfo.map((user) =>
             <div key={user._id}>
         <Button onClick={handleShowModal}>
         <Ticket size="23" color="#a5afa8" variant="Broken"/>
        <span><i className="fi fi-sr-ticket"/></span>
        </Button>
        <form>
      
      <MarginS>
     
      <HovercardContent>
      <HoveContent>
       
      <InfoUserInvite>
            <ul>
            <Image src={user.ownerAvatar || 'https://i.imgur.com/mXit4fI.jpg'}  className="profileuae"  alt="user" height={60} width={60}/>

            <span>
           <h5>{user.ownerinvite}</h5>
            <h6>{user.nickname}</h6>
            </span>
            </ul>

            <li>
            <ViewCard>
            <i className="fi fi-br-link-alt" />
            <h4>{user.Invite}</h4>
           </ViewCard>
          
            </li>
          </InfoUserInvite>
         
 
        <li>
           <h3>Convite para você</h3> 
           <p>Você foi convidado para fazer parte da comunidade, clique para aceitar o convite!</p>
           
         
           {user.description && (
          <Description>
          <h6>Mensagem</h6>
           <h5>
          {user.description}
           </h5>
          </Description>
           )}
           
        </li>

       
      </HoveContent>
      <section>
            
            <InviteAccepted 
              _id={user._id}
              inviteCod={user.Invite}
               />
        
           <ButtonRed onClick={() => handleDeleteAds(user._id)}>
           <i className="fi fi-sr-circle-x colorw" />
           </ButtonRed>

           </section>
       </HovercardContent>
           
      </MarginS>
       </form>
     
      </div>
        )}
         
        </>
    )
}



/////


const Description = styled.ul`
  margin-top: 0.6em;
  padding: 0.4em 1em 0.4em;
  width: 100%;

  h5{
    font-family: 'Roboto', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #b9bfc4;
    max-width: 240px;
  }

  h6{
    font-family: 'Inter', monospace;
    font-size: 11px;
    color: #6e7072;
    font-weight: 200;
    margin-bottom: 0.9em;
  }
`;
const InfoUserInvite = styled.div`
   display: flex;
   flex-direction: column;
   width: 100%;
   background-color: rgba(240, 241, 255, 0.048);
    padding: 0.4em 0.9em 0.4em;
    border-radius: 12px;
    width: 100%;
  
    .profileuae{
      border-radius: 100%;
      height: 50px;
      width: 50px;
      margin: 0.5em;
    }
  
   h5{
     
    font-family: 'Roboto', sans-serif;
    font-size: 17px;
    color: #b5bbb6;
    font-weight: 400;
   }
   
   ul{
    display: flex;
    flex-direction: row;
    align-items: center;
   

    span{
        display: flex;
        flex-direction: column;
        margin: 0.4em;
        h6{
          font-family: 'Roboto', sans-serif;
          font-weight: 300;
          font-size: 14px;
          color: #a7a7b8;
        }
    }
   }
  
`;

const ButtonGreen = styled.button`
  padding: 6px 8px 4px;
    border-radius: 13px;
    background-color: #71717949;
    border: 1px dashed rgba(70, 71, 80, 0.041);
    margin: 0.2em;
    transition: 0.7s all;
    animation: OpacS 1s linear;
    

    .colorw{
      color: #85878f;
    }

    &:hover{
      border: 1px dashed #2424251a;
      background-color: transparent;

      i{
      color: #1ef754;
    }
    }

    .loading{
      animation: rotate 0.3s infinite;
    }


 @keyframes OpacS {
   0%{ opacity: 0;}
   100%{ opacity: 1;}
 }
`;
const ButtonRed = styled.button`

   padding: 6px 8px 4px;
    border-radius: 13px;
    background-color: #71717949;
    border: 1px dashed rgba(70, 71, 80, 0.041);
    transition: 0.7s all;
    margin: 0.2em;
    animation: OpacS 1s linear;
    
    .colorw{
      color: #85878f;
      font-size: 17px;
    }

    &:hover{
      background-color: transparent;
      border: 1px dashed #2424251a;
  
      i{
      color: #f71e1e;
    }
    }


 @keyframes OpacS {
   0%{ opacity: 0;}
   100%{ opacity: 1;}
 }
`;
const ViewCard = styled.div`
     
   display: flex;
   flex-direction: row;
   align-items: center;

   h4{
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    color: rgb(208, 212, 214);
    font-weight: 400;
    padding-left: 0.3em;
   }

   i{
    padding-top: 0.2em;
   }

  
`;

 

const HoveContent = styled.div`
  display: flex;
  align-items: top;
  flex-direction: row;
  gap: 8px;
  

  li{
    display: flex;
    flex-direction: column;
    background-color: rgba(14, 14, 15, 0.925);
    padding: 0.4em 0.9em 0.4em;
    border-radius:28px;
    width: 100%;
 

    h3{
    font-family: 'Roboto', sans-serif;
    font-size: 20px;
    font-weight: 500;
    max-width: 310px;
    color: #b9bfc4;
   }

    p{
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: #5a6064;
    max-width: 290px; 
    margin-bottom: 0.9em;
   }
  }

`;

const MarginS = styled.div`
   position: fixed;
  flex-flow: center;
  z-index: 1999;
  bottom: 2%;
  right: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HovercardContent = styled.div`
 
  background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  box-shadow: 0 1px 4px rgba(74, 74, 78, 0.205);
  padding: 10px;

  border-radius: 12px; 
  transition: opacity 0.2s ease-in-out;
  animation: AnimCard 0.3s linear;
   section{
    display: flex;
    flex-direction: row;
    float: right;
    position: relative;
    align-items: center;
    margin: 0.4em;
    margin-left: 2%;
   }


   @keyframes AnimCard {
   0%{ transform: translateY(100%) }   
   100%{ transform: translateY(0%) }   
    }
   
`;

const Button = styled.button`

    padding: 7px 9px 6px;
    border-radius: 50%;
    border: 1px dashed #d8d0d013;
    transition: 0.7s all;
    animation: OpacS 1s linear;

    i{
      color: #484849;
    }

    &:hover{
      border: 1px dashed #d8d0d060;
  
    }
 
 span{
    position: absolute;
    margin-top: 1.4%; 
    margin-left: -12px;
    backdrop-filter: blur(100px);
    border-radius: 50%;
    padding: 0.4em 0.6em 0.4em;

    i{
      font-size: 11px;
      color: #41454b;
    }
 }


 @keyframes OpacS {
   0%{ opacity: 0;}
   100%{ opacity: 1;}
 }
`;

