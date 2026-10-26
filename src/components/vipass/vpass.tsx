import BattlePass from "@/components/vipass/progress";
import RewardsInterface from "@/components/vipass/reward";
import { ArrowLeft, Crown, X } from "lucide-react";
import styled from "styled-components"
import router from 'next/router';
import Image from "next/image";
import { User } from "@/types/user/types";
import {  useEffect, useRef, useState } from "react";
import { UserInfo } from "@/types/discord/usersearch";
import React from "react";
import Nvxre from '@/public/icons/verified-nvxre.png'
import Crownx from '@/public/favicon.png'
import { decrypt } from '@/core/security/encryption';
import axios from "axios";
import ViewBadgeObt from "@/components/clubr/menu.badge";
import { Levelinfo } from "@/types/user/level.up";
import LoadingPageView from "@club/resources/loading/market.loading";
import { StaticImageData } from 'next/image';
import Unbadge from '@/public/icons/badges/dsfdfdsfk.webp'
import Bronze from '@/public/icons/badges/bronze.png'
import Prata from '@/public/icons/badges/prata.png'
import Gold from '@/public/icons/badges/gold.png'
import Platinum from '@/public/icons/badges/platinum.png'
import Diamante from '@/public/icons/badges/diamante.png'
import Master from '@/public/icons/badges/badge_owner.png'
import Tooltip from '@club/components/uls/hover.idex';
import { benefitsList } from '../../club/.level/infos/list.benefics';
import BattlePassInterface from './battlepass';
import PurchaseModal from './purchase';
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";
import { GetInfo_nvxre_level } from "@/hooks/infolevel";
 


interface BadgeImageMap {
    [key: string]: StaticImageData;
}

 
const badgeImages: BadgeImageMap = {
    Novato: Unbadge,
    Bronze: Bronze,
    Prata: Prata,
    Gold: Gold,
    Platinum: Platinum,
    Diamante: Diamante,
    Master: Master
};

const BadgeInfo = ({ value } : {value: number}) => {
    let badgeLevel: string;
    
    if (value >= 0 && value <= 1) {
        badgeLevel = 'Novato';
    } else if (value >= 2 && value <= 7) {
        badgeLevel = 'Bronze';
    } else if (value >= 8 && value <= 21) {
        badgeLevel = 'Prata';
    } else if (value >= 22 && value <= 37) {
        badgeLevel = 'Gold';
    } else if (value >= 38 && value <= 69) {
        badgeLevel = 'Platinum';
    } else if (value >= 70 && value <= 99) {
        badgeLevel = 'Diamante';
    } else {
        badgeLevel = 'Master';
    }

    const badgeImage = getBadgeImage(badgeLevel);

    return (
        <>
            <Content>
                <Image src={badgeImage.src} alt="badgelevel" height={100} width={100} />
         </Content>
        </>
    )
}



const BadgeInfoXC = ({ value } : {value: number}) => {
  let badgeLevel: string;
  
  if (value >= 0 && value <= 1) {
      badgeLevel = 'Novato';
  } else if (value >= 2 && value <= 7) {
      badgeLevel = 'Bronze';
  } else if (value >= 8 && value <= 21) {
      badgeLevel = 'Prata';
  } else if (value >= 22 && value <= 37) {
      badgeLevel = 'Gold';
  } else if (value >= 38 && value <= 69) {
      badgeLevel = 'Platinum';
  } else if (value >= 70 && value <= 99) {
      badgeLevel = 'Diamante';
  } else {
      badgeLevel = 'Master';
  }

 
  return (
      <>
            <h5 className="h5">{badgeLevel}</h5>
      </>
  )
}



const getGradientByLevel = (level: string) => {
  switch (level) {
    case 'Novato':
      return 'var(--bonus-gradient-vip-container_novato)';
    case 'Bronze':
      return 'var(--bonus-gradient-vip-container_bronze)';
    case 'Prata':
      return 'var(--bonus-gradient-vip-container_silver)';
    case 'Gold':
      return 'var(--bonus-gradient-vip-container_gold)';
    case 'Platinum':
      return 'var(--bonus-gradient-vip-container_platinum)';
    case 'Diamante':
      return 'var(--bonus-gradient-vip-container_diamond)';
    case 'Master':
      return 'var(--bonus-gradient-vip-container_master)';
    default:
      return 'var(--bonus-gradient-vip-container_none)';
  }
};


const getBGByLevel = (level: string) => {
  switch (level) {
    case 'Novato':
      return 'var(--bonus-gradient-vip-container_novato)';
    case 'Bronze':
      return 'var(--vip-list-bg-bronze)';
    case 'Prata':
      return 'var(--vip-list-bg-silver)';
    case 'Gold':
      return 'var(--vip-list-bg-gold)';
    case 'Platinum':
      return 'var(--vip-list-bg-platinum)';
    case 'Diamante':
      return 'var(--vip-list-bg-diamond)';
    case 'Master':
      return 'var(--vip-list-bg-master)';
    default:
      return 'var(--bonus-gradient-vip-container_none)';
  }
};



