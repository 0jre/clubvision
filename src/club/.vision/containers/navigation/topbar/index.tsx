import styled, { css, keyframes } from "styled-components"
import React, { useEffect, useRef, useState } from 'react';
import AssinationPlus from "./coins";
import Image from "next/image";
import InviteCardModal from "@club/resources/invite/xticket/invites.index"
import Turbo from '@/public/icons/topmenu/diamond.png'
import ROUTENVX from "@/routes/routes";
import { useRouter } from 'next/router';;
import EventModal from "@/admin/components/ax/event.index";
import { Award, Brush2, CalendarAdd, Crown1, Flag2, Flash, Happyemoji, Headphone, Lock, Pointer, Ranking, Shield, TagUser, Ticket2,  UserOctagon,  Wallet3} from "iconsax-react";
import LevelVisionTOp from '../../../../.level/top/info.level';
import { Tooltip } from "@mui/material";
import HeaderTops from "@club/components/uls/header.top";
import NVXROUTE from '@/routes/routes';
import { LampCharge, PlayCricle, Profile2User } from "iconsax-react"
 
 
interface TopBarLesi {
    children: React.ReactNode;
    chilbottominf: React.ReactNode;
    iconinfo: React.ReactNode;
    AdminMenu: React.ReactNode;
    BannedAccount: React.ReactNode;
    VisionPost: React.ReactNode;
    TheHome: React.ReactNode;
    accountactive: string;
    primeactive: boolean;
    id: string;
    username: string;
    avataruser: string;
    eventmember: boolean;
    userInfo: any;
  userInfox: any;
}

 
  

