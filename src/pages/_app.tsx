"use client"

import { useRouter } from "next/router"
import NProgress from "nprogress"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { BlockedPages } from "@/routes/blockroute"
import BlockPagesView from "@club/resources/nvx/blockpages"
import { SpeedInsights } from "@vercel/speed-insights/next"
import styled from "styled-components"
import type { AppProps } from "next/app"
import Security from "@/wallet/security/connect/security"
import { StakingPainel } from "../wallet/monetization/staking.painel"
import { LayoutClub } from "@club/club/.vision/dashboard/layout/app"
import "@/public/Css.Global.css"
import type { User } from "@/types/user/types"
import ROUTENVX from "@/routes/routes"
import { Permission, getPermission } from "@/types/discord/permission"
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { withSession, type NextIronRequest } from "@/lib/session"
import { type ModLog, getModLogs } from "@/types/discord/modlog"
import { TrivoLayoutPage } from "../club/.vision/dashboard/layout/trivo.market"
import { initTurboPerformance } from "@/club/.vision/dashboard/layout/fallx/performance-turbo"
import { ComponentLoaderTurbo } from '../club/.vision/dashboard/layout/fallx/component-loader';
import LoadingFallback from '../club/.vision/dashboard/layout/fallx/loading-fallback';
import ComponentTopInc from '../../admin/components/ac/info-top';
import DashboardAdministrator from "@/admin/app/dashboard"
import LevelUpCelebration from '../club/.level/level-up';
import { ToastProvider } from "@/shop/ac/toat-shop"
import { CartProvider } from "@/.trivo/screen/main.view"
import CheckoutPage from "@/wallet/kop/checkout"
 // Inicializa o sistema de performance turbo
if (typeof window !== "undefined") {
  // Executa imediatamente para otimizar o carregamento inicial
  initTurboPerformance()
}

