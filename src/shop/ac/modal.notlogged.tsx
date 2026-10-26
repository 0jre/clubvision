'use client'
import ROUTENVX from "@/routes/routes";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import styled from "styled-components";


export default function NotLogged () {
  const router = useRouter();
    return(
          <Container onClick={() => router.push(ROUTENVX.login)}>
        <Content>
        <ul> 
      
        <CardInfo>
           <LockClosedIcon className="h-16 transition-all ease-in-out hover:scale-110 icon" />
          </CardInfo>
          
            </ul>
     

          <BottomView>
                <h6>© thenovision · <a href="/legal/policy"> Política de Privacidade</a>   · <a href="/legal/terms">Termos de serviço</a>  · Português (Brasil)</h6>
                <h4>Parece que você não realizou o login em sua conta. Faça o login e volte aqui para fazer suas compras!!</h4>
            </BottomView>
          </Content>
        </Container>
    )
}


/////////////

const BottomView = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 28px;
  
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
 height: 100vh;
 width: 100vw;
 left: 0;
 right: 0;
 z-index: 99;
 top: 0;
 overflow-y: auto;
 bottom: 0;
 backdrop-filter: blur(23px);
 background: radial-gradient(circle, #0b0c0eed 0%, rgba(7, 8, 11, 0.925) 100%), url('/web/hdshfioef.png');
    background-repeat: no-repeat;
    background-size: cover;
 display:flex;
 justify-content: center;
 place-content: center;
 animation: Opacitxy 0.9s linear;


  @keyframes Opacitxy {
    0%{ opacity: 0;}
    100% { opacity: 1;}
  }
`;

const Content = styled.div`
  margin-top:18%;
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
 
const CardInfo = styled.div`
 padding: 0.9em 1em 0.9em;
 border-radius: 19px;
 margin: 4%;
  
 .icon{
    font-size: 59px;
    color: rgb(68, 68, 73);
 }
  
`;
 