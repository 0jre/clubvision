import { DashboardStyle} from "@/styles/Globalstyleview";
import styled, { keyframes } from "styled-components";
import { User } from "@/types/user/types";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect,useState } from "react";
import axios from "axios";
import HeadGlobal from "@/club/head/glob.n";

import CardVisionPost from "@/club/.vision/dashboard/foryou/card.post";
import router from 'next/router';
import ROUTENVX from "@/routes/routes";
import NotOPS from "@/components/ui/not-sx";
import LoadingPageView from "@/resources/loading/market.loading";

interface Props {
  user?: User;
}


interface Post {
  _id: string;
  description: string;
  imageUrl: string;
  likes: number;
  userId: string;

  videourl: string;
  PasVideo: string;
  title: string;
  AvatarUser: string;
  nvuser: string;

}


interface Comment {
  _id: string;
  text: string;
  user: {
    name: string;
    avatar: string;
  };
}

interface PropsuseLike {
  avatar: string;
  id: string;
  name: string;
}


export default function ContentStudio({ user}: Props){
  
 
    const [isloading, setloading] = useState(true)
   
   
const [posts, setPosts] = useState<Post[]>([]);
const [postinfo, setpostinfo] = useState<string>('')
  

const handleinfopost = async (_id: string) => {
  setpostinfo(_id)
};


    useEffect(() => {
      const userId = `${user?.id}`; 
      const fetchUserPosts = async () => {
    try {
          const response = await axios.get(`/api/nvxre/postvision/${userId}/post`);
          const postsData: Post[] = response.data;
          setPosts(postsData);
           
        } catch (error) {
          console.error('Error fetching user posts:', error);
          // Lidar com o erro conforme necessário
        } finally{
          setloading(false)
        }
      };
     
      
  
      fetchUserPosts();
   
    }, [ user?.id]);



    
const LikesViewUsers = () => {
 
  const [likedUsers, setLikedUsers] = useState<PropsuseLike | []>([]);

useEffect(() => {
  const fetchLikedUsers = async () => {
    try {
      const response = await fetch(`/api/nvxre/postvision/posts/likes/visualization/${postinfo}`);
      const data = await response.json();

      if (response.status === 200) {
        setLikedUsers(data);
      } else {
        console.error('Error fetching liked users. Server returned:', response.status);
      }
    } catch (error) {
      console.error('Error fetching liked users:', error);
    }
  };

  fetchLikedUsers();

}, []);


const formatNumber = (num: number): string => {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(num % 1e6 !== 0 ? 1 : 0) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(num % 1e3 !== 0 ? 1 : 0) + 'K';
  } else {
    return num.toString();
  }
};  

 const likeCount: number = Array.isArray(likedUsers) ? likedUsers.length : 0;
 return (
  <>
    <CardVComment>
      <section>
        <button onClick={() => router.push(`/${ROUTENVX.Discovery}?_id=${postinfo}&post=visionpost`)}>
          <h4>Visualizar postagem</h4>
          <i className="fi fi-bs-arrow-up-right" />
        </button>
      </section>
      <ViewCountLike>
        <span className="jds">
          <h5>Quem curtiu?</h5>
          <li className="lis">
            <i className="fi fi-br-circle-heart" />
            <h5>{formatNumber(likeCount)} {likeCount === 1 ? '' : ''}</h5>
          </li>
        </span>
        <hr />
        {Array.isArray(likedUsers) && likedUsers.length > 0 ? (
          <ul>
            {likedUsers.slice(0, 30).map((user: {
              id: React.Key | null | undefined;
              avatar: string | undefined;
              name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.PromiseLikeOfReactNode | null | undefined;
            }) => (
              <li key={user.id}>
                <div>
                  {user.avatar && <img src={user.avatar} alt="novision" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />}
                </div>
                <div>
                  {user.name && <p>{user.name}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>0 Pessoas achou Irado</p>
        )}
      </ViewCountLike>
    </CardVComment>
  </>
);
}


const [loadingdelete, setloadingdelete] = useState(false);
const [idpost, setidpost] = useState<string>('')
  

    const handleDeletePost = async (_id: string) => {
      setloadingdelete(true);
      setidpost(_id);
      try {
      await axios.delete(`/api/nvxre/postvision/posts/delete?videoId=${_id}`);
        setloadingdelete(false)
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== _id));
      } catch (error) {
        console.error('Error deleting video:', error);
        setloadingdelete(false)
      } finally {
        setloadingdelete(false)
        setidpost('')
      }
    };

    return(
        <>
  
       
      <HeadGlobal Title={'NoVision Studio'}/>
       
        {user && (
          <>
  
       <MainDashboardN>
       
          {postinfo && (
            <ContentCard2>
              <div className="w-[430px]">
                <LikesViewUsers/>
              </div>
            </ContentCard2>
      
          )}
         
        
 

   <Display>


        {isloading ? <LoadingPageView /> :  posts.length > 0 ? (
 posts.map((post) => (
      <>
   <div key={post._id}>
         
   {post.videourl && (
         <>
 <CardVisionPost
     RightO={
       <>
  {postinfo === post._id ? (
    <>
    <button onClick={() => setpostinfo('')} className={(postinfo === post._id ? 'colorred' : '')}>
        {postinfo === post._id ? <i className="fi fi-sc-cross" /> : <i className="fi fi-br-plus" /> }
      </button>
 
    </>
  ) : (
    <>
   
  <button onClick={() => handleinfopost(post._id)} className={(postinfo === post._id ? 'colorred' : '')}>
        {postinfo === post._id ? <i className="fi fi-br-menu-dots" /> : <i className="fi fi-br-plus" /> }
      </button>

    </>
  )}
       
       <button onClick={() => handleDeletePost(post._id)}>
       {idpost === post._id && loadingdelete ? <i className="fi fi-br-loading " /> : <i className="fi fi-rr-trash" /> }
      </button>

 
       </>
     }
     ButtonComment={
      <>
       
      </>
     }
     ButtonClickLike
     CommentUser={
      <>
     
      </>
     }
    AvatarUser={
     <>
     {user && (
       <>
      <Image src={user.avatar} alt={user.username} height={40} width={40} className="logouser"/>
       <h3>{user.username}</h3>  
      </>
     )}
     </> 
    }
    ImageC={
     <>
       <img
          src={post.PasVideo}
          alt="video the novision"
          className='videoinf'
          height={200} width={370} 
        /> 
     </>
    } 
    description={post.description} />
       </>
      )}

    </div>
    </>
    ))) : null}
   
 

        {posts.length > 0 ? (
 posts.map((post) => (
      <>
   <div key={post._id}>
   {post.imageUrl && (
   <CardVisionPost
     RightO={
       <>
    {postinfo === post._id ? (
    <>
    <button onClick={() => setpostinfo('')} className={(postinfo === post._id ? 'colorred' : '')}>
        {postinfo === post._id ? <i className="fi fi-sc-cross" /> : <i className="fi fi-br-plus" /> }
      </button>
 
    </>
  ) : (
    <>
   
  <button onClick={() => handleinfopost(post._id)} className={(postinfo === post._id ? 'colorred' : '')}>
        {postinfo === post._id ? <i className="fi fi-br-menu-dots" /> : <i className="fi fi-br-plus" /> }
      </button>

    </>
  )}

       <button onClick={() => handleDeletePost(post._id)}>
       {idpost === post._id && loadingdelete ? <i className="fi fi-br-loading " /> : <i className="fi fi-rr-trash" /> }
      </button>
       </>
     }
     ButtonComment={
      <>
        
      </>
     }
     ButtonClickLike
     CommentUser={
      <>
      
      </>
     }
    AvatarUser={
     <>
     {user && (
       <>
      <Image src={user.avatar} alt={user.username} height={40} width={40} className="logouser"/>
       <h3>{user.username}</h3>  
      </>
     )}
     </>
    }
    ImageC={
     <>
     <img 
     
     src={post.imageUrl} alt="og:image" height={200} width={370} />

 
     </>
    } 
    description={post.description} />
    )}
    
    
    </div>
    </>
    ))) : !isloading && (
    <ContentListed>  
   <NotOPS
title="Nada foi encontrado"
  description="O Usuario não tem postagens."
/>
    </ContentListed>
    )}


   
       </Display>
     
        </MainDashboardN>
        </>
         )}  
        </>
    )
}

 

const ContentListed = styled.div`

   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   min-width: 85vw;
   max-width: 1250px;
   height: 55vh;
   

`;
const Display = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: center;
align-items: top;

.logocard{
  border-radius: 100%;
  border: 3px solid rgba(69, 73, 70, 0.37);
}
  
.colorred{
  background-color: #5c1f29;
  color: black;
}
 
`;
 
 
const ClickMarginVideo = styled.div`
margin: 0.8em;
display: flex;
justify-content: start;
align-items: center; 
flex-direction: row;

 .active{
  border: 2px solid #5bf55b;
}
`;



const ButtonclickS3 = styled.div`
 cursor: pointer;
 border-radius: 25px;
padding: 0.4em 2em 0.5em;
margin: 0.1em;
display: flex;
align-items: center;
background-color: #1e1e1f2b;

h4{
 
  color: #d9d9df;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
 
 }

i{
  color: #959ca3;
}

.check{
  color: #5bf55b;
}

&:hover{
  background-color: #1e1e1f8d;
  
}


`;

 
const ViewCountLike = styled.div`
    
   ul{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.6em;
    text-align: center;

    p{
      font-size: 10px;
      font-family: 'Inter', sans-serif;
      color: rgba(182, 186, 189, 0.637);
      margin-left: 0.8em;
      max-width: 30px;
     
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
    }

    span{
      font-size: 10px;
      margin: 0.3em;
      color: #504ea7;
    }
   }
  
  li{
    text-align: left;
  }
   
  .jds{
    align-items: center;
    justify-content: space-between;
    display: flex;
  }
   h5{
    font-family: 'Inter', monospace;
    font-weight: 400;
     
    color: rgba(173, 173, 180, 0.507);
   }


   .lis{
      padding: 0.3em 0.8em 0.3em;
      border-radius: 49px;
      margin: 0.3em;
      background-color: rgba(50, 51, 54, 0.082);
      display: flex;
      align-items: center;

      i{
        color: rgb(252, 37, 55);
      }

      h5{
        margin-left: 0.5em;
      }
    }
  .borderradius1{
    border-radius: 22px;
 
  }
`;


const CardVComment = styled.div`
 
 background-color: rgb(31, 32, 31);
  padding: 1em;
  margin-right: 2em;
  margin: 1em;
  width: 430px; 
  border-radius: 12px;
  animation: OneS 0.1s linear ;
 
  hr{
    width: 100%;
    margin-top: 0.7em;
    margin-bottom: 1em;
    border-color: rgba(120, 120, 126, 0.103);
  }

  @keyframes OneS {
    0%{opacity: 0; transform: translateY( 100%)}
    100%{opacity: 1; transform: translateY( 0%)}
  }

  section{
    display: flex;
    justify-content: center;
    width: 100%;

    button{
      display: flex;
      align-items: center;
      background-color: rgb(229, 232, 235);
      color: black;
      font-family: 'InterSemiBold', monospace;
      padding: 0.4em 1em 0.4em;
      border-radius: 24px;

      i{
        font-size: 14px;
        margin: 0.4em;
      }
    }
  }
`;
 



// STYLED 
 
const MainDashboardN = styled.div`
  justify-content: left;
  display: flex; 
  flex-wrap: wrap;
  width: 100%;
 
`;

const ContentCard2 = styled.div`
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 8px;
  right: 0;
  left: 0;
  z-index: 546;
 
`;
 

 