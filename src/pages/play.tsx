import { DashboardStyle} from "@/styles/Globalstyleview";
import styled from "styled-components";
import { User } from "@/types/user/types";
import ROUTENVX from "@/routes/routes";
import Link from "next/link";
import Image from "next/image";
import React, { ReactNode, useEffect,useState } from "react";
import { withSession, NextIronRequest } from "@/lib/session"; 
import { ModLog, getModLogs } from "@/types/discord/modlog";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import { UserInfo } from "@/types/discord/usersearch";
import Security from "@/wallet/security/connect/security";

import { decrypt } from '@/core/security/encryption';
import axios from "axios";
import HeadGlobal from "@/club/head/glob.n";
import { GlobalError } from "@/styles/Globalstyleview";
import Homepage from '@/club/.vision/dashboard/home/header/page_home';
import { TheNoVisionRoute } from "@/lib/session/redirects";
import { getPermission, Permission } from '@/types/discord/permission';
import { ThemeProvider } from 'styled-components';
import { Shield, ShieldX } from 'lucide-react';
import { CanvasRevealEffect } from '@club/shop/grid/canva/pixelated';
import LogoVision from '@club/components/vision/logo';
import Cookies from 'js-cookie';
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";

interface Props {
  user?: User;
  Permissions: Permission[];
  logs: ModLog[];
}

 
const theme = {
  colors: {
    dark: '#1a1a1a',
    green: '#23cf5c',
    white: '#ffffff',
    orange: '#e17055',
    red: '#d63031',
  },
};
 

