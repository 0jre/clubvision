import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Key } from 'iconsax-react';

const pulseShadow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
    transform: scale(1.1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    transform: scale(1);
  }
`;

const Wrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  cursor: pointer;
`;

const Dot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  animation: ${pulseShadow} 1.6s infinite;
`;

const TooltipBox = styled.div<{ visible: boolean }>`
  position: absolute;
  bottom: 28px;
  right: 0;
   background: linear-gradient(204deg, #c7ceca40 -7%, #b85cff00 33%), linear-gradient(162deg, #c7ceca40 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  border: 1px solid #222423;
  color: #636664;
 
  border-radius: 12px;
  padding: 12px 16px;
  width: 260px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) =>
    visible ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 0.3s ease;
  font-family: 'InterSemiBold', monospace;
  font-size: 11px;
  text-transform: uppercase;
 
  
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
  gap: 8px;
`;

const Keys = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  width: 100%;
  margin-top: 6px;
`;

const KeyCap = styled.div`
  background: white;
  color: black;
  padding: 4px 10px;
  border-radius: 54px;
  font-weight: 700;
  font-size: 12px;
`;

const ViewPageInfo: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <Wrapper onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* <Dot />
      <TooltipBox visible={hovered}>
        <Row>
          <Key size={16} color="#636664" variant="Bold" />
          Acesso administrativo
        </Row>
        <Keys>
          <KeyCap>CTRL</KeyCap>
          <KeyCap>ALT</KeyCap>
          <KeyCap>V</KeyCap>
        </Keys>
       
      </TooltipBox> */}
    </Wrapper>
  );
};

export default ViewPageInfo;
