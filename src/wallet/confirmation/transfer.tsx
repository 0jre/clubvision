"use client"

import type React from "react"
import { useState, useEffect } from "react"
import styled, { keyframes, css } from "styled-components"
import WaitingScreen from "./ui/progress.transfer"
import { ArrowLeft, Shield, CheckCircle2, AlertCircle, Eye, EyeOff, Zap, TrendingUp } from "lucide-react"
import Isecurity_wallet from "../security/x/request"

type User = {
  _id: string
  id: string
  name: string
  discriminator: string
  avatar: string
  subdominio: string
}

interface Props {
  senderid: string
  success?: string
  balance: number
  bits: number
}

const TRANSFER_FEE_RATE = 0.03 // 3% taxa de transferência
const NETWORK_COST = 0.01 // Custo fixo da rede

const TransferPage = ({ bits,senderid, balance }: Props) => {
  const [step, setStep] = useState(1) // 1: Amount, 2: Recipient, 3: Review, 4: Processing
  const [receiverName, setReceiverName] = useState("")
  const [receiverId, setReceiverId] = useState("")
  const [searchResults, setSearchResults] = useState<User | null>(null)
  const [message, setMessage] = useState("")
  const [fee, setFee] = useState(0)
  const [networkCost, setNetworkCost] = useState(NETWORK_COST)
  const [totalCost, setTotalCost] = useState(0)
  const [loading, setLoading] = useState(false)
  const [typeSend, setTypeSend] = useState("")
  const [statusPage, setStatusPage] = useState(0)
  const [amount, setAmount] = useState<number>(0)
  const [showBalance, setShowBalance] = useState(0)

  // Busca de usuários
  useEffect(() => {
    if (!receiverName.trim()) {
      setSearchResults(null)
      return
    }

    const handleSearch = async () => {
      try {
        const res = await fetch(`/api/activity/wallet/search?name=${receiverName}`)
        if (!res.ok) throw new Error("Error fetching search results")
        const data = await res.json()
        setSearchResults(data.users)
      } catch (error) {
        console.error(error)
        setSearchResults(null)
      }
    }

    const delayDebounceFn = setTimeout(handleSearch, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [receiverName])

  // Cálculo de taxas
  useEffect(() => {
    const calculatedFee = (amount ?? 0) * TRANSFER_FEE_RATE
    setFee(calculatedFee)
    setTotalCost(calculatedFee + NETWORK_COST)
  }, [amount])

  const formatCurrency = (value: number): string => {
      if (value === undefined || value === null || isNaN(value)) {
     return '•••'; 
  }
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatCurrencySimple = (value: number): string => {
      if (value === undefined || value === null || isNaN(value)) {
     return '•••'; 
  }
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    const numericValue = inputValue.replace(/[^\d]/g, "")
    const parsedValue = Number.parseFloat(numericValue) / 100

    if (!isNaN(parsedValue)) {
      setAmount(parsedValue)
      event.target.value = formatCurrencySimple(parsedValue)
    } else {
      setAmount(0)
      event.target.value = ""
    }
  }

  const getFontSizeClass = (value: any) => {
    const rawValue = String(value).replace(/\D/g, "")
    if (rawValue.length > 12) return "text-[15px]"
    if (rawValue.length > 9) return "text-[30px]"
    if (rawValue.length > 6) return "text-[41px]"
    return "text-[53px]"
  }

  const handleTransfer = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/activity/wallet/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderid, receiverId, amount, type: typeSend }),
      })

      if (!res.ok) throw new Error("Error transferring tokens")

      const data = await res.json()
      setMessage(data.message)

      const successAudio = new Audio("/Sounds/success-sound.mp3")
      successAudio.volume = 0.15

      const failureAudio = new Audio("/Sounds/Failure.mp3")
      failureAudio.volume = 0.15

      if (data.message === "Transferência realizada com sucesso.") {
        setStatusPage(1)
        successAudio.play()
      } else {
        setStatusPage(2)
        failureAudio.play()
      }
    } catch (error) {
      console.error(error)
      setMessage("Transferência falhou. Verifique todas as condições!")
      setStatusPage(2)
      const failureAudio = new Audio("/Sounds/Failure.mp3")
      failureAudio.volume = 0.15
      failureAudio.play()
    } finally {
      setLoading(false)
    }
  }

  const canContinue = () => {
    switch (step) {
      case 1:
        return showBalance == 1 &&  amount > 0 && amount <= balance || showBalance == 2 && amount > 0 && amount <= bits
      case 2:
        return receiverId && searchResults
      case 3:
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (canContinue()) {
      if (step === 3) {
        setStep(4)
        setStatusPage(3)
      } else {
        setStep(step + 1)
      }
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Telas de resultado
  if (statusPage === 1) {
    return (
      <CardConfirmedPay>
        <main className="cd__main">
          <div className="main-container">
            <div className="check-container">
              <div className="check-background">
                <svg viewBox="0 0 65 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 25L27.3077 44L58.5 7"
                    stroke="white"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="check-shadow"></div>
            </div>
          </div>
          <p>{message}</p>
         
        </main>
      </CardConfirmedPay>
    )
  }

  if (statusPage === 2) {
    return (
      <CardFailurePay>
        <main className="cd__main">
          <div className="main-container">
            <div className="check-container">
              <div className="check-background">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="check-shadow"></div>
            </div>
          </div>
          <p>{message}</p>
        
        </main>
      </CardFailurePay>
    )
  }

  if (statusPage === 3) {
    return (
      <WaitingScreen
        amount={`${amount}`}
        recipient={`${searchResults?.name ?? ""}`.trim()}
        bank={typeSend}
        accountNumber={
          searchResults?.discriminator && searchResults.discriminator.length > 10
            ? `${searchResults.discriminator.slice(0, 4)}...${searchResults.discriminator.slice(-4)}`
            : searchResults?.discriminator || "----"
        }
        child={() => handleTransfer()}
      />
    )
  }

  return (
    <> 
    <Container>
{/*  
      <ProgressContainer>
          <ProgressTrack>
            <ProgressSegments>
              {[1, 2, 3].map((stepNum) => (
                <ProgressStep key={stepNum} active={step >= stepNum} current={step === stepNum}>
                  <StepDot active={step >= stepNum} current={step === stepNum}>
                    {step > stepNum ? <CheckCircle2 size={12} /> : <span>{stepNum}</span>}
                  </StepDot>
               
                </ProgressStep>
              ))}
            </ProgressSegments>

            <ProgressLine>
              <ProgressFill progress={((step - 1) / 2) * 100} />
              <ProgressParticles progress={((step - 1) / 2) * 100}>
                <Particle delay="0s" />
                <Particle delay="0.5s" />
                <Particle delay="1s" />
              </ProgressParticles>
              <ProgressGlow progress={((step - 1) / 2) * 100} />
            </ProgressLine>
          </ProgressTrack>
    
        </ProgressContainer>
   */}
      {step === 1 && (
        <StepContainer>
              <StepTitle>
            Quanto você quer enviar?
          </StepTitle>


           
          <AmountContainer>
            <AmountInput
              name="number"
              autoComplete="off"
              className={getFontSizeClass(amount)}
              maxLength={16}
              type="text"
              value={formatCurrencySimple(amount)}
              onChange={handleInputChange}
              placeholder="0.00"
              required
            />
            <CurrencyLabel>{typeSend.toUpperCase()}</CurrencyLabel>
          </AmountContainer>

          <TokenSelector>
            <TokenOption active={typeSend === "orbit"} onClick={() => ( setTypeSend("orbit"), setShowBalance(1))}>
              <TokenIconWrapper>
                <img src="/icons/coins/orb-novision.webp" alt="orbit" height={34} width={34} />
              </TokenIconWrapper>
              <TokenInfo>
                <TokenName>Orbit</TokenName>
                <TokenDesc>Utilitária</TokenDesc>
              </TokenInfo>
              <TokenIndicator active={typeSend === "orbit"} />
            </TokenOption>

            <TokenOption active={typeSend === "bits"} onClick={() => ( setTypeSend("bits"), setShowBalance(2))}>
              <TokenIconWrapper>
                <img src="/icons/coins/orbit-novision.webp" alt="bits" height={34} width={34} />
              </TokenIconWrapper>
              <TokenInfo>
                <TokenName>Bits</TokenName>
                <TokenDesc>Principal</TokenDesc>
              </TokenInfo>
              <TokenIndicator active={typeSend === "bits"} />
            </TokenOption>
          </TokenSelector>

          {(showBalance == 1 && amount > balance || showBalance == 2 && amount > bits) && (
            <ErrorMessage>
              <AlertCircle size={16} />
              Saldo insuficiente
            </ErrorMessage>
          )}
        </StepContainer>
      )}

      {/* Etapa 2: Destinatário */}
      {step === 2 && (
        <StepContainer>
            <StepTitle>
            Para quem você está enviando?
          </StepTitle>


          <SearchContainer>
            <SearchInput
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="Digite o V-Hash"
            />
       
          </SearchContainer>
          
          <h5>Recebedor:</h5>
          {searchResults && (
            <RecipientCard
              selected={receiverId === searchResults.id}
              onClick={() => setReceiverId(receiverId === searchResults.id ? "" : searchResults.id)}
            >
              <RecipientAvatar>
                <img src={searchResults.avatar || "/placeholder.svg"} alt={searchResults.name} />
                <AvatarGlow />
              </RecipientAvatar>
              <RecipientInfo>
                <RecipientName>{searchResults.name}</RecipientName>
                <RecipientId>
                  {searchResults.discriminator?.length > 10
                    ? `${searchResults.discriminator.slice(0, 4)}...${searchResults.discriminator.slice(-4)}`
                    : searchResults.discriminator || "----"}
                </RecipientId>
              </RecipientInfo>
              <SelectIcon>
                {receiverId === searchResults.id ? (
                  <CheckCircle2 size={24} color="#27da6c" />
                ) : (
                  <div className="circle" />
                )}
              </SelectIcon>
            </RecipientCard>
          )}
        </StepContainer>
      )}

      
      {step === 3 && (
        <StepContainer>
 <StepTitle>
            
            Revisar transferência
          </StepTitle>
        
          <ReviewCard>
            <ReviewSection>
              <ReviewLabel>Você está enviando</ReviewLabel>
              <ReviewAmount>
                {formatCurrency(amount)} {typeSend.toUpperCase()}
              </ReviewAmount>
            </ReviewSection>

            <ReviewSection>
              <ReviewLabel>Para</ReviewLabel>
              <RecipientSummary>
                <img src={searchResults?.avatar || "/placeholder.svg"} alt="" />
                <div className="flex flex-col">
                  <RecipientName>{searchResults?.name}</RecipientName>
                  <RecipientId>{searchResults?.discriminator?.slice(0, 12)}...</RecipientId>
                </div>
              </RecipientSummary>
            </ReviewSection>

           
           {typeSend == 'orbit' && (
            <>
              <Divider />
            <FeeBreakdown>
              <FeeRow>
                <span>Taxa de transferência (3%)</span>
                <span>{formatCurrency(fee)}</span>
              </FeeRow>
              <FeeRow>
                <span>Taxa de rede</span>
                <span>{formatCurrency(networkCost)}</span>
              </FeeRow>
              <FeeRow total>
                <span>Total</span>
                <span>{formatCurrency(amount + totalCost)}</span>
              </FeeRow>
            </FeeBreakdown>
            </>

           )}
           

          
          </ReviewCard>

           {typeSend == 'orbit' && (
            <PrimeNotice>
              <Shield size={24} />
              <span>
                Se você é um usuário Prime ou obtem contrato anti taxas, não se preocupe com taxas de transferência. Durante o processo de envio,
                verificaremos seu status e você não será cobrado por nenhuma taxa.
              </span>
            </PrimeNotice>
           )}
        </StepContainer>
      )}
  
     <div className="flex items-center gap-3">
      
      {step > 1 && (
       <BackButton onClick={prevStep}>
       <ArrowLeft size={20} />
       </BackButton>
      )}

     <ActionButton onClick={nextStep} disabled={!canContinue()}>
        <ButtonContent>
          {step === 3 ? "Confirmar Transferência" : "Continuar"}
          <ButtonGlow />
        </ButtonContent>
      </ActionButton>
       
     </div>
        
    </Container>
     </>
  )
}

export default TransferPage

// Keyframes para animações
const glow = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`

const shimmer = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const progressGlow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(39, 218, 108, 0.3); }
  50% { box-shadow: 0 0 20px rgba(39, 218, 108, 0.6); }
`

// Styled Components
const Container = styled.div`
  padding: 1rem;
  color: #fff;
 
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 80vh;
 
  animation: ${slideIn} 0.6s ease-out;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`

const BackButton = styled.button`
  width: 45px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`

const StepCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  color: #b4c0b8;
`

const StepNumber = styled.span`
  font-size: 18px;
  color: #27da6c;
  animation: ${pulse} 2s infinite;
`

const StepDivider = styled.span`
  font-size: 16px;
  opacity: 0.5;
`

const StepTotal = styled.span`
  font-size: 16px;
  opacity: 0.7;
`



const ProgressContainer = styled.div`
  position: relative;
 
`

const ProgressTrack = styled.div`
  position: relative;
  width: 100%;
`

const StepLabel = styled.span<{ active: boolean }>`
  font-size: 11px;
  font-weight: 500;
  color: ${(props) => (props.active ? "#3f7052" : "#373b3a")};
  transition: all 0.3s ease;
  text-align: center;
  white-space: nowrap;
`

const ProgressLine = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  height: 2px;
    overflow: hidden;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 1px;
  z-index: 1;
`

const ProgressFill = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background: linear-gradient(90deg, #292b29, #1e221f, #395243);
  background-size: 200% 100%;
  border-radius: 1px;
  position: relative;
 
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${shimmer} 2s infinite;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8));
    border-radius: 0 1px 1px 0;
    opacity: ${(props) => (props.progress > 0 ? 1 : 0)};
    transition: opacity 0.3s ease;
  }
