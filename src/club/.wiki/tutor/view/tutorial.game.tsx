import styled from "styled-components";
import CardTutorial from "../card";
import router from "next/router";
import ROUTENVX from "@/routes/routes";
 

export default function TutorialGame () {
    return(
        <>
    <CardTutorial
    HereImage={
        <>
        <ButtonCenter onClick={() => router.push(ROUTENVX.Dashboard)} />
        </>
    }
    children={
    <>
    <ContainerView>
         <h3>Saiba como começar a jogar</h3>
         <p>Tutorial feito para pessoa que estão com dificuldades de como jogar no servidor.</p>
    </ContainerView>
    </>
    }  />
        </>
    )
}


// styled


const ButtonCenter = styled.div`
   height: 100%;
   width: 100%;
    
   transition: 1s all;
   cursor: pointer;


`;

const ContainerView = styled.div`
    margin: 1em;

   h3{
    font-size: 18px;
    margin-bottom: 1em;
    background: linear-gradient(47deg, #e65f75 0%, rgb(241, 42, 42) 1%, #2e363d 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
   }

   p{
    color: #4c4c53bc;
    font-family: 'Inter', sans-serif;
    max-width: 320px;
    font-size: 12px;
   }

`;