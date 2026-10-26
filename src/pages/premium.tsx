import styled from "styled-components";
import { useRouter } from "next/router";
import Link from 'next/link';
import ROUTENVX from '@/routes/routes';
import Cardprime from "@/club/.prime/container/cardprime";
import React, { ReactNode, useEffect, useState }   from 'react';
import HeadGlobal from "@/club/head/glob.n";
import Image from "next/image";
import TypewriterComponent from "typewriter-effect";
import PricingTable from '../club/.prime/container/cardprime/plans.overview';
import { User } from "@/types/user/types";
import { withSession } from "@/lib/session";
import { GetServerSideProps } from "next";
import {  GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import {  NextIronRequest } from "@/lib/session"; 
import { ModLog, getModLogs } from "@/types/discord/modlog";
import { TheNoVisionRoute } from "@/lib/session/redirects";
import { getPermission, Permission } from '@/types/discord/permission';
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";
import { UserInfo } from "@/types/discord/usersearch";
  
interface Props {
  user: User | null;
  Permissions: Permission[];
  logs: ModLog[];
}

export default function PremiumComponents ({ user }: Props) {

    const router = useRouter();
 
    const [viewbenefic, setViewbenefic] = useState(false);
    const [isClosing, setIsClosing] = useState(false); // Controle para a animação de fechamento
    const [istypeprime, setisprime] = useState(0)
const { isLoadingx, userInfoObject} = GetInfo_nvxre_xyloQuerier();
     const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
  
   useEffect(() => {
      if(!user) {
     router.push(ROUTENVX.signin)
   }

  if (!isLoadingx && userInfoObject) {
    setUserInfo(userInfoObject);
    }
  }, [user,isLoadingx, userInfoObject]);

    const handleopenbenefic = () => {
      setIsClosing(false);
      setViewbenefic(true); 
    };
  
    const handleclosebenefic = () => {
      setIsClosing(true);  
      setTimeout(() => {
        setViewbenefic(false);  
      }, 200);  
    };
  
   

    
    return(
        <>
          <HeadGlobal Title="Assinatura Premium - clubvision " />
 
          <StyleStore id="premium"> 
         
          <ContainerCX>
     
      <HeaderBVC>
      <ContentZX>
    <LeftWas ImageProp={'https://cdn.prod.website-files.com/6597cc7be68d63ec0c8ce338/65b632613037cbbc2a8b1814_EGLD-Get-Section06.webp'}/>
    
    <RightWas ImageProp={'https://cdn.prod.website-files.com/6597cc7be68d63ec0c8ce338/65b63262fc4c59f7f2b37243_EGLD-Get-Section05.webp'}/>
   
    </ContentZX>
       <OverlayCX>
      
         <ContentAboutI>

           <Image src={'/nvrp/20221001_185012.png'} 
           alt='novision' className={'novision'} width={280} height={80}/>
          <ul>
          <h1>J<span className="icongraffit">O</span>GUE</h1> 
          <h1><TypewriterComponent  options={{ strings: ["SENDO PRIME","COM VANTAGENS", "COM AMIGOS PRIME", "COMO VIP"],  autoStart: true, loop: true,}}/></h1> 
          </ul>
          <h2>Imersão realistica e muita diversão.</h2>
        </ContentAboutI> 
         
         
       </OverlayCX>
     
       <HeFow/>
       
      </HeaderBVC>
   
    
    <MarginCenter> 
      <StoreContainer>

      <Container4>
        
<CardCredit>
<ContentIm>
<h2>PRIME</h2>

 
<h3>Conta Prime com acesso a recursos exclusivos..</h3>

<li>
 




{istypeprime == 1 && (
   <>

<span>
<i className="fi fi-sr-fingerprint" /> 
<text>
<h5>Verificação de identidade</h5>
<p>A verificação de identidade ativa alguns recursos exclusivos..</p>
</text>
</span>

   <span>
<i className="fi fi-sr-ticket" />
 <text>
 <h5>Convide seus amigos</h5>
 <p>Acesso ao menu de convites.</p>
 </text>
</span>

<span>
<i className="fi fi-sr-tickets-airline" /> 
 <text>
 <h5>Conta autorizada</h5>
 <p>Autorizado sem a necessidade de convite.</p>
 </text>
</span>

<span>
<i className="fi fi-sr-rent" />
 <text>
 <h5>Acesso total ao clubvision.</h5>
 <p>Vantagens exclusivas para membros prime.</p>
 </text>
</span>

<span>
<i className="fi fi-bs-badge-check" /> 
<text>
<h5>Conta Verificada</h5>
<p> Obtenha um selo verde em seu perfil.</p>
</text>
</span>
   </>
)}
{istypeprime == 0 && (
  <span>
<i className="fi fi-sr-rent" />
 <text>
 <h5>Acesso prime ao clubvision.</h5>
 <p>Vantagens exclusivas para membros prime.</p>
 </text>
</span>

) }
 
<span>
<i className="fi fi-sr-credit-card" /> 
 <text>
 <h5>2.000 Bits</h5>
 <p>Creditado em sua conta thenovision.</p>
 </text>
</span>

 

<span>
<i className="fi fi-bs-gem" /> 
 <text>
 <h5>16.000 ORBS</h5>
 <p>Creditado em sua conta clubvision.</p>
 </text>
</span>
 
{(viewbenefic || isClosing) &&  (
<div className={`colos ${viewbenefic ? 'slide-down' : 'slide-up'}`}>




{istypeprime == 1 && (
   <>
 

<span>
<i className="fi fi-bs-treasure-chest" /> 
<text>
<h5>Monetização</h5>
<p> Ganhe Bits por visualizações nas suas postagens.</p>
</text>
</span>

<span>
<i className="fi fi-bs-tax-alt" /> 
<text>
<h5>+ Univision X</h5>
<p> Receba de 1 a 5% de Orbs das transações.</p>
</text>
</span>

<span>
<i className="fi fi-bs-hockey-puck" /> 
<text>
<h5> Mini-Game Double </h5>
<p> Jogue para tentar triplicar suas apostas.</p>
</text>
</span>

<span>
<i className="fi fi-sr-dashboard-panel" /> 
<text>
<h5>ClubStudio</h5>
<p> Gerencie e monetize sua mídia.</p>
</text>
</span>

   </>
)}

<span>
<i className="fi fi-bs-user-pen" /> 
<text>
<h5> Personalização do perfil </h5>
<p> Altere seu avatar e faixa para personalizar seu perfil.</p>
</text>
</span>

<span>
<i className="fi fi-bs-shield" /> 
<text>
<h5> Isecurity </h5>
<p> Sistema de segurança que protege sua conta.</p>
</text>
</span>

 

<span>
<i className="fi fi-br-user-unlock" /> 
<text>
<h5> Feed Postvision</h5>
<p> Acesso ao feed de postagens de fotos e vídeos.</p>
</text>
</span>

<span>
<i className="fi fi-br-broken-image" /> 
<text>
<h5> Acesso ao Postvision</h5>
<p> Painel de postagens de fotos e vídeos.</p>
</text>
</span>

<span>
<i className="fi fi-bs-eye" /> 
<text>
<h5>Perfil Público</h5>
<p> Libere o acesso público à sua galeria.</p>
</text>
</span>

 

<span>
<i className="fi fi-bs-pallet-alt" /> 
<text>
<h5>Personalizar Clubvision</h5>
<p> Acesso ao menu de personalização.</p>
</text>
</span>

<span>
<i className="fi fi-bs-flag-alt" /> 
<text>
<h5>Criação de Clã</h5>
<p> Crie seu clã no ClubVision.</p>
</text>
</span>

 
{/* 
<span>
<i className="fi fi-bs-ad-forbidden" /> 
<text>
<h5>Anúncios</h5>
<p> Desfrute do ClubVision sem anúncios.</p>
</text>
</span> */}

</div>
)}


 <ul>
 {viewbenefic ? (
   <>
    <button onClick={handleclosebenefic}>
     <i className='fi fi-sr-sort-down trs' />
      <h6>Ver menos</h6>
   </button>
   </>
 ) : (
   <>
    <button onClick={handleopenbenefic}>
     <i className='fi fi-sr-sort-down' />
      <h6>Ver mais</h6>
   </button>
   </>
 )}
   
 </ul>
</li>
 

</ContentIm>   
<ListRight>
 <RightContent>
 <text>
 <li className="xcnjd">
       <span>R$</span>
  <h4>{istypeprime == 0 && 13.99} {istypeprime == 1 && 89.99}</h4>

       </li>
     {/* <section>17,00%</section> */}
   </text>

   <ButtonClx>
  
  <button onClick={() => setisprime(0)} className={istypeprime == 0 ? 'active' : ''}>
  <h4>Premium</h4>
  <span className="green3 fdspan">Bloom</span>
  </button>

  <button onClick={() => setisprime(1)} className={istypeprime == 1 ? 'active' : ''}>
  <h4>Premium</h4>
  <span className="green2  fdspan">Plus</span>
  </button>

</ButtonClx>
      

 <p>        
   Todas as Transações para o thenovision são seguras e feitas usando tecnologias confiaveis. 
 </p>
 </RightContent>


   <Button  onClick={() => router.push(`/${ROUTENVX.centralpremium}`)}>
   <h4>Assinar</h4>
   <i className="fi fi-rr-share-square" />
  </Button>
 
 <RightContent>
 <p>
 Com acesso premium garantido, você desfruta de total liberdade para utilizar nossos serviços.
 </p>

 <Link href={ROUTENVX.policy}>
  Veja os Termos de Serviço completos
 </Link>
 </RightContent>
 </ListRight>
</CardCredit>


</Container4> 



<div>
   <Container>
       
 
  <Marginpage>
   
  
  <ContainerX id="plans">
  <Title45>
            
            <ul className="ul">
            <h2 className="h2">DESCUBRA OS PLANOS VIP </h2>
            <p>DESBLOQUEIE BENEFÍCIOS EXCLUSIVOS E ELEVE SUA EXPERIÊNCIA NO SERVIDOR!</p>
            </ul>   
 
          </Title45>
          
     <ContentAblsOP>
    

        <Container4OP>
        <CardCreditOP>
        <Cardprime />

        </CardCreditOP>
    
        <ContentImOP>
        
        <li>
        <span>
        <i className="fi fi-sr-ticket" />
         <text>
         <h5>Convide seus amigos</h5>
         <p>Convide amigos que são bons de historias. </p>
         </text>
        </span>
   
    
       <span>
        <i className="fi fi-sr-tickets-airline" /> 
         <text>
         <h5>Conta autorizada</h5>
         <p>Você sera liberado em nossa comunidade.</p>
         </text>
        </span>
      
        <span>
        <i className="fi fi-sr-rent" />
         <text>
         <h5>Acesso total ao thenovision.</h5>
         <p>Vantagens exclusivas para membros prime.</p>
         </text>
        </span>
        </li>
 
       </ContentImOP> 

        </Container4OP> 
     </ContentAblsOP>
    
   
        </ContainerX>
        
        <BGCX />
        <BGRigth />
      

   
      </Marginpage>


   </Container>

   </div>

  </StoreContainer>
      
  <Title45>
            
            <ul className="ul">
            <h2 className="h2">Comparar Planos </h2>
            <p>DESBLOQUEIE BENEFÍCIOS EXCLUSIVOS E ELEVE SUA EXPERIÊNCIA NO SERVIDOR!</p>
            </ul>   
 
          </Title45>

    <PricingTable infouser={userInfo ? userInfo : undefined} />
   
  </MarginCenter>
  
     </ContainerCX>
</StyleStore>
 

        </>
    )
}



PremiumComponents.getLayout = function getLayout(page: ReactNode) {
  return <>{page}</>
}





export const getServerSideProps: GetServerSideProps<Props> = withSession(
    async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
      const req: NextIronRequest = context.req as NextIronRequest;
    
   // Chamando TheNoVisionRoute para verificar a sessão do usuário
   const result = await TheNoVisionRoute({ req });
  
   const user = result.props.user;
   if (!user) {
    return {
    redirect: {
   destination: ROUTENVX.signin, 
    permanent: false,
      },
    };
  }
    let Permissions: Permission[] = [];
    let logs: ModLog[] = [];
  
    if (user) {
      const userId = user.id;
      const guildId = "1175857498687807560"; 
      
      try {
        logs = await getModLogs(guildId, userId);
        Permissions = await getPermission(guildId, userId);
  
        // Convert Date objects to string representations
        Permissions.forEach((permission) => {
          permission.created_at = permission.created_at.toString();
        });
  
      } catch (error) {
        console.error("Error fetching information:", error);
      }
    }
  
    return {
      props: {
        user,
        Permissions,
        logs,
      },
    };
  }
  );

