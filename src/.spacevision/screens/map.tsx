 
import styled from "styled-components";
import Image from "next/image";
import { useEffect, useState, useRef, ReactNode, Suspense, } from "react";
import HeadGlobal from "@/club/head/glob.n";
import Logo from '@/public/nvrp/20230331_230855.png'
import { useRouter } from "next/router";
import React from "react";
import {
    Navigation,
    Bookmark,
    Compass,
    Share2,
    Phone,
    Clock,
    MapPin,
    Globe,
    Star,
    ChevronDown,
    ChevronRight,
    Check,
    Info,
    MessageSquare,
    Camera,
    Plus,
    Edit,
    X,
  } from "lucide-react"
import Scrollmargin from "@/components/scrollingcard/scroll.xc";


interface LocalInfo {
    name: string;
    rating: number;
    reviewsCount: number;
    category: string;
    address: string;
    openStatus: string;
    loc?: string;
    phone?: string;
    plusCode?: string;
    accessibility?: string[];
    lochere?: string[];
    highlights?: string[];
    offerings?: string[];
    planning?: string[];
    recycling?: string[];
    payments?: string[];
    description?: string;
    timelac?: number;
    descriptionless?: string;
    image?: string;
  }
   

export default function MapsPage ({onclose} : {onclose: () => void}) { 
      const router = useRouter()
    const [isNavbarVisible, setIsNavbarVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isIframeVisible, setIsIframeVisible] = useState(true);
    const [htmlContent, setHtmlContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState<LocalInfo | null>(null);
    const [activeTab, setActiveTab] = useState("about")
    const [showAllDescription, setShowAllDescription] = useState(false)

    
    useEffect(() => {
      setMounted(true);
    }, []);

    
    const handleGoBack = () => {
      router.back();
    };
    
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);
  
    const toggleNavbarVisibility = () => {
      setIsNavbarVisible(!isNavbarVisible);
    };
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);
  

      
      useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
          if (event.data?.type === 'markerClick') {
            setSelectedMarker(event.data.data);
          }
        };
      
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
      }, []);
      
  
    useEffect(() => {
      const fetchFileContent = async () => {
        try {
      
          // Construa o documento HTML completo com os conteúdos recebidos
          const fullHtmlContent = `<!DOCTYPE html>
          <html>
            <head>
            <meta charset="utf-8">
            <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
            <meta name="apple-mobile-web-app-capable" content="yes">
           
            <link rel="stylesheet" href="https://cdn.rawgit.com/ardhi/Leaflet.MousePosition/master/src/L.Control.MousePosition.css">
            <link href="/geomaps/css/lightbox.css" rel="stylesheet" />
            <script src="/geomaps/js/leaft.js" type="text/javascript"></script>
            <script src="https://cdn.rawgit.com/ardhi/Leaflet.MousePosition/master/src/L.Control.MousePosition.js" type="text/javascript"></script>
            <script src="/geomaps/js/leaflet-hash.js" type="text/javascript"></script>
            <script src="/geomaps/js/clipboard.js" type="text/javascript"></script>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
            <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
            <style>html, body, #map { width:100%; height:100%; margin:0; padding:0; z-index: 1; background: #143d6b; }#slider{ position: absolute; top: 10px; right: 10px;z-index: 5; }.leaflet-popup-content-wrapper {border-radius:0;min-width: 340px;}.h2, h2 {font-size: 1.3rem;}</style>
            </head>
            <body>
              <div id="map"></div>
              <script type="text/javascript">new ClipboardJS('.copy');</script>
              <script src="/geomaps/js/core.js"></script>
              <script src="/geomaps/js/markers_num.js"></script>
              <script src="/geomaps/js/lightbox-plus-jquery.min.js"></script>
            </body>
          </html>`;
  
          setHtmlContent(fullHtmlContent);
        } catch (error) {
          console.error('Erro ao carregar o conteúdo dos arquivos:', error);
          setError('Erro ao carregar o conteúdo dos arquivos.');
        }
      };
  
      fetchFileContent();
    }, []);
  
    useEffect(() => {
      // Inserir o conteúdo no iframe após o carregamento
      if (iframeRef.current && htmlContent) {
        const iframeDoc = iframeRef.current.contentDocument;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(htmlContent);
          iframeDoc.close();
        }
      }
    }, [htmlContent]);
  
  
    return (
        <>
     
    <HeadGlobal Title="Spacevision - Garagens" />
  
      <GlobaH>
       
      <MarginMap>
          <Button onClick={onclose}>
          <X size={16}  />
        </Button>
       <ContentNav> 
         <li>
       <Image className="Logo" src={Logo} 
           alt="Logo" height={50} width={50}/>
         <ul>
           <h3>NVRP</h3>
           <p>ROLEPLAY</p>
           <h5>GTARP</h5>
          </ul>
       </li>
       </ContentNav>
      {error ? (
       <div>Erro ao carregar o conteúdo: {error}</div>
     ) : (
    isIframeVisible && mounted && (        
     <iframe
    ref={iframeRef}
    title="The NoVision'RP"
    srcDoc={htmlContent}
    style={{ width: '100%', height: '100%', border: 'none' }}
  />
    ))}
      

       {selectedMarker && (
        <div className="flex flex-col items-center h-screen absolute left-1 top-1 ">
        
        
<Container>
     
      <HeaderImageContainer>
      {selectedMarker.image && (
        <Image 
          src={selectedMarker.image}
          alt={selectedMarker.name}
          fill
          style={{ objectFit: "cover" }}
        />
      )}
      </HeaderImageContainer>
 
      <PlaceInfoContainer>
        <PlaceNameContainer>
          <PlaceName>{selectedMarker.name}</PlaceName>
          <PlaceLocation ><p className="jsdf">novision</p></PlaceLocation>
        </PlaceNameContainer>
        <WeatherContainer>
          <WeatherInfo>{selectedMarker.category}</WeatherInfo>
          <TimeInfo>{selectedMarker.rating} ({selectedMarker.reviewsCount} reviews)</TimeInfo>
        </WeatherContainer>
      </PlaceInfoContainer>

      
      <ActionButtonsContainer>
        <ActionButton>
          <ActionIconContainer primary>
            <Navigation size={20} />
          </ActionIconContainer>
          <ActionText>Instruções</ActionText>
        </ActionButton>

        <ActionButton>
          <ActionIconContainer>
            <Bookmark size={20} />
          </ActionIconContainer>
          <ActionText>Salvar</ActionText>
        </ActionButton>

   
        <ActionButton>
          <ActionIconContainer>
            <Share2 size={20} />
          </ActionIconContainer>
          <ActionText>Compartilhar</ActionText>
        </ActionButton>
      </ActionButtonsContainer>


      <Section>
        <SectionTitle>Quick facts</SectionTitle>
        <SectionText>
          {selectedMarker.description}
          {!showAllDescription && <MoreButton onClick={() => setShowAllDescription(true)}>Mais</MoreButton>}
        </SectionText>
        {showAllDescription && (
          <>
            <SectionText style={{ marginTop: "8px" }}>
            {selectedMarker.descriptionless}
            </SectionText>
            <ShowLessButton onClick={() => setShowAllDescription(false)}>Mostre menos</ShowLessButton>
          </>
        )}
      </Section>

      <TabsContainer>
        <Tab active={activeTab === "about"} onClick={() => setActiveTab("about")}>
          Sobre
        </Tab>

        <Tab active={activeTab === "photos"} onClick={() => setActiveTab("photos")}>
          Fotos
        </Tab>
      </TabsContainer>

      {activeTab === "about" && (
        <>
   
          <Section>
            <InfoRow>
              <IconWrapper>
                <MapPin size={20} />
              </IconWrapper>
              <InfoContent>
                <InfoText>{selectedMarker.address} - {selectedMarker.openStatus}</InfoText>
                <LinkButton>View on map</LinkButton>
              </InfoContent>
            </InfoRow>
          </Section>

       
          <Section>
            <InfoRow>
              <IconWrapper>
                <Globe size={20} />
              </IconWrapper>
              <InfoContent>
            
              {selectedMarker.loc && (
      <InfoLink target="_blank" rel="noreferrer">{selectedMarker.plusCode && <p>📍 {selectedMarker.plusCode}</p>} {selectedMarker.loc}</InfoLink>
    )}
                <InfoSubtext>Coordenadas</InfoSubtext>
              </InfoContent>
            </InfoRow>
          </Section>

          

          <Section>
            <PopularTimesContainer>
              <PopularTimesHeader>
                <SectionTitle>Populares</SectionTitle>
                <DaySelector>
                  <DayText>Horario de picos</DayText>
                  <ChevronDown size={16} color="#5f6368" />
                </DaySelector>
              </PopularTimesHeader>

              <GraphContainer>
                <GraphLabel>novision</GraphLabel>
             
                <BarContainer>
                  {[10, 30, 45, 60, 80, 90, 70, 85, 95, 75, 60, 40].map((height, i) => (
                    <Bar key={i} height={height} isRed={i === selectedMarker.timelac} />
                  ))}  
                </BarContainer>

                <TimeLabels>
                  <TimeLabel>6h</TimeLabel>
                  <TimeLabel>9h</TimeLabel>
                  <TimeLabel>12h</TimeLabel>
                  <TimeLabel>3h</TimeLabel>
                  <TimeLabel>6h</TimeLabel>
                  <TimeLabel>9h</TimeLabel>
                </TimeLabels>
              </GraphContainer>

              <LiveIndicator>
                <RedDot />
                <LiveText>Feev</LiveText>
              </LiveIndicator>
            </PopularTimesContainer>
          </Section>

        
          <Section>
            <SectionTitle>Missões</SectionTitle>

            {selectedMarker.accessibility?.length ? (
  <div>
    <FeatureGrid>
      <FeatureItem>
 
      
        <Scrollmargin>
        <FitasContainer>
             
          {selectedMarker.accessibility.map(item => (
            <Fita key={item}>{item}</Fita>
          ))}
              </FitasContainer>
        </Scrollmargin>
     
      </FeatureItem>
    </FeatureGrid>
  </div>
) : null}


          
          </Section>

         
   
          <Section>
            <SectionTitle>O que você encontrará aqui</SectionTitle>
            
            
            {selectedMarker.lochere?.length ? (
  <div>
    <FeatureGrid>
     
    
      <Scrollmargin>
      <FitasContainer>
          {selectedMarker.lochere.map(item => (
            <Fita key={item}>{item}</Fita>
          ))}
           </FitasContainer>
            </Scrollmargin>
        
     
      
    </FeatureGrid>
  </div>
) : null}

 
          </Section>

         

       
        </>
      )}

   

      
      {activeTab === "photos" && (
        <>
          <Section>
            <PhotosContainer>
              <PhotosHeader>
                <SectionTitle>Photos</SectionTitle>
                <AddPhotosButton>
                  <Camera size={16} style={{ marginRight: "4px" }} />
                 
                </AddPhotosButton>
              </PhotosHeader>

              <PhotoGrid>
                <PhotoItem>
                  <Image
                    src="/placeholder.svg?height=120&width=120"
                    alt="Miami Beach"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </PhotoItem>
                <PhotoItem>
                  <Image
                    src="/placeholder.svg?height=120&width=120"
                    alt="Downtown Miami"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </PhotoItem>
                <PhotoItem>
                  <Image
                    src="/placeholder.svg?height=120&width=120"
                    alt="Wynwood Walls"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </PhotoItem>
                <PhotoItem>
                  <Image
                    src="/placeholder.svg?height=120&width=120"
                    alt="Bayside Marketplace"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </PhotoItem>
                <PhotoItem>
                  <Image
                    src="/placeholder.svg?height=120&width=120"
                    alt="Little Havana"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </PhotoItem>
                <PhotoItem>
                  <Image
                    src="/placeholder.svg?height=120&width=120"
                    alt="Brickell"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </PhotoItem>
              </PhotoGrid>

           
            </PhotosContainer>
          </Section>

          <Section>
            <PhotoCategories>
              <SectionTitle>Photo categories</SectionTitle>
              <CategoryScroll>
                <CategoryItem>
                  <CategoryThumbnail>
                    <Image
                      src="/placeholder.svg?height=96&width=96"
                      alt="All photos"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </CategoryThumbnail>
                  <CategoryName>All</CategoryName>
                </CategoryItem>
                <CategoryItem>
                  <CategoryThumbnail>
                    <Image
                      src="/placeholder.svg?height=96&width=96"
                      alt="Beaches"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </CategoryThumbnail>
                  <CategoryName>Beaches</CategoryName>
                </CategoryItem>
                <CategoryItem>
                  <CategoryThumbnail>
                    <Image
                      src="/placeholder.svg?height=96&width=96"
                      alt="Downtown"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </CategoryThumbnail>
                  <CategoryName>Downtown</CategoryName>
                </CategoryItem>
                <CategoryItem>
                  <CategoryThumbnail>
                    <Image src="/placeholder.svg?height=96&width=96" alt="Food" fill style={{ objectFit: "cover" }} />
                  </CategoryThumbnail>
                  <CategoryName>Food</CategoryName>
                </CategoryItem>
                <CategoryItem>
                  <CategoryThumbnail>
                    <Image
                      src="/placeholder.svg?height=96&width=96"
                      alt="Nightlife"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </CategoryThumbnail>
                  <CategoryName>Nightlife</CategoryName>
                </CategoryItem>
              </CategoryScroll>
            </PhotoCategories>
          </Section>
        </>
      )}

  
      <Footer>
        <FooterButton>
          <FooterIcon>
            <Info size={16} />
          </FooterIcon>
          Suggest an edit
        </FooterButton>
        <FooterButton>
          <FooterIcon>
            <Plus size={16} />
          </FooterIcon>
          Add a missing place
        </FooterButton>
      </Footer>
    </Container>
        
        <ButtonClose onClick={() => setSelectedMarker(null)}>
          <h3>fechar</h3>
        </ButtonClose>
        
        </div>
   
)}

</MarginMap>
      
      </GlobaH>
      </>
  );
};

 
 const ButtonClose = styled.button`
  width: 100%;
  background-color: #ffffff;
  border-radius: 32px;
  padding: 0.8em 2em;
  margin: 1%;
  color: black;
  font-family: 'Europa Grotesk', monospace;
  text-transform: uppercase;
  animation: opacity 1s all;
 `;

 
