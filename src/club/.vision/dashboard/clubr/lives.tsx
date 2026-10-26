import styled from "styled-components";
import { User } from "@/types/user/types";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { UserInfo } from "@/types/discord/usersearch";
import React from "react";
import axios from 'axios';
 
import { UserConnectTwitch } from '@/types/user/connections';
import VideoCarousel from "@club/components/twitch/carousel";
import VideoGroup, { DataProps } from "@club/components/twitch/VideoGroup";
import BestVideos from "@club/components/twitch/best.channels";
import Tooltip from "@club/components/uls/hover.idex";
import SkeletonLoader from "@club/resources/loading/skeleton.card";
import { nvxre_connections_we } from "@/hooks/InfoData";

interface Props {
  user?: User | null;
}
 
export default function Streamers({ user }: Props) {
  const router = useRouter();
    const userId = user?.id || ''
    const { Data_we} = nvxre_connections_we({id: userId});
     const [UserConnectTwitch, setUserConnectTwitch] = useState<UserConnectTwitch | null>(null);

     useEffect(() => {
     if (Data_we) {
        setUserConnectTwitch(Data_we.twitch);
     }
   }, [Data_we]);

  const Streamers = () => {
    const [data, setData] = useState<DataProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalViewers, setTotalViewers] = useState<number>(0);
    const [totalStreams, setTotalStreams] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [cursor, setCursor] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

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
          const viewers = JSON.parse(response.data.totalViewers);
          const streamCount = JSON.parse(response.data.totalStreams);
          const nextCursor = response.data.nextCursor || null;
          
          setData(streams);
          setTotalViewers(viewers);
          setTotalStreams(streamCount);
          setCursor(nextCursor);
          setHasMore(!!nextCursor);
        } catch (parseError) {
          console.error('Error parsing JSON data:', parseError);
        }
      } catch (error) {
        console.error('Erro ao buscar streamers:', error);
      } finally {
        setLoading(false);
      }
    }, [UserConnectTwitch]);

    // Função para carregar mais dados
    const fetchMoreData = async () => {
      if (!cursor || loadingMore) return;
      
      try {
        setLoadingMore(true);
        
        // Configuração segura para enviar o token
        const config = UserConnectTwitch?.user_token_accesstwitch ? {
          headers: {
            'Authorization': `Bearer ${UserConnectTwitch.user_token_accesstwitch}`
          },
          params: { cursor }
        } : {
          params: { cursor }
        };
        
        const response = await axios.get(`/api/redirect/lives`, config);
        
        if (!response.data.liveStreams) {
          console.error('Missing stream data in API response');
          setLoadingMore(false);
          return;
        }
        
        try {
          const newStreams = JSON.parse(response.data.liveStreams);
          const nextCursor = response.data.cursor || null;
          
          setData(prev => [...prev, ...newStreams]);
          setCursor(nextCursor);
          setHasMore(!!nextCursor);
        } catch (parseError) {
          console.error('Error parsing JSON data:', parseError);
        }
      } catch (error) {
        console.error('Erro ao buscar mais streamers:', error);
      } finally {
        setLoadingMore(false);
      }
    };

    useEffect(() => {
      fetchInitialData();
    }, [fetchInitialData]);

    if (loading || !data) {
      return (
        <Marginsd>
          <SkeletonLoader />
        </Marginsd>
      );
    }

    const formatCurrency = (value: number): string => {
      return value.toLocaleString('en-US', {
        currency: 'USD',
      });
    };

    return data.length === 0 ? (
      <Notification>
        <Image src={'/icons/app/twitchicon.png'} alt="twitch" height={100} width={100} />
        <h2>Nenhuma transmissão ao vivo no momento</h2>
        <p>Não há streamers online agora.</p>
      </Notification>
    ) : (
      <>
        {data.length > 0 && <VideoCarousel data={data} />}
        <BestVideos data={data} /> 
        <ContentAboutL>
          <p>Adicione uma das tags em sua live stream</p>
          <li>
            <Tooltip title="Streamings">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-check">
                  <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                {formatCurrency(totalStreams)}
              </span> 
            </Tooltip>
            <span>NVRP</span> <span>NOVISION</span> <span>NoVisionRP</span>
            <Tooltip title="Visualizações">
              <span className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg> 
                {formatCurrency(totalViewers)}
              </span> 
            </Tooltip>
          </li>
        </ContentAboutL>

        <VideoGroup 
          data={data} 
          onLoadMore={fetchMoreData}
          hasMore={hasMore}
          isLoadingMore={loadingMore}
          children={
            <MarginInfoUser>
              <Image className="Logo" src={"/nvrp/20240721_153235.webp"} 
                alt="Logo" width={129} height={44}/>
              <ul>
                {user && (
                  <>
                    {UserConnectTwitch ? (
                      <>
                        <img className="avatar" src={UserConnectTwitch.user_avatartwitch || "/placeholder.svg"} alt={user.username} height={35} width={35} />
                        <h3>{UserConnectTwitch.display_nametwitch}</h3>
                      </>
                    ) : (
                      <>
                        <img className="avatar" src={user.avatar || "/placeholder.svg"} alt={user.username} height={35} width={35} />
                        <h3>{user.username}</h3>
                      </>
                    )}
                  </>
                )}
              </ul>
            </MarginInfoUser>
          }
        />
      </>
    );
  };

  return (
    <>
      <GlobalPosition>
        <MarginVC>
          <Streamers />
        </MarginVC>
      </GlobalPosition>
    </>
  );
}

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
 
