import Image from "next/image";
import styled from "styled-components"
import React, { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { User } from '@/types/user/searchall';
import axios from 'axios';
import Nvxre from '@/public/icons/verified-nvxre.png'
import Crown from '@/public/favicon.png'
import router from "next/router";

import { decrypt } from "@/core/security/encryption";
import NotificationUI from "@club/components/notification/card.mnc";
import { Tooltip } from "@mui/material";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { SmallAvatar } from "@club/components/menu/account.utils";
import LoadingPageView from "@club/resources/loading/market.loading";

 
interface Ucla {
  LogoCla: string,
  Clasigla: string, 
}


interface Props {
  users: User[];
  children: ReactNode;
  content: ReactNode;
  buttonText: ReactNode;
  closemenu?:ReactNode;
  
}


async function fetchUserInfo(): Promise<Props> {
    const response = await fetch('/api/autentic/application_nvxre');
    if (!response.ok) {
      throw new Error('Falha ao buscar informações do usuário.');
    }
    const data = await response.json();
    return data;
  }

  
export default function ListMembers () {

 
  const [searchQuery, setSearchQuery] = useState('');
 
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(e.target.value);
};



 // State para armazenar os usuários
 const [usersList, setUsersList] = useState<User[]>([]);
 const [userCount, setUserCount] = useState<number>(0);
 const [lastUserName, setLastUserName] = useState<string>('');

 const filteredUsers = searchQuery
 ? usersList.filter((user) =>
     user.name.toLowerCase().includes(searchQuery.toLowerCase())
   )
 : usersList;


 const fetchUsers = async () => {
   try {
     const response = await axios.get('/api/autentic/application_nvxre');
     const dataw = decrypt(response.data);
     const parsedDataw = JSON.parse(dataw);
     setUsersList(parsedDataw);
     const usersWithReformInfo = await Promise.all(
      parsedDataw.map(async (user: User) => {
         try {
        
           const reformResponse = await axios.get(`/api/autentic/xyloQuerierAPI?userId=${user.reforms?.userId}`);
           const datawre = decrypt(reformResponse.data.log);
           const reformInfo = JSON.parse(datawre);
           return {
             ...user,
             reform: reformInfo,
           };
         } catch (error) {
          //  console.error('Error fetching user info:', error);
           return user;
         }
       })
     );
 // Ordenando os usuários pelo primeiro caractere do nome
 const sortedUsers = usersWithReformInfo.sort((a: User, b: User) => a.name.localeCompare(b.name));

 setUsersList(sortedUsers);
 setUsersList(usersWithReformInfo);
   } catch (error) {
    //  console.error('Error fetching users:', error);
   }
 };


 const fetchUserCount = async () => {
  try {
    const response = await axios.get('/api/autentic/checklist');
    setUserCount(response.data.count);
    setLastUserName(response.data.lastUserName);
  } catch (error) {
    // console.error('Error fetching user count:', error);
  }
};

useEffect(() => {


  fetchUsers();
  fetchUserCount();
 
}, []);
 const [userInfo, setUserInfo] = useState<Props | null>(null);
 const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
   let isMounted = true;

   fetchUserInfo()
     .then((data:any) => {
       if (isMounted) {
        const datawZX = decrypt(data);
        const SetDataFeas = JSON.parse(datawZX);
         setUserInfo(SetDataFeas);
         setLoading(false);
       }
     })
     .catch((error) => {
      //  console.error(error);
       setLoading(false);
     });

   return () => {
     isMounted = false;
   };
 }, []);

 if (loading) {
  return (
  <MarginA>
   <LoadingPageView />
  </MarginA>
  );
}


 if (!userInfo) {
   return (
    <NotificationUI message={<>Nao foi possivel, processar as informações!!</>} />
   );
 }
  
    return(
        <>
      
          <Header>
          <SearchUserContainer>
        
            <SearchLabel>
                <i className="fi fi-br-search" />
                <SearchUsers
                 name="text"
                 type="text" 
                 value={searchQuery}
                 onChange={handleSearchChange}
                 placeholder="Procurar Membros"
                />
            </SearchLabel>
            <UserNumber>
          <ul>
            <i className="fi fi-rr-hundred-points" />
            <h5>Total Membros :</h5>
           <p>{userCount}</p>
          </ul>

          <ul>
          <i className="fi fi-rr-hundred-points" />
          <h5>Ultimo membro :</h5>
           <p>{lastUserName}</p>
          </ul>
        </UserNumber>
        </SearchUserContainer>
         </Header>
 
        <ContainerList>
       
     
          <ScrollsSt>
         {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
               <>
        <ListUserView>
    
        
        <UserViewInfo key={user.id}  onClick={() => router.push(`/@${user.name}`)}>

        {user.reforms && (
    <>
<ViewHeaderProfile bannerUrl={user.reforms.bannerfundo}>
<li>

<Stack direction="row" spacing={1}>

{user.cla ? (
<>
<Tooltip title={`${user.cla.Clasigla ? 'Clã -' : '' } ${user.cla.Clasigla}`} placement="top"> 
<Badge
overlap="circular"
anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
badgeContent={
<SmallAvatar src={user.cla.LogoCla ? `${user.cla.LogoCla}` : "/favicon.png"} alt={user.cla.Clasigla} />
}
>

<Avatar src={user.avatar} alt={user.name} sx={{ height: '45px', width: '45px'}} />
</Badge>
</Tooltip>
</>
) : (
<Avatar src={user.avatar} alt={user.name}  sx={{ height: '45px', width: '45px'}}/>
)}
</Stack>

{/* <Image 
src={user.avatar} 
alt={user.name} 
className="logoavatar" 
height={55}
width={55}
/> */}
{user.reforms ? (
   <>
<ul>
<span>
    <h2>{user.reforms.name}</h2>
{user.reforms.verified && (
<>
<h5>   <svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="20" width="20" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg></h5>  
</>
)}
    {user.reforms.nvxre && (
    <>
    <h5 className="h5"><Image src={Nvxre} alt="nvxre" height={22}/></h5>  
    </>
    )}  

{user.reforms.nvrp && (
    <>
    <h5 className="h5"> <Image  className="logoroda" src={Crown} alt="Moderator" height={22}/></h5>  
    </>
    )}  
   </span>

    <p>{user.name}</p>
</ul>
</>
  ) : 
  (
<ul>
<h2>---</h2>
<p>{user.name}</p>
</ul>
  )
  }
</li>

</ViewHeaderProfile>
</>
    )}

      
        </UserViewInfo>
       
     
  </ListUserView>
         
            </>
  ))
  ) : (
    <ContainerError>
      <p>Nenhum resultado encontrado.</p>
    </ContainerError>
     )}
  </ScrollsSt>
        </ContainerList>
        
        </>
    )
}



