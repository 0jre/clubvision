import type React from "react"
import styled from "styled-components"

interface BadgeProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "success" | "error"
  icon?: React.ReactNode
  style?: React.CSSProperties
}

const Badge: React.FC<BadgeProps> = ({ children, variant = "primary", icon, style }) => {
  return (
    <BadgeContainer variant={variant} style={style}>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {children}
    </BadgeContainer>
  )
}

const BadgeContainer = styled.span<{ variant: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 26px;
  font-size: 0.55rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  
  ${(props) => {
    switch (props.variant) {
      case "success":
        return `
          background: rgba(65, 180, 94, 0.2);
          color: #41b45e;
           
        `
      case "error":
        return `
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
      
        `
      case "secondary":
        return `
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
        `
      default:
        return `
          background: rgba(65, 180, 94, 0.2);
          color: #41b45e;
          border: 1px solid rgba(65, 180, 94, 0.3);
        `
    }
  }}
`

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
`

export default Badge
