import React from "react";
import styled from "styled-components";

interface PropsS {
    Thumbnail: string;
    Title: React.ReactNode;
    Description?: React.ReactNode;
    Avatar: string;
    Username: React.ReactNode;
    XBVC: React.ReactNode;
    ButtonComment?: React.ReactNode;
    onWatchClick?: () => void
}

export default function VideoCardX({ onWatchClick, Thumbnail, Title, ButtonComment, XBVC ,Description, Avatar, Username }: PropsS) {

    return(
     <>
     <Listedcard onClick={onWatchClick}>
        <Content>
        <img
            src={Thumbnail}
            alt="video the novision"
            className='videoinf'
            height={200}
            width={380}
          />
          <Margin>  
              <img src={Avatar} alt="avatar" style={{width: "40px", height: "40px", borderRadius: "50%"}} />
                <li>
                <h1>{Title}</h1>
                <h4>{Username}</h4> 
                </li>
          </Margin>
          <MarginCOMMENT>
          {ButtonComment}
          </MarginCOMMENT>

         <ContentVC>
         {XBVC} 
         </ContentVC>
         
        </Content>
       
      </Listedcard> 
     </>
    )
}

//// 



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

const MarginCOMMENT = styled.div`
 margin: 0.5em;
`;

const Margin = styled.div`
   display: flex;
   align-items: top;
    flex-direction: row; 

    img{
        margin: 0%.8em;
    }

  li{
    display: flex;
    flex-direction: column;
    
    align-items: left;
    text-align: left;
  }
`;


const Content = styled.ul`
 
  .videoinf {
    transition: 1s all;
    border-radius: 12px;
    border: 1px solid #2f3130;
  }

  h1 {
    font-size: 14px;
    font-family: 'Poppins', sans-serif;
    overflow: hidden;
    width: 280px;
    color: #dae2e0;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  }


   h4{
    font-size: 13px;
    font-family: 'ProximaNova-Italic', monospace;
    color: #65656d;
    font-weight: 500;
   }
`;

const Listedcard = styled.div`
  margin: 0.1em;
  margin-bottom: 1em;
  background: radial-gradient(circle, #080808 0%, #0d0d0e 100%);
  padding: 0%.5em 0%.5em 1em;
  border-radius: 22px;
  cursor: var(--f-cursor-pointer);
   
  div{
    text-align: left;
  }
  &:hover {
  
    .videoinf{
      opacity: 0.5;
      box-shadow: 2px 8px 12px rgba(221, 221, 221, 0.075);
    }
  }
`;
