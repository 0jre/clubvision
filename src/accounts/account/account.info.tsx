"use client"
import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { useRouter } from "next/navigation"
import { User, Shield, Settings, MessageSquare, Lock, Ticket, ArrowLeft, RefreshCw, X } from "lucide-react"
import ROUTENVX from "@/routes/routes"
import Image from "next/image"

interface Incv {
  type: string
  info: any
}

export function AccountDashboard({ type, info }: Incv) {
  const [activeTab] = useState(type)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <Container>
            <Overlay>
              <Modal>
                <Header>
                 
                  <Title>Informações da conta</Title>
                 
                </Header>

                <Content>
                  <ProfileSection>
                    <Avatar>
                      <AvatarIcon>
                       <Image src={info.avatar} alt={info.username} height={80} width={80}/>
                      </AvatarIcon>
                      <StatusIndicator verified={info?.unic} />
                    </Avatar>
                    <ProfileInfo>
                      <Name>
                        {info?.prime
                          ? info.typeprime === "Bloom"
                            ? "Premium Bloom"
                            : "Premium Plus"
                          : "Usuário padrão"}
                      </Name>
                      <Vid>{info.userId}</Vid>
                      <Status verified={info?.unic}>{info?.unic ? "Verificada" : "Não verificado"}</Status>
                    </ProfileInfo>
                  </ProfileSection>

                  <Separator />

                  <Section>
                    <SectionTitle>Detalhes da conta</SectionTitle>
                    <Grid>
                    
                      <Field>
                        <Label>Endereço de email</Label>
                        <Value>{info.email}</Value>
                      </Field>
                      <Field>
                        <Label>Status do jogador</Label>
                        <Badge status={info.type === "Authorized" ? "active" : "inactive"}>
                          {info.type === "Authorized" ? "Autorizada" : "Não autorizado"}
                        </Badge>
                      </Field>
                      <Field>
                        <Label>Subscription</Label>
                        <Badge status={info.unic ? "active" : "inactive"}>{info.unic ? "Ativa" : "Inativa"}</Badge>
                      </Field>
                      <Field>
                        <Label>Acesso ao convide amigos</Label>
                        <Badge status={info.accessinvite ? "active" : "inactive"}>
                          {info.accessinvite ? "Habilitada" : "Desabilitada"}
                        </Badge>
                      </Field>
                      <Field>
                        <Label>Qualidade da conta</Label>
                        <QualityScore>
                          <QualityBar>
                            <QualityFill width={85} />
                          </QualityBar>
                          <QualityText>---%</QualityText>
                        </QualityScore>
                      </Field>
                    </Grid>
                  </Section>
                </Content>

                <Footer>
                  <SecondaryButton onClick={() => router.push(ROUTENVX.security)}>
                    <Shield size={16} />
                   Segurança
                  </SecondaryButton>
                  <PrimaryButton onClick={() => router.push(ROUTENVX.centralpreference)}>
                    <Settings size={16} />
                   Configurações
                  </PrimaryButton>
                </Footer>
              </Modal>
            </Overlay>
          </Container>
        )

      case "security":
        return (
          <Container>
            <Overlay>
              <Modal>
                
 
                    
                    <SecurityGrid>
                      <SecurityItem>
                        <SecurityItemHeader>
                          <SecurityItemTitle>Reputação</SecurityItemTitle>
                          <SecurityBadge
                            status={
                              info.quality.reputation === "otima"
                                ? "excellent"
                                : info.quality.reputation === "parcial"
                                  ? "warning"
                                  : "danger"
                            }
                          >
                            {info.quality.reputation === "otima"
                              ? "Excelente"
                              : info.quality.reputation === "parcial"
                                ? "Boa"
                                : "Ruim"}
                          </SecurityBadge>
                        </SecurityItemHeader>
                        <SecurityItemDescription>Nível de posição da comunidade e confiança</SecurityItemDescription>
                      </SecurityItem>

                      <SecurityItem>
                        <SecurityItemHeader>
                          <SecurityItemTitle>Status da conta</SecurityItemTitle>
                          <SecurityBadge
                            status={
                              info.quality.statsaccount === "otima"
                                ? "excellent"
                                : info.quality.statsaccount === "parcial"
                                  ? "warning"
                                  : "danger"
                            }
                          >
                            {info.quality.statsaccount === "otima"
                              ? "Otima"
                              : info.quality.statsaccount === "parcial"
                                ? "Pendente"
                                : "Rejeitada"}
                          </SecurityBadge>
                        </SecurityItemHeader>
                        <SecurityItemDescription>Status de verificação de VISIONID</SecurityItemDescription>
                      </SecurityItem>

                      <SecurityItem>
                        <SecurityItemHeader>
                          <SecurityItemTitle>Reputação da carteira</SecurityItemTitle>
                          <SecurityBadge
                            status={
                              info.quality.statswallet === "otima"
                                ? "excellent"
                                : info.quality.statswallet === "parcial"
                                  ? "warning"
                                  : "danger"
                            }
                          >
                            {info.quality.statswallet === "otima"
                              ? "Otima"
                              : info.quality.statswallet === "parcial"
                                ? "Atenção"
                                : "Ruim"}
                          </SecurityBadge>
                        </SecurityItemHeader>
                        <SecurityItemDescription>Avaliação da carteira</SecurityItemDescription>
                      </SecurityItem>

                      <SecurityItem>
                        <SecurityItemHeader>
                          <SecurityItemTitle>Isecurity Protect</SecurityItemTitle>
                          <SecurityBadge status={info.IsafeSecurity ? "excellent" : "danger"}>
                            {info.IsafeSecurity ? "Habilitada" : "Desabilitada"}
                          </SecurityBadge>
                        </SecurityItemHeader>
                        <SecurityItemDescription>Proteção de conta adicional</SecurityItemDescription>
                      </SecurityItem>
                    </SecurityGrid>
         
             
              </Modal>
            </Overlay>
          </Container>
        )

    }
  }

  return renderContent()
}

