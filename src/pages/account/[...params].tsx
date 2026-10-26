import styled, { keyframes } from "styled-components";
import React, {  ReactNode, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import NVXROUTE from '@/routes/routes';
import { User } from "@/types/user/types";
import { withSession, NextIronRequest, NextIronHandler } from "@/lib/session"; 
import { UserInfo, getUserInfo } from "@/types/discord/usersearch";
import { ModLog, getModLogs } from "@/types/discord/modlog";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Logo from "@/public/nvrp/20221102_165951.jpg"
import ROUTENVX from "@/routes/routes";
import { Permission, getPermission} from "@/types/discord/permission";
import {  History } from "lucide-react";
import { getBorderColorFromTheme } from "@/data/themes/theme.config";
import IsecurityActivation from "@/wallet/security/isecurity";
import {UserConnectTwitch , UserConnectSteam} from '@/types/user/connections';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Discord from '@/public/icons/app/discord.png'
import SteamAAP from '@/public/icons/app/steam_500.png'
import TwitchAAP from '@/public/icons/app/twitch.png'


interface Props {
    user?: User;
    logs: UserInfo[];
    logHistory: ModLog[];
    Permissions: Permission[];
  }
 
  
import { Session } from "next-iron-session";
import HeadGlobal from "@/club/head/glob.n";
import {SmallAvatar} from "@club/components/menu/account.utils";
 
import { ArrowRight, Logout,  } from "iconsax-react";
import SubscriptionDashboard from '@/club/.prime/customers/subscription.prime';
import Billing from '@/club/.prime/customers/charges.prime';
import SubscriptionPrime from "@/club/.prime/subscription/buy";
import AccountCentralMain from '@/club/.vision/dashboard/accountcenter';
import Verification from "@/accounts/verification";
import PrizesAndDrops from "@/accounts/prizesdrops";
import OrdersPage from "@/accounts/orders";
import {ClubSettings} from "@/accounts/settings";
import {WalletSettings} from "@/accounts/settings/wallet";
import {VisionSettings} from "@/accounts/settings/vision";
import {AdditionalSettings} from "@/accounts/settings/additional";
import Session_Nv from "@/accounts/sessions.nvrp";
 
import { AccountDashboard } from '../../accounts/account/account.info';
import ThemeSelector from "@/components/theme/theme";
import TradesDashboard from "@/accounts/overview.trades";
import { GetInfo_nvxre_xyloQuerier, nvxre_connections_we } from "@/hooks/InfoData";
import Rental from "@/accounts/rental/rental";
import SessionClub from "@/accounts/session.club";
import SupportPage from "@/accounts/support";
   
export default function AccountCentral({ user, logHistory  }: Props) {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
    const [userInf, setUserInf] = useState <UserInfo | null>(null);
    const [UserConnectTwitch, setUserConnectTwitch] = useState<UserConnectTwitch | null>(null)    
    const [UserConnectSteam, setUserConnectSteam] = useState<UserConnectSteam | null>(null)
    const [currentStep, setCurrentStep] = useState(1);
    const [siderbn, setsider] = useState(false)
    const [sidern, setsidern] = useState(true)
    const [mobile, setmobile] = useState(false)
    const [ loading, setloading ] = useState(false)
    const [security, setsecurity]= useState(false)
    const [sessionclub, setsessionclub]= useState(false)
    const [overview, setoverview] = useState(false)
    const [tradings, setrading ] = useState(false)
   const { isLoadingx, userTeam,userInfoObject, mutate } = GetInfo_nvxre_xyloQuerier();
     if(!user) return;
    const {isLoading_we, Data_we} = nvxre_connections_we({ id: user.id });

    const handlesideropen = () => {
      setsider(true)
      setsidern(false)
    }

    
    const handlesiderclose = () => {
      setsider(false)
      setsidern(true)
    }


     const orbRef = useRef<HTMLDivElement>(null)
    
      useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
          if (orbRef.current) {
            const x = e.clientX
            const y = e.clientY
    
            // Add some delay for a more natural feel
            setTimeout(() => {
              if (orbRef.current) {
                orbRef.current.style.left = `${x - 250}px`
                orbRef.current.style.top = `${y - 250}px`
              }
            }, 100)
          }
        }
    
        window.addEventListener("mousemove", handleMouseMove)
    
        return () => {
          window.removeEventListener("mousemove", handleMouseMove)
        }
      }, [])

    useEffect(() => {
      const updateSiderState = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // Verifica se a largura está abaixo de 768px ou não
        if (width > 768) {
          setsider(true); // Sider visível para telas grandes
          setmobile(false); // Não é mobile
        } else {
          setsider(false); // Sider oculto para telas pequenas
          setmobile(true); // É mobile
        }
  
        // Pode adicionar também uma verificação para a altura se for relevante
        // para o comportamento do seu layout
        if (height < 500) { // Exemplo: se a altura for muito pequena, não alterar o estado
          setsider(false);
        }
      };
  
      // Chama a função inicialmente e sempre que a janela for redimensionada
      updateSiderState();
  
      // Adiciona um event listener para o redimensionamento da janela
      window.addEventListener('resize', updateSiderState);
  
      // Remove o event listener quando o componente for desmontado
      return () => {
        window.removeEventListener('resize', updateSiderState);
      };
    }, []); 
    
   
  
     useEffect(() => {
       if(isLoadingx || isLoading_we) {
    setloading(true)
  }

       if (!isLoadingx && userInfoObject) {
       setUserInfo(userInfoObject);
        setUserInf(userTeam)
         setloading(false);
         }  
       }, [isLoadingx, userInfoObject,isLoading_we]);
    
    useEffect(() => {
      if (!isLoading_we && Data_we) {
      setloading(false);
          setUserConnectTwitch(Data_we.twitch);
             setUserConnectSteam(Data_we.steam);
          
      } 
    }, [Data_we,isLoading_we]);
        

    //// MODAL CONFIG PROFILE

  
    const path = router.asPath;
    const query = router.query;
    const modalType = path.split("/").pop();
    const buyParam = query.buy; 
    
    useEffect(() => {

      const resetModals = () => {
        setShowProfileuser(false);
        setconnections(false);
        setpremium(false);
        setoverview(false)
        setsettings(0)
        setaboutconnected(false);
        setconnections(false);
        setthemesconfig(false);
        setsession(false)
        setAccountsupport(false);
        setoverviewinfoaccount(false)
        setshowAccountRe(false);
        setCurrentStep(0);
        setconnections(false);   
        setAccountpreference(false);
        setorders(false)
        setShowHistoricouser(false);
        setverification(false)
        setsubscription(false);
          setrading(false);  
        setcharges(false);
        setsessionclub(false)
        setsecurity(false)
        setprizedrops(false)
        if (window.innerWidth > 768) { // Considera tamanhos maiores que 768px como tela de computador
    
        } else {
          setsider(false);
          setsidern(true)
        }
      };
    
      if (modalType) {
        resetModals();
    
        switch (modalType) {
          case 'novision':
            if (path.includes('connected_experiences')) {
              setaboutconnected(true);     
            }
            break;
          case 'third_party_apps':
            if (path.includes('connected_experiences')) {
              setconnections(true);     
            }
            break;

          case 'connected_experiences':
            setCurrentStep(8);
            break;
          case 'rental':
            setCurrentStep(888);
            break;
          case 'history':
            setShowHistoricouser(true);
            break;
          case 'ac_clubvision':
            setshowAccountRe(true);
            break;
            case 'verification':
            setverification(true);
            break;
          
          case 'premium':
            if (buyParam === 'club_premium') {
              setpremium(true);
            }
            setpremium(true);
            break;
          case 'session_club': 
          setsessionclub(true)
          break
          case 'subscription':
            setsubscription(true);
            break;
            case 'settings':
              setsettings(1);
              break;
                case 'setting_clubvision':
              setsettings(5);
              break;
              case 'walletvision':
                if (path.includes('settings')) {
                  setsettings(2);     
                }
                break;

                case 'thenovision':
                  if (path.includes('settings')) {
                    setsettings(3);     
                  }
                  break;
                  
                  case 'additional':
                    if (path.includes('settings')) {
                      setsettings(4);     
                    }
                    break;
                    case 'session':
                      if (path.includes('game')) {
                        setsession(true);     
                      }
                      break; 
          case 'history_payment':
            setcharges(true);
            
            break;
          case 'trades': 
          setorders(true)
          break
            case 'upgrades':  
          setrading(true);     
          break;
          case 'prizes-drops': 
            setprizedrops(true)
          break
          case 'overview': 
          setoverview(true);
          break;
          case 'quality_account': 
          setsecurity(true)
          break
          case 'security':
            setAccountpreference(true);
            break;
            case 'support':
              setAccountsupport(true);
              break;
               case 'account_overview':
           setoverviewinfoaccount(true)
              break;
               
          case 'themes':
            setthemesconfig(true);
            break;
          default:
            setShowProfileuser(true);
            break;
          }
        } 
      }, [router.asPath]);
    
 
    const [showthemesconfig, setthemesconfig] = useState(false);
    const [showAccountRe, setshowAccountRe] = useState(false);
    const [showAccountpreference, setAccountpreference] = useState(false);
    const [showverification , setverification] = useState(false)
    const [showProfileuser, setShowProfileuser] = useState(true);
    const [showHistoricouser, setShowHistoricouser] = useState(false);
    const [showprizedrops, setprizedrops] = useState(false)
    const [showoptions, setoptions] = useState(true);
    const [showaboutconnected, setaboutconnected ] = useState(false);
    const [showconnections, setconnections ] = useState(false);
    const [showorders, setorders] = useState(false)
    const [ settings , setsettings] = useState(1)
    const [showpremium, setpremium] = useState(false);
    const [showsession, setsession] = useState(false);
   const [showAccountSupport, setAccountsupport] = useState(false);
   const [overviewinfoaccount, setoverviewinfoaccount] = useState(false);
    const [showsubscription, setsubscription] = useState(false);
    const [showcharges, setcharges] = useState(false)
    
   
   
        
     ///////// ICONE 
    
    
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
      if (router.query.logout === 'clubvision') {
       setIsOpen(true)
       setshowAccountRe(true)
      }
    }, [router.query]);
      const AccountAcess: React.FC = () => {
        
        const openModal = () => {
              setIsOpen(true);
            };
          
            const closeModal = () => {
              setIsOpen(false);
            };
        
            const router = useRouter();
            const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
            const open = Boolean(anchorEl);
      
            const [isLoading, setIsLoading] = useState(true);
            useEffect(() => {
              // Simulando uma requisição que leva 3 segundos para completar
              const timer = setTimeout(() => {
                setIsLoading(false);
              }, 9000);
              return () => clearTimeout(timer);
            }, []);

        

        return (
          <>
    

    <ButtonClick onClick={openModal}>
   <i><Logout size="24" color="#d9e3f0" variant="Broken"/></i>
    </ButtonClick>

      {isOpen && (
         <>
   <ModalWrapper>
           <Contenttext>
           <CardProfile>
           <Contenttext>
            <h1>Conta</h1>
            {!user && (
            <h3>Deslogado</h3>
          )}{user && (
          <>
          <UserPo>
            <li> 
            <i className="fi fi-rr-circle-user color4"/>
          
              <Image className="logoavatar" src={user.avatar || 'https://i.imgur.com/mXit4fI.jpg'} 
              alt={user.username} height={50} width={50}/>
             <h4 className="jdsjf">{user.username}</h4>
            </li>
    
           <li>
           <i className="fi fi-sr-user-robot color4"/>
           <span>
            Lembre-se que para conseguir jogar em nossa cidade, você precisa estar autorizado em nossa comunidade. 
           </span>
           </li>
           <CardInButton>
          
           <ButtonClose   onClick={() => router.push(NVXROUTE.logout)}> 
              Deslogar
              </ButtonClose>

            <ButtonUser  onClick={closeModal}>
             Cancelar
            </ButtonUser>

           
             <p>
              Você está logado e agora você ja pode iniciar o game. Se divirta jogando em nosso servidor roleplay.
             </p>
            </CardInButton>
            </UserPo>
          </>
        )}
           </Contenttext>
           </CardProfile>
           </Contenttext>
          </ModalWrapper>
         </> 
        )}
        </>
       );
      }
  
  
      const [isBannedAccountVisible, setIsBannedAccountVisible] = useState(false);
      useEffect(() => {
        const hasBanLog = logHistory.some((log) => log.type === 'BAN');
        setIsBannedAccountVisible(hasBanLog);
      
      }, [logHistory]);
    
      const [isWARNAccountVisible, setIsWARNAccountVisible] = useState(false);
      useEffect(() => {
        const hasWarnLog = logHistory.some((log) => log.type === 'WARN');
        setIsWARNAccountVisible(hasWarnLog);
        
      }, [logHistory]);
      const [isKickAccountVisible, setIsKickAccountVisible] = useState(false);
      useEffect(() => {
        const hasKickLog = logHistory.some((log) => log.type === 'KICK');
        setIsKickAccountVisible(hasKickLog);
       
      }, [logHistory]);
      const [isUnbanAccountVisible, setIsUnbanAccountVisible] = useState(false);
      useEffect(() => {
        const hasUnbanLog = logHistory.some((log) => log.type === 'UNBAN');
        setIsUnbanAccountVisible(hasUnbanLog);
      
        setAnyAlertVisible(isUnbanAccountVisible || isBannedAccountVisible || isWARNAccountVisible || isKickAccountVisible);
      }, [logHistory,isUnbanAccountVisible, isBannedAccountVisible, isWARNAccountVisible, isKickAccountVisible]);
        
      
         
          const [isAnyAlertVisible, setAnyAlertVisible] = useState(
            isUnbanAccountVisible || isBannedAccountVisible || isWARNAccountVisible || isKickAccountVisible
          );

     
          function handleBack() {
            router.back(); 
          }

   
      if (!UserConnectSteam) { 
        return;
      }
    return (
      <>
        <HeadGlobal Title={'Profile | Account Center'} />
  
              
  <SubscriptionPrime />
      
      <MarginC>
         
  
          <TopLogo  theme={userInfo?.Backgroundtheme}>
    
    {mobile ? (
      <>
       {siderbn ? (
   <button onClick={handlesiderclose}> <i className="fi fi-br-cross"/></button>
           ) : (
            <button onClick={handlesideropen}> <i className="fi fi-br-apps"/></button>
           )}
      </>
    ) : <div />}
           
              
       <Image src={'/nvrp/20221001_185012.png'} alt="novision"  width={100} height={40}/> 
        <img 
alt={user?.username} src={user?.avatar} height={30} width={30} style={{borderRadius: '50%'}} />
        
    
  
      </TopLogo>
 
      <MarginVXC> 
     
     {siderbn && (
        <>
         
         <ViewOptions  theme={userInfo?.Backgroundtheme}> 
         
           
        <li className="sdli">
             <h4 className="dhjdsf">Central de Conta</h4>
          <p>
            Gerencie sua experiência e configurações de conta, Clubvision e Thenovision.
          </p>
        </li>
          

    
            {userInfo !== null ? ( 
                <>
 
     <ButtonCardOptionx className={router.asPath.includes(ROUTENVX.centralpreference) &&  showAccountRe ? "navbar-active" : ""}
    onClick={() => router.push(ROUTENVX.centralpreference)}>
    <ul className="ild">
    <Stack direction="row" spacing={1}>

<Badge
overlap="circular"
anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
badgeContent={
<SmallAvatar alt="novision" src="/nvrp/20221102_165951.jpg" />
}
>
<Avatar 
alt={user?.username} src={user?.avatar}  />
</Badge>
</Stack>


    <li>
    <span>{userInf?.name}{userInf?.subdominio}</span>
    <p>Central de conta</p>
    </li>

     
   </ul>
   <ArrowRight size="24" color="#8b918e" className="ocos" variant="Broken"/>
    </ButtonCardOptionx>
   
   <li>
     
       <ButtonClickOptions  onClick={() => router.push(ROUTENVX.centraldash)}
              className={router.asPath.includes(ROUTENVX.centraldash) ? "navbartive" : ""} >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <h4>Conta</h4>
            </ButtonClickOptions>
 
   </li>
 


  <li>
    
        <ButtonClickOptions   onClick={() => router.push(ROUTENVX.connections)}
              className={router.asPath.includes("connected_experiences") && currentStep == 8 ? "navbartive" : ""} >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/></svg>
                <h4>Conexões</h4>
            </ButtonClickOptions>
    
  </li>





         {userInfo.prime ? null : (
            <>
          <li> 
            <ButtonClickOptions 
            onClick={() => router.push(ROUTENVX.centralpremium)} 
            className={router.asPath.includes(ROUTENVX.centralpremium) && showpremium ? "navbartive" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>
                <h4>Premium</h4>
            </ButtonClickOptions>
           </li>
            
            </>
          )}

   <li>
           <ButtonClickOptions   onClick={() => router.push(`/${ROUTENVX.orders}`)}    className={router.asPath.includes(ROUTENVX.orders) ? "navbartive" : ""}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="24" width="24" ><path fill-rule="evenodd" clip-rule="evenodd" d="M20.901 2.096a.648.648 0 00-.916 0l-5.161 5.161a.648.648 0 10.916.916l5.161-5.161a.648.648 0 000-.916zM12.503 3.17l4.917.578-1.904 1.904a1.938 1.938 0 00-1.952 1.32 1.943 1.943 0 103.782.514l1.906-1.906.58 4.917L9.328 21l-1.832-1.832v-1.832l-1.832-1.831-1.832-.002L2 13.672 12.503 3.17z" fill="currentColor"></path></svg>
                <h4>Trocas</h4>
            </ButtonClickOptions>
    
           </li>

            <li>
           <ButtonClickOptions   onClick={() => router.push(`/${ROUTENVX.rental}`)}    className={router.asPath.includes(ROUTENVX.rental) ? "navbartive" : ""}>
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>
                <h4>Rental</h4>
            </ButtonClickOptions>
    
           </li>


    <li>
           <ButtonClickOptions   onClick={() => router.push(`/${ROUTENVX.prizesdrops}`)}    className={router.asPath.includes(ROUTENVX.prizesdrops) ? "navbartive" : ""}>
           
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
                <h4>Prêmios e Drops</h4>
            </ButtonClickOptions>
    
           </li>

       

            <li>
           <ButtonClickOptions   onClick={() => router.push(`/${ROUTENVX.trades}`)}    className={router.asPath.includes(ROUTENVX.trades) ? "navbartive" : ""}>
           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M3.91 17.181c-.19 0-.38-.07-.53-.22a7.244 7.244 0 0 1-2.13-5.13c0-4.01 3.25-7.27 7.25-7.27l6.07.02-1.09-1.04a.746.746 0 0 1-.02-1.06c.29-.3.76-.31 1.06-.02l2.44 2.34c.22.21.29.54.18.82-.11.28-.39.47-.7.47l-7.94-.02c-3.17 0-5.75 2.59-5.75 5.77 0 1.53.6 2.98 1.69 4.07.29.29.29.77 0 1.06-.15.14-.34.21-.53.21ZM10 21.75a.75.75 0 0 1-.52-.21L7.04 19.2a.76.76 0 0 1-.18-.82c.11-.28.39-.47.7-.47l7.95.02c3.17 0 5.75-2.59 5.75-5.77 0-1.53-.6-2.98-1.69-4.07a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0a7.244 7.244 0 0 1 2.13 5.13c0 4.01-3.25 7.27-7.25 7.27l-6.07-.02 1.09 1.04c.3.29.31.76.02 1.06-.16.16-.35.24-.55.24Z" fill="#717472"></path><path d="M9 15.5h6c1.92 0 3.5-1.57 3.5-3.5 0-1.92-1.57-3.5-3.5-3.5H9A3.51 3.51 0 0 0 5.5 12c0 1.93 1.57 3.5 3.5 3.5Z" fill="#b1b8b4"></path></svg>
                <h4>Upgraders</h4>
            </ButtonClickOptions>
    
           </li>
          
          <h5>Configurações</h5>


          
     
       

           <li>
            {userInfo.prime && ( 
            <ButtonClickOptions  onClick={() => router.push(ROUTENVX.centralthemes)}
              className={router.asPath.includes(ROUTENVX.centralthemes) && showthemesconfig ? "navbartive" : ""} >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14.622 17.897-10.68-2.913"/><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/></svg>
                <h4>Aparencia</h4>
            </ButtonClickOptions>
            )}
            </li>


            
   
            <li>
              {userInfo.prime && ( 
            <ButtonClickOptions onClick={() => router.push(ROUTENVX.Isecurity)}
              className={router.asPath.includes(ROUTENVX.Isecurity) && showAccountpreference ? "navbartive" : ""}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"  ><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
                <h4>iSecurity</h4>
            </ButtonClickOptions>
            )}
            </li> 

            <li>
           <ButtonClickOptions   onClick={() => router.push(`/${ROUTENVX.settings}`)}    className={router.asPath.includes(ROUTENVX.settings) ? "navbartive" : ""}>
           
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                <h4>Preferências</h4>
            </ButtonClickOptions>
    
           </li>


        


          
                </>
            ) : null}
            
       
 
          </ViewOptions>
        </>
     )}
      
          {sidern && ( 
              <BContainer>
               
              <ContainercenterProfile>
   
       
        
             
             
             {user && userInfo?.prime &&  showthemesconfig  && (
              <>
              <DsiProlCn>
       
       <ul className="ulmargin2">
  <h2>Personalize o icone</h2>
  <p>Você pode personalizar o ícone da logo exibido no canto superior esquerdo do dashboard.</p>
    </ul>     
    </DsiProlCn> 

      <ThemeSelector id={user.id} mutatex={mutate}/>
 
              </>   
            )
             }
             

             {showverification && (
              <>
                   <DsiProlCn>
       
       <ul className="ulmargin2">
  <h2>Verificação de conta</h2>
    <p>Status e identificador de conta verificada.</p>
    </ul>     
    </DsiProlCn> 

               <Verification userInfo={userInfo} infox={userInf} user={user} />
              
              </>
             )}


            {showorders && user && (
              <>
                    <DsiProlCn>
       
       <ul className="ulmargin2">
  <h2>Trocas de tokens</h2>
    <p>Quando uma troca for realizada será possivel visualizar por aqui.</p>
    </ul>     
    </DsiProlCn> 
             
 <OrdersPage userId={user.id}  />
             
              </>  
            )}

            {showprizedrops && (
              <>
        
   
  <PrizesAndDrops />
      
              </>     
            )}     
             
             
            {userInfo?.prime && showAccountpreference && (
                <>
                

{userInfo !== null && (
          <>
           {userInfo.type ? (
             <>
              
            <IsecurityActivation user={user}  />
          </>
           ) :  (
            <>
              <ContentListed>
      <i className="fi fi-sr-lock-alt"/>
      <h2>Sem permissão</h2>
      <span>
      Voce ainda nao e um player em nossa comunidade. Use o seu codigo *convite amigo* ou seja prime.
      </span>
      </ContentListed>
            </>
           )}
          </>
        )}
              
                </>
             )}
  
         {user && (
          <>
         {showpremium && (
          <>       

             {userInfo !== null && <SubscriptionDashboard id={user.id} type={userInfo.typeprime}/>}
        
         
          </>
         )}


        {showcharges && (
          <>

                <DsiProlCn>
       
       <ul className="ulmargin2">
  <h2>Caixa de Cobranças</h2>
    <p>Quando uma cobrança for realizada sera mostrada com todos os detalhes.</p>
    </ul>     
    </DsiProlCn> 
  
  <Containercenter>
                <Billing email={user.email} userId={user.id}/>
         
             </Containercenter> 
   
              <div className="flex   items-top w-full gap-2 mt-2 p-1">
      <ViewInfo onClick={()  => router.push('https://checkout.tebex.io/payment-history')}>
      <img src="/icons/app/logo.BCN2mLkL.svg" alt="tebex" height={70} />

       <li>
        <h4>Confira suas compras</h4>
        <p>
        Todas as suas compras na Tebex são registradas aqui. Acompanhe e tenha total controle sobre elas.
        </p>
       </li>
      </ViewInfo>


      <ViewInfo onClick={()  => router.push('https://www.tebex.io/support')}>
      <img src="/icons/app/logo.BCN2mLkL.svg" alt="tebex" height={70} />
 
       <li>
        <h4>Solicite suporte a tebex</h4>
        <p>
        Se você teve dificuldades ao fazer um pagamento ou encontrou problemas com o sistema de pagamentos da Tebex, entre em contato com o suporte.
        </p>
       </li>
      </ViewInfo>
      </div>
         
          </>
        )}


        {showsubscription && ( 
          <>

           {userInfo !== null && <SubscriptionDashboard id={user.id} type={userInfo.typeprime}/>}
             
          </> 
        )}



         </>
        )}
        


    {currentStep === 888 && ( 
      <>
      <Rental id={user.id}/>
      </>
    )}


 {/* HISTORICO USUARIO ABAIXO */}
 {showHistoricouser && (
          <>

             <DsiProlCn>
       
       <ul className="ulmargin2">
  <h2>Historico de punições</h2>
    <p>O Historico de punições mostrara todas as atividade vinculada ao seu visionID.</p>
    </ul>     
    </DsiProlCn> 
          <VisualizationCard>
          
          <Containercenter>
           {user && (
          <>
         
         <ContainerDisç>
      {logHistory.length === 0 ? (
      <ContentListed>
      <i className="fi fi-rr-time-past"/>
      <h2>Sem Historico</h2>
      <span>
      No momento, você não tem um histórico de banimentos/avisos para exibir.
      </span>
      </ContentListed>
    ) :
    ( logHistory.map((log) => (
      <>
       
      <Content key={log._id.toString()}>
  <Contextcard>
  <Image className="logo" src={Logo} alt='' height={36} />
  <li> 
  <i className="fi fi-br-power"/> <span>ID Log:</span><p>{log._id}</p>
  </li>
  <li>
  <i className="fi fi-rr-address-book"/><span>Usuario:</span><p>{user.username}</p>
  </li>
  <li> 
  <i className="fi fi-rr-id-badge"/> <span>Seu ID discord:</span><p>{log.member_id}</p>
  </li>
  <li>
  <i className="fi fi-rr-arrow-trend-up"/><span>Status:</span><p>{log.type}</p>
  </li>

  <li>
  <i className="fi fi-rr-id-card-clip-alt"/><span>Administrador:</span><p>{log.admin.tag}</p>
  </li>
  </Contextcard>
  <Description>
  <li>
  
  <hr />
  <p className="logsdescription">{log.reason}</p>
  </li>
  </Description>
  <p className="logsDate">{log.created_at}</p>
      </Content>

      </>
      )))}
       </ContainerDisç>
      </>
         )}
         
         </Containercenter>
            
          </VisualizationCard>
          </>
        )}

      
      {showAccountSupport && (
        <>
         <DsiProlCn>
       <ul className="ulmargin2">
  <h2>Suporte a conta</h2>
  <p>
  Acesse o suporte para atualizar suas informações pessoais, resolver problemas de acesso entre o thenovision e o Clubvision. 
  </p>
    </ul>      
  </DsiProlCn> 

  
    <SupportPage user={user} />

  

        </>
      )}
      
      {(overview || security )&& (
        <>
    <DsiProlCn>
       <ul className="ulmargin2">
  <h2>Conta</h2>
  <p>
Gerencie as informações do seu perfil e use as mesmas informações no thenovision city e clubvision. </p>
    </ul>      
  </DsiProlCn> 

 <AccountDashboard type="security"  info={{ ...userInfo, ...user, ...userInf,...UserConnectSteam }}  /> 
     
 <VisualizationCard>
     
     <ContainerCard>

  

     {showoptions && (
      <>
          <ButtonCardOption  onClick={() => router.push(ROUTENVX.History)}>
          <ul>
          <Stack direction="row" spacing={1}>
  
     
             <History size={25} />
         </Stack>


          <li>
          <span>Historico de conta</span>
          <p>Historico de punições thenovision</p>
          </li>
         
         </ul>
         <i className="fi fi-sr-angle-right" />
          </ButtonCardOption>
        <hr />
        <ButtonCardOption onClick={() => router.push(ROUTENVX.accountinfo)}>
          <ul>
          <Stack direction="row" spacing={1}>
  
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/></svg>
         </Stack>


          <li >
          <span>Informações da conta</span>
          <p>Informações de sua conta clubvision</p>
          </li>
         
         </ul>
         <i className="fi fi-sr-angle-right" />
          </ButtonCardOption>
           <hr />
        <ButtonCardOption  onClick={() => router.push(ROUTENVX.support)}>
          <ul>
          <Stack direction="row" spacing={1}>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>
         </Stack>


          <li >
          <span>Solicitações de suporte</span>
          <p>Solicite suporte via ticket. Os pedidos são salvos aqui!</p>
          </li>
         
         </ul>
         <i className="fi fi-sr-angle-right" />
          </ButtonCardOption>

           <hr />
        <ButtonCardOption onClick={() => router.push(ROUTENVX.verification)}>
          <ul>
          <Stack direction="row" spacing={1}>
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
         </Stack>


          <li >
          <span>Verificação de conta</span>
          <p>Informações relevante sobre a verificação club.</p>
          </li>
         
         </ul>
         <i className="fi fi-sr-angle-right" />
          </ButtonCardOption>
          </>
          )}


          
  <hr />
        
        {userInfo?.prime && (   
        <> 
        <ButtonCardOption 
        onClick={() => router.push(ROUTENVX.centralsubscription)} >

             <ul>
          <Stack direction="row" spacing={1}>
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
         </Stack>


          <li >
          <span>Assinaturas</span>
          <p>Sua assinatura premium club.</p>
          </li>
         
         </ul>
     <i className="fi fi-sr-angle-right" />
        </ButtonCardOption>
       </>
        )}

          <hr />
     
            <ButtonCardOption 
            onClick={() => router.push(ROUTENVX.centralcharges)} >
              
             <ul>
          <Stack direction="row" spacing={1}>
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/></svg>
         </Stack>


          <li >
          <span>Cobranças</span>
          <p>Pagamentos e cobranças de uso do serviço novision.</p>
          </li>
         
         </ul>
     <i className="fi fi-sr-angle-right" />

            </ButtonCardOption>
  

     </ContainerCard>
       
    </VisualizationCard>
     
     
        </>
      )}

 

        
        {overviewinfoaccount && (
           <>
            <Container> 
           
   <AccountDashboard type="account"  info={{ ...userInfo, ...user, ...userInf, ...UserConnectSteam }} /> 
      </Container>
      </>
        )}


          
{currentStep === 8 && (
          <>
   
         <Containercenter>
         <DsiProlCn>
        <ul className="ulmargin2">
  <h2>Experiências conectadas</h2>
    </ul>          
  

    <VisualizationCard>
     
     <ContainerCard>

  

     {showoptions && (
      <>
          <ButtonCardOption onClick={() => router.push(ROUTENVX.connect_nvrp)}>
          <ul>
          <Stack direction="row" spacing={1}>
  
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="iconIO"><path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z"/><path d="m14 7 3 3"/><path d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814"/></svg>
         </Stack>


          <li>
          <span>Minhas contas novision</span>
          <p>Conecte-se ao serviços thenovision</p>
          </li>
         
         </ul>
         <i className="fi fi-sr-angle-right" />
          </ButtonCardOption>
        <hr />
        <ButtonCardOption onClick={() => router.push(ROUTENVX.connect_apps)}>
          <ul>
          <Stack direction="row" spacing={1}>
  
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="iconIO"><path d="M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1"/><path d="M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9"/><path d="M21 21v-2h-4"/><path d="M3 5h4V3"/><path d="M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3"/></svg>
         </Stack>


          <li >
          <span>Vincular contas</span>
          <p>Vincule suas contas com thenovision</p>
          </li>
         
         </ul>
         <i className="fi fi-sr-angle-right" />
          </ButtonCardOption>
           <hr />
        <ButtonCardOption onClick={() => router.push(ROUTENVX.session)}>
          <ul>
          <Stack direction="row" spacing={1}>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="iconIO"><path d="M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z"/><path d="M6 15v-2"/><path d="M12 15V9"/><circle cx="12" cy="6" r="3"/></svg>
        
         </Stack>


          <li >
          <span>Minhas Sessões</span>
          <p>Suas sessões no thenovision são gravadas aqui.</p>
          </li>
         
         </ul>
         <i className="fi fi-sr-angle-right" />
          </ButtonCardOption>

             <hr />
        <ButtonCardOption onClick={() => router.push(ROUTENVX.sessionclub)}>
          <ul>
          <Stack direction="row" spacing={1}>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 12h8"/><path d="M13 18h8"/><path d="M13 6h8"/><path d="M3 12h1"/><path d="M3 18h1"/><path d="M3 6h1"/><path d="M8 12h1"/><path d="M8 18h1"/><path d="M8 6h1"/></svg>
         </Stack>


          <li >
          <span>Sessões club</span>
          <p>Suas sessões no clubvision são gravadas aqui.</p>
          </li>
         
         </ul>
         <i className="fi fi-sr-angle-right" />
          </ButtonCardOption>
          </>
          )}
     </ContainerCard>
       
    </VisualizationCard>
     </DsiProlCn>
        </Containercenter>
           </>
        )}

{showconnections && (
      <>

<DsiProlCn>
       
      <ul className="ulmargin2">
  <h2>Experiências conectadas</h2>
    </ul>     
    </DsiProlCn> 
     
    <VisualizationCard>

   
<Mafi>
{user?.id && (
           <>
          <CardViewInExtraction >
            <ContentExtraction> 
               
              <ImageBorderIcon>
               <Image 
               className="logoMas logoactive"
               src={Discord} 
               alt="TheNoVision" height={70} />
               </ImageBorderIcon>
                 <li>    
               <ul className='ul'>
                <h4>Discord</h4>
                 <p className="sub">Vinculado como {user?.username}</p>
               </ul>
             
               <span  className='span'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30c75d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check-check-icon lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                <h5>Conectada</h5>
               </span>
                  </li>
               
            </ContentExtraction>
        </CardViewInExtraction>
          </>
        )}



        {UserConnectSteam?.id ? (
        <>
       <CardViewInExtraction>
            <ContentExtraction>
            
              <ImageBorderIcon>
               <Image 
               className="logoMas logoactive"  
               src={SteamAAP} 
               alt="TheNoVision" height={70} />
                </ImageBorderIcon>
                   <li>
               <ul  className='ul'>
                <h4>Steam</h4>
                 <p className="sub">Vinculado como {UserConnectSteam?.displayName}.</p>
               </ul>
             
               <span  className='span'>
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30c75d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check-check-icon lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                <h5>Conectada</h5>
               </span>
                  </li>
            </ContentExtraction>
        </CardViewInExtraction>
        </>
        ) : (
          <>
     <CardViewInExtraction onClick={() => router.push(ROUTENVX.signinSteam)} className="click">
            <ContentExtraction>
             
              <ImageBorderIcon>
               <Image 
               className="logoMas"
               src={SteamAAP} 
               alt="TheNoVision" height={70} />
                </ImageBorderIcon>
                  <li>
               <ul  className='ul'>
                <h4>Steam</h4>
                 <p className="sub">Conta não conectada.</p>
               </ul>
               
               <span  className='span'>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-alert-icon lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                <h5>Conectar</h5>
               </span>
               </li>
            </ContentExtraction>
        </CardViewInExtraction>
         </>
        )}
  

     
        {UserConnectTwitch?.user_idtwitch ? (
           <>
          <CardViewInExtraction >
       
            <ContentExtraction>
              
              <ImageBorderIcon>
               <Image 
               className="logoMas logoactive"
               src={TwitchAAP} 
               alt="TheNoVision" height={70}  />
               </ImageBorderIcon>
                <li>
               <ul  className='ul'>
                <h4>Twitch</h4>
                 <p className="sub">Vinculado como {UserConnectTwitch?.user_nametwitch}</p>
               </ul>
              
               <span  className='span'>
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30c75d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check-check-icon lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                <h5>Conectada</h5>
               </span>
                 </li>
            </ContentExtraction>
          
        </CardViewInExtraction>
        
          </>
        ) : (
          <>
            <CardViewInExtraction onClick={() => router.push(ROUTENVX.siginTwitch)} className="click">
            <ContentExtraction>
               
              <ImageBorderIcon>
               <Image 
               className="logoMas"
               src={TwitchAAP} 
               alt="TheNoVision" height={70} />
               </ImageBorderIcon>

               <li>
                 <ul  className='ul'>
                <h4>Twitch</h4>
                 <p className="sub">Conta não conectada.</p>
               </ul>
              
               <span  className='span'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-alert-icon lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                <h5>Conectar</h5>
               </span>
               </li>
              
            </ContentExtraction>
        </CardViewInExtraction>
          </>
        )}

</Mafi>
  </VisualizationCard>
</>
)}


{sessionclub && (
  <>
      <SessionClub />
  </>
)}

{showaboutconnected && (
      <>
  
<DsiProlCn>
       
       <ul className="ulmargin2">
  <h2>Conexões</h2>
    </ul>     
    </DsiProlCn> 

      <VisualizationCard> 
<Mafi>

{userInfo !== null && (
       <>
  
   {userInfo.type ? (
      <>
   <CardConnections>
      <Contentconnections>
              
              <ImageBorderIcon>
               <Image 
               className="logoMas logoactive"
               src={'/nvrp/20240520_081457.png'} 
               alt="TheNoVision" height={70} width={70} />
              </ImageBorderIcon>
               <li>
               <ul>
                <h4>TheNoVision</h4> 
                 <p className="sub">Conta Autorizada</p>
               </ul>
            
               <span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30c75d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check-check-icon lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                <h5>Autorizado</h5>
               </span>
                   </li>
            </Contentconnections>
        </CardConnections>
    </>
  ) : (
    <>
     <CardConnections>
      <Contentconnections>
             
              <ImageBorderIcon>
               <Image 
               className="logoMas"
               src={'/favicon.ico'} 
               alt="TheNoVision" height={70} width={70} />
              </ImageBorderIcon>
                <li>
               <ul>
                <h4> TheNoVision</h4> 
                <p className="sub">Conta não autorizada</p>
               </ul>
            
               <span>
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-alert-icon lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <h5>Não Autorizado</h5>
         </span>
             </li>
            </Contentconnections>
        </CardConnections>
    </>
  )}


 </>
)}


</Mafi>

 </VisualizationCard>
      </>

)}


  {tradings && (
    <>
   <DsiProlCn>
       <ul className="ulmargin2">
  <h2>Analise Upgrades</h2>
  <p>Você pode analisar e ver seu historico de melhoramento de tvls ja feitos no mercado.</p>
    </ul>     
    </DsiProlCn> 
    <TradesDashboard />
    </>
  )}

    

    {settings == 1 && (
      <>

         <DsiProlCn>
       
       <ul className="ulmargin2">
  <h2>Preferências & Configurações</h2>
 
    </ul>     
    </DsiProlCn> 


    <VisualizationCard>
     
     <ContainerCard>

   
          <ButtonCardOption  onClick={() => router.push(ROUTENVX.settingswallet)}>
          <ul>
          <Stack direction="row" spacing={1}>
  
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
         </Stack>


          <li>
          <span>Walletvision</span>
          <p>Preferencias de escolhas para sua carteira.</p>
          </li>
         
         </ul>
         <i className="fi fi-sr-angle-right" />
          </ButtonCardOption>


          <hr />
          
          <ButtonCardOption  onClick={() => router.push(ROUTENVX.settingsclub)}>
          <ul>
          <Stack direction="row" spacing={1}>
  
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
         </Stack>


          <li>
          <span>Clubvision</span>
          <p>Preferencias de escolhas para sua conta clubvision.</p>
          </li>
         
         </ul>
         <i className="fi fi-sr-angle-right" />
          </ButtonCardOption>

           <hr />
          
          <ButtonCardOption  onClick={() => router.push(ROUTENVX.settingsvision)}>
          <ul>
          <Stack direction="row" spacing={1}>
  
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
         </Stack>


          <li>
          <span>Thenovision</span>
          <p>Preferencias de escolhas para sua conta novision.</p>
          </li>
         
         </ul>
         <i className="fi fi-sr-angle-right" />
          </ButtonCardOption>
       
          <hr />
          
          <ButtonCardOption  onClick={() => router.push(ROUTENVX.settingsadditional)}>
          <ul>
          <Stack direction="row" spacing={1}>
  
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
         </Stack>


          <li>
          <span>Adicionais</span>
          <p>Preferencias & escolhas adicionais para sua conta.</p>
          </li>
         
         </ul>
         <i className="fi fi-sr-angle-right" />
          </ButtonCardOption>
 
     </ContainerCard>
       
    </VisualizationCard>

  
   
   </>
   )}



{settings == 5 && (
    <VisualizationCard>
    <ClubSettings onClose={() => router.back()} />
    </VisualizationCard>
   )}

   {settings == 3 && (
    <VisualizationCard>
    <VisionSettings onClose={() => router.back()} />
    </VisualizationCard>
   )}

   {settings == 4 && (
    <VisualizationCard>
     <AdditionalSettings onClose={() => router.back()}  />
    </VisualizationCard>
   )}

   {settings == 2 && (
    <VisualizationCard>
     <WalletSettings onClose={() => router.back()}  />
    </VisualizationCard>
   )}

   
 {showsession && (
  <>
     <DsiProlCn>
       
       <ul className="ulmargin2">
  <h2>Sessões novision</h2>
  <p>Suas sessões no thenovision são registradas aqui.</p>
 
    </ul>     
    </DsiProlCn> 

  <VisualizationCard>
 <Session_Nv />
  </VisualizationCard>
  </>
    
   )}
         
      
 

 
              </ContainercenterProfile>
              
           </BContainer>
           
       )}


       
       
     
      {showAccountRe && (
        <>
        {user && (
<AccountCentralMain 
                    id={user.id}
                    username={user.username}
                    avatar={user.avatar}
                    discordavatar={user.discordavatar} 
                    faixadiscord={user.banner}
                    child={
                      <AccountAcess />
  
                    }/>
        )}
        
        </>
      )}

    
      </MarginVXC>


       
  

      </MarginC>
          
     
        </>
   );
  }

