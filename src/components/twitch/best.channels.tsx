import styled from 'styled-components';
import BestSingle from './best.sigleavatar'; // Certifique-se de que o caminho esteja correto
import { useEffect, useRef, useState } from 'react';

export interface VideoGroupProps {
  data?: DataProps[];
}

export interface DataProps {
  _id: number;
  viewers: number;
  tags: string[];
  channel: {
    status: string;
    logo: string;
    display_name: string;
    url: string;
  };
  preview: {
    medium: string;
    large: string;
  };
}

function shuffleArray(arr: DataProps[]) {
  return arr.sort(() => Math.random() - 0.5);
}

const BestVideos: React.FC<VideoGroupProps> = ({ data }) => {
  // Filtrar e ordenar os dados com base no número de visualizações
  const sortedData = (data ?? [])
    .filter(stream => stream.channel && stream.channel.status) // Filtra streams com status
    .sort((a, b) => b.viewers - a.viewers); // Ordena por visualizações em ordem decrescente

  return (
    <>
      <ScrollUsersCard>
        {sortedData.map((stream) => (
          <BestSingle
            key={stream._id}
            avatar={stream.channel.logo.replace('300x300', '50x50')}
            displayName={stream.channel.display_name}
            url={stream.channel.url}
          />
        ))}
      </ScrollUsersCard>
    </>
  );
};

export default BestVideos;



interface HorizontalScrollContainerProps {
    children: React.ReactNode;
  }
  
  const ScrollUsersCard: React.FC<HorizontalScrollContainerProps> = ({
    children,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    useEffect(() => {
      const scrollContainer = containerRef.current;
  
      // Função para realizar o scroll suave
      const scrollSmoothly = () => {
        if (scrollContainer) {
          scrollContainer.scrollBy({
            left: 2, // Pixels por intervalo
            behavior: "smooth", // Animação suave
          });
        }
      };
  
      const interval = setInterval(scrollSmoothly, 96); // Aproximadamente 60 FPS (16ms)
  
      return () => clearInterval(interval); // Limpa o intervalo quando o componente desmonta
    }, []);
  
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
      <CardViewListsa
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        ref={containerRef}
      >
        {children}
      </CardViewListsa>
    );
  };

const CardViewListsa = styled.div`
   padding: 1rem;  
   width: 90vw;
  display: inline-flex;
  overflow-x: scroll;
  cursor:  var(--f-cursor-grab);
  gap: 1rem; 
:active {
cursor:  var(--f-cursor-grabbed);
}


    
::-webkit-scrollbar {
display: none;

}

::selection{
display: none;
}

`;