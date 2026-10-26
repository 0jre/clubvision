 "use client"

import NotificationUI from "@/components/notification/card.mnc"
import axios from "axios"
import { Coin1, Flashy } from "iconsax-react"
import React from "react"
import { useEffect, useRef, useState } from "react"
import styled, { keyframes } from "styled-components"

interface Item {
  id: string
  nameitem: string
  imagem: string
  color: string
  rarity?: string
  price?: string
}

const CaseSection: React.FC = () => {
  const [isRolling, setIsRolling] = useState(false)
  const [itemView, setItemView] = useState("")
  const itemsRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const caseBoxRef = useRef<HTMLDivElement>(null)
  const topIndicatorRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState<5 | 3>(5)
  const [currentPagex, setCurrentPagex] = useState<5 | 3>(5)
  const [reset, setReset] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [prime, setPrime] = useState(false)
  const [info, setinfo] = useState<any>(null)
  const [error, seterror] = useState(false)
  const [noAnimation, setNoAnimation] = useState(false)

  // Flash Case states
  const [showFlashModal, setShowFlashModal] = useState(false)
  const [flashQuantity, setFlashQuantity] = useState(1)
  const [isFlashMode, setIsFlashMode] = useState(false)
  const [flashProgress, setFlashProgress] = useState({ current: 0, total: 0 })
  const [flashResults, setFlashResults] = useState<any[]>([])

  const widths: { [key in 5 | 3]: number } = {
    5: 240,
    3: 400,
  }

  const prices: { [key in 5 | 3]: number } = {
    5: 14,
    3: 38,
  }

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/trivo/case/open.gradecase", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (response.ok && data.items) {
        setItems(data.items)
      } else {
        console.error("Erro ao buscar itens:", data.message)
        setItems([])
      }
    } catch (error) {
      console.error("Falha ao buscar itens:", error)
      setItems([])
    }
  }

  useEffect(() => {
    fetchItems()
  }, [currentPage])

  const itemWidth = widths[currentPage]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isRolling || showFlashModal) return
      if (event.key === "Enter" || event.key === "r" || event.key === "R") {
        handleOpenCase()
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const nextPage = currentPagex === 5 ? 3 : 5
        setCurrentPagex(nextPage)
        handlePageChange(nextPage)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isRolling, currentPagex, items, showFlashModal])

  const rotations = 120

  const repeatedItems = React.useMemo(() => {
    if (!items || items.length === 0) return []
    return Array.from({ length: Math.max(rotations + 3, 3) }).flatMap(() => items)
  }, [items, rotations])

  const handleOpenCase = async (isFlash = false) => {
    if (isRolling || !itemsRef.current || !caseBoxRef.current || !topIndicatorRef.current || items.length === 0) {
      console.warn("Não é possível iniciar o giro:", { isRolling, itemsLength: items.length })
      return
    }

    setIsRolling(true)
    setItemView("")
    setPrime(false)
    setReset(false)

    const container = itemsRef.current
    const box = caseBoxRef.current
    const topIndicator = topIndicatorRef.current

    const rollSound = rollSoundRef.current || new Audio("/Sounds/sfsfv.mp3")
    rollSound.loop = false
    rollSound.volume = 0.6
    rollSound.muted = muted

    try {
      const response = await fetch("/api/trivo/case/roul.opencase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPage,
          isFlash: isFlash,
          count: isFlash ? 1 : undefined,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        setItemView(data.message || "Erro ao girar a caixa!")
        setIsRolling(false)
        seterror(true)
        setIsRolling(false)
        setItemView("")
        setPrime(false)
        setReset(false)

        const message = data.message || "Erro ao vender item"
        setError(message)
        setNotificationMessage(message)
        setIsFormSubmitted(true)
        setTimeout(() => {
          setIsFormSubmitted(false)
          setNotificationMessage("")
        }, 5000)
        return
      }

      const selectedItem = data.item as Item
      setPrime(data.prime)
      setinfo(data)

      if (!selectedItem) {
        setItemView("Nenhum item sorteado!")
        setIsRolling(false)
      }

      if (!muted) await rollSound.play().catch(console.error)

      const targetIndex = items.findIndex((item) => item.id === selectedItem.id)
      if (targetIndex === -1) throw new Error("Item sorteado não encontrado.")

      const middleOffset = items.length
      const targetInReel = middleOffset + targetIndex

      const indicatorCenter = topIndicator.getBoundingClientRect().left + topIndicator.offsetWidth / 2
      const boxLeft = box.getBoundingClientRect().left

      const targetPixelOffset = targetInReel * itemWidth + itemWidth / 2 - (indicatorCenter - boxLeft)

      const singleReelWidth = items.length * itemWidth
      const totalSpinDistance = rotations * singleReelWidth

      if (noAnimation) {
        container.style.transition = "none"
        const offset = -targetPixelOffset
        container.style.transform = `translateX(${Math.round(offset)}px)`

        rollSound.pause()
        rollSound.currentTime = 0

        if (!muted) {
          new Audio("/Sounds/battlepass_ui_open.mp3").play().catch(console.error)
        }

        setIsRolling(false)
        setItemView(selectedItem.id)
      } else {
        // Adjust spin duration for flash mode
        const spinDuration = isFlash ? 4000 : 10000 // 4 seconds for flash, 10 seconds for normal
        const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -15 * t))
        let startTime: number | null = null

        if (animationRef.current) cancelAnimationFrame(animationRef.current)

        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const elapsed = timestamp - startTime
          const progress = Math.min(elapsed / spinDuration, 1)
          const eased = easeOutExpo(progress)

          const offset = -1 * (totalSpinDistance * eased + targetPixelOffset)

          container.style.transition = "none"
          container.style.transform = `translateX(${Math.round(offset)}px)`

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate)
          } else {
            rollSound.pause()
            rollSound.currentTime = 0

            new Audio("/Sounds/battlepass_ui_open.mp3").play().catch(console.error)

            setIsRolling(false)
            setItemView(selectedItem.id)
          }
        }

        animationRef.current = requestAnimationFrame(animate)
      }
    } catch (error) {
      console.error("Erro no sorteio:", error)
      setItemView("Erro ao girar a caixa.")
      setIsRolling(false)
      setPrime(false)
      rollSound.pause()
      rollSound.currentTime = 0
    }
  }

  const handleFlashCase = async () => {
    if (isRolling || flashQuantity < 1) return

    setIsFlashMode(true)
    setFlashResults([])
    setFlashProgress({ current: 0, total: flashQuantity })
    setShowFlashModal(false)

    try {
      const response = await fetch("/api/trivo/case/roul.opencase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPage,
          isFlash: true,
          count: flashQuantity,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const message = data.message || "Erro ao abrir caixas"
        setError(message)
        setNotificationMessage(message)
        setIsFormSubmitted(true)
        setTimeout(() => {
          setIsFormSubmitted(false)
          setNotificationMessage("")
        }, 5000)
        setIsFlashMode(false)
        return
      }

      const flashItems = data.items || []

      
      // Process each item with animation
      for (let i = 0; i < flashItems.length; i++) {
        setFlashProgress({ current: i + 1, total: flashQuantity })
        await animateFlashItem(flashItems[i])
        setFlashResults((prev) => [...prev, flashItems[i]])
          
        // Small delay between animations
        if (i < flashItems.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }
    } catch (error) {
      console.error("Erro no Flash Case:", error)
      const message = "Erro ao processar Flash Case"
      setError(message)
      setNotificationMessage(message)
      setIsFormSubmitted(true)
      setTimeout(() => {
        setIsFormSubmitted(false)
        setNotificationMessage("")
      }, 5000)
    } finally {
      setIsFlashMode(false)
      setFlashProgress({ current: 0, total: 0 })
    }
  }

const animateFlashItem = async (item: any) => {
  return new Promise<void>((resolve) => {
    // Começa mostrando o item direto, sinalizando que está rolando
     
    setIsRolling(true)
    setPrime(item.prime || false)
    setinfo(item)


      const latestItem = flashResults[flashResults.length - 1]

      // Só mostra se for o item mais recente
      if (latestItem?.item?.id === item.item.id) {
        setItemView(item.item.id)
      }

    const targetIndex = items.findIndex((i) => i.id === item.item.id)
    if (targetIndex === -1) {
      setIsRolling(false)
      return resolve()
    }

    // Depois da animação de 2 segundos, termina
    setTimeout(() => {
      setIsRolling(false)

      if (!muted) {
        new Audio("/Sounds/battlepass_ui_open.mp3").play().catch(console.error)
      }

      resolve()
    }, 2000)
  })
}


  const handlePageChange = (pageNumber: 5 | 3) => {
    if (isRolling || isFlashMode) return
    setCurrentPage(pageNumber)
    setReset(true)
    setItemView("")
    if (itemsRef.current) {
      itemsRef.current.style.transition = "none"
      itemsRef.current.style.transform = "translateX(0px)"
      void itemsRef.current.offsetHeight
    }
  }

  useEffect(() => {
    if (!isRolling && reset && itemsRef.current) {
      itemsRef.current.style.transform = `translateX(0px)`
      setReset(false)
    }
  }, [currentPage, isRolling, reset])

  const rollSoundRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    rollSoundRef.current = new Audio("/Sounds/sfsfv.mp3")
    rollSoundRef.current.loop = true
    rollSoundRef.current.volume = 0.6
    rollSoundRef.current.muted = muted
  }, [])

  useEffect(() => {
    if (rollSoundRef.current) {
      rollSoundRef.current.muted = muted
    }
  }, [muted])

  const toggleMute = () => setMuted((m) => !m)

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const [loading, setLoading] = useState(false)
  const [erroR, setError] = useState("")
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")

  const handleSellItem = async (itemId: string, price: number) => {
    setLoading(true)

    if (!info) return

    try {
      const response = await axios.post("/api/autentic/sell.tvl", {
        userId: info.ownerId,
        itemId,
        price,
      })

      if (response.data.success) {
        const message = response.data.message
        setNotificationMessage(message)
        setIsFormSubmitted(true)
        setTimeout(() => {
          setIsFormSubmitted(false)
          setNotificationMessage("")
        }, 5000)
      } else {
        const message = response.data.message || "Erro ao vender item"
        setError(message)
        setNotificationMessage(message)
        setIsFormSubmitted(true)
        setTimeout(() => {
          setIsFormSubmitted(false)
          setNotificationMessage("")
        }, 5000)
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Erro ao vender item"
      setError(message)
      setNotificationMessage(message)
      setIsFormSubmitted(true)
      setTimeout(() => {
        setIsFormSubmitted(false)
        setNotificationMessage("")
      }, 5000)
    } finally {
      setLoading(false)
      setIsRolling(false)
      setItemView("")
      setPrime(false)
      setReset(false)
    }
  }

  return (
    <SectionWrapper>
      <Header>
        {isFormSubmitted && <NotificationUI message={notificationMessage || erroR} />}

        <Controls>
          <Button isMuted={muted} aria-label="Sound Toggle" className="js-sound-btn" onClick={toggleMute}>
            {muted ? (
              <svg className="icon h-5 w-5" viewBox="0 0 16 12" fill="none">
                <path
                  d="M3.92633 8.66676H1.33366C1.15685 8.66676 0.987279 8.59652 0.862254 8.4715C0.73723 8.34648 0.666992 8.17691 0.666992 8.0001V4.0001C0.666992 3.82328 0.73723 3.65372 0.862254 3.52869C0.987279 3.40367 1.15685 3.33343 1.33366 3.33343H3.92633L7.45566 0.445429C7.50449 0.405394 7.56369 0.380053 7.62637 0.372358C7.68905 0.364662 7.75262 0.374928 7.80969 0.401961C7.86676 0.428993 7.91497 0.47168 7.94872 0.525051C7.98247 0.578422 8.00037 0.640282 8.00033 0.703429V11.2968C8.00037 11.3599 7.98247 11.4218 7.94872 11.4751C7.91497 11.5285 7.86676 11.5712 7.80969 11.5982C7.75262 11.6253 7.68905 11.6355 7.62637 11.6278C7.56369 11.6201 7.50449 11.5948 7.45566 11.5548L3.92699 8.66676H3.92633ZM13.6097 6.0001L15.967 8.35743L15.0243 9.3001L12.667 6.94276L10.3097 9.3001L9.36699 8.35743L11.7243 6.0001L9.36699 3.64276L10.3097 2.7001L12.667 5.05743L15.0243 2.7001L15.967 3.64276L13.6097 6.0001Z"
                  fill="currentColor"
                ></path>
              </svg>
            ) : (
              <svg className="icon h-5 w-5" viewBox="0 0 16 12" fill="none">
                <path
                  d="M3.92633 8.66676H1.33366C1.15685 8.66676 0.987279 8.59652 0.862254 8.4715C0.73723 8.34648 0.666992 8.17691 0.666992 8.0001V4.0001C0.666992 3.82328 0.73723 3.65372 0.862254 3.52869C0.987279 3.40367 1.15685 3.33343 1.33366 3.33343H3.92633L7.45566 0.445429C7.50449 0.405394 7.56369 0.380053 7.62637 0.372358C7.68905 0.364662 7.75262 0.374928 7.80969 0.401961C7.86676 0.428993 7.91497 0.47168 7.94872 0.525051C7.98247 0.578422 8.00037 0.640282 8.00033 0.703429V11.2968C8.00037 11.3599 7.98247 11.4218 7.94872 11.4751C7.91497 11.5285 7.86676 11.5712 7.80969 11.5982C7.75262 11.6253 7.68905 11.6355 7.62637 11.6278C7.56369 11.6201 7.50449 11.5948 7.45566 11.5548L3.92699 8.66676H3.92633ZM12.9377 11.4228L11.9937 10.4788C12.6256 9.91644 13.1312 9.22654 13.4771 8.45455C13.823 7.68257 14.0013 6.84603 14.0003 6.0001C14.0012 5.11082 13.8039 4.23253 13.4229 3.42901C13.0419 2.62549 12.4867 1.91692 11.7977 1.35476L12.7443 0.408096C13.5566 1.09579 14.2092 1.95242 14.6564 2.91823C15.1036 3.88403 15.3347 4.93577 15.3337 6.0001C15.3337 8.14876 14.4097 10.0814 12.9377 11.4228ZM10.5757 9.06076L9.62766 8.11276C9.95131 7.8639 10.2134 7.54392 10.3936 7.17758C10.5738 6.81125 10.6674 6.40836 10.667 6.0001C10.667 5.04676 10.167 4.2101 9.41366 3.73876L10.373 2.77943C10.878 3.15089 11.2884 3.636 11.5711 4.19551C11.8538 4.75502 12.0009 5.37322 12.0003 6.0001C12.0003 7.2281 11.447 8.32676 10.5757 9.06076Z"
                  fill="currentColor"
                ></path>
              </svg>
            )}
          </Button>

          <Button isMuted={noAnimation} aria-label="Animation Toggle" onClick={() => setNoAnimation((prev) => !prev)}>
            {noAnimation ? (
              <svg
                className="icon"
                height="20"
                width="20"
                viewBox="0 0 12 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.66699 6.66675H11.3337L5.33366 15.3334V9.33342H0.666992L6.66699 0.666748V6.66675Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg className="icon h-5 w-5" viewBox="0 0 16 16" fill="none">
                <g clipPath="url(#clip0_30466_489661)">
                  <path
                    d="M6.66699 6.66675H11.3337L5.33366 15.3334V9.33342H0.666992L6.66699 0.666748V6.66675Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.5583 6.66675L12.5353 6.69995L9.66667 10.846V15.3334L15.6667 6.66675H12.5583ZM9.49717 9.33342H7.22991L7.41444 7.39587L7.7 7.16671V6.69995H11.3193L9.49717 9.33342ZM7.7 5.69995H11V0.666748L7.7 5V5.69995ZM6.32679 8.26869L6.22538 9.33342H5L6.32679 8.26869Z"
                    fill="currentColor"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_30466_489661">
                    <rect width="16" height="16" fill="currentColor"></rect>
                  </clipPath>
                </defs>
              </svg>
            )}
          </Button>
        </Controls>
      </Header>

      {/* Flash Case Modal */}
      {showFlashModal && (
        <ModalOverlay onClick={() => setShowFlashModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <Flashy size="24" color="#41b45e" variant="Bulk" />
                Flash Case
              </ModalTitle>
              <CloseButton onClick={() => setShowFlashModal(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <QuantitySection>
                <QuantityLabel>Selecione a quantidade de caixas:</QuantityLabel>
                <QuantityControls>
                  <QuantityButton
                    onClick={() => setFlashQuantity(Math.max(1, flashQuantity - 1))}
                    disabled={flashQuantity <= 1}
                  >
                    -
                  </QuantityButton>
                  <QuantityDisplay>{flashQuantity}</QuantityDisplay>
                  <QuantityButton
                    onClick={() => setFlashQuantity(Math.min(10, flashQuantity + 1))}
                    disabled={flashQuantity >= 10}
                  >
                    +
                  </QuantityButton>
                </QuantityControls>

                <QuantityPresets>
                  {[1, 3, 5, 10].map((num) => (
                    <PresetButton key={num} onClick={() => setFlashQuantity(num)} active={flashQuantity === num}>
                      {num}
                    </PresetButton>
                  ))}
                </QuantityPresets>
              </QuantitySection>

              <CostInfo>
                <CostLabel>Custo total:</CostLabel>
                <CostValue>
                  <img src="/icons/market/sadasjdub.webp" height={20} width={20} alt="Bits icon" />
                  {prices[currentPage] * flashQuantity} V-Tokens
                </CostValue>
              </CostInfo>

              <FlashInfo>
                <InfoText>• Cada caixa será aberta automaticamente</InfoText>
                <InfoText>• Animação rápida de 4 segundos por caixa</InfoText>
                <InfoText>• Resultados serão exibidos sequencialmente</InfoText>
              </FlashInfo>
            </ModalBody>

            <ModalFooter>
              <CancelButton onClick={() => setShowFlashModal(false)}>Cancelar</CancelButton>
              <ConfirmButton onClick={handleFlashCase} disabled={flashQuantity < 1}>
                <Flashy size="20" color="white" variant="Bulk" />
                Iniciar Flash Case
              </ConfirmButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Flash Progress Indicator */}
      {isFlashMode && (
        <FlashProgressOverlay>
          <FlashProgressContent>
            <FlashProgressTitle>
              <Flashy size="24" color="#41b45e" variant="Bulk" />
              Flash Case em Progresso
            </FlashProgressTitle>
            <FlashProgressBar>
              <FlashProgressFill style={{ width: `${(flashProgress.current / flashProgress.total) * 100}%` }} />
            </FlashProgressBar>
            <FlashProgressText>
              {flashProgress.current} / {flashProgress.total} caixas abertas
            </FlashProgressText>

            
        
{flashResults.length > 0 && (
  <div className="m-1 flex justify-center items-center w-full bg-[#1a1b1b] rounded-sm p-3">
 
    <ul className="flex items-center flex-wrap max-w-50 gap-1">
      {flashResults.map((item, idx) => (
        <CardInfo key={idx}>

         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m3 15 2 2 4-4"/></svg>

         <h4>{item.item.nameitem || item.item.id} </h4>
        </CardInfo>
      ))}
    </ul>
  </div>
)}
          </FlashProgressContent>
 
        </FlashProgressOverlay>
      )}

      <CaseContainer>
       {itemView &&
  (() => {
    const wonItem = info?.item || items.find((i) => i.id === itemView)
    if (!wonItem) return null
    return (
      <WonItemBox itemWidth={itemWidth}>
        <ItemPrice>
          <PriceIcon src="/icons/coins/gem.png" alt="Price Icon" />
          <PriceText>{wonItem.price}</PriceText>
        </ItemPrice>
        <ItemImageContainer>
          <ItemImageWrapper>
            <ItemBackground src={wonItem.imagem} alt="Item Background" />
            <ItemImage src="/nvrp/ashdbh8jisajdv.webp" alt="v novision" />
          </ItemImageWrapper>
        </ItemImageContainer>
        <ItemInfo>
          <ItemName>{wonItem.nameitem}</ItemName>
          <OpenCase>
            <h2>{formatCurrency(info?.itemValue || wonItem.price)} Bits</h2>
          </OpenCase>
          <ItemType>novision</ItemType>
        </ItemInfo>
        <ItemDivider
          className={`${wonItem.rarity == "raro" && "bg-[#eb452f]"} ${
            wonItem.rarity == "epico" && "bg-[#28d174]"
          }  ${wonItem.rarity == "comum" && "bg-[#545050]"}`}
        />
      </WonItemBox>
    )
  })()}


        <CaseBox ref={caseBoxRef} className={error ? "shadown" : itemView ? "actived" : ""}>
          <CaseItemsContainer>
            <CaseItemsList ref={itemsRef}>
              {repeatedItems.map((item, index) => (
                <CaseItem key={index} itemWidth={itemWidth} className={itemView == item.id ? "highlight" : ""}>
                  <ItemPrice>
                    <PriceIcon src="/icons/coins/gem.png" alt="Price Icon" />
                    <PriceText>{item.price}</PriceText>
                  </ItemPrice>

                  <ItemImageContainer>
                    <ItemImageWrapper>
                      <ItemBackground src={item.imagem} alt="Item Background" />
                      <ItemImage src="/nvrp/ashdbh8jisajdv.webp" alt="v novision" />
                    </ItemImageWrapper>
                  </ItemImageContainer>

                  <ItemInfo>
                    <ItemName>{item.nameitem}</ItemName>
                    <ItemType>novision</ItemType>
                  </ItemInfo>

                  <ItemDivider
                    className={`${item.rarity == "raro" && "bg-[#eb452f]"} ${item.rarity == "epico" && "bg-[#28d174]"}  ${item.rarity == "comum" && "bg-[#545050]"}`}
                  />
                </CaseItem>
              ))}
            </CaseItemsList>
          </CaseItemsContainer>

          <TopIndicator ref={topIndicatorRef}>
            <IndicatorImg
              src="/icons/4bea5a93eee3fb7ec2393025126d1b8e69c6627f06a279c2bd76e8fae1a6678b.svg"
              alt="Top Indicator"
            />
          </TopIndicator>
          <CenterDebugIndicator></CenterDebugIndicator>
          <BottomIndicator>
            <IndicatorImg
              src="/icons/2436297cd00c58a5e8a4d5d714ded4ef78da0db6e48bc47285d5f89f3c8cd548.svg"
              alt="Bottom Indicator"
            />
          </BottomIndicator>
        </CaseBox>

        <PaginationContainer>
          <PaginationNumbers>
            {[5, 3].map((page: any) => (
              <PageNumber
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  cursor: currentPage === page || isRolling || isFlashMode ? "not-allowed" : "",
                  border: currentPage === page ? "2px solid #24d46e" : "",
                }}
              >
                {page}
              </PageNumber>
            ))}

            <PageNumberc className={prime ? "prime" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 5.71v9.58c0 2.76-2.24 5-5 5H7c-.46 0-.9-.06-1.33-.18-.62-.17-.82-.96-.36-1.42L15.94 8.06c.22-.22.55-.27.86-.21.32.06.67-.03.92-.27L20.29 5c.94-.94 1.71-.63 1.71.71Z"
                  fill="#5f6563"
                ></path>
                <path
                  opacity=".4"
                  d="M14.64 7.36 4.17 17.83c-.48.48-1.28.36-1.6-.24-.37-.68-.57-1.47-.57-2.3V5.71c0-1.34.77-1.65 1.71-.71l2.58 2.59c.39.38 1.03.38 1.42 0L11.29 4c.39-.39 1.03-.39 1.42 0l1.94 1.94c.38.39.38 1.03-.01 1.42Z"
                  fill="#33a66b"
                ></path>
              </svg>
            </PageNumberc>
          </PaginationNumbers>

          {itemView ? (
            <div className="flex items-center gap-4">
              <OpenCaseButtonInnerx
                onClick={() => handleSellItem(info.uid, info.itemValue)}
                style={{
                  border: "1px solid #c1ce4f",
                  cursor: isRolling || isFlashMode ? "not-allowed" : "",
                  opacity: isRolling || isFlashMode ? 0.5 : 1,
                }}
              >
                <Coin1 size="32" color="#edf063" variant="Bulk" />
                <OpenCaseText>
                  {loading ? "Vendendo..." : <>VENDER POR {formatCurrency(info.itemValue)} Bits</>}
                </OpenCaseText>
              </OpenCaseButtonInnerx>

              <OpenCaseButtonInner
                onClick={() => handleOpenCase(false)}
                style={{
                  cursor: isRolling || isFlashMode ? "not-allowed" : "",
                  opacity: isRolling || isFlashMode ? 0.5 : 1,
                }}
              >
                <svg width="32" height="32" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_63_4247)">
                    <path
                      className="white"
                      d="M10.01 0.880005H10C9.71281 0.880005 9.48 1.11282 9.48 1.4V18.61C9.48 18.8972 9.71281 19.13 10 19.13H10.01C10.2972 19.13 10.53 18.8972 10.53 18.61V1.4C10.53 1.11282 10.2972 0.880005 10.01 0.880005Z"
                      fill="white"
                    ></path>
                    <path
                      className="green-paint0-li63-4247"
                      d="M20 14H18.35C17.81 14 17.37 13.56 17.37 13.02V8.01C17.37 7.47 17.81 7.03 18.35 7.03H20V14Z"
                      fill="url(#paint0_linear_63_4247)"
                    ></path>
                    <path
                      className="green-paint1-li63-4247"
                      d="M0 7.02H1.65C2.19 7.02 2.63 7.46 2.63 8V13.01C2.63 13.55 2.19 13.99 1.65 13.99H0V7.02Z"
                      fill="url(#paint1_linear_63_4247)"
                    ></path>
                    <path
                      className="green-paint2-li63-4247"
                      d="M12.54 3.77H7.45C5.41759 3.77 3.77 5.4176 3.77 7.45V12.54C3.77 14.5724 5.41759 16.22 7.45 16.22H12.54C14.5724 16.22 16.22 14.5724 16.22 12.54V7.45C16.22 5.4176 14.5724 3.77 12.54 3.77Z"
                      fill="url(#paint2_linear_63_4247)"
                    ></path>
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_63_4247"
                      x1="20.98"
                      y1="10.51"
                      x2="17.05"
                      y2="10.51"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#65ca65"></stop>
                      <stop offset="1" stopColor="#63c563" stopOpacity="0"></stop>
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_63_4247"
                      x1="-0.98"
                      y1="10.51"
                      x2="2.95"
                      y2="10.51"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#66bd66"></stop>
                      <stop offset="1" stopColor="#438a43" stopOpacity="0"></stop>
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_63_4247"
                      x1="3.08"
                      y1="6.73"
                      x2="21.33"
                      y2="15.35"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#3a693a"></stop>
                      <stop offset="1" stopColor="#76ce76" stopOpacity="0"></stop>
                    </linearGradient>
                    <clipPath id="clip0_63_4247">
                      <rect className="white" width="20" height="20" fill="white"></rect>
                    </clipPath>
                  </defs>
                </svg>
                <OpenCaseText>{isRolling ? "Girando..." : "Abrir caixa"}</OpenCaseText>
              </OpenCaseButtonInner>

              <OpenCaseButtonInnerx
                onClick={() => setShowFlashModal(true)}
                style={{
                  border: "1px solid #41b45e",
                  cursor: isRolling || isFlashMode ? "not-allowed" : "",
                  opacity: isRolling || isFlashMode ? 0.5 : 1,
                }}
              >
                <Flashy size="32" color="#41b45e" variant="Bulk" />
                <OpenCaseText>{isFlashMode ? "Flash em Progresso..." : "Flash Case"}</OpenCaseText>
              </OpenCaseButtonInnerx>
            </div>
          ) : (
            <OpenCaseButtonInner
              onClick={() => handleOpenCase(false)}
              style={{
                width: "50%",
                cursor: isRolling || isFlashMode ? "not-allowed" : "",
                opacity: isRolling || isFlashMode ? 0.5 : 1,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_63_4247)">
                  <path
                    className="white"
                    d="M10.01 0.880005H10C9.71281 0.880005 9.48 1.11282 9.48 1.4V18.61C9.48 18.8972 9.71281 19.13 10 19.13H10.01C10.2972 19.13 10.53 18.8972 10.53 18.61V1.4C10.53 1.11282 10.2972 0.880005 10.01 0.880005Z"
                    fill="white"
                  ></path>
                  <path
                    className="green-paint0-li63-4247"
                    d="M20 14H18.35C17.81 14 17.37 13.56 17.37 13.02V8.01C17.37 7.47 17.81 7.03 18.35 7.03H20V14Z"
                    fill="url(#paint0_linear_63_4247)"
                  ></path>
                  <path
                    className="green-paint1-li63-4247"
                    d="M0 7.02H1.65C2.19 7.02 2.63 7.46 2.63 8V13.01C2.63 13.55 2.19 13.99 1.65 13.99H0V7.02Z"
                    fill="url(#paint1_linear_63_4247)"
                  ></path>
                  <path
                    className="green-paint2-li63-4247"
                    d="M12.54 3.77H7.45C5.41759 3.77 3.77 5.4176 3.77 7.45V12.54C3.77 14.5724 5.41759 16.22 7.45 16.22H12.54C14.5724 16.22 16.22 14.5724 16.22 12.54V7.45C16.22 5.4176 14.5724 3.77 12.54 3.77Z"
                    fill="url(#paint2_linear_63_4247)"
                  ></path>
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_63_4247"
                    x1="20.98"
                    y1="10.51"
                    x2="17.05"
                    y2="10.51"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#65ca65"></stop>
                    <stop offset="1" stopColor="#63c563" stopOpacity="0"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_63_4247"
                    x1="-0.98"
                    y1="10.51"
                    x2="2.95"
                    y2="10.51"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#66bd66"></stop>
                    <stop offset="1" stopColor="#438a43" stopOpacity="0"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_63_4247"
                    x1="3.08"
                    y1="6.73"
                    x2="21.33"
                    y2="15.35"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#3a693a"></stop>
                    <stop offset="1" stopColor="#76ce76" stopOpacity="0"></stop>
                  </linearGradient>
                  <clipPath id="clip0_63_4247">
                    <rect className="white" width="20" height="20" fill="white"></rect>
                  </clipPath>
                </defs>
              </svg>
              <OpenCaseText>{isRolling ? "Girando..." : "Abrir caixa"}</OpenCaseText>
            </OpenCaseButtonInner>
          )}

          <ActionContainer>
            <li>
              <CaseInfoTitle>Custo para abrir a caixa:</CaseInfoTitle>
              <CaseInfoBox>
                <CaseInfoPriceRange>
                  <ul>
                    <img src="/icons/market/sadasjdub.webp" height={35} width={35} alt="Bits icon" />
                    <h5>{prices[currentPage]} V-Tokens</h5>
                  </ul>
                </CaseInfoPriceRange>
              </CaseInfoBox>
            </li>
          </ActionContainer>
        </PaginationContainer>
      </CaseContainer>
    </SectionWrapper>
  )
}

// Existing styled components remain the same...
const SectionWrapper = styled.section`

  display: flex;
  width: 100%;
  padding: 32px;
  flex-direction: column;
  align-items: stretch;
  justify-content: start;
  @media (max-width: 991px) {
    max-width: 100%;
    padding: 0 20px 32px;
  }
`

const CaseContainer = styled.div`
  align-self: center;
  position: relative;
  display: flex;
  max-width: 1200px;
  padding: 4px 0;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  @media (max-width: 991px) {
    max-width: 100%;
  }

  .actived{
   border-radius: 0;
    border: solid 2px transparent;
   transition: 1s all;
 box-shadow: 0 0 15px 5px rgba(86, 201, 147, 0.4);
  }
  
  .shadown{
     box-shadow: 0 0 15px 5px rgba(189, 61, 44, 0.4);
  }
  @keyframes Animactive {
    0% {
    box-shadow: 0 0 15px 5px rgba(75, 75, 78, 0.4);
    --border-angle: 0deg;
  }
  50% {
    box-shadow: 0 0 25px 5px rgba(59, 60, 61, 0.7);
    --border-angle: 180deg;
  }
  100% {
    box-shadow: 0 0 15px 5px rgba(102, 102, 105, 0.4);
    --border-angle: 360deg;
  }
  }
`

const CaseBox = styled.div`
  justify-content: center;
  align-items: stretch;
  align-self: stretch;
  border-radius: 8px;
  box-shadow: 0px 0px 0px 2px #131413;
  background-color: #1b1d1c;
  z-index: 0;
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  

 
  @media (max-width: 991px) {
    max-width: 100%;
  }

   
`

const CaseItemsContainer = styled.div`
  display: flex;
  min-height: 300px;
  width: 100%;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`

const CaseItemsList = styled.div`
  display: flex;
  width: 100%;
  align-items: stretch;
  justify-content: start;
  flex: 1;
  height: 100%;
  will-change: transform;
  transition: transform 0.05s cubic-bezier(0.33, 1, 0.68, 1);

  .highlight {
    transform: scale(0.8);
    
    box-shadow: 0 0 10px #48d46b;
    z-index: 10;
    position: relative;
    transition: all 0.3s ease;
  }
`
const fadeInScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.2);
    box-shadow: 0 0 0 0 #24d46e;
  }
  80% {
    opacity: 1;
    transform: scale(1.05);
    box-shadow: 0 0 40px 10px #24d46e88;
  }
  100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 74px 26px #2692535e;
  }
