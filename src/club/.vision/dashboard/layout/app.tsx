
import styled, {keyframes} from "styled-components";
import { User } from "@/types/user/types";
import ROUTENVX from "@/routes/routes";
import Link from "next/link";
import Image from "next/image";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { UserInfo } from "@/types/discord/usersearch";
import React from "react";
import { Permission} from "@/types/discord/permission";
import { ModLog } from "@/types/discord/modlog";
import NotifyView from "@club/resources/notification/game/notify.index";
import UserNotify from "@club/resources/notification/user/notify.user";
import Security from "@/wallet/security/connect/security";
import LoadingPageView from "@club/resources/loading";
import NavLeft from "@club/club/.vision/containers/navigation/left";
import TopBar from "@club/club/.vision/containers/navigation/topbar";
import Right from "@club/club/.vision/containers/navigation/right";
import Leaf from '@/public/icons/topmenu/leaf.png'
import { decrypt } from '@/core/security/encryption';
import axios from "axios";
import HeadGlobal from "@/club/head/glob.n";
import { Additem } from "iconsax-react";
import { Tooltip } from "@mui/material";
import ViewPageInfo from "@/admin/components/ax/openmodal";
import LogoQ from '@/public/web/club.webp'
import ViewPrime from '@club/club/.prime/subscription/menu.viewprime';
import WalletUser from "@club/wallet/kop";
import Vpass from "@/components/vipass/vpass";
import { getBorderColorFromTheme } from "@/data/themes/theme.config";
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";
import RegisterAccount from "@/accounts/register";
import { ButtonIcon, ButtonRipple, CartItem, CartItemImage, CartItemImageContainer, CartItemInfo, CartItemName, CartItemPrice, CartItems, CartModalContent, CartSummary, CheckoutButton, CloseButton, EmptyCart, ItemCount, ItemImageGlow, LoadingSpinner, ModalBody, ModalFooter, ModalGlow, ModalHeader, ModalOverlay2, ModalTitle, RemoveButton, SummaryRow } from "@/components/account/account.user";
import { TrivoItem } from "@/data/market/opencase/TrivoItem";
import { useCart } from "@/.trivo/screen/main.view";
import { Info } from "lucide-react";
import AccountCentralMain from "../accountcenter";


  
interface Props {
    user: User | null;
    Permissions: Permission[];
    logs: ModLog[] ;
    children: ReactNode;
  }
  
 function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const check = () => setIsMobile(window.innerWidth <= 768)
      check()
      window.addEventListener("resize", check)
      return () => window.removeEventListener("resize", check)
    }
  }, [])

  return isMobile
}
     