const SearchUserContainer = styled.section`
     display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
    padding: 0em 0em 1em;
   width: 100%;
   height: 100%;

`;


const ButtonInvite = styled.button`
  
  background-color: rgba(223, 223, 226, 0.11);
  color: #c6c9cc;
  border-radius: 62px;
  margin: 0.3em;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14px;
  padding: 0.5em 1.4em 0.5em;
   transition: 1s all;

   &:hover{
    background-color: transparent;
   }
`;

const SearchLabel = styled.label`
 
 background-color: rgba(9, 10, 10, 0.89);
 backdrop-filter: blur(23px);
  width: 40%;
  height: 3em;
  padding: 8px;
  font-size: 16px;
  border-radius: 34px;
  color: #9293a0;
  padding: 1.5em 1em 1.3em;
  margin-bottom: 0.2em;
  font-family: 'Poppins', Courier, monospace;
  margin-bottom: 0.3em;
  margin-top: 1em;

    display: flex;
    align-items: center;
    flex-direction: row;


    i{
        color: #3b3b3d;
        font-size: 23px;
    }


    @media screen and (max-width: 530px) {

    width: 90vw;

  }
`;

const SearchUsers = styled.input`
  background-color: transparent;
  width: 18em;
  height: 3em;
  padding: 8px;
  font-size: 14px;
  border: none;
  border-radius: 24px;
  color: #ffffff96;
  padding: 1.5em 1em 1.5em;
  margin-bottom: 0.7em;
  font-family: 'Poppins', Courier, monospace;
  margin: 0.9em;
  
  :focus{
    outline: none;
  }

  @media screen and (max-width: 530px) {

width: 100vw;

}
  
  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #ffffff96;
  }
  
  :focus {
  border: none;
  box-shadow: none; 
  outline: none;
}
  :-webkit-autofill,
  :-webkit-autofill:hover, 
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover
  :-webkit-autofill:focus,
  :-webkit-autofill,
   :-webkit-autofill:hover,
   :-webkit-autofill:focus {
  -webkit-text-fill-color: #ffffff96 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: var(--f-cursor-pointer);
}

`;

