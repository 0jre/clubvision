
import styled from "styled-components";
import {  useEffect,  useRef,  useState } from "react";
import { useRouter } from "next/router";
import { UserInfo } from "@/types/discord/usersearch";
import React from "react";
import axios from 'axios';
import ROUTENVX from "@/routes/routes";

import { decrypt } from "@/core/security/encryption";
import IconInvite from '@/public/icons/airplane-ticket.png'
import { UserData } from "@/types/user/types";
import Image from "next/image";
import LoadingPageView from '@club/resources/loading/market.loading';
import IndexMyfd from './ap/myfriends/modal_index';
import copy from 'clipboard-copy';
import { toPng } from 'html-to-image';
import Link from "next/link";
import ListMembers from "@club/resources/invite/xticket/listmenbers";
import Qrcode_novision from '../../.group/ax/qr-coding';
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";
import { nvxre_checkAuthentication } from "@/hooks/checkAuthentication";
import PremiumAccount, { PremiumAccount_Notaccessinvite } from "./primeaccount";
import HeadGlobal from "@/club/head/glob.n";
 


interface PropsInd {
  children: React.ReactNode;
  onclose: () => void;
  infouser: any;
}

 

export default function PrimeView ({children, onclose, infouser} : PropsInd) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userD, setUser] = useState<UserData | null>(null);
  const [isinvite, setisinvite] = useState(true);
  const [isindicar, setindicar] = useState(false);
  const [myfriends, setmyfriends] = useState(false);
  const [codeinviteindic, setcdein] = useState(true);
  const [zoomqrcode, setzoom ] = useState(false);
  const [isearch, setsearch] = useState(false)
  const { isLoadinguser, data } = nvxre_checkAuthentication();
  const { isLoadingx, userInfoObject, mutate} = GetInfo_nvxre_xyloQuerier();
     
    
     useEffect(() => {
      
   if (isLoadingx) setIsLoading(true);
    if (!isLoadingx && userInfoObject && data) {
      setUserInfo(userInfoObject);
      setIsLoading(false);
      setUser(data)
      }
    }, [userD,data,isLoadingx, userInfoObject]);

  const OpenInsearch = () => {
    setisinvite(false);
    setsearch(true)
    setindicar(false)
    setmyfriends(false);
  }
  const OpenVisionInvite = () => {
      setisinvite(true);
      setindicar(false)
      setsearch(false)
      setmyfriends(false);
    }

  const OpenMyfriends = () => {
    setisinvite(false);
    setmyfriends(true);
    setsearch(false)
    setindicar(false)
  }

  const OpenCardIndic = () => {
    setisinvite(true);
    setmyfriends(false);
    setsearch(false)
    setindicar(true)
  }
  
  const handleclose = () => {
    setisinvite(true);
    setmyfriends(false);
    setsearch(false)
    setindicar(false)
  }

  const handleinvitecode = () => {
    setcdein(true);
    setsearch(false)
  }

  const handleinvitenot = () => {
    setcdein(false);
    setsearch(false)
  }
  
  const Closeqrcode = () => {
    setzoom(false)
    setsearch(false)
  }

  const Openqrcode = () => {
    setzoom(true)
    setsearch(false)
  }
 

    
     
    ////  INVITE USER GENERATE 

    

const [inviteCode, setInviteCode] = useState<string | null>(null);
const [isgerinvite, setgerinvite] = useState(false)
 
const generateInviteCode = async () => {
try {
  setgerinvite(true)
const response = await fetch('/api/nvxre/generateinvite', {
  method: 'POST',
  body: JSON.stringify({ discordUserId: userD?.user.id }),
  headers: {
    'Content-Type': 'application/json',
  },
});

if (response.ok) {
  const { code } = await response.json();
  setInviteCode(code);
  setgerinvite(false)
  mutate();
}
} catch (error) {
console.error('Erro ao gerar o código de convite:', error);
setgerinvite(false)
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


const ModalViewSharelink2 = ({ textToCopy }: { textToCopy: string }) => {
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
  {copied ? 'Copiado' : `${ROUTENVX.TheNoVision}${ROUTENVX.invitefriend}${userInfo?.inviteCode}`}
   </div>
      </>
    )
  }


  const ModalViewSharelink3 = ({ textToCopy }: { textToCopy: string }) => {
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
    {copied ? 'Copiado' : `${ROUTENVX.TheNoVision}`}
     </div>
        </>
      )
    }
  
