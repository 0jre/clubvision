
import { UserData } from "@/types/user/types";
import styled from "styled-components";
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import HeadGlobal from "@/club/head/glob.n";
import NVXROUTE from "@/routes/routes";
import HomeSubscription from "@/club/.prime/premium/view.subscription";
import Crown from '@/public/icons/crown_badge.png'
import { UserInfo } from "@/types/discord/usersearch";
import axios from "axios";
import { decrypt } from '@/core/security/encryption';

import LoadingPageView from "@club/resources/loading/market.loading";
import { useRouter } from "next/router";
import Link from "next/link";
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";
import { nvxre_checkAuthentication } from "@/hooks/checkAuthentication";

interface Nas {
  link: string;
  children: React.ReactNode;
}





export default function SubscriptionPrime () {
    const [showopenprimesubscription, setprimesubscription] = useState(false);
    const [showaboutuser, setaboutuser] = useState(true);
    const [showmodalsubpay, setmodalsubpay] = useState(false)
    const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);
    const [modalsubscription, setmodal] = useState(false);
    const { isLoadingx, userInfoObject,mutate } = GetInfo_nvxre_xyloQuerier();   
    const { isLoadinguser,data,mutateuser } = nvxre_checkAuthentication();

    const router = useRouter();

    useEffect(() => {
      if (router.query.buy === 'club_premium') {
        setmodal(true);
      }
    }, [router.query]);

    const ClickCloseModal = () => {
      setmodal(false);
      const { buy, ...rest } = router.query;
      router.push({
        pathname: router.pathname,
        query: rest  
      }, undefined, { shallow: true });
    };

    const handlemodalsubscription = () => {
      setaboutuser(false);
      setprimesubscription(true);
      setmodalsubpay(false);
    }

    const handlemodalpay = () => {
      setmodalsubpay(true)
      setaboutuser(false);
      setprimesubscription(false);
    }
 
    const ButtonX: React.FC<Nas> = ({ link, children }) => {
      const handleClick = () => {
        window.open(link, '_blank');
      };
    
      return (
        <button onClick={handleClick}>
          {children}
        </button>
      );
    };
 

    useEffect(() => {
      if(!isLoadingx || userInfoObject) { 
       setUserInfo(userInfoObject);
      setIsLoading(false);
        }
    }, [isLoadingx, userInfoObject]);
    
   
    useEffect(() => {
    
     if(!isLoadinguser || data) {
       setUser(data);
       setIsLoading(false);
     }
           
     
      
    }, [ isLoadinguser, data]);
  
    function formatEmail(email: any) {
      // Encontra o índice do @ no email
      const atIndex = email.indexOf("@");
      
      // Garante que os dois primeiros caracteres e o @ sejam preservados corretamente
      if (atIndex > -1) {
          return `${email.slice(0, 2)}...${email.slice(atIndex - 1)}`;
      }
      
      // Caso o @ não exista (não é um email válido), apenas retorna os extremos
      return `${email.slice(0, 2)}...${email.slice(-1)}`;
  }
  return modalsubscription &&(
    <>
 
   <HeadGlobal Title={'Assine o prime e tenha acesso completo! '}/>
   
    <Marginpage>
    
    <Container>
      <section className="siesection">
     
    <Leftimage/>
       <Rigthimage/>
       <ButtonClose onClick={ClickCloseModal}>
        <i className="fi fi-br-cross"/>
       </ButtonClose>
       {showaboutuser && (
        <>

        {isLoading ? (
          <ModalLoading>
          <LoadingPageView />
        <h4>Carregando informações...</h4>
       </ModalLoading>
  
        ) : (
          <CardInfoUser> 
          <ViewInfo>
    {user && (
      <>
  <Image src={user.user.avatar} alt={user.user.name} height={50} width={50} className="logos" />

<ul>
  <h3>{user.user.name}</h3>
  <p>Não é você? Deslogue no discord do navegador e no club <Link href={NVXROUTE.DashboardProfile}>Central</Link> e reinicie o processo.</p>
</ul>
      </>
    )}
    
  </ViewInfo>
      
  <AboutPrimeActive>
     {userInfo !== null ? (
      <>
       <li>
       <i className="fi fi-sr-envelope-open"/>
           
           <ul>
           <h5>Email Clubvision</h5>
           <p>Email: {formatEmail(user?.user.email)}</p>
           </ul>
       </li>

       <li>
        {userInfo.prime ? (
          <>
          <i className="fi fi-sr-user-crown"/>
           
           <ul>
           <h5>Voce é um membro prime</h5>
           <p>Personagem : {userInfo.NameCharacter}</p>
           </ul>
          
          </>
        ) : (
          <>
           <i className="fi fi-rr-fingerprint"/>
           <ul>
           <h5>Voce ainda não é prime</h5>
           </ul>
           
          </>
        )}      
       </li>


       {userInfo.type ? (
        <>
         <li>
         <i className="fi fi-sr-ticket-alt"/>
           
           <ul>
           <h5>Sua conta é autorizada</h5>
           <p>{userInfo.firstname} {userInfo.lastname}</p>
           </ul>
         </li>
        </>
       ) : (
        <>
        <li>
         <i className="fi fi-sr-ticket-airline"/>
           
           <ul>
           <h5>Sua conta não é autorizada</h5>
           <p>{userInfo.firstname} {userInfo.lastname} </p>
           </ul>
         </li>
        </>
       )}
      </>
     ) : (
      <li>
       <i className="fi fi-sr-settings"/>
      <ul>
      <h5>Configure sua conta primeiro.</h5>
      </ul>  
      </li>
     )}
   </AboutPrimeActive> 

   {userInfo?.prime ? null : (
    <>
    {userInfo?.userId && (
      <>
 <Button onClick={handlemodalsubscription}>
       <h4>Continuar</h4>
      </Button>
      </>
    )}
     
    </>
   )}
  
 
  <Card>
        <Content>
          <h4> Informações sobre o Prime</h4>
          <p>O Prime é uma assinatura mensal, onde você pode acessar por completo o clubvision. Alem de ser  autorizado em nossa comunidade. Após expirar seu prime você ainda estará autorizado para jogar em nossa cidade!</p>
        </Content>
        </Card>
        
   

     </CardInfoUser>
     )}
        </>
       )}


       {showmodalsubpay && (
        <>
        {user && (
 <HomeSubscription userid={user.user.id} />
        )}
       
        </>
       )}
       {showopenprimesubscription && (
   <Container4>
        
   <CardCredit>
  
   <ContentIm>
   
    <h2>PRIME</h2>


   <h3>Assinatura premium:</h3>

    <li>
    <span>
    <i className="fi fi-sr-ticket" />
     <text>
      <div className="flex">
      <h5>Convide seus amigos</h5>
      <div className="fdspan">Plus</div>
      </div>
    
     <p>Acesso ao menu de convites.</p>
     </text>
    </span>


   <span>
    <i className="fi fi-sr-tickets-airline" /> 
     <text>
     <div className="flex">
     <h5>Conta autorizada</h5>
     <div className="fdspan">Plus</div>
     </div>
     <p>Voce sera liberado em nossa comunidade.</p>
     </text>
    </span>
 
 
    <span>
    <i className="fi fi-sr-rent" />
     <text>
     <div className="flex">
     <h5>Acesso total ao clubvision.</h5>
     <div className="fdspan">Plus</div>
     </div>
     <p>Vantagens exclusivas para membros prime.</p>
     </text>
    </span>

    <span>
    <i className="fi fi-sr-rent" />
     <text>
     <div className="flex">
     <h5>Acesso prime ao clubvision.</h5>
     <div className="fdspan">Bloom</div>
     </div>
     <p>Vantagens exclusivas para membros prime.</p>
     </text>
    </span>
    </li>
   </ContentIm>   
   <ListRight>
     <RightContent>

      
     <text>
       <h1>R$13</h1>
        <span>.99</span>
       </text>
     <p>       
       O pagamento para o thenovision são seguras e feitas usando tecnologias confiaveis. 
     </p>
     </RightContent>

    
       <Button onClick={handlemodalpay}>
       <h4>Assinatura</h4>
 
      </Button>
   
     <RightContent>
     <p>
     Com acesso ao prime garantido, voce desfruta de total liberdade para utilizar nossos serviços.
     </p>

     <Link href={NVXROUTE.policy}>
      Veja os Termos de Serviço completos
     </Link>
     </RightContent>
     </ListRight>
 
   </CardCredit>
   
   </Container4> 
       )}
  
    <CardLeft>
     
       <ContentAbls>
       <h1>Acesso a todos os recursos</h1> 
     <p className="p">Ao se tornar um membro do Club Premium, você ganha acesso completo a todas as funcionalidades e recursos disponíveis na plataforma. Isso inclui ferramentas exclusivas, conteúdos premium e suporte prioritário.</p>

    <h1> 16.000 ORBS depositado</h1>
    <p className="p">Como parte do pacote premium, você receberá automaticamente um crédito de 16.000 ORBS em sua conta. Esses ORBS podem ser utilizados para realizar compras no ClubVision. Além disso, um bônus exclusivo de 2.000 Bits também será adicionado à sua conta, proporcionando ainda mais benefícios para sua experiência.
      </p>
 
  
    <h1>
    Cobrança automática será feita após o término do período. 
    </h1>
    
    <p className="p">A cobrança da assinatura será realizada automaticamente ao final de cada período de subscrição. Todos os pagamentos são processados através de serviços de pagamento seguros e confiáveis, garantindo a proteção de suas informações financeiras. Portanto, você pode usufruir dos benefícios do Club Premium sem preocupações.</p> 

 

        <section>
        <hr/>
        <Image src={Crown} alt='icon crown prime' height={30} width={30} />
        <hr/>
        </section>


       <h2>Torne sua conta prime agora e tenha acesso total ao clubvision</h2>  
           

         <h6>Ainda não tem certeza se você quer ser um prime?</h6>

         <ButtonX link={`${NVXROUTE.storePrime}`}>
         <h4>Obtenha todos os detalhes sobre o Premium</h4> 
         <i className='fi fi-br-share-square' />
         </ButtonX>
     </ContentAbls>
    </CardLeft>
    </section>
    </Container>
  
    </Marginpage>
     
    </>
  )
}

 