// Animations
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: scale(0.96) translateY(8px); 
  }
  to { 
    opacity: 1; 
    transform: scale(1) translateY(0); 
  }
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const slideIn = keyframes`
  from { width: 0%; }
  to { width: var(--target-width); }
`

// Styled Components
const Container = styled.div`
   
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #ffffff;
`

const Overlay = styled.div`

  display: flex;
  align-items: center;
  justify-content: center;
 
  z-index: 1000;
`

const Modal = styled.div`
   
  width: 100%;
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease-out;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
`

 
const RefreshButton = styled.button`
  background: none;
  border: none;
  border-radius: 8px;
  padding: 8px;
  color: #41b45e;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(65, 180, 94, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`

const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding: 0 24px 24px 24px;
`

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
`

const Avatar = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #518f6b 0%, #202020 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const AvatarIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #272928;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;

  img{
    border-radius: 50%;
  }
`

const StatusIndicator = styled.div<{ verified: boolean }>`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: ${(props) => (props.verified ? "#41b45e" : "#ef4444")};
  border: 3px solid #1c1e1d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;

  &::after {
    content: "${(props) => (props.verified ? "✓" : "!")}";
  }
`

const ProfileInfo = styled.div`
  flex: 1;
`

const Name = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #ffffff;
`

const Vid = styled.p`
  font-size: 13px;
  color: #8b8d91;
  font-family: 'ProximaNova-Italic', Courier, monospace;
  margin: 0 0 8px 0;
`

const Status = styled.div<{ verified: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => (props.verified ? "#41b45e" : "#ef4444")};
  padding: 4px 8px;
  border-radius: 6px;
  background: ${(props) => (props.verified ? "rgba(65, 180, 94, 0.1)" : "rgba(239, 68, 68, 0.1)")};
  display: inline-block;
`

const Separator = styled.div`
  height: 1px;
  background: #242525;
  margin: 32px 0;
`

const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #ffffff;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`

const Field = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-top: 1px solid rgba(44, 46, 45, 0.315);
`

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #9ca3af;
`

const Value = styled.div`
  font-size: 12px;
  color: #b9beba;
  font-family: 'InterSemiBold', monospace;
  font-weight: 500;
  max-width: 300px;
  text-align: right;
  word-break: break-all;
`

const Badge = styled.div<{ status: "active" | "inactive" }>`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => (props.status === "active" ? "rgba(65, 180, 94, 0.1)" : "rgba(107, 114, 128, 0.1)")};
  color: ${(props) => (props.status === "active" ? "#41b45e" : "#9ca3af")};
`

const QualityScore = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const QualityBar = styled.div`
  flex: 1;
  height: 4px;
  background: #374151;
  border-radius: 2px;
  overflow: hidden;
  max-width: 120px;
`

const QualityFill = styled.div<{ width: number }>`
  height: 100%;
  width: ${(props) => props.width}%;
  background: #41b45e;
  border-radius: 2px;
  animation: ${slideIn} 1s ease-out;
  --target-width: ${(props) => props.width}%;
`

const QualityText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #41b45e;
`

const PrimaryButton = styled.button`
  flex: 1;
  background: #41b45e1a;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s ease;

  &:hover {
    background: #2c312d;
  }

  &:active {
    transform: scale(0.98);
  }
`

const SecondaryButton = styled.button`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: none;
 border-radius: 12px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`
 
 
const SecurityGrid = styled.div`
display: grid;
  width: 100%;
  margin-bottom: 1em;
  grid-auto-flow: row dense;
   gap: 6px;
 

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(172px, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
  }
  @media (min-width: 1280px) {
    grid-template-columns: repeat(auto-fill, minmax(186px, 1fr));
  }
  @media (min-width: 1536px) {
    grid-template-columns: repeat(auto-fill, minmax(252px, 1fr));
  }
 
`

const SecurityItem = styled.div`
  padding: 10px 12px 10px;
 
  background: rgba(44, 46, 45, 0.164);
  border-radius: 8px;
`

const SecurityItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

const SecurityItemTitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  color: #ffffff;
`

const SecurityBadge = styled.div<{ status: "excellent" | "warning" | "danger" }>`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case "excellent":
        return "rgba(65, 180, 94, 0.1)"
      case "warning":
        return "rgba(251, 191, 36, 0.1)"
      case "danger":
        return "rgba(239, 68, 68, 0.1)"
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "excellent":
        return "#41b45e"
      case "warning":
        return "#fbbf24"
      case "danger":
        return "#ef4444"
    }
  }};
`

const SecurityItemDescription = styled.p`
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
  font-family: 'ProximaNova-Italic', monospace;
`
 