const linkToCopy = `${ROUTENVX.TheNoVision}${ROUTENVX.invitefriend}${userInfo?.inviteCode}`;

 
  const cardRef = useRef<HTMLDivElement>(null);

   
  const handleDownloadClick = async () => {
    if (cardRef.current) {
      const dataUrl = await toPng(cardRef.current);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'novision.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

 
  
const Inviteinfo: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const checkInviteInterval = setInterval(() => {
      handleCheckInvite();
    }, 10000); // Intervalo de verificação a cada 5 segundos (ajuste conforme necessário)

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
  
      const response = await fetch(`/api/redirect/checkusedcode?checkinvite=${userInfo.inviteCode}`);
  
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        setMessage('Erro ao verificar o código do convite. Atualize a página, por favor!');
      }
    } catch (error) {
      console.error('Erro ao verificar o código do convite. Atualize a página, por favor!', error);
      setMessage('Erro ao verificar o código do convite. Atualize a página, por favor! ');
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

 
    return(
        <>
    
        <ContainerCenter>
  
        <Containermargin>
            {isLoading ? (
              <>
               <OPSC>
      <LoadingPageView />
    </OPSC>
              </> 
            ) : userInfo !== null && (
          <>
      
        {(userInfo.prime && userInfo.selo) || (userInfo.prime && userInfo.accessinvite && !userInfo.selo) ? ( 
            <>

      
        <ContentFloatL>
        
        

   
    <ContainerS>
        <ScrollingCardUserinfo children={
          <>
        
      <ButtonClick  onClick={OpenVisionInvite} className={isinvite ? "navbar-active" : ""}>
      <i className="fi fi-sr-ticket" />
         <h3>Convidar</h3>
      </ButtonClick>

      <ButtonClick  onClick={OpenInsearch} className={isearch ? "navbar-active" : ""}>
      <i className="fi fi-sr-search" />
         <h3>Encontrar amigos</h3>
      </ButtonClick>

          <ButtonClick  onClick={OpenMyfriends} className={myfriends ? "navbar-active" : ''}>
          <i className="fi fi-sr-selection" />
         <h3>Convidados</h3>
      </ButtonClick>

      <ButtonClick  onClick={OpenCardIndic} className={isindicar ? "navbar-active" : ''}>
          <i className="fi fi-sr-qrcode" />
         <h3>Compartilhar</h3>
      </ButtonClick>

          </>
        }/>
      </ContainerS>

    
 </ContentFloatL>


 {isearch && (
 <ListMembers />
 
    )}
    
  
  {isindicar && (
    <>
 
 {userInfo !== null && (
        <>
    {userInfo.inviteCode && ( 
      <Modalwarp> 
        <ContainerMarginIndic>
          
          <MarginContentindic>
          <Card ref={cardRef}>
            <Contentcardindic>
              <h2>MERGULHE NA IMERSÃO</h2>
              <p>
               Registre-se em clubvision. Adicione seu codigo de convite e pronto, agora só jogar na cidade.
              </p>
          
              <img src="/icons/facegraffiti.png" alt="Logo" className="margin" style={{ width: '240px', margin: '0 auto' }} />

              <ul className="flex items-center justify-between w-full">
           
               <li>
               <img src="/nvrp/logonvrp.png" alt="Logo"   style={{ width: '70px', margin: '0 auto' }} />
              
               </li>

               <section onClick={Openqrcode} className="gdfkv">
                 <Qrcode_novision 
                      height={99}
                      width={99}
                      invite={codeinviteindic ? `${ROUTENVX.TheNoVision}${ROUTENVX.invitefriend}${userInfo?.inviteCode}` :  `${ROUTENVX.TheNoVision}`} 
                      logo={'/nvrp/20240520_081457.png'}  />
              </section>
              </ul>
              <h6>Faça parte do que desafia as limitações. Seja diferente e mais ousado;</h6>
               <h5>www.thenovision.com</h5>
            </Contentcardindic>
          </Card>
          
           
           {codeinviteindic ? (
            <li className="dscli">
            <h5 className="sadhh5">Token de Indicação:</h5>

            <div className="gghul">
            <h6 className="h6">{userInfo.inviteCode}</h6> 
             <span onClick={handleinvitenot}>
              <i className="fi fi-sr-cross-circle" />
             </span> 
            </div>
            
             </li>
           ) : (
            <>
            <li className="dscli">
            <h5 className="sadhh5">Token de Indicação:</h5>

            <div className="gghul">
            <h6 className="h6">Token não inserido</h6> 
             <span onClick={handleinvitecode}>
              <i className="fi fi-sr-subscription-alt" />
             </span>
            </div>
            
             </li>
            </>
           )}
           

           <li className="dscli">
            <h5 className="sadhh5">Link de Indicação:</h5>
            <h6 className="h6"> {codeinviteindic ? (
              <>
              <ModalViewSharelink2 textToCopy={linkToCopy} />
              </>
            ) : (
              <>
                <ModalViewSharelink3 textToCopy={ROUTENVX.TheNoVision} />
              </>
            )}  </h6>
           </li>
            

            <ul  className="ul flex items-center justify-between w-full">
            <button className="green" onClick={handleDownloadClick}>
            <h3>Baixar Convite</h3> 
          </button>

          <button onClick={handleclose} className="red">
            <h3>Cancelar</h3>
          </button>

            </ul>
          

          </MarginContentindic>
           
       </ContainerMarginIndic>
       </Modalwarp>
    )}
    </>
 )}

</>
  )}
    {myfriends && (
    <CardContainer>
     <IndexMyfd userId={userInfo.userId} />
    </CardContainer>
   )}
 
 
      {zoomqrcode && (
        <Modalwarp>
               <CardQrcode  >
                 <button onClick={Closeqrcode} className="z-82">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                 </button>
 
                <li>
                   <ul className="dsfj"><img src={'/nvrp/20240520_081457.png'} alt={'novision'} height={22} width={22} className="rounded-full" /> <h4>{infouser.name}</h4><h4 className="chd">{infouser.subdominio}</h4></ul>
                  <h5>{codeinviteindic ? `${userInfo?.inviteCode}` :  `${ROUTENVX.TheNoVision}`}</h5>
                </li>
                      <Qrcode_novision 
                      height={280}
                      width={280}
                      invite={codeinviteindic ? `${ROUTENVX.TheNoVision}${ROUTENVX.invitefriend}${userInfo?.inviteCode}` :  `${ROUTENVX.TheNoVision}`} 
                      logo={infouser.avatar}  />
               <li>
               
                  <h6>O acesso ao Thenovision é feito por convite. Compartilhe o QR Code com seu convidado.</h6>
                </li>

              
              
              <h6>Faça parte do que desafia as limitações. Seja diferente e mais ousado;</h6>
               <h5>www.thenovision.com</h5>
              </CardQrcode>
             </Modalwarp>
              )}

   {isinvite && ( 
    <>
          {userInfo.prime ? (
             <CardContainer>
             {userInfo !== null && (
        <>
    
    <MarginAbout>
     
    <ContentInfoInkite>
        
        <Image  
          src={IconInvite}
          className="invitecodeicon"
          alt="visioninvitecode"
          height={90}
        />
     
          
   

   <ul className="sul">
   <h2>Indique um amigo(a)</h2>

   <li>
     <span>1.</span>
     <h5>Compartilhe o codigo com um amigo(a), que gostaria de jogar em nossa comunidade.</h5>
   </li>

   <li>
     <span>2.</span>
     {userInfo.keyplusinvite ? 
     <h5>O seu codigo convite amigo é valido para todos os seus amigos.</h5> : <h5>O seu codigo convite amigo é valido apenas uma unica vez.</h5>}
   </li>


   <li>
     <span>3.</span>
     {userInfo.keyplusinvite ? <h5>Chave de convite esta ativada em sua conta, Você pode convidar todos seus amigos com um unico token.</h5> : <h5>O Compartilhamento de codigo é limitado apenas para uma unica pessoa</h5> }
   </li>

   <li>
     <span>4.</span>
      <h5>Ganhe Bits por convidar amigos para jogar em thenovision, recompensas são calculadas em <Link href={ROUTENVX.studiomoney}> Wallet {'>'} Monetização</Link>.</h5>
   </li>
   </ul>
          
    
     </ContentInfoInkite>
    <AboutInvite>
        <h5>O código convite, exclusivo para os usuários com Prime em nossa comunidade, desempenha um papel fundamental na expansão e fortalecimento da nossa comunidade de jogadores. Este código é gerado no nosso site com um propósito específico: permitir que os membros com Prime convidem novos jogadores para se juntarem à nossa comunidade e tenham a oportunidade de participar do nosso servidor.</h5>

        <h5>O processo é bastante simples: um jogador que já faz parte da nossa comunidade e tem acesso à cidade pode gerar esse código de convite. Este código segue uma sequência única, geralmente no formato "nvrp-xxxx-xxxx-xxxxx".</h5>

        <h5>Quando um jogador recebe esse convite, a etapa seguinte é autorizar a sua conta. Neste ponto, ele precisa fornecer o código de convite que recebeu. Este requisito ajuda a garantir que apenas jogadores convidados por membros confiáveis da comunidade tenham acesso ao servidor, contribuindo para um ambiente de jogo mais seguro e acolhedor.</h5>

        <h5>Em resumo, o código de convite é uma ferramenta essencial que permite aos membros Prime expandir nossa comunidade, convidando amigos e colegas jogadores a se juntarem a nós, enquanto ao mesmo tempo, garante que o acesso ao servidor seja controlado e limitado aos jogadores confiáveis. Isso contribui para uma experiência de jogo mais enriquecedora e segura para todos os envolvidos.</h5>
        </AboutInvite>
 
    </MarginAbout>

         

    <ContainerCard>
    <MarginIns>
      <div className="Nonemobile">
      {children}

      </div>
        
        
     

      <div className="dsabcs">
      <Inviteinfo />
        <MarginStats>
        <Image src={IconInvite} alt='Convite' width={30} height={30} />
        <li>
        <h6>Meu Limite:</h6>
          <p>{userInfo.usedLimitInvite ? userInfo.usedLimitInvite  : 0}/{userInfo.maxlimitinvite ? userInfo.maxlimitinvite : 0}</p>
          </li>
      </MarginStats>

      {userInfo.keyplusinvite && (  
        <MarginStats>
        <Image src="/icons/keyinvite.webp" alt='keyinvite' width={30} height={30} />
          <li>   
        <h6>Chave Ativada</h6>
        <p>Convide seus amigos.</p>
        </li>
      </MarginStats>
       )}
 
      </div>
        </MarginIns>
     
    
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
      {isgerinvite ? 'Carregando..' : 'Gerar Convite'}
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
         {isgerinvite ? 'Carregando..' : 'Gerar Convite'}
     </ButtonGenerate>
        
    </ViewContentCode>
  )}


  
       
        </ContainerCard>      
        </>
  
        
        )}

             </CardContainer>
            ) : ( 
          <CardContainer>
        <ContentListed>
        <i className="fi fi-rr-leaf-heart"/>
        <h2>Sem Permissao Aqui</h2>
        <span>
        No momento, você não tem permissao para gerar convite amigo.
        </span>  
        </ContentListed>
           </CardContainer>
          )} 
          </>
          )} 
    
            
              </>
         ) : (
          <>
           {!userInfo.prime && (
            <>
            <HeadGlobal Title='Assinatura premium'/>
            <PremiumAccount />
            </>
           )}


            {userInfo.prime && !userInfo.accessinvite && (
            <>
            <HeadGlobal Title='Assinatura premium'/>
            <PremiumAccount_Notaccessinvite />
            </>
           )}
          </>
         )}   
         </>
            )}

            </Containermargin>
 
             </ContainerCenter>
           
           
        </>
    )
}



