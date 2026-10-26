import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import rehypePrism from "rehype-prism-plus";
import { getAllMdx, getMdx } from "@/club/.wiki/sx/lb/mdx";
import { MDXFrontMatter } from "@/club/.wiki/sx/lb//types";
import { Page } from "@/club/.wiki/sx/components/Page";
import { components } from "@/club/.wiki/sx/components/MDX";
import { Prose } from "@/club/.wiki/sx/components/Prose";
import { cx } from "@/club/.wiki/sx/lb/utils";
import remarkGfm from "remark-gfm";
import styled from "styled-components";
import FooterBv from "@/club/.vision/dashboard/home/header/footer";
 import { useState } from "react";
import axios from 'axios';
import AccountNvxre from "@club/components/account/account.user";

interface ContextProps extends ParsedUrlQuery {
  slug: string;
}

interface PostProps {
  frontMatter: MDXFrontMatter;
  mdx: any;
  previous: MDXFrontMatter | null;
}

const Post: NextPage<PostProps> = ({ frontMatter, previous, mdx }) => {

  const [voted, setVoted] = useState(false);

  const handleVote = async (value: boolean) => {
    const webhookUrl = 'https://discord.com/api/webhooks/1247613438126067722/gZvx-Y18_oAz-Tj36hSE7sXNKa5_G3ZoxpT94AMFUCtGPbmx3RgDeaWGdPpMs_pN3C0g';

    try {
      await axios.post(webhookUrl, {
        content: `Wikivision Sobre ${previous?.title} foi útil? Resposta: ${value ? 'Sim' : 'Não'}`,
      });

      // Voto enviado com sucesso
      setVoted(true);
    } catch (error) {
      // Lidar com erros no envio do voto
      console.error('Erro ao enviar o voto', error);
    }
  };


  return (
    <> 
   <AccountNvxre about={previous?.title}  navbar='relative'/>
        
      <Page {...frontMatter}>
        <Prose>
          <MDXRemote {...mdx} components={components} />
        </Prose>
       
      </Page>

      {!voted && (
        <Cardutton>
          <p>Gostou do artigo?</p>
          <button onClick={() => handleVote(true)}>😁</button>
          <button onClick={() => handleVote(false)}>😞</button>
        </Cardutton>
      )}

      {voted && (
        <Cardutton>
        <p>Obrigado pelo seu feedback!</p>
        </Cardutton>
      )}


      <FooterBv />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const mdxFiles = getAllMdx();
  return {
    paths: mdxFiles.map((file) => ({
      params: { slug: file.frontMatter.slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as ContextProps;
  const mdxFiles = getAllMdx();
  const postIndex = mdxFiles.findIndex((p) => p.frontMatter.slug === slug);
  const post = mdxFiles[postIndex];
  const { frontMatter, content } = post;
  const mdxContent = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrism],
    },
    scope: frontMatter,
  });
  return {
    props: {
      frontMatter,
      mdx: mdxContent,
      previous: mdxFiles[postIndex + 1]?.frontMatter || null,
      next: mdxFiles[postIndex - 1]?.frontMatter || null,
    },
  };
};

export default Post;



const Cardutton = styled.div`
  
  background-color: rgba(99, 103, 107, 0.014);
  padding: 2em 2em 2em;
  margin: 2em;
  text-align: center;
  border-radius: 5px;
  

  button{
     height: 2em;
     font-size: 44px;
     transition: all 1s;
  }

  button:hover{
    transform: rotate(44deg);
  }
`;