AccountCentral.getLayout = function getLayout(page: ReactNode) {
      return <>{page}</>;
};
    
interface CustomContext {
  req: NextIronRequest & { session: Session };
}

export async function TheNoVisionRoute(
  ctx: CustomContext
) {
  const user: User | undefined = ctx.req.session.get("user");

  if (!user) {
    return {
      props: { user: null },
    };
  }

  return {
    props: {
      user: user || null,
    },
  };
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
            destination: '/home',
            permanent: false,
          },
        };
      }
  
      let logs: UserInfo[] = [];
    
      let logHistory: ModLog[] = [];
      let Permissions: Permission[] = [];
      if (user) {
        const userId = user.id;
        const guildId = '1175857498687807560';
        try {
          logs = await getUserInfo(guildId, userId);
       
          console.log('Logs retornados do MongoDB:', logs);
          logHistory = await getModLogs(guildId, userId);
          Permissions = await getPermission(guildId, userId);

          // Convert Date objects to string representations
          Permissions.forEach((permission) => {
            permission.created_at = permission.created_at.toString();
          });
        } catch (error) {
          console.error('Erro ao buscar os logs:', error);
        }
      }
  
      return {
        props: {
          user,
          logs,
          Permissions,
          logHistory,
        },
      };
    }
  );


  function renderTextWithLineBreaks(text: string): JSX.Element[] {
    return text.split('\n').map((line, index) => (
      <div key={index}>{line}</div>
    ));
  }
  
  const YourComponent: React.FC<{ text: string }> = ({ text }) => {
    const renderedText = renderTextWithLineBreaks(text);
    return (
      <div>
        {renderedText}
      </div>
    );
  };
  



  const ModalWarrap = styled.div`
     position: fixed;
     width: 100%;
     height: 100%;
     left: 0;
     right: 0;
     z-index: 999;
     top: 0;
     bottom: 0;
     display: flex;
     justify-content: center;
     place-items: center;
  `;
 
