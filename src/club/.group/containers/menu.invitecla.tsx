import Image from 'next/image';
import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import { UserData } from "@/types/user/types";
import NotificationUI from '@club/components/notification/card.mnc';


async function fetchUserInfo(): Promise<UserData> {
    const response = await fetch('/api/autentic/searchuser');
    if (!response.ok) {
      throw new Error('Falha ao buscar informações do usuário.');
    }
    const data = await response.json();
    return data;
  }

export default function InviteCla () { 
    const [user, setUser] = useState<UserData | null>(null);
    const [inviteCode, setInviteCode] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [ownerInfo, setOwnerInfo] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState('');
   const [isFormSubmitted, setIsFormSubmitted] = useState(false)
   const [isLoading, setIsLoading] = useState(true);

 
    const handleAuthorize = async () => {
      setIsVerifying(true);
      try {
        const response = await fetch(`/api/cla/authorization.cla`, {
          method: 'POST',
          body: JSON.stringify({ discordUserId: user?.id, inviteCode }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setResponseMessage(`Código de convite usado!`);
          // Chame a nova API para obter as informações do convidado
          const guestInfo = await getGuestInfo(inviteCode);
          // Você pode usar as informações do convidado conforme necessário
          console.log('Guest Info:', guestInfo);
          setIsFormSubmitted(true);
          setTimeout(() => {
            setIsFormSubmitted(false);
          }, 5000);
          await handleGetOwnerInfo();
        } else {
          const data = await response.json();
          setResponseMessage(data.error);
          setIsFormSubmitted(true);
          setTimeout(() => {
            setIsFormSubmitted(false);
          }, 5000);
        }
      } catch (error) {
        setResponseMessage(`Algum Problema aconteceu aqui!`);
      } finally {
        setIsVerifying(false);  
      }
    };
  
    const getGuestInfo = async (inviteCode: string) => {
      try {
        const response = await fetch(`/api/cla/invitecla/guest.invite?inviteCode=${inviteCode}`, {
        method: 'POST',
        body: JSON.stringify({
          Iduser: user?.user.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
        if (response.ok) {
          const data = await response.json();
          return data; // Retorna as informações do convidado
        } else {
          const data = await response.json();
          console.error('Error fetching guest info:', data.error);
          return null;
        }
      } catch (error) {
        console.error('Error fetching guest info:', error);
        return null;
      }
    };
  
    const handleGetOwnerInfo = async () => {
      try {
        const response = await fetch(`/api/cla/invitecla/cla.inviteowner?inviteCode=${inviteCode}`);
  
        if (response.ok) {
          const data = await response.json();
          setOwnerInfo(data);
          setErrorMessage('');
        } else {
          const data = await response.json();
          setOwnerInfo(null);
          setErrorMessage(data.error);
        }
      } catch (error) {
        setOwnerInfo(null);
        setErrorMessage('Ocorreu um erro ao buscar as informações do proprietário.');
      }
    };


    useEffect(() => {
        let isMounted = true;
    
        fetchUserInfo()
          .then((data) => {
            if (isMounted) {
              setUser(data);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            console.error(error);
            setIsLoading(false);
          });
    
        return () => {
          isMounted = false;
        };
      }, []);
     

    return(
        <Container>
         
        <ContentAS>
         
            <InputCardN>
                <label>
               <i className="fi fi-sr-ticket" />
                <InputList
                    type="text"
                    placeholder="Código de Convite"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                  />

                <ButtonRegister onClick={handleAuthorize} disabled={isVerifying}>
                 {isVerifying ? <i className="fi fi-br-loading" /> : 'Aplicar'}
                 </ButtonRegister>
                </label>
           
              
                
                 </InputCardN>
              
    {ownerInfo && ( 
  <CardInfoowner>
  <Image  
    src={ownerInfo.Avatare} 
    alt={ownerInfo.userName}   
    height={50} width={50} className="logos" />
  <section>
  <h3>{ownerInfo.userName}</h3>
  <p>Convidado a participar do cla {ownerInfo.claname}</p>
  </section>
  </CardInfoowner>
      )}
            </ContentAS>

            {isFormSubmitted &&  
              <>
              <NotificationUI message={responseMessage} />
              </>}
        </Container>
    )
}





const ButtonRegister = styled.button`
  

  transition: 1s all;

  padding: 0 0.6em 0;
  font-family: 'Poppins', sans-serif;
  color: #3c423f;
  
  border-radius: 32px;
  
  i{
    font-size: 17px;
  }
  
  &:hover{
    background: transparent;
   color: #a5a5ad;
  }
 

  @media screen and (max-width: 430px) {
    padding: 0em;
  }
`;

const InputCardN = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(24px);
  padding: 0em 0.4em 0.5em;
  border-radius: 29px;
  width: 100%;

 
`;



const InputList = styled.input`
  
  background-color: transparent;
  width: 100%;
  height: 3em;
  padding: 8px;
  font-size: 16px;
  border: none;
  color: #9293a0;
  padding: 1.8em 1em 1.5em;
 
  font-family: 'Poppins', Courier, monospace;
  margin-bottom: 0.6em;
   
  :focus{
    outline: none;
  }

  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #9c9ca7;
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
  -webkit-text-fill-color: #9e9ea0 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor:  var(--f-cursor-pointer);
}

`;


const CardInfoowner = styled.div`
 
  padding: 0.5em 0.7em 0.5em;
   background-color: rgba(56, 56, 63, 0.055);
   border-radius: 11px;
 
   display: inline-flex;
   
   align-items: center;
       
   section{
    display: flex; 
    padding: 0.4em 1em 0;
    flex-direction: column;
   }
    

     .logos{
      border-radius: 12px;
     }
   
    h3{
      font-family: 'Inter';
      font-size: 25px;
      background: linear-gradient(47deg, #888384 0%, rgb(73, 77, 74) 1%, #c9c0c1 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    }

    p{
      font-size: 11px;
      color: #868c91;
      margin-bottom: 0.3em;
      max-width: 430px;
    }

  
`;

const ContentAS = styled.div`
  display: flex;
  flex-direction: column;
  text-align: start;
  align-items: center;
  justify-content: center; 
  position: relative;
  margin-bottom: 1em;
  width: 100%;

  

  
  ul{
     display: flex;
     flex-direction: row;
     align-items: center;
     justify-content: space-between;
  }

  h2{
    font-size: 29px;
    margin-top: 0.9em;
    margin-bottom: 0.5em;
    color: #f5f5faa6;
    text-align: center;
  }

  p{
    font-size: 9px;
    max-width: 535px;
    color: #fdfdff5a;
    text-align: center;
    margin-bottom: 1em;
  }

  a{
    color: #16f76c;
  }
  
  label{
  width: 50%;
  height: 3.4em;
  padding: 0.8em 1em 0.8em;
  border-radius: 39px;
  font-size: 14px;
  background-color: rgba(39, 41, 40, 0.781);
  border: 2px solid rgba(38, 38, 41, 0.247);
  color: #9293a0;
  font-family: 'InterSemiBold', Courier, monospace;
  margin-top: 0.8em;

    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;


    i{
        color: #303033;
        font-size: 23px;
        margin-top: 0.2em;
    }
  }
`;
 

const Container = styled.div`
   
   width: 100%;
 
  place-items: center;
  display: flex;
  align-items: center;
  justify-content: center;

   

  @media screen and (max-width: 430px) {
    padding: 0em;
    width: 99vw;
  }
`;