import styled, { keyframes } from 'styled-components';
import { useState, useEffect } from 'react';
import Link from 'next/link';


interface User {
  id: string;
  avatar: string;
}

interface BackgroundAnimationProps {
  users: User[];
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ users }) => {
  const totalAvatars = 1;

  const [avatars, setAvatars] = useState<{ x: number; delay: number }[]>([]);

  useEffect(() => {
    const generateAvatars = () => {
      const newAvatars: { x: number; delay: number }[] = [];
      for (let i = 0; i < totalAvatars; i++) {
        newAvatars.push({ x: Math.random() * window.innerWidth, delay: Math.random() * 5 });
      }
      setAvatars(newAvatars);
    };

    generateAvatars();
  }, []);

  return (
    <div style={{ position: 'fixed', top: '1',width: '100%', overflow: 'hidden' }}>
      {avatars.map((avatar, index) => (
        <AvatarContainer key={index} x={avatar.x} delay={avatar.delay}>
          <AvatarImage src={`${users[index % users.length].avatar}`} alt={`User ${index}`} />
        </AvatarContainer>
      ))}
    </div>
  );
};

export default BackgroundAnimation;



const rainAnimation = keyframes`
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(200px, 200px);
  }
  50% {
    transform: translate(200px, 0);
  }
  75% {
    transform: translate(100px, 200px);
  }
  100% {
    transform: translate(200px, 0);
  }
`;

const AvatarImage = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  padding: 25px;
  opacity: 0.4;
`;

const AvatarContainer = styled.div<{ x: number; delay: number }>`
 
  height: 290px;
  width: 100%;
 
  margin-top: -100px;
  left: ${(props) => props.x}px;
  animation: ${rainAnimation} 5s linear ${(props) => props.delay}s infinite;
`;