'use client'
import styled, {createGlobalStyle} from "styled-components";

 

export const GlobalError = createGlobalStyle`
  
  body,html, #root {
  background-color: #030303;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  color: #c3c7cc;
  } 
   
  .hover:hover{
       background: rgba(160,162,163,0.16290266106442575);
       border-radius: 12px;
  } 
      
 ::-webkit-scrollbar {
  display: none;
  
  }

 ::selection{
  display: none;
 }


`;
export const StyleStore = createGlobalStyle`
  html,body, #root{
   
    background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
    position: fixed;
    font-family: 'Poppins', sans-serif;
    height: 100%;
    width: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    scroll-behavior: smooth;
   }

`;

export const ContainerINFO = styled.div`
display: flex;
padding: 0.3em 1em 0.3em;
align-items: center;
justify-content: space-between;
width: 100%;

.logo{
  opacity: 0.7;
  filter: brightness(0.1);
}

.topd{
    background-color: rgba(219, 218, 226, 0.034);
    padding: 0.4em 1em 0.4em;
    border-radius: 48px;
    
   a{
    font-size: 11px;
    margin: 0.3em;
    color: rgb(40, 41, 43);
    padding: 0.3em 0.9em 0.3em;
    font-family: 'Inter', sans-serif;

    &:hover{
        background-color: rgba(54, 55, 59, 0.288);
        border-radius: 22px;
        padding: 0.3em 0.9em 0.3em;
        color: #ced1df;
    }
   }
  }

ul{
  align-items: center;
  justify-content: space-evenly;
  display: inline-flex;
 
  a{
      font-size: 12px;
      padding: 0 1em 0;
      color: rgb(80, 83, 87);
  }

  hr{
    transform: rotate(-90deg);
  }
}
`;


export const CardViewList = styled.div`
      
  padding: 0.8em;
  border-radius: 22px;
  width: 100vw;
  overflow-x: auto;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: var(--f-cursor-grab);
  position: relative; /* Adicione isso para posicionar os pseudo-elementos */

  :active {
    cursor: var(--f-cursor-grabbed);
  }
   
  `;
  
  

export const ContainerTOPS = styled.nav`

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;

 
   .li{
     display: flex;
     flex-wrap: wrap;
     align-items: center;
      
  

     .dsf{
        display: flex;
         
        flex-direction: column;
      
        
      h5{
        text-align: start;
        font-size: 12px;
        font-family: 'Graffiti';
        text-size-adjust: 1;
        color: rgba(8, 255, 119, 0.918);
      }

     
     }
  }


  li,ul{
    display: inline-flex;
    align-items: center;
    justify-content: space-between;

        
  .Mobile{
    display: none;
  }
  
  }
   
  .logoma{  
 
    transition: 0.9s all;
    margin-left: 0.8em;
  }
  .link{
   padding: 0.7em 0.8em 0.7em;
   border-radius: 50%;
   margin: 0.1em;
   font-size: 14px;
   display: inline-flex;
   align-items: center;
   cursor:  var(--f-cursor-pointer);
   color: rgb(66, 67, 75);
   transition: 0.8ms all;

   &:hover{
    background-color: rgba(89, 89, 94, 0.055);
   }

 
  }


  @media screen and (max-width: 490px) {
    li{
     
    .Mobile{
      display: block;
    }
    }
    
    .li{
      .dsf{
      display: none;
    }

    }
   
    
  }
`;

export const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;

.Imagecenter{
  max-width: 340px;
  max-height: 504px;
}
`;
export const ImagePackage = styled.div`
  height: 30em;
  width: 30em;
`;
export const Display = styled.div`
display: flex;
align-items: center;
`;

export const Button = styled.button`
 background-color: rgba(103, 106, 109, 0.151);
 padding: 0.2em 0.4em 0.2em;
 height: 38px;
 width: 38px;
 margin: 0.7em;
 border-radius: 12px;
   top: 1px;
   right: 1em;
   position: absolute;

 i{
    color: #706f8194
 }
