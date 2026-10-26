import { UserInfo } from "@/types/discord/usersearch"
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ArrowLeft, Search, Loader } from 'lucide-react'
import { hackAnimation, updateProgressBar } from '@/hooks/.config/animation'
import { keyframes } from 'styled-components'

interface Prop {
    user: UserInfo
}


interface Nas {
  link: string;
  children: React.ReactNode;
}


export default function ViewPrime({ user }: Prop) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [terminalResponse, setTerminalResponse] = useState("Awaiting Data...")
  const [benefics, setbenefics] = useState(false)
  const terminalCodesRef = useRef<HTMLDivElement>(null)
  const [stats, setstats] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [reasons, setReasons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [Message, setMessage] = useState<string | null>(null);
  const [viewPrimeStatus, setViewPrimeStatus] = useState<boolean | null>(null); 
  const [level, setlevel] = useState<string | null>(null);
  const [viewPrimeStatusx, setViewPrimeStatusx] = useState<boolean | null>(null); 
  const [menutype, setmenuType] = useState<string | null>(null);  


  const openMenu = (menuType: string) => {
    setbenefics(false)
    setActiveMenu(menuType)
    setmenuType(menuType)
  }
 
    // Função para verificar o ID
const handleVerification = async () => {
  
    try {
      const response = await fetch('/api/club/verify-id', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Erro ao comunicar com o servidor');
      }
  
      const data = await response.json();
  setlevel(data.level)
      if (data.isEligible) {
        setIsVerified(true);
        setReasons([]);
        setstats(true)
        setViewPrimeStatus(data.viewprime); // Atualizando o status do viewprime
      } else {
        setIsVerified(false);
        setReasons(data.reasons);
        setstats(false)
        // Verificar os motivos e exibir mensagens de notificação
        if (data.reasons.some((reason: any) => reason.includes('tempo estimado de conta'))) {
          setNotificationMessage('Quando você obter 1 mês de conta, iremos notificar você novamente para tentar a verificação de ID.');
        } else if (data.reasons.some((reason: any) => reason.includes('punições'))) {
          setNotificationMessage('Você não é elegível por conta de punições. Você perderá o acesso ao viewprime sem possibilidade de reverter.');
        } else {
          setNotificationMessage('Por favor, verifique os requisitos e tente novamente mais tarde.');
        }
        
        setViewPrimeStatus(data.viewprime); // Atualizando o status do viewprime
       
      }


      if(data.viewprime == true) {
        setViewPrimeStatusx(true);  
      }  
    } catch (error) {
      console.error('Erro ao verificar ID:', error);
      setNotificationMessage('Ocorreu um erro ao verificar seu ID. Tente novamente mais tarde.');
    }
  };
  
  useEffect(() => { 
 
    if (menutype === "progressbar" && terminalCodesRef.current) {
      setTimeout(() => {
        if (terminalCodesRef.current) {
          hackAnimation(terminalCodesRef.current,notificationMessage, stats ,500, 12, "$ "  , () => { 
            setViewPrimeStatusx(false)
          })
          updateProgressBar(30, () => {
            setTerminalResponse("Operation completed successfully.")
          })
        }
      }, 100)
    }

    handleVerification();
  }, [menutype]);
     
   
    const handleConfirmNotification = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/club/verify-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
      
          const data = await response.json();
      
          if (response.ok) {
          
            // Exibir a mensagem de sucesso recebida do servidor
            setMessage(data.message); // Mostrar a mensagem de sucesso
           
            setViewPrimeStatus(data.viewprime);  
         
          }  

  if (response.status === 400 && data?.action === 'viewprime_removed') {
                  // Se o action recebido for 'viewprime_removed', aguarde 7 segundos antes de atualizar
      if (data.action === 'viewprime_removed') {
      
          setViewPrimeStatus(data.viewprime); // Configurar viewPrimeStatus para o valor da API após 7 segundos
   
      }   else {
        // Caso contrário, atualiza imediatamente
        setViewPrimeStatus(data.viewprime);
      }
    // Exibir a mensagem de sucesso recebida do servidor
        setMessage(data.message); // Mostrar a mensagem de sucesso
         } 

           
        } catch (error) {
          console.error('Erro ao confirmar a notificação:', error);
          alert('Ocorreu um erro ao tentar confirmar a notificação.');
        }finally {
            setLoading(false);
          }
      };
  

     
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const messagesToShow = [
      ...reasons.map(reason => ({ type: 'reason', content: reason })),
      notificationMessage && { type: 'notification', content: notificationMessage },
      Message && { type: 'message', content: Message }
    ].filter(Boolean); // Remove valores falsy (null, undefined)
    
    useEffect(() => {
      if (messagesToShow.length > 1) {
        const interval = setInterval(() => {
          setCurrentMessageIndex(prevIndex => 
            prevIndex + 1 < messagesToShow.length ? prevIndex + 1 : 0
          );
        }, 15000); // Troca a mensagem a cada 5 segundos
    
        return () => clearInterval(interval); // Limpa o intervalo quando o componente desmonta
      }
    }, [messagesToShow.length]);
    
    const currentMessage = messagesToShow[currentMessageIndex];
    
    return viewPrimeStatusx && (
            <Wrao>
             
 {/* <MarginTitle className={`${isVerified ? 'green' : 'red'}`}>{user.typeprime}</MarginTitle>
  */}
 
   <Container>
        
             {/* <CloseButton onClick={() => closeMenu(true)}>
               <CloseButtonLabel>CLOSE MENU</CloseButtonLabel>
               <CloseButtonIcon onClick={handleConfirmNotification}>  
               {loading  ?  <Loader size={20} />  :  <X size={20} />}
                 
               </CloseButtonIcon>
             </CloseButton> */}
   
             <RightContainer>
               <TopContainer>
{/* 
               <MenuContainer>
                   <MenuTitle>Darkvision</MenuTitle>
                   <MenuDesc>
                   Em hackers, a experiência é o berço da criatividade ilimitada e domínio técnico...
                   </MenuDesc>
                 </MenuContainer> */}
{/* 
                 <SecBg>
                   <Image
                     src="/imgs/sec.png"
                     alt="Security Background"
                     width={1127}
                     height={300}
                     style={{ width: "100%" }}
                   />
                 </SecBg>
    */}
                 {/* <UserLevel>
                   <LevelNum>
                     <LevelNumValue>{level ? level : 0}</LevelNumValue>
                     LEVEL
                   </LevelNum>
                 <LevelDesc>
                   Este é o seu nível atual no clubvision. Continue participando para aumentar seu nível e desbloquear novos benefícios.
                   </LevelDesc> 
                   <LevelBg>
                     <Image
                       src="/imgs/level-bg.svg"
                       alt="Level Background"
                       width={360}
                       height={224}
                       style={{ width: "100%", height: "100%" }}
                     />
                   </LevelBg>
                 </UserLevel> */}
   
                 
               </TopContainer>
   
               <BottomContainer as={TerminalContainer}>
            
            
                 <TerminalForm>
                      
                
   
   <div className="flex gap-1 items-center mb-8">
     {benefics && (
      <button onClick={() => setbenefics(false)} className="hdnc">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"  ><path d="M3 19V5"/><path d="m13 6-6 6 6 6"/><path d="M7 12h14"/></svg>
    </button>
     )}
     {!benefics &&  <TerminalTitle>&lt;/&gt; HACKER TERMINAL &lt;/&gt;</TerminalTitle>}
   </div>  
                   <TerminalResponse>
                      {menutype === 'progressbar' && <div className="hhj" />}
                     <TerminalCodes ref={terminalCodesRef} />

                     {benefics && (
    <>
        <ContentIm>
 
 <h1 className="h1">Ativação do VisionID </h1>
  <h3>PREMIUM - {user.typeprime}</h3>
  
 {isVerified ? <h3 className="ACTI">Apto a receber o selo de verificação de identidade.</h3> : <h3>Você não tem permissão para obter o selo prime!</h3>}
         
         <li>
           <span>
             <i className={`fi ${isVerified ? 'fi-sr-coin green' : 'fi-sr-coin red'}`} />
             <text>
               <h5>2000 Mil Orbits</h5>
               <p>Depositados em sua conta.</p>
             </text>
           </span>
 
           <span>
             <i className={`fi ${isVerified ? 'fi-sr-coin green' : 'fi-sr-coin red' }`} />
             <text>
               <h5>100 Bits</h5>
               <p>Depositados em sua conta.</p>
             </text>
           </span>
 
           <span>
             <i className={`fi ${isVerified ? 'fi-sr-rent green' : 'fi-sr-rent red'}`} />
             <text>
               <h5>Ativação da sua Wallet vision</h5>
               <p>Vantagens exclusivas para membros com verificação de identidade.</p>
             </text>
           </span>
 
           <span>
             <i className={`fi ${isVerified ? 'fi-sr-container-storage green' : 'fi-sr-container-storage red'}`} />
             <text>
               <h5>1 Container </h5>
               <p>Vantagens exclusivas para membros com verificação de identidade.</p>
             </text>
           </span>
 
           <span>
             <i className={`fi ${isVerified ? 'fi-sr-ticket-airline green' : 'fi-sr-ticket-airline red'}`} />
             <text>
               <h5>Acesso ao painel de convide amigos</h5>
               <p>Vantagens exclusivas para membros com verificação de identidade.</p>
             </text>
           </span>
 
           <span>
             <i className={`fi ${isVerified ? 'fi-sr-badge-check green' : 'fi-sr-badge-check red'}`} />
             <text>
               <h5>Selo prime</h5>
               <p>Para acesso a outros recursos exclusivos.</p>
             </text>
           </span>
         </li>
 </ContentIm>
    
    </>
  )}


   {!activeMenu && !benefics && (
           <DemoButtonsContainer>
 
 <BottomContainer>
                 <ItemsGrid>
                   
                   <ItemCard  onClick={() => setbenefics(true)}>
                       <ItemTop>
                         <ItemTitle>
                           &lt;/&gt; Ver Beneficios &lt;/&gt;
                           
                         </ItemTitle>
                          <ItemLevel>VIP</ItemLevel>
                         
                       </ItemTop>
                       <ItemDesc>Beneficios que serão ativados na verificação de identidade.</ItemDesc>
                     </ItemCard>
          
 
                     <ItemCard  onClick={() => ( 
                      handleConfirmNotification(),
                      openMenu("progressbar")
                      )}>
                       <ItemTop>
                         <ItemTitle>
                           &lt;/&gt; Verificar Id + &lt;/&gt;
                           <ItemMoney>Premium +</ItemMoney>
                         </ItemTitle>
                          <ItemLevel>Selo Prime</ItemLevel>
                       </ItemTop>
                       <ItemDesc>Verificação prime ativa por completo o acesso ao thenovision.</ItemDesc>
                     </ItemCard>
             
                 </ItemsGrid>
               </BottomContainer>
 
           
           </DemoButtonsContainer>
         )}
                   </TerminalResponse>
    
               
                 </TerminalForm>
              
               
   <CardRigt>
  {currentMessage && (
    <FormInput className={`cardalert ${currentMessage.type}`}>
       System: &gt;
      {currentMessage.type === 'reason' && (
        <>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-8 h-8" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M85.57 446.25h340.86a32 32 0 0 0 28.17-47.17L284.18 82.58c-12.09-22.44-44.27-22.44-56.36 0L57.4 399.08a32 32 0 0 0 28.17 47.17z"></path>
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="m250.26 195.39 5.74 122 5.73-121.95a5.74 5.74 0 0 0-5.79-6h0a5.74 5.74 0 0 0-5.68 5.95z"></path>
            <path d="M256 397.25a20 20 0 1 1 20-20 20 20 0 0 1-20 20z"></path>
          </svg>
          <p>      {currentMessage.content}
          </p>
        </>
      )}

      {currentMessage.type === 'notification' && (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12 13h.01"/><path d="M12 6v3"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
          <p>
          {currentMessage.content}
          </p>
        </>
      )}

      {currentMessage.type === 'message' && (
        <>
          {isVerified ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-check">
              <path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/>
            </svg>
          ) : (
         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12 13h.01"/><path d="M12 6v3"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
          )}
          <p>  {currentMessage.content}</p>
        </>
      )}
    </FormInput>
  )}
