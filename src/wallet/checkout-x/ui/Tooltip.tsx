"use client"

import type React from "react"
import { useState } from "react"
import styled from "styled-components"

interface TooltipProps {
  children: React.ReactNode
  content: string
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <TooltipContainer onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <TooltipContent>
          {content}
          <TooltipArrow />
        </TooltipContent>
      )}
    </TooltipContainer>
  )
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`

const TooltipContent = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: 0.75rem;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 1000;
  backdrop-filter: blur(10px);
`

const TooltipArrow = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.9);
`

export default Tooltip
