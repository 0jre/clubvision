import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import rehypePrism from "rehype-prism-plus";
import { getAllMdx } from "@/hooks/.config/Articles/mdxArticle";
import { MDXFrontMatter } from "@/hooks/.config/Articles/types";
import { Page } from "@club/components/articles/Page";
import { components } from "@club/resources/posts/MDX";
import { Prose } from "@club/resources/posts/Prose";
import { cx } from "@/hooks/.config/Articles/utils";
import remarkGfm from "remark-gfm";
import styled from "styled-components";
import { useState } from 'react';
import axios from 'axios';
import { Accountcenter } from "@/styles/Globalstyleview";
import HeadGlobal from "@/club/head/glob.n";
import AccountNvxre from "@club/components/account/account.user";
import FooterBv from '../../club/.vision/dashboard/home/header/footer';
import { AttachCircle } from "iconsax-react";

interface ContextProps extends ParsedUrlQuery {
  slug: string;
}

interface PostProps {
  frontMatter: MDXFrontMatter;
  mdx: any;
  previous: MDXFrontMatter | null;
  next: MDXFrontMatter | null;
}

const Post: NextPage<PostProps> = ({ frontMatter, mdx, previous, next }) => {

  const [voted, setVoted] = useState(false);

  const handleVote = async (value: boolean) => {
    const webhookUrl = 'https://discord.com/api/webhooks/1234870805481918525/nGFNXENPeN-ASXYkGBcPjklsHuwj2pcAZCL-45CGv6E_KkJiZp54D7qT-zAUJQifYCt_';

    try {
      await axios.post(webhookUrl, {
        content: `Artigo sobre ${previous?.title} foi útil? Resposta: ${value ? 'Sim' : 'Não'}`,
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
<AccountNvxre about={
          <>
          <h3>{previous?.title}</h3>
          </>
        }/>
 
<HeadGlobal Title={"novision"} />
         <Accountcenter />
       
     <MarginCenter>
      <Page {...frontMatter}>
        <Prose>
          <MDXRemote {...mdx} components={components} />
        </Prose>
        {previous || next ? (
          <nav
            className={cx(
              "mt-8 pt-8 grid grid-cols-2 gap-8 border-t",
              "border-gray-200",
              "dark:border-gray-700"
            )}
          >
            {previous ? (
              <div>
              <Link href={`./${previous?.slug}`} className="font-bold">
                <Details>
                <p
                  className={cx(
                    "mb-2 uppercase tracking-wider text-sm",
                    "text-gray-500",
                    "dark:text-gray-400"
                  )}
                >  
                 {previous?.title}
                  </p>
                </Details>
                 </Link>
              </div>
            ) : null}
            {next ? (
              <div className="col-start-2 text-right">
                 <Link href={`./${next?.slug}`} className="font-bold">
                <Details>
                <p
                  className={cx(
                    "mb-2 uppercase tracking-wider text-sm",
                    "text-gray-500",
                    "dark:text-gray-400"
                  )}
                >
                  {next?.title}
                </p>
                </Details>
                </Link>
              </div>
            ) : null}
          </nav>
        ) : null}
      </Page>
      </MarginCenter>

      {!voted && (
        <Cardutton>
          <p>Esse artigo foi útil?</p>
          <button onClick={() => handleVote(true)}>😁</button>
          <button onClick={() => handleVote(false)}>😞</button>
        </Cardutton>
      )}

      {voted && (
        <Cardutton>
        <p>Obrigado pelo seu feedback!</p>
        </Cardutton>
      )}

<FooterBv/>
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



// STYLED 

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


const MarginCenter = styled.div`
  
  margin: 0 auto;
  max-width: 1900px;
  justify-content: center;
  display: flex;
  padding: 2em 1em 0em;
  flex-direction: row;
  flex-wrap: wrap;

`;

const Details = styled.div`

 color: #747580;
 text-align: center;
 
 p{
  padding: 4px 1em 4px;
  border-radius: 6px;
  background-color: rgba(162, 164, 172, 0.048);
  margin-bottom: 22px;
  margin: 0.3em;
  border: 1px solid rgba(255, 255, 255, 0.048);
  
  :hover{
    border: 1px solid rgba(255, 255, 255, 0.096);
  }
 } 


`;

