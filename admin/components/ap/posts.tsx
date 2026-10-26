import styled from "styled-components"; 
import {  useEffect, useState } from "react";
import Image from "next/image"; 
import React from "react"; 
import axios from 'axios'; 
import Link from "next/link"; 
import CardVisionPost from "@/club/.vision/dashboard/foryou/card.post"; 
import StudioPlayer from "@/club/.vision/studio/container/player/studio.player";
import CardVisionPostVideo from '@/club/.vision/dashboard/foryou/card.videpost';

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

export default function Postsmanager ({ userId } : { userId: string }) {
  const [isopenusermodal, setopenusermodal] = useState(false);
  const Handleopenmodal = () => setopenusermodal(true);
  const Handleclosemodal = () => setopenusermodal(false);

  const ViewInd = ({ postId , ImageViewPost , Likeb, descriptionImage}: { Likeb: number, ImageViewPost: React.ReactNode, postId: string , descriptionImage: React.ReactNode}) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [showAllComments, setShowAllComments] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchComments = async () => {
        try {
          const response = await axios.get(`/api/nvxre/postvision/posts/listcomm/${postId}`);
          setComments(response.data.comments);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching comments:', error);
          setLoading(false);
        }
      };
  
      if (postId) {
        fetchComments();
      }
    }, [ postId]);
  
    const displayedComments = showAllComments ? comments.slice().reverse() : comments.slice().reverse().slice(0, 1);
    const [isOpenComments, setOpenComments] = useState(false);
  
    const HandleComments = () => {
      setOpenComments(true)
      setShowAllComments(true)
    }
  
    const CloseComments = () => {
      setOpenComments(false)
      setShowAllComments(false)
    }

    const LikesViewUsers : React.FC = () => {
      const [isOpenInfolikesUsers, setOpenInfoUsersLikes ] = useState(false);
      const OpenModalInfoLikes = () => setOpenInfoUsersLikes(true);
      const CloseInfoModal = () => setOpenInfoUsersLikes(false);
      
      const [likedUsers, setLikedUsers] = useState<PropsuseLike | []>([]);
    
      useEffect(() => {
        const fetchLikedUsers = async () => {
          try {
            const response = await fetch(`/api/nvxre/postvision/posts/likes/visualization/${postId}`);
            const data = await response.json() as any;
    
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
      }, [ postId]);
    
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
      
      return(
        <>
          <LikeButton onClick={OpenModalInfoLikes}>
            <HeartIcon className="fi fi-br-circle-heart" />
            <LikeCount>{formatNumber(likeCount)}</LikeCount>
          </LikeButton>
    
          {isOpenInfolikesUsers && (
            <LikesModal onClick={CloseInfoModal}>
              <LikesModalContent> 
                <ModalTitle>Quem curtiu a foto?</ModalTitle>
                <Divider />
                {Array.isArray(likedUsers) && likedUsers.length > 0 ? (
                  <UsersList>
                    {likedUsers.map((user: any) => (
                      <UserItem key={user.id}>
                        <UserAvatar>
                          {user.avatar && <img src={user.avatar || "/placeholder.svg"} alt={'user'} />}
                        </UserAvatar>
                        <UserName>{user.name}</UserName>
                      </UserItem>
                    ))}
                  </UsersList>
                ) : (
                  <EmptyState>0 Pessoas curtiram</EmptyState>
                )}
              </LikesModalContent>
            </LikesModal>
          )}
        </>
      )
    }
  
    return (
      <>
        {isOpenComments && (
          <CommentsModalOverlay>
            <CommentsModalHeader>
              <CloseButton onClick={CloseComments}>
                ✕
              </CloseButton>
            </CommentsModalHeader>
            
            <CommentsModalContainer>
              <ImageSection>
                {ImageViewPost}
                <ImageInfo>
                  <LikesViewUsers/>
                  <ImageDescription>{descriptionImage}</ImageDescription>
                </ImageInfo>
              </ImageSection>
              
              <CommentsSection>
                {displayedComments.map((comment, index) => (
                  <CommentCard key={index}>
                    <CommentAvatar>
                      {comment.user.avatar ? (
                        <Image src={comment.user.avatar || "/placeholder.svg"} alt='user' height={40} width={40} className='avatar' />
                      ) : (
                        <DefaultAvatar>?</DefaultAvatar>
                      )}
                    </CommentAvatar>
                    <CommentContent>
                      <Link href={`/club/@${comment.user.name}`}>
                        <CommentAuthor>{comment.user.name}</CommentAuthor>
                      </Link>
                      <CommentText>{comment.text}</CommentText>
                    </CommentContent>
                  </CommentCard>
                ))}
              </CommentsSection>
            </CommentsModalContainer>
          </CommentsModalOverlay>
        )}
       
        {comments.length > 0 && (
          <CommentPreview onClick={HandleComments}>
            <CommentAvatar>
              {comments[comments.length - 1].user.avatar ? (
                <Image src={comments[comments.length - 1].user.avatar || "/placeholder.svg"} alt='user' height={40} width={40} className='avatar' />
              ) : (
                <DefaultAvatar>?</DefaultAvatar>
              )}
            </CommentAvatar>
            <CommentContent>
              <CommentAuthor>{comments[comments.length - 1].user.name}</CommentAuthor>
              <CommentText>{comments[comments.length - 1].text}</CommentText>
            </CommentContent>
          </CommentPreview>
        )}
      </>
    );
  };

  const VisionPost = () => {
    const [posts, setPosts] = useState<Post[]>([]);
  
    useEffect(() => {
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
    }, [ userId]);

    const handleDeletePost = async (_id: string) => {
      try {
        const deleteResponse = await axios.delete(`/api/nvxre/postvision/posts/delete?videoId=${_id}`);
        console.log(deleteResponse.data.message);
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== _id));
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    };

    const [isOpenVideoX, setOpenVideoX] = useState(false);
    const [isOpenImageX, setOpenImageX] = useState(false);

    const OpenModalVideo = () => { setOpenVideoX(true); setOpenImageX(false); }
    const OpenModalImage = () => { setOpenImageX(true); setOpenVideoX(false); }

    return (
      <>
        <FilterTabs>
          <FilterTab 
            onClick={OpenModalVideo} 
            className={isOpenVideoX ? "active" : ""}
          >
            <TabIcon className="fi fi-rr-video-camera" />
            <TabLabel>Vídeos</TabLabel>
          </FilterTab>

          <FilterTab 
            onClick={OpenModalImage} 
            className={isOpenImageX ? "active" : ""}
          >
            <TabIcon className="fi fi-rr-images" />
            <TabLabel>Imagens</TabLabel>
          </FilterTab>
        </FilterTabs>

        <PostsGrid>
          {isOpenVideoX && (
            <>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id}>
                    {post.videourl && (
                      <CardVisionPostVideo
                        RightO={
                          <DeleteButton onClick={() => handleDeletePost(post._id)}>
                            <i className="fi fi-rr-trash" />
                          </DeleteButton>
                        }
                        ButtonComment={<></>}
                        ButtonClickLike
                        CommentUser={
                          <ViewInd 
                            Likeb={post.likes}
                            postId={post._id} 
                            ImageViewPost={
                              <StudioPlayer 
                                videoPath={post.videourl} 
                                videotitle={post.title} 
                                onClose={() => {}}
                              />
                            } 
                            descriptionImage={post.description} 
                          />
                        }
                        AvatarUser={<></>}
                        ImageC={
                          <StudioPlayer 
                            videoPath={post.videourl} 
                            videotitle={post.title} 
                            onClose={() => {}}
                          />
                        } 
                        description={post.description} 
                      />
                    )}
                  </div>
                ))
              ) : (
                <EmptyContent>
                  <EmptyIcon className="fi fi-ss-image-slash"/>
                  <EmptyText>Nenhum vídeo encontrado</EmptyText>
                </EmptyContent>
              )}
            </>
          )}

          {isOpenImageX && (
            <>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id}>
                    {post.imageUrl && (
                      <CardVisionPost
                        RightO={
                          <DeleteButton onClick={() => handleDeletePost(post._id)}>
                            <i className="fi fi-rr-trash" />
                          </DeleteButton>
                        }
                        ButtonComment={<></>}
                        ButtonClickLike
                        CommentUser={
                          <ViewInd 
                            Likeb={post.likes}
                            postId={post._id} 
                            ImageViewPost={
                              <img 
                                className="post-image"
                                src={`data:image/png;base64,${post.imageUrl}`} 
                                alt="post" 
                                height={240} 
                                width={490} 
                              />
                            } 
                            descriptionImage={post.description} 
                          />
                        }
                        AvatarUser={<></>}
                        ImageC={
                          <img 
                            src={`data:image/png;base64,${post.imageUrl}`} 
                            alt="post" 
                            height={200} 
                            width={370} 
                          />
                        } 
                        description={post.description} 
                      />
                    )}
                  </div>
                ))
              ) : (
                <EmptyContent>
                  <EmptyIcon className="fi fi-ss-image-slash"/>
                  <EmptyText>Nenhuma imagem encontrada</EmptyText>
                </EmptyContent>
              )}
            </>
          )}
        </PostsGrid>
      </>
    );
  };

  return(
    <>
      <ActionButton onClick={Handleopenmodal} className={isopenusermodal ? "active" : ""}>
        <ButtonIcon className="fi fi-sr-gallery-thumbnails" />
        <ButtonLabel>Galeria</ButtonLabel>
      </ActionButton>

      {isopenusermodal && (
        <ModalOverlay>
          <ModalCloseButton onClick={Handleclosemodal}>
            ✕
          </ModalCloseButton>
          <VisionPost />
        </ModalOverlay>
      )}
    </>
  )
}

