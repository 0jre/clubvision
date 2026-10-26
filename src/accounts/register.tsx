"use client"

import { DashboardStyle } from "@/styles/Globalstyleview"
import styled, { keyframes } from "styled-components"
import type { User } from "@/types/user/types"
import ROUTENVX from "@/routes/routes"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import type { UserInfo } from "@/types/discord/usersearch"
import type React from "react"
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { withSession, type NextIronRequest } from "@/lib/session"
import io from "socket.io-client"
import LoadingPageView from "@club/resources/loading"

import { decrypt } from "@/core/security/encryption"
import NotificationUI from "@club/components/notification/card.mnc"
import axios from "axios"
import HeadGlobal from "@/club/head/glob.n"
import IconIo from "@/public/nvrp/nvrp_bc.png"
import { TheNoVisionRoute } from "@/lib/session/redirects"
import * as Dialog from "@radix-ui/react-dialog"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { motion } from "framer-motion"
import ReactPlayer from "react-player"
import PricingCards from "@/club/.prime/premium/price.prime"
import { useSoundEffects } from "@/lib/services/mox/elements.sounds"
import Scrollmargin from "@/components/scrollingcard/scroll.xc"
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData"

interface Props {
  user: User | null
}

interface CharacterImage {
  charimage?: React.ReactNode
  charimagehover?: React.ReactNode
}

interface Propt {
  ScriptText: string
}

interface Nas {
  link: string
  children: React.ReactNode
}

const TypedText: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, currentIndex))
      currentIndex++
      if (currentIndex > text.length) clearInterval(interval)
    }, 100)

    return () => clearInterval(interval)
  }, [text])

  return <Text>{displayText}</Text>
}

const IndexPage: React.FC<Propt> = ({ ScriptText }) => {
  return (
    <ContainerText>
      <p>
        <TypedText text={ScriptText} />
      </p>
    </ContainerText>
  )
}

export default function RegisterAccount({ user }: Props) {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
 const { isLoadingx, userInfoObject, mutate } = GetInfo_nvxre_xyloQuerier();
    
   useEffect(() => {
    
  if (!isLoadingx && userInfoObject) {
    setUserInfo(userInfoObject);

    setLoading(false);
    }
  }, [isLoadingx, userInfoObject]);

// Função para tocar sons
const playSound = (soundFile: string) => {
  const audio = new Audio(soundFile);
  audio.volume = 0.3; // Volume baixo para não ser intrusivo
  audio.play().catch(e => console.log('Audio play failed:', e));
};

 
  useEffect(() => {
    if (!loading && userInfo?.userId) {
      router.push(ROUTENVX.signin)
    }
  }, [userInfo])

  const [isFormRegistered, setIsFormRegistered] = useState(false)

  const [isOpenModal0, setisOpenModal0] = useState(true)
  const [isOpenModalPrime, setisOpenModalPrime] = useState(false)
  const [isOpenModaloP1, setModalOp1] = useState(false)
  const [isOpenModaloP, setModalOp] = useState(false)
  const [isOpenModaloInfoCharacterGame, setModalOpInfoCharacterGame] = useState(false)
  const [currentStep, setCurrentStep] = useState(0) // Start with intro video

  // ...existing code...

const OpenMyname = (event: any) => {
  if (event.key !== "Enter") {
    playSound('/sounds/a_futuristic.mp3');
    setModalOp1(true)
    setCurrentStep(2)
  }
}

const Openprime = (event: any) => {
  if (event.key !== "Enter") {
    playSound('/sounds/a_futuristic.mp3');
    setisOpenModalPrime(true)
    setCurrentStep(5)
  }
}

const openModal = (event: any) => {
  if (event.key !== "Enter") {
    playSound('/sounds/a_futuristic.mp3');
    setModalOp(true)
    setCurrentStep(3)
  }
}

const OpenModalCharacterInfo = (event: any) => {
  if (event.key !== "Enter") {
    playSound('/sounds/a_futuristic.mp3');
    setModalOpInfoCharacterGame(true)
    setCurrentStep(4)
  }
}

const handlePremiumContinue = () => {
  playSound('/sounds/a_futuristic.mp3');
  setShowPremiumSuggestion(false)
    setShowFinalScreen(true)
  setCurrentStep(8)
}

 
const handleWelcomeComplete = () => {
  playSound('/sounds/a_futuristic.mp3');
  setShowWelcomeScreen(false)
 
  setCurrentStep(1)
 
}

// ...existing code...
const { playSoundz } = useSoundEffects();
  const [name, setname] = useState("")
  const [Idade, setIdade] = useState("")
  const [NameCharacter, setNameCharacter] = useState("")
  const [CharacterHistory, setCharacterHistory] = useState("")
  const [AboutCharacterx, setAboutCharacterx] = useState("")
  const [Twitter, setTwitter] = useState("")
  const [Instagram, setInstagram] = useState("")
  const [Tiktok, setTiktok] = useState("")
  const [BioLi, setBioLi] = useState("")
  const [firstname, setfirstname] = useState("")
  const [lastname, setlastname] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")

  const [inviteCode, setInviteCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [NotificationK, setNotificationK] = useState(false);

  const [charCount, setCharCount] = useState(0) // Estado para contador de caracteres

  const handleCharacterHistoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharacterHistory(e.target.value)
    setCharCount(e.target.value.length) // Atualiza o contador de caracteres
  }

  const handleCategoryChange = (selectedCategory: string) => {
    setAboutCharacterx(selectedCategory)
  }

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [dateOk, setDateOk] = useState<boolean>(false)

  const currentYear = new Date().getFullYear()
  const minimumYear = currentYear - 18

  const incrementYear = () => {
    if (year < minimumYear) {
      setYear((prevYear) => prevYear + 1)
    }
  }
  const decrementYear = () => setYear((prevYear) => prevYear - 1)

  const incrementMonth = () => setMonth((prevMonth) => (prevMonth < 12 ? prevMonth + 1 : 1))
  const decrementMonth = () => setMonth((prevMonth) => (prevMonth > 1 ? prevMonth - 1 : 12))

  const today = new Date()
  const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())

  useEffect(() => {
    if (selectedDay) {
      if (selectedDay <= minAgeDate) {
        setIdade(selectedDay.toLocaleDateString())
        setDateOk(false)
      } else {
        setNotificationMessage("A idade mínima é de 18 anos.")
        setIdade("")
        setDateOk(true)
        setSelectedDay(undefined)
      }
    }
  }, [selectedDay])

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDay(date)
      setIsModalOpen(false)
    }
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = Number.parseInt(e.target.value)
    if (newMonth >= 1 && newMonth <= 12) {
      setMonth(newMonth)
      if (selectedDay) {
        setSelectedDay(new Date(year, newMonth - 1, selectedDay.getDate()))
      }
    }
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = Number.parseInt(e.target.value)
    if (!isNaN(newYear)) {
      setYear(newYear)
      if (selectedDay) {
        setSelectedDay(new Date(newYear, month - 1, selectedDay.getDate()))
      }
    }
  }

  // Atualiza selectedDay se month ou year mudarem
  useEffect(() => {
    if (selectedDay) {
      setSelectedDay(new Date(year, month - 1, selectedDay.getDate()))
    }
  }, [month, year])

 
