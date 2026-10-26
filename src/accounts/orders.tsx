"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import { Briefcase, CheckCircle, XCircle, X, Copy, CircleSlash, ArrowLeftRight } from "lucide-react"
import LoadingPageView from "@/resources/loading/market.loading"

/// STATUS = "created" | "pendente" | "expired" | "canceled" | "refused" | "completed" | "failed";

type TabType = "todos" | "criado" | "pendente" | "concluido" | "expirado" | "enviado"

interface Trade {
  vid: string
  userIdreceive: string
  userIdtrader: string
  status: "created" | "pendente" | "expired" | "canceled" | "refused" | "completed" | "failed"
  time: string
  quantitytoken: number
  mytvl1: any[]
  mytvl2: any[]

  userTrader: {
    id: string
    name: string
    subdominio: string
    avatar: string
  }

  userReceiver: {
    id: string
    name: string
    subdominio: string
    avatar: string
  }
}

export default function OrdersPage({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState<TabType>("criado")
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)

  const tabs = [
    { id: "criado", label: "Criado" },
    { id: "pendente", label: "Recebidos" },
  ]
  const fetchTrades = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/trivo/trade/trades.list`, {
        method: "GET",
      })
      const data = await res.json()
      if (res.ok) {
        setTrades(data.trades || [])
      } else {
        console.error(data.error)
      }
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredTrades = trades.filter((trade) => {
    if (activeTab === "criado") return trade.userIdtrader == userId
    if (activeTab === "pendente") return trade.userIdreceive == userId
    return false
  })

  useEffect(() => {
    fetchTrades()
  }, [activeTab])

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    alert("ID copiado para a área de transferência!")
  }

  const handleTradeAction = async (action: "accept" | "reject", vid: string) => {
    try {
      const res = await fetch("/api/trivo/trade/trades.list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, vid }),
      })

      const data = await res.json()

      if (res.ok) {
        setSelectedTrade(null)
        // Atualizar lista
        const updated = await fetch(`/api/trivo/trade/trades.list`)
        const newData = await updated.json()
        setTrades(newData.trades || [])
      } else {
        alert(data.error || "Erro ao processar troca")
      }
    } catch (err) {
      console.error("Erro:", err)
      alert("Erro ao processar troca")
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pendente":
        return "Aguardando"
      case "created":
        return "Criado"
      case "expired":
        return "Expirado"
      case "sended":
        return "Enviado"
      case "canceled":
        return "Cancelado"
      case "refused":
        return "Recusado"
      case "completed":
        return "Concluído"
      case "inprogress":
        return "Em progresso"
      case "closed":
        return "Fechado"
      case "failed":
        return "Falhou"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    // Opções de formatação para data
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }

    // Formatar a data (sem a hora)
    const formattedDate = date.toLocaleDateString("pt-BR", options)

    // Formatar a hora
    const hour = date.getHours()
    const minute = date.getMinutes()
    const hourText =
      hour === 12 && minute === 0
        ? "meio-dia"
        : hour === 0 && minute === 0
          ? "meia-noite"
          : `${hour}:${minute.toString().padStart(2, "0")}`

    // Retornar a data e a hora
    return `${formattedDate} às ${hourText}`
  }

  const isSuccessStatus = (status: string) => {
    return ["completed", "sended", "closed"].includes(status)
  }

  return (
    <Container>
      <TabList>
        {tabs.map((tab) => (
          <Tab key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id as TabType)}>
            {tab.label}
          </Tab>
        ))}
      </TabList>

      <Tradetop>
        <h4>VID</h4>
        <h4>CRIADO POR</h4>
        <h4>ENVIADA PARA</h4>
        <h4>ENVIADA EM</h4>
        <h4>STATUS</h4>
        <h4></h4>
      </Tradetop>

      {loading ? (
        <div className="h-full w-full">
          <LoadingPageView />
        </div>
      ) : filteredTrades.length === 0 ? (
        <EmptyState>
          <IconWrapper>
            <Briefcase size={48} />
          </IconWrapper>
          <EmptyTitle>Você não tem nenhum pedido.</EmptyTitle>
          <EmptyText>Visite o mercado agora para ver centenas de itens que vão aprimorar seu jogo.</EmptyText>
        </EmptyState>
      ) : (
        <TradeList>
          {filteredTrades.map((trade) => (
            <Card key={trade.vid}>
              <InfoContainer>
                <TIPX>{trade.vid}</TIPX>
                <TIPX>
                  {trade.userTrader?.name}
                  {trade.userTrader?.subdominio}
                </TIPX>
                <TIPX>
                  {trade.userReceiver?.name}
                  {trade.userReceiver?.subdominio}
                </TIPX>
                <TIPX>{formatDate(trade.time)}</TIPX>
                <StatusBadge status={trade.status}>{getStatusText(trade.status)}</StatusBadge>
                <DetailsButton onClick={() => setSelectedTrade(trade)}>DETALHES</DetailsButton>
              </InfoContainer>
            </Card>
          ))}
        </TradeList>
      )}

      {selectedTrade && (
        <ModalOverlay onClick={() => setSelectedTrade(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Detalhes da Troca</ModalTitle>
              <CloseButton onClick={() => setSelectedTrade(null)}>
                <X size={18} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <TransactionInfo>
                <TransactionIdSection>
                  <TransactionIdLabel>ID DA TRANSAÇÃO</TransactionIdLabel>
                  <TransactionIdValue>
                    {selectedTrade.vid}
                    <CopyButton onClick={() => handleCopyId(selectedTrade.vid)}>
                      <Copy size={16} />
                    </CopyButton>
                  </TransactionIdValue>
                </TransactionIdSection>

                <TransactionDate>
                  <span>Data da transação</span>
                  <strong>{formatDate(selectedTrade.time)}</strong>
                </TransactionDate>

                <TransactionStatusBadge success={isSuccessStatus(selectedTrade.status)}>
                  {isSuccessStatus(selectedTrade.status) ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {getStatusText(selectedTrade.status).toUpperCase()}
                </TransactionStatusBadge>
              </TransactionInfo>

              {userId === selectedTrade.userIdreceive && selectedTrade.status === "pendente" && (
                <ActionButtons>
                  <AcceptButton onClick={() => handleTradeAction("accept", selectedTrade.vid)}>
                    <CheckCircle size={16} />
                    ACEITAR TROCA
                  </AcceptButton>
                  <RejectButton onClick={() => handleTradeAction("reject", selectedTrade.vid)}>
                    <XCircle size={16} />
                    REJEITAR TROCA
                  </RejectButton>
                </ActionButtons>
              )}

              <TradeItemsContainer>
                <TradeColumn>
                  <TradeColumnHeader>
                    <UserAvatar src="/icons/market/joasmkdb.webp" alt="avatar" />
                    <div>
                      <UserName>
                        {userId !== selectedTrade.userIdtrader
                          ? `${selectedTrade.userTrader.name}${selectedTrade.userTrader.subdominio  ? selectedTrade.userTrader.subdominio : ''}`
                          : `${selectedTrade.userReceiver.name}${selectedTrade.userReceiver.subdominio  ? selectedTrade.userReceiver.subdominio : ''}`}
                      </UserName>
                      <TradeDirection>
                        {userId === selectedTrade.userIdtrader ? ( 
                  <>
                    <h4>Oferta de {selectedTrade.userReceiver.name}{selectedTrade.userReceiver.subdominio} </h4>
                    <ReceivedTitle>Items que serão enviados para  o {selectedTrade.userTrader.name}{selectedTrade.userTrader.subdominio} </ReceivedTitle>
                  </>
                ) : (
                 <>
                   <h4>Oferta de {selectedTrade.userReceiver.name}{selectedTrade.userReceiver.subdominio} </h4>
                   <ReceivedTitle>Items que serão enviados para  o {selectedTrade.userTrader.name}{selectedTrade.userTrader.subdominio} </ReceivedTitle>
                 </>
                )}

                      </TradeDirection>
                    </div>
                  </TradeColumnHeader>

                  {selectedTrade.mytvl1 && selectedTrade.mytvl1.length > 0 ? (
                    <ItemsGrid>
                      {selectedTrade.mytvl1.map((item, index) => (
                        <ItemCard key={index} rarity={item.rarity || "comum"}>
                          <ItemImage>
                            <img src={item.imagem || "/nvrp/nvc.png"} alt={item.nameitem} />
                          </ItemImage>
                          <ItemName>{item.nameitem}</ItemName>
                          <ItemRarityIndicator rarity={item.rarity || "comum"} />
                        </ItemCard>
                      ))}
                    </ItemsGrid>
                  ) : (
                    <EmptyItems>
                      <CircleSlash size={48} />
                      <p>Nenhum item selecionado</p>
                    </EmptyItems>
                  )}
                </TradeColumn>

                <TradeDirectionIcon>
                  <ArrowLeftRight size={24} />
                </TradeDirectionIcon>

                <TradeColumn>
                  <TradeColumnHeader>
                    <UserAvatar src="/icons/market/joasmkdb.webp" alt="avatar" />
                    <div>
                      <UserName>
                        {userId == selectedTrade.userIdtrader
                          ? `${selectedTrade.userTrader.name}${selectedTrade.userTrader.subdominio ? selectedTrade.userTrader.subdominio : ''} `
                          : `${selectedTrade.userReceiver.name}${selectedTrade.userReceiver.subdominio ? selectedTrade.userReceiver.subdominio : ''}  `}
                      </UserName>
                      <TradeDirection>
                        {userId === selectedTrade.userIdreceive ? ( 
                  <>
                     <h4>Oferta de {selectedTrade.userTrader.name}{selectedTrade.userTrader.subdominio} </h4>
                     <ReceivedTitle>Items que serão enviados para  o {selectedTrade.userReceiver.name}{selectedTrade.userReceiver.subdominio} </ReceivedTitle>
                  </>
                ) : (
                 <>
                   <h4> Oferta de {selectedTrade.userTrader.name}{selectedTrade.userTrader.subdominio} </h4>
                   <ReceivedTitle>Items que serão enviados para  o {selectedTrade.userReceiver.name}{selectedTrade.userReceiver.subdominio} </ReceivedTitle>
                  
                 </>
                )}
                      
                      </TradeDirection>
                    </div>
                  </TradeColumnHeader>

                  {selectedTrade.mytvl2 && selectedTrade.mytvl2.length > 0 ? (
                    <ItemsGrid>
                      {selectedTrade.mytvl2.map((item, index) => (
                        <ItemCard key={index} rarity={item.rarity || "comum"}>
                          <ItemImage>
                            <img src={item.imagem || "/nvrp/nvc.png"} alt={item.nameitem} />
                          </ItemImage>
                          <ItemName>{item.nameitem}</ItemName>
                          <ItemRarityIndicator rarity={item.rarity || "comum"} />
                        </ItemCard>
                      ))}
                    </ItemsGrid>
                  ) : (
                    <EmptyItems>
                      <CircleSlash size={48} />
                      <p>Nenhum item selecionado</p>
                    </EmptyItems>
                  )}
                </TradeColumn>
              </TradeItemsContainer>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}

// Existing styles
const Container = styled.div`
  color: #ffffff;
  font-family:'InterRegular', sans-serif;
`

const TabList = styled.div`
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #333;
  margin-bottom: 24px;
`

const Tab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.active ? "#3fc561" : "#666")};
  font-size: 14px;
  padding: 8px 9px;
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${(props) => (props.active ? "#3fc561" : "transparent")};
  }
  
  &:hover {
    color: ${(props) => (props.active ? "#3fc561" : "#999")};
  }
`

const Tradetop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    font-family: 'Inter', monospace;
    font-size: 11px;
    color: #b5bdba;
    flex: 1; // Igual ao InfoContainer
    text-align: center;
  }

  h4:last-child {
    flex: 1; // Espaço menor para o botão DETALHES
  }