const getInfoByLevel = (level: string) => {
  switch (level) {
    case 'Novato':
      return 'var(--bonus-gradient-vip-container_novato)';
    case 'Bronze':
      return 'var(--bonus-gradient-benefit_header_bronze)';
    case 'Prata':
      return 'var(--bonus-gradient-benefit_header_silver)';
    case 'Gold':
      return 'var(--bonus-gradient-benefit_header_gold)';
    case 'Platinum':
      return 'var(--bonus-gradient-benefit_header_platinum)';
    case 'Diamante':
      return 'var(--bonus-gradient-benefit_header_diamond)';
    case 'Master':
      return 'var(--bonus-gradient-benefit_header_master)';
    default:
      return 'var(--bonus-gradient-vip-container_none)';
  }
};


const getInfoXByLevel = (level: string) => {
  switch (level) {
    case 'Novato':
      return 'var(--bonus-gradient-vip-container_novato)';
    case 'Bronze':
      return 'var(--Button-bronze)';
    case 'Prata':
      return 'var(--Button-silver)';
    case 'Gold':
      return 'var(--Button-gold)';
    case 'Platinum':
      return 'var(--Button-platinum)';
    case 'Diamante':
      return 'var(--Button-diamond)';
    case 'Master':
      return 'var(--Button-master)';
    default:
      return 'var(--bonus-gradient-vip-container_none)';
  }
};
 

const getLevelRange = (value: number) => {
  if (value >= 0 && value <= 1) return { current: value, next: 2 };
  if (value >= 2 && value <= 7) return { current: value, next: 8 };
  if (value >= 8 && value <= 21) return { current: value, next: 22 };
  if (value >= 22 && value <= 37) return { current: value, next: 38 };
  if (value >= 38 && value <= 69) return { current: value, next: 70 };
  if (value >= 70 && value <= 99) return { current: value, next: 100 };
  if (value === 100) return { current: 100, next: '∞' }; // Nível máximo
  return { current: value, next: value + 1 };
};


function getBadgeLevel(value: number): string {
  if (value >= 0 && value <= 1) {
    return 'Novato';
  } else if (value >= 2 && value <= 7) {
    return 'Bronze';
  } else if (value >= 8 && value <= 21) {
    return 'Prata';
  } else if (value >= 22 && value <= 37) {
    return 'Gold';
  } else if (value >= 38 && value <= 69) {
    return 'Platinum';
  } else if (value >= 70 && value <= 99) {
    return 'Diamante';  
  } else {  
    return 'Master'; 
  }
}
// Função para obter a imagem do distintivo com base no nível
function getBadgeImage(badgeLevel: string): StaticImageData {
    return badgeImages[badgeLevel];
}



const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lock-icon"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0110 0v4"></path>
  </svg>
);



const levels = [ 
  { name: 'Bronze', key: 'Bronze', image: '/icons/badges/bronze.png' },
  { name: 'Prata', key: 'prata', image: '/icons/badges/prata.png' },
  { name: 'Gold', key: 'Gold', image: '/icons/badges/gold.png' },
  { name: 'Platinum', key: 'platinum', image: '/icons/badges/platinum.png' },
  { name: 'Diamante', key: 'diamante', image: '/icons/badges/diamante.png' },
  { name: 'Master', key: 'master', image: '/icons/badges/master.png' },
];

const renderLevelButtons = (currentLevel:any, selectedLevel: any, setSelectedLevel: any) => {
  const getLevelIndex = (level: any) =>
    levels.findIndex((lvl) => lvl.name.toLowerCase() === level.toLowerCase());

  const currentLevelIndex = getLevelIndex(currentLevel);

  return levels.map((level, index) => {
    const isLocked = index > currentLevelIndex;
    // Verifica se o botão é do nível selecionado pelo usuário ou o nível atual
    const isActive = 
      selectedLevel === level.name || (!selectedLevel && index === currentLevelIndex);
      
    return (
      <button
        key={level.key}
        className={isActive ? 'activebutton' : ''}
        onClick={() => setSelectedLevel(level.name)} // Define o nível selecionado
      >
        <Image src={level.image} alt={level.key} width={40} height={40} />
        {isLocked && <LockIcon />}
        <h2 className={level.key}>{level.name}</h2>
      </button>
    );
  });
};