const Content = styled.div`
   
   h4{
    font-family: 'ProximaNova-Italic';
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 0.6em;
    color: rgb(203, 209, 214);
   }

   p{
    font-family: 'ProximaNova-Italic';
    font-size: 10px;
    color: rgb(164, 170, 175);
    max-width: 460px;
   }
   span{
    color: #1ae44c;
    cursor:  var(--f-cursor-pointer);
   }
`;
const ModalLoading = styled.div`
 
   background-color: rgba(191, 191, 201, 0.007);
   border-radius: 8px;
   padding: 0.9em 1em 0.9em;
   margin: 0.9em;
   display:flex;
   flex-direction: column;
   justify-content: center;
 
   height: 15em;
   text-align: center;


   h4{
    font-family: 'XcSemibold', sans-serif;
    font-size: 15px;
    color: rgba(169, 174, 179, 0.61);
   }
`;


const Card = styled.div`
  margin: 0.8em;
  background-color: rgba(94, 97, 95, 0.041);
  padding: 0.4em 0.9em 0.4em;
  border-radius: 3px;


  h2{
    font-family: 'XcSemibold', sans-serif;
    font-size: 18px;
    color: rgb(99, 102, 107);
  }

  p{
    font-size: 12px;
    max-width: 445px;
    color: rgb(100, 102, 105);
  }
`;