export const   LayoutClub: React.FC<Props> = React.memo(({ user, Permissions, logs, children }) => {
    const router = useRouter();
    const [ismodal, setismodal] = useState(0)
    
  const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [steaminfo, setsteam] = useState<UserInfo | null>(null);
  const [infox, setinfox] = useState<UserInfo | null>(null);
  const [isdashboard, setdashboard] = useState(true)
  const [isright, setright] = useState(true)
  const [istopbar, setistopbar]= useState(true)
  const acesmartphone = useIsMobile()
    const [showAccountRe, setshowAccountRe] = useState(false);

  const isTvlOrStudio =
  router.query.wallet === 'staking' || router.query.studio === 'monetization' || router.query.shop === 'clubvision';
  const { isLoadingx, userInfoObject, userSteam, userTeam } = GetInfo_nvxre_xyloQuerier();
   
  
   useEffect(() => {
      if(!user) {
     router.push(ROUTENVX.signin)
   }

    if (isLoadingx) setLoading(true);
  if (!isLoadingx && userInfoObject) {
    setUserInfo(userInfoObject);
    setsteam(userSteam);
    setinfox(userTeam);
    setLoading(false);
    }
  }, [user,isLoadingx, userInfoObject]);

   
  const allowedPages = useMemo(
  () => [
    ROUTENVX.trader,
    ROUTENVX.storeclub,
    ROUTENVX.market,
    ROUTENVX.opencase,
    ROUTENVX.viewitem,
    ROUTENVX.myinventory,
    ROUTENVX.upgrader,
    '/account',
    ROUTENVX.storePrime,
    ROUTENVX.Connect,
    ROUTENVX.user,
     /^\/@[^/]+$/,
    '/support/admin'
  ],
  [],
);

useEffect(() => {
  if (router.query.wallet === 'vision' || router.query.wallet === 'payment' || router.query.wallet === 'staking' ) {
    setismodal(3)
  } else {
    setismodal(0);
  } 
   
  if (router.query.club === 'account_center') {
    setshowAccountRe(true)
  } else {
    setshowAccountRe(false);
  } 
   

 const shouldHideTopbar = allowedPages.some(page =>
  typeof page === 'string'
    ? router.asPath.startsWith(page)
    : page.test(router.asPath)
);
    setistopbar(!shouldHideTopbar);
  
}, [router.query,router.asPath]);


 
    const { cart, setCartx: setCart, showCartModal, setShowCartModal } = useCart();
      
  
       const getTrivoInfo = (itemName: string) => {
         return (
           TrivoItem.find((item: any) => item.itemName === itemName) || {
             type: "",
             itemName: "Indisponível",
             skinName: "Edição Limitada",
             participants: "Indisponível",
             url: "#",
           }
         )
       }
     
       
       const getItemRarity = (item: any) => {
         if (!item) return "Comuns"
     
         const trivo = getTrivoInfo(item?.nameitem)
         const price = Number.parseFloat(item?.priceitem) || 0
     
         // Prioriza o tipo do Trivo primeiro
         if (trivo?.type === "CHAMPION") return "Raros"
         if (trivo?.type === "XPLAY") return "Premium"
         if (trivo?.type === "AMIX") return "Comuns"
     
         // Se não tem tipo definido, usa o preço
         if (price > 1000) return "Raros"
         if (price > 500) return "Premium"
         if (price > 0) return "Comuns"
     
         return "Experience"
       }
     
       const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

       const removeFromCart = (itemId: string) => {
         setCart((prev: any) => prev.filter((item: any) => item.id !== itemId))
       }
     
       const getTotalCartValue = () => {
         return formatCurrency(cart.reduce((total: any, item: any) => total + (Number.parseFloat(item.priceitem) || 0) * item.quantity, 0))
       }
     
       
       const [isPurchasing, setIsPurchasing] = useState(false)
       const [purchaseError, setPurchaseError] = useState<string | null>(null)
     
     
       // Função para enviar a compra - CORRIGIDA
      const handlePurchase = async () => {
         if (cart.length === 0) {
           setPurchaseError("Seu carrinho está vazio.")
           return
         }
     
         try {
           // Validate cart items
           const validCartItems = cart.map((item: any) => {
             if (!item.id || !item.nameitem || !item.priceitem) {
               throw new Error(`Item inválido no carrinho: ${JSON.stringify(item)}`)
             }
     
             return {
               id: Number(item.id),
               nameitem: String(item.nameitem),
               priceitem: Number(item.priceitem),
               imagem: item.imagem || null,
               quantity: Number(item.quantity) || 1,
               type: item.type || null,
               rarity: item.rarity || getItemRarity(item).toLowerCase(),
             }
           })
     
           const totalAmount = validCartItems.reduce((sum: any, item: any) => sum + item.priceitem * item.quantity, 0)
     
           // Store cart data in localStorage for the checkout page to access
           localStorage.setItem("cartItems", JSON.stringify(validCartItems))
           localStorage.setItem("cartTotal", totalAmount.toString())
     
           // Generate a unique order ID
           const orderId = Date.now().toString()
     
           // Redirect to checkout page with the order ID
           window.location.href = `?orderId=${orderId}`
         } catch (error: any) {
           console.error("Error preparing checkout:", error)
           setPurchaseError("Erro ao preparar o checkout. Tente novamente.")
         }
       }
     
useEffect(() => {
if (isTvlOrStudio) {
setright(false)
setdashboard(false)
} else {
  setright(true)
setdashboard(true)
}

  if (cart.length > 6) {
           setIsPurchasing(true)
      } else {
        setIsPurchasing(false)
      }
     

}, [router.query,cart]);
   
const AdministratorAcess= () => {

  const [isAdminAccountVisible, setIsAdminAccountVisible] = useState(false);
  useEffect(() => {
    const hasPermission = Permissions.some((log) => log.type === 'ADMIN');
    setIsAdminAccountVisible(hasPermission);
  }, [Permissions]);

  return isAdminAccountVisible ? (
          <>
   {user && (
        <>
      <ViewPageInfo />
     </>
   )}
   </>
  ) : null;
};


const [isBannedAccountVisible, setIsBannedAccountVisible] = useState(false);
useEffect(() => {
  const hasBanLog = logs.some((log) => log.type === 'BAN');
  setIsBannedAccountVisible(hasBanLog);
 
}, [logs]);

const [isWARNAccountVisible, setIsWARNAccountVisible] = useState(false);
useEffect(() => {
  const hasWarnLog = logs.some((log) => log.type === 'WARN');
  setIsWARNAccountVisible(hasWarnLog);

}, [logs]);
const [isKickAccountVisible, setIsKickAccountVisible] = useState(false);
useEffect(() => {
  const hasKickLog = logs.some((log) => log.type === 'KICK');
  setIsKickAccountVisible(hasKickLog);

}, [logs]);
const [isUnbanAccountVisible, setIsUnbanAccountVisible] = useState(false);
useEffect(() => {
  const hasUnbanLog = logs.some((log) => log.type === 'UNBAN');
  setIsUnbanAccountVisible(hasUnbanLog);

  setAnyAlertVisible(isUnbanAccountVisible || isBannedAccountVisible || isWARNAccountVisible || isKickAccountVisible);
}, [logs,isUnbanAccountVisible, isBannedAccountVisible, isWARNAccountVisible, isKickAccountVisible]);

  
const [isAnyAlertVisible, setAnyAlertVisible] = useState(
isUnbanAccountVisible || isBannedAccountVisible || isWARNAccountVisible || isKickAccountVisible
);
const BanInformation= () => {
 
  const [isBannedAccountVisible, setIsBannedAccountVisible] = useState(false);
  useEffect(() => {
    const hasBanLog = logs.some((log) => log.type === 'BAN');
    setIsBannedAccountVisible(hasBanLog);
  }, [logs]);

  return isBannedAccountVisible ? (
    <ModalWrapper54>
  
   {user && (
        <>
     <ContainerLi>
        <ContentCrad>

      <ContentList>

      <li>
         <i className="fi fi-rr-lock" />
       </li>

       <p>
        Após uma análise cuidadosa, determinamos que sua conta violou nossas <Link href={ROUTENVX.Legal}> Diretrizes</Link>. Como resultado, ela foi bloqueada, o que impede o acesso a todos os serviços da novision. Caso deseje contestar a decisão, você pode enviar um pedido de revisão do banimento para tentar recuperar sua conta. Se acreditar que houve um erro, sinta-se à vontade para nos enviar uma justificativa.

       </p>
      </ContentList>
   
        </ContentCrad>
     </ContainerLi>
     </>
   )}
    </ModalWrapper54>
  ) : null;
};

 



const [isPublishingGl, setPublishingGl] = useState(false);
const [isVisionPost, setVisionPost] = useState(true);

const OpenVisionPost = () => {
    setVisionPost(true);
    setPublishingGl(false)
  }

const Publicar = () => {
  setPublishingGl(true);
  setVisionPost(false);
}

  
if (loading) {
  return (
    <>
      <HeadGlobal Title="Carregando..." />
      <LoadingPageView />
    </>
  );
}

if (!loading && userInfo && !userInfo.userId) {
  return <RegisterAccount user={user}/>
}  
 
  return user && userInfo && (
    <Main bgColor={userInfo.Backgroundtheme} >
 
   <HeadGlobal />
   <NavLeft 
   signature={`@${infox?.name}${infox?.subdominio ? infox?.subdominio : ''}`}
           id={user.id} 
           name={user.username} 
           avataruser={user.avatar}
           theme={userInfo.Backgroundtheme}
            accountactive={userInfo.type ? true : false} 
            accountverified={userInfo.verified ? true : false} 
            accountnvx={userInfo.nvxre ? true : false} 
            accountteam={userInfo.nvrp ? true : false} 
          OpenX={true} Logo={
          <>
         <Image 
         className="rotatelogo" 
         src={userInfo.IconeGlobal || LogoQ} 
         alt="novision" height={50} width={50} />
          </>
        } />

         
{(!(acesmartphone && ismodal === 3)) && isdashboard && (

      <>
       <div className="Margin" >
     
       <Vpass user={user} />
      
     <Container theme={userInfo?.Backgroundtheme} className={istopbar ? 'MarginDash ' : ''}>
     
     {istopbar && (
      <>
        {userInfo.type ? (
              <> 
          
            <TopBar 
                            VisionPost={<>
                              <CardButtonAS>
                                <ul>
    
    
                                  <button onClick={OpenVisionPost} className={isVisionPost ? "activeHomejd" : ""}>
                                    <i className="fi fi-rr-menu-dots" />
                                  </button>
    
                                  {userInfo.prime && userInfo.type ? (
                                    <Tooltip title={`Postar`} placement="bottom">
                                      <button onClick={() => router.push(ROUTENVX.postadd)} className={isPublishingGl ? "activeHomejd" : ""}>
                                        <Additem size="21" color="#707971" variant="Broken" />
                                      </button>
                                    </Tooltip>
                                  ) : null}
                                </ul>
    
                              </CardButtonAS></>}
                            TheHome
                            children={<>Você está autorizado</>}
                            userInfo={{...userInfo, ...user, ...steaminfo}}
                            chilbottominf={<> Pronto para jogar no servidor </>}
                            iconinfo={<>  <Image src='/icons/check.png' alt='' width={35} height={35} /> </>}
                            
                            AdminMenu={<><AdministratorAcess /></>}
                            BannedAccount={<>
    
                              {isBannedAccountVisible &&
                                <>
                                  <ContentCard2>
                                    <i className="fi fi-br-ban colorred" />
                                    <li>
                                      <h3>Você Esta Banido</h3>
                                      <hr />
                                      <p>Sua conta esta Bloqueada</p>
                                    </li>
                                  </ContentCard2>
                                </>}
    
                            </>} 
                            
                      
                            accountactive={userInfo.prime} 
                            primeactive={userInfo.prime ? true : false} 
                            id={user.id}
                             userInfox={{...infox}}
                            username={user.username}
                            avataruser={user.avatar}
                            eventmember={userInfo.support ? true : false}/>
               </>
                ) : (
                  <>
            <TopBar 
            id={user.id}
            username={user.username}
            userInfox={{...infox}}
            userInfo={{...user, ...userInfo, ...steaminfo}}
            avataruser={user.avatar}
            accountactive={userInfo.prime} 
            primeactive={userInfo.prime ? true : false} 
            eventmember={userInfo.support ? true : false}
            iconinfo={<> <Image src='/icons/notallowlist.gif' alt='' width={35} height={35}/></>} AdminMenu={<><AdministratorAcess /></>} 
            BannedAccount={ 
              <>
  {isBannedAccountVisible && 
               <>
    <ContentCard2>
  <i className="fi fi-br-ban colorred"/>
    <li>
     <h3>Você Esta Banido</h3>
     <hr />
     <p>Alem de nao autorizado, sua conta esta Banida</p>
    </li>
    </ContentCard2>
               </>
          }
  </>
  }
           VisionPost={<>
           <CardButtonAS>
          <ul>
         
          <Tooltip title={`Postar`} placement="bottom"> 
               <button onClick={() => router.push(ROUTENVX.postadd)} className={isVisionPost ? "activeHomejd" : ""}>
               <i className="fi fi-sr-graphic-style" />
               </button> 
               </Tooltip>
               </ul>
           </CardButtonAS>
           </>}
           TheHome
                            children={<>Conta Não Autorizada</>}
                            chilbottominf={<>Não autorizado para jogar na cidade!</>}
                            />
                  </>
                )}
      </>
     )}
    
         
     <Security steam={!steaminfo?.id ? true : false} > 
          <ViewPrime user={userInfo} />
        {children}
         <BanInformation />
       </Security>
     </Container>
     
     </div>
  
      </>
    )}


    {isright && (
      <>
      <Right 
       theme={userInfo.Backgroundtheme}
      userInfo={userInfo} user={user} infox={infox} NotifyAlert={
    <>
     <NotifyView 
                          Children={
                            <>
                             
     {isAnyAlertVisible ? (
                            <> 
                         {isUnbanAccountVisible && 
                             <>
                             <UserNotify 
                             TitleNotify={
                              <>
                              Revogação de banimento
                              </>
                             } 
                             Description={
                              <>
                             Usuario {user?.username} teve seu banimento revogado da comunidade thenovision, agora voce pode voltar a jogar na comunidade!
                              </>
                             } />
                              </>
                          }
                             {isWARNAccountVisible && 
                             <>
                             <UserNotify 
                             TitleNotify={
                              <>
                               Advertencia 
                              </>
                             } 
                             Description={
                              <>
                              Essa conta esta Advertida, veja em seu historico para mais detalhes!
                              </>
                             } />
                              </>
                          }
  
  
                             {isBannedAccountVisible && 
                             <>
                             <UserNotify 
                             TitleNotify={
                              <>
                               Conta Bloqueada
                              </>
                             } 
                             Description={
                              <>
                              Essa conta esta bloqueada de jogar em nossa comunidade!
                              </>
                             } />
                             </>
                             }
  
                     {isKickAccountVisible && 
                             <>
                             <UserNotify 
                             TitleNotify={
                              <>
                               Removido do servidor 
                              </>
                             } 
                             Description={
                              <>
                             Usuario {user?.username} foi removido da comunidade discord, entre em seu historico para mais informações!
                              </>
                             } />
                              </>
                          }
  
                       
  </>
  ) : (
    <>
    <ContainerN>
  <Image src={Leaf} alt="event" height={165} width={165}/>
  <li>
  <h4>Aqui esta uma calmaria!</h4>
  <p>Os alertas referentes a sua conta, serão mostrados aqui!!</p>
  </li>
  </ContainerN>
    </>
  )}
    </>
  } />   
                            </>
                          }
                        />
      </>
    )}
    
     {ismodal == 3 && (
      <div className="ncjs h-screen">
      <WalletUser mobile={false}   />
    </div>

     )}

 
 {showCartModal && (
        <ModalOverlay2 >
          <CartModalContent>
              <ModalGlow />

            <ModalHeader>
              
              <div  className="flex flex-col items-start">
                     <ModalTitle>
             Tanto espaço para seus futuros ativos!
        
              </ModalTitle>
                 {cart.length === 0 ? (
                     <p className="font-['ProximaNova-Italic'] text-[12px] text-[#838684]">Adicione os tvls e ativos à sua bolsa para fazer o check-out e segure-as.</p>

                 ) : (
<p className="font-['ProximaNova-Italic'] text-[12px] text-[#838684]">
  Foram adicionados no total de{" "}
  {cart.length > 0 && (
    <ItemCount>
      {cart.length} {cart.length === 1 ? "item" : "itens"}
    </ItemCount>
  )}{" "}
  na sacola.
</p>
                 )}
             
                 {cart.length === 0 && (
                    <button  className="sadbutton" onClick={() => router.push(ROUTENVX.market)}>Explorar marketplace</button>
                 )}
             
              </div>
              <CloseButton onClick={() => setShowCartModal(false)}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M17 12H3"/><path d="m11 18 6-6-6-6"/><path d="M21 5v14"/></svg>
              </CloseButton>

            
            </ModalHeader>

          
              {cart.length === 0 ? (
                <EmptyCart/>
              ) : (
                   <ModalBody>
                <CartItems>
                  {cart.map((item: any) => (
                    <CartItem key={item.id}>
                      <CartItemImageContainer>
                        <CartItemImage src={item.imagem || "https://via.placeholder.com/60"} alt={item.nameitem} />
                        <ItemImageGlow />
                      </CartItemImageContainer>
                      <CartItemInfo>
                        <CartItemName>{item.nameitem}</CartItemName>
                        <CartItemPrice>
                          {formatCurrency(item.priceitem)} Bits x {item.quantity}
                        </CartItemPrice>
                      </CartItemInfo>
                      <RemoveButton onClick={() => removeFromCart(item.id)}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3,6 5,6 21,6" />
                          <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
                        </svg>
                      </RemoveButton>
                    </CartItem>
                  ))}
                </CartItems>
                 </ModalBody>
              )}
            
 

            {cart.length > 0 && (
              <ModalFooter>
                <CartSummary>
                  <SummaryRow>
                    <span>Subtotal:</span>
                    <span>{getTotalCartValue()} Bits</span>
                  </SummaryRow>
                 
                </CartSummary>

                <CheckoutButton onClick={handlePurchase} disabled={isPurchasing} purchasing={isPurchasing}>
                  {isPurchasing ? (
                    <>
                      <Info size={14} color="#acb3af" />
                      Muita coisa...
                    </>
                  ) : (
                    <>
                      <ButtonIcon>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 12l2 2 4-4" />
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                      </ButtonIcon>
                      {`Finalizar Compra`}
                    </>
                  )}
                  <ButtonRipple />
                </CheckoutButton>
              </ModalFooter>
            )}
          </CartModalContent>
        </ModalOverlay2>
      )}


       
            {showAccountRe && (
              <>
              {user && (
      <AccountCentralMain 
      classname={true}
                          id={user.id}
                          username={user.username}
                          avatar={user.avatar}
                          discordavatar={user.discordavatar} 
                          faixadiscord={user.banner}
                          child={
                            <>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#363837" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M6.376 18.91a6 6 0 0 1 11.249.003"/><circle cx="12" cy="11" r="4"/></svg>
                            </>
                          }/>
              )}
              
              </>
            )}

  </Main>
  )
})

 
  const Main = styled.main<{ bgColor: string }>`
  background: ${(props) => props.bgColor};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  height: 100svh;
  width: 100vw;
  
  overflow: hidden;
  transition: 0.9s all;
  padding: 9px;
  

   .ncjs{
    margin-top: -0.4em;
    max-width: 100%;
   }

   .right-active{
    background-color: rgba(66, 66, 70, 0.247);
   }
  .Margin {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0;
  min-width: 320px;
  
}
  

 
.MarginDash{
    padding-block-start: 9px;
  padding: 0.9em;
}
  @media screen and (max-width: 768px) { 
     padding:0;

     .Margin{
       width:100vw;
     }


     .ncjs{
       position: relative; 
       width:100%;
       height: 100%;
        background: ${(props) => props.bgColor};
       
     }
  }


  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column-reverse;
    width: 100vw;
    height: 100svh; 
    
    
   .ncjs{
    height: 100%;
   }

   .MarginDash{
   padding-top: 4em;
   }
  }


`;

 
const Container = styled.div<{ theme: string }>`
 
  margin: 0; 
  overflow-x: hidden;
  flex-grow: 1;
  background: ${(props) => props.theme ? props.theme : 'linear-gradient(204deg, #4e504e73 -7%, #383a392c 33%), linear-gradient(162deg, #4e504e73 -10%, #2c88dd00 25%), linear-gradient(0deg, #1a1919, #080a09)'};
  border-radius: 12px ; 
  border: 2px solid ${(props) => getBorderColorFromTheme(props.theme)};
 
  min-width: 320px;
  width: 100%; 
  position: relative;
  height: 100svh;
    

  @media screen and (max-width: 768px) { 
     border: none;
     border-radius: 0;
     overflow-x: auto;
     padding:1em 0 0;
     flex-grow: 0;
 
 
  }

 
 
`;




 // STYLED 
  
   
  
 const ContentCrad = styled.div`
 text-align: center;
 position: fixed;
 top: 1;
 bottom: 0;
 overflow: auto;
 height: 98%;
 width: 90%;

 h1{
   color: #86a0b8;
 }
 `;

