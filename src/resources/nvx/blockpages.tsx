import ROUTENVX from "@/routes/routes";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ErrorRobot from '@/public/icons/mobile.png'
import FooterBv from "@/club/.vision/dashboard/home/header/footer";
import AccountNvxre from "@club/components/account/account.user";
import HeadGlobal from "@/club/head/glob.n";
 
interface BlockPagesViewProps {
    onClose: () => void; // Defina a prop onClose com o tipo correto
  }
export default function BlockPagesVIew ({onClose} : BlockPagesViewProps) {
   
        const router = useRouter();
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
  
        const [isLoading, setIsLoading] = useState(true);
        useEffect(() => {
          // Simulando uma requisição que leva 3 segundos para completar
          const timer = setTimeout(() => {
            setIsLoading(false);
          }, 9000);
          return () => clearTimeout(timer);
        }, []);
    return (
      <>
      <HeadGlobal Title='Acesso negado'/>
     <AccountNvxre about="Acesso negado" />
    <ModalWrapper>
    <Container>
      
         <Image src={ErrorRobot} alt='problema aqui!' height={300}/>
        <Content>
           <h2>Você não pode acessar, usando um celular!</h2>  
         <Button href={ROUTENVX.Dashboard}>
         Sair Agora
         </Button>
         <p>Para conseguir usar o clubvision. Acesse o site usando seu computador!</p>
        </Content>
         </Container>
    </ModalWrapper>
     
     <FooterBv />
    </>
   );
  }



  
const Container = styled.section`
margin: 0 auto;
max-width: 850px;
text-align: center;
color: #1d1b1b;

p{
 font-size: 11px;
 color: #4d4e55;
}
`;
 


const Content = styled.ul`
display: flex;
flex-direction: column;
align-items: center;

h3{
 margin-bottom: 1em;
 font-size: 27px;
 color: aliceblue;
}

p{
  font-size: 14px;
}

.right{
 transform: rotate(-34deg);
 height: 190px;
 width: 190px;
 float: right;
 margin-right: -33em;
 margin-top: -10.5em;
}

@media screen and (max-width: 430px) {
  p{
    max-width: 340px;
    font-size: 11px;
  }
}
`;



const Button = styled.a`
  margin: 2em;
 background-color: rgba(26, 247, 110, 0.986);
 padding: 0.8em 4em 0.8em;
 border-radius: 52px;
 color: black;
 font-family: 'Europa Grotesk';
 border: 2px solid transparent;
 transition: 0.9s all;

 &:hover{
   position: relative;
   top: -1px;
   border: 2px solid rgba(91, 86, 105, 0.329);
   background: transparent;
   color: rgba(129, 128, 138, 0.459);
 }
`;


const ModalWrapper = styled.div`
  display: flex;
    flex-direction: column;
    place-items: center;
    justify-content: center;
    align-items: center;
    place-items: center;
    height: 100%;
    margin-top: 14%;
    width: 100%;
    
    h2{
      max-width: 430px;
      text-align: center;
      color: #99a8a0;
      font-family: 'Europa Grotesk';
    }

    p{
      font-size: 12px;
      color: #575963;
    }
`;

