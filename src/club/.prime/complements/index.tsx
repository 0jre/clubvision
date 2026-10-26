"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import axios from "axios"

interface ComplementData {
  id: string
  name: string
  description: string
  isActive: boolean
  quantity?: number
  type: string
}

const ComplementsEnhanced = ({ userId }: { userId: string }) => {
  const [complements, setComplements] = useState<ComplementData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchComplements()
  }, [userId])

  const fetchComplements = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/club/complements/${userId}`)
      setComplements(response.data.complements)
    } catch (err) {
      setError("Erro ao carregar complementos")
      console.error("Erro ao buscar complementos:", err)
    } finally {
      setLoading(false)
    }
  }

  const getComplementIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      keymaster: "fi fi-sr-key",
      contractmiss: "fi fi-sr-document",
      visiondrop: "fi fi-sr-gift",
      contractcla: "fi fi-sr-users",
      keyplusinvite: "fi fi-sr-user-add",
      contractunix: "fi fi-sr-settings",
      contractax: "fi fi-sr-rocket",
      contractvision: "fi fi-sr-eye",
      limitinvite: "fi fi-sr-envelope",
      limitipost: "fi fi-sr-edit",
      maxlimitinvite: "fi fi-sr-users-alt",
    }
    return icons[type] || "fi fi-sr-box"
  }

  if (loading) {
    return (
      <CardSelect>
        <ul>
          <li>
            <h2>COMPLEMENTOS</h2>
            <p>Carregando seus complementos ativos...</p>
          </li>
        </ul>
      <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </CardSelect>
    )
  }

  if (error) {
    return (
      <CardSelect>
        <ul>
          <li>
            <h2>COMPLEMENTOS</h2>
            <p>Erro ao carregar complementos ativos em sua conta.</p>
          </li>
        </ul>
      </CardSelect>
    )
  }

  return (
    <CardSelect>
      <ul>
        <li>
          <h2>COMPLEMENTOS</h2>
          <p>Complementos e recursos especiais ativados em sua conta clubvision.</p>
        </li>
      </ul>

      <MarginCardsub>
        <i className="fi fi-sr-box" style={{ fontSize: "40px", color: "#41b45e" }} />
        <li>
          <h4>Complementos Ativos</h4>
          <p>
            {complements.length > 0
              ? `${complements.length} complemento${complements.length > 1 ? "s" : ""} ativo${complements.length > 1 ? "s" : ""}`
              : "Nenhum complemento ativo"}
          </p>
        </li>
      </MarginCardsub>

      <Content>
        <Container>
          <ul>
            <h3>RECURSOS ESPECIAIS</h3>
          </ul>
        </Container>

        {complements.length === 0 ? (
          <EmptyState>
            <i className="fi fi-sr-box-open" />
            <h4>Nenhum complemento ativo</h4>
            <p>Você ainda não possui complementos ativos. Visite a loja para adquirir recursos exclusivos.</p>
          </EmptyState>
        ) : (
          <ComplementsList>
            <li>
              {complements.map((complement, index) => (
                <span key={index}>
                  <i className={getComplementIcon(complement.type)} />
                  <text>
                    <h5>{complement.name}</h5>
                    <p>{complement.description}</p>
                    {complement.quantity && complement.quantity > 1 && <small>Quantidade: {complement.quantity}</small>}
                  </text>
                  <StatusBadge isActive={complement.isActive}>{complement.isActive ? "ATIVO" : "INATIVO"}</StatusBadge>
                </span>
              ))}
            </li>
          </ComplementsList>
        )}
      </Content>
    </CardSelect>
  )
}

export default ComplementsEnhanced

// Reutilizando os styled-components originais
const CardSelect = styled.div`
  background-color: rgba(38, 39, 39, 0.329);
  border-radius: 9px;
  margin: 0.4em;
  width: 100%;
  position: relative;
 
  ul{
    display: flex; 
    justify-content: space-between;  
    align-items: center;
    padding: 0.6em 1em 0.6em;
  
    h2{
      font-family: 'ProximaNova-';
      font-weight: 200;
      text-align: start;
      display: block;
      margin-bottom: 0.8em;
      margin-top: 9px;
      font-size: 0.74rem;
      line-height: 1.15rem;
      letter-spacing: 1.15em;
      background: linear-gradient(rgb(213, 213, 213) 0%, rgb(106, 106, 106) 100%) text;
      -webkit-text-fill-color: transparent;
    }

    p{
      font-size: 11px;
      max-width: 320px;
      color: #bcc0cc;
      font-family: 'Inter', monospace;
    }
  }
`

const MarginCardsub = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0.9em;
  background-color: #242525;
  border-radius: 14px;
  padding: 0.6em 1em 0.6em;
  
  p{
    font-size: 11px;
    font-family: 'ProximaNova-italic';
    color: #8b9096;
  }

  h4{
    color: #d2dcdd;
    font-family: 'XcSemibold', sans-serif;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  h3{
    font-weight: 500;
    margin: 0;
    font-size: 18px;
    color: #b3c0b8;
    font-family: 'XcSemibold', sans-serif;
    padding: 10px 0;
  }
`

const Content = styled.div`
  width: 98%;
  padding: 0.5em;
  animation: scales 0.3s linear;
  border-radius: 8px;
  margin: 0.4em;

  @keyframes scales {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }

  h4{
    font-weight: 500;
    color: #86868f;
    margin: 0;
    font-size: 13px;
    font-family: 'ProximaNova-Italic', sans-serif;
  }

  h6{
    font-family: 'ProximaNova-';
    font-size: 12px;
    font-weight: 200;
    text-align: start;
    color: rgb(190, 192, 196);
    max-width: 460px;
  }
`

// Reutilizando todos os styled-components do pricing-cards original
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 0;
`

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #2d302e;
  border-top: 3px solid #37ce7b;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2em;
  color: #8e9194;

  i{
    font-size: 48px;
    color: #666;
    margin-bottom: 1em;
  }

  h4{
    color: #d2dcdd;
    font-family: 'XcSemibold', sans-serif;
    margin-bottom: 0.5em;
  }

  p{
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    max-width: 300px;
    margin: 0 auto;
  }
`

const ComplementsList = styled.div`
  li{
    display: flex;
    flex-direction: column;
  }

  span{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.5em 0;
    padding: 0.8em;
    background-color: rgba(45, 48, 46, 0.3);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover{
      background-color: rgba(45, 48, 46, 0.5);
      transform: translateX(4px);
    }
  }

  i{
    font-size: 24px;
    background: linear-gradient(47deg, #e71236 0%, #98a79c 1%, #1cdb82 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    margin-right: 1em;
    min-width: 40px;
  }

  text{
    flex: 1;
  }

  h5{
    color: #d7dee4;
    text-align: left;
    font-family: 'Inter', sans-serif;
    margin: 0;
  }

  p{
    color: #aaaeb3;
    font-size: 12px;
    margin: 0.2em 0 0 0;
    font-family: 'ProximaNova-Italic', sans-serif;
  }

  small{
    color: #41b45e;
    font-size: 11px;
    font-family: 'Inter', sans-serif;
  }
`

const StatusBadge = styled.div<{ isActive: boolean }>`
  padding: 0.3em 0.8em;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  font-family: 'XcSemibold', sans-serif;
  background-color: ${(props) => (props.isActive ? "#2cdd8a" : "#666")};
  color: ${(props) => (props.isActive ? "#000" : "#fff")};
  margin-left: 1em;
`
