import styled from "styled-components"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Image from "next/image";
import { useEffect } from 'react';
import NVX from "@/data/novision/connect.nv.json"  
import Cog from "@/package.json"
// Image
import Alert from '@/public/icons/unnamed.png'
import ROUTENVX from "@/routes/routes";

import Cookies from 'js-cookie'; // certifique-se de ter isso instalado: npm i js-cookie
 

const LinearColor = () => {
  return (
    <Stack sx={{ width: '90%', color: 'grey.500' }} spacing={2}>
      <LinearProgress color="inherit" />
    </Stack>
  );
}

export default function TheNoVision () {
   const [isCookieActive, setIsCookieActive] = React.useState(false);
   
  
   
useEffect(() => {
  const redirectToFiveMServer = () => {
    const serverIP = (ROUTENVX.IPCONNECT);
    const waitTime = 3000;
    setTimeout(() => {
      window.location.href = `fivem://connect/${serverIP}`;
    }, waitTime);
  };
   
  // ⏳ Polling para ouvir a API e aguardar status 200
  const startListeningAPI = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/club/gaming/player', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          const data = await response.json();
          if (data.success && data.player) {
            // 💾 Salvar cookie ativador
            Cookies.set('comunicacao_nvx', 'ativa', { path: '/' }); 
            setIsCookieActive(true);
            clearInterval(interval); // Parar de ouvir após sucesso
          }
        }
      } catch (error) {
        console.error('Erro ao ouvir API:', error);
      }
    }, 10000); // a cada 10 segundos

    // Cleanup
    return () => clearInterval(interval);
  };
  startListeningAPI()
  redirectToFiveMServer();
  const stopListening = startListeningAPI();

  return () => {
    stopListening(); // limpar no unmount
  };
}, []);

    return(
        <>
      
        <ContainerView> 
        <ContextVir> 
          <div className="">
          <h3>
          {NVX.ServerRP}
          </h3>
          
           <ul className="flex items-center gap-1">
           <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#515c55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1"/><path d="M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9"/><path d="M21 21v-2h-4"/><path d="M3 5h4V3"/><path d="M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3"/></svg>
           <p> {isCookieActive ? <> Aguardando a autorização de sessão...</> : NVX.infoconn}</p>
           </ul>
          </div>
            <LinearColor />
            <div className="p-1 m-1 mb-3" />
        <h6>{NVX.WARNNV} {NVX.ServerRP}</h6>
         
        <h6>É importante que você permaneça nesta tela sem atualizar ou sair da página. Após selecionar a cidade, você será direcionado para autorizar a sessão. A autorização será exibida diretamente nesta página, portanto, não é necessário navegar para outra. Aguarde até que a indicação para autorizar seja apresentada.</h6>
        </ContextVir> 
        <Nvxreser>
        <i className="fi fi-rr-signal-stream" />
         {NVX.SerieRp}
        </Nvxreser>
        <Nvxreser>
        <i className="fi fi-rr-lock" /> 
         {Cog.author}
        </Nvxreser>
        <Nvxreser>
        <i className="fi fi-rr-code-compare" /> 
         {Cog.version}
        </Nvxreser>
          <MarginTop>
             <li>
            <Image className="icon" src={Alert} alt="alert" />       
             <span>
            <h5>{NVX.WarnYear}</h5>
            <p>{NVX.WarnYearDetails}</p>
            </span>
            </li>
          </MarginTop>
           
        </ContainerView> 
        </>
    )
}


// Styled view


const ContainerView = styled.section`

  padding: 4em 1em 2em;
  background: linear-gradient(0deg, rgba(0, 0, 3, 0.63) 42%, rgba(0, 0, 7, 0.479) 100%);
  backdrop-filter: blur(12px);
  box-shadow: 9px 1px 77px rgba(1, 1, 15, 0.993); 
  max-width: 30%;
  height: 100%;
  float: right;
  border: 2px solid #3f413fdd;
  border-radius: 13px;
  animation-name: Connet56s;
  animation-duration: 2s;
  animation-iteration-count: all ;

    @keyframes Connet56s {
  from { margin-right: -40%; } 
}
`;

const ContextVir = styled.div`
    
   h3{
    text-align: left;
     font-size: 28px;
     max-width: 555px;
     margin-bottom: 0.9em;
     color: rgba(210,210,213,0.9920343137254902);
   }
  
   ul{
    margin-bottom: 0.5em;
   }
   p{
    text-align: left;
     font-size: 12px;
     font-family: 'InterSemiBold', sans-serif;
     color: rgba(210,210,213,0.9920343137254902); 
   } 

   h6{
    text-align: left;
      margin-top: 0.3em; 
      color: rgba(188, 188, 199, 0.836);
      margin-bottom: 0.3em;
      font-family: 'Inter', sans-serif;
   }
   
    i{
        margin-left: 0.9em; 
        margin: 0.1em;
    } 

   h5{
    text-align: left;
     color: #a1a5e0;
     font-size: 12px;
     text-decoration: underline;
     display: flex;
     flex-direction: row;
   }
`;


const MarginTop = styled.ul`
   
   margin: 0.2em;
   margin-top: 10%;
    
   li{
     display: flex;
     flex-direction: row;
   }

   span{
     margin-left: 0.9em;
   }

   p{
     font-size: 12px;
     color:  rgba(119, 119, 158, 0.858); 
   }

   h5{
     max-width: 250px;
     color: rgba(210,210,213,0.9920343137254902); 
     align-items: center;
     text-align: left;
   }
  
  .icon{
     max-height: 60px;
     max-width: 60px;
  }
`; 

const Nvxreser = styled.div`
    
    background: rgba(176,176,194,0.13209033613445376);
    padding: 0.8em 1em 0.8em;
    border-radius: 9px;
    margin-bottom: 0.8em;
    margin-top: 2em;

    i{
     font-size: 24px; 
     float: right;
    }
`;
