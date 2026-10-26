import Link from "next/link";
import { formatDate } from "@/hooks/.config/Articles/formatDate";
import type { MDXFrontMatter } from "@/hooks/.config/Articles/types";
import { Prose } from "../../resources/posts/Prose";
import styled from "styled-components";
import { useState } from 'react';

interface PostListProps {
  posts: Array<MDXFrontMatter>;
}

export const PostList: React.FC<PostListProps> = ({ posts }) => {
  const [numArtigosVisiveis, setNumArtigosVisiveis] = useState(6);

  const exibirMaisArtigos = () => {
    setNumArtigosVisiveis(numArtigosVisiveis + 6);
  };
  return (  
    <>
    <ListStyled>
    {posts.slice(0, numArtigosVisiveis).map((post, index) => {
        return (  
          <>
          <Link href={`/articles/${post.slug}`}>  
          <article>
           <img src={post.image} 
           alt={post.date} className="ImagePost"/>

            <time>
            Postado em:  {formatDate(post.date)} 
            </time>                   
            <h2>{post.title}</h2>
              {post.description ? (
                <div>
               
                  <Prose> 
                  <p>{post.description}</p>    
                  </Prose>
                </div>
              ) : null}               
            </article>    
            </Link> 
            </> 
        );  
      })}
    </ListStyled>
    {numArtigosVisiveis < posts.length && (
        <Button onClick={exibirMaisArtigos}>
          Mais Artigos
        </Button>
      )}
    </>
  );
};


// STYLED 

const Button = styled.button`
  
  background-color: rgba(29, 247, 76, 0.877);
  padding: 0.8em 2em 0.8em;
  border-radius: 22px;
  font-family: 'Poppins', sans-serif;
  color: #d4dbe0;
  float: right;
  margin-right: 2em;
 
 
  :hover{
    background-color: rgba(255, 40, 58, 0.836);
  }
`;




const ListStyled = styled.div`
   
   
   display: flex;
   justify-content: center;
    
   flex-wrap: wrap;

  article{
  padding: 0.7em 1em 0em;
  display: flex;
  flex-direction: column;
  max-width: 23em;
  border-radius: 22px;
  transition: all 2s;
  margin-bottom: 0.9em;
  float: left;
  margin: 0.2em;

  :hover{
     background-color: rgba(105, 108, 122, 0.137);
  }
  }
 
  time{
     margin: 1em;
     font-size: 13px;
  } 

  li{
    display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 0.7em;
  }
  
  a{
    color: #696c7a;
    transition: all 1s;
    border-radius: 8px;
    margin-bottom: 1em;
  }

  .ImagePost{
      max-width: 500px;
      max-height: 150px;
      border-radius: 9px;
  }

  h2{
    color: #5d7fdb;
    text-align: center;
    overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  }

  p{
    
  
    border-radius: 9px;
 
    overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  }
`;