`

const ProgressParticles = styled.div<{ progress: number }>`
  position: absolute;
  top: -1px;
  left: 0;
  width: ${(props) => props.progress}%;
  height: 4px;
  overflow: hidden;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`

const particleMove = keyframes`
  0% {
    transform: translateX(-10px) scale(0);
    opacity: 0;
  }
  10% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  90% {
    transform: translateX(calc(100vw - 32px)) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(calc(100vw - 22px)) scale(0);
    opacity: 0;
  }
`

const Particle = styled.div<{ delay: string }>`
  position: absolute;
  top: 50%;
  left: 0;
  width: 3px;
  height: 3px;
  background: radial-gradient(circle, #fff, #27da6c);
  border-radius: 50%;
  transform: translateY(-50%);
  animation: ${particleMove} 2s infinite linear;
  animation-delay: ${(props) => props.delay};
  box-shadow: 0 0 6px rgba(39, 218, 108, 0.8);
`

const ProgressSegments = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
  margin-bottom: 0.5rem;
`

const ProgressStep = styled.div<{ active: boolean; current: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${(props) =>
    props.current &&
    css`
    transform: scale(1.1);
  `}
`

const StepDot = styled.div<{ active: boolean; current: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, #292e2b, #252c27)"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))"};
  
  color: ${(props) => (props.active ? "#afb8b2" : "#888")};
  border: 2px solid ${(props) => (props.active ? "#2e312f" : "rgba(255, 255, 255, 0.2)")};
  
  ${(props) =>
    props.current &&
    css`
    box-shadow: 
      0 0 20px rgba(39, 218, 108, 0.6),
      0 0 40px rgba(39, 218, 108, 0.3),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
    animation: ${pulse} 2s infinite;
  `}
  
  ${(props) =>
    props.active &&
    !props.current &&
    css`
    box-shadow: 0 0 15px rgba(39, 218, 108, 0.4);
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(39, 218, 108, 0.3), transparent, rgba(39, 218, 108, 0.3));
    opacity: ${(props) => (props.current ? 1 : 0)};
    animation: ${(props) => (props.current ? glow : "none")} 2s infinite;
    z-index: -1;
  }