interface HorizontalScrollContainerProps {
  children: React.ReactNode;
}

const ScrollingCardUserinfo: React.FC<HorizontalScrollContainerProps> = ({
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isModalOpen) {
      setIsDragging(true);
      setStartX(e.clientX);
      setScrollLeft(containerRef.current!.scrollLeft);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
  
    if (!isModalOpen) {
      e.preventDefault();
      const x = e.clientX - startX;
      const walk = x * 1; 
      containerRef.current!.scrollLeft = scrollLeft - walk;
    }
  };


  const handleMouseUp = () => {
    setIsDragging(false);
  };

 
  return (
    <CardViewList
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
    >
      <ContentList >{children}</ContentList>
    </CardViewList>
  );
};


////// styled 


const MarginAbout = styled.div`
    display: flex;
    align-items: center; 

    padding: 0.5em 1em 0.5em;


    @media screen and (max-width: 530px) {
      display: flex;
      flex-direction: column;
    }
 
`;

const MarginIns = styled.div`
  width: 100%;
 

  @media screen and (max-width: 560px) {
     

    .dsabcs{
      display: flex;
      align-items: center;
      flex-direction: column;
      width: 100%;
      gap: 8px;
    }
    }


    .dsabcs{
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
`;
 
const CardViewList = styled.div`
  
background-color: rgba(209, 209, 214, 0.007);
 
border-radius: 12px;
width: 100%;
margin-left: 0;

overflow-x: auto;
cursor: grab;


:active {
cursor: grabbing;
}

@media screen  and (max-width: 560px){ 
  margin:  1em;
  
}
 
`;


