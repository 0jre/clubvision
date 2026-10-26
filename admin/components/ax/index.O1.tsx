import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';

interface CarouselProps {
    items: React.ReactNode[];
  }
  
  const StyledCarousel = styled(Slider)`
    width: 80%;
    padding: 2em 0 0;
    margin: 0 auto;
   
    @media screen and (max-width: 430px) {
    width: 100%;
   
 }
  `;
  

const Carousel01 : React.FC<CarouselProps> = ({ items }) => {
    const settings = {
      dots: false,
      infinite: true,
      speed: 1000,  
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,  
    };
  
    return (
      <StyledCarousel {...settings}>
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </StyledCarousel>
    );
  };
  
  export default Carousel01;


 