`

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`

 
const ProgressGlow = styled.div<{ progress: number }>`
  position: absolute;
  top: -2px;
  left: 0;
  width: ${(props) => props.progress}%;
  height: 8px;
  background: linear-gradient(90deg, transparent, rgba(39, 218, 108, 0.3), transparent);
  border-radius: 4px;
  filter: blur(4px);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`

const StepContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${slideIn} 0.5s ease-out;
`

const StepTitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: #424644;
  text-align: center;
  margin-bottom: 0rem;
  display: flex;
  align-items: center;
  font-family: 'XcSemibold';
  justify-content: center;
  gap: 0.75rem;
`

const TitleIcon = styled.div`
  color: #27da6c;
  animation: ${glow} 3s infinite;
`

const BalanceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: ${shimmer} 3s infinite;
  }
`

const BalanceLabel = styled.span`
  font-size: 14px;
  color: #888;
`

const BalanceAmount = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 16px;
  font-weight: 600;
  color: #27da6c;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2);
  }
`

const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
  position: relative;
`

const AmountInput = styled.input`
  background-color: transparent;
  width: 100%;
  text-align: center;
  border: none;
  color: #fff;
  font-family: 'InterSemiBold', monospace;
  font-weight: 600;
 
  &:focus {
    outline: none;
    text-shadow: 0 0 20px rgba(206, 209, 207, 0.5);
  }
  
  &::placeholder {
    color: #4d4d5373;
  }
