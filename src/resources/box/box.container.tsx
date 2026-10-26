import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  itemWon: string | null; 
  onReset: () => void; 
  possibleItems: { id: number; imagem: string; nameitem: string }[];
}

interface ItemImageProps {
  itemWon: string | null;
}

const BoxOpening = ({ itemWon, onReset ,possibleItems}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [itemImageVisible, setItemImageVisible] = useState(false);
  const [showRightContainer, setShowRightContainer] = useState(false); // Novo estado para controlar o RightContainer
  const soundRef = useRef<HTMLAudioElement | null>(null);

  const videoList = [
    '/web/a78dccc8cb937fc1774dfc6a8afae05d3d8aea83.mp4',
  ];

  const getRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * videoList.length);
    return videoList[randomIndex];
  };

  const [selectedVideo, setSelectedVideo] = useState(getRandomVideo);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play(); 
    }
  }, [itemWon, selectedVideo]);

  const handleVideoEnd = () => {
    setVideoEnded(true); 
    setShowMessage(true);

    setTimeout(() => {
      setItemImageVisible(true);
      if (soundRef.current) {
        soundRef.current.play();
      }

      // Mostrar o RightContainer depois do item ser mostrado
      setTimeout(() => {
        setShowRightContainer(true);

        // Aguardar 4 segundos após o RightContainer ser mostrado e resetar
        setTimeout(onReset, 24000);
      }, 4000); // Exibir RightContainer após 4 segundos de exibição do item
    }, 1000);
  };

  return (
    <Container>
      <Video
      id='open'
        ref={videoRef}
        src={selectedVideo}
        onEnded={handleVideoEnd}
        controls={false}
        controlsList="nodownload"
        autoPlay
        playsInline
        style={{
          display: 'block',
          borderRadius: `${showRightContainer ? '8px' : '9px'}`,
          top: 0,
          left: 0,
          width:  `${showRightContainer ? '100%' : '100%'}`,
          height: `${showRightContainer ? '80%' : '100%'}`,
          objectFit: 'cover',
        }} 
      />

      <audio ref={soundRef} src="/Sounds/battlepass_ui_win.mp3" />

      {showRightContainer ? ( // RightContainer só será exibido após o item
        <RightContainer>
          <ItemList>
            {possibleItems.map((item) => (
              <ItemContainer
                key={item.id}
                isSelected={item.imagem === itemWon} 
              >
                <img src={item.imagem} alt={item.nameitem} />
                <p>{item.nameitem}</p>
              </ItemContainer>
            ))}
          </ItemList>
        </RightContainer>
      ) : (
        <Hjs />
      )}

      {itemImageVisible && itemWon && (
        <ItemImage itemWon={itemWon}>
          <img  src={itemWon} alt="Item Ganhado" />
        </ItemImage>
      )}

      <Header />
    </Container>
  );
};

export default BoxOpening;


const Header = styled.div` 
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(0px);
  bottom: 0;
`;
const scrollAnimation = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const RightContainer = styled.div`
 
 
  width: 100%;
  display: flex;
  justify-content: center;
  
  overflow: hidden; 
  
  border-radius: 12px;
  animation: Vision 1s linear;

  @keyframes Vision {
    0%{
      transform: translateY(100%);
    }
    100%{
      transform: translateY(0%);
    }
  }
  
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  animation: ${scrollAnimation} 30s linear infinite;
 
`;


const ItemContainer = styled.div<{ isSelected: boolean }>`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  place-items: center;
  align-items: center;
  text-align: center;
  margin:  8px; 
  padding: 10px;
  border: ${({ isSelected }) => (isSelected ? '2px solid gold' : '2px solid transparent')}; 
  border-radius: 8px;
  background-color: rgba(113, 115, 119, 0.055);
  height: 120px;
  width: 140px;

  img {
    width: 100px;
    height: auto;
    object-fit: cover;
  }
  p {
    color: #c2c3cc;
    bottom: 5px;
    font-size: 9px;
    position: absolute;
    font-family: 'InterSemiBold', monospace;
  }
`;


 
// Definindo a interface para as propriedades do styled-component
const Container = styled.div`
  position: fixed;
  left: 0;
  top: -6px;
  bottom: 0;
  padding: 1em;
  z-index: 1993;
  display: flex;
  background-image: url('/theim/backgrounds/947jfvb48.png');
  background-position: center;
  background-repeat: no-repeat;
  flex-direction: column;
  place-items: center;
  justify-content: center;
  right: 0;
 
  height: 100vh;
  width: 100%;
  backdrop-filter: blur(33px);
  background-color: rgba(7, 7, 8, 0.267);

  ::-webkit-scrollbar {
     display: none;
  }

 ::selection{
  display: none;
 }

  
  video{
    transition: 1s all;
  }
`;



const Video = styled.video`
  display: block;
  margin: 0.5em;
  margin-bottom: 0;
`;
const ItemImage = styled.div<ItemImageProps>`
  position: absolute;
  top: 50%;
  left: 50%; 
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  width: 350px; 
  height: 400px; 
  background-image: url('/web/20240919_020900.png') !important;
  background-size: 60%;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${({ itemWon }) => (itemWon ? 1 : 0)};
  overflow: hidden; 
  border-radius: 8px; 

  img {
    width: auto;
    height: 150px;
    object-fit: cover;
    transform: scale(1.1);
  }
`;


 const Hjs = styled.div`
   height: 400px; 
   width: 100%;
 `;