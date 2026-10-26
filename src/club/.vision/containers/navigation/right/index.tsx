import styled from "styled-components";
import Tooltip from "@club/components/uls/hover.idex";
import { X, Settings, HelpCircle, Download, LogOut, Wallet, ScanBarcode } from "lucide-react"
import router, { useRouter } from 'next/router';
import { useEffect, useState } from "react"
import Image from "next/image";
 
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Nvxre from '@/public/icons/verified-nvxre.png'
import Crown from '@/public/favicon.png'
import { Smalllistavatar } from "@club/components/menu/account.utils";
import Event from '@/public/icons/event.png'
import LoadingPageView from "@club/resources/loading";
import ROUTENVX from "@/routes/routes";
import axios from "axios";
import { decrypt } from "@/core/security/encryption";
import { User } from "@/types/user/type.cla";
import InvitedUsers from '@club/resources/invite/inviteusers.profile';
import { UserInfo } from "@/types/discord/usersearch";
import { getBorderColorFromThemex } from "@/data/themes/theme.config";
import NotificationUI from "@/components/notification/card.mnc";
import {NotificationsPage} from "@/accounts/notification";
import { NotificationsList } from "@/wallet/kop";
import SessionNv from "@/accounts/sessions.nvrp";

   
export interface Advertising {
  Redirect: any;
  AdsId: string;
  title: string;
  thumbnailUrl: string; 
  descriptions: string;
  DateLanc: string;
  About: string;
}

interface Props {
  userInfo: any;
  user: any;
  infox: any;
  NotifyAlert: React.ReactNode;
   theme?: string;
}

interface OHistory {
  code: string; 
  bonus: number; 
  date: string; 

}