`;

export const ModalLogin = styled.div`
  position: fixed;
  max-height: 30%;
  width: 20%;
  z-index: 99999;
  border-radius: 19px 19px 0 0;
  right: 1px;
  bottom: 1px;
  overflow-y: auto;
 
  background-repeat: no-repeat;
  background-size: cover;
  display: grid;
  justify-content: center;
  animation: TopANIME 0.5s linear;

  @keyframes TopANIME {
     0%{ transform: translateY(100%)}
     100%{ transform: translateY(0%)}
  }

  button h4{

    font-size: 16px;
    font-family: 'Inter', monospace;

  }
`;


export const CardInfo = styled.div`

  padding: 1em;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  border-radius: 22px;
  margin-top: 12%;

  
  h1{
    font-family: 'Poppins', sans-serif;
    color: aliceblue;
    font-size: 39px;
  }

 p{
    font-family: 'Poppins', sans-serif;
    color: #666c70;
    font-size: 12px;
  }

  img{
    margin-bottom: 19%;
  }

  .imagecenter{
     opacity: 0.3;
  }

  .buttonclik{
    background-color: #16bd61;
    padding: 1em 2em 1em;
    color: black;
    font-family: 'Poppins', sans-serif;
    border-radius: 52px;
    font-size: 14px;
    margin-top: 8%;
    display: inline-flex;
    align-items: center;
    transition: 0.8s all;

    i{
      margin-left: 1em;
      margin-top: 0.3em;
    }

    &:hover {
        background-color: #217043;
        color: #141313;
      i{
        animation: rotates 0.9s linear;
        color: #0c0b0b;
    }
  }
  }
  
  @keyframes rotates {
    0%{ transform: scale(0)}
    100%{ transform: scale(0.8) }
  }


  span{
    background-color: rgba(192, 204, 197, 0.11);
    padding: 0.9em 1em 0.9em;
    border-radius: 12px;
    margin: 11%;
    font-family: 'Poppins', sans-serif;
    color: #c8d1cc;
  }
`;


export const InfoLogged = styled.div`
   padding: 0.3em 0.9em 0.3em;
   border-radius: 10px;
   color: #080303;
   font-size: 14px;
 
    .logo{
    border-radius: 92px;
    margin: 0.3em;
   }
    
   button{
    cursor: text;
   }

   ul{
    display: flex;
    flex-direction: column;
   }
     li{
  
    width: 100%;
    display: flex;
    flex-direction: row;
     
    transition: 0.9s all;
    justify-content: space-evenly;
   }
  
  
    
   h6{
      font-size: 9px;
      color: #73737a;
      max-width: 60px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
    }

   h1{
    font-size: 13px;
    color: rgb(213, 213, 219);
   font-family: 'Inter', sans-serif;
   max-width: 60px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
     }
     
   span{
    display: flex;
   flex-direction: row;
   align-items: center;
   
   h4{ 
    font-family: 'Inter', sans-serif;
    color: rgb(110, 111, 122);
   }

   .icon{
    margin-left: 0.3em;
    margin-top: 0.1em;
    color: rgb(66, 67, 75);
   }
   }
`;


export const ButtonClick = styled.button`
     font-size: 11px;
    margin: 0.3em; 
    color: rgb(40, 41, 43);
    padding: 0.3em 0.9em 0.3em;
    font-family: 'Inter', sans-serif;

    &:hover{
        background-color: rgba(54, 55, 59, 0.288);
        border-radius: 22px;
        padding: 0.3em 0.9em 0.3em;
        color: #ced1df;
    }
  
   h4{ 
    font-family: 'Inter', sans-serif;
    color: rgb(110, 111, 122);
   }

   &:hover h4{
    color: #323336;
   }

 
`;


export const ButtonCart = styled.button`
  background-color: rgba(150, 151, 158, 0.082);
  height: 35px;
  width: 35px;
  border-radius: 9px;
  
  span{
    position: absolute;
    background-color: #28292e;
    color: #fff;
    margin-top: -0.9em;
    border-radius: 4px;
    padding: 0px 5px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.7rem;
  }
  
  
`;


//// CARD CART MODAL 
export const ModalCart = styled.div`
  height: 100%;
  width: 100%;
  background-color: #0a0a0a2d;
  float: right;
  position: fixed;
  display: flex;
  justify-items: left;
  top: 1em; 
  bottom: 1;