// Função para renderizar a lista de benefícios do nível selecionado
const renderBenefits = (selectedLevel: any) => {
  if (!selectedLevel) return null;

  const levelBenefits = benefitsList.filter(
    (benefit) => benefit.level.toLowerCase() === selectedLevel.toLowerCase()
  );

  if (levelBenefits.length === 0) return null;

  return (
    <ul>
      {levelBenefits.map((benefit, index) => (
        <CardInfoBenefic key={index}>
          <li>
            <h2>{benefit.title}</h2>
            <span>{benefit.description}</span>
            {benefit.subDescription && <span>{benefit.subDescription}</span>}
          </li>
          <section>
            <img src={benefit.image} alt={benefit.title} />
          </section>
        </CardInfoBenefic>
      ))}
    </ul>
  );
};

 
interface Props {
  user?: User | null;
}

export default function  Vpass({ user }: Props) {
    const [currentpage, setcurrentpage] = useState(1)
     const [dashboard, setdashboardX] = useState(0)
    const [ battlepass , setbattlepass] = useState(false)
  const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
  const [userInfox, setUserInfox] = useState <UserInfo | null>(null);
const [userInfoX, setUserInfoX] = useState <Levelinfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null); // Estado para o nível selecionado
const { isLoadinglevel, Datalevel } = GetInfo_nvxre_level();
  
  useEffect(() => {
     if (!isLoadinglevel && Datalevel) {
           setUserInfoX(Datalevel);
          setIsLoading(false);
        } 

    }, [isLoadinglevel,Datalevel]);
  

    const formatNumber = (num: number): string => {
      if (num >= 1e6) {
        return (num / 1e6).toFixed(num % 1e6 !== 0 ? 1 : 0) + 'M';
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(num % 1e3 !== 0 ? 1 : 0) + 'K';
      } else {
        return num.toString();
      }
    };   

    const userLevel = userInfo ? getBadgeLevel(userInfoX?.level ? userInfoX?.level : 0) : 'Novato'; 
    const gradient = getGradientByLevel(userLevel);
    const BG = getBGByLevel(userLevel)
    const Indo = getInfoByLevel(userLevel)
    const InfoCardlevel = getInfoXByLevel(userLevel);
    const { isLoadingx, userTeam, userInfoObject } = GetInfo_nvxre_xyloQuerier();

     const LevelXc  = userInfoX ? userInfoX?.level ? userInfoX?.level : 0 : 0;
     const { current, next } = getLevelRange(LevelXc);


  
  useEffect(() => {
   
   if (!isLoadingx && userInfoObject || userTeam) {
    setUserInfo(userInfoObject);     
   setUserInfox(userTeam);
   }
}, [userInfoObject,userTeam,isLoadingx]);

 
 const handleclose = () => {
  setdashboardX(0);

  const { vpass, ...rest } = router.query;
  router.push({
    pathname: router.pathname,
    query: rest  
  }, undefined, { shallow: true });
 
}



