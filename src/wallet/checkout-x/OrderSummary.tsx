"use client"

import type React from "react"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Clock, Gift, Info, Lock, Package, Sparkles } from "lucide-react"
import Badge from "./ui/Badge"
import Tooltip from "./ui/Tooltip"
import { useEffect, useState } from "react"

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

interface OrderSummaryProps {
  checkoutData: CheckoutData
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ checkoutData }) => {
  const { items, fees, userBalance, hasEnoughBalance, estimatedDelivery, itemCount } = checkoutData
  const [showPromotion, setShowPromotion] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPromotion(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
   
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

  return (
    <Container>
      <OrderSummaryContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SectionHeader>
          <SectionTitle>Resumo do pedido</SectionTitle>
          <Badge variant="success" icon={<Clock size={12} />}>
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </Badge>
        </SectionHeader>

        <ItemsList>
          {items.map((item, index) => (
            <ProductContainer key={`${item.id}-${index}`}>
              <ProductImageContainer>
                <img src={item.imagem || "/placeholder.svg?height=80&width=80"} alt={item.nameitem} />
                <div className="overlay">
                  <Package size={20} color="white" />
                </div>
              </ProductImageContainer>
              <ProductInfo>
                <h3>{item.nameitem}</h3>
                <p className="product-type">{item.type || "Item Digital"}</p>
                <div className="price-container">
                  <span className="crypto-price">{formatCurrency(item.priceitem)} Bits</span>
                  <span className="quantity">x{item.quantity}</span>
                </div>
              </ProductInfo>
            </ProductContainer>
          ))}
        </ItemsList>

        <Divider />

        <PricingRow>
          <span className="label">Subtotal</span>
          <span>{formatCurrency(fees.subtotal)} Bits</span>
        </PricingRow>

        <PricingRow>
          <span className="label">
            Taxas
            <Tooltip content="Processar sua transação">
              <Info size={14} />
            </Tooltip>
          </span>
          <span>{formatCurrency(fees.networkFee)} Bits</span>
        </PricingRow>

        <PricingRow>
          <span className="label">
            Taxa de Serviço
            <Tooltip content="Taxa para usar os serviços da plataforma">
              <Info size={14} />
            </Tooltip>
          </span>
          <span>{formatCurrency(fees.serviceFee)} Bits</span>
        </PricingRow>

        <Divider />

        <PricingRow className="total">
          <span>Total</span>
          <div className="price">
            <div className="crypto">{formatCurrency(fees.total)}</div>
          </div>
        </PricingRow>

        {/* Balance Status */}
        <BalanceStatus hasEnoughBalance={hasEnoughBalance}>
          <div className="balance-info  ">
            <li className="flex flex-col gap-1">
              <span className="label text-[11px]">Saldo Disponível</span>
                <span className="text-[10px]">{formatCurrency(userBalance)} Bits</span>
            </li>
            <div className="amount">
           
              <Badge variant={hasEnoughBalance ? "success" : "error"} style={{ marginLeft: "0.5rem" }}>
                {hasEnoughBalance ? "Suficiente" : "Insuficiente"}
              </Badge>
            </div>
          </div>
        </BalanceStatus>
      </OrderSummaryContainer>

  <div className="flex flex-col gap-1 mb-1">
          <AnimatePresence>
          {showPromotion && (
            <PromotionBanner
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <PromotionContent>
                <PromotionIcon>
                  <img src="/icons/coins/xp-clubvision.webp" alt="novision" height={35} />
                
                </PromotionIcon>
                <PromotionInfo>
                  <div className="title-row">
                    <h3>Ganhe XP</h3>
                 
                  </div>
                  <p>Ganhe 50 XP por item comprado nesta transação</p>
                </PromotionInfo>
              </PromotionContent>
            </PromotionBanner>
          )}
        </AnimatePresence>

        
         </div>
         
      <DeliveryDetailsContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <SectionTitle>Detalhes da entrega</SectionTitle>

        <div style={{ marginTop: "1.5rem" }}>
          <DeliveryItem>
            <div className="label">Tipo de Entrega</div>
            <div className="value-container">
              <Package size={14} color="#41b45e" />
              <p>Inventário Digital</p>
            </div>
          </DeliveryItem>

          <DeliveryItem>
            <div className="label">Plataforma</div>
            <div className="value-container">
              <div className="platform-dot"></div>
              <p>Club Market</p>
            </div>
          </DeliveryItem>

          <DeliveryItem>
            <div className="label">Entrega estimada</div>
            <div className="value-container">
              <Clock size={14} color="#41b45e" />
              <p>{estimatedDelivery}</p>
            </div>
          </DeliveryItem>
        </div>

         <MarketAlert>
          <MarketAlertContent>
            <MarketAlertInfo>
              
              <MarketAlertDetails>
                <h3>Club Market</h3>
                <p>Marketplace Ativo</p>
              </MarketAlertDetails>
            </MarketAlertInfo>
            <Badge variant="success" icon={<CheckCircle2 size={10} />}>
              Online
            </Badge>
          </MarketAlertContent>
        </MarketAlert>
      </DeliveryDetailsContainer>

     
    </Container>
  )
}

export default OrderSummary


const PromotionBanner = styled(motion.div)`
  overflow: hidden;
 
  padding: 1rem;
 
`

const PromotionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(90deg,#232925 0%, #26492f 100%);
  padding: 0.4em 1em 0.4em;
  border-radius: 12px;
`

const PromotionIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  
  .badge {
    position: absolute;
    top: -0.25rem;
    right: -0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    background-color: #41b45e;
  }
`

const PromotionInfo = styled.div`
  .title-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }
  
  h3 {
    font-weight: 600;
    color: white;
    font-size:12px;
     font-family: 'ProximaNova-Italic', monospace;
  }
  
  p {
    font-size: 9px;
    font-family: 'ProximaNova-Italic', monospace;
    color: rgba(255, 255, 255, 0.8);
  }
`

const MarketAlert = styled.div`
 
  padding: 1rem;
 
`

const MarketAlertContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const MarketAlertInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const MarketAlertIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  background: rgba(65, 180, 94, 0.1);
`

const MarketAlertDetails = styled.div`
  h3 {
    font-weight: 600;
    color: white;
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }
`

const Container = styled.div`
  height: 90vh;
  width: 390px;
  background-color: rgba(192, 206, 201, 0.048);
  padding: 1em;
  border-radius: 17px;
  overflow-y: auto;
  
   &::-webkit-scrollbar {
     display: none;
  }

 &::selection{
  display: none;
 }

`;

const OrderSummaryContainer = styled(motion.div)`
 
 width: 100%;
  padding: 1.5rem;
 
`

const DeliveryDetailsContainer = styled(motion.div)`
   
 
  padding: 1.5rem;
 
  margin-bottom: 1.5rem;
  
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  font-family: 'Inter', sans-serif;
`

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const ProductContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(45, 48, 46, 0.3);
  border-radius: 12px;
   
  transition: all 0.3s ease;

  
`

const ProductImageContainer = styled.div`
  position: relative;
  height: 4rem;
  width: 4rem;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(65, 180, 94, 0.2);
  background: #151515;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(65, 180, 94, 0.5);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.6);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover .overlay {
    opacity: 1;
  }
`

const ProductInfo = styled.div`
  flex: 1;
  
  h3 {
    font-weight: 600;
    color: white;
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }
  
  .product-type {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.5rem;
  }
  
  .price-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .crypto-price {
    font-weight: 600;
    color: #41b45e;
    font-size: 0.9rem;
  }
  
  .quantity {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
    background: rgba(65, 180, 94, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
  }
`

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(65, 180, 94, 0.3), transparent);
  margin: 1rem 0;
`

const PricingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  
  .label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  &.total {
    font-weight: 600;
    font-size: 1rem;
    
    .price {
      text-align: right;
      
      .crypto {
        color: #41b45e;
        font-size: 1.1rem;
      }
    }
  }
`

const BalanceStatus = styled.div<{ hasEnoughBalance: boolean }>`
  margin-top: 1rem;
  padding: 0.6em 1em 0.6em;
  border-radius: 12px;
 
  background: ${(props) => (props.hasEnoughBalance ? "rgba(65, 180, 94, 0.1)" : "rgba(255, 107, 107, 0.1)")};
  
  .balance-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.9rem;
  }
  
  .label {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .amount {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: white;
  }
`

const DeliveryItem = styled.div`
  margin-bottom: 1rem;
  
  .label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.5rem;
  }
  
  .value-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 12px;
    
    background: rgba(45, 48, 46, 0.3);
    padding: 0.75rem;
    transition: all 0.3s ease;
    
    
    
    p {
      color: white;
      font-size: 0.9rem;
      margin: 0;
    }
  }
  
  .platform-dot {
    height: 0.5rem;
    width: 0.5rem;
    border-radius: 50%;
    background-color: #41b45e;
  }
`

 