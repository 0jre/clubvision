import { DashboardStyle} from "@/styles/Globalstyleview";
import styled, { keyframes } from "styled-components";
import { User } from "@/types/user/types";
import React, { useEffect,useState } from "react";
import { useRouter } from "next/router";
import HeadGlobal from "@/club/head/glob.n";
import { ProfileStats } from "@/types/studio";
import LoadingPageView from "@club/resources/loading/market.loading";
import Scrollmargin from "@/components/scrollingcard/scroll.xc";
import ROUTENVX from "@/routes/routes";
import ProfileVhash from '@club/components/clubr/profile.vhash';
 
import ContentStudio from "./content";
 

interface Props {
  user?: User;
  userinfox: any;
  userinfo: any;
}

export default function StatisticStudio({ user, userinfo, userinfox}: Props){
  
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [dashboard, setdashboard] = useState(1)

  const activeLink = router.asPath;
const isActive = (pathname: string) => {
  return activeLink.includes(pathname) ? 'active' : 'sc';
};


  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        const response = await fetch(`/api/_v4/studio/studio.club?userId=${user?.id}`);

        if (!response.ok) {
          throw new Error('Falhou em buscar estatísticas de perfil');
        }

        const data = await response.json();
        setProfileStats(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileStats();
  }, []);

    
 
  if(loading) {
    return<><LoadingPageView /></>
  }

  // if (error) return (
  //   <>
  //   <HeadGlobal Title='Problema ao mostrar dados...'/>
  //    <ContainerLi>
  //         <ContentCrad>
 
  //       <ContentList>

  //       <li>
  //          <i className="fi fi-rs-not-found-magnifying-glass" />
  //        </li>

  //        <p>O problema pode estar ligado ao fato de não existir dados vinculados ao seu VisionID.  Error: {error}</p>

  //       </ContentList>
     
  //         </ContentCrad>
  //      </ContainerLi>
 
  //   </>
  // );
  
//   if (!loading && !profileStats) return (
//   <>

// <HeadGlobal Title='Problema ao mostrar dados...'/>
//      <ContainerLi>
//           <ContentCrad>
 
//         <ContentList>

//         <li>
//            <i className="fi fi-rs-not-found-magnifying-glass" />
//          </li>

//          <p>Nenhum dado disponível</p>

//         </ContentList>
     
//           </ContentCrad>
//        </ContainerLi>
//  </>
//   );
  
 
    return(
        <>
  <HeadGlobal Title={'NoVision Studio'}/>
   
        {user && (
          <>
     
       <MainDashboardN>
  

       <MarginCenter>
   <MarginProfile>
          <div className="border flex items-center p-1 justify-center gap-1 border-gray-300 rounded-full">
             <img src={user.avatar} height={45} width={45} />
          </div>
          <li>
            <ul> 
            <h2>{user.username}</h2> <div className='Uisx' /> <h3 onClick={() => router.push(`/@${userinfox.name}`)}>@{userinfox.name}{userinfox.subdominio}</h3>
            </ul>

            <ul>
            <h5>Curtidas {profileStats?.likes ? profileStats?.likes : 0}</h5>
            <div className="Uisx2" />
            <h5>Seguidores {userinfo.followers ? userinfo.followers : 0}</h5>
            <div className="Uisx2" />
            <h5>Seguindo {userinfo.following ? userinfo.following : 0}</h5>
            </ul>
          </li>
         </MarginProfile>
       

         <MarginSelectI>
        <Scrollmargin>
         
 

        
       <button
          onClick={() => setdashboard(2)}
          className={`${dashboard == 2 ?  'active' : 'sc'}`}
        >
          <div className="sfcf">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/></svg>
          </div>
         <h4>Galeria</h4>
        </button>

       <button
          onClick={() => setdashboard(1)}
          className={`${dashboard == 1 ?  'active' : 'sc'}`}
        >
          <div className="sfcf">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 11.207a.5.5 0 0 1 .146-.353l2-2a.5.5 0 0 1 .708 0l3.292 3.292a.5.5 0 0 0 .708 0l4.292-4.292a.5.5 0 0 1 .854.353V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z"/></svg>
          </div>
         <h4>Estatísticas</h4>
        </button>

        
          
      
<button
          onClick={() => router.push(ROUTENVX.accountcenter)}
          className={isActive(ROUTENVX.accountcenter)}>
          <div className="sfcf">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
          </div>
         <h4>Central de conta</h4>
        </button>
   
    
        </Scrollmargin>
       </MarginSelectI>
       </MarginCenter>
      
    

     
    {dashboard == 2 && (
             <MarginC>
                <ContentStudio user={user} />
             </MarginC>
         )}
 
  
         {dashboard == 1 && (
            <MarginC>
                     <CardViewsdates>       
        <h3 className="h3">Métricas principais</h3>
        <ul>
          <section>
            <h5>Visualizações de postagens</h5>
            <h1>{profileStats?.postViews ? profileStats?.postViews : 0}</h1>
          </section>

          <section>
            <h5>Visualizações de perfil</h5>
            <h1>{profileStats?.profileViews ? profileStats?.profileViews : 0}</h1>
          </section>

          <section>
            <h5>Curtidas</h5>
            <h1>{profileStats?.likes ? profileStats?.likes : 0}</h1>
          </section>

          <section>
            <h5>Comentários</h5>
            <h1>{profileStats?.comments.count ? profileStats?.comments.count : 0 }</h1>
          </section>
        </ul>
      </CardViewsdates>
       
      <h3 className="h3">Postagem mais engajada</h3>

       <CardPosteng> 
 
      {profileStats?.mostEngagedPost && (
        <>
          <li style={{ display: 'flex', flexDirection: 'row' }}>
          <img src={profileStats.mostEngagedPost.imageUrl || profileStats.mostEngagedPost.PasVideo} alt="Postagem mais engajada" />
          <li style={{ display: 'flex', flexDirection: 'column',   margin: '0.8em' }}> 
          <p>{profileStats.mostEngagedPost.description}</p>
          <h3>Data</h3>
          </li>
           
          </li>
          
        <section>
     
          <span> 
         

          <li className="li">
            <h5><i className="fi fi-rr-heart" /></h5>
          <p>{profileStats.mostEngagedPost.liked}</p>
          </li>
          

          <li  className="li">
            <h5><i className="fi fi-br-stats" /></h5>
          <p>{profileStats.mostEngagedPost.views}</p>
          </li>

          
          <li  className="li">
            <h5><i className="fi fi-rs-comment-dots" /></h5>
          <p>{profileStats.mostEngagedPost.totalComments}</p>
          </li>
          
          </span>
        </section>
        </>
      )}
      </CardPosteng>
       
            </MarginC>
         )}
 
  
        </MainDashboardN>
     
        </>
         )}
        
  
        </>
    )
}

 
 
