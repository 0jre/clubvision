import styled from "styled-components";
import { Levelinfo } from "@/types/user/level.up";
import axios from "axios";
import { decrypt } from '@/core/security/encryption';
import React, {useState,useEffect} from 'react'
import LoadingPageView from "@club/resources/loading/market.loading";
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import Box from '@mui/joy/Box';
import BorderLinearProgress from '@club/components/vision/progress';
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
  
interface Props {
    id: string;
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
                <Image src={badgeImage.src} alt="badgelevel" height={19} width={19} />
            
              <h5 className="h5">{badgeLevel}</h5>
            
         </Content>
        </>
    )
}


// Função para obter a imagem do distintivo com base no nível
function getBadgeImage(badgeLevel: string): StaticImageData {
    return badgeImages[badgeLevel];
}

 export default function LevelVisionTOp ({id} : Props) {
    const [userInfo, setUserInfo] = useState <Levelinfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
     
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
            // console.error('Error fetching user info:', error);
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

    return(
        <Container>
              
            {isLoading ? (<Nms>
               <LoadingPageView />
            </Nms>) :  userInfo  !== null ? (
                <>
           
           <Card>
         
            <BadgeInfo value={userInfo.level}  />
          
            <Box
      sx={{
        bgcolor: 'rgba(239, 237, 250, 0.021);',
        width: '100%',
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
      <h3>{userInfo.level}</h3> 

      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-diamondds" width="12" height="12"  viewBox="0 0 24 24" stroke-width="1.5"  stroke="#4d5057" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z"  fill="none"/>
  <path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5" />
  <path d="M10 12l-2 -2.2l.6 -1" />
</svg>

 
    
      </span>
            
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-help ds" width="12" height="12"  viewBox="0 0 24 24" stroke-width="1.5"  fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 21 14.5 1" stroke="#2f2f337d"></path>
       </svg> 
       
          <span>
            <h3>{formatNumber(userInfo.xp ? userInfo.xp : 0)}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-alpha" width="12" height="12" viewBox="0 0 24 24" stroke-width="1.5" stroke="#4d5057" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M18.1 6c-1.1 2.913 -1.9 4.913 -2.4 6c-1.879 4.088 -3.713 6 -6 6c-2.4 0 -4.8 -2.4 -4.8 -6s2.4 -6 4.8 -6c2.267 0 4.135 1.986 6 6c.512 1.102 1.312 3.102 2.4 6" />
</svg>
            </span>
             
     </li>
        </Card>
           </>
            ) : (
              <ul>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-command" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#4e4e53" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10" />
</svg>
              <h6>Use o comando no Discord.</h6>  
              <h6 style={{ color: 'rgb(38, 233, 96)', }}>*/daily*</h6> 
              </ul>
            )}

             
        </Container>
    )
 }

 
const Nms = styled.div`
  margin-top: 0.4em;
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
 

 const Container = styled.div`
 display: box;
 flex-direction: row;
 margin-top: 0.6em;
   h1{
    text-align: center;
   font-family: 'Europa Grotesk';
  
   color: rgb(185, 181, 206);
   
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