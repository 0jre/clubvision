 
import { useState } from "react"
import Image from "next/image"
import styled from "styled-components"
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react"
import Abounvrp from './about.vision';

export default function Galery() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const images = [
    "https://gta5majestic.com/images/home/showcase/photos/photo1.webp",
    "https://gta5majestic.com/images/home/showcase/photos/photo9.webp",
    "https://gta5majestic.com/images/home/showcase/photos/photo10.webp",
    "https://gta5majestic.com/images/home/showcase/photos/photo11.webp",
    
    
  ]

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const lightboxPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <Container>

            <LeftWas />
      <RightWas />

 

        <div className="flex flex-col"> 
       <Abounvrp />
        </div>

       <div className="flex flex-col justify-center items-center ">
        <VideoSection>
        <VideoOverlay>
          <PlayButton>
            <Play size={34} fill="white" />
          </PlayButton>
          <li>
             <h4>Assistir </h4>
             <p>em 1 minutos</p>
          </li>
        </VideoOverlay>
      </VideoSection>

      <ThumbnailsContainer>
     {images.slice(0, 8).map((image, index) => {
  const isFourthItem = index === 3;

  return (
    <Thumbnail key={index} onClick={() => openLightbox(index)} style={{ position: "relative" }}>
      <Image
        src={image || "/placeholder.svg"}
        alt={`Thumbnail ${index + 1}`}
        fill
        style={{ objectFit: "cover" }}
      />
      {isFourthItem && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          <h5 style={{ margin: 0 }}>MAIS FOTOS</h5>
          <ChevronRight size={16} color="#fff" />
        </div>
      )}
    </Thumbnail>
  );
})}


      </ThumbnailsContainer>

      {lightboxOpen && (
        <LightboxContainer>
          <LightboxClose onClick={closeLightbox}>
            <X size={24} />
          </LightboxClose>

          <LightboxContent>
            <LightboxNavigation className="left" onClick={lightboxPrev}>
              <ChevronLeft size={36} />
            </LightboxNavigation>

            <LightboxImage>
              <Image
                src={images[lightboxIndex] || "/placeholder.svg"}
                alt={`Screenshot ${lightboxIndex + 1}`}
                fill
                style={{ objectFit: "contain" }}
              />
            </LightboxImage>

            <LightboxNavigation className="right" onClick={lightboxNext}>
              <ChevronRight size={36} />
            </LightboxNavigation>
          </LightboxContent>

          <LightboxThumbnails>
            {images.map((image, index) => (
              <LightboxThumbnail key={index} active={index === lightboxIndex} onClick={() => setLightboxIndex(index)}>
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </LightboxThumbnail>
            ))}
          </LightboxThumbnails>
        </LightboxContainer>
      )}
       </div>
    </Container>
  )
}

 


const LeftWas = styled.div`
 background-image: url('/theim/chracters-c/object_pls.png') ;
    height: 401px;
   width: 450px;
    filter: saturate(0);
 background-position: center;
   left:  -36%;
  position: absolute;
  background-size: cover;
  background-repeat: no-repeat;
     transform: rotate(-290deg);
    @media screen and (max-width: 870px) {
   display: none;
 }
    
`;

const RightWas = styled.div`
   background-image: url('/theim/chracters-c/object_pls.png') ;
  height: 321px;
   width: 450px;
   background-position: center;
    transform: rotate(30deg);
   position: absolute;
   right: -10%;
   top: 15px;
   z-index: 1;
  filter: saturate(0);
 
  background-size: cover;
  background-repeat: no-repeat;
 
    @media screen and (max-width: 870px) {
   display: none;
 }
`;

export const Container = styled.div`

  margin: 0 auto;
   width: 100%;
   position: relative;
   max-width: 1300px;
   margin-top: 5em;
   display: flex;
   flex-wrap: wrap;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   margin-bottom: 3em;
 


  @media screen  and (max-width: 590px){
        flex-wrap: nowrap;
       flex-direction: column;
       align-items: normal;
         justify-content: none;
  }
  
`

export const Slider = styled.div`
  display: flex;
  align-items: center;
  position: relative;
 
  @media (max-width: 768px) {
    height: 400px;
  }
`

export const SlideButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  z-index: 10;
  position: absolute;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
  
  &.left {
    left: 20px;
  }
  
  &.right {
    right: 20px;
  }
`

export const MainContent = styled.div`
  display: flex;
  width: 100%;
  padding: 0 100px;
  
  @media (max-width: 768px) {
    padding: 0 40px;
  }
`

export const TextContent = styled.div`
  max-width: 300px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`

export const Title = styled.h1`
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`

export const Description = styled.p`
  font-size: 12px;
  line-height: 1.5;
  color: #ccc;
`

export const VideoSection = styled.div`
  width: 90%;
  height: 200px;
  border-radius: 9px;
  border: 1px solid #3a3b3b;
  position: relative;
  background-image: url('/theim/backgrounds/20230816_13375833455.webp');
  background-size: 50%;
  background-position: center;
  margin-bottom: 20px;
 
    @media screen  and (max-width: 590px){
     width: 90%;
  }
  
  
`

export const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.507);
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  justify-content: center;

  li{

    h4{
      font-family: 'Akrobat';
      text-transform: uppercase;
         color: #dee1e2;
         font-size: 14px;
    }

    p{
      font-family: 'ldvision', sans-serif;
      text-transform: uppercase;
      color: #c9cbcc;
      font-size: 12px;
    }
  }
`

export const PlayButton = styled.button`
  background: rgb(34, 214, 109);
  border: none;
  width: 50px;
  height: 50px;
  transform: rotate(-14deg);
  border: none;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
 
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`

export const VideoText = styled.div`
  text-align: center;
  
  span {
    font-size: 72px;
    font-weight: 800;
    letter-spacing: 2px;
    color: white;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
  
  h2 {
    font-size: 18px;
    font-weight: 500;
    margin-top: 10px;
  }
`

export const ThumbnailsContainer = styled.div`
  display: grid;
  width: 40vw;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 0 20px;
  position: relative;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

   @media screen  and (max-width: 590px){
       width: 100vw;
  }
  
`

export const Thumbnail = styled.button`
  height: 70px;
  width: 100%;
  position: relative;
   border-radius: 9px;
  border: 1px solid #3a3b3b;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.03);
  }
`

export const MorePhotosButton = styled.button`
   border-radius: 9px;
  border: 1px solid #3a3b3b;
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`

export const LightboxContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  
  height: 100%;
 backdrop-filter: blur(12px);
  z-index: 999;
  display: flex;
  flex-direction: column;
`

export const LightboxClose = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 1010;
`

export const LightboxContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

export const LightboxImage = styled.div`
  width: 80%;
  height: 80%;
  position: relative;

   img{
    border-radius: 22px;
  }
 
`

export const LightboxNavigation = styled.button`
  background: none;
  border: none;
  color: white;
 
  position: absolute;
  height: 100%;
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.left {
    left: 0;
  }
  
  &.right {
    right: 0;
  }
  
   
`

export const LightboxThumbnails = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  overflow-x: auto;
  border-radius: 12px;
  margin: 9px;
  background: rgba(37, 37, 37, 0.678);
`

export const LightboxThumbnail = styled.button<{ active: boolean }>`
  width: 100px;
  height: 60px;
  position: relative;
 
  border-radius: 4px;
  overflow: hidden;
  opacity: ${(props) => (props.active ? 1 : 0.6)};
  border: ${(props) => (props.active ? "2px solid #2eb476" : "none")};
   
  &:hover {
    opacity: 1;
  }
`