const ContentList = styled.section`

display: inline-flex;

button{
  border: 2px solid transparent;
  transition: 0.8s all;
}

button.active {
border: 2px solid rgba(255, 255, 255, 0.096); 
border-radius: 28px; 
}
`;



const ContainerS = styled.section`
display: flex;
justify-content: center;
 margin-bottom: 0.8em;
margin-top: 0;
 

.navbar-active{
  i{
    background-color: rgba(16, 245, 104, 0.973);
      color: #09090c;
    }
}

 @media screen  and (max-width: 530px){
   width: 100vw;
 }
`;

const ButtonClick = styled.button`

padding: 0.4em 1em 0.4em;
border-radius: 99px;
border: 1px solid transparent;
transition: 1s all;
margin: 0.3em;
font-family: 'Inter', monospace;

display: flex;
align-items: center;
text-align: left;
flex-direction: row;

 

i{
 font-size: 16px;
 color: #464650;
 background-color: rgba(103, 103, 104, 0.062);
 padding: 0.4em 0.5em 0.3em;
 border-radius: 9px;
}

h3{
 color: #81818a;
 padding-left: 0.3em;
 font-family: 'Poppins', sans-serif;
 font-size: 14px;
 
}

&:hover{
    i{
      background-color: rgba(16, 245, 104, 0.973);
      color: #09090c;
      transform: scale(1.2);
    }
}

@media screen and (max-width: 560px) {
  
   
    h3{
      font-size: 11px;
    }
 
}
`;

