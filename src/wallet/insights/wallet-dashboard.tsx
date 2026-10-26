"use client"
import { useEffect, useState } from "react"
import styled, { ThemeProvider } from "styled-components"
import WalletVariationDisplay from "./wallet-variations"
import WalletInsightsDisplay from "./wallet-insights"
import WalletTransactionsDisplay from "./wallet-transactions"
import Image from "next/image"
import LoadingPageView from "@/resources/loading/market.loading"
 
export default function WalletDashboard({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState("analytics")
 
  const [balance, setBalance] = useState(0)
  const [variation, setVariation] = useState({ amount: 0, percentage: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Busca dados de transações para obter o saldo atual
        const txResponse = await fetch(`/api/activity/wallet/insights/wallet-transactions?userId=${userId}`)
        if (!txResponse.ok) {
          throw new Error("Falha ao buscar dados de transações")
        }
        const txData = await txResponse.json()

        // Busca dados de variação
        const variationResponse = await fetch(`/api/activity/wallet/insights/wallet-variation?userId=${userId}`)
        if (!variationResponse.ok) {
          throw new Error("Falha ao buscar dados de variação")
        }
        const variationData = await variationResponse.json()

        // Atualiza os estados com os dados reais
        setBalance(txData.currentBalance || 0)
        setVariation({
          amount: variationData.change,
          percentage: variationData.percentage,
        })
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

 

  return (
    <div> 
     
      <AppContainer>

        <Card>
        
        <Header>
          <HeaderTitle>Análise</HeaderTitle>
      
        </Header>

        <MainContent>
          <BalanceCard>
              {loading ? (
             <LoadingPageView />
            ) : (
              <>
                <BalanceAmount>   <Image src={'/icons/coins/orb-novision.webp'} alt="Orbit thenovison" height={30} width={30} /> {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</BalanceAmount>
                <BalanceChange positive={variation.amount > 0}>
                  {variation.amount > 0 ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 15L12 9L6 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {variation.amount > 0 ? "+" : ""}
                  {Math.abs(variation.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (
                  {variation.percentage > 0 ? "+" : ""}
                  {variation.percentage.toFixed(2)}%)
                </BalanceChange>
              </>
            )}
          </BalanceCard>

          <TabsContainer>
            <Tab active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>
              Análise
            </Tab>
            <Tab active={activeTab === "insights"} onClick={() => setActiveTab("insights")}>
              Intelligence
            </Tab>
            <Tab active={activeTab === "transactions"} onClick={() => setActiveTab("transactions")}>
              Transações
            </Tab>
          </TabsContainer>

          <TabContent active={activeTab === "analytics"}>
            <WalletVariationDisplay userId={userId} />
          </TabContent>

          <TabContent active={activeTab === "insights"}>
            <WalletInsightsDisplay userId={userId} />
          </TabContent>

          <TabContent active={activeTab === "transactions"}>
            <WalletTransactionsDisplay userId={userId} />
          </TabContent>
        </MainContent>
       </Card>
      </AppContainer>
  
    </div>
  )
}



const Card = styled.div`
   
  width: 100%;
 
`;

const AppContainer = styled.div`
  width: 100%;
     
 color: white;
 z-index: 99999;
   

    
`

const Header = styled.header`
  padding: 1.5rem 1.25rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HeaderTitle = styled.h1<{ theme: any }>`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: ${(props) => props.theme.textPrimary};
`

 
 

const MainContent = styled.main`
  padding: 0 1.25rem 5rem;
`

 
const BalanceCard = styled.div`
 
  color: white;
  margin-bottom: 1.5rem;
  
`

const BalanceLabel = styled.p`
  font-size: 0.875rem;
  margin: 0 0 0.5rem;
  opacity: 0.9;
`

const BalanceAmount = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem;
`

const BalanceChange = styled.div<{ positive: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => (props.positive ? "#4ADE80" : "#F87171")};
  background-color: rgb(33, 34, 33);
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  width: fit-content;
  
  svg {
    margin-right: 0.25rem;
  }
`

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  width: 100%;
  gap: 12px;
 
`

const Tab = styled.button<{ theme: any, active: boolean }>`
  background: none;
  border: none;
  padding: 0.3em 1em 0.3em;
  border-radius: 22px;
  background: ${(props) => (props.active ? ' linear-gradient(204deg, #537e5340 -7%, #1d1d1d 33%), linear-gradient(162deg, #414e4340 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f)' : ' linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f)')} ;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  color: ${(props) => (props.active ? '#79d3a1' : '#a8b1ab')};
    cursor: var(--f-cursor-pointer);
    
  position: relative;
  
  
`

const TabContent = styled.div<{ theme: any, active: boolean }>`
  display: ${(props) => (props.active ? "block" : "none")};
`
 
const LoadingSpinner = styled.div<{ theme: any }>`
  border: 3px solid ${(props) => props.theme.border};
  border-top: 3px solid ${(props) => props.theme.primary};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`