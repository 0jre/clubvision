import React, { useState } from "react"
import styled, { createGlobalStyle, keyframes } from "styled-components"
import { ArrowLeft, ChevronDown, Check, X } from 'lucide-react'
import Image from "next/image"
import { CardConfirmedpay, CardFailurepay } from "../kop"
 

export default function TokenPurchase({item, id} : {item: any, id: string}) {
  const [amount, setAmount] = useState<number>(0)
  const [selectedToken, setSelectedToken] = useState("V-TOKEN")
  const [showTokenDropdown, setShowTokenDropdown] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [tokenQty, setTokenQty] = useState<number>(0) 
   
  const [transactionId, setTransactionId] = useState<string>("")
const [errorMessage, setErrorMessage] = useState<string>("")
const [errorCode, setErrorCode] = useState<string>("")


  const tokens = [
    { symbol: "V-Token", name: "Chave de troca", image: "/icons/market/sadasjdub.webp", price: 400 },
  ]

   
  
  

  const selectedTokenObj = tokens.find((t) => t.symbol === selectedToken) || tokens[0]
  const tokenAmount = amount ? Number(amount) / selectedTokenObj.price : 0
  const roundedQty = tokenQty ? Math.round(Number(tokenQty)) : 0

  const formatCurrency = (value: number): string => {
          if (value === undefined || value === null || isNaN(value)) {
    return '•••'; 
  }
    return value.toLocaleString('en-US', {
        currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handlePurchase = async () => {
    if (!tokenQty || Number(tokenQty) <= 0) return;
  
    setIsProcessing(true);
  
    try {
      const response = await fetch('/api/activity/wallet/buy.token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: id,
          tokens: roundedQty,
        }),
      });
  
      const data = await response.json();
      setIsProcessing(false);
  
      if (data.success) {
        setTransactionId(data.transactionId || "tx_default")
        setShowSuccessModal(true)
      } else {
        setErrorMessage(data.message || "Ocorreu um erro desconhecido.")
        setErrorCode(data.errorCode || "ERR-0000")
        setShowErrorModal(true)
      }
    } catch (error) {
      console.error("Erro ao comprar tokens:", error)
      setErrorMessage("Erro de conexão com o servidor.")
      setErrorCode("ERR-NETWORK")
      setIsProcessing(false)
      setShowErrorModal(true)
    }
  };
  return (
    <>
   
      <AppContainer> 
     
       {!(showSuccessModal || showErrorModal) && (
          <PurchaseScreen>
        
          <Content>
            <BalanceCard>
              <BalanceHeader>
                 <Image src={'/icons/coins/orbit-novision.webp'} alt="Orbit thenovison" height={990} width={990} />
                <BalanceAmount>${formatCurrency(item.bits)}</BalanceAmount>
              </BalanceHeader>
            </BalanceCard>

            <FormContainer>
              <InputGroup>
                <Label>Selecione </Label>
                <TokenSelector onClick={() => setShowTokenDropdown(!showTokenDropdown)}>
                  <TokenIcon image={selectedTokenObj.image} />
                  <TokenInfo>
                    <TokenSymbol>{selectedTokenObj.symbol}</TokenSymbol>
                    <TokenName>{selectedTokenObj.name}</TokenName>
                  </TokenInfo>
                  <ChevronDown size={20} />

                  {showTokenDropdown && (
                    <TokenDropdown>
                      {tokens.map((token) => (
                        <TokenOption
                          key={token.symbol}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedToken(token.symbol)
                            setShowTokenDropdown(false)
                          }}
                        >
                          <TokenIcon image={token.image} />
                          <TokenInfo>
                            <TokenSymbol>{token.symbol}</TokenSymbol>
                            <TokenName>{token.name}</TokenName>
                          </TokenInfo>
                        </TokenOption>
                      ))}
                    </TokenDropdown>
                  )}
                </TokenSelector>
              </InputGroup>

              <InputGroup>
                <Label>Quantidade</Label>
                <AmountInput>
                  <CurrencySymbol><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z"/><path d="m14 7 3 3"/><path d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814"/></svg></CurrencySymbol>
                  <Input
                    type="text"
                    placeholder="0"
                    value={tokenQty}
                    onChange={(e) => {
                        const value = e.target.value
                        if (/^\d*$/.test(value) || value === "") {
                          setTokenQty(Number(value))
                      
                          const qty = Math.round(Number(value)) // arredonda a quantidade
                          const pricePerToken = selectedTokenObj.price
                          const totalUSD = qty * pricePerToken
                      
                          setAmount(totalUSD) // define o amount (USD)
                        }
                      }}
                      
                      
                      
                  />
                </AmountInput>
                <TokenConversion>
                  
                </TokenConversion>
              </InputGroup>

              <PriceInfo>
              <PriceRow>
                  <span>Quantidade</span>
                  <span>{roundedQty} {selectedToken}</span>
                </PriceRow>

                <PriceRow>
                  <span>Preço</span>
                  <span>{selectedTokenObj.price.toLocaleString()} Bits</span>
                </PriceRow>

                <TotalRow>
                  <span>Total</span>
                  <span>{formatCurrency(amount)} Bits</span>
                </TotalRow>
              </PriceInfo>

              <PurchaseButton
                onClick={handlePurchase}
                disabled={!amount || Number(amount) <= 0 || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Spinner />
                    Processamento...
                  </>
                ) : (
                  "Comprar agora"
                )}
              </PurchaseButton>
            </FormContainer>
          </Content>
        </PurchaseScreen>
       )}
 
        {showSuccessModal && (
          <>

            <CardConfirmedpay>
 
      <main className="cd__main">
      
         <div className="main-container">
            <div className="check-container">
               <div className="check-background">
                
                  <svg viewBox="0 0 65 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M7 25L27.3077 44L58.5 7" stroke="white" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
               </div>
               <div className="check-shadow"></div>
            </div>
         </div>
         <p>
      Sua transação foi concluída com sucesso.
      </p>
      </main>
 
        </CardConfirmedpay>

         
          </>
        )}
 
        {showErrorModal && (
          <>


             <CardFailurepay>
             
               <main className="cd__main">
               
                  <div className="main-container">
                     <div className="check-container">
                        <div className="check-background">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="3"  stroke-linecap="round"  strokeLinejoin="round"/>
            </svg>
                        </div>
                        <div className="check-shadow"></div>
                     </div>
                  </div>
                  <p>
                Não podemos processar sua compra no momento.
                  </p>
               </main>
                 </CardFailurepay>

             
          </>
        )}
      </AppContainer>
    </>
  )
}





// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`

const scaleIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

const spin = keyframes`
  to { transform: rotate(360deg); }
`
 

// Styled Components
const AppContainer = styled.div`
  font-family: 'Inter', sans-serif;
  color: #fff;
 
  position: relative;
`

const PurchaseScreen = styled.div`
  display: flex;
  flex-direction: column;
 
`
 
const Content = styled.div`
  flex: 1;
  padding: 0 20px 20px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`

const BalanceCard = styled.div`
  background: linear-gradient(135deg, rgba(37, 44, 40, 0.367) 50%, rgba(0, 255, 123, 0.67) 87%);
  border-radius: 20px;
  border: 2px solid #0b170f;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.5s ease-out;
`

const BalanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;

  img{
    position: absolute;
    height: 90px;
    width: 90px;
    
    right: 9px;
    transform: rotate(-28deg);
  }
`

const BalanceAmount = styled.span`
  font-size: 1.5rem;
  padding: 24px;
  color: #adbcb4;
  font-family: 'XcSemibold';
  
`

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${slideUp} 0.5s ease-out;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-size: 0.8rem;
  color: #A0A0A0;
  padding-left: 1em;
`

const TokenSelector = styled.div`
  background-color: #1E1E1E;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;

  &:hover {
    background-color: #252525;
  }
`

const TokenIcon = styled.div<any>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
  background-image: ${props => `url('${props.image}')`};
  background-repeat: no-repeat;
  background-size: cover;
`

const TokenInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const TokenSymbol = styled.span`
  font-weight: 600;
  font-size: 1rem;
`

const TokenName = styled.span`
  font-size: 0.8rem;
  color: #A0A0A0;
`

const TokenDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: #252525;
  border-radius: 16px;
  overflow: hidden;
  z-index: 10;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.2s ease-out;
`

const TokenOption = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333333;
  }
`

const AmountInput = styled.div`
  background-color: #1E1E1E;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;

  &:focus-within {
    background-color: #252525;
  }
`

const CurrencySymbol = styled.span`
  font-size: 1.2rem;
  margin-right: 8px;
  color: #A0A0A0;
`

const Input = styled.input`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  width: 100%;
  outline: none;
`

const TokenConversion = styled.div`
  font-size: 0.7rem;
  color: #A0A0A0;
  text-align: center;
  margin-top: 8px;
`

const PriceInfo = styled.div`
  background-color: #1E1E1E;
  border-radius: 16px;
  padding: 16px;
`

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 0.9rem;
`

const TotalRow = styled(PriceRow)`
  border-top: 1px solid #333333;
  margin-top: 8px;
  padding-top: 16px;
  font-weight: 600;
  font-size: 1rem;
`

const PurchaseButton = styled.button`
  background-color: ${props => props.disabled ? '#4A4A4A' : '#2f945d;'};
  color: white;
  border: none;
  border-radius: 66px;
  padding: 16px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'InterSemiBold', monospace;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover:not(:disabled) {
    background-color: #1a4a30;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`

const Spinner = styled.span`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 1s linear infinite;
`

const ModalOverlay = styled.div`
 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  place-items: center;
  height: 100vh;
  animation: ${fadeIn} 0.3s ease-out;
`
 