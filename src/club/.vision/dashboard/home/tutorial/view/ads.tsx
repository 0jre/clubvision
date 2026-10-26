import styled, { keyframes } from "styled-components"
import React, { useState,useEffect, useRef, useCallback } from 'react';
import Carousel01 from "@/admin/components/ax/index.O1";
import CardCarousel from "./card-carousel";
import router from 'next/router';
import ROUTENVX from "@/routes/routes";
import VideoCarousel from "@/components/twitch/carousel";
import VideoGroup, { DataProps } from "@club/components/twitch/VideoGroup";
import { UserConnectTwitch } from "@/types/user/connections";
import { nvxre_connections_we } from "@/hooks/InfoData";
import axios from "axios";
import SkeletonLoader from "@club/resources/loading/skeleton.card";

export interface Advertising {
  AdsId: string;
  // Add other properties as needed
  title: string;
  thumbnailUrl: string; 
  descriptions: string;
  DateLanc: string;
  About: string;
  Redirect: string;
}

interface Thumb {
  thumbnail: React.ReactNode; 
}

async function fetchAdvertisingData() {
try {
  const response = await fetch('/api/ads/advertising');
  const data: Advertising[] = await response.json();
  return data;
} catch (error) {
  console.error('Error fetching advertising data:', error);
  throw error;
}
}
 

export default function AdsDashboard({user} : {user: any}) {
  
   const { Data_we} = nvxre_connections_we({id: user.id});
   const [UserConnectTwitch, setUserConnectTwitch] = useState<UserConnectTwitch | null>(null);
  const [carouselItems, setCarouselItems] = useState<JSX.Element[]>([]);
  const [ Aboutserver, setAboutServer] = useState(true)
   const [data, setData] = useState<DataProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    // Função para buscar dados iniciais
    const fetchInitialData = useCallback(async () => {
      try {
        setLoading(true);
        
        // Configuração segura para enviar o token
        const config = UserConnectTwitch?.user_token_accesstwitch ? {
          headers: {
            'Authorization': `Bearer ${UserConnectTwitch.user_token_accesstwitch}`
          }
        } : {};
        
        const response = await axios.get(`/api/redirect/lives`, config);
        
        if (!response.data.liveStreams || !response.data.totalViewers || !response.data.totalStreams) {
          console.error('Missing data in API response');
          setLoading(false);
          return;
        }
        
        try {
          const streams = JSON.parse(response.data.liveStreams);
          setData(streams);
        } catch (parseError) {
          console.error('Error parsing JSON data:', parseError);
        }
      } catch (error) {
        console.error('Erro ao buscar streamers:', error);
      } finally {
        setLoading(false);
      }
    }, [UserConnectTwitch]);

    
  useEffect(() => {
       if (Data_we) {
          setUserConnectTwitch(Data_we.twitch);
       }
     }, [Data_we]);

    useEffect(() => {
      fetchInitialData();
    }, [fetchInitialData]);

    
  const fetchData = async () => {
    try {
      const data = await fetchAdvertisingData();
      const newCarouselItems = data.map((ad: Advertising) => (
        <div key={ad.AdsId}>
          <CardCarousel 
          thumbnail={
              <>
                <Content thumbnail={ad.thumbnailUrl} className='none'/>   
              </>
          }
          Descriptions={ad.descriptions} 
          Title={ad.title} 
          About={ad.About} 
          Redirect={ad.Redirect} />
        </div>
      ));
      setCarouselItems(newCarouselItems);
       if (newCarouselItems.length === 0) {
         setAboutServer(false);
       }
    } catch (error) {
      // Handle error, if needed
    }
  };

  useEffect(() => {
  fetchData();
  }, []);   

 
    return (
      <>   
  
  
      <MainDashboardN> 
     
    {carouselItems.length > 0 ? (
       <Anim>
       <Carousel01 items={carouselItems} />
      </Anim>
      ) : (
        <>
         {data.length > 0 && <VideoCarousel data={data} />}
        </>
      )}
  
   
     
      
 
       </MainDashboardN>
      </>
    );
  }

// Animação de Skeleton
const skeletonAnimation = keyframes`
  

0% { background-color: rgba(137, 150, 145, 0.068);  }
10% { background-color: rgba(124, 121, 136, 0.096); }
40% { background-color: rgba(141, 137, 137, 0.096); }
70% { background-color: rgba(146, 146, 155, 0.089); }
80% { background-color: rgba(149, 149, 151, 0.137); }
100% { background-color: rgba(255, 255, 255, 0.041); }

`;

// Header
const SkeletonHeader = styled.div`
  width: 100%;
  height: 340px;
  background: rgba(224, 224, 224, 0.137);
  animation: ${skeletonAnimation} 1.5s infinite ease-in-out;
`;
  

const Marginsd = styled.div`  
  display: flex;
  flex-direction: column;
  justify-content: center; 

  ul{
    margin-top: 2em;
    text-align: center;
     
   h2{
    font-family: 'ProximaNova-',
   }

    p{
      font-family: 'Inter', monospace;
      color: rgb(105, 111, 116);
    }
  }
`;
const Content = styled.div<Thumb>`

  background-image: ${({ thumbnail }) => `url('${thumbnail}')`};
  background-color: rgb(8, 8, 17);;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 1em 2em 1em;
  background-position: center;
  border-radius: 2em; 
  height: 40vh;
  width: 100%;
  margin: 0.3em;
  transition: 1s all; 

  &:hover{
    border-radius: 19px; 

  }

  @media screen and (max-width: 430px) {
  height: 30vh;
  width: 100%;
  border-radius: 11px; 
 }

`;
 
const MainDashboardN = styled.section`
  
  margin: 0 auto;
  max-width: 1390px;
  margin-bottom: 0.3em;
  animation: PageAnim 0.8s linear;
 
  @keyframes PageAnim {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }
  @media screen and (max-width: 430px){
  margin-left: 0;
  width: 100%;
  } 

 


  @media screen and (max-width: 530px) {
    .hdas{
    width: 100vw;
  }
  }
`;

const Anim = styled.div`
 animation: PageAnim 0.8s linear;

@keyframes PageAnim {
  0%{ opacity: 0;}
  100%{ opacity: 1;}
}



@media screen and (max-width: 430px) {
   
   &:hover{
     .none{
      display: none;
   }
   }
  }
 
`;


   

  