const ContainerLi = styled.section`
   display: flex;
   justify-content: center;
   align-items: center;
   flex-wrap: wrap;
   margin-top: 19%;
`;


const ContentList = styled.ul`
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;


 li{
   margin-top: 20%;
 }

 p{
   position: fixed;
   bottom: 11px;
  font-size: 12px;
  max-width: 653px;
  color: #b6b6b6;
  font-family: 'Inter', sans-serif;
  font-weight: 220;
 }

 a{
   color: #31dd8d;
 }

 i{
   font-size: 69px;
   color: rgb(158, 161, 160);
 }
`;


const ModalWrapper54 = styled.div`
 position: fixed;
 top: 0;
 right: 0;
 z-index: 3186;
 width: 100%;
 height: 100%;
 backdrop-filter: blur(3px);
 background-color: #0b0c0ba4;
 display: flex;
 justify-content: center;
 align-items: center;
 place-items: center;
 overflow: scroll;

 
 
`;
const ContainerN = styled.div`
width: 100%;
height: 100%;
display: flex;
justify-content: center;
place-items: center;
flex-direction: column;
margin-top: 5%;
text-align: center;

li{
 margin: 0.9em;

}

h4{
 font-family: 'Roboto', sans-serif;
 font-weight: 500;
 margin-top: 0.8em;
 color: #afb2b4;
}

p{
 font-family: 'Roboto', sans-serif;
 font-weight: 300;
 font-size: 12px;
 margin: 0.4em;
 color: #676a6d;
}
`;


