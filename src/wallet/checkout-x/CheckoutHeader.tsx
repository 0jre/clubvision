"use client"
import styled from "styled-components"
import { X, ArrowLeft, AlertTriangle } from "lucide-react"
import { useRouter } from "next/router"
import { useState } from "react"

const HeaderContainer = styled.div`
 
 
  z-index: 10;
  display: flex;
  position: absolute;
  right: 1em;
  top: 1em;
  justify-content: end;
  align-items: center;
  margin: 1em;
 
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.5rem;
  width: 1.5rem;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`


// Modal de Confirmação
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.295);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const ModalContainer = styled.div`
  background: linear-gradient(135deg, #1a1d1b 0%, #2d302e 100%);

  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`

const WarningIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #684437 0%, #96652e81 100%);
  color: white;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
  font-family: 'Inter', sans-serif;
`

const ModalMessage = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`

const ModalButton = styled.button<{ variant?: "danger" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border-radius: 19px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border: none;
  width: 100%;
  
  font-family: 'Inter', sans-serif;

  ${(props) =>
    props.variant === "danger"
      ? `
    background: linear-gradient(135deg, #dc262660 0%,#b13131 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
    }
  `
      : `
    background: rgba(255, 255, 255, 0.1);
    color: white;
  
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }
  `}
`

const CheckoutHeader = () => {
  const router = useRouter()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const { orderId, ...rest } = router.query;

  const handleBackClick = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmExit = () => {
    // Limpa os itens do localStorage
    localStorage.removeItem("cartItems")
    localStorage.removeItem("cartTotal")
    localStorage.removeItem("selectedItems")
    localStorage.removeItem("checkoutSession")

 
        router.push({
        pathname: router.pathname,
        query: rest  
      }, undefined, { shallow: true });
  }

  const handleCancelExit = () => {
    setShowConfirmModal(false)
  }

  return (
    <>
      <HeaderContainer>
      

        <BackButton onClick={handleBackClick}>
          <X size={20} />
        </BackButton>
      </HeaderContainer>

      {showConfirmModal && (
        <ModalOverlay onClick={handleCancelExit}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <WarningIcon>
                <AlertTriangle size={24} />
              </WarningIcon>
              <ModalTitle>Sair do Checkout?</ModalTitle>
            </ModalHeader>

            <ModalMessage>
              Se você sair desta página, <strong>não conseguirá realizar o pagamento</strong> e todos os itens do seu
              carrinho serão removidos.
              <br />
              <br />
              Tem certeza que deseja continuar?
            </ModalMessage>

            <ModalActions>
              <ModalButton onClick={handleCancelExit}>Continuar Comprando</ModalButton>
              <ModalButton variant="danger" onClick={handleConfirmExit}>
                Sair 
              </ModalButton>
            </ModalActions>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  )
}

export default CheckoutHeader