`;

export const ButtonClose = styled.button`
   height: 40px;
   width: 40px;
   border-radius: 29px;
   background-color: rgba(204, 209, 212, 0.171);
   font-family: 'Poppins', sans-serif;
`;

export const Ncart = styled.div`
  position: fixed;
  right: 1em;
  border-left: 1px solid #4040474e;
  font-family: 'Poppins', sans-serif;
  font-display: initial; 
  color: rgba(74, 72, 80, 0.247);
  background-color: #050508;
  padding: 1em;
  border-radius: 12px;
`;

/////////////////////////////////

export const CardPackage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: space-evenly;

  @media screen and (max-width: 430px) {
    display: flex;
  flex-direction: column;
  align-items: center;
  
  }
`;

export const TopInfoprice = styled.h1`
  font-family: 'Europa Grotesk';
  color: #00ff62;
  opacity: 0.7;
  font-size: 38px;

  @media screen and (max-width: 430px) {
    font-size: 28px;
  }
`;

export const Imagepackage = styled.div`
   background-color: rgba(34, 34, 36, 0.158);
   height: 60%;
   width: 60%;
   border-radius: 12px;
`;


export const ImageCx = styled.div`
  display: flex;
  flex-direction: column;
`;


////////////////////////////////

export const MarginList = styled.div`
   margin: 4%;
   h3{
    font-size: 12px;
    color: rgb(91, 92, 99);
   }
`;

export const ModalCartX = styled.div`
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: row;
    align-items: top;
    flex-wrap: wrap;
    flex-flow: wrap;
    justify-content: center;
    place-items: center;
    padding: 4%;
    width: 100%;  

    @media screen and (max-width: 430px) {
     display: flex;
     flex-direction: column; 
     justify-content: center;
     width: 100vw;
    }

`; 

export const CardModal = styled.div`
 
   max-height: 90%;
   width: 50%;
   border-radius: 22px; 
   padding: 1em 2em 1em;
   bottom: 0;
   right: 1em;
   overflow-y: auto;
   animation: AnimateJ 0.3s linear;

   @keyframes AnimateJ {
    0%{ transform: scale(0) }
    100%{ transform: scale(0.8) }
   }

   @media screen and (max-width: 430px) {
     width: 100vw; 
     margin-left: -2em;
   }
`;


export const TopViewCart = styled.div`
   display: inline-flex;
   align-items: center;
   justify-content: space-between;
   width: 100%;
   margin-bottom: 0.8em;
   
   h2{
    font-family: 'Graffiti';
    line-height: 4.2;
    font-size: 19px;
    color: rgba(67, 99, 78, 0.274);
   }
`;


export const MarginCart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  place-items: center;
  height: 53vh;

  h3{
    font-family: 'Inter', sans-serif;
    color: rgba(223, 225, 233, 0.274);
    font-weight: 300;
    
  }

  i{
    font-size: 84px;
    color: rgba(178, 179, 182, 0.274);
  }
`;

export const MarginCartItem = styled.div`
  overflow-y: auto;
  padding: 0.4em 1em 0.4em;
  border-radius: 12px;
  background-image: url('/icons/084mnfgjhdgdfyt4n.png');
  background-color: rgba(211, 214, 218, 0.048);
  height: 60%;
  width: 100%;
  margin-bottom: 5%; 

  h3{
    font-family: 'Inter', sans-serif;
    color: rgba(166, 167, 175, 0.274);
  }

    @media screen and (max-width: 430px) { 
    width: 90vw;
   }
`;

 
export const MarginDc = styled.div`
  padding: 0.4em 0.7em 0.4em;
  border-radius: 12px;
  margin: 0.9%;
 
  background-image: url('/icons/084mnfgjhdgdfyt4n.png');
  background-color: rgba(245, 250, 255, 0.055);
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

   @media screen and (max-width: 430px) { 
    width: 90vw;
   }

