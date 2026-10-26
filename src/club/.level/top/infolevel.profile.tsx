import styled from "styled-components";
import { Levelinfo } from "@/types/user/level.up";
import axios from "axios";
import { decrypt } from '@/core/security/encryption';
import React, {useState,useEffect} from 'react'
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import Box from '@mui/joy/Box';
 /// IMAGE 
import Unbadge from '@/public/icons/badges/unbadge.png'
import Bronze from '@/public/icons/badges/bronze.png'
import Prata from '@/public/icons/badges/prata.png'
import Gold from '@/public/icons/badges/gold.png'
import Platinum from '@/public/icons/badges/platinum.png'
import Diamante from '@/public/icons/badges/diamante.png'
import Master from '@/public/icons/badges/master.png'
import LinearProgress, { linearProgressClasses } from '@mui/joy/LinearProgress';
import Typography from '@mui/joy/Typography';
import { GetInfo_nvxre_level } from "@/hooks/infolevel";
  
interface Props {
    id: string;
    avatar:React.ReactNode;
}
 
interface BadgeImageMap {
    [key: string]: StaticImageData;
}

 
export const badgeImages: BadgeImageMap = {
    Novato: Unbadge,
    Bronze: Bronze,
    Prata: Prata,
    Gold: Gold,
    Platinum: Platinum,
    Diamante: Diamante,
    Master: Master
};

export const BadgeInfo = ({ value } : {value: number}) => {
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
                <Image src={badgeImage.src} alt="badgelevel" height={19} width={19} />
            
              <h5 className="h5">{badgeLevel}</h5>
            
         </Content>
        </>
    )
}


// Função para obter a imagem do distintivo com base no nível
export function getBadgeImage(badgeLevel: string): StaticImageData {
    return badgeImages[badgeLevel];
}

 export default function LevelProfile ({id,avatar} : Props) {
    const [userInfo, setUserInfo] = useState <Levelinfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
   const { isLoadinglevel, Datalevel } = GetInfo_nvxre_level();
     
     useEffect(() => {
        if (!isLoadinglevel && Datalevel) {
              setUserInfo(Datalevel);
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

    return(
        <Container>
                      {isLoading ? null :  userInfo  !== null ? (
                <>       
<svg xmlns="http://www.w3.org/2000/svg" width={290} height="98" fill="none" className="marginselectse3 "><path fill="none" stroke="#565664" d="M41.847.5h280.306a5.5 5.5 0 0 1 4.26 2.022l35.102 43a5.499 5.499 0 0 1 0 6.956l-35.102 43a5.5 5.5 0 0 1-4.26 2.022H41.847a5.5 5.5 0 0 1-4.26-2.022l-35.102-43a5.5 5.5 0 0 1 0-6.956l35.102-43A5.5 5.5 0 0 1 41.847.5Z"></path></svg>  
            <MarginShap> 
 
           
              <Card>
         
         <BadgeInfo value={userInfo.level}  />
       
         <Box
   sx={{
     bgcolor: 'rgba(239, 237, 250, 0.021);',
     width: '140px',
     height: '5px',
     borderRadius: '23px',
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
     height: '5px',
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


    <li>
   <span>
   <h3>LEVEL {userInfo.level}</h3>
   </span>
         
     <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-help ds" width="12" height="12"  viewBox="0 0 24 24" stroke-width="1.5"  fill="none" stroke-linecap="round" stroke-linejoin="round">
     <path d="M1 21 14.5 1" stroke="#2f2f337d"></path>
    </svg> 
    
       <span>
         <h3>{formatNumber(userInfo.xp ? userInfo.xp : 0)}</h3>
         <h3>XP</h3>
         </span>
          
  </li>
     </Card>
           {avatar}
         
           
</MarginShap>
</>
            ) : (
              <ul>
               {avatar}
              </ul>
            )}
        </Container>
    )
 }

 
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
 

  .h5{
    font-family: 'Vultra';
    color: silver;
   
    padding-left: 0.5em;
  }
   

   
  
`;
 

const MarginShap = styled.div`
  display: flex;
  align-items: center;
  z-index: 1;
  padding: 0 2em 0;
  width: 100%;
  position: absolute;
  justify-content: space-between;
`;
 const Container = styled.div`
 
 margin-top: 1em;
 margin-bottom: 1em;
 width: 90%;
 height: 98px;
 position: relative;

   .shapev{
     width: 230px;
   }
   h1{
    text-align: center;
   font-family: 'Europa Grotesk';
  
   color: rgb(185, 181, 206);
   
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
 
  h4{
    font-family: 'ProximaNova', sans-serif;
    font-size: 15px;
    color: rgb(97, 99, 102);
    font-weight: 300;
   
  }
  
  .section{
    display: inline-flex;
    align-items: center;
    width: 100%;
 
  }
 

  span{
    display: inline-flex;
    align-items: center;
  }
 
  li{
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    

    i{
      margin: 1px;
      color: #bebec484;
    }

    h5{
      color: #4d5057;
      font-size: 11px;
      padding-left: 0em;
    }

     
    h3{
      font-size: 11px;
      color: #585e5a84;
    }
  }

  h5{
      color: #bebec484;
      padding-left: 0.6em;
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