</CardRigt>
                 <ProgressContainer>
                   <ProgressTop>
                     <ProgressLabel><FormInput>
                   user-root: &gt;
                   <FormInputText> {terminalResponse}</FormInputText>
                 </FormInput></ProgressLabel>
                     <ProgressPercent id="progress-percent">0%</ProgressPercent>
                   </ProgressTop>
                   <ProgressBar>
                     <ProgressBarInner id="progress-bar" />
                   </ProgressBar>
                 </ProgressContainer>
               </BottomContainer>
             </RightContainer>
          
        
   
{/*  
  <MarginTitle2 className={`${isVerified ? 'green  right-1' : 'red'}`}>club - nvrp</MarginTitle2> */}

       </Container>

    
            </Wrao>
    )
}


const Wrao = styled.div`
 position: fixed;
 background: linear-gradient(to bottom, transparent, #171a19 58%);;
 width: 100%;
 border-radius: 12px;
 height: 100%;
 z-index: 99488;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 display: flex;
   flex-direction: column;
   justify-content: center;
   place-items: center;
   align-items: center;
 
 .green{
    background:  linear-gradient(47deg, #e71236 0%, #2c5037 1%, #1fc451 100%);
    -webkit-background-clip: text;  
  -webkit-text-fill-color: transparent;
 }
 
  @media screen and (max-width: 1024px) {
    padding: 1rem;
  }

  @media screen and (max-width: 768px) {
    border-radius: 0;
    flex-direction: column;
    justify-content: flex-start;
    height: 100vh;
    width: 100vw;
    place-items: flex-start;
    padding: 0;
    overflow-y: auto;
    
    .siesection {
      display: flex;
      position: absolute;
      top: 1px;
      left: 1px;
      flex-direction: row;
      justify-content: space-evenly;
      width: 100vw;
      padding: 2em 1em 2em;
    }
  }

  @media screen and (max-width: 530px) {
    border-radius: 0;
    flex-direction: column;
    justify-content: top;
    height: 100vh;
    width: 100vw;
    place-items: top;
    padding: 0;
    
    .siesection {
      display: flex;
      position: absolute;
      top: 1px;
      left: 1px;
      flex-direction: row;
      justify-content: space-evenly;
      width: 100vw;
      padding: 2em 1em 2em;
    }
  }
`;


