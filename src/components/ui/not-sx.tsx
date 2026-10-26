import ROUTENVX from '@/routes/routes';
import React from 'react';
import styled from 'styled-components';
import router from 'next/router';
 
interface Prop {
    description: string
    title: string
}
const NotOPS:React.FC<Prop> = ({title, description}) => {
  return (
    <Container>
      <RelativeContainer>
        <CenterContent>
          <ContentGroup>
            <ImageGroup>
              <ImageStyledLeft height="140" src="/theim/cards/20250331_230947.webp" />
              <MainImageContainer>
          
                <MainImage height="140" src="/theim/cards/20250331_222125.webp" />
              </MainImageContainer>
              <ImageStyledRight height="140" src="/theim/cards/20250331_230031.webp" />
            </ImageGroup>
            <Heading>{title}</Heading>
            <Subheading>{description}</Subheading>
           
          </ContentGroup>
        </CenterContent>
        <BackgroundElementsContainer>
          <BackgroundTopLeft>
            <BackgroundGridWrapper>
              <BackgroundGrid role="grid">
                {[...Array(5)].map((_, index) => (
                  <GridItem key={index}>
                    <ArticleContent>
                      <PlaceholderDiv />
                    </ArticleContent>
                    <CardFooter>
                      <CardDetails>
                        <CardDetailRow>
                          <SmallPlaceholder />
                        </CardDetailRow>
                        <PriceRow>
                          <TinyPlaceholder />
                        </PriceRow>
                      </CardDetails>
                    </CardFooter>
                  </GridItem>
                ))}
              </BackgroundGrid>
            </BackgroundGridWrapper>
          </BackgroundTopLeft>
        </BackgroundElementsContainer>
      </RelativeContainer>
    </Container>
  );
};

export default NotOPS;


const Container = styled.div`
  height: 80vh;
  width: 100%;
  padding: 1em;
   display: flex;
  flex-direction: column;
  justify-content: center;
 
`;

const RelativeContainer = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
  
`;

const CenterContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  inset: 0;
  left: 0;
  right: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
`;

const ContentGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap:0.5rem;
`;

const ImageGroup = styled.div`
  display: flex;
  pointer-events: none;
  user-select: none;
  margin-left: -89.6px;
  margin-right: -89.6px;
`;

const ImageStyled = styled.img`
  object-fit: cover;
  aspect-ratio: 1 / 1;
  width: 140px;
  height: 140px;
  border-radius: 12px;
  transition: transform 1000ms cubic-bezier(0.23, 1, 0.32, 1);  
  z-index: -10;
   
  transition-delay: 150ms;
`;

const ImageStyledLeft = styled(ImageStyled)`
  transform: translateX(60%) rotate(-15deg) translateY(4.5%) scale(0.75);
`;

const ImageStyledRight = styled(ImageStyled)`
  transform: translateX(-60%) rotate(15deg) translateY(4.5%) scale(0.75);
`;

const MainImageContainer = styled.div`
  display: flex;
  width: 140px;
  height: 140px;
  border-radius: 3%;
  transition: all 1000ms cubic-bezier(0.23, 1, 0.32, 1); 
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); 
  position: relative;
  opacity: 1;

  & > * {
    border-radius: 3%;
  }
`;

 

const MainImage = styled.img`
  object-fit: cover;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  position: absolute;
  inset: 0;
  z-index: 10;
  transition: all 1000ms cubic-bezier(0.23, 1, 0.32, 1); 
`;

const Heading = styled.span`
  font-weight: 500;
  line-height: 1.25;  
  margin-top: 25%;
 
  font-size: 19px;   
`;

const Subheading = styled.span`
  line-height: 1.5; 
  font-size: 1rem;  
  font-family: 'ProximaNova-Italic', sans-serif;
  color: #6a6a6a;  
`;

const StyledLink = styled.a`
  cursor: pointer;
  text-decoration: none;
  &:disabled {
    pointer-events: none;
    opacity: 0.4;
  }
`;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  border-radius: 5rem; 
  transition: all 200ms ease;
  justify-content: center;
  font-weight: 500;
  &:focus-visible {
    outline: none;
  }
  background-color: #43c483; 
  border: 1px solid #201f1f; 
  gap: 0.375rem;
  padding: 0.7em 2em; 
  font-size: 0.875rem; 

  &:hover {
    background-color: #2f8f58; 
    border-color: #379e56;
  }
 
  
`;

const BackgroundElementsContainer = styled.div`
  display: flex;
 
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  width: 100%;
  opacity: 0.5;
  mask-image: linear-gradient(to bottom, #2b2e2d 1.5rem, rgba(87, 82, 82, 0.3) 50%, transparent);
  transition: all 2500ms cubic-bezier(0.23, 1, 0.32, 1); /* ease-out-quint */
  transition-delay: 200ms;
  height: 75%;
`;

const BackgroundTopLeft = styled.div`
  display: flex;
  
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const BackgroundGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  
  width: 100%;
  padding-bottom: 1rem;
`;

const BackgroundGrid = styled.div`
  display: grid;
  width: 100%;
  grid-auto-flow: row dense;
  gap: 0.75rem;
 

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(172px, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
  }
  @media (min-width: 1280px) {
    grid-template-columns: repeat(auto-fill, minmax(186px, 1fr));
  }
  @media (min-width: 1536px) {
    grid-template-columns: repeat(auto-fill, minmax(228px, 1fr));
  }
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); 
  background-color: #6e746e;  
  transition: transform 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55);  
  perspective: 0;
  transform: translateZ(0);
  backface-visibility: hidden;
  pointer-events: none;  

  &::before {
    content: '';
    position: absolute;
    pointer-events: none;
    inset: 0;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);  
    z-index: 1;  
    border-radius: inherit;
  }

  &:hover {
    transform: translateY(-0.125rem) scale(1.01);
  }
  &:active {
    transform: scale(1.005);
  }
`;

const ArticleContent = styled.article`
  position: relative;
  flex-grow: 1;
  overflow: hidden;
`;

const PlaceholderDiv = styled.div`
  width: 100%;
  height: 100%;
  background-color: #4f524f; 
  border-radius: inherit;
  animation: none;
  aspect-ratio: 1 / 1;
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-shrink: 0;
  flex-grow: 1;
  border-radius: inherit;
  & > *:not(:first-child) {
    margin-top: 0.5rem;
  }
`;

const CardDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  &:first-child {
    align-items: center;
  }
  height: auto;
  padding-top: 0.875rem;
`;

const SmallPlaceholder = styled.div`
  width: 100%;
  background-color: #e0e0e0; /* Placeholder for bg-bg-additional-2 */
  height: 18px;
  border-radius: 0.25rem;
  width: 75%;
  animation: none;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  height: 3rem;
  width: 100%;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  &:first-child {
    align-items: center;
  }
`;

const TinyPlaceholder = styled.div`
  width: 100%;
  background-color: #e0e0e0; /* Placeholder for bg-bg-additional-2 */
  height: 18px;
  border-radius: 0.25rem;
  width: 33.333333%;
  animation: none;
`;