`;

 
export const Viewprice = styled.div`
 display: flex;
 align-items: center; 
 border-bottom: 1px solid rgba(66, 66, 68, 0.116);
 width: 100%;
 justify-content: space-between;
 padding: 0.8em 0.6em 0.8em;
 margin: 0.3em;
 margin-bottom: 1em;
 border-radius: 12px;
 display: flex;
 justify-content: space-between;
 align-items: center;

 p{
  font-size: 18px;
  color: #d6cbcb;
 }

 h4{
  color: white;
 }

 ul{
  padding: 0.2em 0.8em 0.2em;
  border-radius: 9px;
  margin-left: 0.3em;
  background-color: rgb(7, 6, 6);
 }
`;

///// 

export const ClickMod = styled.div`
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: row;
`;


export const ContainerN = styled.div`
width: 100vw;
display: flex;
justify-content: center;
place-items: center;
flex-direction: column;
 margin-bottom:2em;
 margin-top: 2em;
text-align: center;


p{
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 12px;
  margin: 0.4em;
  color: #676a6d;
}
`;


/////////// FOOTER 

export const CardLanguage = styled.div` 
  display: flex;
  align-items: center;
  border: 1px solid rgba(93, 98, 104, 0.315);
  padding: 0.2em 0.5em 0.2em;
  border-radius: 8px;
  width: 100%;

  h6{
    font-family: 'ProximaNova-Italic';
    font-size: 10px;
    color: #94989c;
    margin: 0.4em;
  }
  
 
`;
 
export const Footer = styled.footer`

padding: 1em 5em 0.1em; 
  text-align: center;

  @media screen and (max-width: 540px) {
    padding: 1em 1em 1em;
  }

   @media screen and (min-width: 390px) and (max-width: 430px) {
    padding: 1em 0em 1em;
   }

   
   .powered{
    justify-content: center;
    display: flex;
    align-items: center;

   h5{
    font-family: 'ProximaNova-Italic', sans-serif;
    font-size: 14px;
    color: silver;
    margin: 0.4em;
   }    

   .logonvx{
    height: 30px;
   }
 
   }
   
   li{

    h6{
        font-family: 'ProximaNova-Italic';
        font-size: 9px;
        color: #4c4e50;
    }
   }

   .disp{
    opacity: 0.2;
   }

   
  `;
 
export const MarginTop = styled.div`
  
    button{
    background-color: rgba(38, 38, 41, 0.247);
    border-radius: 50%;
    height: 38px;
    width: 38px;
    padding: 0.5em 0.7em 0.3em;
    margin: 0.3em;
    
    i{
      color: #909197;
    }

    &:hover{
      background-color: rgba(53, 53, 58, 0.247);

      i{
      color: #858a8f;
    }
    }
  }

  
  ul{
    display: inline-flex;
    align-items: center;

    p{
    font-size: 8px;
    font-family: 'ProximaNova-Italic';
    font-weight: 300;
    color: #91969b;
    }

    i{
        font-size: 12px;
        margin-top: 0.1em;
    }

    .dotred{
        color: red;
    }

    .dotgreen{
        color: #39e439;
    }
   }


   @media screen and (max-width: 430px) {
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
    
  }
`;


export const ContentList = styled.div`
      display: flex;
     flex-wrap: wrap;
     align-items: center;
     width: 100%;
     margin-bottom: 1%;
     justify-content: space-between;
     background-color: rgba(35, 35, 37, 0.123);
     padding: 2em;
     border-radius: 19px;
    
      span{
    display: inline-flex;
    align-items: center;
   }

     .line{
        text-decoration: underline;
     }
    li{
        margin: 0.5em;
        display: flex;
        flex-direction: column;
    }
    
    h4{
        font-family: 'ProximaNova-Italic';
        font-size: 11px;
        text-align: start;
        margin-bottom: 0.4em;
    }

    span{
        text-align: left;
      margin-bottom: 0.1em;
      color: #65656d;
      font-size: 11px;
      cursor:  var(--f-cursor-pointer);
      font-family: 'ProximaNova-Italic';

      &:hover{
        color: #2fe45c;
      }
    }


    @media screen and (max-width: 540px) {
      span{
        margin: 0.2em;
      
      }
   
 }

 @media screen and (max-width: 430px) {
  display: grid;
    grid-template-columns: repeat(2, 2fr);
    grid-template-rows: auto;
    grid-gap: 1rem;
   
  }

   @media screen and (min-width: 360px) and (max-width: 380px) {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: auto;
    grid-gap: 1rem;
   }

    

