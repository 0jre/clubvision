import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Listv {
    badge: any;
    nbadge: any
    selectid: any;
}

export default function TrrailList ({nbadge, badge, selectid} : Listv) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  // Definindo que o código está sendo executado no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    setMousePosition({
      x: clientX,
      y: clientY,
    });
  };

  useEffect(() => {
    if (isClient) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isClient]);

  if (!isClient) {
    return null; // Não renderiza o componente até que o lado do cliente esteja pronto
  }

  // Calculando o efeito de rotação com base na posição do mouse
  const rotationX = (mousePosition.y - window.innerHeight / 2) / 20;
  const rotationY = (mousePosition.x - window.innerWidth / 2) / 20;

    return(
  <Container>
    <InnerWrapper>

      <ProfileImageWrapper>
      <CardContainer>
     <ImageWrapper   className={selectid ? "aact" : 'notacct'}>
      <Image
        className={selectid ? " " : 'isnotactive'}
        style={{
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
        src={badge?.badge}
      />
    </ImageWrapper>
    <GlareWrapper>
      <Glare />
    </GlareWrapper>
  </CardContainer>
        <Title>{badge?.namebadge}</Title>
      </ProfileImageWrapper>
      <BoxWrapper>
        <Text>Informações:</Text>
        <TraitWrapper>
          <TraitBox>
            <TraitDetails>
              <TraitName>Level </TraitName>
              <TraitValue>{badge?.level}</TraitValue>
            </TraitDetails>
          </TraitBox>
          <TraitBox>
            <TraitDetails>
              <TraitName>Raridade</TraitName>
              <TraitValue>{badge?.rarity}</TraitValue>
            </TraitDetails>
          </TraitBox>
          <TraitBox>
            <TraitDetails>
              <TraitName>Quantidade</TraitName>
              <TraitValue>{nbadge}/{badge?.quantity}</TraitValue>
            </TraitDetails>
          </TraitBox>
          <TraitBox>
            <TraitDetails>
              <TraitName>Valor de mercado</TraitName>
              <TraitValue>{badge?.price} Bits</TraitValue>
            </TraitDetails>
          </TraitBox>
        </TraitWrapper>
      </BoxWrapper>
    </InnerWrapper>
  </Container>
);
}


interface ViewHeaderProps {
    src: string;
  }
   

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  padding: 0 2rem;
  overflow: auto;
  border-left: 1px solid #292626;
`;

const InnerWrapper = styled.div`
  width: 100%;
  @media (min-width: 768px) {
    width: 396px;
  }
`;




const CardContainer = styled.div`
  position: relative;
  width: 276px;
  height: 276px;
  border-radius: 50%;
  border: 2px solid rgba(11, 11, 12, 0.685);
  background-color: #37383a; 
  transform-style: preserve-3d;
  transition: transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99);
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);


  .aact{
    box-shadow: 2px 12px 28px #22864423;
  }

  .notacct{
    box-shadow: 2px 12px 28px #86222222;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem;
  width: 100%;
  height: 100%;
  border: 12px solid rgba(11, 12, 12, 0.685);
  background-color:rgb(30, 31, 30);
  border-radius: 50%;
  position: relative;
  z-index: 10;
 

  .isnotactive {
  filter: grayscale(100%) brightness(0);
}

 
`;

const Image = styled.div<ViewHeaderProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.6;
  border: none;
  background-image: ${({ src }) => `url('${src}')`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  image-rendering: pixelated;
  image-resolution: 95190;
   
`;

const GlareWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
  mask-image: -webkit-radial-gradient(center, white, black);
  pointer-events: none;
`;

const Glare = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 0% 0%;
  pointer-events: none;
  width: 393.151px;
  height: 393.151px;
  transform: rotate(0deg) translate(-50%, -50%);
  opacity: 0;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%);
  transition: opacity 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99);
`;

 
const ProfileImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  margin-bottom: 1.25rem;
  color: white;

  @media screen and (max-width: 530px) {
   margin-top: 1rem;

  }
`;

 
const Title = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 1em;
  text-transform: uppercase;
`;

const BoxWrapper = styled.div`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1.25rem;
  color: white;
  border: 1px solid #292626;
 
  border-radius: 1rem;
   
`;

const Text = styled.div`
  font-size: 0.75rem;
  text-align: center;
  text-transform: uppercase;
  opacity: 0.6;
  font-family: 'Courier New', Courier, monospace;
  padding: 0.25rem 0;
`;

const TraitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TraitBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.2);
  border: 2px solid #15151653;
`;

const TraitDetails = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
`;

const TraitName = styled.div`
  font-size: 0.775rem;
  font-weight: medium;
  font-family: 'InterSemiBold', monospace;
  color: #d6d8db;
`;

const TraitValue = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  opacity: 0.8;
  font-family: 'Courier New', Courier, monospace;
`;