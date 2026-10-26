"use client"

import styled, { keyframes, css } from "styled-components"
import HeadGlobal from "@/club/head/glob.n"
import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import axios from "axios"
import Image from "next/image"
import LoadingPageView from "@club/resources/loading/market.loading"
import { BigboxList } from "@/data/recharge/box.vision"
import BoxOpening from "@club/resources/box/box.container"
import NotificationUI from "@club/components/notification/card.mnc"
import router from "next/router"
import { CustomSelect } from "@/.spacevision/screens/garage-modal"

interface Inventory {
  [key: string]: number
}

interface Props {
  id: string
  username: React.ReactNode
}

// Define item size types (1x1, 1x2, 2x1, 2x2)
type ItemSize = "small" | "medium" | "large" | "xlarge"

// Define filter and sort options
type FilterOption = "all" | "common" | "uncommon" | "rare" | "epic" | "legendary"
type SortOption = "default" | "quantity" | "rarity" | "name"

interface GridItem {
  id: string
  containerKey: string
  quantity: number
  containerData: any
  size: ItemSize
  position: { x: number; y: number }
  width: number
  height: number
}

// Grid configuration
const GRID_COLS = 6
const GRID_ROWS = 6
const TOTAL_SLOTS = GRID_COLS * GRID_ROWS