`

const Card = styled.div`
  background: linear-gradient(204deg, #21c9754b -7%, #b85cff00 33%), linear-gradient(162deg, #38393840 -10%, #38393840 25%), linear-gradient(0deg, #38393840, #38393840);
  border-radius: 9px;
  padding: 0.3em;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.2s;
`

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    flex: 1;
    font-family: 'ProximaNova-Italic', monospace;
    color: #7b8281;
    font-size: 0.875rem;
    text-align: center;
  }

  span {
    flex: 1;
    text-align: center;
  }
`

const TIPX = styled.h4`
  color: #7b8281;
  font-size: 0.875rem;
  font-family: 'ProximaNova-Italic', monospace;
  max-width: 100px;
  overflow: hidden;
  word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.475rem;
  font-weight: 500;
  text-transform: uppercase;
  max-width: 100px;
 
  ${(props) => {
    switch (props.status) {
      case "completed":
      case "created":
      case "sended":
        return `
          background: rgba(0, 179, 126, 0.1);
          border-color: #fff;
          color: #fff;
        `
      case "failed":
      case "closed":
      case "expired":
      case "canceled":
      case "refused":
        return `
          background: rgba(218, 53, 32, 0.1);
          color: #fff;
        `
      case "pendente":
      case "inprogress":
        return `
          background: rgba(184, 218, 32, 0.1);
          color: #fff;
        `
      default:
        return `
          background: rgba(84, 85, 68, 0.1);
          color: #fff;
        `
    }
  }}
`

const TradeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
`

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  opacity: 0.5;
`

const EmptyTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 12px;
  font-family: 'InterSemiBold', monospace;
`

const EmptyText = styled.p`
  color: #666;
  margin-bottom: 24px;
  font-size: 14px;
`

const DetailsButton = styled.button`
  background-color: rgb(32, 33, 33);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 25rem;
  cursor: pointer;
  font-size: 0.675rem;
  font-family: 'InterSemiBold', monospace;
  
  &:hover {
    background-color: #444;
  }
`

// New improved modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99000;
  padding: 2rem;
`

const ModalContent = styled.div`
  background: linear-gradient(180deg, #1a1b1a 0%, #121312 100%);
  border-radius: 16px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(63, 197, 97, 0.1);
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(90deg, rgba(63, 197, 97, 0.1) 0%, rgba(22, 23, 22, 0.8) 100%);
  border-bottom: 1px solid rgba(63, 197, 97, 0.2);
`

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  font-family: 'Europa Grotesk', sans-serif;
  text-transform: uppercase;
  color: #fff;
  letter-spacing: 1px;
`

const CloseButton = styled.button`
  background-color: rgba(51, 51, 51, 0.5);
  color: white;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(63, 197, 97, 0.2);
    transform: rotate(90deg);
  }
