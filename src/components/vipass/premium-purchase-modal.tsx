"use client"
import styled, { keyframes } from "styled-components"
import { X, Crown, Loader2 } from "lucide-react"
import LogoVision from "../vision/logo"
 

interface PremiumPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  priceInfo?: {
    currentPrice: number
    userBits: number
    canAfford: boolean
    missingBits: number
    priceInReais: string
    discountPercentage?: number
    originalPrice?: number
  }
  onPurchase: () => void
  isLoading: boolean
  seasonInfo?: {
    name: string
    seasonNumber: number
  }
}

export default function PremiumPurchaseModal({
  isOpen,
  onClose,
  priceInfo,
  onPurchase,
  isLoading,
  seasonInfo,
}: PremiumPurchaseModalProps) {
  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
          <BorderOverlay>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
  
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
             <BackgroundText>PREMIUM</BackgroundText>
             
             <ContentContainer>
               <HeaderSection>
              <LogoVision classname="h-[45px] " />
                 <div className="welcome-title">Battle Pass Premium</div>
               </HeaderSection>
               
               <CloseButton onClick={onClose}>
                 <X />
               </CloseButton>
               
               <PromotionSection>
              
                 <span className="bonus-description">
                  Desbloqueie todas as recompensas exclusivas e acelere sua progressão na!
                   <span className="highlight"> {seasonInfo?.name}</span>
                 </span>
               </PromotionSection>

                  {priceInfo && (
            <PriceSection>
              <PriceDisplay>
                <CurrentPrice canAfford={priceInfo.canAfford}>
                  {priceInfo.currentPrice.toLocaleString()}
                  <img src="/icons/coins/gem.png" alt="bits" height={24} width={24} />
                </CurrentPrice>
                <PriceInReais>{priceInfo.priceInReais}</PriceInReais>

                {priceInfo.discountPercentage && (
                  <DiscountBadge>
                    -{priceInfo.discountPercentage}% OFF
                    <OriginalPrice>{priceInfo.originalPrice?.toLocaleString()} bits</OriginalPrice>
                  </DiscountBadge>
                )}
              </PriceDisplay>
 
            {!priceInfo.canAfford && (
  <MissingBits>
    Você não possui bits suficientes para concluir essa ação. 
    Estão faltando <strong>{priceInfo.missingBits.toLocaleString()} bits</strong>. 
    Compre bits,complete desafios ou explore formas de obter mais bits!
  </MissingBits>
)}


              {priceInfo.canAfford && (
                  <ActionSection>
            <PurchaseButton
              canAfford={priceInfo?.canAfford ?? false}
              onClick={onPurchase}
              disabled={isLoading || !priceInfo?.canAfford}
            >
              {isLoading ? ( 
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processando...
                </>
              ) : !priceInfo?.canAfford ? (
                "Bits Insuficientes"
              ) : (
                <>
                  <Crown size={20} />
                  Ativar Premium
                </>
              )}
            </PurchaseButton>

            {seasonInfo && (
              <SeasonInfo>
                Válido para toda a {seasonInfo.name} • Temporada {seasonInfo.seasonNumber}
              </SeasonInfo>
            )}
          </ActionSection>
              )}
            </PriceSection>
          )}
               
             
        
             </ContentContainer>
           </ModalContent>
         </ModalContainer>
          </BorderOverlay>
       </ModalOverlay>
     )
   }
   


 
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
 
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
  max-height: 90vh;
  border-radius: 18px;
 background: linear-gradient(rgb(27, 29, 27) 0%, rgb(33, 46, 38) 100%);
  
  overflow-y: auto;
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

 

 

// Floating animations
const floatingAnimation1 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`

const floatingAnimation2 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
`

const floatingAnimation3 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(1deg); }
  50% { transform: translateY(-8px) rotate(-1deg); }
`
  

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  z-index: 5;
  position: relative;
`

const PriceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  background: rgba(54, 58, 55, 0.075);
  border-radius: 16px;
  width: 100%;
`

const CurrentPrice = styled.div<{ canAfford: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
 
  font-size: 28px;
  font-weight: 800;
  color: ${(props) => (props.canAfford ? "#00d440" : "#ff6b6b")};
  font-family: 'Europa Grotesk';
`

const PriceInReais = styled.div`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
`

const DiscountBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #cc24241f 0%, #ee5a527d 100%);
  color: #cbd1cd;
  padding: 8px 1em;
  border-radius: 12px;
  font-family: 'ProximaNova-Italic', sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
    position: absolute;
  top: 7%;
  right: 4%;
  margin-top: 8px;
`

const OriginalPrice = styled.div`
  font-size: 11px;
  text-decoration: line-through;
  opacity: 0.9;
`

const UserBitsInfo = styled.div<{ canAfford: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: ${(props) => (props.canAfford ? "rgba(0, 212, 64, 0.1)" : "rgba(255, 107, 107, 0.1)")};
  border-radius: 12px;
  border: 1px solid ${(props) => (props.canAfford ? "rgba(0, 212, 64, 0.3)" : "rgba(255, 107, 107, 0.3)")};
  font-size: 14px;
  color: ${(props) => (props.canAfford ? "#00d440" : "#ff6b6b")};
  font-weight: 600;
  min-width: 280px;
`

const BitsIcon = styled.span`
  font-size: 18px;
`

const MissingBits = styled.p`
  font-size: 11px;
  color: #99393e;
  font-weight: 700;
  font-family: 'Inter', monospace;
  text-align: center;
  margin-top: 4px;
`
 
const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  z-index: 5;
  position: relative;
`

const PurchaseButton = styled.button<{ canAfford: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 56px;
  width: 100%;
  max-width: 320px;
  border-radius: 28px;
  background: ${(props) =>
    props.canAfford
      ? "linear-gradient(135deg, #00d440 0%, #8bc34a 100%)"
      : "linear-gradient(135deg, #666 0%, #444 100%)"};
  color: ${(props) => (props.canAfford ? "white" : "#ccc")};
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  border: none;
  cursor: ${(props) => (props.canAfford ? "pointer" : "not-allowed")};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 64, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    transform: none;
  }
`

const SeasonInfo = styled.div`
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8px;
`