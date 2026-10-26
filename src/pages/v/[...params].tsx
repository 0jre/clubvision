"use client"

import styled from "styled-components"
import type { User } from "@/types/user/types"
import ROUTENVX from "@/routes/routes"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import type { UserInfo } from "@/types/discord/usersearch"
import { type Permission, getPermission } from "@/types/discord/permission"
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { withSession, type NextIronRequest } from "@/lib/session"
import { type ModLog, getModLogs } from "@/types/discord/modlog"
import Logo from "@/public/nvrp/20230331_230855.png"
import DashboardPage from "@/club/.vision/dashboard/home/tutorial/view/window"
import OpenStudioModal from "@/club/.vision/studio/modal/open.studio"
import HpageVisionPost from "@/club/.vision/dashboard/foryou/page.n"
import { TheNoVisionRoute } from "@/lib/session/redirects"
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData"

interface Props {
  user: User | null
  Permissions: Permission[]
  logs: ModLog[]
  routeType: "watch" | "discovery" | "search" | "photo"
  videoId?: string | null
  photoId?: string | null
  searchQuery?: string | null
}

export default function DynamicPage({ user, routeType, videoId, photoId, searchQuery }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPublishingGl, setPublishingGl] = useState(false)
  const [isVisionPost, setVisionPost] = useState(true)
  const { isLoadingx, error, userInfoObject, mutate } = GetInfo_nvxre_xyloQuerier()

  const OpenVisionPost = () => {
    setVisionPost(true)
    setPublishingGl(false)
  }

  useEffect(() => {
    if (!isLoadingx && userInfoObject) {
      setUserInfo(userInfoObject)
      setLoading(false)
    }
  }, [userInfoObject, isLoadingx])

  useEffect(() => {
    if (router.query.club === "postvision") {
      setPublishingGl(true)
      setVisionPost(false)
    }
  }, [router.query])

  return (
    user && (
      <>
        {user && (
          <>
            <DashboardPage
              MarginPost={
                <>
                  <ContainerCenter2>
                    {isPublishingGl && (
                      <>
                        {userInfo?.type ? (
                          <>
                            <OpenStudioModal
                              ButtonY={
                                <>
                                  <button onClick={OpenVisionPost}>
                                    <i className="fi fi-br-arrow-left" />
                                  </button>
                                </>
                              }
                              activecontract={
                                <>
                                  {userInfo.contractvision && (
                                    <MarginStats>
                                      <Image src={"/icons/keyinvite.webp"} alt="Chave vision" width={30} height={30} />
                                      <li>
                                        <h6>Chave vision:</h6>
                                        <p>Postagem sem custo.. </p>
                                      </li>
                                    </MarginStats>
                                  )}
                                </>
                              }
                              stats={
                                <>
                                  <ul className="center">
                                    <MarginStats>
                                      <Image src={"/icons/topmenu/robot.png"} alt="Convite" width={30} height={30} />
                                      <li>
                                        <h6>Meu Limite:</h6>
                                        <p>
                                          {userInfo.usednumber ? userInfo.usednumber : 0}/
                                          {userInfo.limitipost ? userInfo.limitipost : 0}
                                        </p>
                                      </li>
                                    </MarginStats>
                                    {userInfo.contractvision && (
                                      <MarginStats>
                                        <Image
                                          src={"/icons/keyinvite.webp"}
                                          alt="Chave vision"
                                          width={30}
                                          height={30}
                                        />
                                        <li>
                                          <h6>Chave vision:</h6>
                                          <p>Postagem sem custo.. </p>
                                        </li>
                                      </MarginStats>
                                    )}
                                  </ul>
                                </>
                              }
                              AvatarUser={
                                <>
                                  <Image src={Logo || "/placeholder.svg"} alt={user.username} height={30} />
                                </>
                              }
                            />
                          </>
                        ) : (
                          <>
                            <ContentListed>
                              <i className="fi fi-rr-lock" />
                              <p>Você não tem permissão para publicar posts.</p>
                            </ContentListed>
                          </>
                        )}
                      </>
                    )}

                    {isVisionPost && (
                      <>
                        <HpageVisionPost
                          prime={userInfo?.prime ? true : false}
                          IDUSER={user.id}
                          routeType={routeType}
                          videoId={videoId}
                          photoId={photoId}
                          searchQuery={searchQuery}
                          VisionPostC={<></>}
                          InfoUserAvatar={
                            <>
                              <Image
                                className="avataruser"
                                src={user.avatar || "/placeholder.svg"}
                                alt={"usuario"}
                                height={40}
                                width={40}
                              />
                            </>
                          }
                          InfoUserName={
                            <>
                              <h3>{user.username}</h3>
                            </>
                          }
                        />
                      </>
                    )}
                  </ContainerCenter2>
                </>
              }
            />
          </>
        )}
      </>
    )
  )
}