const OPSC = styled.div`
height: 100%;
width: 100%;
display: flex;
justify-content: center;
align-items: center;
top: 0;
left: 0;
right: 0;
bottom: 0;
backdrop-filter: blur(3px);
`;

 
const ContainerCenter = styled.div`
 
   animation: LEFTANIMWR 1s alternate;
   display: flex;
   place-items: center;
   justify-content: center;
   width: 100%; 

 
    @keyframes LEFTANIMWR {
     0%{ opacity: 0; }
     100%{ opacity: 1; }
    }

    
    
`;
  
  
// STYLED DASHBOARD FORYOU 



const ContentListed = styled.ul`
   
   text-align: center;
   display: flex;
   flex-direction: column;
   place-items: center;
   justify-content: center;
   height: 100%;
   width: 100%;
  
   i{
    color: #36373a9e;
    font-size: 34px;
   }

   h2{ 
    margin: 0.6em;
   }

   p{
    font-size: 12px;
    margin-top: 0.8em;
    color: #5c5555;
   }

`;


const CardContainer = styled.div`
  
 width: 100%;
 padding: 0 1em 0;
 
 position: relative;
 border-radius: 12px;
 border: 2px solid rgba(49, 49, 53, 0.144);

 @media screen and (max-width: 560px) {
    width: 100%;
    border: none;
    }
`;

 
const NotificationSS = styled.div`
  

padding: 0.7em 1em 0.7em;
width: 260px;
border-radius: 8px;
background-color: #2d2d3334;
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
    position: absolute;
    bottom: 1px;
    left: 0;
    right: 0;
    margin: 1em;
    margin-bottom: 0;
    .invitecodeicon{
       max-width: 150px;
       max-height: 150px;
    }

    @media screen and (max-width: 430px) {
      padding: 0em;
 }

  @media screen and (max-width: 680px) {
       position: relative;
  }
`;


