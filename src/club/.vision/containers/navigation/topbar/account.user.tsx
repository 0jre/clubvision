import styled from "styled-components";
import React, {  useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import { UserInfo } from "@/types/discord/usersearch";
import ROUTENVX from "@/routes/routes";
import {UserConnectTwitch , UserConnectSteam} from '@/types/user/connections';
import { useRef } from "react";
import HeadGlobal from "@/club/head/glob.n";
import SubscriptionsUser from '@/club/.prime/customers/subscription.user';
import LevelProfile from '@/club/.level/top/infolevel.profile';
import 'react-loading-skeleton/dist/skeleton.css';
import LoadingPageView from "@club/resources/loading/market.loading";
import { UserData } from "@/types/user/types";
import { GetInfo_nvxre_xyloQuerier, nvxre_connections_we } from "@/hooks/InfoData";
import { nvxre_checkAuthentication } from "@/hooks/checkAuthentication";


  
interface Props {
  id: string;
  username: string;
  avatar: string;
 }
  

export default function AccountCentralVision () {
  const [user, setuser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoadinguser, data } = nvxre_checkAuthentication();

   useEffect(() => {
    if (!isLoadinguser && data ) {
      setIsLoading(false)
      setuser(data)
    }
  }, [data,isLoadinguser])

  return !isLoading && user && (
    <>
 
 <AccountCentral 
        id={user.user?.id}
        avatar={user.user?.avatar}
        username={user.user?.username}
    />
 
    </>
  )
}

  
const AccountCentral: React.FC<Props> = ({id,username,avatar}) => {
  
    const router = useRouter();
    const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
    const [UserConnectTwitch, setUserConnectTwitch] = useState<UserConnectTwitch | null>(null)    
    const [UserConnectSteam, setUserConnectSteam] = useState<UserConnectSteam | null>(null)
    const [isloading, setisloading ] = useState(true)
    const [isuserinfoconnect, setuserconnect] = useState(false)
    const [name, setname] = useState<string>('')
    const { isLoadingx, userTeam,userInfoObject } = GetInfo_nvxre_xyloQuerier();
    const { isLoading_we,Data_we} = nvxre_connections_we({ id });
   
  
  const [isVerified, setIsVerified] = useState(false);
  const [reasons, setReasons] = useState<string[]>([]);
 
const handleVerification = async () => {
  try {
    const response = await fetch('/api/club/verify-id', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Erro ao comunicar com o servidor');
    }
    const data = await response.json();
    if (data.isEligible) {
      setIsVerified(true);
      setReasons([]);
    } else {
      setIsVerified(false);
      setReasons(data.reasons);  
    }
  } catch (error) {
    // console.error('Erro ao verificar ID:', error);
  }
};

useEffect(() => {
  handleVerification();
}, []);


          function handleBack() {
            router.back(); 
          }

        useEffect(() => {
   if (!isLoadingx || !isLoading_we) {
   
     setisloading(false);
     } 
   }, [isLoadingx]);

   useEffect(() => {
   if (userInfoObject) {
   setUserInfo(userInfoObject);
    setname(userTeam.name)
     } 
   }, [userInfoObject]);

useEffect(() => {
  if (Data_we) {
  setUserConnectTwitch(Data_we.twitch);
  setUserConnectSteam(Data_we.steam);
  const hasTwitchConnection = Data_we.twitch !== null;
  const hasSteamConnection = Data_we.steam !== null;
 setuserconnect(!hasTwitchConnection && !hasSteamConnection);
  }
}, [Data_we]);


    return (
      <>
     <HeadGlobal Title={`Account Center | @${username}`} />
        <HeadGlobal Title={'Profile | Account Center'} />
      {isloading ? (  
        <>
  <CardProfileMain>
      <div style={{ height: '100vh', width: '100%',  }}>
      <LoadingPageView />  
      </div>
     </CardProfileMain>
        </>
       ):userInfo !== null ? (
        <>
   <CardProfileMain>
           
           <ContentProfile>

           <Wlist>
    
   <img src={'/nvrp/20240520_081457.png'} style={{opacity: '0.1'}} alt='novision' height={25} width={25} /> 

    
    <button onClick={handleBack}>
 <i className="fi fi-br-cross"/>
</button>
 
  </Wlist>
            
     
  <CardSubinfo>

  <LevelProfile id={id} avatar={
   <>
    <Image src={avatar || 'https://i.imgur.com/mXit4fI.jpg'} className='md-full avatar' alt={username} height={100} width={100}/>
   </>
  } />
 
<h1>{username}</h1>
  
  <ContentU>
     <span className={userInfo?.type ? 'dotgreen' : 'dotred'}/>
     <h3>{userInfo?.type ? 'CONTA AUTORIZADA' : 'CONTA INATIVA'}</h3>
  </ContentU>

   
 <MarginConnected>

 {UserConnectSteam !== null && (
           <>

<span  onClick={() => router.push(`/@${name}`)} style={{ cursor: 'var(--f-cursor-pointer)'}}> 
                <Image 
    src={'/nvrp/20240520_081457.png'} 
    alt='novision' height={20} width={20}/>
   
    <h4>{name}</h4>
    </span>

           {UserConnectSteam.displayName && (
               <>
                <span>
                <Image 
    src={'/icons/app/steam_500.png'} 
    alt='steam' height={20} width={20}/>
   
    <h4>{UserConnectSteam.displayName}</h4>
    </span>
            </>
           ) }
           </>
           )}

    
{UserConnectTwitch !== null && (
           <>
       
 {UserConnectTwitch.display_nametwitch && (
           <>
       <span> 
       <Image 
    src={'/icons/app/twitch2.png'} 
    alt='twitch' height={20} width={20}/>
   
    <h4>{UserConnectTwitch.display_nametwitch}</h4>
    </span>
           </>
           ) }
             </>
             )}
      <span className="button" onClick={() => router.push(ROUTENVX.centraldash)}> 
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-move-up-right"><path d="M13 5H19V11"/><path d="M19 5L5 19"/></svg>
    </span>
 </MarginConnected>
    
 {!isVerified && reasons && (
      
      <div className="cardalert"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="w-8 h-8" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M85.57 446.25h340.86a32 32 0 0 0 28.17-47.17L284.18 82.58c-12.09-22.44-44.27-22.44-56.36 0L57.4 399.08a32 32 0 0 0 28.17 47.17z"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m250.26 195.39 5.74 122 5.73-121.95a5.74 5.74 0 0 0-5.79-6h0a5.74 5.74 0 0 0-5.68 5.95z"></path><path d="M256 397.25a20 20 0 1 1 20-20 20 20 0 0 1-20 20z"></path></svg>
      <p>

       {reasons } 

      </p>
      </div>
   
   )}

    <SubscriptionsUser prime={userInfo.prime ?  true : false} click={() => router.push(ROUTENVX.centralsubscription)} id={id} /> 
</CardSubinfo>
      

           </ContentProfile>
       </CardProfileMain>
        </>
      ) : isuserinfoconnect ? null :  
      (
        <>
  <HovercardContainer>
        <Infowalletnot>
            <ul>

                 <img src={avatar} alt="User Avatar" className="avatar"/>
                       <span> 
                       <i className="fi fi-bs-menu-dots"></i>
                       </span>
                       <img src="https://i.imgur.com/8alVoqT.jpg" alt="User Avatar" className="avatar"/>
                       
            </ul>
            <h1>Vincule sua conta steam ao seu visionid</h1>

            <TopV>
                <button onClick={() => router.push(ROUTENVX.signinSteam)}>
                  <h4>Vincular conta</h4>
                  <i className="fi fi-sr-people-network-partner i" />
                </button>
              </TopV>
        </Infowalletnot>
        </HovercardContainer>
        </>
      )}
  
        </>
   );
  }

 
 
/// MODAL ACCOUNT CENTER 
 

const HovercardContainer = styled.div`
left: 0;
top: 0;
right: 1;
display: flex;
z-index: 11323;
margin: 0.9em;
overflow: hidden;
height: 100%;
position: relative;
 
 
  animation: VIEWMOD 0.6s linear;
 
@keyframes VIEWMOD {
  0%{ transform: translateX(100%); opacity: 0; }
  100%{ transform: translateX(0%); opacity: 1; }
}

`;
 

const TopV = styled.div`
  width: 100%;
  
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 1em;


  button{
    border-radius: 12px;
    background: #0a0a0a;
    box-shadow: 0 0 1.5625rem rgba(25, 26, 27, 0.11);
    border: none;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.1em 0.3em 0.1em;
    transition: ease .2s;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
   transition: 1s all;
   display: flex;
   align-items: center;
  

   .i{
    transition: 1s all;
      color: #d3d3da;
        font-size: 19px;
        background-color: rgba(98, 98, 104, 0.068);
        margin-left: 0.4em;
        border-radius: 9px;
        height: 33px;
        width: 33px;
        padding: 6px 0.3em 0.2em;
    }

   h4{
    font-size: 12px;
    font-family: 'Inter', monospace;
    color: #e4dbdb;
    font-weight: 900;
    padding-left: 0.7em;
   }
  
   &:hover{
    background: linear-gradient(130deg, rgba(0,0,0,1) 0%, rgba(17,19,22,1) 100%);

     box-shadow: 0 0 1.5625rem #d4dbd652;

     h4{
      color: white;
     }
     
     i{
      color: #080808;
      background-color: rgb(228, 228, 238);
     }
   }
  }
`;

const Infowalletnot = styled.div`
 background-image: url('/icons/084mnfgjhdgdfyt4n.png');
  background: linear-gradient(204deg, #22232740 -7%, #b85cff00 33%), linear-gradient(162deg, #0e080840 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048));
  width: 430px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 4em 3em 2em;


  ul{
           display: flex;
           flex-direction: center;
           justify-content: center;
            align-items: center;

    span{
        display: flex;
          flex-direction: column;
          margin: 0.5em;

          i{
            font-size: 15px;
            color: #898b8f;
          }
    }
  }

   h1{
    font-family: 'ProximaNova-Italic', monospace;
    font-size: 16px;
    color: rgb(197, 199, 207);
    margin-top: 2em;
   }
  .avatar{
    border-radius: 13%; 
    width: 80px; 
    height: 80px;
  }

`;
 
 
const CardViewList = styled.div`
  
  background-color: rgba(209, 209, 214, 0.021);
  padding: 1em;
  border-radius: 12px;
  width: 100%;
  margin: 0.8em;
  margin-left: 0;
  margin-bottom: 2em;
  overflow-x: auto;
  cursor:  var(--f-cursor-grab);

:active {
cursor:  var(--f-cursor-grabbed);
}



  
`;


const ContentList = styled.section`

  display: inline-flex;
  
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

 
 const CardSubinfo = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   text-align: center;
   justify-content: center;
   width: 100%;
    
.cardalert{
    grid-column: span 8 / span 8; 

  margin-bottom: 0.9em;
  color: #f97316;
  background-color: rgba(102, 51, 0, 0.3); 
  font-size: 0.75rem; 
  display: flex;
  gap: 1rem;
  align-items: center; 
  text-align: start;
  padding: 0.5rem; 
  border-radius: 0.5rem; 
   
  p{
    width: 240px;
    font-size: 10px;
  }
  svg {
    width: 2rem; 
    height: 2rem; 
  }
  }
   .logoview{
    border-radius: 50%;
   }

   h1{
    font-family: 'ProximaNova-Italic', monospace ;
   }

   p{
    font-size: 12px;
    color: rgba(162, 166, 170, 0.902);
   }

    a{
      font-size: 12px;
      color: #21f568;
    }
   span{
    display: inline-flex;
    align-items: center;
   }


   section{
    cursor: var(--f-cursor-pointer);
   }
 `;


const MarginConnected = styled.div`
   display: inline-flex;
   align-items: center;
   justify-content: center;
   margin-bottom: 1em;
   gap: 8px;
   margin-top: 0.4em;
   transform: scale(0.9);
   
   span{
    display: inline-flex;
   align-items: center;
   background-color: rgba(136, 137, 143, 0.055);
   border-radius: 54px;
   padding: 0.4em 1em 0.4em;
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
 
 
const Wlist = styled.div`
width: 100%;
display: flex;
justify-content: space-between;
align-items: center;
padding: 0.3em 2em 0;


ul{ 
  display: flex;
  align-items: center;

  h3{
    font-size: 14px;
    font-family: 'XcSemibold';
    margin-left: 0.4em;
    color: rgb(210, 218, 213);
  }
}

button{
 color: #6d6d7276;  
 transition: 1s all;
 margin-top: 0.4em;

  i{
    font-size: 14px;
  }
  
&:hover{
  i{
    color: white;
  }
}
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

   
   .dful{
   
   left: 1em;
   top: 5px;
   color: #2d2d3076;
   width: 93%;
   display: inline-flex;
   align-items: center;

   }
`;

 
 
