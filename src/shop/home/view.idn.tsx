'use client'
 
import styled from "styled-components";

interface Props {
  Carousel: React.ReactNode;
}

export default function HomeView ({Carousel} : Props) {
    return(
        <>
        <Maxcb>
        <Container>
          {Carousel}
        </Container>
        </Maxcb>
        </>
    )
}

///  

const Maxcb = styled.div`
  margin: 3%;
`;

const Container = styled.div`

  background-color: rgba(255, 255, 255, 0.027);
  padding: 1em;
  border-radius: 12px;
  width: 100%;
`;