const CardRigt = styled.div`
   text-align: left;

   z-index: 2683;

  gap: 2px;
  align-items: center;
  font-family: 'ProximaNova-Italic', monospace;
   .cardalertxd{
    grid-column: span 8 / span 8; 
  
  margin-bottom: 0.9em;
  color: #c0c4ce;
  background-color: rgb(20, 22, 24); 
  font-size: 0.75rem; 
  display: flex;
  gap: 0.5em;
  align-items: center; 
  padding: 0.5rem; 
  border-radius: 0.5rem; 
  animation: Viewbm 0.9s linear;
   
  p{
    width: 240px;
    font-size: 10px;
  }
  svg {
    width: 14px; 
    height: 14px; 
  }
   }

  .cardalert{
    grid-column: span 8 / span 8; 
    animation: Viewbm 0.9s linear;
  margin-bottom: 0.9em;
  color: #f97316;
  background-color: rgba(102, 51, 0, 0.3); 
  font-size: 0.75rem; 
  display: flex;
 gap: 0.5em;
  align-items: center; 
  padding: 0.5rem; 
  border-radius: 0.5rem; 
   
  p{
    width: 340px;
    font-size: 10px;
  }
  svg {
    width: 14px; 
    height: 14px; 
  }
  }


   
  button:disabled{
        background-color: #832b2b5c;
        cursor: not-allowed;
      }
   
  
  .cardalertx{
    grid-column: span 8 / span 8; 
  margin-bottom: 0.9em;
  color: #a8aa21;
  animation: Viewbm 0.9s linear;
  background-color: rgba(127, 133, 52, 0.3); 
  font-size: 0.75rem; 
  display: flex;
   gap: 0.5em;
  align-items: center; 
  padding: 0.5rem; 
  border-radius: 0.5rem; 
   
  p{
    width: 340px;
    color: #c2cace;
    font-size: 10px;
  }
  svg {
    width: 14px; 
    height: 14px; 
  }
  }

 @keyframes Viewbm {
   0%{ transform: translateY(-30%) }
   100% {transform: translateY(0%)}
 }

  @media screen and (max-width: 768px) {
    right: 0;
    position: relative;
    margin-bottom: 1rem;
    
    .cardalert, .cardalertx, .cardalertxd {
      p {
        width: 280px;
        font-size: 11px;
      }
    }
    
    .monv {
      display: none;
    }
  }
  
  @media screen and (max-width: 530px) { 
     right: 0;
     position: relative;
     
    .cardalert, .cardalertx, .cardalertxd {
      p {
        width: 250px;
        font-size: 10px;
      }
      
      svg {
        width: 21px;
        height: 21px;
      }
    }
    
    .monv {
      display: none;
    }
  }
`;