useEffect(() => {
  if (router.query.vpass === 'clubvision') {
    setdashboardX(5)
  }
}, [router.query]);


    return  dashboard == 5 && (
        <Container>

          
     

        {currentpage === 1 && (
        <>
          

         <ContainerHeader className="relative bg-black">
         {user && userInfo && (
         <div className="absolute left-2 top-1 z-[39940] dsfc ">
          
        

          <Marginprofile>
            
            {currentpage == 1 ? (
              <Button onClick={handleclose}>
            
              <X size={24}/>
              
          </Button>      
              
            ) : (
              <Button onClick={() => setcurrentpage(1) }>
            
              <ArrowLeft  size={24}/>
              
          </Button>
            )}

           <div className="sjebc">
           <div  className="logo">
           <Image 
         
         src={user.avatar} 
         alt={user.username}
         height={100}
         width={100}
       />

           </div>
       
         <li>
           <ul className="udcs">
           <h1>{user.username}</h1>

           {userInfo.verified && (
       <>
 
 <svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="24" width="24" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg>
       </>
    )}
               {userInfo.nvxre && (
               <>
               <Image src={Nvxre} alt="nvxre" height={20}/>  
               </>
               )}  

         {userInfo.nvrp && (
               <>
               <Image  className="logoroda" src={Crownx} alt="Moderator" height={20}/>
               </>
               )}  
           </ul>
          
           <span className="carduw" onClick={() => router.push(`/@${userInfox?.name}`)} >
             <img src="/nvrp/20240520_081457.png" 
              alt="novision clubr"
              height={15}
              width={15}
             />

              <ul>
              <h3>{userInfox?.name}</h3>
              <h3 className="uicn">{userInfo?.subdominio}</h3>
              </ul>
           </span> 
         </li>
         </div>
       
       </Marginprofile> 
 
         </div>
      )}
       <HeaderCg />
      
      <MarginV className="absolute z-10 flex h-screen flex-col items-center justify-between p-4">
       
          
  
      <Overlay> 


        <div className="flex w-full h-screen justify-center  max-w-3xl flex-col items-center gap-4">

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00ff6a]">
                <Crown className="h-5 w-5 text-black" />
              </div>
              <h1 className="text-3xl font-bold text-[#00ff6a]">TEMPORADA CLUBR</h1>
            </div>
            <p className="text-sm text-gray-300  uppercase ">TEMPORADA CLUBR - Extraction</p>
          </div>

       
          <div className="mt-4 grid w-full gap-4 md:grid-cols-2">
      
            <div className="flex flex-col">
              <button onClick={() => setcurrentpage(3)} className="flex items-center justify-between rounded-md bg-[linear-gradient(to_right,_#4ec56c_40%,_transparent_100%)]
 px-6 py-4 text-black hover:bg-[#292c2a57]">
                <span className="text-lg font-bold">VER PASSE DE BATALHA</span>
                <div className="flex items-center gap-1">
                  <Image src={'/icons/facegraffiti.png'} alt='c' height={20} width={20} />
                </div>
              </button>
              <p className="mt-2 text-center text-xs text-gray-300">
                TENHA ACESSO AO PASSE VIP E RESGATE
                <br />
                RECOMPENSAS EXCLUSIVAS.
              </p>
            </div>

          
            <div className="flex flex-col">
              <div className="relative">
                <button onClick={() => setbattlepass(true) } className="flex w-full items-center justify-between rounded-md bg-[linear-gradient(to_right,_#4ec562_40%,_transparent_100%)] px-6 py-4 text-black hover:bg-[#292c2a57]">
                  <span className="text-lg font-bold">COMPRAR CONTRATO</span>
                  <div className="flex items-center gap-1">
                    <Crown className="h-5 w-5" />
                    <span className="font-bold">MISSÕES</span>
                    <span className="text-xs line-through opacity-70">+100</span>
                  </div>
                </button>
                <div className="absolute -right-1 -top-3 rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                  6% OFF
                </div>
              </div>
              <p className="mt-2 text-center text-xs text-gray-300">
               PARA TER O ACESSO AO PASSE VIP COM PRIME + VOCÊ PRECISA
                <br />
               ADQUIRIR O CONTRATO DE MISSÕES
              </p> 
            </div>
          </div>

         
          <div className="mt-8 flex w-full max-w-md flex-col gap-3">
             
            <button onClick={() => setcurrentpage(2) } className="relative w-full rounded-md bg-[linear-gradient(to_right,_#4ec56c_40%,_transparent_100%)] font-['Inter'] px-6 py-3 text-black transition hover:bg-[#292c2a57]">
              MEU LEVEL CLUBR
              <div className="absolute bottom-3 right-6 h-3 w-3 animate-pulse rounded-full bg-black"></div>
            </button>
            <p className="text-[8px] font-['ProximaNova-Italic'] max-w-[540px] text-center text-[#a7aba9]">thenovision não é afiliado ou endossado pela Take-Two, Rockstar North Interactive ou qualquer outro detentor de direitos. Todas as marcas utilizadas pertencem aos seus respectivos proprietários.</p>
          </div>
        </div>
 
        <div className="h-16"></div>
        </Overlay>
      </MarginV>
    </ContainerHeader>
        </>
        )}

         {battlepass && <PurchaseModal isOpen={battlepass} onClose={() => setbattlepass(false)} />}
         {currentpage === 3 && <BattlePassInterface 
         
        
         viewuser={
          <>
            {user && userInfoX && userInfo && (
              <>
 <Marginprofile>
            
            
              <Button onClick={() => setcurrentpage(1) }>
            
              <ArrowLeft  size={16}/>
              
          </Button>
           

           <div className="sjebc">
           <div  className="logo">
           <Image 
         
         src={user.avatar} 
         alt={user.username}
         height={100}
         width={100}
       />

           </div>
       
         <li>
           <ul className="udcs">
           <h1>{user.username}</h1>

           {userInfo.verified && (
       <>
 
 <svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="24" width="24" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg>
       </>
    )}
               {userInfo.nvxre && (
               <>
               <Image src={Nvxre} alt="nvxre" height={20}/>  
               </>
               )}  

         {userInfo.nvrp && (
               <>
               <Image  className="logoroda" src={Crownx} alt="Moderator" height={20}/>
               </>
               )}  
           </ul>
          
           <span className="carduw" onClick={() => router.push(`/@${userInfox?.name}`)} >
             <img src="/nvrp/20240520_081457.png" 
              alt="novision clubr"
              height={15}
              width={15}
             />

              <ul>
              <h3>{userInfox?.name}</h3>
              <h3 className="uicn">{userInfo?.subdominio}</h3>
              </ul>
           </span> 
         </li>
         </div>

       </Marginprofile> 
              </>
            )}
          </>
         } />} 

            {currentpage === 2 && (
                <>
              
         <MarginV3>
 
        

       <Contentx>

       {user && userInfoX && (
                      <>
                     <Club  >
      
      <Containerx gradient={BG}>
                    {user && userInfo && (
         <div className="absolute left-2 top-1 z-[39940] gap-1  dsfc">
          
        

          <Marginprofile>
            
            
              <Button onClick={() => setcurrentpage(1) }>
            
              <ArrowLeft  size={16}/>
              
          </Button>
           

           <div className="sjebc">
           <div  className="logo">
           <Image 
         
         src={user.avatar} 
         alt={user.username}
         height={100}
         width={100}
       />

           </div>
       
         <li>
           <ul className="udcs">
           <h1>{user.username}</h1>

           {userInfo.verified && (
       <>
 
 <svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="24" width="24" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg>
       </>
    )}
               {userInfo.nvxre && (
               <>
               <Image src={Nvxre} alt="nvxre" height={20}/>  
               </>
               )}  

         {userInfo.nvrp && (
               <>
               <Image  className="logoroda" src={Crownx} alt="Moderator" height={20}/>
               </>
               )}  
           </ul>
          
           <span className="carduw" onClick={() => router.push(`/@${userInfox?.name}`)} >
             <img src="/nvrp/20240520_081457.png" 
              alt="novision clubr"
              height={15}
              width={15}
             />

              <ul>
              <h3>{userInfox?.name}</h3>
              <h3 className="uicn">{userInfo?.subdominio}</h3>
              </ul>
           </span> 
         </li>
         </div>
        
       </Marginprofile> 
 
         </div>
      )} 
      {isLoading ? (<Nms>
              <LoadingPageView />
           </Nms>) :  userInfo  !== null ? (  
               <>
         

        <BenefictCardcONT  gradient={gradient}>
          <div className="flex flex-col max-w-[450px] border-r  p-1  border-[#2e302fce] overflow-auto">
          
          <BattlePass Info={userInfoX}  />
           
           <li>
           
           <MarginInformation className='cards'>
           
           <li className='li'>
      <img src='/icons/coins/xp-clubvision.webp' alt='xp' height={20} width={20} />
        <p>{formatNumber(userInfoX.xp ? userInfoX.xp : 0)}</p>
      </li>

   

<li className='li'>
  <img src='/nvrp/cla.webp' height={20} width={20} />
        <p>{formatNumber(userInfoX.clubactivity ? userInfoX.clubactivity : 0)}</p>
      </li>

           
           
           <li className='li'>
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a2a8a4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-tickets-plane"><path d="M10.5 17h1.227a2 2 0 0 0 1.345-.52L18 12"/><path d="m12 13.5 3.75.5"/><path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8"/><path d="M6 10V8"/><path d="M6 14v1"/><path d="M6 19v2"/><rect x="2" y="8" width="20" height="13" rx="2"/></svg>
           <p>{formatNumber(userInfoX.invite ? userInfoX.invite : 0)}</p>
           </li>
           
           
           
           <li className='li'>
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a2a8a4"stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-square-more"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg>
           <p>{formatNumber(userInfoX.messages ? userInfoX.messages : 0)}</p>
           </li>
           
           <Tooltip title={`Tempo de conexão - ${userInfoX.voice.time ? userInfoX.voice.time : 0} `}>
           <li className='li'> 
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a2a8a4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-podcast"><path d="M16.85 18.58a9 9 0 1 0-9.7 0"/><path d="M8 14a5 5 0 1 1 8 0"/><circle cx="12" cy="11" r="1"/><path d="M13 17a1 1 0 1 0-2 0l.5 4.5a.5.5 0 1 0 1 0Z"/></svg>
           <p>{formatNumber(userInfoX.voice.connections ? userInfoX.voice.connections : 0)}</p>
           </li>
           
           </Tooltip>
           
           <Tooltip title={`Mensagens - ${formatNumber(userInfoX.contexts.message ? userInfoX.contexts.message : 0)} `}> 
           <li className='li'>
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a2a8a4"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shell"><path d="M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44"/></svg>
           <p>{formatNumber(userInfoX.contexts.user ? userInfoX.contexts.user : 0)}</p>
           </li>
           </Tooltip>
           
           
           </MarginInformation>
           </li>

           <RewardsInterface />
          </div>
  
    
           <div className="flex flex-col max-w-[450px] overflow-auto">
           <ContentbV>
           <li className='w-full text-center items-center'>
           <h3>Sistema VIP exclusivo</h3>
             <p>Desbloqueie a melhor experiência </p>
           </li>
           <MarginVipsLevels>
           <ScrollingCardUserinfo> 
           {renderLevelButtons(userLevel, selectedLevel, setSelectedLevel)}
               </ScrollingCardUserinfo>
           </MarginVipsLevels>
         </ContentbV>

         <ContentCardv>
         <CardInfoLevel gradient={Indo}>
            <h3>VIP {current}-{next === '∞' ? 
             <>
             <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-infinity" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
 <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
 <path d="M9.828 9.172a4 4 0 1 0 0 5.656a10 10 0 0 0 2.172 -2.828a10 10 0 0 1 2.172 -2.828a4 4 0 1 1 0 5.656a10 10 0 0 1 -2.172 -2.828a10 10 0 0 0 -2.172 -2.828" />
</svg>
             </> : next}</h3>

            <CardInfolevelX gradient={InfoCardlevel}>
            <BadgeInfoXC value={userInfoX.level} />     
            </CardInfolevelX>
         </CardInfoLevel>

         
       {/* Renderiza os benefícios do nível selecionado */}
       {renderBenefits(selectedLevel)}
         </ContentCardv> 


 
           
           
                     </div>
           
         </BenefictCardcONT>

       


        </>
       ) : null}


      
      </Containerx>
       </Club>
                      </>
                  )}

        
       </Contentx>
         </MarginV3>
                </>
            )}
          
        </Container>
    )
}