const MarginCenter = styled.div`

  margin: 0 auto;
   width: 100%;
   max-width: 1200px;
   display: flex;
   flex-direction: column;
   justify-content: center;
 
   align-items: center;
  
`;


const ContentAboutI = styled.div`
    
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  
    ul{
    text-align: center;
    display: flex;

    align-items: center;
    flex-wrap: wrap;
    }
  
     .novision{
      display: none;
     }
    .icongraffit::before{
      content: "";
    background-image: url('/icons/o_icon.png');
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
    width: 46px;
    height: 50px;
    position: absolute;
     
    }
    
   h1{
     font-family: 'Europa Grotesk';
     font-size: 46px;
     margin: 0.2em;
     color:  rgb(210, 226, 218);
   }

   h2{
     font-family: 'XcSemibold';
     font-size: 26px; 
     color:  rgb(19, 20, 19);
     display: block;
    margin-block-start: 0.4em;
    margin-block-end: 0.5em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: 400;
    unicode-bidi: isolate;
   }
 

   @media screen and (max-width: 545px) {
     margin-top: 10%;
     position: relative;
  
     h1{
      font-size: 34px;
     }
   }

   @media screen and (max-width: 430px) {
     
       
      height: 100%;
      width: 100%;
      bottom: 0;
      top: 30%;

      .novision{
           display: block;
           margin-top: 8em;
      }

      h1{
      font-size: 18px;
     }

     h2{
      font-size: 17px;
     }

     .icongraffit::before{
      content: "";
    background-image: url('/icons/o_icon.png');
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
    width: 20px;
    height: 30px;
    position: absolute;
     
    }
   }


   @media screen and (min-width: 360px) and (max-width: 380px){
     h1{
      font-size: 18px;
     }
  } 

 

  @media screen and (max-width: 280px){
    margin-left: -5em;
      h1{
        font-size: 14px;
      }
  }
`;

 