interface Props {
  user: User | null
  Permissions: Permission[]
  logs: ModLog[]
}

 
export default function App({ pageProps, Component }: AppProps<Props>) {
  const router = useRouter()
 
  // Memoize valores que não mudam frequentemente
  const allowedPages = useMemo(
    () => [
      "/",
      "/~/dashboard",
      ROUTENVX.Dashboard,
      ROUTENVX.payaddfund,
      ROUTENVX.mytvl,
      ROUTENVX.trader,
      ROUTENVX.storeclub,
      ROUTENVX.market,
      ROUTENVX.opencase,
      ROUTENVX.viewitem,
      ROUTENVX.myinventory,
      ROUTENVX.Members,
      ROUTENVX.Streamers,
      ROUTENVX.storePrime,
    ],
    [],
  )

  // Estados
  const [showModal, setShowModal] = useState(false)
  const [isWalletActive, setIsWalletActive] = useState(false)
  const [acesmartphone, setAcesmartphone] = useState(false)
  const [profile, setProfile] = useState(false)
  const [alertinfo, setalert] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  // Valores memoizados para evitar recálculos
  const isPageAllowed = useMemo(() => allowedPages.includes(router.pathname), [allowedPages, router.pathname])
  const { user, Permissions, logs } = pageProps 
  const isTvlOrStudio = useMemo(
    () => router.query.wallet === "staking" || router.query.studio === 'monetization' || router.query.shop === "clubvision",
    [router.query.wallet, router.query.shop],
  )
 
   const isAdminAccountVisible = useMemo(
  () => Permissions?.some((log) => log.type === "ADMIN"),
  [Permissions]
);

const isManagerAccountVisible = useMemo(
  () => Permissions?.some((log) => log.manager === true),
  [Permissions]
);


  // Handlers memoizados para evitar recriação em cada render
  const handleInstallApp = useCallback(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          localStorage.setItem("app-installed", "true")
          setShowCard(false)
        }
        setDeferredPrompt(null)
      })
    }
  }, [deferredPrompt])

  const handleCloseCard = useCallback(() => {
    localStorage.setItem("close-card", "true")
    setShowCard(false)
  }, [])

  const handleRedirect = useCallback(() => {
    const query = Object.fromEntries(
      Object.entries(router.query).map(([key, value]) => [key, Array.isArray(value) ? value.join(",") : value || ""]),
    )
    const queryString = new URLSearchParams(query).toString()
    router.replace(`/?${queryString}`)
  }, [router])

  // Otimização: Usar AbortController para cancelar requisições pendentes em mudanças de rota
  useEffect(() => {
    const controller = new AbortController()

    const handleStart = (url: string) => {
      NProgress.start()
    }

    const handleStop = () => {
      NProgress.done()
    }

    router.events.on("routeChangeStart", handleStart)
    router.events.on("routeChangeComplete", handleStop)
    router.events.on("routeChangeError", handleStop)

    return () => {
      controller.abort() // Cancela requisições pendentes
      router.events.off("routeChangeStart", handleStart)
      router.events.off("routeChangeComplete", handleStop)
      router.events.off("routeChangeError", handleStop)
    }
  }, [router.events])

  // Detecção de dispositivo móvel
  const isMobileDevice = useMemo((): boolean => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent.toLowerCase()
      return (
        userAgent.includes("android") ||
        userAgent.includes("iphone") ||
        userAgent.includes("ipad") ||
        userAgent.includes("ipod") ||
        userAgent.includes("windows phone")
      )
    }
    return false
  }, [])

   useEffect(() => {
   setShowModal(false)

     if (isMobileDevice) {
     setAcesmartphone(true)
      if (BlockedPages.includes(router.pathname)) {
       setShowModal(true)
      }
  } else {
     setAcesmartphone(false)
  }
 }, [router.pathname, isMobileDevice])
  
 const [ismodal, setismodal] = useState(0)
 useEffect(() => {
   if (router.query.orderId) {
     setismodal(3)
   } else {
    setismodal(0)
   }
  
 }, [router.query]);

  // Atualização de estados baseada em query params
  useEffect(() => {
    const { wallet, account, settings, shop } = router.query

    // Otimização: Calcular todos os estados de uma vez para evitar múltiplos re-renders
    const updates = {
      isWalletActive:!!(isPageAllowed && (wallet || shop)),
      profile: !!(isPageAllowed && (account || settings === "connected_experiences")),
      alertinfo: !!(!isPageAllowed && (wallet || shop || account || settings)),
    }

    setIsWalletActive(updates.isWalletActive)
    setProfile(updates.profile)
    setalert(updates.alertinfo)
  }, [router.query, router.pathname, isPageAllowed])

  // Prompt de instalação do app
  useEffect(() => {
    // Otimização: Verificar localStorage apenas uma vez
    const storageCheck = {
      isAppInstalled: localStorage.getItem("app-installed"),
      isCardClosed: localStorage.getItem("close-card"),
    }

    if (!storageCheck.isAppInstalled && !storageCheck.isCardClosed) {
      setShowCard(true)
    }

    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault()
      setDeferredPrompt(event)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const getLayout = (Component as any).getLayout
  const Layoutrivo = (Component as any).Layoutrivo

  // Otimização: Pré-renderizar componentes comuns
  const walletImportFn = () => import("../wallet/kop")
  const accountImportFn = () => import("../club/.vision/containers/navigation/topbar/account.user")

  // Otimização: Memoizar a estrutura do componente para evitar re-renders desnecessários
  const renderContent = useMemo(() => {
    if (getLayout ) {
      return (
        <LayoutClub user={user} Permissions={Permissions} logs={logs}>
          <Component {...pageProps} />
        </LayoutClub>
      )
    }

   if (!(getLayout || Layoutrivo)) {
    if (showModal) {
      return <BlockPagesView onClose={() => setShowModal(false)} />
     }

      if (acesmartphone) {
        return (
          <>
            
                  <Component {...pageProps} />
              
            {!Layoutrivo && isPageAllowed && isWalletActive && (
              <Wrapp>
                <Security>
                  <ComponentLoaderTurbo
                    importFn={walletImportFn}
                    props={{ mobile: true }}
                    priority="high"
                    fallback={<LoadingFallback message="Carregando carteira..." />}
                  />
                </Security>
              </Wrapp>
            )}

            {!Layoutrivo && isPageAllowed && profile && (
              <Wrapp>
                <ComponentLoaderTurbo
                  importFn={accountImportFn}
                  props={{}}
                  priority="high"
                  fallback={<LoadingFallback message="Carregando perfil..." />}
                />
              </Wrapp>
            )}
          </>
        )
      }
    }

    if (!(getLayout || acesmartphone)) {
      return (
        <StyledContainer isWalletActive={!Layoutrivo && isWalletActive || !Layoutrivo && profile}>
          {!isTvlOrStudio && (
            <StyledComponentWrapper isWalletActive={!Layoutrivo && isWalletActive || !Layoutrivo && profile} className="box">
              <div className="card-content">
                {Layoutrivo ? (
                  <LayoutClub user={user} Permissions={Permissions} logs={logs}> 
                  <TrivoLayoutPage>
                    <Component {...pageProps} />
                  </TrivoLayoutPage>   
                 </LayoutClub>
                ) : (
                  <Component {...pageProps} />
                )}
              </div>
            </StyledComponentWrapper>
          )}
          {!Layoutrivo && isPageAllowed && isWalletActive && (
            <StyledWalletUser isTvlOrStudio={`${isTvlOrStudio ? true : false}`}>
              <Security>
                <ComponentLoaderTurbo
                  importFn={walletImportFn}
                  props={{ mobile: false }}
                  priority="high"
                  fallback={<LoadingFallback message="Carregando carteira..." />}
                />
              </Security>
            </StyledWalletUser>
          )}

          {!Layoutrivo && isPageAllowed && profile && (
            <StyledWalletUser isTvlOrStudio={`${isTvlOrStudio ? true : false}`}>
              <ComponentLoaderTurbo
                importFn={accountImportFn}
                props={{ mobile: false }}
                priority="high"
                fallback={<LoadingFallback message="Carregando perfil..." />}
              />
            </StyledWalletUser>
          )}
        </StyledContainer>
      )
    }

    return <BlockPagesView onClose={() => router.push(ROUTENVX.Dashboard)} />
  }, [
    getLayout,
    Layoutrivo,
    showModal,
    acesmartphone,
    isPageAllowed,
    isWalletActive,
    profile,
    isTvlOrStudio,
    user,
    Permissions,
    logs,
    pageProps,
    walletImportFn,
    accountImportFn,
  ])

  const [isopendashboard, setdashboard] = useState(false);
 const scrollRef = useRef(null)

   // Atalho: CTRL + ALT + V
 useEffect(() => {
  if(isManagerAccountVisible || isAdminAccountVisible) {
    const handleKeydown = (e: KeyboardEvent) => {
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

    // Abrir ou alternar com CTRL + ALT + V
    if (ctrlKey && e.altKey && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      setdashboard(prev => !prev);
    }

    // Fechar com ESC
    if (e.key === 'Escape') {
      setdashboard(false);
    }
  };

  window.addEventListener("keydown", handleKeydown);
  return () => window.removeEventListener("keydown", handleKeydown);
  }
   
}, []);

  
  return (
    <CartProvider>
   
      <ToastProvider>
     {!acesmartphone && !isopendashboard && (isManagerAccountVisible || isAdminAccountVisible) ? renderContent : !isopendashboard  && renderContent}   
   </ToastProvider> 
    
     
   {isopendashboard && (isManagerAccountVisible || isAdminAccountVisible) ?  <DashboardAdministrator user={user} Permissions={Permissions} /> : null}
 
     {/* {!acesmartphone && !isopendashboard && (isManagerAccountVisible || isAdminAccountVisible) ? (
      <div ref={scrollRef}  style={{ scrollBehavior: "smooth" }} className="bg-[#34c560]  overflow-y-auto h-screen transition-all duration-700">
          <ComponentTopInc manager={isManagerAccountVisible} admin={isAdminAccountVisible}/> 
     <div  style={{ 
      background: '#0B0C0A',
       position: 'relative', 
       overflow: 'hidden', 

      borderRadius: "14px 14px 0 0",
       marginTop: (isManagerAccountVisible || isAdminAccountVisible) ? 1 : 0 }}>
      {renderContent}
    </div>
      </div>
    ): !isopendashboard  && renderContent}   */}

      {showCard && (
        <MarginWj>
          <MobileCarDownloadapp>
            <img src="/favicon.png" alt="novision" height={50} width={50} />
            <li>
              <h3>Clubvision em seu dispositivo!</h3>
              <p>Sua experiência com o Clubvision se torna melhor como aplicativo.</p>
            </li>
            <button className="button" onClick={handleInstallApp}>
              Instalar App
            </button>
            <button onClick={handleCloseCard} className="buttonclick">
              <i className="fi fi-br-cross" />
            </button>
          </MobileCarDownloadapp>
        </MarginWj>
      )}

      <SpeedInsights />
     
       {user && <LevelUpCelebration  />}
     {user && <StakingPainel />}  
     {ismodal === 3 && <CheckoutPage />}

      {alertinfo && (
        <MarginWj>
          <AlertInfo>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-triangle-alert"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            <li>
              <h3>Ops! Acesso negado a este recurso</h3>
              <p>Estamos te redirecionando para outro lugar..</p>
            </li>
            <button className="button" onClick={handleRedirect}>
              Redirecionar
            </button>
          </AlertInfo>
        </MarginWj>
      )} 
    </CartProvider>
  )
}



export const getServerSideProps: GetServerSideProps<Props> = withSession(
  async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const req: NextIronRequest = context.req as NextIronRequest;
    const user = req.session.get("user") as User;
  

  let Permissions: Permission[] = [];
   let logs: ModLog[] = [];
  if (user) {
    const userId = user.id;
    const guildId = "1175857498687807560"; 

    try {
      Permissions = await getPermission(guildId, userId);
      // Convert Date objects to string representations
      Permissions.forEach((permission) => {
        permission.created_at = permission.created_at.toString();
      });
     logs = await getModLogs(guildId, userId);
    } catch (error) {
      console.error("Error fetching information:", error);
    }
  }

  return {
    props: {
      user,
      Permissions,
      logs,
    },
  };
}
);
  
 

 
 
