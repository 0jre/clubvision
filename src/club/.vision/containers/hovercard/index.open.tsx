import Image from "next/image";
import styled from "styled-components"
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User } from '@/types/user/searchall';
import axios from 'axios';
import Nvxre from '@/public/icons/verified-nvxre.png'
import Vderified from '@/public/icons/verified.png'
import Crown from '@/public/favicon.png'
import router from "next/router";
import * as HoverCard from '@radix-ui/react-hover-card';
import { decrypt } from "@/core/security/encryption";

interface Props {
  users: User[];
  children: ReactNode;
  content: ReactNode;
  className?: string;
  buttonText: string;
  
}

interface GrowChildren {
    NvUserID: React.ReactNode;
    HoverCa: React.ReactNode;
    AvatarUser: React.ReactNode;
    NameUser: React.ReactNode;
}


export default function HoverCardNvxre ( {NvUserID, HoverCa, AvatarUser,NameUser} : GrowChildren) {
    // State para armazenar os usuários
    const [usersList, setUsersList] = useState<User[]>([]);
 
    const NvXUsername = NameUser;

    useEffect(() => {
    const fetchUser = async () => {
        try {
          const response = await axios.get(`/api/autentic/xyloQuerierAPI?userId=${NvUserID}`);
          const dataw = decrypt(response.data.log);
          const datawx = decrypt(response.data.novisionteam);
          const user = JSON.parse(dataw);
          const userm = JSON.parse(datawx)
          // Atualizar o usuário com informações de reforma
          const userWithReformInfo = {
            ...user,
            ...userm,
            reforms: user,
          };
    
          setUsersList([userWithReformInfo]);
        } catch (error) {
          console.error('Error fetching reform info:', error);
    
          // Se houver um erro na obtenção das informações de reforma, use apenas o usuário básico
          setUsersList([user]);
        }
     
    };
  
      fetchUser();
    }, []);
    
    // Verifique se há um usuário antes de renderizar
    const user = usersList[0];
    

  
   const VerifiedAccount: React.FC<Props> = ({ className, content }) => {
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
      setIsHovering(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovering(false);
    };
    return (
      <>
    <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
     <ContentMember>
        <span>
      
        <svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="20" width="20" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg>
        </span>
        </ContentMember>
    {isHovering && (
        <>
        {content}
      </>
      )}
      </div>
      </>
   );
  } 




  const NvxreStaff: React.FC<Props> = ({ className, content }) => {
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
      setIsHovering(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovering(false);
    };
    return (
      <>
    <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      
    <ContentMember>
        <span>
    <Image src={Nvxre} alt="nvxre" height={17} />
        </span>
        </ContentMember>
    {isHovering && (
  <>
  {content}
</>
      )}
      </div>
      </>
   );
  } 




  const AccountStaff: React.FC<Props> = ({ className, buttonText, content }) => {
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
      setIsHovering(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovering(false);
    };
    return (
      <>
    <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ContentMember>
        <span>
        
        <Image src={Crown} alt="Moderator" height={17} className="border2"/>
      
        </span>
        </ContentMember>
 
    {isHovering && (
  <>
  {content}
</>
      )}
      </div>
      </>
   );
  }

 

    return(
        <>
              {user && (
             <>         
            <MemberList>
            <ContentMember>
 
            <HoverCard.Root>
    <HoverCard.Trigger asChild>
      <Link
        className="ImageTrigger"
        href={''}
        target="_blank"
        rel="noreferrer noopener"
      >
      
      <ContentCard>
        {HoverCa} 

        <ul className="ul"> 
        {user.reforms && (
      <>
     
        {user.reforms.verified! && (
           <>
            <svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="20" width="20" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg>
           </>
        )}


      {user.reforms.nvxre! && (
          <>
     <Image src={Nvxre} alt="nvxre" height={18}/>
          </> 
         )}
        
    {user.reforms.nvrp! && (
          <>
    <Image className="border2"  src={Crown} alt="Moderator" height={18}/>
          </> 
         )}
   
      </>
      )}  
  </ul>
       </ContentCard>
      </Link>
    </HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content className="HoverCardContent" sideOffset={5}>
      <AboutList>
      {user.reforms && (
      <>
  <ViewHeader bannerUrl={user.reforms.prime && user.reforms.bannerfundo}>
 {AvatarUser}
    
  </ViewHeader>
  </>
      )}
  
 
    {user.reforms && (
      <>
       <Conatainerrif>
       <CardBadges>
     
        {user.reforms.verified! && (
           <>
            <VerifiedAccount
    buttonText={``}
    users={[]} children={undefined} 
      content={
        <>
     <ModalWrapper>
     <CardModal>
      <li>
      <svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="54" width="54" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg>
     </li>
     <ul>
     <h2>Esse perfil e verificado</h2>
     <p>O perfil de {user.reforms.name} conhecido como {NvXUsername} e verificado. <Link href={'/dashboard/articles/important/04850483847f8473kif93'}>Saber mais</Link></p>
     </ul>
     </CardModal>
    </ModalWrapper>
        </>
      }
    />
           </>
        )}


      {user.reforms.nvxre! && (
          <>
      <NvxreStaff
    buttonText={``}
    users={[]} children={undefined} 
      content={
        <>
        <ModalWrapper>
     <CardModal>
     <li>
     <Image src={Nvxre} alt="nvxre" height={55}/>
     </li>
     <ul>
     <h2>Conta afiliada a equipe thenovision.</h2>
     <p>O perfil de {user.reforms.name} conhecido como {NvXUsername} e um membro oficial da equipe. </p>
     </ul>
     </CardModal>
    </ModalWrapper>
        </>
      }
    />
          </> 
         )}
        
    {user.reforms.nvrp! && (
          <>
  <AccountStaff
    buttonText={``}
    users={[]} children={undefined} 
      content={
        <>
        <ModalWrapper>
     <CardModal>
      <li>
      <Image className="border2"  src={Crown} alt="Moderator" height={65}/>
     </li>
     <ul>
     <h2>Staff NoVision'RP </h2>
     <p>O perfil de {user.reforms.name} conhecido como {NvXUsername} se trata de um membro da administração do The NoVision.  </p>
     </ul>
   
     </CardModal>
     </ModalWrapper>
        </>
      }
    />
          </> 
         )}
          
      
          </CardBadges>
       </Conatainerrif>
  
     <MarginInformation>
    {user.reforms && (
      <>
       <ListVerified>
       <h4 className="nameuser">
    {user.reforms.name} </h4>  
   <h5 className="usernick">@{user.name}</h5>
       </ListVerified>
       
  
     <MarginBio>
        <p>SOBRE MIM</p>
        <h5>
        {user.reforms.BioLi}
        </h5> 
       </MarginBio>
         
      
            </>
             )}
           </MarginInformation>
         
        
            </>
             )}
           
           </AboutList>
             
      </HoverCard.Content>
    </HoverCard.Portal>
  </HoverCard.Root>



            </ContentMember>
           </MemberList>
           </> 
            )}
             
        
        </>
    )
}



