import ROUTENVX from "@/routes/routes";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import Logo from '@/public/nvrp/20230331_230855.png'
import { useRouter } from "next/router";
import { User } from "@/types/user/type.cla";
import axios from "axios";
import { decrypt } from '@/core/security/encryption';
import React, {useState,useEffect} from 'react'
import Aboutmecla from '../../../../.group/ax/about.group';
import LoadingPageView from "@club/resources/loading/market.loading";


interface TOp {
  Children?: React.ReactNode;
  id: string;
}

export default function NavTopProfile ({Children, id} : TOp) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState <User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isclamember, setcla ] = useState(false)

  const handlecla = () => {
    setcla(true);
  }

  const handleclose = () => {
    setcla(false)
  }

  

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/cla/info.user.cla?userId=${id}`);
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

    return(
        <>
        <ContainerNav>
         <NavContent>
          

             {Children}

             {userInfo && (
              <Ds>
               
              <h3>{userInfo.Clasigla}</h3> 
              <span onClick={handlecla} className="jdsfhdf" > 
              <img className="logo" src={userInfo.LogoCla ? `${userInfo.LogoCla}` : '/favicon.png' } alt={userInfo.Clasigla} height={50} width={50} />
              </span>

              <span className="jdsfhdsdff" >
              <img className="logo" src={userInfo.LogoCla ? `${userInfo.LogoCla}` : '/favicon.png' } alt={userInfo.Clasigla} height={50} width={50} />
              </span>
              </Ds>
             )}

            
         </NavContent>
        </ContainerNav>

 
         {isLoading ? (
          <>
          <LoadingPageView />
          </>
         ): isclamember && (
          <Warrap>
         <CardCla>
         <TopIn>
             {userInfo ? (
              <Ds>
              <h3>{userInfo.Clasigla}</h3> 
              <span onClick={handleclose} > 
              <img className="logo" src={userInfo.LogoCla ? `${userInfo.LogoCla}` : '/favicon.png' } alt={userInfo.Clasigla} height={50} width={50} />
              </span>
              </Ds>
             ) : (
              <>
               <Image src={Logo} alt="novision" height={50} width={50} />
              </>
             )}
          </TopIn>

          <Contentcla>
          <Aboutmecla userId={id} />
          </Contentcla>
         </CardCla>
          </Warrap>
         )}
        </>
    )
}






const TopIn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.082);
  
  .rotatelogo{
    cursor:  var(--f-cursor-pointer);
    margin: 0.3em;
    margin-left: 0;
  }
 `;


const Warrap = styled.div`
 position: fixed;
 width: 100%;
 height: 100%;
 left: 0;
 right: 0;
 top: 0;
 z-index: 57000;
 bottom: 1;
 background-color: rgba(0, 0, 0, 0.212);
 display: flex; 
 justify-content: center; 
 
`;

const Contentcla = styled.div`
margin: 0.4em;
padding: 0.5em 2em 2em;
`;

const CardCla = styled.div`
  
   
   border-radius: 29px 29px 0 0;
   overflow-y: auto;
    height: 83%;
    position: absolute;
    bottom: 1px;
    border: 2px solid #111213;
    z-index: 198;
    border-bottom: none;
    backdrop-filter: blur(22px);
    background-color: rgb(3, 3, 3);
   width: 83%;
   overflow-y: auto;
   padding: 0em 1em 0em;
   animation: Osv 0.2s linear;

   @keyframes Osv {
    0%{ transform: translateY(100%) }
    100%{ transform: translateY(0%) }
   } 
   
`;


///  
 
const Ds = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.3em 0.5em 0;
  .logo{
    border-radius: 12px;
    cursor: pointer;
    transition: 1s all;
    &:hover{
      transform: rotate(360deg);
    }
    
  }

  h3{
    padding: 0 0.7em 0;
    font-family: 'Graffiti';
    color: #26a55b
  }

`;

const ContainerNav = styled.nav`
  
  padding: 0.6em 1em 0.6em;
  margin: 1em;
  margin-bottom: 0;
 
  .jdsfhdsdff{
      display: none;
      }

  @media screen and (max-width: 530px){
    .jdsfhdf{
      display: none; 
    }

    .jdsfhdsdff{
      display: block;
      }
  }

`;

const NavContent = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;

   li{
    button{
      display: flex;
      font-family: 'Poppins', sans-serif;
      align-items: center;
      height: 50px;
      width: 50px;
      padding: 0.3em 1em 0.3em;
      border-radius: 100%;
      background-color: rgba(119, 119, 119, 0.048);
      border: 2px solid transparent;

      i{
        margin-right: 0.7em;
      }

      :hover{
      border: 2px solid rgb(255, 37, 37);
      }
    }
   }

   span{
    cursor: pointer;
   }
`;
 