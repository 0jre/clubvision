import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface VideoSingleProps {
  title: string;
  channel: string;
  tags: string[];
  avatar: string;
  preview: string;
  viewers: number;
  children?: React.ReactNode;
}

const formatNumber = (num: number) => {
  if (num > 1000 && num < 1000000) {
    return (num / 1000).toString().slice(0, 3) + 'K';
  } else if (num > 1000000) {
    return (num / 1000000).toString().slice(0, 3) + 'M';
  } else {
    return num;
  }
};

const VideoSingle: React.FC<VideoSingleProps> = ({
  title,
  channel,
  tags,
  avatar,
  preview,
  viewers,
  children
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para abrir o modal
  const openModal = () => setIsModalOpen(true);

  // Função para fechar o modal
  const closeModal = () => setIsModalOpen(false);
  // Função para detectar a tecla "ESC"
  const handleKeyDown = (event: any) => {
    if (event.key === 'Escape') {
      setIsModalOpen(false);
    }
  };

  // Use o useEffect para adicionar o evento de teclado ao montar o componente
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup para remover o evento ao desmontar o componente
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <Container>
      <div className="video-info" onClick={openModal}>
        <img src={preview} alt="thumbnail" />
        <strong>LIVE</strong>
        <p>{`${formatNumber(viewers)} viewers`}</p>
      </div>
      <div className="profile-info">
        <img src={avatar} alt={channel} width="30" height="30" />
        <div>
          <strong title={title}>{title}</strong>
          <p>{channel}</p>
          <div className="margin">
            {Array.isArray(tags) &&
              tags.map((tag, index) => <span key={index}>{tag}</span>)}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
          <ul>

<button onClick={closeModal}> <i className="fi fi-br-cross"/></button>

</ul>
            <ModalWrapper>
              <IframeWrapper>
                <iframe
                  src={`https://player.twitch.tv/?channel=${channel}&parent=${process.env.NEXT_PUBLIC_BASE_DOMAIN}`}
                  height="450"
                  width="100%"
                  frameBorder="0"
                  allowFullScreen
                  title="Twitch Stream"
                ></iframe>
              </IframeWrapper>
              <ChatWrapper>
                {children}
                
              <iframe
  src={`https://www.twitch.tv/embed/${channel}/chat?parent=${window.location.hostname}&darkpopout`}
  frameBorder="0"
  allowFullScreen
  title="Twitch Chat"
/>


              </ChatWrapper>
            </ModalWrapper>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default VideoSingle;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  backdrop-filter: blur(23px);
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4000;
`;

const ModalContent = styled.div`

  padding: 20px;
  border-radius: 8px;
  position: relative;
  width: 100%;
  background-image: url('/web/hdshfioef.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
 
  ul{
    display: flex;
    align-items: center;
    place-items: center;
 
    justify-content: end;
   
  }
 
  button{
   color: #6d6d7276;  
    margin-top: -1em;
    margin-bottom: 0.5em;
   transition: 1s all;
  
   
    i{
      font-size: 14px;
    }
    
  &:hover{
    i{
      color: white;
    }
  }
  }
`;

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

 
`;

const IframeWrapper = styled.div`
  flex: 1;
  margin-right: 10px;

  iframe {
    width: 100%;
    border-radius: 22px;
    height: 90vh;
  }
`;

const ChatWrapper = styled.div`
  flex: 0.3;
 
  iframe {
    width: 25vw;
    border-radius: 12px;
    height: 80vh;
    
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 300px;
  padding: 0 0 1em;
  transition: 1s all;
 

  .video-info {
    display: flex;
    flex-direction: column;
    background-color: red;
    position: relative;
    max-width: 300px;
    cursor: var(--f-cursor-pointer);
    img {
    
      height: 180px;
    }

    strong {
      position: absolute;
      padding: 0.4rem;
      background-color: rgb(233, 25, 22);
      color: #fff;
      margin: 0.2rem;
      font-size: 13px;
      line-height: 10px;
      border-radius: 6px;
    }

    p {
      position: absolute;
      bottom: 0;
      padding: 0.4rem;
      margin: 0.2rem;
      font-size: 14px;
      line-height: 14px;
      background-color: rgba(33, 33, 33, 0.8);
      border-radius: 4px;
    }
  }


    
  .profile-info {
    display: flex;
    flex-direction: row;
    margin-top: 0.5rem;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 1rem;
    }

    div {
      display: flex;
      flex-direction: column;
      font-size: 14px;

      strong {
        width: calc(280px - 1rem - 50px);
       
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .margin{
      display: flex;
      flex-direction: row;
      align-items: center;
      max-width: 280px;
      overflow: hidden;
      justify-content: start;
    }

      p {
        margin: 0;
        font-size: 12px;
        color: #bcc0c5;
      }

      span {
        background-color: #929ca334;
        width: fit-content;
        font-size: 10px;
        line-height: 8px;
        font-weight: bold;
        padding: 0.5rem;
        border-radius: 40px;
      }
    }
  }

  :hover {
    .video-info {
      img,
      strong,
      p {
        transform: translate(4px, -5px);
      }
      background-color: rgb(22, 233, 117);
    }
  }
`;