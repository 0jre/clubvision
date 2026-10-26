import styled from "styled-components";
import TutorialWebView from "./view/tutorial.web";
import TutorialWebStore from "./view/tutorial.store";
import TutorialGame from "./view/tutorial.game";


export default function TutorialViwer () {
    return(
        <>
        <ContainerCenterPage>
        <TutorialWebView />
        <TutorialWebStore />
        <TutorialGame />
        </ContainerCenterPage>
        </>
    )
}



const ContainerCenterPage  = styled.section`
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: center;
   flex-wrap: wrap;
   margin-top: 3em;
   border-radius: 2em;
`;