import styled from "styled-components";
import React from "react";

interface GlobNvxreC {
  ImageC: React.ReactNode;
  description: React.ReactNode;
  AvatarUser: React.ReactNode;
  RightO?: React.ReactNode;
  CommentUser: React.ReactNode;
  ButtonComment?: React.ReactNode;
  ButtonClickLike?: React.ReactNode;
  onPhotoClick?: () => void
}

export default function CardVisionPostpAG ( { onPhotoClick, ImageC, ButtonClickLike, ButtonComment, description, CommentUser, AvatarUser,RightO } : GlobNvxreC) {
    return(
        <>
 
        <CardPostVision onClick={onPhotoClick}>
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
    max-width: 120px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
    
   }
   

   button{
    padding: 9px;
  background-color: transparent;
  border-radius: 92px;
  color: #494744;
  

  &:hover{
    color: #c0bdb8;
  }
   }
 
   `;
const CardPostVision = styled.section`
    margin: 0.4em;
    background: radial-gradient(circle, #080808 0%, #0d0d0e 100%);
  padding: 0.8em 0.4em 0em;
  border-radius: 22px;
  position: relative;
  cursor: var(--f-cursor-pointer);
  .borderradius4{
    border-radius: 24px;
  }

  .borderradius1{
    border-radius: 19px;
  }


  @media screen and (max-width: 360px) and (max-width: 390px) {
    margin:0;
    
    margin-bottom: 4px;
    .novisionImage{
       height: 199px;
       width: 350px;
    }
  }


  @media screen and (max-width: 530px) {
    margin: 0em;
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
   max-width: 350px;
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
`;