const MarginStats = styled.div`
  background-color: rgba(69, 70, 75, 0.13);
  padding: 0.4em 0.9em 0.4em;
  border-radius: 12px;
  margin: 0.4em;
  width: 100%;
 
  display: flex;
  align-items: center;

  h6{
    font-family: 'InterSemiBold', monospace;
    font-size: 11px;
    color: #77797e;
  }

  p{
    font-family: 'InterSemiBold', monospace;
    font-size: 13px;
    color: #e1e6e9;
  }

  li{
    padding-left: 0.4em;
  }
`;

const ContentInfoInkite = styled.div`
    
    display: flex;
    align-items: center; 
    width: 90%;
    min-height: 80vh;
 
    padding: 0.5em 1em 0.5em;
    border-radius: 12px;

    li{
       
      display: flex;
      align-items: baseline;
      flex-direction: row;
      
      h5{
        padding-left: 0.4em;
        color: #52585e;
        font-size: 13px;
      }
      
      span{
        color: #898d91;
        font-size: 15px;
      }
    }

    h2{
      font-family: 'Inter',sans-serif;
      color: #898c8f;
      font-size: 19px;
      font-weight: 29;
      margin-bottom: 1em;
    }
    a{
      color: rgb(36, 230, 117);
      font-size: 12px;
    }
    .sul{ 
      display: flex;
      flex-direction: column;
      align-items: start;
      margin-left: 0.9em;
    }
  
    @media screen and (max-width: 430px) {
      padding: 0.5em  0.2em 0.5em ;
 }


 @media screen and (max-width: 530px) {
     .invitecodeicon{
      display: none;
     }
    }
`;
const ViewContentCode = styled.div`
 
  backdrop-filter: blur(100px);
  background-color: rgba(242, 242, 245, 0.034);
  height: 3em;
  margin-bottom: 2em;
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: none;
  border-radius: 11px;
 
  color: #9293a0;
  padding: 1.5em 1em 1.5em;
  font-family: 'Poppins', Courier, monospace;
  display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
 

    i{
        color: rgb(68, 62, 62);
        margin-top: 0.2em;
    }

    h5{
      padding-left: 0.4em;
    }

    li{
      display: flex;
    align-items: center;
    flex-direction: row;
    gap: 4px;
    }

    span{
      cursor: var(--f-cursor-pointer);
    }

    .click{

    }


    @media screen and (max-width: 560px) {
       h5{
        font-size: 12px;
        padding: 0;
       }
    }
  `;


