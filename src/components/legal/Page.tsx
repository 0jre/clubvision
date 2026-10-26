import { Prose } from "@club/resources/posts/Prose";
import { cx } from "@/hooks/.config/Articles/utils";
import styled from "styled-components";
import {  Accountcenter } from "@/styles/Globalstyleview";
import moment from 'moment-timezone';

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
  thumbnail,
  children,
}) => {
  return (
       <>
   <Accountcenter />
    <Container>
    <CardX>
      <header
        className={cx(
          "mb-8 pb-8 border-b",
          "border-gray-200",
          "dark:border-gray-700"
        )}
      >
       
     
       <h1 className="font-bold text-3xl title">{title}</h1>
      
        
      </header>
      {date ? (
          <time
            className={cx("block mb-2", "text-gray-500", "dark:text-gray-400")}
          >
       <p className='graffiti'>Atualizado em :  {moment(date).format('LL')} </p>
   
          </time>  
        ) : null}
       {children}
      </CardX> 
     </Container>
    </>
  );
};




// STYLED 


const Container = styled.div`
 
   
  display: flex; 
  justify-content: center;
  flex-direction: column;
  margin-top: 2em;
  margin-bottom: 2em;
   
 

  .graffiti{
    font-family: 'Poppins';
    font-weight: 800;
    font-size: 12px; 
  text-align: center;
    color: rgba(142, 155, 148, 0.884);
  }

  P{
    font-size: 12px;
    max-width: 670px;
    margin-bottom: 1em;    
    color: #8d9993;
  }


  li{

    color: #8d9993;
  }
  

`;


const CardX = styled.div`
 
  animation-name: loadre34;
  display: flex; 
  justify-content: center;
  align-items: center;
  flex-direction: column;
   
   animation-duration: 1s;
   animation-iteration-count: all ;

    @keyframes loadre34 {
  from { 
    margin-top: 49em;
 } 
}
   
   .title{
  
     text-align: center;
     margin: 5%;
  
   }
  h1,h2{
    font-family: 'VUltra';

    color: rgb(186, 197, 189);
  }
   
   h1{
    text-align: center;
   }


   @media screen and (max-width: 560px){
    display: flex; 
    flex-flow: wrap;
   flex-direction: column;
   }
`;

