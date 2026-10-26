import styled from "styled-components";
import { useRouter } from 'next/router';
import NVXROUTE from '@/routes/routes';
import Image from "next/image";
import { useEffect, useState, ReactNode } from 'react';
import ROUTENVX from "@/routes/routes";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

import Nvxre from '@/public/icons/verified-nvxre.png'
import Crown from '@/public/favicon.png'

import { decrypt } from "@/core/security/encryption";

import axios from "axios";
import { UserInfo } from "@/types/discord/usersearch";
import { User } from "@/types/user/type.cla";

import { Gallery, Icon, LampCharge, Rank,Story,Trade,UserSearch,} from 'iconsax-react';
import { Smalllistavatar } from "@club/components/menu/account.utils";
import Tooltip from "@club/components/uls/hover.idex";
import { Banana, CircleChevronLeft, CircleChevronUp, Newspaper, Plus, Podcast, Store, X, Wallet, Ship, ImagesIcon, MoveLeft, Sidebar, PanelRightClose, PanelLeftClose } from 'lucide-react';
import LogoVision from '../../../../../components/vision/logo';
import classNames from 'classnames';
import { getBorderColorFromTheme, getBorderColorFromThemex, getDarkThemeColor } from "@/data/themes/theme.config";

interface NavView {
  OpenX?: boolean;
  Logo: React.ReactNode;
signature?: string;
  id: string;
  name: string;
  avataruser: string;
  accountactive: boolean;
  accountverified: boolean;
  accountnvx: boolean;
  accountteam: boolean;
  connect?: React.ReactNode;
  theme?: string;

}
const NavLeft: React.FC<NavView> = ({signature,theme,connect,Logo,OpenX, id, name, avataruser,accountactive,accountverified,accountnvx,accountteam}) => {

  const [isNavbarVisible, setIsNavbarVisible] = useState(OpenX);
  const [isopensidebar, setsidebar] = useState(true);
  const [viewmenu, setviewmenu] = useState(false)
  const [BarMobile, setBarMobile] = useState(true)


  const handlesidebar = () => {
      setsidebar(false);
    }


    const handlesidebaropen = () => {
      setsidebar(true);
    }

  const toggleNavbarVisibility = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };

  const router = useRouter();
  const activeLink = router.asPath;
  const { username } = router.query;

  const isActive = (pathname: string) => {
    return activeLink === pathname ? 'navbar-active' : '';
  };

  const isActivex = (pathname: string) => {
    return activeLink === pathname ? 'acm' : '';
  };
   

  // Verificação para URLs dinâmicas como "/@username"
