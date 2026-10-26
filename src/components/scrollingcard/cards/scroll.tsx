import React, { useRef, useState } from "react";
import styled from "styled-components";


interface HorizontalScrollContainerProps {
    children: React.ReactNode;
    Title: React.ReactNode;
  }
  
  const ScrollStreamersCard: React.FC<HorizontalScrollContainerProps> = ({
    children, Title
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
        <h3>{Title}</h3>
        <ContentList >{children}</ContentList>
      </CardViewList>
    );
  };
  
  export default ScrollStreamersCard;



  const CardViewList = styled.div`
    
    background: linear-gradient(129deg, rgb(0, 0, 0) 27%, rgba(48,50,62,0) 50%, rgba(0,0,0,0.17130602240896353) 80%);
    padding: 0.8em;
    border-radius: 6px;
    width: 100%;
    max-height: 30%;
    margin: 0.8em;
    border-radius: 22px;
    overflow-x: auto;
 
    display: flex;
    flex-direction: column;
    cursor:  var(--f-cursor-grab);

:active {
cursor:  var(--f-cursor-grabbed);
}


  @media screen and (max-width: 970px){
    width: 30em;
    margin-left: -2em;
    }


    h3{
      font-size: 19px;
      color: #565561df;
      margin-bottom: 0.9em;
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(47deg, #e65f75 0%, rgb(80, 255, 188) 1%, #2650f7 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    }
`;


const ContentList = styled.section`

    display: flex;
    flex-direction: row;
    align-items: center;
    
     
`;