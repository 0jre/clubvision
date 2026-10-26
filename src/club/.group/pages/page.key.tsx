import Image from 'next/image';
import React from 'react'
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Nvxre from '@/public/icons/verified-nvxre.png'
import Crown from '@/public/favicon.png'
import { User } from "@/types/user/type.cla";

import axios from 'axios';
import { decrypt } from "@/core/security/encryption";
import IconInvite from '@/public/icons/airplane-ticket.png'
import copy from 'clipboard-copy';


interface UserData {
  name: string;
  id: string;
  avatar: string;
  namecharacter: string,
  nvrp:string,
  nvxre:string,
  verified:string,
}
 

interface CB {

    userId: string
}


export default function PageManagecla ({userId} : CB) {
  const [userInfo, setUserInfo] = useState <User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {

  
        fetchUserInfo();

  }, []);

  
const ListView = () => {
  const [userDataList, setUserDataList] = useState<UserData[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openmodalfriends, setmodalfriends] = useState(false);
  

  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        // Chama a API  para obter a lista de convidados
        const response = await fetch(`/api/cla/invitecla/invited.cla?userId=${userId}`);
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
      <ContainerList>
          {items}
      </ContainerList>
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
  





 ///// INVITE FRIEND
 
  
 const Codeinvitecla: React.FC = () => {
 
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const checkInviteInterval = setInterval(() => {
      handleCheckInvite();
    }, 1000); // Intervalo de verificação a cada 5 segundos (ajuste conforme necessário)

    return () => {
      clearInterval(checkInviteInterval); // Limpar o intervalo ao desmontar o componente
    };
  }, []); // O segundo argumento vazio garante que o useEffect seja executado apenas uma vez

  
  const handleCheckInvite = async () => {
    try {
      if (!userInfo || !userInfo.inviteCode) {
        setMessage('Código de convite não encontrado.');
        return;
      }
  
      const response = await fetch(`/api/cla/checkusedcode?checkinvite=${userInfo.inviteCode}`);
  
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        setMessage('Erro ao verificar o código do convite. Atualize a pagina porfavor!');
      }
    } catch (error) {
      console.error('Erro ao verificar o código do convite. Atualize a pagina porfavor!', error);
      setMessage('Erro ao verificar o código do convite. Atualize a pagina porfavor! ');
    }
  };
  return(
    <>
     {message && (
      <> 
      <NotificationSS>
   
         <li>
         <i className="fi fi-sr-engine-warning">
           <p>
           {message === 'Código ativo.' ? (
        'O código está ativo.'
      ) : message === 'O código foi usado.' ? (
        'O código foi usado.'
      ) : (
        message
      )}  
          </p>
         </i>
         </li>
  </NotificationSS>
  </>
    )}
    </>
  )
}




const [inviteCode, setInviteCode] = useState<string | null>(null);
const [codeUsed, setCodeUsed] = useState<boolean | null>(null); 
const [message, setMessage] = useState<string>('');



const generateInviteCode = async () => {
try {
const response = await fetch('/api/cla/generateinvite', {
  method: 'POST',
  body: JSON.stringify({ discordUserId: userId }),
  headers: {
    'Content-Type': 'application/json',
  },
});

if (response.ok) {
  const { code } = await response.json();
  setInviteCode(code);
  setCodeUsed(false);
  fetchUserInfo()
  setMessage('');
}
} catch (error) {
console.error('Erro ao gerar o código de convite:', error);
}
};

const ModalViewSharelink = ({ textToCopy }: { textToCopy: string }) => {
const [copied, setCopied] = useState(false);

const handleCopy = async () => {
  try {
    await copy(textToCopy);
    setCopied(true);
  } catch (error) {
    console.error('Erro ao copiar o link:', error);
  }
};
  return(
    <>
<div className='click' onClick={handleCopy}>
{copied ? 'Copiado' : userInfo?.inviteCode}
 </div>
    </>
  )
}


const linkToCopy = `${userInfo?.inviteCode}`;

 
 
    return(
      <Container>

     
       <ListView />  
   
       <Card>
       <Codeinvitecla />
       {userInfo !== null && (
        <>
    {userInfo.inviteCode ? ( 
        <>

        <ContainerCard>
          <ContentInfoInkite>
        
           <Image  
             src={IconInvite}
             className="invitecodeicon"
             alt="visioninvitecode"
             height={70}
           />
        
             
      

      <ul>
      <h2>Indique um amigo(a)</h2>

      <li>
        <span>1.</span>
        <h5>Compartilhe o codigo com um amigo.</h5>
      </li>

      <li>
        <span>2.</span>
        <h5>O seu codigo convite cla é valido apenas uma unica vez.</h5>
      </li>


      <li>
        <span>3.</span>
        <h5>Codigo convite é limitado apenas para uma unica pessoa</h5>
      </li>
      </ul>

        </ContentInfoInkite>

         

    {inviteCode ? (
    <ViewContentCode>
       <li>
    <i className="fi fi-sr-ticket-airline"/>
    <span className='bluew'>
  <h5><ModalViewSharelink textToCopy={linkToCopy} /></h5>
  </span>
  
     </li>
     <ButtonGenerate onClick={generateInviteCode}
     >
      Gerar Convite
     </ButtonGenerate>
    </ViewContentCode>
  ) : (
    <ViewContentCode>
      <li>
    <i className="fi fi-sr-ticket-airline"/>
    <span className='bluew'>
  <h5><ModalViewSharelink textToCopy={linkToCopy} /></h5>
  </span>
  
     </li>
     <ButtonGenerate onClick={generateInviteCode}
     >
      Gerar Convite
     </ButtonGenerate>
        
    </ViewContentCode>
  )}
 
        </ContainerCard>      
        </>
    ) : (
      <>
  
  
  <ContainerCard>
          <ContentInfoInkite>
        
           <Image 
             src={IconInvite}
             className="invitecodeicon"
             alt="visioninvitecode"
             height={90}
           />
        
      
        <ul>
      <h2>Indique um amigo(a)</h2>

      <li>
        <span>1.</span>
        <h5>Compartilhe o codigo com um amigo.</h5>
      </li>

      <li>
        <span>2.</span>
        <h5>O seu codigo convite cla é valido apenas uma unica vez.</h5>
      </li>


      <li>
        <span>3.</span>
        <h5>Codigo convite é limitado apenas para uma unica pessoa</h5>
      </li>
      </ul>

        </ContentInfoInkite>
        
   
    {inviteCode ? (
    <ViewContentCode>
       <li>
    <i className="fi fi-sr-ticket-airline"/>
    <span className='bluew'>
  <h5>{inviteCode}</h5>
  </span>
  
     </li>
     <ButtonGenerate onClick={generateInviteCode}
     >
      Gerar Convite
     </ButtonGenerate>
    </ViewContentCode>
  ) : (
    <ViewContentCode>
      <li>
    <i className="fi fi-sr-ticket-airline"/>
    <span className='bluew'>
  <h5><ModalViewSharelink textToCopy={linkToCopy} /></h5>
  </span>
   
     </li>
     <ButtonGenerate onClick={generateInviteCode}
     >
      Gerar Convite
     </ButtonGenerate>
        
    </ViewContentCode>
  )}
 
        </ContainerCard>      
      </>
    )}
       </>
        )}
       </Card>
       
       </Container>
    )
}


