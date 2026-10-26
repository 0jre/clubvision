"use client"

import type { User } from "@/types/user/types"
import type { ReactNode } from "react"
import type React from "react"
import { useRef, useState, useMemo } from "react"
import { type Permission, getPermission } from "@/types/discord/permission"
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { withSession, type NextIronRequest } from "@/lib/session"
import { type ModLog, getModLogs } from "@/types/discord/modlog"
import { TheNoVisionRoute } from "@/lib/session/redirects"
import AdsDashboard from "@/club/.vision/dashboard/home/tutorial/view/ads"
import HeadGlobal from "@/club/head/glob.n"
import styled from "styled-components"
import { getAllMdx, getLatestMdx } from "@/club/.wiki/sx/lb/mdx"
import type { MDXFrontMatter } from "@/club/.wiki/sx/lb/types"
import { filterPostsByCategory, getAvailableCategories, getPostStats } from '../club/.wiki/sx/lb/post-filters';
import { PostListUpgrade } from '../club/.wiki/sx/components/post.upgrades';
import Clubr from "@/club/.vision/dashboard/clubr/club-overview"
 

// Interface combinada para as props da página
interface Props {
  user: User | null
  Permissions: Permission[]
  logs: ModLog[]
  posts: Array<MDXFrontMatter>
  latestMdx: MDXFrontMatter | null
}

interface HorizontalScrollContainerProps {
  children: React.ReactNode
}

// Componente de scroll horizontal
const ScrollingCardUserinfo: React.FC<HorizontalScrollContainerProps> = ({ children }) => {
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

  return (
    <CardViewList
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
    >
      {children}
    </CardViewList>
  )
}

// Componente de atualizações usando os filtros
const UpdatesComponent = ({ posts, latestMdx }: { posts: Array<MDXFrontMatter>; latestMdx: MDXFrontMatter | null }) => {
  const [activeCategory, setActiveCategory] = useState("Upgrades")

  // Usando os utilitários de filtro
  const availableCategories = useMemo(() => getAvailableCategories(posts), [posts])
  const postStats = useMemo(() => getPostStats(posts), [posts])
  const filteredPosts = useMemo(() => filterPostsByCategory(posts, activeCategory), [posts, activeCategory])

  return (
    <>
  
      <Container>
        
       <div className="flex items-center mb-4 w-full gap-5 justify-between">
          <h2>NOVIDADES</h2>
    
        
      

        <ScrollingCardUserinfo>
          <>
            {availableCategories.map((category) => (
              <CategoryButton
                key={category}
                isActive={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
                <CategoryCount>({postStats.byCategory[category] || 0})</CategoryCount>
              </CategoryButton>
            ))}
          </>
        </ScrollingCardUserinfo>
       </div>

        
        {filteredPosts.length > 0 ? (
          <PostListUpgrade posts={filteredPosts} />
        ) : (
          <NoPostsContainer>
            <NoPostsMessage>
              {activeCategory === "Tudo"
                ? "Nenhuma atualização encontrada."
                : `Nenhuma atualização encontrada.`}
            </NoPostsMessage>
          </NoPostsContainer>
        )}
      </Container>
  
    </>
  )
}

// Componente principal da página
export default function HomePage({ user,posts, latestMdx }: Props) {
 
  return (
    user && (
      <>
       <AdsDashboard user={user} /> 
    
      <Clubr user={user} 
       children={
           <UpdatesComponent posts={posts} latestMdx={latestMdx} /> 
       }
      />
        
      </>
    )
  )
}

HomePage.getLayout = function getLayout(page: ReactNode) {
  return <>{page}</>
}

// getServerSideProps modificado para incluir dados MDX
export const getServerSideProps: GetServerSideProps<Props> = withSession(
  async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const req: NextIronRequest = context.req as NextIronRequest

    // Chamando TheNoVisionRoute para verificar a sessão do usuário
    const result = await TheNoVisionRoute({ req })

    const user = result.props.user

    let Permissions: Permission[] = []
    let logs: ModLog[] = []
    let posts: Array<MDXFrontMatter> = []
    let latestMdx: MDXFrontMatter | null = null

    if (user) {
      const userId = user.id
      const guildId = "1175857498687807560"

      try {
        // Buscar dados do usuário
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

        // Buscar dados MDX
        const mdxFiles = getAllMdx().map((post) => post["frontMatter"])
        const latestMdxData = getLatestMdx()
       
        posts = mdxFiles
        
        latestMdx = latestMdxData ? latestMdxData.frontMatter : null
    return {
      props: {
        user,
        Permissions,
        logs,
        posts,
        latestMdx,
      },
    }
  },
)

 
const Container = styled.div`
  
  margin: 0 auto;
  max-width: 1190px;
  padding: 1em;
  
  animation: PageAnim 0.8s linear;
  
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
     
  @keyframes PageAnim {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }
  @media screen and (max-width: 430px){
  margin-left: 0;
  width: 100%;
  } 

 h2{
    font-family: 'Europa Grotesk';
    color: #d6e2d8;
    font-size: 29px;
   
    text-align: center;
 
   
  }
  @media screen and (max-width: 430px) {
    margin: 0.4em;
  }

  
@media screen and (max-width: 680px) {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 0em;
  gap: 8px;
 
}
`
 
const CardViewList = styled.div`
  border-radius: 50px;
  
  overflow-x: auto;
  cursor: var(--f-cursor-grab);
  display: inline-flex;
 
  :active {
    cursor: var(--f-cursor-grabbed);
  }

  ::-webkit-scrollbar {
    display: none;
  }
    
  ::selection {
    display: none;
  }
`

const CategoryButton = styled.button<{ isActive?: boolean }>`
  margin: 0.4em;
  padding: 0.5em 1em 0.5em;
  border-radius: 49px;
  background-color: ${(props) => (props.isActive ? "rgba(63, 63, 68, 0.9)" : "rgba(78, 78, 80, 0.726)")};
  font-family: 'XcSemibold';
  font-size: 15px;
  color: ${(props) => (props.isActive ? "#ffffff" : "#a9a9b3")};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background-color: rgba(63, 63, 68, 0.726);
  }
`

const CategoryCount = styled.span`
  font-size: 0.75rem;
  opacity: 0.8;
`

const NavButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
  padding: 0.5rem;
  background-color: rgba(28, 28, 31, 0.3);
  border-radius: 50px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
`

const NavButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1.5rem;
  border-radius: 40px;
  background-color: ${(props) => (props.active ? "rgba(63, 63, 68, 0.8)" : "transparent")};
  font-family: 'XcSemibold';
  font-size: 15px;
  color: ${(props) => (props.active ? "#ffffff" : "#a9a9b3")};
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(63, 63, 68, 0.6);
  }
`

const NoPostsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 200px;
`

const NoPostsMessage = styled.div`
  color: #a9a9b3;
  font-family: 'XcSemibold';
  font-size: 1.1rem;
  text-align: center;
  padding: 2rem;
  background-color: rgba(28, 28, 31, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(63, 63, 68, 0.5);
`