export default function TopBar ({
  accountactive,
  userInfo,
  userInfox,
  id,
  username,
  avataruser,
  primeactive,
  eventmember, 
  children,
  chilbottominf,
  iconinfo, 
  AdminMenu, 
  BannedAccount, 
  VisionPost, 
 
  TheHome
  } : TopBarLesi) {

  const router = useRouter();
  const activeLink = router.asPath;
  const [activeprime ] = useState(primeactive)
  const [typeview, settypeview] = useState<string>("feed")
  const [ isEventu, setisevent ] = useState(false);  
  const [ismodaluser, setismodaluser] = useState(false);
  const { clubvision } = router.query;
      
  useEffect(() => {
    if (clubvision) {
      setismodaluser(true);
    }
  }, [clubvision]);

  // Função para atualizar a URL dinamicamente
const updateURL = (newTypeView: string) => {
  const newURL = `${ROUTENVX.Discovery}/?type=${newTypeView}`
  router.push(newURL, undefined, { shallow: true })
}

 
 
  const isActivev = (pathname: string) => {
    return activeLink === pathname ? 'right-activ' : '';
  };

   const handlemodaluser = () => {
    setismodaluser(true);
   }


   const handleclosemodaluser = () => {
    setismodaluser(false);
    const { clubvision, ...rest } = router.query;
      router.push({
        pathname: router.pathname,
        query: { ...rest}
      }, undefined, { shallow: true });
  };
  
 
useEffect(() => {
  if (router.query.vpass === 'clubvision') {
    setismodaluser(false)
  }
}, [router.query]);
   
  const handleopenevent = () => {
    setisevent(true);
  }
  const handlecloseevent = () => {
    setisevent(false);
  }
   

 
    return(
        <>

        <ContainerTopBar>
        {activeprime ? null : (
        <ContainerAlert>
      <Image src={Turbo} alt="turbovision"/>
     <h3> SEJA PRIME E TENHA ACESSO COMPLETO AO CLUBVISION</h3>  
 <button onClick={() => router.push(ROUTENVX.storePrime)}>
 <h5>SER UM PRIME </h5>
 </button>
</ContainerAlert>
        )}
        
        
            <Content>
            
            
            <Marginvisi>
            <CardAllowlistActive>
                <ContentCard>
               
                {iconinfo}
                <li>
                <h3>{children}</h3>
                <hr />
                <p>{chilbottominf}</p>
                </li>
                </ContentCard>
            
             <ListedBanned>
              {BannedAccount}                
            </ListedBanned>
         
            <Marfg className="lciks">
         <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-help" width="24" height="24"  viewBox="0 0 24 24" stroke-width="1.5"  fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 21 14.5 1" stroke="#2f2f337d"></path>
       </svg>
      
             <LevelVisionTOp id={id} />
         </Marfg>
            </CardAllowlistActive>
 

            <RightOmn>
 
          
                  
            <CardLocationI>
              <ul>
                <li>
                {VisionPost} 
                {TheHome} 
                </li>
              </ul>
          </CardLocationI>

          
 
            <InfoNotify>
            {eventmember ? (
               <Tooltip title={`Criar Eventos`} placement="bottom">     
               <Button className={isEventu ? "active" : ""} onClick={handleopenevent}>
               <CalendarAdd size="23" color="#707971" variant="Broken"/>
             </Button>
             </Tooltip>
            ) : null}
            </InfoNotify>
         
            <InfoNotify> 
              <InviteCardModal /> 
            
            <MarginOption>
              <Tooltip title={`Espaço vision`} placement="bottom">
                   <ButtonInfor  onClick={() => router.push(ROUTENVX.mytvl)} >
                <img src="/nvrp/club.webp" alt="clubwebp" height={30} width={30}/>
              </ButtonInfor>
              </Tooltip>
               <Tooltip title={`Club - ${username}`} placement="bottom">
                 <ButtonInfor onClick={() => router.push(ROUTENVX.Statistics)} className={isActivev(ROUTENVX.Statistics)}>
                <img src="/nvrp/cla.webp" alt="Statistics " height={25} width={25} />
              </ButtonInfor>
               </Tooltip>
            </MarginOption>
            </InfoNotify>
            
         
            <InfoNotify>

            {router.asPath.includes('/v/') && (
                    <>
                    
                        <ContainerT>
                        <ScrollingCardUserinfoXa
                          children={
                            <>
                              <li>
                          <Tooltip title={`Feed`} placement="bottom">    
                                <ButtonTag
                                  onClick={() => {
                                    settypeview("feed")
                                    updateURL("feed")
                                  }}
                                  className={typeview === "feed" ? "active" : ""}
                                >
                               <LampCharge  size="20" color="#afc2b5" variant="Bulk"/>
                                </ButtonTag>
                                </Tooltip> 
               <Tooltip title={`Seguindo`} placement="bottom">     
                                <ButtonTag
                                  onClick={() => {
                                    settypeview("following")
                                    updateURL("following")
                                  }}
                                  className={typeview === "following" ? "active" : ""}
                                >
                               <Profile2User size="20" color="#afc2b5" variant="Bulk"/>
                                </ButtonTag>
                                    </Tooltip> 
               <Tooltip title={`Videos`} placement="bottom">     
                                <ButtonTag
                                  onClick={() => {
                                    settypeview("videos")
                                    updateURL("videos")
                                  }}
                                  className={typeview === "videos" ? "active" : ""}
                                >
                            <PlayCricle size="20" color="#afc2b5" variant="Bulk"/>
                                </ButtonTag>
                                </Tooltip> 
                              </li>
                            </>
                          }
                        />
                      </ContainerT>
                    </>
                   )}
             
              {AdminMenu}
            </InfoNotify>
                
            
              <AssinationPlus id={id}/>
             
              <InfoNotify>
              <Tooltip title={`${primeactive ? 'Prime - ' : '' } ${username}`} placement="bottom">
                <Mn className={primeactive ? 'active-prime' : '' }>
  <ProfileView  onClick={handlemodaluser} bannerUrl={avataruser || 'https://i.imgur.com/mXit4fI.jpg'}/> 
                </Mn>
         </Tooltip> 
              </InfoNotify>
              
            </RightOmn>
            </Marginvisi>
            </Content>
 
        </ContainerTopBar>



        {isEventu && (
          <>
     <HovercardContainer >
     
       <EventModal 
       Close={
        <>
    <Button onClick={handlecloseevent}>
    <i className="fi fi-ss-circle-xmark"/>
    </Button>
         
        </>
       } />
    
     </HovercardContainer>
  
          </>
        )}
       

       {ismodaluser && (
        <>
       <MarginAcc  onClick={handleclosemodaluser}>
       <MarginClose>
           <span>FECHAR</span>
         </MarginClose>
        <HeaderTops> 
    
     <ContentAcc onClick={(e) => e.stopPropagation()}>
     <ScrollingCardUserinfo> 
  
             
            <li>
                  <ButtonClickOptions  onClick={() => router.push(`${ROUTENVX.User}/@${userInfox?.name}`)}>
                    <TagUser size="43" color="#d9e3f0" variant="Linear"/> 
                      <h4>@{userInfox?.name}{userInfox?.subdominio}</h4>
                  </ButtonClickOptions>
                  </li>


                  <li>
                  <ButtonClickOptions  onClick={() => router.push(ROUTENVX.centralthemes)}>
                       <Brush2 size="43" color="#d9e3f0" variant="Linear"/> 
                      <h4>Personalizar</h4>
                  </ButtonClickOptions>
                  </li>
 
  
                  <li>
              <ButtonClickOptions  onClick={() => router.push(`/${ROUTENVX.DashboardProfile}`)}>
                    <UserOctagon size="43" color="#d9e3f0" variant="Linear"/>
                      <h4>Central de conta</h4>
                  </ButtonClickOptions>
                  </li>

                   
                   
                   {accountactive && (
                  <li>
                  <ButtonClickOptions  onClick={() => router.push(ROUTENVX.Isecurity)}>
                     <Lock size="43" color="#d9e3f0" variant="Linear"/>
                      <h4>Isecurity</h4>
                  </ButtonClickOptions>
                  </li>
                   )}

                  {accountactive ? null : (
                     <li>
                     <ButtonClickOptions  onClick={() => router.push(ROUTENVX.centralpremium)}>
                     <Crown1 size="43" color="#d9e3f0" variant="Linear"/>
                         <h4>Premium</h4>
                     </ButtonClickOptions>
                     </li>   
                  )}
                  
                  <li>  
               <ButtonClickOptions onClick={() => router.push(ROUTENVX.History)}>
                <Shield size="43" color="#d9e3f0" variant="Linear"/>
                      <h4>Meu Historico</h4>
                      </ButtonClickOptions>
                      </li>  
                      <li>  
               <ButtonClickOptions  onClick={() => router.push(ROUTENVX.Cladashboard)}>
               <Flag2 size="43" color="#d9e3f0" variant="Linear"/>
                 <h4>Painel Clã</h4>
                </ButtonClickOptions>
                </li>  
          </ScrollingCardUserinfo>


          <ScrollingCardUserinfo>
           
       <ButtonClickOptions2 onClick={() => router.push(ROUTENVX.Search)}>
            <h4>Explorar</h4>
            <Pointer size="23" color="#d9e3f0" variant="Linear"/>
            </ButtonClickOptions2>

            <ButtonClickOptions2 onClick={() => router.push(ROUTENVX.leaderboard)}>
            <h4>Leaderboard</h4>
            <Ranking size="23" color="#d9e3f0" variant="Linear"/>
            </ButtonClickOptions2>


            <ButtonClickOptions2 onClick={() =>   {
                 setismodaluser(false);
                 router.push(ROUTENVX.wallet);
             }}>
            <h4>Wallet</h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
            </ButtonClickOptions2>

            {primeactive ? (
            <CardGold  onClick={() => router.push(`/${ROUTENVX.storeclub}`)} className="mobil" colorcss="#d63636" bannerUrl="/theim/characters/bs9knn43bd8i33r.webp">
             <ul>
              <h2>STORE PRIME</h2>
             </ul>
          </CardGold>
            ) : (
              <Cardprime  onClick={() => router.push(ROUTENVX.storePrime)} colorcss="#26bd7e" bannerUrl="/icons/prime.webp">
              <ul>
               <h2>ASSINAR PRIME</h2>
              </ul>
           </Cardprime>
            )}
          {userInfo?.accessinvite && primeactive && (
                  <>
                
 <CardGold onClick={() => router.push(ROUTENVX.invite)} colorcss="#24eb70" bannerUrl="/theim/characters/sct264b5frwb1.png">
 <ul>
  <h2>VISION FRIENDS</h2>
 </ul>
</CardGold>
               
                  </>
                  )}
       
       <ButtonClickOptions2 onClick={() => router.push(ROUTENVX.codesuse)}>
            <h4>Codigos</h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-scan-barcode"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 7v10"/><path d="M12 7v10"/><path d="M17 7v10"/></svg>
            </ButtonClickOptions2>
 

            <ButtonClickOptions2 onClick={() => router.push(NVXROUTE.vpass)}> 
            <h4>VIP CLUB</h4>
            <Award size="23" color="#d9e3f0" variant="Linear"/>
            </ButtonClickOptions2>
            
  
          <ButtonClickOptions2 onClick={() => router.push(NVXROUTE.support)} >
            <h4>Suporte</h4>
            <Headphone size="23" color="#d9e3f0" variant="Linear"/>
            </ButtonClickOptions2>
            
          </ScrollingCardUserinfo>
          
          
     </ContentAcc>
     </HeaderTops>
     </MarginAcc >
 
        </>
       )}
   
     

 
        </>
    )
}
  

 
interface HorizontalScrollContainerProps {
  children: React.ReactNode;
}