const MarginTitle2 = styled.h1`
font-family: 'Europa Grotesk';
  font-size: 4rem;
  writing-mode: vertical-lr;
  position: absolute;
  right: 1%;
  z-index: 0;
  bottom: 5%;
  text-align: center; 
  color: #4144424a;

  @media screen and (max-width: 1024px) {
    font-size: 5rem;
    left: 1%;
  }

  @media screen and (max-width: 768px) {
    font-size: 4rem;
    opacity: 0.3;
    top: 20%;
    left: 1%;
  }

  @media screen and (max-width: 530px) { 
    font-size: 3rem;
    opacity: 0.2;
    top: 25%;
  }
`;
const MarginTitle = styled.h1`
 font-family: 'Europa Grotesk';
  font-size: 7rem;
  writing-mode: vertical-rl;
  position: absolute;
  left: 1%;
  top: 8%;
  text-align: center; 
  color: #29332d4b;

  @media screen and (max-width: 1024px) {
    font-size: 5rem;
    left: 1%;
  }

  @media screen and (max-width: 768px) {
    font-size: 4rem;
    opacity: 0.3;
    top: 20%;
    left: 1%;
  }

  @media screen and (max-width: 530px) { 
    font-size: 3rem;
    opacity: 0.2;
    top: 25%;
  }
`;


const ContentIm = styled.div`
    font-family: 'InterSemiBold';

  h2{
  background:  linear-gradient(47deg, #e71236 0%, #26dd5d 1%, rgba(55,90,226,1) 100%);
  -webkit-background-clip: text;  
  text-transform: uppercase;
  font-size: 19px;
  -webkit-text-fill-color: transparent;   
 }

 h3{
  color: #4c504e;
  font-size: 12px;
  margin-bottom: 2em;
 }

 h1{
  font-family: 'XcSemibold', monospace;
  color: #3b3d3b;
  text-transform: uppercase;
 }

 .ACTI{
  color: #448b44;
 }
 li{
 
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 3 colunas */
  gap: 9px;
  padding: 0;
  list-style: none;
 

 }
 
 span{
  display: flex;
  flex-direction: row;


  h5{
    font-size: 12px;
  }

  p{
    max-width: 130px;
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
  }
 }

 .green{
    background:  linear-gradient(47deg, #e71236 0%, #2c5037 1%, #1fc451 100%);
    -webkit-background-clip: text;  
  -webkit-text-fill-color: transparent;
 }

 .red{
    background:  linear-gradient(47deg, #5e5658 0%, #373a38 1%, #47494db0 100%);
    -webkit-background-clip: text;  
  -webkit-text-fill-color: transparent;
 }
 
 
 i{
  font-size: 28px;
  background:  linear-gradient(47deg, #e71236 0%, #2c5037 1%, #5b5e68 100%);
  -webkit-background-clip: text;  
  -webkit-text-fill-color: transparent;
  margin: 0.3em;
 }
  
h5{
  color: #d7dee4;
  text-align: left;
}

 p{
  color: #aaaeb3;
  text-align: left;
  font-size: 11px;
 }

  @media screen and (max-width: 768px) {
    h2 {
      font-size: 16px;
    }
    
    h3 {
      font-size: 11px;
    }
    
    li {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    
    span {
      h5 {
        font-size: 11px;
      }
      
      p {
        max-width: 200px;
        font-size: 10px;
      }
    }
    
    i {
      font-size: 24px;
    }
  }

  @media screen and (max-width: 530px) {
    h2 {
      font-size: 14px;
    }
    
    h3 {
      font-size: 10px;
      margin-bottom: 1.5em;
    }
    
    span {
      h5 {
        font-size: 10px;
      }
      
      p {
        max-width: 180px;
        font-size: 9px;
      }
    }
    
    i {
      font-size: 20px;
      margin: 0.2em;
    }
  }
`;


// Animations
const typing = keyframes`
  0% {
    color: #eee;
    background: #fff;
  }
  5% {
    background: transparent;
    color: #fff;
  }
  100% {
    background: transparent;
    color: #6cffb0;
  }
`

const rbcolor = keyframes`
  25% {
    color: rgba(255, 255, 255, 0.54);
  }
  50% {
    color: rgb(108, 255, 176);
  }
  75% {
    color: rgba(255, 255, 255, 0.54);
  }
  100% {
    color: rgb(108, 255, 176);
  }
`

// Base Components
export const Container = styled.div`
  position: relative;
  width: 70vw;
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 19px;
 
  color: white;
 
  font-family: 'Akrobat', sans-serif;

  @media screen and (max-width: 1024px) {
    width: 90vw;
    border-radius: 15px;
  }

  @media screen and (max-width: 768px) {
    width: 95vw;
    border-radius: 12px;
    margin-top: 2rem;
    overflow-y: auto;
  }

  @media screen and (max-width: 530px) {
    width: 100vw;
    border-radius: 0;
    height: 100vh;
    margin-top: 0;
  }
`

