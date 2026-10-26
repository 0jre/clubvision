 
 
"use client"

import styled from "styled-components"


export const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
 
`

export const HeaderBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;

  span {
    color: #9ca3af;
  }
`

// Layout Components
export const Container = styled.div`
  display: flex;
  height: 100vh;
  position: relative;
  overflow: hidden;
 
`

export const MainContent = styled.main<{ $sidebarCollapsed: boolean; $isMobile: boolean }>`
  margin-left: ${(props) => {
    if (props.$isMobile) return "0"
    return props.$sidebarCollapsed ? "60px" : "280px"
  }};
  min-height: 100vh;
  background-color: #ffffff;
  transition: margin-left 0.2s ease;
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #ffffff;
`

// Sidebar Components
export const SidebarContainer = styled.aside<{ $isCollapsed: boolean; $isMobile: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${(props) => (props.$isCollapsed && !props.$isMobile ? "60px" : "280px")};
  background-color: #ffffff;

  display: flex;
  flex-direction: column;
  z-index: 50;
  transition: width 0.2s ease;
  transform: ${(props) => (props.$isMobile && props.$isCollapsed ? "translateX(-100%)" : "translateX(0)")};

  @media (max-width: 768px) {
    width: 280px;
 
  }
`

export const SidebarHeader = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  border-bottom: 1px solid #f3f4f6;
  background-color: #ffffff;
  min-height: 80px;

  ${(props) =>
    props.$isCollapsed &&
    `
    justify-content: center;
    padding: 24px 12px;
  `}
`

export const LogoContainer = styled.div`
  width: 32px;
  height: 32px;
  background-color: #000000;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const LogoText = styled.div<{ $isCollapsed: boolean }>`
  display: ${(props) => (props.$isCollapsed ? "none" : "block")};

  .title {
    font-weight: 600;
    font-size: 14px;
    color: #000000;
    margin: 0;
  }

  .subtitle {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
  }
`

export const SidebarNav = styled.nav`
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`

export const SidebarCategory = styled.div`
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const SidebarCategoryHeader = styled.div<{ $isCollapsed: boolean }>`
  padding: 8px 20px 12px 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b7280;
  display: ${(props) => (props.$isCollapsed ? "none" : "flex")};
  align-items: center;
  gap: 8px;
`

export const SidebarMenuItem = styled.div<{ $active?: boolean; $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  margin: 0 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  color: ${(props) => (props.$active ? "#f1f6f7" : "#4b5563")};
  background-color: ${(props) => (props.$active ? "#0a0a0a" : "transparent")};
  position: relative;
 
  ${(props) =>
    props.$isCollapsed &&
    `
    justify-content: center;
    padding: 10px 12px;
    margin: 4px 8px;
  `}

  &:hover {
    background-color: ${(props) => (props.$active ? "#060707e1" : "#c9cfcd")};
    color: #000000;
  }

  svg {
    flex-shrink: 0;
    opacity: ${(props) => (props.$active ? "1" : "0.7")};
  }
 

   h4{
     font-family: 'Inter', monospace;
      color: ${(props) => (props.$active ? "#f1ecec" : "black")};
   }
  .menu-text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: ${(props) => (props.$isCollapsed ? "none" : "block")};
  }
`

export const SidebarDivider = styled.div<{ $isCollapsed: boolean }>`
  height: 1px;
  background-color: #f3f4f6;
  margin: 16px ${(props) => (props.$isCollapsed ? "8px" : "20px")};
`

// Header Components
export const HeaderContainer = styled.header`
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const HeaderTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;

  .separator {
    color: #9ca3af;
  }
`

// Button Components
export const Button = styled.button<{ $variant?: "primary" | "secondary" | "ghost" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 40px;
  height: 40px;

  ${(props) => {
    switch (props.$variant) {
      case "primary":
        return `
          background-color: #000000;
          color: #ffffff;
          &:hover {
            background-color: #1f2937;
          }
        `
      case "secondary":
        return `
          background-color: #f3f4f6;
          color: #374151;
          &:hover {
            background-color: #e5e7eb;
          }
        `
      case "ghost":
      default:
        return `
          background-color: transparent;
          color: #6b7280;
          &:hover {
            background-color: #f9fafb;
            color: #374151;
          }
        `
    }
  }}
`

export const ToggleButton = styled(Button)`
  @media (min-width: 769px) {
    display: none;
  }
`

// Card Components
export const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;

`

export const CardHeader = styled.div`
  margin-bottom: 16px;
`

export const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 4px 0;
`

export const CardDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`

export const Overlay = styled.div<{ $show: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  display: ${(props) => (props.$show ? "block" : "none")};

  @media (min-width: 769px) {
    display: none;
  }
`
