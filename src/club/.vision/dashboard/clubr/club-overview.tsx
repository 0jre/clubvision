import styled from "styled-components";
import { User } from "@/types/user/types";
import { ReactNode, useEffect, useState } from "react";
import { UserInfo } from "@/types/discord/usersearch";
import React from "react";
import HeadGlobal from "@/club/head/glob.n";
import ClubrDashboard from '@/club/.vision/dashboard/clubr/index';
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";
 
interface Props {
  user?: User | null;
  children: ReactNode;
}


export default function Clubr({ user,children }: Props){

  const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
  const [userInfox, setUserInfox] = useState <UserInfo | null>(null);
 
  const { isLoadingx, userInfoObject,userTeam } = GetInfo_nvxre_xyloQuerier();

     useEffect(() => {
        if (!isLoadingx && userInfoObject) {
         setUserInfo(userInfoObject);
          setUserInfox(userTeam)
        }
      }, [userInfoObject]);
  
 
    return(
        <>
      <HeadGlobal Title="Clubr - #Thenovision" />
  
       <GlobalPosition>
 
       <ContainerCenter>
        <ClubrDashboard 
        userInfo={userInfo} user={user} userInfox={userInfox} 
        children={children}
        />
       </ContainerCenter>
      </GlobalPosition>
    
        </>
    )
}
 
 
const GlobalPosition = styled.div`
   
   display: flex;
  justify-content: center;
  align-items: stretch; 
  flex-direction: row;
  flex-flow: row;
 
  z-index: 0;
  @media screen and (max-width: 430px) {
    margin:0;
  }
`;

 

const ContainerCenter = styled.div`
 
   display: flex;
   flex-wrap: wrap;
   flex-direction: row;
   align-items: center;
  overflow: hidden;

`;