const ContainerCX = styled.section`
   display: flex;
   position: relative;
   overflow: hidden;
   align-items: center;
   flex-direction: column;
   z-index: 0;
   background-color: rgba(0, 0, 0, 1);
   border-radius: 12px;
`;

const OverlayCX = styled.div`
  background-image: linear-gradient(to bottom, transparent, transparent 60%, rgba(0, 0, 0, 1)), url('/theim/characters/9406616e-fae5-4b2d-bebd-39ea5eeca20d_0.png') !important;
  background-size: cover;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  background-repeat: no-repeat;
  width: 1100px;
  height: 100vh;


  @media screen and (max-width: 430px) {
     width: 680px;
     height: 480px;
  }

  @media screen and (max-width: 380px) {
     width: 680px;
     height: 420px;
  }

  @media screen and (max-width: 375px) {
    height: 490px;
    width: 690px;
   }
`;

const HeFow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(274deg, rgba(0, 0, 0, 1) 10%, rgba(0,0,0,0) 48%, rgba(0,0,0,0) 60%, rgba(0, 0, 0, 1) 98%);
  mix-blend-mode: overlay;
 
 
`;

const HeaderBVC = styled.header`
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%), url('/theim/backgrounds/hdfysufb34.jpg') ;
  height: 100vh;
  width: 100%;
 
  border-radius: 12px;
  background-size: cover;
  background-repeat: no-repeat;
    position: absolute;
    top: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

    @media screen and (max-width: 430px) {
      height: 100vh;
      background-size: 110vh;
      background-position-x: -79vw;
   
}
`;
 




 
 
 
const StyleStore = styled.div`

    position: relative;
    overflow-y: auto;
 
  