const AboutInvite = styled.ul`
   
   display: flex;
   flex-direction: column;
   background-color: rgba(72, 75, 85, 0.055);
   padding: 0.7em 1em 0.7em;
    border-radius: 12px;
    margin: 1em;

    h5{
      font-size: 10px;
      max-width: 650px;
      margin-bottom: 0.6em;
      color: #8b92926e;
    }
`;


const ButtonGenerate = styled.button`
   background: transparent;
   padding: 0.2em 0.9em 0.2em;
   border-radius: 22px;
   border: 2px solid rgba(129, 126, 143, 0.082);
   font-family: 'Poppins', sans-serif;
   color: rgba(124, 123, 129, 0.705);
 
   font-size: 12px;
   transition: 1s all;

   &:hover{
    background: rgba(149, 172, 164, 0.116);
   }

`;
 

//////////////////////////////////////////////////////////////////////////////////////

 
const Containermargin = styled.div`
 display: flex;
 flex-direction: column;
 align-items: center;
   
  .buttonc{
    display: none;
  }


  @media screen and (max-width: 680px) {
      .buttonc{
 display: inline-flex;
 justify-content: center;
 margin: 0.5em;
    align-items: center;
    padding: 0.9em 1em 0.9em;
    transition: 0.2s all;
    width: 80%;
    border-radius: 22px;
     background-color: #6c917944;
    font-family: 'InterSemiBold', monospace;
    color: #bfc4c7;
 
   }
  }
`;

 
 
const ContentFloatL = styled.div`
   display: flex;
   
   flex-direction: row;
`;

const Card = styled.div`
   background: linear-gradient(204deg, #5cffdc40 -7%, #b85cff00 33%), linear-gradient(162deg, #23e78c40 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);

   background-repeat: no-repeat;
   background-size: cover;
    
   width: 340px;
   border-radius: 14px;
   border: 1px solid transparent;

 
    @media screen and (max-width: 530px) {
       width: 95vw;
       height: 100vh;
       border-radius: 0;
    }
 
`;


const Contentcardindic = styled.div`
  background-image: url('/theim/characters/ons.svg');
   border-radius: 14px;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;
  padding: 1em 0.9em 1em;
  text-align: center; 
  .gdfkv{
    transform: scale(0.7);
  }
  li{
    display: flex;
    flex-direction: column;
    text-align: left;
  }


  ul{
    display: flex;
    flex-direction: row;
    align-items: baseline;
   width: 100%;
    margin-bottom: 0.8em;

    h5{
      text-align: center;
    }
  }
   
   .margin{
    margin-bottom: 25%;
   }
  h2{
    font-family: 'Europa Grotesk', monospace;
    font-size: 34px;
    max-width: 340px;
    background:  linear-gradient(47deg, #00ff95 0%, #26dd5d 1%, #bbc1d8 100%);
  -webkit-background-clip: text;  
  -webkit-text-fill-color: transparent;   
  }
 
  p{
    font-family: 'ProximaNova-Italic', monospace;
    font-size: 12px;
    margin: 0.4em;
    color: #adb1b4;
  }
 
  section{
    
    height: 110px;
    width: 110px;
    display: flex;
 
    justify-content: center; 
    align-items: center;
 
    cursor: var(--f-cursor-pointer);
  }

   .qrWrapper {
    width: 80px;
    height: 80px; 

      img{
    border-radius: 50%;
  }
  }
  

  h5,h6{
   font-family: 'ProximaNova-', monospace;
   
  }

  h5{
    color: #4f7e63;
  }

  h6{
    color: #adb1b4;
  }

`;