const Container = styled.div`
    
   position: relative;
  margin: 0 auto;
  width: 100%;
  min-height: 100%;
  margin-top: 0.3em;
  max-width: 1200px;
  border-radius: 12px;
 background-color: #38383b11;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #ffffff;
  animation: Opacity 1s linear;
  font-family: 'InterSemiBold', sans-serif;

  ul{
    background-color: #1d332850;
    padding: 0.9em;
    border-radius: 12px;
     margin: 0.9em;
    span{
       display: flex;
       flex-direction: column;
       gap: 8px;
      h6{
        font-family: 'InterSemiBold', monospace;
        color: #b6c0bb;
        font-size: 12px;
        font-weight: 100;
      }
      h4{
        font-family: 'InterSemiBold', monospace;
        font-size: 13px;
        color: #b8bcbe;
      }
    }
  }

  .nch{
    font-family: 'ProximaNova-Italic',sans-serif;
    font-size: 13px;
    color: #5d5f61;
  }


  .jfbutton{
    position: absolute;
    right: 4%;
    top: 2%;
    
    height: 35px;
    text-align: center;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    width: 35px;
    z-index: 8;
    i{
      font-size: 12px;
    }

    &:hover{
      background-color: #3a3d3b28;
    }
  }

  @keyframes Opacity {
    0% {opacity: 0}
    100% {opacity:1 }
  }

   
`

 
 const MarginC = styled.div `
 background: ${(props) => props.theme ? props.theme : 'linear-gradient(204deg, #4e504e73 -7%, #383a392c 33%), linear-gradient(162deg, #4e504e73 -10%, #2c88dd00 25%), linear-gradient(0deg, #1a1919, #080a09)'};
 width: 100%;
 
 display: flex;
 overflow: hidden;
 margin: 0  ;
flex-direction: column;
`;

  

 
/// MODAL ACCOUNT CENTER 