const MarginMap = styled.div`
  height: 90vh;
  width: 80vw;
  min-width: 70vw;
 
  border: 3px solid #252726;
  border-radius: 25px  ;
  position: relative;
  transition: 1s all;
  overflow: hidden;
  &::-webkit-scrollbar {
display: none;

}

&::selection{
display: none;
}
`;

const Button = styled.button`
   width: 34px;
   height: 34px;
   border: 2px solid #545754;
   border-radius: 50%;
   background-color: black;
   display: flex;
   justify-content: center;
   align-items: center;
   position: absolute;
   right: 1%;
   top: 1%;

   &:hover{
    color: #726f6a;
   }
`;

const GlobaH = styled.main`

   position: fixed;
   z-index: 1999;
   width: 100%;
   height: 100%;
   background-color: #00000073;
   display: flex;
   backdrop-filter: blur(1px);
   justify-content: center;
   align-items: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;
  

const FitasContainer = styled.div`
  
  display: inline-flex;
  overflow-x: auto;
  gap: 5px;
`;

const Fita = styled.span`
  background-color: rgb(35, 36, 37);
  color: #b5babd;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  white-space: nowrap;
`;
   
const ContentNav = styled.div`
    
    display: flex;
    position: absolute; 
    right: 1px;
    bottom: 12px;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    padding: 0em 3em 0em;
  
  li{
     display: flex;
     flex-wrap: wrap;
     align-items: center;
      
     ul{
       
      h3{
        font-size: 12px;

      }

      p{
        font-size: 11px;
        font-family: 'Roboto', sans-serif;
      }

      h5{
        font-size: 11px;
        color: rgba(8, 255, 119, 0.918);
      }

     
     }
  }

  .ul{
  display: flex;
  align-items: center;

    a{
    font-size: 11px;
    font-family: 'ProximaNova-Italic', monospace;
    color: #e7e4e4;
    font-weight: 400;
    margin: 0.4em;
 
   }
  }

  @media screen and (min-width: 343px) and (max-width: 545px) {
   
    padding: 0 0.4em 0;
}