export default function Inventory({ id, username }: Props) {
  const [inventory, setInventory] = useState<Inventory>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [openStatus, setOpenStatus] = useState("")
  const [isBoxOpeningVisible, setIsBoxOpeningVisible] = useState(false)
  const [itemWon, setItemWon] = useState<string | null>(null)
  const [possibleItems, setPossibleItems] = useState<{ id: number; imagem: string; nameitem: string }[]>([])
  const [NotificationK, setNotificationK] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [gridItems, setGridItems] = useState<GridItem[]>([])
  const [gridMatrix, setGridMatrix] = useState<boolean[][]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOption, setFilterOption] = useState<FilterOption>("all")
  const [sortOption, setFilterSort] = useState<SortOption>("default")
  const [showItemDetails, setShowItemDetails] = useState(false)
  const [detailedItem, setDetailedItem] = useState<GridItem | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [gridHistory, setGridHistory] = useState<GridItem[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isCompactView, setIsCompactView] = useState(false)
  const [autoArrange, setAutoArrange] = useState(true)

  // Initialize grid matrix
  useEffect(() => {
    const matrix = Array(GRID_ROWS)
      .fill(null)
      .map(() => Array(GRID_COLS).fill(false))
    setGridMatrix(matrix)
  }, [])

  // Save grid state to history for undo/redo
  const saveToHistory = useCallback(
    (items: GridItem[]) => {
      // Remove future history if we're not at the end
      const newHistory = gridHistory.slice(0, historyIndex + 1)
      // Add current state to history
      newHistory.push([...items])
      // Limit history size
      if (newHistory.length > 20) {
        newHistory.shift()
      }
      setGridHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [gridHistory, historyIndex],
  )

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setGridItems([...gridHistory[newIndex]])
      setHistoryIndex(newIndex)
      updateGridMatrix(gridHistory[newIndex])
    }
  }, [historyIndex, gridHistory])

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < gridHistory.length - 1) {
      const newIndex = historyIndex + 1
      setGridItems([...gridHistory[newIndex]])
      setHistoryIndex(newIndex)
      updateGridMatrix(gridHistory[newIndex])
    }
  }, [historyIndex, gridHistory])

  // Update grid matrix based on items
  const updateGridMatrix = useCallback((items: GridItem[]) => {
    const newMatrix = Array(GRID_ROWS)
      .fill(null)
      .map(() => Array(GRID_COLS).fill(false))

    items.forEach((item) => {
      for (let i = item.position.y; i < item.position.y + item.height; i++) {
        for (let j = item.position.x; j < item.position.x + item.width; j++) {
          if (i < GRID_ROWS && j < GRID_COLS) {
            newMatrix[i][j] = true
          }
        }
      }
    })

    setGridMatrix(newMatrix)
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/autentic/inventory?userId=${id}`)
      if (response.data.success) {
        setInventory(response.data.inventory || {})
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      setError("Erro ao carregar o inventário.")
      console.error(err)
    } finally {
      setLoading(false)
      setTimeout(() => setIsInitialized(true), 500)
    }
  }

  // Determine item size based on quantity or other factors
  const getItemSize = (quantity: number, containerKey: string): ItemSize => {
    // This is where you can implement your logic to determine item size
    // For example, based on quantity or item type
    if (quantity >= 100) return "xlarge" // 2x2
    if (quantity >= 50) return "large" // 2x1
    if (quantity >= 20) return "medium" // 1x2
    return "small" // 1x1
  }

  // Get dimensions based on item size
  const getItemDimensions = (size: ItemSize): { width: number; height: number } => {
    switch (size) {
      case "xlarge":
        return { width: 2, height: 2 }
      case "large":
        return { width: 2, height: 1 }
      case "medium":
        return { width: 1, height: 2 }
      default:
        return { width: 1, height: 1 }
    }
  }

  // Find next available position for an item
  const findNextAvailablePosition = (
    width: number,
    height: number,
    matrix = gridMatrix,
  ): { x: number; y: number } | null => {
    // First try to find a position that doesn't split the grid unnecessarily
    // This helps prevent fragmentation
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        if (isPositionValidInMatrix(x, y, width, height, matrix)) {
          // Check if this position is adjacent to an existing item or edge
          const isAdjacentToItem =
            x === 0 ||
            y === 0 ||
            x + width === GRID_COLS ||
            y + height === GRID_ROWS || // Edge
            (x > 0 && matrix[y][x - 1]) || // Left
            (y > 0 && matrix[y - 1][x]) || // Top
            (x + width < GRID_COLS && matrix[y][x + width]) || // Right
            (y + height < GRID_ROWS && matrix[y + height][x]) // Bottom

          if (isAdjacentToItem) {
            return { x, y }
          }
        }
      }
    }

    // If no optimal position found, fall back to first available
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        if (isPositionValidInMatrix(x, y, width, height, matrix)) {
          return { x, y }
        }
      }
    }
    return null
  }

  // Auto-arrange all items to optimize space
  const autoArrangeItems = useCallback(() => {
    // Sort items by size (largest first)
    const sortedItems = [...gridItems].sort((a, b) => {
      const aSize = a.width * a.height
      const bSize = b.width * b.height
      return bSize - aSize
    })

    // Reset grid matrix
    const newMatrix = Array(GRID_ROWS)
      .fill(null)
      .map(() => Array(GRID_COLS).fill(false))

    // Place items in optimal positions
    const arrangedItems: GridItem[] = []

    sortedItems.forEach((item) => {
      const position = findNextAvailablePosition(item.width, item.height, newMatrix)

      if (position) {
        // Create new item with updated position
        const newItem = {
          ...item,
          position,
        }

        // Mark positions as occupied
        for (let i = position.y; i < position.y + item.height; i++) {
          for (let j = position.x; j < position.x + item.width; j++) {
            if (i < GRID_ROWS && j < GRID_COLS) {
              newMatrix[i][j] = true
            }
          }
        }

        arrangedItems.push(newItem)
      }
    })

    // Save current state to history before changing
    saveToHistory(gridItems)

    // Update state
    setGridItems(arrangedItems)
    setGridMatrix(newMatrix)

    // Show notification
    setOpenStatus("Inventário reorganizado com sucesso!")
    setNotificationK(true)
    setTimeout(() => {
      setNotificationK(false)
    }, 3000)
  }, [gridItems, saveToHistory])

  // Organize items in the grid - only for new items
  const organizeItems = useCallback(() => {
    // Reset grid matrix
    const newMatrix = Array(GRID_ROWS)
      .fill(null)
      .map(() => Array(GRID_COLS).fill(false))

    // Create grid items from inventory
    const newGridItems: GridItem[] = []
    const existingItemsMap = new Map(gridItems.map((item) => [item.containerKey, item]))

    Object.keys(inventory).forEach((containerKey) => {
      const quantity = inventory[containerKey]
      const containerData = BigboxList.find((box) => box.receive === containerKey)

      if (containerData) {
        const size = getItemSize(quantity, containerKey)
        const { width, height } = getItemDimensions(size)

        // Check if item already exists in gridItems
        const existingItem = existingItemsMap.get(containerKey)

        let position
        let newItem: GridItem

        if (existingItem) {
          // Keep existing position if item already exists
          position = existingItem.position

          // Update the item with new quantity but keep position
          newItem = {
            ...existingItem,
            quantity,
            size,
            width,
            height,
          }

          // Check if the item still fits at its position (size might have changed)
          const stillFits = isPositionValidForItem(position.x, position.y, width, height, newMatrix, containerKey)

          if (!stillFits && autoArrange) {
            // Find a new position if it doesn't fit anymore
            position = findNextAvailablePosition(width, height, newMatrix)
            if (position) {
              newItem.position = position
            }
          }
        } else {
          // Find new position for new items
          position = findNextAvailablePosition(width, height, newMatrix)

          if (position) {
            newItem = {
              id: `item-${containerKey}`,
              containerKey,
              quantity,
              containerData,
              size,
              position,
              width,
              height,
            }
          }
        }

        if (position) {
          // Mark positions as occupied in the matrix
          for (let i = position.y; i < position.y + height; i++) {
            for (let j = position.x; j < position.x + width; j++) {
              if (i < GRID_ROWS && j < GRID_COLS) {
                newMatrix[i][j] = true
              }
            }
          }

          newGridItems.push(newItem!)
        }
      }
    })

    // Check if items were removed from inventory
    const currentKeys = Object.keys(inventory)
    const removedItems = gridItems.filter((item) => !currentKeys.includes(item.containerKey))

    // If there are removed items, show notification
    if (removedItems.length > 0 && isInitialized) {
      setOpenStatus(`${removedItems.length} item(s) removido(s) do inventário`)
      setNotificationK(true)
      setTimeout(() => {
        setNotificationK(false)
      }, 3000)
    }

    // Save to history if initialized (don't save initial load)
    if (isInitialized && gridItems.length > 0) {
      saveToHistory(gridItems)
    }

    setGridItems(newGridItems)
    setGridMatrix(newMatrix)
  }, [inventory, gridItems, autoArrange, isInitialized, saveToHistory])

  // Check if a position is valid for a specific item (considering its size)
  const isPositionValidForItem = (
    x: number,
    y: number,
    width: number,
    height: number,
    matrix: boolean[][],
    itemKey: string,
  ): boolean => {
    // Check if position is within grid bounds
    if (x < 0 || y < 0 || x + width > GRID_COLS || y + height > GRID_ROWS) {
      return false
    }

    // Find the item we're checking for
    const currentItem = gridItems.find((item) => item.containerKey === itemKey)

    // Check if all required slots are empty or occupied by this item
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        // Skip checking if this position is occupied by the current item
        if (currentItem) {
          const currentX = currentItem.position.x
          const currentY = currentItem.position.y
          const currentW = currentItem.width
          const currentH = currentItem.height

          // If this position is within the current item's bounds, it's valid
          if (j >= currentX && j < currentX + currentW && i >= currentY && i < currentY + currentH) {
            continue
          }
        }

        // Otherwise check if the position is occupied
        if (matrix[i][j]) {
          return false
        }
      }
    }

    return true
  }

  // Update grid when inventory changes - but don't reorganize existing items
  useEffect(() => {
    if (Object.keys(inventory).length > 0) {
      // Clear timeout if it exists
      const timeoutId = setTimeout(() => {
        organizeItems()
      }, 200)

      // Cleanup function
      return () => clearTimeout(timeoutId)
    }
  }, [inventory, organizeItems])

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleOpenContainer = async (containerKey: string) => {
    try {
      const response = await axios.post("/api/autentic/open.container", { userId: id, containerType: containerKey })

      if (response.data.success) {
        setItemWon(response.data.itemImage)
        setIsBoxOpeningVisible(true)
        router.replace({
          pathname: router.pathname,
          query: router.query,
          hash: "#open",
        })

        setPossibleItems(response.data.possibleItems)
        setNotificationK(true)
        setOpenStatus("Container aberto com sucesso!")
        setTimeout(() => {
          setNotificationK(false)
        }, 5000)

        // Fetch updated inventory data
        await fetchInventory()
        // Force grid reorganization after inventory update
        setTimeout(() => organizeItems(), 100)
      } else {
        setOpenStatus("Falha ao abrir o container.")
        setTimeout(() => {
          setNotificationK(false)
        }, 5000)
      }
    } catch (error) {
      console.error("Erro ao abrir o container:", error)
      setOpenStatus("Erro ao abrir o container.")
      setTimeout(() => {
        setNotificationK(false)
      }, 5000)
    }
  }

  const handleResetBox = () => {
    setIsBoxOpeningVisible(false)
    setItemWon(null)
    organizeItems()
    fetchInventory()
  }

  useEffect(() => {
    // Adiciona um listener para verificar a tecla ESC
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        if (showItemDetails) {
          setShowItemDetails(false)
          setDetailedItem(null)
        } else if (isBoxOpeningVisible) {
          handleResetBox()
        }
      }
    }

    // Adicionar o evento ao montar o componente
    window.addEventListener("keydown", handleKeyDown)

    // Remover o evento ao desmontar o componente
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [router.query, router, showItemDetails, isBoxOpeningVisible])

  const getRarityLevel = (quantity: number) => {
    if (quantity >= 100) return "legendary"
    if (quantity >= 50) return "epic"
    if (quantity >= 20) return "rare"
    if (quantity >= 5) return "uncommon"
    return "common"
  }

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, itemId: string, x: number, y: number) => {
    setIsDragging(true)
    setDraggedItem(itemId)

    // Calculate offset from the top-left corner of the item
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })

    e.preventDefault()
  }

  // Check if a position is valid for an item in a specific matrix
  const isPositionValidInMatrix = (
    x: number,
    y: number,
    width: number,
    height: number,
    matrix: boolean[][],
  ): boolean => {
    // Check if position is within grid bounds
    if (x < 0 || y < 0 || x + width > GRID_COLS || y + height > GRID_ROWS) {
      return false
    }

    // Check if all required slots are empty
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        if (matrix[i][j]) {
          return false
        }
      }
    }

    return true
  }

  // Handle drag move
  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedItem) return

    const item = gridItems.find((item) => item.id === draggedItem)
    if (!item) return

    // Get grid container position
    const gridElement = containerRef.current?.querySelector(".inventory-grid")
    const gridRect = gridElement?.getBoundingClientRect()
    if (!gridRect) return

    // Calculate cell dimensions accounting for padding and gaps
    const gridPadding = 8
    const gap = 8
    const availableWidth = gridRect.width - gridPadding * 2
    const availableHeight = gridRect.height - gridPadding * 2
    const cellWidth = (availableWidth - gap * (GRID_COLS - 1)) / GRID_COLS
    const cellHeight = (availableHeight - gap * (GRID_ROWS - 1)) / GRID_ROWS

    // Calculate position relative to grid content area
    const relativeX = e.clientX - gridRect.left - gridPadding - dragOffset.x
    const relativeY = e.clientY - gridRect.top - gridPadding - dragOffset.y

    // Convert to grid coordinates
    const x = Math.max(0, Math.min(GRID_COLS - item.width, Math.round(relativeX / (cellWidth + gap))))
    const y = Math.max(0, Math.min(GRID_ROWS - item.height, Math.round(relativeY / (cellHeight + gap))))

    // Create a temporary matrix without the current item
    const tempMatrix = gridMatrix.map((row) => [...row])

    // Clear current item's position from temp matrix
    for (let i = item.position.y; i < item.position.y + item.height; i++) {
      for (let j = item.position.x; j < item.position.x + item.width; j++) {
        if (i < GRID_ROWS && j < GRID_COLS) {
          tempMatrix[i][j] = false
        }
      }
    }

    // Check if new position is valid
    if (isPositionValidInMatrix(x, y, item.width, item.height, tempMatrix)) {
      // Update item position
      const updatedItems = gridItems.map((gi) => (gi.id === draggedItem ? { ...gi, position: { x, y } } : gi))

      // Update grid matrix
      const newMatrix = [...tempMatrix]
      for (let i = y; i < y + item.height; i++) {
        for (let j = x; j < x + item.width; j++) {
          if (i < GRID_ROWS && j < GRID_COLS) {
            newMatrix[i][j] = true
          }
        }
      }

      setGridItems(updatedItems)
      setGridMatrix(newMatrix)
    }
  }

  // Handle drag end
  const handleDragEnd = () => {
    if (isDragging && draggedItem) {
      // Save the current state to history
      saveToHistory(gridItems)
    }

    setIsDragging(false)
    setDraggedItem(null)
  }

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        handleDragMove(e as unknown as React.MouseEvent)
      }

      const handleMouseUp = () => {
        handleDragEnd()
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, draggedItem])

  // Handle item click
  const handleItemClick = (item: GridItem) => {
    if (isDragging) return

    setSelectedSlot(item.id)

    // If right-click or ctrl+click, show details instead of opening
    if (window.event && (window.event as any).ctrlKey) {
      setDetailedItem(item)
      setShowItemDetails(true)
    } else {
      handleOpenContainer(item.containerKey)
    }
  }

  // Filter and sort items
  const filteredItems = gridItems
    .filter((item) => {
      // Apply search filter
      if (searchTerm && !item.containerData.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Apply rarity filter
      if (filterOption !== "all") {
        const rarity = getRarityLevel(item.quantity)
        if (rarity !== filterOption) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortOption) {
        case "quantity":
          return b.quantity - a.quantity
        case "rarity":
          const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 }
          return (
            rarityOrder[getRarityLevel(b.quantity) as keyof typeof rarityOrder] -
            rarityOrder[getRarityLevel(a.quantity) as keyof typeof rarityOrder]
          )
        case "name":
          return a.containerData.title.localeCompare(b.containerData.title)
        default:
          return 0
      }
    })

  // Calculate inventory stats
const totalItems = Object.values(inventory).reduce((sum, quantity) => {
  const num = typeof quantity === 'number' ? quantity : parseInt(quantity) || 0
  return sum + num
}, 0)
  const usedSlots = gridItems.length
  const usedSpace = gridItems.reduce((sum, item) => sum + item.width * item.height, 0)
  const totalSpace = GRID_COLS * GRID_ROWS
  const spaceUsagePercent = Math.round((usedSpace / totalSpace) * 100)

  return (
    <>
      <HeadGlobal Title="Matriz de armazenamento | Clubvision" />

      <InventoryContainer ref={containerRef} isInitialized={isInitialized}>
  
        {isBoxOpeningVisible ? (
          <BoxOpening itemWon={itemWon} possibleItems={possibleItems} onReset={handleResetBox} />
        ) : (
          <MainContent>
            {loading ? (
              <LoadingContainer>
                <LoadingPageView />
                <LoadingText>Inicializando o armazenamento...</LoadingText>
              </LoadingContainer>
            ) : error ? (
              <EmptyState>
                <HologramIcon>
                  <Image src={"/nvrp/logonvrp.png"} alt="novision" height={120} width={120} />
                  <IconGlow />
                </HologramIcon>
                <EmptyMessage>
                 
                  <p>{error === "Erro ao carregar o inventário." ? "" : error}</p>
                </EmptyMessage>
              </EmptyState>
            ) : Object.keys(inventory).length === 0 ? (
              <EmptyState>
                <HologramIcon>
                  <Image src={"/nvrp/logonvrp.png"} alt="novision" height={120} width={120} />
                  <IconGlow />
                </HologramIcon>
                <EmptyMessage>
                  <h3>Armazenamento vazia</h3>
                  <p>Nenhum item detectado na grade de armazenamento</p>
                </EmptyMessage>
              </EmptyState>
            ) : (
              <InventoryInterface>
                <InterfaceHeader>
                  <InterfaceTitle>MEU INVENTARIO</InterfaceTitle>

                  <InventoryControls>
                    <SearchBar>
                      <SearchIcon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#41b45e" strokeWidth="2">
                          <circle cx="11" cy="11" r="8" />
                          <path d="M21 21l-4.35-4.35" />
                        </svg>
                      </SearchIcon>
                      <SearchInput
                        type="text"
                        placeholder="Buscar itens..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </SearchBar>

                    <FilterControls>

                       <CustomSelect
                          options={[
                           
                            { label: "Comum", value: "common" },
                            { label: "Incomum", value: "uncommon" },
                            { label: "Raro", value: "rare" },
                            { label: "Épico", value: "epic" },
                            { label: "Lendário", value: "legendary" },
                          ]}
                          value={filterOption}
                          onChange={(value) => setFilterOption(value as FilterOption)}

                          placeholder="Ordenar por"
                        />
 
     <CustomSelect
                          options={[
                           
                            { label: "Quantidade", value: "quantity" },
                            { label: "Raridade", value: "rarity" },
                            { label: "Nome", value: "name" },
                            { label: "Épico", value: "epic" },
                            { label: "Lendário", value: "legendary" },
                          ]}
                          value={sortOption} 
                          onChange={(value) => setFilterSort(value as SortOption)}
                          placeholder="Ordenar por"
                        />
 
                 
                    </FilterControls>
                  </InventoryControls>
                </InterfaceHeader>

                <InventoryStats>
                  <StatBlock>
                    <StatIcon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#41b45e" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 3v18" />
                        <path d="M15 3v18" />
                        <path d="M3 9h18" />
                        <path d="M3 15h18" />
                      </svg>
                    </StatIcon>
                    <StatInfo>
                      <StatLabel>Capacidade</StatLabel>
                      <StatValue>{`${usedSlots}/${TOTAL_SLOTS}`}</StatValue>
                    </StatInfo>
                  </StatBlock>

                  <StatBlock>
                    <StatIcon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#41b45e" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </StatIcon>
                    <StatInfo>
                      <StatLabel>Total de Itens</StatLabel>
                      <StatValue>{totalItems}</StatValue>
                    </StatInfo>
                  </StatBlock>

                  <StatBlock>
                    <StatIcon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#41b45e" strokeWidth="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </StatIcon>
                    <StatInfo>
                      <StatLabel>Espaço Utilizado</StatLabel>
                      <StatValue>{`${spaceUsagePercent}%`}</StatValue>
                    </StatInfo>
                  </StatBlock>
                </InventoryStats>

                <ActionToolbar>
                  <ActionButton onClick={autoArrangeItems} title="Reorganizar automaticamente">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 3v18" />
                      <path d="M15 3v18" />
                      <path d="M3 9h18" />
                      <path d="M3 15h18" />
                    </svg>
                    <span>Auto-organizar</span>
                  </ActionButton>

                  <ActionButton onClick={handleUndo} disabled={historyIndex <= 0} title="Desfazer última ação">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2">
                      <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6M3 10l6-6" />
                    </svg>
                    <span>Desfazer</span>
                  </ActionButton>

                  <ActionButton
                    onClick={handleRedo}
                    disabled={historyIndex >= gridHistory.length - 1}
                    title="Refazer última ação"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2">
                      <path d="M21 10H11a8 8 0 0 0-8 8v2M21 10l-6 6M21 10l-6-6" />
                    </svg>
                    <span>Refazer</span>
                  </ActionButton>

                  <ActionButton
                    onClick={() => setAutoArrange(!autoArrange)}
                    active={autoArrange}
                    title={autoArrange ? "Desativar reorganização automática" : "Ativar reorganização automática"}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    <span>{autoArrange ? "Auto-ajuste ON" : "Auto-ajuste OFF"}</span>
                  </ActionButton>

                  <ActionButton
                    onClick={() => setIsCompactView(!isCompactView)}
                    active={isCompactView}
                    title={isCompactView ? "Visualização normal" : "Visualização compacta"}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                    <span>{isCompactView ? "Vista Normal" : "Vista Compacta"}</span>
                  </ActionButton>

                  <ActionButton onClick={() => setShowHelp(!showHelp)} active={showHelp} title="Ajuda">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>Ajuda</span>
                  </ActionButton>
                </ActionToolbar>
 
                {showHelp && (
                  <HelpPanel>
                    <HelpTitle>Ajuda do Inventário</HelpTitle>
                    <HelpContent>
                      <HelpSection>
                        <HelpSectionTitle>Controles Básicos</HelpSectionTitle>
                        <HelpList>
                          <HelpItem>
                            <HelpItemIcon><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><rect x="5" y="2" width="14" height="20" rx="7"/><path d="M12 6v4"/></svg></HelpItemIcon>
                            <HelpItemText>
                              <strong>Clique</strong> em um item para abri-lo
                            </HelpItemText>
                          </HelpItem>
                          <HelpItem>
                            <HelpItemIcon><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="m16 16-1.9-1.9"/></svg> </HelpItemIcon>
                            <HelpItemText>
                              <strong>Ctrl+Clique</strong> para ver detalhes do item
                            </HelpItemText>
                          </HelpItem>
                          <HelpItem>
                            <HelpItemIcon><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4"/><path d="M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5"/><path d="M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0"/></svg></HelpItemIcon>
                            <HelpItemText>
                              <strong>Arraste</strong> itens para reorganizar
                            </HelpItemText>
                          </HelpItem>
                          <HelpItem>
                            <HelpItemIcon><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg></HelpItemIcon>
                            <HelpItemText>
                              <strong>ESC</strong> para fechar painéis
                            </HelpItemText>
                          </HelpItem>
                        </HelpList>
                      </HelpSection>

                      <HelpSection>
                        <HelpSectionTitle>Recursos</HelpSectionTitle>
                        <HelpList>
                          <HelpItem>
                            <HelpItemIcon><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M3 2v6h6"/><path d="M21 12A9 9 0 0 0 6 5.3L3 8"/><path d="M21 22v-6h-6"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/><circle cx="12" cy="12" r="1"/></svg></HelpItemIcon>
                            <HelpItemText>
                              <strong>Auto-organizar</strong> reorganiza automaticamente seu inventário
                            </HelpItemText>
                          </HelpItem>
                          <HelpItem>
                            <HelpItemIcon><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg></HelpItemIcon>
                            <HelpItemText>
                              <strong>Desfazer/Refazer</strong> reverte ou reaplica alterações
                            </HelpItemText>
                          </HelpItem>
                          <HelpItem>
                            <HelpItemIcon><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg></HelpItemIcon>
                            <HelpItemText>
                              <strong>Busca e Filtros</strong> ajudam a encontrar itens específicos
                            </HelpItemText>
                          </HelpItem>
                        </HelpList>
                      </HelpSection>
                    </HelpContent>
                    <CloseHelpButton onClick={() => setShowHelp(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </CloseHelpButton>
                  </HelpPanel>
                )}

                <InventoryGrid className="inventory-grid" isCompactView={isCompactView}>
                  {/* Grid background cells */}
                  {Array.from({ length: TOTAL_SLOTS }).map((_, index) => {
                    const x = index % GRID_COLS
                    const y = Math.floor(index / GRID_COLS)
                    const isOccupied = gridMatrix[y]?.[x]

                    return <GridCell key={`cell-${x}-${y}`} x={x} y={y} isOccupied={isOccupied} />
                  })}

                  {/* Render items on top of the grid */}
                  {filteredItems.map((item) => {
                    const rarity = getRarityLevel(item.quantity)
                    const isSelected = selectedSlot === item.id
                    const isHovered = hoveredSlot === item.id
                    const isDragged = draggedItem === item.id

                    return (
                      <InventoryItem
                        key={item.id}
                        x={item.position.x}
                        y={item.position.y}
                        width={item.width}
                        height={item.height}
                        rarity={rarity}
                        isSelected={isSelected}
                        isHovered={isHovered}
                        isDragged={isDragged}
                        isCompactView={isCompactView}
                        onMouseDown={(e) => handleDragStart(e, item.id, item.position.x, item.position.y)}
                        onMouseEnter={() => setHoveredSlot(item.id)}
                        onMouseLeave={() => setHoveredSlot(null)}
                        onClick={() => handleItemClick(item)}
                      >
                        <SlotBackground rarity={rarity} />
                        <SlotBorder rarity={rarity} />

                        <ItemContainer>
                          <ItemHologram>
                            <ItemImage src={item.containerData.image} alt={item.containerData.title} />
                            <ItemGlow rarity={rarity} />
                            <ItemReflection />
                          </ItemHologram>

                          <ItemInfo>
                            <ItemName rarity={rarity}>{item.containerData.title}</ItemName>
                            <ItemQuantityBadge rarity={rarity}>
                              <QuantityIcon>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />
                                  <path d="M12 12L20 7.5" stroke="currentColor" strokeWidth="2" />
                                  <path d="M12 12V21" stroke="currentColor" strokeWidth="2" />
                                  <path d="M12 12L4 7.5" stroke="currentColor" strokeWidth="2" />
                                </svg>
                              </QuantityIcon>
                              <span>{item.quantity}</span>
                            </ItemQuantityBadge>
                          </ItemInfo>

                          <RarityIndicator rarity={rarity} />
                          <SizeIndicator size={item.size} />

                          {isHovered && (
                            <ItemTooltip>
                              <TooltipTitle>{item.containerData.title}</TooltipTitle>
                              <TooltipDetail>Quantidade: {item.quantity}</TooltipDetail>
                              <TooltipDetail>
                                Raridade: {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                              </TooltipDetail>
                              <TooltipDetail>Clique para abrir</TooltipDetail>
                              <TooltipDetail>Ctrl+Clique para detalhes</TooltipDetail>
                            </ItemTooltip>
                          )}
                        </ItemContainer>

                        <SlotEffects rarity={rarity} isHovered={isHovered} />
                      </InventoryItem>
                    )
                  })}
                </InventoryGrid>

                {showItemDetails && detailedItem && (
                  <ItemDetailsPanel>
                    <DetailsPanelHeader>
                      <DetailsPanelTitle>Detalhes do Item</DetailsPanelTitle>
                      <CloseDetailsButton
                        onClick={() => {
                          setShowItemDetails(false)
                          setDetailedItem(null)
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </CloseDetailsButton>
                    </DetailsPanelHeader>

                    <DetailsPanelContent>
                      <ItemDetailImage>
                        <img
                          src={detailedItem.containerData.image || "/placeholder.svg"}
                          alt={detailedItem.containerData.title}
                        />
                        <RarityBadge rarity={getRarityLevel(detailedItem.quantity)}>
                          {getRarityLevel(detailedItem.quantity).toUpperCase()}
                        </RarityBadge>
                      </ItemDetailImage>

                      <ItemDetailInfo>
                        <ItemDetailName>{detailedItem.containerData.title}</ItemDetailName>
                        <ItemDetailDescription>
                          {detailedItem.containerData.description || "Nenhuma descrição disponível."}
                        </ItemDetailDescription>

                        <ItemDetailStats>
                          <ItemDetailStat>
                            <ItemDetailStatLabel>Quantidade</ItemDetailStatLabel>
                            <ItemDetailStatValue>{detailedItem.quantity}</ItemDetailStatValue>
                          </ItemDetailStat>

                          <ItemDetailStat>
                            <ItemDetailStatLabel>Tamanho</ItemDetailStatLabel>
                            <ItemDetailStatValue>
                              {detailedItem.width}x{detailedItem.height}
                            </ItemDetailStatValue>
                          </ItemDetailStat>

                          <ItemDetailStat>
                            <ItemDetailStatLabel>Posição</ItemDetailStatLabel>
                            <ItemDetailStatValue>
                              {detailedItem.position.x}, {detailedItem.position.y}
                            </ItemDetailStatValue>
                          </ItemDetailStat>
                        </ItemDetailStats>
                      </ItemDetailInfo>
                    </DetailsPanelContent>

                    <DetailsPanelActions>
                      <DetailActionButton
                        onClick={() => {
                          setShowItemDetails(false)
                          handleOpenContainer(detailedItem.containerKey)
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2">
                          <polyline points="16 16 12 12 8 16" />
                          <line x1="12" y1="12" x2="12" y2="21" />
                          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                          <polyline points="16 16 12 12 8 16" />
                        </svg>
                        Abrir Container
                      </DetailActionButton>
                    </DetailsPanelActions>
                  </ItemDetailsPanel>
                )}
              </InventoryInterface>
            )}

            {NotificationK && openStatus && <NotificationUI message={<>{openStatus}</>} />}
          </MainContent>
        )}
      </InventoryContainer>
    </>
  )
}

// Keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`

const scan = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); }
`

const hologramFlicker = keyframes`
  0%, 100% { opacity: 1; }
  98% { opacity: 1; }
  99% { opacity: 0.8; }
