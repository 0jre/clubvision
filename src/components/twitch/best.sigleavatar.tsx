import React from 'react';
import styled from 'styled-components';

interface VideoSingleProps {
  avatar: string;
  displayName?: string; // Se você quiser exibir o nome do canal ao passar
  url?: string; // Para redirecionar ao clicar no avatar
}

const BestSigle: React.FC<VideoSingleProps> = ({ avatar, displayName, url }) => {
  return (
    <Avatar>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img src={avatar} alt={displayName || 'Channel Avatar'} />
      </a>
      {displayName && <p>{displayName}</p>}  
    </Avatar>
  );
};

export default BestSigle;


/// 


const Avatar = styled.div`
display: flex;
flex-direction: column;
align-items: center;
   
   img{
    width: 90px;
    border-radius: 50%;
    height: 90px;
    border-image: linear-gradient(45deg, #e20f33, #25eb88) 1;
   }
  
  p{
    font-family: 'ProximaNova-Italic', sans-serif;
    color: rgb(137, 141, 143);
    font-size: 13px;
  }

`;