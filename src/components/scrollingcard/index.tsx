import React, { useRef, useState } from "react";
import styled from "styled-components";


interface HorizontalScrollContainerProps {
    children: React.ReactNode;
  }
  
  const ScrollingCardUserinfo: React.FC<HorizontalScrollContainerProps> = ({
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
        <ContentList >{children}</ContentList>
      </CardViewList>
    );
  };
  
  export default ScrollingCardUserinfo;



  const CardViewList = styled.div`
    
    background-color: rgba(209, 209, 214, 0.021);
    padding: 1em;
    border-radius: 12px;
    width: 40em;
    margin-bottom: 2em;
    overflow-x: auto;
    cursor:  var(--f-cursor-grab);

:active {
cursor:  var(--f-cursor-grabbed);
}


  @media screen and (max-width: 970px){
    width: 30em;
    margin-left: -2em;
    }
`;


const ContentList = styled.section`

    display: flex;
    flex-direction: row;
    align-items: center;
     
`;