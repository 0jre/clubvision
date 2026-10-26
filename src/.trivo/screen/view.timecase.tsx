import { useEffect, useState } from "react";
import styled from "styled-components";
import router from 'next/router';
import ROUTENVX from "@/routes/routes";


export default function TimeCase () {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const res = await fetch("/api/trivo/case/grade.listitem"); // Ajuste a rota conforme necessário
        const data = await res.json();
        
        if (data.nextUpdate) {
          const nextUpdateTime = new Date(data.nextUpdate).getTime();
          
          const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = nextUpdateTime - now;
            
            if (difference <= 0) {
              setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            } else {
              const hours = Math.floor(difference / (1000 * 60 * 60));
              const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((difference % (1000 * 60)) / 1000);
              setTimeLeft({ hours, minutes, seconds });
            }
          };

          updateCountdown(); // Chama imediatamente
          const interval = setInterval(updateCountdown, 1000);

          return () => clearInterval(interval); // Limpa o intervalo ao desmontar
        }
      } catch (error) {
        console.error("Erro ao buscar tempo:", error);
      }
    };

    fetchTime();
  }, []);
    return(
        <>
       <BannerWrapper>
      <BannerImageDesktop bannerUrl="/web/sdfsdfsddxcv.webp">
        <BannerContent>
          <CountdownWrapper>
            <div className="flex flex-col text-center justify-center">
              <h2 className="text-[12px] text-[#fff]">
                A caixa de itens será atualizada em:
              </h2>

              <div className="flex items-center mt-1">
                <TimeUnit>
                  <TimeValue><div>{timeLeft.hours.toString().padStart(2, "0")}</div></TimeValue>
                  <TimeLabel>horas</TimeLabel>
                </TimeUnit>

                <Separator>:</Separator>

                <TimeUnit>
                  <TimeValue><div>{timeLeft.minutes.toString().padStart(2, "0")}</div> </TimeValue>
                  <TimeLabel>minutos</TimeLabel>
                </TimeUnit>

                <Separator>:</Separator>

                <TimeUnit>
                  <TimeValue><div>{timeLeft.seconds.toString().padStart(2, "0")}</div></TimeValue>
                  <TimeLabel>segundos</TimeLabel>
                </TimeUnit>
              </div>
 
            </div>
          </CountdownWrapper>
        </BannerContent>
      </BannerImageDesktop>
    </BannerWrapper>
        </>
    )
}


 

export const TabbedSectionContainer = styled.div`
  display: grid;
  grid-auto-columns: 1fr 300px;
  grid-auto-flow: column;
  align-items: center;
  gap: 1rem;
  padding: 1em 1em 0;
  border-bottom: 1px solid #2e2e38; // border-grey-700
  @media (min-width: 1024px) {
    gap: 1.25rem; // lg:gap-5
  }
`;

export const SwiperContainer = styled.div`
  width: 100%;
  margin-bottom: -1px;
  display: flex;
  overflow-x: auto;
  backface-visibility: hidden;
`;

export const SwiperWrapper = styled.div`
  display: flex;
`;

export const SwiperSlide = styled.div`
  width: auto;
  margin-right: 24px;
  display: flex;
`;

export const Tab = styled.div<{ active?: boolean }>`
  position: relative;
  cursor: pointer;
  border-bottom: 1px solid ${({ active }) => (active ? '#34ca59' : '#2e2e38')}; // gold or grey
  padding: 0.875rem 1rem;
  font-size: 1rem;
  transition: opacity 0.2s ease-in-out;
  color: ${({ active }) => (active ? '#34ca59' : '#6B7C93')}; // gold or navy
  opacity: ${({ active }) => (active ? 1 : 0.5)};
  
  &:hover {
    opacity: 1;
    border-color: ${({ active }) => (active ? '#34ca59' : '#4a4a4a')}; // grey-500 on hover
  }

  display: flex;
  align-items: center;
  gap: 0.75rem;
  white-space: nowrap;

  svg.icon {
    flex-shrink: 0;
  }
`;

export const TabBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 0.5;
  background: radial-gradient(
    43.68% 59.18% at 50.18% 114.29%,
    rgba(119, 255, 164, 0.3) 0%,
    rgba(32, 32, 40, 0) 100%
  );
  background-position: bottom;
  background-repeat: no-repeat;
  animation: increaseVerticalBackgroundSize 0.25s ease-in-out;

  @keyframes increaseVerticalBackgroundSize {
    from {
      background-size: 100% 0%;
    }
    to {
      background-size: 100% 100%;
    }
  }
`;

export const RaceInfo = styled.div`
  display: none;
  max-width: 300px;
  align-items: center;
  gap: 0.5rem;
  justify-self: end;
  padding: 0.25rem 0 0.25rem 1rem;
  font-size: 0.875rem;
  font-weight: 400;
  color: #a3a9bb; // text-navy-200

  svg {
    width: 1rem;
    height: 1rem;
    color: white;
  }

  span {
    font-weight: 600;
    color: white;
  }

  @media (min-width: 768px) {
    display: flex;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
`;

 


export const BannerWrapper = styled.div`
  
`;


interface ViewHeaderProps {
  bannerUrl: string;
}
 
export const BannerImageDesktop = styled.div<ViewHeaderProps>`
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  background-color: rgb(10, 11, 17);
  background-position: center;
  background-size:100%;
  background-repeat: no-repeat;
  height: 200px;
  width: 100%;
   position: relative;
  overflow: hidden;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

 
export const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.3rem 0;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  left: 0; 
  @media (min-width: 768px) {
    gap: 1rem;
    padding: 2rem 0;
  }

  
`;

export const CountdownWrapper = styled.div`
  z-index: 10;
  display: flex;
  align-items: baseline;
  gap: 0;
  background-color: rgba(15, 14, 14, 0.2);
  width: 100%;
  justify-content: center;
  place-items: center;
  height: 100%;
  font-size: 1.5rem;  
  color: white;
`;

export const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem; // text-xl
  overflow: visible;
`;

export const TimeValue = styled.div`
  display: flex;
  gap: 0;
  font-weight:300;
  color: white;
  font-family: 'ldvision', monospace;

  > div {
    background-color: #202123; // bg-navy-800
    padding: 0.5rem 0.25rem;
    aspect-ratio: 1;
    width: 3.5ch;
    font-size: 1rem; // text-md
   
    text-align: center;
    border-radius: 0.375rem;
    margin: 0 0.5rem;
    font-variant-numeric: tabular-nums;
  }
`;

export const TimeLabel = styled.span`
  text-transform: uppercase;
  font-size: 10px;
  color: white;
  text-align: center;
  width: 3.5rem;
  margin-top: -8px;
  white-space: nowrap;
`;

export const Separator = styled.span`
  margin: 0 0.125rem;
  color: #dcd8d0;
  font-weight: 600;
`;
 