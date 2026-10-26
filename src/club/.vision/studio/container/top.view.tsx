import React from "react";
import styled from "styled-components";
import { Button } from '@mui/joy';

interface PropsUser {
   AvatarUser?: React.ReactNode;
   ButtonX?: React.ReactNode;
   ButtonY?: React.ReactNode;
   stats?: React.ReactNode;
}

export default function TopViewStudio ({stats,ButtonY, AvatarUser, ButtonX}: PropsUser) {

    return(
        <>
        <ContainerTop>
        <Contentuser>
        {ButtonX}
        {AvatarUser}
        {ButtonY}
        {stats}
        </Contentuser>
        </ContainerTop>
        </>
    )
}


const ContainerTop = styled.nav`
  position: fixed;
  width: 100%;
  padding: 0.9em 4% 0.9em;
  border-radius: 29px;
 
`;

const Contentuser = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  button{
    height: 38px;
    width: 38px;
    padding: 0.2em;
    border-radius: 50%;
    background-color: rgba(24, 24, 26, 0.233);
    font-family: 'Inter', monospace;
    font-size: 18px;
    color: #979a9c;

    i{
      color: #979a9c;
    }

    &:hover{
      background-color: rgba(245, 26, 26, 0.3);
    }
  }

`;