`;
 
  
 
const StoreContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  justify-content: center;
  margin-top: 30%;
  gap: 2rem;
  padding: 2rem;

  @media screen and (max-width: 490px) {
  padding: 0.3em;
  gap: 0rem;
}

  
`;
 
///////////////// PRIME 


 

const CardInfo = styled.div`
background-color: rgba(84, 84, 87, 0.089);
padding: 0.5em 1em 0.5em;
border-radius: 12px;
width: 50%;
margin-top: 1em;

ul{
  display: inline-flex;
  align-items: center;
  
  i{
    margin: 0.7em;
    border-radius: 13px;
    background-color: rgba(52, 52, 56, 0.212);
    padding: 0.4em 0.7em 0.4em;
    color: #7a7a81;
  }

  h3{
    font-family: 'Inter', sans-serif;
    color: #bcbbc2;
  }

  h5{
    font-family: 'ProximaNova-Italic', sans-serif;
    font-size: 14px;
    color: rgb(143, 148, 153);
  }
}

  @media screen and (max-width: 540px) {
  width: 100%;
} 
`;

const ContentAbls = styled.div`
 text-align: start;

 margin-top: 2em;
 width: 70%;
 
h2{
  font-size: 33px;
  color: #d2dcdd;
   font-family: 'Inter', sans-serif;
}

@media screen and (max-width: 540px) {
  width: 100%;
} 
`;



