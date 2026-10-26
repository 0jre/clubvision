import React from "react";
import styled from "styled-components";
 
interface CardInfoProps { 
    convite: React.ReactNode;
    ownership: React.ReactNode;
    status: React.ReactNode;
    redirect: React.ReactNode;
    prime: React.ReactNode;
}

export default function UserTafconvite ( { convite,ownership,status,redirect,prime } : CardInfoProps ) {
    return (
        <>
        <CardInfo>
            <Contentuser>
                <h3>{convite}</h3>
                <h3>{ownership}</h3>
                <h3>{status}</h3>
                <h3>{prime}</h3>
                <h3>{redirect}</h3>
            </Contentuser>
        </CardInfo>
        </>
    )
}


/// sty

const CardInfo = styled.div`
  width: 100%;
  background-color: rgba(66, 66, 68, 0.103);
  margin-bottom: 0.5em;
  border-radius: 7px ;

`;


const Contentuser = styled.ul`
   display: flex;
   align-items: center;
   justify-content: space-between; 

   h3{
    font-size: 13px;
    font-weight: 500;
    color: #86868f;
    margin: 0;
    font-family: 'Inter', monospace;
    padding: 10px 0;
    width: 20%;
    text-align: center;
    text-transform: uppercase;
   }
 
`;
