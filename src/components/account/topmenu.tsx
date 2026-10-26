import { decrypt } from '@/core/security/encryption';
import TimeCase from '@/.trivo/screen/view.timecase';
import ROUTENVX from '@/routes/routes';
import { Levelinfo } from '@/types/user/level.up';
import axios from 'axios';
import { BagHappy, Gift, Information, Judge, Shop, ShoppingBag, SmsTracking, User } from 'iconsax-react';
import { Archive } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

import Unbadge from '@/public/icons/badges/unbadge.png'
import Bronze from '@/public/icons/badges/bronze.png'
import Prata from '@/public/icons/badges/prata.png'
import Gold from '@/public/icons/badges/gold.png'
import Platinum from '@/public/icons/badges/platinum.png'
import Diamante from '@/public/icons/badges/diamante.png'
import Master from '@/public/icons/badges/master.png'
import { StaticImageData } from 'next/image';
import router from 'next/router';
import { PrizesDropsData } from '@/accounts/prizesdrops';
// Define keyframes for animations
const fadeInWithScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Helper for media queries (Tailwind breakpoints: md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px)
const breakpoints = {
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  'min2560': '2560px',
};

const media = (Object.keys(breakpoints) as Array<keyof typeof breakpoints>).reduce(
  (acc, label) => {
    acc[label] = (...args: Parameters<typeof css>) => css`
      @media (min-width: ${breakpoints[label]}) {
        ${css(...args)}
      }
    `;
    return acc;
  },
  {} as Record<keyof typeof breakpoints, (...args: Parameters<typeof css>) => ReturnType<typeof css>>
);

 interface BadgeImageMap {
     [key: string]: StaticImageData;
 }
 
  
  const badgeImages: BadgeImageMap = {
     Novato: Unbadge,
     Bronze: Bronze,
     Prata: Prata,
     Gold: Gold,
     Platinum: Platinum,
     Diamante: Diamante,
     Master: Master
 };

 // Função para obter a imagem do distintivo com base no nível
 function getBadgeImage(badgeLevel: string): StaticImageData {
     return badgeImages[badgeLevel];
 }
  