const CardQrcode = styled.div`
 padding: 0 1em 0;
  
 width: 100vw;
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
 text-align: center;
 
  .qrWrapper {
    width: 100%;
    height: 280px;

     
  }
    .rounded-full{
    border-radius: 50%;
  }
  .dsfj{
    display: inline-flex;
    align-items: center;
    width: auto;
    
    img{
      margin-right: 0.4em;
    }

    .chd{
      color: #a1a5a8;
    }
  }

 
  button{
    position: absolute;
    right: 5%;
    top: 4%;
  }
   li{
    text-align: center;
    padding: 1em 0 1em  ;
     

    h4{
      font-family: 'Inter',monospace;
      font-size: 18px;
    }

    h6{
   color: #7a7e81;
      font-size: 12px;
      font-family: 'ProximaNova-Italic', sans-serif;
    }

    h5{
     font-family: 'InterSemiBold',monospace;
    font-size: 15px;
    color: #3bb359;
  
    }
   }

 
  h5,h6{
   font-family: 'ProximaNova-', monospace;
   
  }

  h5{
    color: #4f7e63;
  }

  h6{
    color: #adb1b4;
  }

 @media screen and (min-width: 830px) {
    display: flex;
    align-items: stretch;
    flex-basis: auto;
    box-sizing: border-box;
    position: relative;
    
    flex-shrink: 0;
    flex-direction: column;
    background-color: rgb(19, 19, 19);
    padding: 24px;
    border-radius: 16px;
    z-index: 1060;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.12);
    border-style: solid;
    opacity: 1;
    gap: 4px;
    margin: 0px;
    max-height: 80vh;
    max-width: 350px;
    overflow: auto;

    outline-style: none;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 6px;
    transform: translateY(0px) translateX(0px);
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.12) transparent;

 }
`;


const Modalwarp = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
 
  align-items: center;
  bottom: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(2px);
  z-index: 98992;
  top: 0;
   
 
  @media screen and (max-width: 680px) {
      background-color: rgb(0, 0, 0); 
  }
`;

const ContainerMarginIndic = styled.div`
  
  display: flex;
  place-items: end;
  justify-content: center;
  flex-direction: column;
  margin-top: 0;
 background-color: rgba(0, 0, 0, 0.288);
 height: 100vh;
 z-index: 99999;
 width: 100vw;
 
`;


const MarginContentindic = styled.div`
  margin: 1em;
 
  float: right;
  background: linear-gradient(204deg, #21242340 -7%, #b85cff00 33%), linear-gradient(162deg, #21242340 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  border-radius: 12px;
  padding: 0.8em;
  overflow-y: auto;
  display: flex;
  place-items: center;
  flex-direction: column;
  animation: LeftAnima 1s linear;

 @keyframes LeftAnima {
  0%{ transform: translateX(100%)}
  100%{ transform: translateX(0) }
 }

  .dscli{
    background-color: #4c4e501a;
    padding: 0.4em 1em 0.4em;
    border-radius: 6px;
    display:flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    margin: 0.9em;
    margin-bottom: 0.2em;
    color: #b2b3b9;
    font-family: 'Poppins', sans-serif;
  }

  .h6{
    max-width: 109px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  }

  
  .sadhh5{
    font-size: 13px;
    max-width: 140px;
    color: #b2b3b9;
    font-family: 'Inter', monospace;
    font-weight: 500;
  }

  button{
    width: 100%;
     
    padding: 0.8em 1em 0.8em;
    border-radius: 24px;
    margin: 0.2em;
    
    h3{
    color: black;
    font-size: 13px;
    font-family: 'Inter', monospace;
    }

  }

   .green{
    background-color: rgb(1, 252, 105);
   }

   .red{
    background-color: rgb(252, 20, 59);
   }


   .gghul{
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 6px;
    width: 100%;
    
   }


   span{
    cursor:  var(--f-cursor-pointer);
    margin-left: 0.4em;
    padding: 0.2em;
    background-color: rgba(42, 42, 44, 0.164);
    height: 29px;
    border-radius: 9px;
    width: 29px;
    display: flex;
    justify-content: center;

    i{
      color: #93949c;
    }
   }

 
   @media screen and (max-width: 560px) {
     margin: 0;

     .h6{
      max-width: 100px;
     }

    
    }
 
`;