const AlertInfo = styled.div`
padding: 0.8em 0.5em 0.8em;
   border-radius: 12px;
   border: 2px solid rgba(9, 12, 11, 0.89);
   backdrop-filter: blur(49px);
   display: flex;
   flex-direction: row;
   align-items: center;
   gap: 9px;
   position: relative;
   animation: Oneview 1s linear;

   h3{
    font-family: 'InterSemiBold', monospace;
    font-size: 13px;
    
   }

   p{
    font-family: 'InterSemiBold', monospace;
    font-size: 11px;
    color: rgb(142, 145, 150);
   }

   img{
    border-radius: 12px;
   }

   .buttonclick{
    color: #6d6d7276;  
 transition: 1s all;
 border: 2px solid rgba(9, 12, 11, 0.89);
 margin-top: 0.4em;
 background-color: black;
 backdrop-filter: blur(65px);
 border-radius: 50%;
 position: absolute;
 right: -4px;
 top: -13px;
 padding: 0.3em 0.5em 0.3em;

  i{
    font-size: 11px;
  }
  
&:hover{
  i{
    color: white;
  }
}
   }

   .button{
    font-family: 'InterSemiBold', monospace;
    padding: 0.8em 1em 0.8em;
    border-radius: 23px;
    color: black;
    background-color: #fff;
   }
   
 
   @media screen and (max-width: 430px) {
     
       h3{
        font-size: 11px;
        margin-bottom: 0.2em;
       }

     p{
      max-width: 160px;
      font-size: 10px;
     }

     .button{
      padding: 0.8em 0.6em 0.8em;
      font-size: 12px;
     }
   }

   @keyframes Oneview {
    0%{ transform: translateY(100%) }
    100% { transform: translateY(0%) }
   }


 
`
const MarginWj = styled.div`

position: fixed;
   left: 0;
   right: 0;
   bottom: 12px;
   z-index: 9823;
   width: 100%;
   display: flex;
   justify-content: center;
 
`