`

const CurrencyLabel = styled.span`
  font-size: 18px;
  color: #888;
  font-weight: 500;
  opacity: 0.8;
`

const TokenSelector = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`

const TokenOption = styled.button<{ active: boolean }>`
  padding: 0.5em 1em 0.5em;
  border-radius: 12px;
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, rgba(31, 34, 32, 0.959), rgba(29, 185, 84, 0.1))"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))"};
  backdrop-filter: blur(10px);
   
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
 
    border-color: rgba(71, 74, 75, 0.5);
  }
 
`

const TokenIconWrapper = styled.div`
  position: relative;
  
  img {
    transition: all 0.3s ease;
  }
`

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  font-family: 'ProximaNova-Italic', sans-serif;
`

const TokenName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`

const TokenDesc = styled.span`
  font-size: 14px;
  color: #888;
`

const TokenIndicator = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.active ? "#27da6c" : "transparent")};
  border: 2px solid ${(props) => (props.active ? "#27da6c" : "#888")};
  transition: all 0.3s ease;
  
  ${(props) =>
    props.active &&
    css`
    box-shadow: 0 0 10px rgba(39, 218, 108, 0.5);
    animation: ${pulse} 2s infinite;
  `}
`

const SearchContainer = styled.div`
  margin-bottom: 1rem;
  position: relative;
  min-width: 350px;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 16px;
  background: linear-gradient(135deg, rgb(36, 37, 36), rgba(31, 34, 31, 0.02));
  backdrop-filter: blur(10px);
  color: #fff;
  border: none;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #888;
  }