////////////////////////////////////


const Container4 = styled.section`
display: flex;
flex-direction: row;
justify-content: center;
 
flex-wrap: wrap;
background-size: cover;
background-repeat: no-repeat;
align-items: center;


@media screen and (max-width: 568px) {

padding: 1em 0em 3em;
} 

`;


const CardCredit = styled.div`
backdrop-filter: blur(100px);
border: 2px solid #252527;
border-radius: 34px;
padding: 2em 2em 2em;
margin: 1em;
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: left;
align-items: center;
transition: 1s all;

@media screen and (max-width: 568px) {
padding: 1em 0em 3em;
margin: 0em;
width: 100%;
} 

.fdspan{
  font-size: 12px;
  padding: 0.4em 1em 0.4em;
  border-radius: 19px;
  font-family: 'InterSemiBold', monospace;
  color: black;
   
}


  .green2{
     
      background-color: rgb(49, 219, 106);
  }
  .green3{
    background-color: rgb(192, 217, 219);
  }


`;


const ContentIm = styled.ul`
 padding: 1em 2em 1em;
 transition: 1s all;

h2{
background:  linear-gradient(47deg, #e71236 0%, #26dd5d 1%, rgba(55,90,226,1) 100%);
-webkit-background-clip: text;  
-webkit-text-fill-color: transparent;   
}

h3{
color: #c3cacf;
font-size: 15px;
margin-bottom: 2em;
}
 

/* Animação de deslizar para baixo quando o conteúdo aparece */
@keyframes slideDown {
  0% {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    max-height: 1000px; /* Ajuste conforme necessário */
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animação de deslizar para cima quando o conteúdo desaparece */
@keyframes slideUp {
  0% {
    max-height: 1000px;
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }
}

.colos {
  overflow: hidden;
}

.slide-down {
  animation: slideDown 0.5s forwards ease-in-out;
}

.slide-up {
  animation: slideUp 0.5s forwards ease-in-out;
}

li{
display: flex;
flex-direction: column;
}

span{
display: flex;
flex-direction: row;
}

i{
font-size: 28px;
background:  linear-gradient(47deg, #e71236 0%, #98a79c 1%, #1cdb82 100%);
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
font-size: 12px;
max-width: 320px;
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
}


ul{
  width: 100%;
  text-align: center;

  button{
    display: inline-flex;
    align-items: center;
    
    i{
      font-size: 14px;
      color: #c5bdbd;
    }
    h6{
      font-family: 'ProximaNova-Italic', sans-serif;
      font-size: 14px;
      color: #c5bdbd;
    }
  }
}

 .trs{
  transform: rotate(180deg);
 }
@media screen and (max-width: 568px) {
padding: 1em 1em 3em; 

  h3{
    font-size: 14px;
  
  }
 
} 


`;