const MobileCarDownloadapp = styled.div`
   
   padding: 0.8em 0.5em 0.8em;
   border-radius: 12px;
   border: 2px solid rgba(9, 12, 11, 0.89);
   backdrop-filter: blur(49px);
   display: flex;
   flex-direction: row;
   align-items: center;
   gap: 9px;
   position: relative;

   h3{
    font-family: 'InterSemiBold', monospace;
    font-size: 13px;
    
   }

   p{
    font-family: 'InterSemiBold', monospace;
    font-size: 11px;
    color: rgb(142, 145, 150);
   }

   img{
    border-radius: 12px;
   }

   .buttonclick{
    color: #6d6d7276;  
 transition: 1s all;
 border: 2px solid rgba(9, 12, 11, 0.89);
 margin-top: 0.4em;
 background-color: black;
 backdrop-filter: blur(65px);
 border-radius: 50%;
 position: absolute;
 right: -4px;
 top: -13px;
 padding: 0.3em 0.5em 0.3em;

  i{
    font-size: 11px;
  }
  
&:hover{
  i{
    color: white;
  }
}
   }

   .button{
    font-family: 'InterSemiBold', monospace;
    padding: 0.8em 1em 0.8em;
    border-radius: 23px;
    color: black;
    background-color: #fff;
   }
   
 
   @media screen and (max-width: 430px) {
     
       h3{
        font-size: 11px;
        margin-bottom: 0.2em;
       }

     p{
      max-width: 160px;
      font-size: 10px;
     }

     .button{
      padding: 0.8em 0.6em 0.8em;
      font-size: 12px;
     }
   }
`

