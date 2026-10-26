import React, { useRef, useState } from "react";
import styled from "styled-components";


interface HorizontalScrollContainerProps {
    children: React.ReactNode;
  }
  
  const Scrollmargin: React.FC<HorizontalScrollContainerProps> = ({
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
  
  export default Scrollmargin;



  const CardViewList = styled.div`
      
    width: 100%;
    overflow-x: auto;
    position: static;
    
    cursor:  var(--f-cursor-grab);

&:active {
cursor:  var(--f-cursor-grabbed);
}

 
&::-webkit-scrollbar {
display: none;

}

&::selection{
display: none;
}

 
`;


const ContentList = styled.section`
 
    display: inline-flex;
    gap: 9px;
`;