const typingAnimation = keyframes`
 from {
   width: 0;
 }
 to {
   width: 100%;
 }
`;

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

 
`;

const Text = styled.span`
 overflow: hidden;
 white-space: nowrap;
 animation: ${typingAnimation} 3s steps(40, end);
`;


// STYLED DASHBOARD FORYOU 



const CardButtonAS = styled.div` 

 .activeHomejd{
   border: 1px dashed #d8d0d060;
  
   i{
    color: #e92525;
   }
  }

 ul{
    
    display: flex;
   flex-direction: row;
   align-items: center;

 }


 button{
   padding: 8px 9px 6px;
   border-radius: 50%;
   border: 1px solid transparent;
   background-color: rgba(212, 223, 215, 0.014);
   transition: 0.7s all;
   i{
     color: #484849;
   }

   &:hover{
     border: 1px solid rgba(102, 103, 110, 0.048);
     background-color: rgba(102, 103, 110, 0.048);

     i{
     color: #757579;
   }
   }

 }
`;




const ContentCard2 = styled.div`
padding-left: 1em;
 margin-left: 1em;
 border-left: 1px solid rgba(173, 174, 187, 0.11);
 display: flex;
  flex-direction: row;
  align-items: center;
  
 h3{
  font-size: 12px;
 }

 p{
  font-size: 9px;
  color: #9b9eafab;
 }
  
  li{
     padding-left: 1em;

     hr{
      width: 100%;
     }
  }

  i{
    font-size: 23px;
    margin-top: 0.3em;
    color: #1ef164;
  }

  .colorred{
      color: #f82828;
    }

`;

 
