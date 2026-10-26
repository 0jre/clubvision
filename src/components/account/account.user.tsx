
import styled, { css, keyframes } from "styled-components"
import Image from "next/image"
import { UserData } from "@/types/user/types";
import { UserInfo } from "@/types/discord/usersearch";

import { useEffect, useMemo, useRef, useState } from "react";
import ROUTENVX from "@/routes/routes";
import { useRouter } from "next/router";
import Link from "next/link";
import Bits from '@/public/icons/coins/20240909_113221.png'
import Orbit from '@/public/icons/coins/orb-novision.webp'
import Vtoken from '@/public/icons/market/sadasjdub.webp'
import Crown from '@/public/icons/crown_badge.png'
import { Infocoinuser } from "@/types/user/coin.bank";
import NotificationUI from "../notification/card.mnc";
import LogoVision from "../vision/logo";
import { navItems } from "@/data/market/header";
import Tooltip from "../uls/hover.idex";
import GamingDashboard from "./topmenu";
import { Levelinfo } from "@/types/user/level.up";
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";
import { GetInfo_nvxre_level } from "@/hooks/infolevel";
import { GetInfo_nvxre_walletvision } from "@/hooks/walletvision";
import { nvxre_getRedemptionHistory } from "@/hooks/RedemptionHistory";
import { nvxre_checkAuthentication } from "@/hooks/checkAuthentication";
import { useCart } from "@/.trivo/screen/main.view";
import { TrivoItem } from "@/data/market/opencase/TrivoItem"  
import { Menu } from "iconsax-react";
import { Info } from "lucide-react";
 

interface Props {
    nav?: React.ReactNode;
    about?: React.ReactNode;
    balance?: boolean;
    navbar?: 'relative' | 'absolute' 
    market?:boolean;
}


interface OHistory {
  code: string; 
  bonus: number; 
  date: string; 

}

  
export default  function AccountNvxre ({balance,nav,about,navbar, market} : Props) {
  const router = useRouter();
    const { invite }= router.query;
    
   
    const [userInfo, setUserInfo] = useState<UserData | null>(null);
    const [userD, setUserD] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [mobilemenu, setmobilemenu] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [MenuProfile, setmenuprofile] = useState(false);
    const [userwallet, iswalletinfo] = useState<Infocoinuser | null>(null);
    const [iscodeuse, setcodeuse] = useState(false)
    const [iscodeinvite, setcodeinvite ] = useState(false)
    const [iscodebits, setcodebits] = useState(true)
    const [isbalance] = useState(balance) 
    const [inviteCode, setInviteCode] = useState<string | string[]>(invite || '');
    const [responseMessage, setResponseMessage] = useState('');

    const [isVerifying, setIsVerifying] = useState(false);
    const [ownerInfo, setOwnerInfo] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState('');
   const [isFormSubmitted, setIsFormSubmitted] = useState(false);
   const [Codebits, setCodebits ] = useState('')
  const [redemptionHistory, setRedemptionHistory] = useState<OHistory []>([]);
    
  const activeLink = router.asPath;
  const [userInfox, setUserInfox] = useState <Levelinfo | null>(null);

  const { isLoadinguser,data,mutateuser } = nvxre_checkAuthentication();
  const { isLoadingx, userInfoObject,mutate } = GetInfo_nvxre_xyloQuerier();     
  const { isLoadinglevel, Datalevel } = GetInfo_nvxre_level();
  const { isLoadingwallet, Datawallet } = GetInfo_nvxre_walletvision({id: userInfo?.user.id});
  const { isLoadingRedem, DataRedem } = nvxre_getRedemptionHistory({id: userInfo?.user.id});
  const [istopbar, setistopbar] = useState(true)
 


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
  ],
  [],
);
    
  useEffect(() => {
 
      const shouldHideTopbar = allowedPages.some(page =>
        router.asPath.startsWith(page)
      );
  
      setistopbar(!shouldHideTopbar);
    
  }, [router.query,router.asPath]);

   const isActive = (pathname: string) => {
     return activeLink === pathname ? 'activevc hcndbc avbx' : '';
   };
 
  useEffect(() => {
    if (router.query.code === 'active-novision') {
      setcodeuse(true)
      setcodeinvite(true)
      setcodebits(false)
    }
  }, [router.query]);

   const Opencodeinvite = () => {
    setcodeinvite(true)
    setcodebits(false)
   }

   const Opencodebits = () => {
    setcodeinvite(false)
    setcodebits(true)
   }
 
    const MobileMenu = () => {
     setmobilemenu(true)
    }

    const CloseMobileMeu = () => {
      setmobilemenu(false)
    }

    const handlecode = () => {
      setcodeuse(true)
    }
    useEffect(() => {
      if (router.query.wallet === 'vision') {
        setmenuprofile(false)
      }
    }, [router.query]);
    

    const formatNumber = (num: number): string => {
       if (num === undefined || num === null || isNaN(num)) {
    return '•••'; 
  }
      if (num >= 1e15) {
        return Math.round(num / 1e15) + 'Q';
      } else if (num >= 1e12) {
        return Math.round(num / 1e12) + 'T';
      } else if (num >= 1e9) {
        return Math.round(num / 1e9) + 'B';
      } else if (num >= 1e6) {
        return Math.round(num / 1e6) + 'M';
      } else if (num >= 1e3) {
        return Math.round(num / 1e3) + 'K';
      } else {
        return Math.round(num).toString();
      }
    };
    
     
     const total = (userwallet?.banking || 0) + (userwallet?.coins || 0);
 
 
useEffect(() => {
  
     if(!isLoadinguser || !isLoadingx ) {
      setLoading(false);
        setIsLoading(false)
     }  

}, [isLoadinguser,isLoadinguser , isLoadingx , isLoadingRedem , isLoadingwallet , isLoadinglevel])

 useEffect(() => {
   
  if (!isLoadinguser && data ) {
    setUserInfo(data)
  }
}, [data])

     
useEffect(() => {
  if (userInfoObject ) {
  setUserD(userInfoObject);
  }
}, [userInfoObject])

 
useEffect(() => {
  if ( DataRedem ) {
  setRedemptionHistory(DataRedem);
  }
}, [DataRedem])

 
useEffect(() => {
  if (Datawallet) {
  iswalletinfo(Datawallet);
  } 
}, [Datawallet])