const ListRight = styled.div`
display: flex;
align-items: center;
text-align: center;
flex-direction: column;
justify-content: center;
padding: 1em 1em 1em;


`;

const RightContent = styled.ul`

text-align: center;
width: 100%;

section{
  background-color: rgba(248, 33, 51, 0.726);
padding: 0.3em 1em 0.3em;
height: 24px;

border-radius: 29px;
display: flex;
align-items: center; 
flex-direction: row;
font-size: 12px;
margin-left: 0.3em;
}
h1{
font-size: 41px;
}

p{
max-width: 370px;
text-align: center;
color: #8e9194;
font-size: 12px;
margin-bottom: 1em;
}

span{
  margin-top: 1em;
  font-size: 19px;
  color: #8e9194;
  font-family: 'Graffiti';
}


.xcnjd{
  text-align: center;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center; 
  display: flex;
  }

 li{
  display: inline-flex;
 flex-direction: row;
 align-items: center; 
  
 }

span{
  font-family: "Graffiti";
  color: rgb(170, 170, 170);
  font-size: 20px;
  margin: 0.4em;
}


h4{
  font-family: "Graffiti";
  font-size: 32px;
  color: rgb(255, 255, 255);
  display: block;
  margin-block-start: 0.4em;
  margin-block-end: 0.5em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: 400;
  unicode-bidi: isolate;
}


text{
display: flex;
flex-direction: row;
 text-align: center;
}

a{
font-family: 'Poppins', sans-serif;
font-size: 10px;
color: #8e9194;
 
:hover{
    position: relative;
    top: -1px;
    color: #8e9194;
}
}
`;


const Button = styled.button`
background:  linear-gradient(47deg, #e71236 0%, #98a79c 1%, #1cdb82 100%);
padding: 0.8em 3em 0.8em;
border-radius: 44px;
font-family: 'Inter', sans-serif;
font-weight: 600;
font-size: 16px;
margin: 2em;
color: #000000cf;
transition: 0.9s all;

display: flex;
align-items: center;

i{
margin-left: 0.5em;
}

:hover{
position: relative;
top: -1px;
color: #131414c3;
box-shadow: 2px 3px 29px #4d6cf523;
}
`;

 
 

const Container = styled.div`

display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
margin: 0 auto;
padding: 1em;
width: 100vw;

@media screen and (max-width: 490px) {
  width: 100%;
  padding: 0.2em;
}

`;

const ContentZX = styled.div`

width: 100%;
text-align: center;
display: flex;
flex-direction: column;
align-items: center;

ul{
 
 h1{
  font-size: 59px;
  color: #d2dcdd;
   font-family: 'Inter', sans-serif;
 }

 p{
  color: #b3b5bd;
 font-family: 'ProximaNova-', sans-serif;
 font-size: 18px;
 max-width: 899px;
 font-weight: 900;
  
 }

 .mac{
  margin: 4%;
  margin-bottom: 0;
 }
}


@media screen and (max-width: 490px) {
  display: none;
}
`;


