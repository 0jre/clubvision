
import React, {useState,useEffect, ReactNode} from 'react'
import styled from "styled-components"
import { User } from "@/types/user/type.cla";
import axios from "axios";

import { decrypt } from '@/core/security/encryption';
import Image from 'next/image';
import Link from "next/link";
import Nvxre from '@/public/icons/verified-nvxre.png'
import Crown from '@/public/favicon.png'

export default  function Infoclauser ({userId} : {userId: string;}) {
  const [userInfo, setUserInfo] = useState <User | null>(null);
   const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
   
        async function fetchUserInfo() {
          try {
           
            setIsLoading(true);
            const response = await axios.get(`/api/cla/info.user.cla?userId=${userId}`);
            const decryptedData = decrypt(response.data.log);
            const userInfoObject = JSON.parse(decryptedData);
            setUserInfo(userInfoObject);
            setIsLoading(false);
          } catch (error) {
            console.error('Error fetching user info:', error);
            setIsLoading(false);
          }
        }
      
        const handleSocketUpdate = (data: { userId: string }) => {
          if (userInfo && data && data.userId === userId) {
            fetchUserInfo();
          }
        };
      
    
      }, []);

      
    return(
        <>
     <ContainerViewUser>
          <XC>
           
          <CenterMheader>

<Header bannerUrl={`data:image/png;base64,${userInfo?.FaixaCla}`}  >

<ClickMarginSociais>

{userInfo?.Tiktok && ( 
<>
<li>
<Link href={`https://tiktok.com/@${userInfo?.Tiktok}`}>
<i className='fi fi-brands-tik-tok' />
</Link>
</li>
</>
)}


{userInfo?.Discord && ( 
<>
<li>
 <Link href={`https://discord.gg/${userInfo?.Discord}`}>
   <i className='fi fi-brands-discord' />
 </Link>
</li>
</>
)}

{userInfo?.Youtube && (
 <>
  <li>
 <Link href={`https://youtube.com/${userInfo?.Youtube}`}>
   <i className='fi fi-brands-youtube' />
 </Link>
</li>

 </>
)}


{userInfo?.Instagram && (
 <>
 
<li>
 <Link href={`https://instagram.com/${userInfo?.Instagram}`}>
 <i className='fi fi-brands-instagram' />
 </Link>
</li>

 </>
)}

{userInfo?.Twitter && (
<>
<li>
 <Link href={`https://x.com/${userInfo?.Twitter}`}>
 <i className='fi fi-brands-twitter' />
 </Link>
</li> 
</>
)}


</ClickMarginSociais>

</Header>
</CenterMheader>


<ProfileView >
<img 
className='AvatarLogo'
src={userInfo?.LogoCla ? `data:image/png;base64,${userInfo?.LogoCla}` : "/favicon.png"} 
alt={userInfo?.namecla}   height={100} width={100}/>
</ProfileView> 
  
      <Container>
      <AboutUserInfo>
        <HovercardContainer>
 
          <ul>
          <h1>{userInfo?.namecla}</h1>
          <p>{userInfo?.Clasigla}</p>
          </ul>
   
        </HovercardContainer>
       
       <BioInfoUser>
        <h6>Biografia :</h6>
        <li>
         <p>{userInfo?.BioLi}</p>
         </li>
       </BioInfoUser>
       
       </AboutUserInfo>
       </Container>
         </XC>
         <ListCla userId={userId} />
        </ContainerViewUser>
         
       
        </>
    )
}






interface UserData {
    name: string;
    id: string;
    avatar: string;
    namecharacter: string,
    nvrp:string,
    nvxre:string,
    verified:string,
  }
   
   
