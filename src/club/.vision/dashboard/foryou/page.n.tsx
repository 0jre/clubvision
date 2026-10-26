"use client"

import styled from "styled-components"
import { type ReactNode, useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import type React from "react"
import HoverCardNvxre from "@/club/.vision/containers/hovercard/index.open"
import CardVisionPostpAG from "./components/card2.post"
import ROUTENVX from "@/routes/routes"
import router from "next/router"
import NotificationUI from "@club/components/notification/card.mnc"
import VideoCard from "./components/video.card"
import PremiumAccount from "@/club/.prime/premium/primeaccount"
import { SkeletonRowLoader } from "@club/resources/loading/skeleton.card"
import StudioPlayer from "../../studio/container/player/studio.player"

interface Post {
  _id: string
  description: string
  imageUrl: string
  userId: string
  AvatarUser: string
  nvuser: string
  likes: number
  videourl: string
  PasVideo: string
  title: string
}

interface Comment {
  _id: string
  text: string
  user: {
    name: string
    avatar: string
  }
}

interface HXpos {
  InfoUserAvatar: React.ReactNode
  InfoUserName: React.ReactNode
  VisionPostC: React.ReactNode
  IDUSER: React.ReactNode
  prime: boolean
  routeType?: "watch" | "discovery" | "search" | "photo"
  videoId?: string | null
  photoId?: string | null
  searchQuery?: string | null
}

const LikeVi = ({ postId, IDUSER }: { IDUSER: React.ReactNode; postId: string }) => {
  const [userLiked, setUserLiked] = useState<boolean>(false)
  const [buttonClass, setButtonClass] = useState(userLiked ? "liked" : "")
  const likeIcon = userLiked ? <i className="fi fi-ss-heart likedi" /> : <i className="fi fi-rr-heart " />

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`/api/nvxre/postvision/posts/likes/likedverifi/${postId}?userId=${IDUSER}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      const data = await response.json()

      if (response.status === 200) {
        setUserLiked(data.liked)
        console.log(data.liked)
      } else {
        console.error("Error checking like status. Server returned:", response.status)
      }
    } catch (error) {
      console.error("Error checking like status:", error)
    }
  }

  useEffect(() => {
    if (postId) {
      checkLikeStatus()
    }
    checkLikeStatus()
  }, [postId, IDUSER])

  const handleLike = async () => {
    try {
      const response = await fetch(
        `/api/nvxre/postvision/posts/likes/${postId}?userId=${IDUSER}&action=${userLiked ? "unlike" : "like"}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: userLiked ? "unlike" : "like", userId: IDUSER }),
        },
      )

      if (response.status === 200) {
        setUserLiked(!userLiked)
        checkLikeStatus()
        setButtonClass(!userLiked ? "liked" : "")
      } else {
        console.error("Error updating like status. Server returned:", response.status)
      }
    } catch (error) {
      console.error("Error updating like status:", error)
    } finally {
      checkLikeStatus()
    }
  }

  return (
    <>
      <ButtonLikens onClick={handleLike} className={`${buttonClass} sspan`}>
        {likeIcon}
      </ButtonLikens>
    </>
  )
}

interface PropsuseLike {
  avatar: string
  id: string
  name: string
}

// Função para navegar para visualização específica de post
const navigateToPost = (postId: string, type: "watch" | "photo") => {
  const newURL = `/v/${type}?v=${postId}`
  router.push(newURL)
}

// Função para navegar para pesquisa
const navigateToSearch = (searchTerm: string) => {
  const newURL = `/v/search?q=${encodeURIComponent(searchTerm)}`
  router.push(newURL)
}

export default function HpageVisionPost({
  InfoUserAvatar,
  prime,
  IDUSER,
  routeType = "discovery",
  videoId = '',
  photoId = '',
  searchQuery = '',
}: HXpos) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setloading] = useState(false)
  const [typeview, settypeview] = useState<string>("feed")
  const [searchedPostId, setSearchedPostId] = useState<string>("")
 

