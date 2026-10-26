import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components"
import TopViewStudio from '../container/top.view';
import PostVisionAdd from '../sess/postvision.s';
import VideoVisionAdd from '../sess/video.x';
import ROUTENVX from "@/routes/routes";
import router from 'next/router';

interface PropUser{
    AvatarUser: React.ReactNode;
    ButtonY?: React.ReactNode;
    stats?: React.ReactNode;
    activecontract: React.ReactNode;
}

export default function OpenStudioModal( {activecontract,stats,ButtonY,AvatarUser}: PropUser) { 
    
     const [OpenX, setOpenX] = React.useState(true);
     const [OpenY, setOpenY] = React.useState(false);
     const [OpenZ, setOpenZ] = React.useState(false);

     const OpenModalX = () => {
        setOpenX(true);
        setOpenY(false);
        setOpenZ(false);
     }

        const OpenModalY = () => {
            setOpenY(true);
            setOpenX(false);
            setOpenZ(false);
        }

        const OpenModalZ = () => {
            setOpenZ(true);
            setOpenY(false);
            setOpenX(false);
        }

    return(
        <>
        <ContainerWrapper>
      
         {OpenX && (
            <>
              <TopViewStudio  
        ButtonY={ButtonY}
        stats={stats}
        />
         <ContainerNs>
         <CenterContent>
            <ContainerImageLeft>
                 
         <ScrollingCardUserinfo>
                  <CardRedirect onClick={OpenModalY} bannerUrl={'/theim/backgrounds/ninubinuoikmnjbu.jpg'}>
                    
                  <li>
             <h2>VISIONPOST</h2>
             <h5>CLUBVISION</h5>
            </li>
                     
                  </CardRedirect>

                  <CardRedirect onClick={OpenModalZ} bannerUrl={'/theim/backgrounds/ninubinuoikmnjbu.jpg'}>

                  <li>
             <h2>VISIONVIDEO</h2>
             <h5>CLUBVISION</h5>
            </li>
                     

                   
                  </CardRedirect>


                  <CardRedirect onClick={() => router.push(ROUTENVX.clubr)} bannerUrl={'/theim/backgrounds/23bda220baa20887a159b9839ac3a71802df3b42347nhsdf.jpg'}>

                  <li>
             <h2>CLUBSTUDIO</h2>
             <h5>CLUBVISION</h5>
            </li>
                     
                  </CardRedirect>
                  </ScrollingCardUserinfo>
            </ContainerImageLeft>
        
         </CenterContent>
       
         </ContainerNs>
           </> 
         )}


         {OpenY && (
            <>
            <TopViewStudio  
         ButtonX={
            <>
                
            <button onClick={OpenModalX}>
          <i className="fi fi-br-arrow-left" />
        </button>
            </>
        } 
        AvatarUser={AvatarUser}/>
            <PostVisionAdd activecontract={activecontract}/>
            </>
         )}


  {OpenZ && (
            <>
            <TopViewStudio  
         ButtonX={
            <>
                
            <button onClick={OpenModalX}>
          <i className="fi fi-br-arrow-left" />
        </button>
            </>
        } 
        AvatarUser={AvatarUser}/>
            <VideoVisionAdd activecontract={activecontract}/>
            </>
         )}

        </ContainerWrapper>
        </>
    )
}





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

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;

        if (scrollLeft <= 0) {
          // Move items to the end when scrolling to the beginning
          container.scrollLeft = scrollWidth;
        } else if (scrollLeft + clientWidth >= scrollWidth) {
          // Move items to the beginning when scrolling to the end
          container.scrollLeft = 0;
        }
      }
    };

    containerRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <CardViewList
      style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
    >
       
        {children}
     
    </CardViewList>
  );
};


const CardViewList = styled.div`
 
width: 100%;
overflow-x: auto;
padding: 1em 5em 1em;
display:inline-flex;
transition: 1s all;
cursor:  var(--f-cursor-grab);

:active {
cursor:  var(--f-cursor-grabbed);
}

 
`;





const ContainerWrapper = styled.div`
   background: radial-gradient(circle, #0b0c0ec8 0%, rgba(3, 4, 5, 0.815) 100%), url('/web/hdshfioef.png') !important;
   backdrop-filter: blur(4px);
  background-repeat: no-repeat;
  background-size: cover;      
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  position: fixed;
  z-index: 1999;
  padding: 0.3em;

 
  
`;

 

const ContainerImageLeft = styled.div`
   

   .MarginLogo{
    display: flex;
    align-items: center;
    margin: 6%;

     .logo{
        border-radius: 50%;
        height: 50px;
        width: 50px;
     }

    h2{
        color: #e7eaec;
        margin-left: 10px;
        font-size: 38px;
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
    }
   }
`;

const ContainerNs = styled.div`
  display: flex;
 justify-content: center;
 align-items: center;
  place-items: center;
  height: 100%;
  width: 100%;
`;


const  CenterContent = styled.div`
 
 
 display: flex;
 align-items: center;
 justify-content: center;
 flex-direction: row;
`;


interface ViewHeaderProps {
    bannerUrl: string;
}
  

const CardRedirect = styled.div<ViewHeaderProps>`
 
height: 450px;
width: 380px;
padding: 0.4em 1em 0.4em;
border: 2px solid #1d1f1e;
margin: 0.4em;
background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
background-position: center;
background-size: cover;
background-repeat: no-repeat;
border-radius: 12px;
 
filter: saturate(0);
transition: 1s all;


&:hover{
 filter: saturate(1);
 cursor:  var(--f-cursor-pointer);;
 border: 2px solid #2e302f;
}

  
 
    h2{
     font-family: 'XcSemibold', sans-serif;
     font-size: 27px;
     color: #02ff81;
    }


    h5{
      font-family: 'ProximaNova-Italic', monospace;
      font-size: 12px;
      color: white;
    
    }


    li{
        margin-top: 100%;
        position:absolute;
    }

  
`;