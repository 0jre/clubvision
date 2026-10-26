import Logo from '@/public/nvrp/20240721_153235.webp'
import styled from "styled-components";
 
import axios from "axios";
 
import React, {useState,useEffect, useRef} from 'react'
 
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import Box from '@mui/joy/Box';
import BorderLinearProgress from '../../components/vision/progress';
import Crown from '@/public/icons/crown_badge.png'
import Unbadge from '@/public/icons/badges/dsfdfdsfk.webp'
import Bronze from '@/public/icons/badges/bronze.png'
import Prata from '@/public/icons/badges/prata.png'
import Gold from '@/public/icons/badges/gold.png'
import Platinum from '@/public/icons/badges/platinum.png'
import Diamante from '@/public/icons/badges/diamante.png'
import Master from '@/public/icons/badges/badge_owner.png'
import LinearProgress, { linearProgressClasses } from '@mui/joy/LinearProgress';
import Typography from '@mui/joy/Typography';
import Link from 'next/link';
import { benefitsList } from './infos/list.benefics';
import { Levelinfo } from '@/types/user/level.up';
import LoadingPageView from '@/resources/loading/market.loading';
import Tooltip from '@/components/uls/hover.idex';
import { decrypt } from '@/core/security/encryption';
import ROUTENVX from '@/routes/routes';
 
 

interface Nas {
  link: string;
  children: React.ReactNode;
}



interface Props {  
  id: string;
  children?: React.ReactNode;
}
 
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

 


