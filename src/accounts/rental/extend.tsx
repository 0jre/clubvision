"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import { Clock, Plus, Minus, X, Calendar, Coins } from "lucide-react"

interface ExtendRentalModalProps {
  isOpen: boolean
  onClose: () => void
  item: any
  onExtend: (itemId: string, itemUid: string | undefined, days: number) => Promise<void>
  userBalance: number
}

const EXTENSION_COST_PER_DAY = 450
const QUICK_OPTIONS = [1, 3, 7, 15, 30]

export default function ExtendRentalModal({ isOpen, onClose, item, onExtend, userBalance }: ExtendRentalModalProps) {
  const [selectedDays, setSelectedDays] = useState(7)
  const [isProcessing, setIsProcessing] = useState(false)
 
  if (!isOpen || !item) return null

  const totalCost = selectedDays * EXTENSION_COST_PER_DAY
  const canAfford = userBalance >= totalCost
  const expiresAt = new Date(item.expiresAt)
  const isExpired = expiresAt < new Date()

  const handleExtend = async () => {
    if (!canAfford || isProcessing) return

    setIsProcessing(true)
    try {
      await onExtend(item.itemId || item.id, item.uid, selectedDays)
      onClose()
    } catch (error) {
      console.error("Erro ao estender aluguel:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const adjustDays = (increment: number) => {
    const newDays = Math.max(1, Math.min(30, selectedDays + increment))
    setSelectedDays(newDays)
  }

  const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};


  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <Clock size={24} color="#41b45e" />
            <div>
              <ModalTitle>Estender Aluguel</ModalTitle>
              <ItemName>{item.uid ? item.uid : item.id ? item.id  : item.itemId}</ItemName>
            </div>
          </HeaderContent>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <StatusSection>
            <StatusItem>
              <StatusLabel>Status Atual:</StatusLabel>
              <StatusValue expired={isExpired}>{isExpired ? "Expirado" : "Ativo"}</StatusValue>
            </StatusItem>
            <StatusItem>
              <StatusLabel>Expira em:</StatusLabel>
              <StatusValue>
                <Calendar size={16} />
                {expiresAt.toLocaleDateString()} às {expiresAt.toLocaleTimeString()}
              </StatusValue>
            </StatusItem>
          </StatusSection>

          <ExtensionSection>
            <SectionTitle>Período de Extensão</SectionTitle>

            <QuickOptions>
              {QUICK_OPTIONS.map((days) => (
                <QuickOption key={days} active={selectedDays === days} onClick={() => setSelectedDays(days)}>
                  {days} {days === 1 ? "dia" : "dias"}
                </QuickOption>
              ))}
            </QuickOptions>

            <CustomControl>
              <ControlButton onClick={() => adjustDays(-1)}>
                <Minus size={16} />
              </ControlButton>
              <DaysDisplay>
                <DaysValue>{selectedDays}</DaysValue>
                <DaysLabel>{selectedDays === 1 ? "dia" : "dias"}</DaysLabel>
              </DaysDisplay>
              <ControlButton onClick={() => adjustDays(1)}>
                <Plus size={16} />
              </ControlButton>
            </CustomControl>
          </ExtensionSection>

          <CostSection>
            <CostBreakdown>
              <CostItem>
                <span>
                  {selectedDays} {selectedDays === 1 ? "dia" : "dias"} × {EXTENSION_COST_PER_DAY} Bits
                </span>
                <span>{totalCost} Bits</span>
              </CostItem>
              <CostTotal>
                <span>Total:</span>
                <TotalAmount>
                  <Coins size={16} />
                  {totalCost} Bits
                </TotalAmount>
              </CostTotal>
            </CostBreakdown>

            <BalanceInfo insufficient={!canAfford}>
              <span>Seu saldo: {formatCurrency(userBalance)} Bits</span>
              {!canAfford && (
                <InsufficientText>Saldo insuficiente (faltam {formatCurrency(totalCost - userBalance)} Bits)</InsufficientText>
              )}
            </BalanceInfo>
          </CostSection>
        </ModalBody>

        <ModalFooter>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton onClick={handleExtend} disabled={!canAfford || isProcessing} processing={isProcessing}>
            {isProcessing ? (
              <>
                <ProcessingSpinner />
                Processando...
              </>
            ) : (
              `Estender por ${selectedDays} ${selectedDays === 1 ? "dia" : "dias"}`
            )}
          </PrimaryButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  )
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  font-family: 'InterSemiBold', monospace;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const ModalContainer = styled.div`
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  border: 1px solid #2d302e;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #2d302e;
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ModalTitle = styled.h2`
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  font-family: 'Poppins', sans-serif;
`

const ItemName = styled.p`
  color: #41b45e;
  font-size: 14px;
  margin: 4px 0 0 0;
  font-family: 'Poppins', sans-serif;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #2d302e;
    color: #fff;
  }
