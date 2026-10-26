import ROUTENVX from "@/routes/routes";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import styled from "styled-components"
 


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


export default function Marginselect () {
    const router = useRouter();

    const [openlist, setopenlist ] = useState(false);

    const Handlemenu = () => {
      setopenlist(true);
    }

    const closemeu = () => {
      setopenlist(false);
    }


    return(
        <>
           <ScrollingCardUserinfo>
            <Cardbutton onClick={() => router.push(ROUTENVX.Changelogs)}>
                <i className="fi fi-bs-sparkles" />
                <h3>Atualizações</h3>
            </Cardbutton>

             
            <Cardbutton onClick={() => router.push(ROUTENVX.helpwiki)}>
                <i className="fi fi-sr-life-ring" />
                <h3>Suporte </h3>
            </Cardbutton>
  
            <Cardbutton onClick={() => router.push(ROUTENVX.problems)}>
                <i className="fi fi-bs-exclamation" />
                <h3>Problemas</h3>
            </Cardbutton>

 
               <Cardbutton onClick={() => router.push(ROUTENVX.wikijob)}>
                <i className="fi fi-br-angle-small-right" />
                <h3>Trabalhos </h3>
            </Cardbutton>

            <Cardbutton onClick={() => router.push(ROUTENVX.helpwiki)}>
                <i className="fi fi-br-angle-small-right" />
                <h3>Gangs </h3>
            </Cardbutton>
   
            <Cardbutton onClick={() => router.push(ROUTENVX.Wikiclub)}>
                <i className="fi fi-br-angle-small-right" />
                <h3>Clubvision</h3>
            </Cardbutton>
   

            <Cardbutton onClick={() => router.push(ROUTENVX.wikiorg)}>
                <i className="fi fi-br-angle-small-right" />
                <h3>Organizações</h3>
            </Cardbutton>
 
 
           
            </ScrollingCardUserinfo>


         
        </>
    )
}



////
 

const CardViewList = styled.div`

width: 100%;
margin: 5%;
margin-left: 0;
overflow-x: auto;
cursor: grab;


:active {
cursor: grabbing;
}


@media screen and (max-width: 970px){
width: 30em;
margin-left: -2em;
}

@media screen and (max-width: 460px){
 margin-top: 3em;
 width: 111%;
 padding: 0 1em 0;

 ::-webkit-scrollbar {
     display: none;
  }

 ::selection{
  display: none;
 }

}


`;


const ContentList = styled.section`

display: inline-flex;

button{
  border: 2px solid transparent;
  transition: 0.8s all;
}

button.active {
border: 2px solid rgba(255, 255, 255, 0.096); 
border-radius: 28px; 
}
`;
///


const Cardbutton = styled.button`

padding: 0.4em 1em 0.4em;
border-radius: 99px;
border: 1px solid transparent;
transition: 1s all;
margin: 0.3em;
margin-left: 0;
font-family: 'Inter', monospace;

display: flex;
align-items: center;
text-align: left;
flex-direction: row;

 

i{
 font-size: 16px;
 color: #464650;
 background-color: rgba(103, 103, 104, 0.062);
 padding: 0.4em 0.5em 0.3em;
 border-radius: 9px;
}

h3{
 color: #81818a;
 padding-left: 0.3em;
 font-family: 'Poppins', sans-serif;
 font-size: 14px;
 
}

&:hover{
    i{
      background-color: rgba(245, 16, 54, 0.973);
      color: #09090c;
      transform: scale(1.2);
    }
}

`;