import styled, { keyframes } from "styled-components";
 

// Componente Principal que renderiza o skeleton
const SkeletonLoader = () => {
  return (
    <div>
      {/* Header Skeleton */}
      <SkeletonHeader />
      
      {/* Container com 10 cards de 240px */}
      <SkeletonCardContainer>
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </SkeletonCardContainer>

      {/* Container com cards em linha (flex row) */}
      <SkeletonRowContainer>
        {Array.from({ length: 35 }).map((_, index) => (
          <SkeletonRowCard key={index} />
        ))}
      </SkeletonRowContainer>
    </div>
  );
};

 

// Exportação do componente como default
export default SkeletonLoader;

// Componente alternativo com 45 cards em linha
export const SkeletonRowLoader = () => {
  return (
    <div>
  
      {/* Container com cards em linha (flex row) */}
      <SkeletonRowContainer>
        {Array.from({ length: 45 }).map((_, index) => (
          <SkeletonRowCard key={index} />
        ))}
      </SkeletonRowContainer>
    </div>
  );
};

 
// Animação de Skeleton
const skeletonAnimation = keyframes`
  

0% { background-color: rgba(137, 150, 145, 0.068);  }
10% { background-color: rgba(124, 121, 136, 0.096); }
40% { background-color: rgba(141, 137, 137, 0.096); }
70% { background-color: rgba(146, 146, 155, 0.089); }
80% { background-color: rgba(149, 149, 151, 0.137); }
100% { background-color: rgba(255, 255, 255, 0.041); }

`;

// Header
const SkeletonHeader = styled.div`
  width: 100%;
  height: 340px;
  background: rgba(224, 224, 224, 0.137);
  animation: ${skeletonAnimation} 1.5s infinite ease-in-out;
`;

// Container flexível para os cards com 10 cards
const SkeletonCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px;
  justify-content: space-between;
`;

// Card individual com animação de esqueleto
const SkeletonCard = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: rgba(224, 224, 224, 0.116);
  animation: ${skeletonAnimation} 1.5s infinite ease-in-out;
`;

// Cards com flex-direction row e flex-wrap
const SkeletonRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

// Card com altura de 250px e largura de 300px
const SkeletonRowCard = styled.div`
  width: 280px;
  height: 300px;
  background-color: #e0e0e01d;
  animation: ${skeletonAnimation} 1.5s infinite ease-in-out;
`;