const ContainerError = styled.div`
  width: 100%;
  height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  justify-content: center;
`;

const Header = styled.div`
  width: 100%;
  height: 199px;
  border-radius: 12px;
  padding: 4em 0 0;
  background-image: url('/theim/backgrounds/bdsh8fisdbfgshdnub.webp') ;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-position-y: 120%;

   
`;

const ContainerList = styled.section`
    padding: 0.5em 2em 2em;
  
   animation: LEFTANIMWR 1s alternate;
    
     
    @keyframes LEFTANIMWR {
     0%{ opacity: 0; transform: translateY(100%)}
     100%{ opacity: 1; transform: translateY(0%)}
    }
    

    .logoroda{
        border-radius: 14px;
        text-align: center;
    }

    @media screen and (max-width: 530px) {
      padding: 0.5em 0em 0em;
  
   }
`;


const ListUserView = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    text-align: left;
 
`;


const UserViewInfo = styled.div`
     display: flex;
     align-items: center;
     flex-direction: row;
     justify-content: space-between;
     cursor:  var(--f-cursor-pointer);
     border-radius: 69px;
     margin: 0.4em;
     border: 2px solid transparent;
     margin-bottom: 0.2em;
    
     .marginright{
      display: flex;
      align-items: center;
      flex-direction: row;
     }
     
    li{
        display: flex;
        align-items: center;
    }

     ul{
        padding: 0.3em;
        padding-left: 1em;

        h2{
           font-size: 16px;
           color: #e7f1fc;
        }

        p{
          font-size: 12px;
          text-align: justify;
          color: rgb(130, 134, 138);
        }
     }
    
     span{
        display: flex;
        align-items: center;


        h5{
           padding-left: 0.4em;
          
        }

        .h5{
          padding-top: 0.4em;
        }
     }
   .logoavatar{
     border-radius: 100%;
     border: 2px solid rgba(78, 73, 100, 0.315);
   }

   @media screen and (max-width: 530px) {
    margin: 0;
   }
