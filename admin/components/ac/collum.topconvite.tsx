import React from "react";
import styled from "styled-components";



export default function UserCollumconvite () {
    
    return (
        <>
        <ContainerCollum>
        <Contentuser>
           <h3>CONVITE</h3>
            <h3>OWNERSHIP</h3>
            <h3>STATUS</h3>
            <h3>PRIME</h3>
            <h3/>
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
    font-size: 13px;
    font-weight: 300;
    color: #4c4c50;
    margin: 0;
    font-family: 'Inter', monospace;
    padding: 10px 0;
    width: 20%;
    text-align: center;
  }
`;