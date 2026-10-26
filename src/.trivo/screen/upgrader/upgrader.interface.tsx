"use client"

import styled from "styled-components"
import { useEffect, useState, useCallback } from "react"
import { containerItems, type Item } from "@/data/list_tvl/list.container"
import LoadingPageView from "@/resources/loading/market.loading"
import Scrollmargin from "@/components/scrollingcard/scroll.xc"
import SpinnerComponent from "./upgrader-spinner"
import { MarketplaceHeader } from "../trader/MarketplaceHeader"
import CardItemView from "../trader/card.item"
import SkinTradingInterfacex from "./top.item"

// Interfaces
interface UpgraderItem extends Item {
  tokenID: string
  itemValue: number
  uid?: string
  sold?: boolean
  advertised?: boolean
}

interface UpgradeResult {
  success: boolean
  upgradeSuccess?: boolean
  calculation?: {
    probability: number
    finalProbability: number
    positionFactor: number
    riskAssessment: string
    expectedValue: number
  }
  result?: {
    receivedItem?: {
      id: number
      uid: string
      value: number
      name: string
    }
    message?: string
  }
  processingTime?: number
  positionStrategy?: string
}

export default function UpgraderInterface() {
  // Estados principais
  const [availableItems, setAvailableItems] = useState<UpgraderItem[]>([])
  const [userItems, setUserItems] = useState<UpgraderItem[]>([])
  const [selectedItems, setSelectedItems] = useState<UpgraderItem[]>([])
  const [targetItem, setTargetItem] = useState<UpgraderItem | null>(null)

  // Estados de cálculo e resultado
  const [calculation, setCalculation] = useState<any | null>(null)
  const [upgradeResult, setUpgradeResult] = useState<UpgradeResult | null>(null)
  const [fullApiResponse, setFullApiResponse] = useState<UpgradeResult | null>(null)

  // Estados de controle
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isLocked, setIsLocked] = useState(true)
  const [page, setPage] = useState(false)
  const [position, setPosition] = useState<number>(0)

  // Estados de seleção
  const [activeItems, setActiveItems] = useState<{ [key: string]: boolean }>({})
  const [activeItemsx, setActiveItemsx] = useState<{ [key: string]: boolean }>({})

  // Estados do spinner
  const [spinnerReset, setSpinnerReset] = useState(0)
  const [spinnerForceResult, setSpinnerForceResult] = useState<boolean | null>(null)
  const [spinnerShouldSpin, setSpinnerShouldSpin] = useState(false)


  // Função para transformar Item em UpgraderItem
  const transformToUpgraderItem = (item: Item): UpgraderItem => ({
    ...item,
    id: item.id,
    tokenID: item.tokenID || item.uid || String(item.id),
    itemValue: item.priceitem,
    uid: item.tokenID || item.tokenID || String(item.id),
  })

  // Busca detalhes do item pelo id em todas as coleções
  const getItemDetailsById = (id: number): Item | undefined => {
    for (const collection of Object.values(containerItems)) {
      const found = collection.find((item) => item.id === id)
      if (found) return found
    }
    return undefined
  }

  const enrichWithItemDetails = (item: UpgraderItem): UpgraderItem => {
    const details = getItemDetailsById(item.id)
    return {
      ...item,
      imagem: details?.imagem || item.imagem,
      nameitem: details?.nameitem || item.nameitem,
      priceitem: details?.priceitem || item.priceitem,
      rarity: item.rarity || details?.rarity || "comum",
      valueChange: details?.valueChange,
      limitedEdition: details?.limitedEdition,
      totalLimitedItems: details?.totalLimitedItems,
      quantity: details?.quantity,
    }
  }

  // Funções de carregamento de dados
  const loadAvailableItems = async () => {
    try {
      const response = await fetch("/api/trivo/upgrader/available")
      const data = await response.json()

      if (data.success) {
        const transformedItems = data.items.map(transformToUpgraderItem).map(enrichWithItemDetails)
        setAvailableItems(transformedItems)
      } else {
        console.error("Erro na resposta da API:", data.error)
        setError(data.error || "Erro ao carregar itens disponíveis")
      }
    } catch (error) {
      console.error("Erro ao carregar itens disponíveis:", error)
      setError("Erro ao carregar itens disponíveis")
    }
  }

  const loadUserItems = async () => {
    try {
      const response = await fetch("/api/trivo/upgrader/available2")
      const data = await response.json()

      if (data.success) {
        const transformedItems = data.items.map(transformToUpgraderItem).map(enrichWithItemDetails)
        setUserItems(transformedItems)
      } else {
        console.error("Erro na resposta da API:", data.error)
        setError(data.error || "Erro ao carregar itens do usuário")
      }
    } catch (error) {
      console.error("Erro ao carregar itens do usuário:", error)
      setError("Erro ao carregar itens do usuário")
    } finally {
      setLoading(false)
    }
  }

  // NOVA FUNÇÃO: Calcular upgrade automaticamente (GET) - só executa se > 1 item selecionado
  const calculateUpgradeAuto = useCallback(async () => {
    // VALIDAÇÃO: Só calcula se tiver item alvo E mais de 1 item selecionado
 if (!targetItem || !selectedItems || selectedItems.length < 1) {
    setCalculation(null)
    return
  }
 
    try {
      const params = new URLSearchParams({
        targetItemUid: targetItem.tokenID,
        targetItemId: targetItem.id.toString(),
        selectedItemUids: JSON.stringify(selectedItems.map((item) => item.tokenID)),
        selectedItemIds: JSON.stringify(selectedItems.map((item) => item.id)),
        position: position.toString(),
      })

      const response = await fetch(`/api/trivo/upgrader?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()

      if (data.success && data.calculation) {
        console.log("✅ Cálculo recebido:", data.calculation)
        setCalculation({
          probability: data.calculation.finalProbability || data.calculation.probability,
          adjustedProbability: data.adjustedProbability,
          positionFactor: data.positionFactor,
          riskAssessment: data.calculation.riskAssessment,
          expectedValue: data.calculation.expectedValue,
          upgradeSuccess: data.calculation.upgradeSuccess,
        })
        setError("") // Limpar erros anteriores
      } else {
        console.error("❌ Erro no cálculo:", data.error)
        setError(data.error || "Erro ao calcular upgrade")
      }
    } catch (error) {
      console.error("❌ Erro ao calcular upgrade:", error)
      setError("Erro ao calcular upgrade")
    }
  }, [targetItem, selectedItems, position])

  // FUNÇÃO ATUALIZADA: Executar upgrade (POST) - só executa no clique do botão
  const executeUpgrade = async () => {
    if (!targetItem || selectedItems.length === 0) {
      console.log("🚫 Não pode executar: faltam itens")
      return
    }

    console.log("🚀 Executando upgrade (POST)...")

    try {
      const response = await fetch("/api/trivo/upgrader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemsA: {
            uid: targetItem.tokenID,
            id: targetItem.id,
            tokenID: targetItem.tokenID,
          },
          itemsB: selectedItems.map((item) => ({
            uid: item.tokenID,
            id: item.id,
            tokenID: item.tokenID,
          })),
          position: position,
        }),
      })

      const data = await response.json()
      console.log("📦 Resposta completa da API (POST):", data)

      // ARMAZENAR RESPOSTA COMPLETA DA API
      setFullApiResponse(data)
      setUpgradeResult(data)

      // CONFIGURAR SPINNER COM DADOS COMPLETOS
      setSpinnerForceResult(data.upgradeSuccess || false)
      setSpinnerShouldSpin(true)

      if (data.success) {
        console.log(`${data.upgradeSuccess ? "✅" : "❌"} Upgrade ${data.upgradeSuccess ? "bem-sucedido" : "falhou"}`)

        // Recarregar dados após o upgrade (aguardar animação do spinner)
        setTimeout(async () => {
          console.log("🔄 Recarregando dados após upgrade...")
          await Promise.all([loadAvailableItems(), loadUserItems()])
        }, 6000)
      } else {
        console.error("❌ Erro no upgrade:", data.error)
        setError(data.error || "Erro ao executar upgrade")
      }
    } catch (error) {
      console.error("❌ Erro ao executar upgrade:", error)
      setError("Erro ao executar upgrade")
    }
  }

  // FUNÇÃO ATUALIZADA: Reset completo e inteligente
  const resetUpgradeComplete = useCallback(() => {
    console.log("🔄 RESET COMPLETO - Voltando todos os estados para 0 & null...")

    // RESETAR TODOS OS ESTADOS PARA VALORES INICIAIS (0 & null)
    setSelectedItems([])
    setTargetItem(null)
    setCalculation(null)
    setUpgradeResult(null)
    setFullApiResponse(null)
    setActiveItems({})
    setActiveItemsx({})
    setError("")
    setPage(false)
    setPosition(0)
    setIsLocked(true)

    // RESETAR CONTROLES DO SPINNER
    setSpinnerForceResult(null)
    setSpinnerShouldSpin(false)
    setSpinnerReset((prev) => prev + 1)

    console.log("✅ RESET COMPLETO EXECUTADO - Todos os estados = 0 & null")
  }, [])

  // FUNÇÃO: Callback quando spinner completa
  const  handleSpinComplete = async (won: boolean) => {
    await executeUpgrade()
    setSpinnerShouldSpin(false)
    setTimeout(() => {
      resetUpgradeComplete()
    }, 3000) // 3 segundos após o spinner completar
  }

  // Handler para clique em itens do usuário (para upgrade)
  const handleItemClick = (id: string) => {
    setActiveItems((prev) => {
      const activeCount = Object.keys(prev).filter((key) => prev[key]).length

      if (prev[id]) {
        const updated = { ...prev }
        delete updated[id]
        return updated
      }

      if (activeCount >= 6) return prev // Limite de 6 itens

      return { ...prev, [id]: true }
    })
  }

  // Handler para clique em itens disponíveis (item alvo)
  const handleItemClick2 = (id: string) => {
    console.log("🎯 Selecionando item alvo:", id)

    setActiveItemsx((prev) => {
      if (prev[id]) {
        const updated = { ...prev }
        delete updated[id]
        return updated
      }

      return { [id]: true } // Só permite um item alvo
    })

    const item = availableItems.find((item) => item.tokenID === id)
    if (item) {
      console.log("✅ Item alvo encontrado:", item)
      setTargetItem(item)
      setError("")
    } else {
      console.error("❌ Item alvo não encontrado na lista:", id)
      setError("Item não encontrado na lista")
    }
  }

  // Função para renderizar itens do usuário selecionados
  const renderSelectedUserItems = () => {
    const selectedUserItems = userItems.filter((item) => activeItems[item.tokenID])

    if (selectedUserItems.length === 0) {
      return (
        <svg width="200" height="80" viewBox="0 0 300 100">
          <path
            d="M20,50 L60,50 L70,40 L240,40 L250,50 L270,50 L280,40 L290,50 L290,60 L280,70 L250,70 L240,60 L70,60 L60,70 L20,70 Z"
            fill="#333"
          />
        </svg>
      )
    }

    if (selectedUserItems.length === 1) {
      return selectedUserItems.map((item) => (
        <div key={item.tokenID} data-testid="mini_skin">
          <ItemImage src={item.imagem} height={240} width={240} />
        </div>
      ))
    }

    return (
      <Boxtrade data-testid="price_box">
        <Scrollmargin>
          <div className="gap-1 flex">
            {selectedUserItems.map((item) => (
              <ItemCardx key={item.tokenID} data-testid="mini_skin">
                <ItemIcon>
                  <img src="/nvrp/logonvrp.png" className="ghb" alt="novision" width={60} height={60} />
                </ItemIcon>
                <ItemImage2 src={item.imagem} />
              </ItemCardx>
            ))}
          </div>
        </Scrollmargin>
      </Boxtrade>
    )
  }

  // Função para renderizar item alvo selecionado
  const renderSelectedTargetItem = () => {
    const selectedTargetItems = availableItems.filter((item) => activeItemsx[item.tokenID])

    if (selectedTargetItems.length === 0) {
      return (
        <svg width="200" height="80" viewBox="0 0 300 100">
          <path
            d="M20,50 L60,50 L70,40 L240,40 L250,50 L270,50 L280,40 L290,50 L290,60 L280,70 L250,70 L240,60 L70,60 L60,70 L20,70 Z"
            fill="#333"
          />
        </svg>
      )
    }

    if (selectedTargetItems.length === 1) {
      return selectedTargetItems.map((item) => (
        <div key={item.tokenID} data-testid="mini_skin">
          <ItemImage src={item.imagem} height={240} width={240} />
        </div>
      ))
    }

    return (
      <Boxtrade data-testid="price_box">
        <Scrollmargin>
          <div className="gap-1 flex">
            {selectedTargetItems.map((item) => (
              <ItemCardx key={item.tokenID} data-testid="mini_skin">
                <ItemIcon>
                  <img src="/nvrp/logonvrp.png" className="ghb" alt="novision" width={60} height={60} />
                </ItemIcon> 
                <ItemImage src={item.imagem} />
              </ItemCardx>
            ))}
          </div>
        </Scrollmargin>
      </Boxtrade>
    )
  }

  
  const handlePositionChange = (newPosition: number) => {
    console.log("🎯 Posição alterada para:", newPosition)
    setPosition(newPosition)
    
  }
 
  useEffect(() => {
    const selected = userItems.filter((item) => activeItems[item.tokenID])
    setSelectedItems(selected)
     if (Object.keys(activeItemsx).length === 0) {
    setTargetItem(null)
  }
  }, [activeItems, userItems])

useEffect(() => {
  
  if (Object.keys(activeItemsx).length === 0) {
    setTargetItem(null)
  }
}, [activeItemsx])
   
  useEffect(() => {
    const hasSelectedItems = Object.keys(activeItems).length > 0
    const hasTargetItem = Object.keys(activeItemsx).length > 0
    setIsLocked(!hasSelectedItems || !hasTargetItem)
  }, [activeItems, activeItemsx])
 
  useEffect(() => {
    Promise.all([loadAvailableItems(), loadUserItems()])
  }, [])

   useEffect(() => {
   
  if (targetItem && selectedItems.length >= 1) {
      console.log("🔄 Disparando cálculo automático...")
      calculateUpgradeAuto()
    } else {
      console.log("🚫 Limpando cálculo: não atende critérios")
      setCalculation(null)
    }
  }, [targetItem, selectedItems, position, calculateUpgradeAuto])
 
  const totalSelectedValue = selectedItems.reduce((sum, item) => sum + item.itemValue, 0)
 
  return (
    <div className="relative w-full">
      <Containerxv>
        <SkinTradingInterfacex
          islocked={isLocked}
          trade2={renderSelectedTargetItem()}
          trade1={renderSelectedUserItems()}
          click={setPage}
        >
          <SpinnerComponent
            probability={calculation?.probability || 0}
            adjustedProbability={calculation?.adjustedProbability}
            positionFactor={calculation?.positionFactor}
            resetTrigger={spinnerReset}
            onPositionChange={handlePositionChange}
            onSpinComplete={handleSpinComplete}
            isUpgradeMode={true}
            upgradeValue={targetItem?.itemValue || 0}
            disabled={isLocked}
        
            apiResponse={
              fullApiResponse
                ? {
                    ...fullApiResponse,
                    probability:
                      (fullApiResponse.calculation && fullApiResponse.calculation.finalProbability) ??
                      (fullApiResponse.calculation && fullApiResponse.calculation.probability) ??
                      0,
                    positionFactor:
                      (fullApiResponse.calculation && fullApiResponse.calculation.positionFactor) ??
                      0,
                  }
                : undefined
            }
            forceResult={spinnerForceResult}
            shouldSpin={spinnerShouldSpin}
          />
        </SkinTradingInterfacex>
      </Containerxv>

      <Container>
       
        <Margix>
       
  {page ? (
  <Card className="block sm:hidden">
            <MarketplaceHeader
              itemCount={targetItem ? 1 : 0}
              totalPrice={targetItem?.itemValue || 0}
              label="ITENS DISPONÍVEIS PARA UPGRADE"
            />

            <div className="flex p-1 flex-wrap gap-1">
              {loading ? (
                <LoadingPageView />
              ) : (
                availableItems
                  .filter((item) => item.advertised)
                  .map((item) => (
                    <CardItemView
                      key={item.tokenID}
                      Item={{ ...item, imagem: item.imagem, nameitem: item.nameitem }}
                      click={() => handleItemClick2(item.tokenID)}
                      isActive={!!activeItemsx[item.tokenID]}
                    />
                  ))
              )}
            </div>
          </Card>
        ) : ( 
    <Card className="block sm:hidden">
            <MarketplaceHeader
              itemCount={selectedItems.length}
              totalPrice={totalSelectedValue}
              label="SEUS ITENS PARA UPGRADE"
            />

            <div className="flex p-1 flex-wrap gap-1">
              {loading ? (
                <LoadingPageView />
              ) : (
                userItems
                  .filter((item) => item.sold && item.traded && !item.advertised)
                  .map((item) => (
                    <CardItemView
                      key={item.tokenID}
                      Item={{ ...item, imagem: item.imagem, nameitem: item.nameitem }}
                      click={() => handleItemClick(item.tokenID)}
                      isActive={!!activeItems[item.tokenID]}
                    />
                  ))
              )}
            </div>
          </Card>
        )}
    
    <Card className="hidden sm:block">
            <MarketplaceHeader
              itemCount={selectedItems.length}
              totalPrice={totalSelectedValue}
              label="SEUS ITENS PARA UPGRADE"
            />

            <div className="flex p-1 flex-wrap gap-1">
              {loading ? (
                <LoadingPageView />
              ) : (
                userItems
                  .filter((item) => item.sold && item.traded && !item.advertised)
                  .map((item) => (
                    <CardItemView
                      key={item.tokenID}
                      Item={{ ...item, imagem: item.imagem, nameitem: item.nameitem }}
                      click={() => handleItemClick(item.tokenID)}
                      isActive={!!activeItems[item.tokenID]}
                    />
                  ))
              )}
            </div>
          </Card>
 
  <Card className="hidden sm:block">
            <MarketplaceHeader
              itemCount={targetItem ? 1 : 0}
              totalPrice={targetItem?.itemValue || 0}
              label="ITENS DISPONÍVEIS PARA UPGRADE"
            />

            <div className="flex p-1 flex-wrap gap-1 ">
              {loading ? (
                <LoadingPageView />
              ) : ( 
                availableItems
                  .filter((item) => item.advertised)
                  .map((item) => (
                    <CardItemView
                      key={item.tokenID}
                      Item={{ ...item, imagem: item.imagem, nameitem: item.nameitem }}
                      click={() => handleItemClick2(item.tokenID)}
                      isActive={!!activeItemsx[item.tokenID]}
                    />
                  ))
              )}
            </div>
          </Card>
 
        </Margix>
      </Container>

      
    </div>
  )
}

// Styled Components (mantendo os mesmos do código original)
const ItemCardx = styled.div`
  position: relative;
z-index: 10;
overflow: hidden;
aspect-ratio: 1;
height: 7.25rem;
border-radius: 0.5rem;
background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #1f2120, #1f2120); /* navy-800 */
background-image: linear-gradient(to bottom, #2b2c2c40, #222a28);
padding: 0.25rem;
border: 2px solid #39c78b;
 
animation: CardView 0.2s linear;

@keyframes CardView {
  0%{ transform: translateY(100%); opacity: 0 };
  100%{ transform: translateY(0%); opacity: 1 }
}

`

const Boxtrade = styled.div`
  display: flex;
  width: 100%;
  max-width: 580px;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  padding: 0 0.75rem;
`

const Container = styled.div`
   
  color: white;
 
  font-family: 'Inter', sans-serif;
`

const Margix = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1em;
  align-items: top; 
  justify-content: space-evenly;

  @media screen and (max-width: 680px) {
    display: flex;
    flex-direction: column;
  }
`

const Card = styled.div`
  width: 100%;
 
  height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #212221, #191a19);
  border-radius: 12px;
 
&::-webkit-scrollbar,::-webkit-scrollbar-track {
    display: none;
}

 
 
`

const Cardx = styled.div`
  width: 30vw;
  height: 90vh;
  overflow-y: auto;
`

const Containerxv = styled.div`
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  .wjjc{
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 9928;
    height: 100vh;
    padding: 1em;
    background-color: rgba(0, 0, 0, 0.353);
    width: 100vw;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &::selection{
    display: none;
  }
`

const ItemImage = styled.img<{ $selected?: boolean }>`
  pointer-events: none;
  aspect-ratio: 4/3;
  width: 100%;
  transform: ${(props) => (props.$selected ? "scale(0.75)" : "scale(1)")};
  object-fit: contain;
  transition: all 0.5s ease-out;
  opacity: ${(props) => (props.$selected ? 0.25 : 1)};
`
const ItemImage2 = styled.img<{ $selected?: boolean }>`
   position: relative;

  aspect-ratio: 1/0.9;
  
`
const ItemIcon = styled.div<{ $selected?: boolean; $color?: string }>`
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
   
  transform: translate(-50%, -50%);

  img{
    opacity: 0.1;
    height: 85px;
    width: 85px;
   
  }
`