export default function PlayGame({ user,logs }: Props){
  const [isVisible, setIsVisible] = useState(true);
   const [authorizationStatus, setAuthorizationStatus] = useState<any | null>(null);
   const [isLoadingApprove, setIsLoadingApprove] = useState(false); 
   const [isLoadingDeny, setIsLoadingDeny] = useState(false); 
   const [isFetching, setIsFetching] = useState(true); 
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();
   const [isExiting, setIsExiting] = useState(false);
   const [isCookieActive, setIsCookieActive] = useState(false);
  const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
  const { isLoadingx, userInfoObject } = GetInfo_nvxre_xyloQuerier();
     
         useEffect(() => {
             if(!user) {
            router.push(ROUTENVX.signin)
          }
       
         if (isLoadingx) setIsLoading(true);
         if (!isLoadingx && userInfoObject) {
           setUserInfo(userInfoObject);
           }
         }, [user,isLoadingx, userInfoObject]);

   useEffect(() => {
    // Função para verificar o cookie e iniciar o polling da API
    const checkCookieAndStartPolling = () => {
      if (Cookies.get('comunicacao_nvx')) {
        setIsCookieActive(true);
        startPollingAPI();
      } else {
        setIsCookieActive(false);
      }
    };

    const startPollingAPI = () => {
      let intervalId: NodeJS.Timeout;

      const fetchAuthorizationStatus = async () => {
        try {
          const response = await fetch('/api/club/gaming/player', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            const data = await response.json();

            if (data.success && data.player) {
              setAuthorizationStatus(data.player.mostRecentSession);
              setIsFetching(false);
              setIsLoading(false);

             
              clearInterval(intervalId); // Para o polling
            }
          }
        } catch (error) {
          console.error('Erro ao buscar os dados:', error);
        }
      };

      intervalId = setInterval(fetchAuthorizationStatus, 10000); // Polling a cada 10 segundos

      // Cleanup
      return () => clearInterval(intervalId);
    };

    checkCookieAndStartPolling(); // Inicializa a verificação e o polling

    // Continuar ouvindo para mudanças no cookie
    const cookieInterval = setInterval(checkCookieAndStartPolling, 5000); // Verifica o cookie a cada 5 segundos

    // Cleanup ao desmontar o componente
    return () => clearInterval(cookieInterval);
  }, []); // Executa apenas uma vez ao montar o componente

 
 
 
 
  // Função de autorização
 const handleAuthorization = async () => {
  
 
   if (!authorizationStatus?.cid) {
     return;
   }
    
   setIsLoadingApprove(true); // Ativa o carregamento do botão Autorizar
 
   try {
     // Enviar a solicitação para autorizar o jogador
     const response = await fetch("/api/club/gaming/player", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         cid: authorizationStatus.cid, // Passando o cid corretamente
         request: false,   
         authorized: true, 
       }),
     });
 
     const data = await response.json();
 
     if (data.success) {
       // Atualizar o estado de autorização
       setAuthorizationStatus((prevStatus: any) => ({
         ...prevStatus,
         mostRecentSession: {
           ...prevStatus.mostRecentSession,
           request: false,  
           authorized: true, // Jogador foi autorizado
         },
       }));
  
         // Limpar o cookie, se necessário
         if (Cookies.get('comunicacao_nvx')) {
          Cookies.remove('comunicacao_nvx');
        }
         
        router.replace({
          pathname: router.pathname,
          query: {}, // Passando um objeto vazio para remover a query
        }, undefined, { shallow: true });
       // Fechar o card após 5 segundos
       setTimeout(() => {
         setIsVisible(false);
       }, 5000);
     } else {
       console.error("Falha na autorização.");
     }
   } catch (error) {
     console.error("Erro ao autorizar jogador:", error);
   } finally {
     setIsLoadingApprove(false);
   }
   setIsExiting(true);
   setTimeout(() => setIsVisible(false), 1000); // Tempo da animação de saída
 };
 
 // Função de recusa
 const handleDeny = async () => {
   
   if (!authorizationStatus?.cid) {
     return;
   }
   
   setIsLoadingDeny(true);
 
   try {
     const response = await fetch("/api/club/gaming/player", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         cid: authorizationStatus.cid,
         request: false,  
         authorized: false, // Recusa
       }),
     });
 
     const data = await response.json();
 
     if (data.success) {
       setAuthorizationStatus((prevStatus: any) => ({
         ...prevStatus,
         mostRecentSession: {
           ...prevStatus.mostRecentSession,
           request: false,  
           authorized: false, // Jogador recusado
         },
       }));

         // Limpar o cookie, se necessário
         if (Cookies.get('comunicacao_nvx')) {
          Cookies.remove('comunicacao_nvx');
        }

        
        router.replace({
          pathname: router.pathname,
          query: {}, // Passando um objeto vazio para remover a query
        }, undefined, { shallow: true });
       // Fechar o card após 5 segundos
       setTimeout(() => {
         setIsVisible(false);
       }, 5000);
     } else {
       console.error("Falha ao recusar a autorização.");
     }
   } catch (error) {
     console.error("Erro ao recusar a autorização:", error);
   } finally {
     setIsLoadingDeny(false);
   }
   setIsExiting(true);
   setTimeout(() => setIsVisible(false), 1000); // Tempo da animação de saída
 };
 
  
  const BanInformation= () => {
      
    const [isBannedAccountVisible, setIsBannedAccountVisible] = useState(false);
    useEffect(() => {
      const hasBanLog = logs.some((log) => log.type === 'BAN');
      setIsBannedAccountVisible(hasBanLog);
    }, [logs]);
  
    return isBannedAccountVisible ? (
      <ModalWrapper>
  
      {!user && (
       <>
       Deslogado
       </>
    )}
     {user && (
          <>
       <ContainerLi>
          <ContentCrad>
 
        <ContentList>

        <li>
           <i className="fi fi-rr-lock" />
         </li>

         <p>
         Após uma análise cuidadosa, determinamos que sua conta violou nossas <Link href={ROUTENVX.Legal}> Diretrizes</Link>. Como resultado, ela foi bloqueada, o que impede o acesso a todos os serviços da novision. Caso deseje contestar a decisão, você pode enviar um pedido de revisão do banimento para tentar recuperar sua conta. Se acreditar que houve um erro, sinta-se à vontade para nos enviar uma justificativa.

         </p>
        </ContentList>
     
          </ContentCrad>
       </ContainerLi>
       </>
     )}
      </ModalWrapper>
    ) : null;
  };

 
   
   
  
  const NOTAUTO= () => {
   
    const router = useRouter();
    const [isnotccountVisible, setIsnotAccountVisible] = useState(false);
    useEffect(() => {
      setIsnotAccountVisible(true);
    },);
  
  
    return isnotccountVisible ? (
      <ModalWrapper>
  
          {!user && (
       <>
       Deslogado
       </>
    )}
     {user && (
          <>
       <ContainerLi>
          <ContentCrad>
         
        <ContentList>

          <li>
           <i className="fi fi-br-key" />
         </li>

         <p>
         Parece que você não autorizou sua conta Thenovision. Verifique se a sua conta está autorizada <Link href={ROUTENVX.DashboardProfile}>Minha Central</Link>. Após autorizar sua conta, volte e tente novamente. Estamos aqui para oferecer a melhor experiência para você. Somos ThenovisionRP...
         </p>
        </ContentList>
     
          </ContentCrad>
       </ContainerLi>
       </>
     )}
      </ModalWrapper>
    ) : null;
  };
    return(
        <>
      <Security>
          
      <HeadGlobal />
      
        {user && (
          <>
  
       
          <DashboardStyle />
     
       <MainDashboardN>
        {userInfo !== null && (
        <>
         <HeadGlobal Title={'#TheNoVision '}/>
    
    <GlobalError />
 
 
         <BanInformation />
      {userInfo.type ? (
          <> 
          
           </>
            ) : (
              <>
            <NOTAUTO />
              </>
            )}
        </>
       )}

        
           <Homepage/>
        </MainDashboardN>
        </>
         )}
              

              {authorizationStatus && isCookieActive && (
                  <ThemeProvider theme={theme}>
                    <Container>
                    <CanvasRevealEffect
                colors={[[0, 184, 148], [34, 49, 34]]} // Usando a cor gerenciada no estado
                animationSpeed={0.3}
                containerClassName="absolute inset-0"
              />
              
                      <Card className={isExiting ? 'exiting' : ''}>
                        <div className='text-center items-center flex justify-center w-full m-2'>
                          <LogoVision />
                        </div>
                        <Title>Sessão - Extraction</Title>
                        <Description>
                          Para jogar no thenovision, você precisa autorizar o acesso.
                        </Description>
              
                        <Description>
                          Clique no botão abaixo para conceder permissão e liberar sua jogatina. Após a autorização, volte ao jogo e aproveite a experiência sem interrupções!
                        </Description>
              
                        <SessionInfo>
                          <InfoItem>
                            <span>licença</span>
                            <span>{authorizationStatus.license?.replace(/^license:\s*/, "").slice(0, 23)}</span>
                          </InfoItem>
                          <InfoItem>
                            <span>ID Jogador </span>
                            <span>{authorizationStatus.playerId}</span>
                          </InfoItem>
                          <InfoItem>
                            <span>CID Address</span>
                            <span>{authorizationStatus.cid}</span>
                          </InfoItem>
                          <InfoItem>
                            <span>Horario</span>
                            <span>{authorizationStatus.date}</span>
                          </InfoItem>
                        </SessionInfo>
              
                        <ButtonContainer>
                          <Button
                            variant="approve"
                            onClick={handleAuthorization}
                            disabled={authorizationStatus?.mostRecentSession?.authorized || isLoadingApprove}
                          >
                            <Shield size={18} />
                            {isLoadingApprove ? "Autorizando..." : authorizationStatus?.mostRecentSession?.authorized ? 'Autorizado' : 'Autorizar'}
                          </Button>
                          <Button
                            variant="deny"
                            onClick={handleDeny}
                            disabled={isLoadingDeny} // Impede clicar enquanto o carregamento está ativo no botão Recusar
                          >
                            <ShieldX size={18} />
                            {isLoadingDeny ? "Recusando..." : "Recusar"}
                          </Button>
                        </ButtonContainer>
                      </Card>
                    </Container>
                  </ThemeProvider>
                )}
        </Security>
        </>
    )
}

