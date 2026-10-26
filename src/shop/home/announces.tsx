'use client'
import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import CardCarouselStore from "./CardCarousel";
import Carousel013 from "./slider.vis";
import axios from "axios";

export interface Advertising {
  AdsId: string;
  title: string;
  thumbnailUrl: string; 
  descriptions: string;
  DateLanc: string;
  About: string;
  Redirect: string;
}

const AnnounceStore: React.FC = () => {
  const [carouselItems, setCarouselItems] = useState<JSX.Element[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/ads/advertising');
      const data: Advertising[] = response.data;

      // Filtrar apenas os anúncios com About === 'Store'
      const filteredData = data.filter(ad => ad.About === 'Store');

      const newCarouselItems = filteredData.map((ad) => (
        <div key={ad.AdsId}>
          <CardCarouselStore 
            thumbnail={ad.thumbnailUrl}
            Descriptions={ad.descriptions} 
            Title={ad.title} 
            About={ad.About} 
            Redirect={ad.Redirect} 
          />
        </div>
      ));

      setCarouselItems(newCarouselItems);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>   

    
      <Anim>
        <Carousel013 items={carouselItems} />
      </Anim>
    </>
  );
};

export default AnnounceStore;

const Anim = styled.div`
  animation: PageAnim 0.8s linear;

  @keyframes PageAnim {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
`;