const MarginVC = styled.div`
  margin: 0 auto;
  justify-content: center;
  place-content: center;
  border-radius: 19px;
  margin-bottom: 1em;
  width: 100%;
  display: flex;
  flex-direction: column;
  animation: PageAnim 0.8s linear;
 
  @keyframes PageAnim {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }
  @media screen and (max-width: 430px){
    margin-left: 0;
    width: 100%;
  } 
`;

const GlobalPosition = styled.div`
  height: 100vh;
  padding: 2em 2em 2em;

  @media screen and (max-width: 430px) { 
    padding: 2em 0.3em 2em;
    width: 100%; 
    margin: 0;
  }
`;

const MarginInfoUser = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5em;
  justify-content: space-between;
  padding: 0.5em 1em 0.5em;
  border-radius: 42px;
  background-color: rgba(11, 12, 10, 0.205);

  ul{
    gap: 5px;
  }
 
  h3{
    font-size: 13px;
    font-family: 'InterSemiBold', monospace;
  }
  .avatar{
    border-radius: 50%;
  }
`;

const ContentAboutL = styled.div`
  border: 1px solid rgba(73, 66, 90, 0.158);
  border-radius: 12px;
  margin: 1em;
  margin-top: 3em;
  text-align: center;
  padding: 0.3em 1em 0.3em;
  
  .jdsunffs{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  @media screen and (max-width: 430px) {
    li{
      span{
        font-size: 11px;
      }
    }
  }

  p{
    font-size: 13px;
    color: #7b7a8087;
  }
  li{
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;

    span {
      font-size: 13px;
      margin: 0.5em;
      color: #e2e2e288;
      background-color: rgba(112, 117, 112, 0.26);
      padding: 3px 1em 3px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      border-radius: 12px;
    }
  }

  @media screen and (max-width: 680px) {
    .jdsunffs, li{
     display: flex;
     flex-direction: column;

     span{
      width: 100%;
     }
    }
  } 
`;

const Notification = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  place-items: center;
  align-items: center;

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
  
  button{
    border-radius: 12px;
    background: #9146ff;
    box-shadow: 0 0 1.5625rem rgba(212, 81, 180, 0.11);
    border: none;
    margin-top: 2em;
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