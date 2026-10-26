import React, { useRef, useState } from "react";
import styled from "styled-components";


interface HorizontalScrollContainerProps {
    children: React.ReactNode;
  }
  
  const ScrollUsersCard: React.FC<HorizontalScrollContainerProps> = ({
    children,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
      if (!isModalOpen) {
        setIsDragging(true);
        setStartX(e.clientX);
        setScrollLeft(containerRef.current!.scrollLeft);
      }
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
    
      if (!isModalOpen) {
        e.preventDefault();
        const x = e.clientX - startX;
        const walk = x * 1; 
        containerRef.current!.scrollLeft = scrollLeft - walk;
      }
    };
  

    const handleMouseUp = () => {
      setIsDragging(false);
    };
  
   
    return (
      <CardViewList
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        ref={containerRef}
      >
 
        <ContentList >

            {children}
            </ContentList>
      </CardViewList>
    );
  };
  
  export default ScrollUsersCard;



  const CardViewList = styled.div`
     
    padding: 0.8em;
    border-radius: 6px;
    width: 100%;
    border-radius: 100px;
    overflow-x: auto;
    cursor:  var(--f-cursor-grab);

:active {
cursor:  var(--f-cursor-grabbed);
}

 
   
    p{
        font-size: 11px;
        color: #9ba1a5;
        text-align: left;
        margin-bottom: 0.2em;
    }
`;


const ContentList = styled.section`
 
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
    -webkit-flex-direction: row-reverse;
    -ms-flex-direction: row-reverse;
    flex-direction: row-reverse;
    --chakra-space-x-reverse: 1;
    --chakra-divide-x-reverse: 1;
     
`;