import Image from "next/image";
import styled from "styled-components";
import Logo from '@/public/nvrp/20221001_185012.png'
import React from "react";

interface GlobNvxreC {
  ImageC: React.ReactNode;
  description: React.ReactNode;
  AvatarUser: React.ReactNode;
  RightO?: React.ReactNode;
  CommentUser: React.ReactNode;
  ButtonComment?: React.ReactNode;
  ButtonClickLike?: React.ReactNode;

  ButtonRedirectLik? : React.ReactNode;
}

export default function CardVisionPostVideo ( { ImageC, ButtonClickLike, ButtonComment, description, CommentUser, AvatarUser,RightO,ButtonRedirectLik } : GlobNvxreC) {
    return(
        <>
         <CardPostVision>
          <TopIn> 
          <li>
          {AvatarUser}
          </li>
          <ul>
            {RightO}    
            <CardButton>          
              {ButtonClickLike}
            </CardButton>
          </ul> 
          </TopIn>
          <ContentVC>
          <h6>{description}</h6>
          </ContentVC>
           {ImageC}   
          <ContentVC>
  
            {ButtonComment}
            
            {CommentUser}
 
          </ContentVC>
          {ButtonRedirectLik}
        </CardPostVision>
       
        </>
    )
}

// STYLED 

const TopIn = styled.div`
   display: flex;
   align-items: center;
   flex-direction: row;
   justify-content: space-between;
   padding: 0.3em 0.9em 0em;
   
   .logouser{
    border-radius: 50%;
    border: 3px solid rgb(35, 35, 37);
   }
   
   li{
    display: flex;
    align-items: center;
   }

   h3{
    margin-left: 0.4em;
    font-family: 'Poppins', sans-serif;
    color: #c1c4c7;
   }
   

   button{
    padding: 8px 10px 6px;
  background-color: rgba(51, 54, 53, 0.158);
  border-radius: 50%;
  color: #494744;
  
  margin:0.3em;


  &:hover{
    color: #c0bdb8;
  }
   }
 

  
   `;
const CardPostVision = styled.section`
    margin: 0.4em;
    background: linear-gradient(287deg, rgba(15,22,15,1) 0%, rgba(0,0,0,1) 67%);

   
  padding: 0.8em 0em 0.1em;
  border-radius: 22px;
  width: 380px;
 

  .borderradius4{
    border-radius: 24px;
  }

  .borderradius1{
    border-radius: 19px;
  }
`;

const CardButton = styled.div`
   
   
   .activeHomejd{
    display: none;
   }
    
   span{
    display: flex;
    align-items: center;
    background-color: rgb(25, 255, 121);
    border-radius: 100px;
    padding: 6px 2px  2px;
    height: 30px;
    width: 30px;
    margin: 0.2em;
    cursor: pointer;


    h5{
      font-family: 'Inter', monospace;
      font-weight: 100;
      font-size: 13px;
      margin-top: -0.2em;
     }

     i{
        margin: 0.3em;
        color: #000000;
        font-size: 16px;
     }
   }

   li{
    display: flex;
    align-items: center;
    padding: 2px 13px 0px;
    margin: 0.2em;
    
    .opacitu{
      opacity: 0.1;
    }
     i{
        margin: 0.3em;
        color: #696b6d;
        font-size: 14px;
     }
   }
`;

const ContentVC = styled.div`
 padding: 0.4em;
 
 
  h6{
   font-family: 'Inter', monospace;
   font-size: 12px;
   font-weight: 200; 
   color: #8d8d94;
   text-align: start;
   max-width: 380px;
   word-wrap: break-word;
   overflow-wrap: break-word; 
   overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  }

  h3{
   font-family: 'Inter', monospace;
   font-size: 18px;
   font-weight: 200; 
   color: #8d8d94;
   text-align: start;
   max-width: 400px;
  }

  p{
   font-size: 12px;
   color: #525257;
   text-align: start;
  }

  a{
    color: rgb(245, 115, 121);
  }

  @media screen and (max-width: 430px){
    h3, h6{
      width: 280px;
      overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
    }
  }

  
`;