interface ViewHeaderProps {
  bannerUrl: string;
}
  
const ViewHeader = styled.header<ViewHeaderProps>`
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  background-color: rgb(10, 11, 17);
  background-size: cover;
  background-repeat: no-repeat;
   background-position-x: 50%;
  border-radius: 13px 13px 0px 0px;
  height: 8em;
  padding: 6em 1em 0em;
  margin-bottom: 2em;

`;



const CardBadges = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: rgba(23, 23, 24, 0.164);
    padding: 0em 0.3em 0em;
    border-radius: 9px;
    margin: 0.3em;
  `;

  
const Conatainerrif = styled.div`
 display: flex;
 flex-direction: row;
 justify-content: space-between;
 max-width: 70%;
 float: right;
 margin: 0.8em;
 
`;


const CardModal = styled.div`
     display: flex;
     flex-direction: row;
    
     align-items: center;
     
     ul{
        
       h2{
      color: #ffffff75;
      margin-bottom: 1em;
      text-align: center;
      font-size: 11px;
     }
  
     p{
      color: #87868d81;
      max-width: 290px;
      font-size: 10px;
     }
  
     a{
      color: #ff1139;
     }
     }
  
     i{
      text-align: center;
      font-size: 59px;
     }
  
     li{
      display: flex;
      align-items: center;
      margin-right: 0.6em;
     }
  
    
  `;


const ListVerified = styled.div`
      
margin-bottom: 0.6em;
padding: 0 0 0.2em; 
border-bottom: 1px solid rgba(28, 28, 29, 0.471);
 
 
i{
   margin: 0.4em;
   color: rgb(255, 0, 43);
}

p{
float: left;
color: #3e3f416e;
}

`;


 

 

const AboutList = styled.ul`
  
  text-align: left;
  color: #8a8e99;
  

 
    
 .logocard{
  border: 5px solid #070708;
  border-radius: 100px;
  }
  
  .nameuser{
    font-size: 14px;
  }
  
  .usernick{
    font-size: 12px;
    margin-top: -0.2em;
    margin-bottom: 0.9em;
    font-family: 'Poppins', sans-serif;
 color: #8a8e99;
  }

  .viewright{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2em;
  }
`;

const MemberList = styled.div`

   padding: 4px 0.3em 2px;
    
   
`;
 
const MarginInformation = styled.div`
     background-color: rgba(90, 91, 94, 0.055);
     padding: 1em;
     margin: 0.3em;
     border-radius: 19px;
     margin-top: 2em;
     margin-bottom: 0;
 
  `;

const MarginBio = styled.div`
background-color: rgba(25, 25, 26, 0.664);
padding: 0.3em 1em 1em;
border-radius: 12px;

p{
 font-size: 11px;
 margin-bottom: 0.5em;
}
h5{
 color: #424446;
 font-weight: 300;
 font-size: 13px;
 font-family: 'Inter', monospace;
 overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
`;


const ContentMember = styled.ul`
   display: flex;
   align-items: center;
   
   margin-left: 0.1em;
   
  .logoprofile{
    border-radius: 50%;
  }
 

  span{
    display: flex;
    align-items: center;
    flex-direction: row;
    
  }

   
    .border2{
      border-radius: 4px;
    }
`;

const HovercardContainer = styled.div`
cursor: auto;
`;



const ContentCard = styled.div`
   
  display: inline-flex;
  align-items: center;

  .logoprofile{
    border: 2px solid rgba(99, 99, 100, 0.329);
  }
 
  .ul{
    display:inline-flex;
    align-items: center;
    padding-left: 0.1em;
 
    img{
      margin: 0.1em;
    }
  }

  
`;

const ModalWrapper = styled.div`
 position: absolute;
 
  z-index: 1999;
  width: 18em;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.973);
  box-shadow: 0 2px 4px rgba(148, 149, 158, 0.055);
  padding: 10px;
  border: 1px solid rgba(246, 246, 247, 0.205);
  border-radius: 24px;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.2s ease-in-out;
  ${HovercardContainer}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;


function setUsers(usersWithReformInfo: any[]) {
  throw new Error("Function not implemented.");
}