@media screen and (max-width: 344px) {
  
  li{  
     
    ul{
    display: none;
   }  
  }
}


@media screen and (max-width: 430px) {
  display: flex;
    justify-content: center;

 

     .ul{
      display: none;
     }
  }
`;
  




// Styled Components
const Container = styled.div`
  font-family: 'Roboto', sans-serif;
  max-width: 400px;
  margin: 0 auto;
  max-height: 80vh;
  overflow-y: auto;
background: linear-gradient(204deg, #242524f4 -7%, #b85cff00 33%), linear-gradient(162deg, #26272740 -10%, #2c88dd00 25%), linear-gradient(0deg, #1b1b1bf4, #1e1f1ef4);
border: 2px solid #2b2c2e;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
 animation: ViewInfoCard 0.3s linear;
  border-radius: 12px;
   


  &::-webkit-scrollbar {
  display: none;
  
  }
  
  &::selection{
  display: none;
  }
  
  
  p,h1,h2,h3,h4,h5{
    font-family: 'Inter', monospace;
  }
  @keyframes ViewInfoCard {
    0% { transform: translateX(-100%)}
    100% { transform: translateX(0)}
  }
  
`

const HeaderImageContainer = styled.div`
  position: relative;
  height: 192px;
  width: 100%;
`

const PlaceInfoContainer = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const PlaceNameContainer = styled.div``

const PlaceName = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: #d5dad7;
  margin: 0;
`

const PlaceLocation = styled.div`
  
  color: #5f6368;
  margin: 2px 0 0 0;
 

  .jsdf{
    font-size: 12px;
    font-family: 'Europa Grotesk';
  }
`

const WeatherContainer = styled.div`
  text-align: right;
`

const WeatherInfo = styled.p`
  font-size: 14px;
  color: #5f6368;
  margin: 0;
`

const TimeInfo = styled.p`
  font-size: 14px;
  color: #5f6368;
  margin: 2px 0 0 0;
`

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid  #2b2c2e;
`

const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  font-family: 'InterSemiBold', monospace;
  cursor: pointer;
`

const ActionIconContainer = styled.div<{ primary?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.primary ? "#339765" : "transparent")};
  border: ${(props) => (props.primary ? "none" : "1px solid #dadce0")};
  color: ${(props) => (props.primary ? "white" : "#339765")};