`

const SearchGlow = styled.div`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, transparent, rgba(39, 218, 108, 0.3), transparent);
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  
  ${SearchInput}:focus + & {
    opacity: 1;
  }
`

const RecipientCard = styled.button<{ selected: boolean }>`
  width: 100%;
  padding: 0.6em 1em 0.6em;
  border-radius: 12px;
  background: ${(props) =>
    props.selected
      ? "linear-gradient(135deg, rgba(189, 199, 193, 0.11), rgba(23, 29, 25, 0.596))"
      : "linear-gradient(135deg, rgb(36, 37, 36), rgba(31, 34, 31, 0.02))"};
  backdrop-filter: blur(10px);
  
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
 
  }
 
`

const RecipientAvatar = styled.div`
  position: relative;
  
  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid rgba(8, 8, 8, 0.986);
  }
`

const AvatarGlow = styled.div`
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
   
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  
  ${RecipientCard}:hover & {
    opacity: 1;
    animation: ${glow} 2s infinite;
  }
`

const RecipientInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const RecipientName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`

const RecipientId = styled.span`
  font-size: 14px;
  color: #888;
`

const SelectIcon = styled.div`
  .circle {
    width: 24px;
    height: 24px;
    border: 2px solid #888;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
  
  ${RecipientCard}:hover .circle {
    border-color: #27da6c;
  }
`

