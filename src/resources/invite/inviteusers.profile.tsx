import Image from 'next/image';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Nvxre from '@/public/icons/verified-nvxre.png'
import Crown from '@/public/favicon.png'

/// 
import Iconempty from '@/public/icons/topmenu/nothing.png'
import router from 'next/router';

interface UserCx {
  userId: React.ReactNode;
}

interface UserData {
  name: string;
  id: string;
  avatar: string;
  nvrp: boolean;
  nvxre:boolean;
  BioLi: string;
  verified: boolean;
}

export default function IndexMyfd({ userId }: UserCx) {
  const [userDataList, setUserDataList] = useState<UserData[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        // Chama a API /api/nvxre/inviteds para obter a lista de convidados
        const response = await fetch(`/api/nvxre/inviteds?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();

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
    const items = [];
    for (let i = 0; i < 98; i++) {
      items.push(
           <UserViewInfo key={i}>
            <li>
           
          <CardRotate />
     
            <ul>
            <span>
                <h2>-----</h2>
  
          </span>
            
                <p>----</p>
            </ul>
      
            </li>
        </UserViewInfo>
      );
    }
  
    return (
      <>
     {items}
  
      </>
    );
  }

  return (
    <>
   
      {userDataList.length > 0 ? (
  userDataList.map((userData) => (
    <UserViewInfo key={userData.id} onClick={() => router.push(`/@${userData.name}`)}>
            <li>
            <Image 
            src={userData.avatar} 
            alt={userData.name} 
            className="logoavatar" 
            height={50}
            width={50}
            />
          {userData ? (
               <>
            <ul>
            <span>
                <h2>{userData.name}</h2>
        {userData.verified && (
        <>
     <h5> <img src={'/icons/verified1.png'} alt="verified" height={19} width={19}/></h5>  
        </>
     )}
                {userData.nvxre && (
                <>
                <h5><Image src={Nvxre} alt="nvxre" height={19}/></h5>  
                </>
                )}  

          {userData.nvrp && (
                <>
                <h5> <Image  className="logoroda" src={Crown} alt="Moderator" height={19}/></h5>  
                </>
                )}  
               </span>
            
                <p>{userData.BioLi}</p>
            </ul>
            </>
              ) : 
              (
            <ul>
            <h2>---</h2>
          
            </ul>
              )
              }
            </li>

        
        </UserViewInfo>
  ))
) : (
  <>
     <Margib>
                  <h1>não foi encontrado nenhum amigo</h1> 
                  <p>Depois de convidar os amigos, eles serão exibidas aqui.</p>
   </Margib>
  </>
)}

    </>
  );
}



const Margib = styled.div`
  width: 100%;
  height:50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  place-content: center;

  h1{
    font-family: 'Inter', monospace;
    font-size: 19px;

  }

  p{
    font-size: 12px;
    font-family: 'InterSemiBold', monospace;
  }
`;


const UserViewInfo = styled.div`
     display: flex;
     align-items: center;
     flex-direction: row;
     justify-content: space-between;
     cursor: var(--f-cursor-pointer);
     padding: 0px 0.2em 0px;
     border-bottom: 2px solid #1d1f1f14;
 
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
        padding: 1em;

        h2{
           font-size: 16px;
           color: #e7f1fc;
        }

        p{
          font-size: 12px;
          text-align: justify;
          color: rgb(130, 134, 138);

          max-width: 100%;
     
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
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

   &:hover{
    border-bottom: 2px solid #1d1f1f;
   }
`;

  

const ContainerNone = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  margin-top: 14%;
  justify-content: center;
  align-items: center;

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
      color: #40414263;
    }
  }
`;

const CardRotate = styled.div`

  border-radius: 50%;
  background-size: cover;
  animation: Load 2s infinite;
  height: 50px;
  width: 50px;

@keyframes Load {

  0% { background-color: rgba(137, 150, 145, 0.274);  }
  10% { background-color: rgba(124, 121, 136, 0.247); }
  40% { background-color: rgba(141, 137, 137, 0.226); }
  70% { background-color: rgba(146, 146, 155, 0.233); }
  80% { background-color: rgba(149, 149, 151, 0.137); }
  100% { background-color: rgba(255, 255, 255, 0.041); }
}
`;