const ScrollingCardUserinfo: React.FC<HorizontalScrollContainerProps> = ({
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isModalOpen) {
      setIsDragging(true);
      setStartX(e.clientX);
      setScrollLeft(containerRef.current!.scrollLeft);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
  
    if (!isModalOpen) {
      e.preventDefault();
      const x = e.clientX - startX;
      const walk = x * 1; 
      containerRef.current!.scrollLeft = scrollLeft - walk;
    }
  };


  const handleMouseUp = () => {
    setIsDragging(false);
  };

 
  return (
    <CardViewList
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
    >
      <ContentList >{children}</ContentList>
    </CardViewList>
  );
};

 
interface ViewHeaderProps {
  bannerUrl: string;
  colorcss: string;
}


 
const ScrollingCardUserinfoXa: React.FC<HorizontalScrollContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isModalOpen) {
      setIsDragging(true)
      setStartX(e.clientX)
      setScrollLeft(containerRef.current!.scrollLeft)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    if (!isModalOpen) {
      e.preventDefault()
      const x = e.clientX - startX
      const walk = x * 1
      containerRef.current!.scrollLeft = scrollLeft - walk
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container

        if (scrollLeft <= 0) {
          container.scrollLeft = scrollWidth
        } else if (scrollLeft + clientWidth >= scrollWidth) {
          container.scrollLeft = 0
        }
      }
    }

    containerRef.current?.addEventListener("scroll", handleScroll)

    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <CardViewListXa
      style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
    >
      {children}
    </CardViewListXa>
  )
}

