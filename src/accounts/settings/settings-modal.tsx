"use client"

import { useState } from "react"
import styled from "styled-components"
import { X, ChevronRight, Search } from 'lucide-react'
import { useRouter } from "next/navigation"

interface SettingsModalProps {
  title: string
  description?: string
  onClose: () => void
  children: React.ReactNode
}

export function SettingsModal({ title, description, onClose, children }: SettingsModalProps) {
  return (
    <ModalOverlay>
      <ModalContainer>
 
 
        {description && <ModalDescription>{description}</ModalDescription>}
        
        <ModalContent>
          {children}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  )
}

interface SettingsSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <Section>
      {title && <SectionTitle>{title}</SectionTitle>}
      {description && <SectionDescription>{description}</SectionDescription>}
      {children}
    </Section>
  )
}

interface SettingsItemProps {
  label: string
  description?: string
  children?: React.ReactNode
}

export function SettingsItem({ label, description, children }: SettingsItemProps) {
  return (
    <ItemContainer>
      <ItemContent>
        <ItemLabel>{label}</ItemLabel>
        {description && <ItemDescription>{description}</ItemDescription>}
      </ItemContent>
      <ItemControl>{children}</ItemControl>
    </ItemContainer>
  )
}

interface SettingsSearchProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export function SettingsSearch({ placeholder = "Search", value, onChange }: SettingsSearchProps) {
  return (
    <SearchContainer>
      <SearchIconWrapper>
        <Search size={16} />
      </SearchIconWrapper>
      <SearchInput 
        type="text" 
        placeholder={placeholder} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </SearchContainer>
  )
}

interface SettingsButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: "primary" | "secondary"
}

export function SettingsButton({ children, onClick, variant = "primary" }: SettingsButtonProps) {
  return (
    <Button variant={variant} onClick={onClick}>
      {children}
    </Button>
  )
}

interface SettingsNavigationItemProps {
  label: string
  onClick: () => void
}

export function SettingsNavigationItem({ label, onClick }: SettingsNavigationItemProps) {
  return (
    <NavigationItem onClick={onClick}>
      <NavigationLabel>{label}</NavigationLabel>
      <ChevronRight size={16} />
    </NavigationItem>
  )
}

interface SettingsSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  id: string
}

export function SettingsSwitch({ checked, onChange, id }: SettingsSwitchProps) {
  return (
    <SwitchContainer>
      <SwitchInput 
        type="checkbox" 
        id={id} 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)} 
      />
      <SwitchSlider />
    </SwitchContainer>
  )
}

// Styled Components
const ModalOverlay = styled.div`

 
`

const ModalContainer = styled.div`
  width:100%;
   position: relative;
  margin: 0 auto;
  
 animation: Opacity 1s linear;
  overflow: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #ffffff;
  animation: Opacity 0.8s linear;
  font-family: 'InterSemiBold', sans-serif;

  
  @keyframes Opacity {
    0% {opacity: 0}
    100% {opacity:1 }
  }

  @media screen and (max-width: 680px) {
    max-width: 680px;
    width: 100%;
    border-radius: 0;
    max-height: 100vh;
    height: 100vh;
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #2c2e30;
`

 

const ModalDescription = styled.p`
  font-size: 15px;
  color: #65676b;
  margin: 0;
  padding: 12px 24px 0;
`

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px 24px;

  @media screen and (max-width: 680px) {  
    padding: 5px 12px 24px;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #65676b;
  transition: background-color 0.2s;

  &:hover {
    background-color: #242524;
  }
`

const Section = styled.div`
  margin-bottom: 24px;
`

const SectionTitle = styled.h2`
  font-size: 17px;
  font-weight: 600;
  color: #505352;
  margin: 0 0 8px 0;
`

const SectionDescription = styled.p`
  font-size: 15px;
  color: #65676b;
  margin: 0 0 16px 0;
  line-height: 1.4;
`

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 1em ;
  margin-bottom: 0.3em;
  border-radius: 12px;
  border-bottom: 1px solid #19191a;
  background-color: #212221;

  &:last-child {
    border-bottom: none;
  }
`

const ItemContent = styled.div`
  flex: 1;
  padding-right: 16px;
`

const ItemLabel = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #b3bdb8;
  margin-bottom: 4px;
`

const ItemDescription = styled.div`
  font-size: 12px;
  color: #65676b;
  font-family: 'ProximaNova-Italic';
  line-height: 1.4;
`

const ItemControl = styled.div`
  display: flex;
  align-items: center;
`

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #65676b;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #dadde1;
  border-radius: 6px;
  font-size: 15px;
  color: #dadde1;
  background: #f0f2f5;
  outline: none;

  &:focus {
    background: white;
    border-color: #31573d;
    box-shadow: 0 0 0 2px rgba(24, 242, 89, 0.2);
  }

  &::placeholder {
    color: #65676b;
  }
`

const Button = styled.button<{ variant: "primary" | "secondary" }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  transition: background-color 0.2s;
  width: 100%;
  text-align: center;

  ${({ variant }) =>
    variant === "primary"
      ? `
    background-color: #31573d;
    color: white;
    border: none;

    &:hover {
      background-color: #33493a;
    }
  `
      : `
    background-color: #e4e6eb;
    color: #dadde1;
    border: none;

    &:hover {
      background-color: #d8dadf;
    }
  `}
`

const NavigationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  transition: background-color 0.2s;
  color: #f0eeee;

  &:hover {
    background-color: #f2f2f2;
  }
`

const NavigationLabel = styled.div`
  font-size: 15px;
  font-weight: 500;
`

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
  flex-shrink: 0;
`

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #31573d;
  }

  &:checked + span:before {
    transform: translateX(16px);
  }
`

const SwitchSlider = styled.span`
  position: absolute;
  cursor: var(--f-cursor-pointer);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2c2d2e;
  transition: 0.2s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: #949997;
    transition: 0.2s;
    border-radius: 50%;
  }
`
