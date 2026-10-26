"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { X, Sparkles, Trophy, Flame } from "lucide-react"

interface SpinnerProps {
  probability?: number
  adjustedProbability?: number
  positionFactor?: number
  onSpinComplete?: (won: boolean) => void
  onPositionChange?: (position: number) => void
  isUpgradeMode?: boolean
  upgradeValue?: number
  disabled?: boolean
  resetTrigger?: number
  // PROPS PARA CONTROLE COMPLETO DA API
  apiResponse?: {
    success: boolean
    upgradeSuccess?: boolean
    probability: number
    positionFactor: number
    positionStrategy?: string
    calculation?: any
    result?: any
    processingTime?: number
  }
  forceResult?: boolean | null
  shouldSpin?: boolean
}

export default function SpinnerComponent({
  probability = 0,
  adjustedProbability,
  positionFactor = 0,
  onSpinComplete,
  onPositionChange,
  isUpgradeMode = true,
  upgradeValue = 0,
  disabled = false,
  resetTrigger = 0,
  apiResponse,
  forceResult = null,
  shouldSpin = false,
}: SpinnerProps) {
  const [chance, setChance] = useState(probability)
  const [adjustedChance, setAdjustedChance] = useState(adjustedProbability || probability)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [won, setWon] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [streak, setStreak] = useState(0)
  const [sound, setSound] = useState(true)
  const [position, setPosition] = useState(0)
  const spinnerRef = useRef<HTMLDivElement>(null)
  const spinnerSoundRef = useRef<HTMLAudioElement>(null)
  const successSoundRef = useRef<HTMLAudioElement>(null)
  const failedSoundRef = useRef<HTMLAudioElement>(null)

  // SINCRONIZAÇÃO 100% COM RESPOSTA DA API
  useEffect(() => {
    if (apiResponse) {
      console.log("🎯 Sincronizando spinner 100% com API:", apiResponse)

      // Usar dados EXATOS da API
      const apiProbability = apiResponse.calculation?.finalProbability || apiResponse.probability || 0
      setChance(apiProbability)
      setAdjustedChance(apiProbability)

      console.log("📊 Probabilidade sincronizada:", apiProbability)
    } else {
      // Fallback para props tradicionais
      setChance(probability || 0)
      setAdjustedChance(adjustedProbability || probability || 0)
    }
  }, [apiResponse, probability, adjustedProbability])

  // CONTROLE AUTOMÁTICO DE SPIN BASEADO 100% NA API
  useEffect(() => {
    if (shouldSpin && apiResponse && forceResult !== null) {
      console.log("🎰 Iniciando spin automático com resultado da API:", forceResult)
      startSpinWithApiResult(forceResult)
    }
  }, [shouldSpin, apiResponse, forceResult])

  useEffect(() => {
    // Assign only if current is null to avoid readonly error in strict mode
    if (!spinnerSoundRef.current) {
      ;(spinnerSoundRef as React.MutableRefObject<HTMLAudioElement | null>).current = new Audio(
        "/Sounds/upgrade-spinner.mp3",
      )
    }
    if (!successSoundRef.current) {
      ;(successSoundRef as React.MutableRefObject<HTMLAudioElement | null>).current = new Audio(
        "/Sounds/success_update-x.mp3",
      )
    }
    if (!failedSoundRef.current) {
      ;(failedSoundRef as React.MutableRefObject<HTMLAudioElement | null>).current = new Audio(
        "/Sounds/upgrade-failed.mp3",
      )
    }
  }, [])

  const playSpinnerSound = () => {
    if (sound && spinnerSoundRef.current) {
      spinnerSoundRef.current.currentTime = 0
      spinnerSoundRef.current.play()
    }
  }

  const playResultSound = (hasWon: boolean) => {
    if (!sound) return

    if (hasWon && successSoundRef.current) {
      successSoundRef.current.currentTime = 0
      successSoundRef.current.play()
    } else if (!hasWon && failedSoundRef.current) {
      failedSoundRef.current.currentTime = 0
      failedSoundRef.current.play()
    }
  }

  const SPIN_DURATION = 5200

  // FUNÇÃO PRINCIPAL: Spin com resultado 100% baseado na API
  const startSpinWithApiResult = (apiResult: boolean) => {
    if (isSpinning) return

    console.log("🎯 Iniciando spin com resultado 100% da API:", apiResult)

    setShowResult(false)
    setIsSpinning(true)
    playSpinnerSound()

    const rotations = 6 + Math.random() * 2
    const currentProbability = apiResponse?.calculation?.finalProbability || adjustedChance

    // Calcular ângulo baseado EXATAMENTE no resultado da API
    let randomDegree
    if (apiResult) {
      // VITÓRIA: Ângulo dentro da área de vitória (0 até probabilidade%)
      randomDegree = Math.random() * (currentProbability * 3.6)
      console.log("✅ Configurando ângulo para VITÓRIA:", randomDegree)
    } else {
      // DERROTA: Ângulo fora da área de vitória (probabilidade% até 100%)
      randomDegree = currentProbability * 3.6 + Math.random() * ((100 - currentProbability) * 3.6)
      console.log("❌ Configurando ângulo para DERROTA:", randomDegree)
    }

    const totalRotation = rotation + 360 * rotations + randomDegree
    setRotation(totalRotation)

    setTimeout(() => {
      if (spinnerSoundRef.current) spinnerSoundRef.current.pause()
      setIsSpinning(false)
      setWon(apiResult)
      setShowResult(true)
      playResultSound(apiResult)

      // Notificar o componente pai com dados completos da API
      if (onSpinComplete) {
        console.log("📤 Notificando componente pai com resultado da API:", {
          won: apiResult,
          apiResponse,
          processingTime: apiResponse?.processingTime,
        })
        onSpinComplete(apiResult)
      }
    }, SPIN_DURATION)
  }

  // FUNÇÃO ORIGINAL: Spin manual (para testes ou modo manual)
  const startSpin = () => {
    if (isSpinning || disabled || chance === 0) return

    console.log("🎰 Iniciando spin manual...")

    setShowResult(false)
    setIsSpinning(true)
    playSpinnerSound()

    const rotations = 6 + Math.random() * 2
    const random = Math.random() * 100
    const hasWon = random <= adjustedChance

    // Calcula o ângulo de parada fiel ao resultado
    let randomDegree
    if (hasWon) {
      // Ângulo dentro da área de vitória (0 até chance%)
      randomDegree = Math.random() * (adjustedChance * 3.6)
    } else {
      // Ângulo fora da área de vitória (chance% até 100%)
      randomDegree = adjustedChance * 3.6 + Math.random() * ((100 - adjustedChance) * 3.6)
    }

    const totalRotation = rotation + 360 * rotations + randomDegree
    setRotation(totalRotation)

    setTimeout(() => {
      if (spinnerSoundRef.current) spinnerSoundRef.current.pause()
      setIsSpinning(false)
      setWon(hasWon)
      setShowResult(true)
      playResultSound(hasWon)
      if (onSpinComplete) onSpinComplete(hasWon)
    }, SPIN_DURATION)
  }

  const resetSpinner = () => {
    console.log("🔄 Resetando spinner...")
    setShowResult(false)
    setWon(false)
  }

  // RESET COMPLETO quando resetTrigger muda
  useEffect(() => {
    console.log("🔄 Reset trigger acionado:", resetTrigger)
    setShowResult(false)
    setIsSpinning(false)
    setWon(false)
    setRotation(0)
    setPosition(0)
  }, [resetTrigger])

  // Função para atualizar posição e notificar o pai
  const handlePositionChange = (newPosition: number) => {
    setPosition(newPosition)
    if (onPositionChange) {
      onPositionChange(newPosition)
    }
  }

  // CALCULAR VALORES PARA EXIBIÇÃO (com dados da API se disponível)
  const displayProbability = apiResponse?.calculation?.finalProbability || adjustedChance
  const displayPositionFactor = apiResponse?.positionFactor || positionFactor

  return (
    <>
      <SpinnerContainer $isSpinning={isSpinning}>
        {streak >= 3 && (
          <WinStreak $streak={streak}>
            <Flame size={16} />
            {streak}x
          </WinStreak>
        )}

        <OuterCircle $isWon={showResult && won}>
          {/* Só mostra o preenchimento se chance > 0 */}
          {displayProbability > 0 && <ProgressCircle $chance={displayProbability} $position={position} />}
          <CircleWrapper $rotation={rotation} $spinDuration={SPIN_DURATION}>
            <Triangle $isSpinning={isSpinning} />
          </CircleWrapper>
          <InnerCircle $isFlipped={showResult}>
            <Content>
              <span style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{displayProbability.toFixed(2)}%</span>
              {displayPositionFactor > 0 && (
                <span style={{ fontSize: "0.75rem", color: "#4ADE80" }}>
                  +{displayPositionFactor.toFixed(1)}% (posição)
                </span>
              )}
              <span style={{ fontSize: "0.875rem", color: "#64748B" }}>
            
              </span>
             
            </Content>
            <Content $isBack $color={won ? "#3B82F6" : "#CC525F"}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: won ? "#3B82F6" : "#CC525F",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
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

      {isUpgradeMode && (
        <Controls>
    
          <PositionControls>
            <PositionButton
              $active={position === 0}
              onClick={() => handlePositionChange(0)}
              disabled={isSpinning || disabled}
            >
              ←
            </PositionButton>

            <PositionButton
              $active={position === 180}
              onClick={() => handlePositionChange(180)}
              disabled={isSpinning || disabled}
            >
              →
            </PositionButton>

            <PositionButton
              $active={position === 270}
              onClick={() => handlePositionChange(270)}
              disabled={isSpinning || disabled}
            >
              ↓
            </PositionButton>

            <PositionButton
              $active={position === 90}
              onClick={() => handlePositionChange(90)}
              disabled={isSpinning || disabled}
            >
              ↑
            </PositionButton>
          </PositionControls>

          {displayPositionFactor > 0 && (
            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <span style={{ fontSize: "0.875rem", color: "#4ADE80" }}>
                Bônus de posição: +{displayPositionFactor.toFixed(1)}%
              </span>
            </div>
          )}

          {showResult && (
            <Button onClick={resetSpinner} $secondary>
              Tentar Novamente
            </Button>
          )}
        </Controls>
      )}
 
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Button onClick={startSpin} disabled={isSpinning || disabled || chance === 0}>
            {isSpinning ? (
              <>
                <span>Girando...</span>
              </>
            ) : (
              <>
                <span>Upgrader</span>
              </>
            )}
          </Button>
        </div>
     
    </>
  )
}