`

const ModalBody = styled.div`
  padding: 0;
  max-height: calc(90vh - 80px);
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(63, 197, 97, 0.3);
    border-radius: 4px;
  }
`

const TransactionInfo = styled.div`
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(63, 197, 97, 0.1);
  background: rgba(0, 0, 0, 0.2);
`

const TransactionIdSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const TransactionIdLabel = styled.span`
  color: #999;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const TransactionIdValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
  color: #fff;
`

const CopyButton = styled.button`
  background: rgba(63, 197, 97, 0.1);
  border: none;
  color: #3fc561;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(63, 197, 97, 0.2);
  }
`

const TransactionDate = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  
  span {
    color: #999;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  strong {
    color: #fff;
    font-size: 0.875rem;
  }
`

const TransactionStatusBadge = styled.div<{ success: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: ${(props) =>
    props.success
      ? "linear-gradient(90deg, rgba(63, 197, 97, 0.2) 0%, rgba(63, 197, 97, 0.05) 100%)"
      : "linear-gradient(90deg, rgba(218, 53, 32, 0.2) 0%, rgba(218, 53, 32, 0.05) 100%)"};
  color: ${(props) => (props.success ? "#3fc561" : "#da3520")};
  border: 1px solid ${(props) => (props.success ? "rgba(63, 197, 97, 0.3)" : "rgba(218, 53, 32, 0.3)")};
  box-shadow: 0 4px 12px ${(props) => (props.success ? "rgba(63, 197, 97, 0.2)" : "rgba(218, 53, 32, 0.2)")};
`

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(63, 197, 97, 0.1);
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
`

const AcceptButton = styled(ActionButton)`
  background: linear-gradient(90deg, rgba(63, 197, 97, 0.2) 0%, rgba(63, 197, 97, 0.1) 100%);
  color: #3fc561;
  border: 1px solid rgba(63, 197, 97, 0.3);
  
  &:hover {
    background: rgba(63, 197, 97, 0.3);
    transform: translateY(-2px);
  }
`

const RejectButton = styled(ActionButton)`
  background: linear-gradient(90deg, rgba(218, 53, 32, 0.2) 0%, rgba(218, 53, 32, 0.1) 100%);
  color: #da3520;
  border: 1px solid rgba(218, 53, 32, 0.3);
  
  &:hover {
    background: rgba(218, 53, 32, 0.3);
    transform: translateY(-2px);
  }
`

const TradeItemsContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  align-items: stretch;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`

const TradeColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(63, 197, 97, 0.1);
  overflow: hidden;
`

const TradeColumnHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(63, 197, 97, 0.1);
`

const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(63, 197, 97, 0.3);
`

const UserName = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: #fff;
  font-weight: 600;
`

const TradeDirection = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: #999;
`

const TradeDirectionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(63, 197, 97, 0.7);
  
  @media (max-width: 1024px) {
    transform: rotate(90deg);
    margin: -1rem 0;
  }
`

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(63, 197, 97, 0.3);
    border-radius: 3px;
  }
`

const rarityColors = {
  comum: "#be283a",
  raro: "#e2c348",
  epico: "#8437c8",
}

const ReceivedTitle = styled.h5`
 
  color: #626664;
  font-size: 0.675rem;
  font-family: 'InterSemiBold', monospace;
 
`

const ItemCard = styled.div<{ rarity: string }>`
  position: relative;
  background: linear-gradient(to bottom, #353737, #050505 90%);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) => rarityColors[props.rarity as keyof typeof rarityColors] || "#be283a"};
  }
`

const ItemImage = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: all 0.2s ease;
  }
  
  ${ItemCard}:hover & img {
    transform: scale(1.05);
  }
`

const ItemName = styled.h5`
  margin: 0;
  padding: 0.5rem;
  font-size: 0.75rem;
  text-align: center;
  color: #b5bdba;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ItemRarityIndicator = styled.div<{ rarity: string }>`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => rarityColors[props.rarity as keyof typeof rarityColors] || "#be283a"};
  box-shadow: 0 0 8px ${(props) => rarityColors[props.rarity as keyof typeof rarityColors] || "#be283a"};
`

const EmptyItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #555;
  
  p {
    margin-top: 1rem;
    font-size: 0.875rem;
  }
`