const fetchUserPosts = async (
  typeParam?: string,
  postId?: string,
  searchTerm?: string
) => {
  setloading(true)
  const finalType = searchedPostId || typeParam || typeview

  try {
    let url = `/api/nvxre/postvision/posts?typeview=${finalType}`

    // Só usa postId ou searchTerm se estiverem explicitamente passados
    if (postId) url += `&_id=${postId}`
    if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`

    const response = await axios.get(url)
    setPosts(response.data)
  } catch (error) {
    console.error("Erro no fetch:", error)
    setPosts([])
  } finally {
    setloading(false)
  }
}

useEffect(() => {
  const { type } = router.query
  const typeParam = typeof type === "string" ? type : "feed"

  // Atualiza estado (se você quiser exibir o active button, etc)
  settypeview(typeParam)

  // Força fetch com o type atualizado
  fetchUserPosts(typeParam)
}, [router.query.type])
  useEffect(() => {
  const { type, _id, v } = router.query
  const typeParam = typeof type === "string" ? type : "feed"

  // 🚀 Fetch imediato com o type da URL
  const run = async () => {
    switch (routeType) {
      case "watch":
        if (videoId) {
          await fetchUserPosts(typeParam, videoId)
        } else {
          await fetchUserPosts(typeParam)
        }
        break
      case "photo":
        if (photoId) {
          await fetchUserPosts(typeParam, photoId)
        } else {
          await fetchUserPosts(typeParam)
        }
        break
      case "search":
        if (searchQuery) {
          await fetchUserPosts(typeParam, undefined, searchQuery)
        } else {
          await fetchUserPosts(typeParam)
        }
        break
      case "discovery":
      default:
        if (_id && typeof _id === "string") {
          await handleSearch(_id)
        } else {
          await fetchUserPosts(typeParam)
        }
        break
    }

    settypeview(typeParam) // atualiza visualmente se quiser
  }

  run()
}, [router.asPath, routeType, videoId, photoId, searchQuery])

  // useEffect separado para detectar mudanças no parâmetro type
useEffect(() => {
  const { type } = router.query
  const newType = typeof type === "string" ? type : "feed"

  if (newType !== typeview) {
   
    settypeview(newType)
    fetchUserPosts(newType) // PASSA o novo type aqui
  }
}, [router.query.type])

  const handleSearch = async (postId: string) => {
    if (!postId) {
      // Se não há ID, volta para o feed normal
      setSearchedPostId("")
      fetchUserPosts()
      return
    }

    setSearchedPostId(postId)

    try {
      await fetchUserPosts(postId)
    } catch (error) {
      console.error("Error searching post:", error)
    } 
  }

  const ViewInd = ({
    postId,
    ImageViewPost,
    Avatar,
    descriptionImage,
    AboutUser,
  }: {
    Likeb: number
    ImageViewPost: React.ReactNode
    Avatar: React.ReactNode
    postId: string
    descriptionImage: React.ReactNode
    AboutUser: React.ReactNode
  }) => {
    const [comments, setComments] = useState<Comment[]>([])
    const [showAllComments, setShowAllComments] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isOpenComments, setOpenComments] = useState(false)

    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/nvxre/postvision/posts/listcomm/${postId}`)
        setComments(response.data.comments)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching comments:", error)
        setLoading(false)
      }
    }

    useEffect(() => {
      if (postId) {
        fetchComments()
      }
    }, [postId])

    // APENAS este useEffect para controlar abertura baseada na URL
    useEffect(() => {
      const { view } = router.query

      if (view && view === postId) {
        setOpenComments(true)
        setShowAllComments(true)
      }
    }, [router.query.view, postId])

    // APENAS este useEffect para routeType watch
    useEffect(() => {
  // Só abre se for routeType "watch" E houver query "v" igual ao postId
  const { v } = router.query
  if (routeType === "watch" && v === postId) {
    setOpenComments(true)
    setShowAllComments(true)
  } else {
    setOpenComments(false)
    setShowAllComments(false)
  }
}, [routeType, router.query.v, postId])

    const displayedComments = showAllComments ? comments.slice().reverse() : comments.slice().reverse().slice(0, 1)

    const handleUpdate = () => {
      fetchComments()
    }

    const HandleComments = () => {
      setOpenComments(true)
      setShowAllComments(true)

      const currentURL = new URL(window.location.href)
      currentURL.searchParams.set("view", postId)
      router.push(currentURL.pathname + currentURL.search, undefined, { shallow: true })
    }

    const CloseComments = (e?: React.MouseEvent) => {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  setOpenComments(false)
  setShowAllComments(false)
  setComments([])
  setSearchedPostId("")
  if (typeof window !== "undefined") {
    window.history.replaceState({}, "", "/v/discovery?type=feed")
  }

}

    const LikesViewUsers: React.FC = () => {
      const [isOpenInfolikesUsers, setOpenInfoUsersLikes] = useState(false)
      const OpenModalInfoLikes = () => {
        fetchLikedUsers()
        setOpenInfoUsersLikes(true)
      }
      const CloseInfoModal = () => setOpenInfoUsersLikes(false)

      const [likedUsers, setLikedUsers] = useState<PropsuseLike | []>([])

      const fetchLikedUsers = async () => {
        try {
          const response = await fetch(`/api/nvxre/postvision/posts/likes/visualization/${postId}`)
          const data = await response.json()

          if (response.status === 200) {
            setLikedUsers(data)
          } else {
            console.error("Error fetching liked users. Server returned:", response.status)
          }
        } catch (error) {
          console.error("Error fetching liked users:", error)
        }
      }

      useEffect(() => {
        fetchLikedUsers()
      }, [postId])

      const formatNumber = (num: number): string => {
        if (num >= 1e6) {
          return (num / 1e6).toFixed(num % 1e6 !== 0 ? 1 : 0) + "M"
        } else if (num >= 1e3) {
          return (num / 1e3).toFixed(num % 1e3 !== 0 ? 1 : 0) + "K"
        } else {
          return num.toString()
        }
      }

      const likeCount: number = Array.isArray(likedUsers) ? likedUsers.length : 0
      return (
        <>
          <CardMarginLike>
            <li onClick={OpenModalInfoLikes}>
              <LikeVi IDUSER={IDUSER} postId={postId} />
              <h5>
                {formatNumber(likeCount)} {likeCount === 1 ? "" : ""}
              </h5>
            </li>
          </CardMarginLike>

          {isOpenInfolikesUsers && (
            <>
              <CardVComment onClick={CloseInfoModal}>
                <ViewCountLike>
                  <h5>Quem curtiu a foto?</h5>
                  <hr />
                  {Array.isArray(likedUsers) && likedUsers.length > 0 ? (
                    <ul>
                      {likedUsers.map(
                        (user: {
                          id: React.Key | null | undefined
                          avatar: string | undefined
                          name:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                            | React.ReactFragment
                            | React.PromiseLikeOfReactNode
                            | null
                            | undefined
                        }) => (
                          <li key={user.id}>
                            <div>
                              {user.avatar && (
                                <img
                                  src={user.avatar || "/placeholder.svg"}
                                  alt={"novision"}
                                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                />
                              )}
                            </div>
                            <div>{user.name && <p>{user.name}</p>}</div>
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p>0 Pessoas achou Irado</p>
                  )}
                </ViewCountLike>
              </CardVComment>
            </>
          )}
        </>
      )
    }
    return (
      <>
         
        {isOpenComments && (
          <ModalWrapper
            onClick={(e) => {
              e.stopPropagation()
              // Só fecha se clicar diretamente no backdrop
              if (e.target === e.currentTarget) {
                CloseComments(e)
              }
            }}
          >
            <ImageCardComment
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {ImageViewPost}
            </ImageCardComment>

            <CardContainer
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <ButtonCl2 onClick={(e) => CloseComments(e)} type="button">
                X
              </ButtonCl2>

              <Image src={"/nvrp/20230331_230855.png"} className="logomanager" alt="novision" height={36} width={36} />
              <TopInf>
                <MarginN>
                  <li>{AboutUser}</li>

                  <LikesViewUsers />
                </MarginN>

                <section>
                  <h3>{descriptionImage}</h3>
                </section>
              </TopInf>

              <CommentForm AvatarUser={Avatar} postId={postId} onUpdate={handleUpdate} />

              <ContainerComment>
                {displayedComments.map((comment, index) => (
                  <CardComments key={index}>
                    <li>
                      {comment.user.avatar ? (
                        <>
                          <Image
                            src={comment.user.avatar || "/placeholder.svg"}
                            alt="user"
                            height={40}
                            width={40}
                            className="logouser"
                          />
                        </>
                      ) : (
                        <>-</>
                      )}
                    </li>
                    <ul>
                      <Link href={`${ROUTENVX.User}/@${comment.user.name}`}>
                        <h3>{comment.user.name}</h3>
                      </Link>
                      <p>{comment.text}</p>
                    </ul>
                  </CardComments>
                ))}
              </ContainerComment>
            </CardContainer>
          </ModalWrapper>
        )}

        {comments.length > 0 && (
          <CardComments3 onClick={HandleComments}>
            <li>
              {comments[comments.length - 1].user.avatar ? (
                <Image
                  src={comments[comments.length - 1].user.avatar || "/placeholder.svg"}
                  alt="user"
                  height={40}
                  width={40}
                  className="logouser"
                />
              ) : (
                "-"
              )}
            </li>
            <ul>
              <Link href={`${ROUTENVX.User}/@${comments[comments.length - 1].user.name}`}>
                <h3>{comments[comments.length - 1].user.name}</h3>
              </Link>
              <p>{comments[comments.length - 1].text}</p>
            </ul>
          </CardComments3>
        )}
      </>
    )
  }

  const CommentForm = ({
    postId,
    AvatarUser,
    onUpdate,
  }: { AvatarUser: ReactNode; postId: string; onUpdate: () => void }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [comment, setComment] = useState("")
    const [isloading, setloading] = useState(false)
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setloading(true)
      try {
        setIsSubmitting(true)
        const trimmedComment = comment.trim()

        if (!hasLetter(trimmedComment)) {
          setNotificationMessage("O comentário deve conter pelo menos uma letra.")
          return
        }

        const response = await fetch(`/api/nvxre/postvision/posts/comment/${postId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment: trimmedComment }),
        })
        const data = await response.json()
        setNotificationMessage(data.message)
        setIsFormSubmitted(true)

        setTimeout(() => {
          setIsFormSubmitted(false)
          setComment("")
        }, 5000)
        if (response.status === 201) {
          const data = await response.json()

          console.log("Comment submitted successfully")
          setComment("")
          onUpdate()
          setNotificationMessage(data.message)
          setIsFormSubmitted(true)

          setTimeout(() => {
            setIsFormSubmitted(false)
          }, 5000)
        } else {
          console.error("Error submitting comment")
        }
      } catch (error) {
        console.error("Error submitting comment:", error)
      } finally {
        setIsSubmitting(false)
        setloading(false)
        setComment("")
      }
    }
    const hasLetter = (text: string) => {
      return /[a-zA-Z]/.test(text)
    }

    return (
      <>
        <ViewModal>
          <form onSubmit={handleSubmit}>
            <label>
              {AvatarUser}
              <TextFieldComment
                name="message"
                placeholder="Comente sobre "
                rows={6}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={170}
                minLength={4}
                required
              />

              <ButtonCL disabled={isSubmitting} type="submit">
                {isloading ? <i className="fi fi-rs-loading" /> : <i className="fi fi-rs-paper-plane" />}
              </ButtonCL>
            </label>
          </form>
        </ViewModal>
        {isFormSubmitted && <NotificationUI message={notificationMessage} />}
      </>
    )
  }

  // Adicione este componente antes do renderRouteHeader()
  const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState(searchQuery || "")

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault()
      if (searchTerm.trim()) {
        navigateToSearch(searchTerm.trim())
      }
    }

    return (
      <SearchContainer>
        <form onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Pesquisar posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchButton type="submit">
            <i className="fi fi-rr-search" />
          </SearchButton>
        </form>
      </SearchContainer>
    )
  }

  return (
    <>
      <Xmargin>
        <MainDashboardN className="mshd">
          {loading ? (
            <>
              <SkeletonRowLoader />
            </>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="swiper-slide">
                {/* Se tem vídeo, mostra como vídeo */}
                {post.videourl ? (
                  <VideoCard
                    Thumbnail={post.PasVideo}
                    Title={post.title}
                    Description={post.description}
                    Avatar={post.AvatarUser}
                    Username={post.nvuser}
                    onWatchClick={() => navigateToPost(post._id, "watch")}
                    XBVC={
                      <>
                        <ViewInd
                          Avatar={InfoUserAvatar}
                          AboutUser={
                            <>
                              {post.AvatarUser && (
                                <>
                                  <Image
                                    src={post.AvatarUser || "/placeholder.svg"}
                                    alt={post.AvatarUser}
                                    height={40}
                                    width={40}
                                    className="logouser"
                                  />
                                </>
                              )}
                              <Link href={`${ROUTENVX.User}/@${post.nvuser}`}>
                                <h3>{post.nvuser}</h3>
                              </Link>
                            </>
                          }
                          Likeb={post.likes}
                          postId={post._id}
                          ImageViewPost={
                            <>
                              <StudioPlayer
                                videoPath={post.videourl}
                                videotitle={post.title}
                                onClose={(): void => {
                                  throw new Error("Function not implemented.")
                                }}
                              />
                            </>
                          }
                          descriptionImage={post.description}
                        />
                      </>
                    }
                  />
                ) : (
                  /* Se tem imagem, mostra como post normal */
                  post.imageUrl && (
                    <CardVisionPostpAG
                      RightO
                      ButtonClickLike={<LikeVi postId={post._id} IDUSER={IDUSER} />}
                      ButtonComment={
                        <>
                          <CommentForm
                            postId={post._id}
                            AvatarUser={InfoUserAvatar}
                            onUpdate={(): void => {
                              throw new Error("Function not implemented.")
                            }}
                          />
                        </>
                      }
                      CommentUser={
                        <>
                          <ViewInd
                            Avatar={InfoUserAvatar}
                            AboutUser={
                              <>
                                {post.AvatarUser && (
                                  <>
                                    <Image
                                      src={post.AvatarUser || "/placeholder.svg"}
                                      alt={post.AvatarUser}
                                      height={40}
                                      width={40}
                                      className="logouser"
                                    />
                                  </>
                                )}
                                <Link href={`${ROUTENVX.User}/@${post.nvuser}`}>
                                  <h3>{post.nvuser}</h3>
                                </Link>
                              </>
                            }
                            Likeb={post.likes}
                            postId={post._id}
                            ImageViewPost={
                              <>
                                <img
                                  className="borderradius1"
                                  src={post.imageUrl || "/placeholder.svg"}
                                  alt="og:image"
                                  height={1440}
                                  width={1490}
                                />
                              </>
                            }
                            descriptionImage={post.description}
                          />
                        </>
                      }
                      ImageC={
                        <>
                          <img
                            className="novisionImage"
                            src={post.imageUrl || "/placeholder.svg"}
                            alt="og:image"
                            height={199}
                            width={380}
                          />
                        </>
                      }
                      description={post.description}
                      AvatarUser={
                        <>
                          <HoverCardNvxre
                            NameUser={<>{post.nvuser}</>}
                            AvatarUser={
                              <>
                                {post.AvatarUser && (
                                  <>
                                    <Image
                                      src={post.AvatarUser || "/placeholder.svg"}
                                      alt={post.AvatarUser}
                                      height={60}
                                      width={60}
                                      className="logocard"
                                    />
                                  </>
                                )}
                              </>
                            }
                            NvUserID={post.userId}
                            HoverCa={
                              <>
                                {post.AvatarUser && (
                                  <>
                                    <Image
                                      src={post.AvatarUser || "/placeholder.svg"}
                                      alt={post.AvatarUser}
                                      height={40}
                                      width={40}
                                      className="logouser"
                                    />
                                  </>
                                )}
                                <Link href={`${ROUTENVX.User}/@${post.nvuser}`}>
                                  <h3>{post.nvuser}</h3>
                                </Link>
                              </>
                            }
                          />
                        </>
                      }
                      onPhotoClick={() => navigateToPost(post._id, "photo")}
                    />
                  )
                )}
              </div>
            ))
          ) : !prime ? (
            <>
              <PremiumAccount />
            </>
          ) : (
            <>
              <CardInputs>
                <ContentListed>
                  <img src={"/icons/planet.png"} alt="icon" height={150} width={150} />
                  <h3>Aqui está mais vazio que carteira de mendigo!</h3>
                </ContentListed>
              </CardInputs>
            </>
          )}
        </MainDashboardN>
      </Xmargin>
    </>
  )
}

// New styled component for route header
const RouteHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;
  margin-bottom: 1em;
  background-color: rgba(69, 70, 75, 0.13);
  border-radius: 12px;

  i {
    font-size: 1.5em;
    margin-right: 0.5em;
    color: #77797e;
  }

  h2 {
    font-family: 'Inter', monospace;
    font-size: 1.2em;
    color: #c0b3b3;
    margin: 0;
  }
`

// Keep all existing styled components...
const TopInf = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(240, 248, 255, 0.027);
  padding: 0.6em 1em 0.6em;
  margin: 0.1em;
  margin-bottom: 1em;
  width: 100%;
  border-radius: 12px;

  h3{
    font-family: 'Inter', monospace;
    font-weight: 400;
    font-size: 17px;
    color: #5f6264;
    padding-left: 0.3em;
  }

  .logouser{
    border-radius: 100%;
    border: 2px solid rgba(72, 72, 73, 0.144);
  }

  li{
    display: flex;
    align-items: center;
  }
`

const CardContainer = styled.div`
  padding: 1em 0.5em 1em;
  height: 100%;
  width: 30%;
  overflow-y: scroll; 
  display: flex;
  place-items: start;
  flex-direction: column;
  align-items: start;
  
  section{
    margin-bottom: 0.7em;
    padding: 0.4em 1em 0.4em;
    display: flex;
    text-align: left;
    flex-direction: column;
    align-items: center;

    h3{
      font-size: 12px;
      max-width: 240px;
      word-wrap: break-word;
      overflow-wrap: break-word; 
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 24;
      -webkit-box-orient: vertical;
    }
  }

  .activeHomejd{
    display: none;
  }
    
  .sspan{
    display: flex;
    align-items: center;
    background-color: rgb(25, 255, 121);
    border-radius: 100px;
    padding: 6px 2px  2px;
    height: 30px;
    width: 30px;
    margin: 0.2em;
    margin-right: 0.3em;

    h5{
      font-family: 'Inter', monospace;
      font-weight: 100;
      font-size: 13px;
      margin-top: -0.2em;
    }

    i{
      margin: 0.3em;
      color: #000000;
      font-size: 16px;
    }
  }

  li{
    display: flex;
    align-items: center;
    padding: 2px 13px 0px;
    margin: 1px;
    
    .opacitu{
      opacity: 0.1;
    }
    i{
      margin: 0.3em;
      color: #09090a;
      font-size: 14px;
    }
  }

  @media screen and (max-width: 430px){
    width: 100%;

    .logomanager{
      display: block;
      position: absolute;
      right: 2%;
      top: 2%;
    }
  } 
`

const ModalWrapper = styled.div`
  position: fixed;
  right: 0;
  bottom: 3px;
  background: radial-gradient(circle, #050505 0%, #0d0d0f 100%);
  top: 0;
  left: 0;
  z-index: 19999;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  place-items: center;
  animation: opacityModl67 1s;

  @keyframes opacityModl67 {
    0%{ opacity: 0;  }
    100%{ opacity: 1;}
  }

  @media screen and (max-width: 430px){
    display: flex;
    flex-direction: column;
    width: 100%;
  } 
`

const CardComments3 = styled.div`
  margin-left: 0.3em;
  margin-top: 19px;
  margin-bottom: 0.3em;
  text-align: left;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: end;
  


  .logouser{
    border-radius: 50%;
    border: 3px solid rgba(231, 233, 236, 0.048);
    margin-right: 0.7em;
    position: absolute;
  }
   
  li{
    display: flex;
    align-items: center;
  }

  h3{
    font-family: 'Poppins', sans-serif;
    color: #8a8d91;
    font-size: 11px;
    margin-bottom: 0.2em;
  }

  h5{
    font-size: 11px;
    color: #8a8b8d;
  }

  p{
    max-width: 280px;
    word-wrap: break-word;
    font-size: 11px;
    overflow-wrap: break-word; 
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  ul{
    background-color: rgba(136, 141, 138, 0.151);
    padding: 0.4em 2em 0.4em;
    border-radius:   29px 14rem;  
    margin-left: 2em;
    width: 100%;
    margin-top: 5px;
  }
`

const CardComments = styled.div`
  border-radius: 19px;
  text-align: left;
  margin: 0.3em;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  text-align: end;


  .logouser{
    border-radius: 50%;
    border: 3px solid rgb(35, 35, 37);
  }
   
  li{
    display: flex;
    align-items: center;
  }

  h3{
    font-family: 'Poppins', sans-serif;
    color: #c1c4c7;
    font-size: 14px;
    color: #c1c4c7;
    margin-bottom: 0.4em;
  }

  h5{
    font-size: 12px;
    color: #8a8b8d;   
  }

  p{
    max-width: 170px;
    font-size: 11px;
    color: #797c83;
    word-wrap: break-word;
    overflow-wrap: break-word; 
  }
  
  ul{
    background-color: rgba(231, 233, 236, 0.048);
    padding: 0.4em 1em 0.4em;
    border-radius: 9px 17px 17px 17px;
    margin: 2px;
    width: 100%;
  }
`

const ContentListed = styled.ul`
  text-align: center;
  display: flex;
  flex-direction: column;
  place-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  
  i{
    color: #36373a9e;
    font-size: 34px;
  }

  h3{
    font-size: 17px;
    font-family: 'XcSemibold', monospace;
  }
  
  p{
    font-size: 12px;
    margin-top: 0.8em;
    color: #5c5555;
  }
`

const CardInputs = styled.div`
  margin: 1em;
  padding: 0.5em 1em 0.5em;
  border-radius: 22px;
  width: 100%; 
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;

  label{
    background-color: rgba(87, 85, 105, 0.068); 
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-evenly;
    border-radius: 14px;

    i{
      font-size: 29px;
      color: rgb(67, 68, 73); 
    }
  }
`

const ViewModal = styled.div`
  animation: fadeInUp 1s ease-in-out forwards;
  width: 100%;
  
  @keyframes fadeInUp {
    0%{ opacity: 0; }
    100%{ opacity: 1; }
  }

  label{
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    background-color: rgba(38, 40, 43, 0.205);
    border-radius: 24px;
    width: 100%;
    padding: 0.4em 0.8em 0.4em;
  }
`

const TextFieldComment = styled.textarea`
  background-color: transparent;
  max-width: 73%;
  min-width: 73%;
  display: flex;
  justify-content: center;
  max-height: 3em;
  min-height: 3em;
  font-size: 16px;
  border: none;
  color: #acacb4;
  font-size: 12px;
  padding: 0.6em 0.7em 0.6em;
  font-family: 'Poppins', Courier, monospace;
  resize: none;
  
  :focus{
    outline: none;
    max-height: 5em;
  }

  ::placeholder {
    font-weight: 400;
    font-family: 'Poppins', sans-serif;
    color: #bbbbc4;
  }
`

const ButtonCL = styled.button`
  border-radius: 25px;
  padding: 5px 9px 2px;
  margin-bottom: 1em;
  margin: 0.1em;
  height: 40px;
  width: 40px;
  background-color: #1e1e1f;
  border: 1px solid transparent;
  
  i{
    color: #6b6b74;
  }
 
  h5{
    color: #959ca3;
    font-family: 'Poppins', sans-serif;
  }

  &:hover{
    border: 1px solid rgba(106, 109, 122, 0.26);
  }
`

const ButtonCLS = styled.button`
  border-radius: 25px;
  padding: 5px 4px 2px;
  margin-bottom: 1em;
  height: 40px;
  width: 40px;
  background-color: #1e1e1f;
  margin: 0.9em;

  i{
    color: #6b6b74;
  }
 
  h5{
    color: #959ca3;
    font-family: 'Poppins', sans-serif;
  }

  &:hover{
    border: 1px solid rgba(106, 109, 122, 0.26);
  }
`

const ImageCardComment = styled.div`
 flex: 1; /* ocupa o máximo possível dentro do pai */
  width: 100%;
  padding: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

 
  .borderradius1{
    border-radius: 22px;
    height:  90%;
    width: 90%;
    margin: 4%;
  }

  .activeHomejd{
    display: none;
  }
    
  .sspan{
    display: flex;
    align-items: center;
    background-color: rgb(25, 255, 121);
    border-radius: 100px;
    padding: 6px 2px  2px;
    height: 30px;
    width: 30px;
    margin: 0.2em;
    margin-right: 0.3em;
  
    h5{
      font-family: 'Inter', monospace;
      font-weight: 100;
      font-size: 13px;
      margin-top: -0.2em;
    }

    i{
      margin: 0.3em;
      color: #000000;
      font-size: 16px;
    }
  }

  li{
    display: flex;
    align-items: center;
    padding: 2px 13px 0px;
    margin: 1px;
    
    .opacitu{
      opacity: 0.1;
    }
    i{
      margin: 0.3em;
      color: #09090a;
      font-size: 14px;
    }
  }

  @media screen and (max-width: 430px){
    height: 280px;
    margin-top: 3em;
    .borderradius1{ 
      border-radius: 9px;
    }
  } 
`

const CardViewList = styled.div`
  max-width: 300px;
  border-radius: 43px;
  overflow-x: auto;
  display: inline-flex;
 

  @media screen and (max-width: 560px){
    width: 150px;
  } 
`

const ButtonTag = styled.button`
  display: flex;
  align-items: center;
  background-color: rgba(77, 78, 80, 0.062);
  padding: 0.4em ;
  height: 35px;
  width: 35px;
  
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

const MarginN = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CardVComment = styled.div`
  position: fixed;
  bottom: 0;
  right: 2px;
  background: radial-gradient(circle, #050505 0%, #0d0d0f 100%);
  padding: 1em;
  height: 40%; 
  overflow-y: scroll;
  min-width: 28em;
  border-bottom: none;
  border-radius: 22px 22px 0 0 ; 
  animation: OneS 0.9s linear ;
  
  p{
    font-size: 12px;
    color: #b2b6bd;
    margin: 0.4em;
  }

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

  @media screen and (max-width: 430px){
    min-width: 26em;
  } 

  @media screen and (max-width: 390px){
    min-width: 20em;
  } 

  @media screen and (max-width: 530px) {
    margin: 0.4em;
    width: 100vw;
  }
`

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
    }

    span{
      font-size: 10px;
      margin: 0.3em;
      color: #504ea7;
    }
  }
  
  li{
    text-align: left;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
 
  h5{
    font-family: 'Inter', monospace;
    font-weight: 400;
    color: rgba(173, 173, 180, 0.507);
  }
`

const ButtonCl2 = styled.button`
  background-color: rgba(189, 180, 180, 0.089);
  border-radius: 7px;
  color: #ebd7d7;
  padding: 3px 12px 3px; 
  position: absolute;
  left: 2%;
  top: 2%;

  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  transition: 0.3s all;
  margin: 0.2em;

  &:hover{
    border-radius: 10px;
    color: #f52626;
  }
`

const ContainerComment = styled.div`
  background-color: rgba(38, 40, 43, 0.205);
  padding: 0.3em 0.4em 0.3em;
  border-radius: 17px;
  width: 100%;
  margin-top: 0.8em;
`

const CardMarginLike = styled.div`
  li{
    padding: 0.1em 0.6em 0.1em;
    border-radius: 39px;
    backdrop-filter: blur(10px);
    margin: 0.3em;
    display: flex;
    align-items: center;

    i{
      color: rgb(8, 12, 9);
    }

    h5{
      margin-left: 0.5em;
    }
  }
`

const ButtonLikens = styled.button`
  background-color: #161618;
`

const MainDashboardN = styled.section`
  margin-top: 0;
  padding: 0.4em 0.2em 0.4em;
   width: 100%;
  flex-wrap: wrap;
 
  display: flex;
  flex-direction: row;
  animation: PageAnim 0.8s linear;
  
  @keyframes PageAnim {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }

  .Relative{
    position: relative;
  }

  @media screen and (max-width: 530px){
    background-color: transparent;
   
  } 
`

const Xmargin = styled.section`
  width: 100%;
  .navbar-closed {
    animation: collapse 0.5s forwards;
  }

  @keyframes collapse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0.7);
    }
  }
 
  .OpenMenu{
    animation: expand 0.5s forwards;
  }

  @keyframes expand {
    0% {
      opacity: 0;
      transform: scale(0.7);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media screen and (max-width: 530px) {
    padding: 0.4em;
  }
`

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1em;
  
  form {
    display: flex;
    align-items: center;
    background-color: rgba(69, 70, 75, 0.13);
    border-radius: 25px;
    padding: 0.5em;
    width: 100%;
    max-width: 400px;
  }
`

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: #c0b3b3;
  font-family: 'Inter', monospace;
  font-size: 14px;
  flex: 1;
  padding: 0.5em;
  
  ::placeholder {
    color: #77797e;
  }
`

const SearchButton = styled.button`
  background: transparent;
  border: none;
  color: #77797e;
 
  padding: 0.5em;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(125, 125, 128, 0.2);
    color: #ffffff;
  }
  
  i {
    font-size: 16px;
  }
`