const [showWelcomeScreen, setShowWelcomeScreen] = useState(true)
  const [showPremiumSuggestion, setShowPremiumSuggestion] = useState(false)
  
  const [showFinalScreen, setShowFinalScreen] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const [Loadingxz, setLoadingxz]= useState(false)

  const handleStepBack = () => {
  playSound('/sounds/a_futuristic.mp3');
  setCurrentStep((prevStep) => Math.max(1, prevStep - 1));
}

  const handleFormSubmit = async (e: React.FormEvent) => {
     playSound('/sounds/a_futuristic.mp3');
    e.preventDefault()

    // Show loading animation
   setIsFormSubmitted(true)

    // Show premium suggestion after form submission
    setShowPremiumSuggestion(true)
    setCurrentStep(6) 
  }


  const handleRegistrationComplete = async () => {
    setLoadingxz(true)
    // Original form submission logic
    const trimmed =
      name +
      Idade +
      NameCharacter +
      CharacterHistory +
      AboutCharacterx +
      AboutCharacterx +
      Twitter +
      Instagram +
      Tiktok +
      BioLi.trim()

    if (!hasLetter(trimmed)) {
      setNotificationMessage("Tudo precisa estar bem configurado!")
      return
    }

    const formData = {
      userId: user?.id,
      name,
      firstname,
      lastname,
      Idade,
      Instagram,
      Twitter,
      Tiktok,
      BioLi,
      Character: AboutCharacterx,
      NameCharacter,
      CharacterHistory,
      limitipost: 10,
      maxlimitinvite: 120,
    }

    try {
      const response = await fetch("/api/autentic/savere", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setNotificationK(true)
         playSound('/sounds/Generateoftsat560009.mp3');
        setResponseMessage("Conta criada com sucesso!")
        setTimeout(() => {
          
          setNotificationK(false)  
          handleFormSubmit
        }, 3000)
        localStorage.setItem("formRegistered", "true")
        setIsFormRegistered(true)
      } else {
        // console.error("Erro ao salvar o registro:", await response.text())
        setNotificationK(true)
        setResponseMessage("Erro ao salvar o seu registro!")
        setTimeout(() => {
          setNotificationK(false)
        }, 5000)
      }
    } catch (error) {
      setNotificationK(true)
      setResponseMessage("Erro ao salvar o seu registro!")
      setTimeout(() => {
        setNotificationK(false)
      }, 5000)
    } 

    try {
      const response = await fetch("/api/nvxre/setnickname", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          nickname: name,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setNotificationMessage("Apelido alterado com sucesso!")
      } else {
        setNotificationMessage("Erro ao alterar o apelido.")
      }
    } catch (error) {
      // console.error("Erro na solicitação:", error)
    } finally {
       setLoadingxz(false)
       setShowPremiumSuggestion(true)
    setCurrentStep(6) 
    }
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    handleFormSubmit(e)
  }


 

