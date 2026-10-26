import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Check, X, Volume2, VolumeX, Sparkles, Trophy, Flame } from 'lucide-react';

 

function App() {
  const [chance, setChance] = useState(35);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [won, setWon] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [balance, setBalance] = useState(100);
  const [streak, setStreak] = useState(0);
  const [sound, setSound] = useState(true);
  const [position, setPosition] = useState(0);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3');
  }, []);

  const playSound = () => {
    if (sound && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const startSpin = () => {
    if (isSpinning) return;
    
    setShowResult(false);
    setIsSpinning(true);
    playSound();
    
    const rotations = 3 + Math.random() * 2;
    const randomDegree = Math.random() * 360;
    const totalRotation = rotation + (360 * rotations) + randomDegree;
    
    setRotation(totalRotation);
    
    const landingPercentage = (randomDegree / 360) * 100;
    const hasWon = landingPercentage <= chance;
    
    setTimeout(() => {
      setIsSpinning(false);
      setWon(hasWon);
      setShowResult(true);
      
      if (hasWon) {
        setBalance(prev => prev + 50);
        setStreak(prev => prev + 1);
      } else {
        setBalance(prev => Math.max(0, prev - 10));
        setStreak(0);
      }
    }, 3000);
  };

  const resetSpinner = () => {
    setShowResult(false);
  };

  return (
    <Container>
      <SpinnerContainer $isSpinning={isSpinning}>
        {streak >= 3 && (
          <WinStreak $streak={streak}>
            <Flame size={16} />
            {streak}x
          </WinStreak>
        )}
        
        <OuterCircle $isWon={showResult && won}>
          <ProgressCircle $chance={chance} $position={position} />
          <CircleWrapper $rotation={rotation}>
            <Triangle $isSpinning={isSpinning} />
          </CircleWrapper>
          <InnerCircle $isFlipped={showResult}>
            <Content>
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{chance.toFixed(2)}%</span>
              <span style={{ fontSize: '0.875rem', color: '#64748B' }}>Chance de melhoramento</span>
            </Content>
            <Content $isBack $color={won ? '#3B82F6' : '#CC525F'}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: won ? '#3B82F6' : '#CC525F', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                {won ? (
                  <>
                    <Sparkles size={28} />
                    <span>GANHOU</span>
                    {streak >= 3 && <Trophy size={20} />}
                  </>
                ) : (
                  <>
                    <X size={28} />
                    <span>PERDEU</span>
                  </>
                )}
              </div>
            </Content>
          </InnerCircle>
        </OuterCircle>
      </SpinnerContainer>

      <Controls>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <label>Chance: {chance.toFixed(2)}%</label>
          <button 
            onClick={() => setSound(!sound)} 
            style={{ background: 'none', border: 'none', color: '#CCA25F', cursor: 'pointer' }}
          >
            {sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
        
        <Slider
          type="range"
          min="0"
          max="100"
          step="0.01"
          value={chance}
          onChange={(e) => setChance(Number(e.target.value))}
        />

        <PositionControls>
          <PositionButton $active={position === 0} onClick={() => setPosition(0)}>↑</PositionButton>
          <PositionButton $active={position === 90} onClick={() => setPosition(90)}>→</PositionButton>
          <PositionButton $active={position === 180} onClick={() => setPosition(180)}>↓</PositionButton>
          <PositionButton $active={position === 270} onClick={() => setPosition(270)}>←</PositionButton>
        </PositionControls>

        <BalanceDisplay $isPositive={balance > 0}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            {balance.toFixed(2)} R$
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748B' }}>Saldo</div>
        </BalanceDisplay>

        <Button onClick={startSpin} disabled={isSpinning}>
          {isSpinning ? (
            <>
              <span>Girando...</span>
              <Sparkles size={16} />
            </>
          ) : (
            <>
              <span>Girar para Ganhar</span>
              <Flame size={16} />
            </>
          )}
        </Button>

        {showResult && (
          <Button onClick={resetSpinner} $secondary>
            Tentar Novamente
          </Button>
        )}
      </Controls>
    </Container>
  );
}

export default App;


const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px #CCA25F; }
  50% { box-shadow: 0 0 20px #CCA25F; }
  100% { box-shadow: 0 0 5px #CCA25F; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Container = styled.div`
  min-height: 100vh;
  background-color: #0F1116;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(204, 162, 95, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(204, 162, 95, 0.05) 0%, transparent 20%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const SpinnerContainer = styled.div<{ $isSpinning: boolean }>`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 2rem 0;
  animation: ${props => props.$isSpinning ? glowAnimation : 'none'} 2s infinite;
`;

const OuterCircle = styled.div<{ $isWon?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid ${props => props.$isWon ? '#3B82F6' : '#CCA25F'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    width: 110%;
    height: 110%;
    border-radius: 50%;
    border: 1px solid ${props => props.$isWon ? '#3B82F6' : '#CCA25F'};
    opacity: 0.3;
  }
`;

const ProgressCircle = styled.div<{ $chance: number; $position: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip-path: circle(50% at center);
  background: conic-gradient(
    #CCA25F ${props => props.$chance}%,
    transparent ${props => props.$chance}%
  );
  opacity: 0.15;
  transform: rotate(${props => -90 + props.$position}deg);
  transition: transform 0.3s ease;
`;

const CircleWrapper = styled.div<{ $rotation: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(${props => props.$rotation}deg);
  transition: transform 3s cubic-bezier(0.1, 0.7, 0.1, 1);
`;

const Triangle = styled.div<{ $isSpinning: boolean }>`
  position: absolute;
  top: 10px;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 20px solid #CCA25F;
  transform: translateX(-50%);
  filter: drop-shadow(0 0 5px rgba(204, 162, 95, 0.5));
  
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #CCA25F;
    border-radius: 50%;
    left: -4px;
    top: -24px;
    transition: transform 0.3s ease;
    transform: scale(${props => props.$isSpinning ? 1.2 : 1});
  }
`;

const InnerCircle = styled.div<{ $isFlipped: boolean }>`
  position: absolute;
  width: 80%;
  height: 80%;
  left: 10%;
  top: 10%;
  background: #171923;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  transition: transform 0.8s;
  transform: ${props => props.$isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'};
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
`;

const Content = styled.div<{ $isBack?: boolean; $color?: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  transform: ${props => props.$isBack ? 'rotateY(180deg)' : 'rotateY(0)'};
  border-radius: 50%;
  ${props => props.$isBack && `
    border: 4px solid ${props.$color || '#CCA25F'};
    background: rgba(23, 25, 35, 0.9);
  `}
`;

const Controls = styled.div`
  width: 100%;
  max-width: 300px;
  margin-top: 2rem;
  background: rgba(23, 25, 35, 0.5);
  padding: 1.5rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
`;

const Slider = styled.input`
  width: 100%;
  height: 8px;
  background: #2D3748;
  border-radius: 4px;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #CCA25F;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 0 10px rgba(204, 162, 95, 0.3);

    &:hover {
      background: #D9B675;
      transform: scale(1.1);
    }
  }
`;

const Button = styled.button<{ $secondary?: boolean }>`
  width: 100%;
  background: ${props => props.$secondary ? '#2D3748' : '#CCA25F'};
  color: ${props => props.$secondary ? 'white' : '#171923'};
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BalanceDisplay = styled.div<{ $isPositive: boolean }>`
  text-align: center;
  margin: 2rem 0;
  position: relative;
  animation: ${floatAnimation} 3s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: -1rem;
    left: 0;
    right: 0;
    height: 1px;
    background: #1F1F27;
  }
`;

const WinStreak = styled.div<{ $streak: number }>`
  position: absolute;
  top: -2rem;
  right: -2rem;
  background: ${props => props.$streak >= 3 ? '#EF4444' : '#3B82F6'};
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: ${pulseAnimation} 1s infinite;
`;

const PositionControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PositionButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.5rem;
  background: ${props => props.$active ? '#CCA25F' : '#2D3748'};
  border: none;
  border-radius: 0.25rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;