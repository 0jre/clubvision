import { useState, useEffect } from "react";
import Carousel01 from "./index.O1";
import CardCarousel from "../ac/carousel";
import styled from "styled-components";
  

export interface Advertising {
    AdsId: string;
    // Add other properties as needed
    title: string;
    thumbnailUrl: string; 
    descriptions: string;
    DateLanc: string;
    About: string;
    Redirect: string;
  }

interface Thumb {
    thumbnail: React.ReactNode; 
}

async function fetchAdvertisingData() {
  try {
    const response = await fetch('/api/ads/advertising');
    const data: Advertising[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching advertising data:', error);
    throw error;
  }
}

export default function AdsTheNoVision() {
  const [carouselItems, setCarouselItems] = useState<JSX.Element[]>([]);


  const fetchData = async () => {
    try {
      const data = await fetchAdvertisingData();
      const newCarouselItems = data.map((ad: Advertising) => (
        <div key={ad.AdsId}>
          <CardCarousel 
          thumbnail={
              <>
                <Content thumbnail={ad.thumbnailUrl}/>   
              </>
          }
          Descriptions={ad.descriptions} 
          Title={ad.title} 
          About={ad.About} 
          Redirect={ad.Redirect} />
        </div>
      ));
      setCarouselItems(newCarouselItems);
    } catch (error) {
      // Handle error, if needed
    }
  };

  useEffect(() => {

    fetchData();
    
  }, []);


  return (
    <>
      <Carousel01 items={carouselItems} />
    </>
  );
}

const Content = styled.div<Thumb>`

  background-image: ${({ thumbnail }) => `url('${thumbnail}')`};
  background-color: rgb(8, 8, 17);;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 1em 2em 1em;
  border-radius: 2em; 
  height: 59vh;
  width: 40em;
  transition: 0.8s all;

  &:hover{
    border-radius: 19px; 
  }
`;