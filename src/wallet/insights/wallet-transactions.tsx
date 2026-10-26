"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { ArrowUpRight, ArrowDownRight, Search, Filter, ChevronRight, ArrowUpDown } from "lucide-react"
import Scrollmargin from "@/components/scrollingcard/scroll.xc"
import classNames from 'classnames';
import { getActionDescription } from "@/components/vision/ui/charts"
import LoadingPageView from "@/resources/loading/market.loading"

// Interfaces
interface Transaction {
  date: string
  time: string
  amount: number
  action: string
  currency: string
  resultStatus?: string
  result?: string
  newAmount?: number
  uniqueId?: string
}

 

// Helper function to format transaction title
const formatTransactionTitle = (action: string): string => {
  // Replace underscores with spaces and capitalize each word
  return action.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

// Helper function to determine if a transaction is positive
const isPositiveTransaction = (tx: Transaction): boolean => {
  switch (tx.action) {
    case "convert_from_banking":
    case "receivetransfer":
    case "receive_orbs":
    case "funds":
      return true
    case "convert_to_banking":
    case "senttransfer":
    case "post_creation":
    case "staking_orbs":
      return false
    case "double_orbit":
      return tx.resultStatus === "Ganhou"
    default:
      if (tx.action.startsWith("purchase_")) {
        return false
      }
      return true
  }
}

export default function WalletTransactionsDisplay({ userId }: { userId: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/activity/wallet/insights/wallet-transactions?userId=${userId}`)

        if (!response.ok) {
          throw new Error("Falha ao buscar transações")
        }

        const result = await response.json()

        // Sort transactions by date (most recent first)
        const sortedTransactions = result.transactions.sort((a: Transaction, b: Transaction) => {
          const dateA = new Date(`${a.date} ${a.time}`)
          const dateB = new Date(`${b.date} ${b.time}`)
          return dateB.getTime() - dateA.getTime()
        })

        setTransactions(sortedTransactions)
        setFilteredTransactions(sortedTransactions)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
        console.error("Erro ao buscar transações:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  // Filter transactions when search term or active filter changes
  useEffect(() => {
    let filtered = [...transactions]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          formatTransactionTitle(tx.action).toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (activeFilter) {
      switch (activeFilter) {
        case "income":
          filtered = filtered.filter((tx) => isPositiveTransaction(tx))
          break
        case "expense":
          filtered = filtered.filter((tx) => !isPositiveTransaction(tx))
          break
        case "transfers":
          filtered = filtered.filter(
            (tx) =>
              tx.action === "receivetransfer" ||
              tx.action === "senttransfer" ||
              tx.action === "convert_from_banking" ||
              tx.action === "convert_to_banking",
          )
          break
        case "games":
          filtered = filtered.filter((tx) => tx.action === "double_orbit" || tx.action.includes("game"))
          break
        default:
          // If filter is a specific action
          filtered = filtered.filter((tx) => tx.action === activeFilter)
      }
    }

    setFilteredTransactions(filtered)
  }, [searchTerm, activeFilter, transactions])

  // Get unique transaction types for filters
  const transactionTypes = [...new Set(transactions.map((tx) => tx.action))]

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingPageView />
        </LoadingContainer>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <p>Erro ao carregar transações</p>
          {error && <p>{error}</p>}
        </ErrorContainer>
      </Container>
    )
  }

  return (
    <Container>
      <SearchContainer>
        <SearchInput>
          <Search size={16} />
          <Input
            type="text"
            placeholder="Buscar transações"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        
      </SearchContainer>

      <FiltersContainer>
       
        <Scrollmargin>
            <FilterChip active={activeFilter === null} onClick={() => setActiveFilter(null)}>
          Todas
        </FilterChip>
        <FilterChip active={activeFilter === "income"} onClick={() => setActiveFilter("income")}>
          <ArrowUpRight size={14} />
          Entradas
        </FilterChip>
        <FilterChip active={activeFilter === "expense"} onClick={() => setActiveFilter("expense")}>
          <ArrowDownRight size={14} />
          Saídas
        </FilterChip>
        <FilterChip active={activeFilter === "transfers"} onClick={() => setActiveFilter("transfers")}>
          <ArrowUpDown size={14} />
          Transferências
        </FilterChip>
        {transactionTypes.slice(0, 3).map((type) => (
          <FilterChip key={type} active={activeFilter === type} onClick={() => setActiveFilter(type)}>
            {formatTransactionTitle(type)}
          </FilterChip>
        ))}
        </Scrollmargin>
      </FiltersContainer>

      <TransactionsList>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx, index) => {
            const isPositive = isPositiveTransaction(tx)
            const date = new Date(`${tx.date} ${tx.time}`)

            return (
              <TransactionItem key={index}>
                <TransactionIcon positive={isPositive}>
                  {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </TransactionIcon>
                <TransactionDetails>
                  <TransactionTitle>{getActionDescription(tx.action)}</TransactionTitle>
                  <TransactionDate>
                    {date.toLocaleDateString("pt-BR")} •{" "} 
                    {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </TransactionDate>
                </TransactionDetails>
                <TransactionAmount positive={isPositive}>
                  {isPositive ? "+" : "-"} {Math.abs(tx.amount).toFixed(2)}
                </TransactionAmount>
               
              </TransactionItem>
            )
          })
        ) : (
          <EmptyState>
            <p>Nenhuma transação encontrada</p>
          </EmptyState>
        )}
      </TransactionsList>
    </Container>
  )
}
 
const Container = styled.div`
  margin-bottom: 2rem;
`

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  gap: 0.5rem;
`

const SearchInput = styled.div<{ theme: any }>`
  flex: 1;
  position: relative;
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${(props) => props.theme.textSecondary};
  }
`

const Input = styled.input<{ theme: any }>`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border-radius: 0.75rem;
  border: 1px solid ${(props) => props.theme.border};
   background-color: rgb(32, 34, 33);
  color: ${(props) => props.theme.textPrimary};
  font-size: 0.875rem;
  border: none;
  font-family: 'InterSemiBold', monospace;
  color: white;
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
  }
  
  &::placeholder {
    color: ${(props) => props.theme.textSecondary};
  }
`
 

const FiltersContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
`

const FilterChip = styled.button<{ theme: any, active: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  border: 1px solid #272928;
   background-color: rgb(32, 34, 33);
  color: ${(props) => (props.active ? props.theme.primary : props.theme.textPrimary)};
  font-size: 0.75rem;
  white-space: nowrap;
  cursor: var(--f-cursor-pointer);
  
  svg {
    margin-right: 0.25rem;
  }
  
  &:hover {
    background-color: ${(props) => (props.active ? `rgba(65, 67, 71, 0.15)` : props.theme.hoverBackground)};
  }
`

const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const TransactionItem = styled.div<{ theme: any }>`
 background: linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  align-items: center;
 
  
  &:hover {
    background-color: ${(props) => props.theme.hoverBackground};
  }
`

const TransactionIcon = styled.div<{ positive: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  background-color: rgb(32, 34, 33);
  
  svg {
    color: ${(props) => (props.positive ? "#4ADE80" : "#F87171")};
  }
`

const TransactionDetails = styled.div`
  flex: 1;
`

const TransactionTitle = styled.p<{ theme: any }>`
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0 0 0.25rem;
  color: ${(props) => props.theme.textPrimary};
`

const TransactionDate = styled.p<{ theme: any }>`
  font-size: 0.75rem;
  color: ${(props) => props.theme.textSecondary};
  margin: 0;
`

const TransactionAmount = styled.p<{ positive: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  color: ${(props) => (props.positive ? "#4ADE80" : "#F87171")};
  display: flex;
  align-items: center;
`
 

const EmptyState = styled.div<{ theme: any }>`
  text-align: center;
  padding: 2rem;
  color: ${(props) => props.theme.textSecondary};
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`

const LoadingSpinner = styled.div<{ theme: any }>`
  border: 3px solid ${(props) => props.theme.border};
  border-top: 3px solid ${(props) => props.theme.primary};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #F87171;
`