`

const CaseItem = styled.article<{ itemWidth: number }>`
  padding-right: 1px;
  justify-content: space-between;
  align-items: stretch;
  border-right: 1px solid var(--color-grey-10, #181a18);
  background: radial-gradient(
    118.46% 167.08% at 38% 110%,
    var(--color-blue-16, #232d27) 0%,
    var(--color-grey-10, #17171c) 80%
  );
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${(props) => props.itemWidth}px;
  min-width: ${(props) => props.itemWidth}px;
  max-width: ${(props) => props.itemWidth}px;
  transition: all 0.3s ease;
  box-sizing: border-box;
`

const WonItemBox = styled(CaseItem)`
  position: absolute;
  left: ${(props) => (props.itemWidth == 400 ? "36%" : "40%")};
  right: 0;
  top: 0;
  z-index: 99;
  height: 330px;
  border-radius: 12px;
  border: 1px solid #36a36d;
  animation: ${fadeInScale} 0.7s cubic-bezier(0.33, 1, 0.68, 1);
  box-shadow: 0 0 74px 26px #2692535e;
  background: #1b1d1c;
  pointer-events: none;
`

const OpenCase = styled.div`
  padding: 0.6em 1em 0.6em;
  border-radius: 5px;
  margin-bottom: 0.9em;
  text-align: center;
  background-color: #46be6e44;

  h2{
    font-family: 'Inter', monospace;
    text-transform: uppercase;
    color: #2bf06cf9;
  }
`

const ItemPrice = styled.div`
  align-self: center;
  z-index: 0;
  display: flex;
  min-height: 18px;
  padding: 20px 0;
  align-items: center;
  gap: 8px;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-size: 14px;
  color: #37ffdd;
  font-weight: 600;
  white-space: nowrap;
  text-align: center;
  line-height: 1;
  justify-content: start;
  @media (max-width: 991px) {
    white-space: initial;
  }
`

const Header = styled.header`
  position: relative;
  display: grid;
  align-items: end;
  width: 100%;
  gap: 1.25rem; 
  justify-content: end;
  padding: 1.25rem 0; 
`

const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;  
`

const Button = styled.button<{ isMuted?: boolean }>`
  display: flex;
  height: 2.75rem;  
  width: 2.75rem;  
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background-color: ${({ isMuted }) => (isMuted ? "#222327" : "#222524")}; 
  padding: 0;
  color: ${({ isMuted }) => (isMuted ? "#4d4e50" : "white")};  
  transition: background-color 0.2s;
  z-index: 10;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #222524;
  }
`

const PriceIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: ${(props: any) => (props.small ? "16px" : "18px")};
  align-self: stretch;
  margin: auto 0;
  flex-shrink: 0;
  max-width: ${(props: any) => (props.small ? "auto" : "58px")};
`

const PriceText = styled.span`
  align-self: stretch;
  margin: auto 0;
  font-size: ${(props: any) => (props.small ? "14px" : "inherit")};
`

const ItemImageContainer = styled.div`
  align-self: center;
  z-index: 0;
  width: 177px;
  max-width: 100%;
`

const ItemImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  aspect-ratio: 1.338;
  margin: -7px 0;
  width: 100%;
  padding: 7px 18px;
  overflow: hidden;
  align-items: stretch;
  justify-content: center;
  @media (max-width: 991px) {
    padding: 7px 20px;
  }
`

const ItemBackground = styled.img`
  position: absolute;
  inset: 0;
  height: 100px;
  width: 100%;
  margin-top: 1em;
  object-position: center;
`

const ItemImage = styled.img`
  aspect-ratio: 0.33;
  object-fit: contain;
  object-position: center;
  width: 100%;
  height: 100%;
`

const ItemInfo = styled.div`
  z-index: 0;
  width: 100%;
  padding: 20px;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-weight: 600;
  text-align: left;
`

const ItemType = styled.div`
  font-family: 'Europa Grotesk';
  padding: 0 10px;
  overflow: hidden;
  font-size: 7px;
  text-align: center;
  color: #494e4b;
  line-height: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  @media (max-width: 991px) {
    padding: 0 5px;
  }
`

const ItemName = styled.div`
  width: 100%;
  padding: 0 5px;
  overflow: hidden;
  font-size: 16px;
  color: #ffffff;
  line-height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  @media (max-width: 991px) {
    padding: 0 5px;
  }
`

const ItemDivider = styled.div`
  position: absolute;
  z-index: 0;
  display: flex;
  min-height: 2px;
  width: 80%;
  max-width: 100%;
  left: 10%;
  bottom: 2px;
  height: 2px;

  &.purple {
    background-color: #8148ea;
  }

  &.red {
    background-color: #fe4760;
  }

  &.yellow {
    background-color: #ffcb77;
  }
`

const TopIndicator = styled.div`
  transform: translate(-50%, 0%);
  position: absolute;
  z-index: 10;
  display: flex;
  min-height: 30px;
  width: 30px;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  left: 50%;
  top: -10px;
  height: 20px;
`

const BottomIndicator = styled.div`
  position: absolute;
  z-index: 10;
  display: flex;
  min-height: 30px;
  width: 30px;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  left: 50%;
  bottom: -10px;
  transform: translate(-50%, 0%);
`

const IndicatorImg = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 100%;
`

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 32px;
  width: 100%;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
  
  @media (max-width: 991px) {
    max-width: 100%;
    flex-direction: column;
    gap: 15px;
  }
`

const PaginationNumbers = styled.nav`
  display: flex;
  align-items: stretch;
  gap: 12px;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-size: 14px;
  color: #ffffff;
  font-weight: 600;
  white-space: nowrap;
  text-align: center;
  line-height: 1;
  @media (max-width: 991px) {
    white-space: initial;
  }

  .prime {
    border: 2px solid #24d46e;
    background-color: transparent;
    animation: morph 4s infinite ease-in-out;
    transition: transform 0.3s ease-in-out;
  }

  @keyframes morph {
    0% { border-radius: 30% 70% 50% 50%; transform: scale(1); }
    20% { border-radius: 50% 30% 70% 40%; transform: scale(1.1) rotate(2deg); }
    40% { border-radius: 60% 50% 30% 70%; transform: scale(1) rotate(-2deg); }
    60% { border-radius: 40% 60% 50% 30%; transform: scale(1.1) rotate(1deg); }
    80% { border-radius: 70% 40% 60% 50%; transform: scale(1) rotate(-1deg); }
    100% { border-radius: 30% 70% 50% 50%; transform: scale(1); }
  }
`

const PageNumber = styled.button`
  align-self: stretch;
  border-radius: 12px;
  background: linear-gradient(rgb(20, 22, 20) 0%, rgb(17, 17, 17) 100%);
  min-height: 46px;
  padding: 0 24px 0 23px;
  display: flex;
  border: 2px solid #2d302e;
  align-items: center;
  justify-content: center;
  width: 46px; 
  height: 46px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #3a3d3a;
  }

  &:active {
    border: 2px solid #24d46e;
  }

  @media (max-width: 991px) {
    padding: 0 20px;
    white-space: initial;
  }
`

const PageNumberc = styled.div`
  align-self: stretch;
  border-radius: 12px;
  background: linear-gradient(rgb(20, 22, 20) 0%, rgb(17, 17, 17) 100%);
  padding: 0 13px 0 13px;
  display: flex;
  border: 2px solid #2d302e;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #3a3d3a;
  }

  &:active {
    border: 2px solid #24d46e;
  }

  @media (max-width: 991px) {
    padding: 0 20px;
    white-space: initial;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 991px) {
    width: 100%;
    justify-content: space-between;
  }
`

const OpenCaseButtonInnerx = styled.button`
  border-radius: 9px;
  border: 1px solid transparent;
  display: flex;
  width: 260px;
  height: 46px;
  padding: 8px 12px 8px 12px;
  flex-direction: row;
  font-family: 'ProximaNova-Italic', monospace;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #ffffff;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: linear-gradient(204deg, #11f78460 -7%, #b85cff20 33%), linear-gradient(162deg, #11f78460 -10%, #2c88dd20 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
    border-color: #24d46e;
  }
 
  @media (max-width: 991px) {
    width: 100%;
    padding: 18px 20px;
  }
`

const OpenCaseButtonInner = styled.button`
  border-radius: 9px;
  background: linear-gradient(204deg, #565a5840 -7%, #b85cff00 33%), linear-gradient(162deg, #666968 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  border: 1px solid #171a17;
  display: inline-flex;
  width: 200px;
  height: 46px;
  padding: 8px 12px 8px 12px;
  gap: 12px;
  font-family: 'ProximaNova-Italic', monospace;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: linear-gradient(204deg, #3c413e5f -7%, #b85cff20 33%), linear-gradient(162deg, #4e57535f -10%, #2c88dd20 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
    border-color: #303633;
  }
 
  @media (max-width: 991px) {
    width: 100%;
    padding: 18px 20px;
  }
`

const OpenCaseText = styled.h6`
  font-size: 12px;
  text-transform: uppercase;
  
  @media (max-width: 991px) {
    white-space: normal;
  }
`

const CaseInfoBox = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 0.7em 1em 0.7em;
  flex-direction: column;
`

const CaseInfoTitle = styled.div`
  padding-bottom: 2px;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-size: 9px;
  color: #b6bbce;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  line-height: 1;
`

const CaseInfoPriceRange = styled.div`
  display: flex;
  align-items: end;
  justify-content: start;

  ul {
    display: inline-flex;
    align-items: center;
    gap: 5px;

    h5 {
      color: #aeb4b0;
      margin: 0;
    }
  }
`

const CenterDebugIndicator = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  z-index: 20;
  pointer-events: none;
  
  .center-line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 1px;
    background-color: rgba(255, 255, 0, 0.3);
  }
`

// Flash Case Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999999;
  backdrop-filter: blur(4px);
`

const ModalContent = styled.div`
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  border-radius: 16px;
  border: 1px solid #2d302e;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #2d302e;
`

const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #222524;
  border: none;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2d302e;
  }
`

const ModalBody = styled.div`
  padding: 24px;
`

const QuantitySection = styled.div`
  margin-bottom: 24px;
`

const QuantityLabel = styled.label`
  display: block;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
`

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
`

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #222524;
  border: 1px solid #2d302e;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #2d302e;
    border-color: #41b45e;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const QuantityDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 40px;
  border-radius: 8px;
  background-color: #1a1c1b;
  border: 1px solid #2d302e;
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`

const QuantityPresets = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`

const PresetButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? "#41b45e" : "#222524")};
  border: 1px solid ${(props) => (props.active ? "#41b45e" : "#2d302e")};
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? "#369954" : "#2d302e")};
  }
`

const CostInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  background-color: #1a1c1b;
  border: 1px solid #2d302e;
  margin-bottom: 24px;
`

const CostLabel = styled.span`
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #b6bbce;
`

const CostValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`

const FlashInfo = styled.div`
  margin-bottom: 24px;
`

const InfoText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  color: #b6bbce;
  margin: 8px 0;
  line-height: 1.4;
`

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #2d302e;
`

const CancelButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: #222524;
  border: 1px solid #2d302e;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2d302e;
  }
`

const ConfirmButton = styled.button`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: #41b45e;
  border: 1px solid #41b45e;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #369954;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

// Flash Progress Styles
const FlashProgressOverlay = styled.div`
  position: fixed;
 
  left: 0;
  right: 0;
  bottom: 9%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  z-index: 1001;
  
`


const CardInfo = styled.div`
  padding: 0.4em 1em 0.4em;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  border-radius: 16px;
  border: 1px solid #41b45e;

  svg{
    height: 15px;
    width: 15px;
  }
`;

const FlashProgressContent = styled.div`
  background: linear-gradient(145deg, #1a1c1b 0%, #0f1110 100%);
  border-radius: 16px;
  border: 1px solid #41b45e;
  padding: 32px;
  text-align: center;
  min-width: 300px;
  max-width: 430px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`

const FlashProgressTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 24px 0;
`

const FlashProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #222524;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
`

const FlashProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #41b45e 0%, #369954 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
`

const FlashProgressText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #b6bbce;
  margin: 0;
`

export default CaseSection
