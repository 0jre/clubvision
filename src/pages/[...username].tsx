import router, { useRouter } from 'next/router';
import { dbConnect } from '@/core/integration/connect';
import { User, UserData } from "@/types/user/types"; 
import styled, { keyframes } from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { UserInfo } from "@/types/discord/usersearch";
import React from 'react';

import Nvxre from '@/public/icons/verified-nvxre.png'
import Crown from '@/public/favicon.png'
import ROUTENVX from '@/routes/routes';
 import InvitedUsers from '@club/resources/invite/inviteusers.profile';
import CardVisionPost from '@/club/.vision/dashboard/foryou/card.post';
import NavTopProfile from '@/club/.vision/containers/navigation/topbar/top.profile';
import { decrypt } from "@/core/security/encryption";
import HeadGlobal from '@/club/head/glob.n';
import ErrorPage from '@/app/not-found';
import NotificationUI from "@club/components/notification/card.mnc";
 import LoadingPageView from '@club/resources/loading';
import ProfileVhash from '@club/components/clubr/profile.vhash';
import { GetInfo_nvxre_xyloQuerier } from '@/hooks/InfoData';
import { nvxre_checkAuthentication } from '@/hooks/checkAuthentication';
import { Permission, getPermission} from "@/types/discord/permission";
import { GetServerSideProps} from "next";
import { ModLog, getModLogs } from "@/types/discord/modlog";
import NotOPS from '@/components/ui/not-sx';

interface Props {
    user?: User;
    active?: boolean;
    
  }

 
interface Px {
   users: React.ReactNode;
    children: React.ReactNode;
 
}

interface Badge {
    content: React.ReactNode;
    badge: React.ReactNode;
  
}
interface Post {
  PasVideo: any;
  _id: string;
  description: string;
  imageUrl: string;
  userId: string;
  title: string;
  videourl: string;
}
  
 
 
const Myclub = ({ clubrx, children, takeId}: {clubrx: React.ReactNode ,children: React.ReactNode; takeId: (id: string) => void }) => {
  const router = useRouter();
  const { x } = router.query;
  const [user, setUser] = useState<UserData | null>(null);
    const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState(false)
 const [infox, setinfox] = useState<UserInfo | null>(null);
 const [infox2, setinfox2] = useState<UserInfo | null>(null);
 const { isLoadinguser, data } = nvxre_checkAuthentication();
  const { isLoadingx,userTeam, userSteam, userInfoObject  } = GetInfo_nvxre_xyloQuerier();
 
   useEffect(() => {
      
  if (!isLoadingx || !isLoadinguser) setIsLoading(false);
   
    }, [ isLoadingx,isLoadinguser]);
    
    useEffect(() => {
      
  
    setUser(data);
    setUserInfo(userInfoObject);
    setIsLoading(false);
    setinfox(userSteam)
    setinfox2(userTeam);

   // Passa o ID para a função takeId
    if (user && user.user.id) {
     takeId(user.user.id);
    }

    }, [userInfoObject,userTeam,userSteam ,data,user]);
    
 

     if (isLoading) {
      return (
         <OPSC>
   <LoadingPageView />
    </OPSC>
      )
     }
     
    return(
        <>
       
       <HeadGlobal />
    
     <MargibProfile>
              {clubrx}
                {children}
      
   </MargibProfile> 


        </>
    )
}


export const AccountBadge: React.FC<Badge> = ({ badge, content }) => {
  const [isHovering, setIsHovering] = useState(false);
 
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
 
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  return (
    <>
  <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ContentMember>
      {badge}
      </ContentMember>
 
  {isHovering && (
 <>
 {content}
 </>
    )}
    </div>
    </>
 );
 }

const UserProfile = ({ user,active } : Props) => {
const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
const [userIn, setuserIn] = useState <UserInfo | null>(null);
 const [responseMessage, setResponseMessage] = useState('');
  const [NotificationK, setNotificationK] = useState(false);
 const [inforemarkable , setinforemarkable] = useState<any | null>('');
 const [isloading, setisloading] = useState(false)
 const [problem, setproblem ] = useState(false)
const handleFollow = async (userId: string, followId: string, action: "follow" | "unfollow") => {
  try {
      const response = await fetch("/api/club/follow", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, followId, action }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Falha ao realizar a ação");
      }

      const data = await response.json();
      console.log(data.message); // Mensagem de sucesso

      if (action === "follow") {
        setNotificationK(true);
        setResponseMessage('Você agora está seguindo este perfil!');
        setTimeout(() => {
          setNotificationK(false)
        }, 5000);
         
      } else {
          setNotificationK(true);
          setResponseMessage('Você deixou de seguir este perfil.');
          setTimeout(() => {
            setNotificationK(false)
          }, 5000);
      }
  } catch (error: any) {
      console.error("Erro ao realizar a ação:", error);
      alert(`Erro: ${error.message}`);
      setproblem(true)
  } finally {
    fetchUserInfo()
    fetchFollowersAndFollowing()
    fetchData();
  }
};

