import type React from "react"
import styled from "styled-components"
import { Calendar, Eye } from 'lucide-react'

interface CardInfoProps {
  date: React.ReactNode
  id: React.ReactNode
  username: React.ReactNode
  authorized: React.ReactNode
  prime: React.ReactNode
  View: React.ReactNode
}

export default function UserTaf({ date, id, username, authorized, prime, View }: CardInfoProps) {
  return (
    <TableRow>
      <DateCell>
        <Calendar size={16} />
        {date}
      </DateCell>
      <IdCell>{id}</IdCell>
      <UsernameCell>{username}</UsernameCell>
      <StatusCell>{authorized}</StatusCell>
      <PrimeCell>{prime}</PrimeCell>
      <ActionCell>{View}</ActionCell>
    </TableRow>
  )
}

// Styled Components matching the exact design
const TableRow = styled.div`
  display: grid;
  grid-template-columns: 230px 280px 1fr 120px 120px 60px;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
  background-color: #ffffff;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
`

const DateCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`

const IdCell = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  word-break: break-all;
`

const UsernameCell = styled.div`
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`

const StatusCell = styled.div`
  display: flex;
  justify-content: flex-start;
  
  /* Style the status badges */
  span {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
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
  }
`

const PrimeCell = styled.div`
  display: flex;
  justify-content: flex-start;
  
  /* Style the prime badges */
  span {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    /* STANDARD status */
    &[data-prime="standard"] {
      background-color: #f3f4f6;
      color: #6b7280;
    }
    
    /* PRIME status */
    &[data-prime="prime"] {
      background-color: #fef3c7;
      color: #92400e;
    }
  }
`

const ActionCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
