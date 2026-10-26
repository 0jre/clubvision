import styled from "styled-components";


interface Thumb {
    thumbnail: React.ReactNode; 
  }



export default function HeaderwIK ({Title,thumb} : {Title: React.ReactNode,thumb: React.ReactNode}) {
    return(
        <Container thumbnail={thumb}>
          <Content>
             <h3>
                {Title}
             </h3>
          </Content>
        </Container>
    )
}

/// 


 
const Container = styled.header<Thumb>`

background-image: ${({ thumbnail }) => `url('${thumbnail}')`};
background-color: rgb(8, 8, 17);;
background-size: cover;
background-repeat: no-repeat;
background-position: center;
border-radius: 11px; 
background-position-y: -18em;
height: 40vh;
width: 100%;
margin: 0.3em;
transition: 1s all; 

&:hover{
  border-radius: 19px; 

}
@media screen and (max-width: 430px) {
    margin-top: 2em;
   }
`;


const Content = styled.div`

  width: 100%;
  display: flex;
  justify-content: start;
  place-items: center; 
  height: 100%; 
  padding: 0 2em 0;
  border-radius: 11px; 
   background: linear-gradient(77deg, rgba(0,0,0,1) 0%, rgba(255,0,56,0) 100%);
  backdrop-filter: blur(1px);

   h3{
    font-family: 'Europa Grotesk';
    background: linear-gradient(47deg, #e65f75 0%, rgb(214, 201, 201) 1%, #2e363d 100%);
    -webkit-background-clip: text;  
    font-size: 34px;
    max-width: 450px;
    -webkit-text-fill-color: transparent;
   }

   @media screen and (max-width: 430px) {
    h3{
      font-size: 24px;
    }
   }
`;
