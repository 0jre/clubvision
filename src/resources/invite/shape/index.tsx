import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import Logo2 from '@/public/nvrp/20221001_185012.png'
import styled from "styled-components";
import Link from "next/link";
import ROUTENVX from "@/routes/routes";

interface Props {
    code: string;
    name: ReactNode;
    Avatar: ReactNode;
    status: ReactNode;
}


export default function InviteTicketCode({code, name, Avatar, status} : Props) {
  
    const cardRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (cardRef.current) {
    let rotation = 0;
    const animateRotation = () => {
      rotation += 0.5; 
      if (cardRef.current) {
        cardRef.current.style.transform = `rotateY(${rotation}deg)`;
      }
      requestAnimationFrame(animateRotation);
    };

    animateRotation();
  }
}, []);

    return(
        <>
         <main>
    <section className="ticket" ref={cardRef}>
        <header className="front">
            <div className="holo"></div>
            <Image 
            className="logo44"
           src={Logo2} alt="" height={70} width={150}/>
            <aside className="divider"></aside>
        </header>
        <section className="back">
            <div className="holo"></div>
            
             <ContentIm>
            <div className="data">
                <h3 className="tirle">Convidado</h3>
                <p contentEditable spellCheck='false' className="tirle2">
                 Pass Ticket 
                </p>
                <h3 className="tirle">Status Convite</h3>
                <p contentEditable spellCheck='false' className="tirle2">
                    {status}
                </p>
                <h3 className="tirle">Convite</h3>
                <p contentEditable spellCheck='false' className="tirle2">TheNoVision</p>
                
                <li>
                   <h5 className="font">
                   Faça parte daquilo que desafia as limitações do comum e traz a verdadeira visão do que é imersão real.
                   </h5> 
                </li>
                
        
            </div>

            <aside className="divider">
                <div className="username">
                   {Avatar}
             <span contentEditable spellCheck='false'>
               {name} 
            </span>  
                </div>
            <Link href={`/?code=active-novision&invite=${code}`}>
            <span className="usernum" contentEditable spellCheck='false'>
             <h6>{code}</h6>
                </span>
            </Link>
            </aside>
            </ContentIm>
        </section>
    </section>
    </main>
        </>
    )
}


const ContentIm = styled.ul`
 
   h3{
    font-family: 'Yantramanav', sans-serif;
    font-size: 15px;
    color: #777680;
   }
   
   p{
     color: #e4e3f1;
     font-size: 23px;
      
   }


   li{
    
    .font{
    font-size: 11px;
    color: #e4e3f1;
    }
   }

   h6{
    backdrop-filter: blur(29px);
    border: 2px solid #1f1e1e1c;
    border-radius: 12px;
    color: #e4e3f1;
    padding: 0.3em 2em 0.3em;
    font-size: 11px;
   }
`;