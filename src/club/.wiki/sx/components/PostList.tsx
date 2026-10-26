import Link from "next/link";
import { formatDate } from "../lb/formatDate";
import type { MDXFrontMatter } from "../lb/types";
import { Prose } from "./Prose";
import { cx, slugify } from "../lb/utils";
import { Tag } from "./Tag";
import styled from "styled-components";
import Cardwiki from '../../container/card.sel';

interface PostListProps {
  posts: Array<MDXFrontMatter>;
}

export const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
   
    <OW>
      {posts.map((post, index) => {
        return (
          <div  key={index}>

            <Cardwiki 
              children={undefined}
              redirect={`/wiki/v/${post.slug}`}
              urlimage={post.image} 
              title={post.title} 
              Tagged={
                <>
                {post.tags ? (
                <ul>
                  {post.tags.map((tag, index) => {
                    return (
                      <div key={index}>
                  <Tag href={`/wiki/category/${slugify(tag)}`}>
                         {tag} 
                      </Tag>
                      </div>
                    );
                  })}
                </ul>
              ) : null}
                </>
              }
              Date={formatDate(post.date)} 
              description={post.description}  />

          </div> 
        );
      })}
    </OW>

  );
};


// STYLED 
  
const OW = styled.div`
  display: flex;
  flex-direction: row; 
  justify-content: center;
  flex-wrap: wrap;
  width: 100%; 
 
`;