PlayGame.getLayout = function getLayout(page: ReactNode) {
  return <>{page}</>
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
  



const Nak = styled.div`
 position: fixed;
 left: 1;
 z-index: 983;
 height:100vh;
 overflow-y: auto;
`;



const CardView = styled.div`
   display: flex;
   align-items: center;
   flex-direction: row;
   -webkit-animation: fadein 0.5s, expand 0.5s 0.5s,stay 7s 1s, shrink 0.5s 2s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, expand 0.5s 0.5s,stay 3s 1s, shrink 0.5s 4s, fadeout 0.5s 4.5s;
    margin: 1em;

    i{
    color: #7b887e;
   }
   
 
  button{
    border-radius: 0.375rem;
    background: url(/icons/button/button-bg.svg) center center / contain no-repeat;
    box-shadow: 0 0 1.5625rem #24e07956;
    border: none;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    color: #fff;
    padding: 0.4em 1em 0.4em;
    transition: ease .2s;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
   transition: 1s all;
    
   display: flex;
   align-items: center;
  

  
   h4{
    font-size: 12px;
    font-family: 'ProximaNova', monospace;
    color: #e7e4e4;
    font-weight: 900;
   }



}

@media screen and (max-width: 710px) {
  display: none;
 }

@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;} 
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes expand {
  from {min-width: 50px} 
  to {min-width: 40px}
}

@keyframes expand {
  from {min-width: 50px}
  to {min-width: 40px}
}
@-webkit-keyframes stay {
  from {min-width: 40px} 
  to {min-width: 40px}
}

@keyframes stay {
  from {min-width:40px}
  to {min-width: 40px}
}
@-webkit-keyframes shrink {
  from {min-width: 40px;} 
  to {min-width: 50px;}
}

@keyframes shrink {
  from {min-width: 40px;} 
  to {min-width: 50px;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;} 
  to {bottom: 40px; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 40px; opacity: 0;}
}
`;


const View = styled.div`
  
  position: fixed;
 
  top: 1em;
  right: 2em;
  
   .ImageLo{
    border-radius: 42px;
    border: 3px solid rgba(61, 62, 70, 0.416);
  
  }
  

  
  
`;



const NavBar = styled.nav`
  margin: 0.9em;
  position: absolute;
  width: 90%;
  right: 1px;
  top: 1px;
  z-index: 193;
  @media screen and (max-width: 360px) {
    margin: 0.1em;
    margin-top: 0.9em;
 
  }

  @media screen and (max-width: 280px){
      margin: 0;
      margin-top: 0.3em;
      width: 23em;
      margin-left: -3em;
  }

  
  @media screen and (max-width: 430px) {
     width: 95%;
  }
`;

 

// STYLED 

const ContentList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
 

  li{
    margin-top: 20%;
  }

  p{
    position: fixed;
    bottom: 11px;
   font-size: 12px;
   max-width: 653px;
   color: #b6b6b6;
   font-family: 'Inter', sans-serif;
   font-weight: 220;
  }

  a{
    color: #31dd8d;
  }

  i{
    font-size: 69px;
    color: rgb(20, 22, 21);
  }
`;

const ContentCrad = styled.div`
  text-align: center;
  position: fixed;
  top: 1;
  bottom: 0;
  overflow: auto;
  height: 98%;
  width: 90%;

  h1{
    color: #86a0b8;
  }
  `;

const ContainerLi = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 19%;
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(100px);
  display: flex;
  justify-content: center;
  align-items: center;
  place-items: center;
  overflow: scroll;
 
  border-radius: 30px;
`;




const MainDashboardN = styled.div`
  
  margin: 0 auto;
  
  z-index: 999;
  display: flex;
  flex-direction: column;


 

`;





const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
  backdrop-filter: blur(23px);
  z-index: 13;
  bottom: 0;
  top: 0;
  background: rgba(12, 12, 12, 0.767);
`;

const Card = styled.div`
    padding:2em;      
   border-radius: 51px 51px 0 0;
   background-color: #0B0C0A;
    background-image: url('/web/hdshfioef.png');
  
   border: 2px solid #151616;
  border-bottom: none;
  
  position: absolute;
  right:8px;
  bottom: -1px;
  max-width: 430px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 10;

  transition: opacity 1s ease-in-out;
  animation: CardNotify 0.7s linear;

@keyframes CardNotify {
 0%{ transform: translateY(100%); opacity: 0;}
 100%{ tranforms: translateY(0);opacity: 1;}
}

  transition: transform 0.7s ease-in-out, opacity 0.7s ease-in-out;

  &.exiting {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const Title = styled.h1<{ theme: any }>`
  color: ${props => props.theme.colors.white};
  font-size: 1.6rem; 
  font-weight: 700;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Description = styled.p<{ theme: any }>`
  color: ${props => props.theme.colors.white};
  opacity: 0.8;
  font-size: 12px;
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: #464d48;

  font-family: 'InterSemiBold', monospace;
`;

const SessionInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-top: 1.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div<{ theme: any }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.white};
  opacity: 0.9;
 
   span{
    font-family: 'ProximaNova-Italic';
    color: #9aa09c;
   }
  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ theme: any, variant: 'approve' | 'deny' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;
  font-family: 'Inter';
  border: none;
  color: black;
  
  background-color: ${props =>
    props.variant === 'approve'
      ? props.theme.colors.green
      : props.theme.colors.red};
  color: ${props => props.theme.colors.white};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;