const Mafi = styled.div`
 display: flex;
 flex-direction: column;
 
 gap: 4px;
`;

const ViewInfo = styled.div`
 
  
   padding: 0.5em 0.7em 0.5em;
   cursor: var(--f-cursor-pointer);
   background-color: rgba(56, 56, 63, 0.055);
   border-radius: 11px;
   border: 2px solid #232525;
   gap: 12px;
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 100%;
   justify-content: center;
 
       
   section{
    display: flex; 
    padding-left: 1em;
    text-align: start;
    flex-direction: column;
   }
    

     .logos{
      border-radius: 100px;
     }

 
    h3{
      font-family: 'InterSemiBold';
      font-size: 16px;
      background: linear-gradient(47deg, #888384 0%, rgb(73, 77, 74) 1%, #c9c0c1 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    }

    p{
      font-size: 10px;
      color: #868c91;
      margin-bottom: 0.3em;
      max-width: 330px;
    }

    &:hover{
      border: 2px solid #737777;
    }

`;

 
 
const TopLogo = styled.div<{theme: string}>`
  width: 100%;
 display: flex;
align-items: center;
justify-content: space-between;
 padding: 0.4em;
 border-bottom: 2px solid ${(props) => getBorderColorFromTheme(props.theme)};

  
 .jscb{
   width: 100%;
 display: flex;
 flex-direction: column;
 justify-content: left;
 }
 button{
   color: #6d6d7276;  
   transition: 1s all;
   
   
    i{
      font-size: 14px;
    }
    
  &:hover{
    i{
      color: white;
    }
  }
  }


  p{
    font-family: 'ProximaNova-Italic', sans-serif;
    font-size: 12px;
    color: #d5d5dadc;
  }

  .dhjdsf{
     color: #ececf0dc;
  }
  @media screen and (max-width: 768px) {
     display: flex;
     z-index: 99;
     padding: 3em 1em 0.4em;
     margin-bottom: 0;
     border-bottom: 2px solid rgba(69, 71, 73, 0.11);
     justify-content: space-between;
  }
`;