//////


const MarginTop = styled.div`
 display: flex;
  justify-content: space-between;
  position: fixed;
  right: 9px;
  top: 3%;
  z-index: 1999;
  margin: 0.8em;

 button{
  border-radius: 83px;
  height: 40px;
  width: 40px;
  margin:0.3em;
  background-color: rgba(77, 76, 78, 0.178);
  padding: 0.6em 0.7em 0.4em;
  color: #42474b;
 }
`;

const Container = styled.div`
   
    
  width: 100%;
  display: flex; 
  place-items: center;
  justify-content: center;
  align-items: center;
 
  flex-direction: row;
  animation: opacityModl 1s;

  @keyframes opacityModl {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }


 
`;
 

const Card = styled.div`

 padding: 0.3em 1em 0.3em;
 border-radius: 12px;
 width: 50%;
`;


/////////////// LIST 


/// 
 
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
   border: 2px solid rgba(143, 148, 146, 0.103);
  padding: 0.4em 0.8em 0.4em;
  border-radius: 15px;
  height: 20em;
  width: 50%;
  margin: 0.4em;
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




const NotificationSS = styled.div`
  

padding: 0.7em 1em 0.7em;
max-width: 100%;
border-radius: 8px;
background-color: #2e3130a4;
margin-bottom: 0;
display: flex;
align-items: center;
justify-content: space-between;


 i{
  font-size: 21px;
  display: flex;
  align-items: center;
  color: #2e2e33;
 }

p{
  font-size: 11px;
 width: 140px;
  margin-left: 0.8em;
  color: #9c9da7dc;
}

li{
  display: flex;
  align-items: center;
  margin-right: 0.9em;
}
`;

const ContainerCard = styled.section`  
    display: flex;
    flex-direction: column;
    height: 40%;
    width: 100%;
    padding: 1em;
    
    .invitecodeicon{
       max-width: 150px;
       max-height: 150px;
    }

    
`;

const ContentInfoInkite = styled.div`
    
    display: flex;
    align-items: center; 
    width: 100%;
    border: 2px solid rgba(63, 63, 70, 0.034);
    padding: 0.5em 1em 0.5em;
    border-radius: 12px;

    li{
       
      display: flex;
      align-items: baseline;
      flex-direction: row;
      
      h5{
        padding-left: 0.4em;
        color: #52585e;
        font-size: 11px;
      }
      
      span{
        color: #898d91;
        font-size: 14px;
      }
    }

    h2{
      font-family: 'Inter',sans-serif;
      color: #898c8f;
      font-size: 19px;
      font-weight: 29;
      margin-bottom: 1em;
    }
   
    ul{
      margin-left: 0.9em;
    }
  
`;
const ViewContentCode = styled.div`
 
  backdrop-filter: blur(100px);
  background-color: #2e3130a4;
  height: 3em;
  max-width: 100%;
  padding: 8px;
  font-size: 16px;
  border: none;
  border-radius: 11px;
  margin: 1em;
  color: #9293a0;
  padding: 1.5em 1em 1.5em;
  font-family: 'Poppins', Courier, monospace;
  display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
 

    i{
        color: rgb(96, 97, 96);
        margin-top: 0.2em;
        font-size: 23px;
        transform: rotate(-70deg);
    }

    h5{
      padding-left: 0.4em;
    }

    li{
      display: flex;
    align-items: center;
    flex-direction: row;
 
    }

    span{
      cursor:  var(--f-cursor-pointer);
    }

    .click{

    }
  `;




const ButtonGenerate = styled.button`
   background: transparent;
   padding: 0.2em 0.9em 0.2em;
   border-radius: 22px;
   border: 2px solid rgba(129, 126, 143, 0.082);
   font-family: 'Poppins', sans-serif;
   color: rgba(124, 123, 129, 0.705);
   margin: 1em;
   font-size: 12px;
   transition: 1s all;

   :hover{
    background: rgba(149, 172, 164, 0.116);
   }

`;