const isDynamicActive = (pathname: string) => {
  return activeLink === pathname ? ' acm ' : '';
};


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 631) {
        setIsNavbarVisible(false); // Hide sidebar on small screens
      } else {
        setIsNavbarVisible(true); // Hide sidebar on small screens
      }
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
 
  const [isLoading, setIsLoading] = useState(true);
  const [UserClaInfo, setUserClaInfo] = useState<User | null>(null);
  

  useEffect(() => {


    async function fetchClainfo() {
      try {
     
        setIsLoading(true);
        const response = await axios.get(`/api/cla/info.user.cla?userId=${id}`);
        const decryptedData = decrypt(response.data.log);
        const userInfoObject = JSON.parse(decryptedData);
        setUserClaInfo(userInfoObject);
        setIsLoading(false);
      } catch (error) {
        // console.error('Error fetching user info:', error);
        setIsLoading(false);
      }
    }

    
    fetchClainfo()
  

  }, []);
 
 
  return (
    <>
    <ContentFloatL>
     
     {isNavbarVisible && ( 
          <>
           <ContainerLeft>
         

        <div className="UUjb">
        {isopensidebar ? (
           <ButtonCL  className="none">
         
            {Logo}
           
            </ButtonCL>
       ) : ( 
            <Magrg >
            
          {Logo}
            <Buttona onClick={handlesidebaropen}>
              <PanelLeftClose  color="white"/>
            </Buttona>

        </Magrg>
       )}
         
    {isopensidebar && (
      
      <button className={isopensidebar ? "xcv" : " uIN"}>
      {connect ? 
      <img src="./icons/hdsfdsndsjf.gif" alt="Loading" className="pulsing-border" />
      : (
         <>
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-ear-off-icon lucide-ear-off"><path d="M6 18.5a3.5 3.5 0 1 0 7 0c0-1.57.92-2.52 2.04-3.46"/><path d="M6 8.5c0-.75.13-1.47.36-2.14"/><path d="M8.8 3.15A6.5 6.5 0 0 1 19 8.5c0 1.63-.44 2.81-1.09 3.76"/><path d="M12.5 6A2.5 2.5 0 0 1 15 8.5M10 13a2 2 0 0 0 1.82-1.18"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
         </> 
      )}
    
    </button>
    )}
        </div>
     
    
     {isopensidebar ? ( 
       <>
        <ContentMainapp theme={theme}>
         
 
        <HovercardContainer>
       
          <li>
          <div className={isActivex(NVXROUTE.Dashboard)} />
          <Tooltip title='Inicio #clubvision '>
          <button onClick={() => router.push(NVXROUTE.Dashboard)} className={isActive(NVXROUTE.Dashboard)}>
            
        <LampCharge size="24" color="#979c99"/>

            </button>
          </Tooltip>
            
          </li>
         
      </HovercardContainer>

    

      <HovercardContainer>
       
       <li>
       <div className={isActivex(NVXROUTE.Discovery)} />
       <Tooltip title='Discovery #clubvision '>
       <button onClick={() => router.push(NVXROUTE.Discovery)} className={isActive(NVXROUTE.Discovery)}>
         
  <Gallery size="24" color="#979c99"/>
         </button>
       </Tooltip>
         
       </li>
      
   </HovercardContainer>
    

 
  {username && (  
   <HovercardContainer>
       
          <li>
          <div className={isDynamicActive(`@${username}`)} />  
          <Tooltip title='Perfil Clubvision'> 
            <button onClick={() => router.push(`${ROUTENVX.User}/${username}`)} >
            <UserSearch size="25" color="#ced8cf" variant="Linear"/>
            </button>
            </Tooltip>
          </li>
 
  </HovercardContainer>
)}

      
     
       <HovercardContainer>
       
          <li>
          <div  className={isActivex(NVXROUTE.Streamers)}/>    
          <Tooltip title='Transmissões'>
             
            <button  
            className={isActive(NVXROUTE.Streamers)} onClick={() => router.push(NVXROUTE.Streamers)} >   
              
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/></svg>
            </button>
            
          </Tooltip>
          </li>
       
       </HovercardContainer>

<HovercardContainer>
   
        <li>
            <Tooltip title='Mercado #clubvision'>
      <button 
            className={isActive(NVXROUTE.market)} onClick={() => router.push(NVXROUTE.market)} >        
      
<Story size="24" color="#8c9294"/>
        </button> 
         </Tooltip>
        </li>

 
     </HovercardContainer>
  
       
       <hr className="asdjc"/>
          


       <HovercardContainer>
       
          <li>
          <div  className={isActivex(NVXROUTE.Connect)} />
          <Tooltip title='Jogar Agora'>
           
            <button 
            className={isActive(NVXROUTE.Connect)} onClick={() => router.push(NVXROUTE.Connect)} >        
       
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>
            </button>
            </Tooltip>
          </li>
      
            
       </HovercardContainer>

    
       <HovercardContainer>
    
          <li>
            
      <div  className={isActivex(NVXROUTE.Wiki)} />
      <Tooltip title='Wikivision'>
           
            <button 
            className={isActive(NVXROUTE.Wiki)} onClick={() => router.push(NVXROUTE.Wiki)} >        
       
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/><path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"/><path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"/><circle cx="12" cy="12" r="10"/></svg>

            </button>
            </Tooltip>
          </li>
          
           
       </HovercardContainer>
 
       </ContentMainapp>
  
       
       <section className="dksection">

       <HovercardContainer>
        
       
           <li>
           <div className={isActivex(NVXROUTE.clubvision)} /> 
           <Tooltip title='Menu'>
             
             <button className={isActive(NVXROUTE.clubvision)} onClick={() => router.push(NVXROUTE.clubvision)} >     
             
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12 2a10 10 0 0 1 7.38 16.75"/><path d="M12 8v8"/><path d="M16 12H8"/><path d="M2.5 8.875a10 10 0 0 0-.5 3"/><path d="M2.83 16a10 10 0 0 0 2.43 3.4"/><path d="M4.636 5.235a10 10 0 0 1 .891-.857"/><path d="M8.644 21.42a10 10 0 0 0 7.631-.38"/></svg>
             </button>
             </Tooltip>
           </li>
           
        </HovercardContainer>
       
        <HovercardContainer>
        
      
           <li>
           <div className={isActivex(NVXROUTE.Store)} /> 
           <Tooltip title='Storevision'>
             
             <button className={isActive(NVXROUTE.Store)} onClick={() => router.push(NVXROUTE.Store)} >   
             
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
             </button>
             </Tooltip>
           </li>
         
                 
        </HovercardContainer>

        <HovercardContainer>
        
           <li>
           <Tooltip title='Seja Premium'>
             
             <button className={'csd'} onClick={() => router.push(NVXROUTE.storePrime)} >        
           <img src="/icons/crown_badge.png" alt="premium" height={24} width={24} />
             </button> 
             </Tooltip>
           </li>

       
        </HovercardContainer>
 
<HovercardContainer>
        
        
          <li>
             <button onClick={handlesidebar}>
              <PanelRightClose  color="white" />
            </button>
          </li>
        </HovercardContainer>

 
        </section>
         
       </>
     ) : (
      <Marginsidebar theme={theme}>
       
       
       <li>
        
       <button onClick={() => router.push(NVXROUTE.Dashboard)} className={isActive(NVXROUTE.Dashboard)}>
<LampCharge size="24" color="#979c99"/>
            <h4>Inicio </h4>
         </button> 
         </li>

         

<li>
        
<button onClick={() => router.push(NVXROUTE.Discovery)} className={isActive(NVXROUTE.Discovery)}>
         
              <Gallery size="24" color="#979c99"/>
            <h4>Discovery </h4>
         </button> 
         </li>
       <li>
        
  
         </li>


       <li>
       <button 
            className={isActive(NVXROUTE.Streamers)} onClick={() => router.push(NVXROUTE.Streamers)} >        
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/></svg>
           <h4>Streams</h4>
        </button> 
        </li>

    
        
      <hr className="asdjc"/>
      <li>
      <button 
            className={isActive(NVXROUTE.Connect)} onClick={() => router.push(NVXROUTE.Connect)} >        
      
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>
           <h4>Jogar Agora</h4>
        </button> 
        </li>
     

        <li>
      <button 
            className={isActive(NVXROUTE.leaderboard)}  onClick={() => router.push(ROUTENVX.leaderboard)}>
        <Rank color="#8c9294" size={24} />
           <h4>Leaderboard</h4>
        </button> 
        </li>
        
      <li>
        <button 
            className={isActive(NVXROUTE.Wiki)} onClick={() => router.push(NVXROUTE.Wiki)} >        
      
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/><path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"/><path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"/><circle cx="12" cy="12" r="10"/></svg>
           <h4>Wikivision</h4>
        </button> 
        </li>


      
        <hr className="asdjc"/>
        <li>
      <button 
            className={isActive(NVXROUTE.market)} onClick={() => router.push(NVXROUTE.market)} >        
      
    <Story size="24" color="#8c9294"/>
           <h4>Mercado</h4>
        </button> 
        </li>

        <li>
      <button 
            className={isActive(NVXROUTE.trader)} onClick={() => router.push(NVXROUTE.trader)} >        
      
    <Trade size="24" color="#8c9294"/>
           <h4>Trocar Tokens</h4>
        </button> 
        </li>

      <li>
      <button 
            className={isActive(NVXROUTE.opencase)} onClick={() => router.push(NVXROUTE.opencase)} >        
      
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 6H0V14H1C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V7C2 6.73478 1.89464 6.48043 1.70711 6.29289C1.51957 6.10536 1.26522 6 1 6Z" fill="#353636"></path><path d="M19 6C18.7348 6 18.4804 6.10536 18.2929 6.29289C18.1054 6.48043 18 6.73478 18 7V13C18 13.2652 18.1054 13.5196 18.2929 13.7071C18.4804 13.8946 18.7348 14 19 14H20V6H19Z" fill="#353636"></path><path d="M9 14V4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V14C4 14.5304 4.21071 15.0391 4.58579 15.4142C4.96086 15.7893 5.46957 16 6 16H9V14Z" fill="#1a1a1b"></path><path d="M14 4H11V16H14C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14V6C16 5.46957 15.7893 4.96086 15.4142 4.58579C15.0391 4.21071 14.5304 4 14 4Z" fill="#141414"></path><path d="M9 19C9 19.2652 9.10536 19.5196 9.29289 19.7071C9.48043 19.8946 9.73478 20 10 20C10.2652 20 10.5196 19.8946 10.7071 19.7071C10.8946 19.5196 11 19.2652 11 19V16H9V19Z" fill="#1d1e1f"></path><path d="M11 1C11 0.734784 10.8946 0.48043 10.7071 0.292893C10.5196 0.105357 10.2652 0 10 0C9.73478 0 9.48043 0.105357 9.29289 0.292893C9.10536 0.48043 9 0.734784 9 1V4H11V1Z" fill="#212324"></path></svg>
           <h4>Abrir Cases</h4> 
        </button> 
        </li>


        <section className="dksectionx">
        <li>
        <button className={isActive(NVXROUTE.clubvision)} onClick={() => router.replace(NVXROUTE.clubvision)} >        
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12 2a10 10 0 0 1 7.38 16.75"/><path d="M12 8v8"/><path d="M16 12H8"/><path d="M2.5 8.875a10 10 0 0 0-.5 3"/><path d="M2.83 16a10 10 0 0 0 2.43 3.4"/><path d="M4.636 5.235a10 10 0 0 1 .891-.857"/><path d="M8.644 21.42a10 10 0 0 0 7.631-.38"/></svg>
           <h4>Menu</h4>
        </button> 
        </li>


        <li>
        <button className={isActive(NVXROUTE.Store)} onClick={() => router.push(NVXROUTE.Store)} >        
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
           <h4>Storevision</h4>
        </button> 
        </li>


        <li>
        <button onClick={() => router.push(NVXROUTE.storePrime)} >        
           <img src="/icons/crown_badge.png" alt="premium" height={24} width={24} />
           <h4>Seja Premium</h4>
        </button> 
        </li>

        
       
        </section>

 
      </Marginsidebar>
     )}
      
 
      </ContainerLeft>
          </>
     )}
     
     {!isNavbarVisible && ( 
          <>
          <ButtonCLose onClick={toggleNavbarVisibility}>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-compact-right" width="34" height="34" viewBox="0 0 24 24" stroke-width="1.5" stroke="#a6aab3" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M11 4l3 8l-3 8" />
          </svg>
          </ButtonCLose>
          </>
     )}
      
       </ContentFloatL>

 
      {BarMobile ? (
       <MarginMobile theme={theme}>
         
         {viewmenu && (
          <>
          <section className="section">

        <div className="jsfknf">
          
        {/* <button className="Yinxb" onClick={() => setBarMobile(false)}>
          <X size={24}  color="#979c99" />
          </button> */}



<MarginCard>
 
<ViewInfo onClick={() => router.push(`/${ROUTENVX.DashboardProfile}`)}>

<section className="uu3nc">


 <Stack direction="row" spacing={0.4}>

{UserClaInfo ? (
<>
<Tooltip title={`${UserClaInfo.Clasigla ? 'Clã -' : '' } ${UserClaInfo.Clasigla}`} > 
<Badge
overlap="circular"
anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
badgeContent={
<Smalllistavatar src={UserClaInfo.LogoCla ? `${UserClaInfo.LogoCla}` : "/favicon.png"} alt={UserClaInfo.Clasigla} />
}
>

<Avatar src={avataruser} alt={name}  />
</Badge>
</Tooltip>
</>
) : (
<Avatar src={avataruser} alt={name}  />
)}
</Stack>
 
<ul>
<h3>{name}  
{accountverified && (
<>
<svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="20" width="20" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg>
</>
)}
      {accountnvx && (
      <>
     <Image className="logoroda" src={Nvxre} alt="nvxre" height={22}/>
      </>
      )}  

{accountteam && (
      <>
      <Image  className="logoroda" src={Crown} alt="Moderator" height={22}/>
      </>
      )}  </h3>
<p>{accountactive ? "Cidadão" : "Visitante"} • {signature}</p>
</ul>

</section>


<i className="fi fi-bs-menu-dots"/>

</ViewInfo>
  

  <li>
  
  
 
  <div onClick={() => router.push(ROUTENVX.Wiki)} className={ROUTENVX.Wiki ? 'active dbutton' : 'dbutton'}> 
  <i className="fi fi-sr-globe-pointer"></i>
    <h3>Wikivision</h3>
  </div>
 
  <div onClick={() => router.push(ROUTENVX.Legal)} className={ROUTENVX.Legal ? 'active dbutton' : 'dbutton'}>
  <i className="fi fi-sr-rules"></i>
    <h3>Regras</h3>
  </div>

  

  <div onClick={() => router.push(ROUTENVX.Store)} className={ROUTENVX.Store ? 'active dbutton' : 'dbutton'}>
  <i className="fi fi-sr-shop">
 
  </i>
    <h3>Store</h3>
  </div>


 <div onClick={() => router.push(ROUTENVX.Streamers)} className={ROUTENVX.Streamers ? 'active dbutton' : 'dbutton'}>
<i className="fi fi-brands-twitch"></i>
    <h3>Transmissões</h3>
  </div>

  

  </li>



</MarginCard>

<GameSection>

                  
<GameButton onClick={() => router.push(ROUTENVX.clubvision)}>
<div className="color5 fli">
<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>

<h3>Menu</h3>
  </div>
   
  </GameButton>

  
  
  <GameButton onClick={() => router.push(ROUTENVX.storePrime)}>
  <div className="color2 fli">
  <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
 <h3>Premium</h3>
  </div>
   
  </GameButton>


</GameSection> 

          </div>    
          
</section>
           </>
         )}
         <div className="p-0 pb-0 ">
       <Visionb className={viewmenu ?  'dsfh ' : 'dsfh'} theme={theme}>
       <ul>
       

          <button onClick={() => viewmenu ? setviewmenu(false) : setviewmenu(true)} 
          className={viewmenu ? 'active bhsd' : 'bhsd'}>

{viewmenu ? (
<X size={24}  color="#979c99" />
) : (
  <CircleChevronUp  size={24} color="#979c99" />
)}
<h3>Menu</h3>

</button>
   
     

        <button  onClick={() => router.push(ROUTENVX.Discovery)}
          className={isActive(ROUTENVX.Discovery) ? 'active bhsd' : 'bhsd'}
          >
          <Gallery size={24} color="#979c99"/>
       <h3>Discovery</h3>
       </button>
     

        <button  onClick={() => router.push(ROUTENVX.Dashboard)}
              className={isActive(ROUTENVX.Dashboard) ? 'active bhsd' : 'bhsd'}
          >
       <LampCharge size="24" color="#979c99"/>

        <h3>Inicio</h3>
        </button>

   <button  onClick={() => router.push(ROUTENVX.wallet)}
              className={isActive(ROUTENVX.wallet) ? 'active bhsd' : 'bhsd'}
          >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#979c99" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
        <h3>Walletvision</h3>
        </button>


       
        <button className="bhsd" onClick={() => router.push(`/${ROUTENVX.DashboardProfile}`) }>
        <Stack direction="row" spacing={0}>

{UserClaInfo ? (
<>
<Tooltip title={`${UserClaInfo.Clasigla ? 'Clã -' : '' } ${UserClaInfo.Clasigla}`} > 
<Badge
overlap="circular"
anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
badgeContent={
<Smalllistavatar src={UserClaInfo.LogoCla ? `${UserClaInfo.LogoCla}` : "/favicon.png"} alt={UserClaInfo.Clasigla} />
}
>

<Avatar src={avataruser} alt={name} className="h-[15px] w-[15px]"  />
</Badge>
</Tooltip>
</>
) : (
<Avatar src={avataruser} alt={name}  className="h-[15px] w-[15px]" />
)}
</Stack>
 
        </button>

       </ul>
       </Visionb>
       </div>
       </MarginMobile>
      ) : (
        <>
        <BDutton onClick={() => setBarMobile(true)} >
        <Image src={'/nvrp/20240520_081457.png'} alt='novision' height={30} width={30} />
        </BDutton> 
        </>
      )}
    </>
  );
};