useEffect(() => {
  if ( Datalevel) {
  setUserInfox(Datalevel);
  } 
}, [Datalevel])

    const handleclosemod = () => {
      setcodeuse(false);
      const { code, invite, ...rest } = router.query;
      router.push({
        pathname: router.pathname,
        query: { ...rest}
      }, undefined, { shallow: true });
    }
    
    const handleAuthorizeCodebits = async () => {
      setIsVerifying(true);
      setResponseMessage('');
    
      try {
        const response = await fetch('/api/_v4/bitger/redeemCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userInfo?.user.id, code: Codebits }), 
        });
    
        const data = await response.json();
        setResponseMessage(data.message);
        setIsFormSubmitted(true);
    
        if (response.ok) {
          // Atualize o histórico de resgates
          setRedemptionHistory((prev) => {
            // Verifique se prev é um array, caso contrário, inicialize como um array vazio
            if (Array.isArray(prev)) {
              return [...prev, { code: Codebits, bonus: data.newBits, date: new Date().toLocaleString() }];
            }
            // Se prev não for um array, retornamos um novo array com o novo item
            return [{ code: Codebits, bonus: data.newBits, date: new Date().toLocaleString() }];
          });
    
          setInviteCode(''); // Limpa o campo após o sucesso
        }
      } catch (error) {
        console.error('Erro ao aplicar código:', error);
        setResponseMessage('Erro ao aplicar o código.');
        setIsFormSubmitted(true);
        setTimeout(() => {
          setIsFormSubmitted(false);
        }, 5000);
      } finally {
        setIsVerifying(false);
        setTimeout(() => {
          setIsFormSubmitted(false);
        }, 5000);
      }
    }; 


     


    const handleAuthorize = async () => {
      setIsVerifying(true);
      try {
        const response = await fetch(`/api/redirect/authorization`, {
          method: 'POST',
          body: JSON.stringify({ discordUserId: userInfo?.user.id, inviteCode }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setResponseMessage(`Código de convite usado!`);
          mutate()  
          setIsFormSubmitted(true);
          setTimeout(() => {
            setIsFormSubmitted(false);
          }, 5000);
          await getGuestInfo(`${inviteCode}`);
          await handleGetOwnerInfo();
        } else {
          const data = await response.json();
          setResponseMessage(data.error);
          setIsFormSubmitted(true);
          setTimeout(() => {
            setIsFormSubmitted(false);
          }, 5000);
        }
      } catch (error) {
        setResponseMessage(`Algum Problema aconteceu aqui!`);
      } finally {
        setIsVerifying(false);  
      }
    };
  
    const formatCurrency = (value: number): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '•••'; 
  }
  return value.toLocaleString('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

  
    const handleGetOwnerInfo = async () => {
      try {
        const response = await fetch(`/api/redirect/ownerinvite?inviteCode=${inviteCode}`);
  
        if (response.ok) {
          const data = await response.json();
          setOwnerInfo(data);
          setErrorMessage('');
        } else {
          const data = await response.json();
          setOwnerInfo(null);
          setErrorMessage(data.error);
        }
      } catch (error) {
        setOwnerInfo(null);
        setErrorMessage('Ocorreu um erro ao buscar as informações do proprietário.');
      }
    };


    const getGuestInfo = async (inviteCode: string) => {
      try {
        const response = await fetch(`/api/redirect/guestInfo?inviteCode=${inviteCode}`, {
        method: 'POST',
        body: JSON.stringify({
          Iduser: userInfo?.user.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
        if (response.ok) {
          const data = await response.json();
          return data; // Retorna as informações do convidado
        } else {
          const data = await response.json();
          // console.error('Error fetching guest info:', data.error);
          return null;
        }
      } catch (error) {
        // console.error('Error fetching guest info:', error);
        return null;
      }
    };



























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
    
      
      const removeFromCart = (itemId: string) => {
        setCart((prev: any) => prev.filter((item: any) => item.id !== itemId))
      }
    
      const getTotalCartValue = () => {
        return formatCurrency(cart.reduce((total: any, item: any) => total + (Number.parseFloat(item.priceitem) || 0) * item.quantity, 0))
      }
    
      
      const [isPurchasing, setIsPurchasing] = useState(false)
      const [purchaseError, setPurchaseError] = useState<string | null>(null)
      const [purchaseSuccess, setPurchaseSuccess] = useState(false)
    
    useEffect(() => {
 
      if (cart.length > 6) {
               setIsPurchasing(true)
          } else {
            setIsPurchasing(false)
          }
         
    
    }, [cart]);
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
    

    return(
      <>
     <Vbn>
    
         <ContainerIo className={market ? "relative" : "mobile " } navbar={navbar}>
      
      <Content >
      <nav className="gap-[22.4px] flex items-center">
        
       <li>
     

      {istopbar && (
  <a onClick={() => router.push('/')}> 
     <LogoVision />
     {market && (
     <h3 className="customtrvo">Club</h3> 
     )}
      </a>
      )}
      {about && (
        <>
         <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-help" width="34" height="34"  viewBox="0 0 24 24" stroke-width="1.5"  fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 21 14.5 1" stroke="#2f2f337d"></path>
       </svg>
        <h3>{about}</h3> 
        </>
       )} 
      
       </li>
        
       {loading ? null : userInfo && (
        <>
         {market && (
            
      

             <div className="relative Margind flex flex-shrink-0 items-center gap-2 whitespace-nowrap text-[12px] font-semibold text-navy-200 transition duration-500 ease-expo group-hover:text-white  ">
             {navItems.map((item, index) => (
              <Tooltip title={item.title}>
                 <button key={index} onClick={() => router.push(item.url)} className={`grid-stack grid bg-[#292b29] aspect-square w-10 h-10 flex-shrink-0 place-items-center rounded-[19px] hover:bg-[#2024203c] ${isActive(item.url)}`}>
                
                {item.icon}
            </button>
              </Tooltip>
               
             ))}
             </div>
       
         )}
        </>
       )}
             

                

             </nav>

           
           {!userInfo && (
                <ul className="mobivl">
         
          <Link href={ROUTENVX.storePrime} className={isActive(ROUTENVX.storePrime)}>PREMIUM</Link>
          <Link href={ROUTENVX.Store} className={isActive(ROUTENVX.Store)}>LOJA</Link>  
          <Link href={ROUTENVX.signin} className={isActive(ROUTENVX.signin)}>CLUBVISION</Link>
           <Link href={ROUTENVX.leaderboard} className={isActive(ROUTENVX.leaderboard)}>Leaderboard</Link>
           </ul>
           )}

      <ul>
      

            {isLoading || loading ? (
              <>
               <MarginImagsx >
          <img src="/icons/market/20250325_192605.webp"  alt="novision" width={35} height={35} className="b1"/>
          <img src="/icons/market/20250325_192624.webp"  alt="novision" width={35} height={35}  className="b2"/>
       </MarginImagsx>
              </>
            ) : userInfo ? (
              <>
             
              {isbalance && total > 0 && (
               <Marginquantity>
                 <span className='cRS' onClick={() => router.push(ROUTENVX.wallet)}>
                $
                 </span>

                 <section>
                  <div className="flex items-center gap-1">
                     <Image src={Orbit} alt="bits" height={16} className="grayscale" /> 
                       <h3>   {isLoading ? (
             <>
             ---- 
             </>
          ) : userwallet  && (
            <>{formatNumber(total ? total : 0)}</>
          )}</h3>
                  </div>
                 
                  <p>Saldo da carteira</p>
                 </section>
             </Marginquantity>

              )}
        
             <MarginPoints className="activemobile">
              
              <ul className={userD?.prime ? 'flex ' : 'flex-col gap-[0.3em]'}>
                 <li >
            
                {userwallet && userwallet.bits > 0  && isLoading ? (
             <>
                  <Image src={Bits} alt="bits" height={15}  />
                
             <h6 className="green text-[12px]">----</h6> 
             </>
          ) : userwallet && userwallet.bits > 0 && (
            <>
                 <Image src={Bits} alt="bits" height={15}  />
                 <h6 className="green text-[12px]">{formatNumber(userwallet.bits ? userwallet.bits : 0)}</h6>
            </>
         
          )}
  
              </li>
    <li>
            
                {userwallet && userwallet.token > 0  && isLoading ? (
             <>
                  <Image src={Bits} alt="bits" height={15}  />
                
             <h6 className="white text-[12px]">----</h6> 
             </>
          ) : userwallet && userwallet.token > 0 && (
            <>
                 <Image src={Vtoken} alt="v-token" height={15}  />
                 <h6 className="white text-[12px]">{formatNumber(userwallet.token ? userwallet.token : 0)}</h6>
            </>
         
          )}
  
              </li>


              </ul>
             
             {userD !== null &&  (
                 <>
                
{userD.prime && userD.typeprime == 'Plus' ? (
                  <li>
                  <Image src={Crown} alt="Prime" height={15}  />
                   <h6 className="gold">Premium +</h6>
                </li>
                 ) : userD.typeprime == 'Bloom' &&  
                  <li>
                 <Image src={Crown} alt="Prime" height={15}  />
                  <h6 className="gold">Bloom</h6>
               </li>
               }
                 </>
             )}
             
          </MarginPoints>
           
           {(userwallet && userwallet.bits > 0 || total > 0) && (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler activemobile  icon-tabler-help" width="34" height="34"  viewBox="0 0 24 24" stroke-width="1.5"  fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path d="M1 21 14.5 1" stroke="#2f2f337d"></path>
 </svg>

           ) }
 
          
       {istopbar &&  <li className="activemobile">
     
        
        <span onClick={handlecode}>
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-bomb" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#28d369" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M15.349 5.349l3.301 3.301a1.2 1.2 0 0 1 0 1.698l-.972 .972a7.5 7.5 0 1 1 -5 -5l.972 -.972a1.2 1.2 0 0 1 1.698 0z" />
  <path d="M17 7l1.293 -1.293a2.414 2.414 0 0 0 .707 -1.707a1 1 0 0 1 1 -1h1" />
  <path d="M7 13a3 3 0 0 1 3 -3" />
</svg>
         
       <h4>USAR CODIGO</h4>
        </span> 

       
      </li>}
   
   

    <ProfileContainer>
      <AvatarLink href={ROUTENVX.DashboardProfile} data-testid="header-user-avatar-btn">
        <AvatarImage src={userInfo?.user.avatar || "https://placehold.co/50x50/1F1F27/FFFFFF?text=User"} alt="User Avatar" 
         
        />
            <LevelLabel data-testid="user-avatar-level-xp-label">{userInfox?.level || 'N/A'}</LevelLabel>
        <XpBarContainer>
          <XpBarProgress />
        </XpBarContainer>
      </AvatarLink>
      <MenuButtonContainer data-headlessui-state="">
       
           {istopbar && !mobilemenu && (
     <>
       <MenuButton
        onClick={MobileMenu} 
          data-testid="account-menu-dropdown-expand-btn"
          id="headlessui-menu-button-:r6g:" // Example ID
          type="button"
          aria-haspopup="menu"
          aria-expanded="false" // This should be dynamic based on menu state
          data-headlessui-state="" // This should be dynamic
        >
    <Menu size="20" color="#b2bbb6" variant="Broken"/>
   </MenuButton>
     </>
    )}
         
             <MenuButton>
              
          <CartButton onClick={() => setShowCartModal(true)} hasItems={cart.length > 0}>
            
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b2bbb6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.103 6.034h17.794"/><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/></svg>
             
              {cart.length > 0 && (
                <CartBadge>
                  <span>{cart.length}</span>
                  <BadgePulse />
                </CartBadge>
              )}
           
            </CartButton>
       
            </MenuButton>
      </MenuButtonContainer>
      {mobilemenu && (
          
      <GamingDashboard isOpen={() => setmobilemenu(false)} userInfo={userInfo} userInfox={userInfox} orbit={formatNumber(total ? total : 0)} vtoken={formatNumber(userwallet?.token ? userwallet.token : 0)} balance={formatNumber(userwallet?.bits ? userwallet.bits : 0)}/>

      
    )}
  
    </ProfileContainer>
 
  
               </>
             ) : (
              <>
           
         
     

       <ButtonSSS onClick={() => router.push(ROUTENVX.login)}>
       <h4>CONECTE-SE</h4>
       <i className="fi fi-brands-discord i" />
      </ButtonSSS>
              </>
             )}
             </ul>
            </Content>

            <div className={mobilemenu ? 'display-none' : ''}>
            {nav}
            </div>
         
     </ContainerIo>
    
     </Vbn>
     
    
    
   
     {iscodeuse && (
      <Wrapp>
      <CardCode>
      <MargintopSelect>
        
        <button onClick={Opencodebits}  className={iscodebits ? 'active bits' : ''}>
        <img src="/icons/coins/orbit-novision.webp" alt="" />
        <span>use o Código Bits!</span>
        </button>
{userD !== null && (
     <button
     onClick={Opencodeinvite}
     disabled={userD.type ? true : false}
     className={iscodeinvite ? 'active code' : ''}
     style={{ cursor: userD?.type && ' not-allowed' }} // Alterando o estilo do cursor
   >
     <img className='DIC' src="/nvrp/20240520_081457.png" alt="" />
     <span>Codigo Ativação</span>
   </button>
)}
    

        <span onClick={handleclosemod}className='button1'> 
        <svg className="icon h-5 w-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
  </svg>
        </span>
      </MargintopSelect>
          
       {iscodebits && (
        <>
         <ContentCardCode>
      <Wrapper>
    <ImageContainer>
      <img src="/theim/characters/3a99957dee6097579ab76154c5f4059a.webp" alt="Codigo bits" />
    </ImageContainer>
    <ContentContainer>
      <PromoContainer>
        <IconWrapper data-testid="coupon_modal_exclamation_icon">
          <svg className="icon" viewBox="0 0 4 13" fill="none" height={14} width={14} >
            <path fill="currentColor"  d="M0.872478 8.32093H2.87848L3.15048 0.109931H0.583478L0.872478 8.32093ZM3.37148 10.9049C3.37148 10.1229 2.75948 9.51093 1.92648 9.51093C1.05948 9.51093 0.447478 10.1229 0.447478 10.9049C0.447478 11.6869 1.05948 12.2989 1.92648 12.2989C2.75948 12.2989 3.37148 11.6869 3.37148 10.9049Z" />
          </svg>
        </IconWrapper>
        <InfoWrapper>
          <div style={{ display: 'flex' }}>
            <Title>Resgate quantias de bits com codigos!</Title>
          </div>
          <Description>Introduza o codigo de resgate de bits <span> Uso limitado por conta. </span></Description>
        </InfoWrapper>
      </PromoContainer>
    </ContentContainer>
     
  </Wrapper>
  <ModalWrapper>
    <FormContainer data-testid="use_code_modal_form">
      <InputWrapper>
        <Input 
        type="text"
         value={Codebits}
        autoComplete="nope"
         onChange={(e) => setCodebits(e.target.value)}
        placeholder="NVRP-XXXXXXXXXXX" />
      </InputWrapper>
      <ApplyButton 
      type="button" 
      onClick={handleAuthorizeCodebits} 
      disabled={isVerifying}>{isVerifying ? 'Verificando...' : 'Aplicar'}</ApplyButton>
    </FormContainer>
    {isFormSubmitted &&  
              <>
              <NotificationUI message={responseMessage} />
              </>}
  </ModalWrapper>


      </ContentCardCode>
 
      <MarginTitle>
          <h1>Histórico de códigos</h1>
        </MarginTitle>
 
        <CustomScrollbar>
            <Table data-testid="codes_table">
              <Thead>
                <Tr>
                  <Th>CÓDIGO PROMOCIONAL</Th>
                  <Th>MONTANTE DO BÓNUS</Th>
                  <Th>DATA DE USO</Th>
                </Tr>
              </Thead>
              <Tbody>
              {(redemptionHistory && redemptionHistory.length > 0) ? (
 redemptionHistory.sort((a, b) => {
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();
  return dateB - dateA;
})
    .map((entry, index) => (
      <Tr key={index}>
        <Td>{entry.code.replace('NVRP-', '')}</Td> 
        <CenteredTd>
          <BonusSpan>  <img src="/icons/coins/orbit-novision.webp" alt="" /> <p>{entry.bonus}</p> </BonusSpan>
        </CenteredTd>
        <Td>{new Date(entry.date).toLocaleString()}</Td>
      </Tr>
    ))
  ) : null}
              </Tbody>
            </Table>
          </CustomScrollbar>
     
   </>    
       )}

      {iscodeinvite && (
          <>
          
          <ContentCardCode>
      <Wrapper>
    <ImageContainer>
      <img src="/theim/characters/hdbufnsybvfjsib.png" alt="Promoção" />
    </ImageContainer>
    <ContentContainer>
      <PromoContainer>
        <IconWrapper data-testid="coupon_modal_exclamation_icon">
          <svg className="icon" viewBox="0 0 4 13" fill="none" height={14} width={14} >
            <path fill="currentColor"  d="M0.872478 8.32093H2.87848L3.15048 0.109931H0.583478L0.872478 8.32093ZM3.37148 10.9049C3.37148 10.1229 2.75948 9.51093 1.92648 9.51093C1.05948 9.51093 0.447478 10.1229 0.447478 10.9049C0.447478 11.6869 1.05948 12.2989 1.92648 12.2989C2.75948 12.2989 3.37148 11.6869 3.37148 10.9049Z" />
          </svg>
        </IconWrapper>
        <InfoWrapper>
          <div style={{ display: 'flex' }}>
            <Title>{userD?.type ? 'Você já é um membro autorizado!' : 'Adicione aqui o token convite amigo!'}</Title>
          </div>
          <Description>{userD?.type ? 'Basta clicar  em jogar agora e pronto sua conexão em thenovision sera iniciada.. ' : (<>Introduza o token de ativação de Conta <span> Recebido por um amigo. </span></>)}</Description>
        </InfoWrapper>
      </PromoContainer>
    </ContentContainer>
     
  </Wrapper>
  <ModalWrapper>
    <FormContainer data-testid="use_code_modal_form">
      <InputWrapper>
        <Input 
        type="text"
         value={inviteCode}
        autoComplete="nope"
         onChange={(e) => setInviteCode(e.target.value)}
        placeholder="NVRP-XXXXX-XXXX-XX"
        readOnly={userD?.type ? true : false} />
      </InputWrapper>
      <ApplyButton 
      type="button" 
      onClick={handleAuthorize} 
      disabled={isVerifying || userD?.type ? true : false}>{isVerifying ? 'Verificando...' : 'Aplicar'}</ApplyButton>
    </FormContainer>
    {isFormSubmitted &&  
              <>
              <NotificationUI message={responseMessage} />
              </>}
  </ModalWrapper>


      </ContentCardCode>
 
  
        {ownerInfo && (
          <>
          
      <MarginTitle>
          <h1>Informações</h1>
        </MarginTitle>
 


        <CardInfoowner>
       
       <Image src={ownerInfo.Avatare} 
          alt={ownerInfo.userName} 
          className="logo"
          height={60} width={60}/>
          <li>
          <h5>{ownerInfo.userName} convidou vocè</h5>
          <p>Você agora faz parte da comunidade. Seja Bem-vindo!</p>
           </li>
           
        </CardInfoowner>

        </>
      )}

          </>
      )}
      
     
      </CardCode>
      </Wrapp>
     )}




 {istopbar && showCartModal && (
        <ModalOverlay onClick={() => setShowCartModal(false)}>
         <CartModalContent onClick={(e) => e.stopPropagation()}>
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
            

            {purchaseError && (
              <ErrorMessage>
                <ErrorIcon>⚠️</ErrorIcon>
                {purchaseError}
              </ErrorMessage>
            )}
            {purchaseSuccess && (
              <SuccessMessage>
                <SuccessIcon>✅</SuccessIcon>
                Compra realizada com sucesso!
              </SuccessMessage>
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
        </ModalOverlay>
      )}

   </>
    )
}





 
const MTS = styled.div`
  padding: 0.3em 0.7em 0.3em;
  border-radius: 12px;
  background-color: rgba(42, 43, 42, 0.671);
  margin: 0.8em;

  .g4j{
    color: #959c99;
    font-size: 38px;
  }

  .g4j:hover{
    color: #dee2e0;
  }

  @media screen and (max-width: 540px){
     
     .g4j{
       font-size: 19px;
     }  
   }
    
  
`;
 
const CustomScrollbar = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 500px;
  table-layout: fixed;
  font-size: 0.75rem; 
  text-transform: uppercase;
`;

const Thead = styled.thead``;

const Tr = styled.tr`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const Th = styled.th`
  padding: 1rem 0; 
  text-align: left;
  font-weight: 600; 
  
  &:nth-child(2) {
    text-align: center;
  }
  
  &:nth-child(3) {
    text-align: right;
  }
`;

const Tbody = styled.tbody`
  width: 100%;
  font-weight: 600;

  font-family: 'ProximaNova-Italic', sans-serif;
  color: white;

  & > *:nth-child(odd) {
    background-color: #101011; 
    border-radius: 12px;
  }
`;

const Td = styled.td`
  display: flex;
  align-items: center;
  justify-content: flex-start; 
  padding: 0.75rem 0; 

  &:first-child {
    border-radius: 6px 0 0 6px; 
    padding-left: 1rem;
  }

  &:last-child {
    justify-content: flex-end;
    border-radius: 0 6px 6px 0; 
    padding-right: 1rem; 
  }
`;

const CenteredTd = styled(Td)`
  justify-content: center;
  gap: 0.25rem; 
  padding: 1rem; 
`;

const BonusSpan = styled.span`
  font-weight: 600; 
  display: inline-flex;
  align-items: center;
  color: #19e256;

   img {
    height: 20px; 
    width: 26px; 
   padding-right: 0.4em;
  }
`;


const MarginTitle = styled.div`
  display: flex;
  margin-top: 1em;
  margin-bottom: 2em;
  width: 100%;
  justify-content: center;
  border-bottom: 1px solid rgba(183, 184, 189, 0.288);

   h1{
    font-size: 18px;
    padding: 1em;
     color: #a2aca6;
     border-bottom: 1px solid rgba(213, 214, 219, 0.753);
     font-family: 'ProximaNova-Italic';
   }
`;


const CardInfoowner = styled.div`
  display: flex;
  flex-direction: column;
  
  align-items: center;
  justify-content: space-between;
  
  background-color: rgba(31, 31, 34, 0.055);
  background-image: url('/icons/084mnfgjhdgdfyt4n.png');
   
   padding: 0.9em 2em 0.9em;
   margin: 1em;
    margin-bottom: 0em;
  .logo{
    border-radius: 16px;
  }

  li{
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 1em;
   
    h5{
      margin-bottom: 0.2em;
      font-size: 16px;
      font-family: 'Europa Grotesk';
      color: rgba(190, 201, 192, 0.774);
    }
   
    p{
      font-family: 'InterSemiBold', monospace;
      font-size: 13px;
      color: #bfc2c9f6;
    }
  }

  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-in-out forwards;
  @keyframes fadeInUp {
    0%{ opacity: 0; transform: translateX(20%)}
    100%{ opacity: 1; transform: translateX(0)}
  }
  
`;

const ModalWrapper = styled.div`
   
   position: absolute;
  z-index: 10;
  bottom: 4px;
  left: 0;
  right: 0;
  
  margin: 0.4em;
 
  border-radius: 0.75rem; 
  background:  #0b0b0cfd;
  padding: 0;

  @media (min-width: 768px) {
    padding: 1.25rem; /* md:p-5 */
  }
`;

const FormContainer = styled.div`
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.25rem;   
  border-radius: 55px;  
  background:  #2c2c3040;
  
  button:disabled{
    background-color: rgba(151, 61, 61, 0.192);
    color: rgba(238, 231, 231, 0.432);
    font-weight: 300;
    cursor: not-allowed;
  }
  @media screen and (max-width: 430px) {
    background:  transparent;
    gap: 0.5rem;
}
`;

const InputWrapper = styled.div`
  position: relative;
  flex-grow: 1;
`;

const Input = styled.input`
  height: 20px; 
  width: 100%;
  font-size: 15px;
  font-family: 'InterSemiBold', monospace;
  background: transparent;
  padding: 1rem 1.25rem; 
  color: #d6d9e6; 

  placeholder {
    color: #B8BCD0;
  }
  &:focus {
    outline: none;
    box-shadow: none; 
  }
  &:disabled {
    opacity: 0.5;
  }
`;

const ApplyButton = styled.button`
  padding: 0 1.25rem; 
  background-color: #d9e4de; 
  border: none;
  border-radius: 55px;  
  cursor: var(--f-cursor-pointer);
  font-family: 'XcSemibold';
  min-width: 140px;
  margin-right: 0.3em;
  font-size: 14px;
  height: 2.7rem; 
  color: black;
  
  
  &:hover {
    background-color: #1cbd51;   
  }

  @media screen and (max-width: 430px) {
 
    font-size: 15px;
    padding: 0.5em 0.7em 0.5em; 
}
`;

const Wrapper = styled.div`
display: flex;
align-items: center;
position: relative;
justify-content: center;
height: auto;
 
@media (min-width: 768px) {
  height: 12rem; /* md:h-48 */
}
 
`;

const ImageContainer = styled.div`
position: relative;
z-index: 10;
aspect-ratio: 0.7 / 1; 
height: 100%;
  
img {
  left: 1px;
  height: 100%;
  object-fit: contain;
  transform: scale(1);
}

@media screen and (max-width: 430px) {
  display: none;
 
}
`;

const ContentContainer = styled.div`
flex-grow:5;
margin-left: -5rem;

@media (min-width: 640px) {
  margin-left: -5rem;
  margin-right: -4rem; 
  flex-grow:2;
}

@media screen and (max-width: 430px) {
  margin-left: 0rem;
}
`;

const PromoContainer = styled.div`
display: flex;
gap: 0.5rem;
width: auto;
padding: 1rem 0.4rem 0.5rem;
background: linear-gradient(90deg, rgba(119, 255, 157, 0.1) 0%, rgba(17, 17, 20, 0) 156.79%);
 
@media (min-width: 640px) {
  padding-left: 3rem; /* sm:pl-28 */
  padding-right: 2rem; /* sm:pr-8 */
}

@media screen and (max-width: 430px) {
  padding-left: 2rem; /* sm:pl-28 */
  padding-right: 2rem; /* sm:pr-8 */
  border-radius: 12px;
}
`;

const IconWrapper = styled.span`
display: flex;
height: 2rem;
width: 2rem;
flex-shrink: 0;
align-items: center;
justify-content: center;
border-radius: 50%;
background-color: #228b22; /* bg-eco-green-800 */
color: #32cd32; /* text-green-400 */
`;

const InfoWrapper = styled.div`
flex: 1;
display: flex;
flex-direction: column;
gap: 0.5rem;
text-align: left;
color: white;
`;

const Title = styled.p`
font-size: 14px;
font-weight: 600;
`;

const TooltipButton = styled.button`
margin-left: 0.25rem;
cursor: pointer;
padding: 0.5rem;
background: none;

svg {
  height: 1.25rem;
  width: 1.25rem;
  color: rgba(255, 255, 255, 0.5);
  transition: color 200ms;

  &:hover {
    color: rgba(255, 255, 255, 1);
  }
}
`;

const Description = styled.p`
font-size: 12px;
max-width: 280px;
margin-top: 0.25rem;

span {
  font-weight: 600;
  color: #32cd32; /* text-green-400 */
}

 
`;


const Wrapp = styled.div`

position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9345774;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  place-items: center;
  align-items: center;
  background-color: rgba(11, 12, 10, 0.349);
  background-image: url('/web/hdshfioef.png');

  @media screen and (max-width: 530px) {
  padding: 0.4em;
}
`;

const CardCode = styled.div`
background-color: #1f201f;
padding: 1em;
max-height: 90%;
width: 550px;
overflow-y: auto;
border-radius: 23px;
animation: AnimOps 1s linear;

 
@keyframes AnimOps {
  0%{ opacity: 0;}
  100% { opacity: 1;}
}
@media screen and (max-width: 530px) {
  width: 100%;
  border-radius: 23px;
  height: 90vh;
 
}
`;


const MargintopSelect = styled.div`
  width: 100%;
  display: flex;
  height: 3.5rem; 
  gap: 0.125rem; 
  overflow: hidden;
  border-top-left-radius: 0.75rem; 
  border-top-right-radius: 0.75rem; 
  
  .active{
   
    .DIC{
      filter: brightness(0); 
    }
  }

  .bits{
      background:#00ff6275;
     }
    .code{
      background:#da961940;
    }

  .button1{
    margin-left: auto; 
  display: grid;
  width: 41px; 
  cursor: var(--f-cursor-pointer);
  place-content: center;
  background:  #2c2c3040;
  transition: background-color 200ms, color 200ms; 
  
  &:hover {
    background-color: #16161b;
    color: white; 
  }

  svg {
    height: 1.25rem; 
    width: 1.25rem;  
  }
  }

  
  button{
    display: flex;
  height: 100%;
  
  flex: 1;
  cursor: var(--f-cursor-pointer);
  align-items: center;
  justify-content: center;
  gap: 0.75rem; 
  background:  #2c2c3040;
  font-size: 0.875rem; 
  font-weight: 600; 
  font-family: 'ProximaNova-Italic', sans-serif;
  text-transform: uppercase; 
  color: white;
  transition: background-color 150ms;
  
  &:hover {
    background-color: #16161b;
  }

  img {
    height: 1.25rem; 
    width: 1.25rem; 
     
  }
   .DIC{
    filter: brightness(10); 
   }
  span {
    display: none;

    @media (min-width: 640px) { /* sm:inline */
      display: inline;
    }
  }
    
  }

  .buttonclose{
    background:  #12131240;
    width: 100%;
    border-radius: 50%;
    padding: 5px;

  }
`;

const ContentCardCode = styled.div`
background:  #2c2c3040;
margin-top: 0.1em;
border-radius: 0 0 0.75rem 0.75rem;
padding: 1em;
overflow: hidden;
position: relative;
height: 280px;

 
@media screen and (max-width: 430px) {
  height: 220px;

}

`;

 
const CardViewList = styled.div`
   
  padding: 0.1em;
  border-radius: 6px;
  width: 100%;
  display: inline-flex;
  border-radius: 100px;
  overflow-x: auto;
  cursor:  var(--f-cursor-grab);

:active {
cursor:  var(--f-cursor-grabbed);
}


 
`;




///////////////////////////////

const SelectType = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 1em 1em 2em;
  width: 100%;
  gap: 8px;
  
 

  @media screen and (max-width: 540px){
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: 1em  0.2em 2em;
  }
   
 
`;

const BadgeContainer = styled.button`
  text-align: center;
  background-color: #e9ecead5;
  border-radius: 9999px;
  padding: 0.125rem;
  display: inline-block;

   
  .active{
    background-color: #3bc77a;
  }
`;

const BadgeCs = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  padding: 0.25rem 1rem;
  border: 2px solid #222020; 
  border-radius: 9999px;
  display: flex;
  font-size: 12px;
  align-items: center;
  gap: 0.625rem;
  color: #1a1818;

  
`;

 
 

export const MarginImagsx = styled.div`
 width: 100%;
 height: 100%;
 display: flex;
 justify-content: center;
 place-items: center;
 
 
  .b1{
    position: absolute;
    animation: Rotate 0.9s infinite;
  }
 
 @keyframes Rotate {
   0%{ transform: rotate(360deg) }
   100%{ transform: rotate(0deg) }
 }


 @media screen and (max-width: 580px) {
  display: none;

  
 }

`;

const Text = styled.span`
  font-size: 0.875rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  display: inline;
  @media (min-width: 400px) {
    display: inline;
  }
  @media (min-width: 768px) {
    display: none;
  }
  @media (min-width: 850px) {
    display: inline;
  }
  @media (min-width: 1150px) {
    display: none;
  }
  @media (min-width: 1500px) {
    display: inline;
  }
`;

const Percentage = styled.span`
  font-size: 0.875rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #38A169;
  display: none;
  @media (min-width: 768px) {
    display: inline;
  }
`;

const BonusContainer = styled.div`
  position: absolute;
  right: 0;
  transform: rotate(30deg);
  font-size: 6rem;
  font-weight: bold;
  line-height: none;
  color: #38A169;
  opacity: 0.05;
  transition: transform 0.2s;
  &:hover {
    transform: translateX(-1.5rem) translateY(0.75rem) scale(1.25);
    transition-duration: 0.4s;
  }
  display: block;
  @media (min-width: 640px) {
    display: block;
  }
`;

const FlexBox = styled.div`
   position: absolute;
  right: -3rem;
  top: 0;
  height: 2.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 1rem;
  padding-right: 0.5rem;
  border-radius: 0.5rem 0 0 0.5rem;
  background-color: #2E3244;
  display: none;
  @media (min-width: 768px) {
    display: flex;
  }
`;

const SmallText = styled.span`
  font-size: 0.5rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 2em 0.5em;
  position: absolute;
  top: 1px;
  width: 100%;
  margin-bottom: 20px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(204deg, #3c413f40 -7%, #b85cff00 33%), linear-gradient(162deg, #3c413f40 -10%, #2c88dd00 25%), linear-gradient(0deg, #3c413f40, #3c413f40);
  padding: 0.2em 0.6em 0.2em;
  border-radius: 22px;
  gap: 8px;
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
 
`;

const Username = styled.h2`
  margin: 0;
  font-size: 13px;
`;

const Rank = styled.div`
   margin: 0.3em;
`;



const SectionTitle = styled.h3`
  margin-top: 17px;
  text-align: start;
  font-size: 15px;
  margin-bottom: 10px;
  padding: 0.4em 1em 0.4em;
  font-family: 'ProximaNova-Italic', monospace;
  color: #d3d6df;
  text-transform: uppercase;
`;

const Section = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  

  @media screen and (max-width: 490px) {
    width: 100%;
    display: inline-flex;
  }
`;

const ButtonCb = styled.button`
 
  width: 100%;
  
  cursor: pointer;
  display: flex;
  align-items: center;   
  font-weight: bold;
  align-items: center;
  gap: 9px;
  transition: background-color 0.3s ease;
   
  .jsdul{
    display: flex;
  align-items: center;   
  font-weight: bold;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  }
   h3{
    font-size: 38px;
    font-family: 'akac';
    text-transform: uppercase;
    color: #bec7c3;
   }


  h3:hover{
    color: #818885;
  }


  .activevc{
     height: 15px;
     width: 15px;
     border-radius: 50%;
     background-color: #34c765;
  }

  @media screen and (max-width: 540px){
     
    h3{
      font-size: 19px;
    }  
  }
   
`;
 
const MarginPoints = styled.div` 
display: flex;
flex-direction: column;
padding: 0.3em 0.4em 0.3em;

  li{
    display: inline-flex;
    
    h6{
      padding-left: 0.4em;
      font-size: 12px;
    }

    .gold{
      color: #c5e9d5;
    }

    .green{
      color: #1fd471;
    }

    .white{
      color: #ebf1ef;
    }
   
  }

`;


const Marginquantity = styled.div`
   display: flex;
   align-items: center;
   padding: 0.3em 0.5em 0.3em;

   .cRS{
    background-color: #24382b;
    color: #caced6;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 52px;
    width: 35px;
    font-size: 21px;
    padding: 0.4em 0.7em 0.4em;
   }

   .grayscale{
     filter: grayscale(1);
   }

   section{
    margin: 0.3em;

    h3{
      font-size: 16px;
      font-family: 'Inter', monospace;
    }

    p{
      font-family: 'ProximaNova-Italic', monospace;
      color: #a1a4a8;
      font-size: 9px;
      text-transform: uppercase;
    }
   }


   @media screen and (max-width: 540px) {
     display: none;
   }
`;


const ButtonSSS = styled.button`
    border-radius: 13px;
    
    color: rgb(31, 226, 96);
     
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.1em 0.3em 0.1em;
    transition: ease .2s;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
   transition: 1s all;
   display: flex;
   align-items: center;
  

   .i{
    transition: 1s all;
      color: #d3d3da;
        font-size: 19px;
        margin-left: 0.4em;
        border-radius: 9px;
        height: 33px;
        width: 33px;
        padding: 6px 0.3em 0.2em;
    }

   h4{
    font-size: 12px;
    font-family: 'Inter', monospace;
    color: #e4dbdb;
    font-weight: 900;
    padding-left: 0.7em;
   }
  
   &:hover{
    background: linear-gradient(130deg, rgba(0,0,0,1) 0%, rgba(17,19,22,1) 100%);
     box-shadow: 0 0 1.5625rem #d4dbd652;

     h4{
      color: white;
     }
     
     i{
      color: #080808;
      background-color: rgb(228, 228, 238);
     }
   }

 
`;

 

const MobileMenuMargin = styled.div`
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 99999999;
    display: flex;
    padding: 1em;
    justify-content: space-between;
    align-items: top;
    right: 0;
    backdrop-filter: blur(145px);
    
    animation: Cvx 0.3s linear;
    
    @media screen and (max-width: 540px){
      padding: 1em;
  }
 @keyframes Cvx {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
 }
`;

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


 @media screen and (max-width: 580px) {
  display: none;

  
 }

`;

const MenuMobile = styled.div`
   
   
   padding: 5em 1em 1em;
  width: 90vw;
  border-radius: 19px ;
 border: 2px solid #212221;
  overflow-y: auto; 
  position: relative;
   height: 95vh;
   backdrop-filter: blur(16px);
   background: linear-gradient(204deg, #d5d8d640 -7%, #b85cff00 33%), linear-gradient(162deg, #14161540 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
      
   animation: Cvxx 0.3s linear;
    

   &::-webkit-scrollbar {
     display: none;
  }

 &::selection{
  display: none;
 }

    @keyframes Cvxx {
       0%{ transform: translateX(100%)}
       100%{ transform: translateX(0%)}
    }
    .logoroda{
        border-radius: 14px;
        text-align: center;
    }


    @media screen and (max-width: 430px) {
       width: 100vw;
       z-index: 6;
      
    }

   
    

    ul{
    display: flex;
    align-items: center;
    padding: 0.2em 1em 0.2em;
    justify-content: space-between;

    a{
      font-family: 'InterSemiBold', monospace;
      font-size: 12px;
      color: rgba(99, 100, 105, 0.342);
      margin: 0.3em;
      transition: 0.7s all;

      &:hover{
        color: #fff;
      }
    }
  }
`;


const Vbn = styled.div`
 position: relative;
 overflow: visible;
 .avbx{
  background-color: #2024203c;
 }
@media screen and (max-width: 560px){
    
    .mobile{
      top: -1px;
    position: fixed;
  
    }
    .buttons{
      display: none;
    }

    .Margind{
      display: none;
    }

      
   }
     
   @media screen and (max-width: 870px) {
    .mobivl{
      display: none;
     }
   }

     .hcndbc{
       color: #27cc5e;
     }
`;

 

const ContainerIo = styled.nav<any>`
  
 width: 100%;
 /* background: linear-gradient(to top, transparent, transparent 60%, #0B0C0A); */
 top: -1px;
 left: 0;
 padding: 0.5em 1em 0.5em;
 z-index: 163;
 position: ${(props) => (props.navbar === 'relative' ? 'relative' : 'absolute')};
   

 .display-none{
   display: none;
 }
 .buttons {
  border-radius: 45px;
    background: transparent;
    color: rgb(31, 226, 96);
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
 
    line-height: 100%;
     
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.1em 0.3em 0.1em;
    transition: ease .2s;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
    display: flex;
    overflow: hidden;
    align-items: center;
    position: relative;

    .i {
        transition: background-color 0.3s ease;
        color: #dfdfe7;
        background-color: black;
        font-size: 19px;
        border-radius: 50%;
        height: 33px;
        width: 33px;
        z-index: 1;
        padding: 6px 0.3em 0.2em;
    }

    .dcv {
         
      position: absolute;



        visibility: hidden;
        float: right;
        right: 7px;
        opacity: 0;
        transition: opacity 0.3s ease, visibility 0s 0.3s;
    }

    h4 {
        font-size: 12px;
        font-family: 'Inter', monospace;
        color: #050404;
        font-weight: 900;
        padding-left: 1em;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.1s ease;
    }

    &:hover {
        background: linear-gradient(130deg, #e4ebe6 0%, #bbc0bd 100%);
        width: 130px;
        h4 {
            transform: translateX(0);
            opacity: 1;
        }

        .dcv {
            visibility: visible;
            opacity: 1;
            transition-delay: 0s;
             
        }

        .i {
            background-color: #26dd6c;
        }
    }
}
 
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between; 
  align-items: center;
 
  .logo{
    border: 3px solid rgba(91, 91, 99, 0.438);
    border-radius: 80%;
    cursor: var(--f-cursor-pointer);
  }

  .customtrvo{
    font-family: 'Graffiti';
    font-size: 11px;
    color: #11e97d;
    font-weight: 300;
    position: absolute;
    right: -9px;
    transform: rotate(-7deg);
    top: 80%;
  }

  a{
    position: relative;
  }
  span{
    display: inline-flex;
    align-items: center;
    cursor: var(--f-cursor-pointer);
     
    h4{
      font-size: 13px;
      padding-left: 0.4em;
      text-transform: uppercase;
      color: #27c463;
      font-family: 'XcSemibold', monospace;
    }

    &:hover{
      transform: scale(0.9);
    }
  }


  h3{
      font-family: 'XcSemibold';
      font-size: 15px; 
      color: #becac3;
      max-width: 210px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  text-transform: uppercase;
  display: -webkit-box;
  -webkit-line-clamp: 1;
 
  -webkit-box-orient: vertical;
    }


 
  
  .logof{
    filter: saturate(0);
  }

 
  ul{
    display: flex;
    align-items: center;
    gap: 9px;
  
  }
 
 
  li{
    display: inline-flex;
    align-items: center;

    h3{
      font-family: 'Inter', monospace;
      font-size: 15px; 
      color: #becac3;
      max-width: 210px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
   
  -webkit-box-orient: vertical;
    }


    

  }
   
  .Mobilebutton{
     display: none;
   }

  a{
    font-size: 13px;
 
    font-size: 12px;
    font-family: 'Inter', monospace;
    color: #becac3;
    font-weight: 900;
    text-transform: uppercase;
  

    &:hover{
      color:#22dd5a;
    }
  }
  
  @media screen and (max-width: 450px) {
     
    .bvc{
      display: none;
    }

     .Mobilebutton{
     display: block;
   }
 
   .activemobile{
    display: none;
   }
 
 
  }
`;

/////////////////////////////////////////////////////////////////


const Button = styled.button`
   margin: 0.4em;
   height: 40px;
   width: 40px;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 50%;
 
    &:hover{
       background-color: rgba(160, 162, 170, 0.089);

    }

  
  
`;
 
 


 
const ProfileContainer = styled.div`
  z-index: 50;
  align-items: center;
  display: flex;
  position: relative;
  overflow: visible;
  
  opacity: 1;   
`;

const AvatarLink = styled.a`
  position: relative;
  aspect-ratio: 1 / 1;  
  height: 35px;  
  overflow: hidden;
  border-top-left-radius: 0.25rem; 
  border-bottom-left-radius: 0.25rem;  
 
`;

const AvatarImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover; 
`;

const LevelLabel = styled.div`
  position: absolute;
  bottom: 2px;
  left: 0;
  display: block;
  height: 13px; 
  width: 100%; 
  align-items: center;
  justify-content: center;
  background-color: rgba(15, 23, 42, 0.5); 
  text-align: center;
  font-size: 8px; 
  font-weight: 700; 
  color: #FFFFFF; 
  backdrop-filter: blur(2px); 


`;

const XpBarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: block; 
  height: 2px;
  width: 100%; 
  background-color: #1fb74d; 
`;

const XpBarProgress = styled.div`
  display: none; 
  height: 100%; 
  background-color: #1b572d; 
  width: 45%; 

`;

const MenuButtonContainer = styled.div`
  position: relative; 
display: flex;
  aspect-ratio: 0.7 / 1; 
 
  height: 35px; 
 
  border-top-right-radius: 0.25rem; 
  border-bottom-right-radius: 0.25rem;
  align-items: center;
  justify-content: center;
  background-color: #2b2e2d; 
`;

const MenuButton = styled.button`
  display: flex;
  aspect-ratio: 1 / 1; 
  height: 35px; 
  align-items: center;
  justify-content: center;
  color: #94A3B8; 
  transition-property: color, background-color;
  transition-duration: 200ms; 
  

  &:hover {
    background-color: #2d3331; 
    color: #FFFFFF; 
      border-top-right-radius: 0.25rem; 
  border-bottom-right-radius: 0.25rem;
  }

   
 
`;

const MenuIconSvg = styled.svg`
  /* group class is for parent hover, handled by MenuButton:hover path */
  width: 2.25rem; /* w-9 */
  user-select: none; /* select-none */
  transition-property: all; /* transition-all */
  transition-duration: 500ms; /* duration-500 */

  path {
    fill: none;
    stroke: currentColor; /* stroke-current */
    stroke-width: 5.5px; /* stroke-[5.5px] */
    transition-property: all; /* transition-all */
    transition-duration: 500ms; /* duration-500 */
    stroke-linecap: round; /* [stroke-linecap:round] */
  }

  path:nth-child(1) {
    stroke-dasharray: 40 160; /* [stroke-dasharray:40_160] */
    ${MenuButton}:hover & {
      stroke: #FFFFFF; /* group-hover:stroke-white */
    }
  }
  path:nth-child(2) {
    stroke-dasharray: 40 142; /* [stroke-dasharray:40_142] */
    transform-origin: 72px center; /* origin-[72px_center] */
    transform: scaleX(0.6); /* scale-x-[0.6] */
    ${MenuButton}:hover & {
      stroke: #FFFFFF; /* group-hover:stroke-white */
    }
  }
  path:nth-child(3) {
    transform-origin: 50%; /* origin-[50%] */
    stroke-dasharray: 40 85; /* [stroke-dasharray:40_85] */
    ${MenuButton}:hover & {
      stroke: #FFFFFF; /* group-hover:stroke-white */
    }
  }
`;


// ============= ANIMAÇÕES PREMIUM =============
export const shimmer = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(0); }
`
export const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`

export const glow = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
`
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`
const ripple = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`
export const ModalOverlay2 = styled.div`
  bottom: 0;
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: right;
  z-index: 9999;
  animation: ${fadeInUp} 0.3s ease-out;
`
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
   background-color: rgba(11, 12, 10, 0.349);
  background-image: url('/web/hdshfioef.png');
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: right;
  z-index: 9999;
   
  animation: ${fadeInUp} 0.3s ease-out;
`

export const CartModalContent = styled.div`
  position: relative;
  background: linear-gradient(145deg, #1c1d1c 0%, #1b1d1c 100%);
   background-color: #181a19; 
 
    border-radius: 16px;
   
  max-width: 400px;
 animation: ${shimmer} 0.8s ease-out;
  width: 100%;
  height: 90vh;
  overflow-y: auto;
 

`
 
 

export const ModalGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(60, 61, 60, 0.05) 0%, transparent 70%);
  border-radius: inherit;
  z-index: 1;
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  
  position: relative;
  z-index: 2;


 .sadbutton{
   background-color: rgba(151, 161, 157, 0.11);
   padding: 0.7em 1em 0.7em;
   border-radius: 18px;
   margin: 1em;
   font-size: 13px;
   color: #a6adaa;
   z-index: 219;
   position: relative ;
   font-family: 'InterSemiBold', monospace;
  }
`

export const ModalTitle = styled.h2`
     max-width: 250px;
    font-size: 28px;
    line-height: 32px;
    font-weight: 700;

  margin: 0;
  color: #c6cfc9;
 font-family: 'XcSemibold';
`
 

export const ItemCount = styled.span`
  font-size: 0.7rem;
  color: #41b45e;
  font-weight: 400;
  background: rgba(65, 180, 94, 0.1);
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
`

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  svg{
    stroke: #6d7270;
    height: 19px;
    width: 19px;
  }
 
  &:hover {
 
    transform: scale(1.1);
  
  }
`



export const ModalBody = styled.div`
  padding: 2rem;
  position: relative;
  height: 50vh;
  overflow-y: auto;
  z-index: 2;
`
 
 
export const ModalFooter = styled.div`
  padding: 2rem;
  width: 100%;
  position: absolute;
  bottom: 1%;
  left: 0;
  right: 0;
  z-index: 2;
`
 
export const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background-image: url('/web/dasdsadhsaij.png');
  height: 50vh;
  width: 100%;
  background-size: 80%;
  background-position: center;
  background-position-y: 100%;
  background-repeat: no-repeat;
  position: absolute;
  bottom: 2%;
  z-index: 2;
`
 

export const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
export  const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8em 1em 0.8em;
  background: rgba(45, 48, 46, 0.3);
 
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover::before {
    left: 100%;
  }
`

export const CartItemImageContainer = styled.div`
  position: relative;
`

export const CartItemImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 12px;
 border: 1px solid #464947;
`

export const ItemImageGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(65, 180, 94, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: ${glow} 2s ease-in-out infinite;
  z-index: -1;
`

export const CartItemInfo = styled.div`
  flex: 1;
  z-index: 2;
`

export const CartItemName = styled.div`
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`

export const CartItemPrice = styled.div`
  color: #41b45e;
  font-weight: 500;
  font-size: 0.9rem;
`

export const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
   
  transition: all 0.3s ease;
  z-index: 2;

  
`

export const CartSummary = styled.div`
  background: rgba(36, 37, 37, 0.274);
 
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
`

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;

  &:last-child {
    margin-bottom: 0;
  }

  .discount {
    color: #41b45e;
    font-weight: 600;
  }
`

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(65, 180, 94, 0.3);
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 0 10px rgba(65, 180, 94, 0.3);
`

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid #ff6b6b;
  border-radius: 12px;
  color: #ff6b6b;
  margin: 1rem 2rem;
  font-size: 0.9rem;
`

export const ErrorIcon = styled.span`
  font-size: 1.2rem;
`

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(65, 180, 94, 0.1);
  border: 1px solid #41b45e;
  border-radius: 12px;
  color: #41b45e;
  margin: 1rem 2rem;
  font-size: 0.9rem;
`

export const SuccessIcon = styled.span`
  font-size: 1.2rem;
`

export const CheckoutButton = styled.button<{ purchasing?: boolean }>`
 position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.8rem 1rem;
 background: linear-gradient(135deg, #1e221f 0%, rgba(82, 97, 86, 0.116) 100%);
  border: none;
  border-radius: 46px;
  color: #d5dad6;
  font-size: 14px;
  font-weight: 600;
  font-family: 'InterSemibold', monospace;
  transition: all 0.9s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
 
   

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(37, 53, 41, 0.158);
    
  }

  &:disabled {
     background: linear-gradient(135deg, #4b2b2b94 0%, #1b1a1a2b 100%);
    cursor: not-allowed;
    transform: translateY(-1px);
  }
`

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`
 
export const AddToCartButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, rgba(65, 180, 94, 0.2) 0%, rgba(65, 180, 94, 0.1) 100%);
  border: 1px solid #41b45e;
  border-radius: 8px;
  color: #41b45e;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  backdrop-filter: blur(5px);

  &:hover {
    background: linear-gradient(135deg, #41b45e 0%, #34a04f 100%);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(65, 180, 94, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`

export const ButtonIcon = styled.div`
  transition: transform 0.3s ease;

  ${AddToCartButton}:hover & {
    transform: scale(1.1);
  }
`
export const ButtonRipple = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;

  ${AddToCartButton}:active & {
    width: 300px;
    height: 300px;
    animation: ${ripple} 0.6s ease-out;
  }
`;


export const CartButton = styled.button<{ hasItems: boolean }>`
 
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
   
 border-left: 1px solid rgba(255, 255, 255, 0.1);
 
   
`
const CartIconContainer = styled.div`
  transition: transform 0.3s ease;
  z-index: 2;

  ${CartButton}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`

export const CartBadge = styled.div`
  position: absolute;
  top: -3px;
  right: -4px;
  background: linear-gradient(135deg, #3ca36330 0%, #202221 100%);
  color: white;
  backdrop-filter: blur(12px);
  font-size: 0.55rem;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 12px;
  width: 17px;
  height: 17px;
  text-align: center;
  box-shadow: 
    0 4px 12px rgba(89, 92, 90, 0.4),
    0 0 20px rgba(93, 128, 106, 0.3);
  z-index: 3;

  span {
    position: relative;
    z-index: 2;
  }
`

export const BadgePulse = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  border-radius: inherit;
  animation: ${pulse} 2s infinite;
  opacity: 0.7;
`

 