const hasLetter = (text: string) => {
    // Verifica se o texto contém pelo menos uma letra
    return /[a-zA-Z]/.test(text);
  };

  
  const isAtLeast18 = (birthDate: Date): boolean => {
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
  
    // Ajuste a idade se o aniversário ainda não tiver ocorrido este ano
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
  
    return age >= 18;
  };

  const isFormValid = hasLetter(name) && hasLetter(firstname) && hasLetter(lastname) && selectedDay !== undefined && isAtLeast18(selectedDay);
    const isFormValidcharacter = hasLetter(AboutCharacterx);
    const isFormValid2 = hasLetter(BioLi) ;
    const isFormValid3 = hasLetter(NameCharacter) && hasLetter(CharacterHistory);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  
  
    const buttonStyleZ = {
      display: isFormValidcharacter? 'block' : 'none',
    };
  
    const buttonStyle = {
      display: isFormValid? 'block' : 'none',
    };
    const buttonStyl3e = {
      display: isFormValid2? 'block' : 'none',
    };
  
   const buttonStyl4e = {
      display: isFormValid3? 'block' : 'none',
    };

     const [isOpenCheck, setIsOpenCheck] = useState(false);
    
      const openModalCheck = () => {
        setIsOpenCheck(true)
      }


       const handleAuthorize = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch(`/api/redirect/authorization`, {
        method: 'POST',
        body: JSON.stringify({ discordUserId: user?.id, inviteCode }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(`Código de convite usado!`);
        setNotificationK(true);
        
        setTimeout(() => {
          setNotificationK(false)
        }, 5000);
     
        await handleGetOwnerInfo();
      } else {
        const data = await response.json();
        setResponseMessage(data.error);
        setNotificationK(true);
        setTimeout(() => {
          setNotificationK(false)
          }, 5000);
      }
    } catch (error) {
      setResponseMessage(`Algum Problema aconteceu aqui!`);
      setNotificationK(true);
      setTimeout(() => {
       setNotificationK(false)
      }, 5000);
      
    } finally {
      setIsVerifying(false);  
    }
  };

  
  

  const handleGetOwnerInfo = async () => {
    try {
      const response = await fetch(`/api/redirect/ownerinvite?inviteCode=${inviteCode}`);

      if (response.ok) {
        const data = await response.json();
        setOwnerInfo(data);
        setNotificationK(true);
      setResponseMessage('Proprietario do convite foi encontrado!');
      setTimeout(() => {
        setNotificationK(false)
      }, 5000);
      } else {
        const data = await response.json();
        setOwnerInfo(null);
        setTimeout(() => {
          setResponseMessage(data.error);
          setNotificationK(true)
        }, 5000);
      }
    } catch (error) {
      setOwnerInfo(null);
      setNotificationK(true);
      setResponseMessage('Erro ao buscar o proprietário.');
      setTimeout(() => {
        setNotificationK(false)
      }, 5000);
    }
  };



  return (
    <>

      <HeadGlobal Title="Regitro" />

      {user && (
        <>
          {!userInfo?.userId && ( 
            <>
              <ModalWrapper>
            
                {showWelcomeScreen && (
                  <FadeIncd >
                  <WelcomeScreen>
                    
                      <LogoContainer>
                        <Image src={'/nvrp/logonvrp.png'} alt="NoVision" width={150} height={150} />
                      </LogoContainer>
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      >
                        BEM-VINDO AO NOVISION
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                      >
                        Faça parte do que desafia as limitações. Seja diferente e mais ousado.
                      </motion.p>
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        onClick={() => {
                          playSoundz('click'),
                          handleWelcomeComplete()
                        }}
                      >
                        Começar
                      </motion.button>
                    
                     <motion.li
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8, duration: 0.8 }}
                        >
                      <h6>Ao continuar, você concorda com nossos <a href={ROUTENVX.terms}>Termos</a> e <a href={ROUTENVX.policy}>Política de Privacidade </a> e entende a regra da comunidade.</h6>
                     </motion.li>
                  </WelcomeScreen>

                    <CardCenter charimage={`/theim/chracters-c/novision.webp`} className='activeCard' >
                          <ul>
                           <li>
                       
                          </li>
                           </ul>
                          </CardCenter>
                  </FadeIncd>
                )}

                {showPremiumSuggestion && (
                  <ScreenContainer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <LogoContainer>
                      <Image src={'/nvrp/logonvrp.png'} alt="NoVision" width={100} height={100} />
                    </LogoContainer>
                 
                      <PricingCards />

                    <div className="fixed right-3 bottom-4">
                   
                      <button onClick={() => {
                        playSoundz('click'),
                        handlePremiumContinue()
                      }}>Continuar </button>
                    </div>
                  </ScreenContainer>
                )}

               

                {showFinalScreen && (
                  <div className="flex gap-1 align-top">
                  <WelcomeScreen >
                    <FadeIn
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                    > 
                    <LogoContainer>
                      <Image src={IconIo || "/placeholder.svg"} alt="NoVision" width={120} height={120} />
                    </LogoContainer>
                    <h1>SEJA NOVISION CLUB</h1>
                    <p>Faça parte do que desafia as limitações. Seja diferente e mais ousado.</p>
                    <button onClick={() => {playSoundz('click'), mutate()}}>{isLoadingx ? 'finalizando...' : 'Finalizar'}</button>
                    </FadeIn>
                  </WelcomeScreen>

                      
                  </div>
                )}
  

  
{!showFinalScreen && !showWelcomeScreen  && (
                <Bloy onSubmit={handleRegistration}>
                    
                  <NavRegs
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                    
                    >
                    
                    <CardInfouserI>
                      {currentStep > 1 && (
                        <ClickV onClick={handleStepBack} type="button">
                          <i className="fi fi-br-arrow-left" />
                        </ClickV>
                      )}
                    </CardInfouserI>

                    <Image src={"/nvrp/nvrp_bc.png"} alt={"thenovision"} height={45} width={45} />

                    <CardInfouserI>
                      {isOpenModal0 && (
                        <>
                          {currentStep === 1 && isOpenModal0 && (
                            <>
                              {AboutCharacterx ? (
                                <ClickV onClick={OpenMyname} style={buttonStyleZ} disabled={isFormSubmitted}>
                                  {isFormSubmitted ? (
                                    <i className="fi fi-rr-loading" />
                                  ) : (
                                    <i className="fi fi-br-arrow-right" />
                                  )}
                                </ClickV>
                              ) : (
                                <>
                                  {user && (
                                    <>
                                      <Image
                                        src={user.avatar || "https://i.imgur.com/mXit4fI.jpg"}
                                        alt={user.username}
                                        className="logor"
                                        height={40}
                                        width={40}
                                      />
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}

                      {CharacterHistory.length >= 1000 && currentStep === 2 && isOpenModaloP1 && (
                        <>
                          <ClickV onClick={openModal} style={buttonStyl4e} disabled={isFormSubmitted}>
                            {isFormSubmitted ? (
                              <i className="fi fi-rr-loading" />
                            ) : (
                              <i className="fi fi-br-arrow-right" />
                            )}
                          </ClickV>
                        </>
                      )}

                      {currentStep === 3 && isOpenModaloP && (
                        <>
                          <ClickV onClick={OpenModalCharacterInfo} style={buttonStyle} disabled={isFormSubmitted}>
                            {isFormSubmitted ? (
                              <i className="fi fi-rr-loading" />
                            ) : (
                              <i className="fi fi-br-arrow-right" />
                            )}
                          </ClickV>
                        </>
                      )}

                      {currentStep === 4 && isOpenModaloInfoCharacterGame && (
                        <>
                          <ClickV onClick={Openprime} style={buttonStyl3e} disabled={isFormSubmitted}>
                            {isFormSubmitted ? (
                              <i className="fi fi-rr-loading" />
                            ) : (
                              <i className="fi fi-br-arrow-right" />
                            )}
                          </ClickV>
                        </>
                      )}

                      {currentStep === 5 && isOpenModalPrime && (
                        <>
                          <ButtonSave
                            type="button"
                            onClick={() => { playSoundz('click'),handleRegistrationComplete()}}
                            style={buttonStyl4e}
                            disabled={isFormSubmitted}
                          >
                            {Loadingxz || isFormSubmitted ? (
                              <h4>Salvando...</h4>
                            ) : (
                              <>
                                <h4>Salvar </h4>
                              </>
                            )}
                          </ButtonSave>
                        </>
                      )}
                    </CardInfouserI>
                   
                  </NavRegs>
               
    
                  <FormContainer
                    initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      >
                    
                    <Carduserregister>
                      <ContainerPrime>
                        <ContentPrime>
                          <ul>
                            <Image
                              className="iconsM"
                              src={IconIo || "/placeholder.svg"}
                              alt={"icon"}
                              width={60}
                              height={50}
                            />

                            <li className="li">
                              <h2>ENTRE COM O PRIME ATIVO</h2>
                              <h3>Acesso ao clubvision e imersão completa e muito mais...</h3>
                            </li>
                          </ul>
                        </ContentPrime>
                      </ContainerPrime>
                      <ViewInfo>
                        {user && (
                          <ViewMarginProfile>
                            <XC>
                              <CenterMheader>
                                <HeaderMns
                                  bannerUrl={`https://cdn.discordapp.com/banners/${user.id}/${user.banner}?size=512`}
                                />
                              </CenterMheader>

                              <ProfileView>
                                {user && (
                                  <Image
                                    className="AvatarLogo"
                                    src={user.avatar || "/placeholder.svg"}
                                    alt={"eu"}
                                    height={100}
                                    width={100}
                                  />
                                )}
                              </ProfileView>
                            </XC>
                          </ViewMarginProfile>
                        )}
                        {user && (
                          <>
                            <ul>
                              <h3>{user.username}</h3>
                              <p>
                                não é você?{" "}
                                <button onClick={() => router.push(ROUTENVX.logout)}>Sair do clubvision</button> &
                                Deslogue no discord do navegador e reinicie o processo.{" "}
                              </p>
                            </ul>
                          </>
                        )}
                      </ViewInfo>

                      <MarginBottom>
                        <ul>
                          <button onClick={() => ROUTENVX.Discord}>
                            <i className="fi fi-brands-discord" />
                          </button>

                          <button onClick={() => ROUTENVX.Youtube}>
                            <i className="fi fi-brands-youtube" />
                          </button>

                          <button onClick={() => router.push(ROUTENVX.Tiktok)}>
                            <i className="fi fi-brands-tik-tok" />
                          </button>

                          <button onClick={() => router.push(ROUTENVX.X)}>
                            <i className="fi fi-brands-twitter" />
                          </button>
                        </ul>

                        <ul>
                          <Link href={ROUTENVX.policy}>Condições de uso</Link>

                          <Link href={ROUTENVX.Legal}>Regras novision</Link>
                        </ul>
                      </MarginBottom>
                    </Carduserregister>

                    <MarginForm>
                      {currentStep === 1 && isOpenModal0 && (
                        <>
                          <ContainerMargin>
                            <Container>
                              <Scrollmargin>
                                <Card
                                  charimage={`/theim/chracters-c/police-bg.webp`}
                                  className={AboutCharacterx === "Policial" ? "active" : ""}
                                  onClick={() => {playSoundz('click'),handleCategoryChange("Policial")}}
                                >
                                  <ul>
                                    <li>
                                      <Content charimagehover={`/theim/chracters-c/police-g.webp`}>
                                        <span>
                                          <h4>TORNE-SE</h4>
                                          <p>POLICIAL</p>
                                        </span>
                                      </Content>
                                    </li>
                                  </ul>
                                </Card>

                                <Card
                                  className={AboutCharacterx === "Trabalhador" ? "active" : ""}
                                  onClick={() => {playSoundz('click'),handleCategoryChange("Trabalhador")}}
                                  charimage={`/theim/chracters-c/job-bg.webp`}
                                >
                                  <ul>
                                    <li>
                                      <Content charimagehover={`/theim/chracters-c/job-g.webp`}>
                                        <span>
                                          <h4>TORNE-SE</h4>
                                          <p>TRABALHADOR</p>
                                        </span>
                                      </Content>
                                    </li>
                                  </ul>
                                </Card>

                                <Card
                                  className={AboutCharacterx === "Gangster" ? "active" : ""}
                                  onClick={() => {playSoundz('click'),handleCategoryChange("Gangster")}}
                                  charimage={`/theim/chracters-c/gangue-bg.webp`}
                                >
                                  <ul>
                                    <li>
                                      <Content charimagehover={`/theim/chracters-c/gangue-g.webp`}>
                                        <span>
                                          <h4>TORNE-SE</h4>
                                          <p>GANGSTER</p>
                                        </span>
                                      </Content>
                                    </li>
                                  </ul>
                                </Card>

                                <Card
                                  className={AboutCharacterx === "Lider" ? "active" : ""}
                                  onClick={() => {playSoundz('click'),handleCategoryChange("Lider")}}
                                  charimage={`/theim/chracters-c/mafia-bg.webp`}
                                >
                                  <ul>
                                    <li>
                                      <Content charimagehover={`/theim/chracters-c/mafia-g.webp`}>
                                        <span>
                                          <h4>TORNE-SE</h4>
                                          <p>LIDER</p>
                                        </span>
                                      </Content>
                                    </li>
                                  </ul>
                                </Card>

                                <Card
                                  className={AboutCharacterx === "Doutor" ? "active" : ""}
                                  onClick={() => {playSoundz('click'),handleCategoryChange("Doutor")}}
                                  charimage={`/theim/chracters-c/doctor-bg.webp`}
                                >
                                  <ul>
                                    <li>
                                      <Content charimagehover={`/theim/chracters-c/doctor-g.webp`}>
                                        <span>
                                          <h4>TORNE-SE</h4>
                                          <p>DOUTOR</p>
                                        </span>
                                      </Content>
                                    </li>
                                  </ul>
                                </Card>

                                <Card
                                  className={AboutCharacterx === "Militar" ? "active" : ""}
                                  onClick={() => {playSoundz('click'),handleCategoryChange("Militar")}}
                                  charimage={`/theim/chracters-c/military-bg.webp`}
                                >
                                  <ul>
                                    <li>
                                      <Content charimagehover={`/theim/chracters-c/military-g.webp`}>
                                        <span>
                                          <h4>TORNE-SE</h4>
                                          <p>MILITAR</p>
                                        </span>
                                      </Content>
                                    </li>
                                  </ul>
                                </Card>
                              </Scrollmargin>
                            </Container>
                            <li className="marginsub">
                              {AboutCharacterx ? (
                                <>
                                  <IndexPage
                                    ScriptText={`Opá parece que voce escolheu ser um ${AboutCharacterx}, Para confirmar clique em avançar!`}
                                  />
                                </>
                              ) : (
                                <IndexPage
                                  ScriptText={`Olá ${user?.username}, Me diga quem voce sera em thenovision?`}
                                />
                              )}
                            </li>
                          </ContainerMargin>
                        </>
                      )}

                      {currentStep === 2 && isOpenModaloP1 && (
                        <>
                          <Bloy2
                            onKeyDown={(event) => {
                              if (event.key === "Enter") event.preventDefault()
                            }}
                          >
                            <ContentAS>
                              <ContentLi>
                                <h5>Nome Personagem *</h5>

                                <label>
                                  <i className="fi fi-rr-circle-user" />
                                  <InputList
                                    name="name"
                                    autoComplete="off"
                                    placeholder="Nome completo"
                                    type="name"
                                    maxLength={21}
                                    value={NameCharacter}
                                    onChange={(e) => setNameCharacter(e.target.value)}
                                    required
                                  />
                                </label>
                                <h5>Interpretação de personagem *</h5>

                                <label>
                                  <i className="fi fi-rr-briefcase" />
                                  <InputList
                                    name="name"
                                    autoComplete="off"
                                    placeholder="O que o seu personagem faz?"
                                    type="name"
                                    value={AboutCharacterx}
                                    onChange={(e) => setAboutCharacterx(e.target.value)}
                                    required
                                    readOnly
                                  />
                                </label>
                                <h5>{charCount}/4000 - Sua Historia Personagem *</h5>
                                <hr />

                                <InputList3
                                  name="text"
                                  autoComplete="off"
                                  value={CharacterHistory}
                                  onChange={handleCharacterHistoryChange}
                                  placeholder="Historia Personagem"
                                  maxLength={4000}
                                  required
                                />
                              </ContentLi>
                            </ContentAS>
                          </Bloy2>
                        </>
                      )}

                      {currentStep === 3 && isOpenModaloP && (
                        <>
                          <Bloy2
                            onKeyDown={(event) => {
                              if (event.key === "Enter") event.preventDefault()
                            }}
                          >
                            <ContentAS>
                              <ul>
                                <p>Faça parte do que desafia as limitações. Seja diferente e mais ousado;</p>
                              </ul>
                              <ContentLi>
                                <h5>Como as pessoas te chamam*</h5>
                                <label>
                                  <i className="fi fi-sr-id-card-clip-alt" />
                                  <InputList
                                    type="text"
                                    value={name}
                                    autoComplete="off"
                                    maxLength={25}
                                    onChange={(e) => setname(e.target.value)}
                                    placeholder="Apelido/Vulgo"
                                    required
                                  />
                                </label>

                                <h5>Seu Nome*</h5>
                                <label>
                                  <i className="fi fi-sr-pen-swirl" />
                                  <InputList
                                    type="text"
                                    name="name"
                                    value={firstname}
                                    autoComplete="off"
                                    maxLength={25}
                                    onChange={(e) => setfirstname(e.target.value)}
                                    placeholder="Nome "
                                    required
                                  />
                                </label>

                                <label>
                                  <i className="fi fi-sr-pen-swirl" />
                                  <InputList
                                    type="text"
                                    name="name"
                                    value={lastname}
                                    autoComplete="off"
                                    maxLength={25}
                                    onChange={(e) => setlastname(e.target.value)}
                                    placeholder="Sobrenome "
                                    required
                                  />
                                </label>

                                <h5>Data de nascimento *</h5>
                                <label>
                                  <i className="fi fi-br-calendar-lines" />
                                  <InputList
                                    name="date"
                                    placeholder="Data de nascimento"
                                    autoComplete="off"
                                    type="text"
                                    value={Idade ? Idade : ""}
                                    onClick={() => setIsModalOpen(true)}
                                    readOnly
                                    required
                                  />
                                </label>

                                <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
                                  <Dialog.Portal>
                                    <WarrapDate>
                                      <Dialog.Overlay className="dialog-overlay" />
                                      <Dialog.Content className="dialog-content">
                                        <li>
                                          <h2>Selecione a Data de Nascimento</h2>
                                        </li>
                                        <ContentDateS>
                                          <label>
                                            <ul>
                                              <button className="buttonselect" onClick={decrementMonth}>
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="14"
                                                  height="14"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="lucide lucide-minus"
                                                >
                                                  <path d="M5 12h14" />
                                                </svg>
                                              </button>
                                              <input
                                                className="input"
                                                type="number"
                                                placeholder="Mês (1-12)"
                                                value={month}
                                                onChange={handleMonthChange}
                                                min={1}
                                                max={12}
                                                readOnly={true}
                                              />
                                              <button className="buttonselect" onClick={incrementMonth}>
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="14"
                                                  height="14"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="lucide lucide-plus"
                                                >
                                                  <path d="M5 12h14" />
                                                  <path d="M12 5v14" />
                                                </svg>
                                              </button>
                                            </ul>

                                            <ul>
                                              <button className="buttonselect" onClick={decrementYear}>
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="14"
                                                  height="14"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="lucide lucide-minus"
                                                >
                                                  <path d="M5 12h14" />
                                                </svg>
                                              </button>
                                              <input
                                                type="number"
                                                placeholder="Ano"
                                                value={year}
                                                className="input"
                                                onChange={handleYearChange}
                                                readOnly={true}
                                              />
                                              <button
                                                className="buttonselect"
                                                onClick={incrementYear}
                                                disabled={year >= minimumYear}
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="14"
                                                  height="14"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="lucide lucide-plus"
                                                >
                                                  <path d="M5 12h14" />
                                                  <path d="M12 5v14" />
                                                </svg>
                                              </button>
                                            </ul>
                                          </label>
                                          <DayPicker
                                            mode="single"
                                            selected={selectedDay}
                                            onSelect={handleDateChange}
                                            month={new Date(year, month - 1)}
                                            fromYear={today.getFullYear() - 100}
                                            toYear={today.getFullYear()}
                                            disabled={(date) => date > minAgeDate}
                                            className="custom-daypicker"
                                          />
                                        </ContentDateS>
                                      </Dialog.Content>
                                    </WarrapDate>
                                  </Dialog.Portal>
                                </Dialog.Root>
                                {dateOk && <p>{notificationMessage}</p>}
                              </ContentLi>
                            </ContentAS>
                          </Bloy2>
                        </>
                      )}

                      {currentStep === 4 && isOpenModaloInfoCharacterGame && (
                        <>
                          <Bloy2
                            onKeyDown={(event) => {
                              if (event.key === "Enter") event.preventDefault()
                            }}
                          >
                            <ContentAS>
                              <ul>
                                <p>Faça parte do que desafia as limitações. Seja diferente e mais ousado;</p>
                              </ul>

                              <ContentLi>
                                <h5>Rede Sociais :</h5>
                                <hr />

                                <label>
                                  <i className="fi fi-brands-twitter-alt-circle" />
                                  <InputList2
                                    name="text"
                                    type="text"
                                    autoComplete="off"
                                    value={Twitter}
                                    onChange={(e) => setTwitter(e.target.value)}
                                    placeholder="Twitter"
                                    maxLength={15}
                                  />
                                </label>
                                <label>
                                  <i className="fi fi-brands-tik-tok" />
                                  <InputList2
                                    name="text"
                                    type="text"
                                    autoComplete="off"
                                    value={Tiktok}
                                    onChange={(e) => setTiktok(e.target.value)}
                                    placeholder="Tiktok"
                                    maxLength={20}
                                  />
                                </label>
                                <label>
                                  <i className="fi fi-brands-instagram" />
                                  <InputList2
                                    name="text"
                                    type="text"
                                    autoComplete="off"
                                    value={Instagram}
                                    onChange={(e) => setInstagram(e.target.value)}
                                    placeholder="Instagram"
                                    maxLength={30}
                                  />
                                </label>

                                <hr />
                                <h5>Escreva algo sobre voce *</h5>

                                <InputList3
                                  name="text"
                                  value={BioLi}
                                  autoComplete="off"
                                  onChange={(e) => setBioLi(e.target.value)}
                                  placeholder="Sua Bio"
                                  maxLength={100}
                                  required
                                />
                              </ContentLi>
                            </ContentAS>
                          </Bloy2>
                        </>
                      )}

                      {currentStep === 5 && isOpenModalPrime && (
                        <Bloy2>
                          <MarginButton>
  <h1>Como deseja prosseguir na ativação da Conta?</h1>

                            <CardVinx>
                              <ul>
                                <li>
                                  <svg data-v-5c345829="" width="48" height="49" viewBox="0 0 48 49" fill="none" xmlns="http://www.w3.org/2000/svg" className="bonusicon"><path d="M24 4.5C12.972 4.5 4 13.472 4 24.5C4 35.528 12.972 44.5 24 44.5C35.028 44.5 44 35.528 44 24.5C44 13.472 35.028 4.5 24 4.5ZM26 34.33V36.5H22V34.34C17.322 33.606 16 30.336 16 28.5H20C20.022 28.786 20.318 30.5 24 30.5C26.76 30.5 28 29.33 28 28.5C28 27.852 28 26.5 24 26.5C17.04 26.5 16 22.74 16 20.5C16 17.924 18.058 15.332 22 14.67V12.524H26V14.742C29.468 15.562 30.8 18.448 30.8 20.5H28.8L26.8 20.536C26.772 19.776 26.37 18.5 24 18.5C21.402 18.5 20 19.532 20 20.5C20 21.248 20 22.5 24 22.5C30.96 22.5 32 26.26 32 28.5C32 31.076 29.942 33.668 26 34.33Z" fill="#37ad5a"></path></svg>

                                  <li className="jsd">
                                    <h3>Ganhe 5 Mil Orbits</h3>
                                    <p>Bonus por entrar como convidado</p>
                                  </li>
                                </li>
                   <svg 
                   xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                   fill="none" stroke="#080808" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="jssdfc"><path d="M22 2 2 22"/></svg>
                                     <li>
                                   <svg data-v-5c345829="" width="48" height="49" viewBox="0 0 48 49" fill="none" xmlns="http://www.w3.org/2000/svg" className="bonusicon"><path d="M42 4.5L32 14.5L24 4.5L16 14.5L6 4.5V30.5H42V4.5ZM10 42.5H38C39.0609 42.5 40.0783 42.0786 40.8284 41.3284C41.5786 40.5783 42 39.5609 42 38.5V34.5H6V38.5C6 39.5609 6.42143 40.5783 7.17157 41.3284C7.92172 42.0786 8.93913 42.5 10 42.5Z" fill="#40d460"></path></svg>

                                  <li className="jsd">
                                    <h3>Ganhe 1 a 100 mil Bits</h3>
                                    <p>Por cada membro convidado por você</p>
                                  </li>
                                </li>

                             
                              </ul>
                            </CardVinx>
                       
                            <Bloy2
                              onKeyDown={(event) => {
                                if (event.key === "Enter") event.preventDefault()
                              }}
                            >
                              <ContentAS>
                                <ContentLi>
                                   
                                   <li>
                                     <h3 className="dh3">Codigo convite clubvision *</h3>
                                  <div className="bordsx" />
                                   </li>

                        <span  className="title-desc__description mb-2">Cadastre-se ainda hoje e <span className="highlighted">utilize seu token de convite</span> para ativar sua conta e obter acesso como membro da nossa comunidade.</span>

                                  <label>
                                    <i className="fi fi-sr-ticket" />
                                    <InputList
                                      type="text"
                                      autoComplete="off"
                                      placeholder="Código de Convite"
                                      value={inviteCode}
                                      onChange={(e) => setInviteCode(e.target.value)}
                                    />

                                    <ButtonCl onClick={handleAuthorize} disabled={isVerifying}>
                                      {isVerifying ? <>Aguarde...</> : <>Verificar</>}
                                    </ButtonCl>
                                  </label>

                                  {ownerInfo && (
                                    <>
                                      <CardInfoowner>
                                        <ViewInfo>
                                          {user && (
                                            <>
                                              <Image
                                                src={ownerInfo.Avatare || "/placeholder.svg"}
                                                alt={ownerInfo.userName}
                                                height={50}
                                                width={50}
                                                className="logos"
                                              />

                                              <ul>
                                                <h3>{ownerInfo.userName}</h3>
                                                <p>Quem convidou voce foi o {ownerInfo.userName}</p>
                                              </ul>
                                            </>
                                          )}
                                        </ViewInfo>
                                      </CardInfoowner>
                                    </>
                                  )}
                                </ContentLi>
                              </ContentAS>
                            </Bloy2>
                          </MarginButton>
                        </Bloy2>
                      )}
                    </MarginForm>
                 
                  </FormContainer>
                       
                </Bloy>
)}
                {NotificationK && <NotificationUI message={<>{responseMessage} </>} />}
              </ModalWrapper>

              {isOpenCheck && (
                <>
                  <ModalWrapper3>
                    <LoadingPageView />
                  </ModalWrapper3>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
  
 

const MarginBottom = styled.div` 
 
  display: flex;
 
  align-items: center; 
  justify-content: space-between;
  width: 100%;
  
 
   
  button{
    background-color: rgba(38, 38, 41, 0.247);
    border-radius: 99px;
    height: 35px;
    width: 35px;
    padding: 0.5em 0.5em 0.3em;
    margin: 0.3em;
    
    i{
      color: #909197;
      font-size: 13px;
    }

    &:hover{
      background-color: rgba(53, 53, 58, 0.247);

      i{
      color: #858a8f;
    }
    }
  }

  ul{
   display: inline-flex;
   align-items: center;
   
    
    a{
      font-size: 11px;
      color: rgb(129, 129, 136);
      border-radius: 30px;
      margin: 0.4em;
      padding: 0.4em 1em 0.4em;

      &:hover{
        color: #858a8f;
        background-color: rgba(122, 124, 131, 0.041);
     
      }
      
    }

    span{
      cursor:  var(--f-cursor-pointer);
    }
  }


    

 @media screen and (max-width: 530px) {
  padding: 0.5em;


  ul{
    a{
    margin: 0em;
    font-size: 9px;
  }
  }
 }
  
`

const Bloy = styled.form`
  
 height: 100%;
 overflow-y: auto;
  
 display: flex;
 flex-direction: column;
 padding: 0.4em;
 justify-content: center; 
 align-items: center;
 transition: 1s all;
  
 @media screen and (max-width: 530px) {
   padding: 0.6em;
   justify-content: start;
   align-items: start;
   }
`

const Bloy2 = styled.div`
 overflow-y: auto;
 display: flex;
 justify-content: center;
 align-items: center;
 height: 90%;
 padding: 0.3em 5% 0.3em;
 animation: rigOpacity 1s;

 @keyframes rigOpacity {

  0%{ opacity: 0;};
  100%{ opacity: 1;};
 }

 @media screen and (max-width: 530px) {
   padding: 1em 5% 1em;
 } 
`

const ModalWrapper3 = styled.div`
 position: fixed;
  top: 0;
  left: 0;
  bottom: 1;
  z-index: 29084;
  display: flex;
  justify-content: center;
  place-items: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: black;
  
  ul{
    p{
     font-size: 25px;
     color: rgba(67, 68, 73, 0.432);
     font-family: 'Inter', monospace;
    }

    h2{
      font-family: 'Europa Grotesk', monospace;
      font-size: 35px;
      background:  linear-gradient(47deg, #e4d4d7 0%, #434449 1%, #b6b7c4 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    }
  }

`

const ViewMarginProfile = styled.div`
 
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;


  .Avatar{
    border-radius: 13px;
    width: 240px;
    height: 240px;
    border: 3px solid rgb(54, 55, 58);
  }
`

interface ViewHeaderProps {
  bannerUrl: string
}
const HeaderMns = styled.header<ViewHeaderProps>`
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  background-color: rgb(10, 11, 17);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 19px;
  height: 12em;
  margin: 1em;
  padding: 1em 1em 2em;
  width: 100%;
  background-repeat: no-repeat;
  background-size: 100%;

  
    @media screen and (max-width: 430px) {
      width: 350px;
      margin: 0.2em;
      height: 11em;
    
   }

  
  
`

const ProfileView = styled.div` 
    padding: 0em 4% 0em;
    margin-top: -5em;

  .AvatarLogo{
    border-radius: 100px;
    border: 2px solid black;
  }

    @media screen and (max-width: 430px) {
      padding:2em 1em 0em;

   }


  @media screen and (min-width: 200px) and (max-width: 300px) {
    padding: 4em 1em 0em;

    .AvatarLogo{
      height: 90px;
      width: 90px; 
    }
  }

  @media screen and (min-width: 300px) and (max-width: 430px) {
    padding: 2em 1em 0em;
    margin-top: -5em;
    .AvatarLogo{
      height: 90px;
      width: 90px; 
    }
  }

`

const XC = styled.div`
 display: flex;
 flex-direction: column;
width: 100%;
`

const CenterMheader = styled.div`
 display:flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const ModalWrapper = styled.div`
  
  width: 100%;
  height: 100vh;
  position: fixed;
 z-index: 1983;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 width: 100%;
 background: radial-gradient(50% 50% at 0% 5%, rgba(33, 119, 71, 0.212) 0%, rgba(46, 63, 51, 0%) 100%), radial-gradient(50% 50% at 50% 50%, rgb(45 180 133 / 6%) 0%, rgb(85 158 121 / 0%) 100%), radial-gradient(50% 50% at 50% 50%, rgba(40, 104, 69, 0.178) 0%, rgb(54 242 73 / 0%) 100%);
  display: flex; 
  flex-direction: column;
  place-items: center;
  justify-content: center;
  align-items: center;
 
  flex-direction: column;
  animation: opacityModl 1s;
 

  @keyframes opacityModl {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }
 
 

`

const ViewInfo = styled.div`
 
  
   padding: 0.5em 0.7em 0.5em;

   width: 100%;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: space-between;
   align-items: center;
       
   ul{
    display: flex; 
    width: 100%;
    padding: 0.4em 1em 0;
    flex-direction: column;
   }
    

     .logos{
      border-radius: 50%;
     }
   
    h3{
      font-family: 'Inter';
      font-size: 25px;
      background: linear-gradient(47deg, #888384 0%, rgb(73, 77, 74) 1%, #c9c0c1 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    }

    p{
      font-size: 11px;
      color: #868c91;
      margin-bottom: 0.3em;
      max-width: 430px;

      button{
        color: #b42525;
        font-family: 'Inter';
      }
    }

`
const ContentAS = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 550px;
  padding: 2em 1em 2em;
 
  border-radius: 12px;
  
  ul{
     display: flex;
     flex-direction: column;
     
  }

  h2{
    font-size: 39px;
    max-width: 560px;
    margin-bottom: 0.5em;
    font-family: 'ProximaNova', sans-serif;
    font-weight: 700;
    color: #19f06b;
  }

  p{
    font-size: 10px;
    max-width: 435px;
    color: #35363a;
    margin-bottom: 1em;
  }
  
  span{
    margin-top: 0.9em;
    font-size: 9px;
    color: #7a7b88;
  }
  a{
    color: #16f76c;
  }

  label{
    background-color: rgba(27, 29, 27, 0.5);
    
  width: 100%;
  height: 3em;
  padding: 0.6em 1em 0.6em;
  border-radius: 14px;
  
  font-size: 16px;
  color: #9293a0;
  font-family: 'Poppins', Courier, monospace;
  margin: 0.5em;
  margin-left: 0;

    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;


    i{
        color: #2e3331;
        font-size: 20px;
    }
  }
  

`

const ContentDateS = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2em 1em 2em;
  background-color: rgba(37, 44, 41, 0.103);
  border-radius: 14px;
  
  ul{
     display: flex;
     flex-direction: column;
     
  }

  h2{
    font-size: 39px;
    max-width: 560px;
    margin-bottom: 0.5em;
    font-family: 'ProximaNova', sans-serif;
    font-weight: 700;
    color: #19f06b;
  }

  p{
    font-size: 10px;
    max-width: 435px;
    color: #35363a;
    margin-bottom: 1em;
  }
  
  span{
    margin-top: 0.9em;
    font-size: 9px;
    color: #7a7b88;
  }
  a{
    color: #16f76c;
  }

  label{
  width: 100%;
  height: 3em;
  font-size: 16px;
  color: #9293a0;
  font-family: 'Poppins', Courier, monospace;

    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-evenly;


    i{
        color: #262629;
        font-size: 20px;
    }

     
  ul{
     display: flex;
     align-items: center;
     flex-direction: row;
     
  }
  }
  
.input{
  background-color: transparent;
  width: 130px;
  background-color: #070707ce;
  border-radius: 22px;
  height: 2.2em;
  font-size: 16px;
  border: none;
  color: #9293a0;
  padding: 0.9em 1em 0.9em;
  margin: 0.4em;
  font-family: 'Poppins', Courier, monospace;
  
  :focus{
    outline: none;
  }

  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #9c9ca7;
  }
  
  :focus {
  border: none;
  box-shadow: none; 
  outline: none;
}
  :-webkit-autofill,
  :-webkit-autofill:hover, 
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover
  :-webkit-autofill:focus,
  :-webkit-autofill,
   :-webkit-autofill:hover,
   :-webkit-autofill:focus {
  -webkit-text-fill-color: #9e9ea0 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: pointer;
}

}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Remove os botões de incremento para Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

.custom-daypicker .rdp-nav { 
  display: none;  
}
 
/* Muda a cor do dia selecionado para verde */
.custom-daypicker .rdp-day--selected {
  background-color: #1de760;;
  color: white;
}

.rdp-today:not(.rdp-outside) {
  color: #1de760;
}

.rdp-selected .rdp-day_button {
  border: 2px solid #29c45c;
}


  .buttonselect{
    background-color: #141516;
  color: white;
  border: none;
  border-radius: 50%;
  border: 2px solid rgba(42, 42, 44, 0.562);
  padding: 6px 9px 6px;
  cursor: var(--f-cursor-pointer);
  transition: background-color 0.3s;

  &:hover {
    background-color: #1f2022; 
  }

 
  }


  @media screen and (max-width: 530px) {
    .buttonselect{
      margin: 0.1em;
    }
    .input{
      width: 90px;
    }
  }
`
const CardInfoowner = styled.div`
  
   padding: 0.4em 1em 0.4em;
   margin: 1em;
    margin-bottom: 0em;
   
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-in-out forwards;
  @keyframes fadeInUp {
    0%{ opacity: 0; transform: translateX(20%)}
    100%{ opacity: 1; transform: translateX(0)}
  }
  
`

const WarrapDate = styled.div`
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2303;
  background-color: #07070792;
  backdrop-filter: blur(30px);
  place-items: center;
  justify-content: center;
  display: flex;
  height: 100%;

  li{
   margin: 1em;
   
    h2{
   font-family: 'Europa Grotesk';
   max-width: 500px;
   color: rgb(185, 181, 206);
   margin-bottom: 0.9em;
   text-align: center;
  }

  p{
    font-family: 'InterSemiBold', monospace;
    font-size: 11px;
    color: rgb(164, 166, 175);
  }
  }


 
`
const ButtonCl = styled.button`
    
   background-color: rgba(18, 228, 99, 0.897);
   border-radius: 52px;
   box-shadow: 2px 6px 3px black;
   padding: 9px 13px 9px;
   color: black;
   font-family: 'Poppins', sans-serif;
   font-size: 12px;
   transition: 0.3s all;
   margin-top: 0.3em;
  
   .cd{
    color: #0c0c0e;
   }
 

   :hover{
    background: none;
    box-shadow: 2px 3px 3px black;
    color: #ecf5f2;

    .cd {
      color: #f52626;
    }
    }
`

const InputList3 = styled.textarea`
  background-color: rgba(27, 29, 27, 0.5);
    
  border-radius: 14px;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  min-height: 7em;
  max-height: 7em;
  color: #acacb4;
  font-size: 16px;
  padding: 1em 1em 2em;
  font-family: 'Poppins', Courier, monospace;
 resize: none;
  :focus{
    outline: none;
  }

  ::placeholder {
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #bbbbc4;
  }
`
const InputList2 = styled.input`
  
  background-color:transparent;
  width: 100%;
  height: 3em;
  font-size: 16px;
  border: none;
  color: #9293a0;
  padding: 1.2em 1em 1.5em;
  font-family: 'Poppins', Courier, monospace;
  
  :focus{
    outline: none;
  }

  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #9c9ca7;
  }
  
  :focus {
  border: none;
  box-shadow: none; 
  outline: none;
}
  :-webkit-autofill,
  :-webkit-autofill:hover, 
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover
  :-webkit-autofill:focus,
  :-webkit-autofill,
   :-webkit-autofill:hover,
   :-webkit-autofill:focus {
  -webkit-text-fill-color: #9e9ea0 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: pointer;
}

`

const InputList = styled.input`
  
  background-color: transparent;
  width: 100%;
  height: 2em;
  font-size: 16px;
  border: none;
  color: #9293a0;
  padding: 0.9em 1em 0.9em;
 
  font-family: 'Poppins', Courier, monospace;
  
  :focus{
    outline: none;
  }

  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #9c9ca7;
  }
  
  :focus {
  border: none;
  box-shadow: none; 
  outline: none;
}
  :-webkit-autofill,
  :-webkit-autofill:hover, 
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover
  :-webkit-autofill:focus,
  :-webkit-autofill,
   :-webkit-autofill:hover,
   :-webkit-autofill:focus {
  -webkit-text-fill-color: #9e9ea0 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: pointer;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0; /* Remove margem padrão */
}

/* Para ocultar o botão em navegadores Firefox */
input[type="number"] {
  -moz-appearance: textfield; /* Remove os botões */
}
`

const Inlineflex = styled.div`
 display:flex;
 align-items: top;
 flex-wrap: wrap;
 justify-content: center;
 
`

const CardInfouserI = styled.div`
  
   text-align: center;
   display: flex;
   align-items: center;

   ul{
    margin: 0.5em;
    text-align: left;

    h2{
      padding: 0.3em;
      color: #8f9196;
      font-size: 15px;
      font-family: 'ProximaNova';
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    
   }

  .logor{
    border-radius: 100px;
    border: 4px solid rgba(57, 61, 57, 0.212);

  }
`

const ClickV = styled.button`
  border-radius: 83px;
  height: 40px;
  width: 40px;
  margin:0.3em;
  background-color: rgba(77, 76, 78, 0.178);
  padding: 0.6em 0.7em 0.4em;
  color: #42474b;
`

const ButtonSave = styled.button`
 border-radius: 32px;
    background: #f8faf9;
    box-shadow: 0 0 1.5625rem rgba(253, 247, 248, 0.11);
    border: none;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    width: 100%;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    margin-left: 0.4em;
    padding: 0.5em 1em 0.5em;
    transition: ease .2s;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
   transition: 1s all;
   display: flex;
   align-items: center;
  

   i{
    transition: 1s all;
      color: #101013;
        font-size: 19px;
        background-color: rgba(98, 98, 104, 0.068);
        margin-left: 0.4em;
        border-radius: 9px;
        height: 33px;
        width: 33px;
        padding: 6px 0.3em 0.2em;
    }

   h4{
    font-size: 12px;
    font-family: 'Inter', monospace;
    color: #060706;
    font-weight: 900;
 
   }
  
   &:hover{
 
     box-shadow: 0 0 1.5625rem #d4dbd652;
 
   }

`

const ContentLi = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    
    i{
      font-size: 12px;
    }

    h5{
      padding-left: 1em;
      font-size: 12px;
      color: #bac1c7;
     
    }

    li{
      .dh3{
        font-family: 'XcSemibold';
        font-size:23px;
      }
    }

.title-desc__description {
    max-width: 100%;
        font-family: 'ProximaNova-', sans-serif;
    text-align: left;
    max-width: 100%;
    font-size: 13px;
}

 .highlighted {
      font-family: 'ProximaNova-', sans-serif;
    color: #459669;
     font-size: 13px;
}

    .bordsx{
     border-bottom: 8px solid transparent;
    border-image-repeat: stretch;
    border-image-slice: 0 0 100% 0;
    border-image-source: url('/web/border-x.svg');
    color: #fff;
    font-size: 32px;
    font-style: normal;
    width: 290px;
    font-weight: 800;
    line-height: 100%;
    padding-bottom: 5px;
    text-transform: uppercase;
    }

    p{
      font-size: 12px;
      text-align: center;
      color: #912f2f;
      margin: 0.4em;
    }
    hr{
      width: 100%;
      border-color: rgba(99, 97, 116, 0.027);
    }

    label{
      display: flex;
      align-items: center;
      width: 100%;
      
    }
`

const NavRegs = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
   padding: 0.7em;
   width: 100%;
 background: linear-gradient(180deg, rgba(60, 61, 66, 0.158) 0%, rgba(64, 64, 68, 0.11) 100%);
 border-radius: 12px;
 
 border-radius: 12px;
  margin: 0.8em;
 
 

  .logf{
    opacity: 0.2;
    filter: saturate(0);
  }

  @media screen and (max-width: 530px) {
    margin: 0;
     background: transparent;
     padding: 0 2em 0;
   }
`

const FormContainer = styled(motion.div)`

  
 display: flex;
 width: 100%;
 align-items: center;
 justify-content: center;
 
background: linear-gradient(180deg, rgba(64, 66, 65, 0.425) 0%, rgba(30, 36, 34, 0.11) 100%);
 border-radius: 12px;
 
 
  h5{ 
   color: #6f737e42;
   margin: 0.5em;
 }
  

 @media screen and (max-width: 530px) {
  display: flex;
 width: 100%;
 flex-direction: column;
 justify-content: none;
 border: none;
 background: transparent;
 }
  
`
 
// SELECT CHARACTER

const typingAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`

const ContainerText = styled.div`
  margin-top: 1em;
  
  p{
  max-width: 440px;
  flex-wrap: wrap;
  font-family: 'ProximaNova-Italic';
  font-size: 10px;
    color: #b7b9c4;
    margin-bottom: 1em;
  }

  
`

const Text = styled.span`
  overflow: hidden;
  white-space: nowrap;
  animation: ${typingAnimation} 3s steps(40, end);
`

const ContainerMargin = styled.div`
 
 height: 100%;
 place-items: center;
 flex-direction: column;
 display: flex;
 justify-content: center;
 align-items: center;
 

  .marginsub{
    margin-top: 1em;
  }

 
`

const Container = styled.div`

 place-items: center;
 display: flex;
 flex-wrap: wrap;
 max-width: 530px;
 
 justify-content: center;
 align-items: center;
 
 .active{
      border: 2px solid rgb(192, 192, 201);
      filter: saturate(1);
background-size: 100%;
      span{
    text-align: center;
    opacity: 1;

    h4{
    font-family: 'ProximaNova-Italic';
    font-size: 11px;
    color: rgb(168, 166, 173);
    }

    p{
    font-family: 'ProximaNova';
    font-size: 12px;
    color: rgb(230, 228, 236);
    }
  }
    }
`

const Content = styled.div<CharacterImage>`
 height: 100%;
 width: 100%;
 background-image: ${({ charimagehover }) => `url('${charimagehover}')`};
 background-size: 105%;
 background-repeat: no-repeat;
 border-radius: 10px;
  
   span{ 
    opacity: 0;
    position: fixed;
    bottom: 1px;
    left: 0;
    top: 0;
    margin-top: 227%;
    right: 0;
   }

 &:hover{
    content: "";
    cursor: pointer;
    background-image: ${({ charimagehover }) => `url('${charimagehover}')`};
    background-size: 100%;
   
  span{
    text-align: center;
    opacity: 1;

    h4{
    font-family: 'ProximaNova-Italic';
    font-size: 11px;
    color: rgb(168, 166, 173);
    }

    p{
    font-family: 'ProximaNova';
    font-size: 12px;
    color: rgb(230, 228, 236);
    }
  }
  }


`

const Card = styled.div<CharacterImage>`
   content: "";
   height: 388px;
   width: 150px;
   border: 2px solid rgb(46, 49, 48);
   transition: 0.2s all;
   border-radius: 12px 12px 8px 12px;

   margin: 0.4em;
   filter: saturate(0);
  
  ul{
  background-image: ${({ charimage }) => `url('${charimage}')`};
  background-repeat: no-repeat;
  border-radius: 10px;
  background-size: 100%;
  height: 100%;
  width: 100%;

  li{
    border-radius: 10px;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(250, 36, 143, .12) 0%, #e607257d 100%);
   }


  }

 
   :hover{
    filter: saturate(1);
   }


` 

const Carduserregister = styled.div`
 height: 100%;
 width: 47%;
 padding: 0.7em;
 
 @media screen and (max-width: 430px) {

 width: 100%;
 
 }
`

const MarginForm = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.4em;
  width: 550px; 

  @media screen and (max-width: 430px) {
    width: 100vw;
  }
`

const Cardbutton = styled.div`
  padding: 0.7em;
 background-image: linear-gradient(180deg, rgba(60, 61, 66, 0.096) 0%, rgba(64, 64, 68, 0.041) 100%);
 border-radius: 12px;
 display: inline-flex;
 align-items: top;
 margin-bottom: 0.6em;
 width: 100%;
 
 ul{
  display: flex;
  flex-direction: column;
  margin: 0.4em;


  h3{
    font-family: 'Inter', monospace;
    font-size: 15px;
    color: rgb(227, 228, 236);
  }


  p{
    font-family: 'ProximaNova-Italic', monospace;
    font-size: 11px;
    color: rgb(175, 176, 184);
  }
 }

 svg{
  transform: rotate(22deg);
 }
`

const CardVinx = styled.div`
   
 width: 100%;
 position: relative;
 overflow: hidden;
 min-height: 40px;
 border: 1px solid #398b54;
border-radius: 12px;

.jssdfc{
  transform: rotate(-45deg);
}
 
 .bonusicon{
  flex-shrink: 0;
  height: 35px;
  width: 35px;
 }
 ul{
  padding: 0.4em;
  display: flex;
  align-items: center;
  gap: 1em;
  height: 100%;
  width: 100%;
  background: linear-gradient(
  180deg,
  color-mix(in srgb, #172219 100%, transparent) 0%,
  color-mix(in srgb, #1d1f1d 25%, transparent) 100%
);
 
 }

 li{
  display: flex;
  align-items: center;
  gap: 5px;
 }

 .jsd{
  display: flex;
  flex-direction: column;
  text-align: left;
    align-items: start;
  gap: 0px;

  p{
    font-family: 'ProximaNova-Italic', sans-serif;
    font-size: 11px;
    color: #a1aca5;
  }

  h3{
     font-family: 'ProximaNova-', sans-serif;
    font-size: 16px;
    color: #cad4ce;
  }
 }
`;

const MarginButton = styled.div`
  display: flex;
  justify-content: center ;
  flex-direction: column;
  width: 100%;
   
  h1{
    text-align: center;
    font-family: 'XcSemibold', monospace;
    font-size: 24px;
    max-width: 440px;
    margin-bottom: 1em;
    color: rgb(204, 211, 214);
  }
`

const ContainerPrime = styled.div` 
   
background: linear-gradient(180deg, rgba(64, 66, 65, 0.425) 0%, rgba(30, 36, 34, 0.11) 100%);
   padding: 0.7em 1em 0.7em;
   border-radius: 18px;
   width: 100%;


   @media screen and (max-width: 530px) {
    display: none;
   }
     
`

const ContentPrime = styled.div`
   
   display: flex; 
   align-items: center;
   justify-content: space-between;
   
     ul{
    display: flex; 
    align-items: center;

     img{
        padding-right: 1em;
     }
     }
   

     h2{
      font-size: 12px;
      background: linear-gradient(47deg, #acb8b2 0%, rgb(182, 194, 188) 1%, #0a0b0c 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
   font-family: 'Europa Grotesk';
    }
     
    .li{
        margin: 0;
    }

    h3{
     font-family: 'Inter', sans-serif;
     font-size: 11px;
     color: #97a19deb;
    }
  

    button{
      background: linear-gradient(204deg, #151b1a40 -7%, #b85cff00 33%), linear-gradient(162deg, #6a7c7440 -10%, #2c88dd00 25%), linear-gradient(0deg, #070808, #0b0c0b);
   padding: 1em 1em 1em;
   border-radius: 48px;
   font-size: 11px;
   font-family: 'Europa Grotesk';
   box-shadow: -11px 18px 1px black;
   color: #cdd8d3ec;
  
   position: relative;
   z-index: 1;
   
   transition: 1s all;
   border: 2px solid #09090a;
   
   &:hover{
    box-shadow: -1px 13px 11px black;
    transform: scale(1.1);
    border: 2px solid #110f0f2b;
   }
 

   @media screen and (max-width: 280px){
      margin-left: -6em;
      font-size: 13px;
  }

    }
    
  .IconsM{
    height: 90px;
    width: 90px;
     transform: rotate(25deg);
  }


  @media screen and (max-width: 430px) {
    display: flex;
    flex-direction: column;

    h2{
      font-size: 15px;
    }

    h3{
      font-size: 11px;
    }

    button{
      margin: 0.5em;
    }

    img{
      display: none;
    }
  } 
`

const FadeIn = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const FadeIncd = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
 
  gap: 2em;
  align-items: center;
  justify-content: center;
`


const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
`

 
const CardCenter = styled.div<CharacterImage>`
   content: "NOVISION";
   height: 388px;
   width: 150px;
   border: 2px solid rgba(25, 27, 27, 0.534);
   transition: 0.2s all;
   border-radius: 10px;
  
  ul{
  background-image: ${({ charimage }) => `url('${charimage}')`};
  background-repeat: no-repeat;
  border-radius: 10px;
  background-size: 100%;
  height: 100%;
  position: relative;
  width: 100%;

  li{
    border-radius: 10px;
    width: 100%;
    height: 100%;
     
   }

   span{
    filter: saturate(1);
   }


  }

 
   &:hover{
    filter: saturate(1);
   }

@media screen and (max-width: 680px){
   display: none;
}
`;
 
const WelcomeScreen = styled.div`
 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  h1 {
    font-size: 48px;
    line-height: 60px;
    max-width: 380px;
    font-weight: 700;
    
    background: linear-gradient(47deg, #8a918d 0%, #d1dad4 1%, #228a5f 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'XcSemibold', monospace;
  }
  
  p {
    font-size: 15px;
    color: #9293a0;
    margin-bottom: 40px;
    max-width: 365px;
    font-family: 'ProximaNova-Italic', sans-serif;
    text-align: center;
  }
  
  button {
    background: linear-gradient(204deg, #3cc76ae6 -7%, #b85cff00 33%), 
                linear-gradient(162deg, #29704dd5 -10%, #2c88dd00 25%), 
                linear-gradient(0deg, #212221, #1c1d1c);
    padding: 1em 2em;
  
    border-radius: 48px;
    width: 340px;
    font-size: 16px;
    font-family: 'Europa Grotesk';
    
    color: #cdd8d3ec;
    position: relative;
    z-index: 1;
    transition: 0.3s all;
  
    :hover {
      background: linear-gradient(204deg, #46c97ce6 -7%, #b85cff00 33%), 
                linear-gradient(162deg, #30c57bd5 -10%, #2c88dd00 25%), 
                linear-gradient(0deg, #212221, #2f312f);
    }
  }


  li{
    margin: 0.8em;
    margin-top: 2em;
    h6{
      max-width: 350px;
      text-align: left;
      font-size: 12px;
      font-family: 'ProximaNova-Italic', sans-serif;
    }

    a{
       text-decoration: underline;
       cursor: var(--f-cursor-pointer);
      color: #414441;
    }
  }
`

const ScreenContainer = styled(motion.div)`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
   background: linear-gradient(204deg, #11f77940 -7%, #b85cff00 33%), linear-gradient(162deg, #dae2db40 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  padding: 2rem;
  overflow: auto;
   
  
  h1 {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 20px;
    background: linear-gradient(47deg, #e4d4d7 0%, #434449 1%, #b6b7c4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Europa Grotesk', monospace;
  }
  
  h2 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #73ce96;
    font-family: 'Europa Grotesk', monospace;
  }
  
  p {
    font-size: 16px;
    color: #9293a0;
    margin-bottom: 30px;
    max-width: 600px;
  }
  
  button {
    background: linear-gradient(204deg, #d0d8d740 -7%, #b85cff00 33%), 
                linear-gradient(162deg, #d8e2dc40 -10%, #2c88dd00 25%), 
                linear-gradient(0deg, #161818, #202220);
    padding: 0.8em 1.8em;
    border-radius: 48px;
    font-size: 13px;
    font-family: 'Europa Grotesk';
    box-shadow: -5px 8px 1px black;
    color: #cdd8d3ec;
    position: relative;
    z-index: 1;
    transition: 0.3s all;
    border: 2px solid #2c2e2d;
    margin: 10px;
    
    &:hover {
      box-shadow: -1px 5px 5px black;
      transform: scale(1.05);
      border: 2px solid #110f0f2b;
    }
  }
  
  .premium-button {
    background: linear-gradient(204deg, #1a2e1d40 -7%, #b85cff00 33%), 
                linear-gradient(162deg, #6a7c7440 -10%, #2c88dd00 25%), 
                linear-gradient(0deg, #070808, #0b0c0b);
    border: 2px solid #19f06b;
    color: #19f06b;
  }
  
  .feature-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 30px;
    
    li {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      color: #9293a0;
      text-align: left;
      
      i {
        color: #19f06b;
        margin-right: 10px;
      }
    }
  }
`

const LogoContainer = styled.div`
  margin-bottom: 30px;
  
  img {
    width: 120px;
    height: auto;
  }
`
