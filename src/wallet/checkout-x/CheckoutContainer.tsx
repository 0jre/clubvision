"use client"

import type React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import CheckoutHeader from "./CheckoutHeader"
import OrderSummary from "./OrderSummary"
import PaymentMethods from "./PaymentMethods"

interface CheckoutData {
  orderId: string
  totalAmount: number
  itemCount: number
  userBalance: number
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
}

// Atualizar a interface CheckoutContainerProps para aceitar cardId:
interface CheckoutContainerProps {
  checkoutData: CheckoutData
  onFinalizePurchase: (paymentMethod: string, cardId?: string) => Promise<void>
  isProcessing?: boolean
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({
  checkoutData,
  onFinalizePurchase,
  isProcessing = false,
}) => {
  return (
    <CheckoutPageWrapper>
      <BackgroundBlur className="top-left" />
      <BackgroundBlur className="bottom-right" />

 
 
        <GridLayout>
         
             <PaymentMethods
              checkoutData={checkoutData}
              onFinalizePurchase={onFinalizePurchase}
              isProcessing={isProcessing}
            />
 
 
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                   <CheckoutHeader />
                    <OrderSummary checkoutData={checkoutData} />
            
          </motion.div>
        </GridLayout>
 
    </CheckoutPageWrapper>
  )
}

export default CheckoutContainer

const CheckoutPageWrapper = styled.div`
  height: 90vh;
  width: 70vw;
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  position: relative;
  overflow: hidden;
 
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  
   &::-webkit-scrollbar {
     display: none;
  }

 &::selection{
  display: none;
 }


  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(45, 51, 46, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(92, 99, 94, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`

const BackgroundBlur = styled.div`
  position: absolute;
  pointer-events: none;
  
  &.top-left {
    left: 0;
    top: 0;
    height: 500px;
    width: 500px;
    background: #41b45e;
    opacity: 0.03;
    border-radius: 50%;
    filter: blur(150px);
  }
  
  &.bottom-right {
    right: 0;
    top: 30%;
    height: 400px;
    width: 400px;
    background: #41b45e;
    opacity: 0.02;
    border-radius: 50%;
    filter: blur(150px);
  }
`

 
const GridLayout = styled.div`
 display: flex;
 align-items: top;
 padding: 1em;
 width: 100%;
 
 justify-content: space-between;
  gap: 2rem;
  
  
`
