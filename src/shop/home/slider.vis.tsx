import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';

interface CarouselProps {
  items: React.ReactNode[];
}

const Carousel013: React.FC<CarouselProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0); // Estado para rastrear o slide ativo

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    afterChange: (current: number) => setActiveIndex(current), // Atualiza o índice ativo
    customPaging: (i: number) => (
      <Dot active={i === activeIndex} />
    ),
  };

  return (
    <StyledCarousel {...settings}>
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </StyledCarousel>
  );
};

export default Carousel013;

const StyledCarousel = styled(Slider)`
  padding: 2em 0 0;

  .slick-dots {
    bottom: -30px; // Ajuste a posição dos dots
  }

  .slick-dots li {
    margin: 0 5px; // Espaçamento entre os dots
  }
`;

const Dot = styled.div<{ active?: boolean }>`
  width: 10px;
  height: 10px; 
  border-radius: 50%; 
  background: ${({ active }) => (active ? '#2ae261' : 'rgba(41, 40, 40, 0.274)')}; // Cor do dot
  transition: background 0.3s, transform 0.3s; // Transição suave
  // Se o dot estiver ativo, aumenta o tamanho
  transform: ${({ active }) => (active ? 'scale(1.5)' : 'scale(1)')}; 

  &:hover {
    background: #777; // Cor do dot ao passar o mouse
    transform: scale(1.2); // Aumenta levemente o dot ao passar o mouse
  }
`;