const ReviewCard = styled.div`
  
  display: flex;
  flex-direction: column;
  justify-content: center;
 
  font-family: 'Inter', monospace;
  position: relative;
  min-width: 350px;
 

 
`

const ReviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.8em;
  background: linear-gradient(135deg, rgb(36, 37, 36), rgba(31, 34, 31, 0.02));
  padding: 0.8em 1em;
  border-radius: 12px;
`

const ReviewLabel = styled.span`
  font-size: 14px;
  color: #888;
`

const ReviewAmount = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`

const RecipientSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid rgba(39, 218, 108, 0.3);
  }
`

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  margin: 0.5rem 0;
`

const FeeBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  
  gap: 0.75rem;
`

const FeeRow = styled.div<{ total?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${(props) => (props.total ? "16px" : "14px")};
  font-weight: ${(props) => (props.total ? "600" : "400")};
  color: ${(props) => (props.total ? "#fff" : "#ccc")};
  
  ${(props) =>
    props.total &&
    css`
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  `}
`

const PrimeNotice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(39, 218, 108, 0.1), rgba(25, 27, 26, 0.05));
   
  border-radius: 6px;
  color: #27da6c;
  font-size: 11px;
  font-family: 'ProximaNova-Italic', sans-serif;
  line-height: 1.4;
 
  overflow: hidden;
  
 
`

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(39, 218, 108, 0.1), rgba(29, 185, 84, 0.05));
  border-radius: 6px;
  color: #27da6c;
  font-size: 14px;
`

const ActionButton = styled.button`
  width: 100%;
  padding: 0.8em 1em 0.8em;
  border-radius: 56px;
  background: linear-gradient(135deg, #445a4c88, #264e3426);
  color: #455f47;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-family: 'XcSemibold';
  
  &:hover:not(:disabled) {
    
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(39, 218, 108, 0.171);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #5e232371, #2e1a1a76);
    color: #5c2626;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const ButtonContent = styled.div`
  position: relative;
  z-index: 2;
 
`

const ButtonGlow = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
  
  ${ActionButton}:hover:not(:disabled) & {
    left: 100%;
  }
`

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ff6b6b;
  font-size: 14px;
  padding: 0.75rem;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05));
  font-family: 'ProximaNova-Italic', sans-serif;
  border-radius: 26px;
  animation: ${slideIn} 0.3s ease-out;
`

const ResetButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  background: linear-gradient(135deg, #27da6c, #1db954);
  color: #000;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1db954, #27da6c);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(39, 218, 108, 0.4);
  }
`