const CardViewListXa = styled.div`
  max-width: 300px;
  border-radius: 43px;
  overflow-x: auto;
  display: inline-flex;
 

  @media screen and (max-width: 560px){
    width: 150px;
  } 
`
 const MarginOption = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 0.1em;
     background-color: rgba(212, 223, 215, 0.014);
   border-radius: 29px;
 .right-activ{
    background-color:rgba(125, 125, 128, 0.171);

    img{
      filter: brightness(0.8) grayscale(0);
    }
   }

   @media screen and (max-width: 680px) {
    display: none;
   }
  
 `;
const ButtonInfor = styled.button`

   padding: 11px 1em 10px;

   height: 35px;
    width: 35px;
   color: #6d6d7276;
   transition: 1s all;
   display: flex;
   justify-content: center;
   align-items: center;
   border-radius: 50%;

   &:hover{
  background-color:rgba(125, 125, 128, 0.171);
   }

    
    img{
      filter: brightness(1) grayscale(1);
    }
 
`;
const CardGold = styled.div<ViewHeaderProps>`
 background: ${({ colorcss }) => `${colorcss}`} ${({ bannerUrl }) => `url('${bannerUrl}')`} no-repeat center left / 80%;
 cursor:  var(--f-cursor-pointer);
 border-radius: 8px;
 margin: 0.3em;
 
 
   ul{
    width: 100%;
    height: 100%;
    padding: 0.4em 1em 0.4em;
    display: flex;
    align-items: center;
    justify-content: center;

    h2{
      font-family: 'Graffiti';
      color: rgba(3, 3, 3, 0.451);
      font-size: 22px;
    }
   }

   @media screen and (max-width: 530px) {
    width: 260px;  
   } 
`;

const Cardprime= styled.div<ViewHeaderProps>`
 background: ${({ colorcss }) => `${colorcss}`} ${({ bannerUrl }) => `url('${bannerUrl}')`} no-repeat center left / 30%;
 cursor:  var(--f-cursor-pointer);
 border-radius: 8px;
 margin: 0.3em;
 
   ul{
    width: 100%;
    height: 100%;
    padding: 0.4em 1em 0.4em;
    display: flex;
    align-items: center;
    justify-content: center;

    h2{
      font-family: 'Graffiti';
      color: rgb(3, 3, 3);
      font-size: 18px;
    }
   }

   @media screen and (max-width: 530px) {
    width: 200px;     
   } 
