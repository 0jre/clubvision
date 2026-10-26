import React from "react";
import HeadGlobal from "@/club/head/glob.n";
import Wikivision from '../../club/.wiki/view/home.page';
import { GlobalWiki } from "@/styles/Globalstyleview";
import type { GetStaticProps, NextPage } from "next";
import {  getAllMdx,getLatestMdx } from "@/club/.wiki/sx/lb/mdx";
import { MDXFrontMatter } from "@/club/.wiki/sx/lb/types";
import { PostList } from "@/club/.wiki/sx/components/PostList";
import CardCarousel from "@/admin/components/ac/carousel";
import styled from "styled-components";

interface PostsProps {
    posts: Array<MDXFrontMatter>;
    latestMdx: MDXFrontMatter;
  }

interface Thumb {
    thumbnail: React.ReactNode; 
  }


export default function Wiki({posts,latestMdx} : PostsProps){
 
    return(
        <>
       <HeadGlobal Title={'Wikivision '} />
       <GlobalWiki/>
        <Wikivision 
        Announce={
          <Anim>

          <CardCarousel 
          Descriptions={latestMdx.description} 
          Title={latestMdx.title} 
          About={"WIKIVISION"} 
          Redirect={`/wiki/v/${latestMdx.redirect}`} 
          thumbnail={
            <>
  <Content thumbnail={latestMdx.image} className="none"/>   
            </>
          } />
          </Anim>
        }>
       <PostList posts={posts} />
        </Wikivision>
        </>
    )
}


export const getStaticProps: GetStaticProps = async () => {
    const mdxFiles = getAllMdx().map((post) => post["frontMatter"]);
    const latestMdx = getLatestMdx();
    return {
      props: {
        posts: mdxFiles,
        latestMdx: latestMdx ? latestMdx.frontMatter : null,
      },
    };
  };
  

 ///


 
const Content = styled.div<Thumb>`

background-image: ${({ thumbnail }) => `url('${thumbnail}')`};
background-color: rgb(8, 8, 17);;
background-size: cover;
background-repeat: no-repeat;
padding: 1em 2em 1em;
border-radius: 2em; 
height: 70vh;
width: 70%;
margin: 0.3em;
transition: 1s all; 

&:hover{
  border-radius: 19px; 

}

 @media screen and (max-width: 430px) {
  height: 30vh;
  width: 100%;
  border-radius: 11px; 
 }
`;



const Anim = styled.div`
 animation: PageAnim 0.8s linear;

@keyframes PageAnim {
  0%{ opacity: 0;}
  100%{ opacity: 1;}
}
  

@media screen and (max-width: 430px) {
   
  &:hover{
    .none{
     display: none;
  }
  }
 }
 
`;
