"use client"

import { useState, useEffect } from "react"
import { BarChart3, Search, Grid3X3, List, Maximize2, Minimize2, Command, Zap, Activity } from "lucide-react"
import styled, { keyframes } from "styled-components"
import AdminDashboard from "./admin-dashboard"
import { UserSearch } from "./user-search"

// Animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

// Styled Components
 
const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, #f8f9fa 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, #f8f9fa 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: 0 0, 25px 25px;
  opacity: 0.3;
  z-index: 0;
`

const MainContent = styled.div`
  position: relative;
 

`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 20px 32px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  animation: ${slideIn} 0.6s ease-out;
`

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const Logo = styled.div`
  width: 48px;
  height: 48px;
  background: #000000;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    background: #ffffff;
    border-radius: 2px;
    transform: rotate(45deg);
  }
`

const BrandInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const BrandTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  letter-spacing: -0.02em;
`

const BrandSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
`

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
`

const StatusText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`

const NavigationContainer = styled.div`
 
  overflow: hidden;
 
  animation: ${slideIn} 0.6s ease-out 0.1s both;
`

const TabsHeader = styled.div`
  display: flex;
  border-radius: 12px;
 
  position: relative;
`

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 32px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  color: ${(props) => (props.$active ? "#000000" : "#6b7280")};
  
  &:hover {
    color: #000000;
    background: ${(props) => (props.$active ? "transparent" : "#f3f4f6")};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #000000;
    transform: scaleX(${(props) => (props.$active ? 1 : 0)});
    transition: transform 0.3s ease;
  }
`

const TabIcon = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.$active ? "scale(1.1)" : "scale(1)")};
`

const ViewControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  padding: 16px 24px;
`

const ViewButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${(props) => (props.$active ? "#000000" : "#ffffff")};
  color: ${(props) => (props.$active ? "#ffffff" : "#6b7280")};
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(props) => (props.$active ? "#000000" : "#f9fafb")};
    color: ${(props) => (props.$active ? "#ffffff" : "#000000")};
    border-color: #000000;
  }
`

const ContentArea = styled.div<{ $fullscreen: boolean }>`
  background: #ffffff;
  transition: all 0.3s ease;
  animation: ${slideIn} 0.6s ease-out 0.2s both;
  
  ${(props) =>
    props.$fullscreen &&
    `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    border-radius: 0;
  `}
`

const QuickActions = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
`

const QuickActionButton = styled.button`
  width: 56px;
  height: 56px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: scale(0.95);
  }
`

const KeyboardShortcut = styled.div`
  position: absolute;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${TabButton}:hover & {
    opacity: 1;
  }
`

const ShortcutKey = styled.kbd`
  padding: 2px 6px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-family: monospace;
  font-size: 11px;
`

export function AdminMainDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFullscreen, setIsFullscreen] = useState(false)

  const tabs = [
    {
      id: "dashboard",
      label: "Eixo de análise  ",
      icon: BarChart3,
      component: AdminDashboard,
      shortcut: "⌘1",
    },
    {
      id: "search",
      label: "Procurar usuário",
      icon: Search,
      component: UserSearch,
      shortcut: "⌘2",
    },
  ]

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "1":
            e.preventDefault()
            setActiveTab("dashboard")
            break
          case "2":
            e.preventDefault()
            setActiveTab("search")
            break
          case "f":
            e.preventDefault()
            setIsFullscreen(!isFullscreen)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen])

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || AdminDashboard

  return (
    <>
 
      <MainContent>
        

        <NavigationContainer>
          <TabsHeader>
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <TabButton key={tab.id} $active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                  <TabIcon $active={activeTab === tab.id}>
                    <IconComponent size={20} />
                  </TabIcon>
                  {tab.label}
                  <KeyboardShortcut>
                    <ShortcutKey>{tab.shortcut}</ShortcutKey>
                  </KeyboardShortcut>
                </TabButton>
              )
            })}

         
          </TabsHeader>

          <ContentArea $fullscreen={isFullscreen}>
            <ActiveComponent viewMode={viewMode} />
          </ContentArea>
        </NavigationContainer>
      </MainContent>

    
    </>
  )
}
