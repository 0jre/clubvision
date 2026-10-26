"use client"

import type React from "react"

import { useState } from "react"
import { X, Edit, Check, Wallet, User, Settings, ChevronRight, Home } from "lucide-react"
import styled from "styled-components"
import router from 'next/router';
import ROUTENVX from "@/routes/routes"

interface AdminProfileModalProps {
  isOpen: boolean
  onClose: () => void
  adminData: any;
}

 
export function AdminProfileModal({ isOpen, onClose, adminData }: AdminProfileModalProps) {
  const [activeTab, setActiveTab] = useState("profile")

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <ModalHeader>
          <ModalTitle>Minhas informações</ModalTitle>
          <EditButton onClick={() => router.push(ROUTENVX.DashboardProfile)}>
            <Edit size={14} />
           Editar perfil
          </EditButton>
        </ModalHeader>

        <ModalContent>
          <InfoSection>
            <InfoItem>
              <InfoLabel>Endereço VisionId</InfoLabel>
              <InfoValue>{adminData.name}{adminData.subdominio}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>E-mail</InfoLabel>
              <InfoValue>
                {adminData.email}
                <VerifiedBadge>
                  <Check size={10} />
                </VerifiedBadge>
              </InfoValue>
            </InfoItem>
          </InfoSection>

          <InfoSection>
            <SectionTitle>Social accounts</SectionTitle>
         
              <SocialAccountItem >
                <SocialAvatar src={adminData.avatar} alt={adminData.username} />
                <SocialInfo>
                  <SocialName>{adminData.username}</SocialName>
                  <SocialPlatform>novision</SocialPlatform>
                </SocialInfo>
                <ChevronRight size={16} color="#9ca3af" />
              </SocialAccountItem>
          
          </InfoSection>
        </ModalContent>

        {/* <BottomNavigation>
        
          <NavItem $active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
            <User size={20} />
            <NavLabel>Profile</NavLabel>
          </NavItem>
          <NavItem onClick={() => router.push(ROUTENVX.Dashboard)}>
            <Home size={20} />
            <NavLabel>Clubvision</NavLabel>
          </NavItem>
        </BottomNavigation> */}
      </ModalContainer>
    </ModalOverlay>
  )
}


const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 350px;
  font-family: 'ProximaNova-Italic', sans-serif;
  max-height: 90vh;
  min-height: 60vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalSlideIn 0.3s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`

const ModalHeader = styled.div`
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  font-family: 'InterSemiBold', monospace;
  margin: 0;
`

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 61px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    color: #374151;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;

  &:hover {
    color: #6b7280;
  }
`

const ModalContent = styled.div`
  padding: 12px 24px 24px 24px;
  overflow-y: auto;
    min-height: 50vh;

`

const InfoSection = styled.div`
  margin-bottom: 32px;
  background-color: #bec5c129;
  border-radius: 12px;
  padding: 0.9em;
`

const InfoItem = styled.div`
  margin-bottom: 20px;
`

const InfoLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: 'Inter', monospace;
  margin-bottom: 4px;
`

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  display: flex;
  align-items: center;
  gap: 8px;
`

const VerifiedBadge = styled.div`
  width: 16px;
  height: 16px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 16px;
`

const SocialAccountItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
`

const SocialAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
`

const SocialInfo = styled.div`
  flex: 1;
`

const SocialName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #000000;
`

const SocialPlatform = styled.div`
  font-size: 12px;
  color: #6b7280;
`

const BottomNavigation = styled.div`
  display: flex;
  border-top: 1px solid #f3f4f6;
  background: #fafafa;
`

const NavItem = styled.button<{ $active?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 12px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  color: ${(props) => (props.$active ? "#000000" : "#6b7280")};

  &:hover {
    background: #f3f4f6;
  }
`

const NavLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
`