`

const ModalBody = styled.div`
  padding: 24px;
`

const StatusSection = styled.div`
  background: #3a3b3b53;
 
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`

const StatusLabel = styled.span`
  color: #999;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
`

const StatusValue = styled.span<{ expired?: boolean }>`
  color: ${(props) => (props.expired ? "#ff4444" : "#41b45e")};
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Poppins', sans-serif;
`

const ExtensionSection = styled.div`
  margin-bottom: 24px;
`

const SectionTitle = styled.h3`
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 16px 0;
  font-family: 'Poppins', sans-serif;
`

const QuickOptions = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`

const QuickOption = styled.button<{ active: boolean }>`
  background: ${(props) => (props.active ? "#41b45e" : "#222524")};
  color: ${(props) => (props.active ? "#000" : "#fff")};
  border: 1px solid ${(props) => (props.active ? "#41b45e" : "#2d302e")};
  border-radius: 48px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;

  &:hover {
    background: ${(props) => (props.active ? "#41b45e" : "#2d302e")};
  }
`

const CustomControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`

const ControlButton = styled.button`
background: #3a3b3b53;
  color: #41b45e;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2d302e;
    border-color: #41b45e;
  }

  &:active {
    transform: scale(0.95);
  }
`

const DaysDisplay = styled.div`
  text-align: center;
  min-width: 80px;
`

const DaysValue = styled.div`
  color: #41b45e;
  font-size: 24px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
`

const DaysLabel = styled.div`
  color: #999;
  font-size: 12px;
  font-family: 'Poppins', sans-serif;
`

const CostSection = styled.div`
  background: #3a3b3b53;
  border-radius: 12px;
  padding: 16px;
`

const CostBreakdown = styled.div`
  margin-bottom: 12px;
`

const CostItem = styled.div`
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 14px;
  margin-bottom: 8px;
  font-family: 'Poppins', sans-serif;
`

const CostTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #2d302e;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
`

const TotalAmount = styled.span`
  color: #41b45e;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
`

const BalanceInfo = styled.div<{ insufficient: boolean }>`
  color: ${(props) => (props.insufficient ? "#ff4444" : "#999")};
  font-size: 12px;
  font-family: 'Poppins', sans-serif;
`

const InsufficientText = styled.div`
  color: #ff4444;
  font-size: 12px;
  margin-top: 4px;
  font-family: 'Poppins', sans-serif;
`

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #2d302e;
`

const SecondaryButton = styled.button`
  background: #222524;
  color: #fff;
  border: 1px solid #2d302e;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  font-family: 'Poppins', sans-serif;

  &:hover {
    background: #2d302e;
  }
`

const PrimaryButton = styled.button<{ disabled: boolean; processing: boolean }>`
  background: ${(props) => (props.disabled ? "#333" : "#41b45e")};
  color: ${(props) => (props.disabled ? "#666" : "#000")};
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  font-family: 'Poppins', sans-serif;

  &:hover {
    background: ${(props) => (props.disabled ? "#333" : "#4bc766")};
  }

  &:active {
    transform: ${(props) => (props.disabled ? "none" : "scale(0.98)")};
  }
`

const ProcessingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