export default NavLeft;



const BDutton = styled.button`
   
  border-radius: 50%;
  position: fixed;
  right: 8px;
  display: flex;
  justify-content: center;
  z-index: 99893;
  bottom: 12px;
  border: 2px solid #1f2122;
  padding: 0.3em;

   
  
`;
const GameSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  margin-bottom: 20px;
`;

const GameButton = styled.div`
 
  border: none;
  border-radius: 10px;
  margin: 0.3em;
  cursor: var(--f-cursor-pointer);
  display: flex;
  flex-direction: column;
  align-items: center;
 
  border: 2px solid #1b1b1d;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease;

 

   h3{
    font-size: 12px;
    font-family: 'ProximaNova-Italic', sans-serif;
    text-transform: uppercase;
    margin-top: 0.3em;
   }

   .fli{
    width: 100%;
    text-align: center;
    padding: 0.9em;
    height: 100%;
   }

   .color1{
        background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(219, 75, 255, 0.4) 0%, rgba(32, 32, 40, 0) 100%);
        h3{
      color: #6f32be;
    }
   }

   .color2{
    background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(75, 255, 114, 0.4) 0%, rgba(32, 32, 40, 0) 100%);
    h3{
      color: #32be61;
    }
   }


   .color3{
    background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(219, 39, 54, 0.288) 0%, rgba(32, 32, 40, 0) 100%);
    h3{
      color: #db2736;
    }
   }

   .color4{
    background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(255, 75, 84, 0.4) 0%, rgba(32, 32, 40, 0) 100%);
    h3{
      color: #e02232;
    }
   }


   .color5{
    background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(219, 205, 206, 0.4) 0%, rgba(32, 32, 40, 0) 100%);
    h3{
      color: #bcccc3;
    }
   }

   .color6{
    background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(75, 147, 255, 0.4) 0%, rgba(32, 32, 40, 0) 100%);
    h3{
      color: #327fbe;
     }
   }


   .color7{
    background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(41, 194, 105, 0.164) 0%, rgba(32, 32, 40, 0) 100%);
    h3{
      color: #32be6c;
     }
   }

   svg{
    stroke: #c7cfcb;
   }
