"use client"

import type React from "react"
import type { MDXFrontMatter } from "@/club/.wiki/sx/lb/types"
import styled from "styled-components"
import { useRouter } from "next/router"

interface PostListProps {
  posts: Array<MDXFrontMatter>
  category?: string
}

// Versão aprimorada do seu componente com filtros por categoria
export const PostListUpgrade: React.FC<PostListProps> = ({ posts, category = "Tudo" }) => {
  const router = useRouter()

  // Função para filtrar posts
  const getFilteredPosts = () => {
    // Primeiro filtra por posts que têm a tag 'Upgrades'
    let filteredPosts = posts.filter((post) => post.tags && post.tags.includes("Upgrades"))

    // Se não for "Tudo", filtra por categoria específica
    if (category !== "Tudo") {
      filteredPosts = filteredPosts.filter((post) => {
        return (
          post.category?.toLowerCase() === category.toLowerCase() ||
          (post.tags && post.tags.some((tag) => tag.toLowerCase() === category.toLowerCase()))
        )
      })
    }

    return filteredPosts
  }

  const filteredPosts = getFilteredPosts()

  // Se não há posts, mostra mensagem
  if (filteredPosts.length === 0) {
    return (
      <NoPostsContainer>
        <NoPostsMessage>
          {category === "Tudo"
            ? "Nenhuma atualização encontrada."
            : `Nenhuma atualização encontrada para "${category}".`}
        </NoPostsMessage>
      </NoPostsContainer>
    )
  }

  return (
    <OW>
      {filteredPosts.map((post, index) => {
        return (
          <div key={index}>
            <CardView onClick={() => router.push(`/wiki/v/${post.slug}`)} bannerUrl={post.background}>
              <li>
              
                <h3>{post.title}</h3>
                   <PostMeta>
                  {post.date && <DateInfo>{new Date(post.date).toLocaleDateString("pt-BR")}</DateInfo>}
                </PostMeta>
              </li>
            </CardView>
          </div>
        )
      })}
    </OW>
  )
}

// Styled components (mantendo seu estilo original + melhorias)
const OW = styled.div`
  display: flex;
  flex-direction: row; 
  justify-content: left;
  flex-wrap: wrap;
  width: 100%; 
`

interface ViewHeaderProps {
  bannerUrl: string
}

const CardView = styled.button<ViewHeaderProps>`
  height: 230px;
  width: 380px;
  padding: 0.4em 1em 0.4em;
  margin: 0.4em;
  background-image: linear-gradient(to bottom, transparent, transparent 10%, rgba(0, 0, 0, 0.932)),  ${({ bannerUrl }) => `url('${bannerUrl}')`};
  border: 2px solid #262726;
  background-position: center;
  background-size: cover;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  transition: 1s all;

  li {
    width: 100%;
     position:absolute;
     bottom: 3%;
    list-style: none;
    padding: 9px;
  }
  
  h3 {
    font-family: 'XcSemibold';
    color: #c7c9d1;
    margin: 0 0 0.5rem 0;
     
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
  }

  &:hover {
    border: 2px solid white;
    transform: translateY(-5px);
  }
 
  @media screen and (max-width: 680px) {
  width: 100%;
  min-width: 330px;
  max-width: 680px;
   margin: 0;
   height: 300px;
}


` 

const PostMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const CategoryTag = styled.span`
  background-color: rgba(24, 26, 25, 0.76);
  color: #35a367;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 300;
  font-family: 'XcSemibold';
  width: fit-content;
`

const DateInfo = styled.span`
  color: #a9a9b3;
  font-size: 0.8rem;
  font-family: 'XcSemibold';
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
