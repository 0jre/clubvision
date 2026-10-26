import Image from "next/image";
import styled from "styled-components";
import  { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import { User } from '@/types/user/types';
import ROUTENVX from "@/routes/routes";
import HeadGlobal from "@/club/head/glob.n";
import Link from "next/link";
import NVXROUTE from '@/routes/routes';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { withSession, NextIronRequest } from "@/lib/session"; 
import { TheNoVisionRoute } from "@/lib/session/redirects";
 

interface Props {
  user: User | null;
}

 
type AcceptanceKeys = 'terms'| 'owns';
 
export default function ConnectAccount ({ user }: Props) {
  const [acceptedTerms, setAcceptedTerms] = useState<Record<AcceptanceKeys, boolean>>({
    terms: false,
    owns: false,
  });
  
  const handleAcceptChange = (...terms: AcceptanceKeys[]) => {
    const updatedTerms = { ...acceptedTerms };
  
    if (terms.length > 1) {
      // Se múltiplos termos forem passados, ativar todos de uma vez
      terms.forEach(term => {
        updatedTerms[term] = true;
      });
    } else {
      const term = terms[0];
      updatedTerms[term] = !updatedTerms[term];  // Toggle o estado
    }
  
    setAcceptedTerms(updatedTerms);
  };
  

  const [showIframe, setShowIframe] = useState<boolean>(false);
 
  const router = useRouter(); 
    // Handler to receive messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Verifique a origem da mensagem
      if (event.origin === window.location.origin) {
        if (event.data === 'userLoggedIn') {
          // Tenta voltar para a página anterior, caso exista
          router.back();
  
          // Caso não exista página anterior, redireciona para /home
          setTimeout(() => {
            if (window.location.pathname === '/') {
              router.replace('/home');
            }
          }, 300); // Ajuste o tempo para garantir que a navegação tenha ocorrido
        }
      }
    };
  
    useEffect(() => {
      // Adiciona o listener para receber mensagens
      window.addEventListener('message', handleMessage);
  
      // Limpa o listener ao desmontar o componente
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }, [router]);



 
    return(
        <>
     
     <ModalWrapper>   
           <ContainerSDis>
      
      <CenterCox>
        
 
    {user ? null : (
      <>
       <HeadGlobal Title={'Conecte-se no clubvision'} />
     <InformationDescription  className={showIframe? 'active' : ''}>

      
<Image src={'/nvrp/logonvrp.png'} className="dkimg" alt="novision"  height={80} width={80} />
      <ul>
        <h2>CONECTAR-SE AO CLUB</h2>
        <p>Registre-se ou faça login no clubvision, para conseguir jogar em thenovision!</p>
      </ul>

     
    
   <CardButton
          onClick={() => setShowIframe(true)}
          className={acceptedTerms.terms && acceptedTerms.owns ? '' : 'notactive'}
          disabled={!(acceptedTerms.terms && acceptedTerms.owns)}
     
       >
          <p></p>
         <img src={'/icons/app/discordsvg.svg'} alt={'discord'} height={23} width={143} />
         <i className="fi fi-sr-angle-right" />
       </CardButton>



<MarginSelectaccept>
 
      
        <Contentuser>
          <section onClick={() => handleAcceptChange('terms')} className="av">
            <li>
            {acceptedTerms.terms ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#E3E3E6" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>            

            )} 
            </li>
            <h5>Estou de acordo com os requisitos da novision</h5>
          </section>
        </Contentuser>
       
        
        <Contentuser>
          <section onClick={() => handleAcceptChange('owns')} className="av">
            <li>
            {acceptedTerms.owns ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#E3E3E6" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>      
            )} 
            </li>
            <h5>Declaro ter +18 anos e sou responsável.</h5>
          </section>
        </Contentuser>
         
      </MarginSelectaccept>

    </InformationDescription>
    </>
    )}

 
{showIframe && ( // Renderize o iframe condicionalmente
          <div style={{ position: 'relative',margin:'5px', borderRadius: '22px', width: '450px', height: '100vh' }}>
            <iframe
              src="/api/club/connect" // URL do iframe
              style={{ border: 'none', width: '100%', height: '100%' }}
              title="Login clubvision"
           
            />
          </div>
        )}

   
<MarginBottom>
   <h3>Ao continuar, você está indicando que aceita nossos  <Link href={NVXROUTE.terms}>
   Termos de serviço
 </Link>   e  <Link href={NVXROUTE.policy}>
 Política de Privacidade
 </Link>  </h3>
<h3>{ROUTENVX.cop} </h3>  
     
        </MarginBottom>
    </CenterCox>
  
    
        </ContainerSDis>

     
    </ModalWrapper>

     
 
        </>
    )
}


