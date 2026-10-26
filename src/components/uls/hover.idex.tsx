import * as HoverCard from "@radix-ui/react-hover-card";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  title: React.ReactNode;
}

export default function Tooltip({ title, children }: Props) {
  const [side, setSide] = useState<"left" | "right">("right");
  const triggerRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const updateTooltipSide = () => {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;

      // Se o elemento está muito próximo da borda direita, mostrar à esquerda
      if (rect.right + 150 > windowWidth) {
        setSide("left");
      } else {
        setSide("right");
      }
    };

    updateTooltipSide();
    window.addEventListener("resize", updateTooltipSide);
    
    return () => {
      window.removeEventListener("resize", updateTooltipSide);
    };
  }, []);

  return (
    <HovercardContainer>
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <ul ref={triggerRef}>{children}</ul>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className="HoverCardleft" side={side} sideOffset={8}>
            <HovercardContent>
              <ContentAboutT>
                <li>
                  <h5>{title}</h5>
                </li>
              </ContentAboutT>
            </HovercardContent>
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </HovercardContainer>
  );
}



////
 
 
const ContentAboutT= styled.div`
    
  li{
    display: flex;
    flex-direction: row;

    h5{
       font-family: 'Inter';
  font-weight: 200;
  color: #858686;
 
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
        z-index: 1892;
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
 
  background-color: rgb(28, 29, 28);
  padding: 0.3em 1em 0.3em;
  border: 1px solid rgba(221, 221, 221, 0.089);
  border-radius:7px;
  
  transition: opacity 0.2s ease-in-out;
  
`;