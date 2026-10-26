import React from "react";
import styled from "styled-components";
 
interface CardInfoProps { 
    Title: React.ReactNode;
    Description: React.ReactNode;
    children: React.ReactNode;
    ImageProp: string;
    MsButton?: React.ReactNode;
    descriptionbottom: React.ReactNode;
}

export default function CardPrimeInfo ( { Description,Title,children,ImageProp,MsButton,descriptionbottom } : CardInfoProps ) {
    return (
        <>
        <CardInfo ImageProp={ImageProp}>
            <Contentuser>
            <MarginTitle>
            <h3>{Title}</h3>
            <p>{Description}</p>
            </MarginTitle>

            <Overflow >
            {children}
            </Overflow>
     
           <MarginButton>
             {MsButton}
           </MarginButton>

              <li className="li"> 
                <h6> 
                  {descriptionbottom}
                </h6>
              </li>
            </Contentuser>
        </CardInfo>
        </>
    )
}


/// sty


 
const MarginButton = styled.div`
    display: flex;
   flex-direction: column;
   align-items: center; 
   justify-content: center;
   padding: 1em 0 0;

   .xcnjd{
    margin-bottom: 3em;
    }

  


  button{
    border-radius: 13px;
    background: url(/icons/button/button-bg.svg) center center / contain no-repeat;
    color: rgb(31, 226, 96);
    margin-bottom: 3em;
    display: none;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.1em 0.3em 0.1em;
    transition: ease .2s;
     
    text-decoration: unset;
   transition: 1s all;
   align-items: center;
  

   .i{
    transition: 1s all;
      color: #d3d3da;
        font-size: 19px;
        margin-left: 0.4em;
        border-radius: 9px;
        height: 33px;
        width: 33px;
        padding: 6px 0.3em 0.2em;
    }

   h4{
    font-size: 12px;
    font-family: 'Inter', monospace;
    color: #e4dbdb;
    font-weight: 900;
    padding-left: 0.7em;
   }
  
   &:hover{
     
     h4{
      color: white;
     }
     
     i{
      color: #080808;
      
     }
   }

 
  }
`;

interface ImagePropA {
  ImageProp: string;
}

const Overflow = styled.div`
  
  padding: 0.5em 0 0.4em;


  svg{
    min-width: 20px;
    width: 20px;
    display: block;
    height: 20px;
    color: rgb(61, 61, 61);
  }

  &:hover{
    height: 100%;
  }


  @media screen and (max-width: 430px) {
    height: 100%;
 
   }
`;

const MarginTitle = styled.div`
   border-bottom: 1px solid #6262693d;
   padding: 0em 1em 1em; 
   margin-top: 0;
   margin: 1em;
   display: flex;
   flex-direction: column;
   align-items: center;
   text-align: center;
`;

const CardInfo = styled.div<ImagePropA>`
  width:  340px;
  height: 40%;
  background-image: ${({ ImageProp }) => `url('${ImageProp}')`};
  background-size:cover;
  background-repeat: no-repeat;
  border-radius: 12px;
  margin: 0.5em;
  margin-bottom: 0.5em;
 

   @keyframes Buttonmso {
    0%{
      opacity: (0);
    }

    100%{
      opacity: (1);
    }
   }


   @media screen and (max-width: 490px) {
    margin: 0em;
    margin-bottom: 0.5em;
   }
`;


const Contentuser = styled.ul`
    padding: 1em 0em 1em;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(24px);
    background-color: rgba(7, 6, 6, 0.486);
    border-radius: 12px; 

   h3{
     
 
    font-weight: 400;
   
    text-transform: capitalize;
    color: rgb(225, 229, 238);
    font-size: 64px;
    font-family: 'Graffiti', sans-serif;
   }
 

   h5{
    font-weight: 500;
    color: #e1e1e9;
    margin: 0;
    font-size: 13px;
    font-family: 'ProximaNova-Italic', sans-serif;
   
   }
 
    h6{
      color: #141416;
      font-size: 11px;
    }

   p{
    font-family: 'ProximaNova-';
    
    font-weight: 200;
    text-align: start;
  
    display: block;
     
    margin-top: 9px;
    font-size: 0.74rem;
    line-height: 1.15rem;
    letter-spacing: 1.15em;
    background: linear-gradient(rgb(213, 213, 213) 0%, rgb(106, 106, 106) 100%) text;
    -webkit-text-fill-color: transparent;
   }

   ul{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1em;

    
   }
   .li{
      position: absolute;
      bottom: 8px;
    }


    

    @media screen and (max-width: 430px) {
 
    .locks{
      margin-bottom: 3em;
    }
   }
`;