`;
const CardViewList = styled.div`
   
  width: 100%;
  overflow-x: auto;
  cursor:  var(--f-cursor-grab);

:active {
cursor:  var(--f-cursor-grabbed);
}

 
`;

const ButtonTag = styled.button`
  display: flex;
  align-items: center;
  background-color: rgba(77, 78, 80, 0.062);
  padding: 0.4em ;
  height: 35px;
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none !important;
  
  transition: all 0.3s ease;

  h4{
    margin-left: 0.3em;
    font-family: 'Inter', monospace;
    font-weight: 300;
    color: #979ea0;
  }

  
  &.active {
    background-color: rgba(125, 125, 128, 0.3);
 
  
  }

  &:hover {
    background-color: rgba(125, 125, 128, 0.2);
  }

  @media screen and (max-width: 560px) {
    h4{
      font-size: 11px;
    }
  }
`

 const ContainerT = styled.section`
 
  display: flex;
  justify-content: end;

  li{
    display: flex;
    align-items: center;
  }

  .navbar-active{
    background-color: rgba(125, 125, 128, 0.171);

    i{
      color: rgb(78, 82, 79);
    }
  }
`

const ContentList = styled.section`

  display: inline-flex;
  align-items: center;
   
  @media screen and (max-width: 530px) {
    .mobil{
      display:none;
    }
   } 
`;



const ContainerWalletacti = styled.div`
  display: flex;
  flex-direction: column;
  
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


const CardNotification = styled.div`
 
  background-color: rgba(20, 22, 24, 0.443);
  border-radius:9px;
  margin: 0.4em;
  position: relative;
  padding: 0.4em 1em 0.4em;

  i{
    font-size: 23px;
    color: #615e80;
  }

  li{
    padding-left: 1em;
  }
  
  ul{
     display: flex;
     align-items: center;
  }

  h3{
    font-size: 13px;
    color: #a5a5ad;
    font-family: 'Inter', monospace;
    margin-bottom: 0.3em;
  }

  p{
    font-size: 11px;
    color: #787880;
    max-width: 100%;
    font-family: 'Inter', monospace;
    margin-bottom: 0.8em;
  }


  h6{
     margin: 0.4em;
     color: #34ce4e96;
     font-family: 'Inter', monospace;
  }

    

`;
const MarginButton = styled.div`
  width: 100%;
  border-bottom: 1px solid rgba(47, 48, 49, 0.616);
  padding: 0.5em 1em 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;


  .active{
     background-color: #13e66a;
     color: black;
   
  }
  button{
     padding: 0.5em 3em 0.5em;
     background-color: rgba(187, 189, 201, 0.144);
     color: #cdd3d8cd;
     font-size: 13px;
     border: 0px solid transparent;
     font-family: 'Europa Grotesk', monospace;
  }


  .left{
    border-radius: 20px 0 0 20px;
  }

  .right{
    border-radius: 0 20px 20px 0;
  }
`

const Wrapp = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 6392;
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0.9em;
   
  justify-content: center;
  place-items: center;

  @media screen and (max-width: 560px) {
     padding: 0;
  }
`;


const WrappCenter = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 6392;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: rgba(0, 0, 0, 0.534);
  justify-content: end;
  place-items: center;
`;
const MarginAcc = styled.div` 
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 6392;
  background-color: #000000ac;
  animation: Vis 1s linear;

  @keyframes Vis {
    0%{
      opacity: 0;
    }

    100%{
      opacity: 1;
    }
  }

`;

const MarginClose = styled.div`
  
   color: #c7cdd6;
    
   position: fixed;
   top: 2em; 
   z-index: 1992;
   right: 2em;
    
   span{
    font-size: 11px;
   }
`;