// STYLED 

const MarginC = styled.div`
 position: relative;
   overflow: hidden;
 
    width: 100%;
   padding: 1em;
  border-radius: 12px;
  min-height: 80vh;
     
  &:last-child {
    margin-bottom: 0; 
  }

  
 @media screen and (max-width: 768px) {
  padding: 0em;
  margin: 0;
  width: 100%;
  background: transparent;
 }
`;

 

const MarginCenter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4em;
   gap: 3px;
   width: 100%;
   
   transition: 0.7s all;
   border-bottom: 2px solid #b4b9b726;
   margin-bottom: 1em;
`;


const MarginSelectI = styled.div`
   display: flex;
   
   align-items: center;
   padding: 0.5em;
   
 
 

   
   .active {
  
    gap: 5px;

     .sfcf{
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7c807d;
      background: #393a39;
      border-radius: 20px;
      padding: 0.2em;
      transition: 0.7s all;
    }

   }
   
   svg{
    transition: 0.7s all;
   }
  
   button{
    display: inline-flex;
    align-items: center;
    padding: 0.5em 1em 0.5em;
    transition: 0.2s all;
    border-radius: 42px;
    gap: 5px;
    transition: 0.7s all;
    font-family: 'InterSemiBold', monospace;
    color: #bfc4c7;
  
    
    
   }
 
  button:disabled{
     cursor: not-allowed;
    .icon{
      color: #a33434;
    }
    h4{
     color: #a33434;
   } 
 }

 
`;


const CardPosteng = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
   width: 100%;
 
   background: rgba(29, 29, 31, 0.548);
  border-radius: 2px;
  padding: 0.8em 1em 0.8em;

  img{
    width: 150px;
    height: 90px;
    border-radius: 4px;
  }

  section{
    display: flex;
    padding: 1em;
    align-items: top;
   
    gap: 424px;
  
  }

  
  span{
      display: flex;
    justify-content: space-between;
  

  }
   

  .li{
    margin: 0.8em;
    gap: 3px;
    text-align: center;
     
  }

  h5{
    color: #787e83;
   font-family: 'InterSemiBold', monospace;
    font-size: 14px;
    
  }

  h4{
    font-family: 'Europa Grotesk', monospace;
    font-size: 26px;
    color: #5e6661d4;
    text-align: center;
  }

  p{
    font-family: 'Inter', monospace;
    font-size: 15px;
    color: #787e83;
  }

  h3{
    font-family: 'Inter', monospace;
    font-size: 13px;
    color: #5e6661d4;
  }
`;


const MarginProfile = styled.div`
  
 padding: 8px;
 display: flex;
 flex-flow: row;
 gap: 16px;
 -webkit-box-align: center;
 align-items: center;

 img{
  border-radius: 50%;
 }

  .Uisx{
    height: 11px;
    margin: 0px;
    background-color: rgba(192, 186, 186, 0.16);
    width: 1px;
  }
  
  .Uisx2{
    height: 4px;
    border-radius: 30px;
    margin: 0px;
    background-color: rgba(192, 186, 186, 0.16);
    width: 4px;
  }

 li{
  display: flex;
  flex-direction: column;
  ul{
    display: inline-flex;
    align-items: center;
    gap: 8px;

    h2, h3{
     font-family: 'InterSemiBold', sans-serif;
     font-size: 17px;
    }

    h3{
      color: #626463;
      cursor: var(--f-cursor-pointer)
    }
 
  }
 }

 
    h5{
      font-family: 'InterSemiBold', sans-serif;
      font-size: 11px;
      color: #b6bfc0;
    }
`;
const CardViewsdates = styled.div`
  

  ul{
     
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);  
    gap: 16px;  

    section{
      margin: 0.4em;
    flex-basis: 20.5rem;
    padding: 16px;
    color: #a0a1a8;
    font-family: 'InterSemiBold', monospace;
    background: rgba(72, 77, 72, 0.274);
    border-radius: 8px;
    -webkit-box-align: center;
    align-items: center;
 
    }
  }

  

 

`;

  
 
const MainDashboardN = styled.section`
 
  padding:  0 0 3em;
   min-height: 80vh;
   margin: 1em;
  animation: PageAnim 0.8s linear;
 
  @keyframes PageAnim {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }

 .h3{
    font-family: 'Europa Grotesk', monospace;
    font-size: 26px;
    color: #313332d3;
    margin: 0.5em;
    text-align: center;
  }
`;
 