const MarginVXC = styled.div`
   position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: top;
 
 
  @media screen  and (max-width: 730px) {
     height: 95vh;
  }
`;
 
const BContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: top;
  width: 60%;
  height: 90vh;
  overflow-y: auto ;
  
    
  @media screen and (max-width: 730px) {
    margin: 0em;
    width: 100%;
    height: 100%;
  }
`;

interface ViewHeaderProps {
  bannerUrl: string;
}
   

const DsiProlCn = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
 
 .ulmargin2{
  display: flex;  
  flex-direction: column;
  justify-content: start;
  width: 100%;
  gap: 12px;
  margin-bottom: 5%;
 

  p{
    font-size: 13px;
    max-width: 560px;
    font-family: 'Inter', sans-serif;
    color: rgba(124, 130, 138, 0.4);
  }
    h2{
      font-family: 'InterSemiBold';
      font-size: 18px;
      color: #cacfcd;
    }
 }

   @media screen and (max-width: 730px) {
    margin: 0.9em;

 
  }
`;
const Containercenter = styled.div`
   display: flex;
   flex-direction: column;
  margin: 0.5em;
  animation: Createan 1s;

  @keyframes Createan {
     0%{ opacity: 0;}
     100%{ opacity: 1;}
  }

  @media screen and (max-width: 680px) {
 margin: 0;
 }

`;

const ContainercenterProfile = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
    
  width: 100vw;
 
  margin: 1em;
 
  animation: Createan 1s;
 
  ::-webkit-scrollbar {
    display: none;
  }

  ::selection {
    display: none;
  }

 
  @keyframes Createan {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @media screen and (max-width: 730px) {
    margin: 0em;

    padding: 0 0.8em 4em;
  }
`;



/// dashboard historico 
 

const Description = styled.div`
  
  text-align: center;
  padding: 2px 19px 2px;
  border-radius: 2px;

  span{
   font-size: 9px;
   color: #8c8799b3;
   margin: 0.3em;
  }

  hr{
    width: 100%;
    border-color: #1c1d1f15;
    margin-bottom: 1em;
  }

  .logsdescription{
   font-size: 11px;
   color: #afb0b4b5;
   max-width: 344px;
   text-align: left;
  }
 
`;

const ContentListed = styled.ul`
   
   text-align: center;
   display: flex;
   flex-direction: column;
   place-items: center;
   justify-content: center;
   height: 50vh;
   width: 100%;
   
   i{
    font-size: 34px;
   }

   h2{
    margin: 0.6em;
    font-family: 'Inter', monospace;
    font-weight: 300;
   }

   span{
    max-width: 300px;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    color: #a0a4ac9e;
   }

`;
 
const Content = styled.div`
  border: 2px solid rgba(38, 38, 39, 0.562);
  background-repeat: no-repeat;
  padding: 0.8em;
  border-radius: 9px;
  margin: 0.3em;
  background: rgba(12, 11, 11, 0.185);

  .logsDate{
  font-size: 9px;
  color: #ffffff4e;
  margin: 1em;
  }

`;

const ContainerDisç = styled.div`
   display: flex;
   flex-direction: row;
   flex-flow: row;
   flex-wrap: wrap;
   place-items: center;
   height: 100%;
   width: 100%;
   
`;
const Contextcard = styled.ul`
  margin-bottom: 0.8em;
  h2{
    margin-bottom: 0.9em;
   }

  .logo{
    border-radius: 70%;
    margin-bottom: 1em;
  }

  span{
   font-size: 10px;
   color: #e7e8e98b;
   margin: 0.3em;
  }

  p{
   font-size: 11px;
   color: #bdbfc252;
   text-align: left;
  }
  

  i{
    color: #54555a7d;
    font-size: 10px;
  }
  li{
   display: flex;
   flex-direction: row;
   flex-wrap: wrap;
   align-items: center;
  }

`;
  

 

/// DASHBOARD STYLE ALLOLD



const Accountinfo = styled.section`
    
    display: flex;
    flex-direction: column;
   
    

   h5{
    color: #5c5d70b5;
   }

`;





const ContentUser = styled.div`
     
     padding: 1em 1em 1em; 
     display: flex;
     align-items: top;
     flex-direction: column;
     justify-content: left;

     h1{
        font-size: 29px;
     }

     p{
        max-width: 540px;
        font-size: 15px;
        color: #e9e7e7;
        font-family: 'Roboto', sans-serif;
     }

   .logoview{
    margin-top: -6em;
    border-radius: 79px;
    max-height: 129px;
    cursor: pointer;
    margin-bottom: 2em;
    max-width: 130px;
    border: 5px solid  #e1e2e736;;
   }

   .logoview4{
    margin-top: -4em;
    border-radius: 79px;
    max-height: 129px;
    margin-bottom: 2em;
    max-width: 130px;
    border: 5px solid  #e1e2e736;;
   }
`; 


const ContainerRight = styled.section`
  
  padding: 0em 1em 0em;
`;
 



const InfoAccountLink = styled.div`
   
   border: 2px dashed rgba(60, 60, 63, 0.137);
   margin: 1%;
   padding: 0.8em 1em 0.8em;
   border-radius: 9px;

   display: flex;
    align-items: center;
    justify-content: space-between;

   li{
    display: flex;
    align-items: center;

    p{
      font-family: 'Graffiti';
      color: #f1242f;
    }

    h5{
      margin: 0.4em;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      color: #69676e;
    }
   }
`;

const ButtonClickSave = styled.button`
   
   background-color: rgba(50, 50, 53, 0.205);
   padding: 9px;
   border-radius: 12px;
`;


 
const TextTitleBIO = styled.h5`
 

  font-size: 14px;
  color: rgba(255, 255, 255, 0.643);
  margin-bottom: 0.7em;
  font-family: 'Poppins', Courier, monospace;
  word-wrap: break-word;
 
`;

// STYLED 


const ModalWrapperEdited = styled.div`
    
  z-index: 12;
  animation: Rigf 0.9s linear;
 

 @keyframes Rigf {
   0%{ opacity: 0.4;}
   100%{ opacity: 1;}
 }
`;



const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  backdrop-filter: blur(19px);
  width: 100%;
  height: 100%;
  z-index: 982999;
  background-color: rgba(0, 0, 0, 0.274);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: scroll;
 transition: opacity 1s ease-in-out;
  animation: CardNotifyx 0.7s linear;

@keyframes CardNotifyx {
 0%{  opacity: 0;}
 100%{opacity: 1;}
}
`;


const Contenttext = styled.ul`
    max-width: 955px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    h1{
       color: #a9abb4ae;
       font-size: 24px;
    }
   .jdsjf{
    color: #a9abb4ae;
       font-size: 18px;
   }
    p{
      margin: 2em;
      text-align: center;
      font-size: 13px;
      color: #7b7f839b;
      max-width: 466px;
    }
 
`;


const ButtonClose = styled.button`
   
  border: 1px solid #9e949468;
  background-color: rgba(247, 40, 40, 0.13);
  padding: 1.3em 4em 1.3em;
  border-radius: 100px;
  color: #9e9494;
  margin: 0.8em;
  margin-bottom: 0.2em;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;

  :hover{
    position: relative;
    top: -2px;
    transition: 2s all;
    background: rgba(99, 99, 105, 0.041);
  }
`;


const CardProfile = styled.div`
background: linear-gradient(90deg, rgba(1,1,1,1) 1%, rgba(0,0,0,1) 49%, rgba(2,5,3,1) 100%);

   background-size: cover;
   background-position-x: 44%;
   padding: 2em 1em 2em;
   border-radius: 22px;
 
   float: right;

`;

const CardProfile3 = styled.div`
    
    width: 100%;
   padding: 2em 1em 2em;
 
   `;

const CardInButton = styled.div`
   
   display: flex;
   flex-direction: column;
   justify-content: center;
   
   p{
    color: #6b6b6dd7;
    font-size: 10px;
   }
`;

const UserPo = styled.ul`
   
   li{
    color: #80818d;
    display: flex;
    align-items: center;
  
   } 
   
   .buttonuser{
   margin-left: -0.9em;
   text-align: right;
   padding: 0.6em 0.8em 0.3em;
   border: 1px solid rgba(255, 255, 255, 0.322);

   i{
    color: #080808;
   }

   :hover{
    border-radius: 15px;
    background-color: rgba(8, 8, 14, 0.185);
   }
   } 

   .color4{
    color: #42424442;
   }

   span{
    margin: 1em;
    background-color: #21212428;
    padding: 0.2em 1em 0.3em;
    border-radius: 8px;
    font-size: 12px;
    max-width: 466px;
    color: #646568e4;
    text-align: center;
   }
    
   i{
      font-size: 21px;
    }
  
   .logoavatar{
    border-radius: 20%;
    margin: 0.8em;
   }

 
`;

const ButtonUser = styled.button`
  
  border: 1px solid #9e949468;
  padding: 1.3em 4em 1.3em;
  border-radius: 100px;
  color: #9e9494;
  margin: 0.8em;
  margin-bottom: 0.2em;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;

  :hover{
    position: relative;
    top: -2px;
    transition: 2s all;
    background: rgba(99, 99, 105, 0.041);
  }
`;


 

const CardVerified = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
     
    h1{
      font-family: 'InterSemiBold', monospace;
    }
    .icon{
      border-radius: 50%;
      margin: 0.2em; 
    }

  
     
`;
 

 
const Bloy = styled.form`
 
`;
 
 const Button = styled.div`
   
   background-color: transparent;
   padding: 4px 12px 4px;
   border-radius: 33px;
   font-size: 12px;
   margin: 0.4em;
    
   cursor: pointer;
    max-width: 155px;
   border: 1px solid rgb(76, 77, 80);
   font-family: 'Poppins', sans-serif;
   color: #afafb3;
    transition: 1s all;
   :hover{
    position: relative;
    top: -1px;
    border: 1px solid rgb(76, 77, 80);
    background: none;
    color: #3d3e42;
   }
 `;

const ContentAS = styled.div`
  display: flex;
  flex-direction: column;
  text-align: start;
  justify-content: start; 
  margin-bottom: 1em;
  
  ul{
     display: flex;
     flex-direction: row;
     align-items: center;
     justify-content: space-between;
  }

  h2{
    font-size: 29px;
    margin-top: 0.9em;
    margin-bottom: 0.5em;
    color: #f5f5faa6;
    text-align: center;
  }

  p{
    font-size: 9px;
    max-width: 535px;
    color: #fdfdff5a;
    text-align: center;
    margin-bottom: 1em;
  }

  a{
    color: #16f76c;
  }
  
  label{
  width: 100%;
  height: 3.4em;
  padding: 0.8em 1em 0.8em;
  border-radius: 9px;
  font-size: 16px;
  background-color: rgba(13, 19, 14, 0.123);
  border: 2px solid rgba(38, 38, 41, 0.247);
  color: #9293a0;
  font-family: 'Poppins', Courier, monospace;
  margin-top: 0.8em;

    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;


    i{
        color: #303033;
        font-size: 23px;
        margin-top: 0.2em;
    }
  }
`;
 
const ContainerSDis = styled.section`
   display: flex;
   flex-direction: column;
   flex-wrap: wrap; 
   justify-content: start;
  
   
`;

const ButtonRegister2 = styled.button`
  
  background-color: rgba(255, 255, 255, 0.822);
  padding: 0.5em 1em 0.5em;
  border: 2px solid transparent;
  border-radius: 32px;
  transition: 1s all;
  font-family: 'Poppins', sans-serif;
  color: #151615;
  margin: 0.3em;
  
  .color33{
    font-size: 19px;
    color: #24f78d;

    &:hover{
    background: transparent;
    color: #a5a5ad;
  }

   }
  
   &:hover{
    color: #b3b5bd50;
    background-color: transparent ;
     border: 2px solid rgba(255, 255, 255, 0.116);
   }
 
`;

const ButtonRegister = styled.button`
  

  transition: 1s all;
  font-family: 'Poppins', sans-serif;
  color: #3c423f;
  
  border-radius: 32px;
  
  i{
    font-size: 17px;
  }
  
  &:hover{
    background: transparent;
   color: #a5a5ad;
  }
  @media screen and (max-width: 566px) {
    padding: 1em 2em 1em;
  }
`;
 
const InputList3 = styled.textarea`
   background-color: rgba(8, 8, 8, 0.541);
   margin: 0.8em;
  min-width: 97%;
  max-width: 97%;
  min-height: 15em;
  max-height: 15em;
  padding: 8px;
  font-size: 13px;
  border: 1px solid transparent;
  border-radius: 9px;
  color: #a5a5ad;
  padding: 0.6em 1em 0.6em;
  font-family: 'Poppins', Courier, monospace;
  resize: none;
   
  :focus{
    outline: none;
  }

  ::placeholder {
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #a5a5ad;
  }
`;
const InputList2 = styled.input`
  
  background-color: transparent;
  height: 3em;
  font-size: 16px;
  border: none;
  color: #a5a5ad;
  padding: 1.5em 1em 1.5em;
  
  font-family: 'Poppins', Courier, monospace;
 
  :focus{
    outline: none;
  }

  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #a5a5ad;
  }
  
  :focus {
  border: none;
  box-shadow: none; 
  outline: none;
}
  :-webkit-autofill,
  :-webkit-autofill:hover, 
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover
  :-webkit-autofill:focus,
  :-webkit-autofill,
   :-webkit-autofill:hover,
   :-webkit-autofill:focus {
  -webkit-text-fill-color: #a5a5ad !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: pointer;
}