export const BackgroundWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`

// Close Button
export const CloseButton = styled.div`
  position: absolute;
  top: 3vh;
  right: 4vh;
  display: flex;
  align-items: center;
  gap: 4vh;
  font-size: 0.73vw;
  cursor: pointer;
  transition: transform 0.5s;
  z-index: 10;

  &:hover {
    transform: scale(1.05);
  }

  @media screen and (max-width: 1024px) {
    font-size: 1vw;
    gap: 3vh;
  }

  @media screen and (max-width: 768px) {
    font-size: 14px;
    gap: 2rem;
    top: 2rem;
    right: 2rem;
  }

  @media screen and (max-width: 530px) {
    font-size: 12px;
    gap: 1rem;
    top: 1rem;
    right: 1rem;
  }
`

export const CloseButtonLabel = styled.span`
  margin-top: 0.16vw;

  @media screen and (max-width: 768px) {
    margin-top: 2px;
  }
`

export const CloseButtonIcon = styled.div`
  width: 2.08vw;
  height: 2.08vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(0deg, #ff275b 0%, rgba(182, 18, 58, 0) 100%);
  border: 0.05vw solid #ff275b;
  box-shadow: inset 0 0 1.93vw #ff275b, 0 0.21vw 2.92vw rgba(182, 18, 58, 0.25);

  @media screen and (max-width: 1024px) {
    width: 3vw;
    height: 3vw;
  }

  @media screen and (max-width: 768px) {
    width: 40px;
    height: 40px;
    border: 1px solid #ff275b;
  }

  @media screen and (max-width: 530px) {
    width: 35px;
    height: 35px;
  }
`

// Main Container Structure
export const RightContainer = styled.div`
  width: 100%;
 
  display: flex;
  flex-direction: column;
  gap: 0.13vw;
  z-index: 10;

  @media screen and (max-width: 1024px) {
    margin-top: 2rem;
    gap: 2rem;
  }

  @media screen and (max-width: 768px) {
    margin-top: 1.5rem;
    gap: 1.5rem;
  }

  @media screen and (max-width: 530px) {
    margin-top: 1rem;
    gap: 1rem;
  }
`

export const TopContainer = styled.div`
  align-self: flex-end;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 1em;
  min-height: 12.4vw;

  @media screen and (max-width: 1024px) {
    min-height: 15vw;
    flex-wrap: wrap;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    min-height: auto;
    padding: 0 1rem;
    gap: 1rem;
  }

  @media screen and (max-width: 530px) {
    flex-direction: column;
    padding: 0 0.5rem;
    gap: 0.5rem;
  }
`

export const SecBg = styled.div`
  flex: 1;
  position: relative;

  img {
    position: absolute;
    width: 58.7vw;
    top: -2.08vw;
    left: 0;
  }

  @media screen and (max-width: 1024px) {
    img {
      width: 70vw;
      top: -1.5vw;
    }
  }

  @media screen and (max-width: 768px) {
    img {
      position: absolute;
      width: 100%;
      top: 0;
      height: auto;
    }
  }

  @media screen and (max-width: 530px) {
    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }
  }
`

// User Level
export const UserLevel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25vw;
  position: relative;
  z-index: 12;
  width: 14.75vw;
  height: 11.67vw;

  @media screen and (max-width: 1024px) {
    width: 25vw;
    height: 15vw;
    gap: 1.5vw;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    height: auto;
    gap: 1rem;
    justify-content: flex-start;
    padding: 1rem;
  }

  @media screen and (max-width: 530px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem;
  }
`

export const LevelNum = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;

  @media screen and (max-width: 768px) {
    text-align: left;
  }
`

export const LevelNumValue = styled.div`
  font-family: 'Akrobat', sans-serif;
  font-size: 4.32vw;
  font-weight: 900;
  margin-bottom: 0.52vw;
  background: radial-gradient(49.33% 32.5% at 50.67% 56%, #42ff71 0%, #4a4e4b 96.88%);
  line-height: 3.39vw;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-text-stroke: 0.05vw #42ff81;
  text-shadow: 0 0.21vw 3.75vw rgba(181, 197, 183, 0.52);

  @media screen and (max-width: 1024px) {
    font-size: 5vw;
    line-height: 4vw;
  }

  @media screen and (max-width: 768px) {
    font-size: 3rem;
    line-height: 2.5rem;
    margin-bottom: 0.5rem;
    -webkit-text-stroke: 1px #42ff81;
  }

  @media screen and (max-width: 530px) {
    font-size: 2.5rem;
    line-height: 2rem;
  }
`

export const LevelDesc = styled.div`
  font-size: 0.78vw;
  color: rgba(255, 255, 255, 0.21);
  width: 14.01vw;
  line-height: 0.94vw;
  letter-spacing: 0.05vw;
  padding-right: 0.63vw;
  font-family: 'Source Code', monospace;

  @media screen and (max-width: 1024px) {
    font-size: 1vw;
    width: 18vw;
    line-height: 1.2vw;
  }

  @media screen and (max-width: 768px) {
    font-size: 12px;
    width: 100%;
    line-height: 1.4;
    padding-right: 0;
  }

  @media screen and (max-width: 530px) {
    font-size: 11px;
  }
`

export const LevelBg = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: -1.04vw;
  pointer-events: none;

  @media screen and (max-width: 768px) {
    position: relative;
    right: 0;
    width: 100%;
    height: 100px;
  }

  @media screen and (max-width: 530px) {
    height: 80px;
  }
`

// Menu
export const MenuContainer = styled.div`
  @media screen and (max-width: 768px) {
    margin-bottom: 1rem;
  }
`

export const MenuTitle = styled.div`
  font-size: 4.32vw;
  font-weight: 900;
  line-height: 5.21vw;
  text-transform: uppercase;
  margin-bottom: 0.37vw;
  background: linear-gradient(180deg, #00ff75 0%, #096c36 96.87%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-text-stroke: 0.04vw #6cffb0;
  text-shadow: 0 0.21vw 3.75vw rgba(108, 255, 176, 0.52);
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    background-image: url("../imgs/menu.png");
    background-repeat: no-repeat;
    background-size: contain;
    display: block;
    width: 4.38vw;
    height: 3.39vw;
    position: absolute;
    bottom: -1.56vw;
    right: -0.94vw;
  }

  @media screen and (max-width: 1024px) {
    font-size: 5vw;
    line-height: 6vw;
    
    &::after {
      width: 5vw;
      height: 4vw;
      bottom: -1.8vw;
      right: -1.2vw;
    }
  }

  @media screen and (max-width: 768px) {
    font-size: 2.5rem;
    line-height: 3rem;
    margin-bottom: 0.5rem;
    -webkit-text-stroke: 1px #6cffb0;
    
    &::after {
      width: 40px;
      height: 30px;
      bottom: -15px;
      right: -10px;
    }
  }

  @media screen and (max-width: 530px) {
    font-size: 2rem;
    line-height: 2.5rem;
    
    &::after {
      width: 35px;
      height: 25px;
      bottom: -12px;
      right: -8px;
    }
  }
`

export const MenuDesc = styled.div`
  font-size: 0.78vw;
  color: rgba(255, 255, 255, 0.54);
  width: 18.23vw;
  letter-spacing: 0.05vw;
  font-family: 'Source Code', monospace;

  @media screen and (max-width: 1024px) {
    font-size: 1vw;
    width: 25vw;
  }

  @media screen and (max-width: 768px) {
    font-size: 12px;
    width: 100%;
  }

  @media screen and (max-width: 530px) {
    font-size: 11px;
  }
`

// Bottom Container
export const BottomContainer = styled.div`
  margin: 0 auto;

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 0 1rem;
  }

  @media screen and (max-width: 530px) {
    padding: 0 0.5rem;
  }
`

export const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 1.09vw;
  font-family: 'Source Code', monospace;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    gap: 0.5rem;
    font-size: 12px;
  }