interface ViewHeaderProps {
  gradient: string;
}
 
interface HorizontalScrollContainerProps {
  children: React.ReactNode;
}

const ScrollingCardUserinfo: React.FC<HorizontalScrollContainerProps> = ({
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isModalOpen) {
      setIsDragging(true);
      setStartX(e.clientX);
      setScrollLeft(containerRef.current!.scrollLeft);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
  
    if (!isModalOpen) {
      e.preventDefault();
      const x = e.clientX - startX;
      const walk = x * 1; 
      containerRef.current!.scrollLeft = scrollLeft - walk;
    }
  };


  const handleMouseUp = () => {
    setIsDragging(false);
  };

 
  return (
    <CardViewList
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
    >
      <ContentList >{children}</ContentList>
    </CardViewList>
  );
};






const MarginS = styled.div`
  display: flex;
 
  flex-direction: column;
  padding: 0.9em 1em 0.9em;


  hr{
     width: 250px;
     border-color: #fff;
    }

.section{
    display: inline-flex;
    align-items: center;
    margin-top: 3em;
 
    img{
      margin: 0.4em;
    }
  } 


  h6{
    margin: 0.8em;
    color: rgb(82, 83, 88);
    font-size: 15px;
    font-family: 'ProximaNova-Italic';
  }


  button{ 
    display: inline-flex;
    align-items: center; 

     
    h4{
    font-size: 12px;
    font-family: 'Inter';
    color: rgb(131, 133, 139);
    }

    i{
      padding-left: 0.8em;
      font-size: 11px;
      color: #4a4b50;
    }
  }

`;