`;
 
const Li = styled.li`
   display: flex;
   flex-direction: column;
`;
 
const InputCardN = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(76, 78, 90, 0.034);
  padding: 0em 0.4em 0.5em;
  border-radius: 9px;

`;

const AboutUserInfo = styled.section`
   
   display: flex; 
   flex-direction: column;
   align-items: center;
   justify-content: center;

    .ocos{
    transform: rotate(-41deg) ;
   }

   i{
    margin-left: 0.5em;
   }
   li{
   
    text-align: center;

    h3{
      font-family: 'Inter', sans-serif;
      font-size: 23px;
    }
   }

   hr{
    width: 100%;
    margin-top: 2em;
    margin-bottom: 2em;
   }
   
   p{
    font-size: 13px;
   }
   @media screen and (max-width: 430px) {
    display: flex;
    flex-direction: column;
    margin: 0;
   }
   `;
 

//// PROFILE ALTERED VIEW 
 
 
 
 
const Buttonsecletr = styled.button`
   
   border: 2px solid rgba(22, 22, 24, 0.644);
   color: #b9b9b960;
   font-family: 'Poppins', sans-serif;
   font-size: 13px;
   padding: 0.8em 1em 0.8em;
   display: flex;
   align-items: center;
   border-radius: 62px;
   margin: 0.4em;
    transition: 1s all;
 
    :hover{
      background:none;
      border: 2px solid rgba(255, 255, 255, 0.11);
      color: rgba(234, 235, 240, 0.712);
    }
`;

  
const ContainerMND = styled.div`
  
background-color: rgba(34, 35, 37, 0.075);

margin-top: 0;
border-radius: 22px;
padding: 0.3em 1em 0.3em;

display: flex;
flex-direction: column;

 

hr{
  width: 100%;
  border-color: #101110;
  margin: 0.4em;
}

  
   span{
     margin-left: 12px;
     font-family: 'Yantramanav', sans-serif;
     color: #cfc9c9b9;
   }
  p{
    font-size: 12px;
    color: #b6afaf75;
  }


    .navbar-active{
    background-color: rgba(165, 170, 180, 0.144);
    border-radius: 56px;
    transition: all 0.2s;
     
     }
  

`;
 
const ViewOptions = styled.div<{ theme: string }>`
 
  padding: 1em 1em 0 ;
 /* border-right: 2px solid ${(props) => getBorderColorFromTheme(props.theme)}; */
 height: 90vh;
  width: 20vw;
 overflow-y: auto ;
    
   .ocos{
    transform: rotate(-41deg) ;
   }
  hr{
    width: 100%;
     border-color: #181717ae;
    margin-bottom: 1em;
  }
  h5{
      font-family: 'InterSemiBold', monospace;
    text-align: left;
    color: #696e6d;
    font-size: 15px;
    margin: 0.5em;
  }
 
 
  p{
    font-family: 'ProximaNova-Italic', sans-serif;
    font-size: 12px;
    color: #d5d5dadc;
  }
  
   .sdli{
    margin-bottom: 1em;
   }
  .navbartive{
    
    h4,svg{
      color: #3bb168;
    }
  } 

  h4{
    font-family: 'InterSemiBold', monospace;
    font-size: 14px;
    margin: 0.4em;
  }

  @media screen and (max-width: 430px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: transparent;
    
  }

   @media screen and (max-width: 680px) {
      padding: 12px;
    } 
`;


export const VisualizationCard = styled.div`
  border: 2px solid rgba(32, 34, 33, 0.774);
  padding: 9px;
  border-radius: 15px;
  width: 100%;
 
  
  hr{
    width: 100%;
    border-color: rgba(53, 56, 63, 0.418) ;
  }

   
  &:last-child {
    margin-bottom: 0;
  }

  @media screen and (max-width: 730px) {
    width: 100%;
    margin-bottom: 2em;
     
    border-radius: 0;

 
    background-color: transparent;
  } 
`;

const ButtonClickOptions = styled.button`
   display: flex;
   align-items: center;
   font-family: 'InterSemiBold', monospace;
   font-size: 14px;
   width: 100%;
    
   padding: 0.3em 1em 0.3em;
   border-radius: 9px;
   font-weight: 100;
  
   transition: 0.2s all;
   margin: 0.4em;
   gap: 4px;
   border-left: transparent;
   i{
   
  
      transition: 1s all;
      color: #9999a1;
    font-size: 19px;
    margin-top: 0.5em;
 
   }

   &:hover{
    
   
    h4,svg{
      color: #5e6360;
    }
   }

   svg{
    background-color: #2c2e2d61;
    padding: 7px;
    border-radius: 50%;
    height: 35px;
    width: 35px;
    color: #dce0e0;
   }

   h4{
    font-weight: 300;
    color: #dce0e0;
    font-size: 0.8375rem;
   }

   ul{
    display: flex;
    align-items: center;
   }

   section{
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
   }

   img{
     filter: saturate(0);
   }
`;


const ButtonClick = styled.button`
   display: flex;
   align-items: center;
   
   font-family: 'Poppins', monospace;
   font-size: 14px;
  
   font-weight: 100;
 
   transition: 0.7s all;

   i{
    margin: 0.4em;
    margin-top: 0;
    margin-bottom: 0;
   
      transition: 1s all;
      color: #9999a1;
        font-size: 19px;
        background-color: rgba(177, 27, 39, 0.863);
        border-radius: 9px;
        height: 35px;
        width: 35px;
        padding: 0.2em 0.1em 0.2em;

   }

   &:hover{
    
    i{
      color: rgb(123, 124, 134);
    }
   }

  
   
 
`;



const TabList = styled.div`
  display: inline-flex;
  gap: 24px;
  border-bottom: 1px solid #333;
  margin-bottom: 24px;
 
  width: 590px;
`

const Tab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.active ? "#3fc561" : "#666")};
  font-size: 14px;
  padding: 1em;
  cursor: pointer;
  font-family: 'InterSemiBold', monospace;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${(props) => (props.active ? "#3fc561" : "transparent")};
  }
  
  &:hover {
    color: ${(props) => (props.active ? "#3fc561" : "#999")};
  }
`

const Buttornlcf = styled.button`
display: flex;
   align-items: center;
   font-family: 'Poppins', monospace;
   font-size: 14px;

   position: absolute;
   top: 1;
   right: 12px;
float: right;
 
 
   font-weight: 100;
 
   transition: 0.7s all;

   i{
    margin: 0.4em;
    margin-top: 0;
    margin-bottom: 0;
   
      transition: 1s all;
      color: #9999a1;
        font-size: 19px;
        background-color: rgba(98, 98, 104, 0.068);
        border-radius: 9px;
        height: 35px;
        width: 35px;
        padding: 0.3em 0.1em 0.2em;

   }
 
`;
 
const AboutImageBanner = styled.div`

  .aboutimagebanner{
    margin: 0.3em;
    border-radius: 22px;
  }


  li{
    display: flex;
    flex-direction: column;

    h3{
      font-size: 13px;
     }

     p{
       font-size: 11px;
       color: #8f979ea0;
       font-family: 'Inter', sans-serif;
     }
  }
`;




/// CONFIGURATION MODAL OPEN INVITE

const InputList = styled.input`
  
  background-color: transparent;
  width: 100%;
  height: 3em;
  padding: 8px;
  font-size: 16px;
  border: none;
  color: #9293a0;
  padding: 1.8em 1em 1.5em;
  margin-bottom: 0.2em;
  font-family: 'Poppins', Courier, monospace;
  margin-bottom: 0.6em;
   
  :focus{
    outline: none;
  }

  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #9c9ca7;
  }
  
  :focus {
  border: none;
  box-shadow: none; 
  outline: none;
}
  :-webkit-autofill,
  :-webkit-autofill:hover, 
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover
  :-webkit-autofill:focus,
  :-webkit-autofill,
   :-webkit-autofill:hover,
   :-webkit-autofill:focus {
  -webkit-text-fill-color: #9e9ea0 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: pointer;
}

