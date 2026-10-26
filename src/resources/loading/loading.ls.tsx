import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";

// Importe os ícones SVG
import Ak47Icon from "@/public/icons/loading/ak47.svg";
import BrassKnucklesIcon from "@/public/icons/loading/brass-knuckles.svg";
import GrenadeIcon from "@/public/icons/loading/grenade.svg";
import GunIcon from "@/public/icons/loading/gun.svg";
import DaggerIcon from "@/public/icons/loading/dagger.svg";
import Image from "next/image";

// Lista de ícones
const icons = [Ak47Icon, BrassKnucklesIcon, GrenadeIcon, GunIcon, DaggerIcon];

export default function LoadingPageView() {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  // Mudar o ícone a cada 1 segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }, 1000); // Ajuste o tempo conforme a necessidade

    return () => clearInterval(interval);
  }, []);

 
  return (
    <Container>
      <CardLoad>
        <Cb>
          <EventsInfoLoad>
            <Image className="Incons" src={icons[currentIconIndex]} alt="loading"  />
          </EventsInfoLoad>
        </Cb>
        
      </CardLoad>
    </Container>
  );
}

// Styled Components

const Container = styled.section`
  height: 100%;
  width: 100%;
  display: flex;
  place-items: center;
  justify-content: center;
  flex-direction: column;
`;

const CardLoad = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Cb = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const EventsInfoLoad = styled.div`
  border-radius: 20%;
  margin-bottom: 0.9em;
  animation: ${pulseAnimation} 2s infinite;
  height: 100px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  .Incons{
    width: 100%;
    height: 100%;
  }
`;