// Styled Components
const ActionButton = styled.button`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid #333;
  border-radius: 16px;
  margin: 8px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  color: #e0e0e0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:hover {
    background: linear-gradient(135deg, #2d2d2d 0%, #404040 100%);
    border-color: #22c55e;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.2);
  }

  &.active {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    border-color: #22c55e;
    color: #000;
  }
`;

const ButtonIcon = styled.i`
  font-size: 20px;
  margin-right: 12px;
  color: inherit;
`;

const ButtonLabel = styled.h1`
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  margin: 0;
  color: inherit;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  z-index: 1000;
  overflow-y: auto;
`;

const ModalCloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1001;

  &:hover {
    background: #ef4444;
    transform: scale(1.1);
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 16px;
  margin: 20px 0;
  padding: 8px;
  background: rgba(26, 26, 26, 0.8);
  border-radius: 16px;
  border: 1px solid #333;
`;

const FilterTab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 12px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #e5e7eb;
    background: rgba(55, 65, 81, 0.5);
  }

  &.active {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    border-color: #22c55e;
    color: #000;
  }
`;

const TabIcon = styled.i`
  font-size: 18px;
`;

const TabLabel = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  font-family: 'Inter', sans-serif;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 24px;
  width: 100%;
  max-width: 1400px;

  .post-image {
    border-radius: 12px;
    object-fit: cover;
  }

  .avatar {
    border-radius: 50%;
    border: 2px solid #374151;
  }
`;

const DeleteButton = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: scale(1.05);
  }

  i {
    font-size: 16px;
  }
`;

const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  grid-column: 1 / -1;
`;

const EmptyIcon = styled.i`
  font-size: 48px;
  color: #6b7280;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 18px;
  color: #9ca3af;
  font-family: 'Inter', sans-serif;
`;

const LikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  border-radius: 20px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: scale(1.05);
  }
`;

const HeartIcon = styled.i`
  font-size: 16px;
`;

const LikeCount = styled.span`
  font-size: 14px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
`;

const LikesModal = styled.div`
  position: fixed;
  bottom: 0;
  right: 32px;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border: 2px solid #374151;
  border-radius: 16px 16px 0 0;
  padding: 24px;
  min-width: 320px;
  max-width: 400px;
  max-height: 50vh;
  overflow-y: auto;
  z-index: 1000;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const LikesModalContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalTitle = styled.h5`
  font-size: 18px;
  font-weight: 600;
  color: #f9fafb;
  margin: 0 0 16px 0;
  font-family: 'Inter', sans-serif;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: #374151;
  margin: 0 0 16px 0;
`;

const UsersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const UserItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #374151;

  &:last-child {
    border-bottom: none;
  }
`;

const UserAvatar = styled.div`
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #374151;
  }
`;

const UserName = styled.p`
  font-size: 14px;
  color: #e5e7eb;
  margin: 0;
  font-family: 'Inter', sans-serif;
`;

const EmptyState = styled.p`
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  margin: 20px 0;
`;

const CommentsModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const CommentsModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 20px;
`;

const CloseButton = styled.button`
  background: rgba(239, 68, 68, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ef4444;
    transform: scale(1.1);
  }
`;

const CommentsModalContainer = styled.div`
  display: flex;
  gap: 32px;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border: 2px solid #374151;
  border-radius: 16px;
  padding: 32px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const ImageInfo = styled.section`
  background: rgba(17, 24, 39, 0.8);
  padding: 16px 24px;
  border-radius: 12px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const ImageDescription = styled.h6`
  font-size: 14px;
  color: #d1d5db;
  text-align: center;
  max-width: 600px;
  margin: 0;
  line-height: 1.5;
`;

const CommentsSection = styled.div`
  flex: 1;
  background: rgba(17, 24, 39, 0.5);
  border-radius: 12px;
  padding: 24px;
  overflow-y: auto;
  max-height: 60vh;
`;

const CommentCard = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #374151;

  &:last-child {
    border-bottom: none;
  }
`;

const CommentPreview = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(17, 24, 39, 0.3);
  border-radius: 12px;
  margin: 16px 0;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(17, 24, 39, 0.5);
    transform: translateY(-2px);
  }
`;

const CommentAvatar = styled.div`
  .avatar {
    border-radius: 50%;
    border: 2px solid #374151;
  }
`;

const DefaultAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-weight: bold;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentAuthor = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #22c55e;
  margin: 0 0 4px 0;
  font-family: 'Inter', sans-serif;
  cursor: pointer;

  &:hover {
    color: #16a34a;
  }
`;

const CommentText = styled.p`
  font-size: 13px;
  color: #d1d5db;
  margin: 0;
  line-height: 1.4;
  word-wrap: break-word;
`;