`;





interface ViewHeaderProps {
    bannerUrl: string;
  }
    
  const ViewHeaderProfile = styled.header<ViewHeaderProps>`
    
    background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
    background-color: rgb(10, 11, 17);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 13px;
    height: 12rem;
    width: 400px;
    padding: 8em 1em 0em;
    
     &:hover{
     background-color: rgba(31, 32, 32, 0.26);
     transform: scale(1);
     z-index: 188;
     position: relative;
     border: 2px solid rgba(78, 73, 100, 0.315);
     box-shadow: 0px 2px 22px rgba(255, 255, 255, 0.068);
   }


   @media screen and (max-width: 530px) {
    width: 98vw;
   }
  `;

 
  const ContentMember = styled.ul`
     display: flex;
     align-items: center;
  
    .logoprofile{
      border-radius: 50%;
    }
   
    
    li{
      margin: 0.4em;
    }
  
    h2{
      font-size: 15px;
      color: #d5d6da;
     
    }
  
    span{
      display: flex;
      align-items: center;
      justify-content: center;
      h5{
          margin-left: 0.4em;
          color: rgb(255, 0, 43);
      }
    }
  
    p{
     font-size: 12px;
     color: #8c919b;
    }

    .h5{
        margin-top: 0.4em;
    }
  `;
  

  const UserNumber = styled.div`
     
     display: flex;
     align-items: center;
     margin: 0.8em;
     width: 50%;
     backdrop-filter: blur(69px);
     background-color: rgba(68, 68, 77, 0.151);
     border-radius: 12px;
     padding: 0.3em 1em 0.3em;
     justify-content: space-between;

     ul{
       display: flex;
       align-items: center;
       font-size: 11px;
       margin: 0.4em;

      h5{
        padding-left: 0.4em;
        color: #3c414489;
      }

      i{
        color: #79636888;
      }

      p{
       color: #79636888;
        padding-left: 0.4em;
      }
     }

     @media screen and (max-width: 530px) {
      backdrop-filter: blur(639px);
      background-color: rgba(15, 15, 17, 0.849);
width: 95vw;


 

}
  `;
  

  
const ScrollsSt = styled.div`
   display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    text-align: left;
`;
  const HovercardContainer = styled.div`
      position: relative;
    
  `;

  const CardView = styled.div`
     
      padding: 1em 0.4em 1em;
      margin: 1em;
      height: 100%;
      border-radius: 22px; 
      text-align: center;

      .imagecenter{
        text-align: center;
        margin-left: 5%;
      }
   `;

   const Contentuser = styled.ul`

      display: flex;
      align-items: center;
      flex-direction: column;

       h2{
        margin-bottom: 1em;
        text-align: center;
        font-size: 19px;
        font-family: 'Europa Grotesk';
        color: rgba(190, 181, 199, 0.712);
        max-width: 300px;
       }
    
       li{
        display: flex;
        align-items: center;
        flex-direction: row;
     
       }
   `;

   const ButtonClickInvite = styled.button`
    background-color: rgba(247, 38, 38, 0.452);
    padding: 0.5em 1.4em 0.5em;
    border-radius: 22px;
    color: #0e0f0f;
    font-family: 'Poppins', sans-serif;
    margin: 3%;
    border: 1px solid transparent;
    transition: 1s all;

    :hover{
        background-color: transparent;
        border: 1px solid rgba(22, 20, 20, 0.192);
        color: #868588;
      }
   `;
 

 
const MarginA = styled.div`
   
   height: 100vh;
   width: 100%; 
   display: flex;
  justify-content: center;
  place-items: center;
`;

const MarginInvite = styled.div`
  
   padding: 0.9em 1em 0.9em;
    border-radius: 11px;
    background-color: #0B0C0A;
    background-image: url('/web/hdshfioef.png');
    background-repeat: no-repeat;
    background-size: cover;
    transition: 0.7s all;
    margin: 0.9em;
    width: 43%;


    .li{
      padding: 0em 1em 0em;
      margin-bottom: 0.4em;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(52, 52, 58, 0.568);

      ul{
        display: inline-flex;
      align-items: center;
      }
    }

    .h5{
      font-family: 'XcSemibold', sans-serif;
      font-size: 23px;
      margin: 0.9em;
      
      color: #9fa8a5;
    }
   transform: translateY(20px);
  animation: fadeInUp 0.8s ease-in-out forwards;
  @keyframes fadeInUp {
    0%{ opacity: 0; transform: translateY(20%)}
    100%{ opacity: 1; transform: translateY(0)}
  }
`;
