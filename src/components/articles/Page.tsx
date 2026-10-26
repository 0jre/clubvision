import { onlyText } from "react-children-utilities";
import { formatDate } from "@/hooks/.config/Articles/formatDate";
import { Prose } from "../../resources/posts/Prose";
import { cx } from "@/hooks/.config/Articles/utils";
import styled from "styled-components";

interface PageProps {
  date?: string;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  thumbnail?: string;
  children?: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({
  date,
  title,
  description,
  children,
}) => {
  const metaTitle = onlyText(title);
  return (
       <>

    <CardX>   
      <header
        className={cx(
          "mb-8 pb-8 border-b",
          "border-gray-200",
          "dark:border-gray-700"
        )}
      >
      
        {date ? (
          <time
            className={cx("block mb-2", "text-gray-500", "dark:text-gray-400", "nvcs")}
          >
       {formatDate(date)}
          </time>  
        ) : null}
        <h1 className="title">{title}</h1>
        {description ? (
          <div className="mt-4">
            <Prose>
              {typeof description === "string" ? (
                <p className="description">{description}</p>
              ) : (
              description 
              )}
            </Prose>
          </div>
        ) : null}
      </header>
       <li>
       </li>
       
       {children}
      </CardX> 
   
    </>
  );
};




// STYLED 


const CardX = styled.div`
   
  margin-top: 5em;
  overflow-y: auto;
  margin-bottom: 0.9em;
  animation-name: loadre34;
   animation-duration: 2s;
   animation-iteration-count: all ;


    @keyframes loadre34 {
  from { 
    opacity: calc(2px);
    filter: blur(12px);
    margin-top: 49em;
 } 
}
  .description{
    background-color: rgba(67, 73, 78, 0.11);
    padding: 0.8em 1em 0.8em;
   border-radius: 9px;
   margin: 1em;
   max-width: 53em;
   text-align: center;
    color: #828388c5;
    font-size: 13px;
   margin-bottom: 1em;
  }
  .title{
    text-align: center;
  }

  img{
    max-width: 640px;
    width: 100%;
    border-radius: 7px;
    max-height: 340px;
  }
`;

