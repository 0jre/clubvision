'use client'
import { UserData } from "@/types/user/types";
import Image from "next/image";
import { useEffect, useState } from 'react';
import styled from "styled-components";

async function fetchUserInfo(): Promise<UserData> {
  const response = await fetch(`/api/userInfo`);
  if (!response.ok) {
    throw new Error('Falha ao buscar informações do usuário.');
  }
  const data = await response.json();
  return data;
}

interface Prop {
    buttoncliv: React.ReactNode;
}

export default function Infonotlogin ({buttoncliv} : Prop) {
    const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
 
  useEffect(() => {
    let isMounted = true;

    fetchUserInfo()
      .then((data) => {
        if (isMounted) {
          setUserInfo(data);
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

  
  if (!userInfo) {
    return (
      <>
    
      </>
    );
  }
    return(
        <Container>
        <Content>
        <ul> 
        <h2>CONECTE SUA CONTA</h2>
        <CardInfo>
          <Image
             className="logo"
                src={userInfo?.user.avatar || 'https://i.imgur.com/mXit4fI.jpg'}
                alt="User Avatar" 
                height={36}
                width={36}
              />
              <li>
          <h1 className="sh1">{userInfo?.user.username ? userInfo.user.username : <> ---- </>}</h1>
          <p>Voce esta logado em clubvision!</p>
          </li>
          </CardInfo>
                <h5>Faça login usando sua conta cfx.re para que possamos identificá-lo no jogo</h5>
            </ul>
          <CardButtonlogin>
            {buttoncliv}
          </CardButtonlogin>

          <BottomView>
                <h6>© thenovision · <a href="/legal/policy"> Política de Privacidade</a>   · <a href="/legal/terms">Termos de Serviço</a>  · Português (Brasil)</h6>
                <h4>Parece que você não realizou o login em sua conta. Faça o login e volte aqui para fazer suas compras!!</h4>
            </BottomView>
          </Content>
        </Container>
    )
}


/////////////

const BottomView = styled.div`
  
   h6,a{
    color: #acb3b3;
    font-family: 'Roboto', sans-serif;
    font-size: 11px;
    font-weight: 500;
    text-align: center;
   }

   h4{
    margin-bottom: 0.4em;
    font-family: 'Inter', monospace;
    font-size: 10px;
    text-align: center;
    color: #3b3a3f;
   }

`;


const Container = styled.div`
 position: fixed;
 height: 100%;
 width: 100%;
 left: 0;
 right: 0;
 z-index: 99999;
 top: 0;
 overflow-y: auto;
 bottom: 0;
 backdrop-filter: blur(23px);
 background: radial-gradient(circle, #0b0c0eed 0%, rgba(7, 8, 11, 0.925) 100%), url('/web/hdshfioef.png');
    background-repeat: no-repeat;
    background-size: cover;
 display:flex;
 place-items: center;
 justify-content: center;
 place-content: center;
 animation: Opacitxy 0.9s linear;


  @keyframes Opacitxy {
    0%{ opacity: 0;}
    100% { opacity: 1;}
  }
 
`;

const Content = styled.div`
  margin-top:13%;
  padding: 0 3em 0;
 
  ul{
    display: flex;
    justify-content: start;
    flex-direction: column;
    text-align: left;

    h2{
    font-size: 33px;
    font-family: 'Europa Grotesk';
    background:  linear-gradient(47deg, #64656d 0%, #0aeb4e 1%, #666975 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;   
    
    }

    h5{
     font-size: 13px;
    font-family: 'Inter';
    font-weight: 200;
    color: #66746d
    }
  } 



`;

const CardButtonlogin = styled.div`
  display: flex; 
  justify-content: center;
  width: 100%;
  margin-top: 6%;
  margin-bottom: 25%;

   button{
    border-radius: 29px;
    background:  linear-gradient(47deg, #64656d 0%, #0aeb4e 1%, #666975 100%);
    box-shadow: 0 0 1.5625rem #16d86d56;
    border: none;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    color: #0f0d0d;
    padding: 0.7em 1em 0.7em;
    transition: ease .2s;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
   transition: 1s all;
    
   display: flex;
   align-items: center;
  

  
   h4{
    font-size: 12px;
    font-family: 'ProximaNova', monospace;
    color: #0f0d0d;
    font-weight: 900;
    padding: 0 1em 0;
   }
  
   }
`;
const CardInfo = styled.div`
 padding: 0.9em 1em 0.9em;
 border-radius: 19px;
 margin: 4%;
 border: 2px solid rgba(42, 42, 48, 0.144); 
 display: flex;
 
 img{
    border-radius: 20%;
    height: 60px;
    width: 60px;
 }

 .sh1{
    font-family: 'Inter';
    text-align: start;
    font-size: 18px;
 }

 li{
    display: flex;
    justify-content: start;
    flex-direction: column;
    text-align: start;
    align-items: start;
    margin: 0.5em;
    text-align: left;
    padding-left: 1em;

    p{
      font-size: 11px;
      color: #52565a;
    }
 }
`;
