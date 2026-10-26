"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import styled, { keyframes } from "styled-components"
import axios from 'axios';
import { GetInfo_nvxre_level } from "@/hooks/infolevel";


// Exporte uma função global para disparar o level up
let triggerLevelUp: ((level: number) => void) | null = null;
export function showLevelUp(level: number) {
  if (triggerLevelUp) triggerLevelUp(level);
}
 
const LevelUpCelebration:  React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [previousLevel, setPreviousLevel] = useState(0);
  const lastUpdateLevel = useRef<string | null>(null);
 const { isLoadinglevel, Datalevel } = GetInfo_nvxre_level();


  useEffect(() => {
    triggerLevelUp = (newLevel: number) => {
      setPreviousLevel(currentLevel);
      setCurrentLevel(newLevel);
      setIsVisible(true);
    };
    return () => { triggerLevelUp = null; };
    // eslint-disable-next-line
  }, [currentLevel]);

   useEffect(() => {
     
    if (!isLoadinglevel && Datalevel ) {
     const user = Datalevel;

      if (
        user.animated === false &&
        user.updatelevel &&
        user.updatelevel !== lastUpdateLevel.current
      ) {
        setPreviousLevel(user.level - 1);
        setCurrentLevel(user.level);
        setIsVisible(true);
        lastUpdateLevel.current = user.updatelevel;
      }
    }
  }, [Datalevel,isLoadinglevel])
  

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsVisible(false), 6000);
       // Após mostrar animação, marque animated como true
      axios.post(`/api/level/level.nvrp`, { animated: true });
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isVisible) {
      const audio = new Audio('/Sounds/multi-lay.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.error('Erro ao tocar som:', e));
      audioRef.current = audio;
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    }
  }, [isVisible]);

  
 
  if (!isVisible) return null;

  return (
    <CelebrationOverlay>
      {/* Partículas de fundo */}
      <ParticleContainer>
        {Array.from({ length: 50 }).map((_, i) => (
          <Particle key={i} delay={i * 0.1} />
        ))}
      </ParticleContainer>

      {/* Explosão de luz central */}
      <LightExplosion />

      {/* Ondas de energia */}
      <EnergyWave delay={0} />
      <EnergyWave delay={0.5} />
      <EnergyWave delay={1} />

      {/* Container principal */}
      <MainContainer>
        {/* Anel de nível rotativo */}
        <LevelRing>
          <LevelRingInner>
            <LevelNumber>{currentLevel}</LevelNumber>
          </LevelRingInner>
          <LevelRingGlow />
        </LevelRing>

        {/* Texto principal */}
        <MainText>
          <LevelUpText>LEVEL UP!</LevelUpText>
          <SubText>Você alcançou o nível {currentLevel}</SubText>
        </MainText>

         
      </MainContainer>

      {/* Confetes flutuantes */}
      <ConfettiContainer>
        {Array.from({ length: 30 }).map((_, i) => (
          <Confetti key={i} delay={i * 0.2} color={i % 3} />
        ))}
      </ConfettiContainer>

      {/* Raios de luz */}
      <LightRaysContainer>
        {Array.from({ length: 8 }).map((_, i) => (
          <LightRay key={i} rotation={i * 45} delay={i * 0.1} />
        ))}
      </LightRaysContainer>
    </CelebrationOverlay>
  )
}