const ButtonClx = styled.div`
background-color: #050505ea;
padding: 0.1em 0.3em 0.1em;
border-radius: 29px;
margin-left: 1em;
display: flex;
align-items: center; 
flex-direction: row;
gap: 9px;



button{
transition: 0.8s linear;
background-color: transparent;
padding: 0.4em 1em 0.4em;
gap: 9px;
border-radius: 29px;
display: flex;
align-items: center; 
flex-direction: row;

  &:hover{
      background-color: rgba(117, 117, 126, 0.089);
  }
}

h4{
  font-family: 'ProximaNova-', monospace;
  font-size: 15px;
}

 
.active{
  background-color: rgba(47, 49, 48, 0.664);
}


@media screen and (max-width: 490px) {
  margin: 0;
} 

`;



interface ImagePropA {
ImageProp: string;
}



const Title45 = styled.div`
   text-align: center;
   display: inline-flex;
   align-items: center;
   justify-content: space-between;
   margin-top: 4em;
   margin-bottom: 1%;
   align-items: center;
   transform: skewX(-5deg); 
   img{
    padding-right: 0.4em;
   }


   .ul{
    display: flex;
    flex-direction: column;
   }

 .h2{
  font-family: 'Europa Grotesk';
  font-size: 24px;
  background:  linear-gradient(47deg, #e71236 0%, #98a79c 1%, #d9dfdc 100%);
-webkit-background-clip: text;  
-webkit-text-fill-color: transparent;
 }


 p{
  font-family: 'ProximaNova-Italic';
  font-size: 13px;
  color: #c2c6c9;
 }

 @media screen and (max-width: 490px) {
  margin: 0;
} 
`;
const LeftWas = styled.div<ImagePropA>`
 background-image:  ${({ ImageProp }) => `url('${ImageProp}')`};
height: 160px;
width: 160px;
position: absolute;
background-size: cover;
z-index: 1;
left: 1px;
background-repeat: no-repeat;
  
`;

const RightWas = styled.div<ImagePropA>`
 background-image: ${({ ImageProp }) => `url('${ImageProp}')`};
 height: 160px;
width: 160px;
right: 2px;
top: 32%;
z-index: 1;
position: absolute;
background-size: cover;
background-repeat: no-repeat;
`;


const BGCX = styled.div`
 background-image: url('https://cdn.prod.website-files.com/6597cc7be68d63ec0c8ce338/65b632600ee72a952f031c51_EGLD-Get-Section07.webp');
 background-repeat: no-repeat;
 background-size: cover;
 height: 140px;
 width: 140px;
 position: absolute;
 z-index: 1329;

 @media screen and (max-width: 490px) {
   display: none;
   }
`;

const BGRigth = styled.div`
background-image: url('https://cdn.prod.website-files.com/6597cc7be68d63ec0c8ce338/65b632600ee72a952f031c51_EGLD-Get-Section07.webp');
 background-repeat: no-repeat;
 background-size: cover;
 height: 140px;
 width: 140px;
 float: right;
 right: 1px;
 z-index: 1329;
 position: absolute;

 @media screen and (max-width: 490px) {
   display: none;
   }
`;


const ContentAblsOP = styled.div`
 text-align: center;

 width: 100%;
  transition: 1s all;
h2{  
  font-size: 33px;
  color: #d2dcdd;
   font-family: 'XcSemibold', sans-serif;
}


`;


////////////////////////////////////


const Container4OP = styled.section`
display: flex;
flex-direction: row;
justify-content: center;

flex-wrap: wrap;
background-size: cover;
background-repeat: no-repeat;
align-items: center;


@media screen and (max-width: 568px) {

padding: 1em 0em 3em;
} 

`;


const CardCreditOP = styled.div`

margin: 1em;
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: left;
align-items: center;

@media screen and (max-width: 568px) {
padding: 1em 0em 3em;
margin: 0;
display: flex;
flex-direction: row;
flex-wrap: wrap;
align-items: center;
justify-content: center;
} 

`;