const ContentAcc = styled.div`
  z-index: 781;
  padding: 1em 0em 1em;
  border-radius: 9px;
  width: 100%;
  position: fixed;
  bottom: 2px;
 
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  overflow-y: auto;

   hr{
    width: 100%;
    border-color: rgba(11, 12, 15, 0.048);
    margin-bottom: 0.5em;
   }

   ul{
   display: inline-flex;
   align-items: center;

   h1{
    font-family: 'XcSemibold', monospace;
    font-size: 19px;
    padding-left: 0.5em ;
    color: #b6b9c0;
   }

    
  }

  .ici{
     background-color: rgba(41, 42, 44, 0.199);
     padding: 0.1em 0.4em 0.1em;
     border-radius: 50%;
     height: 30px;
     width: 30px;
     display: flex;
     justify-content: center;
   }
 

   li{
       margin: 0.5em;
   }
 
 
`;
 
 
const CardTheme = styled.div`
 
 position: relative;
   width: 100%;
   height: 100%;
 
 
  transition: opacity 1s ease-in-out;
  animation: CardNotify 0.7s linear;

@keyframes CardNotify {
  0%{ transform: scale(0) }
  100%{ transform: scale(1) }
}
 
 
.border-effect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }


`;

const ContentTheme = styled.div`
padding: 1em 0.6em 1em;
   border-radius: 12px;
   border: 2px solid #121313;
   background: linear-gradient(204deg, #1e1f1efd -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1f1efd, #1e1f1efd);
  
height: 100%;
overflow-y: auto;
   hr{
    width: 100%;
    border-color: rgba(11, 12, 15, 0.048);
    margin-bottom: 0.5em;
   }


   .ulcenter{
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.9em;
 
   }

   ul{
   display: inline-flex;
   align-items: center;
   width: 100%;
   justify-content: space-between;
  
   text{
    display: inline-flex;
    align-items: center;
   }
   h1{
    font-family: 'XcSemibold', monospace;
    font-size: 19px;
    padding-left: 0.5em ;
    color: #b6b9c0;
   }

    
  }

  .ici{
     background-color: rgba(41, 42, 44, 0.199);
     padding: 0.1em 0.4em 0.1em;
     border-radius: 50%;
     height: 30px;
     width: 30px;
     display: flex;
     justify-content: center;
   }

  .section{
    background-color: rgba(209, 209, 218, 0.014);
    padding: 0.4em;
    border-radius: 8px;
    margin: 0.4em;
    width: 400px;
  }
 
  @media screen and (max-width: 560px) {
     border: none;
     border-radius: 0;
     
  }
`;

const ButtonClickOptions = styled.button`
      display: flex;
       flex-direction: column;
       align-items: center;
       padding: 1em 2em 1em;
     
       background: linear-gradient(204deg, rgba(6, 6, 7, 0) -7%, rgba(0, 0, 0, 0) 33%), linear-gradient(162deg, #00000018 -10%, #2c88dd00 25%), linear-gradient(0deg, rgb(2, 2, 2), rgba(0, 0, 0, 0.068));
       transition: all 0.9s;   
       width: 13em;
       height: 8em;
       border-radius: 2px;
     
       i{
        padding: 0.4em 0.4em 0.4em;
        background-color: rgba(36, 36, 37, 0.377);
        display: flex;
        border-radius: 50%;
        justify-content: center;
       }
      
       h4{
        font-family: 'Poppins', sans-serif;
        font-size: 16px;
        font-weight: 300;
        padding-left: 0.5em;
        color: #9fa1ad ;

        max-width: 130px;
     
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
       }
  
       &:hover{
        background-image: url('/icons/084mnfgjhdgdfyt4n.png');
        background: linear-gradient(204deg, rgba(79, 80, 83, 0.26) -7%, #b85cff00 33%), linear-gradient(162deg, #131314ba -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(32, 33, 34, 0.274), rgba(27, 28, 29, 0.116));
       
        transition: all 0.2s;
   }
`;
 