`

const ActionText = styled.span<{ center?: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.center ? "#5f6368" : "#339765")};
  text-align: center;
`

const Section = styled.div`
  padding: 16px;
  border-bottom: 1px solid  #2b2c2e;
`

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: #363638;
  font-family: 'Inter', monospace;
  margin: 0 0 8px 0;
`

const SectionText = styled.p`
  font-size: 14px;
  color: #9fa0a5;
  font-family: 'Inter', monospace;
  margin: 0;
  line-height: 1.4;
`

const MoreButton = styled.button`
  color: #339765;
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  margin-left: 4px;
  cursor: pointer;
`

const ShowLessButton = styled.button`
  color: #339765;
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  margin-top: 8px;
  cursor: pointer;
`

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid  #2b2c2e;
`

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "500" : "400")};
  color: ${(props) => (props.active ? "#c5c9cf" : "#5f6368")};
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${(props) => (props.active ? "#339765" : "transparent")};
  }
`

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
`

const IconWrapper = styled.div`
  color: #5f6368;
  margin-right: 16px;
  margin-top: 2px;
`

const InfoContent = styled.div``

const InfoText = styled.p`
  font-size: 14px;
  color: #5f6368;
  margin: 0;
`

const InfoLink = styled.a`
  font-size: 14px;
  color: #339765;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`