async function fetchUserInfo() {
  try {
    if (!user) {
    
      return;
    }

 
    const response = await axios.get(`/api/autentic/xyloQuerierAPI?userId=${user.id}`);
    const responseX = await axios.get(`/api/autentic/inforemarkable?userId=${user.id}`);
    const decryptedDataX = decrypt(responseX.data.log);
    await axios.post('/api/club/visit.profile', {
      visitedUserId: user.id || `visitante`, 
    });
    const userInfoObjectX= JSON.parse(decryptedDataX);
      const decryptedData = decrypt(response.data.log);
      const decryptedData2 = decrypt(response.data.novisionteam);
      const userInfoObject = JSON.parse(decryptedData);
      const userInfoObject2 = JSON.parse(decryptedData2);
      setUserInfo(userInfoObject);
      setuserIn(userInfoObject2)
      setinforemarkable(userInfoObjectX)
      
      if (decryptedData) {
        if (decryptedData && decryptedData) {
          setUserInfo(userInfoObject);
         
      } else {
        console.log('Usuário não possui informações adicionais preenchidas.');
      }

    } else {
      console.error('Error fetching user info:');
      setproblem(true)
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    setproblem(true)
  } 
}

useEffect(() => {
    
         fetchUserInfo();

  }, [user, router]);


  if (!user) {
    return (
      <ErrorPage />
    );
  }

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const userId = `${user?.id}`; 
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`/api/nvxre/postvision/${userId}/post`);
        const postsData: Post[] = response.data;
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching user posts:', error);
       
      }
    };
   
  
 
   
    fetchUserPosts();
 
  }, [user?.id]); 

 
  
 
 
 
const formatNumber = (num: number): string => {
  if (num === undefined || num === null || isNaN(num)) {
    return ''; // Ou tratar o erro conforme apropriado
  }

  if (num >= 1e15) {
    return (num / 1e15).toFixed(num % 1e15 !== 0 ? 1 : 0) + 'Q'; // Quadrilhões
  } else if (num >= 1e12) {
    return (num / 1e12).toFixed(num % 1e12 !== 0 ? 1 : 0) + 'T'; // Trilhões
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(num % 1e9 !== 0 ? 1 : 0) + 'B'; // Bilhões
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(num % 1e6 !== 0 ? 1 : 0) + 'M'; // Milhões
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(num % 1e3 !== 0 ? 1 : 0) + 'K'; // Milhares
  } else if (num >= 100) {
    return num.toFixed(0); // Centenas
  } else if (num >= 10) {
    return num.toFixed(0); // Dezenas
  } else {
    return num.toFixed(0); // Unidades
  }
};
  
  
   


 const VisionPost = () => {

  return (
     <Cardmargin>
 
    {posts.length > 0 ? (
posts.map((post) => (
    <>
  
 {post && post.imageUrl && post.imageUrl.length > 0 && (
 <CardVisionPost
   ButtonRedirectLik={
      <>
      <CardDA>
        <ul>
          <p>TheNoVision</p>
        </ul>

         <button onClick={() => router.push(`/${ROUTENVX.Discovery}?view=${post._id}&post=visionpost`)}>
          <i className='fi fi-rr-share-square'/>
          <h4>Ver mais</h4>
         </button>
      </CardDA>
      </>
   }
   CommentUser={
    <>
    
    </>
   }
  AvatarUser={
   <>
   {user && (
     <>
    <Image src={user.avatar} alt={'avatar usuario'} height={40} width={40} className="logouser"/>
     <h3>{user.name}</h3>  
    </>
   )}
   </>
  }
  ImageC={
   <>
   <img 
   src={post.imageUrl} alt="og:image" height={200} width={338}/>
   </>
  } 
  description={post.description} />
  )}
 
    </>
     )) 
     ) : (
      <>
      <ContentListed>
       
        </ContentListed>
      </>
     )}
 
 {posts.length > 0 ? (
posts.map((post) => (
    <>
   
 {post && post.videourl && post.videourl.length > 0 && (
 <CardVisionPost
   ButtonRedirectLik={
      <>
      <CardDA>
        <ul>
          <p>TheNoVision</p>
        </ul>

         <button onClick={() => router.push(`/${ROUTENVX.Dashboard}?view=${post._id}&video=visionpost`)}>
          <i className='fi fi-rr-share-square'/>
          <h4>Ver mais</h4>
         </button>
      </CardDA>
      </>
   }
   CommentUser={
    <>
    
    </>
   }
  AvatarUser={
   <>
   {user && (
     <>
    <Image src={user.avatar || 'https://i.imgur.com/mXit4fI.jpg'} alt={'avatar usuario'} height={40} width={40} className="logouser"/>
     <h3>{user.name}</h3>  
    </>
   )}
   </>
  }
  ImageC={
   <>
     <img 
   src={post.PasVideo} alt="og:image" height={240} width={338}/>
   </>
  } 
  description={post.description} />
  )}
  
   
    </>
     )) 
     ) : (
      <>
      <ContentListed>
      
        </ContentListed>
      </>
     )}

</Cardmargin>
  );
};


