"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { SidebarProvider, useSidebar } from "./sidebar-context"
import styled from "styled-components"
import { AnimatePresence } from "framer-motion"

interface AdminLayoutProps {
  children: ReactNode
  activeSection: string
  onSectionChange: (section: string) => void
}

const Container = styled.div`
  display: flex;
    height: 100vh;
    padding: 1em;
     

    @media screen and (max-width: 768px) {
       margin: 0;
       height: 100vh;
    }
  
 
`

const MainContent = styled.main<{ $sidebarCollapsed: boolean; $isMobile: boolean }>`
  flex: 1;
  margin-left: ${(props) => (props.$isMobile ? "0" : props.$sidebarCollapsed ? "80px" : "280px")};
  display: flex;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
  flex-direction: column;
  background: #ffffff; 
  transition: margin-left 0.3s ease;

     @media screen and (max-width: 768px) {
       border-radius: 0;
    }
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1em;
`

const Overlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 15;
  display: ${(props) => (props.$show ? "block" : "none")};
`

function AdminLayoutContent({ children, activeSection, onSectionChange }: AdminLayoutProps) {
  const { isCollapsed, isMobile } = useSidebar()

  return (
    <Container>
      <Sidebar activeSection={activeSection} onSectionChange={onSectionChange} />
      <Overlay $show={isMobile && !isCollapsed} />
      <MainContent $sidebarCollapsed={isCollapsed} $isMobile={isMobile}>
        <Header activeSection={activeSection} />
        <Content>{children}</Content>
      </MainContent>
    </Container>
  )
}

export function AdminLayout({ children, activeSection, onSectionChange }: AdminLayoutProps) {
  return (
    <AnimatePresence mode="wait">
      <ContainerDash>
        <SidebarProvider>
          <AdminLayoutContent activeSection={activeSection} onSectionChange={onSectionChange}>
            {children}
          </AdminLayoutContent>
        </SidebarProvider>
      </ContainerDash>
    </AnimatePresence>
  )
}

const ContainerDash = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`