`

const particleFloat = keyframes`
  0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100px) translateX(50px) rotate(360deg); opacity: 0; }
`

const energyFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const rarityGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px currentColor; }
  50% { box-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
`

const gridPulse = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

// Styled Components
const InventoryContainer = styled.div<{ isInitialized: boolean }>`
  position: relative;
  width: 100%;
 
  color: #e0e0e0;
  font-family: 'Orbitron', 'Poppins', sans-serif;
  overflow-x: hidden;
  opacity: ${(props) => (props.isInitialized ? 1 : 0)};
  transition: opacity 1s ease-in-out;
`
 

const StatValue = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #41b45e;
  text-shadow: 0 0 10px rgba(65, 180, 94, 0.5);
`

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(224, 224, 224, 0.7);
  letter-spacing: 1px;
  margin-top: 5px;
`

const MainContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 20px;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`

const LoadingText = styled.div`
  margin-top: 20px;
  font-size: 1.2rem;
  color: #41b45e;
  letter-spacing: 2px;
  animation: ${pulse} 2s infinite;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  margin: 40px auto;
  max-width: 500px;
 
`

const HologramIcon = styled.div`
  position: relative;
  margin-bottom: 30px;
  animation: ${float} 6s ease-in-out infinite;
`

const IconGlow = styled.div`
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: radial-gradient(circle, rgba(65, 180, 94, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: ${pulse} 3s infinite;
`

const EmptyMessage = styled.div`
  text-align: center;
 
  
  p {
    font-size: 1.1rem;
    font-family: 'ProximaNova-Italic', sans-serif;
    color: rgba(224, 224, 224, 0.7);
    line-height: 1.6;
  }
`

const InventoryInterface = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  border-radius: 20px;
  padding: 30px;
`

const InterfaceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(65, 180, 94, 0.2);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`

const InterfaceTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #41b45e;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(65, 180, 94, 0.3);
`

const InventoryControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(28, 29, 28, 0.7);
  border: 1px solid rgba(65, 180, 94, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  width: 250px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`

const SearchIcon = styled.div`
  display: flex;
  margin-right: 8px;
`

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: #e0e0e0;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9rem;
  width: 100%;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: rgba(224, 224, 224, 0.5);
  }
`

const FilterControls = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`

const FilterSelect = styled.select`
  background: rgba(28, 29, 28, 0.7);
  border: 1px solid rgba(65, 180, 94, 0.3);
  border-radius: 8px;
  color: #e0e0e0;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9rem;
  padding: 8px 12px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: rgba(65, 180, 94, 0.6);
  }
  
  option {
    background: #1a1c1b;
  }
  
  @media (max-width: 768px) {
    flex: 1;
  }
`

const InventoryGrid = styled.div<{ isCompactView: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: ${(props) => (props.isCompactView ? "4px" : "8px")};
  aspect-ratio: 1;
  margin-bottom: 30px;
  background: rgba(28, 29, 28, 0.7);
  border: 1px solid rgba(43, 44, 43, 0.479);
  border-radius: 12px;
  padding: ${(props) => (props.isCompactView ? "4px" : "8px")};
  box-sizing: border-box;
  
  @media (max-width: 1024px) {
    aspect-ratio: 1;
  }
`

const GridCell = styled.div<{ x: number; y: number; isOccupied: boolean }>`
  grid-column: ${(props) => props.x + 1};
  grid-row: ${(props) => props.y + 1};
  background: ${(props) => (props.isOccupied ? "transparent" : "rgba(65, 180, 94, 0.05)")};
  border: 1px dashed rgba(65, 180, 94, 0.15);
  border-radius: 6px;
  animation: ${gridPulse} 4s infinite ease-in-out;
  animation-delay: ${(props) => (props.x + props.y) * 0.1}s;
  box-sizing: border-box;
  min-height: 0;
  min-width: 0;
`

const rarityColors = {
  empty: "rgba(45, 48, 46, 0.3)",
  common: "rgba(71, 69, 69, 0.5)",
  uncommon: "rgba(30, 255, 0, 0.3)",
  rare: "rgba(0, 112, 255, 0.4)",
  epic: "rgba(163, 53, 238, 0.5)",
  legendary: "rgba(255, 128, 0, 0.6)",
}

const InventoryItem = styled.div<{
  x: number
  y: number
  width: number
  height: number
  rarity: string
  isSelected: boolean
  isHovered: boolean
  isDragged: boolean
  isCompactView: boolean
}>`
  position: absolute;
  left: calc(${(props) => props.x} * (100% / 6) + ${(props) => props.x} * ${(props) => (props.isCompactView ? 2 : 3)}px);
  top: calc(${(props) => props.y} * (100% / 6) + ${(props) => props.y} * ${(props) => (props.isCompactView ? 2 : 3)}px);
  width: calc(${(props) => props.width} * (100% / 6) + ${(props) => props.width - 1} * ${(props) => (props.isCompactView ? 4 : 8)}px);
  height: calc(${(props) => props.height} * (100% / 6) + ${(props) => props.height - 1} * ${(props) => (props.isCompactView ? 4 : 8)}px);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${(props) => (props.isDragged ? "scale(0.9)" : props.isHovered ? "scale(0.9)" : "scale(1)")};
  z-index: ${(props) => (props.isHovered || props.isDragged ? 10 : 1)};
  box-sizing: border-box;
  
  &:hover {
    animation: ${rarityGlow} 2s infinite;
    color: ${(props) => rarityColors[props.rarity as keyof typeof rarityColors]};
  }
`

const SlotBackground = styled.div<{ rarity: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 30% 30%, ${(props) => rarityColors[props.rarity as keyof typeof rarityColors]} 0%, transparent 70%),
    linear-gradient(135deg, rgba(15, 17, 16, 0.8) 0%, rgba(26, 28, 27, 0.6) 100%);
  border-radius: 12px;
  backdrop-filter: blur(10px);
`

const SlotBorder = styled.div<{ rarity: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s ease;
`

const ItemContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  z-index: 2;
`

const ItemHologram = styled.div`
  position: relative;
  width: 70%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`

const ItemImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(65, 180, 94, 0.3));
  transition: all 0.3s ease;
  z-index: 3;
`

const ItemGlow = styled.div<{ rarity: string }>`
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, ${(props) => rarityColors[props.rarity as keyof typeof rarityColors]} 0%, transparent 70%);
  border-radius: 50%;
  animation: ${pulse} 3s infinite;
  z-index: 1;
`

const ItemReflection = styled.div`
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  transform: scaleY(-1);
  opacity: 0.3;
  z-index: 2;
`

const ItemInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`

const ItemName = styled.div<{ rarity: string }>`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${(props) => (props.rarity === "empty" ? "#888" : "#e0e0e0")};
  text-align: center;
  text-shadow: 0 0 5px rgba(65, 180, 94, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`

const ItemQuantityBadge = styled.div<{ rarity: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${(props) => rarityColors[props.rarity as keyof typeof rarityColors]};
  border: 1px solid ${(props) => rarityColors[props.rarity as keyof typeof rarityColors]};
  border-radius: 12px;
  backdrop-filter: blur(10px);
  
  span {
    font-size: 0.75rem;
    font-weight: 700;
    color: #e0e0e0;
    text-shadow: 0 0 5px rgba(65, 180, 94, 0.5);
  }
`

const QuantityIcon = styled.div`
  display: flex;
  align-items: center;
  color: #41b45e;
`

const RarityIndicator = styled.div<{ rarity: string }>`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  background: ${(props) => rarityColors[props.rarity as keyof typeof rarityColors]};
  border-radius: 50%;
  box-shadow: 0 0 10px ${(props) => rarityColors[props.rarity as keyof typeof rarityColors]};
  animation: ${pulse} 2s infinite;
`

const SizeIndicator = styled.div<{ size: ItemSize }>`
  position: absolute;
  top: 5px;
  left: 5px;
  display: flex;
  
  &::before {
    content: '';
    display: block;
    width: ${(props) => (props.size === "small" ? "6px" : props.size === "medium" ? "6px" : props.size === "large" ? "12px" : "12px")};
    height: ${(props) => (props.size === "small" ? "6px" : props.size === "medium" ? "12px" : props.size === "large" ? "6px" : "12px")};
    background: rgba(65, 180, 94, 0.5);
    border-radius: 2px;
  }
`

const SlotEffects = styled.div<{ rarity: string; isHovered: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  pointer-events: none;
  
  ${(props) =>
    props.isHovered &&
    css`
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, ${rarityColors[props.rarity as keyof typeof rarityColors]}, transparent, ${rarityColors[props.rarity as keyof typeof rarityColors]});
      border-radius: 14px;
      z-index: -1;
      animation: ${energyFlow} 2s linear infinite;
    }
  `}
`

const InventoryStats = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`

const StatBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 16px;
  background: rgba(28, 29, 28, 0.7);
  border: 1px solid rgba(65, 180, 94, 0.2);
  border-radius: 12px;
  flex: 1;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: rgba(65, 180, 94, 0.1);
  border-radius: 50%;
  border: 1px solid rgba(65, 180, 94, 0.3);
`

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const ActionToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(28, 29, 28, 0.7);
  border: 1px solid rgba(65, 180, 94, 0.2);
  border-radius: 12px;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 8px;
  }
`

const ActionButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${(props) => (props.active ? "rgba(65, 180, 94, 0.2)" : "rgba(45, 48, 46, 0.5)")};
  border: 1px solid ${(props) => (props.active ? "rgba(65, 180, 94, 0.5)" : "rgba(65, 180, 94, 0.2)")};
  border-radius: 8px;
  color: ${(props) => (props.disabled ? "rgba(224, 224, 224, 0.3)" : "#e0e0e0")};
  font-family: 'ProximaNova-Italic', sans-serif;
  font-size: 0.8rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: rgba(65, 180, 94, 0.3);
    border-color: rgba(65, 180, 94, 0.6);
  }
  
  span {
    @media (max-width: 768px) {
      display: none;
    }
  }
`

const ItemTooltip = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  background: rgba(15, 17, 16, 0.95);
  border: 1px solid rgba(65, 180, 94, 0.3);
  border-radius: 8px;
  padding: 10px;
  min-width: 150px;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
  backdrop-filter: blur(10px);
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(65, 180, 94, 0.3);
  }
`

const TooltipTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #41b45e;
  margin-bottom: 5px;
`

const TooltipDetail = styled.div`
  font-size: 0.8rem;
  color: rgba(224, 224, 224, 0.8);
  margin-bottom: 2px;
`

const HelpPanel = styled.div`
  position: relative;
  background: rgba(28, 29, 28, 0.76);
 
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.3s ease;
  backdrop-filter: blur(20px);
`

const HelpTitle = styled.h3`
  font-size: 1.2rem;
  color: #41b45e;
  margin-bottom: 15px;
  text-align: center;
`

const HelpContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`

const HelpSection = styled.div``

const HelpSectionTitle = styled.h4`
  font-size: 1rem;
  color: #e0e0e0;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(65, 180, 94, 0.2);
  padding-bottom: 5px;
`

const HelpList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const HelpItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const HelpItemIcon = styled.div`
  font-size: 1.2rem;
 
  background-color: #252725;
  border-radius: 50%;
  display: flex;
  align-items: center;
  padding: 0.3em;
 
  text-align: center;

  svg{
    height: 18px;
    width: 18px;
    stroke: #828d85;
  }
`

const HelpItemText = styled.div`
  font-size: 12px;
  font-family: 'Inter', monospace;
  color: rgba(224, 224, 224, 0.8);
  line-height: 1.4;
`

const CloseHelpButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #e0e0e0;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(65, 180, 94, 0.2);
  }
`

const ItemDetailsPanel = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background: rgba(15, 17, 16, 0.98);
  border: 2px solid rgba(65, 180, 94, 0.5);
  border-radius: 16px;
  padding: 0;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
`

const DetailsPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(65, 180, 94, 0.2);
`

const DetailsPanelTitle = styled.h3`
  font-size: 1.3rem;
  color: #41b45e;
  margin: 0;
`

const CloseDetailsButton = styled.button`
  background: transparent;
  border: none;
  color: #e0e0e0;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(65, 180, 94, 0.2);
  }
`

const DetailsPanelContent = styled.div`
  padding: 20px;
  display: flex;
  gap: 20px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`

const ItemDetailImage = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
    background: rgba(28, 29, 28, 0.5);
  }
  
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
    align-self: center;
  }
`

const RarityBadge = styled.div<{ rarity: string }>`
  position: absolute;
  top: -5px;
  right: -5px;
  background: ${(props) => rarityColors[props.rarity as keyof typeof rarityColors]};
  color: #e0e0e0;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const ItemDetailInfo = styled.div`
  flex: 1;
`

const ItemDetailName = styled.h4`
  font-size: 1.2rem;
  color: #e0e0e0;
  margin: 0 0 10px 0;
`

const ItemDetailDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(224, 224, 224, 0.7);
  line-height: 1.5;
  margin-bottom: 15px;
`

const ItemDetailStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ItemDetailStat = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(65, 180, 94, 0.1);
`

const ItemDetailStatLabel = styled.span`
  font-size: 0.9rem;
  color: rgba(224, 224, 224, 0.7);
`

const ItemDetailStatValue = styled.span`
  font-size: 0.9rem;
  color: #41b45e;
  font-weight: 600;
`

const DetailsPanelActions = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(65, 180, 94, 0.2);
  display: flex;
  justify-content: center;
`

const DetailActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(65, 180, 94, 0.2);
  border: 1px solid rgba(65, 180, 94, 0.5);
  border-radius: 8px;
  color: #e0e0e0;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(65, 180, 94, 0.3);
    border-color: rgba(65, 180, 94, 0.7);
  }
`
