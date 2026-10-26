import styled from "styled-components"
import React from 'react';

export default function DashboardPage({MarginPost} : {MarginPost: React.ReactNode}) {
    return (
      <>   
      <MainDashboardN> 
        {MarginPost}
      
       </MainDashboardN>
      </>
    );
  }

const MainDashboardN = styled.section`
  
  margin: 0 auto;
 
 
  border-radius: 19px;
  margin-bottom: 1em;
  width: 100%;
  display: grid;
  flex-direction: column;
  animation: PageAnim 0.8s linear;
 
  @keyframes PageAnim {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }
  @media screen and (max-width: 430px){
  margin-left: 0;
  width: 100%;
  } 
`;

const Anim = styled.div`
 animation: PageAnim 0.8s linear;

@keyframes PageAnim {
  0%{ opacity: 0;}
  100%{ opacity: 1;}
}



@media screen and (max-width: 430px) {
   
   &:hover{
     .none{
      display: none;
   }
   }
  }
 
`;
