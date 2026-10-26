import Image from 'next/image';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

/// 
import Iconempty from '@/public/icons/xeffect.png'

interface UserCx {
  userId: React.ReactNode;
}

interface UserData {
  name: string;
  id: string;
  avatar: string;
  // Adicione outros campos conforme necessário
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
        <li key={i}>
          <CardRotate />
          <h3>----</h3>
        </li>
      );
    }
  
    return (
      <>
        <ContentUsers>
          {items}
        </ContentUsers>
      </>
    );
  }

  return (
    <>
      <ContentUsers>
       
      {userDataList.length > 0 ? (
  userDataList.map((userData) => (
    <li key={userData.id}>
      <Image className='logoavatar' src={userData.avatar} alt={'amigo convidado'} height={40} width={40} />
      <h3>{userData.name}</h3>
     
    </li>
  ))
) : (
  <>
    <ContainerNone>
       <ul>
        <Image src={Iconempty} alt='empty' height={120} />
        <h3>Nada foi encontrado aqui.</h3>
       </ul>
    </ContainerNone>
  </>
)}
      </ContentUsers>
    </>
  );
}


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
const ContentUsers = styled.div`
   display: flex;
   flex-direction: row;
   flex-wrap: wrap;
  align-items: center;
  place-items: center;
 
  justify-content: center;

   .logoavatar{
     border-radius: 100%;
     transition: all 1s;
     &:hover{
      transform: scale(0.8);
     border-radius: 30%; 
  }
   }

   li{
    display: inline-flex;
    align-items: center;
    margin: 0.6em;
    background-color: rgba(133, 134, 141, 0.055);
    padding: 0.4em;
    border-radius: 12px;
    }

    h3{
      margin: 0.4em;
      font-family: 'Inter', monospace;
      font-size: 20px;
      color: #85898d;
    }
 

`;