// Animações principais
const fadeInScale = keyframes`
  0% { opacity: 0; transform: scale(0.3) rotate(-180deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(0deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
`

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px #41b45e, 0 0 40px #41b45e, 0 0 60px #41b45e; }
  50% { box-shadow: 0 0 40px #41b45e, 0 0 80px #41b45e, 0 0 120px #41b45e; }
`

const rotateRing = keyframes`
  0% { transform: rotate(0deg) scale(0.5); opacity: 0; }
  50% { transform: rotate(180deg) scale(1.1); opacity: 1; }
  100% { transform: rotate(360deg) scale(1); opacity: 1; }
`

const textGlow = keyframes`
  0%, 100% { text-shadow: 0 0 10px #41b45e, 0 0 20px #41b45e, 0 0 30px #41b45e; }
  50% { text-shadow: 0 0 20px #41b45e, 0 0 40px #41b45e, 0 0 60px #41b45e; }
`

const particleFloat = keyframes`
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
`

const energyWave = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`

const lightExplosion = keyframes`
  0% { transform: scale(0); opacity: 1; }
  50% { transform: scale(2); opacity: 0.8; }
  100% { transform: scale(4); opacity: 0; }
`

const confettiFall = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
`

const lightRayRotate = keyframes`
  0% { transform: rotate(var(--rotation)) scale(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: rotate(calc(var(--rotation) + 360deg)) scale(1); opacity: 0; }
`

const slideInUp = keyframes`
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`

const bounceIn = keyframes`
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  50% { transform: scale(1.3) rotate(0deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`

// Componentes estilizados
const CelebrationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(145deg, rgba(26, 28, 27, 0.274) 0%, rgba(15, 17, 16, 0.356) 100%);

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
`

const ParticleContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

const Particle = styled.div<{ delay: number }>`
  position: absolute;
  width: 4px;
  height: 4px;
  background: #41b45e;
  border-radius: 50%;
  left: ${Math.random() * 100}%;
  animation: ${particleFloat} ${3 + Math.random() * 2}s linear infinite;
  animation-delay: ${(props) => props.delay}s;
  box-shadow: 0 0 6px #41b45e;
`

const LightExplosion = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #41b45e 0%, transparent 70%);
  border-radius: 50%;
  animation: ${lightExplosion} 2s ease-out;
`

const EnergyWave = styled.div<{ delay: number }>`
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid #41b45e;
  border-radius: 50%;
  animation: ${energyWave} 2s ease-out infinite;
  animation-delay: ${(props) => props.delay}s;
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  z-index: 10;
  animation: ${fadeInScale} 1.5s ease-out;
`

const LevelRing = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  animation: ${rotateRing} 2s ease-out;
`

const LevelRingInner = styled.div`
  width: 100%;
  height: 100%;
  border: 4px solid #41b45e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    inset 0 0 20px rgba(65, 180, 94, 0.2);
  position: relative;
  z-index: 2;
`

const LevelRingGlow = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #41b45e, transparent, #41b45e);
  animation: ${pulseGlow} 2s ease-in-out infinite;
  z-index: 1;
`

const LevelNumber = styled.div`
  font-family: 'Poppins', sans-serif;
  font-size: 4rem;
  font-weight: 600;
  color: #41b45e;
  animation: ${textGlow} 2s ease-in-out infinite;
`

const MainText = styled.div`
  text-align: center;
  animation: ${slideInUp} 1s ease-out 0.5s both;
`

const LevelUpText = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 3.5rem;
  font-weight: 600;
  color: #41b45e;
  margin: 0;
  animation: ${textGlow} 2s ease-in-out infinite;
  text-transform: uppercase;
  letter-spacing: 0.2em;
`

const SubText = styled.p`
  font-family: 'Europa Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
  color: #ffffff;
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
`

const StatsContainer = styled.div`
  display: flex;
  gap: 2rem;
  animation: ${slideInUp} 0.8s ease-out both;
`

const StatItem = styled.div<{ delay: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  border: 1px solid #2d302e;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  animation: ${bounceIn} 0.6s ease-out both;
  animation-delay: ${(props) => props.delay}s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
  }
`

const StatIcon = styled.div`
  font-size: 2rem;
  filter: drop-shadow(0 0 10px #41b45e);
`

const StatText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #41b45e;
  font-size: 0.9rem;
`

const RewardsContainer = styled.div`
  text-align: center;
  animation: ${slideInUp} 0.8s ease-out both;
`

const RewardsTitle = styled.h3`
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 1rem;
  animation: ${textGlow} 3s ease-in-out infinite;
`

const RewardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const RewardItem = styled.div<{ delay: number }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  border: 1px solid #2d302e;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: ${slideInUp} 0.6s ease-out both;
  animation-delay: ${(props) => props.delay}s;
`

const RewardIcon = styled.div`
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px #41b45e);
`

const RewardText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  color: #ffffff;
  font-size: 1rem;
`

const ContinueButton = styled.button`
  position: relative;
  padding: 1rem 2.5rem;
  background: linear-gradient(145deg, #41b45e 0%, #2d7a3e 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  animation: ${slideInUp} 0.8s ease-out 1s both;
  box-shadow: 0 10px 25px rgba(65, 180, 94, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(65, 180, 94, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`

const ButtonGlow = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: ${keyframes`
    0% { left: -100%; }
    100% { left: 100%; }
  `} 2s ease-in-out infinite;
`

const ButtonText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  color: #ffffff;
  position: relative;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`

const ConfettiContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

const Confetti = styled.div<{ delay: number; color: number }>`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${(props) => {
    const colors = ["#41b45e", "#ffffff", "#ffd700"]
    return colors[props.color]
  }};
  left: ${Math.random() * 100}%;
  animation: ${confettiFall} ${2 + Math.random() * 2}s linear infinite;
  animation-delay: ${(props) => props.delay}s;
  border-radius: 2px;
  box-shadow: 0 0 6px currentColor;
`

const LightRaysContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

const LightRay = styled.div<{ rotation: number; delay: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 200px;
  background: linear-gradient(to bottom, #41b45e, transparent);
  transform-origin: center bottom;
  --rotation: ${(props) => props.rotation}deg;
  animation: ${lightRayRotate} 3s ease-out;
  animation-delay: ${(props) => props.delay}s;
  box-shadow: 0 0 10px #41b45e;
`

export default LevelUpCelebration
