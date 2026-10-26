import Image from "next/image";
import styled, {keyframes} from "styled-components"
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
 import axios from 'axios';
import Nvxre from '@/public/icons/verified-nvxre.png'
import Vderified from '@/public/icons/verified1.png'
import Crown from '@/public/favicon.png'
import router, { useRouter } from "next/router";
import ROUTENVX from "@/routes/routes";
import InviteButton from "@club/resources/invite/xticket/button.invite";

import { decrypt } from "@/core/security/encryption";
import NotificationUI from "@club/components/notification/card.mnc";
import { User } from "@/types/user/searchall";

interface Props {
  users: User[];
  children: ReactNode;
  content: ReactNode;
  className?: string;
  buttonText: string;
  
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
const [searchResults, setSearchResults] = useState<User[]>([]);
const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

const handleInviteClick = (userId: string) => {
  setIsOpenSS(true);
  setSelectedUserId(userId === selectedUserId ? null : userId);
};
const [isOpenSS, setIsOpenSS] = useState(false);

 
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(e.target.value);
};

const performSearch = () => {
  const results = usersList.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  setSearchResults(results);
};

// Use o useEffect para chamar a função de pesquisa quando a entrada muda
useEffect(() => {
  performSearch();
}, [searchQuery]);

 // State para armazenar os usuários
 const [usersList, setUsersList] = useState<User[]>([]);
 const [userCount, setUserCount] = useState<number>(0);
 const [lastUserName, setLastUserName] = useState<string>('');
 
 


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
           console.error('Error fetching user info:', error);
           return user;
         }
       })
     );
 // Ordenando os usuários pelo primeiro caractere do nome
 const sortedUsers = usersWithReformInfo.sort((a: User, b: User) => a.name.localeCompare(b.name));

 setUsersList(sortedUsers);
 setUsersList(usersWithReformInfo);
   } catch (error) {
     console.error('Error fetching users:', error);
   }
 };


 const fetchUserCount = async () => {
  try {
    const response = await axios.get('/api/autentic/checklist');
    setUserCount(response.data.count);
    setLastUserName(response.data.lastUserName);
  } catch (error) {
    console.error('Error fetching user count:', error);
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
     .then((data: any) => {
       if (isMounted) {
        const datawZX = decrypt(data);
        const SetDataFeas = JSON.parse(datawZX);
         setUserInfo(SetDataFeas);
         setLoading(false);
       }
     })
     .catch((error) => {
       console.error(error);
       setLoading(false);
     });

   return () => {
     isMounted = false;
   };
 }, []);

 if (loading) {
   return (
   <>
 
   </>
   );
 }

 if (!userInfo) {
   return (
    <NotificationUI message={<>Nao foi possivel, processar as informações!!</>} />
   );
 }
  
  
 
    return(
        <>
      

     <ModalWrapper3>   
        <ContainerList>
      
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
         
        </SearchUserContainer>
          <ScrollsSt>
          {(searchQuery ? searchResults.slice(0, 10) : usersList)
  .filter(user => !user.reforms?.type)
  .map(user => (
               <>
        <ListUserView>
        <HovercardContainer>
        
        <UserViewInfo key={user.id}>
           
            {isOpenSS ?(
   <>

      <Contentuser>
        <ul>
      <li>
    <Image 
    src={user.avatar} 
    alt={user.name} 
    className="logoavatar" 
    height={50}
    width={50}
    />
  {user.reforms ? (
       <>
    <ListUserView>
    <span>
        <h2>{user.reforms.name}</h2>
{user.reforms.verified && (
<>
<h5> <Image src={Vderified} alt="verified" height={22}/></h5>  
</>
)}
        {user.reforms.nvxre && (
        <>
        <h5><Image src={Nvxre} alt="nvxre" height={22}/></h5>  
        </>
        )}  

  {user.reforms.nvrp && (
        <>
        <h5> <Image  className="logoroda" src={Crown} alt="Moderator" height={22}/></h5>  
        </>
        )}  
       </span>
    
        <p>{user.name}</p>
    </ListUserView>
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
   
    {user.reforms?.type == 'Authorized' ? null : (
  <ButtonInvite onClick={() => handleInviteClick(user.id)}>
   {user.id === selectedUserId ? 'Cancelar' : 'Convidar'}
  </ButtonInvite>
)}
</ul>

{selectedUserId === user.id && <InviteButton UserId={user.id} />}
      </Contentuser>


   </> 
  ) : (
    <Contentuser> 
    <ul>
    <li>
  <Image 
  src={user.avatar} 
  alt={user.name} 
  className="logoavatar" 
  height={50}
  width={50}
  />
{user.reforms ? (
     <>
  <ListUserView>
  <span>
      <h2>{user.reforms.name}</h2>
{user.reforms.verified && (
<>
<h5> <Image src={Vderified} alt="verified" height={22}/></h5>  
</>
)}
      {user.reforms.nvxre && (
      <>
      <h5><Image src={Nvxre} alt="nvxre" height={22}/></h5>  
      </>
      )}  

{user.reforms.nvrp && (
      <>
      <h5> <Image  className="logoroda" src={Crown} alt="Moderator" height={22}/></h5>  
      </>
      )}  
     </span>
  
      <p>{user.name}</p>
  </ListUserView>
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
  {user.reforms?.type == 'Authorized' ? null : (
  <ButtonInvite onClick={() => handleInviteClick(user.id)}>
       {user.id === selectedUserId ? 'Cancelar' : 'Convidar'}
  </ButtonInvite>
)}
 
  </ul>
  </Contentuser>
  )}

       
 
             
        </UserViewInfo>
       
      
      </HovercardContainer>
        </ListUserView>
         
            </>
   ))}
    {searchQuery !== '' && searchResults.length === 0 && (
     <p>Nenhum resultado encontrado.</p>
   )}
  </ScrollsSt>
        </ContainerList>
        </ModalWrapper3>
    
        </>
    )
}



const SearchUserContainer = styled.section`
    
    padding: 0em 0em 1em;
    border-bottom: 1px solid rgba(84, 84, 88, 0.068);
`;


const ButtonInvite = styled.button`
  
  background-color: rgba(223, 223, 226, 0.11);
  color: #c6c9cc;
  border-radius: 62px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14px;
  padding: 0.4em 1em 0.4em;
   transition: 1s all;

   &:hover{
    background-color: transparent;
   }
`;

const SearchLabel = styled.label`
 
 background-color: rgba(31, 32, 32, 0.26);
  width: 100%;
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
  cursor: pointer;
}

`;


const ContainerList = styled.section`

    .logoroda{
        border-radius: 14px;
        text-align: center;
    }
`;


const ListUserView = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
 
`;


const UserViewInfo = styled.div`
     display: flex;
     align-items: center;
     justify-content: space-between;
     
     padding: 0px 0.2em 0px;
     border-radius: 79px;
     width: 100%;
     margin: 0.4em;
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
        display: flex;
        text-align: center;
        flex-direction: row;
        justify-content: space-between;

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
           padding-top: 0.4em;
        }
     }
   .logoavatar{
     border-radius: 100%;
     border: 2px solid rgba(78, 73, 100, 0.315);
   }
`;


  
const ScrollsSt = styled.div`
   height: 79%;
   overflow-y: scroll;
`;
  const HovercardContainer = styled.div`
    
    
  `;

   const Contentuser = styled.div`

      display: flex;
      align-items: center;
      flex-direction: column;
      width: 50vw;
      

       h2{
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
        gap: 9px;
       }

       @media screen and (max-width: 530px) {
        width: 90vw;
       }
   `;


const ModalWrapper3 = styled.div`
   
   height: 100%;
   width: 100%; 
   
`;



const HovercardContainerW = styled.div`
cursor: auto;

display: flex;
align-items: center; 
flex-direction: row;
  
    
    i{
        font-size: 17px;
        color: #cfd5f18b;
     
     }

    
     li{
      display: flex;
      align-items: center;
      flex-direction: row;
     
        margin-bottom: 0.2em;
     }


     .vier{
      padding-left: 14px;
      display: flex;
      align-items: center;
      flex-direction: column;
      
      h5{
        color: #dedff375;
      }
      p{
        max-width: 142px;
        font-size: 9px;
      }
     }
   
     button:hover{
      position: relative;
        top: -1px;
        background-color: #bcc2bf13;
        padding: 0.9em 1em 0.8em;
        border-radius: 50%;
        height: 45px;
        width: 45px;
        transition: all 0.2s;
     }
     
     button{
      display: flex;
       flex-direction: row;
       padding: 0.9em 1em 0.8em;
       transition: all 0.9s;
       margin: 0.3em;
       border-radius: 12px;
       height: 45px;
       width: 45px;
       background-color: rgba(255, 255, 255, 0.041);
     } 
     span{
       margin-left: 12px;
       font-family: 'Yantramanav', sans-serif;
       color: #cfc9c9b9;
     }
    p{
      font-size: 12px;
      color: #b6afaf75;
    }
`;


const HovercardContentW = styled.div`
   position: fixed;
  flex-flow: center;
  z-index: 1999;

  width: 18em;
  margin-left: 3.4em;
  background-color: rgba(7, 7, 7, 0.247);
  box-shadow: 0 2px 4px rgba(148, 149, 158, 0.055);
  padding: 10px;
  border: 1px solid rgba(221, 221, 221, 0.089);
  border-radius: 12px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
   
  ${HovercardContainerW}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

 
 