const CardViewList = styled.div`
   
  width: 100%;
  overflow-x: auto;
  cursor:  var(--f-cursor-grab);

:active {
cursor:  var(--f-cursor-grabbed);
}

 
`;


const CardInfoBenefic = styled.div`
  margin: 0.7em;
  border-bottom: 2px solid #45484b47;
  padding: 0.8em 0 0.8em;
  display: flex;
  align-items: center;
  justify-content: space-between;

  li{
    display: flex;
    flex-direction: column;
  }


  h2{
    font-family: 'InterSemiBold', monospace;
    font-size: 15px;
  }

  span{
    font-family: 'InterSemiBold', monospace;
    font-size: 12px;
    padding: 0.3em 0 0.3em;
    color: #b0b4bd;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 270px;
   
  }


  p{
    font-family: 'InterSemiBold', monospace;
    font-size: 11px;
    color: #16d86e;
  }


  section{
     background-color: rgba(29, 28, 32, 0.815);
     height: 70px;
     border: 2px solid #2e2e31;
     padding: 0.3em 0.5em 0.3em;
     border-radius: 50%;
     width: 70px;
     display: flex;
     align-items: center;

     img{
      width: 100%;
      height: auto;
     }
  }


  @media screen and (max-width: 530px) {
     section{
      display: none;
     }
  }
`;
 

const ContentList = styled.section`

  display: inline-flex;
  align-items: center;
   
 
`;

////
const ContentCardv = styled.div`
   background-color: rgba(21, 22, 22, 0.384);
   border-radius: 11px;
   padding: 1em;
   margin-bottom: 1em;
   
`;

const CardInfoLevel = styled.div<ViewHeaderProps>`
 background-image: ${({ gradient }) => gradient};
 padding: 0.8em 0.8em 0.8em;
 width: 100%;
 border-radius: 12px;
 display: flex;
 align-items: center;
 justify-content: space-between;

 h3{
  display: flex;
  align-items: center;
 }
`;

