import * as React from 'react';
import TheNoVision from './novision';
import styled from 'styled-components';
import { useEffect } from 'react';
import router from 'next/router';
import ROUTENVX from '@/routes/routes';

export default function ModalConnectNoVrp() {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    // Verifica se a query string ?suporte=true está presente na URL
    if (router.query.city === 'novision') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [router.query.city]);


  return (
    <div>
     <CardList onClick={() => router.push(ROUTENVX.connectio)}>
     CONECTAR NO GAME
     </CardList>
  
  {(open || router.query.city === 'novision') && (
   <Modal
   isOpen={open || router.query.city === 'novision'}
   >
   <TheNoVision />
 </Modal>
  )}
      
    </div>
  );
}

 

const CardList = styled.button`
  background-color: rgb(31, 226, 96);;
   background-image: url('/icons/CrownEffect.png');
   padding: 1em 2em 1em;
   border-radius: 48px;
   font-size: 16px;
   font-family: 'Europa Grotesk';
   box-shadow: -11px 18px 1px black;
   color: #000201ed;
   margin-top: 4em;
   position: relative;
  z-index: 1;
   transition: 1s all;
   border: 2px solid transparent;
   
   &:hover{
    box-shadow: -1px 13px 11px black;
    transform: scale(1.1);
    border: 2px solid #110f0f2b;
   }
 

   @media screen and (max-width: 280px){
      margin-left: -6em;
      font-size: 13px;
  }
`;

const Modal = styled.div<any>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  align-items: left;
 padding: 1em;
 text-align: left;
 background-color: rgba(24, 26, 25, 0.774);
  z-index: 9120;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  justify-content: end;

`;