const Wrapp = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9372;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);

`

const StyledContainer = styled.div<{ isWalletActive: boolean }>`
  display: ${({ isWalletActive }) => (isWalletActive ? "flex" : "block")};
  justify-content: ${({ isWalletActive }) => (isWalletActive ? "space-between" : "unset")};
  height: 100%;
  width: 100%;
  overflow: hidden;  
  transition: 1s all;
  
  .tab-content{
    position: fixed;
    right: 2px;
    bottom: 9px;
    width: 430px;
    backdrop-filter: blur(22px);
    border-radius: 12px;
    z-index: 1283;
  }
 
`
const StyledComponentWrapper = styled.main<{ isWalletActive: boolean }>`
  transition: width 0.5s ease, height 0.5s ease;
  width: ${({ isWalletActive }) => (isWalletActive ? "80vw" : "100vw")};
  height: ${({ isWalletActive }) => (isWalletActive ? "98vh" : "100vh")};
  overflow-y: auto;
  border: ${({ isWalletActive }) => (isWalletActive ? "2px solid transparent" : "none")};
  margin: ${({ isWalletActive }) => (isWalletActive ? "0.3em" : "none")};

 

  ${({ isWalletActive }) =>
    isWalletActive &&
    `
    animation: glowAnimation 0.3s forwards;
    box-shadow: 0 0 15px 5px rgba(37, 37, 39, 0.4);
    --gradient-border: conic-gradient(from var(--border-angle), transparent 25%, #1bdf55, #0f0c0c 99%, transparent);
    border: solid 2px transparent; 
    border-image: var(--gradient-border) 1;
    animation: bg-spin 3s linear infinite;
    border-radius: inherit;
    display: flex;
    justify-content: center;
    align-items: center;

    
  
    .card-content {
      width: min(90vw, 1200px); 
      height: min(90vh, 800px);
      max-width: 100%;
      max-height: 100%;
      position: relative;

      .tmsj{
        transform: scale(0.8);
      }

      .onets{
        transform: scale(1);
     
      }
    
      .tmsj3{
        display: none;
      }

       .mshd{
     width: 98%;
 
    }
 .noscroll{
    max-width: 100vw;
    position: absolute;
      overflow: hidden;
    }
    }
  `}

  @keyframes bg-spin {
    to {
      --border-angle: 1turn;
    }
  }

  @property --border-angle {
    syntax: "<angle>";
    inherits: true;
    initial-value: 0turn;
  }
`

interface Posi {
  isTvlOrStudio: string
}
const StyledWalletUser = styled.div<Posi>`
  height: 100vh;
  width: ${({ isTvlOrStudio }) => (isTvlOrStudio === "true" ? "100vw" : "auto")};  
   
  position: relative;
  transition: all 0.5s ease;
`