const CardInfolevelX = styled.div<ViewHeaderProps>`
    font-family: 'Vultra';
    color: #0f0e0e;
    background-image: ${({ gradient }) => gradient};
    font-size: 13px;
    padding: 0.3em 1em 0.3em;
    border-radius: 5px;
`;
const BenefictCardcONT = styled.div<ViewHeaderProps>`
 
  border-radius: 19px ;
  min-width: 50vw;
  gap: 6px;
  padding: 0.8em 0.8em 0.8em;
  overflow: auto;
  height:98vh;
  backdrop-filter: blur(23px);
 margin: 0.3em;

z-index: 1428;
 
  display: flex;
  justify-content: space-around;
  align-items: top;
   

  background-size: 100% var(--tw-custom-background-size-height);
   background-image: ${({ gradient }) => gradient};
   background-size: cover;
   background-repeat: no-repeat;
 

  @media screen  and (max-width: 530px){
     width: 100vw;
  }

  animation: fadeInPox 0.5s ease-in-out;
  @keyframes fadeInPox {
        from {
        opacity: 0;
        transform: translateX(100%);
        }
        to {
        opacity: 1;
        transform: translateX(0%);
        }
    }
`;

const MarginInformation = styled.div`
 
  padding: 0.6em;
  width: 100%;
  gap: 12px;
   
   border-radius: 8px;
    display: flex;
    margin-bottom: 0.9em;
  align-items: center;
  justify-content: space-evenly;
   
  .li{
    display: flex;
    gap: 8px;
   margin-bottom: 0;
    p{
      font-size: 15px;
      color: rgb(122, 125, 128);
      font-family: 'InterSemiBold', monospace;
    }
  }

  .rotate{
    animation: Rotate 1s linear infinite;
  }

  @keyframes Rotate {
    0% { transform: rotate(360deg) }
    100% { transform: rotate(0) }
  }

  @media screen and (max-width: 530px) {
    gap: 7px;
    width: 100vw;
   }
`;

const ContentbV = styled.div`
  margin-bottom: 0.4em;

 h3{
  font-size: 13px;
  color: #bbbcc4;
  font-family: 'InterSemiBold', monospace;
 }

 p{
  font-size: 11px;
  color: #6f7075;
 }
`;

const MarginVipsLevels = styled.div`
  margin-top: 0.4em;
  border-radius: 12px;
  padding: 0.9em 0 0.9em;
 
  button{
    margin: 0.4em;
    width: 110px;
    height: 110px;
    padding: 0.7em 0.9em 0.7em;
    border-radius: 11px;

    h2{
      font-size: 14px;
      font-family: 'InterSemiBold', monospace;
      margin: 0.25rem;
    }


    &:hover{
         background-color: rgba(21, 22, 22, 0.384);
    }
  }

  .activebutton{
      background-color: rgba(21, 22, 22, 0.384);
  }
  .Bronze{
    color: #725031;
  }

  .prata{
    color: silver
  }
  .Gold{
    color: gold;
  }

  .diamante{
    color:  #f542b9;
  }

  .platinum{
    color: #ad47c7;
  }

  .master{
    color: #1ceb49;
  }


`;

const Benefict = styled.div`
   border-radius: 11px;
   background-color: #141516;
   padding: 0.7em 1em 0.7em;
   margin: 0.5em;
   display: flex;
   flex-direction:column ;
   

  p{
    font-size: 12px;
    font-family: 'InterSemiBold', monospace;
    color:rgba(111, 112, 121, 0.788);
  }

  a{
    text-align: center;
    width: 100%;
    color: #11d35b;
    font-size: 11px;
    margin-top: 0.3em;
    
    i{
      margin-top: 0.2em;
    }
  }
`;

const Club = styled.div`
 
  width: 100%;
 height:100vh;
 position: fixed;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 z-index: 28743;
 display: flex;
 justify-content: right;
 place-items: center;
backdrop-filter: blur(22px) ;
background-color: rgba(27, 29, 28, 0.521);
`;
const Containerx = styled.div<ViewHeaderProps>`

   display: flex;
   flex-direction: column;
   gap: 8px;
   justify-content: center;
   overflow: auto;
  height:98vh;

`;

 



/////////// LEVEL 


