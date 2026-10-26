import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import rehypePrism from "rehype-prism-plus";
import { getAllMdx } from "@/hooks/.config/Articles/mdx";
import { MDXFrontMatter } from "@/hooks/.config/Articles/types";
import { Page } from "@club/components/legal/Page";
import { components } from "@club/resources/posts/MDX";
import { Prose } from "@club/resources/posts/Prose";
import remarkGfm from "remark-gfm";
import styled from "styled-components";
import { Accountcenter } from "@/styles/Globalstyleview";
import HeadGlobal from '@/club/head/glob.n';
import AccountNvxre from "@club/components/account/account.user";
import FooterBv from "@/club/.vision/dashboard/home/header/footer";
import { Book } from "iconsax-react";

interface ContextProps extends ParsedUrlQuery {
  slug: string;
}

interface PostProps {
  frontMatter: MDXFrontMatter;
  mdx: any;
  previous: MDXFrontMatter | null;
}

const Post: NextPage<PostProps> = ({ frontMatter,previous, mdx }) => {
  return (
    <> 
        
         <HeadGlobal Title={"@TheNoVision"} />
         <AccountNvxre about={previous?.title}/>
     <MarginCenter>
      <Page {...frontMatter}>
        <Prose>
          <MDXRemote {...mdx} components={components} />
        </Prose>
      </Page>
            <FooterBv />
      </MarginCenter>  
     
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


const MarginCenter = styled.div`
  
  margin: 0 auto;
  max-width: 1200px;
  justify-content: center;
  display: flex;
  margin-top: 1%;
  padding: 2em 0em 0em;
  flex-direction: row;
  flex-wrap: wrap;

  border-radius: 0px 0px 32px 32px;
`;