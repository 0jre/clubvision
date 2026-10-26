import styled from 'styled-components';
import { VideoGroupProps } from './VideoGroup';
import { useState } from 'react';
import Scrollmargin from '../scrollingcard/scroll.xc';
const VideoCarousel: React.FC<VideoGroupProps> = ({ data = [] }) => {
  const [selectedVideo, setSelectedVideo] = useState(data[1]); // Inicializa com o segundo vídeo da lista

  const handleThumbnailClick = (video: any) => {
    setSelectedVideo(video); // Atualiza o vídeo selecionado
  };
  const sortedData = data.sort((a, b) => b.viewers - a.viewers);

  // Garantindo que data tenha pelo menos 3 itens
  if (!data || data.length < 1 || !data[2].channel) {
    return null; // Não renderiza nada se os dados não forem suficientes
  }
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0, // Não exibir casas decimais
      maximumFractionDigits: 0, // Não exibir casas decimais
    });
  };
  
  return (
    <Container>
      <ContainerNbx>
        <MarginSelectMN>
          <LeftPanel>
            <Info>
              <UserHeader>
                <ProfileLink  target="_blank" href={`https://twitch.tv/${selectedVideo.channel.display_name}`}>
                  <ProfileImage
                    src={selectedVideo.channel.logo}
                    alt={selectedVideo.channel.display_name}
                  />
                </ProfileLink>
                <UserName  target="_blank" href={`https://twitch.tv/${selectedVideo.channel.display_name}`}>{selectedVideo.channel.display_name}</UserName>
                <WatchingInfo>
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg" className="!size-4">
                    <path d="M4 19V28H7V22H16V28H28V19H4Z"></path>
                    <path d="M10.75 17.5C14.4775 17.5 17.5 14.4775 17.5 10.75C17.5 7.0225 14.4775 4 10.75 4C7.0225 4 4 7.0225 4 10.75C4 14.4775 7.0225 17.5 10.75 17.5ZM10.75 7C12.82 7 14.5 8.68 14.5 10.75C14.5 12.82 12.82 14.5 10.75 14.5C8.68 14.5 7 12.82 7 10.75C7 8.68 8.68 7 10.75 7Z"></path>
                    <path d="M23.5 17.5C25.9853 17.5 28 15.4853 28 13C28 10.5147 25.9853 8.5 23.5 8.5C21.0147 8.5 19 10.5147 19 13C19 15.4853 21.0147 17.5 23.5 17.5Z"></path>
                  </svg>
                  <span>
                    <text style={{ color: '#1bee8c' }}> {formatCurrency(selectedVideo.viewers)}</text> assistindo
                  </span>
                </WatchingInfo>
              </UserHeader>
              <Description target="_blank" href={`https://twitch.tv/${selectedVideo.channel.display_name}`}>
                {selectedVideo.channel.status}
              </Description>
            </Info>
            <TagsContainer>
              {selectedVideo.tags && selectedVideo.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer>
          </LeftPanel>
          <VideoGallery>
          <Scrollmargin>
          {sortedData.slice(0, 10).map((video, index) => (
        <ThumbnailButton
          key={index}
          onClick={() => handleThumbnailClick(video)}
          
        >
          <ThumbnailImage url={video.preview.medium}   style={{
            border: selectedVideo === video ? '2px solid #1fd187' : 'none',
          }}/>
        </ThumbnailButton>
      ))}
          </Scrollmargin>
            
          </VideoGallery>
        </MarginSelectMN>
        <iframe
  src={`https://player.twitch.tv/?channel=${selectedVideo.channel.display_name}&parent=${process.env.NEXT_PUBLIC_BASE_DOMAIN}&autoplay=true`}
  height={'340px'}
  width={'100%'}
  title={selectedVideo.channel.display_name}
  allowFullScreen={true}
/>

      </ContainerNbx>
    </Container>
  );
};

export default VideoCarousel;

const MarginSelectMN = styled.div`
  display: flex;
  flex-direction: column;

`;
const ContainerNbx = styled.div`
display: flex;
width: 100%;
padding: 1em;
justify-content: space-between;


@media screen and (max-width: 680px) {
  display: flex;
  padding: 0em;
  gap: 8px;
  flex-direction: column-reverse;
  justify-content: center;
}
`;

const LeftPanel = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
width: 480px;
max-width: 680px;
padding: 7px 0 2.5px;

@media screen and (max-width: 680px) {
  width: 100%;
  max-width: 680px;
}
`;

const Info = styled.div`
display: flex;
flex-direction: column;
align-items: start;
gap: 1.5rem;
min-width: 0;
`;

const UserHeader = styled.div`
display: flex;
align-items: center;
gap: 2rem;
`;

const ProfileLink = styled.a`
display: flex;
flex-shrink: 0;
height: fit-content;
width: fit-content;
`;

const ProfileImage = styled.img`
width: 44px; 
height: 44px;
border-radius: 50%;
`;

const UserName = styled.a`
display: inline-flex;
gap: 1.5rem;
align-items: center;
justify-content: center;
border-radius: 0.25rem;
font-weight: 600;
color: white;
transition: all 0.3s ease;
&:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}
`;

const WatchingInfo = styled.div`
display: flex;
align-items: center;
gap: 5px;
color: #d1d5db; 
font-size: 0.875rem;
font-weight: bold;
`;

export const Description = styled.a`
color: #d1d5db; 
&:hover {
  color: white;
}
`;

 const TagsContainer = styled.div`
display: flex;
flex-wrap: wrap;
align-items: center;
gap: 12px;
`;

const Tag = styled.a`
font-size: 12px;
background: rgba(0, 0, 0, 0.2); 
padding: 4px 8px;
border-radius: 16px;
color: #9ca3af; /
&:hover {
  color: white;
}
`;

const VideoGallery = styled.div`
 width: 450px;

 @media screen and (max-width: 680px) {
  width: 100%;
  max-width: 680px;
}
`;

const ThumbnailButton = styled.button`
min-width: 0;
flex-grow: 0;
flex-shrink: 0;
padding-left: 3px;

`;

interface ViewHeaderProps {
  url: string;
}
 
const ThumbnailImage = styled.div<ViewHeaderProps>`
background-image: ${({ url }) => `url('${url}')`};
background-position: center;
background-repeat: no-repeat;
background-size: cover;
width: 220px;
height: 130px;
border-radius: 0.5rem;
border: 2px solid transparent;
object-fit: cover;
transition: border-color 0.3s ease;
&:hover {
  border-color: white;
}
`;
 
const Container = styled.div`
  
/* 
  img {
    z-index: 0;
    opacity: 0.3;
    transition: opacity 0.3s ease;
    object-fit: cover;
    width: calc(100% / 2);
    filter: blur(12px);
    height: 80%;

    :hover {
      opacity: 1;
    }
  }

   

  @media (min-width: 640px) {
  }

  @media (min-width: 1280px) {
  } */


  iframe {
  
    border-radius: 19px;
   
  }
`;