const Nms = styled.div`
 display: inline-flex;
 align-items: center;
 justify-content: center;
 width: 100%;
 padding: 1em;
`;
const Contentx = styled.div`
   display: inline-flex;
   align-items: center;
   position: absolute;
   right: 3px;
   margin: 1em;
   z-index: 9948;
 

 
`;
 
 
 const ContainerLevel = styled.div`
 
 
 position: relative;

   .shapev{
     width: 230px;
   }
   h1{
    text-align: center;
   font-family: 'Europa Grotesk';
 
   color: rgb(185, 181, 206);
   
  }
   .Onegs{
    position: absolute;
    top: 2px;
   }
  .marginselectse3{
    position: absolute;
    width: 74%;
    left:0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%;
  }

  ul{
    display: inline-flex;
    align-items: center;

     h6{
      font-family: 'ProximaNova-Italic', monospace;
      color: #9f9eac;
      font-size: 14px;
     }
  }

  .avatar{
     border-radius: 50%;
     border: 2px solid #565664;
  }

  
 `;


 const Card = styled.div`
   margin: 1em;
   display: flex;
   flex-direction: column;
   padding: 1em 0 0;
   gap: 2px;


   .cards{
    padding: 0.4em 1em 0.4em;
    backdrop-filter: blur(34px);
    border-radius: 9px;
   
    font-family: 'XcSemibold', monospace;
    font-size: 17px;
    color: rgb(167, 170, 175);
   }
 

  h4{
    font-family: 'ProximaNova', sans-serif;
    font-size: 15px;
    color: rgb(97, 99, 102);
    font-weight: 300;
   
  }

  .h5{
    font-family: 'Vultra';
    color: silver;
    font-size: 25px;
    padding-left: 2em;
  }

  .section{
    display: inline-flex;
    align-items: center;
   
  }
 

  span{
    display: inline-flex;
    align-items: center;
    width: 230px;
    justify-content: space-between;
  }
 
  .hubdusf{
    display: flex;
    
    flex-direction: column;
    margin-bottom: 2em;
    margin: 2em;
    margin-left: 0.3em;


    i{
      margin: 1px;
      color: #bebec484;
    }

    h5{
      font-size: 15px;
      color: #bec9c1bc;
      padding-left: 0em;
    } 

     
    h3{
      font-size: 12px;
      color: #4e524ffb;
    }
  }

  h5{
      color: #bebec484;
     
      display: inline-flex;
      font-size: 11px;
      align-items: center;
 
      .ds{
        padding: 0 0.2em 0;
      }
      .di{
        margin-left: -0.2em;
      }
    }

   
 `;

const Container = styled.div`
   z-index: 999999;
   position: fixed;
   right: 0;
   left: 0;
   top: 0;
   bottom: 0;
   width: 100%;
   height: 100%;
 
   .dsfc{
    margin: 2em;
   }
  `;

const Marginprofile = styled.div`
display:  flex;
align-items: center;
 
gap: 8px;

   transform: scale(0.9);
  .sjebc{
    display: flex;
  gap: 8px;
  flex-direction: row;
  }

  .logo{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
     
    border: 2px solid #1f2020;
    img{
        width: 50px;
        height: 50px;
    border: 1px solid #262729;
    border-radius: 50%;
    }
  }
   
    section{
        height: 90px;
    }

  .udcs{
    display: flex;
    align-items: center;
    gap: 8px;

    h1{
      font-size: 19px;
    }
  }

  .carduw{
   
    padding: 0.2em 0.4em 0.2em;
    border-radius: 28px;
    display: flex;
    align-items: center;
    cursor: var(--f-cursor-pointer);
    background-color: rgba(76, 77, 79, 0.434);
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


 
`;

const Button = styled.button`
   
     
    /* mask-image: linear-gradient(180deg, #000 60%, #000 100%); */

   ul{
    display: flex;
    align-items: center;
   }
    h3{
        font-size: 11px;
        font-weight: 500;
        font-family: 'Inter', monospace;
        text-transform: uppercase;
        
    }
  
  
`;
 
const MarginV = styled.div`
 
   display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
   
position: absolute;
align-items: center;
left: 0;
right: 0;
bottom: 0;
top: 0;
background: linear-gradient(to right, rgb(0, 0, 0) 10%, transparent 100%);
  
  @media screen and (max-width: 560px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const MarginV3 = styled.div`
 
   display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
   
position: absolute;
align-items: center;
left: 0;
right: 0;
bottom: 0;
top: 0;
background: linear-gradient(to right, rgba(0, 0, 0, 0.332) 2%, transparent 100%);
  
  @media screen and (max-width: 560px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
const Content = styled.div`
z-index: 8394;

`;










const HeaderCg = styled.header`
  width: 100vw;
  height: 100vh;
  
  
`;


const ContainerHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-y: hidden;
  
`;


const Overlay = styled.div`
  background-image: linear-gradient(to bottom, transparent, transparent 60%, rgba(0, 0, 0, 1)), url('/theim/characters/DGNDSI.png') !important;
  background-size: 50%;
    position: relative;
   
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  background-repeat: no-repeat;
  background-position: left;
  width: 100vw;
  height: 100vh;


  @media screen and (max-width: 430px) {
     width: 680px;
     height: 480px;
  }

  @media screen and (max-width: 380px) {
     width: 680px;
     height: 420px;
  }

  @media screen and (max-width: 375px) {
    height: 490px;
    width: 690px;
   }
`;
