"use client"
import styled, { keyframes } from "styled-components"
import { X } from 'lucide-react'
import LogoVision from "@/components/vision/logo"
import ROUTENVX from "@/routes/routes"
import router from 'next/router';

// Floating animations for bills
const floatingBill1 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`

const floatingBill2 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
`

const floatingBill3 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(1deg); }
  50% { transform: translateY(-8px) rotate(-1deg); }
`

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(8, 10, 13, 0.9);
  backdrop-filter: blur(3px);
  z-index: 1000;
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  padding: 16px;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`

const ModalContainer = styled.div`
  position: relative;
  margin: auto;
  width: 100%;
  max-width: 600px;
  border-radius: 18px;
 background: linear-gradient(rgb(223, 226, 224) 0%, rgba(16, 185, 129, 0.3) 100%);
  
  overflow: hidden;
`

const DecorativeImage1 = styled.img`
  pointer-events: none;
  position: absolute;
  left: -350px;
  top: -330px;
  z-index: -1;
  width: 800px;
  max-width: none;
  object-fit: contain;
`

const DecorativeImage2 = styled.img`
  pointer-events: none;
  position: absolute;
  bottom: -340px;
  right: -270px;
  z-index: 20;
  width: 700px;
  max-width: none;
  object-fit: contain;

  @media (min-width: 640px) {
    width: 760px;
  }
`

const DecorativeImage3 = styled.img`
  pointer-events: none;
  position: absolute;
  right: 10px;
  top: -150px;
  z-index: 10;
  display: none;
  width: 300px;
  max-width: none;
  object-fit: contain;

  @media (min-width: 640px) {
    display: block;
  }
`

const FloatingBill1 = styled.img`
  pointer-events: none;
  position: absolute;
  left: 10px;
  top: 20px;
  width: 60px;
  animation: ${floatingBill1} 3s ease-in-out infinite;

  @media (min-width: 640px) {
    left: 50px;
  }
`

const FloatingBill2 = styled.img`
  pointer-events: none;
  position: absolute;
  right: -46px;
  top: 69px;
  z-index: 1;
  width: 100px;
  animation: ${floatingBill2} 4s ease-in-out infinite;
`

const FloatingBill3 = styled.img`
  pointer-events: none;
  position: absolute;
  bottom: 50px;
  left: 0;
  width: 110px;
  animation: ${floatingBill3} 3.5s ease-in-out infinite;

  @media (min-width: 640px) {
    left: 40px;
  }
`

const BorderOverlay = styled.div`
 
  display: none;
  padding: 0.5em;
  border-radius: 18px;
  border: 1px solid #047857;

  @media (min-width: 640px) {
    display: block;
  }
`

const ModalContent = styled.div`
  position: relative;
  display: flex;
  height: fit-content;
  max-height: 100%;
  width: 100%;
  flex-direction: column;
  space-y: 0;
  overflow: hidden;
  border-radius: inherit;
  padding: 16px;
  padding-bottom: 96px;

  @media (min-width: 640px) {
    space-y: 2px;
  }

  @media (min-width: 768px) {
    space-y: 2px;
  }
`

const BackgroundText = styled.div`
  pointer-events: none;
  position: absolute;
  bottom: -4px;
  left: -8px;
  right: -8px;
  z-index: 10;
  user-select: none;
  
  white-space: nowrap;
  font-size-adjust: 0.9;
  font-family: 'XcSemibold', monospace;
  font-size: 64px;
  text-transform: uppercase;
  line-height: 0.4;
  color: rgba(16, 185, 129, 0.3);
  font-weight: 700;
`

const CloseButton = styled.button`
  position: absolute;
  right: 16px;
  top: 16px;
  display: grid;
  height: 35px;
  width: 35px;
  flex-shrink: 0;
  place-content: center;
  border-radius: 50%;
  background: rgba(15, 25, 18, 0.247);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(19, 22, 21, 0.568);
    color: rgba(255, 255, 255, 0.8);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
 
`

const HeaderSection = styled.div`
  margin: 0 auto;
  margin-top: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .referral-info {
    border-bottom: 1px solid #3bda90;
   
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    line-height: 1;
    color: white;
  }

  .welcome-title {
    margin-top: 20px;
    max-width: 10em;
    text-align: center;
    font-family: 'XcSemibold', monospace;
    font-size: 36px;
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
    color: white;

    @media (min-width: 1536px) {
      font-size: 50px;
      line-height: 0.7;
    }
  }
`

const PromotionSection = styled.h3`
  margin: 40px 0;
  text-align: center;
  font-size: 16px;
  color: white;

  .bonus-title {
    margin-bottom: 12px;
    text-align: center;
    font-family: 'XcSemibold', monospace;
    font-size: 36px;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 0.7;
    color: #3bda90;

    @media (min-width: 1536px) {
      font-size: 50px;
      line-height: 0.7;
    }
  }

  .bonus-description {
    display: inline-block;
    border-radius: 4px;
    background: rgba(29, 32, 29, 0.5);
    padding: 8px 16px;
    font-size: 14px;
    max-width: 440px;
    font-family: 'ProximaNova-Italic', sans-serif;
    font-weight: 500;

    .highlight {
      margin-left: 4px;
      font-weight: 700;
      color: #3bda90;
    }
  }
`

const ActionButton = styled.button`
  position: relative;
 
  margin: 0 auto;
  height: 52px;
  width: min-content;
  border-radius: 46px;
  background: #3bda90;
  padding: 0 40px;
  font-size: 14px;
  font-weight: 600;
  color: #0f1419;
  z-index: 1;
  border: none;
  cursor: var(--f-cursor-pointer);
  transition: all 0.2s ease;
  white-space: nowrap;
 text-transform: uppercase;
  &:hover {
    background: rgb(223, 226, 224);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(218, 219, 218, 0.3);
  }
`

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PurchaseModal({ isOpen, onClose }: PurchaseModalProps) {
  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
 
  <BorderOverlay onClick={(e) => e.stopPropagation()}> 
      <ModalContainer  >
        {/* Decorative Images */}
        {/* <DecorativeImage1 src="/placeholder.svg?height=600&width=800" alt="" />
        <DecorativeImage2 src="/placeholder.svg?height=500&width=700" alt="" />
        <DecorativeImage3 src="/placeholder.svg?height=400&width=300" alt="" />
         */}
        {/* Floating Bills */}
        {/* <FloatingBill1 src="/placeholder.svg?height=80&width=60" alt="" />
        <FloatingBill2 src="/placeholder.svg?height=120&width=100" alt="" />
        <FloatingBill3 src="/placeholder.svg?height=140&width=110" alt="" /> */}
        
      
        <ModalContent>
          <BackgroundText> PASSE VISION</BackgroundText>
          
          <ContentContainer>
            <HeaderSection>
           <LogoVision classname="h-[45px] " />
              <div className="welcome-title">Bem-vindo ao passe vision</div>
            </HeaderSection>
            
            <CloseButton onClick={onClose}>
              <X />
            </CloseButton>
            
            <PromotionSection>
              <p className="bonus-title">CONTRATO DE MISSÕES</p>
              <span className="bonus-description">
               Obtenha itens a cada level alcançado no clubvision. Concorra a 
                <span className="highlight"> R$ 9.000,00  grátis em bits!</span>
              </span>
            </PromotionSection>
            
            <ActionButton onClick={() => router.push(ROUTENVX.storeclubContract)}>
              <span>Obtenha o CONTRATO</span>
            </ActionButton>
          </ContentContainer>
        </ModalContent>
      </ModalContainer>
       </BorderOverlay>
    </ModalOverlay>
  )
}