`;


const CardInfoowner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  background-color: rgba(185, 185, 192, 0.055);
  border-radius: 19px;
   padding: 0.4em 1em 0.4em;
   margin: 1em;
    margin-bottom: 0em;
  .logo{
    border-radius: 16px;
  }

  li{
    display: flex;
    flex-direction: column;
    padding-left: 0.3em;
   
    h5{
      margin-bottom: 0.2em;
    }

    p{
      font-size: 14px;
    }
  }

  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-in-out forwards;
  @keyframes fadeInUp {
    0%{ opacity: 0; transform: translateX(20%)}
    100%{ opacity: 1; transform: translateX(0)}
  }
  
`;

/// ACCOUNT EXTRACTION ABOUT 
 

const CardViewInExtraction = styled.div`
 
  border-radius: 23px;
  background-color: rgba(17, 17, 19, 0.377);
  padding: 1em;
  border: 3px solid rgba(255, 255, 255, 0.021);
 
 width: 100%;
 
  

   &.click{
    cursor: pointer;
   
   }

   &:hover{
     background-color: rgba(33, 34, 36, 0.164);
   }
 `;

 
 

 
 

const CardsIcons = styled.div`
   margin: 1em;
   display: flex;
   flex-direction: row;
   flex-wrap: wrap;
   background-color: rgba(209, 209, 214, 0.021);
   padding: 1em;
   border-radius: 21px;

  .logorotate{
    border-radius: 100%;
     margin: 0.4em;
  }

`;
const Title = styled.ul`
 margin: 0.8em;
 text-align: left;
 display: flex;
 align-items: center;
 justify-content: space-between;
 
  i{
    color: #db3131;
    
  }
  
  h3{
  font-family: "Poppins", monospace;
  font-weight: 500;
  color: #c8c8cc;
  padding-left: 0.2em;
  margin-top: -0.2em;
  }


  li{
    display: flex;
    align-items: center;
  }
`;
const ContainerTheme = styled.div`
  display: flex;
  flex-direction: column;
    
  
  .thenovisioncard{
    margin-left: 14%;
    width: 70%;
    height:  190px;
    border-radius: 29px;
    display: flex;
    align-items: center;
  }
`;


const Cards = styled.div`
   margin: 0.7em;
   background-color: rgba(240, 248, 255, 0.034);
   padding: 0.9em 0.8em 0.9em;
   border-radius: 19px;
   border: 2px solid transparent ; 
   transition: 0.5s all;

  .darktheme{
    border-radius: 9px;
    width: 200px;
    height: 130px;
  }


  ul{
    margin: 0.8em;
  }

  h4{
    font-size: 14px;
    font-family: "Inter", monospace;
    font-weight: 300;
    color: #a1a2a5;
  }
`;

/////


const CardViewList = styled.div`
  
  background-color: rgba(209, 209, 214, 0.021);
  padding: 1em;
  border-radius: 12px;
  width: 100%;
  margin: 0.8em;
  margin-left: 0;
  margin-bottom: 2em;
  overflow-x: auto;
  cursor: grab;
 

 :active {
  cursor: grabbing;
 }


@media screen and (max-width: 970px){
  width: 30em;
  margin-left: -2em;
  }
`;


const ContentList = styled.section`

  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  
  button{
    border: 2px solid transparent;
    transition: 0.8s all;
  }

  button.active {
  border: 2px solid rgba(255, 255, 255, 0.096); 
  border-radius: 28px; 
}

.active{
     border: 2px solid rgba(255, 255, 255, 0.096); 
  border-radius: 28px; 
   }

`;


//// ACCOUNTEDIT

const FormContainer = styled.section`
 
  padding: 0em 1em 0em;
  
 display: flex;
 flex-direction: column;
 
  h5{ 
    margin: 1em;
    margin-bottom: 0.4em;
    color: #47484b;
 }
 

`;


const ViewRightInfo = styled.div`
  
    h3{
      font-family: 'Europa Grotesk';
      font-size: 25px;
        
      background: linear-gradient(47deg, #888384 0%, rgb(73, 77, 74) 1%, #c9c0c1 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    }

    p{
      font-size: 11px;
      color: #868c91;
      margin-bottom: 0.3em;
      max-width: 730px;
    }

`;


const CardInfouserI = styled.div`
    
   text-align: start;
   display: flex; 
   justify-content: center;
   flex-direction: column;
 
   ul{
    margin: 0.5em;
    text-align: left;

    .clvc2{
      background: linear-gradient(126deg, #00000024 0%, rgba(1, 1, 4, 0.096) 47%, rgba(255,243,243,0.04245448179271705) 100%);
      margin-bottom: 0;
      padding: 0.7em;
      border-radius: 22px 22px 0px 0px; 
      color: #dbdde0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      i{
        font-size: 18px;
        color: rgba(255, 243, 243, 0.295);
      }
    }
   }

   .clvc{
      background: linear-gradient(126deg, #00000024 0%, rgba(1, 1, 4, 0.096) 47%, rgba(255,243,243,0.04245448179271705) 100%);
     width: 100%;
     padding: 0.7em 1em 0.7em;
    border-radius: 0px 0px 22px 22px;
    display: flex;
      justify-content: space-between;
      align-items: center;

      i{
        font-size: 18px;
        color: rgba(255, 243, 243, 0.295);
      }
    }

  .logor{
    border-radius: 100px;
    border: 4px solid rgb(43, 31, 31);
   
  }
`;


const AboutLista = styled.div`
 
  margin-bottom: 3em;
  display: flex; 
  align-items: center; 
  justify-content: space-between;


`;

 

const ModalWrapper3 = styled.div`
 position: fixed;
  top: 0;
  left: 0;
  bottom: 1;
  z-index: 29084;
  place-items: center;
  justify-content: center;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: black;
  
  ul{
    p{
     font-size: 25px;
     color: #434449;
     font-family: 'Inter', monospace;
    }

    h2{
      font-family: 'Europa Grotesk', monospace;
      font-size: 35px;
      background:  linear-gradient(47deg, #e4d4d7 0%, #434449 1%, #b6b7c4 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    }
  }

`;

interface ThemeuserS{
  Theme: string;
}

const ThemeUser = styled.div<ThemeuserS>` 
  background-image: ${({ Theme }) => `${Theme}`};
  border-radius: 9px;
  padding: 0.4em 0.3em 0.4em;
`;



const MarginClickS = styled.div`
  transition: all 0.5s;
  cursor: pointer;

  i{
    font-size: 15px;
    color: #babdc0;
  }

  &:hover{
    background-color: rgba(24, 24, 26, 0.096);
  }


`;


const OPSC = styled.div`
height: 100%;
width: 100%;
display: flex;
justify-content: center;
align-items: center;
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
z-index: 11232;
`;


//////////////////////////////////////////////



const ContainerCard = styled.div`
  background-color: #38383b11;
  width: 100%;
  border-radius: 9px;
  overflow: hidden;
  hr{
    border-color: 1px solid rgba(189, 189, 199, 0.308);
  }

  .iconIO{
    font-size: 28px;
  }
`;

const ButtonCardOption = styled.button`
  padding: 0.7em 1em 0.7em;
  display: flex;
  overflow: hidden;
  width: 100%;
  flex-direction: row;
  font-family: 'Inter', sans-serif;
  justify-content: space-between;
  align-items: center;

  &:hover{
    background-color: rgba(239, 237, 250, 0.021);
  }

  svg{
    stroke: #83838d;
  }
  
  ul{
    display: inline-flex;
    padding: 0.4em 1em 0.4em;
  }

  .ild{
    display: inline-flex;
  }

  li{
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-left: 0.9em;
    

    span{
      font-size: 14px;
      font-family: 'Inter', sans-serif;
    }

    p{
      color: #7a7b83;
      font-size: 12px;
      font-family: 'ProximaNova-Italic', sans-serif;
    }
  }


  .logo{
    border-radius: 70%;
  }

    @media screen and (max-width: 680px) {
    text-align: start;
    margin: 0;
   }
`;


const ButtonCardOptionx = styled.button`
  padding: 0.7em 1em 0.7em;
  border-radius: 12px;
  display: flex;
  background-color: rgba(59, 63, 61, 0.425);
  width: 100%;
 
  flex-direction: row;
  font-family: 'Inter', sans-serif;
  justify-content: space-between;
  align-items: center;
   

  i{
    font-size: 13px;
    color: #83838d;
  }
  
  ul{
    display: inline-flex;
    align-items: center;
    gap: 12px;
 
  }

  .ild{
    display: inline-flex;
  }

  li{
    display: flex;
    flex-direction: column;
    align-items: start;
    
    

    span{
      font-size: 14px;
      font-family: 'Inter', sans-serif;
    }

    p{
      color: #7a7b83;
      font-size: 12px;
      width: 100%;
      font-family: 'Inter', sans-serif;
    }
  }


  .logo{
    border-radius: 70%;
  }

    @media screen and (max-width: 430px) {
    
    margin: 0;
   }
`;
 

 

/////////////////////////

const CardConnections = styled.div`

border-radius: 23px;
  background-color: rgba(236, 236, 248, 0.027);
  padding: 1em;
  border: 3px solid rgba(2, 2, 2, 0.021);
  margin: 1em;
  width: 220px;
  height: 220px;

   &.click{
    cursor: pointer;
   
   }

   &:hover{
     background-color: rgba(33, 34, 36, 0.164);
   }
`;



const Contentconnections = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
 
     span{
      display: flex;
      align-items: center;
      flex-direction: row;
     

      h5{
        padding-left: 0.4em;
      
        color: #7b807d;
      }
     }
   ul{
    

    .sub{
      color: #515158;
      font-size: 12px;
      max-width: 350px;
      font-family: 'Inter', sans-serif;
    }
   }

   i{
    color: #29c46c;
    font-size: 19px;
   }

   .red{
    color: rgb(236, 20, 56);
   }
`;

 


const HovercardContainer = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   align-items: center;

   li{
    margin: 0.8em;
   }

`; 
 
const CardModal = styled.div`
     display: flex;
     flex-direction: row;
     align-items: center;
     justify-content: space-evenly;

     ul{
        
       h2{
      color: #ffffff75;
      margin-bottom: 1em;
      text-align: center;
      font-size: 12px;
     }
  
     p{
      color: #87868d81;
      max-width: 290px;
      font-size: 10px;
     }
  
     a{
      color: #ff1139;
     }
     }
  
     i{
      text-align: center;
      font-size: 59px;
     }
  
     li{
      display: flex;
      align-items: center;
      margin-right: 0.6em;
     }
  
    @media screen and (max-width: 300px){
      display: flex;
      flex-direction: column;      
    }
  `;

const ButtonCl3 = styled.button`
  background: linear-gradient(129deg, rgba(50,198,52,1) 0%, rgba(89,34,209,1) 52%, rgba(242,15,23,1) 100%);
   border-radius: 0 0 8px 8px ;
   margin-bottom: 1em;
   width: 100%;
   color: #020202;
   padding: 3px 12px 3px; 
   font-family: 'Poppins', sans-serif;
   font-size: 12px;
   transition: 0.3s all;

   :hover{
    background: none;
    color: #f52626;
   }

   @media screen and (max-width: 300px) {
     max-width: 247px;
    }
`;