`;

export const Content = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex-flow: row;
  flex-wrap: wrap;
  margin-bottom: 0.8em;
   
  a{
    display: flex;
    align-items: center;
    justify-content: baseline;
  }
   .list{
    font-size: 11px;
    margin: 0.3em;
    color: #767a7e;
   }

   
  @media screen and (max-width: 540px) {
     display: flex;
     justify-content: center;

     .disp{
     margin-top: 0.7em;
     }
    }
   
`;




////////////////////////////////







export const MarginXC = styled.div`
  display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
   
    padding: 1em 9em 1em;
    justify-content: space-between;


    @media screen and (max-width: 430px)  {
      display: flex;
 
      padding: 1em 2em 1em;
    flex-direction: column;
    justify-content: center;
 

    }

`;


export const Conyent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.9em 1em 0.9em;

    a{
      color: #1d1e20;
      margin: 0.4em;
      font-size: 12px;
     font-family: 'InterSemiBold', monospace;
   }

   @media screen and (max-width: 430px)  {
      display: flex;
    align-items: center;
    flex-wrap: wrap;
    position: absolute;
    bottom: 2px;
    
     
    }
`;
export const Marginfooter = styled.div`
  height: 40vh;
  width: 100vw;
  background-color: #07ff8b;
  position: fixed;
  bottom: 1px;
`;
export const ButtonNox = styled.button`
  margin: 2em;
 padding: 0.9em 3em 0.9em;
 border-radius: 52px;
 font-size: 15px;
 font-family: 'ProximaNova-', sans-serif;
 color: #d5d6db;
 border: 2px solid rgba(209, 209, 209, 0.822);
 transition: 0.9s all;

 &:hover{
   position: relative;
   top: -1px;
   border: 2px solid rgba(209, 209, 209, 0.822);
   background: rgba(209, 209, 209, 0.822);;
   color: rgb(0, 0, 2);
 }
`;

export const ContainerNox = styled.div`

    z-index: 1999;
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    place-items: center;

  
`;


export const Card = styled.div` 
  max-width: 490px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;

  h1{
     color: #cfd3dbf4;
     text-align: start;
     font-size: 59px;
     max-width: 490px;
     font-family:  'Inter', sans-serif;

  }


  p{
    color: #afb7be6f;
    font-size: 15px;
    text-align: start;
    max-width: 490px;
    font-family: 'ProximaNova-', sans-serif;
  }


  @media screen and (max-width: 430px)  {
      display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 0.9em;

    h1{
      font-size: 29px;
    }
    
    }
`;


///////////////////////////////////

export const Containercenter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: top;
  flex-wrap: wrap;

  
 
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  background: linear-gradient(204deg, #5cffdc40 -7%, #b85cff00 33%), linear-gradient(162deg, #23e78c40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(71, 71, 78, 0.075));
  padding: 1em;
  border-radius: 12px;
  margin: 0.4em;
  text-align: center;
  align-items: center; 
  justify-content: center;

  h2{
   font-family: 'Europa Grotesk';
   font-size: 24px;
   color: #c6c7ced6;
  }


  p{
    max-width: 390px;
    text-align: start;
    font-family: 'ProximaNova-Italic', sans-serif;
    font-size: 13px;
    margin-bottom: 1%;
  }



  
  button{
      background: linear-gradient(204deg, #5cffdc40 -7%, #b85cff00 33%), linear-gradient(162deg, #23e78c40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(71, 71, 78, 0.075));
 
   padding: 1em 2em 1em;
   border-radius: 48px;
   font-size: 14px;
   font-family: 'Europa Grotesk';
   box-shadow: -11px 18px 1px black;
   color: #cdd8d3ec;
  
   position: relative;
   z-index: 1;
   
   transition: 1s all;
   border: 2px solid #09090a;
   
   &:hover{
    box-shadow: -1px 13px 11px black;
    transform: scale(1.1);
    border: 2px solid #110f0f2b;
   }
 

   @media screen and (max-width: 280px){
      margin-left: -6em;
      font-size: 13px;
  }

    }
    
`;