// Componentes de resultado (mantidos do original com border-radius reduzido)
const CardConfirmedPay = styled.div`
  .cd__main {
    background: linear-gradient(204deg, #15f05e40 -7%, #b85cff00 33%), linear-gradient(162deg, #18f53d40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048));
    border-radius: 6px;
    padding: 20px;
    display: flex;
     min-height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    p {
      font-family: 'InterSemiBold', monospace;
      color: #d7d9e0;
      font-size: 20px;
      text-align: center;
      max-width: 100%;
    }
  }

  .main-container {
    width: 100%;
    height: 50vh;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }

  .check-container {
    width: 6.25rem;
    height: 7.5rem;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: space-between;
  }

  .check-container .check-background {
    width: 100%;
    height: calc(100% - 1.25rem);
    background: linear-gradient(to bottom right, #5de593, #41d67c);
    box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
    transform: scale(0.84);
    border-radius: 50%;
    animation: animateContainer 0.75s ease-out forwards 0.75s;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
  }

  .check-container .check-background svg {
    width: 65%;
    transform: translateY(0.25rem);
    stroke-dasharray: 80;
    stroke-dashoffset: 80;
    animation: animateCheck 0.35s forwards 1.25s ease-out;
  }

  .check-container .check-shadow {
    bottom: calc(-15% - 5px);
    left: 0;
    border-radius: 50%;
    background: radial-gradient(closest-side, #49da83, transparent);
    animation: animateShadow 0.75s ease-out forwards 0.75s;
  }

  @keyframes animateContainer {
    0% { opacity: 0; transform: scale(0); box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset; }
    25% { opacity: 1; transform: scale(0.9); box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset; }
    43.75% { transform: scale(1.15); box-shadow: 0px 0px 0px 43.334px rgba(255, 255, 255, 0.25) inset; }
    62.5% { transform: scale(1); box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset; }
    81.25% { box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset; }
    100% { opacity: 1; box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset; }
  }

  @keyframes animateCheck {
    from { stroke-dashoffset: 80; }
    to { stroke-dashoffset: 0; }
  }

  @keyframes animateShadow {
    0% { opacity: 0; width: 100%; height: 15%; }
    25% { opacity: 0.25; }
    43.75% { width: 40%; height: 7%; opacity: 0.35; }
    100% { width: 85%; height: 15%; opacity: 0.25; }
  }
`

const CardFailurePay = styled.div`
  .cd__main {
    background: linear-gradient(204deg, #ff5c6440 -7%, #b85cff00 33%), linear-gradient(162deg, #e7234e40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048));
    border-radius: 6px;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    p {
      font-family: 'InterSemiBold', monospace;
      color: #d7d9e0;
      font-size: 20px;
      text-align: center;
      max-width: 100%;
    }
  }

  .main-container {
    width: 100%;
    height: 50vh;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }

  .check-container {
    width: 6.25rem;
    height: 7.5rem;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: space-between;
  }

  .check-container .check-background {
    width: 100%;
    height: calc(100% - 1.25rem);
    background: linear-gradient(to bottom right, #e42626, #d64141);
    box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
    transform: scale(0.84);
    border-radius: 50%;
    animation: animateContainer 0.75s ease-out forwards 0.75s;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
  }

  .check-container .check-background svg {
    width: 65%;
    transform: translateY(0.25rem);
    stroke-dasharray: 80;
    stroke-dashoffset: 80;
    animation: animateCheck 0.35s forwards 1.25s ease-out;
  }

  .check-container .check-shadow {
    bottom: calc(-15% - 5px);
    left: 0;
    border-radius: 50%;
    background: radial-gradient(closest-side, #d82d3c, transparent);
    animation: animateShadow 0.75s ease-out forwards 0.75s;
  }

  @keyframes animateContainer {
    0% { opacity: 0; transform: scale(0); box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset; }
    25% { opacity: 1; transform: scale(0.9); box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset; }
    43.75% { transform: scale(1.15); box-shadow: 0px 0px 0px 43.334px rgba(255, 255, 255, 0.25) inset; }
    62.5% { transform: scale(1); box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset; }
    81.25% { box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset; }
    100% { opacity: 1; box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset; }
  }

  @keyframes animateCheck {
    from { stroke-dashoffset: 80; }
    to { stroke-dashoffset: 0; }
  }

  @keyframes animateShadow {
    0% { opacity: 0; width: 100%; height: 15%; }
    25% { opacity: 0.25; }
    43.75% { width: 40%; height: 7%; opacity: 0.35; }
    100% { width: 85%; height: 15%; opacity: 0.25; }
  }
`