const ModalOpenCardBZ = styled.div`
 
  display: flex;
  justify-content: center;

  li{
  display: flex;
  align-items: center;
  }

  .navbar-active{
   background-color: rgba(125, 125, 128, 0.171);

    i{
      color: rgb(78, 82, 79);
    }
  }

  @media screen and (max-width: 300px){
      margin-left: -5em;
  }
`;

const ButtonClickM = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  background-color: rgba(33, 33, 34, 0.192);
  padding: 0.4em 1em 0.4em;
  border-radius: 22px;
  margin: 0.4em;
  transition: all 0.4s;
 
  i{
    font-size: 16px;
    margin: 0.3em;
  }

  .Youtube{ 
    color: #fc1f1f;
  }

 
  .history{
    color: #a08451;
  }

  .FriendsM{
    color: #5ef55e;
  }

  .BadgesObs{
    color: #ffe240;
  }
  h3{
    font-family: 'Poppins', sans-serif;
    color: #c6c9cc;
    font-size: 14px;
  }
`;  


const CardBadges = styled.div`
display: flex;
flex-direction: row;
align-items: center;
background-color: rgba(32, 32, 32, 0.068);
padding: 0em 0.3em 0em;
border-radius: 29px;
margin: 0.3em;
`;


//// scroll 

 

const ModalO = styled.div`
  position: fixed;
  z-index: 1999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.692);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
 
const ContainerButtonsOpen = styled.div`
 position: absolute;
  top: 0.5em;
  right: 0.5em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 1em;
  padding: 1em;
  border-radius: 5px;
  background-color: rgba(9, 9, 10, 0.021);
  color: #68686b24;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  text-align: center;


   .navbar-active{
   background-color: rgba(125, 125, 128, 0.171);

    i{
      color: rgb(78, 82, 79);
    }
  }

`;





























































/////////////////////////////////////////////////////////////

 

const Cmas = styled.div` 
  display: none;
  position: absolute;
  bottom: 1%;
  width: 100%; 
  padding: 0.4em 1em 0.4em;
     

  @media screen and (max-width: 490px) {
     display: block flex;
     align-items: center;
     justify-content: center;
     align-items: center;

     li{
      margin: 0.4em;
     }
     
  }
`;
  
const CardViewListMobile = styled.div`

width: 100%;
 
margin-left: 0;
overflow-x: auto;
cursor:  var(--f-cursor-grab);

:active {
cursor:  var(--f-cursor-grabbed);
}


 
@media screen and (max-width: 460px){
  
 width: 111%;
 padding: 0 1em 0;

 ::-webkit-scrollbar {
     display: none;
  }

 ::selection{
  display: none;
 }

}


`;


const ContentListMobile = styled.section`

 ul{
  display: inline-flex;
 
 }
`;
 
const CardvIEWiNFO2m = styled.div`
   
   background-color: rgba(85, 85, 92, 0.094);
   border-radius: 22px;
   padding: 0 0 1em;
   width: 100%;
    

    @media screen and (max-width: 430px) {
      width: 100%;
      margin-left: 0%;
      padding: 0;
 }
`;


const ImageBorderIcon = styled.div`
    margin-bottom: 0.5em;
    .logoactive{
    border: 4px solid rgb(40, 201, 88);
    border-radius: 50%;
  }

  .logoMas{
    border-radius: 50%;
  }

 
`;

const ContentExtraction = styled.div`
    display: flex;
    flex-direction: row;
    text-align: left;
    align-items: start;
    gap: 12px;
 
 li{
    display: flex;
     flex-direction: column;
  gap: 8px;
 }
     .span{
      display: flex;
      align-items: center;
      flex-direction: row;
      gap: 7px;
      background-color: #28292881;
      padding: 0.2em 0.3em 0.2em;
      border-radius: 22px;

      h5{
        font-size: 12px;
        font-family: 'InterSemiBold', monospace;
        color: #7b807d;
      }
     }
   .ul{
     display: flex;
     flex-direction: column;
      
    
     
    .sub{
      color: #515158;
      font-size: 12px;
      max-width: 350px;
      font-family: 'Inter', sans-serif;
    }
   }

   i{
    color: #29c46c;
    font-size: 12px;
   }

   .red{
    color: rgb(92, 92, 100);
   }
`;


   


const MarginConnected = styled.div`
   display: inline-flex;
   align-items: center;
   justify-content: center;
   margin-bottom: 1em;
   
   span{
    display: inline-flex;
   align-items: center;
   background-color: rgba(136, 137, 143, 0.055);
   border-radius: 54px;
   padding: 0.4em 1em 0.4em;
   margin: 0.4em;
   }

   .button{
    border-radius: 50%;
    padding: 0 0 0;
    cursor: var(--f-cursor-pointer);
    height: 35px;
    width: 37px;
    display: flex;
    align-items: center;
    justify-content: center;
   }

 
   h4{
    font-size: 11px;
    font-family:'ProximaNova-Italic', monospace;
    margin-left: 0.4em;
   }
`;

const ContentU = styled.div`
   display: inline-flex;
   align-items: center;
   justify-content: center;
   background-color: rgba(136, 137, 143, 0.055);
   width: 80%;
   border-radius: 14px;
   padding: 0.6em 1em 0.6em;

   span{
     height: 14px;
     width: 14px;
     border-radius: 50%;
   }

   .dotred{
     background-color: rgba(255, 0, 17, 0.8)
   }

   .dotgreen{
    background-color: #06fc64;
   }


   h3{
    padding-left: 0.9em;
    padding-top: -0.4em;
    font-size: 14px;
    font-weight: 400;
    color: rgb(223, 226, 233);
    font-family: 'XcSemibold', monospace;
   }
`;

const MarginRowDs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: baseline;  
 
  
`;

 

const CardSelect = styled.div`
    background-color: rgba(35, 36, 37, 0.171);
    border-radius: 9px;
    margin: 0.4em;
    min-width: 100%;
    position: relative;
 
   ul{
    display: flex; 
    justify-content: space-between;  
    align-items: center;
    padding: 0.6em 1em 0.6em;
  
    h2{
    font-size: 21px;
    font-family: 'ProximaNova-Italic', monospace;
    }


    p{
     font-size: 11px;
     max-width: 320px;
     color: #bcc0cc;
     font-family: 'Inter', monospace;
    }
   }

 

    button{
      width: 100%;
      font-size: 16px;
      font-family: 'ProximaNova-Italic', monospace;
      text-align: start;
      color: #19f059;
      padding: 0.4em 1em 0.4em;
      border-top: 2px solid rgba(60, 60, 65, 0.178);
    }


    span{
     position: absolute;
     background-color: #15df58;
     padding: 0.5em 1em 0.5em;
     border-radius: 0px 9px 0px 28px;
     right: 1px;
     font-size: 12px;
     float: right;
     color:black;
  }
`;

 



///////// PROFILE 



const ButtonCloseMain = styled.button`
 
   padding: 0.6em 0.5em 0.4em;
 
 
`;

const MarginBottom = styled.div` 
 
  display: flex;
   border-top: 1px solid #32353813 ;
  align-items: center; 
  justify-content: space-between;
   margin-top: 1em;
  width: 100%;
  padding: 0 1em 0;
  margin-bottom: 0;
  
  button{
    background-color: rgba(38, 38, 41, 0.247);
    border-radius: 50%;
    height: 38px;
    width: 38px;
    padding: 0.5em 0.7em 0.3em;
    margin: 0.3em;
    
    i{
      color: #909197;
    }

    &:hover{
      background-color: rgba(53, 53, 58, 0.247);

      i{
      color: #858a8f;
    }
    }
  }

  ul{
   display: inline-flex;
   align-items: center;
   
    
    a{
      font-size: 11px;
      color: rgb(129, 129, 136);
      border-radius: 30px;
      margin: 0.4em;
      padding: 0.4em 1em 0.4em;

      &:hover{
        color: #858a8f;
        background-color: rgba(122, 124, 131, 0.041);
     
      }
      
    }

    span{
      cursor:  var(--f-cursor-pointer);
    }
  }
`;
 

const Obsfuc = styled.div`
 
   display: flex;
   flex-direction: column;
   margin: 1em;
   margin-top:0.2em;
   justify-content: center;
   place-items: center;

    @media screen and (max-width: 490px) {
     
      display: flex;
   flex-direction: column;
   margin: 0;
   margin-top:0.2em;
   justify-content: center;
   place-items: none;
   }
 
`;

 
 
const CardProfileMain = styled.div`
 
  position: relative;
  padding: 0.4em;
  margin-left: -1em;
  max-width: 450px;
  min-width: 350px;
 
    
 @media screen and (max-width: 490px) {
    width: 100%;
    margin-left: 0;
   }
 
`;


const CardInformation = styled.div`
  width: 800px ;
  height: 560px;
  margin: 0.9em;
  position: relative;
  border-radius: 12px;
  background: linear-gradient(204deg, #0c1420 -7%, #b85cff00 33%), linear-gradient(162deg, #2e191f -10%, #2c88dd00 25%), linear-gradient(0deg, rgb(0, 0, 0), rgb(0, 0, 0));
  
   @media screen and (max-width: 490px) {
    width: 350px;
   }
 
`;
 
const ContentProfile = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 9px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
   
  align-items: center;

  .djd{
    display: inline-flex;
    align-items: center;
  }

  .buttonscd{
   cursor: var(--f-cursor-pointer);
   border: 2px solid #1c1c1d76;
   padding: 6px 0.5em 6px;
   border-radius: 50%;
   margin: 0.2em;
   color: #6d6d7276;
   transition: 1s all;
   display: flex;
   justify-content: center;
   align-items: center;
   
    i{
      font-size: 14px;
    }
   :hover{
    border: 2px solid rgba(216, 215, 218, 0.26);
   }
   }
   .dful{
   
   left: 1em;
   top: 5px;
 
   width: 93%;
   justify-content: space-between;
   display: inline-flex;
   align-items: center;

   }
`;

 

const Warrap = styled.div`
 position: fixed;
  left: 0;
  top: 0;
  right: 1;
   height: 100%;
   width: 100%; 
   display: flex;
   z-index: 1923;
  justify-content: center;
  bottom: 1px;
  background-color: #00000090;
  
`;


const Marginviewx = styled.div`
   display: inline-flex;
   align-items: center;
   width: 100%;
   justify-content: space-between;


   label{
    font-family: 'InterSemiBold', monospace;
    font-size: 15px;
    color: #46464b;
    text-align: start;
   }
 
   @media screen and (max-width: 490px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
   }

`;


const InfouserCard = styled.div`
   background: rgba(8, 9, 10, 0.918);
    position: relative;
    display: flex;
    width: 250px;
    align-items: center;
    gap: 13px;
    padding: 0px 13px;
    height: 45px;

    .jVTusw{
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
   
      bottom: 0;
    }


    h3{
      font-family: 'InterSemiBold', monospace;
      font-size: 14px;
      color: #afb2b8;
    }
`;










 
const ContentAboutbanner = styled.div`
   
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   border-radius: 22px;
   margin-top: 3em;
  
   .aboutimagebanner{
    border-radius: 22px;
   }
   li{
    margin: 0.8em;
   }
`;

const Buttonseclet = styled.button`
   
   background-color: #22f078;
   color: black;
   font-family: 'Poppins', sans-serif;
   font-size: 13px;
   padding: 0.4em 1em 0.4em;
   border-radius: 22px;
   margin: 0.4em;
    transition: 1s all;
    border: 1px solid rgba(255, 255, 255, 0.11);
    :hover{
      background:none;
      border: 1px solid rgba(255, 255, 255, 0.11);
      color: rgba(234, 235, 240, 0.712);
    }
`;
 
