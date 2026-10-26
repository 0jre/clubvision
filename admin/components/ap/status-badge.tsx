import type React from "react"
import styled from "styled-components"

interface StatusBadgeProps {
  status: "pending" | "authorized"
  children: React.ReactNode
}

interface PrimeBadgeProps {
  prime: "standard" | "prime"
  children: React.ReactNode
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return <Badge data-status={status}>{children}</Badge>
}

export function PrimeBadge({ prime, children }: PrimeBadgeProps) {
  return <Badge data-prime={prime}>{children}</Badge>
}

const Badge = styled.span`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  
  /* PENDING status */
  &[data-status="pending"] {
    background-color: #dbeafe;
    color: #1e40af;
  }
  
  /* AUTHORIZED status */
  &[data-status="authorized"] {
    background-color: #dcfce7;
    color: #166534;
  }
  
  /* STANDARD prime */
  &[data-prime="standard"] {
    background-color: #f3f4f6;
    color: #6b7280;
  }
  
  /* PRIME status */
  &[data-prime="prime"] {
    background-color: #fef3c7;
    color: #92400e;
  }
`
