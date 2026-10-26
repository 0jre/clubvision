import { Tooltip } from "@mui/material";
import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import ProfileCla from '../containers/card.profile';
import ConfigCla from './config.cla';
import { UserData } from "@/types/user/types";
import { User } from "@/types/user/type.cla";
import axios from "axios";

import LoadingPageView from '@club/resources/loading/market.loading';
import { decrypt } from '@/core/security/encryption';
import InviteCla from '../containers/menu.invitecla';
import PageEditinfo from './page.config';
import PageManagecla from './page.key';

async function fetchUserInfo(): Promise<UserData> {
  const response = await fetch('/api/autentic/searchuser');
  if (!response.ok) {
    throw new Error('Falha ao buscar informações do usuário.');
  }
  const data = await response.json();
  return data;
}

export default function Centralcla() {
  const [isConfigCla, setClaconfig] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvitecla, setisinvitecla] = useState(false);
  const [Iseditconfig, seteditconfig] = useState(false);
  const [ismanagecla, setmanagecla] = useState(false);
  const [Dashboardform, setDashboardform] = useState(true);
  const [claview, setclaview] = useState(true)

  const handlemanagecla = () => {
    setmanagecla(true);
    setclaview(false)
    setDashboardform(false);
  };

  const handleclosema = () => {
    setmanagecla(false);
    setDashboardform(false);
    setclaview(true)
  };

  const handleopenedit = () => {
    seteditconfig(true);
    setDashboardform(false);
  };

  const handleditclose = () => {
    seteditconfig(false);
    setClaconfig(false);
    setDashboardform(true);
    setisinvitecla(false);
  };

  const handleconfigcla = () => {
    setClaconfig(true);
    setDashboardform(false);
  };

  const handleconvite = () => {
    setisinvitecla(true);
    setDashboardform(false);
  };

  const handlecloseinvitemeny = () => {
    setisinvitecla(false);
    setDashboardform(true);
  };

  useEffect(() => {

    async function fetchUserInfo() {
      try {
        if (!user) {
          return;
        }
        setIsLoading(true);
        const response = await axios.get(`/api/cla/info.user.cla?userId=${user.user.id}`);
        const decryptedData = decrypt(response.data.log);
        const userInfoObject = JSON.parse(decryptedData);
        setUserInfo(userInfoObject);
        setIsLoading(false);
        if (userInfoObject) {
          setDashboardform(false); // Define o estado de `Dashboardform` como false se o usuário estiver em um clã
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setIsLoading(false);
      }
    }

  
    fetchUserInfo();

   
  }, [ user]);

  useEffect(() => {
    let isMounted = true;

    fetchUserInfo()
      .then((data) => {
        if (isMounted) {
          setUser(data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Container>
        {isLoading ? (
          <LoadingPageView />
        ) : userInfo &&(
          <>
          <Topinfo>
              <img
                className="LOGO"
                src={userInfo.LogoCla ? `${userInfo.LogoCla}` : "/favicon.png"}
                alt={userInfo.namecla} height={40} width={40}
              />
              <ul>
                {user && userInfo && user.user.id === userInfo.userId && (
                  <>
                    <Tooltip title={"Configurar clã"} placement="bottom">
                      <Button onClick={handleopenedit}>
                        <i className="fi fi-ss-settings" />
                      </Button>
                    </Tooltip>

                 
                     

                    {ismanagecla ? (
               <Button onClick={handleclosema}>
                <i className="fi fi-br-cross-small"></i>
                   </Button>
                    ) : (
                      <Tooltip title={"Gerenciar clã"} placement="bottom">
                      <Button onClick={handlemanagecla}>
                        <i className="fi fi-sr-key" />
                      </Button>
                    </Tooltip>
                    )}

                   
                  </>
                )}
                <Cardinfo>
                  {user && userInfo && user.user.id === userInfo.userId ? (
                    <>
                      <i className="fi fi-rs-crown" />
                      <li>
                        <h5>Você é dono deste Clã</h5>
                        <p>{userInfo.Clasigla}</p>
                      </li>
                    </>
                  ) : (
                    <>
                      <i className="fi fi-rs-star" />
                      <li>
                        <h5>Você faz parte do clã</h5>
                        <p>{userInfo.Clasigla}</p>
                      </li>
                    </>
                  )}
                </Cardinfo>
              </ul>
            </Topinfo>

           {claview && (
            <>
   
            <Content>
              <ProfileCla
                id={user?.user.id}
                LogoCla={userInfo.LogoCla}
                FaixaCla={userInfo.FaixaCla}
                userId={userInfo.userId}
                namecla={userInfo.namecla}
                Idade={userInfo.Idade}
                Instagram={userInfo.Instagram}
                Twitter={userInfo.Twitter}
                Discord={userInfo.Discord}
                Youtube={userInfo.Youtube}
                Tiktok={userInfo.Tiktok}
                BioLi={userInfo.BioLi}
                Character={userInfo.Character}
                Clasigla={userInfo.Clasigla}
                ClaHistory={userInfo.ClaHistory}
                verified={userInfo.ClaHistory}
                inviteCode={userInfo.inviteCode}
                type={userInfo.type}
                Members={[]} 
              />
            </Content>



           
            </>
           )}



  

          </>
        )}
 
      </Container>


      
{isInvitecla && (
  <ContainerX>
   
   <ContainerCard>
            <h2>ADICIONE O CODIGO CONVITE PARA ENTRAR NO CLÃ</h2>

            
            <InviteCla />

          <ButtonRegister onClick={handlecloseinvitemeny}>
                  Cancelar
           </ButtonRegister>
          </ContainerCard>
         
  </ContainerX>
 
        )}

        {Dashboardform && !userInfo && (
          <ContainerCard>
            <h2>FAÇA PARTE OU CRIE SEU PRÓPRIO GRUPO DE AMIGOS AQUI!</h2>
            <ul>
              <Card onClick={handleconfigcla} className="mobile">
              <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#343635" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11v1a10 10 0 1 1-9-10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/><path d="M16 5h6"/><path d="M19 2v6"/></svg>
                <h3>Criar um Clã</h3>
                <p>Crie seu clã e convide seus amigos e futuros amigos para fazer parte do seu grupo.</p>
              </Card>
              <Card onClick={handleconvite}>
               <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#343635" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
                <h3>Entrar em um Clã</h3>
                <p>Você recebeu um convite para fazer parte de um clã? Adicione o código aqui!</p>
              </Card>
            </ul>
          </ContainerCard>
        )}

      {Iseditconfig && (
        <PageEditinfo
          Close={
            <div onClick={handleditclose}>
              <i className="fi fi-ss-circle-xmark" />
            </div>
          }
        />
      )}

      {isConfigCla && (
        <ConfigCla
          Close={
            <div onClick={handleditclose}>
              <i className="fi fi-ss-circle-xmark" />
            </div>
          }
        />
      )}

      {ismanagecla && (
        <>
          {userInfo && (
            <PageManagecla
             
              userId={userInfo.userId}
            />
          )}
        </>
      )}
    </>
  );
}


 
//// 

const ContainerX = styled.div`
  
 
`;

const ButtonRegister = styled.button`
   background-color: #c0ccc5;
      padding: 1em 5em 1em;
      border-radius: 98px;
      font-family: 'Europa Grotesk';
      font-size: 14px;
      color: #101013;
      transition: 1s all;
      

      &:hover{
        background-color: #080808;
        color: #dfe1e7;
      }
`;


const ContainerCard = styled.div`
  width: 100%;
  height: 70vh;
  padding: 1em;
  display: flex;
   
  flex-direction: column;
  justify-content: center;
  place-items: center;
  text-align: center;

  ul{
    display: inline-flex;
    
  }

  h2{
   font-family: 'Europa Grotesk';
   max-width: 450px;
   color: rgb(185, 181, 206);
   margin-bottom: 0.9em;
   text-align: center;
  }

  @media screen and (max-width: 430px) {
    h2{
  
   max-width: 450px;
   font-size: 17px;

  }

    ul{
      display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
    }

    .mobile{
      display: none;
    }
 }
`;


const Card = styled.div`
  cursor:  var(--f-cursor-pointer);
  height: 100%;
  padding: 0.5em 1em 0.5em;
  background-color: rgba(40, 41, 40, 0.623);
  border-radius: 8px;
  text-align: center; 
  margin: 1em;

  h3{
   font-family: 'Europa Grotesk';
   font-size: 16px;
   color: rgb(185, 181, 206);
   margin-bottom: 0.9em;
  }

  p{
    max-width: 350px;
    font-size: 12px;
    color: rgb(135, 135, 145);
    
  }


  &:hover{
    background-color: rgba(53, 52, 59, 0.062);
  }


`;


const Container = styled.div`
   padding: 0.3em 1em 0.3em;
   margin: 0.3em;
   margin-top: 2em;
   
  @media screen and (max-width: 430px) {
    margin: 0em;
  }
`;

const Cardinfo = styled.div`
    background-color: rgba(34, 36, 35, 0.39);
    padding: 0.4em 1em 0.4em;
    border-radius: 12px;
    display: flex;
    align-items: center;


    li{
        display: inline-flex;
        flex-direction: column;
        padding-left: 0.5em;
    }

    h5{
     color: rgb(143, 146, 144);
     font-size: 11px;
    }
    
    i{
     background-color: rgba(52, 53, 56, 0.185);
     padding: 0.4em 0.6em 0.3em;
     height: 34px;
     width: 35px;
     border-radius: 72px;
    }

    p{
     color: rgb(145, 150, 158);
     font-size: 13px;
    }
`;

const Content = styled.div`


`;


const Button = styled.button`
  background-color:  rgba(68, 69, 73, 0.082);
  height: 38px;
  width: 38px;
  border-radius: 9px;
  padding: 0.5em 0.4em 0.4em;
  margin: 0.1em;
  transition: 1s all;


  i{
    color: #a5abb1;
  }


  &:hover{
    border-radius: 39px;
     
    i{
    color: #757976;
  }
  }

`;


const Topinfo = styled.div`
 
   padding: 0.4em 1em 0.4em;
  border-radius: 12px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   width: 100%;
   background: linear-gradient(204deg, #d6dbd640 -7%, #b85cff00 33%), linear-gradient(162deg, #cfd6d340 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
   border-bottom: 1px solid rgba(78, 78, 83, 0.116);
   
   .LOGO{
    border-radius: 12px;
   }

  ul{
    display: flex;
   align-items: center;
   gap: 7px;
  }
`;