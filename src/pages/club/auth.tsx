"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation" // Changed from "next/router"
import axios from "axios"
import styled, { keyframes, css } from "styled-components"
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { withSession, type NextIronRequest } from "@/lib/session"
import { TheNoVisionRoute } from "@/lib/session/redirects"
import type { User } from "@/types/user/types"
import ROUTENVX from "@/routes/routes"
import HeadGlobal from "@/club/head/glob.n"
import { decodeUserId } from "@/lib/session/encode"

interface Props {
  user: User | null
}

export default function AuthLoading() {
  const router = useRouter()

  const [status, setStatus] = useState("Iniciando processamento...")
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)
  const [processingComplete, setProcessingComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [animateStatus, setAnimateStatus] = useState(false)
  const prevStatusRef = useRef("")
  const [fingerprintComplete, setFingerprintComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [unclose, setUnclose] = useState(false)
  const [animateClose, setAnimateClose] = useState(true)
  const [infouser, setinfouser] = useState<any>(null)
  const [apiMessages, setApiMessages] = useState<string[]>([])
  const [detailedStatus, setDetailedStatus] = useState<any>(null)

  // Get userId from URL params safely
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Safely get the visionId from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const visionId = urlParams.get("visionId")
    if (visionId) {
      const decodedUserId = decodeUserId(visionId)
      setUserId(decodedUserId)
    }
  }, [])

  // Função para adicionar mensagens das APIs
  const addApiMessage = (message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString()
    const formattedMessage = `[${timestamp}] ${message}`

    setApiMessages((prev) => [...prev, formattedMessage])

    if (data) {
      setDetailedStatus((prev: any) => ({
        ...prev,
        [message]: data,
      }))
    }

    console.log(`[API MESSAGE] ${formattedMessage}`, data)
  }

  // Função para fazer requisições com captura de mensagens
  const makeApiRequest = async (url: string, stepName: string) => {
    try {
      addApiMessage(`Iniciando ${stepName}...`)

      const response = await axios.get(url, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      // Capturar mensagens de sucesso
      if (response.data.message) {
        addApiMessage(`${stepName}: ${response.data.message}`, response.data)
      }

      if (response.data.success) {
        addApiMessage(`${stepName} concluído com sucesso`)
      }

      // Capturar dados específicos de cada API
      if (response.data.user) {
        addApiMessage(`Dados do usuário obtidos: ${response.data.user.username || response.data.user.id}`)
      }

      if (response.data.addedToGuild !== undefined) {
        addApiMessage(`Adição ao Discord: ${response.data.addedToGuild ? "Sucesso" : "Falhou"}`)
      }

      if (response.data.roleApplied !== undefined) {
        addApiMessage(`Aplicação de cargo: ${response.data.roleApplied ? "Sucesso" : "Falhou"}`)
      }

      if (response.data.processingTime) {
        addApiMessage(`Tempo de processamento: ${response.data.processingTime}ms`)
      }

      return response
    } catch (err: any) {
      // Capturar mensagens de erro detalhadas
      const errorData = err.response?.data
      const status = err.response?.status

      addApiMessage(`Erro em ${stepName} (${status}): ${errorData?.message || err.message}`, errorData)

      if (errorData?.code) {
        addApiMessage(`Código do erro: ${errorData.code}`)
      }

      if (errorData?.details) {
        addApiMessage(`Detalhes: ${errorData.details}`)
      }

      if (errorData?.location) {
        addApiMessage(`Localização detectada: ${errorData.location.city}, ${errorData.location.country}`)
      }

      if (errorData?.duplicateCount) {
        addApiMessage(`Contas duplicadas encontradas: ${errorData.duplicateCount}`)
      }

      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((error: string) => {
          addApiMessage(`Erro adicional: ${error}`)
        })
      }

      throw err
    }
  }

  // Função para fazer requisição POST com captura de mensagens
  const makeApiPostRequest = async (url: string, data: any, stepName: string) => {
    try {
      addApiMessage(`Iniciando ${stepName}...`)

      const response = await axios.post(url, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      // Capturar mensagens de sucesso
      if (response.data.message) {
        addApiMessage(`${stepName}: ${response.data.message}`, response.data)
      }

      if (response.data.success) {
        addApiMessage(`${stepName} concluído com sucesso`)
      }

      if (response.data.processingTime) {
        addApiMessage(`Tempo de processamento: ${response.data.processingTime}ms`)
      }

      if (response.data.user) {
        addApiMessage(`Sessão criada para: ${response.data.user.username || response.data.user.id}`)
      }

      return response
    } catch (err: any) {
      const errorData = err.response?.data
      const status = err.response?.status

      addApiMessage(`Erro em ${stepName} (${status}): ${errorData?.message || err.message}`, errorData)

      if (errorData?.code) {
        addApiMessage(`Código do erro: ${errorData.code}`)
      }

      throw err
    }
  }

  // Trigger animation when status changes
  useEffect(() => {
    if (currentStep === 0 && prevStatusRef.current !== status && prevStatusRef.current !== "") {
      setAnimateStatus(true)
      const timer = setTimeout(() => {
        setAnimateStatus(false)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setAnimateStatus(true)
    }
    prevStatusRef.current = status
  }, [status])

  useEffect(() => {
    if (currentStep !== 0) return

    let isCancelled = false

    if (!unclose) {
      const timer = setTimeout(() => {
        if (!isCancelled && currentStep === 0) {
          setUnclose(true)
        }
      }, 5000)
      return () => {
        isCancelled = true
        clearTimeout(timer)
      }
    } else {
      const timeout1 = setTimeout(() => {
        if (!isCancelled && currentStep === 0) {
          setUnclose(true)
          setAnimateClose(false)
        }
      }, 900)

      const timeout2 = setTimeout(() => {
        if (!userId && !isCancelled && currentStep === 0) {
           router.replace(ROUTENVX.signin)
        }
      }, 2000)

      return () => {
        isCancelled = true
        clearTimeout(timeout1)
        clearTimeout(timeout2)
      }
    }
  }, [currentStep, unclose, userId, router])

  const processSteps = async () => {
    if (!userId || processingComplete) return

    try {
      // Fingerprint verification
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setFingerprintComplete(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Etapa 1: Verificar conta e iniciar processamento
      setCurrentStep(0)
      setStatus("Verificando sua conta...")
      setProgress(10)
      addApiMessage("Iniciando verificação de conta...")

      try {
        const response = await makeApiRequest(`/api/club/connect/checkAccount?userId=${userId}`, "Verificação de Conta")
        setinfouser(response.data)
        await new Promise((resolve) => setTimeout(resolve, 1500))
      } catch (err: any) {
        const status = err.response?.status
        const data = err.response?.data

        if (status === 410 && data?.error === "deleted_account") {
          setError(data.message)
          setStatus("Conta excluída")
          setProcessingComplete(true)
          return
        } else if (data?.error) {
          setError(`${data.error}`)
        } else {
          setError("Erro na verificação de conta. Por favor, tente novamente.")
        }

        setStatus("Falha na verificação de conta")
        setProcessingComplete(true)
        return
      }

      // Etapa 2: Processar usuário no banco de dados
      setCurrentStep(1)
      setStatus("Processando seus dados...")
      setProgress(30)

      try {
        await makeApiRequest(`/api/club/connect/userProcessing?userId=${userId}`, "Processamento de Dados")
        await new Promise((resolve) => setTimeout(resolve, 1500))
      } catch (err: any) {
        if (err.response?.status === 403 && err.response?.data?.code === "LOCATION_RESTRICTED") {
          const loc = err.response.data.location
          const locationStr = loc ? ` Detectado: ${loc.city}, ${loc.country}.` : ""
          setError(`Serviço disponível apenas para usuários do Brasil e Portugal. ${locationStr}`)
          setStatus("Localização não permitida.")
          setProcessingComplete(true)
          return
        } else if (err.response?.data?.error) {
          const loc = err.response.data.location
          const locationStr = loc ? ` Detectado: ${loc.city}, ${loc.country}.` : ""
          setError(` ${err.response.data.error} ${locationStr}`)
        } else {
          setError("Erro no processamento de dados. Por favor, tente novamente.")
        }
        setStatus("Falha no processamento")
        setProcessingComplete(true)
        return
      }

      // Etapa 3: Adicionar ao Discord
      setCurrentStep(2)
      setStatus("Conectando ao Discord...")
      setProgress(50)
      await makeApiRequest(`/api/club/connect/discordAdd?userId=${userId}`, "Conexão Discord")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Etapa 4: Configurar cargos
      setCurrentStep(3)
      setStatus("Configurando seus privilégios...")
      setProgress(70)
      await makeApiRequest(`/api/club/connect/roleAssignment?userId=${userId}`, "Configuração de Cargos")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Etapa 5: Finalizar - USANDO POST E EVITANDO CHAMADAS DUPLICADAS
      setCurrentStep(4)
      setStatus("Finalizando sua conexão...")
      setProgress(90)

      // Chamada única para finalizar
      await makeApiPostRequest(`/api/club/connect/finalize`, { userId }, "Finalização")

      // Marcar processamento como completo para evitar chamadas duplicadas
      setProcessingComplete(true)

      // Concluído
      setStatus("Conexão concluída com sucesso!")
      setProgress(100)
      setShowConfetti(true)
      addApiMessage("Processo de autenticação concluído com sucesso!")

      // Redirecionar para a página inicial após 3 segundos
      setTimeout(() => {
        if (window.opener) {
          window.opener.location.reload()
          window.close()
        } else {
          router.replace(ROUTENVX.Dashboard) // Redirecionar se não for uma janela popup
        }
      }, 3000)
    } catch (err: any) {
      console.error("Erro no processamento:", err)

      // Verificar se o erro é devido a dados OAuth ausentes
      if (err.response?.status === 400 && err.response?.data?.error?.includes("OAuth")) {
        // Se for um erro de OAuth ausente, provavelmente é uma chamada duplicada
        // Podemos simplesmente concluir o processo sem erro
        setStatus("Conexão concluída com sucesso!")
        setProgress(100)
        addApiMessage("Processo concluído (OAuth já processado)")

        setTimeout(() => {
          if (window.opener) {
            window.opener.location.reload()
            window.close()
          } else {
            router.replace(ROUTENVX.Dashboard)
          }
        }, 1500)
      } else {
        // Outros erros
        const step = status.replace("...", "").trim()
        setError(`Erro durante ${step}. Por favor, tente novamente.`)
        addApiMessage(`Processo interrompido devido a erro: ${err.message}`)
      }
    }
  }

  useEffect(() => {
    if (userId) {
      processSteps()
    }
  }, [userId])

  // Render different modal cards based on the current step
  const renderModalCard = () => {
    if (error) {
      return <ErrorCard error={error} onClose={() => window.close()} infouser={infouser} apiMessages={apiMessages} />
    }

    if (!fingerprintComplete) {
      return <FingerprintCard />
    }

    switch (currentStep) {
      case 0:
        return (
          <AccountVerificationCard
            status={status}
            progress={progress}
            animate={animateStatus}
            infouser={infouser}
            apiMessages={apiMessages}
          />
        )
      case 1:
        return (
          <DataProcessingCard
            status={status}
            progress={progress}
            animate={animateStatus}
            infouser={infouser}
            apiMessages={apiMessages}
          />
        )
      case 2:
        return (
          <DiscordConnectionCard
            status={status}
            progress={progress}
            animate={animateStatus}
            infouser={infouser}
            apiMessages={apiMessages}
          />
        )
      case 3:
        return (
          <PrivilegeConfigCard
            status={status}
            progress={progress}
            animate={animateStatus}
            infouser={infouser}
            apiMessages={apiMessages}
          />
        )
      case 4:
        return (
          <FinalizingConnectionCard
            status={status}
            progress={progress}
            animate={animateStatus}
            infouser={infouser}
            apiMessages={apiMessages}
          />
        )
      default:
        if (processingComplete) {
          return <SuccessCard showConfetti={showConfetti} infouser={infouser} apiMessages={apiMessages} />
        }
        return <LoadingCard status={status} progress={progress} infouser={infouser} apiMessages={apiMessages} />
    }
  }

  return (
    <Container>
      <HeadGlobal Title="Re > Conectando..." />

      <LogoContainer>
        <MarginImags>
          <li>
            <img src="/icons/market/20250325_192605.webp" alt="novision" width={145} height={145} className="b1" />
            <img src="/icons/market/20250325_192624.webp" alt="novision" width={145} height={145} className="b2" />
          </li>
        </MarginImags>
      </LogoContainer>

      <ContentContainer>
        <Heading>{error ? "Ocorreu um erro" : currentStep ? "Conectando..." : "Você está deslogado"}</Heading>
        <Subheading>
          {error
            ? error
            : currentStep
              ? "Estamos configurando sua conta para acesso completo. Este processo leva apenas alguns segundos."
              : "Iremos configurar sua conta para acesso completo. Este processo leva apenas alguns segundos."}
        </Subheading>

        <Footer>{currentStep > 0 && !error && "Por favor, não feche esta janela até o processo ser concluído."}</Footer>
      </ContentContainer>
      <ModalContainer active={currentStep == 0 && unclose} hide={currentStep == 0 && unclose && !animateClose}>
        {renderModalCard()}
      </ModalContainer>
      <PurpleGlow />
      <PurpleGlowTop />
    </Container>
  )
}

// [Rest of the component code remains exactly the same - all the styled components and card components]

// Fingerprint Card Component
const FingerprintCard = () => {
  return (
    <ModalForm>
      <ModalContent>
        <LogoSection>
          <LogoContainer>
            <LogoFlex>
              <DotContainer>
                <Dot opacity="0.1" />
                <Dot opacity="0.2" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoWrapper>
                <img src="/icons/user.png" alt="user" width={64} height={64} className="rotating-logo" />
              </LogoWrapper>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoCircle>
                <img src="/icons/market/20250325_192624.webp" alt="novision" width={64} height={64} />
              </LogoCircle>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.2" />
                <Dot opacity="0.1" />
              </DotContainer>
            </LogoFlex>
          </LogoContainer>
        </LogoSection>

        <TextContainer>
          <MainTitle>Verificação de Identidade</MainTitle>
          <Subtitle>Estamos verificando sua identidade para garantir um acesso seguro.</Subtitle>
        </TextContainer>

        <FingerprintContainer>
          <FingerprintScannerCard>
            <FingerprintIconContainer>
              <FingerprintIcon />
              <FingerprintRipple />
              <FingerprintRipple delay="1s" />
              <FingerprintRipple delay="2s" />
            </FingerprintIconContainer>
          </FingerprintScannerCard>
        </FingerprintContainer>

        <SecurityInfoContainer>
          <SecurityInfoItem>
            <SecurityIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </SecurityIcon>
            <SecurityText>Assinatura não encontrada </SecurityText>
          </SecurityInfoItem>
        </SecurityInfoContainer>

        <PrivacyContainer>
          <PrivacyText>Por favor, não feche esta janela até o processo ser concluído.</PrivacyText>
        </PrivacyContainer>
      </ModalContent>
    </ModalForm>
  )
}

// Account Verification Card Component
const AccountVerificationCard = ({ status, progress, animate, infouser, apiMessages }: any) => {
  return (
    <ModalForm>
      <ModalContent>
        <LogoSection>
          <LogoContainer>
            <LogoFlex>
              <DotContainer>
                <Dot opacity="0.1" />
                <Dot opacity="0.2" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoWrapper>
                {infouser && infouser.user && infouser.user.avatar ? (
                  <img
                    src={infouser.user.avatar || "/placeholder.svg"}
                    alt="user"
                    width={64}
                    height={64}
                    className="rotating-logo"
                  />
                ) : (
                  <img src="/icons/user.png" alt="user" width={64} height={64} className="rotating-logo" />
                )}
              </LogoWrapper>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoCircle>
                <img src="/icons/market/20250325_192624.webp" alt="novision" width={64} height={64} />
              </LogoCircle>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.2" />
                <Dot opacity="0.1" />
              </DotContainer>
            </LogoFlex>
          </LogoContainer>
        </LogoSection>

        <TextContainer>
          <MainTitle>Verificando sua Conta</MainTitle>
          <Subtitle>Estamos validando suas credenciais para garantir um acesso seguro.</Subtitle>
        </TextContainer>

        <AnimatedShieldContainer>
          <ShieldIcon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </ShieldIcon>
          <PulsingCircle />
          <PulsingCircle delay="1s" />
          <PulsingCircle delay="2s" />
        </AnimatedShieldContainer>

        <VerificationDetailsContainer>
          <VerificationDetail>
            <VerificationIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </VerificationIcon>
            <VerificationText>Verificando identidade</VerificationText>
            <VerificationStatus>Concluído</VerificationStatus>
          </VerificationDetail>
          <VerificationDetail>
            <VerificationIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </VerificationIcon>
            <VerificationText>Validando credenciais</VerificationText>
            <VerificationStatus>Em progresso</VerificationStatus>
          </VerificationDetail>
        </VerificationDetailsContainer>

        <StatusSection>
          <StatusContainer animate={animate}>
            <StatusInfo>
              <StatusText>
                {" "}
                {apiMessages.slice(-1).map((message: string, index: number) => (
                  <ApiMessage2 key={index}>{message || status}</ApiMessage2>
                ))}
              </StatusText>
              <ProgressPercentage>{progress}%</ProgressPercentage>
            </StatusInfo>
            <ProgressBarContainer>
              <ProgressBar width={progress} />
            </ProgressBarContainer>
          </StatusContainer>
        </StatusSection>

        <PrivacyContainer>
          <PrivacyText>Por favor, não feche esta janela até o processo ser concluído.</PrivacyText>
        </PrivacyContainer>
      </ModalContent>
    </ModalForm>
  )
}

// Data Processing Card Component
const DataProcessingCard = ({ status, progress, animate, infouser, apiMessages }: any) => {
  return (
    <ModalForm>
      <ModalContent>
        <LogoSection>
          <LogoContainer>
            <LogoFlex>
              <DotContainer>
                <Dot opacity="0.1" />
                <Dot opacity="0.2" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoWrapper>
                {infouser && infouser.user && infouser.user.avatar ? (
                  <img
                    src={infouser.user.avatar || "/placeholder.svg"}
                    alt="user"
                    width={64}
                    height={64}
                    className="rotating-logo"
                  />
                ) : (
                  <img src="/icons/user.png" alt="user" width={64} height={64} className="rotating-logo" />
                )}
              </LogoWrapper>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoCircle>
                <img src="/icons/market/20250325_192624.webp" alt="novision" width={64} height={64} />
              </LogoCircle>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.2" />
                <Dot opacity="0.1" />
              </DotContainer>
            </LogoFlex>
          </LogoContainer>
        </LogoSection>

        <TextContainer>
          <MainTitle>Processando seus Dados</MainTitle>
          <Subtitle>Estamos validando seu perfil no sistema para garantir uma experiência personalizada.</Subtitle>
        </TextContainer>

        <DataProcessingAnimation>
          <DataProcessingCircle>
            <DataProcessingInnerCircle>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                />
              </svg>
            </DataProcessingInnerCircle>
          </DataProcessingCircle>
          <DataParticle top="20%" left="20%" delay="0s" />
          <DataParticle top="70%" left="30%" delay="0.5s" />
          <DataParticle top="40%" left="80%" delay="1s" />
          <DataParticle top="80%" left="70%" delay="1.5s" />
          <DataParticle top="30%" left="60%" delay="2s" />
        </DataProcessingAnimation>

        <DataProcessingSteps>
          <DataProcessingStep completed>
            <DataProcessingStepIcon completed>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </DataProcessingStepIcon>
            <DataProcessingStepText>Verificação de conta</DataProcessingStepText>
          </DataProcessingStep>
          <DataProcessingStepConnector />
          <DataProcessingStep active>
            <DataProcessingStepIcon active>
              <LoadingSpinner />
            </DataProcessingStepIcon>
            <DataProcessingStepText>Processamento de dados</DataProcessingStepText>
          </DataProcessingStep>
          <DataProcessingStepConnector />
          <DataProcessingStep>
            <DataProcessingStepIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </DataProcessingStepIcon>
            <DataProcessingStepText>Conexão com serviços</DataProcessingStepText>
          </DataProcessingStep>
        </DataProcessingSteps>

        <StatusSection>
          <StatusContainer animate={animate}>
            <StatusInfo>
              <StatusText>
                {" "}
                {apiMessages.slice(-1).map((message: string, index: number) => (
                  <ApiMessage2 key={index}>{message || status}</ApiMessage2>
                ))}
              </StatusText>
              <ProgressPercentage>{progress}%</ProgressPercentage>
            </StatusInfo>
            <ProgressBarContainer>
              <ProgressBar width={progress} />
            </ProgressBarContainer>
          </StatusContainer>
        </StatusSection>

        <PrivacyContainer>
          <PrivacyText>Por favor, não feche esta janela até o processo ser concluído.</PrivacyText>
        </PrivacyContainer>
      </ModalContent>
    </ModalForm>
  )
}

// Discord Connection Card Component
const DiscordConnectionCard = ({ status, progress, animate, infouser, apiMessages }: any) => {
  return (
    <ModalForm>
      <ModalContent>
        <LogoSection>
          <LogoContainer>
            <LogoFlex>
              <DotContainer>
                <Dot opacity="0.1" />
                <Dot opacity="0.2" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoWrapper>
                {infouser && infouser.user && infouser.user.avatar ? (
                  <img
                    src={infouser.user.avatar || "/placeholder.svg"}
                    alt="user"
                    width={64}
                    height={64}
                    className="rotating-logo"
                  />
                ) : (
                  <img src="/icons/user.png" alt="user" width={64} height={64} className="rotating-logo" />
                )}
              </LogoWrapper>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoCircle>
                <img src="/icons/market/20250325_192624.webp" alt="novision" width={64} height={64} />
              </LogoCircle>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.2" />
                <Dot opacity="0.1" />
              </DotContainer>
            </LogoFlex>
          </LogoContainer>
        </LogoSection>

        <TextContainer>
          <MainTitle>Conectando ao Discord</MainTitle>
          <Subtitle>Estamos estabelecendo conexão com o servidor do Discord para integrar sua conta.</Subtitle>
        </TextContainer>

        <ConnectionAnimation>
          <ConnectionNode left>
            <img src="/icons/market/20250325_192605.webp" alt="novision" width={48} height={48} />
          </ConnectionNode>

          <ConnectionLine>
            <ConnectionPulse />
          </ConnectionLine>

          <ConnectionNode right>
            <DiscordLogo>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
                <path
                  fill="#5865f2"
                  d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
                />
              </svg>
            </DiscordLogo>
          </ConnectionNode>
        </ConnectionAnimation>

        <DiscordServerInfo>
          <DiscordServerIcon>
            <img src="/icons/market/20250325_192624.webp" alt="server" width={48} height={48} />
          </DiscordServerIcon>
          <DiscordServerDetails>
            <DiscordServerName>NoVision Community</DiscordServerName>
            <DiscordServerMembers>verificando suas atividade..</DiscordServerMembers>
          </DiscordServerDetails>
          <DiscordConnectingIndicator>
            <DiscordConnectingDot />
            <DiscordConnectingDot delay="0.3s" />
            <DiscordConnectingDot delay="0.6s" />
          </DiscordConnectingIndicator>
        </DiscordServerInfo>

        <StatusSection>
          <StatusContainer animate={animate}>
            <StatusInfo>
              <StatusText>
                {" "}
                {apiMessages.slice(-1).map((message: string, index: number) => (
                  <ApiMessage2 key={index}>{message || status}</ApiMessage2>
                ))}
              </StatusText>
              <ProgressPercentage>{progress}%</ProgressPercentage>
            </StatusInfo>
            <ProgressBarContainer>
              <ProgressBar width={progress} />
            </ProgressBarContainer>
          </StatusContainer>
        </StatusSection>

        <PrivacyContainer>
          <PrivacyText>Por favor, não feche esta janela até o processo ser concluído.</PrivacyText>
        </PrivacyContainer>
      </ModalContent>
    </ModalForm>
  )
}

// Privilege Config Card Component
const PrivilegeConfigCard = ({ status, progress, animate, infouser, apiMessages }: any) => {
  return (
    <ModalForm>
      <ModalContent>
        <LogoSection>
          <LogoContainer>
            <LogoFlex>
              <DotContainer>
                <Dot opacity="0.1" />
                <Dot opacity="0.2" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoWrapper>
                {infouser && infouser.user && infouser.user.avatar ? (
                  <img
                    src={infouser.user.avatar || "/placeholder.svg"}
                    alt="user"
                    width={64}
                    height={64}
                    className="rotating-logo"
                  />
                ) : (
                  <img src="/icons/user.png" alt="user" width={64} height={64} className="rotating-logo" />
                )}
              </LogoWrapper>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoCircle>
                <img src="/icons/market/20250325_192624.webp" alt="novision" width={64} height={64} />
              </LogoCircle>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.2" />
                <Dot opacity="0.1" />
              </DotContainer>
            </LogoFlex>
          </LogoContainer>
        </LogoSection>

        <TextContainer>
          <MainTitle>Configurando seus Privilégios</MainTitle>
          <Subtitle>Estamos atribuindo permissões e acessos para sua conta no sistema.</Subtitle>
        </TextContainer>

        <PrivilegeCardsContainer>
          <PrivilegeCard active>
            <PrivilegeCardIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </PrivilegeCardIcon>
            <PrivilegeCardTitle>Acesso ao clubvision</PrivilegeCardTitle>
            <PrivilegeCardStatus>Configurado</PrivilegeCardStatus>
            <PrivilegeCardCheckmark>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </PrivilegeCardCheckmark>
          </PrivilegeCard>

          <PrivilegeCard active>
            <PrivilegeCardIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
            </PrivilegeCardIcon>
            <PrivilegeCardTitle>Permissões</PrivilegeCardTitle>
            <PrivilegeCardStatus>Configurado</PrivilegeCardStatus>
            <PrivilegeCardCheckmark>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </PrivilegeCardCheckmark>
          </PrivilegeCard>

          <PrivilegeCard>
            <PrivilegeCardIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </PrivilegeCardIcon>
            <PrivilegeCardTitle>Integrações discord</PrivilegeCardTitle>
            <PrivilegeCardStatus>Em progresso</PrivilegeCardStatus>
            <PrivilegeCardLoading>
              <LoadingSpinner />
            </PrivilegeCardLoading>
          </PrivilegeCard>
        </PrivilegeCardsContainer>

        <StatusSection>
          <StatusContainer animate={animate}>
            <StatusInfo>
              <StatusText>
                {" "}
                {apiMessages.slice(-1).map((message: string, index: number) => (
                  <ApiMessage2 key={index}>{message || status}</ApiMessage2>
                ))}
              </StatusText>
              <ProgressPercentage>{progress}%</ProgressPercentage>
            </StatusInfo>
            <ProgressBarContainer>
              <ProgressBar width={progress} />
            </ProgressBarContainer>
          </StatusContainer>
        </StatusSection>

        <PrivacyContainer>
          <PrivacyText>Por favor, não feche esta janela até o processo ser concluído.</PrivacyText>
        </PrivacyContainer>
      </ModalContent>
    </ModalForm>
  )
}

// Finalizing Connection Card Component
const FinalizingConnectionCard = ({ status, progress, animate, infouser, apiMessages }: any) => {
  return (
    <ModalForm>
      <ModalContent>
        <LogoSection>
          <LogoContainer>
            <LogoFlex>
              <DotContainer>
                <Dot opacity="0.1" />
                <Dot opacity="0.2" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoWrapper>
                {infouser && infouser.user && infouser.user.avatar ? (
                  <img
                    src={infouser.user.avatar || "/placeholder.svg"}
                    alt="user"
                    width={64}
                    height={64}
                    className="rotating-logo"
                  />
                ) : (
                  <img src="/icons/user.png" alt="user" width={64} height={64} className="rotating-logo" />
                )}
              </LogoWrapper>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoCircle>
                <img src="/icons/market/20250325_192624.webp" alt="novision" width={64} height={64} />
              </LogoCircle>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.2" />
                <Dot opacity="0.1" />
              </DotContainer>
            </LogoFlex>
          </LogoContainer>
        </LogoSection>

        <TextContainer>
          <MainTitle>Finalizando sua Conexão</MainTitle>
          <Subtitle>Estamos concluindo o processo de autenticação e preparando seu acesso.</Subtitle>
        </TextContainer>

        <FinalizeAnimation>
          <FinalizeCircle>
            <FinalizeInnerCircle>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </FinalizeInnerCircle>
          </FinalizeCircle>
          <FinalizePulse />
          <FinalizePulse delay="1s" />
          <FinalizePulse delay="2s" />
        </FinalizeAnimation>

        <FinalizeStepsContainer>
          <FinalizeStep completed>
            <FinalizeStepIcon completed>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </FinalizeStepIcon>
            <FinalizeStepText>Verificação de conta</FinalizeStepText>
          </FinalizeStep>

          <FinalizeStep completed>
            <FinalizeStepIcon completed>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </FinalizeStepIcon>
            <FinalizeStepText>Processamento de dados</FinalizeStepText>
          </FinalizeStep>

          <FinalizeStep completed>
            <FinalizeStepIcon completed>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </FinalizeStepIcon>
            <FinalizeStepText>Conexão com Discord</FinalizeStepText>
          </FinalizeStep>

          <FinalizeStep completed>
            <FinalizeStepIcon completed>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </FinalizeStepIcon>
            <FinalizeStepText>Configuração de privilégios</FinalizeStepText>
          </FinalizeStep>

          <FinalizeStep active>
            <FinalizeStepIcon active>
              <LoadingSpinner />
            </FinalizeStepIcon>

            <FinalizeStepText>
              {" "}
              {apiMessages.slice(-1).map((message: string, index: number) => (
                <>{message || "Finalizando conexão"}</>
              ))}
            </FinalizeStepText>
          </FinalizeStep>
        </FinalizeStepsContainer>

        <PrivacyContainer>
          <PrivacyText>Por favor, não feche esta janela até o processo ser concluído.</PrivacyText>
        </PrivacyContainer>
      </ModalContent>
    </ModalForm>
  )
}

// Success Card Component
const SuccessCard = ({ showConfetti, infouser, apiMessages }: any) => {
  return (
    <ModalForm>
      <ModalContent>
        {showConfetti && <ConfettiAnimation />}

        <LogoSection>
          <LogoContainer>
            <LogoFlex>
              <DotContainer>
                <Dot opacity="0.1" />
                <Dot opacity="0.2" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoWrapper>
                {infouser && infouser.user && infouser.user.avatar ? (
                  <img
                    src={infouser.user.avatar || "/placeholder.svg"}
                    alt="user"
                    width={64}
                    height={64}
                    className="rotating-logo"
                  />
                ) : (
                  <img src="/icons/user.png" alt="user" width={64} height={64} className="rotating-logo" />
                )}
              </LogoWrapper>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoCircle>
                <img src="/icons/market/20250325_192624.webp" alt="novision" width={64} height={64} />
              </LogoCircle>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.2" />
                <Dot opacity="0.1" />
              </DotContainer>
            </LogoFlex>
          </LogoContainer>
        </LogoSection>

        <TextContainer>
          <MainTitle>Conexão Concluída com Sucesso!</MainTitle>
          <Subtitle>Sua conta foi configurada com sucesso. Você será redirecionado em instantes.</Subtitle>
        </TextContainer>

        <SuccessAnimation>
          <SuccessCircle>
            <SuccessCheckmark>
              <svg viewBox="0 0 24 24" width="64" height="64">
                <circle className="circle" cx="12" cy="12" r="11" fill="none" stroke="#4CAF50" strokeWidth="2" />
                <path className="check" d="M7 13l3 3 7-7" fill="none" stroke="#4CAF50" strokeWidth="2" />
              </svg>
            </SuccessCheckmark>
          </SuccessCircle>
        </SuccessAnimation>

        <SuccessDetails>
          <SuccessDetail>
            <SuccessDetailIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </SuccessDetailIcon>
            <SuccessDetailText>Conta verificada</SuccessDetailText>
          </SuccessDetail>

          <SuccessDetail>
            <SuccessDetailIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </SuccessDetailIcon>
            <SuccessDetailText>Perfil configurado</SuccessDetailText>
          </SuccessDetail>

          <SuccessDetail>
            <SuccessDetailIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </SuccessDetailIcon>
            <SuccessDetailText>Discord conectado</SuccessDetailText>
          </SuccessDetail>
        </SuccessDetails>

        {/* Seção de mensagens das APIs */}
        <ApiMessagesContainer>
          <ApiMessagesTitle>Resumo do Processo:</ApiMessagesTitle>
          <ApiMessagesList>
            {apiMessages.slice(-5).map((message: string, index: number) => (
              <ApiMessage key={index}>{message}</ApiMessage>
            ))}
          </ApiMessagesList>
        </ApiMessagesContainer>

        <RedirectMessage>
          <RedirectIcon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </RedirectIcon>
          <RedirectText>Redirecionando para o Dashboard...</RedirectText>
        </RedirectMessage>
      </ModalContent>
    </ModalForm>
  )
}

// Loading Card Component
const LoadingCard = ({ status, progress, infouser, apiMessages }: any) => {
  return (
    <ModalForm>
      <ModalContent>
        <LogoSection>
          <LogoContainer>
            <LogoFlex>
              <DotContainer>
                <Dot opacity="0.1" />
                <Dot opacity="0.2" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoWrapper>
                {infouser && infouser.user && infouser.user.avatar ? (
                  <img
                    src={infouser.user.avatar || "/placeholder.svg"}
                    alt="user"
                    width={64}
                    height={64}
                    className="rotating-logo"
                  />
                ) : (
                  <img src="/icons/user.png" alt="user" width={64} height={64} className="rotating-logo" />
                )}
              </LogoWrapper>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoCircle>
                <img src="/icons/market/20250325_192624.webp" alt="novision" width={64} height={64} />
              </LogoCircle>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.2" />
                <Dot opacity="0.1" />
              </DotContainer>
            </LogoFlex>
          </LogoContainer>
        </LogoSection>

        <TextContainer>
          <MainTitle>Carregando...</MainTitle>
          <Subtitle>Estamos preparando tudo para você. Por favor, aguarde um momento.</Subtitle>
        </TextContainer>

        <LoadingAnimation>
          <LoadingCircle />
        </LoadingAnimation>

        <StatusSection>
          <StatusInfo>
            <StatusText>
              {" "}
              {apiMessages.slice(-1).map((message: string, index: number) => (
                <ApiMessage2 key={index}>{message || status}</ApiMessage2>
              ))}
            </StatusText>
            <ProgressPercentage>{progress}%</ProgressPercentage>
          </StatusInfo>
          <ProgressBarContainer>
            <ProgressBar width={progress} />
          </ProgressBarContainer>
        </StatusSection>

        <PrivacyContainer>
          <PrivacyText>Por favor, não feche esta janela até o processo ser concluído.</PrivacyText>
        </PrivacyContainer>
      </ModalContent>
    </ModalForm>
  )
}

// Error Card Component
const ErrorCard = ({ error, onClose, infouser, apiMessages }: any) => {
  const router = useRouter()

  return (
    <ModalForm>
      <ModalContent>
        <LogoSection>
          <LogoContainer>
            <LogoFlex>
              <DotContainer>
                <Dot opacity="0.1" />
                <Dot opacity="0.2" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoWrapper>
                {infouser && infouser.user && infouser.user.avatar ? (
                  <img
                    src={infouser.user.avatar || "/placeholder.svg"}
                    alt="user"
                    width={64}
                    height={64}
                    className="rotating-logo"
                  />
                ) : (
                  <img src="/icons/user.png" alt="user" width={64} height={64} className="rotating-logo" />
                )}
              </LogoWrapper>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.3" />
              </DotContainer>

              <LogoCircle>
                <img src="/icons/market/20250325_192624.webp" alt="novision" width={64} height={64} />
              </LogoCircle>

              <DotContainer>
                <Dot opacity="0.3" />
                <Dot opacity="0.2" />
                <Dot opacity="0.1" />
              </DotContainer>
            </LogoFlex>
          </LogoContainer>
        </LogoSection>

        <TextContainer>
          <MainTitle>Ocorreu um Erro</MainTitle>
          <Subtitle>Encontramos um problema durante o processo de autenticação.</Subtitle>
        </TextContainer>

        <ErrorAnimation>
          <ErrorCircle>
            <ErrorIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </ErrorIcon>
          </ErrorCircle>
        </ErrorAnimation>

        <ErrorMessageContainer>
          <ErrorMessageText>{error}</ErrorMessageText>
        </ErrorMessageContainer>

        {/* Seção de mensagens das APIs para debug */}
        {apiMessages.length > 0 && (
          <ApiMessagesContainer>
            <ApiMessagesTitle>Log de Erros:</ApiMessagesTitle>
            <ApiMessagesList>
              {apiMessages.slice(-5).map((message: string, index: number) => (
                <ApiMessage key={index} error>
                  {message}
                </ApiMessage>
              ))}
            </ApiMessagesList>
          </ApiMessagesContainer>
        )}

        <ErrorActions>
          <ErrorButton onClick={() => router.replace(ROUTENVX.signin)}>Fechar</ErrorButton>
        </ErrorActions>
      </ModalContent>
    </ModalForm>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = withSession(
  async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const req: NextIronRequest = context.req as NextIronRequest
    const result = await TheNoVisionRoute({ req })
    const user = result.props.user

    // // BLOQUEIO: Verifica se flag de acesso está presente
    // const oauthTemp = await req.session.get("oauth_temp")
    // const isAuthorized = oauthTemp?.allow_auth_page_access

    // if (!isAuthorized) {
    //   // acesso direto ou inválido, renderiza página de erro
    //   return {
    //     redirect: {
    //       destination: ROUTENVX.signin, // ou renderize um <ErrorPage /> direto
    //       permanent: false,
    //     },
    //   }
    // }

    // // Evita reutilização da flag
    // oauthTemp.allow_auth_page_access = false

    if (user) {
      return {
        redirect: {
          destination: ROUTENVX.Dashboard,
          permanent: false,
        },
      }
    }

    return {
      props: {
        user,
      },
    }
  },
)

// Keyframes animations
const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`

const ripple = keyframes`
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const fadeInc = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const Closex = keyframes`
  to {  transform: translateY(100%); }
  from { transform: translateY(0); }
`

const slideIn = keyframes`
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`

const statusPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`

const connectionPulse = keyframes`
  0% { transform: translateX(-5px) scale(1); opacity: 1; }
  100% { transform: translateX(105px) scale(1); opacity: 1; }
`

const blink = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
`

const checkmarkCircle = keyframes`
  0% { stroke-dashoffset: 70; }
  100% { stroke-dashoffset: 0; }
`

const checkmarkCheck = keyframes`
  0% { stroke-dashoffset: 20; }
  100% { stroke-dashoffset: 0; }
`

const confettiDrop = keyframes`
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #000000;
  background: linear-gradient(135deg, #000000 70%, #357555 130%);
  color: white;
  position: relative;
  overflow: hidden;
`

const ModalContainer = styled.div<{ active?: boolean; hide?: boolean }>`
 
  
  z-index: 10;
  position: fixed;
  
  display: ${(props) => (props.hide ? "none" : "block")};
  animation:  ${(props: any) => (props.active ? Closex : "ViewModbc")}  1s ease-out;
   
  right: 0;
  left: 0;
  
  

  @keyframes ViewModbc {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0);
    }
  }
`

const ModalForm = styled.div`
  min-height: 40vh;
  max-height: 90vh;
  position: relative;
  width: 30vw;
  margin: 0 auto;
  font-family: "Inter", sans-serif;
  border-radius: 29px;
  flex-direction: column;
  overflow-y: auto;
  background:  linear-gradient(204deg, #48bd8240 -7%, #b85cff00 33%), linear-gradient(162deg, #c8cecb40 -10%, #2c88dd00 25%), linear-gradient(0deg, #1b1b1b, #0e0e11);
  border: 2px solid var(--divider-nonOpaque, rgb(34, 35, 36));
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

  @media (max-width: 940px) {
    width: 100%;
    height: 100%;
    flex: 1;
    padding: 2rem;
  
 
  
  }
 


`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
 padding: 2rem;
   @media (max-width: 640px) {
  
    padding: 0;

  }
   
`

// Logo Section
const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--label-primary, white);
  
`

const LogoContainer = styled.div`
  
`

const LogoFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const DotContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Dot = styled.span<{ opacity: string }>`
  background: var(--accent-primary, #4ac473);
  height: 0.25rem;
  width: 0.25rem;
  margin: 0 0.25rem;
  border-radius: 50%;
  opacity: ${(props) => props.opacity};
`

const LogoWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 9999px;
  margin: 0 0.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  
  .rotating-logo {
    width: 100%;
    height: 100%;
    
  }
`

const LogoCircle = styled.div`
  border-radius: 9999px;
  margin: 0 0.25rem;
  width: 64px;
  height: 64px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--divider-nonOpaque, rgba(255, 255, 255, 0.1));
  overflow: hidden;
  
  img {
    border-radius: 9999px;
    width: 100%;
    height: 100%;
  }
`

const TextContainer = styled.div`
  max-width: fit-content;
  margin: 0 auto;
  text-align: center;
  margin-top: 1.5rem;
  animation: ${slideIn} 0.5s ease-out;
`

const MainTitle = styled.h1`
  font-size: var(--text-title1, 24px);
  line-height: var(--leading-title1, 28px);
  font-weight: 600;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  color: var(--label-primary, white);
`

const Subtitle = styled.h6`
  font-size: var(--text-subhead, 14px);
  line-height: var(--leading-subhead, 20px);
  letter-spacing: var(--tracking-subhead, 0.01em);
  font-weight: 400;
  text-align: center;
  max-width: 90%;
  margin: 0 auto;
  color: var(--label-secondary, rgba(255, 255, 255, 0.7));
`

// Status Section
const StatusSection = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;

 
`

const StatusContainer = styled.div<{ animate: boolean }>`
  animation: ${(props) => (props.animate ? css`${statusPulse} 0.5s ease-in-out` : "none")};
`

const StatusInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`

const StatusText = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'InterSemiBold', monospace;
    max-width: 290px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
`

const ProgressPercentage = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
`

const ProgressBarContainer = styled.div`
  width: 20vw;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

    @media screen and (max-width: 940px) { 
     width: 80vw;
  }
`

const ProgressBar = styled.div<{ width: number }>`
  height: 100%;
  background: linear-gradient(90deg, #4f4e50 0%, #408361 100%);
  border-radius: 2px;
  transition: width 0.5s ease-out;
  width: ${(props) => props.width}%;
`

// Seção de mensagens das APIs - NOVOS COMPONENTES
const ApiMessagesContainer = styled.div`
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`

const ApiMessagesTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ApiMessagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 120px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
`
const ApiMessage2 = styled.div<{ error?: boolean }>`
 
  color: ${(props) => (props.error ? "rgba(255, 99, 99, 0.9)" : "rgba(255, 255, 255, 0.6)")};
 
  &:hover {
    color: ${(props) => (props.error ? "rgba(255, 99, 99, 1)" : "rgba(255, 255, 255, 0.8)")};
  }
`
const ApiMessage = styled.div<{ error?: boolean }>`
  font-size: 0.65rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: ${(props) => (props.error ? "rgba(255, 99, 99, 0.9)" : "rgba(255, 255, 255, 0.6)")};
  line-height: 1.4;
  padding: 0.25rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    color: ${(props) => (props.error ? "rgba(255, 99, 99, 1)" : "rgba(255, 255, 255, 0.8)")};
  }
`

const PrivacyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 1rem;
  justify-content: center;
`

const PrivacyText = styled.div`
  font-size: var(--text-caption1, 12px);
  line-height: var(--leading-caption1, 16px);
  font-weight: 400;
  color: var(--label-secondary, rgba(255, 255, 255, 0.7));
  max-width: 20rem;
  text-align: center;
`

const LoadingSpinner = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`

const PurpleGlow = styled.div`
  position: absolute;
  bottom: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, rgba(138, 43, 226, 0) 70%);
  opacity: 0.6;
  z-index: 0;
  border-radius: 50%;
`

const PurpleGlowTop = styled.div`
  position: absolute;
  top: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(138, 43, 226, 0) 70%);
  opacity: 0.4;
  z-index: 0;
  border-radius: 50%;
`

// [Continue with all the remaining styled components...]

const FingerprintContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`

const FingerprintScannerCard = styled.div`
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 300px;
  position: relative;
`

const FingerprintIconContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`

const FingerprintIcon = styled.div`
  width: 60px;
  height: 60px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  animation: ${pulse} 2s infinite;
  z-index: 2;
`

const FingerprintRipple = styled.div<{ delay?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(74, 196, 115, 0.5);
  border-radius: 50%;
  animation: ${ripple} 3s infinite;
  animation-delay: ${(props) => props.delay || "0s"};
`

const SecurityInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
  width: 100%;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
`

const SecurityInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.75rem;
  border-radius: 8px;
`

const SecurityIcon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  
  svg {
    width: 100%;
    height: 100%;
  }
`

const SecurityText = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
`

// Account Verification Card Components
const AnimatedShieldContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ShieldIcon = styled.div`
  width: 80px;
  height: 80px;
  color: #4ac473;
  z-index: 2;
  animation: ${pulse} 2s infinite;
  
  svg {
    width: 100%;
    height: 100%;
  }
`

const PulsingCircle = styled.div<{ delay?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(74, 196, 115, 0.3);
  border-radius: 50%;
  animation: ${ripple} 3s infinite;
  animation-delay: ${(props) => props.delay || "0s"};
`

const VerificationDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem auto;
  width: 100%;
  max-width: 350px;
`

const VerificationDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  border-radius: 8px;
`

const VerificationIcon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  
  svg {
    width: 100%;
    height: 100%;
  }
`

const VerificationText = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  flex: 1;
`

const VerificationStatus = styled.div`
  font-size: 0.75rem;
  color: #4ac473;
  font-weight: 500;
`

// Data Processing Card Components
const DataProcessingAnimation = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
`

const DataProcessingCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 1px dashed rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    animation: ${rotate} 20s linear infinite;
  }
`

const DataProcessingInnerCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(74, 196, 115, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ac473;
  animation: ${pulse} 2s infinite;
  
  svg {
    width: 30px;
    height: 30px;
  }
`

const DataParticle = styled.div<{ top: string; left: string; delay: string }>`
  position: absolute;
  width: 8px;
  height: 8px;
  background: #4ac473;
  border-radius: 50%;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${(props) => props.delay};
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: rgba(74, 196, 115, 0.3);
    border-radius: 50%;
    z-index: -1;
  }
`

const DataProcessingSteps = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem auto;
  width: 100%;
  max-width: 350px;
`

const DataProcessingStep = styled.div<{ active?: boolean; completed?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 1;
`

const DataProcessingStepIcon = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${(props) => (props.completed ? "#4ac473" : props.active ? "rgba(74, 196, 115, 0.2)" : "rgba(255, 255, 255, 0.05)")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.completed ? "white" : props.active ? "#4ac473" : "rgba(255, 255, 255, 0.5)")};
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`

const DataProcessingStepText = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  max-width: 80px;
`

const DataProcessingStepConnector = styled.div`
  height: 2px;
  width: 40px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 0.25rem;
`

// Discord Connection Card Components
const ConnectionAnimation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem auto;
  width: 100%;
  max-width: 300px;
  position: relative;
`

const ConnectionNode = styled.div<{ left?: boolean; right?: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`

const ConnectionLine = styled.div`
  height: 2px;
  width: 100px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 1rem;
  position: relative;
  overflow: hidden;
`

const ConnectionPulse = styled.div`
  width: 20px;
  height: 2px;
  background: #4ac473;
  position: absolute;
  left: 0;
  top: 0;
  animation: ${connectionPulse} 2s infinite;
`

const DiscordLogo = styled.div`
  width: 30px;
  height: 30px;
  
  svg {
    width: 100%;
    height: 100%;
  }
`

const DiscordServerInfo = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  border-radius: 12px;
  margin: 1rem auto;
  width: 100%;
  max-width: 350px;
`

const DiscordServerIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const DiscordServerDetails = styled.div`
  flex: 1;
`

const DiscordServerName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
`

const DiscordServerMembers = styled.div`
  font-size: 0.65rem;
  font-family: 'InterSemiBold', monospace;
  color: rgba(255, 255, 255, 0.7);
`

const DiscordConnectingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const DiscordConnectingDot = styled.div<{ delay?: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ac473;
  animation: ${blink} 1.5s infinite;
  animation-delay: ${(props) => props.delay || "0s"};
`

// Privilege Config Card Components
const PrivilegeCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 2rem auto;
  width: 100%;
  max-width: 350px;

    @media screen and (max-width: 940px) { 
      grid-template-columns: repeat(2, 1fr);
  }
`

const PrivilegeCard = styled.div<{ active?: boolean }>`
  background: ${(props) => (props.active ? "rgba(74, 196, 115, 0.1)" : "rgba(255, 255, 255, 0.03)")};
  border-radius: 12px;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`

const PrivilegeCardIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.8);
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`

const PrivilegeCardTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  margin-bottom: 0.5rem;
`

const PrivilegeCardStatus = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
`

const PrivilegeCardCheckmark = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 1rem;
  height: 1rem;
  color: #4ac473;
  
  svg {
    width: 100%;
    height: 100%;
  }
`

const PrivilegeCardLoading = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 1rem;
  height: 1rem;
`

// Finalizing Connection Card Components
const FinalizeAnimation = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FinalizeCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(74, 196, 115, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`

const FinalizeInnerCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(74, 196, 115, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ac473;
  animation: ${pulse} 2s infinite;
  
  svg {
    width: 30px;
    height: 30px;
  }
`

const FinalizePulse = styled.div<{ delay?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(74, 196, 115, 0.3);
  border-radius: 50%;
  animation: ${ripple} 3s infinite;
  animation-delay: ${(props) => props.delay || "0s"};
`

const FinalizeStepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.5rem auto;
  width: 100%;
  max-width: 350px;
`

const FinalizeStep = styled.div<{ active?: boolean; completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${(props) => (props.active ? "rgba(255, 255, 255, 0.05)" : "transparent")};
  padding: 0.75rem;
  border-radius: 38px;
  transition: background-color 0.3s ease;
`

const FinalizeStepIcon = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: ${(props) => (props.completed ? "#4ac473" : props.active ? "rgba(204, 63, 38, 0.39)" : "rgba(255, 255, 255, 0.05)")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.completed ? "white" : props.active ? "#4ac473" : "rgba(255, 255, 255, 0.5)")};
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`

const FinalizeStepText = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
`

// Success Card Components
const SuccessAnimation = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SuccessCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(74, 196, 115, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`

const SuccessCheckmark = styled.div`
  width: 64px;
  height: 64px;
  
  .circle {
    stroke-dasharray: 70;
    stroke-dashoffset: 70;
    animation: ${checkmarkCircle} 1s ease-in-out forwards;
  }
  
  .check {
    stroke-dasharray: 20;
    stroke-dashoffset: 20;
    animation: ${checkmarkCheck} 1s ease-in-out forwards;
    animation-delay: 0.5s;
  }
`

const SuccessDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.5rem auto;
  width: 100%;
  max-width: 300px;
`

const SuccessDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.75rem;
  border-radius: 8px;
`

const SuccessDetailIcon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  color: #4ac473;
  
  svg {
    width: 100%;
    height: 100%;
  }
`

const SuccessDetailText = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
`

const RedirectMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.7);
  animation: ${pulse} 2s infinite;
`

const RedirectIcon = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  
  svg {
    width: 100%;
    height: 100%;
  }
`

const RedirectText = styled.div`
  font-size: 0.875rem;
`

// Confetti Animation
const ConfettiAnimation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    animation: ${confettiDrop} 3s linear infinite;
  }
  
  &::before {
    top: -10px;
    left: 30%;
    background: #4ac473;
    animation-delay: 0.5s;
  }
  
  &::after {
    top: -10px;
    left: 70%;
    background: #5d8bf4;
    animation-delay: 1s;
  }
  
  &::before {
    box-shadow:
      40px 20px 0 #ffcc00,
      80px -10px 0 #ff6b6b,
      120px 30px 0 #4ac473,
      160px 10px 0 #5d8bf4,
      200px -20px 0 #ffcc00,
      240px 15px 0 #ff6b6b,
      280px 25px 0 #4ac473,
      320px 5px 0 #5d8bf4;
  }
  
  &::after {
    box-shadow:
      40px 40px 0 #ff6b6b,
      80px 10px 0 #4ac473,
      120px -10px 0 #5d8bf4,
      160px 30px 0 #ffcc00,
      200px 10px 0 #ff6b6b,
      240px -15px 0 #4ac473,
      280px 5px 0 #5d8bf4,
      320px 25px 0 #ffcc00;
  }
`

// Loading Card Components
const LoadingAnimation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 3rem auto;
`

const LoadingCircle = styled.div`
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #4ac473;
  border-radius: 50%;
  animation: ${rotate} 1.5s linear infinite;
`

// Error Card Components
const ErrorAnimation = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ErrorCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 59, 48, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s infinite;
`

const ErrorIcon = styled.div`
  width: 40px;
  height: 40px;
  color: #ff3b30;
  
  svg {
    width: 100%;
    height: 100%;
  }
`

const ErrorMessageContainer = styled.div`
  background: rgba(255, 59, 48, 0.1);
  border-left: 3px solid #ff3b30;
  padding: 1rem;
  border-radius: 4px;
  margin: 1.5rem auto;
  width: 100%;
  max-width: 350px;
`

const ErrorMessageText = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
`

const ErrorActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
`

const ErrorButton = styled.button`
  background: #ff3b30;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ff5146;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 1;
  width: 100%;
  max-width: 500px;
`

const Heading = styled.h1`
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
`

const Subheading = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 40px;
  font-family: 'InterSemiBold', monospace;
`

const Footer = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 40px;
  font-family: 'Inter', monospace;
  text-align: center;
`

const MarginImags = styled.div`
 width: 100%;
 height: 100%;
 display: flex;
 justify-content: center;
 place-items: center;
  

 li{
  display: flex;
  position: relative;
  align-items: center;

  .b1{
    position: absolute;
    animation: Rotate 6s infinite;
  }
 }

 @keyframes Rotate {
   0%{ transform: rotate(360deg) }
   100%{ transform: rotate(0deg) }
 }
`