const ViewInfo = styled.div`
 
  
   padding: 0.5em 0.7em 0.5em;
   background-color: rgba(8, 8, 8, 0.952);
   border-radius: 11px;
 
   display: inline-flex;
   justify-content: space-between;
   align-items: center;
       
   ul{
    display: flex; 
    padding: 0.4em 1em 0;
    flex-direction: column;
   }
    

     .logos{
      border-radius: 100px;
     }
   
    h3{
      font-family: 'Inter';
      font-size: 25px;
      background: linear-gradient(47deg, #888384 0%, rgb(73, 77, 74) 1%, #c9c0c1 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    }
    a{
      color: #0ddb5c;
    }
    p{
      font-size: 11px;
      color: #868c91;
      margin-bottom: 0.3em;
      max-width: 430px;
    }

 
`;



const ContentAbls = styled.div`
   text-align: center;
   display: flex;
    
   flex-direction: column;
   width: 80%;
   
  h2{  
    font-size: 18px;
    max-width: 630px;
    color: #5b5f5f36;
     font-family: 'XcSemibold', sans-serif;
  }
  

  section{
    display: inline-flex;
    align-items: center;
    margin-top: 3em;

    hr{
     width: 100%;
    }

    img{
      margin: 0.4em;
    }
  } 


  h6{
    margin: 0.8em;
    color: rgb(82, 83, 88);
    font-size: 15px;
    font-family: 'ProximaNova-Italic';
  }


  button{ 
     margin-left: 6em;
    display: inline-flex;
    align-items: center; 

     
    h4{
    font-size: 12px;
    font-family: 'Inter';
    color: rgb(131, 133, 139);
    }

    i{
      padding-left: 0.8em;
      font-size: 11px;
      color: #4a4b50;
    }
  }


     @media screen and (max-width: 430px){
     width: 100%;
  }

  `;

 