`

// Items Grid
export const ItemsGrid = styled.div`
  display: flex;
  gap: 1.04vw;
  height: 30vh;
  justify-content: center;
  align-items: center;
   

  @media screen and (max-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 2em;
  }

  @media screen and (max-width: 768px) {
     display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 2em;
  }

  @media screen and (max-width: 530px) {
    margin-top: 2em;
    gap: 0.5rem;
  }
`

export const ItemCard = styled.div`
  width: 20.83vw;
  padding: 0.78vw;
  border: 1px solid rgb(34, 36, 34);
  background: rgba(255, 255, 255, 0);
  transition: box-shadow 0.2s, border 0.2s, background 0.2s;
  box-shadow: 0 0 0 rgba(5, 75, 38, 0.25);
  cursor: var(--f-cursor-pointer);
 border-radius: 12px;
  &:hover {
    background: linear-gradient(0deg, #202221 0%, rgba(5, 75, 38, 0) 100%);
    border: 1px solid #242725;
   
  }

  @media screen and (max-width: 1024px) {
    width: 100%;
    padding: 1rem;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 1rem;
    
    &:hover {
      border: 1px solid #19a85b;
    }
  }

  @media screen and (max-width: 530px) {
    padding: 0.75rem;
  }
`

export const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.63vw;

  @media screen and (max-width: 768px) {
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`

export const ItemTitle = styled.div`
  font-size: 0.89vw;
  font-weight: 700;
  font-family: 'ProximaNova-italic', sans-serif;

  @media screen and (max-width: 1024px) {
    font-size: 1.1vw;
  }

  @media screen and (max-width: 768px) {
    font-size: 14px;
  }

  @media screen and (max-width: 530px) {
    font-size: 12px;
  }
`

export const ItemMoney = styled.span`
  color: #00ff75;
  margin-left: 0.3vw;
  font-size: 0.8vw;

  @media screen and (max-width: 1024px) {
    font-size: 1vw;
  }

  @media screen and (max-width: 768px) {
    font-size: 12px;
    margin-left: 0.25rem;
  }

  @media screen and (max-width: 530px) {
    font-size: 10px;
  }
`

export const ItemLevel = styled.div`
  font-size: 0.73vw;
  color: #000;
   
  padding: 0.2em 0.8em;
  border-radius: 22px;
  background-color: #2b3a30;
   
  @media screen and (max-width: 1024px) {
    font-size: 0.9vw;
    height: 1.3vw;
    padding: 0 0.3vw;
  }

  @media screen and (max-width: 768px) {
    font-size: 11px;
    height: auto;
    padding: 0.25rem 0.5rem;
    border-radius: 2px;
  }

  @media screen and (max-width: 530px) {
    font-size: 10px;
    padding: 0.2rem 0.4rem;
  }
`

export const ItemDesc = styled.div`
  font-size: 0.63vw;
  color: rgba(255, 255, 255, 0.54);
  font-family: 'Source Code', monospace;

  @media screen and (max-width: 1024px) {
    font-size: 0.9vw;
  }

  @media screen and (max-width: 768px) {
    font-size: 12px;
    line-height: 1.4;
  }

  @media screen and (max-width: 530px) {
    font-size: 11px;
  }
`

// Terminal
export const TerminalContainer = styled.div`
  width: 52.5vw;

  @media screen and (max-width: 1024px) {
    width: 70vw;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`

export const TerminalForm = styled.div`
  font-size: 0.73vw;
  line-height: 1.25vw;
  padding: 1.25vw;
  border-radius: 12px;
  backdrop-filter: blur(12px);
  background-color: rgba(61, 61, 61, 0.11);
  margin-bottom: 0.3em;
  position: relative;
  height: 23.88vw;
  overflow: hidden;
  font-family: 'Source Code', monospace;


   .hdnc{
     
    padding: 0.5em;
    background-color: rgba(69, 73, 71, 0.185);
    border-radius: 12px;
    display: flex;
    align-items: center;

    svg{
      stroke: #af3e4d;
    }
   }
  @media screen and (max-width: 1024px) {
    font-size: 0.9vw;
    line-height: 1.4vw;
    padding: 1.5vw;
    height: 28vw;
  }

  @media screen and (max-width: 768px) {
    font-size: 12px;
    line-height: 1.4;
    padding: 1rem;
    height: 400px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
  }

  @media screen and (max-width: 530px) {
    font-size: 11px;
    padding: 0.75rem;
    height: 350px;
  }
`

export const TerminalTitle = styled.div`
  font-family: 'Akrobat', sans-serif;
  font-size: 0.79vw;
  font-weight: 700;
  color: #393b3a;

  @media screen and (max-width: 1024px) {
    font-size: 1.1vw;
  }

  @media screen and (max-width: 768px) {
    font-size: 14px;
  }

  @media screen and (max-width: 530px) {
    font-size: 12px;
  }
`

export const TerminalResponse = styled.div`
  height: calc(100% - 1.56vw);
  border-radius: 12px 12px 0;
  overflow-y: auto;
 
  position: relative;


  .hhj{
      background: linear-gradient(to top, transparent, transparent 50%, #222522d3);
     width: 100%;
     height: 30vh;
     border-radius: 12px 12px 0;
    position: absolute;
    z-index: 19;
    top: 1;
  }

  @media screen and (max-width: 768px) {
    height: calc(100% - 20px);
  }
`

export const TerminalCodes = styled.div`
 position: absolute;
  left: 0;
  right: 0;
  bottom: 5%;
    padding: 0.3em;
   .char {
    color: #6cffb0;
    animation: ${typing} 1s linear;
  }

  .ml-1 {
    margin-left: 0.25vw;
  }

  @media screen and (max-width: 768px) {
    .ml-1 {
      margin-left: 4px;
    }
  }
`

// Search User List
export const SearchUserList = styled.div`
  position: absolute;
  bottom: 1.04vw;
  left: 35vw;
  width: 16.67vw;
  display: flex;
  flex-direction: column;
  gap: 0.21vw;

  @media screen and (max-width: 1024px) {
    bottom: 1.5vw;
    left: 30vw;
    width: 22vw;
  }

  @media screen and (max-width: 768px) {
    position: relative;
    bottom: auto;
    left: auto;
    width: 100%;
    margin-top: 1rem;
  }
`

export const SearchInput = styled.div`
  position: relative;

  svg {
    position: absolute;
    width: 1.04vw;
    height: 1.04vw;
    top: 50%;
    left: 0.83vw;
    transform: translateY(-50%);
    cursor: pointer;
  }

  @media screen and (max-width: 1024px) {
    svg {
      width: 1.3vw;
      height: 1.3vw;
      left: 1vw;
    }
  }

  @media screen and (max-width: 768px) {
    svg {
      width: 16px;
      height: 16px;
      left: 12px;
    }
  }
`

export const SearchInputField = styled.input`
  width: 100%;
  padding-left: 2.34vw;
  color: rgba(255, 255, 255, 0.54);
  height: 2.71vw;
  background-color: rgba(0, 0, 0, 0.12);
  outline: none;
  border: 0;
  
  letter-spacing: 0.05vw;
  font-size: 0.73vw;
  font-family: 'Source Code', monospace;

  @media screen and (max-width: 1024px) {
    padding-left: 3vw;
    height: 3.5vw;
    font-size: 0.9vw;
  }

  @media screen and (max-width: 768px) {
    padding-left: 40px;
    height: 40px;
    font-size: 12px;
  }

  @media screen and (max-width: 530px) {
    padding-left: 35px;
    height: 35px;
    font-size: 11px;
  }
`

export const SearchList = styled.ul`
  background-color: rgba(0, 0, 0, 0.12);
  height: 7.97vw;
  list-style: none;
  padding: 0.89vw 1.56vw;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0.26vw;
    background: #131f29;
    padding-right: 0.63vw;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #1e3140;
  }

  @media screen and (max-width: 1024px) {
    height: 10vw;
    padding: 1.2vw 2vw;
    
    &::-webkit-scrollbar {
      width: 0.4vw;
    }
  }

  @media screen and (max-width: 768px) {
    height: 120px;
    padding: 12px 16px;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
  }

  @media screen and (max-width: 530px) {
    height: 100px;
    padding: 10px 12px;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
  }
`

export const SearchName = styled.li`
  color: rgba(255, 255, 255, 0.54);
  cursor: pointer;
  transition: color 0.2s;
  margin-bottom: 0.42vw;

  &:hover {
    color: #fff;
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media screen and (max-width: 768px) {
    margin-bottom: 6px;
    font-size: 12px;
  }

  @media screen and (max-width: 530px) {
    font-size: 11px;
    margin-bottom: 4px;
  }
`

// Form Input
export const FormInput = styled.div`
   
  font-size: 0.73vw;
  color: rgba(255, 255, 255, 0.54);
  font-family: 'Source Code', monospace;

  @media screen and (max-width: 1024px) {
    padding: 1.8vw 1.4vw;
    font-size: 0.9vw;
  }

  @media screen and (max-width: 768px) {
    padding: 16px 12px;
    font-size: 12px;
  }

  @media screen and (max-width: 530px) {
    padding: 12px 8px;
    font-size: 11px;
  }
`

export const FormInputText = styled.span`
  
  animation: ${rbcolor} 3s linear infinite;
`

// Progress Bar
export const ProgressContainer = styled.div`
   margin-bottom: 1em;

   @media screen and (max-width: 530px) {
     margin-bottom: 0.5em;
   }
`

export const ProgressTop = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.47vw;
  color: rgba(255, 255, 255, 0.54);
  font-family: 'Source Code', monospace;

  @media screen and (max-width: 768px) {
    margin-bottom: 6px;
    font-size: 12px;
  }

  @media screen and (max-width: 530px) {
    font-size: 11px;
    margin-bottom: 4px;
  }
`

export const ProgressLabel = styled.div``

export const ProgressPercent = styled.div``

export const ProgressBar = styled.div`
  height: 0.1vw;
  background-color: rgba(255, 255, 255, 0.08);

  @media screen and (max-width: 768px) {
    height: 2px;
  }

  @media screen and (max-width: 530px) {
    height: 1.5px;
  }
`

export const ProgressBarInner = styled.div`
  width: 0;
  height: 100%;
  background-color: rgba(2, 225, 145, 0.71);
  transition: width 0.85s ease-out;
`

// Tweet
export const TweetContainer = styled.div`
  padding: 1.25vw;
  border: 0.08vw solid rgba(255, 255, 255, 0.08);
  margin-top: 1.77vw;

  @media screen and (max-width: 1024px) {
    padding: 1.6vw;
    margin-top: 2.2vw;
  }

  @media screen and (max-width: 768px) {
    padding: 1rem;
    margin-top: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  @media screen and (max-width: 530px) {
    padding: 0.75rem;
    margin-top: 1rem;
  }
`

export const TweetTitle = styled.div`
  font-size: 1.3vw;
  font-weight: 700;
  margin-bottom: 1.04vw;

  @media screen and (max-width: 1024px) {
    font-size: 1.6vw;
    margin-bottom: 1.3vw;
  }

  @media screen and (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 1rem;
  }

  @media screen and (max-width: 530px) {
    font-size: 16px;
    margin-bottom: 0.75rem;
  }
`

export const TweetBot = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }

  @media screen and (max-width: 530px) {
    gap: 0.75rem;
  }
`

export const TweetDesc = styled.div`
  font-size: 1.04vw;
  line-height: 1.25vw;
  color: rgba(255, 255, 255, 0.54);
  width: 25.16vw;
  font-family: 'Source Code', monospace;

  @media screen and (max-width: 1024px) {
    font-size: 1.3vw;
    line-height: 1.6vw;
    width: 32vw;
  }

  @media screen and (max-width: 768px) {
    font-size: 14px;
    line-height: 1.4;
    width: 100%;
  }

  @media screen and (max-width: 530px) {
    font-size: 12px;
  }
`

export const TweetButton = styled.div`
  background: linear-gradient(0deg, #5e81ff 0%, rgba(18, 53, 183, 0) 100%);
  border: 0.08vw solid #5e81ff;
  box-shadow: inset 0 0 2.81vw #5e81ff, 0 0.31vw 4.22vw rgba(18, 53, 183, 0.25);
  align-self: flex-start;
  padding: 1.15vw 3.13vw;
  cursor: pointer;
  margin-right: 2.08vw;
  font-size: 1.09vw;

  @media screen and (max-width: 1024px) {
    padding: 1.5vw 4vw;
    margin-right: 2.6vw;
    font-size: 1.4vw;
    border: 0.1vw solid #5e81ff;
  }

  @media screen and (max-width: 768px) {
    padding: 12px 24px;
    margin-right: 0;
    font-size: 14px;
    border: 1px solid #5e81ff;
    align-self: stretch;
    text-align: center;
  }

  @media screen and (max-width: 530px) {
    padding: 10px 20px;
    font-size: 12px;
  }
`

export const TweetInput = styled.textarea`
  outline: none;
  width: 100%;
  padding: 3.65vw 1.56vw 2.6vw;
  margin-top: 0.78vw;
  background-color: rgba(0, 0, 0, 0.12);
  border: 0;
  
  color: rgba(255, 255, 255, 0.54);
  font-size: 1.04vw;
  resize: none;
  line-height: 1.56vw;
  font-family: 'Source Code', monospace;

  @media screen and (max-width: 1024px) {
    padding: 4.6vw 2vw 3.3vw;
    margin-top: 1vw;
    font-size: 1.3vw;
    line-height: 2vw;
  }

  @media screen and (max-width: 768px) {
    padding: 24px 16px 20px;
    margin-top: 12px;
    font-size: 14px;
    line-height: 1.4;
  }

  @media screen and (max-width: 530px) {
    padding: 20px 12px 16px;
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.3;
  }
`

// Demo Buttons
export const DemoButtonsContainer = styled.div`
  position: relative;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.56vw;

  @media screen and (max-width: 768px) {
   
    align-items: flex-start;
    justify-content: stretch;
    gap: 1rem;
 
  }

  @media screen and (max-width: 530px) {
   
    gap: 0.5rem;
  }
`

export const DemoButton = styled.button`
  padding: 0.78vw 1.56vw;
  background: linear-gradient(0deg, #0c7b3f 0%, rgba(5, 75, 38, 0) 100%);
  border: 0.05vw solid #19a85b;
  box-shadow: inset 0 0 1.93vw #19a85b;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  @media screen and (max-width: 1024px) {
    padding: 1vw 2vw;
    border: 0.08vw solid #19a85b;
  }

  @media screen and (max-width: 768px) {
    padding: 12px 20px;
    border: 1px solid #19a85b;
    font-size: 14px;
  }

  @media screen and (max-width: 530px) {
    padding: 10px 16px;
    font-size: 12px;
  }
`