const ContentImOP = styled.div`
 padding: 0.5em 1em 0.4em;
 

h3{
color: #c3cacf;
font-size: 18px;
margin-bottom: 2em;
}


li{
display: flex;
align-items: center;
flex-direction: row;
flex-wrap: wrap;
justify-content: center;
}

span{
display: flex;
flex-direction: row;
margin: 0.7em;
}

i{
font-size: 28px;
background:  linear-gradient(47deg, #e71236 0%, #98a79c 1%, #1cdb82 100%);
-webkit-background-clip: text;  
-webkit-text-fill-color: transparent;
 padding-right: 0.4em;
 padding-top: 0.1em;
}

h5{
color: #d7dee4;
text-align: left;
}

p{
color: #aaaeb3;
font-size: 12px;
}

 @media screen and (max-width: 490px) {
    padding: 0.4em 0.1em 0.4em;
  li{
    display: flex;
    flex-direction: column;
  }
}
`;



const RightContentOP = styled.ul`
  padding: 0.5em 1em 0.4em;
text-align: center;

section{
  background-color: rgba(248, 33, 51, 0.726);
padding: 0.3em 1em 0.3em;
height: 24px;

border-radius: 29px;
display: flex;
align-items: center; 
flex-direction: row;
font-size: 12px;
margin-left: 0.3em;
}
h1{
font-size: 41px;
}

p{

text-align: center;
color: #8e9194;
font-size: 11px;
margin-bottom: 1em;
}

span{
  margin-top: 1em;
  font-size: 19px;
  color: #8e9194;
  font-family: 'Graffiti';
}

text{
display: flex;
flex-direction: row;
 text-align: center;
}

a{
font-family: 'Poppins', sans-serif;
font-size: 10px;
color: #8e9194;
 
:hover{
    position: relative;
    top: -1px;
    color: #8e9194;
}
}
`;



const ContainerX = styled.div`
display: flex; 
flex-direction: column;
align-items: center;
justify-content: center ;
margin: 0 auto;
 transition: 1s all;

`;




const Rigthimage = styled.div`
background-image: url('/web/e333a93c26a7a6356b1e.webp');
rotate: (134deg);
background-size: cover;
position: fixed;
top: 1px;
height: 340px;
width: 340px;
right: 1px;
`;





const AboutPrimeActive = styled.div`
  margin: 1em;
  padding: 0.3em 0.9em 0.3em;
  display: flex;
  width: 100%;
  justify-content: start;
  flex-direction: column;

 li{
  display: inline-flex;
  align-items: center;
  margin: 0.4em;


  i{
    font-size: 21px;
    color: #58695edc;
    background-color: rgba(192, 192, 204, 0.041);
    padding: 0.5em 0.6em 0.5em;
    height: 45px;
     width: 45px;
    border-radius: 79px;
  }
  
  ul{
    padding-left: 0.4em;
  }
  h5{
    
    color: rgb(144, 146, 155);
  }

  p{
    font-size: 12px;
    color: rgb(82, 83, 88);
  }
 }


`;

const Leftimage = styled.div`
background-image: url('/web/050fb1705aa7671e99b3.webp');
transform: rotate(90deg);
filter: opacity(0.3);
background-size: cover;
background-repeat: no-repeat;
position: fixed;
background-position-x: -524px;
background-position-y: -4px;
top: 0;
height: 340px;
width: 340px;
left: -4px;
`;

const Marginpage = styled.div`

margin: 0 auto;



`;

const ContainerXZ = styled.div`
display: flex; 
align-items: center; 
place-items: center; 
width: 100%;
justify-content: space-evenly;

 display: flex;
 border-top: 1px solid #32353813 ;
align-items: center; 
justify-content: space-between;

padding: 0.3em 1em 0.3em;

@media screen and (max-width: 430px) {
  padding: 0.3em;
}
`;


const ButtonClose = styled.button` 

height: 34px;
border-radius: 50%;
width: 35px;
display: flex;
align-items: center;
justify-content: center; 
transition: 1s all;

&:hover{
  background-color: rgba(203, 204, 212, 0.048);
}


i{
  font-size: 14px;
  color: rgb(171, 174, 182);
}

`;


