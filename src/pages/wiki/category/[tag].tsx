import type { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { getAllMdx } from "@/club/.wiki/sx/lb/mdx";
import { slugify } from "@/club/.wiki/sx/lb/utils";
import { MDXFrontMatter } from "@/club/.wiki/sx/lb/types";
import { Page2 } from "@/club/.wiki/sx/components/Page2";
import { PostList } from "@/club/.wiki/sx/components/list.category";
import styled from "styled-components";
import FooterBv from "@/club/.vision/dashboard/home/header/footer";
import AccountNvxre from "@club/components/account/account.user";
 
 
 
interface ContextProps extends ParsedUrlQuery {
  tag: string;
}

interface PostsProps {
  tag: string;
  posts: Array<MDXFrontMatter>;
}

const Posts: NextPage<PostsProps> = ({ tag, posts }) => {
  return (
    <>
   <AccountNvxre about={tag} navbar='relative'/>
        
    <Container>

      
    <li className="title">
           <i className="fi fi-sr-category" />
           <h2>Categoria {tag}</h2>
           </li>

      <Page2 title={``}>
      <CardX>
        <PostList posts={posts} />    
      </CardX> 
      </Page2>
      
    </Container>
    <FooterBv />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const mdxFiles = getAllMdx().map((post) => post["frontMatter"]);
  return {
    paths: Array.from(new Set(mdxFiles.map((file) => file.tags).flat())).map(
      (tag) => {
        return {
          params: {
            tag: slugify(tag!),
          },
        };
      }
    ),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { tag } = context.params as ContextProps;
  const mdxFiles = getAllMdx().map((post) => post["frontMatter"]);
  return {
    props: {
      tag,
      posts: mdxFiles.filter((file) => {
        return file.tags?.includes(tag);
      }),
    },
  };
};

export default Posts;


const Container = styled.div`
 
  margin: 0 auto;
  place-content: center;
  place-items: center;
  z-index: 999;
  margin-top: 6%;
  border-radius: 19px;
  margin-bottom: 1em;
  display: grid;
  flex-direction: column;
  animation: PageAnim 0.8s linear;
 
  @keyframes PageAnim {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }


  .title{
    text-align: start;
     
    display: inline-flex;
    align-items: center;
    margin-bottom: 0.6em;


    h2{
    padding-left: 0.3em;
    font-family: 'Europa Grotesk';
    background: linear-gradient(47deg, #e65f75 0%, rgb(42, 241, 158) 1%, #2e363d 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    }


    i{
 font-size: 19px;
 color: #464650;
 background-color: rgba(103, 103, 104, 0.062);
 padding: 0.4em 0.5em 0.3em;
 border-radius: 9px;
}
  }


  @media screen  and (max-width: 430px){
      
    .title{
      margin-top: 4em;
      margin-bottom: 0.2em;
    }
       } 
`;


const CardX = styled.div`
   
   width: 90em;
  
`;