`;
  

const MarginMobile = styled.div<{ theme: string }>`
  display: none;

  
  @media screen and (max-width: 768px) {
    display: block;
    position: relative;
    z-index: 3239;
   height: 100%;
  width: 100%;
     
   

    .Yinxb{
  display: flex;
  justify-content: center;
   
  text-align: center;
  position: absolute;
 right: 5px;
 top: 5%;
  
}
  
    .section{
   position: fixed; 
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    
    display: flex;
    flex-direction: column;
    align-items: center;
  
    height: 94vh;
    width: 100%;
    max-width: 530px;
    overflow: hidden;
    padding: 1em;
    animation: Iosn 0.2s linear;
    
    button{
      background-color: #131414;
      padding: 0.4em 1em 0.4em;
      border-radius: 13px;

    }

    &.hidden {
      display: none;
    }
    .shd{
      padding: 0.9em;
    }
  }
  
  }

 
  .dsfh{
 
  -webkit-mask: linear-gradient(to bottom, #0B0C0A 50%, #0B0C0A 30%);
  mask: linear-gradient(to bottom, #0B0C0A 50%, #0B0C0A 30%);
  border-radius: 0;
 
   
  }
   
  .jsfknf{
  position: absolute;
  width: 100%;
 
 bottom: 1svh;
 border-radius: 32px 32px 0;
  background: ${(props) => props.theme ? props.theme : '#1a1919'};
 }
  @keyframes Iosn {
    0%{   
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  
`;


const MarginCard = styled.div`
 
 display: flex;
 flex-direction: column;
 padding: 0.9em;
 animation: IosnKyt 0.3s linear;
  
  
 li{
  display: flex;
  flex-direction: column;
  width: 100%;
 }
  
 .dbutton{
  padding: 0.9em 1em 0.9em;
  border-bottom: 1px solid #1a1b1a;
  cursor: var(--f-cursor-pointer);
  margin-bottom: 0.4em;
  display: inline-flex;
  align-items: center;
  gap: 12px;

  i{
    color: #555658;
    font-size: 18px;
    padding: 0.4em 0.7em 0.4em;
    border-radius: 12px;
    display: flex;
    height: 34px;
    width: 34px;
    align-items: center;
    justify-content: center;
    background-color: #242525f9;
  }

  h3{
    font-family: 'InterSemiBold', monospace;
    font-size: 17px;
    color: #b7bac0;
  }

 }
  
 
 @keyframes IosnKyt {
    0%{   
      transform: translateY(10%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Visionb = styled.div<{ theme: string }>`
  background: ${(props) => getDarkThemeColor(props.theme)} ;
  height: 100%;
  position: relative;
  transition: 0.1s all;
  width: 100%;
  transition: 1s all;
 
  ul {

    padding: 0.2em 0.2em 0.1em;
    display: flex;
    align-items: center;
    justify-content: center;
  gap: 0.8em;
  }
  
  .bhsd {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 9px;

    
  }

  h3 {
      color: #7f8586;
      font-size: 9px;
      font-family: 'InterSemiBold', monospace;
    }

    i{
    color: #7f8586;
    font-size: 20px;
    }

  button{
     padding: 0.5em;
 
     
  }

  .active{

    padding: 0.5em;
    transition: 1s all;
    
    svg{
      transition: 1s all;
      fill: #4d5751;
      transform: rotate(4deg);
    }
   
 
}
`;
 
const ViewInfo = styled.div`
 
   cursor:  var(--f-cursor-pointer);
   padding: 0.8em 1em 0.8em;
    background-color: #212221a0;
    border-radius: 52px;
   width: 100%;
   display: inline-flex;
   justify-content: space-between;
   align-items: center;

   .uu3nc{
    display: flex;
    flex-direction: row;
    align-items: center;
    }
       
    .logoroda{
      padding: 0.1em;
      border-radius:60%;
    }
   ul{
    display: flex; 
      padding-left: 0.4em;
    flex-direction: column;
   }
    

     .logos{
      border-radius: 50%;
     }
   
    h3{
      font-family: 'Inter';
      font-size: 13px;
      background: linear-gradient(47deg, #888384 0%, rgb(73, 77, 74) 1%, #c9c0c1 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;

    display: inline-flex;
    align-items: center;
    
    }

    p{
      font-size: 11px;
      color: #868c91;
      font-family: 'ProximaNova-', sans-serif;
      margin-bottom: 0.3em;
      max-width: 430px;
    }

`;

const Magrg = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-height: 80px;
  border-radius: 23px;
  padding: 0.3em 0.5em 0.3em;

  img{
    height: 45px;
    width: 45px;
  }
 
`;
 
const ButtonCL = styled.div`
 
  .rotatelogo{
     border-radius: 12px;
    transition: 1s all;
  
  }
  
`;
 
const Buttona = styled.button`
  border-radius: 50%;
  padding: 0.4em;
  height: 30px;
  width: 30px;
  border: 2px solid rgb(61, 65, 62);
  display: flex;
  align-items: center;
  justify-content: center;

  svg{
    height: 17px;
    width: 17px;
  }
`;

const ButtonCLose = styled.button`
    
    z-index: 3;
    position: fixed;
    left: 1;
    top: 0;
    bottom: 0;
   
    transition: 1s all;
    color: #dac5c553;
  
`;


const ContentFloatL = styled.div`
   display: flex;
   flex-direction: row;
 
   @media screen and (max-width: 530px) {
    display: none;
   }
   @keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 184, 148, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(34, 184, 148, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 184, 148, 0.7);
  }
}

.pulsing-border {
  animation: pulse 2s infinite ease-in-out;
  height: 40px;
  width: 40px;
  
  border-radius: 50%; /* Garante que a borda seja circular */
}
`;


 
  // Styled Nav Menu Left
  const ContainerLeft = styled.div`
   
   filter: contrast(33px);
    animation-name: loadbarnavDS;
   animation-duration: 1s;
   padding: 0.8em;
   animation-iteration-count: all ;
   top: 0;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   height: 100%;


   .UUjb{
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0.3em 0 0.3em;
    padding-bottom: 0em;
   }
  
   .dksection{
        border-top: 1px solid #252424;
         width: 100%;
         height: 180px;
        padding: 1em 0 1em;
       }

       .dksectionx{
        border-top: 1px solid #252424;
         width: 100%;
      
        padding: 1em 0 1em;
       }

   .csd{
    border: 2px solid #121312;
    background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #15151625, #73737923);
   }

   .xcv{
    border-radius: 22px;
    border: 2px solid #262927;
    background-color: rgba(59, 63, 59, 0.253);
    width: 40px;
    height: 40px;
   }

   .uIN{
    display: flex;
    gap: 5px;
    border-radius: 9px;
  
    margin-bottom: 1em;
    background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #2c88dd00 -10%, #2c88dd00 25%), linear-gradient(0deg, #869b9140, #73737923);
    justify-content: start;
    align-items: center;
    padding: 0.6em 1em 0.6em;

    h4{
      font-family: 'InterSemiBold', monospace;
      font-size: 13px;
      color: #8c9294;
    }
   }
   button{
 
    border-radius: 9px;
    padding: 0.8em 0.1em 0.8em;
    display: flex;
    justify-content: center;
    align-items: center;
    
    svg{
      stroke: #8c9294;
    }
   }
  
   @keyframes loadbarnavDS {
    from { 
     opacity: 0.3;
     transform: translateX(-100%);
  }
}  
  

hr{
  width: 90%;
  border-color: rgba(57, 57, 61, 0.144);
  margin: 0.2em;
}
 li{
  text-align: center;
  position: relative;
  overflow-x: auto;
 
  hr{
    width: 100%;
    margin-bottom: 0.6em;
    border-color: #b7b5c21a;
  }
 }


   .logonvxre{
     max-width: 80px;
     max-height: 40px;
   }
   
  
   .sew{
    font-size: 9px;
    margin-left: -4em;
   }

   .acm{
    display: none;
   }
  @media screen and (max-width: 430px) {
    .none{
      display: none;
    }
  }

`;

 


  const ContentMainapp = styled.div<{ theme: string }>`
     
     display: flex;
     flex-direction: column;
     gap: 3px;
     height: 100%;
     padding: 1em 0 1em;
     overflow-y: auto;
     margin-top: 0.3em;

  
      ::-webkit-scrollbar {
    display: none;
    }

    .logoview{
       margin-bottom: 3em;
       max-width: 90px;
       max-height: 80px;
       margin-left: 28%;
    }

    

    .navbar-active{
       
      transition: all 0.2s;
      background-color: ${(props) => getBorderColorFromThemex(props.theme)};
      color: rgb(19, 19, 20);
       }

       .acm{
       content: "";
       display: block;
       height: 25px;
       width: 4px;
       background-color: ${(props) => getBorderColorFromTheme(props.theme)};
       border-start-end-radius: 8px;
       border-end-end-radius: 8px;
       position: fixed;
       left: 1px;
         }
        .asdjc{
          border-top: 1px solid #b7b5c21a;
          }
    
       .mobile{
          display: none;
        }

       @media screen and (max-width: 430px) {
        .mobile{
          display: block;
        }
       }

    
    
   `;




const ContentAboutT= styled.div`
    
  li{
    display: flex;
    flex-direction: row;

    h5{
      margin-left: 0.7em;
      color: #6a6c6d;
      font-size: 13px;
    }

    i{
      color: #3d3f41;
    }
  }

  p{
    font-size: 11px;
    color: #52565a;
  }

`;


const Marginsidebar = styled.div<{ theme: string }>`
 
padding: 1em 0.3em 1em;
transition: max-width 0.5s;
    height: 100%;
   width: 100%;
   min-width: 230px;
   border-radius: 12px ; 
   
    overflow: auto;
   
    
animation: Sidebarns 0.2ms linear;
.asdjc{
  width: 100%;
  margin: 1em 0 1em;
          border-top: 1px solid #252424;
          }
   @keyframes Sidebarns {
    from { 
     opacity: 0.3;
     transform: translateX(-100%);
  }
   }
   i{
        font-size: 17px;
     }

    
     li{
      display: flex;
      justify-content: start;
      flex-direction: column;
     
        margin-bottom: 0.2em;
     }

     section{
      display: flex;
 
      flex-direction: column;
     
      width: 100%;
     
     }

     .vier{
      padding-left: 14px;
      display: flex;
      align-items: center;
      flex-direction: column;
      
      h5{
        color: #dedff375;
      }
      p{
        max-width: 142px;
        font-size: 9px;
      }
     }
   
     button:hover{
   
      
       h4,svg{
  
        color: #d2d3da;
        stroke: #d2d3da;
       }
  
 
     }
     
     button{
      display: flex;
       flex-direction: row;
       align-items: center;
       justify-content: start;
       gap: 8px;
       padding: 0.6em 1em 0.6em;
       transition: all 0.9s;
       width: 100%;
       margin-bottom: 0.3em;
        
      
       h4{
       font-family: Play, sans-serif;
    letter-spacing: 0.0025em;
    font-size: 16px;
    font-weight: normal;
    line-height: 24px;
        font-size: 16px;
        font-weight: 100;
      
        color: #9fa1ad ;
       }
  
     } 
  
  
      .navbar-active{
    background-color: rgba(42, 44, 43, 0.637);
    
    border-radius: 12px;
     
    transition: all 0.2s;
 
    
     }
      
      
 
`;


const HovercardContainer = styled.div`
cursor: auto;

display: flex;
align-items: center;
flex-direction: row;
 
animation: Sidebarns 0.2ms linear;
.abg{
  color: #8c9294;
  fill: #8c9294;
}

   @keyframes Sidebarns {
    from { 
     opacity: 0.3;
     transform: translateX(-100%);
  }
   }
   i{
        font-size: 17px;
     }
  
     li{
      display: flex;
      align-items: center;
      flex-direction: row;
     
        margin-bottom: 0.2em;
     }


     .vier{
  
      display: flex;
      align-items: center;
      flex-direction: column;
      
      h5{
        color: #dedff375;
      }
      p{
        max-width: 142px;
        font-size: 9px;
      }
     }
   
     button:hover{
        position: relative;
   
        background-color: #bcc2bf13;
         transition: all 0.2s;
     }
     
     button{
      background-color: initial;
    display: flex;
  
    -webkit-box-align: center;
    align-items: center;
    position: relative;
    border-radius: 8px;
    gap: 12px;
    padding: 8px;
    min-width: 100%;
      
       
       h4{
        font-family: 'Inter', sans-serif;
        font-size: 18px;
        color: #9fa1ad ;
       }
  
     } 
     span{
       margin-left: 12px;
       font-family: 'Yantramanav', sans-serif;
       color: #cfc9c9b9;
     }
    p{
      font-size: 12px;
      color: #b6afaf75;
    }

 
`;


 
