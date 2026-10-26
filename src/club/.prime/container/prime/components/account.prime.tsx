import React from "react";
import styled from "styled-components";
 
interface CardInfoProps { 
    Title: React.ReactNode;
    Description: React.ReactNode;
    children: React.ReactNode;
    ImageProp: string;
    click?: () => void;
}

export default function Accountprime ( { click, Description,Title,children,ImageProp} : CardInfoProps ) {
    return (
        <>
        <CardInfo ImageProp={ImageProp} onClick={click}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none" viewBox="0 0 342 654"  className="sc-ca534a9a-3 Grsjg"><path fill="currentColor" fill-rule="evenodd" d="M3.806 34.694c-.023 2.271-.046 4.559-.073 6.846-.347.258-.672.516-.981.761-.405.321-.784.621-1.151.874-1.066.743-1.637 5.053-1.6 13.523q.08 17.31.154 34.642c.15 34.273.3 68.588.513 102.82.171 29.572.582 112.57.64 142.292.03 13.534-.103 27.067-.236 40.601-.116 11.729-.231 23.459-.24 35.188-.038 57.511-.038 115.17.133 172.681.038 15.901.552 31.951 1.123 47.406.549 15.058 1.317 20.434 2.912 21.28v-15.179c-.694-1.783-1.101-7.032-1.313-16.801-.514-24.223-.819-48.743-1.047-73.263-.143-16.275-.157-32.633-.171-49.012q-.006-8.186-.02-16.375c0-4.359.034-8.718.068-13.077q.026-3.27.047-6.539c.272 15.265.42 30.731.57 46.191.296 30.819.592 61.617 1.866 90.757V495.478a42889 42889 0 0 1-1.522-155.906c-.14-17.01.058-34.179.257-51.333.072-6.225.144-12.448.2-18.66.172-18.914.373-50.026.578-81.646.164-25.492.331-51.314.487-71.343V13.696c-.711 1.635-1.04 6.187-1.115 13.727-.03 2.39-.054 4.821-.079 7.27M234.574 9h102.093v8.191c1.244 2.628 1.985 9.11 2.334 21.452.514 18.13.933 36.855.952 55.282.033 38.379-.12 76.758-.273 115.137l-.069 17.718c-.153 35.814-.4 71.48-.762 107.294-.076-7.579-.157-15.121-.238-22.663s-.162-15.083-.238-22.662c-.116-11.03-.223-22.068-.33-33.105-.35-36.098-.7-72.187-1.376-107.935v159.432c.593 66.538.911 133.225 1.021 200.06.057 35.368.209 70.886.381 106.254.019 6.093-.248 8.768-.99 9.065a4 4 0 0 1-.412.215v27.255c1.491-.416 2.45-5.919 3.21-16.919.753-10.899.717-21.798.682-32.78-.008-2.345-.016-4.694-.016-7.047.007-21.01-.009-42.02-.026-63.03-.029-35.015-.057-70.03.026-105.044.075-31.952.27-63.84.466-95.748.105-17.065.209-34.136.296-51.224.228-44.285.418-88.57.59-132.855.152-35.963.304-72.223-.819-107.591-.837-26.75-2.76-38.044-6.3-37.746-1.302.164-2.598.825-3.891 1.484-1.052.537-2.102 1.072-3.152 1.339-2.398.743-4.778 1.338-7.157.892-1.46-.26-2.923-.998-4.387-1.736-1.895-.957-3.792-1.915-5.682-1.83-5.537.278-11.065 1.138-16.591 1.998-3.309.515-6.617 1.03-9.925 1.42-5.306.578-10.611 1.116-15.915 1.655C256.909 6.36 245.744 7.495 234.574 9M2.571 166.073h-.323c-.058-12.906-.111-25.851-.164-38.814-.052-12.561-.104-25.14-.16-37.719-.025-4.854-.034-9.708-.042-14.563q-.005-3.64-.015-7.282c-.019-11.145 0-11.294 1.675-9.66l-.485 54.018z" clip-rule="evenodd"></path></svg>
            <Contentuser>
            <MarginTitle>
            <h3>{Title}</h3>
            <p>{Description}</p>
 
            </MarginTitle>
    
    
            <Overflow>
            {children}
            </Overflow>
            </Contentuser>
        </CardInfo>
        </>
    )
}


/// sty


 
 
interface ImagePropA {
  ImageProp: string;
}

const Overflow = styled.div`
   
  display: flex;
   flex-direction: column;
   align-items: center; 
   justify-content: center;

   .xcnjd{
    margin-bottom: 3em;
    }

    .M23{
    max-width: 200px;
    width: 100%;
    margin-top: 0.6em;
    margin-bottom: 1.3rem;
    color: rgba(146, 149, 160, 0.986);
    opacity: 0.8;
  }

   li{
    display: inline-flex;
   flex-direction: row;
   align-items: center; 

   h5{
    font-size: 17px;
    font-family: "XcSemibold";
    color: rgb(194, 201, 206);
    display: block;
    margin-block-start: 0.4em;
    margin-block-end: 0.5em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: 400;
    unicode-bidi: isolate;
   }
   }

    

  h4{
    font-family: "Graffiti";
    font-size: 32px;
    color: rgb(255, 255, 255);
    display: block;
    margin-block-start: 0.4em;
    margin-block-end: 0.5em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: 400;
    unicode-bidi: isolate;
  }


  .button{

    background: url(/icons/button/button-bg.svg) center center / contain no-repeat;
    color: rgb(31, 226, 96);
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.8em 3em 0.8em;
    transition: ease .2s;
    cursor:  var(--f-cursor-pointer);
    text-decoration: unset;
   transition: 1s all;
   align-items: center;
  
   h4{
    font-size: 15px;
    font-family: 'Inter', monospace;
    color: #e4dbdb;
    font-weight: 900;

   }
  
   &:hover{
     
     h4{
      color: white;
     }

  }
  }
  svg{
    min-width: 20px;
    width: 20px;
    height: 20px;
    color: rgb(61, 61, 61);
  }

  @keyframes Buttonmso {
    0%{
      opacity: (0);
    }

    100%{
      opacity: (1);
    }
   }

   
`;

const MarginTitle = styled.div`

   padding: 1em 1em 0; 
   margin-top: 0;
 
   display: flex;
   flex-direction: column;
   align-items: center;
   text-align: center;
`;

const CardInfo = styled.div<ImagePropA>`
  width: 100%;
  background-image: ${({ ImageProp }) => `url('${ImageProp}')`};
  background-size:cover;
  position: relative;
  background-repeat: no-repeat;
  transition: 1s all;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

   &:hover{
 
    .xcnjd{
      margin-bottom: 0;
    }
   }


    
   .Grsjg {
    position: absolute;
    top: -4px;
    width: 100%;
    z-index: 1;
    height: 100%;
    color: rgb(170, 170, 170);
    pointer-events: none;
}

   .Hnshd{
    width: 90%;
    margin-bottom: 0.9rem;
    color: rgb(170, 170, 170);
    opacity: 0.8;
   }
`;


const Contentuser = styled.ul`
    padding: 1em 0em 1em;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(24px);
    background-color: rgba(7, 6, 6, 0.486);

    display: flex;
  flex-direction: column;
  justify-content: center;
   h3{
    font-weight: 400;
    text-transform: capitalize;
    color: rgb(225, 229, 238);
    font-size: 35px;
 
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
      color: #8e8e96;
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
`;
