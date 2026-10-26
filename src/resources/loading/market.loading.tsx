import styled from "styled-components"
 
export default function LoadingPageView () {
  return(
    <>
    <Container>
      <CardLoad>
      <Cb>
      <EventsInfoLoad/>
      </Cb>
      </CardLoad>
    </Container>
    </>
  )
 }


 /// STYLED 


const Container = styled.section`
  
   height: 100%;
   width: 100%;
   display: flex;
   place-items: center;
   justify-content: center;
   flex-direction: column;
`;


const CardLoad = styled.div`
   
 
   ul{
    text-align: center;
   }

`;


const Cb = styled.div`
   display: flex;
   align-items: center;
   height: 100%;
   width: 100%;
   justify-content: center;
   place-items: center;
`;

const EventsInfoLoad = styled.div`

border-radius: 20%;
background-size: cover;
margin-bottom: 0.9em;
animation: Load 2s infinite;
height: 25px;
width: 25px;

@keyframes Load {

0% { background-color: rgb(255, 255, 255);  }
10% { background-color: rgba(124, 121, 136, 0.247); }
40% { background-color: rgba(141, 137, 137, 0.226); }
70% { background-color: rgba(146, 146, 155, 0.233); }
80% { background-color: rgba(149, 149, 151, 0.137); }
100% { background-color: rgba(255, 255, 255, 0.041); }
}
`;