const InfoSubtext = styled.p`
  font-size: 12px;
  color: #5f6368;
  margin: 4px 0 0 0;
`

const LinkButton = styled.button`
  color: #339765;
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  margin-top: 4px;
  cursor: pointer;
`

const HoursHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const HoursTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #5f6368;
  margin: 0;
`

const OpenNowText = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #188038;
  margin: 0;
`

const HoursList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const HoursRow = styled.div<{ highlight?: boolean }>`
  display: flex;
  justify-content: space-between;
  
  & > p {
    font-weight: ${(props) => (props.highlight ? "500" : "400")};
  }
`

const PopularTimesContainer = styled.div``

const PopularTimesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

const DaySelector = styled.div`
  display: flex;
  align-items: center;
`

const DayText = styled.span`
  font-size: 12px;
  color: #5f6368;
  margin-right: 4px;
`

const GraphContainer = styled.div`
  position: relative;
  height: 96px;
  width: 100%;
`

const GraphLabel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  font-size: 10px;
  color: #5f6368;
  font-family: 'Europa Grotesk';
`

 

const BarContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: 64px;
  margin-top: 24px;
  justify-content: space-between;
`

const Bar = styled.div<{ height: number; isRed?: boolean }>`
  width: 7%;
  height: ${(props) => props.height}%;
  background-color: ${(props) => (props.isRed ? "#ea4335" : "#339765")};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`

const TimeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
`

const TimeLabel = styled.span`
  font-size: 12px;
  color: #5f6368;
`

const LiveIndicator = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
`

const RedDot = styled.div`
  width: 12px;
  height: 12px;
  background-color: #ea4335;
  border-radius: 50%;
  margin-right: 4px;
`

const LiveText = styled.span`
  font-size: 12px;
  color: #5f6368;
`

const FeatureGrid = styled.div`
  display: box;
  
`

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
`

const CheckIconStyled = styled(Check)`
  color: #188038;
  margin-right: 8px;
`

const FeatureText = styled.span`
  font-size: 14px;
  color: #5f6368;
`
 

const ViewAllButton = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 8px 0;
  color: #339765;
  font-size: 14px;
  font-weight: 500;
  background: none;
  border: 1px solid #282b29;
  border-radius: 4px;
  cursor: pointer;
`

const PhotosContainer = styled.div``

const PhotosHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const AddPhotosButton = styled.div`
  display: flex;
  align-items: center;
  color: #339765;
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  cursor: pointer;
`

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
`

const PhotoItem = styled.div`
  aspect-ratio: 1;
  background-color: #f1f3f4;
  position: relative;
`

const PhotoCategories = styled.div`
  margin-top: 16px;
`

const CategoryScroll = styled.div`
  display: flex;
  overflow-x: auto;
  padding-bottom: 8px;
  margin: 0 -16px;
  padding: 0 16px;
  gap: 12px;
  
  &::-webkit-scrollbar {
    display: none;
  }
`

const CategoryItem = styled.div`
  flex-shrink: 0;
  width: 96px;
`

const CategoryThumbnail = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 8px;
  background-color: #f1f3f4;
  position: relative;
  overflow: hidden;
`

const CategoryName = styled.p`
  font-size: 12px;
  color: #5f6368;
  text-align: center;
  margin: 4px 0 0 0;
`

const Footer = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const FooterButton = styled.button`
  display: flex;
  align-items: center;
  color: #339765;
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
 
  cursor: pointer;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const FooterIcon = styled.div`
  margin-right: 8px;
`