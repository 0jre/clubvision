"use client"

import styled, { css, keyframes } from "styled-components"
import {
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Check,
  LoaderCircle,
  Shield,
  Lock,
  Info,
  Copy,
  RefreshCw,
  Settings,
} from "lucide-react"
import IconCode from "@/public/icons/password.png"
import Image from "next/image"
import axios from "axios"
import type React from "react"
import { useEffect, useState } from "react"
import Lockds from "@/public/icons/lockds.png"
import copy from "clipboard-copy"
import { useSettings } from "@/hooks/settings"
import { SettingsSwitch } from "@/accounts/settings/settings-modal"
import ROUTENVX from "@/routes/routes"
import router from 'next/router';
import { nvxre_checkAuthentication } from "@/hooks/checkAuthentication"
import { UserData } from "@/types/user/types"
import Isecurity_wallet from "./x/request"

interface Props {
  user: any
}

interface UserInfo {
  _id: string
  name: string
  authorizationCode: string
  IsafeSecurity: boolean
}

export default function IsecurityPage({ user }: Props) {
  const { settings, updateSetting } = useSettings()
  const [authorizationCode, setAuthorizationCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewpin, setpin] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [userInfo, setUserInfo] = useState<UserInfo[]>([])
  const [page, setpage] = useState(0)
  const [pin, setPin] = useState<string[]>(Array(6).fill(""))
  const [showPin, setShowPin] = useState(false)
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [CodeView, setCodeView] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true);

  const isSecurityEnabled = settings?.wallet?.isecurity || false

  const handlePinChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)

    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`)
      prevInput?.focus()
    }
  }


  
  useEffect(() => {
    fetchUserAuthCode()
   }, [user])
   
  const handleSubmit = async () => {
    const fullPin = pin.join("")

    if (fullPin.length !== 6) {
      setStatus("error")
      setErrorMessage("Por favor, insira todos os 6 dígitos.")
      return
    }

    try {
      const response = await axios.post("/api/nvxre/verifyaccountcode", {
        discordUserId: user.id,
        authorizationCode: fullPin,
      })

      if (response.status === 200) {
        setStatus("success")
        setErrorMessage("")
        fetchUserAuthCode()
      } else {
        setStatus("error")
        setErrorMessage("Erro ao registrar o código.")
      }
    } catch (error) {
      console.error("Erro ao enviar código:", error)
      setStatus("error")
      setErrorMessage("Falha ao registrar o código.")
    }
  }

  const resetForm = () => {
    setPin(Array(6).fill(""))
    setStatus("idle")
    setErrorMessage("")
    document.getElementById("pin-0")?.focus()
  }

  const fetchUserAuthCode = async () => {
  
    try {
      const response = await axios.get(`/api/nvxre/codeims/updateCodeVerified/${user.id}`)
      const data = response.data

      if(data.authorizationCode || !data.authorizationCode) {
 setUserInfo([
          {
            _id: user.id,
            name: user.name || "",
            authorizationCode: data.authorizationCode,
            IsafeSecurity: isSecurityEnabled,
          },
        ])
  
      }
      
    } catch (error) {
      console.error("Error fetching user auth code:", error)
      setError("Error fetching user information")
     
    } 
  } 

    


  const handleSwitchChange = async () => {
    try {
      await updateSetting("wallet", "isecurity", !isSecurityEnabled)
    } catch (error) {
      console.error("Error updating IsafeSecurity:", error)
    }
      await fetchUserAuthCode()
  }

  const generateAuthorizationCode = async () => {
    if (isGenerating || !user) return

    setIsGenerating(true)
    setpage(0)

    try {
      setCountdown(180)

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 0) {
            clearInterval(timer)
            setIsGenerating(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      const response = await axios.post("/api/nvxre/verifyaccountcode", {
        discordUserId: user.id,
      })

      setAuthorizationCode(response.data.code)
      setError(null)
      fetchUserAuthCode()
    } catch (err) {
      setError("Erro ao gerar código de autorização")
      setAuthorizationCode(null)
      setIsGenerating(false)
    }
  }

  const handleCopy = async (textToCopy: string) => {
    try {
      await copy(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Erro ao copiar:", error)
    }
  }

  const splitDigits = (code: string | number) => {
    if (typeof code !== "string") {
      code = String(code)
    }
    return code.split("").map((digit: string, index: number) => (
      <DigitCard key={index} className={viewpin ? "visible" : "hidden"}>
        <DigitText>{digit}</DigitText>
      </DigitCard>
    ))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <MainContainer>
     <Isecurity_wallet active={true} classname='min-h-[50vh]'>  
      <HeaderSection>
        <HeaderIcon>
          <Shield size={18} color="#46da5a" />
        </HeaderIcon>
        <HeaderContent>
          <HeaderTitle>iSecurity - Autenticação Multifatorial</HeaderTitle>
          <HeaderDescription>
            Adicione uma camada extra de segurança à sua conta com autenticação de dois fatores. O iSecurity protege
            suas informações pessoais e garante que apenas você tenha acesso à sua conta.
          </HeaderDescription>
        </HeaderContent>
      </HeaderSection>

     

      {userInfo.map((user) => (
        <div key={user._id}>

        {/* <SettingsCard>
        <SettingsHeader>
          <SettingsIcon>
            <Settings size={16} color="#46da5a" />
          </SettingsIcon>
          <SettingsContent>
            <SettingsTitle>Ativar iSecurity</SettingsTitle>
            <SettingsDescription>
              Quando ativado, você precisará inserir um código de 6 dígitos para acessar sua conta
            </SettingsDescription>
          </SettingsContent>
        </SettingsHeader>
        <SettingsToggle>
          <SettingsSwitch checked={isSecurityEnabled} onChange={handleSwitchChange} id={"isecurity"} />
        </SettingsToggle>
      </SettingsCard>  */}

          {CodeView && (
            <ModalOverlay>
              <ModalContainer>
                <ModalHeader>
                  <StatusIndicator>
                    <StatusIcon>
                      {isGenerating ? (
                        <LoaderCircle size={20} className="spinning" />
                      ) : (
                        <Shield size={20} color="#46da5a" />
                      )}
                    </StatusIcon>
                    <StatusText>{isGenerating ? `Expira em ${formatTime(countdown)}` : "VISIONID Ativo"}</StatusText>
                  </StatusIndicator>

                  <ActionButtons>
                    <ActionButton onClick={() => ( setCodeView(false), setpage(0) )} variant="close">
                      ×
                    </ActionButton>
                    <ActionButton onClick={() => setpin(!viewpin)} variant="secondary">
                      {viewpin ? <EyeOff size={18} /> : <Eye size={18} />}
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleCopy(user.authorizationCode)}
                      variant="secondary"
                      className={copied ? "success" : ""}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </ActionButton>
                    {/* <ActionButton onClick={generateAuthorizationCode} disabled={isGenerating} variant="primary">
                      {isGenerating ? <LoaderCircle size={18} className="spinning" /> : <RefreshCw size={18} />}
                    </ActionButton> */}
                    <ActionButton onClick={() => setpage(1)} variant="secondary">
                      <Lock size={18} />
                    </ActionButton>
                  </ActionButtons>
                </ModalHeader>

                <ModalContent>
                  {(!user.authorizationCode  || page === 1) && (
                    <PinSetupContainer>
                      <PinSetupCard>
                        <PinSetupHeader>
                          <PinSetupTitle>Configurar Senha de Segurança</PinSetupTitle>
                          <PinSetupDescription>
                            Crie uma senha numérica de 6 dígitos para proteger sua conta
                          </PinSetupDescription>
                        </PinSetupHeader>

                        <PinSetupContent>
                          {status === "idle" && (
                            <>
                              <PinInputContainer>
                                {pin.map((digit, index) => (
                                  <PinInputField
                                    key={index}
                                    id={`pin-${index}`}
                                    type={showPin ? "text" : "password"}
                                    value={digit}
                                    onChange={(e) => handlePinChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    maxLength={1}
                                    autoComplete="off"
                                    className={digit ? "filled" : ""}
                                  />
                                ))}
                              </PinInputContainer>

                              <ToggleVisibility>
                                <ToggleButton onClick={() => setShowPin(!showPin)}>
                                  {showPin ? (
                                    <>
                                      <EyeOff size={16} /> Ocultar senha
                                    </>
                                  ) : (
                                    <>
                                      <Eye size={16} /> Mostrar senha
                                    </>
                                  )}
                                </ToggleButton>
                              </ToggleVisibility>
                            </>
                          )}


                        

                          {status === "error" && (
                            <StatusMessage type="error">
                              <AlertCircle size={20} />
                              <span>{errorMessage}</span>
                            </StatusMessage>
                          )}

                          {status === "success" && (
                            <StatusMessage type="success">
                              <CheckCircle size={20} />
                              <span>Senha cadastrada com sucesso!</span>
                            </StatusMessage>
                          )}
                        </PinSetupContent>

                        <PinSetupFooter>
                          {status === "idle" || status === "error" ? (
                            <SubmitButton onClick={handleSubmit}>Cadastrar Senha</SubmitButton>
                          ) : (
                            <SubmitButton onClick={resetForm} variant="secondary">
                              Criar Nova Senha
                            </SubmitButton>
                          )}
                        </PinSetupFooter>
                      </PinSetupCard>
                    </PinSetupContainer>
                  )}

                     {page === 0 && (
                            <>
                            <CodeDisplayContainer>
                      <CodeDisplayHeader>
                        <CodeDisplayTitle>Seu Código de Segurança</CodeDisplayTitle>
                        <CodeDisplayDescription>Use este código quando solicitado pelo sistema</CodeDisplayDescription>
                      </CodeDisplayHeader>

                      <CodeDigitsContainer>
                        {splitDigits(viewpin ? user.authorizationCode : "******")}
                      </CodeDigitsContainer>
                    </CodeDisplayContainer>
                            </>
                          )}
                </ModalContent>

                <ModalFooter>
                  <SecurityNotice>
                    <Info size={16} />
                    <div>
                      <NoticeTitle>Importante:</NoticeTitle>
                      <NoticeText>
                        Mantenha este código em segurança. A equipe do TheNoVision nunca solicitará esta informação
                        diretamente. Salve ou memorize este código para futuras autenticações.
                      </NoticeText>
                    </div>
                  </SecurityNotice>
                </ModalFooter>
              </ModalContainer>
            </ModalOverlay>
          )}

          
        </div>
      ))}

       {isSecurityEnabled ? (
            !CodeView && (
              <SecurityActiveContainer>
                <SecurityCard onClick={() => setCodeView(true)}>
                  <SecurityCardHeader>
                    <SecurityIcon>
                      <Image src={IconCode || "/placeholder.svg"} alt="Security Code" width={34} height={34} />
                    </SecurityIcon>
                    <SecurityStatus>
                      <Shield size={16} color="#46da5a" />
                      <span>Ativo</span>
                    </SecurityStatus>
                  </SecurityCardHeader>

                  <CodePreview>{splitDigits("******")}</CodePreview>

                
                </SecurityCard>

                <InfoCard>
                  <InfoHeader>
                    <Info size={20} color="#46da5a" />
                    <InfoTitle>Como funciona o iSecurity</InfoTitle>
                  </InfoHeader>

                  <InfoContent>
                    <InfoText>
                      O iSecurity é um método de autenticação pessoal que utiliza uma senha exclusiva criada por você.
                      Sempre que necessário, o sistema solicitará essa senha como uma etapa obrigatória para liberar o
                      acesso.
                    </InfoText>

                    <InfoFeatures>
                      <Feature>
                        <CheckCircle size={16} color="#46da5a" />
                        <span>Proteção contra acessos não autorizados</span>
                      </Feature>
                      <Feature>
                        <CheckCircle size={16} color="#46da5a" />
                        <span>Código único de 6 dígitos</span>
                      </Feature>
                      <Feature>
                        <CheckCircle size={16} color="#46da5a" />
                        <span>Ativação automática no login</span>
                      </Feature>
                    </InfoFeatures>

                    <InfoNote>
                      <AlertCircle size={16} color="#f59e0b" />
                      <span>
                        Certifique-se de que suas DMs estão habilitadas para receber mensagens, pois algumas
                        comunicações importantes serão enviadas por lá.
                      </span>
                    </InfoNote>
                  </InfoContent>
                </InfoCard>
              </SecurityActiveContainer>
            )
          ) : (
            <SecurityDisabledContainer>
              <DisabledIcon>
                <Image src={Lockds || "/placeholder.svg"} alt="Security Disabled" height={80} width={80} />
              </DisabledIcon>
              <DisabledTitle>iSecurity Desativado</DisabledTitle>
              <DisabledDescription>
                Ative o iSecurity para adicionar uma camada extra de proteção à sua conta
              </DisabledDescription>

              <SettingsDn onClick={() => router.push(ROUTENVX.settingswallet)}>Ativar o Isecurity na conta</SettingsDn>
            </SecurityDisabledContainer>
          )}
          </Isecurity_wallet>
    </MainContainer>
  )
}

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

const MainContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
 
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${fadeIn} 0.6s ease-out;
`

const HeaderSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(36, 37, 36, 0.1) 0%, rgba(63, 65, 63, 0.329) 100%);
  margin: 8px;
  border-radius: 16px;
`

const HeaderIcon = styled.div`
  padding: 6px;
  background: rgba(70, 218, 90, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderContent = styled.div`
  flex: 1;
`

const HeaderTitle = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #46da5a;
  margin: 0 0 8px 0;
`

const HeaderDescription = styled.p`
  font-size: 12px;
  font-family: 'ProximaNova-Italic', sans-serif;
  color: #727973;
  line-height: 1.5;
  margin: 0;
`

const SettingsCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
 
  border-radius: 16px;
  transition: all 0.3s ease;
 
`

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`

const SettingsIcon = styled.div`
  padding: 10px;
  background: rgba(70, 218, 90, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SettingsContent = styled.div`
  flex: 1;
`

const SettingsTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #dddfe6;
  margin: 0 0 4px 0;
`

const SettingsDescription = styled.p`
  font-size: 13px;
  color: rgba(81, 81, 82, 0.8);
  margin: 0;
  line-height: 1.4;
  font-family: 'ProximaNova-Italic', sans-serif;
`
const SettingsDn = styled.button`
  font-size: 13px;
  color: rgba(127, 223, 159, 0.8);
  margin: 0;
  text-decoration: underline;
  line-height: 1.4;
  font-family: 'ProximaNova-Italic', sans-serif;
`
const SettingsToggle = styled.div`
  display: flex;
  align-items: center;
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease-out;
`

const ModalContainer = styled.div`
 background: linear-gradient(135deg, rgba(36, 37, 36, 0.034) 0%, rgba(63, 65, 63, 0.11) 100%); background: linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f);

  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${fadeIn} 0.4s ease-out;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
 
`

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const StatusIcon = styled.div`
 
  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`

const StatusText = styled.span`
  font-family: 'XcSemibold', sans-serif;
  font-size: 15px;
  text-transform: uppercase;
  color: #dddfe6;
`

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ActionButton = styled.button<{ variant?: "primary" | "secondary" | "close" }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
   cursor: var(--f-cursor-pointer);
  transition: all 0.2s ease;
  
  ${(props) => {
    switch (props.variant) {
      case "primary":
        return css`
          background: #46da5a;
          color: #000;
          &:hover { background: #37b868; }
          &:disabled { background: #2a4a2f; color: #666; cursor: not-allowed; }
        `
      case "close":
        return css`
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          font-size: 20px;
          font-weight: bold;
          &:hover { background: rgba(239, 68, 68, 0.2); }
        `
      default:
        return css`
          background: rgba(255, 255, 255, 0.1);
          color: #cababa;
          &:hover { background: rgba(255, 255, 255, 0.15); }
        `
    }
  }}

  &.success {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
  }

  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`

const ModalContent = styled.div`
  padding: 24px;
`

const PinSetupContainer = styled.div`
  width: 100%;
`

const PinSetupCard = styled.div`
  background: rgba(65, 75, 92, 0.048);

  border-radius: 16px;
  overflow: hidden;
`

const PinSetupHeader = styled.div`
  padding: 24px 24px 0;
  text-align: center;
`

const PinSetupTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #dde2e0;
  margin: 0 0 8px 0;
`

const PinSetupDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
`

const PinSetupContent = styled.div`
  padding: 16px 24px;
`

const PinInputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
`

const PinInputField = styled.input`
   width: 40px;
  height: 40px;
  text-align: center;
  background-color: rgba(87, 85, 105, 0.068);
  font-size: 21px;
  margin: 5px;
  border: 2px solid rgba(252, 252, 255, 0.11);
  border-radius: 12px;
  outline: none;
  color: white;
 
  transition: all 0.3s ease;

  &:focus {
    border-color: #46da5a;
    box-shadow: 0 0 0 3px rgba(70, 218, 90, 0.2);
    transform: scale(1.05);
  }

  &.filled {
    border-color: #46da5a;
    background-color: rgba(70, 218, 90, 0.1);
  }
`

const ToggleVisibility = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  color: #6b7280;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 14px;
  cursor: var(--f-cursor-pointer);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #9ca3af;
  }
`

const StatusMessage = styled.div<{ type: "error" | "success" }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.3s ease-out;
  
  ${(props) =>
    props.type === "error"
      ? css`
    background: rgba(239, 68, 68, 0.055);
     
    color: #ef4444;
  `
      : css`
    background: rgba(34, 197, 94, 0.048);
 
    color: #22c55e;
  `}

  span {
    font-weight: 500;
    font-size: 14px;
  }
`

const PinSetupFooter = styled.div`
  padding: 16px 24px 24px;
`

const SubmitButton = styled.button<{ variant?: "secondary" }>`
  width: 100%;
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
   cursor: var(--f-cursor-pointer);
  transition: all 0.2s ease;
  font-family: 'ProximaNova-Italic', sans-serif;
  
  ${(props) =>
    props.variant === "secondary"
      ? css`
    background: rgba(255, 255, 255, 0.1);
    color: #dddfe6;
    &:hover { background: rgba(255, 255, 255, 0.15); }
  `
      : css`
    background: #46da5a1c;
    color: #c7d6cc;
    &:hover { background: #37b868; transform: translateY(-1px); }
  `}
`

const CodeDisplayContainer = styled.div`
  text-align: center;
`

const CodeDisplayHeader = styled.div`
  margin-bottom: 32px;
  font-family: 'ProximaNova-Italic', monospace;

`

const CodeDisplayTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #dde2e0;
  margin: 0 0 8px 0;
`

const CodeDisplayDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`

const CodeDigitsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
`

const DigitCard = styled.div`
 
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: 50px;
  height: 50px;
  text-align: center;
  background-color: rgba(35, 37, 36, 0.068);
  font-size: 21px;
  border: 2px solid rgba(252, 252, 255, 0.11);
  border-radius: 12px;
  color: #bcc9be;
  &.visible {
    animation: ${pulse} 2s infinite;
  }
  
  &.hidden {
   background-color: rgba(48, 39, 39, 0.61);
    border-color: rgba(255, 255, 255, 0.1);
      color: #802f33;
  }
`

const DigitText = styled.span`
  font-size: 16px;
  font-weight: 700;
 
  font-family: 'Courier New', monospace;
`

const ModalFooter = styled.div`
  padding: 0 24px 24px;
`

const SecurityNotice = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(65, 75, 92, 0.048);
  font-family: 'ProximaNova-Italic', monospace;
  border-radius: 12px;
  color: #a8b1be;
`

const NoticeTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
`

const NoticeText = styled.div`
  font-size: 13px;
  line-height: 1.4;
  opacity: 0.9;
`

const SecurityActiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const SecurityCard = styled.div`
background: linear-gradient(135deg, rgba(36, 37, 36, 0.034) 0%, rgba(35, 36, 35, 0.11) 100%);

  border-radius: 12px;
  padding: 24px;
  cursor: var(--f-cursor-pointer);
  transition: all 0.3s ease;
  text-align: center;


`

const SecurityCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`

const SecurityIcon = styled.div`
  
`

const SecurityStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(70, 218, 90, 0.062);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #46da5a;
`

const CodePreview = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
`

const ViewCodeButton = styled.div`
  padding: 12px 24px;
  background: rgba(70, 218, 90, 0.062);

  border-radius: 32px;
  color: #6d9e74;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(70, 218, 90, 0.2);
  }
`

const InfoCard = styled.div`
background: linear-gradient(135deg, rgba(36, 37, 36, 0.034) 0%, rgba(63, 65, 63, 0.11) 100%);
  border-radius: 12px;
  padding: 14px;
`

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`

const InfoTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #dddfe6;
  margin: 0;
`

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
    font-family: 'ProximaNova-Italic', sans-serif;
`

const InfoText = styled.p`
  font-size: 14px;
  color: #9ca3af;
  line-height: 1.6;
  margin: 0;
`

const InfoFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #d1d5db;
`

const InfoNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(245, 159, 11, 0.055);
  font-family: 'ProximaNova-Italic', sans-serif;
  border-radius: 12px;
  font-size: 13px;
  color: #fbbf24;
  line-height: 1.5;
`

const SecurityDisabledContainer = styled.div`

  border: 2px solid rgba(43, 46, 44, 0.822);
  border-radius: 20px;
  padding: 40px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;  
  gap: 16px;
`

const DisabledIcon = styled.div`
  opacity: 0.6;
  filter: grayscale(100%);
`

const DisabledTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
`

const DisabledDescription = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin: 0;
  max-width: 400px;
  line-height: 1.5;
`