const Rigthimage = styled.div`
  background-image: url('/web/e333a93c26a7a6356b1e.webp');
  rotate: (134deg);
  background-size: cover;
  position: absolute;
  top: 1px;
   border-radius: 12px;
  height: 340px;
  width: 340px;
  
  right: 1px;


    @media screen and (max-width: 430px){
     display: none;
  }
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
  position: absolute;
   border-radius: 17px;
  background-position-x: -524px;
  background-position-y: -4px;
  top: 0;
  height: 340px;
  width: 340px;
  left: -4px;


   @media screen and (max-width: 430px){
  
     border-radius: 0;
  
  }
`;

const Marginpage = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  padding: 0 2em 0;
 
  left: 0;
  z-index: 999999;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  place-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
 

   @media screen and (max-width: 430px){
     display: flex;
     flex-direction: column;
     justify-content: center;
     place-items: start;
     height: 100%;
     width: 100%;
     padding: 0;
 
  }
  

`;

const Container = styled.div`
  display: flex; 
  align-items: center; 
  overflow: hidden;
  place-items: center; 
  border-radius: 12px;
  position: relative;
  justify-content: space-evenly;
  background-color:  rgb(11, 12, 10);
  
  .siesection{
    width: 100%;
    height: 100%;
    padding: 2em 5em 2em;
    display: flex; 
    align-items: center; 
    place-items: center; 
    background-image: url('/web/hdshfioef.png');
  }
  
  @media screen and (max-width: 430px){
     border-radius: 0;
    
     .siesection{
     display: grid;
     flex-direction: column;
     justify-content: center;
     overflow-y: auto;
     height: 100%;
     width: 100vw;
     
      padding: 2em 1em 2em;
     }
      
  }
  
`;
 
const CardInfoUser = styled.div`
  display: flex; 
  flex-direction: column; 
  align-items: center;

`;

const CardLeft = styled.div`
   margin-left: 4em;

  h1{
    text-align: start;
    font-size: 17px;
    max-width: 430px;
    margin: 0.4em;
    color: #999ca0e2;
     font-family: 'Poppins', sans-serif;
  }

  .p{
    text-align: start;
    font-size: 13px;
    color: #757e7e;
    margin: 0.4em;
    max-width: 540px;
    font-family: 'ProximaNova-Italic', sans-serif;
  }


   @media screen and (max-width: 430px){
     width: 100%;
     margin-left: 0em;
  }
`;

const ButtonClose = styled.button` 
   position: absolute;
  top: 15px;
  right: 22px;
  height: 34px;
  border-radius: 50%;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center; 
  transition: 1s all;

  &:hover{
    background-color: rgba(4, 4, 5, 0.39);
  }


  i{
    font-size: 14px;
    color: rgb(171, 174, 182);
  }

`;

const Button = styled.button`
 cursor:  var(--f-cursor-pointer);
 background-color: #c0ccc5;
      padding: 1em 5em 1em;
      border-radius: 98px;
      font-family: 'Europa Grotesk';
      font-size: 14px;
      color: #101013;
      transition: 1s all;
      

      &:hover{
        background-color: #060706a7;
        color: #dfe1e7;
        transform: scale(0.9);
      }
   
`;

  

 ///
 
 
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
 
margin: 0.7em;
display: flex;
flex-direction: column;
justify-content: left;
align-items: center;
 
 
`;


const ContentIm = styled.ul`
   width: 100%;
  h2{
  background:  linear-gradient(47deg, #e71236 0%, #26dd5d 1%, rgba(55,90,226,1) 100%);
  -webkit-background-clip: text;  
  -webkit-text-fill-color: transparent;   
 }
  
 .flex{
  display: flex;
  align-items: center;
  gap: 9px;
 }

 .fdspan{
  font-size: 12px;
  padding: 0.4em 1em 0.4em;
  border-radius: 19px;
  font-family: 'InterSemiBold', monospace;
  color: #bac9c3;
  background-color: #27282b;
   
}

 h3{
  color: #c3cacf;
  font-size: 18px;
  margin-bottom: 2em;
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
  font-size: 12px;
 }
`;


const ListRight = styled.div`
display: flex;
align-items: center;
text-align: center;
flex-direction: column;

width: 100%;
@media screen and (max-width: 568px) {
padding: 0em;
} 
`;

const RightContent = styled.ul`
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
 

 
