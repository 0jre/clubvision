import { onlyText } from "react-children-utilities";
import { formatDate } from "../lb/formatDate";
import { Prose } from "./Prose";
import { cx } from "../lb/utils";
import styled from "styled-components";
import { GlobalWiki } from '@/styles/Globalstyleview';
import HeadGlobal from '@/club/head/glob.n';
import Createinfo from '../../container/card.creat';
import HeaderwIK from '../../container/header.opo';


interface PageProps {
  date?: string;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  image?: string;
  children?: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({
  date,
  title,
  image,
  description,
  children,
}) => {
 
  return (
       <>
  <GlobalWiki />
  <HeadGlobal Title={`Wikivision - ${title}`}/>

   <Container>
    <CardX>   
       
       
         <HeaderwIK Title={title} thumb={image} />

        <Createinfo />
      
     <Margin>
        {date ? (
          <Margintime>
       {formatDate(date)}
          </Margintime>  
        ) : null}
 
       
{description ? (
          <div className="mt-4">
            <Prose>
              {typeof description === "string" ? (
                <p className="description P">{description}</p>
              ) : (
              description 
              )}
            </Prose>
          </div>
        ) : null}
          
        </Margin>
       
       {children}  
 
       
      </CardX> 
      </Container>
    </>
  );
};




// STYLED 

 
const Margintime = styled.div`
  width: 120px;
`;

const Margin = styled.div`
 display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 0.8em 1em 0.8em;

  @media screen and (max-width: 430px) {
    flex-direction: column;
    margin-top: 1em;
   }
`;

const Container = styled.div`
    display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: 2%;
  margin-bottom: 2%;
  li{
    margin-bottom: 2.9em;
  } 

  .ss{
     margin-top: -40.6em;
     margin-right: -34em;
  }


  .nvcs{
     background-color: black;
     padding: 5px 8px 5px;
     border-radius: 12px;
  }
  

  P{
    font-size: 12px;
    max-width: 55em;
    color: #99999e;
  }


`;


const CardX = styled.div`

  margin-bottom: 0.9em;
  animation-name: loadre34;
   animation-duration: 2s;
   animation-iteration-count: all ;
   width: 80vw;
   display: flex; 
   flex-direction: column;
   align-items: center;
   justify-content: center;

    @keyframes loadre34 {
  from { 
    opacity: calc(2px);
    filter: blur(12px);
    margin-top: 49em;
 } 
}
  .description{
    
    padding: 0.8em 1em 0.8em;
   margin: 1em;
   max-width: 670px;
   text-align: start;
   font-size: 15px; 
    font-family: 'ProximaNova-Italic', monospace;
    color: #afb1bd;

    font-weight: 300;
   margin-bottom: 1em;
  }
  .title{
    text-align: center;
  }

  .image{
    max-width: 640px;
    width: 100%;
    border-radius: 7px;
    max-height: 340px;
  }



  h1,h2,h3,h4,h5,h6,p{
    color: #afb1bd;
  }

  h1,h2,h3{
    font-family: 'Europa Grotesk';
  }

  a{
    color: #e23838;
  }

  p{
    font-size: 15px; 
    font-family: 'ProximaNova-Italic', monospace;
  }


  @media screen and (max-width: 430px) {
 
     .title{
      font-size: 14px;
     }
   }
   
`;