const AccountMenuDropdown = ({isOpen, orbit, balance, vtoken, userInfox, userInfo} : {orbit: string,vtoken: string, balance: string,userInfox: any, userInfo: any, isOpen: () => void}) => {
      const [data, setData] = useState<PrizesDropsData | null>(null)
   
  const fetchData = async () => {
    try {
      const response = await fetch("/api/club/prizes-drops")
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      } else {
        console.error("Erro ao carregar dados:", result.message)
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
    } 
  }
       const BadgeInfo = ({ value } : {value: number}) => {
              let badgeLevel: string;
           
           if (value >= 0 && value <= 1) {
               badgeLevel = 'Novato';
           } else if (value >= 2 && value <= 7) {
               badgeLevel = 'Bronze';
           } else if (value >= 8 && value <= 21) {
               badgeLevel = 'Prata';
           } else if (value >= 22 && value <= 37) {
               badgeLevel = 'Gold';
           } else if (value >= 38 && value <= 69) {
               badgeLevel = 'Platinum';
           } else if (value >= 70 && value <= 99) {
               badgeLevel = 'Diamante';
           } else {
               badgeLevel = 'Master';
           } 
           const badgeImage = getBadgeImage(badgeLevel);
           return (
               <>
            
       <RankBadgeImage src={`${badgeImage.src}?v=198`} alt="" role="none" />
               </>
           )
       }

       const BadgeInfoX = ({ value } : {value: number}) => {
              let badgeLevel: string;
           
           if (value >= 0 && value <= 1) {
               badgeLevel = 'Novato';
           } else if (value >= 2 && value <= 7) {
               badgeLevel = 'Bronze';
           } else if (value >= 8 && value <= 21) {
               badgeLevel = 'Prata';
           } else if (value >= 22 && value <= 37) {
               badgeLevel = 'Gold';
           } else if (value >= 38 && value <= 69) {
               badgeLevel = 'Platinum';
           } else if (value >= 70 && value <= 99) {
               badgeLevel = 'Diamante';
           } else {
               badgeLevel = 'Master';
           } 
        
           return (
               <>
             <RankName data-testid="user-info-xp-rank-name-label" role="none">{badgeLevel}</RankName>
      
               </>
           )
       }
     useEffect(() => {
       fetchData()
     }, [])
  return (
   <Conac >
    <DropdownContainer>
      <HeaderSection role="none">
        <HeaderContentWrapper role="none">
          <BackgroundSvgShape xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 264 101" role="none">
            <mask id="path-1-inside-1_41631_80795" fill="#fff" role="none">
              <path fillRule="evenodd" d="M44.119.512a8 8 0 0 0-6.28 3.044L.781 50.512 38.44 98.229a6 6 0 0 0 4.71 2.283h584.263a6 6 0 0 0 4.71-2.283l34.725-44a6 6 0 0 0 0-7.434l-34.725-44a6 6 0 0 0-4.71-2.283H44.119Z" clipRule="evenodd" role="none"></path>
            </mask>
            <path fill="#272928" fillRule="evenodd" d="M44.119.512a8 8 0 0 0-6.28 3.044L.781 50.512 38.44 98.229a6 6 0 0 0 4.71 2.283h584.263a6 6 0 0 0 4.71-2.283l34.725-44a6 6 0 0 0 0-7.434l-34.725-44a6 6 0 0 0-4.71-2.283H44.119Z" clipRule="evenodd" role="none"></path>
            <path fill="#2e4441" d="m37.839 3.556.785.62-.785-.62Zm594.284-.761-.785.62.785-.62Zm34.725 51.434.785.62-.785-.62Zm0-7.434.785-.62-.785-.62Zm-39.435 53.717v-1 1Zm4.71-2.283.785.62-.785-.62Zm-593.683 0 .785-.62-.785-.62Zm4.71 2.283v1-1Zm-42.369-50-.785.62.785-.62Zm0 0 .997.076-.997-.076Zm0 0 .785.62-.785-.62Zm0 0-.997-.077.997.077ZM38.624 4.175a7 7 0 0 1 5.495-2.663v-2a9 9 0 0 0-7.065 3.424l1.57 1.24ZM1.566 51.131 38.624 4.175l-1.57-1.239L-.004 49.892l1.57 1.24Zm.212-.543-1.994-.153 1.994.153Zm37.447 47.021L1.566 49.892l-1.57 1.24 37.659 47.716 1.57-1.239Zm588.188 1.903H43.149v2h584.264v-2Zm38.65-45.903-34.725 44 1.57 1.24 34.725-44-1.57-1.24ZM631.338 3.414l34.725 44 1.57-1.239-34.725-44-1.57 1.24ZM44.118 1.512h583.295v-2H44.119v2Zm588.79.663a7 7 0 0 0-5.495-2.663v2a5 5 0 0 1 3.925 1.902l1.57-1.239Zm34.725 52.673a7 7 0 0 0 0-8.673l-1.57 1.24a5.001 5.001 0 0 1 0 6.194l1.57 1.24Zm-40.22 46.664a7.002 7.002 0 0 0 5.495-2.664l-1.57-1.239a5 5 0 0 1-3.925 1.903v2ZM37.655 98.848a7.001 7.001 0 0 0 5.495 2.664v-2a5 5 0 0 1-3.925-1.903l-1.57 1.24ZM.78 51.512a1 1 0 0 1-.785-.38l1.57-1.24a1 1 0 0 0-.785-.38v2Zm-.997-1.077a1 1 0 0 0 .997 1.077v-2a1 1 0 0 1 .997 1.076l-1.994-.153Zm.212-.543a1 1 0 0 0-.212.543l1.994.153a1 1 0 0 1-.212.543l-1.57-1.239Z" mask="url(#path-1-inside-1_41631_80795)" role="none"></path>
          </BackgroundSvgShape>
          
          <AvatarLink href={`/@${userInfo.user.name}`} role="none">
            <AvatarImageContainer role="none">
              <AvatarImage src={userInfo.user.avatar} data-testid="header-user-avatar-btn" alt="avatar" role="none" />
              <AvatarLevelBadgeContainer role="none" /> {/* This was .css-1magkk1 */}
              <AvatarLevelNumber role="none">
                <span data-testid="user-avatar-level-xp-label" role="none">{userInfox?.level}</span>
              </AvatarLevelNumber>
            </AvatarImageContainer>
            <ProgressCircleSvg width="100%" height="100%" role="none">
              <defs role="none">
                <linearGradient id="level-up-gradient" role="none">
                  <stop offset="0%" stopColor="#77FF9D" role="none"></stop>
                  <stop offset="100%" stopColor="#FFC354" role="none"></stop>
                </linearGradient>
                <linearGradient id="experience-gradient" role="none">
                  <stop offset="0%" stopColor="white" role="none"></stop>
                  <stop offset="100%" stopColor="white" stopOpacity="0" role="none"></stop>
                </linearGradient>
              </defs>
              <circle cx="50%" cy="50%" r="47" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" fill="none" stroke="#433519" transform="rotate(-90 0 0)" pathLength="100" role="none"></circle>
              <circle cx="50%" cy="50%" r="47" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" fill="none" stroke="url(#experience-gradient)" transform="rotate(-90 0 0)"   pathLength="100" strokeDasharray="100" strokeDashoffset="55" className="transition-all duration-500 ease-in-out" role="none"></circle> {/* Tailwind animation classes need to be handled by styled-components if dynamic, or kept if static CSS handles them */}
              <circle cx="50%" cy="50%" r="47" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" fill="none" stroke="#FFC354" transform="rotate(-90 0 0)"   pathLength="100" strokeDasharray="100" strokeDashoffset="55" className="transition-all duration-500 ease-in-out block" role="none"></circle>
              <circle cx="50%" cy="50%" r="47" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" fill="none" stroke="url(#level-up-gradient)" transform="rotate(-90 0 0)"   pathLength="100" strokeDasharray="100" strokeDashoffset="100" className="transition-all duration-[650ms] ease-in-out delay-[400ms] block" role="none"></circle>
            </ProgressCircleSvg>
          </AvatarLink>

          <UserInfoContainer role="none">
            <UserNameContainer className="group" role="none">  
                 <SteamLink role="none">
                <Image src={'/nvrp/20240520_081457.png'} alt='novision' width={16} height={16}/>
              </SteamLink>
              <UserNameLink href={`/@${userInfo.user.name}`} role="none">{userInfo.user.name}{userInfo.user.subdominio}</UserNameLink>
            </UserNameContainer>
            <FreeCasesLink href={ROUTENVX.prizesdrops} data-testid="favorite-section-button" role="none">
            <Gift size="18" color="#295a42" variant="Bulk"/>
        
               RESGATAR DROPS
              <FreeCasesCount role="none">{data?.summary.claimablePrizes || 0}</FreeCasesCount>
            </FreeCasesLink>
          </UserInfoContainer>

           <RankSection role="none">
            <RankBadgeLink data-testid="daily-case-current-rank-badge-icon" role="none">
              {userInfox && (
     <BadgeInfo value={userInfox.level}/>
              )}
         
            </RankBadgeLink>
            <RankInfo role="none">
              <RankTextContainer role="none">
                <RankLabel role="none">O Seu Ranque</RankLabel>
               
              </RankTextContainer>
              <RankNameLink  role="none">
                 {userInfox && (
     <BadgeInfoX value={userInfox.level}/>
              )}
                <NextRankInfo role="none">Total acumulados - {userInfox?.xp} XP</NextRankInfo>
              </RankNameLink>
            </RankInfo>
          </RankSection> 
        </HeaderContentWrapper>

        <MobileWalletInfo role="none">
            <WalletItem role="none" onClick={() => router.push(ROUTENVX.wallet)}> 
                <BalanceIcon role="none">$</BalanceIcon>
                <BalanceText role="none">{orbit}</BalanceText>
            </WalletItem>
            <WalletItem as="a" href="/#gold-area" role="none"> 
                <GoldCoinIconContainer role="none">
                    <GoldCoinImage src="/icons/coins/20240909_113221.png" alt=""role="none" />
                </GoldCoinIconContainer>
                <GoldCoinText role="none">{balance}</GoldCoinText>
            </WalletItem>
            <WalletItem as="a" href="/right-track" role="none"> 
                <GoldCoinIconContainer role="none"> 
                    <GoldCoinImage src="/icons/market/sadasjdub.webp" alt="" role="none" />
                </GoldCoinIconContainer>
                <EventCoinText role="none">{vtoken}</EventCoinText>
            </WalletItem>
        </MobileWalletInfo>

     
      </HeaderSection>


  

      <ContentSection role="none">
        <SectionTitle role="none">conta &amp; Recursos </SectionTitle>
        <LinksGrid role="none">
          <StyledLinkItem  onClick={() => router.push(ROUTENVX.centraldash)} id="headlessui-menu-item-:r6c:" role="menuitem"  >
           <User size="32" color="#9ea8a3" variant="Bulk"/>
            <span role="none">Minha conta</span>
          </StyledLinkItem>
         
          <StyledLinkItem  onClick={() => router.push(ROUTENVX.orders)} id="headlessui-menu-item-:r6e:" role="menuitem"  >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="24" width="24" ><path  fill-rule="evenodd" clip-rule="evenodd" d="M20.901 2.096a.648.648 0 00-.916 0l-5.161 5.161a.648.648 0 10.916.916l5.161-5.161a.648.648 0 000-.916zM12.503 3.17l4.917.578-1.904 1.904a1.938 1.938 0 00-1.952 1.32 1.943 1.943 0 103.782.514l1.906-1.906.58 4.917L9.328 21l-1.832-1.832v-1.832l-1.832-1.831-1.832-.002L2 13.672 12.503 3.17z" fill="#9ea8a3"></path></svg>
            <span role="none">Propostas de trocas</span> 
          </StyledLinkItem>
          <StyledLinkItem   onClick={() => router.push(ROUTENVX.myinventory)} id="headlessui-menu-item-:r6f:" role="menuitem"  >  
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ea8a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z"/><path d="M5 3a2 2 0 0 0-2 2"/><path d="M19 3a2 2 0 0 1 2 2"/><path d="M5 21a2 2 0 0 1-2-2"/><path d="M9 3h1"/><path d="M9 21h2"/><path d="M14 3h1"/><path d="M3 9v1"/><path d="M21 9v2"/><path d="M3 14v1"/></svg>
            <span role="none">Inventario</span>
          </StyledLinkItem>



          <DailyRaceLink href={ROUTENVX.leaderboard} role="none">
            <img src="/icons/racing-car.png" alt="Corrida diária" role="none" width={38}  height={38}/>
            <DailyRaceContent role="none">
              <DailyRaceText>
                 CORRIDA VISION
              </DailyRaceText>
              <DailyRaceTimer role="none">
                <div role="none">15</div><span role="none">:</span>
                <div role="none">21</div><span role="none">:</span>
                <div role="none">09</div>
              </DailyRaceTimer>
            </DailyRaceContent>
          </DailyRaceLink>

                <LinkS href={ROUTENVX.payaddfund} role="none">
    <Butt data-testid="refill-deposit-btn" role="none">

      <Text role="none">Recarregar</Text>
    
      <BonusContainer role="none">$</BonusContainer>
    </Butt>
    
  </LinkS>


 <LinkS className='cursor-not-allowed' role="none">
    <Buttx data-testid="refill-deposit-btn" role="none">

      <Text role="none">Evento</Text>
    
      <BonusContainer role="none"><Gift size="66" color="#99a05f" variant="Bulk"/></BonusContainer>
    </Buttx>
    
  </LinkS>
        </LinksGrid>

        <SectionTitle role="none">CATEGORIA</SectionTitle>
        <GamesGrid role="none">
          <GameLinkItem onClick={() => router.push(ROUTENVX.Store)}  id="headlessui-menu-item-:r6g:" role="menuitem"   $textColor="#48BB78"> {/* text-green-400 */}
            <GameLinkBackgroundOverlay $gradient="radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(119, 255, 157, 0.4) 0%, rgba(32, 32, 40, 0) 100%)" />
          
   
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#48BB78"
  stroke-width="1"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M3 21l18 0" />
  <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />
  <path d="M5 21l0 -10.15" />
  <path d="M19 21l0 -10.15" />
  <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
</svg>

            <span role="none">Storevision</span>
          </GameLinkItem>
          <GameLinkItem onClick={() => router.push(ROUTENVX.storeclub)}  id="headlessui-menu-item-:r6h:" role="menuitem"   $textColor="#907cd8">
            <GameLinkBackgroundOverlay $gradient="radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(134, 114, 187, 0.4) 0%, rgba(32, 32, 40, 0) 100%)" />
   
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#907cd8"
  stroke-width="1"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M11 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M6 16l3 2" />
  <path d="M12 17l8 -12" />
  <path d="M17 10l2 1" />
  <path d="M9.592 4.695l3.306 2.104a1.3 1.3 0 0 1 .396 1.8l-3.094 4.811a1.3 1.3 0 0 1 -1.792 .394l-3.306 -2.104a1.3 1.3 0 0 1 -.396 -1.8l3.094 -4.81a1.3 1.3 0 0 1 1.792 -.394z" />
</svg>

            <span role="none">Shopclub</span>
          </GameLinkItem>

            <GameLinkItem onClick={() => router.push(ROUTENVX.trader)}  id="headlessui-menu-item-:r6j:" role="menuitem"   $textColor="#e4d86d"> {/* text-pink-200 */}
            <GameLinkBackgroundOverlay $gradient="radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(222, 172, 236, 0.4) 0%, rgba(32, 32, 40, 0) 100%)" />
  

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#e4d86d"
  stroke-width="1"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M17 10h-14l4 -4" />
  <path d="M7 14h14l-4 4" />
</svg>


            <span role="none">Trocar Tokens</span>
          </GameLinkItem>

          <GameLinkItem onClick={() => router.push(ROUTENVX.Dashboard)}  id="headlessui-menu-item-:r6i:" role="menuitem"   $textColor="#63B3ED"> 
            <GameLinkBackgroundOverlay $gradient="radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(75, 105, 255, 0.4) 0%, rgba(32, 32, 40, 0) 100%)" />
    
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="35"
  height="35"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#63B3ED"
  stroke-width="1"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M10 19m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
  <path d="M12 16c3.314 0 6 -4.686 6 -8a6 6 0 1 0 -12 0c0 3.314 2.686 8 6 8z" />
  <path d="M12 9m-2 0a2 7 0 1 0 4 0a2 7 0 1 0 -4 0" />
</svg>

            <span role="none">Club</span>
          </GameLinkItem>
         
         
          
         
         
        </GamesGrid>

       
         
    
        <SectionTitle role="none">outro</SectionTitle>
        <LinksGrid role="none">
           <StyledLinkItem onClick={() => router.push(ROUTENVX.support)} id="headlessui-menu-item-:r6n:" role="menuitem"  > {/* Added href="#" for missing link */}
           <SmsTracking size="32" color="#9ea8a3" variant="Bulk"/>
            <span role="none">Suporte</span>
          </StyledLinkItem>
          <StyledLinkItem onClick={() => router.push(ROUTENVX.Wiki)} id="headlessui-menu-item-:r6o:" role="menuitem"  >
          <Information size="32" color="#9ea8a3" variant="Bulk"/>
            <span role="none">Wikivision</span>
          </StyledLinkItem>
          <StyledLinkItem onClick={() => router.push(ROUTENVX.History)} id="headlessui-menu-item-:r6p:" role="menuitem"  >
          <Judge size="32" color="#9ea8a3" variant="Bulk"/>
            <span role="none">Historico de punição</span>
          </StyledLinkItem>
        </LinksGrid>
          
          <div className='h-[150px] overflow-hidden relative'>
    <TimeCase /> 
          </div>
       
        <Divider role="none" />
        <LogoutLink onClick={isOpen} role="none">
          <span role="none">Fechar</span>
        </LogoutLink>
      </ContentSection>
    </DropdownContainer>
    </Conac>
  );
};

export default AccountMenuDropdown; 


const Conac = styled.div`
  background-color: rgba(11, 12, 10, 0.349);
  background-image: url('/web/hdshfioef.png');
z-index: 9999999;
position: fixed;
left: 0;
right: 0;
top: 0;
bottom: 0;
width: 100%;
height: 100%;
pointer-events: auto;
display: flex;
justify-content: center;
align-items: center;

 
 
  
`;
// Main Container
const DropdownContainer = styled.div`
 
  display: flex;
  flex-direction: column;
  position: relative;
  height: 90vh; 
  width: 100%; 
  border-radius: 12px;
  overflow-y: scroll;
 
  border-bottom: none;
  background-color: #181a19; 
    border: 2px solid #2c2e2d;
    border-bottom: none;
 animation: fadeInWithScale 0.3s ease-in-out; 
  &:focus {
    outline: none; 
  }

  
  &::-webkit-scrollbar {
    display: none;
  }
 

  ${media.md`
    padding-bottom: 0;  
    position: fixed;
    top: 1;
    right: 1;
    bottom: 0;
    left: 1;
    
  
    width: 39.2rem;  
    
    border-bottom-left-radius: 0rem; 
    border-bottom-right-radius: 0rem;  
  `}

  ${media.min2560`
    top: 70px;  
  `}

  @media screen and (max-width: 680px) {
   margin: 0;
   height: 100%;
   border-radius: 0;
   border: 0;

}

@keyframes fadeInWithScale {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0) ;
  }
}
`;

// Header Section
const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem; /* gap-5 */
  background-color: #202221; /* bg-navy-800, assuming a dark blue */
  padding: 1rem; /* p-4 */

  ${media.md`
    gap: 0; /* md:gap-0 */
    padding: 1.25rem; /* md:p-5 */
  `}
`;

const HeaderContentWrapper = styled.div`
  position: relative;
  z-index: 10; /* z-10 */
  display: flex;
  width: 100%;
  align-items: center;
`;

const BackgroundSvgShape = styled.svg`
  position: absolute;
  right: -1.25rem; /* -right-5 */
  top: 50%;
  z-index: -10; /* -z-10 */
  display: none; /* hidden */
  height: 95px; /* h-[95px] */
  transform: translateY(-50%); /* -translate-y-1/2 */

  ${media.md`
    display: block; /* md:block */
  `}

  ${media['2xl']`
    height: 105px; /* 2xl:h-[105px] */
  `}
`;

const AvatarLink = styled.a`
  position: relative;
  display: flex;
  flex-shrink: 0; /* flex-shrink-0 */
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px; /* rounded-full */
  background-color: #181a19; /* bg-navy-800 */
  margin-right: 1.25rem; /* mr-5 */
  width: 112px; /* From inline style */
  height: 112px; /* From inline style */
`;

const AvatarImageContainer = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px; /* rounded-full */
  padding: 1px; /* p-px */
`;

const AvatarImage = styled.img`
  max-height: 100%;
  border-radius: 9999px; /* rounded-full */
  width: 80px; /* From inline style */
  height: 80px; /* From inline style */
`;

const AvatarLevelBadgeContainer = styled.div`
 
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #202221; 
  height: 10px; 
`;

const AvatarLevelNumber = styled.div`
  position: absolute;
  left: 50%;
  display: flex;
  transform: translateX(-50%);
  align-items: center;
  justify-content: center;
  border-radius: 9999px; 
  background-color: #202221; 
  text-align: center;
  font-weight: 600; 
  line-height: 1; 
  color: #FFC354; 
  height: 28px; 
  width: 28px; 
  font-size: 14px;
  bottom: 11px; 
`;

const ProgressCircleSvg = styled.svg`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);  
  width: 100%;
  height: 100%;
`;

const UserInfoContainer = styled.div`
  display: flex;
  max-width: 12rem;  
  
  flex-direction: column;
  gap: 0.375rem;  
`;

const UserNameContainer = styled.div`
  display: flex;
  gap: 0.375rem;  
 
  &:hover svg {
    color: #FFD700; 
  }
`;

const UserNameLink = styled.a`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;  
  font-size: 1rem;  
  font-weight: 600;  
  color: #FFFFFF;  
  ${media.md`
    font-size: 1.125rem;  
  `}
`;

const SteamLink = styled.a`
  display: flex;
  align-items: center;
`;

 
const FreeCasesLink = styled.a`
  display: flex;
  animation: ${fadeInWithScale} 0.2s; 
 
  align-items: center;
  gap: 0.5rem; 
  white-space: nowrap;
  font-size: 12px; 
  font-weight: 600; 
  color: #295a42;
  &:hover {
    color: #3ecf76;
  }
  ${media.md`
    display: flex; 
  `}
`;

const BoxIconSvg = styled.svg`
  margin-top: -1px; 
  height: 1.25rem;
  width: 1.25rem; 
`;

const FreeCasesCount = styled.div`
  display: flex;
   width: 24px; 
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;  
  background-color: #295a42;
  padding-left: 0.5rem;  
  padding-right: 0.5rem;  
  padding-top: 0.25rem;  
  padding-bottom: 0.25rem;  
  font-size: 0.75rem;  
  color: #FFFFFF;  
  transition-property: background-color;
  transition-duration: 200ms;  
  ${FreeCasesLink}:hover & {  
    background-color: #295a42;
  }
`;

const RankSection = styled.div`
  margin-left: auto; 
  display: none; 
  gap: 0.5rem;
  ${media.md`
    display: flex; 
    margin-right: 0.25rem; 
    gap: 1rem; 
    min-width: 200px; 
  `}
`;

const RankBadgeLink = styled.div`
  height: 3rem; /* h-12 */
  width: 3rem; /* w-12 */
  align-self: center; /* self-center */
`;

const RankBadgeImage = styled.img`
  height: 3rem; /* h-12 */
  width: 3rem; /* w-12 */
  align-self: center; /* self-center */
`;

const RankInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RankTextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem; 
`;

const RankLabel = styled.p`
  font-size: 0.625rem; 
  font-weight: 600; 
  text-transform: uppercase;
  font-family: 'ProximaNova-Italic', sans-serif;
  color: #B8BCD0; 
`;
 
const RankNameLink = styled.div`
  display: flex;
  flex-direction: column;
`;

const RankName = styled.p`
  font-size: 1rem;  
  font-weight: 600;  
  text-transform: uppercase;
  line-height: 1.25;  
  color: #295a42; 
  font-family: 'XcSemibold';
`;

const NextRankInfo = styled.p`
  white-space: nowrap;
  font-size: 10px;  
  font-weight: 500;  
  color: #B8BCD0;  
  font-family: 'ProximaNova-Italic', sans-serif;
`;

// Mobile Wallet Info
const MobileWalletInfo = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;  
  margin: 1em;
  gap: 0.75rem; 
  ${media.md`
    display: none;  
  `}
`;

const WalletItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
 
`;

const WalletIconContainer = styled.div`
  display: flex;
  height: 2.25rem; /* h-9 */
  width: 2.25rem; /* w-9 */
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem; /* rounded-lg */
  font-size: 1rem; /* text-base */
  font-weight: 600; /* font-semibold */
`;

const BalanceIcon = styled(WalletIconContainer)`
  background-color: #2F855A; /* bg-green-800 (example) */
  color: #48BB78; /* text-green-400 (example) */
`;

const BalanceText = styled.span`
  font-size: 1rem; /* text-base */
  font-weight: 700; /* font-bold */
  text-transform: uppercase;
  font-variant-numeric: tabular-nums; /* tabular-nums */
  color: #48BB78; /* text-green-400 (example) */
  ${media.md`
    font-size: 0.875rem; /* md:text-sm */
    font-weight: 600; /* md:font-semibold */
  `}
`;

const GoldCoinIconContainer = styled(WalletIconContainer)`
  /* rounded-lg is default for WalletIconContainer */
`;

const GoldCoinImage = styled.img`
  margin: 0.5rem; /* m-2 */
  height: 1.5rem; /* h-6 */
  width: 1.5rem; /* w-6 */
`;

const GoldCoinText = styled.span`
  font-size: 1rem; /* text-base */
  font-weight: 700; /* font-bold */
  text-transform: uppercase;
  font-variant-numeric: tabular-nums; /* tabular-nums */
  color: #34ce74; /* text-gold-200 (example) */
   ${media.md`
    font-size: 0.875rem; /* md:text-sm */
    font-weight: 600; /* md:font-semibold */
  `}
`;

const EventCoinText = styled.span`
  font-size: 1rem; /* text-base */
  font-weight: 700; /* font-bold */
  text-transform: uppercase;
  font-variant-numeric: tabular-nums; /* tabular-nums */
  color: #d6dbda; /* text-event (example purple, replace with actual event color) */
   ${media.md`
    font-size: 0.875rem; /* md:text-sm */
    font-weight: 600; /* md:font-semibold */
  `}
`;


// Content Section
const ContentSection = styled.div`
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem; /* px-4 */
  padding-bottom: 2rem; /* pb-8 */
  text-align: center;
  ${media.md`
    padding-left: 1.25rem; /* md:px-5 */
    padding-right: 1.25rem; /* md:px-5 */
  `}
  ${media.lg`
    padding-bottom: 1.75rem; /* lg:pb-7 */
  `}
`;

const SectionTitle = styled.div`
  margin-bottom: 0.75rem;   
  margin-top: 1.25rem;  
  text-align: center;
  font-size: 0.75rem;  
  font-weight: 600;  
  text-transform: uppercase;
  color: #858DAD;  
`;

const LinksGrid = styled.div`
  display: grid;
  gap: 1rem;  
  grid-template-columns: repeat(2, minmax(0, 1fr));  
  ${media.md`
    grid-template-columns: repeat(3, minmax(0, 1fr));  
  `}
`;

const StyledLinkItem = styled.button`
  display: flex;
 
  gap: 12px;
  align-items: center;
  border-radius: 0.375rem; 
  border: 1px solid transparent; 
  background-color: rgba(36, 39, 38, 0.5); 
  padding: 0.5rem 0.5rem; 
  color: #FFFFFF; 
  transition-property: all; 
  transition-duration: 200ms; 
  
  &:hover {
     
   background-color: rgba(41, 48, 44, 0.5); 
  }

  svg {
       
    height: 1.5rem;  
    width: 1.5rem;  
    color: #858DAD;  
  }

  span {
    font-size: 12px; 
    font-family: 'Inter', monospace;
    font-weight: 300;
    text-transform: capitalize; 
  }
`;

const DailyRaceLink = styled.a`
  display: flex;
  min-height: 37px;
  width: 100%;
  align-items: center;
  gap: 8px;
  justify-content: flex-start; 
  border-radius: 0.375rem; 
  border: 1px solid #C53030; 
  background-color: rgba(41, 48, 44, 0.5); 
  padding-left: 0.75rem; 
  padding-right: 0.75rem;
  transition-property: all; 
  transition-duration: 300ms; 

  &:hover {
    background-color: rgba(155, 44, 44, 0.5); 
  }

  
`;

const DailyRaceContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DailyRaceText = styled.h3`
   width: 100%;
  font-size: 12px;
  font-family: 'XcSemibold';
  color: #E53E3E; 
`;



 
const Text = styled.span`
  font-size: 14px;
  font-weight: bold;
 
  font-family: 'XcSemibold';
  font-weight: 200;
  color: #cfd1ce;
  display: inline;
  
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

 
 
const LinkS = styled.a`
  position: relative;
  width: 100%;
 
   
  
`;
const Buttx = styled.button`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'InterSemiBold', monospace;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 0.375rem; 
  border: 1px solid #c5c330; 
  background: linear-gradient(to left, #1c1f14, #dce0123d, #181b01);
  background-size: 100% 100%;
  padding: 0.5rem 0.9em 0.5em;
  transition: background-size 0.2s;
 
  &:hover {
    background-size: 150% 150%;
  }
  
   
  height: 50px;
  width: 100%;
  justify-content: center;
  
`;

const Butt = styled.button`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'InterSemiBold', monospace;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 0.375rem; 
  border: 1px solid #30c56e; 
  background: linear-gradient(to left, #0d0e0d, #12e0683e, #011B08);
  background-size: 100% 100%;
  padding: 0.5rem 0.9em 0.5em;
  transition: background-size 0.2s;
 
  &:hover {
    background-size: 150% 150%;
  }
  @media (min-width: 640px) {
    background: linear-gradient(to right, #29522E, #0B2811, #011B08);
  }
  
   
  height: 50px;
  width: 100%;
  justify-content: center;
  
`;

const Icon = styled.svg`
  height: 17px;
  width: 17px;
  flex-shrink: 0;
  color: #38A169;
  
`;


const DailyRaceTimer = styled.div`
  margin-top: -0.25rem; 
  display: flex;
  align-items: center;
  font-size: 0.625rem; 
  font-weight: 700; 
  color: #FFFFFF; 

  div { 
    border-radius: 0.375rem; 
    text-align: center;
    font-variant-numeric: tabular-nums; 
    width: 3ch;
    background-color: transparent;
    padding-left: 1px;
    padding-right: 1px; 
    padding-top: 1px; 
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)); 
  gap: 1rem; 
  ${media.md`
    grid-template-columns: repeat(4, minmax(0, 1fr)); 
  `}
`;

const GameLinkItem = styled.button<{$textColor: string}>`
  position: relative;
  display: flex;
   
  flex-direction: column;
  align-items: center;
  border-radius: 0.375rem;  
  border: 1px solid transparent;  
  background-color: rgba(37, 39, 38, 0.5);
  padding-top: 0.5rem; 
  padding-bottom: 0.5rem;  
  transition-property: all;   
  transition-duration: 200ms;  
  color: ${(props) => props.$textColor || '#FFFFFF'}; 

  svg {
    height: 25px; 
    width: 25px; 
  }

  span {
    margin-top: 0.75rem; 
    font-size: 0.75rem; 
    font-family: 'InterSemiBold', monospace;
    text-transform: capitalize; 
  }
`;

const GameLinkBackgroundOverlay = styled.div<{$gradient: string}>`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  opacity: 0.5; 
  background: ${(props) => props.$gradient}; 
`;

 
 
const Divider = styled.div`
  margin-top: 1rem; 
  border-bottom-width: 1px; 
  border-color: #2e4438; 
`;

const LogoutLink = styled.div`
  margin-bottom: 0.75rem; 
  margin-top: 0.5rem; 
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  padding-top: 0.5rem; 
  padding-bottom: 0.5rem; 
  color: #858DAD; 
  transition-property: background-color; 
  transition-duration: 200ms; 

  &:hover {
    background-color: rgba(41, 48, 44, 0.5); 
  }

  span {
    font-size: 0.75rem; 
    text-transform: capitalize; 
  }
`;

