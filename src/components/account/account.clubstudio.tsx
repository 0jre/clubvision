import styled from "styled-components"

import React from 'react';

interface Props {
    nav?: React.ReactNode;
    children: React.ReactNode;
    marginbottom?: React.ReactNode;
    
}

  
export default function Accountstudio ({nav,children,marginbottom} : Props) {

    return(
      <>
    
      <MarginPage>
 
       <MarginContent>
         {children}
       </MarginContent>

      
       {marginbottom && (
         <XC>
       {marginbottom}
       </XC>
       )}
         
   

     </MarginPage>
    
   </>
    )
}












const XC = styled.div`
 display: flex;
 flex-direction: column;

`;
 
 
const MarginPage = styled.div`
  display: flex;
  align-items: top;
  width: 100%;
  justify-content: space-evenly;
`;

const MarginContent = styled.div`
  
  width: 100%;
  justify-content: start;
  flex-direction: column;
  display: flex;
`