export default function Right ({theme, userInfo, user,infox,NotifyAlert} : Props) {
  const router = useRouter();
  const { invite }= router.query;
  const [ismodal, setismodal] = useState(0)
  const [advertisingData, setAdvertisingData] = useState<Advertising[]>([]);
  const [eventCount, setEventCount] = useState(0); // State to track the number of events
  const [followers, setFollowers] = useState<UserInfo []>([]);
  const [modal2, setmodal2] = useState(1)
  const [following, setFollowing] = useState<UserInfo []>([]);
  const [inforemarkable , setinforemarkable] = useState<any | null>('');
  const [isLoading, setIsLoading] = useState(true);
  const [UserClaInfo, setUserClaInfo] = useState<User | null>(null);

  const [responseMessage, setResponseMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [Codebits, setCodebits ] = useState('')
  const [redemptionHistory, setRedemptionHistory] = useState<OHistory []>([]);
  const [iscodeuse, setcodeuse] = useState(false)
  const [iscodeinvite, setcodeinvite ] = useState(false)
  const [inviteCode, setInviteCode] = useState<string | string[]>(invite || '');
   const [iscodebits, setcodebits] = useState(true)

  const activeLink = router.asPath;
  const isActive = (pathname: string) => {
    return activeLink === pathname ? 'right-active' : '';
  };

    const isActivev = (pathname: string) => {
    return activeLink === pathname ? 'right-activ' : '';
  };
  useEffect(() => {


    async function fetchClainfo() {
      try {
     
        setIsLoading(true);
        const response = await axios.get(`/api/cla/info.user.cla?userId=${user.id}`);
        const decryptedData = decrypt(response.data.log);
        const userInfoObject = JSON.parse(decryptedData);
        setUserClaInfo(userInfoObject);
        setIsLoading(false);
      
      } catch (error) {
       
        setIsLoading(false);
      }
    }

    
    fetchClainfo()

  }, []);


 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); 
        const response = await fetch('/api/ads/event/events');
        const data: Advertising[] = await response.json();
        setAdvertisingData(data);
        setEventCount(data.length);  
      } catch (error) {
        // console.error('Erro ao buscar dados de publicidade:', error);
        // Lidar com erro, por exemplo, definir um estado de erro
      } finally {
        setIsLoading(false);  
      }
    };
 

    
     
    
  
    fetchData();

  }, []);

 const fetchData = async () => {
     try {
         const response = await fetch(`/api/club/follow/view?userId=${user.id}`);
         const responseX = await axios.get(`/api/autentic/inforemarkable?userId=${user.id}`);
         const decryptedDataX = decrypt(responseX.data.log);
         const userInfoObjectX= JSON.parse(decryptedDataX);
         const data = await response.json();
         setinforemarkable(userInfoObjectX)
         setFollowers(data.followers);
        setFollowing(data.following);
     } catch (error) {
        //  console.error("Erro ao buscar dados:", error);
     }
 };
 
   useEffect(() => {
     fetchData();
   }, [user.id]);




    const handleGetOwnerInfo = async () => {
      try {
        const response = await fetch(`/api/redirect/ownerinvite?inviteCode=${inviteCode}`);
  
        if (response.ok) {
          const data = await response.json();
          setOwnerInfo(data);
          setErrorMessage('');
        } else {
          const data = await response.json();
          setOwnerInfo(null);
          setErrorMessage(data.error);
        }
      } catch (error) {
        setOwnerInfo(null);
        setErrorMessage('Ocorreu um erro ao buscar as informações do proprietário.');
      }
    };

  const handleclosemod = () => {
      setcodeuse(false);
      const { code, invite, ...rest } = router.query;
      router.push({
        pathname: router.pathname,
        query: { ...rest}
      }, undefined, { shallow: true });
    }
    
    const handleAuthorizeCodebits = async () => {
      setIsVerifying(true);
      setResponseMessage('');
    
      try {
        const response = await fetch('/api/_v4/bitger/redeemCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, code: Codebits }), 
        });
    
        const data = await response.json();
        setResponseMessage(data.message);
        setIsFormSubmitted(true);
    
        if (response.ok) {
          // Atualize o histórico de resgates
          setRedemptionHistory((prev) => {
            // Verifique se prev é um array, caso contrário, inicialize como um array vazio
            if (Array.isArray(prev)) {
              return [...prev, { code: Codebits, bonus: data.newBits, date: new Date().toLocaleString() }];
            }
            // Se prev não for um array, retornamos um novo array com o novo item
            return [{ code: Codebits, bonus: data.newBits, date: new Date().toLocaleString() }];
          });
    
          setInviteCode(''); // Limpa o campo após o sucesso
        }
      } catch (error) {
        console.error('Erro ao aplicar código:', error);
        setResponseMessage('Erro ao aplicar o código.');
        setIsFormSubmitted(true);
        setTimeout(() => {
          setIsFormSubmitted(false);
        }, 5000);
      } finally {
        setIsVerifying(false);
        setTimeout(() => {
          setIsFormSubmitted(false);
        }, 5000);
      }
    }; 


     

   const Opencodeinvite = () => {
    setcodeinvite(true)
    setcodebits(false)
   }

   const Opencodebits = () => {
    setcodeinvite(false)
    setcodebits(true)
   }

    const handleAuthorize = async () => {
      setIsVerifying(true);
      try {
        const response = await fetch(`/api/redirect/authorization`, {
          method: 'POST',
          body: JSON.stringify({ discordUserId: user.id, inviteCode }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setResponseMessage(`Código de convite usado!`); 
          setIsFormSubmitted(true);
          setTimeout(() => {
            setIsFormSubmitted(false);
          }, 5000);
          await getGuestInfo(`${inviteCode}`);
          await handleGetOwnerInfo();
        } else {
          const data = await response.json();
          setResponseMessage(data.error);
          setIsFormSubmitted(true);
          setTimeout(() => {
            setIsFormSubmitted(false);
          }, 5000);
        }
      } catch (error) {
        setResponseMessage(`Algum Problema aconteceu aqui!`);
      } finally {
        setIsVerifying(false);  
      }
    };

    const getGuestInfo = async (inviteCode: string) => {
      try {
        const response = await fetch(`/api/redirect/guestInfo?inviteCode=${inviteCode}`, {
        method: 'POST',
        body: JSON.stringify({
          Iduser: user.id,
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
          // console.error('Error fetching guest info:', data.error);
          return null;
        }
      } catch (error) {
        // console.error('Error fetching guest info:', error);
        return null;
      }
    };
  return( 
    <>
    <Container>
      <Content theme={theme}>
        
       {ismodal == 1 ? (
        <>
        <li>
      
      <Tooltip title='Perfil '> 
   <span  className="bvd" onClick={() => setismodal(0)}>
   <X size={20} />
   </span>
   </Tooltip>
 </li>
        </>
       ) : (
        <>
          <li>
      
      <Tooltip title='Perfil '> 

            <MarginImags onClick={() => setismodal(1)}>
          
          <li>
          <img src="/icons/market/20250325_192605.webp"  alt="novision" width={45} height={45} className="b1"/>
          <img src="/icons/market/20250325_192624.webp"  alt="novision" width={45} height={45}  className="b2"/>
          </li>
       </MarginImags>

 
   </Tooltip>
 </li>
        </>
       ) }

 

      {ismodal == 2 ? (
        <>
          <li>
          <Tooltip title='Notificações '>
          <button onClick={() => setismodal(0)} className={ismodal == 2 ? "navbar-active gbutton" : "gbutton"}>
          <X size={20} />
            </button>
          </Tooltip>
          </li>
        </>
      ) : (
        <>
   <li>
 
        <Tooltip title="Notificações">
          <button onClick={() => setismodal(2)}>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
          </button>
          </Tooltip>
        </li>
        </>
      )}

      


        <li>
    
        <Tooltip title="WalletVision">
          <button onClick={() => router.push(ROUTENVX.wallet)}>
           <Wallet /> 
          </button>
          </Tooltip>
        </li>

         
        <HovercardContainer>

        {ismodal === 3 ? (
         
          <li>
           
          <Tooltip title='Eventos '>
          <button onClick={() => setismodal(0)} className={ismodal === 3 ? "navbar-active gbutton" : "gbutton"}>
          <X size={20} />
            </button>
          </Tooltip>
         
            {eventCount > 0 && <span className="eventCountDot">{eventCount}</span>}
          </li>) : (
 <li>

 <Tooltip title='Eventos '>
 <button onClick={() => setismodal(3)} className={ismodal === 3 ? "navbar-active gbutton" : "gbutton"}>
   <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M8 2v4"/><path d="M16 2v4"/><path d="M21 17V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11Z"/><path d="M3 10h18"/><path d="M15 22v-4a2 2 0 0 1 2-2h4"/></svg>
   </button>
 </Tooltip>

   {eventCount > 0 && <span className="eventCountDot">{eventCount}</span>}
 </li>
          )}
           
       
       </HovercardContainer>
 

        {ismodal == 4 ? (
          <>
       
     <li>
      
      <Tooltip title="Meus amigos">
      <button onClick={() => setismodal(0)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
      </Tooltip>
   
     </li>
          </>
        ) :  (
          <>

              
        <li>
      
      <Tooltip title="Meus amigos">
      <button onClick={() => setismodal(4)}>
       <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="24" width="24" ><path fill-rule="evenodd" clip-rule="evenodd" d="M15 18H5a2 2 0 012-2h6a2 2 0 012 2zM3 20v-2a4 4 0 014-4h6a4 4 0 014 4v2H3zm9-14H8v3a1 1 0 001 1h2a1 1 0 001-1V6zM6 4v5a3 3 0 003 3h2a3 3 0 003-3V4H6zm13 16h3v-2a4 4 0 00-4-4h-1s2 1.5 2 4v2zm-3-8a3 3 0 003-3V5h-3v7z" fill="currentColor"></path></svg>
       </button>
      </Tooltip>
   
     </li>

      
           
          </>
        )}

         
        <MarginSv>
        <Tooltip title="Comunidade"> 
         <button onClick={() => router.push(ROUTENVX.clubrs)} className={isActive(ROUTENVX.clubrs)}>
         <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="whiteMediumEmphasis" height="23" width="23"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 3h-8v5a3 3 0 003 3h2a3 3 0 003-3V3zm-2 2h-4v3a1 1 0 001 1h2a1 1 0 001-1V5z" fill="currentColor"></path><path d="M10 10.83A3.001 3.001 0 018 8V4h2v6.83zm-1.5 2.2A5.977 5.977 0 007 17v3H5v-3a4 4 0 013.5-3.97zm-4 .001a5.977 5.977 0 00-1.5 3.97v2H1v-2a4 4 0 013.5-3.97zM4 8c0 1.306.835 2.418 2 2.83V5H4v3z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M19 13a4 4 0 014 4v4H9v-4a4 4 0 014-4h6zm-6 2h6a2 2 0 012 2v2H11v-2a2 2 0 012-2z" fill="currentColor"></path></svg>
         </button>
         </Tooltip>

         <Tooltip title="Usar Codigos">
          
         <button  onClick={() => setcodeuse(true)} className={iscodeuse ? "navbar-active gbutton" : "gbutton"}>
         <ScanBarcode />
         </button>
          
         </Tooltip>
        </MarginSv>

      </Content>
    </Container>

   

    {ismodal == 2 && (
      <>
       
     <CardMenu Notifications={NotifyAlert} id={user.id} />
      </>
    )}

    {ismodal == 1 && (
      <>
<MenuContainer>
      <Header>
 
        <UserInfoVX>
        <ViewInfo onClick={() => router.push(`/${ROUTENVX.DashboardProfile}`)}>
    
    <section className="uu3nc">

   
         <Stack direction="row" spacing={1}>
  
{UserClaInfo ? (
      <>
       <Tooltip title={`${UserClaInfo.Clasigla ? 'Clã -' : '' } ${UserClaInfo.Clasigla}`} > 
  <Badge
    overlap="circular"
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    badgeContent={
      <Smalllistavatar src={UserClaInfo.LogoCla ? `${UserClaInfo.LogoCla}` : "/favicon.png"} alt={UserClaInfo.Clasigla} />
    }
  >
   
    <Avatar src={user.avatar} alt={user.name}  />
  </Badge>
  </Tooltip>
  </>
) : (
  <Avatar src={user.avatar} alt={user.name}  />
)}
  </Stack>
         
<ul>
<h3>{infox.name}  
 {userInfo.verified && (
      <>
   <svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="20" width="20" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg>
      </>
   )}
              {userInfo.nvxre && (
              <>
             <Image className="logoroda" src={Nvxre} alt="nvxre" height={20}/>
              </>
              )}  

        {infox.team && (
              <>
              <Image  className="logoroda" src={Crown} alt="Moderator" height={20}/>
              </>
              )}  </h3>
<p>{userInfo.type ? "Cidadão" : "Visitante"}</p>
</ul>

    </section>
 
</ViewInfo>

          <Username>   <span className="carduw" onClick={() => router.push(`/@${infox?.name}`)} >
              <img src="/nvrp/20240520_081457.png" 
               alt="novision clubr"
               height={15}
               width={15}
              />

               <ul>
               <h3>{infox?.name}</h3>
               <h3 className="uicn">{infox?.subdominio}</h3>
               </ul>
            </span> </Username>
        </UserInfoVX>
      
      </Header>

   
     <Divider />
    
      <MenuList>
    <MenuItem onClick={() => router.push(ROUTENVX.prizesdrops)} className={isActivev(ROUTENVX.prizesdrops)} >
        <svg viewBox="0 0 24 24" fill="none" height="24" width="24" ><path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 10.5h15V14H14a2 2 0 11-4 0H4.5v-3.5zm0 5v4h15v-4h-4.337a3.5 3.5 0 01-6.326 0H4.5zm-1.5 0V9h18v12H3v-5.5z" fill="currentColor"></path><path fill="currentColor" d="M5.351 3.983l1.3-.75 2 3.464-1.3.75zm11.999-.75l1.3.75-2 3.464-1.3-.75zM11.25 2h1.5v4h-1.5z"></path></svg>
          Prêmios E Drops
        </MenuItem>

        <MenuItem onClick={() => router.push(ROUTENVX.myinventory)} className={isActivev(ROUTENVX.myinventory)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z"/><path d="M5 3a2 2 0 0 0-2 2"/><path d="M19 3a2 2 0 0 1 2 2"/><path d="M5 21a2 2 0 0 1-2-2"/><path d="M9 3h1"/><path d="M9 21h2"/><path d="M14 3h1"/><path d="M3 9v1"/><path d="M21 9v2"/><path d="M3 14v1"/></svg>
          Inventario
        </MenuItem>

 

        <MenuItem onClick={() => router.push(ROUTENVX.studiomoney)} className={isActivev(ROUTENVX.studiomoney)} >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>
          Monetização
        </MenuItem>
      
        <MenuItem onClick={() => router.push(ROUTENVX.orders)} className={isActivev(ROUTENVX.orders)}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="24" width="24" ><path fill-rule="evenodd" clip-rule="evenodd" d="M20.901 2.096a.648.648 0 00-.916 0l-5.161 5.161a.648.648 0 10.916.916l5.161-5.161a.648.648 0 000-.916zM12.503 3.17l4.917.578-1.904 1.904a1.938 1.938 0 00-1.952 1.32 1.943 1.943 0 103.782.514l1.906-1.906.58 4.917L9.328 21l-1.832-1.832v-1.832l-1.832-1.831-1.832-.002L2 13.672 12.503 3.17z" fill="currentColor"></path></svg>
          Trocas
        </MenuItem>
        <MenuItem onClick={() => router.push(ROUTENVX.centralsubscription)} className={isActivev(ROUTENVX.centralsubscription)}>
        <img src="/icons/crown_badge.png" alt="premium" height={24} width={24}     style={{ filter: "grayscale(100%) brightness(80%) contrast(120%)" }} 

 />
          Assinaturas
        </MenuItem>
        <MenuItem onClick={() => router.push(ROUTENVX.verification)} className={isActivev(ROUTENVX.verification)} >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="24" width="24" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg>
          Verificação Clubr
        </MenuItem>
        <Divider />
     
      <MenuItem onClick={() => router.push(ROUTENVX.Cladashboard)} className={isActivev(ROUTENVX.Cladashboard)}>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"/></svg>
         Clãs
        </MenuItem>

 
        <Divider />
         
       
         <MenuItem onClick={() => router.push(ROUTENVX.settings)} className={isActivev(ROUTENVX.settings)}>
          <Settings />
          Configurações Da Conta
        </MenuItem>
        <MenuItem onClick={() => router.push(ROUTENVX.support)} className={isActivev(ROUTENVX.support)}>
          <HelpCircle />
          Suporte
        </MenuItem>
     
        <MenuItem onClick={() => router.push(`${ROUTENVX.centralpreference}?logout=clubvision`)} className={isActivev(ROUTENVX.centralpreference)}>
          <LogOut />
          Logout
        </MenuItem>
    
      </MenuList>
    </MenuContainer>
      </>
    )}



{ismodal === 3 && (
             <div> 
             
        
                <MenuContainerX> 
          
          {isLoading ? (
             <>
              <LoadingPageView />
             </>
      ) : advertisingData.length === 0 ? (
        <>
        <ContainerN>
          <Image src={Event} alt="event" height={165} width={165}/>
          <li>
          <h4>Nenhum evento programado</h4>
          <p>Os anuncios de eventos programados poderão ser visto aqui!</p>
          </li>
        </ContainerN>
        </>
      ) : (
        advertisingData.map((ad) => (
          <div key={ad.AdsId}>
            <EventsInfo>
              <ContentEvent>
                <img
                  className="ImageEvent"
                  src={`data:image/png;base64,${ad.thumbnailUrl}`}
                  alt={ad.title}
                  width={500}
                  height={100}
                />

                <ul>
                  <h5>NoVision Extraction - RP</h5>
                  <h2>{ad.title}</h2>
                  <h4>{ad.descriptions}</h4>
                </ul>
              </ContentEvent>
              <ContentAboutButtons>
                <ButtonIn>
                  <i className="fi fi-rr-calendar-star" />
                  <li>
                    <h4>
                      {ad.DateLanc} ● {ad.About} Hrs
                    </h4>
                  </li>
                </ButtonIn>

                <p>Esperamos você nesse evento!</p>
              </ContentAboutButtons>
            </EventsInfo>
          </div>
        ))
      )}
          </MenuContainerX>
             
             </div>
        )}

 

{ismodal == 4 && (
        <>
        <Modal>
        <Card>
     
          <Profiles>
           <button onClick={() => setmodal2(1)} className={modal2 == 1 ? 'active' : ''}>
             <li>
              <h3>Seguidores</h3> 
              <p>{inforemarkable.followersPercentage}% do club </p>
             </li>
           </button>

           <button onClick={() => setmodal2(2)} className={modal2 == 2 ? 'active' : ''}>
             Seguindo
           </button>

               
           <button onClick={() => setmodal2(3)} className={modal2 == 3 ? 'active' : ''}>
           Amigos
           </button>
          </Profiles>
        <ContentC>


        {modal2 == 3  && (
          <>
            
            <InvitedUsers userId={user.id} />
    
          
          </>
        )}

        {modal2 == 1 && (
        <>
          
          {Array.isArray(followers) && followers.length > 0 ? (
  followers.slice(0, 30).map((follower) => (
                            <div key={follower.id} >

<UserViewInfo key={user.id} onClick={() => router.push(`/@${follower.name}`)}>
            <li>
            <Image 
            src={follower.avatar} 
            alt={follower.name} 
            className="logoavatar" 
            height={50}
            width={50}
            />
          {follower.reforms ? (
               <>
            <ul>
            <span>
                <h2>{follower.name}</h2>
        {follower.reforms.verified && (
        <>
     <h5>    <svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="20" width="20" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg></h5>  
        </>
     )}
                {follower.reforms.nvxre && (
                <>
                <h5><Image src={Nvxre} alt="nvxre" height={19}/></h5>  
                </>
                )}  

          {follower.reforms.nvrp && (
                <>
                <h5> <Image  className="logoroda" src={Crown} alt="Moderator" height={19}/></h5>  
                </>
                )}  
               </span>
            
                <p>{follower.reforms.BioLi}</p>
            </ul>
            </>
              ) : 
              (
            <ul>
            <h2>---</h2>
            <p>{follower.name}</p>
            </ul>
              )
              }
            </li>

        
        </UserViewInfo>

                            </div>
                   
                ))) : (
                  <Margib>
                  <h1>@{infox.name} não é seguido por ninguém</h1> 
                  <p>Depois de obter seguidores, elas serão exibidas aqui.</p>
                 </Margib>
                )}
            </>
            )}

          {modal2 == 2 && (
 <>
{Array.isArray(following) && following.length > 0 ? (
  following.slice(0, 30).map((followed) => (
     <>
    
<UserViewInfo key={user.id} onClick={() => router.push(`/@${followed.name}`)}>
<li>
<Image 
src={followed.avatar} 
alt={followed.name} 
className="logoavatar" 
height={50}
width={50}
/>
{followed.reforms ? (
<>
<ul>
<span>
 <h2>{followed.name}</h2>
{followed.reforms.verified && (
<>
<h5>   <svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="20" width="20" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg></h5>  
</>
)}
 {followed.reforms.nvxre && (
 <>
 <h5><Image src={Nvxre} alt="nvxre" height={19}/></h5>  
 </>
 )}  

{followed.reforms.nvrp && (
 <>
 <h5> <Image  className="logoroda" src={Crown} alt="Moderator" height={19}/></h5>  
 </>
 )}  
</span>

 <p>{followed.reforms.BioLi}</p>
</ul>
</>
) : 
(
<ul>
<h2>---</h2>
<p>{followed.name}</p>
</ul>
)
}
</li>


</UserViewInfo>
         
     </>
 ))) : (
     <Margib>
      <h1>@{infox.name} não está seguindo ninguém</h1> 
      <p>Depois de seguir as contas, elas serão exibidas aqui.</p>
     </Margib>
 )}
</>

          )}
            
         
        </ContentC>
        </Card>
        </Modal>
        </>
      )}


       {iscodeuse && (
            <WrappInvite>
            <CardCode>
            <MargintopSelect>
              
              <button onClick={Opencodebits}  className={iscodebits ? 'active bits' : ''}>
              <img src="/icons/coins/orbit-novision.webp" alt="" />
              <span>use o Código Bits!</span>
              </button>
      {userInfo !== null && (
           <button
           onClick={Opencodeinvite}
           disabled={userInfo.type ? true : false}
           className={iscodeinvite ? 'active code' : ''}
           style={{ cursor: userInfo?.type && ' not-allowed' }} // Alterando o estilo do cursor
         >
           <img className='DIC' src="/nvrp/20240520_081457.png" alt="" />
           <span>Codigo Ativação</span>
         </button>
      )}
          
      
              <span onClick={handleclosemod}className='button1'> 
              <svg className="icon h-5 w-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
        </svg>
              </span>
            </MargintopSelect>
                
             {iscodebits && (
              <>
               <ContentCardCode>
            <Wrapper>
          <ImageContainer>
            <img src="/theim/characters/3a99957dee6097579ab76154c5f4059a.webp" alt="Codigo bits" />
          </ImageContainer>
          <ContentContainer>
            <PromoContainer>
              <IconWrapper data-testid="coupon_modal_exclamation_icon">
                <svg className="icon" viewBox="0 0 4 13" fill="none" height={14} width={14} >
                  <path fill="currentColor"  d="M0.872478 8.32093H2.87848L3.15048 0.109931H0.583478L0.872478 8.32093ZM3.37148 10.9049C3.37148 10.1229 2.75948 9.51093 1.92648 9.51093C1.05948 9.51093 0.447478 10.1229 0.447478 10.9049C0.447478 11.6869 1.05948 12.2989 1.92648 12.2989C2.75948 12.2989 3.37148 11.6869 3.37148 10.9049Z" />
                </svg>
              </IconWrapper>
              <InfoWrapper>
                <div style={{ display: 'flex' }}>
                  <Title>Resgate quantias de bits com codigos!</Title>
                </div>
                <Description>Introduza o codigo de resgate de bits <span> Uso limitado por conta. </span></Description>
              </InfoWrapper>
            </PromoContainer>
          </ContentContainer>
           
        </Wrapper>
        <ModalWrapper>
          <FormContainer data-testid="use_code_modal_form">
            <InputWrapper>
              <Input 
              type="text"
               value={Codebits}
              autoComplete="nope"
               onChange={(e) => setCodebits(e.target.value)}
              placeholder="NVRP-XXXXXXXXXXX" />
            </InputWrapper>
            <ApplyButton 
            type="button" 
            onClick={handleAuthorizeCodebits} 
            disabled={isVerifying}>{isVerifying ? 'Verificando...' : 'Aplicar'}</ApplyButton>
          </FormContainer>
          {isFormSubmitted &&  
                    <>
                    <NotificationUI message={responseMessage} />
                    </>}
        </ModalWrapper>
      
      
            </ContentCardCode>
       
            <MarginTitle>
                <h1>Histórico de códigos</h1>
              </MarginTitle>
       
              <CustomScrollbar>
                  <Table data-testid="codes_table">
                    <Thead>
                      <Tr>
                        <Th>CÓDIGO PROMOCIONAL</Th>
                        <Th>MONTANTE DO BÓNUS</Th>
                        <Th>DATA DE USO</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                    {(redemptionHistory && redemptionHistory.length > 0) ? (
       redemptionHistory.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      })
          .map((entry, index) => (
            <Tr key={index}>
              <Td>{entry.code.replace('NVRP-', '')}</Td> 
              <CenteredTd>
                <BonusSpan>  <img src="/icons/coins/orbit-novision.webp" alt="" /> <p>{entry.bonus}</p> </BonusSpan>
              </CenteredTd>
              <Td>{new Date(entry.date).toLocaleString()}</Td>
            </Tr>
          ))
        ) : null}
                    </Tbody>
                  </Table>
                </CustomScrollbar>
           
         </>    
             )}
      
            {iscodeinvite && (
                <>
                
                <ContentCardCode>
            <Wrapper>
          <ImageContainer>
            <img src="/theim/characters/hdbufnsybvfjsib.png" alt="Promoção" />
          </ImageContainer>
          <ContentContainer>
            <PromoContainer>
              <IconWrapper data-testid="coupon_modal_exclamation_icon">
                <svg className="icon" viewBox="0 0 4 13" fill="none" height={14} width={14} >
                  <path fill="currentColor"  d="M0.872478 8.32093H2.87848L3.15048 0.109931H0.583478L0.872478 8.32093ZM3.37148 10.9049C3.37148 10.1229 2.75948 9.51093 1.92648 9.51093C1.05948 9.51093 0.447478 10.1229 0.447478 10.9049C0.447478 11.6869 1.05948 12.2989 1.92648 12.2989C2.75948 12.2989 3.37148 11.6869 3.37148 10.9049Z" />
                </svg>
              </IconWrapper>
              <InfoWrapper>
                <div style={{ display: 'flex' }}>
                  <Title>{userInfo?.type ? 'Você já é um membro autorizado!' : 'Adicione aqui o token convite amigo!'}</Title>
                </div>
                <Description>{userInfo?.type ? 'Basta clicar  em jogar agora e pronto sua conexão em thenovision sera iniciada.. ' : (<>Introduza o token de ativação de Conta <span> Recebido por um amigo. </span></>)}</Description>
              </InfoWrapper>
            </PromoContainer>
          </ContentContainer>
           
        </Wrapper>
        <ModalWrapper>
          <FormContainer data-testid="use_code_modal_form">
            <InputWrapper>
              <Input 
              type="text"
               value={inviteCode}
              autoComplete="nope"
               onChange={(e) => setInviteCode(e.target.value)}
              placeholder="NVRP-XXXXX-XXXX-XX"
              readOnly={userInfo?.type ? true : false} />
            </InputWrapper>
            <ApplyButton 
            type="button" 
            onClick={handleAuthorize} 
            disabled={isVerifying || userInfo?.type ? true : false}>{isVerifying ? 'Verificando...' : 'Aplicar'}</ApplyButton>
          </FormContainer>
          {isFormSubmitted &&  
                    <>
                    <NotificationUI message={responseMessage} />
                    </>}
        </ModalWrapper>
      
      
            </ContentCardCode>
       
        
              {ownerInfo && (
                <>
                
            <MarginTitle>
                <h1>Informações</h1>
              </MarginTitle>
       
      
      
              <CardInfoowner>
             
             <Image src={ownerInfo.Avatare} 
                alt={ownerInfo.userName} 
                className="logo"
                height={60} width={60}/>
                <li>
                <h5>{ownerInfo.userName} convidou vocè</h5>
                <p>Você agora faz parte da comunidade. Seja Bem-vindo!</p>
                 </li>
                 
              </CardInfoowner>
      
              </>
            )}
      
                </>
            )}
            
           
            </CardCode>
            </WrappInvite>
           )}
    </>
  )
}




const CardMenu = ({ Notifications,id} : {Notifications: React.ReactNode,id: string}) =>{

  const [isopennotify, setnotify ] = useState(true);
  const [page, setPage] = useState(1);
 

  const DownloadPrompt: React.FC = () => {
   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

   useEffect(() => {
     const handleBeforeInstallPrompt = (e: any) => {
       e.preventDefault();
       setDeferredPrompt(e);
     };
 
     window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
 
     return () => {
       window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
     };
   }, []);
 
 
   return null;
 };


 
 return( 
    <div className="flex gap-1">
  <MarginBucx> 
    
           <button onClick={() => setPage(1)} className={page === 1 ? "navbar-active gbutton" : "gbutton"}>
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"/></svg>
                </button>

   <button onClick={() => setPage(2)} className={page === 2 ? "navbar-active gbutton" : "gbutton"}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"  ><path d="M17 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 1-1.732"/><path d="m22 5.5-6.419 4.179a2 2 0 0 1-2.162 0L7 5.5"/><rect x="7" y="3" width="15" height="12" rx="2"/></svg>
   </button>
   

                <button onClick={() => setPage(3)} className={page === 3 ? "navbar-active gbutton" : "gbutton"}>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"/><path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21"/></svg>
                </button>

                  

                 <button onClick={() => setPage(4)} className={page === 4 ? "navbar-active gbutton" : "gbutton"}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z"/><path d="M6 15v-2"/><path d="M12 15V9"/><circle cx="12" cy="6" r="3"/></svg>
                </button>

                 {/* <button onClick={() => setPage(8)} className={page === 8 ? "navbar-active gbutton" : "gbutton"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                </button> */}

              </MarginBucx>
 
    <DownloadPrompt />
       <ContentMenuc2>
         {page == 1 && isopennotify && <MenuContainerX>{Notifications}</MenuContainerX>}
         {page == 2 && isopennotify && <div className="max"> <MenuContainerX><NotificationsPage id={id}/></MenuContainerX></div>}
         {page == 3 && isopennotify && <div className="max"><MenuContainerX> <NotificationsList id={id} />  </MenuContainerX></div>}
         {page == 4 && isopennotify && <MenuContainerX className='p-1'><SessionNv /></MenuContainerX> }
         {page == 5 && isopennotify && null}
       </ContentMenuc2>
       
       
 
    </div>
 ) 
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
const MarginBucx = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.8em;
  height: 100svh;
  overflow-y: auto;
  gap: 2%;

  button{
    border: 2px solid #393b3a;
    border-radius: 12px;
    padding: 0.6em;
   
    display: flex;
    justify-content: center;
    align-items: center;
    
    svg{
      height: 18px;
      color: #5c615e;
      width: 18px;
    }

    &:hover{
      svg{
        color: #686d6a;
      }

      border-color:  #686d6a;
    }
  }

  .navbar-active{
    border-color: #28dd6d;
    background-color: #1d1f1f;
    color: #28dd6d;

    svg{
      color: #28dd6d;
    }
  }
`;


const Margib = styled.div`
  width: 100%;
  height:50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  place-content: center;
  text-align: center;

  h1{
    font-family: 'Inter', monospace;
    font-size: 19px;

  }

  p{
      font-size: 12px;
    font-family: 'InterSemiBold', monospace;
  }
`;

const UserViewInfo = styled.div`
     display: flex;
     align-items: center;
     flex-direction: row;
     justify-content: space-between;
     cursor: var(--f-cursor-pointer);
     padding: 0px 0.2em 0px;
     border-bottom: 2px solid #1d1f1f14;
 
     .marginright{
      display: flex;
      align-items: center;
      flex-direction: row;
     }
     
    li{
        display: flex;
        align-items: center;
    }

     ul{
        padding: 1em;

        h2{
           font-size: 16px;
           color: #e7f1fc;
        }

        p{
          font-size: 12px;
          text-align: justify;
          color: rgb(130, 134, 138);

          max-width: 100%;
     
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
        }
     }
    
     span{
        display: flex;
        align-items: center;


        h5{
           padding-left: 0.4em;
           padding-top: 0.4em;
        }
     }
   .logoavatar{
     border-radius: 100%;
     border: 2px solid rgba(78, 73, 100, 0.315);
   }

   &:hover{
    border-bottom: 2px solid #1d1f1f;
   }
`;

const Modal = styled.div`
  
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 
 flex-direction: column;
 place-items: end;
 justify-content: center;
`;

const Card = styled.div` 
  
   width: 430px;
 
  color: #FFFFFF;
  height: 100%;
  padding: 16px;
  margin: 1px;
  
   overflow: hidden;
   
   .dul{
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 0.5em;
    border-bottom: 2px solid #151616;
    margin-bottom: 0.7em;
   }

   @media screen and (max-width: 530px) {
       width: 100vw;
    }
`;

const ContentC = styled.div`
  background: linear-gradient(204deg, #2e313040 -7%, #b85cff00 33%), linear-gradient(162deg, #2e313040 -10%, #2c88dd00 25%), linear-gradient(0deg, #1a1b1a, #1d1f1e);
 
padding: 0.9em;
border-radius: 14px;
height: 94%;
width: 100%;
overflow-y: auto;


`;

const Profiles = styled.div`
  width: 100%;
  display: inline-flex;
  align-items: center;
  padding: 0 0 0.5em;
  gap: 12px;
  justify-content: center;

  button{
    font-size: 15px;
    font-family: 'InterSemiBold', monospace;
    padding: 0.5em 1em 0.5em;

   

     h3{
      font-size: 15px;
      font-family: 'InterSemiBold', monospace;
     }


     p{
      font-size: 11px;
      display: none;
      color: #5d6063;
     }
  }

  .dhsdf{
    max-width: 230px;
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
  }

  button:hover{
    border-bottom: 2px solid #4b4d50;
  }
  
  .active{
    border-bottom: 2px solid #28dd6d;

    p{
      display: block;
    }
  }
`;





const ContentMenuc2 = styled.div`
  
   font-family: 'Inter', monospace;
    
   hr{
    width: 100%;
    border-color: rgba(11, 12, 15, 0.048);
   }

    .max{
      max-width: 380px;
      height: 97svh;
    }

`;



 
const ViewInfo = styled.div`
 
cursor:  var(--f-cursor-pointer);
padding: 0.5em 0.1em 0.5em;
  
width: 100%;
display: inline-flex;
justify-content: space-between;
align-items: center;

.uu3nc{
 display: flex;
 flex-direction: row;
 align-items: center;
 }
    
 .logoroda{
   padding: 0.1em;
   border-radius:60%;
 }
ul{
 display: flex; 
   padding-left: 0.4em;
 flex-direction: column;
}
 

  .logos{
   border-radius: 50%;
  }

 h3{
   font-family: 'Inter';
   font-size: 13px;
   background: linear-gradient(47deg, #888384 0%, rgb(73, 77, 74) 1%, #c9c0c1 100%);
 -webkit-background-clip: text;  
 -webkit-text-fill-color: transparent;

 display: inline-flex;
 align-items: center;
 
 }

 p{
   font-size: 11px;
   color: #868c91;
   margin-bottom: 0.3em;
   max-width: 430px;
 }

`;
 
const MenuContainerX = styled.div`
  min-width: 380px;
  overflow-y: auto;
  background: linear-gradient(204deg, #1f202040 -7%, #b85cff00 33%), linear-gradient(162deg, #1d1f1d40 -10%, #2c88dd00 25%), linear-gradient(0deg, #1a1b1a, #1d1f1e);
  color: #FFFFFF;
  height: 100%;
  padding: 9px;
  margin: 1px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
`

const MenuContainer = styled.div`
  width: 280px;
 
  color: #FFFFFF;
  height: 100%;
  padding: 16px;
  border-radius: 8px;
  overflow: hidden;
  font-family: 'InterRegular' sans-serif;

   
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`

const UserInfoVX = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 8px;
`

const AvatarX = styled.img`
  width: 45px;
  height: 45px;
  background-color: #333;
  border-radius: 50%;
`

const Username = styled.div`
   .carduw{
   
   padding: 0.2em 0.4em 0.2em;
   border-radius: 28px;
   display: flex;
   align-items: center;
   cursor: var(--f-cursor-pointer);
   background-color: #16161a;
   gap: 9px;

   ul{
    display: inline-flex;
    align-items: center;
    

   h3{
       font-size: 12px;
       font-family: 'ProximaNova-Italic',monospace;
       color: #696c6e;
   }

   .uicn{
       color: #626568;
   }
 }
 }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  position: absolute;
  right: 5%;
  padding: 4px;
  top: 2%;
  
  &:hover {
    color: #999;
  }
`
 
const ViewProfileButton = styled.button`
  width: 100%;
  background-color: transparent;
  border: 4px solid #131614;
  color: #1cec7a;
  font-family: 'InterRegular',monospace;
  padding: 8px;
  border-radius: 24px;
  font-size: 14px;
  margin-bottom: 24px;
  
  &:hover {
    background-color: rgba(0, 255, 115, 0.1);
  }
`

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 83%;
  overflow-y: auto;
  

  .right-activ{
    background-color: transparent;
     color: #31e27b;
  }

  h6{
    font-family: 'InterSemiBold', monospace;
    font-size: 13px;
    color: #acb0b3;
  }

 
`

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  background: none;
  border: none;
  padding: 8px;
  text-align: left;
  font-family: Play, sans-serif;
  letter-spacing: 0.0025em;
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  font-size: 16px;
  font-weight: 100;
 color: #9fa1ad ;

  &:hover {
     color: #888b8a;
 
  }
  
  svg {
    width: 25px;
    height: 25px;
    opacity: 0.7;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #1b1c1d;
  margin: 8px 0;
  width: 100%;
`

const Container = styled.div`
 width: 60px;
 padding: 0.9em;
 height: 100%;

@media screen and (max-width: 750px) {
  display: none;
}
 
  
`;


const MarginSv  = styled.div`
   padding: 0.2em;
   border-radius: 9px;
   border: 1px solid #28292b;
   background-color: #28292b6c;
   display: flex;
   transform: scale(0.9);
   flex-direction: column;

   svg{
    height: 24px;
    width: 24px;
   }

`;


const MarginImags = styled.div`
 width: 100%;
 height: 100%;
 display: flex;
 justify-content: center;
 place-items: center;
 cursor: var(--f-cursor-pointer);

 li{
  display: flex;
  position: relative;
  align-items: center;

  .b1{
    position: absolute;
    animation: Rotate 6s infinite;
  }
 }

 @keyframes Rotate {
   0%{ transform: rotate(360deg) }
   100%{ transform: rotate(0deg) }
 }


 @media screen and (max-width: 580px) {
  display: none;

  
 }

`;

const Content = styled.div<{ theme: string }>`
display: flex;
flex-direction: column;
align-items: center;
gap: 8px;
   
   .bvd{
     height: 45px;
     width: 45px;
     background-color: ${(props) => getBorderColorFromThemex(props.theme)};
     display: flex;
     border-radius: 50%;
     justify-content: center;
     align-items: center;
     cursor: var(--f-cursor-pointer);
     margin-bottom: 1em;
     border: 2px solid #4246434a;
     transition: 1s all;

    svg{
      color: #1d201d;
    }


    &:hover{
      border: 2px solid #222c254a;
 
    }
   }


   button{
     
    border-radius: 9px;
    padding: 0.6em 0.7em 0.8em;
    display: flex; 
    justify-content: center;
    align-items: center;
    
   
   svg{
    width: 24px;
    height: 24px;
    display: table;
    color:  #8c9294;
    transition: color 0.2s;
   }


   &:hover{
        background-color: #bcc2bf13;
        border-radius: 9px;
        transition: all 0.2s;
     }
   }

 
`;


 
const HovercardContainer = styled.div`
cursor: auto;

display: flex;
align-items: center;
flex-direction: row;
  
 

    i{
        font-size: 17px;
        color: #cfd5f18b;
     
     }

    
     li{
      display: flex;
      align-items: center;
      flex-direction: row;
     
        margin-bottom: 0.2em;
     }


     .vier{
      padding-left: 14px;
      display: flex;
      align-items: center;
      flex-direction: column;
      
      h5{
        color: #dedff375;
      }
      p{
        max-width: 142px;
        font-size: 9px;
      }
     }
   
    
    
     span{
        backdrop-filter: blur(100px);
        padding: 0.3em 0.7em 0.3em;
        border-radius: 100px;
       position: relative;
       left: -37%;
       top: 13px;       
       font-family: 'Yantramanav', sans-serif;
       color: #cfc9c9b9;
       }

    
    p{
      font-size: 12px;
      color: #b6afaf75;
    }

`;



 

/////////////////// EVENT 


const ContainerN = styled.div`
width: 100%;
height: 100%;
display: flex;
justify-content: center;
place-items: center;
flex-direction: column;
text-align: center;
margin-top: 5%;

 li{
  margin: 0.9em;

 }

h4{
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  margin-top: 0.8em;
  color: #afb2b4;
}

p{
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 12px;
  margin: 0.4em;
  color: #676a6d;
}
`;

const  CardContainer = styled.div`
 
 display: flex;
 flex-direction: column;
 align-items: center;
 transition: all 2s;
 height: 93.6%;
 padding: 0.4em;
 overflow-y: auto;
 animation: LEFTANIM 1s alternate;

 
 @keyframes LEFTANIM {
  0%{ opacity: 0; }
  100%{ opacity: 1; }
 }


  @media screen and (max-width: 430px) {
       padding: 0.3em;
    }

`;


const EventsInfo = styled.div`

background-color: rgba(55, 57, 59, 0.062);
border-radius:9px;
background-size: cover;
margin-bottom: 0.9em;
padding: 1em;
`;


const ContentEvent = styled.div`

justify-content: space-between;
margin-bottom: 0.2em;

ul{ 
    margin: 0.8em;
    display: flex;
    flex-direction: column;
    align-items: start;
   
    h4{
        font-size: 11px;
        max-width: 450px;
        color: #717179;
        font-family: 'Inter', sans-serif;
    }

    h2{
      font-size: 23px;
       text-transform: uppercase;
      margin-bottom: 0.4em;
    }

    h5{
      color: #fc1736;
      font-size: 12px;
    }

}


.ImageEvent{
    border-radius: 13px;
    width: 100%;
    height: 14em;
}
`;


const ContentAboutButtons = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;

p{
font-size: 10px;
color: rgba(200, 199, 202, 0.651);
}

`;

 
const ButtonIn = styled.div`

display: flex;
flex-direction: row;
align-items: center;
font-family: 'Poppins', sans-serif;
color: #b7bec4;

background-color: rgba(246, 251, 255, 0.027);
border-radius: 13px;
padding: 0.9em 1em 0.9em;
margin: 0.9em;
border: 1px solid rgba(255, 255, 255, 0.11);
font-size: 11px;


li{
padding-left: 0.8em;
}

`;

/////////////////////// INVITE USER 


const WrappInvite = styled.div`

position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9345774;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  place-items: center;
  align-items: center;
  background-color: rgba(11, 12, 10, 0.349);
  background-image: url('/web/hdshfioef.png');

  @media screen and (max-width: 530px) {
  padding: 0.4em;
}
`;

const CardCode = styled.div`
background-color: #1f201f;
padding: 1em;
max-height: 90%;
width: 550px;
overflow-y: auto;
border-radius: 23px;
animation: AnimOps 1s linear;

 
@keyframes AnimOps {
  0%{ opacity: 0;}
  100% { opacity: 1;}
}
@media screen and (max-width: 530px) {
  width: 100%;
  border-radius: 23px;
  height: 90vh;
 
}
`;


const CardInfoowner = styled.div`
  display: flex;
  flex-direction: column;
  
  align-items: center;
  justify-content: space-between;
  
  background-color: rgba(31, 31, 34, 0.055);
  background-image: url('/icons/084mnfgjhdgdfyt4n.png');
   
   padding: 0.9em 2em 0.9em;
   margin: 1em;
    margin-bottom: 0em;
  .logo{
    border-radius: 16px;
  }

  li{
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 1em;
   
    h5{
      margin-bottom: 0.2em;
      font-size: 16px;
      font-family: 'Europa Grotesk';
      color: rgba(190, 201, 192, 0.774);
    }
   
    p{
      font-family: 'InterSemiBold', monospace;
      font-size: 13px;
      color: #bfc2c9f6;
    }
  }

  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-in-out forwards;
  @keyframes fadeInUp {
    0%{ opacity: 0; transform: translateX(20%)}
    100%{ opacity: 1; transform: translateX(0)}
  }
  
`;

const CustomScrollbar = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 500px;
  table-layout: fixed;
  font-size: 0.75rem; 
  text-transform: uppercase;
`;

const Thead = styled.thead``;

const Tr = styled.tr`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const Th = styled.th`
  padding: 1rem 0; 
  text-align: left;
  font-weight: 600; 
  
  &:nth-child(2) {
    text-align: center;
  }
  
  &:nth-child(3) {
    text-align: right;
  }
`;

const Tbody = styled.tbody`
  width: 100%;
  font-weight: 600;

  font-family: 'ProximaNova-Italic', sans-serif;
  color: white;

  & > *:nth-child(odd) {
    background-color: #101011; 
    border-radius: 12px;
  }
`;

const Td = styled.td`
  display: flex;
  align-items: center;
  justify-content: flex-start; 
  padding: 0.75rem 0; 

  &:first-child {
    border-radius: 6px 0 0 6px; 
    padding-left: 1rem;
  }

  &:last-child {
    justify-content: flex-end;
    border-radius: 0 6px 6px 0; 
    padding-right: 1rem; 
  }
`;

const CenteredTd = styled(Td)`
  justify-content: center;
  gap: 0.25rem; 
  padding: 1rem; 
`;

const BonusSpan = styled.span`
  font-weight: 600; 
  display: inline-flex;
  align-items: center;
  color: #19e256;

   img {
    height: 20px; 
    width: 26px; 
   padding-right: 0.4em;
  }
`;


const MarginTitle = styled.div`
  display: flex;
  margin-top: 1em;
  margin-bottom: 2em;
  width: 100%;
  justify-content: center;
  border-bottom: 1px solid rgba(183, 184, 189, 0.288);

   h1{
    font-size: 18px;
    padding: 1em;
     color: #a2aca6;
     border-bottom: 1px solid rgba(213, 214, 219, 0.753);
     font-family: 'ProximaNova-Italic';
   }
`;



const MargintopSelect = styled.div`
  width: 100%;
  display: flex;
  height: 3.5rem; 
  gap: 0.125rem; 
  overflow: hidden;
  border-top-left-radius: 0.75rem; 
  border-top-right-radius: 0.75rem; 
  
  .active{
   
    .DIC{
      filter: brightness(0); 
    }
  }

  .bits{
      background:#00ff6275;
     }
    .code{
      background:#da961940;
    }

  .button1{
    margin-left: auto; 
  display: grid;
  width: 41px; 
  cursor: var(--f-cursor-pointer);
  place-content: center;
  background:  #2c2c3040;
  transition: background-color 200ms, color 200ms; 
  
  &:hover {
    background-color: #16161b;
    color: white; 
  }

  svg {
    height: 1.25rem; 
    width: 1.25rem;  
  }
  }

  
  button{
    display: flex;
  height: 100%;
  
  flex: 1;
  cursor: var(--f-cursor-pointer);
  align-items: center;
  justify-content: center;
  gap: 0.75rem; 
  background:  #2c2c3040;
  font-size: 0.875rem; 
  font-weight: 600; 
  font-family: 'ProximaNova-Italic', sans-serif;
  text-transform: uppercase; 
  color: white;
  transition: background-color 150ms;
  
  &:hover {
    background-color: #16161b;
  }

  img {
    height: 1.25rem; 
    width: 1.25rem; 
     
  }
   .DIC{
    filter: brightness(10); 
   }
  span {
    display: none;

    @media (min-width: 640px) { /* sm:inline */
      display: inline;
    }
  }
    
  }

  .buttonclose{
    background:  #12131240;
    width: 100%;
    border-radius: 50%;
    padding: 5px;

  }
`;

const ContentCardCode = styled.div`
background:  #2c2c3040;
margin-top: 0.1em;
border-radius: 0 0 0.75rem 0.75rem;
padding: 1em;
overflow: hidden;
position: relative;
height: 280px;

 
@media screen and (max-width: 430px) {
  height: 220px;

}

`;


const ModalWrapper = styled.div`
   
   position: absolute;
  z-index: 10;
  bottom: 4px;
  left: 0;
  right: 0;
  
  margin: 0.4em;
 
  border-radius: 0.75rem; 
  background:  #0b0b0cfd;
  padding: 0;

  @media (min-width: 768px) {
    padding: 1.25rem; /* md:p-5 */
  }
`;

const FormContainer = styled.div`
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.25rem;   
  border-radius: 55px;  
  background:  #2c2c3040;
  
  button:disabled{
    background-color: rgba(151, 61, 61, 0.192);
    color: rgba(238, 231, 231, 0.432);
    font-weight: 300;
    cursor: not-allowed;
  }
  @media screen and (max-width: 430px) {
    background:  transparent;
    gap: 0.5rem;
}
`;



const ApplyButton = styled.button`
  padding: 0 1.25rem; 
  background-color: #d9e4de; 
  border: none;
  border-radius: 55px;  
  cursor: var(--f-cursor-pointer);
  font-family: 'XcSemibold';
  min-width: 140px;
  margin-right: 0.3em;
  font-size: 14px;
  height: 2.7rem; 
  color: black;
  
  
  &:hover {
    background-color: #1cbd51;   
  }

  @media screen and (max-width: 430px) {
 
    font-size: 15px;
    padding: 0.5em 0.7em 0.5em; 
}
`;

const InputWrapper = styled.div`
  position: relative;
  flex-grow: 1;
`;

const Input = styled.input`
  height: 20px; 
  width: 100%;
  font-size: 15px;
  font-family: 'InterSemiBold', monospace;
  background: transparent;
  padding: 1rem 1.25rem; 
  color: #d6d9e6; 

  placeholder {
    color: #B8BCD0;
  }
  &:focus {
    outline: none;
    box-shadow: none; 
  }
  &:disabled {
    opacity: 0.5;
  }
`;


const Wrapper = styled.div`
display: flex;
align-items: center;
position: relative;
justify-content: center;
height: auto;
 
@media (min-width: 768px) {
  height: 12rem; /* md:h-48 */
}
 
`;

const ImageContainer = styled.div`
position: relative;
z-index: 10;
aspect-ratio: 0.7 / 1; 
height: 100%;
  
img {
  left: 1px;
  height: 100%;
  object-fit: contain;
  transform: scale(1);
}

@media screen and (max-width: 430px) {
  display: none;
 
}
`;

const ContentContainer = styled.div`
flex-grow:5;
margin-left: -5rem;

@media (min-width: 640px) {
  margin-left: -5rem;
  margin-right: -4rem; 
  flex-grow:2;
}

@media screen and (max-width: 430px) {
  margin-left: 0rem;
}
`;

const PromoContainer = styled.div`
display: flex;
gap: 0.5rem;
width: auto;
padding: 1rem 0.4rem 0.5rem;
background: linear-gradient(90deg, rgba(119, 255, 157, 0.1) 0%, rgba(17, 17, 20, 0) 156.79%);
 
@media (min-width: 640px) {
  padding-left: 3rem; /* sm:pl-28 */
  padding-right: 2rem; /* sm:pr-8 */
}

@media screen and (max-width: 430px) {
  padding-left: 2rem; /* sm:pl-28 */
  padding-right: 2rem; /* sm:pr-8 */
  border-radius: 12px;
}
`;

const IconWrapper = styled.span`
display: flex;
height: 2rem;
width: 2rem;
flex-shrink: 0;
align-items: center;
justify-content: center;
border-radius: 50%;
background-color: #228b22; /* bg-eco-green-800 */
color: #32cd32; /* text-green-400 */
`;

const InfoWrapper = styled.div`
flex: 1;
display: flex;
flex-direction: column;
gap: 0.5rem;
text-align: left;
color: white;
`;


const Title = styled.p`
font-size: 14px;
font-weight: 600;
`;


const Description = styled.p`
font-size: 12px;
max-width: 280px;
margin-top: 0.25rem;

span {
  font-weight: 600;
  color: #32cd32; /* text-green-400 */
}

 
`;