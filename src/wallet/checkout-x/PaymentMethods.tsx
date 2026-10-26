"use client"

import type React from "react"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, CheckCircle2, AlertCircle, Gift, Sparkles, Wallet, CreditCard, Loader2 } from "lucide-react"
import Badge from "./ui/Badge"
import Tooltip from "./ui/Tooltip"
import VisionPaySheet from "./VisionPaySheet"

interface Card {
  cardNumber: string
  cardHolder: string
  type: "VisionPay" | "Sapphire" | "VΛULT"
  balance: string
  status: "active" | "frozen" | "suspended" | "limited"
  expiry?: string
  cvv?: string
  createdAt?: string
  autoPaymentEnabled?: boolean
}

interface CheckoutData {
  orderId: string
  totalAmount: number
  itemCount: number
  userBalance: number
  bitsCredits: number
  orbitCredits: number
  hasEnoughBalance: boolean
  items: Array<{
    id: number
    nameitem: string
    priceitem: number
    imagem?: string
    quantity: number
    type?: string
    rarity?: string
  }>
  estimatedDelivery: string
  fees: {
    networkFee: number
    serviceFee: number
    subtotal: number
    total: number
  }
  availableCards: Card[]
}

interface PaymentMethodsProps {
  checkoutData: CheckoutData | any
  onFinalizePurchase: (paymentMethod: string, cardId?: string) => Promise<void | { status: string, data: any }>
  isProcessing?: boolean
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ checkoutData, onFinalizePurchase, isProcessing = false }) => {
 
  const [isPaySheetOpen, setIsPaySheetOpen] = useState(true) // Sempre aberto para fluxo modal
  const [payStatus, setPayStatus] = useState<"success" | "error" | "pending" | "cancelled" | null>(null)
  const [payStatusData, setPayStatusData] = useState<any>({})

  const handleClosePaySheet = () => {
    setIsPaySheetOpen(false)
    setPayStatus(null)
    setPayStatusData({})
  }

  const handleFinalizePurchaseFromSheet = async (method: string, cardId?: string) => {
    setPayStatus("pending")
    setPayStatusData({})
    try {
      const result = await onFinalizePurchase(method, cardId)
      if (result && typeof result === 'object' && result !== null && 'status' in result) {
        // Sempre repassar o status original para o VisionPaySheet
        if (result.status === "completed" || result.status === "success") {
          setPayStatus("success")
        } else if (result.status === "pending") {
          setPayStatus("pending")
        } else {
          setPayStatus("error")
        }
        // Repassar todos os dados da API, sem sobrescrever campos válidos
        setPayStatusData(result.data || {})
      } else {
        setPayStatus("error")
        let dataObj = {}
        if (result !== undefined && typeof result === 'object' && result !== null && 'data' in result) {
          // @ts-ignore
          dataObj = result.data
        }
        // Fallback só para campos ausentes
        const d = dataObj as any
        const fallback = {
          transactionId: d?.transactionId ?? checkoutData?.orderId ?? "",
          status: d?.status ?? "error",
          purchasedItems: d?.purchasedItems ?? 0,
          failedItems: d?.failedItems ?? checkoutData?.itemCount ?? 0,
          totalAmount: d?.totalAmount ?? checkoutData?.fees?.total ?? 0,
          paidAmount: d?.paidAmount ?? 0,
          pendingAmount: d?.pendingAmount ?? checkoutData?.fees?.total ?? 0,
          paymentMethod: d?.paymentMethod ?? checkoutData?.paymentMethod ?? "",
          cardUsed: d?.cardUsed ?? checkoutData?.cardUsed ?? "",
          date: d?.date ?? new Date().toISOString(),
          errorMessage: d?.errorMessage ?? "Erro desconhecido ao finalizar pagamento."
        }
        setPayStatusData({ ...fallback, ...d })
      }
    } catch (err: any) {
      setPayStatus("error")
      const apiData = err?.response?.data?.data || {}
      const a = apiData as any
      // Fallback só para campos ausentes
      const fallback = {
        transactionId: a?.transactionId ?? checkoutData?.orderId ?? "",
        status: a?.status ?? "error",
        purchasedItems: a?.purchasedItems ?? 0,
        failedItems: a?.failedItems ?? checkoutData?.itemCount ?? 0,
        totalAmount: a?.totalAmount ?? checkoutData?.fees?.total ?? 0,
        paidAmount: a?.paidAmount ?? 0,
        pendingAmount: a?.pendingAmount ?? checkoutData?.fees?.total ?? 0,
        paymentMethod: a?.paymentMethod ?? checkoutData?.paymentMethod ?? "",
        cardUsed: a?.cardUsed ?? checkoutData?.cardUsed ?? "",
        date: a?.date ?? new Date().toISOString(),
        errorMessage: a?.errorMessage ?? err?.message ?? "Erro ao processar pagamento."
      }
      setPayStatusData({ ...fallback, ...a })
    }
  }

  const formatCurrency = (value: number): string => {
         if (value === undefined || value === null || isNaN(value)) {
    return '•••'; 
  }
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Calcular saldo total disponível
  const getTotalAvailableBalance = () => {
    let total = checkoutData.userBalance + checkoutData.bitsCredits + checkoutData.orbitCredits

    checkoutData.availableCards?.forEach((card: any) => {
      if (card.status === "active") {
        const cardBalance = Number.parseFloat(card.balance.replace(/[$,]/g, "")) || 0
        total += cardBalance
      }
    })

    return total
  }

  const totalAvailable = getTotalAvailableBalance()
  const canProcessPayment = totalAvailable > 0 // Sempre permite se houver algum saldo

  return (
    <Container>
      <PaymentContainer
        initial={{ opacity: 0, y: -1 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <PaymentContent>
         
         {isPaySheetOpen && (
          <VisionPaySheet
            checkoutData={checkoutData}
            onClose={handleClosePaySheet}
            onFinalizePurchase={handleFinalizePurchaseFromSheet}
            statusOverride={payStatus}
            statusDataOverride={payStatusData}
          />
         )}
         
          {!canProcessPayment && (
            <InsufficientBalanceNote>
              <AlertCircle size={14} />
              <span>
                Você precisa de mais saldo para completar esta compra. Total disponível: {formatCurrency(totalAvailable)} Bits
              </span>
            </InsufficientBalanceNote>
          )}

         
        </PaymentContent>

        
      </PaymentContainer>

       
    </Container>
  )
}

export default PaymentMethods

// Mantendo todos os styled components existentes...
const PaymentContainer = styled(motion.div)``

const Container = styled.div`
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  
`

const PaymentContent = styled.div`
 
`
  
const InsufficientBalanceNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 12px;
  color: #ff6b6b;
  font-size: 0.85rem;
`
 
 