export default function ClubVip ({id,children} : Props) {
  const [userInfo, setUserInfo] = useState <Levelinfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null); // Estado para o nível selecionado

 

  useEffect(() => {
      async function fetchUserInfo() {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/level/level.nvrp?userId=${id}`);
          const decryptedData = decrypt(response.data.log);
          const userInfoObject = JSON.parse(decryptedData);
          setUserInfo(userInfoObject);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching user info:', error);
          setIsLoading(false);
        } finally {
          setIsLoading(false)
        }
      }
     
      fetchUserInfo()
    }, []);
  

    const formatNumber = (num: number): string => {
      if (num >= 1e6) {
        return (num / 1e6).toFixed(num % 1e6 !== 0 ? 1 : 0) + 'M';
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(num % 1e3 !== 0 ? 1 : 0) + 'K';
      } else {
        return num.toString();
      }
    };   

    const userLevel = userInfo ? getBadgeLevel(userInfo.level) : 'Novato'; 
    const gradient = getGradientByLevel(userLevel);
    const BG = getBGByLevel(userLevel)
    const Indo = getInfoByLevel(userLevel)
    const InfoCardlevel = getInfoXByLevel(userLevel);

     const LevelXc  = userInfo ? userInfo.level : 0;
     const { current, next } = getLevelRange(LevelXc);



     const ButtonX: React.FC<Nas> = ({ link, children }) => {
      const handleClick = () => {
        window.open(link, '_blank');
      };
    
      return (
        <button onClick={handleClick}>
          {children}
        </button>
      );
    };


    const DynamicSvg = ({ level } : {level:any})  => {
      // Determina o tamanho da fonte com base no valor de "level"
      const fontSize = level >= 100 ? 8 : 12;
    
      return (
        <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
    
          <rect width="100" height="50" />
    
          <text
            x="32"
            y="30"
            fontFamily="Europa Grotesk"
            fontSize={fontSize}
            fill="black"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {level}
          </text>
        </svg>
      );
    };

    return(
        <Club  >
      
       <Container gradient={BG}>
                    
       {isLoading ? (<Nms>
               <LoadingPageView />
            </Nms>) :  userInfo  !== null ? (
                <>
              <MarginS>
              <li>

              {children}

   
              <MarginInformation className='cards'>
  
    <li className='li'>
      <img src='/icons/coins/xp-clubvision.webp' alt='xp' height={20} width={20} />
        <p>{formatNumber(userInfo.xp ? userInfo.xp : 0)}</p>
      </li>

   

<li className='li'>
  <img src='/nvrp/cla.webp' height={20} width={20} />
        <p>{formatNumber(userInfo.clubactivity ? userInfo.clubactivity : 0)}</p>
      </li>

     
      <li className='li'>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#262b28" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-tickets-plane"><path d="M10.5 17h1.227a2 2 0 0 0 1.345-.52L18 12"/><path d="m12 13.5 3.75.5"/><path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8"/><path d="M6 10V8"/><path d="M6 14v1"/><path d="M6 19v2"/><rect x="2" y="8" width="20" height="13" rx="2"/></svg>
        <p>{formatNumber(userInfo.invite ? userInfo.invite : 0)}</p>
      </li>



      <li className='li'>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#262b28"stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-square-more"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg>
        <p>{formatNumber(userInfo.messages ? userInfo.messages : 0)}</p>
      </li>

<Tooltip title={`Tempo de conexão - ${userInfo.voice.time ? userInfo.voice.time : 0} `}>
<li className='li'> 
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#262b28" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-podcast"><path d="M16.85 18.58a9 9 0 1 0-9.7 0"/><path d="M8 14a5 5 0 1 1 8 0"/><circle cx="12" cy="11" r="1"/><path d="M13 17a1 1 0 1 0-2 0l.5 4.5a.5.5 0 1 0 1 0Z"/></svg>
        <p>{formatNumber(userInfo.voice.connections ? userInfo.voice.connections : 0)}</p>
      </li>
      
</Tooltip>
  
  <Tooltip title={`Mensagens - ${formatNumber(userInfo.contexts.message ? userInfo.contexts.message : 0)} `}> 
      <li className='li'>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#262b28"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shell"><path d="M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44"/></svg>
        <p>{formatNumber(userInfo.contexts.user ? userInfo.contexts.user : 0)}</p>
      </li>
      </Tooltip>
  
     
    </MarginInformation>
              </li>
         <CardVip>
         <section>
         <ContainerLevel>
  
           <BadgeInfo value={userInfo.level}  />
          
          <div className="size-18 absolute Onegs left-1"><svg xmlns="http://www.w3.org/2000/svg" width="67" height="65" fill="none" viewBox="0 0 67 65" className="size-full">
          <g filter="url(#placement_2_svg__filter0_f_4201_58394)">
            <rect width="12" height="12" x="33.333" y="31.334" fill="#D1D1D1" rx="6"></rect></g><g filter="url(#placement_2_svg__filter1_f_4201_58394)"><rect width="12" height="12" x="18.667" y="18.668" fill="#D1D1D1" rx="6">
              </rect>
              </g>
              <path fill="url(#placement_2_svg__paint0_linear_4201_58394)" d="M23.473 19.984a6.236 6.236 0 0 0 4.115-2.376c2.23-2.894 6.594-2.894 8.823 0a6.236 6.236 0 0 0 4.115 2.376c3.621.483 5.804 4.264 4.412 7.641a6.236 6.236 0 0 0 0 4.752c1.392 3.377-.79 7.157-4.412 7.641a6.236 6.236 0 0 0-4.115 2.376c-2.229 2.894-6.594 2.894-8.823 0a6.236 6.236 0 0 0-4.115-2.376c-3.62-.483-5.803-4.264-4.412-7.642a6.236 6.236 0 0 0 0-4.75c-1.391-3.378.791-7.159 4.412-7.642">
                </path>
                <path fill="#E7E6E6" fill-opacity=".55" d="M23.473 19.984a6.236 6.236 0 0 0 4.115-2.376c2.23-2.894 6.594-2.894 8.823 0a6.236 6.236 0 0 0 4.115 2.376c3.621.483 5.804 4.264 4.412 7.641a6.236 6.236 0 0 0 0 4.752c1.392 3.377-.79 7.157-4.412 7.641a6.236 6.236 0 0 0-4.115 2.376c-2.229 2.894-6.594 2.894-8.823 0a6.236 6.236 0 0 0-4.115-2.376c-3.62-.483-5.803-4.264-4.412-7.642a6.236 6.236 0 0 0 0-4.75c-1.391-3.378.791-7.159 4.412-7.642">
                  </path>

                  <path stroke="url(#placement_3_svg__paint1_linear_4201_58394)" stroke-width=".667" d="M23.473 19.984a6.236 6.236 0 0 0 4.115-2.376c2.23-2.894 6.594-2.894 8.823 0a6.236 6.236 0 0 0 4.115 2.376c3.621.483 5.804 4.264 4.412 7.641a6.236 6.236 0 0 0 0 4.752c1.392 3.377-.79 7.157-4.412 7.641a6.236 6.236 0 0 0-4.115 2.376c-2.229 2.894-6.594 2.894-8.823 0a6.236 6.236 0 0 0-4.115-2.376c-3.62-.483-5.803-4.264-4.412-7.642a6.236 6.236 0 0 0 0-4.75c-1.391-3.378.791-7.159 4.412-7.642Z"></path>

                <DynamicSvg level={userInfo.level} />  
                

                  <g stroke-width=".667" opacity=".25">
                    <path stroke="url(#placement_2_svg__paint2_linear_4201_58394)" d="M19.495 15.18a8.976 8.976 0 0 0 5.922-3.42c3.327-4.318 9.84-4.318 13.166 0a8.976 8.976 0 0 0 5.923 3.42c5.403.721 8.66 6.362 6.583 11.401a8.975 8.975 0 0 0 0 6.84c2.077 5.04-1.18 10.68-6.583 11.401a8.976 8.976 0 0 0-5.923 3.42c-3.326 4.318-9.84 4.318-13.165 0a8.976 8.976 0 0 0-5.923-3.42c-5.403-.721-8.66-6.362-6.583-11.401a8.975 8.975 0 0 0 0-6.84c-2.077-5.04 1.18-10.68 6.583-11.401Z"></path>
                    <path stroke="url(#placement_2_svg__paint3_linear_4201_58394)" d="M19.495 15.18a8.976 8.976 0 0 0 5.922-3.42c3.327-4.318 9.84-4.318 13.166 0a8.976 8.976 0 0 0 5.923 3.42c5.403.721 8.66 6.362 6.583 11.401a8.975 8.975 0 0 0 0 6.84c2.077 5.04-1.18 10.68-6.583 11.401a8.976 8.976 0 0 0-5.923 3.42c-3.326 4.318-9.84 4.318-13.165 0a8.976 8.976 0 0 0-5.923-3.42c-5.403-.721-8.66-6.362-6.583-11.401a8.975 8.975 0 0 0 0-6.84c-2.077-5.04 1.18-10.68 6.583-11.401Z"></path>
                    </g>
                    <g stroke-width=".667" opacity=".15">
                      <path stroke="url(#placement_2_svg__paint4_linear_4201_58394)" d="m39.946 4.864 1.064 1.38a10.697 10.697 0 0 0 7.059 4.076l1.728.23c6.522.871 10.453 7.68 7.946 13.764l-.664 1.612a10.697 10.697 0 0 0 0 8.15l.664 1.612c2.507 6.084-1.425 12.892-7.946 13.763l-1.728.231a10.697 10.697 0 0 0-7.059 4.075l-1.064 1.382c-4.015 5.212-11.877 5.212-15.892 0l-1.064-1.382a10.697 10.697 0 0 0-7.059-4.075l-1.728-.23c-6.522-.871-10.453-7.68-7.946-13.764l.664-1.612a10.697 10.697 0 0 0 0-8.15l-.664-1.612C3.75 18.23 7.681 11.42 14.203 10.55l1.728-.231a10.697 10.697 0 0 0 7.059-4.075l1.064-1.381c4.015-5.213 11.877-5.213 15.892 0Z"></path>
                      <path stroke="url(#placement_2_svg__paint5_linear_4201_58394)" d="m39.946 4.864 1.064 1.38a10.697 10.697 0 0 0 7.059 4.076l1.728.23c6.522.871 10.453 7.68 7.946 13.764l-.664 1.612a10.697 10.697 0 0 0 0 8.15l.664 1.612c2.507 6.084-1.425 12.892-7.946 13.763l-1.728.231a10.697 10.697 0 0 0-7.059 4.075l-1.064 1.382c-4.015 5.212-11.877 5.212-15.892 0l-1.064-1.382a10.697 10.697 0 0 0-7.059-4.075l-1.728-.23c-6.522-.871-10.453-7.68-7.946-13.764l.664-1.612a10.697 10.697 0 0 0 0-8.15l-.664-1.612C3.75 18.23 7.681 11.42 14.203 10.55l1.728-.231a10.697 10.697 0 0 0 7.059-4.075l1.064-1.381c4.015-5.213 11.877-5.213 15.892 0Z"></path>
                      </g>
                      <defs>
                        
                      <linearGradient id="placement_2_svg__paint0_linear_4201_58394" x1="12.586" x2="59.866" y1="18.179" y2="22.703" gradientUnits="userSpaceOnUse"><stop stop-color="#717171"></stop><stop offset=".093" stop-color="#7B7B7B"></stop><stop offset=".23" stop-color="#CBCBCB"></stop><stop offset=".679" stop-color="#D1D1D1"></stop><stop offset=".799" stop-color="#818181"></stop><stop offset=".836" stop-color="#9B9B9B"></stop></linearGradient>
                      
                      <linearGradient id="placement_2_svg__paint1_linear_4201_58394" x1="32" x2="32" y1="11.334" y2="48.668" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".59"></stop><stop offset=".552" stop-color="#E6E6E6" stop-opacity=".706"></stop><stop offset=".839" stop-color="#B8B8B8" stop-opacity=".8"></stop></linearGradient>
                      
                      <linearGradient id="placement_2_svg__paint2_linear_4201_58394" x1="59.334" x2="1.237" y1="2.668" y2="6.595" gradientUnits="userSpaceOnUse"><stop stop-color="#5F5DFE"></stop><stop offset="0" stop-color="#5F5DFE"></stop><stop offset="1" stop-color="#F58FD3"></stop></linearGradient>
                      
                      <linearGradient id="placement_2_svg__paint3_linear_4201_58394" x1="32" x2="32" y1="2.668" y2="57.334" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".59"></stop><stop offset=".552" stop-color="#E6E6E6" stop-opacity=".706"></stop><stop offset=".839" stop-color="#B8B8B8" stop-opacity=".8"></stop></linearGradient>
                      
                      <linearGradient id="placement_2_svg__paint4_linear_4201_58394" x1="68" x2="-8.518" y1="-5.999" y2="-.826" gradientUnits="userSpaceOnUse"><stop stop-color="#5F5DFE"></stop><stop offset="0" stop-color="#5F5DFE"></stop><stop offset="1" stop-color="#F58FD3"></stop></linearGradient>
                      
                      <linearGradient id="placement_2_svg__paint5_linear_4201_58394" x1="32" x2="32" y1="-5.999" y2="66.001" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".59"></stop><stop offset=".552" stop-color="#E6E6E6" stop-opacity=".706"></stop><stop offset=".839" stop-color="#B8B8B8" stop-opacity=".8"></stop></linearGradient>
                      
                      <filter id="placement_2_svg__filter0_f_4201_58394" width="54.667" height="54.667" x="12" y="10.001" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur result="effect1_foregroundBlur_4201_58394" stdDeviation="10.667"></feGaussianBlur>
                      </filter>
                      <filter id="placement_2_svg__filter1_f_4201_58394" width="49.333" height="49.333" x="0" y=".001" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur result="effect1_foregroundBlur_4201_58394" stdDeviation="9.333"></feGaussianBlur>
                      </filter>
                      </defs>
                      </svg>
                      </div>
           <Card>
            
            <BadgeInfoXC value={userInfo.level} />     
    
           
            <li className='hubdusf'> 
        
            
            <Box
      sx={{
        bgcolor: 'rgba(9, 8, 10, 0.959);',
        width: '240px',
        height: '12px',
        borderRadius: '9px',
      }}
    >
      <LinearProgress
      determinate
      color="success"
      variant="outlined"
      size="sm"
      thickness={16}
      value={Math.min(userInfo.level, 100)}
      sx={{
        border: 'none',
        height: '12px',
        borderRadius: '23px',
        "--LinearProgress-progressRadius": "12px",
        "--LinearProgress-radius": "23px",
        "--LinearProgress-progressThickness": "2px"
      }}
    >
      <Typography
        level="body-xs"
        fontWeight="xl"
        textColor="common.white"
        sx={{ mixBlendMode: 'difference' }}
      >
      </Typography>
    </LinearProgress>
    </Box>    
     </li>
          
    
     
     
   
       <Benefict>
         <p>Confira os benefícios exclusivos dos níveis VIP e alcance o status mais alto para receber recompensas especiais ao fazer parte do ClubVision.</p>

         <Link href={`/${ROUTENVX.Dashboard}${ROUTENVX.vpass}`}>Visualizar detalhes<i className='fi fi-sr-angle-right'/></Link>
       </Benefict>
        </Card>
         
        </ContainerLevel>
         </section>
         </CardVip>
  

    </MarginS>
 
         </>
        ) : null}
       </Container>
        </Club>
    )
}



interface ViewHeaderProps {
  gradient: string;
}
 
 

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
 
 

const MarginInformation = styled.div`
 
  padding: 0.6em;
  width: 100%;
  gap: 12px;
   background-color: #111213;
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
  padding-bottom: 1em;
  @media screen and (max-width: 530px) {
    width: 100vw;
    margin: 0;
    padding-bottom: 3em;
   }

 
`;
const Container = styled.div<ViewHeaderProps>`

   display: flex;
   gap: 8px;
   justify-content: center;
   align-items: top;
   flex-wrap: wrap;

`;

 

const CardVip = styled.div`
  background-image: url('/web/38f488cb.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 450px;
  overflow: hidden;

  border-radius: 12px;

  section{
    --bonus-gradient-vip-container_none: linear-gradient(1deg, #111213 32.32%,  rgba(68, 53, 63, 0.575) 110.100%);
    background-image: var(--bonus-gradient-vip-container_none);
    width: 100%;

    border-radius: 12px;
    padding: 1em ;
  
    height: 100%;
  }

  @media screen and (max-width: 530px) {
    width: 100vw;

    section{
      width: 100vw;
    }
   }

`;


/////////// LEVEL 


const Nms = styled.div`
 display: inline-flex;
 align-items: center;
 justify-content: center;
 width: 100%;
 padding: 1em;
`;
const Content = styled.div`
   display: inline-flex;
   align-items: center;
   position: absolute;
   right: 3px;
   margin: 1em;
 

 
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
    top: -5%;
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