DynamicPage.getLayout = function getLayout(page: any) {
  return <>{page}</>
}

export const getServerSideProps: GetServerSideProps<Props> = withSession(
  async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const req: NextIronRequest = context.req as NextIronRequest
    const { params, query } = context

    // Parse the dynamic route
    const routeParams = (params?.params as string[]) || []
    const firstParam = routeParams[0]

    let routeType: "watch" | "discovery" | "search" | "photo" = "discovery"
    let videoId: string | undefined
    let photoId: string | undefined
    let searchQuery: string | undefined

    // Determine route type and extract parameters
    switch (firstParam) {
      case "watch":
        routeType = "watch"
        videoId = query.v as string
        break
      case "discovery":
        routeType = "discovery"
        break
      case "search":
        routeType = "search"
        searchQuery = query.q as string
        break
      case "photo":
        routeType = "photo"
        photoId = query.v as string
        break
      default:
        // Se não há parâmetros, assume discovery
        routeType = "discovery"
    }

    // Chamando TheNoVisionRoute para verificar a sessão do usuário
    const result = await TheNoVisionRoute({ req })

    const user = result.props.user
    if (!user) {
      return {
        redirect: {
          destination: ROUTENVX.signin,
          permanent: false,
        },
      }
    }

    let Permissions: Permission[] = []
    let logs: ModLog[] = []

    if (user) {
      const userId = user.id
      const guildId = "1175857498687807560"

      try {
        logs = await getModLogs(guildId, userId)
        Permissions = await getPermission(guildId, userId)

        // Convert Date objects to string representations
        Permissions.forEach((permission) => {
          permission.created_at = permission.created_at.toString() 
        })
      } catch (error) {
        console.error("Error fetching information:", error)
      }
    }

    return {
      props: {
        user,
        Permissions,
        logs,
        routeType,
          videoId: videoId ?? null,         // Corrigido
    photoId: photoId ?? null,         // Corrigido
    searchQuery: searchQuery ?? null, // Corrigido
      },
    }
  },
)

const MarginStats = styled.div`
    background-color: rgba(69, 70, 75, 0.13);
    padding: 0.4em 1em 0.4em;
    border-radius: 42px;
    margin: 0.4em;
    display: flex;
    align-items: start;
    text-align: start;

    h6{
        font-family: 'InterSemiBold', monospace;
        font-size: 11px;
        color: #77797e;
    }

    p{
        font-family: 'InterSemiBold', monospace;
        font-size: 13px;
        color: #c0b3b3;
    }

    li{
        padding-left: 0.4em;
    }
`

const ContainerCenter2 = styled.div`
    text-align: center;
    
    padding: 1em 1em 2em;
    width: 100%;

    .avataruser{
        border-radius: 100%;
        border: 3px solid rgba(105, 107, 109, 0.959);
    }

    .center{
        display: inline-flex;
        align-items: center;
    }

    @media screen and (max-width: 680px) {
      padding: 12px;
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

    h2{ 
        margin: 0.6em;
    }

    p{
        font-size: 12px;
        margin-top: 0.8em;
        color: #5c5555;
    }
`