const ButtonClickOptions2 = styled.button`
      display: flex;
       flex-direction: row;
       align-items: center;
       justify-content: space-between;
       margin: 0.3em;
       padding: 1em ;
       background: linear-gradient(204deg, rgba(79, 80, 83, 0.082) -7%, #b85cff00 33%), linear-gradient(162deg, #1313141f -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(8, 8, 8, 0.897), rgba(8, 8, 8, 0.897));
       transition: all 0.9s;
       border-radius: 2px;
       margin-bottom: 0.3em;
        
       
      
       h4{
        font-family: 'InterSemiBold', sans-serif;
        font-size: 16px;
        margin: 0.4em;
        text-align: start;
        max-width: 100px;
        font-weight: 300;
   
        color: #9fa1ad ;
       }
  
       &:hover{
        background-image: url('/icons/084mnfgjhdgdfyt4n.png');
        background: linear-gradient(204deg, rgba(79, 80, 83, 0.26) -7%, #b85cff00 33%), linear-gradient(162deg, #131314ba -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(32, 33, 34, 0.274), rgba(27, 28, 29, 0.116));
       
        transition: all 0.2s;
   }
`;
 
 
const ContainerWrapp = styled.div`
  padding: 0.5em 0.4em 0.5em;
   border-radius: 11px;
   background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #33353440 -10%, #2c88dd00 25%), linear-gradient(0deg, #040504, #040504);
   width: 37%;
   margin: 2em;
    
  transition: opacity 1s ease-in-out;
  animation: CardNotify 0.7s linear;

@keyframes CardNotify {
 0%{ transform: translateX(100%);}
 100%{ tranforms: translateX(0);}
}

overflow-y: auto;

 
`;



export const translateIn = keyframes`
from {
  transform: translateX(100%);
}
to {
  transform: translateX(0);
}
`;

export const translateOut = keyframes`
from {
  transform: translateX(0);
}
to {
  transform: translateX(100%);
}
`;

const ContainerAlert = styled.div`
   background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  padding: 0.3em 1em 0.3em;
  border-radius: 4px;
  display: flex; 
  align-items: center;
  justify-content: space-between;
  animation: CardView 0.7s linear;

   @keyframes CardView {
    0%{ transform: scale(0);}
    100%{ tranforms: scale(1);}
   }

  h3{
    font-family: 'Europa Grotesk';
    color: #a0aca5;
    font-size: 13px;
  }
  
  button{
    background-color: rgba(153, 156, 165, 0.123);
    padding: 0.6em 1em 0.6em;
    border-radius: 77px;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    display: inline-flex;
    transition: 0.3s all;

    &:hover{
      transform: scale(0.6);
      
    }
 
  }


  @media screen and (max-width: 430px) {

    h3{ 
      font-size: 9px;
      max-width: 190px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
    }

    button{
      h5{
        font-size: 9px;
      }
     
    }
  }
  
`;

 interface ViewI {
  bannerUrl: string
 }
export const ProfileView = styled.div<ViewI>`
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    cursor:  var(--f-cursor-pointer);
    position: relative;
    border-radius: 50%;
    height: 24px;
    width: 24px;

    
`;


export const Mn = styled.div`
  border: 2px solid #2f3130;
  padding: 0.4em;
  border-radius: 50%;

 
      
   
`;
/// STYLED CARDMENU //
 
const Button = styled.button`
  
  
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

  
  
`;
 

const ContentMenuc2 = styled.div`
   padding: 0.3em 0.6em 0.3em;
   border-radius: 22px;
   margin: 0.9em;
    

   hr{
    width: 100%;
    border-color: rgba(11, 12, 15, 0.048);
   }


`;


const HovercardContainer = styled.div`
   position: fixed;
  left: 0;
  top: 0;
  right: 1;
   height: 100%;
   width: 100%; 
   display: flex;
   z-index: 1923;
  justify-content: end;
  bottom: 1px;
  background-color: #00000040;
  
`;


const HovercardContent = styled.div<{ isVisible: boolean }>`
  
  padding: 0.5em 2em 2em;
   border-radius: 11px;
   background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #33353440 -10%, #2c88dd00 25%), linear-gradient(0deg, #040504, #040504);
   width: 35%;
   margin: 2em;
   overflow-y: auto;
    
  transition: opacity 1s ease-in-out;
  animation: CardNotify 0.7s linear;

@keyframes CardNotify {
 0%{ transform: translateX(100%);}
 100%{ tranforms: translateX(0);}
}

/* Estilizando a barra de rolagem para navegadores baseados em WebKit */
::-webkit-scrollbar {
    width: 6px;
    display: block;
    height: 12px; /* Também define a altura para barras de rolagem horizontais */
}

/* Estilizando a trilha da barra de rolagem */
::-webkit-scrollbar-track {
    background: rgba(19, 19, 20, 0.925);
 
}

/* Estilizando o "polegar" da barra de rolagem (a parte que se move) */
::-webkit-scrollbar-thumb {
    background: rgba(57, 58, 61, 0.5);
    border-radius: 12px;
}

`;

