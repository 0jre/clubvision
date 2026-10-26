import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styled from "styled-components";
import ROUTENVX from "@/routes/routes";
import router from "next/router";


interface ImagePropA {
    ImageProp: string;
  }
  

export default function ConnectAccount() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Verifica se o cookie existe, caso sim, oculta o componente
    const isClosed = Cookies.get("connectAccountClosed");
    if (isClosed) {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Define um cookie que expira em 30 dias
    Cookies.set("connectAccountClosed", "true", { expires: 30 });
  };

  if (!isVisible) {
    return null; // Não renderiza o componente se estiver fechado
  }

  return (
    <Container>
      <CardInfo>
        <LeftWas ImageProp={"/theim/characters/cart899449-87445.png"} />
        <li className="djs">
          <h1>SEJA CLUB PREMIUM</h1>
          <p>Com o Prime ativado você tem acesso completo aos recursos do thenovision.</p>
         
         <ul>
         <button onClick={handleClose}>
            CANCELAR 
          </button>
         <button onClick={() => router.push(ROUTENVX.centralpremium)}>
            ASSINAR AGORA
          </button>
         </ul>
        </li>
      </CardInfo>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  bottom: 3em;
  right: 0;
  z-index: 9283;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  align-items: center;
  max-width: 340px;
  text-align: center;
  margin: 1em;
  background: linear-gradient(
      204deg,
      #12131240 -7%,
      #b85cff00 33%
    ),
    linear-gradient(162deg, #f711ec40 -10%, #2c88dd00 25%),
    linear-gradient(0deg, #0e0e11, #0e0e11);
  padding: 3em 1em 0.8em;
  border-radius: 9px;
  animation: Cvx 1s linear;

  h1 {
    font-family: 'XcSemibold';
    background: linear-gradient(rgb(213, 213, 213) 0%, rgb(32, 37, 34) 100%)
      text;
    font-size: 24px;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 12px;
    color: #a6abb4;
    font-family: 'ProximaNova-Italic', monospace;
  }

  button {
    background: url(/icons/button/button-bg.svg) center center / contain no-repeat;
    box-sizing: border-box;
    color: #36373b;
    display: inline;
    font-family: 'XcSemibold';
    list-style: none;
    padding: 0.6em 1em 0.6em;
    border-radius: 19px;
    margin: 0.8em;
    position: relative;
    text-align: center;
    text-decoration: none;
    white-space: pre-wrap;
    word-wrap: break-word;
    transition: 1s all;

    &:hover {
      color: #b2b4be;
    }
  }

  @keyframes Cvx {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0%);
    }
  }
`;

const LeftWas = styled.div<ImagePropA>`
  background-image: ${({ ImageProp }) => `url('${ImageProp}')`};
  background-position: center;
  height: 190px;
  width: 100%;
  top: -76%;
  bottom: 0;
  position: absolute;
  background-size: 90%;
  z-index: 19;
  background-repeat: no-repeat;
`;