const ListCla = ({userId} : {userId: string}) => {
  
    const [userDataList, setUserDataList] = useState<UserData[]>([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openmodalfriends, setmodalfriends] = useState(false);
    
    const handleopenmodal = () => setmodalfriends(true);
    const handleclosemodal = () => setmodalfriends(false);
    
    useEffect(() => {
      const fetchGuestData = async () => {
        try {
          // Chama a API  para obter a lista de convidados
          const response = await fetch(`/api/cla/invitecla/invited.cla?userId=${userId}`);
          if (response.ok) {
            const data = await response.json() as any;
  
            if (data.guests && data.guests.length > 0) { 
              // Se houver convidados, busca as informações de cada um
              const userDataPromises = data.guests.map(async (guest: { Iduser: any; }) => {
                const userInfoResponse = await fetch(`/api/nvxre/codeims/proInvinted?userId=${guest.Iduser}`);
                if (userInfoResponse.ok) {
                  const userData = await userInfoResponse.json();
                  return userData;
                } else {
                  return null; // Ou adicione um objeto vazio com as propriedades padrão
                }
              });
  
              // Aguarda todas as promessas serem resolvidas
              const userDataResults = await Promise.all(userDataPromises);
  
              // Filtra para remover resultados nulos
              const filteredUserData = userDataResults.filter((userData) => userData !== null);
  
              // Atualiza o estado com a lista final de dados do usuário
              setUserDataList(filteredUserData);
            } else {
              // Não há convidados
              setUserDataList([]);
            }
          } else {
          //   setError('Erro ao carregar informações dos convidados.');
          }
        } catch (error) {
          // setError('Erro ao carregar informações dos convidados.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchGuestData();
    }, [userId]);
  
    
    if (loading) {
     const items: ReactNode[] = [];
for (let i = 0; i < 98; i++) {
  items.push(
    <CardInfouser key={i}>
      <CardRotate />
      <ul>
        <h3>----</h3>
        <h5>---</h5>
      </ul>
    </CardInfouser>
  );
}
      
      return (
        <Container>
            {items}
        </Container>
      );
    }
  
      return(
          <>
      <ContainerList>
          
  {loading ? (
        <>
        <CardRotate />
        </>
      ) : userDataList.length > 0 ? (
    userDataList.map((userData) => (
      <li key={userData.id}>
      
          <CardInfouser>
           <Image src={userData.avatar} 
            className={'Avataruser'}
           alt={'Avatar member'} height={40} width={40} />
  
           <ul>
           <li>
                
                <h3>{userData.name}</h3>
                 {userData.verified && (
                      <>
                   <svg display="block"  className="logoroda" width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.78117 0.743103C5.29164 -0.247701 6.70826 -0.247701 7.21872 0.743103C7.52545 1.33846 8.21742 1.62509 8.8553 1.42099C9.91685 1.08134 10.9186 2.08304 10.5789 3.1446C10.3748 3.78247 10.6614 4.47445 11.2568 4.78117C12.2476 5.29164 12.2476 6.70826 11.2568 7.21872C10.6614 7.52545 10.3748 8.21742 10.5789 8.8553C10.9186 9.91685 9.91685 10.9186 8.8553 10.5789C8.21742 10.3748 7.52545 10.6614 7.21872 11.2568C6.70826 12.2476 5.29164 12.2476 4.78117 11.2568C4.47445 10.6614 3.78247 10.3748 3.1446 10.5789C2.08304 10.9186 1.08134 9.91685 1.42099 8.8553C1.62509 8.21742 1.33846 7.52545 0.743103 7.21872C-0.247701 6.70826 -0.247701 5.29164 0.743103 4.78117C1.33846 4.47445 1.62509 3.78247 1.42099 3.1446C1.08134 2.08304 2.08304 1.08134 3.1446 1.42099C3.78247 1.62509 4.47445 1.33846 4.78117 0.743103Z" fill="#03fe6c"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8.43961 4.23998C8.64623 4.43922 8.65221 4.76823 8.45297 4.97484L5.40604 8.13462L3.54703 6.20676C3.34779 6.00014 3.35377 5.67113 3.56039 5.47189C3.76701 5.27266 4.09602 5.27864 4.29526 5.48525L5.40604 6.63718L7.70475 4.25334C7.90398 4.04672 8.23299 4.04074 8.43961 4.23998Z" fill="#000000"></path></svg>
                      </>
                   )}
                              {userData.nvxre && (
                              <>
                             <Image className="logoroda" src={Nvxre} alt="nvxre" height={16}/>
                              </>
                              )}  
              
                        {userData.nvrp && (
                              <>
                              <Image  className="logoroda" src={Crown} alt="Moderator" height={16}/>
                              </>
                              )} 
              
                          </li> 
             <h5>{userData.namecharacter}</h5>
           </ul>
          </CardInfouser>
      </li>
    ))
  ) : (
    <>
      <ContainerNone>
         <ul>
          <i className='fi fi-sr-ticket' />
         </ul> 
      </ContainerNone> 
    </> 
  )}
  </ContainerList>
       
          </>
      )
  }





/////////// LIST USERS 

const CardRotate = styled.div`

  border-radius: 50%;
  background-size: cover;
  margin-bottom: 0.9em;
  animation: Load 2s infinite;
  height: 40px;
  width: 40px;

@keyframes Load {

  0% { background-color: rgba(137, 150, 145, 0.274);  }
  10% { background-color: rgba(124, 121, 136, 0.247); }
  40% { background-color: rgba(141, 137, 137, 0.226); }
  70% { background-color: rgba(146, 146, 155, 0.233); }
  80% { background-color: rgba(149, 149, 151, 0.137); }
  100% { background-color: rgba(255, 255, 255, 0.041); }
}
`;

const ContainerNone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  ul{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
      
    i{
      font-size: 39px;
      color: #6c6d6e63;
    }
    h3{
      font-size: 18px;
      max-width: 560px;
      color: #40414263;
    }
  }
`;


const ContainerList = styled.div`
   border: 2px solid rgba(65, 67, 70, 0.103);
  padding: 0.4em 0.3em 0.4em;
  border-radius: 15px;
  height: 25em;
  width: 100%;
  overflow-y: scroll;
 
`;

const CardInfouser = styled.div`
    
    display: flex;
    align-items: center; 
    width: 100%;
    margin-bottom: 0.4em;
    border-radius: 9px;
    padding: 0.4em;
    background-color: rgba(65, 67, 70, 0.103);
    
    li{
      display: inline-flex;

      .logoroda{
        border-radius: 50%;
        margin: 0.1em;
        margin-top: 0.2em;
      }
    }

    ul{
      padding-left: 0.8em;

      h3{
        color: rgb(205, 209, 216);
        font-size: 16px;
      }

      h5{
        font-size: 11px;
        color: rgb(67, 67, 75);
      }


    }
   
   .Avataruser{
    border-radius: 15px;
   }
`;









//// 

 
interface ViewHeaderProps {
  bannerUrl: string;
}
const Header = styled.header<ViewHeaderProps>`
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  background-color: rgb(10, 11, 17);
  border-radius: 19px;
  height: 9em;
  margin: 1em;
  padding: 1em 1em 2em;
  min-width: 30em;
  background-repeat: no-repeat;
  background-size: 100%;

  @media screen and (min-width: 200px) and (max-width: 300px) {
     min-width: 19em;
     height: 11em;
     margin-left: -3em;
     background-size: cover;
     margin-top: -5%;
     border-radius: 0 0 12px 12px;
    
  }

  @media screen and (min-width: 360px) and (max-width: 430px) {
     min-width: 25em;
     height: 11em;
     background-size: cover;
     margin-top: -3%;
     border-radius: 0 0 12px 12px;
    
  }
`;



const ClickMarginSociais = styled.div`
   display: flex;
   align-items: center;
   backdrop-filter: blur(48px);
   background-color: rgba(31, 36, 37, 0.411);
   padding: 0.2em 0.5em 0.2em;
   border-radius: 29px;
   max-width: 50%;
   

   li{
     margin: 0.1em;
   }

   a{
    color: #c1c2cc;
    padding: 0px 9px 0px;


    i{
      font-size: 17px;
      color: black;

      &:hover{
        color: #67706a;
      }
    }
   }

   .sssa{
    color: #848591;
    padding: 16px 16px 13px;
    background-color: rgba(5, 5, 8, 0.959);
    border-radius: 42px;
    cursor: pointer;
    i{
      font-size: 17px;
    }
   }

   a:hover{
    color: #292525;
   }
`;

const XC = styled.div`
 display: flex;
 flex-direction: column;

`;

const CenterMheader = styled.div`
display:flex;
 justify-content: center;
 align-items: center;
`;

const ContainerViewUser = styled.div`
 
  display: flex;
  flex-direction: column;
  align-items: top;
  place-items: center;
   
  margin-top: 2em;

  .centerç{  
    text-align: center;
  }
`;

  

const ProfileView = styled.div` 
    padding: 0em 4% 0em;
    margin-top: -5em;
  
  .AvatarLogo{
    border-radius: 100px;
    border: 2px solid black;
  }

  @media screen and (min-width: 200px) and (max-width: 300px) {
    padding: 4em 1em 0em;

    .AvatarLogo{
      height: 110px;
      width: 110px; 
    }
  }

  @media screen and (min-width: 300px) and (max-width: 430px) {
    padding: 4em 1em 0em;

    .AvatarLogo{
      height: 120px;
      width: 120px; 
    }
  }

`;
 
const Container = styled.div` 
  padding: 1em;
  margin: 0.6em;
  margin-top: -0.5em;
  
 `;


const AboutUserInfo = styled.div`

    
   margin-bottom: 0.1em;
   background-color: rgba(119, 119, 119, 0.014);
   padding: 0.7em 1em 0.7em;
   border-radius: 19px;

     .logoroda{
  border-radius: 12px;
   
 }
    h2{
      font-size: 29px;
      color: #56565e;
    }


    li{
      display: flex;
      align-items: center;
      flex-direction: row;
    }
 
    @media screen and (min-width: 200px) and (max-width: 300px){
      margin: 0.2em;
      max-width: 18em;
      margin-left: -2.8em;
    }

    @media screen and (min-width: 300px ) and (max-width: 431px){
      margin: 0.4em;
      max-width: 44em;
    
    }
`; 

const BioInfoUser = styled.div`
 
   background-color: rgba(45, 45, 49, 0.096);
   padding: 0.9em;
   border-radius: 11px;
    max-width: 880px;
 

   p{
     font-size: 14px;
     max-width: 290px;
     color: #49484d;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
   }

   h6{
    color: #49484d;
   }

   @media screen and (min-width: 200px) and (max-width: 430px){
       margin: 0.2em
  }
 
`;


const HovercardContainer = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
   margin-top: 0.4em;

   ul{
    display: flex; 
    text-align: start;
    flex-direction: column;
     
    p{
      margin-top: 0.4em;
      font-size: 14px;
      color: rgb(64, 131, 84);
      font-family: 'Graffiti';
    }
   }


   h1{
    color: #898f94;
    width: 100%;
    font-family: 'Europa Grotesk';
   }
 

`;
 
 