export const getServerSideProps: GetServerSideProps<Props> = withSession(
  async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const req: NextIronRequest = context.req as NextIronRequest;
    const result = await TheNoVisionRoute({ req });
    const user = result.props.user;

    if (user) {
      return {
        redirect: {
          destination: ROUTENVX.Dashboard,
          permanent: false,
        },
      };
    }

    return {
      props: {
        user,
      },
    };
  }
);


 
const MarginSelectaccept = styled.div`
 
  
h6{
  font-size: 12px;
  color: #4a4a50;
  margin-bottom: 0.8em;
}


@media screen and (max-width: 430px) {
  width: 90vw;
  }
`;
 

const Contentuser = styled.div`
 
 
 svg{
    min-width: 20px;
    width: 20px;
    display: block;
    height: 20px;
    color: rgb(61, 61, 61);
  }


   h5{
    font-weight: 500;
    color: #808088;
    margin: 0;
    font-size: 13px;
    padding-left: 0.8em;
    font-family: 'InterSemiBold', sans-serif;
   }
   
   .av{
    cursor:  var(--f-cursor-pointer);
   }
   section{
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-bottom: 0.3em;
    
    li{
       
        padding: 1px 0.6em 0.1em;
       
    }

    i{
      font-size: 9px;
    }
   }
`;

const MarginBottom = styled.div` 
 
  display: flex;
  margin-top: 3em;
  align-items: center; 
  flex-direction: column;
  justify-content: center;
  text-align: center;
  width: 300px;
  
  
  a{
      color: rgb(129, 129, 136);
      font-size: 11px;
      text-decoration: underline;
      border-radius: 30px;
      margin: 0.3em;
  
      
    }


  h3{
    font-family: 'InterSemiBold', monospace;
    font-size: 11px;
    margin: 0.3em;
    color: rgb(129, 129, 136);
  }

  @media screen and (max-width: 430px) {
    transform: scale(0.9);
    display: flex;
    flex-direction: column;

    i{
      display: none;
    }
    ul{
      display: inline-flex;
    }
  }
`; 

const ContainerSDis = styled.section`
   display: flex;
   flex-direction: column;
   flex-wrap: wrap; 
   justify-content: center;
   align-items: center;
   place-items: center;
   height: 100vh;
   width: 100%;
   
`;

 
const ModalWrapper = styled.div`
    display: flex;
    align-items: center;
  
  flex-direction: column;
  background-image: url('/web/hdshfioef.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
  
  animation: opacityModl 1s;

  @keyframes opacityModl {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }
  

  
`;
 

/////////////////////////////////////////



const CenterCox = styled.div`
    display: flex;
   flex-direction: column;
   align-items: center;
   position: relative;
   justify-content: center;
   margin: 0 auto;
   width: 100%;
   height: 100%;
   padding: 1em 0.9em 1em;
  
   .notactive{
    cursor: none;
    border: 2px solid #bd3333;
    opacity: 0.3;
   }

 
   .lid{
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    

    p{
        font-family: 'Inter', sans-serif;
        margin-top: 0.9em;
        max-width: 390px;
        font-size: 15px;
        color: #b8b8b8;
    }
   }

   .active{
    display: none;
   }
`;


const InformationDescription = styled.div`
 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ul{
    text-align: center;
    margin-bottom: 3em;

    h2{
      font-family: 'Europa Grotesk', sans-serif;
      color: #989aa5;
    }

    p{
      font-family: 'ProximaNova-Italic', sans-serif;
      font-size: 13px;
      color: #989aa5;
    }
  }
  
  .dkimg{
    margin-bottom: 1em;
  }
`;

 
const CardButton = styled.button`
  
  display: flex;
  align-items: center;
  background: transparent;
  justify-content: space-between;
    box-shadow: 0 0 1.5625rem rgba(12, 13, 17, 0.884);
  padding: 0.8em 1em 0.8em;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  width: 290px;
  border: 2px solid rgba(84, 88, 94, 0.164);
  font-size: 17px;
  border-radius: 52px;
  transition: 1s all;
  margin-bottom: 4em;

  
  p{
    font-family: 'Europa Grotesk';
    font-size: 16px;
    text-size-adjust: calc(1.3);
    color: #b0b0bd;
  }
   
    i{
      color: #9292a0;
    }
   img{
     filter: saturate(0);
     
   }

  &:hover{
     background-color: rgba(87, 87, 102, 0.041);
     color: #d8cdcd;
     
     img{
     filter: saturate(1);
     transform: rotate(360deg);
   }
  }
`;