/// styled 
const CardLocationI = styled.div`

.activeHomejd{
  display: none;

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


   @media screen and (max-width: 430px) {
     display: none;
   }
`;

const CardCenterAboutInfo = styled.div`
  

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-right: 0.4em;


  
  @media screen and (max-width: 430px) {
     display: none;
   }
   
`; 

const InfoUserC = styled.div`
   
   display: flex;
   align-items: center;
   flex-direction: row;
   justify-content: space-evenly;
   margin: 0.3em;
   background-color:rgba(212, 223, 215, 0.014);
   border-radius: 55px;
   padding: 0.3em 0.8em 0.3em;
    

   hr{
    height: 2em;
    border-color: #4144433a;
   }

   .redo{
    color: #fa1833;
   }
   .font3{
    font-size: 12px;
    color: #9e9ea0;

   }
   .ciss{
    color: #9e9ea0;
   }
   i{
    color: #4c5752;
    font-size: 16px;
    margin-top: 0.2em;
   }

   p{
    font-size: 13px;
    margin: 0.4em;
    color: #9e9ea0;
   }
   
   h4{
    margin: 0.4em;
    color: #9e9ea0;
   }

   a{
    margin-top: 0.2em;
    margin-left: 0.1em;

    i{
      color: #9e9ea0;
      font-size: 13px;
    }
   }
  .avataruser{
    border-radius: 14px;
    border: 2px dashed rgba(255, 255, 255, 0.164);
  }
`;


const ListedBanned = styled.div`
   display: flex;
   align-items: center;
   flex-direction: row;
   `;

const ContainerTopBar = styled.nav`
    padding: 0em 0.4% 0em;
    width: 100%;
    animation-name: loadTopBar;
   animation-duration: 1s;
   animation-iteration-count: all ;
 
   
    @keyframes loadTopBar {
  from { 
    opacity: calc(2px);
    filter: blur(12px);
    margin-top: -9em;
 } 
}
 
 .active{
      border: 1px dashed rgba(107, 109, 116, 0.479);
      transition: all 0.2s;
      }


    
     @media screen and (max-width: 430px){
      padding: 1em 1% 0em;
   
  
  } 

`;

const RightOmn = styled.section`
   display: flex; 
   align-items: center;
   flex-direction: row;
   gap: 8px;
   padding: 0.4em 1em 0.4em;
`;

const InfoNotify = styled.div`
     
      i{
        color: #484849;
    }

    .primeicon{
      position: absolute;
      margin-top: -3.4em;
      transform: rotate(2deg);
       
      }

        @media screen and (max-width: 430px) {
     display: none;
   }
    .active-prime{
         border-style: dashed; 
      border-color: #747e92 #628f70 #4c4f7a #262430;
      border-radius: 100%;
     max-height: 40px;
     max-width: 40px;
     animation: rotacao 5s linear infinite;
    }
  
  
  @keyframes rotacao {
        0% {
            border-color: #747e92 #628f70 #4c4f7a #262430; /* top right bottom left */
        }
        25% {
            border-color: #628f70 #4c4f7a #262430 #747e92; /* right bottom left top */
        }
        50% {
            border-color: #4c4f7a #262430 #747e92 #628f70; /* bottom left top rig ht */
        }
        75% {
            border-color: #262430 #747e92 #628f70 #4c4f7a; /* left top right bottom */
        }
        100% {
            border-color: #747e92 #628f70 #4c4f7a #262430; /* top right bottom left */
        }
    }
`;

const Content = styled.div`
 
   padding: 0.3em 0.6em 0.3em;
`;



const CardAllowlistActive = styled.div`
 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    
   

    svg{
      margin: 0.4em;
    }
    
    &:hover{
    li{
      display: block;
    }

    .lciks{
      display: none;
    }
   }
`;

const Marfg = styled.div`
  display: flex;
  align-items: center;



`;
const ContentCard = styled.ul`
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
       display: none;

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


const Marginvisi = styled.div`
  border-radius: 12px;
  width: 100%;
    display: flex;
   align-items: center;
   flex-direction: row;
   justify-content: space-between;
 
  
`;