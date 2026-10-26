import styled from "styled-components";
import * as React from "react"
import Image from "next/image";
import Clublogo from '@/public/nvrp/club_logo.png'
import NVRP from '@/public/nvrp/20221001_185012.png'


export default function UserCollum () {
    
    return (
        <>
        <ContainerCollum>
        <Contentuser>
           <h3>Recursos</h3>
            <h3><Image src={NVRP}  alt="novision" height={30}/></h3>
            <h3><Image src={Clublogo}  alt="novision" height={30}/></h3>
          
        </Contentuser>
        </ContainerCollum>
        </>
    )
}


///// collum

const ContainerCollum = styled.section`
  width: 100%;
  border-bottom: 1px solid rgba(38, 37, 41, 0.376);
`;

const Contentuser = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
  h3{
    font-size: 17px;
    font-weight: 300;
    color: #c6c6d3;
    margin: 0;
    font-family: 'Inter', monospace;
    padding: 10px 0;
    text-align: center;
  }

  i{
    font-size: 16px;
    color: #a3a3ad;
    height: 35px;
    padding: 0.3em 0.8em 0.3em;
    background-color: rgba(37, 37, 41, 0.185);
    width: 35px;
    border-radius: 9px;
  }

  @media screen and (max-width: 540px) {
    img{
      height: 30px;
    }
  } 
`;