import { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { Wallet, ArrowRightLeft, PlusCircle, ChevronRight, Sparkles } from "lucide-react"
import ROUTENVX from "@/routes/routes"
import { Lock } from "iconsax-react"
import router from 'next/router';


export const InfocardWallet = ({description, subdescription, children}: {children?: React.ReactNode, subdescription?: string, description: string}) => {
 
  return (
    <Containerx>
    
      <LogoContainer>
         <MarginImags >
          
          <li>
          <img src="/icons/market/20250325_192605.webp"  alt="novision" width={145} height={145} className="b1"/>
          <img src="/icons/market/20250325_192624.webp"  alt="novision" width={145} height={145}  className="b2"/>
          </li>
       </MarginImags>
      </LogoContainer>

      <ContentContainer>
        <Heading>{description}</Heading>
        <Subheading>
           {subdescription}
           
        </Subheading>

          {children}
          
 
      </ContentContainer>

      <PurpleGlow />
      <PurpleGlowTop />
    </Containerx>
  )
}
 

 

export default function UnWallet({description, subdescription, children}: {children?: React.ReactNode, subdescription?: string, description: string}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Container>
      <BackgroundCircle />
      <BackgroundCircle />

      <FloatingCoins top="15%" left="10%" duration="15s" delay="0s" />
      <FloatingCoins top="70%" left="80%" duration="12s" delay="2s" />
      <FloatingCoins top="30%" left="85%" duration="20s" delay="1s" />
      <FloatingCoins top="80%" left="15%" duration="18s" delay="3s" />

      <SparkleIcon top="20%" left="20%">
        <Sparkles size={20} color="rgba(255, 255, 255, 0.6)" />
      </SparkleIcon>
      <SparkleIcon top="70%" left="75%">
        <Sparkles size={16} color="rgba(255, 255, 255, 0.6)" />
      </SparkleIcon>


      <MainContent>
        <Card>
          <WalletIcon>
            <Wallet size={40} color="white" />
          </WalletIcon>
           
          <CardTitle>{description}</CardTitle>
          <CardDescription>
            {subdescription ? subdescription : <>  novision torna a experiencia do jogador mais vibrante e emocionante.</>}
           
          </CardDescription>
    
        </Card>

        <OptionsContainer>
          
           
          {!children ? (
 <OptionCard onClick={() => router.push(ROUTENVX.market)}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <OptionIconContainer>
                <Sparkles size={20} color="white" />
              </OptionIconContainer>
              <OptionContent>Explorar TVLs exclusivos</OptionContent>
            </div>
            <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
          </OptionCard>
           ) : children}
          
        </OptionsContainer>
      </MainContent>
 
    </Container>
  )
}




// Animações
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`

 
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

// Componentes estilizados
const Container = styled.div`
 
  font-family: 'Inter', monospace;
  display: flex;
  flex-direction: column;
  position: relative;
 
`

const BackgroundCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  z-index: 0;
  
  &:nth-child(1) {
    width: 300px;
    height: 300px;
    top: -100px;
    left: -100px;
  }
  
  &:nth-child(2) {
    width: 500px;
    height: 500px;
    bottom: -200px;
    right: -200px;
    background: rgba(255, 255, 255, 0.05);
  }
`

 

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
`

const Card = styled.div<any>`
  width: 100%;
  max-width: 400px;
 
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  
`

const WalletIcon = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 30px;
  background: linear-gradient(135deg, #34b45b 0%, #49e095 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  box-shadow: 0 15px 30px rgba(0, 255, 55, 0.3);
  position: relative;
  animation: ${float} 6s ease-in-out infinite;
  
  &::after {
    content: '';
    position: absolute;
    width: 110%;
    height: 110%;
    border-radius: 35px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    animation: ${pulse} 3s ease-in-out infinite;
  }
`

const CardTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Inter', monospace;
  text-align: center;
  color: white;
`

const CardDescription = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'InterSemiBold', monospace;
  line-height: 1.6;
`

const OptionsContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin-top: 2rem;
`

const OptionCard = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.5rem;
  background: rgb(255, 255, 255);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  width: 100%;
  margin-bottom: 1rem;
  font-family: 'Inter', monospace;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none;
  color: #000000;
  
  &:hover {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.15);
  }
`

const OptionIconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`

const OptionContent = styled.div`
  flex: 1;
  font-weight: 500;
`

const FloatingCoins = styled.div<any>`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  z-index: 0;
  animation: ${float} ${(props) => props.duration || "10s"} ease-in-out infinite;
  animation-delay: ${(props) => props.delay || "0s"};
  top: ${(props) => props.top || "10%"};
  left: ${(props) => props.left || "10%"};
`

const SparkleIcon = styled.div<any>`
  position: absolute;
  animation: ${rotate} 10s linear infinite;
  opacity: 0.6;
  top: ${(props) => props.top || "10%"};
  left: ${(props) => props.left || "10%"};
`

 

const Containerx = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.096) 70%, #272c2a 130%);
  color: white;
  padding: 5%  10% 24px;
  position: relative;

  @media screen and (max-width: 680px) { 
 
border-radius: 0;
 
}
 
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
 
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 1;
  width: 100%;
  max-width: 500px;
`

const Heading = styled.h1`
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 24px;
  font-family: 'ProximaNova-Italic', sans-serif;
  text-align: center;
`

const Subheading = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 40px;
  font-family: 'InterSemiBold', monospace;
`

const PurpleGlow = styled.div`
  position: absolute;
  bottom: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(68, 70, 69, 0.8) 0%, rgba(138, 43, 226, 0) 70%);
  opacity: 0.6;
  z-index: 0;
  border-radius: 50%;
`

const PurpleGlowTop = styled.div`
  position: absolute;
  top: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(163, 170, 168, 0.4) 0%, rgba(138, 43, 226, 0) 70%);
  opacity: 0.4;
  z-index: 0;
  border-radius: 50%;
`


const Footerx = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 40px;
  font-family: 'Inter', monospace;
  text-align: center;
`

const MarginImags = styled.div`
 width: 100%;
 height: 100%;
 display: flex;
 justify-content: center;
 place-items: center;
  

 li{
  display: flex;
  position: relative;
  align-items: center;

  .b1{
    position: absolute;
    animation: Rotate 6s infinite;
  }
 }

 @keyframes Rotate {
   0%{ transform: rotate(360deg) }
   100%{ transform: rotate(0deg) }
 }


  
`;