// Styled Components (mantendo os mesmos do código original)
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px #5fcc9f; }
  50% { box-shadow: 0 0 20px #5fcc83; }
  100% { box-shadow: 0 0 5px #5fcc89; }
`

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`

const SpinnerContainer = styled.div<{ $isSpinning: boolean }>`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 2rem 0;
`

const OuterCircle = styled.div<{ $isWon?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid ${(props) => (props.$isWon ? "#3B82F6" : "#3abd71")};
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
    border: 1px solid ${(props) => (props.$isWon ? "#3B82F6" : "#3abd71")};
    opacity: 0.3;
  }
`

const ProgressCircle = styled.div<{ $chance: number; $position: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip-path: circle(50% at center);
  background: conic-gradient(
    #3abd71 ${(props) => props.$chance}%,
    transparent ${(props) => props.$chance}% 100%
  );
  opacity: 0.18;
  transform: rotate(${(props) => -90 + props.$position}deg);
  transition:
    background 1.2s cubic-bezier(0.4, 0.2, 0.2, 1),
    transform 1.2s cubic-bezier(0.4, 0.2, 0.2, 1);
`

const CircleWrapper = styled.div<{ $rotation: number; $spinDuration: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(${(props) => props.$rotation}deg);
  transition: transform ${(props) => props.$spinDuration}ms cubic-bezier(0.1, 0.7, 0.1, 1);
`

const InnerCircle = styled.div<{ $isFlipped: boolean }>`
  position: absolute;
  width: 80%;
  height: 80%;
  left: 10%;
  top: 10%;
  background: #1f2421;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  transition: transform 1.2s;
  transform: ${(props) => (props.$isFlipped ? "rotateY(180deg)" : "rotateY(0)")};
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
`

const Triangle = styled.div<{ $isSpinning: boolean }>`
  position: absolute;
  top: 10px;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 20px solid #3abd71;
  transform: translateX(-50%);
  filter: drop-shadow(0 0 5px rgba(95, 204, 153, 0.5));
  
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #3abd71;
    border-radius: 50%;
    left: -4px;
    top: -24px;
    transition: transform 0.3s ease;
    transform: scale(${(props) => (props.$isSpinning ? 1.2 : 1)});
  }
`

const Content = styled.div<{ $isBack?: boolean; $color?: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  transform: ${(props) => (props.$isBack ? "rotateY(180deg)" : "rotateY(0)")};
  border-radius: 50%;
  ${(props) =>
    props.$isBack &&
    `
    border: 4px solid ${props.$color || "#3abd71"};
    background: rgba(23, 25, 35, 0.9);
  `}
`

const Controls = styled.div`
  width: 100%;
  max-width: 300px;
  background: rgba(35, 36, 35, 0.767);
  padding: 1.5rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
`

const Button = styled.button<{ $secondary?: boolean }>`
  width: 100%;
  background: ${(props) => (props.$secondary ? "rgba(67, 145, 106, 0.397)" : "#2b2e2c")};
  color: ${(props) => (props.$secondary ? "white" : "#474b49")};
  padding: 0.75rem;
  border-radius: 15rem;
  font-weight: 600;
  border: none;
  margin-top: 1rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  font-family: 'XcSemibold', sans-serif;
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
`

const WinStreak = styled.div<{ $streak: number }>`
  position: absolute;
  top: -2rem;
  right: -2rem;
  background: ${(props) => (props.$streak >= 3 ? "#EF4444" : "#3B82F6")};
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: ${pulseAnimation} 1s infinite;
`

const PositionControls = styled.div`
  display: flex;
  gap: 0.5rem;
`

const PositionButton = styled.button<{ $active: boolean; disabled?: boolean }>`
  flex: 1;
  padding: 0.5rem;
  height: 40px; 
  width: 40px;
  background: ${(props) => (props.$active ? "#2d523c" : "#2c302d")};
  border: none;
  border-radius: 45rem;
  color: white;
  transition: all 0.2s;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    cursor: not-allowed;
  }
`
