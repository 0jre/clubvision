import * as HoverCard from '@radix-ui/react-hover-card';
import React from 'react';
import styled from "styled-components";


interface Props {
    button: React.ReactNode;
    Title: React.ReactNode;
    description: React.ReactNode;
}
export default function Infocard ({ description,Title,button } : Props) {
    return(
        <>
        <HovercardContainer>
       <HoverCard.Root>
       <HoverCard.Trigger asChild>
        <ul>
        {button} 
        <i className='fi fi-br-info' />
        </ul>
        </HoverCard.Trigger>
          <HoverCard.Portal>
      <HoverCard.Content className="HoverCardleft" sideOffset={2}>
      <HovercardContent>
           <ContentAboutT>
              <li>
                <h5>{Title}</h5>
              </li>

              <p>{description}</p>
              </ContentAboutT>
           </HovercardContent>
      </HoverCard.Content>
      </HoverCard.Portal>
  </HoverCard.Root>
  </HovercardContainer>
        </>
    )
}


////
 
 
const ContentAboutT= styled.div`
    
  li{
    display: flex;
    flex-direction: row;

    h5{
      margin-left: 0.7em;
      color: #6a6c6d;
      font-size: 13px;
    }

    i{
      color: #3d3f41;
    }
  }

  p{
    font-size: 11px;
    color: #52565a;
  }

`;


const HovercardContainer = styled.div`
cursor: auto;

display: flex;
align-items: center;
flex-direction: row;
 
animation: Sidebarns 0.2ms linear;
 
   @keyframes Sidebarns {
    from { 
     opacity: 0.3;
     transform: translateX(-100%);
  }
   }
    
     ul{
        display: flex;
        align-items: center;
     }

     i{
         
        cursor: pointer;
        color: #4d4e52;
        padding-left: 0.5em;
        padding-top: 0.3em;
     }

    
    
`;


const HovercardContent = styled.div`
  flex-flow: center;
  z-index: 1999;
  width: 18em;
  margin-left: 4.4em;
  margin-top: -7em;
  background-color: rgb(7, 7, 7);
  box-shadow: 0 2px 4px rgba(148, 149, 158, 0.055);
  padding: 10px;
  border: 1px solid rgba(221, 221, 221, 0.089);
  border-radius: 12px;
  transition: opacity 0.2s ease-in-out;
  
`;