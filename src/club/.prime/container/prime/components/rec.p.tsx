
import Image from "next/image";
import React from "react";
import styled from "styled-components";
 
interface CardInfoProps { 
    Recurso: React.ReactNode;
}

export default function InfoRecurso ( { Recurso, } : CardInfoProps ) {
 
    return (
        <>
            <Contentuser>
              <ul>
                <text>
                <Image src={'/icons/smeralda.svg'} alt="smeralda novision" height={20} width={20} />
                <h5 className='h5'>{Recurso}</h5>
                </text>
                 
                <li>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
                </li>
              </ul>
            </Contentuser>
        </>
    )
}


 
const Contentuser = styled.div`
  width: 100%;
 
 
   h3{
    font-weight: 500;
    margin: 0;
    font-size: 28px;
    color: #d2dcdd;
     font-family: 'XcSemibold', sans-serif;
    padding: 10px 0;
    width: 20%;
   }
 

   .h5{
    font-weight: 500;
    color: #c2c2ca;
    margin: 0;
    font-size: 14px;
    font-family: 'XcSemibold', sans-serif;
    
   }
 

   p{
    font-family: 'ProximaNova-';
    font-size: 12px;
    font-weight: 200;
    text-align: start;
    color: rgb(164, 170, 175);
    max-width: 460px;
   }

   ul{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0;
    margin-top: -1em;
  
   }


   text{
    display: flex;
    align-items: center;

    h5{
      padding-left: 0.5em;
    }
   }
`;