const [userId, setUserId] = useState<string | null>(null);

// Função chamada pelo Myclub para capturar o ID
const handleTakeId = (id: string) => {
  setUserId(id);

};
 

const [followers, setFollowers] = useState<UserInfo []>([]);
const [modal, setmodal] = useState(0)
const [modal2, setmodal2] = useState(1)
  const [following, setFollowing] = useState<UserInfo []>([]);
 
  const [followStatus, setFollowStatus] = useState({ isFollowing: false, isFollowed: false });

  const fetchFollowersAndFollowing = async () => {
    try {
      const response = await axios.post("/api/club/follow/view", { userId, profileId: user.id });
      
      setFollowStatus(response.data);
    } catch (error) {
      console.error("Error fetching followers and following:", error);
    } 
  };
  const fetchData = async () => {
    try {
        const response = await fetch(`/api/club/follow/view?userId=${user.id}`);
        const data = await response.json();
        setFollowers(data.followers);
       setFollowing(data.following);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
};

  useEffect(() => {
    fetchData();
    fetchFollowersAndFollowing();
  }, [userId, user.id]);
  

  if(problem ) {
    return(
      <>
      <ContainerLi>
          <ContentCrad>
 
        <ContentList>

        <li>
           <i className="fi fi-rr-lock" />
         </li>

         <p>
          Ocorreu um problema na solicitação, retorne aonde estava e recomece novamente!
         </p>
        </ContentList>
     
          </ContentCrad>
       </ContainerLi>
      </>
    )
  }
  return (
    <>
    {NotificationK && (
      <NotificationUI message={<>{responseMessage} </>} />
    )}
    
    <Myclub takeId={handleTakeId} 
    clubrx={
      <>
      <ProfileVhash 
      user={{...userInfo, ...user, ...inforemarkable}} 
      badges={
        <>
<CardBadges>
        {userInfo?.verified! && (
         <>
          <AccountBadge
  badge={
    <>
 <svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="21" width="21" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg>
    </>
  }
    content={
      <>
   <ModalWrapper>
   <CardModal>
  
   <ul>
   <h2>Esse perfil é verificado</h2>
   <p>O perfil de {userInfo?.name} conhecido como {user.name} é verificado. <Link href={'/wiki/v/04850483847f8473kif93'}>Saber mais</Link></p>
   </ul>
   </CardModal>
  </ModalWrapper>
      </>
    }
  />
         </>
      )}

    {userInfo?.nvxre! && (
        <>
    <AccountBadge
 
    badge={
      <>
 <Image src={Nvxre} alt="nvxre" height={24}/>
      </>
    }
    content={
      <>
      <ModalWrapper>
   <CardModal>
 
   <ul>
  <h2>Conta afiliada a equipe thenovision.</h2>
   <p>O {userInfo?.name} conhecido como {user.name} e um membro oficial da equipe.</p>
   </ul>
   </CardModal>
  </ModalWrapper>
      </>
    }
  />
        </> 
       )}
      
  {userInfo?.nvrp! && (
        <>
<AccountBadge
  badge={
    <>
 <Image className="logoroda" src={Crown} alt="Moderator" height={24}/>
    </>
  }
    content={
      <>
      <ModalWrapper>
   <CardModal>
   <ul>
   <h2>Staff NoVision'RP </h2>
   <p>O perfil de {userInfo?.name} conhecido como {user.name} se trata de um membro staff do The NoVision.  </p>
   </ul>
 
   </CardModal>
   </ModalWrapper>
      </>
    }
  />
        </> 
       )}
        </CardBadges>
        </>
      }
      links={
        <div className='flex items-center gap-1'>

<ClickMarginSociais>
     
     {userInfo?.Tiktok && (
      <>
     <Link href={`https://tiktok.com/@${userInfo.Tiktok}`}>
     <i className='fi fi-brands-tik-tok' />
      </Link>
       </>
         ) }
         
         <>
           <Link href={`https://discord.com/users/${user.discord_id}`}>
             <i className='fi fi-brands-discord' />
           </Link>
         </>
         
         {userInfo?.Instagram && (
          <>
           <Link href={`https://instagram.com/${userInfo.Instagram}`}>
           <i className='fi fi-brands-instagram' />
           </Link>
          </>
           )}

        {userInfo?.Twitter && (
          <>
           <Link href={`https://x.com/${userInfo.Twitter}`}>
           <i className='fi fi-brands-twitter' />
           </Link>
          </>
        )}

       
        </ClickMarginSociais>

        
        </div>
      }

      follow={
        <MarginV>
 {userId == user.id ? null :(
              <>
              {followStatus.isFollowing ? (
           <button onClick={() => handleFollow(user.id, userId ? userId : '', 'unfollow')}>
             <div className="dcv">
             <h4>Seguindo </h4>
             </div>
             </button>
            ) : userId && (
              <button onClick={() => handleFollow(user.id, userId ? userId : '', 'follow')}>
              <div className="dcv">
              <h4>Seguir </h4>
              </div>
              </button>
            )}
              </>
            )}
        </MarginV>
      }

      follows={
        <>
  
 
<li onClick={() => setmodal(1)}>
  <h3>Seguidores</h3> 
   <h1>{userIn?.followers ? userIn?.followers : 0}</h1></li>

<li>
<h3>Postagens</h3>
 <h1>{posts.length > 0 ? (
    <>
        {formatNumber(posts.length)} 
      </>
) : (
   <>----</>
)}</h1>
</li>
        </>
      }
      visioost={
        <>
      
   
   <VisionPost />
        </>
      }
      inforemarkable={inforemarkable} 
      userInfo={userInfo} />
      </>
    }> 
  
      
   {isloading ? (
    <>
    <LoadingPageView/>
    </>
   ) :  userInfo !== null && (
            <>
        <HeadGlobal Title={`Perfil Clubvision - @${user.name}`} />
        {userInfo.prime ? ( 
          <>
       
          
 
      
      </>
      ) : null}
      </>
       )}
   


      {modal == 1 && (
        <>
        <Modal>
        <Card>
          <ul className='dul'>
            <img src='/nvrp/20240520_081457.png' alt='novision' height={35} width={35} />

            <button onClick={() => setmodal(0)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </ul>
          <Profiles>
           <button onClick={() => setmodal2(1)} className={modal2 == 1 ? 'active' : ''}>
             <li>
              <h3>Seguidores</h3> 
              <p>{inforemarkable.followersPercentage}% do club </p>
             </li>
           </button>

           <button onClick={() => setmodal2(2)} className={modal2 == 2 ? 'active' : ''}>
             Seguindo
           </button>

               
           <button onClick={() => setmodal2(3)} className={modal2 == 3 ? 'active' : ''}>
           Amigos
           </button>
          </Profiles>
        <ContentC>


        {modal2 == 3  && (
          <>
            
            <InvitedUsers userId={user.id} />
    
          
          </>
        )}

        {modal2 == 1 && (
        <>
          
          {Array.isArray(followers) && followers.length > 0 ? (
  followers.slice(0, 30).map((follower) => (
                            <div key={follower.id} >

<UserViewInfo key={user.id} onClick={() => router.push(`/@${follower.name}`)}>
            <li>
            <Image 
            src={follower.avatar} 
            alt={follower.name} 
            className="logoavatar" 
            height={50}
            width={50}
            />
          {follower.reforms ? (
               <>
            <ul>
            <span>
                <h2>{follower.name}</h2>
        {follower.reforms.verified && (
        <>
     <h5> <img src={'/icons/verified1.png'} alt="verified" height={19} width={19}/></h5>  
        </>
     )}
                {follower.reforms.nvxre && (
                <>
                <h5><Image src={Nvxre} alt="nvxre" height={19}/></h5>  
                </>
                )}  

          {follower.reforms.nvrp && (
                <>
                <h5> <Image  className="logoroda" src={Crown} alt="Moderator" height={19}/></h5>  
                </>
                )}  
               </span>
            
                <p>{follower.reforms.BioLi}</p>
            </ul>
            </>
              ) : 
              (
            <ul>
            <h2>---</h2>
            <p>{follower.name}</p>
            </ul>
              )
              }
            </li>

        
        </UserViewInfo>

                            </div>
                   
                ))) : (
                  <Margib>
                  <h1>@{user.name} não é seguido por ninguém</h1> 
                  <p>Depois de obter seguidores, elas serão exibidas aqui.</p>
                 </Margib>
                )}
            </>
            )}

          {modal2 == 2 && (
 <>
{Array.isArray(following) && following.length > 0 ? (
  following.slice(0, 30).map((followed) => (
     <>
    
<UserViewInfo key={user.id} onClick={() => router.push(`/@${followed.name}`)}>
<li>
<Image 
src={followed.avatar} 
alt={followed.name} 
className="logoavatar" 
height={50}
width={50}
/>
{followed.reforms ? (
<>
<ul>
<span>
 <h2>{followed.name}</h2>
{followed.reforms.verified && (
<>
<h5> <img src={'/icons/verified1.png'} alt="verified" height={19} width={19}/></h5>  
</>
)}
 {followed.reforms.nvxre && (
 <>
 <h5><Image src={Nvxre} alt="nvxre" height={19}/></h5>  
 </>
 )}  

{followed.reforms.nvrp && (
 <>
 <h5> <Image  className="logoroda" src={Crown} alt="Moderator" height={19}/></h5>  
 </>
 )}  
</span>

 <p>{followed.reforms.BioLi}</p>
</ul>
</>
) : 
(
<ul>
<h2>---</h2>
<p>{followed.name}</p>
</ul>
)
}
</li>


</UserViewInfo>
         
     </>
 ))) : (
     <Margib>
      <h1>@{user.name} não está seguindo ninguém</h1> 
      <p>Depois de seguir as contas, elas serão exibidas aqui.</p>
     </Margib>
 )}
</>

          )}
            
         
        </ContentC>
        </Card>
        </Modal>
        </>
      )}
    
    </Myclub>

    </>
  );
};

 

export default UserProfile;
UserProfile.getLayout = function getLayout(page: any) {
  return <>{page}</>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.params!; // pode ser string ou array

  if (!username) {
    return { notFound: true };
  }

  // Se for array, junta tudo (ex: ['hKVhr8c', '.clubvision'])
  const usernameStr = Array.isArray(username) ? username.join('') : username;

  // Limpa se tiver @ no começo (depende da url que você usa)
  const cleanedUsername = usernameStr.startsWith('@') ? usernameStr.slice(1) : usernameStr;

  const { db } = await dbConnect();
  const user = await db.collection('users').findOne({ name: cleanedUsername });

  // if (!user) {
  //   return { notFound: true };
  // }

   if (!user) {
    return {
    redirect: {
   destination: ROUTENVX.signin, 
    permanent: false,
      },
    };
  }
    let Permissions: Permission[] = [];
    let logs: ModLog[] = [];
  
    if (user) {
      const userId = user.id;
      const guildId = "1175857498687807560"; 
      
      try {
        logs = await getModLogs(guildId, userId);
        Permissions = await getPermission(guildId, userId);
  
        // Convert Date objects to string representations
        Permissions.forEach((permission) => {
          permission.created_at = permission.created_at.toString();
        });
  
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
};
  

 
const MargibProfile = styled.div`
 
  display: flex;
  flex-direction: column;
  justify-content: center;
 
  position: relative;
 
   
`;


const Margib = styled.div`
  width: 100%;
  height:50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  place-content: center;

  h1{
    font-family: 'Inter', monospace;
    font-size: 19px;

  }

  p{
    font-size: 12px;
    font-family: 'InterSemiBold', monospace;
  }
`;

const UserViewInfo = styled.div`
     display: flex;
     align-items: center;
     flex-direction: row;
     justify-content: space-between;
     cursor: var(--f-cursor-pointer);
     padding: 0px 0.2em 0px;
     border-bottom: 2px solid #1d1f1f14;
 
     .marginright{
      display: flex;
      align-items: center;
      flex-direction: row;
     }
     
    li{
        display: flex;
        align-items: center;
    }

     ul{
        padding: 1em;

        h2{
           font-size: 16px;
           color: #e7f1fc;
        }

        p{
          font-size: 12px;
          text-align: justify;
          color: rgb(130, 134, 138);

          max-width: 100%;
     
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
        }
     }
    
     span{
        display: flex;
        align-items: center;


        h5{
           padding-left: 0.4em;
           padding-top: 0.4em;
        }
     }
   .logoavatar{
     border-radius: 100%;
     border: 2px solid rgba(78, 73, 100, 0.315);
   }

   &:hover{
    border-bottom: 2px solid #1d1f1f;
   }
`;

  
const Modal = styled.div`
 position: fixed;
 width: 100%;
 height: 100%;
 z-index: 1290;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 flex-direction: column;
 place-items: center;
 justify-content: center;
`;

const Card = styled.div` 
   background-color: #0B0C0A;
   width: 430px;
   border-radius: 12px;
   padding: 0.8em;
   height: 90%;
   margin: 0.9em;
   border: 2px solid #212221;
   border-radius: 12px;
   overflow: hidden;
   
   .dul{
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 0.5em;
    border-bottom: 2px solid #151616;
    margin-bottom: 0.7em;
   }

   @media screen and (max-width: 530px) {
       width: 100vw;
    }
`;

const ContentC = styled.div`
background-color: #121311;
padding: 0.9em;
border-radius: 14px;
height: 85%;
width: 100%;
overflow-y: auto;


`;

const Profiles = styled.div`
  width: 100%;
  display: inline-flex;
  align-items: center;
  padding: 0 0 0.5em;
  gap: 12px;
  justify-content: center;

  button{
    font-size: 15px;
    font-family: 'InterSemiBold', monospace;
    padding: 0.5em 1em 0.5em;

   

     h3{
      font-size: 15px;
      font-family: 'InterSemiBold', monospace;
     }


     p{
      font-size: 11px;
      display: none;
      color: #5d6063;
     }
  }

  .dhsdf{
    max-width: 230px;
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
  }

  button:hover{
    border-bottom: 2px solid #4b4d50;
  }
  
  .active{
    border-bottom: 2px solid #28dd6d;

    p{
      display: block;
    }
  }
`;

const TextFieldComment = styled.textarea`
 background-color: transparent;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  min-height: 50vh;
  border: none;
  color: #acacb4;
  font-size: 16px;
  font-family: 'Poppins', Courier, monospace;
 resize: none;
  &:focus{
    outline: none;
  }

  &::placeholder {
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #bbbbc4;
  }
`;

 
/// styled 
const ContainerLi = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
         
`;


const MarginV = styled.div`
  
  button{
    background-color: white;
    padding: 0.5em 1em;
    font-family: 'Inter', monospace;
    font-size: 13px;
    color: black;
    border-radius: 22px;
  }
`;
const ContentCrad = styled.div`
  text-align: center;
  position: relative;
  overflow: auto;
  height: 98vh;
  width: 90vw;
    
  h1{
    color: #86a0b8;
  }
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
    position: absolute; 
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
    color: rgb(92, 105, 99);
  }
`;

 



const CardDA = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   margin: 1em;
   margin-top: 0em;
   padding: 0.2em 1em 0.2em;
   background-color: rgba(46, 46, 49, 0.089);
   border-radius: 12px;
 

   ul{
     p{
      font-family: 'Europa Grotesk';
      font-size: 13px;
      color: #474849;
     }
   }

   button{
      background-color: rgba(225, 223, 233, 0.041);
      padding: 0.5em 1em 0.5em;
      border-radius: 34px;
      display: inline-flex;
      align-items: center;
      
      i{
        color: #6e6f70;
        padding-right: 0.3em;
      }
      h4{
        font-family: 'Poppins', sans-serif;
        font-size: 12px;
        color: #6e6f70;
      }
    }

`;

const DividerMargin = styled.section`
  padding: 0.3em 1em 0.3em;
  width: 100%;
  
  flex-direction: column;
  height: 30em;
  border-radius: 12px;
  overflow-y: auto;
 
`;

const ContainerRight = styled.div`
  display: inline-flex;
  flex-direction: column;
  width:80%;

  @media screen and (max-width: 530px) {
    justify-content: center;
    align-items: center;
    width: 100vw;
  }
  
`;
const Button = styled.a`
  margin: 2em;
 background-color: rgba(209, 188, 189, 0.363);
 padding: 0.8em 4em 0.8em;
 border-radius: 52px;
 color: black;
 transform: rotate(-5deg);
 border: 2px solid transparent;
 transition: 0.9s all;

 &:hover{
   position: relative;
   top: -1px;
   border: 2px solid rgba(91, 86, 105, 0.329);
   background: transparent;
   color: rgba(129, 128, 138, 0.459);
 }
`;

const ContainerTR = styled.div`

    display: flex;
    flex-direction: column;
    place-items: center;
    justify-content: center;
    align-items: center;
    place-items: center;
    height: 100%;
    position: fixed;
    width: 100%;
`;


 


const Cardmargin = styled.div`
  
  
  display: flex;
  flex-wrap: wrap;
   
  align-items: center;
 
  ul{
    margin: 1em;
    text-align: center;
    h2{
      font-family: 'Graffiti';
      color: rgba(136, 32, 32, 0.274);
      font-size: 29px;
    }
  }

  .borderradiusimageN{
   filter: saturate(0);
 
   opacity: 0.1;
   }

   @media screen and (min-width: 200px) and (max-width: 324px) {
     max-width: 297px;
     padding: 0;
     border-left: none;
     margin: none;

     .borderradiusimageN{
      width: 240px;
      height: 130px;
     }

     .borderradius{
      width: 240px;
      height: 130px;
     }
    }

    @media screen and (min-width: 324px) and (max-width: 370px) {
     max-width: 370px;
     padding: 0;
     border-left: none;
     margin: none;

     .borderradiusimageN{
      width: 260px;
      height: 130px;
     }

     .borderradius{
      width: 260px;
      height: 130px;
     }
    }

    @media screen and (min-width: 370px) and (max-width: 430px) {
     max-width: 400px;

     padding: 0;
     border-left: none;
     margin: none;

     .borderradiusimageN{
      width: 340px;
      height: 160px;
     }

     .borderradius{
      width: 340px;
      height: 160px;
     }
    }
`;

const ContentListed = styled.ul`
   
   text-align: center;
   display: flex;
   flex-direction: row;
   flex-wrap: wrap;
  
   i{
    color: #36373a9e;
    font-size: 34px;
   }

   h2{ 
    margin: 0.6em;
   }

   p{
    font-size: 12px;
    margin-top: 0.8em;
    color: #5c5555;
   }

`;

 
const ContentMember = styled.ul`
display: flex;
align-items: center;

.logoprofile{
 border-radius: 50%;
}

 
h2{
 font-size: 15px;
 color: #d5d6da;

}

span{
 display: flex;
 align-items: center;
 justify-content: center;
 h5{
     margin-left: 0.4em;
     color: rgb(255, 0, 43);
 }
}

p{
font-size: 12px;
color: #8c919b;
}

  
`;
 

 
  

const ClickMarginSociais = styled.div`
   display: flex;
   align-items: center;
   gap: 2px;
   width: 100%;
   
 

   a{
    color: #c1c2cc;
    padding: 0px 9px 0px;
 
    height: 24px;
    border-radius: 50%;
    width: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    i{
      font-size: 17px;
    }
   }

   .sssa{
    color: #848591;
    padding: 16px 16px 13px;
    background-color: rgba(5, 5, 8, 0.959);
    border-radius: 42px;
    cursor:  var(--f-cursor-pointer);
    i{
      font-size: 17px;
    }
   }

   a:hover{
    color: #292525;
   }
`;

interface ViewHeaderProps {
  bannerUrl: string;
}
const Header = styled.header<ViewHeaderProps>`
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  background-color: rgb(10, 11, 17);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 19px;
  height: 12em;
  margin: 1em;
  padding: 1em 1em 2em;
  width: 60vw;
  background-repeat: no-repeat;
  background-size: 100%;

   
  @media screen and (max-width: 430px) {
      width: 350px;
      margin: 0.2em;
      height: 11em;
    
   }

   @media screen and (max-width: 530px) {
  margin: 0;
  border-radius: 29px;
  height: 6em;
}     
`;


const ProfileView = styled.div` 
    padding: 0em 4% 0em;
    display: flex;
    align-items: center;
   
  .AvatarLogo{
    border-radius: 50%;
  }

  @media screen and (min-width: 200px) and (max-width: 300px) {
    padding: 4em 1em 0em;

    .AvatarLogo{
      height: 110px;
      width: 110px; 
    }
  }

  @media screen and (min-width: 300px) and (max-width: 430px) {
    padding: 4em 1em 0em;

    .AvatarLogo{
      height: 120px;
      width: 120px; 
    }
  }

 
  @media screen and (max-width: 530px) {
  padding: 0;
} 
`;
const CenterMheader = styled.div`
 display:flex;
  justify-content: center;
  align-items: center;
`;
const Container = styled.div` 

  margin: 0.6em;

 `;


const AboutUserInfo = styled.div`
 width: 100%;
 padding: 0.9em 1em 0.9em;

     .logoroda{
  border-radius: 12px;
   
 }
    h2{
      font-size: 29px;
      color: #eef2f5;
    }


    li{
      display: flex;
      align-items: center;
      flex-direction: row;
    }
 
    @media screen and (min-width: 200px) and (max-width: 300px){
      margin: 0.2em;
      max-width: 18em;
      margin-left: -2.8em;
    }

    @media screen and (min-width: 300px ) and (max-width: 431px){
      margin: 0.4em;
      max-width: 44em;
    
    }

  
`; 

const BioInfoUser = styled.div`
  
   max-width: 880px;
  
   .dhsdf{
    max-width: 130px;
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
  }
  
   p{
    font-family: 'ProximaNova-Italic', sans-serif;
      font-size: 14px;
      color: #969b9e;
     max-width: 290px;
     
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
   }

   h6{
    color: #49484d;
   }

    
   
   ul{
    display: flex;
    align-items: center;

     i{
      color: #7b7f83;
      margin: 0.2em;
      font-size: 11px;
     }
    h5{
    
      font-family: 'ProximaNova-Italic', sans-serif;
      font-size: 14px;
      color: #969b9e;
    }

   
   }


   .gasd3d{
    display: none;
   }

   @media screen and (max-width: 530px) {
    width: 50vw;
     .mobile{
      display: none;
     }

     .gasd3d{
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 9px;
  

      i{
        color: #b1bdc0;
      }
      h5{
        font-size: 11px;
        color: #b1bdc0;
      }
     }
} 
`;


const HovercardContainer = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   width: 100%;

   .kdul{
    display: flex;
   flex-direction: row;
   align-items: center;


   
   }

   button{
    border-radius: 45px;
    color: rgb(31, 226, 96);
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    margin: 0.5em;
    line-height: 100%;
    background: linear-gradient(130deg, #e4ebe6 0%, #bbc0bd 100%);

    padding: 0.6em 1em 0.6em;
    display: flex;
    align-items: center;
  

    h4 {
        font-size: 15px;
        font-family: 'Inter', monospace;
        color: #050404;
        font-weight: 900;
        transition: transform 0.3s ease, opacity 0.1s ease;
    }

    &:hover {

        .i {
            background-color: #151615;
        }
    }
   }
 
`;
export const ModalWrapper = styled.div`
position: absolute;
 z-index: 9999;
 
 transform: translateX(2vh);
 background-color: rgba(0, 0, 0, 0.973);
 box-shadow: 0 2px 4px rgba(148, 149, 158, 0.055);
 padding: 10px;
 border: 1px solid rgb(46, 48, 47);
 border-radius:  7px;
 
 transition: visibility 0s, opacity 0.2s ease-in-out;
 

 @media screen and (max-width: 300px){
  width: 12em;
  transform: translateX(-70%);
    }
`;

export const CardModal = styled.div`
     display: flex;
     flex-direction: column;
 
     font-family: 'InterSemiBold', sans-serif;
 

     ul{
        gap: 4px;
        display: flex;
        flex-direction: column;
       h2{
      color: #ffffff75;
  
      font-size: 12px;
     }
  
     p{
      color: #87868d81;
      max-width: 290px;
      font-size: 10px;
     }
  
     a{
      color: #11ff7c;
     }
     }
  
     i{
      text-align: center;
      font-size: 59px;
     }
  
     li{
      display: flex;
      align-items: center;
 
     }

     svg{
       height: 45px;
       width: 45px;
     }
  
    @media screen and (max-width: 300px){
      display: flex;
      flex-direction: column;      
    }
  `;

  
const CardBadges = styled.div`
display: flex;
 
align-items: center;
gap: 4px;
 
`;


//// scroll 



const CardViewList = styled.div`
    
background-color: rgba(209, 209, 214, 0.021);
border-radius: 32px;
overflow-x: auto;
display: inline-flex;
cursor:  var(--f-cursor-grab);

&:active {
cursor:  var(--f-cursor-grabbed);
}

@media screen and (max-width: 300px){
     max-width: 280px;
     margin: 0em;
     margin-left: -0.2em;
     background-color: transparent;
  }


  @media screen and (min-width: 300px) and (max-width: 324px) {
    max-width: 380px;
    margin: 0em;
     margin-left: -0.2em;
     background-color: transparent;
    }

    @media screen and (min-width: 324px) and (max-width: 370px) {
      max-width: 480px;
      margin: 0em;
     margin-left: -0.2em;
     background-color: transparent;
    }

    @media screen and (min-width: 370px) and (max-width: 430px) {
      max-width: 490px;
      margin: 0em;
     margin-left: -0.2em;
     background-color: transparent;
    }
`;



const ModalO = styled.div`
  position: fixed;
  z-index: 1999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.692);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContainerModal = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 1em;
  border-radius: 22px;
  background-color: rgba(9, 9, 10, 0.021);
  color: #68686b24;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  text-align: center;
  overflow-y: auto;
  height: 100%;
`;

const ButtonClose = styled.button`

  background-color: rgba(255, 255, 255, 0.041);
 padding: 0.8em 0.6em 0.8em;
  height: 40px;
  width: 40px;
  border-radius: 22px;
  cursor:  var(--f-cursor-pointer);
  transition: 0.3s all;
  
  i{
    font-size: 20px;
    color: #c6c9cc;
  }
  &:hover{
    background-color: rgba(255, 255, 255, 0.141);
  }
`;

const ContainerButtonsOpen = styled.div`
 position: absolute;
  top: 0.5em;
  right: 0.5em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 1em;
  padding: 1em;
  border-radius: 5px;
  background-color: rgba(9, 9, 10, 0.021);
  color: #68686b24;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  text-align: center;


   .navbar-active{
   background-color: rgba(125, 125, 128, 0.171);

    i{
      color: rgb(78, 82, 79);
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
const Bloy = styled.form`
  
 max-height: 80%;
 width: 100%;
 display: flex;
 justify-content: center;
 align-items: center;
`;

const Bloy2 = styled.div`
 overflow-y: auto;
 display: flex;
 justify-content: space-between;
 align-items: center;
 flex-direction: column;
 max-height: 38em;
 background-color: rgba(6, 7, 6, 0.445);
 padding: 0.3em;
 border-radius: 19px;
 margin-bottom: 1em;
 width: 100%;
 animation: rigOpacity 1s;

 @keyframes rigOpacity {

  0%{ opacity: 0;};
  100%{ opacity: 1;};
 }
`;


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

const OPSC = styled.div`
height: 100%;
width: 100%;
display: flex;
justify-content: center;
align-items: center;
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: black;
`;






// SELECT CHARACTER
 
const typingAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;
